import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './ScrollIndicator.module.css';

gsap.registerPlugin(ScrollTrigger);

function ScrollIndicator() {
const containerRef = useRef(null);
const arrowRef = useRef(null);
const ringRef = useRef(null);

// Texto curto repetido para preencher o anel interno sem sobrepor
const text = "Desça para ver o reino";
const chars = text.split("");

useEffect(() => {
    // 1. Rotação contínua e suave do texto interno
    const rotateTween = gsap.to(ringRef.current, {
    rotation: 360,
    duration: 10,
    repeat: -1,
    ease: "none"
    });

    // 2. Seta normal pulando com vai e vem sutil
    const bounceTween = gsap.to(arrowRef.current, {
    y: 6,
    duration: 0.5,
    repeat: -1,
    yoyo: true,
    ease: "power1.inOut"
    });

    // 3. ScrollTrigger para sumir logo no primeiro movimento de rolagem
    gsap.to(containerRef.current, {
    opacity: 0,
    y: 20,
    scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "+=100",
        scrub: true,
    }
    });

    return () => {
    rotateTween.kill();
    bounceTween.kill();
    ScrollTrigger.getAll().forEach(t => t.kill());
    };
}, []);

return (
    <div ref={containerRef} className={styles.container}>
    <div className={styles.circle}>
        
        {/* Texto rodando por dentro */}
        <div ref={ringRef} className={styles.textRing}>
        {chars.map((char, index) => (
            <span 
            key={index} 
            className={styles.char} 
            style={{ '--i': index }}
            >
            {char}
            </span>
        ))}
        </div>

        {/* Seta isolada no centro */}
        <span ref={arrowRef} className={styles.arrow}>↓</span>
        
    </div>
    </div>
);
}

export default ScrollIndicator;
