# Propuesta: Jala + Qiskit — "¿Cuánto pierde el emparejamiento greedy frente al óptimo?"
Categoría: Algoritmos y aplicaciones (Quantum Hub) · Equipo de 4 · Entrega antes de las 15:00

## 1. Problema real
Jala (proyecto previo del equipo, Hack The Andes 2026) agrupa a 2–4 personas que salen del mismo lugar para compartir un taxi. Su motor genera todos los grupos factibles (desvío máximo 300 s por persona) y luego **elige grupos de forma golosa (greedy)**. Su propia documentación dice que eso es una heurística y no un óptimo global.

## 2. Qué hacemos hoy (lo nuevo)
Formulamos la elección de grupos como un problema de optimización y lo resolvemos con tres métodos, comparando contra la respuesta exacta:
- **Variables:** una por grupo candidato, x_g ∈ {0,1} (≈ 13–20 variables por lote de 8–12 personas).
- **Restricción:** cada persona está como máximo en un grupo elegido. Cada grupo ya incluye un delegado y respeta el desvío máximo.
- **Objetivo:** maximizar personas agrupadas y, a igualdad, minimizar el desvío total (QUBO con penalización λ por solapar personas).
- **Métodos:** (1) greedy de Jala, (2) exacto (enumeración de 2^K), (3) Qiskit: QAOA y/o Grover Adaptive Search con K qubits.
- **Salida:** pasajeros agrupados, desvío total, brecha vs óptimo, fracción factible, tiempo y qubits, con mapa de los grupos.

## 3. Evidencia previa (a verificar con datos propios)
Experimento rápido en 150 instancias sintéticas de 8 pasajeros (distancias planas, supuestos propios): el greedy fue peor que el óptimo en 108 casos (72 %) y dejó 126 pasajeros sin grupo que el exacto sí agrupó. Mediana: 13 opciones de grupo, es decir 13 qubits. Es un indicio, no una prueba.

## 4. Cómo puntúa (estimación nuestra, no del jurado)
| Criterio (peso) | Cómo lo cubrimos | Riesgo |
|---|---|---|
| Innovación y validación (25 %) | Problema real de Lima; medimos con datos cuánto pierde el método actual | Datos sintéticos; decirlo |
| Qiskit y pitch (25 %) | QAOA/GAS reales con ~13 qubits, circuitos y comparación | Hay que construirlo hoy |
| Reto Algoritmos (20 %) | Modelo explícito, restricciones, comparación con exacto y con greedy | — |
| Rigor y reproducibilidad (15 %) | Semillas, repo, instancias generadas por script, gap solo sobre soluciones válidas | — |
| Calidad y arquitectura (15 %) | Módulo separado con contrato JSON de entrada/salida, acoplable a Jala | No integramos en Jala (sin bun/Docker en la PC) |
Estimación: ~70–85 sobre 100, con más incertidumbre que la alternativa GateQ (~78–88), porque hay que construirlo hoy.
Honestidad: a 13 variables el exacto clásico resuelve al instante; no afirmamos ventaja cuántica, medimos qué funciona y hasta dónde escala.

## 5. Qué usamos
- Skill `qiskit-fallfest-hackathon` (rúbrica, plan por horas, tablero de avance, cheatsheet de Qiskit 2.x, código ya probado de Grover Adaptive Search y QUBO).
- MCP `qiskit` y `qiskit-docs`; entorno `qiskit-env` (qiskit 2.6.1, optimization, algorithms, streamlit); app Streamlit como base.

## 6. Reparto y cronograma (hasta 14:45)
| Persona | Tarea |
|---|---|
| 1 · Producto | Historia de Jala, capturas, PPT, pitch de 3 min |
| 2 · Datos | Generador de pasajeros y grupos candidatos con las reglas de Jala; greedy |
| 3 · Cuántico | QUBO, exacto, QAOA/GAS (con Claude + skill) |
| 4 · App y entrega | Streamlit, README, repo GitHub, video, subida al portal |

12:30 decidir y repartir · 13:00 generador + greedy + exacto · 13:45 Qiskit funcionando · 14:15 app y comparación · 14:30 PPT y video · 14:45 subir.
**Punto de control 13:15:** si no hay avance claro o los organizadores no aprueban, cambiamos a GateQ (QAP10), que ya está listo.

## 7. Preguntas para el mentor / organizadores
1. ¿Se puede usar un proyecto previo (Jala) como base si el módulo cuántico se construye hoy y lo declaramos?
2. ¿Se permite usar IA generativa para programar?
3. ¿Un uso simulado de Qiskit con exacto clásico disponible cuenta como "pertinente"?
4. ¿Hay restricciones sobre el contenido del repositorio y el formato del portal?
5. ¿Es obligatorio ejecutar en hardware real?
