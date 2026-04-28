// Feeding the Void — Large Expansion
// PK-style: bar fills → level up → next bar takes longer

const SAVE_KEY = "void_game_massive_v1";

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

// Slower progression: baseDuration ~ 16–40s, durationGrowth ~ 0.28–0.45

const skillDefs = [
  // Mind / Body
  { id: "focus", name: "Focus", desc: "Sharpen your mind.", baseDuration: 16000, durationGrowth: 0.30, requires: null },
  { id: "meditation", name: "Meditation", desc: "Stillness reveals truth.", baseDuration: 20000, durationGrowth: 0.32, requires: { skill: "focus", level: 5 } },
  { id: "breath_control", name: "Breath Control", desc: "Control the rhythm of life.", baseDuration: 22000, durationGrowth: 0.30, requires: { skill: "focus", level: 8 } },
  { id: "endurance", name: "Endurance", desc: "Hold on longer.", baseDuration: 24000, durationGrowth: 0.32, requires: { skill: "breath_control", level: 5 } },
  { id: "pain_tolerance", name: "Pain Tolerance", desc: "Ignore the screaming.", baseDuration: 26000, durationGrowth: 0.34, requires: { skill: "endurance", level: 5 } },

  // Void
  { id: "void_sense", name: "Void Sensitivity", desc: "Feel the pull of the Void.", baseDuration: 22000, durationGrowth: 0.32, requires: { skill: "focus", level: 3 } },
  { id: "void_channeling", name: "Void Channeling", desc: "Let the Void flow through you.", baseDuration: 26000, durationGrowth: 0.34, requires: { skill: "void_sense", level: 6 } },
  { id: "void_binding", name: "Void Binding", desc: "Anchor fragments to the Void.", baseDuration: 28000, durationGrowth: 0.36, requires: { skill: "void_channeling", level: 6 } },
  { id: "void_resistance", name: "Void Resistance", desc: "Survive the pressure.", baseDuration: 30000, durationGrowth: 0.38, requires: { skill: "void_binding", level: 6 } },

  // Meta / Time
  { id: "memory_weaving", name: "Memory Weaving", desc: "Bind thoughts into patterns.", baseDuration: 24000, durationGrowth: 0.34, requires: { skill: "meditation", level: 6 } },
  { id: "time_perception", name: "Time Perception", desc: "Stretch and compress moments.", baseDuration: 26000, durationGrowth: 0.36, requires: { skill: "memory_weaving", level: 6 } },
  { id: "parallel_thought", name: "Parallel Thought", desc: "Think in multiple directions.", baseDuration: 28000, durationGrowth: 0.38, requires: { skill: "time_perception", level: 6 } },
  { id: "reality_anchoring", name: "Reality Anchoring", desc: "Stay intact near the Void.", baseDuration: 32000, durationGrowth: 0.40, requires: { skill: "void_resistance", level: 6 } },

  // Weird / Deep
  { id: "dreamwalking", name: "Dreamwalking", desc: "Walk through other minds.", baseDuration: 26000, durationGrowth: 0.36, requires: { skill: "memory_weaving", level: 10 } },
  { id: "rift_peering", name: "Rift Peering", desc: "Look between realities.", baseDuration: 30000, durationGrowth: 0.38, requires: { skill: "void_binding", level: 10 } },
  { id: "entropy_shaping", name: "Entropy Shaping", desc: "Nudge decay into patterns.", baseDuration: 32000, durationGrowth: 0.40, requires: { skill: "time_perception", level: 10 } },
  { id: "phase_stability", name: "Phase Stability", desc: "Keep your form coherent.", baseDuration: 34000, durationGrowth: 0.42, requires: { skill: "reality_anchoring", level: 10 } },
  { id: "mind_fracture", name: "Mind Fracture", desc: "Split yourself into shards.", baseDuration: 36000, durationGrowth: 0.44, requires: { skill: "parallel_thought", level: 12 } },
  { id: "self_replication", name: "Self-Replication Theory", desc: "Imagine copies of yourself.", baseDuration: 38000, durationGrowth: 0.45, requires: { skill: "mind_fracture", level: 8 } }
];

