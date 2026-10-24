/* Quantum Files — Caso 01: El experimento fantasma. Juego de investigación (PWA). v5: Profe Cuy, circuitos y estados dibujados */
(function () {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };

  // ------------------------------------------------------------------ datos
  const CHAR = {
    cuy: ["🐹", "Detective Cuy", "img/cuy_idle.png"], killa: ["🐇", "Killa"], inti: ["🦅", "Inti"], rumi: ["🦊", "Rumi"],
    sami: ["🦙", "Sami", "img/llama.png"], amaru: ["🐆", "Amaru"], phi: ["Φ", "Φ"], sys: ["🌙", "Narrador"],
  };
  const ROOMS = {
    central: { name: "Sala central", cls: "r-central", objs: [
      { id: "inti", e: "🦅", l: "Inti", x: 20, y: 34 }, { id: "sami", e: "img:img/llama.png", l: "Sami", x: 74, y: 30 },
      { id: "killa", e: "🐇", l: "Killa", x: 84, y: 72 }, { id: "quilla", e: "🌀", l: "QUILLA", x: 48, y: 50, big: 1 },
      { id: "d_control", e: "🚪", l: "Control", x: 90, y: 47, door: ["control", 12, 50] },
      { id: "d_taller", e: "🚪", l: "Taller", x: 8, y: 80, door: ["taller", 88, 50] } ] },
    control: { name: "Sala de control", cls: "r-control", objs: [
      { id: "consola", e: "🖥️", l: "Consola", x: 50, y: 34, big: 1 }, { id: "amaru", e: "🐆", l: "Amaru", x: 24, y: 62 },
      { id: "d_central1", e: "🚪", l: "Central", x: 8, y: 50, door: ["central", 86, 47] } ] },
    taller: { name: "Taller", cls: "r-taller", objs: [
      { id: "rumi", e: "🦊", l: "Rumi", x: 30, y: 46 }, { id: "caja", e: "📦", l: "Caja", x: 66, y: 62, big: 1 },
      { id: "d_central2", e: "🚪", l: "Central", x: 90, y: 50, door: ["central", 14, 78] } ] },
  };
  const OBJECTIVE = ["Habla con Inti 🦅", "Ve a QUILLA 🌀", "Usa la consola 🖥️", "Habla con Rumi 🦊", "Abre la caja 📦", "Habla con Sami 🦙", "Repara QUILLA 🌀", "¡Caso resuelto! Prueba 🧪"];
  const GOAL = [["central", "inti"], ["central", "quilla"], ["control", "consola"], ["taller", "rumi"], ["taller", "caja"], ["central", "sami"], ["central", "quilla"], null];
  const EVID = {
    reg73: ["Registro inicial", "7 unos y 3 ceros: puede ser azar."],
    diseno: ["Diseño aprobado", "|0⟩ → H → medir (50/50)."],
    hh: ["Circuito ejecutado", "|0⟩ → H → H → medir: siempre 0."],
    t2114: ["21:14 · Cambio del circuito", "Sin autor visible. Hay copia en el módulo."],
    t2119: ["21:19 · Rumi retira el módulo", "Fue DESPUÉS del cambio."],
    amaru: ["Testimonio de Amaru", "Vio a Rumi salir con una caja… después."],
    rumi: ["Confesión de Rumi", "Retiró el módulo y lo ocultó por miedo."],
    audit: ["Auditoría recuperada", "21:14 · sesión de Sami · 2.ª H añadida · registro borrado · archivo PHI."],
  };
  const RANKS = [[0, "Novato"], [30, "Detective"], [70, "Inspector"], [120, "Inspector Cuántico"]];
  const BADGES = {
    esceptico: ["🧐", "Escéptico", "Descartaste una falsa pista a la primera"], predictor: ["🔮", "Predictor", "Acertaste una predicción antes de medir"],
    mecanico: ["🔧", "Mecánico", "Diagnóstico a la primera"], cadena: ["🧩", "Cadena perfecta", "Ordenaste hechos y evidencia a la primera"],
    racha: ["⚡", "Racha cuántica", "5 desafíos seguidos"], sinpistas: ["🧠", "Sin pistas", "Caso resuelto sin pistas"],
    cazador: ["🐛", "Cazador de glitches", "Bichos eliminados con el mínimo de movimientos"],
  };
  const QUIZ = {
    pre: [
      ["10 lanzamientos de una moneda justa: ¿siempre 5 caras?", ["Sí, siempre", "No, varía", "Solo si lanzas rápido"], 1, "Varía: 5 es lo más probable, pero no seguro."],
      ["Mides un qubit 50/50. ¿Qué obtienes?", ["Siempre 0", "Siempre 1", "0 o 1 al azar"], 2, "Da 0 o 1, cada uno con su probabilidad."],
      ["7 unos de 10 en un experimento 50/50: ¿prueba que lo alteraron?", ["Sí, seguro", "No, puede ser azar", "Solo con más de 10"], 1, "Con 10 mediciones el azar lo explica (pasa ~17 % de las veces)."],
    ],
    post: [
      ["Dos H seguidas a un qubit en 0 (sin medir en medio). Al medir:", ["50/50", "Siempre 0", "Siempre 1"], 1, "La 2.ª H deshace la 1.ª: la flecha vuelve arriba (0)."],
      ["¿Qué hace la compuerta X?", ["Intercambia 0 y 1", "Mide", "No hace nada"], 0, "X le da la vuelta a la moneda: 0↔1."],
      ["¿Qué sostiene una acusación?", ["Una respuesta incorrecta", "Evidencia que se refuerza", "Una sospecha"], 1, "Hace falta evidencia que se refuerce entre sí."],
    ],
  };

  // ------------------------------------------------------------------ gráficos: circuitos estilo Qiskit y círculo de estado
  const S2 = Math.SQRT1_2;
  const START = { "0": [1, 0], "1": [0, 1], "+": [S2, S2], "-": [S2, -S2] };
  const KET = { "0": "|0⟩", "1": "|1⟩", "+": "|+⟩", "-": "|−⟩" };
  const applyG = (g, v) => (g === "x" ? [v[1], v[0]] : [S2 * (v[0] + v[1]), S2 * (v[0] - v[1])]);
  const trace = (gates, start = "0") => { const out = [START[start].slice()]; gates.forEach((g) => out.push(applyG(g, out[out.length - 1]))); return out; };
  const GCOL = { h: "#4da3ff", x: "#ff7a7a", "?": "none" };
  function circuit(gates, o = {}) {
    const gw = 54, x0 = 92, n = gates.length + (o.measure === false ? 0 : 1), W = x0 + n * gw + 24, y = 38;
    let s = `<svg class="circ" viewBox="0 0 ${W} 76" role="img" aria-label="Circuito cuántico: ${gates.map((g) => g.toUpperCase()).join(', ') || 'sin compuertas'}">`;
    s += `<text x="6" y="${y + 5}" fill="#f5e9d0" font-size="15">q₀:</text><text x="38" y="${y + 6}" fill="#ffd24a" font-size="17" font-weight="800">${KET[o.start || "0"]}</text>`;
    s += `<line x1="84" y1="${y}" x2="${W - 8}" y2="${y}" stroke="#f5e9d0" stroke-width="2"/>`;
    gates.forEach((g, i) => {
      const cx = x0 + i * gw + 20, q = g === "?";
      s += `<rect x="${cx - 19}" y="${y - 19}" width="38" height="38" rx="6" fill="${GCOL[g]}" ${q ? 'stroke="#ffd24a" stroke-dasharray="5 4" stroke-width="2.5"' : 'stroke="#0007" stroke-width="1.5"'}/>`;
      s += `<text x="${cx}" y="${y + 7}" text-anchor="middle" font-size="${q ? 22 : 20}" font-weight="900" fill="${q ? "#ffd24a" : "#10202a"}">${q ? "?" : g.toUpperCase()}</text>`;
      if (o.caps && o.caps[i]) s += `<text x="${cx}" y="${y + 36}" text-anchor="middle" font-size="10.5" fill="#cfe">${o.caps[i]}</text>`;
    });
    if (o.measure !== false) { const cx = x0 + gates.length * gw + 20; s += `<rect x="${cx - 19}" y="${y - 19}" width="38" height="38" rx="6" fill="#cfd6d8" stroke="#0007"/><path d="M${cx - 11} ${y + 7} A11 11 0 0 1 ${cx + 11} ${y + 7}" fill="none" stroke="#10202a" stroke-width="2.5"/><line x1="${cx}" y1="${y + 7}" x2="${cx + 8}" y2="${y - 8}" stroke="#10202a" stroke-width="2.5"/>`; }
    return s + "</svg>";
  }
  function bloch(v, size = 110, o = {}) {
    const R = size * 0.36, c = size / 2, x = 2 * v[0] * v[1], z = v[0] * v[0] - v[1] * v[1], px = c + x * R, py = c - z * R, fs = size < 70 ? 9 : 12;
    const lab = o.labels === false ? "" : `<text x="${c}" y="${fs + 1}" text-anchor="middle" font-size="${fs}" fill="#9fd3ff">0</text><text x="${c}" y="${size - 2}" text-anchor="middle" font-size="${fs}" fill="#ff9d9d">1</text><text x="${size - 3}" y="${c + 4}" text-anchor="end" font-size="${fs}" fill="#ccc">+</text><text x="3" y="${c + 4}" font-size="${fs}" fill="#ccc">−</text>`;
    return `<svg class="bl" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" role="img" aria-label="Estado del qubit: ${stateText(v)}"><circle cx="${c}" cy="${c}" r="${R}" fill="#0b2a30" stroke="#c9833a" stroke-width="2"/><line x1="${c - R}" y1="${c}" x2="${c + R}" y2="${c}" stroke="#fff3"/><line x1="${c}" y1="${c - R}" x2="${c}" y2="${c + R}" stroke="#fff3"/>${lab}<line x1="${c}" y1="${c}" x2="${px}" y2="${py}" stroke="#ffd24a" stroke-width="${size < 70 ? 3 : 4}" stroke-linecap="round"/><circle cx="${px}" cy="${py}" r="${size < 70 ? 4 : 5.5}" fill="#ffd24a"/></svg>`;
  }
  const stateText = (v) => (Math.abs(v[0]) > 0.999 ? "100 % de 0" : Math.abs(v[1]) > 0.999 ? "100 % de 1" : "50 / 50");
  function traceRow(gates, start = "0") {
    const tr = trace(gates, start);
    let h = `<div class="trace"><div class="tstep">${bloch(tr[0], 78, { labels: false })}<small>inicio</small></div>`;
    gates.forEach((g, i) => { h += `<div class="tarr">→<b class="gtag g${g}">${g.toUpperCase()}</b>→</div><div class="tstep">${bloch(tr[i + 1], 78, { labels: false })}<small>${stateText(tr[i + 1])}</small></div>`; });
    return h + `</div>`;
  }
  const qcode = (gates, start = "0", measure = true) => ["from qiskit import QuantumCircuit", "qc = QuantumCircuit(1, 1)"].concat(start === "1" ? ["qc.x(0)   # empezar en |1⟩"] : [])
    .concat(gates.map((g) => `qc.${g}(0)` + (g === "h" ? "   # mezcla 0 y 1" : "   # voltea 0↔1"))).concat(measure ? ["qc.measure(0, 0)   # mirar la monedita"] : []).join("\n");
  const codeBox = (gates, start, measure) => `<details class="code"><summary>👩‍💻 Así lo escribe Qiskit</summary><pre>${qcode(gates, start, measure)}</pre></details>`;
  const coach = (html, kind = "") => `<div class="coach ${kind}"><img src="img/cuy_idle.png" alt="Profe Cuy"><div class="bub">${html}</div></div>`;
  const good = (html) => coach("✅ " + html, "good");
  const bad = (why, tip) => coach(`🙈 Oye, <b>no es así</b>: ${why}<br>💡 <b>Te recomiendo</b> ${tip}`, "bad");
  const idea = (t) => `<div class="idea">🎓 ${t}</div>`;
  const learned = (t) => `<div class="learned">✅ <b>Aprendiste:</b> ${t}</div>`;

  // ------------------------------------------------------------------ estado
  const KEY = "qf_state_v5";
  const fresh = () => ({ stage: 0, room: "central", px: 50, py: 82, evid: [], runs: 0, quiz: {}, quizFirst: {}, quizDet: {}, started: false, xp: 0, badges: [], hints: 0, mute: false, best: 0, tries: {}, pred: false, waves: {}, kills: 0, seen: {}, opened: false });
  let S = fresh();
  try { const r = JSON.parse(localStorage.getItem(KEY) || "null"); if (r && r.stage != null) S = Object.assign(fresh(), r); } catch (e) { /* sin almacenamiento */ }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* ignorar */ } };

  // ------------------------------------------------------------------ sonido y efectos
  let ac = null;
  function tone(f, d, type = "sine", v = 0.08, at = 0) {
    if (S.mute) return;
    try {
      ac = ac || new (window.AudioContext || window.webkitAudioContext)();
      const o = ac.createOscillator(), g = ac.createGain(), t0 = ac.currentTime + at;
      o.type = type; o.frequency.value = f; g.gain.setValueAtTime(v, t0); g.gain.exponentialRampToValueAtTime(0.0001, t0 + d);
      o.connect(g); g.connect(ac.destination); o.start(t0); o.stop(t0 + d);
    } catch (e) { /* sin audio */ }
  }
  const sfx = {
    ok() { [523, 659, 784].forEach((f, i) => tone(f, 0.18, "triangle", 0.09, i * 0.09)); }, bad() { tone(170, 0.28, "sawtooth", 0.06); },
    evid() { tone(880, 0.12, "sine", 0.07); tone(1175, 0.2, "sine", 0.07, 0.1); }, up() { [392, 523, 659, 784, 1047].forEach((f, i) => tone(f, 0.2, "triangle", 0.1, i * 0.08)); },
    hit() { tone(220, 0.08, "square", 0.05); }, kill() { tone(660, 0.07, "square", 0.07); tone(990, 0.12, "square", 0.07, 0.07); },
    alarm() { [440, 330, 440, 330].forEach((f, i) => tone(f, 0.2, "sawtooth", 0.05, i * 0.22)); },
  };
  function burst() {
    const c = el("div", "confetti"), em = ["🎉", "✨", "⭐", "🎊", "💫"];
    for (let i = 0; i < 24; i++) { const s = el("span", "", em[i % em.length]); s.style.left = Math.random() * 100 + "%"; s.style.animationDelay = Math.random() * 0.4 + "s"; c.appendChild(s); }
    document.body.appendChild(c); setTimeout(() => c.remove(), 2300);
  }
  const shake = (n) => { if (!n) return; n.classList.remove("shake"); void n.offsetWidth; n.classList.add("shake"); };
  const rankOf = (xp) => RANKS.filter((r) => xp >= r[0]).pop();
  function award(n) {
    if (!n) return;
    const before = rankOf(S.xp)[1]; S.xp += n; const after = rankOf(S.xp)[1];
    if (after !== before) { toast("⬆️ ¡Rango: " + after + "!"); burst(); sfx.up(); } else toast("+" + n + " XP");
    save(); hud();
  }
  function badge(id) { if (!S.badges.includes(id)) { S.badges.push(id); toast(BADGES[id][0] + " " + BADGES[id][1]); sfx.ok(); save(); } }

  // ------------------------------------------------------------------ cuántica (Qiskit en servidor o simulador local)
  async function runCircuit(gates, shots) {
    const seed = Math.floor(Math.random() * 1e6);
    try {
      const ctrl = new AbortController(); const t = setTimeout(() => ctrl.abort(), 3500);
      const r = await fetch("api/run", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ gates, shots, seed }), signal: ctrl.signal });
      clearTimeout(t);
      if (!r.ok) throw new Error("api");
      const j = await r.json();
      if (!j.counts || !j.probs) throw new Error("formato");
      return j;
    } catch (e) { return window.QSim.run(gates, shots, seed); }
  }
  const badgeSrc = (r) => r.source === "qiskit" ? `<span class="badge q">⚛️ Qiskit ${r.version || ""}</span>` : `<span class="badge l">💻 Simulador local</span>`;
  const bars = (c, shots) => ["0", "1"].map((k) => `<div class="barrow"><b>${k}</b><div class="bar"><i style="width:${(100 * c[k]) / shots}%"></i></div><span>${c[k]} (${Math.round((100 * c[k]) / shots)} %)</span></div>`).join("");

  // ------------------------------------------------------------------ UI base
  const stage = $("#stage"), playerEl = $("#player"), dlg = $("#dialog"), modal = $("#modal"), mbody = $("#mbody");
  let objEls = {}, busy = false, keys = {}, target = null, autoId = null, nearId = null, lines = [], lineDone = null, ASP = 0.625;
  const setBusy = (v) => { busy = v; document.body.classList.toggle("busy", v); };

  function say(arr, done) { lines = arr.slice(); lineDone = done || null; dlg.hidden = false; nextLine(); }
  function nextLine() {
    if (!lines.length) { dlg.hidden = true; dlg.classList.remove("phi"); const d = lineDone; lineDone = null; setBusy(!modal.hidden); if (d) d(); return; }
    const [who, text] = lines.shift(), c = CHAR[who] || CHAR.sys;
    setBusy(true); dlg.classList.toggle("phi", who === "phi"); $("#d-av").innerHTML = c[2] ? `<img src="${c[2]}" alt="">` : c[0]; $("#d-name").textContent = c[1]; $("#d-text").textContent = text;
  }
  function openModal(html) { mbody.innerHTML = html; modal.hidden = false; setBusy(true); mbody.scrollTop = 0; }
  function closeModal() { modal.hidden = true; setBusy(!dlg.hidden); render(); }
  function toast(t) { const n = $("#toast"); n.textContent = t; n.classList.add("on"); clearTimeout(toast.t); toast.t = setTimeout(() => n.classList.remove("on"), 2000); }
  function addEvid(id) { if (!S.evid.includes(id)) { S.evid.push(id); sfx.evid(); save(); award(5); toast("📓 " + EVID[id][0]); } }
  function setStage(n) { if (n > S.stage) { S.stage = n; save(); render(); } }

  // Profe Cuy: lección interactiva paso a paso (con demo opcional) antes de cada minijuego
  function lesson(key, title, slides, done) {
    let i = 0;
    const draw = () => {
      const s = slides[i];
      openModal(`<h2>🎓 ${title}</h2><div class="lesson"><div class="art">${s.art || ""}</div>${coach(s.say)}${s.demo ? `<div id="demo" class="demo"></div>` : ""}
        <div class="lnav"><button class="btn" id="lprev" ${i ? "" : "disabled"}>◀</button><span class="small">${i + 1}/${slides.length}</span><button class="btn big" id="lnext">${i < slides.length - 1 ? "Siguiente ▶" : "¡A practicar! ▶"}</button></div>
        <button class="btn" id="lskip">Saltar lección ⏭</button></div>`);
      if (s.demo) sandbox($("#demo"));
      $("#lprev").onclick = () => { if (i) { i--; draw(); } };
      $("#lnext").onclick = () => { if (i < slides.length - 1) { i++; draw(); } else fin(); };
      $("#lskip").onclick = fin;
    };
    const fin = () => { S.seen[key] = true; save(); closeModal(); done(); };
    draw();
  }
  const withLesson = (key, title, slides, start) => (S.seen[key] ? start() : lesson(key, title, slides, start));
  function sandbox(box) { // demo interactiva: aplica X o H y mira cómo se mueve la flecha
    let v = START["1"].slice(), hist = [];
    const draw = () => {
      box.innerHTML = `<div class="sbx"><div>${bloch(v, 120)}<small>${stateText(v)}</small></div><div class="sbr">${circuit(hist, { start: "1", measure: false })}<div class="row"><button class="btn" data-g="x">⚡ X</button><button class="btn" data-g="h">🌀 H</button><button class="btn" data-r="1">↺ Reiniciar</button></div></div></div>`;
      box.querySelectorAll("[data-g]").forEach((b) => b.onclick = () => { v = applyG(b.dataset.g, v); hist.push(b.dataset.g); sfx.hit(); if (hist.length > 5) hist.shift(); draw(); });
      box.querySelector("[data-r]").onclick = () => { v = START["1"].slice(); hist = []; draw(); };
    };
    draw();
  }

  function doorToward(from, to) { if (from === "central") return { control: "d_control", taller: "d_taller" }[to]; return from === "control" ? "d_central1" : "d_central2"; }
  function hud() {
    const r = rankOf(S.xp); $("#rank").textContent = `🏅 ${r[1]} · ${S.xp} XP`;
    $("#progbar").style.width = (Math.min(S.stage, 7) / 7) * 100 + "%";
    $("#evcount").textContent = S.evid.length; $("#btn-snd").textContent = S.mute ? "🔇" : "🔊";
    $("#btn-chal").classList.toggle("locked", S.stage < 5);
  }
  const bugRoom = () => ({ central: S.stage <= 1 && !S.waves[1] || S.stage === 6 && !S.waves[4], control: S.stage === 2 && !S.waves[2], taller: S.stage === 4 && !S.waves[3] });
  function render() {
    const room = ROOMS[S.room], g = GOAL[Math.min(S.stage, 7)];
    stage.className = "stage " + room.cls;
    $("#roomname").textContent = room.name;
    let obj = OBJECTIVE[Math.min(S.stage, 7)], goalId = null;
    if (g) { goalId = g[0] === S.room ? g[1] : doorToward(S.room, g[0]); if (g[0] !== S.room) obj += " → " + ROOMS[g[0]].name; }
    $("#objective").textContent = obj;
    stage.querySelectorAll(".obj,.roam").forEach((n) => n.remove());
    objEls = {};
    room.objs.forEach((o) => {
      const art = o.e.startsWith("img:") ? `<img src="${o.e.slice(4)}" alt="" draggable="false">` : `<span class="em">${o.e}</span>`;
      const n = el("button", "obj" + (o.big ? " big" : "") + (o.door ? " door" : "") + (o.id === goalId ? " goal" : "") + (o.id === "quilla" ? " quilla" : ""), `${art}<span class="lb">${o.door ? "→ " : ""}${o.l}</span>`);
      n.style.left = o.x + "%"; n.style.top = o.y + "%"; n.dataset.id = o.id; n.setAttribute("aria-label", o.l);
      n.addEventListener("click", (ev) => { ev.stopPropagation(); goTo(o); });
      stage.appendChild(n); objEls[o.id] = n;
    });
    if (bugRoom()[S.room]) for (let i = 0; i < 3; i++) { const b = el("img", "roam r" + i); b.src = "img/bug" + (i % 2) + ".png"; b.alt = ""; stage.appendChild(b); }
    placePlayer(); hud(); fit();
  }
  function placePlayer() { playerEl.style.left = S.px + "%"; playerEl.style.top = S.py + "%"; }
  const objOf = (id) => Object.values(ROOMS).flatMap((r) => r.objs).find((o) => o.id === id);
  const dist = (ax, ay, bx, by) => Math.hypot(ax - bx, (ay - by) * ASP);

  function goTo(o) { if (busy) return; if (dist(S.px, S.py, o.x, o.y) < 13) interact(o.id); else { target = { x: o.x, y: Math.min(o.y + 6, 92) }; autoId = o.id; } }
  function interact(id) {
    if (busy) return;
    const o = objOf(id);
    if (o && o.door) { S.room = o.door[0]; S.px = o.door[1]; S.py = o.door[2]; target = null; autoId = null; save(); render(); toast("📍 " + ROOMS[S.room].name); return; }
    (HANDLERS[id] || (() => {}))();
  }

  // ------------------------------------------------------------------ personajes: conversaciones
  const HANDLERS = {
    killa() {
      const t = ["Habla con Inti 🦅. ¡Sigue la flecha amarilla ▼!", "Ve a QUILLA 🌀 y elimina los glitches.", "En la consola 🖥️ (sala de Control) compararemos el circuito.", "Rumi 🦊 sabe dónde está el módulo. Búscalo en el Taller.",
        "Abre la caja 📦: es un diagnóstico con la compuerta X.", "Sami 🦙 debe explicar la edición de las 21:14.", "Repara QUILLA 🌀: quita la H extra.", "¡Listo! Prueba los desafíos 🧪 para subir de rango."];
      say([["killa", t[Math.min(S.stage, 7)]]]);
    },
    inti() {
      if (S.stage === 0) {
        say([["inti", "Detective Cuy, gracias por venir. Soy Inti, director de Qori Lab."],
          ["inti", "Esta es QUILLA 🌀: una máquina que trabaja con qubits. Imagina un qubit como una monedita especial: al mirarla —medirla— sale 0 o 1."],
          ["cuy", "¿Y qué pasó anoche, Inti?"],
          ["inti", "Alguien cambió el circuito de QUILLA y desapareció el módulo de calibración. Ahora sus resultados salen raros."],
          ["inti", "Mira este registro: de 10 mediciones, 7 dieron 1 y 3 dieron 0. Yo creo que eso prueba un sabotaje."],
          ["killa", "Eso habría que comprobarlo, Inti. Una sola muestra pequeña puede engañar."],
          ["inti", "Por eso necesito que averigües TRES cosas: ¿qué cambiaron?, ¿quién lo hizo? y ¿dónde está el módulo?"],
          ["killa", "Yo seré tu Profe: te enseñaré a leer los circuitos paso a paso. ¡Vamos a QUILLA 🌀!"]], () => { addEvid("reg73"); setStage(1); });
      } else say([["inti", S.stage >= 2 ? "Recuerda: el diseño aprobado era |0⟩ → H → medir. Eso debe dar 50/50." : "Usa la copia de prueba en QUILLA y dime si hay sabotaje."]]);
    },
    amaru() {
      say([["amaru", "Soy Amaru, el vigilante. Anoche vi a Rumi salir con una caja."], ["cuy", "¿Antes o después de la alerta?"], ["amaru", "Después de la alerta, seguro. Eso sí te lo juro."]], () => addEvid("amaru"));
    },
    sami() {
      if (S.stage < 5) return say([["sami", "¡Hola, detective! Yo solo preparé los gráficos de la presentación."], ["cuy", "¿Entraste a la sala anoche?"], ["sami", "Eh… pasé a dejar unos archivos. Nada raro."]]);
      if (S.stage === 5) return say([["cuy", "Sami, tengo la auditoría: la edición de las 21:14 salió de tu sesión."], ["sami", "…"], ["killa", "Ordenemos los hechos para que no queden dudas."]], puzzleResolve);
      say([["sami", "Quería una demo perfecta. El archivo con la firma Φ me dijo exactamente qué cambiar."], ["cuy", "Φ… ¿quién será?"]]);
    },
    rumi() {
      if (S.stage < 3) return say([["rumi", "¿Yo? Solo revisé el equipo, detective."], ["cuy", "Volveré con los horarios."]]);
      if (S.stage === 3) return say([["cuy", "Rumi, el circuito cambió a las 21:14. Tú retiraste el módulo a las 21:19."], ["rumi", "¿Cinco minutos después? …Está bien. Lo retiré porque vi la modificación."],
        ["cuy", "¿Y por qué no avisaste?"], ["rumi", "Tuve miedo de que pensaran que fui yo. Toma la caja: para leer su memoria hay que demostrar que responde."], ["killa", "Es un diagnóstico con la compuerta X. ¡Yo te explico!"]], () => { addEvid("rumi"); setStage(4); });
      say([["rumi", "La caja está sobre la mesa. Perdón por no avisar antes."]]);
    },
    quilla() {
      if (S.stage < 1) return say([["killa", "Habla primero con Inti."]]);
      if (S.stage === 6) return glitchWave(4, puzzleRestore);
      if (S.stage >= 7) return say([["sys", "QUILLA funciona de nuevo: |0⟩ → H → medir."]]);
      S.stage === 1 ? glitchWave(1, puzzleSample) : puzzleSample();
    },
    consola() {
      if (S.stage < 2) return say([["killa", "Primero analiza la muestra en QUILLA."]]);
      S.stage === 2 ? glitchWave(2, puzzleCircuit) : puzzleCircuit();
    },
    caja() {
      if (S.stage < 4) return say([["sys", "Una caja cerrada. Habla con Rumi."]]);
      S.stage === 4 ? glitchWave(3, puzzleDiag) : puzzleDiag();
    },
  };

  // ------------------------------------------------------------------ lecciones del Profe Cuy
  const L = {
    glitch1: ["Cómo cazar glitches", [
      { say: "¡Bichos! Cada glitch es un <b>qubit</b>: una monedita especial. <b>Cara = 0</b> y <b>sello = 1</b>. Para eliminarlo hay que dejarlo en <b>0</b>.", art: `<div class="coins"><span>🪙<small>0 (cara)</small></span><span>🪙<small>1 (sello)</small></span></div>` },
      { say: "Para ver en qué estado está, miramos esta <b>flecha</b>: si apunta <b>arriba</b> es 0, si apunta <b>abajo</b> es 1, y si apunta a un <b>lado</b> es 50/50 (mitad y mitad).", art: bloch(START["0"], 120) + bloch(START["1"], 120) + bloch(START["+"], 120) },
      { say: "Tienes 2 herramientas. <b>⚡X</b> le da la vuelta a la moneda: de 1 pasa a 0. <b>🌀H</b> la mezcla: de 0 pasa a 50/50 y de 50/50 vuelve a 0. ¡Pruébalas tú!", art: "", demo: true },
    ]],
    glitch3: ["Glitches difíciles", [
      { say: "Cuidado: |+⟩ y |−⟩ <b>parecen iguales</b> (los dos son 50/50) pero la flecha apunta a lados <b>distintos</b>. Con H: |+⟩ va a 0 y |−⟩ va a 1.", art: bloch(START["+"], 110) + bloch(START["-"], 110) },
      { say: "Entonces a un |−⟩ hay que aplicarle <b>H</b> (queda en 1) y luego <b>X</b> (pasa a 0). ¡Dos movimientos!", art: traceRow(["h", "x"], "-") },
    ]],
    sample: ["La muestra de prueba", [
      { say: "Esto es un <b>circuito cuántico</b>. Se lee de izquierda a derecha: empieza en |0⟩, pasa por la compuerta <b>H</b> y al final se <b>mide</b>.", art: circuit(["h"], { caps: ["mezcla"] }) },
      { say: "<b>H</b> deja a la monedita en 50/50: como lanzarla al aire. Al <b>medir</b> (mirarla) sale 0 o 1 al azar. Con pocas mediciones, ¡los resultados cambian cada vez!", art: traceRow(["h"]) },
    ]],
    consola: ["La consola: dos H seguidas", [
      { say: "Aquí comparamos el <b>diseño aprobado</b> con el <b>circuito ejecutado</b>. En el ejecutado hay una pieza escondida ❓ que alguien añadió.", art: circuit(["h"], {}) + circuit(["h", "?"], {}) },
      { say: "Mira qué hace cada pieza con la flecha. <b>X</b> da la vuelta (arriba↔abajo). <b>H</b> la lleva al costado… y una <b>segunda H</b> la devuelve arriba.", art: traceRow(["h", "h"]) + traceRow(["h", "x"]) },
    ]],
    diag: ["El diagnóstico con X", [
      { say: "La compuerta <b>X</b> es como un <b>interruptor</b>: da la vuelta a la moneda. Si empiezas en 0 y aplicas X, al medir obtienes 1.", art: traceRow(["x"], "0") },
      { say: "¿Y si empiezas en 1? Para llegar a 0 también necesitas darle la vuelta: <b>X</b> otra vez.", art: traceRow(["x"], "1") },
    ]],
    resolve: ["Una acusación sólida", [
      { say: "Para acusar hace falta <b>evidencia que se refuerce</b>: primero ordenamos los hechos en el tiempo y luego elegimos la prueba que los une.", art: `<div class="tl"><span>21:14<br><b>Cambio del circuito</b></span><i></i><span>21:19<br><b>Rumi retira el módulo</b></span></div>` },
    ]],
    restore: ["Reparar QUILLA", [
      { say: "El diseño aprobado era <b>|0⟩ → H → medir</b>. Ahora tiene una <b>H de más</b>. Quítala tocándola. Validamos el <b>circuito</b>, no un número exacto, porque el azar siempre varía.", art: circuit(["h", "h"], {}) },
    ]],
  };

  // ------------------------------------------------------------------ glitches
  const WAVES = { 1: ["1", "1", "+"], 2: ["+", "1", "1", "+"], 3: ["-", "1", "+"], 4: ["-", "-", "1", "+"] };
  const MINM = { "1": 1, "+": 1, "-": 2 };
  function glitchWave(w, done) {
    if (S.waves[w]) return done();
    const key = w === 3 ? "glitch3" : "glitch1";
    withLesson(key, L[key][0], L[key][1], () => arena(w, done));
  }
  function arena(w, done) {
    const bugs = WAVES[w].map((k, i) => ({ id: i, k, v: START[k].slice(), dead: false, hist: [] })), minTotal = WAVES[w].reduce((n, k) => n + MINM[k], 0);
    let sel = 0, moves = 0, msg = "Toca un bicho y elige ⚡X o 🌀H. Déjalo en 0 (flecha arriba).";
    const alive = () => bugs.filter((b) => !b.dead);
    const draw = () => {
      const cur = bugs[sel] && !bugs[sel].dead ? bugs[sel] : alive()[0]; if (cur) sel = cur.id;
      openModal(`<h2>🐛 ¡Glitches! ${w === 4 ? "· Jefe Φ" : ""}</h2>${w === 4 ? `<div class="boss"><img src="img/boss.png" alt="Jefe"></div>` : ""}
        <div class="side"><div class="sidea">${bloch(cur.v, 124)}<small>${stateText(cur.v)}</small></div><div class="sideb">${circuit(cur.hist, { start: cur.k, measure: false })}<pre class="mini-code">${qcode(cur.hist, cur.k === "1" ? "1" : "0", false).split("\n").slice(1).join("\n")}</pre></div></div>
        ${coach(msg)}
        <div class="bugs">${bugs.map((b) => b.dead ? `<div class="bug dead">💥</div>` : `<button class="bug ${sel === b.id ? "sel" : ""}" data-b="${b.id}" data-k="${b.k}"><img class="bimg" src="img/bug${b.id % 2}.png" alt="glitch">${bloch(b.v, 54, { labels: false })}<b>${stateText(b.v)}</b></button>`).join("")}</div>
        <div class="tools"><button class="tool" data-g="x">⚡ X</button><button class="tool" data-g="h">🌀 H</button></div><p class="small">Movimientos: ${moves} · glitches vivos: ${alive().length}</p>
        <button class="btn" id="helpL">🎓 Ver la lección</button>`);
      mbody.querySelectorAll("[data-b]").forEach((n) => n.onclick = () => { sel = +n.dataset.b; sfx.hit(); msg = "Ese es tu objetivo. ¿X o H?"; draw(); });
      mbody.querySelectorAll("[data-g]").forEach((n) => n.onclick = () => move(n.dataset.g, cur));
      $("#helpL").onclick = () => lesson(w === 3 ? "glitch3" : "glitch1", L[w === 3 ? "glitch3" : "glitch1"][0], L[w === 3 ? "glitch3" : "glitch1"][1], () => arena(w, done));
    };
    const move = (g, b) => {
      const before = stateText(b.v), prevK = Math.abs(b.v[1]) > 0.999 ? "1" : Math.abs(b.v[0]) > 0.999 ? "0" : b.v[0] * b.v[1] > 0 ? "+" : "-";
      b.v = applyG(g, b.v); b.hist.push(g); moves++;
      if (Math.abs(b.v[0]) > 0.999) {
        b.dead = true; S.kills++; sfx.kill(); award(3);
        msg = g === "x" ? "¡Eliminado! X le dio la vuelta: de 1 pasó a 0." : "¡Eliminado! H lo mezcló de nuevo y lo dejó en 0.";
        if (!alive().length) return won();
      } else {
        sfx.hit();
        if (g === "x" && prevK === "+") msg = "Oye, X no mueve a un bicho |+⟩: está justo en el eje de giro. 💡 Te recomiendo usar H, que lo manda arriba (0).";
        else if (g === "x" && prevK === "-") msg = "X no cambia a |−⟩ (sigue 50/50 del mismo lado). 💡 Te recomiendo H: lo manda abajo (1) y luego X lo sube.";
        else if (g === "h" && prevK === "1") msg = "H lo mezcló: ahora está 50/50 (flecha a la izquierda). 💡 Para un 1 era mejor X, que le da la vuelta directo. Prueba H otra vez para volver.";
        else if (g === "h" && prevK === "-") msg = "Bien: H lo mandó abajo (1). Ahora aplica ⚡X para subirlo a 0.";
        else msg = `Pasó de ${before} a ${stateText(b.v)}. Mira dónde apunta la flecha: necesitamos que apunte arriba.`;
      }
      draw();
    };
    const won = () => {
      S.waves[w] = true; save(); burst(); sfx.ok();
      const perfect = moves <= minTotal; if (perfect) { award(5); badge("cazador"); }
      openModal(`<h2>🎉 ¡Glitches eliminados!</h2>${good(perfect ? "¡Perfecto! Usaste el <b>mínimo de movimientos</b>." : `Lo lograste en ${moves} movimientos (el mínimo era ${minTotal}).`)}<button class="btn big" id="gw">Continuar ➜</button>`);
      $("#gw").onclick = () => { closeModal(); done(); };
    };
    draw();
  }

  // ------------------------------------------------------------------ puzles
  const againBtn = (key) => `<button class="btn" id="helpL">🎓 Ver la lección</button>`;
  function puzzleSample() { withLesson("sample", L.sample[0], L.sample[1], runSample); }
  function runSample() {
    const hist = [];
    openModal(`<h2>🌀 Muestra de prueba</h2>${circuit(["h"], { caps: ["mezcla"] })}
      ${coach("Este circuito lanza una <b>moneda justa</b> (50/50). Pulsa el botón <b>3 veces</b> y mira si los resultados son siempre iguales.")}
      <div id="p1out"></div><button class="btn big" id="p1run">▶ Medir 10 veces</button><div id="p1hist" class="hist"></div><div id="p1q"></div>${codeBox(["h"])}${againBtn()}`);
    $("#helpL").onclick = () => lesson("sample", L.sample[0], L.sample[1], runSample);
    $("#p1run").onclick = async () => {
      const r = await runCircuit(["h"], 10); hist.push(`${r.counts["1"]}/${r.counts["0"]}`); S.runs++;
      $("#p1out").innerHTML = bars(r.counts, 10) + badgeSrc(r); $("#p1hist").innerHTML = "Unos/ceros: " + hist.join(" · ") + (hist.length < 3 ? ` <i>(${3 - hist.length} más)</i>` : "");
      if (hist.length >= 3 && !$("#p1q").innerHTML) {
        $("#p1q").innerHTML = `<div class="q"><p><b>Inti dice: «7 unos y 3 ceros prueban un sabotaje». ¿Tiene razón?</b></p>
          <label><input type="radio" name="a" value="si"> Sí, 7 de 10 es mucho</label><label><input type="radio" name="a" value="no"> No, pudo ser azar</label>
          <button class="btn" id="p1ok">Responder</button><div id="p1fb"></div></div>`;
        $("#p1ok").onclick = () => {
          const v = (document.querySelector("input[name=a]:checked") || {}).value; if (!v) return toast("Elige una respuesta");
          S.tries.p1 = (S.tries.p1 || 0) + 1;
          if (v === "no") {
            sfx.ok();
            $("#p1fb").innerHTML = good("¡Correcto! Las cantidades cambian solas: es <b>azar</b>.") + learned("<b>Probabilidad</b> = lo que esperas (50/50) · <b>Frecuencia</b> = lo que observas, y con pocas mediciones puede variar.");
            addEvid("diseno"); if (S.tries.p1 === 1) { badge("esceptico"); award(10); } else award(5);
            $("#p1ok").outerHTML = `<button class="btn big" id="p1done">Continuar ➜</button>`;
            $("#p1done").onclick = () => { closeModal(); setStage(2); };
          } else { sfx.bad(); shake($("#p1fb")); $("#p1fb").innerHTML = bad(`con la <b>misma moneda</b> tus 3 tiradas dieron ${hist.join(", ")}: cambian solas.`, "comparar tus tiradas: si el resultado cambia sin tocar nada, <b>una sola muestra de 10 no prueba nada</b>."); }
        };
      }
    };
  }

  function puzzleCircuit() { withLesson("consola", L.consola[0], L.consola[1], runConsole); }
  function runConsole() {
    const tried = {};
    openModal(`<h2>🖥️ Consola de control</h2>
      <div class="two"><div><small>Diseño aprobado</small>${circuit(["h"], {})}</div><div><small>Circuito ejecutado</small>${circuit(["h", "?"], {})}</div></div>
      ${coach("Alguien puso una pieza escondida ❓. Sabemos que el <b>resultado real fue siempre 0</b>. Mira qué hace cada pieza y adivina cuál fue.")}
      <div class="two"><div class="pc"><b>⚡ X</b> da la vuelta<br>${traceRow(["h", "x"])}</div><div class="pc"><b>🌀 H</b> mezcla<br>${traceRow(["h", "h"])}</div></div>
      <p><b>1) Predice:</b> ¿qué pieza va en ❓ para que salga <b>siempre 0</b>?</p>
      <label><input type="radio" name="g" value="x"> ⚡ X</label><label><input type="radio" name="g" value="h"> 🌀 H</label>
      <p><b>2) Compruébalo</b> (prueba las dos):</p><div class="row"><button class="btn" data-t="hx">▶ H → X</button><button class="btn" data-t="hh">▶ H → H</button></div>
      <div id="p2out"></div><div id="p2fb"></div>${codeBox(["h", "h"])}${againBtn()}`);
    $("#helpL").onclick = () => lesson("consola", L.consola[0], L.consola[1], runConsole);
    mbody.querySelectorAll("[data-t]").forEach((b) => b.onclick = async () => {
      const t = b.dataset.t, gates = t === "hx" ? ["h", "x"] : ["h", "h"], r = await runCircuit(gates, 100);
      tried[t] = true; const out = $("#p2out");
      out.innerHTML = `<div class="res"><b>${t === "hx" ? "H → X" : "H → H"}</b>${circuit(gates, {})}${traceRow(gates)}${bars(r.counts, 100)}${badgeSrc(r)}</div>` + out.innerHTML;
      if (tried.hx && tried.hh && !$("#p2fb").innerHTML) {
        const g = (document.querySelector("input[name=g]:checked") || {}).value, ok = g === "h";
        ok ? sfx.ok() : sfx.bad();
        $("#p2fb").innerHTML = (ok ? good("¡Acertaste! Dos <b>H</b> seguidas dejan siempre 0.") : g ? bad("con <b>X</b> al final la flecha queda al lado (50/50): X no la devuelve arriba.", "mirar la flecha: solo <b>H → H</b> la devuelve arriba (siempre 0).") : coach("No hiciste predicción, pero mira: solo <b>H → H</b> da siempre 0.")) +
          learned("<b>H · H = no hacer nada</b>: la 2.ª H deshace a la 1.ª. Por eso añadieron una H: el resultado quedó predecible.") + `<button class="btn big" id="p2done">Guardar en libreta ➜</button>`;
        if (ok && !S.pred) { S.pred = true; badge("predictor"); award(10); } else if (!ok) award(5);
        $("#p2done").onclick = () => { addEvid("hh"); addEvid("t2114"); addEvid("t2119"); closeModal(); setStage(3); };
      }
    });
  }

  function puzzleDiag() { if (S.stage >= 5) return showAudit(); withLesson("diag", L.diag[0], L.diag[1], runDiag); }
  function runDiag() {
    openModal(`<h2>📦 Diagnóstico del módulo</h2>${coach("Para abrir la caja hay que lograr <b>la salida que pide cada fila</b>. Elige <b>Aplicar X</b> o <b>Nada</b> y ejecuta.")}
      <table class="dt"><tr><th>Entrada</th><th>Debe salir</th><th>Haz</th></tr>
      <tr><td>0</td><td>1</td><td><select id="d0"><option value="none">Nada</option><option value="x">Aplicar X</option></select></td></tr>
      <tr><td>1</td><td>0</td><td><select id="d1"><option value="none">Nada</option><option value="x">Aplicar X</option></select></td></tr></table>
      <button class="btn big" id="drun">▶ Ejecutar</button><div id="dout"></div>${codeBox(["x"])}${againBtn()}`);
    $("#helpL").onclick = () => lesson("diag", L.diag[0], L.diag[1], runDiag);
    $("#drun").onclick = async () => {
      S.tries.d = (S.tries.d || 0) + 1;
      let ok = true, html = "", why = [];
      for (const inp of [0, 1]) {
        const op = $("#d" + inp).value, gates = (inp === 1 ? ["x"] : []).concat(op === "x" ? ["x"] : []), want = inp === 0 ? "1" : "0", r = await runCircuit(gates, 10);
        const pass = r.probs[want] === 1; ok = ok && pass;
        if (!pass) why.push(inp === 0 ? "la entrada <b>0</b> debía salir <b>1</b> y sin X se queda en 0" : "la entrada <b>1</b> debía salir <b>0</b>, pero con el circuito elegido sigue en 1");
        html += `<div class="res">${pass ? "✅" : "❌"} Entrada ${inp}${inp === 1 ? " (empieza en 1)" : ""}: ${circuit(gates, { start: inp === 1 ? "1" : "0" })} salió ${r.counts["1"] === 10 ? "1" : r.counts["0"] === 10 ? "0" : "mezcla"} (debía ${want}) ${badgeSrc(r)}</div>`;
      }
      $("#dout").innerHTML = html;
      if (ok) {
        sfx.ok();
        $("#dout").innerHTML += good("¡Caja abierta! X da la vuelta a la moneda en ambos casos.") + learned("<b>X voltea</b>: 0→1 y 1→0.") + `<button class="btn big" id="dgo">Leer auditoría ➜</button>`;
        if (S.tries.d === 1) { badge("mecanico"); award(10); } else award(5);
        $("#dgo").onclick = () => { addEvid("audit"); setStage(5); showAudit(); };
      } else { sfx.bad(); shake($("#dout")); $("#dout").innerHTML += bad(why.join(" y ") + ".", "aplicar <b>X</b> en las dos filas: X le da la vuelta a la moneda, y eso es justo lo que pide el diagnóstico."); }
    };
  }
  function showAudit() {
    openModal(`<h2>📜 Auditoría recuperada</h2><div class="term"><div>21:14 · edición · sesión de <b>Sami</b></div><div>21:14 · 2.ª H añadida</div><div>21:15 · registro borrado</div><div>archivo: <b>PHI</b></div></div>
      ${coach("¡Esto es oro! La edición salió de la <b>sesión de Sami</b>. Ve a hablar con ella 🦙.")}<button class="btn big" id="aok">Cerrar</button>`);
    $("#aok").onclick = closeModal;
  }

  function puzzleResolve() { withLesson("resolve", L.resolve[0], L.resolve[1], runResolve); }
  function runResolve() {
    const cards = [["c", "Rumi retira el módulo (21:19)"], ["a", "Sami añade una 2.ª H (21:14)"], ["b", "QUILLA da resultados fijos"]];
    const want = ["a", "b", "c"];
    const draw = (msg) => {
      openModal(`<h2>🧩 Ordena los hechos</h2>${coach("Ordénalos del <b>primero al último</b> con ▲ ▼. Pista: mira las horas.")}
        ${cards.map((c, i) => `<div class="card"><span>${i + 1}.</span><p>${c[1]}</p><button data-up="${i}" aria-label="subir">▲</button><button data-dn="${i}" aria-label="bajar">▼</button></div>`).join("")}
        <p><b>¿Qué evidencia basta para acusar?</b></p>
        <label><input type="radio" name="ev" value="1"> La auditoría + el circuito reconstruido</label>
        <label><input type="radio" name="ev" value="2"> El testimonio de Amaru</label>
        <label><input type="radio" name="ev" value="3"> Que Rumi ocultó el módulo</label>
        <label><input type="radio" name="ev" value="4"> Los 7 unos y 3 ceros</label>
        <button class="btn big" id="rsend">⚖️ Acusar</button><div id="rfb">${msg || ""}</div>${againBtn()}`);
      $("#helpL").onclick = () => lesson("resolve", L.resolve[0], L.resolve[1], runResolve);
      mbody.querySelectorAll("[data-up]").forEach((b) => b.onclick = () => { const i = +b.dataset.up; if (i > 0) { [cards[i - 1], cards[i]] = [cards[i], cards[i - 1]]; draw(); } });
      mbody.querySelectorAll("[data-dn]").forEach((b) => b.onclick = () => { const i = +b.dataset.dn; if (i < 2) { [cards[i + 1], cards[i]] = [cards[i], cards[i + 1]]; draw(); } });
      $("#rsend").onclick = () => {
        const ev = (document.querySelector("input[name=ev]:checked") || {}).value;
        if (!ev) return toast("Elige la evidencia");
        S.tries.r = (S.tries.r || 0) + 1;
        const err = (why, tip) => { sfx.bad(); draw(bad(why, tip)); shake($("#rfb")); };
        if (!cards.every((c, i) => c[0] === want[i])) return err("el orden no coincide con las horas: el cambio del circuito fue a las <b>21:14</b>, <b>antes</b> de que Rumi retirara el módulo (21:19).", "poner primero lo que pasó más temprano: Sami añade la H → QUILLA da resultados fijos → Rumi retira el módulo.");
        if (ev !== "1") return err(ev === "2" ? "Amaru vio a Rumi salir <b>después</b> del cambio, así que no dice quién lo hizo." : ev === "3" ? "Rumi ocultó el módulo <b>después</b> de la modificación: no la provocó." : "7 de 10 es una muestra pequeña: puede ser puro azar (lo viste en la primera prueba).", "elegir la prueba que <b>une la cronología con el circuito</b>: la auditoría (quién editó) más la reconstrucción (qué cambió).");
        sfx.ok(); if (S.tries.r === 1) { badge("cadena"); award(10); } else award(5);
        closeModal();
        say([["cuy", "La auditoría y el circuito coinciden: fuiste tú, Sami."], ["sami", "Quería una demo perfecta… El archivo con la firma Φ me dijo exactamente qué cambiar."], ["killa", "Φ… eso lo investigaremos. ¡Primero reparemos QUILLA!"]], () => setStage(6));
      };
    };
    draw();
  }

  function puzzleRestore() { withLesson("restore", L.restore[0], L.restore[1], runRestore); }
  function runRestore() {
    const chips = [{ g: "h", on: true }, { g: "h", on: true }];
    const draw = () => {
      const gates = chips.filter((c) => c.on).map((c) => c.g);
      openModal(`<h2>🔧 Repara QUILLA</h2>${coach("Toca una <b>H</b> para quitarla (o ponerla). Debe quedar el <b>diseño aprobado</b>: |0⟩ → H → medir.")}
        <div class="chain"><span class="chip fixed">|0⟩</span>${chips.map((c, i) => `<button class="chip ${c.on ? "" : "off"}" data-c="${i}">H</button>`).join("")}<span class="chip fixed">Medir</span></div>
        <small>Circuito actual:</small>${circuit(gates, {})}
        <button class="btn big" id="rrun">▶ Comprobar</button><div id="rout"></div>${codeBox(gates)}${againBtn()}`);
      $("#helpL").onclick = () => lesson("restore", L.restore[0], L.restore[1], runRestore);
      mbody.querySelectorAll("[data-c]").forEach((b) => b.onclick = () => { chips[+b.dataset.c].on = !chips[+b.dataset.c].on; draw(); });
      $("#rrun").onclick = async () => {
        const ok = gates.length === 1, r = await runCircuit(gates, 10);
        $("#rout").innerHTML = bars(r.counts, 10) + badgeSrc(r) + (ok ? good("¡Diseño restaurado: |0⟩ → H → medir!") + `<button class="btn big" id="rend">Reactivar QUILLA ➜</button>`
          : gates.length === 0 ? bad("sin ninguna H el qubit queda siempre en 0: no es el diseño.", "dejar <b>exactamente una H</b> para que vuelva el 50/50.")
          : bad("con <b>dos H</b> seguidas se cancelan y todo sale 0 (justo el sabotaje).", "quitar una de las dos H para dejar el diseño aprobado."));
        if (ok) { sfx.ok(); $("#rend").onclick = () => { closeModal(); setStage(7); award(10); if (!S.hints) badge("sinpistas"); burst(); ending(); }; } else { sfx.bad(); shake($("#rout")); }
      };
    };
    draw();
  }

  // ------------------------------------------------------------------ desafíos (para volver a jugar)
  function challenges() {
    if (S.stage < 5) return toast("🔒 Abre la caja para desbloquear");
    let streak = 0;
    const draw = () => {
      const n = 1 + Math.floor(Math.random() * 3), g = Array.from({ length: n }, () => (Math.random() < 0.5 ? "h" : "x")), p = window.QSim.probs(g);
      const ans = p["1"] === 1 ? "1" : p["0"] === 1 ? "0" : "mix";
      openModal(`<div class="chal"><h2>🧪 Desafío</h2><p>Racha <span class="streak">${streak}</span> · Mejor ${S.best} · 🐛 ${S.kills}</p>
        ${coach("Lee el circuito de izquierda a derecha y <b>predice</b> qué saldrá al medir. Recuerda: <b>H mezcla</b>, <b>H·H se cancela</b>, <b>X voltea</b>.")}
        ${circuit(g, {})}
        <label><input type="radio" name="c" value="0"> Siempre 0</label><label><input type="radio" name="c" value="1"> Siempre 1</label><label><input type="radio" name="c" value="mix"> 50 / 50</label>
        <button class="btn big" id="cgo">Comprobar</button><div id="cfb"></div></div>`);
      $("#cgo").onclick = async () => {
        const v = (document.querySelector("input[name=c]:checked") || {}).value; if (!v) return toast("Elige una");
        $("#cgo").disabled = true;
        const r = await runCircuit(g, 20), ok = v === ans, label = { "0": "siempre 0", "1": "siempre 1", mix: "50 / 50" }[ans];
        if (ok) { streak++; sfx.ok(); award(5); if (streak > S.best) { S.best = streak; save(); } if (streak === 5) badge("racha"); } else { streak = 0; sfx.bad(); shake($("#cfb")); }
        $("#cfb").innerHTML = (ok ? good(`¡Correcto! Era <b>${label}</b>.`) : bad(`el resultado era <b>${label}</b>.`, "seguir la flecha paso a paso (abajo): en cada compuerta se mueve.")) + traceRow(g) + bars(r.counts, 20) + badgeSrc(r) + `<button class="btn big" id="cnext">Siguiente ➜</button>`;
        $("#cnext").onclick = draw;
      };
    };
    draw();
  }

  function ending() {
    const bd = Object.entries(BADGES).map(([k, v]) => `<span class="bd ${S.badges.includes(k) ? "" : "off"}" title="${v[2]}">${v[0]} ${v[1]}</span>`).join("");
    openModal(`<h2>🎉 ¡Caso resuelto!</h2>${coach("¡Lo lograste, detective! <b>Qué:</b> una H extra · <b>Quién:</b> Sami · <b>Módulo:</b> Rumi lo ocultó.")}
      <p>🏅 <b>${rankOf(S.xp)[1]}</b> · ${S.xp} XP · 🐛 ${S.kills}</p><div class="badges">${bd}</div>
      <div class="phi"><div>Φ</div><p>«Primera prueba completada. El siguiente laboratorio ya está preparado».</p></div>
      <button class="btn big" id="chal">🧪 Jugar desafíos</button>
      <h3>📝 3 preguntas finales</h3><div id="qz"></div>
      <p class="small">Circuitos de Qiskit (1 qubit) simulados en un computador clásico. Sin ventaja cuántica. Personajes ficticios.</p>
      <div class="row"><button class="btn" id="again">Jugar de nuevo</button><button class="btn" id="copy">Copiar resultados</button></div>`);
    quizForm("post", $("#qz"));
    $("#chal").onclick = challenges;
    $("#again").onclick = () => { S = Object.assign(fresh(), { mute: S.mute, best: S.best }); save(); modal.hidden = true; setBusy(false); render(); intro(); };
    $("#copy").onclick = () => { const t = JSON.stringify({ quizPrimerIntento: S.quizFirst, quizUltimo: S.quiz, evidencias: S.evid.length, xp: S.xp, insignias: S.badges, bichos: S.kills, pistas: S.hints, fecha: new Date().toISOString() }); (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject()).then(() => toast("Copiado ✔"), () => toast(t)); };
  }
  function quizForm(phase, box) {
    const fb = (det) => QUIZ[phase].map((q, i) => `<div class="fb ${det[i] ? "good" : "bad"}">${det[i] ? "✅" : `❌ Era: <b>${q[1][q[2]]}</b>.`} ${q[3]}</div>`).join("");
    if (S.quiz[phase] != null) {
      const det = S.quizDet[phase];
      box.innerHTML = `<p class="ok"><b>${S.quiz[phase]} de 3</b>${S.quizFirst[phase] != null && S.quizFirst[phase] !== S.quiz[phase] ? ` (primer intento: ${S.quizFirst[phase]})` : ""}${S.quiz.pre != null && S.quiz.post != null ? ` · antes ${S.quiz.pre} → después ${S.quiz.post}` : ""}</p>` + (det ? fb(det) : "") +
        `<button class="btn" id="qretry">🔁 Intentar de nuevo</button>`;
      box.querySelector("#qretry").onclick = () => { S.quiz[phase] = null; S.quizDet[phase] = null; save(); quizForm(phase, box); };
      return;
    }
    box.innerHTML = QUIZ[phase].map((q, i) => `<div class="q"><p><b>${i + 1}.</b> ${q[0]}</p>${q[1].map((o, j) => `<label><input type="radio" name="${phase}${i}" value="${j}"> ${o}</label>`).join("")}</div>`).join("") + `<button class="btn big" id="qsend">Enviar</button>`;
    box.querySelector("#qsend").onclick = () => {
      const a = QUIZ[phase].map((q, i) => (box.querySelector(`input[name=${phase}${i}]:checked`) || {}).value);
      if (a.some((v) => v == null)) return toast("Responde las 3");
      const det = a.map((v, i) => +v === QUIZ[phase][i][2]), score = det.filter(Boolean).length;
      if (S.quizFirst[phase] == null) S.quizFirst[phase] = score;
      S.quiz[phase] = score; S.quizDet[phase] = det; save();
      det.every(Boolean) ? sfx.ok() : sfx.bad(); quizForm(phase, box);
    };
  }

  // ------------------------------------------------------------------ libreta, inicio y controles
  function notebook() {
    const items = S.evid.map((id) => `<div class="card"><div><b>${EVID[id][0]}</b><p>${EVID[id][1]}</p></div></div>`).join("") || "<p>Sin evidencias aún. Sigue la flecha ▼</p>";
    const bd = Object.entries(BADGES).map(([k, v]) => `<span class="bd ${S.badges.includes(k) ? "" : "off"}" title="${v[2]}">${v[0]} ${v[1]}</span>`).join("");
    openModal(`<h2>📓 Libreta</h2>${items}<h3>🏅 Insignias</h3><div class="badges">${bd}</div><button class="btn big" id="nclose">Cerrar</button>`); $("#nclose").onclick = closeModal;
  }
  function intro() {
    openModal(`<div class="intro"><h1>🐹 Quantum Files</h1><h2>El experimento fantasma</h2>
      <p>La máquina cuántica <b>QUILLA</b> falla y falta una pieza. Eres el <b>Detective Cuy</b>: ¿quién fue?</p>
      <div class="how"><div><span>🚶</span>Toca personajes y sigue la flecha ▼</div><div><span>🐛</span>Elimina glitches con X y H</div><div><span>🏅</span>Resuelve retos y sube de rango</div></div>
      <details><summary>📝 Mini quiz (opcional, puedes repetirlo)</summary><div id="qz0"></div></details>
      <button class="btn big" id="play">▶ Jugar</button>
      <p class="small">Piloto: la edad y frecuencia ideales se definirán con pruebas.</p></div>`);
    quizForm("pre", $("#qz0"));
    $("#play").onclick = () => { S.started = true; save(); closeModal(); cinematic(); };
  }
  function cinematic() { // apertura inmersiva
    stage.classList.add("alarm"); sfx.alarm(); setTimeout(() => stage.classList.remove("alarm"), 3200);
    say([["sys", "🌙 21:14 — Qori Lab, en lo alto de los Andes. Las luces parpadean y suena una alarma."], ["sys", "QUILLA, la máquina cuántica del laboratorio, empieza a entregar resultados extraños…"],
      ["phi", "«Están mirando los resultados. Deberían mirar lo que ocurrió antes de medir.» — Φ"], ["inti", "¡Detective Cuy! Ven rápido, te necesitamos en la Sala central."],
      ["killa", "Yo te guío, detective. Toca a Inti 🦅 y sigue la flecha amarilla ▼."]]);
  }

  // ------------------------------------------------------------------ bucle de movimiento
  const MAP = { w: "u", arrowup: "u", s: "d", arrowdown: "d", a: "l", arrowleft: "l", d: "r", arrowright: "r" };
  addEventListener("keydown", (e) => {
    const k = e.key.toLowerCase();
    if (MAP[k]) { keys[MAP[k]] = true; target = null; autoId = null; e.preventDefault(); }
    else if ((k === "e" || k === " " || k === "enter") && !e.repeat) {
      if (!dlg.hidden) { nextLine(); e.preventDefault(); } else if (modal.hidden && nearId) { interact(nearId); e.preventDefault(); }
    } else if (k === "escape" && !modal.hidden && S.started) closeModal();
  });
  addEventListener("keyup", (e) => { const k = MAP[e.key.toLowerCase()]; if (k) keys[k] = false; });
  dlg.addEventListener("click", nextLine);
  stage.addEventListener("click", (e) => { if (busy) return; const r = stage.getBoundingClientRect(); target = { x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 }; autoId = null; });
  document.querySelectorAll("[data-dir]").forEach((b) => {
    const d = b.dataset.dir, on = (v) => (ev) => { keys[d] = v; if (v) { target = null; autoId = null; } ev.preventDefault(); };
    b.addEventListener("pointerdown", on(true)); b.addEventListener("pointerup", on(false)); b.addEventListener("pointerleave", on(false)); b.addEventListener("pointercancel", on(false));
  });
  $("#btn-act").addEventListener("click", () => { if (!dlg.hidden) nextLine(); else if (nearId) interact(nearId); });
  $("#btn-book").addEventListener("click", () => { if (!busy || !modal.hidden) notebook(); });
  $("#btn-hint").addEventListener("click", () => { if (busy) return; S.hints++; save(); HANDLERS.killa(); });
  $("#btn-chal").addEventListener("click", () => { if (!busy || !modal.hidden) challenges(); });
  $("#btn-snd").addEventListener("click", () => { S.mute = !S.mute; save(); hud(); if (!S.mute) sfx.ok(); });
  $("#btn-reset").addEventListener("click", () => { if (confirm("¿Reiniciar el caso desde cero?")) { S = Object.assign(fresh(), { mute: S.mute, best: S.best }); save(); modal.hidden = true; dlg.hidden = true; setBusy(false); render(); intro(); } });
  $("#mclose").addEventListener("click", () => { if (S.started) closeModal(); });

  const SPEED = 36; // % del ancho por segundo
  let last = performance.now(), moving = false;
  function loop(now) {
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    if (!busy) {
      let dx = (keys.r ? 1 : 0) - (keys.l ? 1 : 0), dy = (keys.d ? 1 : 0) - (keys.u ? 1 : 0);
      if (!dx && !dy && target) {
        const tx = target.x - S.px, ty = (target.y - S.py) * ASP, m = Math.hypot(tx, ty);
        if (m < 1.6) { target = null; if (autoId) { const id = autoId; autoId = null; interact(id); } } else { dx = tx / m; dy = ty / m; }
      }
      const mv = !!(dx || dy);
      if (mv !== moving) { moving = mv; $("#pimg").src = mv ? "img/cuy_run.png" : "img/cuy_idle.png"; }
      if (dx) $("#pimg").style.transform = dx < 0 ? "scaleX(-1)" : "none";
      if (mv) { const n = Math.hypot(dx, dy); S.px = Math.max(4, Math.min(96, S.px + (dx / n) * SPEED * dt)); S.py = Math.max(16, Math.min(92, S.py + ((dy / n) * SPEED * dt) / ASP)); placePlayer(); }
      let best = null, bd = 13;
      for (const o of ROOMS[S.room].objs) { const d = dist(S.px, S.py, o.x, o.y); if (d < bd) { bd = d; best = o; } }
      const id = best ? best.id : null;
      if (id !== nearId) { nearId = id; Object.entries(objEls).forEach(([k, n]) => n.classList.toggle("near", k === id)); $("#btn-act").textContent = best ? (best.door ? "🚪 Entrar" : "E · " + best.l) : "E · Interactuar"; $("#btn-act").classList.toggle("on", !!best); }
    }
    requestAnimationFrame(loop);
  }
  function fit() {
    const w = stage.clientWidth || 1, h = stage.clientHeight || 1, portrait = innerHeight > innerWidth;
    ASP = h / w; stage.style.setProperty("--u", (w / 100) * (portrait ? 1.55 : 1) + "px");
  }
  addEventListener("resize", fit); addEventListener("orientationchange", () => setTimeout(fit, 200));

  // ------------------------------------------------------------------ inicio
  render(); requestAnimationFrame(loop);
  fetch("api/run", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ gates: [], shots: 1, seed: 0 }) }).then((r) => r.text()).catch(() => {}); // precalienta Qiskit
  if (!S.started) intro(); else if (S.stage >= 7) ending();
  if ("serviceWorker" in navigator) addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
  window.QF = { S: () => S, interact, runCircuit, render, closeModal, setStage, say, challenges, glitchWave, get busy() { return busy; } };
})();
