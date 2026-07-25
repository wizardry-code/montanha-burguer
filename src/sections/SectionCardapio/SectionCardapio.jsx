import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './SectionCardapio.module.css';

gsap.registerPlugin(ScrollTrigger);

const TOTAL_FRAMES = 240;

const currentFrame = (index) =>
`${import.meta.env.BASE_URL}frames/frame_${(index + 1).toString().padStart(4, '0')}.webp`;

export default function SectionCardapio() {
const containerRef = useRef(null);
const canvasRef = useRef(null);
const [imagesLoaded, setImagesLoaded] = useState(false);
const imagesRef = useRef([]);
// Ref espelhando o state, pra usar dentro do onUpdate sem closure velha
// e sem precisar recriar o ScrollTrigger toda vez que imagesLoaded mudar.
const imagesLoadedRef = useRef(false);

useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    canvas.width = 1920;
    canvas.height = 1080;

    const sequence = { frame: 0 };

    const render = () => {
    const img = imagesRef.current[sequence.frame];
    if (!img || !img.complete) return;

    context.clearRect(0, 0, canvas.width, canvas.height);

    const hRatio = canvas.width / img.width;
    const vRatio = canvas.height / img.height;
    const ratio = Math.max(hRatio, vRatio);
    const centerShift_x = (canvas.width - img.width * ratio) / 2;
    const centerShift_y = (canvas.height - img.height * ratio) / 2;

    context.drawImage(
        img,
        0,
        0,
        img.width,
        img.height,
        centerShift_x,
        centerShift_y,
        img.width * ratio,
        img.height * ratio
    );
    };

    // ------------------------------------------------------------
    // 1) ScrollTrigger / pin: criado IMEDIATAMENTE.
    // O end (+=300%) não depende das imagens, então o espaço de
    // scroll reservado na página fica correto desde o primeiro
    // ScrollTrigger.refresh() global (chamado no App.jsx).
    // Isso evita o "jump" de altura que acontecia quando o pin só
    // nascia depois que TOTAL_FRAMES imagens terminavam de carregar.
    // ------------------------------------------------------------
    const trigger = ScrollTrigger.create({
    trigger: containerRef.current,
    start: 'top top',
    end: '+=300%',
    pin: true,
    scrub: 1,
    onUpdate: (self) => {
        // Enquanto os frames não chegaram, não tem o que desenhar.
        if (!imagesLoadedRef.current) return;

        sequence.frame = Math.min(
        TOTAL_FRAMES - 1,
        Math.floor(self.progress * TOTAL_FRAMES)
        );
        render();
    },
    });

    // ------------------------------------------------------------
    // 2) Preload dos frames em LOTES (concorrência limitada), com
    // prioridade baixa. Em vez de disparar as 240 requisições de
    // uma vez (o que satura a banda e atrasa imagens visíveis de
    // outras seções), carregamos MAX_CONCURRENT por vez.
    //
    // fetchPriority='low' avisa o navegador explicitamente que
    // esses recursos podem ceder banda pra quem precisa mais agora
    // (suportado em Chrome/Edge; em navegadores sem suporte, a
    // propriedade é simplesmente ignorada, sem quebrar nada).
    // ------------------------------------------------------------
    const MAX_CONCURRENT = 6;

    const loadOneFrame = (index) =>
    new Promise((resolve) => {
        const img = new Image();
        img.fetchPriority = 'low';
        img.src = currentFrame(index);
        img.onload = () => resolve(img);
        img.onerror = () => resolve(img); // não trava o lote se um frame falhar
    });

    let cancelled = false;

    const preloadImages = async () => {
    const loadedImages = new Array(TOTAL_FRAMES);
    const indices = Array.from({ length: TOTAL_FRAMES }, (_, i) => i);

    // Carrega o frame 0 primeiro e sozinho, com prioridade normal,
    // pra garantir que algo aparece no canvas o quanto antes.
    const first = new Image();
    first.src = currentFrame(0);
    await new Promise((res) => {
        first.onload = res;
        first.onerror = res;
    });
    loadedImages[0] = first;
    imagesRef.current = loadedImages;
    render();

    const rest = indices.slice(1);

    for (let i = 0; i < rest.length; i += MAX_CONCURRENT) {
        if (cancelled) return;

        const batch = rest.slice(i, i + MAX_CONCURRENT);
        const results = await Promise.all(batch.map(loadOneFrame));

        batch.forEach((frameIndex, j) => {
        loadedImages[frameIndex] = results[j];
        });
        imagesRef.current = loadedImages;
    }

    if (!cancelled) {
        imagesLoadedRef.current = true;
        setImagesLoaded(true);
        render(); // garante que o frame correspondente ao progresso atual apareça
    }
    };

    // ------------------------------------------------------------
    // 3) Gatilho de preload: ScrollTrigger apontando pra um ponto de
    // ancoragem DENTRO da Section2 (não pra própria SectionCardapio).
    // Isso adianta o download dos 240 frames pra um momento em que
    // o usuário ainda está longe do canvas, sem depender de "distância
    // em pixels" (que seria instável numa seção com pin/scroll virtual).
    //
    // Pré-requisito: adicione id="s2-preload-anchor" em algum elemento
    // "calmo" da Section2 (ex: o .avaliacoesCard, no meio da esteira).
    //
    // once: true já garante que só dispara uma vez, sem precisar de
    // disconnect manual como no IntersectionObserver.
    // ------------------------------------------------------------
    let preloadTrigger = null;
    const anchor = document.getElementById('s2PreloadAnchor');

    if (anchor) {
    preloadTrigger = ScrollTrigger.create({
        trigger: anchor,
        start: 'left right',
        once: true,
        onEnter: preloadImages,
    });
    } else {
    // Fallback de segurança: se o anchor não existir (ex: mudou o id
    // e esqueceu de atualizar aqui), volta pro comportamento antigo
    // baseado na própria seção, pra não quebrar o carregamento.
    preloadTrigger = ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top bottom+=300',
        once: true,
        onEnter: preloadImages,
    });
    }

    return () => {
    cancelled = true; // interrompe o loop de lotes se ainda estiver rodando
    if (preloadTrigger) preloadTrigger.kill();
    trigger.kill();
    };
}, []); // roda uma única vez no mount — sem depender de imagesLoaded

return (
    <section ref={containerRef} className={styles.root}>
    <div className={styles.stickyWrapper}>
        <canvas ref={canvasRef} className={styles.canvas} />
        {!imagesLoaded && (
        <div className={styles.loadingOverlay} aria-hidden="true">
            {/* opcional: spinner / skeleton enquanto os 240 frames baixam */}
        </div>
        )}
    </div>
    </section>
);
}