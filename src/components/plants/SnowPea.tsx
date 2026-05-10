import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface SnowPeaProps {
  position: [number, number, number]
}

function SnowPea({ position }: SnowPeaProps) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!groupRef.current) return
    const time = state.clock.elapsedTime
    groupRef.current.position.y = position[1] + Math.sin(time * 3) * 0.02
  })

  return (
    <group ref={groupRef} position={position}>
      {/* Stem */}
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.4, 8]} />
        <meshStandardMaterial color="#2E8B8B" />
      </mesh>

      {/* Head */}
      <mesh position={[0, 0.45, 0]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="#4FC3F7" />
      </mesh>

      {/* Ice crystal on top */}
      <mesh position={[0, 0.7, 0]} rotation={[0, 0, Math.PI]}>
        <coneGeometry args={[0.06, 0.15, 6]} />
        <meshStandardMaterial color="#B3E5FC" transparent opacity={0.8} />
      </mesh>

      {/* Mouth tube (blue) */}
      <mesh position={[0.2, 0.45, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.08, 0.06, 0.15, 8]} />
        <meshStandardMaterial color="#0288D1" />
      </mesh>

      {/* Left eye */}
      <mesh position={[-0.07, 0.52, 0.16]}>
        <sphereGeometry args={[0.06, 10, 10]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>
      {/* Left pupil */}
      <mesh position={[-0.07, 0.52, 0.21]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshStandardMaterial color="#000000" />
      </mesh>

      {/* Right eye */}
      <mesh position={[0.07, 0.52, 0.16]}>
        <sphereGeometry args={[0.06, 10, 10]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>
      {/* Right pupil */}
      <mesh position={[0.07, 0.52, 0.21]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
    </group>
  )
}

export default SnowPea
