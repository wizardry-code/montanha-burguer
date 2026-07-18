import React, { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';
import { DrawSVGPlugin } from 'gsap/all';
import { Castelo } from '../Castelo.jsx';
import styles from './Hero.module.css';
import { Stars } from '@react-three/drei';

gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin);

const SCENE_TARGETS = {
  dragon: new THREE.Vector3(10.13, 35.34, 56.16),
  fire: new THREE.Vector3(4.40, 20.24, 54.95),
  castle: new THREE.Vector3(-0.42, 25.97, 19.19)
};

const WAYPOINTS = [
  { x: -47.63, y: 35.78, z: 44.66, targetX: -46.73, targetY: 35.27, targetZ: 44.22 },
  { x: -33.32, y: 29.15, z: 38.50, targetX: -32.52, targetY: 28.34, targetZ: 37.90 },
  { x: -33.32, y: 29.15, z: 38.50, targetX: -32.52, targetY: 28.34, targetZ: 37.90 },
  { x: -18.30, y: 18.36, z: 25.17, targetX: -17.35, targetY: 17.46, targetZ: 24.88 },
  { x: -12.05, y: 5.69, z: 22.97, targetX: -11.06, targetY: 6.57, targetZ: 22.84 },
  { x: -6.20, y: 20.62, z: 36.55, targetX: 10.92, targetY: 29.94, targetZ: 19.60 },
  { x: -5.32, y: 22.66, z: 36.94, targetX: -4.79, targetY: 23.19, targetZ: 36.09 },
  { x: -1.06, y: 24.80, z: 46.96, targetX: -0.07, targetY: 25.02, targetZ: 46.79 },
  { x: 8.02, y: 24.85, z: 48.08, targetX: 8.47, targetY: 24.75, targetZ: 47.19 },
  { x: 14.04, y: 27.80, z: 38.99, targetX: 13.52, targetY: 27.63, targetZ: 38.13 },
  { x: 12.66, y: 28.95, z: 31.13, targetX: 12.01, targetY: 28.67, targetZ: 30.37 },
  { x: -0.29, y: 26.14, z: 20.18, targetX: -0.42, targetY: 25.97, targetZ: 19.19 },
  { x: -0.95, y: 22.90, z: 9.71, targetX: -0.96, targetY: 22.75, targetZ: 8.71 },
  { x: -0.93, y: 19.47, z: -3.76, targetX: -0.90, targetY: 19.33, targetZ: -4.76 },
  { x: -6.00, y: 14.16, z: -17.86, targetX: -6.06, targetY: 13.84, targetZ: -18.86 },
  { x: -10.41, y: 6.83, z: -33.91, targetX: -9.94, targetY: 6.50, targetZ: -34.79 },
  { x: -5.81, y: 4.11, z: -41.96, targetX: -5.07, targetY: 3.83, targetZ: -42.63 },
  { x: -2.51, y: 2.89, z: -46.07, targetX: -1.65, targetY: 2.75, targetZ: -46.59 },
  { x: 3.67, y: 2.47, z: -49.67, targetX: 4.53, targetY: 2.42, targetZ: -50.18 },
  { x: 2.52, y: 2.90, z: -54.58, targetX: 2.40, targetY: 3.33, targetZ: -55.58 },
  { x: -3.10, y: 8.50, z: -63.89, targetX: -3.20, targetY: 9.23, targetZ: -64.89 },
  { x: -1.69, y: 12.11, z: -64.12, targetX: -1.62, targetY: 12.67, targetZ: -65.12 },
  { x: -1.04, y: 15.09, z: -70.40, targetX: -0.94, targetY: 15.43, targetZ: -71.40 },
  { x: -1.85, y: 17.34, z: -76.78, targetX: -1.84, targetY: 17.66, targetZ: -77.78 },
  { x: -0.77, y: 18.88, z: -81.34, targetX: -0.75, targetY: 19.20, targetZ: -82.34 },
  { x: -0.53, y: 19.40, z: -85.09, targetX: -0.49, targetY: 19.55, targetZ: -86.09 },
];

