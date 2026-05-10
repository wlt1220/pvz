import { create } from 'zustand'

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

interface Plant {
  id: string
  type: 'sunflower' | 'peashooter' | 'wallnut'
  position: [number, number, number]
}

interface Zombie {
  id: string
  type: string
  position: [number, number, number]
  speed: number
}

interface ZombiePosition {
  id: string
  x: number
  z: number
}

interface GameState {
  gridConfig: GridConfig
  plants: Plant[]
  zombies: Zombie[]
  zombiePositions: ZombiePosition[]
  registerZombie: (id: string, x: number, z: number) => void
  unregisterZombie: (id: string) => void
  updateZombiePosition: (id: string, x: number, z: number) => void
}

export const useGameStore = create<GameState>()((set) => ({
  gridConfig: {
    rows: ROWS,
    cols: COLS,
    cellSize: CELL_SIZE,
    gap: GAP,
  },
  plants: [],
  zombies: [],
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
}))
