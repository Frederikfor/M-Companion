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
await page.waitForTimeout(2500);
const loaded = await page.evaluate(() => window.acompLoaded());
await pickEach('meter');
await page.click('#next');
await page.click('#fill');
await page.waitForTimeout(1500);

await page.click('.tab[data-tab=ritmo]');
for (const id of ['style', 'shaker', 'shksound']) await pickEach(id);
await page.click('.tab[data-tab=sonido]');
await pickEach('padtype');
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
