export enum AchievementId {
  FirstBlood = 'first_blood',
  SunCollector = 'sun_collector',
  PerfectDefense = 'perfect_defense',
  ZombieSlayer = 'zombie_slayer',
  GreenThumb = 'green_thumb',
  SpeedRunner = 'speed_runner',
  CherryBomber = 'cherry_bomber',
  Untouchable = 'untouchable',
  Completionist = 'completionist',
  MasterGardener = 'master_gardener',
}

export interface AchievementDef {
  id: AchievementId;
  name: string;
  description: string;
  icon: string;
}

export const ACHIEVEMENTS: AchievementDef[] = [
  {
    id: AchievementId.FirstBlood,
    name: 'First Blood',
    description: 'Kill your first zombie',
    icon: '\u{1F480}',
  },
  {
    id: AchievementId.SunCollector,
    name: 'Sun Collector',
    description: 'Collect 100 sun in one level',
    icon: '\u{2600}\uFE0F',
  },
  {
    id: AchievementId.PerfectDefense,
    name: 'Perfect Defense',
    description: 'Complete a level with 3 stars',
    icon: '\u{1F6E1}\uFE0F',
  },
  {
    id: AchievementId.ZombieSlayer,
    name: 'Zombie Slayer',
    description: 'Kill 50 zombies total',
    icon: '\u{2694}\uFE0F',
  },
  {
    id: AchievementId.GreenThumb,
    name: 'Green Thumb',
    description: 'Plant 100 plants total',
    icon: '\u{1F331}',
  },
  {
    id: AchievementId.SpeedRunner,
    name: 'Speed Runner',
    description: 'Complete a level in under 2 minutes',
    icon: '\u{23F1}\uFE0F',
  },
  {
    id: AchievementId.CherryBomber,
    name: 'Cherry Bomber',
    description: 'Kill 5+ zombies with one Cherry Bomb',
    icon: '\u{1F4A3}',
  },
  {
    id: AchievementId.Untouchable,
    name: 'Untouchable',
    description: 'Complete 3 levels without losing plants',
    icon: '\u{2728}',
  },
  {
    id: AchievementId.Completionist,
    name: 'Completionist',
    description: 'Complete all 10 levels',
    icon: '\u{1F3C6}',
  },
  {
    id: AchievementId.MasterGardener,
    name: 'Master Gardener',
    description: 'Get 3 stars on all 10 levels',
    icon: '\u{1F451}',
  },
]
