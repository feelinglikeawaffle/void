/* ============================
   MAIN — Game Initialization
   ============================ */


/* ----------------------------
   Save / Load / Wipe
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

  const loaded = JSON.parse(data);

  // Merge loaded state into current state
  Object.assign(state, loaded);

  logMessage("Game loaded.");
  render();
}

function wipeGame() {
  if (!confirm("Are you sure you want to wipe your save?")) return;
  localStorage.removeItem("voidGameSave");
  location.reload();
}


/* ----------------------------
   Hook Up Save Buttons
   ---------------------------- */

function setupSaveButtons() {
  el.saveBtn.addEventListener("click", saveGame);
  el.loadBtn.addEventListener("click", loadGame);
  el.wipeBtn.addEventListener("click", wipeGame);
}


/* ----------------------------
   Initialize Game
   ---------------------------- */

function init() {
  setupTabs();
  setupSaveButtons();
  buildUI();
  render();
  tick();
}


/* ----------------------------
   Start Game
   ---------------------------- */

init();
