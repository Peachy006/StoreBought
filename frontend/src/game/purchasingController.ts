function handlePurchasing(itemNumber: number): void {
    let itemName = null;
    switch(gameState.era) {
        case 1:
            itemName = getItemKey(1, itemNumber);
            break;
        case 2:
            itemName = getItemKey(2, itemNumber);
            break;
        default: return;
    }
    if (itemName === "child-worker" && !gameState.events["child-worker"]) {
        return;
    }

    if(!itemName) return;

    // Calculate the current price before purchasing
    const currentPrice = getNextPrice(itemName);

    if (gameState.money < currentPrice) {
        showNotification("You can't afford that!");
        return; // Stop the purchase logic
    }

    // Deduct the money
    gameState.money -= currentPrice;

    // Increment the amount
    gameState.ITEMS[itemName].amount += 1;

    // Update the UI
    updateDisplay();

    const productElement = document.querySelector(`[data-product="${itemName}"]`);
    if(productElement) {
        const ownedElement = productElement.querySelector('.product-owned');
        if (ownedElement) {
            ownedElement.textContent = String(gameState.ITEMS[itemName].amount);
        }

        // Calculate the next price (after the purchase)
        const nextPrice = getNextPrice(itemName);
        const costElement = productElement.querySelector('.product-cost span');
        if (costElement) {
            costElement.textContent = formatNumber(nextPrice);
        }
    }
    saveGame(); // Save on major event (purchase)
    checkForEvents();
    pushEraConfig()
}

function unlockUpgrade(upgradeName: string): void {
    let thingy = document.querySelector(`[data-product="${upgradeName}"]`) as HTMLElement;
    if(thingy) {
        thingy.style.display = "flex";
    }
}

function earnMoneyOnClick(): void{
    gameState.money += (gameState.ITEMS["hands"].amount + 1) * gameState.ITEMS["hands"].multiplier;
    updateDisplay();
}