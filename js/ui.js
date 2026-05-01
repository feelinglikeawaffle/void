/* ============================
   UI
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
  buildShopUI();   // from shop.js
}

/* ---------- Resource Bar ---------- */

function renderResources() {
  const r = state.resources;

  document.getElementById("res-dust").textContent =
    "Dust: " + Math.round(r.dust);

  document.getElementById("res-void").textContent =
    "Void: " + Math.round(r.void);

  document.getElementById("res-ascend").textContent =
    "Ascendant Shards: " + Math.round(r.ascend);

  document.getElementById("res-transcend").textContent =
    "Transcendent Essence: " + Math.round(r.transcend);

  document.getElementById("res-eternal").textContent =
    "Eternal Embers: " + Math.round(r.eternal);
}


/* ---------- Skills ---------- */

function renderSkills() {
  const container = document.getElementById("skills-container");
  if (!container) return;

  container.innerHTML = "";

  if (typeof skillDefs === "undefined" || typeof getSkillState === "undefined") {
    container.textContent = "Skills system not initialized.";
    return;
  }

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

/* ---------- Jobs / Entities ---------- */

function renderJobs() {
  const container = document.getElementById("jobs-container");
  if (!container) return;

  container.innerHTML = "";

  if (!state.entities) return;

  state.entities.forEach(entity => {
    const div = document.createElement("div");
    div.className = "entity-card";

    div.innerHTML = `
      <div class="entity-name">${entity.name}</div>
      <div class="entity-stars">⭐ ${entity.stars}</div>
      <div class="entity-stats">
        <div>Dust/sec: ${entity.dps.toFixed(2)}</div>
        <div>Speed: ${entity.speed}</div>
        <div>Luck: ${entity.luck}</div>
        <div>Efficiency: ${entity.efficiency}</div>
      </div>
      <button class="star-btn" data-id="${entity.id}">Star Up</button>
    `;

    container.appendChild(div);
  });

  container.querySelectorAll(".star-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      if (typeof starUpEntity === "function") {
        starUpEntity(id);
      }
    });
  });
}

/* ---------- Void ---------- */

function renderVoid() {
  const container = document.getElementById("void-actions");
  if (!container) return;

  container.innerHTML = `
    <div>Void: ${state.resources.void ?? 0}</div>
  `;
}

/* ---------- Shop ---------- */

function renderShop() {
  // shop UI is rebuilt on buy; nothing needed every frame for now
}

/* ---------- Prestige ---------- */

function renderPrestige() {
  const ascendInfo = document.getElementById("ascend-info");
  const transcendInfo = document.getElementById("transcend-info");
  const eternalInfo = document.getElementById("eternal-info");

  if (ascendInfo) {
    ascendInfo.textContent = "Ascendant Shards: " + (state.resources.ascend ?? 0);
  }
  if (transcendInfo) {
    transcendInfo.textContent = "Transcendent Essence: " + (state.resources.transcend ?? 0);
  }
  if (eternalInfo) {
    eternalInfo.textContent = "Eternal Embers: " + (state.resources.eternal ?? 0);
  }
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
