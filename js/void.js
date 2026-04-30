/* ============================
   VOID SYSTEM
   ============================ */

/* ----------------------------
   Build Void UI
   ---------------------------- */

function buildVoidUI() {
  const root = el.voidActions;
  if (!root) return;

  root.innerHTML = `
    <button id="gain-dust-btn">Gain 1 Dust</button>

    <div class="void-stat">
      <span>Void Favor:</span>
      <span id="void-favor-value">0</span>
    </div>

    <div class="void-stat">
      <span>Void Multiplier:</span>
      <span id="void-mult-value">1.00x</span>
    </div>
  `;

  document.getElementById("gain-dust-btn").addEventListener("click", () => {
    state.dust += 1;
    logMessage("Gained 1 Dust.");
  });
}


/* ----------------------------
   Tick — Void Logic
   ---------------------------- */

function tickVoid(dt) {
  // Placeholder for future void mechanics
  // Currently no time-based void generation
}


/* ----------------------------
   Render Void UI
   ---------------------------- */

function renderVoid() {
  if (!el.voidFavor || !el.voidMult) return;

  el.voidFavor.textContent = state.voidFavor.toFixed(0);
  el.voidMult.textContent = state.voidGainMult.toFixed(2) + "x";
}
