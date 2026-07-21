//importação de Dados(Objetos)
import {section3AData} from '../../data/sectionsData';

//importação de utilitarios
import { forwardRef } from 'react';
import { useLayoutEffect, useRef } from 'react';

//importação de estilos
import styles from './Section3a.module.css';



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