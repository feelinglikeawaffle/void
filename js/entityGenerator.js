/* ============================
   ENTITY GENERATOR
   ============================ */

/* ---------- Hire Pool Settings ---------- */

const HIRE_POOL_SIZE = 6;
const HIRE_REFRESH_TIME = 5 * 60; // 5 minutes
const EARLY_REFRESH_COST = 25;

/* ---------- Star Rarity Weights ---------- */
/* 0★ common → 7★ ultra rare */

const STAR_WEIGHTS = [
  60,   // 0★
  25,   // 1★
  10,   // 2★
  3,    // 3★
  1,    // 4★
  0.5,  // 5★
  0.3,  // 6★
  0.1   // 7★
];

/* ---------- Hire Pool State ---------- */

state.hire = {
  pool: [],
  timer: HIRE_REFRESH_TIME
};

/* ============================
   STAR ROLLING
   ============================ */

function rollStar() {
  const total = STAR_WEIGHTS.reduce((a, b) => a + b, 0);
  let roll = Math.random() * total;

  for (let i = 0; i < STAR_WEIGHTS.length; i++) {
    if (roll < STAR_WEIGHTS[i]) return i;
    roll -= STAR_WEIGHTS[i];
  }
  return 0;
}

/* ============================
   COST FUNCTIONS
   ============================ */

/* Hire cost scales with star AND number of entities */
function getHireCost(star) {
  const base = 10 * Math.pow(star + 1, 2);     // star scaling
  const mult = Math.pow(1.15, state.entities.length); // inflation
  return Math.floor(base * mult);
}

/* Star‑up cost grows exponentially */
function getStarUpCost(star) {
  return Math.floor(50 * Math.pow(3, star));
}

/* Star multiplier for production */
function getStarMultiplier(star) {
  return 1 + star * 0.5;
}

/* ============================
   ENTITY GENERATION
   ============================ */

function generateEntity() {
  const star = rollStar();

  /* Base scaling by star */
  const baseDust = 1 + star * 1.2;
  const baseEff  = 1 + star * 0.2;
  const baseSpd  = 1 + star * 0.1;

  /* Small random variety */
  const dustVar = 0.85 + Math.random() * 0.3;  // 0.85–1.15
  const effVar  = 0.9  + Math.random() * 0.2;  // 0.9–1.1
  const spdVar  = 0.9  + Math.random() * 0.2;  // 0.9–1.1

  return {
    id: "ent_" + Math.random().toString(36).slice(2),
    name: "Entity " + Math.floor(Math.random() * 9999),
    star: star,

    /* Production stats */
    baseDust: baseDust * dustVar,
    efficiency: baseEff * effVar,
    speed: baseSpd * spdVar,

    luck: 1,
    progress: 0
  };
}

/* ============================
   HIRE POOL
   ============================ */

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

  /* Remove from pool */
  state.hire.pool = state.hire.pool.filter(e => e.id !== id);
}

/* Early refresh */
function earlyRefreshHirePool() {
  if (state.resources.dust < EARLY_REFRESH_COST) return false;

  state.resources.dust -= EARLY_REFRESH_COST;
  state.hire.timer = HIRE_REFRESH_TIME;
  generateHirePool();
  return true;
}

/* ============================
   HIRE TIMER (called from tick.js)
   ============================ */

function tickHireTimer(dt) {
  state.hire.timer -= dt / 1000;

  if (state.hire.timer <= 0) {
    state.hire.timer = HIRE_REFRESH_TIME;
    generateHirePool();
  }

  const t = Math.max(0, Math.floor(state.hire.timer));
  const m = Math.floor(t / 60);
  const s = (t % 60).toString().padStart(2, "0");

  const timerEl = document.getElementById("hire-timer");
  if (timerEl) timerEl.textContent = `Next refresh in: ${m}:${s}`;
}
