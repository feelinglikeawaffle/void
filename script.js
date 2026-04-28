// Feeding the Void — Large Expansion (Tuned)
// Target: ~1 hour to first Ascension, clearer effects, hover unlock hints

const SAVE_KEY = "void_game_massive_v2";

// ---------- STATE ----------

let state = {
  time: 0,

  // base resources
  dust: 0,
  fragments: 0,
  echoes: 0,
  cores: 0,
  sigils: 0,
  paradoxDust: 0,
  riftEnergy: 0,
  realityShards: 0,
  voidCrystals: 0,
  astralFibers: 0,
  entropicMass: 0,

  // prestige currencies
  voidFavor: 0,
  ascendantShards: 0,
  transcendentEssence: 0,
  eternalEmbers: 0,

  // content
  skills: {},
  jobs: {},

  // prestige upgrades
  ascUpgrades: {},
  transcendUpgrades: {},
  eternalUpgrades: {},

  // unlock flags
  unlocks: {
    jobs: false,
    void: false,
    ascend: false,
    transcend: false,
    eternal: false
  }
};

// ---------- DEFINITIONS ----------
// Tuned: baseDuration ~ 9–20s, durationGrowth ~ 0.18–0.28

const skillDefs = [
  // Mind / Body
  {
    id: "focus",
    name: "Focus",
    desc: "Sharpen your mind.",
    effect: "Increases overall skill training speed slightly.",
    baseDuration: 9000,
    durationGrowth: 0.18,
    requires: null
  },
  {
    id: "meditation",
    name: "Meditation",
    desc: "Stillness reveals truth.",
    effect: "Further increases skill training speed.",
    baseDuration: 11000,
    durationGrowth: 0.20,
    requires: { skill: "focus", level: 5 }
  },
  {
    id: "breath_control",
    name: "Breath Control",
    desc: "Control the rhythm of life.",
    effect: "Slightly reduces skill bar durations.",
    baseDuration: 12000,
    durationGrowth: 0.20,
    requires: { skill: "focus", level: 8 }
  },
  {
    id: "endurance",
    name: "Endurance",
    desc: "Hold on longer.",
    effect: "Moderately reduces skill bar durations.",
    baseDuration: 13000,
    durationGrowth: 0.22,
    requires: { skill: "breath_control", level: 5 }
  },
  {
    id: "pain_tolerance",
    name: "Pain Tolerance",
    desc: "Ignore the screaming.",
    effect: "Further reduces skill bar durations.",
    baseDuration: 14000,
    durationGrowth: 0.22,
    requires: { skill: "endurance", level: 5 }
  },

  // Void
  {
    id: "void_sense",
    name: "Void Sensitivity",
    desc: "Feel the pull of the Void.",
    effect: "Slightly increases Void Favor gain.",
    baseDuration: 11000,
    durationGrowth: 0.20,
    requires: { skill: "focus", level: 3 }
  },
  {
    id: "void_channeling",
    name: "Void Channeling",
    desc: "Let the Void flow through you.",
    effect: "Increases Void Favor gain per offering.",
    baseDuration: 13000,
    durationGrowth: 0.22,
    requires: { skill: "void_sense", level: 6 }
  },
  {
    id: "void_binding",
    name: "Void Binding",
    desc: "Anchor fragments to the Void.",
    effect: "Improves job resource yields slightly.",
    baseDuration: 14000,
    durationGrowth: 0.24,
    requires: { skill: "void_channeling", level: 6 }
  },
  {
    id: "void_resistance",
    name: "Void Resistance",
    desc: "Survive the pressure.",
    effect: "Reduces effective duration of jobs.",
    baseDuration: 15000,
    durationGrowth: 0.24,
    requires: { skill: "void_binding", level: 6 }
  },

  // Meta / Time
  {
    id: "memory_weaving",
    name: "Memory Weaving",
    desc: "Bind thoughts into patterns.",
    effect: "Generates Echoes on level up.",
    baseDuration: 12000,
    durationGrowth: 0.22,
    requires: { skill: "meditation", level: 6 }
  },
  {
    id: "time_perception",
    name: "Time Perception",
    desc: "Stretch and compress moments.",
    effect: "Increases global speed slightly.",
    baseDuration: 13000,
    durationGrowth: 0.24,
    requires: { skill: "memory_weaving", level: 6 }
  },
  {
    id: "parallel_thought",
    name: "Parallel Thought",
    desc: "Think in multiple directions.",
    effect: "Further increases global speed.",
    baseDuration: 14000,
    durationGrowth: 0.24,
    requires: { skill: "time_perception", level: 6 }
  },
  {
    id: "reality_anchoring",
    name: "Reality Anchoring",
    desc: "Stay intact near the Void.",
    effect: "Slightly boosts job yields.",
    baseDuration: 16000,
    durationGrowth: 0.26,
    requires: { skill: "void_resistance", level: 6 }
  },

  // Weird / Deep
  {
    id: "dreamwalking",
    name: "Dreamwalking",
    desc: "Walk through other minds.",
    effect: "Increases Echo generation and job speed slightly.",
    baseDuration: 13000,
    durationGrowth: 0.24,
    requires: { skill: "memory_weaving", level: 10 }
  },
  {
    id: "rift_peering",
    name: "Rift Peering",
    desc: "Look between realities.",
    effect: "Unlocks rift-related jobs and improves Paradox Dust gain.",
    baseDuration: 15000,
    durationGrowth: 0.26,
    requires: { skill: "void_binding", level: 10 }
  },
  {
    id: "entropy_shaping",
    name: "Entropy Shaping",
    desc: "Nudge decay into patterns.",
    effect: "Increases Entropic Mass gain from jobs.",
    baseDuration: 16000,
    durationGrowth: 0.26,
    requires: { skill: "time_perception", level: 10 }
  },
  {
    id: "phase_stability",
    name: "Phase Stability",
    desc: "Keep your form coherent.",
    effect: "Increases Astral Fiber gain from jobs.",
    baseDuration: 17000,
    durationGrowth: 0.26,
    requires: { skill: "reality_anchoring", level: 10 }
  },
  {
    id: "mind_fracture",
    name: "Mind Fracture",
    desc: "Split yourself into shards.",
    effect: "Slightly increases all resource gains.",
    baseDuration: 18000,
    durationGrowth: 0.28,
    requires: { skill: "parallel_thought", level: 12 }
  },
  {
    id: "self_replication",
    name: "Self-Replication Theory",
    desc: "Imagine copies of yourself.",
    effect: "Further increases all resource gains.",
    baseDuration: 20000,
    durationGrowth: 0.28,
    requires: { skill: "mind_fracture", level: 8 }
  }
];

