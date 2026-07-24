// Data da Seção do Cardápio Mágico (Grimório/Baralho de Cartas)
// Substitua os imports abaixo pelas fotos reais dos hambúrgueres (fundo transparente, se possível)
import imgCoracaoReino from '../assets/imgs/section4/images.jpg';
import imgEscudoZander from '../assets/imgs/section4/images.jpg';
import imgLegadoZion from '../assets/imgs/section4/images.jpg';

export const menuCardsData = [
{
    id: 'coracao-do-reino',
    title: 'O Coração do Reino de Montanha',
    image: imgCoracaoReino,
    imageAlt: 'Hambúrguer O Coração do Reino de Montanha em fundo transparente',
    ingredients: [
    'Hambúrguer grelhado de 180g',
    'Queijo do reino',
    'Farofa crocante de bacon',
    'Anéis de cebola empanados',
    'Pão pretzel',
    'Maionese defumada',
    ],
    tagline: 'Nobre, complexo e grandioso.',
    rarity: 'lendaria',
},
{
    id: 'escudo-de-zander',
    title: 'O Escudo de Zander',
    image: imgEscudoZander,
    imageAlt: 'Hambúrguer O Escudo de Zander em fundo transparente',
    ingredients: [
    'Hambúrguer grelhado de 180g',
    'Queijo',
    'Pão brioche',
    'Maionese de alho',
    ],
    tagline: 'Simples, robusto e certeiro.',
    rarity: 'comum',
},
{
    id: 'legado-de-zion',
    title: 'O Legado de Zion',
    image: imgLegadoZion,
    imageAlt: 'Hambúrguer O Legado de Zion em fundo transparente',
    ingredients: [
    'Hambúrguer grelhado de 180g',
    'Queijo',
    'Cebola roxa na manteiga',
    'Tomate na chapa',
    'Pão australiano',
    'Barbecue com mel',
    ],
    tagline: 'Honrado, abundante e fundamental.',
    rarity: 'rara',
},
];