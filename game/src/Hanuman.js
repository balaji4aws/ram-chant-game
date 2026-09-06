// Hanuman — VERTICAL-CLIMB hero (ascends the screen). Faces forward/3-quarter, leaps
// UPWARD between platforms and over descending obstacles (Doodle-Jump / Icy-Tower feel),
// NOT a horizontal runner. NEVER a monkey: dignified divine warrior — crown, gada,
// radiant aura, noble face. Vector slice; premium art swaps in later.

export class Hanuman {
  constructor(scene, x, y) {
    this.scene = scene;
    this.c = scene.add.container(x, y);
    this.glow = 0; this.t = 0;
    this.leapT = 0; // 0 = grounded pose, 1 = mid-leap pose

    this.aura = scene.add.circle(0, -34, 48, 0xf1c40f, 0).setBlendMode(Phaser.BlendModes.ADD);
    this.c.add(this.aura);
    this.g = scene.add.graphics();
    this.c.add(this.g);
    this.baseScale = 1;
  }

  _draw(leaping) {
    const g = this.g; g.clear();
    const spread = leaping ? 1 : 0; // legs/arms spread when leaping up

    // AURA already separate. TAIL curled up behind
    g.lineStyle(8, 0xb5651d, 1);
    g.beginPath(); g.moveTo(-16, -22); g.lineTo(-30, -48);
    g.arc(-22, -52, 10, Math.PI * 0.9, Math.PI * -0.3, false); g.strokePath();

    // LEGS — together+down when leaping up, slight stance when settling
    g.lineStyle(11, 0xc8781f, 1);
    const legOut = leaping ? 4 : 10;
    g.beginPath(); g.moveTo(-3, -34); g.lineTo(-legOut, 2); g.strokePath();
    g.beginPath(); g.moveTo(3, -34); g.lineTo(legOut, 2); g.strokePath();
    g.fillStyle(0x8a5a12, 1); g.fillEllipse(-legOut, 2, 9, 4); g.fillEllipse(legOut, 2, 9, 4);

    // DHOTI
    g.fillStyle(0xc0392b, 1); g.fillRoundedRect(-15, -48, 30, 18, 5);
    // TORSO upright (facing viewer, ascending)
    g.fillStyle(0xe2861f, 1); g.fillEllipse(0, -64, 28, 38);
    g.fillStyle(0xf1c40f, 1); g.fillCircle(0, -64, 5);

    // ARMS — raised high when leaping (reaching up), gada in right hand
    g.lineStyle(10, 0xe2861f, 1);
    const armUp = leaping ? 22 : 8;
    g.beginPath(); g.moveTo(-11, -72); g.lineTo(-20, -72 - armUp); g.strokePath();
    g.beginPath(); g.moveTo(11, -72); g.lineTo(22, -72 - armUp); g.strokePath();
    // gada in right hand
    g.lineStyle(5, 0x8a5a12, 1); g.beginPath(); g.moveTo(22, -72 - armUp); g.lineTo(30, -86 - armUp); g.strokePath();
    g.fillStyle(0xf1c40f, 1); g.fillCircle(32, -90 - armUp, 8);
    g.fillStyle(0xffe9a8, 1); g.fillCircle(29, -93 - armUp, 3);

    // HEAD (noble human-divine, facing viewer)
    g.fillStyle(0xe2861f, 1); g.fillRect(-5, -86, 10, 8);
    g.fillCircle(0, -98, 14);
    g.fillStyle(0xf0a24a, 1); g.fillCircle(2, -98, 10);
    g.fillStyle(0x2b1a08, 1); g.fillCircle(-4, -99, 1.7); g.fillCircle(6, -99, 1.7);
    g.fillStyle(0xc0392b, 1); g.fillRect(0.5, -107, 2, 7); // tilak
    // CROWN
    g.fillStyle(0xf1c40f, 1);
    g.beginPath();
    g.moveTo(-13, -107); g.lineTo(-13, -115); g.lineTo(-6, -110);
    g.lineTo(0, -120); g.lineTo(6, -110); g.lineTo(13, -115); g.lineTo(13, -107);
    g.closePath(); g.fillPath();
    g.fillStyle(0xc0392b, 1); g.fillCircle(0, -114, 2.4);
  }

  setGlow(v) { this.glow = Phaser.Math.Clamp(v, 0, 1); }

  // The SCENE controls this.c.x/y (position/leap). update() only handles pose + aura.
  update(dt, ascending, leapAmount = 0) {
    this.t += dt;
    this.leapT += ((ascending ? leapAmount : 0) - this.leapT) * Math.min(1, dt * 10);
    this._draw(this.leapT > 0.3);
    const pulse = 0.5 + 0.5 * Math.sin(this.t * 6);
    this.aura.setAlpha(this.glow * (0.2 + 0.22 * pulse));
    this.aura.setScale(0.9 + this.glow * 0.4);
    this.c.setScale(this.baseScale * (1 + this.glow * 0.08));
  }
}
