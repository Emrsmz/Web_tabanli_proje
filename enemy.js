class EnemyTank {
    constructor(x,y,level=1,phaseOffset=0) {
        this.x=x;
        this.y=y;
        this.radius=20;
        this.angle=0;
        this.speed=0.7+(level-1)*0.1; //seviye arttikca hiz ve hasar artar
        this.level=level; // seviye saklama
        this.health=30;
        this.maxHealth=30;
        this.bullets=[];
        this.lastShot=0;
        this.shootCooldown=2500;
        this.color='#ff6b6b';
        this.targetAngle=0; //farkli dusman fazi (clipping onleme)
        this.moveTimer=phaseOffset;
    }
    update() {
        this.moveTimer++; //sdaire cizerek ilerleme
        const centerX=canvas.width/2;
        const centerY=canvas.height/2;
        const angle=this.moveTimer*0.005*this.speed; // merkeze gore daire cizme
        const radiusX =200+Math.sin(this.moveTimer*0.01)*50;
        const radiusY =150+Math.cos(this.moveTimer*0.01)*50;
        this.x=centerX+Math.cos(angle)*radiusX;
        this.y=centerY+Math.sin(angle)*radiusY;
        this.x=Math.max(this.radius,Math.min(canvas.width-this.radius,this.x)); //sinir kontrolu
        this.y=Math.max(this.radius,Math.min(canvas.height-this.radius,this.y));
        if (player) { //oyuncu locating ve ates etme
            this.targetAngle=Math.atan2(player.y-this.y,player.x-this.x);
            let angleDiff=this.targetAngle-this.angle; //oyuncuya dogru donme
            while (angleDiff>Math.PI) angleDiff-=Math.PI*2;
            while (angleDiff<-Math.PI) angleDiff+=Math.PI*2;
            this.angle+=angleDiff*0.05;
            const now = Date.now(); //ates etme
            if (now-this.lastShot>this.shootCooldown) {
                const bullet = new Bullet(
                    this.x+Math.cos(this.angle)*this.radius,
                    this.y+Math.sin(this.angle)*this.radius,
                    this.angle,
                    this
                );
                this.bullets.push(bullet);
                this.lastShot=now;
                soundManager.playEnemyShoot();
            }
        }
        this.bullets=this.bullets.filter(bullet=>{ //mermi guncelleme
            bullet.update();
            return bullet.active;
        });
    }
    draw() {
        ctx.save(); //tank govde
        ctx.translate(this.x,this.y);
        ctx.fillStyle=this.color;
        ctx.beginPath();
        ctx.arc(0,0,this.radius,0,Math.PI*2);
        ctx.fill();
        ctx.rotate(this.angle); //tetik
        ctx.fillStyle ='#333';
        ctx.fillRect(this.radius-5,-6,25,12);
        ctx.restore();
        if (this.health<this.maxHealth) { //hp bar
            ctx.fillStyle='rgba(255,0,0,0.3)';
            ctx.fillRect(this.x-25,this.y-this.radius-15,50,6);
            ctx.fillStyle='#ff6b6b';
            ctx.fillRect(this.x-25,this.y-this.radius-15,50*(this.health/this.maxHealth),6);
        }
        this.bullets.forEach(bullet=>bullet.draw()); //mermiler
    }
    takeDamage(damage) {
        this.health-=damage;
        if (this.health<=0) {
            return true;
        }
        return false;
    }
}
