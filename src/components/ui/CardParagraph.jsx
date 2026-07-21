import { splitIntoWords } from '../../utils/textUtils';
import styles from '../MedievalCard/MedievalCard.module.css';

export function CardParagraph({ fragments, className }) {
return (
    <p className={className}>
    {fragments.map((frag, i) => (
        <span className={styles[frag.variant]} key={i}>
        {splitIntoWords(frag.text)}
        </span>
    ))}
    </p>
);
}