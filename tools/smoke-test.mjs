// Smoke test: opens index.html in headless Chromium, goes through the first launch, plays, changes parts,
// plays Ensamble buttons, visits every tab,
// edits the song structure, plays chords by hand, pans the mix, saves and loads a song, and tries
// every style, shaker and pad. Fails on any page error.
// Usage: npm install && node tools/smoke-test.mjs
import { chromium } from 'playwright';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const opts = { headless: true, args: ['--autoplay-policy=no-user-gesture-required'] };
if (process.env.CHROMIUM_PATH) Object.assign(opts, { executablePath: process.env.CHROMIUM_PATH, headless: false, args: [...opts.args, '--headless=new'] });
const browser = await chromium.launch(opts);
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });

// Opens a pull-down menu and picks every item in it, one by one, checking the button shows the choice.
async function pickEach(id) {
  const count = await page.$$eval(`#${id} option`, (os) => os.length);
  for (let i = 0; i < count; i++) {
    await page.click(`.pd[data-for=${id}]`);
    const item = page.locator('.pd-menu .pd-item').nth(i);
    const label = (await item.textContent()).trim();
    await item.click();
    await page.waitForTimeout(150);
    const shown = id === 'meter' ? await page.textContent('#meterlbl') : await page.textContent(`#val-${id}`);
    if (shown.trim() !== label) errors.push(`${id}: picked "${label}" but the button shows "${shown}"`);
  }
}

// Ajustes is one tab with four sections; go('ritmo') opens Ajustes › Ritmo.
async function go(section) {
  await page.click('.tab[data-tab=ajustes]');
  await page.click(`.screen:not([hidden]) .aseg button[data-s=${section}]`);
}

