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

interface PlantRendererProps {
  plant: PlantEntity
}

function PlantRenderer({ plant }: PlantRendererProps) {
  if (plant.hp <= 0) return null

  const position = gridToWorld(plant.row, plant.col)
  const config = PLANT_CONFIGS[plant.type]
  const damaged = plant.hp < config.hp * 0.5
  const scale = damaged ? 0.95 : 1

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
    <group scale={[scale, scale, scale]}>
      {renderPlant()}
    </group>
  )
}

export default PlantRenderer
