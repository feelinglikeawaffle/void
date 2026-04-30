/* ============================
   TICK — Main Game Loop
   ============================ */

let lastTime = performance.now();


function tick() {
  const now = performance.now();
  const dt = now - lastTime;
  lastTime = now;

  /* ----------------------------
     Update Systems
     ---------------------------- */

  tickSkills(dt);
  tickJobs(dt);
  autoFeedVoid();

  /* ----------------------------
     Render Everything
     ---------------------------- */

  render(dt);

  /* ----------------------------
     Continue Loop
     ---------------------------- */

  requestAnimationFrame(tick);
}
