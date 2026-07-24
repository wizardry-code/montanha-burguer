import { TcgMenuCard } from '../../components/TcgMenuCard/TcgMenuCard';
import { cardTcgData } from '../../data/cardapioData';
import styles from './Section4.module.css';

export default function Section4() {
return (
    <section className={styles.root} aria-label="Cardápio Mágico">
    <div className={styles.cardsGrid}>
        {cardTcgData.map((item) => (
        <TcgMenuCard
            key={item.id}
            nomeFicticio={item.nomeFicticio}
            nomeReal={item.nomeReal}
            preco={item.preco}
            imagemUrl={item.imagemUrl}
            raridade={item.raridade}
            categoria={item.categoria}
            subcategoria={item.subcategoria}
            restricoesAlimentares={item.restricoesAlimentares}
            tags={item.tags}
            ingredientes={item.ingredientes}
            status={item.status}
        />
        ))}
    </div>
    </section>
);
}