"""Quantum Files — El patrón invisible · Juego de detectives con Inspector Cuy.
Ejecutar:  streamlit run app.py
"""
import csv
import datetime
import math
import re
import uuid
from pathlib import Path

import pandas as pd
import streamlit as st

from engine import circuits, game

st.set_page_config(page_title="Quantum Files · Inspector Cuy", page_icon="🐹", layout="centered")

CASE = game.load_case()
GLOSS = game.load_glossary()
QUIZ = game.load_quiz()
ROWS = game.evidence_table(CASE)
EMOJI = {"lola": "🦙", "tito": "🦌", "cora": "🦅"}
STEPS = ["Expediente", "Prueba 1 · La moneda", "Prueba 2 · El experimento", "Prueba 3 · El informe", "Acusación", "Final"]
TARGET = CASE["incident"]["altered_p"]
LOG = Path(__file__).resolve().parent / "results" / "quiz_log.csv"

st.markdown(
    """
<style>
.stApp {background: linear-gradient(180deg,#f7f0e1 0%,#efe3c8 100%);}
h1,h2,h3 {color:#4a2f1a !important; font-family: Georgia, serif;}
.cuy {display:flex; gap:14px; align-items:flex-start; margin:10px 0 18px 0;}
.cuy .avatar {font-size:54px; background:#fff7e6; border:3px solid #8a5a2b; border-radius:50%; width:78px; height:78px;
  display:flex; align-items:center; justify-content:center; flex-shrink:0;}
.cuy .bubble {background:#fffaf0; border:2px solid #8a5a2b; border-radius:16px; padding:12px 16px; color:#3b2a1a; font-size:16px;}
.card {background:#fffaf0; border:2px solid #d8c19a; border-radius:14px; padding:12px 14px; margin-bottom:10px; color:#3b2a1a;}
.psi {background:#1d1b2e; color:#e8e1ff; border-radius:14px; padding:18px; text-align:center; font-size:20px; margin-top:14px;}
.stButton>button {border-radius:10px; border:2px solid #8a5a2b; background:#fff3d6; color:#3b2a1a; font-weight:600;}
.stButton>button:hover {background:#ffe3a3; border-color:#4a2f1a; color:#3b2a1a;}
</style>
""",
    unsafe_allow_html=True,
)

S = st.session_state
S.setdefault("step", 0)
S.setdefault("sid", uuid.uuid4().hex[:8])
S.setdefault("attempts", 0)
S.setdefault("history", [])
S.setdefault("found", False)
S.setdefault("theta", 40)
S.setdefault("scores", {})
S.setdefault("p3_ok", False)
S.setdefault("solved", False)


def go(n):
    S.step = n


def cuy(msg):
    msg = re.sub(r"\*\*(.+?)\*\*", r"<b>\g<1></b>", msg)
    msg = re.sub(r"`(.+?)`", r"<code>\g<1></code>", msg)
    st.markdown(f"<div class='cuy'><div class='avatar'>🐹</div><div class='bubble'><b>Inspector Cuy:</b> {msg}</div></div>",
                unsafe_allow_html=True)


def counts_chart(counts):
    st.bar_chart(pd.DataFrame({"veces": [counts["0"], counts["1"]]}, index=["0", "1"]), height=180)


def show_code(code, kind, theta=0.0):
    with st.expander("👩‍💻 Ver el código de Qiskit que generó esta evidencia"):
        st.code(code, language="python")
        st.caption("Así se ve el circuito:")
        st.code(circuits.circuit_diagram(kind, theta), language="text")


