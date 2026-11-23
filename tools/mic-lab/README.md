# Banco de pruebas del micrófono

Reproduce tomas sintéticas en un micrófono falso de Chromium y registra lo que muestra Ritmo › Micrófono (app en 72 BPM).
Resultados del 2026-11-23: [docs/auditorias/2026-11-23-codigo.md](../../docs/auditorias/2026-11-23-codigo.md).

```
python3 tools/build.py
python3 tools/mic-lab/gen.py /tmp/mic          # g72, g76, g72to80, bleed, half76, silence (.wav, 60 s)
node tools/mic-lab/run.mjs /tmp/mic/bleed.wav 0 20
```
En la nube anteponer `CHROMIUM_PATH=/opt/pw-browsers/chromium`. Los WAV no se suben al repo.
