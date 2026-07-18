import { useGLTF } from "@react-three/drei"
import React from "react"

export const Castelo = () => {
const modelo = useGLTF("modelos/wrath_of_the_dragon-compressed.glb");

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

export default Castelo
useGLTF.preload("modelos/wrath_of_the_dragon-compressed.glb")