def quiz(phase):
    qs = QUIZ[phase]
    with st.form(f"quiz_{phase}"):
        answers = [st.radio(q["q"], q["options"], index=None, key=f"{phase}_{i}") for i, q in enumerate(qs)]
        ok = st.form_submit_button("Enviar respuestas")
    if ok:
        if any(a is None for a in answers):
            st.warning("Responde las 3 preguntas.")
        else:
            score = sum(qs[i]["options"].index(a) == qs[i]["answer"] for i, a in enumerate(answers))
            S.scores[phase] = score
            LOG.parent.mkdir(exist_ok=True)
            new = not LOG.exists()
            with LOG.open("a", newline="", encoding="utf-8") as f:
                w = csv.writer(f)
                if new:
                    w.writerow(["timestamp", "sesion", "fase", "aciertos", "total"])
                w.writerow([datetime.datetime.now().isoformat(timespec="seconds"), S.sid, phase, score, len(qs)])
    if phase in S.scores:
        st.success(f"Respondiste {S.scores[phase]} de {len(qs)} bien.")


def reset():
    S.clear()


# ---------------------------------------------------------------- barra lateral
with st.sidebar:
    st.markdown("### 🔎 Progreso")
    st.progress(S.step / (len(STEPS) - 1))
    for i, name in enumerate(STEPS):
        st.write(("✅ " if i < S.step else "▶️ " if i == S.step else "⬜ ") + name)
    st.divider()
    st.caption("👤 Pensado para estudiantes (edad y frecuencia ideales: por validar en la prueba piloto)  \n⏱️ Una partida: ~5–8 min")
    if not circuits.USE_QISKIT:
        st.warning("Modo respaldo: Qiskit no disponible (se usan números aleatorios).")
    with st.expander("📖 Glosario"):
        for t, d in GLOSS.items():
            st.markdown(f"**{t}**: {d}")
    st.button("↺ Reiniciar caso", on_click=reset, key="reset")

st.title("🐹 Quantum Files")
st.caption("El patrón invisible · Caso 1: " + CASE["title"])

# ---------------------------------------------------------------- 0 · expediente
if S.step == 0:
    cuy("¡Bienvenido, detective! Soy el Inspector Cuy. Alguien alteró el experimento del laboratorio cuántico justo durante una "
        "demostración, y después falsificó su informe. Tres animales entraron a la sala. ¡Vamos a descubrir quién fue!")
    st.subheader("📁 Expediente")
    st.markdown("**Registro de accesos a la sala**")
    for r in ROWS:
        st.markdown(f"<div class='card'>{EMOJI[r['id']]} <b>{r['name']}</b> · {r['role']}<br>🕒 Entró a las <b>{r['access']}</b></div>",
                    unsafe_allow_html=True)
    st.info(f"El sistema registró un cambio de configuración a las **{CASE['incident']['config_changed_at']}**. "
            "Cada prueba te dará una pista; al final deberás acusar con **evidencia**.")
    with st.expander("📝 Antes de empezar: 3 preguntas rápidas (opcional, nos ayuda a medir cuánto se aprende)"):
        quiz("pre")
    st.button("🔎 Aceptar el caso", on_click=go, args=(1,), type="primary", key="start")

# ---------------------------------------------------------------- 1 · moneda
elif S.step == 1:
    st.header("Prueba 1 · La moneda sospechosa")
    cuy("Este experimento era una moneda justa: 50/50. Un qubit en superposición se comporta así al medirlo. "
        "Pero mira lo que salió el día del incidente...")
    guess = st.radio("**Predice antes de ver:** si salen 7 unos y 3 ceros en 10 mediciones, ¿es prueba de alteración?",
                     ["Sí, es prueba segura", "No, podría ser puro azar"], index=None, key="p1_guess")
    if st.button("🔬 Medir 10 veces", key="m1", disabled=guess is None):
        S.p1 = True
    if S.get("p1"):
        ev = game.coin_evidence(seed=0, shots=10)
        counts_chart(ev["counts"])
        st.markdown(f"**p-valor: {ev['p_value'] * 100:.1f} %**")
        (st.warning if not ev["enough_to_accuse"] else st.error)(ev["message"])
        if guess == "No, podría ser puro azar":
            st.success("¡Bien razonado! Un resultado aislado no basta para acusar.")
        else:
            st.info("Muchos piensan lo mismo, pero el p-valor dice que esto pasa con frecuencia por azar.")
        c1, c2, c3 = st.columns(3)
        c1.markdown("**Clásica**  \nUn experimento da 0 o 1 con cierta probabilidad.")
        c2.markdown("**Cuántica**  \nPreparas un qubit con `h` y al medirlo obtienes 0 o 1.")
        c3.markdown("**Puente**  \nRepetir da frecuencias que *fluctúan* alrededor de la probabilidad.")
        show_code(circuits.CODE_COIN, "coin")
        with st.expander("🧪 Modo laboratorio: repite el experimento"):
            n = st.number_input("Mediciones (shots)", 10, 2000, 10, step=10, key="lab_n")
            seed = st.number_input("Semilla", 0, 999, 1, key="lab_seed")
            r = game.coin_evidence(seed=int(seed), shots=int(n))
            st.write(f"{r['counts']} → p-valor {r['p_value'] * 100:.1f} %")
            st.caption("Cambia la semilla: ¡el resultado cambia! Con más mediciones, la frecuencia se acerca más a 50 %.")
        st.button("Siguiente prueba ➜", on_click=go, args=(2,), type="primary", key="next1")

