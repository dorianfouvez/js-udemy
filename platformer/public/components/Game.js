// Constance PATH
const PATH_IMAGES = "../images/";
const PATH_IMAGES_BACKGROUNDS = PATH_IMAGES + "backgrounds/";
const PATH_IMAGES_BUTTONS = PATH_IMAGES + "buttons/";
const PATH_IMAGES_ENEMIES = PATH_IMAGES + "enemies/";
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
                gravity: {y: 500}
            }
        }
    }

    const game = new Phaser.Game(config);

    // Buttons
    let controls;

    let gameSettings = {
        scene: null,
        world: null,
        player: null,
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



        // Sounds
        //this.load.audio("kick", PATH_SOUNDS_PLAYERS+"kick.ogg");
    }

    function create(){
        initWorld();

        initPlayer();

        generateAnimations();
        //gameSettings.player.play("playerWalk");

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
        playerMovementsUpdate();
    }



    // Own function
    function initWorld(){
        // Image of Map
        gameSettings.scene.tilemap = gameSettings.scene.make.tilemap({key: "map"});
        gameSettings.scene.tileset = gameSettings.scene.tilemap.addTilesetImage("tilesheet","tiles");

        // Set all levels of the map
        gameSettings.scene.downLayer = gameSettings.scene.tilemap.createStaticLayer("bottom",gameSettings.scene.tileset,0,0);
        gameSettings.scene.worldLayer = gameSettings.scene.tilemap.createStaticLayer("world",gameSettings.scene.tileset,0,0);
        gameSettings.scene.topLayer = gameSettings.scene.tilemap.createStaticLayer("top",gameSettings.scene.tileset,0,0);

        // Set Borders of the map
        gameSettings.scene.physics.world.setBounds(0,0,gameSettings.scene.tilemap.widthInPixels,gameSettings.scene.tilemap.heigthInPixels);
    }

    function initPlayer(){
        gameSettings.player = gameSettings.scene.physics.add.sprite(200,200,"player","adventurer_stand");
        gameSettings.player.setCollideWorldBounds(true);
    }

    function generateAnimations(){
        gameSettings.scene.anims.create({
            key : "playerWalk",
            frames : gameSettings.scene.anims.generateFrameNames("player", {prefix: "adventurer_walk", start:1, end: 2}),
            frameRate : 5,
            repeat : -1
        });
    }

    function manageColliders(){
        // Colliders
        gameSettings.scene.worldLayer.setCollisionByProperty({Collides: true});
        gameSettings.scene.physics.add.collider(gameSettings.player, gameSettings.scene.worldLayer);
    }

    function manageCamera(){
        gameSettings.scene.cameras.main.startFollow(gameSettings.player);
        gameSettings.scene.cameras.main.setBounds(0,0,gameSettings.scene.tilemap.widthInPixels,gameSettings.scene.tilemap.heigthInPixels);
    }

    function playerMovementsUpdate(){
        if(gameSettings.cursor.left.isDown) gameSettings.player.setVelocityX(-200);
        else if(gameSettings.cursor.right.isDown) gameSettings.player.setVelocityX(200);
        else /*if(gameSettings.cursor.left.isUp)*/ gameSettings.player.setVelocityX(0);
    }
}

const singleton = () => {
    if(!isAlreadyRun) Game();
}

export default singleton;