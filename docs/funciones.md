# Funciones y mapa de pantallas

Estado al 2026-11-24, versión 2.0.0. Estados: **estable** (probado y en uso), **beta** (funciona con límites), **oculto**, **pendiente**.
Los `id` del HTML están en README §5.10; aquí van con la ruta en pantalla.

## Mapa de navegación

```
Primera vez: idioma + pantalla del centro (#onb) → guía rápida de 6 pasos (#coach)
Barra inferior (orden fijo): Ajustes | centro | la otra        (centro = Pad o Ensamble, en Ajustes › App)
  Ajustes › Ritmo | Sonido | Canciones | App                    (botones .aseg arriba de cada sección)
          Canciones › Estructura › Partes › (parte) → Editor de parte (#tab-parte)
          App › Versión → Novedades (#tab-version) · App › Diagnóstico de audio (#tab-diag)
Pad o Ensamble › nombre de la canción → Ajustes › Canciones
Pad o Ensamble › mantener una parte del mapa → Editor de parte · mantener un canal → su menú (Clic → Ritmo)
? (junto al BPM) → centro de ayuda (hoja) → Muéstramelo (señala en pantalla)
```

## Pad (`#tab-tocar[data-view=pad]`) · lo que se usa en vivo
De arriba abajo (diseño C5a, ver [decisiones.md](decisiones.md)):

| Zona | Controles | Qué hace | Estado |
|---|---|---|---|
| Cabecera | Nombre de canción (`.songbtn`), compás (`#meterlbl`), BPM (`#bpm`), **?** (`#helpbtn`, 2.0) | Abre Canciones; cambia compás; muestra tempo; abre la ayuda | estable |
| Tempo | −5, −, **Marcar tempo** (`#tap`), +, +5 | Ajuste fino y tap tempo | estable |
| Parte | `#partname`, `#partpos` (compás/total → siguiente, ↻ si repite), mapa `#map` | Tocar una parte la elige o la pide para el siguiente compás | estable |
| Acordes de la parte (1.9.0) | `#pchords` (chips con los acordes de la parte, colores por función, el que suena se ilumina también en Manual, lápiz), `#pchuse` *Usar acordes* | Tocar los acordes abre el editor de esa parte (vuelve a Tocar). *Usar acordes* aparece si la parte tiene acordes y el pad no los sigue (Manual o Tónica + 5ª) y pone Auto con acordes completos | nuevo |
| Pad | `< nombre >` (`#padprev`, `#padmid`, `#padnext`) | Cambia el sonido del pad | estable |
| Armonía | Dial de tonalidad (`#dial`), ventana de acordes (`#win`, I IV V / ii vi iii, colores por función), **Auto/Manual** (`#mode`), **Tónica + 5ª** (`#padmode`), leyenda/pista | Elige tono y acorde del pad | estable |
| Zona del pulgar | Canales **Shaker · Batería · Pad · Clic** (`#tiles`, con LED), **Remate** (`#fill`), **Play/Stop** (`#play`), **Siguiente** (`#next`) | Encender canales (tocar) o configurarlos (mantener, 2.0), remate a mano, transporte. Play con todo apagado en Pad enciende el Pad y lo avisa | estable |

**Valores por defecto:** desde 1.7.0 el pad está en **Manual + Tónica + 5ª** (D-2026-11-08-2). En ese modo los acordes de la estructura no suenan (`autoChord()` solo actúa en Auto). Desde 1.9.0 Tocar lo hace visible: los acordes de la parte se ven atenuados y aparece *Usar acordes* (D-2026-11-24-2). Los valores por defecto no cambiaron.

## Ensamble (`#tab-tocar[data-view=ens]`) · nuevo en 2.0
Comparte cabecera, tempo, parte, acordes, mapa, canales y transporte con Pad; cambia el panel del pad por 9 botones.
| Zona | Controles | Qué hace | Estado |
|---|---|---|---|
| Cabecera | Banco A/B (`#bank`, solo en modo avanzado), texto de contexto (`#ensctx`), **Editar** (`#ensedit`) | Elige banco; entra al modo edición (los botones tiemblan) | nuevo |
| Botones (`#ensgrid`) | **Golpe** (naranja), **Loop** (verde), **Fondo** (azul); vacío con + | Golpe: suena una vez en la próxima 1/16. Loop: entra en el próximo compás, se repite, se detiene al tocarlo; uno a la vez. Fondo: elige ese sonido en el canal Pad. En Editar (o manteniendo): hoja para cambiar o quitar | nuevo |