// Índices de waypoint onde cada cena entra/sai.
// AJUSTE AQUI depois de ver o resultado — é o "match" com o ritmo visual do voo.
const SCENES = {
  ponte:  { enter: 1,  exit: 4  },
  dragao: { enter: 6,  exit: 11},
  guilda: { enter: 18,  exit: 19 },
  portao: { enter: 23, exit: 25 },
};

function CameraRig({ cameraTarget, onUpdateLiveCoords }) {
  const lookAtVector = useRef(
    new THREE.Vector3(WAYPOINTS[0].targetX, WAYPOINTS[0].targetY, WAYPOINTS[0].targetZ)
  ).current;

  const cameraDirection = useRef(new THREE.Vector3()).current;
  const DAMP_FACTOR = 1.8;

  useFrame((state, delta) => {
    const t = cameraTarget.current;

    state.camera.position.x = THREE.MathUtils.damp(state.camera.position.x, t.x, DAMP_FACTOR, delta);
    state.camera.position.y = THREE.MathUtils.damp(state.camera.position.y, t.y, DAMP_FACTOR, delta);
    state.camera.position.z = THREE.MathUtils.damp(state.camera.position.z, t.z, DAMP_FACTOR, delta);

    lookAtVector.set(
      THREE.MathUtils.damp(lookAtVector.x, t.targetX, DAMP_FACTOR, delta),
      THREE.MathUtils.damp(lookAtVector.y, t.targetY, DAMP_FACTOR, delta),
      THREE.MathUtils.damp(lookAtVector.z, t.targetZ, DAMP_FACTOR, delta)
    );

    state.camera.lookAt(lookAtVector);
    state.camera.getWorldDirection(cameraDirection);

    const liveTargetX = state.camera.position.x + cameraDirection.x * 10;
    const liveTargetY = state.camera.position.y + cameraDirection.y * 10;
    const liveTargetZ = state.camera.position.z + cameraDirection.z * 10;

    onUpdateLiveCoords({
      x: state.camera.position.x,
      y: state.camera.position.y,
      z: state.camera.position.z,
      targetX: liveTargetX,
      targetY: liveTargetY,
      targetZ: liveTargetZ,
    });
  });

  return null;
}

