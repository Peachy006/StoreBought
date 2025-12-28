interface GameEvent {
    id: string;
    title: string;
    description: string;
    image: string;
    onYes: () => void;
    onNo: () => void;
}

let childLabourProduct: GameEvent = {
    id: "child-labours",
    title: "Child Labour",
    image: "",
    description: 'The choice of child labour stands before you. Critics say -"Santa has his little helpers right?"',
    onYes: () => unlockUpgrade("child-worker"),
    onNo: () => console.log("No")
}

function childLabourEvent(): void {
    showMoralChoice(childLabourProduct.title, childLabourProduct.description);
}

type ChoiceType = 'good' | 'evil';

const overlay = document.getElementById('choice-overlay') as HTMLElement;

/**
 * Call this function whenever you want the thingy to show up
 */
function showMoralChoice(title: string, description: string) {
    const titleEl = document.getElementById('choice-title')!;
    const descEl = document.getElementById('choice-desc')!;

    titleEl.innerText = title;
    descEl.innerText = description;

    overlay.classList.remove('hidden');
}

/**
 * Handles the logic after a button is clicked
 */
function handleChoice(type: ChoiceType): void {
    console.log(`User chose the ${type} path.`);

    if (type === 'evil') {
        unlockUpgrade("child-worker");
    } else {
        //we dont know yet
    }

    // Hide the menu after choice
    overlay.classList.add('hidden');
}