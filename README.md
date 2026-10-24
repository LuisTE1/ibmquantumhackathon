# Quantum Files — Caso 01: El experimento fantasma

Prototipo EdTech para IBM Quantum Hackathon 2026. Propone aprender probabilidad y medición de un qubit investigando un expediente ficticio. Su público objetivo propuesto son personas desde los 14 años; no es una edad mínima validada con participantes ni una certificación de accesibilidad.

**Estado comprobado el 24 de octubre de 2026:** esqueleto de interfaz, cálculos clásicos y contenidos preparados. La partida completa y la ejecución Qiskit siguen pendientes de integración en la base inspeccionada (`b1a126c`). No hay resultados de validación con personas.

## Qué está disponible

- `engine/stats.py`: cola binomial, probabilidad para RX sobre el estado 0 y error cuadrático.
- `engine/circuits.py`: funciones provisionales que devuelven conteos deterministas. Sus textos Qiskit no se ejecutan; `seed` se ignora.
- `app.py`: pantalla Streamlit de prueba. Llama a la moneda provisional y muestra un p-valor para el ejemplo de 7 unos de 10; no carga todavía el caso ni el quiz.
- `cases/`: expediente oficial en formato versión 2, glosario y cuestionario de tres preguntas previas y tres posteriores. El glosario y el quiz preservan sus contratos; el nuevo caso requiere adaptar los consumidores.
- Documentación pedagógica, plan de validación con tablas vacías y guion de presentación ajustado a este estado.

La historia definitiva está aprobada: en Qori Lab, Detective Cuy investiga con Killa, Inti, Rumi, Sami y Amaru. **Sami añade una segunda H a las 21:14**; la memoria de auditoría vincula esa edición con ella. **Rumi retira el módulo a las 21:19** y no inicia el sabotaje. El archivo PHI y la firma Φ anuncian el siguiente episodio.

El circuito original es `|0⟩ → H → medir`, con P(1) = 0,5; el alterado añade otra H antes de medir y da P(1) = 0 en el modelo ideal. La acusación exige `audit_memory` y `circuit_reconstruction`. Son datos y predicciones matemáticas del caso, todavía sin integración jugable ni muestreo Qiskit verificado. [MIGRACION-NARRATIVA.md](docs/MIGRACION-NARRATIVA.md) especifica los campos y el trabajo de Persona 1 y Persona 2; el contrato compartido no se modificó.

## Preparar el entorno y abrir la interfaz

El equipo prevé Python 3.12. Desde la raíz del repositorio, en PowerShell:

```powershell
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe -m streamlit run app.py
```

