/* ============================
   SKILLS LOGIC
   ============================ */

if (!state.skills) {
  state.skills = skillDefs.map(def => ({
    id: def.id,
    level: 0,
    xp: 0,
    unlocked: !!def.unlockedByDefault,
    justLeveled: false
  }));
}

function getSkillState(id) {
  return state.skills.find(s => s.id === id);
}

function getSkillDef(id) {
  return skillDefs.find(s => s.id === id);
}

function canUnlockSkill(def) {
  if (!def.unlockReq) return true;

  if (def.unlockReq.type === "resource") {
    const res = def.unlockReq.resource;
    const amt = def.unlockReq.amount;
    return (state.resources[res] || 0) >= amt;
  }

  return false;
}

function tryUnlockSkills() {
  skillDefs.forEach(def => {
    const skill = getSkillState(def.id);
    if (!skill.unlocked && canUnlockSkill(def)) {
      skill.unlocked = true;
    }
  });
}

function tickSkills(dt) {
  const seconds = dt / 1000;

  for (const id in state.skills) {
    const def = skillDefs[id];
    if (!def) continue;

    const skill = state.skills[id];

    // XP gain
    skill.xp += seconds;

    const needed = def.baseXp * Math.pow(def.xpGrowth, skill.level);

    if (skill.xp >= needed) {
      skill.xp -= needed;
      skill.level++;
      skill.justLeveled = true;

      checkSkillUnlocks();
    }
  }
}


function getSkillXpToLevel(level) {
  return 10 * Math.pow(1.5, level);
}
