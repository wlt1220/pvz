import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface NewspaperZombieProps {
  position: [number, number, number]
  hasNewspaper?: boolean
}

function NewspaperZombie({ position, hasNewspaper = true }: NewspaperZombieProps) {
  const groupRef = useRef<THREE.Group>(null)
  const leftArmRef = useRef<THREE.Mesh>(null)
  const rightArmRef = useRef<THREE.Mesh>(null)
  const leftLegRef = useRef<THREE.Mesh>(null)
  const rightLegRef = useRef<THREE.Mesh>(null)

  const animSpeed = hasNewspaper ? 3 : 6

  useFrame((state) => {
    if (!groupRef.current) return
    const time = state.clock.elapsedTime

    groupRef.current.rotation.z = Math.sin(time * animSpeed) * 0.1

    if (leftArmRef.current) {
      const armAngle = hasNewspaper ? 0.15 : 0.4
      leftArmRef.current.rotation.x = Math.sin(time * animSpeed) * armAngle
    }
    if (rightArmRef.current) {
      const armAngle = hasNewspaper ? 0.15 : 0.4
      rightArmRef.current.rotation.x = Math.sin(time * animSpeed + 1) * armAngle
    }
    if (leftLegRef.current) leftLegRef.current.rotation.x = Math.sin(time * (animSpeed + 1)) * 0.3
    if (rightLegRef.current) rightLegRef.current.rotation.x = Math.sin(time * (animSpeed + 1) + Math.PI) * 0.3
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

        {/* Glasses - two thin torus shapes */}
        <mesh position={[-0.07, 0.04, 0.17]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.04, 0.008, 6, 12]} />
          <meshStandardMaterial color="#424242" />
        </mesh>
        <mesh position={[0.07, 0.02, 0.17]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.035, 0.008, 6, 12]} />
          <meshStandardMaterial color="#424242" />
        </mesh>
        {/* Glasses bridge */}
        <mesh position={[0, 0.03, 0.17]}>
          <boxGeometry args={[0.06, 0.008, 0.008]} />
          <meshStandardMaterial color="#424242" />
        </mesh>
      </group>

      {/* Left arm */}
      <mesh ref={leftArmRef} position={[-0.25, 0.5, -0.15]} rotation={[Math.PI / 4, 0, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.4, 6]} />
        <meshStandardMaterial color="#6B8E5A" />
      </mesh>

      {/* Right arm */}
      <mesh ref={rightArmRef} position={[0.25, 0.55, -0.15]} rotation={[Math.PI / 3, 0, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.4, 6]} />
        <meshStandardMaterial color="#6B8E5A" />
      </mesh>

      {/* Newspaper (if held) */}
      {hasNewspaper && (
        <mesh position={[0, 0.45, -0.25]} rotation={[0.3, 0, 0]}>
          <boxGeometry args={[0.2, 0.3, 0.02]} />
          <meshStandardMaterial color="#ECEFF1" />
        </mesh>
      )}

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
    </group>
  )
}

export default NewspaperZombie
