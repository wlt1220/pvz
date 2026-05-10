import {
  PlantType,
  ZombieType,
  ProjectileType,
  GamePhase,
} from './types';
import type {
  LevelConfig,
  GameState,
  PlantEntity,
  ZombieEntity,
  ProjectileEntity,
  SunEntity,
} from './types';
import { PLANT_CONFIGS, ZOMBIE_CONFIGS } from './configs';
import { WaveManager } from './WaveManager';
import type { ZombieSpawnEvent } from './WaveManager';

const GRID_COLS = 9;
const GRID_ROWS = 5;
const SKY_SUN_INTERVAL = 10000; // 10 seconds between sky sun drops
const SKY_SUN_VALUE = 25;
const ZOMBIE_SPAWN_X = 10; // zombies spawn at x=10 (right side)
const PROJECTILE_SPEED = 5; // cells per second

export class GameEngine {
  private phase: GamePhase = GamePhase.playing;
  private sun: number = 50;
  private plants: PlantEntity[] = [];
  private zombies: ZombieEntity[] = [];
  private projectiles: ProjectileEntity[] = [];
  private suns: SunEntity[] = [];
  private elapsedMs: number = 0;
  private skySunTimer: number = 0;
  private waveManager: WaveManager;
  private nextPlantId: number = 1;
  private nextZombieId: number = 1;
  private nextProjectileId: number = 1;
  private nextSunId: number = 1;
  private zombiesKilledCount: number = 0;
  private plantsLostCount: number = 0;
  private sunCollectedCount: number = 0;

  constructor(levelConfig: LevelConfig) {
    this.waveManager = new WaveManager(levelConfig.waves);
    this.waveManager.forceStartFirstWave();
  }

  tick(deltaMs: number): void {
    if (this.phase !== GamePhase.playing) return;

    this.elapsedMs += deltaMs;
    this._updateSunEconomy(deltaMs);
    this._spawnWaves(deltaMs);
    this._updatePlants(deltaMs);
    this._updateZombies(deltaMs);
    this._updateProjectiles(deltaMs);
    this._checkCollisions();
    this._checkWinLose();
    this._cleanupCollectedSuns();
  }

  plantAt(row: number, col: number, plantType: PlantType): boolean {
    if (this.phase !== GamePhase.playing) return false;
    if (row < 0 || row >= GRID_ROWS || col < 0 || col >= GRID_COLS) return false;

    // Check if cell is occupied
    const occupied = this.plants.some(p => p.row === row && p.col === col);
    if (occupied) return false;

    const config = PLANT_CONFIGS[plantType];
    if (this.sun < config.cost) return false;

    this.sun -= config.cost;

    const initialState = plantType === PlantType.potatomine ? 'arming' as const : 'idle' as const;
    const specialTimer = plantType === PlantType.potatomine
      ? (config.special['armTime'] as number)
      : 0;

    const plant: PlantEntity = {
      id: `plant-${this.nextPlantId++}`,
      type: plantType,
      row,
      col,
      hp: config.hp,
      maxHp: config.hp,
      cooldownTimer: 0,
      state: initialState,
      specialTimer,
    };

    this.plants.push(plant);

    // CherryBomb: immediate explosion
    if (plantType === PlantType.cherrybomb) {
      this._cherrybombExplode(plant);
    }

    return true;
  }

  collectSun(sunId: string): void {
    const sun = this.suns.find(s => s.id === sunId);
    if (sun && !sun.collected) {
      sun.collected = true;
      sun.collectedAt = this.elapsedMs;
      this.sun += sun.value;
      this.sunCollectedCount += sun.value;
    }
  }

  getState(): GameState {
    return {
      phase: this.phase,
      sun: this.sun,
      plants: [...this.plants],
      zombies: [...this.zombies],
      projectiles: [...this.projectiles],
      suns: [...this.suns],
      currentWave: this.waveManager.getCurrentWave(),
      totalWaves: this.waveManager.getTotalWaves(),
      elapsedMs: this.elapsedMs,
      zombiesKilled: this.zombiesKilledCount,
      plantsLost: this.plantsLostCount,
      sunCollected: this.sunCollectedCount,
    };
  }

  pause(): void {
    if (this.phase === GamePhase.playing) {
      this.phase = GamePhase.paused;
    }
  }

  resume(): void {
    if (this.phase === GamePhase.paused) {
      this.phase = GamePhase.playing;
    }
  }

  /** Set sun amount directly (useful for testing) */
  setSun(amount: number): void {
    this.sun = amount;
  }

