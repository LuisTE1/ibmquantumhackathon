/* Quantum Files — Caso 01: El experimento fantasma. Juego de investigación (PWA). v3 */
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
    central: { name: "Sala central de QUILLA", cls: "r-central", objs: [
      { id: "inti", e: "🦅", l: "Inti", x: 20, y: 34 }, { id: "sami", e: "img:img/llama.png", l: "Sami", x: 74, y: 30 },
      { id: "killa", e: "🐇", l: "Killa", x: 84, y: 72 }, { id: "quilla", e: "🌀", l: "QUILLA", x: 48, y: 50, big: 1 },
      { id: "d_control", e: "🚪", l: "Control", x: 90, y: 47, door: ["control", 12, 50] },
      { id: "d_taller", e: "🚪", l: "Taller", x: 8, y: 80, door: ["taller", 88, 50] } ] },
    control: { name: "Sala de control", cls: "r-control", objs: [
      { id: "consola", e: "🖥️", l: "Consola", x: 50, y: 34, big: 1 }, { id: "amaru", e: "🐆", l: "Amaru", x: 24, y: 62 },
      { id: "d_central1", e: "🚪", l: "Sala central", x: 8, y: 50, door: ["central", 86, 47] } ] },
    taller: { name: "Taller de mantenimiento", cls: "r-taller", objs: [
      { id: "rumi", e: "🦊", l: "Rumi", x: 30, y: 46 }, { id: "caja", e: "📦", l: "Caja de diagnóstico", x: 66, y: 62, big: 1 },
      { id: "d_central2", e: "🚪", l: "Sala central", x: 92, y: 50, door: ["central", 14, 78] } ] },
  };
  const OBJECTIVE = [
    "Habla con Inti (🦅)", "Analiza la muestra en QUILLA (🌀)", "Compara el diseño con el circuito en la consola (🖥️)",
    "Habla con Rumi (🦊) en el Taller", "Abre la caja de diagnóstico (📦)", "Presenta los hallazgos a Sami (🦙)",
    "Restaura QUILLA: quita la H extra (🌀)", "¡Caso resuelto! Prueba los desafíos 🧪",
  ];
  const GOAL = [["central", "inti"], ["central", "quilla"], ["control", "consola"], ["taller", "rumi"], ["taller", "caja"], ["central", "sami"], ["central", "quilla"], null];
  const EVID = {
    reg73: ["Registro inicial", "De 10 mediciones, 7 dieron 1 y 3 dieron 0. Un resultado así puede deberse al azar: no prueba un sabotaje."],
    diseno: ["Diseño aprobado", "|0⟩ → H → medición. Debía producir 0 y 1 con igual probabilidad."],
    hh: ["Circuito ejecutado", "|0⟩ → H → H → medición. La segunda H revierte a la primera (no hay medición entre ambas): resultado predecible, 100 % de 0."],
    t2114: ["21:14 · Se modificó el circuito", "El registro visible no dice quién. Existe una copia de auditoría dentro del módulo retirado."],
    t2119: ["21:19 · Rumi retiró el módulo", "Ocurrió DESPUÉS del cambio: Rumi no explica por sí solo el sabotaje inicial."],
    amaru: ["Testimonio de Amaru", "«Rumi salió con una caja después de la alerta». Es verdadero, pero ocurrió después del cambio."],
    rumi: ["Confesión de Rumi", "Retiró el módulo al detectar la modificación y ocultó que lo tenía por miedo a ser culpado."],
    audit: ["Registro de auditoría recuperado", "Edición a las 21:14 desde la sesión de Sami · inserción de una segunda H · entrada eliminada del registro visible · archivo de instrucciones «PHI»."],
  };
  const RANKS = [[0, "Novato"], [30, "Detective"], [70, "Inspector"], [120, "Inspector Cuántico"]];
  const BADGES = {
    esceptico: ["🧐", "Escéptico", "Descartaste una falsa pista a la primera"], predictor: ["🔮", "Predictor", "Acertaste una predicción antes de medir"],
    mecanico: ["🔧", "Mecánico", "Resolviste el diagnóstico a la primera"], cadena: ["🧩", "Cadena perfecta", "Ordenaste los hechos y la evidencia a la primera"],
    racha: ["⚡", "Racha cuántica", "5 desafíos seguidos correctos"], sinpistas: ["🧠", "Sin pistas", "Resolviste el caso sin pedir pistas"],
  };
  // [pregunta, opciones, índice correcto, explicación]
  const QUIZ = {
    pre: [
      ["Lanzas 10 veces una moneda justa. ¿Siempre salen exactamente 5 caras?", ["Sí, siempre", "No: varía alrededor de 5", "Solo si lanzas rápido"], 1, "El azar hace que el número varíe: 5 es lo más probable, pero no es seguro."],
      ["Mides un qubit en superposición 50/50. ¿Qué obtienes?", ["Siempre 0", "Siempre 1", "0 o 1, cada uno con cierta probabilidad"], 2, "Al medir, el qubit da un solo resultado (0 o 1) y cada uno tiene su probabilidad."],
      ["7 unos en 10 mediciones de un experimento 50/50: ¿prueba que fue alterado?", ["Sí, seguro", "No: puede ser azar", "Solo si son más de 10"], 1, "Con una moneda justa, 7 o más iguales ocurre ~17 % de las veces: con tan pocas mediciones el azar lo explica."],
    ],
    post: [
      ["Aplicas H dos veces seguidas a un qubit en 0, sin medir en medio. ¿Qué obtienes al medir?", ["50 % de 0 y 50 % de 1", "Siempre 0", "Siempre 1"], 1, "La segunda H deshace la primera: el qubit vuelve a 0."],
      ["¿Qué hace la compuerta X sobre un qubit?", ["Intercambia 0 y 1", "Lo mide", "Lo deja igual"], 0, "X es como un interruptor: 0 pasa a 1 y 1 pasa a 0."],
      ["¿Qué sostiene una acusación en una investigación?", ["Una respuesta incorrecta", "Evidencia reconstruida y registros que se refuerzan", "La sospecha del director"], 1, "Una pista aislada no basta: hay que cruzar cronología, registros y reconstrucción."],
    ],
  };
  const CODE = {
    h: "from qiskit import QuantumCircuit\nfrom qiskit.primitives import StatevectorSampler\n\nqc = QuantumCircuit(1, 1)\nqc.h(0)          # Hadamard: 50/50\nqc.measure(0, 0)\nStatevectorSampler().run([qc], shots=10).result()[0].data.c.get_counts()",
    hh: "qc = QuantumCircuit(1, 1)\nqc.h(0)\nqc.h(0)          # 2.ª H: revierte a la 1.ª (sin medir en medio)\nqc.measure(0, 0)  # -> siempre 0",
    x: "qc = QuantumCircuit(1, 1)\nqc.x(0)          # X intercambia 0 y 1\nqc.measure(0, 0)",
  };
  const idea = (t) => `<div class="idea">🎓 <b>Idea clave:</b> ${t}</div>`;
  const learned = (t) => `<div class="learned">✅ <b>Lo que aprendiste:</b> ${t}</div>`;

  // ------------------------------------------------------------------ estado
  const KEY = "qf_state_v3";
  const fresh = () => ({ stage: 0, room: "central", px: 50, py: 82, evid: [], runs: 0, quiz: {}, started: false, xp: 0, badges: [], hints: 0, mute: false, best: 0, tries: {}, pred: false });
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
  };
  function burst() {
    const c = el("div", "confetti"), em = ["🎉", "✨", "⭐", "🎊", "💫"];
    for (let i = 0; i < 24; i++) { const s = el("span", "", em[i % em.length]); s.style.left = Math.random() * 100 + "%"; s.style.animationDelay = Math.random() * 0.4 + "s"; c.appendChild(s); }
    document.body.appendChild(c); setTimeout(() => c.remove(), 2300);
  }
  const shake = (n) => { if (!n) return; n.classList.remove("shake"); void n.offsetWidth; n.classList.add("shake"); };
  const rankOf = (xp) => RANKS.filter((r) => xp >= r[0]).pop();
  function award(n) {
    const before = rankOf(S.xp)[1]; S.xp += n; const after = rankOf(S.xp)[1];
    if (after !== before) { toast("⬆️ ¡Nuevo rango: " + after + "!"); burst(); sfx.up(); } else toast("+" + n + " XP");
    save(); hud();
  }
  function badge(id) { if (!S.badges.includes(id)) { S.badges.push(id); toast(BADGES[id][0] + " Insignia: " + BADGES[id][1]); sfx.ok(); save(); } }

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
  const badgeSrc = (r) => r.source === "qiskit" ? `<span class="badge q">⚛️ Qiskit ${r.version || ""} (servidor)</span>` : `<span class="badge l">💻 Simulador local (sin conexión)</span>`;
  const bars = (c, shots) => ["0", "1"].map((k) => `<div class="barrow"><b>${k}</b><div class="bar"><i style="width:${(100 * c[k]) / shots}%"></i></div><span>${c[k]} (${Math.round((100 * c[k]) / shots)} %)</span></div>`).join("");
  const codeBox = (txt) => `<details class="code"><summary>👩‍💻 Ver el código de Qiskit</summary><pre>${txt}</pre></details>`;

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
  function toast(t) { const n = $("#toast"); n.textContent = t; n.classList.add("on"); clearTimeout(toast.t); toast.t = setTimeout(() => n.classList.remove("on"), 2400); }
  function addEvid(id) { if (!S.evid.includes(id)) { S.evid.push(id); sfx.evid(); save(); award(5); toast("📓 Nueva evidencia: " + EVID[id][0]); } }
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
    if (g) { goalId = g[0] === S.room ? g[1] : doorToward(S.room, g[0]); if (g[0] !== S.room) obj += " → ve a: " + ROOMS[g[0]].name; }
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
      const t = ["Primero habla con Inti (🦅): él dirige el laboratorio. ¡Sigue la flecha amarilla ▼!", "Toca QUILLA (🌀) y usa la copia de prueba: así no tocamos las evidencias originales.",
        "En la consola de la Sala de control comparamos el diseño con lo que se ejecutó.", "Rumi tiene el módulo... o sabe dónde está. Búscalo en el Taller.",
        "Abre la caja de diagnóstico (📦) sobre la mesa de Rumi.", "Sami debe explicar el archivo PHI y la edición de las 21:14.",
        "Retira la H adicional en QUILLA y ejecuta la comprobación.", "¡Lo logramos, detective! Prueba los desafíos 🧪 para subir de rango."];
      say([["killa", t[Math.min(S.stage, 7)]]]);
    },
    inti() {
      if (S.stage === 0) {
        say([["inti", "Detective Cuy, gracias por venir. Anoche QUILLA empezó a entregar resultados distintos a los previstos... y el módulo de calibración desapareció."],
          ["inti", "Mira el primer registro: de diez mediciones, siete dieron 1 y tres dieron 0. Creo que eso demuestra el fallo."],
          ["inti", "El circuito aprobado debía producir ceros y unos con igual probabilidad."],
          ["killa", "Podemos reproducir lo que pasó con una copia de prueba, sin tocar las evidencias originales. ¡Vamos a QUILLA (🌀)!"]], () => { addEvid("reg73"); setStage(1); });
      } else say([["inti", S.stage >= 2 ? "El diseño aprobado era: 0 → H → medición. Yo conservo la copia original." : "Usa la copia de prueba en QUILLA. Quiero saber si de verdad hay un sabotaje."]]);
    },
    amaru() { say([["amaru", "Rumi salió con una caja después de la alerta."]], () => addEvid("amaru")); },
    sami() {
      if (S.stage < 5) return say([["sami", "Solo preparé los gráficos de la presentación."]]);
      if (S.stage === 5) return say([["sami", "Solo preparé los gráficos de la presentación..."], ["cuy", "Tengo el registro de auditoría. Ordenemos lo que pasó."]], puzzleResolve);
      say([["sami", "Pensé que una demostración perfecta salvaría el proyecto. El archivo decía exactamente qué cambiar."]]);
    },
    rumi() {
      if (S.stage < 3) return say([["rumi", "Revisé el equipo, pero no cambié el experimento."]]);
      if (S.stage === 3) return say([["cuy", "El circuito se modificó a las 21:14. Tú retiraste el módulo a las 21:19."],
        ["rumi", "Retiré el módulo porque detecté una modificación. Quería revisarlo antes de avisar... y después tuve miedo de que pensaran que fui yo."],
        ["rumi", "Toma la caja de diagnóstico. Para leer su memoria hay que demostrar que el control responde."]], () => { addEvid("rumi"); setStage(4); });
      say([["rumi", "La caja está sobre la mesa. Perdón por no avisar antes."]]);
    },
    quilla() {
      if (S.stage < 1) return say([["killa", "QUILLA parpadea. Habla primero con Inti."]]);
      if (S.stage === 6) return puzzleRestore();
      if (S.stage >= 7) return say([["sys", "QUILLA funciona según su diseño: 0 → H → medición."]]);
      puzzleSample();
    },
    consola() {
      if (S.stage < 2) return say([["killa", "Todavía no sabemos qué comparar. Analiza la muestra en QUILLA."]]);
      puzzleCircuit();
    },
    caja() {
      if (S.stage < 4) return say([["sys", "Una caja de diagnóstico cerrada. Rumi debe entregarla."]]);
      puzzleDiag();
    },
  };

  // ------------------------------------------------------------------ puzles
  function puzzleSample() {
    const hist = [];
    openModal(`<h2>🌀 Muestra de prueba</h2>
      ${idea("Un qubit, al medirlo, da <b>0 o 1</b>. La compuerta <b>H</b> lo deja en 50/50, como lanzar una moneda justa. Con pocas mediciones, las cantidades <b>varían por azar</b>.")}
      <p>Copia de prueba: <b>|0⟩ → H → medición</b>. Pulsa el botón varias veces y observa qué cambia.</p>
      <div id="p1out"></div><button class="btn" id="p1run">▶ Ejecutar 10 mediciones</button><div id="p1hist" class="hist"></div><div id="p1q"></div>${codeBox(CODE.h)}`);
    $("#p1run").onclick = async () => {
      const r = await runCircuit(["h"], 10); hist.push(`${r.counts["1"]}/${r.counts["0"]}`); S.runs++;
      $("#p1out").innerHTML = bars(r.counts, 10) + badgeSrc(r); $("#p1hist").innerHTML = "<b>Tus ejecuciones (unos/ceros):</b> " + hist.join(" · ") + (hist.length < 3 ? ` <i>(haz ${3 - hist.length} más)</i>` : "");
      if (hist.length >= 3 && !$("#p1q").innerHTML) {
        $("#p1q").innerHTML = `<div class="q"><p><b>¿Siete unos y tres ceros bastan para demostrar un sabotaje?</b></p>
          <label><input type="radio" name="a" value="si"> Sí, es una prueba</label><label><input type="radio" name="a" value="no"> No</label>
          <button class="btn" id="p1ok">Responder</button><div id="p1fb"></div></div>`;
        $("#p1ok").onclick = () => {
          const v = (document.querySelector("input[name=a]:checked") || {}).value; if (!v) return toast("Elige una respuesta");
          S.tries.p1 = (S.tries.p1 || 0) + 1;
          if (v === "no") {
            sfx.ok();
            $("#p1fb").innerHTML = `<div class="fb good">✅ <b>¡Correcto!</b> Mira tus ejecuciones: con el mismo circuito salen cantidades distintas. <b>Killa:</b> «En una muestra pequeña puede haber diferencias. Hay que revisar cómo estaba preparado el experimento».</div>` +
              learned("<b>Probabilidad</b> = lo que esperas (50/50). <b>Frecuencia</b> = lo que observas, y con pocas mediciones puede alejarse.");
            addEvid("diseno"); if (S.tries.p1 === 1) { badge("esceptico"); award(10); } else award(5);
            $("#p1ok").outerHTML = `<button class="btn big" id="p1done">Continuar ➜</button>`;
            $("#p1done").onclick = () => { closeModal(); setStage(2); };
          } else { sfx.bad(); shake($("#p1fb")); $("#p1fb").innerHTML = `<div class="fb bad">❌ <b>Todavía no.</b> Mira tus ejecuciones: con el <i>mismo</i> circuito las cantidades cambian. Una sola muestra de 10 no alcanza para probar nada. Inténtalo de nuevo.</div>`; }
        };
      }
    };
  }

  function puzzleCircuit() {
    const tried = {};
    openModal(`<h2>🖥️ Consola de control</h2>
      ${idea("La compuerta <b>H</b> mezcla 0 y 1. Si aplicas <b>H dos veces seguidas</b> (sin medir en medio), la segunda deshace a la primera y el qubit vuelve a 0.")}
      <div class="term"><div>Diseño aprobado: <b>|0⟩ → H → medición</b></div><div>Circuito ejecutado: <b>|0⟩ → H → ❓ → medición</b></div>
      <div>Registro del sistema: el resultado ejecutado fue <b>predecible (100 % de 0)</b>.</div><div>21:14 · se modificó el circuito &nbsp; 21:19 · Rumi retiró el módulo</div></div>
      <p><b>1) Predice:</b> ¿qué pieza en ❓ produce un resultado predecible (100 % de 0)?</p>
      <label><input type="radio" name="g" value="x"> X</label><label><input type="radio" name="g" value="h"> H</label>
      <p><b>2) Reconstruye y comprueba</b> (prueba las dos):</p><div class="row"><button class="btn" data-t="hx">▶ Probar H → X</button><button class="btn" data-t="hh">▶ Probar H → H</button></div>
      <div id="p2out"></div><div id="p2fb"></div>${codeBox(CODE.hh)}`);
    mbody.querySelectorAll("[data-t]").forEach((b) => b.onclick = async () => {
      const t = b.dataset.t, gates = t === "hx" ? ["h", "x"] : ["h", "h"], r = await runCircuit(gates, 100);
      tried[t] = true; const out = $("#p2out");
      out.innerHTML = `<div class="res"><b>${t === "hx" ? "H → X" : "H → H"}</b>${bars(r.counts, 100)}${badgeSrc(r)}</div>` + out.innerHTML;
      if (tried.hx && tried.hh && !$("#p2fb").innerHTML) {
        const g = (document.querySelector("input[name=g]:checked") || {}).value, ok = g === "h";
        ok ? sfx.ok() : sfx.bad();
        $("#p2fb").innerHTML = `<div class="fb ${ok ? "good" : "bad"}">${ok ? "✅ <b>¡Acertaste la predicción!</b>" : g ? "❌ <b>Tu predicción era distinta</b>, pero ahora tienes la evidencia." : "ℹ️ No hiciste predicción, pero ya tienes la evidencia."}
          Solo <b>H → H</b> da 100 % de 0: añadieron una <b>segunda H</b>. <b>Killa:</b> «La segunda H revierte a la primera y no hay medición entre ambas. Por eso el resultado se vuelve predecible».</div>` +
          learned("<b>H · H = no hacer nada</b>: dos compuertas H seguidas se cancelan. Ese cambio escondido hacía el resultado predecible.") +
          `<button class="btn big" id="p2done">Guardar hallazgo en la libreta ➜</button>`;
        if (ok && !S.pred) { S.pred = true; badge("predictor"); award(10); } else if (!ok) award(5);
        $("#p2done").onclick = () => { addEvid("hh"); addEvid("t2114"); addEvid("t2119"); closeModal(); setStage(3); };
      }
    });
  }

  function puzzleDiag() {
    if (S.stage >= 5) return showAudit();
    openModal(`<h2>📦 Diagnóstico del módulo</h2>
      ${idea("La compuerta <b>X</b> es como un interruptor: <b>intercambia 0 y 1</b>. Si empiezas en 0 y aplicas X, al medir obtienes 1.")}
      <p>Para que el módulo responda, transforma las entradas. Elige qué hacer en cada fila y ejecuta.</p>
      <table class="dt"><tr><th>Entrada</th><th>Salida requerida</th><th>Operación</th></tr>
      <tr><td>0</td><td>1</td><td><select id="d0"><option value="none">Dejar igual</option><option value="x">Aplicar X</option></select></td></tr>
      <tr><td>1</td><td>0</td><td><select id="d1"><option value="none">Dejar igual</option><option value="x">Aplicar X</option></select></td></tr></table>
      <button class="btn" id="drun">▶ Ejecutar diagnóstico</button><div id="dout"></div>${codeBox(CODE.x)}
      <p class="small">Es una secuencia de diagnóstico del juego; no representa un sistema real de seguridad cuántica.</p>`);
    $("#drun").onclick = async () => {
      S.tries.d = (S.tries.d || 0) + 1;
      let ok = true, html = "";
      for (const inp of [0, 1]) {
        const op = $("#d" + inp).value, gates = (inp === 1 ? ["x"] : []).concat(op === "x" ? ["x"] : []), want = inp === 0 ? "1" : "0", r = await runCircuit(gates, 10);
        const pass = r.probs[want] === 1; ok = ok && pass;
        html += `<div class="res">${pass ? "✅" : "❌"} Entrada ${inp} → salida obtenida: ${r.counts["1"] === 10 ? "1" : r.counts["0"] === 10 ? "0" : "mezcla"} (requerida ${want}) ${badgeSrc(r)}</div>`;
      }
      $("#dout").innerHTML = html;
      if (ok) {
        sfx.ok();
        $("#dout").innerHTML += `<div class="fb good"><b>Killa:</b> «X intercambia 0 y 1. Hemos comprobado que el módulo responde correctamente». Memoria de auditoría desbloqueada.</div>` +
          learned("<b>X voltea el qubit</b>: 0 → 1 y 1 → 0. Por eso la entrada 0 necesita X y la entrada 1 también (para llegar a 0 hay que volver a girarla).") + `<button class="btn big" id="dgo">Leer la auditoría ➜</button>`;
        if (S.tries.d === 1) { badge("mecanico"); award(10); } else award(5);
        $("#dgo").onclick = () => { addEvid("audit"); setStage(5); showAudit(); };
      } else { sfx.bad(); shake($("#dout")); $("#dout").innerHTML += `<div class="fb bad">Aún no coincide. Recuerda: <b>X intercambia 0 y 1</b>. Revisa qué salida necesita cada entrada.</div>`; }
    };
  }
  function showAudit() {
    openModal(`<h2>📜 Registro de auditoría recuperado</h2><div class="term"><div>21:14 · edición del circuito · sesión de <b>Sami</b></div>
      <div>21:14 · inserción de una segunda H</div><div>21:15 · la entrada fue eliminada del registro visible</div><div>archivo de instrucciones: <b>PHI</b></div></div>
      <p>Ahora presenta los hallazgos a <b>Sami</b> en la Sala central.</p><button class="btn big" id="aok">Cerrar</button>`);
    $("#aok").onclick = closeModal;
  }

  function puzzleResolve() {
    const cards = [["c", "Rumi retiró el módulo después de detectar el cambio."], ["a", "Sami añadió una segunda H."], ["b", "QUILLA empezó a producir el resultado determinado por ese circuito."]];
    const want = ["a", "b", "c"];
    const draw = (msg) => {
      openModal(`<h2>🧩 Reconstruye la secuencia</h2>
        ${idea("Una acusación necesita <b>evidencia que se refuerce</b>: cronología + registro + reconstrucción. Una respuesta incorrecta o una sospecha no bastan.")}
        <p><b>1) Ordena</b> los hechos del primero al último (usa ▲ ▼):</p>
        ${cards.map((c, i) => `<div class="card"><span>${i + 1}.</span><p>${c[1]}</p><button data-up="${i}" aria-label="subir">▲</button><button data-dn="${i}" aria-label="bajar">▼</button></div>`).join("")}
        <p><b>2) ¿Qué evidencia respalda la acusación?</b></p>
        <label><input type="radio" name="ev" value="1"> El registro interno recuperado, junto con la reconstrucción del circuito</label>
        <label><input type="radio" name="ev" value="2"> El testimonio de Amaru</label>
        <label><input type="radio" name="ev" value="3"> Que Rumi ocultó el módulo</label>
        <label><input type="radio" name="ev" value="4"> Los siete unos y tres ceros</label>
        <button class="btn big" id="rsend">⚖️ Presentar a Sami</button><div id="rfb">${msg || ""}</div>`);
      mbody.querySelectorAll("[data-up]").forEach((b) => b.onclick = () => { const i = +b.dataset.up; if (i > 0) { [cards[i - 1], cards[i]] = [cards[i], cards[i - 1]]; draw(); } });
      mbody.querySelectorAll("[data-dn]").forEach((b) => b.onclick = () => { const i = +b.dataset.dn; if (i < 2) { [cards[i + 1], cards[i]] = [cards[i], cards[i + 1]]; draw(); } });
      $("#rsend").onclick = () => {
        const ev = (document.querySelector("input[name=ev]:checked") || {}).value;
        if (!ev) return toast("Elige la evidencia que sostiene la acusación");
        S.tries.r = (S.tries.r || 0) + 1;
        const bad = (t) => { sfx.bad(); draw(`<div class="fb bad">❌ ${t}</div>`); shake($("#rfb")); };
        if (!cards.every((c, i) => c[0] === want[i])) return bad("El orden no coincide con los horarios: el cambio (21:14) ocurre <b>antes</b> de que Rumi retire el módulo (21:19).");
        if (ev !== "1") return bad(ev === "2" ? "El testimonio de Amaru es cierto, pero ocurrió <b>después</b> del cambio: no explica quién lo hizo." : ev === "3" ? "Rumi ocultó el módulo, pero eso pasó <b>después</b> de la modificación." : "Una muestra desigual no demuestra un sabotaje por sí sola (lo viste en la primera prueba).");
        sfx.ok(); if (S.tries.r === 1) { badge("cadena"); award(10); } else award(5);
        closeModal();
        say([["cuy", "El registro interno y la reconstrucción del circuito coinciden: la edición de las 21:14 salió de tu sesión, Sami."],
          ["sami", "Pensé que una demostración perfecta salvaría el proyecto. El archivo decía exactamente qué cambiar... estaba firmado con Φ."],
          ["killa", "Restauremos QUILLA: hay que retirar la H adicional."]], () => setStage(6));
      };
    };
    draw();
  }

  function puzzleRestore() {
    const chips = [{ g: "h", on: true }, { g: "h", on: true }];
    const draw = () => {
      openModal(`<h2>🔧 Restaurar QUILLA</h2>
        ${idea("Para volver al diseño aprobado hay que <b>quitar la H adicional</b>. El éxito se valida por la <b>configuración correcta</b>, no por obtener exactamente 5 ceros y 5 unos (el azar siempre varía).")}
        <p>Toca una pieza para retirarla o devolverla:</p>
        <div class="chain"><span class="chip fixed">|0⟩</span>${chips.map((c, i) => `<button class="chip ${c.on ? "" : "off"}" data-c="${i}">H</button>`).join("")}<span class="chip fixed">Medir</span></div>
        <button class="btn" id="rrun">▶ Ejecutar comprobación</button><div id="rout"></div>${codeBox(CODE.h)}`);
      mbody.querySelectorAll("[data-c]").forEach((b) => b.onclick = () => { chips[+b.dataset.c].on = !chips[+b.dataset.c].on; draw(); });
      $("#rrun").onclick = async () => {
        const gates = chips.filter((c) => c.on).map((c) => c.g), good = gates.length === 1;
        const r = await runCircuit(gates, 10);
        $("#rout").innerHTML = bars(r.counts, 10) + badgeSrc(r) + (good
          ? `<div class="fb good">✅ Configuración correcta: 0 → H → medición.</div>${learned("Quitar la H extra restauró el diseño. <b>Validamos el circuito</b>, no un resultado exacto.")}<button class="btn big" id="rend">Reactivar QUILLA ➜</button>`
          : `<div class="fb bad">Todavía no coincide con el diseño aprobado (0 → H → medición).</div>`);
        if (good) { sfx.ok(); $("#rend").onclick = () => { closeModal(); setStage(7); award(10); if (!S.hints) badge("sinpistas"); burst(); ending(); }; } else { sfx.bad(); shake($("#rout")); }
      };
    };
    draw();
  }

  // ------------------------------------------------------------------ desafíos (modo para volver a jugar)
  function challenges() {
    if (S.stage < 5) return toast("🔒 Los desafíos se desbloquean al abrir la caja de diagnóstico");
    let streak = 0;
    const NAME = { h: "H", x: "X" };
    const draw = () => {
      const n = 1 + Math.floor(Math.random() * 3), g = Array.from({ length: n }, () => (Math.random() < 0.5 ? "h" : "x")), p = window.QSim.probs(g);
      const ans = p["1"] === 1 ? "1" : p["0"] === 1 ? "0" : "mix";
      openModal(`<div class="chal"><h2>🧪 Desafío rápido</h2><p>Racha: <span class="streak">${streak}</span> · Mejor: ${S.best} · ${rankOf(S.xp)[1]}</p>
        <p>Empieza en 0, aplica estas compuertas <b>en orden</b> y mide. ¿Qué obtendrás?</p>
        <div class="chain"><span class="chip fixed">|0⟩</span>${g.map((x) => `<span class="chip">${NAME[x]}</span>`).join("")}<span class="chip fixed">Medir</span></div>
        <label><input type="radio" name="c" value="0"> Siempre 0</label><label><input type="radio" name="c" value="1"> Siempre 1</label><label><input type="radio" name="c" value="mix"> Mitad y mitad (50/50)</label>
        <button class="btn big" id="cgo">Comprobar</button><div id="cfb"></div>
        <p class="small">Reglas: <b>H</b> mezcla 0 y 1 · <b>H·H</b> se cancela · <b>X</b> intercambia 0 y 1 · <b>X</b> no cambia una mezcla 50/50.</p></div>`);
      $("#cgo").onclick = async () => {
        const v = (document.querySelector("input[name=c]:checked") || {}).value; if (!v) return toast("Elige una respuesta");
        $("#cgo").disabled = true;
        const r = await runCircuit(g, 20), ok = v === ans;
        const label = { "0": "siempre 0", "1": "siempre 1", mix: "mitad y mitad" }[ans];
        if (ok) { streak++; sfx.ok(); award(5); if (streak > S.best) { S.best = streak; save(); } if (streak === 5) badge("racha"); } else { streak = 0; sfx.bad(); shake($("#cfb")); }
        $("#cfb").innerHTML = `<div class="fb ${ok ? "good" : "bad"}">${ok ? "✅ <b>¡Correcto!</b>" : "❌ <b>No era esa.</b>"} La respuesta es <b>${label}</b>.</div>${bars(r.counts, 20)}${badgeSrc(r)}<button class="btn big" id="cnext">Siguiente desafío ➜</button>`;
        $("#cnext").onclick = draw;
      };
    };
    draw();
  }

  function ending() {
    const bd = Object.entries(BADGES).map(([k, v]) => `<span class="bd ${S.badges.includes(k) ? "" : "off"}" title="${v[2]}">${v[0]} ${v[1]}</span>`).join("");
    openModal(`<h2>🎉 Caso resuelto</h2><p>Sabemos <b>qué</b> alteraron (una H adicional), <b>quién</b> lo hizo (Sami) y <b>por qué</b> faltaba el módulo (Rumi lo retiró y lo ocultó).</p>
      <p>🏅 <b>${rankOf(S.xp)[1]}</b> · ${S.xp} XP</p><div class="badges">${bd}</div>
      <div class="phi"><div>Φ</div><p>«Primera prueba completada. El siguiente laboratorio ya está preparado».</p><p class="small">En el mapa aparece un observatorio en otro punto del Perú…</p></div>
      <div class="row"><button class="btn big" id="chal">🧪 Jugar desafíos (sube de rango)</button></div>
      <h3>📝 Tres preguntas finales</h3><div id="qz"></div><h3>Qué es real y qué es simulación</h3>
      <p class="small">Los circuitos son de Qiskit (1 qubit) y se simulan en un computador clásico; no es hardware cuántico y no afirmamos ventaja cuántica. Personajes y caso son ficticios.</p>
      <div class="row"><button class="btn" id="again">Jugar de nuevo</button><button class="btn" id="copy">Copiar mis resultados</button></div>`);
    quizForm("post", $("#qz"));
    $("#chal").onclick = challenges;
    $("#again").onclick = () => { S = Object.assign(fresh(), { mute: S.mute, best: S.best }); save(); modal.hidden = true; setBusy(false); render(); intro(); };
    $("#copy").onclick = () => { const t = JSON.stringify({ quiz: S.quiz, quizDet: S.quizDet, evidencias: S.evid.length, xp: S.xp, insignias: S.badges, pistas: S.hints, fecha: new Date().toISOString() }); (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject()).then(() => toast("Copiado ✔"), () => toast(t)); };
  }
  function quizForm(phase, box) {
    const fb = (det) => QUIZ[phase].map((q, i) => `<div class="fb ${det[i] ? "good" : "bad"}">${det[i] ? "✅ <b>Correcto.</b>" : `❌ <b>Era: ${q[1][q[2]]}.</b>`} ${q[3]}</div>`).join("");
    if (S.quiz[phase] != null) {
      const det = (S.quizDet || {})[phase];
      box.innerHTML = `<p class="ok"><b>Acertaste ${S.quiz[phase]} de 3.</b>${S.quiz.pre != null && S.quiz.post != null ? ` Antes: ${S.quiz.pre} → después: ${S.quiz.post}.` : ""}</p>` + (det ? fb(det) : "") + (phase === "pre" ? `<p class="small">No pasa nada si fallaste: el juego te lo enseña mientras investigas.</p>` : "");
      return;
    }
    box.innerHTML = QUIZ[phase].map((q, i) => `<div class="q"><p><b>${i + 1}.</b> ${q[0]}</p>${q[1].map((o, j) => `<label><input type="radio" name="${phase}${i}" value="${j}"> ${o}</label>`).join("")}</div>`).join("") + `<button class="btn big" id="qsend">Enviar respuestas</button>`;
    box.querySelector("#qsend").onclick = () => {
      const a = QUIZ[phase].map((q, i) => (box.querySelector(`input[name=${phase}${i}]:checked`) || {}).value);
      if (a.some((v) => v == null)) return toast("Responde las 3 preguntas");
      const det = a.map((v, i) => +v === QUIZ[phase][i][2]);
      S.quiz[phase] = det.filter(Boolean).length; S.quizDet = Object.assign(S.quizDet || {}, { [phase]: det }); save();
      det.every(Boolean) ? sfx.ok() : sfx.bad(); quizForm(phase, box);
    };
  }

  // ------------------------------------------------------------------ libreta, inicio y controles
  function notebook() {
    const items = S.evid.map((id) => `<div class="card"><div><b>${EVID[id][0]}</b><p>${EVID[id][1]}</p></div></div>`).join("") || "<p>Aún no hay evidencias. Habla con Inti (sigue la flecha ▼).</p>";
    const bd = Object.entries(BADGES).map(([k, v]) => `<span class="bd ${S.badges.includes(k) ? "" : "off"}" title="${v[2]}">${v[0]} ${v[1]}</span>`).join("");
    openModal(`<h2>📓 Libreta de evidencias</h2>${items}<h3>🏅 Insignias</h3><div class="badges">${bd}</div><p class="small">${S.badges.length} de ${Object.keys(BADGES).length} · ${rankOf(S.xp)[1]} · ${S.xp} XP</p><button class="btn big" id="nclose">Cerrar</button>`); $("#nclose").onclick = closeModal;
  }
  function intro() {
    openModal(`<div class="intro"><h1>🐹 Quantum Files</h1><h2>Caso 01: El experimento fantasma</h2>
      <p>En <b>Qori Lab</b>, un laboratorio de animales científicos en los Andes, la máquina cuántica <b>QUILLA</b> empezó a dar resultados raros y desapareció una pieza clave. Eres el <b>Detective Cuy</b>: descubre <b>qué cambiaron, quién lo hizo y dónde está el módulo</b>.</p>
      <div class="how"><div><span>🚶</span>Camina o toca a los personajes. Sigue la flecha amarilla ▼</div><div><span>📓</span>Junta evidencias en tu libreta</div><div><span>⚛️</span>Resuelve experimentos con circuitos y sube de rango</div></div>
      <div class="tip">💡 Si te pierdes, pulsa el botón <b>💡</b> de arriba: te dice qué hacer y dónde ir.</div>
      <p class="small">Pensado para estudiantes de secundaria y universidad; la edad y la frecuencia de uso ideales las definiremos con la prueba piloto. Un caso dura ~5–8 min.</p>
      <details open><summary>📝 3 preguntas rápidas antes de empezar (opcional)</summary><div id="qz0"></div></details>
      <button class="btn big" id="play">▶ Empezar a investigar</button></div>`);
    quizForm("pre", $("#qz0"));
    $("#play").onclick = () => { S.started = true; save(); closeModal(); say([["killa", "¡Bienvenido, detective! Toca a Inti (🦅): la flecha amarilla ▼ te muestra el camino."]]); };
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
  if (!S.started) intro(); else if (S.stage >= 7) ending();
  if ("serviceWorker" in navigator) addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
  window.QF = { S: () => S, interact, runCircuit, render, closeModal, setStage, say, challenges, get busy() { return busy; } };
})();
