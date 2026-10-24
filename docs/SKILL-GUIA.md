# Guía de la skill `qiskit-fallfest-hackathon`

## ¿Qué es?
Una "skill" es un paquete de instrucciones y material que **Claude Code** carga automáticamente para ayudarnos mejor. Esta skill convierte a Claude en un copiloto que **conoce el hackathon**: las bases, la rúbrica del jurado, las reglas de EdTech, el plan por horas y cómo escribir Qiskit 2.x sin errores. Así no hay que explicarle el contexto cada vez.

## ¿Para qué nos sirve?
1. **Recordar la rúbrica** (25 % innovación, 25 % Qiskit y pitch, 20 % reto EdTech, 15 % rigor, 15 % arquitectura) y revisar si lo que hacemos suma puntos.
2. **Seguir el tablero de avance** y el tiempo que queda (entrega antes de las 14:45).
3. **Escribir código Qiskit 2.x correcto** (hay una guía de errores comunes y APIs que ya no existen).
4. **Preparar el pitch de 3 minutos** (plantilla con una slide por criterio).
5. **Cuidar la honestidad técnica:** no afirmar "ventaja cuántica", escribir limitaciones y reconocer fuentes.

## ¿Cómo se usa?
La skill ya está en este repositorio, en `.claude/skills/qiskit-fallfest-hackathon/`. Claude Code la encuentra solo cuando abres la carpeta del repo.
1. Clona el repo y abre una terminal en esa carpeta.
2. Ejecuta `claude`.
3. Escribe `/qiskit-fallfest-hackathon` o simplemente menciona "hackathon", "Qiskit" o "rúbrica" en tu pedido.

Ejemplos de pedidos:
- "Usa la skill y revisa si mi `app.py` cumple la rúbrica de EdTech."
- "Usa la skill y dime qué falta del tablero para entregar antes de las 14:45."
- "Usa la skill y revisa que mi código de Qiskit use la API de la versión 2."
- "Usa la skill y ayúdame a armar el guion del pitch de 3 minutos."

## ¿Qué trae adentro?
| Carpeta o archivo | Contenido |
|---|---|
| `SKILL.md` | Resumen del evento, el proyecto actual y el protocolo de trabajo |
| `references/bases-y-evaluacion.md` | Reglas, horarios, entregables, rúbrica y criterio EdTech |
| `references/plan-10-30-a-14-00.md` | Cronograma y tablero con casillas |
| `references/pitch-template.md` | Slides del pitch |
| `references/qiskit-2x-cheatsheet.md` | Qiskit 2.x: circuitos, Sampler, errores comunes |
| `references/retos-playbooks.md` | Guías por categoría (incluye EdTech) |
| `references/reto-ntt-qap10.md`, `qap10/` | Reto de NTT DATA (alternativa descartada, queda como referencia) |
| `scripts/ibm_connect.py` | Conexión con IBM Quantum (solo si usan hardware real) |

## Qué NO está
Los PDFs del libro de Sakurai y las diapositivas de los ponentes **no se subieron** por derechos de autor. Los enlaces originales están en `references/resources-index.md`.

## Antes de usarla en tu PC
Las rutas `C:\Users\luist\...` de la skill son de la PC de Luis. En la tuya:
```powershell
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

## Dos cuidados
- La skill es una ayuda, **no decide por nosotros**: revisen siempre lo que sugiere.
- Nunca pidan ni peguen tokens de IBM u otras claves en el chat ni en el repo.
