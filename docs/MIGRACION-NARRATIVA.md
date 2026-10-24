# Migración aprobada — Caso 01: El experimento fantasma

**Decisión definitiva del equipo, recibida el 24 de octubre de 2026:** la historia oficial es «Quantum Files — Caso 01: El experimento fantasma», en Qori Lab. Se autoriza sustituir el expediente. La aprobación narrativa y la actualización de datos no acreditan integración del motor ni de la interfaz.

Detective Cuy investiga con Killa (vizcacha), Inti (cóndor), Rumi (zorro andino), Sami (alpaca) y Amaru (puma). Sami añade la segunda H a las 21:14; Rumi retira el módulo a las 21:19. La memoria de auditoría vincula la edición con Sami. Rumi no inicia el sabotaje. El archivo PHI y la firma Φ anuncian la continuación. El argumento anterior queda descartado.

Antes de sustituir `cases/caso1.json`, se comprobó que no tenía diferencias contra HEAD ni cambios preparados. Su SHA-256 coincidía con el registrado en la inspección inicial. No se sobrescribieron ediciones concurrentes del expediente.

## Formato de `cases/caso1.json`, versión 2

Se mantienen las claves generales `title`, `incident`, `suspects`, `solution` y `hook`. La versión 2 es una migración explícita de datos: los consumidores anteriores necesitan adaptación. No se modificó `CONTRATO.md` ni se afirma compatibilidad semántica con sus reglas antiguas.

| Campo | Tipo y significado |
|---|---|
| `schema_version` | Entero `2`; el cargador debe comprobarlo antes de evaluar el caso |
| `title`, `setting` | Textos con título oficial y Qori Lab |
| `detective` | Objeto `{id, name, species}` de Detective Cuy |
| `incident.config_changed_at`, `module_removed_at` | Textos `21:14` y `21:19`; acciones distintas del mismo incidente |
| `incident.original_p`, `altered_p` | Probabilidades teóricas del resultado indicado en `probability_outcome`, aquí `"1"`: `0.5` y `0.0` |
| `incident.alteration` | `{operation: "append_gate", gate: "H", actor: "sami"}` |
| `incident.original_circuit`, `altered_circuit` | Objetos con `initial_state`, `gates`, `measurement_basis`, `measurement_at`, `model` y `probabilities` |
| `suspects` | Lista con los cinco personajes distintos del detective. Conserva `id`, `name`, `role`, `access`, `statement`, `statement_true`; añade `species` |
| `suspects[].access` | Hora de acceso como texto o `null` si no se proporcionó. Todos quedan en `null`: las horas confirmadas son de acciones, no un registro de entrada; se representan en `timeline` |
| `statement_true` | Booleano informativo; todos son `true` en esta versión. Las declaraciones no deciden culpabilidad |
| `timeline` | Dos eventos `{id, time, actor, action}`, en orden cronológico |
| `evidence` | Dos evidencias con IDs estables, `kind`, `title`, `description`; la auditoría añade `suspect_id` y `time` |
| `solution` | `culprit: "sami"`, `needs: ["audit_memory", "circuit_reconstruction"]`, `not_initiator: "rumi"` y explicación |
| `hook` | Texto de apertura del archivo PHI y firma Φ |

Se elimina `altered_theta_deg`: un ángulo RX no representa esta alteración. No se renombran las evidencias nuevas como `false_statement` ni `present_at_change_time`; tienen significados distintos. Los roles y diálogos son redacción de apoyo, sin añadir hechos al incidente ni convertirlos en pruebas.

## Modelo científico de la reconstrucción

Cada ejecución empieza en `|0⟩`, usa la base 0/1 y mide únicamente al final:

- Original: `H → medir`; probabilidades `{0: 0.5, 1: 0.5}`.
- Alterado: `H → H → medir`; probabilidades ideales `{0: 1.0, 1: 0.0}` porque H·H = I.

