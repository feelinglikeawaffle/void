/* ============================
   SHOP — Upgrades & UI
   ============================ */


/* ----------------------------
   Shop Upgrade Definitions
   ---------------------------- */

const shopDefs = {
  resource: [
    {
      id: "job_speed_1",
      name: "Faster Workers I",
      desc: "+20% Job Speed",
      cost: 100,
      apply: () => state.jobSpeedMult *= 1.20
    },
    {
      id: "job_yield_1",
      name: "Stronger Tools I",
      desc: "+20% Job Yield",
      cost: 150,
      apply: () => state.jobYieldMult *= 1.20
    }
  ],

  void: [
    {
      id: "void_gain_1",
      name: "Void Conduit I",
      desc: "+25% Void Favor Gain",
      cost: 200,
      apply: () => state.voidGainMult *= 1.25
    }
  ],

  ascend: [
    {
      id: "global_speed_1",
      name: "Ascendant Flow I",
      desc: "+10% Global Speed",
      cost: 5,
      apply: () => state.globalSpeedMult *= 1.10
    }
  ],

  transcend: [
    {
      id: "refinery_speed_1",
      name: "Essence Refinement I",
      desc: "+20% Refinery Speed",
      cost: 10,
      apply: () => state.refinerySpeedMult *= 1.20
    },
    {
      id: "refinery_eff_1",
      name: "Essence Efficiency I",
      desc: "+10% Refinery Efficiency",
      cost: 15,
      apply: () => state.refineryEfficiencyMult *= 1.10
    }
  ],

  eternal: [
    {
      id: "all_gain_1",
      name: "Eternal Flame I",
      desc: "+5% Everything",
      cost: 1,
      apply: () => {
        state.globalSpeedMult *= 1.05;
        state.jobSpeedMult *= 1.05;
        state.jobYieldMult *= 1.05;
        state.refinerySpeedMult *= 1.05;
        state.refineryEfficiencyMult *= 1.05;
        state.voidGainMult *= 1.05;
      }
    }
  ]
};


/* ----------------------------
   Buy Upgrade
   ---------------------------- */

function buyUpgrade(category, def) {
  const owned = state.shop[category][def.id];
  if (owned) return;

  let currency = null;
  if (category === "resource") currency = "dust";
  if (category === "void") currency = "voidFavor";
  if (category === "ascend") currency = "ascendantShards";
  if (category === "transcend") currency = "transcendentEssence";
  if (category === "eternal") currency = "eternalEmbers";

  if (state[currency] < def.cost) return;

  state[currency] -= def.cost;
  state.shop[category][def.id] = true;

  def.apply();

  render();
}


/* ----------------------------
   Build Shop Category UI
   ---------------------------- */

function buildShopCategory(container, category, defs) {
  container.innerHTML = "";

  defs.forEach(def => {
    const owned = state.shop[category][def.id];

    const row = document.createElement("div");
    row.className = "shop-row";

    const name = document.createElement("div");
    name.className = "shop-name";
    name.textContent = def.name;

    const desc = document.createElement("div");
    desc.className = "shop-desc";
    desc.textContent = def.desc;

    const cost = document.createElement("div");
    cost.className = "shop-cost";

    // Currency label
    let currencyName = "";
    if (category === "resource") currencyName = "Dust";
    if (category === "void") currencyName = "Void Favor";
    if (category === "ascend") currencyName = "Ascendant Shards";
    if (category === "transcend") currencyName = "Transcendent Essence";
    if (category === "eternal") currencyName = "Eternal Embers";

    cost.textContent = `Cost: ${def.cost} ${currencyName}`;

    const btn = document.createElement("button");
    btn.textContent = owned ? "Bought" : "Buy";
    btn.disabled = owned;
    btn.addEventListener("click", () => buyUpgrade(category, def));

    row.appendChild(name);
    row.appendChild(desc);
    row.appendChild(cost);
    row.appendChild(btn);

    container.appendChild(row);
  });
}


/* ----------------------------
   Build Entire Shop UI
   ---------------------------- */

function buildShopUI() {
  buildShopCategory(el.shopResource, "resource", shopDefs.resource);
  buildShopCategory(el.shopVoid, "void", shopDefs.void);
  buildShopCategory(el.shopAscend, "ascend", shopDefs.ascend);
  buildShopCategory(el.shopTranscend, "transcend", shopDefs.transcend);
  buildShopCategory(el.shopEternal, "eternal", shopDefs.eternal);
}


/* ----------------------------
   Render Shop
   ---------------------------- */

function renderShop() {
  buildShopUI();
}
