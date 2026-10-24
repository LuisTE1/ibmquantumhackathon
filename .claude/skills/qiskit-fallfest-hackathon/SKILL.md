---
name: qiskit-fallfest-hackathon
description: Copiloto para el Hackathon del Qiskit Fall Fest 2026 (Quantum Hub, IEEE CS PUCP, NTT DATA; 24-25 oct, Lima). Usar siempre que el usuario trabaje en el hackathon o CTF, el reto QAP10 de NTT DATA (asignación cuadrática), optimización cuántica/híbrida (QUBO, QAOA, VQE), Qiskit 2.x (circuitos, Sampler/Estimator, Aer, transpile, IBM Quantum), preparación del pitch y entregables, la rúbrica, el plan de tiempo, o material de las sesiones del festival (slides, problemas, código).
---

> **Nota de portabilidad (copia del repo):** las rutas `C:\Users\luist\...` (entorno `qiskit-env`, carpeta `hackathon`) son de la PC de Luis. En otra PC crea tu propio entorno: `python -m venv .venv`, `.venv\Scripts\Activate.ps1`, `pip install -r requirements.txt` (qiskit 2.x). La carpeta `materials/` (libro y diapositivas de los ponentes) **no se sube** por derechos de autor; los enlaces originales están en `references/resources-index.md`.

# Qiskit Fall Fest 2026 — Hackathon copilot

Idioma de trabajo: español. Entorno: `C:\Users\luist\qiskit-env` (qiskit 2.6.1, aer, optimization, algorithms, machine-learning, streamlit; MCP `qiskit` y `qiskit-docs` en Claude Code). Arranque rápido: `C:\Users\luist\Desktop\IMB\hackathon\LEEME-INICIO-RAPIDO.md`.

## Proyecto actual del equipo (24 oct): "Quantum Files — El patrón invisible" (categoría EdTech)
Juego de detectives con **Inspector Cuy**; sospechosos animales andinos (Lola Llama, Tito Vicuña, Cora Cóndor). Culpable único: **Lola** (declaración falsa + presente a las 14:05). 3 pruebas con Qiskit: moneda sospechosa (p-valor 17.2 %), reconstruir el experimento con una perilla (circuito variacional / descenso de gradiente) e informe imposible. Roles: **compañera = visual (`app.py`)**, **Luis = motor (`engine/`)**, **compañero = documentación (`docs/`, `cases/`, PPT, video)**. Archivos del repo: `CONTRATO.md` (API entre partes), `docs/PLAN-EQUIPO.md` (reparto y cronograma), `docs/PROMPT-maestro.md`, `cases/caso1.json`. Entrega al portal antes de las 14:45.
Para ESTE proyecto usa: `references/bases-y-evaluacion.md` (rúbrica común + criterio EdTech: edad y frecuencia de uso), `references/pitch-template.md`, `references/plan-10-30-a-14-00.md` (tablero), `references/qiskit-2x-cheatsheet.md` y la sección EdTech de `references/retos-playbooks.md`. Las secciones de QAP10, Jala y GateQ son alternativas descartadas: no usarlas salvo que el equipo cambie de decisión.
## Hechos clave del evento (de las bases oficiales)
- **Día 1: 24 oct, OPEN PUCP, 10:00–17:00** (≥2 personas a las 10:30; **los 4 miembros en la presentación 15:00–16:40**). **Día 2: 25 oct, NTT DATA Tower Bloom, 8:30–13:00** (finalistas).
- Equipos de **4**. Entregables Día 1 por portal web: nombre del equipo, integrantes, **repo GitHub**, demo/video, descripción breve, **PPT**. Pitch final **2:30–3:00 min**.
- Categorías: **Industria (NTT DATA) = reto QAP10**, Algoritmos/rutas (Quantum Hub), EdTech QML adictivo (IEEE CS PUCP).
- Rúbrica común: **Innovación/validación 25 · Uso de Qiskit + pitch 25 · Reto 20 · Rigor/reproducibilidad 15 · Calidad/arquitectura 15.** Usar Qiskit "por sí solo" no puntúa: cuenta la **pertinencia y justificación**; se valora la gestión honesta de **limitaciones**; **no afirmar ventaja cuántica sin evidencia.**

## Protocolo SIEMPRE al trabajar en el proyecto
1. Leer `references/bases-y-evaluacion.md` (reglas, rúbrica, integridad) y, si la categoría es Industria, `references/reto-ntt-qap10.md`.
2. Leer el **tablero** de `references/plan-10-30-a-14-00.md`: decir qué falta y cuánto tiempo queda; marcar casillas cuando el usuario avance.
3. Antes de dar algo por terminado: ¿qué criterio de la rúbrica mejora? ¿hay baseline clásico? ¿gap vs referencia exacta solo sobre soluciones **factibles**? ¿semillas/versiones/README? ¿limitaciones escritas? ¿fuentes reconocidas?
4. Separar con precisión **qué corre en circuito, qué se simula y qué se resuelve clásicamente** (el jurado lo exige).
5. Honestidad: si lo cuántico pierde (ocurre en QAP10: SA/2-swap dan 340 en <1 s), decirlo y explicar por qué; eso suma en rigor y limitaciones.
6. **Rúbrica NTT vigente = v3 (24 oct): 25/30/20/15/10, sin bonus ni track abierto; mínimo Día 1 = trabajo sólido en N=4 o N=5** (ver `references/reto-ntt-qap10.md`, sección VIGENTE). **Pendiente de confirmar con organizadores**: uso permitido de IA generativa/código preexistente, portal de entrega, si el hardware real es obligatorio.

