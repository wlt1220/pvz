import { ROWS, COLS, CELL_SIZE, GAP } from '../store/gameStore'

/** Convert grid (row, col) to world position with y offset for plants */
export function gridToWorld(row: number, col: number): [number, number, number] {
  const x = (col - COLS / 2 + 0.5) * (CELL_SIZE + GAP)
  const z = (row - ROWS / 2 + 0.5) * (CELL_SIZE + GAP)
  return [x, 0.5, z]
}

/** Convert row index to world z position */
export function rowToZ(row: number): number {
  return (row - ROWS / 2 + 0.5) * (CELL_SIZE + GAP)
}
