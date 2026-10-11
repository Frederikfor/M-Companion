# Créditos de las muestras

Todas las muestras son **CC0 (dominio público)**: se pueden usar, modificar y distribuir sin atribución. Se citan igual para saber de dónde vienen.

| Archivos | Origen | Licencia |
|---|---|---|
| `kickH`, `kickS`, `snareH`, `snareS`, `hat`, `pedal`, `ohat`, `crash`, `tomH`, `tomM`, `tomL`, `tomHs` | Batería acústica de freesound.org (usuario *menegass*), distribuida con Sonic Pi en el paquete npm `supersonic-scsynth-samples` | CC0 |
| `shkH_*`, `shkL_*`, `lshk*`, `cabHit_*`, `cabRub_*`, `tambHit_*`, `tambShk_*`, `conga*`, `clap_*` | Versilian Community Sample Library (VCSL), github.com/sgossner/VCSL | CC0 |

## Procesamiento aplicado
1. Convertidas a WAV PCM 16 bits, 32 kHz, mono.
2. Normalizadas a −1 dB de pico.
3. Silencio inicial recortado a −42 dB.
4. Offset de ataque medido (segundos hasta el pico) y guardado en `offsets.json` y en `SAMPLE_OFF` de `src/engine.js`.

Cualquier muestra nueva debe ser CC0 o dominio público y agregarse a esta tabla.
