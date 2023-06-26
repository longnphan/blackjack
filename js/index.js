const chipBtns = document.querySelectorAll(".btn-chips");
const dealBtn = document.querySelector(".btn-deal");
const standBtn = document.querySelector(".btn-stand");
const doubleDownBtn = document.querySelector(".btn-doubleDown");
const splitBtn = document.querySelector(".btn-split");
const wagered = document.querySelector(".wagered-amount");
let totalWageredAmt = 0;

function calcWageredAmt() {
  for (let item of chipBtns) {
    item.addEventListener("click", e => {
      totalWageredAmt += Number(e.target.textContent);
      wagered.textContent = `$${totalWageredAmt}`;
    });
  }
}

calcWageredAmt();
