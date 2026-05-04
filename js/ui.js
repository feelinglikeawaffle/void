/* ============================
   UI SYSTEM
   ============================ */

/* ---------- Tabs ---------- */

function setupTabs() {
  const buttons = document.querySelectorAll(".tab-btn");
  const tabs = document.querySelectorAll(".tab");

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-tab");

      buttons.forEach(b => b.classList.remove("active"));
      tabs.forEach(t => t.classList.remove("active"));

      btn.classList.add("active");
      document.getElementById("tab-" + target).classList.add("active");
    });
  });
}

/* ---------- Build UI ---------- */

function buildUI() {
  if (typeof buildShopUI === "function") {
    buildShopUI();
  }
}

/* ---------- Resource Bar ---------- */

function renderResources() {
  const r = state.resources;

  const sidebar = document.getElementById("sidebar-res-list");
  if (sidebar) {
    sidebar.innerHTML = `
      <div>Dust: ${Math.round(r.dust)}</div>
      <div>Void: ${Math.round(r.void)}</div>
      <div>Ascendant Shards: ${Math.round(r.ascend)}</div>
      <div>Transcendent Essence: ${Math.round(r.transcend)}</div>
      <div>Eternal Embers: ${Math.round(r.eternal)}</div>
    `;
  }
}



/* ---------- Skills ---------- */

function renderSkills() {
  const container = document.getElementById("skills-container");
  if (!container) return;

  container.innerHTML = "";

  skillDefs.forEach(def => {
    const skill = getSkillState(def.id);
    const div = document.createElement("div");
    div.className = "skill-card";

    if (!skill.unlocked) {
      div.innerHTML = `
        <div class="skill-name locked">${def.name}</div>
        <div class="skill-desc">${def.desc}</div>
        <div class="skill-locked-text">
          ${def.unlockReq ? def.unlockReq.text : "Locked."}
        </div>
      `;
    } else {
      const needed = getSkillXpToLevel(skill.level);
      const pct = needed > 0 ? Math.min(100, (skill.xp / needed) * 100) : 0;

      div.innerHTML = `
        <div class="skill-name">${def.name} (Lv ${skill.level})</div>
        <div class="skill-desc">${def.desc}</div>

        <div class="skill-xp-bar">
          <div class="skill-xp-fill" style="width:${pct}%;"></div>
        </div>

        <div class="skill-xp-text">
          ${skill.xp.toFixed(1)} / ${needed.toFixed(1)} XP
        </div>
      `;

      if (skill.justLeveled) {
        div.classList.add("skill-level-up");
        skill.justLeveled = false;
      }
    }

    container.appendChild(div);
  });
}

/* ---------- ENTITIES ---------- */

function renderJobs() {
  const container = document.getElementById("jobs-container");
  if (!container) return;

  container.innerHTML = "";

  state.entities.forEach(entity => {
    const div = document.createElement("div");
    div.className = "entity-card";

    const starColors = [
      "#8b0000", "#ff0000", "#ff7f00", "#ffff00",
      "#00ff00", "#0000ff", "#8000ff", "#00008b"
    ];
    const starColor = starColors[entity.star];

    const starMult = getStarMultiplier(entity.star);
    const dustPerCycle = entity.baseDust * entity.efficiency * starMult;
    const progressPct = entity.progress * 100;

    div.innerHTML = `
      <div class="entity-name">${entity.name}</div>
      <div class="entity-stars" style="color:${starColor}">
        ⭐ ${entity.star} Star
      </div>
      <div class="entity-stats">
        <div>Dust/Cycle: ${dustPerCycle.toFixed(1)}</div>
        <div>Speed: ${entity.speed.toFixed(2)}</div>
        <div>Efficiency: ${entity.efficiency.toFixed(2)}</div>
      </div>

      <div class="entity-progress-bar">
        <div class="entity-progress-fill" style="width:${progressPct}%;"></div>
      </div>

      <button class="star-btn" data-id="${entity.id}">Star Up</button>
    `;

    container.appendChild(div);
  });

  document.querySelectorAll(".star-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      starUpEntity(id);
    });
  });
}

/* ---------- HIRE MENU ---------- */

function openHireMenu() {
  document.getElementById("hire-modal").classList.remove("hidden");
  renderHireMenu();
}

function closeHireMenu() {
  document.getElementById("hire-modal").classList.add("hidden");
}

function renderHireMenu() {
  const container = document.getElementById("hire-container");
  container.innerHTML = "";

  state.hire.pool.forEach(ent => {
    const starColors = [
      "#8b0000", "#ff0000", "#ff7f00", "#ffff00",
      "#00ff00", "#0000ff", "#8000ff", "#00008b"
    ];
    const starColor = starColors[ent.star];

    container.innerHTML += `
      <div class="hire-row">
        <div class="hire-name" style="color:${starColor}">
          ⭐ ${ent.star} — ${ent.name}
        </div>
        <div class="hire-stats">
          Dust/Cycle: ${(ent.baseDust * ent.efficiency).toFixed(1)}<br>
          Speed: ${ent.speed.toFixed(2)}<br>
          Efficiency: ${ent.efficiency.toFixed(2)}
        </div>
        <button class="hire-btn" data-id="${ent.id}">Hire</button>
      </div>
    `;
  });

  document.querySelectorAll(".hire-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      hireEntity(btn.getAttribute("data-id"));
      renderHireMenu();
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const openBtn = document.getElementById("open-hire-menu");
  const closeBtn = document.getElementById("close-hire-menu");

  if (openBtn) openBtn.onclick = openHireMenu;
  if (closeBtn) closeBtn.onclick = closeHireMenu;
});

/* ---------- Void ---------- */

function renderVoid() {
  const container = document.getElementById("void-actions");
  if (!container) return;

  container.innerHTML = `
    <div>Void: ${Math.round(state.resources.void)}</div>
  `;
}

/* ---------- Shop ---------- */

function renderShop() {
  // Shop UI is static unless buying
}

/* ---------- Prestige ---------- */

function renderPrestige() {
  const ascendInfo = document.getElementById("ascend-info");
  const transcendInfo = document.getElementById("transcend-info");
  const eternalInfo = document.getElementById("eternal-info");

  if (ascendInfo) ascendInfo.textContent = "Ascendant Shards: " + Math.round(state.resources.ascend);
  if (transcendInfo) transcendInfo.textContent = "Transcendent Essence: " + Math.round(state.resources.transcend);
  if (eternalInfo) eternalInfo.textContent = "Eternal Embers: " + Math.round(state.resources.eternal);
}

/* ---------- Master Render ---------- */

function render(dt) {
  renderResources();
  renderSkills();
  renderJobs();
  renderVoid();
  renderShop();
  renderPrestige();
}
