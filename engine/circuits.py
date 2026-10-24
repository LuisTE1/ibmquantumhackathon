"""STUB de la persona B: reemplazar por circuitos reales de Qiskit manteniendo las firmas (ver CONTRATO.md)."""
CODE_COIN = "qc = QuantumCircuit(1, 1)\nqc.h(0)\nqc.measure(0, 0)"
CODE_RX = "qc = QuantumCircuit(1, 1)\nqc.rx(theta, 0)\nqc.measure(0, 0)"

def coin_counts(shots: int, seed: int) -> dict:  # STUB: datos falsos
    return {"0": shots // 2, "1": shots - shots // 2}

def rx_counts(theta_deg: float, shots: int, seed: int) -> dict:  # STUB: datos falsos
    from .stats import prob_one
    ones = round(prob_one(theta_deg) * shots)
    return {"0": shots - ones, "1": ones}
