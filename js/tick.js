/* ============================
   TICK — Main Game Loop
   ============================ */

let lastTime = performance.now();

/* ----------------------------
   Main Tick Function
   ---------------------------- */

function tick() {
  const now = performance.now();
  const dt = now - lastTime;   // milliseconds since last frame
  lastTime = now;

  // Core systems
  tickJobs(dt);
  tickSkills(dt);
  tickVoid(dt);

  // Render everything
  render(dt);

  requestAnimationFrame(tick);
}
