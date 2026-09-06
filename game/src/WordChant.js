// WordChant — REAL "Ram" WORD detection via the browser Web Speech API.
// Core rule (Stage-1 basics): hearing "ram"/"rama"/"raam" => one chant (+1, Hanuman
// takes one climb step). ANY OTHER word => ignored (Hanuman does NOT move).
// No rhythm, no energy — pure word gate. Chrome/Edge + Safari (webkit-prefixed).
//
// Contract used by the scene:
//   start()                 -> begins continuous recognition
//   onWord(word)            -> callback fired with a matched "ram" token
//   supported (static)      -> is SpeechRecognition available?
//
// Notes: Web Speech is chunky (fires on interim/final results). We scan the latest
// transcript for NEW "ram" tokens since the last result and fire onWord per new token.

const RAM_WORDS = ['ram', 'rama', 'raam', 'raama', 'raam raam', 'ram ram', 'raum', 'rum'];
// (kept liberal on close phonetic hits so a child isn't rejected; tune later)

function countRam(text) {
  const t = (text || '').toLowerCase();
  // count occurrences of ram-family tokens
  let n = 0;
  const words = t.split(/[^a-z]+/).filter(Boolean);
  for (const w of words) if (RAM_WORDS.includes(w)) n++;
  return n;
}

export class WordChant {
  static get supported() {
    return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  }

  constructor(onWord, onStatus) {
    this.onWord = onWord;
    this.onStatus = onStatus || (() => {});
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
    r.lang = 'en-IN'; // Indian English tends to map "Ram" better; falls back fine
    r.maxAlternatives = 1;

    r.onresult = (e) => {
      let finalText = '', interimText = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const res = e.results[i];
        if (res.isFinal) finalText += res[0].transcript + ' ';
        else interimText += res[0].transcript + ' ';
      }
      // fire on new "ram" tokens as they appear in interim, dedup against final
      if (interimText) {
        const c = countRam(interimText);
        if (c > this._interimCount) { for (let k = this._interimCount; k < c; k++) this.onWord('ram'); this._interimCount = c; }
      }
      if (finalText) {
        // final resets the interim window
        const c = countRam(finalText);
        // any final ram tokens not already counted via interim: emit remainder
        const already = this._interimCount;
        for (let k = already; k < c; k++) this.onWord('ram');
        this._interimCount = 0;
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

  stop() { this.running = false; if (this.rec) { try { this.rec.stop(); } catch {} } }
}
