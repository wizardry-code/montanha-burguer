//import de pluggins
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';

//import de imagens
import imgPortal from '../../assets/imgs/imgS2A1.jpg';
import imgPatio from '../../assets/imgs/imgS2A2.jpg';
import imgRefugio from '../../assets/imgs/imgS2A3.jpg';
import imgMesas from '../../assets/imgs/imgS2A4.jpg';
import imgDrinks from '../../assets/imgs/imgS2A5.jpg';

//import de componentes
import styles from './Section2.module.css';
import { SvgTrans } from '../../components/SvgTrans/SvgTrans';

gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin);

// Ícones
function GoogleMapsIcon() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="#000000">
      <defs> 
        <style>{`.cls-1{fill:#1a73e8;}.cls-2{fill:#ea4335;}.cls-3{fill:#4285f4;}.cls-4{fill:#fbbc04;}.cls-5{fill:#34a853;}`}</style> 
      </defs> 
      <g transform="scale(1.03, 1.03), translate(3.5, 0)"> 
        <path className="cls-1" d="M14.45.78A8.09,8.09,0,0,0,5.8,3.29L9.63,6.51Z" transform="translate(-3.91 -0.4)"></path> 
        <path className="cls-2" d="M5.8,3.29a8.07,8.07,0,0,0-1.89,5.2,9.06,9.06,0,0,0,.8,3.86L9.63,6.51Z" transform="translate(-3.91 -0.4)"></path> 
        <path className="cls-3" d="M12,5.4a3.09,3.09,0,0,1,3.1,3.09,3.06,3.06,0,0,1-.74,2l4.82-5.73a8.12,8.12,0,0,0-4.73-4L9.63,6.51A3.07,3.07,0,0,1,12,5.4Z" transform="translate(-3.91 -0.4)"></path> 
        <path className="cls-4" d="M12,11.59a3.1,3.1,0,0,1-3.1-3.1,3.07,3.07,0,0,1,.73-2L4.71,12.35A28.67,28.67,0,0,0,8.38,17.6l6-7.11A3.07,3.07,0,0,1,12,11.59Z" transform="translate(-3.91 -0.4)"></path> 
        <path className="cls-5" d="M14.25,19.54c2.7-4.22,5.84-6.14,5.84-11a8.1,8.1,0,0,0-.91-3.73L8.38,17.6c.46.6.92,1.24,1.37,1.94C11.4,22.08,10.94,23.6,12,23.6S12.6,22.08,14.25,19.54Z" transform="translate(-3.91 -0.4)"></path> 
      </g> 
    </svg>
  );
}

