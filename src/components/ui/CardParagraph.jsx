import { splitIntoWords } from '../../utils/textUtils';
import styles from '../MedievalCard/MedievalCard.module.css';

export function CardParagraph({ fragments, className }) {
return (
    <p className={className}>
    {fragments.map((frag, i) => (
        <span className={styles[frag.variant]} key={i}>
        {/* Passamos o styles.word como segundo parâmetro */}
        {splitIntoWords(frag.text, styles.word)}
        </span>
    ))}
    </p>
);
}