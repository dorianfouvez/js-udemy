// Constance PATH
const PATH_IMAGES = "../images/";
const PATH_IMAGES_BACKGROUNDS = PATH_IMAGES + "backgrounds/";
const PATH_IMAGES_BUTTONS = PATH_IMAGES + "buttons/";
const PATH_IMAGES_ENEMIES = PATH_IMAGES + "enemies/";
const PATH_IMAGES_MISCS = PATH_IMAGES + "miscs/";
const PATH_IMAGES_PLATEFORMS = PATH_IMAGES + "plateforms/";
const PATH_IMAGES_PLAYERS = PATH_IMAGES + "players/";
const PATH_IMAGES_TILESHEETS = PATH_IMAGES + "tilesheets/";
const PATH_SOUNDS = "../sounds/";
const PATH_SOUNDS_MISCS = PATH_SOUNDS + "miscs/";
const PATH_SOUNDS_PLAYERS = PATH_SOUNDS + "players/";

let isAlreadyRun = false;

const Game = () => {
    isAlreadyRun = true;
    // Phaser
    //let page = document.querySelector("#here");

    let config = {
        width : 800,
        height : 600,
        type : Phaser.AUTO,
        /*parent : page,*/
        /*parent : 'page',*/
        backgroundColor: "#CCCCFF",
        scene : {
            preload : preload,
            create : create,
            update : update
        },
        physics: {
            default: "arcade",
            arcade: {
                gravity: {y: 500},
                debug: true
            }
        }
    }

    const game = new Phaser.Game(config);

    // Buttons
    let controls;

    let gameSettings = {
        scene: null,
        world: null,
        player: {
            itSelf: null,
            isJumping: false
        },
        enemies: {
            zombie: {},
        },
        cursor: null
    }

    function preload(){
        // Settings
        gameSettings.scene = this;


        // Images

        // Player
        gameSettings.scene.load.atlas("player", PATH_IMAGES_PLAYERS+"player.png", PATH_IMAGES_PLAYERS+"playerAtlas.json");
        // Map
        gameSettings.scene.load.image("tiles", PATH_IMAGES_TILESHEETS+"tilesheet.png");
        gameSettings.scene.load.tilemapTiledJSON("map", PATH_IMAGES_BACKGROUNDS + "PremiereCarte.json");
        // Enemies
        gameSettings.scene.load.atlas("zombie", PATH_IMAGES_ENEMIES+"zombie.png", PATH_IMAGES_ENEMIES+"zombieAtlas.json");
        // Miscs
        gameSettings.scene.load.image("spark", PATH_IMAGES_MISCS+"particle.png");
        gameSettings.scene.load.image("panel", PATH_IMAGES_MISCS+"yellow_panel.png");
        gameSettings.scene.load.image("vBoxButton", PATH_IMAGES_MISCS+"yellow_boxCheckmark.png");



        // Sounds
        this.load.audio("collectGem", PATH_SOUNDS_MISCS+"gemmeSound.ogg");
    }

    function create(){
        initWorld();

        initPlayer();
        initEnemies();

        generateAnimations();
        //gameSettings.player.play("playerWalk"); // gameSettings.player.anims.play("playerWalk");
        gameSettings.enemies.zombie.himSelf.anims.play("zombieWalk");

        manageColliders();
        manageCamera()

        gameSettings.cursor = gameSettings.scene.input.keyboard.createCursorKeys();

        /*let controlConfig = {
            camera: gameSettings.scene.cameras.main,
            left: cursors.left,
            right: cursors.right,
            up: cursors.up,
            down: cursors.down,
            speed: 0.5
        }
        controls = new Phaser.Cameras.Controls.FixedKeyControl(controlConfig);*/
    }

    function update(time, delta){
        //controls.update(delta);
        fitToScreen()
        playerMovementsUpdate();
    }



    // Own function 
    function fitToScreen(){
        let canvas = document.querySelector("canvas");
        let windowWidth = window.innerWidth;
        let windowHeight = window.innerHeight;
        let windowRate = windowWidth / windowHeight;
        let configRate = config.width / config.height;

        if(windowRate < configRate){
            canvas.style.width = windowWidth + "px";
            canvas.style.height = (windowWidth / configRate) + "px";
        }else{
            canvas.style.width = (windowWidth * configRate) + "px";
            canvas.style.height = windowHeight + "px";
        }
    }

    function initWorld(){
        // Image of Map
        gameSettings.scene.tilemap = gameSettings.scene.make.tilemap({key: "map"});
        gameSettings.scene.tileset = gameSettings.scene.tilemap.addTilesetImage("tilesheet","tiles");

        // Set all levels of the map
        gameSettings.scene.downLayer = gameSettings.scene.tilemap.createStaticLayer("bottom",gameSettings.scene.tileset,0,0);
        gameSettings.scene.worldLayer = gameSettings.scene.tilemap.createStaticLayer("world",gameSettings.scene.tileset,0,0);
        gameSettings.scene.topLayer = gameSettings.scene.tilemap.createStaticLayer("top",gameSettings.scene.tileset,0,0);
        gameSettings.scene.overlapLayer = gameSettings.scene.tilemap.createDynamicLayer("overlap",gameSettings.scene.tileset,0,0);

        // Set Borders of the map
        gameSettings.scene.physics.world.setBounds(0,0,gameSettings.scene.tilemap.widthInPixels,gameSettings.scene.tilemap.heigthInPixels);

        // Set spawn
        gameSettings.scene.spawn = gameSettings.scene.tilemap.findObject("Objects", obj => obj.name === "spawn");
        gameSettings.scene.end = gameSettings.scene.tilemap.findObject("Objects", obj => obj.name === "end");

        // Init score
        gameSettings.scene.score = 0;
        gameSettings.scene.scoreText = gameSettings.scene.add.text(16, 16, "Score : 0 ", {
            fontSize: "32px",
            color : "#FF0000",
            fontFamily: 'Alex Brush'
        });
        gameSettings.scene.scoreText.setScrollFactor(0);

        // Init Game Over
        gameSettings.scene.gameOver = false;

        // Set Items
        gameSettings.scene.overlapLayer.setTileIndexCallback((35+1), collectGemme, gameSettings.scene); // id 35 = blueFragment
        gameSettings.scene.overlapLayer.setTileIndexCallback((36+1), collectGemme, gameSettings.scene);
    }

    function initPlayer(){
        gameSettings.player.itSelf = gameSettings.scene.physics.add.sprite(gameSettings.scene.spawn.x, gameSettings.scene.spawn.y, "player", "adventurer_stand");
        gameSettings.player.itSelf.setCollideWorldBounds(true);
        gameSettings.player.itSelf.setOrigin(0.5,1);
        gameSettings.player.isAlive = true;
    }

    function initEnemies(){
        gameSettings.enemies.zombie.spawn = gameSettings.scene.tilemap.findObject("Objects", obj => obj.name === "zombie1Spawn");
        gameSettings.enemies.zombie.himSelf = gameSettings.scene.physics.add.sprite(gameSettings.enemies.zombie.spawn.x, gameSettings.enemies.zombie.spawn.y, "zombie", "zombie_stand");
        gameSettings.enemies.zombie.himSelf.setOrigin(0.5,1);
    }

    function generateAnimations(){
        // Player
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

        //Zombie
        gameSettings.scene.tweens.add({ // creation de l'animation pour un enemi
            targets: gameSettings.enemies.zombie.himSelf,
            x : gameSettings.enemies.zombie.spawn.x + 700,
            ease : "Linear", // Linear / Cubic / Elastic / Bounce / Back
            duration : 3000, // Higher value = slower animation
            yoyo: true,
            repeat : -1,
            onStart : function (){},
            onComplete : function (){},
            onYoyo : function (){gameSettings.enemies.zombie.himSelf.flipX = !gameSettings.enemies.zombie.himSelf.flipX;},
            onRepeat : function (){gameSettings.enemies.zombie.himSelf.flipX = !gameSettings.enemies.zombie.himSelf.flipX;},
        });

        gameSettings.scene.anims.create({
            key : "zombieWalk",
            frames : gameSettings.scene.anims.generateFrameNames("zombie", {prefix: "zombie_walk", start:1, end: 2}),
            frameRate : 5,
            repeat : -1
        });
    }

    function manageColliders(){
        // Colliders
        gameSettings.scene.worldLayer.setCollisionByProperty({Collides: true});
        gameSettings.scene.physics.add.collider(gameSettings.player.itSelf, gameSettings.scene.worldLayer);

        gameSettings.scene.physics.add.collider(gameSettings.enemies.zombie.himSelf, gameSettings.scene.worldLayer);

        // OverLaps
        gameSettings.scene.physics.add.overlap(gameSettings.player.itSelf, gameSettings.scene.overlapLayer);
        gameSettings.scene.physics.add.overlap(gameSettings.player.itSelf, gameSettings.enemies.zombie.himSelf, attack);
        gameSettings.scene.overlapLayer.setTileIndexCallback((70+1), killPlayer, gameSettings.scene);
        gameSettings.scene.overlapLayer.setTileIndexCallback((75+1), levelEnd, gameSettings.scene);
        gameSettings.scene.overlapLayer.setTileIndexCallback((89+1), levelEnd, gameSettings.scene);
    }

    function manageCamera(){
        gameSettings.scene.cameras.main.startFollow(gameSettings.player.itSelf);
        gameSettings.scene.cameras.main.setBounds(0,0,gameSettings.scene.tilemap.widthInPixels,gameSettings.scene.tilemap.heigthInPixels);
    }

    function playerMovementsUpdate(){
        if(gameSettings.player.isAlive){
            // Movements
            if(gameSettings.cursor.left.isDown){
                gameSettings.player.itSelf.setVelocityX(-200);
                gameSettings.player.itSelf.flipX = true;
            }else if(gameSettings.cursor.right.isDown){
                gameSettings.player.itSelf.setVelocityX(200);
                gameSettings.player.itSelf.flipX = false;
            }else /*if(gameSettings.cursor.left.isUp)*/{
                gameSettings.player.itSelf.setVelocityX(0);
            }
    
            if(gameSettings.cursor.up.isDown && gameSettings.player.itSelf.body.onFloor()){
                gameSettings.player.itSelf.setVelocityY(-365);
            }
    
    
            // Run Animations
            if(gameSettings.player.itSelf.body.onFloor()){
                gameSettings.player.isJumping = false;
            }else{
                gameSettings.player.isJumping = true;
            }
    
            if(gameSettings.player.isJumping){
                gameSettings.player.itSelf.setTexture("player", "adventurer_jump");
            }else{
                if(gameSettings.cursor.left.isDown){
                    gameSettings.player.itSelf.play("playerWalk",true);
                }else if(gameSettings.cursor.right.isDown){
                    gameSettings.player.itSelf.play("playerWalk",true);
                }else{
                    gameSettings.player.itSelf.play("playerIdle",true);
                }
            }
        }else{
            gameSettings.player.itSelf.setVelocityX(0);
            gameSettings.player.itSelf.setTexture("player", "adventurer_hurt");
        }
    }

    function collectGemme(player, tile){
        // Play Sound
        gameSettings.scene.sound.play("collectGem");

        // Generate sparkles
        // tile.getCenterX(), tile.getCenterY();
        let sparkles = gameSettings.scene.add.particles("spark");
        // Version 1
        /*let emitter = sparkles.createEmitter();
        emitter.setPosition(tile.getCenterX(), tile.getCenterY());
        emitter.setScale(0.1);
        emitter.setSpeed(200);
        emitter.setBlendMode(Phaser.BlendModes.ADD);
        gameSettings.scene.time.delayedCall(300, function () {sparkles.destroy()});*/
        // Version 2
        let particlesConfig = {
            x: tile.getCenterX(),
            y: tile.getCenterY(),
            speed: 200,
            scale: {start: 0.1, end: 0.1},
            lifeSpan: {min: 200, max: 400},
            blendMode: "ADD",
            /*angle: {min: 180, max: 360}*/
        }
        sparkles.createEmitter(particlesConfig);
        gameSettings.scene.time.delayedCall(300, function () {sparkles.destroy()});

        // Check which item is
        if(tile.properties.item === "blueFragment"){
            gameSettings.scene.score += 5;
        }else if(tile.properties.item === "yellowFragment"){
            gameSettings.scene.score += 10;
        }

        // Show The Score
        //console.log(gameSettings.scene.score);
        gameSettings.scene.scoreText.setText("Score : " + gameSettings.scene.score + " ");

        // Remove the item
        gameSettings.scene.overlapLayer.removeTileAt(tile.x, tile.y).destroy(); // Utilité du destroy() ????
    }

    function attack(){
        if(gameSettings.player.isJumping){
            gameSettings.enemies.zombie.himSelf.destroy();
        }else{
            killPlayer();
        }
    }

    function killPlayer(){
        if(!gameSettings.scene.gameOver){
            gameSettings.player.isAlive = false;
            gameSettings.scene.gameOver = true;
            //gameSettings.player.itSelf.setTexture("player", "adventurer_hurt");
            gameSettings.scene.add.sprite(gameSettings.scene.cameras.main.midPoint.x, gameSettings.scene.cameras.main.midPoint.y, "panel").setScale(3,1.5);
            let restartButton = gameSettings.scene.add.sprite(gameSettings.scene.cameras.main.midPoint.x, gameSettings.scene.cameras.main.midPoint.y+50, "vBoxButton").setInteractive();
            restartButton.on("pointerup", function(){
                gameSettings.scene.scene.restart();
            });
            gameSettings.scene.scoreText = gameSettings.scene.add.text(gameSettings.scene.cameras.main.midPoint.x-80, gameSettings.scene.cameras.main.midPoint.y-50, "Game Over\nRecommencer ?", {
                fontSize: "32px",
                color : "#FFFFFF",
                fontFamily: 'Alex Brush'
            });
        }
    }

    function levelEnd(player, tile){
        if(player.x > gameSettings.scene.end.x - 2 && player.x < gameSettings.scene.end.x +2){
            if(!gameSettings.scene.gameOver){
                gameSettings.player.isAlive = false;
                gameSettings.scene.gameOver = true;
                gameSettings.scene.add.sprite(gameSettings.scene.cameras.main.midPoint.x, gameSettings.scene.cameras.main.midPoint.y, "panel").setScale(3,1.5);
                let restartButton = gameSettings.scene.add.sprite(gameSettings.scene.cameras.main.midPoint.x+80, gameSettings.scene.cameras.main.midPoint.y+40, "vBoxButton").setInteractive();
                restartButton.on("pointerup", function(){
                    gameSettings.scene.scene.restart();
                });
                gameSettings.scene.scoreText = gameSettings.scene.add.text(gameSettings.scene.cameras.main.midPoint.x-110, gameSettings.scene.cameras.main.midPoint.y-50, "Tu as gagné\nTon score est de : " + gameSettings.scene.score + " \nRecommencer ?", {
                    fontSize: "32px",
                    color : "#FFFFFF",
                    fontFamily: 'Alex Brush'
                });
            }
        }
    }
}

const singleton = () => {
    if(!isAlreadyRun) Game();
}

export default singleton;