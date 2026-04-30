/* ============================
   SKILLS — Passive Buff Engines
   ============================ */


/* ----------------------------
   Build Skills UI
   ---------------------------- */

function buildSkillsUI() {
  el.skills.innerHTML = "";

  skillDefs.forEach(def => {
    const s = state.skills[def.id];

    const row = document.createElement("div");
    row.className = "skill-row";

    const name = document.createElement("div");
    name.className = "skill-name";
    name.textContent = `${def.name} (Lv ${s.level})`;

    const bar = document.createElement("div");
    bar.className = "skill-bar";

    const fill = document.createElement("div");
    fill.className = "skill-fill";
    fill.style.width = "0%";

    bar.appendChild(fill);

    row.appendChild(name);
    row.appendChild(bar);

    // Store UI refs
    s._ui = { name, fill };

    el.skills.appendChild(row);
  });
}


/* ----------------------------
   Skill Tick Logic
   ---------------------------- */

function tickSkills(dt) {
  const globalSpeed = state.globalSpeedMult;

  skillDefs.forEach(def => {
    const s = state.skills[def.id];

    const effectiveDuration = def.baseDuration / globalSpeed;

    s.progress += dt;

    if (s.progress >= effectiveDuration) {
      s.progress -= effectiveDuration;
      s.level++;

      // Apply the new level's effect
      def.applyLevelEffect();

      // Floating text
      if (s._ui) {
        const rect = s._ui.fill.getBoundingClientRect();
        floatText(`Skill +1`, rect, "#a78bfa");
      }
    }
  });
}


/* ----------------------------
   Render Skills
   ---------------------------- */

function renderSkills() {
  const globalSpeed = state.globalSpeedMult;

  skillDefs.forEach(def => {
    const s = state.skills[def.id];
    if (!s._ui) return;

    const effectiveDuration = def.baseDuration / globalSpeed;
    const pct = Math.min(100, (s.progress / effectiveDuration) * 100);

    s._ui.fill.style.width = pct + "%";
    s._ui.name.textContent = `${def.name} (Lv ${s.level})`;
  });
}
