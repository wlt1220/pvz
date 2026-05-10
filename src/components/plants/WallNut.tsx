import { memo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface WallNutProps {
  position: [number, number, number]
}

const WallNut = memo(function WallNut({ position }: WallNutProps) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!groupRef.current) return

    // Subtle breathing/pulsing animation
    const time = state.clock.elapsedTime
    const scale = 1.0 + 0.02 * Math.sin(time * 2)
    groupRef.current.scale.set(scale, scale, scale)
  })

  return (
    <group ref={groupRef} position={position}>
      {/* Main body */}
      <mesh position={[0, 0.3, 0]} castShadow>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>

      {/* Left eye indentation */}
      <mesh position={[-0.1, 0.35, 0.26]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial color="#654321" />
      </mesh>

      {/* Right eye indentation */}
      <mesh position={[0.1, 0.35, 0.26]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial color="#654321" />
      </mesh>

      {/* Mouth - two small spheres for a simple expression */}
      <mesh position={[-0.05, 0.22, 0.28]}>
        <sphereGeometry args={[0.025, 6, 6]} />
        <meshStandardMaterial color="#654321" />
      </mesh>
      <mesh position={[0.05, 0.22, 0.28]}>
        <sphereGeometry args={[0.025, 6, 6]} />
        <meshStandardMaterial color="#654321" />
      </mesh>
      <mesh position={[0, 0.2, 0.29]}>
        <sphereGeometry args={[0.025, 6, 6]} />
        <meshStandardMaterial color="#654321" />
      </mesh>
    </group>
  )
})

export default WallNut
