# Ram Chant Journey — Game Specification (BRD)

_Personal project (NON-OFFICE, personal AWS only). Owner: Venky. v0.6 — 2026-09-06._
_A graphics-rich, web-deployed (PWA), young-kid devotional CHANTING GAME grounded in the 7-stage Sundara Kanda (MBTN Ch.7)._
_This is GAME development, not app development. Bar = a genuinely engaging, world-class, ETHICALLY-designed kids' game, free to children worldwide._
_Status: SPEC LOCKED (all 9 logical flaws resolved; visual payoff + stage-end blessing added). Remaining items are asset deliveries (§16) + minor art/voice items (§15)._

**Visual payoff (LOCKED, A+B combined):** as the child sustains good-rhythm chanting, **(A) Hanuman himself grows more radiant and powerful** (brighter aura, more majestic flight — "my chanting strengthens Hanuman") **AND (B) the world lights up around him** (sky brightens, diyas/lotuses bloom along the path, dim → golden). Escalates at milestones. The emotional message to a 4–8 child is unmistakable: *when I chant Ram, Hanuman becomes stronger and the world fills with light.*

**Stage-end (LOCKED):** Hanuman **thanks AND blesses the child** — gratitude + a warm blessing (e.g. "May Rama bless you, little one 🙏"), via text bubble + chime + voice line — then invites the child to say "Jai Shri Ram" for the next journey. A special, devotional moment, not just a transition.

---

## 0. LOCKED DIRECTION

**Name:** **"Ram Chant Journey"** (working title). Repo/asset folder: **`/Users/venkyb/Documents/ram-chant-game`** (already exists; holds the reference chant audio).

**Bullseye audience:** **young children ~4–8** (pre-readers / early-readers). Older kids & families can enjoy it, but every decision optimizes for a 4–8-year-old. → coaching is **spoken voice + icons + a little Hanuman guide**, NOT text-dependent.

**Nature & purpose**
- **A GAME, not an app.** World-class, premium graphics. **Must NEVER look like AI slop / cheap prototype.**
- **Purpose = devotional habit-building + transmission.** Get kids to chant "Ram" more, and through play teach **Jñāna (knowledge) + Bhakti (devotion)** and the **Sundara Kanda** (via MBTN Ch.7). The addictive core: *"my Ram chant is literally moving Hanuman and clearing stages"* — devotion made visible.
- **Free forever, worldwide. No monetization, no ads, ever.**

**The journey**
- **7 stages**, the Sundara Kanda per MBTN Ch.7 (§5). Each stage has **distinct art + obstacle elements**.
- **Vertical / portrait, screen scrolls upward** (Candy-Crush-style vertical scroll): Hanuman jumps/climbs/flies upward, world scrolls down past him.

