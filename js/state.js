/* ============================
   GAME STATE
   ============================ */

const state = {
  resources: {
    dust: 0,
    void: 0,
    ascend: 0,
    transcend: 0,
    eternal: 0
  },

  entities: [],

  /* Hire pool */
  hire: {
    pool: [],
    timer: 300 // 5 minutes
  },

  /* Void Reactor */
  voidReactor: {
    charge: 0,
    maxCharge: 100,
    baseRate: 1,
    meltdownChance: 0.10
  }
};
