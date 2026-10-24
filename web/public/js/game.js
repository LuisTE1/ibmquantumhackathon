/* Quantum Files — Caso 01: El experimento fantasma. Juego de investigación (PWA). v4: menos texto + glitches */
(function () {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };

  // ------------------------------------------------------------------ datos
  const CHAR = {
    cuy: ["🐹", "Detective Cuy", "img/cuy_idle.png"], killa: ["🐇", "Killa"], inti: ["🦅", "Inti"], rumi: ["🦊", "Rumi"],
    sami: ["🦙", "Sami", "img/llama.png"], amaru: ["🐆", "Amaru"], phi: ["Φ", "Φ"], sys: ["🖥️", "Sistema"],
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
    cazador: ["🐛", "Cazador de glitches", "Eliminaste bichos con el mínimo de movimientos"],
  };
  const QUIZ = {
    pre: [
      ["10 lanzamientos de una moneda justa: ¿siempre 5 caras?", ["Sí, siempre", "No, varía", "Solo si lanzas rápido"], 1, "Varía: 5 es lo más probable, no seguro."],
      ["Mides un qubit 50/50. ¿Qué obtienes?", ["Siempre 0", "Siempre 1", "0 o 1 al azar"], 2, "Da 0 o 1, cada uno con su probabilidad."],
      ["7 unos de 10 en un experimento 50/50: ¿prueba que lo alteraron?", ["Sí, seguro", "No, puede ser azar", "Solo con más de 10"], 1, "Con 10 mediciones el azar lo explica (~17 %)."],
    ],
    post: [
      ["Dos H seguidas a un qubit en 0 (sin medir en medio). Al medir:", ["50/50", "Siempre 0", "Siempre 1"], 1, "La 2.ª H deshace la 1.ª → 0."],
      ["¿Qué hace la compuerta X?", ["Intercambia 0 y 1", "Mide", "No hace nada"], 0, "X voltea: 0↔1."],
      ["¿Qué sostiene una acusación?", ["Una respuesta incorrecta", "Evidencia que se refuerza", "Una sospecha"], 1, "Hace falta evidencia que se refuerce."],
    ],
  };
  const CODE = {
    h: "from qiskit import QuantumCircuit\nfrom qiskit.primitives import StatevectorSampler\n\nqc = QuantumCircuit(1, 1)\nqc.h(0)          # Hadamard: 50/50\nqc.measure(0, 0)\nStatevectorSampler().run([qc], shots=10).result()[0].data.c.get_counts()",
    hh: "qc = QuantumCircuit(1, 1)\nqc.h(0)\nqc.h(0)          # 2.ª H: revierte a la 1.ª (sin medir en medio)\nqc.measure(0, 0)  # -> siempre 0",
    x: "qc = QuantumCircuit(1, 1)\nqc.x(0)          # X intercambia 0 y 1\nqc.measure(0, 0)",
  };
  const idea = (t) => `<div class="idea">🎓 ${t}</div>`;
  const learned = (t) => `<div class="learned">✅ ${t}</div>`;

  // glitches: estado de qubit real (amplitudes). Se eliminan llevándolo a 0 con X y H.
  const S2 = Math.SQRT1_2;
  const VEC = { "1": [0, 1], "+": [S2, S2], "-": [S2, -S2] };
  const MINM = { "1": 1, "+": 1, "-": 2 };
  const WAVES = { 1: ["1", "1", "+"], 2: ["+", "1", "1", "+"], 3: ["-", "1", "+"], 4: ["-", "-", "1", "+"] };
  const applyG = (g, v) => (g === "x" ? [v[1], v[0]] : [S2 * (v[0] + v[1]), S2 * (v[0] - v[1])]);

  // ------------------------------------------------------------------ estado
  const KEY = "qf_state_v4";
  const fresh = () => ({ stage: 0, room: "central", px: 50, py: 82, evid: [], runs: 0, quiz: {}, started: false, xp: 0, badges: [], hints: 0, mute: false, best: 0, tries: {}, pred: false, waves: {}, kills: 0 });
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
    ok() { [523, 659, 784].forEach((f, i) => tone(f, 0.18, "triangle", 0.09, i * 0.09)); },
    bad() { tone(170, 0.28, "sawtooth", 0.06); },
    evid() { tone(880, 0.12, "sine", 0.07); tone(1175, 0.2, "sine", 0.07, 0.1); },
    up() { [392, 523, 659, 784, 1047].forEach((f, i) => tone(f, 0.2, "triangle", 0.1, i * 0.08)); },
    hit() { tone(220, 0.08, "square", 0.05); },
    kill() { tone(660, 0.07, "square", 0.07); tone(990, 0.12, "square", 0.07, 0.07); },
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
  const codeBox = (txt) => `<details class="code"><summary>👩‍💻 Código Qiskit</summary><pre>${txt}</pre></details>`;

  // ------------------------------------------------------------------ UI base
  const stage = $("#stage"), playerEl = $("#player"), dlg = $("#dialog"), modal = $("#modal"), mbody = $("#mbody");
  let objEls = {}, busy = false, keys = {}, target = null, autoId = null, nearId = null, lines = [], lineDone = null, ASP = 0.625;
  const setBusy = (v) => { busy = v; document.body.classList.toggle("busy", v); };

  function say(arr, done) { lines = arr.slice(); lineDone = done || null; dlg.hidden = false; nextLine(); }
  function nextLine() {
    if (!lines.length) { dlg.hidden = true; const d = lineDone; lineDone = null; setBusy(!modal.hidden); if (d) d(); return; }
    const [who, text] = lines.shift(), c = CHAR[who] || CHAR.sys;
    setBusy(true); $("#d-av").innerHTML = c[2] ? `<img src="${c[2]}" alt="">` : c[0]; $("#d-name").textContent = c[1]; $("#d-text").textContent = text;
  }
  function openModal(html) { mbody.innerHTML = html; modal.hidden = false; setBusy(true); mbody.scrollTop = 0; }
  function closeModal() { modal.hidden = true; setBusy(!dlg.hidden); render(); }
  function toast(t) { const n = $("#toast"); n.textContent = t; n.classList.add("on"); clearTimeout(toast.t); toast.t = setTimeout(() => n.classList.remove("on"), 2000); }
  function addEvid(id) { if (!S.evid.includes(id)) { S.evid.push(id); sfx.evid(); save(); award(5); toast("📓 " + EVID[id][0]); } }
  function setStage(n) { if (n > S.stage) { S.stage = n; save(); render(); } }

  function doorToward(from, to) { if (from === "central") return { control: "d_control", taller: "d_taller" }[to]; return from === "control" ? "d_central1" : "d_central2"; }
  function hud() {
    const r = rankOf(S.xp); $("#rank").textContent = `🏅 ${r[1]} · ${S.xp} XP`;
    $("#progbar").style.width = (Math.min(S.stage, 7) / 7) * 100 + "%";
    $("#evcount").textContent = S.evid.length; $("#btn-snd").textContent = S.mute ? "🔇" : "🔊";
    $("#btn-chal").classList.toggle("locked", S.stage < 5);
  }
  function render() {
    const room = ROOMS[S.room], g = GOAL[Math.min(S.stage, 7)];
    stage.className = "stage " + room.cls;
    $("#roomname").textContent = room.name;
    let obj = OBJECTIVE[Math.min(S.stage, 7)], goalId = null;
    if (g) { goalId = g[0] === S.room ? g[1] : doorToward(S.room, g[0]); if (g[0] !== S.room) obj += " → " + ROOMS[g[0]].name; }
    $("#objective").textContent = obj;
    stage.querySelectorAll(".obj").forEach((n) => n.remove());
    objEls = {};
    room.objs.forEach((o) => {
      const art = o.e.startsWith("img:") ? `<img src="${o.e.slice(4)}" alt="" draggable="false">` : `<span class="em">${o.e}</span>`;
      const n = el("button", "obj" + (o.big ? " big" : "") + (o.door ? " door" : "") + (o.id === goalId ? " goal" : ""), `${art}<span class="lb">${o.door ? "→ " : ""}${o.l}</span>`);
      n.style.left = o.x + "%"; n.style.top = o.y + "%"; n.dataset.id = o.id; n.setAttribute("aria-label", o.l);
      n.addEventListener("click", (ev) => { ev.stopPropagation(); goTo(o); });
      stage.appendChild(n); objEls[o.id] = n;
    });
    placePlayer(); hud(); fit();
  }
  function placePlayer() { playerEl.style.left = S.px + "%"; playerEl.style.top = S.py + "%"; }
  const objOf = (id) => Object.values(ROOMS).flatMap((r) => r.objs).find((o) => o.id === id);
  const dist = (ax, ay, bx, by) => Math.hypot(ax - bx, (ay - by) * ASP);

  function goTo(o) { if (busy) return; if (dist(S.px, S.py, o.x, o.y) < 13) interact(o.id); else { target = { x: o.x, y: Math.min(o.y + 6, 92) }; autoId = o.id; } }
  function interact(id) {
    if (busy) return;
    const o = objOf(id);
    if (o && o.door) { S.room = o.door[0]; S.px = o.door[1]; S.py = o.door[2]; target = null; autoId = null; save(); render(); return; }
    (HANDLERS[id] || (() => {}))();
  }

  // ------------------------------------------------------------------ personajes y objetos
  const HANDLERS = {
    killa() {
      const t = ["Habla con Inti 🦅. ¡Sigue la flecha ▼!", "Ve a QUILLA 🌀.", "Usa la consola 🖥️ en Control.", "Busca a Rumi 🦊 en el Taller.", "Abre la caja 📦.",
        "Habla con Sami 🦙.", "Quita la H extra en QUILLA 🌀.", "¡Listo! Prueba los desafíos 🧪."];
      say([["killa", t[Math.min(S.stage, 7)]]]);
    },
    inti() {
      if (S.stage === 0) {
        say([["inti", "¡Detective! QUILLA da resultados raros y falta un módulo."], ["inti", "Registro: 7 unos y 3 ceros. ¿Sabotaje?"], ["killa", "Probemos con una copia. ¡A QUILLA 🌀!"]], () => { addEvid("reg73"); setStage(1); });
      } else say([["inti", S.stage >= 2 ? "El diseño era: 0 → H → medir." : "Usa la copia de prueba en QUILLA."]]);
    },
    amaru() { say([["amaru", "Rumi salió con una caja… después de la alerta."]], () => addEvid("amaru")); },
    sami() {
      if (S.stage < 5) return say([["sami", "Solo hice los gráficos."]]);
      if (S.stage === 5) return say([["sami", "Solo hice los gráficos…"], ["cuy", "Tengo la auditoría. Ordenemos los hechos."]], puzzleResolve);
      say([["sami", "Quería una demo perfecta. El archivo Φ me lo pidió."]]);
    },
    rumi() {
      if (S.stage < 3) return say([["rumi", "Solo revisé el equipo."]]);
      if (S.stage === 3) return say([["cuy", "Cambio 21:14. Retiraste el módulo 21:19."], ["rumi", "Lo retiré al ver el cambio… y tuve miedo."], ["rumi", "Toma la caja. Pruébala."]], () => { addEvid("rumi"); setStage(4); });
      say([["rumi", "La caja está en la mesa."]]);
    },
    quilla() {
      if (S.stage < 1) return say([["killa", "Habla primero con Inti."]]);
      if (S.stage === 6) return glitchWave(4, puzzleRestore);
      if (S.stage >= 7) return say([["sys", "QUILLA funciona: 0 → H → medir."]]);
      S.stage === 1 ? glitchWave(1, puzzleSample) : puzzleSample();
    },
    consola() {
      if (S.stage < 2) return say([["killa", "Primero analiza la muestra en QUILLA."]]);
      S.stage === 2 ? glitchWave(2, puzzleCircuit) : puzzleCircuit();
    },
    caja() {
      if (S.stage < 4) return say([["sys", "Caja cerrada. Habla con Rumi."]]);
      S.stage === 4 ? glitchWave(3, puzzleDiag) : puzzleDiag();
    },
  };

  // ------------------------------------------------------------------ glitches: elimina los bichos llevando su qubit a 0
  function glitchWave(w, done) {
    if (S.waves[w]) return done();
    const bugs = WAVES[w].map((k, i) => ({ id: i, k, v: VEC[k].slice(), dead: false })), minTotal = WAVES[w].reduce((n, k) => n + MINM[k], 0);
    let sel = null, moves = 0, finished = false;
    const alive = () => bugs.filter((b) => !b.dead);
    const label = (v) => (Math.abs(v[0]) > 0.999 ? "100 % de 0" : Math.abs(v[1]) > 0.999 ? "100 % de 1" : "50 / 50");
    const tip = w === 1 ? "Toca un bicho y elige ⚡X o 🌀H" : w === 3 ? "¡Parecen iguales (50/50) pero no! Prueba H" : "Déjalos todos en 0";
    const draw = (msg) => {
      openModal(`<h2>🐛 ¡Glitches!</h2><p class="tip2">${tip}</p>
        <div class="bugs">${bugs.map((b) => b.dead ? `<div class="bug dead">💥</div>` :
          `<button class="bug ${sel === b.id ? "sel" : ""}" data-b="${b.id}" data-k="${b.k}"><span class="bi">🐛</span><div class="mini"><i style="width:${Math.round(100 * b.v[1] * b.v[1])}%"></i></div><b>${label(b.v)}</b></button>`).join("")}</div>
        <div class="tools"><button class="tool" data-g="x">⚡ X</button><button class="tool" data-g="h">🌀 H</button></div>
        <p class="small">${msg || "X voltea 0↔1 · H mezcla"} · Movimientos: ${moves}</p>`);
      mbody.querySelectorAll("[data-b]").forEach((n) => n.onclick = () => { sel = +n.dataset.b; sfx.hit(); draw(); });
      mbody.querySelectorAll("[data-g]").forEach((n) => n.onclick = () => {
        let b = bugs.find((x) => x.id === sel && !x.dead); if (!b) { b = alive()[0]; sel = b.id; }
        b.v = applyG(n.dataset.g, b.v); moves++;
        if (Math.abs(b.v[0]) > 0.999) { b.dead = true; S.kills++; sfx.kill(); award(3); sel = null; }
        else sfx.hit();
        if (!alive().length) return won();
        draw(Math.abs(b.v[1]) > 0.999 ? "¡Ese quedó en 1!" : "");
      });
    };
    const won = () => {
      finished = true; S.waves[w] = true; save(); burst(); sfx.ok();
      const perfect = moves <= minTotal; if (perfect) { award(5); badge("cazador"); }
      openModal(`<h2>🎉 ¡Glitches eliminados!</h2><p>${perfect ? "⭐ ¡Perfecto! Mínimo de movimientos" : "Movimientos: " + moves + " (mínimo " + minTotal + ")"}</p><button class="btn big" id="gw">Continuar ➜</button>`);
      $("#gw").onclick = () => { closeModal(); done(); };
    };
    draw();
  }

  // ------------------------------------------------------------------ puzles
  function puzzleSample() {
    const hist = [];
    openModal(`<h2>🌀 Muestra de prueba</h2>${idea("<b>H</b> = moneda justa 🪙. Pocas mediciones → resultados que varían.")}
      <p>Pulsa <b>3 veces</b> ▶ y mira qué cambia.</p>
      <div id="p1out"></div><button class="btn big" id="p1run">▶ Medir 10 veces</button><div id="p1hist" class="hist"></div><div id="p1q"></div>${codeBox(CODE.h)}`);
    $("#p1run").onclick = async () => {
      const r = await runCircuit(["h"], 10); hist.push(`${r.counts["1"]}/${r.counts["0"]}`); S.runs++;
      $("#p1out").innerHTML = bars(r.counts, 10) + badgeSrc(r); $("#p1hist").innerHTML = "Unos/ceros: " + hist.join(" · ") + (hist.length < 3 ? ` <i>(${3 - hist.length} más)</i>` : "");
      if (hist.length >= 3 && !$("#p1q").innerHTML) {
        $("#p1q").innerHTML = `<div class="q"><p><b>¿7 unos y 3 ceros prueban un sabotaje?</b></p>
          <label><input type="radio" name="a" value="si"> Sí</label><label><input type="radio" name="a" value="no"> No</label>
          <button class="btn" id="p1ok">Responder</button><div id="p1fb"></div></div>`;
        $("#p1ok").onclick = () => {
          const v = (document.querySelector("input[name=a]:checked") || {}).value; if (!v) return toast("Elige una respuesta");
          S.tries.p1 = (S.tries.p1 || 0) + 1;
          if (v === "no") {
            sfx.ok();
            $("#p1fb").innerHTML = `<div class="fb good">✅ ¡Correcto! Las cantidades cambian: es azar.</div>` + learned("<b>Probabilidad</b> = esperado · <b>Frecuencia</b> = observado.");
            addEvid("diseno"); if (S.tries.p1 === 1) { badge("esceptico"); award(10); } else award(5);
            $("#p1ok").outerHTML = `<button class="btn big" id="p1done">Continuar ➜</button>`;
            $("#p1done").onclick = () => { closeModal(); setStage(2); };
          } else { sfx.bad(); shake($("#p1fb")); $("#p1fb").innerHTML = `<div class="fb bad">❌ Mira tus tiradas: con el mismo circuito cambian. Intenta otra vez.</div>`; }
        };
      }
    };
  }

  function puzzleCircuit() {
    const tried = {};
    openModal(`<h2>🖥️ Consola</h2>${idea("<b>H·H</b> se cancela: el qubit vuelve a 0.")}
      <div class="term"><div>Diseño: <b>|0⟩ → H → medir</b></div><div>Ejecutado: <b>|0⟩ → H → ❓ → medir</b></div><div>Resultado real: <b>siempre 0</b></div></div>
      <p><b>1) Predice:</b> ¿qué va en ❓?</p>
      <label><input type="radio" name="g" value="x"> X</label><label><input type="radio" name="g" value="h"> H</label>
      <p><b>2) Prueba las dos:</b></p><div class="row"><button class="btn" data-t="hx">▶ H → X</button><button class="btn" data-t="hh">▶ H → H</button></div>
      <div id="p2out"></div><div id="p2fb"></div>${codeBox(CODE.hh)}`);
    mbody.querySelectorAll("[data-t]").forEach((b) => b.onclick = async () => {
      const t = b.dataset.t, gates = t === "hx" ? ["h", "x"] : ["h", "h"], r = await runCircuit(gates, 100);
      tried[t] = true; const out = $("#p2out");
      out.innerHTML = `<div class="res"><b>${t === "hx" ? "H → X" : "H → H"}</b>${bars(r.counts, 100)}${badgeSrc(r)}</div>` + out.innerHTML;
      if (tried.hx && tried.hh && !$("#p2fb").innerHTML) {
        const g = (document.querySelector("input[name=g]:checked") || {}).value, ok = g === "h";
        ok ? sfx.ok() : sfx.bad();
        $("#p2fb").innerHTML = `<div class="fb ${ok ? "good" : "bad"}">${ok ? "✅ ¡Acertaste!" : "❌ Era H."} Solo <b>H → H</b> da siempre 0: añadieron una 2.ª H.</div>` +
          learned("<b>H·H</b> no hace nada. Ese cambio escondido hacía todo predecible.") + `<button class="btn big" id="p2done">Guardar en libreta ➜</button>`;
        if (ok && !S.pred) { S.pred = true; badge("predictor"); award(10); } else if (!ok) award(5);
        $("#p2done").onclick = () => { addEvid("hh"); addEvid("t2114"); addEvid("t2119"); closeModal(); setStage(3); };
      }
    });
  }

  function puzzleDiag() {
    if (S.stage >= 5) return showAudit();
    openModal(`<h2>📦 Diagnóstico</h2>${idea("<b>X</b> voltea el qubit: 0↔1.")}
      <table class="dt"><tr><th>Entrada</th><th>Debe salir</th><th>Haz</th></tr>
      <tr><td>0</td><td>1</td><td><select id="d0"><option value="none">Nada</option><option value="x">Aplicar X</option></select></td></tr>
      <tr><td>1</td><td>0</td><td><select id="d1"><option value="none">Nada</option><option value="x">Aplicar X</option></select></td></tr></table>
      <button class="btn big" id="drun">▶ Ejecutar</button><div id="dout"></div>${codeBox(CODE.x)}`);
    $("#drun").onclick = async () => {
      S.tries.d = (S.tries.d || 0) + 1;
      let ok = true, html = "";
      for (const inp of [0, 1]) {
        const op = $("#d" + inp).value, gates = (inp === 1 ? ["x"] : []).concat(op === "x" ? ["x"] : []), want = inp === 0 ? "1" : "0", r = await runCircuit(gates, 10);
        const pass = r.probs[want] === 1; ok = ok && pass;
        html += `<div class="res">${pass ? "✅" : "❌"} Entrada ${inp} → salió ${r.counts["1"] === 10 ? "1" : r.counts["0"] === 10 ? "0" : "mezcla"} (debía ${want}) ${badgeSrc(r)}</div>`;
      }
      $("#dout").innerHTML = html;
      if (ok) {
        sfx.ok();
        $("#dout").innerHTML += learned("<b>X voltea</b>: 0→1 y 1→0.") + `<button class="btn big" id="dgo">Leer auditoría ➜</button>`;
        if (S.tries.d === 1) { badge("mecanico"); award(10); } else award(5);
        $("#dgo").onclick = () => { addEvid("audit"); setStage(5); showAudit(); };
      } else { sfx.bad(); shake($("#dout")); $("#dout").innerHTML += `<div class="fb bad">Casi. Piensa: ¿qué hace X?</div>`; }
    };
  }
  function showAudit() {
    openModal(`<h2>📜 Auditoría</h2><div class="term"><div>21:14 · edición · sesión de <b>Sami</b></div><div>21:14 · 2.ª H añadida</div><div>21:15 · registro borrado</div><div>archivo: <b>PHI</b></div></div>
      <p>Ve con <b>Sami</b> 🦙.</p><button class="btn big" id="aok">Cerrar</button>`);
    $("#aok").onclick = closeModal;
  }

  function puzzleResolve() {
    const cards = [["c", "Rumi retira el módulo"], ["a", "Sami añade una 2.ª H"], ["b", "QUILLA da resultados fijos"]];
    const want = ["a", "b", "c"];
    const draw = (msg) => {
      openModal(`<h2>🧩 Ordena los hechos</h2>
        ${cards.map((c, i) => `<div class="card"><span>${i + 1}.</span><p>${c[1]}</p><button data-up="${i}" aria-label="subir">▲</button><button data-dn="${i}" aria-label="bajar">▼</button></div>`).join("")}
        <p><b>¿Qué evidencia basta?</b></p>
        <label><input type="radio" name="ev" value="1"> Auditoría + circuito reconstruido</label>
        <label><input type="radio" name="ev" value="2"> Testimonio de Amaru</label>
        <label><input type="radio" name="ev" value="3"> Rumi ocultó el módulo</label>
        <label><input type="radio" name="ev" value="4"> 7 unos y 3 ceros</label>
        <button class="btn big" id="rsend">⚖️ Acusar</button><div id="rfb">${msg || ""}</div>`);
      mbody.querySelectorAll("[data-up]").forEach((b) => b.onclick = () => { const i = +b.dataset.up; if (i > 0) { [cards[i - 1], cards[i]] = [cards[i], cards[i - 1]]; draw(); } });
      mbody.querySelectorAll("[data-dn]").forEach((b) => b.onclick = () => { const i = +b.dataset.dn; if (i < 2) { [cards[i + 1], cards[i]] = [cards[i], cards[i + 1]]; draw(); } });
      $("#rsend").onclick = () => {
        const ev = (document.querySelector("input[name=ev]:checked") || {}).value;
        if (!ev) return toast("Elige la evidencia");
        S.tries.r = (S.tries.r || 0) + 1;
        const bad = (t) => { sfx.bad(); draw(`<div class="fb bad">❌ ${t}</div>`); shake($("#rfb")); };
        if (!cards.every((c, i) => c[0] === want[i])) return bad("El cambio (21:14) fue ANTES que el retiro (21:19).");
        if (ev !== "1") return bad(ev === "2" ? "Amaru vio a Rumi DESPUÉS del cambio." : ev === "3" ? "Eso pasó DESPUÉS de la modificación." : "Una muestra pequeña no prueba nada.");
        sfx.ok(); if (S.tries.r === 1) { badge("cadena"); award(10); } else award(5);
        closeModal();
        say([["cuy", "La auditoría y el circuito coinciden: fuiste tú, Sami."], ["sami", "Quería una demo perfecta. El archivo Φ me lo pidió."], ["killa", "¡Reparemos QUILLA!"]], () => setStage(6));
      };
    };
    draw();
  }

  function puzzleRestore() {
    const chips = [{ g: "h", on: true }, { g: "h", on: true }];
    const draw = () => {
      openModal(`<h2>🔧 Repara QUILLA</h2>${idea("Quita la H extra. Se valida el <b>circuito</b>, no un número exacto.")}
        <p>Toca una pieza para quitarla:</p>
        <div class="chain"><span class="chip fixed">|0⟩</span>${chips.map((c, i) => `<button class="chip ${c.on ? "" : "off"}" data-c="${i}">H</button>`).join("")}<span class="chip fixed">Medir</span></div>
        <button class="btn big" id="rrun">▶ Comprobar</button><div id="rout"></div>${codeBox(CODE.h)}`);
      mbody.querySelectorAll("[data-c]").forEach((b) => b.onclick = () => { chips[+b.dataset.c].on = !chips[+b.dataset.c].on; draw(); });
      $("#rrun").onclick = async () => {
        const gates = chips.filter((c) => c.on).map((c) => c.g), good = gates.length === 1;
        const r = await runCircuit(gates, 10);
        $("#rout").innerHTML = bars(r.counts, 10) + badgeSrc(r) + (good
          ? `<div class="fb good">✅ ¡Diseño restaurado: 0 → H → medir!</div><button class="btn big" id="rend">Reactivar QUILLA ➜</button>`
          : `<div class="fb bad">Aún no es 0 → H → medir.</div>`);
        if (good) { sfx.ok(); $("#rend").onclick = () => { closeModal(); setStage(7); award(10); if (!S.hints) badge("sinpistas"); burst(); ending(); }; } else { sfx.bad(); shake($("#rout")); }
      };
    };
    draw();
  }

  // ------------------------------------------------------------------ desafíos (para volver a jugar)
  function challenges() {
    if (S.stage < 5) return toast("🔒 Abre la caja para desbloquear");
    let streak = 0;
    const NAME = { h: "H", x: "X" };
    const draw = () => {
      const n = 1 + Math.floor(Math.random() * 3), g = Array.from({ length: n }, () => (Math.random() < 0.5 ? "h" : "x")), p = window.QSim.probs(g);
      const ans = p["1"] === 1 ? "1" : p["0"] === 1 ? "0" : "mix";
      openModal(`<div class="chal"><h2>🧪 Desafío</h2><p>Racha <span class="streak">${streak}</span> · Mejor ${S.best} · 🐛 ${S.kills}</p>
        <div class="chain"><span class="chip fixed">|0⟩</span>${g.map((x) => `<span class="chip">${NAME[x]}</span>`).join("")}<span class="chip fixed">Medir</span></div>
        <label><input type="radio" name="c" value="0"> Siempre 0</label><label><input type="radio" name="c" value="1"> Siempre 1</label><label><input type="radio" name="c" value="mix"> 50 / 50</label>
        <button class="btn big" id="cgo">Comprobar</button><div id="cfb"></div>
        <p class="small">H mezcla · H·H se cancela · X voltea</p></div>`);
      $("#cgo").onclick = async () => {
        const v = (document.querySelector("input[name=c]:checked") || {}).value; if (!v) return toast("Elige una");
        $("#cgo").disabled = true;
        const r = await runCircuit(g, 20), ok = v === ans;
        const label = { "0": "siempre 0", "1": "siempre 1", mix: "50 / 50" }[ans];
        if (ok) { streak++; sfx.ok(); award(5); if (streak > S.best) { S.best = streak; save(); } if (streak === 5) badge("racha"); } else { streak = 0; sfx.bad(); shake($("#cfb")); }
        $("#cfb").innerHTML = `<div class="fb ${ok ? "good" : "bad"}">${ok ? "✅" : "❌"} Era <b>${label}</b></div>${bars(r.counts, 20)}${badgeSrc(r)}<button class="btn big" id="cnext">Siguiente ➜</button>`;
        $("#cnext").onclick = draw;
      };
    };
    draw();
  }

  function ending() {
    const bd = Object.entries(BADGES).map(([k, v]) => `<span class="bd ${S.badges.includes(k) ? "" : "off"}" title="${v[2]}">${v[0]} ${v[1]}</span>`).join("");
    openModal(`<h2>🎉 ¡Caso resuelto!</h2><p>🔧 <b>Qué:</b> una H extra · 🦙 <b>Quién:</b> Sami · 🦊 <b>Módulo:</b> Rumi lo ocultó</p>
      <p>🏅 <b>${rankOf(S.xp)[1]}</b> · ${S.xp} XP · 🐛 ${S.kills}</p><div class="badges">${bd}</div>
      <div class="phi"><div>Φ</div><p>«Primera prueba completada. El siguiente laboratorio ya está preparado».</p></div>
      <button class="btn big" id="chal">🧪 Jugar desafíos</button>
      <h3>📝 3 preguntas finales</h3><div id="qz"></div>
      <p class="small">Circuitos de Qiskit (1 qubit) simulados en un computador clásico. Sin ventaja cuántica. Personajes ficticios.</p>
      <div class="row"><button class="btn" id="again">Jugar de nuevo</button><button class="btn" id="copy">Copiar resultados</button></div>`);
    quizForm("post", $("#qz"));
    $("#chal").onclick = challenges;
    $("#again").onclick = () => { S = Object.assign(fresh(), { mute: S.mute, best: S.best }); save(); modal.hidden = true; setBusy(false); render(); intro(); };
    $("#copy").onclick = () => { const t = JSON.stringify({ quiz: S.quiz, quizDet: S.quizDet, evidencias: S.evid.length, xp: S.xp, insignias: S.badges, bichos: S.kills, pistas: S.hints, fecha: new Date().toISOString() }); (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject()).then(() => toast("Copiado ✔"), () => toast(t)); };
  }
  function quizForm(phase, box) {
    const fb = (det) => QUIZ[phase].map((q, i) => `<div class="fb ${det[i] ? "good" : "bad"}">${det[i] ? "✅" : `❌ Era: <b>${q[1][q[2]]}</b>.`} ${q[3]}</div>`).join("");
    if (S.quiz[phase] != null) {
      const det = (S.quizDet || {})[phase];
      box.innerHTML = `<p class="ok"><b>${S.quiz[phase]} de 3</b>${S.quiz.pre != null && S.quiz.post != null ? ` · antes ${S.quiz.pre} → después ${S.quiz.post}` : ""}</p>` + (det ? fb(det) : "");
      return;
    }
    box.innerHTML = QUIZ[phase].map((q, i) => `<div class="q"><p><b>${i + 1}.</b> ${q[0]}</p>${q[1].map((o, j) => `<label><input type="radio" name="${phase}${i}" value="${j}"> ${o}</label>`).join("")}</div>`).join("") + `<button class="btn big" id="qsend">Enviar</button>`;
    box.querySelector("#qsend").onclick = () => {
      const a = QUIZ[phase].map((q, i) => (box.querySelector(`input[name=${phase}${i}]:checked`) || {}).value);
      if (a.some((v) => v == null)) return toast("Responde las 3");
      const det = a.map((v, i) => +v === QUIZ[phase][i][2]);
      S.quiz[phase] = det.filter(Boolean).length; S.quizDet = Object.assign(S.quizDet || {}, { [phase]: det }); save();
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
      <details><summary>📝 Mini quiz (opcional)</summary><div id="qz0"></div></details>
      <button class="btn big" id="play">▶ Jugar</button>
      <p class="small">Piloto: la edad y frecuencia ideales se definirán con pruebas.</p></div>`);
    quizForm("pre", $("#qz0"));
    $("#play").onclick = () => { S.started = true; save(); closeModal(); say([["killa", "¡Hola! Toca a Inti 🦅. Sigue la flecha ▼"]]); };
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
  fetch("api/run").catch(() => {}); // precalienta la función de Qiskit para que la primera medición sea rápida
  if (!S.started) intro(); else if (S.stage >= 7) ending();
  if ("serviceWorker" in navigator) addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
  window.QF = { S: () => S, interact, runCircuit, render, closeModal, setStage, say, challenges, glitchWave, get busy() { return busy; } };
})();
