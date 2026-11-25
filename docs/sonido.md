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
Detalle completo, mediciones y fuentes: [auditorias/2026-11-23-sonido.md](auditorias/2026-11-23-sonido.md). Decisión: [D-2026-11-23-4](decisiones.md) (pendiente).

**Evaluación (medida 2026-11-23):**
- Ruido bien controlado (colas entre −45 y −80 dB). El problema es la profundidad.
- 32 kHz mono quita el aire sobre 16 kHz y el estéreo; los originales de VCSL son 44.1 kHz estéreo. Hi-hat, cabasa y shakers pequeños tienen el 95 % de su energía pegado a 14–15 kHz.
- Batería: 1–2 capas de fuerza, 0 variantes; la fuerza solo cambia el volumen.
- Colas cortadas: `crash` 1.6 s, `ohat` termina a −53 dB, `tomL`/`tomM` a −54/−56 dB, shakers pequeños entre −35 y −56 dB sin fundido.
- Causa raíz: las reglas "un solo HTML" y "≤ 3 MB" (README §5.8 y regla 6.3).
- Pads: PADsynth está bien para 0 KB; límites: bucle de 5.46 s (2^18 a 48 kHz) y timbres reales imitados.

**Fuentes CC0 / dominio público verificadas:** Big Rusty Drums (CC0-1.0), SM Drums (dominio público), Virtuosity Drums (CC0), Frankensnare y Gogodze Phu (CC0), VCSL sin usar (cajón 5 fuerzas × 2 RR, shaker Double/Roll/Slap, hi-hat, platillos, sleigh bells, claves) y VSCO-2 CE (cuerdas). CC-BY (Naked Drums, DrumGizmo, Salamander) quedan fuera.

**Propuesta de capas y variantes:** batería 3–4 capas × 3–4 RR, colas completas con fundido, 44.1/48 kHz, estéreo en platillos y shakers, normalizar por instrumento (no por archivo).

**Plan de peso (recomendado, opción B):** núcleo actual embebido como respaldo + paquetes HD en AAC .m4a, en una caché propia del service worker que sobreviva a las actualizaciones, descargados con un botón y decodificados solo cuando se usan. Batería + percusión ≈ **5–10 MB**; el tope de 100 MB no hace falta y queda para un experimento de pads pre-generados (opción C, ~30–60 MB). El límite real es la memoria decodificada (~384 KB por segundo estéreo) y la banda de GitHub Pages (100 GB/mes).

## Reglas que no cambian
- Solo CC0 / dominio público, registrado en `samples/CREDITS.md`.
- Cada instrumento tiene respaldo sintético.
- Volumen parejo entre pads (−36 a −32 dB RMS, `tools/_loud.mjs`).
- Si se agregan muestras, actualizar el número esperado en `tools/smoke-test.mjs`.
