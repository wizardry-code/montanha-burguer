import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './Section2.module.css';

import imgPortal from '../../assets/imgs/imgS3A1.jpg';
import imgPatio from '../../assets/imgs/imgS3A2.jpg';
import imgRefugio from '../../assets/imgs/imgS3A3.jpg';
import imgMesas from '../../assets/imgs/imgS3A4.jpg';
import imgDrinks from '../../assets/imgs/imgS3A5.jpg';
import imgBebe from '../../assets/imgs/imgS4.jpg';

gsap.registerPlugin(ScrollTrigger);

/**
 * Conteúdo bruto extraído do Figma, reestruturado em dados.
 * Cada fragmento de parágrafo carrega uma "variant" que mapeia
 * para uma classe de cor no CSS Module (nunca style inline).
 */
const sectionsData = [
  {
    id: 'portal-do-reino',
    chapter: 'I',
    image: imgPortal,
    imageAlt: 'Fachada em pedra da taverna Montanha, com bandeirolas vermelhas e brasão sobre o portal de entrada',
    title: 'O Portal do Reino',
    font: 'merriweather',
    paragraph: [
      { text: 'Uma estrutura de pedra imponente que marca a sua saída do mundo comum. ', variant: 'base' },
      { text: 'Seja para um jantar casual em família, seja para reunir os amigos', variant: 'amber' },
      { text: ', ', variant: 'base' },
      { text: 'a sua jornada começa no momento em que você atravessa a nossa entrada principal.', variant: 'baseSemibold' },
    ],
    footer: {
      type: 'address',
      address: 'Rua 3, Chácara 89, Vicente Pires, Brasília - DF, 72005-800',
      mapsHref: 'https://www.google.com/maps/search/?api=1&query=Rua+3+Ch%C3%A1cara+89+Vicente+Pires+Bras%C3%ADlia+DF',
    },
  },
  {
    id: 'patio-sob-estrelas',
    chapter: 'II',
    image: imgPatio,
    imageAlt: 'Pátio externo coberto por rede e luzes de varal, entre árvores e piso de tijolinho',
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
    imageAlt: 'Passagem de pedra com lustre em roda de carroça levando ao salão interno da taverna',
    title: 'Um Refúgio Épico no Coração da Cidade!',
    font: 'merriweather',
    paragraph: [
      { text: 'Atravesse nossas portas e deixe o mundo comum do lado de fora. Construída com arquitetura em pedra, iluminação à luz de velas e um clima acolhedor, nossa taverna foi feita para quem busca mais do que um jantar: ', variant: 'base' },
      { text: 'uma verdadeira experiência. ', variant: 'orangeItalic' },
      { text: 'Seja para um drink relaxante após o trabalho, seja para saborear um hambúrguer artesanal premiado, este é o seu novo ponto de encontro.', variant: 'baseItalicBold' },
    ],
  },
  {
    id: 'mesas-fartas',
    chapter: 'IV',
    image: imgMesas,
    imageAlt: 'Salão interno com mesas de madeira, velas acesas e escada em pedra ao fundo',
    title: 'Mesas Fartas para Todos os Padrões',
    font: 'merriweather',
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
    imageAlt: 'Garrafas de hidromel artesanal e taças douradas sobre a mesa da taverna',
    title: 'Drinks, Poções & Hidromel',
    font: 'merriweather',
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
    badges: [
      '🧪 Drinks Autorais Temáticos (Opções com e sem álcool)',
      '🍺 Hidromel & Chopp Artesanal (Servidos trincando de gelados)',
    ],
  },
];

const s3Data = {
  image: imgBebe,
  imageAlt: 'Entrada da taverna Montanha iluminada à noite, pronta para receber celebrações',
  title: 'Explorar Opções de Aluguel & Reservas',
  paragraph:
    'Aniversários, sessões exclusivas de RPG, eventos corporativos ou encontros de família. Descubra como reservar nosso espaço para tornar sua comemoração lendária.',
  cta: 'Fazer Reserva',
};

/** Divide um texto em <span> por palavra. */
function splitIntoWords(text, customClass = styles.word) {
  return text.split(' ').map((word, i, arr) => (
    <span className={customClass} key={i}>
      {word}
      {i < arr.length - 1 ? '\u00A0' : ''}
    </span>
  ));
}

