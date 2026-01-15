"use strict";
let gameState = {
    cookiesPerClick: 1,
    money: 0,
    karma: 0,
    era: 1,
    events: {
        "child-worker-triggered": false,
        "child-worker": false
    },
    ITEMS: {
        // income is pretty much useless for hands
        "hands": { basePrice: 15, income: 1, amount: 0, baseIncome: 1, multiplier: 1, era: 1, numberInEra: 1 },
        "loom": { basePrice: 100, income: 5, amount: 0, baseIncome: 5, multiplier: 1, era: 1, numberInEra: 2 },
        "coal-cart": { basePrice: 500, income: 10, amount: 0, baseIncome: 10, multiplier: 1, era: 1, numberInEra: 3 },
        "steam-engine": { basePrice: 2500, income: 100, amount: 0, baseIncome: 100, multiplier: 1, era: 1, numberInEra: 4 },
        "factory": { basePrice: 10000, income: 1000, amount: 0, baseIncome: 1000, multiplier: 1, era: 1, numberInEra: 5 },
        "factory-worker": { basePrice: 50000, income: 5000, amount: 0, baseIncome: 5000, multiplier: 1, era: 1, numberInEra: 6 },
        "child-worker": { basePrice: 100000, income: 7500, amount: 0, baseIncome: 7500, multiplier: 1, era: 1, numberInEra: 7 },
        "car-production": { basePrice: 500000, income: 10000, amount: 0, baseIncome: 10000, multiplier: 1, era: 1, numberInEra: 8 },
    }
};
const itemHotkeys = [
    "hands",
    "loom",
    "coal-cart",
    "steam-engine",
    "factory",
    "factory-worker",
    "child-worker",
    "car-production"
];
function handlePurchasing(itemNumber) {
    let itemName = null;
    switch (gameState.era) {
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
    if (!itemName)
        return;
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
    if (productElement) {
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
}
function getNextPrice(itemKey) {
    const base = gameState.ITEMS[itemKey].basePrice;
    const amountOwned = gameState.ITEMS[itemKey].amount;
    // 1.15 is your 15% increase
    const multiplier = Math.pow(1.15, amountOwned);
    return Math.floor(base * multiplier);
}
function unlockUpgrade(upgradeName) {
    let thingy = document.querySelector(`[data-product="${upgradeName}"]`);
    if (thingy) {
        thingy.style.display = "flex";
    }
}
function earnMoneyOnClick() {
    gameState.money += (gameState.ITEMS["hands"].amount + 1) * gameState.ITEMS["hands"].multiplier;
    updateDisplay();
}
// this is for adding the hotkey for child labour only if its activated
function checkForEvents() {
    if (gameState.ITEMS["factory"].amount >= 1 && !gameState.events["child-worker-triggered"]) {
        childLabourEvent();
        gameState.events["child-worker-triggered"] = true;
    }
}
setInterval(() => {
    calculateIncome();
}, 100);
function calculateIncome() {
    let income = 0;
    for (const itemKey in gameState.ITEMS) {
        if (itemKey === "hands")
            continue;
        income += gameState.ITEMS[itemKey].income * gameState.ITEMS[itemKey].amount * gameState.ITEMS[itemKey].multiplier;
    }
    income /= 10;
    gameState.money += income;
    updateDisplay();
}
async function saveGame() {
    if (!currentUser.id)
        return;
    currentUser.gameState = JSON.stringify(gameState);
    try {
        await fetch('/users/update', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(currentUser)
        });
        console.log("Game Saved Automatically");
    }
    catch (e) {
        console.error("Failed to save game", e);
    }
}
// Auto-save every 20 seconds
setInterval(saveGame, 20000);
//Helper function for appending the correct suffix
//** means exponent
function formatNumber(num) {
    if (num >= 10 ** 18) {
        return (num / 10 ** 18).toFixed(1) + "Qi";
    }
    else if (num >= 10 ** 15) {
        return (num / 10 ** 15).toFixed(1) + "Qa";
    }
    else if (num >= 10 ** 12) {
        return (num / 10 ** 12).toFixed(1) + "T";
    }
    else if (num >= 10 ** 9) {
        return (num / 10 ** 9).toFixed(1) + "B";
    }
    else if (num >= 10 ** 6) {
        return (num / 10 ** 6).toFixed(1) + "M";
    }
    return Math.floor(num).toLocaleString('da-DK');
}
// Inputs
//keydown listener for purchasing with hotkeys
window.addEventListener('keydown', (event) => {
    const activeElement = document.activeElement;
    const isTyping = activeElement instanceof HTMLInputElement ||
        activeElement instanceof HTMLTextAreaElement ||
        activeElement?.isContentEditable;
    if (isTyping)
        return;
    const keyNumber = parseInt(event.key);
    if (isNaN(keyNumber))
        return;
    if (keyNumber === 7 && !gameState.events["child-worker"]) {
        return;
    }
    const itemIndex = keyNumber - 1;
    if (itemIndex >= 0 && itemIndex < itemHotkeys.length) {
        const itemName = itemHotkeys[itemIndex];
        if (itemName === "child-worker" && !gameState.events["child-worker"]) {
            console.log("You have not unlocked child labour");
            return;
        }
        handlePurchasing(gameState.ITEMS[itemName].numberInEra);
    }
});
function showNotification(message) {
    const container = document.getElementById('notification-container');
    if (!container)
        return;
    // Create the element
    const toast = document.createElement('div');
    toast.className = 'notification';
    toast.innerText = message;
    // Add to container
    container.appendChild(toast);
    // Remove from DOM after the animation finishes (3 seconds total)
    setTimeout(() => {
        toast.remove();
    }, 3000);
}
window.addEventListener('DOMContentLoaded', () => {
    updateDisplay();
    updateDisplayForEra();
    updateDisplayForUpgrades();
});
function getItemKey(era, numberInEra) {
    const entry = Object.entries(gameState.ITEMS).find(([key, item]) => item.era === era && item.numberInEra === numberInEra);
    return entry?.[0];
}