# ---------------------------------------------------------------- 2 · reconstruir experimento
elif S.step == 2:
    st.header("Prueba 2 · Reconstruye el experimento")
    cuy(f"El registro del sistema dice que, tras el cambio, el experimento daba **1 el {TARGET * 100:.0f} % de las veces**. "
        "Tu perilla es el ángulo θ de la compuerta `rx`. Ajústala hasta reproducir esa probabilidad. "
        "¡Eso es entrenar un circuito cuántico!")
    theta = st.slider("Perilla θ (grados)", 0, 180, key="theta")
    c1, c2 = st.columns(2)
    if c1.button("🔬 Medir 100 veces", key="m2"):
        S.attempts += 1
        a = game.experiment_attempt(float(theta), shots=100, seed=100 + S.attempts, target_p=TARGET)
        S.last = a
        S.history.append({"intento": S.attempts, "error": a["loss"], "theta": theta})
        S.found = S.found or a["close"]
    if c2.button("💡 Pedir pista al Cuy", key="hint"):
        S.hint_data = game.gradient_hint(float(theta), TARGET)
    if S.get("hint_data"):
        st.info("🐹 " + S.hint_data["message"])
        st.button(f"Aplicar la pista (θ ≈ {S.hint_data['suggested_theta_deg']:.0f}°)", key="apply",
                  on_click=lambda: S.update(theta=int(round(S.hint_data["suggested_theta_deg"])), hint_data=None))
    if S.get("last"):
        a = S.last
        counts_chart(a["counts"])
        (st.success if a["close"] else st.warning)(a["message"])
        st.caption("Error = (p observada − p objetivo)². Bajarlo paso a paso es el **descenso de gradiente**.")
    if len(S.history) > 1:
        st.line_chart(pd.DataFrame(S.history).set_index("intento")["error"], height=160)
    show_code(circuits.CODE_RX, "rx", float(theta))
    if S.found or S.attempts >= 6:
        if not S.found:
            st.caption("Puedes continuar aunque no hayas llegado exacto.")
        st.button("Siguiente prueba ➜", on_click=go, args=(3,), type="primary", key="next2")

