// PURE PK-STYLE LEVELING
// bar fills → level up → next bar takes longer

const SAVE_KEY = "void_game_v1";

let state = {
  time: 0,
  dust: 0,
  fragments: 0,
  voidFavor: 0,
  skills: {},
  jobs: {},
  unlocks: {
    jobs: false,
    void: false
  }
};

// SKILL DEFINITIONS
const skillDefs = [
  {
    id: "focus",
    name: "Focus",
    desc: "Sharpen your mind.",
    baseDuration: 4000,
    durationGrowth: 0.10,
    requires: null
  },
  {
    id: "void_sense",
    name: "Void Sensitivity",
    desc: "Feel the pull of the Void.",
    baseDuration: 5000,
    durationGrowth: 0.12,
    requires: { skill: "focus", level: 5 }
  },
  {
    id: "meditation",
    name: "Meditation",
    desc: "Stillness reveals truth.",
    baseDuration: 6000,
    durationGrowth: 0.15,
    requires: { skill: "void_sense", level: 10 }
  }
];

// JOB DEFINITIONS
const jobDefs = [
  {
    id: "dust_gatherer",
    name: "Dust Gatherer",
    desc: "Collect cosmic dust.",
    baseDuration: 5000,
    durationGrowth: 0.08,
    resource: "dust",
    req: { skill: "focus", level: 1 }
  },
  {
    id: "fragment_sifter",
    name: "Fragment Sifter",
    desc: "Sort broken realities.",
    baseDuration: 7000,
    durationGrowth: 0.10,
    resource: "fragments",
    req: { skill: "void_sense", level: 2 }
  }
];

// UI ELEMENTS
const el = {
  time: document.getElementById("time-display"),
  dust: document.getElementById("dust-count"),
  fragments: document.getElementById("fragment-count"),
  voidFavor: document.getElementById("void-favor-value"),
  voidMult: document.getElementById("void-mult-value"),
  skills: document.getElementById("skills-container"),
  jobs: document.getElementById("jobs-container"),
  voidActions: document.getElementById("void-actions"),
  autoVoid: document.getElementById("auto-void-toggle"),
  log: document.getElementById("log")
};

// INIT STATE
function initState() {
  skillDefs.forEach(def => {
    state.skills[def.id] = { level: 0, progress: 0 };
  });
  jobDefs.forEach(def => {
    state.jobs[def.id] = { level: 0, progress: 0 };
  });
}

// UNLOCK CHECKS
function skillUnlocked(def) {
  if (!def.requires) return true;
  const req = state.skills[def.requires.skill];
  return req.level >= def.requires.level;
}

function jobUnlocked(def) {
  const req = state.skills[def.req.skill];
  return req.level >= def.req.level;
}

// VOID MULT
function getVoidMult() {
  return 1 + state.voidFavor * 0.02;
}

// BUILD UI ROW
function createRow(def, type) {
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

// BUILD UI
function buildUI() {
  skillDefs.forEach(def => {
    const row = createRow(def, "skill");
    state.skills[def.id]._row = row;
    el.skills.appendChild(row);
  });

  jobDefs.forEach(def => {
    const row = createRow(def, "job");
    state.jobs[def.id]._row = row;
    el.jobs.appendChild(row);
  });
}

// FLOATING TEXT
function floatText(text, rect, color="#a855f7") {
  const elFt = document.createElement("div");
  elFt.className = "floating-text";
  elFt.textContent = text;
  elFt.style.left = rect.left + rect.width/2 + "px";
  elFt.style.top = rect.top + rect.height/2 + "px";
  elFt.style.color = color;
  document.body.appendChild(elFt);
  requestAnimationFrame(() => {
    elFt.style.opacity = "1";
    elFt.style.transform = "translateY(-20px)";
  });
  setTimeout(() => elFt.remove(), 600);
}

// TICK LOOP
function tick(dt) {
  state.time += dt;

  // AUTO START SKILLS
  skillDefs.forEach(def => {
    const s = state.skills[def.id];
    if (!skillUnlocked(def)) return;
    if (s.progress === 0) s.progress = 0.0001;

    const duration = def.baseDuration * (1 + s.level * def.durationGrowth) / getVoidMult();
    s.progress += dt / duration;

    if (s.progress >= 1) {
      s.level++;
      floatText("LEVEL UP!", s._row.getBoundingClientRect());
      s.progress = 0.0001;
    }
  });

  // AUTO START JOBS
  jobDefs.forEach(def => {
    const j = state.jobs[def.id];
    if (!jobUnlocked(def)) return;
    if (j.progress === 0) j.progress = 0.0001;

    const duration = def.baseDuration * (1 + j.level * def.durationGrowth) / getVoidMult();
    j.progress += dt / duration;

    if (j.progress >= 1) {
      const reward = (1 + j.level * 0.5) * getVoidMult();
      state[def.resource] += reward;
      floatText("+" + reward.toFixed(0) + " " + def.resource, j._row.getBoundingClientRect());
      j.level++;
      j.progress = 0.0001;
    }
  });

  // AUTO VOID
  if (state.unlocks.void && el.autoVoid.checked) {
    if (state.dust >= 10) {
      state.dust -= 10;
      state.voidFavor++;
      floatText("+1 Void Favor", el.voidActions.getBoundingClientRect());
    }
  }

  updateUnlocks();
  render();
}

// UNLOCKS
function updateUnlocks() {
  if (!state.unlocks.jobs && state.skills.focus.level >= 1) {
    state.unlocks.jobs = true;
    document.querySelector('[data-tab="jobs"]').classList.remove("locked");
  }
  if (!state.unlocks.void && state.dust >= 10) {
    state.unlocks.void = true;
    document.querySelector('[data-tab="void"]').classList.remove("locked");
  }
}

// RENDER
function render() {
  el.time.textContent = "t=" + Math.floor(state.time/1000) + "s";
  el.dust.textContent = state.dust.toFixed(0);
  el.fragments.textContent = state.fragments.toFixed(0);
  el.voidFavor.textContent = state.voidFavor.toFixed(0);
  el.voidMult.textContent = "x" + getVoidMult().toFixed(2);

  skillDefs.forEach(def => {
    const s = state.skills[def.id];
    const row = s._row;
    const pct = Math.min(1, s.progress) * 100;
    row._fill.style.width = pct + "%";
    row._label.textContent = pct.toFixed(0) + "%";
    row._meta.textContent = "Lv " + s.level;
    row._info.textContent = "Lv " + s.level;
    row.style.opacity = skillUnlocked(def) ? "1" : "0.4";
  });

  jobDefs.forEach(def => {
    const j = state.jobs[def.id];
    const row = j._row;
    const pct = Math.min(1, j.progress) * 100;
    row._fill.style.width = pct + "%";
    row._label.textContent = pct.toFixed(0) + "%";
    row._meta.textContent = "Lv " + j.level;
    row._info.textContent = "Lv " + j.level;
    row.style.opacity = jobUnlocked(def) ? "1" : "0.4";
  });
}

// SAVE / LOAD
function saveGame() {
  localStorage.setItem(SAVE_KEY, JSON.stringify(state));
}

function loadGame() {
  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) return;
  state = JSON.parse(raw);
  buildUI();
}

function wipeGame() {
  localStorage.removeItem(SAVE_KEY);
  location.reload();
}

// TABS
document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    if (btn.classList.contains("locked")) return;
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("