const jobDefs = [
  // Tier 1
  {
    id: "dust_gatherer",
    name: "Dust Gatherer",
    desc: "Collect cosmic dust.",
    effect: "Produces Dust. Higher levels increase Dust gain.",
    baseDuration: 10000,
    durationGrowth: 0.20,
    resource: "dust",
    req: { skill: "focus", level: 1 }
  },
  {
    id: "fragment_sifter",
    name: "Fragment Sifter",
    desc: "Sort broken realities.",
    effect: "Produces Fragments. Higher levels increase Fragment gain.",
    baseDuration: 12000,
    durationGrowth: 0.22,
    resource: "fragments",
    req: { skill: "void_sense", level: 2 }
  },
  {
    id: "echo_listener",
    name: "Echo Listener",
    desc: "Listen to lingering thoughts.",
    effect: "Produces Echoes. Higher levels increase Echo gain.",
    baseDuration: 12000,
    durationGrowth: 0.22,
    resource: "echoes",
    req: { skill: "memory_weaving", level: 3 }
  },
  {
    id: "rift_sweeper",
    name: "Rift Sweeper",
    desc: "Clean up unstable rifts.",
    effect: "Produces Paradox Dust.",
    baseDuration: 13000,
    durationGrowth: 0.22,
    resource: "paradoxDust",
    req: { skill: "rift_peering", level: 2 }
  },
  {
    id: "void_janitor",
    name: "Void Janitor",
    desc: "Mop up metaphysical spills.",
    effect: "Produces Dust with a small bonus.",
    baseDuration: 13000,
    durationGrowth: 0.22,
    resource: "dust",
    req: { skill: "void_resistance", level: 2 }
  },

  // Tier 2
  {
    id: "core_compressor",
    name: "Core Compressor",
    desc: "Compress fragments into cores.",
    effect: "Produces Cores from your efforts.",
    baseDuration: 14000,
    durationGrowth: 0.24,
    resource: "cores",
    req: { skill: "void_binding", level: 4 }
  },
  {
    id: "sigil_engraver",
    name: "Sigil Engraver",
    desc: "Carve meaning into sigils.",
    effect: "Produces Sigils.",
    baseDuration: 15000,
    durationGrowth: 0.24,
    resource: "sigils",
    req: { skill: "time_perception", level: 4 }
  },
  {
    id: "entropy_collector",
    name: "Entropy Collector",
    desc: "Harvest decay itself.",
    effect: "Produces Entropic Mass.",
    baseDuration: 15000,
    durationGrowth: 0.24,
    resource: "entropicMass",
    req: { skill: "entropy_shaping", level: 3 }
  },
  {
    id: "thread_weaver",
    name: "Thread Weaver",
    desc: "Weave astral fibers.",
    effect: "Produces Astral Fibers.",
    baseDuration: 15000,
    durationGrowth: 0.24,
    resource: "astralFibers",
    req: { skill: "phase_stability", level: 3 }
  },
  {
    id: "dream_archivist",
    name: "Dream Archivist",
    desc: "File away dreams.",
    effect: "Produces Echoes with a small bonus.",
    baseDuration: 14000,
    durationGrowth: 0.24,
    resource: "echoes",
    req: { skill: "dreamwalking", level: 4 }
  },

  // Tier 3
  {
    id: "rift_navigator",
    name: "Rift Navigator",
    desc: "Chart safe paths.",
    effect: "Produces Rift Energy.",
    baseDuration: 16000,
    durationGrowth: 0.26,
    resource: "riftEnergy",
    req: { skill: "rift_peering", level: 6 }
  },
  {
    id: "reality_auditor",
    name: "Reality Auditor",
    desc: "Check for inconsistencies.",
    effect: "Produces Reality Shards.",
    baseDuration: 17000,
    durationGrowth: 0.26,
    resource: "realityShards",
    req: { skill: "reality_anchoring", level: 6 }
  },
  {
    id: "paradox_handler",
    name: "Paradox Handler",
    desc: "Contain paradoxes.",
    effect: "Produces Paradox Dust with a bonus.",
    baseDuration: 18000,
    durationGrowth: 0.26,
    resource: "paradoxDust",
    req: { skill: "mind_fracture", level: 4 }
  },
  {
    id: "void_harvester",
    name: "Void Harvester",
    desc: "Extract pure Void crystals.",
    effect: "Produces Void Crystals.",
    baseDuration: 19000,
    durationGrowth: 0.28,
    resource: "voidCrystals",
    req: { skill: "void_channeling", level: 10 }
  },
  {
    id: "ascendant_scribe",
    name: "Ascendant Scribe",
    desc: "Record impossible events.",
    effect: "Produces Reality Shards with a bonus.",
    baseDuration: 20000,
    durationGrowth: 0.28,
    resource: "realityShards",
    req: { skill: "self_replication", level: 4 }
  }
];

