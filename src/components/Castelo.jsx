import {useGLTF,Environment,OrbitControls} from "@react-three/drei"
import {Canvas} from "@react-three/fiber"
import React from 'react'

const Modelo = () => {
    const modelo = useGLTF("/modelos/wrath_of_the_dragon-compressed.glb")
  return (
    <primitive object={modelo.scene} />
  )
}


export const Castelo = () => {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <Environment preset = 'sunset'></Environment>
        <Modelo/>
        <OrbitControls enableZoom={true} enablePan={true} enableRotate={true} />
    </Canvas>
    )
}

export default Castelo