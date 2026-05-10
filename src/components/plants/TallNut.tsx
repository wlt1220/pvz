import { memo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface TallNutProps {
  position: [number, number, number]
}

const TallNut = memo(function TallNut({ position }: TallNutProps) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!groupRef.current) return
    const time = state.clock.elapsedTime
    const scale = 1.0 + 0.02 * Math.sin(time * 2)
    groupRef.current.scale.set(scale, scale, scale)
  })

  return (
    <group ref={groupRef} position={position}>
      {/* Main body - tall capsule shape */}
      <mesh position={[0, 0.4, 0]} scale={[1, 1.5, 1]} castShadow>
        <sphereGeometry args={[0.28, 16, 16]} />
        <meshStandardMaterial color="#5D4037" />
      </mesh>

      {/* Flat top */}
      <mesh position={[0, 0.72, 0]}>
        <cylinderGeometry args={[0.18, 0.18, 0.04, 10]} />
        <meshStandardMaterial color="#4E342E" />
      </mesh>

      {/* Stern eyes - flat brows */}
      <mesh position={[-0.1, 0.45, 0.25]}>
        <sphereGeometry args={[0.045, 8, 8]} />
        <meshStandardMaterial color="#3E2723" />
      </mesh>
      <mesh position={[0.1, 0.45, 0.25]}>
        <sphereGeometry args={[0.045, 8, 8]} />
        <meshStandardMaterial color="#3E2723" />
      </mesh>

      {/* Flat/serious eyebrows */}
      <mesh position={[-0.1, 0.5, 0.25]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.08, 0.02, 0.02]} />
        <meshStandardMaterial color="#2E1B0E" />
      </mesh>
      <mesh position={[0.1, 0.5, 0.25]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.08, 0.02, 0.02]} />
        <meshStandardMaterial color="#2E1B0E" />
      </mesh>

      {/* Serious mouth - straight line */}
      <mesh position={[0, 0.3, 0.27]}>
        <boxGeometry args={[0.1, 0.02, 0.02]} />
        <meshStandardMaterial color="#3E2723" />
      </mesh>
    </group>
  )
})

export default TallNut
