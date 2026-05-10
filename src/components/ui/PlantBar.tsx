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

function PlantBar() {
  const sun = useGameStore((s) => s.sun)
  const selectedPlant = useGameStore((s) => s.selectedPlant)
  const selectPlant = useGameStore((s) => s.selectPlant)
  const unlockedPlants = useGameStore((s) => s.unlockedPlants)
  const plantCooldowns = useGameStore((s) => s.plantCooldowns)

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
        {unlockedPlants.map((type) => {
          const config = PLANT_CONFIGS[type]
          const canAfford = sun >= config.cost
          const isSelected = selectedPlant === type
          const cooldown = plantCooldowns[type]
          const isOnCooldown = cooldown !== undefined && cooldown > 0
          const cooldownRatio = isOnCooldown ? cooldown / PLANT_RECHARGE[type] : 0
          const isDisabled = !canAfford || isOnCooldown
          return (
            <button
              key={type}
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
          )
        })}
      </div>
    </div>
  )
}

export default PlantBar
