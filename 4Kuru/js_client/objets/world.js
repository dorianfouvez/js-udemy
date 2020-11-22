var world = {
    tilemap : null,
    tilesetTerrain : null,
    tilesetItem : null,
    downLayerTerrain : null,
    downLayerItem : null,
    worldLayer : null,
    worldLayerItem : null,
    topLayer : null,
    overlapLayer : null,
    positionDebut : null,
    positionFin : null,
    drapeauFin : null,
    score : 0,
    scoreLevel : 0,
    scoreText : null,
    isLevelFin : false,
    nbPieces : null,

    initialiserWorld : function(){
        this.tilemap = jeu.scene.make.tilemap({key: "map"+jeu.level});
        this.tilesetTerrain = this.tilemap.addTilesetImage("terrain","terrain");
        this.tilesetItem = this.tilemap.addTilesetImage("tilesPerso","tilesPerso");
        this.downLayerTerrain = this.tilemap.createStaticLayer("botTerrain",this.tilesetTerrain,0,0);
        this.downLayerItem = this.tilemap.createStaticLayer("botItem",this.tilesetItem,0,0);
        this.worldLayer = this.tilemap.createStaticLayer("world",this.tilesetTerrain,0,0);
        this.worldLayerItem = this.tilemap.createStaticLayer("worldItem",this.tilesetItem,0,0);
        this.topLayer = this.tilemap.createStaticLayer("top",this.tilesetTerrain,0,0);
        this.overlapLayer = this.tilemap.createDynamicLayer("overlap",this.tilesetTerrain,0,0);

        this.positionDebut = this.tilemap.findObject("Objects", obj => obj.name === "Debut");
        this.nbPieces = this.positionDebut.properties[0].value;
        this.positionFin = this.tilemap.findObject("Objects", obj => obj.name === "Fin");
        jeu.scene.add.sprite(this.positionDebut.x, this.positionDebut.y,"debut").setScale(3);
        this.drapeauFin = jeu.scene.physics.add.sprite(this.positionFin.x, this.positionFin.y,"fin").setScale(3);

        this.worldLayer.setCollisionByProperty({Collides : true});

        jeu.scene.physics.world.setBounds(0,0,this.tilemap.widthInPixels,this.tilemap.heightInPixels);

        var policeTitre = {
            fontSize : "32px",
            color : "#FFFFFF",
            fontFamily : "ZCOOL KuaiLe"
        }
        
        var panel = jeu.scene.add.sprite(400,0,"panel");
        panel.setScale(4,1);
        panel.setOrigin(0,0);
        panel.setScrollFactor(0);

        this.scoreText = jeu.scene.add.text (460, 30, "Score : " +this.score + " - level " + jeu.level, policeTitre);
        this.scoreText.setScrollFactor(0);
    },
    gererCollider : function(){
        jeu.scene.physics.add.overlap(jeu.player.playerCenter,this.drapeauFin, this.finLevel);
       
        this.genererPieces();
        this.genererColliderWorld();
        this.genererColliderItem();

        jeu.scene.physics.add.overlap(jeu.player.ident, this.worldLayer);
        jeu.scene.physics.add.overlap(jeu.player.ident2, this.worldLayer);
        jeu.scene.physics.add.overlap(jeu.player.ident, this.worldLayerItem);
        jeu.scene.physics.add.overlap(jeu.player.ident2, this.worldLayerItem);
    },
    gererCamera : function(){
        jeu.scene.cameras.main.startFollow(jeu.player.playerCenter);
        jeu.scene.cameras.main.setBounds(0,0,this.tilemap.widthInPixels,this.tilemap.heightInPixels);
    },
    finLevel : function(){
        jeu.player.ableToMove = false;
        if(!jeu.world.isLevelFin){
            jeu.scene.physics.moveTo(jeu.player.playerCenter,jeu.world.positionFin.x,jeu.world.positionFin.y,100);
        }
        if(jeu.player.playerCenter.x > jeu.world.positionFin.x -2 && jeu.player.playerCenter.x < jeu.world.positionFin.x + 2){
            jeu.scene.sound.play("win");
            jeu.player.playerCenter.body.stop();
            jeu.world.isLevelFin = true;
            jeu.world.nextLevel(); 
        }
    },
    contactPlayerWorld : function(){
        jeu.world.scoreLevel = 0;
        jeu.scene.sound.play("hurt");
        jeu.scene.scene.restart();
    },
    genererColliderItem : function(){
        for(var i = 0 ; i <= 17; i++){
            this.worldLayerItem.setTileIndexCallback(this.tilesetItem.firstgid + i,this.contactPlayerWorld,this);
        }
    },
    genererColliderWorld : function(){
        for(var i = 21 ; i <= 39; i++){
            if( i !== 30){
                this.worldLayer.setTileIndexCallback(this.tilesetTerrain.firstgid + i,this.contactPlayerWorld,this);
            }
        }
    },
    nextLevel : function(){
        jeu.world.score += jeu.world.scoreLevel;
        jeu.level++;
        jeu.scene.scene.restart();
        jeu.player.ableToMove = true;
        this.isLevelFin = false;
    },
    genererPieces : function(){
        for (var i = 1 ; i <= this.nbPieces ; i++){
            var object = this.tilemap.findObject("Objects", obj => obj.name === "Piece"+i);
            var piece = jeu.scene.physics.add.sprite(object.x,object.y,"piece1").play("pieceAnim");
            jeu.scene.physics.add.overlap(jeu.player.playerCenter, piece, this.collectPiece);
        }
    },
    collectPiece : function(player,piece){
        jeu.scene.sound.play("collect");
        jeu.world.scoreLevel +=10;
        jeu.world.scoreText.setText("Score : "+ (jeu.world.score + jeu.world.scoreLevel)  + " -  Level " + jeu.level);
        piece.destroy();
    },
    creerAnimationPiece : function(){
        jeu.scene.anims.create({
            key : "pieceAnim",
            frames : [
              {key : "piece1"},
              {key : "piece2",}
            ],
            frameRate : 8,
            repeat : -1
        });
    }
}