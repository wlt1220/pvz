import { useRef, useEffect, useState, useCallback, useMemo } from 'react'
import { ROWS, COLS, CELL_SIZE, GAP, useGameStore } from '../store/gameStore'
import type { PlantType } from '../game/types'
import * as THREE from 'three'

const LIGHT_GREEN = new THREE.Color('#4a7c10')
const DARK_GREEN = new THREE.Color('#3d6b0c')
const HOVER_LIGHT_GREEN = new THREE.Color('#5a9c14')
const HOVER_DARK_GREEN = new THREE.Color('#4d8b10')

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

function instanceIdToRowCol(instanceId: number): [number, number] {
  const row = Math.floor(instanceId / COLS)
  const col = instanceId % COLS
  return [row, col]
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

const totalCount = ROWS * COLS
const dummy = new THREE.Object3D()

function Lawn() {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const selectedPlant = useGameStore((s) => s.selectedPlant)
  const plantSelected = useGameStore((s) => s.plantSelected)
  const [hoveredInstance, setHoveredInstance] = useState<number | null>(null)

  // Precompute tile heights for each instance
  const tileHeights = useMemo(() => {
    const heights: number[] = []
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        heights.push(0.2 + 0.02 + seededRandom(row, col) * 0.03)
      }
    }
    return heights
  }, [])

  // Set up instance matrices and colors
  useEffect(() => {
    if (!meshRef.current) return

    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        const idx = row * COLS + col
        const [x, y, z] = getTilePosition(row, col)
        const tileHeight = tileHeights[idx] as number

        dummy.position.set(x, y, z)
        dummy.scale.set(CELL_SIZE, tileHeight, CELL_SIZE)
        dummy.updateMatrix()
        meshRef.current.setMatrixAt(idx, dummy.matrix)

        const isLight = (row + col) % 2 === 0
        const color = isLight ? LIGHT_GREEN : DARK_GREEN
        meshRef.current.setColorAt(idx, color)
      }
    }

    meshRef.current.instanceMatrix.needsUpdate = true
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true
    }
  }, [tileHeights])

  // Update hovered instance color
  useEffect(() => {
    if (!meshRef.current) return

    // Reset all colors
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        const idx = row * COLS + col
        const isLight = (row + col) % 2 === 0

        if (idx === hoveredInstance && selectedPlant) {
          meshRef.current.setColorAt(idx, isLight ? HOVER_LIGHT_GREEN : HOVER_DARK_GREEN)
        } else {
          meshRef.current.setColorAt(idx, isLight ? LIGHT_GREEN : DARK_GREEN)
        }
      }
    }

    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true
    }
  }, [hoveredInstance, selectedPlant])

  const handleClick = useCallback((e: { instanceId?: number; stopPropagation?: () => void }) => {
    if (e.instanceId === undefined || !selectedPlant) return
    if (e.stopPropagation) e.stopPropagation()
    const [row, col] = instanceIdToRowCol(e.instanceId)
    plantSelected(row, col)
  }, [selectedPlant, plantSelected])

  const handlePointerOver = useCallback((e: { instanceId?: number; stopPropagation?: () => void }) => {
    if (e.instanceId === undefined) return
    if (e.stopPropagation) e.stopPropagation()
    setHoveredInstance(e.instanceId)
    document.body.style.cursor = selectedPlant ? 'pointer' : 'default'
  }, [selectedPlant])

  const handlePointerOut = useCallback(() => {
    setHoveredInstance(null)
    document.body.style.cursor = 'default'
  }, [])

  // Ghost preview position
  const previewPosition = useMemo(() => {
    if (hoveredInstance === null || !selectedPlant) return null
    const [row, col] = instanceIdToRowCol(hoveredInstance)
    const tileHeight = tileHeights[hoveredInstance] ?? 0.22
    const [x, , z] = getTilePosition(row, col)
    return [x, tileHeight + 0.3, z] as [number, number, number]
  }, [hoveredInstance, selectedPlant, tileHeights])

  return (
    <group>
      <instancedMesh
        ref={meshRef}
        args={[undefined, undefined, totalCount]}
        receiveShadow
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial />
      </instancedMesh>

      {/* Ghost preview */}
      {previewPosition && selectedPlant && (
        <mesh position={previewPosition}>
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

export default Lawn
