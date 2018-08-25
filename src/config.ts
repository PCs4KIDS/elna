import { gameScene } from './scenes';
import { MainScene } from './scenes/main';
import { PreloadScene } from './scenes/preload';
import { StartScene } from './scenes/start';
import { PauseScene } from './scenes/pause';

export const phaserConfig = {
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
    scene: [ PreloadScene, StartScene, MainScene, PauseScene ]
};

export const config = {
    isMute: false,
    volume: .1
};
