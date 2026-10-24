# Bases de participación y evaluación — Qiskit Fall Fest 2026 Hackathon (IBM Quantum Hackathon 2026)

Fuente completa: `bases-completas.txt` / `materials/pdf/bases-de-participacion.pdf` (8 págs). Organizan Quantum Hub Perú, IEEE CS PUCP y NTT DATA. Comunicaciones oficiales: **WhatsApp** (la organización avisará cambios por ahí).

## Logística (oficial)
- **Presencial, 2 jornadas.** Equipos de **4 integrantes**; la organización puede reajustar equipos. Un **responsable** de comunicaciones y de verificar la entrega. **Todos** contribuyen y preparan la presentación.
- **Día 1 — 24 oct, OPEN PUCP** (5.º piso C.C. Plaza San Miguel, Blvd. Plaza Mantaro 102, San Miguel): **10:00–17:00**. ≥2 miembros deben llegar como máximo a las **10:30**. **Los 4 miembros deben estar en la presentación entre las 15:00 y las 16:40.** (Los organizadores dijeron además "10:30 a 14:00 para construir": usar eso como meta interna y congelar código ~14:00–14:30.)
- **Día 2 — 25 oct, NTT DATA Tower Bloom** (Av. Javier Prado Oeste 2501, Magdalena): **8:30–13:00**. Final + premiación; solo equipos finalistas.
- **Mentorías:** recorrido inicial de mentores por mesas + "buffet de mentores" por especialidad (turnos si hay demanda). Mentores orientan; decisiones e implementación son del equipo.
- Cualquier restricción sobre código preexistente, **IA generativa**, APIs o recursos externos la comunicará la organización → **preguntar** (y poder explicar toda decisión técnica).

## Entregables del Día 1 (por el portal web designado; verificar que los enlaces abren)
1. Nombre del equipo. 2. Integrantes (todos). 3. **Repositorio GitHub** (alternativa menos valorada: Drive con .zip). 4. **Demo** funcional o **video** (depende; el video debe mostrar claramente el funcionamiento). 5. **Descripción breve**: problema, propuesta, funcionalidades. 6. **PPT**.
La organización evalúa estas propuestas para decidir los finalistas.

## Pitch final (Día 2) — principal medio de evaluación
**2:30–3:00 min** (+ segundos por preguntas del jurado). Debe explicar: problema y relevancia · solución y relación con el reto · funcionamiento del prototipo y tecnologías · demo cuando corresponda.

## Categorías
| Cat. | Organiza | Reto |
|---|---|---|
| 5.1 Industria | **NTT DATA** | **QAP10** — asignación cuadrática (reto "sorpresa" ya publicado) → `reto-ntt-qap10.md` |
| 5.2 Algoritmos y aplicaciones | Quantum Hub | Optimización de rutas y conexiones con algoritmos cuánticos: entorno que represente un problema, defina variables y costos, explore soluciones clásicas/cuánticas/híbridas y **visualice y compare** resultados |
| 5.3 EdTech | IEEE CS PUCP | Herramienta/juego/app que mapee un concepto de Estadística/ML a su equivalente QML; **adictiva de usar** |

## Rúbrica común (100 pts, finalistas)
| Criterio | Peso | Qué buscan | Cómo atacarlo |
|---|---|---|---|
| Innovación, validación y potencial de aplicación | **25 %** | Originalidad, **evidencia de utilidad**, **estrategia para errores/limitaciones**, desarrollo futuro | Caso de uso concreto; slide de limitaciones con mitigación; roadmap |
| Uso de Qiskit y claridad de presentación | **25 %** | Uso **pertinente** de Qiskit, enfoque técnico, calidad de demo, claridad del pitch | Circuito/algoritmo explicado; demo corta con respaldo; pitch ≤ 3 min |
| Reto de la categoría | **20 %** | Según categoría (abajo) | — |
| Rigor técnico y reproducibilidad | **15 %** | Conceptos correctos, coherencia, **reproducible/verificable** | requirements, semillas, README, script que reproduce cifras |
| Calidad de la solución y arquitectura | **15 %** | Diseño, integración, funcionamiento, **justificación de decisiones técnicas** | Diagrama + "por qué" de cada decisión |

Reglas explícitas: *el uso de Qiskit por sí solo NO garantiza puntaje alto: se valora pertinencia y justificación.* No se exige corrección/detección de errores cuánticos si no es pertinente; **se valora cómo identifican, analizan y gestionan las limitaciones.** Se evalúa "contribución técnica coherente con el reto".

**Criterio del reto (20 %):**
- *Industria (NTT DATA):* se rige por la rúbrica específica de QAP10 (25/30/20/15/15-10 + bonus) → `reto-ntt-qap10.md`. ⚠ confirmar versión.
- *Algoritmos (Quantum Hub):* "Calidad de la formulación y optimización": ¿formulación matemática correcta? ¿solución respeta restricciones? ¿se analiza calidad frente a referencia **clásica o exacta**?
- *EdTech (IEEE CS PUCP):* calidad de la metodología de enseñanza + alta necesidad de volver a usar; ¿desde qué edad? ¿una vez al día o a la semana?

## Conducta e integridad (puede descalificar)
Sin plagio ni falsificación de resultados; **reconocer fuentes, librerías, datasets y servicios externos**; respetar licencias; **presentar con honestidad el estado y las limitaciones**; cumplir normas del local. → incluir slide/README "Fuentes y herramientas usadas".

## Jurado
5 partes: Daniel Mamani (IEEE CS PUCP) + 1 más de IEEE CS PUCP (sin nombre en la captura), Adriana Alvarado y Alexander (Quantum Hub), Sebastián (NTT DATA, Blockchain & Quantum Lab).

## Enfoque ganador
1. Elegir categoría en los primeros 15 min y no cambiar. 2. Problema verificable y pequeño. 3. **Línea base clásica + comparación honesta** (decir cuándo lo cuántico no gana). 4. Demo + reproducibilidad + una slide por criterio. 5. Pitch de 3 min estructurado por la rúbrica (`pitch-template.md`).
