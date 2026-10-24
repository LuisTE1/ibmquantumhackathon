# Migración narrativa aprobada: Caso 01

> **Registro de migración:** esta nota conserva la aprobación del expediente v2 en la rama de contenido. Describe los campos de referencia, no una fuente dinámica de la PWA. El estado actual de la aplicación está en [ARQUITECTURA.md](ARQUITECTURA.md) y [ESTADO-INTEGRACION.md](ESTADO-INTEGRACION.md).

## Decisión del equipo

La historia oficial es **Quantum Files — Caso 01: El experimento fantasma**, en Qori Lab. Detective Cuy investiga con Killa, Inti, Rumi, Sami y Amaru. Sami añade una segunda puerta H a las 21:14; la memoria de auditoría vincula la modificación con Sami. Rumi retira después un módulo a las 21:19 y no inicia el sabotaje. El archivo PHI, con firma Φ, anuncia el siguiente episodio. La historia anterior de Lola Llama, RX(120°) y Ψ es un prototipo descartado, no la historia vigente.

La rama `docs/edtech-final` conserva `cases/caso1.json` porque el prototipo Streamlit aún depende del formato heredado. La versión aprobada se guarda como `cases/caso1_v2.json`, una referencia narrativa. La PWA no carga ese JSON en tiempo de ejecución: su relato está en `web/public/js/game.js`.

## Circuito y argumento

Cada ejecución empieza en `|0⟩` y mide en la base computacional al final:

- Original: H → medir. Probabilidades teóricas: 0 y 1 con 0,5 cada una.
- Alterado: H → H → medir, sin medición intermedia. En el modelo ideal H·H = I; las probabilidades son 0 con 1 y 1 con 0.

La reconstrucción explica qué cambia en el circuito. La memoria de auditoría identifica a Sami como editora. Ninguna frecuencia aislada, declaración incorrecta o acceso sin registro identifica a quien inició la alteración. El retiro posterior del módulo por Rumi es un hecho del relato; no se modela como ruido, daño o descalibración.

## Formato del expediente de referencia v2

`cases/caso1_v2.json` usa JSON con estos campos principales:

| Campo | Contenido |
|---|---|
| `schema_version` | Entero 2 para distinguir el formato. |
| `title`, `setting` | Título del episodio y Qori Lab. |
| `detective` | Identificador, nombre y especie del Detective Cuy. |
| `incident` | Horas 21:14/21:19, probabilidades originales/alteradas, puerta añadida y dos descripciones de circuito. |
| `suspects` | Killa, Inti, Rumi, Sami y Amaru; especies, papeles, declaraciones y `access: null` cuando no hay un registro de acceso confirmado. |
| `timeline` | Los eventos de edición y retiro en orden temporal, con actor y acción. |
| `evidence` | Evidencia `audit_memory` que atribuye la edición y `circuit_reconstruction` que explica el efecto. |
| `solution` | `culprit: sami`, requisitos de ambas evidencias, `not_initiator: rumi` y explicación narrativa. |
| `hook` | Archivo PHI y firma Φ. |

Se mantienen, cuando es posible, las claves generales del expediente anterior: `title`, `incident`, `suspects`, `solution` y `hook`. El nuevo esquema añade datos de escenario, detective, cronología y evidencias; conservar esos nombres no hace que sus significados o reglas antiguos sean compatibles. `access: null` significa que el JSON no ofrece una hora de acceso, no que se confirme presencia o ausencia.

La copia debe validarse como JSON antes de usarla. No es un formato aprobado por `CONTRATO.md` ni una fuente dinámica del frontend actual.

## Nota técnica para responsables de interfaz y motor

- **Interfaz web:** el caso narrativo Sami/Rumi ya aparece en `web/public/js/game.js`; no se necesita reemplazar la historia vigente en la PWA. Si el equipo decide que el JSON v2 sea la fuente editable en el futuro, la persona responsable de frontend debe crear y probar un cargador para ese esquema, incluir manejo explícito de `access: null`, no exponer la solución antes de tiempo y comprobar el recorrido completo. Ese cambio no forma parte de esta consolidación.
- **API Qiskit del juego:** `web/api/_qrun.py` ya acepta secuencias H/X y medición al final, así que H y H–H caben en la interfaz existente. No hace falta ampliar las firmas públicas para ejecutar este circuito. Deben preservarse la diferencia entre probabilidades ideales y conteos muestreados, y la etiqueta que distingue Qiskit del fallback local.
- **Sistema Streamlit heredado:** `app.py`, `engine/`, `CONTRATO.md`, `cases/caso1.json` y sus consumidores no se modifican aquí. Si el equipo desea migrar también ese prototipo al JSON v2, sus responsables deben acordar por separado un esquema de compatibilidad y pruebas. No se debe reinterpretar `altered_theta_deg`, `false_statement` o `present_at_change_time` como equivalentes de los hechos nuevos.

Esta nota documenta el expediente aprobado sin ampliar el producto ni modificar código, contrato o tests.
