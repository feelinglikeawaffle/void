/* ============================
   ENTITIES / JOBS
   ============================ */

function getStarMultiplier(star) {
  const table = [1, 3, 9, 27, 81, 243, 729, 2187];
  return table[Math.max(0, Math.min(7, star || 0))];
}

function tickJobs(dt) {
  const seconds = dt / 1000;
  const speedMult = state.multipliers.entitySpeed || 1;

  state.entities.forEach(entity => {
    const effectiveSpeed = entity.speed * speedMult;
    const cycleTime = 1 / effectiveSpeed;

    entity.progress += seconds / cycleTime;

    if (entity.progress >= 1) {
      const cycles = Math.floor(entity.progress);
      entity.progress -= cycles;

      const starMult = getStarMultiplier(entity.star);
      const dustGain = entity.baseDust * entity.efficiency * starMult * cycles;

      state.resources.dust += dustGain;
    }
  });
}

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

function starUpEntity(id) {
  const entity = state.entities.find(e => e.id === id);
  if (!entity || entity.star >= 7) return;

  const cost = Math.pow(10, entity.star + 1);
  if (state.resources.dust < cost) return;

  state.resources.dust -= cost;
  entity.star++;
  entity.baseDust *= 1.5;
  entity.speed *= 1.1;
  entity.efficiency *= 1.1;
}
