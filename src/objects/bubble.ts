import Phaser from 'phaser';
import { OPERATIONS } from '../operations';
import { config } from '../config';


export default class {
    defaults = {
        bubbleSize: 150,
        onClick: val => {},
        value: 0,
        level: 1,
        mode: OPERATIONS.NONE
    };
    opts = { ...this.defaults };
    scene: Phaser.Scene;

    bubbleShape: Phaser.Geom.Circle;
    container: Phaser.GameObjects.Container;
    bubble: Phaser.GameObjects.Sprite;
    bubbleText: Phaser.GameObjects.BitmapText;

    popSfx: Phaser.Sound.BaseSound;

    operator = OPERATIONS.ADD;

    x;
    y;
    width;
    height;

    constructor(opts, scene: Phaser.Scene) {

        this.opts = { ...this.defaults, ...opts };

        this.scene = scene;

        this.popSfx = scene.sound.add('pop_sfx', { volume: config.volume });

        // width, height, radius
        this.bubbleShape = new Phaser.Geom.Circle(0, 0, this.opts.bubbleSize / 2);
        this.container = scene.add.container(
            Phaser.Math.Between(this.opts.bubbleSize, +scene.sys.game.config.width - this.opts.bubbleSize),
            Phaser.Math.Between(this.opts.bubbleSize, +scene.sys.game.config.height - this.opts.bubbleSize)
        );
        this.container.setInteractive(this.bubbleShape, Phaser.Geom.Circle.Contains);

        // Position the center of the bubble at the XY origin of the container
        this.bubble = scene.add.sprite(0, 0, 'bubble');
        this.bubble.setDisplaySize(this.opts.bubbleSize, this.opts.bubbleSize);
        this.bubble.setOrigin(0.5);

        // Animate the bubble
        this.scene.tweens.add({
            targets: this.container,
            y: `-=${Phaser.Math.Between(30, 50)}`,
            duration: Phaser.Math.Between(1000, 3500),
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: 2
        });

        if (this.opts.mode) {
            this.operator = this.opts.mode;
        } else {
            // Choose an operator based on the level
            this.operator = Math.round(Phaser.Math.Between(1, Math.max(this.opts.level * .1, 1)));
            // The operator shouldn't be more than INFINITE
            if (this.operator >= OPERATIONS.INFINITE) {
                this.operator = this.operator % OPERATIONS.INFINITE;
            }
        }
        console.log('operator', this.operator);

        let bubbleText = '';
        switch (this.operator) {
            case OPERATIONS.ADD: {
                // Using + operator
                let num1 = Phaser.Math.Between(0, this.opts.value);
                let num2 = this.opts.value - num1;
                bubbleText = `${num1} + ${num2}`;
                break;
            }
            case OPERATIONS.SUBTRACT: {
                // Using - operator
                let num1 = Phaser.Math.Between(this.opts.value, this.opts.value * this.opts.level * .6);
                let num2 = num1 - this.opts.value;
                bubbleText = `${num1} - ${num2}`;
                break;
            }
            case OPERATIONS.MULTIPLY: {
                let num1 = Phaser.Math.Between(0, this.opts.value);
                let num2 = this.opts.value / num1;
                bubbleText = `${num1} * ${num2.toFixed(0)}`;
                break;
            }
            case OPERATIONS.DIVIDE: {
                let num1 = Phaser.Math.Between(this.opts.value, this.opts.value * this.opts.level * .6);
                let num2 = num1 / this.opts.value;
                bubbleText = `${num1} / ${num2.toFixed(0)}`;
                break;
            }
            default:
                throw new Error('Unknown operation: ' + this.operator);
        }

        this.bubbleText = scene.add.bitmapText(0, 0, 'yellowFont', bubbleText, 50);
        this.bubbleText.setOrigin(0.5);

        // Phaser.Display.Align.In.Center(this.bubbleText, this.bubble);
        this.container.add([this.bubble, this.bubbleText]);

        this.setDimensions();
        this.events();
    }

    private setDimensions() {
        this.x = this.container.x;
        this.y = this.container.y;
        this.width = this.bubble.displayWidth;
        this.height = this.bubble.displayHeight;
    }

     private events() {
        this.container.on('pointerdown', () => {
            // this.container.setScale(.9);
            this.scene.tweens.add({
                targets: this.container,
                scaleX: {
                    value: 0.9,
                    duration: 100,
                    ease: 'Quad.easeInOut'
                },
                scaleY: {
                    value: 0.9,
                    duration: 100,
                    ease: 'Quad.easeInOut'
                },
            });
            // console.log('Clicked bubble');
        });
        this.container.on('pointerup', () => {
            this.popSfx.play();
            this.scene.tweens.add({
                targets: this.container,
                scaleX: {
                    value: 0,
                    duration: 100,
                    ease: 'Quad.easeInOut'
                },
                scaleY: {
                    value: 0,
                    duration: 100,
                    ease: 'Quad.easeInOut'
                },
            });
            this.opts.onClick(this.opts.value);
        });
        this.container.on('pointerout', () => {
            // this.container.setScale(1);
            this.scene.tweens.add({
                targets: this.container,
                scaleX: {
                    value: 1,
                    duration: 100,
                    ease: 'Quad.easeInOut'
                },
                scaleY: {
                    value: 1,
                    duration: 100,
                    ease: 'Quad.easeInOut'
                },
            });
        });
    }

    destroy() {
        if (this.container) {
            this.container.destroy();
        }
    }
}
