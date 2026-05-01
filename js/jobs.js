/* ============================
   ENTITIES / JOBS
   ============================ */

// Drastic star multiplier: 0★ → x1, 7★ → x2187
function getStarMultiplier(star) {
  const table = [1, 3, 9, 27, 81, 243, 729, 2187];
  return table[Math.max(0, Math.min(7, star || 0))];
}

function tickJobs(dt) {
  if (!state.entities) return;

  const seconds = dt / 1000;
  const speedMult = state.multipliers.entitySpeed || 1;

  state.entities.forEach(entity => {
    const effectiveSpeed = entity.speed * speedMult;
    if (effectiveSpeed <= 0) return;

    // Base cycle time: 1 second, modified by speed
    const cycleTime = 1 / effectiveSpeed; // seconds per cycle
    const progressGain = seconds / cycleTime;

    entity.progress += progressGain;

    if (entity.progress >= 1) {
      const cycles = Math.floor(entity.progress);
      entity.progress -= cycles;

      const starMult = getStarMultiplier(entity.star);
      const dustPerCycle = entity.baseDust * entity.efficiency * starMult;
      const totalDust = dustPerCycle * cycles;

      state.resources.dust += totalDust;
    }
  });
}

function renderJobs() {
  const container = document.getElementById("jobs-container");
  if (!container) return;

  container.innerHTML = "";

  if (!state.entities) return;

  state.entities.forEach(entity => {
    const div = document.createElement("div");
    div.className = "entity-card";

    const starColors = [
      "#8b0000", // 0★ dark red
      "#ff0000", // 1★ red
      "#ff7f00", // 2★ orange
      "#ffff00", // 3★ yellow
      "#00ff00", // 4★ green
      "#0000ff", // 5★ blue
      "#8000ff", // 6★ purple
      "#00008b"  // 7★ dark blue
    ];
    const starColor = starColors[Math.max(0, Math.min(7, entity.star || 0))];

    const starMult = getStarMultiplier(entity.star);
    const dustPerCycle = entity.baseDust * entity.efficiency * starMult;
    const progressPct = Math.max(0, Math.min(100, entity.progress * 100));

    div.innerHTML = `
      <div class="entity-name">${entity.name}</div>
      <div class="entity-stars" style="color:${starColor}">
        ⭐ ${entity.star} Star
      </div>
      <div class="entity-stats">
        <div>Base Dust/Cycle: ${entity.baseDust}</div>
        <div>Star Multiplier: x${starMult}</div>
        <div>Effective Dust/Cycle: ${dustPerCycle.toFixed(1)}</div>
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

  container.querySelectorAll(".star-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      starUpEntity(id);
    });
  });
}

function starUpEntity(id) {
  const entity = state.entities.find(e => e.id === id);
  if (!entity) return;

  if (entity.star >= 7) return; // max stars

  const cost = Math.pow(10, entity.star + 1);

  if (state.resources.dust < cost) return;

  state.resources.dust -= cost;
  entity.star++;

  // Optional: small stat boosts on star-up
  entity.baseDust *= 1.5;
  entity.speed *= 1.1;
  entity.efficiency *= 1.1;
}
