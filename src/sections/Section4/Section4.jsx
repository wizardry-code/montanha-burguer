import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './Section4.module.css';
import { S2_HEAVY_PRELOAD_EVENT } from '../Section2/Section2';
import { debouncedRefresh } from '../../utils/gsapRefresh';
import { splitIntoWords } from '../../utils/textUtils';

gsap.registerPlugin(ScrollTrigger);

const TOTAL_FRAMES = 103;
const GRID_COLS = 6;
const GRID_ROWS = 5;
const FRAMES_PER_SHEET = GRID_COLS * GRID_ROWS;
const TOTAL_SHEETS = Math.ceil(TOTAL_FRAMES / FRAMES_PER_SHEET);

const FRAME_SIZE = {
desktop: { width: 1280, height: 720 },
mobile: { width: 720, height: 1280 },
};

const MOBILE_BREAKPOINT = '(max-width: 900px)';
const PLAYBACK_DIRECTION = 'reverse';

const sheetPath = (sheetIndex, device) =>
`${import.meta.env.BASE_URL}frames/${device}/sprites/sheet_${(sheetIndex + 1)
    .toString()
    .padStart(2, '0')}.webp`;

export default function Section4() {
const containerRef = useRef(null);
const canvasRef = useRef(null);
const textRef = useRef(null);
const [imagesLoaded, setImagesLoaded] = useState(false);
const sheetsRef = useRef([]);
const readyRef = useRef(false);

useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    const device = window.matchMedia(MOBILE_BREAKPOINT).matches ? 'mobile' : 'desktop';
    const { width: frameWidth, height: frameHeight } = FRAME_SIZE[device];

    canvas.width = frameWidth;
    canvas.height = frameHeight;

    const sequence = { frame: 0 };

    const render = () => {
    const sheetIndex = Math.floor(sequence.frame / FRAMES_PER_SHEET);
    const frameInSheet = sequence.frame % FRAMES_PER_SHEET;

    const sheet = sheetsRef.current[sheetIndex];
    if (!sheet || !sheet.complete || sheet.naturalWidth === 0) return;

    const col = frameInSheet % GRID_COLS;
    const row = Math.floor(frameInSheet / GRID_COLS);

    const sx = col * frameWidth;
    const sy = row * frameHeight;

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(sheet, sx, sy, frameWidth, frameHeight, 0, 0, canvas.width, canvas.height);
    };

    let cancelled = false;

    const ctx = gsap.context(() => {
    // 1) Criamos uma TIMELINE acoplada ao ScrollTrigger
    const tl = gsap.timeline({
        scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: '+=450%', // Aumentado ligeiramente para dar espaço aos textos + canvas
        pin: true,
        scrub: 1,
        },
    });

    // PASSO A: Animação dos Palavras (SplitText)
    const words = containerRef.current.querySelectorAll(`.${styles.word}`);
    if (words.length > 0) {
        tl.to(words, {
        opacity: 1,
        y: 0,
        stagger: 0.05,
        duration: 1,
        ease: 'power2.out',
        });
    }

    // PASSO B: Sequência do Canvas + Fade Out do Texto
    tl.to(
        sequence,
        {
        frame: TOTAL_FRAMES - 1,
        duration: 3,
        ease: 'none',
        onUpdate: () => {
            if (!readyRef.current) return;
            const currentFrame = Math.floor(sequence.frame);
            sequence.frame =
            PLAYBACK_DIRECTION === 'reverse'
                ? TOTAL_FRAMES - 1 - currentFrame
                : currentFrame;
            render();
        },
        },
        '+=0.2' // Pequeno delay após os textos aparecerem
    );

    // PASSO C: Efeito opcional de esvanecer textos conforme a plataforma cresce/preenche
    tl.to(
        textRef.current,
        {
        opacity: 0,
        y: -40,
        duration: 1,
        },
        '-=1.5' // Executa junto com a metade final da animação do canvas
    );

    // Fallback de segurança
    ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top bottom+=600',
        once: true,
        onEnter: handleS2Ready,
    });

    debouncedRefresh();
    }, containerRef);

    // 2) Preload de Imagens
    const MAX_CONCURRENT = 3;

    const loadOneSheet = (sheetIndex) =>
    new Promise((resolve) => {
        const img = new Image();
        img.fetchPriority = 'low';
        img.src = sheetPath(sheetIndex, device);
        img.onload = () => resolve(img);
        img.onerror = () => resolve(img);
    });

    const preloadSheets = async () => {
    const loadedSheets = new Array(TOTAL_SHEETS);

    const loadOrder =
        PLAYBACK_DIRECTION === 'reverse'
        ? Array.from({ length: TOTAL_SHEETS }, (_, i) => TOTAL_SHEETS - 1 - i)
        : Array.from({ length: TOTAL_SHEETS }, (_, i) => i);

    const [firstSheetIndex, ...restOrder] = loadOrder;

    const first = new Image();
    first.src = sheetPath(firstSheetIndex, device);
    await new Promise((res) => {
        first.onload = res;
        first.onerror = res;
    });
    loadedSheets[firstSheetIndex] = first;
    sheetsRef.current = loadedSheets;
    readyRef.current = true;
    setImagesLoaded(true);
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

    let scrollReached = false;
    let pageLoaded = document.readyState === 'complete';
    let started = false;

    const tryStartPreload = () => {
    if (started || !scrollReached || !pageLoaded) return;
    started = true;
    preloadSheets();
    };

    const handleWindowLoad = () => {
    pageLoaded = true;
    tryStartPreload();
    };
    if (!pageLoaded) {
    window.addEventListener('load', handleWindowLoad, { once: true });
    }

    function handleS2Ready() {
    scrollReached = true;
    tryStartPreload();
    }
    window.addEventListener(S2_HEAVY_PRELOAD_EVENT, handleS2Ready, { once: true });

    return () => {
    cancelled = true;
    window.removeEventListener('load', handleWindowLoad);
    window.removeEventListener(S2_HEAVY_PRELOAD_EVENT, handleS2Ready);
    ctx.revert();
    };
}, []);

return (
    <section ref={containerRef} className={styles.root}>
    <div className={styles.stickyWrapper}>
        {/* Canvas de Fundo */}
        <canvas ref={canvasRef} className={styles.canvas} />

        {/* Filtro Escuro / Cinemático */}
        <div className={styles.overlayCinematic} aria-hidden="true" />

        {/* Camada de Conteúdo Textual com Split */}
        <div ref={textRef} className={styles.contentGrid}>
        <div className={styles.titleBox}>
            <h2 className={styles.title}>
            {splitIntoWords('Nosso Cardápio Mágico e Interativo', styles.word)}
            </h2>
        </div>
        <div className={styles.descriptionBox}>
            <p className={styles.description}>
            {splitIntoWords(
                'Explore combinações únicas, ingredientes selecionados e uma experiência feita para transformar seu pedido em um evento.',
                styles.word
            )}
            </p>
        </div>
        </div>

        {!imagesLoaded && (
        <div className={styles.loadingOverlay} aria-hidden="true" />
        )}
    </div>
    </section>
);
}