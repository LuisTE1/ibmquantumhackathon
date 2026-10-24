import pytest

from engine import circuits
from engine.circuits import coin_counts, rx_counts
from engine.stats import prob_one


def test_moneda_semilla_0_da_7_y_3():
    assert coin_counts(10, 0) == {"0": 3, "1": 7}
    assert coin_counts(10, 0) == coin_counts(10, 0)


@pytest.mark.parametrize("shots", [1, 2, 10, 100])
def test_claves_y_suma(shots):
    c = coin_counts(shots, 5)
    assert set(c) == {"0", "1"} and c["0"] + c["1"] == shots
    r = rx_counts(90, shots, 5)
    assert set(r) == {"0", "1"} and r["0"] + r["1"] == shots


def test_moneda_converge_a_50():
    assert abs(coin_counts(20000, 1)["1"] / 20000 - 0.5) < 0.02


def test_rx_extremos():
    assert rx_counts(0, 500, 1)["1"] == 0
    assert rx_counts(180, 500, 1)["1"] == 500


def test_rx_120_converge_a_75():
    assert abs(rx_counts(120, 20000, 1)["1"] / 20000 - prob_one(120)) < 0.02


def test_shots_invalidos():
    with pytest.raises(ValueError):
        coin_counts(0, 0)
    with pytest.raises(ValueError):
        rx_counts(10, -3, 0)


def test_respaldo_numpy_misma_interfaz(monkeypatch):
    monkeypatch.setattr(circuits, "USE_QISKIT", False)
    c = circuits.coin_counts(1000, 3)
    assert set(c) == {"0", "1"} and c["0"] + c["1"] == 1000
    assert abs(circuits.rx_counts(120, 20000, 1)["1"] / 20000 - 0.75) < 0.02
