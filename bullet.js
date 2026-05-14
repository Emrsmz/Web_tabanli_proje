// mermi sinifi
class Bullet {
    constructor(x, y, angle, owner) {
        // merminin baslangic konumu
        this.x = x;
        this.y = y;
        // merminin hareket yonu
        this.angle = angle;
        // hizi
        this.speed = 8;
        // boyutu
        this.radius = 8;
        this.owner = owner;
        this.active = true;
        
        // oyuncunun gucune gore hasar degisiyor
        if (owner instanceof PlayerTank) {
            this.damage = owner.bulletDamage;
        } else {
            this.damage = 5;
        }
    }
    
    update() {
        // mermi aciya gore hareket ediyor
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
        
        // sinir kontrolu ekran disina cikarsa siliniyor
        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
            this.active = false;
        }
        
        // carpisma kontrolu(mermi ile dusman arasinda)
        if (this.owner instanceof PlayerTank) {
            enemies.forEach((enemy, index) => {
                // mermi ile dusman arasi mesafe
                const dist = Math.hypot(enemy.x - this.x, enemy.y - this.y);
                // carpisma kontrolu
                if (dist < enemy.radius + this.radius) {
                    if (enemy.takeDamage(this.damage)) {
                        enemies.splice(index, 1);
                        score += 10; 
                        // skor artisi 
                        soundManager.playExplosion();
                    } else {
                        soundManager.playHit();
                    }
                    this.active = false;
                }
            });
        } else if (this.owner instanceof EnemyTank && player) {
            // dusman mermisinin oyuncuya carpmasi
            const dist = Math.hypot(player.x - this.x, player.y - this.y);
            if (dist < player.radius + this.radius) {
                player.takeDamage(this.damage);
                this.active = false;
            }
        }
    }
    
    draw() {
        // oyuncu ve dusman mermilerine farklı renkler verir
        ctx.fillStyle = this.owner instanceof PlayerTank ? '#4CAF50' : '#ff6b6b';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}
