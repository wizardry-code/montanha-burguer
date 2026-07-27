import { useGLTF } from "@react-three/drei";
import React from "react";

const MODEL_PATH = `${import.meta.env.BASE_URL}modelos/wrath_of_the_dragon-compressedTeste.glb`;
// Caminho pro decoder Draco local (public/draco/), no lugar do CDN do Google
const DRACO_PATH = `${import.meta.env.BASE_URL}draco/`;

export const Castelo = () => {
const modelo = useGLTF(MODEL_PATH, DRACO_PATH);

// Percorre o modelo e força todas as malhas a projetarem e receberem sombra
React.useMemo(() => {
    modelo.scene.traverse((child) => {
    if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        if (child.material) {
        child.material.roughness = 0.8;
        }
    }
    });
}, [modelo]);

return <primitive object={modelo.scene} />;
};

export default Castelo;

// Preload usando o mesmo decoder local
useGLTF.preload(MODEL_PATH, DRACO_PATH);