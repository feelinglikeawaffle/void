/* ============================
   VOID REACTOR SYSTEM
   ============================ */

/* Charge rate = baseRate + (entities * 0.05) */
function getReactorChargeRate() {
  return state.voidReactor.baseRate + state.entities.length * 0.05;
}

/* Tick reactor each frame */
function tickVoidReactor(dt) {
  const r = state.voidReactor;

  r.charge += getReactorChargeRate() * (dt / 1000);

  if (r.charge > r.maxCharge)
    r.charge = r.maxCharge;
}

/* Discharge reactor safely */
function dischargeReactor() {
  const r = state.voidReactor;

  const gain = Math.floor(r.charge / 10);
  state.resources.void += gain;

  r.charge = 0;
}

/* Overcharge with meltdown chance */
function overchargeReactor() {
  const r = state.voidReactor;

  const gain = Math.floor(r.charge / 10) * 1.5;

  if (Math.random() < r.meltdownChance) {
    r.charge = 0;
    return { meltdown: true, gain: 0 };
  }

  state.resources.void += gain;
  r.charge = 0;

  return { meltdown: false, gain };
}
