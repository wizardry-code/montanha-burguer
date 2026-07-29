import { useGLTF } from "@react-three/drei";
import React from "react";

const DRACO_PATH = `${import.meta.env.BASE_URL}draco/`;


const MODEL_PATH_DESKTOP = `${import.meta.env.BASE_URL}modelos/desktop/wrath_of_the_dragon-optimized.glb`;
const MODEL_PATH_MOBILE = `${import.meta.env.BASE_URL}modelos/mobile/wrath_of_the_dragon-optimized.glb`;


export const Castelo = ({ isMobile }) => {
const modelPath = isMobile ? MODEL_PATH_MOBILE : MODEL_PATH_DESKTOP;
const modelo = useGLTF(modelPath, DRACO_PATH);


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


useGLTF.preload(MODEL_PATH_DESKTOP, DRACO_PATH);