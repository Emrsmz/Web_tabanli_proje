const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
// Oyun durumu
let gameRunning = true;
let level = 1;
let score = 0; // Skor sistemi
let mouseX = canvas.width / 2;
let mouseY = canvas.height / 2;
// UI sistemi
let gameOverVisible = false;
let finalScore = 0;
let animationTimer = 0;
// Dalga geçiş sistemi
let waveTransition = false;
let pendingWaveLevel = 1;
// oyun durdurma sistemi 
let gamePaused = false;
// tus durumu
const keys = {};
// Oyun nesneleri
let player;
let enemies = [];
let gameTimer = null; 

// baslatma fonksiyonu
function init() {
    // karkateri kontrol ediyo
    if (typeof PlayerTank !== 'undefined') {
        player = new PlayerTank(canvas.width / 2, canvas.height / 2);
    }
    enemies = [];
    score = 0;  
    // game timer kontrolü
    if (typeof GameTimer !== 'undefined') {
        gameTimer = new GameTimer(60);
    } else {
        gameTimer = null;
    }
    gameRunning = true;
    level = 1;
    gameOverVisible = false;
    animationTimer = 0; 
    spawnEnemies();
    updateUI();
}

// Düşman spawn
function spawnEnemies() {
    const enemyCount = Math.min(level, 5);    
    for (let i = 0; i < enemyCount; i++) {
        let x, y;
        do {
            x = Math.random() * (canvas.width - 100) + 50;
            y = Math.random() * (canvas.height - 100) + 50;
        } while (player && Math.hypot(x - player.x, y - player.y) < 200);
        
        if (typeof EnemyTank !== 'undefined') {
            const phaseOffset = (i / enemyCount) * (2 * Math.PI / 0.005) * (1 / (0.7 + (level - 1) * 0.1));
            enemies.push(new EnemyTank(x, y, level, phaseOffset));
        }
    }
}

