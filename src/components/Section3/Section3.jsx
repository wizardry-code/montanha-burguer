import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './Section3.module.css';

import imgBebe from '../../assets/imgs/imgS3.jpg';

gsap.registerPlugin(ScrollTrigger);

const section3Data = {
image: imgBebe,
imageAlt: 'Entrada da taverna Montanha iluminada à noite, pronta para receber celebrações',
title: 'Explorar Opções de Aluguel & Reservas',
paragraph:
    'Aniversários, sessões exclusivas de RPG, eventos corporativos ou encontros de família. Descubra como reservar nosso espaço para tornar sua comemoração lendária.',
cta: 'Fazer Reserva',
};

/** Divide um texto em <span> por palavra. */
function splitIntoWords(text) {
return text.split(' ').map((word, i, arr) => (
    <span className={styles.word} key={i}>
    {word}
    {i < arr.length - 1 ? '\u00A0' : ''}
    </span>
));
}

function DrawnRule() {
return (
    <svg
    className={styles.ruleSvg}
    viewBox="0 0 100 2"
    preserveAspectRatio="none"
    aria-hidden="true"
    focusable="false"
    >
    <line x1="0" y1="1" x2="100" y2="1" className={styles.ruleLine} vectorEffect="non-scaling-stroke" />
    </svg>
);
}

export default function Section3() {
const sectionRef = useRef(null);

useLayoutEffect(() => {
    const ctx = gsap.context(() => {
    const words = sectionRef.current.querySelectorAll(`.${styles.word}`);
    const line = sectionRef.current.querySelector(`.${styles.ruleLine}`);

    gsap.set(words, { y: 16, autoAlpha: 0 });
    if (line) gsap.set(line, { strokeDasharray: 100, strokeDashoffset: 100 });

    ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 75%',
        end: 'top 25%',
        scrub: 1,
        animation: gsap
        .timeline()
        .to(line, { strokeDashoffset: 0, ease: 'none' }, 0)
        .to(words, { y: 0, autoAlpha: 1, stagger: 0.025, ease: 'none' }, 0.05),
    });
    }, sectionRef);

    return () => ctx.revert();
}, []);

return (
    <section
    ref={sectionRef}
    className={styles.section}
    style={{ '--section3-image': `url(${section3Data.image})` }}
    aria-labelledby="reservas-title"
    >
    <div className={styles.overlay} />
    <div className={styles.content}>
        <DrawnRule />
        <h2 id="reservas-title" className={`${styles.title} ${styles.cinzel}`}>
        {splitIntoWords(section3Data.title)}
        </h2>
        <p className={styles.paragraph}>{splitIntoWords(section3Data.paragraph)}</p>
        <a className={styles.cta} href="#reservar">
        <strong>{section3Data.cta}</strong>
        </a>
    </div>
    </section>
);
}