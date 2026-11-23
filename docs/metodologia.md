# Metodología: design thinking + ágil

Pedida por Frederik desde el inicio: **ir de lo genérico a lo específico**, con una estructura funcional robusta, y decidir con fuentes.

## Ciclo de cada cambio

| Etapa (design thinking) | Qué se hace aquí | Entregable |
|---|---|---|
| **Empatizar** | Leer el pedido del usuario y el feedback ([feedback.md](feedback.md)); si hay datos, mirar GoatCounter o el Diagnóstico de audio. | Problema en palabras del músico. |
| **Definir** | Identificar la causa raíz aunque el pedido esté mal expresado. Revisar contra [proposito.md](proposito.md): ¿choca con "qué no es"? | Una frase de problema + criterio de éxito. |
| **Idear** | 2–3 opciones, de la más simple a la más completa, con costo (peso en MB, complejidad, riesgo para el audio en vivo). | Recomendación con fuentes. |
| **Prototipar** | Para cambios de pantalla: prototipo interactivo (Artifact) antes del código. Para sonido: comparación antes/después en audio. | Algo que Frederik pueda tocar u oír. |
| **Probar** | Frederik lo prueba en su iPhone; los cambios de audio se miden (`npm test`, `tools/_loud.mjs`, Diagnóstico). | Aprobado o ajustes. |

## Ritmo ágil
- **Incrementos pequeños y publicables:** cada versión (`X.Y.Z`, README §5.13) es algo que el músico nota, con su nota en el changelog.
- **Fases con decisión al final:** cada fase entrega algo probable y trae a Frederik solo las decisiones (ver [roadmap.md](roadmap.md)).
- **Un hilo por frente de trabajo**, coordinados desde el chat del proyecto; cada hilo deja su resultado en `docs/`.
- **Definición de terminado:** fuentes y generados en el mismo commit, `npm test` dice `OK`, changelog actualizado, revisado en 390 × 844, documentación actualizada (este directorio), PR fusionado.

## Reglas de decisión
1. **Cuidar al músico en vivo por encima de todo.** Si una función puede fallar en el escenario, se oculta o se marca beta hasta que sea fiable.
2. **Lo más simple que funcione.** Primero ajustar lo existente; después agregar.
3. **Peso:** el presupuesto de descarga lo fija Frederik (hoy ~1.7 MB; tope propuesto 100 MB para sonido con carga por demanda, pendiente de confirmar en la Fase 3).
4. **Cada decisión con fuente:** PR, medición, artículo, guía (Apple HIG, Material) o comentario de usuario, registrada en [decisiones.md](decisiones.md).
5. **Desacuerdo con las reglas de identidad:** decirlo y proponer una alternativa que las respete (README §2.7).

## Forma de trabajo con Frederik (instrucciones del proyecto)
- Actuar como experto; evaluar antes de actuar; identificar el problema completo y sus causas raíz.
- Proponer la solución funcional más simple, aunque él no la haya mencionado.
- Si hacen falta herramientas, cuentas o hardware, entregar la lista mínima.
- Presentar una propuesta completa antes de cambios grandes.
- Responder en español.
