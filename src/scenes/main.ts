import Phaser from 'phaser';
import Bubble from '../objects/bubble';
import { OPERATIONS } from '../operations';
import { config } from '../config';
import { Button } from '../objects/button';
import { Store } from '../store';

export class MainScene extends Phaser.Scene {
    initialState = {
        level: 1,
        lives: 3,
        score: 0,
        levelTime: 10000
    };
    bubbleCount = 2;
    bubbles: Array<any> = [];
    maxRespawnTries = 3;
    liveHearts: Phaser.GameObjects.Sprite[] = [];
    level = this.initialState.level;
    lives = this.initialState.lives;
    score = this.initialState.score;
    levelTime = this.initialState.levelTime;

    mode = OPERATIONS.NONE;

    progressBarOptions = {
        outerPadding: 10,
        height: 50
    };

    heartOptions = {
        size: 30,
        padding: 10
    };

    bg;
    soundtrack;
    bubblesSfx;
    wrongSfx;
    correctSfx;
    scoreCard;
    progressBar;
    pauseButton;
    pausePanel;

    progressTimer;

    constructor(private store: Store) {
        super({ key: 'main' });
        this.store = new Store();
    }
    
    preload() {}
    
    create(data) {
        this.mode = data.mode;
        
        this.bg = this.add.sprite(0, 0, 'bg');
        this.bg.setOrigin(0, 0);
        this.bg.setDisplaySize(+this.sys.game.config.width, +this.sys.game.config.height);
        
        this.soundtrack = this.sound.add('bg_music', { loop: true, volume: config.volume });
        this.bubblesSfx = this.sound.add('bubbles_rising_sfx', { loop: true, volume: config.volume / 2 });
        this.wrongSfx = this.sound.add('wrong_sfx', { volume: config.volume });
        this.correctSfx = this.sound.add('correct_sfx', { volume: config.volume });
        
        this.soundtrack.play();
        this.bubblesSfx.play();
        
        this.scoreCard = this.add.bitmapText(10, 10, 'yellowFont', `Score: ${this.score}`, 40);
        this.add.text(10, 60, 'Tip: Bigger = Better.');
        
        // this.progressBar = this.add.sprite(this.progressBarOptions.outerPadding, +this.sys.game.config.height - this.progressBarOptions.height - this.progressBarOptions.outerPadding, 'progress_bar');
        this.progressBar = this.add.tileSprite(this.progressBarOptions.outerPadding, +this.sys.game.config.height - this.progressBarOptions.height - this.progressBarOptions.outerPadding, 128, 128, 'progress_tile');
        this.progressBar.setOrigin(0);
        this.progressBar.setDisplaySize(0, this.progressBarOptions.height);
        
        this.pauseButton = this.add.sprite(+this.sys.game.config.width - 85, 15, 'pause_button').setInteractive();
        this.pauseButton.setDisplaySize(75, 75);
        this.pauseButton.setOrigin(0, 0);

        // this.txtStartGame = this.add.bitmapText(this.sys.game.config.width / 2, this.sys.game.config.height / 2, 'yellowFont', 'Enla', 60);
        // Center the text, to a zone whose center is positioned at the center of the game, and it's dimension is the same as the game
        // Phaser.Display.Align.In.Center(this.txtStartGame, this.add.zone(this.sys.game.config.width / 2, this.sys.game.config.height / 2, this.sys.game.config.width, this.sys.game.config.height));

        // Called before the game begins
        // NOTE: Not before each level.
        this.setInitialState();

        this.updateLives(this.lives);

        this.startLevel();
        this.initEvents();
    }

    initEvents() {
        this.pauseButton.on('pointerdown', () => {
            this.showPausePanel();
        });
    }

    update() {
        // console.log(this.progressTimer.elapsed);
        if (this.progressTimer.getProgress() !== 1) {
            const maxProgressWidth = +this.sys.game.config.width - (this.progressBarOptions.outerPadding * 2);
            this.progressBar.displayWidth = maxProgressWidth * this.progressTimer.getProgress();
        }
        // if (this.key_A.isDown) {
        //     console.log('A is down.');
        // }
    }

