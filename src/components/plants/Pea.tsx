import { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useGameStore } from '../../store/gameStore'
import PeaSplat from '../effects/PeaSplat'

interface PeaProps {
  startPosition: [number, number, number]
  onRemove: () => void
}

function Pea({ startPosition, onRemove }: PeaProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [removed, setRemoved] = useState(false)
  const [splatPosition, setSplatPosition] = useState<[number, number, number] | null>(null)
  const startX = useRef(startPosition[0])
  const hasRemovedRef = useRef(false)

  useEffect(() => {
    return () => {
      if (!hasRemovedRef.current) {
        hasRemovedRef.current = true
        onRemove()
      }
    }
  }, [onRemove])

  // Auto-remove after splat animation finishes
  useEffect(() => {
    if (splatPosition) {
      const timer = setTimeout(() => {
        if (!hasRemovedRef.current) {
          hasRemovedRef.current = true
          onRemove()
        }
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [splatPosition, onRemove])

  useFrame((_state, delta) => {
    if (!meshRef.current || removed) return

    const zombiePositions = useGameStore.getState().zombiePositions

    const peaX = meshRef.current.position.x
    const peaZ = meshRef.current.position.z

    // Check collision with any zombie
    for (const zp of zombiePositions) {
      const dx = Math.abs(peaX - zp.x)
      const dz = Math.abs(peaZ - zp.z)

      // Hit if within 0.3 units in x and 0.4 units in z (same row)
      if (dx < 0.3 && dz < 0.4) {
        setRemoved(true)
        setSplatPosition([peaX, meshRef.current.position.y, peaZ])
        return
      }
    }

    // Move rightward
    meshRef.current.position.x += 5 * delta

    // Remove after traveling 10 units
    if (meshRef.current.position.x - startX.current > 10) {
      setRemoved(true)
      hasRemovedRef.current = true
      onRemove()
    }
  })

  if (removed && splatPosition) {
    return <PeaSplat position={splatPosition} visible={true} />
  }

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
