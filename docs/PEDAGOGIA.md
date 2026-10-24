# Pedagogía de Quantum Files — Detective Cuy

## Público y alcance

El público objetivo propuesto son personas desde los 14 años, sin conocimientos previos de física cuántica. Es una hipótesis de diseño, no una edad mínima validada; falta probar comprensión y accesibilidad con ese público. Se requiere interpretar fracciones sencillas y porcentajes; no se exige álgebra de matrices. La duración prevista de un episodio es de 5–8 minutos, pendiente de medir con participantes.

Este documento describe el diseño educativo. En la base inspeccionada, la interfaz solo presenta conteos provisionales y un p-valor: aún no ofrece una investigación completa, cuestionarios, glosario ni desbloqueo de evidencias. Los contenidos están preparados para esa integración. Véanse [ARQUITECTURA.md](ARQUITECTURA.md) y [LIMITACIONES.md](LIMITACIONES.md).

## Objetivos observables

**Objetivo central:** justificar una decisión de evidencia comparando la frecuencia observada con la probabilidad teórica de un modelo Bernoulli asociado a la preparación de un qubit. Los tres objetivos siguientes son indicadores de ese aprendizaje central; se conservan los seis ítems acordados.

| Objetivo | Evidencia esperada del aprendizaje | Ítems en `cases/quiz.json` |
|---|---|---|
| Diferenciar probabilidad teórica y frecuencia observada | Explica por qué 7 unos de 10 no obliga a cambiar un modelo con p = 0,5 | `pre[0]`, `post[0]` |
| Comprender el papel de la preparación | Relaciona el estado preparado con las probabilidades, manteniendo fija la base de medición | `pre[1]`, `post[1]` |
| Interpretar transformaciones sencillas | Sigue una puerta X o dos H consecutivas sin confundirlas con mediciones | `pre[2]`, `post[2]` |

Los ítems no dependen de recordar nombres ni de conocer la solución narrativa. X y H–H son ejemplos conceptuales del cuestionario y del glosario; no implican que el motor ya permita ejecutar esas secuencias.

## Investigación y decisiones

El diseño propone aprender investigando: formular una hipótesis, decidir qué evidencia hace falta, probarla y justificar una conclusión. El misterio da un propósito concreto a las mediciones. Acertar un nombre sin justificarlo no demuestra comprensión.

En el caso oficial, la reconstrucción explica el efecto de añadir la segunda H y la memoria de auditoría identifica a Sami como autora de la edición a las 21:14. La retirada del módulo por Rumi a las 21:19 es posterior. La atribución exige ambas evidencias: el experimento no identifica por sí solo a una persona y una declaración estadística incorrecta no prueba culpabilidad. Es un expediente ficticio con solución escrita, aún pendiente de integrarse.

La decisión del jugador permite hacer visible su razonamiento: «¿Una frecuencia desigual basta para acusar?» o «¿Qué preparación podría producir esta probabilidad?». La retroalimentación prevista explica la consecuencia y permite reintentar. No se requieren vidas ni penalizaciones para generar interés. Que estas decisiones mejoren el aprendizaje es una hipótesis que debe evaluarse, no un resultado del prototipo.

## Puente entre estadística y medición cuántica

Un ensayo de Bernoulli tiene dos resultados, 1 y 0, con probabilidades p y 1 − p. En ejecuciones independientes con el mismo p, el número de unos sigue un modelo binomial. La frecuencia observada es `unos / ejecuciones`; no tiene que coincidir exactamente con p.

El puente cuántico consiste en preparar el mismo estado de un qubit en cada ejecución y medir siempre en la base 0/1. Cada resultado Y sigue una distribución Bernoulli: `P(Y = 1) = p`, `P(Y = 0) = 1 − p`. En el circuito original, H sobre 0 da p(1) = 0,5. La segunda H añadida por Sami, sin medición intermedia, recupera el estado 0: p(1) = 0, un caso determinista de Bernoulli. El contraste enseña que una transformación del estado cambia la distribución de medición; no es un entrenamiento de ML.

La igualdad matemática es entre las distribuciones de los resultados clásicos, bajo los mismos p, número de intentos e independencia. La moneda es una analogía educativa de muestreo, no una equivalencia física. En la comparación futura se deben mostrar p, shots, conteos y frecuencia para ambos modelos, y modificar un parámetro por vez; la app actual todavía no ofrece esa comparación ni controles interactivos.

