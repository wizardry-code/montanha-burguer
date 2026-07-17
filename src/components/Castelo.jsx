import { useGLTF, Environment, FlyControls } from "@react-three/drei" // Mudamos para FlyControls
import { Canvas, useFrame } from "@react-three/fiber"
import React, { Suspense } from 'react'

const Modelo = () => {
    const modelo = useGLTF("modelos/wrath_of_the_dragon-compressed.glb")
    return <primitive object={modelo.scene} />
}

export const Castelo = () => {
    return (
        <Canvas camera={{ position: [0, 2, 10], fov: 90 }} gl={{ alpha: true }}>
            <Environment preset='sunset' />
            <Suspense><Modelo /></Suspense>
            
            {/* Ativa o controle de voo livre */}
            <FlyControls 
                movementSpeed={10} /* Velocidade do voo com teclado */
                rollSpeed={0.5}     /* Velocidade de rotação do mouse */
                dragToLook={true}   /* Clique e arraste com o mouse para olhar ao redor */
            />
            
            <MonitordeCamera />
        </Canvas>
    )
}

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
}

export default Castelo