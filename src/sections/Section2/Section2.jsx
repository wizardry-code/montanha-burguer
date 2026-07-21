//import de pluggins
import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';

//import de estilos
import cardStyles from '../../components/MedievalCard/MedievalCard.module.css'
import styles from './Section2.module.css';
//import de componentes
import { MedievalCard } from '../../components/MedievalCard/MedievalCard';
import {Section2articlesData} from '../../data/sectionsData';

gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin);


export default function Section2() {
const rootRef = useRef(null);
const trackRef = useRef(null);

useLayoutEffect(() => {
const ctx = gsap.context(() => {
const track = trackRef.current;

// Usando cardStyles para os elementos do MedievalCard
const cards = gsap.utils.toArray(`.${cardStyles.card}`, track);
if (!cards.length) return;

const getScrollDistance = () => track.scrollWidth - window.innerWidth;

const master = gsap.timeline({
    scrollTrigger: {
        trigger: rootRef.current,
        start: 'top top',
        end: () => `+=${getScrollDistance()}`,
        scrub: 1,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
    },
});

master.to(track, { x: () => -getScrollDistance(), ease: 'none' }, 0);

cards.forEach((card, i) => {
    const direction = i % 2 === 0 ? -1 : 1;
    master.to(
        card,
        {
            y: direction * gsap.utils.random(20, 40, 1),
            ease: 'none',
        },
        0
    );
});

cards.forEach((card) => {
    // Altera de styles para cardStyles aqui:
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

ScrollTrigger.refresh();

}, rootRef);

    return () => ctx.revert();
}, []);

return (
    <section className={styles.root} aria-label="Conheça a taverna Montanha">
    <div ref={rootRef} className={styles.pinSection}>
        <div ref={trackRef} className={styles.track}>
            {Section2articlesData.map((section, index) => (
                <MedievalCard section={section} index={index} key={section.id} />
            ))}
            {/* Espaçador final: dá "fôlego" depois do último card, então o
                usuário precisa rolar mais um pouco pra soltar o pin e só
                então a Seção 3 aparece — sem corte abrupto. */}
        <div className={styles.trackEnd} aria-hidden="true" />
        </div>
    </div>
    </section>
);
}