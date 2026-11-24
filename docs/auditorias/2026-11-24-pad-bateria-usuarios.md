# Qué dicen los músicos sobre pads de batería y acompañamiento (2026-11-24)

Investigación para decidir la forma del pad de batería (ver [diseno.md](../diseno.md#pad-de-batería-opciones-y-recomendación)). Frederik no tenía suficiente información sobre el público, así que revisamos reseñas de tiendas de apps y foros de músicos. Las citas se dejan en el idioma original.

## Fuentes revisadas

| Fuente | Tipo | Qué es |
|---|---|---|
| Real Drum (App Store EE. UU. y México, reseñas más útiles) | batería dibujada | https://apps.apple.com/us/app/real-drum-electronic-drum-set/id550920929 (4.5★, 50 mil reseñas) |
| Drum Pad Machine (App Store) | rejilla de pads con loops | https://apps.apple.com/us/app/drum-pad-machine-beat-maker/id1057968965 (4.6★, 675 mil reseñas) |
| Ableton Note (App Store) | rejilla de 16 pads | https://apps.apple.com/us/app/ableton-note/id1633243177 |
| Drum Loops & Metronome (App Store) | ritmos para tocar encima | https://apps.apple.com/us/app/drum-loops-metronome/id1175481356 |
| Drum Beats (App Store) | ritmos para tocar encima | https://apps.apple.com/us/app/drum-beats/id353093075 |
| iReal Pro (App Store) | acompañamiento por acordes | https://apps.apple.com/us/app/ireal-pro/id298206806 (4.9★) |
| Foro Singular Sound, *Anyone regularly gigging with BeatBuddy?* | pedal de batería con remates | https://forum.singularsound.com/t/anyone-regularly-gigging-with-beatbuddy/2795?page=4 |
| r/worshipleaders, *Options for No Drummer?* | líderes de alabanza sin baterista | https://www.reddit.com/r/worshipleaders/comments/1hqzuax/options_for_no_drummer/ |
| r/worshipleaders, *Creating a bigger sound as a solo worship leader* | líder de alabanza solo | https://www.reddit.com/r/worshipleaders/comments/13rtt76/ |
| r/worshipleaders, *Filling out the sound of a two-piece band* | dúo de iglesia | https://www.reddit.com/r/worshipleaders/comments/hgbw88/ |
| r/ipadmusic, *touch responsiveness for finger drumming* | latencia de pads táctiles | https://www.reddit.com/r/ipadmusic/comments/1az89e0/ |
| Tecnoiglesia, *3 formas de usar un Octapad en la alabanza* | pad en iglesias latinas | https://blog.tecnoiglesia.com/3-formas-de-usar-un-octapad-en-la-alabanza/ |

## Hallazgos

**U1. El músico que toca y canta no tiene manos libres.** Es el problema central de nuestro usuario.
- *"I play guitar and lead the vocals, so I need my hands at all times… should I look into maybe getting a BeatBuddy? Or perhaps the multitracks app … and have one of my singers control it?"* (r/worshipleaders)
- Las soluciones que recomiendan son de **pie** (BeatBuddy, pedal de loops) o **que otra persona** maneje la app. Nadie propone tocar pads con los dedos mientras canta.

**U2. Lo que valoran los solistas en vivo son los remates y las transiciones, no los golpes sueltos.**
- BeatBuddy en vivo: *"So easy to throw in fills and cymbal crashes"*, *"always use the 4 beat rim shot intro and always use the outro"* (foro Singular Sound).
- Lo que piden: control rápido de volumen y tempo al alcance (*"within arm's reach for quick tempo changes, volume adjustments"*), y ver el estado en un visor (*"no way of having a heads-up display attached to the mic stand"*).
- Drum Loops & Metronome: *"useful on a live gig for a solo performer … can you add a volume control slider?"* y una lista de canciones en pantalla.

**U3. Los pads en pantalla se usan para jugar y practicar, no en vivo.**
- En Real Drum y Drum Pad Machine casi todas las reseñas hablan de diversión, kits, lecciones y anuncios. Ninguna de las reseñas útiles habla de usarla en un servicio o concierto.
- Ableton Note: *"A drum pad on the solid phone screen is less than perfect."* Otro usuario pide secuenciador por pasos porque con Bluetooth hay retraso.
- En las apps de pads tocables, lo que se elogia es la respuesta táctil (*"la respuesta tactil es muy abansada no se retrasa"*, Real Drum México). Si responde tarde, la app se descarta. Ver latencia en [diseno.md](../diseno.md).

**U4. Confiabilidad y sonido pesan más que la cantidad de funciones.**
- *"I would not recommend performing with it … the sound shuts down, it could get you in an embarrassing situation"* (Drum Loops).
- Sobre el sonido: *"hi hats and ride cymbal samples … mixed very loudly and doesn't blend well with our acoustic sound"* (BeatBuddy). Las críticas de Drum Loops hablan de *"poor quality high hat"* y de ritmos rígidos. Coincide con el comentario de Peniel Keyboards en Facebook (*"mejorar la calidad de la batería"*).
- La navegación lenta molesta: *"the way in which you jump from one beat to another is SO incredibly convoluted"* (Drum Loops).

**U5. En iglesias latinas, "pad" suele significar el Octapad o SPD del baterista.**
- Tecnoiglesia lista tres usos: **lanzar secuencias**, **sonidos personalizados** y **controlador MIDI**. Lo toca el baterista o el percusionista, junto a la batería, no el guitarrista que canta.
- Es probable que Jefferson (*"si le agregas un pad drum la rompes"*) piense en esto: un pad para un **segundo músico** que acompaña, o para disparar efectos y loops. Conviene preguntarle.

**U6. Hay un perfil que no quiere batería y se pierde si se llena la pantalla.**
- *"Just play the guitar and sing … people miss singing together"* (34 votos sumados en el hilo). Muchos usan solo pad y reverb para llenar el sonido. Esto confirma el arranque sencillo de 1.7.0 (solo Pad).

## Qué implica para las tres ideas

| Idea | Lo que dice la evidencia |
|---|---|
| 1. Batería dibujada | Atrae para jugar y practicar (U3), pero quien canta y toca no tiene manos (U1). Sirve a un segundo músico. Exige baja latencia. |
| 2. Pad de 9 muestras | Coincide con el Octapad que conoce el público latino (U5). Su uso real es **lanzar** loops, efectos y remates más que tocar ritmo con los dedos. Funciona para un segundo músico o para disparos puntuales. |
| 3. Botones de arreglo | Coincide con lo que usan y elogian los solistas: remates, intro y final, cambios de sección (U2). Pocas decisiones grandes, sin problema de latencia ni de "doble golpe". Es la que mejor sirve al usuario principal. |

**Lo que más pide el usuario principal, y ninguna idea resuelve todavía:** control **sin manos**. Un pedal Bluetooth de pasar páginas (≈ USD 30–60; ver https://www.tablets-for-musicians.com/page-turners/) se conecta al iPhone como un teclado, y una página web puede leer esas teclas. Con dos botones (Siguiente y Remate) cubriría U1 sin tocar la pantalla. **Sin probar todavía en iOS Safari:** hay que verificarlo con un pedal real.

## Preguntas abiertas
- ¿Para quién es el pad: para el músico que canta (entonces idea 3 + pedal) o para un segundo músico que acompaña (entonces idea 2)?
- Preguntar a Jefferson en Facebook qué imagina con "pad drum".
