import { useRef } from 'react';
import styles from './PreLoader.module.css';
import logoMinimalistaSemTexto from "../../assets/logoMinimalistaSemTexto.svg";

import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { SplitText } from 'gsap/SplitText';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';

// registrando todos os plugins
gsap.registerPlugin(useGSAP, SplitText, DrawSVGPlugin);

const PreLoader = () => {
    const container = useRef(null);
    const textRef = useRef(null);

useGSAP(() => {
    // 1. Quebra o texto da MedievalSharp em letras
    const split = new SplitText(textRef.current, { type: "chars" });
    gsap.set(split.chars, { display: "inline-block" });


    // ==========================================
// ANIMAÇÃO DA LOGO: SINTAXE OFICIAL E 100% CORRETA
// ==========================================
const logoTl = gsap.timeline({ repeat: -1 });

logoTl
    // 1. ANIMAÇÃO DE IDA: Vai do apagado para o preenchido de forma controlada
    .fromTo("#gradiente-revelador", 
        // Estado inicial (Apenas os atributos do SVG)
        { 
            attr: { x1: "-150%", y1: "-150%", x2: "-50%", y2: "-50%" } 
        },
        // Estado final (Atributos dentro de 'attr', configurações do motor FORA)
        {
            attr: { x1: "150%", y1: "150%", x2: "250%", y2: "250%" },
            duration: 3,       // Altere aqui para controlar o tempo de preenchimento (ex: 3s)
            ease: "none"
        }
    )
    
    // 2. ANIMAÇÃO DE VOLTA: Apaga na velocidade desejada após o respiro de 0.5s
    .to("#gradiente-revelador", {
        attr: { x1: "-150%", y1: "-150%", x2: "-50%", y2: "-50%" },
        duration: 3,           // Altere aqui para controlar o tempo apagando (ex: 3s)
        ease: "none"
    }, "+=0.5")                 // Mantém o respiro de 0.5s enquanto estiver tudo aceso
    
    // 3. RESPIRO DE APAGADO: Espera 0.5s antes de reiniciar a timeline inteira
    .to({}, { duration: 0.5 });
    // ==========================================
    // ANIMAÇÃO DO TEXTO (LINHA DO TEMPO)
    // ==========================================
    // A timeline agora cuida APENAS do texto ir e voltar em loop
    const textoTl = gsap.timeline({ repeat: -1 });
    
    split.chars.forEach((letra) => {
        textoTl
            .to(letra, {
                y: -20,          // Letra sobe
                duration: 0.18,  
                ease: "power1.out"
            })
            .to(letra, {
                y: 0,            // Letra desce e bate no chão
                duration: 0.18,  
                ease: "power1.in"
            }); 
    });

}, { scope: container });

    return (
        <div ref={container} className={styles.preLoaderContainer}>
            <svg width="514" height="285" viewBox="0 0 514 285" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.logoLoader}>
                <defs>
                    {/* O Gradiente que o GSAP vai mover */}
                    <linearGradient id="gradiente-revelador" x1="-100%" y1="-100%" x2="0%" y2="0%">
                        <stop offset="0%" stopColor="white" stopOpacity="1" />
                        <stop offset="40%" stopColor="white" stopOpacity="1" />
                        <stop offset="60%" stopColor="white" stopOpacity="0.2" /> {/* Estado apagado com 20% de opacidade */}
                        <stop offset="100%" stopColor="white" stopOpacity="0.2" />
                    </linearGradient>

                    {/* A máscara que aplica o gradiente */}
                    <mask id="mascara-diagonal">
                        <rect width="100%" height="100%" fill="url(#gradiente-revelador)" />
                    </mask>

                    {/* Seu clipPath original do arquivo */}
                    <clipPath id="clip0_2_3">
                        <rect width="514" height="285" fill="white"/>
                    </clipPath>
                </defs>

                {/* Envelopamos os seus paths aplicando a máscara diagonal */}
                <g clipPath="url(#clip0_2_3)" mask="url(#mascara-diagonal)">
                    <path d="M259.111 0H254.862V41.623H259.111V0Z" fill="#D7D7D7"/>
                    <path d="M281.22 6.37466C272.284 0.771788 265.602 0.341033 262.085 0.699052V22.9246C272.97 20.1136 278.667 25.7922 286.401 24.2177C294.774 22.5204 301.153 11.4736 300.753 9.77324C300.356 8.07243 294.775 14.8717 281.22 6.37466Z" fill="#D7D7D7"/>
                    <path d="M289.015 57.5924H281.628V46.8143H270.316V57.5924H262.933V46.8143H251.619V57.5924H244.236V46.8143H232.925V57.5924H225.54V46.8143H214.229V71.2084H220.274H225.54H232.925H244.236H251.619H262.933H270.316H281.628H289.015H294.28H300.324V46.8143H289.015V57.5924Z" fill="#D7D7D7"/>
                    <path d="M220.274 168.5L232 178L245.029 173.379C245.029 165.886 251.101 159.816 258.59 159.816C266.079 159.816 272.151 165.886 272.151 173.379V198.375L294.281 218.5V77.4415H220.274V137.908V168.5ZM266.477 101.394H275.241V116.585H266.477V101.394ZM237.266 101.394H246.029V116.585H237.266V101.394Z" fill="#D7D7D7"/>
                    <path d="M213.399 119.31V158.842H198.5L169.5 193.5L146 205.5V119.31H213.399ZM177.5 134C175.015 134 173 136.015 173 138.5V148H182V138.5C182 136.015 179.985 134 177.5 134Z" fill="#D7D7D7"/>
                    <path d="M202.09 99.6601H194.705V88.8821H183.393V99.6601H176.008V88.8821H164.696V99.6601H157.312V88.8821H146V99.6601V113.273H157.312H164.696H176.008H183.393H194.705H202.09H207.356H213.399V88.8821H202.09V99.6601Z" fill="#D7D7D7"/>
                    <path d="M301.601 221.5L347 198.5L369 184.5V166.188V119.309H301.601V221.5ZM330.918 136.449H339.682V151.64H330.918V136.449Z" fill="#D7D7D7"/>
                    <path d="M357.689 88.8821V99.6601H350.304V88.8821H338.992V99.6601H331.608V88.8821H320.297V99.6601H312.91V88.8821H301.601V99.6601V113.273H312.91H320.297H331.608H338.992H350.304H357.689H362.957H369V88.8821H357.689Z" fill="#D7D7D7"/>
                    <path d="M0 285L87.187 195.216L130.366 204.527L200.949 146L236.655 174.599L249.112 167.283L302.258 215.5L367.856 183.245L416.018 215.5L435.946 202.532L514.5 281.674L435.532 218.826L450.893 254.074L367.026 193.22L320.111 218.161L355.817 281.674L248.697 182.246L235.825 188.233L199.701 160.632L120.816 285L126.629 215.5L90.0925 205.857L0 285Z" fill="white"/>
                </g>
            </svg>
            {/* Adicionada a ref aqui para o SplitText funcionar perfeitamente */}
            <p ref={textRef} className={styles.textLoader}>Montanha Burguer</p>
        </div>
    );
};

export default PreLoader;