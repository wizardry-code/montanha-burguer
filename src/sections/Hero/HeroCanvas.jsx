import { Canvas, useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei/core/Stars';
import * as THREE from 'three';
import { useRef } from 'react';

import { Castelo } from '../../components/Castelo/Castelo.jsx';
import { WAYPOINTS } from '../../data/hero/waypoints.js';

function CameraRig({ cameraTarget }) {
// 1. INSTANCIAÇÃO OTIMIZADA: Evita criar um 'new Vector3' a cada render do React
const lookAtVector = useRef(null);
if (!lookAtVector.current) {
    lookAtVector.current = new THREE.Vector3(WAYPOINTS[0].targetX, WAYPOINTS[0].targetY, WAYPOINTS[0].targetZ);
}

const DAMP_FACTOR = 1.8;
const targetPos = useRef(new THREE.Vector3()).current;

useFrame((state, delta) => {
    const t = cameraTarget.current;
    if (!t) return;

    const cam = state.camera;
    
    targetPos.set(t.x, t.y, t.z);
    if (cam.position.distanceToSquared(targetPos) > 0.0001) {
    cam.position.x = THREE.MathUtils.damp(cam.position.x, t.x, DAMP_FACTOR, delta);
    cam.position.y = THREE.MathUtils.damp(cam.position.y, t.y, DAMP_FACTOR, delta);
    cam.position.z = THREE.MathUtils.damp(cam.position.z, t.z, DAMP_FACTOR, delta);

    lookAtVector.current.x = THREE.MathUtils.damp(lookAtVector.current.x, t.targetX, DAMP_FACTOR, delta);
    lookAtVector.current.y = THREE.MathUtils.damp(lookAtVector.current.y, t.targetY, DAMP_FACTOR, delta);
    lookAtVector.current.z = THREE.MathUtils.damp(lookAtVector.current.z, t.targetZ, DAMP_FACTOR, delta);

    cam.lookAt(lookAtVector.current);
    }
});

return null;
}

export default function HeroCanvas({ cameraTarget, isMobile }) {
return (
    <Canvas
    shadows={!isMobile}
    dpr={isMobile ? [1, 1.25] : [1, 2]}
    gl={{ 
        antialias: !isMobile, 
        powerPreference: 'high-performance',
        shadowMapType: THREE.PCFShadowMap 
    }}
    camera={{ position: [WAYPOINTS[0].x, WAYPOINTS[0].y, WAYPOINTS[0].z], fov: 90 }}
    >
    <ambientLight intensity={0.2} />
    <directionalLight
        castShadow={!isMobile}
        position={[25, 40, 20]}
        intensity={1.5}
        shadow-mapSize={isMobile ? [256, 256] : [512, 512]}
        shadow-camera-far={200}
        shadow-camera-left={-60}
        shadow-camera-right={60}
        shadow-camera-top={60}
        shadow-camera-bottom={-60}
        shadow-bias={-0.0005}
    />
    <color attach="background" args={['#050811']} />
    <fog attach="fog" args={['#050811', 40, 180]} />
    <Stars radius={100} depth={50} count={isMobile ? 1500 : 5000} factor={4} saturation={0} fade speed={1} />
    <Castelo isMobile={isMobile} />
    <CameraRig cameraTarget={cameraTarget} />
    </Canvas>
);
}