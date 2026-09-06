// WordChant — kid-friendly "Rāma" chant detection via the browser Web Speech API.
//
// WHY THIS IS FUZZY: English-tuned engines mis-hear a chanted "Ram/Rama" as
// acoustic COUSINS — "wrong", "run", "rum", "rome", "rang", "rahm", "drum", "brahm",
// "om", "one", "ma"… A strict token list rejects a child who IS chanting correctly.
// So we match on phonetic SHAPE (the "r/w + open-vowel + m/n/ng" family) plus a
// list of known mishearings. Per the game's ethic: be GENEROUS — accept an earnest
// attempt, never reject a real chant. Better a rare false-accept than a frustrated kid.
//
// Contract used by the scene:
//   start()                 -> begins continuous recognition
//   onWord(word)            -> fired once per detected chant
//   onStatus(state)         -> 'listening' | 'stopped' | 'mic-blocked' | 'unsupported' | 'error:*'
//   onHeard(text)           -> the raw transcript (for on-screen feedback)
//   supported (static)      -> is SpeechRecognition available?

// Known direct mis-hearings of a chanted "Rām/Rāma" (lowercased, exact token match).
const RAM_EXACT = new Set([
  'ram','rama','raam','raama','ram','raum','rum','rom','rome','rahm','raham',
  'ramu','ramaa','raama','ramram','ramarama','brahm','bram','drum','rang','ranga',
  'wrong','run','rung','rum','ram','rahm','om','aum','ohm','one','ma','maa','arm','harm',
]);

// Phonetic-shape test: a short token that SOUNDS like "Ram" —
// starts with r (or w, for the "wrong" mishearing), has an open vowel, ~<=6 chars.
function soundsLikeRam(w) {
  if (!w || w.length > 7) return false;
  if (RAM_EXACT.has(w)) return true;
  // r-a/o/u-(m/n/ng) family: ra, ram, raam, rom, run, rang, rahm, rum...
  if (/^r[aou]+[mn]?g?$/.test(w)) return true;      // r + open vowel + optional m/n/ng
  if (/^r[aou]+ma?$/.test(w)) return true;          // rama / raama / roma
  if (/^wr[ao]/.test(w)) return true;               // "wrong"/"wram" mishearing
  return false;
}

// Count how many chant-hits are in a transcript (generous, shape-based).
function countRam(text) {
  const t = (text || '').toLowerCase();
  const words = t.split(/[^a-z]+/).filter(Boolean);
  let n = 0;
  for (const w of words) if (soundsLikeRam(w)) n++;
  return n;
}

export class WordChant {
  static get supported() {
    return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  }

  constructor(onWord, onStatus, onHeard) {
    this.onWord = onWord;
    this.onStatus = onStatus || (() => {});
    this.onHeard = onHeard || (() => {});
    this.running = false;
    this._lastFinalCount = 0;
    this._interimCount = 0;
  }

  start() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { this.onStatus('unsupported'); return false; }
    const r = new SR();
    this.rec = r;
    r.continuous = true;
    r.interimResults = true;
    r.lang = 'en-IN'; // Indian English maps "Ram" a bit better; still falls back fine
    r.maxAlternatives = 6; // see MORE candidate interpretations => more chances to match

    r.onresult = (e) => {
      let finalText = '', interimText = '';
      let finalHits = 0, interimHits = 0;
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const res = e.results[i];
        // scan EVERY alternative; take the MOST hits any alternative gives us.
        // (the top guess may be "wrong wrong" while alt #3 is "ram ram" — accept it)
        let best = 0, bestText = res[0].transcript;
        for (let a = 0; a < res.length; a++) {
          const alt = res[a].transcript;
          const h = countRam(alt);
          if (h > best) { best = h; bestText = alt; }
        }
        if (res.isFinal) { finalText += bestText + ' '; finalHits += best; }
        else { interimText += bestText + ' '; interimHits = Math.max(interimHits, best); }
      }
      // show what was heard (raw top guess is fine for feedback)
      const heard = (interimText || finalText).trim();
      if (heard) this.onHeard(heard);
      // fire on NEW hits seen in interim; dedup against what we already credited
      if (interimHits > this._interimCount) {
        for (let k = this._interimCount; k < interimHits; k++) this.onWord('ram');
        this._interimCount = interimHits;
      }
      if (finalHits) {
        const already = this._interimCount;
        for (let k = already; k < finalHits; k++) this.onWord('ram');
        this._interimCount = 0; // final closes the window
      }
    };
    r.onerror = (ev) => {
      // Web Speech fires 'aborted'/'no-speech'/'network' routinely during the
      // continuous listen loop — these are recoverable and onend restarts us,
      // so DON'T alarm the user. Only surface a genuine, actionable failure.
      const benign = (ev.error === 'aborted' || ev.error === 'no-speech' || ev.error === 'network');
      if (benign) return; // stay quiet; auto-restart handles it
      if (ev.error === 'not-allowed' || ev.error === 'service-not-allowed') {
        this.onStatus('mic-blocked');
      } else {
        this.onStatus('error:' + ev.error);
      }
    };
    r.onend = () => {
      this._starting = false;
      if (this.running) {
        // small backoff avoids Chrome's "recognition already started" race
        setTimeout(() => this._safeStart(), 250);
      }
    };
    this.running = true;
    return this._safeStart();
  }

  _safeStart() {
    if (!this.rec || !this.running && this._started) { /* fresh start below */ }
    if (this._starting) return true;
    this._starting = true;
    try {
      this.rec.start();
      this.running = true;
      this._started = true;
      this.onStatus('listening');
      return true;
    } catch (e) {
      // InvalidStateError => already running; treat as fine
      this._starting = false;
      if (String(e.name) === 'InvalidStateError') { this.running = true; return true; }
      this.onStatus('error:' + e.message);
      return false;
    }
  }

  stop() { this.running = false; if (this.rec) { try { this.rec.stop(); } catch {} } this.onStatus('stopped'); }
}
