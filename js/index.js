// Variables
const balanceText = document.querySelector(".balance-amount");
const betText = document.querySelector(".bet-amount");
const chipBtns = document.querySelectorAll(".btn-chips");
const clearBtn = document.querySelector(".btn-clear");
const dealer = document.querySelector(".dealer-card-container");
const dealBtn = document.querySelector(".btn-deal");
const doubleDownBtn = document.querySelector(".btn-doubleDown");
const player = document.querySelector(".player-card-container");
const splitBtn = document.querySelector(".btn-split");
const standBtn = document.querySelector(".btn-stand");
const cardShoe = [];
let totalBalanceAmt = 1000;
let totalBetAmt = 0;

const cardValueObj = {
  ace: [1, 11],
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9,
  10: 10,
  jack: 10,
  queen: 10,
  king: 10,
};

function createCardDeck() {
  const cardSuit = ["clubs", "diamonds", "hearts", "spades"];
  const cardValue = Object.keys(cardValueObj);

  for (let suit of cardSuit) {
    for (let val of cardValue) {
      cardShoe.push(`${suit}_${val}`);
    }
  }
  shuffleCards(cardShoe);
}

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

    disableActionBtns();
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

function dealNewHand() {
  // Chip btns should not work while hand is being played.
  disableChipBtns();

  // Enables action btns from disabled state when wagers are being placed.
  enableActionBtns();

  const dealerHand = [];
  const playerHand = [];

  playerHand[0] = cardShoe.shift();
  dealerHand[0] = cardShoe.shift();
  playerHand[1] = cardShoe.shift();
  dealerHand[1] = cardShoe.shift();

  setTimeout(() => {
    let cardImage = document.createElement("img");
    cardImage.setAttribute("src", `../images/${playerHand[0]}.svg`);
    player.appendChild(cardImage);
  }, 0);

  setTimeout(() => {
    let cardImage2 = document.createElement("img");
    cardImage2.setAttribute("src", `../images/${dealerHand[0]}.svg`);
    dealer.appendChild(cardImage2);
  }, 700);

  setTimeout(() => {
    let cardImage3 = document.createElement("img");
    cardImage3.setAttribute("src", `../images/${playerHand[1]}.svg`);
    player.appendChild(cardImage3);
  }, 1400);

  setTimeout(() => {
    let cardImage4 = document.createElement("img");
    cardImage4.setAttribute("src", `../images/back.svg`);
    dealer.appendChild(cardImage4);
  }, 2100);

  evalDealerHand(dealerHand);
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

function enableActionBtns() {
  standBtn.classList.remove("btn-no-hover");
  doubleDownBtn.classList.remove("btn-no-hover");
  splitBtn.classList.remove("btn-no-hover");
}

function enableBtn(btnEl) {
  // Enables btn. Takes in arg of btn element.
  btnEl.classList.remove("btn-no-hover");
}

function enableChipBtns() {
  // Enables clear bet btn.
  clearBtn.classList.remove("btn-no-hover");

  // Enables all chip btns.
  for (let item of chipBtns) {
    item.classList.remove("btn-no-hover");
  }
}

function evalHand(hand) {
  let total = 0;
  for (let item of hand) {
    let card = item.split("_")[1];
    let cardVal = cardValueObj[card];
    total += cardVal;
  }
  return total;
}

function evalDealerHand(dealersHand) {
  // If dealer is showing ace, player has option to buy insurance.
  if (dealersHand[0].split("_").includes("ace")) {
    alert("Purchase insurance?");
  }
}

function handleDealClick() {
  dealBtn.addEventListener("click", dealNewHand);
}

function isPair(playersHand) {
  return playersHand[0].split("_")[1] === playersHand[1].split("_")[1];
}

function isAceUnderneath(dealersHand) {
  let dealerDownCard = dealersHand[0].split("_")[1];

  // Todo: update this to losing state
  if (dealerDownCard === "ace") console.log("Dealer has backjack");
}

function isTenShowing(dealersHand) {
  let dealerUpCard = dealersHand[0].split("_")[1];
  if (cardValueObj[dealerUpCard] === 10) {
    isAceUnderneath(dealersHand);
  } else {
    return false;
  }
}

function shuffleCards(deck) {
  // Durstenfeld Shuffle Algorithm
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

function startNewHand() {
  createCardDeck();
  calcBetAmt();
  handleDealClick();
}

startNewHand();
