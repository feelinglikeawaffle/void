// PURE PK-STYLE LEVELING
// bar fills → level up → next bar takes longer

const SAVE_KEY = "void_game_v2";

let state = {
  time: 0,
  dust: 0,
  fragments: 0,
  echoes: 0,
  cores: 0,
  sigils: 0,
  voidFavor: 0,
  ascendantShards: 0,
  skills: {},
  jobs: {},
  unlocks: {
    jobs: false,
    void: false,
    ascend: false
  }
};

// SKILLS
const skillDefs = [
  // Mind
  { id: "focus", name: "Focus", desc: "Sharpen your mind.", baseDuration: 4000, durationGrowth: 0.10, requires: null },
  { id: "meditation", name: "Meditation", desc: "Stillness reveals truth.", baseDuration: 5000, durationGrowth: 0.11, requires: { skill: "focus", level: 5 } },
  { id: "memory_weaving", name: "Memory Weaving", desc: "Bind thoughts into patterns.", baseDuration: 5500, durationGrowth: 0.12, requires: { skill: "meditation", level: 5 } },
  { id: "hyperfocus", name: "Hyperfocus", desc: "Burn attention into a single point.", baseDuration: 6000, durationGrowth: 0.13, requires: { skill: "memory_weaving", level: 5 } },

  // Void
  { id: "void_sense", name: "Void Sensitivity", desc: "Feel the pull of the Void.", baseDuration: 5000, durationGrowth: 0.12, requires: { skill: "focus", level: 3 } },
  { id: "void_channeling", name: "Void Channeling", desc: "Let the Void flow through you.", baseDuration: 6000, durationGrowth: 0.14, requires: { skill: "void_sense", level: 5 } },
  { id: "void_binding", name: "Void Binding", desc: "Anchor fragments to the Void.", baseDuration: 6500, durationGrowth: 0.15, requires: { skill: "void_channeling", level: 5 } },

  // Meta
  { id: "time_perception", name: "Time Perception", desc: "Stretch and compress moments.", baseDuration: 7000, durationGrowth: 0.16, requires: { skill: "meditation", level: 10 } },
  { id: "reality_anchoring", name: "Reality Anchoring", desc: "Stay intact near the Void.", baseDuration: 7500, durationGrowth: 0.17, requires: { skill: "void_binding", level: 10 } }
];

// JOBS
const jobDefs = [
  // Tier 1
  { id: "dust_gatherer", name: "Dust Gatherer", desc: "Collect cosmic dust.", baseDuration: 5000, durationGrowth: 0.08, resource: "dust", req: { skill: "focus", level: 1 } },
  { id: "fragment_sifter", name: "Fragment Sifter", desc: "Sort broken realities.", baseDuration: 7000, durationGrowth: 0.10, resource: "fragments", req: { skill: "void_sense", level: 2 } },
  { id: "echo_listener", name: "Echo Listener", desc: "Listen to lingering thoughts.", baseDuration: 6500, durationGrowth: 0.09, resource: "echoes", req: { skill: "memory_weaving", level: 3 } },

  // Tier 2
  { id: "core_compressor", name: "Core Compressor", desc: "Compress fragments into cores.", baseDuration: 8000, durationGrowth: 0.11, resource: "cores", req: { skill: "void_binding", level: 3 } },
  { id: "sigil_engraver", name: "Sigil Engraver", desc: "Carve meaning into sigils.", baseDuration: 9000, durationGrowth: 0.12, resource: "sigils", req: { skill: "time_perception", level: 3 } }
];

