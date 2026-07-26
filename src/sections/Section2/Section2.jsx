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
import Avaliacoes from '../../components/Avaliacoes/Avaliacoes';


gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin);

const SVG_MAX_STROKE = 600;
const INTRO_SCROLL_VH = 1.3;

// Progresso (0 a 1) da timeline HORIZONTAL da Section2 a partir do qual
// avisamos a SectionCardapio pra começar a baixar os sheets do Cardápio.
// 0.8 = 80% do trajeto horizontal já percorrido, dando bom buffer de
// tempo antes do usuário chegar na S4 (importante em conexões ruins).
const S4_PRELOAD_THRESHOLD = 0.8;

export const S2_HEAVY_PRELOAD_EVENT = 'S2_HEAVY_PRELOAD_EVENT';

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
        });
    }

    gsap.set(track, { x: enterOffset });

    // Flag local (não precisa ser ref do React — o efeito só roda uma
    // vez) pra garantir que o evento dispara UMA única vez.
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
        // ESSENCIAL: é este onUpdate que dispara o evento de preload.
        // self.progress mede corretamente o progresso da timeline
        // horizontal (0 a 1), diferente de um ScrollTrigger vertical
        // solto num elemento — que não funciona dentro de um pin.
        onUpdate: (self) => {
            if (!heavyPreloadFired && self.progress >= S4_PRELOAD_THRESHOLD) {
            heavyPreloadFired = true;
            window.dispatchEvent(new Event(S2_HEAVY_PRELOAD_EVENT));
            }
        },
        },
    });

    // 2. Animação no Master Timeline
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
        const content = card.querySelector(`.${cardStyles.cardContent}`);

        gsap.set(lines, { drawSVG: '0%' });
        gsap.set(words, { y: 16, autoAlpha: 0 });
        gsap.set(image, { scale: 2 });

        if (image) {
        gsap.to(image, {
            scale: 1,
            ease: 'none',
            scrollTrigger: {
            trigger: card,
            containerAnimation: master,
            start: 'left 80%',
            end: 'left 30%',
            scrub: 0.5,
            },
        });
        }

        // Configurado para iniciar quando a esquerda do header bater em 80% da tela
        if (headerCard && lines.length) {
        gsap.to(lines, {
            drawSVG: '100%',
            ease: 'none',
            scrollTrigger: {
            trigger: headerCard,
            containerAnimation: master,
            start: 'left 60%',
            end: 'left 20%',
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
            start: 'left 80%',
            end: 'left 30%',
            scrub: 0.5,
            },
        });
        }
    });

    // Animações da Section 3a
    if (s3Ref.current) {
        const s3El = s3Ref.current;
        const line = svgRuleRef.current ? svgRuleRef.current.querySelector('line') : null;
        const words = gsap.utils.toArray(`.${s3Styles.word}`, s3El);
        const s3Header = s3El.querySelector('header') || s3El;

        if (line) gsap.set(line, { drawSVG: '0%' });
        if (words.length) gsap.set(words, { y: 16, autoAlpha: 0 });

        if (line) {
        gsap.to(line, {
            drawSVG: '100%',
            ease: 'none',
            scrollTrigger: {
            trigger: s3Header,
            containerAnimation: master,
            start: 'left 80%',
            end: 'left 40%',
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
        {/* Envelope dos Cards Medievais */}
        <div className={styles.cardsWrapper}>
            {Section2articlesData.map((section, index) => (
            <MedievalCard section={section} index={index} tag='Capítulo' key={section.id} />
            ))}
            <div className={styles.avaliacoesCard}>
            <Avaliacoes/>
            </div>
            <div className={styles.finalTrack}></div>
        </div>
        {/* id="s2PreloadAnchor" não é mais usado — o preload agora é
            disparado por evento de progresso, não por posição no DOM.
            Pode remover esse id se quiser deixar mais limpo. */}
        <Section3a ref={s3Ref} svgRuleRef={svgRuleRef} />
        </div>
    </div>
    </section>
);
}