/* ============================
   ELEMENTS — DOM References
   ============================ */

const el = {
  /* ----- Top Panel Buttons & Displays ----- */

  // Top button that gives +1 Dust
  feedDustBtn: document.getElementById("feed-dust-btn"),

  // Resource counters
  dust: document.getElementById("dust-count"),
  fragments: document.getElementById("fragment-count"),
  echoes: document.getElementById("echo-count"),
  cores: document.getElementById("core-count"),
  sigils: document.getElementById("sigil-count"),
  paradoxDust: document.getElementById("paradox-count"),
  riftEnergy: document.getElementById("rift-count"),
  realityShards: document.getElementById("reality-count"),
  voidCrystals: document.getElementById("crystal-count"),
  astralFibers: document.getElementById("fiber-count"),
  entropicMass: document.getElementById("mass-count"),

  // Void panel values
  voidFavor: document.getElementById("void-favor-value"),
  voidMult: document.getElementById("void-mult-value"),

  // Prestige resources
  shards: document.getElementById("shard-count"),
  essence: document.getElementById("essence-count"),
  embers: document.getElementById("ember-count"),

  /* ----- Tabs & Containers ----- */

  skills: document.getElementById("skills-container"),
  jobs: document.getElementById("jobs-container"),
  voidActions: document.getElementById("void-actions"),

  // Auto-feed checkbox
  autoVoid: document.getElementById("auto-void-toggle"),

  // Shop containers
  shopResource: document.getElementById("shop-resource"),
  shopVoid: document.getElementById("shop-void"),
  shopAscend: document.getElementById("shop-ascend"),
  shopTranscend: document.getElementById("shop-transcend"),
  shopEternal: document.getElementById("shop-eternal"),

  // Ascend tab
  ascendInfo: document.getElementById("ascend-info"),
  ascendBtn: document.getElementById("ascend-btn"),
  ascendUpgrades: document.getElementById("ascend-upgrades"),

  // Transcend tab
  transcendInfo: document.getElementById("transcend-info"),
  transcendBtn: document.getElementById("transcend-btn"),
  transcendUpgrades: document.getElementById("transcend-upgrades"),

  // Eternal tab
  eternalInfo: document.getElementById("eternal-info"),
  eternalBtn: document.getElementById("eternal-btn"),
  eternalUpgrades: document.getElementById("eternal-upgrades"),

  /* ----- Save / Load / Wipe ----- */

  saveBtn: document.getElementById("save-btn"),
  loadBtn: document.getElementById("load-btn"),
  wipeBtn: document.getElementById("wipe-btn"),

  /* ----- Misc ----- */

  time: document.getElementById("time-display"),
  log: document.getElementById("log"),

  /* ----- Dynamic Buttons (assigned later) ----- */

  // Void tab "Feed" button (10 Dust → Void Favor)
  voidFeedBtn: null
};
