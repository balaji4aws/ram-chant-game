# Ram Chant Journey

A free, voice-controlled devotional web + PWA game for young children (ages 4–8).
The child chants **"Ram"** into the mic to power Hanuman up through the 7 stages of the
Sundara Kanda (Mahābhārata Tātparya Nirnaya, Ch. 7). Purpose: build a joyful chanting
habit, teach Jñāna + Bhakti. Personal project — deploys to Venky's own AWS account.

## Project layout

```
ram-chant-game/
├── game/                    ← THE APP (Phaser 3 + Vite). This is what ships.
│   ├── src/                 game code (Stage1Scene, WordChant, Fx, Hanuman, …)
│   ├── public/              static assets served as-is
│   │   ├── art/             game art — sliced sprites go here (see docs/ASSET_LIBRARY.md)
│   │   │   ├── hanuman/     hero pose sprites + expression sprites (transparent PNG)
│   │   │   ├── icons/        chibi virtue icons
│   │   │   ├── stage1/       stage-1 background + cards
│   │   │   ├── lessons/      per-stage lesson reward cards
│   │   │   └── incoming/     drop fresh art here for the agent to slice
│   │   ├── icons/            PWA launcher icons (192/512 + maskable)
│   │   ├── manifest.webmanifest   PWA manifest
│   │   └── sw.js             service worker (offline)
│   ├── _tools/              dev-only asset slicing scripts (gitignored)
│   ├── index.html           app shell + PWA install button
│   └── package.json
│
├── assets-source/          ← SOURCE art & audio (NOT shipped; the raw material)
│   ├── art-sheets/          the generated multi-item art sheets (sliced into game/public/art)
│   └── audio/
│       ├── japa-track/       full "Rama Rama Japa 1008+" track (mp3/m4a/opus/webm/wav/flac)
│       └── voice-samples/    good/bad chant clips for tuning voice detection
│
├── docs/                   design + reference docs
│   ├── ASSET_LIBRARY.md     asset manifest + image-generation prompt pack
│   └── Sundarakanda_Nirnaya_*.md   scripture source (pending achari/pandit review)
│
└── dev/                    dev tools not part of the app
    └── voice-testbench/     standalone Web Speech recognition test page
```

## Run / build the game
```bash
cd game
npm install
npm run dev        # dev server (localhost)
npm run build      # production build -> game/dist/
npm run preview    # serve the production build
```

## Notes
- **Source of truth for art** is `game/public/art/`. `game/dist/` is throwaway build output.
- Fresh art sheets live in `assets-source/art-sheets/`; the agent slices them into
  `game/public/art/` with an opacity + edge guard (cut-outs need a WHITE background).
- PWA install + mic need HTTPS or localhost (secure context).
- Scripture docs are ingested but PENDING achari/pandit review before public release.

हरे श्रीनिवास
