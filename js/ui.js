/* ============================
   UI
   ============================ */

function setupTabs() {
  const buttons = document.querySelectorAll(".tab-btn");
  const tabs = document.querySelectorAll(".tab");

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-tab");

      buttons.forEach(b => b.classList.remove("active"));
      tabs.forEach(t => t.classList.remove("active"));

      btn.classList.add("active");
      document.getElementById("tab-" + target).classList.add("active");
    });
  });
}

function buildUI() {
  // Skills, jobs, void, shop, prestige are built by their own modules
  buildShopUI();
}

function renderResources() {
  document.getElementById("res-dust").textContent =
    "Dust: " + state.resources.dust;

  document.getElementById("res-void").textContent =
    "Void: " + state.resources.void;

  document.getElementById("res-ascend").textContent =
    "Ascendant Shards: " + state.resources.ascend;

  document.getElementById("res-transcend").textContent =
    "Transcendent Essence: " + state.resources.transcend;

  document.getElementById("res-eternal").textContent =
    "Eternal Embers: " + state.resources.eternal;
}

function render(dt) {
  renderResources();
  renderSkills();
  renderJobs();
  renderVoid();
  renderShop();
  renderPrestige();
}
