import { forwardRef } from 'react';
import { useLayoutEffect, useRef } from 'react';
import styles from './Section3.module.css';

import imgBebe from '../../assets/imgs/imgS3.avif';

const section3Data = {
image: imgBebe,
imageAlt: 'Entrada da taverna Montanha iluminada à noite, pronta para receber celebrações',
title: 'Explorar Opções de Aluguel & Reservas',
paragraph:
    'Aniversários, sessões exclusivas de RPG, eventos corporativos ou encontros de família. Descubra como reservar nosso espaço para tornar sua comemoração lendária.',
cta: 'Fazer Reserva',
};

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

// Usamos forwardRef aqui para repassar a ref para o GSAP da Section2
const Section3 = forwardRef(function Section3(props, ref) {
return (
    <section
    ref={ref}
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
});

export default Section3;