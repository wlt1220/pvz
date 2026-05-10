import { Sky, OrbitControls } from '@react-three/drei'
import Lawn from './Lawn'
import SunParticles from './effects/SunParticles'
import SunCollector from './ui/SunCollector'
import PlantRenderer from './plants/PlantRenderer'
import ZombieRenderer from './zombies/ZombieRenderer'
import ProjectileRenderer from './ProjectileRenderer'
import { useGameStore } from '../store/gameStore'

function Scene() {
  const plants = useGameStore((s) => s.plants)
  const zombies = useGameStore((s) => s.zombies)
  const projectiles = useGameStore((s) => s.projectiles)

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

      {/* Plants from game state */}
      {plants.map((plant) => (
        <PlantRenderer key={plant.id} plant={plant} />
      ))}

      {/* Zombies from game state */}
      {zombies.map((zombie) => (
        <ZombieRenderer key={zombie.id} zombie={zombie} />
      ))}

      {/* Projectiles from game state */}
      {projectiles.map((projectile) => (
        <ProjectileRenderer key={projectile.id} projectile={projectile} />
      ))}

      {/* Sun collector for clicking suns */}
      <SunCollector />

      {/* Ambient sun particles */}
      <SunParticles />
    </>
  )
}

export default Scene