// ELEMENTS
const el = {
  time: document.getElementById("time-display"),
  dust: document.getElementById("dust-count"),
  fragments: document.getElementById("fragment-count"),
  echoes: document.getElementById("echo-count"),
  cores: document.getElementById("core-count"),
  sigils: document.getElementById("sigil-count"),
  shards: document.getElementById("shard-count"),
  voidFavor: document.getElementById("void-favor-value"),
  voidMult: document.getElementById("void-mult-value"),
  skills: document.getElementById("skills-container"),
  jobs: document.getElementById("jobs-container"),
  voidActions: document.getElementById("void-actions"),
  autoVoid: document.getElementById("auto-void-toggle"),
  log: document.getElementById("log"),
  feedVoidBtn: document.getElementById("feed-void-btn"),
  saveBtn: document.getElementById("save-btn"),
  loadBtn: document.getElementById("load-btn"),
  wipeBtn: document.getElementById("wipe-btn"),
  ascendInfo: document.getElementById("ascend-info"),
  ascendBtn: document.getElementById("ascend-btn")
};

// INIT
function initState() {
  skillDefs.forEach(def => {
    if (!state.skills[def.id]) state.skills[def.id] = { level: 0, progress: 0 };
  });
  jobDefs.forEach(def => {
    if (!state.jobs[def.id]) state.jobs[def.id] = { level: 0, progress: 0 };
  });
}

function skillUnlocked(def) {
  if (!def.requires) return true;
  const req = state.skills[def.requires.skill];
  return req && req.level >= def.requires.level;
}

function jobUnlocked(def) {
  const req = state.skills[def.req.skill];
  return req && req.level >= def.req.level;
}

function getVoidMult() {
  return 1 + state.voidFavor * 0.02 + state.ascendantShards * 0.05;
}

// UI ROW
function createRow(def) {
  const row = document.createElement("div");
  row.className = "row";

  const left = document.createElement("div");
  left.style.flex = "1";

  const header = document.createElement("div");
  header.className = "row-header";

  const name = document.createElement("div");
  name.textContent = def.name;

  const meta = document.createElement("div");
  meta.textContent = "Lv 0";

  header.appendChild(name);
  header.appendChild(meta);

  const desc = document.createElement("div");
  desc.style.fontSize = "0.75rem";
  desc.style.color = "var(--muted)";
  desc.textContent = def.desc;

  const bar = document.createElement("div");
  bar.className = "bar-container";

  const fill = document.createElement("div");
  fill.className = "bar-fill";

  const label = document.createElement("div");
  label.className = "bar-label";
  label.textContent = "0%";

  bar.appendChild(fill);
  bar.appendChild(label);

  left.appendChild(header);
  left.appendChild(desc);
  left.appendChild(bar);

  const right = document.createElement("div");
  right.className = "row-right";

  const info = document.createElement("div");
  info.className = "small-label";
  info.textContent = "Lv 0";

  right.appendChild(info);

  row.appendChild(left);
  row.appendChild(right);

  row._meta = meta;
  row._fill = fill;
  row._label = label;
  row._info = info;

  return row;
}

function buildUI() {
  el.skills.innerHTML = "";
  el.jobs.innerHTML = "";

  skillDefs.forEach(def => {
    const row = createRow(def);
    state.skills[def.id]._row = row;
    el.skills.appendChild(row);
  });

  jobDefs.forEach(def => {
    const row = createRow(def);
    state.jobs[def.id]._row = row;
    el.jobs.appendChild(row);
  });

  buildVoidActions();
}

function buildVoidActions() {
  el.voidActions.innerHTML = "";
  const row = document.createElement("div");
  row.className = "row";

  const left = document.createElement("div");
  left.style.flex = "1";

  const header = document.createElement("div");
  header.className = "row-header";

  const name = document.createElement("div");
  name.textContent = "Dust Offering";

  const meta = document.createElement("div");
  meta.textContent = "10 Dust → 1 Void Favor";

  header.appendChild(name);
  header.appendChild(meta);

  const desc = document.createElement("div");
  desc.style.fontSize = "0.75rem";
  desc.style.color = "var(--muted)";
  desc.textContent = "Feed the Void to grow its influence.";

  left.appendChild(header);
  left.appendChild(desc);

  row.appendChild(left);
  el.voidActions.appendChild(row);
}

