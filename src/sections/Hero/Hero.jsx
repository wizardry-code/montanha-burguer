//importação de pluggins e variados
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import * as THREE from 'three';

//importação de componentes
import { Castelo } from '../../components/Castelo/Castelo.jsx';
import { Stars } from '@react-three/drei';
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

// --- IMPORTS DE ASSETS PARA INJEÇÃO DINÂMICA ---
import imgTranS2Url from '../../assets/imgs/section2/imgTranS2.avif';
import patternUrl from '../../assets/pattern/patternCompress.webp';
import imgS3Url from '../../assets/imgs/section2/imgS3.avif';

// ATENÇÃO: Confira se os caminhos e nomes exatos das fontes no seu projeto coincidem com estes abaixo:
import fontCinzelUrl from '../../assets/fonts/Cinzel/cinzel-v26-latin-regular.woff2';
import fontMerriweatherUrl from '../../assets/fonts/Merriweather/static/merriweather-v33-latin-regular.woff2';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, ScrollSmoother);

// --- MAPS DE IMAGENS DAS SEÇÕES ---
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

// Helper para Injeção Dinâmica de Fontes via JS
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

// Helper de Preload de Imagens
const preloadImages = (urls) => {
  urls.forEach((url) => {
    const img = new Image();
    img.fetchPriority = 'low';
    img.src = url;
  });
};

export const HERO_END_WIDGET_EVENT = 'heroEndWidgetReady';

// ============================================================
// 1) PARADAS DE LEITURA — AJUSTE AQUI
// ------------------------------------------------------------
// Cada texto tem uma animação de entrada (SplitText) que começa
// no label "text_<chave>Enter". Nesse instante exato o texto
// AINDA NÃO está visível (está começando a subir/aparecer).
// Por isso a "parada" real de leitura fica em um label separado
// ("stop_<chave>"), posicionado esse tanto de segundos DEPOIS
// do enter — dando tempo da revelação terminar antes de pausar.
//
// Aumente o valor se a parada ainda pegar o texto em animação.
// Diminua se o usuário ficar esperando parado com o texto já
// visível há muito tempo antes do clique liberar a leitura.
//
// ⚠️ "guilda" tem uma segunda animação que FAZ O TEXTO VOAR PARA
// LONGE em "text_guildaEnter+=0.8". O offset de "guilda" abaixo
// PRECISA ser menor que 0.8, senão a parada acontece durante o
// texto já saindo de cena.
// ============================================================
const STOP_OFFSETS = {
  ponte: 1.0,
  dragao: 1.2,
  guilda: 1.25,
  portao: 1.2,
};

// Duração (em segundos) de cada "salto" entre paradas — tanto da
// câmera/texto quanto do scroll real da página (ver seção 2).
const STOP_TRAVEL_DURATION = 3.6;

// 3) Ease pedido: velocidade constante, sem acelerar/desacelerar.
const STOP_TRAVEL_EASE = 'none';

