import { useState, useEffect, useRef } from 'react'
import { useGameStore } from '../../store/gameStore'

function WaveAnnouncement() {
  const currentWave = useGameStore((s) => s.currentWave)
  const totalWaves = useGameStore((s) => s.totalWaves)
  const [visible, setVisible] = useState(false)
  const [opacity, setOpacity] = useState(0)
  const [text, setText] = useState('')
  const [isFinal, setIsFinal] = useState(false)
  const prevWaveRef = useRef(currentWave)
  const animFrameRef = useRef<number | null>(null)

  useEffect(() => {
    if (currentWave > prevWaveRef.current && currentWave > 0) {
      const final = currentWave === totalWaves
      setIsFinal(final)
      setText(final ? 'A HUGE wave of zombies is approaching!' : `Wave ${currentWave} incoming!`)
      setVisible(true)

      const startTime = Date.now()

      const animate = () => {
        const elapsed = Date.now() - startTime
        if (elapsed < 500) {
          setOpacity(elapsed / 500)
        } else if (elapsed < 1500) {
          setOpacity(1)
        } else if (elapsed < 2000) {
          setOpacity(1 - (elapsed - 1500) / 500)
        } else {
          setVisible(false)
          setOpacity(0)
          return
        }
        animFrameRef.current = requestAnimationFrame(animate)
      }

      animFrameRef.current = requestAnimationFrame(animate)

      return () => {
        if (animFrameRef.current !== null) {
          cancelAnimationFrame(animFrameRef.current)
        }
      }
    }
    prevWaveRef.current = currentWave
  }, [currentWave, totalWaves])

  if (!visible) return null

  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        opacity,
        fontSize: '2.5rem',
        fontWeight: 'bold',
        color: isFinal ? '#ff3333' : '#ffffff',
        textShadow: '2px 2px 8px rgba(0,0,0,0.8)',
        pointerEvents: 'none',
        zIndex: 1000,
        textAlign: 'center',
        whiteSpace: 'nowrap',
      }}
    >
      {text}
    </div>
  )
}

export default WaveAnnouncement
