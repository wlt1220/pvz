import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const PARTICLE_COUNT = 40

function SunParticles() {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])

  // Generate random initial positions and velocities
  const particles = useMemo(() => {
    return Array.from({ length: PARTICLE_COUNT }, () => ({
      x: (Math.random() - 0.5) * 12,
      y: Math.random() * 4 + 1,
      z: (Math.random() - 0.5) * 8,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.1,
      vz: (Math.random() - 0.5) * 0.2,
      phase: Math.random() * Math.PI * 2,
    }))
  }, [])

  useFrame((state) => {
    if (!meshRef.current) return

    const time = state.clock.elapsedTime

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const p = particles[i]!
      const x = p.x + Math.sin(time * 0.5 + p.phase) * p.vx * 3
      const y = p.y + Math.sin(time * 0.3 + p.phase) * p.vy * 2
      const z = p.z + Math.cos(time * 0.4 + p.phase) * p.vz * 3

      dummy.position.set(x, y, z)
      const scale = 0.8 + Math.sin(time * 2 + p.phase) * 0.3
      dummy.scale.set(scale, scale, scale)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    }

    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, PARTICLE_COUNT]}>
      <sphereGeometry args={[0.03, 6, 6]} />
      <meshStandardMaterial
        color="#FFD700"
        emissive="#FFAA00"
        emissiveIntensity={0.8}
        transparent
        opacity={0.7}
      />
    </instancedMesh>
  )
}

export default SunParticles
