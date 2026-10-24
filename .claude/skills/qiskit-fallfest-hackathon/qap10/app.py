"""GateQ — MVP: asignación de puertas de embarque (Track A, QAP10) con Qiskit.
Ejecutar:  streamlit run app.py
"""
import os, math, time, itertools
os.chdir(os.path.dirname(os.path.abspath(__file__)))
import numpy as np, pandas as pd, streamlit as st
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

st.set_page_config(page_title="GateQ · Puertas con Qiskit", page_icon="✈️", layout="wide")
N = 10
F0 = np.load("qap10_F.npy"); D = np.load("qap10_D.npy"); OPT = 340.0
# Distancia entre puertas = Manhattan en una cuadrícula (se deduce de D; ver assert)
GATE_XY = {0: (0, 0), 1: (1, 0), 2: (2, 0), 3: (3, 0), 4: (0, 1), 5: (1, 1), 6: (2, 1), 7: (3, 1), 8: (0, 2), 9: (1, 2)}
assert all(abs(abs(GATE_XY[a][0] - GATE_XY[b][0]) + abs(GATE_XY[a][1] - GATE_XY[b][1]) - D[a, b]) < 1e-9 for a in range(N) for b in range(N))
FL = [f"V{i + 1}" for i in range(N)]; GT = [f"P{j + 1}" for j in range(N)]


# ---------------------------------------------------------------- núcleo
@st.cache_resource(show_spinner="Preparando las 3 628 800 asignaciones posibles…")
def get_perms():
    if os.path.exists("perms10.npy"): return np.load("perms10.npy")
    p = np.array(list(itertools.permutations(range(N))), dtype=np.int8); np.save("perms10.npy", p); return p


@st.cache_data(show_spinner="Calculando el costo de todas las asignaciones…")
def cost_vector(F):
    perms = get_perms(); c = np.zeros(len(perms))
    for i in range(N):
        for k in range(i + 1, N): c += F[i, k] * D[perms[:, i], perms[:, k]]
    return c


def cost_of(p, F):
    return float(sum(F[i, k] * D[p[i], p[k]] for i in range(N) for k in range(i + 1, N)))


def anneal(F, iters=20000, seed=0, T0=20.0):
    rng = np.random.default_rng(seed); t = time.time(); p = list(rng.permutation(N)); c = cost_of(p, F); best, bc = p[:], c
    for it in range(iters):
        T = T0 * (1 - it / iters) + 1e-3; a, b = rng.choice(N, 2, replace=False)
        p[a], p[b] = p[b], p[a]; c2 = cost_of(p, F)
        if c2 <= c or rng.random() < math.exp((c - c2) / T):
            c = c2
            if c < bc: best, bc = p[:], c
        else: p[a], p[b] = p[b], p[a]
    return best, bc, time.time() - t


def grover_adaptive(c, seed=0, budget_factor=12):
    """Grover Adaptive Search sobre la tabla de costos. Simulación exacta (subespacio de 2 dim.). Índice = rango de permutación."""
    t = time.time(); rng = np.random.default_rng(seed); NF = len(c); q = math.ceil(math.log2(NF)); S = 2 ** q
    budget = int(budget_factor * math.sqrt(S)); best = int(rng.integers(NF)); y = c[best]; calls = 0; m = 1.0; hist = [(0, y)]
    while calls < budget:
        marked = np.flatnonzero(c < y - 1e-9); M = len(marked)
        if M == 0: break
        j = int(rng.integers(0, int(m) + 1)); calls += j + 1
        theta = math.asin(math.sqrt(M / S))
        if rng.random() < math.sin((2 * j + 1) * theta) ** 2: k = int(marked[rng.integers(M)])
        else:
            while True:
                k = int(rng.integers(S))
                if k >= NF or c[k] >= y - 1e-9: break
        if k < NF and c[k] < y - 1e-9: best, y, m = k, c[k], 1.0; hist.append((calls, y))
        else: m = min(1.2 * m, math.sqrt(S))
    return best, float(y), calls, q, hist, time.time() - t


# ---------------------------------------------------------------- dibujo
def draw_map(p, F, title, ax=None, min_flow=8):
    fig, ax = plt.subplots(figsize=(5.2, 4.2)) if ax is None else (None, ax)
    for j, (x, y) in GATE_XY.items(): ax.scatter(x, -y, s=1800, c="#eef2ff", edgecolors="#4f46e5", zorder=2)
    where = {i: GATE_XY[p[i]] for i in range(N)}
    for i in range(N):
        for k in range(i + 1, N):
            if F[i, k] >= min_flow:
                (x1, y1), (x2, y2) = where[i], where[k]
                ax.plot([x1, x2], [-y1, -y2], lw=F[i, k] / 4, c="#f59e0b", alpha=.55, zorder=1)
    for i in range(N):
        x, y = where[i]; ax.text(x, -y, f"{FL[i]}\n{GT[p[i]]}", ha="center", va="center", fontsize=9, zorder=3, weight="bold")
    ax.set_title(title, fontsize=11); ax.axis("off"); ax.set_xlim(-.6, 3.6); ax.set_ylim(-2.6, .6)
    return fig


