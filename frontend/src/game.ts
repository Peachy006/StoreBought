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
        multiplier: number,
        era: number
    }>;
}


let gameState: GameState = {
    cookiesPerClick: 1,
    money: 0,
    karma: 0,
    era: 1,

    events: {
        "child-labour-triggered": false,
        "child-labour": false
    },
    
    ITEMS: {
        // income is pretty much useless for hands
        "hands": { basePrice: 15, income: 1, amount: 0, baseIncome: 1, multiplier: 1, era: 1},
        "loom": { basePrice: 100, income: 5, amount: 0, baseIncome: 5, multiplier: 1, era: 1},
        "coal-cart": { basePrice: 500, income: 10, amount: 0, baseIncome: 10, multiplier: 1, era: 1},
        "steam-engine": { basePrice: 2500, income: 100, amount: 0, baseIncome: 100, multiplier: 1, era: 1},
        "factory": { basePrice: 10000, income: 1000, amount: 0, baseIncome: 1000, multiplier: 1, era: 1},
        "factory-worker": { basePrice: 50000, income: 5000, amount: 0, baseIncome: 5000, multiplier: 1, era: 1},
        "child-worker": { basePrice: 100000, income: 7500, amount: 0, baseIncome: 7500, multiplier: 1, era: 1},
        "car-production": { basePrice: 500000, income: 10000, amount: 0, baseIncome: 10000, multiplier: 1, era: 1},
    }

};


window.addEventListener('DOMContentLoaded', () => {
    updateDisplay();
    updateDisplayForEra();
    if (gameState.events["child-labour"]) {
        unlockUpgrade("child-worker");
    }
});

function handlePurchasing(itemName: string): void {
    if (itemName === "child-worker" && !gameState.events["child-labour"]) {
        console.log("Adgang nægtet: Du har ikke valgt børnearbejde.");
        return;
    }

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
}


function getNextPrice(itemKey: string): number {
    const base = gameState.ITEMS[itemKey].basePrice;
    const amountOwned = gameState.ITEMS[itemKey].amount;

    // 1.15 is your 15% increase
    const multiplier = Math.pow(1.15, amountOwned);

    return Math.floor(base * multiplier);
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

function checkForEvents(): void {
    if(gameState.ITEMS["factory"].amount >= 1 && !gameState.events["child-labour-triggered"]) {
        childLabourEvent();
        gameState.events["child-labour-triggered"] = true;
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




async function saveGame(): Promise<void> {
    if (!currentUser.id) return;

    currentUser.gameState = JSON.stringify(gameState);
    try {
        await fetch('/users/update', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(currentUser)
        });
        console.log("Game Saved Automatically");
    } catch (e) {
        console.error("Failed to save game", e);
    }
}

// Auto-save every 20 seconds
setInterval(saveGame, 20000);

function updateDisplay() {
    let element = document.getElementById("money-display");
    if(element) {
        element.textContent = formatNumber(Math.floor(gameState.money));
    }

    //passive
    const elementTwo = document.getElementById("cookies-per-second");
    if(elementTwo) {
        let incomePerSecond = 0;
        for(const itemKey in gameState.ITEMS) {
            if(itemKey === "hands") continue;
            incomePerSecond += gameState.ITEMS[itemKey].income * gameState.ITEMS[itemKey].amount * gameState.ITEMS[itemKey].multiplier;
        }
        elementTwo.textContent = formatNumber(Math.floor(incomePerSecond));
    }

    //click
    const clickElement = document.getElementById("click-amount");
    if(clickElement) {
        let clickAmount = (gameState.ITEMS["hands"].amount + 1) * gameState.ITEMS["hands"].multiplier;
        clickElement.textContent = formatNumber(clickAmount);
    }

}

//Helper function for appending the correct Suffix
function formatNumber(num: number): string {
    if (num >= 1000000000) {
        return (num/1000000000).toFixed(1) + "B";
    }
    else if(num >= 1000000) {
        return (num/1000000).toFixed(1) + "M";
    }
    return Math.floor(num).toLocaleString('da-DK');
}

// Inputs

const itemHotkeys: string[] = [
    "hands",
    "loom",
    "coal-cart",
    "steam-engine",
    "factory",
    "factory-worker",
    "child-worker"
];

window.addEventListener('keydown', (event: KeyboardEvent) => {
    const activeElement = document.activeElement;
    const isTyping = activeElement instanceof HTMLInputElement ||
        activeElement instanceof HTMLTextAreaElement ||
        (activeElement as HTMLElement)?.isContentEditable;

    if (isTyping) return;

    const keyNumber = parseInt(event.key)
    if(isNaN(keyNumber)) return;

    if (keyNumber === 7 && !gameState.events["child-labour"]) {
        console.log("Meow!");
        return;
    }

    const itemIndex = keyNumber - 1;

    if(itemIndex >= 0 && itemIndex < itemHotkeys.length) {
        const itemName = itemHotkeys[itemIndex];

        if(itemName === "child-worker" && !gameState.events["child-labour"]) {
            console.log("You have not unlocked child labour");
            return;
        }

        handlePurchasing(itemName);
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