    setInitialState() {
        this.level = this.initialState.level;
        this.lives = this.initialState.lives;
        this.score = this.initialState.score;
        this.levelTime = this.initialState.levelTime;
    }

    startLevel() {
        // Clean out all bubble objects
        this.bubbles.forEach(bubble => {
            if (bubble) {
                bubble.object.destroy()
            }
        });

        // Calculate the number of bubbles
        const bubbleCount = Math.floor(this.bubbleCount + (this.level * 0.2));

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

        this.resetProgressTimer();
        this.progressTimer = this.time.delayedCall(this.levelTime, this.checkValue, [], this);

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
        this.checkValue(bubbleValue);
    }

    checkValue(val) {
        const bubbleMax = this.bubbles.reduce((acc, cur) => Math.max(acc, cur.value), 0);
        if (val && val >= bubbleMax) {
            console.log('Winner.');
            this.level++;
            this.updateScore(this.score + 10);
            this.showWin();
        } else {
            console.log('Loser!!!');
            this.updateLives(this.lives - 1);
            this.showLoss();
        }

        this.resetProgressTimer();

        if (this.lives > 0) {
            this.time.delayedCall(500, () => {
                this.startLevel();
            }, [], this);
        } else {
            // Game over.
            this.gameOver();
        }
    }

    showWin() {
        const winText = this.add.bitmapText(+this.sys.game.config.width / 2, +this.sys.game.config.height / 2, 'yellowFont', 'Score!!', 60);
        winText.setOrigin(0.5);
        winText.setScale(0);
        // Center the text, to a zone whose center is positioned at the center of the game, and it's dimension is the same as the game
        Phaser.Display.Align.In.Center(winText, this.add.zone(+this.sys.game.config.width / 2, +this.sys.game.config.height / 2, +this.sys.game.config.width, +this.sys.game.config.height));

        this.correctSfx.play();
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

        this.wrongSfx.play();
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

    showPausePanel() {
        // this.scene.pause('main');
        this.scene.launch('pause', { mainScene: this });
    }

    gameOver() {
        this.store.set('yourscore', this.score);
        const curHighscore: number = Number(this.store.get('highscore')) || 0;
        if (this.score > curHighscore) {
            this.store.set('highscore', this.score);
        }

        const gameOverText = this.add.bitmapText(+this.sys.game.config.width / 2, +this.sys.game.config.height / 2, 'yellowFont', 'GAME OVER.', 70);
        gameOverText.setOrigin(0.5);
        gameOverText.setScale(0);
        // Center the text, to a zone whose center is positioned at the center of the game, and it's dimension is the same as the game
        Phaser.Display.Align.In.Center(gameOverText, this.add.zone(+this.sys.game.config.width / 2, +this.sys.game.config.height / 2, +this.sys.game.config.width, +this.sys.game.config.height));

        this.tweens.add({
            targets: gameOverText,
            scaleX: 2,
            scaleY: 2,
            ease: 'Sine.easeIn',
            duration: 500,
            onComplete: () => this.cameras.main.fadeOut(1000)
        });

        this.resetProgressTimer();

        this.time.delayedCall(2000, () => {
            this.backToStartScene();
        }, [], this);
    }

    backToStartScene() {
        this.soundtrack.stop();
        this.bubblesSfx.stop();
        this.scene.start('start');
    }

    resetProgressTimer() {
        if (this.progressTimer) {
            this.progressTimer.remove(false);
        }
    }

    updateScore(score) {
        this.score = score;
        this.scoreCard.setText(`Score: ${this.score}`);
    }
    updateLives(lives) {
        this.lives = lives;

        // Clean out all hearts
        this.liveHearts.forEach(heart => {
            if (heart) {
                heart.destroy();
            }
        });
        this.liveHearts = [];

        for (let i = 0; i < lives; i++) {
            this.liveHearts[i] = this.add.sprite(((this.heartOptions.size * i) + (this.heartOptions.padding * (i+1))), this.heartOptions.padding + 80, 'heart');
            this.liveHearts[i].setDisplaySize(this.heartOptions.size, this.heartOptions.size);
            this.liveHearts[i].setOrigin(0, 0);
        }
    }
}