function floatText(text, rect, color = "#a855f7") {
  const elFt = document.createElement("div");
  elFt.className = "floating-text";
  elFt.textContent = text;
  elFt.style.left = rect.left + rect.width / 2 + "px";
  elFt.style.top = rect.top + rect.height / 2 + "px";
  elFt.style.color = color;
  document.body.appendChild(elFt);
  requestAnimationFrame(() => {
    elFt.style.opacity = "1";
    elFt.style.transform = "translateY(-20px)";
  });
  setTimeout(() => elFt.remove(), 600);
}

function updateUnlocks() {
  if (!state.unlocks.jobs && state.skills.focus.level >= 1) {
    state.unlocks.jobs = true;
    document.querySelector('[data-tab="jobs"]').classList.remove("locked");
  }
  if (!state.unlocks.void && state.dust >= 10) {
    state.unlocks.void = true;
    document.querySelector('[data-tab="void"]').classList.remove("locked");
  }
  if (!state.unlocks.ascend && totalSkillLevels() >= 40 && totalJobLevels() >= 20 && state.voidFavor >= 50) {
    state.unlocks.ascend = true;
    document.querySelector('[data-tab="ascend"]').classList.remove("locked");
  }
}

function totalSkillLevels() {
  return Object.values(state.skills).reduce((sum, s) => sum + s.level, 0);
}

function totalJobLevels() {
  return Object.values(state.jobs).reduce((sum, j) => sum + j.level, 0);
}

function tick(dt) {
  state.time += dt;

  // SKILLS
  skillDefs.forEach(def => {
    const s = state.skills[def.id];
    if (!skillUnlocked(def)) return;
    if (s.progress === 0) s.progress = 0.0001;

    const duration = def.baseDuration * (1 + s.level * def.durationGrowth) / getVoidMult();
    s.progress += dt / duration;

    if (s.progress >= 1) {
      s.level++;
      s.progress = 0.0001;
      if (s._row) floatText("LEVEL UP!", s._row.getBoundingClientRect());
      if (def.id === "memory_weaving") state.echoes += 1;
    }
  });

  // JOBS
  jobDefs.forEach(def => {
    const j = state.jobs[def.id];
    if (!jobUnlocked(def)) return;
    if (j.progress === 0) j.progress = 0.0001;

    const duration = def.baseDuration * (1 + j.level * def.durationGrowth) / getVoidMult();
    j.progress += dt / duration;

    if (j.progress >= 1) {
      const reward = (1 + j.level * 0.5) * getVoidMult();
      state[def.resource] += reward;
      if (j._row) floatText("+" + reward.toFixed(0) + " " + def.resource, j._row.getBoundingClientRect());
      j.level++;
      j.progress = 0.0001;
    }
  });

  // AUTO VOID
  if (state.unlocks.void && el.autoVoid.checked) {
    if (state.dust >= 10) {
      state.dust -= 10;
      state.voidFavor += 1;
      floatText("+1 Void Favor", el.voidActions.getBoundingClientRect());
    }
  }

  updateUnlocks();
  updateAscendInfo();
  render();
}

function updateAscendInfo() {
  const skillLv = totalSkillLevels();
  const jobLv = totalJobLevels();
  const vf = state.voidFavor;
  const canAscend = skillLv >= 40 && jobLv >= 20 && vf >= 50;
  el.ascendInfo.textContent =
    `Total Skill Levels: ${skillLv} / 40, Total Job Levels: ${jobLv} / 20, Void Favor: ${vf} / 50`;
  el.ascendBtn.disabled = !canAscend;
}

