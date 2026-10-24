---
name: qml-edtech
description: Diseña experiencias didácticas interactivas para enseñar estadística, machine learning y sus conexiones con QML usando Qiskit Machine Learning. Actívala para retos educativos o prototipos de aprendizaje cuántico.
---

# Skill: QML y EdTech interactivo
(Skill entregada por los organizadores del Qiskit Fall Fest 2026; copia sin cambios del contenido recibido.)

## Propósito
Diseñar experiencias que enseñen un concepto estadístico o de machine learning y permitan experimentar con un equivalente o extensión cuántica. La interacción debe crear ganas de volver por el progreso y el descubrimiento, sin ocultar limitaciones ni presentar QML como superior por defecto.

## Cuándo usarla
- El usuario crea un juego, simulador, app o herramienta educativa de computación cuántica.
- Se quiere conectar distribuciones, SVM, Monte Carlo, redes neuronales o descenso de gradiente con QML.
- Debe diseñarse una metodología y una demo atractiva para el reto EdTech del Qiskit Fall Fest 2026.

## Procedimiento de diseño
1. Elige un único objetivo de aprendizaje, expresado como acción comprobable (p. ej. "el usuario compara cómo cambia la frontera de decisión al sustituir el kernel").
2. Define audiencia y conocimientos previos (edad aproximada, familiaridad con probabilidad/código, modo de uso). No declares una edad mínima sin pruebas con usuarios y revisión de accesibilidad.
3. Parte de una versión clásica intuitiva: datos, controles, resultado y explicación antes de introducir la parte cuántica.
4. Mapea con precisión qué pieza clásica se reemplaza o modifica (feature map, kernel cuántico, QNN, circuito de muestreo). Distingue analogía didáctica de equivalencia matemática.
5. Crea un ciclo breve: elegir configuración → ejecutar → observar → retroalimentación → probar un reto ligeramente distinto.
6. Haz visible el aprendizaje: predicciones del usuario, visualización de estados/distribuciones o errores, pistas progresivas y recapitulación que nombre el concepto.
7. Implementa una demo fiable: datos pequeños y deterministas, precalcula si hay restricciones de cómputo, ofrece simulación local. No dependas de QPU en vivo.
8. Valida el diseño con personas representativas (finalización, comprensión, retorno voluntario). No equipares clics o tiempo de pantalla con aprendizaje.
9. Documenta evaluación y accesibilidad: instrucciones claras, alternativas a color, texto para elementos visuales, navegación por teclado, modo de ayuda.

## Componentes QML disponibles
- Kernel cuántico: `FidelityQuantumKernel` con QSVC/QSVR o métodos clásicos compatibles; enseña qué mide la matriz del kernel y compárala con un kernel clásico.
- Red neuronal cuántica: `EstimatorQNN` (valores esperados), `SamplerQNN` (salidas muestreadas); alto nivel: VQC y VQR.
- PyTorch: `TorchConnector` cuando el caso lo justifique.
- Verifica compatibilidad de paquetes y ejemplos en la versión instalada antes de generar imports o APIs. No hace falta hardware real.

## Patrón de comparación pedagógica
Para cada modo clásico/cuántico: mismo conjunto de datos (o comparación justificada); qué operación realiza cada método; salida visible; parámetros editables; una medición simple de rendimiento y sus límites. No atribuyas mejoras a un método si provienen de diferencias de datos, presupuesto de entrenamiento o hiperparámetros. Comenta el tamaño pequeño, el costo de muestreo, el entrenamiento y la ausencia de evidencia de ventaja práctica.

## Retención responsable
- Recompensa exploración, dominio y comprensión: niveles, desafíos cortos, visualización de progreso, nuevas preguntas.
- El usuario controla el ritmo: sin pérdida artificial de progreso, rachas punitivas, notificaciones coercitivas ni azar opaco.
- "Adictivo" en este reto = atractivo y voluntariamente reutilizable, sin manipular.
- Recomienda intervalos de uso basados en pruebas del prototipo, no como afirmaciones clínicas o universales.

## Entrega del agente
Describe público, objetivo de aprendizaje, flujo interactivo, mapeo clásico→cuántico, componentes Qiskit, datos, método de evaluación, límites y una demo concreta que pueda mostrarse en pocos minutos.

## Referencias oficiales
Qiskit Machine Learning (descripción y componentes) · Tutoriales de Qiskit Machine Learning · Guía de instalación de Qiskit Machine Learning.
