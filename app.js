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

const enforcementFeeOutput = document.getElementById("enforcementFee");
const newBalanceOutput = document.getElementById("newBalance");

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
