import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { PlantEntity } from '../../game/types'
import { PlantType } from '../../game/types'
import { PLANT_CONFIGS } from '../../game/configs'
import { gridToWorld } from '../../utils/gridUtils'
import Sunflower from './Sunflower'
import Peashooter from './Peashooter'
import WallNut from './WallNut'
import SnowPea from './SnowPea'
import CherryBomb from './CherryBomb'
import PotatoMine from './PotatoMine'
import Repeater from './Repeater'
import Chomper from './Chomper'
import TallNut from './TallNut'
import Torchwood from './Torchwood'
import * as THREE from 'three'

const PLACEMENT_DURATION = 0.4 // 400ms

interface PlantRendererProps {
  plant: PlantEntity
}

function PlantRenderer({ plant }: PlantRendererProps) {
  const groupRef = useRef<THREE.Group>(null)
  const mountTimeRef = useRef<number | null>(null)
  const prevHpRef = useRef(plant.hp)
  const flashTimeRef = useRef<number | null>(null)

  // Detect HP decrease for damage flash
  const damaged = plant.hp < prevHpRef.current
  if (damaged) {
    flashTimeRef.current = Date.now()
  }
  prevHpRef.current = plant.hp

  useFrame((state) => {
    if (!groupRef.current) return

    // Placement animation
    if (mountTimeRef.current === null) {
      mountTimeRef.current = state.clock.elapsedTime
    }

    const elapsed = state.clock.elapsedTime - mountTimeRef.current
    if (elapsed < PLACEMENT_DURATION) {
      let scale: number
      if (elapsed < PLACEMENT_DURATION / 2) {
        // First half: 0 to 1.1
        const t = elapsed / (PLACEMENT_DURATION / 2)
        scale = t * 1.1
      } else {
        // Second half: 1.1 to 1.0
        const t = (elapsed - PLACEMENT_DURATION / 2) / (PLACEMENT_DURATION / 2)
        scale = 1.1 - t * 0.1
      }
      groupRef.current.scale.set(scale, scale, scale)
    } else {
      // After animation: apply damage scale
      const config = PLANT_CONFIGS[plant.type]
      const damageScale = plant.hp < config.hp * 0.5 ? 0.95 : 1
      groupRef.current.scale.set(damageScale, damageScale, damageScale)
    }

    // Damage flash effect
    if (flashTimeRef.current !== null) {
      const flashElapsed = Date.now() - flashTimeRef.current
      if (flashElapsed < 150) {
        groupRef.current.traverse((child) => {
          if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
            child.material.emissive = new THREE.Color('#ff0000')
            child.material.emissiveIntensity = 0.5
          }
        })
      } else {
        flashTimeRef.current = null
        groupRef.current.traverse((child) => {
          if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
            child.material.emissive = new THREE.Color('#000000')
            child.material.emissiveIntensity = 0
          }
        })
      }
    }
  })

  if (plant.hp <= 0) return null

  const position = gridToWorld(plant.row, plant.col)

  const renderPlant = () => {
    switch (plant.type) {
      case PlantType.sunflower:
        return <Sunflower position={position} />
      case PlantType.peashooter:
        return <Peashooter position={position} />
      case PlantType.wallnut:
        return <WallNut position={position} />
      case PlantType.snowpea:
        return <SnowPea position={position} />
      case PlantType.cherrybomb:
        return <CherryBomb position={position} />
      case PlantType.potatomine:
        return <PotatoMine position={position} armed={plant.state === 'armed'} />
      case PlantType.repeater:
        return <Repeater position={position} />
      case PlantType.chomper:
        return <Chomper position={position} digesting={plant.specialTimer > 0} />
      case PlantType.tallnut:
        return <TallNut position={position} />
      case PlantType.torchwood:
        return <Torchwood position={position} />
      default:
        return null
    }
  }

  return (
    <group ref={groupRef}>
      {renderPlant()}
    </group>
  )
}

export default PlantRenderer
