#!/usr/bin/env python3
"""Builds the app from src/ and samples/.

The version shown in the app is the first entry of src/changelog.json (newest first); the build
id is a content hash. Both go into the service worker's cache name, so the app and the offline
cache always name the same build.

Outputs (never edit them by hand):
  index.html               the PWA page that GitHub Pages serves
  sw.js                    service worker, cache name stamped with a content hash
  dist/acompanante.html    the same app as one standalone file (offline, shareable)

Run from anywhere:  python3 tools/build.py
"""
import base64, glob, hashlib, json, os, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
p = lambda *a: os.path.join(ROOT, *a)

engine = open(p('src', 'engine.js'), encoding='utf-8').read()
if '/*SAMPLES*/{}' not in engine:
    raise SystemExit('src/engine.js must keep the placeholder: const SAMPLE_DATA = /*SAMPLES*/{};')
samples = {os.path.basename(f)[:-4]: base64.b64encode(open(f, 'rb').read()).decode()
           for f in sorted(glob.glob(p('samples', '*.wav')))}
if '/*CHANGELOG*/[]' not in engine or "'__BUILD__'" not in engine:
    raise SystemExit("src/engine.js must keep the placeholders: /*CHANGELOG*/[] and '__BUILD__'")

changelog = json.load(open(p('src', 'changelog.json'), encoding='utf-8'))
seen = set()
for e in changelog:
    v = e.get('version', '')
    if not re.fullmatch(r'\d+\.\d+\.\d+', v) or v in seen:
        raise SystemExit(f'src/changelog.json: version "{v}" must be X.Y.Z and unique')
    if not re.fullmatch(r'\d{4}-\d{2}-\d{2}', e.get('date', '')):
        raise SystemExit(f'src/changelog.json: {v} needs a date as YYYY-MM-DD')
    if not (e.get('es') and e.get('en')):
        raise SystemExit(f'src/changelog.json: {v} needs notes in both "es" and "en"')
    seen.add(v)
if not changelog:
    raise SystemExit('src/changelog.json needs at least one version')
order = [tuple(map(int, e['version'].split('.'))) for e in changelog]
if order != sorted(order, reverse=True):
    raise SystemExit('src/changelog.json: list versions newest first')
release = changelog[0]['version']

js = engine.replace('/*SAMPLES*/{}', json.dumps(samples)).replace('/*CHANGELOG*/[]', json.dumps(changelog, ensure_ascii=False))
ui = open(p('src', 'ui.html'), encoding='utf-8').read()
page = ui + '\n<script>\n' + js + '</script>\n'

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
# The hash is taken with the '__BUILD__' placeholder still in place, then stamped into the page.
build = hashlib.sha1(index.encode('utf-8')).hexdigest()[:8]
stamp = lambda html: html.replace("'__BUILD__'", f"'{build}'")
open(p('index.html'), 'w', encoding='utf-8').write(stamp(index))
os.makedirs(p('dist'), exist_ok=True)
open(p('dist', 'acompanante.html'), 'w', encoding='utf-8').write(stamp(page))

cache = f'{release}-{build}'
sw = open(p('src', 'sw.template.js'), encoding='utf-8').read().replace('__VERSION__', cache)
open(p('sw.js'), 'w', encoding='utf-8').write(sw)

print(f'{len(samples)} samples, index.html {len(index) // 1024} KB, version {release}, cache acompanante-{cache}')
