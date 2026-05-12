// Süre sayacı
class GameTimer {
    constructor(duration) {
        this.duration = duration;
        this.timeRemaining = duration;
        this.lastTime = Date.now();
        this.isPaused = false;
    }

    update() {
        // oyun durdurulduysa zaman geçmesin
        if (this.isPaused || !gameRunning) {
            this.lastTime = Date.now();
            return;
        }

        let now = Date.now();
        let deltaTime = (now - this.lastTime) / 1000;
        this.lastTime = now;

        this.timeRemaining -= deltaTime;

        // süre bittiğinde
        if (this.timeRemaining <= 0) {
            this.timeRemaining = 0;
            gameOver();
        }
    }

    draw() {
        ctx.save();

        // sayaç arka planı
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(canvas.width / 2 - 60, 10, 120, 40);

        ctx.strokeStyle = '#4CAF50';
        ctx.lineWidth = 2;
        ctx.strokeRect(canvas.width / 2 - 60, 10, 120, 40);

        let m = Math.floor(this.timeRemaining / 60);
        let s = Math.floor(this.timeRemaining % 60);
        if (m < 10) m = "0" + m;
        if (s < 10) s = "0" + s;
        let timeStr = m + ":" + s;

        if (this.timeRemaining <= 10) {
            ctx.fillStyle = '#ff6b6b';
        } else {
            ctx.fillStyle = '#FFFFFF';
        }

        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(timeStr, canvas.width / 2, 38);

        // oyunu durdurma ekranı
        if (this.isPaused && gameRunning) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = '#FFFFFF';
            ctx.font = 'bold 40px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('DURAKLATILDI', canvas.width / 2, canvas.height / 2);

            ctx.font = 'bold 20px Arial';
            ctx.fillStyle = '#dddddd';
            ctx.fillText('Devam etmek için P tuşuna basın', canvas.width / 2, canvas.height / 2 + 40);
        }

        ctx.restore();
    }

    togglePause() {
        this.isPaused = !this.isPaused;
        if (!this.isPaused) {
            this.lastTime = Date.now();
        }
    }
}
