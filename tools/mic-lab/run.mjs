// Microphone lab: plays a WAV into a fake microphone and logs what Ritmo › Micrófono reads.
// Usage: python3 tools/build.py && python3 tools/mic-lab/gen.py /tmp/mic && node tools/mic-lab/run.mjs /tmp/mic/g76.wav [follow 0|1] [seconds]
// In the cloud: CHROMIUM_PATH=/opt/pw-browsers/chromium node tools/mic-lab/run.mjs …
import { chromium } from 'playwright';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const [wav, follow = '0', secs = '20'] = process.argv.slice(2);
if (!wav) { console.error('usage: run.mjs <file.wav> [follow 0|1] [seconds]'); process.exit(1); }
const args = ['--autoplay-policy=no-user-gesture-required', '--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream',
  `--use-file-for-fake-audio-capture=${path.resolve(wav)}%noloop`];
const opts = { headless: true, args };
if (process.env.CHROMIUM_PATH) Object.assign(opts, { executablePath: process.env.CHROMIUM_PATH, headless: false, args: [...args, '--headless=new'] });
const b = await chromium.launch(opts);
const p = await b.newPage();
await p.goto(pathToFileURL(path.join(root, 'index.html')).href);
await p.waitForTimeout(1500);
await p.evaluate(() => window.acompShow('ritmo'));
if (follow === '1') await p.click('#follow');
await p.click('#mic');
console.log(path.basename(wav), 'follow=' + follow);
for (let i = 1; i <= +secs; i++) {
  await p.waitForTimeout(1000);
  if (i % 5 === 0) console.log(`${i}s bpm=${await p.textContent('#bpm')} | ${(await p.textContent('#micread')).trim()} | ${(await p.textContent('#micmsg')).trim()}`);
}
await b.close();
