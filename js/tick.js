/* =============================
   TICK — Main Game Loop
   ============================= */

let lastTime = performance.now();

function tick() {
  const now = performance.now();
  const dt = now - lastTime;
  lastTime = now;

  tickJobs(dt);
  tickSkills(dt);
  tickHireTimer(dt);
  tickVoidReactor(dt);

  render(dt);

  requestAnimationFrame(tick);
}

function tickHireTimer(dt) {
  state.hire.timer -= dt / 1000;

  if (state.hire.timer <= 0) {
    state.hire.timer = HIRE_REFRESH_TIME;
    generateHirePool();
  }

  const t = Math.max(0, Math.floor(state.hire.timer));
  const m = Math.floor(t / 60);
  const s = (t % 60).toString().padStart(2, "0");

  const timerEl = document.getElementById("hire-timer");
  if (timerEl) timerEl.textContent = `Next refresh in: ${m}:${s}`;
}
