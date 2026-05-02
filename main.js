const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Oyun durumu
let gameRunning = true;
let level = 1;
let mouseX = canvas.width / 2;
let mouseY = canvas.height / 2;

// UI sistemi
let gameOverVisible = false;
let finalScore = 0;
let animationTimer = 0;

// Tuş durumu
const keys = {};

// Oyun nesneleri
let player;
let enemies = [];

// Oyunu başlat
function init() {
    player = new PlayerTank(canvas.width / 2, canvas.height / 2);
    enemies = [];
    spawnEnemies();
    gameRunning = true;
    level = 1;
    gameOverVisible = false;
    animationTimer = 0;
    updateUI();
}

// Düşmanları spawnla
function spawnEnemies() {
    const enemyCount = Math.min(level, 5); // Maksimum 5 düşman, seviye başına 1 düşman
    for (let i = 0; i < enemyCount; i++) {
        let x, y;
        do {
            x = Math.random() * (canvas.width - 100) + 50;
            y = Math.random() * (canvas.height - 100) + 50;
        } while (Math.hypot(x - player.x, y - player.y) < 200);
        
        enemies.push(new EnemyTank(x, y, level));
    }
}

// Oyun döngüsü
function gameLoop() {
    if (!gameRunning) return;
    
    // Canvas'ı temizle
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Grid deseni
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 1;
    for (let i = 0; i < canvas.width; i += 40) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
    }
    for (let i = 0; i < canvas.height; i += 40) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
    }
    
    // Oyuncuyu güncelle ve çiz
    if (player) {
        player.update();
        player.draw();
    }
    
    // Düşmanları güncelle ve çiz
    enemies.forEach(enemy => {
        enemy.update();
        enemy.draw();
    });
    
    // Seviye kontrolü
    if (enemies.length === 0) {
        level++;
        spawnEnemies();
        updateUI();
    }
    
    // UI çiz
    drawUI();
    
    requestAnimationFrame(gameLoop);
}

// UI çizim fonksiyonları
function drawUI() {
    drawUIOverlay();
    
    if (gameOverVisible) {
        drawGameOver();
    }
}

function drawUIOverlay() {
    ctx.save();
    
    // Yarı saydam arka plan
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(10, 10, 200, 80);
    
    // Kenarlık
    ctx.strokeStyle = '#4CAF50';
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, 200, 80);
    
    // Metinler
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'left';
    
    // Seviye
    ctx.fillText(`Seviye: ${level}`, 20, 35);
    
    // Can barı
    ctx.fillText('Can:', 20, 65);
    
    // Can barı arka plan
    ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
    ctx.fillRect(70, 52, 120, 20);
    
    // Can barı dolgu
    const health = player ? player.health : 0;
    const healthPercent = health / 50;
    const healthColor = healthPercent > 0.5 ? '#4CAF50' : 
                      healthPercent > 0.25 ? '#FFA500' : '#FF6B6B';
    
    ctx.fillStyle = healthColor;
    ctx.fillRect(70, 52, 120 * healthPercent, 20);
    
    // Can barı kenarlık
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1;
    ctx.strokeRect(70, 52, 120, 20);
    
    // Can metni
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`${Math.max(0, health)}/50`, 130, 66);
    
    ctx.restore();
}

function drawGameOver() {
    ctx.save();
    
    // Yarı saydam arka plan
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Game over paneli
    const panelWidth = 400;
    const panelHeight = 250;
    const panelX = (canvas.width - panelWidth) / 2;
    const panelY = (canvas.height - panelHeight) / 2;
    
    // Panel arka plan
    ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
    ctx.fillRect(panelX, panelY, panelWidth, panelHeight);
    
    // Panel kenarlık
    ctx.strokeStyle = '#FF6B6B';
    ctx.lineWidth = 3;
    ctx.strokeRect(panelX, panelY, panelWidth, panelHeight);
    
    // Başlık
    ctx.fillStyle = '#FF6B6B';
    ctx.font = 'bold 36px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('OYUN BİTTİ!', canvas.width / 2, panelY + 60);
    
    // Yeniden başla butonu
    const buttonWidth = 200;
    const buttonHeight = 50;
    const buttonX = (canvas.width - buttonWidth) / 2;
    const buttonY = panelY + 160;
    
    // Buton arka plan (animasyonlu)
    const pulse = Math.sin(animationTimer * 0.05) * 0.1 + 0.9;
    ctx.fillStyle = `rgba(76, 175, 80, ${pulse})`;
    ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);
    
    // Buton kenarlık
    ctx.strokeStyle = '#4CAF50';
    ctx.lineWidth = 2;
    ctx.strokeRect(buttonX, buttonY, buttonWidth, buttonHeight);
    
    // Buton metni
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 20px Arial';
    ctx.fillText('YENİDEN BAŞLA', canvas.width / 2, buttonY + 32);
    
    ctx.restore();
}

function isGameOverButtonClicked(mouseX, mouseY) {
    if (!gameOverVisible) return false;
    
    const buttonWidth = 200;
    const buttonHeight = 50;
    const buttonX = (canvas.width - buttonWidth) / 2;
    const buttonY = (canvas.height - 250) / 2 + 160;
    
    return mouseX >= buttonX && mouseX <= buttonX + buttonWidth &&
           mouseY >= buttonY && mouseY <= buttonY + buttonHeight;
}

// UI güncelle
function updateUI() {
    animationTimer++;
}

// Oyun sonu
function gameOver() {
    gameRunning = false;
    gameOverVisible = true;
}

// Yeniden başla
function restartGame() {
    gameOverVisible = false;
    init();
    gameLoop();
}

// Event listeners
document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});

document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
});

canvas.addEventListener('mousedown', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Game over butonu kontrolü
    if (!gameRunning && isGameOverButtonClicked(mouseX, mouseY)) {
        restartGame();
        return;
    }
    
    // Normal ateş etme
    if (e.button === 0 && player && gameRunning) {
        player.isShooting = true;
    }
});

canvas.addEventListener('mouseup', (e) => {
    if (e.button === 0) {
        if (player) {
            player.isShooting = false;
        }
    }
});

canvas.addEventListener('mouseleave', (e) => {
    if (player) {
        player.isShooting = false;
    }
});

// Oyunu başlat
init();
gameLoop();
