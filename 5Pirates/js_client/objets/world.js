var world = {
    tilemap : null,
    tileset : null,
    layerWatter : null,
    layerLowLand : null,
    layerLand : null,
    layerItems : null,
    positionDebut : null,
    positionFin : null,
    drapeauFin : null,
    score : 0,
    scoreText : null,
    positionsEnnemis : [],
    isFinLevel : false,

    initialiserWorld : function(){
        this.tilemap = jeu.scene.make.tilemap({key: "level" + jeu.level});
        this.tileset = this.tilemap.addTilesetImage("tilesheet","tiles");
        this.layerWatter = this.tilemap.createStaticLayer("watter",this.tileset,0,0);
        this.layerLowLand = this.tilemap.createStaticLayer("lowland",this.tileset,0,0);
        this.layerLand = this.tilemap.createStaticLayer("land",this.tileset,0,0);
        this.layerItems = this.tilemap.createDynamicLayer("items",this.tileset,0,0);

        this.positionDebut = this.tilemap.findObject("Objects", obj => obj.name === "Debut");
        jeu.scene.add.sprite(this.positionDebut.x,this.positionDebut.y,"debut").setScale(3);
        this.positionFin = this.tilemap.findObject("Objects", obj => obj.name === "Fin");
        this.drapeauFin = jeu.scene.physics.add.sprite(this.positionFin.x,this.positionFin.y,"fin").setScale(3);

        this.layerLand.setCollisionByProperty({Collides : true});

        jeu.scene.physics.world.setBounds(0,0,this.tilemap.widthInPixels,this.tilemap.heightInPixels);

        this.genererPositionsEnnemis();
    },
    genererPositionsEnnemis : function(){
        this.positionsEnnemis = [];
        for (var i = 1 ; i <= this.positionDebut.properties[0].value ; i++){
            this.positionsEnnemis.push(this.tilemap.findObject("Objects", obj => obj.name === "ennemi"+i));
        }
    },
    gererCollider : function(){
        jeu.scene.physics.add.collider(jeu.player.aPlayer, this.layerLand);
        jeu.scene.physics.add.overlap(jeu.player.aPlayer,this.drapeauFin, this.finLevel);
    },
    gererCamera : function(){
        jeu.scene.cameras.main.startFollow(jeu.player.aPlayer);
        jeu.scene.cameras.main.setBounds(0,0,this.tilemap.widthInPixels, this.tilemap.heightInPixels);
    },
    finLevel : function(){
        if(!jeu.world.isFinLevel){
            jeu.world.isFinLevel = true;
            jeu.level++;
            jeu.scene.scene.restart();
        }
    },
}