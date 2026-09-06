// Fx — procedural rewards with NO asset files: a golden sparkle burst and a
// rising WebAudio chime. Kid-friendly instant feedback on each "Ram".

export class Fx {
  constructor(scene) {
    this.scene = scene;
    // build a tiny white 'star' texture once, for sparkle particles
    if (!scene.textures.exists('fx_spark')) {
      const g = scene.make.graphics({ x: 0, y: 0, add: false });
      g.fillStyle(0xffffff, 1);
      // 4-point sparkle
      g.fillCircle(8, 8, 3);
      g.fillTriangle(8, 0, 6.5, 8, 9.5, 8);
      g.fillTriangle(8, 16, 6.5, 8, 9.5, 8);
      g.fillTriangle(0, 8, 8, 6.5, 8, 9.5);
      g.fillTriangle(16, 8, 8, 6.5, 8, 9.5);
      g.generateTexture('fx_spark', 16, 16);
      g.destroy();
    }
    this.emitter = scene.add.particles(0, 0, 'fx_spark', {
      lifespan: 620,
      speed: { min: 60, max: 180 },
      scale: { start: 0.9, end: 0 },
      alpha: { start: 1, end: 0 },
      tint: [0xffe9a8, 0xf1c40f, 0xffffff],
      blendMode: 'ADD',
      emitting: false,
    }).setDepth(21);

    // WebAudio (lazily created on first user-gesture-driven chime)
    this._audio = null;
  }

  sparkle(x, y, n = 14) {
    this.emitter.emitParticleAt(x, y, n);
  }

  // rising chime: pitch climbs with progress (0..1) so the 11th feels like arrival
  chime(progress = 0) {
    try {
      if (!this._audio) this._audio = new (window.AudioContext || window.webkitAudioContext)();
      const ac = this._audio;
      if (ac.state === 'suspended') ac.resume();
      const t = ac.currentTime;
      // pentatonic-ish rising scale so consecutive chants sound musical, not random
      const scale = [0, 2, 4, 7, 9, 12, 14, 16, 19, 21, 24];
      const semi = scale[Math.min(scale.length - 1, Math.round(progress * (scale.length - 1)))];
      const base = 392; // G4
      const freq = base * Math.pow(2, semi / 12);
      const o = ac.createOscillator();
      const g = ac.createGain();
      o.type = 'sine';
      o.frequency.value = freq;
      // soft bell envelope
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.22, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);
      // a gentle higher harmonic for a 'chime' shimmer
      const o2 = ac.createOscillator();
      const g2 = ac.createGain();
      o2.type = 'sine';
      o2.frequency.value = freq * 2;
      g2.gain.setValueAtTime(0.0001, t);
      g2.gain.exponentialRampToValueAtTime(0.08, t + 0.02);
      g2.gain.exponentialRampToValueAtTime(0.0001, t + 0.4);
      o.connect(g).connect(ac.destination);
      o2.connect(g2).connect(ac.destination);
      o.start(t); o2.start(t);
      o.stop(t + 0.52); o2.stop(t + 0.42);
    } catch { /* audio optional */ }
  }

  // triumphant arpeggio on stage complete
  fanfare() {
    [0, 0.4, 0.7, 1].forEach((p, i) => this.scene.time.delayedCall(i * 140, () => this.chime(p)));
  }
}
