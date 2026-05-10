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
  type: string
  row: number
  col: number
}

interface Zombie {
  id: string
  type: string
  row: number
  x: number
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
