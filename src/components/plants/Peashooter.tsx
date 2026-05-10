import { memo, useRef, useState, useCallback } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import Pea from './Pea'

interface PeashooterProps {
  position: [number, number, number]
}

interface PeaData {
  id: number
  startPosition: [number, number, number]
  createdAt: number
}

const MAX_PEA_AGE = 15

const Peashooter = memo(function Peashooter({ position }: PeashooterProps) {
  const groupRef = useRef<THREE.Group>(null)
  const timerRef = useRef(0)
  const idCounterRef = useRef(0)
  const [peas, setPeas] = useState<PeaData[]>([])

  const removePea = useCallback((id: number) => {
    setPeas(prev => prev.filter(pea => pea.id !== id))
  }, [])

  useFrame((state, delta) => {
    if (!groupRef.current) return

    // Idle bobbing animation
    const time = state.clock.elapsedTime
    groupRef.current.position.y = position[1] + Math.sin(time * 3) * 0.02

    // Shooting timer
    timerRef.current += delta
    if (timerRef.current >= 2) {
      timerRef.current = 0
      const newPea: PeaData = {
        id: idCounterRef.current++,
        startPosition: [position[0] + 0.3, position[1] + 0.4, position[2]],
        createdAt: time,
      }
      setPeas(prev => {
        // Cleanup stale peas that exceeded max age
        const filtered = prev.filter(pea => time - pea.createdAt < MAX_PEA_AGE)
        return [...filtered, newPea]
      })
    }
  })

  return (
    <>
      <group ref={groupRef} position={position}>
        {/* Stem */}
        <mesh position={[0, 0.2, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 0.4, 8]} />
          <meshStandardMaterial color="#228B22" />
        </mesh>

        {/* Head */}
        <mesh position={[0, 0.45, 0]}>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshStandardMaterial color="#32CD32" />
        </mesh>

        {/* Mouth tube */}
        <mesh position={[0.2, 0.45, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.08, 0.06, 0.15, 8]} />
          <meshStandardMaterial color="#228B22" />
        </mesh>

        {/* Left eye - white */}
        <mesh position={[-0.07, 0.52, 0.16]}>
          <sphereGeometry args={[0.06, 10, 10]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
        {/* Left pupil */}
        <mesh position={[-0.07, 0.52, 0.21]}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshStandardMaterial color="#000000" />
        </mesh>

        {/* Right eye - white */}
        <mesh position={[0.07, 0.52, 0.16]}>
          <sphereGeometry args={[0.06, 10, 10]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
        {/* Right pupil */}
        <mesh position={[0.07, 0.52, 0.21]}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
      </group>

      {/* Peas */}
      {peas.map(pea => (
        <Pea
          key={pea.id}
          startPosition={pea.startPosition}
          onRemove={() => removePea(pea.id)}
        />
      ))}
    </>
  )
})

export default Peashooter
