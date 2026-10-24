const { chromium } = require('playwright');
const OUT = './output/';
const BASE = process.argv[2] || 'http://localhost:8765/';
(async () => {
  const b = await chromium.launch({ channel: 'chrome' });
  for (const dev of [{ n: 'PC 1100x760', o: { viewport: { width: 1100, height: 760 } } }, { n: 'MÓVIL 390x780', o: { viewport: { width: 390, height: 780 }, hasTouch: true, isMobile: true } }]) {
    const ctx = await b.newContext(Object.assign({ serviceWorkers: 'block' }, dev.o));
    const p = await ctx.newPage(); const errors = [], rows = [];
    p.on('console', (m) => { if (m.type() === 'error' && !/api\/run|404|Failed to load resource/.test(m.text())) errors.push(m.text()); });
    p.on('pageerror', (e) => errors.push('PAGEERROR ' + e.message));
    await p.goto(BASE, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(1200);
    const shortName = dev.n.startsWith('PC') ? 'pc' : 'mv';
    const chk = async (name, shot) => {
      await p.waitForTimeout(250);
      const r = await p.evaluate(() => { const st = document.getElementById('stage').getBoundingClientRect(), sd = document.getElementById('side').getBoundingClientRect(), md = document.getElementById('modal'); return { over: document.documentElement.scrollWidth - innerWidth, stageW: Math.round(st.width), stageInView: st.left >= -1 && st.right <= innerWidth + 1, sideW: Math.round(sd.width), modal: !md.hidden, sheetOK: md.hidden || (() => { const sh = md.querySelector('.sheet').getBoundingClientRect(); return sh.left >= -1 && sh.right <= innerWidth + 1; })() }; });
      rows.push([name, r.over <= 1 ? 'OK' : 'DESBORDE +' + r.over, r.stageInView ? 'OK' : 'FUERA', r.sheetOK ? 'OK' : 'FUERA', errors.length ? 'ERR' : 'OK']);
      if (shot) await p.screenshot({ path: OUT + `ver_${shortName}_${shot}.png` });
    };
    const click = async (re) => { await p.getByRole('button', { name: re }).first().click(); await p.waitForTimeout(250); };
    const talk = async () => { while (await p.locator('#dialog:not([hidden])').count()) { await p.locator('#dialog').click(); await p.waitForTimeout(80); } };
    const lessonSkip = async (label, shot) => { await p.waitForTimeout(350); if (await p.getByRole('button', { name: /Saltar lección/ }).count()) { await chk('lección: ' + label, shot); await p.getByRole('button', { name: /Saltar lección/ }).first().click(); await p.waitForTimeout(350); } };
    const kill = async () => { for (let g = 0; g < 40; g++) { const k = await p.evaluate(() => { const f = window.QF.foes().find((x) => !x.dead); if (!f) return null; const S = window.QF.S(); S.px = Math.max(5, f.x - 3); S.py = Math.min(92, f.y + 4); return Math.abs(f.v[1]) > 0.999 ? '1' : f.v[0] * f.v[1] > 0 ? '+' : '-'; }); if (!k) break; for (const key of (k === '1' ? ['x'] : k === '+' ? ['h'] : ['h', 'x'])) { await p.keyboard.press(key); await p.waitForTimeout(120); } } await p.waitForTimeout(300); };

    await chk('intro (contexto)', 'intro');
    await click(/Jugar/); await p.waitForTimeout(300); await chk('apertura (3 líneas)', 'apertura'); await talk();
    await p.evaluate(() => window.QF.interact('inti')); await talk(); await chk('Inti conversación corta');
    await lessonSkip('cazar glitches', 'leccion');
    await p.waitForTimeout(400);
    // teclas J/K ya no disparan; X/H sí
    const antes = await p.evaluate(() => window.QF.S().kills + window.QF.foes().reduce((n, f) => n + f.hist.length, 0));
    await p.keyboard.press('j'); await p.keyboard.press('k'); await p.waitForTimeout(250);
    const trasJK = await p.evaluate(() => window.QF.S().kills + window.QF.foes().reduce((n, f) => n + f.hist.length, 0));
    await chk('combate ola 1', 'combate');
    await kill();
    rows.push(['J/K no disparan (solo X y H)', trasJK === antes ? 'OK' : 'FALLA', '', '', '']);
    rows.push(['ola 1 superada con X/H', (await p.evaluate(() => !!window.QF.S().waves[1])) ? 'OK' : 'FALLA', '', '', '']);
    await p.evaluate(() => window.QF.interact('quilla')); await lessonSkip('muestra', 'leccion_muestra');
    await click(/Medir 10 veces/); await p.waitForTimeout(2200);
    const coins = await p.evaluate(() => { const c = [...document.querySelectorAll('#p1out .cn')].map((x) => x.textContent.trim()); const h = document.getElementById('p1hist').innerText.match(/(\d+)\/(\d+)/); return { n: c.length, sinRevelar: c.filter((x) => x === '?').length, unos: c.filter((x) => x === '1').length, hist: h ? +h[1] : -1 }; });
    rows.push(['monedas: 10 giran y se voltean', coins.n === 10 && coins.sinRevelar === 0 ? 'OK' : 'FALLA', `unos=${coins.unos}`, `histórico=${coins.hist}`, coins.unos === coins.hist ? 'OK' : 'NO COINCIDE']);
    await chk('puzle muestra (monedas)', 'muestra');
    for (let i = 0; i < 2; i++) { await click(/Medir 10 veces/); await p.waitForTimeout(500); }
    await p.locator('input[value=no]').check(); await click(/Responder/); await p.waitForTimeout(300); await click(/Continuar/);
    await p.evaluate(() => { const s = window.QF.S(); s.room = 'control'; window.QF.render(); }); await p.waitForTimeout(400);
    await chk('sala de control + combate ola 2', 'control'); await kill();
    await p.evaluate(() => window.QF.interact('consola')); await lessonSkip('consola', 'leccion_consola');
    await p.locator('input[value=h]').check(); await click(/▶ H → X/); await p.waitForTimeout(400); await click(/▶ H → H/); await p.waitForTimeout(500); await chk('consola (circuitos y flechas)', 'consola'); await click(/Guardar en libreta/);
    await p.evaluate(() => { const s = window.QF.S(); s.room = 'taller'; window.QF.render(); });
    await p.evaluate(() => window.QF.interact('rumi')); await talk();
    await p.waitForTimeout(300); await lessonSkip('glitches difíciles'); await chk('taller + combate ola 3', 'taller'); await kill();
    await p.evaluate(() => window.QF.interact('caja')); await lessonSkip('diagnóstico');
    await p.locator('#d0').selectOption('x'); await p.locator('#d1').selectOption('x'); await click(/Ejecutar/); await p.waitForTimeout(1000); await chk('diagnóstico (monedas se voltean)', 'diag');
    const dc = await p.evaluate(() => [...document.querySelectorAll('#dout .cn')].map((x) => x.textContent.trim()).join(','));
    rows.push(['diagnóstico: 0➜1 y 1➜0', dc === '0,1,1,0' ? 'OK' : 'VER: ' + dc, '', '', '']);
    await click(/Leer auditoría/); await chk('auditoría', 'audit'); await click(/Cerrar/);
    await p.evaluate(() => { const s = window.QF.S(); s.room = 'central'; window.QF.render(); });
    await p.evaluate(() => window.QF.interact('sami')); await talk(); await lessonSkip('acusación');
    await chk('ordenar hechos', 'resolver');
    await p.locator('[data-up="1"]').click(); await p.waitForTimeout(150); await p.locator('[data-up="2"]').click(); await p.waitForTimeout(150);
    await p.locator('input[name=ev][value="1"]').check(); await click(/Acusar/); await talk();
    await chk('combate ola 4 (jefe)', 'jefe'); await kill();
    await p.evaluate(() => window.QF.interact('quilla')); await lessonSkip('reparar');
    await p.locator('[data-c="1"]').click(); await p.waitForTimeout(150); await click(/Comprobar/); await p.waitForTimeout(1900); await chk('reparar (monedas)', 'reparar'); await click(/Reactivar QUILLA/); await p.waitForTimeout(400);
    await chk('final', 'final');
    await p.getByRole('button', { name: /Jugar desafíos/ }).click(); await p.waitForTimeout(300);
    await p.locator('input[name=c]').first().check(); await click(/Comprobar/); await p.waitForTimeout(2800); await chk('desafío (20 monedas)', 'desafio');
    await p.evaluate(() => window.QF.closeModal()); await p.locator('#btn-book').click(); await p.waitForTimeout(250); await chk('libreta', 'libreta');
    console.log(`\n=== ${dev.n} === (desborde | escenario dentro | ventana dentro | errores JS)`);
    rows.forEach((r) => console.log(' ' + r[0].padEnd(40), r.slice(1).filter(Boolean).join(' | ')));
    console.log(' errores de consola/página:', errors.length ? errors : 'ninguno');
    await ctx.close();
  }
  await b.close();
})();