**Controls — VOICE ONLY**
- **Chant "Ram" in good rhythm → Hanuman advances / screen scrolls.** Better rhythm (closer to the reference tune) → **faster** movement + more beauty.
- **LIBERAL COUNTING (LOCKED 2026-09-06):** one "Rama" = **+1, immediately.** A single earnest chant counts — the 12-min reference clip is ONLY the tempo/tune reference for the *rhythm-quality score*, NEVER a threshold to count. Earnest kids always progress. **Rhythm quality is the POLISH layer (tunes Hanuman's speed + how many Ram Mudra coins spawn), NOT the GATE.** The only things that DON'T count: silence, non-voice noise, and clear gibberish (the naughty-kid case).
- **Stop chanting → PURE FREEZE.** Everything pauses in place; **no ground, beads, coins, or dial progress ever lost.** Resume chanting → continues from exactly where he was. (Never punish — flaw #3 resolved: freeze, not slip.)
- **Anti-garble gate (liberal):** gibberish / random noise / silence does **NOT** advance Hanuman. Any earnest voiced Ram-chant DOES. Holds on **iPhone** too.
- **NO typing, NO clicking a word, NO keyboard.** Voice only.

**PRIORITY (LOCKED 2026-09-06):** the recognizer engine is "good enough" once it's **liberal + responsive** — do NOT over-engineer it. The **primary focus for v1 is kid-ADDICTIVE GRAPHICS, juice, and feel** (glowing storybook art, particle payoff, Hanuman growing radiant, world lighting up). The engine serves the graphics, not the reverse.

**No losing**
- **NO "GAME OVER." Hanuman never falls, misses, or loses.** Only variable = how fast/beautifully he moves.
- **Obstacles = chant-gates (flaw #2 resolved, option B):** rocks/fire/the giant mouth etc. are gates Hanuman waits *before* when the child stops/chants badly; they **open and clear only when the child resumes good chanting.** No collision, no damage, no failure — obstacles are *dramatic gates that devotion opens*, reinforcing "chanting carries Hanuman through every difficulty." When the kid stops chanting, obstacles are NOT cleared.

**Progression — escalating targets, resumable (flaws #1 & #6 resolved)**
- Movement is **distance-based**: good-rhythm chanting scrolls the stage; faster good rhythm covers distance faster.
- Each stage has a **target number of good chants** shown to the child, ESCALATING to entice then challenge:
  - **Stage 1 ≈ 11** (very easy, entice), **Stage 2 ≈ 21**, **Stage 3 ≈ 66**, **Stage 4 ≈ 108**, **Stage 5 ≈ 216**, **Stage 6 = 1008**, **Stage 7 = 1008** (holy number; hard).
  - _(Exact mid-stage numbers tunable; 6 & 7 are fixed at 1008. Sum ≈ a meaningful large total — see §7.4.)_
- **A "good chant" only counts (+1) if it matches the reference rhythm** (see §7). Gibberish-fast does NOT increment.
- **Progress is RESUMABLE across sessions** (localStorage): a child chants 150 today, 200 tomorrow; the dial resumes. The big 1008 stages are a **multi-day pilgrimage** — inherently a healthy, no-punishment return hook. **The dial NEVER decreases.**
- **Progress DIAL** (not a percentage number): a circular 360° ring that fills toward the stage target. Universally readable for a 4-year-old (and grandparents). Target number shown near it (top or bottom — final placement in art pass).

**Rewards & counters**
- **Ram Mudra coins (flaw #5 resolved, option A):** coins reward **rhythm excellence** — a sustained streak of near-reference chanting makes coins appear; the steadier the streak, the **more** coins Hanuman collects. If Hanuman **misses a coin** (streak broke / rhythm slipped), the **little Hanuman guide at the top** gently coaches ("chant in rhythm to catch the coins!"). Coins → **earned, non-purchasable cosmetics** (§8.3). Harder to build — deliberately — because the point is to *teach* rhythmic Rama-nama japa.
- **Ram Power:** lifetime running total of good "Ram" chants, saved across sessions — a proud, growing number.

**Character**
- **NEVER a monkey icon/cartoon monkey.** Hanuman = dignified, divine, powerful, kid-appealing warrior (crown, gada/mace, radiant aura, noble face). Consistent across stages with story-accurate **size-shifts** (giant st.1, spark st.3, small st.5). Hard rule.

**Two Hanumans on screen**
1. **Playable Hanuman** — the hero the child moves by chanting.
2. **Little Hanuman guide (top)** — a small companion who **speaks + gestures** (voice + icon, non-text) to coach the child. Next to him: a **"listen 🎵" button** to hear the reference chant tune so kids can copy it. (Never say "gold standard" to kids — just "listen and chant like this.")

**Stage transitions**
- At each stage end, **Hanuman thanks the child**: **text speech-bubble + chime + Hanuman voice line** (e.g. "I found Sita! Say *Jai Shri Ram* for the next journey!").
- **"Jai Shri Ram"** is the special key phrase: it **opens the game** (entry) AND **advances between stages**. (Movement = "Ram"; open/advance = "Jai Shri Ram".)

**Audio (not silent)**
- A **bhajan / kirtan tune bed** plays in stages so kids absorb the chant tune. **Audio-ducking** so it never blocks mic detection; **headphones-recommended** hint; echo handling.
- **Reference chant** (from Venky's recording) available via the **listen 🎵 button**.
- **Eternal chant mode** after stage 7: endless beautiful sky, loops Venky's chant recording, pure chanting for streak + beauty.

**Delivery (flaw #8 resolved)**
- **Web + PWA**, app-like on mobile ("Add to Home Screen," full-screen). **No native Android/iOS.**
- **FAST FIRST LOAD + PROGRESSIVE BACKGROUND LOADING:** open the URL → beautiful loading screen → **Stage 1 playable almost immediately** (load only Stage-1 art + recognizer model + reference clip first); **Stages 2–7 art, eternal-mode audio, cosmetics stream in the background** while the child plays Stage 1; everything cached for offline replay after. Critical for reaching kids on slow/metered data worldwide.
- **Audio shipped compressed** (~12–14MB .m4a/.opus), NOT the 208MB master `.wav` (that stays as the source for rhythm analysis only).
- Offline after first successful load; on iOS, cached assets may occasionally need re-downloading (Safari eviction).

**Tech**
- **iPhones matter** (most US kids use iPhone) → recognition works on iOS via **on-device processing** (§6), no reliance on iOS Web Speech.
- **Engine: Phaser 3 + Vite** (§9). WebGL, particle/glow FX.
- **AI-generated devotional art**, premium/curated, **glowing modern 3D-storybook** style (CoComelon/BabyBus polish); fallback to flat-vector/comic only if that fails. Quality gate: "not AI-slop" review each cycle.
- **Develop locally first** → deploy to **Venky's PERSONAL AWS account** (he supplies creds). **NEVER official Amazon AWS.** (Hard rule.)
- **Amazon-grade security + kids'-privacy** (§12). **Zero telemetry / no PII.**
- **No rush. Work in cycles. Quality over speed.**

---

## 1. One-line pitch

A beautiful **voice-driven devotional game** for young children: say **"Jai Shri Ram"** to begin, then chant **"Ram… Ram… Ram…"** in rhythm to send Hanuman soaring through the 7 stages of the Sundara Kanda — filling a sacred dial, catching Ram Mudra coins, and never, ever losing. Chant like the tune → the world blooms with light. Devotion is the only controller.

---

## 2. Design pillars

1. **Chanting IS the game.** Reward *rhythm quality* + *duration*. Garble is rejected; only real rhythmic Ram counts.
2. **Teach through play:** Jñāna + Bhakti + the Sundara Kanda (MBTN Ch.7), non-violent, kid-safe.
3. **Engaging ETHICALLY** — intrinsic motivation (Competence/Autonomy/Relatedness) + flow + instant feedback. NO dark patterns (§8).
4. **Never punish, never lose.** Freeze on silence; obstacles are gates that open with chanting; the dial never drops.
5. **World-class, web-native, app-like, fast-loading, secure, private.**

---

## 3. Core loop

1. **Entry:** child says **"Jai Shri Ram"** → game opens / stage begins.
2. **Chant "Ram" in rhythm** → Hanuman advances (screen scrolls); each *good* chant = +1 on the dial + Ram Power +1; near-reference streaks spawn **Ram Mudra coins**.
3. **Rhythm quality** sets speed + beauty; **garble/too-fast → not counted**, little Hanuman guide coaches (voice+icon), **listen 🎵** button offers the tune.
4. **Stop → pure freeze** (nothing lost). Obstacles ahead **stay closed** until good chanting resumes.
5. **Dial reaches the stage target** → Hanuman thanks the child (bubble + chime + voice) → child says **"Jai Shri Ram"** → next stage. Progress is **saved/resumable**.
6. After **stage 7** → **eternal chant mode** (endless, Venky's audio loop).

---

## 4. Orientation, platform, loading  [Q1]

- Portrait/vertical, mobile-first, scales to desktop with devotional side-framing.
- PWA (manifest + service worker); installable/full-screen; **fast-first-load + background prefetch** (see §0 Delivery).
- Mic permission on first "Jai Shri Ram."
- **[Q1]** iOS: acceptable to fall back to in-browser Safari tab if installed-PWA mic is unreliable? (Target installed-PWA, fall back gracefully.)

---

## 5. Narrative spine — the 7 stages (SOURCE-GROUNDED)

**Source:** Mahabharata Tatparya Nirnaya, Ch.7 (*Hanumat-pratiyanam*), by Srimadhwacharya — Hanuman's first-person Sundara Kanda (leap → Rama's embrace). Journey: mainland → across the ocean → Lanka → find Sita → pass Ravana's forces → return to Rama.

**In-app attribution (About screen, verbatim):**
> _"Story based on the Mahabharata Tatparya Nirnaya, Chapter 7 (Hanumat-pratiyanam), by Srimadhwacharya."_

| # | Stage | Verse | Kid framing | Distinct elements (chant-gates; auto-resolve in Hanuman's favor) | Target (good chants) | Visual |
|---|---|---|---|---|---|---|
| 1 | **The Great Leap** | 7.1–7.2 | Grows mighty, leaps from the mountain across the ocean | Flying over ocean; rocks/sea-spray; sea-creatures below; Mandara/Mainaka | ~11 (very easy) | Dawn sky, vast ocean |
| 2 | **Mount of Gold** | 7.3–7.4 | Golden Mainaka rises to offer rest — he bows, flies on | Gold peak rises as a gate to rise past | ~21 | Radiant gold mountain |
| 3 | **Surasa's Test** | 7.5–7.6 | Giant mouth opens — Hanuman turns tiny, slips through | Cavern-mouth gate; shrinks to a spark | ~66 | Huge mouth, tiny Hanuman |
| 4 | **Simhika's Shadow** | 7.7–7.8 | Shadow-catcher tries to hold him — he breaks free | Shadow/pull gate; steady chant breaks it | ~108 | Dark shadow vs radiant Hanuman |
| 5 | **Finding Sita** | 7.9–7.13 | Searches Lanka's garden at night, finds Sita | Leaping tree-to-tree, moonlit Ashoka Vana; ends: ring↔Choodamani | ~216 | Moonlit garden, Simshupa tree |
| 6 | **The Garden Guardians** | 7.16–7.35 | Clears the way, calm and unstoppable | Guardians **light up & turn to dust** (NON-VIOLENT) | **1008** (hard; multi-day) | Bursts of light |
| 7 | **Fire & the Journey Home** | 7.42–7.50 | Lights the sky (blessing of light), flies home, gives Rama the Choodamani | Light-fire spectacle, return leap, Rama's embrace | **1008** (hardest; multi-day) | Golden light, embrace |

**Hard framing:** non-violent; Hanuman never harmed/never loses; he *chooses* everything; obstacles are set dressing for the one chant input.

### 5.1 Per-stage teaching (Jñāna delivered at the stage-end blessing)
From the MBTN Ch.7 "Learning" notes (`knowledge/sundarakanda_mbtn_ch7_source.md`). At each stage-end thank+bless, the little Hanuman voices ONE simple teaching (spoken, non-text, for pre-readers):
- **St.1 Great Leap (7.1):** "Begin every task by remembering Rama." 🙏
- **St.2 Mount of Gold (7.3):** "Gratitude makes us want to help others."
- **St.3 Surasa's Test (7.5):** "Cleverness can solve what force cannot."
- **St.4 Simhika's Shadow (7.7):** "Face each problem the right way — think, then act."
- **St.5 Finding Sita (7.10–7.13):** "Never give up — keep going and you will find your goal."
- **St.6 Garden Guardians (7.21–7.34):** "Stay calm and steady, even when it's hard."
- **St.7 Fire & Home (7.43–7.50):** "Offer your best work back to God with love." (Rama embraces Hanuman — the emotional climax.)
- **New source-confirmed beats to weave in:** Lankinī the city-guardian at Lanka's gate (7.9) = a gentle stage-5 gateway; the tail-fire does NOT burn Hanuman because Agni is Vayu's friend (7.43) = frame the fire as warm/protective, never scary; Vibhishana stays Ravana's hand (7.42) = a kindness beat.
- **[Q3d]** Stage title cards: verse ref + one-line story (short; spoken for pre-readers)?

---

## 6. Voice recognition — anti-garble, iOS-included, on-device

**Requirement:** real rhythmic Ram counts; garble doesn't; works on iPhone; voice only; audio never leaves the device.

### 6.1 KWS (plain-language)
**Keyword Spotting** = a tiny in-browser model that listens only for our target sounds (the "Ram" family + "Jai Shri Ram"), on-device (works on iPhone/Android/desktop; private). Like a scoped "wake word."

### 6.2 Architecture (flaw #4 resolved — rhythm-envelope + periodic Ram check)
Measured from the reference `.wav`: **~0.38s between chants (~2.6/sec)** — too fast for reliable word-by-word recognition. So:
- **Rhythm-envelope matching (primary):** detect the child's chant **pulse pattern** (amplitude envelope onsets) and score closeness to the **reference rhythm signature** (the ~0.38s steady pulse). This drives movement + counting at the true fast tempo.
- **Periodic Ram confirmation (anti-garble):** KWS confirms a few times/second that the sounds are genuinely Ram-chanting, not random noise/talking. If it's not Ram-like → doesn't count.
- **Web Audio energy/pitch layer:** instant (<150ms) frame-by-frame motion smoothing.
- **Web Speech API:** optional extra confirmation where available (Chrome/Android); NOT relied on (iOS lacks it).
- Runs **on-device** → private, offline-capable after load.

### 6.3 Accept-list  [Q4]
- Movement/count: **"ram, raam, rama, raama, ram ram"** + close kid-phonetic variants (forgiving for little kids).
- Entry/advance: **"jai shri ram, jai sri ram, jai siya ram, jai ram"**.
- **[Q4]** Confirm + any regional variants.

---

## 7. Rhythm model — the reference tune is the ideal (flaw #4 resolved, option A)

### 7.1 The ideal = the reference chant's own tempo
- Measured reference tempo ≈ **one Ram every ~0.38s (median), IQR ~0.30–0.49s**, ~158/min. **This IS "perfect."** Not "faster is always better" — *matching the tune* is the goal (also keeps recognition reliable).
- The reference is a **rhythm *pattern* within a tolerance band** (steady, evenly-spaced, clear Ram pulses), NOT one rigid BPM — a child slightly slower/faster but steady still scores well (flaw #1-B resolved).

### 7.2 Scoring each moment (LIBERAL — locked)
- **Voice-presence gate first:** is this a genuine voiced chant pulse (not silence/noise/gibberish)? If yes → **it COUNTS (+1), immediately.** One "Rama" = one count. Earnest kids always progress.
- **Rhythm closeness (0–1)** is the POLISH layer, not a gate: it only sets **how fast** Hanuman moves and **how many Ram Mudra coins** spawn. High closeness → fast flight + coin streaks; low closeness → still counts, just slower + no coins + gentle coach. Only silence / non-voice / clear gibberish is rejected (naughty-kid case).

### 7.3 Coaching (voice + icon, non-text — 4–8 bullseye)  [Q5c]
- Little Hanuman guide speaks/gestures only **when off-rhythm**: too slow → "chant a little quicker, like this 🎵"; too fast/garbled → "not too fast — say Ram clearly"; stopped → "chant to help me!". A small persistent rhythm indicator (pulsing icon) shows the beat. **listen 🎵** button plays the reference.
- **[Q5b]** Tempo stays one comfortable band throughout (recommended for 4–8), or nudges up slightly in the 1008 stages?

### 7.4 Target math (escalating; 6 & 7 = 1008)
- Proposed: 11 + 21 + 66 + 108 + 216 + 1008 + 1008 = **2438** total good chants to complete the whole journey. (Mid numbers tunable to land on a chosen holy total, e.g. adjust to sum near 2160 (20×108) or similar — final numbers in a tuning pass; 6 & 7 fixed at 1008.)

---

## 8. Engagement design — ethical hooks, NO dark patterns (research-backed)

Research (Self-Determination Theory; Frontiers in Digital Health 2022; UN Convention on the Rights of the Child): sustainable engagement = **intrinsic motivation + flow + instant feedback**, NOT manipulative dark patterns (documented harms to children). We use the healthy engine; we refuse the manipulative one. For a free devotional kids' game this is both right and a differentiator.

### 8.1 Ethical hooks we USE
- **Competence:** the dial filling; rhythm skill visibly improving flight; escalating beauty at milestones; instant feedback (<150ms) on every good chant.
- **Autonomy:** child chooses to chant; no timers/punishment/forced sessions; replay any stage; eternal mode with zero goal pressure; parent/child-controlled settings.
- **Relatedness/Meaning:** Hanuman *speaks* to the child (warm companion, not a scoreboard); devotional story + tune; earned cosmetics that express the child's own journey.
- **Flow:** one clear action (chant), immediate gorgeous response, gentle difficulty that never blocks the story, no interruptions/notifications.
- **Gentle return reasons:** persistent proud **Ram Power** total; the resumable 1008 pilgrimage (come back to continue, never punished for a gap); new cosmetics to discover.

### 8.2 Dark patterns we REFUSE
❌ loss-aversion/guilt streaks ❌ nagging push notifications ❌ artificial time pressure/FOMO ❌ grinding-for-grinding's-sake ❌ ads/purchases/loot boxes/hidden currencies ❌ data collection/profiling/engagement telemetry on kids ❌ shaming leaderboards. **Test at every milestone: "best interests of the child" (UN CRC).**

### 8.3 Ram Mudra cosmetics (earned, non-purchasable)
Coins (earned via rhythm-excellence streaks) unlock e.g.: radiant **trail colors**; Hanuman **aura/glow themes**; **sky/background palettes** & seasonal skins; **mala bead materials** (rudraksha/gold/crystal).
- **[Q9-detail]** Any must-have cosmetic (e.g. a Diwali diya theme)? Else I design a tasteful set.

---

## 9. Graphics & engine (premium, never AI-slop)

- **Engine: Phaser 3 + Vite** — scenes (7 stages + menus + eternal), sprites, tweens, particles, WebGL glow/bloom, audio, camera; MIT, free, great on mobile.
- **Art: AI-generated, curated devotional**, **glowing 3D-storybook** style (warm saffron/gold, soft depth, rich light — CoComelon/BabyBus polish). Layered + animated in Phaser (parallax, particles, tweens).
- **Hanuman:** dignified divine warrior; **never a monkey**; consistent character with story size-shifts.
- **Quality gate:** every asset passes a "premium / not AI-slop?" review; Venky reviews art in cycles.
- **[Q17-detail]** Any reference images/games whose *look* you love (tightens art direction)?

---

## 10. Audio

- **Stages not silent:** soft bhajan/kirtan bed (**Venky supplies**), audio-ducked vs mic, headphone hint, echo handling.
- **listen 🎵** button: short loop of the reference chant.
- **Eternal mode:** loops **Venky's chant recording**.
- **SFX (toggleable):** chime per good chant, coin sound, milestone "aum," warm swell at Rama's embrace, "Jai Shri Ram" flourish, + Hanuman stage-end voice lines.
- **[Q12-detail]** Provide recorded Hanuman voice lines, or warm TTS placeholder until then?

---

## 11. Build, hosting, deploy

- **Local-first:** Phaser + Vite in `/Users/venkyb/Documents/ram-chant-game`.
- **Deploy:** **Venky's PERSONAL AWS ONLY** (creds at deploy time). **NEVER official Amazon AWS.** Static build → **S3 (private) + CloudFront + OAC + HTTPS**; model/audio as static assets; PWA over HTTPS; fast-first-load + background prefetch.
- Goal: one **public shareable HTTPS URL**, free for all kids.

---

## 12. Security & privacy (Amazon-grade, kids' app)

- **Kids' privacy first (COPPA / GDPR-K / UK AADC mindset):** no personal data, no accounts/login, **zero telemetry**, no third-party trackers/ads/analytics SDKs; progress in **localStorage** only.
- **Audio never leaves the device** (on-device recognition) — stated in a simple child/parent privacy note.
- **Least-privilege AWS:** scoped IAM (not root), private S3 + CloudFront OAC, HTTPS-only, security headers (CSP, HSTS, X-Content-Type-Options, Referrer-Policy, **Permissions-Policy locking mic to self**), SRI on any CDN scripts.
- **Supply-chain:** pinned deps, minimal deps, `npm audit` clean, `.npmrc` pinned to public registry, reputable engine only.
- **No secrets in repo;** `.gitignore` hygiene.
- **Static content;** no user-generated content/chat.
- **Best-interests-of-the-child dark-pattern review** each milestone.

---

## 13. Out of scope for v1

Native apps; accounts/login/cloud-save; multiplayer/leaderboards; ads/monetization/currencies-with-value/telemetry; languages beyond the Ram/Jai-Shri-Ram family; full Valmiki depth beyond the 7 MBTN beats.

---

## 14. Success criteria for v1

- Say "Jai Shri Ram" → opens; rhythmic "Ram" → Hanuman advances <150ms; **garble does NOT move him** — Android AND iPhone.
- Kids **want to keep chanting & return** via ethical hooks (measured only by their own local progress, no tracking).
- All 7 stages completable purely by good chanting; **no "GAME OVER"**; freeze-on-silence; obstacles are chant-gates; dial never drops; 1008 stages resumable.
- Looks **premium** on a phone (not AI-slop); fast first load; app-like install.
- Reverent, non-violent, Hanuman never a monkey, correctly attributed; teaches Jñāna+Bhakti+Sundara Kanda.
- One public HTTPS URL on **personal** AWS; secure; no PII; audio on-device.

---

## 15. Remaining open items (art/voice only — do NOT block the test-bench)

- **[Q1]** iOS in-browser fallback if installed-PWA mic is flaky — OK?
- **[Q3d]** Stage title cards: verse ref + short spoken story — yes?
- **[Q4]** Confirm accept-lists + any regional variants.
- **[Q5b]** One tempo band throughout, or slight speed-up in the 1008 stages?
- **[Q9-detail]** Must-have cosmetic (e.g. Diwali diya theme)?
- **[Q12-detail]** Record Hanuman voice lines, or TTS placeholder for now?
- **[Q17-detail]** Reference images/games whose look you love?

---

## 16. Assets Venky provides

1. ✅ **Reference chant** — `/Users/venkyb/Documents/ram-chant-game/Rama Rama - Japa 1008+.wav` (+ .flac/.mp3/.m4a/.opus/.webm). Analyzed: ~0.38s/chant, ~158/min. (Ship compressed; keep .wav as analysis source.)
2. **Voice samples (SENDING NOW)** — you + your child saying Ram/Rama/Jai Shri Ram; **a gibberish sample** (must be rejected) + **a slightly-slow-but-good sample** (must count). Drop in the same folder; tell me the filenames.
3. **Bhajan/kirtan bed** — background tune for stages (you own / royalty-clear).
4. **Eternal-mode chant** — loop for post-stage-7 (can reuse the reference).
5. **(Optional) Hanuman voice lines** — or approve TTS placeholder.
6. **(Optional) Art references** — visual style you love.
7. **Personal AWS credentials** — at deploy time only (never office AWS).

---

## 17. Build sequence (LOCKED — option C)

**Step 1 — Recognition test-bench FIRST, tuned to Venky's real samples.** A bare page that: takes mic input → rhythm-envelope match to the reference + periodic Ram confirmation → shows "counted ✓ / rejected ✗ / rhythm score" live. **Venky tests on his actual iPhone with his kid.** Tune against the gibberish (reject) + slow-but-good (accept) samples. Prove the soul before any art.
→ Then: Step 2 vertical slice (Stage 1 end-to-end with real art), Step 3 remaining stages, Step 4 cosmetics/eternal mode, Step 5 PWA + fast-load + deploy to personal AWS. Work in cycles; Venky reviews art + feel each cycle.
