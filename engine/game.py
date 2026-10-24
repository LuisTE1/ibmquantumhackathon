"""Lógica del juego (sin interfaz). Ver CONTRATO.md, sección engine/game.py."""
import json
import math
from pathlib import Path

from .circuits import coin_counts, rx_counts
from .stats import loss, p_value_at_least, prob_one

ROOT = Path(__file__).resolve().parent.parent
EVIDENCE = ("false_statement", "present_at_change_time")


def _load(path: str) -> dict:
    p = Path(path)
    p = p if p.is_absolute() else ROOT / p
    return json.loads(p.read_text(encoding="utf-8"))


def load_case(path: str = "cases/caso1.json") -> dict:
    return _load(path)


def load_glossary(path: str = "cases/glossary.json") -> dict:
    return _load(path)


def load_quiz(path: str = "cases/quiz.json") -> dict:
    return _load(path)


def evidence_table(case: dict) -> list:
    changed = case["incident"]["config_changed_at"]
    return [
        {
            "id": s["id"], "name": s["name"], "role": s["role"], "access": s["access"],
            "statement": s["statement"], "statement_true": s["statement_true"],
            "present_at_change": s["access"] == changed,
        }
        for s in case["suspects"]
    ]


def coin_evidence(seed: int = 0, shots: int = 10) -> dict:
    """PRUEBA 1. p_value = P(al menos k resultados iguales | moneda justa), con k = max(unos, ceros)."""
    counts = coin_counts(shots, seed)
    ones, n = counts["1"], shots
    k = max(ones, n - ones)
    p = p_value_at_least(k, n, 0.5)
    enough = p < 0.05
    msg = (
        f"Salieron {ones} unos y {n - ones} ceros. Con una moneda justa, obtener {k} o más resultados iguales "
        f"ocurre el {p * 100:.1f} % de las veces. "
        + ("Eso es muy raro: hay motivos para sospechar una alteración." if enough
           else "Eso pasa con frecuencia por puro azar: este resultado, por sí solo, NO basta para acusar.")
    )
    return {"counts": counts, "ones": ones, "n": n, "p_value": p, "enough_to_accuse": enough, "message": msg}


def experiment_attempt(theta_deg: float, shots: int = 100, seed: int = 0, target_p: float = 0.75) -> dict:
    """PRUEBA 2: mide el circuito rx(theta) y compara con la probabilidad objetivo."""
    counts = rx_counts(theta_deg, shots, seed)
    p_obs = counts["1"] / shots
    l = loss(p_obs, target_p)
    close = abs(p_obs - target_p) <= 0.05
    msg = (
        f"Con θ = {theta_deg:.0f}° salió 1 en el {p_obs * 100:.0f} % de las {shots} mediciones (objetivo: {target_p * 100:.0f} %). "
        + ("¡Reconstruiste la configuración del incidente!" if close else "Todavía no coincide: ajusta la perilla.")
    )
    return {"counts": counts, "p_obs": p_obs, "p_target": target_p, "loss": l, "close": close, "message": msg}


def gradient_hint(theta_deg: float, target_p: float = 0.75, lr: float = 2.0) -> dict:
    """Pista del Cuy: un paso de descenso de gradiente con gradiente ANALÍTICO (sin ruido de muestreo).
    p = sin²(θ/2); dp/dθ = ½·sin θ; L = (p − p*)²; dL/dθ = (p − p*)·sin θ (θ en radianes)."""
    p = prob_one(theta_deg)
    th = math.radians(theta_deg)
    grad = (p - target_p) * math.sin(th)
    if abs(p - target_p) <= 0.03:
        return {"gradient": grad, "suggested_theta_deg": theta_deg, "direction": "ya estás cerca",
                "message": "¡Estás muy cerca de la probabilidad objetivo! Mide para confirmarlo."}
    if abs(grad) < 1e-3:  # gradiente casi cero (θ cerca de 0° o 180°): empujón de 15°
        new = theta_deg + (15.0 if p < target_p else -15.0)
    else:
        new = theta_deg - math.degrees(lr * grad)
    new = max(0.0, min(180.0, new))
    direction = "subir" if new > theta_deg + 1 else ("bajar" if new < theta_deg - 1 else "ya estás cerca")
    msg = (f"Con θ = {theta_deg:.0f}° la probabilidad teórica de 1 es {p * 100:.0f} % y el objetivo es {target_p * 100:.0f} %. "
           f"El gradiente dice: {direction} el ángulo hasta ≈ {new:.0f}°. Así se entrena un circuito: paso a paso, bajando el error.")
    return {"gradient": grad, "suggested_theta_deg": new, "direction": direction, "message": msg}


def statement_is_true(case: dict, suspect_id: str) -> bool:
    return next(s["statement_true"] for s in case["suspects"] if s["id"] == suspect_id)


def accuse(case: dict, suspect_id: str, evidence: list) -> dict:
    """PRUEBA FINAL: elegir sospechoso Y la evidencia que lo sostiene."""
    rows = {r["id"]: r for r in evidence_table(case)}
    culprit = case["solution"]["culprit"]
    chosen = set(evidence)
    if suspect_id != culprit:
        r = rows[suspect_id]
        reasons = []
        if r["statement_true"]:
            reasons.append("su declaración es verdadera")
        if not r["present_at_change"]:
            reasons.append(f"no estaba en la sala a las {case['incident']['config_changed_at']} (entró a las {r['access']})")
        why = " y ".join(reasons) or "las evidencias no lo señalan"
        return {"correct": False, "complete": False,
                "feedback": f"{r['name']} no es la responsable: {why}. Revisa de nuevo las evidencias."}
    name = rows[culprit]["name"]
    missing = [e for e in EVIDENCE if e not in chosen]
    wrong = [e for e in chosen if e not in EVIDENCE]
    if missing or wrong:
        labels = {"false_statement": "su declaración falsa", "present_at_change_time": "que estaba en la sala cuando cambió la configuración"}
        extra = f" Falta señalar: {', '.join(labels[m] for m in missing)}." if missing else ""
        return {"correct": True, "complete": False,
                "feedback": f"¡{name} es la responsable! Pero una pista sola no basta para acusar.{extra}"}
    return {"correct": True, "complete": True,
            "feedback": f"¡Caso resuelto! {name} hizo una declaración falsa y estaba en la sala a las {case['incident']['config_changed_at']}, "
                        f"cuando se cambió la configuración. Ambas pruebas se refuerzan."}
