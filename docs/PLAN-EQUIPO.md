> **ANTECEDENTE HISTÓRICO: especificación narrativa sustituida.** El equipo aprobó definitivamente El experimento fantasma: Sami añade la segunda H a las 21:14; Rumi retira el módulo a las 21:19; la acusación cruza auditoría y reconstrucción; final PHI/Φ. Este documento conserva el plan anterior: no es la especificación del caso actual ni evidencia de funciones implementadas. Consultar [MIGRACION-NARRATIVA.md](MIGRACION-NARRATIVA.md) y el README vigente.

# ACTUALIZACIÓN (queda ~1 h 30 min) — LEER ESTO PRIMERO
**Roles definitivos:** la **compañera = parte visual** (pp.py, ssets/) · **tú = motor** (engine/, 	ests/) · el **compañero = documentación** (docs/, README.md, cases/, PPT, video).
**Alcance recortado (solo lo imprescindible):** 1 caso · 3 pruebas simples · acusación final · código de Qiskit visible · 1 pista del Cuy. **Fuera por falta de tiempo:** caso del día, estrellas, tres niveles de ayuda. El quiz antes/después se hace con 2–3 personas si da tiempo; si no, se presenta como *plan de validación* (**nunca inventar resultados**).
**Sobre Qiskit:** lo cuántico es solo ~25 líneas en engine/circuits.py (ya verificado). No lo quiten: Qiskit es el 25 % de la nota y el reto pide el equivalente cuántico. Si falla en el evento, USE_QISKIT = False activa un respaldo con números aleatorios (con la misma interfaz) y se declara en la documentación.
| Hora (si ahora son ~13:15) | Hito |
|---|---|
| 13:30 | Motor real listo (≈10 min) · pantalla base con datos del contrato · README y LIMITACIONES/FUENTES empezados |
| 14:00 | **Merge:** juego completo de punta a punta |
| 14:20 | Prueba con 2–3 personas · PPT |
| 14:35 | Video de 1–2 min · README final · merge final |
| 14:45 | **Entrega al portal** |

---
# Plan del equipo — Quantum Files (Inspector Cuy)
IBM Quantum Hackathon 2026 · Categoría EdTech · Entrega al portal **antes de las 14:45** · Presentación 15:00–16:40 (los 3 presentes)

## 1. Qué estamos construyendo (30 segundos)
Un **juego de detectives** en el que **Inspector Cuy** investiga quién alteró un experimento en un laboratorio cuántico. Los sospechosos son animales andinos: **Lola Llama, Tito Vicuña y Cora Cóndor**. El jugador resuelve 3 pruebas con circuitos reales de **Qiskit** y aprende probabilidad (Estadística) y su versión cuántica. Aprender y resolver el caso son lo mismo. Dura 5–8 minutos y cada día hay un "caso del día" con números distintos.

La culpable es **Lola Llama**: dijo algo falso ("con una moneda 50/50, en 10 mediciones siempre salen 5 y 5") **y** estuvo en la sala a las 14:05, cuando se cambió la configuración. Una pista sola no alcanza: hay que cruzar las dos.

## 2. Qué evalúa el jurado (hay que tenerlo presente)
| Criterio | Peso | Qué debemos mostrar |
|---|---|---|
| Innovación, validación y potencial | 25 % | Un juego donde aprender = resolver; **prueba con jugadores** (quiz antes y después) |
| Uso de Qiskit y pitch | 25 % | Circuitos reales, **código visible**, demo clara, pitch de 3 min |
| Reto EdTech | 20 % | Estadística ↔ cuántico explícito; **¿desde qué edad?** (14+) y **¿diario o semanal?** (diario, 5 min); que sea adictivo |
| Rigor y reproducibilidad | 15 % | Pruebas automáticas, semillas fijas, README |
| Calidad y arquitectura | 15 % | Código ordenado y decisiones justificadas |
Reglas: no afirmar "ventaja cuántica" (es un juguete educativo con 1 qubit); decirlo con honestidad; reconocer las fuentes y herramientas usadas.

## 3. Reparto
| | Persona 1 — Interfaz e integración | Persona 2 — Motor Qiskit | Persona 3 — Contenido, documentos y validación |
|---|---|---|---|
| Nombre | __________ | __________ | __________ |
| Carpeta suya | `app.py`, `assets/` | `engine/`, `tests/` | `cases/`, `docs/`, `README.md` |
| Rama de Git | `feat/ui` | `feat/engine` | `feat/contenido` |

### Persona 1 — Interfaz e integración
- [ ] Pantalla de inicio con Inspector Cuy y el expediente del caso (lee `cases/caso1.json`).
- [ ] Las 3 pruebas jugables: (1) la moneda sospechosa, (2) reconstruir el experimento con una perilla, (3) el informe imposible.
- [ ] Niveles de ayuda: Principiante / Curioso / Avanzado.
- [ ] Acusación final (elegir persona **y** la evidencia que la sostiene) y la firma Ψ del final.
- [ ] Mostrar el código de Qiskit tras cada prueba y un botón "modo laboratorio".
- [ ] Estrellas y racha diaria; "caso del día" si hay tiempo. **Sin vidas ni castigos.**
- [ ] Hacer los **merges a `main`** y la **entrega al portal** (responsable).

