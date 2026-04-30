/* ============================
   UI — Rendering & Tabs
   ============================ */


/* ----------------------------
   Cache DOM Elements
   ---------------------------- */

const el = {
  // Tabs
  tabButtons: document.querySelectorAll(".tab-btn"),
  tabs: document.querySelectorAll(".tab"),

  // Skills
  skills: document.getElementById("skills-container"),

  // Jobs
  jobs: document.getElementById("jobs-container"),

  // Void Panel
  voidPanel: document.getElementById("void-actions"),
  voidFavor: document.getElementById("void-favor-value"),
  voidMult: document.getElementById("void-mult-value"),
  shards: document.getElementById("shard-count"),
  essence: document.getElementById("essence-count"),
  embers: document.getElementById("ember-count"),

  // Shop
  shopResource: document.getElementById("shop-resource"),
  shopVoid: document.getElementById("shop-void"),
  shopAscend: document.getElementById("shop-ascend"),
  shopTranscend: document.getElementById("shop-transcend"),
  shopEternal: document.getElementById("shop-eternal"),

  // Prestige
  ascendInfo: document.getElementById("ascend-info"),
  ascendBtn: document.getElementById("ascend-btn"),
  transcendInfo: document.getElementById("transcend-info"),
  transcendBtn: document.getElementById("transcend-btn"),
  eternalInfo: document.getElementById("eternal-info"),
  eternalBtn: document.getElementById("eternal-btn"),

  // Log
  log: document.getElementById("log")
};


/* ----------------------------
   Tabs
   ---------------------------- */

function setupTabs() {
  el.tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const tab = btn.dataset.tab;

      // Unlock check
      if (btn.classList.contains("locked")) return;

      // Activate button
      el.tabButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      // Activate tab
      el.tabs.forEach(t => t.classList.remove("active"));
      document.getElementById(`tab-${tab}`).classList.add("active");
    });
  });
}


/* ----------------------------
   Floating Text
   ---------------------------- */

function floatText(text, rect, color = "#fff") {
  const div = document.createElement("div");
  div.className = "float-text";
  div.textContent = text;
  div.style.left = rect.left + "px";
  div.style.top = rect.top + "px";
  div.style.color = color;

  document.body.appendChild(div);

  requestAnimationFrame(() => {
    div.style.transform = "translateY(-40px)";
    div.style.opacity = "0";
  });

  setTimeout(() => div.remove(), 800);
}


/* ----------------------------
   Log Messages
   ---------------------------- */

function logMessage(msg) {
  const line = document.createElement("div");
  line.textContent = msg;
  el.log.appendChild(line);
  el.log.scrollTop = el.log.scrollHeight;
}


/* ----------------------------
   Build All UI
   ---------------------------- */

function buildUI() {
  buildSkillsUI();
  buildJobsUI();
  buildVoidUI();
  buildShopUI();
  setupPrestigeButtons();
}


/* ----------------------------
   Render All UI
   ---------------------------- */

function render(dt = 0) {
  renderSkills();
  renderJobs();
  renderVoid();
  renderShop();
  renderPrestige();
}
