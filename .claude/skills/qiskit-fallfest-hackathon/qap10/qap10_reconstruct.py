"""Reconstruye F (flujos) y D (distancias) de qap10.mps.gz (MIPLIB) y verifica con los óptimos del reto.

Estructura (linealización Adams-Johnson):
  X(a), a=(i-1)*10+j  -> x_ij  (filas NX01..NX10 = elemento i; NX11..NX20 = ubicación j)
  Y{p}A{a}            -> y_{ij,kl}, coeficiente objetivo = F_ik * D_jl, k>i, l!=j
  filas C{m}A{a}: m=1..9 identifica k (m-ésimo elemento != i); m=10..18 identifica l (m-10 -ésima ubicación != j)
Uso: python qap10_reconstruct.py [ruta/qap10.mps.gz]   -> escribe qap10_F.npy y qap10_D.npy
"""
import gzip, sys, re, itertools
from math import gcd
from functools import reduce
import numpy as np

path = sys.argv[1] if len(sys.argv) > 1 else "qap10.mps.gz"
N = 10
lines = gzip.open(path, "rt").read().splitlines()
start = lines.index("COLUMNS") + 1
end = lines.index("RHS")
cols = {}
for l in lines[start:end]:
    t = l.split()
    if len(t) >= 3 and t[0].startswith("Y"):
        cols.setdefault(t[0], []).append((t[1], float(t[2])))

coef = {}  # (i,j,k,l) -> costo del par (i<k, j!=l), indices 0-based
for name, ents in cols.items():
    obj = [v for r, v in ents if r == "NOBJ"][0]
    rows = [r for r, _ in ents if r != "NOBJ"]
    a = int(re.match(r"Y\d+A(\d+)", name).group(1))
    i, j = divmod(a - 1, N)  # 0-based
    ms = sorted({int(r[1:3]) for r in rows if int(r[4:]) == a})  # filas C..A{a}
    m1 = [m for m in ms if m <= 9][0]
    m2 = [m for m in ms if m >= 10][0]
    k = [x for x in range(N) if x != i][m1 - 1]
    l = [x for x in range(N) if x != j][m2 - 10]
    coef[(i, j, k, l)] = obj

# F_ik*D_jl: fijar D por razones y escalar a enteros (convención: D con mcd 1 sobre la fila base)
i0, k0 = 0, 1
base = {(j, l): coef[(i0, j, k0, l)] for j in range(N) for l in range(N) if j != l}
g = reduce(gcd, [int(v) for v in base.values() if v])
D = np.zeros((N, N))
for (j, l), v in base.items():
    D[j, l] = v / g
F = np.zeros((N, N))
for i in range(N):
    for k in range(i + 1, N):
        # F_ik = coef / D_jl para algún (j,l) con D>0
        j, l = next((j, l) for j in range(N) for l in range(N) if j != l and D[j, l] > 0)
        F[i, k] = F[k, i] = coef[(i, j, k, l)] / D[j, l]
# D puede ser asimétrica según el archivo; comprobar consistencia de todos los coeficientes
bad = sum(1 for (i, j, k, l), v in coef.items() if abs(F[i, k] * D[j, l] - v) > 1e-9)
print("coeficientes inconsistentes:", bad, "de", len(coef))
print("D simétrica:", np.allclose(D, D.T))
np.save("qap10_F.npy", F)
np.save("qap10_D.npy", D)


def cost(perm, F, D):  # perm[i] = ubicación del elemento i; cada par i<k una sola vez, j!=l
    n = len(perm)
    return sum(F[i, k] * D[perm[i], perm[k]] for i in range(n) for k in range(i + 1, n))


# El archivo cuenta Σ_{i<k} Σ_{j≠l} F_ik D_jl x_ij x_kl -> con x permutación = Σ_{i<k} F_ik D_{p(i)p(k)}
for n in (3, 4):
    best = min(cost(p, F[:n, :n], D[:n, :n]) for p in itertools.permutations(range(n)))
    print(f"N={n} óptimo={best}")
# óptimo completo por permutaciones (vectorizado simple, ~10! = 3.6M; unos segundos-minutos)
perms = np.array(list(itertools.permutations(range(N))), dtype=np.int8)
iu = [(i, k) for i in range(N) for k in range(i + 1, N)]
tot = np.zeros(len(perms))
for i, k in iu:
    tot += F[i, k] * D[perms[:, i], perms[:, k]]
b = tot.argmin()
print("óptimo N=10:", tot[b], "perm:", perms[b].tolist())
