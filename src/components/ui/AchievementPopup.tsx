import { useEffect, useRef } from 'react'
import { useGameStore } from '../../store/gameStore'
import { ACHIEVEMENTS } from '../../game/achievements'
import type { AchievementId } from '../../game/achievements'

const DISMISS_DELAY = 4000

function AchievementPopup() {
  const recentAchievements = useGameStore((s) => s.recentAchievements)
  const dismissAchievement = useGameStore((s) => s.dismissAchievement)
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())

  useEffect(() => {
    for (const id of recentAchievements) {
      if (!timersRef.current.has(id)) {
        const timer = setTimeout(() => {
          dismissAchievement(id as AchievementId)
          timersRef.current.delete(id)
        }, DISMISS_DELAY)
        timersRef.current.set(id, timer)
      }
    }

    return () => {
      // Cleanup on unmount only
    }
  }, [recentAchievements, dismissAchievement])

  if (recentAchievements.length === 0) return null

  return (
    <div
      style={{
        position: 'fixed',
        top: '16px',
        right: '16px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        pointerEvents: 'none',
      }}
    >
      {recentAchievements.map((id) => {
        const def = ACHIEVEMENTS.find((a) => a.id === id)
        if (!def) return null
        return (
          <div
            key={id}
            style={{
              background: 'rgba(20, 20, 20, 0.92)',
              border: '2px solid #ffd700',
              borderRadius: '12px',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              minWidth: '260px',
              animation: 'achievementSlideIn 0.4s ease-out',
              pointerEvents: 'auto',
            }}
          >
            <span style={{ fontSize: '32px' }}>{def.icon}</span>
            <div>
              <div
                style={{
                  color: '#ffd700',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  fontFamily: 'sans-serif',
                }}
              >
                {def.name}
              </div>
              <div
                style={{
                  color: 'rgba(255,255,255,0.8)',
                  fontSize: '12px',
                  fontFamily: 'sans-serif',
                }}
              >
                {def.description}
              </div>
            </div>
          </div>
        )
      })}
      <style>{`
        @keyframes achievementSlideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}

export default AchievementPopup
