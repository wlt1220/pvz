// ---- Enums ----

export enum PlantType {
  sunflower = 'sunflower',
  peashooter = 'peashooter',
  wallnut = 'wallnut',
  snowpea = 'snowpea',
  cherrybomb = 'cherrybomb',
  potatomine = 'potatomine',
  repeater = 'repeater',
  chomper = 'chomper',
  tallnut = 'tallnut',
  torchwood = 'torchwood',
}

export enum ZombieType {
  regular = 'regular',
  conehead = 'conehead',
  buckethead = 'buckethead',
  flag = 'flag',
  polevaulting = 'polevaulting',
  newspaper = 'newspaper',
  football = 'football',
  gargantuar = 'gargantuar',
}

export enum ProjectileType {
  pea = 'pea',
  frozenpea = 'frozenpea',
  firepea = 'firepea',
}

export enum GamePhase {
  menu = 'menu',
  levelSelect = 'levelSelect',
  playing = 'playing',
  paused = 'paused',
  won = 'won',
  lost = 'lost',
}

// ---- Config Interfaces ----

export interface PlantConfig {
  type: PlantType;
  hp: number;
  cost: number;
  cooldown: number; // ms between actions
  damage: number;
  special: Record<string, unknown>;
}

export interface ZombieConfig {
  type: ZombieType;
  hp: number;
  speed: number; // cells per second
  damage: number; // damage per second to plants
  special: Record<string, unknown>;
}

// ---- Entity Interfaces ----

export type PlantState = 'idle' | 'attacking' | 'arming' | 'armed' | 'exploding' | 'digesting';

export interface PlantEntity {
  id: string;
  type: PlantType;
  row: number;
  col: number;
  hp: number;
  maxHp: number;
  cooldownTimer: number; // ms remaining
  state: PlantState;
  specialTimer: number; // ms for special abilities (arming, digesting, etc.)
}

export type ZombieState = 'walking' | 'eating' | 'jumping' | 'dying';

export interface ZombieEntity {
  id: string;
  type: ZombieType;
  row: number;
  x: number; // continuous position (column-space, starts at ~10, reaches 0 = lose)
  hp: number;
  maxHp: number;
  speed: number; // cells per second (current, may be modified by slow)
  damage: number; // damage per second
  state: ZombieState;
  eatingTarget: string | null; // plant id
  specialState: Record<string, unknown>;
}

export interface ProjectileEntity {
  id: string;
  type: ProjectileType;
  x: number;
  row: number;
  damage: number;
  speed: number; // cells per second
  effects: string[]; // e.g., ['slow', 'fire']
  spawnX: number; // column-space x where the projectile was created
}

export type SunSource = 'sky' | 'sunflower';

export interface SunEntity {
  id: string;
  x: number;
  y: number;
  value: number;
  source: SunSource;
  collected: boolean;
  collectedAt?: number; // elapsed ms when collected
}

// ---- Wave/Level Config ----

export interface ZombieSpawn {
  type: ZombieType;
  lane: number; // row index
  delay: number; // ms from wave start
}

export interface WaveConfig {
  zombies: ZombieSpawn[];
}

export interface LevelConfig {
  levelNumber: number;
  waves: WaveConfig[];
}

// ---- Game State ----

export interface GameState {
  phase: GamePhase;
  sun: number;
  plants: PlantEntity[];
  zombies: ZombieEntity[];
  projectiles: ProjectileEntity[];
  suns: SunEntity[];
  currentWave: number;
  totalWaves: number;
  elapsedMs: number;
  zombiesKilled: number;
  plantsLost: number;
  sunCollected: number;
}

// ---- Level Meta / Progression ----

export interface LevelMeta {
  availablePlants: PlantType[];
  introText: string;
  zombieTypes: ZombieType[];
}

export interface LevelCompletionData {
  stars: number;
  zombiesKilled: number;
  sunCollected: number;
}

export interface ProgressData {
  unlockedLevels: number;
  completedLevels: Record<number, LevelCompletionData>;
  unlockedPlants: PlantType[];
}
