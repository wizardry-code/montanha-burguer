// import de imagens da Seção 3 (Aluguel e Espaço)
// Substitua os caminhos abaixo pelas suas imagens correspondentes
import imgAniversario from '../assets/imgs/section3/imgS3A1.avif'; // Criança fantasiada no trono
import imgCineTaverna from '../assets/imgs/section3/imgS3A2.avif'; // Projeção na parede de pedra
import imgMesaRPG from '../assets/imgs/section3/imgS3A3.avif';     // Ilustração da mesa de RPG

export const Section3articlesData = [
{
    id: 'celeiro-dos-jovens-herois',
    chapter: 'I',
    image: imgAniversario,
    imageAlt: 'Criança fantasiada com capa e espada em trono de madeira na taverna',
    title: 'Aniversários & Celebrações Épicas',
    font: 'Merriweather',
    paragraph: [
    { text: 'Transforme a festa do seu jovem herói — ou a sua própria celebração — em uma saga inesquecível. ', variant: 'base' },
    { text: 'Reserve nosso espaço temático com direito a capas, espadas rústicas, banquete artesanal completo ', variant: 'amber' },
    { text: 'e cenários fotográficos incríveis no Trono da Taverna para marcar a sua conquista.', variant: 'baseSemibold' },
    ],
    footer: {
    type: 'cta',
    buttonText: 'Agendar Festa',
    badge: '🎂 Espaço Privativo + Figurinos',
    whatsappHref: 'https://wa.me/5561999999999?text=Ol%C3%A1!%20Gostaria%20de%20saber%20mais%20sobre%20reservas%20para%20anivers%C3%A1rio.',
    },
},
{
    id: 'cine-taverna-estrelas',
    chapter: 'II',
    image: imgCineTaverna,
    imageAlt: 'Projeção de vídeo no muro de pedra do castelo ao ar livre',
    title: 'Cine-Taverna & Eventos Especiais',
    font: 'Merriweather',
    paragraph: [
    { text: 'Experiências audiovisuais ao ar livre sob o céu noturno. ', variant: 'base' },
    { text: 'Projeções em alta definição diretamente nas paredes de pedra da fortaleza, ', variant: 'gold' },
    { text: 'perfeitas para exibições privadas de filmes, campeonatos, eventos geek, transmissões ou eventos corporativos exclusivos.', variant: 'baseMedium' },
    ],
    footer: {
    type: 'cta',
    buttonText: 'Consultar Disponibilidade',
    badge: '🎬 Telão ao Ar Livre',
    whatsappHref: 'https://wa.me/5561999999999?text=Ol%C3%A1!%20Gostaria%20de%20consultar%20datas%20para%20eventos%20no%20p%C3%A1tio.',
    },
},
{
    id: 'mesa-dos-grandes-mestres',
    chapter: 'III',
    image: imgMesaRPG,
    imageAlt: 'Ilustração de mestre e jogadores em uma mesa de RPG à luz de velas',
    title: 'A Mesa dos Grandes Mestres',
    font: 'Merriweather',
    paragraph: [
    { text: 'O cenário perfeito para a sua campanha, com mesas preparadas para o seu grupo de aventureiros. ', variant: 'base' },
    { text: 'Mesas espaçosas de madeira rústica, iluminação temática ', variant: 'purple' },
    { text: 'e combos especiais de hambúrgueres e poções para manter o grupo forte durante toda a campanha de RPG ou board games.', variant: 'baseSemibold' },
    ],
    footer: {
    type: 'cta',
    buttonText: 'Reservar Mesa de RPG',
    badge: '🎲 Reservas de Grupos / Imersão Completa',
    whatsappHref: 'https://wa.me/5561999999999?text=Ol%C3%A1!%20Quero%20reservar%20uma%20mesa%20para%20jogar%20RPG%20com%20meu%20grupo.',
    },
},
];