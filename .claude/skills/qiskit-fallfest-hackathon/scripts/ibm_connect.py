"""Conecta con IBM Quantum Platform y lista backends.

Uso (con el entorno activo):
    python ibm_connect.py          # pide API key (y CRN opcional) y los guarda localmente
    python ibm_connect.py --test   # usa credenciales ya guardadas: lista backends y el menos ocupado
    python ibm_connect.py --run    # ejecuta un circuito Bell en el backend menos ocupado (gasta minutos QPU)

El token se pide con getpass: no se muestra ni queda en el historial.
"""
import sys
from getpass import getpass
from qiskit_ibm_runtime import QiskitRuntimeService

CHANNEL = "ibm_quantum_platform"


def save():
    token = getpass("API key de IBM Quantum Platform: ").strip()
    crn = input("CRN de la instancia (Enter para omitir): ").strip() or None
    kw = dict(channel=CHANNEL, token=token, overwrite=True, set_as_default=True)
    if crn:
        kw["instance"] = crn
    QiskitRuntimeService.save_account(**kw)
    print("Credenciales guardadas en ~/.qiskit/qiskit-ibm.json (no subir a git).")


def test(run=False):
    svc = QiskitRuntimeService()
    for b in svc.backends(simulator=False, operational=True):
        print(f"{b.name:20s} qubits={b.num_qubits:4d} cola={b.status().pending_jobs}")
    best = svc.least_busy(operational=True, simulator=False)
    print("Menos ocupado:", best.name)
    if run:
        from qiskit import QuantumCircuit
        from qiskit.transpiler.preset_passmanagers import generate_preset_pass_manager
        from qiskit_ibm_runtime import SamplerV2

        qc = QuantumCircuit(2)
        qc.h(0); qc.cx(0, 1); qc.measure_all()
        isa = generate_preset_pass_manager(backend=best, optimization_level=1).run(qc)
        job = SamplerV2(mode=best).run([isa], shots=500)  # Open Plan: modo job (sin sesiones)
        print("job:", job.job_id())
        print(job.result()[0].data.meas.get_counts())


if __name__ == "__main__":
    if "--test" in sys.argv:
        test()
    elif "--run" in sys.argv:
        test(run=True)
    else:
        save()
