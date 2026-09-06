// Stage1Scene — BASICS ONLY. Target: 11 "Ram" japa.
// Rule: each recognized "Ram" => Hanuman takes ONE upward climb step (+1).
// Any other word => Hanuman does NOT move. No rhythm, no speed logic, no coins.
// Prove the core: "Ram" moves Hanuman; other words don't. Then Venky approves Stage 1.
//
// ART (all under public/art/):
//   stage1/bg_greatleap.jpg — dawn clifftop/ocean bg, scrolls DOWN (parallax)
//   hanuman/*.png           — chibi hero pose sprites (flying/jump/idle/…, transparent)
//   hanuman/expr_*.png      — facial-expression reaction pops
//   lessons/lesson1.jpg     — Stage-1 reward card (optional; falls back to summary_card)
//   stage1/summary_card.jpg — fallback completion card
// Vector Hanuman kept as a graceful fallback if the sprite fails to load.

import { Hanuman } from './Hanuman.js';
import { WordChant } from './WordChant.js';
import { Fx } from './Fx.js';
import { STAGES, PALETTE } from './stages.js';

const TARGET = 11;
const ART = 'art/stage1/';

export class Stage1Scene extends Phaser.Scene {
  constructor() { super('Stage1'); }

  preload() {
    // All art is OPTIONAL right now (fresh assets arriving). The scene falls back to
    // a vector hero + gradient sky + text cards when a file is absent. We swallow
    // loader 404s so the console stays clean until real art is dropped in.
    this.load.image('s1_bg', ART + 'bg_greatleap.jpg');
    this.load.image('h_idle', 'art/hanuman/idle_front.png');
    this.load.image('h_jump', 'art/hanuman/jumping.png');
    this.load.image('h_fly', 'art/hanuman/flying.png');
    this.load.image('h_happy', 'art/hanuman/expr_happy.png');
    this.load.image('s1_card', ART + 'summary_card.jpg');
    this.load.image('s1_lesson', 'art/lessons/lesson1.jpg');
    this._missing = new Set();
    this.load.on('loaderror', (file) => { this._missing.add(file.key); });
  }

