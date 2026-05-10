import { useEffect } from 'react'
import { useGameStore } from '../store/gameStore'
import { GamePhase } from '../game/types'
import { PLANT_CONFIGS } from '../game/configs'

export function useKeyboardShortcuts() {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const state = useGameStore.getState()
      const { gamePhase } = state

      // Only active during playing or paused
      if (gamePhase !== GamePhase.playing && gamePhase !== GamePhase.paused) return

      const key = e.key

      // P key: toggle pause
      if (key === 'p' || key === 'P') {
        e.preventDefault()
        if (gamePhase === GamePhase.playing) {
          state.pauseGame()
        } else if (gamePhase === GamePhase.paused) {
          state.resumeGame()
        }
        return
      }

      // Escape: resume if paused, deselect plant, or turn off shovel
      if (key === 'Escape') {
        if (gamePhase === GamePhase.paused) {
          state.resumeGame()
        } else if (state.shovelMode) {
          state.toggleShovel()
        } else if (state.selectedPlant !== null) {
          state.selectPlant(null)
        }
        return
      }

      // S key: toggle shovel
      if (key === 's' || key === 'S') {
        if (gamePhase === GamePhase.playing) {
          state.toggleShovel()
        }
        return
      }

      // Number keys 1-9, 0: select plant
      if (gamePhase === GamePhase.playing) {
        let plantIndex = -1
        if (key >= '1' && key <= '9') {
          plantIndex = parseInt(key) - 1
        } else if (key === '0') {
          plantIndex = 9
        }

        if (plantIndex >= 0 && plantIndex < state.unlockedPlants.length) {
          const plantType = state.unlockedPlants[plantIndex]
          if (plantType !== undefined) {
            const config = PLANT_CONFIGS[plantType]
            const cooldown = state.plantCooldowns[plantType]
            const isOnCooldown = cooldown !== undefined && cooldown > 0
            const canAfford = state.sun >= config.cost

            if (canAfford && !isOnCooldown) {
              state.selectPlant(
                state.selectedPlant === plantType ? null : plantType
              )
            }
          }
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])
}
