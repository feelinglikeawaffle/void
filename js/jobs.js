/* ============================
   JOBS — Logic & UI
   ============================ */


/* ----------------------------
   Build Jobs UI
   ---------------------------- */

function buildJobsUI() {
  el.jobs.innerHTML = "";

  jobDefs.forEach(def => {
    if (!jobUnlocked(def)) return;

    const j = state.jobs[def.id];

    const row = document.createElement("div");
    row.className = "job-row";

    const name = document.createElement("div");
    name.className = "job-name";
    name.textContent = def.name;

    const level = document.createElement("div");
    level.className = "job-level";
    level.textContent = "Lv " + j.level;

    const bar = document.createElement("div");
    bar.className = "job-bar";

    const fill = document.createElement("div");
    fill.className = "job-fill";
    fill.style.width = "0%";

    bar.appendChild(fill);

    row.appendChild(name);
    row.appendChild(level);
    row.appendChild(bar);

    // Store UI references
    j._ui = { level, fill };

    el.jobs.appendChild(row);
  });
}


/* ----------------------------
   Job Tick Logic
   ---------------------------- */

function tickJobs(dt) {
  const globalSpeed = getGlobalSpeedMult();
  const jobYield = getJobYieldMult();
  const allGain = getAllGainMult();

  jobDefs.forEach(def => {
    if (!jobUnlocked(def)) return;

    const j = state.jobs[def.id];

    const duration = def.baseDuration * Math.pow(1 + def.durationGrowth, j.level);
    const effective = duration / globalSpeed;

    j.progress += dt;

    if (j.progress >= effective) {
      j.progress -= effective;
      j.level++;

      const baseGain = 1 * jobYield * allGain;
      state[def.resource] += baseGain;
    }
  });
}


/* ----------------------------
   Render Jobs
   ---------------------------- */

function renderJobs() {
  jobDefs.forEach(def => {
    if (!jobUnlocked(def)) return;

    const j = state.jobs[def.id];
    if (!j._ui) return;

    // Update level text
    j._ui.level.textContent = "Lv " + j.level;

    // Update progress bar
    const duration = def.baseDuration * Math.pow(1 + def.durationGrowth, j.level);
    const globalSpeed = getGlobalSpeedMult();
    const effective = duration / globalSpeed;

    const pct = Math.min(100, (j.progress / effective) * 100);
    j._ui.fill.style.width = pct + "%";
  });
}
