import { useGameStore } from '../../store/gameStore'

function StartScreen() {
  const goToLevelSelect = useGameStore((s) => s.goToLevelSelect)

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
        background: 'linear-gradient(180deg, #66bb6a 0%, #2e7d32 100%)',
        fontFamily: 'sans-serif',
      }}
    >
      {/* Decorative circles */}
      <div
        style={{
          position: 'absolute',
          top: '10%',
          left: '10%',
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.1)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '15%',
          right: '15%',
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.08)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '20%',
          right: '20%',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.06)',
        }}
      />

      {/* Title */}
      <h1
        style={{
          color: '#fff',
          fontSize: '48px',
          fontWeight: 'bold',
          textShadow: '3px 3px 6px rgba(0,0,0,0.4)',
          marginBottom: '16px',
          textAlign: 'center',
        }}
      >
        Plants vs Zombies 3D
      </h1>
      <p
        style={{
          color: 'rgba(255,255,255,0.8)',
          fontSize: '18px',
          marginBottom: '48px',
        }}
      >
        Defend your garden!
      </p>

      {/* Play button */}
      <button
        onClick={goToLevelSelect}
        style={{
          padding: '20px 60px',
          fontSize: '28px',
          fontWeight: 'bold',
          color: '#2e7d32',
          background: '#fff',
          border: 'none',
          borderRadius: '16px',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          minHeight: '60px',
        }}
      >
        Play
      </button>
    </div>
  )
}

export default StartScreen
