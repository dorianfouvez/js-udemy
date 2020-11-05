"use strict";

class Player {
    constructor(scene) {
        this.himSelf = scene.physics.add.sprite(scene.spawn.x, scene.spawn.y, "player", "adventurer_stand");
        this.himSelf.setCollideWorldBounds(true);
        this.himSelf.setOrigin(0.5,1);
        this.isJumping = false;
        this.isAlive = true; // Obligé ??? ne peut on pas changer wolrd.gameOver directement?
        generatePlayerAnimations(); // Faut il lui passer la scene en param ?
    }

    managePlayerMovement(){ // Faut il passer le cursor en param?
        if(this.isAlive){
            // Movements
            if(gameSettings.cursor.left.isDown){
                this.himSelf.setVelocityX(-200);
                this.himSelf.flipX = true;
            }else if(gameSettings.cursor.right.isDown){
                this.himSelf.setVelocityX(200);
                this.himSelf.flipX = false;
            }else{
                this.himSelf.setVelocityX(0);
            }
    
            if(gameSettings.cursor.up.isDown && this.himSelf.body.onFloor()){
                this.himSelf.setVelocityY(-365);
            }
    
    
            // Run Animations
            if(this.himSelf.body.onFloor()){
                this.isJumping = false;
            }else{
                this.isJumping = true;
            }
    
            if(this.isJumping){
                this.himSelf.setTexture("player", "adventurer_jump");
            }else{
                if(gameSettings.cursor.left.isDown){
                    this.himSelf.play("playerWalk",true);
                }else if(gameSettings.cursor.right.isDown){
                    this.himSelf.play("playerWalk",true);
                }else{
                    this.himSelf.play("playerIdle",true);
                }
            }
        }else{
            this.himSelf.setVelocityX(0);
            //this.himSelf.setTexture("player", "adventurer_hurt");
        }
    }

    killPlayer(){
        this.himSelf.setTexture("player", "adventurer_hurt");
        this.isAlive = false;
    }
}

function generatePlayerAnimations(){
    gameSettings.scene.anims.create({
        key : "playerWalk",
        frames : gameSettings.scene.anims.generateFrameNames("player", {prefix: "adventurer_walk", start:1, end: 2}),
        frameRate : 5,
        repeat : -1
    });

    gameSettings.scene.anims.create({
        key : "playerIdle",
        frames : [
            {key: "player", frame: "adventurer_stand"},
            {key: "player", frame: "adventurer_idle"}
        ],
        frameRate : 2,
        repeat : -1
    });
}

module.exports = Player;