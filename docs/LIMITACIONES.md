# Limitaciones y estado del prototipo

Estado comprobado el 24 de octubre de 2026 sobre la base `b1a126c` y los contenidos de `feat/contenido`. No es una declaración de producto terminado.

| Área | Limitación verificada | Consecuencia y siguiente paso |
|---|---|---|
| Interfaz | `app.py` solo muestra título, aviso de esqueleto, conteos y un p-valor | No se puede afirmar que exista una partida completa; A debe integrar las tres pruebas y la resolución |
| Motor cuántico | `engine/circuits.py` usa división y redondeo; no importa ni ejecuta Qiskit | Los conteos son provisionales. B debe implementar y verificar el muestreo antes de anunciar circuitos ejecutados |
| Variabilidad | `coin_counts` devuelve aproximadamente mitad y mitad; `rx_counts` redondea la proporción teórica; ambos ignoran `seed` | Estos valores no enseñan fluctuación muestral. El respaldo aleatorio `USE_QISKIT` mencionado en el plan aún no existe |
| Lógica del caso | Faltan `engine/game.py` y `engine/demo.py`, aunque están en el contrato | Cargar contenido, desbloquear evidencias, dar pistas y evaluar acusaciones sigue pendiente |
| Contenido e interfaz | Glosario y seis preguntas disponibles como JSON; la app no los carga | La evaluación puede prepararse manualmente; no hay quiz integrado ni exportación CSV implementada |
| Narrativa e interfaces | El caso aprobado Sami/Rumi/H–H/Φ está migrado a JSON versión 2; motor, interfaz y contrato heredados aún no lo implementan | Adaptar consumidores según [MIGRACION-NARRATIVA.md](MIGRACION-NARRATIVA.md); no aplicar las evidencias antiguas |
| Validación educativa | No se han registrado participantes ni resultados | Usar [VALIDACION.md](VALIDACION.md); no atribuir mejoras ni satisfacción al prototipo |
| Pruebas | Las dos pruebas existentes verifican un p-valor y `prob_one(120)` | Que pasen no demuestra integración, muestreo Qiskit, usabilidad ni aprendizaje |
| Entorno | En esta revisión se usó Python 3.14.4; faltan Streamlit, Qiskit y Aer en ese intérprete | No se verificó el arranque de la UI ni la instalación completa. Python 3.12 es el entorno previsto por el equipo |
| Dependencias | `requirements.txt` solo acota Qiskit por abajo (`>=2.1`); no fija el resto de versiones | Registrar y fijar versiones en una futura integración, a cargo del responsable correspondiente |
| Enlace público | El URL suministrado devuelve una página «#HackTheAndes · Último Deploy» | No acredita este repositorio ni la versión de entrega; confirmar enlace y commit con el equipo |

## Alcance científico

Los ejemplos previstos emplean un qubit ideal. No incluyen entrelazamiento, ruido de dispositivo, mitigación de errores ni comparación de rendimiento con hardware. No se ejecutaron trabajos en IBM Quantum ni se requieren credenciales para los ejemplos locales.

Los conteos actuales son cálculos clásicos deterministas; no son resultados de un simulador cuántico. Una futura ejecución con `StatevectorSampler` seguiría siendo simulación clásica de un modelo cuántico, no una ejecución en una QPU. No hay evidencia de ventaja cuántica.

El p-valor implementado es una cola binomial unilateral para ensayos independientes con p constante. No representa la probabilidad de sabotaje ni identifica a una persona. Una frecuencia finita no estima p sin incertidumbre. La acusación del expediente es una regla narrativa ficticia, no un método de atribución aplicable a situaciones reales.

La fórmula `sen²(θ/2)` de la utilidad heredada `prob_one` corresponde a RX sobre 0; no representa el nuevo caso. H–H requiere preservar el estado sin medición intermedia; no son dos sorteos independientes. Las probabilidades 0,5 y 0 de obtener 1 en H y H–H son predicciones ideales, verificadas matemáticamente, no ejecuciones Qiskit. El efecto físico de retirar el módulo no se modela: la auditoría y el orden temporal sustentan su papel narrativo.

## Alcance educativo y de producto

H y X son puertas, no algoritmos de ML. No hay modelo QML entrenado, datos de entrenamiento, comparación de clasificación ni pista de gradiente implementada. El vínculo educativo disponible es entre estadística y probabilidades de medición; cualquier extensión QML debe describirse como trabajo futuro.

No están implementados episodios adicionales, retos diarios, rachas, estrellas, niveles de ayuda ni un modo laboratorio. El interés en esas mecánicas aún debe evaluarse. El público de 14 años en adelante y la duración de 5–8 minutos son objetivos de diseño, no resultados de pruebas.

No se ha realizado una auditoría de accesibilidad ni una evaluación de retención a largo plazo. Una muestra exploratoria de 2–5 personas puede detectar dificultades, pero no permite generalizar eficacia. Los datos del caso son ficticios; no se usó un dataset de estudiantes reales.
