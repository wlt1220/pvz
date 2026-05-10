import { memo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface FootballZombieProps {
  position: [number, number, number]
}

const FootballZombie = memo(function FootballZombie({ position }: FootballZombieProps) {
  const groupRef = useRef<THREE.Group>(null)
  const leftLegRef = useRef<THREE.Mesh>(null)
  const rightLegRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!groupRef.current) return
    const time = state.clock.elapsedTime

    // Charging forward pose
    groupRef.current.rotation.x = 0.15
    groupRef.current.rotation.z = Math.sin(time * 4) * 0.06

    // Faster leg animation
    if (leftLegRef.current) leftLegRef.current.rotation.x = Math.sin(time * 6) * 0.4
    if (rightLegRef.current) rightLegRef.current.rotation.x = Math.sin(time * 6 + Math.PI) * 0.4
  })

  return (
    <group ref={groupRef} position={position}>
      {/* Bulky torso */}
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.2, 0.18, 0.55, 8]} />
        <meshStandardMaterial color="#5A7E4A" />
      </mesh>

      {/* Head */}
      <mesh position={[0, 0.82, 0]}>
        <sphereGeometry args={[0.17, 12, 12]} />
        <meshStandardMaterial color="#7A9E6A" />
      </mesh>

      {/* Football helmet */}
      <mesh position={[0, 0.88, 0]}>
        <sphereGeometry args={[0.2, 12, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#37474F" metalness={0.4} roughness={0.4} />
      </mesh>

      {/* Face guard lines */}
      <mesh position={[0, 0.82, 0.18]}>
        <boxGeometry args={[0.02, 0.12, 0.02]} />
        <meshStandardMaterial color="#616161" metalness={0.5} />
      </mesh>
      <mesh position={[-0.06, 0.82, 0.17]}>
        <boxGeometry args={[0.02, 0.1, 0.02]} />
        <meshStandardMaterial color="#616161" metalness={0.5} />
      </mesh>
      <mesh position={[0.06, 0.82, 0.17]}>
        <boxGeometry args={[0.02, 0.1, 0.02]} />
        <meshStandardMaterial color="#616161" metalness={0.5} />
      </mesh>

      {/* Eyes behind guard */}
      <mesh position={[-0.05, 0.84, 0.15]}>
        <sphereGeometry args={[0.025, 6, 6]} />
        <meshStandardMaterial color="#FF0000" emissive="#FF0000" emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[0.05, 0.84, 0.15]}>
        <sphereGeometry args={[0.025, 6, 6]} />
        <meshStandardMaterial color="#FF0000" emissive="#FF0000" emissiveIntensity={0.3} />
      </mesh>

      {/* Shoulder pads */}
      <mesh position={[-0.22, 0.6, 0]}>
        <boxGeometry args={[0.1, 0.06, 0.15]} />
        <meshStandardMaterial color="#455A64" metalness={0.3} />
      </mesh>
      <mesh position={[0.22, 0.6, 0]}>
        <boxGeometry args={[0.1, 0.06, 0.15]} />
        <meshStandardMaterial color="#455A64" metalness={0.3} />
      </mesh>

      {/* Arms */}
      <mesh position={[-0.28, 0.45, -0.1]} rotation={[Math.PI / 3, 0, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.4, 6]} />
        <meshStandardMaterial color="#5A7E4A" />
      </mesh>
      <mesh position={[0.28, 0.45, -0.1]} rotation={[Math.PI / 3, 0, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.4, 6]} />
        <meshStandardMaterial color="#5A7E4A" />
      </mesh>

      {/* Legs (bulkier) */}
      <mesh ref={leftLegRef} position={[-0.1, 0.08, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.3, 6]} />
        <meshStandardMaterial color="#3A5A2A" />
      </mesh>
      <mesh ref={rightLegRef} position={[0.1, 0.08, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.3, 6]} />
        <meshStandardMaterial color="#3A5A2A" />
      </mesh>
    </group>
  )
})

export default FootballZombie
