const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");


// VERİ
const INGREDIENTS = [
  { id: "alcohol", label: "Alkol", emoji: "" },
  { id: "lime", label: "Limon", emoji: "" },
  { id: "orange", label: "Portakal", emoji: "" },
  { id: "mint", label: "Nane", emoji: "" },
  { id: "soda", label: "Soda", emoji: "" },
  { id: "sugar", label: "Şeker", emoji: "" },
];

// ASSETLERİ EKLEME

const assetSources = {
  product1: 'https://raw.githubusercontent.com/Emrsmz/Web_tabanli_proje/assetler/assets/cherry.png',
  product2: 'https://raw.githubusercontent.com/Emrsmz/Web_tabanli_proje/assetler/assets/coffee bean.png',
  product3: 'https://raw.githubusercontent.com/Emrsmz/Web_tabanli_proje/assetler/assets/cranberries.png',
};

const images = {};
let loadedImages = 0;
const totalImages = Object.keys(assetSources).length;

// ASSETLERİ YÜKLEME

for (let key in assetSources) {
  images[key] = new Image();
  images[key].src = assetSources[key];
  images[key].onload = () => {
    loadedImages++;
    if (loadedImages == totalImages) {
      init();
      animate();
    }
  }
}

// KUTU VE YERLEŞİM

const itemSize = 90;
const cols = 2;
const rows = 10;
const boxWidth = 340;
const boxHeight = 800;
let boxX = 560;
let boxY = 0;

class GameObject {
  constructor(image, colIndex, y, size, speed) {
    this.image = image;
    this.colIndex = colIndex;
    this.y = y;
    this.size = size;
    this.speed = speed;
  }

  draw() {
    let x;
    if (this.colIndex === 0) {
      x = 560 + (180 - this.size) / 2;
    }
    else {
      x = 740 + (160 - this.size) / 2;
    }
    ctx.drawImage(this.image, x, this.y, this.size, this.size);
  }

  update() {
    this.y += this.speed;

    if (this.y >= boxY + 800) {
      this.y -= (rows + 2) * this.size;

      const keys = Object.keys(images);
      if (keys.length > 0) {
        let randomKey = keys[Math.floor(Math.random() * keys.length)];
        this.image = images[randomKey];
      }
    }
    this.draw();
  }
}

const objects = [];

function init() {
  objects.length = 0;
  const keys = Object.keys(images);
  if (keys.length === 0) return;

  const speed = 1.5;

  for (let c = 0; c < cols; c++) {
    let colOffset = Math.random() * itemSize;
    for (let r = 0; r <= rows + 1; r++) {
      let randomKey = keys[Math.floor(Math.random() * keys.length)];
      let img = images[randomKey];
      let startY = boxY - (2 * itemSize) + (r * itemSize) + colOffset;
      objects.push(new GameObject(img, c, startY, itemSize, speed));
    }
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.restore();

  requestAnimationFrame(animate);
  draw();
}

// OYUN DURUMU

const state = {
  screen: "game",        // "menu" | "game" | "end"
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
  const randomIndex = Math.floor(Math.random() * DRINKS.length);
  state.order = DRINKS[randomIndex];
  state.selected = [];
  state.timeLeft = 30;
}

function selectIngredient(id) { }

function checkMix() { }

function onTimeUp() { }

function endGame() { }

// ÇİZİM FONKSİYONLARI

function draw() {
  if (state.screen === "menu") {
    drawMenu();
  }
  else if (state.screen === "game") {
    drawGame();
  }
}
//Başlangıç Ekranı yani
function drawMenu() {
  ctx.fillStyle = "orange";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  //Başlık
  ctx.fillStyle = "red";
  ctx.font = "40px Arial";
  ctx.textAlign = "center";
  ctx.fillText("Mixer", canvas.width / 2, 200);

  //Buton
  ctx.fillStyle = "#ff6347";
  ctx.fillRect(canvas.width / 2 - 80, 300, 160, 60);
  ctx.fillStyle = "white";
  ctx.font = "24px Arial";
  ctx.fillText("Oyna", canvas.width / 2, 333);
}

function drawGame() {
  ctx.fillStyle = "violet"
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  //Ayrık Çizgi 1
  ctx.beginPath();
  ctx.moveTo(740, 0);
  ctx.lineTo(740, 800);
  ctx.stroke();
  //Çizgi 2
  ctx.beginPath();
  ctx.moveTo(560, 0);
  ctx.lineTo(560, 800);
  ctx.stroke();

  // Animasyonu 560 ile 900 arasına yerleştir (iki sütunu da kapsayacak)
  ctx.save();
  ctx.beginPath();
  ctx.rect(560, 0, 340, 800); // 900 - 560 = 340 genişlik, 800 yükseklik
  ctx.clip(); // Sadece bu alanın içine çiz
  objects.forEach(obj => obj.update());
  ctx.restore();

  drawOrder();
  drawIngredients();
  drawSelected();
  drawTimer();
  drawScore();
}

function drawOrder() {
  ctx.fillStyle = "White";
  ctx.font = "bold 24px Arial";
  ctx.textAlign = "center";
  ctx.fillText("Sipariş: " + state.order.label, canvas.width / 2, 50);

}

function drawIngredients() { }

function drawSelected() { }

function drawTimer() { }

function drawScore() { }

function drawEnd() { }

// GİRİŞ (MOUSE / TOUCH)

function getClickedIngredient(x, y) { }

function getClickedButton(x, y) { }

canvas.addEventListener("click", (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const btn = getClickedButton(x, y);
  if (btn === "start") startGame();
  if (btn === "mix") checkMix();
  if (btn === "clear") state.selected = [];

  const ing = getClickedIngredient(x, y);
  if (ing) selectIngredient(ing);

  draw();
});

// BAŞLAT
draw();
