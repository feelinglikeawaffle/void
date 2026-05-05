/* =============================
   MAIN — Clean Initialization
   ============================ */

function init() {
  console.log("INIT: Starting game initialization.");

  setupTabs();
  buildUI();
  generateHirePool();   // <-- ADD THIS LINE

  render();
  tick();

  console.log("INIT: Game initialized successfully.");
}


window.addEventListener("load", init);