### Persona 2 — Motor Qiskit
- [ ] En `engine/circuits.py` reemplazar los datos falsos por **circuitos reales** de Qiskit 2.x: `coin_counts(shots, seed)` (h + medir) y `rx_counts(theta_deg, shots, seed)` (rx + medir). **No cambiar las firmas** (ver `CONTRATO.md`).
- [ ] Encontrar una **semilla** que dé 7 unos y 3 ceros en 10 mediciones para la prueba 1 (si no aparece, dejar los números fijos y avisarlo).
- [ ] Textos `CODE_COIN` y `CODE_RX` con el código que se mostrará al jugador.
- [ ] En `tests/`: pruebas automáticas (las frecuencias se acercan a las probabilidades teóricas; p-valor 0.1719; solución única del caso).
- [ ] Opcional: botón de pista de "descenso de gradiente" para la prueba 2 (error = (p_obs − p_objetivo)²).

### Persona 3 — Contenido, documentos y validación
- [ ] Completar `cases/caso1.json`: textos, diálogos y pistas (la lógica ya está; no cambiar quién es culpable sin avisar).
- [ ] `cases/glossary.json` (términos simples) y `cases/quiz.json` (3 preguntas **antes** y 3 **después**).
- [ ] **Probar el juego con 5 personas** (quiz antes y después) y guardar los resultados en `docs/VALIDACION.md`.
- [ ] `README.md`, `docs/PEDAGOGIA.md`, `docs/ARQUITECTURA.md`, `docs/LIMITACIONES.md`, `docs/FUENTES.md`, `docs/GUION-PITCH.md`.
- [ ] PPT (una slide por criterio de la rúbrica) y **video corto** de respaldo.

## 4. Cómo trabajamos en Git (repo: https://github.com/LuisTE1/ibmquantumhackathon)
```powershell
git clone https://github.com/LuisTE1/ibmquantumhackathon.git
cd ibmquantumhackathon
git checkout -b feat/<tu-rama>
# ... trabaja SOLO en tus archivos ...
git add . ; git commit -m "qué hiciste"
git pull --rebase origin main ; git push origin feat/<tu-rama>
```
Reglas: (1) solo tocar tus archivos; si necesitas algo de otro, pedirlo por WhatsApp. (2) Subir cambios chicos cada 20–30 min. (3) Los merges a `main` los hace la Persona 1. (4) Nunca subir contraseñas ni tokens.
Entorno: `C:\Users\luist\qiskit-env\Scripts\Activate.ps1` (o `pip install -r requirements.txt`). Correr: `streamlit run app.py` · Probar: `pytest -q`.

## 5. Cronograma (hoy)
| Hora | Hito |
|---|---|
| 13:10 | Todos con el repo clonado y su rama creada |
| 13:40 | P2: circuitos reales funcionando · P1: primera pantalla jugable · P3: caso, glosario y quiz listos |
| 14:05 | **Merge #1:** se une todo y corre de punta a punta |
| 14:20 | Prueba con 5 jugadores · caso del día y estrellas si hay tiempo |
| 14:35 | PPT, video, README y **merge final** |
| 14:45 | **Entrega al portal** (nombre del equipo, integrantes, repo GitHub, demo/video, descripción breve, PPT) y verificar que los enlaces abren |

**Si a las 14:05 algo no corre**, recortamos primero el caso del día y las estrellas; nunca las 3 pruebas ni el código visible.

## 6. Mini prompts para Claude Code (usa la skill `qiskit-fallfest-hackathon`)
- **Persona 1:** "Usa la skill. Lee `CONTRATO.md` y `cases/caso1.json`. Construye `app.py` en Streamlit: expediente, 3 pruebas, acusación con evidencia, niveles de ayuda, Inspector Cuy, código visible y estrellas, usando las funciones del contrato. No toques `engine/`, `cases/` ni `docs/`."
- **Persona 2:** "Usa la skill. Lee `CONTRATO.md`. Implementa solo `engine/circuits.py` con circuitos reales de Qiskit 2.x y las pruebas en `tests/`. Mantén las firmas. No toques otros archivos."
- **Persona 3:** "Usa la skill. Completa `cases/` y redacta `docs/` y `README.md` según `docs/PROMPT-maestro.md`. No toques `engine/` ni `app.py`."

## 7. Definición de "terminado"
- [ ] El juego corre con `streamlit run app.py` y se puede resolver el caso de principio a fin.
- [ ] `pytest -q` pasa.
- [ ] El README explica cómo correrlo; hay semillas fijas.
- [ ] Hay evidencia de la prueba con jugadores.
- [ ] Hay slide de limitaciones y de fuentes.
- [ ] Entregables subidos y enlaces verificados.

