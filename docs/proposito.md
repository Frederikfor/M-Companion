# Propósito e identidad

## En una frase
M-Companion es la **banda de bolsillo** de un músico que toca solo: pone shaker/percusión, batería, un pad y un clic a **su** tempo, con cambios de parte y remates que respetan el compás, y funciona sin internet en el teléfono conectado a la mezcladora.

## Para quién
- **Usuario principal:** cantante que toca guitarra (a veces piano) en servicios de iglesia: worship, gospel, baladas, latino. Toca en vivo, con una mano libre por momentos, en un escenario con poca luz.
- **Usuarios secundarios (comunidad de Facebook, nov 2026):** tecladistas y músicos de iglesia que buscan una base rápida. Ver [feedback.md](feedback.md).
- **Dispositivo principal:** iPhone con Safari, instalada en la pantalla de inicio. También Android, tablet y computadora.

## Qué problema resuelve
Tocar solo suena vacío y es difícil sostener el tempo. Las alternativas (multitracks, DAWs, cajas de ritmo) requieren preparar cada canción, cuestan, o no siguen la forma de la canción en vivo. M-Companion da una base musical decente en segundos: eliges tempo, compás, estilo y tono, y tocas.

## Qué es
- Una base rítmica (shaker/percusión + batería) con estilos de iglesia y remates.
- Un pad que sostiene la armonía: fijo en tónica + quinta, por acordes de la canción (Auto) o tocado a mano (Manual).
- Un clic con salida paneable para mandarlo a un oído/canal distinto.
- Una estructura de canción sencilla (partes con acordes) para avanzar en vivo.
- Una PWA de **un solo archivo**, **offline**, sin cuentas.

## Qué **no** es (y por qué)
| No es | Por qué |
|---|---|
| Un DAW o secuenciador de pistas | Pocas decisiones, grandes y claras (README §6.1). |
| Un reproductor de multitracks o videokaraoke | Descartado el 2026-11-23: otro producto, requiere archivos pesados y salidas de video. Ver [decisiones.md](decisiones.md). |
| Una app de secuencias por canción con stems | Igual que arriba; la app genera la base, no reproduce grabaciones. |
| Un servicio en la nube | Sin cuentas ni servidor; lo guardado vive en el teléfono. Única red: conteo anónimo (README §5.14). |

## Principios (resumen; el detalle está en README §2 y §6)
1. **En vivo primero:** nada corta el audio ni requiere internet mientras se toca; controles en vivo abajo, al alcance del pulgar.
2. **Musicalidad antes que funciones:** tiempo por reloj de audio, cambios en el 1, remates que terminan antes del 1.
3. **Sonido libre:** solo CC0/dominio público, con respaldo sintético.
4. **Un solo HTML, sin dependencias.**
5. **iOS oscuro, español e inglés.**
6. **Lo guardado nunca se pierde.**
7. **De lo general a lo específico** (ver [metodologia.md](metodologia.md)).

## Visión original (Frederik, al crear el proyecto)
> "Una herramienta que, basado en la canción que quiero tocar, elabore un loop o shaker base, luego pueda añadir una batería y un pad. Yo le doy el tiempo, pero que usando un micrófono pueda detectar si ha habido un cambio de tempo y añadir remates dependiendo del compás y parte de canción."

Estado frente a la visión (2026-11-23): shaker, batería, pad, remates por compás y parte: **hechos**. Detección de cambio de tempo por micrófono: **beta, no fiable en vivo** (ver [auditorias/2026-11-23-codigo.md](auditorias/2026-11-23-codigo.md)). Remates disparados por el micrófono: **no existen**.

## Métricas
GoatCounter (https://forozco.goatcounter.com/) cuenta aperturas, Play, canales, estilos, pads, duración de sesión y uso del micrófono. Úsalas para priorizar: por ejemplo, `mic/on` y `mic/seguir` dicen si alguien usa el micrófono.
