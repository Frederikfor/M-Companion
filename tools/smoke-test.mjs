// Smoke test: opens index.html in headless Chromium, plays, changes parts, visits every tab,
// saves and loads a song, and tries every style, shaker and pad. Fails on any page error.
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

await page.goto(pathToFileURL(path.join(root, 'index.html')).href);
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
await page.click('#sections button[data-s=coro]');
await page.waitForTimeout(300);
const changed = await loudest();
const part = await page.waitForFunction(() => document.querySelector('#sections button[data-s=coro]').classList.contains('on'), null, { timeout: 8000 }).then(() => true, () => false);
if (!part) errors.push('changing to Coro never took effect');
await page.click('#play');
await page.waitForTimeout(150);
const stopped = await page.evaluate(() => window.acompTest.level());
if (stopped > 0.001) errors.push(`rhythm still sounds after Stop (peak ${stopped})`);
await page.click('#play');
await page.waitForTimeout(1500);
for (const [when, v] of [['playing', before], ['frozen', frozen], ['after thaw', after], ['after a change', changed]]) {
  if (!(v > 0.01)) errors.push(`rhythm is silent ${when} (peak ${v})`);
}

await page.click('.tab[data-tab=ritmo]');
for (const id of ['style', 'shaker', 'shksound']) await pickEach(id);
await page.click('.tab[data-tab=sonido]');
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
await page.$eval('#padmove', (m) => { m.value = 100; m.dispatchEvent(new Event('input')); });
await page.evaluate(() => {
  const r = document.getElementById('padrich'); r.value = 50; r.dispatchEvent(new Event('change'));
  document.querySelector('#sections button[data-s=estrofa]').click();
  const s = document.getElementById('padtype'); s.value = 'oracion'; s.dispatchEvent(new Event('change'));
  window.acompTest.padLevel();
});
await page.waitForTimeout(8000);
const padLevels = [];
for (let i = 0; i < 90; i++) { padLevels.push(await page.evaluate(() => window.acompTest.padLevel())); await page.waitForTimeout(100); }
const padLow = 20 * Math.log10(Math.min(...padLevels) + 1e-9), padHigh = 20 * Math.log10(Math.max(...padLevels) + 1e-9);
if (padHigh - padLow > 15) errors.push(`Senoidal with Movement 100 dips ${(padHigh - padLow).toFixed(1)} dB (should sway, not drop out)`);
// Version: the row shows the release, the screen lists every version, and the build matches sw.js's cache.
const ver = await page.evaluate(() => window.acompVersion());
const verRow = (await page.textContent('#versionval')).trim();
await page.click('#version');
const verShown = { cur: (await page.textContent('#vercur')).trim(), build: (await page.textContent('#verbuild')).trim(), entries: await page.$$eval('#changelog .notes', (l) => l.length) };
const sonidoSelected = await page.getAttribute('.tab[data-tab=sonido]', 'aria-selected');
await page.click('#tab-version .back');
const backHome = await page.isVisible('#tab-sonido');
const swCache = fs.readFileSync(path.join(root, 'sw.js'), 'utf8').match(/'acompanante-([^']+)'/)[1];
if (!/^\d+\.\d+\.\d+$/.test(ver.release) || verRow !== ver.release || verShown.cur !== ver.release) errors.push(`version row shows "${verRow}", screen "${verShown.cur}", release "${ver.release}"`);
if (!/^[0-9a-f]{8}$/.test(verShown.build) || swCache !== `${ver.release}-${verShown.build}`) errors.push(`build "${verShown.build}" does not match the cache "${swCache}"`);
if (verShown.entries !== ver.versions || ver.versions < 1) errors.push(`changelog shows ${verShown.entries} of ${ver.versions} versions`);
if (sonidoSelected !== 'true' || !backHome) errors.push('version screen does not open inside Sonido or its back button fails');
await pickEach('lang');
await page.click('.tab[data-tab=canciones]');
await page.fill('#songname', 'Prueba');
await page.click('#savesong');
await page.click('.songload');
await page.waitForTimeout(300);
const title = await page.textContent('#songtitle');
await page.click('#play');
await browser.close();

const samples = 42;
const fails = [];
if (loaded !== samples) fails.push(`expected ${samples} decoded samples, got ${loaded}`);
if (!title.includes('Prueba')) fails.push(`song did not load, title is "${title}"`);
fails.push(...errors);
if (fails.length) { console.error('FAIL\n' + fails.join('\n')); process.exit(1); }
console.log(`OK: ${loaded} samples, all styles, shakers and pads played without errors`);
