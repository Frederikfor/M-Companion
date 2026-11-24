# Funciones y mapa de pantallas

Estado al 2026-11-23, versión 1.8.0. Estados: **estable** (probado y en uso), **beta** (funciona con límites), **oculto**, **pendiente**.
Los `id` del HTML están en README §5.10; aquí van con la ruta en pantalla.

## Mapa de navegación

```
Barra inferior: Tocar | Ritmo | Sonido | Canciones
                                 └─ Sonido › Estructura › Partes › (parte) → Editor de parte (#tab-parte)
                                 └─ Sonido › App › Versión → Novedades (#tab-version)
                                 └─ Sonido › App › Diagnóstico de audio (#tab-diag)
Tocar › nombre de la canción → Canciones
```

## Tocar (`#tab-tocar`) · lo que se usa en vivo
De arriba abajo (diseño C5a, ver [decisiones.md](decisiones.md)):

| Zona | Controles | Qué hace | Estado |
|---|---|---|---|
| Cabecera | Nombre de canción (`.songbtn`), compás (`#meterlbl`), BPM (`#bpm`) | Abre Canciones; cambia compás; muestra tempo | estable |
| Tempo | −5, −, **Marcar tempo** (`#tap`), +, +5 | Ajuste fino y tap tempo | estable |
| Parte | `#partname`, `#partpos` (compás/total → siguiente, ↻ si repite), mapa `#map` | Tocar una parte la elige o la pide para el siguiente compás | estable |
| Acordes de la parte (1.9.0) | `#pchords` (chips con los acordes de la parte, colores por función, el que suena se ilumina también en Manual, lápiz), `#pchuse` *Usar acordes* | Tocar los acordes abre el editor de esa parte (vuelve a Tocar). *Usar acordes* aparece si la parte tiene acordes y el pad no los sigue (Manual o Tónica + 5ª) y pone Auto con acordes completos | nuevo |
| Pad | `< nombre >` (`#padprev`, `#padmid`, `#padnext`) | Cambia el sonido del pad | estable |
| Armonía | Dial de tonalidad (`#dial`), ventana de acordes (`#win`, I IV V / ii vi iii, colores por función), **Auto/Manual** (`#mode`), **Tónica + 5ª** (`#padmode`), leyenda/pista | Elige tono y acorde del pad | estable |
| Zona del pulgar | Canales **Shaker · Batería · Pad · Clic** (`#tiles`, con LED), **Remate** (`#fill`), **Play/Stop** (`#play`), **Siguiente** (`#next`) | Encender canales, remate a mano, transporte | estable |

**Valores por defecto:** desde 1.7.0 el pad está en **Manual + Tónica + 5ª** (D-2026-11-08-2). En ese modo los acordes de la estructura no suenan (`autoChord()` solo actúa en Auto). Desde 1.9.0 Tocar lo hace visible: los acordes de la parte se ven atenuados y aparece *Usar acordes* (D-2026-11-24-2). Los valores por defecto no cambiaron.

## Ritmo (`#tab-ritmo`)
| Grupo | Controles | Estado |
|---|---|---|
| Estilo | Estilo, Patrón de shaker, Sonido del shaker, Tono de la percusión | estable |
| Clic | Pulsos del clic (fuerte/normal/suave/silencio por pulso) | estable |
| Interpretación | Toque humano, **Avanzar por la canción**, Conteo de entrada, Remate automático | estable |
| Micrófono · beta | **Escuchar mi tempo** (`#mic`), **La base me sigue** (`#follow`), lectura `#micread`, mensaje `#micmsg`, dentro de `#micbox` | **oculto desde 1.9.0** (`MIC_UI = false` en `src/engine.js`, código intacto; D-2026-11-24-1). Ver [auditoría](auditorias/2026-11-23-codigo.md#1-micrófono-escuchar-mi-tempo-y-la-base-me-sigue) |

## Sonido (`#tab-sonido`)
| Grupo | Controles | Estado |
|---|---|---|
| Pad | Tonalidad, Sonido del pad, Movimiento, Riqueza, Nombres de notas (Do/C) | estable |
| Mezcla | Volumen y encendido por canal; **Paneo** plegable (Izq/Centro/Der) | estable |
| Estructura de la canción | Pestañas **Orden** (chips, + Añadir) y **Partes** (lista con acordes, + Nueva parte) | estable, **poco descubrible** |
| Editor de parte (`#tab-parte`) | Grados I–vi, ¿cuántos compases? (½/1/2/4), lista de acordes, Quitar, Borrar parte | estable |
| App | Idioma, Versión (Novedades), Diagnóstico de audio, Estadísticas anónimas | estable |

## Canciones (`#tab-canciones`)
| Controles | Qué hace | Estado |
|---|---|---|
| Nombre + Guardar | Guarda tempo, compás, estilo, tono, pad, shaker, avanzar y **la estructura con sus acordes** | estable |
| Lista Mis canciones | Tocar carga y vuelve a Tocar; ✕ dos veces borra | estable |

No guarda mezcla, paneo ni fuerza del clic (son del equipo, README §5.9).

## Funciones pedidas o en discusión
| Función | Estado | Dónde se sigue |
|---|---|---|
| Acordes por parte visibles/editables desde Tocar ("modo construcción") | **hecho en 1.9.0** (opción A: chips en Tocar que abren el editor) | [feedback.md](feedback.md) F-2026-11-22-3, [roadmap.md](roadmap.md) |
| Mejor calidad de batería, shakers y pads (tope ~100 MB) | pendiente (Fase 3) | [sonido.md](sonido.md) |
| Pad de batería (tocar golpes a mano) | pendiente (Fase 4, prototipo primero) | [roadmap.md](roadmap.md) |
| Multitrack + videokaraoke | **descartado** 2026-11-23 | [decisiones.md](decisiones.md) |
| Remates disparados por el micrófono | no existe | [proposito.md](proposito.md) |
| Setlist por servicio | idea abierta | README §7 |
| Transición de acordes ajustable, quitar graves, Pulse | propuesto (análisis PadLab 2026-11-20), sin decidir | [decisiones.md](decisiones.md) |
| Botón "Dar opinión" | en espera de formulario (Tally/Google Forms) | [decisiones.md](decisiones.md) |
| Diseño adaptable a tablet y computadora | pendiente (etapa 4 del plan de nov 2026) | [feedback.md](feedback.md) |
