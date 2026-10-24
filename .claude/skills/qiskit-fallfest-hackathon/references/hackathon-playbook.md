# Playbook: Quantum Hackathon & CTF (Stage 3)

Fechas: 24 oct (OPEN PUCP) y 25 oct (NTT DATA). El formato exacto de retos y reglas no está publicado en la web; confirmar con los organizadores (Luma / canal oficial).

## Flujo recomendado
1. **Leer el reto dos veces**; anotar entradas, salida esperada, límite de qubits/shots/profundidad y cómo se valida (¿cadena de bits? ¿circuito? ¿estadística?).
2. **Prototipo mínimo en simulador** (`StatevectorSampler` / `AerSimulator`) con un caso pequeño; verificar con `Statevector` antes de escalar.
3. **Comprobar endianness** con un caso asimétrico (p. ej. `x(0)` en 2 qubits → `'01'`).
4. Optimizar solo después de que funcione: `transpile(..., optimization_level=3)`, reducir profundidad, reutilizar patrones (Bell, QFT, Grover).
5. Guardar cada versión funcional (git o archivos numerados); tiempo limitado → entregar algo que corra.

## Plantillas de ideas frecuentes en retos introductorios
- **Entrelazamiento / Bell, GHZ**: `h(0)` + cadena de `cx`.
- **Teleportación, superdense coding** (taller "Entanglement and Protocols", Kelvin Cahuana): ver `materials/text/` de ese tema si hay material; si no, derivar con Bell + medidas + correcciones X/Z condicionales (`with qc.if_test((creg, 1)): qc.x(2)`).
- **Interferencia con H·Z·H = X**; **QFT** (taller de María Pareja, sin material publicado).
- **Grover / amplitud**: oráculo de fase + difusor; iteraciones ≈ π/4·√N.
- **Decodificar bits / criptografía cuántica (CTF)**: BB84 = elegir base Z o X con `h`, medir, comparar bases.
- **Híbrido cuántico + IA clásica**: ver la nota "Quantum computers and large language models" (circuitos poco profundos vs LLM) en `materials/text/quantum-computers-and-large-language-models__regalos.txt`.

## Checklist de entrega
- [ ] Código corre de cero (`pip install` documentado).
- [ ] Semilla fija (`seed_simulator`) para resultados reproducibles.
- [ ] Explicación breve + diagrama (`qc.draw("mpl")`) incluido.
- [ ] Sin tokens ni credenciales en el repositorio.