const jobDefs = [
  // Tier 1
  { id: "dust_gatherer", name: "Dust Gatherer", desc: "Collect cosmic dust.", baseDuration: 18000, durationGrowth: 0.30, resource: "dust", req: { skill: "focus", level: 1 } },
  { id: "fragment_sifter", name: "Fragment Sifter", desc: "Sort broken realities.", baseDuration: 22000, durationGrowth: 0.32, resource: "fragments", req: { skill: "void_sense", level: 2 } },
  { id: "echo_listener", name: "Echo Listener", desc: "Listen to lingering thoughts.", baseDuration: 22000, durationGrowth: 0.32, resource: "echoes", req: { skill: "memory_weaving", level: 3 } },
  { id: "rift_sweeper", name: "Rift Sweeper", desc: "Clean up unstable rifts.", baseDuration: 24000, durationGrowth: 0.34, resource: "paradoxDust", req: { skill: "rift_peering", level: 2 } },
  { id: "void_janitor", name: "Void Janitor", desc: "Mop up metaphysical spills.", baseDuration: 26000, durationGrowth: 0.34, resource: "dust", req: { skill: "void_resistance", level: 2 } },

  // Tier 2
  { id: "core_compressor", name: "Core Compressor", desc: "Compress fragments into cores.", baseDuration: 26000, durationGrowth: 0.36, resource: "cores", req: { skill: "void_binding", level: 4 } },
  { id: "sigil_engraver", name: "Sigil Engraver", desc: "Carve meaning into sigils.", baseDuration: 28000, durationGrowth: 0.38, resource: "sigils", req: { skill: "time_perception", level: 4 } },
  { id: "entropy_collector", name: "Entropy Collector", desc: "Harvest decay itself.", baseDuration: 30000, durationGrowth: 0.40, resource: "entropicMass", req: { skill: "entropy_shaping", level: 3 } },
  { id: "thread_weaver", name: "Thread Weaver", desc: "Weave astral fibers.", baseDuration: 30000, durationGrowth: 0.40, resource: "astralFibers", req: { skill: "phase_stability", level: 3 } },
  { id: "dream_archivist", name: "Dream Archivist", desc: "File away dreams.", baseDuration: 28000, durationGrowth: 0.38, resource: "echoes", req: { skill: "dreamwalking", level: 4 } },

  // Tier 3
  { id: "rift_navigator", name: "Rift Navigator", desc: "Chart safe paths.", baseDuration: 32000, durationGrowth: 0.42, resource: "riftEnergy", req: { skill: "rift_peering", level: 6 } },
  { id: "reality_auditor", name: "Reality Auditor", desc: "Check for inconsistencies.", baseDuration: 34000, durationGrowth: 0.44, resource: "realityShards", req: { skill: "reality_anchoring", level: 6 } },
  { id: "paradox_handler", name: "Paradox Handler", desc: "Contain paradoxes.", baseDuration: 36000, durationGrowth: 0.45, resource: "paradoxDust", req: { skill: "mind_fracture", level: 4 } },
  { id: "void_harvester", name: "Void Harvester", desc: "Extract pure Void crystals.", baseDuration: 38000, durationGrowth: 0.45, resource: "voidCrystals", req: { skill: "void_channeling", level: 10 } },
  { id: "ascendant_scribe", name: "Ascendant Scribe", desc: "Record impossible events.", baseDuration: 38000, durationGrowth: 0.45, resource: "realityShards", req: { skill: "self_replication", level: 4 } }
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
  const lv = state.ascUpgrades.asc_skill_speed || state.ascUpgrades.asc_skill_speed; // fallback
  const real = state.ascUpgrades.asc_skill_speed || 0;
  return 1 + real * 0.05;
}

