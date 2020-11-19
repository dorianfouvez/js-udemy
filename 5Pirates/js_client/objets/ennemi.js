var ennemiTemplate = {
    createEnnemi : function(){
        var ennemi = {
            aEnnemi : null,
            fireRate : 500,
            nextFire : 0,
            bullets : null,
            range : 500,
            isAlive : true,
            startPosition : null,
            targetPosition : null,
            goToFin : true,
        
            initEnnemi : function (positionDebut){
                this.startPosition = positionDebut;
                this.targetPosition = {
                    x : positionDebut.properties[0].value,
                    y : positionDebut.properties[1].value
                }
                this.aEnnemi = jeu.scene.physics.add.sprite(this.startPosition.x,this.startPosition.y,"ennemi1a");
                this.aEnnemi.setSize(50,50);
                this.aEnnemi.pv = 100;
                this.aEnnemi.barreRouge = jeu.scene.physics.add.sprite(this.startPosition.x,this.startPosition.y,"lifeRED").setOrigin(0,0);
                this.aEnnemi.barreRouge.setPosition(this.aEnnemi.barreRouge.x - this.aEnnemi.barreRouge.width/2,this.aEnnemi.barreRouge.y);
                this.aEnnemi.barreVerte = jeu.scene.physics.add.sprite(this.startPosition.x,this.startPosition.y,"life").setOrigin(0,0);
                this.aEnnemi.barreVerte.setPosition(this.aEnnemi.barreVerte.x - this.aEnnemi.barreVerte.width/2,this.aEnnemi.barreVerte.y);
                this.bullets = jeu.scene.physics.add.group({
                    defaultKey : "cannonBall"
                })

                var angle = Phaser.Math.Angle.Between (this.startPosition.x,this.startPosition.y,this.targetPosition.x,this.targetPosition.y);
                angle = angle * 180 / Math.PI - 90;
                this.aEnnemi.setAngle(angle);
                this.gererCollide();
            },
            gererCollide : function(){
                jeu.scene.physics.add.collider(this.aEnnemi, jeu.world.layerLand);
                this.aEnnemi.collisionBullet = jeu.scene.physics.add.overlap(this.aEnnemi, jeu.player.bullets, this.takeDamage);
                jeu.scene.physics.add.overlap(jeu.player.aPlayer, this.bullets, jeu.player.takeDamage);
            },
            takeDamage : function(ennemi,bullets){
                bullets.destroy();
                ennemi.pv -= jeu.player.attaque;
                if(ennemi.pv < 0)  ennemi.pv = 0;
                if(ennemi.pv >= 100){
                    ennemi.setTexture("ennemi1a");
                } else if(ennemi.pv >= 50){
                    ennemi.setTexture("ennemi1b");
                }else if(ennemi.pv >= 1){
                    ennemi.setTexture("ennemi1c");
                } else {
                    ennemi.setTexture("ennemi1d");
                    jeu.ennemiTemplate.detruireBateau(ennemi);
                }
                ennemi.barreVerte.setScale(ennemi.pv / 100,1);
            },
            tirer : function(){
                if(this.isAlive && this.aEnnemi.pv <=0) this.isAlive = false;
                if(jeu.player.isAlive && this.isAlive && Math.abs(this.aEnnemi.x - jeu.player.aPlayer.x) < this.range && Math.abs(this.aEnnemi.y - jeu.player.aPlayer.y) < this.range){
                    if(jeu.scene.time.now > this.nextFire){
                        this.nextFire = jeu.scene.time.now  + this.fireRate;
                        var shoot = this.bullets.get(this.aEnnemi.x,this.aEnnemi.y)
                        jeu.scene.physics.moveTo(shoot, jeu.player.aPlayer.x,jeu.player.aPlayer.y,750);
                        shoot.checkWorldBounds = true;
                        shoot.outOfBoundsKill = true;
                    }
                }
            },
            gererDeplacement : function(){
                if(this.isAlive){
                    if(this.goToFin && (Math.abs(this.aEnnemi.x - this.targetPosition.x) > 10 || Math.abs(this.aEnnemi.y - this.targetPosition.y) > 10)){
                        jeu.scene.physics.moveTo(this.aEnnemi, this.targetPosition.x,this.targetPosition.y,150);
                    } else {
                        if(this.goToFin) {
                            this.goToFin = false;
                            this.aEnnemi.setFlip(true,true);
                        }
                    }
                    if(!this.goToFin && (Math.abs(this.aEnnemi.x - this.startPosition.x) > 10 || Math.abs(this.aEnnemi.y - this.startPosition.y) > 10)){
                        jeu.scene.physics.moveTo(this.aEnnemi, this.startPosition.x,this.startPosition.y,150);
                    } else {
                        if(!this.goToFin) {
                            this.goToFin = true;
                            this.aEnnemi.setFlip(false,false);
                        }
                    }
                    this.aEnnemi.barreRouge.x = this.aEnnemi.x - this.aEnnemi.barreRouge.width/2;
                    this.aEnnemi.barreRouge.y = this.aEnnemi.y;
                    this.aEnnemi.barreVerte.x = this.aEnnemi.x - this.aEnnemi.barreVerte.width/2;
                    this.aEnnemi.barreVerte.y = this.aEnnemi.y;
                   
                }
            }
        }
        return ennemi;
    },
    detruireBateau : function(ennemi){
        jeu.scene.physics.world.removeCollider(ennemi.collisionBullet);
        var explo = [];
        explo.push(jeu.scene.physics.add.sprite(ennemi.x,ennemi.y).play("destruction"));
        jeu.scene.sound.play("explosionSound");
        jeu.scene.time.delayedCall(200,function(){
            explo.push(jeu.scene.physics.add.sprite(ennemi.x-20,ennemi.y-20).play("destruction").setScale(0.5));
            explo.push(jeu.scene.physics.add.sprite(ennemi.x+20,ennemi.y+20).play("destruction").setScale(0.5));
            jeu.scene.sound.play("explosionSound");
        },this);
        jeu.scene.time.delayedCall(400,function(){
            explo.push(jeu.scene.physics.add.sprite(ennemi.x+20,ennemi.y-20).play("destruction").setScale(0.8));
            jeu.scene.sound.play("explosionSound");
        },this);
        jeu.scene.time.delayedCall(600,function(){
            explo.push(jeu.scene.physics.add.sprite(ennemi.x,ennemi.y).play("destruction").setScale(2));
            jeu.scene.sound.play("explosionSound");
        },this);
        jeu.scene.time.delayedCall(900,function(){
            ennemi.barreRouge.destroy();
            ennemi.barreVerte.destroy();
            ennemi.destroy();
            for(var i = 0; i < explo.length ; i++){
                explo[i].destroy();
            }
        },this);
    }
}
