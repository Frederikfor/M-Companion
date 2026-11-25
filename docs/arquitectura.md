# Arquitectura, build y pruebas

Resumen para orientarse. Los detalles y formatos están en el README; aquí está el mapa.

## Piezas
| Archivo | Rol | Líneas (2026-11-23) |
|---|---|---|
| `src/ui.html` | Estilos, 4 pestañas y pantallas internas, menús pull-down, navegación (`acompShow`, `acompMenu`) | 575 |
| `src/engine.js` | Datos musicales (`STYLES`, `SHAKERS`, `PADS`, `SHK_SETS`, `PART_SEC`), estado `S`, `I18N`, motor de audio, lógica de UI | 2068 |
| `src/changelog.json` | Versión y novedades es/en | — |
| `src/sw.template.js` | Service worker (caché offline) | 18 |
| `samples/*.wav` | 42 muestras CC0, 32 kHz mono, se embeben en base64 | 1.3 MB |
| `tools/build.py` | Genera `index.html`, `sw.js`, `dist/acompanante.html` | 78 |
| `tools/smoke-test.mjs` | Prueba en Chromium sin pantalla | 248 |
| `tools/_loud.mjs` | Mide el volumen de cada pad | 27 |
| `tools/mic-lab/` | Banco de pruebas del micrófono con audio simulado (2026-11-23) | — |

Generados (no editar a mano): `index.html` (~1.76 MB), `sw.js`, `dist/acompanante.html`.

## Mapa de `src/engine.js` (aprox., busca por nombre)
| Bloque | Símbolos | Línea aprox. |
|---|---|---|
| Datos musicales | `STYLES`, `SHAKERS`, `PART_SEC`, `DEFAULT_SONG`, `validSong`, `PADS`, `SHK_SETS` | 24–173 |
| Textos | `I18N` (es, en) | 174–350 |
| Estado | `S`, migración `simple17` | 353–381 |
| Estadísticas | `stat()` | 389 |
| Audio base | `SYN` (respaldo sintético), `SAMPLE_OFF`, `INST` | 535–660 |
| Remates | `buildFill()` | 672 |
| Pad | `psCore()` (PADsynth, también en worker), `padPlay()`, `autoChord()` | 739–1010 |
| Ritmo | `scheduleStep()`, `renderNext()` (tramos en `OfflineAudioContext`), `interrupt()` | 1011–1260 |
| Pantalla Tocar | `drawPos()` (parte/mapa/siguiente), `choosePart()`, `buildWin()`, `paintWin()` | 1360–1560 |
| Estructura | `renderSeq()`, `renderParts()`, `editPart()`, `drawPart()` | 1640–1760 |
| Diagnóstico | `diagRows()` | 1820 |
| Canciones | `renderSongs()`, guardar | 1840–1900 |
| Micrófono | `micStart()`, `analyze()`, `estimate()` | 1940–2025 |
| Arranque | Boot | 2028– |

## Flujo de cambio (obligatorio, README §4)
1. Editar solo `src/`, `samples/`, `icons/`, `manifest.webmanifest`.
2. `python3 tools/build.py`
3. `npm test` → debe decir `OK`. En la nube: `CHROMIUM_PATH=/opt/pw-browsers/chromium npm test`.
4. Commit de fuentes y generados juntos.
5. PR a `main`; al fusionar, GitHub Pages publica en minutos. El iPhone toma la versión la segunda vez que abre la app.

## Conceptos del motor que hay que respetar
- **Ritmo pre-generado por tramos** (para sobrevivir pantalla bloqueada en iOS). Toda función rítmica nueva pasa por `scheduleStep`/`renderNext`, nunca por `setTimeout`. Ver [decisiones.md](decisiones.md) D-2026-10-27-1.
- **Pad en worker** (PADsynth). Nunca vibrato rápido sobre un bucle PADsynth.
- **Cambios de parte en el 1**; `interrupt()` reemplaza lo que suena sin huecos.
- **Contrato de `id`** entre HTML y motor: README §5.10.

## Pruebas que existen y lo que no cubren
| Cubre | No cubre |
|---|---|
| Arranque, canales por defecto, Play, cambio de parte, estructura, Manual, paneo, guardar/cargar, cada estilo/shaker/pad, pantalla congelada | Micrófono (ninguna prueba hasta `tools/mic-lab/`), calidad sonora, diseño en tablet |
