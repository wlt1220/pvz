import { create } from 'zustand'
import { GameEngine } from '../game/GameEngine'
import { LEVELS } from '../game/levels'
import { loadProgress, saveProgress, getUnlockedPlants, PLANT_RECHARGE } from '../game/progression'
import { AchievementTracker } from '../game/achievementTracker'
import type { AchievementStats, AchievementContext } from '../game/achievementTracker'
import { AchievementId } from '../game/achievements'
import type { PlantEntity, ZombieEntity, ProjectileEntity, SunEntity, LevelCompletionData } from '../game/types'
import { PlantType, GamePhase } from '../game/types'
import { audioManager } from '../audio/AudioManager'

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
  totalWaves: number
  currentLevel: number
  unlockedLevels: number

  // New progression state
  completedLevels: Record<number, LevelCompletionData>
  unlockedPlants: PlantType[]
  gameSpeed: number
  zombiesKilledThisLevel: number
  sunCollectedThisLevel: number

  // Cooldown and shovel
  plantCooldowns: Partial<Record<PlantType, number>>
  shovelMode: boolean

  // Countdown
  showCountdown: boolean

  // Tutorial
  showTutorial: boolean

  // Achievements
  showAchievements: boolean
  recentAchievements: AchievementId[]
  achievementStats: AchievementStats

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
  goToAchievements: () => void
  dismissAchievement: (id: AchievementId) => void
  removePlant: (row: number, col: number) => void
  setGameSpeed: (speed: number) => void
  toggleShovel: () => void
  dismissCountdown: () => void
  dismissTutorial: () => void
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

