# Guion de pitch — aproximadamente tres minutos

Versión alineada con la historia definitiva del equipo y el código inspeccionado en `b1a126c`. Los datos del caso están migrados; el motor Qiskit y la partida integrada aún no están verificados. Las indicaciones entre corchetes no se leen. Ensayar con cronómetro: los tiempos son una pauta, no una duración medida.

## 0:00–0:25 · Problema

«¿Una moneda equilibrada debe dar cinco caras en diez intentos? Confundir probabilidad y frecuencia puede llevarnos a conclusiones equivocadas. Quantum Files propone aprender a revisar evidencias investigando con Detective Cuy. Apuntamos a personas desde los catorce años; todavía debemos evaluar esa adecuación.»

## 0:25–0:55 · Caso y solución educativa

«En El experimento fantasma, Sami añade una segunda Hadamard al circuito de Qori Lab a las 21:14. Rumi retira después el módulo, a las 21:19. El jugador debe distinguir ambas acciones. Reconstruir el circuito explica el cambio; la memoria de auditoría identifica la edición de Sami. La acusación necesita ambas evidencias, no una declaración estadística incorrecta.»

## 0:55–1:30 · Componente cuántico y clásico

«Cada medición cero o uno se modela como Bernoulli. El conteo de ejecuciones independientes sigue una distribución binomial. Una moneda es una analogía del muestreo, no un equivalente físico del qubit.

Desde cero, una Hadamard da probabilidades iguales. Dos Hadamard seguidas, sin medir entre ellas, recuperan cero con certeza en el modelo ideal. Qiskit debe ejecutar esa preparación y medición en simulación local. En el código actual los conteos todavía son provisionales: tener fragmentos Qiskit no acredita ejecutarlos. La cronología, la evaluación de evidencias y los cálculos estadísticos son operaciones clásicas.»

## 1:30–2:00 · Demostración disponible

[Mostrar el JSON oficial y ejecutar la comprobación matemática H/H–H del README. Presentarla como cálculo clásico del modelo ideal, no como circuito Qiskit ejecutado. No usar el enlace Vercel como demo de este proyecto.]

«Este es el expediente actualizado y esta comprobación calcula probabilidades de un medio y cero para obtener uno. No es una partida ni una medición en hardware: es una referencia matemática para verificar el futuro simulador. La auditoría vincula el cambio con Sami; la retirada posterior de Rumi no inicia el sabotaje.»

## 2:00–2:30 · Metodología y validación

«El ciclo previsto es predecir, experimentar, observar, comprender y desbloquear evidencia. Queremos que el jugador justifique decisiones comparando frecuencia y probabilidad. Tenemos tres preguntas previas y tres posteriores. Proponemos probar con dos a cinco personas y registrar comprensión, finalización, tiempo, facilidad e interés. El retorno voluntario se observa por separado. No hay resultados de jugadores registrados.»

## 2:30–3:00 · Límites y continuación

«Los contenidos están listos; faltan la adaptación del motor y la integración visual. No afirmamos ventaja cuántica, aprendizaje automático entrenado ni eficacia educativa demostrada. El modelo es ideal y de un qubit. El archivo PHI, con firma Φ, anuncia el siguiente episodio sin prometer que ya exista. El siguiente paso es comprobar el recorrido integrado y evaluarlo con personas.»

## Preparación de la demostración

Usar exclusivamente el Caso 01 aprobado, con H/H–H, Sami, Rumi y PHI/Φ. Abrir expediente y terminal antes del pitch. Si el cálculo falla, explicar el contraste y mostrar el registro de verificación como evidencia técnica; no simular una partida. La página Vercel suministrada no acredita esta versión.

Si A y B integran antes de presentar, revisar el guion contra el commit final: comprobar el circuito ejecutado, versiones, shots y semilla, la resolución con ambas evidencias y el acceso público al despliegue. Sustituir las frases sobre pendientes solo tras esa comprobación. No hay un video de respaldo acreditado en esta entrega.