  create() {
    const W = this.scale.width, H = this.scale.height;
    this.stage = STAGES[0];
    this.count = 0;
    this.done = false;

    const haveBg = this.textures.exists('s1_bg');
    const haveHero = this.textures.exists('h_fly');

    // --- BACKGROUND: real dawn-ocean art, cover-fit, tall enough to scroll ---
    if (haveBg) {
      const src = this.textures.get('s1_bg').getSourceImage();
      const scale = Math.max(W / src.width, (H * 1.6) / src.height); // over-tall for scroll
      // two stacked copies so it wraps seamlessly as we scroll DOWN
      this.bgTiles = [];
      for (let i = 0; i < 2; i++) {
        const img = this.add.image(W / 2, 0, 's1_bg').setScale(scale).setDepth(0);
        img.y = i * img.displayHeight - img.displayHeight + H; // stack above the viewport
        this.bgTiles.push(img);
      }
      this.bgTileH = this.bgTiles[0].displayHeight;
      // gentle dark vignette top+bottom so HUD text stays readable
      this.add.rectangle(W / 2, 70, W, 200, 0x0a0620, 0.28).setDepth(1);
      this.add.rectangle(W / 2, H - 90, W, 220, 0x0a0620, 0.34).setDepth(1);
    } else {
      // fallback gradient sky
      const g = this.add.graphics().setDepth(0);
      const steps = 30;
      for (let i = 0; i < steps; i++) {
        const c = Phaser.Display.Color.Interpolate.ColorWithColor(
          Phaser.Display.Color.IntegerToColor(0x2a1a4a),
          Phaser.Display.Color.IntegerToColor(0x0e6b8c), steps - 1, i);
        g.fillStyle(Phaser.Display.Color.GetColor(c.r, c.g, c.b), 1);
        g.fillRect(0, (H / steps) * i, W, H / steps + 1);
      }
    }

    // --- HERO: flying Hanuman sprite (or vector fallback) ---
    this.baseY = H * 0.60;
    if (haveHero) {
      // normalize every pose to the SAME display height so swaps don't jump
      this.heroH = H * 0.20;
      this.heroAura = this.add.circle(W * 0.5, this.baseY, this.heroH * 0.6, PALETTE.gold, 0.0)
        .setDepth(8).setBlendMode(Phaser.BlendModes.ADD);
      this.heroShadow = this.add.image(W * 0.5 + 3, this.baseY + 6, 'h_fly')
        .setDepth(9).setTint(0x0a0620).setAlpha(0.22);
      this.hero = this.add.image(W * 0.5, this.baseY, 'h_fly').setDepth(10);
      this._setPose('h_fly');
      this.usingSprite = true;
    } else {
      this.h = new Hanuman(this, W * 0.5, this.baseY);
      this.h.baseY = this.baseY;
      this.h.c.setDepth(10);
      this.h.setGlow(0.3);
      this.usingSprite = false;
    }

    // --- HUD: STAGE NAME at top ---
    this.title = this.add.text(W / 2, 78, 'Stage 1 · The Great Leap', {
      fontFamily: 'Georgia, serif', fontSize: '22px', color: '#f1c40f', fontStyle: 'bold', stroke: '#160c2b', strokeThickness: 5,
    }).setOrigin(0.5).setDepth(50);
    this.tagline = this.add.text(W / 2, 106, 'Chant Ram to power Hanuman', {
      fontFamily: 'system-ui', fontSize: '13px', color: '#ffe9a8', stroke: '#160c2b', strokeThickness: 3,
    }).setOrigin(0.5).setDepth(50);

    // --- reward FX (procedural: sparkle + chime, no assets) ---
    this.fx = new Fx(this);

    // ============ BOTTOM CONTROL PANEL ============
    // Three labelled controls: Ram Mudra (mic) · Ram Japa (count) · Save/Exit
    const panelY = H - 92;
    this._panel = this.add.rectangle(W / 2, panelY, W - 24, 118, 0x160c2b, 0.55).setDepth(48)
      .setStrokeStyle(1, PALETTE.gold, 0.35);

    // --- Ram Japa (count) — center, the sacred japa tally ---
    this._japaLabel = this.add.text(W / 2, panelY - 40, 'RAM JAPA', {
      fontFamily: 'system-ui', fontSize: '11px', color: '#ffd9a0', fontStyle: 'bold',
    }).setOrigin(0.5).setDepth(50);
    this.counter = this.add.text(W / 2, panelY - 18, `0 / ${TARGET}`, {
      fontFamily: 'Georgia, serif', fontSize: '26px', color: '#fff3dd', fontStyle: 'bold', stroke: '#160c2b', strokeThickness: 4,
    }).setOrigin(0.5).setDepth(50);

    // --- Ram Mudra (mic control) — the chant button ---
    this.startBtn = this.add.text(W / 2, panelY + 24, '🎤 Ram Mudra — tap, then say “Ram”', {
      fontFamily: 'system-ui', fontSize: '15px', color: '#160c2b', backgroundColor: '#f1c40f',
      padding: { x: 16, y: 9 }, fontStyle: 'bold',
    }).setOrigin(0.5).setDepth(50).setInteractive();
    if (!WordChant.supported) {
      this.startBtn.setText('⚠️ Voice not supported — try Chrome').setBackgroundColor('#c0392b').setColor('#fff');
    }
    this.startBtn.on('pointerdown', () => this._startVoice());

    // --- Save / Exit — top-right corner ---
    this.exitBtn = this.add.text(W - 14, 20, '⏸ Save / Exit', {
      fontFamily: 'system-ui', fontSize: '12px', color: '#fff3dd', backgroundColor: '#2a1a4a',
      padding: { x: 10, y: 6 }, fontStyle: 'bold',
    }).setOrigin(1, 0).setDepth(51).setInteractive();
    this.exitBtn.on('pointerdown', () => this._saveExit());

    // small status line under the panel
    this.status = this.add.text(W / 2, H - 20, '', {
      fontFamily: 'system-ui', fontSize: '11px', color: '#ffd9a0', stroke: '#160c2b', strokeThickness: 2,
    }).setOrigin(0.5).setDepth(50);
    this.heard = this.add.text(W / 2, panelY - 58, '', {
      fontFamily: 'system-ui', fontSize: '12px', color: '#ffe9a8', stroke: '#160c2b', strokeThickness: 3,
    }).setOrigin(0.5).setDepth(50);

    this.climbing = 0;   // frames of climb animation remaining
    this.bob = 0;        // idle hover phase
    this._auraTarget = 0.45; // visible glow floor from the start
  }