export default function Hero() {
  const sectionHeroRef = useRef(null);
  const heroBeltRef = useRef(null);
  const canvasContainerRef = useRef(null);
  const svgPathRef = useRef(null);
  const cameraTarget = useRef({ ...WAYPOINTS[0] });

  // Refs de texto — um por cena, mais os dois "metades" da cena do portão
  const textRefs = useRef({});
  const portaoLeftRef = useRef(null);
  const portaoRightRef = useRef(null);

  const [liveCoords, setLiveCoords] = useState({ x: 0, y: 0, z: 0, targetX: 0, targetY: 0, targetZ: 0 });

  useEffect(() => {
    // Estado inicial: todos os textos invisíveis
    Object.values(textRefs.current).forEach((el) => {
      if (el) gsap.set(el, { opacity: 0 });
    });

    const svgContainer = svgPathRef.current?.closest(`.${styles.divSVGTransS2}`);

    if (svgPathRef.current && svgContainer) {
      gsap.set(svgContainer, { opacity: 0 });
      gsap.set(svgPathRef.current, {
        drawSVG: "0% 0%",
        attr: { "stroke-width": 0 }
      });
    }

    const tlDrone = gsap.timeline({
      scrollTrigger: {
        trigger: heroBeltRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.8,
        invalidateOnRefresh: true,
      },
    });

    const dragonTarget = SCENE_TARGETS.dragon;

    // 1. Loop de câmera + cravação de labels de cena
    for (let i = 1; i < WAYPOINTS.length; i++) {
      const point = WAYPOINTS[i];
      const currentPointNumber = i + 1;

      const finalTargetX = (currentPointNumber == 6) ? dragonTarget.x : point.targetX;
      const finalTargetY = (currentPointNumber == 6) ? dragonTarget.y : point.targetY;
      const finalTargetZ = (currentPointNumber == 6) ? dragonTarget.z : point.targetZ;

      tlDrone.to(cameraTarget.current, {
        x: point.x,
        y: point.y,
        z: point.z,
        targetX: finalTargetX,
        targetY: finalTargetY,
        targetZ: finalTargetZ,
        duration: 1,
        ease: 'sine.inOut',
      });

      Object.entries(SCENES).forEach(([key, { enter, exit }]) => {
        if (i === enter) tlDrone.addLabel(`${key}Enter`, "<");
        if (i === exit) tlDrone.addLabel(`${key}Exit`, "<");
      });
    }

    // 2. Cena 1 — Ponte: fade simples
    if (textRefs.current.ponte) {
      tlDrone
        .fromTo(textRefs.current.ponte,
          { opacity: 0 },
          { opacity: 1, duration: 0.4, ease: "power1.inOut" },
          "ponteEnter"
        )
        .to(textRefs.current.ponte,
          { opacity: 0, duration: 0.4, ease: "power1.inOut" },
          "ponteExit"
        );
    }

    // 3. Cena 2 — Dragão: parallax lateral
    if (textRefs.current.dragao) {
      tlDrone
        .fromTo(textRefs.current.dragao,
          { opacity: 0, x: 60 },
          { opacity: 1, x: 0, duration: 0.3, ease: "power1.out" },
          "dragaoEnter"
        )
        .to(textRefs.current.dragao,
          { x: -70, ease: "none", duration: 1 },
          "dragaoEnter"
        )
        .to(textRefs.current.dragao,
          { opacity: 0, duration: 0.3, ease: "power1.in" },
          "dragaoExit"
        );
    }

    // 4. Cena 3 — Guilda: zoom infinito
    if (textRefs.current.guilda) {
      tlDrone
        .fromTo(textRefs.current.guilda,
          { opacity: 0, scale: 0.85 },
          { opacity: 1, scale: 1, duration: 0.25, ease: "power1.out" },
          "guildaEnter"
        )
        .to(textRefs.current.guilda,
          { scale: 9, opacity: 0, ease: "power2.in", duration: 0.75 },
          "guildaEnter+=0.25"
        );
    }

    // 5. Cena 4 — Portão: text split sincronizado com o gate 3D
    if (textRefs.current.portao) {
      tlDrone
        .fromTo(textRefs.current.portao,
          { opacity: 0 },
          { opacity: 1, duration: 0.3, ease: "power1.out" },
          "portaoEnter"
        )
        .to(portaoLeftRef.current,
          { x: -220, opacity: 0, ease: "power2.in", duration: 0.5 },
          "portaoExit"
        )
        .to(portaoRightRef.current,
          { x: 220, opacity: 0, ease: "power2.in", duration: 0.5 },
          "portaoExit"
        );
    }

    // 6. Handoff final: preenchimento do SVG (fica cobrindo a tela p/ Seção 2 assumir)
    if (svgPathRef.current && svgContainer) {
      tlDrone
        .to(svgContainer, { opacity: 1, duration: 0.1 })
        .to(svgPathRef.current, {
          drawSVG: "0% 100%",
          attr: { "stroke-width": 1200 },
          ease: "power1.in",
          duration: 1.5,
        }, "<");
    }

    return () => {
      if (tlDrone.scrollTrigger) tlDrone.scrollTrigger.kill();
      tlDrone.kill();
    };
  }, []);

  return (
    <section className={styles.hero} ref={sectionHeroRef}>
      <div className={styles.heroBelt} ref={heroBeltRef}>
        <div className={styles.canvasContainer} ref={canvasContainerRef}>
          <Canvas shadows
            camera={{ position: [WAYPOINTS[0].x, WAYPOINTS[0].y, WAYPOINTS[0].z], fov: 90 }}>
            <ambientLight intensity={0.2} />
            <directionalLight 
            castShadow
              position={[25, 40, 20]} // Ajuste para bater no ângulo do pôr do sol da foto 1
              intensity={1.5}
              shadow-mapSize-width={2048} // Resolução da sombra
              shadow-mapSize-height={2048}
              shadow-camera-far={200}
              shadow-camera-left={-60}
              shadow-camera-right={60}
              shadow-camera-top={60}
              shadow-camera-bottom={-60}
              shadow-bias={-0.0005} // Evita artefatos estranhos na geometria (shadow acne)
            />
            {/* Um tom de azul meia-noite muito escuro para dar contraste */}
            <color attach="background" args={['#050811']} /> 

            {/* 2. NÉVOA (Obrigatório ter a MESMA cor do background acima!) */}
            <fog attach="fog" args={['#050811', 40, 180]} />

            {/* 3. CAMPO ESTELAR 3D */}
            <Stars 
              radius={100}      // Distância das estrelas a partir do centro
              depth={50}        // Volume/profundidade do campo estelar
              count={5000}      // Quantidade de estrelas
              factor={4}        // Tamanho do brilho das estrelas
              saturation={0}    // 0 = estrelas brancas, 1 = estrelas coloridas
              fade              // Faz as estrelas distantes terem fade out
              speed={1}         // Velocidade da cintilação (piscar)
            />

            {/* Luzes, Castelo, CameraRig, EffectComposer continuam aqui para baixo... */}
            <ambientLight intensity={0.2} />
            <Castelo />
            <CameraRig cameraTarget={cameraTarget} onUpdateLiveCoords={setLiveCoords} />
          </Canvas>

          <div className={styles.divSVGTransS2}>
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
                strokeWidth="13"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Textos com semântica de SEO: h1 único (Cena 1) + h2 (Cenas 2, 3, 4) */}
          <section className={styles.textOverlayContainer} aria-label="Introdução Montanha Burguer">
            <h1
              className={`${styles.sceneText} ${styles.ponteText}`}
              ref={(el) => (textRefs.current.ponte = el)}
            >
              Atravesse a ponte entre o comum e o <strong>extraordinário</strong>.
              Bem-vindo ao reino onde grandes aventuras despertam{' '}
              <strong>grandes fomes</strong>.
            </h1>

            <h2
              className={`${styles.sceneText} ${styles.dragaoText}`}
              ref={(el) => (textRefs.current.dragao = el)}
            >
              <span className={styles.cuidado}>Cuidado!</span> Criaturas lendárias cobiçam nossas{' '}
              <strong>receitas secretas</strong>. Mas aqui, até o{' '}
              <strong>fogo do dragão</strong> trabalha para grelhar o burger perfeito.
            </h2>

            <h2
              className={`${styles.sceneText} ${styles.guildaText}`}
              ref={(el) => (textRefs.current.guilda = el)}
            >
              <strong>REÚNA SUA GALERA.</strong> As campanhas mais gloriosas são
              feitas ao lado dos aliados mais próximos. E depois do combate, a{' '}
              <strong>taverna</strong> aguarda para a festa.
            </h2>

            <h2
              className={`${styles.sceneText} ${styles.portaoWrapper}`}
              ref={(el) => (textRefs.current.portao = el)}
            >
              <span className={styles.portaoLeft} ref={portaoLeftRef}>
                O portal está aberto. Deixe o mundo virtual
              </span>
              <span className={styles.portaoRight} ref={portaoRightRef}>
                e venha viver a <strong>experiência real</strong> na nossa
                verdadeira <strong>fortaleza do sabor</strong>!
              </span>
            </h2>
          </section>
        </div>
      </div>
    </section>
  );
}