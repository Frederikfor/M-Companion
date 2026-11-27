// Pad lab: plays each pad in the real app (headless Chromium), records the output and prints where its
// energy sits, band by band. Use it before and after touching PADS, SEC_PAD or the pad chain.
//   node tools/padlab.mjs [--pads atmos,coro] [--mode fifths|chord] [--part intro|estrofa|coro|puente|final]
//                         [--bright 0-100] [--rich 0-100] [--move 0-100] [--out dir] [--secs 10]
// Prints one row per pad: RMS (dBFS) and dB of each band relative to the whole sound. With --out it also
// writes <mode>_<part>_<pad>.wav (16-bit stereo) for listening or plotting. Measures the sustain, 5.5 s on.
// Targets (docs/auditorias/2026-11-27-pads.md): in Estrofa 2–5 kHz between −25 and −15 dB, 5–10 kHz under
// −30 dB (not harsh), RMS between −36 and −32 dB (README §5.5).
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : d; };
const PARTS = ['intro', 'estrofa', 'coro', 'estrofa', 'coro', 'puente', 'coro', 'final'];
const mode = arg('mode', 'fifths'), part = arg('part', 'estrofa'), out = arg('out', ''), secs = +arg('secs', 10);
const at = Math.max(0, PARTS.indexOf(part));
const opts = { bright: arg('bright'), rich: arg('rich'), move: arg('move') };
const BANDS = [['Sub', 20, 60], ['Graves', 60, 120], ['Cuerpo', 120, 300], ['M-bajos', 300, 700], ['Medios', 700, 2000], ['Presencia', 2000, 5000], ['Brillo', 5000, 10000], ['Aire', 10000, 20000]];

function fft(re, im) {
  const n = re.length;
  for (let i = 1, j = 0; i < n; i++) {
    let bit = n >> 1; for (; j & bit; bit >>= 1) j ^= bit; j ^= bit;
    if (i < j) { [re[i], re[j]] = [re[j], re[i]]; [im[i], im[j]] = [im[j], im[i]]; }
  }
  for (let len = 2; len <= n; len <<= 1) {
    const a = -2 * Math.PI / len, wr = Math.cos(a), wi = Math.sin(a), h = len >> 1;
    for (let i = 0; i < n; i += len) {
      let cr = 1, ci = 0;
      for (let k = 0; k < h; k++) {
        const p = i + k, q = p + h, tr = re[q] * cr - im[q] * ci, ti = re[q] * ci + im[q] * cr;
        re[q] = re[p] - tr; im[q] = im[p] - ti; re[p] += tr; im[p] += ti;
        const nr = cr * wr - ci * wi; ci = cr * wi + ci * wr; cr = nr;
      }
    }
  }
}
// Welch power spectrum of the mono mix: Hann windows of 16384 with half overlap.
function bands(L, R, sr, t0, t1) {
  const N = 16384, P = new Float64Array(N / 2), w = Float64Array.from({ length: N }, (_, i) => 0.5 - 0.5 * Math.cos(2 * Math.PI * i / N));
  const a = Math.floor(t0 * sr), b = Math.min(L.length, Math.floor(t1 * sr));
  let frames = 0, sq = 0;
  for (let i = a; i < b; i++) sq += (L[i] * L[i] + R[i] * R[i]) / 2;
  for (let s = a; s + N <= b; s += N / 2, frames++) {
    const re = new Float64Array(N), im = new Float64Array(N);
    for (let i = 0; i < N; i++) re[i] = (L[s + i] + R[s + i]) / 2 * w[i];
    fft(re, im);
    for (let k = 0; k < N / 2; k++) P[k] += re[k] * re[k] + im[k] * im[k];
  }
  const df = sr / N, sum = (lo, hi) => { let e = 0; for (let k = Math.ceil(lo / df); k < Math.min(N / 2, hi / df); k++) e += P[k]; return e; };
  const tot = sum(20, 20000) || 1e-30;
  return { rms: 10 * Math.log10(sq / Math.max(1, b - a) + 1e-20), bands: BANDS.map(([, lo, hi]) => 10 * Math.log10(sum(lo, hi) / tot + 1e-12)) };
}
function wav(file, L, R, sr) {
  const n = L.length, buf = Buffer.alloc(44 + n * 4);
  buf.write('RIFF', 0); buf.writeUInt32LE(36 + n * 4, 4); buf.write('WAVEfmt ', 8); buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(2, 22);
  buf.writeUInt32LE(sr, 24); buf.writeUInt32LE(sr * 4, 28); buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34); buf.write('data', 36); buf.writeUInt32LE(n * 4, 40);
  const c = (x) => Math.max(-32768, Math.min(32767, Math.round(x * 32767)));
  for (let i = 0; i < n; i++) { buf.writeInt16LE(c(L[i]), 44 + i * 4); buf.writeInt16LE(c(R[i]), 46 + i * 4); }
  fs.writeFileSync(file, buf);
}

