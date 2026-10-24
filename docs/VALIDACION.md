# Plan de validación del prototipo

**Estado: sin sesiones ni resultados registrados.** Se propone una evaluación exploratoria con 2–5 personas desde los 14 años. La muestra sirve para detectar problemas de comprensión y uso; no permite demostrar eficacia general ni atribuir causalmente una mejora al juego.

## Condiciones y registro

Antes de empezar, registrar fecha, commit, dispositivo, navegador, modo de motor y versión narrativa. Usar la misma versión en todas las sesiones o separar los resultados por versión. Identificar participantes con códigos anónimos, sin nombres ni datos de contacto. Explicar la actividad y solicitar participación voluntaria; para menores, coordinar con su responsable y las condiciones del centro o evento.

Actualmente la interfaz no ofrece una partida completa ni carga el cuestionario. La validación de extremo a extremo queda pendiente de integración. Si se revisan solo textos o un recorrido facilitado, consignar «contenido» o «recorrido facilitado»; no registrarlo como partida autónoma. El enlace de Vercel suministrado no está validado como esta aplicación.

## Protocolo por persona

1. **Pretest, 2–3 minutos estimados:** administrar las tres preguntas de `pre` en `cases/quiz.json`, en el orden del archivo, sin explicar todavía las respuestas. Registrar la opción elegida por ítem, no solo el total. La administración es manual mientras no exista integración.
2. **Partida, duración por medir:** pedir que investigue y justifique su decisión. Cronometrar desde el inicio del caso hasta la acusación final; excluir pretest, postest y entrevista. Registrar ayudas, errores de navegación, pausas, problemas técnicos y si completó o abandonó. No imponer como resultado la duración prevista de 5–8 minutos.
3. **Postest, 2–3 minutos estimados:** administrar los tres ítems de `post`, sin consultar las claves ni recibir explicaciones durante las respuestas. Registrar respuestas y total. Después de cerrar el postest, ofrecer explicaciones.
4. **Comprensión, 2 minutos estimados:** preguntar «¿Por qué pueden salir 7 unos en 10 con p = 0,5?», «¿Qué cambia al preparar un qubit de otra manera?» y «¿Qué pasa al aplicar dos H sin medir entre ellas?». Registrar una paráfrasis fiel y si la explicación fue correcta, parcial o incorrecta. No confundir recuerdo de un nombre con conocimiento.
5. **Uso e interés, 1–2 minutos estimados:** pedir facilidad de uso de 1 (muy difícil) a 5 (muy fácil), con motivo; preguntar qué pantalla confundió y qué cambiaría. Preguntar interés por otro episodio de 1 (ninguno) a 5 (mucho), qué le atrae y con qué frecuencia volvería: diariamente, semanalmente, otra frecuencia o nunca. Es una declaración, no retención observada.
6. **Retorno voluntario, seguimiento opcional:** acordar antes del piloto una ventana de observación y ofrecer acceso opcional a la misma versión, sin una tarea obligatoria, premios ni recordatorios. Registrar una nueva sesión solo si se observa y la persona acepta ese registro. Si no se dispone de observación, marcar «no observado»; no concluir que no volvió. No existe telemetría implementada ni se requiere crear cuentas o recopilar contactos para este piloto.

## Criterios para interpretar los datos

Cada respuesta correcta vale 1 punto; cada incorrecta, 0. Cada fase suma de 0 a 3. Una pregunta omitida se registra como omitida y aporta 0 al total; una fase no administrada se marca `NA` y no se puntúa. La variación por persona es `post − pre`, solo si ambas fases se administraron; no completar datos ausentes por estimación.

Registrar las opciones elegidas como índices `0`, `1` o `2`, de acuerdo con el JSON. Las columnas de respuestas enumeran los ítems 1 a 3, no una numeración alternativa de opciones.

