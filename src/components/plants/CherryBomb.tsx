import { memo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface CherryBombProps {
  position: [number, number, number]
}

const CherryBomb = memo(function CherryBomb({ position }: CherryBombProps) {
  const groupRef = useRef<THREE.Group>(null)
  const emissiveRef = useRef(0)

  useFrame((state) => {
    if (!groupRef.current) return
    const time = state.clock.elapsedTime
    // Pulsing red glow
    emissiveRef.current = 0.2 + Math.sin(time * 4) * 0.15
    groupRef.current.children.forEach((child) => {
      if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
        if (child.userData['cherry']) {
          child.material.emissiveIntensity = emissiveRef.current
        }
      }
    })
  })

  return (
    <group ref={groupRef} position={position}>
      {/* Left cherry */}
      <mesh position={[-0.12, 0.2, 0]} userData={{ cherry: true }}>
        <sphereGeometry args={[0.2, 12, 12]} />
        <meshStandardMaterial color="#D32F2F" emissive="#D32F2F" emissiveIntensity={0.2} />
      </mesh>

      {/* Right cherry */}
      <mesh position={[0.12, 0.2, 0]} userData={{ cherry: true }}>
        <sphereGeometry args={[0.2, 12, 12]} />
        <meshStandardMaterial color="#D32F2F" emissive="#D32F2F" emissiveIntensity={0.2} />
      </mesh>

      {/* Green stem connecting */}
      <mesh position={[0, 0.42, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.15, 6]} />
        <meshStandardMaterial color="#388E3C" />
      </mesh>

      {/* Small leaf/fuse on top */}
      <mesh position={[0.05, 0.5, 0]} rotation={[0, 0, 0.3]}>
        <coneGeometry args={[0.04, 0.1, 6]} />
        <meshStandardMaterial color="#4CAF50" />
      </mesh>

      {/* Angry face on front cherry - furrowed brow left */}
      <mesh position={[-0.18, 0.27, 0.17]} rotation={[0, 0, -0.4]}>
        <boxGeometry args={[0.08, 0.02, 0.02]} />
        <meshStandardMaterial color="#1B0000" />
      </mesh>
      {/* Furrowed brow right */}
      <mesh position={[-0.06, 0.27, 0.17]} rotation={[0, 0, 0.4]}>
        <boxGeometry args={[0.08, 0.02, 0.02]} />
        <meshStandardMaterial color="#1B0000" />
      </mesh>

      {/* Left eye */}
      <mesh position={[-0.17, 0.22, 0.18]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      {/* Right eye */}
      <mesh position={[-0.07, 0.22, 0.18]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
    </group>
  )
})

export default CherryBomb
