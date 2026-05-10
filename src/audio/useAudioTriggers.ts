import { useEffect, useRef } from 'react'
import { useGameStore } from '../store/gameStore'
import { audioManager } from './AudioManager'
import { backgroundMusic } from './BackgroundMusic'
import { GamePhase } from '../game/types'

/**
 * Custom hook that subscribes to store changes and fires audio triggers.
 * Handles: zombie deaths, projectile creation, phase changes, wave changes,
 * and background music lifecycle.
 */
export function useAudioTriggers(): void {
  const prevZombieCount = useRef<number>(0)
  const prevProjectileCount = useRef<number>(0)
  const prevWave = useRef<number>(0)
  const prevPhase = useRef<GamePhase>(GamePhase.menu)
  const musicStarted = useRef(false)

  const zombies = useGameStore((s) => s.zombies)
  const projectiles = useGameStore((s) => s.projectiles)
  const currentWave = useGameStore((s) => s.currentWave)
  const gamePhase = useGameStore((s) => s.gamePhase)

  // Handle user interaction to resume AudioContext
  useEffect(() => {
    const handleInteraction = () => {
      audioManager.resumeContext()
    }
    document.addEventListener('click', handleInteraction, { once: true })
    document.addEventListener('keydown', handleInteraction, { once: true })
    return () => {
      document.removeEventListener('click', handleInteraction)
      document.removeEventListener('keydown', handleInteraction)
    }
  }, [])

  // Track zombie deaths (zombie count decreasing)
  useEffect(() => {
    const currentCount = zombies.length
    if (prevZombieCount.current > currentCount && prevZombieCount.current > 0) {
      audioManager.play('zombieDeath')
    }
    prevZombieCount.current = currentCount
  }, [zombies])

  // Track projectile creation (projectile count increasing)
  useEffect(() => {
    const currentCount = projectiles.length
    if (currentCount > prevProjectileCount.current && prevProjectileCount.current >= 0) {
      audioManager.play('peaShoot')
    }
    prevProjectileCount.current = currentCount
  }, [projectiles])

  // Track wave changes
  useEffect(() => {
    if (currentWave > prevWave.current && prevWave.current > 0) {
      audioManager.play('waveStart')
    }
    prevWave.current = currentWave
  }, [currentWave])

  // Track game phase changes
  useEffect(() => {
    if (gamePhase === prevPhase.current) return

    if (gamePhase === GamePhase.won) {
      audioManager.play('victoryFanfare')
    } else if (gamePhase === GamePhase.lost) {
      audioManager.play('gameOverSting')
    }

    // Background music lifecycle
    const ctx = audioManager.getContext()
    const master = audioManager.getMasterGain()
    if (gamePhase === GamePhase.playing && ctx && master) {
      if (!musicStarted.current) {
        backgroundMusic.start(ctx, master)
        musicStarted.current = true
      }
    } else if (
      gamePhase === GamePhase.paused ||
      gamePhase === GamePhase.menu ||
      gamePhase === GamePhase.levelSelect ||
      gamePhase === GamePhase.won ||
      gamePhase === GamePhase.lost
    ) {
      backgroundMusic.stop()
      musicStarted.current = false
    }

    prevPhase.current = gamePhase
  }, [gamePhase])
}
