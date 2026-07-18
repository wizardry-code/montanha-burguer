import React, { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';

import { Castelo } from '../Castelo.jsx';
import styles from './Hero.module.css';

gsap.registerPlugin(ScrollTrigger);

// Alvos estáticos da cena para travar o olhar nos momentos críticos
const SCENE_TARGETS = {
  dragon: new THREE.Vector3(10.13, 35.34, 56.16),  // Posição central do Dragão
  fire: new THREE.Vector3(4.40, 20.24, 54.95),     // Ponto médio do fogo azul
  castle: new THREE.Vector3(-0.42, 25.97, 19.19)   // Entrada principal do Castelo
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
  const heroBeltRef = useRef(null);
  const canvasContainerRef = useRef(null);
  const textRefs = useRef([]);
  const cameraTarget = useRef({ ...WAYPOINTS[0] });

  const [liveCoords, setLiveCoords] = useState({ x: 0, y: 0, z: 0, targetX: 0, targetY: 0, targetZ: 0 });

  useEffect(() => {
    gsap.set(textRefs.current[0], { opacity: 1 });
    gsap.set(textRefs.current.slice(1), { opacity: 0 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: heroBeltRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.8,
      },
    });

    const dragonTarget = SCENE_TARGETS.dragon;

    for (let i = 1; i < WAYPOINTS.length; i++) {
      const point = WAYPOINTS[i];
      const currentPointNumber = i + 1;

      // MODIFICAÇÃO SOLICITADA: Força o olhar fixo no Dragão entre os pontos 05 e 09
      const finalTargetX = (currentPointNumber >= 6 && currentPointNumber <= 7) ? dragonTarget.x : point.targetX;
      const finalTargetY = (currentPointNumber >= 6 && currentPointNumber <= 7) ? dragonTarget.y : point.targetY;
      const finalTargetZ = (currentPointNumber >= 6 && currentPointNumber <= 7) ? dragonTarget.z : point.targetZ;

      tl.to(cameraTarget.current, {
        x: point.x,
        y: point.y,
        z: point.z,
        targetX: finalTargetX,
        targetY: finalTargetY,
        targetZ: finalTargetZ,
        duration: 1,
        ease: 'sine.inOut',
      })
        .to(textRefs.current[i - 1], { opacity: 0, duration: 0.3 }, '<')
        .to(textRefs.current[i], { opacity: 1, duration: 0.3 }, '<0.15');
    }

    return () => {
      if (tl.scrollTrigger) tl.scrollTrigger.kill();
      tl.kill();
    };
  }, []);

  const copyToClipboard = () => {
    const formattedString = `  { x: ${liveCoords.x.toFixed(2)}, y: ${liveCoords.y.toFixed(2)}, z: ${liveCoords.z.toFixed(2)}, targetX: ${liveCoords.targetX.toFixed(2)}, targetY: ${liveCoords.targetY.toFixed(2)}, targetZ: ${liveCoords.targetZ.toFixed(2)} },`;
    
    navigator.clipboard.writeText(formattedString)
      .then(() => console.log("Copiado corrigido:", formattedString))
      .catch(err => console.error("Erro ao copiar: ", err));
  };

  return (
    <section className={styles.hero}>
        <div className={styles.heroBelt} ref={heroBeltRef}>
                <div className={styles.canvasContainer} ref={canvasContainerRef}>
                    <Canvas camera={{ position: [WAYPOINTS[0].x, WAYPOINTS[0].y, WAYPOINTS[0].z], fov: 90 }}>
                        <ambientLight intensity={0.6} />
                        <directionalLight position={[5, 10, 5]} intensity={1} />

                        <Castelo />

                        <CameraRig cameraTarget={cameraTarget} onUpdateLiveCoords={setLiveCoords} />
                    </Canvas>
                </div>
            </div>
    </section>
);
}