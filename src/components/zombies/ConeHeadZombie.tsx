import { useRef, useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useGameStore } from '../../store/gameStore'

interface ConeHeadZombieProps {
  position: [number, number, number]
  speed?: number
}

let coneZombieIdCounter = 0

function ConeHeadZombie({ position, speed = 0.3 }: ConeHeadZombieProps) {
  const groupRef = useRef<THREE.Group>(null)
  const coneRef = useRef<THREE.Mesh>(null)
  const leftArmRef = useRef<THREE.Mesh>(null)
  const rightArmRef = useRef<THREE.Mesh>(null)
  const leftLegRef = useRef<THREE.Mesh>(null)
  const rightLegRef = useRef<THREE.Mesh>(null)

  const zombieId = useMemo(() => `cone-zombie-${coneZombieIdCounter++}`, [])
  const registerZombie = useGameStore((s) => s.registerZombie)
  const unregisterZombie = useGameStore((s) => s.unregisterZombie)
  const updateZombiePosition = useGameStore((s) => s.updateZombiePosition)

  useEffect(() => {
    registerZombie(zombieId, position[0], position[2])
    return () => {
      unregisterZombie(zombieId)
    }
  }, [zombieId, position, registerZombie, unregisterZombie])

  useFrame((_state, delta) => {
    if (!groupRef.current) return

    // Move from right to left
    groupRef.current.position.x -= speed * delta

    // Update position in store for collision detection
    updateZombiePosition(zombieId, groupRef.current.position.x, groupRef.current.position.z)

    // Shambling sway animation
    const time = _state.clock.elapsedTime
    groupRef.current.rotation.z = Math.sin(time * 3) * 0.1

    // Cone wobble (slightly offset from body sway)
    if (coneRef.current) {
      coneRef.current.rotation.z = Math.sin(time * 3 + 0.5) * 0.15
      coneRef.current.rotation.x = Math.sin(time * 2.5) * 0.08
    }

    // Arms bob
    if (leftArmRef.current) leftArmRef.current.rotation.x = Math.sin(time * 3) * 0.15
    if (rightArmRef.current) rightArmRef.current.rotation.x = Math.sin(time * 3 + 1) * 0.15

    // Legs alternate
    if (leftLegRef.current) leftLegRef.current.rotation.x = Math.sin(time * 4) * 0.3
    if (rightLegRef.current) rightLegRef.current.rotation.x = Math.sin(time * 4 + Math.PI) * 0.3
  })

  return (
    <group ref={groupRef} position={position}>
      {/* Body/torso */}
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.5, 8]} />
        <meshStandardMaterial color="#6B8E5A" />
      </mesh>

      {/* Head */}
      <mesh position={[0, 0.8, 0]}>
        <sphereGeometry args={[0.18, 12, 12]} />
        <meshStandardMaterial color="#7A9E6A" />
      </mesh>

      {/* Face group */}
      <group position={[0, 0.8, 0]}>
        {/* Left eye - bigger (mismatched) */}
        <mesh position={[-0.07, 0.04, 0.15]}>
          <sphereGeometry args={[0.055, 8, 8]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
        {/* Left pupil */}
        <mesh position={[-0.09, 0.06, 0.2]}>
          <sphereGeometry args={[0.025, 6, 6]} />
          <meshStandardMaterial color="#000000" />
        </mesh>

        {/* Right eye - smaller */}
        <mesh position={[0.07, 0.02, 0.15]}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
        {/* Right pupil */}
        <mesh position={[0.08, 0.0, 0.19]}>
          <sphereGeometry args={[0.02, 6, 6]} />
          <meshStandardMaterial color="#000000" />
        </mesh>

        {/* Tongue sticking out */}
        <mesh position={[0.02, -0.08, 0.16]}>
          <sphereGeometry args={[0.035, 8, 8]} />
          <meshStandardMaterial color="#FF69B4" />
        </mesh>
      </group>

      {/* Left arm */}
      <mesh ref={leftArmRef} position={[-0.25, 0.5, -0.15]} rotation={[Math.PI / 4, 0, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.4, 6]} />
        <meshStandardMaterial color="#6B8E5A" />
      </mesh>

      {/* Right arm */}
      <mesh ref={rightArmRef} position={[0.25, 0.55, -0.15]} rotation={[Math.PI / 3, 0, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.4, 6]} />
        <meshStandardMaterial color="#6B8E5A" />
      </mesh>

      {/* Left leg */}
      <mesh ref={leftLegRef} position={[-0.08, 0.1, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.3, 6]} />
        <meshStandardMaterial color="#4A6B3A" />
      </mesh>

      {/* Right leg */}
      <mesh ref={rightLegRef} position={[0.08, 0.1, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.3, 6]} />
        <meshStandardMaterial color="#4A6B3A" />
      </mesh>

      {/* Torn clothes patches */}
      <mesh position={[0.08, 0.45, 0.12]} rotation={[0, 0, 0.3]}>
        <boxGeometry args={[0.08, 0.1, 0.02]} />
        <meshStandardMaterial color="#4A5A3A" />
      </mesh>
      <mesh position={[-0.06, 0.32, 0.13]} rotation={[0, 0, -0.2]}>
        <boxGeometry args={[0.07, 0.06, 0.02]} />
        <meshStandardMaterial color="#3A4A2A" />
      </mesh>

      {/* Orange traffic cone on head */}
      <mesh ref={coneRef} position={[0, 1.1, 0]}>
        <coneGeometry args={[0.12, 0.3, 8]} />
        <meshStandardMaterial color="#FF6600" />
      </mesh>
    </group>
  )
}

export default ConeHeadZombie
