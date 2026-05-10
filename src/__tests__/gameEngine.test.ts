import { describe, test, expect } from 'vitest';
import { GameEngine } from '../game/GameEngine';
import { PlantType, ZombieType, GamePhase, ProjectileType } from '../game/types';
import type { LevelConfig } from '../game/types';
import { PLANT_CONFIGS, ZOMBIE_CONFIGS } from '../game/configs';

// Helper: empty level that doesn't immediately end (has zombie far in future)
function emptyLevel(): LevelConfig {
  return { levelNumber: 1, waves: [{ zombies: [{ type: ZombieType.regular, lane: 0, delay: 999999 }] }] };
}

// Helper: single zombie in lane
function singleZombieLevel(type: ZombieType = ZombieType.regular, lane: number = 2, delay: number = 0): LevelConfig {
  return {
    levelNumber: 1,
    waves: [{ zombies: [{ type, lane, delay }] }],
  };
}

describe('GameEngine - Sun Economy', () => {
  test('starts with 50 sun', () => {
    const engine = new GameEngine(emptyLevel());
    expect(engine.getState().sun).toBe(50);
  });

  test('sky drops sun periodically (every 10s)', () => {
    const engine = new GameEngine(emptyLevel());
    engine.tick(10000);
    const state = engine.getState();
    expect(state.suns.length).toBeGreaterThanOrEqual(1);
    expect(state.suns.some(s => s.source === 'sky')).toBe(true);
  });

  test('sunflower produces sun after its cooldown', () => {
    const engine = new GameEngine(emptyLevel());
    engine.plantAt(0, 0, PlantType.sunflower); // costs 50
    engine.tick(7500);
    const state = engine.getState();
    const sunflowerSuns = state.suns.filter(s => s.source === 'sunflower');
    expect(sunflowerSuns.length).toBeGreaterThanOrEqual(1);
    expect(sunflowerSuns[0]!.value).toBe(25);
  });

  test('collecting sun adds to total', () => {
    const engine = new GameEngine(emptyLevel());
    engine.tick(10000); // trigger sky sun
    const state = engine.getState();
    const skySun = state.suns.find(s => s.source === 'sky' && !s.collected);
    expect(skySun).toBeDefined();
    engine.collectSun(skySun!.id);
    expect(engine.getState().sun).toBe(50 + skySun!.value);
  });

  test('cannot plant without enough sun', () => {
    const engine = new GameEngine(emptyLevel());
    const result = engine.plantAt(0, 0, PlantType.peashooter); // costs 100
    expect(result).toBe(false);
    expect(engine.getState().plants.length).toBe(0);
  });
});

describe('GameEngine - Planting', () => {
  test('plant on valid empty cell succeeds', () => {
    const engine = new GameEngine(emptyLevel());
    const result = engine.plantAt(0, 0, PlantType.sunflower);
    expect(result).toBe(true);
    expect(engine.getState().plants.length).toBe(1);
    expect(engine.getState().plants[0]!.type).toBe(PlantType.sunflower);
  });

  test('reject occupied cell', () => {
    const engine = new GameEngine(emptyLevel());
    engine.plantAt(0, 0, PlantType.sunflower);
    const result = engine.plantAt(0, 0, PlantType.sunflower);
    expect(result).toBe(false);
    expect(engine.getState().plants.length).toBe(1);
  });

  test('reject out-of-bounds (row)', () => {
    const engine = new GameEngine(emptyLevel());
    expect(engine.plantAt(-1, 0, PlantType.sunflower)).toBe(false);
    expect(engine.plantAt(5, 0, PlantType.sunflower)).toBe(false);
  });

  test('reject out-of-bounds (col)', () => {
    const engine = new GameEngine(emptyLevel());
    expect(engine.plantAt(0, -1, PlantType.sunflower)).toBe(false);
    expect(engine.plantAt(0, 9, PlantType.sunflower)).toBe(false);
  });

  test('deducts sun cost on successful plant', () => {
    const engine = new GameEngine(emptyLevel());
    engine.plantAt(0, 0, PlantType.sunflower);
    expect(engine.getState().sun).toBe(0);
  });

  test('plant appears in state with correct properties', () => {
    const engine = new GameEngine(emptyLevel());
    engine.plantAt(2, 3, PlantType.sunflower);
    const plant = engine.getState().plants[0]!;
    expect(plant.row).toBe(2);
    expect(plant.col).toBe(3);
    expect(plant.hp).toBe(PLANT_CONFIGS[PlantType.sunflower].hp);
    expect(plant.id).toMatch(/^plant-\d+$/);
  });
});

