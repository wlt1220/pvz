import { describe, test, expect, beforeEach } from 'vitest'
import { useGameStore } from '../store/gameStore'
import { PlantType, GamePhase } from '../game/types'

describe('Game Store', () => {
  beforeEach(() => {
    localStorage.clear()
    // Reset store to initial state
    useGameStore.setState({
      sun: 0,
      selectedPlant: null,
      gamePhase: GamePhase.menu,
      plants: [],
      zombies: [],
      projectiles: [],
      suns: [],
      currentWave: 0,
      currentLevel: 1,
      unlockedLevels: 1,
      engine: null,
      zombiePositions: [],
      completedLevels: {},
      unlockedPlants: [PlantType.sunflower, PlantType.peashooter],
      gameSpeed: 1,
      zombiesKilledThisLevel: 0,
      sunCollectedThisLevel: 0,
    })
  })

  test('initial state after startLevel has 50 sun', () => {
    const { startLevel } = useGameStore.getState()
    startLevel(1)
    const state = useGameStore.getState()
    expect(state.sun).toBe(50)
  })

  test('selectPlant sets selectedPlant', () => {
    const { selectPlant } = useGameStore.getState()
    selectPlant(PlantType.peashooter)
    expect(useGameStore.getState().selectedPlant).toBe(PlantType.peashooter)
  })

  test('selectPlant(null) clears selectedPlant', () => {
    const { selectPlant } = useGameStore.getState()
    selectPlant(PlantType.peashooter)
    selectPlant(null)
    expect(useGameStore.getState().selectedPlant).toBeNull()
  })

  test('plantSelected deducts sun and adds plant to state', () => {
    const { startLevel } = useGameStore.getState()
    startLevel(1)

    const { selectPlant } = useGameStore.getState()
    selectPlant(PlantType.sunflower) // costs 50

    const { plantSelected } = useGameStore.getState()
    plantSelected(0, 0)

    const state = useGameStore.getState()
    expect(state.sun).toBe(0) // 50 - 50
    expect(state.plants.length).toBe(1)
    expect(state.plants[0]?.type).toBe(PlantType.sunflower)
    expect(state.plants[0]?.row).toBe(0)
    expect(state.plants[0]?.col).toBe(0)
    expect(state.selectedPlant).toBeNull()
  })

  test('plantSelected with no selectedPlant does nothing', () => {
    const { startLevel } = useGameStore.getState()
    startLevel(1)

    const { plantSelected } = useGameStore.getState()
    plantSelected(0, 0)

    const state = useGameStore.getState()
    expect(state.sun).toBe(50)
    expect(state.plants.length).toBe(0)
  })

  test('plantSelected with insufficient sun does nothing', () => {
    const { startLevel } = useGameStore.getState()
    startLevel(1)

    const { selectPlant } = useGameStore.getState()
    selectPlant(PlantType.peashooter) // costs 100, only have 50

    const { plantSelected } = useGameStore.getState()
    plantSelected(0, 0)

    const state = useGameStore.getState()
    expect(state.sun).toBe(50)
    expect(state.plants.length).toBe(0)
    // selectedPlant should NOT be cleared since nothing happened
    expect(state.selectedPlant).toBe(PlantType.peashooter)
  })

  test('collectSun increases sun count', () => {
    const { startLevel } = useGameStore.getState()
    startLevel(1)

    // Tick enough to get a sky sun (10 seconds)
    const { tick } = useGameStore.getState()
    tick(10000)

    const stateAfterTick = useGameStore.getState()
    expect(stateAfterTick.suns.length).toBeGreaterThan(0)

    const sunId = stateAfterTick.suns[0]!.id
    const sunBefore = stateAfterTick.sun

    const { collectSun } = useGameStore.getState()
    collectSun(sunId)

    const stateAfterCollect = useGameStore.getState()
    expect(stateAfterCollect.sun).toBeGreaterThan(sunBefore)
  })

  test('startLevel initializes game engine and sets phase to playing', () => {
    const { startLevel } = useGameStore.getState()
    startLevel(1)

    const state = useGameStore.getState()
    expect(state.gamePhase).toBe(GamePhase.playing)
    expect(state.engine).not.toBeNull()
    expect(state.currentLevel).toBe(1)
    expect(state.sun).toBe(50)
  })

  test('pauseGame and resumeGame toggle phase', () => {
    const { startLevel } = useGameStore.getState()
    startLevel(1)

    const { pauseGame } = useGameStore.getState()
    pauseGame()
    expect(useGameStore.getState().gamePhase).toBe(GamePhase.paused)

    const { resumeGame } = useGameStore.getState()
    resumeGame()
    expect(useGameStore.getState().gamePhase).toBe(GamePhase.playing)
  })

  test('tick advances game state - zombies move', () => {
    const { startLevel } = useGameStore.getState()
    startLevel(1) // Level 1 has zombies with delay 0

    const { tick } = useGameStore.getState()
    // Small tick to let wave manager spawn zombies
    tick(100)

    const state = useGameStore.getState()
    // Level 1 wave 1 spawns 1 zombie at delay 0
    expect(state.zombies.length).toBeGreaterThan(0)

    // Record position and tick more to confirm movement
    const initialX = state.zombies[0]!.x
    tick(1000)

    const stateAfter = useGameStore.getState()
    expect(stateAfter.zombies[0]!.x).toBeLessThan(initialX)
  })

  test('goToMenu sets phase to menu', () => {
    const { startLevel } = useGameStore.getState()
    startLevel(1)

    const { goToMenu } = useGameStore.getState()
    goToMenu()

    expect(useGameStore.getState().gamePhase).toBe(GamePhase.menu)
    expect(useGameStore.getState().engine).toBeNull()
  })

  test('goToLevelSelect sets phase to levelSelect', () => {
    const { startLevel } = useGameStore.getState()
    startLevel(1)

    const { goToLevelSelect } = useGameStore.getState()
    goToLevelSelect()

    expect(useGameStore.getState().gamePhase).toBe(GamePhase.levelSelect)
    expect(useGameStore.getState().engine).toBeNull()
  })

  test('legacy zombie position tracking still works', () => {
    const { registerZombie, updateZombiePosition, unregisterZombie } = useGameStore.getState()

    registerZombie('z1', 5, 3)
    expect(useGameStore.getState().zombiePositions).toHaveLength(1)
    expect(useGameStore.getState().zombiePositions[0]).toEqual({ id: 'z1', x: 5, z: 3 })

    updateZombiePosition('z1', 4, 3)
    expect(useGameStore.getState().zombiePositions[0]).toEqual({ id: 'z1', x: 4, z: 3 })

    unregisterZombie('z1')
    expect(useGameStore.getState().zombiePositions).toHaveLength(0)
  })

  test('removePlant action removes a plant from the grid', () => {
    const { startLevel } = useGameStore.getState()
    startLevel(1)

    // Plant a sunflower (cost 50, starting sun is 50)
    const { selectPlant } = useGameStore.getState()
    selectPlant(PlantType.sunflower)
    const { plantSelected } = useGameStore.getState()
    plantSelected(0, 0)

    expect(useGameStore.getState().plants.length).toBe(1)

    const { removePlant } = useGameStore.getState()
    removePlant(0, 0)

    expect(useGameStore.getState().plants.length).toBe(0)
  })

  test('removePlant does nothing for empty cell', () => {
    const { startLevel } = useGameStore.getState()
    startLevel(1)

    const { removePlant } = useGameStore.getState()
    removePlant(0, 0)

    expect(useGameStore.getState().plants.length).toBe(0)
  })

  test('gameSpeed state changes', () => {
    expect(useGameStore.getState().gameSpeed).toBe(1)

    const { setGameSpeed } = useGameStore.getState()
    setGameSpeed(2)
    expect(useGameStore.getState().gameSpeed).toBe(2)

    setGameSpeed(1)
    expect(useGameStore.getState().gameSpeed).toBe(1)
  })

  test('zombiesKilled and sunCollected stats are tracked', () => {
    const { startLevel } = useGameStore.getState()
    startLevel(1) // Level 1 has zombies with delay 0

    expect(useGameStore.getState().zombiesKilledThisLevel).toBe(0)
    expect(useGameStore.getState().sunCollectedThisLevel).toBe(0)

    // Collect a sun
    const { tick } = useGameStore.getState()
    tick(10000) // trigger sky sun

    const stateAfterTick = useGameStore.getState()
    if (stateAfterTick.suns.length > 0) {
      const sunId = stateAfterTick.suns.find(s => !s.collected)?.id
      if (sunId) {
        const { collectSun } = useGameStore.getState()
        collectSun(sunId)
        expect(useGameStore.getState().sunCollectedThisLevel).toBeGreaterThan(0)
      }
    }
  })

  test('completing a level saves progress to localStorage', () => {
    const { startLevel } = useGameStore.getState()
    startLevel(1)

    // Level 1 has:
    // Wave 1: regular zombie in lane 2
    // Wave 2: regular zombies in lanes 1 and 3
    const engine = useGameStore.getState().engine!
    engine.setSun(1000)

    // Plant peashooters covering all lanes used by level 1
    engine.plantAt(1, 0, PlantType.peashooter)
    engine.plantAt(1, 1, PlantType.peashooter)
    engine.plantAt(2, 0, PlantType.peashooter)
    engine.plantAt(2, 1, PlantType.peashooter)
    engine.plantAt(3, 0, PlantType.peashooter)
    engine.plantAt(3, 1, PlantType.peashooter)

    // Tick until the level is won
    for (let i = 0; i < 700; i++) {
      const { tick } = useGameStore.getState()
      tick(100)
      if (useGameStore.getState().gamePhase === GamePhase.won) break
    }

    expect(useGameStore.getState().gamePhase).toBe(GamePhase.won)
    expect(useGameStore.getState().completedLevels[1]).toBeDefined()
    expect(useGameStore.getState().completedLevels[1]!.stars).toBeGreaterThanOrEqual(1)

    // Check localStorage was updated
    const raw = localStorage.getItem('pvz-progress')
    expect(raw).not.toBeNull()
    const saved = JSON.parse(raw!)
    expect(saved.unlockedLevels).toBe(2)
  })

  test('startLevel sets unlockedPlants for the level', () => {
    const { startLevel } = useGameStore.getState()
    startLevel(1)
    const state = useGameStore.getState()
    expect(state.unlockedPlants).toContain(PlantType.sunflower)
    expect(state.unlockedPlants).toContain(PlantType.peashooter)
    expect(state.unlockedPlants.length).toBe(2)
  })
})
