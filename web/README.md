# Quantum Files — Caso 01: El experimento fantasma (PWA)

Juego de investigación para móvil y web. El **Detective Cuy** recorre Qori Lab (3 ambientes), reconstruye un circuito alterado y descubre quién modificó el experimento. Enseña la diferencia entre **probabilidad y frecuencia observada**, la **compuerta H** (y por qué H·H deja el qubit en 0), la **compuerta X** y cómo se sostiene una acusación con evidencia.

## Objetivo de aprendizaje (comprobable)
Tras jugar, la persona puede explicar por qué 7 unos en 10 mediciones no prueban una alteración, predecir el resultado de H→H frente a H→X y justificar una acusación con registros y reconstrucción.

## Cómo está hecho
- **Estático en public/** (HTML/CSS/JS sin compilación; la API de Python está en pi/) + **PWA** (manifest + service worker: instalable y funciona sin conexión).
- **Qiskit real** en `api/run.py` (función de Python de Vercel, `qiskit>=2.1`): ejecuta el circuito de 1 qubit con `StatevectorSampler`.
- **Respaldo local** `js/sim.js`: si la API no responde (o sin conexión), el juego usa un simulador de 1 qubit en el navegador. Cada resultado muestra su origen: «⚛️ Qiskit (servidor)» o «💻 Simulador local». `tests/test_web.py` comprueba que el simulador coincide con Qiskit en 63 secuencias de compuertas.
- Controles: **WASD/flechas + E** en PC; **cruceta, botón de acción y toques** en móvil. Teclado y etiquetas ARIA; progreso guardado en `localStorage`.
- Mini quiz de 3 preguntas antes y después (opcional) para la prueba piloto; el botón «Copiar mis resultados» genera un JSON para juntar los datos.

## Probar en local
```powershell
python web/serve_local.py        # abre http://localhost:8765 (sirve web/public y la API con Qiskit real)
```
Pruebas del núcleo: `python -m pytest tests/test_web.py -q` (desde la raíz del repo).

## Despliegue en Vercel (hecho)
- **URL pública: https://quantum-files.vercel.app** (proyecto `quantum-files`). Verificado: la página, el manifest y el service worker cargan, y `/api/run` responde con Qiskit 2.6.1.
- Estructura: `web/public/` (estáticos, servidos por la CDN) + `web/api/run.py` (función de Python) + `web/pyproject.toml` (declara el entrypoint `api.run:handler` y la dependencia `qiskit`). Importante: los estáticos NO pueden estar en la raíz de `web/`, porque con el entrypoint de Python Vercel enviaría todas las rutas a la función.
- Redesplegar tras un cambio: `cd web` y `npx vercel deploy --prod --yes` (requiere sesión de Vercel iniciada).
- Instalar como app: abrir la URL en el móvil → menú del navegador → **Instalar app / Añadir a pantalla de inicio**.
- No está conectado a GitHub para despliegue automático (`vercel git connect` requiere instalar la app de Vercel en GitHub).
## Qué es real y qué es simulación
Los circuitos son de Qiskit (1 qubit) y **se simulan en un computador clásico**: no es hardware cuántico y **no afirmamos ventaja cuántica**. Los personajes, el laboratorio y el caso son ficticios. La conexión con QML (kernels, QNN, descenso de gradiente) queda para los siguientes casos de la serie.

## Fuentes y créditos
- Arte del Detective Cuy, la llama (Sami) y el fondo andino: reutilizado del juego anterior del equipo («Juego_HTA», Hack the Andes) — declarado aquí por integridad.
- Emojis del sistema para los demás personajes. Qiskit (Apache-2.0). Fuente tipográfica del sistema.
- Se usó IA generativa (Claude Code) para programar y documentar; el equipo revisó y explica las decisiones.

