"""Busca una semilla que dé exactamente `target_ones` unos en `shots` mediciones de la moneda."""
from .circuits import coin_counts


def find_seed(target_ones: int = 7, shots: int = 10, max_seed: int = 1000) -> int:
    for s in range(max_seed):
        if coin_counts(shots, s)["1"] == target_ones:
            return s
    raise ValueError("no se encontró semilla")


if __name__ == "__main__":
    print("primera semilla:", find_seed())
    print("de las primeras 200 sirven:", sum(coin_counts(10, s)["1"] == 7 for s in range(200)))
