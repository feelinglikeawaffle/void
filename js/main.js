/* ============================
   MAIN — Game Initialization
   ============================ */


/* ----------------------------
   Save / Load
   ---------------------------- */

function saveGame() {
  const data = JSON.stringify(state);
  localStorage.setItem("voidGameSave", data);
  logMessage("Game saved.");
}

function loadGame() {
  const data = localStorage.getItem("voidGameSave");
  if (!data) {
    logMessage("No save found.");
    return;
  }

  try {
    const loaded = JSON.parse(data);

    // Merge loaded state into current state
    for (const k in loaded) {
      if (typeof loaded[k] === "object" && state[k] !== null) {
        Object.assign(state[k], loaded[k]);
      } else {
        state[k] = loaded[k];
      }
    }

    recalcAllMultipliers();
    logMessage("Game loaded.");
  } catch (e) {
    console.error("Load error:", e);
    logMessage("Failed to load save.");
  }
}

function wipeSave() {
  localStorage.removeItem("voidGameSave");
  location.reload();
}


/* ----------------------------
   Hook Save Buttons
   ---------------------------- */

function setupSaveButtons() {
  document.getElementById("save-btn").addEventListener("click", saveGame);
  document.getElementById("load-btn").addEventListener("click", loadGame);
  document.getElementById("wipe-btn").addEventListener("click", wipeSave);
}


/* ----------------------------
   Initialize Game
   ---------------------------- */

function init() {
  setupTabs();
  setupSaveButtons();

  loadGame();       // Load save if exists
  buildUI();        // Build all UI elements
  render();         // Initial render

  tick();           // Start main loop
}


/* ----------------------------
   Start Game
   ---------------------------- */

window.addEventListener("load", init);
