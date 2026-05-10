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

interface ZombieRendererProps {
  zombie: ZombieEntity
}

function ZombieRenderer({ zombie }: ZombieRendererProps) {
  if (zombie.state === 'dying') return null

  const position: [number, number, number] = [colToWorldX(zombie.x), 0, rowToZ(zombie.row)]

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

export default ZombieRenderer
