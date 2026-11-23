# Diseño e interfaz

Tokens de color, tamaños y orden de la pantalla Tocar: README §6 (Diseño iOS oscuro). Mapa de pantallas: [funciones.md](funciones.md).

## Lo que ya está decidido
- **Aspecto iOS oscuro**, fuente del sistema, monoespaciada para BPM y dial.
- **Tocar = diseño C5a** (2026-10-27): elegido por Frederik entre prototipos. Canvas: https://claude.ai/artifact/W76VuJ8qYhxD3943SBPwFd · prototipo aprobado: https://claude.ai/artifact/61bLWxJQcPGdW9SWzabWtS
- **Zona del pulgar:** canales y transporte abajo; nunca suben. Play visible sin desplazar desde iPhone SE hasta Pro Max.
- **Objetivos táctiles ≥ 44 px** (Apple HIG); Play 76 px; canales 56 px.
- **Menús pull-down estilo iOS**, nunca el selector nativo.
- **Paneo plegable** en Sonido › Mezcla, sin diagrama L/R (pedido de Frederik).
- **Editor de parte:** acordes primero, luego cuántos compases (Frederik encontró confuso el primer editor).
- **Tocar un control abre su lista ahí mismo** (tonalidad, pad): práctico en vivo.

## Problemas de diseño conocidos
| Problema | Evidencia | Fase |
|---|---|---|
| La estructura con acordes está escondida: Sonido (3.ª pestaña) › bajar hasta Estructura › pestaña Partes (no es la que abre) › tocar una parte. | Comentario de Ariel (F-2026-11-22-3); [auditoría](auditorias/2026-11-23-codigo.md#2-acordes-por-parte) | Fase 2 |
| Con los valores por defecto (Manual + Tónica + 5ª) los acordes de las partes no suenan, sin aviso. | `src/engine.js:381`, `:1003-1009` | Fase 2 |
| El texto de Sonido › Estructura › Partes dice "la app pasa sola a la parte siguiente", falso desde 1.7.0 (Avanzar viene apagado). | `src/engine.js:218` y `:278` | Fase 2 |
| Diseño solo para teléfono: en tablet y computadora se ve raro. | Pruebas de Frederik 2026-11-08 | pendiente |

## Principios de UX para apps musicales en vivo
> **Sección reservada para el hilo "Base de diseño" (Fase 0, 2026-11-23).** Debe dejar aquí los principios con su fuente (Apple HIG, Material, apps de referencia como PadLab, Loop Community/Prime, MultiTracks Playback, Drumgenius), criterios para decidir dónde va cada botón y una lista de chequeo para revisar pantallas nuevas. Registrar la decisión en [decisiones.md](decisiones.md).

## Lista de chequeo mínima (válida hoy)
- ¿Se usa con una mano y sin mirar mucho? ¿Lo de vivo está abajo?
- ¿Cada texto está en `I18N` en es y en?
- ¿Se ve bien en 390 × 844 y en iPhone SE (`max-height: 700px`)?
- ¿Agrega una decisión nueva a Tocar? Si sí, ¿qué se quita o se pliega?
