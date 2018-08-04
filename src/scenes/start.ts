import Phaser from 'phaser';
import Bubble from '../objects/bubble';
import { Button } from '../objects/button';
import { OPERATIONS } from '../operations';
import { config } from '../config';

export class StartScene extends Phaser.Scene {
    bg;
    soundtrack;
    buttonFx;
    gameTitle;
    playButton;

    playAddModeButton;
    playSubtractModeButton;
    playMultiplyModeButton;
    playDivideModeButton;

    modeButtonsContainer;

    constructor() {
        super({
            key: 'start'
        });
    }

    preload() {}

    create() {
        this.bg = this.add.sprite(0, 0, 'bg');
        this.bg.setOrigin(0, 0);
        this.bg.setDisplaySize(+this.sys.game.config.width, +this.sys.game.config.height);

        this.soundtrack = this.sound.add('puzzle', {
            loop: true,
            volume: config.volume
        });
        this.buttonFx = this.sound.add('button_click_enter', { volume: config.volume });

        this.soundtrack.play();

        const gameSizeZone = this.add.zone(+this.sys.game.config.width / 2, +this.sys.game.config.height / 2, +this.sys.game.config.width, +this.sys.game.config.height);
        this.gameTitle = this.add.bitmapText(+this.sys.game.config.width / 2, +this.sys.game.config.height / 2, 'yellowFont', 'ENLA', 100);
        // Center the text, to a zone whose center is positioned at the center of the game, and it's dimension is the same as the game
        Phaser.Display.Align.In.Center(this.gameTitle, gameSizeZone);

        // Then move the title upwards
        this.gameTitle.y = this.gameTitle.y - 150;

        this.playButton = this.add.sprite(+this.sys.game.config.width / 2, +this.sys.game.config.height / 2, 'play_button').setInteractive();
        this.playButton.setDisplaySize(100, 100);
        this.playButton.y = this.gameTitle.y + this.gameTitle.height + 50 + 50;

        this.modeButtonsContainer = this.add.container(this.playButton.x, this.playButton.y + 150);

        this.playAddModeButton = new Button({
            x: -500,
            text: 'Addition',
            onClick: () => this.startMode(OPERATIONS.ADD)
        }, this);
        this.playSubtractModeButton = new Button({
            x: -200,
            text: 'Subtraction',
            onClick: () => this.startMode(OPERATIONS.SUBTRACT)
        }, this);
        this.playMultiplyModeButton = new Button({
            x: 200,
            text: 'Multiplication',
            onClick: () => this.startMode(OPERATIONS.MULTIPLY)
        }, this);
        this.playDivideModeButton = new Button({
            x: 500,
            text: 'Division',
            onClick: () => this.startMode(OPERATIONS.DIVIDE)
        }, this);

        this.modeButtonsContainer.add([
            this.playAddModeButton.container,
            this.playSubtractModeButton.container,
            this.playMultiplyModeButton.container,
            this.playDivideModeButton.container,
        ]);

        this.initEvents();
    }

    initEvents() {
        this.playButton.on('pointerdown', () => {
            this.buttonFx.play();
            this.startMode();
        });
    }

    startMode(mode: OPERATIONS = OPERATIONS.NONE) {
        this.soundtrack.stop();
        this.scene.start('main', { mode });
    }

    update() {}
}
