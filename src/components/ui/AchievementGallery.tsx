import { useGameStore } from '../../store/gameStore'
import { ACHIEVEMENTS, AchievementId } from '../../game/achievements'
import { overlayBase, buttonBase } from './styles'

function AchievementGallery() {
  const goToMenu = useGameStore((s) => s.goToMenu)
  const stats = useGameStore((s) => s.achievementStats)

  function getProgress(id: AchievementId): string | null {
    switch (id) {
      case AchievementId.ZombieSlayer:
        return `${Math.min(stats.totalZombiesKilled, 50)}/50 zombies`
      case AchievementId.GreenThumb:
        return `${Math.min(stats.totalPlantsPlaced, 100)}/100 plants`
      default:
        return null
    }
  }

  return (
    <div
      style={{
        ...overlayBase,
        background: 'rgba(0, 0, 0, 0.85)',
        padding: '24px',
        overflowY: 'auto',
      }}
    >
      <h1
        style={{
          color: '#ffd700',
          fontSize: '32px',
          fontWeight: 'bold',
          marginBottom: '24px',
          fontFamily: 'sans-serif',
        }}
      >
        Achievements
      </h1>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '16px',
          maxWidth: '800px',
          width: '100%',
          marginBottom: '24px',
        }}
      >
        {ACHIEVEMENTS.map((def) => {
          const earned = stats.earnedAchievements.includes(def.id)
          const progress = getProgress(def.id)
          return (
            <div
              key={def.id}
              style={{
                background: earned ? 'rgba(255, 215, 0, 0.15)' : 'rgba(100, 100, 100, 0.3)',
                border: earned ? '2px solid #ffd700' : '2px solid rgba(100,100,100,0.5)',
                borderRadius: '12px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                position: 'relative',
              }}
            >
              {earned && (
                <div
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    color: '#4caf50',
                    fontSize: '18px',
                  }}
                >
                  {'\u2714'}
                </div>
              )}
              <span style={{ fontSize: '36px', marginBottom: '8px', filter: earned ? 'none' : 'grayscale(1) opacity(0.5)' }}>
                {earned ? def.icon : '\u{1F512}'}
              </span>
              <div
                style={{
                  color: earned ? '#fff' : 'rgba(255,255,255,0.6)',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  fontFamily: 'sans-serif',
                  marginBottom: '4px',
                }}
              >
                {def.name}
              </div>
              {earned && (
                <div
                  style={{
                    color: 'rgba(255,255,255,0.7)',
                    fontSize: '12px',
                    fontFamily: 'sans-serif',
                  }}
                >
                  {def.description}
                </div>
              )}
              {!earned && progress && (
                <div
                  style={{
                    color: 'rgba(255,255,255,0.5)',
                    fontSize: '11px',
                    fontFamily: 'sans-serif',
                    marginTop: '4px',
                  }}
                >
                  {progress}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <button
        onClick={goToMenu}
        style={{
          ...buttonBase,
          background: '#fff',
          color: '#333',
        }}
      >
        Back
      </button>
    </div>
  )
}

export default AchievementGallery