// Ascension upgrades (permanent)
const ascUpgradeDefs = [
  { id: "asc_speed", name: "Temporal Flow", desc: "+5% global speed per level.", baseCost: 1, costMult: 2, effectPerLevel: 0.05 },
  { id: "asc_job_yield", name: "Efficient Labor", desc: "+5% job yield per level.", baseCost: 1, costMult: 2, effectPerLevel: 0.05 },
  { id: "asc_skill_speed", name: "Focused Training", desc: "+5% skill speed per level.", baseCost: 1, costMult: 2, effectPerLevel: 0.05 },
  { id: "asc_void_power", name: "Void Authority", desc: "+1% Void Favor effect per level.", baseCost: 2, costMult: 2.5, effectPerLevel: 0.01 }
];

// Transcendence upgrades
const transcendUpgradeDefs = [
  { id: "tr_global", name: "Meta-Time", desc: "+10% global speed per level.", baseCost: 1, costMult: 3, effectPerLevel: 0.10 },
  { id: "tr_asc_gain", name: "Ascendant Echo", desc: "+20% Ascendant Shard gain per level.", baseCost: 2, costMult: 3, effectPerLevel: 0.20 }
];

// Eternal upgrades
const eternalUpgradeDefs = [
  { id: "et_global", name: "Eternal Momentum", desc: "+5% global speed per level (multiplicative).", baseCost: 1, costMult: 4, effectPerLevel: 0.05 }
];

// ---------- ELEMENTS ----------

const el = {
  time: document.getElementById("time-display"),

  dust: document.getElementById("dust-count"),
  fragments: document.getElementById("fragment-count"),
  echoes: document.getElementById("echo-count"),
  cores: document.getElementById("core-count"),
  sigils: document.getElementById("sigil-count"),
  paradoxDust: document.getElementById("paradox-count"),
  riftEnergy: document.getElementById("rift-count"),
  realityShards: document.getElementById("reality-count"),
  voidCrystals: document.getElementById("crystal-count"),
  astralFibers: document.getElementById("fiber-count"),
  entropicMass: document.getElementById("mass-count"),

  voidFavor: document.getElementById("void-favor-value"),
  voidMult: document.getElementById("void-mult-value"),

  shards: document.getElementById("shard-count"),
  essence: document.getElementById("essence-count"),
  embers: document.getElementById("ember-count"),

  skills: document.getElementById("skills-container"),
  jobs: document.getElementById("jobs-container"),
  voidActions: document.getElementById("void-actions"),
  autoVoid: document.getElementById("auto-void-toggle"),

  ascendInfo: document.getElementById("ascend-info"),
  ascendBtn: document.getElementById("ascend-btn"),
  ascendUpgrades: document.getElementById("ascend-upgrades"),

  transcendInfo: document.getElementById("transcend-info"),
  transcendBtn: document.getElementById("transcend-btn"),
  transcendUpgrades: document.getElementById("transcend-upgrades"),

  eternalInfo: document.getElementById("eternal-info"),
  eternalBtn: document.getElementById("eternal-btn"),
  eternalUpgrades: document.getElementById("eternal-upgrades"),

  feedVoidBtn: document.getElementById("feed-void-btn"),
  saveBtn: document.getElementById("save-btn"),
  loadBtn: document.getElementById("load-btn"),
  wipeBtn: document.getElementById("wipe-btn"),

  log: document.getElementById("log")
};

// ---------- INIT ----------

function initState() {
  skillDefs.forEach(def => {
    if (!state.skills[def.id]) state.skills[def.id] = { level: 0, progress: 0 };
  });
  jobDefs.forEach(def => {
    if (!state.jobs[def.id]) state.jobs[def.id] = { level: 0, progress: 0 };
  });
  ascUpgradeDefs.forEach(def => {
    if (!state.ascUpgrades[def.id]) state.ascUpgrades[def.id] = 0;
  });
  transcendUpgradeDefs.forEach(def => {
    if (!state.transcendUpgrades[def.id]) state.transcendUpgrades[def.id] = 0;
  });
  eternalUpgradeDefs.forEach(def => {
    if (!state.eternalUpgrades[def.id]) state.eternalUpgrades[def.id] = 0;
  });
}

// ---------- UNLOCKS & MULTS ----------

function skillUnlocked(def) {
  if (!def.requires) return true;
  const req = state.skills[def.requires.skill];
  return req && req.level >= def.requires.level;
}

