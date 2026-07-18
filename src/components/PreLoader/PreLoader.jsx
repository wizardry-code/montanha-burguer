import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

import Logo from '../Logo/Logo';
import { headerLogoRef } from '../../utils/logoRef';
import { assetsReadyPromise } from '../../utils/assetsReady';
import styles from './PreLoader.module.css';

gsap.registerPlugin(useGSAP);

// Tempo de respiro entre o brilho terminar e a logo iniciar o voo (em segundos)
const EXIT_DELAY = 0.18; // 180ms
// Duração do voo até a posição do Header
const FLIGHT_DURATION = 1;
// Duração do fade do fundo (cortina), que só começa depois que a logo chega
const BG_FADE_DURATION = 0.9;

const PreLoader = () => {
    const container = useRef(null); // wrapper fixo (nunca é animado, só escondido no final)
    const bgRef = useRef(null); // cortina de fundo (única coisa que recebe fade de opacidade)
    const loaderLogoRef = useRef(null); // <svg> da logo do preloader
    const gradientRef = useRef(null); // <linearGradient> usado no brilho

    useGSAP(() => {
        const pageHasLoaded = { current: false };

        // Header começa invisível para não haver flash antes da troca (reforçado
        // também via CSS em Header.module.css, isso aqui é só uma garantia extra).
        if (headerLogoRef.current) {
            gsap.set(headerLogoRef.current, { opacity: 0 });
        }

        // ==========================================
        // ESTADO: CARREGANDO — brilho diagonal em loop
        // ==========================================
        // Em vez de usar repeat:-1 (que corta a animação no meio quando mandamos
        // parar), cada ciclo é uma timeline própria que, ao terminar, decide se
        // continua o loop ou libera a saída. Assim o brilho sempre termina uma
        // volta completa antes de qualquer outra coisa acontecer.
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
            // Garante que a logo está 100% no estado original: sem transform,
            // sem scale, sem nada — só o brilho parado no fim do curso.
            gsap.set(loaderLogoRef.current, { clearProps: 'transform,x,y,scale' });

            // Pequena pausa antes de iniciar o voo, como pedido (150~200ms)
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

            const deltaX =
                endRect.left + endRect.width / 2 - (startRect.left + startRect.width / 2);
            const deltaY =
                endRect.top + endRect.height / 2 - (startRect.top + startRect.height / 2);
            const scale = endRect.width / startRect.width;

            const exitTl = gsap.timeline({
                onComplete: () => {
                    // Some de vez, sem deixar rastro (nem no layout, nem em cliques)
                    gsap.set(container.current, { display: 'none' });
                },
            });

            exitTl
                .addLabel('voo')
                // A) A logo do preloader voa até a posição/tamanho exatos da logo do Header
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
                // B) Troca de guarda: no EXATO frame em que a logo chega, a do Header
                // aparece e a do Loader some. Como as duas ocupam o mesmo lugar/tamanho
                // nesse instante, o usuário nunca percebe a troca.
                .call(
                    () => {
                        gsap.set(finalLogo, { opacity: 1 });
                        gsap.set(flyingLogo, { opacity: 0 });
                    },
                    null,
                    `voo+=${FLIGHT_DURATION}`
                )
                // C) SÓ AGORA, com a logo já no lugar, o fundo (cortina) some —
                // nada de fade acontecendo durante o voo.
                .to(
                    bgRef.current,
                    { opacity: 0, duration: BG_FADE_DURATION, ease: 'power2.out' },
                    `voo+=${FLIGHT_DURATION}`
                );
        };

        // Dispara o loop do brilho imediatamente
        playShimmerCycle();

        // ==========================================
        // GATILHO REAL DE "CARREGOU" — dois sinais, não um
        // ==========================================
        // 1) window 'load': HTML, CSS, JS, fontes, imagens do <img>/<link>
        // 2) assetsReadyPromise: modelos 3D e afins, buscados via JS depois
        //    do 'load' (o navegador não espera por eles sozinho)
        // Só quando os DOIS estiverem prontos é que a flag realmente vira
        // true — e o brilho, ao terminar a volta atual, libera a saída.
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