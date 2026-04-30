/* ============================
   SHOP LOGIC
   ============================ */

function getShopCost(upgrade, level) {
  return Math.floor(upgrade.baseCost * Math.pow(1.5, level));
}

function buildShopCategory(containerId, categoryKey) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";

  const defs = shopDefs[categoryKey];
  if (!defs) return;

  defs.forEach(upgrade => {
    const div = document.createElement("div");
    div.className = "shop-upgrade";

    const level = upgrade.level || 0;
    const cost = getShopCost(upgrade, level);
    const currencyName =
      upgrade.currency.charAt(0).toUpperCase() + upgrade.currency.slice(1);

    div.innerHTML = `
      <div class="shop-name">${upgrade.name}</div>
      <div class="shop-desc">${upgrade.desc}</div>
      <div class="shop-cost">Cost: ${cost} ${currencyName}</div>
      <button class="shop-buy" data-id="${upgrade.id}" data-cat="${categoryKey}">
        Buy
      </button>
    `;

    container.appendChild(div);
  });

  container.querySelectorAll(".shop-buy").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      const cat = btn.getAttribute("data-cat");
      buyShopUpgrade(cat, id);
    });
  });
}

function buildShopUI() {
  buildShopCategory("shop-resource", "resource");
  buildShopCategory("shop-void", "void");
  buildShopCategory("shop-ascend", "ascend");
  buildShopCategory("shop-transcend", "transcend");
  buildShopCategory("shop-eternal", "eternal");
}

function buyShopUpgrade(categoryKey, id) {
  const defs = shopDefs[categoryKey];
  if (!defs) return;

  const upgrade = defs.find(u => u.id === id);
  if (!upgrade) return;

  const level = upgrade.level || 0;
  const cost = getShopCost(upgrade, level);

  const resKey = upgrade.currency;
  if (state.resources[resKey] === undefined) return;
  if (state.resources[resKey] < cost) return;

  state.resources[resKey] -= cost;
  upgrade.level = level + 1;

  upgrade.effect(state);

  buildShopUI();
}

function renderShop() {
  // currently static; rebuild only on buy
}
