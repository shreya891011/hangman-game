const words = [
  { word: "guitar", hint: "A musical instrument with strings" },
  { word: "elephant", hint: "The largest land animal" },
  { word: "javascript", hint: "A web programming language" },
  { word: "rainbow", hint: "Appears after rain" },
  { word: "computer", hint: "You’re using it now" },
  { word: "unicorn", hint: "A mythical one-horned creature" },
  { word: "pizza", hint: "Italian dish loved worldwide" }
];

let score = 0;
let timerValue = 30;
let timer;
let selectedWordObj;
let selectedWord;
let correctLetters = [];
let wrongLetters = [];

const wordEl = document.getElementById("word");
const keyboard = document.getElementById("keyboard");
const hintEl = document.getElementById("hint");
const popup = document.getElementById("popup-container");
const finalMessage = document.getElementById("final-message");
const playBtn = document.getElementById("play-button");
const scoreEl = document.getElementById("score");
const timerEl = document.getElementById("timer");
const correctSound = document.getElementById("correctSound");
const wrongSound = document.getElementById("wrongSound");
const canvas = document.getElementById("hangmanCanvas");
const ctx = canvas.getContext("2d");

function initGame() {
  correctLetters = [];
  wrongLetters = [];
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  selectedWordObj = words[Math.floor(Math.random() * words.length)];
  selectedWord = selectedWordObj.word;
  hintEl.textContent = `💡 Hint: ${selectedWordObj.hint}`;

  popup.style.display = "none";
  createKeyboard();
  displayWord();
  resetTimer();
}

function displayWord() {
  wordEl.innerHTML = selectedWord
    .split("")
    .map((letter) =>
      correctLetters.includes(letter)
        ? `<span>${letter}</span>`
        : `<span>_</span>`
    )
    .join(" ");

  if (wordEl.innerText.replace(/\n/g, "") === selectedWord) {
    score += 10;
    scoreEl.textContent = `🏆 Score: ${score}`;
    winGame();
  }
}

function createKeyboard() {
  keyboard.innerHTML = "";
  const letters = "abcdefghijklmnopqrstuvwxyz";
  letters.split("").forEach((letter) => {
    const btn = document.createElement("button");
    btn.classList.add("key");
    btn.textContent = letter;
    btn.addEventListener("click", () => handleGuess(letter, btn));
    keyboard.appendChild(btn);
  });
}

function handleGuess(letter, btn) {
  btn.disabled = true;
  if (selectedWord.includes(letter)) {
    correctLetters.push(letter);
    correctSound.play();
  } else {
    wrongLetters.push(letter);
    wrongSound.play();
    drawHangman(wrongLetters.length);
  }
  displayWord();

  if (wrongLetters.length === 6) loseGame();
}

function drawHangman(errors) {
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 3;
  ctx.beginPath();
  switch (errors) {
    case 1: ctx.moveTo(10, 240); ctx.lineTo(190, 240); break;
    case 2: ctx.moveTo(60, 240); ctx.lineTo(60, 20); break;
    case 3: ctx.moveTo(60, 20); ctx.lineTo(150, 20); break;
    case 4: ctx.moveTo(150, 20); ctx.lineTo(150, 40); break;
    case 5: ctx.arc(150, 60, 20, 0, Math.PI * 2); break;
    case 6:
      ctx.moveTo(150, 80); ctx.lineTo(150, 150);
      ctx.moveTo(150, 100); ctx.lineTo(130, 130);
      ctx.moveTo(150, 100); ctx.lineTo(170, 130);
      ctx.moveTo(150, 150); ctx.lineTo(130, 190);
      ctx.moveTo(150, 150); ctx.lineTo(170, 190);
      break;
  }
  ctx.stroke();
}

function winGame() {
  finalMessage.textContent = "🎉 You Won!";
  popup.style.display = "flex";
  confettiEffect();
}

function loseGame() {
  finalMessage.textContent = `😢 You Lost! The word was "${selectedWord}".`;
  popup.style.display = "flex";
  clearInterval(timer);
}

playBtn.addEventListener("click", initGame);

function resetTimer() {
  clearInterval(timer);
  timerValue = 30;
  timerEl.textContent = `⏰ Time: ${timerValue}s`;
  timer = setInterval(() => {
    timerValue--;
    timerEl.textContent = `⏰ Time: ${timerValue}s`;
    if (timerValue <= 0) {
      loseGame();
    }
  }, 1000);
}

function confettiEffect() {
  const duration = 2000;
  const end = Date.now() + duration;

  (function frame() {
    const confetti = document.createElement("div");
    confetti.className = "confetti";
    confetti.style.left = Math.random() * 100 + "vw";
    confetti.style.background = `hsl(${Math.random() * 360}, 100%, 70%)`;
    confetti.style.animationDuration = Math.random() * 2 + 3 + "s";
    document.body.appendChild(confetti);
    setTimeout(() => confetti.remove(), 5000);
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}

initGame();
