# Prompts del motor (Persona 2) — para usar con Claude Code y Codex en la MISMA carpeta

Carpeta: C:\Users\luist\Desktop\proyecto_hackaton_IBM · Entorno: `C:\Users\luist\qiskit-env\Scripts\python.exe` (qiskit 2.6.1)
Para dividir el trabajo sin pisarse: **Claude = `engine/circuits.py`**, **Codex = `tests/test_circuits.py` + `engine/find_seed.py`**. Ninguno toca `app.py`, `cases/` ni `docs/`.

---
## PROMPT COMÚN (pégalo primero en ambos)
Contexto: proyecto "Quantum Files", un juego educativo en Streamlit. Yo (Persona 2) construyo SOLO el motor: carpetas `engine/` y `tests/`. Lee `CONTRATO.md` y `engine/stats.py` (ya implementado y correcto) antes de empezar. No cambies las firmas del contrato, no edites `app.py`, `cases/`, `docs/` ni `engine/stats.py`. Usa Python 3.12 y Qiskit 2.x (instalado 2.6.1). Ejecuta con `C:\Users\luist\qiskit-env\Scripts\python.exe` y prueba con `python -m pytest -q`. Otro agente trabaja a la vez en esta carpeta: solo edita los archivos que te asigno. No hagas `git commit` ni `git push`; avísame cuando termines.
Reglas de Qiskit 2.x: no uses `execute()`, `qiskit.Aer`, `BackendV1`, `opflow` ni `QuantumInstance`. Usa `from qiskit.primitives import StatevectorSampler`. Patrón verificado que funciona:
```python
qc = QuantumCircuit(1, 1); qc.h(0); qc.measure(0, 0)
c = StatevectorSampler(seed=seed).run([qc], shots=shots).result()[0].data.c.get_counts()
counts = {"0": c.get("0", 0), "1": c.get("1", 0)}   # rellenar con 0 las claves ausentes
```
Datos ya verificados: con h, 10 shots y seed=0 salen exactamente 7 unos y 3 ceros (resultado repetible). Con rx(120°) y seed=1: 77 unos de 100 y 1506 de 2000 (≈75 %).

---
## PROMPT PARA CLAUDE → `engine/circuits.py`
Reemplaza el stub de `engine/circuits.py` por circuitos reales de Qiskit manteniendo EXACTAMENTE estas firmas:
- `coin_counts(shots: int, seed: int) -> dict`: circuito de 1 qubit con `h` y medición; devuelve `{"0": n0, "1": n1}` (siempre ambas claves, enteros; n0 + n1 == shots).
- `rx_counts(theta_deg: float, shots: int, seed: int) -> dict`: circuito con `rx(theta en radianes)` y medición; mismo formato.
- `CODE_COIN` y `CODE_RX`: strings con el código Qiskit REAL y mínimo que el jugador verá, idéntico al que ejecutan las funciones (con imports y un comentario corto en español por línea clave, apto para principiantes).
- Extra opcional (sin romper nada): `circuit_diagram(kind: str, theta_deg: float = 0.0) -> str` que devuelva `qc.draw("text")` como texto para mostrar el circuito.
Validaciones: `shots >= 1` (lanza ValueError si no); `theta_deg` cualquier real. Docstrings breves en español. Código simple y legible. Al terminar, ejecuta una verificación rápida (coin_counts(10, 0) debe dar {"0": 3, "1": 7}; rx_counts(120, 2000, 1)["1"] debe estar entre 1450 y 1550) y reporta el resultado.

---
## PROMPT PARA CODEX → `tests/test_circuits.py` y `engine/find_seed.py`
1) Crea `tests/test_circuits.py` con pytest (importa desde `engine.circuits` y `engine.stats`). Pruebas: (a) `coin_counts(10, 0)` == `{"0": 3, "1": 7}` y es repetible con la misma semilla; (b) n0 + n1 == shots para varios shots y ambas claves siempre presentes (incluso con shots=1); (c) con 20000 shots, la frecuencia de unos de `coin_counts` está en 0.5 ± 0.02; (d) `rx_counts(0, ...)` da 0 unos y `rx_counts(180, ...)` da todos unos; (e) con 20000 shots, `rx_counts(120, ...)` tiene frecuencia de unos en 0.75 ± 0.02, comparada con `prob_one(120)`; (f) `p_value_at_least(7, 10)` ≈ 176/1024; (g) `shots=0` lanza ValueError; (h) solución única del caso: lee `cases/caso1.json` y comprueba que exactamente un sospechoso cumple (declaración falsa Y acceso == hora del cambio de configuración) y que es "lola".
2) Crea `engine/find_seed.py`: función `find_seed(target_ones=7, shots=10, max_seed=1000) -> int` que busque la primera semilla para la que `coin_counts(shots, seed)["1"] == target_ones`, más un bloque `if __name__ == "__main__":` que imprima la semilla encontrada y cuántas de las primeras 200 sirven (esperado: semilla 0 y 31 de 200).
Ejecuta `python -m pytest -q`: las pruebas (a)–(e) fallarán hasta que Claude termine `circuits.py`; espera a que ese archivo deje de ser un stub (puedes revisar `git status` o el contenido) y vuelve a ejecutar hasta que todo pase. Reporta el resultado.

