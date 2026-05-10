import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface PeaProps {
  startPosition: [number, number, number]
  onRemove: () => void
}

function Pea({ startPosition, onRemove }: PeaProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [removed, setRemoved] = useState(false)
  const startX = useRef(startPosition[0])

  useFrame((_state, delta) => {
    if (!meshRef.current || removed) return

    // Move rightward
    meshRef.current.position.x += 5 * delta

    // Remove after traveling 10 units
    if (meshRef.current.position.x - startX.current > 10) {
      setRemoved(true)
      onRemove()
    }
  })

  if (removed) return null

  return (
    <mesh
      ref={meshRef}
      position={[startPosition[0], startPosition[1], startPosition[2]]}
      castShadow
    >
      <sphereGeometry args={[0.08, 12, 12]} />
      <meshStandardMaterial
        color="#32CD32"
        emissive="#00ff00"
        emissiveIntensity={0.3}
      />
    </mesh>
  )
}

export default Pea
