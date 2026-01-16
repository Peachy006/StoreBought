interface GameEvent {
    id: string;
    title: string;
    description: string;
    image: string;
    onYes: () => void;
    onNo: () => void;
}

let childLabourProduct: GameEvent = {
    id: "child-worker",
    title: "Child worker",
    image: "",
    description: 'The choice of child labour stands before you. Critics say -"Santa has his little helpers right?"',
    onYes: () => unlockUpgrade("child-worker"),
    onNo: () => console.log("No")
}

//this gets called from the game.ts file
function childLabourEvent(): void {
    showMoralChoice(childLabourProduct.title, childLabourProduct.description);
}

type ChoiceType = 'good' | 'evil';

const overlay = document.getElementById('choice-overlay') as HTMLElement;



/**
 * Shows the moral choice overlay with the given title and description.
 * @param title
 * @param description
 */
function showMoralChoice(title: string, description: string) {
    const titleEl = document.getElementById('choice-title')!;
    const descEl = document.getElementById('choice-desc')!;

    titleEl.innerText = title;
    descEl.innerText = description;

    overlay.classList.remove('hidden');
}


/**
 * Handles the logic after a button is clicked.
 * @param type
 */
function handleChoice(type: ChoiceType): void {
    console.log(`User chose the ${type} path.`);

    if (type === 'evil') {
        unlockUpgrade("child-worker");
        gameState.events["child-worker"] = true;
    } else {
        console.log("Choose good karma - No child labour")
    }

    // Hide the menu after choice
    overlay.classList.add('hidden');
    updateDisplay();
}