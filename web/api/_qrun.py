"""Lógica cuántica del juego con Qiskit real (1 qubit). Se usa desde api/run.py (Vercel) y desde las pruebas."""
from qiskit import QuantumCircuit, __version__ as QISKIT_VERSION
from qiskit.primitives import StatevectorSampler
from qiskit.quantum_info import Statevector

ALLOWED = {"h", "x"}
MAX_GATES = 8
MAX_SHOTS = 4096


def _validate(gates, shots):
    if not isinstance(gates, list) or len(gates) > MAX_GATES or any(g not in ALLOWED for g in gates):
        raise ValueError("gates debe ser una lista de hasta 8 elementos 'h' o 'x'")
    if not isinstance(shots, int) or not 1 <= shots <= MAX_SHOTS:
        raise ValueError("shots debe ser un entero entre 1 y 4096")


def run_circuit(gates, shots=10, seed=0):
    """Aplica las compuertas (en orden, sin medir entre ellas) a |0>, y luego mide `shots` veces."""
    _validate(gates, shots)
    base = QuantumCircuit(1)
    for g in gates:
        getattr(base, g)(0)
    p = Statevector.from_instruction(base).probabilities_dict()
    probs = {"0": round(float(p.get("0", 0.0)), 10), "1": round(float(p.get("1", 0.0)), 10)}
    qc = QuantumCircuit(1, 1)
    qc.compose(base, inplace=True)
    qc.measure(0, 0)
    c = StatevectorSampler(seed=int(seed)).run([qc], shots=shots).result()[0].data.c.get_counts()
    counts = {"0": int(c.get("0", 0)), "1": int(c.get("1", 0))}
    return {"counts": counts, "probs": probs, "source": "qiskit", "version": QISKIT_VERSION}
