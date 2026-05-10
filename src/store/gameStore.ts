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

interface GameState {
  gridConfig: GridConfig
  plants: Plant[]
  zombies: Zombie[]
}

export const useGameStore = create<GameState>()(() => ({
  gridConfig: {
    rows: ROWS,
    cols: COLS,
    cellSize: CELL_SIZE,
    gap: GAP,
  },
  plants: [],
  zombies: [],
}))
