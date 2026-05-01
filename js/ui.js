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
      if (typeof starUpEntity === "function") {
        starUpEntity(id);
      }
    });
  });
}
