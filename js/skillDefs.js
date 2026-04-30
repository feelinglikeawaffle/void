/* ============================
   SKILL DEFINITIONS
   ============================ */

const skillDefs = {
  /* ----------------------------
     STARTING SKILL
     ---------------------------- */
  focus: {
    id: "focus",
    name: "Focus",
    desc: "Increases skill XP gain.",
    baseXp: 10,
    xpGrowth: 1.25,
    effect(level) {
      return 1 + level * 0.05;   // +5% XP gain per level
    },
    unlock: null
  },

  /* ----------------------------
     UNLOCKS AT FOCUS LV 5
     ---------------------------- */
  efficiency: {
    id: "efficiency",
    name: "Efficiency",
    desc: "Increases entity dust production.",
    baseXp: 25,
    xpGrowth: 1.30,
    effect(level) {
      return 1 + level * 0.03;   // +3% entity yield per level
    },
    unlock: { skill: "focus", level: 5 }
  },

  /* ----------------------------
     UNLOCKS AT EFFICIENCY LV 10
     ---------------------------- */
  insight: {
    id: "insight",
    name: "Insight",
    desc: "Increases refinery speed.",
    baseXp: 50,
    xpGrowth: 1.35,
    effect(level) {
      return 1 + level * 0.04;   // +4% refinery speed per level
    },
    unlock: { skill: "efficiency", level: 10 }
  },

  /* ----------------------------
     UNLOCKS AT INSIGHT LV 20
     ---------------------------- */
  momentum: {
    id: "momentum",
    name: "Momentum",
    desc: "Increases global speed.",
    baseXp: 100,
    xpGrowth: 1.40,
    effect(level) {
      return 1 + level * 0.02;   // +2% global speed per level
    },
    unlock: { skill: "insight", level: 20 }
  },

  /* ----------------------------
     UNLOCKS AT MOMENTUM LV 30
     ---------------------------- */
  automation: {
    id: "automation",
    name: "Automation",
    desc: "Reduces entity hire cost inflation.",
    baseXp: 200,
    xpGrowth: 1.45,
    effect(level) {
      return 1 - Math.min(0.5, level * 0.01);  // up to -50% inflation
    },
    unlock: { skill: "momentum", level: 30 }
  }
};
