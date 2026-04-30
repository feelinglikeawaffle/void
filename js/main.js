/* ============================
   MAIN — Clean Initialization
   ============================ */

function init() {
  console.log("INIT: Starting game initialization.");

  setupTabs();     // from ui.js
  buildUI();       // from ui.js
  render();        // from ui.js

  tick();          // from tick.js

  console.log("INIT: Game initialized successfully.");
}

window.addEventListener("load", init);
