import Phaser from './lib/phaser.js';
import Game from './scenes/Game.js';
import GameOver from './scenes/GameOver.js';
import Splash from './scenes/Splash.js';

export default new Phaser.Game({
    type: Phaser.AUTO,
    width: 720,
    height: 1280,
    scene: [Splash,Game,GameOver],
    physics: {
        default: 'arcade',
        arcade: {
        gravity: {
            y: 0
            },
        debug: true
        }
    }
})