> **ANTECEDENTE HISTÓRICO: especificación narrativa sustituida.** El equipo aprobó definitivamente El experimento fantasma: Sami añade la segunda H a las 21:14; Rumi retira el módulo a las 21:19; la acusación cruza auditoría y reconstrucción; final PHI/Φ. Este documento conserva el plan anterior: no es la especificación del caso actual ni evidencia de funciones implementadas. Consultar [MIGRACION-NARRATIVA.md](MIGRACION-NARRATIVA.md) y el README vigente.

Usa la skill `qiskit-fallfest-hackathon` y sigue su protocolo (lee `bases-y-evaluacion.md` y el tablero). Categoría: EdTech (IEEE CS PUCP). Entrega antes de las 14:45; tiempo total disponible: ~2 horas.

# Proyecto: "Quantum Files — El patrón invisible" (mascota: Inspector Cuy, un cuy detective)
Juego de detectives por episodios, en Python + Streamlit, que enseña probabilidad (Bernoulli y muestreo) y su equivalente cuántico (medición de un qubit) con Qiskit 2.x. Público: desde 14 años, sin saber cuántica. Una partida dura 5–8 minutos. Aprender y avanzar en el caso son lo mismo: cada pregunta ayuda a resolverlo.

## Reglas del reto (no negociables)
- Mapear un concepto de Estadística/ML a su equivalente cuántico (QML) y ser adictivo de usar. Responder en la app: ¿desde qué edad? (14+) ¿una vez al día o a la semana? (diario, 5 min).
- Usar Qiskit de forma pertinente y explicar qué corre en circuito y qué es clásico. No afirmar ventaja cuántica. Todo dato es ficticio; decirlo.
- Sin vidas ni bloqueos por equivocarse: los errores abren una explicación y permiten reintentar.

## Historia y lógica del caso 1: "El experimento alterado"
Laboratorio cuántico en Lima, habitado por animales andinos. Durante una demostración, el experimento produce resultados raros. Alguien cambió la configuración (de 50/50 a 75/25, es decir rx con θ = 120°) a las 14:05 y falsificó su informe. Sospechosos (ficticios): Lola Llama (investigadora), Tito Vicuña (técnico) y Cora Cóndor (analista); todos son animales andinos y el detective es Inspector Cuy.
- Registro de accesos: Tito 13:30, Lola 14:05, Cora 15:10 (después del incidente).
- Declaraciones: Lola: "Con una moneda 50/50, en 10 mediciones siempre salen 5 y 5" (FALSA). Tito: "Con 7 unos en 10 no puedo concluir que haya alteración" (verdadera). Cora: "Con p = 0.75, en 100 mediciones espero cerca de 75 unos, aunque no exactamente 75" (verdadera).
- Solución única: culpable = quien hizo la declaración falsa Y estuvo en la sala a las 14:05 (Lola Llama). Una declaración falsa sola no basta: la acusación exige elegir persona + evidencia que la sostiene.
Tres pruebas:
1. La moneda sospechosa: Qiskit (h + medir, semilla fija) produce 10 resultados con 7 unos y 3 ceros. El jugador decide si prueba una alteración. Mostrar el cálculo real: P(≥7 de 10 | p=0.5) = 176/1024 = 17.2 % → no basta para acusar.
2. Reconstruye el experimento: perilla θ (rx). El jugador ajusta hasta aproximarse a la probabilidad objetivo 0.75 y ejecuta 100 mediciones. Presentarlo explícitamente como entrenar un circuito variacional: error = (p_observada − p_objetivo)², bajar el error paso a paso (descenso de gradiente, con un botón de pista de Inspector Cuy).
3. El informe imposible: contrastar las tres declaraciones con la configuración y los accesos. Detectar la falsa y cruzarla con el registro.
Episodios futuros: Zorro Andino, Oso de anteojos, Pingüino de Humboldt u otros animales como nuevos sospechosos. Final: firma "Ψ" que anuncia el siguiente incidente (gancho).

## Mecánicas de enganche y aprendizaje
- Tres niveles de ayuda sobre el mismo caso: Principiante (analogías, glosario, pistas), Curioso (sin ayuda, explicación después) y Avanzado (abrir el circuito, ver probabilidades, justificar).
- Predicción antes de ejecutar ("¿qué crees que saldrá?") y retroalimentación inmediata.
- Tras cada prueba: mostrar el código Qiskit usado con explicación línea por línea y un botón "modo laboratorio" para cambiar un parámetro y volver a medir.
- "Caso del día": mismas pruebas con valores distintos según la semilla del día (probabilidad objetivo, tamaño de muestra). Estrellas por resolver, justificar y explorar, y una racha diaria; sin castigos.
- Glosario que se desbloquea; vista de la perspectiva clásica vs cuántica vs puente (frecuencias fluctúan alrededor de las probabilidades).
- Mini quiz de 3 preguntas antes y después, guardado en CSV local (evidencia de validación).
- Inspector Cuy: personaje guía con tono amable en español peruano suave; ilustración sencilla en SVG o emoji; da pistas graduales.

## Requisitos técnicos
Python 3.12, Qiskit 2.x (StatevectorSampler o AerSimulator; sin API eliminadas), Streamlit. Estructura: `engine/` (circuitos, estadística, semillas), `cases/` (datos del caso en JSON), `app.py` (UI), `tests/` (pytest: frecuencias convergen a probabilidades teóricas, p-valor 0.1719, solución única del caso), `docs/`, `README.md`, `requirements.txt`. Semillas fijas y un comando que reproduce todo. Verifica que la app arranca y los tests pasan antes de dar algo por terminado.

## Documentación a generar (borrador desde el código y los resultados)
README (qué es, cómo correr, capturas), docs/PEDAGOGIA.md (cómo se aprende y se conecta con el reto), docs/ARQUITECTURA.md (diagrama y justificación de decisiones), docs/VALIDACION.md (plan del quiz antes/después y plantilla de resultados), docs/LIMITACIONES.md (juguete educativo con 1 qubit, sin ventaja cuántica, datos ficticios), docs/FUENTES.md (librerías y herramientas usadas), docs/GUION-PITCH.md (3 minutos con tiempos).

## No hacer
Más episodios, multijugador, preguntas generadas con IA, ranking global, cuentas de usuario, chi-cuadrado/SVM completos.

