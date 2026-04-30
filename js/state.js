/* ============================
   STATE — Core Game Data
   ============================ */

const state = {
  // Basic resources
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

  // Prestige resources
  voidFavor: 0,
  ascendantShards: 0,
  transcendentEssence: 0,
  eternalEmbers: 0,

  // Skills + Jobs
  skills: {},
  jobs: {},

  // Shop upgrades
  shop: {
    resource: {},
    void: {},
    ascend: {},
    transcend: {},
    eternal: {}
  },

  // Unlock flags
  unlocks: {
    void: false,
    shop: false,
    ascend: false,
    transcend: false,
    eternal: false
  }
};


/* ============================
   DEFINITIONS — Skills & Jobs
   ============================ */

const skillDefs = [
  {
    id: "memory_weaving",
    name: "Memory Weaving",
    baseDuration: 2000,
    durationGrowth: 0.05,
    unlock: () => true
  },
  {
    id: "dust_study",
    name: "Dust Study",
    baseDuration: 1500,
    durationGrowth: 0.04,
    unlock: () => true
  }
  // Add more skills here
];

const jobDefs = [
  {
    id: "dust_gatherer",
    name: "Dust Gatherer",
    resource: "dust",
    baseDuration: 2500,
    durationGrowth: 0.04,
    unlock: () => true
  },
  {
    id: "fragment_hunter",
    name: "Fragment Hunter",
    resource: "fragments",
    baseDuration: 3000,
    durationGrowth: 0.05,
    unlock: () => true
  }
  // Add more jobs here
];


/* ============================
   INITIALIZE SKILLS & JOBS
   ============================ */

function initState() {
  // Initialize skills
  skillDefs.forEach(def => {
    state.skills[def.id] = {
      level: 0,
      progress: 0
    };
  });

  // Initialize jobs
  jobDefs.forEach(def => {
    state.jobs[def.id] = {
      level: 0,
      progress: 0
    };
  });
}

initState();
