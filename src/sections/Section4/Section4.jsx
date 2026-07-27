import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './Section4.module.css';
import { S2_HEAVY_PRELOAD_EVENT } from '../Section2/Section2';
import { debouncedRefresh } from '../../utils/gsapRefresh';


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

    // gsap.context agrupa o pin + o fallback trigger num único objeto
    // rastreável — o cleanup vira uma linha só (ctx.revert()), em vez de
    // precisar lembrar de dar .kill() em cada trigger manualmente.
    const ctx = gsap.context(() => {
    // 1) Pin/ScrollTrigger criado imediatamente (não depende dos sheets)
    ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: '+=300%',
        pin: true,
        scrub: 1,
        onUpdate: (self) => {
        if (!readyRef.current) return;

        const rawFrame = Math.min(TOTAL_FRAMES - 1, Math.floor(self.progress * TOTAL_FRAMES));
        sequence.frame = PLAYBACK_DIRECTION === 'reverse' ? TOTAL_FRAMES - 1 - rawFrame : rawFrame;
        render();
        },
    });

    // Fallback de segurança
    ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top bottom+=600',
        once: true,
        onEnter: handleS2Ready,
    });

    // Recalcula posições de scroll considerando a altura atual do
    // documento — importante já que essa seção é montada de forma
    // assíncrona (lazy) e pode chegar depois de outras seções.
    debouncedRefresh();
    }, containerRef);

    // 2) Preload dos sheets em lotes com fetchPriority baixa
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

    // 3) Gatilho de preload: evento disparado pela Section2 no progresso
    // correto da timeline HORIZONTAL
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
    ctx.revert(); // mata o pin + o fallback trigger de uma vez só
    };
}, []);

return (
    <section ref={containerRef} className={styles.root}>
    <div className={styles.stickyWrapper}>
        <canvas ref={canvasRef} className={styles.canvas} />
        {!imagesLoaded && (
        <div className={styles.loadingOverlay} aria-hidden="true" />
        )}
    </div>
    </section>
);
}