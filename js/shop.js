/* ============================
   SHOP — Upgrades & UI
   ============================ */


/* ----------------------------
   Shop Upgrade Definitions
   ---------------------------- */

const shopDefs = {
  resource: [
    {
      id: "dust_gain_1",
      name: "Dust Efficiency I",
      desc: "+25% Dust gain",
      cost: 50,
      apply: () => state.dustGainMult = (state.dustGainMult || 1) * 1.25
    },
    {
      id: "fragment_gain_1",
      name: "Fragment Efficiency I",
      desc: "+25% Fragment gain",
      cost: 100,
      apply: () => state.fragmentGainMult = (state.fragmentGainMult || 1) * 1.25
    }
  ],

  void: [
    {
      id: "void_gain_1",
      name: "Void Conduit I",
      desc: "+20% Void Favor gain",
      cost: 200,
      apply: () => state.voidGainMult = (state.voidGainMult || 1) * 1.20
    }
  ],

  ascend: [
    {
      id: "ascend_speed_1",
      name: "Ascendant Flow I",
      desc: "+10% global speed",
      cost: 5,
      apply: () => state.ascendSpeedMult = (state.ascendSpeedMult || 1) * 1.10
    }
  ],

  transcend: [
    {
      id: "transcend_gain_1",
      name: "Essence Surge I",
      desc: "+10% all gains",
      cost: 10,
      apply: () => state.transcendGainMult = (state.transcendGainMult || 1) * 1.10
    }
  ],

  eternal: [
    {
      id: "eternal_power_1",
      name: "Eternal Flame I",
      desc: "+5% everything",
      cost: 1,
      apply: () => state.eternalMult = (state.eternalMult || 1) * 1.05
    }
  ]
};


/* ----------------------------
   Buy Upgrade
   ---------------------------- */

function buyUpgrade(category, def) {
  const owned = state.shop[category][def.id];
  if (owned) return; // already bought

  // Determine currency
  let currency = null;
  if (category === "resource") currency = "dust";
  if (category === "void") currency = "voidFavor";
  if (category === "ascend") currency = "ascendantShards";
  if (category === "transcend") currency = "transcendentEssence";
  if (category === "eternal") currency = "eternalEmbers";

  if (state[currency] < def.cost) return;

  // Pay cost
  state[currency] -= def.cost;

  // Mark as owned
  state.shop[category][def.id] = true;

  // Apply effect
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
    cost.textContent = "Cost: " + def.cost;

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
   Render Shop (updates button states)
   ---------------------------- */

function renderShop() {
  buildShopUI();
}
