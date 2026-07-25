import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './SectionCardapio.module.css';

gsap.registerPlugin(ScrollTrigger);

// ------------------------------------------------------------
// CONFIGURAÇÃO DOS SPRITE SHEETS
// Precisa bater exatamente com o comando ffmpeg usado pra gerar
// os sheets (filtro `tile=COLSxROWS`).
// ------------------------------------------------------------
const TOTAL_FRAMES = 103; // atualize depois de recalcular o fps com ffprobe
const GRID_COLS = 6;
const GRID_ROWS = 5;
const FRAMES_PER_SHEET = GRID_COLS * GRID_ROWS; // 30, no exemplo
const TOTAL_SHEETS = Math.ceil(TOTAL_FRAMES / FRAMES_PER_SHEET);

// Resolução de CADA FRAME dentro do sheet — precisa bater com o
// crop/scale usado no ffmpeg pra gerar os frames originais.
const FRAME_SIZE = {
desktop: { width: 1280, height: 720 },
mobile: { width: 720, height: 1280 },
};

// Mesmo breakpoint de 900px já usado nos outros módulos CSS do projeto.
const MOBILE_BREAKPOINT = '(max-width: 900px)';

// 'normal' = sheet 0 carrega primeiro, frames tocam na ordem gravada (0 → fim).
// 'reverse' = último sheet carrega primeiro, frames tocam de trás pra frente (fim → 0).
const PLAYBACK_DIRECTION = 'reverse'; // 'normal' | 'reverse'

// O ffmpeg (com output %02d) numerou os sheets em 2 dígitos começando em 01
// (sheet_01.webp, sheet_02.webp...), enquanto sheetIndex no código é
// 0-based (0, 1, 2...) — por isso o (sheetIndex + 1) aqui.
const sheetPath = (sheetIndex, device) =>
`${import.meta.env.BASE_URL}frames/${device}/sprites/sheet_${(sheetIndex + 1)
    .toString()
    .padStart(2, '0')}.webp`;

