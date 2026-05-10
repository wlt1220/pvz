import { useState, useCallback } from 'react'
import { RoundedBox } from '@react-three/drei'
import { ROWS, COLS, CELL_SIZE, GAP, useGameStore } from '../store/gameStore'
import type { PlantType } from '../game/types'
import * as THREE from 'three'

const LIGHT_GREEN = '#4a7c10'
const DARK_GREEN = '#3d6b0c'
const HOVER_LIGHT_GREEN = '#5a9c14'
const HOVER_DARK_GREEN = '#4d8b10'

const PLANT_PREVIEW_COLORS: Record<PlantType, string> = {
  sunflower: '#fdd835',
  peashooter: '#4caf50',
  wallnut: '#8d6e63',
  snowpea: '#81d4fa',
  cherrybomb: '#e53935',
  potatomine: '#795548',
  repeater: '#2e7d32',
  chomper: '#9c27b0',
  tallnut: '#4e342e',
  torchwood: '#ff9800',
}

// Seeded pseudo-random for consistent tile heights
function seededRandom(row: number, col: number): number {
  const seed = row * COLS + col
  const x = Math.sin(seed * 9301 + 49297) * 49297
  return x - Math.floor(x)
}

function getTilePosition(row: number, col: number): [number, number, number] {
  const totalWidth = COLS * CELL_SIZE + (COLS - 1) * GAP
  const totalDepth = ROWS * CELL_SIZE + (ROWS - 1) * GAP
  const offsetX = -totalWidth / 2 + CELL_SIZE / 2
  const offsetZ = -totalDepth / 2 + CELL_SIZE / 2

  const x = offsetX + col * (CELL_SIZE + GAP)
  const z = offsetZ + row * (CELL_SIZE + GAP)
  const heightVariation = 0.02 + seededRandom(row, col) * 0.03
  const tileHeight = 0.2 + heightVariation
  const y = tileHeight / 2

  return [x, y, z]
}

function Tile({ row, col }: { row: number; col: number }) {
  const selectedPlant = useGameStore((s) => s.selectedPlant)
  const plantSelected = useGameStore((s) => s.plantSelected)
  const [hovered, setHovered] = useState(false)

  const isLight = (row + col) % 2 === 0
  const baseColor = isLight ? LIGHT_GREEN : DARK_GREEN
  const hoverColor = isLight ? HOVER_LIGHT_GREEN : HOVER_DARK_GREEN
  const color = hovered && selectedPlant ? hoverColor : baseColor

  const heightVariation = 0.02 + seededRandom(row, col) * 0.03
  const tileHeight = 0.2 + heightVariation

  const [x, y, z] = getTilePosition(row, col)

  const handleClick = useCallback(() => {
    if (selectedPlant) {
      plantSelected(row, col)
    }
  }, [selectedPlant, plantSelected, row, col])

  const handlePointerOver = useCallback(() => {
    setHovered(true)
    document.body.style.cursor = selectedPlant ? 'pointer' : 'default'
  }, [selectedPlant])

  const handlePointerOut = useCallback(() => {
    setHovered(false)
    document.body.style.cursor = 'default'
  }, [])

  return (
    <group>
      <RoundedBox
        args={[CELL_SIZE, tileHeight, CELL_SIZE]}
        radius={0.05}
        smoothness={4}
        position={[x, y, z]}
        receiveShadow
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <meshStandardMaterial color={color} />
      </RoundedBox>

      {/* Ghost preview */}
      {hovered && selectedPlant && (
        <mesh position={[x, tileHeight + 0.3, z]}>
          <sphereGeometry args={[0.25, 16, 16]} />
          <meshStandardMaterial
            color={PLANT_PREVIEW_COLORS[selectedPlant]}
            transparent
            opacity={0.5}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </group>
  )
}

function Lawn() {
  const tiles: JSX.Element[] = []

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      tiles.push(<Tile key={`${row}-${col}`} row={row} col={col} />)
    }
  }

  return <group>{tiles}</group>
}

export default Lawn
