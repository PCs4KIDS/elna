import Phaser from 'phaser';
import Bubble from '../objects/bubble';
import { OPERATIONS } from '../operations';

export class MainScene extends Phaser.Scene {
    bubbleCount = 2;
    level = 1;
    bubbles: Array<any> = [];
    maxRespawnTries = 3;
    lives = 3;
    score = 0;

    mode = OPERATIONS.NONE;

    bg;
    soundtrack;
    scoreCard;
    livesLeft;

    constructor() {
        super({ key: 'main' });
    }

    preload() {}

    create(data) {
        this.mode = data.mode;

        this.bg = this.add.tileSprite(0, 0, +this.sys.game.config.width, +this.sys.game.config.height, 'bg');
        this.bg.setOrigin(0, 0);

        this.soundtrack = this.sound.add('puzzle', { loop: true, volume: .1 });
        
        this.soundtrack.play();

        this.scoreCard = this.add.bitmapText(10, 10, 'yellowFont', `Score: ${this.score}`, 40);

        this.livesLeft = this.add.bitmapText(10, 60, 'yellowFont', `Lives Left: ${this.lives}`, 40);

        // this.txtStartGame = this.add.bitmapText(this.sys.game.config.width / 2, this.sys.game.config.height / 2, 'yellowFont', 'Enla', 60);
        // Center the text, to a zone whose center is positioned at the center of the game, and it's dimension is the same as the game
        // Phaser.Display.Align.In.Center(this.txtStartGame, this.add.zone(this.sys.game.config.width / 2, this.sys.game.config.height / 2, this.sys.game.config.width, this.sys.game.config.height));

        this.startLevel();

        // this.input.keyboard.on('keyup_D', e => console.log('Pressed D.'));

        // this.key_A = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    }

    update() {
        // if (this.key_A.isDown) {
        //     console.log('A is down.');
        // }
    }

    startLevel() {
        // Clean out all bubble objects
        this.bubbles.forEach(bubble => {
            if (bubble) {
                bubble.object.destroy()
            }
        });

        // Calculate the number of bubbles
        const bubbleCount = Math.floor(this.bubbleCount + (this.level * 0.1));

        this.bubbles = [];

        for (let i = 0; i < bubbleCount; i++) {
            let remainingTries = this.maxRespawnTries;
            let curBubble;
            do {
                // If the current bubble was already created in a previous iteration, destroy it and create it again
                if (curBubble) {
                    curBubble.object.destroy();
                }

                const value = Phaser.Math.Between(1 + (this.level * 10), 100 + (this.level * 15));

                curBubble = {
                    object: new Bubble({
                        value,
                        onClick: data => this.clickedBubble(data),
                        level: this.level,
                        mode: this.mode
                    }, this),
                    value
                };

            } while(this.isBubbleInstersecting(curBubble) && remainingTries--);
            this.bubbles = [ ...this.bubbles, curBubble ];
        }
        this.cameras.main.resetFX();
    }

    isBubbleInstersecting(curBubble) {
        return this.bubbles.some(bubble => {
            if (
                curBubble.object.x < bubble.object.x + bubble.object.width &&
                curBubble.object.x + curBubble.object.width > bubble.object.x &&
                curBubble.object.y < bubble.object.container.y + bubble.object.height &&
                curBubble.object.y + curBubble.object.height > bubble.object.container.y
            ) {
                console.log('intersect!', curBubble, bubble);
                return true;
            }
            return false;
        });
    }

    clickedBubble(bubbleValue) {
        const bubbleMax = this.bubbles.reduce((acc, cur) => Math.max(acc, cur.value), 0);
        if (bubbleValue >= bubbleMax) {
            console.log('Winner.');
            this.level++;
            this.updateScore(this.score + 10);
            this.showWin();
        } else {
            console.log('Loser!!!');
            this.updateLives(this.lives - 1);
            this.showLoss();
        }

        this.time.delayedCall(500, () => {
            this.startLevel();
        }, [], this);
    }

    showWin() {
        const winText = this.add.bitmapText(+this.sys.game.config.width / 2, +this.sys.game.config.height / 2, 'yellowFont', 'Score!!', 60);
        winText.setOrigin(0.5);
        winText.setScale(0);
        // Center the text, to a zone whose center is positioned at the center of the game, and it's dimension is the same as the game
        Phaser.Display.Align.In.Center(winText, this.add.zone(+this.sys.game.config.width / 2, +this.sys.game.config.height / 2, +this.sys.game.config.width, +this.sys.game.config.height));

        this.tweens.add({
            targets: winText,
            scaleX: 2,
            scaleY: 2,
            ease: 'Sine.easeInOut',
            duration: 300,
            repeat: 1,
            yoyo: true,
            onComplete: () => winText.destroy()
        });
        // this.cameras.main.flash(300);
    }

    showLoss() {
        const lossText = this.add.bitmapText(+this.sys.game.config.width / 2, +this.sys.game.config.height / 2, 'yellowFont', 'Wrong!', 60);
        lossText.setOrigin(0.5);
        lossText.setScale(0);
        // Center the text, to a zone whose center is positioned at the center of the game, and it's dimension is the same as the game
        Phaser.Display.Align.In.Center(lossText, this.add.zone(+this.sys.game.config.width / 2, +this.sys.game.config.height / 2, +this.sys.game.config.width, +this.sys.game.config.height));

        this.tweens.add({
            targets: lossText,
            scaleX: 2,
            scaleY: 2,
            ease: 'Sine.easeInOut',
            duration: 300,
            onComplete: () => lossText.destroy()
        });
        this.cameras.main.shake(300);
    }

    updateScore(score) {
        this.score = score;
        this.scoreCard.setText(`Score: ${this.score}`);
    }
    updateLives(lives) {
        this.lives = lives;
        this.livesLeft.setText(`Lives Left: ${this.lives}`);
    }
}
