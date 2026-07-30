//importação de pluggins e variados
import React, { useEffect, useRef, useState, useCallback, lazy, Suspense } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';

// Canvas 3D isolado em chunk próprio — só baixa/executa quando este
// componente realmente monta, tirando Three.js + react-three-fiber
// do bundle principal.
const HeroCanvas = lazy(() => import('./HeroCanvas'));

//importação de componentes
import { HERO_SCENES } from '../../utils/heroConfig.js';
import { SvgTrans } from '../../components/ui/svgs/SvgTrans/SvgTrans.jsx';
import TrilhaHero from '../../components/TrilhaHero/TrilhaHero.jsx';

//importação de dados
import { SCENE_TARGETS } from '../../data/hero/sceneTargets.js';
import { WAYPOINTS } from '../../data/hero/waypoints.js';
import { TEXT_SCENES } from '../../data/hero/textScenes.js';
import { ICON_SCENE_CONFIG } from '../../data/hero/iconSceneConfig.js';

//importação de estilos
import styles from './Hero.module.css';
import svgStyles from '../../components/ui/svgs/SvgTrans/SvgTrans.module.css';

import imgTranS2Url from '../../assets/imgs/section2/imgTranS2.avif';
import patternUrl from '../../assets/pattern/patternCompress.webp';
import imgS3Url from '../../assets/imgs/section2/imgS3.avif';

import fontCinzelUrl from '../../assets/fonts/Cinzel/cinzel-v26-latin-regular.woff2';
import fontMerriweatherUrl from '../../assets/fonts/Merriweather/static/merriweather-v33-latin-regular.woff2';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, ScrollSmoother, DrawSVGPlugin);

const section2ImagesMap = import.meta.glob('/src/assets/imgs/section2/*.{png,jpg,webp,avif}', {
  eager: true,
  import: 'default'
});
const section2Urls = Object.values(section2ImagesMap);

const section3ImagesMap = import.meta.glob('/src/assets/imgs/section3/*.{png,jpg,webp,avif}', {
  eager: true,
  import: 'default'
});
const section3Urls = Object.values(section3ImagesMap);

if (import.meta.env.DEV) {
  console.log('DEBUG section2Urls:', section2Urls.length, section2Urls);
  console.log('DEBUG section3Urls:', section3Urls.length, section3Urls);
}

const loadFontsDynamically = async () => {
  try {
    const fontCinzel = new FontFace('Cinzel', `url(${fontCinzelUrl})`);
    const fontMerriweather = new FontFace('Merriweather', `url(${fontMerriweatherUrl})`);
    const [loadedCinzel, loadedMerriweather] = await Promise.all([
      fontCinzel.load(),
      fontMerriweather.load()
    ]);
    document.fonts.add(loadedCinzel);
    document.fonts.add(loadedMerriweather);
    if (import.meta.env.DEV) console.log('⚡ Fontes (Cinzel/Merriweather) carregadas dinamicamente!');
  } catch (err) {
    if (import.meta.env.DEV) console.error('Erro ao carregar fontes dinamicamente:', err);
  }
};

const preloadImages = (urls) => {
  urls.forEach((url) => {
    const img = new Image();
    img.fetchPriority = 'low';
    img.src = url;
  });
};

export const HERO_END_WIDGET_EVENT = 'heroEndWidgetReady';

const STOP_OFFSETS = {
  ponte: 1.0,
  dragao: 1.2,
  guilda: 1.25,
  portao: 1.2,
};

const STOP_TRAVEL_DURATION = 3.6;
const STOP_TRAVEL_EASE = 'none';

const WHEEL_THRESHOLD = 5;
const TOUCH_THRESHOLD = 40;

