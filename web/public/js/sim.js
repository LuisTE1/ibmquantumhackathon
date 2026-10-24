/* Simulador local de 1 qubit (respaldo sin conexión). Se verifica contra Qiskit en tests/test_web.py */
(function (root) {
  const S2 = Math.SQRT1_2;
  const GATES = {
    h: (a, b) => [[S2 * (a[0] + b[0]), S2 * (a[1] + b[1])], [S2 * (a[0] - b[0]), S2 * (a[1] - b[1])]],
    x: (a, b) => [b, a],
  };
  function probs(gates) {
    let a = [1, 0], b = [0, 0]; // amplitudes (re, im) de |0> y |1>
    for (const g of gates) {
      if (!GATES[g]) throw new Error("compuerta no soportada: " + g);
      [a, b] = GATES[g](a, b);
    }
    const p0 = a[0] * a[0] + a[1] * a[1], p1 = b[0] * b[0] + b[1] * b[1];
    return { "0": Math.round(p0 * 1e10) / 1e10, "1": Math.round(p1 * 1e10) / 1e10 };
  }
  function rng(seed) { // mulberry32
    let t = seed >>> 0;
    return function () { t += 0x6D2B79F5; let r = Math.imul(t ^ (t >>> 15), 1 | t); r ^= r + Math.imul(r ^ (r >>> 7), 61 | r); return ((r ^ (r >>> 14)) >>> 0) / 4294967296; };
  }
  function run(gates, shots, seed) {
    const p = probs(gates), r = rng(seed || 0);
    let ones = 0;
    for (let i = 0; i < shots; i++) if (r() < p["1"]) ones++;
    return { counts: { "0": shots - ones, "1": ones }, probs: p, source: "local" };
  }
  const api = { probs, run };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.QSim = api;
})(typeof window !== "undefined" ? window : globalThis);
