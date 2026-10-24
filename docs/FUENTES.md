# Fuentes, dependencias y créditos

## Fuentes técnicas primarias

- [Qiskit: Statevector](https://quantum.cloud.ibm.com/docs/en/api/qiskit/qiskit.quantum_info.Statevector) — definición de estados y probabilidades de medición usadas por `web/api/_qrun.py`.
- [Qiskit: StatevectorSampler](https://quantum.cloud.ibm.com/docs/en/api/qiskit/qiskit.primitives.StatevectorSampler) — sampler de referencia basado en simulación de vector de estado que genera los shots del endpoint.
- [Qiskit: simulación exacta con primitives](https://quantum.cloud.ibm.com/docs/en/guides/simulate-with-qiskit-sdk-primitives) — contexto para distinguir simulación local de uso de una QPU.
- [Vercel: Python Runtime](https://vercel.com/docs/functions/runtimes/python) — funciones Python usadas para servir el endpoint.
- [Python 3.12: http.server](https://docs.python.org/3.12/library/http.server.html) — clases estándar de servidor HTTP usadas por el handler y el servidor de desarrollo.
- [SciPy: distribución binomial](https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.binom.html) — referencia conceptual para la distribución de conteos. El prototipo web no depende de SciPy.
- [IBM Quantum Learning: bits, puertas y circuitos](https://learning.quantum.ibm.com/course/utility-scale-quantum-computing/lesson-02-bits-gates-and-circuits) — conceptos introductorios de qubit, puertas y medición.
- [The National Academies: How People Learn II](https://nap.nationalacademies.org/catalog/24783/how-people-learn-ii-learners-contexts-and-cultures) — referencia general sobre contexto, motivación y evaluación del aprendizaje; no constituye evidencia de efectividad de este juego.

## Bases del hackathon y recomendaciones

La descripción del reto EdTech, las instrucciones de entrega y la rúbrica se contrastaron con las bases de participación y evaluación entregadas al equipo para IBM Quantum Hackathon 2026. La copia consultada forma parte del material local del evento; esta documentación no atribuye a la rúbrica una página pública que no se haya verificado. Pesos usados para la revisión documental: innovación, validación y aplicación 25 %; Qiskit y presentación 25 %; metodología EdTech 20 %; rigor y reproducibilidad 15 %; arquitectura y calidad técnica 15 %.

También se revisaron las skills de apoyo EdTech y hackathon compartidas con el equipo. Son guías de diseño y revisión, no bibliotecas ejecutadas por la aplicación.

## Tecnologías que aparecen en el código

- **Qiskit** (`qiskit>=2.1`): construcción del circuito, probabilidades con `Statevector` y conteos de shots con `StatevectorSampler` en `web/api/_qrun.py`.
- **Python 3.12 o posterior**: API serverless y servidor local. Los imports del código incluyen módulos de biblioteca estándar como `json`, `http.server`, `socket`, `os` y `sys`.
- **HTML, CSS y JavaScript del navegador**: interfaz, minijuegos, persistencia local y simulador de respaldo `web/public/js/sim.js`. No hay una librería frontend externa en los scripts de `index.html`.
- **Vercel**: hosting de los recursos estáticos y función Python según `web/vercel.json` y `web/pyproject.toml`.
- **Node.js y pytest**: necesarios o usados para ejecutar las pruebas de comparación JavaScript y la suite de Python; no son dependencias del juego en navegador.

La simulación del caso corre en CPU clásica. No se usa Aer, una cuenta IBM ni un backend de QPU en el recorrido del juego.

## Contenido, reutilización y asistencia

- La historia de Qori Lab y los personajes son ficción educativa del equipo. Los hechos de Sami a las 21:14, Rumi a las 21:19, la memoria de auditoría y el archivo PHI/Φ son parte del guion.
- El arte del Detective Cuy, la llama que representa a Sami y el fondo andino se reutilizaron del proyecto anterior del equipo, “Juego_HTA” / Hack the Andes, según los créditos del README web. Antes de distribuir fuera del hackathon, el equipo debe confirmar titularidad y licencias de los assets reutilizados.
- El equipo declara uso de Claude Code durante implementación y de OpenAI Codex en revisión/documentación. No se emplearon modelos QML ni servicios de IA dentro de la partida. El equipo revisa y asume responsabilidad por el código y los contenidos.

Los enlaces anteriores describen las herramientas y conceptos generales. Los resultados concretos de esta versión se deben verificar contra los archivos del repositorio y las pruebas; no se infieren de una página de producto.
