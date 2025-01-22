const options = [
    { price: 275, quantity: 5, tier: 3 },
    { price: 175, quantity: 3, tier: 2 },
    { price: 60, quantity: 1, tier: 1 },
    { price: 500, quantity: 10, tier: 4 }
];

function calculateMinimumCost(backupsNeeded, unlockedTiers) {
    let remainingBackups = backupsNeeded;
    let totalCost = 0;
    const selectedOptions = options.filter(option => unlockedTiers.includes(option.tier));

    selectedOptions.sort((a, b) => (a.price / a.quantity) - (b.price / b.quantity));

    const breakdown = { 1: 0, 3: 0, 5: 0, 10: 0 };

    for (const option of selectedOptions) {
        if (remainingBackups === 0) break;

        const unitsToBuy = Math.floor(remainingBackups / option.quantity);
        if (unitsToBuy > 0) {
            totalCost += unitsToBuy * option.price;
            breakdown[option.quantity] += unitsToBuy;
            remainingBackups -= unitsToBuy * option.quantity;
        }
    }

    if (remainingBackups > 0) {
        const cheapestOption = selectedOptions[0];
        totalCost += cheapestOption.price;
        breakdown[cheapestOption.quantity]++;
    }

    return { totalCost: totalCost.toFixed(2), breakdown };
}

function displayMinimumCost() {
    const inputField = document.getElementById('backup-input');
    const resultDiv = document.getElementById('result');
    const tier2 = document.getElementById('tier-2').checked;
    const tier3 = document.getElementById('tier-3').checked;
    const tier4 = document.getElementById('tier-4').checked;

    const backupsNeeded = parseInt(inputField.value, 10);
    if (isNaN(backupsNeeded) || backupsNeeded <= 0) {
        resultDiv.innerHTML = 'Please enter a valid number of backups.';
        return;
    }

    const unlockedTiers = [1];
    if (tier2) unlockedTiers.push(2);
    if (tier3) unlockedTiers.push(3);
    if (tier4) unlockedTiers.push(4);

    const { totalCost, breakdown } = calculateMinimumCost(backupsNeeded, unlockedTiers);

    resultDiv.innerHTML = `
        The minimum cost for ${backupsNeeded} backups is ${totalCost} WB.<br>
        Breakdown:<br>
        - ${breakdown[1]} of 1 (60 Warbonds)<br>
        - ${breakdown[3]} of 3 (175 Warbonds)<br>
        - ${breakdown[5]} of 5 (275 Warbonds)<br>
        - ${breakdown[10]} of 10 (500 Warbonds)
    `;
}

function toggleTiers(selectedTier) {
    const tier2 = document.getElementById('tier-2');
    const tier3 = document.getElementById('tier-3');
    const tier4 = document.getElementById('tier-4');

    if (selectedTier === 4) {
        tier2.checked = false;
        tier3.checked = false;
    } else if (selectedTier === 3) {
        tier2.checked = false;
    }
}

document.getElementById('calculate-button').addEventListener('click', displayMinimumCost);
