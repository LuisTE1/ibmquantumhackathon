# Validación técnica y protocolo educativo

## Estado de evidencia

No hay resultados de sesiones con participantes registrados. Las tablas de este documento están vacías y deben completarse con observaciones reales. El 24 de octubre de 2026 se verificaron por HTTP la página, assets principales y API pública; no se ejecutó el recorrido completo en navegador. Ver `ESTADO-INTEGRACION.md`.

## Pruebas técnicas reproducibles

Desde la raíz del repositorio, con Python 3.12 o posterior, Qiskit instalado desde `web/requirements.txt` y Node.js disponible para ejecutar la comparación JavaScript:

~~~powershell
python -m pip install -r web/requirements.txt
python -m pip install pytest
python -m pytest -q tests/test_web.py
~~~

`tests/test_web.py` verifica probabilidades conocidas, conteos repetibles, entradas inválidas, el handler HTTP y la coincidencia entre las probabilidades Qiskit y JavaScript para 31 secuencias H/X de longitud cero a cuatro. Son pruebas del núcleo técnico; no validan comprensión, facilidad de uso ni eficacia educativa. Si Node.js falta, la prueba de comparación se marca como omitida por el propio test.

En la revisión del 24 de octubre de 2026, con Python 3.14.4, `pytest -q --continue-on-collection-errors` informó 17 aprobadas, 2 fallidas y 1 error de colección. Las dos fallidas son legacy: `tests/test_circuits.py::test_moneda_semilla_0_da_7_y_3` y `tests/test_game.py::test_prueba1_p_valor_y_mensaje` esperaban siete unos con semilla 0 y observaron seis. La colección de `tests/test_web.py` se detuvo porque Qiskit no está instalado. No se modificó código para cambiar esos resultados. Con `pytest -q` sin la opción de continuar, la colección de web se interrumpe antes de ejecutar el resto. La suite web sigue pendiente en un entorno con Qiskit; estas pruebas legacy no validan la PWA.

## Pruebas de navegador del último main

El repositorio incluye `tests/e2e/verify.js`, `play6.js` y `play7.js`; sus requisitos documentados son Node 20+, Playwright y Google Chrome. En este entorno Node está instalado, pero Playwright y Chrome no están disponibles. Los tres scripts pasan `node --check`, que solo verifica sintaxis; las pruebas E2E quedaron **omitidas**, no aprobadas. Además, los guiones `verify.js` y `play6.js` cambian la sala mediante el estado interno de prueba, por lo que no certifican por sí solos la navegación natural por puertas. La navegación entre salas y el recorrido real deben completarse en un navegador con esos requisitos.

## Protocolo piloto: 2 a 5 personas

### Preparación

- Invitar entre dos y cinco participantes del público propuesto o registrar si se usa otro grupo. Identificar cada registro con un código P01–P05, no con nombre.
- Probar el mismo build y dispositivo por participante; anotar navegador, tipo de dispositivo, fecha y hash del build si se conoce.
- Antes de empezar, borrar el progreso anterior desde la interfaz o utilizar un perfil limpio. Registrar si la API usó Qiskit o el juego cayó al simulador local.
- Explicar que se evalúa el prototipo, no a la persona; solicitar autorización para tomar notas y no recoger datos identificatorios innecesarios.

### Medidas y secuencia

1. **Pretest de la PWA:** contestar una vez las tres preguntas opcionales iniciales. Registrar puntuación de 0 a 3 en el primer intento.
2. **Comprensión previa:** pedir explicaciones breves, puntuadas por un observador con la misma rúbrica que se usará después:
   - distinguir probabilidad de frecuencia con el ejemplo de 7 unos en 10;
   - explicar qué predice H y por qué H–H sin medición intermedia cambia el resultado;
   - explicar qué hace X.
   Puntuar cada explicación como 0 = no lo explica, 1 = parcial o con error, 2 = correcta y clara.
3. **Partida:** iniciar cronómetro al abrir el caso y detenerlo al mostrar el final o abandonar. Registrar duración en minutos, finalización sí/no, solicitudes de ayuda observadas y dificultades de navegación. El juego no cronometra ni exporta duración.
4. **Postest de la PWA:** completar una vez las tres preguntas finales y registrar el primer intento de 0 a 3.
5. **Comprensión posterior:** repetir las tres explicaciones abiertas con la misma rúbrica; anotar ejemplos o confusiones literalmente sin datos identificatorios.
6. **Usabilidad e interés:** preguntar facilidad general en escala de 1 (muy difícil) a 5 (muy fácil), y si jugaría otro episodio en escala de 1 (muy probable que no) a 5 (muy probable). Pedir una razón breve y una fricción principal.

Los cuestionarios de JavaScript del juego no son formas equivalentes: las preguntas previas y posteriores no cubren los mismos objetivos. Use sus puntuaciones como señal exploratoria, sin llamarlas por sí solas “mejora de aprendizaje”. La rúbrica de explicación breve proporciona una comparación más alineada, pero un piloto de 2–5 personas sigue siendo descriptivo y no demuestra causalidad ni generalización.

### Captura y privacidad

El botón “Copiar resultados” entrega un JSON con puntuación del primer y último intento, cantidad de evidencias, XP, insignias, bichos, pistas y fecha. No incluye las respuestas individuales ni la duración; estos datos se anotan manualmente en la tabla. No se envían a un servidor. Si se usa una planilla compartida, limitarla a códigos anónimos y conservarla solo el tiempo necesario para la evaluación.

`cases/quiz.json` no es la fuente del cuestionario de la PWA. Las preguntas activas están en `web/public/js/game.js`.

## Plantilla vacía de resultados

No completar con valores de prueba. Sustituir cada fila por una observación real y anónima después de una sesión.

| Código | Contexto de edad (banda) | Pre PWA /3 primer intento | Post PWA /3 primer intento | Comprensión antes /6 | Comprensión después /6 | Finalizó (sí/no) | Duración (min) | Facilidad (1–5) | Interés por otro episodio (1–5) | Modo (Qiskit/local) | Fricción o comentario |
|---|---|---:|---:|---:|---:|---|---:|---:|---:|---|---|
| P01 |  |  |  |  |  |  |  |  |  |  |  |
| P02 |  |  |  |  |  |  |  |  |  |  |  |
| P03 |  |  |  |  |  |  |  |  |  |  |  |
| P04 |  |  |  |  |  |  |  |  |  |  |  |
| P05 |  |  |  |  |  |  |  |  |  |  |  |

Informe n, datos faltantes, mediana o rango junto con resultados individuales anonimizados. No publique un porcentaje de mejora con esta muestra pequeña ni atribuya cambios únicamente al juego.