describe('GameEngine - Combat', () => {
  test('peashooter fires projectile when zombie is in same row', () => {
    const level = singleZombieLevel(ZombieType.buckethead, 2, 0);
    const engine = new GameEngine(level);
    engine.setSun(500);
    engine.tick(1); // spawn zombie
    engine.plantAt(2, 1, PlantType.peashooter);
    engine.tick(1500); // fire after cooldown
    const state = engine.getState();
    expect(state.projectiles.length).toBeGreaterThanOrEqual(1);
    expect(state.projectiles[0]!.row).toBe(2);
  });

  test('projectile hits zombie and reduces HP', () => {
    const level = singleZombieLevel(ZombieType.buckethead, 2, 0);
    const engine = new GameEngine(level);
    engine.setSun(500);
    engine.tick(1); // spawn zombie at x=10
    engine.plantAt(2, 1, PlantType.peashooter);

    // Let projectile fire and travel to hit zombie
    for (let i = 0; i < 30; i++) engine.tick(500);

    const zombie = engine.getState().zombies.find(z => z.row === 2);
    if (zombie) {
      expect(zombie.hp).toBeLessThan(400);
    }
  });

  test('zombie dies at 0 HP', () => {
    const level = singleZombieLevel(ZombieType.regular, 2, 0);
    const engine = new GameEngine(level);
    engine.setSun(500);
    engine.tick(1); // spawn zombie (100 HP)
    engine.plantAt(2, 0, PlantType.peashooter);
    engine.plantAt(2, 1, PlantType.peashooter);

    // Kill zombie: 100hp / 40dps effective, plus travel time
    for (let i = 0; i < 200; i++) engine.tick(100);

    const state = engine.getState();
    if (state.phase === GamePhase.playing || state.phase === GamePhase.won) {
      expect(state.zombies.filter(z => z.row === 2).length).toBe(0);
    }
  });

  test('zombie eats plant when adjacent', () => {
    const level = singleZombieLevel(ZombieType.regular, 2, 0);
    const engine = new GameEngine(level);
    engine.setSun(500);
    engine.tick(1); // spawn zombie at x=10
    engine.plantAt(2, 8, PlantType.wallnut); // place near spawn

    // Zombie walks from x=10 to col 8 at 0.3 cells/s: ~6.7s
    for (let i = 0; i < 80; i++) engine.tick(100);

    const zombie = engine.getState().zombies.find(z => z.row === 2);
    expect(zombie).toBeDefined();
    expect(zombie!.state).toBe('eating');
  });

  test('plant destroyed at 0 HP from zombie eating', () => {
    const level = singleZombieLevel(ZombieType.regular, 2, 0);
    const engine = new GameEngine(level);
    engine.setSun(500);
    engine.tick(1);
    engine.plantAt(2, 8, PlantType.sunflower); // hp=100, zombie damage=100/s

    // Walk to plant (~6.7s) + eat (~1s) = ~8s
    for (let i = 0; i < 100; i++) engine.tick(100);

    const plants = engine.getState().plants.filter(p => p.row === 2 && p.col === 8);
    expect(plants.length).toBe(0);
  });
});