// Limiar mínimo de deltaY/swipe para considerar como intenção real
// de navegar (evita disparos com scroll residual de trackpad).
const WHEEL_THRESHOLD = 5;
const TOUCH_THRESHOLD = 40;

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

  // --- NAVEGAÇÃO / PIN ---
  // Paradas = label inicial + uma "stop_<chave>" por texto + label final.
  const STOP_LABELS = useRef(
    ['start', ...Object.keys(TEXT_SCENES).map((key) => `stop_${key}`), 'end']
  ).current;

  const tlDroneRef = useRef(null);
  const pinTriggerRef = useRef(null);

  // Refs = fonte da verdade para os handlers de wheel/touch (evita closures
  // desatualizadas). State = só para re-renderizar a UI (botões/contador).
  const stopIndexRef = useRef(0);
  const isAnimatingRef = useRef(false);
  const isInternalScrollRef = useRef(false); // true enquanto SOMOS nós movendo o scroll

  const [stopIndex, setStopIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const goToStop = useCallback((direction) => {
    const tl = tlDroneRef.current;
    const pinST = pinTriggerRef.current;
    if (!tl || !pinST || isAnimatingRef.current) return;

    const nextIndex = stopIndexRef.current + direction;
    if (nextIndex < 0 || nextIndex >= STOP_LABELS.length) return;

    isAnimatingRef.current = true;
    setIsAnimating(true);

    // Anima a câmera/texto até a próxima parada
    tl.tweenTo(STOP_LABELS[nextIndex], {
      duration: STOP_TRAVEL_DURATION,
      ease: STOP_TRAVEL_EASE,
    });

    // ------------------------------------------------------------
    // 2) SINCRONIA COM O SCROLL REAL (ScrollSmoother)
    // ------------------------------------------------------------
    // Movemos a posição real de scroll junto com a animação, para
    // que o restante do site (outras seções com trigger baseado em
    // "50% da Hero", scrollbar, etc.) veja a Hero "avançando" de
    // verdade — mesmo o usuário controlando via botão/scroll-lock.
    const smoother = ScrollSmoother.get();
    const targetScroll = pinST.start + (nextIndex / (STOP_LABELS.length - 1)) * (pinST.end - pinST.start);

    isInternalScrollRef.current = true;
    if (smoother) {
      // ScrollSmoother expõe scrollTop() como getter/setter "tweenable"
      gsap.to(smoother, {
        scrollTop: targetScroll,
        duration: STOP_TRAVEL_DURATION,
        ease: STOP_TRAVEL_EASE,
      });
    } else {
      // Fallback caso o ScrollSmoother não esteja ativo nessa página
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

  // Atalho de teclado (setas)
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

  // ------------------------------------------------------------
  // 2) INTERCEPTA SCROLL "NORMAL" (wheel/touch) E TRANSFORMA EM
  // "avançar/retroceder 1 parada", em vez de deixar o usuário
  // rolar livremente (o que pulava a Hero inteira antes).
  // Nas bordas (primeira/última parada), libera o comportamento
  // nativo para o usuário conseguir sair da seção normalmente.
  // ------------------------------------------------------------
  useEffect(() => {
    const section = sectionHeroRef.current;
    if (!section) return;

    const handleWheel = (e) => {
      if (!pinTriggerRef.current?.isActive) return;
      if (Math.abs(e.deltaY) < WHEEL_THRESHOLD) return;

      const goingDown = e.deltaY > 0;
      if (goingDown && stopIndexRef.current >= STOP_LABELS.length - 1) return; // deixa sair pra próxima seção
      if (!goingDown && stopIndexRef.current <= 0) return; // deixa sair pra seção anterior

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
      const deltaY = touchStartY - currentY; // positivo = dedo subindo = quer ir pra frente

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

    // Reseta a navegação sempre que a timeline é reconstruída (ex: troca mobile/desktop)
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

        // Timeline PAUSADA — controlada via tweenTo() pelos botões/scroll-lock,
        // não mais via scrub de ScrollTrigger.
        const tlDrone = gsap.timeline({
          paused: true,
          onUpdate: () => {
            const progress = tlDrone.progress();

            if (progress >= 0.5 && !s2Preloaded) {
              s2Preloaded = true;
              if (import.meta.env.DEV) console.log('⚡ Preloading S2 + Pattern + Imagem S2Trans no meio da Hero');
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

        // ------------------------------------------------------------
        // 1) LABELS DE PARADA — ver STOP_OFFSETS no topo do arquivo.
        // Criadas depois de todos os tweens de texto acima, porque
        // dependem dos labels "text_<chave>Enter" já existirem.
        // ------------------------------------------------------------
        Object.entries(STOP_OFFSETS).forEach(([key, offset]) => {
          const enterLabel = `text_${key}Enter`;
          if (tlDrone.labels[enterLabel] !== undefined) {
            tlDrone.addLabel(`stop_${key}`, `${enterLabel}+=${offset}`);
          }
        });

        // Marca o fim real da timeline (após todos os tweens acima)
        tlDrone.addLabel('end', tlDrone.duration());

        tlDroneRef.current = tlDrone;

        // ------------------------------------------------------------
        // 2) PIN — trava a seção por uma distância de scroll real,
        // proporcional ao número de paradas (100vh por transição).
        // Não faz scrub: quem move a timeline são os botões/wheel/touch
        // (ver goToStop) ou saltos externos (âncora do header, drag na
        // scrollbar), tratados no onUpdate abaixo.
        // ------------------------------------------------------------
        const pinTrigger = ScrollTrigger.create({
          trigger: sectionHeroRef.current,
          start: 'top top',
          end: `+=${(STOP_LABELS.length - 1) * 100}%`,
          pin: heroBeltRef.current,
          pinSpacing: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            // Se fomos nós que movemos o scroll (goToStop), ignora —
            // já estamos cuidando da timeline via tweenTo.
            if (isInternalScrollRef.current) return;

            // Salto externo: âncora do header, drag na scrollbar, etc.
            // Ajusta a cena INSTANTANEAMENTE (sem tween longo) para a
            // parada mais próxima da nova posição de scroll.
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

          {/* Controles de navegação por cena */}
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