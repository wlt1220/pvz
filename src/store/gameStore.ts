import { create } from 'zustand'
import { GameEngine } from '../game/GameEngine'
import { LEVELS } from '../game/levels'
import { loadProgress, saveProgress, getUnlockedPlants } from '../game/progression'
import type { PlantEntity, ZombieEntity, ProjectileEntity, SunEntity, LevelCompletionData } from '../game/types'
import { PlantType, GamePhase } from '../game/types'

export const ROWS = 5
export const COLS = 9
export const CELL_SIZE = 1
export const GAP = 0.05

interface GridConfig {
  rows: number
  cols: number
  cellSize: number
  gap: number
}

interface ZombiePosition {
  id: string
  x: number
  z: number
}

interface GameStoreState {
  // Grid config (backward compat)
  gridConfig: GridConfig

  // Legacy zombie position tracking (backward compat for existing components)
  zombiePositions: ZombiePosition[]
  registerZombie: (id: string, x: number, z: number) => void
  unregisterZombie: (id: string) => void
  updateZombiePosition: (id: string, x: number, z: number) => void

  // Game state
  sun: number
  selectedPlant: PlantType | null
  gamePhase: GamePhase
  plants: PlantEntity[]
  zombies: ZombieEntity[]
  projectiles: ProjectileEntity[]
  suns: SunEntity[]
  currentWave: number
  currentLevel: number
  unlockedLevels: number

  // New progression state
  completedLevels: Record<number, LevelCompletionData>
  unlockedPlants: PlantType[]
  gameSpeed: number
  zombiesKilledThisLevel: number
  sunCollectedThisLevel: number

  // Engine reference (not exposed to components directly)
  engine: GameEngine | null

  // Actions
  selectPlant: (type: PlantType | null) => void
  plantSelected: (row: number, col: number) => void
  collectSun: (sunId: string) => void
  startLevel: (levelNum: number) => void
  pauseGame: () => void
  resumeGame: () => void
  tick: (deltaMs: number) => void
  goToMenu: () => void
  goToLevelSelect: () => void
  removePlant: (row: number, col: number) => void
  setGameSpeed: (speed: number) => void
}

function loadInitialProgress(): { unlockedLevels: number; completedLevels: Record<number, LevelCompletionData>; unlockedPlants: PlantType[] } {
  const saved = loadProgress()
  if (saved) {
    return {
      unlockedLevels: saved.unlockedLevels,
      completedLevels: saved.completedLevels,
      unlockedPlants: saved.unlockedPlants,
    }
  }
  return {
    unlockedLevels: 1,
    completedLevels: {},
    unlockedPlants: getUnlockedPlants(1),
  }
}

const initialProgress = loadInitialProgress()

