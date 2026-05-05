/* =============================
   MAIN — Clean Initialization
   ============================ */

function init() {
  console.log("INIT: Starting game initialization.");

  setupTabs();

  // buildUI() removed — no longer used
  generateHirePool();

  render();   // initial render
  tick();     // start game loop

  console.log("INIT: Game initialized successfully.");
}

window.addEventListener("load", init);