const achievementTracker = new AchievementTracker()

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
  totalWaves: 0,
  currentLevel: 1,
  unlockedLevels: initialProgress.unlockedLevels,

  // New progression state
  completedLevels: initialProgress.completedLevels,
  unlockedPlants: initialProgress.unlockedPlants,
  gameSpeed: 1,
  zombiesKilledThisLevel: 0,
  sunCollectedThisLevel: 0,

  // Cooldown and shovel
  plantCooldowns: {},
  shovelMode: false,

  // Countdown
  showCountdown: false,

  // Tutorial
  showTutorial: false,

  // Achievements
  showAchievements: false,
  recentAchievements: [],
  achievementStats: achievementTracker.getStats(),

  // Engine
  engine: null,

  // Actions
  selectPlant: (type: PlantType | null) => set({ selectedPlant: type }),

  plantSelected: (row: number, col: number) => {
    const { engine, selectedPlant, shovelMode } = get()
    if (!engine) return

    // If shovel mode is active, remove the plant instead
    if (shovelMode) {
      const { removePlant, toggleShovel } = get()
      removePlant(row, col)
      toggleShovel()
      return
    }

    if (!selectedPlant) return

    const success = engine.plantAt(row, col, selectedPlant)
    if (success) {
      audioManager.play('plantPlace')
      achievementTracker.incrementPlants(1)
      const state = engine.getState()
      const rechargeTime = PLANT_RECHARGE[selectedPlant]
      const newCooldowns = { ...get().plantCooldowns }
      if (rechargeTime > 0) {
        newCooldowns[selectedPlant] = rechargeTime
      }
      set({
        sun: state.sun,
        plants: state.plants,
        selectedPlant: null,
        plantCooldowns: newCooldowns,
        achievementStats: achievementTracker.getStats(),
      })
    }
  },

  collectSun: (sunId: string) => {
    const { engine } = get()
    if (!engine) return

    engine.collectSun(sunId)
    const state = engine.getState()
    audioManager.play('sunCollect')
    set({ sun: state.sun, suns: state.suns, sunCollectedThisLevel: state.sunCollected })
  },

  startLevel: (levelNum: number) => {
    const levelIndex = levelNum - 1
    const levelConfig = LEVELS[levelIndex]
    if (!levelConfig) return

    const engine = new GameEngine(levelConfig)
    const state = engine.getState()

    // Show tutorial for first-time players on level 1
    const tutorialSeen = localStorage.getItem('pvz-tutorial-seen') === 'true'
    const shouldShowTutorial = levelNum === 1 && !tutorialSeen

    set({
      engine,
      gamePhase: GamePhase.playing,
      sun: state.sun,
      plants: state.plants,
      zombies: state.zombies,
      projectiles: state.projectiles,
      suns: state.suns,
      currentWave: state.currentWave,
      totalWaves: state.totalWaves,
      currentLevel: levelNum,
      zombiesKilledThisLevel: 0,
      sunCollectedThisLevel: 0,
      unlockedPlants: getUnlockedPlants(levelNum),
      plantCooldowns: {},
      shovelMode: false,
      showCountdown: true,
      showTutorial: shouldShowTutorial,
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
    const { engine, currentLevel, unlockedLevels, completedLevels, plantCooldowns } = get()
    if (!engine) return

    engine.tick(deltaMs)
    const state = engine.getState()

    // Decrement plant cooldowns
    const newCooldowns = { ...plantCooldowns }
    let cooldownsChanged = false
    for (const key of Object.keys(newCooldowns) as PlantType[]) {
      const val = newCooldowns[key]
      if (val !== undefined && val > 0) {
        const newVal = val - deltaMs
        if (newVal <= 0) {
          delete newCooldowns[key]
        } else {
          newCooldowns[key] = newVal
        }
        cooldownsChanged = true
      }
    }

    const updates: Partial<GameStoreState> = {
      sun: state.sun,
      plants: state.plants,
      zombies: state.zombies,
      projectiles: state.projectiles,
      suns: state.suns,
      currentWave: state.currentWave,
      totalWaves: state.totalWaves,
      gamePhase: state.phase,
      zombiesKilledThisLevel: state.zombiesKilled,
      sunCollectedThisLevel: state.sunCollected,
    }

    if (cooldownsChanged) {
      updates.plantCooldowns = newCooldowns
    }

    // Unlock next level on win (only execute once per win)
    if (state.phase === GamePhase.won && !completedLevels[currentLevel]) {
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

      // Achievement tracking
      achievementTracker.incrementKills(state.zombiesKilled)
      const achievementContext: AchievementContext = {
        zombiesKilledThisLevel: state.zombiesKilled,
        sunCollectedThisLevel: state.sunCollected,
        plantsLostThisLevel: state.plantsLost,
        elapsedMs: state.elapsedMs,
        stars,
        currentLevel,
        completedLevels: newCompletedLevels,
        maxCherryBombKills: state.maxCherryBombKills,
      }
      const newAchievements = achievementTracker.checkOnLevelComplete(achievementContext)
      if (newAchievements.length > 0) {
        updates.recentAchievements = [...get().recentAchievements, ...newAchievements]
      }
      updates.achievementStats = achievementTracker.getStats()
    }

    set(updates)
  },

  goToMenu: () => set({ engine: null, gamePhase: GamePhase.menu, showAchievements: false }),

  goToLevelSelect: () => set({ engine: null, gamePhase: GamePhase.levelSelect }),

  goToAchievements: () => set({ showAchievements: true }),

  dismissAchievement: (id: AchievementId) => {
    set((state) => ({
      recentAchievements: state.recentAchievements.filter((a) => a !== id),
    }))
  },

  removePlant: (row: number, col: number) => {
    const { engine } = get()
    if (!engine) return

    const state = engine.getState()
    const plant = state.plants.find(p => p.row === row && p.col === col)
    if (!plant) return

    engine.removePlant(plant.id)
    const newState = engine.getState()
    set({ plants: newState.plants })
  },

  setGameSpeed: (speed: number) => {
    set({ gameSpeed: speed })
  },

  toggleShovel: () => {
    set((state) => ({ shovelMode: !state.shovelMode, selectedPlant: null }))
  },

  dismissCountdown: () => {
    set({ showCountdown: false })
  },

  dismissTutorial: () => {
    localStorage.setItem('pvz-tutorial-seen', 'true')
    set({ showTutorial: false })
  },
}))
