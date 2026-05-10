import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { ZombieEntity } from '../../game/types'
import { ZombieType } from '../../game/types'
import { colToWorldX, rowToZ } from '../../utils/gridUtils'
import RegularZombie from './RegularZombie'
import ConeHeadZombie from './ConeHeadZombie'
import BucketHeadZombie from './BucketHeadZombie'
import FlagZombie from './FlagZombie'
import PoleVaultingZombie from './PoleVaultingZombie'
import NewspaperZombie from './NewspaperZombie'
import FootballZombie from './FootballZombie'
import GargantuarZombie from './GargantuarZombie'
import * as THREE from 'three'

const DAMAGE_FLASH_COLOR = new THREE.Color('#ff0000')
const DEFAULT_EMISSIVE_COLOR = new THREE.Color('#000000')

const DEATH_DURATION = 0.5 // 500ms

interface DyingZombieProps {
  children: React.ReactNode
}

function DyingZombie({ children }: DyingZombieProps) {
  const groupRef = useRef<THREE.Group>(null)
  const startTimeRef = useRef<number | null>(null)
  const doneRef = useRef(false)

  useFrame((state) => {
    if (doneRef.current) return
    if (!groupRef.current) return

    if (startTimeRef.current === null) {
      startTimeRef.current = state.clock.elapsedTime
    }

    const elapsed = state.clock.elapsedTime - startTimeRef.current
    const progress = Math.min(elapsed / DEATH_DURATION, 1)

    // Scale Y from 1 to 0 (falls flat)
    const scaleY = 1 - progress
    groupRef.current.scale.set(1, scaleY, 1)

    // Fade opacity
    groupRef.current.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
        child.material.transparent = true
        child.material.opacity = 1 - progress
      }
    })

    if (progress >= 1) {
      doneRef.current = true
    }
  })

  if (doneRef.current) return null

  return <group ref={groupRef}>{children}</group>
}

interface ZombieRendererProps {
  zombie: ZombieEntity
}

function ZombieRenderer({ zombie }: ZombieRendererProps) {
  const position: [number, number, number] = [colToWorldX(zombie.x), 0, rowToZ(zombie.row)]
  const prevHpRef = useRef(zombie.hp)
  const damageFlashRef = useRef<THREE.Group>(null)
  const flashTimeRef = useRef<number | null>(null)

  // Detect HP decrease for damage flash
  const damaged = zombie.hp < prevHpRef.current
  if (damaged) {
    flashTimeRef.current = Date.now()
  }
  prevHpRef.current = zombie.hp

  useFrame(() => {
    if (!damageFlashRef.current) return
    if (flashTimeRef.current !== null) {
      const elapsed = Date.now() - flashTimeRef.current
      if (elapsed < 150) {
        damageFlashRef.current.traverse((child) => {
          if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
            child.material.emissive = DAMAGE_FLASH_COLOR
            child.material.emissiveIntensity = 0.5
          }
        })
      } else {
        flashTimeRef.current = null
        damageFlashRef.current.traverse((child) => {
          if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
            child.material.emissive = DEFAULT_EMISSIVE_COLOR
            child.material.emissiveIntensity = 0
          }
        })
      }
    }
  })

  const renderZombie = () => {
    switch (zombie.type) {
      case ZombieType.regular:
        return <RegularZombie position={position} />
      case ZombieType.conehead:
        return <ConeHeadZombie position={position} />
      case ZombieType.buckethead:
        return <BucketHeadZombie position={position} />
      case ZombieType.flag:
        return <FlagZombie position={position} />
      case ZombieType.polevaulting:
        return <PoleVaultingZombie position={position} hasJumped={!!zombie.specialState['hasJumped']} />
      case ZombieType.newspaper:
        return <NewspaperZombie position={position} hasNewspaper={!zombie.specialState['enraged']} />
      case ZombieType.football:
        return <FootballZombie position={position} />
      case ZombieType.gargantuar:
        return <GargantuarZombie position={position} />
      default:
        return null
    }
  }

  if (zombie.state === 'dying') {
    return (
      <DyingZombie>
        {renderZombie()}
      </DyingZombie>
    )
  }

  return <group ref={damageFlashRef}>{renderZombie()}</group>
}

export default ZombieRenderer
