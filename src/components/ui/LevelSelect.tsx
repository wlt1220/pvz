import { useState } from 'react'
import { useGameStore } from '../../store/gameStore'
import { LEVEL_META } from '../../game/progression'
import { ZombieType } from '../../game/types'
import { buttonBase, overlayBase } from './styles'

const ZOMBIE_LABELS: Record<ZombieType, string> = {
  [ZombieType.regular]: 'Regular',
  [ZombieType.conehead]: 'Conehead',
  [ZombieType.buckethead]: 'Buckethead',
  [ZombieType.flag]: 'Flag',
  [ZombieType.polevaulting]: 'Pole Vault',
  [ZombieType.newspaper]: 'Newspaper',
  [ZombieType.football]: 'Football',
  [ZombieType.gargantuar]: 'Gargantuar',
}

function StarDisplay({ count }: { count: number }) {
  return (
    <div style={{ display: 'flex', gap: '2px', justifyContent: 'center' }}>
      {[1, 2, 3].map((i) => (
        <span
          key={i}
          style={{
            fontSize: '14px',
            color: i <= count ? '#fdd835' : '#666',
            textShadow: i <= count ? '0 0 4px #ff9800' : 'none',
          }}
        >
          ★
        </span>
      ))}
    </div>
  )
}

function LevelSelect() {
  const unlockedLevels = useGameStore((s) => s.unlockedLevels)
  const completedLevels = useGameStore((s) => s.completedLevels)
  const startLevel = useGameStore((s) => s.startLevel)
  const goToMenu = useGameStore((s) => s.goToMenu)
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null)

  const levels = Array.from({ length: 10 }, (_, i) => i + 1)

  const meta = selectedLevel ? LEVEL_META[selectedLevel] : null

  return (
    <div
      style={{
        ...overlayBase,
        background: 'linear-gradient(180deg, #43a047 0%, #1b5e20 100%)',
        padding: 'clamp(16px, 4vw, 32px)',
        gap: '24px',
        overflow: 'auto',
      }}
    >
      <h2
        style={{
          color: '#fff',
          fontSize: 'clamp(28px, 5vw, 42px)',
          fontWeight: 'bold',
          textShadow: '2px 2px 4px rgba(0,0,0,0.4)',
          margin: 0,
        }}
      >
        Choose Your Level
      </h2>

      {/* Level grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))',
          gap: 'clamp(12px, 2vw, 20px)',
          width: '100%',
          maxWidth: '560px',
        }}
      >
        {levels.map((level) => {
          const isUnlocked = level <= unlockedLevels
          const completion = completedLevels[level]
          const isSelected = selectedLevel === level
          return (
            <button
              key={level}
              onClick={() => {
                if (isUnlocked) setSelectedLevel(level)
              }}
              disabled={!isUnlocked}
              style={{
                width: '100%',
                minWidth: '80px',
                minHeight: '80px',
                aspectRatio: '1',
                borderRadius: '16px',
                border: isSelected ? '4px solid #fdd835' : '3px solid transparent',
                fontSize: 'clamp(20px, 4vw, 28px)',
                fontWeight: 'bold',
                cursor: isUnlocked ? 'pointer' : 'not-allowed',
                background: isUnlocked
                  ? completion
                    ? 'linear-gradient(135deg, #66bb6a, #43a047)'
                    : 'linear-gradient(135deg, #fff, #e8f5e9)'
                  : 'rgba(0,0,0,0.3)',
                color: isUnlocked ? (completion ? '#fff' : '#2e7d32') : 'rgba(255,255,255,0.4)',
                boxShadow: isSelected
                  ? '0 0 16px rgba(253,216,53,0.6)'
                  : isUnlocked
                    ? '0 4px 12px rgba(0,0,0,0.2)'
                    : 'none',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                transition: 'transform 0.1s',
                position: 'relative',
              }}
            >
              {isUnlocked ? (
                <>
                  <span>{level}</span>
                  {completion && <StarDisplay count={completion.stars} />}
                </>
              ) : (
                <span style={{ fontSize: '24px' }}>🔒</span>
              )}
            </button>
          )
        })}
      </div>

      {/* Level preview panel */}
      {meta && selectedLevel && (
        <div
          style={{
            background: 'rgba(255,255,255,0.15)',
            borderRadius: '16px',
            padding: 'clamp(16px, 3vw, 24px)',
            width: '100%',
            maxWidth: '560px',
            backdropFilter: 'blur(4px)',
          }}
        >
          <h3
            style={{
              color: '#fdd835',
              fontSize: 'clamp(18px, 3vw, 24px)',
              margin: '0 0 8px 0',
              fontWeight: 'bold',
            }}
          >
            Level {selectedLevel}
          </h3>
          <p
            style={{
              color: '#fff',
              fontSize: 'clamp(14px, 2.5vw, 18px)',
              margin: '0 0 12px 0',
              lineHeight: 1.4,
            }}
          >
            {meta.introText}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
            {meta.zombieTypes.map((zt) => (
              <span
                key={zt}
                style={{
                  background: 'rgba(244,67,54,0.8)',
                  color: '#fff',
                  padding: '4px 10px',
                  borderRadius: '8px',
                  fontSize: 'clamp(11px, 2vw, 14px)',
                  fontWeight: 'bold',
                }}
              >
                {ZOMBIE_LABELS[zt]}
              </span>
            ))}
          </div>
          <button
            onClick={() => startLevel(selectedLevel)}
            style={{
              ...buttonBase,
              background: 'linear-gradient(135deg, #ff9800, #f57c00)',
              color: '#fff',
              width: '100%',
              fontSize: 'clamp(18px, 3vw, 24px)',
              padding: '16px',
              boxShadow: '0 4px 16px rgba(255,152,0,0.4)',
            }}
          >
            Play Level {selectedLevel}!
          </button>
        </div>
      )}

      {/* Back button */}
      <button
        onClick={goToMenu}
        style={{
          ...buttonBase,
          background: 'rgba(255,255,255,0.2)',
          color: '#fff',
          border: '2px solid rgba(255,255,255,0.5)',
          fontSize: 'clamp(16px, 3vw, 20px)',
        }}
      >
        Back
      </button>
    </div>
  )
}

export default LevelSelect