// Oyun döngüsü
function gameLoop() {
    if (!gameRunning) return;   
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
    // sayaci güncelle ve dalga geçişi kontrolü
    if (gameTimer && !waveTransition) {
        gameTimer.update();
    }  
    // oyun duraklama kontrolü
    if (!waveTransition && !gamePaused) {
        if (player) {
            player.update();
        }        
        enemies.forEach(enemy => {
            enemy.update();
        });     
        // seviye geçiş kontrolü
        if (enemies.length === 0 && player && !waveTransition) {
            waveTransition = true;
            pendingWaveLevel = level + 1;
        }
    }   
    // Animasyon zamanlayıcısı her zaman çalışır (dalga geçişi ve duraklatmada bile UI animasyonları için)
    animationTimer++;   
    // Çizimler
    if (player) {
        player.draw();
    } 
    enemies.forEach(enemy => {
        enemy.draw();
    });
    drawUI();
    if (gameTimer) {
        gameTimer.draw();
    }
    requestAnimationFrame(gameLoop);
}
// UI çizimleri
function drawUI() {
    drawUIOverlay();
    if (gameOverVisible) {
        drawGameOver();
    }
    if (waveTransition) {
        drawWaveTransition();
    }
    // Duraklatma göstergesi
    if (gamePaused) {
        drawPauseOverlay();
    }
}
function drawUIOverlay() {
    ctx.save();   
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(10, 10, 200, 100);
    ctx.strokeStyle = '#4CAF50';
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, 200, 100);  
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Seviye: ${level}`, 20, 35);
    ctx.fillText(`Skor: ${score}`, 20, 60);
    ctx.fillText('Can:', 20, 85);
    ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
    ctx.fillRect(70, 72, 120, 20);
    const health = player ? player.health : 0;
    const healthPercent = Math.max(0, health) / 50;
    const healthColor = healthPercent > 0.5 ? '#4CAF50' : 
                      healthPercent > 0.25 ? '#FFA500' : '#FF6B6B';
    ctx.fillStyle = healthColor;
    ctx.fillRect(70, 72, 120 * healthPercent, 20);
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1;
    ctx.strokeRect(70, 72, 120, 20);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`${Math.max(0, health)}/50`, 130, 86);
    ctx.restore();
}

function drawGameOver() {
    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const panelWidth = 400;
    const panelHeight = 280;
    const panelX = (canvas.width - panelWidth) / 2;
    const panelY = (canvas.height - panelHeight) / 2;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
    ctx.fillRect(panelX, panelY, panelWidth, panelHeight);
    ctx.strokeStyle = '#FF6B6B';
    ctx.lineWidth = 3;
    ctx.strokeRect(panelX, panelY, panelWidth, panelHeight);
    ctx.fillStyle = '#FF6B6B';
    ctx.font = 'bold 36px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('OYUN BİTTİ!', canvas.width / 2, panelY + 50);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 24px Arial';
    ctx.fillText(`Final Skor: ${score}`, canvas.width / 2, panelY + 100);
    const buttonWidth = 200;
    const buttonHeight = 50;
    const buttonX = (canvas.width - buttonWidth) / 2;
    const buttonY = panelY + 180;
    const pulse = Math.sin(animationTimer * 0.05) * 0.1 + 0.9;
    ctx.fillStyle = `rgba(76, 175, 80, ${pulse})`;
    ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);
    ctx.strokeStyle = '#4CAF50';
    ctx.lineWidth = 2;
    ctx.strokeRect(buttonX, buttonY, buttonWidth, buttonHeight);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 20px Arial';
    ctx.fillText('YENİDEN BAŞLA', canvas.width / 2, buttonY + 32);
    ctx.restore();
}

function isGameOverButtonClicked(mouseX, mouseY) {
    if (!gameOverVisible) return false;
    const panelHeight = 280;
    const panelY = (canvas.height - panelHeight) / 2;
    const buttonWidth = 200;
    const buttonHeight = 50;
    const buttonX = (canvas.width - buttonWidth) / 2;
    const buttonY = panelY + 180;
    return mouseX >= buttonX && mouseX <= buttonX + buttonWidth &&
           mouseY >= buttonY && mouseY <= buttonY + buttonHeight;
}

function updateUI() {
    animationTimer++;
}

// durdurma ekranı cizimi
function drawPauseOverlay() {
    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#FFA500';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('DURAKLATILDI', canvas.width / 2, canvas.height / 2 - 20);
    
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '18px Arial';
    ctx.fillText('Devam etmek için ESC veya P', canvas.width / 2, canvas.height / 2 + 30);
    
    ctx.restore();
}

// dalga gecis ekranı çizimi
function drawWaveTransition() {
    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);  
    const panelWidth = 450;
    const panelHeight = 300;
    const panelX = (canvas.width - panelWidth) / 2;
    const panelY = (canvas.height - panelHeight) / 2;
    
    // Panel arkaplanı
    ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
    ctx.fillRect(panelX, panelY, panelWidth, panelHeight);
    
    // Panel çerçevesi
    const borderColor = '#4CAF50';
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 3;
    ctx.strokeRect(panelX, panelY, panelWidth, panelHeight);
    
    // Dalga başlığı
    ctx.fillStyle = '#4CAF50';
    ctx.font = 'bold 32px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`DALGA ${pendingWaveLevel}`, canvas.width / 2, panelY + 55);
    
    // Bilgi metinleri
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '18px Arial';
    ctx.fillText(`Şu anki Seviye: ${level}`, canvas.width / 2, panelY + 100);
    ctx.fillText(`Skor: ${score}`, canvas.width / 2, panelY + 130);
    
    // Durum mesajı
    ctx.fillStyle = '#FFA500';
    ctx.font = 'bold 16px Arial';
    ctx.fillText('Yeni dalgaya hazır mısın?', canvas.width / 2, panelY + 170);
    
    // Başlama butonu
    const buttonWidth = 220;
    const buttonHeight = 55;
    const buttonX = (canvas.width - buttonWidth) / 2;
    const buttonY = panelY + 195;
    const pulse = Math.sin(animationTimer * 0.05) * 0.1 + 0.9;

        ctx.fillStyle = `rgba(76, 175, 80, ${pulse})`;
        ctx.strokeStyle = '#4CAF50'; 

    ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);
    ctx.lineWidth = 2;
    ctx.strokeRect(buttonX, buttonY, buttonWidth, buttonHeight);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 22px Arial';
    ctx.fillText('BAŞLA', canvas.width / 2, buttonY + 35);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = '14px Arial';
    ctx.fillText('BAŞLA butonuna tıkla', canvas.width / 2, panelY + panelHeight - 15);
    ctx.restore();
}

// Dalga başlatma
function startWave() {
    waveTransition = false;
    level = pendingWaveLevel;
    score += 100 * level;
    spawnEnemies();
    updateUI();
    
    if (gameTimer) {
        gameTimer.timeRemaining += 15;
    }

    if (typeof soundManager !== 'undefined' && soundManager) {
        soundManager.playLevelUp();
    }
}

// Baslama butonuna tıklandı mı kontrol
function isWaveStartButtonClicked(mouseX, mouseY) {
    if (!waveTransition) return false;
    
    const panelWidth = 450;
    const panelHeight = 300;
    const panelX = (canvas.width - panelWidth) / 2;
    const panelY = (canvas.height - panelHeight) / 2;
    const buttonWidth = 220;
    const buttonHeight = 55;
    const buttonX = (canvas.width - buttonWidth) / 2;
    const buttonY = panelY + 195;
    
    return mouseX >= buttonX && mouseX <= buttonX + buttonWidth &&
           mouseY >= buttonY && mouseY <= buttonY + buttonHeight;
}

function gameOver() {
    gameRunning = false;
    gameOverVisible = true;
    if (typeof soundManager !== 'undefined' && soundManager) {
        soundManager.stopMusic();
        soundManager.playGameOver();
    }
}

function restartGame() {
    gameOverVisible = false;
    level = 1;
    init();
    gameLoop();
    if (typeof soundManager !== 'undefined' && soundManager) {
        soundManager.restartMusic();
    }
}

function initAudio() {
    if (typeof soundManager !== 'undefined' && soundManager && !soundManager.initialized) {
        soundManager.init();
        soundManager.startMusic();
    }
}


document.addEventListener('keydown', (e) => {
    initAudio();
    keys[e.key] = true;
    
    // Oyunu durdurma p veya esc ile
    if ((e.key === 'p' || e.key === 'P' || e.key === 'Escape') && gameRunning && !waveTransition) {
        gamePaused = !gamePaused;
    }
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
    initAudio();
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    if (!gameRunning && isGameOverButtonClicked(mouseX, mouseY)) {
        restartGame();
        return;
    }
    
    // Başla butonuna tıklandıysa dalga başlat
    if (waveTransition && isWaveStartButtonClicked(mouseX, mouseY)) {
        startWave();
        return;
    }
    
    if (e.button === 0 && player && gameRunning && !gamePaused && !waveTransition) {
        player.isShooting = true;
    }
});

canvas.addEventListener('mouseup', (e) => {
    if (e.button === 0 && player) {
        player.isShooting = false;
    }
});

canvas.addEventListener('mouseleave', (e) => {
    if (player) {
        player.isShooting = false;
    }
});

const muteBtn = document.getElementById('muteBtn');
if (muteBtn) {
    muteBtn.addEventListener('click', () => {
        initAudio();
        if (typeof soundManager !== 'undefined' && soundManager) {
            const muted = soundManager.toggleMute();
            muteBtn.textContent = muted ? '🔇' : '🔊';
            muteBtn.style.borderColor = muted ? '#ff6b6b' : '#4CAF50';
        }
    });
}

// Oyunu başlat
init();
gameLoop();