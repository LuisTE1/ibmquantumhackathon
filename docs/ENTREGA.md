# Lista de entrega del hackathon

Esta lista registra los datos de entrega confirmados por el equipo. El formulario de la hackathon ya fue enviado con GitHub, Canva y la demo de Vercel. El video era opcional y no se presentó.

## Equipo

- **Equipo:** Qubit a la Brasa.
- **Integrantes:**
  1. Maricielo Rubi Antúnez de Mayolo Seminario — líder.
  2. Luis Giovani de la Cruz Hoyos.
  3. Leonardo Sait Yactayo Tolentino.
  4. Luis Hernando Tataje Espinoza.

## Elementos para el portal

- [x] **Repositorio GitHub:** [LuisTE1/ibmquantumhackathon](https://github.com/LuisTE1/ibmquantumhackathon). Incluido en el formulario enviado.
- [x] **Demo:** [https://quantum-files.vercel.app/](https://quantum-files.vercel.app/). Incluida en el formulario; el 24 de octubre de 2026 la página y API respondieron y el POST H–H devolvió el resultado ideal esperado. La prueba E2E completa en navegador sigue pendiente.
- [ ] **Descripción para el portal (100–150 palabras):**
- [x] **Presentación:** [Canva](https://www.canva.com/design/DAHY9C-6uTY/U-A7j4CnlHb4YUFBDyBA4g/edit), incluida en el formulario.
- **Video:** opcional; no presentado.
- **Descripción para el portal (100–150 palabras):** la descripción del proyecto fue enviada en el formulario; este repositorio no conserva una copia verificada del texto exacto.
- [x] **Tecnologías:** HTML, CSS y JavaScript; Python; Qiskit Statevector y StatevectorSampler; Vercel.
- [ ] **Diferencial educativo:** el jugador predice y experimenta antes de reunir evidencias; la frecuencia observada no decide la culpabilidad. La audiencia 14+ es propuesta y el impacto educativo todavía no está validado.
- [x] **Envío:** el equipo confirma que el formulario de la hackathon fue enviado con GitHub, Canva y la demo. La confirmación/recibo no está archivada en el repositorio.

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
- La presentación Canva y los nombres de los cuatro integrantes fueron confirmados por el equipo. El video era opcional y no se presentó.

## Información pendiente

El recibo del formulario no está archivado en el repositorio. El texto exacto de la descripción enviada tampoco se conserva aquí. El video no se presentó porque era opcional.
