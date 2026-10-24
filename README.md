# Quantum Files — Caso 01: El experimento fantasma

**Quantum Files** es un juego de investigación educativo para navegador y móvil, preparado para la categoría EdTech del IBM Quantum Hackathon 2026 por el equipo **Qubit a la Brasa**. En Qori Lab, Detective Cuy investiga una alteración del circuito: Sami añade una segunda H a las 21:14; Rumi retira después un módulo a las 21:19. La memoria de auditoría vincula la edición con Sami; el experimento reconstruye su efecto. Rumi no inicia el sabotaje. El archivo PHI, con firma Φ, anuncia el siguiente episodio.

**Estado técnico:** la PWA y su API Python/Qiskit están implementadas en la rama principal. Este README describe esa aplicación web; no describe como producto actual el prototipo Streamlit anterior.

## Qué aprende quien juega

El episodio busca que el jugador pueda:

- distinguir la probabilidad teórica de una frecuencia observada;
- relacionar la preparación de un qubit con las probabilidades de sus mediciones;
- interpretar H y X y seguir el efecto de dos H seguidas sin medición intermedia;
- justificar una conclusión con la reconstrucción del circuito y la memoria de auditoría, no con una declaración estadística incorrecta.

El público objetivo propuesto es de 14 años en adelante. Esa edad es una decisión de diseño por validar, no un mínimo validado con participantes.

## Qué contiene la PWA

- Recorrido narrativo por Qori Lab con diálogos, objetivos y libreta de evidencias.
- Actividades de predicción y experimentación con circuitos de un qubit y puertas H y X.
- Conteos de mediciones, barras de resultados y una etiqueta que identifica Qiskit en servidor o el simulador local.
- Desafíos repetibles, pistas, puntos, rachas e insignias.
- Cuestionario opcional de tres preguntas antes y tres después, implementado directamente en `web/public/js/game.js`.
- Interfaz adaptable con teclado y controles táctiles, manifest y service worker.
- Guardado local del progreso con localStorage.

La PWA contiene sus propios diálogos, desafíos y preguntas en JavaScript. No carga el guion desde `cases/caso1_v2.json` ni el cuestionario desde `cases/quiz.json`.

## Demo pública

[https://quantum-files.vercel.app/](https://quantum-files.vercel.app/)

El 24 de octubre de 2026 se comprobó por HTTP que la página, CSS, JavaScript, service worker y manifest responden. `index.html`, `game.js`, `sim.js`, `styles.css` y `sw.js` publicados coinciden con los assets del `origin/main` actual; el manifest presenta el nombre esperado del proyecto. GET `/api/run` devolvió `source: qiskit`, versión 2.6.1, y POST H–H con 20 shots devolvió probabilidades 1/0 y conteos 20/0. Es un smoke test de recursos y API, no una prueba de navegación completa ni una comprobación de metadatos internos del build de Vercel.

## Arquitectura y simulación

La interfaz está en `web/public/`. El endpoint `POST /api/run` recibe puertas, número de shots y semilla; `web/api/_qrun.py` calcula las probabilidades ideales con `Statevector` y muestrea los conteos con `StatevectorSampler`, sobre un computador clásico. No se envían trabajos a una QPU ni se usa una cuenta de IBM Quantum.

Si la API falla o no hay conexión, `web/public/js/sim.js` aplica una simulación clásica local de amplitudes y muestrea resultados con su propio generador seudoaleatorio. La interfaz marca ese resultado como “Simulador local”. Es un respaldo en JavaScript, no una ejecución Qiskit. En ambos modos se simula un qubit ideal, sin ruido ni efectos físicos del módulo retirado. Véase [Arquitectura](docs/ARQUITECTURA.md) y [Limitaciones](docs/LIMITACIONES.md).

## Ejecutar en local

Se requiere Python 3.12 o posterior y Qiskit, según `web/pyproject.toml`.

Para servir el juego y probar también la API Qiskit:

~~~powershell
python -m pip install -r web/requirements.txt
python web/serve_local.py
~~~

Abrir `http://localhost:8765`. El servidor local importa Qiskit y ofrece la API en el mismo origen.

Para revisar solo la interfaz estática, sin API Qiskit:

~~~powershell
python -m http.server 8765 --directory web/public
~~~

Abrir `http://localhost:8765`. Las solicitudes a la API no estarán disponibles; el juego debe recurrir al simulador local JavaScript.

Ejecutar las pruebas del núcleo web desde la raíz:

~~~powershell
python -m pip install pytest
python -m pytest -q tests/test_web.py
~~~

Las pruebas comparan probabilidades de Qiskit y JavaScript para las 31 secuencias de cero a cuatro compuertas H/X, además de revisar probabilidades conocidas, conteos repetibles, entradas inválidas y el handler HTTP. Node.js permite ejecutar la comparación JS; la prueba se omite si Node no está instalado. Las pruebas de navegador y sus requisitos están descritos en [tests/e2e/README.md](tests/e2e/README.md). Para el resultado real de esta revisión y las pruebas pendientes, consultar [Validación](docs/VALIDACION.md) y [Estado de integración](docs/ESTADO-INTEGRACION.md).

## Fuentes, créditos y documentos

La aplicación usa HTML, CSS y JavaScript del navegador, Python, Qiskit y Vercel. Parte del arte del Detective Cuy, Sami/la llama y el fondo andino se reutilizó del proyecto anterior del equipo, “Juego_HTA” / Hack the Andes. El equipo declara asistencia de Claude Code en la implementación y de OpenAI Codex en revisión y documentación; el equipo conserva responsabilidad por las decisiones y el contenido. La lista de referencias y alcance está en [Fuentes](docs/FUENTES.md).

- [Índice de documentación vigente e histórica](docs/README.md)
- [Pedagogía](docs/PEDAGOGIA.md)
- [Protocolo de validación](docs/VALIDACION.md)
- [Guion de pitch](docs/GUION-PITCH.md)
- [Lista de entrega](docs/ENTREGA.md)
- [Estado de integración y fuentes de verdad](docs/ESTADO-INTEGRACION.md)
- [Migración narrativa y referencia JSON v2](docs/MIGRACION-NARRATIVA.md)

## Pruebas internas y alcance del proyecto

Los cuatro integrantes probaron manualmente el videojuego. Estas pruebas internas confirman que el equipo interactuó con el prototipo, pero no contamos con métricas registradas de duración, puntuaciones pretest/postest ni resultados cuantitativos. No equivalen a una evaluación externa ni demuestran eficacia pedagógica. La validación con participantes externos sigue pendiente; las preguntas iniciales y finales tampoco son formas equivalentes y la duración no se registra automáticamente.

La simulación Qiskit ocurre en CPU y no demuestra ventaja cuántica; el respaldo JavaScript es otro simulador. El episodio no entrena un modelo QML. El progreso se guarda localmente, sin cuentas ni analítica centralizada. La compatibilidad y accesibilidad aún no cuentan con auditoría formal. El detalle está en [Limitaciones](docs/LIMITACIONES.md) y [Validación](docs/VALIDACION.md).
