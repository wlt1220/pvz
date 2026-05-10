import { PlantType, ZombieType } from './types';
import type { LevelMeta, ProgressData } from './types';

const STORAGE_KEY = 'pvz-progress';

/** Planting recharge time (ms) per plant type, independent of action cooldown */
export const PLANT_RECHARGE: Record<PlantType, number> = {
  [PlantType.sunflower]: 7500,
  [PlantType.peashooter]: 7500,
  [PlantType.wallnut]: 30000,
  [PlantType.snowpea]: 7500,
  [PlantType.cherrybomb]: 50000,
  [PlantType.potatomine]: 30000,
  [PlantType.repeater]: 7500,
  [PlantType.chomper]: 7500,
  [PlantType.tallnut]: 30000,
  [PlantType.torchwood]: 7500,
};

export const LEVEL_META: Record<number, LevelMeta> = {
  1: {
    availablePlants: [PlantType.sunflower, PlantType.peashooter],
    introText: 'Welcome! Plant sunflowers to collect sun, and peashooters to defeat zombies.',
    zombieTypes: [ZombieType.regular],
  },
  2: {
    availablePlants: [PlantType.sunflower, PlantType.peashooter, PlantType.wallnut],
    introText: 'Wall-nuts can block zombies while your peashooters attack!',
    zombieTypes: [ZombieType.regular],
  },
  3: {
    availablePlants: [PlantType.sunflower, PlantType.peashooter, PlantType.wallnut, PlantType.snowpea],
    introText: 'Snow Peas slow zombies down. Use them to keep coneheads at bay!',
    zombieTypes: [ZombieType.regular, ZombieType.conehead],
  },
  4: {
    availablePlants: [PlantType.sunflower, PlantType.peashooter, PlantType.wallnut, PlantType.snowpea, PlantType.cherrybomb],
    introText: 'Cherry Bombs explode and destroy all nearby zombies instantly!',
    zombieTypes: [ZombieType.regular, ZombieType.conehead, ZombieType.flag],
  },
  5: {
    availablePlants: [PlantType.sunflower, PlantType.peashooter, PlantType.wallnut, PlantType.snowpea, PlantType.cherrybomb, PlantType.potatomine],
    introText: 'Potato Mines are cheap but take time to arm. Plan ahead!',
    zombieTypes: [ZombieType.regular, ZombieType.conehead, ZombieType.buckethead, ZombieType.flag],
  },
  6: {
    availablePlants: [PlantType.sunflower, PlantType.peashooter, PlantType.wallnut, PlantType.snowpea, PlantType.cherrybomb, PlantType.potatomine, PlantType.repeater],
    introText: 'Repeaters fire two peas at once! Watch out for pole vaulters jumping over plants.',
    zombieTypes: [ZombieType.regular, ZombieType.conehead, ZombieType.buckethead, ZombieType.polevaulting],
  },
  7: {
    availablePlants: [PlantType.sunflower, PlantType.peashooter, PlantType.wallnut, PlantType.snowpea, PlantType.cherrybomb, PlantType.potatomine, PlantType.repeater, PlantType.chomper],
    introText: 'Chompers can eat a zombie whole, but need time to digest. Newspaper zombies get angry when hit!',
    zombieTypes: [ZombieType.regular, ZombieType.conehead, ZombieType.buckethead, ZombieType.polevaulting, ZombieType.newspaper],
  },
  8: {
    availablePlants: [PlantType.sunflower, PlantType.peashooter, PlantType.wallnut, PlantType.snowpea, PlantType.cherrybomb, PlantType.potatomine, PlantType.repeater, PlantType.chomper, PlantType.tallnut],
    introText: 'Tall-nuts block pole vaulters! Football zombies are fast and tough.',
    zombieTypes: [ZombieType.regular, ZombieType.conehead, ZombieType.buckethead, ZombieType.polevaulting, ZombieType.newspaper, ZombieType.football],
  },
  9: {
    availablePlants: [PlantType.sunflower, PlantType.peashooter, PlantType.wallnut, PlantType.snowpea, PlantType.cherrybomb, PlantType.potatomine, PlantType.repeater, PlantType.chomper, PlantType.tallnut, PlantType.torchwood],
    introText: 'Torchwood turns peas into fire peas with double damage! Gargantuars are coming...',
    zombieTypes: [ZombieType.regular, ZombieType.conehead, ZombieType.buckethead, ZombieType.polevaulting, ZombieType.newspaper, ZombieType.football, ZombieType.gargantuar],
  },
  10: {
    availablePlants: [PlantType.sunflower, PlantType.peashooter, PlantType.wallnut, PlantType.snowpea, PlantType.cherrybomb, PlantType.potatomine, PlantType.repeater, PlantType.chomper, PlantType.tallnut, PlantType.torchwood],
    introText: 'The final battle! Use everything you have learned to survive!',
    zombieTypes: [ZombieType.regular, ZombieType.conehead, ZombieType.buckethead, ZombieType.flag, ZombieType.polevaulting, ZombieType.newspaper, ZombieType.football, ZombieType.gargantuar],
  },
};

export function getUnlockedPlants(level: number): PlantType[] {
  const plants = new Set<PlantType>();
  for (let i = 1; i <= level; i++) {
    const meta = LEVEL_META[i];
    if (meta) {
      for (const plant of meta.availablePlants) {
        plants.add(plant);
      }
    }
  }
  return Array.from(plants);
}

export function saveProgress(data: ProgressData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Silently fail if localStorage is not available
  }
}

export function loadProgress(): ProgressData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!isValidProgressData(parsed)) return null;
    return parsed;
  } catch {
    return null;
  }
}

function isValidProgressData(data: unknown): data is ProgressData {
  if (typeof data !== 'object' || data === null) return false;
  const obj = data as Record<string, unknown>;
  if (typeof obj.unlockedLevels !== 'number') return false;
  if (typeof obj.completedLevels !== 'object' || obj.completedLevels === null) return false;
  if (!Array.isArray(obj.unlockedPlants)) return false;
  return true;
}
