# Herramientas, MCP y skills para el hackathon

## Ya instalado en esta PC (2026-10-23)
- **Entorno:** `C:\Users\luist\qiskit-env` — qiskit 2.6.1, qiskit-aer 0.18, qiskit-ibm-runtime 0.51, qiskit-optimization 0.7, qiskit-algorithms 0.4, qiskit-machine-learning 0.9.1, qiskit-addon-opt-mapper 0.1.0, networkx, rustworkx, scipy, pandas, scikit-learn, streamlit, jupyterlab, matplotlib.
- **MCP registrados en Claude Code (user):** `qiskit` (crear/transpilar circuitos, OpenQASM 3/QPY) y `qiskit-docs` (buscar documentación oficial). Sin token. Se ven con `/mcp`; requieren reiniciar la sesión de Claude Code para cargarse.

## Preparación offline y arranque rápido
- Carpeta de trabajo: `C:\Users\luist\Desktop\IMB\hackathon\` con `requirements.txt`, `wheelhouse\` (paquetes offline ~250 MB) y `LEEME-INICIO-RAPIDO.md` (comandos de arranque, instalación sin internet, registro del MCP de Runtime).
- Kernel de Jupyter registrado: "Python (qiskit-env)". Verificado: imports, AerSimulator y Streamlit funcionan.
- `qiskit-ibm-runtime-mcp-server` ya está instalado en el entorno; solo falta registrarlo con el token (comando en el LEEME).

## IBM Quantum Platform (https://quantum.cloud.ibm.com) — hardware real
- **Setup (una sola vez, ANTES del evento):** crear cuenta (IBMid/Google) → en la plataforma crear una **instancia** (Open Plan, región **us-east**) → copiar la **API key** y el **CRN** → `python ~/.claude/skills/qiskit-fallfest-hackathon/scripts/ibm_connect.py` (pide la clave sin mostrarla) → verificar con `--test`.
- **Open Plan:** **10 min de tiempo QPU por ventana de 28 días** (fuente: docs IBM, plans-overview); hay promoción de +180 min si el usuario la activó. Un Bell de 500 shots gasta segundos, pero hay **cola**: en el evento muchos equipos competirán.
- **Estrategia:** desarrollar y validar todo en simulador (`AerSimulator`/`StatevectorSampler`); enviar **1–2 jobs pequeños a hardware real al final** como evidencia ("validación en hardware") y guardar el resultado en `results/`. No depender de la cola durante la demo. Modo **job** (no sesiones) en Open Plan.
- El token es personal: no pegarlo en el chat, no subirlo a git. Se guarda en `~/.qiskit/qiskit-ibm.json`.
- Jobs y uso: panel de la plataforma → Workloads.

## Opcionales (no instalados)
| Qué | Para qué | Requiere | Instalar |
|---|---|---|---|
| `qiskit-ibm-runtime-mcp-server` | Ver backends, enviar jobs a hardware IBM | Token IBM (`QISKIT_IBM_TOKEN`) | `pip install qiskit-ibm-runtime-mcp-server` y `claude mcp add --scope user qiskit-ibm-runtime -e QISKIT_IBM_TOKEN=... -- <ruta>\qiskit-ibm-runtime-mcp-server.exe` |
| `qiskit-ibm-transpiler-mcp-server` | Transpilador con IA (optimiza circuitos) | Token IBM | `pip install qiskit-ibm-transpiler-mcp-server` |
| `qiskit-gym-mcp-server` (comunidad) | Síntesis de circuitos con RL | — | `pip install qiskit-gym-mcp-server` |
| Skills de terceros (K-Dense `qiskit`, davila7 `qiskit`) | Más guía de Qiskit para Claude | Revisar el código antes de instalar | Ver claudemarketplaces.com; no son oficiales de IBM |

Fuentes: https://quantum.cloud.ibm.com/docs/en/guides/qiskit-mcp-servers · https://github.com/Qiskit/mcp-servers (el servidor "Code Assistant" fue retirado). El único skill que lista el repo oficial es `qiskit-mcp-dev` (desarrollo de los propios servidores, no útil aquí).

## Recomendación
Con 3.5 h no sobrecargar: esta skill + MCP `qiskit` + `qiskit-docs` + el entorno instalado bastan. Añadir Runtime solo si deciden usar hardware real.
