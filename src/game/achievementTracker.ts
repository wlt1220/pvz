import { AchievementId } from './achievements'

const STORAGE_KEY = 'pvz-achievements'
const TOTAL_LEVELS = 10

export interface AchievementContext {
  zombiesKilledThisLevel: number;
  sunCollectedThisLevel: number;
  plantsLostThisLevel: number;
  elapsedMs: number;
  stars: number;
  currentLevel: number;
  completedLevels: Record<number, { stars: number }>;
  maxCherryBombKills: number;
}

export interface AchievementStats {
  totalZombiesKilled: number;
  totalPlantsPlaced: number;
  earnedAchievements: AchievementId[];
}

export class AchievementTracker {
  private stats: AchievementStats;

  constructor() {
    this.stats = this.loadStats();
  }

  loadStats(): AchievementStats {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return {
          totalZombiesKilled: parsed.totalZombiesKilled ?? 0,
          totalPlantsPlaced: parsed.totalPlantsPlaced ?? 0,
          earnedAchievements: parsed.earnedAchievements ?? [],
        };
      }
    } catch {
      // Ignore parse errors
    }
    return {
      totalZombiesKilled: 0,
      totalPlantsPlaced: 0,
      earnedAchievements: [],
    };
  }

  saveStats(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.stats));
  }

  getStats(): AchievementStats {
    return { ...this.stats, earnedAchievements: [...this.stats.earnedAchievements] };
  }

  incrementKills(count: number): void {
    this.stats.totalZombiesKilled += count;
    this.saveStats();
  }

  incrementPlants(count: number): void {
    this.stats.totalPlantsPlaced += count;
    this.saveStats();
  }

  checkOnLevelComplete(context: AchievementContext): AchievementId[] {
    const newlyEarned: AchievementId[] = [];

    // PerfectDefense: stars === 3
    if (context.stars === 3 && !this._isEarned(AchievementId.PerfectDefense)) {
      newlyEarned.push(AchievementId.PerfectDefense);
    }

    // SpeedRunner: elapsedMs < 120000 (strictly less than)
    if (context.elapsedMs < 120000 && !this._isEarned(AchievementId.SpeedRunner)) {
      newlyEarned.push(AchievementId.SpeedRunner);
    }

    // Untouchable: 3 different levels with stars === 3 (no plants lost means 3 stars)
    if (!this._isEarned(AchievementId.Untouchable)) {
      const levelsWithPerfect = Object.values(context.completedLevels).filter(
        (l) => l.stars === 3
      ).length;
      if (levelsWithPerfect >= 3) {
        newlyEarned.push(AchievementId.Untouchable);
      }
    }

    // Completionist: all 10 levels completed
    if (!this._isEarned(AchievementId.Completionist)) {
      const completedCount = Object.keys(context.completedLevels).length;
      if (completedCount >= TOTAL_LEVELS) {
        newlyEarned.push(AchievementId.Completionist);
      }
    }

    // MasterGardener: all 10 levels with 3 stars
    if (!this._isEarned(AchievementId.MasterGardener)) {
      const perfectCount = Object.values(context.completedLevels).filter(
        (l) => l.stars === 3
      ).length;
      if (perfectCount >= TOTAL_LEVELS) {
        newlyEarned.push(AchievementId.MasterGardener);
      }
    }

    // Also check mid-level achievements that might trigger at level completion
    const midLevel = this._checkMidLevelInternal(context);
    for (const id of midLevel) {
      if (!newlyEarned.includes(id)) {
        newlyEarned.push(id);
      }
    }

    if (newlyEarned.length > 0) {
      this.stats.earnedAchievements.push(...newlyEarned);
      this.saveStats();
    }

    return newlyEarned;
  }

  checkMidLevel(context: AchievementContext): AchievementId[] {
    const newlyEarned = this._checkMidLevelInternal(context);

    if (newlyEarned.length > 0) {
      this.stats.earnedAchievements.push(...newlyEarned);
      this.saveStats();
    }

    return newlyEarned;
  }

  private _checkMidLevelInternal(context: AchievementContext): AchievementId[] {
    const newlyEarned: AchievementId[] = [];

    // FirstBlood: totalZombiesKilled > 0
    if (this.stats.totalZombiesKilled > 0 && !this._isEarned(AchievementId.FirstBlood)) {
      newlyEarned.push(AchievementId.FirstBlood);
    }

    // SunCollector: sunCollectedThisLevel >= 100
    if (context.sunCollectedThisLevel >= 100 && !this._isEarned(AchievementId.SunCollector)) {
      newlyEarned.push(AchievementId.SunCollector);
    }

    // ZombieSlayer: totalZombiesKilled >= 50
    if (this.stats.totalZombiesKilled >= 50 && !this._isEarned(AchievementId.ZombieSlayer)) {
      newlyEarned.push(AchievementId.ZombieSlayer);
    }

    // GreenThumb: totalPlantsPlaced >= 100
    if (this.stats.totalPlantsPlaced >= 100 && !this._isEarned(AchievementId.GreenThumb)) {
      newlyEarned.push(AchievementId.GreenThumb);
    }

    // CherryBomber: maxCherryBombKills >= 5
    if (context.maxCherryBombKills >= 5 && !this._isEarned(AchievementId.CherryBomber)) {
      newlyEarned.push(AchievementId.CherryBomber);
    }

    return newlyEarned;
  }

  private _isEarned(id: AchievementId): boolean {
    return this.stats.earnedAchievements.includes(id);
  }
}
