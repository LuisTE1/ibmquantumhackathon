# Guion de pitch — 2:30 a 3:00 minutos

**Preparación:** la página y los assets principales publicados coinciden con `origin/main` actual y la API responde con Qiskit 2.6.1. El recorrido E2E no pudo ejecutarse en este entorno por falta de Playwright y Chrome; ensayar la navegación completa en el dispositivo de presentación antes de iniciar el pitch.

**Duración estimada del texto:** 2:40–2:55 a ritmo natural, más las acciones de la demostración. Ensayar con cronómetro.

## Guion

**[0:00–0:30 | Problema]**

¿Cómo enseñamos que una medición cuántica produce resultados aleatorios y que una sola muestra no demuestra que un sistema esté alterado? Una fórmula aislada no siempre da al estudiante un motivo para investigar. En Qubit a la Brasa convertimos esa pregunta en un caso: *Quantum Files — El experimento fantasma*, en Qori Lab.

**[0:30–1:00 | Solución y público]**

El jugador es Detective Cuy. Recorre el laboratorio, conversa con Killa, Inti, Rumi, Sami y Amaru, reúne evidencias y reconstruye un circuito. El público propuesto es de 14 años en adelante; aún tenemos que validar esa edad y la comprensión con participantes. La historia conduce a una conclusión documentada: Sami añadió una segunda H a las 21:14, y la auditoría registra esa edición. Rumi retiró el módulo a las 21:19, después; no inició el sabotaje.

**[1:00–1:45 | Demostración]**

**[Mostrar la PWA, mover al Detective Cuy e iniciar una actividad.]** Antes de medir, el jugador predice qué saldrá. Aplicamos H al estado 0 y observamos una distribución 50/50. Luego comparamos H–H, sin medición entre las puertas: en el circuito ideal las amplitudes interfieren y el resultado final vuelve a 0. La pantalla muestra los conteos de los shots y si llegaron desde Qiskit en el servidor o desde el simulador JavaScript local. La memoria de auditoría aporta quién hizo la edición; el circuito explica qué efecto produjo. La frecuencia, por sí sola, no identifica a una persona.

**[1:45–2:20 | Metodología]**

Ese es el ciclo de aprendizaje: predecir, experimentar, observar, comprender y desbloquear evidencia. Las preguntas del juego y la retroalimentación dan otra oportunidad para explicar el resultado; los desafíos repetibles, rachas e insignias invitan a practicar. Son decisiones de diseño que todavía debemos evaluar, no resultados de aprendizaje ya demostrados.

**[2:20–2:50 | Tecnología y límites]**

La API usa Qiskit `Statevector` para probabilidades y `StatevectorSampler` para generar conteos en CPU clásica. Si la API falla, el navegador tiene un simulador independiente. No usamos una QPU, no modelamos ruido y no entrenamos un modelo QML. Para validar, proponemos sesiones con dos a cinco personas: preguntas iniciales y finales, una rúbrica común de comprensión, duración, finalización, usabilidad e interés en otro episodio. Aún no hay resultados de participantes.

**[Cierre]**

Quantum Files convierte una predicción cuántica en una decisión que el jugador debe justificar. Queremos que la siguiente pista de Qori Lab también sea una oportunidad para aprender.
