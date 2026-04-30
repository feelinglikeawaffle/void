/* ============================
   SKILLS — AUTO TRAINING SYSTEM
   ============================ */

if (!state.skills) {
  state.skills = {};
}

/* ----------------------------
   Ensure starting skill exists
   ---------------------------- */

function initSkills() {
  if (!state.skills.focus) {
    state.skills.focus = { level: 0, xp: 0 };
  }
}

/* ----------------------------
   XP Gain
   ---------------------------- */

function tickSkills(dt) {
  const seconds = dt / 1000;

  for (const id in state.skills) {
    const def = skillDefs[id];
    if (!def) continue;

    const skill = state.skills[id];

    // XP gain boosted by Focus
    const focusMult = skillDefs.focus.effect(state.skills.focus?.level || 0);

    skill.xp += seconds * focusMult;

    const needed = def.baseXp * Math.pow(def.xpGrowth, skill.level);

    if (skill.xp >= needed) {
      skill.xp -= needed;
      skill.level++;

      logMessage(`${def.name} reached level ${skill.level}.`);

      checkSkillUnlocks();
    }
  }
}

/* ----------------------------
   Unlock new skills
   ---------------------------- */

function checkSkillUnlocks() {
  for (const id in skillDefs) {
    if (state.skills[id]) continue;

    const def = skillDefs[id];
    if (!def.unlock) continue;

    const req = def.unlock;
    const have = state.skills[req.skill];

    if (have && have.level >= req.level) {
      state.skills[id] = { level: 0, xp: 0 };
      logMessage(`Unlocked new skill: ${def.name}`);
    }
  }
}

/* ----------------------------
   UI — Build
   ---------------------------- */

function buildSkillsUI() {
  el.skills.innerHTML = "";
}

/* ----------------------------
   UI — Render
   ---------------------------- */

function renderSkills() {
  const container = el.skills;
  container.innerHTML = "";

  for (const id in state.skills) {
    const def = skillDefs[id];
    const skill = state.skills[id];

    const row = document.createElement("div");
    row.className = "skill-row";

    const name = document.createElement("div");
    name.className = "skill-name";
    name.textContent = `${def.name} (Lv ${skill.level})`;
    row.appendChild(name);

    const desc = document.createElement("div");
    desc.className = "skill-level";
    desc.textContent = def.desc;
    row.appendChild(desc);

    const bar = document.createElement("div");
    bar.className = "skill-bar";

    const fill = document.createElement("div");
    fill.className = "skill-fill";

    const needed = def.baseXp * Math.pow(def.xpGrowth, skill.level);
    const pct = Math.min(100, (skill.xp / needed) * 100);

    fill.style.width = pct + "%";

    bar.appendChild(fill);
    row.appendChild(bar);

    container.appendChild(row);
  }
}
