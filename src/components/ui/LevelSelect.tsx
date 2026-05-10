import { useGameStore } from '../../store/gameStore'

function LevelSelect() {
  const unlockedLevels = useGameStore((s) => s.unlockedLevels)
  const startLevel = useGameStore((s) => s.startLevel)
  const goToMenu = useGameStore((s) => s.goToMenu)

  const levels = Array.from({ length: 10 }, (_, i) => i + 1)

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
        background: 'linear-gradient(180deg, #42a5f5 0%, #1565c0 100%)',
        fontFamily: 'sans-serif',
      }}
    >
      <h2
        style={{
          color: '#fff',
          fontSize: '36px',
          fontWeight: 'bold',
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
          marginBottom: '32px',
        }}
      >
        Select Level
      </h2>

      {/* Level grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '16px',
          marginBottom: '32px',
        }}
      >
        {levels.map((level) => {
          const isUnlocked = level <= unlockedLevels
          return (
            <button
              key={level}
              onClick={() => isUnlocked && startLevel(level)}
              disabled={!isUnlocked}
              style={{
                width: '70px',
                height: '70px',
                borderRadius: '16px',
                border: 'none',
                fontSize: '24px',
                fontWeight: 'bold',
                cursor: isUnlocked ? 'pointer' : 'not-allowed',
                background: isUnlocked ? '#fff' : 'rgba(255,255,255,0.2)',
                color: isUnlocked ? '#1565c0' : 'rgba(255,255,255,0.5)',
                boxShadow: isUnlocked ? '0 4px 8px rgba(0,0,0,0.2)' : 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
              }}
            >
              {isUnlocked ? (
                level
              ) : (
                <span
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    fontSize: '14px',
                  }}
                >
                  {/* CSS padlock icon */}
                  <span
                    style={{
                      display: 'inline-block',
                      width: '16px',
                      height: '12px',
                      border: '3px solid rgba(255,255,255,0.5)',
                      borderRadius: '3px',
                      position: 'relative',
                      marginTop: '8px',
                    }}
                  >
                    <span
                      style={{
                        position: 'absolute',
                        top: '-10px',
                        left: '2px',
                        width: '8px',
                        height: '10px',
                        border: '3px solid rgba(255,255,255,0.5)',
                        borderBottom: 'none',
                        borderRadius: '8px 8px 0 0',
                      }}
                    />
                  </span>
                  <span style={{ marginTop: '4px' }}>{level}</span>
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Back button */}
      <button
        onClick={goToMenu}
        style={{
          padding: '16px 40px',
          fontSize: '20px',
          fontWeight: 'bold',
          color: '#1565c0',
          background: '#fff',
          border: 'none',
          borderRadius: '12px',
          cursor: 'pointer',
          boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
          minHeight: '60px',
        }}
      >
        Back
      </button>
    </div>
  )
}

export default LevelSelect
