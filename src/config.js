import { gameScene } from './scenes';
import { MainScene } from './scenes/main';
import { PreloadScene } from './scenes/preload';

export const config = {
    type: Phaser.AUTO, // Let phaser determine how to render the game
    width: window.innerWidth,
    height: window.innerHeight,
    // pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 200
            },
            debug: true
        }
    },
    scene: [ PreloadScene, MainScene ]
};
