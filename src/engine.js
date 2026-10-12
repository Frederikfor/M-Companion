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
  // Pad colours, grouped by the moment of the service they suit.
  // layers: [wave, detune list in cents, semitone offset, gain]. cutoff multiplies the per-part brightness.
  // Optional: air [gain, Hz] adds breathy filtered noise; formant [[Hz, Q, gain]…] shapes the layers like a choir "ah";
  // trem [Hz, depth] adds a soft volume tremolo, like an electric piano.
  const PADS = {
    atmos:     { group: 'Worship', name: 'Supersaw', en: 'Supersaw', layers: [['sawtooth', [-9, 0, 9], 0, .022], ['sine', [0], 12, .018]], cutoff: 1, q: .7, attack: 2.2, release: 2.5, vib: [.25, 4], hall: .9, voicing: 'add9' },
    fundamento:{ group: 'Worship', name: 'High-cut', en: 'High-cut', layers: [['sawtooth', [-7, 7], 0, .013], ['triangle', [0], -12, .032], ['sine', [0], 12, .008]], cutoff: .7, q: .9, attack: 3, release: 3, vib: [.2, 3], hall: 1, voicing: 'sus2', air: [.032, 3500] },
    aire:      { group: 'Worship', name: 'Breath', en: 'Breath', layers: [['triangle', [-5, 5], 0, .035], ['sine', [0], 12, .02]], cutoff: 1.2, q: .5, attack: 2.5, release: 3, vib: [.15, 4], hall: 1.1, voicing: 'open', air: [.12, 6000] },
    shimmer:   { group: 'Worship', name: 'Shimmer', en: 'Shimmer', layers: [['sine', [-4, 4], 12, .03], ['triangle', [0], 24, .01], ['sawtooth', [-10, 10], 0, .01]], cutoff: 1.6, q: .4, attack: 2.8, release: 3, vib: [.3, 5], hall: 1.2, voicing: 'open' },
    amanecer:  { group: 'Worship', name: 'Swell', en: 'Swell', layers: [['sawtooth', [-14, -5, 5, 14], 0, .036], ['sawtooth', [0], 12, .014]], cutoff: 1.4, q: 1.2, attack: 4, release: 3, vib: [.2, 4], hall: 1, voicing: 'add9' },
    oracion:   { group: 'Oración y ministración', name: 'Sine', en: 'Sine', layers: [['sine', [-3, 3], 0, .025], ['triangle', [0], -12, .02]], cutoff: .5, q: .4, attack: 4, release: 4, vib: [.1, 3], hall: 1, voicing: 'sus2' },
    quintas:   { group: 'Oración y ministración', name: 'Power', en: 'Power', layers: [['sawtooth', [-6, 6], 0, .013], ['sine', [0], -12, .035]], cutoff: .6, q: .6, attack: 3, release: 3.5, vib: [.15, 3], hall: 1, voicing: 'power', air: [.028, 2500] },
    cristal:   { group: 'Oración y ministración', name: 'Overtone', en: 'Overtone', layers: [['sine', [0], 12, .03], ['sine', [0], 19, .01], ['triangle', [0], 0, .021]], cutoff: 2.2, q: .3, attack: .4, release: 3, vib: [.2, 4.5], hall: 1.2, voicing: 'open', trem: [3.5, .15] },
    calido:    { group: 'Alabanza', name: 'Triangle', en: 'Triangle', layers: [['triangle', [-6, 6], 0, .05], ['sine', [0], -12, .04]], cutoff: .75, q: .5, attack: 1.2, release: 1.8, vib: [.2, 3], hall: .5, voicing: 'triad' },
    analogico: { group: 'Alabanza', name: 'Poly', en: 'Poly', layers: [['sawtooth', [-12, 0, 12], 0, .029], ['square', [-6, 6], -12, .019]], cutoff: 1.1, q: 1.5, attack: .5, release: 1.2, vib: [.6, 6], hall: .5, voicing: 'triad' },
    teclas:    { group: 'Alabanza', name: 'E-Piano', en: 'E-Piano', layers: [['sine', [0], 0, .039], ['triangle', [-3, 3], 12, .01]], cutoff: 1.5, q: .3, attack: .15, release: 1.2, vib: [.1, 2], hall: .5, voicing: 'add9', trem: [4.5, .3] },
    cuerdas:   { group: 'Himnos y gospel', name: 'Ensemble', en: 'Ensemble', layers: [['sawtooth', [-12, -4, 4, 12], 0, .016]], cutoff: .9, q: .6, attack: 1.4, release: 2, vib: [5, 6], hall: .7, voicing: 'triad' },
    coro:      { group: 'Himnos y gospel', name: 'Formant', en: 'Formant', layers: [['sawtooth', [-8, 0, 8], 0, .057]], cutoff: 2.5, q: .3, attack: 1.2, release: 2, vib: [5.5, 10], hall: .9, voicing: 'triad', formant: [[700, 6, 1], [1150, 8, .6], [2700, 10, .3]] },
    organo:    { group: 'Himnos y gospel', name: 'Drawbar', en: 'Drawbar', layers: [['sine', [0], -12, .03], ['sine', [0], 0, .04], ['sine', [0], 12, .03], ['sine', [0], 19, .018], ['sine', [0], 24, .012]], cutoff: 3, q: .3, attack: .06, release: .35, vib: [6.3, 12], hall: .3, voicing: 'gospel7' }
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
      'unit.simple': 'BPM (negra)', 'unit.comp': 'BPM (negra con punto)', ready: 'Listo para empezar', tap: 'Marcar tempo',
      live: 'Control en vivo', sections: 'Parte de la canción',
      'sec.intro': 'Intro', 'sec.estrofa': 'Estrofa', 'sec.coro': 'Coro', 'sec.puente': 'Puente', 'sec.final': 'Final',
      fill: 'Remate', 'fill.active': 'Rematando…', 'fill.queued': 'En espera', play: 'Tocar', stop: 'Parar', next: 'Siguiente parte',
      counting: 'Conteo de entrada…', bar: (n, part, left) => `Compás ${n} · ${part}` + (left ? ` · remate en ${left}` : ''),
      style: 'Estilo', 'shaker.pattern': 'Patrón de shaker', 'shaker.sound': 'Sonido del shaker', feel: 'Interpretación', human: 'Toque humano',
      countin: 'Conteo de entrada', autofill: 'Remate automático', 'autofill.0': 'Apagado', 'autofill.4': 'Cada 4 compases', 'autofill.8': 'Cada 8 compases',
      'mic.cap': 'Micrófono · beta', 'mic.listen': 'Escuchar mi tempo', 'mic.follow': 'La base me sigue',
      'mic.hint': 'Te avisa si te aceleras o frenas respecto al tempo marcado.',
      'mic.error': '<span class="alert">No pude abrir el micrófono aquí.</span> Abre la app desde su dirección https o el archivo <b>acompanante.html</b> en Chrome y permite el micrófono.',
      'mic.start': 'Escuchando. Toca unos compases para que mida tu tempo.', 'mic.wait': 'Escuchando…',
      'mic.read': (det, set) => `Detecto <b>${det}</b> BPM · marcado ${set}`, 'mic.fast': 'Te estás acelerando', 'mic.slow': 'Te estás frenando',
      'mic.adjusted': ' · ajusté el tempo', 'mic.suggest': ' · activa "La base me sigue" para que la base te siga', 'mic.ok': 'Vas a tempo.',
      key: 'Tonalidad', 'key.opt': 'Tono', 'pad.sound': 'Sonido del pad', 'pad.fifths': 'Solo tónica y quinta', names: 'Nombres de notas',
      'pad.fifths.foot': 'Con tónica y quinta el pad sirve para toda la canción sin cambiar de acorde.',
      mix: 'Mezcla', 'ch.shaker': 'Percusión', 'ch.drums': 'Batería', 'mute.shaker': 'Activar o silenciar percusión', 'mute.drums': 'Activar o silenciar batería', 'mute.pad': 'Activar o silenciar pad',
      'vol.shaker': 'Volumen percusión', 'vol.drums': 'Volumen batería', 'vol.pad': 'Volumen pad',
      'mix.foot': 'Toca el nombre de un canal para silenciarlo. En iPhone quita el modo silencio si no suena.', app: 'App', lang: 'Idioma',
      credits: 'Grabaciones de uso libre (CC0): batería acústica de freesound.org; shakers, cabasa, pandero, conga y palmas de la Versilian Community Sample Library.',
      'song.name': 'Nombre de la canción', save: 'Guardar', 'save.foot': 'Guarda el tempo, compás, estilo, tono, pad y shaker actuales.', mysongs: 'Mis canciones',
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
      'unit.simple': 'BPM (quarter note)', 'unit.comp': 'BPM (dotted quarter)', ready: 'Ready to start', tap: 'Tap tempo',
      live: 'Live control', sections: 'Song part',
      'sec.intro': 'Intro', 'sec.estrofa': 'Verse', 'sec.coro': 'Chorus', 'sec.puente': 'Bridge', 'sec.final': 'Ending',
      fill: 'Fill', 'fill.active': 'Filling…', 'fill.queued': 'Queued', play: 'Play', stop: 'Stop', next: 'Next part',
      counting: 'Count-in…', bar: (n, part, left) => `Bar ${n} · ${part}` + (left ? ` · fill in ${left}` : ''),
      style: 'Style', 'shaker.pattern': 'Shaker pattern', 'shaker.sound': 'Shaker sound', feel: 'Feel', human: 'Human feel',
      countin: 'Count-in', autofill: 'Auto fill', 'autofill.0': 'Off', 'autofill.4': 'Every 4 bars', 'autofill.8': 'Every 8 bars',
      'mic.cap': 'Microphone · beta', 'mic.listen': 'Listen to my tempo', 'mic.follow': 'Backing follows me',
      'mic.hint': 'Warns you if you speed up or slow down against the set tempo.',
      'mic.error': '<span class="alert">Could not open the microphone here.</span> Open the app from its https address, or the <b>acompanante.html</b> file in Chrome, and allow the microphone.',
      'mic.start': 'Listening. Play a few bars so it can measure your tempo.', 'mic.wait': 'Listening…',
      'mic.read': (det, set) => `Hearing <b>${det}</b> BPM · set ${set}`, 'mic.fast': 'You are speeding up', 'mic.slow': 'You are slowing down',
      'mic.adjusted': ' · tempo adjusted', 'mic.suggest': ' · turn on "Backing follows me" so the backing follows you', 'mic.ok': 'You are on tempo.',
      key: 'Key', 'key.opt': 'Key', 'pad.sound': 'Pad sound', 'pad.fifths': 'Root and fifth only', names: 'Note names',
      'pad.fifths.foot': 'With root and fifth only, one pad works for the whole song without changing chords.',
      mix: 'Mix', 'ch.shaker': 'Percussion', 'ch.drums': 'Drums', 'mute.shaker': 'Mute or unmute percussion', 'mute.drums': 'Mute or unmute drums', 'mute.pad': 'Mute or unmute pad',
      'vol.shaker': 'Percussion volume', 'vol.drums': 'Drums volume', 'vol.pad': 'Pad volume',
      'mix.foot': 'Tap a channel name to mute it. On iPhone, turn off silent mode if there is no sound.', app: 'App', lang: 'Language',
      credits: 'Free-to-use recordings (CC0): acoustic drums from freesound.org; shakers, cabasa, tambourine, conga and claps from the Versilian Community Sample Library.',
      'song.name': 'Song name', save: 'Save', 'save.foot': 'Saves the current tempo, time signature, style, key, pad and shaker.', mysongs: 'My songs',
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
    if (!playing) $('barinfo').textContent = T('ready');
    if (!micOn) $('micmsg').textContent = T('mic.hint');
    setUnit(); setFillUi(); buildStyles(); buildShakers(); buildPadUi(); buildKeys(); renderSongs();
  }
  const firstStyle = (m) => Object.keys(STYLES).find(k => STYLES[k].meter === m);

  const S = {
    bpm: 72, meter: '4/4', section: 'estrofa', pending: null, autoFill: 8,
    key: 7, names: 'latin', chord: 0, style: 'balada44', shaker: 'auto', human: 40, countIn: true,
    pad: 'atmos', padMode: 'chord', shkSound: 'small',
    layers: { shaker: { on: true, vol: 60 }, drums: { on: true, vol: 75 }, pad: { on: true, vol: 50 } },
    follow: false, lang: 'es'
  };
  try { Object.assign(S, JSON.parse(localStorage.getItem('acomp') || '{}'), { pending: null }); } catch (e) {}
  if (!STYLES[S.style] || STYLES[S.style].meter !== S.meter) S.style = firstStyle(S.meter);
  if (!SHAKERS[S.shaker]) S.shaker = 'auto';
  if (!PADS[S.pad]) S.pad = 'atmos';
  if (!SHK_SETS[S.shkSound]) S.shkSound = 'small';
  if (!I18N[S.lang]) S.lang = 'es';
  const save = () => { try { localStorage.setItem('acomp', JSON.stringify(S)); } catch (e) {} };

  // ---------- Audio engine ----------
  let ctx, master, buses = {}, noise, padFilter, padVoices = [], hall, hallSend;
  let playing = false, timer = null, nextTime = 0, step = 0, bar = 0, phraseBar = 0;
  let fillQueued = false, fillActive = null, crashNext = false, ending = false;
  let countBars = 0, counting = false;
  const uiQueue = [];

  function initAudio() {
    if (ctx) return;
    try { if (navigator.audioSession) navigator.audioSession.type = 'playback'; } catch (e) {}
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -14; comp.ratio.value = 3;
    master = ctx.createGain(); master.gain.value = 0.9;
    master.connect(comp); comp.connect(ctx.destination);
    const room = ctx.createConvolver(); room.buffer = makeRoom(1.3);
    const roomGain = ctx.createGain(); roomGain.gain.value = 0.35;
    room.connect(roomGain); roomGain.connect(master);
    const sends = { shaker: 0.35, drums: 0.25, pad: 0.12 };
    for (const k of ['shaker', 'drums', 'pad']) {
      buses[k] = ctx.createGain(); buses[k].connect(master);
      const sg = ctx.createGain(); sg.gain.value = sends[k]; buses[k].connect(sg); sg.connect(room);
    }
    padFilter = ctx.createBiquadFilter(); padFilter.type = 'lowpass'; padFilter.frequency.value = (SEC_PAD[S.section] || 1000) * PADS[S.pad].cutoff; padFilter.Q.value = PADS[S.pad].q;
    padFilter.connect(buses.pad);
    hall = ctx.createConvolver(); hall.buffer = makeRoom(5);
    hallSend = ctx.createGain(); hallSend.gain.value = PADS[S.pad].hall * 0.6;
    buses.pad.connect(hallSend); hallSend.connect(hall); hall.connect(master);
    const lfo = ctx.createOscillator(), lfoG = ctx.createGain();
    lfo.frequency.value = 0.08; lfoG.gain.value = 300; lfo.connect(lfoG); lfoG.connect(padFilter.frequency); lfo.start();
    noise = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const d = noise.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    applyMix();
  }
  function applyMix() {
    if (!ctx) return;
    for (const k of ['shaker', 'drums', 'pad']) {
      const L = S.layers[k];
      buses[k].gain.setTargetAtTime(L.on ? (L.vol / 100) ** 1.5 : 0, ctx.currentTime, 0.05);
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
    click: (t, v) => toneHit(t, master, 'sine', v > .8 ? 2000 : 1500, v > .8 ? 1990 : 1490, 0.5 * v, 0.06)
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
    click: SYN.click
  };
  function makeRoom(sec) {
    const sr = ctx.sampleRate, n = Math.floor(sec * sr), b = ctx.createBuffer(2, n, sr);
    for (let ch = 0; ch < 2; ch++) {
      const d = b.getChannelData(ch); let y = 0;
      for (let i = 0; i < n; i++) { y += 0.35 * ((Math.random() * 2 - 1) - y); d[i] = y * Math.pow(1 - i / n, 4); }
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
  function padNotes() {
    const P = PADS[S.pad];
    if (S.padMode === 'fifths') { const r = 48 + S.key; return [r - 12, r, r + 7, r + 12, r + 19]; }
    const d = DEGREES[S.chord].d;
    switch (P.voicing) {
      case 'add9': return [sn(d) - 12, sn(d), sn(d + 4), sn(d + 2) + 12, d === 2 ? sn(d + 4) + 12 : sn(d + 1) + 12];
      case 'open': return [sn(d), sn(d + 4), sn(d) + 12, sn(d + 2) + 12];
      case 'gospel7': return [sn(d) - 12, sn(d + 2), sn(d + 4), sn(d + 6), sn(d) + 12];
      case 'sus2': return [sn(d) - 12, sn(d), sn(d + 4), sn(d + 1) + 12, sn(d + 4) + 12];
      case 'power': return [sn(d) - 12, sn(d), sn(d + 4), sn(d) + 12];
      default: return [sn(d) - 12, sn(d), sn(d + 2), sn(d + 4), sn(d) + 12];
    }
  }
  let padRelease = 1;
  function padStop(fade) {
    if (!ctx) return;
    const t = ctx.currentTime;
    for (const v of padVoices) {
      v.g.gain.cancelScheduledValues(t);
      v.g.gain.setValueAtTime(v.g.gain.value, t);
      v.g.gain.linearRampToValueAtTime(0, t + fade);
      v.oscs.forEach(o => { try { o.stop(t + fade + 0.1); } catch (e) {} });
    }
    padVoices = [];
  }
  function padPlay(at) {
    if (!ctx || !playing || counting) return;
    const P = PADS[S.pad];
    padStop(padRelease);
    padRelease = Math.min(P.release, 1.2);
    const t = Math.max(at || 0, ctx.currentTime);
    const vib = ctx.createOscillator(), vibG = ctx.createGain();
    vib.frequency.value = P.vib[0]; vibG.gain.value = P.vib[1]; vib.connect(vibG); vib.start(t);
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
    if (P.formant) {
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
    padNotes().forEach((m, i) => {
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
    vg.gain.setValueAtTime(0, t);
    vg.gain.linearRampToValueAtTime(1, t + P.attack);
    padVoices.push({ g: vg, oscs });
  }
  function padSetup() {
    if (!ctx) return;
    const P = PADS[S.pad];
    padFilter.Q.setTargetAtTime(P.q, ctx.currentTime, 0.2);
    hallSend.gain.setTargetAtTime(P.hall * 0.6, ctx.currentTime, 0.3);
    padBright();
  }
  function padBright(t) { if (ctx) padFilter.frequency.setTargetAtTime(SEC_PAD[S.section] * PADS[S.pad].cutoff, Math.max(t || 0, ctx.currentTime), 0.6); }

  // ---------- Scheduler ----------
  function stepDur() { return 60 / S.bpm / METERS[S.meter].div; }

  function scheduleStep(s, t) {
    const m = S.meter, M = METERS[m];
    if (s === 0) {
      if (countBars > 0) { countBars--; counting = true; }
      else if (counting) { counting = false; padPlay(t); }
    }
    if (counting) {
      if (s % M.dotEvery === 0) INST.click(t, M.strong.includes(s) ? 1 : .6);
      uiQueue.push({ s, t, txt: T('counting') });
      return;
    }
    if (s === 0) {
      bar++; phraseBar++;
      if (S.pending) {
        const wasFinal = S.pending === 'final';
        S.section = S.pending; S.pending = null; phraseBar = 1;
        if (wasFinal) ending = true;
        padBright(t);
        refreshSections();
      }
      if (crashNext) { INST.crash(t, 1); INST.kick(t, 1); crashNext = false; }
      if (ending) {
        if (S.layers.shaker.on) INST.shaker(t, .8);
        finishSong(t);
        return;
      }
    }
    const st = styleNow();
    const pat = secPat(st, S.section);
    const tt = t + (st.swing && m !== '6/8' && s % 4 === 2 ? st.swing * stepDur() : 0)
      + (st.swing16 && s % 2 === 1 ? st.swing16 * stepDur() : 0);

    // Decide a fill when its start step arrives
    if (!fillActive) {
      const target = S.pending || S.section;
      const f = buildFill(target, m);
      if (s === f.start) {
        const auto = S.autoFill > 0 && phraseBar % S.autoFill === 0;
        if (fillQueued || S.pending || auto) {
          fillActive = f; fillQueued = false;
          crashNext = target !== 'intro' && (target !== 'estrofa' || S.pending !== null);
          setFillUi();
        }
      }
    }
    // Shaker and hand percussion
    const shk = SEC_SHK[S.section];
    const sh = shakerStr(st, S.section);
    if (V[sh[s]]) hit('shaker', tt, V[sh[s]] * shk);
    for (const inst of ['tamb', 'conga', 'clap']) { const p = pat[inst]; if (p && V[p[s]]) hit(inst, tt, V[p[s]] * shk); }
    // Drums
    const dyn = SEC_DYN[S.section];
    if (fillActive && s >= fillActive.start) {
      const i = s - fillActive.start;
      for (const [inst, at, v] of fillActive.hits) if (at === i) hit(inst, tt, v);
    } else {
      for (const inst of DRUMS) { const p = pat[inst]; if (p && V[p[s]]) hit(inst, tt, V[p[s]] * dyn); }
      const h = S.human / 100;
      const groove = S.section === 'estrofa' || S.section === 'coro';
      const ghostSlot = m === '6/8' ? s % 2 === 1 : s % 4 === 3;
      if (groove && (pat.snare || pat.rim) && ghostSlot && Math.random() < 0.12 * h) hit('snare', tt, .14);
      if (groove && (pat.hat || pat.ohat) && phraseBar % 4 === 0 && s === M.steps - 2 && Math.random() < 0.7 * h) hit('ohat', tt, .6);
      if (S.section === 'coro' && pat.kick && s === M.steps - 1 && Math.random() < 0.2 * h) hit('kick', tt, .45);
    }
    if (s === M.steps - 1 && fillActive) { fillActive = null; setTimeout(setFillUi, Math.max(0, (t - ctx.currentTime) * 1000 + 60)); }
    const left = S.autoFill ? S.autoFill - ((phraseBar - 1) % S.autoFill) : 0;
    uiQueue.push({ s, t, txt: T('bar', bar, T('sec.' + S.section), left) });
  }

  function finishSong(t) {
    clearInterval(timer); timer = null;
    const ms = Math.max(0, (t - ctx.currentTime) * 1000);
    setTimeout(() => { padStop(4); }, ms);
    setTimeout(() => { stop(true); }, ms + 4200);
  }

  function tick() {
    while (nextTime < ctx.currentTime + 0.12) {
      scheduleStep(step, nextTime);
      if (!timer) return;
      nextTime += stepDur();
      step = (step + 1) % METERS[S.meter].steps;
    }
  }

  let wakeLock = null;
  async function start() {
    initAudio();
    if (ctx.state !== 'running') await ctx.resume();
    $('status').textContent = T('status.loading');
    await loadSamples();
    playing = true; ending = false; step = 0; bar = 0; phraseBar = 0; fillActive = null; fillQueued = false; crashNext = false;
    counting = false; countBars = S.countIn ? 1 : 0;
    if (S.section === 'final') S.section = 'coro';
    S.pending = null; refreshSections();
    padBright();
    nextTime = ctx.currentTime + 0.08;
    timer = setInterval(tick, 25); tick();
    if (!S.countIn) padPlay();
    $('play').classList.add('stop'); $('play').setAttribute('aria-label', T('stop'));
    $('status').textContent = T('status.playing');
    try { wakeLock = await navigator.wakeLock?.request('screen'); } catch (e) {}
  }
  function stop(soft) {
    playing = false;
    if (timer) clearInterval(timer); timer = null;
    padStop(soft ? 0.1 : 0.4);
    ending = false; fillActive = null; fillQueued = false; counting = false; countBars = 0; uiQueue.length = 0;
    if (S.section === 'final') { S.section = 'estrofa'; }
    S.pending = null; refreshSections(); setFillUi();
    $('play').classList.remove('stop'); $('play').setAttribute('aria-label', T('play'));
    $('status').textContent = T('status.stopped');
    drawDots(-1); $('barinfo').textContent = T('ready');
    try { wakeLock?.release(); } catch (e) {}
  }

  // ---------- UI ----------
  function drawDots(curStep) {
    const M = METERS[S.meter];
    const n = M.steps / M.dotEvery;
    const box = $('dots');
    if (box.children.length !== n) {
      box.innerHTML = '';
      for (let i = 0; i < n; i++) { const d = document.createElement('div'); d.className = 'dot'; box.appendChild(d); }
    }
    [...box.children].forEach((d, i) => {
      d.classList.toggle('strong', M.strong.includes(i * M.dotEvery));
      d.classList.toggle('now', curStep >= 0 && Math.floor(curStep / M.dotEvery) === i);
    });
  }
  function frame() {
    if (ctx && playing) {
      let cur = null;
      while (uiQueue.length && uiQueue[0].t <= ctx.currentTime) cur = uiQueue.shift();
      if (cur) { drawDots(cur.s); $('barinfo').textContent = cur.txt; }
    }
    requestAnimationFrame(frame);
  }

  function setBpm(v) {
    S.bpm = Math.max(40, Math.min(220, Math.round(v * 2) / 2));
    $('bpm').textContent = Number.isInteger(S.bpm) ? S.bpm : S.bpm.toFixed(1);
    save();
  }
  function refreshSections() {
    document.querySelectorAll('#sections button').forEach(b => {
      b.classList.toggle('on', b.dataset.s === S.section);
      b.classList.toggle('pending', b.dataset.s === S.pending);
    });
  }
  function setFillUi() { $('fill').classList.toggle('armed', fillQueued || !!fillActive); $('filllbl').textContent = T(fillActive ? 'fill.active' : fillQueued ? 'fill.queued' : 'fill'); }
  function chooseSection(s) {
    if (!playing) { S.section = s === 'final' ? 'coro' : s; refreshSections(); padBright(); save(); return; }
    if (s === S.section && !S.pending) { fillQueued = true; setFillUi(); return; }
    S.pending = s; refreshSections();
  }
  function buildKeys() {
    const k = $('key'); k.innerHTML = '';
    NAMES[S.names].forEach((n, i) => { const o = document.createElement('option'); o.value = i; o.textContent = T('key.opt') + ' ' + n; k.appendChild(o); });
    k.value = S.key; $('names').value = S.names;
  }
  function buildChords() {
    const box = $('chords'); box.innerHTML = '';
    DEGREES.forEach((g, i) => {
      const b = document.createElement('button');
      const name = NAMES[S.names][(S.key + SCALE[g.d]) % 12] + (g.minor ? 'm' : '');
      b.innerHTML = `<b></b><span>${g.roman}</span>`; b.querySelector('b').textContent = name;
      b.classList.toggle('on', i === S.chord);
      b.addEventListener('click', () => { S.chord = i; save(); buildChords(); padPlay(); });
      box.appendChild(b);
    });
  }
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
    S.meter = m; step = 0; fillActive = null;
    $('meter').value = m;
    setUnit(); buildStyles(); drawDots(-1); save();
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
    $('padmode').setAttribute('aria-checked', String(S.padMode === 'fifths'));
    $('padinfo').textContent = NAMES[S.names][S.key] + ' · ' + NM(PADS[S.pad]);
    $('chords').classList.toggle('muted', S.padMode === 'fifths');
  }
  function setCountUi() { $('countin').setAttribute('aria-checked', String(S.countIn)); }
  function bindLayer(k) {
    const btn = $('on-' + k), sl = $('v-' + k);
    btn.classList.toggle('on', S.layers[k].on); sl.value = S.layers[k].vol;
    btn.addEventListener('click', () => { S.layers[k].on = !S.layers[k].on; btn.classList.toggle('on', S.layers[k].on); applyMix(); save(); });
    sl.addEventListener('input', () => { S.layers[k].vol = +sl.value; applyMix(); save(); });
  }

  // ---------- Song list (kept in this browser) ----------
  let songs = [], songTitle = null;
  try { songs = JSON.parse(localStorage.getItem('acomp-songs') || '[]'); } catch (e) {}
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
        S.style = sg.style; S.key = sg.key; S.shaker = sg.shaker || 'auto'; S.chord = 0;
        if (PADS[sg.pad]) S.pad = sg.pad; if (sg.padMode) S.padMode = sg.padMode; if (SHK_SETS[sg.shkSound]) S.shkSound = sg.shkSound;
        buildPadUi(); padSetup();
        buildStyles(); buildShakers(); buildKeys(); buildChords(); save(); padPlay();
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
    const sg = { name, bpm: S.bpm, meter: S.meter, style: S.style, key: S.key, shaker: S.shaker, pad: S.pad, padMode: S.padMode, shkSound: S.shkSound };
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
  $('style').addEventListener('change', (e) => { S.style = e.target.value; save(); });
  $('shaker').addEventListener('change', (e) => { S.shaker = e.target.value; save(); });
  $('shksound').addEventListener('change', (e) => { S.shkSound = e.target.value; save(); });
  $('padtype').addEventListener('change', (e) => { S.pad = e.target.value; save(); buildPadUi(); padSetup(); padPlay(); });
  $('padmode').addEventListener('click', () => { S.padMode = S.padMode === 'fifths' ? 'chord' : 'fifths'; save(); buildPadUi(); padPlay(); });
  $('human').addEventListener('input', (e) => { S.human = +e.target.value; $('humanval').textContent = S.human + ' %'; save(); });
  $('next').addEventListener('click', () => { const order = ['intro', 'estrofa', 'coro', 'puente', 'final']; const cur = S.pending || S.section; chooseSection(order[Math.min(4, order.indexOf(cur) + 1)]); });
  $('countin').addEventListener('click', () => { S.countIn = !S.countIn; setCountUi(); save(); });
  $('autofill').addEventListener('change', (e) => { S.autoFill = +e.target.value; save(); });
  $('fill').addEventListener('click', () => { if (playing && !fillActive && !counting) { fillQueued = !fillQueued; setFillUi(); } });
  document.querySelectorAll('#sections button').forEach(b => b.addEventListener('click', () => chooseSection(b.dataset.s)));
  $('key').addEventListener('change', (e) => { S.key = +e.target.value; save(); buildChords(); buildPadUi(); padPlay(); });
  $('names').addEventListener('change', (e) => { S.names = e.target.value; save(); buildKeys(); buildChords(); renderSongs(); });
  ['shaker', 'drums', 'pad'].forEach(bindLayer);
  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'SELECT' || e.target.tagName === 'INPUT' || e.target.closest?.('.pd')) return;
    const k = e.key.toLowerCase();
    if (k === ' ') { e.preventDefault(); playing ? stop() : start(); }
    else if (k === 'r') $('fill').click();
    else if (k === 't') tap();
    else if (k === 'arrowup') { e.preventDefault(); setBpm(S.bpm + 1); }
    else if (k === 'arrowdown') { e.preventDefault(); setBpm(S.bpm - 1); }
    else if (k.length === 1 && '12345'.includes(k)) chooseSection(['intro', 'estrofa', 'coro', 'puente', 'final'][+k - 1]);
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
  buildShakers();
  buildPadUi();
  $('human').value = S.human; $('humanval').textContent = S.human + ' %';
  setCountUi();
  $('autofill').value = String(S.autoFill);
  $('follow').setAttribute('aria-checked', String(S.follow));
  if (S.section === 'final') S.section = 'estrofa';
  buildKeys(); buildChords(); refreshSections(); setFillUi(); renderSongs(); applyLang();
  window.acompLoaded = () => Object.keys(SB).length;
  requestAnimationFrame(frame);
})();