  /** Remove a plant by id (shovel action) */
  removePlant(plantId: string): void {
    this.plants = this.plants.filter(p => p.id !== plantId);
  }

  // ---- Internal Methods ----

  private _updateSunEconomy(deltaMs: number): void {
    // Sky sun drops
    this.skySunTimer += deltaMs;
    if (this.skySunTimer >= SKY_SUN_INTERVAL) {
      this.skySunTimer -= SKY_SUN_INTERVAL;
      this.suns.push({
        id: `sun-${this.nextSunId++}`,
        x: Math.floor((this.nextSunId % GRID_COLS)),
        y: 0,
        value: SKY_SUN_VALUE,
        source: 'sky',
        collected: false,
      });
    }

    // Sunflower sun production
    for (const plant of this.plants) {
      if (plant.type === PlantType.sunflower && plant.state !== 'exploding') {
        plant.cooldownTimer += deltaMs;
        const config = PLANT_CONFIGS[PlantType.sunflower];
        if (plant.cooldownTimer >= config.cooldown) {
          plant.cooldownTimer -= config.cooldown;
          this.suns.push({
            id: `sun-${this.nextSunId++}`,
            x: plant.col,
            y: plant.row,
            value: config.special['sunValue'] as number,
            source: 'sunflower',
            collected: false,
          });
        }
      }
    }
  }

  private _updatePlants(deltaMs: number): void {
    for (const plant of this.plants) {
      if (plant.type === PlantType.sunflower) continue; // handled in sun economy

      // PotatoMine arming
      if (plant.type === PlantType.potatomine && plant.state === 'arming') {
        plant.specialTimer -= deltaMs;
        if (plant.specialTimer <= 0) {
          plant.state = 'armed';
          plant.specialTimer = 0;
        }
        continue;
      }

      // Chomper digesting
      if (plant.type === PlantType.chomper && plant.state === 'digesting') {
        plant.specialTimer -= deltaMs;
        if (plant.specialTimer <= 0) {
          plant.state = 'idle';
          plant.specialTimer = 0;
        }
        continue;
      }

      // Shooting plants
      if (this._isShooter(plant.type) && plant.state !== 'digesting') {
        // Only fire if there's a zombie in the same row ahead
        const hasTarget = this.zombies.some(
          z => z.row === plant.row && z.x > plant.col && z.state !== 'dying'
        );
        if (hasTarget) {
          plant.cooldownTimer += deltaMs;
          const config = PLANT_CONFIGS[plant.type];
          if (plant.cooldownTimer >= config.cooldown) {
            plant.cooldownTimer -= config.cooldown;
            this._firePlant(plant);
          }
        }
      }

      // Chomper attack (melee - attacks adjacent zombie)
      if (plant.type === PlantType.chomper && plant.state === 'idle') {
        const adjacentZombie = this.zombies.find(
          z => z.row === plant.row && z.state !== 'dying' &&
            Math.abs(z.x - plant.col) < 1.0
        );
        if (adjacentZombie) {
          // Instakill
          adjacentZombie.hp = 0;
          adjacentZombie.state = 'dying';
          plant.state = 'digesting';
          const config = PLANT_CONFIGS[PlantType.chomper];
          plant.specialTimer = config.special['digestTime'] as number;
        }
      }
    }
  }

  private _isShooter(type: PlantType): boolean {
    return type === PlantType.peashooter ||
      type === PlantType.snowpea ||
      type === PlantType.repeater;
  }

  private _firePlant(plant: PlantEntity): void {
    const config = PLANT_CONFIGS[plant.type];
    const shots = (config.special['shots'] as number) ?? 1;

    for (let i = 0; i < shots; i++) {
      let projectileType = ProjectileType.pea;
      const effects: string[] = [];

      if (plant.type === PlantType.snowpea) {
        projectileType = ProjectileType.frozenpea;
        effects.push('slow');
      }

      const spawnX = plant.col + 0.5 + i * 0.3;

      this.projectiles.push({
        id: `proj-${this.nextProjectileId++}`,
        type: projectileType,
        x: spawnX,
        row: plant.row,
        damage: config.damage,
        speed: PROJECTILE_SPEED,
        effects,
        spawnX,
      });
    }
  }

