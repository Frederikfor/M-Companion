# M-Companion · Acompañante de Ensayo

App web (PWA) que acompaña a un músico que toca solo: pone una base de **shaker y percusión**, **batería** y un **pad** de teclado, a un tempo que el músico controla, con remates (fills) que respetan el compás y la parte de la canción. Pensada para ensayar en casa y para tocar en la iglesia conectada a la mezcladora.

- **App en vivo:** https://frederikfor.github.io/M-Companion/
- **Usuario principal:** cantante que toca guitarra y a veces piano, en servicios de iglesia (worship, gospel, baladas, latino).
- **Plataforma:** iPhone (Safari, instalada en la pantalla de inicio), también cualquier navegador moderno de computadora o Android.
- **Idioma de la interfaz:** español por defecto; inglés disponible en Sonido › App › Idioma.

---

## 1. Cómo usarla

### Instalar en el iPhone
1. Abre https://frederikfor.github.io/M-Companion/ en **Safari** (no en Chrome ni dentro de otra app).
2. Botón **Compartir** › **Añadir a pantalla de inicio** › **Añadir**.
3. Ábrela desde el ícono. Después de la primera apertura funciona **sin internet**.
4. El sonido sale aunque el interruptor de silencio esté activado. Conecta el teléfono a la mezcladora con un adaptador de audífonos.

### En computadora
Abre la misma dirección en Chrome, Edge o Safari. También puedes abrir `dist/acompanante.html` directamente (archivo único, funciona sin internet; el micrófono solo funciona en Chrome con archivo local o por https).

### Las 4 pestañas
| Pestaña | Para qué |
|---|---|
| **Tocar** | Lo que se usa en vivo. Tempo (−/+, −5/+5, *Marcar tempo*), compás, acorde del pad, partes de la canción (Intro, Estrofa, Coro, Puente, Final) y el transporte: **Remate · Play/Stop · Siguiente parte**. |
| **Ritmo** | Estilo, patrón y sonido de shaker, humanizar, remate automático cada N compases, conteo de entrada, seguir el tempo por micrófono (beta). |
| **Sonido** | Tonalidad, nombres de notas (Do/C), sonido del pad, modo *solo tónica y quinta*, mezcla y on/off de Percusión, Batería y Pad. |
| **Canciones** | Guardar la configuración actual con un nombre y cargarla con un toque (vuelve a Tocar). |

### Flujo típico en vivo
1. Carga la canción en **Canciones** (o ajusta tempo, compás, estilo y tono).
2. **Play**: suena el conteo de entrada de un compás y arranca en la parte elegida.
3. Toca **Siguiente parte** o una parte específica: el cambio entra en el **siguiente compás**, con un remate antes y un platillo al entrar.
4. **Final**: remate, platillo y el pad se desvanece.

---

## 2. Prompt para agentes (léelo antes de tocar el código)

> Eres el desarrollador de **M-Companion**, un acompañante musical en vivo para un músico de iglesia que toca solo. Tu trabajo es mejorar la app **sin romper su identidad**:
>
> 1. **En vivo primero.** Cada cambio debe funcionar con una mano, en un escenario oscuro, sin mirar mucho la pantalla. Nada puede cortar el audio, retrasar un cambio de parte ni requerir internet mientras se toca.
> 2. **Musicalidad antes que funciones.** El tiempo es sagrado: todo sonido se programa con el reloj de Web Audio (`ctx.currentTime`), nunca con `setTimeout`. Los cambios de parte entran en el siguiente compás. Los remates terminan justo antes del tiempo 1.
> 3. **Sonido real y libre.** Solo muestras **CC0 / dominio público**, embebidas en el archivo. Siempre debe existir un respaldo sintético si una muestra falta.
> 4. **Un solo archivo, sin dependencias en tiempo de ejecución.** Nada de frameworks, CDNs, fuentes externas ni peticiones de red desde la app.
> 5. **Aspecto iOS oscuro, en español e inglés.** Todo texto visible va en `I18N` (sección 5.12), nunca escrito directo en el código. Usa los tokens de color y las reglas de la sección 5. Botones de al menos 44 px. Los controles en vivo viven abajo, al alcance del pulgar.
> 6. **Edita las fuentes, no lo generado.** Cambia `src/` o `samples/`, luego ejecuta `python3 tools/build.py` y `npm test`. Nunca edites `index.html`, `sw.js` ni `dist/` a mano.
> 7. **Ve de lo general a lo específico** (design thinking + ágil): entiende qué necesita el músico, haz el cambio pequeño que lo resuelve, pruébalo, entrégalo. Si una petición choca con estas reglas, dilo y propone una alternativa que sí las respete.

