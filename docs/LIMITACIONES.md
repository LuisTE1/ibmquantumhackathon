# Limitaciones y estado de evidencia

## Simulación cuántica

- `web/api/_qrun.py` usa Qiskit `Statevector` y `StatevectorSampler` sobre CPU clásica. No se ejecuta una QPU ni se envían trabajos a IBM Quantum.
- Si la API está caída o fuera de línea, `web/public/js/sim.js` corre un simulador JavaScript independiente. El resultado no es Qiskit y no debe describirse como tal.
- El circuito simulado es ideal, de un qubit, desde el estado inicial `|0⟩`, con puertas H/X y medición final. No representa ruido, decoherencia, calibración ni el efecto físico del módulo retirado.
- La semilla se usa por petición y permite repetir una simulación Qiskit si se conserva; la interfaz genera semillas al azar y no las incluye en la exportación de resultados. Las pruebas automatizadas usan semillas fijas.
- No se entrena un algoritmo QML. Kernels cuánticos y modelos variacionales son extensiones futuras, no capacidades del episodio.

## Rigor estadístico

En diez lanzamientos con probabilidad 0,5, la cola unilateral es `P(X ≥ 7 | n = 10, p = 0,5) = 0,171875`. El evento bilateral simétrico `X ≤ 3 o X ≥ 7` tiene probabilidad 0,34375. No son la misma cifra; no se debe llamar bilateral a la cola unilateral ni tratar ninguna como la probabilidad de que una persona sea culpable.

Una muestra que contiene siete unos no demuestra que el dispositivo esté alterado. La acusación del relato se sostiene en la memoria de auditoría y la reconstrucción del circuito. El valor estadístico solo ilustra variación muestral.

## Evaluación educativa

No hay datos reales documentados de pruebas con participantes, comprensión, facilidad, tiempo o retorno. La audiencia 14+ es propuesta y falta validarla. El cuestionario opcional de la PWA tiene tres preguntas antes y tres después, pero no son formas equivalentes y sus contenidos no miden todos los mismos objetivos en ambas fases. El exportador conserva puntuaciones, no respuestas individuales ni duración. Un resultado pequeño de 2–5 personas sería exploratorio, no una demostración causal.

## Persistencia y datos

El progreso se guarda en `localStorage` del dispositivo. No existen cuentas, base de datos ni seguimiento centralizado. El resumen de resultados se copia a petición del jugador y no se transmite automáticamente. Si se borra el almacenamiento del navegador, se puede perder el progreso.

## Accesibilidad y compatibilidad

El código contiene controles de teclado y táctiles, etiquetas ARIA, regiones de estado y nombres para varios gráficos. No se hizo una evaluación WCAG, prueba formal con tecnologías de asistencia, medición de contraste o revisión con usuarios con discapacidad. Tampoco hay una matriz de compatibilidad de navegadores, sistemas operativos, instalación PWA y modos sin conexión. La instalación depende del navegador y de servir la PWA en un contexto compatible.

## Versiones y recorrido narrativo

La PWA web es la aplicación actual. El Streamlit de `app.py`, `engine/`, `CONTRATO.md` y varios JSON raíz son materiales heredados y no describen el runtime de la PWA. `cases/caso1_v2.json` conserva el expediente aprobado como referencia, pero el juego web mantiene narrativa y cuestionario dentro de `web/public/js/game.js`.

La demo `https://quantum-files.vercel.app/` respondió a comprobaciones HTTP el 24 de octubre de 2026, incluida una petición H–H a la API. Los assets remotos `index.html`, `game.js` y `sw.js` no coincidieron con el origen inspeccionado; no se confirmó la rama o el commit del despliegue ni que sea la versión de entrega. No se comprobó el recorrido completo en navegador.

## Reproducibilidad

`web/pyproject.toml` declara Python `>=3.12` y `qiskit>=2.1`, sin fijar versiones exactas. El API devuelve versión Qiskit y acepta semilla, pero la interfaz no exporta el registro completo de entradas, semillas y salidas del experimento. La prueba de 31 secuencias cubre probabilidades para circuitos cortos de H/X, no ruido, varios qubits ni la experiencia educativa.
