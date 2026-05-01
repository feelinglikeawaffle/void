/* ============================
   SKILLS LOGIC
   ============================ */

if (!state.skills) {
  state.skills = skillDefs.map(def => ({
    id: def.id,
    level: 0,
    xp: 0,
    unlocked: !!def.unlockedByDefault
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

  tryUnlockSkills();

  state.skills.forEach(skill => {
    if (!skill.unlocked) return;

    const def = getSkillDef(skill.id);
    const xpGain = def.baseXpPerSecond * seconds * state.multipliers.skillXp;
    skill.xp += xpGain;

    const needed = getSkillXpToLevel(skill.level);
    if (skill.xp >= needed) {
      skill.xp -= needed;
      skill.level++;
    }
  });
}

function getSkillXpToLevel(level) {
  return 10 * Math.pow(1.5, level);
}
