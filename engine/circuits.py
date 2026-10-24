"""Circuitos de Qiskit del juego (persona del motor).

USE_QISKIT = True usa circuitos reales de Qiskit 2.x con StatevectorSampler.
Si es False (o si no se puede importar qiskit) se usa un respaldo con numpy: mismas firmas y mismo formato.
OJO: en el respaldo la semilla 0 NO da 7 unos y 3 ceros (solo el circuito real de Qiskit lo hace).
"""
import math

import numpy as np

USE_QISKIT = True
try:
    from qiskit import QuantumCircuit
    from qiskit.primitives import StatevectorSampler
except Exception:  # pragma: no cover
    USE_QISKIT = False

# Código que verá el jugador (idéntico al que ejecutan las funciones de abajo).
CODE_COIN = '''from qiskit import QuantumCircuit
from qiskit.primitives import StatevectorSampler

qc = QuantumCircuit(1, 1)    # 1 qubit y 1 bit clásico para guardar la medición
qc.h(0)                      # Hadamard: deja el qubit en 50/50 (superposición)
qc.measure(0, 0)             # medir: el resultado es 0 o 1
resultado = StatevectorSampler(seed=0).run([qc], shots=10).result()   # 10 mediciones
print(resultado[0].data.c.get_counts())                               # cuántas veces salió cada valor'''

CODE_RX = '''import math
from qiskit import QuantumCircuit
from qiskit.primitives import StatevectorSampler

theta = math.radians(120)    # la "perilla": ángulo de giro del qubit
qc = QuantumCircuit(1, 1)
qc.rx(theta, 0)              # giro en X: P(salga 1) = sin²(theta/2)
qc.measure(0, 0)
resultado = StatevectorSampler(seed=1).run([qc], shots=100).result()  # 100 mediciones
print(resultado[0].data.c.get_counts())'''


def _check(shots: int) -> None:
    if not isinstance(shots, (int, np.integer)) or shots < 1:
        raise ValueError("shots debe ser un entero >= 1")


def _coin_circuit():
    qc = QuantumCircuit(1, 1)
    qc.h(0)
    qc.measure(0, 0)
    return qc


def _rx_circuit(theta_deg: float):
    qc = QuantumCircuit(1, 1)
    qc.rx(math.radians(theta_deg), 0)
    qc.measure(0, 0)
    return qc


def _run(qc, shots: int, seed: int) -> dict:
    c = StatevectorSampler(seed=seed).run([qc], shots=int(shots)).result()[0].data.c.get_counts()
    return {"0": int(c.get("0", 0)), "1": int(c.get("1", 0))}


def _fallback(p_one: float, shots: int, seed: int) -> dict:
    ones = int(np.random.default_rng(seed).binomial(int(shots), min(max(p_one, 0.0), 1.0)))
    return {"0": int(shots) - ones, "1": ones}


def coin_counts(shots: int, seed: int) -> dict:
    """Moneda 50/50 (compuerta h + medición). Devuelve {"0": n0, "1": n1}."""
    _check(shots)
    if USE_QISKIT:
        return _run(_coin_circuit(), shots, seed)
    return _fallback(0.5, shots, seed)


def rx_counts(theta_deg: float, shots: int, seed: int) -> dict:
    """Qubit girado theta grados con rx + medición. P(1) = sin²(theta/2)."""
    _check(shots)
    if USE_QISKIT:
        return _run(_rx_circuit(theta_deg), shots, seed)
    return _fallback(math.sin(math.radians(theta_deg) / 2) ** 2, shots, seed)


def circuit_diagram(kind: str, theta_deg: float = 0.0) -> str:
    """Dibujo de texto del circuito: kind = 'coin' o 'rx'."""
    if not USE_QISKIT:
        return "(Qiskit no disponible: dibujo desactivado)"
    qc = _coin_circuit() if kind == "coin" else _rx_circuit(theta_deg)
    return str(qc.draw("text"))
