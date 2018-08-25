import Phaser from 'phaser';
import Bubble from '../objects/bubble';
import { OPERATIONS } from '../operations';
import { config } from '../config';
import { Button } from '../objects/button';

export class PauseScene extends Phaser.Scene {

  pausePanel;

  constructor() {
    super({ key: 'pause' });
  }
  create(data) {
    const pausePanelBg = this.add.graphics();
    const panelWidth = +this.sys.game.config.width;
    const panelHeight = +this.sys.game.config.height;

    this.pausePanel = this.add.container(0, 0).setSize(panelWidth, panelHeight);
    pausePanelBg.clear();
    pausePanelBg.fillStyle(0x2f4f4f);
    pausePanelBg.fillRect(0, 0, panelWidth, panelHeight);
    pausePanelBg.setAlpha(.9);

    const resumeButton = new Button({
      x: panelWidth / 2,
      y: 100,
      text: 'Resume',
      onClick: () => {
        this.scene.resume('main');
        this.scene.stop('pause');
      }
    }, this);
    
    const muteButton = new Button({
      x: panelWidth / 2,
      y: 200,
      text: 'Mute',
      onClick: () => {
        config.isMute = true;
        this.sys.game.sound.mute = config.isMute;
        this.scene.stop('pause');
      }
    }, this);
    
    const unmuteButton = new Button({
      x: panelWidth / 2,
      y: 200,
      text: 'Unmute',
      onClick: () => {
        config.isMute = false;
        this.sys.game.sound.mute = config.isMute;
        this.scene.stop('pause');
      }
    }, this);
    
    const exitButton = new Button({
      x: panelWidth / 2,
      y: 300,
      text: 'Exit',
      onClick: () => {
        data.mainScene.backToStartScene();
        this.scene.stop('pause');
      }
    }, this);

    this.pausePanel.add([
      pausePanelBg,
      resumeButton.container,
      config.isMute ? unmuteButton.container : muteButton.container,
      exitButton.container
    ]);
    this.pausePanel.setDepth(1);
  }
}