# ---------------------------------------------------------------- 3 · informe imposible
elif S.step == 3:
    st.header("Prueba 3 · El informe imposible")
    cuy("Cada sospechoso entregó una declaración. Una de ellas no puede ser cierta. "
        "Primero experimenta tú mismo con una moneda justa...")
    with st.expander("🧪 Experimento: 8 veces 10 lanzamientos de una moneda justa", expanded=True):
        runs = [circuits.coin_counts(10, 200 + i)["1"] for i in range(8)]
        st.write("Unos en cada serie de 10:", runs)
        exact5 = sum(1 for x in runs if x == 5)
        st.write(f"Exactamente 5 y 5 salió en **{exact5} de 8** series. "
                 f"(En teoría ocurre solo el {math.comb(10, 5) / 1024 * 100:.1f} % de las veces.)")
    for r in ROWS:
        st.markdown(f"<div class='card'>{EMOJI[r['id']]} <b>{r['name']}</b> dice:<br><i>“{r['statement']}”</i></div>",
                    unsafe_allow_html=True)
    pick = st.selectbox("¿Qué declaración es **falsa**?", ["— elige —"] + [r["name"] for r in ROWS], key="p3_pick")
    if st.button("Comprobar", key="check3", disabled=pick == "— elige —"):
        r = next(x for x in ROWS if x["name"] == pick)
        if not game.statement_is_true(CASE, r["id"]):
            S.p3_ok = True
            st.success(f"¡Correcto! Con una moneda 50/50, salir exactamente 5 y 5 en 10 mediciones solo ocurre "
                       f"el {math.comb(10, 5) / 1024 * 100:.1f} % de las veces, así que decir que *siempre* sale es falso.")
        else:
            st.error(f"La declaración de {r['name']} es correcta: la probabilidad no promete resultados exactos, "
                     "pero sí que las frecuencias se acercan. Busca la que se contradice con la matemática.")
    if S.p3_ok:
        st.warning("⚠️ Ojo: una declaración falsa **sola no demuestra culpabilidad**. Hay que cruzarla con otra evidencia.")
        st.button("Ir a la acusación ➜", on_click=go, args=(4,), type="primary", key="next3")

# ---------------------------------------------------------------- 4 · acusación
elif S.step == 4:
    st.header("Acusación")
    cuy("Elige a la persona responsable **y** las evidencias que sostienen tu acusación.")
    for r in ROWS:
        st.markdown(f"<div class='card'>{EMOJI[r['id']]} <b>{r['name']}</b> · entró {r['access']} · declaración "
                    f"{'✅ verdadera' if r['statement_true'] else '❌ falsa'}</div>", unsafe_allow_html=True)
    who = st.radio("¿Quién fue?", [r["id"] for r in ROWS],
                   format_func=lambda i: f"{EMOJI[i]} " + next(r["name"] for r in ROWS if r["id"] == i), index=None, key="who")
    ev = st.multiselect("Evidencias que lo sostienen", ["false_statement", "present_at_change_time"],
                        format_func=lambda e: {"false_statement": "Hizo una declaración falsa",
                                               "present_at_change_time": f"Estaba en la sala a las {CASE['incident']['config_changed_at']}"}[e],
                        key="ev")
    if st.button("⚖️ Acusar", key="accuse", disabled=who is None):
        res = game.accuse(CASE, who, ev)
        if res["complete"]:
            S.solved = True
            st.success(res["feedback"])
        elif res["correct"]:
            st.warning(res["feedback"])
        else:
            st.error(res["feedback"])
    if S.solved:
        st.balloons()
        st.button("Ver el final ➜", on_click=go, args=(5,), type="primary", key="next4")

# ---------------------------------------------------------------- 5 · final
else:
    st.header("🎉 Caso resuelto")
    cuy("¡Excelente trabajo, detective! Aprendiste que un resultado aislado no prueba nada, que las frecuencias fluctúan "
        "alrededor de la probabilidad y que entrenar un circuito es ajustar una perilla paso a paso.")
    st.markdown(f"<div class='psi'>Ψ<br>{CASE['hook']}</div>", unsafe_allow_html=True)
    st.subheader("📝 Preguntas finales")
    quiz("post")
    if "pre" in S.scores and "post" in S.scores:
        st.metric("Tus aciertos: antes → después", f"{S.scores['pre']} → {S.scores['post']}", f"{S.scores['post'] - S.scores['pre']:+d}")
    with st.expander("🔍 ¿Qué es real y qué es simulación?"):
        st.markdown("- Los circuitos son **reales de Qiskit**, pero se **simulan en un computador clásico** (no es hardware cuántico).\n"
                    "- Es un juego educativo con **1 qubit**: no afirma ninguna ventaja cuántica.\n"
                    "- Los personajes y datos del caso son **ficticios**.")
    st.button("▶ Jugar de nuevo", on_click=reset, key="again")
