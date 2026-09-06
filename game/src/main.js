import Phaser from 'phaser';
import { Stage1Scene } from './Stage1Scene.js';

const gameEl = document.getElementById('game');

function startGame() {
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
}

// Wait for the rounded kids' font so text isn't drawn in a fallback first.
if (document.fonts && document.fonts.ready) {
  Promise.race([
    document.fonts.load('700 26px "Baloo 2"').then(() => document.fonts.ready),
    new Promise((r) => setTimeout(r, 1500)), // don't block forever on slow networks
  ]).then(startGame);
} else {
  startGame();
}
