import MedievalMenuCarousel from '../../sections/Section4/MedievalMenuCarousel';
import { menuCardsData } from '../../data/section4';

export default function Teste() {
return (
    <section aria-label="Cardápio Mágico">
    <MedievalMenuCarousel items={menuCardsData} />
    </section>
);
}