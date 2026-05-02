// Düşman tankı
class EnemyTank {
    constructor(x, y, level = 1) {
        this.x = x;
        this.y = y;
        this.radius = 20;
        this.angle = 0;
        // Seviye arttıkça hız artar - seviye başına 0.1 ek
        this.speed = 0.7 + (level - 1) * 0.1;
        this.level = level; // Seviyeyi sakla
        this.health = 30;
        this.maxHealth = 30;
        this.bullets = [];
        this.lastShot = 0;
        this.shootCooldown = 2500;
        this.color = '#ff6b6b';
        this.targetAngle = 0;
        this.moveTimer = 0;
    }
    
    update() {
        // Sabit hareket deseni - daire çizerek hareket
        this.moveTimer++;
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        
        // Merkeze göre daire çiz - hızı seviyeye göre ayarla
        const angle = this.moveTimer * 0.005 * this.speed; // Hıza göre daire hareketi
        const radiusX = 200 + Math.sin(this.moveTimer * 0.01) * 50; // X yarıçapı
        const radiusY = 150 + Math.cos(this.moveTimer * 0.01) * 50; // Y yarıçapı
        
        this.x = centerX + Math.cos(angle) * radiusX;
        this.y = centerY + Math.sin(angle) * radiusY;
        
        // Sınırları kontrol et
        this.x = Math.max(this.radius, Math.min(canvas.width - this.radius, this.x));
        this.y = Math.max(this.radius, Math.min(canvas.height - this.radius, this.y));
        
        // Oyuncuya dön ve ateş et
        if (player) {
            this.targetAngle = Math.atan2(player.y - this.y, player.x - this.x);
            
            // Yavaşça hedef açıya dön
            let angleDiff = this.targetAngle - this.angle;
            while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
            while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
            this.angle += angleDiff * 0.05;
            
            // Ateş et
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
            }
        }
        
        // Mermileri güncelle
        this.bullets = this.bullets.filter(bullet => {
            bullet.update();
            return bullet.active;
        });
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
        ctx.fillRect(this.radius - 5, -6, 25, 12);
        
        ctx.restore();
        
        // Can barı
        if (this.health < this.maxHealth) {
            ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
            ctx.fillRect(this.x - 25, this.y - this.radius - 15, 50, 6);
            
            ctx.fillStyle = '#ff6b6b';
            ctx.fillRect(this.x - 25, this.y - this.radius - 15, 50 * (this.health / this.maxHealth), 6);
        }
        
        // Mermileri çiz
        this.bullets.forEach(bullet => bullet.draw());
    }
    
    takeDamage(damage) {
        this.health -= damage;
        if (this.health <= 0) {
            return true; // Öldü
        }
        return false;
    }
}
