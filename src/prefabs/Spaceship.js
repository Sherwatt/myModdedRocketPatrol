class Spaceship extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, pointValue) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);   //adds to existing scene
        this.points = pointValue;   //stores the point value
    }

    update() {
        this.moveSpeed = game.settings.spaceshipSpeed;  //pixels per frame
        //move spaceship left
        this.x -= this.moveSpeed;
        //wrap around
        if(this.x <= 0 - this.width) {
            this.reset();
        }
    }

    //spaceship reset
    reset() {
        this.x = game.config.width;
    }
}