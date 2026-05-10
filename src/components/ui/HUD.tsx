import { useGameStore } from '../../store/gameStore'

function HUD() {
  const sun = useGameStore((s) => s.sun)
  const currentWave = useGameStore((s) => s.currentWave)
  const pauseGame = useGameStore((s) => s.pauseGame)

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
        padding: '16px',
        fontFamily: 'sans-serif',
      }}
    >
      {/* Sun counter */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(0,0,0,0.5)',
          borderRadius: '12px',
          padding: '8px 16px',
        }}
      >
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, #ffeb3b, #ff9800)',
            boxShadow: '0 0 8px #ffeb3b',
          }}
        />
        <span
          style={{
            color: '#fff',
            fontSize: '24px',
            fontWeight: 'bold',
            textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
          }}
        >
          {sun}
        </span>
      </div>

      {/* Wave display */}
      <div
        style={{
          background: 'rgba(0,0,0,0.5)',
          borderRadius: '12px',
          padding: '8px 16px',
          color: '#fff',
          fontSize: '18px',
          fontWeight: 'bold',
          textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
        }}
      >
        Wave {currentWave}
      </div>

      {/* Pause button */}
      <button
        onClick={pauseGame}
        style={{
          pointerEvents: 'auto',
          background: 'rgba(0,0,0,0.6)',
          border: '2px solid #fff',
          borderRadius: '12px',
          padding: '8px 16px',
          color: '#fff',
          fontSize: '18px',
          fontWeight: 'bold',
          cursor: 'pointer',
        }}
      >
        Pause
      </button>
    </div>
  )
}

export default HUD
