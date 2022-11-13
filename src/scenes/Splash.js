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
        const width = this.scale.width;
        const height = this.scale.height;
        /** Add background and keep it from scroll down with the camera */
        this.add.image(360, 640, 'background_start').setScrollFactor(0,0);
        this.add.text(width * 0.5, height * 0.95, 'Press SPACE or TAP to continue', { color: '#444', fontSize: 32 , fontFamily:'Arial'}).setOrigin(0.5);
        /**
        * Start the game by pressing space
        */
        this.input.keyboard.once('keydown-SPACE', () => {
            this.scene.start('playScene');
        });
    }
    
    update() {
        if(this.input.activePointer.isDown ){
            this.scene.start('playScene');
        }   
    }
    
}