import { memo } from 'react'
import type { ProjectileEntity } from '../game/types'
import { ProjectileType } from '../game/types'
import { colToWorldX, rowToZ } from '../utils/gridUtils'

interface ProjectileRendererProps {
  projectile: ProjectileEntity
}

const ProjectileRenderer = memo(function ProjectileRenderer({ projectile }: ProjectileRendererProps) {
  const position: [number, number, number] = [colToWorldX(projectile.x), 0.4, rowToZ(projectile.row)]

  switch (projectile.type) {
    case ProjectileType.pea:
      return (
        <mesh position={position}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshStandardMaterial color="#32CD32" />
        </mesh>
      )
    case ProjectileType.frozenpea:
      return (
        <mesh position={position}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshStandardMaterial color="#4FC3F7" emissive="#4FC3F7" emissiveIntensity={0.3} />
        </mesh>
      )
    case ProjectileType.firepea:
      return (
        <mesh position={position}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshStandardMaterial color="#FF5722" emissive="#FF5722" emissiveIntensity={0.4} />
        </mesh>
      )
    default:
      return null
  }
})

export default ProjectileRenderer
