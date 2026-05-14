class PlayerTank {
    constructor(x,y){
        this.x=x;
        this.y=y;
        this.radius=25;
        this.angle=0;
        this.speed=2;
        this.health=50;
        this.maxHealth=50;
        this.bullets=[];
        this.lastShot=0;
        this.shootCooldown=500;
        this.color='#4CAF50';
        this.isShooting=false;
        this.totalDamageTaken=0; //hasar aldikca guclenme mekanigi
        this.powerLevel=1;
        this.bulletDamage=5;
    }
    
    update() {
        if (keys['w'] || keys['W']) {
            this.y-=this.speed;
        }
        if (keys['s'] || keys['S']) {
            this.y+=this.speed;
        }
        if (keys['a'] || keys['A']) {
            this.x-=this.speed;
        }
        if (keys['d'] || keys['D']) {
            this.x+=this.speed;
        } //hareket etme tuslari
        this.x=Math.max(this.radius,Math.min(canvas.width-this.radius,this.x));
        this.y=Math.max(this.radius,Math.min(canvas.height-this.radius,this.y));
        this.angle=Math.atan2(mouseY-this.y,mouseX-this.x); //mousea donme hareketi
        if (this.isShooting){ //surekli ates etme
            this.shoot();
        }
        this.bullets=this.bullets.filter(bullet=>{ //mermi guncelleme
            bullet.update();
            return bullet.active;
        });
    }
    shoot() {
        const now = Date.now();
        if (now-this.lastShot>this.shootCooldown) {
            const bullet = new Bullet(
                this.x+Math.cos(this.angle)*this.radius,
                this.y+Math.sin(this.angle)*this.radius,
                this.angle,
                this
            );
            this.bullets.push(bullet);
            this.lastShot=now;
            soundManager.playShoot();
        }
    }
    draw() {
        ctx.save();
        ctx.translate(this.x,this.y);
        ctx.fillStyle=this.color;
        ctx.beginPath();
        ctx.arc(0,0,this.radius,0,Math.PI*2);
        ctx.fill();
        ctx.rotate(this.angle); //tetik
        ctx.fillStyle='#333';
        ctx.fillRect(this.radius-5,-8,30,16);
        ctx.restore();
        if (this.health<this.maxHealth) { //hp bar
            ctx.fillStyle='rgba(255,0,0,0.3)';
            ctx.fillRect(this.x-30,this.y-this.radius-15,60,8);
            ctx.fillStyle='#ff6b6b';
            ctx.fillRect(this.x-30,this.y-this.radius-15,60*(this.health/this.maxHealth),8);
        }
        if (this.powerLevel>1) { //guc seviyesi display mekanigi
            ctx.fillStyle='#ffffff';
            ctx.font='bold 12px Arial';
            ctx.textAlign='center';
            ctx.fillText(`Lv.${this.powerLevel}`,this.x,this.y+this.radius+25);
        }
        this.bullets.forEach(bullet=>bullet.draw()); //mermiler
    }
    takeDamage(damage) {
        this.health-=damage;
        this.totalDamageTaken+=damage;
        this.updatePowerLevel(); //hasar aldikca guclenme mekanigi
        soundManager.playPlayerHit();
        if (this.health<=0) {
            this.health=0;
            gameOver();
        }
        updateUI();
    }
    updatePowerLevel() { //guc seviyesi guncelleme (hasara gore)
        const oldLevel=this.powerLevel;
        this.powerLevel=Math.floor(this.totalDamageTaken / 20) + 1; //20 hasar = 1 guc seviyesi
        if (this.powerLevel>oldLevel) {
            this.bulletDamage=5+(this.powerLevel-1)*3;
            const colors=['#4CAF50','#2196F3','#FF9800','#F44336']; //guclendikce renk degismesi
            this.color=colors[Math.min(this.powerLevel-1,colors.length-1)];
            soundManager.playPowerUp(); //guclenme ses efekti
            console.log(`Güç seviyesi ${this.powerLevel} oldu! Hasar: ${this.bulletDamage}`);
        }
    }
}