No hay medición entre las H. No se simulan dos lanzamientos independientes ni se asignan efectos físicos a retirar el módulo. La retirada es un hecho posterior de la cronología; el JSON no contiene un modelo de ruido o descalibración. Estas probabilidades son predicciones matemáticas, no resultados Qiskit registrados.

## Nota técnica para Persona 1 — Interfaz

1. Leer `schema_version = 2`, el título, especies y personajes del JSON. Tratar `access: null` como «sin registro proporcionado», sin inventar presencia o ausencia.
2. Sustituir la perilla de reconstrucción RX por la comparación concreta H frente a H–H, con preparación 0 y medición final visibles. Mostrar probabilidades y conteos por separado, e indicar el modo real: provisional o simulación Qiskit comprobada.
3. Mostrar los dos eventos: edición 21:14 y retirada 21:19. La memoria de auditoría identifica al editor; el experimento explica el efecto. No basta el horario, un p-valor o una declaración incorrecta.
4. Enviar a la acusación IDs de evidencia `audit_memory` y `circuit_reconstruction`, disponibles después de las actividades correspondientes; la clave de solución no debe mostrarse antes de resolver. La tabla `suspects` no es prueba de culpabilidad.
5. Mostrar PHI/Φ al resolver y distinguir la acción posterior de Rumi. No presentar el nuevo caso como jugable hasta verificar todo el recorrido con B.

## Nota técnica para Persona 2 — Motor y pruebas

1. Mantener las firmas existentes de `coin_counts`, `rx_counts` y estadística. Añadir soporte local específico para H y H–H con preparación 0 y medición final, sin usar `prob_one(theta_deg)` como sustituto de la secuencia. `coin_counts` puede cubrir H cuando sea real; H–H requiere su circuito. La API adicional debe acordarse con A antes de conectarla; el alcance solo necesita esas dos secuencias.
2. El cargador debe validar versión 2, IDs y referencias de actores/evidencias. `evidence_table` debe tolerar accesos desconocidos; si calcula presencia a la hora del cambio, usar valor desconocido para `null`, nunca convertirlo en certeza de ausencia. Ni presencia ni `statement_true` resuelven la acusación.
3. Se puede conservar la firma prevista `accuse(case, suspect_id, evidence: list[str]) -> dict`. Para versión 2: `correct` indica `suspect_id == solution.culprit`; `complete` exige además ambas evidencias de `solution.needs`. Validar IDs, no aceptar claves antiguas como equivalentes ni desbloquear evidencias sin completar las actividades. El estado de desbloqueo debe coordinarse con A; la firma actual no lo acredita por sí sola.
4. Mantener `{correct, complete, feedback}` como salida prevista. Para Rumi, explicar que la retirada 21:19 es posterior a la edición 21:14; para Sami sin ambas evidencias, explicar qué falta. El resultado del circuito no identifica por sí solo al editor.
5. `experiment_attempt(theta_deg, ...)` y `gradient_hint` no representan esta reconstrucción. No reinterpretar sus parámetros: A y B deben acordar una ruta específica para el nuevo caso sin romper esas firmas. El código mostrado debe coincidir con H/H–H realmente ejecutado.
6. Verificar conteos que sumen shots, H aproximadamente 50/50 con muestreo real, H–H siempre 0 en el simulador ideal, ausencia de medición intermedia y resolución solo con Sami más ambas evidencias. Sustituir cualquier prueba futura que presuponga la solución anterior. No se implementaron esas pruebas desde Persona 3.

## Estado de entrega

Datos y documentación migrados con autorización del equipo. `app.py` sigue siendo un esqueleto; `engine/circuits.py` sigue siendo provisional, y `engine/game.py` aún no existe en la base inspeccionada. La adaptación de consumidores y la validación con personas están pendientes. No se ejecutaron trabajos IBM Quantum ni se modificaron archivos de A o B.
