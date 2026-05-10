import { useEffect, useRef } from 'react'
import { useGameStore } from './gameStore'
import { GamePhase } from '../game/types'

export function useGameLoop(): void {
  const gamePhase = useGameStore((s) => s.gamePhase)
  const tick = useGameStore((s) => s.tick)
  const rafId = useRef<number>(0)
  const prevTime = useRef<number>(0)

  useEffect(() => {
    if (gamePhase !== GamePhase.playing) return

    const loop = (time: number) => {
      if (prevTime.current === 0) {
        prevTime.current = time
      }
      const delta = time - prevTime.current
      prevTime.current = time

      if (delta > 0 && delta < 200) {
        tick(delta)
      }

      rafId.current = requestAnimationFrame(loop)
    }

    rafId.current = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(rafId.current)
      prevTime.current = 0
    }
  }, [gamePhase, tick])
}
