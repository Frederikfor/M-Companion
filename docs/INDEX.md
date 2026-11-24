# Índice de documentación · M-Companion

Punto de entrada para personas y agentes. Lee esto primero, abre solo el archivo que responde tu pregunta y vuelve aquí.

**Fuente de verdad técnica:** [`README.md`](../README.md) (formatos, contrato UI/motor, reglas de identidad). Los archivos de `docs/` explican el *por qué*, el estado y la historia; no repiten los formatos del README, los enlazan.

## Busca por pregunta

| Pregunta | Dónde |
|---|---|
| ¿Qué es la app, para quién y qué **no** es? | [proposito.md](proposito.md) |
| ¿Cómo decidimos y trabajamos (design thinking + ágil)? | [metodologia.md](metodologia.md) |
| ¿Qué pantallas, botones y funciones hay, y en qué estado está cada una? | [funciones.md](funciones.md) |
| ¿Dónde está el código de X? ¿Cómo se construye, prueba y publica? | [arquitectura.md](arquitectura.md) → README §3, §4, §5.10, §5.11 |
| ¿Qué muestras y pads hay, de dónde vienen, cuánto pesan? | [sonido.md](sonido.md) → README §5.5, §5.8 |
| ¿Qué principios de diseño e interfaz seguimos? Colores, tamaños | [diseno.md](diseno.md) → README §6 |
| ¿Por qué se decidió X? ¿Qué se descartó? | [decisiones.md](decisiones.md) |
| ¿Qué han pedido o dicho los usuarios? | [feedback.md](feedback.md) |
| ¿Qué sigue? Fases y pendientes | [roadmap.md](roadmap.md) |
| Resultados de auditorías y pruebas medidas | [auditorias/](auditorias/) |

## Busca por tema (atajos al README)

| Tema | README |
|---|---|
| Prompt del proyecto para agentes | §2 |
| Secuencia obligatoria de cambio (editar `src/` → `build.py` → `npm test` → commit) | §4 |
| Dónde se cambia cada cosa (`STYLES`, `PADS`, `buildFill`…) | §4 tabla final |
| Notación de patrones y compases | §5.1–5.3 |
| Partes de la canción, estructura y acordes (`S.song`) | §5.4 |
| Pads y PADsynth | §5.5 |
| Remates | §5.6 |
| Estado guardado (`localStorage`) y compatibilidad | §5.9 |
| `id` que el motor espera en el HTML | §5.10 |
| Motor de audio (tramos, worker, latencia) | §5.11 |
| Idiomas (`I18N`) | §5.12 |
| Versiones y changelog | §5.13 |
| Estadísticas anónimas (GoatCounter) | §5.14 |
| Reglas de identidad y tokens de color | §6 |

## Datos rápidos

- **App publicada:** https://frederikfor.github.io/M-Companion/ (GitHub Pages, rama `main`, raíz).
- **Repositorio:** https://github.com/frederikfor/m-companion
- **Versión actual:** ver la primera entrada de [`src/changelog.json`](../src/changelog.json) (1.8.0 al 2026-11-23).
- **Analítica:** GoatCounter, panel https://forozco.goatcounter.com/ (sin cookies). Ver README §5.14.
- **Dueño del producto:** Frederik (músico de iglesia, prueba en iPhone).
- **Copia vieja:** `/mnt/project-files/acompanante/` del proyecto es una versión anterior al repo (800 líneas de `script.js` contra 2068 de `src/engine.js`). No es fuente de verdad.

## Cómo mantener esta documentación

1. Una decisión nueva → una fila en [decisiones.md](decisiones.md) con fecha, fuente y enlace (PR, hilo, artículo).
2. Un comentario de usuario → una fila en [feedback.md](feedback.md) y, si se actúa, el enlace a la decisión.
3. Una función cambia de estado → [funciones.md](funciones.md).
4. Un formato o contrato cambia → README (no aquí).
5. Una auditoría o medición → archivo nuevo `auditorias/AAAA-MM-DD-tema.md` y una línea en este índice.
6. Fechas siempre absolutas (AAAA-MM-DD). Español.

## Auditorías

| Fecha | Tema | Archivo |
|---|---|---|
| 2026-11-23 | Código: micrófono (seguir tempo), acordes por parte, mapa de pantallas | [auditorias/2026-11-23-codigo.md](auditorias/2026-11-23-codigo.md) |
| pendiente | Calidad de sonido (batería, shakers, pads) y fuentes CC0 | [sonido.md](sonido.md) §Auditoría |
| 2026-11-24 | Qué dicen los músicos sobre pads de batería y acompañamiento (reseñas y foros) | [auditorias/2026-11-24-pad-bateria-usuarios.md](auditorias/2026-11-24-pad-bateria-usuarios.md) |
| 2026-11-24 | Prototipo interactivo de navegación (Ajustes · centro · Pad/Tocar, modo sencillo y avanzado) | [prototipos/navegacion-2026-11-24.html](prototipos/navegacion-2026-11-24.html) |
| 2026-11-23 | Interfaz y principios de UX para apps en vivo (P1–P10, H1–H10, opciones de pad de batería) | [diseno.md](diseno.md) §Principios de UX |
