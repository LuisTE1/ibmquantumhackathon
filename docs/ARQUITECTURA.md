# Arquitectura implementada

La aplicación actual está en `web/`: frontend estático en `web/public/` y una función Python de Vercel en `web/api/`. El punto de entrada de despliegue y las dependencias se declaran en `web/pyproject.toml`, `web/requirements.txt` y `web/vercel.json`.

## Flujo de ejecución

~~~mermaid
flowchart TD
    P[Jugador] --> UI[Frontend PWA<br/>HTML, CSS y JavaScript]
    UI -->|POST gates, shots, seed| API[API /api/run]
    API --> PY[web/api/run.py]
    PY --> CORE[web/api/_qrun.py]
    CORE --> SV[Statevector<br/>probabilidades ideales]
    CORE --> SAMP[StatevectorSampler<br/>conteos muestreados]
    UI -. API falla, expira o no hay red .-> JS[web/public/js/sim.js<br/>simulación local JavaScript]
    UI --> LS[(localStorage<br/>progreso del juego)]
    SW[Service worker] -. sirve recursos cacheados sin red .-> UI
~~~

## Frontend PWA

`web/public/index.html` carga `styles.css`, `js/sim.js` y `js/game.js`. El juego presenta la historia, habitaciones, diálogo, retos, cuestionarios y evidencias desde el código JavaScript; no carga el relato o las preguntas desde los JSON raíz.

La interfaz ofrece teclado (WASD/flechas y E), controles táctiles y acciones de interacción. El HTML incluye etiquetas ARIA, regiones de estado y nombres accesibles en controles y gráficos; estas características no equivalen a una auditoría de accesibilidad. El estado del juego se guarda con la clave `qf_state_v5` en `localStorage`. El usuario puede copiar un resumen JSON de resultados desde la pantalla final; no hay envío automático a un servidor de analítica.

El service worker usa la caché `qf-v5`. Durante una petición GET del mismo origen intenta la red primero, guarda una respuesta correcta y usa una copia en caché si falla; si no encuentra la ruta, intenta `index.html`. Excluye explícitamente `/api/`, así que el almacenamiento offline no convierte la API en un servicio offline. Al activarse, elimina cachés con otra versión. La interfaz intenta la API por hasta 3,5 segundos y, si falla o devuelve datos inválidos, ejecuta `QSim.run` en el navegador.

## API Python/Qiskit

- `POST /api/run`: acepta un objeto JSON con `gates`, `shots` y `seed`. Se admiten hasta ocho puertas `h` o `x`; `shots` debe estar entre 1 y 4096.
- `GET /api/run`: devuelve como comprobación un H de 10 shots e incluye una nota de uso de POST. Al cargar, `game.js` también envía un POST de calentamiento con circuito vacío y un shot.
- `OPTIONS /api/run`: respuesta para preflight CORS.
- El handler valida entradas y devuelve `counts`, `probs`, `source` y `version`. Los conteos suman los shots solicitados.

`_qrun.py` crea un circuito de un qubit desde el estado inicial `|0⟩`, aplica las puertas en orden y no mide entre ellas. `Statevector.from_instruction` obtiene probabilidades ideales de medir 0 o 1 en la base computacional. Un circuito con medición final se ejecuta con `StatevectorSampler`, con el número de shots y la semilla recibidos. El proceso corre en CPU clásica dentro de la función Python; no llama a IBM Quantum Compute Service ni a una QPU.

El frontend genera una semilla seudoaleatoria por ejecución. La API acepta semillas para que una petición concreta pueda repetirse, pero la aplicación no exporta la semilla ni el registro de cada experimento. Las pruebas sí usan semillas fijas y cotejan resultados.

## Respaldo local en JavaScript

`sim.js` aplica H/X a amplitudes de un qubit en JavaScript, calcula probabilidades y obtiene conteos mediante muestreo con su generador Mulberry32. Devuelve `source: local`; el frontend lo etiqueta como simulador local. Es una implementación clásica independiente, no una llamada a Qiskit. La prueba automatizada compara sus probabilidades con Qiskit para 31 secuencias de longitud cero a cuatro.

## Despliegue y dependencias

Vercel sirve los estáticos de `web/public/` y resuelve `web/api/run.py` como función Python. El proyecto declara Python `>=3.12` y `qiskit>=2.1`; no fija versiones exactas en esos archivos. La configuración establece diez segundos como `maxDuration` de la función y ajusta los encabezados del service worker y del manifest.

## Arquitectura no implicada

No hay base de datos, autenticación, telemetría centralizada, entrenamiento QML ni envío a hardware cuántico. La cronología del sabotaje y el retiro del módulo son hechos narrativos; el circuito simulado no modela ruido, calibración ni un efecto físico del módulo.
