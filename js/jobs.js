/* ============================
   JOBS / ENTITIES
   ============================ */

/*
state.entities = {
  list: [ { id, name, stars, dps, speed, luck, efficiency, isUltra } ],
  hirePool: [],
  nextRefreshAt: 0,
  hireCostMult: 1
}
*/

if (!state.entities) {
  state.entities = {
    list: [],
    hirePool: [],
    nextRefreshAt: 0,
    hireCostMult: 1
  };
}

/* ----------------------------
   Constants
   ---------------------------- */

const HIRE_POOL_SIZE = 6;
const HIRE_REFRESH_MS = 5 * 60 * 1000; // 5 minutes
const HIRE_COST_MULT_STEP = 1.05;      // +5% per hire
const STAR_UP_BASE_COST = 1000;        // base, scaled by stars


/* ----------------------------
   Hire Pool Management
   ---------------------------- */

function ensureHirePool(now) {
  if (!state.entities.hirePool || state.entities.hirePool.length === 0) {
    if (!state.entities.nextRefreshAt || now >= state.entities.nextRefreshAt) {
      state.entities.hirePool = generateHirePool(HIRE_POOL_SIZE);
      state.entities.nextRefreshAt = now + HIRE_REFRESH_MS;
    }
  }
}

function hireEntity(entityId) {
  const idx = state.entities.hirePool.findIndex(e => e.id === entityId);
  if (idx === -1) return;

  const ent = state.entities.hirePool[idx];
  const cost = calcHireCost(ent.stars);

  if (state.dust < cost) {
    logMessage("Not enough dust to hire this entity.");
    return;
  }

  state.dust -= cost;
  state.entities.hireCostMult *= HIRE_COST_MULT_STEP;

  state.entities.list.push(ent);
  state.entities.hirePool.splice(idx, 1);

  logMessage(`Hired ${ent.name} (${ent.stars}★, ${ent.dps.toFixed(1)} dust/sec).`);
}

function starUpEntity(entityId) {
  const ent = state.entities.list.find(e => e.id === entityId);
  if (!ent) return;
  if (ent.stars >= 5) {
    logMessage(`${ent.name} is already 5★.`);
    return;
  }

  const cost = STAR_UP_BASE_COST * Math.pow(10, ent.stars - 1);
  if (state.dust < cost) {
    logMessage("Not enough dust to star up this entity.");
    return;
  }

  state.dust -= cost;
  ent.stars += 1;

  // Re-roll DPS in new star range
  const stats = rollEntityStats(ent.stars);
  ent.dps = stats.dps;
  ent.speed = stats.speed;
  ent.luck = stats.luck;
  ent.efficiency = stats.efficiency;

  logMessage(`${ent.name} starred up to ${ent.stars}★!`);
}

function mergeEntitiesToUltra(ids) {
  if (ids.length < 2) {
    logMessage("Need at least 2 entities to merge.");
    return;
  }

  const selected = state.entities.list.filter(e => ids.includes(e.id));
  if (selected.length < 2) {
    logMessage("Some selected entities not found.");
    return;
  }

  // Simple merge: sum DPS, average stats, mark ultra
  const totalDps = selected.reduce((s, e) => s + e.dps, 0);
  const avgSpeed = selected.reduce((s, e) => s + e.speed, 0) / selected.length;
  const avgEff = selected.reduce((s, e) => s + e.efficiency, 0) / selected.length;
  const bestStars = Math.max(...selected.map(e => e.stars));

  const id = crypto.randomUUID ? crypto.randomUUID() : ("u_" + Math.random().toString(36).slice(2));
  const ultra = {
    id,
    name: "Ultra Entity",
    stars: bestStars,
    dps: totalDps * 1.5,
    speed: avgSpeed * 1.2,
    luck: 1,
    efficiency: avgEff * 1.3,
    isUltra: true
  };

  // Remove merged entities
  state.entities.list = state.entities.list.filter(e => !ids.includes(e.id));
  state.entities.list.push(ultra);

  logMessage(`Merged entities into an Ultra Entity (${ultra.dps.toFixed(1)} dust/sec).`);
}


/* ----------------------------
   Tick
   ---------------------------- */

function tickJobs(dt) {
  const seconds = dt / 1000;
  const list = state.entities.list || [];
  let totalDust = 0;

  for (const ent of list) {
    const mult = state.jobSpeedMult || 1;
    totalDust += ent.dps * seconds * mult;
  }

  state.dust += totalDust;
}


/* ----------------------------
   UI — Build
   ---------------------------- */

