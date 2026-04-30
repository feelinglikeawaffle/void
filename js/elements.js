/* ============================
   ELEMENTS — DOM References
   ============================ */

const el = {
  /* ----- Tabs & Containers ----- */

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

  /* ----- Shop Containers ----- */

  shopResource: document.getElementById("shop-resource"),
  shopVoid: document.getElementById("shop-void"),
  shopAscend: document.getElementById("shop-ascend"),
  shopTranscend: document.getElementById("shop-transcend"),
  shopEternal: document.getElementById("shop-eternal"),

  /* ----- Prestige ----- */

  ascendInfo: document.getElementById("ascend-info"),
  ascendBtn: document.getElementById("ascend-btn"),

  transcendInfo: document.getElementById("transcend-info"),
  transcendBtn: document.getElementById("transcend-btn"),

  eternalInfo: document.getElementById("eternal-info"),
  eternalBtn: document.getElementById("eternal-btn"),

  /* ----- Save / Load / Wipe ----- */

  saveBtn: document.getElementById("save-btn"),
  loadBtn: document.getElementById("load-btn"),
  wipeBtn: document.getElementById("wipe-btn"),

  /* ----- Log ----- */

  log: document.getElementById("log")
};
