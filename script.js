(() => {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const NAMES = ["Do", "Do#", "Re", "Re#", "Mi", "Fa", "Fa#", "Sol", "Sol#", "La", "La#", "Si"];
  const SCALES = { pmaj: [0, 2, 4, 7, 9], pmin: [0, 3, 5, 7, 10], maj: [0, 2, 4, 5, 7, 9, 11], chr: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] };
  const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);
  const noteName = (m) => NAMES[((m % 12) + 12) % 12] + (Math.floor(m / 12) - 1);

  const S = {
    src: "file", view: "mix", cols: 10, rows: 6, scale: "pmin", root: 48, thr: 20, sens: 0.02, cool: 240,
    wave: "triangle", atk: 0.008, rel: 0.7, cut: 5500, rev: 0.25, vol: 0.85, mapVel: true, mapPan: true, mirror: false,
    tint: 0.35, veil: 0, lines: true, notes: true, parts: true,
    mode: "zonas", cRad: 0.20, cursorHalo: true,
    sndMode: "banco", pRate: 1.0, vChisme: 1.0, vFantasma: 0.5, vPiano: 0.65, vNat: 0.5,
    lx: 0.5, nl: 3, segs: 8, sdur: 6, steps: 16, bright: 90, mapDir: false, invert: false
  };

  const CHISME_TITLES = [
    "secreto de corral", "reclamo de encierro", "susurro al oído",
    "murmullo ansioso", "risa cómplice", "confesión humana"
  ];

  const VOICES = [
    { name: "chisme 1", wave: "square", atk: 0.003, rel: 0.25, oct: 12, cut: 4500, color: "#E5B25D", ej: "chisme_1.wav" },
    { name: "fantasma", wave: "sine", atk: 0.09, rel: 2.2, oct: 0, cut: 1200, color: "#F2EFEB", ej: "fantasma_1.wav" },
    { name: "piano", wave: "sawtooth", atk: 0.02, rel: 1.2, oct: -12, cut: 850, color: "#D63D3D", ej: "piano_1.wav" },
    { name: "susurro", wave: "triangle", atk: 0.002, rel: 0.6, oct: 24, cut: 3000, color: "#A8C256", ej: "chisme_3.wav" },
  ];
  const rgba = (hex, a) => "rgba(" + parseInt(hex.slice(1, 3), 16) + "," + parseInt(hex.slice(3, 5), 16) + "," + parseInt(hex.slice(5, 7), 16) + "," + a.toFixed(3) + ")";

  let toastT = 0;
  function toast(msg) {
    const t = $("toast");
    if (!t) return;
    t.textContent = msg; t.hidden = false;
    clearTimeout(toastT); toastT = setTimeout(() => { t.hidden = true; }, 3200);
  }

  // Toggle manifiesto reflexivo
  if ($("toggleManifesto")) {
    $("toggleManifesto").addEventListener("click", () => {
      const m = $("manifesto");
      m.classList.toggle("minimized");
      $("toggleManifesto").textContent = m.classList.contains("minimized") ? "+" : "_";
    });
  }

  // ================= dock =================
  document.querySelectorAll(".trigger").forEach((tr) => tr.addEventListener("click", () => {
    const id = tr.dataset.panel, open = tr.getAttribute("aria-expanded") === "true";
    document.querySelectorAll(".trigger").forEach((t) => { t.setAttribute("aria-expanded", "false"); $(t.dataset.panel).hidden = true; });
    if (!open) { tr.setAttribute("aria-expanded", "true"); $(id).hidden = false; }
  }));
  document.querySelectorAll("[data-close]").forEach((b) => b.addEventListener("click", () => {
    const p = b.closest(".panel"); p.hidden = true; document.querySelector('[data-panel="' + p.id + '"]').setAttribute("aria-expanded", "false");
  }));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") document.querySelectorAll("[data-close]").forEach((b) => { if (!b.closest(".panel").hidden) b.click(); }); });

  // ================= fuentes =================
  const video = document.createElement("video");
  video.muted = true; video.loop = true; video.playsInline = true;
  video.src = "videos/granja_web.mp4";
  video.load();
  video.play().catch(() => {});

  let stream = null;
  const demo = document.createElement("canvas"); demo.width = 640; demo.height = 360;
  const dctx = demo.getContext("2d");
  const lanes = [0.22, 0.5, 0.78], cars = [];
  for (let i = 0; i < 7; i++) {
    const lane = i % 3;
    cars.push({ lane, x: Math.random() * 640, v: (lane === 1 ? -1 : 1) * (90 + Math.random() * 160), w: 60 + Math.random() * 70, c: ["#E5B25D", "#F2EFEB", "#D63D3D", "#A8C256"][i % 4] });
  }
  let birdT = 0;
  function drawDemo(dt) {
    dctx.fillStyle = "#0B0A09"; dctx.fillRect(0, 0, 640, 360);
    dctx.fillStyle = "#1A1715"; lanes.forEach((y) => dctx.fillRect(0, y * 360 - 34, 640, 68));
    dctx.strokeStyle = "rgba(244,241,234,.18)"; dctx.setLineDash([18, 16]); dctx.lineWidth = 2;
    [0.36, 0.64].forEach((y) => { dctx.beginPath(); dctx.moveTo(0, y * 360); dctx.lineTo(640, y * 360); dctx.stroke(); });
    dctx.setLineDash([]);
    for (const c of cars) {
      c.x += c.v * dt;
      if (c.v > 0 && c.x > 700) { c.x = -c.w - Math.random() * 200; c.v = 90 + Math.random() * 160; }
      if (c.v < 0 && c.x < -c.w - 60) { c.x = 640 + Math.random() * 200; c.v = -(90 + Math.random() * 160); }
      dctx.fillStyle = c.c; dctx.fillRect(c.x, lanes[c.lane] * 360 - 24, c.w, 48);
    }
    birdT += dt;
    dctx.fillStyle = "#F2EFEB"; dctx.beginPath(); dctx.arc((birdT * 70) % 760 - 60, 40 + Math.sin(birdT * 2.2) * 18, 7, 0, Math.PI * 2); dctx.fill();
  }

  function setSrc(src, status) {
    S.src = src; prev = null;
    $("srcFile").setAttribute("aria-pressed", String(src === "file"));
    $("srcDemo").setAttribute("aria-pressed", String(src === "demo"));
    $("srcCam").setAttribute("aria-pressed", String(src === "cam" || src === "camoff"));
    $("camCtx").hidden = !(src === "cam" || src === "camoff");
    $("vidCtx").hidden = src !== "file";
    $("camOff").textContent = src === "camoff" ? "Encender cámara" : "Apagar cámara";
  }
  function stopStream() { if (stream) { stream.getTracks().forEach((t) => t.stop()); stream = null; } }
  async function startCam() {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) throw new Error("sin API");
      stopStream(); video.pause(); video.removeAttribute("src");
      stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 360 }, audio: false });
      video.srcObject = stream; await video.play();
      setSrc("cam", "Fuente: cámara en vivo");
    } catch (e) {
      toast("Cámara bloqueada: abre la versión local o GitHub Pages");
    }
  }
  $("srcFile").addEventListener("click", () => {
    stopStream();
    if (!video.src || !video.src.includes("granja_web.mp4")) {
      video.srcObject = null; video.src = "videos/granja_web.mp4"; video.loop = true;
      video.play().catch(() => {});
    } else {
      video.play().catch(() => {});
    }
    setSrc("file", "La ilusión de la libertad · Corral de gallinas");
  });
  $("srcDemo").addEventListener("click", () => { stopStream(); video.pause(); setSrc("demo", "Fuente: ejemplo sintético"); });
  $("srcCam").addEventListener("click", startCam);
  $("camOff").addEventListener("click", () => {
    if (S.src === "cam") { stopStream(); video.srcObject = null; setSrc("camoff", "Cámara apagada"); }
    else startCam();
  });
  $("vChange").addEventListener("click", () => $("fileInput").click());
  $("fileInput").addEventListener("change", async (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    stopStream(); video.srcObject = null; video.src = URL.createObjectURL(f); video.loop = $("vLoop").getAttribute("aria-pressed") === "true";
    try { await video.play(); } catch (_) {}
    setSrc("file", "Video propio: " + f.name);
    e.target.value = "";
  });
  $("vPlay").addEventListener("click", () => { video.play().catch(() => {}); });
  $("vPause").addEventListener("click", () => video.pause());
  $("vLoop").addEventListener("click", (e) => {
    video.loop = !video.loop; e.currentTarget.setAttribute("aria-pressed", String(video.loop));
    toast(video.loop ? "Loop activado" : "Loop desactivado");
  });

  // ================= capas =================
  function bindToggle(id, key, after) {
    $(id).addEventListener("click", (e) => { S[key] = !S[key]; e.currentTarget.setAttribute("aria-pressed", String(S[key])); if (after) after(); updVisState(); });
  }
  function updVisState() {
    const on = [S.lines && "grilla", S.notes && "voces", S.parts && "inquietud"].filter(Boolean);
    $("stVis").textContent = S.view === "mask" ? "máquina" : on.length ? on.length + " capas" : "solo corral";
  }
  bindToggle("tLines", "lines"); bindToggle("tNotes", "notes"); bindToggle("tParts", "parts", () => { parts.length = 0; });
  $("tSignal").addEventListener("click", (e) => { const on = $("signal").hidden; $("signal").hidden = !on; e.currentTarget.setAttribute("aria-pressed", String(on)); });
  $("sigHide").addEventListener("click", () => { $("signal").hidden = true; $("tSignal").setAttribute("aria-pressed", "false"); });

  // ================= audio, conversación continua y banco sonoro =================
  let ac = null, main = null, master, analyser, recDest, shape;
  let natSource = null, natGain = null, natFilter = null;
  let gossipTrackSource = null, gossipGain = null, gossipPan = null;
  const BANCO = {};
  const impulses = new WeakMap();

  function impulse(ctx) {
    if (impulses.has(ctx)) return impulses.get(ctx);
    const len = Math.floor(ctx.sampleRate * 2.5), buf = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const d = buf.getChannelData(ch);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.5);
    }
    impulses.set(ctx, buf); return buf;
  }

  function buildChain(ctx) {
    const filter = ctx.createBiquadFilter(); filter.type = "lowpass"; filter.frequency.value = S.cut; filter.Q.value = 0.85;
    const dry = ctx.createGain(), wet = ctx.createGain(), conv = ctx.createConvolver(), out = ctx.createGain();
    conv.buffer = impulse(ctx);
    filter.connect(dry); filter.connect(conv); conv.connect(wet); dry.connect(out); wet.connect(out);
    const ch = { input: filter, filter, dry, wet, out }; setRev(ch); return ch;
  }

  function setRev(ch) {
    if (!ch) return;
    ch.dry.gain.value = 1 - S.rev * 0.45;
    ch.wet.gain.value = S.rev * 0.75;
  }

  async function cargarSonido(nombre, url) {
    try {
      const resp = await fetch(url);
      if (!resp.ok) return;
      const buf = await resp.arrayBuffer();
      BANCO[nombre] = await ac.decodeAudioData(buf);
    } catch (e) {
      console.warn("No se pudo decodificar", url, e);
    }
  }

  async function cargarBanco() {
    toast("Cargando voces humanas...");
    const lista = [
      ["gossipesp_track", "sonidos/gossipesp_track.wav"],
      ["chisme_1", "sonidos/chisme_1.wav"],
      ["chisme_2", "sonidos/chisme_2.wav"],
      ["chisme_3", "sonidos/chisme_3.wav"],
      ["chisme_4", "sonidos/chisme_4.wav"],
      ["chisme_5", "sonidos/chisme_5.wav"],
      ["chisme_6", "sonidos/chisme_6.wav"],
      ["fantasma_1", "sonidos/fantasma_1.wav"],
      ["fantasma_2", "sonidos/fantasma_2.wav"],
      ["piano_1", "sonidos/piano_1.wav"],
      ["piano_2", "sonidos/piano_2.wav"],
      ["naturaleza", "sonidos/naturaleza_loop.wav"]
    ];
    await Promise.all(lista.map(([id, url]) => cargarSonido(id, url)));
    startNatureLoop();
    startGossipTrack();
    toast("Audio activo · Pasa el cursor sobre las gallinas para subir el volumen");
    muestra("piano_1", 0.65, 0, 1.0);
  }

  // Pista de conversación continua de gossipesp.wav
  function startGossipTrack() {
    if (!ac || !BANCO["gossipesp_track"]) return;
    if (gossipTrackSource) { try { gossipTrackSource.stop(); } catch(_) {} gossipTrackSource = null; }
    gossipTrackSource = ac.createBufferSource();
    gossipTrackSource.buffer = BANCO["gossipesp_track"];
    gossipTrackSource.loop = true;

    // Filtros de inteligibilidad vocal humana:
    // 1. High-pass a 130 Hz: corta graves sordos
    const hp = ac.createBiquadFilter(); hp.type = "highpass"; hp.frequency.value = 130;
    // 2. Peaking filter en 2800 Hz (+5 dB): resalta consonantes y siseos de los susurros en español
    const presenceNode = ac.createBiquadFilter(); presenceNode.type = "peaking"; presenceNode.frequency.value = 2800; presenceNode.Q.value = 1.0; presenceNode.gain.value = 5.0;
    // 3. Low-pass a 9500 Hz: conserva aire y articulación sin asperezas
    const lp = ac.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 9500;

    gossipGain = ac.createGain();
    gossipGain.gain.value = 0.0001; // en reposo apenas se escucha

    gossipPan = ac.createStereoPanner();
    gossipPan.pan.value = 0;

    gossipTrackSource.connect(hp);
    hp.connect(presenceNode);
    presenceNode.connect(lp);
    lp.connect(gossipGain);
    gossipGain.connect(gossipPan);
    // Conectamos directamente a master para evitar el filtro general y asegurar nitidez cristalina
    gossipPan.connect(master);
    gossipTrackSource.start();
  }

  // Pista ambiental de naturaleza salvaje
  function startNatureLoop() {
    if (!ac || !BANCO["naturaleza"]) return;
    if (natSource) { try { natSource.stop(); } catch(_) {} natSource = null; }
    natSource = ac.createBufferSource();
    natSource.buffer = BANCO["naturaleza"];
    natSource.loop = true;
    natGain = ac.createGain();
    natGain.gain.value = S.vNat * 0.55;
    natFilter = ac.createBiquadFilter();
    natFilter.type = "lowpass";
    natFilter.frequency.value = 5000;
    natSource.connect(natFilter);
    natFilter.connect(natGain);
    natGain.connect(master);
    natSource.start();
  }

  function asfixiarNaturaleza(factor = 0.5) {
    if (!ac || !natFilter) return;
    const t = ac.currentTime;
    natFilter.frequency.cancelScheduledValues(t);
    natFilter.frequency.setValueAtTime(natFilter.frequency.value, t);
    natFilter.frequency.exponentialRampToValueAtTime(Math.max(400, 5000 * (1 - factor)), t + 0.1);
    natFilter.frequency.exponentialRampToValueAtTime(5000, t + 2.5);
  }

  function muestra(nombre, vel, pan, velocidad = 1) {
    if (!ac) return 0.5;
    if (ac.state === "suspended") ac.resume();
    if (!BANCO[nombre]) return 0.5;
    const src = ac.createBufferSource();
    src.buffer = BANCO[nombre];
    src.playbackRate.value = Math.max(0.4, Math.min(2.2, velocidad));
    const g = ac.createGain();
    g.gain.value = Math.min(1.5, 1.1 * vel);
    let node = g;
    if (ac.createStereoPanner && S.mapPan) {
      const p = ac.createStereoPanner();
      p.pan.value = Math.max(-1, Math.min(1, pan));
      g.connect(p);
      node = p;
    }
    src.connect(g);
    if (nombre.startsWith("chisme_")) {
      // Los chismes van directo a master para conservar nitidez y articulación
      node.connect(master);
    } else {
      node.connect(main.input);
    }
    src.start();
    return BANCO[nombre].duration / src.playbackRate.value;
  }

  function initAudio() {
    if (ac) return;
    ac = new (window.AudioContext || window.webkitAudioContext)();
    main = buildChain(ac);
    master = ac.createGain(); master.gain.value = S.vol;
    const comp = ac.createDynamicsCompressor(); comp.threshold.value = -12; comp.ratio.value = 3.5;
    analyser = ac.createAnalyser(); analyser.fftSize = 1024;
    shape = ac.createAnalyser(); shape.fftSize = 2048; main.filter.connect(shape);
    recDest = ac.createMediaStreamDestination();
    main.out.connect(master); master.connect(comp); comp.connect(analyser); analyser.connect(ac.destination); comp.connect(recDest);
    cargarBanco();
  }

  function voice(ctx, inputs, midi, vel, pan, opt) {
    if (!ctx) return 0.5;
    if (ctx.state === "suspended") ctx.resume();
    const t = ctx.currentTime + 0.01;
    const wave = opt ? opt.wave : S.wave, atk = opt ? opt.atk : S.atk, rel = opt ? opt.rel : S.rel;
    const o = ctx.createOscillator(); o.type = wave; o.frequency.value = mtof(midi);
    const g = ctx.createGain(), peak = 0.24 * vel, hold = 0.06;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(peak, t + atk);
    g.gain.setTargetAtTime(peak * 0.6, t + atk, 0.08);
    g.gain.setTargetAtTime(0.0001, t + atk + hold, rel / 4);
    o.connect(g);
    let node = g;
    if (opt && opt.cut) { const f = ctx.createBiquadFilter(); f.type = "lowpass"; f.frequency.value = opt.cut; f.Q.value = 1.2; g.connect(f); node = f; }
    if (ctx.createStereoPanner && S.mapPan) { const p = ctx.createStereoPanner(); p.pan.value = pan; node.connect(p); node = p; }
    inputs.forEach((i) => node.connect(i));
    o.start(t); o.stop(t + atk + hold + rel * 1.6 + 0.1);
    return atk + hold + rel * 1.6 + 0.1;
  }

  const soundOn = () => ac && ac.state === "running";
  function updSoundBtn() {
    const on = soundOn();
    $("soundBtn").setAttribute("aria-pressed", String(on));
    $("soundBtn").textContent = on ? "■ Apagar sonido" : "▶ Activar sonido";
    $("noteDl").disabled = !on || lastMidi == null;
    $("recBtn").disabled = !on && !recording;
  }

  $("soundBtn").addEventListener("click", async () => {
    if (!ac) {
      initAudio();
      try { await ac.resume(); } catch (_) {}
      video.play().catch(() => {});
    } else {
      try {
        if (ac.state === "running") {
          await ac.suspend();
          toast("Sonido pausado");
        } else {
          await ac.resume();
          video.play().catch(() => {});
          toast("Sonido activado · Pasa el cursor sobre las gallinas");
        }
      } catch (_) {}
    }
    updSoundBtn();
  });

  // ================= descargas =================
  let dlCap;
  async function downloadsCap() {
    if (dlCap !== undefined) return dlCap;
    try { dlCap = window.claude && window.claude.use ? await window.claude.use("downloads") : null; } catch (_) { dlCap = null; }
    return dlCap;
  }
  function wavFromBuffer(buf) {
    const ch = Math.min(2, buf.numberOfChannels), sr = buf.sampleRate, n = buf.length;
    const out = new ArrayBuffer(44 + n * ch * 2), v = new DataView(out);
    const w = (o, s) => { for (let i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i)); };
    w(0, "RIFF"); v.setUint32(4, 36 + n * ch * 2, true); w(8, "WAVE"); w(12, "fmt "); v.setUint32(16, 16, true); v.setUint16(20, 1, true);
    v.setUint16(22, ch, true); v.setUint32(24, sr, true); v.setUint32(28, sr * ch * 2, true); v.setUint16(32, ch * 2, true); v.setUint16(34, 16, true);
    w(36, "data"); v.setUint32(40, n * ch * 2, true);
    const data = []; for (let c = 0; c < ch; c++) data.push(buf.getChannelData(c));
    let o = 44;
    for (let i = 0; i < n; i++) for (let c = 0; c < ch; c++) { const s = Math.max(-1, Math.min(1, data[c][i])); v.setInt16(o, s < 0 ? s * 0x8000 : s * 0x7fff, true); o += 2; }
    return new Blob([out], { type: "audio/wav" });
  }
  async function deliver(blob, base) {
    const cap = await downloadsCap();
    if (cap) {
      try { await cap.save({ filename: base + ".webm", data: blob }); toast("Descarga lista"); }
      catch (e) { toast(e && e.code === "declined" ? "Descarga cancelada" : "No se pudo descargar en esta vista"); }
      return;
    }
    let file = blob, ext = ".webm";
    try { const buf = await ac.decodeAudioData(await blob.arrayBuffer()); file = wavFromBuffer(buf); ext = ".wav"; } catch (_) {}
    const a = document.createElement("a"); a.href = URL.createObjectURL(file); a.download = base + ext;
    document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    toast("Descargando " + base + ext);
  }
  function pickMime() {
    if (!window.MediaRecorder) return null;
    for (const m of ["audio/webm;codecs=opus", "audio/webm", "audio/ogg"]) if (MediaRecorder.isTypeSupported(m)) return m;
    return "";
  }
  let recorder = null, recording = false, recChunks = [], recBlob = null, recStart = 0;
  $("recBtn").addEventListener("click", () => {
    if (!ac) return;
    const mime = pickMime();
    if (mime === null) { $("recHint").textContent = "Este navegador no permite grabar audio."; return; }
    if (!recording) {
      recChunks = []; recorder = new MediaRecorder(recDest.stream, mime ? { mimeType: mime } : undefined);
      recorder.ondataavailable = (e) => { if (e.data.size) recChunks.push(e.data); };
      recorder.onstop = () => { recBlob = new Blob(recChunks, { type: recorder.mimeType || "audio/webm" }); $("recDl").disabled = false; $("recHint").textContent = "Grabación lista para descargar."; $("stRec").textContent = "lista"; };
      recorder.start(); recording = true; recStart = performance.now();
      $("recBtn").setAttribute("aria-pressed", "true"); $("recBtn").textContent = "■ Detener"; $("recBadge").hidden = false; $("stRec").textContent = "grabando";
    } else {
      recorder.stop(); recording = false;
      $("recBtn").setAttribute("aria-pressed", "false"); $("recBtn").textContent = "● Grabar"; $("recBadge").hidden = true;
    }
  });
  $("recDl").addEventListener("click", () => { if (recBlob) deliver(recBlob, "domesticadas-sesion"); });
  let lastMidi = null;
  $("noteDl").addEventListener("click", () => {
    if (!soundOn() || lastMidi == null) return;
    const mime = pickMime(); if (mime === null) { toast("Este navegador no permite grabar audio"); return; }
    const ch = buildChain(ac), dest = ac.createMediaStreamDestination(); ch.out.connect(dest);
    const rec = new MediaRecorder(dest.stream, mime ? { mimeType: mime } : undefined), chunks = [];
    rec.ondataavailable = (e) => { if (e.data.size) chunks.push(e.data); };
    const m = lastMidi;
    rec.onstop = () => deliver(new Blob(chunks, { type: rec.mimeType || "audio/webm" }), "confesion-" + noteName(m));
    rec.start(); $("noteDl").disabled = true; toast("Grabando confesión...");
    const dur = voice(ac, [ch.input, main.input], m, 0.9, 0);
    setTimeout(() => { rec.stop(); updSoundBtn(); }, (dur + 1.4) * 1000);
  });

  // ================= detección y cursor interactivo =================
  const PW = 128, PH = 72;
  const proc = document.createElement("canvas"); proc.width = PW; proc.height = PH;
  const pctx = proc.getContext("2d", { willReadFrequently: true });
  let prev = null; const mask = new Uint8Array(PW * PH);
  let energy = [], presence = [], flash = [], last = [];
  const parts = [], roll = [];
  let curGray = null;

  // Interacción de puntero / cursor (ojo invasor)
  const pointer = { x: -1, y: -1, nx: -1, ny: -1, active: false, down: false, speed: 0, lastX: 0, lastY: 0, lastT: 0 };
  const view = $("view"), vctx = view.getContext("2d");
  let currentGossipVol = 0, lastGhostT = 0;

  function resumeAudioOnGesture() {
    if (!ac) { initAudio(); }
    if (ac && ac.state === "suspended") { ac.resume(); updSoundBtn(); }
  }

  function updatePointerNorm(px, py) {
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const W = view.width, H = view.height;
    const src = activeSource(), ar = srcAspect(src);
    let bw = W, bh = W / ar; if (bh > H) { bh = H; bw = H * ar; }
    const bx = (W - bw) / 2, by = (H - bh) / 2;
    const rx = (px * dpr - bx) / bw;
    const ry = (py * dpr - by) / bh;
    pointer.nx = rx >= 0 && rx <= 1 ? rx : -1;
    pointer.ny = ry >= 0 && ry <= 1 ? ry : -1;
  }

  function dispararPuntual(c, r, now) {
    const k = r * S.cols + c;
    if (now - last[k] < S.cool) return;
    last[k] = now; flash[k] = 1;
    const cx = (c + 0.5) / S.cols;
    const pan = S.mapPan ? cx * 2 - 1 : 0;
    const m = cellMidi(c, r);

    if (S.sndMode === "banco") {
      const sampleIdx = (k % 6) + 1;
      const sampleName = "chisme_" + sampleIdx;
      const pitch = S.pRate * (0.95 + 0.1 * Math.random());
      muestra(sampleName, S.vChisme * 0.75, pan * 0.85, pitch);

      if (r === 0 && Math.random() < 0.5) {
        const pIdx = (c % 2) + 1;
        muestra("piano_" + pIdx, S.vPiano * 0.7, pan * 0.5, 1.0);
      }
      fire(now, m, 0.9, pan * 0.85, null, (c + 1) + "," + (r + 1), energy[k] || 0.2, CHISME_TITLES[sampleIdx - 1]);
    } else {
      fire(now, m, 0.85, pan * 0.85, null, (c + 1) + "," + (r + 1), energy[k] || 0.2);
    }
  }

  view.addEventListener("pointermove", (e) => {
    resumeAudioOnGesture();
    const r = view.getBoundingClientRect();
    const px = e.clientX - r.left, py = e.clientY - r.top;
    const now = performance.now(), dt = Math.max(1, now - pointer.lastT);
    const dist = Math.hypot(px - pointer.lastX, py - pointer.lastY);
    pointer.speed = dist / dt;
    pointer.lastX = px; pointer.lastY = py; pointer.lastT = now;
    pointer.x = px; pointer.y = py; pointer.active = true;
    updatePointerNorm(px, py);
  });

  view.addEventListener("pointerdown", (e) => {
    resumeAudioOnGesture();
    pointer.down = true; pointer.active = true;
    const r = view.getBoundingClientRect();
    const px = e.clientX - r.left, py = e.clientY - r.top;
    updatePointerNorm(px, py);
    const now = performance.now();
    if (pointer.nx >= 0 && pointer.ny >= 0) {
      const col = Math.min(S.cols - 1, Math.max(0, Math.floor(pointer.nx * S.cols)));
      const row = Math.min(S.rows - 1, Math.max(0, Math.floor(pointer.ny * S.rows)));
      dispararPuntual(col, row, now);
    }
  });
  view.addEventListener("pointerup", () => { pointer.down = false; });
  view.addEventListener("pointerleave", () => { pointer.active = false; pointer.down = false; pointer.nx = -1; pointer.ny = -1; });

  function ensureGrid() {
    const n = S.cols * S.rows;
    if (energy.length !== n) {
      energy = new Array(n).fill(0);
      presence = new Array(n).fill(0);
      flash = new Array(n).fill(0);
      last = new Array(n).fill(0);
    }
  }
  function cellMidi(c, r) {
    const sc = SCALES[S.scale];
    return S.root + sc[c % sc.length] + 12 * Math.floor(c / sc.length) + 12 * (S.rows - 1 - r);
  }
  function activeSource() {
    return S.src === "demo" ? demo : (S.src === "cam" || S.src === "file") && video.readyState >= 2 ? video : null;
  }
  function srcAspect(src) {
    if (!src) return 16 / 9;
    if (src === demo) return 16 / 9;
    return (video.videoWidth || 16) / (video.videoHeight || 9);
  }

  function analyse(now) {
    const src = activeSource(); if (!src) { prev = null; curGray = null; return; }
    pctx.save();
    if (S.src === "cam" && S.mirror) { pctx.translate(PW, 0); pctx.scale(-1, 1); }
    pctx.drawImage(src, 0, 0, PW, PH); pctx.restore();
    let d;
    try {
      d = pctx.getImageData(0, 0, PW, PH).data;
    } catch (e) {
      if (window.location.protocol === "file:") {
        $("status").textContent = "Aviso: para oír y ver con doble clic, usa Safari o el enlace de GitHub Pages.";
      }
      return;
    }
    const gray = new Uint8Array(PW * PH);
    for (let i = 0, j = 0; i < gray.length; i++, j += 4) gray[i] = (d[j] * 0.3 + d[j + 1] * 0.59 + d[j + 2] * 0.11) | 0;
    ensureGrid();

    const counts = new Array(S.cols * S.rows).fill(0);
    if (prev) {
      let changed = 0;
      for (let i = 0; i < gray.length; i++) {
        const df = Math.abs(gray[i] - prev[i]);
        mask[i] = df > S.thr ? Math.min(255, df) : 0;
        if (mask[i]) changed++;
      }
      const p = S.parts ? Math.min(0.4, 60 / Math.max(1, changed)) : 0;
      for (let y = 0; y < PH; y++) {
        const r = Math.min(S.rows - 1, Math.floor(y / PH * S.rows));
        for (let x = 0; x < PW; x++) {
          const i = y * PW + x; if (!mask[i]) continue;
          counts[r * S.cols + Math.min(S.cols - 1, Math.floor(x / PW * S.cols))]++;
          if (p && Math.random() < p && parts.length < 350) {
            const k = Math.min(1, (mask[i] - S.thr) / 100);
            parts.push({ x: (x + Math.random()) / PW, y: (y + Math.random()) / PH, vy: -0.012 - Math.random() * 0.02, k, life: 1, decay: 1.4 + Math.random() * 1.4 });
          }
        }
      }
    }
    const hadPrev = !!prev;
    prev = gray; curGray = gray;

    if (S.mode === "linea" || S.mode === "lineas") { if (hadPrev) lineDetect(now); return; }
    if (S.mode === "escaner") return;

    const cellPx = (PW / S.cols) * (PH / S.rows);
    let maxProximity = 0;
    let closestCell = null;
    let totalHot = 0;

    for (let r = 0; r < S.rows; r++) {
      for (let c = 0; c < S.cols; c++) {
        const k = r * S.cols + c;
        const act = counts[k] / cellPx;
        energy[k] = energy[k] * 0.5 + act * 0.5;
        if (energy[k] > S.sens * 0.3) {
          // La presencia de la gallina se acumula y persiste (~2 s) para que no parpadee al pausar el picoteo
          presence[k] = Math.min(1.0, presence[k] + 0.35 + (energy[k] / S.sens) * 0.4);
        } else {
          presence[k] *= 0.94; // decaimiento suave de memoria espacial
        }
        if (energy[k] > S.sens) totalHot++;

        // Cálculo de proximidad REAL entre el cursor y las gallinas activas
        if (pointer.active && pointer.nx >= 0 && pointer.ny >= 0) {
          const cx = (c + 0.5) / S.cols, cy = (r + 0.5) / S.rows;
          const dist = Math.hypot(cx - pointer.nx, cy - pointer.ny);
          const rad = Math.max(0.08, S.cRad);

          if (dist < rad) {
            // Curva espacial de campana: 1.0 en el centro del cursor, 0.0 en el borde del radio
            const distWeight = 0.5 * (1 + Math.cos(Math.PI * (dist / rad)));
            // Nivel de actividad y presencia biológica en la celda
            const chickFactor = Math.min(1.0, presence[k] * 1.3 + (energy[k] / S.sens) * 0.7);

            // La proximidad SOLO sube si el cursor se acerca a gallinas reales
            const p = distWeight * chickFactor;
            if (p > maxProximity) {
              maxProximity = p;
              closestCell = { c, r, k, dist, energy: energy[k] };
            }
          }
        }
      }
    }

    if (pointer.down) {
      maxProximity = Math.max(maxProximity, 0.95);
    }

    // ================= CONTROL DINÁMICO DE VOLUMEN GOSSIPESP =================
    // En reposo (lejos de gallinas): murmullo espectral muy sutil (2-3%)
    // Al acercar el cursor a las gallinas: la conversación sube nítida y rotunda hasta el 100%
    const idleVol = 0.02 * S.vChisme;
    const activeVol = Math.pow(maxProximity, 1.25) * S.vChisme;
    const targetVol = pointer.active && pointer.nx >= 0 ? Math.max(idleVol, activeVol) : idleVol;
    currentGossipVol = currentGossipVol * 0.70 + targetVol * 0.30;

    if (gossipGain && ac) {
      const t = ac.currentTime;
      gossipGain.gain.setTargetAtTime(Math.max(0.0001, targetVol), t, 0.04);
    }
    if (gossipPan && ac && pointer.active && pointer.nx >= 0) {
      const pVal = Math.max(-1, Math.min(1, pointer.nx * 2 - 1));
      gossipPan.pan.setTargetAtTime(pVal, ac.currentTime, 0.04);
    }

    // Sofocación de la naturaleza: cuando la conversación humana se eleva, los grillos y pájaros retroceden
    if (natGain && ac) {
      const natFactor = Math.max(0.08, 1.0 - (targetVol / Math.max(0.01, S.vChisme)) * 0.88);
      const natTarget = S.vNat * natFactor * 0.65;
      natGain.gain.setTargetAtTime(Math.max(0.0001, natTarget), ac.currentTime, 0.06);
    }

    // Actualizar medidor visual de volumen en readout
    const volPct = Math.round((targetVol / Math.max(0.01, S.vChisme)) * 100);
    const fillEl = $("gossipFill"), pctEl = $("gossipVolPct");
    if (fillEl) fillEl.style.width = volPct + "%";
    if (pctEl) pctEl.textContent = volPct + "%";
    $("lastPct").textContent = Math.round(maxProximity * 100) + "%";

    if (closestCell && maxProximity > 0.20) {
      $("lastZone").textContent = (closestCell.c + 1) + "," + (closestCell.r + 1);
      flash[closestCell.k] = Math.max(flash[closestCell.k], maxProximity * 0.85);
      $("lastNote").textContent = "CONVERSACIÓN HUMANA";
      $("lastHz").textContent = "chismes nítidos (" + volPct + "%)";
      $("mapText").textContent = "ojo sobre gallina → voz humana en primer plano";
    } else {
      $("lastZone").textContent = "—";
      $("lastNote").textContent = "SUSURRO LEJANO";
      $("lastHz").textContent = "acerca el cursor";
      $("mapText").textContent = "pasa el cursor sobre las gallinas para subir el volumen";
    }

    // Disparos directos al acariciar/tocar fuertemente una gallina con el cursor
    if (closestCell && maxProximity > 0.80 && now - last[closestCell.k] > S.cool * 2.5) {
      dispararPuntual(closestCell.c, closestCell.r, now);
    } else if (S.mode === "libre" && closestCell && now - last[closestCell.k] > S.cool) {
      dispararPuntual(closestCell.c, closestCell.r, now);
    }

    // Murmullos colectivos fantasmales: ocurren solo con una auténtica conmoción general y cooldown de 12 s
    if (totalHot >= 7 && S.sndMode === "banco" && now - lastGhostT > 12000) {
      lastGhostT = now;
      const fIdx = (Math.random() < 0.5 ? 1 : 2);
      muestra("fantasma_" + fIdx, S.vFantasma * 0.6, (Math.random() * 2 - 1) * 0.5, 0.95);
      asfixiarNaturaleza(0.5);
    }
  }

  function fire(now, m, vel, pan, opt, where, pct, customTitle) {
    if (soundOn() && S.sndMode === "synth") voice(ac, [main.input], m, vel, pan, opt);
    roll.push({ t: now, m, c: opt ? opt.color : "#E5B25D" });
    lastMidi = m; lastFreq = mtof(m); lastNoteT = performance.now(); updScopeCap();
    $("lastNote").textContent = customTitle ? customTitle.toUpperCase() : noteName(m);
    $("lastHz").textContent = customTitle ? "voz humana" : Math.round(mtof(m)) + " Hz";
    $("lastZone").textContent = where;
    $("lastPct").textContent = Math.round(pct * 100) + " %";
    $("noteDl").disabled = !soundOn();
  }

  // ---- modos de línea (Faena) ----
  const MAXL = 4, MAXS = 16;
  const lEnergy = new Array(MAXL * MAXS).fill(0), lFlash = new Array(MAXL * MAXS).fill(0), lLast = new Array(MAXL * MAXS).fill(0), lCx = new Array(MAXL * MAXS).fill(NaN);
  function segMidi(i) { const sc = SCALES[S.scale]; return S.root + sc[i % sc.length] + 12 * Math.floor(i / sc.length); }
  function lineXs() { if (S.mode === "linea") return [S.lx]; const a = []; for (let i = 0; i < S.nl; i++) a.push((i + 1) / (S.nl + 1)); return a; }
  function lineDetect(now) {
    const xs = lineXs(), segH = PH / S.segs;
    xs.forEach((lx, li) => {
      const px = Math.min(PW - 2, Math.max(1, Math.round(lx * PW))), v = S.mode === "lineas" ? VOICES[li] : null;
      for (let s = 0; s < S.segs; s++) {
        const y0 = Math.floor(s * segH), y1 = Math.max(y0 + 1, Math.floor((s + 1) * segH)), k = li * MAXS + s;
        let n = 0, sx = 0, sn = 0;
        for (let y = y0; y < y1; y++) {
          for (let x = px - 1; x <= px + 1; x++) if (mask[y * PW + x]) n++;
          for (let x = Math.max(0, px - 10); x <= Math.min(PW - 1, px + 10); x++) if (mask[y * PW + x]) { sx += x; sn++; }
        }
        const cx = sn ? sx / sn : NaN, dx = cx - lCx[k]; lCx[k] = cx;
        lEnergy[k] = lEnergy[k] * 0.4 + (n / (3 * (y1 - y0))) * 0.6;
        if (lEnergy[k] > S.sens && now - lLast[k] > S.cool) {
          lLast[k] = now; lFlash[k] = 1;
          const left = S.mapDir && dx < -0.4;
          const m = segMidi(S.segs - 1 - s) + (v ? v.oct : 0) - (left ? 12 : 0);
          const vel = S.mapVel ? Math.min(1, 0.35 + lEnergy[k] * 1.2) : 0.8, pan = S.mapPan ? lx * 2 - 1 : 0;
          if (S.sndMode === "banco") {
            const chName = "chisme_" + ((s % 6) + 1);
            muestra(chName, vel * S.vChisme, pan, S.pRate);
          }
          fire(now, m, vel, pan * 0.85, v, "faena tramo " + (s + 1) + (left ? " ←" : ""), lEnergy[k]);
        }
      }
    });
  }

  // ---- escáner panóptico ----
  let scanT0 = performance.now(), scanPos = 0, lastStep = -1;
  const hits = [];
  function scanTick(now) {
    scanPos = (((now - scanT0) / 1000) / S.sdur) % 1;
    const st = Math.floor(scanPos * S.steps);
    if (st === lastStep) return; lastStep = st;
    if (!curGray) return;
    const x0 = Math.floor(st / S.steps * PW), x1 = Math.max(x0 + 1, Math.floor((st + 1) / S.steps * PW)), segH = PH / S.segs, cands = [];
    for (let s = 0; s < S.segs; s++) {
      const y0 = Math.floor(s * segH), y1 = Math.max(y0 + 1, Math.floor((s + 1) * segH));
      let sum = 0; for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) sum += curGray[y * PW + x];
      const avg = sum / ((y1 - y0) * (x1 - x0)), val = S.invert ? 255 - avg : avg;
      if (val > S.bright) cands.push({ s, val });
    }
    cands.sort((a, b) => b.val - a.val).slice(0, 4).forEach(({ s, val }) => {
      const m = segMidi(S.segs - 1 - s), k = (val - S.bright) / Math.max(1, 255 - S.bright);
      const vel = S.mapVel ? Math.min(1, 0.3 + k * 0.7) : 0.8, cx = (x0 + x1) / 2 / PW, pan = S.mapPan ? cx * 2 - 1 : 0;
      if (S.sndMode === "banco") {
        const chName = "chisme_" + ((s % 6) + 1);
        muestra(chName, vel * S.vChisme * 0.7, pan, S.pRate);
      }
      fire(now, m, vel, pan * 0.85, null, "panóptico " + (st + 1) + " · " + (s + 1), val / 255);
      hits.push({ x: cx, w: (x1 - x0) / PW, s, life: 1, m });
    });
  }

  // ================= dibujo del escenario =================
  const maskC = document.createElement("canvas"); maskC.width = PW; maskC.height = PH;
  const mctx = maskC.getContext("2d"), mimg = mctx.createImageData(PW, PH);

  function fit(c) {
    const r = c.getBoundingClientRect(), dpr = Math.min(2, window.devicePixelRatio || 1);
    const w = Math.max(1, Math.round(r.width * dpr)), h = Math.max(1, Math.round(r.height * dpr));
    if (c.width !== w || c.height !== h) { c.width = w; c.height = h; }
    return dpr;
  }

  function drawView(dt) {
    const dpr = fit(view), W = view.width, H = view.height;
    vctx.fillStyle = "#0B0A09"; vctx.fillRect(0, 0, W, H);
    const src = activeSource(), ar = srcAspect(src);
    let bw = W, bh = W / ar; if (bh > H) { bh = H; bw = H * ar; }
    const bx = (W - bw) / 2, by = (H - bh) / 2;

    if (pointer.active) {
      const rx = (pointer.x * dpr - bx) / bw;
      const ry = (pointer.y * dpr - by) / bh;
      pointer.nx = rx >= 0 && rx <= 1 ? rx : -1;
      pointer.ny = ry >= 0 && ry <= 1 ? ry : -1;
    } else {
      pointer.nx = -1; pointer.ny = -1;
    }

    if (S.view === "mask") {
      for (let i = 0; i < PW * PH; i++) {
        const j = i * 4, m = mask[i];
        if (m) {
          const k = Math.min(1, (m - S.thr) / 100);
          mimg.data[j] = 214; mimg.data[j + 1] = 61 + (178 - 61) * k; mimg.data[j + 2] = 61;
        } else {
          mimg.data[j] = 11; mimg.data[j + 1] = 10; mimg.data[j + 2] = 9;
        }
        mimg.data[j + 3] = 255;
      }
      mctx.putImageData(mimg, 0, 0);
      vctx.imageSmoothingEnabled = false; vctx.drawImage(maskC, bx, by, bw, bh); vctx.imageSmoothingEnabled = true;
    } else if (src) {
      vctx.save();
      if (S.src === "cam" && S.mirror) { vctx.translate(bx * 2 + bw, 0); vctx.scale(-1, 1); }
      vctx.drawImage(src, bx, by, bw, bh); vctx.restore();
      if (S.veil > 0) { vctx.fillStyle = "rgba(11,10,9," + S.veil.toFixed(2) + ")"; vctx.fillRect(bx, by, bw, bh); }
    } else {
      vctx.fillStyle = "rgba(244,241,234,.6)"; vctx.font = Math.round(11 * dpr) + "px 'IBM Plex Mono', monospace"; vctx.textAlign = "center";
      vctx.fillText(S.src === "camoff" ? "CÁMARA APAGADA" : "CARGANDO CORRAL...", W / 2, H / 2); vctx.textAlign = "start";
    }

    if (S.parts && S.view !== "mask") drawParts(bx, by, bw, bh, dpr, dt);

    // Resplandor ámbar cálido en celdas de gallinas activas
    if (S.mode === "zonas" || S.mode === "libre") {
      const cw = bw / S.cols, ch = bh / S.rows;
      for (let r = 0; r < S.rows; r++) {
        for (let c = 0; c < S.cols; c++) {
          const k = r * S.cols + c;
          if (flash[k] > 0) {
            flash[k] = Math.max(0, flash[k] - dt * 1.8);
            vctx.fillStyle = "rgba(229,178,93," + (flash[k] * S.tint * 1.8).toFixed(3) + ")";
            vctx.fillRect(bx + c * cw, by + r * ch, cw, ch);
          }
        }
      }
    }

    if (S.lines) drawGrid(bx, by, bw, bh, dpr);

    // Halo concéntrico interactivo del cursor
    if (S.cursorHalo && pointer.active && pointer.nx >= 0) {
      drawCursorHalo(bx, by, bw, bh, dpr);
    }
  }

  function drawCursorHalo(bx, by, bw, bh, dpr) {
    const cx = bx + pointer.nx * bw, cy = by + pointer.ny * bh;
    const rad = S.cRad * bw;
    vctx.save();

    // Halo exterior que pulsa con el volumen actual de voz humana
    const intensity = Math.min(1.0, currentGossipVol * 1.2);
    vctx.beginPath();
    vctx.arc(cx, cy, rad, 0, Math.PI * 2);
    vctx.strokeStyle = intensity > 0.4 ? rgba("#D63D3D", 0.7 + intensity * 0.25) : rgba("#E5B25D", 0.5 + intensity * 0.4);
    vctx.lineWidth = (1.5 + intensity * 2.0) * dpr;
    vctx.setLineDash([4 * dpr, 4 * dpr]);
    vctx.stroke();

    // Resplandor interior cuando hay volumen alto
    if (intensity > 0.1) {
      vctx.beginPath();
      vctx.arc(cx, cy, rad * 0.7, 0, Math.PI * 2);
      vctx.fillStyle = rgba("#E5B25D", intensity * 0.15);
      vctx.fill();
    }

    // Punto central
    vctx.beginPath();
    vctx.arc(cx, cy, (3 + intensity * 2) * dpr, 0, Math.PI * 2);
    vctx.fillStyle = intensity > 0.5 ? "#D63D3D" : "#E5B25D";
    vctx.fill();

    // Cruz de enfoque
    vctx.beginPath();
    vctx.moveTo(cx - rad * 1.25, cy); vctx.lineTo(cx - rad * 0.8, cy);
    vctx.moveTo(cx + rad * 0.8, cy); vctx.lineTo(cx + rad * 1.25, cy);
    vctx.moveTo(cx, cy - rad * 1.25); vctx.lineTo(cx, cy - rad * 0.8);
    vctx.moveTo(cx, cy + rad * 0.8); vctx.lineTo(cx, cy + rad * 1.25);
    vctx.strokeStyle = rgba("#E5B25D", 0.4 + intensity * 0.5);
    vctx.setLineDash([]);
    vctx.lineWidth = 1 * dpr;
    vctx.stroke();
    vctx.restore();
  }

  function drawGrid(bx, by, bw, bh, dpr) {
    const cw = bw / S.cols, ch = bh / S.rows;
    vctx.strokeStyle = "rgba(244,241,234,.14)";
    vctx.lineWidth = 1;
    vctx.beginPath();
    for (let c = 1; c < S.cols; c++) { const x = Math.round(bx + c * cw); vctx.moveTo(x, by); vctx.lineTo(x, by + bh); }
    for (let r = 1; r < S.rows; r++) { const y = Math.round(by + r * ch); vctx.moveTo(bx, y); vctx.lineTo(bx + bw, y); }
    vctx.stroke();

    for (let r = 0; r < S.rows; r++) {
      for (let c = 0; c < S.cols; c++) {
        const k = r * S.cols + c;
        if (flash[k] > 0.05) {
          vctx.strokeStyle = "rgba(229,178,93," + flash[k].toFixed(2) + ")";
          vctx.lineWidth = 1.5 * dpr;
          vctx.strokeRect(bx + c * cw + 1, by + r * ch + 1, cw - 2, ch - 2);
        }
        if (S.notes && cw > 35 * dpr && ch > 24 * dpr) {
          vctx.fillStyle = "rgba(244,241,234,.3)";
          vctx.font = Math.round(8 * dpr) + "px 'IBM Plex Mono', monospace";
          vctx.fillText((c + 1) + "," + (r + 1), bx + c * cw + 4 * dpr, by + r * ch + 12 * dpr);
        }
      }
    }
  }

  function drawParts(bx, by, bw, bh, dpr, dt) {
    for (let i = parts.length - 1; i >= 0; i--) {
      const p = parts[i];
      p.life -= dt * p.decay;
      p.y += p.vy * dt;
      if (p.life <= 0) { parts.splice(i, 1); continue; }
      vctx.fillStyle = p.k > 0.5 ? "rgba(214,61,61," + (p.life * 0.8).toFixed(2) + ")" : "rgba(229,178,93," + (p.life * 0.7).toFixed(2) + ")";
      vctx.fillRect(bx + p.x * bw, by + p.y * bh, 2.5 * dpr, 2.5 * dpr);
    }
  }

  // ================= dibujo de señal =================
  const scopeC = $("scope"), sctx = scopeC.getContext("2d");
  const envC = $("env"), ectx = envC.getContext("2d");
  const rollC = $("roll"), rctx = rollC.getContext("2d");
  let lastNoteT = 0, lastFreq = 131;

  function updScopeCap() {
    $("scopeCap").textContent = S.sndMode === "banco" ? "voz humana (gossipesp)" : "onda · " + S.wave;
  }
  function updEnvCap() {
    $("envCapL").textContent = S.sndMode === "banco" ? "presencia vocal" : "envolvente · A/R";
  }

  function drawScope() {
    fit(scopeC); const W = scopeC.width, H = scopeC.height;
    sctx.fillStyle = "#0B0A09"; sctx.fillRect(0, 0, W, H);
    if (!analyser || !soundOn()) {
      sctx.strokeStyle = "rgba(244,241,234,.15)"; sctx.beginPath();
      sctx.moveTo(0, H / 2); sctx.lineTo(W, H / 2); sctx.stroke();
      return;
    }
    const buf = new Uint8Array(analyser.fftSize);
    analyser.getByteTimeDomainData(buf);
    sctx.strokeStyle = currentGossipVol > 0.3 ? "#D63D3D" : "#E5B25D";
    sctx.lineWidth = 1.5;
    sctx.beginPath();
    const slice = W / buf.length;
    for (let i = 0; i < buf.length; i++) {
      const v = buf[i] / 128.0;
      const y = (v * H) / 2;
      if (i === 0) sctx.moveTo(0, y); else sctx.lineTo(i * slice, y);
    }
    sctx.stroke();
  }

  function drawEnv() {
    fit(envC); const W = envC.width, H = envC.height;
    ectx.fillStyle = "#0B0A09"; ectx.fillRect(0, 0, W, H);
    ectx.strokeStyle = "rgba(229,178,93,.6)"; ectx.lineWidth = 1.5;
    ectx.beginPath();
    ectx.moveTo(10, H - 6);
    ectx.lineTo(25, 8);
    ectx.lineTo(50, 18);
    ectx.lineTo(W - 20, H - 6);
    ectx.stroke();
    ectx.fillStyle = "rgba(229,178,93,.12)";
    ectx.lineTo(10, H - 6); ectx.fill();
  }

  function drawRoll(now) {
    fit(rollC); const W = rollC.width, H = rollC.height;
    rctx.fillStyle = "#0B0A09"; rctx.fillRect(0, 0, W, H);
    const windowSec = 10;
    while (roll.length && now - roll[0].t > windowSec * 1000) roll.shift();
    roll.forEach((n) => {
      const age = (now - n.t) / 1000;
      const x = W - (age / windowSec) * W;
      const y = H - ((n.m - 36) / 48) * H;
      rctx.fillStyle = n.c || "#E5B25D";
      rctx.fillRect(x - 2, Math.max(2, y), 6, 4);
    });
  }

  // ================= controles y sliders =================
  const RANGES = {
    cRad: { key: "cRad", fmt: (v) => v + " %", conv: (v) => v / 100 },
    cols: { key: "cols", fmt: (v) => v },
    rows: { key: "rows", fmt: (v) => v },
    thr: { key: "thr", fmt: (v) => v },
    sens: { key: "sens", fmt: (v) => v + " %", conv: (v) => v / 100 },
    cool: { key: "cool", fmt: (v) => v + " ms" },
    pRate: { key: "pRate", fmt: (v) => (v / 100).toFixed(2) + "x", conv: (v) => v / 100 },
    vChisme: { key: "vChisme", fmt: (v) => v + " %", conv: (v) => v / 100 },
    vFantasma: { key: "vFantasma", fmt: (v) => v + " %", conv: (v) => v / 100 },
    vPiano: { key: "vPiano", fmt: (v) => v + " %", conv: (v) => v / 100 },
    vNat: { key: "vNat", fmt: (v) => v + " %", conv: (v) => v / 100 },
    cut: { key: "cut", fmt: (v) => (v >= 1000 ? (v / 1000).toFixed(1) + "k" : v) },
    rev: { key: "rev", fmt: (v) => v + " %", conv: (v) => v / 100 },
    vol: { key: "vol", fmt: (v) => v + " %", conv: (v) => v / 100 },
    tint: { key: "tint", fmt: (v) => v + " %", conv: (v) => v / 100 },
    veil: { key: "veil", fmt: (v) => v + " %", conv: (v) => v / 100 },
    lx: { key: "lx", fmt: (v) => v + " %", conv: (v) => v / 100 },
    segs: { key: "segs", fmt: (v) => v },
    sdur: { key: "sdur", fmt: (v) => v + " s" },
    steps: { key: "steps", fmt: (v) => v },
    bright: { key: "bright", fmt: (v) => v },
  };

  Object.entries(RANGES).forEach(([id, cfg]) => {
    const el = $(id), out = $(id + "Out");
    if (!el || !out) return;
    const upd = () => {
      const v = Number(el.value);
      S[cfg.key] = cfg.conv ? cfg.conv(v) : v;
      out.textContent = cfg.fmt(v);
      onChange(cfg.key);
    };
    el.addEventListener("input", upd); upd();
    const badge = document.createElement("i"); badge.className = "cc"; badge.hidden = true; badge.dataset.for = id;
    const lab = el.closest(".row") ? el.closest(".row").querySelector("label") : null;
    if (lab) lab.appendChild(badge);
  });

  function onChange(key) {
    if (key === "cols" || key === "rows") { ensureGrid(); $("stKeys").textContent = S.cols + " × " + S.rows; }
    if (key === "sens") $("stDet").textContent = Math.round(S.sens * 100) + " %";
    if (key === "pRate" && gossipTrackSource) {
      gossipTrackSource.playbackRate.value = S.pRate;
    }
    if (!ac) return;
    if (key === "vol") master.gain.setTargetAtTime(S.vol, ac.currentTime, 0.05);
    if (key === "cut") main.filter.frequency.setTargetAtTime(S.cut, ac.currentTime, 0.05);
    if (key === "rev") setRev(main);
  }

  $("sndModeBanco").addEventListener("click", () => {
    S.sndMode = "banco";
    $("sndModeBanco").setAttribute("aria-pressed", "true");
    $("sndModeSynth").setAttribute("aria-pressed", "false");
    $("stSnd").textContent = "voces";
    updScopeCap();
    toast("Modo Voces Humanas (gossipesp)");
  });
  $("sndModeSynth").addEventListener("click", () => {
    S.sndMode = "synth";
    $("sndModeBanco").setAttribute("aria-pressed", "false");
    $("sndModeSynth").setAttribute("aria-pressed", "true");
    $("stSnd").textContent = "sintetiz.";
    updScopeCap();
    if (soundOn()) voice(ac, [main.input], S.root + 12, 0.8, 0);
  });

  $("scale").addEventListener("change", (e) => { S.scale = e.target.value; });
  $("root").addEventListener("change", (e) => { S.root = Number(e.target.value); });
  $("cursorHalo").addEventListener("change", (e) => { S.cursorHalo = e.target.checked; });

  document.querySelectorAll("[data-view]").forEach((b) => b.addEventListener("click", () => {
    S.view = b.dataset.view;
    document.querySelectorAll("[data-view]").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    updVisState();
  }));

  const MODE_INFO = {
    zonas: { name: "corral", lbl: " · celda ", hint: "Modo Corral: al acercar el cursor a las gallinas, el volumen de la conversación humana se eleva nítidamente." },
    libre: { name: "libre", lbl: " · celda ", hint: "Modo Libre: el movimiento autónomo de las gallinas activa las voces sin requerir el cursor." },
    linea: { name: "faena", lbl: " · tramo ", hint: "Modo Faena: una línea quieta detecta cuando las aves la cruzan, disparando voces." },
    escaner: { name: "panóptico", lbl: " · paso ", hint: "Modo Panóptico: un escáner recorre el corral y lee la luz como una partitura." }
  };

  function setMode(m) {
    S.mode = m; prev = null; hits.length = 0; flash.fill(0);
    scanT0 = performance.now(); lastStep = -1;
    document.querySelectorAll("[data-mode]").forEach((x) => x.setAttribute("aria-pressed", String(x.dataset.mode === m)));
    document.querySelectorAll("#pMode [data-show]").forEach((el) => {
      const modes = el.dataset.show.split(" ");
      el.hidden = !modes.includes(m);
    });
    const info = MODE_INFO[m] || MODE_INFO.zonas;
    $("modeHint").textContent = info.hint;
    $("stMode").textContent = info.name;
    $("lblZone").textContent = info.lbl;
    $("lastZone").textContent = "—";
    $("mapText").textContent = m === "zonas" ? "cursor sobre gallinas → sube el volumen de gossipesp.wav" : "movimiento de gallina → voz humana";
  }
  document.querySelectorAll("[data-mode]").forEach((b) => b.addEventListener("click", () => setMode(b.dataset.mode)));

  $("mapVel").addEventListener("change", (e) => { S.mapVel = e.target.checked; });
  $("mapPan").addEventListener("change", (e) => { S.mapPan = e.target.checked; });
  $("mirror").addEventListener("change", (e) => { S.mirror = e.target.checked; prev = null; });

  setMode("zonas"); updVisState(); updEnvCap();

  // pantalla completa
  $("fsBtn").addEventListener("click", async () => {
    const st = $("stage");
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else if (st.requestFullscreen) await st.requestFullscreen();
      else if (st.webkitRequestFullscreen) st.webkitRequestFullscreen();
      else throw new Error("no");
    } catch (_) { toast("Pantalla completa no disponible en esta vista"); }
  });
  document.addEventListener("fullscreenchange", () => { $("fsBtn").textContent = document.fullscreenElement ? "⛶ Salir" : "⛶ Pantalla completa"; });

  // ================= MIDI =================
  const STORE = "domesticadas.midi.v1";
  let midiMap = {};
  try { midiMap = JSON.parse(localStorage.getItem(STORE) || "{}") || {}; } catch (_) { midiMap = {}; }
  let learning = false, learnTarget = null;
  function saveMap() { try { localStorage.setItem(STORE, JSON.stringify(midiMap)); } catch (_) {} }
  function paintBadges() {
    document.querySelectorAll(".cc").forEach((b) => { b.hidden = true; b.textContent = ""; });
    Object.entries(midiMap).forEach(([cc, id]) => { const b = document.querySelector('.cc[data-for="' + id + '"]'); if (b) { b.hidden = false; b.textContent = "CC" + cc; } });
  }
  paintBadges();

  function onMidi(e) {
    const [st, d1, d2] = e.data;
    if ((st & 0xf0) !== 0xb0) return;
    if (learning && learnTarget) {
      Object.keys(midiMap).forEach((k) => { if (midiMap[k] === learnTarget.id) delete midiMap[k]; });
      midiMap[d1] = learnTarget.id; saveMap(); paintBadges();
      $("midiHint").textContent = "CC " + d1 + " → " + learnTarget.id + ". Toca otro slider o termina con Asignar.";
      learnTarget.classList.remove("target"); learnTarget = null; return;
    }
    const id = midiMap[d1]; if (!id) return;
    const el = $(id), min = Number(el.min), max = Number(el.max), step = Number(el.step) || 1;
    el.value = String(Math.round((min + (d2 / 127) * (max - min)) / step) * step);
    el.dispatchEvent(new Event("input"));
  }

  $("midiBtn").addEventListener("click", async () => {
    if (!navigator.requestMIDIAccess) { $("midiHint").textContent = "Web MIDI no disponible en este navegador. Usa Chrome o Edge."; return; }
    try {
      const access = await navigator.requestMIDIAccess();
      const bind = () => { let n = 0; access.inputs.forEach((i) => { i.onmidimessage = onMidi; n++; }); $("stMidi").textContent = n ? n + " conectado" + (n > 1 ? "s" : "") : "sin equipos"; $("midiHint").textContent = n ? "Presiona Asignar." : "No hay controladores conectados."; };
      access.onstatechange = bind; bind();
      $("midiBtn").setAttribute("aria-pressed", "true"); $("learnBtn").disabled = false; $("midiClear").disabled = false;
    } catch (e) { $("midiHint").textContent = "MIDI no disponible en esta vista."; }
  });
  $("learnBtn").addEventListener("click", () => {
    learning = !learning; $("learnBtn").setAttribute("aria-pressed", String(learning));
    $("dock").classList.toggle("learning", learning);
    if (learnTarget) { learnTarget.classList.remove("target"); learnTarget = null; }
    $("midiHint").textContent = learning ? "Toca un slider y mueve una perilla." : "Asignaciones guardadas.";
  });
  document.querySelectorAll("input[type=range]").forEach((el) => el.addEventListener("pointerdown", () => {
    if (!learning) return;
    if (learnTarget) learnTarget.classList.remove("target");
    learnTarget = el; el.classList.add("target");
    $("midiHint").textContent = "Mueve una perilla para asignarla a " + el.id + ".";
  }));
  $("midiClear").addEventListener("click", () => { midiMap = {}; saveMap(); paintBadges(); $("midiHint").textContent = "Asignaciones borradas."; });

  // ================= bucle principal =================
  let lastLoopT = performance.now(), acc = 0;
  function loop(now) {
    const dt = Math.min(0.05, (now - lastLoopT) / 1000); lastLoopT = now;
    if (S.src === "demo") drawDemo(dt);
    acc += dt;
    if (acc >= 1 / 15) { acc = 0; analyse(now); }
    if (S.mode === "escaner") scanTick(now);
    drawView(dt); drawScope(); drawEnv(); drawRoll(now);
    if (recording) {
      const s = Math.floor((now - recStart) / 1000), t = Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0");
      $("recTime").textContent = t; $("recBadgeT").textContent = t;
    }
    requestAnimationFrame(loop);
  }

  updSoundBtn();
  setSrc("file", "La ilusión de la libertad · Corral de gallinas");
  requestAnimationFrame(loop);
})();
