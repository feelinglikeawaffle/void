/* ============================
   VOID — Feeding, UI, Logic
   ============================ */


/* ----------------------------
   +1 Dust Button (Top Panel)
   ---------------------------- */

function feedVoidDustButton() {
  state.dust += 1;

  const rect = el.feedDustBtn.getBoundingClientRect();
  floatText("+1 Dust", rect, "#facc15");

  render();
}

el.feedDustBtn.addEventListener("click", feedVoidDustButton);


/* ----------------------------
   10 Dust → Void Favor
   ---------------------------- */

function feedVoid() {
  if (state.dust < 10) return;

  state.dust -= 10;

  const gain = 1 * getVoidGainMult();
  state.voidFavor += gain;

  // Floating text from the Void Feed button
  if (el.voidFeedBtn) {
    const rect = el.voidFeedBtn.getBoundingClientRect();
    floatText(`+${gain.toFixed(1)} VF`, rect, "#8b5cf6");
  }

  render();
}


/* ----------------------------
   Build Void Actions UI
   ---------------------------- */

function buildVoidUI() {
  el.voidActions.innerHTML = "";

  // Container row
  const row = document.createElement("div");
  row.className = "void-row";

  // Left label
  const left = document.createElement("div");
  left.className = "void-label";
  left.textContent = "Feed the Void (10 Dust → Void Favor)";

  // Right button
  const right = document.createElement("div");
  right.className = "void-button-container";

  const btn = document.createElement("button");
  btn.className = "void-feed-btn";
  btn.textContent = "Feed";
  btn.addEventListener("click", feedVoid);

  // Store reference for floating text
  el.voidFeedBtn = btn;

  right.appendChild(btn);
  row.appendChild(left);
  row.appendChild(right);

  el.voidActions.appendChild(row);
}


/* ----------------------------
   Auto-Feed Logic
   ---------------------------- */

function autoFeedVoid() {
  if (!el.autoVoid) return;
  if (!el.autoVoid.checked) return;
  if (state.dust < 10) return;

  feedVoid();
}


/* ----------------------------
   Void Multiplier Rendering
   ---------------------------- */

function updateVoidMultiplier() {
  const mult = 1 + state.voidFavor * 0.01;
  el.voidMult.textContent = "x" + mult.toFixed(2);
}


/* ----------------------------
   Render Void Panel
   ---------------------------- */

function renderVoid() {
  el.voidFavor.textContent = format(state.voidFavor);
  updateVoidMultiplier();
}
