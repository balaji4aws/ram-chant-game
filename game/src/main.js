import Phaser from 'phaser';
import { Stage1Scene } from './Stage1Scene.js';

const gameEl = document.getElementById('game');

const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game',
  width: 480,
  height: 854, // ~9:16 portrait
  backgroundColor: '#160c2b',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    parent: 'game',
    width: 480,
    height: 854,
  },
  render: { antialias: true, roundPixels: false },
  scene: [Stage1Scene],
});
window.__RCJ__ = game;
