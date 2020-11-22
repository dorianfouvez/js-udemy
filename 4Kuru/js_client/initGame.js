var config = {
    type : Phaser.AUTO,
    backgroundColor : "#ccccff",
    width : 1200,
    height : 600,
    scene : {
        preload : preload,
        create : create,
        update : update
    },
    physics : {
        default : "arcade",
        arcade : {
            debug : false,
            gravity : {y : 0}
        }
    }
}

const game = new Phaser.Game(config);