## Mapa de archivos
| Necesito… | Leer |
|---|---|
| Reglas, horarios, entregables, rúbrica común | `references/bases-y-evaluacion.md` (texto original: `bases-completas.txt`) |
| Reto QAP10, datos reconstruidos, rúbrica NTT, tracks, idea "calendario de salud" | `references/reto-ntt-qap10.md` (+ `reto-ntt-qap10-v*.txt`) |
| **Código QAP10 listo** (F, D, baselines, QUBO, QAOA, híbrido) | `qap10/` → `qap_toolkit.py`, `qap10_F.npy`, `qap10_D.npy`, `qap10_reconstruct.py`, `qap10.mps.gz` |
| Plan por horas + tablero + checklist | `references/plan-10-30-a-14-00.md` |
| Pitch (3 min) y slides | `references/pitch-template.md` |
| Playbooks de otros retos (rutas/QAOA, EdTech/QML) | `references/retos-playbooks.md` |
| API Qiskit 2.x, errores comunes | `references/qiskit-2x-cheatsheet.md` |
| Estructura de repo/README | `references/project-template.md` |
| Herramientas, MCP, IBM Quantum, offline | `references/herramientas-mcp-skills.md`; `scripts/ibm_connect.py` |
| Teoría/ejercicios de los talleres | `materials/text/` (grep), índice `references/resources-index.md` |
| PDFs/notebooks/repos originales | `materials/pdf/`, `materials/code-html/`, `materials/repos/` |

## Idea innovadora preparada: Grover Adaptive Search con codificación por rango (`qap10/gas_qap.py`)
N=10 en solo **22 qubits** (índice = k-ésima permutación; 100% factible, sin penalización λ) en vez de 100 qubits one-hot. Circuitos Qiskit REALES para N=3/4/5 (3/5/7 qubits; éxito 100%/96.5%/99.6%, óptimos 24/32/…) y simulación exacta N=10: halla 340 con ~250–14 000 llamadas al oráculo (vs 3 628 800 evaluaciones). Honestidad obligatoria: el oráculo es una tabla clásica; heurísticas clásicas (SA/2-swap) ya dan 340 en <1 s; sin ventaja práctica a esta escala; N≥12 deja de caber en un portátil.

## Uso rápido del toolkit QAP10 (desde `qap10/`, con el entorno activo)
```python
from qap_toolkit import *          # carga F, D (10x10); cost(p) con la convención "par una sola vez"
brute_force(4)                      # ([1,2,3,0], 32.0)  óptimos de control: N=3→24, N=4→32
simulated_annealing(10)             # → 340.0 (óptimo) en <1 s    ·   local_search_2swap(10) → 340.0
qaoa_solve([0,1,2],[0,1,2])         # QAOA 9 qubits: óptimo 24, pero ~90-100 s (StatevectorSampler)
hybrid_neighborhood(n=10, m=3)      # mejora vecindarios de 3 elementos con QAOA (cada ronda ~1.5 min)
```
⚠ Rendimiento medido: QAOA N=3 reps=1 → ~95 s; reps=2 → ~200 s; 150 iteraciones → 354 s; N=4 (16 qubits) mucho más. Planificar el presupuesto de tiempo (ejecutar en segundo plano mientras se prepara el resto) y **no usar `AerSimulator` directamente con el `QAOA` de qiskit-algorithms** (falla: instrucción `QAOA` desconocida; habría que transpilar).

## Reglas de código Qiskit
- **Qiskit 2.x** (taller: 2.5.2; instalado 2.6.1). Nunca `execute()`, `qiskit.Aer`, `BackendV1`, `qiskit.opflow`, `QuantumInstance`. `ZZFeatureMap` clase está deprecada → `zz_feature_map()`.
- **Little-endian**: verificar con un caso asimétrico.
- Primero simulador; hardware IBM (Open Plan: ~10 min QPU/28 días, cola) solo como evidencia final pequeña, nunca en la demo en vivo. Nunca pedir ni imprimir el token.
- Ayuda de documentación: usar los MCP `qiskit-docs` / `qiskit` si están cargados.

## Si algo no está
Los recursos de varias sesiones aún no tienen material (ver `references/resources-index.md`). El reto de Industria y las bases son la fuente de verdad; ante contradicciones entre documentos, listar ambas versiones y recomendar preguntar a los organizadores.




