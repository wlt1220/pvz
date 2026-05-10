import { memo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface GargantuarZombieProps {
  position: [number, number, number]
}

const GargantuarZombie = memo(function GargantuarZombie({ position }: GargantuarZombieProps) {
  const groupRef = useRef<THREE.Group>(null)
  const leftLegRef = useRef<THREE.Mesh>(null)
  const rightLegRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!groupRef.current) return
    const time = state.clock.elapsedTime

    // Slow menacing sway
    groupRef.current.rotation.z = Math.sin(time * 1.5) * 0.05

    // Slow leg movement
    if (leftLegRef.current) leftLegRef.current.rotation.x = Math.sin(time * 2) * 0.2
    if (rightLegRef.current) rightLegRef.current.rotation.x = Math.sin(time * 2 + Math.PI) * 0.2
  })

  return (
    <group ref={groupRef} position={position} scale={[2, 2, 2]}>
      {/* Massive torso */}
      <mesh position={[0, 0.45, 0]}>
        <cylinderGeometry args={[0.2, 0.22, 0.6, 8]} />
        <meshStandardMaterial color="#4A6B3A" />
      </mesh>

      {/* Tiny head (relatively) */}
      <mesh position={[0, 0.85, 0]}>
        <sphereGeometry args={[0.13, 12, 12]} />
        <meshStandardMaterial color="#5A7B4A" />
      </mesh>

      {/* Hunched posture - slight forward lean via mesh offset */}
      {/* Face */}
      <group position={[0, 0.85, 0]}>
        <mesh position={[-0.04, 0.03, 0.1]}>
          <sphereGeometry args={[0.03, 6, 6]} />
          <meshStandardMaterial color="#FF0000" emissive="#FF0000" emissiveIntensity={0.2} />
        </mesh>
        <mesh position={[0.04, 0.02, 0.1]}>
          <sphereGeometry args={[0.025, 6, 6]} />
          <meshStandardMaterial color="#FF0000" emissive="#FF0000" emissiveIntensity={0.2} />
        </mesh>
      </group>

      {/* Left arm */}
      <mesh position={[-0.28, 0.5, -0.1]} rotation={[Math.PI / 5, 0, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.5, 6]} />
        <meshStandardMaterial color="#4A6B3A" />
      </mesh>

      {/* Right arm holding telephone pole */}
      <mesh position={[0.28, 0.5, -0.1]} rotation={[Math.PI / 5, 0, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.5, 6]} />
        <meshStandardMaterial color="#4A6B3A" />
      </mesh>

      {/* Telephone pole */}
      <mesh position={[0.35, 0.7, -0.2]} rotation={[0.5, 0, 0.3]}>
        <cylinderGeometry args={[0.03, 0.03, 1.0, 6]} />
        <meshStandardMaterial color="#6D4C41" />
      </mesh>

      {/* Legs (thick) */}
      <mesh ref={leftLegRef} position={[-0.1, 0.08, 0]}>
        <cylinderGeometry args={[0.07, 0.07, 0.35, 6]} />
        <meshStandardMaterial color="#3A5A2A" />
      </mesh>
      <mesh ref={rightLegRef} position={[0.1, 0.08, 0]}>
        <cylinderGeometry args={[0.07, 0.07, 0.35, 6]} />
        <meshStandardMaterial color="#3A5A2A" />
      </mesh>
    </group>
  )
})

export default GargantuarZombie
