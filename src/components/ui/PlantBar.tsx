import { useState } from 'react'
import { useGameStore } from '../../store/gameStore'
import { PlantType } from '../../game/types'
import { PLANT_CONFIGS } from '../../game/configs'
import { PLANT_RECHARGE } from '../../game/progression'

const PLANT_COLORS: Record<PlantType, string> = {
  [PlantType.sunflower]: '#fdd835',
  [PlantType.peashooter]: '#4caf50',
  [PlantType.wallnut]: '#8d6e63',
  [PlantType.snowpea]: '#81d4fa',
  [PlantType.cherrybomb]: '#e53935',
  [PlantType.potatomine]: '#795548',
  [PlantType.repeater]: '#2e7d32',
  [PlantType.chomper]: '#9c27b0',
  [PlantType.tallnut]: '#4e342e',
  [PlantType.torchwood]: '#ff9800',
}

const PLANT_LABELS: Record<PlantType, string> = {
  [PlantType.sunflower]: 'S',
  [PlantType.peashooter]: 'P',
  [PlantType.wallnut]: 'W',
  [PlantType.snowpea]: 'Sn',
  [PlantType.cherrybomb]: 'C',
  [PlantType.potatomine]: 'M',
  [PlantType.repeater]: 'R',
  [PlantType.chomper]: 'Ch',
  [PlantType.tallnut]: 'T',
  [PlantType.torchwood]: 'Tw',
}

const PLANT_DESCRIPTIONS: Record<PlantType, string> = {
  [PlantType.sunflower]: 'Produces 25 sun every 7.5s',
  [PlantType.peashooter]: 'Shoots peas at zombies',
  [PlantType.wallnut]: 'Blocks zombies with high HP',
  [PlantType.snowpea]: 'Slows zombies on hit',
  [PlantType.cherrybomb]: 'Explodes in 3x3 area (instant)',
  [PlantType.potatomine]: 'Arms in 15s, then explodes on contact',
  [PlantType.repeater]: 'Fires 2 peas per shot',
  [PlantType.chomper]: 'Eats a zombie whole (30s digest)',
  [PlantType.tallnut]: 'Blocks vaulters, very high HP',
  [PlantType.torchwood]: 'Turns peas into fire peas (2x dmg)',
}

function PlantBar() {
  const sun = useGameStore((s) => s.sun)
  const selectedPlant = useGameStore((s) => s.selectedPlant)
  const selectPlant = useGameStore((s) => s.selectPlant)
  const unlockedPlants = useGameStore((s) => s.unlockedPlants)
  const plantCooldowns = useGameStore((s) => s.plantCooldowns)
  const [hoveredPlant, setHoveredPlant] = useState<PlantType | null>(null)

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        pointerEvents: 'none',
        display: 'flex',
        justifyContent: 'center',
        padding: 'clamp(8px, 2vw, 16px)',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 'clamp(6px, 1vw, 10px)',
          background: 'rgba(0,0,0,0.7)',
          borderRadius: '16px',
          padding: 'clamp(8px, 1.5vw, 14px) clamp(12px, 2vw, 18px)',
          pointerEvents: 'auto',
          justifyContent: 'center',
        }}
      >
        {unlockedPlants.map((type, index) => {
          const config = PLANT_CONFIGS[type]
          const canAfford = sun >= config.cost
          const isSelected = selectedPlant === type
          const cooldown = plantCooldowns[type]
          const isOnCooldown = cooldown !== undefined && cooldown > 0
          const cooldownRatio = isOnCooldown ? cooldown / PLANT_RECHARGE[type] : 0
          const isDisabled = !canAfford || isOnCooldown
          const keyLabel = index < 9 ? String(index + 1) : '0'
          return (
            <div
              key={type}
              style={{ position: 'relative' }}
              onMouseEnter={() => setHoveredPlant(type)}
              onMouseLeave={() => setHoveredPlant(null)}
            >
              {/* Tooltip */}
              {hoveredPlant === type && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: '100%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    marginBottom: '8px',
                    background: '#1a1a2e',
                    color: '#fff',
                    borderRadius: '8px',
                    padding: '12px',
                    maxWidth: '200px',
                    fontSize: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                    zIndex: 100,
                    whiteSpace: 'normal',
                    pointerEvents: 'none',
                  }}
                >
                  <div style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '6px', textTransform: 'capitalize' }}>
                    {type}
                  </div>
                  <div>Cost: {config.cost} sun</div>
                  <div>HP: {config.hp}</div>
                  <div>Damage: {config.damage || 'None'}</div>
                  <div style={{ marginTop: '4px', color: '#aed581', fontStyle: 'italic' }}>
                    {PLANT_DESCRIPTIONS[type]}
                  </div>
                  {/* Triangle pointer */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '-6px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: 0,
                      height: 0,
                      borderLeft: '6px solid transparent',
                      borderRight: '6px solid transparent',
                      borderTop: '6px solid #1a1a2e',
                    }}
                  />
                </div>
              )}
              {/* Key badge */}
              <div
                style={{
                  position: 'absolute',
                  top: '2px',
                  right: '2px',
                  width: '16px',
                  height: '16px',
                  borderRadius: '4px',
                  background: 'rgba(0,0,0,0.7)',
                  color: '#fff',
                  fontSize: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  zIndex: 3,
                  pointerEvents: 'none',
                }}
              >
                {keyLabel}
              </div>
              <button
                onClick={() => {
                  if (!isDisabled) selectPlant(isSelected ? null : type)
                }}
                disabled={isDisabled}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  padding: 'clamp(6px, 1vw, 10px)',
                  border: isSelected ? '3px solid #76ff03' : '2px solid rgba(255,255,255,0.3)',
                  borderRadius: '12px',
                  background: isDisabled ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.1)',
                  cursor: isDisabled ? 'not-allowed' : 'pointer',
                  opacity: isDisabled ? 0.6 : 1,
                  boxShadow: isSelected ? '0 0 12px #76ff03' : 'none',
                  minWidth: '64px',
                  minHeight: '48px',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
              {/* Cooldown overlay */}
              {isOnCooldown && (
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: `${(1 - cooldownRatio) * 100}%`,
                    background: 'rgba(0,0,0,0.6)',
                    borderRadius: '12px',
                    pointerEvents: 'none',
                    zIndex: 1,
                  }}
                />
              )}
              {/* Plant icon */}
              <div
                style={{
                  width: 'clamp(36px, 5vw, 48px)',
                  height: 'clamp(36px, 5vw, 48px)',
                  borderRadius: '50%',
                  background: PLANT_COLORS[type],
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontWeight: 'bold',
                  fontSize: 'clamp(12px, 2vw, 16px)',
                  textShadow: '1px 1px 1px rgba(0,0,0,0.5)',
                  position: 'relative',
                  zIndex: 2,
                }}
              >
                {PLANT_LABELS[type]}
              </div>
              {/* Plant name */}
              <span
                style={{
                  color: '#fff',
                  fontSize: 'clamp(9px, 1.5vw, 11px)',
                  whiteSpace: 'nowrap',
                  position: 'relative',
                  zIndex: 2,
                }}
              >
                {type}
              </span>
              {/* Sun cost */}
              <span
                style={{
                  color: canAfford ? '#ffeb3b' : '#ef5350',
                  fontSize: 'clamp(11px, 1.8vw, 13px)',
                  fontWeight: 'bold',
                  position: 'relative',
                  zIndex: 2,
                }}
              >
                {config.cost}
              </span>
            </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default PlantBar
