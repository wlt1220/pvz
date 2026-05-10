import { useState, useEffect, useRef } from 'react'

const FPS_UPDATE_INTERVAL = 500 // Update display every 500ms instead of every frame

function FPSCounter() {
  const [visible, setVisible] = useState(false)
  const [fps, setFps] = useState(0)
  const frameTimes = useRef<number[]>([])
  const animFrameRef = useRef<number | null>(null)
  const lastTimeRef = useRef<number>(performance.now())
  const lastUpdateRef = useRef<number>(performance.now())

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'f' || e.key === 'F') {
        // Don't trigger if typing in an input field
        if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
        setVisible((v) => !v)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    if (!visible) {
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current)
        animFrameRef.current = null
      }
      return
    }

    const loop = () => {
      const now = performance.now()
      const delta = now - lastTimeRef.current
      lastTimeRef.current = now

      frameTimes.current.push(delta)
      if (frameTimes.current.length > 30) {
        frameTimes.current.shift()
      }

      // Only update React state at throttled interval
      if (now - lastUpdateRef.current >= FPS_UPDATE_INTERVAL) {
        lastUpdateRef.current = now
        if (frameTimes.current.length > 0) {
          const avg = frameTimes.current.reduce((a, b) => a + b, 0) / frameTimes.current.length
          setFps(Math.round(1000 / avg))
        }
      }

      animFrameRef.current = requestAnimationFrame(loop)
    }

    lastTimeRef.current = performance.now()
    lastUpdateRef.current = performance.now()
    frameTimes.current = []
    animFrameRef.current = requestAnimationFrame(loop)

    return () => {
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current)
      }
    }
  }, [visible])

  if (!visible) return null

  return (
    <div
      style={{
        position: 'absolute',
        bottom: '10px',
        left: '10px',
        padding: '4px 8px',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        color: '#00ff00',
        fontFamily: 'monospace',
        fontSize: '12px',
        borderRadius: '4px',
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    >
      {fps} FPS
    </div>
  )
}

export default FPSCounter
