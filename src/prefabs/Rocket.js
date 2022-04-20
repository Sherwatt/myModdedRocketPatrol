//Rocket prefab
class Rocket extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        //add object to existing scene
        scene.add.existing(this);
        this.isFiring = false
        this.moveSpeed = 2 //change to 2 when done testing
        this.sfxRocket = scene.sound.add('sfx_rocket'); //adds rocket sfx
    }
    update() {
        //mouse controls
        let pointer = game.input.activePointer;
        pointer.worldX;
        pointer.isDown;
        //left or right movement
        if(!this.isFiring) {
            if(keyLEFT.isDown && this.x >= borderUISize + this.width) {
                this.x -= this.moveSpeed;
            } else if (keyRIGHT.isDown && this.x <= game.config.width - borderUISize - this.width){
                this.x += this.moveSpeed;
            } else if (pointer.worldX <= game.config.width - borderUISize - this.width && pointer.worldX >= borderUISize + this.width) {
                this.x = pointer.worldX  //works but do I need to slow it down?
            }
        }
        //fire button, 2nd part ensures sound won't play when rocket is in motion
        if(Phaser.Input.Keyboard.JustDown(keyF) && !this.isFiring || pointer.isDown && !this.isFiring) {
            this.isFiring = true;
            this.sfxRocket.play(); //play sfx
        }
        //move rocket upon firing
        if(this.isFiring && this.y >= borderUISize * 3 + borderPadding) {
            this.y -= this.moveSpeed;
        }
        //to reset upon missing
        if(this.y <= borderUISize * 3 + borderPadding) {
            this.reset();
        }
    }
    //to reset rocket in general
    reset() {
        this.isFiring = false;
        this.y = game.config.height - borderUISize - borderPadding;
    }
}