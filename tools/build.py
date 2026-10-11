#!/usr/bin/env python3
"""Builds the app from src/ and samples/.

Outputs (never edit them by hand):
  index.html               the PWA page that GitHub Pages serves
  sw.js                    service worker, cache name stamped with a content hash
  dist/acompanante.html    the same app as one standalone file (offline, shareable)

Run from anywhere:  python3 tools/build.py
"""
import base64, glob, hashlib, json, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
p = lambda *a: os.path.join(ROOT, *a)

engine = open(p('src', 'engine.js'), encoding='utf-8').read()
if '/*SAMPLES*/{}' not in engine:
    raise SystemExit('src/engine.js must keep the placeholder: const SAMPLE_DATA = /*SAMPLES*/{};')
samples = {os.path.basename(f)[:-4]: base64.b64encode(open(f, 'rb').read()).decode()
           for f in sorted(glob.glob(p('samples', '*.wav')))}
js = engine.replace('/*SAMPLES*/{}', json.dumps(samples))
ui = open(p('src', 'ui.html'), encoding='utf-8').read()
page = ui + '\n<script>\n' + js + '</script>\n'

os.makedirs(p('dist'), exist_ok=True)
open(p('dist', 'acompanante.html'), 'w', encoding='utf-8').write(page)

head = '''<!doctype html>
<html lang="es"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="#000000">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="Acompañante">
<link rel="manifest" href="manifest.webmanifest">
<link rel="apple-touch-icon" href="icons/icon-180.png">
<link rel="icon" href="icons/icon-192.png">
</head><body>
'''
tail = '''<script>if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('sw.js').catch(() => {});</script>
</body></html>
'''
index = head + page + tail
open(p('index.html'), 'w', encoding='utf-8').write(index)

version = hashlib.sha1(index.encode('utf-8')).hexdigest()[:8]
sw = open(p('src', 'sw.template.js'), encoding='utf-8').read().replace('__VERSION__', version)
open(p('sw.js'), 'w', encoding='utf-8').write(sw)

print(f'{len(samples)} samples, index.html {len(index) // 1024} KB, cache acompanante-{version}')