function getAscJobYieldMult() {
  const lv = state.ascUpgrades.asc_job_yield || state.ascUpgrades.asc_job_yield;
  const real = state.ascUpgrades.asc_job_yield || 0;
  return 1 + real * 0.05;
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
  return (
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
  desc.textContent = def.desc;

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
  vMeta.textContent = "10 Dust → 1 Void Favor";
  vHeader.appendChild(vName);
  vHeader.appendChild(vMeta);
  const vDesc = document.createElement("div");
  vDesc.className = "row-desc";
  vDesc.textContent = "Feed the Void to grow its influence.";
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
    el.transcendUpgrades.appendChild(row);
    row.appendChild(left);
    row.appendChild(btn);
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
    el.eternalUpgrades.appendChild(row);
    row.appendChild(left);
    row.appendChild(btn);
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

  // Ascension: target ~1h, but we just gate by totals
  const skillLv = totalSkillLevels();
  const jobLv = totalJobLevels();
  const vf = state.voidFavor;
  const canAscend = skillLv >= 160 && jobLv >= 80 && vf >= 200;
  if (!state.unlocks.ascend && canAscend) {
    state.unlocks.ascend = true;
    document.querySelector('[data-tab="ascend"]').classList.remove("locked");
    log("You glimpse a higher layer. Ascension unlocked.");
  }

  // Transcendence: after some Ascendant Shards
  if (!state.unlocks.transcend && state.ascendantShards >= 20) {
    state.unlocks.transcend = true;
    document.querySelector('[data-tab="transcend"]').classList.remove("locked");
    log("You see beyond Ascension. Transcendence unlocked.");
  }

  // Eternal: after some Essence
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
    if (s.level >= 50) duration *= 1.5;
    if (s.level >= 100) duration *= 2;

    duration /= voidMult;
    duration /= (1 + (state.ascUpgrades.asc_skill_speed || 0) * 0.05);

    s.progress += effectiveDt / duration;

    if (s.progress >= 1) {
      s.level++;
      s.progress = 0.0001;
      if (s._row) floatText("LEVEL UP!", s._row.getBoundingClientRect());

      // small flavor: memory_weaving gives echoes
      if (def.id === "memory_weaving") state.echoes += 1;
    }
  });

  // JOBS
  jobDefs.forEach(def => {
    const j = state.jobs[def.id];
    if (!jobUnlocked(def)) return;
    if (j.progress === 0) j.progress = 0.0001;

    let duration = def.baseDuration * (1 + j.level * def.durationGrowth);
    if (j.level >= 50) duration *= 1.5;
    if (j.level >= 100) duration *= 2;

    duration /= voidMult;

    j.progress += effectiveDt / duration;

    if (j.progress >= 1) {
      const baseReward = 1 + j.level * 0.4;
      const reward =
        baseReward *
        voidMult *
        (1 + (state.ascUpgrades.asc_job_yield || 0) * 0.05);

      state[def.resource] += reward;
      if (j._row) floatText("+" + reward.toFixed(0) + " " + def.resource, j._row.getBoundingClientRect());
      j.level++;
      j.progress = 0.0001;
    }
  });

  // AUTO VOID
  if (state.unlocks.void && el.autoVoid.checked) {
    if (state.dust >= 10) {
      state.dust -= 10;
      state.voidFavor += 1;
      floatText("+1 Void Favor", el.voidActions.getBoundingClientRect());
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
    `Job Levels ${jobLv}/${ascReq.jobs}, Void Favor ${vf}/${ascReq.favor}.`;
  el.ascendBtn.disabled = !(skillLv >= ascReq.skills && jobLv >= ascReq.jobs && vf >= ascReq.favor);

  const trReqShards = 50;
  el.transcendInfo.textContent =
    `Transcend requires: Ascendant Shards ${state.ascendantShards}/${trReqShards}.`;
  el.transcendBtn.disabled = state.ascendantShards < trReqShards;

  const etReqEssence = 20;
  el.eternalInfo.textContent =
    `Eternal layer requires: Transcendent Essence ${state.transcendentEssence}/${etReqEssence}.`;
  el.eternalBtn.disabled = state.transcendentEssence < etReqEssence;

  // update upgrade buttons costs
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

  // reset basic resources & levels, keep prestige
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
  // ascend/transcend/eternal unlock flags remain once unlocked

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

  // Hard reset except transcend/eternal currencies & upgrades
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
  // transcend & eternal flags stay once unlocked

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

  // Almost full wipe, keep only embers & eternal upgrades
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
  // eternal stays

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

  el.voidFavor.textContent = state.voidFavor.toFixed(0);
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