export default function SectionCardapio() {
const containerRef = useRef(null);
const canvasRef = useRef(null);
const [imagesLoaded, setImagesLoaded] = useState(false);
const sheetsRef = useRef([]);
// Ref espelhando o "pronto pra desenhar" (só precisa do sheet 0 carregado,
// não de todos), usado dentro do onUpdate sem closure velha.
const readyRef = useRef(false);

useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    // Decide UMA VEZ, no mount, qual conjunto (device) usar. Não reagimos
    // a resize/orientationchange depois disso de propósito: trocar no meio
    // do carregamento ou do scrub obrigaria a descartar e recarregar tudo.
    const device = window.matchMedia(MOBILE_BREAKPOINT).matches ? 'mobile' : 'desktop';
    const { width: frameWidth, height: frameHeight } = FRAME_SIZE[device];

    // Canvas do tamanho exato de UM frame — como os frames já saíram do
    // ffmpeg pré-cortados (cover/center) na resolução certa, não precisamos
    // mais calcular ratio/letterbox no render, é um drawImage 1:1.
    canvas.width = frameWidth;
    canvas.height = frameHeight;

    const sequence = { frame: 0 };

    const render = () => {
    const sheetIndex = Math.floor(sequence.frame / FRAMES_PER_SHEET);
    const frameInSheet = sequence.frame % FRAMES_PER_SHEET;

    const sheet = sheetsRef.current[sheetIndex];
    if (!sheet || !sheet.complete) return; // sheet ainda não chegou — mantém o último frame desenhado

    const col = frameInSheet % GRID_COLS;
    const row = Math.floor(frameInSheet / GRID_COLS);

    const sx = col * frameWidth;
    const sy = row * frameHeight;

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(
        sheet,
        sx,
        sy,
        frameWidth,
        frameHeight,
        0,
        0,
        canvas.width,
        canvas.height
    );
    };

    // ------------------------------------------------------------
    // 1) ScrollTrigger / pin: criado IMEDIATAMENTE.
    // O end (+=300%) não depende dos sheets, então o espaço de
    // scroll reservado na página fica correto desde o primeiro
    // ScrollTrigger.refresh() global (chamado no App.jsx).
    // ------------------------------------------------------------
    const trigger = ScrollTrigger.create({
    trigger: containerRef.current,
    start: 'top top',
    end: '+=300%',
    pin: true,
    scrub: 1,
    onUpdate: (self) => {
        if (!readyRef.current) return; // ainda não tem nem o sheet inicial

        const rawFrame = Math.min(
        TOTAL_FRAMES - 1,
        Math.floor(self.progress * TOTAL_FRAMES)
        );

        // No modo reverse, progress 0 (topo do scroll) corresponde ao
        // ÚLTIMO frame gravado, e progress 1 (fim do scroll) ao primeiro.
        sequence.frame =
        PLAYBACK_DIRECTION === 'reverse' ? TOTAL_FRAMES - 1 - rawFrame : rawFrame;

        render();
    },
    });

    // ------------------------------------------------------------
    // 2) Preload dos SHEETS (não mais frame a frame). Como agora são
    // poucos arquivos (TOTAL_SHEETS, ex: 4 em vez de 103), a pressão
    // sobre a banda já cai bastante sozinha — mesmo assim mantemos o
    // batching + fetchPriority baixa, por segurança e escalabilidade
    // caso você aumente TOTAL_FRAMES no futuro.
    // ------------------------------------------------------------
    const MAX_CONCURRENT = 3;

    const loadOneSheet = (sheetIndex) =>
    new Promise((resolve) => {
        const img = new Image();
        img.fetchPriority = 'low';
        img.src = sheetPath(sheetIndex, device);
        img.onload = () => resolve(img);
        img.onerror = () => resolve(img); // não trava o lote se um sheet falhar
    });

    let cancelled = false;

    const preloadSheets = async () => {
    const loadedSheets = new Array(TOTAL_SHEETS);

    // Ordem de carregamento: no modo normal, começa do sheet 0 (primeiro
    // frame da gravação). No reverse, começa do ÚLTIMO sheet, já que é
    // ele que contém o frame inicial exibido nesse modo.
    const loadOrder =
        PLAYBACK_DIRECTION === 'reverse'
        ? Array.from({ length: TOTAL_SHEETS }, (_, i) => TOTAL_SHEETS - 1 - i)
        : Array.from({ length: TOTAL_SHEETS }, (_, i) => i);

    const [firstSheetIndex, ...restOrder] = loadOrder;

    // Carrega o sheet inicial sozinho, com prioridade normal, pra já
    // poder desenhar o frame inicial o quanto antes.
    const first = new Image();
    first.src = sheetPath(firstSheetIndex, device);
    await new Promise((res) => {
        first.onload = res;
        first.onerror = res;
    });
    loadedSheets[firstSheetIndex] = first;
    sheetsRef.current = loadedSheets;
    readyRef.current = true;
    setImagesLoaded(true); // já dá pra tirar o overlay de loading
    render();

    for (let i = 0; i < restOrder.length; i += MAX_CONCURRENT) {
        if (cancelled) return;

        const batch = restOrder.slice(i, i + MAX_CONCURRENT);
        const results = await Promise.all(batch.map(loadOneSheet));

        batch.forEach((sheetIndex, j) => {
        loadedSheets[sheetIndex] = results[j];
        });
        sheetsRef.current = loadedSheets;
    }
    };

    // ------------------------------------------------------------
    // 3) Gatilho de preload: ScrollTrigger apontando pra um ponto de
    // ancoragem DENTRO da Section2 (não pra própria SectionCardapio).
    //
    // Pré-requisito: adicione id="s2PreloadAnchor" em algum elemento
    // "calmo" da Section2 (ex: perto do fim da esteira, pra não competir
    // com as imagens dos cards principais da própria Section2).
    // ------------------------------------------------------------
    let preloadTrigger = null;
    const anchor = document.getElementById('s2PreloadAnchor');

    if (anchor) {
    preloadTrigger = ScrollTrigger.create({
        trigger: anchor,
        start: 'top bottom',
        once: true,
        onEnter: preloadSheets,
    });
    } else {
    // Fallback de segurança: se o anchor não existir, volta pro
    // comportamento baseado na própria seção.
    preloadTrigger = ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top bottom+=300',
        once: true,
        onEnter: preloadSheets,
    });
    }

    return () => {
    cancelled = true;
    if (preloadTrigger) preloadTrigger.kill();
    trigger.kill();
    };
}, []);

return (
    <section ref={containerRef} className={styles.root}>
    <div className={styles.stickyWrapper}>
        <canvas ref={canvasRef} className={styles.canvas} />
        {!imagesLoaded && (
        <div className={styles.loadingOverlay} aria-hidden="true">
            {/* opcional: spinner / skeleton enquanto o primeiro sheet baixa */}
        </div>
        )}
    </div>
    </section>
);
}