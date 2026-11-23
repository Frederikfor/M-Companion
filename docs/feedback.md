# Feedback de usuarios

Registro de lo que dicen quienes usan la app. Una fila por comentario con contenido; los elogios se resumen. Nombres abreviados.
Estados: **nuevo**, **en evaluación**, **planeado** (con fase), **hecho** (con versión), **descartado** (con decisión).

## 2026-11-22 · Publicación en Facebook (comunidad de músicos)
Fuente: captura de comentarios compartida por Frederik el 2026-11-23 (hilo del proyecto). Recepción positiva: 6 comentarios de elogio sin pedido ("muy padre", "excelente aporte", "la recomiendo", "la mejor que he visto", 🔥).

| ID | Quién | Qué dijo (resumen fiel) | Lectura | Estado |
|---|---|---|---|---|
| F-2026-11-22-1 | Nahum | Unir el multitrack con videokaraokes, proyectar a una pantalla y mandar el audio a la consola. | Otro producto (reproductor de pistas + video). | **descartado** 2026-11-23 (D-2026-11-23-1) |
| F-2026-11-22-2 | Peniel K. | "Muy práctica; lo único que le faltaría es mejorar la calidad de la batería." | Muestras de batería con pocas capas y sin variantes. | **planeado**, Fase 3 ([sonido.md](sonido.md)) |
| F-2026-11-22-3 | Ariel M. | "No queda claro cómo cambiar los acordes por partes; vi que cuando guardas se puede; debería estar en la página principal en modo construcción." | La estructura está escondida en Sonido › Estructura › Partes; el único texto que la menciona cerca del flujo es el de Guardar en Canciones. Además, por defecto los acordes no suenan (Manual + Tónica + 5ª). | **planeado**, Fase 2 ([auditoría](auditorias/2026-11-23-codigo.md#2-acordes-por-parte)) |
| F-2026-11-22-4 | Jefferson (Jvsmusic) | "Si le agregas un pad drum la rompes." | Pedido de pad de batería para tocar golpes a mano. | **planeado**, Fase 4 (prototipo primero) |
| F-2026-11-22-5 | Luis G. S. | La va a probar y mandará comentarios. | Seguimiento posible. | nuevo |

## 2026-11-08 · Pruebas de Frederik en varios equipos (1.6.0)
| ID | Qué | Estado |
|---|---|---|
| F-2026-11-08-1 | iPhone bien; tablet y computadora se ven raros (diseño solo para teléfono). | pendiente (etapa 4) |
| F-2026-11-08-2 | Redmi Note 14 Pro+ y laptop: chasquidos y cortes, peor al volver de otra app. | **hecho** 1.7.0 (búfer `playback`, corte adaptativo, PADsynth en worker) |
| F-2026-11-08-3 | Probadores quieren quitar el acento del pulso 1 del clic. | **hecho** 1.7.0 (fuerza por pulso) |
| F-2026-11-08-4 | Shaker demasiado brillante. | **hecho** 1.7.0 (filtro + Tono de la percusión) |
| F-2026-11-08-5 | Valores sencillos por defecto: Manual + Tónica + 5ª, sin avanzar solo. | **hecho** 1.7.0 |
| F-2026-11-08-6 | Recoger datos de varios equipos. | parcial: GoatCounter 1.8.0 (uso, no diagnóstico) |

## 2026-10-27 · Frederik
| ID | Qué | Estado |
|---|---|---|
| F-2026-10-27-1 | Con el iPhone bloqueado, el ritmo se detenía o se volvía escaso. | **hecho** 1.3.0 / 1.5.1 |
| F-2026-10-27-2 | Pads oscuros se apagaban con Movimiento alto; coro robótico. | **hecho** 1.5.2 |
| F-2026-10-27-3 | El primer editor de partes era confuso. | **hecho** 1.6.0 (acordes primero) |

## 2026-11-23 · Frederik sobre el micrófono
"Seguir tiempo y seguir ritmo: por el momento ocultémoslas, dado que no están en funcionamiento activo. ¿O sí?" → respuesta con evidencia en la [auditoría](auditorias/2026-11-23-codigo.md#1-micrófono-escuchar-mi-tempo-y-la-base-me-sigue). Estado: **en evaluación** (Fase 2).
