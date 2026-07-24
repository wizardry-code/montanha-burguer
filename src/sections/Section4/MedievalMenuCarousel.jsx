import { useRef, useState } from 'react';
import { gsap } from 'gsap';
import styles from './MedievalMenuCarousel.module.css';

export default function MedievalMenuCarousel({ items }) {
const [index, setIndex] = useState(0);
const cardRef = useRef(null);
const isAnimating = useRef(false);

function goNext() {
    if (isAnimating.current) return;
    isAnimating.current = true;

    const card = cardRef.current;
    const nextIndex = (index + 1) % items.length;

    const tl = gsap.timeline({
    onComplete: () => {
        isAnimating.current = false;
    },
    });

    tl.to(card, {
    x: '-120%',
    y: -60,
    rotate: -18,
    opacity: 0,
    duration: 0.5,
    ease: 'power2.in',
    });

    tl.call(() => {
    setIndex(nextIndex);
    gsap.set(card, { x: '120%', y: -60, rotate: 18, opacity: 0 });
    });

    tl.to(card, {
    x: '0%',
    y: 0,
    rotate: 0,
    opacity: 1,
    duration: 0.6,
    ease: 'power3.out',
    });
}

function goPrev() {
    if (isAnimating.current) return;
    isAnimating.current = true;

    const card = cardRef.current;
    const prevIndex = (index - 1 + items.length) % items.length;

    const tl = gsap.timeline({
    onComplete: () => {
        isAnimating.current = false;
    },
    });

    tl.to(card, {
    x: '120%',
    y: -60,
    rotate: 18,
    opacity: 0,
    duration: 0.5,
    ease: 'power2.in',
    });

    tl.call(() => {
    setIndex(prevIndex);
    gsap.set(card, { x: '-120%', y: -60, rotate: -18, opacity: 0 });
    });

    tl.to(card, {
    x: '0%',
    y: 0,
    rotate: 0,
    opacity: 1,
    duration: 0.6,
    ease: 'power3.out',
    });
}

const currentItem = items[index];

return (
    <div className={styles.stage}>
    <button className={styles.navBtn + ' ' + styles.navPrev} onClick={goPrev} aria-label="Prato anterior">
        ‹
    </button>

    <div ref={cardRef} className={styles.menuCard}>
        <div className={styles.menuCardImage}>
        <img src={currentItem.image} alt={currentItem.imageAlt} />
        </div>

        <div className={styles.menuCardText}>
        <h3 className={styles.menuCardTitle}>{currentItem.title}</h3>

        {currentItem.tagline && (
            <p className={styles.menuCardTagline}>{currentItem.tagline}</p>
        )}

        <ul className={styles.menuCardIngredients}>
            {currentItem.ingredients.map((ingredient, i) => (
            <li key={i}>{ingredient}</li>
            ))}
        </ul>
        </div>
    </div>

    <button className={styles.navBtn + ' ' + styles.navNext} onClick={goNext} aria-label="Próximo prato">
        ›
    </button>
    </div>
);
}