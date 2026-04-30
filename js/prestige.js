/* ============================
   PRESTIGE — Ascend / Transcend / Eternal
   ============================ */


/* ----------------------------
   Requirements
   ---------------------------- */

const ASCEND_REQ = 1000;          // Void Favor needed
const TRANSCEND_REQ = 10000;      // Void Favor needed
const ETERNAL_REQ = 100000;       // Void Favor needed


/* ----------------------------
   Ascend
   ---------------------------- */

function canAscend() {
  return state.voidFavor >= ASCEND_REQ;
}

function doAscend() {
  if (!canAscend()) return;

  const gained = Math.floor(state.voidFavor / ASCEND_REQ);
  state.ascendantShards += gained;

  // Reset basic progression
  resetJobs();
  resetSkills();
  resetResources();

  // Keep prestige resources
  state.voidFavor = 0;

  // Recalculate multipliers
  recalcAllMultipliers();

  render();
}


/* ----------------------------
   Transcend
   ---------------------------- */

function canTranscend() {
  return state.voidFavor >= TRANSCEND_REQ;
}

function doTranscend() {
  if (!canTranscend()) return;

  const gained = Math.floor(state.voidFavor / TRANSCEND_REQ);
  state.transcendentEssence += gained;

  // Harder reset
  resetJobs();
  resetSkills();
  resetResources();
  state.ascendantShards = 0;

  state.voidFavor = 0;

  recalcAllMultipliers();

  render();
}


/* ----------------------------
   Eternal
   ---------------------------- */

function canEternal() {
  return state.voidFavor >= ETERNAL_REQ;
}

function doEternal() {
  if (!canEternal()) return;

  const gained = Math.floor(state.voidFavor / ETERNAL_REQ);
  state.eternalEmbers += gained;

  // Full wipe except Eternal Embers
  resetJobs();
  resetSkills();
  resetResources();
  state.ascendantShards = 0;
  state.transcendentEssence = 0;

  state.voidFavor = 0;

  recalcAllMultipliers();

  render();
}


/* ----------------------------
   Reset Helpers
   ---------------------------- */

function resetJobs() {
  for (const id in state.jobs) {
    state.jobs[id].progress = 0;
  }
}

function resetSkills() {
  for (const id in state.skills) {
    state.skills[id].level = 0;
    state.skills[id].progress = 0;
  }
}

function resetResources() {
  state.dust = 0;
  state.fragments = 0;
  state.echoes = 0;
  state.cores = 0;
  state.sigils = 0;
  state.paradoxDust = 0;
  state.riftEnergy = 0;
  state.realityShards = 0;
  state.voidCrystals = 0;
  state.astralFibers = 0;
  state.entropicMass = 0;
  state.voidFavor = 0;
}


/* ----------------------------
   Recalculate All Multipliers
   ---------------------------- */

function recalcAllMultipliers() {
  state.globalSpeedMult = 1;
  state.jobSpeedMult = 1;
  state.jobYieldMult = 1;
  state.refinerySpeedMult = 1;
  state.refineryEfficiencyMult = 1;
  state.voidGainMult = 1;

  // Reapply skill effects
  skillDefs.forEach(def => {
    def.applyLevelEffect();
  });

  // Reapply shop upgrades
  for (const cat in state.shop) {
    for (const id in state.shop[cat]) {
      if (state.shop[cat][id]) {
        const def = shopDefs[cat].find(x => x.id === id);
        if (def) def.apply();
      }
    }
  }
}


/* ----------------------------
   Render Prestige UI
   ---------------------------- */

function renderPrestige() {
  // Ascend
  el.ascendInfo.textContent = `Requires ${ASCEND_REQ} Void Favor`;
  el.ascendBtn.disabled = !canAscend();

  // Transcend
  el.transcendInfo.textContent = `Requires ${TRANSCEND_REQ} Void Favor`;
  el.transcendBtn.disabled = !canTranscend();

  // Eternal
  el.eternalInfo.textContent = `Requires ${ETERNAL_REQ} Void Favor`;
  el.eternalBtn.disabled = !canEternal();
}


/* ----------------------------
   Hook Buttons
   ---------------------------- */

function setupPrestigeButtons() {
  el.ascendBtn.addEventListener("click", doAscend);
  el.transcendBtn.addEventListener("click", doTranscend);
  el.eternalBtn.addEventListener("click", doEternal);
}
