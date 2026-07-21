import styles from '../components/MedievalCard/MedievalCard.module.css';

export function splitIntoWords(text, customClass = styles.word) {
    if (!text) return null;
    
    return text.split(' ').map((word, i, arr) => (
    <span className={customClass} key={i}>
    {word}
    {i < arr.length - 1 ? '\u00A0' : ''}
    </span>
));
}