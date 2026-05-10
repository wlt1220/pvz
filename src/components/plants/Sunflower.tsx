import { useRef, useState, useCallback } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import SunOrb from './SunOrb'

interface SunflowerProps {
  position: [number, number, number]
}

interface OrbData {
  id: number
  startPosition: [number, number, number]
  createdAt: number
}

const MAX_ORB_AGE = 15

function Sunflower({ position }: SunflowerProps) {
  const groupRef = useRef<THREE.Group>(null)
  const timerRef = useRef(0)
  const idCounterRef = useRef(0)
  const [orbs, setOrbs] = useState<OrbData[]>([])

  const removeOrb = useCallback((id: number) => {
    setOrbs(prev => prev.filter(orb => orb.id !== id))
  }, [])

  useFrame((state, delta) => {
    if (!groupRef.current) return

    // Swaying animation
    const time = state.clock.elapsedTime
    groupRef.current.rotation.z = Math.sin(time * 2) * 0.1

    // Sun production timer
    timerRef.current += delta
    if (timerRef.current >= 5) {
      timerRef.current = 0
      const newOrb: OrbData = {
        id: idCounterRef.current++,
        startPosition: [position[0], position[1] + 0.7, position[2]],
        createdAt: time,
      }
      setOrbs(prev => {
        // Cleanup stale orbs that exceeded max age
        const filtered = prev.filter(orb => time - orb.createdAt < MAX_ORB_AGE)
        return [...filtered, newOrb]
      })
    }
  })

  // Generate petals arranged radially
  const petals = []
  const petalCount = 10
  for (let i = 0; i < petalCount; i++) {
    const angle = (i / petalCount) * Math.PI * 2
    const px = Math.cos(angle) * 0.18
    const py = Math.sin(angle) * 0.18
    petals.push(
      <mesh
        key={i}
        position={[px, 0.5 + py, 0]}
        rotation={[0, 0, angle]}
        scale={[0.5, 1, 0.3]}
      >
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial color="#FFD700" />
      </mesh>
    )
  }

  return (
    <>
      <group ref={groupRef} position={position}>
        {/* Stem */}
        <mesh position={[0, 0.25, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 0.5, 8]} />
          <meshStandardMaterial color="#228B22" />
        </mesh>

        {/* Brown center */}
        <mesh position={[0, 0.5, 0]}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>

        {/* Petals */}
        {petals}

        {/* Eyes */}
        <mesh position={[-0.05, 0.53, 0.13]}>
          <sphereGeometry args={[0.025, 8, 8]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
        <mesh position={[0.05, 0.53, 0.13]}>
          <sphereGeometry args={[0.025, 8, 8]} />
          <meshStandardMaterial color="#000000" />
        </mesh>

        {/* Smile - two small spheres forming a curve */}
        <mesh position={[-0.03, 0.45, 0.14]}>
          <sphereGeometry args={[0.015, 6, 6]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
        <mesh position={[0, 0.44, 0.14]}>
          <sphereGeometry args={[0.015, 6, 6]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
        <mesh position={[0.03, 0.45, 0.14]}>
          <sphereGeometry args={[0.015, 6, 6]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
      </group>

      {/* Sun orbs */}
      {orbs.map(orb => (
        <SunOrb
          key={orb.id}
          startPosition={orb.startPosition}
          onRemove={() => removeOrb(orb.id)}
        />
      ))}
    </>
  )
}

export default Sunflower
