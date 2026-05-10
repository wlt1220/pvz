import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface SunOrbProps {
  startPosition: [number, number, number]
  onRemove: () => void
}

function SunOrb({ startPosition, onRemove }: SunOrbProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [removed, setRemoved] = useState(false)
  const startY = useRef(startPosition[1])

  useFrame((state, delta) => {
    if (!meshRef.current || removed) return

    // Float upward
    meshRef.current.position.y += delta * 0.5

    // Pulsing scale
    const time = state.clock.elapsedTime
    const scale = 1.0 + 0.2 * Math.sin(time * 4)
    meshRef.current.scale.set(scale, scale, scale)

    // Remove after floating 2 units up
    if (meshRef.current.position.y - startY.current > 2) {
      setRemoved(true)
      onRemove()
    }
  })

  if (removed) return null

  return (
    <mesh ref={meshRef} position={[startPosition[0], startPosition[1], startPosition[2]]}>
      <sphereGeometry args={[0.12, 16, 16]} />
      <meshStandardMaterial
        color="#FFD700"
        emissive="#FFD700"
        emissiveIntensity={0.5}
      />
    </mesh>
  )
}

export default SunOrb
