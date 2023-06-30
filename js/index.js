// DOM Variables
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

// Gameplay Variables
const cardShoe = [];
let dealerHand = [];
let isDoubleDown = false;
let playerHand = [];
let totalBalanceAmt = 500;
let totalBetAmt = 0;

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

  // Add event listeners to action btns.
  clearBtn.addEventListener("click", clearBet);
  newGameBtn.addEventListener("click", reset);
  dealBtn.addEventListener("click", dealNewHand);
  hitBtn.addEventListener("click", playerHit);
  standBtn.addEventListener("click", playerStand);
  doubleDownBtn.addEventListener("click", playerDoubleDown);
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

  // Enables deal btn when totalBetAmt > 0
  dealBtn.classList.remove("btn-no-hover");

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
  // Disables deal btn
  dealBtn.classList.add("btn-no-hover");

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

function dealerFirstCard() {
  let cardImage2 = document.createElement("img");
  cardImage2.setAttribute(
    "src",
    `https://github.com/longnphan/blackjack/blob/main/images/${dealerHand[0]}.svg`
  );
  dealer.appendChild(cardImage2);
}

function dealerFlipsCard() {
  const faceDownCard = document.querySelector(".faceDown");
  faceDownCard.setAttribute(
    "src",
    `https://github.com/longnphan/blackjack/blob/main/images/${dealerHand[1]}.svg`
  );
}

function dealerHit() {
  let nextCard = cardShoe.shift();
  dealerHand.push(nextCard);

  // Adds new card to dealers hand
  let cardImage = document.createElement("img");
  cardImage.setAttribute(
    "src",
    `https://github.com/longnphan/blackjack/blob/main/images/${nextCard}.svg`
  );
  dealer.appendChild(cardImage);

  // Recalculates player new total.
  let dealerTotal = evalHand(dealerHand);
}

function dealerNextCard() {
  let nextCard = cardShoe.shift();
  dealerHand.push(nextCard);

  // Adds new card to dealer hand
  let cardImage = document.createElement("img");
  cardImage.setAttribute(
    "src",
    `https://github.com/longnphan/blackjack/blob/main/images/${nextCard}.svg`
  );
  dealer.appendChild(cardImage);

  let dealerTotal = evalHand(dealerHand);
}

function dealerNextMove() {
  let dealerTotal = evalHand(dealerHand);
  let playerTotal = evalHand(playerHand);
  dealerText.textContent = dealerTotal;

  if (dealerTotal > 21) {
    playerWins();
  } else if (dealerTotal >= 17) {
    if (isPush()) {
      playerPushes();
    } else if (dealerTotal <= 21 && dealerTotal > playerTotal) {
      playerLoses();
    } else {
      dealerFlipsCard();
      playerWins();
    }
  } else if (dealerTotal === 17) {
    if (dealerTotal > playerTotal) {
      playerLoses();
    } else if (dealerTotal <= 16) {
      dealerNextCard();
    }
  } else if (dealerTotal < 17) {
    dealerNextCard();
    dealerNextMove();
  }
}

function dealNewHand() {
  // Clears out previous hand.
  dealerHand = [];
  playerHand = [];

  // Chip btns should not work while hand is being played.
  disableChipBtns();

  // Disables deal btn.
  dealBtn.classList.add("btn-no-hover");

  // Enables action btns except deal btn, from disabled state when wagers are being placed.
  enableActionBtns();
  newGameBtn.classList.add("btn-no-hover");

  // Stores player's/dealer's first hand into their arrays.
  storeFirstHand();

  // Deals first set of cards to player & dealer.
  playerFirstCard();
  setTimeout(dealerFirstCard, 200);
  setTimeout(playerSecondCard, 400);
  setTimeout(dealerSecondCard, 600);

  // Checks if player/dealer has blackjack. Otherwise, play resumes.
  playerNextMove();
}

function dealersTurn() {
  // Flips dealer's face down card.
  dealerFlipsCard();

  if (isPush()) {
    playerPushes();
  } else {
    dealerNextMove();
  }
}

function dealerSecondCard() {
  let cardImage4 = document.createElement("img");
  cardImage4.setAttribute(
    "src",
    `https://github.com/longnphan/blackjack/blob/main/images/back.svg`
  );
  cardImage4.classList.add("faceDown");
  dealer.appendChild(cardImage4);
}

function disableActionBtns() {
  newGameBtn.classList.add("btn-no-hover");
  hitBtn.classList.add("btn-no-hover");
  standBtn.classList.add("btn-no-hover");
  doubleDownBtn.classList.add("btn-no-hover");
}