Compartir una distribución de resultados no vuelve idénticos una moneda y un qubit. La superposición usa amplitudes y permite interferencia; no significa observar dos resultados a la vez. En el modelo ideal, dos H seguidas sin medición intermedia recuperan el estado inicial. Esto se desprende de la matriz de [Hadamard](https://quantum.cloud.ibm.com/docs/en/api/qiskit/qiskit.circuit.library.HGate). Cada shot del experimento propuesto vuelve a preparar el qubit; no se trata de medir repetidamente el mismo estado ya colapsado.

El cálculo clásico disponible da `P(X ≥ 7 | n = 10, p = 0,5) = 0,171875`. Es una cola unilateral definida previamente, no la probabilidad de que la moneda esté alterada ni de que un personaje sea culpable. No rechazar ese modelo tampoco prueba que sea correcto. El modelo binomial de referencia se describe en la [documentación de SciPy](https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.binom.html); la implementación local usa `math`, no SciPy.

## Ciclo: predecir → experimentar → observar → comprender → desbloquear evidencia

| Momento previsto | Acción del jugador | Intervención educativa |
|---|---|---|
| Predecir | Anticipa si una muestra debe dar exactamente la proporción teórica | Pide una explicación antes de revelar el resultado |
| Experimentar | Ejecuta varias preparaciones y mediciones con configuración conocida | Identifica preparación, probabilidad teórica y número de ejecuciones |
| Observar | Lee los conteos y calcula `unos / ejecuciones` | Presenta por separado p teórica y frecuencia observada, con etiquetas de texto |
| Comprender | Contrasta observación y predicción y explica la diferencia | Ofrece retroalimentación sobre variabilidad y preparación; permite revisar la explicación |
| Desbloquear evidencia | Usa la reconstrucción y consulta la memoria de auditoría | Cruza el mecanismo del cambio con el registro de edición, sin atribuir autoría a partir de un conteo |

Después del ciclo, una variante permite comprobar transferencia. El desbloqueo debe reconocer la explicación y permitir reintentos; el simple clic en «ejecutar» no es una medida de comprensión. Estas son recomendaciones para la integración, no condiciones implementadas en el motor actual.

El desbloqueo previsto es lógico: la introducción muestra que una muestra pequeña no basta para atribuir una alteración; la reconstrucción H frente a H–H aporta `circuit_reconstruction`; consultar la memoria de auditoría aporta `audit_memory`. La acusación debe combinar ambas y distinguir la edición 21:14 de la retirada 21:19. A y B deben implementar y comprobar este flujo. Hasta entonces, un facilitador puede discutir los ejemplos como material de contenido, registrando que no fue una partida integrada.

No se debe usar el conteo determinista actual para enseñar fluctuaciones: 5/5 y 75/25 son valores provisionales. La actividad de muestreo requiere el motor real antes de validarse como experimento interactivo.

La guía del [What Works Clearinghouse sobre organización del aprendizaje](https://ies.ed.gov/ncee/wwc/PracticeGuide/1) orienta el uso de preguntas explicativas, recuperación mediante cuestionarios y conexión entre representaciones concretas y abstractas. Es una referencia de diseño, no una evaluación de este juego.

## Motivación para volver

Se propone un episodio breve en sesiones separadas y una pregunta nueva que reutilice lo aprendido. El archivo PHI y la firma Φ del JSON anuncian la continuación. Otros episodios podrían introducir nuevos tamaños de muestra o preparaciones, con explicaciones y posibilidad de explorar; aún no están implementados. Una frecuencia diaria de unos cinco minutos es una intención de diseño que se debe contrastar preguntando cuándo y por qué volverían a jugar.

La motivación buscada combina curiosidad narrativa, decisiones con consecuencias comprensibles y progreso conceptual. No se afirma que existan retos diarios, rachas, estrellas ni episodios adicionales. El interés declarado por volver y el retorno real son medidas distintas. El ritmo debe quedar a elección del jugador, sin pérdida artificial de progreso, rachas punitivas ni recordatorios coercitivos; no se recomienda una frecuencia universal antes de probarla.

## Accesibilidad por comprobar

Antes de validar una partida autónoma, revisar instrucciones comprensibles, conteos y estados con etiquetas que no dependan solo del color, descripción textual de circuitos e imágenes, navegación y foco visibles mediante teclado y acceso a ayuda sin penalización. Registrar barreras y asistencia requerida en el protocolo de validación. Son criterios propuestos para A y para la evaluación; no se han auditado ni implementado desde esta rama.

## Estadística, puertas y posible QML

El contenido real se centra en probabilidad, muestreo y preparación/medición de un qubit. H y X son puertas cuánticas, no algoritmos de Machine Learning. Cambiar un ángulo o calcular un error cuadrático tampoco demuestra por sí solo un sistema de aprendizaje automático.

Extender el proyecto a QML requeriría definir datos, tarea, entrenamiento, evaluación y comparación clásica. Esa extensión no forma parte del cierre del Caso 01. La pista de gradiente descrita en el contrato heredado tampoco está implementada ni es necesaria para comparar H y H–H. La relación educativa es el puente estadística–medición cuántica; no se afirma una aplicación QML entrenada.
