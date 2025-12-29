

//TODO figure out what to do with next phase
//todo make it so that when you cant afford an upgrade its grey or indicated so in the ui
//todo add a better popup for when you cant afford something (its annyoing to close, it should be more subtle)
//todo switch around the price and amount in html, it doesnt look intuitive   maybe?
//todo move over the creation of html elements to typescript so we can switch eras easily
//todo number formatting for numbers (M B T Qa Qi)
//TODO add hotkeys for buying stuff
//TODO add the display for the income per second
//Todo the income per second freezes when the popup for you cant afford is open (also freezes when its not the open tab)


interface GameState {
    // -1 for ethically wrong decision, +1 for good decision
    cookiesPerClick: number;
    money: number;
    karma: number;
    events: Record<string, boolean>;

    
    ITEMS: Record<string, {
        basePrice: number,
        income: number,
        amount: number,
        baseIncome: number,
        multiplier: number
    }>;
}


let gameState: GameState = {
    cookiesPerClick: 1,
    money: 0,
    karma: 0,

    events: {
        "child-labour": false
    },
    
    ITEMS: {
        // income is pretty much useless for hands
        "hands": { basePrice: 15, income: 1, amount: 0, baseIncome: 1, multiplier: 1},
        "loom": { basePrice: 100, income: 5, amount: 0, baseIncome: 5, multiplier: 1},
        "coal-cart": { basePrice: 500, income: 10, amount: 0, baseIncome: 10, multiplier: 1},
        "steam-engine": { basePrice: 2500, income: 100, amount: 0, baseIncome: 100, multiplier: 1},
        "factory": { basePrice: 10000, income: 1000, amount: 0, baseIncome: 1000, multiplier: 1},
        "factory-worker": { basePrice: 50000, income: 5000, amount: 0, baseIncome: 5000, multiplier: 1},
        "child-worker": { basePrice: 100000, income: 7500, amount: 0, baseIncome: 7500, multiplier: 1},
        "car-production": { basePrice: 500000, income: 10000, amount: 0, baseIncome: 10000, multiplier: 1},
    }

};




function handlePurchasing(itemName: string): void {
    // Calculate the current price before purchasing
    const currentPrice = getNextPrice(itemName);

    if(gameState.money < currentPrice) {
        return alert("You can't afford that!");
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
            costElement.textContent = String(nextPrice);
        }
    }

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

function updateDisplay() {
    let element = document.getElementById("money-display");
    if(element) {
        element.textContent = Math.floor(gameState.money).toLocaleString();
    }
}

function checkForEvents(): void {
    if(gameState.ITEMS["factory"].amount >= 1 && !gameState.events["child-labour"]) {
        childLabourEvent();
        gameState.events["child-labour"] = true;
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