---

## 3. Estructura del repositorio

```
M-Companion/
├── README.md              ← este documento (fuente de verdad para humanos y agentes)
├── AGENTS.md, CLAUDE.md   ← apuntan aquí
├── src/
│   ├── ui.html            ← interfaz: estilos, 4 pestañas, barra de pestañas (EDITABLE)
│   ├── engine.js          ← motor de audio, datos musicales y lógica de UI (EDITABLE)
│   └── sw.template.js     ← plantilla del service worker (EDITABLE)
├── samples/
│   ├── *.wav              ← 42 muestras CC0, 32 kHz mono (EDITABLE, ver reglas)
│   ├── offsets.json       ← dónde cae el ataque de cada muestra (referencia)
│   └── CREDITS.md         ← origen y licencia de cada grupo de muestras
├── icons/                 ← icon-180 (iPhone), icon-192, icon-512 (Android/maskable)
├── manifest.webmanifest   ← nombre, colores y modo standalone de la PWA
├── tools/
│   ├── build.py           ← genera index.html, sw.js y dist/acompanante.html
│   └── smoke-test.mjs     ← prueba en Chromium sin pantalla
├── index.html             ← GENERADO: lo que publica GitHub Pages
├── sw.js                  ← GENERADO: caché offline con versión por hash
├── dist/acompanante.html  ← GENERADO: la app como un solo archivo
└── .nojekyll              ← Pages sirve los archivos tal cual
```

GitHub Pages publica la rama `main`, carpeta raíz. Por eso `index.html` y `sw.js` generados **sí se suben** al repositorio.

---

## 4. Cómo editar, construir y probar

### Requisitos
- Python 3 (solo librería estándar).
- Node 18+ y `npm install` (instala Playwright para la prueba).

### Secuencia obligatoria para cualquier cambio
1. **Entiende** qué problema musical o de uso resuelve el cambio y en qué pestaña vive.
2. **Edita** solo `src/`, `samples/`, `icons/` o `manifest.webmanifest`.
3. **Construye:** `python3 tools/build.py` (imprime número de muestras, tamaño y versión de caché).
4. **Prueba:** `npm test` (o `CHROMIUM_PATH=/ruta/a/chromium node tools/smoke-test.mjs`). Debe decir `OK: 42 samples…` sin errores. Si agregaste muestras, actualiza el número esperado en la prueba.
5. **Escucha** si el cambio es sonoro: abre `dist/acompanante.html` y prueba cada parte, el remate y el final.
6. **Revisa en 390 × 844** (tamaño iPhone) que nada se encime y que los controles en vivo sigan abajo.
7. **Haz commit** de fuentes y generados juntos (`src/…`, `index.html`, `sw.js`, `dist/…`). Un commit por cambio, mensaje en presente que diga qué escucha o ve el músico.
8. Al subir a `main`, Pages publica en un par de minutos. El iPhone toma la versión nueva la **segunda** vez que se abre la app (el service worker sirve el caché y actualiza en segundo plano).

### Dónde se cambia cada cosa
| Quiero… | Edita |
|---|---|
| Un estilo de ritmo nuevo | `STYLES` en `src/engine.js` |
| Un patrón de shaker nuevo | `SHAKERS` |
| Un sonido de pad nuevo | `PADS` (y si hace falta, un `voicing` en `padNotes()`) |
| Un juego de shaker nuevo | `SHK_SETS` + muestras en `samples/` |
| Cómo suenan los remates | `buildFill(target, meter)` |
| Intensidad por parte de la canción | `SEC_DYN`, `SEC_SHK`, `SEC_PAD` |
| Valores por defecto | objeto `S` |
| Disposición o colores | `src/ui.html` |
| Nombre o ícono de la app | `manifest.webmanifest`, `icons/`, `<head>` en `tools/build.py` |

