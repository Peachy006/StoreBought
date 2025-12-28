

//TODO make money on click
//TODO add economy
//TODO check if you can afford upgrades
//TODO remove money when buying
//TODO make it so that when buying upgrades it doesnt copy the text
//TODO trigger ethical choice when buying factory
//TODO add ethical choice popup

interface GameState {
    // -1 for ethically wrong decision, +1 for good decision
    karma: number;
    money: number;
    cookiesPerClick: number;
    inventory: Record<string, number>;
    baseIncome: Record<string, number>;
    multipliers: Record<string, number>;

}


const ITEM_CONFIG: Record<string, { price: number}> = {
    "hands": { price: 15  },
    "loom": { price: 100  },
    "coal-cart": { price: 500 },
    "steam-engine": { price: 2500 },
    "factory": { price: 10000 },
    "factory-worker": { price: 5000 },
    "child-worker": { price: 5000 },
    "car-production": { price: 10000 },
};




let gameState: GameState = {
    cookiesPerClick: 1,
    money: 0,
    karma: 0,

    inventory: {
        "hands": 0,
        "loom": 0,
        "coal-cart": 0,
        "steam-engine": 0,
        "factory": 0,
        "factory-worker": 0,
        "child-worker": 0,
        "car-production": 0,
    },

    baseIncome: {
        //Saves income from products
        "hands": 1,
        "loom": 5,
        "coal-cart": 10,
        "steam-engine": 100,
        "factory": 1000,
        "factory-worker": 5000,
        "child-worker": 7500,
        "car-production": 10000,
    },
    multipliers: {
        "hands": 1,
        "loom": 1,
        "coal-cart": 1,
        "steam-engine": 1,
        "factory": 1,
        "factory-worker": 1,
        "child-worker": 1,
        "car-production": 1,
    },

};
//inventory
//basePrices



function handlePurchasing(itemName: string): void {
    const currentAmount = gameState.inventory[itemName];
    gameState.inventory[itemName] = currentAmount + 1;

    const productElement = document.querySelector(`[data-product="${itemName}"]`);

    if(productElement) {
        const ownedElement = productElement.querySelector('.product-owned');
        if (ownedElement) {
            ownedElement.textContent = String(gameState.inventory[itemName]);
        }
        const nextPrice = getNextPrice(itemName);
        const costElement = productElement.querySelector('.product-cost span');
        if (costElement) {
            costElement.textContent = String(nextPrice);
        }
    }


}

function getNextPrice(itemKey: string): number {
    const base = ITEM_CONFIG[itemKey].price;
    const amountOwned = gameState.inventory[itemKey];

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
    gameState.money += gameState.inventory["hands"] * gameState.multipliers["hands"];
    updateDisplay();
}

function updateDisplay() {
    let element = document.getElementById("money-display");
    if(element) {
        element.textContent = String(gameState.money);
    }
}