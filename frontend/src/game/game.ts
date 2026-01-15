interface GameState {
    // -1 for ethically wrong decision, +1 for good decision
    cookiesPerClick: number;
    money: number;
    karma: number;
    events: Record<string, boolean>;
    era: number;

    
    ITEMS: Record<string, {
        basePrice: number,
        income: number,
        amount: number,
        baseIncome: number,
        numberInEra: number,
        multiplier: number,
        era: number,
        lockedByDefault: boolean
    }>;
}


let gameState: GameState = {
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
        "hands": { basePrice: 15, income: 1, amount: 0, baseIncome: 1, multiplier: 1, era: 1, numberInEra: 1, lockedByDefault: false},
        "loom": { basePrice: 150, income: 4, amount: 0, baseIncome: 4, multiplier: 1, era: 1, numberInEra: 2, lockedByDefault: false},
        "coal-cart": { basePrice: 800, income: 15, amount: 0, baseIncome: 15, multiplier: 1, era: 1, numberInEra: 3, lockedByDefault: false},
        "steam-engine": { basePrice: 4500, income: 60, amount: 0, baseIncome: 60, multiplier: 1, era: 1, numberInEra: 4, lockedByDefault: false},
        "factory": { basePrice: 25000, income: 250, amount: 0, baseIncome: 250, multiplier: 1, era: 1, numberInEra: 5, lockedByDefault: false},
        "factory-worker": { basePrice: 125000, income: 1000, amount: 0, baseIncome: 1000, multiplier: 1, era: 1, numberInEra: 6, lockedByDefault: false},
        "child-worker": { basePrice: 400000, income: 2500, amount: 0, baseIncome: 2500, multiplier: 1, era: 1, numberInEra: 7, lockedByDefault: true},
        "car-production": { basePrice: 1500000, income: 8000, amount: 0, baseIncome: 8000, multiplier: 1, era: 1, numberInEra: 8, lockedByDefault: false},
    }

};

//this needs to be changed to numberSystem instead
const itemHotkeys: string[] = [
    "hands",
    "loom",
    "coal-cart",
    "steam-engine",
    "factory",
    "factory-worker",
    "child-worker",
    "car-production"
];


function getNextPrice(itemKey: string): number {
    const base = gameState.ITEMS[itemKey].basePrice;
    const amountOwned = gameState.ITEMS[itemKey].amount;

    // 1.15 is your 15% increase
    const multiplier = Math.pow(1.15, amountOwned);

    return Math.floor(base * multiplier);
}


// this is for adding the hotkey for child labour only if its activated
function checkForEvents(): void {
    if(gameState.ITEMS["factory"].amount >= 1 && !gameState.events["child-worker-triggered"]) {
        childLabourEvent();
        gameState.events["child-worker-triggered"] = true;
    }
}

setInterval(() => {
    calculateIncome();
}, 100);

function calculateIncome(): void {
    let income = 0;
    for(const itemKey in gameState.ITEMS) {
        if(itemKey === "hands") continue;
        income += gameState.ITEMS[itemKey].income * gameState.ITEMS[itemKey].amount * gameState.ITEMS[itemKey].multiplier;
    }
    income /= 10;
    gameState.money += income;
    updateDisplay();
}

// Inputs

//keydown listener for purchasing with hotkeys
window.addEventListener('keydown', (event: KeyboardEvent) => {
    const activeElement = document.activeElement;
    const isTyping = activeElement instanceof HTMLInputElement ||
        activeElement instanceof HTMLTextAreaElement ||
        (activeElement as HTMLElement)?.isContentEditable;

    if (isTyping) return;

    const keyNumber = parseInt(event.key)
    if(isNaN(keyNumber)) return;

    if (keyNumber === 7 && !gameState.events["child-worker"]) {
        return;
    }

    const itemIndex = keyNumber - 1;

    if(itemIndex >= 0 && itemIndex < itemHotkeys.length) {
        const itemName = itemHotkeys[itemIndex];

        if(itemName === "child-worker" && !gameState.events["child-worker"]) {
            console.log("You have not unlocked child labour");
            return;
        }

        handlePurchasing(gameState.ITEMS[itemName].numberInEra);
    }
});

function showNotification(message:any) {
    const container = document.getElementById('notification-container');
    if(!container) return;

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
