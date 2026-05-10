import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGameStore } from '../../store/gameStore'
import type { SunEntity } from '../../game/types'
import * as THREE from 'three'

function SunSphere({ sun }: { sun: SunEntity }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const collectSun = useGameStore((s) => s.collectSun)
  const scaleRef = useRef(1)
  const collectingRef = useRef(false)

  useFrame((_, delta) => {
    if (!meshRef.current) return

    if (collectingRef.current) {
      scaleRef.current -= delta * 4
      if (scaleRef.current <= 0) {
        scaleRef.current = 0
      }
      meshRef.current.scale.setScalar(scaleRef.current)
      return
    }

    // Falling animation for sky suns
    if (sun.source === 'sky') {
      meshRef.current.position.y -= delta * 0.5
      if (meshRef.current.position.y < 1) {
        meshRef.current.position.y = 1
      }
    }

    // Gentle bobbing
    meshRef.current.rotation.y += delta * 2
  })

  const handleClick = () => {
    if (collectingRef.current) return
    collectingRef.current = true
    collectSun(sun.id)
  }

  const startY = sun.source === 'sky' ? 6 : sun.y + 1.5

  return (
    <mesh
      ref={meshRef}
      position={[sun.x, startY, 0]}
      onClick={handleClick}
    >
      <sphereGeometry args={[0.3, 16, 16]} />
      <meshStandardMaterial
        color="#ffeb3b"
        emissive="#ff9800"
        emissiveIntensity={0.5}
      />
    </mesh>
  )
}

function SunCollector() {
  const suns = useGameStore((s) => s.suns)

  const uncollectedSuns = suns.filter((s) => !s.collected)

  return (
    <group>
      {uncollectedSuns.map((sun) => (
        <SunSphere key={sun.id} sun={sun} />
      ))}
    </group>
  )
}

export default SunCollector
