import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface RepeaterProps {
  position: [number, number, number]
}

function Repeater({ position }: RepeaterProps) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!groupRef.current) return
    const time = state.clock.elapsedTime
    groupRef.current.position.y = position[1] + Math.sin(time * 3) * 0.02
  })

  return (
    <group ref={groupRef} position={position}>
      {/* Stem */}
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.07, 0.07, 0.4, 8]} />
        <meshStandardMaterial color="#1B5E20" />
      </mesh>

      {/* Head (slightly larger) */}
      <mesh position={[0, 0.47, 0]}>
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshStandardMaterial color="#2E7D32" />
      </mesh>

      {/* Upper mouth tube */}
      <mesh position={[0.22, 0.5, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.07, 0.05, 0.15, 8]} />
        <meshStandardMaterial color="#1B5E20" />
      </mesh>

      {/* Lower mouth tube (double barrel) */}
      <mesh position={[0.22, 0.42, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.07, 0.05, 0.15, 8]} />
        <meshStandardMaterial color="#1B5E20" />
      </mesh>

      {/* Left eye */}
      <mesh position={[-0.08, 0.55, 0.18]}>
        <sphereGeometry args={[0.06, 10, 10]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>
      {/* Left pupil */}
      <mesh position={[-0.08, 0.55, 0.23]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshStandardMaterial color="#000000" />
      </mesh>

      {/* Right eye */}
      <mesh position={[0.08, 0.55, 0.18]}>
        <sphereGeometry args={[0.06, 10, 10]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>
      {/* Right pupil */}
      <mesh position={[0.08, 0.55, 0.23]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
    </group>
  )
}

export default Repeater
