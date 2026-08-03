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
    cardImage: { start: 1, end: 0.6 },
    cardHeader: { start: 1, end: 0.6 },
    cardWords: { start: 1, end: 0.6 },
    s3Line: { start: 1, end: 0.6 },
    s3Words: { start: 1, end: 0.6 },
},
mobile: {
    cardImage: { start: 1, end: 0.6 },
    cardHeader: { start: 1, end: 0.6 },
    cardContent: { start: 1, end: 0.6 },
    s3Line: { start: 1, end: 0.6 },
    s3Content: { start: 1, end: 0.6 },
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

    function getElementGeometry(el) {
        const trackRect = track.getBoundingClientRect();
        const elRect = el.getBoundingClientRect();
        return {
        left: elRect.left - trackRect.left,
        width: elRect.width,
        };
    }

    function getScrollWindow(el, startFraction, endFraction, { useCenter = true } = {}) {
        const { left, width } = getElementGeometry(el);
        const refPoint = useCenter ? left + width / 2 : left;
        
        let pStart = introDistance + refPoint + viewportWidth * (1 - startFraction);
        let pEnd = introDistance + refPoint + viewportWidth * (1 - endFraction);
        
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

    // 1. Intro SVG
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

    // 2. Track Horizontal
    master.to(
        track,
        {
        x: () => -getTrackTravel(),
        ease: 'none',
        duration: enterOffset + trackTravelNow,
        },
        introDistance
    );

    // 3. Parallax dos Cards
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

    // 4. Animações Internas dos Cards
    cards.forEach((card) => {
        const lines = card.querySelectorAll(`.${cardStyles.ruleLine}`);
        const headerCard = card.querySelector(`.${cardStyles.cardHeader}`);
        const words = card.querySelectorAll(`.${cardStyles.word}`);
        const image = card.querySelector(`.${cardStyles.cardImage}`);
        const figure = card.querySelector(`.${cardStyles.cardFigure}`);
        const content = card.querySelector(`.${cardStyles.cardContent}`);

        gsap.set(lines, { drawSVG: '0%' });
        if (image) gsap.set(image, { scale: 1.5 });

        // Zoom da Imagem
        if (image && figure) {
        const win = getScrollWindow(figure, cfg.cardImage.start, cfg.cardImage.end);
        master.to(image, { scale: 1, ease: 'none', duration: win.duration }, win.pStart);
        }

        // Desenho da Linha
        if (headerCard && lines.length) {
        const win = getScrollWindow(headerCard, cfg.cardHeader.start, cfg.cardHeader.end);
        master.to(lines, { drawSVG: '100%', ease: 'none', duration: win.duration }, win.pStart);
        }

        // --- ANIMAÇÃO DE TEXTO (DESKTOP vs MOBILE) ---
        if (content) {
        if (isMobile) {
            // MOBILE: Animação performática do bloco inteiro (sem split text)
            gsap.set(content, { autoAlpha: 0, y: 12 });
            const win = getScrollWindow(content, cfg.cardContent.start, cfg.cardContent.end);

            master.to(
            content,
            {
                autoAlpha: 1,
                y: 0,
                ease: 'power1.out',
                duration: win.duration,
            },
            win.pStart
            );
        } else if (words.length) {
            // DESKTOP: Mantém o Split Text + Stagger
            gsap.set(words, { y: 16, autoAlpha: 0 });
            const win = getScrollWindow(content, cfg.cardWords.start, cfg.cardWords.end);

            master.to(
            words,
            {
                y: 0,
                autoAlpha: 1,
                stagger: {
                amount: win.duration * 0.7,
                from: 'start',
                },
                ease: 'power1.out',
                duration: win.duration,
            },
            win.pStart
            );
        }
        }
    });

    // 5. Section 3a
    if (s3Ref.current) {
        const s3El = s3Ref.current;
        const line = svgRuleRef.current ? svgRuleRef.current.querySelector('line') : null;
        const words = gsap.utils.toArray(`.${s3Styles.word}`, s3El);
        const s3Header = s3El.querySelector('header') || s3El;
        const s3Content = s3El.querySelector(`.${s3Styles.content}`) || s3El;

        if (line) {
        gsap.set(line, { drawSVG: '0%' });
        const win = getScrollWindow(s3Header, cfg.s3Line.start, cfg.s3Line.end);
        master.to(line, { drawSVG: '100%', ease: 'none', duration: win.duration }, win.pStart);
        }

        if (isMobile) {
        // MOBILE: Bloco único sumindo e aparecendo (fade + leve y)
        gsap.set(s3Content, { autoAlpha: 0, y: 12 });
        const win = getScrollWindow(s3Content, cfg.s3Content.start, cfg.s3Content.end);

        master.to(
            s3Content,
            {
            autoAlpha: 1,
            y: 0,
            ease: 'power1.out',
            duration: win.duration,
            },
            win.pStart
        );
        } else if (words.length) {
        // DESKTOP: Stagger normal das palavras
        gsap.set(words, { y: 16, autoAlpha: 0 });
        const win = getScrollWindow(s3El, cfg.s3Words.start, cfg.s3Words.end);

        master.to(
            words,
            {
            y: 0,
            autoAlpha: 1,
            stagger: {
                amount: win.duration * 0.7,
                from: 'start',
            },
            ease: 'power1.out',
            duration: win.duration,
            },
            win.pStart
        );
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
            <MedievalCard section={section} index={index} tag="Capítulo" key={section.id} />
            ))}
            <div className={styles.avaliacoesCard}>
            <Avaliacoes />
            </div>
            <div className={styles.finalTrack}></div>
        </div>
        <Section3a ref={s3Ref} svgRuleRef={svgRuleRef} />
        </div>
    </div>
    </section>
);
}