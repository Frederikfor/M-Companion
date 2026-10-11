# Instrucciones para agentes

Lee **[README.md](README.md)** completo antes de cambiar algo. Ahí están el prompt del proyecto (sección 2), los formatos (sección 5), las reglas de identidad (sección 6) y la secuencia obligatoria de cambio (sección 4):

1. Edita solo `src/`, `samples/`, `icons/` o `manifest.webmanifest`.
2. `python3 tools/build.py`
3. `npm test` (debe decir `OK`).
4. Commit de fuentes y generados juntos.

Nunca edites a mano `index.html`, `sw.js` ni `dist/`.
