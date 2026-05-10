import { useGameStore } from '../../store/gameStore'
import { buttonBase } from './styles'

function HUD() {
  const sun = useGameStore((s) => s.sun)
  const currentWave = useGameStore((s) => s.currentWave)
  const totalWaves = useGameStore((s) => s.totalWaves)
  const pauseGame = useGameStore((s) => s.pauseGame)
  const gameSpeed = useGameStore((s) => s.gameSpeed)
  const setGameSpeed = useGameStore((s) => s.setGameSpeed)
  const shovelMode = useGameStore((s) => s.shovelMode)
  const toggleShovel = useGameStore((s) => s.toggleShovel)

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        pointerEvents: 'none',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        padding: 'clamp(8px, 2vw, 16px)',
        fontFamily: 'sans-serif',
        gap: '8px',
      }}
    >
      {/* Left: Sun counter */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          background: 'rgba(0,0,0,0.6)',
          borderRadius: '16px',
          padding: 'clamp(8px, 1.5vw, 12px) clamp(12px, 2vw, 20px)',
        }}
      >
        <div
          style={{
            width: 'clamp(32px, 5vw, 44px)',
            height: 'clamp(32px, 5vw, 44px)',
            borderRadius: '50%',
            background: 'radial-gradient(circle, #ffeb3b, #ff9800)',
            boxShadow: '0 0 12px #ffeb3b',
            flexShrink: 0,
          }}
        />
        <span
          style={{
            color: '#fff',
            fontSize: 'clamp(22px, 4vw, 32px)',
            fontWeight: 'bold',
            textShadow: '1px 1px 3px rgba(0,0,0,0.8)',
          }}
        >
          {sun}
        </span>
      </div>

      {/* Center: Wave display */}
      <div
        style={{
          background: 'rgba(0,0,0,0.6)',
          borderRadius: '12px',
          padding: 'clamp(6px, 1.5vw, 10px) clamp(12px, 2vw, 20px)',
          color: '#fff',
          fontSize: 'clamp(14px, 2.5vw, 20px)',
          fontWeight: 'bold',
          textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
          whiteSpace: 'nowrap',
        }}
      >
        Wave {currentWave}/{totalWaves}
      </div>

      {/* Right: buttons */}
      <div style={{ display: 'flex', gap: '8px', pointerEvents: 'auto' }}>
        {/* Shovel button */}
        <button
          onClick={toggleShovel}
          style={{
            ...buttonBase,
            minHeight: '48px',
            padding: '8px 12px',
            background: shovelMode
              ? 'linear-gradient(135deg, #ff9800, #e65100)'
              : 'rgba(0,0,0,0.6)',
            color: '#fff',
            border: shovelMode ? '2px solid #fdd835' : '2px solid rgba(255,255,255,0.4)',
            fontSize: 'clamp(18px, 3vw, 24px)',
            boxShadow: shovelMode ? '0 0 12px rgba(255,152,0,0.6)' : 'none',
          }}
          title="Shovel - remove a plant"
        >
          🪴
        </button>

        {/* Speed button */}
        <button
          onClick={() => setGameSpeed(gameSpeed === 1 ? 2 : 1)}
          style={{
            ...buttonBase,
            minHeight: '48px',
            padding: '8px 12px',
            background: gameSpeed === 2
              ? 'linear-gradient(135deg, #42a5f5, #1565c0)'
              : 'rgba(0,0,0,0.6)',
            color: '#fff',
            border: '2px solid rgba(255,255,255,0.4)',
            fontSize: 'clamp(14px, 2.5vw, 18px)',
          }}
        >
          {gameSpeed}x
        </button>

        {/* Pause button */}
        <button
          onClick={pauseGame}
          style={{
            ...buttonBase,
            minHeight: '48px',
            padding: '8px 16px',
            background: 'rgba(0,0,0,0.6)',
            color: '#fff',
            border: '2px solid rgba(255,255,255,0.4)',
            fontSize: 'clamp(14px, 2.5vw, 18px)',
          }}
        >
          ⏸
        </button>
      </div>
    </div>
  )
}

export default HUD
