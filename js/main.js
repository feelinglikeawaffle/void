/* =============================
   MAIN — Clean Initialization
   ============================ */

function init() {
  console.log("INIT: Starting game initialization.");

  setupTabs();

  // REMOVE buildUI() — it no longer exists
  // buildUI();

  generateHirePool();   // still needed

  render();             // initial render
  tick();               // start game loop

  console.log("INIT: Game initialized successfully.");
}

window.addEventListener("load", init);
