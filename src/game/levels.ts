import { ZombieType } from './types';
import type { LevelConfig } from './types';

export const LEVELS: LevelConfig[] = [
  // Level 1: Introduction - just regular zombies
  {
    levelNumber: 1,
    waves: [
      { zombies: [{ type: ZombieType.regular, lane: 2, delay: 0 }] },
      { zombies: [
        { type: ZombieType.regular, lane: 1, delay: 0 },
        { type: ZombieType.regular, lane: 3, delay: 2000 },
      ]},
    ],
  },
  // Level 2: More regulars
  {
    levelNumber: 2,
    waves: [
      { zombies: [
        { type: ZombieType.regular, lane: 0, delay: 0 },
        { type: ZombieType.regular, lane: 4, delay: 1000 },
      ]},
      { zombies: [
        { type: ZombieType.regular, lane: 1, delay: 0 },
        { type: ZombieType.regular, lane: 2, delay: 1000 },
        { type: ZombieType.regular, lane: 3, delay: 2000 },
      ]},
      { zombies: [
        { type: ZombieType.regular, lane: 0, delay: 0 },
        { type: ZombieType.regular, lane: 2, delay: 500 },
        { type: ZombieType.regular, lane: 4, delay: 1000 },
      ]},
    ],
  },
  // Level 3: Introduce coneheads
  {
    levelNumber: 3,
    waves: [
      { zombies: [
        { type: ZombieType.regular, lane: 1, delay: 0 },
        { type: ZombieType.regular, lane: 3, delay: 1000 },
      ]},
      { zombies: [
        { type: ZombieType.conehead, lane: 2, delay: 0 },
        { type: ZombieType.regular, lane: 0, delay: 2000 },
      ]},
      { zombies: [
        { type: ZombieType.conehead, lane: 1, delay: 0 },
        { type: ZombieType.conehead, lane: 3, delay: 1000 },
        { type: ZombieType.regular, lane: 4, delay: 2000 },
      ]},
    ],
  },
  // Level 4: Flag bearers (faster zombies)
  {
    levelNumber: 4,
    waves: [
      { zombies: [
        { type: ZombieType.regular, lane: 0, delay: 0 },
        { type: ZombieType.regular, lane: 2, delay: 500 },
        { type: ZombieType.regular, lane: 4, delay: 1000 },
      ]},
      { zombies: [
        { type: ZombieType.flag, lane: 2, delay: 0 },
        { type: ZombieType.conehead, lane: 1, delay: 1000 },
        { type: ZombieType.conehead, lane: 3, delay: 1500 },
      ]},
      { zombies: [
        { type: ZombieType.flag, lane: 0, delay: 0 },
        { type: ZombieType.flag, lane: 4, delay: 500 },
        { type: ZombieType.conehead, lane: 2, delay: 1000 },
        { type: ZombieType.regular, lane: 1, delay: 2000 },
      ]},
    ],
  },
  // Level 5: Introduce bucketheads
  {
    levelNumber: 5,
    waves: [
      { zombies: [
        { type: ZombieType.regular, lane: 1, delay: 0 },
        { type: ZombieType.conehead, lane: 3, delay: 1000 },
      ]},
      { zombies: [
        { type: ZombieType.buckethead, lane: 2, delay: 0 },
        { type: ZombieType.regular, lane: 0, delay: 1000 },
        { type: ZombieType.regular, lane: 4, delay: 1500 },
      ]},
      { zombies: [
        { type: ZombieType.buckethead, lane: 1, delay: 0 },
        { type: ZombieType.conehead, lane: 2, delay: 1000 },
        { type: ZombieType.conehead, lane: 3, delay: 1500 },
        { type: ZombieType.flag, lane: 4, delay: 2000 },
      ]},
      { zombies: [
        { type: ZombieType.buckethead, lane: 0, delay: 0 },
        { type: ZombieType.buckethead, lane: 4, delay: 500 },
        { type: ZombieType.regular, lane: 2, delay: 1000 },
      ]},
    ],
  },
  // Level 6: Introduce pole vaulting
  {
    levelNumber: 6,
    waves: [
      { zombies: [
        { type: ZombieType.regular, lane: 0, delay: 0 },
        { type: ZombieType.regular, lane: 2, delay: 500 },
        { type: ZombieType.polevaulting, lane: 4, delay: 1000 },
      ]},
      { zombies: [
        { type: ZombieType.polevaulting, lane: 1, delay: 0 },
        { type: ZombieType.conehead, lane: 3, delay: 1000 },
        { type: ZombieType.regular, lane: 2, delay: 1500 },
      ]},
      { zombies: [
        { type: ZombieType.polevaulting, lane: 0, delay: 0 },
        { type: ZombieType.polevaulting, lane: 2, delay: 500 },
        { type: ZombieType.buckethead, lane: 4, delay: 1000 },
        { type: ZombieType.conehead, lane: 1, delay: 2000 },
      ]},
      { zombies: [
        { type: ZombieType.polevaulting, lane: 3, delay: 0 },
        { type: ZombieType.flag, lane: 2, delay: 500 },
        { type: ZombieType.buckethead, lane: 1, delay: 1000 },
        { type: ZombieType.regular, lane: 0, delay: 1500 },
        { type: ZombieType.regular, lane: 4, delay: 2000 },
      ]},
    ],
  },
  // Level 7: Introduce newspaper zombie
  {
    levelNumber: 7,
    waves: [
      { zombies: [
        { type: ZombieType.newspaper, lane: 1, delay: 0 },
        { type: ZombieType.regular, lane: 3, delay: 1000 },
      ]},
      { zombies: [
        { type: ZombieType.newspaper, lane: 0, delay: 0 },
        { type: ZombieType.newspaper, lane: 4, delay: 500 },
        { type: ZombieType.conehead, lane: 2, delay: 1000 },
      ]},
      { zombies: [
        { type: ZombieType.buckethead, lane: 2, delay: 0 },
        { type: ZombieType.polevaulting, lane: 1, delay: 500 },
        { type: ZombieType.newspaper, lane: 3, delay: 1000 },
        { type: ZombieType.conehead, lane: 0, delay: 1500 },
      ]},
      { zombies: [
        { type: ZombieType.newspaper, lane: 0, delay: 0 },
        { type: ZombieType.newspaper, lane: 1, delay: 500 },
        { type: ZombieType.newspaper, lane: 2, delay: 1000 },
        { type: ZombieType.buckethead, lane: 3, delay: 1500 },
        { type: ZombieType.flag, lane: 4, delay: 2000 },
      ]},
    ],
  },
  // Level 8: Introduce football zombie
  {
    levelNumber: 8,
    waves: [
      { zombies: [
        { type: ZombieType.conehead, lane: 0, delay: 0 },
        { type: ZombieType.conehead, lane: 2, delay: 500 },
        { type: ZombieType.conehead, lane: 4, delay: 1000 },
      ]},
      { zombies: [
        { type: ZombieType.football, lane: 2, delay: 0 },
        { type: ZombieType.regular, lane: 1, delay: 1000 },
        { type: ZombieType.regular, lane: 3, delay: 1500 },
      ]},
      { zombies: [
        { type: ZombieType.football, lane: 0, delay: 0 },
        { type: ZombieType.football, lane: 4, delay: 500 },
        { type: ZombieType.buckethead, lane: 2, delay: 1000 },
        { type: ZombieType.newspaper, lane: 1, delay: 1500 },
      ]},
      { zombies: [
        { type: ZombieType.football, lane: 1, delay: 0 },
        { type: ZombieType.football, lane: 3, delay: 500 },
        { type: ZombieType.polevaulting, lane: 2, delay: 1000 },
        { type: ZombieType.buckethead, lane: 0, delay: 1500 },
        { type: ZombieType.buckethead, lane: 4, delay: 2000 },
      ]},
      { zombies: [
        { type: ZombieType.football, lane: 0, delay: 0 },
        { type: ZombieType.football, lane: 1, delay: 300 },
        { type: ZombieType.football, lane: 2, delay: 600 },
        { type: ZombieType.football, lane: 3, delay: 900 },
        { type: ZombieType.football, lane: 4, delay: 1200 },
      ]},
    ],
  },
  // Level 9: Introduce gargantuar
  {
    levelNumber: 9,
    waves: [
      { zombies: [
        { type: ZombieType.buckethead, lane: 1, delay: 0 },
        { type: ZombieType.buckethead, lane: 3, delay: 500 },
        { type: ZombieType.conehead, lane: 0, delay: 1000 },
        { type: ZombieType.conehead, lane: 4, delay: 1500 },
      ]},
      { zombies: [
        { type: ZombieType.football, lane: 2, delay: 0 },
        { type: ZombieType.polevaulting, lane: 1, delay: 500 },
        { type: ZombieType.newspaper, lane: 3, delay: 1000 },
        { type: ZombieType.buckethead, lane: 0, delay: 1500 },
      ]},
      { zombies: [
        { type: ZombieType.gargantuar, lane: 2, delay: 0 },
        { type: ZombieType.conehead, lane: 0, delay: 1000 },
        { type: ZombieType.conehead, lane: 4, delay: 1500 },
        { type: ZombieType.regular, lane: 1, delay: 2000 },
      ]},
      { zombies: [
        { type: ZombieType.gargantuar, lane: 1, delay: 0 },
        { type: ZombieType.gargantuar, lane: 3, delay: 1000 },
        { type: ZombieType.football, lane: 2, delay: 1500 },
        { type: ZombieType.buckethead, lane: 0, delay: 2000 },
        { type: ZombieType.buckethead, lane: 4, delay: 2500 },
      ]},
      { zombies: [
        { type: ZombieType.gargantuar, lane: 0, delay: 0 },
        { type: ZombieType.gargantuar, lane: 2, delay: 500 },
        { type: ZombieType.gargantuar, lane: 4, delay: 1000 },
        { type: ZombieType.football, lane: 1, delay: 1500 },
        { type: ZombieType.football, lane: 3, delay: 2000 },
      ]},
    ],
  },
  // Level 10: Final challenge - everything mixed
  {
    levelNumber: 10,
    waves: [
      { zombies: [
        { type: ZombieType.football, lane: 0, delay: 0 },
        { type: ZombieType.football, lane: 1, delay: 300 },
        { type: ZombieType.football, lane: 2, delay: 600 },
        { type: ZombieType.football, lane: 3, delay: 900 },
        { type: ZombieType.football, lane: 4, delay: 1200 },
      ]},
      { zombies: [
        { type: ZombieType.gargantuar, lane: 2, delay: 0 },
        { type: ZombieType.buckethead, lane: 0, delay: 500 },
        { type: ZombieType.buckethead, lane: 4, delay: 1000 },
        { type: ZombieType.polevaulting, lane: 1, delay: 1500 },
        { type: ZombieType.polevaulting, lane: 3, delay: 2000 },
      ]},
      { zombies: [
        { type: ZombieType.gargantuar, lane: 0, delay: 0 },
        { type: ZombieType.gargantuar, lane: 4, delay: 500 },
        { type: ZombieType.newspaper, lane: 1, delay: 1000 },
        { type: ZombieType.newspaper, lane: 2, delay: 1500 },
        { type: ZombieType.newspaper, lane: 3, delay: 2000 },
        { type: ZombieType.flag, lane: 2, delay: 2500 },
      ]},
      { zombies: [
        { type: ZombieType.gargantuar, lane: 1, delay: 0 },
        { type: ZombieType.gargantuar, lane: 3, delay: 500 },
        { type: ZombieType.football, lane: 0, delay: 1000 },
        { type: ZombieType.football, lane: 2, delay: 1500 },
        { type: ZombieType.football, lane: 4, delay: 2000 },
        { type: ZombieType.buckethead, lane: 1, delay: 2500 },
        { type: ZombieType.buckethead, lane: 3, delay: 3000 },
      ]},
      { zombies: [
        { type: ZombieType.gargantuar, lane: 0, delay: 0 },
        { type: ZombieType.gargantuar, lane: 1, delay: 500 },
        { type: ZombieType.gargantuar, lane: 2, delay: 1000 },
        { type: ZombieType.gargantuar, lane: 3, delay: 1500 },
        { type: ZombieType.gargantuar, lane: 4, delay: 2000 },
        { type: ZombieType.football, lane: 0, delay: 2500 },
        { type: ZombieType.football, lane: 1, delay: 2800 },
        { type: ZombieType.football, lane: 2, delay: 3100 },
        { type: ZombieType.football, lane: 3, delay: 3400 },
        { type: ZombieType.football, lane: 4, delay: 3700 },
      ]},
    ],
  },
];