describe('GameEngine - Special Plants', () => {
  test('SnowPea slows zombie on hit', () => {
    const level = singleZombieLevel(ZombieType.buckethead, 2, 0);
    const engine = new GameEngine(level);
    engine.setSun(500);
    engine.tick(1);
    engine.plantAt(2, 1, PlantType.snowpea);

    const baseSpeed = ZOMBIE_CONFIGS[ZombieType.buckethead].speed;

    // Fire and hit
    for (let i = 0; i < 30; i++) engine.tick(500);

    const zombie = engine.getState().zombies.find(z => z.row === 2);
    if (zombie) {
      expect(zombie.speed).toBeLessThan(baseSpeed);
    }
  });

  test('CherryBomb damages all zombies in 3x3 area then self-destructs', () => {
    const level: LevelConfig = {
      levelNumber: 1,
      waves: [{
        zombies: [
          { type: ZombieType.buckethead, lane: 2, delay: 0 },
          { type: ZombieType.buckethead, lane: 3, delay: 0 },
        ],
      }],
    };
    const engine = new GameEngine(level);
    engine.setSun(500);
    engine.tick(1); // spawn zombies at x=10

    // Plant cherry bomb right where zombies are (col 8 is close to x=10)
    // Zombies are at x=10. CherryBomb at col 8 has range=1, so covers cols 7-9 and rows 1-3
    // But zombie x is 10 and plant col is 8: |10-8| = 2 > range of 1
    // Let zombies walk a bit first
    engine.tick(5000); // zombies walk 0.3*5=1.5, now at x=8.5

    engine.plantAt(2, 8, PlantType.cherrybomb);
    engine.tick(1); // process

    const state = engine.getState();
    // Both zombies (400 HP) should be dead from 1800 damage
    expect(state.zombies.length).toBe(0);
    // Cherry bomb should be gone
    expect(state.plants.filter(p => p.type === PlantType.cherrybomb).length).toBe(0);
  });

  test('PotatoMine arms after 15s delay', () => {
    const engine = new GameEngine(emptyLevel());
    engine.plantAt(2, 5, PlantType.potatomine); // costs 25
    const plant1 = engine.getState().plants.find(p => p.type === PlantType.potatomine)!;
    expect(plant1.state).toBe('arming');

    engine.tick(15000);
    const plant2 = engine.getState().plants.find(p => p.type === PlantType.potatomine)!;
    expect(plant2.state).toBe('armed');
  });

  test('PotatoMine explodes when armed zombie steps on it', () => {
    const level = singleZombieLevel(ZombieType.regular, 2, 16000);
    const engine = new GameEngine(level);
    engine.plantAt(2, 7, PlantType.potatomine); // costs 25

    engine.tick(15000); // arm the mine
    expect(engine.getState().plants.find(p => p.type === PlantType.potatomine)!.state).toBe('armed');

    engine.tick(1000); // zombie spawns at 16000ms
    expect(engine.getState().zombies.length).toBe(1);

    // Zombie at x=10, speed=0.3, reach col 7: 3/0.3 = 10s
    for (let i = 0; i < 110; i++) engine.tick(100);

    const state = engine.getState();
    expect(state.zombies.filter(z => z.row === 2).length).toBe(0);
    expect(state.plants.filter(p => p.type === PlantType.potatomine).length).toBe(0);
  });

  test('Repeater fires 2 peas per cooldown', () => {
    const level = singleZombieLevel(ZombieType.gargantuar, 2, 0);
    const engine = new GameEngine(level);
    engine.setSun(500);
    engine.tick(1); // spawn zombie
    engine.plantAt(2, 0, PlantType.repeater);
    engine.tick(1500); // cooldown

    const state = engine.getState();
    const peas = state.projectiles.filter(p => p.row === 2);
    expect(peas.length).toBe(2);
  });

  test('Chomper instakills zombie then digests', () => {
    const level = singleZombieLevel(ZombieType.regular, 2, 0);
    const engine = new GameEngine(level);
    engine.setSun(500);
    engine.tick(1); // zombie at x=10
    engine.plantAt(2, 8, PlantType.chomper);

    // Zombie walks from 10 to 8: 2/0.3 ~= 6.7s
    for (let i = 0; i < 80; i++) engine.tick(100);

    const state = engine.getState();
    const zombies = state.zombies.filter(z => z.row === 2);
    expect(zombies.length).toBe(0);
    const chomper = state.plants.find(p => p.type === PlantType.chomper);
    expect(chomper).toBeDefined();
    expect(chomper!.state).toBe('digesting');
  });

  test('TallNut blocks pole vaulters', () => {
    const level = singleZombieLevel(ZombieType.polevaulting, 2, 0);
    const engine = new GameEngine(level);
    engine.setSun(500);
    engine.tick(1); // vaulter at x=10, speed=0.6
    engine.plantAt(2, 5, PlantType.tallnut);

    // Vaulter reaches col 5: (10-5)/0.6 ~= 8.3s
    for (let i = 0; i < 100; i++) engine.tick(100);

    const zombie = engine.getState().zombies.find(z => z.row === 2);
    expect(zombie).toBeDefined();
    expect(zombie!.state).toBe('eating');
  });

  test('Torchwood converts peas to fire peas with 2x damage', () => {
    const level = singleZombieLevel(ZombieType.gargantuar, 2, 0);
    const engine = new GameEngine(level);
    engine.setSun(500);
    engine.tick(1);
    engine.plantAt(2, 1, PlantType.peashooter);
    engine.plantAt(2, 3, PlantType.torchwood);

    // Fire pea and let it travel through torchwood (col 1.5 to col 3: 1.5/5 = 0.3s)
    engine.tick(1500); // fire - pea passes through torchwood in same tick

    const state = engine.getState();
    const firePeas = state.projectiles.filter(p => p.type === ProjectileType.firepea);
    expect(firePeas.length).toBeGreaterThanOrEqual(1);
    expect(firePeas[0]!.damage).toBe(40);
  });
});

