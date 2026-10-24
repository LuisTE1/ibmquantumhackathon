"""Verifica el núcleo cuántico del juego web: Qiskit real (api/_qrun.py), el simulador local (js/sim.js) y el handler."""
import itertools
import json
import shutil
import subprocess
import sys
from pathlib import Path

import pytest

WEB = Path(__file__).resolve().parent.parent / "web"
sys.path.insert(0, str(WEB / "api"))
from _qrun import run_circuit  # noqa: E402

SECUENCIAS = [list(s) for n in range(0, 5) for s in itertools.product("hx", repeat=n)]


def test_qiskit_probabilidades_conocidas():
    assert run_circuit(["h"], 10, 0)["probs"] == {"0": 0.5, "1": 0.5}
    assert run_circuit(["h", "h"], 10, 0)["probs"] == {"0": 1.0, "1": 0.0}   # la segunda H revierte la primera
    assert run_circuit(["h", "x"], 10, 0)["probs"] == {"0": 0.5, "1": 0.5}
    assert run_circuit(["x"], 10, 0)["probs"] == {"0": 0.0, "1": 1.0}        # X intercambia 0 y 1
    assert run_circuit([], 10, 0)["probs"] == {"0": 1.0, "1": 0.0}


def test_conteos_validos_y_repetibles():
    r = run_circuit(["h"], 10, 0)
    assert r["counts"] == {"0": 3, "1": 7} and r["counts"] == run_circuit(["h"], 10, 0)["counts"]
    assert run_circuit(["h", "h"], 50, 3)["counts"] == {"0": 50, "1": 0}
    assert run_circuit(["x"], 50, 3)["counts"] == {"0": 0, "1": 50}


@pytest.mark.parametrize("gates,shots", [(["z"], 10), (["h"] * 9, 10), (["h"], 0), (["h"], 5000), ("h", 10)])
def test_entradas_invalidas(gates, shots):
    with pytest.raises(ValueError):
        run_circuit(gates, shots, 0)


@pytest.mark.skipif(shutil.which("node") is None, reason="node no disponible")
def test_simulador_js_coincide_con_qiskit():
    js = (
        "const s=require(process.argv[1]);const seqs=JSON.parse(process.argv[2]);"
        "console.log(JSON.stringify(seqs.map(g=>s.probs(g))));"
    )
    out = subprocess.run(["node", "-e", js, str(WEB / "public" / "js" / "sim.js"), json.dumps(SECUENCIAS)],
                         capture_output=True, text=True, check=True).stdout
    js_probs = json.loads(out)
    for gates, pj in zip(SECUENCIAS, js_probs):
        pq = run_circuit(gates, 1, 0)["probs"]
        assert abs(pj["0"] - pq["0"]) < 1e-9 and abs(pj["1"] - pq["1"]) < 1e-9, gates


def test_handler_http_contrato():
    from http.server import HTTPServer
    import threading
    import urllib.request
    from run import handler

    srv = HTTPServer(("127.0.0.1", 0), handler)
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    url = f"http://127.0.0.1:{srv.server_port}/api/run"
    try:
        req = urllib.request.Request(url, data=json.dumps({"gates": ["h", "h"], "shots": 20, "seed": 1}).encode(),
                                     headers={"Content-Type": "application/json"})
        body = json.loads(urllib.request.urlopen(req).read())
        assert body["source"] == "qiskit" and body["counts"] == {"0": 20, "1": 0}
        bad = urllib.request.Request(url, data=json.dumps({"gates": ["z"]}).encode())
        with pytest.raises(urllib.error.HTTPError) as e:
            urllib.request.urlopen(bad)
        assert e.value.code == 400
    finally:
        srv.shutdown()

