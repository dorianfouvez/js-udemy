var player = {
    playerBarre : null,
    playerCenter : null,
    speed : 5,
    ableToMove : true,
    ident : null,
    ident2 : null,

    initialiserPlayer : function(){
        this.playerBarre = jeu.scene.physics.add.sprite(jeu.world.positionDebut.x,jeu.world.positionDebut.y,"playerBarre").setScale(2);
        this.playerCenter = jeu.scene.physics.add.sprite(jeu.world.positionDebut.x,jeu.world.positionDebut.y,"playerCenter").setScale(2);

        this.ident = jeu.scene.physics.add.sprite(jeu.world.positionDebut.x + this.playerBarre.width,jeu.world.positionDebut.y).setScale(0.5);
        this.ident2 = jeu.scene.physics.add.sprite(jeu.world.positionDebut.x - this.playerBarre.width,jeu.world.positionDebut.y).setScale(0.5);
    },
    
    generatePlayerAnimations : function(){
       
    },

    gererDeplacement : function(){
        if(this.ableToMove){
            if(jeu.cursor.left.isDown) this.playerCenter.x -= this.speed ;
            if(jeu.cursor.right.isDown) this.playerCenter.x += this.speed;
            if(jeu.cursor.up.isDown) this.playerCenter.y -= this.speed;
            if(jeu.cursor.down.isDown) this.playerCenter.y += this.speed;
            if(jeu.cursor.space.isDown) this.speed = 10;
            if(jeu.cursor.space.isUp) this.speed = 5;
        }
        this.playerBarre.x = this.playerCenter.x;
        this.playerBarre.y = this.playerCenter.y;
    },
    gererRotation(){
        var angle = this.playerBarre.angle - 1.5;
        this.playerBarre.setAngle(angle);
        this.ident.x = this.playerCenter.x + (this.playerBarre.width - 10) * (Math.cos(angle * Math.PI / 180));
        this.ident.y = this.playerCenter.y + (this.playerBarre.width - 10) * (Math.sin(angle * Math.PI / 180));

        this.ident2.x = this.playerCenter.x - (this.playerBarre.width - 10) * (Math.cos(angle * Math.PI / 180));
        this.ident2.y = this.playerCenter.y - (this.playerBarre.width - 10) * (Math.sin(angle * Math.PI / 180));
    },
}