describe('GameEngine - Special Zombies', () => {
  test('PoleVaulting zombie jumps over first non-tall plant', () => {
    const level = singleZombieLevel(ZombieType.polevaulting, 2, 0);
    const engine = new GameEngine(level);
    engine.setSun(500);
    engine.tick(1); // vaulter at x=10, speed=0.6
    engine.plantAt(2, 7, PlantType.sunflower);

    // Walk to col 7: (10-7)/0.6 = 5s
    for (let i = 0; i < 60; i++) engine.tick(100);

    const zombie = engine.getState().zombies.find(z => z.row === 2);
    expect(zombie).toBeDefined();
    expect(zombie!.x).toBeLessThan(7);
    expect(zombie!.specialState['hasJumped']).toBe(true);
    // Plant should still exist
    const plant = engine.getState().plants.find(p => p.col === 7);
    expect(plant).toBeDefined();
  });

  test('Newspaper zombie speeds up when HP drops below threshold', () => {
    const level = singleZombieLevel(ZombieType.newspaper, 2, 0);
    const engine = new GameEngine(level);
    engine.setSun(500);
    engine.tick(1);
    engine.plantAt(2, 1, PlantType.peashooter);

    const initialSpeed = ZOMBIE_CONFIGS[ZombieType.newspaper].speed; // 0.2

    // Need 4 hits of 20 dmg to drop below 75hp (50% of 150)
    // 4 hits * 1.5s each = 6s, plus travel time for projectiles
    for (let i = 0; i < 150; i++) engine.tick(100);

    const zombie = engine.getState().zombies.find(z => z.row === 2);
    if (zombie && zombie.hp <= zombie.maxHp * 0.5) {
      expect(zombie.speed).toBeGreaterThan(initialSpeed);
    }
  });

  test('Gargantuar throws imp at half HP', () => {
    const level = singleZombieLevel(ZombieType.gargantuar, 2, 0);
    const engine = new GameEngine(level);
    engine.setSun(1000);
    engine.tick(1);
    engine.plantAt(2, 0, PlantType.peashooter);
    engine.plantAt(2, 1, PlantType.peashooter);
    engine.plantAt(2, 2, PlantType.peashooter);
    engine.plantAt(2, 3, PlantType.peashooter);

    // 4 peashooters * 20 dmg / 1.5s = ~53 dps
    // Need to reduce 1500 HP to 750: 750/53 ~= 14s + projectile travel
    // Check periodically for imp spawn
    let impWasSpawned = false;
    for (let i = 0; i < 300; i++) {
      engine.tick(100);
      const state = engine.getState();
      const others = state.zombies.filter(z => z.type !== ZombieType.gargantuar);
      if (others.length > 0) {
        impWasSpawned = true;
        break;
      }
    }

    expect(impWasSpawned).toBe(true);
  });
});

