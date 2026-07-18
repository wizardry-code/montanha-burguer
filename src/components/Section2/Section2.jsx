import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DrawSVGPlugin } from 'gsap/all';
import styles from './Section2.module.css';

gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin);

export default function Section2() {
  const sectionRef = useRef(null);
  const revealBeltRef = useRef(null);
  const svgPathRef = useRef(null);

  useEffect(() => {
    if (!svgPathRef.current) return;

    // Recebe o "bastão" do Hero: nasce já 100% preenchido (tela vermelha)
    gsap.set(svgPathRef.current, { drawSVG: "0% 100%" });

    const tlReveal = gsap.timeline({
      scrollTrigger: {
        trigger: revealBeltRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.2,
        invalidateOnRefresh: true,
      },
    });

    // Único passo: recolhe o traço, revelando o roxo por trás
    tlReveal.to(svgPathRef.current, {
      drawSVG: "100% 100%",
      ease: "none",
      duration: 1,
    });

    return () => {
      if (tlReveal.scrollTrigger) tlReveal.scrollTrigger.kill();
      tlReveal.kill();
    };
  }, []);

  return (
    <section className={styles.section2} ref={sectionRef}>
      <div className={styles.revealBelt} ref={revealBeltRef}>
        <div className={styles.stickyStage}>
          <div className={styles.purpleBg} />

          <div className={styles.svgOverlay}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="100%"
              height="100%"
              viewBox="0 0 1316 664"
              fill="none"
              preserveAspectRatio="none"
            >
              <path
                ref={svgPathRef}
                d="M13.4746 291.27C13.4746 291.27 100.646 -18.6724 255.617 16.8418C410.588 52.356 61.0296 431.197 233.017 546.326C431.659 679.299 444.494 21.0125 652.73 100.784C860.967 180.556 468.663 430.709 617.216 546.326C765.769 661.944 819.097 48.2722 988.501 120.156C1174.21 198.957 809.424 543.841 988.501 636.726C1189.37 740.915 1301.67 149.213 1301.67 149.213"
                stroke="#ff0000"
                strokeWidth="1200"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Conteúdo real da Seção 2, revelado após o wipe */}
      <div className={styles.content}>
        {/* ... */}
      </div>
    </section>
  );
}