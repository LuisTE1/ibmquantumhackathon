# Playbooks por reto (código verificado en el entorno del usuario: qiskit 2.6.1, qiskit-optimization 0.7.0, qiskit-algorithms 0.4.0, qiskit-machine-learning 0.9.1)

## 5.2 Algoritmos y aplicaciones — Optimización de rutas y conexiones

**Pasos:** (1) modelar como QUBO/programa cuadrático (variables binarias, costos, restricciones) → (2) resolver **exacto/clásico** (baseline) → (3) resolver con **QAOA** (o VQE) → (4) comparar costo, factibilidad y tiempo → (5) visualizar (networkx + matplotlib).

```python
from qiskit_optimization import QuadraticProgram
from qiskit_optimization.algorithms import MinimumEigenOptimizer
from qiskit_algorithms import QAOA, NumPyMinimumEigensolver
from qiskit_algorithms.optimizers import COBYLA
from qiskit.primitives import StatevectorSampler

edges = {(0,1):2,(1,2):3,(2,3):2,(3,0):4,(0,2):5,(1,3):6}        # arista:costo
qp = QuadraticProgram("ruta")
for (i,j) in edges: qp.binary_var(f"x{i}{j}")                     # x_ij = 1 si usamos la arista
qp.minimize(linear={f"x{i}{j}": c for (i,j),c in edges.items()})  # minimizar costo
for n in range(4):                                                # restricción: grado 2 por nodo (ciclo)
    qp.linear_constraint({f"x{i}{j}":1 for (i,j) in edges if n in (i,j)}, "==", 2, f"deg{n}")

exact = MinimumEigenOptimizer(NumPyMinimumEigensolver()).solve(qp)          # referencia exacta
qaoa  = QAOA(sampler=StatevectorSampler(seed=1), optimizer=COBYLA(maxiter=100), reps=2)
res   = MinimumEigenOptimizer(qaoa).solve(qp)                               # cuántico
print(exact.fval, exact.x); print(res.fval, res.x, res.status)             # resultado verificado: ambos 11.0
```
- Las restricciones se convierten solas en penalizaciones (`qp.to_qubo()` para verlo). Reportar **factibilidad** y **gap** = (cuántico − exacto)/exacto.
- Escala: 1 variable = 1 qubit. Mantener ≤ ~15–20 variables en simulador. Para más: heurística clásica (greedy/2-opt) como baseline y QAOA en subproblema.
- Alternativas: Max-Cut con `qiskit_addon_opt_mapper` (`Maxcut`), tutorial oficial QAOA: https://quantum.cloud.ibm.com/docs/tutorials/quantum-approximate-optimization-algorithm
- "Híbrido": dividir el problema (clustering/ruteo clásico) y resolver cada subproblema con QAOA; o warm-start. Mostrar **tabla clásico / cuántico / híbrido**.
- Ya se ven mensajes `SparseEfficiencyWarning` de scipy: son inocuos.

## 5.3 EdTech — Estadística/ML ↔ QML, adictivo

**Ideas con equivalente cuántico directo:**
| Concepto clásico | Equivalente cuántico | Herramienta |
|---|---|---|
| SVM | SVM con **kernel cuántico** | `FidelityQuantumKernel` + `sklearn.SVC(kernel=k.evaluate)` |
| Redes neuronales | **QNN / VQC** | `qiskit_machine_learning.neural_networks`, `algorithms.VQC` |
| Monte Carlo | **Estimación de amplitud** | `qiskit_algorithms.AmplitudeEstimation` |
| Distribuciones de probabilidad | Estados cuánticos medidos (shots, histograma) | `StatevectorSampler`, `plot_histogram` |
| Descenso de gradiente | Optimización de circuitos variacionales (parameter-shift) | `qiskit_algorithms.optimizers` (COBYLA/SPSA/L_BFGS_B) |

```python
# SVM clásico vs SVM con kernel cuántico (verificado; con make_moons: cuántico 0.72 vs RBF 0.89 → mostrarlo honestamente)
from sklearn.svm import SVC
from sklearn.datasets import make_moons
from sklearn.model_selection import train_test_split
from qiskit.circuit.library import zz_feature_map          # ZZFeatureMap(clase) está deprecada
from qiskit.primitives import StatevectorSampler
from qiskit_machine_learning.kernels import FidelityQuantumKernel
from qiskit_machine_learning.state_fidelities import ComputeUncompute
X,y = make_moons(60, noise=0.15, random_state=1)
Xtr,Xte,ytr,yte = train_test_split(X,y,test_size=0.3,random_state=1)
k = FidelityQuantumKernel(feature_map=zz_feature_map(2, reps=2),
                          fidelity=ComputeUncompute(sampler=StatevectorSampler(seed=1)))
print("cuántico", SVC(kernel=k.evaluate).fit(Xtr,ytr).score(Xte,yte))
print("clásico ", SVC(kernel="rbf").fit(Xtr,ytr).score(Xte,yte))
```
**Diseño para "adictivo / volver a usar" (criterio explícito):**
- Bucle corto: *predice → ejecuta circuito → ver resultado → puntos*. Retos diarios, rachas, niveles, tabla de posiciones, "desbloquear" compuertas.
- Sliders interactivos (Streamlit: `st.slider`, `st.pyplot`) que cambien shots/ruido/ángulos y muestren histogramas al instante.
- Definir **edad mínima** (p. ej. 14+ / universitarios) y **frecuencia de uso** (diaria, 5 min) y justificarlas en el pitch.
- Evidencia: mini-quiz antes/después, o encuesta rápida a compañeros en el evento → "validación".
- App: `pip install streamlit` ya hecho; `streamlit run app.py`.

## 5.1 Industria (NTT DATA)
Reto no visible. Cuando se conozca: formular como (a) optimización → usar playbook 5.2, (b) clasificación/predicción → kernel/QNN, (c) simulación/riesgo → estimación de amplitud. Siempre: baseline clásico, métricas de negocio (costo, tiempo, riesgo) y limitaciones.

## Hardware real (opcional, solo si suma)
Con token IBM: `SamplerV2` + `generate_preset_pass_manager` (ver cheatsheet). Para el jurado basta con simulador bien justificado, salvo que las bases pidan hardware; el plan Open tiene cola y minutos limitados: **no depender de ello en la demo**; guardar resultados pre-ejecutados.
