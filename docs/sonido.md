# Sonido

Formatos y reglas: README §5.5 (pads), §5.8 (muestras). Licencias: [`samples/CREDITS.md`](../samples/CREDITS.md).

## Inventario actual (2026-11-23)

**Total:** 42 muestras, 1.3 MB en WAV (32 kHz, mono, 16 bits), embebidas en `index.html` (~1.76 MB en total).

| Grupo | Archivos | Origen | Capas de intensidad | Variantes |
|---|---|---|---|---|
| Bombo | `kickH`, `kickS` | freesound *menegass* vía Sonic Pi (CC0) | 2 (fuerte/suave) | 1 |
| Caja | `snareH`, `snareS` | idem | 2 | 1 |
| Hi-hat | `hat`, `pedal`, `ohat` | idem | 1 | 1 |
| Platillo | `crash` | idem | 1 | 1 |
| Toms | `tomH`, `tomHs`, `tomM`, `tomL` | idem | 1 (tomH tiene 2) | 1 |
| Shaker pequeño | `shkH_Down_1/2`, `shkH_Up_1/2` | VCSL (CC0) | 1 | 2 |
| Shaker grande | `shkL_Down_1/2`, `shkL_Up_1/2` | VCSL | 1 | 2 |
| Shaker de cuero, cabasa | `lshk*`, `cabHit_1/2`, `cabRub_1..3` | VCSL | 1 | 2–3 |
| Pandero | `tambHit_1/2`, `tambShk_1/2` | VCSL | 1 | 2 |
| Conga | `conga_1/2`, `congaO_1` | VCSL | 1 | 1–2 |
| Palmas | `clap_1..4` | VCSL | 1 | 4 |

**Pads:** no usan muestras. 14 sonidos sintetizados (PADsynth en worker; Rhodes y Gospel B3 con osciladores). Lista y grupos en README §5.5.

**Límites conocidos (antes de la auditoría):**
- La batería tiene 1–2 capas por pieza y ninguna variante (round-robin): suena repetitiva. Un usuario lo dijo (ver [feedback.md](feedback.md) F-2026-11-22-2).
- 32 kHz corta sobre ~16 kHz: aceptable para shaker en celular, limitado para platillos.
- No existen buenas librerías de pads CC0 (búsqueda 2026-10-27); por eso se sintetizan.
- Fuentes CC0 ya identificadas: VCSL (Steinway B, Kawai, órgano, más percusión), VSCO-2 CE (cuerdas). Salamander Grand Piano es CC-BY: **no** sirve.

## Auditoría de calidad
> **Sección reservada para el hilo "Auditoría de sonido" (Fase 0, 2026-11-23).** Debe dejar aquí: evaluación de batería, shakers y pads; fuentes CC0 candidatas con enlace y licencia; propuesta de capas/variantes; plan de peso dentro del tope de ~100 MB con carga por demanda; y una línea en [decisiones.md](decisiones.md).

## Reglas que no cambian
- Solo CC0 / dominio público, registrado en `samples/CREDITS.md`.
- Cada instrumento tiene respaldo sintético.
- Volumen parejo entre pads (−36 a −32 dB RMS, `tools/_loud.mjs`).
- Si se agregan muestras, actualizar el número esperado en `tools/smoke-test.mjs`.
