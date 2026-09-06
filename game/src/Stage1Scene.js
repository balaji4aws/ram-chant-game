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
    // 10 expressive Stage-1 poses (the emotional journey of the Great Leap)
    this.load.image('p_remember', 'art/hanuman/remembering_rama.png');
    this.load.image('p_devotion', 'art/hanuman/devotion.png');
    this.load.image('p_clarity', 'art/hanuman/clarity.png');
    this.load.image('p_confidence', 'art/hanuman/confidence.png');
    this.load.image('p_surrender', 'art/hanuman/surrender.png');
    this.load.image('p_thinking', 'art/hanuman/thinking.png');
    this.load.image('p_inspiration', 'art/hanuman/inspiration.png');
    this.load.image('p_leaping', 'art/hanuman/leaping.png');
    this.load.image('p_ready', 'art/hanuman/ready.png');
    this.load.image('p_thinkrama', 'art/hanuman/thinking_of_rama.png');
    // additional expression poses (broader library for the journey + reactions)
    this.load.image('p_happy', 'art/hanuman/happy.png');
    this.load.image('p_excited', 'art/hanuman/excited.png');
    this.load.image('p_winking', 'art/hanuman/winking.png');
    this.load.image('p_running', 'art/hanuman/running.png');
    this.load.image('p_flying', 'art/hanuman/flying.png');
    this.load.image('p_greeting', 'art/hanuman/greeting.png');
    this.load.image('p_victory', 'art/hanuman/victory.png');
    this.load.image('p_pointing', 'art/hanuman/pointing.png');
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
      // Full-bleed: NO dark overlay bands — the title + HUD pills carry their own
      // readability (soft frosted backing), so the art shows edge to edge.
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
    // The emotional journey of the Great Leap, told across the 11 japa:
    // prayer → devotion → clarity → confidence → excitement → readiness → flight.
    this.POSES = ['p_remember', 'p_thinkrama', 'p_devotion', 'p_clarity',
                  'p_confidence', 'p_excited', 'p_inspiration', 'p_ready',
                  'p_running', 'p_leaping', 'p_flying'];
    const startPose = this.POSES.find((k) => this.textures.exists(k)) || null;
    if (startPose) {
      // normalize every pose to the SAME display height so swaps don't jump
      this.heroH = H * 0.20;
      this.heroAura = this.add.circle(W * 0.5, this.baseY, this.heroH * 0.6, PALETTE.gold, 0.0)
        .setDepth(8).setBlendMode(Phaser.BlendModes.ADD);
      this.heroShadow = this.add.image(W * 0.5 + 3, this.baseY + 6, startPose)
        .setDepth(9).setTint(0x0a0620).setAlpha(0.22);
      this.hero = this.add.image(W * 0.5, this.baseY, startPose).setDepth(10);
      this.usingSprite = true;
      this._pose = null;
      this._setPose(startPose);
    } else {
      this.h = new Hanuman(this, W * 0.5, this.baseY);
      this.h.baseY = this.baseY;
      this.h.c.setDepth(10);
      this.h.setGlow(0.3);
      this.usingSprite = false;
    }

    // Modern kids' UI: rounded playful font, soft floating pills, NO hard boxes.
    const KID_FONT = '"Baloo 2","Fredoka",system-ui,sans-serif';

    // --- STAGE TITLE (top) — floating soft pill, no border box ---
    this._titlePill = this.add.graphics().setDepth(49);
    this._roundRect(this._titlePill, W / 2 - 168, 54, 336, 62, 22, 0x2a1a4a, 0.34);
    this.title = this.add.text(W / 2, 74, 'The Great Leap', {
      fontFamily: KID_FONT, fontSize: '26px', color: '#fff6df', fontStyle: 'bold',
    }).setOrigin(0.5).setDepth(50).setShadow(0, 2, '#000', 6, false, true);
    this.tagline = this.add.text(W / 2, 100, 'Say Rāma’s name to help Hanumān leap the sea', {
      fontFamily: KID_FONT, fontSize: '12px', color: '#fff', align: 'center', wordWrap: { width: W - 80 },
    }).setOrigin(0.5).setDepth(50).setShadow(0, 1, '#3a2600', 3, false, true);

    // --- reward FX (procedural: sparkle + chime, no assets) ---
    this.fx = new Fx(this);

    // ============ BOTTOM CONTROLS — floating soft pills, no container box ============
    // Raised well clear of the very bottom edge (phone gesture/nav dead zone).
    const py = H - 150;

    // two frosted stat bubbles side by side (Ram Japa · Ram Mudra)
    this._statG = this.add.graphics().setDepth(48);
    const bw = 150, bh = 68, gap = 14;
    const lx = W / 2 - bw / 2 - gap / 2, rx = W / 2 + bw / 2 + gap / 2;
    this._roundRect(this._statG, lx - bw / 2, py - bh / 2, bw, bh, 20, 0xfff3df, 0.92);
    this._roundRect(this._statG, rx - bw / 2, py - bh / 2, bw, bh, 20, 0xfff3df, 0.92);

    // Ram Japa (chant count) — left bubble
    this._japaLabel = this.add.text(lx, py - 17, 'RAM JAPA', {
      fontFamily: KID_FONT, fontSize: '11px', color: '#c0651b', fontStyle: 'bold', letterSpacing: 1,
    }).setOrigin(0.5).setDepth(50);
    this.counter = this.add.text(lx, py + 9, `0 / ${TARGET}`, {
      fontFamily: KID_FONT, fontSize: '26px', color: '#e8571e', fontStyle: 'bold',
    }).setOrigin(0.5).setDepth(50);

    // Ram Mudra (coins) — right bubble, with a DRAWN GOLD COIN (emoji renders silver on some OSes)
    this._mudraLabel = this.add.text(rx, py - 17, 'RAM MUDRA', {
      fontFamily: KID_FONT, fontSize: '11px', color: '#c0651b', fontStyle: 'bold', letterSpacing: 1,
    }).setOrigin(0.5).setDepth(50);
    this._coinG = this.add.graphics().setDepth(50);
    const coinX = rx - 20, coinY = py + 9;
    this._coinG.fillStyle(0xd98f00, 1); this._coinG.fillCircle(coinX, coinY, 12);   // rim
    this._coinG.fillStyle(0xffc433, 1); this._coinG.fillCircle(coinX, coinY, 9.5);  // face
    this._coinG.fillStyle(0xffe08a, 0.9); this._coinG.fillCircle(coinX - 3, coinY - 3, 3); // shine
    this.mudra = this.add.text(rx + 8, py + 9, '0', {
      fontFamily: KID_FONT, fontSize: '26px', color: '#e6a70f', fontStyle: 'bold',
    }).setOrigin(0.5).setDepth(50);

    // --- Chant button: big chunky rounded pill with soft shadow ---
    const bY = H - 74, bW2 = 250, bH2 = 52;
    this._btnG = this.add.graphics().setDepth(49);
    this._roundRect(this._btnG, W / 2 - bW2 / 2, bY - bH2 / 2 + 4, bW2, bH2, 25, 0x000000, 0.18); // shadow
    this._drawChantBtn = (color) => {
      this._btnG.clear();
      this._roundRect(this._btnG, W / 2 - bW2 / 2, bY - bH2 / 2 + 4, bW2, bH2, 25, 0x000000, 0.18);
      this._roundRect(this._btnG, W / 2 - bW2 / 2, bY - bH2 / 2, bW2, bH2, 25, color, 1);
    };
    this._drawChantBtn(0xffb02e); // warm saffron
    this.startBtn = this.add.text(W / 2, bY, '🎤  Tap, then say “Ram”', {
      fontFamily: KID_FONT, fontSize: '17px', color: '#5a2d00', fontStyle: 'bold',
      padding: { x: 14, y: 10 },
    }).setOrigin(0.5).setDepth(50).setInteractive({ useHandCursor: true });
    if (!WordChant.supported) {
      this._drawChantBtn(0xe4572e);
      this.startBtn.setText('Try Chrome for voice 🎤').setColor('#fff');
    }
    this.startBtn.on('pointerdown', () => this._startVoice());

    // --- Save and Exit — soft rounded chip, top-right ---
    this._exitG = this.add.graphics().setDepth(50);
    this._roundRect(this._exitG, W - 122, 14, 108, 36, 16, 0xffffff, 0.22);
    this.exitBtn = this.add.text(W - 68, 32, 'Save & Exit', {
      fontFamily: KID_FONT, fontSize: '13px', color: '#fff', fontStyle: 'bold',
      padding: { x: 8, y: 6 },
    }).setOrigin(0.5).setDepth(51).setInteractive({ useHandCursor: true });
    this.exitBtn.on('pointerdown', () => this._saveExit());

    // subtle status line (kept for permission hints only)
    this.status = this.add.text(W / 2, H - 40, '', {
      fontFamily: KID_FONT, fontSize: '11px', color: '#fff', align: 'center', wordWrap: { width: W - 60 },
    }).setOrigin(0.5).setDepth(50).setShadow(0, 1, '#3a2600', 3, false, true);
    this.climbing = 0;   // frames of climb animation remaining
    this.bob = 0;        // idle hover phase
    this._auraTarget = 0.45; // visible glow floor from the start
  }

  // draw a filled rounded rectangle (soft pill) — the modern-kids UI primitive
  _roundRect(g, x, y, w, h, r, color, alpha) {
    g.fillStyle(color, alpha);
    g.fillRoundedRect(x, y, w, h, r);
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
        if (s === 'listening') { this._drawChantBtn(0x3fbf6b); this.startBtn.setText('🎤 Listening — say “Ram”').setColor('#08351c'); this.status.setText('Say “Ram” to help Hanumān climb!'); }
        else if (s === 'unsupported') this.status.setText('Voice works best in Chrome 🎤');
        else if (s === 'mic-blocked') this.status.setText('🎤 Please allow the microphone, then tap again.');
        // benign recoverable hiccups are swallowed in WordChant; ignore stray error strings
      }
    );
    this.word.start();
  }

  _onRam() {
    if (this.done) return;
    this.count++;
    this.counter.setText(`${this.count} / ${TARGET}`);
    this.mudra.setText(`${this.count}`);
    this.climbing = 22;

    const hx = this._heroX(), hy = this._heroY();
    const progress = this.count / TARGET;
    const glow = Math.min(1, 0.3 + progress);
    if (this.usingSprite) this._auraTarget = glow;
    else this.h.setGlow(glow);

    // walk the emotional journey: pick the pose for how far along we are
    if (this.usingSprite && this.POSES && this.POSES.length) {
      const idx = Math.min(this.POSES.length - 1,
        Math.floor((this.count - 1) / TARGET * this.POSES.length));
      this._setPose(this.POSES[idx]);
    }

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

    // celebrate in the Victory pose before the lesson card rises
    if (this.usingSprite && this.textures.exists('p_victory')) this._setPose('p_victory');

    // hide the in-play controls so they don't overlap the completion overlay
    [this.startBtn, this.exitBtn, this.counter, this.mudra, this.status,
     this._japaLabel, this._mudraLabel, this._statG, this._btnG, this._exitG,
     this._coinG, this._titlePill, this.title, this.tagline].forEach((o) => o && o.setVisible(false));

    const bloom = this.add.circle(this._heroX(), this._heroY(), 20, PALETTE.gold, 0.9).setDepth(20).setBlendMode(Phaser.BlendModes.ADD);
    this.tweens.add({ targets: bloom, radius: W, alpha: 0, duration: 1000 });

    // dim overlay, then the premium summary card
    this.add.rectangle(W / 2, H / 2, W, H, 0x0a0620, 0.6).setDepth(29);

    if (this.textures.exists('s1_lesson')) {
      const cardKey = 's1_lesson';
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