function render() {
  el.time.textContent = "t=" + Math.floor(state.time / 1000) + "s";
  el.dust.textContent = state.dust.toFixed(0);
  el.fragments.textContent = state.fragments.toFixed(0);
  el.echoes.textContent = state.echoes.toFixed(0);
  el.cores.textContent = state.cores.toFixed(0);
  el.sigils.textContent = state.sigils.toFixed(0);
  el.shards.textContent = state.ascendantShards.toFixed(0);
  el.voidFavor.textContent = state.voidFavor.toFixed(0);
  el.voidMult.textContent = "x" + getVoidMult().toFixed(2);

  skillDefs.forEach(def => {
    const s = state.skills[def.id];
    const row = s._row;
    const unlocked = skillUnlocked(def);
    const pct = unlocked ? Math.min(1, s.progress) * 100 : 0;
    row._fill.style.width = pct + "%";
    row._label.textContent = unlocked ? pct.toFixed(0) + "%" : "Locked";
    row._meta.textContent = unlocked ? "Lv " + s.level : "Locked";
    row._info.textContent = "Lv " + s.level;
    row.style.opacity = unlocked ? "1" : "0.4";
  });

  jobDefs.forEach(def => {
    const j = state.jobs[def.id];
    const row = j._row;
    const unlocked = jobUnlocked(def);
    const pct = unlocked ? Math.min(1, j.progress) * 100 : 0;
    row._fill.style.width = pct + "%";
    row._label.textContent = unlocked ? pct.toFixed(0) + "%" : "Locked";
    row._meta.textContent = unlocked ? "Lv " + j.level : "Locked";
    row._info.textContent = "Lv " + j.level;
    row.style.opacity = unlocked ? "1" : "0.4";
  });
}

// SAVE / LOAD
function saveGame() {
  localStorage.setItem(SAVE_KEY, JSON.stringify(state));
}

function loadGame() {
  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) return;
  const loaded = JSON.parse(raw);
  state = Object.assign({}, state, loaded);
  initState();
  buildUI();
}

function wipeGame() {
  localStorage.removeItem(SAVE_KEY);
  location.reload();
}

// ASCEND
function doAscend() {
  const shardsGain = Math.floor((totalSkillLevels() + totalJobLevels()) / 20) + 1;
  state.ascendantShards += shardsGain;

  state.dust = 0;
  state.fragments = 0;
  state.echoes = 0;
  state.cores = 0;
  state.sigils = 0;
  state.voidFavor = 0;

  Object.keys(state.skills).forEach(id => {
    state.skills[id].level = 0;
    state.skills[id].progress = 0;
  });
  Object.keys(state.jobs).forEach(id => {
    state.jobs[id].level = 0;
    state.jobs[id].progress = 0;
  });

  state.unlocks.jobs = false;
  state.unlocks.void = false;
  // ascend tab stays unlocked once reached

  buildUI();
  updateUnlocks();
  updateAscendInfo();
  render();
}

// TABS
function setupTabs() {
  const tabs = document.querySelectorAll(".tab-btn");
  const panels = {
    skills: document.getElementById("tab-skills"),
    jobs: document.getElementById("tab-jobs"),
    void: document.getElementById("tab-void"),
    ascend: document.getElementById("tab-ascend")
  };

  tabs.forEach(btn => {
    btn.addEventListener("click", () => {
      if (btn.classList.contains("locked")) return;
      const id = btn.dataset.tab;
      tabs.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      Object.values(panels).forEach(p => p.classList.remove("active"));
      panels[id].classList.add("active");
    });
  });
}

// BUTTONS
function setupButtons() {
  el.feedVoidBtn.addEventListener("click", () => {
    const gain = 1 * getVoidMult();
    state.dust += gain;
    floatText("+" + gain.toFixed(0) + " Dust", el.feedVoidBtn.getBoundingClientRect());
  });
  el.saveBtn.addEventListener("click", saveGame);
  el.loadBtn.addEventListener("click", () => {
    loadGame();
    render();
  });
  el.wipeBtn.addEventListener("click", () => {
    if (confirm("Wipe save?")) wipeGame();
  });
  el.ascendBtn.addEventListener("click", () => {
    if (!el.ascendBtn.disabled && confirm("Ascend and reset this run?")) {
      doAscend();
    }
  });
}

// LOOP
function startLoop() {
  let last = performance.now();
  function frame(now) {
    const dt = now - last;
    last = now;
    tick(dt);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

// BOOT
initState();
buildUI();
setupTabs();
setupButtons();
loadGame();
updateUnlocks();
updateAscendInfo();
render();
startLoop();