function buildJobsUI() {
  const container = el.jobs;
  container.innerHTML = "";

  // Add Entity button
  const addBtn = document.createElement("button");
  addBtn.textContent = "Add Entity";
  addBtn.addEventListener("click", () => {
    openHireModal();
  });
  container.appendChild(addBtn);

  // Entity list container
  const listDiv = document.createElement("div");
  listDiv.id = "entity-list";
  container.appendChild(listDiv);

  // Hire modal root (hidden by default)
  let modal = document.getElementById("hire-modal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "hire-modal";
    modal.className = "modal hidden";
    modal.innerHTML = `
      <div class="modal-backdrop"></div>
      <div class="modal-content">
        <h3>Hire Entities</h3>
        <div id="hire-entities-list"></div>
        <div id="hire-refresh-timer"></div>
        <button id="hire-close-btn">Close</button>
      </div>
    `;
    document.body.appendChild(modal);

    document.getElementById("hire-close-btn").addEventListener("click", closeHireModal);
    modal.querySelector(".modal-backdrop").addEventListener("click", closeHireModal);
  }
}


/* ----------------------------
   UI — Render
   ---------------------------- */

function renderJobs() {
  const container = document.getElementById("entity-list");
  if (!container) return;

  container.innerHTML = "";

  const list = state.entities.list || [];
  if (list.length === 0) {
    const empty = document.createElement("div");
    empty.textContent = "No entities hired yet.";
    empty.className = "muted";
    container.appendChild(empty);
    return;
  }

  for (const ent of list) {
    const row = document.createElement("div");
    row.className = "job-row";

    const title = document.createElement("div");
    title.className = "job-name";
    title.textContent = `${ent.name} ${ent.isUltra ? "(Ultra)" : ""}`;
    row.appendChild(title);

    const stats = document.createElement("div");
    stats.className = "job-level";
    stats.textContent =
      `${ent.stars}★ | ` +
      `${ent.dps.toFixed(1)} dust/sec | ` +
      `SPD ${ent.speed.toFixed(2)} | ` +
      `EFF ${ent.efficiency.toFixed(2)}`;
    row.appendChild(stats);

    const bar = document.createElement("div");
    bar.className = "job-bar";
    const fill = document.createElement("div");
    fill.className = "job-fill";
    fill.style.width = "100%";
    bar.appendChild(fill);
    row.appendChild(bar);

    const btnRow = document.createElement("div");
    btnRow.style.marginTop = "6px";

    const starBtn = document.createElement("button");
    starBtn.textContent = "Star Up";
    starBtn.addEventListener("click", () => {
      starUpEntity(ent.id);
    });
    btnRow.appendChild(starBtn);

    row.appendChild(btnRow);
    container.appendChild(row);
  }

  renderHireModal();
}


/* ----------------------------
   UI — Hire Modal
   ---------------------------- */

function openHireModal() {
  const modal = document.getElementById("hire-modal");
  if (!modal) return;
  modal.classList.remove("hidden");
}

function closeHireModal() {
  const modal = document.getElementById("hire-modal");
  if (!modal) return;
  modal.classList.add("hidden");
}

function renderHireModal() {
  const modal = document.getElementById("hire-modal");
  if (!modal) return;

  const listDiv = document.getElementById("hire-entities-list");
  const timerDiv = document.getElementById("hire-refresh-timer");
  if (!listDiv || !timerDiv) return;

  const now = performance.now();
  ensureHirePool(now);

  listDiv.innerHTML = "";

  if (!state.entities.hirePool || state.entities.hirePool.length === 0) {
    const waitMs = Math.max(0, state.entities.nextRefreshAt - now);
    const secs = Math.ceil(waitMs / 1000);
    listDiv.textContent = "No entities available. New entities in " + secs + "s.";
    timerDiv.textContent = "";
    return;
  }

  for (const ent of state.entities.hirePool) {
    const row = document.createElement("div");
    row.className = "shop-row";

    const name = document.createElement("div");
    name.className = "shop-name";
    name.textContent = `${ent.name} — ${ent.stars}★`;
    row.appendChild(name);

    const desc = document.createElement("div");
    desc.className = "shop-desc";
    desc.textContent =
      `${ent.dps.toFixed(1)} dust/sec | SPD ${ent.speed.toFixed(2)} | EFF ${ent.efficiency.toFixed(2)}`;
    row.appendChild(desc);

    const cost = calcHireCost(ent.stars);
    const costDiv = document.createElement("div");
    costDiv.className = "shop-cost";
    costDiv.textContent = `Cost: ${cost} dust`;
    row.appendChild(costDiv);

    const btn = document.createElement("button");
    btn.textContent = "Hire";
    btn.disabled = state.dust < cost;
    btn.addEventListener("click", () => {
      hireEntity(ent.id);
    });
    row.appendChild(btn);

    listDiv.appendChild(row);
  }

  const waitMs = Math.max(0, state.entities.nextRefreshAt - now);
  const secs = Math.ceil(waitMs / 1000);
  timerDiv.textContent = `New entities in ${secs}s`;
}
