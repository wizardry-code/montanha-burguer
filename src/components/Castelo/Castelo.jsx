import { useGLTF } from "@react-three/drei";
import React from "react";

const MODEL_PATH = `${import.meta.env.BASE_URL}modelos/wrath_of_the_dragon-compressedTeste.glb`;

export const Castelo = () => {
const modelo = useGLTF(MODEL_PATH);

// Percorre o modelo e força todas as malhas a projetarem e receberem sombra
React.useMemo(() => {
    modelo.scene.traverse((child) => {
    if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        
        // Se o modelo original usar materiais muito brilhantes, 
        // você pode calibrar a rugosidade aqui para tirar o aspeto de plástico:
        if (child.material) {
        child.material.roughness = 0.8; 
        }
    }
    });
}, [modelo]);

return <primitive object={modelo.scene} />;
};

export default Castelo;

// Preload do próprio Drei usando a mesma URL resolvida
useGLTF.preload(MODEL_PATH);