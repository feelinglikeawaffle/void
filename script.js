// Feeding the Void — Massive Expansion + Full Shop System (PART 1/2)
// NOTE: Paste PART 2 immediately after this in the same file.

const SAVE_KEY = "void_game_massive_shop_v1";

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

  // prestige upgrades (finite tree)
  ascUpgrades: {},
  transcendUpgrades: {},
  eternalUpgrades: {},

  // SHOP upgrades (infinite)
  shop: {},

  // unlock flags
  unlocks: {
    jobs: false,
    void: false,
    shop: false,
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

// Ascension upgrades (finite tree)
const ascUpgradeDefs = [
  { id: "asc_speed", name: "Temporal Flow", desc: "+5% global speed per level.", baseCost: 1, costMult: 2, effectPerLevel: 0.05 },
  { id: "asc_job_yield", name: "Efficient Labor", desc: "+5% job yield per level.", baseCost: 1, costMult: 2, effectPerLevel: 0.05 },
  { id: "asc_skill_speed", name: "Focused Training", desc: "+5% skill speed per level.", baseCost: 1, costMult: 2, effectPerLevel: 0.05 },
  { id: "asc_void_power", name: "Void Authority", desc: "+1% Void Favor effect per level.", baseCost: 2, costMult: 2.5, effectPerLevel: 0.01 }
];

// Transcendence upgrades (finite tree)
const transcendUpgradeDefs = [
  { id: "tr_global", name: "Meta-Time", desc: "+10% global speed per level.", baseCost: 1, costMult: 3, effectPerLevel: 0.10 },
  { id: "tr_asc_gain", name: "Ascendant Echo", desc: "+20% Ascendant Shard gain per level.", baseCost: 2, costMult: 3, effectPerLevel: 0.20 }
];

// Eternal upgrades (finite tree)
const eternalUpgradeDefs = [
  { id: "et_global", name: "Eternal Momentum", desc: "+5% global speed per level (multiplicative).", baseCost: 1, costMult: 4, effectPerLevel: 0.05 }
];

// ---------- SHOP DEFINITIONS (INFINITE) ----------

// effectType keys:
// "job_yield", "core_gain", "skill_speed", "global_speed",
// "void_gain", "paradox_yield", "rift_speed", "reality_yield",
// "all_gain", "fiber_yield", "mass_yield"

const shopDefs = [
  // RESOURCE SHOP
  {
    id: "shop_dust_eff",
    name: "Dust Efficiency",
    section: "resource",
    resource: "dust",
    baseCost: 100,
    costMult: 1.25,
    effectPerLevel: 0.01,
    effectType: "job_yield",
    desc: "+1% job yield per level."
  },
  {
    id: "shop_frag_comp",
    name: "Fragment Compression",
    section: "resource",
    resource: "fragments",
    baseCost: 50,
    costMult: 1.22,
    effectPerLevel: 0.01,
    effectType: "core_gain",
    desc: "+1% Core production per level."
  },
  {
    id: "shop_echo_res",
    name: "Echo Resonance",
    section: "resource",
    resource: "echoes",
    baseCost: 25,
    costMult: 1.30,
    effectPerLevel: 0.01,
    effectType: "skill_speed",
    desc: "+1% skill speed per level."
  },
  {
    id: "shop_core_stab",
    name: "Core Stability",
    section: "resource",
    resource: "cores",
    baseCost: 10,
    costMult: 1.35,
    effectPerLevel: 0.01,
    effectType: "global_speed",
    desc: "+1% global speed per level."
  },
  {
    id: "shop_sigil_insight",
    name: "Sigil Insight",
    section: "resource",
    resource: "sigils",
    baseCost: 5,
    costMult: 1.40,
    effectPerLevel: 0.01,
    effectType: "void_gain",
    desc: "+1% Void Favor gain per level."
  },
  {
    id: "shop_paradox_eff",
    name: "Paradox Efficiency",
    section: "resource",
    resource: "paradoxDust",
    baseCost: 5,
    costMult: 1.45,
    effectPerLevel: 0.01,
    effectType: "paradox_yield",
    desc: "+1% Paradox Dust yield per level."
  },
  {
    id: "shop_rift_nav",
    name: "Rift Navigation",
    section: "resource",
    resource: "riftEnergy",
    baseCost: 3,
    costMult: 1.50,
    effectPerLevel: 0.01,
    effectType: "rift_speed",
    desc: "+1% Rift job speed per level."
  },
  {
    id: "shop_reality_comp",
    name: "Reality Compression",
    section: "resource",
    resource: "realityShards",
    baseCost: 2,
    costMult: 1.55,
    effectPerLevel: 0.01,
    effectType: "reality_yield",
    desc: "+1% Reality Shard yield per level."
  },
  {
    id: "shop_crystal_amp",
    name: "Crystal Amplification",
    section: "resource",
    resource: "voidCrystals",
    baseCost: 1,
    costMult: 1.60,
    effectPerLevel: 0.01,
    effectType: "all_gain",
    desc: "+1% all resource gain per level."
  },
  {
    id: "shop_fiber_weave",
    name: "Astral Weaving",
    section: "resource",
    resource: "astralFibers",
    baseCost: 1,
    costMult: 1.65,
    effectPerLevel: 0.01,
    effectType: "fiber_yield",
    desc: "+1% Astral Fiber yield per level."
  },
  {
    id: "shop_mass_mastery",
    name: "Entropy Mastery",
    section: "resource",
    resource: "entropicMass",
    baseCost: 1,
    costMult: 1.70,
    effectPerLevel: 0.01,
    effectType: "mass_yield",
    desc: "+1% Entropic Mass yield per level."
  },

  // VOID SHOP (Void Favor)
  {
    id: "shop_void_hunger",
    name: "Void Hunger",
    section: "void",
    resource: "voidFavor",
    baseCost: 10,
    costMult: 1.25,
    effectPerLevel: 0.01,
    effectType: "void_gain",
    desc: "+1% Void Favor gain per level."
  },
  {
    id: "shop_void_pressure",
    name: "Void Pressure",
    section: "void",
    resource: "voidFavor",
    baseCost: 20,
    costMult: 1.30,
    effectPerLevel: 0.01,
    effectType: "global_speed",
    desc: "+1% global speed per level."
  },
  {
    id: "shop_void_saturation",
    name: "Void Saturation",
    section: "void",
    resource: "voidFavor",
    baseCost: 15,
    costMult: 1.28,
    effectPerLevel: 0.01,
    effectType: "job_yield",
    desc: "+1% job yield per level."
  },
  {
    id: "shop_void_clarity",
    name: "Void Clarity",
    section: "void",
    resource: "voidFavor",
    baseCost: 15,
    costMult: 1.28,
    effectPerLevel: 0.01,
    effectType: "skill_speed",
    desc: "+1% skill speed per level."
  },

  // ASCENSION SHOP (Shards)
  {
    id: "shop_asc_flow",
    name: "Ascendant Flow",
    section: "ascend",
    resource: "ascendantShards",
    baseCost: 1,
    costMult: 1.5,
    effectPerLevel: 0.02,
    effectType: "global_speed",
    desc: "+2% global speed per level."
  },
  {
    id: "shop_asc_insight",
    name: "Ascendant Insight",
    section: "ascend",
    resource: "ascendantShards",
    baseCost: 1,
    costMult: 1.5,
    effectPerLevel: 0.02,
    effectType: "skill_speed",
    desc: "+2% skill speed per level."
  },
  {
    id: "shop_asc_industry",
    name: "Ascendant Industry",
    section: "ascend",
    resource: "ascendantShards",
    baseCost: 1,
    costMult: 1.5,
    effectPerLevel: 0.02,
    effectType: "job_yield",
    desc: "+2% job yield per level."
  },
  {
    id: "shop_asc_authority",
    name: "Ascendant Authority",
    section: "ascend",
    resource: "ascendantShards",
    baseCost: 2,
    costMult: 1.6,
    effectPerLevel: 0.01,
    effectType: "void_effect",
    desc: "+1% Void Favor effect per level."
  },

  // TRANSCENDENCE SHOP (Essence)
  {
    id: "shop_tr_meta_speed",
    name: "Meta-Speed",
    section: "transcend",
    resource: "transcendentEssence",
    baseCost: 1,
    costMult: 2.0,
    effectPerLevel: 0.05,
    effectType: "global_speed",
    desc: "+5% global speed per level."
  },
  {
    id: "shop_tr_meta_yield",
    name: "Meta-Yield",
    section: "transcend",
    resource: "transcendentEssence",
    baseCost: 1,
    costMult: 2.0,
    effectPerLevel: 0.05,
    effectType: "job_yield",
    desc: "+5% job yield per level."
  },
  {
    id: "shop_tr_meta_mind",
    name: "Meta-Mind",
    section: "transcend",
    resource: "transcendentEssence",
    baseCost: 1,
    costMult: 2.0,
    effectPerLevel: 0.05,
    effectType: "skill_speed",
    desc: "+5% skill speed per level."
  },
  {
    id: "shop_tr_meta_reality",
    name: "Meta-Reality",
    section: "transcend",
    resource: "transcendentEssence",
    baseCost: 2,
    costMult: 2.2,
    effectPerLevel: 0.05,
    effectType: "all_gain",
    desc: "+5% all resource gain per level."
  },

  // ETERNAL SHOP (Embers)
  {
    id: "shop_et_momentum",
    name: "Eternal Momentum",
    section: "eternal",
    resource: "eternalEmbers",
    baseCost: 1,
    costMult: 3.0,
    effectPerLevel: 0.05,
    effectType: "global_speed_mult",
    desc: "+5% global speed per level (multiplicative)."
  },
  {
    id: "shop_et_growth",
    name: "Eternal Growth",
    section: "eternal",
    resource: "eternalEmbers",
    baseCost: 1,
    costMult: 3.0,
    effectPerLevel: 0.05,
    effectType: "all_gain",
    desc: "+5% all resource gain per level."
  },
  {
    id: "shop_et_insight",
    name: "Eternal Insight",
    section: "eternal",
    resource: "eternalEmbers",
    baseCost: 1,
    costMult: 3.0,
    effectPerLevel: 0.05,
    effectType: "skill_speed",
    desc: "+5% skill speed per level."
  },
  {
    id: "shop_et_industry",
    name: "Eternal Industry",
    section: "eternal",
    resource: "eternalEmbers",
    baseCost: 1,
    costMult: 3.0,
    effectPerLevel: 0.05,
    effectType: "job_yield",
    desc: "+5% job yield per level."
  }
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

  // shop containers
  shopResource: document.getElementById("shop-resource"),
  shopVoid: document.getElementById("shop-void"),
  shopAscend: document.getElementById("shop-ascend"),
  shopTranscend: document.getElementById("shop-transcend"),
  shopEternal: document.getElementById("shop-eternal"),

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
  shopDefs.forEach(def => {
    if (!state.shop[def.id]) state.shop[def.id] = 0;
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

// ---------- SHOP EFFECT HELPERS ----------

function getShopBonus(type) {
  let total = 0;
  for (const id in state.shop) {
    const lv = state.shop[id] || 0;
    if (!lv) continue;
    const def = shopDefs.find(x => x.id === id);
    if (!def || def.effectType !== type) continue;
    total += lv * def.effectPerLevel;
  }
  return total;
}

function getShopMult(type) {
  // additive bonuses: 1 + sum
  const addTypes = [
    "job_yield",
    "core_gain",
    "skill_speed",
    "global_speed",
    "void_gain",
    "paradox_yield",
    "rift_speed",
    "reality_yield",
    "all_gain",
    "fiber_yield",
    "mass_yield",
    "void_effect"
  ];
  if (addTypes.includes(type)) {
    return 1 + getShopBonus(type);
  }
  // multiplicative global speed
  if (type === "global_speed_mult") {
    const bonus = getShopBonus(type);
    return Math.pow(1 + 0.05, bonus / 0.05); // each level is +5% multiplicative
  }
  return 1;
}

function getGlobalSpeedMult() {
  // Baseline +25% speed to keep things snappy
  return (
    1.25 *
    getAscSpeedMult() *
    getTranscendGlobalMult() *
    getEternalGlobalMult() *
    getShopMult("global_speed") *
    getShopMult("global_speed_mult")
  );
}

function getSkillSpeedMult() {
  return (
    getAscSkillMult() *
    getShopMult("skill_speed")
  );
}

function getJobYieldMult() {
  return (
    getAscJobYieldMult() *
    getShopMult("job_yield")
  );
}

function getAllGainMult() {
  return getShopMult("all_gain");
}

function getVoidGainMult() {
  return getShopMult("void_gain");
}

function getVoidEffectMult() {
  return 1 + getShopBonus("void_effect");
}

function getVoidMult() {
  // Void Favor: 0.5% per favor, scaled by asc upgrade + shop void_effect
  const base = 1 + state.voidFavor * 0.005 * getAscVoidPowerMult() * getVoidEffectMult();
  return base;
}

// ---------- UI BUILD HELPERS ----------

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

// ---------- BUILD MAIN UI (SKILLS / JOBS / VOID / PRESTIGE / SHOP) ----------

function buildUI() {
  el.skills.innerHTML = "";
  el.jobs.innerHTML = "";
  el.voidActions.innerHTML = "";
  el.ascendUpgrades.innerHTML = "";
  el.transcendUpgrades.innerHTML = "";
  el.eternalUpgrades.innerHTML = "";
  el.shopResource.innerHTML = "";
  el.shopVoid.innerHTML = "";
  el.shopAscend.innerHTML = "";
  el.shopTranscend.innerHTML = "";
  el.shopEternal.innerHTML = "";

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
  // void actions (simple: 10 dust -> 1 favor)
const vRow = document.createElement("div");
vRow.className = "row";

const vLeft = document.createElement("div");
vLeft.style.flex = "1";

const vHeader = document.createElement("div");
vHeader.className = "row-header";

const vName = document.createElement("div");
vName.className = "row-name";
vName.textContent = "Feed the Void (Dust)";

const vMeta = document.createElement("div");
vMeta.className = "row-meta";
vMeta.textContent = "10 Dust → 1 Void Favor";

vHeader.appendChild(vName);
vHeader.appendChild(vMeta);

const vDesc = document.createElement("div");
vDesc.className = "row-desc";
vDesc.textContent = "Offer Dust to the Void. Affected by Void skills & shop upgrades.";

vLeft.appendChild(vHeader);
vLeft.appendChild(vDesc);

const vRight = document.createElement("div");
vRight.className = "row-right";

const vBtn = document.createElement("button");
vBtn.textContent = "Feed";
vBtn.addEventListener("click", feedVoid);

vRight.appendChild(vBtn);

vRow.appendChild(vLeft);
vRow.appendChild(vRight);

el.voidActions.appendChild(vRow);


  // ascension upgrades (finite)
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

  // transcendence upgrades (finite)
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

  // eternal upgrades (finite)
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

  // SHOP UI
  buildShopUI();
}

// ---------- SHOP UI BUILD ----------

function buildShopUI() {
  shopDefs.forEach(def => {
    const row = document.createElement("div");
    row.className = "asc-upgrade-row";

    const left = document.createElement("div");
    left.innerHTML =
      `<strong>${def.name}</strong><br>` +
      `<span style="color:var(--muted);font-size:0.75rem;">${def.desc}</span>`;

    const btn = document.createElement("button");
    btn.textContent = "Buy";
    btn.addEventListener("click", () => buyShopUpgrade(def.id));

    row._btn = btn;
    row._def = def;

    row.appendChild(left);
    row.appendChild(btn);

    if (def.section === "resource") el.shopResource.appendChild(row);
    else if (def.section === "void") el.shopVoid.appendChild(row);
    else if (def.section === "ascend") el.shopAscend.appendChild(row);
    else if (def.section === "transcend") el.shopTranscend.appendChild(row);
    else if (def.section === "eternal") el.shopEternal.appendChild(row);
  });
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
  if (!state.unlocks.shop && (state.dust >= 50 || state.voidFavor >= 10)) {
    state.unlocks.shop = true;
    document.querySelector('[data-tab="shop"]').classList.remove("locked");
    log("A strange market appears. Shop unlocked.");
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

// ---------- PRESTIGE UPGRADE BUY ----------

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

// ---------- SHOP BUY LOGIC ----------

function getShopCost(def, level) {
  return def.baseCost * Math.pow(def.costMult, level);
}

function buyShopUpgrade(id) {
  const def = shopDefs.find(x => x.id === id);
  if (!def) return;
  const lv = state.shop[id] || 0;
  const cost = getShopCost(def, lv);

  const resName = def.resource;
  if (state[resName] === undefined) return;
  if (state[resName] < cost) return;

  state[resName] -= cost;
  state.shop[id] = lv + 1;
  log(`Shop purchase: ${def.name} Lv ${lv + 1}.`);
  updatePrestigeInfo(); // also updates shop button labels
}

// ---------- PRESTIGE INFO & SHOP BUTTON STATES ----------

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

  // finite prestige upgrade buttons
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

  // shop buttons
  const allShopRows = [
    ...el.shopResource.children,
    ...el.shopVoid.children,
    ...el.shopAscend.children,
    ...el.shopTranscend.children,
    ...el.shopEternal.children
  ];
  allShopRows.forEach(row => {
    const def = row._def;
    const lv = state.shop[def.id] || 0;
    const cost = getShopCost(def, lv);
    const resName = def.resource;
    const have = state[resName] || 0;
    row._btn.textContent = `Buy (${cost.toFixed(2)} ${resName}, Lv ${lv})`;
    row._btn.disabled = have < cost;

    // simple hover hint for locked layers
    if (def.section === "void" && !state.unlocks.void) {
      row.title = "Requires unlocking the Void tab.";
      row._btn.disabled = true;
    } else if (def.section === "ascend" && !state.unlocks.ascend) {
      row.title = "Requires unlocking Ascension.";
      row._btn.disabled = true;
    } else if (def.section === "transcend" && !state.unlocks.transcend) {
      row.title = "Requires unlocking Transcendence.";
      row._btn.disabled = true;
    } else if (def.section === "eternal" && !state.unlocks.eternal) {
      row.title = "Requires unlocking the Eternal layer.";
      row._btn.disabled = true;
    } else {
      row.title = "";
    }
  });
}

// ---------- END OF PART 1 ----------
// Paste PART 2 immediately after this.
/* ============================
   ========= PART 2A ==========
   ============================ */

/* ---------- SKILL & JOB TICK HELPERS ---------- */

function getSkillEffectiveDuration(def, level) {
  const base = def.baseDuration * Math.pow(1 + def.durationGrowth, level);
  const speed = getGlobalSpeedMult() * getSkillSpeedMult();
  return base / speed;
}

function getJobEffectiveDuration(def, level) {
  const base = def.baseDuration * Math.pow(1 + def.durationGrowth, level);
  const speed = getGlobalSpeedMult();
  return base / speed;
}

/* ---------- PRESTIGE ACTIONS ---------- */

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

  resetRun();
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

  resetRun();
  state.ascendantShards = 0;

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

  resetRun();
  state.ascendantShards = 0;
  state.transcendentEssence = 0;

  state.unlocks.jobs = false;
  state.unlocks.void = false;
  state.unlocks.ascend = false;
  state.unlocks.transcend = false;

  buildUI();
  updateUnlocks();
  updatePrestigeInfo();
  render();
}

/* ---------- RESET RUN ---------- */

function resetRun() {
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
}

/* ============================
   ===== END OF PART 2A =======
   ============================ */
/* ============================
   ======== PART 2B ===========
   ============================ */

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

  resetRun();
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

  resetRun();
  state.ascendantShards = 0;

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

  resetRun();
  state.ascendantShards = 0;
  state.transcendentEssence = 0;

  state.unlocks.jobs = false;
  state.unlocks.void = false;
  state.unlocks.ascend = false;
  state.unlocks.transcend = false;

  buildUI();
  updateUnlocks();
  updatePrestigeInfo();
  render();
}

function resetRun() {
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
}

/* ============================
   ===== END OF PART 2B =======
   ============================ */
/* ============================
   ========= PART 2C ==========
   ============================ */

/* ---------- TICK LOOP ---------- */

let lastTime = performance.now();

function tick() {
  const now = performance.now();
  const dt = now - lastTime;
  lastTime = now;

  const globalSpeed = getGlobalSpeedMult();
  const skillSpeed = getSkillSpeedMult();
  const jobYield = getJobYieldMult();
  const allGain = getAllGainMult();

  // SKILLS
  skillDefs.forEach(def => {
    const s = state.skills[def.id];
    if (!skillUnlocked(def)) return;

    const duration = def.baseDuration * Math.pow(1 + def.durationGrowth, s.level);
    const effective = duration / (globalSpeed * skillSpeed);

    s.progress += dt;
    if (s.progress >= effective) {
      s.progress -= effective;
      s.level++;

      // Echo bonus from Memory Weaving
      if (def.id === "memory_weaving") {
        state.echoes += 1 * allGain;
      }
    }
  });

  // JOBS
  jobDefs.forEach(def => {
    if (!jobUnlocked(def)) return;
    const j = state.jobs[def.id];

    const duration = def.baseDuration * Math.pow(1 + def.durationGrowth, j.level);
    const effective = duration / globalSpeed;

    j.progress += dt;
    if (j.progress >= effective) {
      j.progress -= effective;
      j.level++;

      const baseGain = 1 * jobYield * allGain;
      state[def.resource] += baseGain;
    }
  });

  // AUTO-FEED VOID
  if (el.autoVoid.checked && state.dust >= 10) {
    feedVoid();
  }

  updateUnlocks();
  updatePrestigeInfo();
  render();

  requestAnimationFrame(tick);
}

/* ---------- VOID FEED ---------- */

function feedVoid() {
  if (state.dust < 10) return;
  state.dust -= 10;

  const gain = 1 * getVoidGainMult();
  state.voidFavor += gain;

  const rect = el.feedVoidBtn.getBoundingClientRect();
  floatText(`+${gain.toFixed(1)} VF`, rect, "#8b5cf6");
}

/* ---------- RENDER ---------- */

function render() {
  el.time.textContent = `t=${Math.floor(state.time)}s`;

  el.dust.textContent = Math.floor(state.dust);
  el.fragments.textContent = Math.floor(state.fragments);
  el.echoes.textContent = Math.floor(state.echoes);
  el.cores.textContent = Math.floor(state.cores);
  el.sigils.textContent = Math.floor(state.sigils);
  el.paradoxDust.textContent = Math.floor(state.paradoxDust);
  el.riftEnergy.textContent = Math.floor(state.riftEnergy);
  el.realityShards.textContent = Math.floor(state.realityShards);
  el.voidCrystals.textContent = Math.floor(state.voidCrystals);
  el.astralFibers.textContent = Math.floor(state.astralFibers);
  el.entropicMass.textContent = Math.floor(state.entropicMass);

  el.voidFavor.textContent = state.voidFavor.toFixed(1);
  el.voidMult.textContent = `x${getVoidMult().toFixed(2)}`;

  el.shards.textContent = state.ascendantShards;
  el.essence.textContent = state.transcendentEssence;
  el.embers.textContent = state.eternalEmbers;

  // SKILL BARS
  skillDefs.forEach(def => {
    const s = state.skills[def.id];
    const row = s._row;
    if (!row) return;

    const unlocked = skillUnlocked(def);
    row.style.opacity = unlocked ? "1" : "0.3";

    const duration = def.baseDuration * Math.pow(1 + def.durationGrowth, s.level);
    const effective = duration / (getGlobalSpeedMult() * getSkillSpeedMult());
    const pct = Math.min(100, (s.progress / effective) * 100);

    row._fill.style.width = pct + "%";
    row._label.textContent = pct.toFixed(0) + "%";
    row._meta.textContent = `Lv ${s.level}`;
    row._info.textContent = `Lv ${s.level}`;
  });

  // JOB BARS
  jobDefs.forEach(def => {
    const j = state.jobs[def.id];
    const row = j._row;
    if (!row) return;

    const unlocked = jobUnlocked(def);
    row.style.opacity = unlocked ? "1" : "0.3";

    const duration = def.baseDuration * Math.pow(1 + def.durationGrowth, j.level);
    const effective = duration / getGlobalSpeedMult();
    const pct = Math.min(100, (j.progress / effective) * 100);

    row._fill.style.width = pct + "%";
    row._label.textContent = pct.toFixed(0) + "%";
    row._meta.textContent = `Lv ${j.level}`;
    row._info.textContent = `Lv ${j.level}`;
  });
}

/* ---------- SAVE / LOAD ---------- */

function saveGame() {
  localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  log("Game saved.");
}

function loadGame() {
  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) return;
  try {
    const data = JSON.parse(raw);
    Object.assign(state, data);
    initState();
    buildUI();
    updateUnlocks();
    updatePrestigeInfo();
    render();
    log("Game loaded.");
  } catch (e) {
    console.error(e);
    log("Save corrupted.");
  }
}

function wipeSave() {
  localStorage.removeItem(SAVE_KEY);
  location.reload();
}

/* ---------- TABS ---------- */

document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const tab = btn.dataset.tab;
    if (btn.classList.contains("locked")) return;

    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    document.getElementById(`tab-${tab}`).classList.add("active");
  });
});

/* ---------- BUTTONS ---------- */

el.feedVoidBtn.addEventListener("click", feedVoid);
el.ascendBtn.addEventListener("click", doAscend);
el.transcendBtn.addEventListener("click", doTranscend);
el.eternalBtn.addEventListener("click", doEternal);

el.saveBtn.addEventListener("click", saveGame);
el.loadBtn.addEventListener("click", loadGame);
el.wipeBtn.addEventListener("click", wipeSave);

/* ---------- BOOT ---------- */

initState();
buildUI();
loadGame();
updateUnlocks();
updatePrestigeInfo();
render();

requestAnimationFrame(tick);

/* ============================
   ===== END OF PART 2C =======
   ============================ */
