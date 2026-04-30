/* ============================
   STATE — Core Game Data
   ============================ */


/* ----------------------------
   Base State
   ---------------------------- */

const state = {
  /* Resources (Dust-only jobs + refinery chain) */
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
  voidFavor: 0,

  /* Prestige resources */
  ascendantShards: 0,
  transcendentEssence: 0,
  eternalEmbers: 0,

  /* Global multipliers (base 1) */
  globalSpeedMult: 1,
  jobSpeedMult: 1,
  jobYieldMult: 1,
  refinerySpeedMult: 1,
  refineryEfficiencyMult: 1,
  voidGainMult: 1,
  allGainMult: 1,

  /* Skills (passive buffs) */
  skills: {
    dust_mastery: { level: 0, progress: 0 },
    refinery_insight: { level: 0, progress: 0 },
    temporal_focus: { level: 0, progress: 0 },
    void_attunement: { level: 0, progress: 0 },
    entropy_handling: { level: 0, progress: 0 }
  },

  /* Jobs / Entities (all produce Dust) */
  jobs: {
    dust_sweeper: { progress: 0 },
    dust_miner: { progress: 0 },
    dust_harvester: { progress: 0 },
    dust_extractor: { progress: 0 }
  },

  /* Shop ownership flags */
  shop: {
    resource: {},
    void: {},
    ascend: {},
    transcend: {},
    eternal: {}
  }
};


/* ----------------------------
   Skill Definitions
   ---------------------------- */

const skillDefs = [
  {
    id: "dust_mastery",
    name: "Dust Mastery",
    baseDuration: 5000,
    effectPerLevel: 0.05, // +5% job Dust yield per level
    applyLevelEffect() {
      state.jobYieldMult = 1 + this.effectPerLevel * state.skills.dust_mastery.level;
    }
  },
  {
    id: "refinery_insight",
    name: "Refinery Insight",
    baseDuration: 7000,
    effectPerLevel: 0.05, // +5% refinery speed per level
    applyLevelEffect() {
      state.refinerySpeedMult = 1 + this.effectPerLevel * state.skills.refinery_insight.level;
    }
  },
  {
    id: "temporal_focus",
    name: "Temporal Focus",
    baseDuration: 8000,
    effectPerLevel: 0.03, // +3% global speed per level
    applyLevelEffect() {
      state.globalSpeedMult = 1 + this.effectPerLevel * state.skills.temporal_focus.level;
    }
  },
  {
    id: "void_attunement",
    name: "Void Attunement",
    baseDuration: 9000,
    effectPerLevel: 0.05, // +5% Void Favor gain per level
    applyLevelEffect() {
      state.voidGainMult = 1 + this.effectPerLevel * state.skills.void_attunement.level;
    }
  },
  {
    id: "entropy_handling",
    name: "Entropy Handling",
    baseDuration: 10000,
    effectPerLevel: 0.05, // +5% refinery efficiency per level
    applyLevelEffect() {
      state.refineryEfficiencyMult =
        1 + this.effectPerLevel * state.skills.entropy_handling.level;
    }
  }
];


/* ----------------------------
   Job / Entity Definitions
   ---------------------------- */
/* All jobs produce Dust; they differ by duration and yield.
   These are your "entities" — think 1–100 Dust per cycle. */

const jobDefs = [
  {
    id: "dust_sweeper",
    name: "Dust Sweeper",
    baseDuration: 4000,
    baseYield: 1 // 1 Dust per cycle
  },
  {
    id: "dust_miner",
    name: "Dust Miner",
    baseDuration: 5000,
    baseYield: 5 // 5 Dust per cycle
  },
  {
    id: "dust_harvester",
    name: "Dust Harvester",
    baseDuration: 6000,
    baseYield: 20 // 20 Dust per cycle
  },
  {
    id: "dust_extractor",
    name: "Dust Extractor",
    baseDuration: 8000,
    baseYield: 100 // 100 Dust per cycle
  }
];


/* ----------------------------
   Refinery Chain Definition
   ---------------------------- */

const refineryChain = [
  { from: "dust", to: "fragments" },
  { from: "fragments", to: "echoes" },
  { from: "echoes", to: "cores" },
  { from: "cores", to: "sigils" },
  { from: "sigils", to: "paradoxDust" },
  { from: "paradoxDust", to: "riftEnergy" },
  { from: "riftEnergy", to: "realityShards" },
  { from: "realityShards", to: "voidCrystals" },
  { from: "voidCrystals", to: "astralFibers" },
  { from: "astralFibers", to: "entropicMass" },
  { from: "entropicMass", to: "voidFavor" }
];

/* Base conversion: 10:1, modified by refineryEfficiencyMult */
const BASE_REFINERY_RATIO = 10;
