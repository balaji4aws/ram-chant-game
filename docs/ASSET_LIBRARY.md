# Ram Chant Journey — Asset Library & Generation Prompts

Single source of truth for game art. **`public/art/` is the source; `dist/` is throwaway build output.**

Style bar (match the existing sheets): warm **chibi Hanuman**, golden crown, red/orange
dhoti, expressive kid-friendly face, soft painterly shading. Ages 4–8.

## 📐 Image specifications (LOCKED)

The game canvas is **480 × 854 px (9:16 portrait)**, scaled to fit any screen.
Two image types are displayed to kids:

| Type | Resolution | Aspect | Format | Purpose |
|---|---|---|---|---|
| **background-images** | **1080 × 1920** | 9:16 (full-bleed) | JPG q≈85, < ~500 KB | the scene BEHIND the hero; scrolls down as Hanuman climbs |
| **lesson-images** | **1080 × 1350** | 4:5 (framed card) | PNG or JPG q≈85, < ~400 KB | shown when a kid COMPLETES a stage (the teaching/reward card) |

**background-images** (one per stage → `stage<N>/bg_*.jpg`):
- Full-bleed 9:16, fills the whole screen. 1080×1920 = 2× logical size, crisp on tablets.
- Key scenery in the lower ~60%, open sky in the upper ~40% (the hero flies through the sky).
- Keep nothing critical in the **top ~130px** (stage title + Save/Exit) or **bottom ~200px**
  (Ram Japa panel + Ram Mudra button) — the HUD overlays those zones.
- Optional richer variant for a long seamless climb: **1080 × 3840** (needs a small code tweak).

**lesson-images** (one per stage → `lessons/lesson<N>.jpg`):
- 4:5 framed card shown centered on stage-complete, with the stage title above + replay below.
- 1080×1350 = 2× the on-screen card size. Keep Hanuman + the lesson line inside the central ~90%.

## How to hand art back to the agent
- Drop files into `public/art/incoming/` (any name) OR re-attach in chat.
- **For anything that must become a cut-out sprite: generate it on a PLAIN WHITE or FLAT
  PALE background** (never a blue-sky/scene background) — that is what makes the automatic
  cut-out clean. The one time this failed was the "flying" pose drawn on blue sky.

---

## ✅ Already have (on disk, sliced & verified)
- `hanuman/` — 8 core poses, 8 expressions, 3 size forms, 7 theme vignettes (26)
- `icons/` — 15 chibi virtue icons
- `stage1/bg_greatleap.jpg`, `stage1/summary_card.jpg` (summary card has a "Rāna" typo)

## ❌ Still needed

### A. Re-send (already generated, never reached disk)
1. **Game asset pack** (poses: Victory/Attacking/Defending/…, collectibles, power-ups, props,
   NPCs, enemies, environment tiles, UI, FX, game-flow icons).
2. **Lesson-1 card** → `lessons/lesson1.jpg`.

### B. Stage backgrounds — 7 total, each 1080×1920 (9:16)
Stage 1 done. Needed: 2–7.

### C. Optional audio (royalty-free ONLY): soft looping devotional bg + a "stage clear" sting.

---

## Ready-to-paste generation prompts

**Shared style suffix** (append to every character/prop prompt):
> cute chibi cartoon style, big friendly eyes, golden crown, soft cel shading, thick clean
> outlines, children's mobile-game art, **plain solid white background, centered, full body
> not cropped, generous empty margin around the figure**, high detail, consistent with a
> chibi Hanuman character set.

### Stage backgrounds (append: "9:16 vertical portrait, 1080x1920, no characters, no text,
### soft dawn light, illustrated children's game background, scenery in lower 60% open sky above")
- **Stage 2 – Searching the Ocean Shore:** vast turquoise ocean, rocky shoreline, distant island silhouette, gulls, morning haze.
- **Stage 3 – The Forest of Clues:** lush green forest canopy, sun shafts, winding path, friendly foliage.
- **Stage 4 – Approaching Lanka (Dusk):** ocean at sunset, a golden fortress-city skyline far across the water.
- **Stage 5 – Lanka by Night:** moonlit dark-blue palace towers, lantern glow, starry sky, mysterious but not scary.
- **Stage 6 – The Ashoka Grove:** serene garden with ashoka trees, blossoms, a calm clearing, gentle light.
- **Stage 7 – Return to Rāma (Triumphant Dawn):** radiant sunrise over Ayodhyā temples, banners, golden glow of homecoming.

### Missing hero poses (append shared style suffix, white bg)
- **Victory:** chibi Hanuman cheering, both arms raised, huge joyful smile, small sparkles.
- **Meditating / Praying (seated):** eyes closed, palms together, peaceful, seated cross-legged.
- **Attacking / Defending:** dynamic gada swing / shielding pose (for later action stages).

### UI & FX (can also be drawn in code — ask the agent)
- Star, coin, heart/life, correct ✓, wrong ✗, pause, settings, play, level-complete trophy,
  map, checkpoint flag, sparkle, divine-glow — bright, rounded, kid UI.

---

## Naming convention when you save
- Poses → `hanuman/<pose>.png`  · Expressions → `hanuman/expr_<name>.png`
- Stage bg → `stage<N>/bg_<slug>.jpg`  · Lesson cards → `lessons/lesson<N>.jpg`
- Props/collectibles/UI → `library/<category>/<name>.png`
The agent slices multi-item sheets automatically and verifies each cut-out (opacity + edge
guard) before it ships.
