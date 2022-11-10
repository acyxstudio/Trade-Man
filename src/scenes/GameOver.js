import Phaser from '../lib/phaser.js'

export default class GameOver extends Phaser.Scene{

    constructor(){
        super('game-over');
    }

    create(){
        const width = this.scale.width;
        const height = this.scale.height;

        this.add.text(width * 0.5, height * 0.5, 'Game Over', { color: '#FFF', fontSize: 48  , fontFamily:'Arial'}).setOrigin(0.5);
        this.add.text(width * 0.5, height * 0.6, 'Press SPACE or TAP to continue', { color: '#FFF', fontSize: 32 , fontFamily:'Arial'}).setOrigin(0.5);
        /**
        * Restart game pressing space
        */
          this.input.keyboard.once('keydown-SPACE', () => {
            this.scene.start('splash-scene');
        });
    }
}