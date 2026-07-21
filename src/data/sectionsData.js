//import de imagens
import imgPortal from '../assets/imgs/imgS2A1.avif';
import imgPatio from '../assets/imgs/imgS2A2.avif';
import imgRefugio from '../assets/imgs/imgS2A3.avif';
import imgMesas from '../assets/imgs/imgS2A4.avif';
import imgDrinks from '../assets/imgs/imgS2A5.avif';


export const sectionsData = [
{
    id: 'portal-do-reino',
    chapter: 'I',
    image: imgPortal,
    imageAlt: 'Fachada em pedra da taverna Montanha',
    title: 'O Portal do Reino',
    font: 'Merriweather',
    paragraph: [
    { text: 'Uma estrutura de pedra imponente que marca a sua saída do mundo comum. ', variant: 'base' },
    { text: 'Seja para um jantar casual em família, seja para reunir os amigos', variant: 'amber' },
    { text: ', ', variant: 'base' },
    { text: 'a sua jornada começa no momento em que você atravessa a nossa entrada principal.', variant: 'baseSemibold' },
    ],
    footer: {
    type: 'address',
    address: 'Rua 3, Chácara 89, Vicente Pires, Brasília - DF, 72005-800',
    mapsHref: 'https://maps.app.goo.gl/MtQw7AHwQPJGobL99',
    wazeHref: 'https://ul.waze.com/ul?place=ChIJf_neCeu5W5MRJ5NEyRUa6l4&ll=-15.75228840%2C-48.25907330&navigate=yes&utm_campaign=default&utm_source=waze_website&utm_medium=lm_share_location',
    },
},
{
    id: 'patio-sob-estrelas',
    chapter: 'II',
    image: imgPatio,
    imageAlt: 'Pátio externo coberto por rede e luzes de varal',
    title: 'O Pátio Sob as Estrelas',
    font: 'abeezee',
    paragraph: [
    { text: 'Entre a recepção e o salão principal, nosso pátio a céu aberto convida você a desacelerar. ', variant: 'base' },
    { text: 'O cenário perfeito para tirar fotos incríveis, relaxar com um drink de boas-vindas e sentir o clima acolhedor do feudo antes mesmo de sentar à mesa.', variant: 'gold' },
    ],
},
{
    id: 'refugio-epico',
    chapter: 'III',
    image: imgRefugio,
    imageAlt: 'Passagem de pedra com lustre em roda de carroça',
    title: 'Um Refúgio Épico no Coração da Cidade!',
    font: 'Merriweather',
    paragraph: [
    { text: 'Construída com arquitetura em pedra, iluminação à luz de velas e um clima acolhedor, nossa taverna foi feita para quem busca mais do que um jantar: ', variant: 'base' },
    { text: 'uma verdadeira experiência. ', variant: 'orangeItalic' },
    { text: 'Seja para um drink relaxante após o trabalho, seja para saborear um hambúrguer artesanal premiado, este é o seu novo ponto de encontro.', variant: 'baseItalicBold' },
    ],
},
{
    id: 'mesas-fartas',
    chapter: 'IV',
    image: imgMesas,
    imageAlt: 'Salão interno com mesas de madeira',
    title: 'Mesas Fartas para Todos os Padrões',
    font: 'Merriweather',
    paragraph: [
    { text: 'Acomodações espaçosas projetadas tanto para ', variant: 'base' },
    { text: 'jantares românticos a dois', variant: 'red' },
    { text: ' quanto para ', variant: 'base' },
    { text: 'grandes reuniões de família e celebrações de amigos! ', variant: 'amber' },
    { text: 'Saboreie nossa alta gastronomia com todo o espaço e privacidade que você merece.', variant: 'baseMedium' },
    ],
},
{
    id: 'drinks-pocoes',
    chapter: 'V',
    image: imgDrinks,
    imageAlt: 'Garrafas de hidromel artesanal',
    title: 'Drinks, Poções & Hidromel',
    font: 'Merriweather',
    paragraph: [
    { text: 'Complete a sua experiência gastronômica com nossa carta autoral de bebidas.', variant: 'wine' },
    { text: ' Oferecemos desde o autêntico ', variant: 'base' },
    { text: 'hidromel', variant: 'gold' },
    { text: ' até ', variant: 'base' },
    { text: 'drinks', variant: 'purple' },
    { text: ' ', variant: 'base' },
    { text: 'temáticos exclusivos', variant: 'purple' },
    { text: ', sucos naturais e ', variant: 'base' },
    { text: 'chopp trincando de gelado', variant: 'blue' },
    { text: ' para harmonizar com nossos hambúrgueres artesanais, rústicos e fantásticos.', variant: 'baseSemibold' },
    ],
},
];