const html = 'file://' + path.resolve('index.html');
const b = await chromium.launch({ headless: false, args: ['--headless=new', '--autoplay-policy=no-user-gesture-required'] });
const probe = await b.newPage();
await probe.addInitScript(() => localStorage.setItem('acomp', JSON.stringify({ center: 'pad', tourDone: true, tips: false })));
await probe.goto(html);
const all = await probe.$$eval('#padtype option', (os) => os.map((o) => o.value));
await probe.close();
const pads = arg('pads', '') ? arg('pads').split(',') : all;
if (out) fs.mkdirSync(out, { recursive: true });
console.log(`modo ${mode} · parte ${part}` + Object.entries(opts).filter(([, v]) => v != null).map(([k, v]) => ` · ${k} ${v}`).join(''));
console.log('pad'.padEnd(11) + 'RMS'.padStart(7) + BANDS.map(([n]) => n.padStart(10)).join(''));
for (const id of pads) {
  const p = await b.newPage();
  await p.addInitScript(([id, mode, at, o]) => {
    const AC = window.AudioContext;
    window.AudioContext = function () { const c = new AC({ sampleRate: 48000 }); window.__ctx = c; return c; };
    window.AudioContext.prototype = AC.prototype;
    const orig = AudioNode.prototype.connect;
    window.__L = []; window.__R = [];
    AudioNode.prototype.connect = function (t, ...r) {
      const c = window.__ctx;
      if (c && t === c.destination) {
        if (!window.__sp) {
          const sp = c.createScriptProcessor(4096, 2, 2), z = c.createGain(); z.gain.value = 0;
          sp.onaudioprocess = (e) => { window.__L.push(e.inputBuffer.getChannelData(0).slice()); window.__R.push(e.inputBuffer.getChannelData(1).slice()); };
          orig.call(sp, z); orig.call(z, c.destination); window.__sp = sp;
        }
        orig.call(this, window.__sp);
      }
      return orig.call(this, t, ...r);
    };
    const s = { lang: 'es', center: 'pad', tourDone: true, tips: false, pad: id, padMode: mode, padHand: 'manual', held: [0], key: 7, at, countIn: false,
      layers: { shaker: { on: false, vol: 60, side: 'C' }, drums: { on: false, vol: 75, side: 'C' }, pad: { on: true, vol: 50, side: 'C' }, click: { on: false, vol: 60, side: 'L' } } };
    if (o.bright != null) s.padBright = +o.bright; if (o.rich != null) s.padRich = +o.rich; if (o.move != null) s.padMove = +o.move;
    localStorage.setItem('acomp', JSON.stringify(s));
  }, [id, mode, at, opts]);
  await p.goto(html);
  await p.waitForTimeout(1200);
  await p.evaluate(() => { window.__L.length = 0; window.__R.length = 0; });
  await p.click('#play', { force: true });
  await p.waitForTimeout(secs * 1000);
  await p.click('#play', { force: true });
  await p.waitForTimeout(4000);
  const d = await p.evaluate(() => ({ L: window.__L.flatMap((a) => Array.from(a)), R: window.__R.flatMap((a) => Array.from(a)), sr: window.__ctx.sampleRate }));
  await p.close();
  const r = bands(d.L, d.R, d.sr, 5.5, Math.min(secs - 0.2, 9.8));
  console.log(id.padEnd(11) + r.rms.toFixed(1).padStart(7) + r.bands.map((x) => (x < -60 ? '<-60' : x.toFixed(1)).padStart(10)).join(''));
  if (out) wav(path.join(out, `${mode}_${part}_${id}.wav`), d.L, d.R, d.sr);
}
await b.close();
