import { Sky } from '@react-three/drei'
import Lawn from './Lawn'

function Scene() {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} color="#ffffff" />
      <directionalLight
        position={[5, 10, 5]}
        intensity={1.5}
        color="#fffaf0"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      <hemisphereLight
        args={['#87ceeb', '#4a7c10', 0.3]}
      />

      {/* Sky */}
      <Sky sunPosition={[100, 50, 100]} />

      {/* Game objects */}
      <Lawn />
    </>
  )
}

export default Scene
