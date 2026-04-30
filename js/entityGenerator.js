/* ============================
   ENTITY GENERATOR
   ============================ */

/* ----------------------------
   Name Pools
   ---------------------------- */

const namePrefixes = [
  "Void", "Echo", "Dust", "Iron", "Shadow",
  "Astral", "Prime", "Omega", "Nova", "Quantum"
];

const nameCores = [
  "Worker", "Harvester", "Miner", "Collector",
  "Extractor", "Drone", "Servitor", "Golem",
  "Automaton", "Construct"
];

/* ----------------------------
   Generate a Random Entity
   ---------------------------- */

function generateEntity() {
  const stars = rollStars();
  const base = rollBaseStats(stars);

  return {
    name: generateName(),
    stars: stars,
    dps: base.dps,
    speed: base.speed,
    efficiency: base.efficiency,
    progress: 0
  };
}

/* ----------------------------
   Star Rating (1–5)
   ---------------------------- */

function rollStars() {
  const r = Math.random();

  if (r < 0.60) return 1;   // 60%
  if (r < 0.85) return 2;   // 25%
  if (r < 0.95) return 3;   // 10%
  if (r < 0.99) return 4;   // 4%
  return 5;                 // 1%
}

/* ----------------------------
   Base Stats by Star Rating
   ---------------------------- */

function rollBaseStats(stars) {
  // Stars scale stats multiplicatively
  const mult = 1 + stars * 0.25;

  return {
    dps: randRange(1, 3) * mult,
    speed: randRange(0.5, 1.5) * mult,
    efficiency: randRange(0.8, 1.2) * mult
  };
}

/* ----------------------------
   Random Name Generator
   ---------------------------- */

function generateName() {
  const pre = namePrefixes[Math.floor(Math.random() * namePrefixes.length)];
  const core = nameCores[Math.floor(Math.random() * nameCores.length)];
  return `${pre} ${core}`;
}

/* ----------------------------
   Utility — Random Range
   ---------------------------- */

function randRange(min, max) {
  return Math.random() * (max - min) + min;
}
