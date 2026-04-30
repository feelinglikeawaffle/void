/* ============================
   REFINERY — Automatic Resource Conversion
   ============================ */


/* ----------------------------
   Tick Refinery
   ---------------------------- */

function tickRefinery(dt) {
  const speed = state.refinerySpeedMult * state.globalSpeedMult;
  const efficiency = state.refineryEfficiencyMult;

  // How many conversions per second?
  // Example: speed = 1 → 1 conversion per second
  const conversions = (dt / 1000) * speed;

  // Process each link in the chain
  refineryChain.forEach(link => {
    const from = link.from;
    const to = link.to;

    // How many "from" resources do we have?
    const available = state[from];

    if (available <= 0) return;

    // Base ratio: 10:1, modified by efficiency
    const ratio = BASE_REFINERY_RATIO / efficiency;

    // How many conversions can we afford?
    const maxConversions = available / ratio;

    // Actual conversions this tick
    const doConvert = Math.min(maxConversions, conversions);

    if (doConvert <= 0) return;

    // Apply conversion
    state[from] -= doConvert * ratio;
    state[to] += doConvert;
  });
}


/* ----------------------------
   Render Refinery (optional)
   ---------------------------- */

function renderRefinery() {
  // Nothing visual yet — could add refinery bars later
}
