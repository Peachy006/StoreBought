

//TODO check if you can afford upgrades
//TODO remove money when buying
//TODO make it so that when buying upgrades it doesnt copy the text
//TODO trigger ethical choice when buying factory
//TODO add ethical choice popup

interface GameState {
    // -1 for ethically wrong decision, +1 for good decision
    cookiesPerClick: number;
    money: number;
    karma: number;

    
    ITEMS: Record<string, { basePrice: number, income: number, amount: number, nextPrice: number, baseIncome: number, multiplier: number}>;
}


let gameState: GameState = {
    cookiesPerClick: 1,
    money: 0,
    karma: 0,

    //things that can change
    
    ITEMS: {
        "hands": { basePrice: 15, income: 1, amount: 1, nextPrice: 1, baseIncome: 1, multiplier: 1},
        "loom": { basePrice: 100, income: 5, amount: 1, nextPrice: 5, baseIncome: 5, multiplier: 1},
        "coal-cart": { basePrice: 500, income: 10, amount: 1, nextPrice: 10, baseIncome: 10, multiplier: 1},
        "steam-engine": { basePrice: 2500, income: 100, amount: 1, nextPrice: 100, baseIncome: 100, multiplier: 1},
        "factory": { basePrice: 10000, income: 1000, amount: 1, nextPrice: 1000, baseIncome: 1000, multiplier: 1},
        "factory-worker": { basePrice: 5000, income: 5000, amount: 1, nextPrice: 5000, baseIncome: 5000, multiplier: 1},
        "child-worker": { basePrice: 5000, income: 7500, amount: 1, nextPrice: 7500, baseIncome: 7500, multiplier: 1},
        "car-production": { basePrice: 10000, income: 10000, amount: 1, nextPrice: 10000, baseIncome: 10000, multiplier: 1},
    }

};



//inventory
//basePrices



function handlePurchasing(itemName: string): void {
    const currentAmount = gameState.ITEMS[itemName].amount;
    gameState.ITEMS[itemName].amount = currentAmount + 1;

    const productElement = document.querySelector(`[data-product="${itemName}"]`);

    if(productElement) {
        const ownedElement = productElement.querySelector('.product-owned');
        if (ownedElement) {
            ownedElement.textContent = String(gameState.ITEMS[itemName].amount);
        }
        const nextPrice = getNextPrice(itemName);
        const costElement = productElement.querySelector('.product-cost span');
        if (costElement) {
            costElement.textContent = String(nextPrice);
        }
    }


}

function getNextPrice(itemKey: string): number {
    const base = gameState.ITEMS[itemKey].basePrice;
    const amountOwned = gameState.ITEMS[itemKey].amount;

    // 1.15 is your 15% increase
    const multiplier = Math.pow(1.15, amountOwned);

    return Math.floor(base * multiplier);
}

function unlockUpgrade(upgradeName: string): void {
    let thingy = document.querySelector(`[data-upgrade="${upgradeName}"]`) as HTMLElement;
    if(thingy) {
        thingy.style.display = "flex";
    }
}

function earnMoneyOnClick(): void{
    gameState.money += gameState.ITEMS["hands"].amount * gameState.ITEMS["hands"].multiplier;
    updateDisplay();
}

function updateDisplay() {
    let element = document.getElementById("money-display");
    if(element) {
        element.textContent = String(gameState.money);
    }
}