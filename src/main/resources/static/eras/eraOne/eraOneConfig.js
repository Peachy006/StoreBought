"use strict";
function pushEraOneConfig() {
    const container = document.getElementById("products");
    if (!container)
        return;
    container.innerHTML = "";
    for (const [key, item] of Object.entries(gameState.ITEMS)) {
        if (item.era === 1) {
            const productDiv = document.createElement("div");
            productDiv.className = "product locked";
            productDiv.setAttribute("data-product", key);
            productDiv.onclick = () => handlePurchasing(item.numberInEra);
            if (key === "child-worker" && !gameState.events["child-labour"]) {
                productDiv.style.display = "none";
            }
            productDiv.innerHTML = `
                <div class="product-icon">${key.charAt(0).toUpperCase()}</div>
                <div class="product-info">
                    <div class="product-name">${key.replace("-", " ")}</div>
                    <div class="product-cost"><span>${formatNumber(item.basePrice)}</span></div>
                </div>
                <div class="product-owned">${item.amount}</div>
            `;
            container.appendChild(productDiv);
        }
    }
}