function disableAllActionBtns() {
  newGameBtn.classList.add("btn-no-hover");
  dealBtn.classList.add("btn-no-hover");
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

function disableBtn(btnEl) {
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
  disableAllActionBtns();
  newGameBtn.classList.remove("btn-no-hover");
}

function evalFirstHand(hand) {
  // Evaluates just the first two cards for player/dealer
  let total = 0;
  for (let i = 0; i <= 1; i++) {
    let card = hand[i].split("_")[1];
    let cardVal = cardValueObj[card];
    total += cardVal;
  }
  return total;
}

function evalHand(hand) {
  let numOfAces = 0;
  let total = 0;

  for (let item of hand) {
    let card = item.split("_")[1];
    let cardVal = cardValueObj[card];

    // Keeps track of how many aces are in player/dealer hand.
    if (card === "ace") numOfAces++;

    total += cardVal;
  }
  // Aces start with val of 11. If hand is over 21, 10 is subtracted from total to simulate Ace = 1.
  while (numOfAces && total > 21) {
    total -= 10;
    numOfAces--;
  }
  return total;
}

function isPush() {
  let dealerTotal = evalHand(dealerHand);
  let playerTotal = evalHand(playerHand);
  return (
    dealerTotal === playerTotal &&
    dealerTotal >= 17 &&
    dealerTotal <= 21 &&
    playerTotal >= 17 &&
    playerTotal <= 21
  );
}

function playerBlackjack() {
  dealerFlipsCard();
  playerWins(1.5);
  playerOutcome.textContent = "BJ!";
}

function playerBusts() {
  dealerFlipsCard();
  playerLoses();
}

function playerDoubleDown() {
  // Updates balance to account for double down bet.
  totalBalanceAmt -= totalBetAmt;
  totalBetAmt = totalBetAmt * 2;

  renderStats();
  playerNextCard();
  disableAllActionBtns();

  if (evalHand(playerHand) > 21) {
    playerLoses();
  } else {
    dealersTurn();
  }
}

function playerFirstCard() {
  let cardImage = document.createElement("img");
  cardImage.setAttribute(
    "src",
    `https://github.com/longnphan/blackjack/blob/main/images/${playerHand[0]}.svg`
  );
  cardImage.classList.add("playerFirstCard");
  player.appendChild(cardImage);
}

function playerHit() {
  // Disables double down button, since player already hit.
  disableBtn(doubleDownBtn);

  playerNextCard();
}

function playerNextCard() {
  let nextCard = cardShoe.shift();
  playerHand.push(nextCard);

  // Adds new card to players hand
  let cardImage = document.createElement("img");
  cardImage.setAttribute(
    "src",
    `https://github.com/longnphan/blackjack/blob/main/images/${nextCard}.svg`
  );
  player.appendChild(cardImage);

  // Recalculates player new total.
  let playerTotal = evalHand(playerHand);
  updatePlayerText(playerTotal);
  playerNextMove();
}

function playerLoses() {
  playerOutcome.textContent = "Lose";
  enableOnlyNewGameBtn();

  // Updates dealers value text if player busts.
  let dealerTotal = evalHand(dealerHand);
  dealerText.textContent = dealerTotal;
}

function playerNextMove() {
  let dealerInitTotal = evalFirstHand(dealerHand);
  let playerInitTotal = evalFirstHand(playerHand);
  let dealerTotal = evalHand(dealerHand);
  let playerTotal = evalHand(playerHand);

  // Disables Double down btn if player does not have enough money.
  if (totalBalanceAmt < totalBetAmt)
    doubleDownBtn.classList.add("btn-no-hover");

  // BJ gets evaluated before dealer face down card is flipped w/o setTimeout.
  if (playerTotal === 21 && dealerTotal === 21) {
    setTimeout(playerPushes, 800);
  } else if (dealerInitTotal === 21 && playerInitTotal < 21) {
    setTimeout(playerBusts, 800);
  } else if (playerInitTotal === 21 && dealerInitTotal < 21) {
    setTimeout(playerBlackjack, 800);
  } else if (playerTotal === 21 && dealerInitTotal < 21) {
    dealersTurn();
  } else if (playerTotal > 21) {
    playerBusts();
  }
}

function playerPushes() {
  dealerFlipsCard();
  totalBalanceAmt += totalBetAmt;
  playerOutcome.textContent = "Push";
  enableOnlyNewGameBtn();
}

function playerSecondCard() {
  let cardImage3 = document.createElement("img");
  cardImage3.setAttribute(
    "src",
    `https://github.com/longnphan/blackjack/blob/main/images/${playerHand[1]}.svg`
  );
  cardImage3.classList.add("playerSecondCard");
  player.appendChild(cardImage3);

  // Player's total card val is displayed after 2nd card is dealt
  let playerTotalVal = evalHand(playerHand);
  playerText.textContent = playerTotalVal;
}

function playerStand() {
  dealersTurn();
}

function playerWins(oddsFactor = 1) {
  // oddsFactor will be 1.5 for blackjack.
  totalBalanceAmt += totalBetAmt + totalBetAmt * oddsFactor;

  playerOutcome.textContent = "Win";
  enableOnlyNewGameBtn();
}

function renderStats() {
  betText.textContent = `$${totalBetAmt}`;
  balanceText.textContent = `$${totalBalanceAmt}`;
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

function startBrandNewGame() {
  // Occurs when player has lost all their money.
  alert("You're out of money. Here's $500.");
  totalBalanceAmt = 500;
  balanceText.textContent = `$${totalBalanceAmt}`;
}

function startNewHand() {
  if (totalBalanceAmt === 0) {
    startBrandNewGame();
  }
  createCardDeck();
  disableActionBtns();
  enableChipBtns();
  dealBtn.classList.add("btn-no-hover");
}

function storeFirstHand() {
  // Stores player's and dealer's first hand into their arrays.
  playerHand[0] = cardShoe.shift();
  dealerHand[0] = cardShoe.shift();
  playerHand[1] = cardShoe.shift();
  dealerHand[1] = cardShoe.shift();
}

function updateBalance() {
  totalBetAmt = 0;
  renderStats();
  clearCards();
  startNewHand();
}

function updatePlayerText(newPlayerTotal) {
  playerText.textContent = newPlayerTotal;
}

addBtnListeners();
startNewHand();
