/**
 * This function populates the products container with items that belong to the current era,
 * applying unlock conditions such as:
 *
 * - Previous item ownership requirement
 * - Special event triggers (e.g., "child-worker-triggered")
 * - First or second item in era (always available)
 *
 * * Hidden products are those marked as locked by default and their unlock events haven't occurred.
 *
 * @returns {void}
 */
function pushEraConfig(): void {
    const container = document.getElementById("products");
    if (!container) return;

    container.innerHTML = "";

    // Iterate through all items in game state
    for (const [key, item] of Object.entries(gameState.ITEMS)) {
        // Filter items belonging to current era
        if (item.era === gameState.era) {
            // Check unlock conditions for the item
            const previousItem = getItemKey(item.era, item.numberInEra - 1);
            if (previousItem && gameState.ITEMS[previousItem].amount >= 1 || key === "child-worker" && gameState.events["child-worker-triggered"] ||
                item.numberInEra === 1 || item.numberInEra === 2
            ) {
                console.log(previousItem);
            } else {
                continue;
            }

            // Create and configure product element
            const productDiv = document.createElement("div");
            productDiv.className = "product locked";
            productDiv.setAttribute("data-product", key);
            productDiv.onclick = () => handlePurchasing(item.numberInEra);

            // Hide products locked by default until their event triggers
            if (item.lockedByDefault && !gameState.events[key]) {
                productDiv.style.display = "none";
            }

            // Populate product display with item information
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
