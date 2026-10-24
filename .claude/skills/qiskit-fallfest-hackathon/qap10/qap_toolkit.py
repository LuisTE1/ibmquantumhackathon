"""Toolkit QAP10 (reto NTT DATA): datos, baselines clásicos, QUBO, QAOA y híbrido por vecindarios.

Convención del archivo: costo = Σ_{i<k} F[i,k] * D[p[i], p[k]]  (cada par una sola vez). Óptimo N=10: 340.
Requiere qap10_F.npy / qap10_D.npy (generados por qap10_reconstruct.py).
"""
import itertools, time, random
import numpy as np
from qiskit_optimization import QuadraticProgram
from qiskit_optimization.algorithms import MinimumEigenOptimizer
from qiskit_algorithms import QAOA
from qiskit_algorithms.optimizers import COBYLA
from qiskit.primitives import StatevectorSampler

F = np.load("qap10_F.npy"); D = np.load("qap10_D.npy")


def cost(p, F=F, D=D):
    n = len(p)
    return float(sum(F[i, k] * D[p[i], p[k]] for i in range(n) for k in range(i + 1, n)))


# ---------- baselines clásicos ----------
def brute_force(n):
    t = time.time(); best = min(itertools.permutations(range(n)), key=lambda p: cost(p, F[:n, :n], D[:n, :n]))
    return list(best), cost(best, F[:n, :n], D[:n, :n]), time.time() - t


def local_search_2swap(n=10, restarts=30, seed=0):
    rng = random.Random(seed); t = time.time(); best, bc = None, 1e18
    for _ in range(restarts):
        p = list(range(n)); rng.shuffle(p); c = cost(p, F[:n, :n], D[:n, :n]); improved = True
        while improved:
            improved = False
            for a, b in itertools.combinations(range(n), 2):
                p[a], p[b] = p[b], p[a]; c2 = cost(p, F[:n, :n], D[:n, :n])
                if c2 < c - 1e-12: c, improved = c2, True
                else: p[a], p[b] = p[b], p[a]
        if c < bc: best, bc = p[:], c
    return best, bc, time.time() - t


def simulated_annealing(n=10, iters=20000, seed=0, T0=20.0):
    rng = random.Random(seed); t = time.time()
    p = list(range(n)); rng.shuffle(p); c = cost(p, F[:n, :n], D[:n, :n]); best, bc = p[:], c
    for it in range(iters):
        T = T0 * (1 - it / iters) + 1e-3; a, b = rng.sample(range(n), 2)
        p[a], p[b] = p[b], p[a]; c2 = cost(p, F[:n, :n], D[:n, :n])
        if c2 <= c or rng.random() < np.exp((c - c2) / T): c = c2; (best, bc) = (p[:], c) if c < bc else (best, bc)
        else: p[a], p[b] = p[b], p[a]
    return best, bc, time.time() - t


# ---------- modelo cuadrático (QUBO con restricciones) ----------
def build_qp(items, locs, fixed=None):
    """Sub-QAP: asigna `items` a `locs` (mismo tamaño). `fixed` = {item: loc} de elementos ya fijos (términos lineales)."""
    fixed = fixed or {}
    qp = QuadraticProgram("qap"); n = len(items)
    name = lambda a, b: f"x_{a}_{b}"
    for a in items:
        for b in locs: qp.binary_var(name(a, b))
    lin, quad = {}, {}
    for ia, a in enumerate(items):
        for b in locs:  # interacción con elementos fijos
            lin[name(a, b)] = sum((F[min(a, f), max(a, f)] * D[b, fl]) for f, fl in fixed.items())
    for a, c in itertools.combinations(items, 2):  # i<k, j!=l
        for b in locs:
            for d in locs:
                if b != d: quad[(name(a, b), name(c, d))] = quad.get((name(a, b), name(c, d)), 0) + F[a, c] * D[b, d]
    qp.minimize(linear=lin, quadratic=quad)
    for a in items: qp.linear_constraint({name(a, b): 1 for b in locs}, "==", 1, f"item{a}")
    for b in locs: qp.linear_constraint({name(a, b): 1 for a in items}, "==", 1, f"loc{b}")
    return qp


def decode(res, items, locs):
    p = {}
    for a in items:
        for b in locs:
            if res.variables_dict.get(f"x_{a}_{b}", 0) > 0.5: p[a] = b
    ok = len(p) == len(items) and len(set(p.values())) == len(items)
    return p, ok


def qaoa_solve(items, locs, fixed=None, reps=1, maxiter=40, seed=1):
    qp = build_qp(items, locs, fixed); t = time.time()
    qaoa = QAOA(sampler=StatevectorSampler(seed=seed), optimizer=COBYLA(maxiter=maxiter), reps=reps)
    res = MinimumEigenOptimizer(qaoa).solve(qp)
    p, ok = decode(res, items, locs)
    return p, ok, res.fval, time.time() - t


def hybrid_neighborhood(n=10, m=3, rounds=4, seed=0, reps=1, maxiter=40):
    """Híbrido: parte de una solución clásica y mejora vecindarios de m elementos con QAOA (m^2 qubits)."""
    rng = random.Random(seed); cur, c0, _ = simulated_annealing(n, iters=200, seed=seed)  # solución inicial mediocre a propósito
    cur = {i: cur[i] for i in range(n)}; hist = [cost([cur[i] for i in range(n)])]
    for r in range(rounds):
        S = sorted(rng.sample(range(n), m)); locs = sorted(cur[i] for i in S)
        fixed = {i: cur[i] for i in range(n) if i not in S}
        p, ok, _, _ = qaoa_solve(S, locs, fixed, reps=reps, maxiter=maxiter, seed=seed + r)
        if ok:
            trial = dict(cur); trial.update(p)
            if cost([trial[i] for i in range(n)]) < hist[-1]: cur = trial
        hist.append(cost([cur[i] for i in range(n)]))
    return [cur[i] for i in range(n)], hist


if __name__ == "__main__":
    for n in (3, 4):
        print(f"N={n} fuerza bruta:", brute_force(n)[:2])
    print("2-swap N=10:", local_search_2swap()[1:], " SA N=10:", simulated_annealing()[1:])
    items, locs = [0, 1, 2], [0, 1, 2]
    p, ok, f, t = qaoa_solve(items, locs)
    print("QAOA N=3:", p, "factible", ok, "costo", cost([p[i] for i in items], F[:3, :3], D[:3, :3]) if ok else None, f"{t:.1f}s")
