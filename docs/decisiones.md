# Registro de decisiones

Una fila por decisión: qué, por qué, fuente y quién decidió. La más nueva arriba. Para el detalle técnico, sigue el enlace.
ID: `D-AAAA-MM-DD-n`.

| ID | Fecha | Decisión | Por qué | Fuente / evidencia | Decidió |
|---|---|---|---|---|---|
| D-2026-11-23-5 | 2026-11-23 | Principios de diseño P1–P10 y lista de verificación de [diseno.md](diseno.md#principios-de-ux-para-apps-musicales-en-vivo) como criterio para cualquier cambio de interfaz. Pad de batería: recomendada la opción B (panel *Acordes \| Batería*, golpes cuantizados). | Fuentes citadas (Apple HIG, Material, NN/g, WCAG 2.2, Hoober, estudios de latencia); un pad libre sonaría tarde con `latencyHint: 'playback'`. | PR #10; hilo "Base de diseño" | pendiente (propuesta, revisión de Frederik) |
| D-2026-11-23-3 | 2026-11-23 | Documentación del proyecto en `docs/` con `INDEX.md` como entrada; el README sigue siendo la fuente de formatos. | Que cualquier agente o persona encuentre propósito, decisiones, funciones y feedback sin repetir preguntas. | Pedido de Frederik en el chat del proyecto | Frederik |
| D-2026-11-23-2 | 2026-11-23 | Ruta de trabajo en fases: 0 diagnóstico → 1 propósito → 2 cambios rápidos → 3 sonido → 4 pad de batería. | Ir de lo general a lo específico; cada fase entrega algo probable. | [roadmap.md](roadmap.md) | Frederik (aprobó la propuesta del coordinador) |
| D-2026-11-23-1 | 2026-11-23 | **Descartado:** multitrack + videokaraoke con salida a pantalla y consola. | Fuera de propósito (no es reproductor de pistas ni de video); rompe el peso y el modo offline de un solo archivo. | F-2026-11-22-1; [proposito.md](proposito.md) | Frederik |
| D-2026-11-23-0 | 2026-11-23 | Tope inicial de peso para sonido: ~100 MB (a confirmar el diseño de carga por demanda en Fase 3). | Mejorar calidad de batería, shakers y pads. | Mensaje de Frederik 2026-11-23 | Frederik |
| D-2026-11-22-1 | 2026-11-22 | Estadísticas anónimas con GoatCounter sin script externo (`stat()`), solo en el dominio publicado, con interruptor. | Saber qué se usa sin cookies ni romper offline. Gratis. | PR #9, README §5.14 | Frederik |
| D-2026-11-22-2 | 2026-11-22 | Sin botón "Dar opinión" por ahora. | No hay formulario; retomar con link de Tally o Google Forms. | Hilo de analítica | Frederik |
| D-2026-11-20-1 | 2026-11-20 | Ideas de PadLab propuestas (transición de acordes ajustable, quitar graves, Pulse, pantalla solo pads, setlist); **sin decidir**. | PadLab usa loops grabados; lo útil para nosotros son los controles en vivo. | Informe https://claude.ai/artifact/PWsaQPNjrZ19h8A6ksxU4C | pendiente |
| D-2026-11-08-2 | 2026-11-08 | Valores sencillos por defecto: Manual + Tónica + 5ª, parte que se repite, sin remate automático; "Avanzar por la canción" opcional. | Que quien usa solo clic/shaker/pad no tenga cambios sorpresa. | PR #8 (1.7.0); plan https://claude.ai/artifact/1N5btYJmEsLNohKubxreVW | Frederik |
| D-2026-11-08-1 | 2026-11-08 | Audio robusto: `latencyHint: 'playback'`, corte adaptativo al confirmar, PADsynth en worker, limitador final. | Cortes medidos en Android/laptop por renders lentos, no por saturación (pico 0.79). | PR #8; medición en headless con CPU limitada | Frederik |
| D-2026-11-08-0 | 2026-11-08 | Recolección de diagnóstico entre equipos: **pendiente**. Requiere servidor; choca con la regla sin red. | — | Hilo multi-equipo | pendiente |
| D-2026-10-27-4 | 2026-10-27 | Tocar con diseño **C5a**; estructura en Sonido (Orden/Partes); modo Manual; canal Clic y paneo; mezcla y paneo no se guardan por canción. | Uso práctico en vivo; Frederik conecta por cable auxiliar con adaptador USB-C. | PR #7 (1.6.0); canvas https://claude.ai/artifact/W76VuJ8qYhxD3943SBPwFd | Frederik (lo de no guardar mezcla lo eligió el agente; revisar si lo pide) |
| D-2026-10-27-3 | 2026-10-27 | Pads con **PADsynth** propio + reverb nueva; controles Movimiento y Riqueza. Piano real (VCSL) queda como fase 2 sin decidir. | Pads más amplios sin batido, 0 KB extra. No hay pads CC0 buenos. | PR #4 (1.5.0), PR #6 (1.5.2); propuesta https://claude.ai/artifact/QdoddfUGgcHcHiHcvxYJEv | Frederik |
| D-2026-10-27-2 | 2026-10-27 | Nunca vibrato rápido sobre un bucle PADsynth; el ensamble sale del ancho de banda. | El coro sonaba a una voz robótica. | PR #6 | aprendizaje técnico |
| D-2026-10-27-1 | 2026-10-27 | Ritmo **pre-generado como audio** por tramos (`OfflineAudioContext`) con loop de respaldo. | iOS congela el JS en segundo plano pero no el audio. Elegido sobre más lookahead (depende de iOS) y sobre AudioWorklet completo (muy grande). | PR #2, PR #5 (1.3.0, 1.5.1) | Frederik |
| D-2026-10-12-2 | 2026-10-12 | Nombres de pads según teclados conocidos (GM, Yamaha, Nord) o término de síntesis; grupos por momento del servicio. | Que el músico reconozca el sonido. | README §5.5 | Frederik |
| D-2026-10-12-1 | 2026-10-12 | Interfaz en español e inglés; menús pull-down estilo iOS. | Comunidad latina; consistencia iOS. | 1.2.0 | Frederik |
| D-2026-10-11-1 | 2026-10-11 | PWA de un solo HTML, sin frameworks, offline, muestras CC0 embebidas; publicada en GitHub Pages. | Funciona sin internet en la iglesia; sin costo; sin instalación de tienda. | README §6; app nativa (Capacitor) solo si la PWA se queda corta | Frederik |

## Decisiones abiertas (para Frederik)
| Tema | Opciones | Dónde |
|---|---|---|
| Micrófono (seguir tempo) | Ocultar ya / dejar como beta con aviso / rehacer | [auditoría 2026-11-23](auditorias/2026-11-23-codigo.md) |
| Acordes por parte en Tocar | Ver opciones en la auditoría | [auditoría 2026-11-23](auditorias/2026-11-23-codigo.md#2-acordes-por-parte) |
| Diagnóstico entre equipos | Servidor vs. solo copiar datos | D-2026-11-08-0 |
| Piano real | Sí/no (~700 KB) | D-2026-10-27-3 |
| Pad de batería | A: fila de 4 golpes / **B: panel Acordes \| Batería (recomendada)** / C: pestaña Pads aparte | [diseno.md](diseno.md#pad-de-batería-opciones-y-recomendación), D-2026-11-23-5 |
| Pestaña Sonido sobrecargada | Mover Estructura a Canciones (renombrada "Canción") / dejar como está | [diseno.md](diseno.md#auditoría-hallazgos-h1h10) H2 |
