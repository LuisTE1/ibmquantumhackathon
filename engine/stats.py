import math

def p_value_at_least(k: int, n: int, p: float = 0.5) -> float:
    return sum(math.comb(n, i) * p**i * (1 - p) ** (n - i) for i in range(k, n + 1))

def prob_one(theta_deg: float) -> float:
    return math.sin(math.radians(theta_deg) / 2) ** 2

def loss(p_obs: float, p_target: float) -> float:
    return (p_obs - p_target) ** 2
