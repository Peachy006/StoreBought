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
        "loom": { basePrice: 150, income: 4, amount: 0, baseIncome: 4, multiplier: 1, era: 1, numberInEra: 2 },
        "coal-cart": { basePrice: 800, income: 15, amount: 0, baseIncome: 15, multiplier: 1, era: 1, numberInEra: 3 },
        "steam-engine": { basePrice: 4500, income: 60, amount: 0, baseIncome: 60, multiplier: 1, era: 1, numberInEra: 4 },
        "factory": { basePrice: 25000, income: 250, amount: 0, baseIncome: 250, multiplier: 1, era: 1, numberInEra: 5 },
        "factory-worker": { basePrice: 125000, income: 1000, amount: 0, baseIncome: 1000, multiplier: 1, era: 1, numberInEra: 6 },
        "child-worker": { basePrice: 400000, income: 2500, amount: 0, baseIncome: 2500, multiplier: 1, era: 1, numberInEra: 7 },
        "car-production": { basePrice: 1500000, income: 8000, amount: 0, baseIncome: 8000, multiplier: 1, era: 1, numberInEra: 8 },
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
function getNextPrice(itemKey) {
    const base = gameState.ITEMS[itemKey].basePrice;
    const amountOwned = gameState.ITEMS[itemKey].amount;
    // 1.15 is your 15% increase
    const multiplier = Math.pow(1.15, amountOwned);
    return Math.floor(base * multiplier);
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
