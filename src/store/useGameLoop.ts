import { useEffect, useRef } from 'react'
import { useGameStore } from './gameStore'
import { GamePhase } from '../game/types'

export function useGameLoop(): void {
  const gamePhase = useGameStore((s) => s.gamePhase)
  const tick = useGameStore((s) => s.tick)
  const gameSpeed = useGameStore((s) => s.gameSpeed)
  const showCountdown = useGameStore((s) => s.showCountdown)
  const rafId = useRef<number>(0)
  const prevTime = useRef<number>(0)
  const gameSpeedRef = useRef<number>(gameSpeed)
  gameSpeedRef.current = gameSpeed

  useEffect(() => {
    if (gamePhase !== GamePhase.playing) return
    if (showCountdown) return

    const loop = (time: number) => {
      if (prevTime.current === 0) {
        prevTime.current = time
      }
      const delta = time - prevTime.current
      prevTime.current = time

      if (delta > 0 && delta < 200) {
        tick(delta * gameSpeedRef.current)
      }

      rafId.current = requestAnimationFrame(loop)
    }

    rafId.current = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(rafId.current)
      prevTime.current = 0
    }
  }, [gamePhase, tick, showCountdown])
}
