/* ============================
   STATE — Game Data
   ============================ */

const state = {
  /* ----- Core Resources ----- */
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

  /* ----- Void Tier ----- */
  voidFavor: 0,
  voidGainMult: 1,

  /* ----- Prestige Resources ----- */
  ascendantShards: 0,
  transcendentEssence: 0,
  eternalEmbers: 0,

  /* ----- Multipliers ----- */
  globalSpeedMult: 1,
  jobSpeedMult: 1,
  jobYieldMult: 1,
  refinerySpeedMult: 1,
  refineryEfficiencyMult: 1,

  /* ----- Jobs / Entities ----- */
  jobs: {
    worker: { progress: 0 },
    miner: { progress: 0 },
    harvester: { progress: 0 }
  },

  /* ----- Skills ----- */
  skills: {
    efficiency: { level: 0, progress: 0 },
    focus: { level: 0, progress: 0 },
    insight: { level: 0, progress: 0 }
  },

  /* ----- Shop Purchases ----- */
  shop: {
    resource: {},
    void: {},
    ascend: {},
    transcend: {},
    eternal: {}
  }
};
