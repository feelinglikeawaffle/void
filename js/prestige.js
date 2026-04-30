/* ============================
   PRESTIGE — Ascend, Transcend, Eternal
   ============================ */


/* ----------------------------
   Ascension Requirements
   ---------------------------- */

function getAscendRequirement() {
  return 1000; // Example: require 1000 Void Favor
}

function canAscend() {
  return state.voidFavor >= getAscendRequirement();
}


/* ----------------------------
   Ascend Action
   ---------------------------- */

function doAscend() {
  if (!canAscend()) return;

  // Gain Ascendant Shards
  const gain = Math.floor(state.voidFavor / 1000);
  state.ascendantShards += gain;

  // Reset basic layers
  state.dust = 0;
  state.fragments = 0;
  state.echoes = 0;
  state.cores = 0;
  state.sigils = 0;

  // Reset skills & jobs
  skillDefs.forEach(def => {
    state.skills[def.id].level = 0;
    state.skills[def.id].progress = 0;
  });

  jobDefs.forEach(def => {
    state.jobs[def.id].level = 0;
    state.jobs[def.id].progress = 0;
  });

  // Reset Void Favor
  state.voidFavor = 0;

  render();
}


/* ----------------------------
   Transcend Requirements
   ---------------------------- */

function getTranscendRequirement() {
  return 10; // Example: require 10 Ascendant Shards
}

function canTranscend() {
  return state.ascendantShards >= getTranscendRequirement();
}


/* ----------------------------
   Transcend Action
   ---------------------------- */

function doTranscend() {
  if (!canTranscend()) return;

  // Gain Transcendent Essence
  const gain = Math.floor(state.ascendantShards / 10);
  state.transcendentEssence += gain;

  // Reset Ascension layer
  state.ascendantShards = 0;

  // Reset everything below
  doAscend(); // performs full reset

  render();
}


/* ----------------------------
   Eternal Requirements
   ---------------------------- */

function getEternalRequirement() {
  return 100; // Example: require 100 Transcendent Essence
}

function canEnterEternal() {
  return state.transcendentEssence >= getEternalRequirement();
}


/* ----------------------------
   Eternal Action
   ---------------------------- */

function doEternal() {
  if (!canEnterEternal()) return;

  // Gain Eternal Embers
  const gain = Math.floor(state.transcendentEssence / 100);
  state.eternalEmbers += gain;

  // Reset transcendence layer
  state.transcendentEssence = 0;

  // Reset everything below
  doTranscend();

  render();
}


/* ----------------------------
   Build Prestige UI
   ---------------------------- */

function buildPrestigeUI() {
  // Ascend
  el.ascendInfo.textContent =
    "Requires " + getAscendRequirement() + " Void Favor.";
  el.ascendBtn.disabled = !canAscend();
  el.ascendBtn.onclick = doAscend;

  // Transcend
  el.transcendInfo.textContent =
    "Requires " + getTranscendRequirement() + " Ascendant Shards.";
  el.transcendBtn.disabled = !canTranscend();
  el.transcendBtn.onclick = doTranscend;

  // Eternal
  el.eternalInfo.textContent =
    "Requires " + getEternalRequirement() + " Transcendent Essence.";
  el.eternalBtn.disabled = !canEnterEternal();
  el.eternalBtn.onclick = doEternal;
}


/* ----------------------------
   Render Prestige Panels
   ---------------------------- */

function renderPrestige() {
  // Update resource displays
  el.shards.textContent = format(state.ascendantShards);
  el.essence.textContent = format(state.transcendentEssence);
  el.embers.textContent = format(state.eternalEmbers);

  // Update buttons
  buildPrestigeUI();
}
