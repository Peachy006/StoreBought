"use strict";
function updateDisplay() {
    let element = document.getElementById("money-display");
    if (element) {
        element.textContent = formatNumber(Math.floor(gameState.money));
    }
    //passive
    const elementTwo = document.getElementById("cookies-per-second");
    if (elementTwo) {
        let incomePerSecond = 0;
        for (const itemKey in gameState.ITEMS) {
            if (itemKey === "hands")
                continue;
            incomePerSecond += gameState.ITEMS[itemKey].income * gameState.ITEMS[itemKey].amount * gameState.ITEMS[itemKey].multiplier;
        }
        elementTwo.textContent = formatNumber(Math.floor(incomePerSecond));
    }
    //click
    const clickElement = document.getElementById("click-amount");
    if (clickElement) {
        let clickAmount = (gameState.ITEMS["hands"].amount + 1) * gameState.ITEMS["hands"].multiplier;
        clickElement.textContent = formatNumber(clickAmount);
    }
    updateEventsAndUnlockUpgrades();
    updateDisplayForUpgrades();
}
function updateEventsAndUnlockUpgrades() {
    for (const itemKey in gameState.events) {
        if (gameState.events[itemKey]) {
            unlockUpgrade(itemKey);
        }
    }
}
function updateDisplayForUpgrades() {
    for (const itemKey in gameState.ITEMS) {
        const productElement = document.querySelector(`[data-product="${itemKey}"]`);
        if (productElement) {
            // Update the "Owned" count
            const ownedElement = productElement.querySelector('.product-owned');
            if (ownedElement) {
                ownedElement.textContent = String(gameState.ITEMS[itemKey].amount);
            }
            // Calculate and update the next price
            const nextPrice = getNextPrice(itemKey);
            const costElement = productElement.querySelector('.product-cost span');
            if (costElement) {
                costElement.textContent = formatNumber(nextPrice);
            }
        }
    }
}
