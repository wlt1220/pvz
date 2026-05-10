import { memo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface BucketHeadZombieProps {
  position: [number, number, number]
}

const BucketHeadZombie = memo(function BucketHeadZombie({ position }: BucketHeadZombieProps) {
  const groupRef = useRef<THREE.Group>(null)
  const leftArmRef = useRef<THREE.Mesh>(null)
  const rightArmRef = useRef<THREE.Mesh>(null)
  const leftLegRef = useRef<THREE.Mesh>(null)
  const rightLegRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!groupRef.current) return
    const time = state.clock.elapsedTime

    // Shambling sway
    groupRef.current.rotation.z = Math.sin(time * 3) * 0.1

    if (leftArmRef.current) leftArmRef.current.rotation.x = Math.sin(time * 3) * 0.15
    if (rightArmRef.current) rightArmRef.current.rotation.x = Math.sin(time * 3 + 1) * 0.15
    if (leftLegRef.current) leftLegRef.current.rotation.x = Math.sin(time * 4) * 0.3
    if (rightLegRef.current) rightLegRef.current.rotation.x = Math.sin(time * 4 + Math.PI) * 0.3
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

      {/* Bucket on head */}
      <mesh position={[0, 1.05, 0]}>
        <cylinderGeometry args={[0.14, 0.18, 0.25, 10]} />
        <meshStandardMaterial color="#78909C" metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Bucket top */}
      <mesh position={[0, 1.18, 0]}>
        <cylinderGeometry args={[0.14, 0.14, 0.02, 10]} />
        <meshStandardMaterial color="#607D8B" metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Dent on bucket */}
      <mesh position={[0.1, 1.05, 0.1]}>
        <sphereGeometry args={[0.03, 6, 6]} />
        <meshStandardMaterial color="#546E7A" />
      </mesh>

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
})

export default BucketHeadZombie
