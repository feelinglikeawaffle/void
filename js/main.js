/* =============================
   MAIN — Clean Initialization
   ============================ */

function init() {
  console.log("INIT: Starting game initialization.");

  setupTabs();
  initSkills();        // <-- REQUIRED for skill leveling
  generateHirePool();  // <-- REQUIRED for hire menu

  render();            // initial render
  tick();              // start game loop

  console.log("INIT: Game initialized successfully.");
}

window.addEventListener("load", init);
