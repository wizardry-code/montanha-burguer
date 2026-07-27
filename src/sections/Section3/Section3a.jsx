import React, { forwardRef } from 'react';
import { section3AData } from '../../data/sectionsData';
import { DrawnRule } from '../../components/ui/DrawnRule';
import { splitIntoWords } from '../../utils/textUtils';
import styles from './Section3a.module.css';

export const Section3a = forwardRef(function Section3a({ svgRuleRef }, ref) {
return (
    <section
    ref={ref}
    className={styles.section}
    /* A imagem vem 100% via CSS / GSAP var(--section3-image) */
    aria-labelledby="reservas-title"
    >
    <div className={styles.overlay} />
    <div className={styles.content}>
        <DrawnRule ref={svgRuleRef} className={styles.ruleSvg} lineClassName={styles.ruleLine} />

        <h2 id="reservas-title" className={`${styles.title} ${styles.cinzel}`}>
        {splitIntoWords(section3AData?.title, styles.word)}
        </h2>

        <p className={styles.paragraph}>
        {splitIntoWords(section3AData?.paragraph, styles.word)}
        </p>

        <a className={styles.cta} href="#reservar">
        <strong>{section3AData?.cta}</strong>
        </a>
    </div>
    </section>
);
});

export default Section3a;