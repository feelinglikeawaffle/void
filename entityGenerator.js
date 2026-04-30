/* ============================
   ENTITY GENERATOR
   ============================ */

const ENTITY_STAR_WEIGHTS = [
  { stars: 1, weight: 70 },
  { stars: 2, weight: 20 },
  { stars: 3, weight: 7 },
  { stars: 4, weight: 2.5 },
  { stars: 5, weight: 0.5 }
];

const ENTITY_DPS_RANGES = {
  1: { min: 1, max: 3 },
  2: { min: 5, max: 15 },
  3: { min: 20, max: 60 },
  4: { min: 150, max: 300 },
  5: { min: 800, max: 1200 }
};

const ENTITY_BASE_HIRE_COST = {
  1: 10,
  2: 100,
  3: 1000,
  4: 10000,
  5: 100000
};

function randRange(min, max) {
  return min + Math.random() * (max - min);
}

function pickWeightedStar() {
  const total = ENTITY_STAR_WEIGHTS.reduce((s, e) => s + e.weight, 0);
  let r = Math.random() * total;
  for (const e of ENTITY_STAR_WEIGHTS) {
    if (r < e.weight) return e.stars;
    r -= e.weight;
  }
  return 1;
}

function rollEntityStats(stars) {
  const range = ENTITY_DPS_RANGES[stars];
  const dps = randRange(range.min, range.max);

  // Extra stats (simple for now, can expand later)
  return {
    dps,
    speed: 1 + Math.random() * 0.5,     // affects future mechanics
    luck: Math.random(),                // affects merge / rarity later
    efficiency: 1 + Math.random() * 0.5 // future hooks
  };
}

function calcHireCost(stars) {
  const base = ENTITY_BASE_HIRE_COST[stars] || 10;
  const mult = state.entityHireCostMult || 1;
  return Math.floor(base * mult);
}

function generateEntity() {
  const stars = pickWeightedStar();
  const id = crypto.randomUUID ? crypto.randomUUID() : ("e_" + Math.random().toString(36).slice(2));
  const num = Math.floor(100 + Math.random() * 900);
  const name = `Entity #${num}`;
  const stats = rollEntityStats(stars);

  return {
    id,
    name,
    stars,
    dps: stats.dps,
    speed: stats.speed,
    luck: stats.luck,
    efficiency: stats.efficiency,
    isUltra: false
  };
}

function generateHirePool(count = 6) {
  const pool = [];
  for (let i = 0; i < count; i++) {
    pool.push(generateEntity());
  }
  return pool;
}
