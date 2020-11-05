var jeu = {
    scene : null,
    world : world,
    player : player,
    cursor : null
}


function preload(){
    jeu.scene = this;

    jeu.scene.load.image("terrain","/images/terrain.png");
    jeu.scene.load.image("tilesPerso","/images/tilesPerso.png");
    jeu.scene.load.tilemapTiledJSON("map","/json/KuruCarteLevel1.json");

}
function create(){
    jeu.world.initialiserWorld();
}
function update(time, delta){
    ajusterTailleEcran();
}

function ajusterTailleEcran(){
    var canvas = document.querySelector("canvas");

    var fenetreWidth = window.innerWidth;
    var fenetreHeight = window.innerHeight;
    var fenetreRatio = fenetreWidth / fenetreHeight;

    var jeuRatio = config.width/config.height;

    if(fenetreRatio < jeuRatio){
        canvas.style.width = fenetreWidth + "px";
        canvas.style.height = (fenetreWidth/jeuRatio) +"px";
    } else {
        canvas.style.width = (fenetreHeight * jeuRatio) + "px";
        canvas.style.height = fenetreHeight + "px";
    }
}
