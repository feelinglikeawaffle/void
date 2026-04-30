/* ============================
   VOID — Top‑Tier Resource & Multipliers
   ============================ */


/* ----------------------------
   Build Void UI
   ---------------------------- */

function buildVoidUI() {
  el.voidPanel.innerHTML = "";

  const vf = document.createElement("div");
  vf.className = "void-row";
  vf.textContent = `Void Favor: ${format(state.voidFavor)}`;

  const mult = document.createElement("div");
  mult.className = "void-row";
  mult.textContent = `Void Multiplier: x${format(state.voidGainMult)}`;

  const shards = document.createElement("div");
  shards.className = "void-row";
  shards.textContent = `Ascendant Shards: ${format(state.ascendantShards)}`;

  const essence = document.createElement("div");
  essence.className = "void-row";
  essence.textContent = `Transcendent Essence: ${format(state.transcendentEssence)}`;

  const embers = document.createElement("div");
  embers.className = "void-row";
  embers.textContent = `Eternal Embers: ${format(state.eternalEmbers)}`;

  el.voidPanel.appendChild(vf);
  el.voidPanel.appendChild(mult);
  el.voidPanel.appendChild(shards);
  el.voidPanel.appendChild(essence);
  el.voidPanel.appendChild(embers);
}


/* ----------------------------
   Void Tick Logic
   ---------------------------- */
/* Nothing to do here anymore — refinery produces Void Favor.
   This function exists for future rituals or void mechanics. */

function tickVoid(dt) {
  // Reserved for future void rituals, corruption, entropy storms, etc.
}


/* ----------------------------
   Render Void UI
   ---------------------------- */

function renderVoid() {
  // Update the numbers live
  el.voidFavor.textContent = format(state.voidFavor);
  el.voidMult.textContent = "x" + format(state.voidGainMult);

  el.shards.textContent = format(state.ascendantShards);
  el.essence.textContent = format(state.transcendentEssence);
  el.embers.textContent = format(state.eternalEmbers);
}
