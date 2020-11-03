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
let player;
let clickButtonDown = false;
let clickButtonUp = false;
let cursor;
let Vkey;

function preload(){
    //console.log("preload");
    this.load.image("player", "./images/player_stand.png");
    this.load.image("player_kick", "./images/player_kick.png");
    this.load.image("down", "./images/yellow_sliderDown.png");
    this.load.image("up", "./images/yellow_sliderUp.png");
}

function create(){
    //console.log("create");
    let positionCameraCenterX = this.cameras.main.centerX;
    let positionCameraCenterY = this.cameras.main.centerY;
    player = this.add.sprite(positionCameraCenterX,positionCameraCenterY,"player");
    //player.setScale(2); // permet de doubler la taille x et y du sprite player
    //player.setScale(2,1); // double la largeur (x) et x1 la hauteur (y)
    //player.setAngle(45); // Tourne le sprite de 45° vers la droite
    //player.setOrigin(0,0); // change le point d'origine du sprite
    //player.setFlip(true,false); // inverse sur l'axe X
    //player.setFlip(false,true); // inverse sur l'axe Y
    //player.setFlip(true,true); // inverse sur l'axe X et Y
    let down = this.add.sprite(50,50,"down").setInteractive(); // setInteractive permet une interaction sur le sprite à définir par après
    let up = this.add.sprite(100,50,"up").setInteractive();

    down.on("pointerdown",function(){ // agit comme un addEventListener et défini une action sur le sprite
        console.log("pointer down");
        clickButtonDown = true;
    }); 
    down.on("pointerup",function(){
        console.log("pointer up");
        clickButtonDown = false;
    });
    down.on("pointerout",function(){
        console.log("pointer out");
        clickButtonDown = false;
    });
    up.on("pointerdown",function(){ // agit comme un addEventListener et défini une action sur le sprite
        console.log("pointer down");
        clickButtonUp = true;
    }); 
    up.on("pointerup",function(){
        console.log("pointer up");
        clickButtonUp = false;
    });
    up.on("pointerout",function(){
        console.log("pointer out");
        clickButtonUp = false;
    });
    cursor = this.input.keyboard.createCursorKeys(); // permet de récupérer les touches directionnelles

    this.input.keyboard.on("keydown_B", function(){console.log("coucou")});

    Vkey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.V);
}

function update(time, delta){
    //console.log("update"); //appel infini
    //player.setAngle(player.angle+1); // va tourner de 1° l'image à chaque update authour de son point d'origine
    if(clickButtonUp){
        player.setScale(player.scaleX + 0.1, player.scaleY + 0.1);
    }else if(clickButtonDown){
        player.setScale(player.scaleX - 0.1, player.scaleY - 0.1); // !!! ATTENTION une fois scale a 0, cela grandit en inversant les X et Y
    }

    if(cursor.left.isDown){
        player.x -= 5;
    }else if(cursor.right.isDown){
        player.x += 5;
    }
    if(cursor.up.isDown){ // Rajouter un else devant ce if pour éviter les déplacements en diagonale
        player.y -= 5;
    }else if(cursor.down.isDown){
        player.y += 5;
    }

    if(Vkey.isDown){
        player.setTexture("player_kick");
    }
    if(Vkey.isUp){
        player.setTexture("player");
    }
}