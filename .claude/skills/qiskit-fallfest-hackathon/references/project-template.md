# Plantilla de proyecto desde cero

```
proyecto/
├─ README.md            # problema, cómo correr, resultados, limitaciones (criterio Rigor)
├─ requirements.txt     # versiones exactas: pip freeze | findstr /i "qiskit numpy scipy networkx streamlit scikit"
├─ problem.md           # formulación (variables, costos, restricciones) o concepto ML↔QML
├─ src/
│  ├─ classical.py      # baseline clásico / exacto
│  ├─ quantum.py        # núcleo Qiskit
│  └─ compare.py        # tabla y gráficos clásico vs cuántico
├─ app.py               # Streamlit (opcional) o notebook demo.ipynb
├─ results/             # resultados pre-guardados (respaldo de la demo)
└─ slides/
```
Comandos (PowerShell):
```powershell
C:\Users\luist\qiskit-env\Scripts\Activate.ps1
pip freeze > requirements.txt     # o lista curada
python src\compare.py
streamlit run app.py
```
Reglas: semillas fijas (`seed=`), un comando reproduce todo, guardar figuras en `results/`, no subir tokens.