await page.goto(pathToFileURL(path.join(root, 'index.html')).href);
// First launch: language (English here, Chromium's locale), then the centre screen; then the quick tour.
{
  if (!(await page.isVisible('#onb'))) errors.push('the first launch should ask how to start');
  if ((await page.textContent('#onb h2')).trim() !== 'Your first step') errors.push('the first launch should follow the phone language (English)');
  await page.click('#onblang button[data-l=es]');
  if ((await page.textContent('#onb h2')).trim() !== '¿Cómo quieres empezar?') errors.push('Español should switch the first launch to Spanish');
  await page.click('.onb .pick[data-c=pad]');
  await page.waitForTimeout(600);
  const order = await page.$$eval('.tab', (ts) => ts.map((t) => t.dataset.tab).join());
  if (order !== 'ajustes,pad,ens') errors.push(`Pad in the centre should order the tabs ajustes,pad,ens, got ${order}`);
  if (!(await page.isVisible('#coach'))) errors.push('the quick tour should start after the first launch');
  await page.click('#cnext');
  if (!(await page.textContent('#cstep')).includes('2 DE')) errors.push('the tour should move to step 2');
  await page.click('#cskip');
  if (await page.isVisible('#coach')) errors.push('Omitir should close the tour');
}
// Only the pad is on by default, and Remate needs the drums.
{
  const on = await page.$$eval('.tile', (ts) => ts.map((t) => t.dataset.ch + ':' + t.classList.contains('on')).join(' '));
  if (on !== 'shaker:false drums:false pad:true click:false') errors.push(`default channels should be only the pad, got ${on}`);
  if (!(await page.isDisabled('#fill'))) errors.push('Remate should be disabled with the drums off');
  // Simple by default: Manual with root and fifth, the part repeats, no automatic fills.
  const manual = await page.getAttribute('#mode button[data-m=manual]', 'aria-checked'), fifths = await page.getAttribute('#padmode', 'aria-checked');
  const adv = await page.getAttribute('#advance', 'aria-checked'), fill = await page.$eval('#autofill', (s) => s.value);
  if (manual !== 'true' || fifths !== 'true' || adv !== 'false' || fill !== '0') errors.push(`defaults should be Manual, Tónica + 5ª, no Avanzar, no auto fill; got ${manual} ${fifths} ${adv} ${fill}`);
  if (!(await page.textContent('#partpos')).includes('↻')) errors.push('with Avanzar off the part line should show that the part repeats');
}
// The microphone section stays hidden (MIC_UI false) until it works on stage.
if (await page.isVisible('#mic')) errors.push('Ritmo › Micrófono should be hidden');
// The current part's chords show on Tocar. With the simple defaults the pad does not follow them, so
// "Usar acordes" is offered; tapping the chords opens that part's editor, and its back button returns to Tocar.
{
  const chips = await page.$$eval('#pchords .pch-list i', (xs) => xs.length);
  if (chips < 1) errors.push('the chords of the current part should show on Tocar');
  if (!(await page.isVisible('#pchuse'))) errors.push('"Usar acordes" should show while the pad is on Manual / Tónica + 5ª');
  await page.click('#pchords');
  if (!(await page.isVisible('#tab-parte'))) errors.push('tapping the chords on Tocar should open the part editor');
  if ((await page.getAttribute('.tab[data-tab=pad]', 'aria-selected')) !== 'true') errors.push('the part editor opened from Pad should keep Pad selected');
  await page.click('#pback');
  if (!(await page.isVisible('#tab-tocar'))) errors.push('the part editor opened from Tocar should go back to Tocar');
}
// "Usar acordes" puts the pad on Auto with full chords, so the rest of the test plays the song with the pad following it.
await page.click('#pchuse');
{
  const auto = await page.getAttribute('#mode button[data-m=auto]', 'aria-checked'), fifths = await page.getAttribute('#padmode', 'aria-checked');
  if (auto !== 'true' || fifths !== 'false') errors.push(`"Usar acordes" should set Auto without Tónica + 5ª, got ${auto} ${fifths}`);
  if (!(await page.isHidden('#pchuse'))) errors.push('"Usar acordes" should hide once the pad follows the song');
}
await go('ritmo');
await page.click('#advance');
await page.click('.tab[data-tab=pad]');
// Holding a channel opens its options and does not toggle it; holding a part on the map opens its chords.
{
  const box = await page.locator('.tile[data-ch=drums]').boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2); await page.mouse.down();
  await page.waitForTimeout(700); await page.mouse.up();
  if (!(await page.isVisible('.pd-menu'))) errors.push('holding Batería should open the style menu');
  if (await page.$eval('.tile[data-ch=drums]', (t) => t.classList.contains('on'))) errors.push('holding Batería should not turn it on');
  await page.keyboard.press('Escape'); await page.waitForTimeout(200);
  const mb = await page.locator('#map button:nth-child(2)').boundingBox();
  await page.mouse.move(mb.x + mb.width / 2, mb.y + mb.height / 2); await page.mouse.down();
  await page.waitForTimeout(700); await page.mouse.up();
  if (!(await page.isVisible('#tab-parte'))) errors.push('holding a part on the map should open its chords');
  await page.click('#pback');
  if (!(await page.isVisible('#tab-tocar'))) errors.push('the part editor opened from the map should go back to Pad');
}
await page.click('.tile[data-ch=shaker]');
await page.click('.tile[data-ch=drums]');
if (await page.isDisabled('#fill')) errors.push('Remate should be enabled with the drums on');
await page.click('#play');
// The rhythm keeps tempo: each rendered chunk starts where the previous one ends, never on top of it.
await page.waitForTimeout(6000);
{
  const tl = await page.evaluate(() => window.acompTest.chunks());
  if (tl.length < 2) errors.push(`expected several rendered chunks after 6 s, got ${tl.length}`);
  for (let i = 1; i < tl.length; i++) {
    if (Math.abs(tl[i][0] - tl[i - 1][1]) > 0.002) errors.push(`chunk ${i} starts at ${tl[i][0].toFixed(3)} s but the previous one ends at ${tl[i - 1][1].toFixed(3)} s`);
  }
}
await page.waitForTimeout(2500);
const loaded = await page.evaluate(() => window.acompLoaded());
await pickEach('meter');
await page.click('#next');
await page.click('#fill');
await page.waitForTimeout(1500);

