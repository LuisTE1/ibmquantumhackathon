from engine import game


def test_solucion_unica_es_lola():
    case = game.load_case()
    culpables = [r["id"] for r in game.evidence_table(case) if not r["statement_true"] and r["present_at_change"]]
    assert culpables == ["lola"] == [case["solution"]["culprit"]]


def test_prueba1_p_valor_y_mensaje():
    ev = game.coin_evidence(seed=0, shots=10)
    assert ev["ones"] == 7 and abs(ev["p_value"] - 176 / 1024) < 1e-12
    assert ev["enough_to_accuse"] is False and "NO basta" in ev["message"]


def test_prueba2_cerca_y_lejos():
    assert game.experiment_attempt(120, 2000, 1)["close"] is True
    assert game.experiment_attempt(20, 2000, 1)["close"] is False


def test_gradient_hint_direccion():
    assert game.gradient_hint(40)["direction"] == "subir"
    assert game.gradient_hint(170)["direction"] == "bajar"
    assert game.gradient_hint(120)["direction"] == "ya estás cerca"
    assert game.gradient_hint(0)["suggested_theta_deg"] > 0   # no se queda atascado en gradiente 0
    assert game.gradient_hint(180)["suggested_theta_deg"] < 180


def test_pista_converge():
    theta = 10.0
    for _ in range(12):
        theta = game.gradient_hint(theta)["suggested_theta_deg"]
    assert abs(game.experiment_attempt(theta, 5000, 2)["p_obs"] - 0.75) <= 0.05


def test_acusaciones():
    case = game.load_case()
    both = ["false_statement", "present_at_change_time"]
    assert game.accuse(case, "lola", both) == {**game.accuse(case, "lola", both), "correct": True, "complete": True}
    inc = game.accuse(case, "lola", ["false_statement"])
    assert inc["correct"] and not inc["complete"] and "Falta" in inc["feedback"]
    for sid in ("tito", "cora"):
        r = game.accuse(case, sid, both)
        assert not r["correct"] and "no es la responsable" in r["feedback"]


def test_statement_is_true():
    case = game.load_case()
    assert game.statement_is_true(case, "lola") is False
    assert game.statement_is_true(case, "tito") is True
