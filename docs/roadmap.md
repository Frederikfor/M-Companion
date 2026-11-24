# Hoja de ruta

Aprobada por Frederik el 2026-11-23 (D-2026-11-23-2). Cada fase termina con algo que se puede probar; solo las decisiones vuelven a Frederik.

| Fase | Qué | Estado | Resultado esperado |
|---|---|---|---|
| **0. Diagnóstico** (en paralelo, solo lectura) | a) Auditoría de código + documentación base. b) Auditoría de sonido y fuentes CC0 (~100 MB). c) Principios de UX para apps musicales en vivo. | a) hecha 2026-11-23 ([auditoría](auditorias/2026-11-23-codigo.md)). b) y c) en curso | `docs/` completo; [sonido.md](sonido.md) y [diseno.md](diseno.md) llenos |
| **1. Propósito y decisiones** | Una página con propósito, usuario principal, qué no es, y las recomendaciones de la Fase 0 con fuentes. | pendiente | Base: [proposito.md](proposito.md) |
| **2. Cambios rápidos** | Ocultar micrófono; acordes por parte visibles y editables desde Tocar; corregir textos que contradicen los valores por defecto. | **hecha en 1.9.0** (2026-11-24, D-2026-11-24-1 y -2), en revisión en su PR | Versión 1.9.0 |
| **3. Sonido** | Nuevas muestras con capas de intensidad y variantes; carga por demanda para seguir abriendo rápido. | pendiente | Versión con batería mejorada |
| **4. Pad de batería** | Prototipo de pantalla para aprobar; luego código. | pendiente | Prototipo → versión |

## Ideas abiertas (sin fase)
- Setlist por servicio (README §7).
- Diseño adaptable a tablet y computadora.
- Controles de PadLab: transición de acordes ajustable, quitar graves, Pulse (D-2026-11-20-1).
- Más estilos latinos de iglesia si se piden.
- Piano real CC0 (VCSL).
- Micrófono rehecho (ver opciones en la auditoría) si las métricas muestran uso.
- App nativa (Capacitor) solo si la PWA se queda corta.
