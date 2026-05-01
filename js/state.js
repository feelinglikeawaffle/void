/* ============================
   GLOBAL STATE
   ============================ */

const state = {
  resources: {
    dust: 0,
    void: 0,
    ascend: 0,
    transcend: 0,
    eternal: 0
  },

  multipliers: {
    skillXp: 1,
    voidGain: 1,
    entitySpeed: 1 // global speed multiplier for entities
  },

  // Owned entities (you can expand or randomize later)
  entities: [
    {
      id: "worker_1",
      name: "Dust Gatherer",
      star: 0,           // 0–7
      baseDust: 1,       // dust per cycle before multipliers
      efficiency: 1,     // multiplier on dust
      speed: 1,          // 1.0 = base speed
      luck: 1,           // reserved for future crit/bonus
      progress: 0        // 0–1 progress toward next cycle
    }
  ]
};
