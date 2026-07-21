import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

import Logo from '../../components/ui/icons/Logo';
import { headerLogoRef } from '../../utils/logoRef';
import { assetsReadyPromise } from '../../utils/assetsReady';
import styles from './PreLoader.module.css';

gsap.registerPlugin(useGSAP);

// Tempo de respiro entre o brilho terminar e a logo iniciar o voo (em segundos)
const EXIT_DELAY = 0.18; // 180ms
// Duração do voo até a posição do Header
const FLIGHT_DURATION = 1;
// Duração do fade do fundo (cortina)
const BG_FADE_DURATION = 0.9;
// Tempo de interseção: o fundo começa a sumir 200ms antes da logo pousar
const OVERLAP_TIME = 0.2; 

const PreLoader = () => {
    const container = useRef(null); // wrapper fixo (nunca é animado, só escondido no final)
    const bgRef = useRef(null); // cortina de fundo (única coisa que recebe fade de opacidade)
    const loaderLogoRef = useRef(null); // <svg> da logo do preloader
    const gradientRef = useRef(null); // <linearGradient> usado no brilho

useGSAP(() => {
    const pageHasLoaded = { current: false };

    // Header começa invisível para não haver flash antes da troca
    if (headerLogoRef.current) {
        gsap.set(headerLogoRef.current, { opacity: 0 });
    }

    // ==========================================
    // ESTADO: CARREGANDO — brilho diagonal em loop
    // ==========================================
    const playShimmerCycle = () => {
        return gsap.timeline({
            onComplete: () => {
                if (pageHasLoaded.current) {
                    settleAndExit();
                } else {
                    playShimmerCycle();
                }
            },
        }).fromTo(
            gradientRef.current,
            { attr: { x1: '-150%', y1: '-150%', x2: '-50%', y2: '-50%' } },
            {
                attr: { x1: '150%', y1: '150%', x2: '250%', y2: '250%' },
                duration: 1.8,
                ease: 'power1.inOut',
            }
        );
    };

    // ==========================================
    // BRILHO ESTABILIZADO → SVG NO ESTADO ORIGINAL
    // ==========================================
    const settleAndExit = () => {
        gsap.set(loaderLogoRef.current, { clearProps: 'transform,x,y,scale' });
        gsap.delayedCall(EXIT_DELAY, runExitFlight);
    };

    // ==========================================
    // VOO ATÉ O HEADER (a ilusão de ótica)
    // ==========================================
    const runExitFlight = () => {
        const finalLogo = headerLogoRef.current;
        const flyingLogo = loaderLogoRef.current;
        if (!finalLogo || !flyingLogo) return;

        // A partir daqui o preloader não deve mais capturar cliques
        gsap.set(container.current, { pointerEvents: 'none' });

        const startRect = flyingLogo.getBoundingClientRect();
        const endRect = finalLogo.getBoundingClientRect();

        const deltaX = endRect.left + endRect.width / 2 - (startRect.left + startRect.width / 2);
        const deltaY = endRect.top + endRect.height / 2 - (startRect.top + startRect.height / 2);
        const scale = endRect.width / startRect.width;

        const exitTl = gsap.timeline({
            onComplete: () => {
                gsap.set(container.current, { display: 'none' });
            },
        });

        exitTl
            .addLabel('voo')
            // A) Voo da logo do preloader
            .to(
                flyingLogo,
                {
                    x: deltaX,
                    y: deltaY,
                    scale,
                    duration: FLIGHT_DURATION,
                    ease: 'power3.inOut',
                    transformOrigin: 'center center',
                },
                'voo'
            )
            // B) ANTECIPAÇÃO: O fundo começa a sumir ligeiramente ANTES da logo terminar o voo.
            .to(
                bgRef.current,
                { 
                    opacity: 0, 
                    duration: BG_FADE_DURATION, 
                    ease: 'power2.out' 
                },
                `voo+=${FLIGHT_DURATION - OVERLAP_TIME}`
            )
            // C) TROCA DE GUARDA: Acontece no frame exato do pouso.
            .call(
                () => {
                    gsap.set(finalLogo, { opacity: 1 });
                    gsap.set(flyingLogo, { opacity: 0 });
                },
                null,
                `voo+=${FLIGHT_DURATION}`
            );
    }; // <--- Chave de fechamento da runExitFlight que estava faltando!

    // Dispara o loop do brilho imediatamente
    playShimmerCycle();

    // ==========================================
    // GATILHO REAL DE "CARREGOU" — dois sinais
    // ==========================================
    const readiness = { page: false, assets: false };

    const tryMarkReady = () => {
        if (readiness.page && readiness.assets) {
            pageHasLoaded.current = true;
        }
    };

    const handlePageLoaded = () => {
        readiness.page = true;
        tryMarkReady();
    };

    if (document.readyState === 'complete') {
        handlePageLoaded();
    } else {
        window.addEventListener('load', handlePageLoaded);
    }

    assetsReadyPromise.then(() => {
        readiness.assets = true;
        tryMarkReady();
    });

    return () => window.removeEventListener('load', handlePageLoaded);
}, { scope: container });

return (
        <div ref={container} className={styles.preLoaderContainer}>
            <div ref={bgRef} className={styles.preLoaderBg} />

            <div className={styles.preLoaderContent}>
                <Logo
                    svgRef={loaderLogoRef}
                    gradientRef={gradientRef}
                    shimmer
                    className={styles.logoLoader}
                />
            </div>
        </div>
    );
};

export default PreLoader;