---

## 5. Parámetros y formatos

### 5.1 Notación de patrones
Cada patrón es un texto con **un carácter por semicorchea**:

| Carácter | Velocidad | Uso |
|---|---|---|
| `X` | 1.00 | acento |
| `x` | 0.75 | golpe normal |
| `o` | 0.45 | suave |
| `g` | 0.25 | ghost / fantasma |
| `.` | — | silencio |

| Compás | Pasos por compás | `div` (pasos por pulso) | El BPM cuenta… |
|---|---|---|---|
| `4/4` | 16 | 4 | negras |
| `3/4` | 12 | 4 | negras |
| `6/8` | 12 | 6 | negras con puntillo (2 pulsos por compás) |

**Regla:** la longitud del texto debe ser exactamente igual a los pasos del compás del estilo.

### 5.2 Estilos (`STYLES`)
```js
claveEstilo: {
  name: 'Nombre visible',       // español, corto
  en: 'Visible name',           // inglés (obligatorio)
  meter: '4/4' | '3/4' | '6/8',
  swing: 0..0.7,                // retrasa la corchea de contratiempo (s % 4 === 2); no aplica en 6/8
  swing16: 0..0.4,              // opcional: retrasa cada semicorchea impar (feel soul/gospel)
  secs: {
    intro:   { ...instrumentos },
    estrofa: { ... },
    coro:    { ... },
    puente:  { ... }            // 'final' reutiliza 'coro'
  }
}
```
Instrumentos posibles en cada parte: `kick`, `snare`, `rim`, `hat`, `ohat` (batería) y `shaker`, `tamb`, `conga`, `clap` (percusión). Omite los que no suenan.
La clave termina en el compás (`…44`, `…34`, `…68`).

Estilos actuales: `balada44`, `pop44`, `rock44`, `latino44`, `reggae44`, `shuffle44`, `soulgospel44`, `gospelworship44`, `vals34`, `balada34`, `balada68`, `marcha68`, `gospel68`.

**Identidad de las partes:** intro escaso (poca o ninguna batería), estrofa contenida (rim o caja suave, hi-hat), coro lleno (caja, hi-hat abierto, pandero, bombo más activo), puente con un cambio de textura (medio tiempo o solo pulso). Cada parte debe **oírse distinta**.

### 5.3 Patrones de shaker (`SHAKERS`)
```js
clave: { name: 'Nombre', simple: 'celda de 1 pulso en 4/4 o 3/4', comp: 'celda de 1 pulso de 6/8 (6 pasos)' }
```
La celda se repite hasta llenar el compás. `auto` usa el shaker escrito en el estilo.
Actuales: `auto`, `corcheas`, `semicorcheas`, `galope`, `contra`, `tresillo`, `negras`, `acento16`, `shuffle`.

### 5.4 Dinámica por parte
| Parte | `SEC_DYN` (batería) | `SEC_SHK` (percusión) | `SEC_PAD` (Hz del filtro del pad) |
|---|---|---|---|
| intro | 0.75 | 0.70 | 650 |
| estrofa | 0.85 | 0.85 | 1000 |
| coro | 1.00 | 1.00 | 2300 |
| puente | 0.90 | 0.80 | 800 |
| final | 1.00 | 1.00 | 2300 |

