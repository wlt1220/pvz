import { describe, test, expect } from 'vitest';
import { WaveManager } from '../game/WaveManager';
import { ZombieType } from '../game/types';
import type { WaveConfig } from '../game/types';
import { LEVELS } from '../game/levels';

describe('WaveManager', () => {
  test('spawns zombies at correct delay', () => {
    const waves: WaveConfig[] = [{
      zombies: [
        { type: ZombieType.regular, lane: 0, delay: 0 },
        { type: ZombieType.conehead, lane: 1, delay: 1000 },
      ],
    }];
    const wm = new WaveManager(waves);
    wm.forceStartFirstWave();

    const events1 = wm.tick(1);
    expect(events1.length).toBe(1);
    expect(events1[0]!.type).toBe(ZombieType.regular);
    expect(events1[0]!.lane).toBe(0);

    const events2 = wm.tick(999);
    expect(events2.length).toBe(1);
    expect(events2[0]!.type).toBe(ZombieType.conehead);
  });

  test('reports not complete while waves remain', () => {
    const waves: WaveConfig[] = [
      { zombies: [{ type: ZombieType.regular, lane: 0, delay: 0 }] },
      { zombies: [{ type: ZombieType.regular, lane: 1, delay: 0 }] },
    ];
    const wm = new WaveManager(waves);
    wm.forceStartFirstWave();
    wm.tick(1);
    expect(wm.isComplete()).toBe(false);
  });

  test('progresses through multiple waves', () => {
    const waves: WaveConfig[] = [
      { zombies: [{ type: ZombieType.regular, lane: 0, delay: 0 }] },
      { zombies: [{ type: ZombieType.conehead, lane: 1, delay: 0 }] },
    ];
    const wm = new WaveManager(waves);
    wm.forceStartFirstWave();

    // First wave
    const events1 = wm.tick(1);
    expect(events1.length).toBe(1);
    expect(wm.getCurrentWave()).toBe(1); // moved to wave index 1

    // Inter-wave delay
    const events2 = wm.tick(20000);
    expect(events2.length).toBe(1);
    expect(events2[0]!.type).toBe(ZombieType.conehead);
  });

  test('isComplete returns true when all waves have been spawned', () => {
    const waves: WaveConfig[] = [
      { zombies: [{ type: ZombieType.regular, lane: 0, delay: 0 }] },
    ];
    const wm = new WaveManager(waves);
    wm.forceStartFirstWave();
    wm.tick(1);
    expect(wm.isComplete()).toBe(true);
  });

  test('getCurrentWave tracks progress', () => {
    const waves: WaveConfig[] = [
      { zombies: [{ type: ZombieType.regular, lane: 0, delay: 0 }] },
      { zombies: [{ type: ZombieType.regular, lane: 1, delay: 0 }] },
    ];
    const wm = new WaveManager(waves);
    expect(wm.getCurrentWave()).toBe(0);
    wm.forceStartFirstWave();
    wm.tick(1); // completes wave 0
    expect(wm.getCurrentWave()).toBe(1);
  });

  test('getTotalWaves returns correct count', () => {
    const waves: WaveConfig[] = [
      { zombies: [{ type: ZombieType.regular, lane: 0, delay: 0 }] },
      { zombies: [{ type: ZombieType.regular, lane: 1, delay: 0 }] },
      { zombies: [{ type: ZombieType.regular, lane: 2, delay: 0 }] },
    ];
    const wm = new WaveManager(waves);
    expect(wm.getTotalWaves()).toBe(3);
  });

  test('no spawns before wave starts', () => {
    const waves: WaveConfig[] = [
      { zombies: [{ type: ZombieType.regular, lane: 0, delay: 0 }] },
    ];
    const wm = new WaveManager(waves);
    // Don't call forceStartFirstWave
    const events = wm.tick(1);
    expect(events.length).toBe(0);
  });
});

describe('Level Configurations', () => {
  test('10 levels exist', () => {
    expect(LEVELS.length).toBe(10);
  });

  test('levels have increasing level numbers', () => {
    for (let i = 0; i < LEVELS.length; i++) {
      expect(LEVELS[i]!.levelNumber).toBe(i + 1);
    }
  });

  test('all levels have at least one wave', () => {
    for (const level of LEVELS) {
      expect(level.waves.length).toBeGreaterThan(0);
    }
  });

  test('later levels have more waves or tougher zombies', () => {
    const level1 = LEVELS[0]!;
    const level10 = LEVELS[9]!;
    expect(level10.waves.length).toBeGreaterThan(level1.waves.length);
  });

  test('all zombie types in level configs are valid', () => {
    const validTypes = new Set(Object.values(ZombieType));
    for (const level of LEVELS) {
      for (const wave of level.waves) {
        for (const spawn of wave.zombies) {
          expect(validTypes.has(spawn.type)).toBe(true);
        }
      }
    }
  });

  test('all lanes in level configs are within bounds (0-4)', () => {
    for (const level of LEVELS) {
      for (const wave of level.waves) {
        for (const spawn of wave.zombies) {
          expect(spawn.lane).toBeGreaterThanOrEqual(0);
          expect(spawn.lane).toBeLessThanOrEqual(4);
        }
      }
    }
  });
});
