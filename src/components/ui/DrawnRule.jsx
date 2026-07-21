import styles from '../MedievalCard/MedievalCard.module.css';

export function DrawnRule() {
return (
    <svg
    className={styles.ruleSvg}
    viewBox="0 0 100 2"
    preserveAspectRatio="none"
    aria-hidden="true"
    focusable="false"
    >
    <line x1="0" y1="1" x2="100" y2="1" className={styles.ruleLine} />
    </svg>
);
}