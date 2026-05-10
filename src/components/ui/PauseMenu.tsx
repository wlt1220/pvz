import { useGameStore } from '../../store/gameStore'
import { buttonBase, overlayBase } from './styles'

function PauseMenu() {
  const resumeGame = useGameStore((s) => s.resumeGame)
  const startLevel = useGameStore((s) => s.startLevel)
  const currentLevel = useGameStore((s) => s.currentLevel)
  const goToLevelSelect = useGameStore((s) => s.goToLevelSelect)

  return (
    <div
      style={{
        ...overlayBase,
        background: 'rgba(0,0,0,0.7)',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px',
          padding: 'clamp(24px, 5vw, 40px)',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '24px',
          backdropFilter: 'blur(4px)',
        }}
      >
        <h2
          style={{
            color: '#fff',
            fontSize: 'clamp(32px, 6vw, 48px)',
            fontWeight: 'bold',
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
            margin: 0,
          }}
        >
          Paused
        </h2>

        {/* Resume */}
        <button
          onClick={resumeGame}
          style={{
            ...buttonBase,
            width: '100%',
            minWidth: '220px',
            minHeight: '60px',
            background: 'linear-gradient(135deg, #66bb6a, #388e3c)',
            color: '#fff',
            fontSize: 'clamp(18px, 3vw, 24px)',
            boxShadow: '0 4px 12px rgba(76,175,80,0.4)',
          }}
        >
          Resume
        </button>

        {/* Restart */}
        <button
          onClick={() => startLevel(currentLevel)}
          style={{
            ...buttonBase,
            width: '100%',
            minWidth: '220px',
            minHeight: '60px',
            background: 'linear-gradient(135deg, #ffa726, #f57c00)',
            color: '#fff',
            fontSize: 'clamp(18px, 3vw, 24px)',
            boxShadow: '0 4px 12px rgba(255,152,0,0.4)',
          }}
        >
          Restart Level
        </button>

        {/* Quit */}
        <button
          onClick={goToLevelSelect}
          style={{
            ...buttonBase,
            width: '100%',
            minWidth: '220px',
            minHeight: '60px',
            background: 'rgba(255,255,255,0.2)',
            color: '#fff',
            border: '2px solid rgba(255,255,255,0.4)',
            fontSize: 'clamp(18px, 3vw, 24px)',
          }}
        >
          Quit to Menu
        </button>
      </div>
    </div>
  )
}

export default PauseMenu
