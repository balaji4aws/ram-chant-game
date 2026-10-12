# On-Device "Rāma" Keyword Spotting — Design & Plan

**Why this exists.** The browser Web Speech API is an English *dictation* engine.
It maps a chanted "Rām/Rāma" to whatever English word sounds closest in the moment
("wrong", "run", "rum", "om"…), so recognition is unreliable and accent-fragile.
The durable fix is a small **Keyword Spotting (KWS)** model that listens for ONE
sound — "Rāma" — and ignores everything else. It runs **entirely on-device**
(no server, offline, private), which also satisfies the game's zero-telemetry /
audio-never-leaves-device rule.

Status: **PLAN** (not built). Current shipping recognizer = the fuzzy Web Speech
matcher in `game/src/WordChant.js` (a pragmatic patch, ~6/10 confidence).

---

## 1. What "good" looks like (acceptance criteria)
- A young child (4–8) chanting "Ram" / "Rama" is detected **≥ ~90%** of clear attempts.
- Rejects non-chant speech/noise (TV, chatter) — few false triggers per minute.
- Works for varied accents & pitches (child + adult), varied mics, some background noise.
- Runs in-browser, **offline**, < ~50 ms per inference, tiny model (< ~1–2 MB).
- Audio **never leaves the device** — mic → model → count, all client-side.
- Graceful: if the model can't load, fall back to today's Web Speech matcher.

---

## 2. Approach — the standard KWS recipe (well-trodden, low-risk)

**2a. Features.** Convert mic audio to **log-Mel spectrograms** (or MFCC) over a
short sliding window (~1 s, ~40 mel bins, 16 kHz). This is the input the model sees.

**2b. Model.** A small CNN over the spectrogram (the classic Google
"Convolutional Neural Networks for Small-footprint KWS" design), OR a lightweight
depthwise-separable CNN (MobileNet-style). Output = 3 classes:
`ram` · `not-ram-speech` · `background/silence`.
Target size: a few hundred K params → sub-2 MB when quantized.

**2c. Run it in the browser.** Two viable runtimes:
- **TensorFlow.js** — train in Python/Keras, convert to TF.js, run in-page. Mature,
  lots of KWS examples (incl. the TF.js "speech-commands" model which is literally
  a browser KWS demo we can fine-tune).
- **ONNX Runtime Web** — train anywhere, export ONNX, run via WASM/WebGL.
TF.js speech-commands is the fastest starting point (it already does mic→spectrogram
→CNN in-browser; we retrain its head on "Ram").

**2d. Training data — the real work.** A KWS model is only as good as its samples:
- **Positives:** many "Ram"/"Rama" utterances — **child voices are the priority**
  (the bullseye). Vary speed, pitch, distance, indoor rooms. Augment with noise,
  pitch/tempo shift, room reverb to multiply a small real set.
- **Negatives:** other words, sentences, TV/music, silence, household noise — so the
  model learns what is NOT a chant.
- Venky already has: reference japa track + good/bad adult + youtube samples in
  `assets-source/audio/voice-samples/`. **We need a CHILD sample set** — the single
  biggest lever on real-world accuracy.

**2e. Tuning knob.** A confidence threshold trades sensitivity vs. false triggers.
Per the game's ethic, bias toward **sensitive** (accept an earnest child), and let
the rhythm/coin layer (later) reward *quality* rather than gating *movement*.

---

## 3. Phased plan (each phase independently shippable)

**Phase 0 — De-risk with the off-the-shelf model (½–1 day).**
Drop in TF.js **speech-commands** as-is (it ships an 18-word English model incl.
close sounds) purely to A/B its mic→spectrogram→CNN pipeline against Web Speech.
Goal: prove the in-browser audio path + latency + PWA offline behavior. Not accurate
for "Ram" yet — this is plumbing validation only.

**Phase 1 — Collect a "Ram" dataset (ongoing, gated on Venky).**
Build a tiny **in-app recorder** (or a standalone page) that captures labeled
"Ram" clips (with consent, stored locally / handed to Venky) — child + adult.
Target a few hundred positives + a few hundred negatives to start; augmentation
expands it 5–10×. This is the critical path; the model waits on data.

**Phase 2 — Train + convert (1–2 days once data exists).**
Train the small CNN in `~/envs/bie-work` (add tensorflow; librosa/torchaudio for
features), evaluate on a held-out set, quantize, export to TF.js/ONNX. Iterate on
threshold. Produce `ram_kws.{json,bin}` (or `.onnx`) + a metrics report.

**Phase 3 — Wire into the game (½ day).**
New `RamKWS.js` behind the SAME interface `WordChant` exposes
(`start / onWord / onStatus / supported`), so `Stage1Scene` doesn't change. Load the
model; on a positive above threshold, fire `onWord('ram')`. If the model fails to
load or the device is weak, fall back to the existing Web Speech matcher. Ship both.

**Phase 4 — Field-tune (ongoing).**
Add mis-fires/misses from real play back into the dataset; retrain. This is how KWS
gets to high confidence — a feedback loop, not a one-shot.

---

## 4. Effort & honest risks
- **Effort:** small-to-moderate. Plumbing (Phase 0/3) is quick. The model itself is a
  standard recipe. **The cost and the risk are the DATA (Phase 1)** — especially
  child voices. No data → no accuracy, regardless of model.
- **Risk: not enough child samples** → model overfits adult voices. Mitigate with
  aggressive augmentation + recruiting a few kids' voices (with parental consent).
- **Risk: device performance** on old phones → keep the model tiny + quantized; the
  Web Speech fallback covers weak devices.
- **Risk: over-sensitive threshold** → false counts. Acceptable per the game's ethic;
  tune with the rhythm/quality layer later.

## 5. What I need from Venky to start
1. **Voice samples** — a batch of "Ram"/"Rama" recordings, **ideally including a
   child** (your kid), in a few settings. This unblocks everything.
2. A yes to add TensorFlow/training deps into `~/envs/bie-work`.
3. Confirmation this stays fully on-device (it will — that's the whole point).

## 6. Where this fits the build sequence
This is the **hardening step** — it does NOT block the "experience + graphics first"
sequence. We can keep building stages on the fuzzy Web Speech recognizer and swap in
the KWS model behind the same interface whenever the dataset is ready. Zero rework
for the rest of the game.

_Maintained by Venky + Kiro. Current recognizer: `game/src/WordChant.js` (Web Speech, fuzzy)._
