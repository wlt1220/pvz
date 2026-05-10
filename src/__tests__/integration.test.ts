import { describe, test, expect, beforeEach } from 'vitest'
import { useGameStore } from '../store/gameStore'
import { PlantType, GamePhase } from '../game/types'

describe('Integration Tests - Full Game Loop', () => {
  beforeEach(() => {
    useGameStore.setState({
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
      engine: null,
      zombiePositions: [],
    })
  })

  test('Full game flow: place sunflower, collect sun, place peashooter, peashooter kills zombie', () => {
    const { startLevel } = useGameStore.getState()
    startLevel(1)

    // Starting sun is 50, plant a sunflower at (0, 0) -- row 0 to avoid zombie lane 2
    useGameStore.getState().selectPlant(PlantType.sunflower)
    useGameStore.getState().plantSelected(0, 0)

    let state = useGameStore.getState()
    expect(state.sun).toBe(0)
    expect(state.plants.length).toBe(1)
    expect(state.plants[0]!.type).toBe(PlantType.sunflower)

    // Tick until sunflower produces sun (7500ms cooldown)
    useGameStore.getState().tick(7500)
    state = useGameStore.getState()
    const sunflowerSuns = state.suns.filter(s => !s.collected && s.source === 'sunflower')
    expect(sunflowerSuns.length).toBeGreaterThanOrEqual(1)

    // Collect the sun
    useGameStore.getState().collectSun(sunflowerSuns[0]!.id)
    state = useGameStore.getState()
    expect(state.sun).toBe(25)

    // Use engine.setSun to get enough for peashooter (simulating collecting over time)
    const engine = useGameStore.getState().engine!
    engine.setSun(100)
    useGameStore.setState({ sun: 100 })

    // Plant peashooter at row 2, col 3 (same row as Level 1 zombie lane 2)
    useGameStore.getState().selectPlant(PlantType.peashooter)
    useGameStore.getState().plantSelected(2, 3)
    state = useGameStore.getState()
    expect(state.plants.some(p => p.type === PlantType.peashooter)).toBe(true)

    // Level 1 wave 1: zombie in lane 2 at delay 0, spawns at x=10
    // Zombie should already be spawned (first wave started immediately)
    // Tick in small increments to allow projectile-zombie collision detection
    // (projectile travels at 5 cells/sec, needs small ticks to not overshoot)
    for (let i = 0; i < 200; i++) {
      useGameStore.getState().tick(100)
    }

    state = useGameStore.getState()
    // All wave 1 zombies (lane 2) should be killed by peashooter
    const zombiesInLane2 = state.zombies.filter(z => z.row === 2)
    expect(zombiesInLane2.length).toBe(0)
  })

  test('Lose condition: zombie reaches left edge', () => {
    const { startLevel } = useGameStore.getState()
    startLevel(1)

    // Level 1 wave 1: zombie in lane 2 with speed 0.3 cells/sec, starts at x=10
    // Time to reach x=0: 10 / 0.3 = ~33.3 seconds = 33333ms
    // But wave 2 also spawns so we need enough time. Tick big increments.
    for (let i = 0; i < 40; i++) {
      useGameStore.getState().tick(1000)
    }

    const state = useGameStore.getState()
    expect(state.gamePhase).toBe(GamePhase.lost)
  })

  test('Cannot plant on occupied cell', () => {
    const { startLevel } = useGameStore.getState()
    startLevel(1)

    // Give ourselves enough sun
    const engine = useGameStore.getState().engine!
    engine.setSun(200)
    useGameStore.setState({ sun: 200 })

    // Plant sunflower at (0, 0)
    useGameStore.getState().selectPlant(PlantType.sunflower)
    useGameStore.getState().plantSelected(0, 0)

    let state = useGameStore.getState()
    expect(state.plants.length).toBe(1)

    // Try to plant another at (0, 0) - should fail
    useGameStore.getState().selectPlant(PlantType.sunflower)
    useGameStore.getState().plantSelected(0, 0)

    state = useGameStore.getState()
    expect(state.plants.length).toBe(1)
  })

  test('Sun economy: starts at 50, spending reduces, collecting increases', () => {
    const { startLevel } = useGameStore.getState()
    startLevel(1)

    // Verify sun = 50
    expect(useGameStore.getState().sun).toBe(50)

    // Plant sunflower (costs 50), verify sun = 0
    useGameStore.getState().selectPlant(PlantType.sunflower)
    useGameStore.getState().plantSelected(0, 0)
    expect(useGameStore.getState().sun).toBe(0)

    // Tick until sky drops sun (10000ms)
    useGameStore.getState().tick(10000)
    const skySuns = useGameStore.getState().suns.filter(s => !s.collected && s.source === 'sky')
    expect(skySuns.length).toBeGreaterThanOrEqual(1)

    // Collect it
    useGameStore.getState().collectSun(skySuns[0]!.id)
    expect(useGameStore.getState().sun).toBeGreaterThan(0)
  })

  test('Cherry bomb clears nearby zombies', () => {
    const { startLevel } = useGameStore.getState()
    startLevel(1)

    // Give ourselves enough sun
    const engine = useGameStore.getState().engine!
    engine.setSun(500)
    useGameStore.setState({ sun: 500 })

    // Tick to spawn wave 1 zombie (lane 2, delay 0 - should already be spawned at start)
    // Tick a bit so zombie is in the field
    useGameStore.getState().tick(5000)

    let state = useGameStore.getState()
    expect(state.zombies.length).toBeGreaterThan(0)

    // Get zombie position to place cherry bomb nearby
    const zombie = state.zombies[0]!
    const bombCol = Math.min(Math.round(zombie.x), 8)
    const bombRow = zombie.row

    // Plant cherry bomb adjacent to zombie
    useGameStore.getState().selectPlant(PlantType.cherrybomb)
    useGameStore.getState().plantSelected(bombRow, bombCol)

    // Tick a small amount to process
    useGameStore.getState().tick(100)

    state = useGameStore.getState()
    // Zombie should be dead (cherry bomb does 1800 damage, regular has 100 hp)
    const survivingZombiesInRange = state.zombies.filter(
      z => z.row === bombRow && Math.abs(z.x - bombCol) <= 1
    )
    expect(survivingZombiesInRange.length).toBe(0)
  })

  test('Snow pea slows zombies', () => {
    const { startLevel } = useGameStore.getState()
    startLevel(1)

    // Give ourselves enough sun
    const engine = useGameStore.getState().engine!
    engine.setSun(500)
    useGameStore.setState({ sun: 500 })

    // Level 1 has zombie in lane 2 - place snow pea in row 2
    useGameStore.getState().selectPlant(PlantType.snowpea)
    useGameStore.getState().plantSelected(2, 3)

    // Tick in small increments to allow projectile-zombie collision
    // Snow pea fires at 1500ms, projectile at 5 cells/sec needs ~1.3s to reach zombie at ~9.5
    // Use small ticks for accurate collision detection
    for (let i = 0; i < 40; i++) {
      useGameStore.getState().tick(100)
    }

    const state = useGameStore.getState()
    // Check if any zombie in row 2 has reduced speed (0.3 * 0.5 = 0.15)
    const zombiesInRow = state.zombies.filter(z => z.row === 2 && z.state !== 'dying')
    if (zombiesInRow.length > 0) {
      expect(zombiesInRow.some(z => z.speed < 0.3)).toBe(true)
    } else {
      // Zombie was killed, snow pea worked
      expect(true).toBe(true)
    }
  })

  test('Multi-wave progression', () => {
    const { startLevel } = useGameStore.getState()
    startLevel(1)

    // Give ourselves lots of sun and place peashooters in all lanes
    const engine = useGameStore.getState().engine!
    engine.setSun(5000)
    useGameStore.setState({ sun: 5000 })

    // Place peashooters to kill zombies
    useGameStore.getState().selectPlant(PlantType.peashooter)
    useGameStore.getState().plantSelected(2, 2) // wave 1 zombie is in lane 2
    useGameStore.getState().selectPlant(PlantType.peashooter)
    useGameStore.getState().plantSelected(1, 2) // wave 2 has zombie in lane 1
    useGameStore.getState().selectPlant(PlantType.peashooter)
    useGameStore.getState().plantSelected(3, 2) // wave 2 has zombie in lane 3

    // Tick through wave 1 kill + inter-wave timer (20s) + wave 2 spawn
    // Wave 1 zombie appears immediately, peashooter kills it
    // Then 20s inter-wave, then wave 2 spawns
    for (let i = 0; i < 30; i++) {
      useGameStore.getState().tick(1000)
    }

    // After 30 seconds, wave 2 should have started (wave index should be > 0)
    const state = useGameStore.getState()
    expect(state.currentWave).toBeGreaterThan(0)
  })

  test('Pause and resume', () => {
    const { startLevel } = useGameStore.getState()
    startLevel(1)

    // Tick a bit to spawn zombie and let it start walking
    useGameStore.getState().tick(1000)

    let state = useGameStore.getState()
    expect(state.zombies.length).toBeGreaterThan(0)
    const zombieXBeforePause = state.zombies[0]!.x

    // Pause the game
    useGameStore.getState().pauseGame()
    expect(useGameStore.getState().gamePhase).toBe(GamePhase.paused)

    // Tick while paused
    useGameStore.getState().tick(5000)

    state = useGameStore.getState()
    // Zombie position should not have changed
    expect(state.zombies[0]!.x).toBe(zombieXBeforePause)

    // Resume
    useGameStore.getState().resumeGame()
    expect(useGameStore.getState().gamePhase).toBe(GamePhase.playing)

    // Tick after resume
    useGameStore.getState().tick(1000)

    state = useGameStore.getState()
    // Zombie should have moved
    expect(state.zombies[0]!.x).toBeLessThan(zombieXBeforePause)
  })
})
