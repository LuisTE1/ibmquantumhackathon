# Pruebas de extremo a extremo (navegador real)
Requieren Node 20+ y Playwright (`npm i playwright`) y Google Chrome. Sirve el juego primero:
```
python web/serve_local.py        # http://localhost:8765  (o usa la URL pública de Vercel)
node tests/e2e/verify.js         # recorre los 27 escenarios en PC y móvil: desbordes, errores, monedas, teclas X/H
node tests/e2e/play6.js          # caso completo (4 olas, 7 etapas)
node tests/e2e/play7.js          # disparo con clic/teclas y botones táctiles, sin teletransportar
```
Pasa una URL como primer argumento para probar producción. Las capturas se guardan en `./output/`.
