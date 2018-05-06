import Phaser from 'phaser';

export class PreloadScene extends Phaser.Scene {
    constructor() {
        super({ key: 'preload' });
    }

    preload() {
        this.load.image('bg', 'assets/bg.jpg');
        this.load.bitmapFont('yellowFont', 'assets/fonts/yellowfont/yellowfont.png', 'assets/fonts/yellowfont/yellowfont.fnt');
        this.load.image('bubble', 'assets/bubble.png');

        this.load.audio('puzzle', 'assets/sounds/puzzle.mp3');
    }

    create() {
        this.scene.start('main');
    }
}
