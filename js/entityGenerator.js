/* ============================
   ENTITY GENERATOR (HIRE MENU)
   ============================ */

const HIRE_POOL_SIZE = 6;
const HIRE_REFRESH_TIME = 5 * 60; // 5 minutes in seconds
const EARLY_REFRESH_COST = 25; // Dust cost for early refresh

// Weighted star rarity
const STAR_WEIGHTS = [
  60, // 0★
  25, // 1★
  10, // 2★
  3,  // 3★
  1,  // 4★
  0.5,// 5★
  0.3,// 6★
  0.1 // 7★
];

state.hire = {
  pool: [],
  timer: HIRE_REFRESH_TIME
};

function rollStar() {
  const total = STAR_WEIGHTS.reduce((a, b) => a + b, 0);
  let roll = Math.random() * total;

  for (let i = 0; i < STAR_WEIGHTS.length; i++) {
    if (roll < STAR_WEIGHTS[i]) return i;
    roll -= STAR_WEIGHTS[i];
  }
  return 0;
}

function generateEntity() {
  const star = rollStar();

  return {
    id: "ent_" + Math.random().toString(36).slice(2),
    name: "Entity " + Math.floor(Math.random() * 9999),
    star: star,
    baseDust: 1 + star * 0.5,
    efficiency: 1 + star * 0.1,
    speed: 1 + star * 0.05,
    luck: 1,
    progress: 0
  };
}

function generateHirePool() {
  state.hire.pool = [];
  for (let i = 0; i < HIRE_POOL_SIZE; i++) {
    state.hire.pool.push(generateEntity());
  }
}

function hireEntity(id) {
  const ent = state.hire.pool.find(e => e.id === id);
  if (!ent) return;

  // Add to owned entities
  state.entities.push(ent);

  // Remove from hire pool
  state.hire.pool = state.hire.pool.filter(e => e.id !== id);
}

function earlyRefreshHirePool() {
  if (state.resources.dust < EARLY_REFRESH_COST) return false;

  state.resources.dust -= EARLY_REFRESH_COST;
  state.hire.timer = HIRE_REFRESH_TIME;
  generateHirePool();
  return true;
}
