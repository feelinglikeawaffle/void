/* ============================
   UI — Building & Rendering
   ============================ */


/* ----------------------------
   Tab Switching
   ---------------------------- */

function setupTabs() {
  const buttons = document.querySelectorAll(".tab-btn");

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      const tab = btn.dataset.tab;

      // Activate button
      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      // Activate tab content
      document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
      document.getElementById("tab-" + tab).classList.add("active");
    });
  });
}


/* ----------------------------
   Build All UI Sections
   ---------------------------- */

function buildUI() {
  buildSkillsUI();
  buildJobsUI();
  buildVoidUI();
  buildShopUI();
  buildPrestigeUI();
}


/* ----------------------------
   Render Resource Bar
   ---------------------------- */

function renderResources() {
  el.dust.textContent = format(state.dust);
  el.fragments.textContent = format(state.fragments);
  el.echoes.textContent = format(state.echoes);
  el.cores.textContent = format(state.cores);
  el.sigils.textContent = format(state.sigils);
  el.paradoxDust.textContent = format(state.paradoxDust);
  el.riftEnergy.textContent = format(state.riftEnergy);
  el.realityShards.textContent = format(state.realityShards);
  el.voidCrystals.textContent = format(state.voidCrystals);
  el.astralFibers.textContent = format(state.astralFibers);
  el.entropicMass.textContent = format(state.entropicMass);
}


/* ----------------------------
   Render Time Display
   ---------------------------- */

let gameTime = 0;

function renderTime(dt) {
  gameTime += dt;
  el.time.textContent = "t=" + (gameTime / 1000).toFixed(1) + "s";
}


/* ----------------------------
   Render Everything
   ---------------------------- */

function render(dt = 0) {
  renderResources();
  renderSkills();
  renderJobs();
  renderVoid();
  renderShop();
  renderPrestige();
  renderTime(dt);
}
