const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// VERİ

const INGREDIENTS = [
  { id: "alcohol",   label: "Alkol",    emoji: "" },
  { id: "lime",      label: "Limon",    emoji: "" },
  { id: "orange",    label: "Portakal", emoji: "" },
  { id: "mint",      label: "Nane",     emoji: "" },
  { id: "soda",      label: "Soda",     emoji: "" },
  { id: "sugar",     label: "Şeker",    emoji: "" },
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

function startGame() {
  state.screen = "game";
  state.score = 0;
  newOrder();
}
function newOrder() {
  
}

function selectIngredient(id) {}

function checkMix() {}

function onTimeUp() {}

function endGame() {}

// ÇİZİM FONKSİYONLARI

function draw() {
  if(state.screen === "menu"){
    drawMenu();
  }
  else if (state.screen === "game"){
    drawGame();
  }
}
//Başlangıç Ekranı yani
function drawMenu(){
  ctx.fillStyle = "orange";
  ctx.fillRect(0,0,canvas.width,canvas.height);

  //Başlık
  ctx.fillStyle = "red";
  ctx.font = "40px Arial";
  ctx.textAlign = "center";
  ctx.fillText("Mixer",canvas.width/2 ,200); 

  //Buton
  ctx.fillStyle = "#ff6347";
  ctx.fillRect(canvas.width/2-80,300,160,60);
  ctx.fillStyle = "white";
  ctx.font = "24px Arial";
  ctx.fillText("Oyna", canvas.width / 2, 333);
}

function drawGame() {
  ctx.fillStyle = "violet"
  ctx.fillRect(0,0,canvas.width,canvas.height);
  drawOrder();
  drawIngredients();
  drawSelected();
  drawTimer();
  drawScore();
}

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
