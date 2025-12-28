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