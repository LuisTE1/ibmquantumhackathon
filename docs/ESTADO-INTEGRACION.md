# Estado de integración y fuentes de verdad

**Revisión:** 24 de octubre de 2026. La rama `docs/edtech-final` parte de la versión más reciente de `origin/main`; `feat/contenido` se conserva como respaldo. Las ramas habían divergido: `origin/main` tenía 11 commits que no estaban en la rama de contenido y esta tenía un commit de contenido que no estaba en main. Por eso se recuperan documentos de forma selectiva y no se hace merge completo de la rama antigua.

## Qué describe cada fuente

| Archivo o grupo | Estado y función |
|---|---|
| `web/public/index.html`, `styles.css`, `js/game.js` | Interfaz PWA, historia, desafíos, diálogo, evidencias y preguntas realmente presentados por el frontend actual. |
| `web/public/js/sim.js` | Simulador local JavaScript que se usa como respaldo cuando la API no responde. |
| `web/api/run.py`, `web/api/_qrun.py` | Endpoint `/api/run` y simulación Qiskit en CPU para los circuitos H/X de un qubit. |
| `web/pyproject.toml`, `web/requirements.txt`, `web/vercel.json` | Dependencias y configuración de la aplicación web desplegable. |
| `tests/test_web.py` | Pruebas del núcleo de la PWA: probabilidades, conteos, validación del handler y cotejo JS/Qiskit. |
| `app.py`, `engine/`, `CONTRATO.md` | Sistema Streamlit y contrato compartido del prototipo anterior; no son la interfaz ni el contrato interno de la PWA. Se conservaron sin cambios. |
| `cases/caso1.json` | Caso del formato heredado usado por los consumidores Streamlit. Se dejó intacto deliberadamente. |
| `cases/quiz.json` | Banco estructurado del prototipo anterior; la PWA define su propio quiz en `web/public/js/game.js`. |
| `cases/caso1_v2.json` | Copia del expediente aprobado Sami/Rumi, útil como referencia narrativa y de datos. La PWA no lo carga dinámicamente. |
| `docs/` vigente | Documentación del producto web y de cómo comprobarlo; los registros históricos están indexados aparte. |

Las carpetas y la separación de datos de Streamlit no deben confundirse con la fuente de datos de la PWA. La PWA actual está integrada en JavaScript: los diálogos, objetivos y preguntas están escritos en `game.js`; la aplicación no consulta `cases/caso1_v2.json`, `cases/quiz.json` ni `cases/glossary.json`. La API sí ejecuta Qiskit; ello no significa que el resto del contenido se cargue desde el JSON v2.

## Interfaces web verificadas en el código

`POST /api/run` recibe `gates`, `shots` y `seed`. El motor admite hasta ocho puertas H/X y entre 1 y 4096 shots. `Statevector` calcula probabilidades exactas del circuito ideal y `StatevectorSampler` produce conteos muestreados. La ruta soporta las transformaciones que requiere el caso: H y H–H, con medición al final. No hace falta ampliar la interfaz de circuito para este episodio. El frontend prueba la llamada durante un máximo de 3,5 segundos; al fallar, usa el simulador JavaScript. La etiqueta visible diferencia el origen del resultado.

El endpoint ofrece además GET para la prueba/calentamiento del circuito H y OPTIONS para preflight. El resultado incluye probabilidades, conteos, origen y versión de Qiskit. Cada petición del frontend usa una semilla seudoaleatoria; la interfaz no exporta un registro de semillas, circuitos y conteos.

## Diferencias respecto al contrato heredado

`CONTRATO.md` no se modificó y describe firmas y contenido del prototipo Streamlit. No es una especificación de cómo funciona la PWA. El `engine/` y `app.py` pueden seguir siendo útiles para ese prototipo, pero no controlan el recorrido web.

El cuestionario que realmente se ofrece está codificado en `web/public/js/game.js`; su exportación guarda los puntajes del primer y último intento, pero no respuestas individuales ni duración. `cases/quiz.json` no debe citarse como el quiz de la PWA.

El expediente v2 se copia a `cases/caso1_v2.json` sin sustituir `cases/caso1.json`. El archivo nuevo documenta el caso oficial y sus campos, pero no se presenta como activo hasta que una implementación de frontend decida cargarlo. No se cambian las firmas o los consumidores heredados desde esta actualización documental.

## Comprobaciones estadísticas y de conteo

`tests/test_web.py` genera secuencias H/X con longitudes de cero a cuatro. El total es `1 + 2 + 4 + 8 + 16 = 31`, no 63. `web/README.md` conserva el texto 63; pertenece a documentación de la aplicación mantenida fuera de Persona 3. Propuesta concreta a su responsable: cambiar “63 secuencias” por “31 secuencias H/X de longitud cero a cuatro”.

Para diez resultados Bernoulli con p = 0,5, `P(X ≥ 7) = 0,171875` es unilateral. El evento bilateral simétrico `X ≤ 3 o X ≥ 7` vale 0,34375. No intercambiar ambas cifras ni llamarlas probabilidad de culpabilidad.

## Verificación de la demo pública

El 24 de octubre de 2026 se hicieron solicitudes HTTP de solo lectura a `https://quantum-files.vercel.app/`:

- La portada respondió 200 y su título fue “Quantum Files · El experimento fantasma”.
- `game.js`, `sim.js`, `sw.js` y `manifest.webmanifest` respondieron 200.
- GET `/api/run` respondió 200 con `source: qiskit` y versión 2.6.1.
- POST con H–H, 20 shots y semilla 1 respondió 200, probabilidades 1/0 y conteos 20/0.
- Una comparación de los assets publicados con el árbol de `origin/main` encontró `sim.js` idéntico, pero `index.html`, `game.js` y `sw.js` distintos. El service worker tenía igual longitud, no igual contenido.

Esto demuestra disponibilidad puntual de la página y API, no autoría del commit ni identidad de la versión de entrega. Tampoco se hizo una prueba de navegación automatizada del juego en navegador. El enlace debe describirse como smoke verificado, no como release vinculado a esta rama.