  private _updateZombies(deltaMs: number): void {
    const dtSec = deltaMs / 1000;

    for (const zombie of this.zombies) {
      if (zombie.state === 'dying') continue;

      // Newspaper zombie enrage check
      if (zombie.type === ZombieType.newspaper) {
        const config = ZOMBIE_CONFIGS[ZombieType.newspaper];
        const threshold = zombie.maxHp * (config.special['enrageThreshold'] as number);
        if (zombie.hp <= threshold && !zombie.specialState['enraged']) {
          zombie.specialState['enraged'] = true;
          zombie.speed = config.special['enrageSpeed'] as number;
        }
      }

      if (zombie.state === 'eating') {
        // Damage the plant being eaten
        const target = this.plants.find(p => p.id === zombie.eatingTarget);
        if (target) {
          target.hp -= zombie.damage * dtSec;
          if (target.hp <= 0) {
            // Plant destroyed
            this.plants = this.plants.filter(p => p.id !== target.id);
            this.plantsLostCount++;
            zombie.state = 'walking';
            zombie.eatingTarget = null;
          }
        } else {
          // Target gone, resume walking
          zombie.state = 'walking';
          zombie.eatingTarget = null;
        }
        continue;
      }

      if (zombie.state === 'walking') {
        // Pole vaulting jump logic
        if (zombie.type === ZombieType.polevaulting && !zombie.specialState['hasJumped']) {
          const plantInPath = this.plants.find(
            p => p.row === zombie.row && p.col < zombie.x && (zombie.x - p.col) < 1.0
          );
          if (plantInPath) {
            // Check if TallNut blocks
            const config = PLANT_CONFIGS[plantInPath.type];
            if (config.special['blocksVaulters']) {
              // Can't jump, start eating
              zombie.state = 'eating';
              zombie.eatingTarget = plantInPath.id;
              zombie.specialState['hasJumped'] = true;
              // Slow down after jump attempt
              zombie.speed = ZOMBIE_CONFIGS[ZombieType.polevaulting].speed * 0.5;
            } else {
              // Jump over the plant
              zombie.x = plantInPath.col - 1;
              zombie.specialState['hasJumped'] = true;
              zombie.speed = ZOMBIE_CONFIGS[ZombieType.polevaulting].speed * 0.5;
            }
            continue;
          }
        }

        zombie.x -= zombie.speed * dtSec;

        // Check for plant to eat (non-vaulters or already-jumped vaulters)
        const plantToEat = this.plants.find(
          p => p.row === zombie.row && Math.abs(p.col - zombie.x) < 0.5 && p.state !== 'exploding'
        );
        if (plantToEat) {
          // PotatoMine check
          if (plantToEat.type === PlantType.potatomine && plantToEat.state === 'armed') {
            this._potatoMineExplode(plantToEat, zombie);
            continue;
          }

          // Chomper check (if not digesting, it can eat zombie)
          if (plantToEat.type === PlantType.chomper && plantToEat.state === 'idle') {
            zombie.hp = 0;
            zombie.state = 'dying';
            plantToEat.state = 'digesting';
            const config = PLANT_CONFIGS[PlantType.chomper];
            plantToEat.specialTimer = config.special['digestTime'] as number;
            continue;
          }

          // Normal eating (skip torchwood - zombies walk through it)
          if (plantToEat.type !== PlantType.torchwood) {
            zombie.state = 'eating';
            zombie.eatingTarget = plantToEat.id;
          }
        }

        // Gargantuar throws imp at half HP
        if (zombie.type === ZombieType.gargantuar &&
          !zombie.specialState['impThrown'] &&
          zombie.hp <= zombie.maxHp * 0.5) {
          zombie.specialState['impThrown'] = true;
          this._spawnImp(zombie);
        }
      }
    }

    // Remove dead zombies
    this.zombies = this.zombies.filter(z => {
      if (z.state === 'dying') {
        this.zombiesKilledCount++;
        return false;
      }
      return true;
    });
  }

  private _spawnImp(gargantuar: ZombieEntity): void {
    // Spawn an imp (regular zombie stats but small) ahead of gargantuar
    const imp: ZombieEntity = {
      id: `zombie-${this.nextZombieId++}`,
      type: ZombieType.regular,
      row: gargantuar.row,
      x: gargantuar.x - 3, // thrown forward
      hp: 100,
      maxHp: 100,
      speed: 0.4,
      damage: 100,
      state: 'walking',
      eatingTarget: null,
      specialState: {},
    };
    this.zombies.push(imp);
  }

  private _updateProjectiles(deltaMs: number): void {
    const dtSec = deltaMs / 1000;

    for (const proj of this.projectiles) {
      proj.x += proj.speed * dtSec;
    }

    // Remove projectiles that go off-screen
    this.projectiles = this.projectiles.filter(p => p.x <= GRID_COLS + 2);
  }

