import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { debouncedRefresh } from '../../utils/gsapRefresh';
import { S2_HEAVY_PRELOAD_EVENT } from '../../utils/events';
// Imports de estilos
import cardStyles from '../../components/MedievalCard/MedievalCard.module.css';
import s3Styles from '../Section3/Section3a.module.css';
import styles from './Section2.module.css';

// Imports de componentes e dados
import { MedievalCard } from '../../components/MedievalCard/MedievalCard';
import Section3a from '../Section3/Section3a';
import { SvgTrans } from '../../components/ui/svgs/SvgTrans/SvgTrans';
import { Section2articlesData } from '../../data/sectionsData';
import Avaliacoes from '../../components/Avaliacoes/Avaliacoes';


gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin);

const SVG_MAX_STROKE = 600;
const INTRO_SCROLL_VH = 1.3;
const MOBILE_BREAKPOINT = 768; 

const S4_PRELOAD_THRESHOLD = 0.8;


const TRIGGER_CONFIG = {
  desktop: {
    cardImage: { start: 'left 80%', end: 'left 30%', scrub: 0.5 },
    cardHeader: { start: 'left 60%', end: 'left 20%', scrub: 0.3 },
    cardWords: { start: 'left 80%', end: 'left 30%', scrub: 0.5 },
    s3Line: { start: 'left 80%', end: 'left 40%', scrub: 0.3 },
    s3Words: { start: 'left 80%', end: 'left 35%', scrub: 0.5 },
  },
  mobile: {
    cardImage: { start: 1, end: 0.6 },
    cardHeader: { start: 1, end: 0.6 },
    cardWords: { start: 1, end: 0.6 },
    s3Line: { start: 1, end: 0.6 },
    s3Words: { start: 1, end: 0.6 },
  },
};