# ---------------------------------------------------------------- UI
st.title("✈️ GateQ — Asignación de puertas con Qiskit")
st.caption("MVP · IBM Quantum Hackathon 2026 · Reto NTT DATA QAP10 · Track A (transporte y logística)")
st.warning("Supuesto: los datos son el benchmark matemático *qap10* (MIPLIB), **no** mediciones de un aeropuerto real. "
           "Flujos = pasajeros en conexión (indicador), distancias = pasos entre puertas (cuadrícula).", icon="⚠️")

if "baseline" not in st.session_state: st.session_state.baseline = None
tabs = st.tabs(["1 · Problema", "2 · Optimizar", "3 · Retraso en vivo", "4 · Circuito Qiskit real", "5 · Escalamiento", "6 · Honestidad técnica"])

with tabs[0]:
    c1, c2 = st.columns(2)
    with c1:
        st.subheader("Terminal (10 puertas)")
        fig, ax = plt.subplots(figsize=(5.2, 3.6))
        for j, (x, y) in GATE_XY.items(): ax.scatter(x, -y, s=1500, c="#eef2ff", edgecolors="#4f46e5"); ax.text(x, -y, GT[j], ha="center", va="center", weight="bold")
        ax.axis("off"); ax.set_xlim(-.6, 3.6); ax.set_ylim(-2.6, .6); st.pyplot(fig)
    with c2:
        st.subheader("Pasajeros en conexión entre vuelos (F)")
        fig, ax = plt.subplots(figsize=(5.2, 3.9)); im = ax.imshow(F0, cmap="YlOrRd")
        ax.set_xticks(range(N)); ax.set_xticklabels(FL, fontsize=8); ax.set_yticks(range(N)); ax.set_yticklabels(FL, fontsize=8)
        fig.colorbar(im, ax=ax, shrink=.8); st.pyplot(fig)
    st.markdown("**Decisión:** ¿qué puerta recibe cada vuelo? Objetivo: minimizar `Σ F·D` (pasajeros × distancia). "
                "Hay **10! = 3 628 800** asignaciones posibles. Óptimo de referencia del reto: **340**.")

with tabs[1]:
    st.subheader("Compara métodos sobre la misma instancia")
    method = st.radio("Método", ["Clásico · recocido simulado", "Cuántico · Grover Adaptive Search (22 qubits, simulado)",
                                 "Referencia · fuerza bruta (óptimo verificado)"], horizontal=True)
    seed = st.number_input("Semilla", 0, 999, 0)
    if st.button("▶ Optimizar", type="primary"):
        perms = get_perms(); c = cost_vector(F0); extra = {}
        if method.startswith("Clásico"):
            p, val, t = anneal(F0, seed=int(seed)); extra["Llamadas"] = "—"
        elif method.startswith("Cuántico"):
            k, val, calls, q, hist, t = grover_adaptive(c, seed=int(seed)); p = perms[k].tolist()
            extra = {"Qubits": q, "Llamadas al oráculo": calls, "vs fuerza bruta": f"{calls / math.factorial(N):.5%}"}
            st.session_state.hist = hist
        else:
            t0 = time.time(); k = int(c.argmin()); p = perms[k].tolist(); val = float(c[k]); t = time.time() - t0
        st.session_state.baseline = (p, val)
        a, b, d_, e = st.columns(4)
        a.metric("Costo", f"{val:.0f}"); b.metric("Brecha vs 340", f"{100 * (val - OPT) / OPT:.1f} %")
        d_.metric("Tiempo", f"{t:.2f} s"); e.metric("Factible", "Sí ✔")
        for kx, vx in extra.items(): st.write(f"**{kx}:** {vx}")
        l, r = st.columns([1.1, 1])
        with l: st.pyplot(draw_map(p, F0, f"{method.split('·')[0].strip()} · costo {val:.0f}"))
        with r:
            st.dataframe(pd.DataFrame({"Vuelo": FL, "Puerta": [GT[j] for j in p]}), hide_index=True, height=380)
        if method.startswith("Cuántico") and "hist" in st.session_state:
            h = np.array(st.session_state.hist); fig, ax = plt.subplots(figsize=(6, 2.6))
            ax.step(h[:, 0], h[:, 1], where="post", c="#4f46e5"); ax.axhline(OPT, ls="--", c="g", label="óptimo 340")
            ax.set_xlabel("llamadas acumuladas al oráculo"); ax.set_ylabel("mejor costo"); ax.legend(); st.pyplot(fig)
    st.divider()
    if st.button("📊 Tabla comparativa (5 semillas cada método)"):
        c = cost_vector(F0); rows = []
        for s in range(5):
            p, v, t = anneal(F0, seed=s); rows.append(["Recocido simulado", s, v, f"{100 * (v - OPT) / OPT:.1f}%", f"{t:.2f}", "—"])
            k, v, calls, q, _, t = grover_adaptive(c, seed=s); rows.append(["Grover Adaptive (22 q)", s, v, f"{100 * (v - OPT) / OPT:.1f}%", f"{t:.2f}", calls])
        st.dataframe(pd.DataFrame(rows, columns=["Método", "Semilla", "Costo", "Gap", "Tiempo (s)", "Llamadas oráculo"]), hide_index=True)
        st.caption("Gap calculado solo sobre soluciones válidas (todas lo son por construcción). El tiempo del cuántico es de simulación en CPU.")

