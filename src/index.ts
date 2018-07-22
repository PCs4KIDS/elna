import Phaser from 'phaser';
import { phaserConfig } from './config';

let game = new Phaser.Game(phaserConfig);

window.onresize = function () {
    game.renderer.resize(window.innerWidth, window.innerHeight);
    game.events.emit('resize');
}