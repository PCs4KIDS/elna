import Phaser from 'phaser';

let gameScene = new Phaser.Scene('Game');

let config = {
  type: Phaser.AUTO, // Let phaser determine how to render the game
  width: 640,
  height: 500,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: {
        y: 300
      },
      debug: false
    }
  },
  scene: gameScene
};

gameScene.init = function() {
  this.playerSpeed = 2.5;

  this.enemyMinY = 80;
  this.enemyMaxY = 280;
}

gameScene.preload = function() {
  this.load.image('background', 'assets/sky.jpg');
  this.load.image('player', 'assets/player.png');
  this.load.image('box', 'assets/box.png');
  this.load.image('soldier', 'assets/soldier.png');
  this.load.image('grass', 'assets/grass.png');
  this.load.image('spider', 'assets/spider.png')
}

gameScene.create = function() {
  // this.physics.startSystem(Phaser.Physics.ARCADE);

  // Set the background
  let bg = this.add.tileSprite(0, 0, this.sys.game.config.width, this.sys.game.config.height, 'background');
  // Set the background to the top-left corner
  bg.setOrigin(0, 0);

  this.ground = this.physics.add.staticGroup();
  this.ground.create(this.sys.game.config.width / 2, this.sys.game.config.height + 300, 'grass').setScale(5).refreshBody();

  this.player = this.physics.add.sprite(220, this.sys.game.config.height / 2 + 50, 'player');
  this.player.setScale(.25);
  this.player.setBounce(.2);
  this.player.setCollideWorldBounds(true);
  this.physics.add.collider(this.player, this.ground);

  this.enemy = this.physics.add.sprite(this.sys.game.config.width - 80, this.sys.game.config.height - 80, 'spider');
  this.enemy.setCollideWorldBounds(true);
  this.physics.add.collider(this.enemy, this.ground);

  this.box = this.add.sprite(this.sys.game.config.width - 80, this.sys.game.config.height / 2, 'box');
  this.box.setScale(.5);

  this.isPlayerAlive = true;

  this.cameras.main.resetFX();

  this.cursors = this.input.keyboard.createCursorKeys();
}

gameScene.update = function() {
  if (!this.isPlayerAlive) {
    return;
  }

  if (this.cursors.right.isDown) {
    this.player.setVelocityX(160);
  }
  else if (this.cursors.left.isDown) {
    this.player.setVelocityX(-160);
  } else {
    this.player.setVelocityX(0);
  }

  if (Phaser.Geom.Intersects.RectangleToRectangle(this.player.getBounds(), this.box.getBounds())) {
    // collision
    this.gameOver();
  }
}

gameScene.gameOver = function() {
  this.isPlayerAlive = false;
  console.log('collided.');
  this.cameras.main.shake(500);

  this.time.delayedCall(250, function() {
    this.cameras.main.fade(250);
  }, [], this);

  this.time.delayedCall(500, function() {
    this.scene.restart();
  }, [], this);
}

let game = new Phaser.Game(config);