export const useGameStore = create<GameStoreState>()((set, get) => ({
  // Grid config
  gridConfig: {
    rows: ROWS,
    cols: COLS,
    cellSize: CELL_SIZE,
    gap: GAP,
  },

  // Legacy zombie position tracking
  zombiePositions: [],
  registerZombie: (id: string, x: number, z: number) =>
    set((state) => ({
      zombiePositions: [...state.zombiePositions, { id, x, z }],
    })),
  unregisterZombie: (id: string) =>
    set((state) => ({
      zombiePositions: state.zombiePositions.filter((zp) => zp.id !== id),
    })),
  updateZombiePosition: (id: string, x: number, z: number) =>
    set((state) => ({
      zombiePositions: state.zombiePositions.map((zp) =>
        zp.id === id ? { ...zp, x, z } : zp
      ),
    })),

  // Game state
  sun: 0,
  selectedPlant: null,
  gamePhase: GamePhase.menu,
  plants: [],
  zombies: [],
  projectiles: [],
  suns: [],
  currentWave: 0,
  currentLevel: 1,
  unlockedLevels: initialProgress.unlockedLevels,

  // New progression state
  completedLevels: initialProgress.completedLevels,
  unlockedPlants: initialProgress.unlockedPlants,
  gameSpeed: 1,
  zombiesKilledThisLevel: 0,
  sunCollectedThisLevel: 0,

  // Engine
  engine: null,

  // Actions
  selectPlant: (type: PlantType | null) => set({ selectedPlant: type }),

  plantSelected: (row: number, col: number) => {
    const { engine, selectedPlant } = get()
    if (!engine || !selectedPlant) return

    const success = engine.plantAt(row, col, selectedPlant)
    if (success) {
      const state = engine.getState()
      set({
        sun: state.sun,
        plants: state.plants,
        selectedPlant: null,
      })
    }
  },

  collectSun: (sunId: string) => {
    const { engine } = get()
    if (!engine) return

    engine.collectSun(sunId)
    const state = engine.getState()
    set({ sun: state.sun, suns: state.suns, sunCollectedThisLevel: state.sunCollected })
  },

  startLevel: (levelNum: number) => {
    const levelIndex = levelNum - 1
    const levelConfig = LEVELS[levelIndex]
    if (!levelConfig) return

    const engine = new GameEngine(levelConfig)
    const state = engine.getState()

    set({
      engine,
      gamePhase: GamePhase.playing,
      sun: state.sun,
      plants: state.plants,
      zombies: state.zombies,
      projectiles: state.projectiles,
      suns: state.suns,
      currentWave: state.currentWave,
      currentLevel: levelNum,
      zombiesKilledThisLevel: 0,
      sunCollectedThisLevel: 0,
      unlockedPlants: getUnlockedPlants(levelNum),
    })
  },

  pauseGame: () => {
    const { engine } = get()
    if (!engine) return
    engine.pause()
    set({ gamePhase: GamePhase.paused })
  },

  resumeGame: () => {
    const { engine } = get()
    if (!engine) return
    engine.resume()
    set({ gamePhase: GamePhase.playing })
  },

  tick: (deltaMs: number) => {
    const { engine, currentLevel, unlockedLevels, completedLevels } = get()
    if (!engine) return

    engine.tick(deltaMs)
    const state = engine.getState()

    const updates: Partial<GameStoreState> = {
      sun: state.sun,
      plants: state.plants,
      zombies: state.zombies,
      projectiles: state.projectiles,
      suns: state.suns,
      currentWave: state.currentWave,
      gamePhase: state.phase,
      zombiesKilledThisLevel: state.zombiesKilled,
      sunCollectedThisLevel: state.sunCollected,
    }

    // Unlock next level on win
    if (state.phase === GamePhase.won) {
      const newUnlockedLevels = currentLevel >= unlockedLevels ? currentLevel + 1 : unlockedLevels
      const newUnlockedPlants = getUnlockedPlants(newUnlockedLevels)

      // Calculate stars: 1 for win, 2 if less than 3 plants lost, 3 if no plants lost
      let stars = 1
      if (state.plantsLost < 3) stars = 2
      if (state.plantsLost === 0) stars = 3

      const levelData: LevelCompletionData = {
        stars,
        zombiesKilled: state.zombiesKilled,
        sunCollected: state.sunCollected,
      }

      const newCompletedLevels = { ...completedLevels, [currentLevel]: levelData }

      updates.unlockedLevels = newUnlockedLevels
      updates.unlockedPlants = newUnlockedPlants
      updates.completedLevels = newCompletedLevels

      saveProgress({
        unlockedLevels: newUnlockedLevels,
        completedLevels: newCompletedLevels,
        unlockedPlants: newUnlockedPlants,
      })
    }

    set(updates)
  },

  goToMenu: () => set({ engine: null, gamePhase: GamePhase.menu }),

  goToLevelSelect: () => set({ engine: null, gamePhase: GamePhase.levelSelect }),

  removePlant: (row: number, col: number) => {
    const { engine } = get()
    if (!engine) return

    const state = engine.getState()
    const plant = state.plants.find(p => p.row === row && p.col === col)
    if (!plant) return

    // Access engine internals to remove the plant - use plantAt pattern
    // Since GameEngine doesn't expose removePlant, we need to work through the engine
    // We'll filter the plant out via the engine's state by modifying the store state
    // Actually, we need to add a method to GameEngine for this
    engine.removePlant(plant.id)
    const newState = engine.getState()
    set({ plants: newState.plants })
  },

  setGameSpeed: (speed: number) => {
    set({ gameSpeed: speed })
  },
}))
