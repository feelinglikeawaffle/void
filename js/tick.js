/* ============================
   TICK — Main Game Loop
   ============================ */

let lastTime = performance.now();

function tick() {
  const now = performance.now();
  const dt = now - lastTime;
  lastTime = now;

  tickJobs(dt);
  tickSkills(dt);
  tickVoid(dt);

  render(dt);

  requestAnimationFrame(tick);
}
