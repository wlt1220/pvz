import { create } from 'zustand'
import { GameEngine } from '../game/GameEngine'
import { LEVELS } from '../game/levels'
import type { PlantEntity, ZombieEntity, ProjectileEntity, SunEntity } from '../game/types'
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
}

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
  unlockedLevels: 1,

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
    set({ sun: state.sun, suns: state.suns })
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
    const { engine } = get()
    if (!engine) return

    engine.tick(deltaMs)
    const state = engine.getState()
    set({
      sun: state.sun,
      plants: state.plants,
      zombies: state.zombies,
      projectiles: state.projectiles,
      suns: state.suns,
      currentWave: state.currentWave,
      gamePhase: state.phase,
    })
  },

  goToMenu: () => set({ engine: null, gamePhase: GamePhase.menu }),

  goToLevelSelect: () => set({ engine: null, gamePhase: GamePhase.levelSelect }),
}))
