# Diseño pedagógico

## Público y alcance

El público objetivo propuesto es de 14 años en adelante, con lectura funcional de porcentajes y sin exigir experiencia previa con computación cuántica. Es una hipótesis de diseño: no se ha validado la edad con participantes ni mediante una revisión de accesibilidad. El lenguaje, el tiempo de partida y la comprensión deben probarse con adolescentes y docentes antes de fijar una recomendación final.

El episodio actual combina narrativa, explicaciones breves, desafíos y preguntas opcionales. El juego enseña ideas introductorias de estadística y circuitos cuánticos; no enseña ni ejecuta entrenamiento de Machine Learning cuántico.

## Objetivos de aprendizaje

Al terminar, se espera que la persona pueda:

1. Explicar por qué una frecuencia observada en una muestra puede diferir de la probabilidad teórica.
2. Relacionar la preparación y transformación del qubit con las probabilidades de medición.
3. Interpretar H, X y la secuencia H–H sin medición intermedia.
4. Justificar la acusación narrativa usando evidencia de auditoría y reconstrucción, sin atribuir culpabilidad a un resultado estadístico aislado.

Son resultados esperados, no resultados observados en una evaluación con estudiantes.

## De Bernoulli a la medición de un qubit

Un ensayo de Bernoulli tiene dos resultados y una probabilidad p de obtener 1. Si se repiten ensayos independientes manteniendo p, el número de unos en n intentos sigue una distribución binomial. La probabilidad teórica describe el modelo; la frecuencia observada es la proporción que produjo una muestra concreta. No tienen por qué coincidir exactamente.

En el episodio, cada shot vuelve a preparar el qubit y mide el resultado 0 o 1. Para la base computacional, cada resultado puede analizarse como Bernoulli con p igual a la probabilidad de medir 1 que induce el estado preparado. La analogía con lanzar una moneda ayuda a entender muestreo y variación; una moneda y un qubit no son físicamente equivalentes.

El ejemplo de diez ensayos justos distingue probabilidad de evidencia: la probabilidad unilateral de obtener siete o más unos es 0,171875. Esto no es la probabilidad de que la moneda esté alterada ni la probabilidad de que alguien sea culpable. El resultado de una muestra no identifica a una persona.

## H, X e interferencia

Desde el estado inicial 0, H crea una superposición con probabilidades de medición 0,5 para 0 y 0,5 para 1. Una puerta X intercambia los estados base 0 y 1. Dos H seguidas, sin medir entre ellas, devuelven el estado inicial porque las amplitudes interfieren; al final, el modelo ideal predice 0 con probabilidad 1. Si hubiera una medición intermedia, el circuito sería distinto.

La API Qiskit calcula las probabilidades ideales y muestrea shots mediante StatevectorSampler; si no responde, el navegador usa un simulador JavaScript independiente. Ambos son simulaciones clásicas ideales de un qubit. No se ejecuta una QPU ni se modela el módulo retirado como ruido o descalibración. H y X son puertas cuánticas, no algoritmos de Machine Learning.

No se entrena un modelo QML en este episodio. Los kernels cuánticos o modelos variacionales podrían ser extensiones futuras, pero requerirían un objetivo de aprendizaje, datos, comparación clásica y evaluación propios.

## Aprender investigando y mediante decisiones

La historia da una pregunta concreta al experimento: qué cambió en el circuito y quién registró la edición. Para resolverla, la persona debe predecir, probar, observar el resultado y enlazar la explicación del circuito con la memoria de auditoría. Una frecuencia inusual no es una acusación.

### Ciclo implementado

| Etapa | Lo que hace el jugador | Apoyo disponible |
|---|---|---|
| Predecir | Antes de comprobar un reto, elige si el circuito dará 0, 1 o una mezcla. | Lecciones breves de Profe Cuy y recordatorios visuales de H, H–H y X. |
| Experimentar | Envía una secuencia de puertas a la API, o usa el respaldo local si la API no responde. | El circuito y su estado se representan en pantalla. |
| Observar | Revisa conteos y barras de los 20 shots del desafío. | La interfaz etiqueta el origen del resultado como Qiskit o simulador local. |
| Comprender | Recibe explicación al acertar o una pista al equivocarse; puede volver a intentar. | La retroalimentación relaciona la puerta con la predicción, no solo marca correcto/incorrecto. |
| Desbloquear evidencia | Avanza por interacciones y consulta la libreta hasta completar el caso. | Las evidencias conectan la reconstrucción con el registro narrativo; la historia atribuye la edición a Sami y deja claro que Rumi retira el módulo después. |

La secuencia y el contenido están implementados en `web/public/js/game.js`; los datos JSON raíz no alimentan este recorrido.

La decisión importa porque obliga a explicitar una predicción antes de ver el conteo y a interpretar el error. Eso ofrece una oportunidad de razonamiento y retroalimentación inmediata. Que ese diseño mejore el aprendizaje más que una explicación sin juego sigue siendo una hipótesis: no hay estudio comparativo ni resultados de participantes.

## Cuestionario y alcance de la medición

El juego ofrece un cuestionario opcional de tres preguntas antes y tres después, escrito en JavaScript. El pretest pregunta sobre variación en diez lanzamientos, una medición 50/50 y si siete unos prueban una alteración. El postest pregunta por H–H, X y qué evidencia sostiene una acusación. Por ello no son formas paralelas: el postest cubre transformaciones que el pretest no pregunta directamente. Una diferencia de puntuación sirve como dato exploratorio, no como estimación causal de aprendizaje.

El juego da retroalimentación y permite reintentar. Para el análisis se debe conservar el primer intento. El botón de resultados exporta las puntuaciones del primer y último intento, no las respuestas individuales. El protocolo propuesto para completar esa información está en `VALIDACION.md`.

`cases/quiz.json` conserva un banco de contenido del prototipo anterior y no es el cuestionario que ve el jugador en la PWA.

## Motivación para volver

El caso abre un hilo narrativo con PHI/Φ. Los desafíos repetibles, las rachas, los puntos, las insignias y la posibilidad de reiniciar ofrecen motivos para practicar conceptos y explorar el siguiente episodio. Son mecanismos de diseño, no evidencia de retención. No hay justificación empírica para recomendar jugar a diario o semanalmente; esa frecuencia y el interés por nuevos casos deben preguntarse a participantes.
