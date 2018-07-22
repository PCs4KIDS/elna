import Phaser from 'phaser';
import { config } from '../config';

export class Button {
    defaults = {
        text: 'Hello World!',
        x: 0,
        y: 0,
        onClick: val => {}
    };
    opts = { ...this.defaults };
    scene: Phaser.Scene;
    container: Phaser.GameObjects.Container;
    button: Phaser.GameObjects.Sprite;
    text: Phaser.GameObjects.Text;

    fx: Phaser.Sound.BaseSound;

    constructor(opts, scene: Phaser.Scene) {
        this.scene = scene;

        this.opts = { ...this.defaults, ...opts };

        this.container = this.scene.add.container(this.opts.x, this.opts.y);
        this.button = this.scene.add.sprite(0, 0, 'button');
        this.button.setInteractive();
        this.button.setOrigin(.5);
        this.button.setDisplaySize(75, 75);
        this.text = this.scene.add.text(0, 0, this.opts.text.toUpperCase(), { fontSize: 30, fontFamily: 'Arial', color: '#fff' });
        this.text.setOrigin(.5);

        this.fx = this.scene.sound.add('button_click_enter', { volume: config.volume });

        this.button.setDisplaySize(this.text.width + 60, this.button.displayHeight);

        this.container.add([this.button, this.text]);

        this.initEvents();
        // TODO: Handle on mouse down animation
    }

    initEvents() {
        this.button.on('pointerdown', () => console.log('down:button'));
        this.button.on('pointerup', () => {
            console.log('up');
            this.fx.play();
            this.opts.onClick(this);
        });
    }
}
