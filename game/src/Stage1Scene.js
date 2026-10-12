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
import { STAGES, PALETTE, FONT } from './stages.js';

const TARGET = 11;
const ART = 'art/stage1/';

export class Stage1Scene extends Phaser.Scene {
  constructor() { super('Stage1'); }

  preload() {
    // All art is OPTIONAL right now (fresh assets arriving). The scene falls back to
    // a vector hero + gradient sky + text cards when a file is absent. We swallow
    // loader 404s so the console stays clean until real art is dropped in.
    this.load.image('s1_bg', ART + 'bg_greatleap.jpg');
    this.load.image('s1_bg_fade', ART + 'bg_greatleap_fade.png'); // edge-faded for seamless overlap-tiling
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

    // --- BACKGROUND: SMOOTH INFINITE SCROLL (no hard cut) ---
    // The art's top edge (leaves) doesn't match its bottom (cliff), so butting two
    // copies shows a seam. Fix: a solid SKY base fills the screen, and we scroll copies
    // of an EDGE-FADED version of the art whose top+bottom dissolve to transparent.
    // Copies OVERLAP by the fade band, so at each join the faded edges cross-dissolve
    // over the sky base — the eye reads a continuous drift through open sky, not a cut.
    if (haveBg) {
      const src = this.textures.get('s1_bg').getSourceImage();
      const scale = Math.max(W / src.width, H / src.height); // cover width+height
      const tileH = src.height * scale;
      const fadePx = tileH * 0.18;          // must match FADE_FRAC in _bake_bg_fade.py
      const useFade = this.textures.exists('s1_bg_fade');
      const key = useFade ? 's1_bg_fade' : 's1_bg';
      // solid sky base behind everything so the faded edges reveal sky, not black
      this.add.rectangle(W / 2, H / 2, W, H, 0x8ec9f2).setDepth(-1); // soft daytime sky
      // step = tileH minus the overlap (one fade band) so adjacent copies overlap+blend
      this.bgStep = tileH - fadePx;
      this.bgTiles = [];
      const n = Math.ceil(H / this.bgStep) + 2;
      for (let i = 0; i < n; i++) {
        const img = this.add.image(W / 2, 0, key).setScale(scale).setOrigin(0.5, 0).setDepth(0);
        img.y = (i - 1) * this.bgStep;
        this.bgTiles.push(img);
      }
      this.bgTileH = tileH;
      this.bgScroll = 0;
      this.bgSpeed = 16;    // calm idle drift px/s
      this.bgSurge = 0;     // extra speed per chant, decays back to calm
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
    const KID_FONT = FONT;

    // --- STAGE TITLE (top) — floating soft pill, no border box ---
    this._titlePill = this.add.graphics().setDepth(49);
    this._roundRect(this._titlePill, W / 2 - 168, 26, 336, 78, 22, 0x2a1a4a, 0.55);
    // small "Stage 1 / 7" line above the theme title
    this.stageLabel = this.add.text(W / 2, 40, `STAGE ${this.stage.id} / ${STAGES.length}`, {
      fontFamily: KID_FONT, fontSize: '11px', color: '#ffd98a', fontStyle: 'bold', letterSpacing: 2,
    }).setOrigin(0.5).setDepth(50).setShadow(0, 1, '#000', 4, false, true);
    this.title = this.add.text(W / 2, 62, `${this.stage.emoji}  ${this.stage.themeTitle}`, {
      fontFamily: KID_FONT, fontSize: '23px', color: '#fff6df', fontStyle: 'bold',
    }).setOrigin(0.5).setDepth(50).setShadow(0, 2, '#000', 6, false, true);
    this.tagline = this.add.text(W / 2, 86, this.stage.subtitle, {
      fontFamily: KID_FONT, fontSize: '12px', color: '#fff', align: 'center', wordWrap: { width: W - 80 },
    }).setOrigin(0.5).setDepth(50).setShadow(0, 1, '#3a2600', 3, false, true);

    // --- reward FX (procedural: sparkle + chime, no assets) ---
    this.fx = new Fx(this);

    // ============ BOTTOM CONTROLS — floating soft pills, no container box ============
    // Raised well clear of the very bottom edge (phone gesture/nav dead zone).
    const py = H - 168;   // Rāma Japa bubble — lifted to add clear space above the button

    // stat bubbles. Ram Mudra is HIDDEN FOR NOW (Venky) — flip SHOW_MUDRA to bring
    // the coin counter back. With it off, the single Ram Japa bubble is centered.
    const SHOW_MUDRA = false;
    this._statG = this.add.graphics().setDepth(48);
    const bw = 150, bh = 68, gap = 14;
    const lx = SHOW_MUDRA ? (W / 2 - bw / 2 - gap / 2) : (W / 2);
    const rx = W / 2 + bw / 2 + gap / 2;
    this._roundRect(this._statG, lx - bw / 2, py - bh / 2, bw, bh, 20, 0xfff3df, 0.92);
    if (SHOW_MUDRA) this._roundRect(this._statG, rx - bw / 2, py - bh / 2, bw, bh, 20, 0xfff3df, 0.92);

    // Ram Japa (chant count) — left/center bubble
    this._japaLabel = this.add.text(lx, py - 17, 'RĀMA JAPA', {
      fontFamily: KID_FONT, fontSize: '11px', color: '#c0651b', fontStyle: 'bold', letterSpacing: 1,
    }).setOrigin(0.5).setDepth(50);
    this.counter = this.add.text(lx, py + 9, `0 / ${TARGET}`, {
      fontFamily: KID_FONT, fontSize: '26px', color: '#e8571e', fontStyle: 'bold',
    }).setOrigin(0.5).setDepth(50);

    // Ram Mudra (coins) — right bubble, with a DRAWN GOLD COIN. Created either way so
    // this.mudra always exists (the japa handler writes to it), but hidden when off.
    this._mudraLabel = this.add.text(rx, py - 17, 'RAM MUDRA', {
      fontFamily: KID_FONT, fontSize: '11px', color: '#c0651b', fontStyle: 'bold', letterSpacing: 1,
    }).setOrigin(0.5).setDepth(50);
    this._coinG = this.add.graphics().setDepth(50);
    const coinX = rx - 20, coinY = py + 9;
    // Bright shiny gold: warm amber rim -> saturated gold face -> hot highlight.
    this._coinG.fillStyle(0xb8730a, 1);  this._coinG.fillCircle(coinX, coinY, 12.5);      // outer rim (amber)
    this._coinG.fillStyle(0xffcf1a, 1);  this._coinG.fillCircle(coinX, coinY, 10);        // gold face
    this._coinG.lineStyle(1.2, 0xffe57a, 0.9); this._coinG.strokeCircle(coinX, coinY, 7); // inner ring
    this._coinG.fillStyle(0xfff4c2, 0.95); this._coinG.fillCircle(coinX - 3.2, coinY - 3.2, 3.2); // shine
    this.mudra = this.add.text(rx + 8, py + 9, '0', {
      fontFamily: KID_FONT, fontSize: '26px', color: '#e6a70f', fontStyle: 'bold',
    }).setOrigin(0.5).setDepth(50);
    if (!SHOW_MUDRA) {
      this._mudraLabel.setVisible(false);
      this._coinG.setVisible(false);
      this.mudra.setVisible(false);
    }

    // --- Chant button: big chunky rounded pill with soft shadow ---
    const bY = H - 86, bW2 = 320, bH2 = 56;
    this._btnG = this.add.graphics().setDepth(49);
    this._roundRect(this._btnG, W / 2 - bW2 / 2, bY - bH2 / 2 + 4, bW2, bH2, 26, 0x000000, 0.18); // shadow
    this._drawChantBtn = (color) => {
      this._btnG.clear();
      this._roundRect(this._btnG, W / 2 - bW2 / 2, bY - bH2 / 2 + 4, bW2, bH2, 26, 0x000000, 0.18);
      this._roundRect(this._btnG, W / 2 - bW2 / 2, bY - bH2 / 2, bW2, bH2, 26, color, 1);
    };
    this._drawChantBtn(0xffb02e); // warm saffron
    this.startBtn = this.add.text(W / 2, bY, '🎤 Tap mic to start Rāma naama chant', {
      fontFamily: KID_FONT, fontSize: '15px', color: '#5a2d00', fontStyle: 'bold',
      align: 'center', wordWrap: { width: bW2 - 28 }, padding: { x: 10, y: 8 },
    }).setOrigin(0.5).setDepth(50).setInteractive({ useHandCursor: true });
    if (!WordChant.supported) {
      this._drawChantBtn(0xe4572e);
      this.startBtn.setText('Try Chrome for voice 🎤').setColor('#fff');
    }
    this.startBtn.on('pointerdown', () => this._startVoice());

    // --- Save and Exit — soft rounded chip, top-right ---
    // HIDDEN FOR NOW (Venky: "we will bring it out later"). Flip SHOW_SAVE_EXIT to
    // restore it — the code and _saveExit() handler are kept intact.
    const SHOW_SAVE_EXIT = false;
    this._exitG = this.add.graphics().setDepth(50);
    this._roundRect(this._exitG, W - 122, 14, 108, 36, 16, 0xffffff, 0.22);
    this.exitBtn = this.add.text(W - 68, 32, 'Save & Exit', {
      fontFamily: KID_FONT, fontSize: '13px', color: '#fff', fontStyle: 'bold',
      padding: { x: 8, y: 6 },
    }).setOrigin(0.5).setDepth(51).setInteractive({ useHandCursor: true });
    this.exitBtn.on('pointerdown', () => this._saveExit());
    if (!SHOW_SAVE_EXIT) { this._exitG.setVisible(false); this.exitBtn.setVisible(false).disableInteractive(); }

    // subtle status line (kept for permission hints only)
    // caption line just BELOW the chant button — explains the mechanic warmly
    this.status = this.add.text(W / 2, H - 42, 'Rāma naama powers Hanumān to move ahead', {
      fontFamily: KID_FONT, fontSize: '12px', color: '#fff', align: 'center', wordWrap: { width: W - 60 },
    }).setOrigin(0.5).setDepth(50).setShadow(0, 1, '#3a2600', 3, false, true);
    this.climbing = 0;   // frames of climb animation remaining
    this.bob = 0;        // idle hover phase
    this._auraTarget = 0.45; // visible glow floor from the start
    // gentle encouragement when the child goes quiet (warm invite, never a scold)
    this._playing = false;      // true once listening has started
    this._quietFor = 0;         // seconds since the last "Ram" while playing
    this._nudgeShown = false;   // one nudge per quiet spell
    this._encouragements = [
      'Say “Rāma” again to help Hanumān! 🙏',
      'Hanumān is waiting for your “Rāma” ✨',
      'One more “Rāma”… you’re doing so well! 🌟',
      'Chant “Rāma” and watch Hanumān rise! 🕉️',
    ];
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

  _startVoice() {
    // toggle: a second tap stops listening (so the child/parent can pause)
    if (this.word && this._listening) { this.word.stop(); return; }

    this.word = new WordChant(
      (w) => this._onRam(),
      (s) => {
        if (s === 'listening') {
          this._listening = true;
          this._playing = true;
          this._quietFor = 0;
          this._nudgeShown = false;
          this._drawChantBtn(0x3fbf6b);
          this.startBtn.setText('🎤 Listening — chant “Rāma”').setColor('#08351c');
          this.status.setText('Say “Ram” to help Hanumān climb!');
        } else if (s === 'unsupported') {
          this.status.setText('Voice needs Chrome or Edge 🎤');
        } else if (s === 'stopped') {
          this._listening = false;
          this._playing = false;
          this._hideNudge();
          this._drawChantBtn(0xffb02e);
          this.startBtn.setText('🎤 Tap mic to chant Rāma to power Hanumān').setColor('#5a2d00');
          this.status.setText('Paused. Tap to chant again.');
        } else if (s === 'mic-blocked') {
          this._listening = false;
          this._drawChantBtn(0xe4572e);
          this.startBtn.setText('🎤 Allow mic, then tap').setColor('#fff');
          this.status.setText('Microphone blocked — click the 🎤/lock icon in the address bar, Allow, then tap again.');
        } else if (s && s.startsWith('error:')) {
          this._listening = false;
          this.status.setText('Voice hiccup (' + s.slice(6) + ') — tap to try again.');
        }
      },
      // onHeard: show what the mic actually picked up (proves recognition is alive)
      // While LISTENING (button green), show what the mic hears so the child + parent
      // can SEE the game is recognizing their voice. A matched chant flashes "Rāma! 🙏"
      // from _onRam (fires right after). We keep it warm — show the heard words plainly.
      (heard) => {
        if (!this._listening) return;
        // don't stomp a fresh "Rāma! 🙏" match — let it linger ~700ms
        if (this._ramHoldUntil && performance.now() < this._ramHoldUntil) return;
        this.status.setText('👂 heard: “' + heard + '”');
      }
    );
    this.word.start();
  }

  _onRam() {
    if (this.done) return;
    // warm, affirming feedback on every accepted chant (lingers over heard-text)
    this.status.setText('Rāma! 🙏');
    this._ramHoldUntil = performance.now() + 700;
    this.count++;
    this.counter.setText(`${this.count} / ${TARGET}`);
    this.mudra.setText(`${this.count}`);
    this.climbing = 22;
    // the child is chanting: reset the quiet timer and clear any encouragement nudge
    this._quietFor = 0;
    this._nudgeShown = false;
    this._hideNudge();
    // each "Ram" surges the endless roll => the world rushes by faster (exciting!),
    // then eases back to the calm idle drift. Faster/steadier chanting = more surge.
    this.bgSurge = Math.min(340, (this.bgSurge || 0) + 150);

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
    if (!this.textures.exists('p_happy')) return;
    const src = this.textures.get('p_happy').getSourceImage();
    const sc = (this.scale.height * 0.09) / src.height;
    const face = this.add.image(x + 34, y - 46, 'p_happy').setScale(sc * 0.4).setDepth(22).setAlpha(0);
    this.tweens.add({ targets: face, alpha: 1, scale: sc, y: y - 62, duration: 260, ease: 'Back.out',
      onComplete: () => this.tweens.add({ targets: face, alpha: 0, y: y - 90, delay: 240, duration: 300, onComplete: () => face.destroy() }) });
  }

  _heroX() { return this.usingSprite ? this.hero.x : this.h.c.x; }
  _heroY() { return this.usingSprite ? this.hero.y : this.h.c.y; }

  // Warm, inviting encouragement when the child goes quiet — NEVER a scold.
  // A soft floating bubble above Hanumān + a gentle beckon; disappears the moment
  // the child chants again.
  _showNudge() {
    if (this._nudge || this.done) return;
    const W = this.scale.width;
    const x = this._heroX(), y = this._heroY() - this.heroH * 0.85;
    const msg = Phaser.Utils.Array.GetRandom(this._encouragements);
    const t = this.add.text(x, y, msg, {
      fontFamily: FONT, fontSize: '15px',
      color: '#fff6df', fontStyle: 'bold', align: 'center', wordWrap: { width: W - 120 },
    }).setOrigin(0.5).setDepth(45).setAlpha(0).setShadow(0, 2, '#2a1a4a', 6, false, true);
    const pad = 12;
    const bg = this.add.graphics().setDepth(44);
    bg.fillStyle(0x2a1a4a, 0.55);
    bg.fillRoundedRect(t.x - t.width / 2 - pad, t.y - t.height / 2 - 8, t.width + pad * 2, t.height + 16, 16);
    bg.setAlpha(0);
    this._nudge = this.add.container(0, 0, [bg, t]).setDepth(45);
    // fade + gentle float-bounce to catch a child's eye without alarming
    this.tweens.add({ targets: [t, bg], alpha: 1, duration: 400 });
    this._nudgeBounce = this.tweens.add({
      targets: this._nudge, y: -6, duration: 700, yoyo: true, repeat: -1, ease: 'Sine.inOut',
    });
    // Hanumān gently turns to invite the child (friendly pose), if available
    if (this.usingSprite && this.textures.exists('p_pointing')) this._setPose('p_pointing');
    else if (this.usingSprite && this.textures.exists('p_greeting')) this._setPose('p_greeting');
  }

  _hideNudge() {
    if (this._nudgeBounce) { this._nudgeBounce.stop(); this._nudgeBounce = null; }
    if (this._nudge) { const n = this._nudge; this._nudge = null; this.tweens.add({ targets: n, alpha: 0, duration: 220, onComplete: () => n.destroy() }); }
  }

  _complete() {
    this.done = true;
    if (this.word) this.word.stop();
    const W = this.scale.width, H = this.scale.height;

    // save progress + a simple play streak + a CUMULATIVE japa total across sessions
    let totalJapa = this.count;
    try {
      localStorage.setItem('rcj_stage1_complete', '1');
      const plays = (parseInt(localStorage.getItem('rcj_stage1_plays') || '0', 10) || 0) + 1;
      localStorage.setItem('rcj_stage1_plays', String(plays));
      totalJapa = (parseInt(localStorage.getItem('rcj_total_japa') || '0', 10) || 0) + this.count;
      localStorage.setItem('rcj_total_japa', String(totalJapa));
    } catch { /* storage optional */ }

    this.fx.fanfare();
    this.fx.sparkle(this._heroX(), this._heroY(), 40);

    // celebrate in the Victory pose before the lesson card rises
    if (this.usingSprite && this.textures.exists('p_victory')) this._setPose('p_victory');

    // hide ALL in-play controls (incl. the STAGE 1/7 label, which must NOT show on
    // the completion card) so nothing bleeds through the overlay
    [this.startBtn, this.exitBtn, this.counter, this.mudra, this.status,
     this._japaLabel, this._mudraLabel, this._statG, this._btnG, this._exitG,
     this._coinG, this._titlePill, this.title, this.tagline, this.stageLabel].forEach((o) => o && o.setVisible(false));
    this._hideNudge();

    const bloom = this.add.circle(this._heroX(), this._heroY(), 20, PALETTE.gold, 0.9).setDepth(20).setBlendMode(Phaser.BlendModes.ADD);
    this.tweens.add({ targets: bloom, radius: W, alpha: 0, duration: 1000 });

    // dim overlay behind the completion screen
    this.add.rectangle(W / 2, H / 2, W, H, 0x0a0620, 0.62).setDepth(29);

    // ---- HEADER (top): celebration + stage-complete + aggregated japa count ----
    this.add.text(W / 2, 46, 'Jai Shri Ram! 🙏', {
      fontFamily: FONT, fontSize: '26px', color: '#f1c40f', fontStyle: 'bold',
      stroke: '#160c2b', strokeThickness: 5,
    }).setOrigin(0.5).setDepth(31);
    this.add.text(W / 2, 78, `Stage ${this.stage.id} completed`, {
      fontFamily: FONT, fontSize: '18px', color: '#fff3dd', fontStyle: 'bold',
      stroke: '#160c2b', strokeThickness: 4,
    }).setOrigin(0.5).setDepth(31);
    this.add.text(W / 2, 104, `Japa count: ${totalJapa}`, {
      fontFamily: FONT, fontSize: '15px', color: '#ffd98a', fontStyle: 'bold',
      stroke: '#160c2b', strokeThickness: 4,
    }).setOrigin(0.5).setDepth(31);

    // ---- LESSON CARD (middle) ----
    if (this.textures.exists('s1_lesson')) {
      const card = this.add.image(W / 2, H / 2 + 6, 's1_lesson').setDepth(30);
      const target = Math.min(W - 36, H - 250);
      card.setScale(target / card.width);
      card.setAlpha(0);
      this.tweens.add({ targets: card, alpha: 1, duration: 600 });
    } else {
      this.add.rectangle(W / 2, H / 2, W - 40, 170, 0x160c2b, 0.94).setDepth(30).setStrokeStyle(2, PALETTE.gold, 0.8);
      this.add.text(W / 2, H / 2, this.stage.subtitle, {
        fontFamily: FONT, fontSize: '15px', color: '#fff3dd', align: 'center', wordWrap: { width: W - 80 },
      }).setOrigin(0.5).setDepth(31);
    }

    // ---- NEXT button (bottom): advance to the next stage — SOFT ROUNDED PILL ----
    const isLast = this.stage.id >= STAGES.length;
    const nextLabel = isLast ? '🏁 Journey complete' : `➡️ Move to Stage ${this.stage.id + 1}`;
    const nbY = H - 60, nbW = 300, nbH = 56;
    const nextG = this.add.graphics().setDepth(31);
    this._roundRect(nextG, W / 2 - nbW / 2, nbY - nbH / 2 + 4, nbW, nbH, 26, 0x000000, 0.18); // soft shadow
    this._roundRect(nextG, W / 2 - nbW / 2, nbY - nbH / 2, nbW, nbH, 26, 0xffc433, 1);          // gold pill
    const nextBtn = this.add.text(W / 2, nbY, nextLabel, {
      fontFamily: FONT, fontSize: '18px', color: '#160c2b', fontStyle: 'bold',
    }).setOrigin(0.5).setDepth(32).setInteractive({ useHandCursor: true });
    // make the whole pill tappable, not just the glyphs
    const nextHit = this.add.rectangle(W / 2, nbY, nbW, nbH, 0x000000, 0.001)
      .setDepth(32).setInteractive({ useHandCursor: true });
    nextG.setAlpha(0); nextBtn.setAlpha(0);
    this.tweens.add({ targets: [nextG, nextBtn], alpha: 1, delay: 700, duration: 400 });
    const goNext = () => {
      // Stage 2+ scenes not built yet → restart Stage 1 for now (real routing later).
      // The intent (advance) is correct; wiring the next scene is the next milestone.
      this.scene.restart();
    };
    nextBtn.on('pointerdown', goNext);
    nextHit.on('pointerdown', goNext);
  }

  update(time, delta) {
    const dt = Math.min(delta / 1000, 0.05);
    const W = this.scale.width, H = this.scale.height;
    const climbing = this.climbing > 0;
    if (climbing) this.climbing--;

    // ENCOURAGEMENT: if the child is playing but has gone quiet for a moment (and the
    // stage isn't done), gently invite them to chant again. Warm, never a scold.
    if (this._playing && !this.done) {
      this._quietFor += dt;
      if (this._quietFor > 3.5 && !this._nudgeShown) { this._nudgeShown = true; this._showNudge(); }
    }

    // one climb hop per step: sine arc up then settle
    const leap = climbing ? Math.sin((22 - this.climbing) / 22 * Math.PI) : 0;
    this.bob += dt;
    const hover = Math.sin(this.bob * 2.2) * 6; // gentle idle hover

    if (this.usingSprite) {
      // Pose is owned by _onRam (the japa journey) and _showNudge (the invite pose);
      // we do NOT override it every frame here (the old 'h_jump'/'h_fly' keys never
      // existed and this fought those poses). Just animate position + aura.
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

    // SMOOTH INFINITE SCROLL: move the edge-faded copies DOWN; wrap by the overlap
    // STEP (tile minus one fade band) so joins keep cross-dissolving over the sky base.
    if (this.bgTiles) {
      this.bgSurge = (this.bgSurge || 0) * Math.pow(0.12, dt); // smooth decay to 0
      const v = this.bgSpeed + this.bgSurge;
      const span = this.bgStep * this.bgTiles.length;
      for (const t of this.bgTiles) {
        t.y += v * dt;
        if (t.y >= (this.bgTiles.length - 1) * this.bgStep) t.y -= span; // wrap to top
      }
    }
  }
}
