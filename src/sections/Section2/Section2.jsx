import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';

// Imports de estilos
import cardStyles from '../../components/MedievalCard/MedievalCard.module.css';
import s3Styles from '../Section3/Section3a.module.css';
import styles from './Section2.module.css';

// Imports de componentes e dados
import { MedievalCard } from '../../components/MedievalCard/MedievalCard';
import Section3a from '../Section3/Section3a';
import { SvgTrans } from '../../components/ui/svgs/SvgTrans/SvgTrans';
import { Section2articlesData } from '../../data/sectionsData';

gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin);

const SVG_MAX_STROKE = 1200;
const INTRO_SCROLL_VH = 1.3;

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

    const getTrackTravel = () => track.scrollWidth - window.innerWidth;

    const introDistance = window.innerHeight * INTRO_SCROLL_VH;
    const enterOffset = window.innerWidth;
    const trackTravelNow = getTrackTravel();

    if (svgIntroRef.current) {
        gsap.set(svgIntroRef.current, {
        drawSVG: '0% 100%',
        attr: { 'stroke-width': SVG_MAX_STROKE },
        opacity: 1,
        });
    }

    gsap.set(track, { x: enterOffset });

    const master = gsap.timeline({
        scrollTrigger: {
        trigger: rootRef.current,
        start: 'top top',
        end: () => `+=${introDistance + enterOffset + getTrackTravel()}`,
        scrub: 1,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        },
    });

    if (svgIntroRef.current) {
        master.to(
        svgIntroRef.current,
        {
            drawSVG: '100% 100%',
            attr: { 'stroke-width': 0 },
            opacity: 0,
            ease: 'power1.in',
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

    cards.forEach((card) => {
        const lines = card.querySelectorAll(`.${cardStyles.ruleLine}`);
        const header = card.querySelector(`.${cardStyles.cardHeader}`);
        const words = card.querySelectorAll(`.${cardStyles.word}`);
        const image = card.querySelector(`.${cardStyles.cardImage}`);
        const content = card.querySelector(`.${cardStyles.cardContent}`);

        gsap.set(lines, { drawSVG: '0%' });
        gsap.set(words, { y: 16, autoAlpha: 0 });
        gsap.set(image, { scale: 1.12 });

        if (image) {
        gsap.to(image, {
            scale: 1,
            ease: 'none',
            scrollTrigger: {
            trigger: card,
            containerAnimation: master,
            start: 'left 95%',
            end: 'left 30%',
            scrub: 0.5,
            },
        });
        }

        if (header && lines.length) {
        gsap.to(lines, {
            drawSVG: '100%',
            ease: 'none',
            scrollTrigger: {
            trigger: header,
            containerAnimation: master,
            start: 'left 90%',
            end: 'left 60%',
            scrub: 0.3,
            },
        });
        }

        if (content && words.length) {
        gsap.to(words, {
            y: 0,
            autoAlpha: 1,
            stagger: 0.02,
            ease: 'power1.out',
            scrollTrigger: {
            trigger: content,
            containerAnimation: master,
            start: 'left 85%',
            end: 'left 40%',
            scrub: 0.5,
            },
        });
        }
    });

    if (s3Ref.current) {
        const s3El = s3Ref.current;
        const line = svgRuleRef.current ? svgRuleRef.current.querySelector('line') : null;
        const words = gsap.utils.toArray(`.${s3Styles.word}`, s3El);

        if (line) gsap.set(line, { drawSVG: '0%' });
        if (words.length) gsap.set(words, { y: 16, autoAlpha: 0 });

        if (line) {
        gsap.to(line, {
            drawSVG: '100%',
            ease: 'none',
            scrollTrigger: {
            trigger: s3El,
            containerAnimation: master,
            start: 'left 85%',
            end: 'left 55%',
            scrub: 0.3,
            },
        });
        }

        if (words.length) {
        gsap.to(words, {
            y: 0,
            autoAlpha: 1,
            stagger: 0.02,
            ease: 'power1.out',
            scrollTrigger: {
            trigger: s3El,
            containerAnimation: master,
            start: 'left 80%',
            end: 'left 35%',
            scrub: 0.5,
            },
        });
        }
    }

    ScrollTrigger.refresh();
    }, rootRef);

    return () => ctx.revert();
}, []);

return (
    <section className={styles.root} aria-label="Conheça a taverna Montanha">
    <div ref={rootRef} className={styles.pinSection}>
        {/* Fundo Fixo com Imagem/Placeholder e SvgTrans */}
        <div ref={bgWrapperRef} className={styles.bgWrapper}>
        <div className={styles.imgPlaceholder} aria-hidden="true" />
        <SvgTrans ref={svgIntroRef} />
        </div>

        {/* Esteira de Scroll Horizontal */}
        <div ref={trackRef} className={styles.track}>
        {/* Envelope Pastellizado dos Cards Medievais */}
        <div className={styles.cardsWrapper}>
            {Section2articlesData.map((section, index) => (
            <MedievalCard section={section} index={index} key={section.id} />
            ))}
        </div>

        {/* Seção Adicional (Section3a) continua na esteira */}
        <Section3a ref={s3Ref} svgRuleRef={svgRuleRef} />
        </div>
    </div>
    </section>
);
}