import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface FlagZombieProps {
  position: [number, number, number]
}

function FlagZombie({ position }: FlagZombieProps) {
  const groupRef = useRef<THREE.Group>(null)
  const flagRef = useRef<THREE.Mesh>(null)
  const leftLegRef = useRef<THREE.Mesh>(null)
  const rightLegRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!groupRef.current) return
    const time = state.clock.elapsedTime

    // Shambling sway - slightly leaning forward
    groupRef.current.rotation.z = Math.sin(time * 3) * 0.08
    groupRef.current.rotation.x = 0.1 // lean forward

    // Flag waving
    if (flagRef.current) {
      flagRef.current.rotation.y = Math.sin(time * 5) * 0.3
    }

    if (leftLegRef.current) leftLegRef.current.rotation.x = Math.sin(time * 4.5) * 0.35
    if (rightLegRef.current) rightLegRef.current.rotation.x = Math.sin(time * 4.5 + Math.PI) * 0.35
  })

  return (
    <group ref={groupRef} position={position}>
      {/* Body/torso */}
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.5, 8]} />
        <meshStandardMaterial color="#6B8E5A" />
      </mesh>

      {/* Head */}
      <mesh position={[0, 0.8, 0]}>
        <sphereGeometry args={[0.18, 12, 12]} />
        <meshStandardMaterial color="#7A9E6A" />
      </mesh>

      {/* Face */}
      <group position={[0, 0.8, 0]}>
        <mesh position={[-0.07, 0.04, 0.15]}>
          <sphereGeometry args={[0.055, 8, 8]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
        <mesh position={[-0.09, 0.06, 0.2]}>
          <sphereGeometry args={[0.025, 6, 6]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
        <mesh position={[0.07, 0.02, 0.15]}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
        <mesh position={[0.08, 0.0, 0.19]}>
          <sphereGeometry args={[0.02, 6, 6]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
        <mesh position={[0.02, -0.08, 0.16]}>
          <sphereGeometry args={[0.035, 8, 8]} />
          <meshStandardMaterial color="#FF69B4" />
        </mesh>
      </group>

      {/* Left arm - raised holding flag pole */}
      <mesh position={[-0.25, 0.7, 0]} rotation={[0, 0, -0.5]}>
        <cylinderGeometry args={[0.04, 0.04, 0.4, 6]} />
        <meshStandardMaterial color="#6B8E5A" />
      </mesh>

      {/* Flag pole */}
      <mesh position={[-0.3, 1.0, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 0.6, 6]} />
        <meshStandardMaterial color="#5D4037" />
      </mesh>

      {/* Red flag (cone rotated sideways) */}
      <mesh ref={flagRef} position={[-0.3, 1.25, 0.08]} rotation={[0, 0, Math.PI / 2]}>
        <coneGeometry args={[0.12, 0.2, 4]} />
        <meshStandardMaterial color="#D32F2F" />
      </mesh>

      {/* Right arm */}
      <mesh position={[0.25, 0.55, -0.15]} rotation={[Math.PI / 3, 0, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.4, 6]} />
        <meshStandardMaterial color="#6B8E5A" />
      </mesh>

      {/* Left leg */}
      <mesh ref={leftLegRef} position={[-0.08, 0.1, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.3, 6]} />
        <meshStandardMaterial color="#4A6B3A" />
      </mesh>

      {/* Right leg */}
      <mesh ref={rightLegRef} position={[0.08, 0.1, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.3, 6]} />
        <meshStandardMaterial color="#4A6B3A" />
      </mesh>

      {/* Torn clothes */}
      <mesh position={[0.08, 0.45, 0.12]} rotation={[0, 0, 0.3]}>
        <boxGeometry args={[0.08, 0.1, 0.02]} />
        <meshStandardMaterial color="#4A5A3A" />
      </mesh>
    </group>
  )
}

export default FlagZombie
