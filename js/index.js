// Variables
const balanceText = document.querySelector(".balance-amount");
const betText = document.querySelector(".bet-amount");
const chipBtns = document.querySelectorAll(".btn-chips");
const clearBtn = document.querySelector(".btn-clear");
const dealer = document.querySelector(".dealer-cards");
const dealBtn = document.querySelector(".btn-deal");
const dealerText = document.querySelector(".dealer-total-text");
const doubleDownBtn = document.querySelector(".btn-doubleDown");
const hitBtn = document.querySelector(".btn-hit");
const newGameBtn = document.querySelector(".btn-newGame");
const player = document.querySelector(".player-cards");
const playerText = document.querySelector(".player-total-text");
const playerOutcome = document.querySelector(".player-outcome");
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
  newGameBtn.addEventListener("click", reset);
  dealBtn.addEventListener("click", dealNewHand);
  hitBtn.addEventListener("click", playerHit);
  standBtn.addEventListener("click", playerStand);
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

function clearCards() {
  // Clears cards from UI after hand is played.
  dealer.innerHTML = "";
  player.innerHTML = "";
  dealerText.textContent = "";
  playerText.textContent = "";
  playerOutcome.textContent = "";
}

function dealerFlipCard() {
  const faceDownCard = document.querySelector(".faceDown");
  faceDownCard.setAttribute("src", `../images/${dealerHand[1]}.svg`);
}

function dealerHit() {
  let nextCard = cardShoe.shift();
  dealerHand.push(nextCard);

  // Adds new card to dealers hand
  let cardImage = document.createElement("img");
  cardImage.setAttribute("src", `../images/${nextCard}.svg`);
  dealer.appendChild(cardImage);

  // Recalculates player new total.
  let dealerTotal = evalHand(dealerHand);
  console.log("new dealer total in DealerHit is:", dealerTotal);
}

function dealersTurn() {
  const faceDownCard = document.querySelector(".faceDown");
  faceDownCard.setAttribute("src", `../images/${dealerHand[1]}.svg`);
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
  newGameBtn.classList.add("btn-no-hover");

  playerHand[0] = cardShoe.shift();
  dealerHand[0] = cardShoe.shift();
  playerHand[1] = cardShoe.shift();
  dealerHand[1] = cardShoe.shift();

  let dealerTotalVal = evalHand(dealerHand);
  let playerTotalVal = evalHand(playerHand);

  setTimeout(() => {
    let cardImage = document.createElement("img");
    cardImage.setAttribute("src", `../images/${playerHand[0]}.svg`);
    cardImage.classList.add("playerFirstCard");
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
    cardImage3.classList.add("playerSecondCard");
    player.appendChild(cardImage3);

    playerText.textContent = playerTotalVal;
  }, 1400);

  setTimeout(() => {
    let cardImage4 = document.createElement("img");
    cardImage4.setAttribute("src", `../images/back.svg`);
    cardImage4.classList.add("faceDown");
    dealer.appendChild(cardImage4);
  }, 2100);

  // console.log("dealer hand is:", dealerHand);
  // console.log("player hand is:", playerHand);
  // console.log(evalDealerHand("evalDealerHand:", dealerHand));
  // console.log(evalHand("regular DEALER evalHand:", dealerHand));

  console.log("Dealers hand is:", dealerTotalVal);
  console.log("Player hand is:", playerTotalVal);
}

function disableActionBtns() {
  newGameBtn.classList.add("btn-no-hover");
  hitBtn.classList.add("btn-no-hover");
  standBtn.classList.add("btn-no-hover");
  doubleDownBtn.classList.add("btn-no-hover");
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
  newGameBtn.classList.remove("btn-no-hover");
  hitBtn.classList.remove("btn-no-hover");
  standBtn.classList.remove("btn-no-hover");
  doubleDownBtn.classList.remove("btn-no-hover");
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

function enableOnlyNewGameBtn() {
  disableActionBtns();
  dealBtn.classList.add("btn-no-hover");
  newGameBtn.classList.remove("btn-no-hover");
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
  updatePlayerText(playerTotal);
  console.log("new player total in PlayerHit is:", playerTotal);

  if (playerTotal === 21) {
    console.log("Player has 21! You can no longer hit.");
  } else if (playerTotal > 21) {
    playerOutcome.textContent = "Lost";
    playerLoses();
  }
}

function playerStand() {
  let dealerTotal = evalHand(dealerHand);
  let playerTotal = evalHand(playerHand);
  if (playerTotal === dealerTotal) playerPushes();

  if (playerTotal <= 21 && playerTotal > dealerTotal) {
    playerWins();
  } else {
    playerLoses();
  }
}

function playerLoses() {
  playerOutcome.textContent = "Lost";
  enableOnlyNewGameBtn();
  // reset();
}

function playerPushes() {
  console.log("PUSH");
  totalBalanceAmt += totalBetAmt;
  enableOnlyNewGameBtn();
}

function playerWins() {
  totalBalanceAmt += totalBetAmt * 2;
  enableOnlyNewGameBtn();
}

function reset() {
  clearCards();
  updateBalance();
}

function shuffleCards(deck) {
  // Durstenfeld Shuffle Algorithm
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

function specialCase() {
  let dealerCard1 = dealersHand[0].split("_")[1];
  let dealerCard2 = dealersHand[1].split("_")[1];
  if (cardValueObj[dealerCard1] === "10" && dealerCard2 === "ace") {
    dealerFlipCard();
    console.log("Dealer has Blackjack! You lose");
  }
}

function startNewHand() {
  createCardDeck();
  disableActionBtns();
  enableChipBtns();
  enableBtn(dealBtn);
}

function updateBalance() {
  totalBetAmt = 0;
  betText.textContent = `$${totalBetAmt}`;
  balanceText.textContent = `$${totalBalanceAmt}`;
  clearCards();
  startNewHand();
}

function updatePlayerText(newPlayerTotal) {
  playerText.textContent = newPlayerTotal;
}

addBtnListeners();
startNewHand();
