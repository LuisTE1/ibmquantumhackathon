# Reto Industria (NTT DATA) — QAP10: asignación cuadrática

Fuentes: `reto-ntt-qap10-v2-nueva.txt` (PDF de 21:45, el más reciente) y `v1-antigua.txt` (21:36). PDF: `materials/pdf/reto-ntt-qap10.pdf`. Instancia: https://miplib.zib.de/instance_details_qap10.html

## El problema
10 elementos → 10 ubicaciones (permutación). `F[i,k]` = flujo entre elementos, `D[j,l]` = distancia entre ubicaciones. Variables `x_ij ∈ {0,1}`.
`min C(x) = Σ_{i<k} Σ_{j≠l} F_ik · D_jl · x_ij · x_kl` s.a. `Σ_j x_ij = 1`, `Σ_i x_ij = 1`.
- **Convención del archivo: cada par se cuenta UNA vez** (si lo cuentas dos veces, el costo se duplica).
- **Óptimo de referencia N=10: C* = 340.** Controles: **N=3 → 24**, **N=4 → 32** (usando las primeras N filas/columnas).
- Instancia completa MPS: 4150 variables, 1820 restricciones (linealizada Adams-Johnson); 100 variables binarias reales; 10! = 3 628 800 soluciones.
- Pregunta central: *hasta dónde ayudan métodos cuánticos/inspirados/híbridos con tiempo y recursos limitados*. **No se pide demostrar ventaja cuántica**: se mide qué funciona, qué no y por qué. Sin evidencia, afirmar ventaja NO puntúa.

## Datos YA reconstruidos y verificados (carpeta `qap10/` de la skill)
- `qap10_F.npy`, `qap10_D.npy` (10×10). Verificado: 0 de 4050 coeficientes inconsistentes; óptimos 24, 32 y **340** coinciden con el PDF; `D` simétrica (distancias Manhattan en una cuadrícula); `F` simétrica.
- `qap10_reconstruct.py`: cómo se recuperaron (para explicarlo al jurado: criterio "lectura de datos"). Clave: columnas `X(a)`, a=(i-1)·10+j ↔ x_ij; columnas `Y{p}A{a}` llevan el coeficiente `F_ik·D_jl`; filas `C01–C09` identifican k y `C10–C18` identifican l; se fija la escala de D con el mcd de una fila base y se comprueba que todos los coeficientes cuadran.
- Otras soluciones óptimas: permutación `[2,6,3,0,8,4,5,1,7,9]` (elemento i → ubicación p[i], índices desde 0) cuesta 340.
- `qap_toolkit.py`: `cost`, `brute_force(n)`, `local_search_2swap`, `simulated_annealing`, `build_qp` (QUBO con restricciones), `qaoa_solve`, `hybrid_neighborhood`. Resultados medidos: 2-swap y SA encuentran **340 (óptimo)** en < 1 s para N=10; QAOA N=3 (9 qubits, reps=1, 30–60 iteraciones) encuentra 24 (óptimo) pero tarda ~90–100 s con `StatevectorSampler` (reps=2 ~200 s; con 150 iteraciones llegó a 354 s). **N=4 = 16 qubits será bastante más lento: planificarlo.** El método clásico gana en tiempo y calidad → hay que decirlo con honestidad.

## Cómo entra Qiskit (requisito: uso SUSTANTIVO)
QAOA es sugerencia, no obligación. Válido: QAOA, VQE, circuitos variacionales, Ising, inspirados en cuántica, híbridos. **Aclarar qué hace Qiskit y qué se hace clásico.** Restricciones como penalización QUBO: `H = C + λ Σ_i(Σ_j x_ij −1)² + λ Σ_j(Σ_i x_ij −1)²` (justificar λ; comprobar factibilidad). `x=(1−Z)/2` → Hamiltoniano de Ising (`QuadraticProgram.to_ising` / `QuadraticProgramToQubo`).
No se espera simular 100 qubits: empezar con N pequeño, **fijar decisiones, optimizar vecindarios y reconstruir la asignación completa** (= `hybrid_neighborhood`: partir de una solución clásica y mejorar subconjuntos de m elementos con QAOA de m² qubits).
Memoria statevector (128 bit): N=3→9 qubits 8 KiB; N=4→16 qubits 1 MiB; N=5→25 qubits 512 MiB; N=10→100 qubits impráctico.

## Etapas
- **Etapa 1 (Día 1):** N=3 o 4 → método clásico + estrategia Qiskit; comparar **costo, factibilidad y tiempo** (óptimos de control 24 y 32).
- **Etapa 3 (Día 2, finalistas):** qué pasa al crecer N o los vecindarios; evaluar costo, factibilidad, tiempo y memoria (no hace falta un único circuito grande).
- Qué mostrar el Día 1: (1) **Modelo y datos**: instancia, variables, costo, restricciones, reducción hecha; (2) **Baseline clásico**: método, asignación, costo, tiempo; (3) **Componente Qiskit**: qué se ejecutó, tamaño, configuración, resultados; (4) **Comparación**: mejor costo factible, fracción factible de las muestras, tiempo total, límites; (5) **Reproducibilidad**: código, versiones, semillas, parámetros.
- Brecha: `gap(%) = 100·(C−340)/340` **solo sobre soluciones válidas**. La energía penalizada del QUBO ≠ costo de una asignación factible; si se reportan ambas, rotularlas.

