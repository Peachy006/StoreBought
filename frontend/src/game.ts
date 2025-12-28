

//TODO make money on click
//TODO add economy
//TODO check if you can afford upgrades
//TODO remove money when buying
//TODO make it so that when buying upgrades it doesnt copy the text
//TODO trigger ethical choice when buying factory

interface GameState {
    karma: number; // -1 for ethically wrong decision, +1 for good decision
    inventory: Record<string, number>;
    basePrices: Record<string, number>;
    baseIncome: Record<string, number>;
}


let gameState: GameState = {

    karma: 0,
    //Saves the amount of products players have bought.
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

    basePrices: {
        //Saves basePrice of product when you buy it for the first time
        "hands": 15,
        "loom": 100,
        "coal-cart": 500,
        "steam-engine": 2500,
        "factory": 10000,
        "factory-worker": 5000,
        "child-worker": 5000,
        "car-production": 10000
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
    const base = gameState.basePrices[itemKey];
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