"""Grover Adaptive Search (GAS) para QAP con codificación por RANGO de permutación.

Idea: en vez de N^2 qubits "one-hot" (100 para N=10) + penalizaciones, el índice k de un estado de
ceil(log2(N!)) qubits ES la k-ésima permutación (orden lexicográfico). Todo estado válido es factible por construcción.
- N<=5: circuitos REALES de Qiskit (DiagonalGate como oráculo de umbral + GroverOperator), ejecutables en simulador/hardware.
- N=10 (22 qubits): simulación EXACTA del algoritmo de Grover con la fórmula cerrada del subespacio de 2 dimensiones.
HONESTIDAD: el oráculo usa una tabla de costos precalculada clásicamente; en hardware real habría que sintetizarlo (costoso).
"""
import itertools, math, time
import numpy as np

F = np.load("qap10_F.npy"); D = np.load("qap10_D.npy")


def cost_table(n):
    perms = np.array(list(itertools.permutations(range(n))), dtype=np.int8)
    c = np.zeros(len(perms))
    for i in range(n):
        for k in range(i + 1, n):
            c += F[i, k] * D[perms[:, i], perms[:, k]]
    return perms, c


def _rand_unmarked(rng, S, c, y, NF):
    while True:
        k = int(rng.integers(S))
        if k >= NF or c[k] >= y - 1e-9: return k


def gas_numpy(n, seed=0, max_oracle=None, verbose=False, explicit=False):
    """Grover Adaptive Search con calendario BBHT (M desconocido). Devuelve mejor perm, costo, llamadas al oráculo, qubits.
    Simulación EXACTA: partiendo del uniforme, tras j iteraciones P(marcado)=sin^2((2j+1)*theta), sin(theta)=sqrt(M/S), y dentro
    de cada clase (marcados / no marcados) el estado es uniforme. explicit=True aplica oráculo+difusión sobre el vector (N pequeño)."""
    rng = np.random.default_rng(seed)
    perms, c = cost_table(n); NF = len(perms); q = math.ceil(math.log2(NF)); S = 2 ** q
    max_oracle = max_oracle or int(12 * math.sqrt(S))
    idx = int(rng.integers(NF)); y = c[idx]; best = idx; calls = 0; m = 1.0; lam = 6 / 5
    while calls < max_oracle:
        marked = np.flatnonzero(c < y - 1e-9)
        M = len(marked)
        if M == 0: break
        j = int(rng.integers(0, int(m) + 1)); calls += j + 1
        if explicit:
            mask = np.zeros(S, bool); mask[:NF] = c < y - 1e-9; psi = np.full(S, 1 / math.sqrt(S))
            for _ in range(j): psi[mask] *= -1; psi = 2 * psi.mean() - psi
            p = psi ** 2; k = int(rng.choice(S, p=p / p.sum()))
        else:
            theta = math.asin(math.sqrt(M / S)); pm = math.sin((2 * j + 1) * theta) ** 2
            k = int(marked[rng.integers(M)]) if rng.random() < pm else _rand_unmarked(rng, S, c, y, NF)
        if k < NF and c[k] < y - 1e-9:
            y, best, m = c[k], k, 1.0
            if verbose: print(f"  mejora: costo {y} con {calls} llamadas")
        else:
            m = min(lam * m, math.sqrt(S))
    return perms[best].tolist(), float(y), calls, q


def gas_qiskit_demo(n=4, threshold=None):
    """Circuito REAL de Qiskit para N pequeño: oráculo DiagonalGate (fase -1 si costo<umbral) + GroverOperator."""
    from qiskit import QuantumCircuit
    from qiskit.circuit.library import DiagonalGate, GroverOperator
    from qiskit.primitives import StatevectorSampler
    perms, c = cost_table(n); NF = len(perms); q = math.ceil(math.log2(NF)); S = 2 ** q
    thr = threshold if threshold is not None else c.min() + 1e-9
    mark = np.zeros(S, bool); mark[:NF] = c < thr
    M = int(mark.sum()); iters = max(1, int(round(math.pi / (4 * math.asin(math.sqrt(M / S))) - 0.5))) if M else 0
    phases = np.where(mark, -1.0, 1.0).astype(complex)
    oracle = QuantumCircuit(q); oracle.append(DiagonalGate(phases.tolist()), range(q))
    qc = QuantumCircuit(q, q); qc.h(range(q))
    qc.compose(GroverOperator(oracle).power(iters), inplace=True); qc.measure(range(q), range(q))
    counts = StatevectorSampler(seed=1).run([qc], shots=1000).result()[0].data.c.get_counts()
    ok = sum(v for b, v in counts.items() if int(b, 2) < NF and mark[int(b, 2)])
    return dict(n=n, qubits=q, marcadas=M, iteraciones=iters, prob_exito=ok / 1000,
                top=sorted(counts.items(), key=lambda x: -x[1])[:3], profundidad=qc.decompose(reps=3).depth())


if __name__ == "__main__":
    for n in (3, 4, 5):
        print(gas_qiskit_demo(n), flush=True)
    for s in range(5):
        t = time.time(); p, y, calls, q = gas_numpy(10, seed=s)
        print(f"N=10 seed={s}: costo={y} perm={p} qubits={q} llamadas_oraculo={calls} "
              f"(vs {math.factorial(10)} evaluaciones de fuerza bruta) tiempo={time.time()-t:.1f}s", flush=True)
