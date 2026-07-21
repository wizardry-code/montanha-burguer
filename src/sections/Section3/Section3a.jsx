import React, { forwardRef } from 'react';
import { section3AData } from '../../data/sectionsData';
import { DrawnRule } from '../../components/ui/DrawnRule';
import { splitIntoWords } from '../../utils/textUtils';
import styles from './Section3a.module.css';

// Section3a fica DENTRO da esteira da Section2 de propósito: ela é animada
// pelo scroll horizontal único da Section2 (mesmo master timeline / mesmo
// ScrollTrigger com pin). Por isso ela não cria nenhum ScrollTrigger próprio,
// apenas expõe refs (via forwardRef + props) para a Section2 controlar.
export const Section3a = forwardRef(function Section3a({ svgRuleRef }, ref) {
const bgImage = section3AData?.image ? `url(${section3AData.image})` : 'none';

return (
    <section
    ref={ref}
    className={styles.section}
    style={{ '--section3-image': bgImage }}
    aria-labelledby="reservas-title"
    >
    <div className={styles.overlay} />
    <div className={styles.content}>
        {/* lineClassName usa a cor creme (styles.ruleLine) porque aqui o fundo e escuro,
            diferente da regua slate usada dentro dos MedievalCard */}
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
