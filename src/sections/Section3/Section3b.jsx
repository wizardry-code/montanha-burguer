import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { debouncedRefresh } from '../../utils/gsapRefresh';

import cardStyles from '../../components/MedievalCard/MedievalCard.module.css';
import styles from './Section3b.module.css';

import { MedievalCard } from '../../components/MedievalCard/MedievalCard';
import { Section3articlesData } from '../../data/section3bData';

gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin);

export default function Section3() {
const rootRef = useRef(null);

useLayoutEffect(() => {
    const ctx = gsap.context(() => {
        const cards = gsap.utils.toArray(`.${cardStyles.card}`, rootRef.current);
        if (!cards.length) return;

        // Deslocamento horizontal aleatório — SOMENTE em telas desktop (> 900px)
        const mm = gsap.matchMedia();
        
        mm.add('(min-width: 901px)', () => {
            cards.forEach((card, i) => {
                const direction = i % 2 === 0 ? -1 : 1;
                gsap.set(card, {
                    x: direction * gsap.utils.random(20, 60, 1),
                });
            });

            return () => {
                gsap.set(cards, { x: 0 });
            };
        });

        // Animações individuais de cada Card
        cards.forEach((card) => {
            const lines = card.querySelectorAll(`.${cardStyles.ruleLine}`);
            const headerCard = card.querySelector(`.${cardStyles.cardHeader}`);
            const image = card.querySelector(`.${cardStyles.cardImage}`);
            const content = card.querySelector(`.${cardStyles.cardContent}`);

            gsap.set(lines, { drawSVG: '0%' });
            gsap.set(image, { scale: 1.25 });

            if (image) {
                gsap.to(image, {
                    scale: 1,
                    ease: 'none',
                    scrollTrigger: { trigger: card, start: 'top 85%', end: 'top 35%', scrub: 0.5 },
                });
            }

            if (headerCard && lines.length) {
                gsap.to(lines, {
                    drawSVG: '100%',
                    ease: 'none',
                    scrollTrigger: { trigger: headerCard, start: 'top 80%', end: 'top 45%', scrub: 0.3 },
                });
            }

            // Animação condicional do conteúdo baseada na largura da tela
            if (content) {
                mm.add('(min-width: 901px)', () => {
                    // Desktop: Animação por palavra (mantém o visual rico)
                    const words = card.querySelectorAll(`.${cardStyles.word}`);
                    if (!words.length) return;
                    
                    gsap.set(words, { y: 16, autoAlpha: 0 });
                    gsap.to(words, {
                        y: 0,
                        autoAlpha: 1,
                        stagger: 0.02,
                        ease: 'power1.out',
                        scrollTrigger: { trigger: content, start: 'top 85%', end: 'top 45%', scrub: 0.5 },
                    });
                });

                mm.add('(max-width: 900px)', () => {
                    // Mobile: Fade in simples e leve deslocamento do bloco inteiro (muito mais leve)
                    gsap.set(content, { y: 12, autoAlpha: 0 });
                    gsap.to(content, {
                        y: 0,
                        autoAlpha: 1,
                        ease: 'power1.out',
                        scrollTrigger: { trigger: content, start: 'top 70%', end: 'top 25%', scrub: 0.5 }, // scrub false roda fluido sem travar no scroll do celular
                        marker:true,
                    });
                });
            }
        });

        debouncedRefresh();
    }, rootRef);

    return () => ctx.revert();
}, []);

return (
    <section ref={rootRef} className={styles.root} aria-label="Aluguel do espaço e eventos na taverna Montanha">
    <div className={styles.cardsWrapper}>
        {Section3articlesData.map((section, index) => (
        <MedievalCard section={section} index={index} mobileLayout="column" tag="Aventura" key={section.id} />
        ))}
    </div>
    </section>
);
}