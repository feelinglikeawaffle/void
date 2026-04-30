/* ============================
   JOBS / ENTITIES — Constant Dust Generators
   ============================ */


/* ----------------------------
   Build Jobs UI
   ---------------------------- */

function buildJobsUI() {
  el.jobs.innerHTML = "";

  jobDefs.forEach(def => {
    const j = state.jobs[def.id];

    const row = document.createElement("div");
    row.className = "job-row";

    const name = document.createElement("div");
    name.className = "job-name";
    name.textContent = def.name;

    const bar = document.createElement("div");
    bar.className = "job-bar";

    const fill = document.createElement("div");
    fill.className = "job-fill";
    fill.style.width = "0%";

    bar.appendChild(fill);

    row.appendChild(name);
    row.appendChild(bar);

    // Store UI refs
    j._ui = { fill };

    el.jobs.appendChild(row);
  });
}


/* ----------------------------
   Job Tick Logic
   ---------------------------- */

function tickJobs(dt) {
  const globalSpeed = state.globalSpeedMult;
  const jobSpeed = state.jobSpeedMult;
  const jobYield = state.jobYieldMult;

  jobDefs.forEach(def => {
    const j = state.jobs[def.id];

    const effectiveDuration = def.baseDuration / (globalSpeed * jobSpeed);

    j.progress += dt;

    if (j.progress >= effectiveDuration) {
      j.progress -= effectiveDuration;

      // Dust gain
      const gain = def.baseYield * jobYield;
      state.dust += gain;

      // Floating text (optional)
      if (j._ui) {
        const rect = j._ui.fill.getBoundingClientRect();
        floatText(`+${gain.toFixed(0)} Dust`, rect, "#facc15");
      }
    }
  });
}


/* ----------------------------
   Render Jobs
   ---------------------------- */

function renderJobs() {
  const globalSpeed = state.globalSpeedMult;
  const jobSpeed = state.jobSpeedMult;

  jobDefs.forEach(def => {
    const j = state.jobs[def.id];
    if (!j._ui) return;

    const effectiveDuration = def.baseDuration / (globalSpeed * jobSpeed);
    const pct = Math.min(100, (j.progress / effectiveDuration) * 100);

    j._ui.fill.style.width = pct + "%";
  });
}
