let config = {  //makes our game screen
    type: Phaser.AUTO,
    width: 640,
    height: 480,
    scene: [ Menu, Play ]
}
let game = new Phaser.Game(config);

//reserve keyboard vars
let keyF, keyR, keyLEFT, keyRIGHT

//reserve mouse
let pointer

// set UI sizes
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;

//Alterations breakdown:
//Implement the speed increase that happens after 30 seconds in the original game - 5 pt
//Display the time remaining (in seconds) on the screen - 10 pt
//Implement mouse control for player movement and mouse click to fire - 20 pt
//Use Phaser's particle emitter to create a particle explosion when the rocket hits the spaceship - 20 pt
//Total (so far): 55/100