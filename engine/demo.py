"""Recorre el caso completo en la terminal:  python -m engine.demo"""
from . import circuits, game


def main():
    case = game.load_case()
    print("=== CASO:", case["title"], "===\n")
    print("EVIDENCIAS")
    for r in game.evidence_table(case):
        print(f" - {r['name']} ({r['role']}) entró {r['access']} | presente a las {case['incident']['config_changed_at']}: "
              f"{r['present_at_change']} | declaración verdadera: {r['statement_true']}")
    print("\nPRUEBA 1: la moneda sospechosa")
    ev = game.coin_evidence(seed=0, shots=10)
    print(" ", ev["counts"], "p-valor =", round(ev["p_value"], 4), "| basta para acusar:", ev["enough_to_accuse"])
    print(" ", ev["message"])
    print("\nPRUEBA 2: reconstruir el experimento (la pista del Cuy aplicada paso a paso)")
    theta = 40.0
    for i in range(1, 7):
        a = game.experiment_attempt(theta, shots=100, seed=i)
        print(f"  intento {i}: θ={theta:6.1f}° -> p_obs={a['p_obs']:.2f} error={a['loss']:.4f} cerca={a['close']}")
        if a["close"]:
            print("  ", a["message"]); break
        theta = game.gradient_hint(theta)["suggested_theta_deg"]
    print("\nPRUEBA 3: ¿qué declaración es falsa?")
    for s in case["suspects"]:
        print(f"  {s['name']}: {'verdadera' if game.statement_is_true(case, s['id']) else 'FALSA'}")
    print("\nACUSACIÓN")
    for sid, ev_ in [("tito", ["false_statement"]), ("lola", ["false_statement"]),
                     ("lola", ["false_statement", "present_at_change_time"])]:
        print(f"  {sid} + {ev_} ->", game.accuse(case, sid, ev_)["feedback"])
    print("\nCircuito de la moneda:\n" + circuits.circuit_diagram("coin"))
    print("\nFinal:", case["hook"])


if __name__ == "__main__":
    main()
