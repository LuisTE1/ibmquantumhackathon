# Inspección de contenido y contratos

**Registro histórico de Fase 0.** Después de esta inspección, el equipo aprobó definitivamente Sami/Rumi/H–H/Φ y autorizó sustituir el expediente. La especificación vigente y las diferencias de interfaz están en [MIGRACION-NARRATIVA.md](MIGRACION-NARRATIVA.md). La tabla siguiente conserva lo observado antes de esa decisión; sus pendientes narrativos ya no son el estado actual.

Fecha: 24 de octubre de 2026. Base inspeccionada: `b1a126c` en `feat/contenido`, coincidente con `origin/main` después de `git fetch origin main`. Esta fotografía no sustituye una revisión tras la integración.

## Estado del trabajo compartido

Antes de editar, `git status --porcelain=v1` no mostró cambios. `git worktree list` mostró únicamente este directorio; las ramas locales eran `main` y `feat/contenido`. La consulta `git ls-remote --heads origin` devolvió solo `main`, en `b1a126c95f4a2263b6a09337b17c46f7ea0cd88e`.

No había modificaciones locales ni otras ramas remotas publicadas que atribuir a otro integrante. Git no revela ediciones sin publicar en otros equipos. Se debe revisar otra vez el estado antes de integrar. No se hizo pull, rebase, merge, commit, push ni despliegue.

Durante la comprobación posterior apareció `?? .agents/`, ausente en el estado inicial. Contiene un directorio de skills; no se atribuye su creación a ningún integrante concreto. Es un cambio concurrente ajeno a este trabajo: se conservó y no se editó. La comparación final de archivos rastreados debe separar ese directorio de los entregables de Persona 3.

Se leyeron `CONTRATO.md`, `docs/PLAN-EQUIPO.md`, `docs/PROMPT-maestro.md`, los tres JSON, `engine/circuits.py`, `engine/stats.py`, `app.py` y las pruebas existentes. También se consultó la guía local del hackathon y sus referencias de evaluación, tablero, pitch, EdTech y Qiskit. No se encontraron archivos `AGENTS.md` en el repositorio ni en sus directorios ascendentes inspeccionados.

## Incompatibilidades narrativas

La tabla se presentó antes de editar. La propuesta nueva procede del encargo de Persona 3; no consta aprobación de la migración.

| Aspecto | «El experimento fantasma» propuesto | Contrato y JSON existentes | Motor e interfaz en la base inspeccionada | Decisión necesaria |
|---|---|---|---|---|
| Escenario y título | Qori Lab | `title`: «El experimento alterado»; el plan sitúa el laboratorio en Lima | `app.py` muestra «El patrón invisible» y no carga JSON | Acordar título del producto y del episodio; integrar el expediente |
| Personajes y hechos | Sami modifica un circuito; Rumi retira después un módulo | Lola, Tito y Cora; `solution.culprit = lola` | Falta la lógica de juego | Acordar qué acción se investiga y cómo se atribuye cada hecho |
| Circuito | H–H modificado; modificación concreta aún sin especificar | `incident.altered_theta_deg = 120`, probabilidades 0,5 y 0,75 | Firmas para H y RX; implementación provisional sin Qiskit | Definir secuencia original/alterada y sus resultados; requerir soporte al responsable B |
| Tiempo | Dos acciones sucesivas | Una hora `config_changed_at` y un `access` por sospechoso | No hay procesamiento de cronología | Acordar representación de eventos sin sobrecargar el campo de acceso |
| Criterio de resolución | Distinguir modificación de circuito y retirada posterior | `needs`: `false_statement`, `present_at_change_time` | `accuse` está descrita en el contrato, pero aún no existe | Acordar evidencia y regla de éxito; no asumir que ambas acciones significan lo mismo |
| Calibración | Módulo retirado por Rumi | Sin campo ni modelo de calibración | Sin simulación de calibración | Definir si es evidencia documental o si tiene efecto físico; no inventarlo |
| Continuidad | Firma Φ | `hook` termina con Ψ | Sin pantalla final | Aprobar el cambio junto con el resto de la historia |
| Flujo de juego | Investigación completa | Tres pruebas, perilla RX y acusación previstas | Solo pantalla de prueba con conteos y p-valor | Integración a cargo de A y B antes de anunciar una partida completa |

`engine/game.py` y `engine/demo.py` figuran en el contrato, pero no existen en esta base. `USE_QISKIT = False` aparece como propuesta en el plan; ese selector tampoco está implementado. Los textos `CODE_COIN` y `CODE_RX` contienen fragmentos Qiskit, pero las funciones no los ejecutan.

## Verificación del enlace suministrado

El 24 de octubre de 2026 se consultó directamente [el enlace suministrado por el equipo](https://ultimo-deploy.vercel.app/). La respuesta fue HTTP 200, sin cambio de URL. El HTML identifica la página como **«#HackTheAndes · Último Deploy»**, describe una aventura para personalizar un cuy hacker y presenta el encabezado «ÚLTIMO DEPLOY». Carga un paquete JavaScript y una interfaz de juego distinta del esqueleto Streamlit de este repositorio.

Esta comprobación acredita disponibilidad de la página inicial, no funcionamiento interactivo ni correspondencia con Quantum Files. No se verificó un commit de origen, un despliegue de esta rama ni la versión que se entregará. El equipo debe proporcionar o confirmar el enlace correcto y demostrar el recorrido integrado antes de marcarlo como demo validada.

## Decisión de contenido

En esa fase se conservó `cases/caso1.json` íntegro. Su SHA-256 inicial fue `46EB7487303A2B0F3B128136FEBDCD98AD9839D1E1EBFAB1A71F46FA898F2A5E`; se comprobó otra vez antes de la migración autorizada y no había ediciones concurrentes.

El glosario y los cuestionarios se completaron independientemente. El expediente ya se migró por decisión del equipo; motor e interfaz siguen pendientes de adaptación. Los documentos antiguos de planificación se conservan como antecedentes; sus listas de funcionalidades no son evidencia de implementación.