## ✅ VERSIÓN VIGENTE (v3, "Reto_NTT_DATA (2).pdf", 24 oct 11:18; texto en `reto-ntt-qap10-v3-vigente.txt`) — PREVALECE sobre todo lo de abajo
- **Rúbrica final: 25 (modelo/datos/factibilidad) · 30 (Qiskit pertinente y justificación) · 20 (calidad de asignaciones y comparación clásica) · 15 (rigor: tiempo, límites, escalamiento) · 10 (claridad y sentido operativo) = 100.** Sin bonus. **Track abierto ELIMINADO**: elegir Track A (puertas de embarque) o B (recarga de flotas).
- **Día 1 mínimo válido: "un trabajo sólido en N=4 o N=5"** = instancia bien definida + solución clásica de referencia + **un experimento real con Qiskit** + comparación. N=10 es extensión opcional (Etapa 2).
- **N=10 se puede resolver con métodos clásicos** (10! = 3.6M se enumera secuencialmente). Etapa 2: método clásico, híbrido o de descomposición que dé asignaciones válidas y se acerque a 340. **Se puede usar el óptimo 340 para evaluar, NO como punto de partida.** Si se aplica **reparación clásica**, reportar resultado original Y corregido.
- **Etapa 3 (solo finalistas, Día 2): N ≥ 14** (14! ≈ 8.7×10¹⁰): comparar con N=10 en tiempo, memoria, calidad y factibilidad; vale búsqueda local, descomposición, fijar variables, con un componente Qiskit bien justificado; no hace falta enumerar ni simular N² qubits. Lo importante: **hasta dónde escala el método y cuándo deja de convenir.** (Hay que generar instancias N≥14: no vienen en qap10.)
- Tabla de memoria statevector: N=4→16 qubits 1 MiB; N=5→25 qubits 512 MiB; N=10→100 qubits ≈2×10³¹ B (no es la memoria del método clásico).

## (OBSOLETO) Rúbrica propia de NTT DATA (⚠ dos versiones del PDF)
| Criterio | Puntos |
|---|---|
| Modelo matemático, lectura de datos y factibilidad | 25 |
| Uso pertinente de Qiskit y justificación del método | **30** |
| Calidad de las asignaciones y comparación clásica | 20 |
| Rigor experimental: tiempo, límites y escalamiento | 15 |
| Claridad y sentido operativo del resultado | **15 (v2 nueva) / 10 (v1 antigua)** |
| Bonificación track abierto | hasta +10 (v1: se suma → máx. 110) |
⚠ La v2 suma 105 diciendo "base 100" y no explica la bonificación en la tabla (sí en el texto "Track abierto · hasta 10 puntos adicionales"). **Preguntar a NTT DATA qué versión vale.**

## Tracks de narrativa (los datos son un benchmark matemático; las unidades/conclusiones son SUPUESTOS)
- **A · Transporte y logística:** 10 vuelos de conexión → 10 puertas; F = pasajeros en tránsito entre vuelos, D = distancia entre puertas.
- **B · Sostenibilidad / smart cities:** 10 rutas eléctricas → 10 estaciones de recarga; F = demanda compartida, D = distancia entre estaciones. No afirmar reducción de emisiones sin datos y supuestos.
- **Abierto (+hasta 10 pts):** narrativa propia (salud, finanzas, retail, manufactura…) con el mismo problema matemático. Para optar: explicar qué representan F y D, qué decisión de negocio se toma y cómo se estimaría el impacto; si hay ahorros/ROI, mostrar cálculo y supuestos (no presentarlos como medidos). El jurado valora originalidad, sentido de las matrices y justificación cuantitativa.

## Referencia de un compañero: "Optimización de calendario de salud para agendar citas"
Encaja en el track abierto como **QAP de agenda**: 10 tipos de cita/servicios (o pacientes-tratamientos) ↔ 10 franjas horarias; **F_ik** = qué tan relacionadas están las citas i y k (mismo paciente en seguimiento, exámenes que deben ir juntos, recursos/personal compartido); **D_jl** = separación temporal entre franjas j y l (en este dataset D es la cuadrícula de qap10: se puede interpretar como "distancia" entre franjas/consultorios; si se usan datos propios, definirlos y justificarlos); decisión: qué franja recibe cada cita para minimizar Σ F·D (citas relacionadas cerca en tiempo/lugar → menos viajes/esperas del paciente). Salvedades honestas: QAP solo captura proximidad por pares; no modela disponibilidad individual ni duraciones; cualquier ahorro de tiempo del paciente es una estimación con supuestos. Para NTT DATA conservar **exactamente** la misma instancia/ costos para comparar con el óptimo 340.
