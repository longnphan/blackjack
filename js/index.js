// Variables
const balanceText = document.querySelector(".balance-amount");
const betText = document.querySelector(".bet-amount");
const chipBtns = document.querySelectorAll(".btn-chips");
const clearBtn = document.querySelector(".btn-clear");
const dealer = document.querySelector(".dealer-cards");
const dealBtn = document.querySelector(".btn-deal");
const doubleDownBtn = document.querySelector(".btn-doubleDown");
const hitBtn = document.querySelector(".btn-hit");
const player = document.querySelector(".player-cards");
const splitBtn = document.querySelector(".btn-split");
const standBtn = document.querySelector(".btn-stand");
const cardShoe = [];
let totalBalanceAmt = 1000;
let totalBetAmt = 0;
let dealerHand = [];
let playerHand = [];

const cardValueObj = {
  ace: 11,
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

function addBtnListeners() {
  // Adds event listeners to poker chip btns.
  for (let item of chipBtns) {
    item.addEventListener("click", e => chipValue(e));
  }

  clearBtn.addEventListener("click", clearBet);
  dealBtn.addEventListener("click", dealNewHand);
  hitBtn.addEventListener("click", playerHit);
}

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
  clearBet();
  disableActionBtns();
}

function chipValue(event) {
  let chipValue = Number(event.target.textContent);

  // Can't place bet if balance is 0.
  if (totalBalanceAmt - chipValue >= 0) {
    totalBetAmt += chipValue;
    betText.textContent = `$${totalBetAmt}`;

    // Decrement Balance when chips are clicked on.
    totalBalanceAmt -= chipValue;
    balanceText.textContent = `$${totalBalanceAmt}`;
  }
}

function clearBet() {
  totalBalanceAmt += totalBetAmt;
  totalBetAmt = 0;
  betText.textContent = `$${totalBetAmt}`;
  balanceText.textContent = `$${totalBalanceAmt}`;
}

function dealNewHand() {
  // To-do: move dealerHand and playerHand arrs back here?

  dealerHand = [];
  playerHand = [];

  // Chip btns should not work while hand is being played.
  disableChipBtns();

  // Disables deal btn.
  dealBtn.classList.add("btn-no-hover");

  // Enables action btns except deal btn, from disabled state when wagers are being placed.
  enableActionBtns();

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

  // console.log("dealer hand is:", dealerHand);
  // console.log("player hand is:", playerHand);
  // console.log(evalDealerHand("evalDealerHand:", dealerHand));
  // console.log(evalHand("regular DEALER evalHand:", dealerHand));
  console.log("Dealers hand is:", evalHand(dealerHand));
  console.log("Player hand is:", evalHand(playerHand));
}

function disableActionBtns() {
  hitBtn.classList.add("btn-no-hover");
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

function disableChipBtn(btnEl) {
  btnEl.classList.add("btn-no-hover");
}

function enableActionBtns() {
  hitBtn.classList.remove("btn-no-hover");
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
  // if (dealersHand[0].split("_").includes("ace")) {
  //   alert("Purchase insurance?");
  // }
  return;
}

function handleHitClick() {
  hitBtn.addEventListener("click", playerHit);
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

function playerBust() {
  // w/o setTimeout, new card is never rendered and goes straight to alert.
  setTimeout(() => {
    alert("Player busts. You lose.");
    // Clears cards from UI.
    dealer.innerHTML = "";
    player.innerHTML = "";
  }, 500);

  updateBalance();
  startNewHand();
}

// Disbles action btns.
disableActionBtns();

function playerHit() {
  // Disables double down button, since player already hit.
  disableChipBtn(doubleDownBtn);

  let nextCard = cardShoe.shift();
  playerHand.push(nextCard);

  // Adds new card to players hand
  let cardImage = document.createElement("img");
  cardImage.setAttribute("src", `../images/${nextCard}.svg`);
  player.appendChild(cardImage);

  // Recalculates player new total.
  let playerTotal = evalHand(playerHand);
  console.log("new player total in PlayerHit is:", playerTotal);

  if (playerTotal === 21) {
    console.log("Player has 21! You can no longer hit.");
  } else if (playerTotal > 21) {
    playerBust();
  }
}

function playerStand() {
  let dealerTotal = evalHand(dealerHand);
  let playerTotal = evalHand(playerHand);
  if (playerTotal <= 21 && playerTotal > dealerTotal) {
    console.log("player wins");
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
  console.log("Bet amount in new game:", totalBetAmt);
  createCardDeck();
  calcBetAmt();
  enableChipBtns();
  enableBtn(dealBtn);
}

function updateBalance() {
  totalBetAmt = 0;
  betText.textContent = `$${totalBetAmt}`;
  balanceText.textContent = `$${totalBalanceAmt}`;
}

addBtnListeners();
startNewHand();
