const { chromium } = require('playwright');
const OUT = './output/';
const BASE = process.argv[2] || 'http://localhost:8765/';
(async () => {
  const b = await chromium.launch({ channel: 'chrome' });
  const errors = [];
  async function setup(opts) {
    const ctx = await b.newContext(Object.assign({ serviceWorkers: 'block' }, opts));
    const p = await ctx.newPage();
    p.on('pageerror', (e) => errors.push('PAGEERROR ' + e.message));
    await p.goto(BASE, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(1200);
    await p.getByRole('button', { name: /Jugar/ }).click(); await p.waitForTimeout(300);
    while (await p.locator('#dialog:not([hidden])').count()) { await p.locator('#dialog').click(); await p.waitForTimeout(80); }
    await p.evaluate(() => window.QF.interact('inti'));
    await p.waitForTimeout(200);
    while (await p.locator('#dialog:not([hidden])').count()) { await p.locator('#dialog').click(); await p.waitForTimeout(80); }
    await p.waitForTimeout(400);
    if (await p.getByRole('button', { name: /Saltar lección/ }).count()) { await p.getByRole('button', { name: /Saltar lección/ }).first().click(); await p.waitForTimeout(500); }
    return p;
  }
  const alive = (p) => p.evaluate(() => window.QF.foes().filter((f) => !f.dead).length);
  const kindOf = (p, i) => p.evaluate((i) => { const f = window.QF.foes()[i]; return Math.abs(f.v[1]) > 0.999 ? '1' : f.v[0] * f.v[1] > 0 ? '+' : '-'; }, i);

  // ---- PC: clic en el glitch + teclas, SIN teletransportar al jugador
  const p = await setup({ viewport: { width: 1100, height: 760 } });
  console.log('PC · glitches al empezar:', await alive(p));
  await p.locator('.foe').first().click({ force: true }); await p.waitForTimeout(300);
  console.log('PC · clic en glitch -> panel dice:', (await p.locator('#sc-bub').innerText()).slice(0, 60));
  await p.screenshot({ path: OUT + 'v7_pc_combate.png' });
  const t0 = Date.now();
  for (let guard = 0; guard < 25 && (await alive(p)); guard++) {
    const idx = await p.evaluate(() => window.QF.foes().findIndex((f) => !f.dead));
    await p.evaluate((i) => window.QF.focusFoe(i), idx);
    const k = await kindOf(p, idx);
    for (const key of (k === '1' ? ['x'] : k === '+' ? ['h'] : ['h', 'x'])) {
      await p.keyboard.press(key);
      for (let w = 0; w < 40; w++) { await p.waitForTimeout(150); const st = await p.evaluate((i) => { const f = window.QF.foes()[i]; return f ? f.dead || f.hist.length : true; }, idx); if (st === true || st >= 1 || (await p.evaluate(() => !window.QF.foes().length))) break; }
    }
  }
  console.log('PC · quedan vivos:', await alive(p), '| ola superada:', await p.evaluate(() => !!window.QF.S().waves[1]), '| tardó', ((Date.now() - t0) / 1000).toFixed(1), 's | disparos auto-dirigidos (sin teletransporte)');
  await p.context().close();

  // ---- móvil: botones táctiles ⚡X / 🌀H
  const m = await setup({ viewport: { width: 390, height: 780 }, hasTouch: true, isMobile: true });
  console.log('Móvil · botones visibles:', await m.locator('#btn-ax').isVisible(), await m.locator('#btn-ah').isVisible());
  await m.screenshot({ path: OUT + 'v7_movil_combate.png' });
  for (let guard = 0; guard < 25 && (await alive(m)); guard++) {
    const idx = await m.evaluate(() => window.QF.foes().findIndex((f) => !f.dead));
    await m.evaluate((i) => window.QF.focusFoe(i), idx);
    const k = await kindOf(m, idx);
    for (const g of (k === '1' ? ['x'] : k === '+' ? ['h'] : ['h', 'x'])) {
      await m.locator(g === 'x' ? '#btn-ax' : '#btn-ah').tap();
      for (let w = 0; w < 40; w++) { await m.waitForTimeout(150); const st = await m.evaluate((i) => { const f = window.QF.foes()[i]; return f ? f.dead || f.hist.length : true; }, idx); if (st === true || st >= 1 || (await m.evaluate(() => !window.QF.foes().length))) break; }
    }
  }
  console.log('Móvil · quedan vivos:', await alive(m), '| ola superada:', await m.evaluate(() => !!window.QF.S().waves[1]));
  console.log('errores:', errors.length ? errors : 'ninguno');
  await b.close();
})();
