/* ============================
   SKILLS — Logic & UI
   ============================ */


/* ----------------------------
   Build Skills UI
   ---------------------------- */

function buildSkillsUI() {
  el.skills.innerHTML = "";

  skillDefs.forEach(def => {
    if (!skillUnlocked(def)) return;

    const s = state.skills[def.id];

    const row = document.createElement("div");
    row.className = "skill-row";

    const name = document.createElement("div");
    name.className = "skill-name";
    name.textContent = def.name;

    const level = document.createElement("div");
    level.className = "skill-level";
    level.textContent = "Lv " + s.level;

    const bar = document.createElement("div");
    bar.className = "skill-bar";

    const fill = document.createElement("div");
    fill.className = "skill-fill";
    fill.style.width = "0%";

    bar.appendChild(fill);

    row.appendChild(name);
    row.appendChild(level);
    row.appendChild(bar);

    // Store reference for rendering
    s._ui = { level, fill };

    el.skills.appendChild(row);
  });
}


/* ----------------------------
   Skill Tick Logic
   ---------------------------- */

function tickSkills(dt) {
  const globalSpeed = getGlobalSpeedMult();
  const skillSpeed = getSkillSpeedMult();
  const allGain = getAllGainMult();

  skillDefs.forEach(def => {
    if (!skillUnlocked(def)) return;

    const s = state.skills[def.id];

    const duration = def.baseDuration * Math.pow(1 + def.durationGrowth, s.level);
    const effective = duration / (globalSpeed * skillSpeed);

    s.progress += dt;

    if (s.progress >= effective) {
      s.progress -= effective;
      s.level++;

      // Special effect: Memory Weaving gives Echoes
      if (def.id === "memory_weaving") {
        state.echoes += 1 * allGain;
      }
    }
  });
}


/* ----------------------------
   Render Skills
   ---------------------------- */

function renderSkills() {
  skillDefs.forEach(def => {
    if (!skillUnlocked(def)) return;

    const s = state.skills[def.id];
    if (!s._ui) return;

    // Update level text
    s._ui.level.textContent = "Lv " + s.level;

    // Update progress bar
    const duration = def.baseDuration * Math.pow(1 + def.durationGrowth, s.level);
    const globalSpeed = getGlobalSpeedMult();
    const skillSpeed = getSkillSpeedMult();
    const effective = duration / (globalSpeed * skillSpeed);

    const pct = Math.min(100, (s.progress / effective) * 100);
    s._ui.fill.style.width = pct + "%";
  });
}
