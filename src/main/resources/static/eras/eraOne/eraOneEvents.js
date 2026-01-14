"use strict";
let childLabourProduct = {
    id: "child-worker",
    title: "Child worker",
    image: "",
    description: 'The choice of child labour stands before you. Critics say -"Santa has his little helpers right?"',
    onYes: () => unlockUpgrade("child-worker"),
    onNo: () => console.log("No")
};
//this gets called from the game.ts file
function childLabourEvent() {
    showMoralChoice(childLabourProduct.title, childLabourProduct.description);
}
const overlay = document.getElementById('choice-overlay');
//Call this function whenever you want the thingy to show up
function showMoralChoice(title, description) {
    const titleEl = document.getElementById('choice-title');
    const descEl = document.getElementById('choice-desc');
    titleEl.innerText = title;
    descEl.innerText = description;
    overlay.classList.remove('hidden');
}
// Handles the logic after a button is clicked
function handleChoice(type) {
    console.log(`User chose the ${type} path.`);
    if (type === 'evil') {
        unlockUpgrade("child-worker");
        gameState.events["child-worker"] = true;
    }
    else {
        console.log("Choose good karma - No child labour");
    }
    // Hide the menu after choice
    overlay.classList.add('hidden');
    updateDisplay();
}
