/* ============================
   MAIN — Clean Initialization
   ============================ */

/* ----------------------------
   Initialize Game
   ---------------------------- */

function init() {
  console.log("INIT: Starting game initialization.");

  setupTabs();     // From ui.js
  buildUI();       // From ui.js
  render();        // From ui.js

  tick();          // From tick.js

  console.log("INIT: Game initialized successfully.");
}

/* ----------------------------
   Start Game
   ---------------------------- */

window.addEventListener("load", init);