function jobUnlocked(def) {
  const req = state.skills[def.req.skill];
  return req && req.level >= def.req.level;
}

function totalSkillLevels() {
  return Object.values(state.skills).reduce((s, x) => s + x.level, 0);
}

function totalJobLevels() {
  return Object.values(state.jobs).reduce((s, x) => s + x.level, 0);
}

function getAscSpeedMult() {
  const lv = state.ascUpgrades.asc_speed || 0;
  return 1 + lv * 0.05;
}

function getAscSkillMult() {
  const lv = state.ascUpgrades.asc_skill_speed || 0;
  return 1 + lv * 0.05;
}

function getAscJobYieldMult() {
  const lv = state.ascUpgrades.asc_job_yield || 0;
  return 1 + lv * 0.05;
}

function getAscVoidPowerMult() {
  const lv = state.ascUpgrades.asc_void_power || 0;
  return 1 + lv * 0.01;
}

function getTranscendGlobalMult() {
  const lv = state.transcendUpgrades.tr_global || 0;
  return 1 + lv * 0.10;
}

function getTranscendAscGainMult() {
  const lv = state.transcendUpgrades.tr_asc_gain || 0;
  return 1 + lv * 0.20;
}

function getEternalGlobalMult() {
  const lv = state.eternalUpgrades.et_global || 0;
  return Math.pow(1 + 0.05, lv);
}

function getGlobalSpeedMult() {
  // Baseline +25% speed to keep things snappy
  return (
    1.25 *
    getAscSpeedMult() *
    getTranscendGlobalMult() *
    getEternalGlobalMult()
  );
}

function getVoidMult() {
  // Void Favor: 0.5% per favor, scaled by asc upgrade
  const base = 1 + state.voidFavor * 0.005 * getAscVoidPowerMult();
  return base;
}

// ---------- UI BUILD ----------

function createRow(def) {
  const row = document.createElement("div");
  row.className = "row";

  const left = document.createElement("div");
  left.style.flex = "1";

  const header = document.createElement("div");
  header.className = "row-header";

  const name = document.createElement("div");
  name.className = "row-name";
  name.textContent = def.name;

  const meta = document.createElement("div");
  meta.className = "row-meta";
  meta.textContent = "Lv 0";

  header.appendChild(name);
  header.appendChild(meta);

  const desc = document.createElement("div");
  desc.className = "row-desc";
  desc.textContent = def.effect || def.desc;

  const bar = document.createElement("div");
  bar.className = "bar-container";

  const fill = document.createElement("div");
  fill.className = "bar-fill";

  const label = document.createElement("div");
  label.className = "bar-label";
  label.textContent = "0%";

  bar.appendChild(fill);
  bar.appendChild(label);

  left.appendChild(header);
  left.appendChild(desc);
  left.appendChild(bar);

  const right = document.createElement("div");
  right.className = "row-right";

  const info = document.createElement("div");
  info.className = "small-label";
  info.textContent = "Lv 0";

  right.appendChild(info);

  row.appendChild(left);
  row.appendChild(right);

  row._meta = meta;
  row._fill = fill;
  row._label = label;
  row._info = info;

  return row;
}

function buildUI() {
  el.skills.innerHTML = "";
  el.jobs.innerHTML = "";
  el.voidActions.innerHTML = "";
  el.ascendUpgrades.innerHTML = "";
  el.transcendUpgrades.innerHTML = "";
  el.eternalUpgrades.innerHTML = "";

  // skills
  skillDefs.forEach(def => {
    const row = createRow(def);
    state.skills[def.id]._row = row;
    el.skills.appendChild(row);
  });

  // jobs
  jobDefs.forEach(def => {
    const row = createRow(def);
    state.jobs[def.id]._row = row;
    el.jobs.appendChild(row);
  });

  // void actions (simple: 10 dust -> 1 favor)
  const vRow = document.createElement("div");
  vRow.className = "row";
  const vLeft = document.createElement("div");
  vLeft.style.flex = "1";
  const vHeader = document.createElement("div");
  vHeader.className = "row-header";
  const vName = document.createElement("div");
  vName.className = "row-name";
  vName.textContent = "Dust Offering";
  const vMeta = document.createElement("div");
  vMeta.className = "row-meta";
  vMeta.textContent = "10 Dust → 1 Void Favor (improved by Void skills)";
  vHeader.appendChild(vName);
  vHeader.appendChild(vMeta);
  const vDesc = document.createElement("div");
  vDesc.className = "row-desc";
  vDesc.textContent = "Convert Dust into Void Favor. Affected by Void Sensitivity and Void Channeling.";
  vLeft.appendChild(vHeader);
  vLeft.appendChild(vDesc);
  vRow.appendChild(vLeft);
  el.voidActions.appendChild(vRow);

  // ascension upgrades
  ascUpgradeDefs.forEach(def => {
    const row = document.createElement("div");
    row.className = "asc-upgrade-row";
    const left = document.createElement("div");
    left.innerHTML = `<strong>${def.name}</strong><br><span style="color:var(--muted);font-size:0.75rem;">${def.desc}</span>`;
    const btn = document.createElement("button");
    btn.textContent = "Buy";
    btn.addEventListener("click", () => buyAscUpgrade(def.id));
    row._btn = btn;
    row._def = def;
    row.appendChild(left);
    row.appendChild(btn);
    el.ascendUpgrades.appendChild(row);
  });

  // transcendence upgrades
  transcendUpgradeDefs.forEach(def => {
    const row = document.createElement("div");
    row.className = "asc-upgrade-row";
    const left = document.createElement("div");
    left.innerHTML = `<strong>${def.name}</strong><br><span style="color:var(--muted);font-size:0.75rem;">${def.desc}</span>`;
    const btn = document.createElement("button");
    btn.textContent = "Buy";
    btn.addEventListener("click", () => buyTranscendUpgrade(def.id));
    row._btn = btn;
    row._def = def;
    row.appendChild(left);
    row.appendChild(btn);
    el.transcendUpgrades.appendChild(row);
  });

  // eternal upgrades
  eternalUpgradeDefs.forEach(def => {
    const row = document.createElement("div");
    row.className = "asc-upgrade-row";
    const left = document.createElement("div");
    left.innerHTML = `<strong>${def.name}</strong><br><span style="color:var(--muted);font-size:0.75rem;">${def.desc}</span>`;
    const btn = document.createElement("button");
    btn.textContent = "Buy";
    btn.addEventListener("click", () => buyEternalUpgrade(def.id));
    row._btn = btn;
    row._def = def;
    row.appendChild(left);
    row.appendChild(btn);
    el.eternalUpgrades.appendChild(row);
  });
}

