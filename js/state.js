/* ============================
   STATE — Core Game Data
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

  /* ============================
     ENTITIES (NEW JOB SYSTEM)
     ============================ */
  entities: {
    list: [],            // hired entities
    hirePool: [],        // 6 random entities to choose from
    nextRefreshAt: 0,    // timestamp for next refresh
    hireCostMult: 1      // increases by 5% per hire
  },

  /* ============================
     SKILLS (AUTO-TRAINING)
     ============================ */
  skills: {
    // Only starting skill is created here.
    // Others unlock dynamically.
    focus: { level: 0, xp: 0 }
  },

  /* ============================
     SHOP PURCHASES
     ============================ */
  shop: {
    resource: {},
    void: {},
    ascend: {},
    transcend: {},
    eternal: {}
  },

  /* ============================
     UNLOCK FLAGS
     ============================ */
  unlocks: {
    void: false,
    shop: false,
    ascend: false,
    transcend: false,
    eternal: false
  }
};
