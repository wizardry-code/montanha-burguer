// Section4.jsx
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './Section4.module.css';
import { S2_HEAVY_PRELOAD_EVENT } from '../../utils/events';
import { debouncedRefresh } from '../../utils/gsapRefresh';
import { splitIntoWords } from '../../utils/textUtils';

gsap.registerPlugin(ScrollTrigger);

const MOBILE_BREAKPOINT = '(max-width: 900px)';

// Progresso do PIN (0 a 1) em que o vídeo é disparado.
const VIDEO_TRIGGER_PROGRESS = 0.35;

// Tempo (segundos reais, não-scroll) que o texto fica visível
// depois que o vídeo começa a tocar, antes de desvanecer.
const TEXT_HOLD_SECONDS = 1.4;

const videoPath = (device) =>
`${import.meta.env.BASE_URL}videos/${device}/cardapioBackground.webm`;

export default function Section4() {
const containerRef = useRef(null);
const videoRef = useRef(null);
const textRef = useRef(null);
const [videoReady, setVideoReady] = useState(false);

const readyRef = useRef(false);
const sequenceActiveRef = useRef(false);
const objectUrlRef = useRef(null);
const fadeCallRef = useRef(null);
const wordsRef = useRef([]);

useEffect(() => {
    const video = videoRef.current;
    const device = window.matchMedia(MOBILE_BREAKPOINT).matches ? 'mobile' : 'desktop';

    let cancelled = false;

    const playSequence = () => {
    if (sequenceActiveRef.current) return;
    sequenceActiveRef.current = true;

    if (fadeCallRef.current) fadeCallRef.current.kill();

    gsap.set(video, { opacity: 1 });

    if (readyRef.current) {
        video.currentTime = 0;
        video.play().catch(() => {});
    }
    // Se o vídeo ainda não baixou, ele toca assim que o preload
    // terminar (ver loadVideo mais abaixo).

    // Fade-out independente do scroll: some sozinho depois de um
    // tempo. Se o usuário voltar a rolar dentro da faixa 0→0.35,
    // o scrub retoma o controle da opacidade das palavras
    // normalmente (não tem problema, é o comportamento esperado).
    fadeCallRef.current = gsap.delayedCall(TEXT_HOLD_SECONDS, () => {
        gsap.to(wordsRef.current, { opacity: 0, y: -20, duration: 1, stagger: 0.01 });
    });
    };

    const resetSequence = () => {
    if (!sequenceActiveRef.current) return;
    sequenceActiveRef.current = false;

    if (fadeCallRef.current) {
        fadeCallRef.current.kill();
        fadeCallRef.current = null;
    }

    video.pause();
    video.currentTime = 0;
    gsap.set(video, { opacity: 0 });
    // Não precisa forçar reset das palavras aqui: como elas são
    // controladas pelo scrub na faixa 0→0.35 do pin, ao voltar
    // pra trás o próprio ScrollTrigger já as leva de volta a
    // opacity:0. Isso só serve de garantia extra em edge cases
    // (ex: refresh brusco).
    gsap.set(wordsRef.current, { opacity: 0, y: 16 });
    };

    const ctx = gsap.context(() => {
    const words = containerRef.current.querySelectorAll(`.${styles.word}`);
    wordsRef.current = words;

    const scrubTl = gsap.timeline({
        scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: '+=220%',
        pin: true,
        scrub: 1,
        onUpdate: (self) => {
            const crossedForward =
            self.progress >= VIDEO_TRIGGER_PROGRESS && !sequenceActiveRef.current;
            const crossedBack =
            self.progress < VIDEO_TRIGGER_PROGRESS && sequenceActiveRef.current;

            if (crossedForward) playSequence();
            else if (crossedBack) resetSequence();
        },
        onLeaveBack: resetSequence,
        },
    });

    // Palavras reveladas progressivamente pelo scroll, seção
    // continua preta (só o texto aparece sobre o fundo).
    if (words.length > 0) {
        scrubTl.to(words, {
        opacity: 1,
        y: 0,
        stagger: 0.05,
        duration: 1,
        ease: 'power2.out',
        });
    }
    // Espaço vazio: dá folga de scroll entre o texto terminar de
    // aparecer e o vídeo disparar (ajusta VIDEO_TRIGGER_PROGRESS
    // e essa duration juntos pra controlar quanto scroll separa
    // os dois eventos).
    scrubTl.to({}, { duration: 1.85 });

    ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top bottom+=600',
        once: true,
        onEnter: handleS2Ready,
    });

    debouncedRefresh();
    }, containerRef);

    const loadVideo = async () => {
    const src = videoPath(device);
    try {
        const res = await fetch(src);
        if (!res.ok) throw new Error('fetch falhou');
        const blob = await res.blob();
        if (cancelled) return;

        const url = URL.createObjectURL(blob);
        objectUrlRef.current = url;
        video.src = url;

        await new Promise((resolve) => {
        video.onloadedmetadata = resolve;
        video.onerror = resolve;
        });
        if (cancelled) return;

        readyRef.current = true;
        setVideoReady(true);

        if (sequenceActiveRef.current) {
        video.currentTime = 0;
        video.play().catch(() => {});
        }
    } catch (e) {
        video.src = src;
        video.onloadedmetadata = () => {
        readyRef.current = true;
        setVideoReady(true);
        if (sequenceActiveRef.current) video.play().catch(() => {});
        };
    }
    };

    let scrollReached = false;
    let pageLoaded = document.readyState === 'complete';
    let started = false;

    const tryStartLoad = () => {
    if (started || !scrollReached || !pageLoaded) return;
    started = true;
    loadVideo();
    };

    const handleWindowLoad = () => {
    pageLoaded = true;
    tryStartLoad();
    };
    if (!pageLoaded) {
    window.addEventListener('load', handleWindowLoad, { once: true });
    }

    function handleS2Ready() {
    scrollReached = true;
    tryStartLoad();
    }
    window.addEventListener(S2_HEAVY_PRELOAD_EVENT, handleS2Ready, { once: true });

    return () => {
    cancelled = true;
    window.removeEventListener('load', handleWindowLoad);
    window.removeEventListener(S2_HEAVY_PRELOAD_EVENT, handleS2Ready);
    if (fadeCallRef.current) fadeCallRef.current.kill();
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    ctx.revert();
    };
}, []);

return (
    <section ref={containerRef} className={styles.root}>
    <div className={styles.stickyWrapper}>
        <video
        ref={videoRef}
        className={styles.video}
        muted
        playsInline
        preload="auto"
        style={{ opacity: 0 }}
        />

        <div className={styles.overlayCinematic} aria-hidden="true" />

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

        {!videoReady && <div className={styles.loadingOverlay} aria-hidden="true" />}
    </div>
    </section>
);
}