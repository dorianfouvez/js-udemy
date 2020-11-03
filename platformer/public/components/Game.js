// Constance PATH
const PATH_IMAGES = "../images/";
const PATH_IMAGES_BACKGROUNDS = PATH_IMAGES + "backgrounds/";
const PATH_IMAGES_BUTTONS = PATH_IMAGES + "buttons/";
const PATH_IMAGES_ENEMIES = PATH_IMAGES + "enemies/";
const PATH_IMAGES_PLATEFORMS = PATH_IMAGES + "plateforms/";
const PATH_IMAGES_PLAYERS = PATH_IMAGES + "players/";
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
    //Buttons
    let buttonDown;
    let buttonUp;
    let clickButtonDown = false;
    let clickButtonUp = false;
    let cursor;
    let Vkey;
    let isLeftDown = false;
    let isRightDown = false;
    let isKickDown = false;
    // Enemies
    let ladyBug;
    //Sounds
    let isReadyToKick = true;

    function preload(){
        // Images

        // Player
        this.load.image("player", PATH_IMAGES_PLAYERS+"player_stand.png");
        this.load.image("player_kick", PATH_IMAGES_PLAYERS+"player_kick.png");
        this.load.image("player_walk1", PATH_IMAGES_PLAYERS+"player_walk1.png");
        this.load.image("player_walk2", PATH_IMAGES_PLAYERS+"player_walk2.png");
        // Buttons
        this.load.image("down", PATH_IMAGES_BUTTONS+"yellow_sliderDown.png");
        this.load.image("up", PATH_IMAGES_BUTTONS+"yellow_sliderUp.png");
        // Grounds
        this.load.image("grassGround", PATH_IMAGES_PLATEFORMS+"groundGrass.png");
        // Background
        this.load.image("grass", PATH_IMAGES_BACKGROUNDS+"backgroundColorGrass.png");
        // Enemies
        this.load.image("ladyBug", PATH_IMAGES_ENEMIES+"ladyBug.png");
        // SpriteSheets
        this.load.spritesheet("zombieSPS", PATH_IMAGES_ENEMIES+"zombie_tilesheet.png", {frameWidth: 80, frameHeight: 110});

        // Sounds
        this.load.audio("kick", PATH_SOUNDS_PLAYERS+"kick.ogg");
        this.load.audio("ready", PATH_SOUNDS_MISCS + "ready.ogg");
    }

    function create(){
        
        this.sound.play("ready");
        let positionCameraCenterX = this.cameras.main.centerX;
        let positionCameraCenterY = this.cameras.main.centerY;
        this.add.sprite(positionCameraCenterX,positionCameraCenterY,"grass");
        player = this.physics.add.sprite(positionCameraCenterX,positionCameraCenterY,"player");

        let platforms = this.physics.add.staticGroup(); // créer un group de plateformes

        let ground1 = this.add.sprite(115, 550, "grassGround"); // créer un sol traversable
        let ground2 = this.add.sprite(positionCameraCenterX, 550, "grassGround");

        platforms.add(ground1); // ajoute un sol au groupe de plateforme
        platforms.add(ground2);

        this.physics.add.collider(platforms, player); // créer une collistion et donc l'infranchisabilitée des platefromes par le player

        ladyBug = this.add.sprite(500,positionCameraCenterY+38,"ladyBug");
        ladyBug.flipX = true;
        let tween = this.tweens.add({ // creation de l'animation pour un enemi
            targets: ladyBug,
            x : 700,
            ease : "Linear", // Linear / Cubic / Elastic / Bounce / Back
            duration : 3000, // Higher value = slower animation
            yoyo: true,
            repeat : -1,
            onStart : function (){},
            onComplete : function (){},
            onYoyo : function (){ladyBug.flipX = false;},
            onRepeat : function (){ladyBug.flipX = true;},
        });

        this.add.text(positionCameraCenterX-100, 30, "DisneyLand", {
            fontSize: "52px",
            color : "#FF0000",
            fontFamily: 'Alex Brush'
        });

        buttonDown = this.add.sprite(50,50,"down").setInteractive(); // setInteractive permet une interaction sur le sprite à définir par après
        buttonUp = this.add.sprite(100,50,"up").setInteractive();
        playerSizeModification();
    
        cursor = this.input.keyboard.createCursorKeys(); // permet de récupérer les touches directionnelles

        Vkey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.V); // Ajout un AddEventListener sur une touche mais ne lance aucune callback. (il faut faire des vérifications dans le update)

        generateAnimations();

        this.add.sprite(300,300).play("zombieWalk");
    }

    function update(time, delta){

        playerSizeModificationUpdate();

        playerMovementsUpdate();
    }

    // Own function
    function playerSizeModification(){

        buttonDown.on("pointerdown",function(){ // agit comme un addEventListener et défini une action sur le sprite
            console.log("pointer down");
            clickButtonDown = true;
        }); 
        buttonDown.on("pointerup",function(){
            console.log("pointer up");
            clickButtonDown = false;
        });
        buttonDown.on("pointerout",function(){
            console.log("pointer out");
            clickButtonDown = false;
        });
        buttonUp.on("pointerdown",function(){ // agit comme un addEventListener et défini une action sur le sprite
            console.log("pointer down");
            clickButtonUp = true;
        }); 
        buttonUp.on("pointerup",function(){
            console.log("pointer up");
            clickButtonUp = false;
        });
        buttonUp.on("pointerout",function(){
            console.log("pointer out");
            clickButtonUp = false;
        });
    }

    function generateAnimations(){
        game.anims.create({/* Creation de l'animation */
            key : "playerWalk",
            frames : [
                {key : "player_walk1"},
                {key : "player_walk2"},
            ],
            frameRate : 8,
            repeat : -1
        });

        game.anims.create({
            key: "zombieWalk",
            frames: game.anims.generateFrameNumbers("zombieSPS", {start:9,end:10}),
            frameRate: 8,
            repeat: -1
        });

        game.anims.create({
            key: "zombieStand",
            frames: [
                {key :"zombieSPS", frame: 23}
            ],
            frameRate: 8,
            repeat: -1
        });

        game.anims.create({
            key: "zombieIdle",
            frames: [
                {key: "zombieSPS", frame: 0},
                {key: "zombieSPS", frame: 23}
            ],
            frameRate: 8,
            repeat: -1
        });
    }

    function playerSizeModificationUpdate(){
        // Gestion des buttons modificateurs du peronnage
        if(clickButtonUp){
            player.setScale(player.scaleX + 0.1, player.scaleY + 0.1);
        }else if(clickButtonDown){
            player.setScale(player.scaleX - 0.1, player.scaleY - 0.1); // !!! ATTENTION une fois scale a 0, cela grandit en inversant les X et Y
        }
    }

    function playerMovementsUpdate(){
        // Gestion des touches pour une animation/déplacements
        // Touches directionnelles
        if(cursor.left.isDown){
            isLeftDown = true;
        }else if(cursor.right.isDown){
            isRightDown = true;
        }
        /*if(cursor.up.isDown){ // Rajouter un else devant ce if pour éviter les déplacements en diagonale
            player.y -= 5;
        }else if(cursor.down.isDown){
            player.y += 5;
        }*/
        if(cursor.left.isUp){
            isLeftDown = false;
        }
        if(cursor.right.isUp){
            isRightDown = false;
        }
        // Touche mélée
        if(Vkey.isDown){
            isKickDown = true;
        }else if(Vkey.isUp){
            isKickDown = false;
            isReadyToKick = true;
        }

        // Gestion des animations
        if(isKickDown){
            if(isReadyToKick){
                game.sound.play("kick");
                isReadyToKick = false;
            }
            player.setTexture("player_kick");
        }else if(isLeftDown){
            player.x -= 5;
            player.anims.play("playerWalk",true);
            player.setFlip(true,false);
        }else if(isRightDown){
            player.x += 5;
            player.anims.play("playerWalk",true);
            player.setFlip(false,false);
        }else{
            player.setTexture("player");
        }
    }
}

const singleton = () => {
    if(!isAlreadyRun) Game();
}

export default singleton;