| Objetivo | Pretest | Postest | Qué revisar en la explicación oral |
|---|---|---|---|
| Probabilidad frente a frecuencia | `pre[0]` | `post[0]` | Reconoce variación muestral sin afirmar que cualquier muestra prueba el modelo |
| Preparación y probabilidades | `pre[1]` | `post[1]` | Relaciona estado preparado y base de medición con p(0) y p(1) |
| Transformaciones de circuito | `pre[2]` | `post[2]` | Distingue X de H y considera que no hay medición intermedia |

Las versiones no son un instrumento psicométrico validado ni tienen dificultad equivalente demostrada: X y H–H exigen razonamientos distintos. Revisar resultados por ítem y comentarios, además del total. Con tan pocas personas, informar los valores individuales y las observaciones; evitar porcentajes de mejora o pruebas de significación sin sustento. Un postest inmediato tampoco mide retención a largo plazo. Se podría proponer otra pregunta días después, como estudio futuro.

## Métricas y accesibilidad verificables

| Medida | Regla de registro |
|---|---|
| Finalización | Registrar completadas, abandonadas e interrumpidas por fallo técnico entre las sesiones iniciadas, separando partidas autónomas de recorridos facilitados |
| Comprensión | Por concepto: correcta si incluye la relación indicada en la tabla de objetivos sin contradicciones; parcial si identifica una idea relevante pero omite esa relación; incorrecta si la contradice; `NA` si no se preguntó. Conservar la explicación que sustenta el juicio |
| Tiempo | Registrar minutos y segundos, pausas y abandonos; no tratar una partida más larga como más aprendizaje |
| Uso y accesibilidad | Probar lectura de instrucciones, interpretación sin depender del color y acceso por teclado a controles y ayuda; registrar tarea intentada, barrera, asistencia y resultado. No probado no significa accesible |
| Interés y retorno | Mantener separadas la puntuación declarada 1–5 y una segunda sesión voluntaria observada dentro de la ventana acordada; informar casos observados y sin observación, sin rellenar ausencias |

Anotar las barreras de accesibilidad en «Ayudas / incidencias». No se ha realizado una auditoría formal; la edad objetivo tampoco sustituye una evaluación de aptitud y accesibilidad.

## Tablas vacías para resultados reales

Completar solo después de cada sesión. Los guiones en la fila separadora son sintaxis Markdown; las celdas de datos están vacías.

| Código | Fecha | Commit / versión | Motor | Dispositivo / navegador | Modalidad | Completó / abandonó |
|---|---|---|---|---|---|---|
| | | | | | | |
| | | | | | | |
| | | | | | | |
| | | | | | | |
| | | | | | | |

| Código | Pre: respuestas a ítems 1–3 | Pre /3 | Post: respuestas a ítems 1–3 | Post /3 | Diferencia | Tiempo de partida (min:s) | Ayudas / incidencias |
|---|---|---|---|---|---|---|---|
| | | | | | | | |
| | | | | | | | |
| | | | | | | | |
| | | | | | | | |
| | | | | | | | |

| Código | Comprensión: probabilidad | Comprensión: preparación | Comprensión: circuito | Facilidad 1–5 y motivo | Interés 1–5 y motivo | Frecuencia deseada | Observación o cita autorizada |
|---|---|---|---|---|---|---|---|
| | | | | | | | |
| | | | | | | | |
| | | | | | | | |
| | | | | | | | |
| | | | | | | | |

## Informe posterior a las sesiones

Registro opcional de retorno, también vacío:

| Código | Ventana acordada | Observación disponible | Nueva sesión voluntaria: fecha / versión o no observado | Cómo se verificó |
|---|---|---|---|---|
| | | | | |
| | | | | |
| | | | | |
| | | | | |
| | | | | |

Indicar cuántas sesiones se completaron, qué versión se probó, cómo se administró el contenido, qué problemas se repitieron y qué cambios sugieren. Distinguir observaciones del facilitador, respuestas de participantes e hipótesis del equipo. Adjuntar registros anonimizados si corresponde. No anunciar mejoras de aprendizaje, satisfacción ni tiempo típico hasta tener evidencia real.
