/* ============================
   ENTITY GENERATOR (HIRE MENU)
   ============================ */

const HIRE_POOL_SIZE = 6;
const HIRE_REFRESH_TIME = 5 * 60; // 5 minutes
const EARLY_REFRESH_COST = 25;

const STAR_WEIGHTS = [
  60, 25, 10, 3, 1, 0.5, 0.3, 0.1
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

function getHireCost(star) {
  const base = 10 * Math.pow(star + 1, 2);
  const mult = Math.pow(1.15, state.entities.length);
  return Math.floor(base * mult);
}

function getStarUpCost(star) {
  return Math.floor(50 * Math.pow(3, star));
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

  const cost = getHireCost(ent.star);
  if (state.resources.dust < cost) return;

  state.resources.dust -= cost;

  state.entities.push(ent);

  state.hire.pool = state.hire.pool.filter(e => e.id !== id);
}

function earlyRefreshHirePool() {
  if (state.resources.dust < EARLY_REFRESH_COST) return false;

  state.resources.dust -= EARLY_REFRESH_COST;
  state.hire.timer = HIRE_REFRESH_TIME;
  generateHirePool();
  return true;
}
