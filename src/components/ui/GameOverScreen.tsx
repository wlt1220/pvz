import { useGameStore } from '../../store/gameStore'
import { GamePhase } from '../../game/types'

function GameOverScreen() {
  const gamePhase = useGameStore((s) => s.gamePhase)
  const currentLevel = useGameStore((s) => s.currentLevel)
  const startLevel = useGameStore((s) => s.startLevel)
  const goToMenu = useGameStore((s) => s.goToMenu)

  const isVictory = gamePhase === GamePhase.won

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.7)',
        fontFamily: 'sans-serif',
      }}
    >
      {/* Result text */}
      <h1
        style={{
          color: isVictory ? '#76ff03' : '#ff1744',
          fontSize: '56px',
          fontWeight: 'bold',
          textShadow: isVictory
            ? '0 0 20px rgba(118,255,3,0.6)'
            : '0 0 20px rgba(255,23,68,0.6)',
          marginBottom: '16px',
          textAlign: 'center',
        }}
      >
        {isVictory ? 'Victory!' : 'Zombies Ate Your Brains!'}
      </h1>

      <p
        style={{
          color: 'rgba(255,255,255,0.7)',
          fontSize: '18px',
          marginBottom: '48px',
        }}
      >
        {isVictory
          ? 'Your garden is safe... for now.'
          : 'Better luck next time!'}
      </p>

      {/* Buttons */}
      <div style={{ display: 'flex', gap: '16px' }}>
        <button
          onClick={() => startLevel(currentLevel)}
          style={{
            padding: '16px 40px',
            fontSize: '22px',
            fontWeight: 'bold',
            color: '#fff',
            background: isVictory ? '#4caf50' : '#ff5722',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            minHeight: '60px',
          }}
        >
          Retry
        </button>
        <button
          onClick={goToMenu}
          style={{
            padding: '16px 40px',
            fontSize: '22px',
            fontWeight: 'bold',
            color: '#fff',
            background: 'rgba(255,255,255,0.2)',
            border: '2px solid rgba(255,255,255,0.5)',
            borderRadius: '12px',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            minHeight: '60px',
          }}
        >
          Menu
        </button>
      </div>
    </div>
  )
}

export default GameOverScreen
