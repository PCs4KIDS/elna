import Phaser from 'phaser';
import { config } from './config';

let game = new Phaser.Game(config);

window.onresize = function () {
    game.renderer.resize(window.innerWidth, window.innerHeight);
    game.events.emit('resize');
}