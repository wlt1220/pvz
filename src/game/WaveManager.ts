import type { WaveConfig, ZombieType } from './types';

export interface ZombieSpawnEvent {
  type: ZombieType;
  lane: number;
}

export class WaveManager {
  private waves: WaveConfig[];
  private currentWaveIndex: number = 0;
  private waveElapsedMs: number = 0;
  private spawnedIndices: Set<number> = new Set();
  private waveActive: boolean = false;
  private allWavesStarted: boolean = false;
  private interWaveTimer: number = 0;
  private readonly interWaveDelay: number = 20000; // 20s between waves

  constructor(waves: WaveConfig[]) {
    this.waves = waves;
  }

  startNextWave(): void {
    if (this.currentWaveIndex < this.waves.length) {
      this.waveActive = true;
      this.waveElapsedMs = 0;
      this.spawnedIndices = new Set();
      this.interWaveTimer = 0;
    }
  }

  tick(deltaMs: number): ZombieSpawnEvent[] {
    if (this.allWavesStarted && !this.waveActive) {
      return [];
    }

    if (!this.waveActive) {
      this.interWaveTimer += deltaMs;
      if (this.interWaveTimer >= this.interWaveDelay) {
        this.startNextWave();
      } else {
        return [];
      }
    }

    const events: ZombieSpawnEvent[] = [];
    const wave = this.waves[this.currentWaveIndex];

    if (!wave) {
      return events;
    }

    this.waveElapsedMs += deltaMs;

    for (let i = 0; i < wave.zombies.length; i++) {
      if (this.spawnedIndices.has(i)) continue;
      const spawn = wave.zombies[i];
      if (!spawn) continue;
      if (this.waveElapsedMs >= spawn.delay) {
        events.push({ type: spawn.type, lane: spawn.lane });
        this.spawnedIndices.add(i);
      }
    }

    // Check if wave is complete (all zombies spawned)
    if (this.spawnedIndices.size === wave.zombies.length) {
      this.waveActive = false;
      this.currentWaveIndex++;
      if (this.currentWaveIndex >= this.waves.length) {
        this.allWavesStarted = true;
      }
    }

    return events;
  }

  isComplete(): boolean {
    return this.allWavesStarted && !this.waveActive;
  }

  getCurrentWave(): number {
    return this.currentWaveIndex;
  }

  getTotalWaves(): number {
    return this.waves.length;
  }

  forceStartFirstWave(): void {
    this.startNextWave();
  }
}
