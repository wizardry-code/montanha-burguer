//importação de pluggins e variados
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';
import { debouncedRefresh } from '../../utils/gsapRefresh';

//importação de componentes
import { Castelo } from '../../components/Castelo/Castelo.jsx';
import { Stars } from '@react-three/drei';
import { HERO_SCENES } from '../../utils/heroConfig.js';
import { SvgTrans } from '../../components/ui/svgs/SvgTrans/SvgTrans.jsx';
import TrilhaHero from '../../components/TrilhaHero/TrilhaHero.jsx';
import ScrollIndicator from '../../components/ScrollIndicator/ScrollIndicator.jsx';

//importação de dados (extraídos para facilitar leitura e manutenção)
import { SCENE_TARGETS } from '../../data/hero/sceneTargets.js';
import { WAYPOINTS } from '../../data/hero/waypoints.js';
import { TEXT_SCENES } from '../../data/hero/textScenes.js';
import { ICON_SCENE_CONFIG } from '../../data/hero/iconSceneConfig.js';

//importação de estilos
import styles from './Hero.module.css';
import svgStyles from '../../components/ui/svgs/SvgTrans/SvgTrans.module.css';

// Só o ScrollTrigger é registrado de forma estática — é leve e precisa
// estar pronto assim que o componente monta (pin da section).
// DrawSVGPlugin e SplitText (GSAP Club, pesados) são carregados via
// dynamic import lá dentro do useEffect, fora do caminho crítico.
gsap.registerPlugin(ScrollTrigger);

// --- PRELOADS DE IMAGENS E PATTERNS ---
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

// Debug removido do build de produção — antes tinha "|| true" e rodava
// sempre, custando serialização de arrays grandes em cada carregamento.
if (import.meta.env.DEV) {
  console.log('DEBUG section2Urls:', section2Urls.length, section2Urls);
  console.log('DEBUG section3Urls:', section3Urls.length, section3Urls);
}

import patternUrl from '../../assets/pattern/patternCompress.webp';

const preloadImages = (urls) => {
  urls.forEach((url) => {
    const img = new Image();
    img.fetchPriority = 'low';
    img.src = url;
  });
};

// Nome do evento customizado que avisa a Avaliacoes.jsx que já pode
// injetar o script pesado do Elfsight (536KB). Componentes IRMÃOS
// (Hero e Avaliacoes, que vive dentro da Section2) se comunicam via
// window custom event, sem precisar de prop drilling/contexto.
export const HERO_END_WIDGET_EVENT = 'heroEndWidgetReady';

function CameraRig({ cameraTarget, onUpdateLiveCoords }) {
  const lookAtVector = useRef(
    new THREE.Vector3(WAYPOINTS[0].targetX, WAYPOINTS[0].targetY, WAYPOINTS[0].targetZ)
  ).current;
  const cameraDirection = useRef(new THREE.Vector3()).current;
  const timerAcc = useRef(0);
  const DAMP_FACTOR = 1.8;

  useFrame((state, delta) => {
    const t = cameraTarget.current;
    if (!t) return;

    state.camera.position.x = THREE.MathUtils.damp(state.camera.position.x, t.x, DAMP_FACTOR, delta);
    state.camera.position.y = THREE.MathUtils.damp(state.camera.position.y, t.y, DAMP_FACTOR, delta);
    state.camera.position.z = THREE.MathUtils.damp(state.camera.position.z, t.z, DAMP_FACTOR, delta);

    lookAtVector.x = THREE.MathUtils.damp(lookAtVector.x, t.targetX, DAMP_FACTOR, delta);
    lookAtVector.y = THREE.MathUtils.damp(lookAtVector.y, t.targetY, DAMP_FACTOR, delta);
    lookAtVector.z = THREE.MathUtils.damp(lookAtVector.z, t.targetZ, DAMP_FACTOR, delta);

    state.camera.lookAt(lookAtVector);
    state.camera.getWorldDirection(cameraDirection);

    timerAcc.current += delta;

    if (onUpdateLiveCoords && timerAcc.current > 0.1) {
      timerAcc.current = 0;
      onUpdateLiveCoords({
        x: Number(state.camera.position.x.toFixed(2)),
        y: Number(state.camera.position.y.toFixed(2)),
        z: Number(state.camera.position.z.toFixed(2)),
        targetX: Number((state.camera.position.x + cameraDirection.x * 10).toFixed(2)),
        targetY: Number((state.camera.position.y + cameraDirection.y * 10).toFixed(2)),
        targetZ: Number((state.camera.position.z + cameraDirection.z * 10).toFixed(2)),
      });
    }
  });

  return null;
}

