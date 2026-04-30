/* ============================
   SHOP SYSTEM
   ============================ */

/* ----------------------------
   Build Shop UI
   ---------------------------- */

function buildShopUI() {
  buildShopCategory("resource", el.shopResource);
  buildShopCategory("void", el.shopVoid);
  buildShopCategory("ascend", el.shopAscend);
  buildShopCategory("transcend", el.shopTranscend);
  buildShopCategory("eternal", el.shopEternal);
}


/* ----------------------------
   Build a Single Category
   ---------------------------- */

function buildShopCategory(category, root) {
  if (!root) return;

  root.innerHTML = "";

  const items = shopDefs[category];
  if (!items) return;

  for (const id in items) {
    const def = items[id];

    const row = document.createElement("div");
    row.className = "shop-row";

    row.innerHTML = `
      <div class="shop-name">${def.name}</div>
      <div class="shop-desc">${def.desc}</div>
      <button class="shop-buy-btn" id="shop-buy-${category}-${id}">
        Buy (${def.cost} Dust)
      </button>
    `;

    root.appendChild(row);

    document
      .getElementById(`shop-buy-${category}-${id}`)
      .addEventListener("click", () => buyShopItem(category, id));
  }
}


/* ----------------------------
   Purchase Logic
   ---------------------------- */

function buyShopItem(category, id) {
  const def = shopDefs[category][id];
  if (!def) return;

  if (state.dust < def.cost) {
    logMessage("Not enough Dust.");
    return;
  }

  state.dust -= def.cost;

  // Mark as purchased
  state.shop[category][id] = true;

  // Apply effect if defined
  if (def.effect) {
    def.effect();
  }

  logMessage(`Purchased: ${def.name}`);
}


/* ----------------------------
   Render Shop UI
   ---------------------------- */

function renderShop() {
  renderShopCategory("resource", el.shopResource);
  renderShopCategory("void", el.shopVoid);
  renderShopCategory("ascend", el.shopAscend);
  renderShopCategory("transcend", el.shopTranscend);
  renderShopCategory("eternal", el.shopEternal);
}

function renderShopCategory(category, root) {
  if (!root) return;

  const items = shopDefs[category];
  if (!items) return;

  for (const id in items) {
    const def = items[id];
    const btn = document.getElementById(`shop-buy-${category}-${id}`);
    if (!btn) continue;

    const purchased = state.shop[category][id];

    if (purchased) {
      btn.textContent = "Purchased";
      btn.disabled = true;
    } else {
      btn.textContent = `Buy (${def.cost} Dust)`;
      btn.disabled = state.dust < def.cost;
    }
  }
}
