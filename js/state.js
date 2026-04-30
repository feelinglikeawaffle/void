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
     ENTITIES (Jobs System)
     ============================ */
  entities: {
    list: [],            // hired entities
    hirePool: [],        // candidates in hire modal
    nextRefreshAt: 0,    // timestamp (performance.now) for next pool refresh
    hireCostMult: 1      // increases slightly per hire
  },

  /* ============================
     SKILLS (Auto-training)
     ============================ */
  skills: {
    // Only the starting skill is defined here.
    // Others are unlocked dynamically via skillDefs + checkSkillUnlocks.
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
