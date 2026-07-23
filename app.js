// ==========================================
// FeeFlow v0.1 Alpha
// app.js
// ==========================================

// ---------- App Constants ----------

const REGIMES = {
    pre: {
        complianceFee: 75,
        enforcementBaseFee: 235
    },
    post: {
        complianceFee: 79,
        enforcementBaseFee: 247
    }
};

// ---------- Get Page Elements ----------

const balanceInput = document.getElementById("balance");
const calculateButton = document.getElementById("calculateButton");
const resetButton = document.getElementById("resetButton");

const resultsCard = document.getElementById("results");
const recentList = document.getElementById("recentList");

const enforcementFeeOutput = document.getElementById("enforcementFee");
const newBalanceOutput = document.getElementById("newBalance");

const breakdownModal = document.getElementById("breakdownModal");
const breakdownText = document.getElementById("breakdownText");
const closeBreakdown = document.getElementById("closeBreakdown");

// ---------- Utility Functions ----------

function getSelectedRegime() {

    const selected = document.querySelector(
        'input[name="regime"]:checked'
    );

    return selected.value;

}

function roundUpToWholePound(value) {

    return Math.ceil(value);

}

function formatCurrency(value) {

    return "£" + value.toFixed(2);

}

// ---------- Calculation Engine ----------

function calculateFee(balance, regime) {

    const settings = REGIMES[regime];

    const balanceWithoutCompliance =
        balance - settings.complianceFee;

    let enforcementFee =
        settings.enforcementBaseFee;

    if (balanceWithoutCompliance > 1500) {

        const amountAboveThreshold =
            balanceWithoutCompliance - 1500;

        enforcementFee += roundUpToWholePound(
            amountAboveThreshold * 0.075
        );

    }

    return {

        enforcementFee,

        newBalance:
            balance + enforcementFee

    };

}
// ---------- Display Results ----------

function displayResults(result) {

    enforcementFeeOutput.textContent =
        "£" + result.enforcementFee.toFixed(0);

    newBalanceOutput.textContent =
        formatCurrency(result.newBalance);

    resultsCard.classList.remove("hidden");

}

// ---------- Calculate Button ----------

calculateButton.addEventListener("click", () => {

    const balance =
        parseFloat(balanceInput.value);

    if (isNaN(balance) || balance <= 0) {

        alert("Please enter a valid balance.");

        return;

    }

    const regime =
        getSelectedRegime();

    const result =
    calculateFee(balance, regime);

lastCalculation = {

    balance,
    regime,
    result,
    breakdown: createBreakdown(balance, regime, result)

};
    calculationHistory.unshift({
    balance,
    regime,
    fee: result.enforcementFee,
    newBalance: result.newBalance
});

if (calculationHistory.length > 5) {
    calculationHistory.pop();
}

updateHistory();

displayResults(result);
});

// ---------- Reset Button ----------

resetButton.addEventListener("click", () => {

    balanceInput.value = "";

    enforcementFeeOutput.textContent = "£0.00";

    newBalanceOutput.textContent = "£0.00";

    resultsCard.classList.add("hidden");

});
// ---------- Breakdown ----------

const breakdownButton = document.getElementById("breakdownButton");
const copyButton = document.getElementById("copyButton");

let lastCalculation = null;
let calculationHistory = [];

function createBreakdown(balance, regime, result) {

    const settings = REGIMES[regime];

    const balanceWithoutCompliance =
        balance - settings.complianceFee;

    let text =
`Fee Breakdown

Original balance entered:
${formatCurrency(balance)}

Compliance stage fee already included:
${formatCurrency(settings.complianceFee)}

Balance after removing compliance fee:
${formatCurrency(balanceWithoutCompliance)}

Base enforcement fee:
${formatCurrency(settings.enforcementBaseFee)}
`;

    if (balanceWithoutCompliance > 1500) {

        const excess =
            balanceWithoutCompliance - 1500;

        const percentage =
            roundUpToWholePound(excess * 0.075);

        text += `
Amount above £1,500:
${formatCurrency(excess)}

7.5% (rounded up):
£${percentage.toFixed(0)}
`;

    } else {

        text += `
Balance did not exceed £1,500.

No percentage fee applied.
`;

    }

    text += `
--------------------------------

Final Enforcement Fee:
£${result.enforcementFee.toFixed(0)}

New Balance:
${formatCurrency(result.newBalance)}
`;

    return text;

}

// ---------- Breakdown Button ----------

breakdownButton.addEventListener("click", () => {

    if (!lastCalculation) return;

    breakdownText.textContent = lastCalculation.breakdown;

    breakdownModal.classList.remove("hidden");

    
});

    closeBreakdown.addEventListener("click", () => {

    breakdownModal.classList.add("hidden");


});


// ---------- Copy Summary ----------

copyButton.addEventListener("click", async () => {

    if (!lastCalculation) return;

    const summary =
`FeeFlow Summary

Regime:
${lastCalculation.regime === "pre" ? "Pre May" : "Post May"}

Original Balance:
${formatCurrency(lastCalculation.balance)}

Enforcement Fee:
£${lastCalculation.result.enforcementFee.toFixed(0)}

New Balance:
${formatCurrency(lastCalculation.result.newBalance)}
`;

    try {

        await navigator.clipboard.writeText(summary);

        alert("Summary copied.");

    } catch {

        alert(summary);

    }

});
// ---------- Greeting ----------

function updateGreeting() {

    const greeting = document.getElementById("greeting");

    const hour = new Date().getHours();

    if (hour < 12) {
        greeting.textContent = "Good Morning Adam 👋";
    }
    else if (hour < 18) {
        greeting.textContent = "Good Afternoon Adam ☀️";
    }
    else {
        greeting.textContent = "Good Evening Adam 🌙";
    }

}

updateGreeting();

function updateHistory() {

    if (calculationHistory.length === 0) {
        recentList.innerHTML = "<p>No calculations yet.</p>";
        return;
    }

    recentList.innerHTML = "";

    calculationHistory.forEach(item => {

        const card = document.createElement("div");

        card.className = "resultItem";

        card.innerHTML = `
            <div>
                <strong>${item.regime === "pre" ? "Pre May" : "Post May"}</strong><br>
                £${item.balance.toFixed(2)}
            </div>

            <div style="text-align:right;">
                Fee £${item.fee}<br>
                Total £${item.newBalance.toFixed(2)}
            </div>
        `;

        recentList.appendChild(card);

    });

}
