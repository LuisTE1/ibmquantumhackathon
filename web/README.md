# Quantum Files — Caso 01: El experimento fantasma (PWA)

Juego de investigación para móvil y web. El **Detective Cuy** recorre Qori Lab (3 ambientes), reconstruye un circuito alterado y descubre quién modificó el experimento. Enseña la diferencia entre **probabilidad y frecuencia observada**, la **compuerta H** (y por qué H·H deja el qubit en 0), la **compuerta X** y cómo se sostiene una acusación con evidencia.

## Objetivo de aprendizaje (comprobable)
Tras jugar, la persona puede explicar por qué 7 unos en 10 mediciones no prueban una alteración, predecir el resultado de H→H frente a H→X y justificar una acusación con registros y reconstrucción.

## Cómo está hecho
- **Estático** (HTML/CSS/JS sin compilación) + **PWA** (manifest + service worker: instalable y funciona sin conexión).
- **Qiskit real** en `api/run.py` (función de Python de Vercel, `qiskit>=2.1`): ejecuta el circuito de 1 qubit con `StatevectorSampler`.
- **Respaldo local** `js/sim.js`: si la API no responde (o sin conexión), el juego usa un simulador de 1 qubit en el navegador. Cada resultado muestra su origen: «⚛️ Qiskit (servidor)» o «💻 Simulador local». `tests/test_web.py` comprueba que el simulador coincide con Qiskit en 63 secuencias de compuertas.
- Controles: **WASD/flechas + E** en PC; **cruceta, botón de acción y toques** en móvil. Teclado y etiquetas ARIA; progreso guardado en `localStorage`.
- Mini quiz de 3 preguntas antes y después (opcional) para la prueba piloto; el botón «Copiar mis resultados» genera un JSON para juntar los datos.

## Probar en local
```powershell
cd web
python -m http.server 8765      # abrir http://localhost:8765 (la API no existe en local: se usa el simulador)
```
Pruebas del núcleo: `python -m pytest tests/test_web.py -q` (desde la raíz del repo).

## Desplegar en Vercel
1. En vercel.com → **Add New → Project** → importar el repo de GitHub.
2. **Root Directory: `web`** (muy importante). Framework: *Other*. Sin build command.
3. Deploy. Vercel instala `requirements.txt` (qiskit) para `api/run.py`.
4. Verificar: abrir `https://<tu-app>.vercel.app/api/run` (debe devolver JSON con `"source": "qiskit"`). Si la función no se despliega, el juego sigue funcionando con el simulador local.
5. En el móvil: abrir la URL → menú del navegador → **Instalar app / Añadir a pantalla de inicio**.
⚠ No pude probar el despliegue en Vercel desde aquí (requiere tu cuenta): verifica el paso 4 antes de la presentación.

## Qué es real y qué es simulación
Los circuitos son de Qiskit (1 qubit) y **se simulan en un computador clásico**: no es hardware cuántico y **no afirmamos ventaja cuántica**. Los personajes, el laboratorio y el caso son ficticios. La conexión con QML (kernels, QNN, descenso de gradiente) queda para los siguientes casos de la serie.

## Fuentes y créditos
- Arte del Detective Cuy, la llama (Sami) y el fondo andino: reutilizado del juego anterior del equipo («Juego_HTA», Hack the Andes) — declarado aquí por integridad.
- Emojis del sistema para los demás personajes. Qiskit (Apache-2.0). Fuente tipográfica del sistema.
- Se usó IA generativa (Claude Code) para programar y documentar; el equipo revisó y explica las decisiones.
