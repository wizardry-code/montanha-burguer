import React, { useEffect, useRef, forwardRef } from 'react';
import gsap from 'gsap';
import styles from './ScrollIndicator.module.css';


const ScrollIndicator = forwardRef(function ScrollIndicator(props, ref) {
const arrowRef = useRef(null);
const ringRef = useRef(null);

// Texto curto repetido para preencher o anel interno sem sobrepor
const text = "Desça para ver o reino";
const chars = text.split("");

useEffect(() => {
    const ctx = gsap.context(() => {
    // Rotação contínua e suave do texto interno
    gsap.to(ringRef.current, {
        rotation: 360,
        duration: 10,
        repeat: -1,
        ease: "none",
    });

    // Seta pulando com vai e vem sutil
    gsap.to(arrowRef.current, {
        y: 6,
        duration: 0.5,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
    });
    });

    return () => ctx.revert();
}, []);

return (
    <div ref={ref} className={styles.container}>
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
});

export default ScrollIndicator;