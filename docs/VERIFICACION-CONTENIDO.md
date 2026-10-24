# Verificación y cierre de Persona 3

Fecha: 24 de octubre de 2026. Rama: `feat/contenido`; base inspeccionada `b1a126c`. Historia definitiva aprobada por el equipo: **Quantum Files — Caso 01: El experimento fantasma**. La autorización narrativa no acredita integración funcional.

## Comprobaciones aprobadas

| Comprobación | Resultado y alcance |
|---|---|
| Estado previo a migrar | `cases/caso1.json` no tenía cambios contra HEAD ni en el índice; su hash coincidía con el registrado en Fase 0. No se sobrescribió trabajo concurrente |
| JSON | Los tres archivos cargan en UTF-8, sin claves duplicadas |
| Glosario y quiz | 14 términos; contrato plano conservado. Tres preguntas pre y tres post con tres opciones e índices enteros válidos. Sus contratos no cambiaron |
| Caso versión 2 | Claves generales conservadas, seis personajes contando al detective, IDs y referencias consistentes; accesos desconocidos como `null` |
| Cronología | Sami edita a las 21:14; Rumi retira el módulo a las 21:19 |
| Resolución escrita | Sami, con `audit_memory` y `circuit_reconstruction`; Rumi no inicia el sabotaje. Ninguna declaración falsa se usa como requisito |
| Reconstrucción matemática | Multiplicación clásica de matrices: H sobre 0 da p(1) ≈ 0,5; H–H sin medición intermedia da p(1) = 0. Coincide con los datos del JSON |
| Comando del README | Ejecutado el cálculo H/H–H; salidas aproximadamente `0.5` y `0.0`. No es ejecución Qiskit |
| Suite existente | `python -B -m pytest -q -p no:cacheprovider`: **2 passed** después de migrar el JSON. Solo verifica estadística heredada, no la integración del caso |
| Archivos protegidos | Huellas de app, motor, prueba existente y contrato idénticas a las previas; comparación contra HEAD sin modificaciones en esos archivos |
| Pitch | 356 palabras habladas; duración de unos tres minutos prevista, pendiente de ensayo con demostración |
| Formato | `git diff --check` aprobado; revisar también el índice antes del commit |
| Enlaces internos | 37 enlaces locales comprobados en README y documentación revisada |

SHA-256 del nuevo expediente: `801943D0024D7CEB57C862351067DB1EBA1B000ADD6F62F77B71AD789D9B2EBD`. La huella anterior queda como registro histórico en INSPECCION-CONTENIDO.md; ya no se exige conservar el archivo anterior.

Las predicciones cuánticas anteriores se comprobaron con Python 3.14.4 y biblioteca estándar. No se ejecutó Qiskit, no se instalaron dependencias, no se leyeron credenciales ni se enviaron trabajos a IBM Quantum.

## Repetir el control de contenido

Desde la raíz en PowerShell, con un intérprete Python disponible:

```powershell
@'
import json
from pathlib import Path

def unique_object(pairs):
    obj = {}
    for key, value in pairs:
        assert key not in obj, f'Duplicate key: {key}'
        obj[key] = value
    return obj

data = {p.name: json.loads(p.read_text(encoding='utf-8'), object_pairs_hook=unique_object)
        for p in Path('cases').glob('*.json')}
g = data['glossary.json']
required = {'probabilidad', 'frecuencia observada', 'Bernoulli', 'qubit',
            'superposici\u00f3n', 'medici\u00f3n', 'Hadamard', 'X', 'circuito cu\u00e1ntico'}
assert required <= g.keys()
assert all(type(k) is str and k.strip() and type(v) is str and v.strip()
           for k, v in g.items())
quiz = data['quiz.json']
assert set(quiz) == {'pre', 'post'}
for phase in ('pre', 'post'):
    assert type(quiz[phase]) is list and len(quiz[phase]) == 3
    for item in quiz[phase]:
        assert set(item) == {'q', 'options', 'answer'}
        assert type(item['q']) is str and item['q'].strip()
        assert type(item['options']) is list and len(item['options']) == 3
        assert all(type(s) is str and s.strip() for s in item['options'])
        assert len(set(item['options'])) == 3
        assert type(item['answer']) is int and 0 <= item['answer'] < 3
case = data['caso1.json']
assert case['schema_version'] == 2
assert case['solution']['culprit'] == 'sami'
assert case['solution']['not_initiator'] == 'rumi'
assert set(case['solution']['needs']) == {'audit_memory', 'circuit_reconstruction'}
assert case['incident']['original_circuit']['gates'] == ['H']
assert case['incident']['altered_circuit']['gates'] == ['H', 'H']
assert case['incident']['config_changed_at'] == '21:14'
assert case['incident']['module_removed_at'] == '21:19'
assert set(case['solution']['needs']) <= {e['id'] for e in case['evidence']}
assert 'PHI' in case['hook'] and '\u03a6' in case['hook']
print('OK: JSON, quiz y caso oficial version 2')
'@ | python -B -
```

Este control no sustituye comprobar matemáticas, diálogo, resolución ni recorrido de interfaz. La validación de cierre incluyó además cálculo matricial e integridad de referencias.

## Fuentes y alcance de la revisión

Se leyeron y aplicaron `.agents/skills/qml-edtech/SKILL.md` y `.agents/skills/hackathon-coach/SKILL.md`; no se editaron. El objetivo pedagógico central, el ciclo de cinco pasos, el público propuesto, accesibilidad y retorno voluntario están documentados. No hay sesiones ni resultados de participantes registrados.

El enlace de Vercel suministrado había respondido HTTP 200 con HTML de «#HackTheAndes · Último Deploy». Esa comprobación de disponibilidad no acredita este repositorio ni la versión de entrega; no se presenta como demo validada ni se vuelve a atribuir el enlace al caso migrado.

## Entrega y pendientes

Archivos de Persona 3: README, los tres JSON, nueve documentos de contenido/verificación y avisos históricos en PLAN-EQUIPO.md, PROMPT-maestro.md y PROMPT-motor.md. El esquema versión 2 y la nota de adaptación para A y B están en [MIGRACION-NARRATIVA.md](MIGRACION-NARRATIVA.md).

El directorio concurrente `.agents/` no pertenece a estos entregables y debe quedar fuera del índice. Tampoco se incluyen secretos ni archivos de otros responsables. No se hizo commit, push, merge ni despliegue.

Pendientes de A/B: ejecutar H/H–H, cargar versión 2, desbloquear las dos evidencias, evaluar la acusación y mostrar cronología y PHI/Φ. El contrato compartido sigue siendo el anterior; sus reglas no deben aplicarse al caso nuevo. Pendientes del equipo: comprobar recorrido, despliegue y validación con personas. Los cambios de datos aprobados no resuelven esos pendientes.
