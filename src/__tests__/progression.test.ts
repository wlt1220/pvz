import { describe, test, expect, beforeEach } from 'vitest';
import { PlantType, ZombieType } from '../game/types';
import { LEVEL_META, getUnlockedPlants, saveProgress, loadProgress } from '../game/progression';

describe('Progression - LEVEL_META', () => {
  test('has entries for all 10 levels', () => {
    for (let i = 1; i <= 10; i++) {
      expect(LEVEL_META[i]).toBeDefined();
    }
  });

  test('each level has required fields', () => {
    for (let i = 1; i <= 10; i++) {
      const meta = LEVEL_META[i]!;
      expect(meta.availablePlants).toBeDefined();
      expect(meta.availablePlants.length).toBeGreaterThan(0);
      expect(meta.introText).toBeDefined();
      expect(meta.introText.length).toBeGreaterThan(0);
      expect(meta.zombieTypes).toBeDefined();
      expect(meta.zombieTypes.length).toBeGreaterThan(0);
    }
  });

  test('each level availablePlants is a subset of all PlantType values', () => {
    const allPlants = Object.values(PlantType);
    for (let i = 1; i <= 10; i++) {
      const meta = LEVEL_META[i]!;
      for (const plant of meta.availablePlants) {
        expect(allPlants).toContain(plant);
      }
    }
  });

  test('each level zombieTypes is a subset of all ZombieType values', () => {
    const allZombies = Object.values(ZombieType);
    for (let i = 1; i <= 10; i++) {
      const meta = LEVEL_META[i]!;
      for (const zombie of meta.zombieTypes) {
        expect(allZombies).toContain(zombie);
      }
    }
  });

  test('level 1 only has sunflower and peashooter', () => {
    const meta = LEVEL_META[1]!;
    expect(meta.availablePlants).toEqual([PlantType.sunflower, PlantType.peashooter]);
  });

  test('level 10 has all 10 plant types', () => {
    const meta = LEVEL_META[10]!;
    expect(meta.availablePlants.length).toBe(10);
  });
});

describe('Progression - getUnlockedPlants', () => {
  test('level 1 returns only sunflower and peashooter', () => {
    const plants = getUnlockedPlants(1);
    expect(plants).toContain(PlantType.sunflower);
    expect(plants).toContain(PlantType.peashooter);
    expect(plants.length).toBe(2);
  });

  test('level 2 adds wallnut', () => {
    const plants = getUnlockedPlants(2);
    expect(plants).toContain(PlantType.sunflower);
    expect(plants).toContain(PlantType.peashooter);
    expect(plants).toContain(PlantType.wallnut);
    expect(plants.length).toBe(3);
  });

  test('level 10 returns all 10 plant types', () => {
    const plants = getUnlockedPlants(10);
    const allPlants = Object.values(PlantType);
    expect(plants.length).toBe(allPlants.length);
    for (const plant of allPlants) {
      expect(plants).toContain(plant);
    }
  });

  test('progressive unlocking is cumulative', () => {
    for (let i = 1; i < 10; i++) {
      const currentPlants = getUnlockedPlants(i);
      const nextPlants = getUnlockedPlants(i + 1);
      // Every plant in current level should be in next level
      for (const plant of currentPlants) {
        expect(nextPlants).toContain(plant);
      }
      // Next level should have at least as many plants
      expect(nextPlants.length).toBeGreaterThanOrEqual(currentPlants.length);
    }
  });

  test('level 0 returns empty array', () => {
    const plants = getUnlockedPlants(0);
    expect(plants.length).toBe(0);
  });
});

describe('Progression - saveProgress/loadProgress', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('loadProgress returns null when no data saved', () => {
    expect(loadProgress()).toBeNull();
  });

  test('saveProgress/loadProgress round-trips correctly', () => {
    const data = {
      unlockedLevels: 5,
      completedLevels: {
        1: { stars: 3, zombiesKilled: 10, sunCollected: 200 },
        2: { stars: 2, zombiesKilled: 15, sunCollected: 250 },
      },
      unlockedPlants: [PlantType.sunflower, PlantType.peashooter, PlantType.wallnut],
    };

    saveProgress(data);
    const loaded = loadProgress();

    expect(loaded).not.toBeNull();
    expect(loaded!.unlockedLevels).toBe(5);
    expect(loaded!.completedLevels[1]).toEqual({ stars: 3, zombiesKilled: 10, sunCollected: 200 });
    expect(loaded!.completedLevels[2]).toEqual({ stars: 2, zombiesKilled: 15, sunCollected: 250 });
    expect(loaded!.unlockedPlants).toEqual([PlantType.sunflower, PlantType.peashooter, PlantType.wallnut]);
  });

  test('saveProgress overwrites previous data', () => {
    saveProgress({
      unlockedLevels: 2,
      completedLevels: { 1: { stars: 1, zombiesKilled: 5, sunCollected: 100 } },
      unlockedPlants: [PlantType.sunflower, PlantType.peashooter],
    });

    saveProgress({
      unlockedLevels: 4,
      completedLevels: {
        1: { stars: 3, zombiesKilled: 10, sunCollected: 200 },
        2: { stars: 2, zombiesKilled: 8, sunCollected: 150 },
      },
      unlockedPlants: [PlantType.sunflower, PlantType.peashooter, PlantType.wallnut, PlantType.snowpea],
    });

    const loaded = loadProgress();
    expect(loaded!.unlockedLevels).toBe(4);
    expect(Object.keys(loaded!.completedLevels).length).toBe(2);
  });

  test('loadProgress handles corrupt data gracefully', () => {
    localStorage.setItem('pvz-progress', 'not-valid-json{{{');
    expect(loadProgress()).toBeNull();
  });
});