// ---------- FLOATING TEXT & LOG ----------

function floatText(text, rect, color = "#a855f7") {
  if (!rect) return;
  const elFt = document.createElement("div");
  elFt.className = "floating-text";
  elFt.textContent = text;
  elFt.style.left = rect.left + rect.width / 2 + "px";
  elFt.style.top = rect.top + rect.height / 2 + "px";
  elFt.style.color = color;
  document.body.appendChild(elFt);
  requestAnimationFrame(() => {
    elFt.style.opacity = "1";
    elFt.style.transform = "translateY(-20px)";
  });
  setTimeout(() => elFt.remove(), 600);
}

function log(msg) {
  const line = document.createElement("div");
  line.textContent = msg;
  el.log.prepend(line);
}

// ---------- UNLOCKS ----------

function updateUnlocks() {
  if (!state.unlocks.jobs && state.skills.focus.level >= 1) {
    state.unlocks.jobs = true;
    document.querySelector('[data-tab="jobs"]').classList.remove("locked");
    log("You feel the pull of labor. Jobs unlocked.");
  }
  if (!state.unlocks.void && state.dust >= 20) {
    state.unlocks.void = true;
    document.querySelector('[data-tab="void"]').classList.remove("locked");
    log("The Void acknowledges your offerings. Void tab unlocked.");
  }

  const skillLv = totalSkillLevels();
  const jobLv = totalJobLevels();
  const vf = state.voidFavor;
  const canAscend = skillLv >= 160 && jobLv >= 80 && vf >= 200;
  if (!state.unlocks.ascend && canAscend) {
    state.unlocks.ascend = true;
    document.querySelector('[data-tab="ascend"]').classList.remove("locked");
    log("You glimpse a higher layer. Ascension unlocked.");
  }

  if (!state.unlocks.transcend && state.ascendantShards >= 20) {
    state.unlocks.transcend = true;
    document.querySelector('[data-tab="transcend"]').classList.remove("locked");
    log("You see beyond Ascension. Transcendence unlocked.");
  }

  if (!state.unlocks.eternal && state.transcendentEssence >= 10) {
    state.unlocks.eternal = true;
    document.querySelector('[data-tab="eternal"]').classList.remove("locked");
    log("You sense something truly endless. Eternal layer unlocked.");
  }
}

// ---------- TICK ----------

