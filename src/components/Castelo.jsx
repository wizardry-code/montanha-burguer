import {useGLTF,Environment,OrbitControls} from "@react-three/drei"
import {Canvas,useFrame} from "@react-three/fiber"
import React from 'react'
import { EffectComposer } from "@react-three/postprocessing"
import { Fluid } from "@whatisjery/react-fluid-distortion" 
const Modelo = () => {
    const modelo = useGLTF("modelos/wrath_of_the_dragon-compressed.glb")
  return (
    <primitive object={modelo.scene} />
  )
}


export const Castelo = () => {
  return (

    <Canvas camera={{ position: [0,0,5], fov: 90 }}>
        <Environment preset = 'sunset'></Environment>
        <Modelo/>
        <OrbitControls enableZoom={true} enablePan={true} enableRotate={true} />
        <MonitordeCamera />
        <EffectComposer>
          <Fluid backgroundColor="#000000" fluidColor="#f8f8f8"  radius={0.01}  curl={1} blend={1}/>
        </EffectComposer>
    </Canvas>
    )
}

// Componente auxiliar para monitorar a câmera
const MonitordeCamera = () => {
  useFrame((state) => {
    const { x, y, z } = state.camera.position
    // Exibe as coordenadas arredondadas para não poluir o console com números gigantes
    console.log(`Câmera Posição -> X: ${x.toFixed(2)}, Y: ${y.toFixed(2)}, Z: ${z.toFixed(2)}`)
  })

  return null // Este componente não renderiza nada visualmente
}


export default Castelo