### 5.5 Pads (`PADS`)
```js
clave: {
  group: 'Worship' | 'Oración y ministración' | 'Alabanza' | 'Himnos y gospel',  // agrupa la lista por momento del servicio
  name: 'Palabra',                     // una palabra que describa el sonido
  layers: [[onda, [desafinación en cents…], semitonos de transposición, ganancia], …],
  cutoff: multiplicador de SEC_PAD, q: resonancia del filtro,
  attack: s, release: s, vib: [Hz, profundidad en cents],
  hall: envío a la reverb larga (0..1.2),
  voicing: 'triad' | 'add9' | 'open' | 'gospel7' | 'sus2' | 'power',
  air: [ganancia, Hz],                 // opcional: aire / respiración (ruido filtrado que ondula lento)
  formant: [[Hz, Q, ganancia], …],     // opcional: filtra las capas como vocal "ah" (coro)
  trem: [Hz, profundidad 0..1]         // opcional: trémolo de volumen (piano eléctrico)
}
```
| Grupo | Pads (`clave` → nombre) | Sonido |
|---|---|---|
| Worship | `atmos` → Atmósfera (por defecto), `fundamento` → Envolvente, `aire` → Aire, `shimmer` → Brillante, `amanecer` → Creciente | amplios con reverb larga; Creciente abre lento para puentes y clímax |
| Oración y ministración | `oracion` → Oscuro, `quintas` → Profundo, `cristal` → Cristalino | suaves, sin tercera o tipo campana, para ir debajo de la voz hablada |
| Alabanza | `calido` → Cálido, `analogico` → Analógico, `teclas` → Teclado | más presentes, para canciones movidas y baladas pop |
| Himnos y gospel | `cuerdas` → Cuerdas, `coro` → Voces, `organo` → Órgano | instrumentos acústicos clásicos |

**Nombres:** una sola palabra en español que describa el sonido (Oscuro, Brillante, Voces), sin referencias a artistas, canciones ni momentos. El momento del servicio va en `group`. Nunca cambies la `clave` de un pad existente: las canciones guardadas la usan. Cada pad lleva también `en` con su palabra en inglés (Dark, Bright, Choir…).

**Volumen parejo:** con la batería y la percusión apagadas, en Estrofa, cada pad nuevo debe medir entre −36 y −32 dB RMS en la salida (los pads oscuros pueden ir un poco más arriba, los brillantes un poco más abajo). Ajusta las ganancias de `layers` y `air`, no el volumen general.
Modo `fifths` (*solo tónica y quinta*): toca tónica y quinta en varias octavas para que un solo pad sirva en toda la canción.
Acordes disponibles: grados I, ii, iii, IV, V, vi de la tonalidad mayor (`DEGREES`). Mantén las ganancias bajas: el pad acompaña, no domina.

### 5.6 Remates (`buildFill`)
- Hacia **intro/estrofa**: 1 tiempo de toms en corcheas.
- Hacia **puente**: 2 tiempos de caja en crescendo.
- Hacia **coro/final**: 2 tiempos de semicorcheas bajando caja → toms; el final agrega bombo.
- Siempre terminan en el último paso del compás; el platillo cae en el siguiente tiempo 1 (excepto al ir a intro, o a estrofa sin cambio de parte).
- Remate automático cada `S.autoFill` compases (0 = apagado).

### 5.7 Humanizar (`S.human`, 0–100)
Desplazamiento de tiempo ±9 ms × h, velocidad ±20 % × h, notas fantasma de caja ocasionales, hi-hat abierto al final de cada frase de 4 compases y bombo de anticipación en el coro. Todo escala con `h`.

### 5.8 Muestras (`samples/`)
- **Formato:** WAV PCM 16 bits, **32 kHz, mono**, normalizado a −1 dB, silencio inicial recortado a −42 dB, colas cortas (la mayoría < 0.6 s).
- **Nombres** (sin extensión = clave en `SB`):
  - Batería: `kickH`, `kickS`, `snareH`, `snareS`, `hat`, `pedal`, `ohat`, `crash`, `tomH`, `tomM`, `tomL`, `tomHs` (H = fuerte, S = suave).
  - Percusión: `shkH_Down_1/2`, `shkH_Up_1/2`, `shkL_Down_1/2`, `shkL_Up_1/2`, `lshkHit_1/2`, `lshkDown_1/2`, `lshkUp_1/2`, `cabHit_1/2`, `cabRub_1..3`, `tambHit_1/2`, `tambShk_1/2`, `conga_1/2`, `congaO_1`, `clap_1..4`.
  - Variantes con sufijo `_1`, `_2`… se eligen al azar para que no suene a máquina.