function tick(dt) {
  const speedMult = getGlobalSpeedMult();
  const voidMult = getVoidMult();
  const effectiveDt = dt * speedMult;

  state.time += dt;

  // SKILLS
  skillDefs.forEach(def => {
    const s = state.skills[def.id];
    if (!skillUnlocked(def)) return;
    if (s.progress === 0) s.progress = 0.0001;

    let duration = def.baseDuration * (1 + s.level * def.durationGrowth);

    // skill-based speed bonuses
    let skillSpeedBonus = 1;
    if (state.skills.focus.level > 0) skillSpeedBonus += state.skills.focus.level * 0.01;
    if (state.skills.meditation.level > 0) skillSpeedBonus += state.skills.meditation.level * 0.01;
    if (state.skills.breath_control.level > 0) skillSpeedBonus += state.skills.breath_control.level * 0.005;
    if (state.skills.endurance.level > 0) skillSpeedBonus += state.skills.endurance.level * 0.005;
    if (state.skills.pain_tolerance.level > 0) skillSpeedBonus += state.skills.pain_tolerance.level * 0.005;
    if (state.skills.time_perception.level > 0) skillSpeedBonus += state.skills.time_perception.level * 0.005;
    if (state.skills.parallel_thought.level > 0) skillSpeedBonus += state.skills.parallel_thought.level * 0.005;

    duration /= skillSpeedBonus;
    duration /= voidMult;
    duration /= getAscSkillMult();

    s.progress += effectiveDt / duration;

    if (s.progress >= 1) {
      s.level++;
      s.progress = 0.0001;
      if (s._row) floatText("LEVEL UP!", s._row.getBoundingClientRect());

      if (def.id === "memory_weaving") state.echoes += 1;
    }
  });

  // JOBS
  jobDefs.forEach(def => {
    const j = state.jobs[def.id];
    if (!jobUnlocked(def)) return;
    if (j.progress === 0) j.progress = 0.0001;

    let duration = def.baseDuration * (1 + j.level * def.durationGrowth);

    let jobSpeedBonus = 1;
    if (state.skills.void_resistance.level > 0) jobSpeedBonus += state.skills.void_resistance.level * 0.01;
    if (state.skills.dreamwalking.level > 0) jobSpeedBonus += state.skills.dreamwalking.level * 0.005;

    duration /= jobSpeedBonus;
    duration /= voidMult;

    j.progress += effectiveDt / duration;

    if (j.progress >= 1) {
      let baseReward = 1.5 + j.level * 0.6;

      // global resource gain boosts
      let resourceMult = 1;
      if (state.skills.void_binding.level > 0) resourceMult += state.skills.void_binding.level * 0.01;
      if (state.skills.reality_anchoring.level > 0) resourceMult += state.skills.reality_anchoring.level * 0.01;
      if (state.skills.entropy_shaping.level > 0 && def.resource === "entropicMass") resourceMult += state.skills.entropy_shaping.level * 0.02;
      if (state.skills.phase_stability.level > 0 && def.resource === "astralFibers") resourceMult += state.skills.phase_stability.level * 0.02;
      if (state.skills.mind_fracture.level > 0) resourceMult += state.skills.mind_fracture.level * 0.01;
      if (state.skills.self_replication.level > 0) resourceMult += state.skills.self_replication.level * 0.01;

      const reward =
        baseReward *
        resourceMult *
        voidMult *
        getAscJobYieldMult();

      state[def.resource] += reward;
      if (j._row) floatText("+" + reward.toFixed(0) + " " + def.resource, j._row.getBoundingClientRect());
      j.level++;
      j.progress = 0.0001;
    }
  });

  // AUTO VOID
  if (state.unlocks.void && el.autoVoid.checked) {
    const voidGainMult =
      1 +
      (state.skills.void_sense.level || 0) * 0.02 +
      (state.skills.void_channeling.level || 0) * 0.03;

    if (state.dust >= 10) {
      state.dust -= 10;
      const gain = 1 * voidGainMult;
      state.voidFavor += gain;
      floatText("+" + gain.toFixed(1) + " Void Favor", el.voidActions.getBoundingClientRect());
    }
  }

  updateUnlocks();
  updatePrestigeInfo();
  render();
}

// ---------- PRESTIGE INFO & BUTTONS ----------

function updatePrestigeInfo() {
  const skillLv = totalSkillLevels();
  const jobLv = totalJobLevels();
  const vf = state.voidFavor;

  const ascReq = { skills: 160, jobs: 80, favor: 200 };
  el.ascendInfo.textContent =
    `Ascend requires: Skill Levels ${skillLv}/${ascReq.skills}, ` +
    `Job Levels ${jobLv}/${ascReq.jobs}, Void Favor ${vf.toFixed(0)}/${ascReq.favor}.`;
  el.ascendBtn.disabled = !(skillLv >= ascReq.skills && jobLv >= ascReq.jobs && vf >= ascReq.favor);

  const trReqShards = 50;
  el.transcendInfo.textContent =
    `Transcend requires: Ascendant Shards ${state.ascendantShards}/${trReqShards}.`;
  el.transcendBtn.disabled = state.ascendantShards < trReqShards;

  const etReqEssence = 20;
  el.eternalInfo.textContent =
    `Eternal layer requires: Transcendent Essence ${state.transcendentEssence}/${etReqEssence}.`;
  el.eternalBtn.disabled = state.transcendentEssence < etReqEssence;

  Array.from(el.ascendUpgrades.children).forEach(row => {
    const def = row._def;
    const lv = state.ascUpgrades[def.id] || 0;
    const cost = Math.floor(def.baseCost * Math.pow(def.costMult, lv));
    row._btn.textContent = `Buy (${cost} Shards, Lv ${lv})`;
    row._btn.disabled = state.ascendantShards < cost;
  });

  Array.from(el.transcendUpgrades.children).forEach(row => {
    const def = row._def;
    const lv = state.transcendUpgrades[def.id] || 0;
    const cost = Math.floor(def.baseCost * Math.pow(def.costMult, lv));
    row._btn.textContent = `Buy (${cost} Essence, Lv ${lv})`;
    row._btn.disabled = state.transcendentEssence < cost;
  });

  Array.from(el.eternalUpgrades.children).forEach(row => {
    const def = row._def;
    const lv = state.eternalUpgrades[def.id] || 0;
    const cost = Math.floor(def.baseCost * Math.pow(def.costMult, lv));
    row._btn.textContent = `Buy (${cost} Embers, Lv ${lv})`;
    row._btn.disabled = state.eternalEmbers < cost;
  });
}

// ---------- PRESTIGE ACTIONS ----------

