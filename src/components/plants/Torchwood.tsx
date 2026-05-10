import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface TorchwoodProps {
  position: [number, number, number]
}

function Torchwood({ position }: TorchwoodProps) {
  const groupRef = useRef<THREE.Group>(null)
  const flame1Ref = useRef<THREE.Mesh>(null)
  const flame2Ref = useRef<THREE.Mesh>(null)
  const flame3Ref = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!groupRef.current) return
    const time = state.clock.elapsedTime

    // Flame animation - bob and scale
    if (flame1Ref.current) {
      flame1Ref.current.position.y = 0.6 + Math.sin(time * 5) * 0.03
      flame1Ref.current.scale.setScalar(0.9 + Math.sin(time * 7) * 0.15)
    }
    if (flame2Ref.current) {
      flame2Ref.current.position.y = 0.65 + Math.sin(time * 6 + 1) * 0.04
      flame2Ref.current.scale.setScalar(0.8 + Math.sin(time * 8 + 0.5) * 0.2)
    }
    if (flame3Ref.current) {
      flame3Ref.current.position.y = 0.7 + Math.sin(time * 4 + 2) * 0.03
      flame3Ref.current.scale.setScalar(0.7 + Math.sin(time * 9 + 1) * 0.15)
    }
  })

  return (
    <group ref={groupRef} position={position}>
      {/* Tree stump body */}
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.15, 0.2, 0.4, 10]} />
        <meshStandardMaterial color="#4E342E" />
      </mesh>

      {/* Wood ring lines */}
      <mesh position={[0, 0.3, 0]}>
        <torusGeometry args={[0.16, 0.01, 6, 12]} />
        <meshStandardMaterial color="#3E2723" />
      </mesh>
      <mesh position={[0, 0.15, 0]}>
        <torusGeometry args={[0.18, 0.01, 6, 12]} />
        <meshStandardMaterial color="#3E2723" />
      </mesh>

      {/* Face carved in wood */}
      <mesh position={[-0.05, 0.25, 0.16]}>
        <sphereGeometry args={[0.03, 6, 6]} />
        <meshStandardMaterial color="#2E1B0E" />
      </mesh>
      <mesh position={[0.05, 0.25, 0.16]}>
        <sphereGeometry args={[0.03, 6, 6]} />
        <meshStandardMaterial color="#2E1B0E" />
      </mesh>
      <mesh position={[0, 0.17, 0.17]}>
        <sphereGeometry args={[0.025, 6, 6]} />
        <meshStandardMaterial color="#2E1B0E" />
      </mesh>

      {/* Flame spheres */}
      <mesh ref={flame1Ref} position={[0, 0.6, 0]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial color="#FF6D00" emissive="#FF6D00" emissiveIntensity={0.6} />
      </mesh>
      <mesh ref={flame2Ref} position={[0.04, 0.65, 0.02]}>
        <sphereGeometry args={[0.07, 8, 8]} />
        <meshStandardMaterial color="#FFAB00" emissive="#FFAB00" emissiveIntensity={0.5} />
      </mesh>
      <mesh ref={flame3Ref} position={[-0.03, 0.7, -0.01]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial color="#FFD600" emissive="#FFD600" emissiveIntensity={0.4} />
      </mesh>
    </group>
  )
}

export default Torchwood