- **Offset de ataque:** los shakers y panderos tienen un "swish" antes del golpe. `SAMPLE_OFF` en `src/engine.js` dice cuántos segundos después del inicio cae el acento; el motor arranca la muestra antes para que el acento caiga a tiempo. Si agregas una muestra de este tipo, mide su offset y agrégalo a `SAMPLE_OFF` y a `samples/offsets.json`.
- **Respaldo:** cada instrumento en `INST` debe tener un `|| SYN.x(...)` o un respaldo PhISEM para que nunca quede mudo.
- **Licencia:** solo CC0 / dominio público. Registra el origen en `samples/CREDITS.md`.
- **Peso:** `index.html` ronda 1.6 MB. No pases de ~3 MB (primera carga con datos móviles).

### 5.9 Estado guardado (`localStorage`)
| Clave | Contenido |
|---|---|
| `acomp` | objeto `S` completo (tempo, compás, parte, estilo, pad, mezcla, idioma `lang`…) |
| `acomp-songs` | lista `[{ name, bpm, meter, style, key, shaker, pad, padMode, shkSound }]` |
| `acomp-tab` | última pestaña abierta |

Si cambias el nombre o la forma de una propiedad de `S`, valida al cargar (como ya se hace con `STYLES[S.style]`, `PADS[S.pad]`…) para que las canciones guardadas del músico no rompan la app.

### 5.10 Contrato entre `ui.html` y `engine.js`
El motor busca estos `id`. No los renombres sin cambiar ambos lados:
`bpm`, `bpmunit`, `m1`, `m5`, `p1`, `p5`, `tap`, `meter`, `dots`, `barinfo`, `play`, botones `[data-s]` dentro de `#sections`, `fill`, `filllbl`, `next`, `autofill`, `key`, `names`, `chords`, `on-shaker`, `v-shaker`, `on-drums`, `v-drums`, `on-pad`, `v-pad`, `mic`, `follow`, `micread`, `micmsg`, `status`, `style`, `shaker`, `human`, `humanval`, `countin`, `shksound`, `padtype`, `padmode`, `padinfo`, `songs`, `songname`, `savesong`, `songtitle`, `lang`.
Los `select` (`meter`, `style`, `shaker`, `shksound`, `autofill`, `key`, `padtype`, `names`, `lang`) están ocultos y se manejan con los menús `.pd[data-for=id]`; las pruebas eligen opciones haciendo clic en el menú, no con `selectOption`.
Las pestañas son `.screen#tab-tocar|ritmo|sonido|canciones` y botones `.tab[data-tab=…]`. Los interruptores usan `role="switch"` y `aria-checked`.
Para pruebas: `window.acompLoaded()` devuelve cuántas muestras se decodificaron.

### 5.11 Motor de audio (resumen)
- Programador con anticipación: `setInterval` cada 25 ms agenda los pasos de los próximos 0.12 s con `ctx.currentTime`.
- Buses `shaker`, `drums`, `pad` → master → compresor. Reverb de sala (1.3 s) en todos; reverb larga (5 s) para el pad.
- El hi-hat cerrado corta al abierto (choke).
- iOS: `navigator.audioSession.type = 'playback'` (suena con el interruptor de silencio) y *wake lock* para que la pantalla no se apague.
- Micrófono (beta): detección de ataques por flujo espectral e histograma de intervalos dentro de ±20 % del BPM fijado. Necesita https.

### 5.12 Idiomas (`I18N`)
- Diccionario `I18N = { es: {...}, en: {...} }` en `src/engine.js`. `T('clave', ...args)` devuelve el texto en el idioma de `S.lang` (si falta, usa español). Algunas entradas son funciones con parámetros (`bar`, `mic.read`, `del.aria`).
- Textos fijos del HTML: atributo `data-i18n="clave"` (contenido), `data-i18n-aria` (aria-label) o `data-i18n-ph` (placeholder). `applyLang()` los recorre al iniciar y al cambiar de idioma.
- Datos musicales: `name` en español y `en` en inglés en cada entrada de `STYLES`, `SHAKERS`, `PADS` y `SHK_SETS`; `NM(obj)` elige. Los grupos de pads se traducen en `I18N.<idioma>.groups`.
- Las claves internas (`estrofa`, `coro`, `atmos`…) nunca se traducen: las canciones guardadas dependen de ellas.
- **Regla:** cualquier texto nuevo se agrega en **los dos idiomas** a la vez. Para habilitar otro idioma: agrega su bloque completo a `I18N`, los campos de datos que hagan falta y una `<option>` en `#lang` con el nombre del idioma en ese idioma.

