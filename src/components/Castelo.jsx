import { useGLTF } from "@react-three/drei"
import React from "react"


export const Castelo = () => {
    //exporta apenas o modelo puro
    const modelo = useGLTF("modelos/wrath_of_the_dragon-compressed.glb")
    return <primitive object={modelo.scene} />

    //O monitoramento das cordenadas da camera
    const MonitordeCamera = () => {
    useFrame((state) => {
        const { x, y, z } = state.camera.position
        
        // Mantendo o cálculo do vetor de foco baseado na rotação da câmera
        const targetX = x - Math.sin(state.camera.rotation.y);
        const targetY = y + Math.sin(state.camera.rotation.x);
        const targetZ = z - Math.cos(state.camera.rotation.y);
        
        console.log(
            `DRONE -> Posição [X: ${x.toFixed(2)}, Y: ${y.toFixed(2)}, Z: ${z.toFixed(2)}] ` +
            `| Olhando Para [X: ${targetX.toFixed(2)}, Y: ${targetY.toFixed(2)}, Z: ${targetZ.toFixed(2)}]`
        )
    })
    return null
}}

export default Castelo
useGLTF.preload("modelos/wrath_of_the_dragon-compressed.glb")