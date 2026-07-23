import { splitIntoWords } from '../../utils/textUtils';
import { DrawnRule } from '../ui/DrawnRule';
import { CardParagraph } from '../ui/CardParagraph';
import { MapsIcon, WazeIcon } from '../ui/icons';
import styles from './MedievalCard.module.css';

export function MedievalCard({ section, index }) {

let tag = "Capítulo"
return (
    <article 
    className={styles.card} 
    data-index={index} 
    aria-labelledby={`${section.id}-title`}
    >
    <figure className={styles.cardFigure}>
        <img 
        className={styles.cardImage} 
        src={section.image} 
        alt={section.imageAlt} 
        loading="lazy" 
        />
        
        {/* Overlay responsável pela sombra interna (box-shadow: inset) */}
        <div className={styles.imageOverlay} />

        <span className={styles.chapterTag} aria-hidden="true">
        {tag} {section.chapter}
        </span>
    </figure>

    <div className={styles.cardContent}>
        <header className={styles.cardHeader}>
        <DrawnRule />
        <h2 id={`${section.id}-title`} className={`${styles.title} ${styles.cinzel}`}>
            {splitIntoWords(section.title)}
        </h2>
        <DrawnRule />
        </header>

        <CardParagraph
        fragments={section.paragraph}
        className={`${styles.paragraph} ${styles.merriweather}`}
        />

        {section.footer?.type === 'addres' && (
        <div className={styles.footerBlock}>
            <address className={styles.addresText}>
            <span className={styles.pin} aria-hidden="true">📍</span> {section.footer.addres}
            </address>
            
            <div className={styles.addresButtonsGroup}>
            <a
                className={styles.addresButton}
                href={section.footer.mapsHref}
                target="_blank"
                rel="noreferrer"
            >
                <span className={styles.iconWrapper}><MapsIcon /></span>
                <span>Ir pelo Maps</span>
            </a>

            {section.footer.wazeHref && (
                <a
                className={styles.addresButton}
                href={section.footer.wazeHref}
                target="_blank"
                rel="noreferrer"
                >
                <span className={styles.iconWrapper}><WazeIcon /></span>
                <span>Ir pelo Waze</span>
                </a>
            )}
            </div>
        </div>
        )}
    </div>
    </article>
);
}