export default function Hero() {
  const [mount3D, setMount3D] = useState(false);

  const [isMobile, setIsMobile] = useState(() => 
    typeof window !== 'undefined' ? window.innerWidth <= 500 : false
  );
  
  const sectionHeroRef = useRef(null);
  const heroBeltRef = useRef(null);
  const canvasContainerRef = useRef(null);
  const svgPathRef = useRef(null);
  const cameraTarget = useRef({ ...WAYPOINTS[0] });
  const textRefs = useRef({});
  const portaoLeftRef = useRef(null);
  const portaoRightRef = useRef(null);

  const trilhaContainerRef = useRef(null);
  const trilhaPathActiveRef = useRef(null);
  const magoHatScaleRef = useRef(null);
  const dragaoScaleRef = useRef(null);
  const espadaScaleRef = useRef(null);
  const casteloScaleRef = useRef(null);

  const trilhaIconRefs = {
    magoHatRef: magoHatScaleRef,
    dragaoRef: dragaoScaleRef,
    espadaRef: espadaScaleRef,
    casteloRef: casteloScaleRef,
  };

  const STOP_LABELS = useRef(
    ['start', ...Object.keys(TEXT_SCENES).map((key) => `stop_${key}`), 'end']
  ).current;

  const tlDroneRef = useRef(null);
  const pinTriggerRef = useRef(null);

  const stopIndexRef = useRef(0);
  const isAnimatingRef = useRef(false);
  const isInternalScrollRef = useRef(false);

  const [stopIndex, setStopIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMount3D(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const goToStop = useCallback((direction) => {
    const tl = tlDroneRef.current;
    const pinST = pinTriggerRef.current;
    if (!tl || !pinST || isAnimatingRef.current) return;

    const nextIndex = stopIndexRef.current + direction;
    if (nextIndex < 0 || nextIndex >= STOP_LABELS.length) return;

    isAnimatingRef.current = true;
    setIsAnimating(true);

    tl.tweenTo(STOP_LABELS[nextIndex], {
      duration: STOP_TRAVEL_DURATION,
      ease: STOP_TRAVEL_EASE,
    });

    const smoother = ScrollSmoother.get();
    const targetScroll = pinST.start + (nextIndex / (STOP_LABELS.length - 1)) * (pinST.end - pinST.start);

    isInternalScrollRef.current = true;
    if (smoother) {
      gsap.to(smoother, {
        scrollTop: targetScroll,
        duration: STOP_TRAVEL_DURATION,
        ease: STOP_TRAVEL_EASE,
      });
    } else {
      gsap.to(window, {
        scrollTo: { y: targetScroll },
        duration: STOP_TRAVEL_DURATION,
        ease: STOP_TRAVEL_EASE,
      });
    }

    gsap.delayedCall(STOP_TRAVEL_DURATION, () => {
      isAnimatingRef.current = false;
      isInternalScrollRef.current = false;
      stopIndexRef.current = nextIndex;
      setIsAnimating(false);
      setStopIndex(nextIndex);
    });
  }, [STOP_LABELS]);

  const goNext = useCallback(() => goToStop(1), [goToStop]);
  const goPrev = useCallback(() => goToStop(-1), [goToStop]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        goNext();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        goPrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goNext, goPrev]);

  useEffect(() => {
    const section = sectionHeroRef.current;
    if (!section) return;

    const handleWheel = (e) => {
      if (!pinTriggerRef.current?.isActive) return;
      if (Math.abs(e.deltaY) < WHEEL_THRESHOLD) return;

      const goingDown = e.deltaY > 0;
      if (goingDown && stopIndexRef.current >= STOP_LABELS.length - 1) return;
      if (!goingDown && stopIndexRef.current <= 0) return;

      e.preventDefault();
      if (isAnimatingRef.current) return;
      goToStop(goingDown ? 1 : -1);
    };

    let touchStartY = null;
    const handleTouchStart = (e) => {
      touchStartY = e.touches[0]?.clientY ?? null;
    };

    const handleTouchMove = (e) => {
      if (!pinTriggerRef.current?.isActive || touchStartY === null) return;
      const currentY = e.touches[0]?.clientY ?? touchStartY;
      const deltaY = touchStartY - currentY;

      if (Math.abs(deltaY) < TOUCH_THRESHOLD) return;

      const goingDown = deltaY > 0;
      if (goingDown && stopIndexRef.current >= STOP_LABELS.length - 1) return;
      if (!goingDown && stopIndexRef.current <= 0) return;

      e.preventDefault();
      touchStartY = currentY;
      if (isAnimatingRef.current) return;
      goToStop(goingDown ? 1 : -1);
    };

    section.addEventListener('wheel', handleWheel, { passive: false });
    section.addEventListener('touchstart', handleTouchStart, { passive: true });
    section.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      section.removeEventListener('wheel', handleWheel);
      section.removeEventListener('touchstart', handleTouchStart);
      section.removeEventListener('touchmove', handleTouchMove);
    };
  }, [goToStop, STOP_LABELS]);

  useEffect(() => {
    const checkViewport = () => setIsMobile(window.innerWidth <= 500);
    checkViewport();
    window.addEventListener('resize', checkViewport);
    return () => window.removeEventListener('resize', checkViewport);
  }, []);

  const getDynamicStyles = useCallback((scene) => {
    const config = isMobile ? scene.layout.mobile : scene.layout.desktop;
    return {
      '--text-top': config.top,
      '--text-bottom': config.bottom,
      '--text-left': config.left,
      '--text-right': config.right,
      '--text-x-offset': config.x,
      '--text-y-offset': config.y,
      textAlign: config.align,
    };
  }, [isMobile]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(trilhaContainerRef.current, { opacity: 0 });
      gsap.set(
        [magoHatScaleRef.current, dragaoScaleRef.current, espadaScaleRef.current, casteloScaleRef.current],
        { scale: 1, filter: 'grayscale(100%) opacity(0.4)', transformOrigin: '50% 50%' }
      );
      if (trilhaPathActiveRef.current) {
        gsap.set(trilhaPathActiveRef.current, { drawSVG: '0% 0%' });
      }
    }, sectionHeroRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    let ctx;
    let cancelled = false;

    stopIndexRef.current = 0;
    isAnimatingRef.current = false;
    setStopIndex(0);
    setIsAnimating(false);

    const ICON_SCENES = {
      mago:    { ...ICON_SCENE_CONFIG.mago,    ref: magoHatScaleRef },
      dragao:  { ...ICON_SCENE_CONFIG.dragao,  ref: dragaoScaleRef },
      espada:  { ...ICON_SCENE_CONFIG.espada,  ref: espadaScaleRef },
      castelo: { ...ICON_SCENE_CONFIG.castelo, ref: casteloScaleRef },
    };

    async function setup() {
      const [{ DrawSVGPlugin }, { SplitText }] = await Promise.all([
        import('gsap/DrawSVGPlugin'),
        import('gsap/SplitText'),
      ]);

      if (cancelled) return;
      gsap.registerPlugin(DrawSVGPlugin, SplitText);

      try {
        await document.fonts.load('1em "MedievalSharp"');
      } catch (error) {
        if (import.meta.env.DEV) console.warn("Atraso na MedievalSharp. Iniciando GSAP via fallback.");
      }

      if (cancelled) return;

      ctx = gsap.context(() => {
        let s2Preloaded = false;
        let s3Preloaded = false;
        let widgetTriggered = false;

        const splitPonte = new SplitText(textRefs.current.ponte, { type: "lines,words", linesClass: "split-line" });
        const splitDragao = new SplitText(textRefs.current.dragao, { type: "lines,words", linesClass: "split-line" });
        const splitGuilda = new SplitText(textRefs.current.guilda, { type: "lines,words", linesClass: "split-line" });
        const splitPortaoLeft = new SplitText(portaoLeftRef.current, { type: "lines,words", linesClass: "split-line" });
        const splitPortaoRight = new SplitText(portaoRightRef.current, { type: "lines,words", linesClass: "split-line" });

        gsap.set([textRefs.current.ponte, textRefs.current.dragao, textRefs.current.guilda, textRefs.current.portao], { opacity: 1 });
        gsap.set([splitPonte.words, splitDragao.words, splitGuilda.words, splitPortaoLeft.words, splitPortaoRight.words], {
          y: 60,
          rotationX: -30,
          opacity: 0
        });

        const svgContainer = svgPathRef.current?.closest(`.${svgStyles.divSVGTransS2}`);
        if (svgPathRef.current && svgContainer) {
          gsap.set(svgContainer, { opacity: 1 });
          gsap.set(svgPathRef.current, {
            drawSVG: "0% 0%",
            attr: { "stroke-width": 0 },
          });
        }

        const tlDrone = gsap.timeline({
          paused: true,
          onUpdate: () => {
            const progress = tlDrone.progress();

            if (progress >= 0.5 && !s2Preloaded) {
              s2Preloaded = true;
              if (import.meta.env.DEV) console.log('⚡ Preloading S2 + Pattern + Imagem S2Trans no meio da Hero') ;
              document.documentElement.style.setProperty('--bg-img-s2Trans', `url(${imgTranS2Url})`);
              document.documentElement.style.setProperty('--bg-pattern', `url(${patternUrl})`);
              preloadImages([...section2Urls, patternUrl, imgTranS2Url]);
            }

            if (progress >= 0.9 && !s3Preloaded) {
              s3Preloaded = true;
              if (import.meta.env.DEV) console.log('⚡ Preloading S3 + Fontes no fim da Hero');
              document.documentElement.style.setProperty('--section3-image', `url(${imgS3Url})`);
              loadFontsDynamically();
              preloadImages([...section3Urls, imgS3Url]);
            }

            if (progress >= 0.9 && !widgetTriggered) {
              widgetTriggered = true;
              if (import.meta.env.DEV) console.log('⚡ Liberando script do widget Elfsight no fim da Hero');
              window.dispatchEvent(new Event(HERO_END_WIDGET_EVENT));
            }
          },
        });

        tlDrone.addLabel('start', 0);

        const totalWaypointDuration = WAYPOINTS.length - 1;
        const introDuration = totalWaypointDuration * 0.05;
        const trilhaRevealDuration = introDuration;

        tlDrone.to(trilhaContainerRef.current, {
          opacity: 1,
          duration: trilhaRevealDuration,
          ease: 'power2.out',
        }, introDuration);

        const totalSteps = WAYPOINTS.length - 1;

        for (let i = 1; i < WAYPOINTS.length; i++) {
          const point = WAYPOINTS[i];
          const currentPointNumber = i + 1;
          const finalTargetX = (currentPointNumber === 7) ? SCENE_TARGETS.dragon.x : point.targetX;
          const finalTargetY = (currentPointNumber === 7) ? SCENE_TARGETS.dragon.y : point.targetY;
          const finalTargetZ = (currentPointNumber === 7) ? SCENE_TARGETS.dragon.z : point.targetZ;

          tlDrone.to(cameraTarget.current, {
            x: point.x, y: point.y, z: point.z,
            targetX: finalTargetX, targetY: finalTargetY, targetZ: finalTargetZ,
            duration: 1,
            ease: 'sine.inOut',
          }, i === 1 ? 0 : undefined);

          if (trilhaPathActiveRef.current) {
            const targetPercent = Math.round((i / totalSteps) * 100);
            tlDrone.to(trilhaPathActiveRef.current, {
              drawSVG: `0% ${targetPercent}%`,
              duration: 1,
              ease: 'sine.inOut',
            }, "<");
          }

          Object.entries(TEXT_SCENES).forEach(([key, scene]) => {
            if (i === scene.enter) tlDrone.addLabel(`text_${key}Enter`, "-=1");
            if (i === scene.exit) tlDrone.addLabel(`text_${key}Exit`, "-=1");
          });

          Object.entries(ICON_SCENES).forEach(([key, scene]) => {
            if (i === scene.enter) tlDrone.addLabel(`icon_${key}Enter`, "-=1");
            if (i === scene.exit) tlDrone.addLabel(`icon_${key}Exit`, "-=1");
          });
        }

        const STAGGER_TIME = 0.02;

        tlDrone
          .to(splitPonte.words, { y: 0, rotationX: 0, opacity: 1, duration: 0.5, stagger: STAGGER_TIME, ease: "power3.out" }, "text_ponteEnter")
          .to(splitPonte.words, { y: -60, rotationX: 30, opacity: 0, duration: 0.4, stagger: STAGGER_TIME, ease: "power3.in" }, "text_ponteExit");

        tlDrone
          .to(splitDragao.words, { y: 0, rotationX: 0, opacity: 1, duration: 0.5, stagger: STAGGER_TIME, ease: "power3.out" }, "text_dragaoEnter")
          .to(splitDragao.words, { y: -60, rotationX: 30, opacity: 0, duration: 0.4, stagger: STAGGER_TIME, ease: "power3.in" }, "text_dragaoExit");

        tlDrone
          .fromTo(textRefs.current.guilda,
            { z: -500, opacity: 0 },
            { z: 0, opacity: 1, duration: 0.6, ease: "power2.out", force3D: true },
            "text_guildaEnter"
          )
          .to(splitGuilda.words, { y: 0, rotationX: 0, opacity: 1, duration: 0.5, stagger: STAGGER_TIME, ease: "power3.out" }, "text_guildaEnter")
          .to(textRefs.current.guilda, { z: 3500, duration: 1.4, ease: "power2.in", force3D: true }, "text_guildaEnter+=0.8")
          .to(textRefs.current.guilda, { opacity: 0, duration: 0.3, ease: "none" }, "text_guildaEnter+=1.9");

        tlDrone
          .to(splitPortaoLeft.words, { y: 0, rotationX: 0, opacity: 1, duration: 0.5, stagger: STAGGER_TIME, ease: "power3.out" }, "text_portaoEnter")
          .to(splitPortaoRight.words, { y: 0, rotationX: 0, opacity: 1, duration: 0.5, stagger: STAGGER_TIME, ease: "power3.out" }, "text_portaoEnter+=0.1")
          .to(splitPortaoLeft.words, { y: -60, rotationX: 30, opacity: 0, duration: 0.4, ease: "power3.in" }, "text_portaoExit")
          .to(splitPortaoRight.words, { y: -60, rotationX: 30, opacity: 0, duration: 0.4, ease: "power3.in" }, "text_portaoExit")
          .to(portaoLeftRef.current, { x: -150, opacity: 0, ease: "power2.in", duration: 0.5 }, "text_portaoExit")
          .to(portaoRightRef.current, { x: 150, opacity: 0, ease: "power2.in", duration: 0.5 }, "text_portaoExit");

        if (svgPathRef.current && svgContainer) {
          tlDrone
            .to(svgContainer, { opacity: 1, duration: 0.1 })
            .to(svgPathRef.current, { drawSVG: "0% 100%", attr: { "stroke-width": 600 }, ease: "power1.in", duration: 1.5 }, "<");
        }

        Object.entries(ICON_SCENES).forEach(([key, scene]) => {
          const enterLabel = `icon_${key}Enter`;
          const exitLabel = `icon_${key}Exit`;

          if (tlDrone.labels[enterLabel] === undefined) return;

          tlDrone.to(scene.ref.current, {
            filter: 'grayscale(0%) opacity(1)',
            scale: 1.5,
            duration: 0.5,
            ease: 'back.out(1.7)',
          }, enterLabel);

          if (tlDrone.labels[exitLabel] !== undefined) {
            tlDrone.to(scene.ref.current, {
              scale: 1,
              duration: 0.5,
              ease: 'power2.out',
            }, exitLabel);
          }
        });

        Object.entries(STOP_OFFSETS).forEach(([key, offset]) => {
          const enterLabel = `text_${key}Enter`;
          if (tlDrone.labels[enterLabel] !== undefined) {
            tlDrone.addLabel(`stop_${key}`, `${enterLabel}+=${offset}`);
          }
        });

        tlDrone.addLabel('end', tlDrone.duration());
        tlDroneRef.current = tlDrone;

        const pinTrigger = ScrollTrigger.create({
          trigger: sectionHeroRef.current,
          start: 'top top',
          end: `+=${(STOP_LABELS.length - 1) * 100}%`,
          pin: heroBeltRef.current,
          pinSpacing: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            if (isInternalScrollRef.current) return;

            const targetIndex = Math.round(self.progress * (STOP_LABELS.length - 1));
            if (targetIndex !== stopIndexRef.current) {
              tlDrone.seek(STOP_LABELS[targetIndex]);
              stopIndexRef.current = targetIndex;
              setStopIndex(targetIndex);
            }
          },
        });

        pinTriggerRef.current = pinTrigger;
      }, sectionHeroRef);
    }

    const idleId = ('requestIdleCallback' in window)
      ? requestIdleCallback(setup, { timeout: 1500 })
      : setTimeout(setup, 1);

    return () => {
      cancelled = true;
      ctx?.revert();
      tlDroneRef.current = null;
      pinTriggerRef.current = null;
      if ('requestIdleCallback' in window && 'cancelIdleCallback' in window) {
        cancelIdleCallback(idleId);
      } else {
        clearTimeout(idleId);
      }
    };
  }, [isMobile]);

  return (
    <section className={styles.hero} ref={sectionHeroRef}>
      <div className={styles.heroBelt} ref={heroBeltRef}>
        <div className={styles.canvasContainer} ref={canvasContainerRef}>
          {mount3D && (
            <Suspense fallback={<div className="loading-spinner">Carregando cenário...</div>}>
              <HeroCanvas isMobile={isMobile} cameraTarget={cameraTarget} />
            </Suspense>
          )}

          <SvgTrans ref={svgPathRef} />

          <div className={styles.trilhaOverlay}>
            <TrilhaHero
              ref={trilhaContainerRef}
              iconRefs={trilhaIconRefs}
              activePathRef={trilhaPathActiveRef}
            />
          </div>

          <div className={styles.navControls} aria-label="Controle de navegação da cena">
            <button
              type="button"
              className={styles.navButton}
              onClick={goPrev}
              disabled={isAnimating || stopIndex === 0}
              aria-label="Cena anterior"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
                <path d="M6 15l6-6 6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              type="button"
              className={styles.navButton}
              onClick={goNext}
              disabled={isAnimating || stopIndex === STOP_LABELS.length - 1}
              aria-label="Próxima cena"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
                <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <span className={styles.srOnly} aria-live="polite">
              {`Cena ${stopIndex + 1} de ${STOP_LABELS.length}`}
            </span>
          </div>

          <section className={styles.textOverlayContainer} role="region" aria-label="Introdução Montanha Burguer">
            {HERO_SCENES.map((scene) => {
              if (scene.type === 'wrapper') {
                return (
                  <h2
                    key={scene.id}
                    className={`${styles.sceneText} ${styles.portaoWrapper}`}
                    style={getDynamicStyles(scene)}
                    ref={(el) => (textRefs.current[scene.refKey] = el)}
                  >
                    <span className="sr-only">
                      O portal está aberto. Deixe o mundo virtual e venha viver a experiência real na nossa verdadeira fortaleza do sabor!
                    </span>
                    <span aria-hidden="true" style={{ display: 'contents' }}>
                      <span className={styles.portaoLeft} ref={portaoLeftRef}>
                        {scene.tokensLeft.map((token, i) => (
                          <React.Fragment key={i}>{token.text}</React.Fragment>
                        ))}
                      </span>
                      <span className={styles.portaoRight} ref={portaoRightRef}>
                        {scene.tokensRight.map((token, i) => (
                          <strong key={i} style={token.highlight ? { color: '#e5b82e', fontWeight: 700 } : { color: 'inherit', fontWeight: 'inherit' }}>
                            {token.text}
                          </strong>
                        ))}
                      </span>
                    </span>
                  </h2>
                );
              }

              const fullText = scene.tokens.map(t => t.text).join('');

              return (
                <h1
                  key={scene.id}
                  className={styles.sceneText}
                  style={getDynamicStyles(scene)}
                  ref={(el) => (textRefs.current[scene.refKey] = el)}
                >
                  <span className="sr-only">{fullText}</span>
                  <span aria-hidden="true" style={{ display: 'contents' }}>
                    {scene.tokens.map((token, i) => {
                      if (token.highlight) return <strong key={i}>{token.text}</strong>;
                      if (token.alert) return <span key={i} className={styles.cuidado}>{token.text}</span>;
                      return <React.Fragment key={i}>{token.text}</React.Fragment>;
                    })}
                  </span>
                </h1>
              );
            })}
          </section>
        </div>
      </div>
    </section>
  );
}