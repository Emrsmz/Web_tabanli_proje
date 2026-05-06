// Oyuncu tankı
class PlayerTank {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 25;
        this.angle = 0;
        this.speed = 2;
        this.health = 50;
        this.maxHealth = 50;
        this.bullets = [];
        this.lastShot = 0;
        this.shootCooldown = 500;
        this.color = '#4CAF50';
        this.isShooting = false;
    }
    
    update() {
        // Hareket
        if (keys['w'] || keys['W']) {
            this.y -= this.speed;
        }
        if (keys['s'] || keys['S']) {
            this.y += this.speed;
        }
        if (keys['a'] || keys['A']) {
            this.x -= this.speed;
        }
        if (keys['d'] || keys['D']) {
            this.x += this.speed;
        }
        
        // Sınırları kontrol et
        this.x = Math.max(this.radius, Math.min(canvas.width - this.radius, this.x));
        this.y = Math.max(this.radius, Math.min(canvas.height - this.radius, this.y));
        
        // Mouse'a dön
        this.angle = Math.atan2(mouseY - this.y, mouseX - this.x);
        
        // Sürekli ateş etme
        if (this.isShooting) {
            this.shoot();
        }
        
        // Mermileri güncelle
        this.bullets = this.bullets.filter(bullet => {
            bullet.update();
            return bullet.active;
        });
    }
    
    shoot() {
        const now = Date.now();
        if (now - this.lastShot > this.shootCooldown) {
            const bullet = new Bullet(
                this.x + Math.cos(this.angle) * this.radius,
                this.y + Math.sin(this.angle) * this.radius,
                this.angle,
                this
            );
            this.bullets.push(bullet);
            this.lastShot = now;
            soundManager.playShoot();
        }
    }
    
    draw() {
        // Tank gövdesi
        ctx.save();
        ctx.translate(this.x, this.y);
        
        // Gövde
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Namlu
        ctx.rotate(this.angle);
        ctx.fillStyle = '#333';
        ctx.fillRect(this.radius - 5, -8, 30, 16);
        
        ctx.restore();
        
        // Can barı
        if (this.health < this.maxHealth) {
            ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
            ctx.fillRect(this.x - 30, this.y - this.radius - 15, 60, 8);
            
            ctx.fillStyle = '#ff6b6b';
            ctx.fillRect(this.x - 30, this.y - this.radius - 15, 60 * (this.health / this.maxHealth), 8);
        }
        
        // Mermileri çiz
        this.bullets.forEach(bullet => bullet.draw());
    }
    
    takeDamage(damage) {
        this.health -= damage;
        soundManager.playPlayerHit();
        if (this.health <= 0) {
            this.health = 0;
            gameOver();
        }
        updateUI();
    }
}
