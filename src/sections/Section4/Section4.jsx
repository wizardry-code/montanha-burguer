import  TcgCardMenu  from '../../components/TcgCardMenu/TcgCardMenu';
import { cardTcgData } from '../../data/cardTcgData';
import styles from './Section4.module.css';

export default function Section4() {
return (
    <section className={styles.root} aria-label="Cardápio Mágico">
    <div className={styles.cardsGrid}>
        {cardTcgData.map((item) => (
        <TcgCardMenu
            key={item.id}
            nomeFicticio={item.nomeFicticio}
            nomeReal={item.nomeReal}
            preco={item.preco}
            imagemUrl={item.imagemUrl}
            raridade={item.raridade}
            categoria={item.categoria}
            tags={item.tags}
            ingredientes={item.ingredientes}
            status={item.status}
        />
        ))}
    </div>
    </section>
);
}