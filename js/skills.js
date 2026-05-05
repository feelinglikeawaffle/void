/* ============================
   SKILLS SYSTEM
   ============================ */

/* Initialize skill state */
function initSkills() {
  state.skills = state.skills || {};

  skillDefs.forEach(def => {
    if (!state.skills[def.id]) {
      state.skills[def.id] = {
        level: 0,
        xp: 0,
        unlocked: true,
        justLeveled: false
      };
    }
  });
}

/* XP needed for next level */
function getSkillXpToLevel(level) {
  return 10 * Math.pow(1.25, level);
}

/* Get skill state safely */
function getSkillState(id) {
  return state.skills[id];
}

/* Check unlocks (placeholder for future expansion) */
function checkSkillUnlocks() {
  // Add unlock logic later
}

/* Main skill tick */
function tickSkills(dt) {
  const seconds = dt / 1000;

  for (const id in state.skills) {
    const skill = state.skills[id];
    if (!skill.unlocked) continue;

    // Gain XP
    skill.xp += seconds;

    const needed = getSkillXpToLevel(skill.level);

    if (skill.xp >= needed) {
      skill.xp -= needed;
      skill.level++;
      skill.justLeveled = true;

      checkSkillUnlocks();
    }
  }
}
