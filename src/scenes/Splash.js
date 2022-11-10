import Phaser from '../lib/phaser.js'

export default class Splash extends Phaser.Scene{

    constructor(){
        super('splash-scene');
    }

    preload()
    {
        /**
         * background Image
         */        
        this.load.image('background_start', 'assets/Background/Splash_layer1.png');
    }

    create(){
        
        /** Add background and keep it from scroll down with the camera */
        this.add.image(360, 640, 'background_start').setScrollFactor(0,0);
 
        /**
        * Restart game pressing space
        */
          this.input.keyboard.once('keydown-SPACE', () => {
            this.scene.start('playScene');
        });
    }
}