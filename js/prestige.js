/* ============================
   PRESTIGE SYSTEM
   ============================ */

/* ----------------------------
   Build Prestige UI
   ---------------------------- */

function setupPrestigeButtons() {
  if (el.ascendBtn) {
    el.ascendBtn.addEventListener("click", doAscend);
  }
  if (el.transcendBtn) {
    el.transcendBtn.addEventListener("click", doTranscend);
  }
  if (el.eternalBtn) {
    el.eternalBtn.addEventListener("click", doEternal);
  }
}


/* ----------------------------
   Ascend
   ---------------------------- */

function canAscend() {
  return state.dust >= 1000;
}

function doAscend() {
  if (!canAscend()) {
    logMessage("Not enough Dust to Ascend.");
    return;
  }

  state.ascendantShards += 1;
  resetForPrestige();
  logMessage("Ascended! +1 Ascendant Shard.");
}


/* ----------------------------
   Transcend
   ---------------------------- */

function canTranscend() {
  return state.ascendantShards >= 10;
}

function doTranscend() {
  if (!canTranscend()) {
    logMessage("Not enough Ascendant Shards to Transcend.");
    return;
  }

  state.transcendentEssence += 1;
  resetForPrestige();
  logMessage("Transcended! +1 Transcendent Essence.");
}


/* ----------------------------
   Eternal
   ---------------------------- */

function canEternal() {
  return state.transcendentEssence >= 10;
}

function doEternal() {
  if (!canEternal()) {
    logMessage("Not enough Transcendent Essence to achieve Eternal.");
    return;
  }

  state.eternalEmbers += 1;
  resetForPrestige();
  logMessage("Eternal achieved! +1 Eternal Ember.");
}


/* ----------------------------
   Reset Logic (Shared)
   ---------------------------- */

function resetForPrestige() {
  // Reset core resources
  state.dust = 0;
  state.fragments = 0;
  state.echoes = 0;

  // Reset entities
  state.entities.list = [];
  state.entities.hirePool = [];
  state.entities.hireCostMult = 1;

  // Reset skills
  state.skills = { focus: { level: 0, xp: 0 } };

  // Reset multipliers
  state.globalSpeedMult = 1;
  state.jobSpeedMult = 1;
  state.jobYieldMult = 1;

  // Rebuild UI
  buildUI();
}


/* ----------------------------
   Render Prestige UI
   ---------------------------- */

function renderPrestige() {
  if (el.ascendInfo) {
    el.ascendInfo.textContent = `Ascendant Shards: ${state.ascendantShards}`;
  }

  if (el.transcendInfo) {
    el.transcendInfo.textContent = `Transcendent Essence: ${state.transcendentEssence}`;
  }

  if (el.eternalInfo) {
    el.eternalInfo.textContent = `Eternal Embers: ${state.eternalEmbers}`;
  }

  if (el.ascendBtn) {
    el.ascendBtn.disabled = !canAscend();
  }

  if (el.transcendBtn) {
    el.transcendBtn.disabled = !canTranscend();
  }

  if (el.eternalBtn) {
    el.eternalBtn.disabled = !canEternal();
  }
}