---

## 6. Reglas de identidad (no negociables)

**Producto**
1. Es un acompañante para **un músico en vivo**, no un DAW ni un secuenciador. Pocas decisiones, grandes y claras.
2. Funciona **offline** después de la primera carga. Ninguna petición de red en tiempo de ejecución.
3. **Un solo HTML** generado, sin frameworks ni librerías externas.
4. Interfaz en **español** (por defecto) e **inglés**; en español, términos musicales de la iglesia latina (Estrofa, Coro, Puente, Remate, Tonalidad, Do/Re/Mi). Los nombres de notas (Do Re Mi / C D E) son un ajuste aparte del idioma.
5. Lo que el músico guardó (canciones, ajustes) nunca se pierde por una actualización.

**Diseño (iOS oscuro)**
| Token | Valor | Uso |
|---|---|---|
| `--bg` | `#000000` | fondo |
| `--card` | `#1C1C1E` | tarjetas y listas |
| `--fill` | `#2C2C2E` | botones secundarios |
| `--seg` | `#48484A` | segmento activo |
| `--line` | `#38383A` | separadores |
| `--fg` | `#FFFFFF` | texto |
| `--muted` | `#98989F` | texto secundario |
| `--accent` | `#FF9F0A` | naranja: acento, selección |
| `--go` | `#30D158` | Play / interruptor encendido |
| `--stop` | `#FF453A` | Stop |
| `--off` | `#39393D` | interruptor apagado |

- Fuente del sistema (`-apple-system`), tamaños iOS (34 títulos, 17 cuerpo, 13 notas).
- Objetivos táctiles **≥ 44 px**; Play redondo de 84 px.
- En **Tocar**, de arriba abajo: información (canción, compás, tempo) → pad → **zona del pulgar** con partes y transporte. Los controles en vivo nunca suben.
- Barra de 4 pestañas abajo con área segura (`env(safe-area-inset-bottom)`).
- Las listas de opciones son **menús pull-down estilo iOS** (`.pd` → `.pd-menu`), nunca el selector nativo: palomita a la izquierda en la opción elegida, grupos separados con banda oscura y título gris, se abre bajo el botón o encima si no cabe. El `<select class="native">` oculto sigue siendo la fuente de verdad: el motor lo llena, cambia su `.value` y escucha `change`; el menú solo lo refleja. Un selector nuevo = `<div class="row pick">` con `.lbl`, el `select.native` y un `button.pd[data-for=id]` (copia una fila existente de `src/ui.html`).
- Accesible: `aria-label` en botones con ícono, `role="switch"`/`aria-checked`, foco visible naranja.

**Música**
- Tiempo por reloj de audio; cambios de parte al siguiente compás; remate antes del cambio; platillo en el 1.
- Cada parte suena distinta; el coro es la más llena, el intro la más vacía.
- La batería se humaniza; nunca es perfectamente cuantizada salvo con Humanizar en 0.
- El pad nunca tapa la voz: ataque lento, filtro según la parte, volumen bajo por defecto (50).

---

## 7. Hoja de ruta (ideas abiertas)
- Probar en el iPhone del músico y ajustar volúmenes y latencia con la mezcladora.
- Lista de canciones por servicio (setlist) con orden y cambio rápido.
- Más estilos latinos de iglesia (bachata suave, cumbia lenta) si el músico los pide.
- App nativa (Capacitor) solo si la PWA se queda corta: requiere Mac, Xcode y cuenta de desarrollador.

## 8. Créditos y licencia de sonidos
Ver [`samples/CREDITS.md`](samples/CREDITS.md). Todas las muestras son CC0.
