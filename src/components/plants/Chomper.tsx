import { memo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface ChomperProps {
  position: [number, number, number]
  digesting?: boolean
}

const Chomper = memo(function Chomper({ position, digesting = false }: ChomperProps) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!groupRef.current) return
    const time = state.clock.elapsedTime
    // Gentle sway
    groupRef.current.rotation.z = Math.sin(time * 2) * 0.03
  })

  const headColor = digesting ? '#5E1691' : '#7B1FA2'
  const jawSeparation = digesting ? 0 : 0.08

  return (
    <group ref={groupRef} position={position}>
      {/* Tall stem */}
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.08, 0.1, 0.6, 8]} />
        <meshStandardMaterial color="#7B1FA2" />
      </mesh>

      {/* Spots on stem */}
      <mesh position={[0.08, 0.25, 0.04]}>
        <sphereGeometry args={[0.03, 6, 6]} />
        <meshStandardMaterial color="#4A148C" />
      </mesh>
      <mesh position={[-0.06, 0.4, 0.06]}>
        <sphereGeometry args={[0.025, 6, 6]} />
        <meshStandardMaterial color="#4A148C" />
      </mesh>
      <mesh position={[0.04, 0.15, -0.07]}>
        <sphereGeometry args={[0.02, 6, 6]} />
        <meshStandardMaterial color="#4A148C" />
      </mesh>

      {/* Upper jaw */}
      <mesh position={[0, 0.65 + jawSeparation, 0.05]} rotation={[0.2, 0, 0]}>
        <sphereGeometry args={[0.18, 12, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={headColor} />
      </mesh>

      {/* Lower jaw */}
      <mesh position={[0, 0.6 - jawSeparation, 0.05]} rotation={[-0.2, 0, 0]}>
        <sphereGeometry args={[0.18, 12, 12, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
        <meshStandardMaterial color={headColor} />
      </mesh>

      {/* Eyes on top jaw (only visible when not digesting) */}
      {!digesting && (
        <>
          {/* Left eye */}
          <mesh position={[-0.08, 0.78, 0.1]}>
            <sphereGeometry args={[0.06, 8, 8]} />
            <meshStandardMaterial color="#FFFFFF" />
          </mesh>
          <mesh position={[-0.08, 0.78, 0.15]}>
            <sphereGeometry args={[0.03, 6, 6]} />
            <meshStandardMaterial color="#000000" />
          </mesh>

          {/* Right eye */}
          <mesh position={[0.08, 0.78, 0.1]}>
            <sphereGeometry args={[0.06, 8, 8]} />
            <meshStandardMaterial color="#FFFFFF" />
          </mesh>
          <mesh position={[0.08, 0.78, 0.15]}>
            <sphereGeometry args={[0.03, 6, 6]} />
            <meshStandardMaterial color="#000000" />
          </mesh>
        </>
      )}
    </group>
  )
})

export default Chomper
