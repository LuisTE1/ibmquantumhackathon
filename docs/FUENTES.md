# Fuentes y atribuciones

Consulta: 24 de octubre de 2026. Se distingue el código inspeccionado, la documentación de referencia y los recursos propuestos. Una fuente conceptual no demuestra que una funcionalidad esté implementada.

## Evidencia del proyecto

| Fuente local | Uso |
|---|---|
| [CONTRATO.md](../CONTRATO.md) | Firmas públicas, formatos JSON y responsabilidades |
| [PLAN-EQUIPO.md](PLAN-EQUIPO.md) y [PROMPT-maestro.md](PROMPT-maestro.md) | Intención de producto y alcance; sus listas no acreditan implementación |
| [caso1.json](../cases/caso1.json) | Caso 01 oficial: Sami añade H a las 21:14, Rumi retira el módulo a las 21:19, auditoría y firma Φ; expediente ficticio versión 2 |
| [app.py](../app.py), [circuits.py](../engine/circuits.py), [stats.py](../engine/stats.py) | Estado real de interfaz, conteos provisionales y cálculos clásicos |
| [test_stats.py](../tests/test_stats.py) | Dos comprobaciones matemáticas ejecutadas durante esta revisión |
| [Skill recibida: qml-edtech](../.agents/skills/qml-edtech/SKILL.md) | Leída y aplicada en la revisión adicional: objetivo central, distribución Bernoulli, ciclo de aprendizaje, accesibilidad y retorno voluntario; sus recomendaciones no prueban que estén implementados |
| [Skill recibida: hackathon-coach](../.agents/skills/hackathon-coach/SKILL.md) | Leída y aplicada en la revisión adicional: correspondencia entre implementación, demo, pitch y límites; fuente de contexto del evento proporcionada por el equipo, sin presuponer avisos posteriores |
| [Guía local del hackathon](../.claude/skills/qiskit-fallfest-hackathon/SKILL.md) y sus referencias | Orientación para integridad, separación clásico/cuántico, criterios EdTech y pitch; copia local, no verificación independiente de avisos actuales de la organización |

La decisión definitiva del equipo recibida por Persona 3 aprueba «El experimento fantasma», Qori Lab, la segunda H añadida por Sami, la retirada posterior de Rumi y el archivo PHI/Φ. Se implementó como datos JSON y documentación, no como partida integrada. Los diálogos y roles genéricos son redacción de apoyo, sin nuevos hechos probatorios. Los planes anteriores y los archivos sobre Jala y QAP10 son antecedentes; no son características ni resultados vigentes de Quantum Files.

## Conceptos y pedagogía

| Referencia primaria | Qué respalda en estos contenidos |
|---|---|
| [IBM: HGate](https://quantum.cloud.ibm.com/docs/en/api/qiskit/qiskit.circuit.library.HGate) | Definición y matriz de Hadamard; de la matriz se obtienen las probabilidades desde 0 y la identidad H·H = I |
| [IBM: XGate](https://quantum.cloud.ibm.com/docs/en/api/qiskit/qiskit.circuit.library.XGate) | Transformaciones 0 → 1 y 1 → 0 |
| [IBM: RXGate](https://quantum.cloud.ibm.com/docs/en/api/qiskit/qiskit.circuit.library.RXGate) | Referencia de la utilidad heredada RX del código; fuera de la reconstrucción del Caso 01 |
| [SciPy: distribución binomial](https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.binom.html) | Modelo del número de unos en ensayos independientes con probabilidad constante; referencia matemática, no dependencia del proyecto |
| [What Works Clearinghouse: Organizing Instruction and Study to Improve Student Learning](https://ies.ed.gov/ncee/wwc/PracticeGuide/1) | Orientación sobre preguntas explicativas, cuestionarios y conexión de representaciones; no evidencia de eficacia de este prototipo |

Las definiciones y preguntas son redacción adaptada para este proyecto; no se reprodujeron pasajes extensos de esas fuentes. Las identidades de puertas y probabilidades se aplican bajo los supuestos ideales explicitados en los ítems. La evaluación con 2–5 personas es una propuesta exploratoria del equipo, no un instrumento validado externamente.

## Bibliotecas y herramientas

| Recurso | Estado y atribución |
|---|---|
| [Python](https://www.python.org/) y su biblioteca estándar | Código del proyecto; `math` para estadística y `json` para validar contenido. Se ejecutaron comprobaciones con Python 3.14.4; el plan del equipo prevé 3.12 |
| [Streamlit: ejecución de aplicaciones](https://docs.streamlit.io/develop/api-reference/cli/run) | Importado por `app.py` y declarado en `requirements.txt`; arranque no verificado en este entorno |
| [Qiskit: StatevectorSampler](https://quantum.cloud.ibm.com/docs/en/api/qiskit/qiskit.primitives.StatevectorSampler) | Referencia para el muestreo local previsto; todavía no llamado por el motor inspeccionado |
| [Qiskit Aer](https://qiskit.github.io/qiskit-aer/) | Dependencia declarada; no usada en el código inspeccionado |
| [NumPy](https://numpy.org/) | Dependencia declarada; no importada por el código inspeccionado |
| [pytest: ejecución de pruebas](https://docs.pytest.org/en/stable/how-to/usage.html) | Ejecución de las dos pruebas existentes, sin modificar `tests/` |
| Git y GitHub | Inspección de rama, actualización de referencia remota y comparación de archivos |
| OpenAI Codex | Asistencia en inspección, redacción de glosario/cuestionarios/documentos y comprobaciones de contenido de esta rama; el equipo debe revisar el material y verificar las condiciones del evento sobre asistencia de IA |

No se usaron datasets de estudiantes, resultados reales de encuestas ni trabajos enviados a IBM Quantum. No se consultaron `.env` ni credenciales. No se atribuyen a esta revisión ilustraciones, PPT, videos ni material de otros integrantes. Los PDFs de terceros no forman parte de estos entregables; deben respetarse las licencias de cada recurso.

## Enlace suministrado

[Último Deploy en Vercel](https://ultimo-deploy.vercel.app/) respondió HTTP 200 y mostró una identidad distinta en su HTML. Es una comprobación de disponibilidad, no una demo validada de Quantum Files. Los detalles y la correspondencia pendiente están en [INSPECCION-CONTENIDO.md](INSPECCION-CONTENIDO.md).