function CardParagraph({ fragments, className }) {
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

function DrawnRule() {
  return (
    <svg
      className={styles.ruleSvg}
      viewBox="0 0 100 2"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <line x1="0" y1="1" x2="100" y2="1" className={styles.ruleLine} vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

function MedievalCard({ section, index }) {
  return (
    <article className={styles.card} data-index={index} aria-labelledby={`${section.id}-title`}>
      <figure className={styles.cardFigure}>
        <img className={styles.cardImage} src={section.image} alt={section.imageAlt} loading="lazy" />
        <span className={styles.chapterTag} aria-hidden="true">
          Capítulo {section.chapter}
        </span>
      </figure>

      <div className={styles.cardContent}>
        <header className={styles.cardHeader}>
          <DrawnRule />
          <h2 id={`${section.id}-title`} className={`${styles.title} ${styles[section.font]}`}>
            {/* AGORA DIVIDIDO POR PALAVRAS */}
            {splitIntoWords(section.title)}
          </h2>
          <DrawnRule />
        </header>

        <CardParagraph
          fragments={section.paragraph}
          className={`${styles.paragraph} ${styles[section.font + 'Body']}`}
        />

        {section.footer?.type === 'address' && (
          <div className={styles.footerBlock}>
            <p className={styles.addressText}>
              <span className={styles.pin} aria-hidden="true">📍</span> {section.footer.address}
            </p>
            <a
              className={styles.mapsButton}
              href={section.footer.mapsHref}
              target="_blank"
              rel="noreferrer"
            >
              <span className={styles.mapsIcon} aria-hidden="true">
                <span className={styles.mapsIconG} />
                <span className={styles.mapsIconShadowA} />
                <span className={styles.mapsIconShadowB} />
              </span>
              Abrir no Google Maps
            </a>
          </div>
        )}

        {section.badges && (
          <div className={styles.badgeGroup}>
            {section.badges.map((badge) => (
              <div className={styles.badge} key={badge}>
                <strong className={styles.badgeText}>{badge}</strong>
              </div>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

export default function MedievalSection() {
  const rootRef = useRef(null);
  const trackRef = useRef(null);
  const s3Ref = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const track = trackRef.current;
      const cards = gsap.utils.toArray(`.${styles.card}`, track);
      if (!cards.length) return;

      const getScrollDistance = () => track.scrollWidth - window.innerWidth;

      const master = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top top',
          end: () => `+=${getScrollDistance()}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // 1) Movimento horizontal da track
      master.to(track, { x: () => -getScrollDistance(), ease: 'none' }, 0);

      // 2) Deslocamento em Y (efeito staggered/zigzag)
      cards.forEach((card, i) => {
        const direction = i % 2 === 0 ? -1 : 1;
        master.to(
          card,
          {
            y: direction * gsap.utils.random(20, 40, 1),
            ease: 'none',
          },
          0
        );
      });

      // 3) Revelação por PALAVRAS (styles.word) dentro dos cards
      cards.forEach((card) => {
        const lines = card.querySelectorAll(`.${styles.ruleLine}`);
        const words = card.querySelectorAll(`.${styles.word}`);
        const image = card.querySelector(`.${styles.cardImage}`);

        gsap.set(lines, { strokeDasharray: 100, strokeDashoffset: 100 });
        gsap.set(words, { y: 16, autoAlpha: 0 });
        gsap.set(image, { scale: 1.12 });

        gsap
          .timeline({
            scrollTrigger: {
              trigger: card,
              containerAnimation: master,
              start: 'left 78%',
              end: 'left 28%',
              scrub: 1,
            },
          })
          .to(lines, { strokeDashoffset: 0, ease: 'none', stagger: 0.05 }, 0)
          .to(image, { scale: 1, ease: 'none' }, 0)
          .to(words, { y: 0, autoAlpha: 1, stagger: 0.02, ease: 'none' }, 0.05);
      });

      // Bloco final (Reservas) — Revelação por PALAVRAS (styles.s3Word)
      if (s3Ref.current) {
        const s3Words = s3Ref.current.querySelectorAll(`.${styles.s3Word}`);
        const s3Line = s3Ref.current.querySelector(`.${styles.ruleLine}`);

        gsap.set(s3Words, { y: 16, autoAlpha: 0 });
        if (s3Line) gsap.set(s3Line, { strokeDasharray: 100, strokeDashoffset: 100 });

        ScrollTrigger.create({
          trigger: s3Ref.current,
          start: 'top 75%',
          end: 'top 25%',
          scrub: 1,
          animation: gsap
            .timeline()
            .to(s3Line, { strokeDashoffset: 0, ease: 'none' }, 0)
            .to(s3Words, { y: 0, autoAlpha: 1, stagger: 0.025, ease: 'none' }, 0.05),
        });
      }
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className={styles.root}>
      <section className={styles.pinSection} aria-label="Conheça a taverna Montanha">
        <div ref={trackRef} className={styles.track}>
          {sectionsData.map((section, index) => (
            <MedievalCard section={section} index={index} key={section.id} />
          ))}
        </div>
      </section>

      <section
        ref={s3Ref}
        className={styles.s3Section}
        style={{ '--s3-image': `url(${s3Data.image})` }}
        aria-labelledby="reservas-title"
      >
        <div className={styles.s3Overlay} />
        <div className={styles.s3Content}>
          <DrawnRule />
          <h2 id="reservas-title" className={`${styles.s3Title} ${styles.cinzel}`}>
            {/* AGORA DIVIDIDO POR PALAVRAS */}
            {splitIntoWords(s3Data.title, styles.s3Word)}
          </h2>
          <p className={styles.s3Paragraph}>
            {splitIntoWords(s3Data.paragraph, styles.s3Word)}
          </p>
          <a className={styles.s3Cta} href="#reservar">
            <strong>{s3Data.cta}</strong>
          </a>
        </div>
      </section>
    </div>
  );
}