Sonidos: golpes Crash, Bombo + crash, Aplauso, Aro, Toms bajando, Corte (calla la batería un compás); loops Toms tribal, Pandero, Shaker 1/16, Conga, Bombo a negras; fondos con los pads Cuerdas, Rhodes, Shimmer, Gospel B3, Coro "Aah", Senoidal y Supersaw. Todos con las muestras que ya tiene la app; los paquetes HD son la Fase 3.

## Ajustes › Ritmo (`#tab-ritmo`)
| Grupo | Controles | Estado |
|---|---|---|
| Estilo | Estilo, Patrón de shaker, Sonido del shaker, Tono de la percusión | estable |
| Clic | Pulsos del clic (fuerte/normal/suave/silencio por pulso) | estable |
| Interpretación | Toque humano, **Avanzar por la canción**, Conteo de entrada, Remate automático | estable |
| Micrófono · beta | **Escuchar mi tempo** (`#mic`), **La base me sigue** (`#follow`), lectura `#micread`, mensaje `#micmsg`, dentro de `#micbox` | **oculto desde 1.9.0** (`MIC_UI = false` en `src/engine.js`, código intacto; D-2026-11-24-1). Ver [auditoría](auditorias/2026-11-23-codigo.md#1-micrófono-escuchar-mi-tempo-y-la-base-me-sigue) |

## Ajustes › Sonido (`#tab-sonido`)
| Grupo | Controles | Estado |
|---|---|---|
| Pad | Tonalidad, Sonido del pad, Movimiento, Riqueza, Nombres de notas (Do/C) | estable |
| Mezcla | Volumen y encendido por canal; **Paneo** plegable (Izq/Centro/Der) | estable |

## Ajustes › Canciones (`#tab-canciones`)
| Controles | Qué hace | Estado |
|---|---|---|
| Nombre + Guardar | Guarda tempo, compás, estilo, tono, pad, shaker, avanzar y **la estructura con sus acordes** | estable |
| Lista Mis canciones | Tocar carga y vuelve a la vista en vivo; ✕ dos veces borra | estable |
| Estructura de la canción (movida aquí en 2.0) | Pestañas **Orden** (chips, + Añadir) y **Partes** (lista con acordes, + Nueva parte) | estable |
| Editor de parte (`#tab-parte`) | Grados I–vi, ¿cuántos compases? (½/1/2/4), lista de acordes, Quitar, Borrar parte | estable |

No guarda mezcla, paneo ni fuerza del clic (son del equipo, README §5.9).

## Ajustes › App (`#tab-app`) · 2.0
| Grupo | Controles | Estado |
|---|---|---|
| Pantalla en el centro | Pad / Ensamble (`#centerseg`); **Modo avanzado** (`#adv`: banco B) | nuevo |
| Ayuda | **Consejo al abrir** (`#tips`), Repetir la guía rápida, Centro de ayuda | nuevo |
| General | Idioma, Versión (Novedades), Diagnóstico de audio, Estadísticas anónimas | estable (movido desde Sonido) |

## Funciones pedidas o en discusión
| Función | Estado | Dónde se sigue |
|---|---|---|
| Acordes por parte visibles/editables desde Tocar ("modo construcción") | **hecho en 1.9.0** (opción A: chips en Tocar que abren el editor) | [feedback.md](feedback.md) F-2026-11-22-3, [roadmap.md](roadmap.md) |
| Mejor calidad de batería, shakers y pads (tope ~100 MB) | pendiente (Fase 3) | [sonido.md](sonido.md) |
| Pad de batería (tocar golpes a mano) | **hecho en 2.0 como Ensamble** (golpes, loops y fondos), con las muestras actuales | [roadmap.md](roadmap.md) |
| Multitrack + videokaraoke | **descartado** 2026-11-23 | [decisiones.md](decisiones.md) |
| Remates disparados por el micrófono | no existe | [proposito.md](proposito.md) |
| Setlist por servicio | idea abierta | README §7 |
| Transición de acordes ajustable, quitar graves, Pulse | propuesto (análisis PadLab 2026-11-20), sin decidir | [decisiones.md](decisiones.md) |
| Botón "Dar opinión" | en espera de formulario (Tally/Google Forms) | [decisiones.md](decisiones.md) |
| Diseño adaptable a tablet y computadora | pendiente (etapa 4 del plan de nov 2026) | [feedback.md](feedback.md) |