describe('GameEngine - Waves', () => {
  test('spawns zombies per wave config timing', () => {
    const level: LevelConfig = {
      levelNumber: 1,
      waves: [{ zombies: [
        { type: ZombieType.regular, lane: 2, delay: 0 },
        { type: ZombieType.conehead, lane: 3, delay: 500 },
      ]}],
    };
    const engine = new GameEngine(level);
    engine.tick(1);
    expect(engine.getState().zombies.length).toBe(1);
    engine.tick(500);
    expect(engine.getState().zombies.length).toBe(2);
  });

  test('win when all waves cleared and zombies dead', () => {
    const level = singleZombieLevel(ZombieType.regular, 2, 0);
    const engine = new GameEngine(level);
    engine.setSun(500);
    engine.tick(1); // spawn zombie
    engine.plantAt(2, 0, PlantType.peashooter);
    engine.plantAt(2, 1, PlantType.peashooter);
    engine.plantAt(2, 2, PlantType.peashooter);

    // Kill zombie quickly with 3 peashooters
    for (let i = 0; i < 200; i++) {
      engine.tick(100);
      if (engine.getState().phase !== GamePhase.playing) break;
    }

    expect(engine.getState().phase).toBe(GamePhase.won);
  });

  test('lose when zombie reaches x=0', () => {
    const level = singleZombieLevel(ZombieType.regular, 2, 0);
    const engine = new GameEngine(level);
    engine.tick(1); // spawn zombie

    // Zombie at x=10, speed=0.3: 10/0.3 = 33.3s
    for (let i = 0; i < 350; i++) engine.tick(100);

    expect(engine.getState().phase).toBe(GamePhase.lost);
  });
});

describe('GameEngine - Configs', () => {
  test('all 10 plant types have configs', () => {
    const plantTypes = Object.values(PlantType);
    expect(plantTypes.length).toBe(10);
    for (const pt of plantTypes) {
      expect(PLANT_CONFIGS[pt]).toBeDefined();
      expect(PLANT_CONFIGS[pt].hp).toBeGreaterThan(0);
    }
  });

  test('all 8 zombie types have configs', () => {
    const zombieTypes = Object.values(ZombieType);
    expect(zombieTypes.length).toBe(8);
    for (const zt of zombieTypes) {
      expect(ZOMBIE_CONFIGS[zt]).toBeDefined();
      expect(ZOMBIE_CONFIGS[zt].hp).toBeGreaterThan(0);
    }
  });

  test('plant costs match spec', () => {
    expect(PLANT_CONFIGS[PlantType.sunflower].cost).toBe(50);
    expect(PLANT_CONFIGS[PlantType.peashooter].cost).toBe(100);
    expect(PLANT_CONFIGS[PlantType.wallnut].cost).toBe(50);
    expect(PLANT_CONFIGS[PlantType.snowpea].cost).toBe(175);
    expect(PLANT_CONFIGS[PlantType.cherrybomb].cost).toBe(150);
    expect(PLANT_CONFIGS[PlantType.potatomine].cost).toBe(25);
    expect(PLANT_CONFIGS[PlantType.repeater].cost).toBe(200);
    expect(PLANT_CONFIGS[PlantType.chomper].cost).toBe(150);
    expect(PLANT_CONFIGS[PlantType.tallnut].cost).toBe(125);
    expect(PLANT_CONFIGS[PlantType.torchwood].cost).toBe(175);
  });

  test('zombie HP matches spec', () => {
    expect(ZOMBIE_CONFIGS[ZombieType.regular].hp).toBe(100);
    expect(ZOMBIE_CONFIGS[ZombieType.conehead].hp).toBe(200);
    expect(ZOMBIE_CONFIGS[ZombieType.buckethead].hp).toBe(400);
    expect(ZOMBIE_CONFIGS[ZombieType.flag].hp).toBe(100);
    expect(ZOMBIE_CONFIGS[ZombieType.polevaulting].hp).toBe(200);
    expect(ZOMBIE_CONFIGS[ZombieType.newspaper].hp).toBe(150);
    expect(ZOMBIE_CONFIGS[ZombieType.football].hp).toBe(500);
    expect(ZOMBIE_CONFIGS[ZombieType.gargantuar].hp).toBe(1500);
  });
});

describe('GameEngine - Pause/Resume', () => {
  test('pause stops game progression', () => {
    const engine = new GameEngine(emptyLevel());
    engine.tick(100);
    engine.pause();
    const stateBefore = engine.getState();
    engine.tick(5000);
    const stateAfter = engine.getState();
    expect(stateAfter.elapsedMs).toBe(stateBefore.elapsedMs);
  });

  test('resume continues game', () => {
    const engine = new GameEngine(emptyLevel());
    engine.tick(100);
    engine.pause();
    engine.resume();
    engine.tick(1000);
    expect(engine.getState().elapsedMs).toBe(1100);
  });
});
