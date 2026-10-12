// Ram Chant Journey — central design constants + the 7-stage table.
// Stage data is grounded in Sundarakanda Nirnaya (MBTN Ch.7, Srimadhwacharya).
// NOTE: narrative/teachings are a study-grade paraphrase; to be SWAPPED for an
// achari/pandit-reviewed version later. See knowledge/sundarakanda_mbtn_ch7_source.md.

// App font — a single Ember-like stack used everywhere (Nunito Sans is a free,
// ship-anywhere match for Amazon Ember; if a device HAS Ember it's used first).
export const FONT = '"Amazon Ember","Nunito Sans",system-ui,-apple-system,sans-serif';

export const PALETTE = {
  saffron: 0xe2861f,
  deepRed: 0xc0392b,
  gold: 0xf1c40f,
  ink: 0x2b1a08,
  night: 0x160c2b,
  cream: 0xfff3dd,
};

// Design-reference tempo from the master chant recording (~0.38s/chant).
export const REF_IOI = 0.38;

// The 7 stages: each has a game-style TITLE / PURPOSE / THEME, a verse anchor,
// a one-line teaching (voiced at the stage-end blessing), a chant target, and a
// visual signature. Targets escalate to entice then challenge; 6 & 7 = 1008 (holy).
export const STAGES = [
  {
    id: 1,
    title: 'The Great Leap',
    emoji: '🌺',
    themeTitle: 'Start with Rāma',
    subtitle: 'Hanumān Begins by Remembering Rāma.',
    purpose: 'Learn the chant — Hanuman grows mighty and leaps across the ocean.',
    theme: 'Dawn sky over a vast ocean; the hero rising, mountains falling away below.',
    verse: '7.1–7.2',
    teaching: 'Begin every task by remembering Rama.',
    target: 11,
    palette: { top: 0x2a1a4a, mid: 0xe28a4a, low: 0x0e6b8c, accent: 0xf1c40f },
  },
  {
    id: 2,
    title: 'Mount of Gold',
    emoji: '🎯',
    themeTitle: 'Stay on Your Mission',
    subtitle: 'Hanumān Cannot Be Distracted from His Mission.',
    purpose: 'A golden mountain rises to offer rest — bow, and fly on.',
    theme: 'Radiant gold peak (Mainaka) breaking the sea; glittering light.',
    verse: '7.3–7.4',
    teaching: 'Gratitude makes us want to help others.',
    target: 21,
    palette: { top: 0x1a2a4a, mid: 0xf1c40f, low: 0x0e6b8c, accent: 0xfff3dd },
  },
  {
    id: 3,
    title: "Surasa's Gate",
    emoji: '💪🏼',
    themeTitle: 'Use Strength Wisely',
    subtitle: 'Hanumān Knows When to Become Huge — and When to Become Small.',
    purpose: 'A giant mouth blocks the way — turn tiny and slip through.',
    theme: 'A vast cavern-mouth; the hero shrinks to a spark of light and passes.',
    verse: '7.5–7.6',
    teaching: 'Cleverness can solve what force cannot.',
    target: 66,
    palette: { top: 0x2b0f1a, mid: 0x7a2f3a, low: 0x160c2b, accent: 0xf1c40f },
  },
  {
    id: 4,
    title: "Simhika's Shadow",
    emoji: '💍',
    themeTitle: 'Carry Trust Faithfully',
    subtitle: 'Hanumān Finds Sītā — and Becomes the Perfect Messenger.',
    purpose: 'A shadow-catcher tries to hold him — steady chanting breaks free.',
    theme: 'A dark grasping shadow over moonlit sea vs. the hero’s radiance.',
    verse: '7.7–7.8',
    teaching: 'Face each problem the right way — think, then act.',
    target: 108,
    palette: { top: 0x0b1030, mid: 0x24304a, low: 0x05060f, accent: 0xe2861f },
  },
  {
    id: 5,
    title: 'Finding Sita',
    emoji: '🦁',
    themeTitle: 'Think Beyond the Task',
    subtitle: 'Hanumān Decides to Show Laṅkā Who He Is.',
    purpose: 'Search the moonlit garden of Lanka and find Mother Sita.',
    theme: 'Quiet night Ashoka grove; lanterns, the Simsupa tree, gentle search.',
    verse: '7.9–7.13',
    teaching: 'Never give up — keep going and you will find your goal.',
    target: 216,
    palette: { top: 0x0a1226, mid: 0x1f3d5c, low: 0x0a1a2e, accent: 0xf1c40f },
  },
  {
    id: 6,
    title: 'The Garden Guardians',
    emoji: '🔥',
    themeTitle: 'Find the Opportunity',
    subtitle: 'Hanumān Turns Even Capture into an Opportunity.',
    purpose: 'Clear the way, calm and unstoppable — guardians turn to light.',
    theme: 'Bursts of light dissolving obstacles into golden dust (non-violent).',
    verse: '7.16–7.35',
    teaching: 'Stay calm and steady, even when it is hard.',
    target: 1008,
    palette: { top: 0x1a0f2e, mid: 0xc0392b, low: 0x2a1207, accent: 0xf1c40f },
  },
  {
    id: 7,
    title: 'Fire & the Journey Home',
    emoji: '🙏',
    themeTitle: 'Serve Without Pride',
    subtitle: "Hanumān's Greatness Ends in Service — and Rāma's Grace.",
    purpose: 'A blessing of light fills the sky — fly home to Rama’s embrace.',
    theme: 'Warm golden fire-light (never scary), triumphant return, a loving embrace.',
    verse: '7.42–7.50',
    teaching: 'Offer your best work back to God with love.',
    target: 1008,
    palette: { top: 0x2a1a08, mid: 0xf1c40f, low: 0xe2861f, accent: 0xfff3dd },
  },
];

export const TOTAL_TARGET = STAGES.reduce((a, s) => a + s.target, 0); // 2438
