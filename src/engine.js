(() => {
  const $ = (id) => document.getElementById(id);
  const METERS = {
    '4/4': { steps: 16, div: 4, dotEvery: 4, strong: [0] },
    '3/4': { steps: 12, div: 4, dotEvery: 4, strong: [0] },
    '6/8': { steps: 12, div: 6, dotEvery: 2, strong: [0, 6] }
  };
  const NAMES = {
    latin: ['Do','Do#','Re','Mib','Mi','Fa','Fa#','Sol','Lab','La','Sib','Si'],
    abc: ['C','C#','D','Eb','E','F','F#','G','Ab','A','Bb','B']
  };
  const SCALE = [0, 2, 4, 5, 7, 9, 11];
  const DEGREES = [
    { d: 0, roman: 'I', minor: false }, { d: 1, roman: 'ii', minor: true },
    { d: 2, roman: 'iii', minor: true }, { d: 3, roman: 'IV', minor: false },
    { d: 4, roman: 'V', minor: false }, { d: 5, roman: 'vi', minor: true }
  ];
  // Harmonic function of each degree, for the chord colours: rest (I, iii, vi), moves away (ii, IV), tension (V).
  const FN = ['rest', 'away', 'rest', 'away', 'tense', 'rest'];

  // ---------- Rhythm styles ----------
  // One character per step: X strong, x normal, o soft, g ghost, . silence.
  // 4/4 = 16 sixteenths, 3/4 = 12 sixteenths, 6/8 = 12 sixteenths (two dotted-quarter pulses).
  const STYLES = {
    balada44: { name: 'Balada / Adoración', en: 'Ballad / Worship', meter: '4/4', swing: 0, secs: {
      intro:   { kick: 'x...............', shaker: 'o.x.o.x.o.x.o.x.' },
      estrofa: { kick: 'X.......x.......', rim: '....x.......x...', hat: 'x.o.x.o.x.o.x.o.', shaker: 'goxogoxogoxogoxo' },
      coro:    { kick: 'X.....x.X.x.....', snare: '....X.......X...', hat: 'X.x.X.x.X.x.X...', ohat: '..............x.', tamb: '....x.......x...', shaker: 'goXogoXogoXogoXo' },
      puente:  { kick: 'X.........x.....', snare: '........X.......', hat: 'x...x...x...x...', shaker: 'o.x.o.x.o.x.o.x.' } } },
    pop44: { name: 'Pop / Alabanza movida', en: 'Pop / Upbeat praise', meter: '4/4', swing: 0, secs: {
      intro:   { kick: 'x...x...x...x...', shaker: 'goxogoxogoxogoxo' },
      estrofa: { kick: 'X...x...X...x...', snare: '....x.......x...', hat: 'x.x.x.x.x.x.x.x.', shaker: 'goxogoxogoxogoxo' },
      coro:    { kick: 'X...X...X...X...', snare: '....X.......X...', hat: 'x...x...x...x...', ohat: '..x...x...x...x.', tamb: 'x.x.x.x.x.x.x.x.', shaker: 'gxXxgxXxgxXxgxXx' },
      puente:  { kick: 'X...X...X...X...', shaker: 'o.x.o.x.o.x.o.x.' } } },
    rock44: { name: 'Rock', en: 'Rock', meter: '4/4', swing: 0, secs: {
      intro:   { kick: 'X...............', hat: 'x.x.x.x.x.x.x.x.', shaker: 'o.x.o.x.o.x.o.x.' },
      estrofa: { kick: 'X.....x.X.......', snare: '....X.......X...', hat: 'x.x.x.x.x.x.x.x.', shaker: 'o.x.o.x.o.x.o.x.' },
      coro:    { kick: 'X.x...x.X.x.....', snare: '....X.......X...', ohat: 'X.x.X.x.X.x.X.x.', tamb: '....x.......x...', shaker: 'goXogoXogoXogoXo' },
      puente:  { kick: 'X.......X.......', snare: '........X.......', hat: 'x...x...x...x...', shaker: 'o.x.o.x.o.x.o.x.' } } },
    latino44: { name: 'Latino (tumbao)', en: 'Latin (tumbao)', meter: '4/4', swing: 0, secs: {
      intro:   { conga: 'o..x..o.o..x..x.', shaker: 'x.oxx.oxx.oxx.ox' },
      estrofa: { kick: 'X..x....X..x....', rim: 'x..x..x...x.x...', conga: 'g..x..g.g..x..x.', shaker: 'x.oxx.oxx.oxx.ox' },
      coro:    { kick: 'X..x..X.X..x..X.', snare: '....X.......X...', hat: 'x.x.x.x.x.x.x.x.', conga: 'g..X..g.g..X..X.', tamb: '....x.......x...', shaker: 'X.oxX.oxX.oxX.ox' },
      puente:  { kick: 'X.......X.......', conga: 'x..x..x.........', shaker: 'o.x.o.x.o.x.o.x.' } } },
    reggae44: { name: 'Reggae', en: 'Reggae', meter: '4/4', swing: 0.3, secs: {
      intro:   { rim: '........x.......', hat: '..x...x...x...x.', shaker: '..x...x...x...x.' },
      estrofa: { kick: '........X.......', rim: '........X.......', hat: 'x.x.x.x.x.x.x.x.', shaker: '..x...x...x...x.' },
      coro:    { kick: 'X...X...X...X...', rim: '....X.......X...', hat: 'x...x...x...x...', ohat: '..x...x...x...x.', shaker: 'goXogoXogoXogoXo' },
      puente:  { kick: '........X.......', rim: '........X.......', hat: 'x...x...x...x...', shaker: '..x...x...x...x.' } } },
    shuffle44: { name: 'Shuffle / Gospel', en: 'Shuffle / Gospel', meter: '4/4', swing: 0.667, secs: {
      intro:   { kick: 'x...............', shaker: 'X.o.X.o.X.o.X.o.' },
      estrofa: { kick: 'X.....x.X.....x.', snare: '....x.......x...', hat: 'x.o.x.o.x.o.x.o.', shaker: 'X.o.X.o.X.o.X.o.' },
      coro:    { kick: 'X.....x.X.x...x.', snare: '....X.......X...', ohat: 'X.x.X.x.X.x.X.x.', tamb: '....x.......x...', shaker: 'X.x.X.x.X.x.X.x.' },
      puente:  { kick: 'X.......X.......', snare: '........X.......', hat: 'x.o.x.o.x.o.x.o.', shaker: 'X.o.X.o.X.o.X.o.' } } },
    vals34: { name: 'Vals', en: 'Waltz', meter: '3/4', swing: 0, secs: {
      intro:   { kick: 'x...........', shaker: 'x.o.x.o.x.o.' },
      estrofa: { kick: 'X...........', rim: '....x...x...', hat: 'x.o.x.o.x.o.', shaker: 'goxogoxogoxo' },
      coro:    { kick: 'X.....x.....', snare: '....X...X...', ohat: 'X.x.X.x.X.x.', tamb: '....x...x...', shaker: 'goXogoXogoXo' },
      puente:  { kick: 'X...........', snare: '........X...', hat: 'x...x...x...', shaker: 'x.o.x.o.x.o.' } } },
    balada34: { name: 'Balada 3/4', en: 'Ballad 3/4', meter: '3/4', swing: 0, secs: {
      intro:   { kick: 'x...........', shaker: 'o.x.o.x.o.x.' },
      estrofa: { kick: 'X.....x.....', rim: '........x...', hat: 'x.x.x.x.x.x.', shaker: 'goxogoxogoxo' },
      coro:    { kick: 'X.....x.....', snare: '........X...', ohat: 'X.x.X.x.X.x.', tamb: '........x...', shaker: 'goXogoXogoXo' },
      puente:  { kick: 'X...........', snare: '........x...', hat: 'x...x...x...', shaker: 'o.x.o.x.o.x.' } } },
    balada68: { name: 'Balada 6/8', en: 'Ballad 6/8', meter: '6/8', swing: 0, secs: {
      intro:   { kick: 'x...........', shaker: 'x.o.o.x.o.o.' },
      estrofa: { kick: 'X...........', rim: '......x.....', hat: 'x.o.o.x.o.o.', shaker: 'xgogogxgogog' },
      coro:    { kick: 'X.......x...', snare: '......X.....', ohat: 'X.x.x.X.x.x.', tamb: '......x.....', shaker: 'XgogoxXgogox' },
      puente:  { kick: 'X...........', snare: '......x.....', hat: 'x.....x.....', shaker: 'x.o.o.x.o.o.' } } },
    marcha68: { name: 'Marcha 6/8 (más fuerte)', en: 'March 6/8 (stronger)', meter: '6/8', swing: 0, secs: {
      intro:   { kick: 'x...........', hat: 'x.x.x.x.x.x.', shaker: 'x.o.o.x.o.o.' },
      estrofa: { kick: 'X...x.......', snare: '......X.....', hat: 'x.x.x.x.x.x.', shaker: 'xgogogxgogog' },
      coro:    { kick: 'X...x.X...x.', snare: '......X.....', ohat: 'X.x.x.X.x.x.', tamb: 'x.x.x.x.x.x.', shaker: 'XgogoxXgogox' },
      puente:  { kick: 'X.....X.....', snare: '......x.....', hat: 'x.....x.....', shaker: 'x.o.o.x.o.o.' } } },
    soulgospel44: { name: 'Soul Gospel', en: 'Soul Gospel', meter: '4/4', swing: 0, swing16: 0.35, secs: {
      intro:   { kick: 'x...............', clap: '....o.......o...', shaker: 'goxogoxogoxogoxo' },
      estrofa: { kick: 'X......x..x.....', rim: '....x.......x...', hat: 'x.xox.xox.xox.xo', shaker: 'goxogoxogoxogoxo' },
      coro:    { kick: 'X......x..X..x..', snare: '....X.......X...', clap: '....X.......X...', hat: 'x.xox.xox.xox.x.', ohat: '..............x.', tamb: '....x.......x...', shaker: 'gxXxgxXxgxXxgxXx' },
      puente:  { kick: 'X.........x.....', snare: '........X.......', hat: 'x.x.x.x.x.x.x.x.', shaker: 'o.x.o.x.o.x.o.x.' } } },
    gospelworship44: { name: 'Gospel Worship', en: 'Gospel Worship', meter: '4/4', swing: 0, swing16: 0.15, secs: {
      intro:   { kick: 'X...............', clap: '....x.......x...', shaker: 'goxogoxogoxogoxo' },
      estrofa: { kick: 'X.....x...X.....', snare: '....x.......x...', clap: '....x.......x...', hat: 'x.x.x.x.x.x.x.x.', shaker: 'goxogoxogoxogoxo' },
      coro:    { kick: 'X.x...x...X.x...', snare: '....X.......X...', clap: '....X.......X...', hat: 'x...x...x...x...', ohat: '..x...x...x...x.', tamb: 'x.x.x.x.x.x.x.x.', shaker: 'gxXxgxXxgxXxgxXx' },
      puente:  { kick: 'X...X...X...X...', clap: '....x.......x...', shaker: 'o.x.o.x.o.x.o.x.' } } },
    gospel68: { name: 'Soul Gospel 12/8', en: 'Soul Gospel 12/8', meter: '6/8', swing: 0, secs: {
      intro:   { kick: 'x...........', clap: '......o.....', shaker: 'x.o.o.x.o.o.' },
      estrofa: { kick: 'X.........x.', rim: '......x.....', hat: 'x.o.o.x.o.o.', shaker: 'xgogogxgogog' },
      coro:    { kick: 'X.........x.', snare: '......X.....', clap: '......X.....', ohat: 'X.x.x.X.x.x.', tamb: 'x.x.x.x.x.x.', shaker: 'XgogoxXgogox' },
      puente:  { kick: 'X...........', snare: '......x.....', hat: 'x.....x.....', shaker: 'x.o.o.x.o.o.' } } }
  };
  // Shaker patterns you can force over any style. simple = one 4/4 or 3/4 beat, comp = one 6/8 pulse.
  const SHAKERS = {
    auto:         { name: 'Según estilo y parte', en: 'By style and part' },
    corcheas:     { name: 'Corcheas', en: 'Eighths', simple: 'o.X.', comp: 'X.o.o.' },
    semicorcheas: { name: 'Semicorcheas', en: 'Sixteenths', simple: 'goXo', comp: 'Xgogog' },
    galope:       { name: 'Galope', en: 'Gallop', simple: 'X.xx', comp: 'X.xxo.' },
    contra:       { name: 'Contratiempo', en: 'Offbeat', simple: '..X.', comp: '..x.x.' },
    tresillo:     { name: 'Tresillo 3-3-2', en: 'Tresillo 3-3-2', simple: 'X..x..x.', comp: 'X..x..' },
    negras:       { name: 'Solo en el pulso', en: 'On the beat only', simple: 'X...', comp: 'X.....' },
    acento16:     { name: 'Semicorcheas, acento atrás', en: 'Sixteenths, back accent', simple: 'gxoX', comp: 'gogoxX' },
    shuffle:      { name: 'Shuffle', en: 'Shuffle', simple: 'X..x', comp: 'X.xX.x' }
  };
  const V = { X: 1, x: .75, o: .45, g: .25 };
  const DRUMS = ['kick', 'snare', 'rim', 'hat', 'ohat'];
  const SEC_DYN = { intro: .75, estrofa: .85, coro: 1, puente: .9, final: 1 };
  const SEC_SHK = { intro: .7, estrofa: .85, coro: 1, puente: .8, final: 1 };
  const SEC_PAD = { intro: 650, estrofa: 1000, coro: 2300, puente: 800, final: 2300 };
  // ---------- Song structure ----------
  // A song is a list of parts played in order (S.song.seq); each kind of part is defined once (S.song.parts)
  // with its chords as [degree index, length in bars], 0.5 being half a bar. A part lasts its chords rounded up
  // to whole bars, so part changes always land on a bar line (the last chord holds the rest); a part without
  // chords lasts `bars`. Every kind plays with the dynamics, patterns and fills of a base section.
  // The keys are saved with the songs: never rename them.
  const PART_SEC = { intro: 'intro', estrofa: 'estrofa', precoro: 'estrofa', coro: 'coro', puente: 'puente', interludio: 'intro', instrumental: 'coro', tag: 'coro', vamp: 'coro', outro: 'intro', final: 'final' };
  const DEFAULT_SONG = () => ({
    parts: {
      intro: { ch: [[0, 2], [3, 2]] },
      estrofa: { ch: [[0, 2], [4, 1], [5, 1], [3, 2], [0, 1], [4, 1]] },
      coro: { ch: [[3, 1], [0, 1], [4, 1], [5, .5], [3, .5], [3, 1], [0, 1], [4, 2]] },
      puente: { ch: [[5, .5], [3, .5], [0, 1], [5, .5], [3, .5], [4, 1]] },
      final: { ch: [[0, 4]] }
    },
    seq: ['intro', 'estrofa', 'coro', 'estrofa', 'coro', 'puente', 'coro', 'final']
  });
  // Anything saved is checked here, so a broken or older song never breaks the app (songs before 1.6.0 have none).
  function validSong(sg) {
    const out = { parts: {}, seq: [] };
    if (sg && sg.parts && typeof sg.parts === 'object') for (const [k, p] of Object.entries(sg.parts)) {
      if (!PART_SEC[k] || !p || !Array.isArray(p.ch)) continue;
      out.parts[k] = {
        ch: p.ch.filter((c) => Array.isArray(c) && Number.isInteger(c[0]) && DEGREES[c[0]] && c[1] > 0 && c[1] <= 16 && Number.isInteger(c[1] * 2)).slice(0, 32).map((c) => [c[0], c[1]]),
        bars: [1, 2, 4, 8, 16].includes(p.bars) ? p.bars : 4
      };
    }
    if (sg && Array.isArray(sg.seq)) out.seq = sg.seq.filter((k) => out.parts[k]).slice(0, 40);
    return out.seq.length ? out : DEFAULT_SONG();
  }
  const fmtBars = (b) => (b >= 1 ? String(Math.floor(b)) : '') + (b % 1 ? '½' : '');
  // Mix channels; the click is the metronome. Sides: left, centre, right.
  const CHANNELS = ['shaker', 'drums', 'pad', 'click'];
  const PAN = { L: -1, C: 0, R: 1 };
  // Pad colours, grouped by the moment of the service they suit.
  // layers: [wave, detune list in cents, semitone offset, gain]. cutoff multiplies the per-part brightness.
  // Optional: air [gain, Hz] adds breathy filtered noise; formant [[Hz, Q, gain]…] shapes the layers like a choir "ah";
  // trem [Hz, depth] adds a soft volume tremolo, like an electric piano.
  // Pads are rendered with PADsynth (see below); osc: true keeps live oscillators, for keys that are not pads.
  // bw [cents] overrides the band width that PADsynth takes from the detune spread; spread (default .25) is how fast
  // it widens with the harmonic number. tilt darkens the source by h^-tilt (a voice falls faster than a sawtooth).
  // sections: formant scales sung at once (men 1, women ~1.15), which blurs the vowel like a mixed choir.
  const PADS = {
    atmos:     { group: 'Worship', name: 'Supersaw', en: 'Supersaw', layers: [['sawtooth', [-9, 0, 9], 0, .035], ['sine', [0], 12, .029]], cutoff: 1, q: .7, attack: 2.2, release: 2.5, vib: [.25, 4], hall: .9, voicing: 'add9' },
    fundamento:{ group: 'Worship', name: 'Pad cálido', en: 'Warm Pad', layers: [['sawtooth', [-7, 7], 0, .016], ['triangle', [0], -12, .04], ['sine', [0], 12, .01]], cutoff: .7, q: .9, attack: 3, release: 3, vib: [.2, 3], hall: 1, voicing: 'sus2', air: [.032, 3500] },
    aire:      { group: 'Worship', name: 'Pad respiro', en: 'Breath Pad', layers: [['triangle', [-5, 5], 0, .035], ['sine', [0], 12, .02]], cutoff: 1.2, q: .5, attack: 2.5, release: 3, vib: [.15, 4], hall: 1.1, voicing: 'open', air: [.12, 6000] },
    shimmer:   { group: 'Worship', name: 'Shimmer', en: 'Shimmer', layers: [['sine', [-4, 4], 12, .03], ['triangle', [0], 24, .01], ['sawtooth', [-10, 10], 0, .01]], cutoff: 1.6, q: .4, attack: 2.8, release: 3, vib: [.3, 5], hall: 1.2, voicing: 'open' },
    amanecer:  { group: 'Worship', name: 'Swell', en: 'Swell', layers: [['sawtooth', [-14, -5, 5, 14], 0, .043], ['sawtooth', [0], 12, .017]], cutoff: 1.4, q: 1.2, attack: 4, release: 3, vib: [.2, 4], hall: 1, voicing: 'add9' },
    oracion:   { group: 'Oración y ministración', name: 'Senoidal', en: 'Sine', layers: [['sine', [-3, 3], 0, .033], ['triangle', [0], -12, .026]], cutoff: .5, q: .4, attack: 4, release: 4, vib: [.1, 3], hall: 1, voicing: 'sus2' },
    quintas:   { group: 'Oración y ministración', name: 'Quintas', en: 'Power 5th', layers: [['sawtooth', [-6, 6], 0, .015], ['sine', [0], -12, .04]], cutoff: .6, q: .6, attack: 3, release: 3.5, vib: [.15, 3], hall: 1, voicing: 'power', air: [.028, 2500] },
    cristal:   { group: 'Oración y ministración', name: 'Halo', en: 'Halo', layers: [['sine', [0], 12, .034], ['sine', [0], 19, .011], ['triangle', [0], 0, .024]], cutoff: 2.2, q: .3, attack: .4, release: 3, vib: [.2, 4.5], hall: 1.2, voicing: 'open', trem: [3.5, .15] },
    calido:    { group: 'Alabanza', name: 'Triangular', en: 'Triangle', layers: [['triangle', [-6, 6], 0, .031], ['sine', [0], -12, .025]], cutoff: .75, q: .5, attack: 1.2, release: 1.8, vib: [.2, 3], hall: .5, voicing: 'triad' },
    analogico: { group: 'Alabanza', name: 'Polisinte', en: 'Poly Synth', layers: [['sawtooth', [-12, 0, 12], 0, .029], ['square', [-6, 6], -12, .019]], cutoff: 1.1, q: 1.5, attack: .5, release: 1.2, vib: [.6, 6], hall: .5, voicing: 'triad' },
    teclas:    { group: 'Alabanza', name: 'Rhodes', en: 'Rhodes', layers: [['sine', [0], 0, .039], ['triangle', [-3, 3], 12, .01]], cutoff: 1.5, q: .3, attack: .15, release: 1.2, vib: [.1, 2], hall: .5, voicing: 'add9', trem: [4.5, .3], osc: true },
    cuerdas:   { group: 'Himnos y gospel', name: 'Cuerdas', en: 'Strings', layers: [['sawtooth', [-12, -4, 4, 12], 0, .048]], cutoff: .9, q: .6, attack: 1.4, release: 2, vib: [5, 6], hall: .7, voicing: 'triad' },
    coro:      { group: 'Himnos y gospel', name: 'Coro "Aah"', en: 'Choir Aahs', layers: [['sawtooth', [-8, 0, 8], 0, .046]], cutoff: 2.5, q: .3, attack: 1.2, release: 2, vib: [.2, 3], hall: .9, voicing: 'triad', bw: 30, spread: .6, tilt: 1, sections: [1, 1.15], formant: [[750, 6, 1], [1200, 7, .7], [2650, 9, .35], [3400, 10, .15]], air: [.012, 3000] },
    organo:    { group: 'Himnos y gospel', name: 'Gospel B3', en: 'Gospel B3', layers: [['sine', [0], -12, .021], ['sine', [0], 0, .028], ['sine', [0], 12, .021], ['sine', [0], 19, .013], ['sine', [0], 24, .008]], cutoff: 3, q: .3, attack: .06, release: .35, vib: [6.3, 12], hall: .3, voicing: 'gospel7', osc: true }
  };
  const SHK_SETS = {
    small:  { name: 'Shaker pequeño', en: 'Small shaker', down: ['shkH_Down_1', 'shkH_Down_2', 'shkL_Down_1', 'shkL_Down_2'], up: ['shkH_Up_1', 'shkH_Up_2', 'shkL_Up_1', 'shkL_Up_2'] },
    large:  { name: 'Shaker grande', en: 'Large shaker', down: ['lshkDown_1', 'lshkDown_2', 'lshkHit_1', 'lshkHit_2'], up: ['lshkUp_1', 'lshkUp_2'] },
    cabasa: { name: 'Cabasa', en: 'Cabasa', down: ['cabHit_1', 'cabHit_2'], up: ['cabRub_1', 'cabRub_2', 'cabRub_3'] }
  };
  // ---------- Language ----------
  // Every visible text lives here. Data entries (STYLES, SHAKERS, PADS, SHK_SETS) carry their English name in `en`.
  const I18N = {
    es: {
      title: 'Acompañante de Ensayo', 'tab.tocar': 'Tocar', 'tab.ritmo': 'Ritmo', 'tab.sonido': 'Sonido', 'tab.canciones': 'Canciones', tabbar: 'Secciones',
      'song.choose': 'Elegir canción', 'song.label': 'Canción', 'song.none': 'Sin canción guardada', meter: 'Compás', tempo: 'Tempo',
      'status.stopped': 'Detenido', 'status.playing': 'Tocando', 'status.loading': 'Cargando sonidos…',
      'bpm.m1': 'Bajar 1 BPM', 'bpm.m5': 'Bajar 5 BPM', 'bpm.p1': 'Subir 1 BPM', 'bpm.p5': 'Subir 5 BPM',
      'unit.simple': 'BPM', 'unit.comp': 'BPM ♩.', tap: 'Marcar tempo', live: 'Control en vivo', map: 'Mapa de la canción',
      'sec.intro': 'Intro', 'sec.estrofa': 'Estrofa', 'sec.precoro': 'Pre-coro', 'sec.coro': 'Coro', 'sec.puente': 'Puente', 'sec.interludio': 'Interludio',
      'sec.instrumental': 'Instrumental', 'sec.tag': 'Tag', 'sec.vamp': 'Vamp', 'sec.outro': 'Outro', 'sec.final': 'Final',
      'short.intro': 'I', 'short.estrofa': 'E', 'short.precoro': 'PC', 'short.coro': 'C', 'short.puente': 'P', 'short.interludio': 'In',
      'short.instrumental': 'Ins', 'short.tag': 'T', 'short.vamp': 'V', 'short.outro': 'O', 'short.final': 'F',
      fill: 'Remate', 'fill.active': 'Rematando…', 'fill.queued': 'En espera', 'fill.nodrums': 'sin batería', play: 'Tocar', stop: 'Parar',
      'next.small': 'Siguiente', 'next.aria': (p) => 'Siguiente parte: ' + p, counting: 'Conteo…',
      'pad.prev': 'Sonido de pad anterior', 'pad.next': 'Sonido de pad siguiente', 'pad.choose': 'Elegir sonido de pad', 'pad.of': (i, n) => `${i} de ${n}`,
      'dial.aria': (k) => `Tono ${k} mayor. Desliza para cambiar de tono o toca para ver la lista`,
      'fn.rest': 'Reposo', 'fn.away': 'Se aleja', 'fn.tense': 'Tensión', sounding: 'suena',
      'mode.aria': 'Cómo cambia el pad', 'mode.auto': 'Auto', 'mode.manual': 'Manual', 'fifths.short': 'Tónica + 5ª',
      'hint.fifths': 'Tónica + 5ª: el pad no cambia de acorde', 'hint.held': 'Toca para cambiar · mantén uno y toca otro para sumar', 'hint.silent': 'Pad en silencio · toca un acorde',
      style: 'Estilo', 'shaker.pattern': 'Patrón de shaker', 'shaker.sound': 'Sonido del shaker', feel: 'Interpretación', human: 'Toque humano',
      countin: 'Conteo de entrada', autofill: 'Remate automático', 'autofill.0': 'Apagado', 'autofill.4': 'Cada 4 compases', 'autofill.8': 'Cada 8 compases',
      'mic.cap': 'Micrófono · beta', 'mic.listen': 'Escuchar mi tempo', 'mic.follow': 'La base me sigue',
      'mic.hint': 'Te avisa si te aceleras o frenas respecto al tempo marcado.',
      'mic.error': '<span class="alert">No pude abrir el micrófono aquí.</span> Abre la app desde su dirección https o el archivo <b>acompanante.html</b> en Chrome y permite el micrófono.',
      'mic.start': 'Escuchando. Toca unos compases para que mida tu tempo.', 'mic.wait': 'Escuchando…',
      'mic.read': (det, set) => `Detecto <b>${det}</b> BPM · marcado ${set}`, 'mic.fast': 'Te estás acelerando', 'mic.slow': 'Te estás frenando',
      'mic.adjusted': ' · ajusté el tempo', 'mic.suggest': ' · activa "La base me sigue" para que la base te siga', 'mic.ok': 'Vas a tempo.',
      key: 'Tonalidad', 'key.opt': 'Tono', 'pad.sound': 'Sonido del pad', 'pad.fifths': 'Solo tónica y quinta', 'pad.move': 'Movimiento', 'pad.rich': 'Riqueza', names: 'Nombres de notas',
      'pad.foot': 'Movimiento es cuánto ondula el pad; Riqueza, cuántos armónicos acumula y se aplica al soltar. En 50 % cada pad suena como viene. Tónica + 5ª y el modo Manual están en Tocar.',
      mix: 'Mezcla', 'ch.shaker': 'Shaker', 'ch.drums': 'Batería', 'ch.pad': 'Pad', 'ch.click': 'Clic',
      'ch.mute': (c) => `Encender o apagar ${c}`, 'ch.vol': (c) => `Volumen ${c}`,
      pan: 'Paneo', 'pan.center': 'Todo al centro', 'pan.aria': (c) => `Lado de ${c}`, 'side.L': 'Izq', 'side.C': 'Centro', 'side.R': 'Der', 'tag.L': 'IZQ', 'tag.R': 'DER',
      'pan.foot': 'Centro suena por los dos lados. Con el adaptador USB-C y un cable de 3.5 mm a dos plugs, cada lado entra a su propio canal de la mezcladora.',
      'mix.foot': 'Toca el nombre de un canal para encenderlo o apagarlo; también se hace desde Tocar. Clic es el metrónomo. En iPhone quita el modo silencio si no suena.',
      struct: 'Estructura de la canción', 'struct.order': 'Orden', 'struct.parts': 'Partes', 'struct.add': '+ Añadir', 'struct.add.aria': 'Añadir una parte al orden', 'struct.new': '+ Nueva parte',
      'struct.foot.order': 'El orden en que suenan las partes. Toca × para quitar una; Añadir pone una parte al final.',
      'struct.foot.parts': 'Cada parte tiene sus acordes y cuánto dura cada uno. Al tocar, la app pasa sola a la parte siguiente y el pad cambia de acorde cuando termina cada uno.',
      'seq.remove': (p) => 'Quitar ' + p, 'bars.short': 'c.', 'bars.n': (n) => n === 1 ? '1 compás' : n === .5 ? 'medio compás' : `${fmtBars(n)} compases`,
      'dur.half': 'medio', 'dur.one': 'compás', 'dur.many': 'compases',
      'part.tap': 'Toca un acorde para añadirlo', 'part.ask': '¿cuántos compases?', cancel: 'Cancelar', 'part.sounds': 'Así suena', 'part.nochords': 'sin acordes',
      'part.empty': 'Todavía no hay acordes. La parte dura 4 compases y el pad sigue con el que esté sonando.', 'part.remove': (c) => 'Quitar ' + c, 'part.delete': 'Borrar esta parte',
      'part.foot': 'La parte dura lo que suman sus acordes, redondeado al compás. Al tocar, el pad cambia de acorde justo cuando termina cada uno.',
      app: 'App', lang: 'Idioma',
      version: 'Versión', 'version.title': 'Novedades', 'version.installed': 'Versión instalada', 'version.build': 'Compilación', 'version.new': 'Nueva lista',
      'version.foot': 'La app se actualiza sola cuando hay internet. La versión nueva se usa la siguiente vez que la abres.',
      'version.ready': '<span class="ok">Ya se descargó una versión nueva.</span> Cierra la app por completo y vuelve a abrirla para usarla. Lo que suena ahora no se interrumpe.',
      credits: 'Grabaciones de uso libre (CC0): batería acústica de freesound.org; shakers, cabasa, pandero, conga y palmas de la Versilian Community Sample Library.',
      'song.name': 'Nombre de la canción', save: 'Guardar', 'save.foot': 'Guarda el tempo, compás, estilo, tono, pad, shaker y la estructura con sus acordes.', mysongs: 'Mis canciones',
      'songs.foot': 'Toca una canción para cargarla. Pulsa ✕ dos veces para borrarla.',
      'songs.empty': 'Todavía no hay canciones. Ajusta tempo, compás, estilo y tono, escribe el nombre y pulsa Guardar.',
      del: 'Borrar', 'del.aria': (name) => 'Borrar ' + name,
      groups: { 'Worship': 'Worship', 'Oración y ministración': 'Oración y ministración', 'Alabanza': 'Alabanza', 'Himnos y gospel': 'Himnos y gospel' }
    },
    en: {
      title: 'Rehearsal Companion', 'tab.tocar': 'Play', 'tab.ritmo': 'Rhythm', 'tab.sonido': 'Sound', 'tab.canciones': 'Songs', tabbar: 'Sections',
      'song.choose': 'Choose song', 'song.label': 'Song', 'song.none': 'No saved song', meter: 'Time signature', tempo: 'Tempo',
      'status.stopped': 'Stopped', 'status.playing': 'Playing', 'status.loading': 'Loading sounds…',
      'bpm.m1': 'Down 1 BPM', 'bpm.m5': 'Down 5 BPM', 'bpm.p1': 'Up 1 BPM', 'bpm.p5': 'Up 5 BPM',
      'unit.simple': 'BPM', 'unit.comp': 'BPM ♩.', tap: 'Tap tempo', live: 'Live control', map: 'Song map',
      'sec.intro': 'Intro', 'sec.estrofa': 'Verse', 'sec.precoro': 'Pre-chorus', 'sec.coro': 'Chorus', 'sec.puente': 'Bridge', 'sec.interludio': 'Interlude',
      'sec.instrumental': 'Instrumental', 'sec.tag': 'Tag', 'sec.vamp': 'Vamp', 'sec.outro': 'Outro', 'sec.final': 'Ending',
      'short.intro': 'I', 'short.estrofa': 'V', 'short.precoro': 'PC', 'short.coro': 'C', 'short.puente': 'B', 'short.interludio': 'In',
      'short.instrumental': 'Ins', 'short.tag': 'T', 'short.vamp': 'Vp', 'short.outro': 'O', 'short.final': 'E',
      fill: 'Fill', 'fill.active': 'Filling…', 'fill.queued': 'Queued', 'fill.nodrums': 'no drums', play: 'Play', stop: 'Stop',
      'next.small': 'Next', 'next.aria': (p) => 'Next part: ' + p, counting: 'Count-in…',
      'pad.prev': 'Previous pad sound', 'pad.next': 'Next pad sound', 'pad.choose': 'Choose pad sound', 'pad.of': (i, n) => `${i} of ${n}`,
      'dial.aria': (k) => `Key of ${k} major. Swipe to change key or tap for the list`,
      'fn.rest': 'Rest', 'fn.away': 'Moves away', 'fn.tense': 'Tension', sounding: 'on',
      'mode.aria': 'How the pad changes', 'mode.auto': 'Auto', 'mode.manual': 'Manual', 'fifths.short': 'Root + 5th',
      'hint.fifths': 'Root + 5th: the pad does not change chords', 'hint.held': 'Tap to change · hold one and tap another to add', 'hint.silent': 'Pad silent · tap a chord',
      style: 'Style', 'shaker.pattern': 'Shaker pattern', 'shaker.sound': 'Shaker sound', feel: 'Feel', human: 'Human feel',
      countin: 'Count-in', autofill: 'Auto fill', 'autofill.0': 'Off', 'autofill.4': 'Every 4 bars', 'autofill.8': 'Every 8 bars',
      'mic.cap': 'Microphone · beta', 'mic.listen': 'Listen to my tempo', 'mic.follow': 'Backing follows me',
      'mic.hint': 'Warns you if you speed up or slow down against the set tempo.',
      'mic.error': '<span class="alert">Could not open the microphone here.</span> Open the app from its https address, or the <b>acompanante.html</b> file in Chrome, and allow the microphone.',
      'mic.start': 'Listening. Play a few bars so it can measure your tempo.', 'mic.wait': 'Listening…',
      'mic.read': (det, set) => `Hearing <b>${det}</b> BPM · set ${set}`, 'mic.fast': 'You are speeding up', 'mic.slow': 'You are slowing down',
      'mic.adjusted': ' · tempo adjusted', 'mic.suggest': ' · turn on "Backing follows me" so the backing follows you', 'mic.ok': 'You are on tempo.',
      key: 'Key', 'key.opt': 'Key', 'pad.sound': 'Pad sound', 'pad.fifths': 'Root and fifth only', 'pad.move': 'Movement', 'pad.rich': 'Richness', names: 'Note names',
      'pad.foot': 'Movement is how much the pad sways; Richness is how many harmonics it stacks, applied when you let go. At 50 % each pad sounds as designed. Root + 5th and Manual mode are on Play.',
      mix: 'Mix', 'ch.shaker': 'Shaker', 'ch.drums': 'Drums', 'ch.pad': 'Pad', 'ch.click': 'Click',
      'ch.mute': (c) => `Turn ${c} on or off`, 'ch.vol': (c) => `${c} volume`,
      pan: 'Pan', 'pan.center': 'All centred', 'pan.aria': (c) => `${c} side`, 'side.L': 'Left', 'side.C': 'Centre', 'side.R': 'Right', 'tag.L': 'L', 'tag.R': 'R',
      'pan.foot': 'Centre plays on both sides. With the USB-C adapter and a 3.5 mm to two-plug cable, each side goes into its own mixer channel.',
      'mix.foot': 'Tap a channel name to turn it on or off; you can also do it from Play. Click is the metronome. On iPhone, turn off silent mode if there is no sound.',
      struct: 'Song structure', 'struct.order': 'Order', 'struct.parts': 'Parts', 'struct.add': '+ Add', 'struct.add.aria': 'Add a part to the order', 'struct.new': '+ New part',
      'struct.foot.order': 'The order the parts play in. Tap × to remove one; Add puts a part at the end.',
      'struct.foot.parts': 'Each part has its chords and how long each one lasts. While playing, the app moves on to the next part by itself and the pad changes chord as each one ends.',
      'seq.remove': (p) => 'Remove ' + p, 'bars.short': 'bars', 'bars.n': (n) => n === 1 ? '1 bar' : n === .5 ? 'half a bar' : `${fmtBars(n)} bars`,
      'dur.half': 'half', 'dur.one': 'bar', 'dur.many': 'bars',
      'part.tap': 'Tap a chord to add it', 'part.ask': 'how many bars?', cancel: 'Cancel', 'part.sounds': 'How it goes', 'part.nochords': 'no chords',
      'part.empty': 'No chords yet. The part lasts 4 bars and the pad keeps whatever chord is playing.', 'part.remove': (c) => 'Remove ' + c, 'part.delete': 'Delete this part',
      'part.foot': 'The part lasts as long as its chords add up to, rounded to the bar. While playing, the pad changes chord right as each one ends.',
      app: 'App', lang: 'Language',
      version: 'Version', 'version.title': 'What’s new', 'version.installed': 'Installed version', 'version.build': 'Build', 'version.new': 'New one ready',
      'version.foot': 'The app updates itself when there is internet. The new version is used the next time you open it.',
      'version.ready': '<span class="ok">A new version has downloaded.</span> Close the app completely and open it again to use it. What is playing now is not interrupted.',
      credits: 'Free-to-use recordings (CC0): acoustic drums from freesound.org; shakers, cabasa, tambourine, conga and claps from the Versilian Community Sample Library.',
      'song.name': 'Song name', save: 'Save', 'save.foot': 'Saves the current tempo, time signature, style, key, pad, shaker and the structure with its chords.', mysongs: 'My songs',
      'songs.foot': 'Tap a song to load it. Tap ✕ twice to delete it.',
      'songs.empty': 'No songs yet. Set the tempo, time signature, style and key, type a name and tap Save.',
      del: 'Delete', 'del.aria': (name) => 'Delete ' + name,
      groups: { 'Worship': 'Worship', 'Oración y ministración': 'Prayer & ministry', 'Alabanza': 'Praise', 'Himnos y gospel': 'Hymns & gospel' }
    }
  };
  const T = (k, ...a) => { const v = (I18N[S.lang] || I18N.es)[k] ?? I18N.es[k] ?? k; return typeof v === 'function' ? v(...a) : v; };
  const NM = (o) => (S.lang === 'en' && o.en) || o.name;
  function applyLang() {
    document.documentElement.lang = S.lang;
    document.title = T('title');
    document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = T(el.dataset.i18n); });
    document.querySelectorAll('[data-i18n-aria]').forEach(el => el.setAttribute('aria-label', T(el.dataset.i18nAria)));
    document.querySelectorAll('[data-i18n-ph]').forEach(el => el.setAttribute('placeholder', T(el.dataset.i18nPh)));
    $('lang').value = S.lang;
    $('songtitle').textContent = songTitle || T('song.none');
    $('status').textContent = T(playing ? 'status.playing' : 'status.stopped');
    $('play').setAttribute('aria-label', T(playing ? 'stop' : 'play'));
    if (!micOn) $('micmsg').textContent = T('mic.hint');
    setUnit(); setFillUi(); buildStyles(); buildShakers(); buildPadUi(); buildKeys(); buildWin(); drawTiles(); buildMix();
    renderSeq(); renderParts(); tabTo(structTab); drawPos(); drawPart(); renderSongs(); renderVersion();
  }

  // ---------- Version ----------
  // tools/build.py fills CHANGELOG from src/changelog.json (newest first) and BUILD with the content hash
  // that also names the service worker's cache, so what the screen shows is what is cached offline.
  const CHANGELOG = /*CHANGELOG*/[];
  const BUILD = '__BUILD__';
  const RELEASE = CHANGELOG.length ? CHANGELOG[0].version : '';
  let updateReady = false;
  function renderVersion() {
    $('versionval').textContent = updateReady ? T('version.new') : RELEASE;
    $('versionval').classList.toggle('new', updateReady);
    $('vercur').textContent = RELEASE;
    $('verbuild').textContent = BUILD;
    if (updateReady) $('verupdate').innerHTML = T('version.ready'); else $('verupdate').textContent = T('version.foot');
    const date = (d) => { try { return new Date(d + 'T12:00:00').toLocaleDateString(S.lang, { day: 'numeric', month: 'short', year: 'numeric' }); } catch (e) { return d; } };
    const box = $('changelog'); box.textContent = '';
    for (const r of CHANGELOG) {
      const cap = document.createElement('div'); cap.className = 'cap'; cap.textContent = `${r.version} · ${date(r.date)}`;
      const group = document.createElement('div'); group.className = 'group';
      const ul = document.createElement('ul'); ul.className = 'notes';
      for (const n of r[S.lang] || r.es) { const li = document.createElement('li'); li.textContent = n; ul.appendChild(li); }
      group.appendChild(ul); box.append(cap, group);
    }
  }
  // The service worker downloads a new version in the background and takes over the open page.
  // Never reload (it would cut the audio): only say that reopening the app picks it up.
  // After a takeover the new worker has deleted every other cache, so if ours is gone the page is the old one.
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller && window.caches) {
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      caches.keys().then((keys) => {
        updateReady = keys.some(k => k.startsWith('acompanante-')) && !keys.includes(`acompanante-${RELEASE}-${BUILD}`);
        renderVersion();
      }).catch(() => {});
    });
  }
  const firstStyle = (m) => Object.keys(STYLES).find(k => STYLES[k].meter === m);

  const S = {
    bpm: 72, meter: '4/4', at: 0, autoFill: 8,
    key: 7, names: 'latin', chord: 0, style: 'balada44', shaker: 'auto', human: 40, countIn: true,
    pad: 'atmos', padMode: 'chord', padHand: 'auto', held: [0], padMove: 50, padRich: 50, shkSound: 'small',
    // Only the pad on by default; everything in the centre except the click, on the left (the musician's ear).
    layers: { shaker: { on: false, vol: 60, side: 'C' }, drums: { on: false, vol: 75, side: 'C' }, pad: { on: true, vol: 50, side: 'C' }, click: { on: false, vol: 60, side: 'L' } },
    song: DEFAULT_SONG(), follow: false, lang: 'es'
  };
  const LAYERS0 = JSON.parse(JSON.stringify(S.layers));
  try { Object.assign(S, JSON.parse(localStorage.getItem('acomp') || '{}')); } catch (e) {}
  delete S.section; delete S.pending;
  if (!STYLES[S.style] || STYLES[S.style].meter !== S.meter) S.style = firstStyle(S.meter);
  if (!SHAKERS[S.shaker]) S.shaker = 'auto';
  if (!PADS[S.pad]) S.pad = 'atmos';
  const pct = (v) => (Number.isFinite(+v) ? Math.max(0, Math.min(100, Math.round(+v))) : 50);
  S.padMove = pct(S.padMove); S.padRich = pct(S.padRich);
  if (!SHK_SETS[S.shkSound]) S.shkSound = 'small';
  if (!I18N[S.lang]) S.lang = 'es';
  {
    // 1.6.0 added the click channel and the sides. A state saved before it starts with the new defaults
    // (only the pad on) and keeps its volumes.
    const old = S.layers && typeof S.layers === 'object' ? S.layers : {}, fresh = !old.click;
    S.layers = {};
    for (const k of CHANNELS) {
      const L = old[k] || {}, D = LAYERS0[k];
      S.layers[k] = { on: fresh ? D.on : !!L.on, vol: Number.isFinite(+L.vol) ? pct(L.vol) : D.vol, side: PAN[L.side] !== undefined ? L.side : D.side };
    }
  }
  S.song = validSong(S.song);
  if (!Number.isInteger(S.at) || S.at < 0 || S.at >= S.song.seq.length) S.at = 0;
  if (S.padHand !== 'manual') S.padHand = 'auto';
  if (!DEGREES[S.chord]) S.chord = 0;
  S.held = Array.isArray(S.held) ? S.held.filter((c) => Number.isInteger(c) && DEGREES[c]).slice(0, 3) : [S.chord];
  const save = () => { try { localStorage.setItem('acomp', JSON.stringify(S)); } catch (e) {} };

  // Where a song position points: the part at seq index i ('end' is the ending asked from the last part).
  const partLen = (p) => p && p.ch.length ? Math.max(1, Math.ceil(p.ch.reduce((a, c) => a + c[1], 0) - 1e-9)) : (p && p.bars) || 4;
  const seqAt = (i) => S.song.seq[Math.max(0, Math.min(i, S.song.seq.length - 1))];
  const partOf = (i) => S.song.parts[seqAt(i)];
  const secOf = (i) => i === 'end' ? 'final' : PART_SEC[seqAt(i)];
  // After the last part, the last part repeats until Siguiente (the ending) or Stop.
  const nextOf = (i) => i < S.song.seq.length - 1 ? i + 1 : i;
  const partKeys = () => Object.keys(PART_SEC).filter((k) => S.song.parts[k]);
  // Repeated parts get a number ("Coro 2"); the map uses short labels ("C2").
  function partLabel(i, short) {
    const k = S.song.seq[i];
    if (!k) return T('sec.final');
    const n = S.song.seq.filter((x) => x === k).length, nth = S.song.seq.slice(0, i + 1).filter((x) => x === k).length;
    return T((short ? 'short.' : 'sec.') + k) + (n > 1 ? (short ? '' : ' ') + nth : '');
  }

  // ---------- Audio engine ----------
  let ctx, master, buses = {}, pans = {}, meters = {}, countBus, noise, padFilter, padLfo, padVoices = [], hall, hallSend;
  let playing = false, timer = null, rhythmIn;
  const uiQueue = [];

  function initAudio() {
    if (ctx) return;
    try { if (navigator.audioSession) navigator.audioSession.type = 'playback'; } catch (e) {}
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -14; comp.ratio.value = 3;
    master = ctx.createGain(); master.gain.value = 0.9;
    master.connect(comp); comp.connect(ctx.destination);
    const room = ctx.createConvolver(); room.buffer = makeRoom(1.3, 0.008);
    const roomGain = ctx.createGain(); roomGain.gain.value = 0.35;
    room.connect(roomGain); roomGain.connect(master);
    // Each channel: bus (on/off and volume) → panner → out. The reverbs are fed after the panner, so a channel
    // sent to one side keeps its echo on that side and each side can go to its own mixer channel.
    for (const k of CHANNELS) {
      buses[k] = ctx.createGain();
      pans[k] = ctx.createStereoPanner ? ctx.createStereoPanner() : ctx.createGain();
      meters[k] = ctx.createAnalyser(); meters[k].fftSize = 512;
      buses[k].connect(pans[k]); buses[k].connect(meters[k]);
    }
    const sends = { shaker: 0.35, drums: 0.25, pad: 0.12 };
    for (const k of ['shaker', 'drums', 'pad']) {
      pans[k].connect(master);
      const sg = ctx.createGain(); sg.gain.value = sends[k]; pans[k].connect(sg); sg.connect(room);
    }
    // The click skips the compressor, which would duck the other channels on every beat.
    const clickOut = ctx.createGain(); clickOut.gain.value = 0.9; pans.click.connect(clickOut); clickOut.connect(ctx.destination);
    // The count-in always sounds, even with the click channel off, on the click's side.
    countBus = ctx.createGain(); countBus.connect(pans.click);
    padFilter = ctx.createBiquadFilter(); padFilter.type = 'lowpass'; padFilter.frequency.value = (SEC_PAD[secOf(S.at)] || 1000) * PADS[S.pad].cutoff; padFilter.Q.value = PADS[S.pad].q;
    padFilter.connect(buses.pad);
    rhythmIn = ctx.createChannelSplitter(4);
    rhythmIn.connect(buses.shaker, 0); rhythmIn.connect(buses.drums, 1); rhythmIn.connect(buses.click, 2); rhythmIn.connect(countBus, 3);
    hall = ctx.createConvolver(); hall.buffer = makeRoom(5, 0.025);
    hallSend = ctx.createGain(); hallSend.gain.value = PADS[S.pad].hall * 0.6;
    pans.pad.connect(hallSend); hallSend.connect(hall); hall.connect(master);
    const lfo = ctx.createOscillator(); padLfo = ctx.createGain();
    // The slow sweep moves the filter in cents, so it scales with each pad's cutoff and never closes a dark pad.
    lfo.frequency.value = 0.08; padLfo.gain.value = sweepCents(); lfo.connect(padLfo); padLfo.connect(padFilter.detune); lfo.start();
    noise = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const d = noise.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    applyMix();
  }
  function applyMix() {
    if (!ctx) return;
    const t = ctx.currentTime;
    for (const k of CHANNELS) {
      const L = S.layers[k];
      buses[k].gain.setTargetAtTime(L.on ? (L.vol / 100) ** 1.5 : 0, t, 0.05);
      if (pans[k].pan) pans[k].pan.setTargetAtTime(PAN[L.side], t, 0.02);
    }
  }
  function env(g, t, peak, attack, decay) {
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(peak, t + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t + attack + decay);
  }
  function noiseHit(t, bus, type, freq, q, peak, decay) {
    const s = ctx.createBufferSource(); s.buffer = noise;
    const f = ctx.createBiquadFilter(); f.type = type; f.frequency.value = freq; f.Q.value = q;
    const g = ctx.createGain();
    s.connect(f); f.connect(g); g.connect(bus);
    env(g, t, peak, 0.004, decay);
    s.start(t, Math.random() * 0.5); s.stop(t + decay + 0.05);
  }
  function toneHit(t, bus, wave, f0, f1, peak, decay) {
    const o = ctx.createOscillator(); o.type = wave;
    o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(f1, t + decay * 0.8);
    const g = ctx.createGain(); o.connect(g); g.connect(bus);
    env(g, t, peak, 0.003, decay);
    o.start(t); o.stop(t + decay + 0.05);
  }
  // Synthesized fallbacks, used only if a recording cannot be decoded.
  const SYN = {
    kick: (t, v) => { toneHit(t, buses.drums, 'sine', 140, 42, 1.0 * v, 0.45); noiseHit(t, buses.drums, 'lowpass', 1200, 0.7, 0.15 * v, 0.02); },
    snare: (t, v) => { noiseHit(t, buses.drums, 'highpass', 1400, 0.7, 0.55 * v, 0.18); toneHit(t, buses.drums, 'triangle', 220, 160, 0.4 * v, 0.1); },
    rim: (t, v) => { toneHit(t, buses.drums, 'square', 1700, 1500, 0.12 * v, 0.03); noiseHit(t, buses.drums, 'bandpass', 3000, 2, 0.25 * v, 0.03); },
    hat: (t, v) => noiseHit(t, buses.drums, 'highpass', 7500, 0.8, 0.22 * v, 0.045),
    ohat: (t, v) => noiseHit(t, buses.drums, 'highpass', 6800, 0.7, 0.2 * v, 0.32),
    tomH: (t, v) => toneHit(t, buses.drums, 'sine', 240, 170, 0.8 * v, 0.28),
    tomM: (t, v) => toneHit(t, buses.drums, 'sine', 180, 125, 0.8 * v, 0.32),
    tomL: (t, v) => toneHit(t, buses.drums, 'sine', 130, 85, 0.9 * v, 0.38),
    crash: (t, v) => { noiseHit(t, buses.drums, 'highpass', 4500, 0.5, 0.35 * v, 1.8); noiseHit(t, buses.drums, 'bandpass', 8000, 0.8, 0.2 * v, 1.2); },
    shaker: (t, v) => noiseHit(t, buses.shaker, 'bandpass', 6200, 1.2, 0.5 * v, 0.07),
    tamb: (t, v) => { noiseHit(t, buses.shaker, 'bandpass', 9500, 3, 0.5 * v, 0.16); noiseHit(t, buses.shaker, 'highpass', 6000, 0.7, 0.12 * v, 0.06); },
    conga: (t, v) => { toneHit(t, buses.shaker, 'sine', 360, 310, 0.6 * v, 0.2); noiseHit(t, buses.shaker, 'bandpass', 2500, 1, 0.1 * v, 0.02); },
    click: (t, v) => toneHit(t, master, 'sine', v > .8 ? 2000 : 1500, v > .8 ? 1990 : 1490, 0.5 * v, 0.06),
    metro: (t, v) => toneHit(t, buses.click, 'sine', v > .8 ? 2000 : 1500, v > .8 ? 1990 : 1490, 0.5 * v, 0.06)
  };

  // ---------- Real recordings, all CC0: acoustic kit from freesound.org (via Sonic Pi),
  // shaker, tambourine and conga from the Versilian Community Sample Library ----------
  const SAMPLE_DATA = /*SAMPLES*/{};
  // Seconds from the start of each recording to its accent, so the accent lands on the beat.
  const SAMPLE_OFF = {"cabHit_1": 0.003, "cabHit_2": 0.003, "cabRub_1": 0.033, "cabRub_2": 0.033, "cabRub_3": 0.03, "clap_1": 0.048, "clap_2": 0.024, "clap_3": 0.054, "clap_4": 0.03, "congaO_1": 0.024, "conga_1": 0.018, "conga_2": 0.018, "lshkDown_1": 0.075, "lshkDown_2": 0.06, "lshkHit_1": 0.021, "lshkHit_2": 0.021, "lshkUp_1": 0.108, "lshkUp_2": 0.102, "shkH_Down_1": 0.06, "shkH_Down_2": 0.057, "shkH_Up_1": 0.021, "shkH_Up_2": 0.012, "shkL_Down_1": 0.057, "shkL_Down_2": 0.054, "shkL_Up_1": 0.03, "shkL_Up_2": 0.033, "tambHit_1": 0.066, "tambHit_2": 0.048, "tambShk_1": 0.159, "tambShk_2": 0.108};
  const SB = {};
  let samplesReady = null, openHat = null;
  const shakeBufs = { fwd: [], back: [] }, tambBufs = [];
  function b64ToBuf(b64) { const bin = atob(b64), u = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i); return u.buffer; }
  function loadSamples() {
    if (samplesReady) return samplesReady;
    samplesReady = Promise.all(Object.entries(SAMPLE_DATA).map(([k, b64]) => new Promise(res => {
      try { const p = ctx.decodeAudioData(b64ToBuf(b64), b => { SB[k] = b; res(); }, () => res()); if (p && p.catch) p.catch(() => res()); } catch (e) { res(); }
    }))).then(renderShakers);
    return samplesReady;
  }
  // Shaker and tambourine are modelled as many small beads or jingles colliding (PhISEM, Perry Cook),
  // which sounds far more like a real instrument than plain filtered noise.
  function phisem(dur, o) {
    const sr = ctx.sampleRate, n = Math.floor(dur * sr), out = new Float32Array(n);
    const k = 22050 / sr, sd = Math.pow(o.soundDecay, k), sys = Math.pow(o.systemDecay, k), prob = o.objects / 1024 * k;
    const att = Math.max(1, Math.floor(o.attack * sr));
    const fs = o.res.map(([f, r, g]) => ({ a1: -2 * r * Math.cos(2 * Math.PI * f / sr), a2: r * r, g, y1: 0, y2: 0 }));
    let energy = 0, level = 0, peak = 0;
    for (let i = 0; i < n; i++) {
      if (i < att) energy += 1 / att; else energy *= sys;
      if (Math.random() < prob) level += energy * (0.5 + Math.random());
      const x = level * (Math.random() * 2 - 1);
      level *= sd;
      let y = 0;
      for (const f of fs) { const yy = x - f.a1 * f.y1 - f.a2 * f.y2; y += f.g * (yy - f.y2); f.y2 = f.y1; f.y1 = yy; }
      out[i] = y; if (Math.abs(y) > peak) peak = Math.abs(y);
    }
    const tail = 0.012 * sr;
    for (let i = 0; i < n; i++) out[i] = out[i] / (peak || 1) * 0.9 * Math.min(1, (n - i) / tail);
    const buf = ctx.createBuffer(1, n, sr); buf.getChannelData(0).set(out); return buf;
  }
  function renderShakers() {
    for (let i = 0; i < 4; i++) {
      shakeBufs.fwd.push(phisem(0.18, { objects: 64, soundDecay: 0.95, systemDecay: 0.9985, attack: 0.008 + Math.random() * 0.006, res: [[4700 + Math.random() * 400, 0.93, 1], [9000, 0.8, 0.4]] }));
      shakeBufs.back.push(phisem(0.15, { objects: 44, soundDecay: 0.95, systemDecay: 0.998, attack: 0.02 + Math.random() * 0.01, res: [[3900 + Math.random() * 400, 0.93, 1], [8000, 0.8, 0.3]] }));
      tambBufs.push(phisem(0.4, { objects: 32, soundDecay: 0.95, systemDecay: 0.9985, attack: 0.004, res: [[2300, 0.96, 0.4], [5600 + Math.random() * 200, 0.997, 1], [8100 + Math.random() * 200, 0.997, 0.9]] }));
    }
  }
  function playBuf(b, t, gain, bus, o = {}) {
    if (!b) return null;
    const s = ctx.createBufferSource(); s.buffer = b;
    s.playbackRate.value = (o.rate || 1) * (1 + (Math.random() * 2 - 1) * 0.012);
    const g = ctx.createGain(); g.gain.value = gain;
    let node = s;
    if (o.hp) { const f = ctx.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = o.hp; s.connect(f); node = f; }
    node.connect(g); g.connect(bus);
    const now = ctx.currentTime, at = t - (o.off || 0);
    if (at >= now) s.start(at); else s.start(now, Math.min(b.duration - 0.01, now - at));
    if (o.len) { g.gain.setValueAtTime(gain, t + o.len * 0.6); g.gain.linearRampToValueAtTime(0.0001, t + o.len); s.stop(t + o.len + 0.02); }
    return { s, g };
  }
  const play = (name, t, gain, bus, o = {}) => playBuf(SB[name], t, gain, bus, { off: SAMPLE_OFF[name] || 0, ...o });
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const vel = (v) => Math.pow(v, 1.6);
  function choke(t) {
    if (!openHat) return;
    try { openHat.g.gain.cancelScheduledValues(t); openHat.g.gain.setTargetAtTime(0.0001, t, 0.02); openHat.s.stop(t + 0.15); } catch (e) {}
    openHat = null;
  }
  const INST = {
    kick: (t, v) => play(v > .7 ? 'kickH' : 'kickS', t, vel(v) * 1.1, buses.drums) || SYN.kick(t, v),
    snare: (t, v) => play(v > .55 ? 'snareH' : 'snareS', t, vel(v) * (v > .55 ? .8 : 1.4), buses.drums) || SYN.snare(t, v),
    rim: (t, v) => play('snareS', t, vel(v) * 1.1, buses.drums, { rate: 1.5, hp: 1200, len: 0.09 }) || SYN.rim(t, v),
    hat: (t, v) => { choke(t); return play(v < .3 ? 'pedal' : 'hat', t, vel(v) * .75, buses.drums) || SYN.hat(t, v); },
    ohat: (t, v) => { choke(t); const r = play('ohat', t, vel(v) * .5, buses.drums, { len: 1.1 }); if (r) openHat = r; else SYN.ohat(t, v); },
    tomH: (t, v) => play('tomH', t, vel(v) * .8, buses.drums) || SYN.tomH(t, v),
    tomM: (t, v) => play('tomM', t, vel(v) * .8, buses.drums) || SYN.tomM(t, v),
    tomL: (t, v) => play('tomL', t, vel(v) * .85, buses.drums) || SYN.tomL(t, v),
    crash: (t, v) => play('crash', t, vel(v) * .55, buses.drums) || SYN.crash(t, v),
    conga: (t, v) => play(v > .85 ? 'congaO_1' : pick(['conga_1', 'conga_2']), t, vel(v) * .7, buses.shaker)
      || play('tomHs', t, vel(v) * 1.2, buses.shaker, { rate: 1.7, len: 0.25 }) || SYN.conga(t, v),
    shaker: (t, v) => play(pick(v >= .7 ? SHK_SETS[S.shkSound].down : SHK_SETS[S.shkSound].up), t, vel(v) * .55, buses.shaker)
      || (shakeBufs.fwd.length ? playBuf(pick(v >= .7 ? shakeBufs.fwd : shakeBufs.back), t, vel(v) * .45, buses.shaker) : SYN.shaker(t, v)),
    tamb: (t, v) => play(v >= .6 ? pick(['tambHit_1', 'tambHit_2']) : pick(['tambShk_1', 'tambShk_2']), t, vel(v) * .5, buses.shaker)
      || (tambBufs.length ? playBuf(pick(tambBufs), t, vel(v) * .4, buses.shaker) : SYN.tamb(t, v)),
    clap: (t, v) => play(pick(['clap_1', 'clap_2', 'clap_3', 'clap_4']), t, vel(v) * .6, buses.shaker) || SYN.rim(t, v),
    click: SYN.click,
    metro: SYN.metro
  };
  // Synthetic room: a short pre-delay, a few early reflections, then a diffuse tail whose highs die
  // sooner than its lows, as in a real hall. Each channel gets its own noise so the room is wide.
  function makeRoom(sec, pre) {
    const sr = ctx.sampleRate, p0 = Math.floor(pre * sr), n = p0 + Math.floor(sec * sr), b = ctx.createBuffer(2, n, sr);
    const rt = sec * 0.8;
    for (let ch = 0; ch < 2; ch++) {
      const d = b.getChannelData(ch); let lp = 0, dc = 0;
      for (let i = p0; i < n; i++) {
        const t = (i - p0) / sr, c = 0.08 + 0.85 * Math.exp(-3.5 * t / sec);
        lp += c * ((Math.random() * 2 - 1) - lp); dc += 0.0005 * (lp - dc);
        d[i] = (lp - dc) * Math.exp(-6.9 * t / rt) * Math.min(1, t / 0.03);
      }
      for (let k = 0; k < 6; k++) d[p0 + Math.floor((0.003 + Math.random() * 0.035) * sr)] += (Math.random() < 0.5 ? -0.5 : 0.5) * (1 - k / 7);
    }
    return b;
  }
  // Small random shifts in time and force so the drums do not sound like a machine.
  function hit(inst, t, v) {
    const h = S.human / 100;
    const tj = t + (Math.random() * 2 - 1) * 0.009 * h;
    const vj = v * (1 + (Math.random() * 2 - 1) * 0.2 * h);
    INST[inst](Math.max(ctx.currentTime + 0.002, tj), Math.max(0.05, Math.min(1.1, vj)));
  }

  function styleNow() { const st = STYLES[S.style]; return st && st.meter === S.meter ? st : STYLES[firstStyle(S.meter)]; }
  const secPat = (st, sec) => st.secs[sec === 'final' ? 'coro' : sec];
  function shakerStr(st, sec) {
    if (S.shaker === 'auto') return secPat(st, sec).shaker || '';
    const sh = SHAKERS[S.shaker], steps = METERS[S.meter].steps;
    const cell = S.meter === '6/8' ? sh.comp : sh.simple;
    return cell.repeat(Math.ceil(steps / cell.length)).slice(0, steps);
  }

  // Fill style depends on the song part we are heading into (or staying in)
  function buildFill(target, m) {
    const M = METERS[m];
    const beat = M.div;
    if (target === 'intro' || target === 'estrofa') {
      const len = beat;
      const hits = [];
      for (let i = 0; i < len; i += 2) hits.push([i < len / 2 ? 'tomH' : 'tomM', i, .6 + i / len * .3]);
      return { start: M.steps - len, hits };
    }
    if (target === 'puente') {
      const len = beat * 2;
      const hits = [];
      for (let i = 0; i < len; i++) hits.push(['snare', i, .25 + .7 * (i / len)]);
      return { start: M.steps - len, hits };
    }
    // coro / final: two beats of 16ths down the toms
    const len = beat * 2;
    const toms = ['snare', 'tomH', 'tomM', 'tomL'];
    const hits = [];
    for (let i = 0; i < len; i++) hits.push([toms[Math.floor(i / len * 4)], i, .7 + .3 * (i / len)]);
    if (target === 'final') hits.push(['kick', len - 1, .9]);
    return { start: M.steps - len, hits };
  }

  // ---------- Pad ----------
  const mtof = (m) => 440 * 2 ** ((m - 69) / 12);
  const sn = (idx) => 48 + S.key + SCALE[idx % 7] + 12 * Math.floor(idx / 7);
  function padNotes(chord = S.chord) {
    const P = PADS[S.pad];
    if (S.padMode === 'fifths') { const r = 48 + S.key; return [r - 12, r, r + 7, r + 12, r + 19]; }
    const d = DEGREES[chord].d;
    switch (P.voicing) {
      case 'add9': return [sn(d) - 12, sn(d), sn(d + 4), sn(d + 2) + 12, d === 2 ? sn(d + 4) + 12 : sn(d + 1) + 12];
      case 'open': return [sn(d), sn(d + 4), sn(d) + 12, sn(d + 2) + 12];
      case 'gospel7': return [sn(d) - 12, sn(d + 2), sn(d + 4), sn(d + 6), sn(d) + 12];
      case 'sus2': return [sn(d) - 12, sn(d), sn(d + 4), sn(d + 1) + 12, sn(d + 4) + 12];
      case 'power': return [sn(d) - 12, sn(d), sn(d + 4), sn(d) + 12];
      default: return [sn(d) - 12, sn(d), sn(d + 2), sn(d + 4), sn(d) + 12];
    }
  }
  // What the pad plays now: root and fifth, the chord the song is on (Auto), or the chords held by hand
  // (Manual) merged into one chord: shared notes are not doubled and only the first keeps its low bass.
  function curNotes() {
    if (S.padMode === 'fifths') return padNotes();
    if (S.padHand !== 'manual') return padNotes(S.chord);
    if (!S.held.length) return null;
    const set = new Set(padNotes(S.held[0]));
    for (const c of S.held.slice(1)) for (const m of padNotes(c)) if (m >= sn(DEGREES[c].d)) set.add(m);
    return [...set].sort((a, b) => a - b);
  }
  // ---------- PADsynth ----------
  // Every pad except those marked `osc` is rendered as one seamless stereo loop per chord, after
  // Nasca O. Paul's PADsynth: each harmonic of each note becomes a narrow band of sound, so the chord
  // sounds like an ensemble without the regular beating of detuned oscillators. A looping buffer is
  // played by the audio engine, so it keeps sounding when iOS freezes the page.
  // The layers keep their meaning: wave = harmonic series, detune spread = band width, gain = level.
  // S.padRich (50 = as designed) widens the bands and tilts the harmonics; S.padMove scales the motion.
  const PS_N = 1 << 18;
  const WAVES = { sawtooth: (h) => 1 / h, square: (h) => (h % 2 ? 1 / h : 0), triangle: (h) => (h % 2 ? 1 / (h * h) : 0), sine: (h) => (h === 1 ? 1 : 0) };
  const WAVE_RMS = { sawtooth: .577, square: 1, triangle: .577, sine: .707 };
  const psCache = new Map();
  let psRe, psIm, psAmp, psTodo = [], psTimer = null, psMs = 0;
  const richF = () => (S.padRich - 50) / 50;
  const moveF = () => (S.padMove / 50) ** 1.5;
  const sweepCents = () => Math.min(900, 400 * moveF());
  const psKey = (notes) => [S.pad, S.padRich, notes.join(',')].join('|');
  // In-place radix-2 FFT; sign +1 is the inverse transform without the 1/N (the loop is normalised after).
  function fft(re, im, sign) {
    const n = re.length;
    for (let i = 1, j = 0; i < n; i++) {
      let bit = n >> 1;
      for (; j & bit; bit >>= 1) j ^= bit;
      j ^= bit;
      if (i < j) { let x = re[i]; re[i] = re[j]; re[j] = x; x = im[i]; im[i] = im[j]; im[j] = x; }
    }
    for (let len = 2; len <= n; len <<= 1) {
      const half = len >> 1, ang = sign * 2 * Math.PI / len, wr = Math.cos(ang), wi = Math.sin(ang);
      for (let i = 0; i < n; i += len) {
        let cr = 1, ci = 0;
        for (let k = 0; k < half; k++) {
          const a = i + k, b = a + half, tr = re[b] * cr - im[b] * ci, ti = re[b] * ci + im[b] * cr;
          re[b] = re[a] - tr; im[b] = im[a] - ti; re[a] += tr; im[a] += ti;
          const nr = cr * wr - ci * wi; ci = cr * wi + ci * wr; cr = nr;
        }
      }
    }
  }
  // A sung vowel: every harmonic is weighted by how close it falls to the formants (in octaves), so the
  // "ah" moves with each note as in a real choir instead of coming from fixed filters after the mix.
  function vowel(P, f) {
    if (!P.formant) return 1;
    const sec = P.sections || [1];
    let v = 0.06;
    for (const s of sec) for (const [F, q, g] of P.formant) { const x = Math.log2(f / (F * s)) * q / 1.5; v += g * Math.exp(-x * x) / sec.length; }
    return v;
  }
  function psRender(notes) {
    const t0 = performance.now(), P = PADS[S.pad], sr = ctx.sampleRate, N = PS_N, df = sr / N, r = richF();
    if (!psRe) { psRe = new Float64Array(N); psIm = new Float64Array(N); psAmp = new Float64Array(N / 2); }
    psAmp.fill(0);
    const top = Math.min(sr * 0.45, 14000);
    let energy = 0;
    notes.forEach((m, i) => {
      for (const [wave, dets, semi, gain] of P.layers) {
        const g = gain * (i === 0 ? 1.2 : 1), mean = dets.reduce((a, b) => a + b, 0) / dets.length;
        const f0 = mtof(m + semi) * 2 ** (mean / 1200);
        const bw = (P.bw || Math.max(8, Math.max(...dets) - Math.min(...dets))) * 2 ** (1.3 * r);
        const hs = [];
        for (let h = 1; h <= 96 && f0 * h < top; h++) { const a = WAVES[wave](h) * h ** (0.6 * r - (P.tilt || 0)) * vowel(P, f0 * h); if (a) hs.push([h, a]); }
        const norm = g * WAVE_RMS[wave] / Math.sqrt(hs.reduce((e, [, a]) => e + a * a, 0) || 1);
        energy += (g * WAVE_RMS[wave]) ** 2;
        for (const [h, a] of hs) {
          // The band widens slowly with the harmonic number, as in a real section of players.
          const cents = Math.min(100, bw * h ** (P.spread || 0.25)), sig = Math.max(1, (2 ** (cents / 1200) - 1) * f0 * h / df / 2);
          const c = f0 * h / df, amp = a * norm / Math.sqrt(sig);
          for (let k = Math.max(1, Math.floor(c - 3 * sig)), e = Math.min(N / 2 - 1, Math.ceil(c + 3 * sig)); k <= e; k++) {
            const x = (k - c) / sig; psAmp[k] += amp * Math.exp(-x * x);
          }
        }
      }
    });
    // Same magnitudes left and right, phases partly shared: wide in stereo, still full when summed to mono.
    // Both channels come out of one inverse FFT: left in the real part, right in the imaginary part.
    psRe.fill(0); psIm.fill(0);
    for (let k = 1; k < N / 2; k++) {
      const A = psAmp[k]; if (!A) continue;
      const pl = Math.random() * 2 * Math.PI, pr = pl + (Math.random() - 0.5) * Math.PI;
      const aL = A * Math.cos(pl), bL = A * Math.sin(pl), aR = A * Math.cos(pr), bR = A * Math.sin(pr);
      psRe[k] = aL - bR; psIm[k] = bL + aR; psRe[N - k] = aL + bR; psIm[N - k] = aR - bL;
    }
    fft(psRe, psIm, 1);
    let sum = 0;
    for (let n = 0; n < N; n++) sum += psRe[n] * psRe[n] + psIm[n] * psIm[n];
    const scale = Math.sqrt(energy) / Math.sqrt(sum / (2 * N) || 1);
    const buf = ctx.createBuffer(2, N, sr), L = buf.getChannelData(0), R = buf.getChannelData(1);
    for (let n = 0; n < N; n++) { L[n] = psRe[n] * scale; R[n] = psIm[n] * scale; }
    psMs = performance.now() - t0;
    return buf;
  }
  function psGet(notes) {
    const k = psKey(notes);
    if (!psCache.has(k)) { try { psCache.set(k, psRender(notes)); } catch (e) { return null; } }
    return psCache.get(k);
  }
  // Renders the other chords of the key ahead, one per idle moment, and forgets loops no longer needed.
  function psPrepare() {
    if (!ctx || PADS[S.pad].osc) return;
    const wanted = S.padMode === 'fifths' ? [padNotes()] : DEGREES.map((_, c) => padNotes(c));
    const cur = curNotes(); if (cur) wanted.push(cur);
    const keys = new Set(wanted.map(psKey));
    for (const k of psCache.keys()) if (!keys.has(k)) psCache.delete(k);
    psTodo = wanted.filter(n => !psCache.has(psKey(n)));
    if (!psTimer) psNext();
  }
  function psNext() {
    const n = psTodo.shift();
    psTimer = n ? setTimeout(() => { psTimer = null; psGet(n); psNext(); }, 30) : null;
  }
  // Movement: vibrato depth of every sounding voice and the slow sweep of the pad filter.
  function padMotion() {
    if (!ctx) return;
    const t = ctx.currentTime;
    padLfo.gain.setTargetAtTime(sweepCents(), t, 0.2);
    for (const v of padVoices) v.vib.gain.setTargetAtTime(v.vibBase * moveF(), t, 0.2);
  }
  let padRelease = 1;
  // from: start the fade later (the ending holds its chord a moment). Those voices stay listed, so Stop still cuts them.
  function padStop(fade, from) {
    if (!ctx) return;
    const now = ctx.currentTime, t = Math.max(from || 0, now);
    for (const v of padVoices) {
      v.g.gain.cancelScheduledValues(t);
      v.g.gain.setValueAtTime(t > now ? v.lvl : v.g.gain.value, t);
      v.g.gain.linearRampToValueAtTime(0, t + fade);
      v.oscs.forEach(o => { try { o.stop(t + fade + 0.1); } catch (e) {} });
    }
    if (t <= now) padVoices = [];
  }
  // swap: cross-fade into the same chord with a new sound (Richness changed) instead of a fresh attack.
  function padPlay(at, swap) {
    if (!ctx || !playing || ui.counting) return;
    const P = PADS[S.pad];
    padStop(swap ? 1.5 : padRelease);
    padRelease = Math.min(P.release, 1.2);
    const notes = curNotes();
    if (!notes) return; // Manual with no chord held: the pad goes silent
    const t = Math.max(at || 0, ctx.currentTime), buf = !P.osc && psGet(notes);
    // A merged chord has more notes: keep it as loud as a single one.
    const lvl = Math.min(1, Math.sqrt(5 / notes.length));
    // Vibrato in cents on oscillators; on a loop the same depth goes to its playback rate.
    const vibBase = buf ? P.vib[1] * Math.LN2 / 1200 : P.vib[1];
    const vib = ctx.createOscillator(), vibG = ctx.createGain();
    vib.frequency.value = P.vib[0]; vibG.gain.value = vibBase * moveF(); vib.connect(vibG); vib.start(t);
    const vg = ctx.createGain(); vg.gain.value = 0; vg.connect(padFilter);
    const oscs = [vib];
    let dest = vg;
    if (P.trem) {
      const tg = ctx.createGain(); tg.gain.value = 1 - P.trem[1] / 2; tg.connect(vg);
      const lfo = ctx.createOscillator(), depth = ctx.createGain();
      lfo.frequency.value = P.trem[0]; depth.gain.value = P.trem[1] / 2;
      lfo.connect(depth); depth.connect(tg.gain); lfo.start(t); oscs.push(lfo);
      dest = tg;
    }
    if (P.formant && !buf) {
      const pre = ctx.createGain();
      for (const [f, q, g] of P.formant) {
        const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = f; bp.Q.value = q;
        const fg = ctx.createGain(); fg.gain.value = g * 3;
        pre.connect(bp); bp.connect(fg); fg.connect(dest);
      }
      dest = pre;
    }
    if (P.air) {
      const n = ctx.createBufferSource(); n.buffer = noise; n.loop = true; n.playbackRate.value = 0.9 + Math.random() * 0.2;
      const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = P.air[1]; bp.Q.value = 0.6;
      const ag = ctx.createGain(); ag.gain.value = P.air[0];
      const sway = ctx.createOscillator(), swayG = ctx.createGain();
      sway.frequency.value = 0.13; swayG.gain.value = P.air[0] * 0.5;
      sway.connect(swayG); swayG.connect(ag.gain);
      n.connect(bp); bp.connect(ag); ag.connect(vg);
      n.start(t, Math.random() * 0.9); sway.start(t); oscs.push(n, sway);
    }
    if (buf) {
      const src = ctx.createBufferSource(); src.buffer = buf; src.loop = true;
      vibG.connect(src.playbackRate); src.connect(dest);
      src.start(t, Math.random() * buf.duration); oscs.push(src);
    } else {
      notes.forEach((m, i) => {
        for (const [wave, dets, semi, gain] of P.layers) {
          for (const det of dets) {
            const o = ctx.createOscillator(); o.type = wave;
            o.frequency.value = mtof(m + semi); o.detune.value = det + (Math.random() * 2 - 1) * 2;
            vibG.connect(o.detune);
            const g = ctx.createGain(); g.gain.value = gain * (i === 0 ? 1.2 : 1) / Math.sqrt(dets.length);
            o.connect(g); g.connect(dest); o.start(t); oscs.push(o);
          }
        }
      });
    }
    vg.gain.setValueAtTime(0, t);
    vg.gain.linearRampToValueAtTime(lvl, t + (swap ? Math.min(P.attack, 1.5) : P.attack));
    padVoices.push({ g: vg, oscs, vib: vibG, vibBase, lvl, kind: buf ? 'ps' : 'osc' });
    psPrepare();
  }
  function padSetup() {
    if (!ctx) return;
    const P = PADS[S.pad];
    padFilter.Q.setTargetAtTime(P.q, ctx.currentTime, 0.2);
    hallSend.gain.setTargetAtTime(P.hall * 0.6, ctx.currentTime, 0.3);
    padBright();
  }
  function padBright(t, sec = secOf(S.at)) { if (ctx) padFilter.frequency.setTargetAtTime(SEC_PAD[sec] * PADS[S.pad].cutoff * 2 ** (0.4 * richF()), Math.max(t || 0, ctx.currentTime), 0.6); }

  // ---------- Scheduler ----------
  // The rhythm is rendered ahead as audio, in chunks of up to one phrase, and played by the
  // audio engine itself. iOS slows or freezes the page's code in the background but keeps
  // the audio engine running (that is why the pad never stops), so each chunk also carries a
  // seamless loop of itself that takes over if the next chunk is not ready in time.
  // Any change cuts what is sounding at the next step and renders a new chunk from there.
  function stepDur() { return 60 / S.bpm / METERS[S.meter].div; }
  const PRE = 0.18, TAIL = 2.5, AHEAD = 4, MAXCHUNK = 16;
  // q: the sequencer at the end of what is already rendered. The page shows S.at, ui.pend and ui,
  // which follow the audio as it plays.
  let q = {}, chunks = [], evq = [], R = null, gen = 0, rendering = false, dirty = false, lastCut = 0, want = {}, endMoved = false;
  const ui = { queued: false, active: false, counting: false, pend: null };
  const snap = (t) => ({ ...q, t });
  // Something to do when the audio reaches t: right on time (onTime) or just ahead, for audio.
  const ev = (t, fn, onTime) => R.events.push({ t, fn, onTime });
  const changed = () => { if (playing) dirty = true; };

  // The song moves the pad to chord c at time at (Auto only). Returns whether the pad changed chord.
  function autoChord(c, at, swap) {
    if (S.padHand !== 'auto' || (c === S.chord && padVoices.length)) return false;
    S.chord = c;
    if (S.padMode === 'fifths') return false;
    padPlay(at, swap);
    return true;
  }

  function scheduleStep(s, t) {
    const m = S.meter, M = METERS[m];
    if (s === 0) {
      if (q.countBars > 0) { q.countBars--; q.counting = true; ev(t, () => { ui.counting = true; }, true); }
      else if (q.counting) { q.counting = false; ev(t, (at) => { ui.counting = false; padPlay(at); }); }
    }
    if (q.counting) {
      if (s % M.dotEvery === 0) INST.click(t, M.strong.includes(s) ? 1 : .6);
      R.ui.push({ s, t, counting: true });
      return;
    }
    if (s === 0) {
      q.bar++; q.phraseBar++;
      // The part changes on this bar line when asked (q.pend) or when the current part is over.
      let to = q.pend;
      if (to === null && q.phraseBar > partLen(partOf(q.at))) to = nextOf(q.at);
      if (to !== null) {
        const sec = secOf(to);
        q.pend = null; q.phraseBar = 1; q.sec = sec;
        if (to !== 'end') q.at = to;
        if (sec === 'final') q.ending = true;
        const at = q.at;
        ev(t, (when) => padBright(when, sec));
        ev(t, () => { S.at = at; if (ui.pend === to) ui.pend = null; drawPos(); }, true);
      }
      if (q.crashNext) { INST.crash(t, 1); INST.kick(t, 1); q.crashNext = false; }
      if (q.ending) {
        if (S.layers.shaker.on) INST.shaker(t, .8);
        q.done = true;
        // The pad moves to the ending's chord (Auto), holds it a moment and fades out; then the app stops.
        const fin = to !== 'end' && partOf(q.at).ch[0];
        ev(t, (when) => { endMoved = !!fin && autoChord(fin[0], when, true); });
        ev(t, () => { padStop(4, endMoved ? ctx.currentTime + 1.6 : 0); paintWin(); }, true);
        ev(t + 4.2, () => { if (!endMoved) stop(true); }, true);
        ev(t + 5.8, () => stop(true), true);
        R.ui.push({ s, t, at: q.at, bar: 1 });
        return;
      }
    }
    const st = styleNow();
    const pat = secPat(st, q.sec);
    const tt = t + (st.swing && m !== '6/8' && s % 4 === 2 ? st.swing * stepDur() : 0)
      + (st.swing16 && s % 2 === 1 ? st.swing16 * stepDur() : 0);
    const cur = partOf(q.at);

    // Chord changes inside the part, on the half bar at the finest.
    if (cur.ch.length && s % (M.steps / 2) === 0) {
      const off = q.phraseBar - 1 + s / M.steps;
      let b = 0;
      for (const [c, n] of cur.ch) {
        if (Math.abs(b - off) < 1e-6) { ev(t, (when) => autoChord(c, when)); ev(t, paintWin, true); break; }
        b += n; if (b > off + 1e-6) break;
      }
    }
    // Decide a fill when its start step arrives: before a part change (asked, or at the end of a part with
    // Remate automático on), every S.autoFill bars, or when Remate was tapped. Never with the drums off.
    if (!q.fillActive) {
      const to = q.pend !== null ? q.pend : q.phraseBar >= partLen(cur) ? nextOf(q.at) : null;
      const target = to === null ? q.sec : secOf(to);
      const f = buildFill(target, m);
      if (s === f.start) {
        const auto = S.autoFill > 0 && (to !== null || q.phraseBar % S.autoFill === 0);
        if (!S.layers.drums.on) q.fillQueued = false;
        else if (q.fillQueued || q.pend !== null || auto) {
          q.fillActive = f; q.fillQueued = false;
          q.crashNext = target !== 'intro' && (target !== 'estrofa' || q.pend !== null);
          ev(t, () => { ui.active = true; ui.queued = false; setFillUi(); }, true);
        }
      }
    }
    // Click (metronome): always rendered into its own stem; the Clic channel decides whether it is heard.
    if (s % M.dotEvery === 0) INST.metro(t, M.strong.includes(s) ? 1 : .6);
    // Shaker and hand percussion
    const shk = SEC_SHK[q.sec];
    const sh = shakerStr(st, q.sec);
    if (V[sh[s]]) hit('shaker', tt, V[sh[s]] * shk);
    for (const inst of ['tamb', 'conga', 'clap']) { const p = pat[inst]; if (p && V[p[s]]) hit(inst, tt, V[p[s]] * shk); }
    // Drums
    const dyn = SEC_DYN[q.sec];
    if (q.fillActive && s >= q.fillActive.start) {
      const i = s - q.fillActive.start;
      for (const [inst, at, v] of q.fillActive.hits) if (at === i) hit(inst, tt, v);
    } else {
      for (const inst of DRUMS) { const p = pat[inst]; if (p && V[p[s]]) hit(inst, tt, V[p[s]] * dyn); }
      const h = S.human / 100;
      const groove = q.sec === 'estrofa' || q.sec === 'coro';
      const ghostSlot = m === '6/8' ? s % 2 === 1 : s % 4 === 3;
      if (groove && (pat.snare || pat.rim) && ghostSlot && Math.random() < 0.12 * h) hit('snare', tt, .14);
      if (groove && (pat.hat || pat.ohat) && q.phraseBar % 4 === 0 && s === M.steps - 2 && Math.random() < 0.7 * h) hit('ohat', tt, .6);
      if (q.sec === 'coro' && pat.kick && s === M.steps - 1 && Math.random() < 0.2 * h) hit('kick', tt, .45);
    }
    if (s === M.steps - 1 && q.fillActive) { q.fillActive = null; ev(t + 0.06, () => { ui.active = false; setFillUi(); }, true); }
    R.ui.push({ s, t, at: q.at, bar: q.phraseBar });
  }

  // How many steps the next chunk holds: the rest of the bar, one bar when it must sound soon
  // (start, or right after a change), or up to the end of the part (so a background loop repeats
  // the end of the part, its fill included), or a whole next part.
  function chunkSteps(soon) {
    const M = METERS[S.meter];
    if (q.step) return M.steps - q.step;
    if (soon || q.countBars > 0) return M.steps;
    const left = partLen(partOf(q.at)) - q.phraseBar;
    const bars = q.pend !== null ? 1 : left > 0 ? left : partLen(partOf(nextOf(q.at)));
    return Math.max(1, Math.min(bars, Math.floor(MAXCHUNK / (M.steps * stepDur())))) * M.steps;
  }
  const renderOff = (off) => new Promise((res, rej) => {
    off.oncomplete = (e) => res(e.renderedBuffer);
    const p = off.startRendering(); if (p && p.catch) p.catch(rej);
  });
  // Renders the next chunk with the same instruments, into four stems: percussion, drums, click, count-in.
  async function renderNext(t0, cut) {
    const my = gen;
    rendering = true;
    try {
      const M = METERS[S.meter], n = chunkSteps(cut || !chunks.length), loopable = !q.step && !q.countBars;
      const sr = ctx.sampleRate, OAC = window.OfflineAudioContext || window.webkitOfflineAudioContext;
      const off = new OAC(4, Math.ceil((PRE + n * stepDur() + TAIL) * sr), sr);
      const merge = off.createChannelMerger(4); merge.connect(off.destination);
      const outs = [0, 1, 2, 3].map((i) => { const g = off.createGain(); g.connect(merge, 0, i); return g; });
      const live = { ctx, buses, master };
      ctx = off; buses = { shaker: outs[0], drums: outs[1], click: outs[2] }; master = outs[3]; openHat = null;
      R = { events: [], ui: [], snaps: [] };
      let t = PRE;
      try {
        for (let i = 0; i < n && !q.done; i++) {
          R.snaps.push(snap(t));
          scheduleStep(q.step, t);
          t += stepDur(); q.step = (q.step + 1) % M.steps;
        }
      } finally { ({ ctx, buses, master } = live); openHat = null; }
      const r = R; R = null;
      r.end = snap(t); r.len = t - PRE; r.bars = n / M.steps; r.loopable = loopable && !q.done;
      const buf = await renderOff(off);
      if (my !== gen) return; // a change came in meanwhile: this chunk is stale
      rendering = false;
      commit(r, buf, t0 ?? ctx.currentTime + 0.03 + PRE, cut);
    } catch (e) {
      if (my === gen) rendering = false;
      console.error(e);
    }
  }
  function startAt(src, when, offset) {
    const now = ctx.currentTime;
    if (when < now) { offset += now - when; when = now; }
    if (offset < src.buffer.duration) src.start(when, offset);
  }
  // The chunk as a seamless loop: its tail wraps to the start, its pre-roll to the end.
  function foldLoop(buf, len) {
    const sr = buf.sampleRate, Ls = Math.round(len * sr), P = Math.round(PRE * sr);
    const lb = ctx.createBuffer(buf.numberOfChannels, Ls, sr);
    for (let ch = 0; ch < buf.numberOfChannels; ch++) {
      const d = buf.getChannelData(ch), o = lb.getChannelData(ch);
      for (let i = 0; i < d.length; i++) o[((i - P) % Ls + Ls) % Ls] += d[i];
    }
    return lb;
  }
  function commit(r, buf, t0, cut) {
    const now = ctx.currentTime, base = t0 - PRE;
    const prev = chunks[chunks.length - 1];
    if (prev && prev.loop && !cut) {
      // The next chunk arrived in time: the previous one plays out whole and its loop never starts.
      prev.g.gain.cancelScheduledValues(0); prev.g.gain.setValueAtTime(1, now);
      try { prev.loop.stop(0); } catch (e) {}
      prev.loop = null;
    }
    const g = ctx.createGain(); g.connect(rhythmIn);
    const src = ctx.createBufferSource(); src.buffer = buf; src.connect(g);
    if (cut) startAt(src, t0, PRE); else startAt(src, base, 0);
    const c = { t0, t1: t0 + r.len, g, src, bars: r.bars, end: { ...r.end, t: base + r.end.t }, snaps: r.snaps.map((s) => ({ ...s, t: base + s.t })) };
    const tc = c.t1 - PRE;
    if (r.loopable && tc > now + 0.05) {
      const lb = foldLoop(buf, r.len);
      const lg = ctx.createGain(); lg.connect(rhythmIn);
      const ls = ctx.createBufferSource(); ls.buffer = lb; ls.loop = true; ls.connect(lg);
      ls.start(tc, lb.duration - PRE);
      g.gain.setValueAtTime(1, now); g.gain.setValueAtTime(0, tc);
      Object.assign(c, { loop: ls, lg, tc });
    }
    for (const e of r.events) evq.push({ ...e, t: base + e.t });
    evq.sort((a, b) => a.t - b.t);
    for (const u of r.ui) uiQueue.push({ ...u, t: base + u.t });
    chunks = chunks.filter((x) => x.t1 + TAIL > now);
    chunks.push(c);
  }
  // The sequencer as it will be at the first step at or after T, looping included.
  function stateAt(T) {
    for (const c of chunks) { const s = c.snaps.find((x) => x.t >= T - 1e-4); if (s) return { ...s }; }
    const c = chunks[chunks.length - 1];
    if (!c) return null;
    if (c.loop && T >= c.t1) {
      const L = c.t1 - c.t0;
      for (let k = Math.max(1, Math.floor((T - c.t0) / L)); ; k++) {
        const s = c.snaps.find((x) => x.t + k * L >= T - 1e-4);
        if (s) return { ...s, t: s.t + k * L, bar: s.bar + k * c.bars };
      }
    }
    if (c.end.done) return null;
    const s = { ...c.end }, n = Math.max(0, Math.ceil((T - s.t) / stepDur() - 1e-6));
    s.t += n * stepDur(); s.step = (s.step + n) % METERS[S.meter].steps;
    return s;
  }
  function fadeOut(g, T) { g.gain.cancelScheduledValues(T); g.gain.setTargetAtTime(0, T, 0.006); }
  function cutAt(T) {
    for (const c of chunks) {
      if (c.t0 >= T) { try { c.src.stop(); } catch (e) {} }
      else { fadeOut(c.g, T); try { c.src.stop(T + 0.06); } catch (e) {} }
      if (c.loop) { fadeOut(c.lg, T); try { c.loop.stop(T + 0.06); } catch (e) {} c.loop = null; }
      c.snaps = c.snaps.filter((s) => s.t < T); c.t1 = Math.min(c.t1, T);
    }
    chunks = chunks.filter((c) => c.t0 < T);
    const i = evq.findIndex((e) => e.t >= T); if (i >= 0) evq.length = i;
    const j = uiQueue.findIndex((u) => u.t >= T); if (j >= 0) uiQueue.length = j;
    padFilter.frequency.cancelScheduledValues(T);
  }
  // A change (tempo, part, fill, style…): replace what is rendered from the next step on.
  function interrupt() {
    const st = stateAt(ctx.currentTime + 0.12);
    if (!st) return;
    gen++; lastCut = ctx.currentTime;
    cutAt(st.t);
    const { t, ...rest } = st; q = rest;
    if ('at' in want) { q.at = want.at; q.sec = secOf(q.at); }
    q.at = Math.min(q.at, S.song.seq.length - 1);
    if ('pend' in want) q.pend = want.pend === q.at ? null : want.pend;
    if (typeof q.pend === 'number' && q.pend >= S.song.seq.length) q.pend = null;
    if ('fill' in want) q.fillQueued = want.fill;
    if (want.reset) { q.step = 0; q.fillActive = null; }
    want = {};
    renderNext(t, true);
  }

  function tick() {
    if (!playing || !ctx) return;
    const now = ctx.currentTime;
    while (evq.length && evq[0].t <= now + (evq[0].onTime ? 0 : 0.1)) { const e = evq.shift(); e.fn(e.t); if (!playing) return; }
    if (dirty && chunks.length && now - lastCut > 0.15) { dirty = false; interrupt(); return; }
    if (rendering) return;
    const c = chunks[chunks.length - 1];
    if (!c) return;
    if (c.loop && now > c.tc - 0.03) { interrupt(); return; } // the loop took over while the page was frozen: rejoin it
    if (!c.end.done && c.t1 - now < AHEAD) renderNext(c.t1); // the next chunk starts where this one ends
  }

  // Clock in a worker: its timers keep firing in the background where the page's are throttled.
  let clock = null;
  function clockStart() {
    try {
      if (!clock) {
        const src = 'let id;onmessage=e=>{clearInterval(id);if(e.data)id=setInterval(()=>postMessage(0),e.data)}';
        clock = new Worker(URL.createObjectURL(new Blob([src], { type: 'text/javascript' })));
        clock.onmessage = () => { if (timer) tick(); };
      }
      clock.postMessage(25);
    } catch (e) { clock = null; }
    clearInterval(timer); timer = setInterval(tick, 25);
  }
  function clockStop() {
    clock?.postMessage(0);
    clearInterval(timer); timer = null;
  }
  document.addEventListener('visibilitychange', async () => {
    if (!playing || !ctx) return;
    if (document.hidden) { tick(); return; }
    if (ctx.state !== 'running') { try { await ctx.resume(); } catch (e) {} }
    try { wakeLock = await navigator.wakeLock?.request('screen'); } catch (e) {}
  });

  let wakeLock = null;
  async function start() {
    initAudio();
    if (ctx.state !== 'running') await ctx.resume();
    $('status').textContent = T('status.loading');
    await loadSamples();
    playing = true;
    if (secOf(S.at) === 'final') S.at = 0;
    const first = partOf(S.at).ch[0];
    if (first && S.padHand === 'auto') S.chord = first[0];
    q = { step: 0, bar: 0, phraseBar: 0, at: S.at, sec: secOf(S.at), pend: null, fillQueued: false, fillActive: null, crashNext: false, ending: false, counting: false, countBars: S.countIn ? 1 : 0, done: false };
    Object.assign(ui, { queued: false, active: false, counting: S.countIn, pend: null }); pos = null;
    chunks = []; evq = []; uiQueue.length = 0; want = {}; dirty = false; endMoved = false; gen++;
    padBright();
    clockStart(); renderNext();
    if (!S.countIn) padPlay();
    $('play').classList.add('stop'); $('play').setAttribute('aria-label', T('stop'));
    $('status').textContent = T('status.playing');
    paintWin(); drawPos(); setFillUi();
    try { wakeLock = await navigator.wakeLock?.request('screen'); } catch (e) {}
  }
  // soft: the song reached its ending, so the next Play starts from the top.
  function stop(soft) {
    playing = false; gen++; rendering = false;
    clockStop();
    if (ctx) {
      const now = ctx.currentTime;
      for (const c of chunks) {
        fadeOut(c.g, now); try { c.src.stop(now + 0.06); } catch (e) {}
        if (c.loop) { fadeOut(c.lg, now); try { c.loop.stop(now + 0.06); } catch (e) {} }
      }
    }
    chunks = []; evq = []; uiQueue.length = 0; want = {}; dirty = false;
    padStop(soft ? 0.1 : 0.4);
    Object.assign(ui, { queued: false, active: false, counting: false, pend: null }); pos = null;
    if (soft) S.at = 0;
    save(); setFillUi(); paintWin(); drawPos();
    $('play').classList.remove('stop'); $('play').setAttribute('aria-label', T('play'));
    $('status').textContent = T('status.stopped');
    try { wakeLock?.release(); } catch (e) {}
  }

  // ---------- UI ----------
  const CHEV = '<svg class="chev" viewBox="0 0 8 13" fill="none" stroke="#5A5A5F" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="m1.5 1.5 5 5-5 5"/></svg>';
  // pos: the step the audio is on (from uiQueue), so the screen follows what is heard.
  let pos = null, flashT = null, nextPart = null;
  function frame() {
    if (ctx && playing) {
      let cur = null;
      while (uiQueue.length && uiQueue[0].t <= ctx.currentTime) cur = uiQueue.shift();
      if (cur) {
        const M = METERS[S.meter];
        pos = cur; drawPos();
        if (cur.s % (cur.counting ? M.dotEvery : M.div) === 0) {
          $('bpm').classList.add('flash'); clearTimeout(flashT); flashT = setTimeout(() => $('bpm').classList.remove('flash'), 110);
        }
      }
    }
    drawLeds();
    requestAnimationFrame(frame);
  }
  // Part line, song map and Siguiente: where the song is, what comes next, what is waiting for the next bar.
  function drawPos() {
    const seq = S.song.seq, steps = METERS[S.meter].steps, live = playing && pos && !pos.counting;
    const at = Math.min(live ? pos.at : S.at, seq.length - 1), len = partLen(partOf(at)), bar = live ? pos.bar : 0;
    const nx = ui.pend !== null ? ui.pend : at < seq.length - 1 ? at + 1 : null;
    const box = $('map');
    if (box.children.length !== seq.length) {
      box.textContent = '';
      seq.forEach((_, i) => {
        const b = document.createElement('button'); b.type = 'button';
        b.innerHTML = '<span class="seg-bar"><i></i></span><span class="lb"></span>';
        b.addEventListener('click', () => choosePart(i));
        box.appendChild(b);
      });
    }
    [...box.children].forEach((b, i) => {
      b.style.flex = partLen(partOf(i));
      b.className = i === at ? 'now' : i === ui.pend ? 'pending' : i === nx ? 'next' : '';
      b.setAttribute('aria-label', partLabel(i)); b.lastChild.textContent = partLabel(i, true);
      b.firstChild.firstChild.style.width = i === at && live ? Math.min(100, (bar - 1 + (pos.s + 1) / steps) / len * 100) + '%' : '0';
    });
    $('partname').textContent = partLabel(at);
    const pp = $('partpos'); pp.textContent = '';
    if (playing && pos && pos.counting) pp.textContent = T('counting');
    else {
      pp.append(`${bar}/${len}`);
      if (nx !== null) { const b = document.createElement('b'); b.textContent = partLabel(nx); pp.append(' → ', b); }
    }
    const base = ui.pend !== null ? ui.pend : at;
    const nb = base === 'end' ? null : base < seq.length - 1 ? base + 1 : secOf(base) === 'final' ? null : 'end';
    nextPart = nb === null || (!playing && nb === 'end') ? null : nb;
    $('next').disabled = nextPart === null;
    $('nextname').textContent = nextPart === null ? '—' : partLabel(nextPart);
    $('next').setAttribute('aria-label', T('next.aria', $('nextname').textContent));
  }
  // A part on the map (or Siguiente). Stopped: Play starts there. Playing: it comes in on the next bar, with a
  // fill before it. The part that is playing asks for a fill instead.
  function choosePart(i) {
    if (!playing) {
      if (i === 'end') return;
      S.at = i;
      const first = partOf(i).ch[0];
      if (first && S.padHand === 'auto') S.chord = first[0];
      save(); padBright(); drawPos(); paintWin();
      return;
    }
    const at = pos && !pos.counting ? pos.at : S.at;
    if (i === at && ui.pend === null) { $('fill').click(); return; }
    ui.pend = i === at ? null : i; want.pend = i; drawPos(); changed();
  }

  function setBpm(v) {
    S.bpm = Math.max(40, Math.min(220, Math.round(v * 2) / 2));
    $('bpm').textContent = Number.isInteger(S.bpm) ? S.bpm : S.bpm.toFixed(1);
    save(); changed();
  }
  // Remate needs the drums: with them off it is greyed and says so.
  function setFillUi() {
    const off = !S.layers.drums.on, f = $('fill');
    f.disabled = off; $('fillnote').hidden = !off;
    f.classList.toggle('armed', !off && (ui.queued || ui.active));
    $('filllbl').textContent = T(ui.active ? 'fill.active' : ui.queued ? 'fill.queued' : 'fill');
  }

  // ---------- Key: list in circle-of-fifths order, and the dial on Tocar ----------
  const FIFTHS = [0, 7, 2, 9, 4, 11, 6, 1, 8, 3, 10, 5];
  const SIG = ['', '1♯', '2♯', '3♯', '4♯', '5♯', '6♯', '5♭', '4♭', '3♭', '2♭', '1♭'];
  function buildKeys() {
    const k = $('key'); k.innerHTML = '';
    FIFTHS.forEach((i, n) => { const o = document.createElement('option'); o.value = i; o.textContent = NAMES[S.names][i]; o.dataset.sub = SIG[n]; k.appendChild(o); });
    k.value = S.key; $('names').value = S.names;
    drawDial();
  }
  function drawDial() {
    const N = NAMES[S.names], box = $('dialnames'); box.textContent = '';
    for (let k = -4; k <= 4; k++) {
      const el = document.createElement('span'); el.className = 'd' + Math.abs(k); el.textContent = N[(S.key + 7 * k + 120) % 12];
      box.appendChild(el);
    }
    $('dial').setAttribute('aria-label', T('dial.aria', N[S.key]));
  }
  function setKey(k) {
    S.key = ((k % 12) + 12) % 12; $('key').value = S.key;
    save(); drawDial(); buildWin(); renderParts(); drawPart(); padPlay();
  }
  // Drag sideways to move along the circle of fifths (it sounds when you let go); tap to open the list.
  {
    const dial = $('dial'), names = $('dialnames');
    let drag = null;
    const end = (tap) => {
      if (!drag) return;
      const d = drag; drag = null; names.style.transform = '';
      if (d.moved) { if (S.key !== d.key) setKey(S.key); } else if (tap) window.acompMenu?.('key', dial);
    };
    dial.addEventListener('pointerdown', (e) => {
      drag = { x: e.clientX, moved: false, cell: dial.clientWidth / 9, key: S.key };
      try { dial.setPointerCapture(e.pointerId); } catch (x) {}
    });
    dial.addEventListener('pointermove', (e) => {
      if (!drag) return;
      const dx = e.clientX - drag.x;
      if (Math.abs(dx) > 6) drag.moved = true;
      if (Math.abs(dx) >= drag.cell * .8) { S.key = (S.key + (dx < 0 ? 7 : 5)) % 12; drag.x = e.clientX; names.style.transform = ''; drawDial(); buildWin(); }
      else if (drag.moved) names.style.transform = `translateX(${dx}px)`;
    });
    dial.addEventListener('pointerup', () => end(true));
    dial.addEventListener('pointercancel', () => end(false));
    dial.addEventListener('click', (e) => { if (e.detail === 0) window.acompMenu?.('key', dial); });
    dial.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); setKey(S.key + 7); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); setKey(S.key + 5); }
    });
  }

  // ---------- Chord window ----------
  // IV I V over ii vi iii: the key's chords in circle-of-fifths order, with the neighbours outside the key
  // greyed at the sides. Colours by function: rest, moves away, tension. The chord that sounds is lit.
  const chordName = (c) => NAMES[S.names][(S.key + SCALE[DEGREES[c].d]) % 12] + (DEGREES[c].minor ? 'm' : '');
  const noteName = (pc) => NAMES[S.names][((pc % 12) + 12) % 12];
  const sounding = () => S.padMode === 'fifths' ? [] : S.padHand === 'manual' ? S.held : [S.chord];
  const press = new Map(); // Manual: chords under a finger → long-press timer (null once it counts as held)
  function buildWin() {
    press.clear();
    const cell = (c, size) => `<button type="button" class="${FN[c]} ${size}" data-c="${c}"><b></b><span></span></button>`;
    const w = $('win');
    w.innerHTML = '<span class="frame"></span>'
      + `<div class="col nb l" aria-hidden="true"><span class="big"></span><span class="small"></span></div>`
      + `<div class="col">${cell(3, 'big')}${cell(1, 'small')}</div><div class="col">${cell(0, 'big')}${cell(5, 'small')}</div><div class="col">${cell(4, 'big')}${cell(2, 'small')}</div>`
      + `<div class="col nb r" aria-hidden="true"><span class="big"></span><span class="small"></span></div>`;
    const nb = w.querySelectorAll('.nb span');
    nb[0].textContent = noteName(S.key + 10); nb[1].textContent = noteName(S.key + 7) + 'm';
    nb[2].textContent = noteName(S.key + 2); nb[3].textContent = noteName(S.key + 11) + 'm';
    w.querySelectorAll('button').forEach((b) => {
      const c = +b.dataset.c;
      b.firstChild.textContent = chordName(c);
      const pickOne = () => {
        if (S.padHand === 'auto') { S.chord = c; save(); paintWin(); padPlay(); return; }
        S.held = S.held.length === 1 && S.held[0] === c ? [] : [c]; heldChanged();
      };
      b.addEventListener('pointerdown', (e) => {
        if (S.padMode === 'fifths') return;
        if (S.padHand === 'auto') { pickOne(); return; }
        // Manual: a tap replaces the chord (tapping the only one silences the pad); holding one chord down,
        // or a long press, adds or removes another, up to three.
        try { b.setPointerCapture(e.pointerId); } catch (x) {}
        if (press.size) {
          for (const [k, tm] of press) { clearTimeout(tm); press.set(k, null); }
          press.set(c, null); toggleHeld(c); return;
        }
        press.set(c, setTimeout(() => { press.set(c, null); toggleHeld(c); }, 450));
      });
      b.addEventListener('pointerup', () => {
        if (!press.has(c)) return;
        const tm = press.get(c); press.delete(c);
        if (tm) { clearTimeout(tm); pickOne(); }
      });
      b.addEventListener('pointercancel', () => { clearTimeout(press.get(c)); press.delete(c); });
      b.addEventListener('click', (e) => { if (e.detail === 0 && S.padMode !== 'fifths') pickOne(); });
      b.addEventListener('contextmenu', (e) => e.preventDefault());
    });
    paintWin();
  }
  function paintWin() {
    const on = sounding(), fifths = S.padMode === 'fifths';
    $('win').classList.toggle('off', fifths);
    $('win').querySelectorAll('button').forEach((b) => {
      const c = +b.dataset.c, lit = on.includes(c);
      b.classList.toggle('on', lit); b.setAttribute('aria-pressed', String(lit));
      b.lastChild.textContent = DEGREES[c].roman + (lit && playing ? ' · ' + T('sounding') : '');
    });
    const manual = S.padHand === 'manual';
    $('legend').hidden = manual; $('hint').hidden = !manual;
    $('hint').textContent = T(fifths ? 'hint.fifths' : S.held.length ? 'hint.held' : 'hint.silent');
    document.querySelectorAll('#mode button').forEach((b) => { const o = b.dataset.m === S.padHand; b.classList.toggle('on', o); b.setAttribute('aria-checked', String(o)); });
    $('padmode').setAttribute('aria-checked', String(fifths));
  }
  function toggleHeld(c) {
    const i = S.held.indexOf(c);
    if (i >= 0) S.held.splice(i, 1); else { S.held.push(c); if (S.held.length > 3) S.held.shift(); }
    heldChanged();
  }
  function heldChanged() { save(); paintWin(); padPlay(); }
  // The chord the song is on right now (or where Play starts), for going back to Auto.
  function songChord() {
    const live = playing && pos && !pos.counting, P = partOf(live ? pos.at : S.at);
    if (!P.ch.length) return S.chord;
    let off = live ? pos.bar - 1 + pos.s / METERS[S.meter].steps : 0, last = P.ch[0][0];
    for (const [c, n] of P.ch) { if (off < n - 1e-6) return c; off -= n; last = c; }
    return last;
  }
  function setHand(m) {
    if (S.padHand === m) return;
    S.padHand = m;
    if (m === 'manual') S.held = [S.chord]; else S.chord = songChord();
    save(); paintWin(); padPlay();
  }

  // ---------- Channels: tiles on Tocar, mix and pan in Sonido ----------
  const leds = {};
  function drawTiles() {
    const box = $('tiles');
    if (!box.children.length) for (const k of CHANNELS) {
      const b = document.createElement('button'); b.type = 'button'; b.className = 'tile'; b.dataset.ch = k;
      b.innerHTML = '<span class="led"></span><span class="tl"></span><span class="side"></span>';
      b.addEventListener('click', () => setLayer(k, !S.layers[k].on));
      leds[k] = b.firstChild; box.appendChild(b);
    }
    for (const b of box.children) {
      const L = S.layers[b.dataset.ch];
      b.classList.toggle('on', L.on); b.setAttribute('aria-pressed', String(L.on));
      b.children[1].textContent = T('ch.' + b.dataset.ch);
      b.children[2].textContent = L.side === 'C' ? '' : T('tag.' + L.side);
    }
  }
  // The green LED on each tile follows that channel's level, so a channel that is on but silent is easy to spot.
  const lvBuf = new Float32Array(512);
  function drawLeds() {
    if (!ctx) return;
    for (const k of CHANNELS) {
      if (!S.layers[k].on || !leds[k]) continue;
      meters[k].getFloatTimeDomainData(lvBuf);
      let e = 0; for (let i = 0; i < lvBuf.length; i++) e += lvBuf[i] * lvBuf[i];
      const db = 20 * Math.log10(Math.sqrt(e / lvBuf.length) + 1e-6);
      leds[k].style.opacity = playing ? Math.max(.25, Math.min(1, (db + 50) / 30)) : 1;
    }
  }
  function setLayer(k, on) {
    S.layers[k].on = on; applyMix(); save(); drawTiles(); paintMix();
    if (k === 'drums') { if (!on) { ui.queued = false; if (playing) want.fill = false; } setFillUi(); changed(); }
  }
  let panOpen = false;
  function buildMix() {
    const box = $('mix'); box.textContent = '';
    for (const k of CHANNELS) {
      const r = document.createElement('div'); r.className = 'row';
      const b = document.createElement('button'); b.type = 'button'; b.className = 'ch'; b.id = 'on-' + k; b.setAttribute('role', 'switch');
      b.textContent = T('ch.' + k); b.setAttribute('aria-label', T('ch.mute', T('ch.' + k)));
      b.addEventListener('click', () => setLayer(k, !S.layers[k].on));
      const v = document.createElement('input'); v.type = 'range'; v.min = 0; v.max = 100; v.id = 'v-' + k; v.value = S.layers[k].vol;
      v.setAttribute('aria-label', T('ch.vol', T('ch.' + k)));
      v.addEventListener('input', () => { S.layers[k].vol = +v.value; applyMix(); save(); });
      const tag = document.createElement('span'); tag.className = 'tag'; tag.id = 'tag-' + k;
      r.append(b, v, tag); box.appendChild(r);
    }
    // Pan sides fold away under one row; folded, the row sums up what is not in the centre.
    const f = document.createElement('button'); f.type = 'button'; f.className = 'row link fold'; f.id = 'panfold';
    f.innerHTML = `<span class="lbl"></span><span class="val" id="pansum"></span>${CHEV}`; f.firstChild.textContent = T('pan');
    f.addEventListener('click', () => { panOpen = !panOpen; paintMix(); });
    const pr = document.createElement('div'); pr.className = 'panrows'; pr.id = 'panrows';
    for (const k of CHANNELS) {
      const r = document.createElement('div'); r.className = 'row';
      const l = document.createElement('span'); l.className = 'lbl'; l.textContent = T('ch.' + k);
      const seg = document.createElement('div'); seg.className = 'seg'; seg.setAttribute('role', 'radiogroup'); seg.setAttribute('aria-label', T('pan.aria', T('ch.' + k)));
      for (const sd of ['L', 'C', 'R']) {
        const b = document.createElement('button'); b.type = 'button'; b.setAttribute('role', 'radio'); b.dataset.ch = k; b.dataset.side = sd; b.textContent = T('side.' + sd);
        b.addEventListener('click', () => { S.layers[k].side = sd; applyMix(); save(); paintMix(); drawTiles(); });
        seg.appendChild(b);
      }
      r.append(l, seg); pr.appendChild(r);
    }
    const n = document.createElement('p'); n.className = 'panfoot'; n.textContent = T('pan.foot'); pr.appendChild(n);
    box.append(f, pr);
    paintMix();
  }
  function paintMix() {
    for (const k of CHANNELS) {
      const L = S.layers[k], b = $('on-' + k);
      b.classList.toggle('on', L.on); b.setAttribute('aria-checked', String(L.on));
      $('tag-' + k).textContent = L.side === 'C' ? '' : T('side.' + L.side);
    }
    document.querySelectorAll('#panrows button').forEach((b) => { const o = S.layers[b.dataset.ch].side === b.dataset.side; b.classList.toggle('on', o); b.setAttribute('aria-checked', String(o)); });
    $('panfold').setAttribute('aria-expanded', String(panOpen)); $('panrows').hidden = !panOpen;
    $('pansum').textContent = panOpen ? '' : CHANNELS.filter((k) => S.layers[k].side !== 'C').map((k) => `${T('ch.' + k)} ${T('side.' + S.layers[k].side).toLowerCase()}`).join(', ') || T('pan.center');
  }

  // ---------- Song structure (Sonido): Orden and Partes, and the part editor ----------
  let structTab = 'orden', editing = null, adding = null, selChord = null;
  const addChip = $('addchip');
  function tabTo(w) {
    structTab = w; const o = w === 'orden';
    $('t-orden').classList.toggle('on', o); $('t-partes').classList.toggle('on', !o);
    $('t-orden').setAttribute('aria-selected', String(o)); $('t-partes').setAttribute('aria-selected', String(!o));
    $('p-orden').hidden = !o; $('p-partes').hidden = o;
    $('structfoot').textContent = T(o ? 'struct.foot.order' : 'struct.foot.parts');
  }
  function renderSeq() {
    const box = $('seq'); box.textContent = '';
    S.song.seq.forEach((k, i) => {
      const c = document.createElement('button'); c.type = 'button'; c.className = 'chip'; c.setAttribute('aria-label', T('seq.remove', partLabel(i)));
      c.innerHTML = '<span class="n"></span><span></span><span class="x" aria-hidden="true">×</span>';
      c.children[0].textContent = i + 1; c.children[1].textContent = partLabel(i);
      c.disabled = S.song.seq.length <= 1;
      c.addEventListener('click', () => { if (S.song.seq.length > 1) dropFromSeq((_, j) => j === i); });
      box.appendChild(c);
    });
    box.appendChild(addChip);
    // "+ Añadir" opens a menu of the parts already defined.
    const sel = $('addpart'); sel.textContent = '';
    for (const k of partKeys()) { const o = new Option(T('sec.' + k), k); o.dataset.sub = T('bars.n', partLen(S.song.parts[k])); sel.appendChild(o); }
    sel.selectedIndex = -1;
  }
  function renderParts() {
    const box = $('partlist'); box.textContent = '';
    for (const k of partKeys()) {
      const P = S.song.parts[k], r = document.createElement('button'); r.type = 'button'; r.className = 'row link';
      r.innerHTML = `<span class="lbl"></span><span class="val"></span>${CHEV}`;
      r.children[0].textContent = T('sec.' + k);
      r.children[1].textContent = `${partLen(P)} ${T('bars.short')} · ` + (P.ch.map(([c, n]) => chordName(c) + (n === 1 ? '' : ' ' + fmtBars(n))).join(' · ') || T('part.nochords'));
      r.addEventListener('click', () => editPart(k));
      box.appendChild(r);
    }
    const sel = $('newpart'); sel.textContent = '';
    for (const k of Object.keys(PART_SEC)) if (!S.song.parts[k]) sel.appendChild(new Option(T('sec.' + k), k));
    sel.selectedIndex = -1; $('newrow').hidden = !sel.options.length;
  }
  // Removes the matching items of the order and keeps Play (or what is playing) on the same part.
  function dropFromSeq(pred) {
    const old = S.song.seq, gone = old.map((k, i) => pred(k, i));
    const at = S.at - gone.slice(0, S.at).filter(Boolean).length;
    S.song.seq = old.filter((_, i) => !gone[i]);
    if (!S.song.seq.length) S.song.seq = [partKeys()[0]];
    S.at = Math.max(0, Math.min(at, S.song.seq.length - 1));
    songChanged(true);
  }
  function songChanged(moved) {
    save(); renderSeq(); renderParts(); drawPos();
    if (playing) { if (moved) { ui.pend = null; want.pend = null; want.at = S.at; } changed(); }
  }
  function editPart(k) { editing = k; adding = null; selChord = null; drawPart(); window.acompShow?.('parte'); }
  // Part editor: chords first. Tapping one asks how long it lasts and adds it; tapping one already in the
  // list opens its length and Quitar. The part lasts what its chords add up to.
  const DUR_BTN = [[.5, '½', 'dur.half'], [1, '1', 'dur.one'], [2, '2', 'dur.many'], [4, '4', 'dur.many']];
  function durButtons(cur, onPick) {
    const box = document.createElement('div'); box.className = 'durs';
    for (const [n, big, small] of DUR_BTN) {
      const x = document.createElement('button'); x.type = 'button'; x.className = cur === n ? 'on' : ''; x.setAttribute('aria-label', T('bars.n', n));
      x.innerHTML = `<b>${big}</b><span></span>`; x.lastChild.textContent = T(small);
      x.addEventListener('click', () => onPick(n)); box.appendChild(x);
    }
    return box;
  }
  function drawPart() {
    const P = editing && S.song.parts[editing];
    if (!P) return;
    $('ptitle').textContent = T('sec.' + editing);
    const degs = $('degs'); degs.textContent = '';
    DEGREES.forEach((g, c) => {
      const b = document.createElement('button'); b.type = 'button'; b.className = FN[c] + (adding === c ? ' on' : '');
      b.innerHTML = '<b></b><span></span>'; b.firstChild.textContent = chordName(c); b.lastChild.textContent = g.roman;
      b.addEventListener('click', () => { adding = adding === c ? null : c; selChord = null; drawPart(); });
      degs.appendChild(b);
    });
    const ask = $('ask'); ask.textContent = ''; ask.hidden = adding === null;
    if (adding !== null) {
      const h = document.createElement('div'); h.className = 'askh';
      const label = document.createElement('span'), name = document.createElement('b');
      name.textContent = chordName(adding); label.append(name, ' · ' + T('part.ask'));
      const cancel = document.createElement('button'); cancel.type = 'button'; cancel.className = 'cancel'; cancel.textContent = T('cancel');
      cancel.addEventListener('click', () => { adding = null; drawPart(); });
      h.append(label, cancel);
      ask.append(h, durButtons(null, (n) => { if (P.ch.length < 32) P.ch.push([adding, n]); adding = null; partEdited(); }));
    }
    const box = $('prog'); box.textContent = '';
    $('progcap').textContent = T('part.sounds') + (P.ch.length ? ' · ' + T('bars.n', partLen(P)) : '');
    if (!P.ch.length) {
      const r = document.createElement('div'); r.className = 'row';
      r.innerHTML = '<span class="lbl empty"></span>'; r.firstChild.textContent = T('part.empty'); box.appendChild(r);
    }
    P.ch.forEach(([c, n], i) => {
      const r = document.createElement('button'); r.type = 'button'; r.className = 'row link prow' + (i === selChord ? ' sel' : '');
      r.setAttribute('aria-expanded', String(i === selChord));
      r.innerHTML = `<span class="n"></span><span class="cn ${FN[c]}"></span><span class="lbl"></span><span class="val"></span>${CHEV}`;
      r.children[0].textContent = i + 1; r.children[1].textContent = chordName(c); r.children[3].textContent = T('bars.n', n);
      r.addEventListener('click', () => { selChord = i === selChord ? null : i; adding = null; drawPart(); });
      box.appendChild(r);
      if (i === selChord) {
        const ed = document.createElement('div'); ed.className = 'edit';
        const rm = document.createElement('button'); rm.type = 'button'; rm.className = 'rm'; rm.textContent = T('part.remove', chordName(c));
        rm.addEventListener('click', () => { P.ch.splice(i, 1); selChord = null; partEdited(); });
        ed.append(durButtons(n, (m) => { P.ch[i][1] = m; selChord = null; partEdited(); }), rm);
        box.appendChild(ed);
      }
    });
    $('pdel').hidden = partKeys().length <= 1;
  }
  function partEdited() { drawPart(); songChanged(false); }
  $('t-orden').addEventListener('click', () => tabTo('orden'));
  $('t-partes').addEventListener('click', () => tabTo('partes'));
  $('addpart').addEventListener('change', (e) => { if (S.song.seq.length < 40) S.song.seq.push(e.target.value); songChanged(false); });
  $('newpart').addEventListener('change', (e) => { const k = e.target.value; S.song.parts[k] = { ch: [], bars: 4 }; songChanged(false); editPart(k); });
  $('pdel').addEventListener('click', () => {
    const k = editing;
    if (!k || partKeys().length <= 1) return;
    delete S.song.parts[k]; editing = null;
    dropFromSeq((x) => x === k);
    window.acompShow?.('sonido');
  });

  function buildStyles() {
    const sel = $('style'); sel.innerHTML = '';
    for (const [id, st] of Object.entries(STYLES)) {
      if (st.meter !== S.meter) continue;
      const o = document.createElement('option'); o.value = id; o.textContent = NM(st); sel.appendChild(o);
    }
    if (!STYLES[S.style] || STYLES[S.style].meter !== S.meter) S.style = firstStyle(S.meter);
    sel.value = S.style;
  }
  function buildShakers() {
    const sel = $('shaker'); sel.innerHTML = '';
    for (const [id, sh] of Object.entries(SHAKERS)) { const o = document.createElement('option'); o.value = id; o.textContent = NM(sh); sel.appendChild(o); }
    sel.value = S.shaker;
  }
  function setMeter(m) {
    S.meter = m; if (playing) { want.reset = true; changed(); }
    $('meter').value = m;
    setUnit(); buildStyles(); drawPos(); save();
  }
  function setUnit() { $('bpmunit').textContent = T(S.meter === '6/8' ? 'unit.comp' : 'unit.simple'); }
  function buildPadUi() {
    const sel = $('padtype'); sel.innerHTML = '';
    const groups = {};
    for (const [id, P] of Object.entries(PADS)) {
      if (!groups[P.group]) { groups[P.group] = document.createElement('optgroup'); groups[P.group].label = T('groups')[P.group] || P.group; sel.appendChild(groups[P.group]); }
      const o = document.createElement('option'); o.value = id; o.textContent = NM(P); groups[P.group].appendChild(o);
    }
    sel.value = S.pad;
    const shs = $('shksound'); shs.innerHTML = '';
    for (const [id, x] of Object.entries(SHK_SETS)) { const o = document.createElement('option'); o.value = id; o.textContent = NM(x); shs.appendChild(o); }
    shs.value = S.shkSound;
    $('padmove').value = S.padMove; $('padmoveval').textContent = S.padMove + ' %';
    $('padrich').value = S.padRich; $('padrichval').textContent = S.padRich + ' %';
    const ids = Object.keys(PADS), P = PADS[S.pad];
    $('padname').textContent = NM(P);
    $('padsub').textContent = `${T('groups')[P.group] || P.group} · ${T('pad.of', ids.indexOf(S.pad) + 1, ids.length)}`;
    paintWin();
  }
  const stepPad = (n) => { const ids = Object.keys(PADS), s = $('padtype'); s.value = ids[(ids.indexOf(S.pad) + n + ids.length) % ids.length]; s.dispatchEvent(new Event('change')); };
  function setCountUi() { $('countin').setAttribute('aria-checked', String(S.countIn)); }

  // ---------- Song list (kept in this browser) ----------
  let songs = [], songTitle = null;
  try { songs = JSON.parse(localStorage.getItem('acomp-songs') || '[]'); } catch (e) {}
  if (!Array.isArray(songs)) songs = [];
  const saveSongs = () => { try { localStorage.setItem('acomp-songs', JSON.stringify(songs)); } catch (e) {} };
  function renderSongs() {
    const box = $('songs'); box.innerHTML = '';
    if (!songs.length) {
      const p = document.createElement('p'); p.className = 'hint';
      p.textContent = T('songs.empty');
      box.appendChild(p); return;
    }
    songs.forEach((sg, i) => {
      const row = document.createElement('div'); row.className = 'song';
      const load = document.createElement('button'); load.className = 'songload';
      const meta = `${sg.bpm} BPM · ${sg.meter} · ${STYLES[sg.style] ? NM(STYLES[sg.style]) : ''} · ${T('key.opt')} ${NAMES[S.names][sg.key]}`;
      load.innerHTML = '<b></b><span></span>'; load.querySelector('b').textContent = sg.name; load.querySelector('span').textContent = meta;
      load.addEventListener('click', () => {
        setBpm(sg.bpm); setMeter(sg.meter);
        S.style = sg.style; S.key = sg.key; S.shaker = sg.shaker || 'auto';
        if (PADS[sg.pad]) S.pad = sg.pad; if (sg.padMode) S.padMode = sg.padMode; S.padMove = pct(sg.padMove); S.padRich = pct(sg.padRich); if (SHK_SETS[sg.shkSound]) S.shkSound = sg.shkSound;
        if (sg.padHand === 'auto' || sg.padHand === 'manual') S.padHand = sg.padHand;
        // Songs saved before 1.6.0 have no structure: they get the default one.
        S.song = validSong(sg.song);
        S.at = playing ? Math.min(S.at, S.song.seq.length - 1) : 0;
        S.chord = partOf(S.at).ch.length ? partOf(S.at).ch[0][0] : 0; S.held = [S.chord];
        buildPadUi(); padSetup();
        buildStyles(); buildShakers(); buildKeys(); buildWin(); renderSeq(); renderParts(); drawPos(); save(); padPlay();
        if (playing) { ui.pend = null; want.pend = null; want.at = S.at; changed(); }
        $('songname').value = sg.name; songTitle = sg.name; $('songtitle').textContent = sg.name;
      });
      const del = document.createElement('button'); del.className = 'songdel'; del.textContent = '✕'; del.setAttribute('aria-label', T('del.aria', sg.name));
      del.addEventListener('click', () => {
        if (del.dataset.armed) { songs.splice(i, 1); saveSongs(); renderSongs(); }
        else { del.dataset.armed = '1'; del.textContent = T('del'); setTimeout(() => { delete del.dataset.armed; del.textContent = '✕'; }, 3000); }
      });
      row.append(load, del); box.appendChild(row);
    });
  }
  $('savesong').addEventListener('click', () => {
    const name = $('songname').value.trim();
    if (!name) { $('songname').focus(); return; }
    const sg = { name, bpm: S.bpm, meter: S.meter, style: S.style, key: S.key, shaker: S.shaker, pad: S.pad, padMode: S.padMode, padHand: S.padHand, padMove: S.padMove, padRich: S.padRich, shkSound: S.shkSound, song: JSON.parse(JSON.stringify(S.song)) };
    const at = songs.findIndex(x => x.name.toLowerCase() === name.toLowerCase());
    if (at >= 0) songs[at] = sg; else songs.push(sg);
    saveSongs(); renderSongs(); songTitle = name; $('songtitle').textContent = name;
  });

  let taps = [];
  function tap() {
    const now = performance.now();
    taps = taps.filter(x => now - x < 2500); taps.push(now);
    if (taps.length >= 2) {
      const iv = []; for (let i = 1; i < taps.length; i++) iv.push(taps[i] - taps[i - 1]);
      const last = iv.slice(-4);
      setBpm(Math.round(60000 / (last.reduce((a, b) => a + b, 0) / last.length)));
    }
  }

  $('play').addEventListener('click', () => playing ? stop() : start());
  $('m1').addEventListener('click', () => setBpm(S.bpm - 1));
  $('m5').addEventListener('click', () => setBpm(S.bpm - 5));
  $('p1').addEventListener('click', () => setBpm(S.bpm + 1));
  $('p5').addEventListener('click', () => setBpm(S.bpm + 5));
  $('tap').addEventListener('click', tap);
  $('meter').addEventListener('change', (e) => setMeter(e.target.value));
  $('style').addEventListener('change', (e) => { S.style = e.target.value; save(); changed(); });
  $('shaker').addEventListener('change', (e) => { S.shaker = e.target.value; save(); changed(); });
  $('shksound').addEventListener('change', (e) => { S.shkSound = e.target.value; save(); changed(); });
  $('padtype').addEventListener('change', (e) => { S.pad = e.target.value; save(); buildPadUi(); padSetup(); padPlay(); });
  $('padprev').addEventListener('click', () => stepPad(-1));
  $('padnext').addEventListener('click', () => stepPad(1));
  $('padmove').addEventListener('input', (e) => { S.padMove = +e.target.value; $('padmoveval').textContent = S.padMove + ' %'; save(); padMotion(); });
  $('padrich').addEventListener('input', (e) => { $('padrichval').textContent = e.target.value + ' %'; });
  $('padrich').addEventListener('change', (e) => { S.padRich = +e.target.value; save(); padBright(); padPlay(0, true); });
  $('padmode').addEventListener('click', () => { S.padMode = S.padMode === 'fifths' ? 'chord' : 'fifths'; save(); paintWin(); padPlay(); });
  document.querySelectorAll('#mode button').forEach((b) => b.addEventListener('click', () => setHand(b.dataset.m)));
  $('human').addEventListener('input', (e) => { S.human = +e.target.value; $('humanval').textContent = S.human + ' %'; save(); changed(); });
  $('next').addEventListener('click', () => { if (nextPart !== null) choosePart(nextPart); });
  $('countin').addEventListener('click', () => { S.countIn = !S.countIn; setCountUi(); save(); });
  $('autofill').addEventListener('change', (e) => { S.autoFill = +e.target.value; save(); changed(); });
  $('fill').addEventListener('click', () => { if (playing && !ui.active && !ui.counting && S.layers.drums.on) { ui.queued = want.fill = !ui.queued; setFillUi(); changed(); } });
  $('key').addEventListener('change', (e) => setKey(+e.target.value));
  $('names').addEventListener('change', (e) => { S.names = e.target.value; save(); buildKeys(); buildWin(); renderParts(); drawPart(); renderSongs(); });
  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'SELECT' || e.target.tagName === 'INPUT' || e.target.closest?.('[data-for]')) return;
    const k = e.key.toLowerCase();
    if (k === ' ') { e.preventDefault(); playing ? stop() : start(); }
    else if (k === 'r') $('fill').click();
    else if (k === 't') tap();
    else if (k === 'arrowup') { e.preventDefault(); setBpm(S.bpm + 1); }
    else if (k === 'arrowdown') { e.preventDefault(); setBpm(S.bpm - 1); }
    else if (k.length === 1 && '123456789'.includes(k) && S.song.seq[+k - 1]) choosePart(+k - 1);
  });

  // ---------- Microphone tempo listener (beta) ----------
  let micOn = false, micStream = null, micTimer = null, estTimer = null, an = null, prevMag = null, fluxHist = [], onsets = [], lastOnset = 0, driftCount = 0;
  async function micStart() {
    initAudio();
    if (ctx.state !== 'running') await ctx.resume();
    try {
      micStream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false } });
    } catch (e) {
      $('micmsg').innerHTML = T('mic.error');
      return;
    }
    const src = ctx.createMediaStreamSource(micStream);
    an = ctx.createAnalyser(); an.fftSize = 1024; an.smoothingTimeConstant = 0;
    src.connect(an);
    prevMag = new Float32Array(an.frequencyBinCount); fluxHist = []; onsets = []; driftCount = 0;
    micTimer = setInterval(analyze, 10);
    estTimer = setInterval(estimate, 1000);
    micOn = true; $('mic').setAttribute('aria-checked', 'true');
    $('micmsg').textContent = T('mic.start');
  }
  function micStop() {
    clearInterval(micTimer); clearInterval(estTimer);
    micStream?.getTracks().forEach(t => t.stop());
    micOn = false; $('mic').setAttribute('aria-checked', 'false');
    $('micread').textContent = '—';
  }
  const db = new Float32Array(512);
  function analyze() {
    an.getFloatFrequencyData(db);
    let flux = 0;
    const top = Math.min(db.length, 300);
    for (let i = 2; i < top; i++) {
      const m = Math.pow(10, db[i] / 20);
      const d = m - prevMag[i]; if (d > 0) flux += d;
      prevMag[i] = m;
    }
    fluxHist.push(flux); if (fluxHist.length > 150) fluxHist.shift();
    const mean = fluxHist.reduce((a, b) => a + b, 0) / fluxHist.length;
    const sd = Math.sqrt(fluxHist.reduce((a, b) => a + (b - mean) ** 2, 0) / fluxHist.length);
    const now = performance.now() / 1000;
    if (fluxHist.length > 50 && flux > mean + 1.6 * sd && flux > 0.02 && now - lastOnset > 0.12) {
      lastOnset = now; onsets.push(now);
    }
    while (onsets.length && now - onsets[0] > 8) onsets.shift();
  }
  function estimate() {
    // In the background the analyzer runs throttled and misses beats: never retune from that.
    if (document.hidden) { onsets = []; fluxHist = []; driftCount = 0; return; }
    if (onsets.length < 8) { $('micread').textContent = T('mic.wait'); return; }
    let best = 0, bestScore = 0;
    for (let cand = S.bpm * 0.8; cand <= S.bpm * 1.2; cand += 0.5) {
      const half = 30 / cand;
      let score = 0;
      for (let i = 0; i < onsets.length; i++) for (let j = i + 1; j < onsets.length; j++) {
        const dt = onsets[j] - onsets[i];
        if (dt > 2.5) break;
        const r = dt / half, n = Math.round(r);
        if (n >= 1 && Math.abs(r - n) < 0.06 * Math.sqrt(n)) score += 1 / Math.sqrt(n);
      }
      if (score > bestScore) { bestScore = score; best = cand; }
    }
    if (!best) return;
    const det = Math.round(best);
    const diff = (det - S.bpm) / S.bpm;
    $('micread').innerHTML = T('mic.read', det, S.bpm);
    if (Math.abs(diff) > 0.03) {
      driftCount++;
      if (driftCount >= 3) {
        $('micmsg').innerHTML = `<span class="alert">${T(diff > 0 ? 'mic.fast' : 'mic.slow')}</span>` + T(S.follow ? 'mic.adjusted' : 'mic.suggest');
        if (S.follow) { setBpm(S.bpm + Math.sign(det - S.bpm) * Math.min(3, Math.abs(det - S.bpm))); driftCount = 1; }
      }
    } else {
      driftCount = 0;
      $('micmsg').innerHTML = `<span class="ok">${T('mic.ok')}</span>`;
    }
  }
  $('mic').addEventListener('click', () => micOn ? micStop() : micStart());
  $('follow').addEventListener('click', () => {
    S.follow = !S.follow; save();
    $('follow').setAttribute('aria-checked', String(S.follow));
  });

  $('lang').addEventListener('change', (e) => { S.lang = e.target.value; save(); applyLang(); });

  // ---------- Boot ----------
  setBpm(S.bpm);
  setMeter(S.meter);
  $('human').value = S.human; $('humanval').textContent = S.human + ' %';
  setCountUi();
  $('autofill').value = String(S.autoFill);
  $('follow').setAttribute('aria-checked', String(S.follow));
  applyLang();
  window.acompLoaded = () => Object.keys(SB).length;
  window.acompVersion = () => ({ release: RELEASE, build: BUILD, versions: CHANGELOG.length });
  // For the smoke test: stop the clock as iOS does in the background, and read the rhythm's level.
  let probe = null, padProbe = null;
  window.acompTest = {
    freeze: clockStop, thaw: clockStart,
    chunks: () => chunks.map((c) => [c.t0, c.t1]),
    pad: () => ({ kind: padVoices.length ? padVoices[padVoices.length - 1].kind : null, cached: psCache.size, ms: Math.round(psMs), notes: (curNotes() || []).length, voices: padVoices.length }),
    pan: () => CHANNELS.map((k) => (pans[k] && pans[k].pan ? Math.round(pans[k].pan.value * 100) / 100 : 0)),
    song: () => ({ at: S.at, pend: ui.pend, chord: S.chord, held: [...S.held], seq: [...S.song.seq] }),
    padLevel() {
      if (!padProbe) { padProbe = ctx.createAnalyser(); padProbe.fftSize = 2048; buses.pad.connect(padProbe); }
      const d = new Float32Array(padProbe.fftSize); padProbe.getFloatTimeDomainData(d);
      return Math.sqrt(d.reduce((m, x) => m + x * x, 0) / d.length);
    },
    level() {
      if (!probe) { probe = ctx.createAnalyser(); probe.fftSize = 2048; rhythmIn.connect(probe, 0); rhythmIn.connect(probe, 1); }
      const d = new Float32Array(probe.fftSize); probe.getFloatTimeDomainData(d);
      return d.reduce((m, x) => Math.max(m, Math.abs(x)), 0);
    }
  };
  requestAnimationFrame(frame);
})();
