# Lista de entrega del hackathon

Esta lista organiza los elementos que las bases del evento solicitan para la entrega. No afirma que el portal ya haya recibido archivos ni que exista un video o presentación terminados.

## Equipo

- **Equipo:** Qubit a la Brasa.
- **Integrantes:** cuatro personas. Completar con los nombres oficiales antes del envío.
  1. ____________________
  2. ____________________
  3. ____________________
  4. ____________________
- **Responsable del envío y comunicaciones:** ____________________.

## Elementos para el portal

- [ ] **Repositorio GitHub:** [LuisTE1/ibmquantumhackathon](https://github.com/LuisTE1/ibmquantumhackathon). Verificar acceso del jurado, rama que se presentará y README visible.
- [ ] **Demo o video:** [https://quantum-files.vercel.app/](https://quantum-files.vercel.app/). El 24 de octubre de 2026 la página y API respondieron; los assets principales comparados coinciden con `origin/main` actual y el POST H–H devolvió el resultado ideal esperado. Falta una prueba E2E en navegador y confirmar con quien administra Vercel que este es el build de entrega.
- [ ] **Descripción para el portal (100–150 palabras):**
  > *Quantum Files — Caso 01: El experimento fantasma es una aventura educativa en formato PWA para navegador y móvil, con público propuesto de 14 años en adelante. En Qori Lab, Detective Cuy investiga por qué QUILLA cambió sus resultados: compara probabilidad teórica y conteos observados, prueba puertas H y X, reconstruye la secuencia H–H y contrasta la explicación del circuito con la memoria de auditoría. La historia distingue la edición de Sami, registrada a las 21:14, de la retirada posterior del módulo por Rumi, a las 21:19. El backend usa Qiskit Statevector y StatevectorSampler en simulación CPU; si la API falla, el navegador usa un simulador JavaScript local. No se usa QPU ni se entrena QML. La propuesta educativa aún requiere evaluación con participantes.*
- [ ] **Tecnologías:** HTML, CSS y JavaScript; Python; Qiskit Statevector y StatevectorSampler; Vercel.
- [ ] **Diferencial educativo:** el jugador predice y experimenta antes de reunir evidencias; la frecuencia observada no decide la culpabilidad. La audiencia 14+ es propuesta y el impacto educativo todavía no está validado.
- [ ] **Presentación (PPT):** preparar y comprobar que incluya problema, solución, público propuesto, metodología, demostración, uso real de Qiskit, limitaciones, fuentes y estrategia de validación. No incluir puntuaciones de rúbrica inventadas.
- [ ] **Envío:** abrir el portal designado por la organización, cargar todos los elementos, verificar permisos y enlaces, y guardar confirmación de envío.

## Preparación para la presentación

- [ ] Ensayar el pitch con cronómetro para mantenerlo entre 2:30 y 3:00 minutos.
- [ ] Probar audio, navegación y controles de la demo; preparar video o capturas si falla la red.
- [ ] Indicar con claridad que Qiskit usa simulación de vector de estado en CPU y que no se usó hardware cuántico.
- [ ] Reconocer el arte reutilizado, bibliotecas, servicios y asistencia de IA en los materiales.
- [ ] Distinguir los resultados de pruebas automatizadas de cualquier evaluación educativa; completar el protocolo con datos reales solo si se realizan sesiones.
- [ ] Confirmar con la organización las reglas vigentes sobre código preexistente, IA generativa y recursos externos.

## Estado comprobado para el paquete

- Suite Python local más reciente: 17 aprobadas, 2 fallidas y 1 error de colección. Los dos fallos pertenecen a pruebas legacy de Streamlit; `tests/test_web.py` no pudo recolectarse porque falta Qiskit.
- Scripts `tests/e2e/verify.js`, `play6.js` y `play7.js`: sintaxis JavaScript válida, pero ejecución de navegador omitida por falta de Playwright y Chrome.
- Demo pública: recursos principales y API responden; POST H–H devuelve la probabilidad ideal. El recorrido E2E aún no está certificado.
- No se encontraron en este repositorio el PPT ni el video. No se encontraron nombres confirmados de los cuatro integrantes. Enlaces y confirmación del portal no disponibles en el repositorio.

## Información pendiente

Los nombres de cuatro integrantes, el archivo PPT, el video de respaldo, el enlace activo del portal y la confirmación del envío deben completarse por el equipo. No se han inventado en este documento.
