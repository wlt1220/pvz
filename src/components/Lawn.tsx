import { RoundedBox } from '@react-three/drei'
import { ROWS, COLS, CELL_SIZE, GAP } from '../store/gameStore'

const LIGHT_GREEN = '#4a7c10'
const DARK_GREEN = '#3d6b0c'

// Seeded pseudo-random for consistent tile heights
function seededRandom(row: number, col: number): number {
  const seed = row * COLS + col
  const x = Math.sin(seed * 9301 + 49297) * 49297
  return x - Math.floor(x)
}

function Lawn() {
  const tiles: JSX.Element[] = []

  const totalWidth = COLS * CELL_SIZE + (COLS - 1) * GAP
  const totalDepth = ROWS * CELL_SIZE + (ROWS - 1) * GAP
  const offsetX = -totalWidth / 2 + CELL_SIZE / 2
  const offsetZ = -totalDepth / 2 + CELL_SIZE / 2

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const isLight = (row + col) % 2 === 0
      const color = isLight ? LIGHT_GREEN : DARK_GREEN
      const heightVariation = 0.02 + seededRandom(row, col) * 0.03
      const tileHeight = 0.2 + heightVariation

      const x = offsetX + col * (CELL_SIZE + GAP)
      const z = offsetZ + row * (CELL_SIZE + GAP)
      const y = tileHeight / 2

      tiles.push(
        <RoundedBox
          key={`${row}-${col}`}
          args={[CELL_SIZE, tileHeight, CELL_SIZE]}
          radius={0.05}
          smoothness={4}
          position={[x, y, z]}
          receiveShadow
        >
          <meshStandardMaterial color={color} />
        </RoundedBox>
      )
    }
  }

  return <group>{tiles}</group>
}

export default Lawn