// Background: iOS freezes the page's code but not the audio. Stop the clock for longer than
// what is rendered ahead, and the rhythm must keep sounding (its loop takes over).
const loudest = () => page.evaluate(async () => {
  let m = 0;
  for (let i = 0; i < 40; i++) { m = Math.max(m, window.acompTest.level()); await new Promise((r) => setTimeout(r, 50)); }
  return m;
});
const before = await loudest();
await page.evaluate(() => window.acompTest.freeze());
await page.waitForTimeout(12000);
const frozen = await loudest();
await page.evaluate(() => window.acompTest.thaw());
await page.waitForTimeout(1500);
const after = await loudest();
// A change replaces what sounds; Stop silences at once.
await page.click('#p5');
await page.click('#map button:nth-child(3)');
await page.waitForTimeout(300);
const changed = await loudest();
const part = await page.waitForFunction(() => document.querySelector('#map button:nth-child(3)').classList.contains('now') && document.getElementById('partname').textContent.startsWith('Coro'), null, { timeout: 8000 }).then(() => true, () => false);
if (!part) errors.push('changing to Coro never took effect');
// The pad follows the part's chords: the chorus starts on IV for one bar, then goes to I.
{
  const iv = await page.waitForFunction(() => window.acompTest.song().chord === 3, null, { timeout: 4000 }).then(() => true, () => false);
  const i = await page.waitForFunction(() => window.acompTest.song().chord === 0, null, { timeout: 5000 }).then(() => true, () => false);
  if (!iv || !i) errors.push(`the chorus should play IV then I (IV ${iv}, I ${i})`);
  // Tocar lights the chord the song is on.
  const lit = await page.waitForFunction(() => !!document.querySelector('#pchords .pch-list i.now'), null, { timeout: 3000 }).then(() => true, () => false);
  if (!lit) errors.push('Tocar should light the chord of the part that is sounding');
}
// Manual: a tap replaces the chord; holding one and tapping another plays both as one merged chord.
await page.click('#mode button[data-m=manual]');
await page.click('#win button[data-c="5"]');
{
  const a = page.locator('#win button[data-c="5"]'), b = page.locator('#win button[data-c="4"]');
  const ba = await a.boundingBox(), bb = await b.boundingBox();
  await page.mouse.move(ba.x + 10, ba.y + 10); await page.mouse.down();
  await page.evaluate(([x, y]) => { const el = document.elementFromPoint(x, y); el.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, pointerId: 7, clientX: x, clientY: y })); el.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, pointerId: 7, clientX: x, clientY: y })); }, [bb.x + 10, bb.y + 10]);
  await page.mouse.up();
  await page.waitForTimeout(300);
  const sg = await page.evaluate(() => window.acompTest.song()), pd = await page.evaluate(() => window.acompTest.pad());
  if (sg.held.join() !== '5,4' || pd.notes <= 5) errors.push(`holding vi and tapping V should merge both chords, got held ${sg.held} with ${pd.notes} notes`);
  await page.click('#win button[data-c="5"]');
  if ((await page.evaluate(() => window.acompTest.song())).held.join() !== '5') errors.push('a tap in Manual should replace the chords');
  await page.click('#win button[data-c="5"]');
  await page.waitForTimeout(300);
  if ((await page.evaluate(() => window.acompTest.pad())).voices !== 0) errors.push('tapping the only chord in Manual should silence the pad');
}
await page.click('#mode button[data-m=auto]');
await page.click('#play');
await page.waitForTimeout(150);
const stopped = await page.evaluate(() => window.acompTest.level());
if (stopped > 0.001) errors.push(`rhythm still sounds after Stop (peak ${stopped})`);
await page.click('#play');
await page.waitForTimeout(1500);
for (const [when, v] of [['playing', before], ['frozen', frozen], ['after thaw', after], ['after a change', changed]]) {
  if (!(v > 0.01)) errors.push(`rhythm is silent ${when} (peak ${v})`);
}