En Linux o macOS, usar `.venv/bin/python` en lugar de `.\.venv\Scripts\python.exe`. El comando de arranque sigue la [documentación de Streamlit](https://docs.streamlit.io/develop/api-reference/cli/run).

Estos son pasos de instalación, no evidencia de una instalación completa verificada en esta revisión. Se ejecutaron las comprobaciones matemáticas con Python 3.14.4; ese intérprete no tiene Streamlit, Qiskit ni Aer, por lo que no se verificó el arranque de la UI. Las dependencias aún no están fijadas a versiones exactas. El código local inspeccionado no requiere tokens ni una cuenta IBM Quantum.

## Comprobaciones reproducibles

Con Python y pytest disponibles, ejecutar desde la raíz:

```powershell
python -B -m pytest -q -p no:cacheprovider
python -B -m json.tool cases/caso1.json
python -B -m json.tool cases/glossary.json
python -B -m json.tool cases/quiz.json
python -B -c "from engine.circuits import coin_counts, rx_counts; from engine.stats import p_value_at_least, prob_one; print(coin_counts(10, 1)); print(rx_counts(120, 100, 1)); print(p_value_at_least(7, 10)); print(prob_one(120))"
```

La suite existente produjo **2 pruebas aprobadas**. El último comando devuelve conteos provisionales 5/5 y 25/75, p-valor `0.171875` y probabilidad aproximadamente `0.75`. Comprueba utilidades heredadas, incluida RX; no ejecuta la reconstrucción H–H del caso oficial ni Qiskit. En la pantalla actual, el p-valor para 7 unos no corresponde al conteo 5/5 que se muestra; queda pendiente conectarlo al experimento real.

Para contrastar las probabilidades del caso oficial sin dependencias externas:

```powershell
python -B -c "from math import sqrt; s=1/sqrt(2); original=(s,s); altered=(s*(original[0]+original[1]),s*(original[0]-original[1])); print('H P(1)=',abs(original[1])**2); print('HH P(1)=',abs(altered[1])**2)"
```

Es un cálculo matricial clásico: produce aproximadamente `0.5` y `0.0`, no conteos ni una ejecución Qiskit.

No están disponibles `engine/game.py`, `engine/demo.py`, un selector `USE_QISKIT`, acusaciones evaluadas, desbloqueo de evidencias ni exportación CSV del quiz. Las dos pruebas matemáticas no certifican esas funcionalidades. El detalle de comprobaciones de contenido está en [VERIFICACION-CONTENIDO.md](docs/VERIFICACION-CONTENIDO.md).

## Enlace de despliegue

El [enlace proporcionado por el equipo](https://ultimo-deploy.vercel.app/) respondió HTTP 200 el 24 de octubre de 2026, pero su HTML identifica **«#HackTheAndes · Último Deploy»** y otra aventura. No se presenta como demo validada de Quantum Files: faltan confirmar correspondencia con este repositorio, commit, funcionamiento interactivo y versión de entrega. Véase [la inspección](docs/INSPECCION-CONTENIDO.md).

## Cómo se aprende y qué falta evaluar

El ciclo pedagógico previsto es **predecir → experimentar → observar → comprender → desbloquear evidencia**. Su objetivo central es justificar una decisión comparando frecuencia observada y probabilidad teórica. Cada medición 0/1 de un qubit preparado de nuevo se modela como Bernoulli con probabilidad p de obtener 1; el conteo de varias ejecuciones independientes sigue una distribución binomial. La moneda es una analogía: compartir esa distribución no implica equivalencia física con un qubit. Las puertas H y X no son algoritmos de Machine Learning. No se afirma un sistema QML entrenado, ejecución en hardware ni ventaja cuántica.

La investigación integrada, las sesiones de 5–8 minutos y la motivación por otros episodios son objetivos aún por comprobar. El plan de evaluación admite 2–5 participantes y registra pretest, postest, tiempo, comprensión, uso e interés sin inventar resultados.

## Documentación y colaboración

| Documento | Contenido |
|---|---|
| [Pedagogía](docs/PEDAGOGIA.md) | Público, objetivos, decisiones, estadística y medición |
| [Validación](docs/VALIDACION.md) | Protocolo y tablas vacías para resultados reales |
| [Arquitectura](docs/ARQUITECTURA.md) | Flujo existente, contratos e integración pendiente |
| [Limitaciones](docs/LIMITACIONES.md) | Estado técnico, científico y educativo |
| [Fuentes](docs/FUENTES.md) | Referencias primarias, bibliotecas y asistencia de Codex |
| [Guion de pitch](docs/GUION-PITCH.md) | Presentación prevista de aproximadamente tres minutos |
| [Inspección e incompatibilidades](docs/INSPECCION-CONTENIDO.md) | Comparación narrativa, estado Git y revisión del enlace |
| [Migración aprobada y nota técnica](docs/MIGRACION-NARRATIVA.md) | Esquema versión 2 y adaptación pendiente de interfaz y motor |
| [Verificación de contenido](docs/VERIFICACION-CONTENIDO.md) | Comprobaciones, resultados técnicos y límites |

[CONTRATO.md](CONTRATO.md) define responsabilidades y firmas. La Persona 3 trabaja en `feat/contenido` y solo edita `cases/`, `docs/` y este README. `docs/PLAN-EQUIPO.md` y `docs/PROMPT-maestro.md` se conservan como planificación histórica; verificar sus promesas contra el código antes de presentarlas como implementadas.