  // Save progress + leave (Stage-1 MVP: persist japa count, then reload to menu/start)
  _saveExit() {
    try {
      localStorage.setItem('rcj_stage1_japa', String(this.count));
      localStorage.setItem('rcj_stage1_saved_at', new Date().toISOString());
    } catch { /* storage optional */ }
    if (this.word) this.word.stop();
    this.status.setText('Saved. 🙏');
    // brief confirmation, then restart the stage (no separate menu scene yet)
    this.time.delayedCall(700, () => this.scene.restart());
  }

  // swap pose texture and keep a constant display height across poses
  _setPose(key) {
    if (!this.usingSprite || this._pose === key || !this.textures.exists(key)) return;
    this._pose = key;
    const src = this.textures.get(key).getSourceImage();
    const sc = this.heroH / src.height;
    this.hero.setTexture(key).setScale(sc);
    this.heroShadow.setTexture(key).setScale(sc);
  }

  _startVoice() {    this.word = new WordChant(
      (w) => this._onRam(),
      (s) => {
        if (s === 'listening') { this.startBtn.setText('🎤 Listening — say “Ram”').setBackgroundColor('#2e9e5b').setColor('#fff'); this.status.setText('Say “Ram” to climb — other words won’t move Hanuman.'); }
        else if (s === 'unsupported') this.status.setText('Voice not supported here — try Chrome.');
        else if (s.startsWith('error')) this.status.setText('mic: ' + s);
      }
    );
    this.word.start();
  }

  _onRam() {
    if (this.done) return;
    this.count++;
    this.counter.setText(`${this.count} / ${TARGET}`);
    this.heard.setText('heard: “Ram” ✓ +1');
    this.climbing = 22;

    const hx = this._heroX(), hy = this._heroY();
    const progress = this.count / TARGET;
    const glow = Math.min(1, 0.3 + progress);
    if (this.usingSprite) this._auraTarget = glow;
    else this.h.setGlow(glow);

    // reward burst: sparkle + rising chime + a happy-face pop near the hero
    this.fx.sparkle(hx, hy - 6, 16);
    this.fx.chime(progress);
    this._popHappyFace(hx, hy);

    const ring = this.add.circle(hx, hy - 50, 8, PALETTE.gold, 0.6).setDepth(9).setBlendMode(Phaser.BlendModes.ADD);
    this.tweens.add({ targets: ring, radius: 46, alpha: 0, duration: 340, onComplete: () => ring.destroy() });

    if (this.count >= TARGET) this._complete();
  }

  _popHappyFace(x, y) {
    if (!this.textures.exists('h_happy')) return;
    const src = this.textures.get('h_happy').getSourceImage();
    const sc = (this.scale.height * 0.09) / src.height;
    const face = this.add.image(x + 34, y - 46, 'h_happy').setScale(sc * 0.4).setDepth(22).setAlpha(0);
    this.tweens.add({ targets: face, alpha: 1, scale: sc, y: y - 62, duration: 260, ease: 'Back.out',
      onComplete: () => this.tweens.add({ targets: face, alpha: 0, y: y - 90, delay: 240, duration: 300, onComplete: () => face.destroy() }) });
  }

  _heroX() { return this.usingSprite ? this.hero.x : this.h.c.x; }
  _heroY() { return this.usingSprite ? this.hero.y : this.h.c.y; }