function WazeIcon() {
  return (
    <svg viewBox="0 0 122.71 122.88" width="100%" height="100%" fill="#000000">
      <defs>
        <style>{`.st0{fill:#FFFFFF;}`}</style>
      </defs>
      <g>
        <path className="st0" d="M55.14,104.21c4.22,0,8.44,0.19,12.66-0.09c3.84-0.19,7.88-0.56,11.63-1.5c29.82-7.31,45.76-40.23,32.72-68.07 C104.27,17.76,90.77,8.19,72.3,6.22c-14.16-1.5-26.82,2.72-37.51,12.28c-10.5,9.47-15.94,21.28-16.31,35.44 c-0.09,3.28,0,6.66,0,9.94C18.38,71.02,14.35,76.55,7.5,78.7c-0.09,0-0.28,0.19-0.38,0.19c2.63,6.94,13.31,17.16,19.97,19.69 C35.45,87.14,52.32,91.18,55.14,104.21L55.14,104.21z" />
        <path d="M54.95,110.49c-1.03,4.69-3.56,8.16-7.69,10.31c-5.25,2.72-10.6,2.63-15.57-0.56c-5.16-3.28-7.41-8.25-7.03-14.35 c0.09-1.03-0.19-1.41-1.03-1.88c-9.1-4.78-16.31-11.44-21.28-20.44c-0.94-1.78-1.69-3.66-2.16-5.63c-0.66-2.72,0.38-4.03,3.19-4.31 c3.38-0.38,6.38-1.69,7.88-4.88c0.66-1.41,1.03-3.09,1.03-4.69c0.19-4.03,0-8.06,0.19-12.1c1.03-15.57,7.5-28.5,19.32-38.63 C42.67,3.97,55.42-0.43,69.76,0.03c25.04,0.94,46.51,18.57,51.57,43.23c4.59,22.32-2.34,40.98-20.07,55.51 c-1.03,0.84-2.16,1.69-3.38,2.44c-0.66,0.47-0.84,0.84-0.56,1.59c2.34,7.13-0.94,15-7.5,18.38c-8.91,4.41-19.22-0.09-21.94-9.66 c-0.09-0.38-0.56-0.84-0.84-0.84C63.11,110.4,59.07,110.49,54.95,110.49L54.95,110.49z M55.14,104.21c4.22,0,8.44,0.19,12.66-0.09 c3.84-0.19,7.88-0.56,11.63-1.5c29.82-7.31,45.76-40.23,32.72-68.07C104.27,17.76,90.77,8.19,72.3,6.22 c-14.16-1.5-26.82,2.72-37.51,12.28c-10.5,9.47-15.94,21.28-16.31,35.44c-0.09,3.28,0,6.66,0,9.94 C18.38,71.02,14.35,76.55,7.5,78.7c-0.09,0-0.28,0.19-0.38,0.19c2.63,6.94,13.31,17.16,19.97,19.69 C35.45,87.14,52.32,91.18,55.14,104.21L55.14,104.21z" />
        <path d="M74.92,79.74c-11.07-0.56-18.38-4.97-23.07-13.78c-1.13-2.16-0.09-4.31,2.06-4.78c1.31-0.28,2.53,0.66,3.47,2.16 c1.22,1.88,2.44,3.75,4.03,5.25c8.81,8.34,23.25,5.72,28.79-5.06c0.66-1.31,1.5-2.34,3.09-2.34c2.34,0.09,3.66,2.44,2.63,4.59 c-2.91,5.91-7.5,10.22-13.69,12.28C79.51,78.99,76.7,79.36,74.92,79.74L74.92,79.74z" />
        <path d="M55.32,48.98c-3.38,0-6.09-2.72-6.09-6.09s2.72-6.09,6.09-6.09s6.09,2.72,6.09,6.09C61.42,46.17,58.7,48.98,55.32,48.98 L55.32,48.98z" />
        <path d="M98.27,42.79c0,3.38-2.72,6.09-6,6.19c-3.38,0-6.09-2.63-6.09-6.09c0-3.38,2.63-6.09,6-6.19 C95.46,36.7,98.17,39.42,98.27,42.79L98.27,42.79z" />
      </g>
    </svg>
  );
}

