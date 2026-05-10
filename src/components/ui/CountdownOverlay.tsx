import { useEffect, useState } from 'react'
import { useGameStore } from '../../store/gameStore'
import { overlayBase } from './styles'

const WORDS = ['Ready...', 'Set...', 'Plant!']
const WORD_DURATION = 1000 // 1 second per word

function CountdownOverlay() {
  const dismissCountdown = useGameStore((s) => s.dismissCountdown)
  const [wordIndex, setWordIndex] = useState(0)

  useEffect(() => {
    if (wordIndex >= WORDS.length) {
      dismissCountdown()
      return
    }
    const timer = setTimeout(() => {
      setWordIndex((prev) => prev + 1)
    }, WORD_DURATION)
    return () => clearTimeout(timer)
  }, [wordIndex, dismissCountdown])

  const word = WORDS[wordIndex]
  if (!word) return null

  return (
    <div
      style={{
        ...overlayBase,
        background: 'rgba(0,0,0,0.6)',
        zIndex: 100,
      }}
    >
      <span
        style={{
          color: '#fff',
          fontSize: 'clamp(48px, 10vw, 80px)',
          fontWeight: 'bold',
          textShadow: '0 0 20px rgba(255,255,255,0.5), 2px 2px 4px rgba(0,0,0,0.8)',
          animation: 'none',
        }}
      >
        {word}
      </span>
    </div>
  )
}

export default CountdownOverlay
