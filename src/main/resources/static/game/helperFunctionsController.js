"use strict";
async function saveGame() {
    if (!currentUser.id)
        return;
    currentUser.gameState = JSON.stringify(gameState);
    try {
        await fetch('/users/update', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(currentUser)
        });
        console.log("Game Saved Automatically");
    }
    catch (e) {
        console.error("Failed to save game", e);
    }
}
// Auto-save every 20 seconds
setInterval(saveGame, 20000);
//Helper function for appending the correct suffix
//** means exponent
function formatNumber(num) {
    if (num >= 10 ** 18) {
        return (num / 10 ** 18).toFixed(1) + "Qi";
    }
    else if (num >= 10 ** 15) {
        return (num / 10 ** 15).toFixed(1) + "Qa";
    }
    else if (num >= 10 ** 12) {
        return (num / 10 ** 12).toFixed(1) + "T";
    }
    else if (num >= 10 ** 9) {
        return (num / 10 ** 9).toFixed(1) + "B";
    }
    else if (num >= 10 ** 6) {
        return (num / 10 ** 6).toFixed(1) + "M";
    }
    return Math.floor(num).toLocaleString('da-DK');
}
function getItemKey(era, numberInEra) {
    const entry = Object.entries(gameState.ITEMS).find(([key, item]) => item.era === era && item.numberInEra === numberInEra);
    return entry?.[0];
}