await go('ritmo');
for (const id of ['style', 'shaker', 'shksound', 'shktone']) await pickEach(id);
// Click beats: one per click of the bar, and a tap steps the level down (strong → normal → soft → silent).
{
  const meter = (await page.textContent('#meterlbl')).trim(), want = { '4/4': 4, '3/4': 3, '6/8': 6 }[meter];
  const n = await page.$$eval('#beats button', (b) => b.length);
  if (n !== want) errors.push(`${meter} should show ${want} click beats, got ${n}`);
  const lv0 = await page.getAttribute('#beats button:nth-child(1)', 'data-lv');
  await page.click('#beats button:nth-child(1)');
  const lv1 = await page.getAttribute('#beats button:nth-child(1)', 'data-lv');
  if (lv0 !== '3' || lv1 !== '2') errors.push(`the first beat should go from strong (3) to normal (2), got ${lv0} → ${lv1}`);
}
await go('sonido');
await pickEach('padtype');
// Pads: the first one plays as a PADsynth loop, Richness re-renders it, and every chord of the key is ready ahead.
await page.click('.pd[data-for=padtype]');
await page.locator('.pd-menu .pd-item').nth(0).click();
await page.waitForTimeout(1500);
await page.evaluate(() => { const r = document.getElementById('padrich'); r.value = 80; r.dispatchEvent(new Event('input')); r.dispatchEvent(new Event('change')); });
await page.$eval('#padmove', (m) => { m.value = 20; m.dispatchEvent(new Event('input')); });
await page.waitForTimeout(1500);
const pad = await page.evaluate(() => window.acompTest.pad());
if (pad.kind !== 'ps' || pad.cached < 6) errors.push(`pad should play a PADsynth loop with 6 chords ready, got ${JSON.stringify(pad)}`);
if ((await page.textContent('#padrichval')).trim() !== '80 %') errors.push('Richness value is not shown');
// Movement at the top must sway a dark pad, never silence it (the filter sweep used to close Senoidal).
// Avanzar goes off meanwhile: a part change in the middle of the 9 s window (Estrofa → Coro) changes the
// brightness on purpose, and how much of it the window caught made this check pass or fail by timing alone.
await page.$eval('#padmove', (m) => { m.value = 100; m.dispatchEvent(new Event('input')); });
await page.evaluate(() => {
  document.getElementById('advance').click();
  const r = document.getElementById('padrich'); r.value = 50; r.dispatchEvent(new Event('change'));
  document.querySelector('#map button:nth-child(2)').click();
  const s = document.getElementById('padtype'); s.value = 'oracion'; s.dispatchEvent(new Event('change'));
  window.acompTest.padLevel();
});
await page.waitForTimeout(8000);
const padLevels = [];
for (let i = 0; i < 90; i++) { padLevels.push(await page.evaluate(() => window.acompTest.padLevel())); await page.waitForTimeout(100); }
const padLow = 20 * Math.log10(Math.min(...padLevels) + 1e-9), padHigh = 20 * Math.log10(Math.max(...padLevels) + 1e-9);
await page.evaluate(() => document.getElementById('advance').click());
if (padHigh - padLow > 15) errors.push(`Senoidal with Movement 100 dips ${(padHigh - padLow).toFixed(1)} dB (should sway, not drop out)`);
// Version: the row shows the release, the screen lists every version, and the build matches sw.js's cache.
await go('app');
const ver = await page.evaluate(() => window.acompVersion());
const verRow = (await page.textContent('#versionval')).trim();
await page.click('#version');
const verShown = { cur: (await page.textContent('#vercur')).trim(), build: (await page.textContent('#verbuild')).trim(), entries: await page.$$eval('#changelog .notes', (l) => l.length) };
const appSelected = await page.getAttribute('.tab[data-tab=ajustes]', 'aria-selected');
await page.click('#tab-version .back');
const backHome = await page.isVisible('#tab-app');
const swCache = fs.readFileSync(path.join(root, 'sw.js'), 'utf8').match(/'acompanante-([^']+)'/)[1];
if (!/^\d+\.\d+\.\d+$/.test(ver.release) || verRow !== ver.release || verShown.cur !== ver.release) errors.push(`version row shows "${verRow}", screen "${verShown.cur}", release "${ver.release}"`);
if (!/^[0-9a-f]{8}$/.test(verShown.build) || swCache !== `${ver.release}-${verShown.build}`) errors.push(`build "${verShown.build}" does not match the cache "${swCache}"`);
if (verShown.entries !== ver.versions || ver.versions < 1) errors.push(`changelog shows ${verShown.entries} of ${ver.versions} versions`);
if (appSelected !== 'true' || !backHome) errors.push('version screen does not open inside Ajustes › App or its back button fails');
// Diagnostics: the screen lists what the device reports and how long the renders took.
await page.click('#diagbtn');
{
  const rows = await page.$$eval('#diaglist .row', (r) => r.map((x) => x.textContent));
  if (rows.length !== 10 || !rows.some((r) => /\d+ \/ \d+ ms/.test(r))) errors.push(`diagnostics should list 10 rows with render times, got ${JSON.stringify(rows)}`);
}
await page.click('#tab-diag .back');
await go('sonido');
// Mix: the pan sides fold out, and a side moves that channel.
await page.click('#panfold');
if (!(await page.isVisible('#panrows'))) errors.push('the pan rows should fold out');
await page.click('#panrows button[data-ch=pad][data-side=R]');
await page.waitForTimeout(200);
{
  const pan = await page.evaluate(() => window.acompTest.pan());
  if (pan.join() !== '0,0,1,-1') errors.push(`pan should be centre, centre, right, left; got ${pan}`);
  if ((await page.textContent('.tile[data-ch=pad] .side')).trim() !== 'DER') errors.push('the Pad tile should show DER');
}
await page.click('#panfold');
await go('canciones');
// Structure: add a part to the order, then give a new part two chords in the editor.
const seqLen = await page.$$eval('#seq .chip:not(.add)', (c) => c.length);
await page.click('#addchip');
await page.locator('.pd-menu .pd-item').nth(0).click();
if (await page.$$eval('#seq .chip:not(.add)', (c) => c.length) !== seqLen + 1) errors.push('Añadir did not add a part to the order');
await page.click('#t-partes');
await page.click('#newrow');
await page.locator('.pd-menu .pd-item').nth(0).click();
if (!(await page.isVisible('#tab-parte'))) errors.push('a new part should open its editor');
await page.click('#degs button:nth-child(4)');
await page.click('#ask .durs button:nth-child(1)');
await page.click('#degs button:nth-child(5)');
await page.click('#ask .durs button:nth-child(3)');
{
  const rows = await page.$$eval('#prog .prow .val', (v) => v.map((x) => x.textContent));
  if (rows.join('|') !== 'medio compás|2 compases') errors.push(`the part should list half a bar and 2 bars, got ${rows}`);
  if (!(await page.textContent('#progcap')).includes('3 compases')) errors.push('2½ bars should round up to 3');
}
await page.click('#prog .prow');
await page.click('#prog .edit .rm');
if (await page.$$eval('#prog .prow', (r) => r.length) !== 1) errors.push('Quitar did not remove the chord');
await page.click('#tab-parte .back');
await page.click('#t-orden');
await go('app');
await pickEach('lang');
await go('canciones');
await page.fill('#songname', 'Prueba');
await page.click('#savesong');
await page.click('.songload');
await page.waitForTimeout(300);
const title = await page.textContent('#songtitle');
// A slow phone: with the CPU six times slower, tempo changes still hand over without a gap
// (the old audio keeps playing until the new chunk is ready) and the loop never has to cover.
{
  const cdp = await page.context().newCDPSession(page);
  await page.click('.tab[data-tab=pad]');
  if (!(await page.$eval('#play', (b) => b.classList.contains('stop')))) await page.click('#play');
  await page.waitForTimeout(2500);
  const d0 = await page.evaluate(() => window.acompTest.diag());
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 6 });
  for (let i = 0; i < 4; i++) { await page.click(i % 2 ? '#m1' : '#p1'); await page.waitForTimeout(1000); }
  const d = await page.evaluate(() => window.acompTest.diag());
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 });
  if (d.late > d0.late || d.loops > d0.loops) errors.push(`on a slow CPU the changes should arrive in time: ${JSON.stringify(d)}`);
  await page.click('#play');
}
// (Last, so the timing of the checks above stays as it was.)
// Ensamble: a hit plays at once, a loop comes in on the next bar and stops when tapped again, a bed picks the pad.
{
  await page.click('.tab[data-tab=ens]');
  if (!(await page.$eval('#play', (b) => b.classList.contains('stop')))) await page.click('#play');
  await page.waitForTimeout(1500);
  if (!(await page.isVisible('#ensgrid')) || await page.isVisible('#win')) errors.push('Ensamble should show its buttons instead of the pad panel');
  await page.click('#ensgrid button:nth-child(1)');
  await page.click('#ensgrid button:nth-child(4)');
  const armed = await page.$eval('#ensgrid button:nth-child(4)', (b) => b.className);
  const on = await page.waitForFunction(() => document.querySelector('#ensgrid button:nth-child(4)').classList.contains('playing'), null, { timeout: 6000 }).then(() => true, () => false);
  if (!armed.includes('armed') || !on) errors.push(`a loop should wait for the next bar, then play (was "${armed}", playing ${on})`);
  await page.click('#ensgrid button:nth-child(5)');
  const swapped = await page.waitForFunction(() => document.querySelector('#ensgrid button:nth-child(5)').classList.contains('playing') && !document.querySelector('#ensgrid button:nth-child(4)').classList.contains('playing'), null, { timeout: 6000 }).then(() => true, () => false);
  if (!swapped) errors.push('a new loop should replace the one playing on the next bar');
  await page.click('#ensgrid button:nth-child(5)');
  await page.click('#ensgrid button:nth-child(7)');
  if ((await page.$eval('#padtype', (s) => s.value)) !== 'cuerdas') errors.push('the Cuerdas bed should pick the Cuerdas pad');
  await page.click('#ensedit');
  await page.click('#ensgrid button:nth-child(9)', { force: true }); // the buttons jiggle in Editar
  if (!(await page.isVisible('#sheet'))) errors.push('in Editar, tapping a button should open the sounds');
  await page.click('#sheet .opt.rm');
  if (!(await page.$eval('#ensgrid button:nth-child(9)', (b) => b.classList.contains('empty')))) errors.push('Quitar should empty the button');
  await page.click('#ensedit');
  await page.click('#helpbtn');
  if (!(await page.isVisible('#sheet'))) errors.push('? should open the help');
  await page.click('#sheet .btn');
  await page.click('#play');
  await page.click('.tab[data-tab=pad]');
}
await browser.close();

const samples = 42;
const fails = [];
if (loaded !== samples) fails.push(`expected ${samples} decoded samples, got ${loaded}`);
if (!title.includes('Prueba')) fails.push(`song did not load, title is "${title}"`);
fails.push(...errors);
if (fails.length) { console.error('FAIL\n' + fails.join('\n')); process.exit(1); }
console.log(`OK: ${loaded} samples, all styles, shakers and pads played without errors`);
