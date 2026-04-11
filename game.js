const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// VERİ

const INGREDIENTS = [
  { id: "alcohol",   label: "Alkol",    emoji: "" },
  { id: "lime",      label: "Limon",    emoji: "" },
  { id: "orange",    label: "", emoji: "" },
  { id: "mint",      label: "",     emoji: "" },
  { id: "soda",      label: "",     emoji: "" },
  { id: "sugar",     label: "",    emoji: "" },
];

const DRINKS = [
  { id: "margarita", label: "Margarita", ingredients: ["alcohol", "lime", "orange"] },
  { id: "mojito",    label: "Mojito",    ingredients: ["alcohol", "lime", "mint", "soda", "sugar"] },
];

// OYUN DURUMU

const state = {
  screen: "menu",        // "menu" | "game" | "end"
  order: null,           // Aktif sipariş  { id, label, ingredients }
  selected: [],          // Seçilen malzemeler  ["alcohol", "lime", ...]
  score: 0,
  timeLeft: 30,
  timerInterval: null,
};

// OYUN FONKSİYONLARI

function startGame() {}

function newOrder() {}

function selectIngredient(id) {}

function checkMix() {}

function onTimeUp() {}

function endGame() {}

// ÇİZİM FONKSİYONLARI

function draw() {}

function drawMenu() {}

function drawGame() {}

function drawOrder() {}

function drawIngredients() {}

function drawSelected() {}

function drawTimer() {}

function drawScore() {}

function drawEnd() {}

// GİRİŞ (MOUSE / TOUCH)

function getClickedIngredient(x, y) {}

function getClickedButton(x, y) {}

canvas.addEventListener("click", (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const btn = getClickedButton(x, y);
  if (btn === "start")  startGame();
  if (btn === "mix")    checkMix();
  if (btn === "clear")  state.selected = [];

  const ing = getClickedIngredient(x, y);
  if (ing) selectIngredient(ing);

  draw();
});

// BAŞLAT
draw();
