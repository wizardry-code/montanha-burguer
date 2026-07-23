import { useState, useRef } from 'react';
import { splitIntoWords } from '../../utils/textUtils';
import { DrawnRule } from '../ui/DrawnRule';
import { CardParagraph } from '../ui/CardParagraph';
import { MapsIcon, WazeIcon, WhatsappIcon } from '../ui/icons';
import styles from './MedievalCard.module.css';

export function MedievalCard({ section, index, tag = 'Capítulo', mobileLayout = 'row' }) {
const [copied, setCopied] = useState(false);
const timeoutRef = useRef(null);

const cardClassName = mobileLayout === 'column' ? styles.card + ' ' + styles.cardVertical : styles.card;
const mapsButtonClassName = styles.ctaButton + ' ' + styles.ctaButtonMaps;
const wazeButtonClassName = styles.ctaButton + ' ' + styles.ctaButtonWaze;
const toastClassName = copied ? styles.copyToast + ' ' + styles.copyToastVisible : styles.copyToast;
const titleClassName = styles.title + ' ' + styles.cinzel;
const paragraphClassName = styles.paragraph + ' ' + styles.merriweather;

async function handleCopyAddress() {
    if (!section.footer?.address) return;

    try {
    await navigator.clipboard.writeText(section.footer.address);
    setCopied(true);
    window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => setCopied(false), 2000);
    } catch (err) {
    console.error('Não foi possível copiar o endereço:', err);
    }
}

return (
    <article className={cardClassName} data-index={index} aria-labelledby={section.id + '-title'}>
    <figure className={styles.cardFigure}>
        <img className={styles.cardImage} src={section.image} alt={section.imageAlt} loading="lazy" />
        <div className={styles.imageOverlay} />
        <span className={styles.chapterTag} aria-hidden="true">
        {tag} {section.chapter}
        </span>
    </figure>

    <div className={styles.cardContent}>
        <header className={styles.cardHeader}>
        <DrawnRule />
        <h2 id={section.id + '-title'} className={titleClassName}>
            {splitIntoWords(section.title)}
        </h2>
        <DrawnRule />
        </header>

        <CardParagraph fragments={section.paragraph} className={paragraphClassName} />

        {section.footer?.type === 'address' && (
        <div className={styles.footerBlock}>
            <address className={styles.addresText}>
            <button type="button" className={styles.addresCopyBtn} onClick={handleCopyAddress} aria-label="Copiar endereço">
                <span className={styles.pin} aria-hidden="true">📍</span>
                <span>{section.footer.address}</span>
            </button>

            <span className={toastClassName} role="status" aria-live="polite">
                Endereço copiado!
            </span>
            </address>

            <div className={styles.addresButtonsGroup}>
            <a className={mapsButtonClassName} href={section.footer.mapsHref} target="_blank" rel="noreferrer">
                <span className={styles.iconWrapper}><MapsIcon /></span>
                <span>Ir pelo Maps</span>
            </a>

            {section.footer.wazeHref && (
                <a className={wazeButtonClassName} href={section.footer.wazeHref} target="_blank" rel="noreferrer">
                <span className={styles.iconWrapper}><WazeIcon /></span>
                <span>Ir pelo Waze</span>
                </a>
            )}
            </div>
        </div>
        )}

        {section.footer?.type === 'cta' && (
        <div className={styles.footerBlock}>
            {section.footer.badge && <span className={styles.badge}>{section.footer.badge}</span>}

            <a className={styles.ctaButton} href={section.footer.whatsappHref} target="_blank" rel="noreferrer">
            <span className={styles.iconWrapper}><WhatsappIcon /></span>
            <span>{section.footer.buttonText}</span>
            </a>
        </div>
        )}
    </div>
    </article>
);
}