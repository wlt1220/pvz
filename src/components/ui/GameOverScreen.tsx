import { useGameStore } from '../../store/gameStore'
import { GamePhase } from '../../game/types'
import { LEVEL_META } from '../../game/progression'
import { LEVELS } from '../../game/levels'
import { buttonBase, overlayBase } from './styles'

function StarDisplay({ count }: { count: number }) {
  return (
    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', margin: '12px 0' }}>
      {[1, 2, 3].map((i) => (
        <span
          key={i}
          style={{
            fontSize: 'clamp(28px, 5vw, 40px)',
            color: i <= count ? '#fdd835' : '#555',
            textShadow: i <= count ? '0 0 10px #ff9800' : 'none',
          }}
        >
          ★
        </span>
      ))}
    </div>
  )
}

function GameOverScreen() {
  const gamePhase = useGameStore((s) => s.gamePhase)
  const currentLevel = useGameStore((s) => s.currentLevel)
  const startLevel = useGameStore((s) => s.startLevel)
  const goToLevelSelect = useGameStore((s) => s.goToLevelSelect)
  const zombiesKilledThisLevel = useGameStore((s) => s.zombiesKilledThisLevel)
  const sunCollectedThisLevel = useGameStore((s) => s.sunCollectedThisLevel)
  const completedLevels = useGameStore((s) => s.completedLevels)

  const isVictory = gamePhase === GamePhase.won
  const completion = completedLevels[currentLevel]
  const stars = completion?.stars ?? 0
  const hasNextLevel = LEVELS[currentLevel] !== undefined

  // Check if the next level unlocks new plants
  const currentMeta = LEVEL_META[currentLevel]
  const nextMeta = LEVEL_META[currentLevel + 1]
  const newPlants = nextMeta
    ? nextMeta.availablePlants.filter(
        (p) => !currentMeta?.availablePlants.includes(p)
      )
    : []

  return (
    <div
      style={{
        ...overlayBase,
        background: 'rgba(0,0,0,0.8)',
        padding: 'clamp(16px, 4vw, 32px)',
        gap: '16px',
      }}
    >
      {/* Title */}
      <h1
        style={{
          color: isVictory ? '#76ff03' : '#ff1744',
          fontSize: 'clamp(36px, 7vw, 56px)',
          fontWeight: 'bold',
          textShadow: isVictory
            ? '0 0 20px rgba(118,255,3,0.6)'
            : '0 0 20px rgba(255,23,68,0.6)',
          margin: 0,
          textAlign: 'center',
          animation: 'none',
        }}
      >
        {isVictory ? 'Victory!' : 'Zombies Ate Your Brains!'}
      </h1>

      {/* Stars for victory */}
      {isVictory && <StarDisplay count={stars} />}

      {/* Stats */}
      <div
        style={{
          display: 'flex',
          gap: 'clamp(16px, 3vw, 32px)',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: '#ef5350', fontSize: 'clamp(24px, 5vw, 36px)', fontWeight: 'bold' }}>
            {zombiesKilledThisLevel}
          </div>
          <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 'clamp(12px, 2vw, 16px)' }}>
            Zombies Defeated
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: '#fdd835', fontSize: 'clamp(24px, 5vw, 36px)', fontWeight: 'bold' }}>
            {sunCollectedThisLevel}
          </div>
          <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 'clamp(12px, 2vw, 16px)' }}>
            Sun Collected
          </div>
        </div>
      </div>

      {/* New plants unlocked */}
      {isVictory && newPlants.length > 0 && (
        <div style={{ color: '#81c784', fontSize: 'clamp(14px, 2.5vw, 18px)', textAlign: 'center' }}>
          New plants unlocked: {newPlants.join(', ')}
        </div>
      )}

      {/* Buttons */}
      <div
        style={{
          display: 'flex',
          gap: '12px',
          flexWrap: 'wrap',
          justifyContent: 'center',
          marginTop: '8px',
        }}
      >
        {isVictory && hasNextLevel && (
          <button
            onClick={() => startLevel(currentLevel + 1)}
            style={{
              ...buttonBase,
              minHeight: '60px',
              background: 'linear-gradient(135deg, #66bb6a, #2e7d32)',
              color: '#fff',
              fontSize: 'clamp(16px, 3vw, 22px)',
              padding: '16px 32px',
              boxShadow: '0 4px 12px rgba(76,175,80,0.4)',
            }}
          >
            Next Level
          </button>
        )}
        <button
          onClick={() => startLevel(currentLevel)}
          style={{
            ...buttonBase,
            minHeight: '60px',
            background: isVictory
              ? 'rgba(255,255,255,0.2)'
              : 'linear-gradient(135deg, #ff7043, #d84315)',
            color: '#fff',
            fontSize: 'clamp(16px, 3vw, 22px)',
            padding: '16px 32px',
            border: isVictory ? '2px solid rgba(255,255,255,0.4)' : 'none',
            boxShadow: isVictory ? 'none' : '0 4px 12px rgba(255,87,34,0.4)',
          }}
        >
          {isVictory ? 'Replay' : 'Try Again'}
        </button>
        <button
          onClick={goToLevelSelect}
          style={{
            ...buttonBase,
            minHeight: '60px',
            background: 'rgba(255,255,255,0.15)',
            color: '#fff',
            border: '2px solid rgba(255,255,255,0.4)',
            fontSize: 'clamp(16px, 3vw, 22px)',
            padding: '16px 32px',
          }}
        >
          Level Select
        </button>
      </div>
    </div>
  )
}

export default GameOverScreen