  private _checkCollisions(): void {
    const projectilesToRemove: Set<string> = new Set();

    for (const proj of this.projectiles) {
      if (projectilesToRemove.has(proj.id)) continue;

      // Check torchwood passthrough (only convert if pea was spawned behind the torchwood)
      if (proj.type !== ProjectileType.firepea) {
        const torchwood = this.plants.find(
          p => p.type === PlantType.torchwood &&
            p.row === proj.row &&
            proj.x >= p.col &&
            proj.spawnX <= p.col
        );
        if (torchwood) {
          proj.type = ProjectileType.firepea;
          proj.damage *= (PLANT_CONFIGS[PlantType.torchwood].special['fireDamageMultiplier'] as number);
          proj.effects = proj.effects.filter(e => e !== 'slow');
          proj.effects.push('fire');
        }
      }

      // Check zombie hits
      for (const zombie of this.zombies) {
        if (zombie.state === 'dying') continue;
        if (zombie.row !== proj.row) continue;
        if (Math.abs(zombie.x - proj.x) < 0.5) {
          zombie.hp -= proj.damage;

          // Apply slow effect
          if (proj.effects.includes('slow')) {
            const baseConfig = ZOMBIE_CONFIGS[zombie.type];
            zombie.speed = baseConfig.speed * 0.5;
          }

          if (zombie.hp <= 0) {
            zombie.state = 'dying';
          }

          projectilesToRemove.add(proj.id);
          break;
        }
      }
    }

    this.projectiles = this.projectiles.filter(p => !projectilesToRemove.has(p.id));
  }

  private _cherrybombExplode(plant: PlantEntity): void {
    const config = PLANT_CONFIGS[PlantType.cherrybomb];
    const range = config.special['aoeRange'] as number;

    for (const zombie of this.zombies) {
      if (zombie.state === 'dying') continue;
      const rowDist = Math.abs(zombie.row - plant.row);
      const colDist = Math.abs(zombie.x - plant.col);
      if (rowDist <= range && colDist <= range) {
        zombie.hp -= config.damage;
        if (zombie.hp <= 0) {
          zombie.state = 'dying';
        }
      }
    }

    // Self-destruct
    this.plants = this.plants.filter(p => p.id !== plant.id);
  }

  private _potatoMineExplode(plant: PlantEntity, _triggerZombie: ZombieEntity): void {
    const config = PLANT_CONFIGS[PlantType.potatomine];

    // Damage all zombies in same row within range (includes the trigger zombie)
    for (const zombie of this.zombies) {
      if (zombie.state === 'dying') continue;
      if (zombie.row === plant.row && Math.abs(zombie.x - plant.col) < 1.5) {
        zombie.hp -= config.damage;
        if (zombie.hp <= 0) {
          zombie.state = 'dying';
        }
      }
    }

    // Self-destruct
    this.plants = this.plants.filter(p => p.id !== plant.id);
  }

  private _spawnWaves(deltaMs: number): void {
    const events: ZombieSpawnEvent[] = this.waveManager.tick(deltaMs);
    for (const event of events) {
      this._spawnZombie(event.type, event.lane);
    }
  }

  private _spawnZombie(type: ZombieType, lane: number): void {
    const config = ZOMBIE_CONFIGS[type];
    const zombie: ZombieEntity = {
      id: `zombie-${this.nextZombieId++}`,
      type,
      row: lane,
      x: ZOMBIE_SPAWN_X,
      hp: config.hp,
      maxHp: config.hp,
      speed: config.speed,
      damage: config.damage,
      state: 'walking',
      eatingTarget: null,
      specialState: {},
    };
    this.zombies.push(zombie);
  }

  private _cleanupCollectedSuns(): void {
    const SUN_CLEANUP_DELAY = 2000; // remove collected suns after 2 seconds
    this.suns = this.suns.filter(
      s => !s.collected || (s.collectedAt !== undefined && this.elapsedMs - s.collectedAt < SUN_CLEANUP_DELAY)
    );
  }

  private _checkWinLose(): void {
    // Lose: any zombie reaches x <= 0
    for (const zombie of this.zombies) {
      if (zombie.state !== 'dying' && zombie.x <= 0) {
        this.phase = GamePhase.lost;
        return;
      }
    }

    // Win: all waves spawned and no zombies alive
    if (this.waveManager.isComplete() && this.zombies.length === 0) {
      this.phase = GamePhase.won;
    }
  }
}