with tabs[2]:
    st.subheader("Un vuelo se retrasa → los pasajeros en conexión cambian → reasignamos")
    v = st.selectbox("Vuelo afectado", range(N), index=9, format_func=lambda i: FL[i]); f = st.slider("Aumento de pasajeros en conexión (×)", 1.0, 3.0, 3.0, 0.1)
    if st.button("🔁 Reoptimizar"):
        F1 = F0.copy(); F1[v, :] *= f; F1[:, v] *= f
        c0, c1 = cost_vector(F0), cost_vector(F1); perms = get_perms()
        p0 = perms[int(c0.argmin())].tolist()                      # asignación óptima antes
        keep = cost_of(p0, F1)                                     # si NO reasignamos
        k, val, calls, q, _, t = grover_adaptive(c1, seed=1); p1 = perms[k].tolist()
        a, b, d_ = st.columns(3); a.metric("Costo si no se reasigna", f"{keep:.0f}")
        b.metric("Costo reoptimizado (Grover)", f"{val:.0f}", f"{val - keep:+.0f}"); d_.metric("Vuelos que cambian de puerta", sum(x != y for x, y in zip(p0, p1)))
        l, r = st.columns(2)
        with l: st.pyplot(draw_map(p0, F1, "Antes (sin reasignar)"))
        with r: st.pyplot(draw_map(p1, F1, "Después (reoptimizado)"))
        st.caption(f"Reoptimizado con {calls} llamadas al oráculo de {math.factorial(N):,} posibles. Unidades = pasajeros·pasos (supuesto, no medición).")

with tabs[3]:
    st.subheader("Circuito real de Qiskit (instancias pequeñas)")
    st.write("Usa las primeras *n* filas/columnas del reto. Oráculo = `DiagonalGate`, amplificación = `GroverOperator`; ejecutado con `StatevectorSampler` (apto para hardware IBM).")
    n = st.selectbox("Tamaño n", [3, 4, 5], index=1)
    if st.button("▶ Ejecutar circuito"):
        from gas_qap import gas_qiskit_demo
        with st.spinner("Construyendo y ejecutando…"): r = gas_qiskit_demo(n)
        st.json({"n": r["n"], "qubits": r["qubits"], "soluciones óptimas marcadas": r["marcadas"], "iteraciones de Grover": r["iteraciones"],
                 "probabilidad de éxito": r["prob_exito"], "profundidad (decompuesto)": r["profundidad"]})
        st.write("Resultados más frecuentes (bitstring = índice de permutación):", r["top"])
        st.caption("Óptimos de control del reto: n=3 → 24, n=4 → 32.")

with tabs[4]:
    st.subheader("¿Hasta dónde escala? (y cuándo deja de convenir)")
    rows = []
    for n_ in range(3, 15):
        nf = math.factorial(n_); q = math.ceil(math.log2(nf)); mem = 16 * 2 ** q
        rows.append(dict(N=n_, **{"Permutaciones": f"{nf:,}", "Qubits (rango)": q, "Qubits (one-hot N²)": n_ * n_, "Memoria statevector": f"{mem / 2**30:.3g} GiB" if mem >= 2**30 else f"{mem / 2**20:.3g} MiB",
                  "Llamadas Grover ≈ π/4·√(2^q)": f"{math.pi / 4 * math.sqrt(2 ** q):,.0f}", "Cabe en un portátil (≤16 GiB)": "✔" if mem <= 16 * 2**30 else "✘"}))
    st.dataframe(pd.DataFrame(rows), hide_index=True, width='stretch')
    st.markdown("- La codificación por **rango** necesita `⌈log₂ N!⌉` qubits en vez de `N²`: N=14 → 37 qubits (vs 196).\n"
                "- Pero simular 37 qubits requiere ~2 TB: **en un portátil el método deja de ser viable a partir de N≈12**. En hardware tolerante a fallos, "
                "Grover daría una mejora cuadrática en consultas sobre la enumeración clásica.\n"
                "- Heurísticas clásicas siguen siendo mejores en la práctica para estos tamaños.")

with tabs[5]:
    st.subheader("Qué corre dónde (transparencia para el jurado)")
    st.table(pd.DataFrame({"Parte": ["Lectura de datos del MPS / reconstrucción de F y D", "Tabla de costos de las 10! asignaciones (oráculo)", "Grover N=3,4,5",
                                     "Grover N=10 (22 qubits)", "Recocido simulado, fuerza bruta"],
                           "Dónde": ["Clásico (Python)", "Clásico (NumPy), precalculada", "Circuito Qiskit real (DiagonalGate + GroverOperator), simulado",
                                     "Simulación exacta del algoritmo (fórmula del subespacio de 2 dimensiones)", "Clásico"]}))
    st.info("No afirmamos ventaja cuántica: el recocido simulado ya alcanza 340 en menos de 1 s. Este MVP mide qué funciona, qué no y por qué.")
