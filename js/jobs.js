/* ============================
   JOBS / ENTITIES — Production System
   ============================ */


/* ----------------------------
   Build Jobs UI
   ---------------------------- */

function buildJobsUI() {
  const root = el.jobs;
  root.innerHTML = "";

  // Add Entity button
  const addBtn = document.createElement("button");
  addBtn.textContent = "Hire Entity";
  addBtn.className = "hire-entity-btn";
  addBtn.addEventListener("click", openHireModal);
  root.appendChild(addBtn);

  // Entity list container
  const list = document.createElement("div");
  list.id = "entity-list";
  root.appendChild(list);

  buildHireModal();
}


/* ----------------------------
   Build Hire Modal
   ---------------------------- */

function buildHireModal() {
  if (document.getElementById("hire-modal")) return;

  const modal = document.createElement("div");
  modal.id = "hire-modal";
  modal.className = "modal hidden";

  modal.innerHTML = `
    <div class="modal-content">
      <h2>Hire an Entity</h2>
      <div id="hire-entities-list"></div>
      <div class="hire-footer">
        <span id="hire-refresh-timer"></span>
        <button id="hire-close-btn">Close</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  document.getElementById("hire-close-btn").addEventListener("click", closeHireModal);
}


/* ----------------------------
   Open / Close Modal
   ---------------------------- */

function openHireModal() {
  refreshHirePoolIfNeeded();
  renderHirePool();
  document.getElementById("hire-modal").classList.remove("hidden");
}

function closeHireModal() {
  document.getElementById("hire-modal").classList.add("hidden");
}


/* ----------------------------
   Generate Hire Pool
   ---------------------------- */

function refreshHirePoolIfNeeded() {
  const now = performance.now();

  if (state.entities.hirePool.length === 0 || now >= state.entities.nextRefreshAt) {
    state.entities.hirePool = [];

    for (let i = 0; i < 6; i++) {
      state.entities.hirePool.push(generateEntity());
    }

    state.entities.nextRefreshAt = now + 5 * 60 * 1000; // 5 minutes
  }
}


/* ----------------------------
   Render Hire Pool
   ---------------------------- */

function renderHirePool() {
  const list = document.getElementById("hire-entities-list");
  const timer = document.getElementById("hire-refresh-timer");

  list.innerHTML = "";

  const now = performance.now();
  const remaining = Math.max(0, state.entities.nextRefreshAt - now);
  const minutes = Math.floor(remaining / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);

  timer.textContent = `Refresh in: ${minutes}:${seconds.toString().padStart(2, "0")}`;

  state.entities.hirePool.forEach((ent, index) => {
    const row = document.createElement("div");
    row.className = "hire-row";

    row.innerHTML = `
      <div class="hire-name">${ent.name} ★${ent.stars}</div>
      <div class="hire-stats">DPS: ${ent.dps.toFixed(2)}</div>
      <div class="hire-stats">Speed: ${ent.speed.toFixed(2)}</div>
      <div class="hire-stats">Eff: ${ent.efficiency.toFixed(2)}</div>
      <button class="hire-btn">Hire (${calcHireCost().toFixed(0)} Dust)</button>
    `;

    row.querySelector(".hire-btn").addEventListener("click", () => hireEntity(index));

    list.appendChild(row);
  });
}


/* ----------------------------
   Hire Entity
   ---------------------------- */

function hireEntity(index) {
  const cost = calcHireCost();

  if (state.dust < cost) {
    logMessage("Not enough Dust.");
    return;
  }

  state.dust -= cost;
  state.entities.hireCostMult *= 1.05; // inflation

  const ent = state.entities.hirePool[index];
  state.entities.list.push(ent);

  logMessage(`Hired ${ent.name} (★${ent.stars})`);

  closeHireModal();
}


/* ----------------------------
   Calculate Hire Cost
   ---------------------------- */

function calcHireCost() {
  return 10 * state.entities.hireCostMult;
}


/* ----------------------------
   Tick — Entity Production
   ---------------------------- */

function tickJobs(dt) {
  const seconds = dt / 1000;
  const speedMult = state.globalSpeedMult * state.jobSpeedMult;
  const yieldMult = state.jobYieldMult;

  state.entities.list.forEach(ent => {
    const duration = 1 / (ent.speed * speedMult);
    ent.progress += seconds;

    if (ent.progress >= duration) {
      ent.progress -= duration;
      state.dust += ent.dps * ent.efficiency * yieldMult;
    }
  });
}


/* ----------------------------
   Render Jobs / Entities
   ---------------------------- */

function renderJobs() {
  const list = document.getElementById("entity-list");
  if (!list) return;

  list.innerHTML = "";

  state.entities.list.forEach(ent => {
    const row = document.createElement("div");
    row.className = "entity-row";

    const name = document.createElement("div");
    name.className = "entity-name";
    name.textContent = `${ent.name} ★${ent.stars}`;
    row.appendChild(name);

    const stats = document.createElement("div");
    stats.className = "entity-stats";
    stats.textContent = `DPS: ${ent.dps.toFixed(2)} | Speed: ${ent.speed.toFixed(2)} | Eff: ${ent.efficiency.toFixed(2)}`;
    row.appendChild(stats);

    const bar = document.createElement("div");
    bar.className = "entity-bar";

    const fill = document.createElement("div");
    fill.className = "entity-fill";

    const duration = 1 / (ent.speed * state.globalSpeedMult * state.jobSpeedMult);
    const pct = Math.min(100, (ent.progress / duration) * 100);

    fill.style.width = pct + "%";

    bar.appendChild(fill);
    row.appendChild(bar);

    list.appendChild(row);
  });
}
