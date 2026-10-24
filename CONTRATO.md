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

## engine/game.py — lógica del juego (sin interfaz). La compañera de UI usa SOLO estas funciones
Todas devuelven diccionarios simples (fáciles de mostrar en Streamlit). Las rutas son relativas a la raíz del proyecto.
- load_case(path="cases/caso1.json") -> dict
- load_glossary(path="cases/glossary.json") -> dict ; load_quiz(path="cases/quiz.json") -> dict
- evidence_table(case) -> list[dict]       # una fila por sospechoso: {id, name, role, access, statement, statement_true, present_at_change}
- coin_evidence(seed=0, shots=10) -> dict   # {counts, ones, n, p_value, enough_to_accuse, message}   (PRUEBA 1; p_value = P(X>=ones | p=0.5); enough_to_accuse = p_value < 0.05)
- experiment_attempt(theta_deg, shots=100, seed=0, target_p=0.75) -> dict   # {counts, p_obs, p_target, loss, close, message}   (PRUEBA 2; close = |p_obs - p_target| <= 0.05)
- gradient_hint(theta_deg, target_p=0.75, lr=...) -> dict   # {gradient, suggested_theta_deg, direction, message}  (pista del Cuy; gradiente ANALÍTICO de loss respecto de theta, sin ruido de muestreo; direction = "subir" | "bajar" | "ya estás cerca")
- statement_is_true(case, suspect_id) -> bool                 # (PRUEBA 3)
- accuse(case, suspect_id, evidence: list[str]) -> dict       # {correct, complete, feedback}; evidence ⊆ {"false_statement", "present_at_change_time"}; correct = culpable acertado; complete = correct y evidencia == ambas; feedback en español explica qué falta o por qué el sospechoso elegido es inocente
engine/demo.py -> python -m engine.demo recorre el caso completo en la terminal (para ver el funcionamiento sin interfaz).