  _complete() {
    this.done = true;
    if (this.word) this.word.stop();
    const W = this.scale.width, H = this.scale.height;

    // save progress + a simple play streak
    try {
      localStorage.setItem('rcj_stage1_complete', '1');
      const plays = (parseInt(localStorage.getItem('rcj_stage1_plays') || '0', 10) || 0) + 1;
      localStorage.setItem('rcj_stage1_plays', String(plays));
    } catch { /* storage optional */ }

    this.fx.fanfare();
    this.fx.sparkle(this._heroX(), this._heroY(), 40);

    // hide the in-play controls so they don't overlap the completion overlay
    [this.startBtn, this.exitBtn, this.counter, this.heard, this.status,
     this._japaLabel, this._panel].forEach((o) => o && o.setVisible(false));

    const bloom = this.add.circle(this._heroX(), this._heroY(), 20, PALETTE.gold, 0.9).setDepth(20).setBlendMode(Phaser.BlendModes.ADD);
    this.tweens.add({ targets: bloom, radius: W, alpha: 0, duration: 1000 });

    // dim overlay, then the premium summary card
    this.add.rectangle(W / 2, H / 2, W, H, 0x0a0620, 0.6).setDepth(29);

    if (this.textures.exists('s1_lesson') || this.textures.exists('s1_card')) {
      const cardKey = this.textures.exists('s1_lesson') ? 's1_lesson' : 's1_card';
      const card = this.add.image(W / 2, H / 2 - 20, cardKey).setDepth(30);
      const target = Math.min(W - 36, H - 240);
      card.setScale(target / card.width);
      card.setAlpha(0);
      this.tweens.add({ targets: card, alpha: 1, duration: 600 });
      this.add.text(W / 2, H - 128, 'Jai Shri Ram! 🙏  Stage 1 complete', {
        fontFamily: 'Georgia, serif', fontSize: '20px', color: '#f1c40f', fontStyle: 'bold', stroke: '#160c2b', strokeThickness: 5,
      }).setOrigin(0.5).setDepth(31);
    } else {
      this.add.rectangle(W / 2, H / 2, W - 40, 170, 0x160c2b, 0.94).setDepth(30).setStrokeStyle(2, PALETTE.gold, 0.8);
      this.add.text(W / 2, H / 2 - 40, 'Jai Shri Ram! 🙏', { fontFamily: 'Georgia, serif', fontSize: '26px', color: '#f1c40f', fontStyle: 'bold' }).setOrigin(0.5).setDepth(31);
      this.add.text(W / 2, H / 2 + 4, 'Stage 1 complete — the Great Leap!', { fontFamily: 'system-ui', fontSize: '15px', color: '#fff3dd' }).setOrigin(0.5).setDepth(31);
    }

    // --- Replay button (kids repeat) ---
    const replay = this.add.text(W / 2, H - 74, '🔁 Chant Again', {
      fontFamily: 'system-ui', fontSize: '18px', color: '#160c2b', backgroundColor: '#f1c40f',
      padding: { x: 20, y: 10 }, fontStyle: 'bold',
    }).setOrigin(0.5).setDepth(32).setInteractive();
    replay.setAlpha(0);
    this.tweens.add({ targets: replay, alpha: 1, delay: 700, duration: 400 });
    replay.on('pointerdown', () => this.scene.restart());
  }

  update(time, delta) {
    const dt = Math.min(delta / 1000, 0.05);
    const W = this.scale.width, H = this.scale.height;
    const climbing = this.climbing > 0;
    if (climbing) this.climbing--;

    // one climb hop per step: sine arc up then settle
    const leap = climbing ? Math.sin((22 - this.climbing) / 22 * Math.PI) : 0;
    this.bob += dt;
    const hover = Math.sin(this.bob * 2.2) * 6; // gentle idle hover

    if (this.usingSprite) {
      this._setPose(climbing ? 'h_jump' : 'h_fly');
      this.hero.y = this.baseY - leap * 34 + hover;
      this.hero.x = W * 0.5 + Math.sin(this.bob * 1.3) * 6;
      // shadow trails just behind/below for separation from the sky
      if (this.heroShadow) { this.heroShadow.x = this.hero.x + 3; this.heroShadow.y = this.hero.y + 6; }
      // aura follows + eases toward target glow (brighter floor so he always reads)
      const g = (this._auraTarget || 0.45);
      this.heroAura.x = this.hero.x; this.heroAura.y = this.hero.y;
      const pulse = 0.5 + 0.5 * Math.sin(this.bob * 6);
      this.heroAura.setAlpha(g * (0.22 + 0.18 * pulse));
      this.heroAura.setScale(1.0 + g * 0.25);
    } else {
      this.h.c.y = this.baseY - leap * 30 + hover;
      this.h.update(dt, climbing, leap);
    }

    // scroll the world DOWN while climbing => sense of ascending
    const v = climbing ? 300 : 22; // slow drift even when idle, faster on a leap
    if (this.bgTiles) {
      for (const t of this.bgTiles) {
        t.y += v * dt;
        if (t.y - this.bgTileH / 2 > H) t.y -= this.bgTileH * this.bgTiles.length;
      }
    }
  }
}
