// Variables
const balanceText = document.querySelector(".balance-amount");
const betText = document.querySelector(".bet-amount");
const chipBtns = document.querySelectorAll(".btn-chips");
const clearBtn = document.querySelector(".btn-clear");
const dealBtn = document.querySelector(".btn-deal");
const doubleDownBtn = document.querySelector(".btn-doubleDown");
const splitBtn = document.querySelector(".btn-split");
const standBtn = document.querySelector(".btn-stand");
let totalBalanceAmt = 1000;
let totalBetAmt = 0;

function calcBetAmt() {
  // Increment bet amount when chips are clicked on.
  for (let item of chipBtns) {
    item.addEventListener("click", e => {
      let chipValue = Number(e.target.textContent);

      // Can't place bet if balance is 0.
      if (totalBalanceAmt - chipValue >= 0) {
        totalBetAmt += chipValue;
        betText.textContent = `$${totalBetAmt}`;

        // Decrement Balance when chips are clicked on.
        totalBalanceAmt -= chipValue;
        balanceText.textContent = `$${totalBalanceAmt}`;
      }
    });
    // Adds event listener to clear bet btn.
    clearBet();
  }
}

function clearBet() {
  clearBtn.addEventListener("click", () => {
    totalBalanceAmt += totalBetAmt;
    totalBetAmt = 0;
    betText.textContent = `$${totalBetAmt}`;
    balanceText.textContent = `$${totalBalanceAmt}`;
  });
}

function disableActionBtns() {
  standBtn.classList.add("btn-no-hover");
  doubleDownBtn.classList.add("btn-no-hover");
  splitBtn.classList.add("btn-no-hover");
}

function disableChipBtns() {
  // Disables clear bet btn.
  clearBtn.classList.add("btn-no-hover");

  // Disables all chip btns.
  for (let item of chipBtns) {
    item.classList.add("btn-no-hover");
  }
}

disableActionBtns();
calcBetAmt();

// Might use later
// clearBet.removeAttribute("disabled");
// clearBet.setAttribute("disabled", "disabled");
