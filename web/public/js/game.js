/* Quantum Files — Caso 01: El experimento fantasma. Juego de investigación (PWA). */
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
      { id: "d_control", e: "🚪", l: "Sala de control", x: 94, y: 47, door: ["control", 12, 50] },
      { id: "d_taller", e: "🚪", l: "Taller", x: 7, y: 78, door: ["taller", 88, 50] } ] },
    control: { name: "Sala de control", cls: "r-control", objs: [
      { id: "consola", e: "🖥️", l: "Consola", x: 50, y: 34, big: 1 }, { id: "amaru", e: "🐆", l: "Amaru", x: 24, y: 62 },
      { id: "d_central1", e: "🚪", l: "Sala central", x: 6, y: 50, door: ["central", 88, 47] } ] },
    taller: { name: "Taller de mantenimiento", cls: "r-taller", objs: [
      { id: "rumi", e: "🦊", l: "Rumi", x: 30, y: 46 }, { id: "caja", e: "📦", l: "Caja de diagnóstico", x: 66, y: 62, big: 1 },
      { id: "d_central2", e: "🚪", l: "Sala central", x: 94, y: 50, door: ["central", 12, 78] } ] },
  };
  const OBJECTIVE = [
    "Habla con Inti (🦅) en la Sala central.", "Analiza la muestra en QUILLA (🌀).",
    "Ve a la Sala de control y compara el diseño con el circuito ejecutado (🖥️).",
    "Encuentra el módulo: habla con Rumi (🦊) en el Taller.", "Abre la caja de diagnóstico (📦) y completa la prueba.",
    "Presenta los hallazgos a Sami (🦙) en la Sala central.", "Restaura QUILLA: retira la H adicional (🌀).", "¡Caso resuelto!",
  ];
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
  const QUIZ = {
    pre: [
      ["Lanzas 10 veces una moneda justa. ¿Siempre salen exactamente 5 caras?", ["Sí, siempre", "No: varía alrededor de 5", "Solo si lanzas rápido"], 1],
      ["Mides un qubit en superposición 50/50. ¿Qué obtienes?", ["Siempre 0", "Siempre 1", "0 o 1, cada uno con cierta probabilidad"], 2],
      ["7 unos en 10 mediciones de un experimento 50/50: ¿prueba que fue alterado?", ["Sí, seguro", "No: puede ser azar", "Solo si son más de 10"], 1],
    ],
    post: [
      ["Aplicas H dos veces seguidas a un qubit en 0, sin medir en medio. ¿Qué obtienes al medir?", ["50 % de 0 y 50 % de 1", "Siempre 0", "Siempre 1"], 1],
      ["¿Qué hace la compuerta X sobre un qubit?", ["Intercambia 0 y 1", "Lo mide", "Lo deja igual"], 0],
      ["¿Qué sostiene una acusación en una investigación?", ["Una respuesta incorrecta", "Evidencia reconstruida y registros que se refuerzan", "La sospecha del director"], 1],
    ],
  };
  const CODE = {
    h: "from qiskit import QuantumCircuit\nfrom qiskit.primitives import StatevectorSampler\n\nqc = QuantumCircuit(1, 1)\nqc.h(0)          # Hadamard: 50/50\nqc.measure(0, 0)\nStatevectorSampler().run([qc], shots=10).result()[0].data.c.get_counts()",
    hh: "qc = QuantumCircuit(1, 1)\nqc.h(0)\nqc.h(0)          # 2.ª H: revierte a la 1.ª (sin medir en medio)\nqc.measure(0, 0)  # -> siempre 0",
    x: "qc = QuantumCircuit(1, 1)\nqc.x(0)          # X intercambia 0 y 1\nqc.measure(0, 0)",
  };

  // ------------------------------------------------------------------ estado
  const KEY = "qf_state_v2";
  const fresh = () => ({ stage: 0, room: "central", px: 50, py: 82, evid: [], runs: 0, tested: {}, quiz: {}, started: false });
  let S = fresh();
  try { const r = JSON.parse(localStorage.getItem(KEY) || "null"); if (r && r.stage != null) S = Object.assign(fresh(), r); } catch (e) { /* sin almacenamiento */ }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* ignorar */ } };

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
  const badge = (r) => r.source === "qiskit" ? `<span class="badge q">⚛️ Qiskit ${r.version || ""} (servidor)</span>` : `<span class="badge l">💻 Simulador local (sin conexión)</span>`;
  const bars = (c, shots) => ["0", "1"].map((k) => `<div class="barrow"><b>${k}</b><div class="bar"><i style="width:${(100 * c[k]) / shots}%"></i></div><span>${c[k]} (${Math.round((100 * c[k]) / shots)} %)</span></div>`).join("");
  const codeBox = (txt) => `<details class="code"><summary>👩‍💻 Ver el código de Qiskit</summary><pre>${txt}</pre></details>`;

  // ------------------------------------------------------------------ UI base
  const stage = $("#stage"), playerEl = $("#player"), dlg = $("#dialog"), modal = $("#modal"), mbody = $("#mbody");
  let objEls = {}, busy = false, keys = {}, target = null, autoId = null, nearId = null, lines = [], lineDone = null;

  function say(arr, done) { lines = arr.slice(); lineDone = done || null; dlg.hidden = false; nextLine(); }
  function nextLine() {
    if (!lines.length) { dlg.hidden = true; const d = lineDone; lineDone = null; busy = !modal.hidden; if (d) d(); return; }
    const [who, text] = lines.shift(), c = CHAR[who] || CHAR.sys;
    busy = true; $("#d-av").innerHTML = c[2] ? `<img src="${c[2]}" alt="">` : c[0]; $("#d-name").textContent = c[1]; $("#d-text").textContent = text;
  }
  function openModal(html) { mbody.innerHTML = html; modal.hidden = false; busy = true; mbody.scrollTop = 0; }
  function closeModal() { modal.hidden = true; busy = !dlg.hidden; render(); }
  function toast(t) { const n = $("#toast"); n.textContent = t; n.classList.add("on"); clearTimeout(toast.t); toast.t = setTimeout(() => n.classList.remove("on"), 2600); }
  function addEvid(id) { if (!S.evid.includes(id)) { S.evid.push(id); toast("📓 Nueva evidencia: " + EVID[id][0]); save(); } }
  function setStage(n) { if (n > S.stage) { S.stage = n; save(); render(); } }

  function render() {
    const room = ROOMS[S.room];
    stage.className = "stage " + room.cls;
    $("#roomname").textContent = room.name;
    $("#objective").textContent = OBJECTIVE[Math.min(S.stage, OBJECTIVE.length - 1)];
    stage.querySelectorAll(".obj").forEach((n) => n.remove());
    objEls = {};
    room.objs.forEach((o) => {
      const art = o.e.startsWith("img:") ? `<img src="${o.e.slice(4)}" alt="" draggable="false">` : `<span class="em">${o.e}</span>`;
      const n = el("button", "obj" + (o.big ? " big" : "") + (o.door ? " door" : ""), `${art}<span class="lb">${o.l}</span>`);
      n.style.left = o.x + "%"; n.style.top = o.y + "%"; n.dataset.id = o.id; n.setAttribute("aria-label", o.l);
      n.addEventListener("click", (ev) => { ev.stopPropagation(); goTo(o); });
      stage.appendChild(n); objEls[o.id] = n;
    });
    placePlayer();
    $("#evcount").textContent = S.evid.length;
  }
  function placePlayer() { playerEl.style.left = S.px + "%"; playerEl.style.top = S.py + "%"; }
  const objOf = (id) => Object.values(ROOMS).flatMap((r) => r.objs).find((o) => o.id === id);
  const dist = (ax, ay, bx, by) => Math.hypot(ax - bx, (ay - by) * 0.625);

  function goTo(o) { if (busy) return; if (dist(S.px, S.py, o.x, o.y) < 12) { interact(o.id); } else { target = { x: o.x, y: Math.min(o.y + 7, 92) }; autoId = o.id; } }
  function interact(id) {
    if (busy) return;
    const o = objOf(id);
    if (o && o.door) { S.room = o.door[0]; S.px = o.door[1]; S.py = o.door[2]; target = null; autoId = null; save(); render(); return; }
    (HANDLERS[id] || (() => {}))();
  }

  // ------------------------------------------------------------------ personajes y objetos
  const HANDLERS = {
    killa() {
      const t = ["Primero habla con Inti: él dirige el laboratorio.", "Usa la copia de prueba en QUILLA: así no tocamos las evidencias originales.",
        "En la consola de la Sala de control podemos comparar el diseño con lo que se ejecutó.", "Rumi tiene el módulo... o sabe dónde está. Búscalo en el Taller.",
        "La caja de diagnóstico está sobre la mesa de Rumi.", "Sami debe explicar el archivo PHI y la edición de las 21:14.",
        "Retira la H adicional en QUILLA y ejecuta la comprobación.", "¡Lo logramos, detective!"];
      say([["killa", t[Math.min(S.stage, 7)]]]);
    },
    inti() {
      if (S.stage === 0) {
        say([["inti", "Detective Cuy, gracias por venir. Anoche QUILLA empezó a entregar resultados distintos a los previstos... y el módulo de calibración desapareció."],
          ["inti", "Mira el primer registro: de diez mediciones, siete dieron 1 y tres dieron 0. Creo que eso demuestra el fallo."],
          ["inti", "El circuito aprobado debía producir ceros y unos con igual probabilidad."],
          ["killa", "Podemos reproducir lo que pasó con una copia de prueba, sin tocar las evidencias originales."]], () => { addEvid("reg73"); setStage(1); });
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
    openModal(`<h2>🌀 Muestra de prueba</h2><p>Copia preparada para dar 0 y 1 con igual probabilidad: <b>|0⟩ → H → medición</b>. Ejecuta 10 mediciones varias veces y observa.</p>
      <div id="p1out"></div><button class="btn" id="p1run">Ejecutar 10 mediciones</button><div id="p1hist" class="hist"></div><div id="p1q"></div>${codeBox(CODE.h)}`);
    $("#p1run").onclick = async () => {
      const r = await runCircuit(["h"], 10); hist.push(`${r.counts["1"]} unos / ${r.counts["0"]} ceros`); S.runs++;
      $("#p1out").innerHTML = bars(r.counts, 10) + badge(r); $("#p1hist").innerHTML = "<b>Tus ejecuciones:</b> " + hist.join(" · ");
      if (hist.length >= 3 && !$("#p1q").innerHTML) {
        $("#p1q").innerHTML = `<div class="q"><p><b>¿Siete unos y tres ceros bastan para demostrar un sabotaje?</b></p>
          <label><input type="radio" name="a" value="si"> Sí, es una prueba</label><label><input type="radio" name="a" value="no"> No</label>
          <button class="btn" id="p1ok">Responder</button><p id="p1fb"></p></div>`;
        $("#p1ok").onclick = () => {
          const v = (document.querySelector("input[name=a]:checked") || {}).value; if (!v) return;
          if (v === "no") {
            $("#p1fb").innerHTML = "✅ <b>Killa:</b> «En una muestra pequeña puede haber diferencias. Necesitamos revisar cómo estaba preparado el experimento».";
            addEvid("diseno");
            setTimeout(() => { closeModal(); setStage(2); }, 1600);
          } else $("#p1fb").textContent = "Mira tus ejecuciones: con el mismo circuito las cantidades cambian. ¿Una sola muestra basta?";
        };
      }
    };
  }

  function puzzleCircuit() {
    const tried = {};
    openModal(`<h2>🖥️ Consola de control</h2>
      <div class="term"><div>Diseño aprobado: <b>|0⟩ → H → medición</b></div><div>Circuito ejecutado: <b>|0⟩ → H → ❓ → medición</b></div>
      <div>Registro del sistema: el resultado ejecutado fue <b>predecible (100 % de 0)</b>.</div><div>21:14 · se modificó el circuito &nbsp; 21:19 · Rumi retiró el módulo</div></div>
      <p><b>Predice:</b> ¿qué pieza en ❓ produce un resultado predecible (100 % de 0)?</p>
      <label><input type="radio" name="g" value="x"> X</label><label><input type="radio" name="g" value="h"> H</label>
      <p>Reconstruye y comprueba:</p><div class="row"><button class="btn" data-t="hx">Probar H → X</button><button class="btn" data-t="hh">Probar H → H</button></div>
      <div id="p2out"></div><div id="p2fb"></div>${codeBox(CODE.hh)}`);
    mbody.querySelectorAll("[data-t]").forEach((b) => b.onclick = async () => {
      const t = b.dataset.t, gates = t === "hx" ? ["h", "x"] : ["h", "h"], r = await runCircuit(gates, 100);
      tried[t] = true; const out = $("#p2out");
      out.innerHTML = `<div class="res"><b>${t === "hx" ? "H → X" : "H → H"}</b>${bars(r.counts, 100)}${badge(r)}</div>` + out.innerHTML;
      if (tried.hx && tried.hh && !$("#p2fb").innerHTML) {
        const g = (document.querySelector("input[name=g]:checked") || {}).value;
        $("#p2fb").innerHTML = `<p class="ok">${g === "h" ? "✅ ¡Acertaste!" : "Tu predicción era distinta, pero ahora tienes la evidencia."} Solo <b>H → H</b> da 100 % de 0: añadieron una <b>segunda H</b>.
          <br><b>Killa:</b> «La segunda H revierte el efecto de la primera en este circuito, y no hay medición entre ambas. Por eso el resultado se vuelve predecible».</p><button class="btn" id="p2done">Guardar hallazgo en la libreta</button>`;
        $("#p2done").onclick = () => { addEvid("hh"); addEvid("t2114"); addEvid("t2119"); closeModal(); setStage(3); };
      }
    });
  }

  function puzzleDiag() {
    if (S.stage >= 5) return showAudit();
    openModal(`<h2>📦 Diagnóstico del módulo</h2><p>Para que el módulo responda, transforma las entradas conocidas. Elige qué hacer en cada fila y ejecuta.</p>
      <table class="dt"><tr><th>Entrada</th><th>Salida requerida</th><th>Operación</th></tr>
      <tr><td>0</td><td>1</td><td><select id="d0"><option value="none">Dejar igual</option><option value="x">Aplicar X</option></select></td></tr>
      <tr><td>1</td><td>0</td><td><select id="d1"><option value="none">Dejar igual</option><option value="x">Aplicar X</option></select></td></tr></table>
      <button class="btn" id="drun">Ejecutar diagnóstico</button><div id="dout"></div>${codeBox(CODE.x)}
      <p class="small">Es una secuencia de diagnóstico del juego; no representa un sistema real de seguridad cuántica.</p>`);
    $("#drun").onclick = async () => {
      let ok = true, html = "";
      for (const inp of [0, 1]) {
        const op = $("#d" + inp).value, gates = (inp === 1 ? ["x"] : []).concat(op === "x" ? ["x"] : []), want = inp === 0 ? "1" : "0", r = await runCircuit(gates, 10);
        const pass = r.probs[want] === 1; ok = ok && pass;
        html += `<div class="res">${pass ? "✅" : "❌"} Entrada ${inp} → salida obtenida: ${r.counts["1"] === 10 ? "1" : r.counts["0"] === 10 ? "0" : "mezcla"} (requerida ${want}) ${badge(r)}</div>`;
      }
      $("#dout").innerHTML = html;
      if (ok) {
        $("#dout").innerHTML += `<p class="ok"><b>Killa:</b> «X intercambia 0 y 1. Hemos comprobado que el módulo responde correctamente». Memoria de auditoría desbloqueada.</p><button class="btn" id="dgo">Leer la auditoría</button>`;
        $("#dgo").onclick = () => { addEvid("audit"); setStage(5); showAudit(); };
      } else $("#dout").innerHTML += `<p>Aún no coincide. Recuerda: X intercambia 0 y 1.</p>`;
    };
  }
  function showAudit() {
    openModal(`<h2>📜 Registro de auditoría recuperado</h2><div class="term"><div>21:14 · edición del circuito · sesión de <b>Sami</b></div>
      <div>21:14 · inserción de una segunda H</div><div>21:15 · la entrada fue eliminada del registro visible</div><div>archivo de instrucciones: <b>PHI</b></div></div>
      <p>Ahora presenta los hallazgos a <b>Sami</b> en la Sala central.</p><button class="btn" id="aok">Cerrar</button>`);
    $("#aok").onclick = closeModal;
  }

  function puzzleResolve() {
    const cards = [["c", "Rumi retiró el módulo después de detectar el cambio."], ["a", "Sami añadió una segunda H."], ["b", "QUILLA empezó a producir el resultado determinado por ese circuito."]];
    const want = ["a", "b", "c"];
    const draw = () => {
      openModal(`<h2>🧩 Reconstruye la secuencia</h2><p>Ordena los hechos del primero al último:</p>
        ${cards.map((c, i) => `<div class="card"><span>${i + 1}.</span><p>${c[1]}</p><button data-up="${i}" aria-label="subir">▲</button><button data-dn="${i}" aria-label="bajar">▼</button></div>`).join("")}
        <p><b>¿Qué evidencia respalda la acusación?</b></p>
        <label><input type="radio" name="ev" value="1"> El registro interno recuperado, junto con la reconstrucción del circuito</label>
        <label><input type="radio" name="ev" value="2"> El testimonio de Amaru</label>
        <label><input type="radio" name="ev" value="3"> Que Rumi ocultó el módulo</label>
        <label><input type="radio" name="ev" value="4"> Los siete unos y tres ceros</label>
        <button class="btn" id="rsend">Presentar a Sami</button><p id="rfb"></p>`);
      mbody.querySelectorAll("[data-up]").forEach((b) => b.onclick = () => { const i = +b.dataset.up; if (i > 0) { [cards[i - 1], cards[i]] = [cards[i], cards[i - 1]]; draw(); } });
      mbody.querySelectorAll("[data-dn]").forEach((b) => b.onclick = () => { const i = +b.dataset.dn; if (i < 2) { [cards[i + 1], cards[i]] = [cards[i], cards[i + 1]]; draw(); } });
      $("#rsend").onclick = () => {
        const ev = (document.querySelector("input[name=ev]:checked") || {}).value;
        if (!ev) { $("#rfb").textContent = "Elige la evidencia que sostiene la acusación."; return; }
        const okOrder = cards.every((c, i) => c[0] === want[i]);
        if (!okOrder) { $("#rfb").textContent = "El orden no coincide con los horarios: el cambio (21:14) ocurre antes de que Rumi retire el módulo (21:19)."; return; }
        if (ev !== "1") { $("#rfb").textContent = ev === "2" ? "El testimonio de Amaru es cierto, pero ocurrió después del cambio: no explica quién lo hizo." : ev === "3" ? "Rumi ocultó el módulo, pero eso pasó después de la modificación." : "Una muestra desigual no demuestra un sabotaje por sí sola."; return; }
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
      openModal(`<h2>🔧 Restaurar QUILLA</h2><p>Toca una pieza para retirarla o devolverla. Debe quedar el <b>diseño aprobado</b>.</p>
        <div class="chain"><span class="chip fixed">|0⟩</span>${chips.map((c, i) => `<button class="chip ${c.on ? "" : "off"}" data-c="${i}">H</button>`).join("")}<span class="chip fixed">Medir</span></div>
        <button class="btn" id="rrun">Ejecutar comprobación</button><div id="rout"></div>${codeBox(CODE.h)}`);
      mbody.querySelectorAll("[data-c]").forEach((b) => b.onclick = () => { chips[+b.dataset.c].on = !chips[+b.dataset.c].on; draw(); });
      $("#rrun").onclick = async () => {
        const gates = chips.filter((c) => c.on).map((c) => c.g), good = gates.length === 1;
        const r = await runCircuit(gates, 10);
        $("#rout").innerHTML = bars(r.counts, 10) + badge(r) + (good
          ? `<p class="ok">✅ Configuración correcta: 0 → H → medición. El éxito se valida por el circuito, no por obtener exactamente cinco 0 y cinco 1.</p><button class="btn" id="rend">Reactivar QUILLA</button>`
          : `<p>Todavía no coincide con el diseño aprobado (0 → H → medición).</p>`);
        if (good) $("#rend").onclick = () => { closeModal(); setStage(7); ending(); };
      };
    };
    draw();
  }

  function ending() {
    openModal(`<h2>🎉 Caso resuelto</h2><p>Sabemos <b>qué</b> alteraron (una H adicional), <b>quién</b> lo hizo (Sami) y <b>por qué</b> faltaba el módulo (Rumi lo retiró y lo ocultó).</p>
      <div class="phi"><div>Φ</div><p>«Primera prueba completada. El siguiente laboratorio ya está preparado».</p><p class="small">En el mapa aparece un observatorio en otro punto del Perú…</p></div>
      <h3>📝 Tres preguntas finales</h3><div id="qz"></div><h3>Qué es real y qué es simulación</h3>
      <p class="small">Los circuitos son de Qiskit (1 qubit) y se simulan en un computador clásico; no es hardware cuántico y no afirmamos ventaja cuántica. Personajes y caso son ficticios.</p>
      <div class="row"><button class="btn" id="again">Jugar de nuevo</button><button class="btn" id="copy">Copiar mis resultados</button></div>`);
    quizForm("post", $("#qz"));
    $("#again").onclick = () => { S = fresh(); save(); modal.hidden = true; busy = false; render(); };
    $("#copy").onclick = () => { const t = JSON.stringify({ quiz: S.quiz, evidencias: S.evid.length, fecha: new Date().toISOString() }); (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject()).then(() => toast("Copiado"), () => toast(t)); };
  }
  function quizForm(phase, box, after) {
    if (S.quiz[phase] != null) { box.innerHTML = `<p class="ok">Respondiste ${S.quiz[phase]} de 3 bien.${S.quiz.pre != null && S.quiz.post != null ? ` Antes: ${S.quiz.pre} → después: ${S.quiz.post}.` : ""}</p>`; return; }
    box.innerHTML = QUIZ[phase].map((q, i) => `<div class="q"><p>${q[0]}</p>${q[1].map((o, j) => `<label><input type="radio" name="${phase}${i}" value="${j}"> ${o}</label>`).join("")}</div>`).join("") + `<button class="btn" id="qsend">Enviar</button>`;
    box.querySelector("#qsend").onclick = () => {
      const a = QUIZ[phase].map((q, i) => (box.querySelector(`input[name=${phase}${i}]:checked`) || {}).value);
      if (a.some((v) => v == null)) return toast("Responde las 3 preguntas");
      S.quiz[phase] = a.reduce((n, v, i) => n + (+v === QUIZ[phase][i][2] ? 1 : 0), 0); save(); quizForm(phase, box, after); if (after) after();
    };
  }

  // ------------------------------------------------------------------ libreta, inicio y controles
  function notebook() {
    const items = S.evid.map((id) => `<div class="card"><div><b>${EVID[id][0]}</b><p>${EVID[id][1]}</p></div></div>`).join("") || "<p>Aún no hay evidencias. Habla con Inti.</p>";
    openModal(`<h2>📓 Libreta de evidencias</h2>${items}<button class="btn" id="nclose">Cerrar</button>`); $("#nclose").onclick = closeModal;
  }
  function intro() {
    openModal(`<div class="intro"><h1>🐹 Quantum Files</h1><h2>Caso 01: El experimento fantasma</h2>
      <p>En los Andes está <b>Qori Lab</b>, un laboratorio donde animales científicos estudian tecnología cuántica. Su proyecto es <b>QUILLA</b>, un equipo que prepara, transforma y mide qubits.</p>
      <p>Anoche, QUILLA empezó a dar resultados distintos y el módulo de calibración desapareció. En la pantalla principal:</p>
      <div class="phi"><p>«Están mirando los resultados. Deberían mirar lo que ocurrió antes de medir». — Φ</p></div>
      <p>Inti, el director, llamó al detective cuy. <b>Descubre qué cambiaron, quién intervino y dónde está el módulo.</b></p>
      <p class="small">Controles: <b>WASD / flechas</b> para moverte y <b>E</b> para interactuar. En el móvil: toca los personajes o usa los botones. Pensado para estudiantes de secundaria y universidad; la edad y la frecuencia de uso ideales las definiremos con la prueba piloto. Un caso dura ~5–8 min.</p>
      <details><summary>📝 3 preguntas rápidas antes de empezar (opcional)</summary><div id="qz0"></div></details>
      <button class="btn big" id="play">▶ Empezar a investigar</button></div>`);
    quizForm("pre", $("#qz0"));
    $("#play").onclick = () => { S.started = true; save(); closeModal(); say([["killa", "Bienvenido, detective. Habla con Inti (🦅). Camina con WASD o toca a los personajes."]]); };
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
  $("#btn-reset").addEventListener("click", () => { if (confirm("¿Reiniciar el caso desde cero?")) { S = fresh(); save(); modal.hidden = true; dlg.hidden = true; busy = false; render(); intro(); } });
  $("#mclose").addEventListener("click", () => { if (S.started) closeModal(); });

  let last = performance.now(), moving = false;
  function loop(now) {
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    if (!busy) {
      let dx = (keys.r ? 1 : 0) - (keys.l ? 1 : 0), dy = (keys.d ? 1 : 0) - (keys.u ? 1 : 0);
      if (!dx && !dy && target) {
        const tx = target.x - S.px, ty = target.y - S.py, m = Math.hypot(tx, ty * 0.625);
        if (m < 1.2) { target = null; if (autoId) { const id = autoId; autoId = null; interact(id); } } else { dx = tx / m; dy = (ty / m) * 0.625 * 1.6; const n = Math.hypot(dx, dy) || 1; dx /= n; dy /= n; }
      }
      const mv = !!(dx || dy);
      if (mv !== moving) { moving = mv; $("#pimg").src = mv ? "img/cuy_run.png" : "img/cuy_idle.png"; }
      if (dx) $("#pimg").style.transform = dx < 0 ? "scaleX(-1)" : "none";
      if (dx || dy) { const n = Math.hypot(dx, dy); S.px = Math.max(4, Math.min(96, S.px + (dx / n) * 34 * dt)); S.py = Math.max(16, Math.min(92, S.py + (dy / n) * 34 * dt * 1.4)); placePlayer(); }
      let best = null, bd = 12;
      for (const o of ROOMS[S.room].objs) { const d = dist(S.px, S.py, o.x, o.y); if (d < bd) { bd = d; best = o; } }
      const id = best ? best.id : null;
      if (id !== nearId) { nearId = id; Object.entries(objEls).forEach(([k, n]) => n.classList.toggle("near", k === id)); $("#btn-act").textContent = best ? (best.door ? "🚪 Entrar" : "E · " + best.l) : "E · Interactuar"; $("#btn-act").classList.toggle("on", !!best); }
    }
    requestAnimationFrame(loop);
  }
  function fit() { stage.style.setProperty("--u", stage.clientWidth / 100 + "px"); }
  addEventListener("resize", fit);

  // ------------------------------------------------------------------ inicio
  fit(); render(); requestAnimationFrame(loop);
  if (!S.started) intro(); else if (S.stage >= 7) ending();
  if ("serviceWorker" in navigator) addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
  window.QF = { S: () => S, interact, runCircuit, render, closeModal, setStage, say, get busy() { return busy; } };
})();
