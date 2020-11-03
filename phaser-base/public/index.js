"use strict";
import {setPolygon, playPolygon} from "./javascripts/animation.js";
//import {setDateTime} from "./utils/layout.js";
import {Router} from "./Components/Router.js";
import Navbar from "./Components/Navbar.js";

//setDateTime();
setPolygon();
playPolygon();

Navbar();

Router();



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

function preload(){
    //console.log("preload");
    // Player
    this.load.image("player", "./images/player_stand.png");
    this.load.image("player_kick", "./images/player_kick.png");
    this.load.image("player_walk1", "./images/player_walk1.png");
    this.load.image("player_walk2", "./images/player_walk2.png");
    // Buttons
    this.load.image("down", "./images/yellow_sliderDown.png");
    this.load.image("up", "./images/yellow_sliderUp.png");
    // Background
    this.load.image("grass", "./images/backgroundColorGrass.png");
    
}

function create(){
    //console.log("create");
    let positionCameraCenterX = this.cameras.main.centerX;
    let positionCameraCenterY = this.cameras.main.centerY;
    this.add.sprite(positionCameraCenterX,positionCameraCenterY,"grass");
    player = this.add.sprite(positionCameraCenterX,positionCameraCenterY,"player");
    //player.setScale(2); // permet de doubler la taille x et y du sprite player
    //player.setScale(2,1); // double la largeur (x) et x1 la hauteur (y)
    //player.setAngle(45); // Tourne le sprite de 45° vers la droite
    //player.setOrigin(0,0); // change le point d'origine du sprite
    //player.setFlip(true,false); // inverse sur l'axe X
    //player.setFlip(false,true); // inverse sur l'axe Y
    //player.setFlip(true,true); // inverse sur l'axe X et Y

    buttonDown = this.add.sprite(50,50,"down").setInteractive(); // setInteractive permet une interaction sur le sprite à définir par après
    buttonUp = this.add.sprite(100,50,"up").setInteractive();
    playerSizeModification();
    
    cursor = this.input.keyboard.createCursorKeys(); // permet de récupérer les touches directionnelles

    //this.input.keyboard.on("keydown_B", function(){console.log("coucou")}); // agit comme un addEventListener avec callback

    Vkey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.V); // Ajout un AddEventListener sur une touche mais ne lance aucune callback. (il faut faire des vérifications dans le update)

    this.anims.create({/* Creation de l'animation */
        key : "playerWalk",
        frames : [
            {key : "player_walk1"},
            {key : "player_walk2"},
        ],
        frameRate : 8,
        repeat : -1
    });
    /*this.add.sprite(150,150,"player").play("playerWalk"); // placement d'un autre sprite avec une animation dessus
    player.anims.play("playerWalk");*/
}

function update(time, delta){
    //console.log("update"); //appel infini
    //player.setAngle(player.angle+1); // va tourner de 1° l'image à chaque update authour de son point d'origine
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
    }

    // Gestion des animations
    if(isKickDown){
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