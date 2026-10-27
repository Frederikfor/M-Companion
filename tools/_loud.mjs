import { chromium } from 'playwright';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', headless:false, args:['--headless=new','--autoplay-policy=no-user-gesture-required'] });
const p = await b.newPage({viewport:{width:390,height:844}});
const errs=[]; p.on('pageerror', e=>errs.push(e.message));
await p.addInitScript(() => {
  const AC = window.AudioContext;
  window.AudioContext = function(...a){ const c = new AC(...a); window.__ctx = c; return c; };
  window.AudioContext.prototype = AC.prototype;
  const orig = AudioNode.prototype.connect;
  AudioNode.prototype.connect = function(t, ...r){
    if (window.__ctx && t === window.__ctx.destination && !window.__an) { const an = window.__ctx.createAnalyser(); an.fftSize = 2048; orig.call(this, an); window.__an = an; }
    return orig.call(this, t, ...r);
  };
  localStorage.setItem('acomp', JSON.stringify({ layers: { shaker: { on: false, vol: 60 }, drums: { on: false, vol: 75 }, pad: { on: true, vol: 50 } }, countIn: false }));
});
await p.goto('file://' + process.cwd() + '/index.html');
await p.click('#play'); await p.waitForTimeout(1500);
await p.click('.tab[data-tab=sonido]');
const ids = await p.$$eval('#padtype option', os => os.map(o => o.value));
for (const id of ids) {
  await p.evaluate((v) => { const s = document.getElementById('padtype'); s.value = v; s.dispatchEvent(new Event('change')); }, id); await p.waitForTimeout(5500);
  const r = await p.evaluate(async () => { let s=0,n=0,pk=0; const d=new Float32Array(2048); for(let k=0;k<20;k++){ window.__an.getFloatTimeDomainData(d); for(const x of d){s+=x*x;n++;pk=Math.max(pk,Math.abs(x));} await new Promise(r=>setTimeout(r,50)); } return [20*Math.log10(Math.sqrt(s/n)), 20*Math.log10(pk)]; });
  const k = await p.evaluate(() => window.acompTest.pad());
  console.log(id.padEnd(11), r.map(x=>x.toFixed(1)).join(' dB  '), k.kind, k.ms + ' ms');
}
console.log('errors', errs);
await b.close();
