import { Sky, OrbitControls } from '@react-three/drei'
import Lawn from './Lawn'
import Sunflower from './plants/Sunflower'
import Peashooter from './plants/Peashooter'
import WallNut from './plants/WallNut'
import RegularZombie from './zombies/RegularZombie'
import ConeHeadZombie from './zombies/ConeHeadZombie'
import SunParticles from './effects/SunParticles'
import { gridToWorld, rowToZ } from '../utils/gridUtils'

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

      {/* Camera Controls */}
      <OrbitControls
        minDistance={5}
        maxDistance={20}
        maxPolarAngle={Math.PI / 2.1}
      />

      {/* Game objects */}
      <Lawn />

      {/* Plants on the lawn grid */}
      <Sunflower position={gridToWorld(1, 1)} />
      <Sunflower position={gridToWorld(2, 1)} />
      <Sunflower position={gridToWorld(4, 1)} />
      <Peashooter position={gridToWorld(1, 2)} />
      <Peashooter position={gridToWorld(2, 2)} />
      <Peashooter position={gridToWorld(3, 2)} />
      <WallNut position={gridToWorld(3, 0)} />

      {/* Zombies approaching from the right */}
      <RegularZombie position={[6, 0, rowToZ(0)]} speed={0.3} />
      <RegularZombie position={[7, 0, rowToZ(2)]} speed={0.25} />
      <ConeHeadZombie position={[7.5, 0, rowToZ(1)]} speed={0.2} />
      <RegularZombie position={[5, 0, rowToZ(4)]} speed={0.35} />

      {/* Ambient sun particles */}
      <SunParticles />
    </>
  )
}

export default Scene
