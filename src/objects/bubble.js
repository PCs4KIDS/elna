import Phaser from 'phaser';
import constants from '../constants';

export default class {
    constructor(opts, scene) {
        this.defaults = {
            bubbleSize: 150,
            onClick: () => {},
            value: 0
        };

        this.opts = Object.assign({}, this.defaults, opts);

        // width, height, radius
        this.bubbleShape = new Phaser.Geom.Circle(this.opts.bubbleSize / 2, this.opts.bubbleSize / 2, this.opts.bubbleSize / 2);
        this.container = scene.add.container(
            Phaser.Math.Between(this.opts.bubbleSize, scene.sys.game.config.width - this.opts.bubbleSize),
            Phaser.Math.Between(this.opts.bubbleSize, scene.sys.game.config.height - this.opts.bubbleSize)
        ).setInteractive(this.bubbleShape, Phaser.Geom.Circle.Contains);
        this.bubble = scene.add.sprite(this.opts.bubbleSize / 2, this.opts.bubbleSize / 2, 'bubble');
        this.bubble.setDisplaySize(this.opts.bubbleSize, this.opts.bubbleSize);
        this.bubble.setOrigin(0.5);

        // Using + operator
        const num1 = Phaser.Math.Between(0, this.opts.value);
        const num2 = this.opts.value - num1;

        this.bubbleText = scene.add.bitmapText(0, 0, 'yellowFont', `${num1} + ${num2}`, 50);
        this.bubbleText.setOrigin(0.5);

        Phaser.Display.Align.In.Center(this.bubbleText, this.bubble);
        this.container.add([this.bubble, this.bubbleText]);

        this.setDimensions();
        this.events();
    }

    setDimensions() {
        this.x = this.container.x;
        this.y = this.container.y;
        this.width = this.bubble.displayWidth;
        this.height = this.bubble.displayHeight;
    }

    events() {
        this.container.on('pointerdown', () => {
            this.container.setScale(.9);
            // console.log('Clicked bubble');
            this.opts.onClick(this.opts.value);
        });
        this.container.on('pointerup', () => {
            this.container.setScale(1);
        });
        this.container.on('pointerout', () => {
            this.container.setScale(1);
        });
    }
}
