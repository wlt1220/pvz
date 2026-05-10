import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface PoleVaultingZombieProps {
  position: [number, number, number]
  hasJumped?: boolean
}

function PoleVaultingZombie({ position, hasJumped = false }: PoleVaultingZombieProps) {
  const groupRef = useRef<THREE.Group>(null)
  const leftLegRef = useRef<THREE.Mesh>(null)
  const rightLegRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!groupRef.current) return
    const time = state.clock.elapsedTime

    groupRef.current.rotation.z = Math.sin(time * 3) * 0.08

    if (leftLegRef.current) leftLegRef.current.rotation.x = Math.sin(time * 4.5) * 0.3
    if (rightLegRef.current) rightLegRef.current.rotation.x = Math.sin(time * 4.5 + Math.PI) * 0.3
  })

  return (
    <group ref={groupRef} position={position}>
      {/* Torso (thinner/taller) */}
      <mesh position={[0, 0.45, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 0.55, 8]} />
        <meshStandardMaterial color="#6B8E5A" />
      </mesh>

      {/* Head */}
      <mesh position={[0, 0.85, 0]}>
        <sphereGeometry args={[0.16, 12, 12]} />
        <meshStandardMaterial color="#7A9E6A" />
      </mesh>

      {/* Face */}
      <group position={[0, 0.85, 0]}>
        <mesh position={[-0.06, 0.04, 0.13]}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
        <mesh position={[-0.07, 0.05, 0.16]}>
          <sphereGeometry args={[0.02, 6, 6]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
        <mesh position={[0.06, 0.03, 0.13]}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
        <mesh position={[0.07, 0.03, 0.16]}>
          <sphereGeometry args={[0.02, 6, 6]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
      </group>

      {/* Arms (thinner) */}
      <mesh position={[-0.2, 0.55, -0.1]} rotation={[Math.PI / 4, 0, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.4, 6]} />
        <meshStandardMaterial color="#6B8E5A" />
      </mesh>
      <mesh position={[0.2, 0.55, -0.1]} rotation={[Math.PI / 4, 0, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.4, 6]} />
        <meshStandardMaterial color="#6B8E5A" />
      </mesh>

      {/* Pole (only if not jumped) */}
      {!hasJumped && (
        <mesh position={[0.15, 0.7, -0.3]} rotation={[0.8, 0, 0.1]}>
          <cylinderGeometry args={[0.02, 0.02, 1.2, 6]} />
          <meshStandardMaterial color="#8D6E63" />
        </mesh>
      )}

      {/* Legs (thinner) */}
      <mesh ref={leftLegRef} position={[-0.07, 0.1, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.35, 6]} />
        <meshStandardMaterial color="#4A6B3A" />
      </mesh>
      <mesh ref={rightLegRef} position={[0.07, 0.1, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.35, 6]} />
        <meshStandardMaterial color="#4A6B3A" />
      </mesh>
    </group>
  )
}

export default PoleVaultingZombie
