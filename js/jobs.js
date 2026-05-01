/* ============================
   ENTITIES / JOBS
   ============================ */

function tickJobs(dt) {
  // simple: each entity generates dust based on dps
  const seconds = dt / 1000;
  state.entities.forEach(e => {
    state.resources.dust += e.dps * seconds;
  });
}

function renderJobs() {
  const container = document.getElementById("jobs-container");
  container.innerHTML = "";

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
      starUpEntity(id);
    });
  });
}

function starUpEntity(id) {
  const entity = state.entities.find(e => e.id === id);
  if (!entity) return;

  const cost = Math.pow(10, entity.stars + 1);

  if (state.resources.dust < cost) return;

  state.resources.dust -= cost;
  entity.stars++;
  entity.dps *= 2;
}
