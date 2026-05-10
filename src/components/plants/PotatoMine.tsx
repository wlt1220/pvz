import { memo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface PotatoMineProps {
  position: [number, number, number]
  armed?: boolean
}

const PotatoMine = memo(function PotatoMine({ position, armed = false }: PotatoMineProps) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!groupRef.current || !armed) return
    const time = state.clock.elapsedTime
    // Subtle shake when armed
    groupRef.current.rotation.z = Math.sin(time * 6) * 0.03
  })

  if (!armed) {
    // Buried state - just a dirt mound
    return (
      <group ref={groupRef} position={position}>
        {/* Dirt mound */}
        <mesh position={[0, 0.05, 0]}>
          <sphereGeometry args={[0.18, 10, 10, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#6D4C2A" />
        </mesh>
        {/* Dirt particles */}
        <mesh position={[-0.08, 0.02, 0.06]}>
          <sphereGeometry args={[0.03, 6, 6]} />
          <meshStandardMaterial color="#5D3A1A" />
        </mesh>
        <mesh position={[0.1, 0.02, -0.04]}>
          <sphereGeometry args={[0.025, 6, 6]} />
          <meshStandardMaterial color="#5D3A1A" />
        </mesh>
      </group>
    )
  }

  // Armed state - potato popped up
  return (
    <group ref={groupRef} position={position}>
      {/* Main potato body */}
      <mesh position={[0, 0.15, 0]}>
        <sphereGeometry args={[0.2, 12, 12]} />
        <meshStandardMaterial color="#8B6914" />
      </mesh>

      {/* Lumps/cracks */}
      <mesh position={[0.1, 0.2, 0.1]}>
        <sphereGeometry args={[0.05, 6, 6]} />
        <meshStandardMaterial color="#7A5A0A" />
      </mesh>
      <mesh position={[-0.08, 0.1, 0.12]}>
        <sphereGeometry args={[0.04, 6, 6]} />
        <meshStandardMaterial color="#7A5A0A" />
      </mesh>

      {/* Angry squinting eyes */}
      <mesh position={[-0.06, 0.22, 0.17]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      <mesh position={[0.06, 0.22, 0.17]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshStandardMaterial color="#000000" />
      </mesh>

      {/* Angry brows */}
      <mesh position={[-0.06, 0.26, 0.17]} rotation={[0, 0, -0.3]}>
        <boxGeometry args={[0.06, 0.015, 0.015]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      <mesh position={[0.06, 0.26, 0.17]} rotation={[0, 0, 0.3]}>
        <boxGeometry args={[0.06, 0.015, 0.015]} />
        <meshStandardMaterial color="#000000" />
      </mesh>

      {/* Dirt base */}
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.15, 0.2, 0.04, 8]} />
        <meshStandardMaterial color="#5D3A1A" />
      </mesh>
    </group>
  )
})

export default PotatoMine
