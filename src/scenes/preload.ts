import Phaser from 'phaser';

export class PreloadScene extends Phaser.Scene {
    constructor() {
        super({ key: 'preload' });
    }

    preload() {
        // this.load.image('bg', 'assets/bg.jpg');
        this.load.image('bg', 'assets/bg2.jpg');
        this.load.bitmapFont('yellowFont', 'assets/fonts/yellowfont/yellowfont.png', 'assets/fonts/yellowfont/yellowfont.fnt');
        this.load.image('bubble', 'assets/bubble.png');
        this.load.image('play_button', 'assets/play_button.png');
        this.load.image('button', 'assets/button.png');
        this.load.image('progress_bar', 'assets/progress_bar.png');
        this.load.image('progress_tile', 'assets/progress_tile.png');
        this.load.image('heart', 'assets/heart.png');

        this.load.audio('puzzle', 'assets/sounds/puzzle.mp3');
        this.load.audio('bg_music', 'assets/sounds/bg.mp3');
        this.load.audio('button_click_enter', 'assets/sounds/button_click_enter.wav');
        this.load.audio('wrong_sfx', 'assets/sounds/wrong.wav');
        this.load.audio('correct_sfx', 'assets/sounds/correct.wav');
        this.load.audio('bubbles_rising_sfx', 'assets/sounds/bubbles_rising.mp3');
        this.load.audio('pop_sfx', 'assets/sounds/pop.mp3');
    }

    create() {
        this.scene.start('start');
    }
}
