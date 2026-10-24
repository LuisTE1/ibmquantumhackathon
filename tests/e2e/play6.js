const { chromium } = require('playwright');
const OUT = './output/';
const BASE = process.argv[2] || 'http://localhost:8765/';
(async () => {
  const b = await chromium.launch({ channel: 'chrome' });
  const errors = [];
  const ctx = await b.newContext({ viewport: { width: 390, height: 780 }, hasTouch: true, isMobile: true, serviceWorkers: 'block' });
  const p = await ctx.newPage();
  p.on('console', (m) => { if (m.type() === 'error' && !/api\/run|404|Failed to load resource/.test(m.text())) errors.push(m.text()); });
  p.on('pageerror', (e) => errors.push('PAGEERROR ' + e.message));
  await p.goto(BASE, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(1200);
  const stage = () => p.evaluate(() => window.QF.S().stage);
  const click = async (re) => { await p.getByRole('button', { name: re }).first().click(); await p.waitForTimeout(250); };
  const talk = async () => { while (await p.locator('#dialog:not([hidden])').count()) { await p.locator('#dialog').click(); await p.waitForTimeout(100); } };
  const skip = async () => { await p.waitForTimeout(300); if (await p.getByRole('button', { name: /Saltar lección/ }).count()) { await p.getByRole('button', { name: /Saltar lección/ }).first().click(); await p.waitForTimeout(300); } };
  let shots = 0;
  const fight = async (name) => {
    await skip(); await p.waitForTimeout(500);
    if (!shots++) await p.screenshot({ path: OUT + 'v6_combate_inicio.png' });
    let n = 0;
    for (let guard = 0; guard < 40; guard++) {
      const info = await p.evaluate(() => { const f = window.QF.foes().find((x) => !x.dead); if (!f) return null; const S = window.QF.S(); S.px = Math.max(5, f.x - 3); S.py = Math.min(92, f.y + 4); return Math.abs(f.v[1]) > 0.999 ? '1' : f.v[0] * f.v[1] > 0 ? '+' : '-'; });
      if (!info) break;
      if (shots === 1 && n === 1) await p.screenshot({ path: OUT + 'v6_combate_medio.png' });
      for (const g of (info === '1' ? ['x'] : info === '+' ? ['h'] : ['h', 'x'])) { await p.evaluate((gg) => window.QF.attack(gg), g); n++; await p.waitForTimeout(80); }
    }
    console.log(' ' + name + ': glitches eliminados con', n, 'disparos | foes restantes:', await p.evaluate(() => window.QF.foes().length));
    await p.waitForTimeout(300);
  };
  await p.screenshot({ path: OUT + 'v6_intro.png' });
  await click(/Jugar/); await talk();
  await p.evaluate(() => window.QF.interact('inti')); await talk();
  console.log('etapa tras Inti:', await stage());
  await fight('ola 1');
  await p.evaluate(() => window.QF.interact('quilla')); await skip();
  for (let i = 0; i < 3; i++) { await click(/Medir 10 veces/); await p.waitForTimeout(500); }
  await p.locator('input[value=no]').check(); await click(/Responder/); await p.waitForTimeout(300); await click(/Continuar/);
  console.log('etapa tras muestra:', await stage());
  await p.evaluate(() => { const s = window.QF.S(); s.room = 'control'; window.QF.render(); });
  await fight('ola 2');
  await p.evaluate(() => window.QF.interact('consola')); await skip();
  await p.locator('input[value=h]').check(); await click(/▶ H → X/); await p.waitForTimeout(400); await click(/▶ H → H/); await p.waitForTimeout(500); await click(/Guardar en libreta/);
  console.log('etapa tras consola:', await stage());
  await p.evaluate(() => { const s = window.QF.S(); s.room = 'taller'; window.QF.render(); });
  await p.evaluate(() => window.QF.interact('rumi')); await talk();
  await fight('ola 3');
  await p.evaluate(() => window.QF.interact('caja')); await skip();
  await p.locator('#d0').selectOption('x'); await p.locator('#d1').selectOption('x'); await click(/Ejecutar/); await p.waitForTimeout(800);
  await click(/Leer auditoría/); await p.waitForTimeout(250); await click(/Cerrar/);
  console.log('etapa tras caja:', await stage());
  await p.evaluate(() => { const s = window.QF.S(); s.room = 'central'; window.QF.render(); });
  await p.evaluate(() => window.QF.interact('sami')); await talk(); await skip();
  await p.locator('[data-up="1"]').click(); await p.waitForTimeout(150); await p.locator('[data-up="2"]').click(); await p.waitForTimeout(150);
  await p.locator('input[name=ev][value="1"]').check(); await click(/Acusar/); await talk();
  console.log('etapa tras resolver:', await stage());
  await fight('ola 4 (jefe)');
  await p.evaluate(() => window.QF.interact('quilla')); await skip();
  await p.locator('[data-c="1"]').click(); await p.waitForTimeout(150); await click(/Comprobar/); await p.waitForTimeout(700); await click(/Reactivar QUILLA/); await p.waitForTimeout(400);
  console.log('etapa final:', await stage(), '| XP:', await p.evaluate(() => window.QF.S().xp), '| bichos:', await p.evaluate(() => window.QF.S().kills), '| insignias:', await p.evaluate(() => window.QF.S().badges.join(',')));
  console.log('errores:', errors.length ? errors : 'ninguno');
  await b.close();
})();