export default function Section2() {
const rootRef = useRef(null);
const trackRef = useRef(null);
const bgWrapperRef = useRef(null);
const svgIntroRef = useRef(null);
const s3Ref = useRef(null);
const svgRuleRef = useRef(null);

useLayoutEffect(() => {
    const ctx = gsap.context(() => {
    const track = trackRef.current;
    const cards = gsap.utils.toArray(`.${cardStyles.card}`, track);
    if (!cards.length) return;

    const isMobile = window.innerWidth < MOBILE_BREAKPOINT;
    const cfg = isMobile ? TRIGGER_CONFIG.mobile : TRIGGER_CONFIG.desktop;

    const getTrackTravel = () => track.scrollWidth - window.innerWidth;

    const introDistance = window.innerHeight * INTRO_SCROLL_VH;
    const enterOffset = window.innerWidth;
    const trackTravelNow = getTrackTravel();
    const viewportWidth = window.innerWidth;
    const masterTotalDuration = introDistance + enterOffset + trackTravelNow;

    if (svgIntroRef.current) {
        gsap.set(svgIntroRef.current, {
        drawSVG: '0% 100%',
        attr: { 'stroke-width': SVG_MAX_STROKE },
        });
    }

    gsap.set(track, { x: enterOffset });

    // ============================================================
    // Helper (só usado no MOBILE): calcula a posição/largura real de
    // um elemento DENTRO do track, em pixels, ignorando o transform
    // atual do track (a subtração dos dois getBoundingClientRect
    // cancela a translação, então funciona não importa o x atual).
    // ============================================================
    function getElementGeometry(el) {
        const trackRect = track.getBoundingClientRect();
        const elRect = el.getBoundingClientRect();
        return {
        left: elRect.left - trackRect.left,
        width: elRect.width,
        };
    }

    // Converte um par de frações (0 a 1, estilo "X% da viewport") em
    // um início/duração absolutos dentro da timeline master. Como a
    // master já é escrubada 1 unidade de tempo = 1 pixel de scroll
    // (ver o master.to(track, {...}) mais abaixo), isso dá um timing
    // preciso e 100% determinístico, sem depender de ScrollTrigger
    // aninhado nem de markers.
    function getScrollWindow(el, startFraction, endFraction, { useCenter = true } = {}) {
        const { left, width } = getElementGeometry(el);
        const refPoint = useCenter ? left + width / 2 : left;
        let pStart = introDistance + refPoint + viewportWidth * (1 - startFraction);
        let pEnd = introDistance + refPoint + viewportWidth * (1 - endFraction);
        // Clamp de segurança pra nunca passar do fim real da timeline
        pStart = Math.max(0, Math.min(pStart, masterTotalDuration));
        pEnd = Math.max(pStart + 1, Math.min(pEnd, masterTotalDuration));
        return { pStart, pEnd, duration: pEnd - pStart };
    }

    let heavyPreloadFired = false;

    const master = gsap.timeline({
        scrollTrigger: {
        trigger: rootRef.current,
        start: 'top top',
        end: () => `+=${introDistance + enterOffset + getTrackTravel()}`,
        scrub: 1,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
            if (!heavyPreloadFired && self.progress >= S4_PRELOAD_THRESHOLD) {
            heavyPreloadFired = true;
            window.dispatchEvent(new Event(S2_HEAVY_PRELOAD_EVENT));
            }
        },
        },
    });

    if (svgIntroRef.current) {
        master.to(
        svgIntroRef.current,
        {
            drawSVG: '100% 100%',
            attr: { 'stroke-width': 0 },
            ease: 'power1.inOut',
            duration: introDistance,
        },
        0
        );
    }

    master.to(
        track,
        {
        x: () => -getTrackTravel(),
        ease: 'none',
        duration: enterOffset + trackTravelNow,
        },
        introDistance
    );

    cards.forEach((card, i) => {
        const direction = i % 2 === 0 ? -1 : 1;
        master.to(
        card,
        {
            y: direction * gsap.utils.random(20, 40, 1),
            ease: 'none',
            duration: enterOffset + trackTravelNow,
        },
        introDistance
        );
    });

    // Animações individuais de cada Card
    cards.forEach((card) => {
        const lines = card.querySelectorAll(`.${cardStyles.ruleLine}`);
        const headerCard = card.querySelector(`.${cardStyles.cardHeader}`);
        const words = card.querySelectorAll(`.${cardStyles.word}`);
        const image = card.querySelector(`.${cardStyles.cardImage}`);
        const figure = card.querySelector(`.${cardStyles.cardFigure}`);
        const content = card.querySelector(`.${cardStyles.cardContent}`);

        gsap.set(lines, { drawSVG: '0%' });
        gsap.set(image, { scale: 1.5 });

        if (isMobile) {
        // ============================================================
        // MOBILE: tweens posicionados manualmente na master timeline,
        // calculados a partir da posição real (em pixels) de cada
        // elemento dentro do track. Nada de ScrollTrigger aninhado
        // aqui — evita a imprecisão de markers com containerAnimation.
        // ============================================================

        if (image && figure) {
            const win = getScrollWindow(figure, cfg.cardImage.start, cfg.cardImage.end);
            master.to(image, { scale: 1, ease: 'none', duration: win.duration }, win.pStart);
        }

        if (headerCard && lines.length) {
            const win = getScrollWindow(headerCard, cfg.cardHeader.start, cfg.cardHeader.end);
            master.to(lines, { drawSVG: '100%', ease: 'none', duration: win.duration }, win.pStart);
        }

        if (content) {
            gsap.set(content, { autoAlpha: 0 });
            const win = getScrollWindow(content, cfg.cardWords.start, cfg.cardWords.end);
            master.to(content, { autoAlpha: 1, ease: 'power1.out', duration: win.duration }, win.pStart);
        }
        } else {
        // ============================================================
        // DESKTOP: comportamento original, inalterado.
        // ============================================================
        if (image) {
            gsap.to(image, {
            scale: 1,
            ease: 'none',
            scrollTrigger: {
                trigger: image,
                containerAnimation: master,
                start: cfg.cardImage.start,
                end: cfg.cardImage.end,
                scrub: cfg.cardImage.scrub,
            },
            });
        }

        if (headerCard && lines.length) {
            gsap.to(lines, {
            drawSVG: '100%',
            ease: 'none',
            scrollTrigger: {
                trigger: headerCard,
                containerAnimation: master,
                start: cfg.cardHeader.start,
                end: cfg.cardHeader.end,
                scrub: cfg.cardHeader.scrub,
            },
            });
        }

        if (content && words.length) {
            gsap.set(words, { y: 16, autoAlpha: 0 });
            gsap.to(words, {
            y: 0,
            autoAlpha: 1,
            stagger: 0.02,
            ease: 'power1.out',
            scrollTrigger: {
                trigger: content,
                containerAnimation: master,
                start: cfg.cardWords.start,
                end: cfg.cardWords.end,
                scrub: cfg.cardWords.scrub,
            },
            });
        }
        }
    });

    // Animações da Section 3a
    if (s3Ref.current) {
        const s3El = s3Ref.current;
        const line = svgRuleRef.current ? svgRuleRef.current.querySelector('line') : null;
        const words = gsap.utils.toArray(`.${s3Styles.word}`, s3El);
        const s3Header = s3El.querySelector('header') || s3El;
        // TODO: troque `s3Styles.cardContent` pela classe real que envolve
        // SÓ o texto (título + parágrafo) da Section3a, sem o fundo/imagem.
        // Se não existir essa classe, ajuste aqui manualmente.
        const s3TextWrapper = s3El.querySelector(`.${s3Styles.content}`) || s3Header;

        if (line) gsap.set(line, { drawSVG: '0%' });

        if (isMobile) {
        if (line) {
            const win = getScrollWindow(s3Header, cfg.s3Line.start, cfg.s3Line.end);
            master.to(line, { drawSVG: '100%', ease: 'none', duration: win.duration }, win.pStart);
        }

        // Só o texto anima de opacidade 0 -> 1; o fundo da seção
        // (s3El) fica visível desde o começo, sem gsap.set/to nele.
        gsap.set(s3TextWrapper, { autoAlpha: 0 });
        const win = getScrollWindow(s3TextWrapper, cfg.s3Words.start, cfg.s3Words.end);
        master.to(s3TextWrapper, { autoAlpha: 1, ease: 'power1.out', duration: win.duration }, win.pStart);
        } else {
        if (line) {
            gsap.to(line, {
            drawSVG: '100%',
            ease: 'none',
            scrollTrigger: {
                trigger: s3Header,
                containerAnimation: master,
                start: cfg.s3Line.start,
                end: cfg.s3Line.end,
                scrub: cfg.s3Line.scrub,
            },
            });
        }

        if (words.length) {
            gsap.set(words, { y: 16, autoAlpha: 0 });
            gsap.to(words, {
            y: 0,
            autoAlpha: 1,
            stagger: 0.02,
            ease: 'power1.out',
            scrollTrigger: {
                trigger: s3El,
                containerAnimation: master,
                start: cfg.s3Words.start,
                end: cfg.s3Words.end,
                scrub: cfg.s3Words.scrub,
            },
            });
        }
        }
    }
    debouncedRefresh();
    }, rootRef);

    return () => ctx.revert();
}, []);

return (
    <section className={styles.root} aria-label="Conheça a taverna Montanha">
    <div ref={rootRef} className={styles.pinSection}>
        <div ref={bgWrapperRef} className={styles.bgWrapper}>
        <div className={styles.imgPlaceholder} aria-hidden="true" />
        <SvgTrans ref={svgIntroRef} />
        </div>

        <div ref={trackRef} className={styles.track}>
        <div className={styles.cardsWrapper}>
            {Section2articlesData.map((section, index) => (
            <MedievalCard section={section} index={index} tag='Capítulo' key={section.id} />
            ))}
            <div className={styles.avaliacoesCard}>
            <Avaliacoes/>
            </div>
            <div className={styles.finalTrack}></div>
        </div>
        <Section3a ref={s3Ref} svgRuleRef={svgRuleRef} />
        </div>
    </div>
    </section>
);
}