function doAscend() {
  const skillLv = totalSkillLevels();
  const jobLv = totalJobLevels();
  const vf = state.voidFavor;
  const ascReq = { skills: 160, jobs: 80, favor: 200 };
  if (skillLv < ascReq.skills || jobLv < ascReq.jobs || vf < ascReq.favor) return;

  const baseGain = (skillLv + jobLv) / 40 + vf / 200;
  const gain = Math.floor(baseGain * getTranscendAscGainMult());
  if (gain <= 0) return;

  state.ascendantShards += gain;
  log(`You ascend and gain ${gain} Ascendant Shards.`);

  state.dust = 0;
  state.fragments = 0;
  state.echoes = 0;
  state.cores = 0;
  state.sigils = 0;
  state.paradoxDust = 0;
  state.riftEnergy = 0;
  state.realityShards = 0;
  state.voidCrystals = 0;
  state.astralFibers = 0;
  state.entropicMass = 0;
  state.voidFavor = 0;

  Object.values(state.skills).forEach(s => {
    s.level = 0;
    s.progress = 0;
  });
  Object.values(state.jobs).forEach(j => {
    j.level = 0;
    j.progress = 0;
  });

  state.unlocks.jobs = false;
  state.unlocks.void = false;

  buildUI();
  updateUnlocks();
  updatePrestigeInfo();
  render();
}

function doTranscend() {
  const reqShards = 50;
  if (state.ascendantShards < reqShards) return;

  const gain = Math.floor(state.ascendantShards / 25);
  if (gain <= 0) return;

  state.transcendentEssence += gain;
  log(`Reality folds. You gain ${gain} Transcendent Essence.`);

  state.ascendantShards = 0;
  state.dust = 0;
  state.fragments = 0;
  state.echoes = 0;
  state.cores = 0;
  state.sigils = 0;
  state.paradoxDust = 0;
  state.riftEnergy = 0;
  state.realityShards = 0;
  state.voidCrystals = 0;
  state.astralFibers = 0;
  state.entropicMass = 0;
  state.voidFavor = 0;

  Object.values(state.skills).forEach(s => {
    s.level = 0;
    s.progress = 0;
  });
  Object.values(state.jobs).forEach(j => {
    j.level = 0;
    j.progress = 0;
  });

  state.unlocks.jobs = false;
  state.unlocks.void = false;
  state.unlocks.ascend = false;

  buildUI();
  updateUnlocks();
  updatePrestigeInfo();
  render();
}

function doEternal() {
  const reqEssence = 20;
  if (state.transcendentEssence < reqEssence) return;

  const gain = Math.floor(state.transcendentEssence / 10);
  if (gain <= 0) return;

  state.eternalEmbers += gain;
  log(`You step into eternity and gain ${gain} Eternal Embers.`);

  state.transcendentEssence = 0;
  state.ascendantShards = 0;

  state.dust = 0;
  state.fragments = 0;
  state.echoes = 0;
  state.cores = 0;
  state.sigils = 0;
  state.paradoxDust = 0;
  state.riftEnergy = 0;
  state.realityShards = 0;
  state.voidCrystals = 0;
  state.astralFibers = 0;
  state.entropicMass = 0;
  state.voidFavor = 0;

  Object.values(state.skills).forEach(s => {
    s.level = 0;
    s.progress = 0;
  });
  Object.values(state.jobs).forEach(j => {
    j.level = 0;
    j.progress = 0;
  });

  state.unlocks.jobs = false;
  state.unlocks.void = false;
  state.unlocks.ascend = false;
  state.unlocks.transcend = false;

  buildUI();
  updateUnlocks();
  updatePrestigeInfo();
  render();
}

// ---------- UPGRADE BUY ----------

function buyAscUpgrade(id) {
  const def = ascUpgradeDefs.find(x => x.id === id);
  if (!def) return;
  const lv = state.ascUpgrades[id] || 0;
  const cost = Math.floor(def.baseCost * Math.pow(def.costMult, lv));
  if (state.ascendantShards < cost) return;
  state.ascendantShards -= cost;
  state.ascUpgrades[id] = lv + 1;
  log(`Ascension upgrade purchased: ${def.name} Lv ${lv + 1}.`);
  updatePrestigeInfo();
}

function buyTranscendUpgrade(id) {
  const def = transcendUpgradeDefs.find(x => x.id === id);
  if (!def) return;
  const lv = state.transcendUpgrades[id] || 0;
  const cost = Math.floor(def.baseCost * Math.pow(def.costMult, lv));
  if (state.transcendentEssence < cost) return;
  state.transcendentEssence -= cost;
  state.transcendUpgrades[id] = lv + 1;
  log(`Transcendence upgrade purchased: ${def.name} Lv ${lv + 1}.`);
  updatePrestigeInfo();
}

function buyEternalUpgrade(id) {
  const def = eternalUpgradeDefs.find(x => x.id === id);
  if (!def) return;
  const lv = state.eternalUpgrades[id] || 0;
  const cost = Math.floor(def.baseCost * Math.pow(def.costMult, lv));
  if (state.eternalEmbers < cost) return;
  state.eternalEmbers -= cost;
  state.eternalUpgrades[id] = lv + 1;
  log(`Eternal upgrade purchased: ${def.name} Lv ${lv + 1}.`);
  updatePrestigeInfo();
}

// ---------- RENDER ----------