export default function Hero() {
  const [isMobile, setIsMobile] = useState(false);

  const sectionHeroRef = useRef(null);
  const heroBeltRef = useRef(null);
  const canvasContainerRef = useRef(null);
  const svgPathRef = useRef(null);
  const cameraTarget = useRef({ ...WAYPOINTS[0] });
  const textRefs = useRef({});
  const portaoLeftRef = useRef(null);
  const portaoRightRef = useRef(null);
  const [liveCoords, setLiveCoords] = useState({ x: 0, y: 0, z: 0, targetX: 0, targetY: 0, targetZ: 0 });

  const scrollIndicatorRef = useRef(null);
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

  // --- Effect 1: detecção de viewport (leve, síncrono) ---
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

  // --- Effect 2: monta o pin/scroll da Hero de forma imediata ---
  // Isso precisa acontecer cedo pra section já "travar" no scroll
  // certo assim que o usuário rolar, sem pulo de layout.
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(scrollIndicatorRef.current, { opacity: 1, scale: 1 });
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

  // --- Effect 3: timeline pesada de texto/ícones (SplitText + DrawSVG) ---
  // Adiada com requestIdleCallback: os plugins pesados do GSAP só são
  // baixados e a timeline só é montada depois que o browser já deu
  // conta do primeiro paint. Isso tira SplitText (forced reflow) e os
  // plugins do caminho crítico de renderização.
  useEffect(() => {
    let ctx;
    let cancelled = false;

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
          scrollTrigger: {
            trigger: sectionHeroRef.current,
            pin: heroBeltRef.current,
            start: 'top top',
            end: '+=500%',
            scrub: 1.8,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              // Meio do voo da Hero (~50% do scroll do pin): Baixa Section 2 + Pattern
              if (self.progress >= 0.5 && !s2Preloaded) {
                s2Preloaded = true;
                if (import.meta.env.DEV) console.log('⚡ Preloading S2 + Pattern no meio da Hero');
                preloadImages([...section2Urls, patternUrl]);
              }

              // Quase no fim da Hero (~90% do scroll do pin): Baixa Section 3
              // e avisa a Avaliacoes.jsx que já pode injetar o script pesado
              // do Elfsight (536KB) — em vez de carregar no mount do componente.
              if (self.progress >= 0.9 && !s3Preloaded) {
                s3Preloaded = true;
                if (import.meta.env.DEV) console.log('⚡ Preloading S3 no fim da Hero');
                preloadImages(section3Urls);
              }

              if (self.progress >= 0.9 && !widgetTriggered) {
                widgetTriggered = true;
                if (import.meta.env.DEV) console.log('⚡ Liberando script do widget Elfsight no fim da Hero');
                window.dispatchEvent(new Event(HERO_END_WIDGET_EVENT));
              }
            },
          },
        });

        const totalWaypointDuration = WAYPOINTS.length - 1;
        const introDuration = totalWaypointDuration * 0.05;
        const trilhaRevealDuration = introDuration;

        tlDrone.to(scrollIndicatorRef.current, {
          opacity: 0,
          scale: 0.7,
          duration: introDuration,
          ease: 'power2.out',
        }, 0);

        tlDrone.to(trilhaContainerRef.current, {
          opacity: 1,
          duration: trilhaRevealDuration,
          ease: 'power2.out',
        }, introDuration);

        const totalSteps = WAYPOINTS.length - 1;

        for (let i = 1; i < WAYPOINTS.length; i++) {
          const point = WAYPOINTS[i];
          const currentPointNumber = i + 1;
          const finalTargetX = (currentPointNumber === 6) ? SCENE_TARGETS.dragon.x : point.targetX;
          const finalTargetY = (currentPointNumber === 6) ? SCENE_TARGETS.dragon.y : point.targetY;
          const finalTargetZ = (currentPointNumber === 6) ? SCENE_TARGETS.dragon.z : point.targetZ;

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
        debouncedRefresh();
      }, sectionHeroRef);
    }

    const idleId = ('requestIdleCallback' in window)
      ? requestIdleCallback(setup, { timeout: 1500 })
      : setTimeout(setup, 1);

    return () => {
      cancelled = true;
      ctx?.revert();
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
          <Canvas shadows={{ type: THREE.PCFShadowMap }} camera={{ position: [WAYPOINTS[0].x, WAYPOINTS[0].y, WAYPOINTS[0].z], fov: 90 }}>
            <ambientLight intensity={0.2} />
            <directionalLight castShadow position={[25, 40, 20]} intensity={1.5} shadow-mapSize={[2048, 2048]} shadow-camera-far={200} shadow-camera-left={-60} shadow-camera-right={60} shadow-camera-top={60} shadow-camera-bottom={-60} shadow-bias={-0.0005} />
            <color attach="background" args={['#050811']} />
            <fog attach="fog" args={['#050811', 40, 180]} />
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
            <Castelo />
            <CameraRig cameraTarget={cameraTarget} onUpdateLiveCoords={setLiveCoords} />
          </Canvas>

          <SvgTrans ref={svgPathRef} />

          <div className={styles.trilhaOverlay}>
            <TrilhaHero
              ref={trilhaContainerRef}
              iconRefs={trilhaIconRefs}
              activePathRef={trilhaPathActiveRef}
            />
          </div>
          <ScrollIndicator ref={scrollIndicatorRef} />

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