const sectionsData = [
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
      type: 'addres',
      addres: 'Rua 3, Chácara 89, Vicente Pires, Brasília - DF, 72005-800',
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

function splitIntoWords(text, customClass) {
  if (!text) return null;
  const targetClass = customClass || styles.word || '';
  return text.split(' ').map((word, i, arr) => (
    <span className={targetClass} key={i}>
      {word}
      {i < arr.length - 1 ? '\u00A0' : ''}
    </span>
  ));
}

function CardParagraph({ fragments, className }) {
  if (!fragments) return null;
  return (
    <p className={className}>
      {fragments.map((frag, i) => {
        // Fallback seguro caso a classe não exista no CSS Module
        const variantClass = styles[frag.variant] || '';
        return (
          <span className={variantClass} key={i}>
            {splitIntoWords(frag.text)}
          </span>
        );
      })}
    </p>
  );
}

function DrawnRule() {
  return (
    <svg
      className={styles.ruleSvg || ''}
      viewBox="0 0 100 2"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <line x1="0" y1="1" x2="100" y2="1" className={styles.ruleLine || ''} />
    </svg>
  );
}

function MedievalCard({ section, index }) {
  return (
    <article className={styles.card || ''} data-index={index} aria-labelledby={`${section.id}-title`}>
      <figure className={styles.cardFigure || ''}>
        <img className={styles.cardImage || ''} src={section.image} alt={section.imageAlt} loading="lazy" />
        <span className={styles.chapterTag || ''} aria-hidden="true">
          Capítulo {section.chapter}
        </span>
      </figure>

      <div className={styles.cardContent || ''}>
        <header className={styles.cardHeader || ''}>
          <DrawnRule />
          <h2 id={`${section.id}-title`} className={`${styles.title || ''} ${styles.cinzel || ''}`}>
            {splitIntoWords(section.title)}
          </h2>
          <DrawnRule />
        </header>

        <CardParagraph
          fragments={section.paragraph}
          className={`${styles.paragraph || ''} ${styles.merriweather || ''}`}
        />

        {section.footer?.type === 'addres' && (
          <div className={styles.footerBlock || ''}>
            <address className={styles.addresText || ''}>
              <span className={styles.pin || ''} aria-hidden="true">📍</span> {section.footer.addres}
            </address>
            
            <div className={styles.addresButtonsGroup || ''}>
              <a
                className={styles.addresButton || ''}
                href={section.footer.mapsHref}
                target="_blank"
                rel="noreferrer"
              >
                <span className={styles.iconWrapper || ''}><GoogleMapsIcon /></span>
                <span>Ir pelo Maps</span>
              </a>

              {section.footer.wazeHref && (
                <a
                  className={styles.addresButton || ''}
                  href={section.footer.wazeHref}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className={styles.iconWrapper || ''}><WazeIcon /></span>
                  <span>Ir pelo Waze</span>
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}

export default function Section2() {
  const rootRef = useRef(null);
  const trackRef = useRef(null);
  const svgPathRef = useRef(null);

  useEffect(() => {
    // Timeout para garantir a montagem completa da árvore no DOM do navegador
    const timer = setTimeout(() => {
      const ctx = gsap.context(() => {
        const track = trackRef.current;
        if (!track) return;

        const cards = gsap.utils.toArray(`.${styles.card}`, track);
        const svgPath = svgPathRef.current;
        const svgContainer = svgPath ? svgPath.closest('div') : null;

        if (!cards.length) return;

        const getScrollDistance = () => track.scrollWidth - window.innerWidth;

        const master = gsap.timeline({
          scrollTrigger: {
            trigger: rootRef.current,
            start: 'top top',
            end: () => `+=${getScrollDistance() + window.innerHeight}`,
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        if (svgPath) {
          master.to(svgPath, {
            attr: { 'stroke-width': 0 },
            drawSVG: '100% 100%',
            duration: 1,
            ease: 'none',
          }, 0);

          if (svgContainer) {
            master.to(svgContainer, { opacity: 0, pointerEvents: 'none', duration: 0.2 }, '>-0.2');
          }
        }

        master.to(track, { x: () => -getScrollDistance(), ease: 'none', duration: 4 }, '>');

        cards.forEach((card, i) => {
          const direction = i % 2 === 0 ? -1 : 1;
          master.to(
            card,
            {
              y: direction * gsap.utils.random(20, 40, 1),
              ease: 'none',
              duration: 4,
            },
            1
          );
        });

        cards.forEach((card) => {
          const lines = card.querySelectorAll(`.${styles.ruleLine}`);
          const header = card.querySelector(`.${styles.cardHeader}`);
          const words = card.querySelectorAll(`.${styles.word}`);
          const image = card.querySelector(`.${styles.cardImage}`);
          const content = card.querySelector(`.${styles.cardContent}`);

          if (lines.length) gsap.set(lines, { drawSVG: '0%' });
          if (words.length) gsap.set(words, { y: 16, autoAlpha: 0 });
          if (image) gsap.set(image, { scale: 1.12 });

          if (image) {
            gsap.to(image, {
              scale: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: card,
                containerAnimation: master,
                start: 'left 95%',
                end: 'left 30%',
                scrub: 0.5,
              },
            });
          }

          if (header && lines.length) {
            gsap.to(lines, {
              drawSVG: '100%',
              ease: 'none',
              scrollTrigger: {
                trigger: header,
                containerAnimation: master,
                start: 'left 90%',
                end: 'left 60%',
                scrub: 0.3,
              },
            });
          }

          if (content && words.length) {
            gsap.to(words, {
              y: 0,
              autoAlpha: 1,
              stagger: 0.02,
              ease: 'power1.out',
              scrollTrigger: {
                trigger: content,
                containerAnimation: master,
                start: 'left 85%',
                end: 'left 40%',
                scrub: 0.5,
              },
            });
          }
        });

        ScrollTrigger.refresh();
      }, rootRef);

      return () => ctx.revert();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section className={styles.pinSection || ''} ref={rootRef} aria-label="Conheça a taverna Montanha">
      <div className={styles.bgWrapper || ''}>
        <img src={imgPortal} alt="" className={styles.bgImage || ''} />
      </div>

      <SvgTrans ref={svgPathRef} />

      <div className={styles.transitionBelt || ''}>
        <div ref={trackRef} className={styles.track || ''}>
          {sectionsData.map((section, index) => (
            <MedievalCard section={section} index={index} key={section.id} />
          ))}
          <div className={styles.trackEnd || ''} aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}