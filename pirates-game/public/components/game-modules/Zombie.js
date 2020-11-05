"use strict";
class Zombie {
    constructor(scene, spawnName, range) {
        this.spawn = scene.tilemap.findObject("Objects", obj => obj.name === spawnName);
        this.himSelf = scene.physics.add.sprite(this.spawn.x, this.spawn.y, "zombie", "zombie_stand");
        this.himSelf.setOrigin(0.5,1);
        this.range = range;
        generateZombieAnimations();
        zombieMovement(scene); // besoin d'ajouter this en param?
        manageColliders();
    }

    attack(player){
        if(player.isJumping){
            this.himSelf.destroy();
        }else{
            killPlayer(); // En attente de savoir ou est placé cette méthode
        }
    }
}

function zombieMovement(scene) {
    this.himSelf.anims.play("zombieWalk");
    scene.tweens.add({
        targets : this.himSelf,
        x : this.spawn.x + this.range,
        ease : "Linear",
        duration : 1000 * this.range / 100,
        yoyo : true,
        repeat : -1,
        onStart : function (){},
        onComplete : function (){},
        onYoyo : function (tween){tween.targets[0].flipX = !tween.targets[0].flipX},
        onRepeat : function (tween){tween.targets[0].flipX = !tween.targets[0].flipX}
    });
}

function generateZombieAnimations(){
    gameSettings.scene.anims.create({
        key : "zombieWalk",
        frames : gameSettings.scene.anims.generateFrameNames("zombie", {prefix: "zombie_walk", start:1, end: 2}),
        frameRate : 5,
        repeat : -1
    });
}

function manageColliders(scene, player){
    scene.physics.add.collider(this.himSelf, scene.worldLayer);
    scene.physics.add.overlap(player.itSelf, this.himSelf, this.attack(player));
}

module.exports = Zombie;