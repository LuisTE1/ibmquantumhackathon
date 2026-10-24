# Contrato entre partes (no cambiar firmas sin avisar al grupo)

## Quién edita qué (para evitar conflictos de Git)
| Persona | Dueño de estos archivos | No tocar |
|---|---|---|
| A · Interfaz y Cuy | `app.py`, `assets/` | `engine/`, `cases/`, `docs/` |
| B · Motor Qiskit | `engine/`, `tests/` | `app.py`, `cases/` |
| C · Contenido, quiz y docs | `cases/`, `docs/`, `README.md`, PPT, video | `engine/`, `app.py` |
Si necesitas algo de otra parte: pídelo por WhatsApp o crea el archivo con otro nombre y avisa.

## Funciones que B entrega (A las usa desde el minuto 1 con datos falsos)
engine/circuits.py
- coin_counts(shots: int, seed: int) -> dict        # circuito h + medir.   {"0": n0, "1": n1}
- rx_counts(theta_deg: float, shots: int, seed: int) -> dict   # circuito rx(theta) + medir.  {"0": n0, "1": n1}
- CODE_COIN, CODE_RX: str                           # código Qiskit mostrado al jugador (texto)
engine/stats.py  (ya implementado)
- p_value_at_least(k: int, n: int, p: float = 0.5) -> float   # P(X >= k), p. ej. (7,10) -> 0.1719
- prob_one(theta_deg: float) -> float                          # sin^2(theta/2)
- loss(p_obs: float, p_target: float) -> float                 # (p_obs - p_target)^2

## Datos que C entrega (A los lee)
cases/caso1.json  -> sospechosos, accesos, declaraciones, solución. (ya hay un borrador)
cases/glossary.json -> {"termino": "definicion"}
cases/quiz.json -> {"pre": [{"q": "...", "options": [...], "answer": 0}], "post": [...]}
