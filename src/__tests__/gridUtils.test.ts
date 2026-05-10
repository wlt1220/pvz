import { describe, test, expect } from 'vitest'
import { gridToWorld, rowToZ } from '../utils/gridUtils'

describe('gridToWorld', () => {
  test('center tile of a 5x9 grid maps near the origin', () => {
    const [x, y, z] = gridToWorld(2, 4)
    expect(y).toBe(0.5)
    // col 4 is exactly center for 9 cols: (4 - 4.5 + 0.5) * 1.05 = 0
    expect(x).toBe(0)
    // row 2 is exactly center for 5 rows: (2 - 2.5 + 0.5) * 1.05 = 0
    expect(z).toBe(0)
  })

  test('returns correct x for first column', () => {
    const [x] = gridToWorld(0, 0)
    // (0 - 4.5 + 0.5) * 1.05 = -4 * 1.05 = -4.2
    expect(x).toBeCloseTo(-4.2)
  })

  test('returns correct x for last column', () => {
    const [x] = gridToWorld(0, 8)
    // (8 - 4.5 + 0.5) * 1.05 = 4 * 1.05 = 4.2
    expect(x).toBeCloseTo(4.2)
  })

  test('returns correct z for first row', () => {
    const [, , z] = gridToWorld(0, 0)
    // (0 - 2.5 + 0.5) * 1.05 = -2 * 1.05 = -2.1
    expect(z).toBeCloseTo(-2.1)
  })

  test('returns correct z for last row', () => {
    const [, , z] = gridToWorld(4, 0)
    // (4 - 2.5 + 0.5) * 1.05 = 2 * 1.05 = 2.1
    expect(z).toBeCloseTo(2.1)
  })

  test('y is always 0.5', () => {
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 9; col++) {
        const [, y] = gridToWorld(row, col)
        expect(y).toBe(0.5)
      }
    }
  })
})

describe('rowToZ', () => {
  test('center row maps to z=0', () => {
    expect(rowToZ(2)).toBe(0)
  })

  test('first row maps to negative z', () => {
    expect(rowToZ(0)).toBeCloseTo(-2.1)
  })

  test('last row maps to positive z', () => {
    expect(rowToZ(4)).toBeCloseTo(2.1)
  })
})