function render() {
  el.time.textContent = "t=" + Math.floor(state.time / 1000) + "s";

  el.dust.textContent = state.dust.toFixed(0);
  el.fragments.textContent = state.fragments.toFixed(0);
  el.echoes.textContent = state.echoes.toFixed(0);
  el.cores.textContent = state.cores.toFixed(0);
  el.sigils.textContent = state.sigils.toFixed(0);
  el.paradoxDust.textContent = state.paradoxDust.toFixed(0);
  el.riftEnergy.textContent = state.riftEnergy.toFixed(0);
  el.realityShards.textContent = state.realityShards.toFixed(0);
  el.voidCrystals.textContent = state.voidCrystals.toFixed(0);
  el.astralFibers.textContent = state.astralFibers.toFixed(0);
  el.entropicMass.textContent = state.entropicMass.toFixed(0);

  el.voidFavor.textContent = state.voidFavor.toFixed(1);
  el.voidMult.textContent = "x" + (getVoidMult() * getGlobalSpeedMult()).toFixed(2);

  el.shards.textContent = state.ascendantShards.toFixed(0);
  el.essence.textContent = state.transcendentEssence.toFixed(0);
  el.embers.textContent = state.eternalEmbers.toFixed(0);

  skillDefs.forEach(def => {
    const s = state.skills[def.id];
    const row = s._row;
    const unlocked = skillUnlocked(def);
    const pct = unlocked ? Math.min(1, s.progress) * 100 : 0;
    row._fill.style.width = pct + "%";
    row._label.textContent = unlocked ? pct.toFixed(0) + "%" : "Locked";
    row._meta.textContent = unlocked ? "Lv " + s.level : "Locked";
    row._info.textContent = "Lv " + s.level;
    row.style.opacity = unlocked ? "1" : "0.4";

    if (!unlocked) {
      if (def.requires) {
        row.title = `Requires ${def.requires.skill} Lv ${def.requires.level}`;
      } else {
        row.title = "Locked";
      }
    } else {
      row.title = "";
    }
  });

  jobDefs.forEach(def => {
    const j = state.jobs[def.id];
    const row = j._row;
    const unlocked = jobUnlocked(def);
    const pct = unlocked ? Math.min(1, j.progress) * 100 : 0;
    row._fill.style.width = pct + "%";
    row._label.textContent = unlocked ? pct.toFixed(0) + "%" : "Locked";
    row._meta.textContent = unlocked ? "Lv " + j.level : "Locked";
    row._info.textContent = "Lv " + j.level;
    row.style.opacity = unlocked ? "1" : "0.4";

    if (!unlocked) {
      row.title = `Requires ${def.req.skill} Lv ${def.req.level}`;
    } else {
      row.title = "";
    }
  });
}

// ---------- SAVE / LOAD ----------

function saveGame() {
  localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  log("Game saved.");
}

function loadGame() {
  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) return;
  const loaded = JSON.parse(raw);
  state = Object.assign({}, state, loaded);
  initState();
  buildUI();
  updateUnlocks();
  updatePrestigeInfo();
  render();
  log("Game loaded.");
}

function wipeGame() {
  localStorage.removeItem(SAVE_KEY);
  location.reload();
}

// ---------- TABS & BUTTONS ----------

function setupTabs() {
  const tabs = document.querySelectorAll(".tab-btn");
  const panels = {
    skills: document.getElementById("tab-skills"),
    jobs: document.getElementById("tab-jobs"),
    void: document.getElementById("tab-void"),
    ascend: document.getElementById("tab-ascend"),
    transcend: document.getElementById("tab-transcend"),
    eternal: document.getElementById("tab-eternal")
  };

  tabs.forEach(btn => {
    btn.addEventListener("click", () => {
      if (btn.classList.contains("locked")) return;
      const id = btn.dataset.tab;
      tabs.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      Object.values(panels).forEach(p => p.classList.remove("active"));
      panels[id].classList.add("active");
    });
  });
}

function setupButtons() {
  el.feedVoidBtn.addEventListener("click", () => {
    const gain = 1 * getGlobalSpeedMult();
    state.dust += gain;
    floatText("+" + gain.toFixed(0) + " Dust", el.feedVoidBtn.getBoundingClientRect());
  });

  el.saveBtn.addEventListener("click", saveGame);
  el.loadBtn.addEventListener("click", () => {
    loadGame();
  });
  el.wipeBtn.addEventListener("click", () => {
    if (confirm("Wipe save?")) wipeGame();
  });

  el.ascendBtn.addEventListener("click", () => {
    if (!el.ascendBtn.disabled && confirm("Ascend and reset this run?")) {
      doAscend();
    }
  });

  el.transcendBtn.addEventListener("click", () => {
    if (!el.transcendBtn.disabled && confirm("Transcend and reset deeper?")) {
      doTranscend();
    }
  });

  el.eternalBtn.addEventListener("click", () => {
    if (!el.eternalBtn.disabled && confirm("Enter Eternity and reset almost everything?")) {
      doEternal();
    }
  });
}

// ---------- MAIN LOOP ----------

function startLoop() {
  let last = performance.now();
  function frame(now) {
    const dt = now - last;
    last = now;
    tick(dt);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

// ---------- BOOT ----------

initState();
buildUI();
setupTabs();
setupButtons();
loadGame();
updateUnlocks();
updatePrestigeInfo();
render();
startLoop();
