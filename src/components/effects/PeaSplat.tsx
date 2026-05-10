import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface PeaSplatProps {
  position: [number, number, number]
  visible: boolean
}

const SPLAT_COUNT = 6

function PeaSplat({ position, visible }: PeaSplatProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const timerRef = useRef(0)
  const activeRef = useRef(false)

  // Random directions for splat particles
  const directions = useMemo(() => {
    return Array.from({ length: SPLAT_COUNT }, () => ({
      dx: (Math.random() - 0.5) * 2,
      dy: Math.random() * 1.5,
      dz: (Math.random() - 0.5) * 2,
    }))
  }, [])

  useFrame((_state, delta) => {
    if (!meshRef.current) return

    // Reset timer when becoming visible
    if (visible && !activeRef.current) {
      timerRef.current = 0
      activeRef.current = true
    }

    if (!visible) {
      activeRef.current = false
    }

    if (!activeRef.current) {
      // Hide all instances offscreen
      for (let i = 0; i < SPLAT_COUNT; i++) {
        dummy.position.set(0, -100, 0)
        dummy.scale.set(0, 0, 0)
        dummy.updateMatrix()
        meshRef.current.setMatrixAt(i, dummy.matrix)
      }
      meshRef.current.instanceMatrix.needsUpdate = true
      return
    }

    timerRef.current += delta
    const progress = Math.min(timerRef.current / 0.5, 1)

    for (let i = 0; i < SPLAT_COUNT; i++) {
      const dir = directions[i]!
      const x = position[0] + dir.dx * progress * 0.5
      const y = position[1] + dir.dy * progress * 0.5
      const z = position[2] + dir.dz * progress * 0.5

      dummy.position.set(x, y, z)
      // Scale up quickly then shrink
      const scale = progress < 0.3
        ? progress / 0.3
        : 1 - ((progress - 0.3) / 0.7)
      dummy.scale.set(scale, scale, scale)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    }

    meshRef.current.instanceMatrix.needsUpdate = true

    // Deactivate after animation completes
    if (progress >= 1) {
      activeRef.current = false
    }
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, SPLAT_COUNT]}>
      <sphereGeometry args={[0.05, 6, 6]} />
      <meshStandardMaterial
        color="#32CD32"
        emissive="#00ff00"
        emissiveIntensity={0.4}
      />
    </instancedMesh>
  )
}

export default PeaSplat
