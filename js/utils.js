/* ============================
   UTILS — Helper Functions
   ============================ */


/* ----------------------------
   Floating Text Animation
   ---------------------------- */

function floatText(text, rect, color = "#fff") {
  const elFloat = document.createElement("div");
  elFloat.className = "float-text";
  elFloat.textContent = text;
  elFloat.style.left = rect.left + rect.width / 2 + "px";
  elFloat.style.top = rect.top + "px";
  elFloat.style.color = color;

  document.body.appendChild(elFloat);

  setTimeout(() => {
    elFloat.style.transform = "translateY(-40px)";
    elFloat.style.opacity = "0";
  }, 10);

  setTimeout(() => {
    elFloat.remove();
  }, 900);
}


/* ----------------------------
   Number Formatting
   ---------------------------- */

function format(num) {
  if (num < 1000) return num.toFixed(0);
  if (num < 1e6) return (num / 1e3).toFixed(2) + "K";
  if (num < 1e9) return (num / 1e6).toFixed(2) + "M";
  if (num < 1e12) return (num / 1e9).toFixed(2) + "B";
  if (num < 1e15) return (num / 1e12).toFixed(2) + "T";
  return num.toExponential(2);
}


/* ----------------------------
   Unlock Checks
   ---------------------------- */

function skillUnlocked(def) {
  return def.unlock ? def.unlock() : true;
}

function jobUnlocked(def) {
  return def.unlock ? def.unlock() : true;
}


/* ----------------------------
   Global Multipliers
   ---------------------------- */

function getGlobalSpeedMult() {
  return 1 + state.voidFavor * 0.01;
}

function getSkillSpeedMult() {
  return 1 + (state.ascendantShards * 0.02);
}

function getJobYieldMult() {
  return 1 + (state.ascendantShards * 0.01);
}

function getAllGainMult() {
  return 1 + (state.transcendentEssence * 0.03);
}

function getVoidGainMult() {
  return 1 + (state.voidCrystals * 0.05);
}


/* ----------------------------
   Logging Helper
   ---------------------------- */

function logMessage(msg) {
  const line = document.createElement("div");
  line.textContent = msg;
  el.log.appendChild(line);
  el.log.scrollTop = el.log.scrollHeight;
}


/* ----------------------------
   Time Formatting
   ---------------------------- */

function formatTime(ms) {
  return (ms / 1000).toFixed(1) + "s";
}
