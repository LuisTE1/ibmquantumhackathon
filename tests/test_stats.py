from engine.stats import p_value_at_least, prob_one

def test_p_value_7_de_10():
    assert abs(p_value_at_least(7, 10) - 176 / 1024) < 1e-12

def test_prob_one_120_grados():
    assert abs(prob_one(120) - 0.75) < 1e-12
