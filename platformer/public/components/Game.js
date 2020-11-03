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

    // Player
    let player;
    // Buttons
    let cursors;
    let controls;

    function preload(){
        // Images

        // Map
        this.load.image("tiles", PATH_IMAGES_TILESHEETS+"tilesheet.png");
        this.load.tilemapTiledJSON("map", PATH_IMAGES_BACKGROUNDS + "PremiereCarte.json");



        // Sounds
        //this.load.audio("kick", PATH_SOUNDS_PLAYERS+"kick.ogg");
    }

    function create(){
        this.tilemap = this.make.tilemap({key: "map"});
        this.tileset = this.tilemap.addTilesetImage("tilesheet","tiles");

        this.downLayer = this.tilemap.createStaticLayer("bottom",this.tileset,0,0);
        this.worldLayer = this.tilemap.createStaticLayer("world",this.tileset,0,0);
        this.topLayer = this.tilemap.createStaticLayer("top",this.tileset,0,0);

        cursors = this.input.keyboard.createCursorKeys();

        let controlConfig = {
            camera: this.cameras.main,
            left: cursors.left,
            right: cursors.right,
            up: cursors.up,
            down: cursors.down,
            speed: 0.5
        }
        controls = new Phaser.Cameras.Controls.FixedKeyControl(controlConfig);
    }

    function update(time, delta){
        controls.update(delta);
    }

    // Own function
}

const singleton = () => {
    if(!isAlreadyRun) Game();
}

export default singleton;