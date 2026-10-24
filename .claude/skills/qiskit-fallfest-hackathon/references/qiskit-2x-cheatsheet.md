# Qiskit 2.x cheatsheet (hackathon)

Fuente base: notebooks del festival (Qiskit 2.5.2, qiskit-aer 0.17.2, Python 3.12/3.13, Colab). Lo marcado *(general)* viene de conocimiento de la API, no de los materiales: verificar con `help()` si algo falla.

## Instalación / entorno
```bash
conda create -n qiskit python=3.12 -y && conda activate qiskit      # recomendado en el taller (Anaconda/Miniconda)
pip install "qiskit[visualization]" qiskit-aer qiskit-ibm-runtime jupyterlab numpy matplotlib
python -c "import qiskit; print(qiskit.__version__)"
```
En Colab: `%pip install qiskit[visualization] qiskit-aer`.

## Circuitos básicos
```python
from qiskit import QuantumCircuit
from math import pi
qc = QuantumCircuit(2, 2)        # 2 qubits, 2 bits clásicos
qc.h(0); qc.cx(0, 1)             # Bell
qc.x(0); qc.y(0); qc.z(0); qc.s(0); qc.t(0)
qc.rx(pi/2, 0); qc.ry(pi/2, 0); qc.rz(pi/2, 0)
qc.swap(0, 1); qc.ccx(0, 1, 2)   # Toffoli (necesita 3 qubits)
qc.barrier()
qc.measure([0, 1], [0, 1])       # o qc.measure_all()
qc.draw("mpl")                   # o qc.draw() texto
```

## Estado exacto (sin medir)
```python
from qiskit.quantum_info import Statevector, Operator, DensityMatrix
sv = Statevector.from_instruction(qc_sin_medir)
print(sv); sv.probabilities_dict(); sv.draw("latex"); Operator(qc).data
```

## Muestreo (Sampler V2) — shots
```python
from qiskit.primitives import StatevectorSampler
res = StatevectorSampler().run([qc], shots=1000).result()
counts = res[0].data.c.get_counts()      # 'c' = nombre del registro clásico (por defecto 'c'; con measure_all es 'meas')
from qiskit.visualization import plot_histogram; plot_histogram(counts)
```

## Simulador Aer (con ruido / backend)
```python
from qiskit_aer import AerSimulator
from qiskit import transpile
sim = AerSimulator()
tqc = transpile(qc, sim)
counts = sim.run(tqc, shots=1024).result().get_counts()
```
Backend `AerSimulator.from_backend(real_backend)` imita el ruido de un dispositivo real *(general)*.

## Valores esperados (Estimator V2) *(general)*
```python
from qiskit.primitives import StatevectorEstimator
from qiskit.quantum_info import SparsePauliOp
obs = SparsePauliOp.from_list([("ZZ", 1.0), ("XX", 0.5)])
est = StatevectorEstimator().run([(qc_sin_medir, obs)]).result()[0].data.evs
```
Circuitos parametrizados: `from qiskit.circuit import Parameter`; `qc.assign_parameters({theta: 0.3})`, o pasar arrays de parámetros como 3er elemento del PUB `(qc, obs, valores)`.

## IBM Quantum (hardware real) *(general)*
```python
from qiskit_ibm_runtime import QiskitRuntimeService, SamplerV2
from qiskit.transpiler.preset_passmanagers import generate_preset_pass_manager
QiskitRuntimeService.save_account(channel="ibm_quantum_platform", token="TU_TOKEN", overwrite=True)
svc = QiskitRuntimeService()
backend = svc.least_busy(operational=True, simulator=False)
pm = generate_preset_pass_manager(backend=backend, optimization_level=3)
isa = pm.run(qc)
job = SamplerV2(mode=backend).run([isa], shots=1000)
print(job.job_id()); print(job.result()[0].data.c.get_counts())
```
Nunca pegar el token en el chat ni subirlo a git.

## Utilidades
- Composer visual: https://quantum.cloud.ibm.com/composer — Bloch sphere: https://www.quantum-sandbox.com/ (usados en el taller de Qubit Operations).
- `qc.decompose()`, `qc.depth()`, `qc.count_ops()`, `qc.inverse()`, `qc.compose(otro, qubits=[..])`, `qc.to_gate()`, `.control(n)`.
- `from qiskit.circuit.library import QFTGate, GroverOperator, ...` *(general; en 2.x QFT se prefiere como `QFTGate`)*.
- Bloch: `from qiskit.visualization import plot_bloch_multivector; plot_bloch_multivector(sv)`.

## Identidades útiles (de los talleres)
- X|0⟩=|1⟩; Y|0⟩=i|1⟩; Z|0⟩=|0⟩, Z|1⟩=−|1⟩. XZ≠ZX (ver orden: X luego Z da −|1⟩).
- H|0⟩=(|0⟩+|1⟩)/√2; HH=I; HZH=X.
- Bell: `h(0); cx(0,1)` → (|00⟩+|11⟩)/√2; medir da 00 y 11 ≈ 50/50.
- SWAP = tres CNOT: cx(0,1); cx(1,0); cx(0,1) (ejercicio 1 del taller de Qubit Operations).

## Errores comunes
- `ImportError: execute/Aer` → API eliminada; usar `AerSimulator` + `transpile` / primitives.
- `KeyError`/`AttributeError` en `data.c` → el registro clásico se llama distinto (`data.meas` tras `measure_all()`).
- Medir antes de `Statevector.from_instruction` → falla; construir el circuito sin mediciones.
- Cadenas de bits invertidas → little-endian.
