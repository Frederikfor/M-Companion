// Smoke test: opens index.html in headless Chromium, plays, changes parts, visits every tab,
// saves and loads a song, and tries every style, shaker and pad. Fails on any page error.
// Usage: npm install && node tools/smoke-test.mjs
import { chromium } from 'playwright';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const opts = { headless: true, args: ['--autoplay-policy=no-user-gesture-required'] };
if (process.env.CHROMIUM_PATH) Object.assign(opts, { executablePath: process.env.CHROMIUM_PATH, headless: false, args: [...opts.args, '--headless=new'] });
const browser = await chromium.launch(opts);
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });

await page.goto(pathToFileURL(path.join(root, 'index.html')).href);
await page.click('#play');
await page.waitForTimeout(2500);
const loaded = await page.evaluate(() => window.acompLoaded());
await page.click('#next');
await page.click('#fill');
await page.waitForTimeout(1500);

await page.click('.tab[data-tab=ritmo]');
for (const sel of ['#style', '#shaker', '#shksound']) {
  const values = await page.$$eval(`${sel} option`, (os) => os.map((o) => o.value));
  for (const v of values) { await page.selectOption(sel, v); await page.waitForTimeout(150); }
}
await page.click('.tab[data-tab=sonido]');
for (const sel of ['#padtype']) {
  const values = await page.$$eval(`${sel} option`, (os) => os.map((o) => o.value));
  for (const v of values) { await page.selectOption(sel, v); await page.waitForTimeout(150); }
}
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
