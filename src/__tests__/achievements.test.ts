import { describe, it, expect, beforeEach } from 'vitest'
import { AchievementTracker } from '../game/achievementTracker'
import type { AchievementContext } from '../game/achievementTracker'
import { AchievementId } from '../game/achievements'

function makeContext(overrides: Partial<AchievementContext> = {}): AchievementContext {
  return {
    zombiesKilledThisLevel: 0,
    sunCollectedThisLevel: 0,
    plantsLostThisLevel: 0,
    elapsedMs: 180000,
    stars: 1,
    currentLevel: 1,
    completedLevels: {},
    maxCherryBombKills: 0,
    ...overrides,
  }
}

describe('AchievementTracker', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('localStorage persistence', () => {
    it('loads empty stats when no data saved', () => {
      const tracker = new AchievementTracker()
      const stats = tracker.getStats()
      expect(stats.totalZombiesKilled).toBe(0)
      expect(stats.totalPlantsPlaced).toBe(0)
      expect(stats.earnedAchievements).toEqual([])
    })

    it('saves and loads stats correctly', () => {
      const tracker = new AchievementTracker()
      tracker.incrementKills(10)
      tracker.incrementPlants(5)

      const tracker2 = new AchievementTracker()
      const stats = tracker2.getStats()
      expect(stats.totalZombiesKilled).toBe(10)
      expect(stats.totalPlantsPlaced).toBe(5)
    })

    it('persists earned achievements across sessions', () => {
      const tracker = new AchievementTracker()
      tracker.incrementKills(1)
      const ctx = makeContext({ sunCollectedThisLevel: 100 })
      tracker.checkMidLevel(ctx)

      const tracker2 = new AchievementTracker()
      const stats = tracker2.getStats()
      expect(stats.earnedAchievements).toContain(AchievementId.FirstBlood)
      expect(stats.earnedAchievements).toContain(AchievementId.SunCollector)
    })

    it('handles corrupt localStorage gracefully', () => {
      localStorage.setItem('pvz-achievements', '{invalid json')
      const tracker = new AchievementTracker()
      const stats = tracker.getStats()
      expect(stats.totalZombiesKilled).toBe(0)
      expect(stats.earnedAchievements).toEqual([])
    })
  })

  describe('FirstBlood', () => {
    it('triggers when totalZombiesKilled > 0', () => {
      const tracker = new AchievementTracker()
      tracker.incrementKills(1)
      const result = tracker.checkMidLevel(makeContext())
      expect(result).toContain(AchievementId.FirstBlood)
    })

    it('does not trigger with 0 kills', () => {
      const tracker = new AchievementTracker()
      const result = tracker.checkMidLevel(makeContext())
      expect(result).not.toContain(AchievementId.FirstBlood)
    })

    it('does not re-trigger once earned', () => {
      const tracker = new AchievementTracker()
      tracker.incrementKills(1)
      tracker.checkMidLevel(makeContext())
      tracker.incrementKills(1)
      const result = tracker.checkMidLevel(makeContext())
      expect(result).not.toContain(AchievementId.FirstBlood)
    })
  })

  describe('SunCollector', () => {
    it('triggers at exactly 100 sun collected', () => {
      const tracker = new AchievementTracker()
      const result = tracker.checkMidLevel(makeContext({ sunCollectedThisLevel: 100 }))
      expect(result).toContain(AchievementId.SunCollector)
    })

    it('does not trigger at 99 sun collected', () => {
      const tracker = new AchievementTracker()
      const result = tracker.checkMidLevel(makeContext({ sunCollectedThisLevel: 99 }))
      expect(result).not.toContain(AchievementId.SunCollector)
    })

    it('does not re-trigger once earned', () => {
      const tracker = new AchievementTracker()
      tracker.checkMidLevel(makeContext({ sunCollectedThisLevel: 100 }))
      const result = tracker.checkMidLevel(makeContext({ sunCollectedThisLevel: 200 }))
      expect(result).not.toContain(AchievementId.SunCollector)
    })
  })

  describe('PerfectDefense', () => {
    it('triggers when stars === 3', () => {
      const tracker = new AchievementTracker()
      const result = tracker.checkOnLevelComplete(makeContext({ stars: 3 }))
      expect(result).toContain(AchievementId.PerfectDefense)
    })

    it('does not trigger with 2 stars', () => {
      const tracker = new AchievementTracker()
      const result = tracker.checkOnLevelComplete(makeContext({ stars: 2 }))
      expect(result).not.toContain(AchievementId.PerfectDefense)
    })

    it('does not re-trigger once earned', () => {
      const tracker = new AchievementTracker()
      tracker.checkOnLevelComplete(makeContext({ stars: 3 }))
      const result = tracker.checkOnLevelComplete(makeContext({ stars: 3 }))
      expect(result).not.toContain(AchievementId.PerfectDefense)
    })
  })

  describe('ZombieSlayer', () => {
    it('triggers at exactly 50 total kills', () => {
      const tracker = new AchievementTracker()
      tracker.incrementKills(50)
      const result = tracker.checkMidLevel(makeContext())
      expect(result).toContain(AchievementId.ZombieSlayer)
    })

    it('does not trigger at 49 total kills', () => {
      const tracker = new AchievementTracker()
      tracker.incrementKills(49)
      const result = tracker.checkMidLevel(makeContext())
      expect(result).not.toContain(AchievementId.ZombieSlayer)
    })

    it('does not re-trigger once earned', () => {
      const tracker = new AchievementTracker()
      tracker.incrementKills(50)
      tracker.checkMidLevel(makeContext())
      tracker.incrementKills(10)
      const result = tracker.checkMidLevel(makeContext())
      expect(result).not.toContain(AchievementId.ZombieSlayer)
    })
  })

  describe('GreenThumb', () => {
    it('triggers at exactly 100 plants placed', () => {
      const tracker = new AchievementTracker()
      tracker.incrementPlants(100)
      const result = tracker.checkMidLevel(makeContext())
      expect(result).toContain(AchievementId.GreenThumb)
    })

    it('does not trigger at 99 plants placed', () => {
      const tracker = new AchievementTracker()
      tracker.incrementPlants(99)
      const result = tracker.checkMidLevel(makeContext())
      expect(result).not.toContain(AchievementId.GreenThumb)
    })
  })

  describe('SpeedRunner', () => {
    it('triggers when level completed in under 2 minutes', () => {
      const tracker = new AchievementTracker()
      const result = tracker.checkOnLevelComplete(makeContext({ elapsedMs: 119999 }))
      expect(result).toContain(AchievementId.SpeedRunner)
    })

    it('does NOT trigger at exactly 120000ms', () => {
      const tracker = new AchievementTracker()
      const result = tracker.checkOnLevelComplete(makeContext({ elapsedMs: 120000 }))
      expect(result).not.toContain(AchievementId.SpeedRunner)
    })

    it('does not trigger at 150000ms', () => {
      const tracker = new AchievementTracker()
      const result = tracker.checkOnLevelComplete(makeContext({ elapsedMs: 150000 }))
      expect(result).not.toContain(AchievementId.SpeedRunner)
    })
  })

  describe('CherryBomber', () => {
    it('triggers when maxCherryBombKills >= 5', () => {
      const tracker = new AchievementTracker()
      const result = tracker.checkMidLevel(makeContext({ maxCherryBombKills: 5 }))
      expect(result).toContain(AchievementId.CherryBomber)
    })

    it('does not trigger at 4 kills', () => {
      const tracker = new AchievementTracker()
      const result = tracker.checkMidLevel(makeContext({ maxCherryBombKills: 4 }))
      expect(result).not.toContain(AchievementId.CherryBomber)
    })
  })

  describe('Untouchable', () => {
    it('triggers when 3 levels have stars === 3', () => {
      const tracker = new AchievementTracker()
      const completedLevels = {
        1: { stars: 3 },
        2: { stars: 3 },
        3: { stars: 3 },
      }
      const result = tracker.checkOnLevelComplete(makeContext({ completedLevels }))
      expect(result).toContain(AchievementId.Untouchable)
    })

    it('does not trigger with only 2 levels at 3 stars', () => {
      const tracker = new AchievementTracker()
      const completedLevels = {
        1: { stars: 3 },
        2: { stars: 3 },
        3: { stars: 2 },
      }
      const result = tracker.checkOnLevelComplete(makeContext({ completedLevels }))
      expect(result).not.toContain(AchievementId.Untouchable)
    })

    it('requires 3 different levels with 3 stars', () => {
      const tracker = new AchievementTracker()
      const completedLevels = {
        1: { stars: 3 },
        2: { stars: 2 },
      }
      const result = tracker.checkOnLevelComplete(makeContext({ completedLevels }))
      expect(result).not.toContain(AchievementId.Untouchable)
    })
  })

  describe('Completionist', () => {
    it('triggers when all 10 levels completed', () => {
      const tracker = new AchievementTracker()
      const completedLevels: Record<number, { stars: number }> = {}
      for (let i = 1; i <= 10; i++) {
        completedLevels[i] = { stars: 1 }
      }
      const result = tracker.checkOnLevelComplete(makeContext({ completedLevels }))
      expect(result).toContain(AchievementId.Completionist)
    })

    it('does not trigger with only 9 levels', () => {
      const tracker = new AchievementTracker()
      const completedLevels: Record<number, { stars: number }> = {}
      for (let i = 1; i <= 9; i++) {
        completedLevels[i] = { stars: 1 }
      }
      const result = tracker.checkOnLevelComplete(makeContext({ completedLevels }))
      expect(result).not.toContain(AchievementId.Completionist)
    })
  })

  describe('MasterGardener', () => {
    it('triggers when all 10 levels have 3 stars', () => {
      const tracker = new AchievementTracker()
      const completedLevels: Record<number, { stars: number }> = {}
      for (let i = 1; i <= 10; i++) {
        completedLevels[i] = { stars: 3 }
      }
      const result = tracker.checkOnLevelComplete(makeContext({ completedLevels }))
      expect(result).toContain(AchievementId.MasterGardener)
    })

    it('does not trigger if any level has less than 3 stars', () => {
      const tracker = new AchievementTracker()
      const completedLevels: Record<number, { stars: number }> = {}
      for (let i = 1; i <= 10; i++) {
        completedLevels[i] = { stars: i === 5 ? 2 : 3 }
      }
      const result = tracker.checkOnLevelComplete(makeContext({ completedLevels }))
      expect(result).not.toContain(AchievementId.MasterGardener)
    })

    it('does not trigger with only 9 levels at 3 stars', () => {
      const tracker = new AchievementTracker()
      const completedLevels: Record<number, { stars: number }> = {}
      for (let i = 1; i <= 9; i++) {
        completedLevels[i] = { stars: 3 }
      }
      const result = tracker.checkOnLevelComplete(makeContext({ completedLevels }))
      expect(result).not.toContain(AchievementId.MasterGardener)
    })
  })

  describe('multiple achievements at once', () => {
    it('can earn multiple achievements in one checkOnLevelComplete call', () => {
      const tracker = new AchievementTracker()
      tracker.incrementKills(50)
      const completedLevels: Record<number, { stars: number }> = {}
      for (let i = 1; i <= 10; i++) {
        completedLevels[i] = { stars: 3 }
      }
      const result = tracker.checkOnLevelComplete(
        makeContext({
          stars: 3,
          elapsedMs: 60000,
          completedLevels,
        })
      )
      expect(result).toContain(AchievementId.PerfectDefense)
      expect(result).toContain(AchievementId.SpeedRunner)
      expect(result).toContain(AchievementId.Untouchable)
      expect(result).toContain(AchievementId.Completionist)
      expect(result).toContain(AchievementId.MasterGardener)
      expect(result).toContain(AchievementId.ZombieSlayer)
      expect(result).toContain(AchievementId.FirstBlood)
    })
  })

  describe('incrementKills and incrementPlants', () => {
    it('accumulates kills across calls', () => {
      const tracker = new AchievementTracker()
      tracker.incrementKills(10)
      tracker.incrementKills(15)
      const stats = tracker.getStats()
      expect(stats.totalZombiesKilled).toBe(25)
    })

    it('accumulates plants across calls', () => {
      const tracker = new AchievementTracker()
      tracker.incrementPlants(3)
      tracker.incrementPlants(7)
      const stats = tracker.getStats()
      expect(stats.totalPlantsPlaced).toBe(10)
    })
  })
})
