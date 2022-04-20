class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        //load images
        this.load.image('rocket', './assets/rocket.png');
        this.load.image('spaceship', './assets/spaceship.png');
        this.load.image('starfield', './assets/starfield.png');
        this.load.image('kaboom', './assets/star.png');     //made by Écrivain, found on OpenGameArt.org
        //loads spritesheet
        this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
        //load audio
        this.load.audio('sfx_select', './assets/slip_select12.wav');
        this.load.audio('sfx_explosion1', './assets/normal_boom.wav'); //all of these 4 sound effects were made by me using ChipTone
        this.load.audio('sfx_explosion2', './assets/deteriorate.wav'); 
        this.load.audio('sfx_explosion3', './assets/starburst.wav'); 
        this.load.audio('sfx_explosion4', './assets/slightly_musical.wav'); 
        this.load.audio('sfx_rocket', './assets/rocket_shot.wav');
    }

    create() {
        //place tile sprite
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0);
        this.starfield.setDepth(-2); //ensures that nothing is behind the background
        //green UI background
        this.add.rectangle(0, borderUISize + borderPadding, game .config.width, borderUISize * 2, 0x00FF00).setOrigin(0, 0);
        // white borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        //add rocket (player1)
        this.p1Rocket = new Rocket(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(0.5, 0);
        //make 3 spaceships
        this.ship01 = new Spaceship(this, game.config.width + borderUISize*6, borderUISize*4, 'spaceship', 0, 30).setOrigin(0, 0);
        this.ship02 = new Spaceship(this, game.config.width + borderUISize*3, borderUISize*5 + borderPadding*2, 'spaceship', 0, 20).setOrigin(0, 0);
        this.ship03 = new Spaceship(this, game.config.width, borderUISize*6 + borderPadding*4, 'spaceship', 0, 10).setOrigin(0, 0);
        //define keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        //configuration for animation
        this.anims.create({
            key: 'explode', //now we can call on an animation named 'explode'
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 9, first: 0}), //pretty understandable
            frameRate: 30
        });

        //initialize score
        this.p1Score = 0;

        //display the score
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, this.p1Score, scoreConfig);

        //display the time
        this.timeLeft = game.settings.gameTimer / 1000
        let timeConfig = {
            fontFamily:'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 35
        }
        this.currentTime = this.add.text(550, 53, this.timeLeft, timeConfig);
        this.timer = this.time.addEvent({delay: 1000, callback: this.displayRemainingTime, callbackScope: this, loop: true});

        //adds timer event for ship speed increase
        this.lightSpeed = this.time.addEvent({delay: 30000, callback: this.faster, callbackScope: this, loop: true}); //loops so it doesn't become too easy to keep the game going

        //GAME OVER flag
        this.gameOver = false;
        
        this.shipHit = false;
        //timer for gameplay
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => { //Phaser calls function after a delay of a set time
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or ← for Menu', scoreConfig).setOrigin(0.5);
            this.gameOver = true;
        }, null, this);
    }

    update() {
        //checks input to restart or to return to menu
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            this.scene.restart();
        }
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start('menuScene')
        }
        //while there's still time
        if(!this.gameOver) {
            this.starfield.tilePositionX -= 4;
            this.p1Rocket.update();
            this.ship01.update();  
            this.ship02.update();
            this.ship03.update();
        }
        //check collisions
        if(this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship03);
        }
        if(this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship02);
        }
        if(this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship01);
        }
    }
    checkCollision(rocket, ship) {  //Axis-Aligned Bounding Boxes checking
    if (rocket.x < ship.x + ship.width && 
        rocket.x + rocket.width > ship.x && 
        rocket.y < ship.y + ship.height &&
        rocket.height + rocket.y > ship. y) {
            return true;
        } else {
            return false;
        }
    }
    //displays the time
    displayRemainingTime() {
        if(this.shipHit) { //called if you hit the ships
            this.timeLeft += this.timeset;
            this.shipHit = false;
        }
        else if(!this.gameOver) { //stops timer from updating after game has ended, Jimmy helped me a lot here
        this.timeLeft -= 1      //this is called every second
        }
        this.currentTime.text = this.timeLeft;
    } 
    //speeds up the ships after 30 seconds
    faster() {
        game.settings.spaceshipSpeed += 1;
    }
    //for polish
    shipExplode(ship) {
        //temporarily hide ship
        ship.alpha = 0;
        //create an explosion at the ship's last position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');     //play animation
        //create particle emitter
        let part = this.add.particles('kaboom');
        let emit = part.createEmitter();
        emit.setPosition(ship.x+20, ship.y+10);
        part.setDepth(-1);
        emit.setSpeed(50);
        emit.setBlendMode(Phaser.BlendModes.ADD);
        emit.explode(70);
        boom.on('animationcomplete', () => {
            ship.reset();               //saves code by putting the reset into the larger function
            ship.alpha = 1;              //makes ship visible again
            boom.destroy();             //deletes explosion
        });
        //score changing
        this.p1Score += ship.points;
        this.scoreLeft.text = this.p1Score;
        this.timeset = (ship.points/10) * 2;
        this.shipHit = true;
        this.displayRemainingTime();
        this.clock.delay += this.timeset * 1000
        //make array for the explosion sound effects
        const good_sounds = ['sfx_explosion1', 'sfx_explosion2', 'sfx_explosion3', 'sfx_explosion4'];
        //make value for rng picker
        let sound_selector = Phaser.Math.RND;
        let sound_selection = sound_selector.pick(good_sounds);
        this.sound.play(sound_selection); //plays random explosion sound
    }
}
