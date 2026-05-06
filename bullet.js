// Mermi
class Bullet {
    constructor(x, y, angle, owner) {
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.speed = 8;
        this.radius = 8;
        this.owner = owner;
        this.active = true;
        this.damage = 5;
    }
    
    update() {
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
        
        // Sınırları kontrol et
        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
            this.active = false;
        }
        
        // Çarpışma kontrolü
        if (this.owner instanceof PlayerTank) {
            enemies.forEach((enemy, index) => {
                const dist = Math.hypot(enemy.x - this.x, enemy.y - this.y);
                if (dist < enemy.radius + this.radius) {
                    if (enemy.takeDamage(this.damage)) {
                        enemies.splice(index, 1);
                        soundManager.playExplosion();
                    } else {
                        soundManager.playHit();
                    }
                    this.active = false;
                }
            });
        } else if (this.owner instanceof EnemyTank && player) {
            const dist = Math.hypot(player.x - this.x, player.y - this.y);
            if (dist < player.radius + this.radius) {
                player.takeDamage(this.damage);
                this.active = false;
            }
        }
    }
    
    draw() {
        ctx.fillStyle = this.owner instanceof PlayerTank ? '#4CAF50' : '#ff6b6b';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}
