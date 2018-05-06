import Phaser from 'phaser';
import Bubble from '../objects/bubble';

export class StartScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'start'
        });
    }

    preload() {}

    create() {
        this.bg = this.add.tileSprite(0, 0, this.sys.game.config.width, this.sys.game.config.height, 'bg');
        this.bg.setOrigin(0, 0);

        this.soundtrack = this.sound.add('puzzle', {
            loop: true,
            volume: .1
        });

        this.soundtrack.play();

        const gameSizeZone = this.add.zone(this.sys.game.config.width / 2, this.sys.game.config.height / 2, this.sys.game.config.width, this.sys.game.config.height);
        this.gameTitle = this.add.bitmapText(this.sys.game.config.width / 2, this.sys.game.config.height / 2, 'yellowFont', 'ENLA', 100);
        // Center the text, to a zone whose center is positioned at the center of the game, and it's dimension is the same as the game
        Phaser.Display.Align.In.Center(this.gameTitle, gameSizeZone);

        this.playButton = this.add.sprite(this.sys.game.config.width / 2, this.sys.game.config.height / 2, 'play_button').setInteractive();
        this.playButton.setDisplaySize(100, 100);
        this.playButton.y = this.gameTitle.y + this.gameTitle.height + 50 + 50;

        this.initEvents();
    }

    initEvents() {
        this.playButton.on('pointerdown', () => {
            this.scene.start('main');
        });
    }

    update() {}
}
