/* Club Hípico Los Caireles — concept by Noir Digital. Vanilla JS, no build step. */
(function () {
  "use strict";
  var WA = "34661776625";
  var MAIL = "clubhipicoloscaireles@gmail.com";
  var RM = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var clamp = function (v, a, b) { return v < a ? a : v > b ? b : v; };
  var lang = "es";
  try { lang = localStorage.getItem("lc-lang") === "en" ? "en" : "es"; } catch (e) {}

  /* ---------- Strings used by scripts ---------- */
  var T = {
    es: {
      dur: { "45": "45 minutos", medio: "medio día", dia: "día completo" },
      durTag: { "45": "45 min", medio: "Medio día", dia: "Día completo" },
      terr: { campo: "por caminos de campo", monte: "por la montaña", playa: "hasta la playa" },
      terrChip: { campo: "Caminos rurales", monte: "Montaña", playa: "Playa" },
      terrDesc: { campo: "Caminos rurales alrededor de Campanillas.", monte: "Rutas por la montaña.", playa: "Ruta con destino a la playa." },
      rideTitle: function (d, t) { return "Paseo de " + d + " " + t; },
      rideLvl: { cero: "Nunca has montado: irás con un monitor en todo momento y un caballo adecuado a tu nivel.", algo: "Ya has montado alguna vez: el club te asigna un caballo adecuado a tu nivel.", suelto: "Montas con soltura: cuéntale al club tu experiencia y te propondrá la ruta que mejor encaje." },
      rideNote: "No apto para niños pequeños, por seguridad. Rutas y disponibilidad: [por confirmar con el club].",
      monitor: "Con monitor", everyLevel: "Caballos para cada nivel",
      trialTitle: "Clase de prueba en pista", trialTag: "Clase de prueba",
      trialLvl: { cero: "Tu primer contacto con el caballo, en pista y con un caballo adecuado a tu nivel. Desde los 5 años.", algo: "Para retomar o mejorar: el club valora tu nivel y te propone el grupo que encaja contigo.", suelto: "Doma clásica o salto y, si te lo planteas, preparación para competición." },
      trialChips: ["Desde 5 años", "Doma clásica o salto", "Duración [por confirmar]"],
      trialNote: "Clases de martes por la mañana a domingo por la tarde.",
      what: { prueba: "una clase de prueba", "45": "un paseo de 45 minutos", medio: "un paseo de medio día", dia: "un paseo de día completo" },
      terrMsg: { campo: "caminos de campo", monte: "montaña", playa: "playa" },
      slot: { manana: "mañana", tarde: "tarde" },
      level: { cero: "nunca he montado", algo: "algo de experiencia", suelto: "monto con soltura" },
      hello: "Hola, Club Hípico Los Caireles. Me gustaría reservar ",
      lDate: "Fecha preferida", lRiders: "Jinetes", lLevel: "Nivel", lName: "Nombre", lNotes: "Comentarios", lLand: "Paisaje",
      sent: "(Mensaje preparado desde la web)",
      errName: "Escribe tu nombre para que el club sepa a quién responder.",
      errDate: "Elige una fecha a partir de hoy.",
      warnMon: "Los lunes no hay clases: el club te propondrá otro día.",
      subj: "Reserva desde la web",
      days: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"],
      daysS: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
      morning: "Mañana", afternoon: "Tarde", closed: "Sin clases", hour: "[hora]",
      cls: { kidsInit: "Infantil · iniciación", kidsDoma: "Infantil · doma", adultsDoma: "Adultos · doma", adultsInit: "Adultos · iniciación", jump: "Salto", comp: "Competición" },
      livName: { box: "Box", boxpad: "Box con paddock", paddock: "Paddock", deluxe: "Paddock deluxe" },
      livMsg: "Hola, Club Hípico Los Caireles. Quería información sobre el pupilaje en modalidad ",
      lHorse: "Caballo", lWhen: "Llegada a partir de",
      leaseMsg: "Hola, Club Hípico Los Caireles. Quería información sobre la media pensión de un caballo pupilado.",
      kit: function (a, b) { return a + " de " + b + " listos"; },
      kidMsg: "Hola, Club Hípico Los Caireles. Me gustaría reservar una clase de prueba para mi hijo/a.",
      lChild: "Nombre del niño/a", lAge: "Edad", lParent: "Madre/padre", errAge: "Las clases son desde los 5 años.",
      tkTitle: function (w) { return w.charAt(0).toUpperCase() + w.slice(1); }, tkDate: "Fecha", tkRiders: "Jinetes", tkName: "A nombre de"
    },
    en: {
      dur: { "45": "45-minute", medio: "half-day", dia: "full-day" },
      durTag: { "45": "45 min", medio: "Half day", dia: "Full day" },
      terr: { campo: "along country tracks", monte: "in the mountains", playa: "to the beach" },
      terrChip: { campo: "Country tracks", monte: "Mountains", playa: "Beach" },
      terrDesc: { campo: "Rural tracks around Campanillas.", monte: "Mountain routes.", playa: "A route that ends at the beach." },
      rideTitle: function (d, t) { return d.charAt(0).toUpperCase() + d.slice(1) + " ride " + t; },
      rideLvl: { cero: "Never ridden: a monitor stays with you the whole way, on a horse suited to your level.", algo: "You've ridden before: the club gives you a horse suited to your level.", suelto: "Confident rider: tell the club about your experience and they'll suggest the route that suits you best." },
      rideNote: "Not suitable for small children, for safety. Routes and availability: [to be confirmed by the club].",
      monitor: "With a monitor", everyLevel: "Horses for every level",
      trialTitle: "Trial lesson in the arena", trialTag: "Trial lesson",
      trialLvl: { cero: "Your first time with a horse, in the arena, on a horse suited to your level. From age 5.", algo: "To get back in the saddle or improve: the club assesses your level and suggests the right group.", suelto: "Dressage or show jumping and, if you're keen, preparation for competition." },
      trialChips: ["From age 5", "Dressage or jumping", "Length [to be confirmed]"],
      trialNote: "Lessons from Tuesday morning to Sunday afternoon.",
      what: { prueba: "a trial lesson", "45": "a 45-minute ride", medio: "a half-day ride", dia: "a full-day ride" },
      terrMsg: { campo: "country tracks", monte: "mountains", playa: "beach" },
      slot: { manana: "morning", tarde: "afternoon" },
      level: { cero: "never ridden", algo: "some experience", suelto: "confident" },
      hello: "Hello, Club Hípico Los Caireles. I'd like to book ",
      lDate: "Preferred date", lRiders: "Riders", lLevel: "Level", lName: "Name", lNotes: "Notes", lLand: "Landscape",
      sent: "(Message prepared on the website)",
      errName: "Please add your name so the club knows who to reply to.",
      errDate: "Please choose a date from today onwards.",
      warnMon: "There are no lessons on Mondays: the club will suggest another day.",
      subj: "Booking from the website",
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      daysS: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      morning: "Morning", afternoon: "Afternoon", closed: "No lessons", hour: "[time]",
      cls: { kidsInit: "Children · beginners", kidsDoma: "Children · dressage", adultsDoma: "Adults · dressage", adultsInit: "Adults · beginners", jump: "Show jumping", comp: "Competition" },
      livName: { box: "Stable", boxpad: "Stable + paddock", paddock: "Paddock", deluxe: "Deluxe paddock" },
      livMsg: "Hello, Club Hípico Los Caireles. I'd like information about livery, option: ",
      lHorse: "Horse", lWhen: "Arriving from",
      leaseMsg: "Hello, Club Hípico Los Caireles. I'd like information about half-leasing one of the club's livery horses.",
      kit: function (a, b) { return a + " of " + b + " ready"; },
      kidMsg: "Hello, Club Hípico Los Caireles. I'd like to book a trial lesson for my child.",
      lChild: "Child's name", lAge: "Age", lParent: "Parent", errAge: "Lessons start from age 5.",
      tkTitle: function (w) { return w.charAt(0).toUpperCase() + w.slice(1); }, tkDate: "Date", tkRiders: "Riders", tkName: "Name"
    }
  };
  var t = function () { return T[lang]; };
  var waUrl = function (text) { return "https://wa.me/" + WA + "?text=" + encodeURIComponent(text); };
  var openWA = function (text) { window.open(waUrl(text), "_blank", "noopener"); };
  var fmtDate = function (v) { if (!v) return ""; var p = v.split("-"); return p.length === 3 ? p[2] + "/" + p[1] + "/" + p[0] : v; };
  var fmtMonth = function (v) { if (!v) return ""; var p = v.split("-"); return p.length === 2 ? p[1] + "/" + p[0] : v; };

  /* ---------- Language ---------- */
  var langHooks = [];
  function applyLang(l) {
    lang = l;
    document.documentElement.lang = l;
    $$("[data-en]").forEach(function (el) {
      if (el._es === undefined) el._es = el.innerHTML;
      el.innerHTML = l === "en" ? el.getAttribute("data-en") : el._es;
    });
    [["data-en-aria-label", "aria-label"], ["data-en-alt", "alt"], ["data-en-placeholder", "placeholder"]].forEach(function (pair) {
      $$("[" + pair[0] + "]").forEach(function (el) {
        var k = "_es_" + pair[1];
        if (el[k] === undefined) el[k] = el.getAttribute(pair[1]) || "";
        el.setAttribute(pair[1], l === "en" ? el.getAttribute(pair[0]) : el[k]);
      });
    });
    $$(".lang-btn").forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.lang === l)); });
    try { localStorage.setItem("lc-lang", l); } catch (e) {}
    langHooks.forEach(function (f) { f(); });
  }
  $$(".lang-btn").forEach(function (b) { b.addEventListener("click", function () { if (b.dataset.lang !== lang) applyLang(b.dataset.lang); }); });

  /* ---------- Header + menu ---------- */
  var header = $(".site-header");
  var menuBtn = $(".menu-btn");
  if (menuBtn) {
    menuBtn.addEventListener("click", function () {
      var open = menuBtn.getAttribute("aria-expanded") !== "true";
      menuBtn.setAttribute("aria-expanded", String(open));
      header.classList.toggle("is-open", open);
    });
    $$(".nav a").forEach(function (a) { a.addEventListener("click", function () { menuBtn.setAttribute("aria-expanded", "false"); header.classList.remove("is-open"); }); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && header.classList.contains("is-open")) { menuBtn.setAttribute("aria-expanded", "false"); header.classList.remove("is-open"); menuBtn.focus(); } });
  }

  /* ---------- One scroll loop for visible effects only ---------- */
  var active = new Set(), ticking = false, vh = window.innerHeight;
  function frame() { ticking = false; active.forEach(function (f) { f(); }); }
  function request() { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }
  function solid() { header && header.classList.toggle("is-solid", window.scrollY > 40); }
  var thread = $("#thread"), docH = 0;
  function measureDoc() { docH = Math.max(1, document.documentElement.scrollHeight - window.innerHeight); }
  if (thread) {
    /* measured lazily on first scroll, so no layout is forced at load */
    window.addEventListener("resize", measureDoc);
    active.add(function () { measureDoc(); thread.style.transform = "scaleX(" + clamp(window.scrollY / docH, 0, 1).toFixed(4) + ")"; });
  }
  window.addEventListener("scroll", function () { solid(); if (active.size) request(); }, { passive: true });
  window.addEventListener("resize", function () { vh = window.innerHeight; request(); });
  if (window.scrollY > 0) solid();
  function whileVisible(el, fn) {
    if (!el || !("IntersectionObserver" in window)) return;
    new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { active.add(fn); request(); } else { active.delete(fn); } });
    }, { rootMargin: "80px 0px" }).observe(el);
  }

  function whenNear(el, fn) {
    if (!el) return;
    if (!("IntersectionObserver" in window)) { fn(); return; }
    var io = new IntersectionObserver(function (es) { if (es.some(function (e) { return e.isIntersecting; })) { io.disconnect(); fn(); } }, { rootMargin: "700px 0px" });
    io.observe(el);
  }

  /* ---------- Hero: layered hills paced by scroll ---------- */
  var hero = $("#hero");
  /* Hero headline: words rise one by one; re-split after a language change */
  function splitHeroWords() {
    var i = 0;
    $$("[data-words]").forEach(function (el) {
      var txt = el.textContent.trim();
      el.innerHTML = txt.split(/\s+/).map(function (w) { return '<span class="w" style="--i:' + (i++) + '">' + w + "</span>"; }).join(" ");
    });
  }
  langHooks.push(splitHeroWords);
  if (hero && "IntersectionObserver" in window) {
    new IntersectionObserver(function (es) { es.forEach(function (e) { hero.classList.toggle("is-off", !e.isIntersecting); }); }).observe(hero);
  }

  /* Olive-grove silhouettes: injected after first paint, they are below the fold at load */
  var oliveTpl = $("#olive-trees");
  if (oliveTpl) {
    var plantTrees = function () {
      var src = oliveTpl.content.querySelectorAll("svg > g");
      $$(".r-trees[data-t]").forEach(function (g) { var from = src[+g.dataset.t]; if (from) g.innerHTML = from.innerHTML; });
    };
    if (RM) plantTrees();
    else window.addEventListener("load", function () { (window.requestIdleCallback || setTimeout)(plantTrees, { timeout: 1500 }); });
  }
  if (hero && !RM) {
    var photo = $("#hero-photo"), copy = $("#hero-copy"), kicker = $("#ridge-kicker"), cue = $(".scroll-cue");
    var ridges = $$(".ridge", hero).map(function (r) { return { el: r, d: parseFloat(r.dataset.depth) * 100 }; });
    whileVisible(hero, function () {
      var r = hero.getBoundingClientRect();
      var p = clamp(-r.top / Math.max(1, r.height - vh), 0, 1);
      var e = 1 - Math.pow(1 - p, 2);
      photo.style.transform = "translate3d(0," + (-p * 4) + "%,0) scale(" + (1 + p * 0.12) + ")";
      copy.style.transform = "translate3d(0," + (-p * vh * 1.05).toFixed(1) + "px,0)";
      ridges.forEach(function (x) { x.el.style.transform = "translate3d(0," + ((1 - e) * x.d) + "%,0)"; });
      var k = clamp((p - 0.68) / 0.26, 0, 1);
      kicker.style.opacity = k;
      kicker.style.transform = "translate3d(0," + ((1 - k) * 24) + "px,0)";
      if (cue) cue.style.opacity = clamp(1 - p * 5, 0, 1);
    });
  }

  /* ---------- Statement: words light up as you read ---------- */
  var words = [];
  function splitWords() {
    $$(".reveal-words").forEach(function (el) {
      var txt = el.textContent;
      el.innerHTML = txt.split(/(\s+)/).map(function (w) { return /^\s+$/.test(w) ? w : '<span class="w">' + w + "</span>"; }).join("");
      el.setAttribute("aria-label", txt);
    });
    words = $$(".reveal-words .w");
    request();
  }
  var stmt = $(".reveal-words");
  if (stmt && !RM) {
    splitWords();
    langHooks.push(splitWords);
    whileVisible(stmt, function () {
      var r = stmt.getBoundingClientRect();
      var f = clamp((vh * 0.92 - r.top) / (vh * 0.62), 0, 1);
      var n = Math.round(f * words.length);
      for (var i = 0; i < words.length; i++) words[i].classList.toggle("on", i < n);
    });
  }

  /* ---------- Finder ---------- */
  var PROFILES = {
    campo: "M0 92 C 60 84 110 70 170 76 S 290 96 360 80 S 470 62 530 70 S 590 80 600 76",
    monte: "M0 100 C 50 96 80 70 130 58 S 200 24 250 36 S 320 78 380 46 S 470 6 520 18 S 580 40 600 34",
    playa: "M0 84 C 70 76 140 60 210 66 S 330 92 400 98 S 470 104 600 104"
  };
  var DIST = { "45": 0.27, medio: 0.62, dia: 0.97 };
  var finder = $("#finder-form");
  var finderState = null;
  if (finder) {
    var fr = {
      body: $(".fr-body"), title: $("#fr-title"), desc: $("#fr-desc"), chips: $("#fr-chips"), note: $("#fr-note"), tag: $("#fr-tag"),
      route: $("#route"), area: $("#route-area"), line: $("#route-line"), waves: $("#route-waves"), cover: $("#route-cover"), marker: $("#route-marker"), book: $("#fr-book")
    };
    var samples = [], curX = 0, anim = null, lastTerrain = null;
    var mini = { el: $("#fr-mini"), img: $("#frm-img"), title: $("#frm-title"), meta: $("#frm-meta") };
    var val = function (n) { var i = finder.querySelector('input[name="' + n + '"]:checked'); return i ? i.value : null; };
    function sample(terrain) {
      fr.line.setAttribute("d", PROFILES[terrain]);
      fr.area.setAttribute("d", PROFILES[terrain] + " L600 130 L0 130 Z");
      var L = fr.line.getTotalLength(); samples = [];
      for (var i = 0; i <= 60; i++) { var pt = fr.line.getPointAtLength(L * i / 60); samples.push([pt.x, pt.y]); }
    }
    function yAt(x) { for (var i = 1; i < samples.length; i++) { if (samples[i][0] >= x) { var a = samples[i - 1], b = samples[i], k = (x - a[0]) / ((b[0] - a[0]) || 1); return a[1] + (b[1] - a[1]) * k; } } return samples[samples.length - 1][1]; }
    function place(x) {
      var w = fr.route.clientWidth, h = fr.route.clientHeight - 26;
      var px = x / 600 * w, py = yAt(x) / 130 * h;
      fr.marker.style.transform = "translate3d(" + px + "px," + py + "px,0)";
      fr.cover.style.transform = "translate3d(" + px + "px,0,0)";
      curX = x;
    }
    function moveTo(x) {
      if (anim) cancelAnimationFrame(anim);
      if (RM) { place(x); return; }
      var from = curX, t0 = performance.now(), dur = 950;
      (function step(now) {
        var k = clamp((now - t0) / dur, 0, 1), e = k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
        place(from + (x - from) * e);
        if (k < 1) anim = requestAnimationFrame(step); else anim = null;
      })(t0);
    }
    function showImg(key) { $$(".fr-img").forEach(function (im) { im.classList.toggle("is-on", im.dataset.key === key); }); }
    function render(animate) {
      var s = t(), mode = val("mode"), level = val("level"), dur = val("dur"), terr = val("terrain");
      finderState = { mode: mode, level: level, dur: dur, terr: terr };
      $$('.seg[data-for="paseo"]', finder).forEach(function (f) { f.classList.toggle("is-off", mode !== "paseo"); });
      var chips;
      if (mode === "paseo") {
        fr.title.textContent = s.rideTitle(s.dur[dur], s.terr[terr]);
        fr.desc.textContent = s.terrDesc[terr] + " " + s.rideLvl[level];
        fr.tag.textContent = s.durTag[dur];
        chips = [s.durTag[dur], s.terrChip[terr], level === "cero" ? s.monitor : s.everyLevel];
        fr.note.textContent = s.rideNote;
        fr.route.hidden = false;
        if (terr !== lastTerrain) { sample(terr); lastTerrain = terr; place(0); }
        fr.waves.classList.toggle("on", terr === "playa");
        showImg(terr);
        moveTo(DIST[dur] * 600);
      } else {
        fr.title.textContent = s.trialTitle;
        fr.desc.textContent = s.trialLvl[level];
        fr.tag.textContent = s.trialTag;
        chips = s.trialChips.slice();
        if (level === "cero") chips.push(s.monitor);
        fr.note.textContent = s.trialNote;
        fr.route.hidden = true;
        showImg(level === "suelto" ? "doma" : "prueba");
      }
      fr.chips.innerHTML = chips.map(function (c) { return "<li>" + c + "</li>"; }).join("");
      if (mini.el) {
        var key = mode === "paseo" ? terr : (level === "suelto" ? "doma" : "prueba");
        var src = "img/" + (key === "campo" ? "ride-campo" : key === "monte" ? "ride-monte" : key === "playa" ? "ride-playa" : key) + "-240.webp";
        if (mini.img.getAttribute("src") !== src) mini.img.setAttribute("src", src);
        mini.title.textContent = fr.title.textContent;
        mini.meta.textContent = fr.tag.textContent + " · [precio]";
        if (animate && !RM) { mini.el.classList.remove("bump"); void mini.el.offsetWidth; mini.el.classList.add("bump"); }
      }
      if (animate && !RM) { fr.body.classList.remove("swap"); void fr.body.offsetWidth; fr.body.classList.add("swap"); }
    }
    finder.addEventListener("change", function () { render(true); });
    window.addEventListener("resize", function () { if (finderState && finderState.mode === "paseo") place(curX); });
    langHooks.push(function () { render(false); });
    whenNear(finder, function () { render(false); });
    fr.book.addEventListener("click", function () {
      var f = finderState; if (!f) return;
      var what = $("#b-what"), terr = $("#b-terrain"), lvl = $("#b-level");
      if (what) { what.value = f.mode === "prueba" ? "prueba" : f.dur; what.dispatchEvent(new Event("change")); }
      if (terr && f.terr) terr.value = f.terr;
      if (lvl) lvl.value = f.level;
    });
  }

  /* ---------- Booking form ---------- */
  var bf = $("#book-form");
  if (bf) {
    var bWhat = $("#b-what"), bDate = $("#b-date"), bName = $("#b-name"), bPeople = $("#b-people");
    var today = new Date(); today.setHours(0, 0, 0, 0);
    var iso = function (d) { return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); };
    bDate.min = iso(today);
    function syncWhat() { $$("[data-ride-only]", bf).forEach(function (el) { el.classList.toggle("is-off", bWhat.value === "prueba"); }); }
    bWhat.addEventListener("change", syncWhat); syncWhat();
    $$(".step-btn", bf).forEach(function (b) {
      b.addEventListener("click", function () { bPeople.value = clamp((parseInt(bPeople.value, 10) || 1) + parseInt(b.dataset.step, 10), 1, 8); });
    });
    function setMsg(input, msg, warn) {
      var m = $("#" + input.id + "-msg"); if (!m) return;
      m.textContent = msg || ""; m.classList.toggle("warn", !!warn);
      input.closest(".field").classList.toggle("has-error", !!msg && !warn);
      if (msg && !warn) input.setAttribute("aria-invalid", "true"); else input.removeAttribute("aria-invalid");
    }
    function checkDate(strict) {
      var v = bDate.value;
      if (!v) { if (strict) setMsg(bDate, t().errDate); return !strict; }
      var d = new Date(v + "T00:00:00");
      if (d < today) { setMsg(bDate, t().errDate); return false; }
      if (d.getDay() === 1 && bWhat.value === "prueba") setMsg(bDate, t().warnMon, true); else setMsg(bDate, "");
      return true;
    }
    function checkName(strict) {
      if (!bName.value.trim()) { if (strict) setMsg(bName, t().errName); return false; }
      setMsg(bName, ""); return true;
    }
    bDate.addEventListener("change", function () { checkDate(false); });
    bDate.addEventListener("blur", function () { checkDate(false); });
    bName.addEventListener("blur", function () { if (bName.value) checkName(true); });
    bName.addEventListener("input", function () { if (bName.value.trim()) setMsg(bName, ""); });
    bWhat.addEventListener("change", function () { if (bDate.value) checkDate(false); });
    function message() {
      var s = t(), w = bWhat.value;
      var lines = [s.hello + s.what[w] + (w !== "prueba" ? " (" + s.terrMsg[$("#b-terrain").value] + ")" : "") + "."];
      lines.push(s.lDate + ": " + fmtDate(bDate.value) + " (" + s.slot[$("#b-slot").value] + ")");
      lines.push(s.lRiders + ": " + bPeople.value);
      lines.push(s.lLevel + ": " + s.level[$("#b-level").value]);
      lines.push(s.lName + ": " + bName.value.trim());
      var n = $("#b-notes").value.trim(); if (n) lines.push(s.lNotes + ": " + n);
      lines.push(s.sent);
      return lines.join("\n");
    }
    function valid() {
      var a = checkDate(true), b = checkName(true);
      if (!a) bDate.focus(); else if (!b) bName.focus();
      return a && b;
    }
    var ticket = $("#ticket");
    function showTicket(msg) {
      if (!ticket) return;
      var st = t(), w = bWhat.value;
      $("#tk-title").textContent = st.tkTitle(st.what[w]) + (w !== "prueba" ? " · " + st.terrMsg[$("#b-terrain").value] : "");
      var rows = [[st.tkDate, fmtDate(bDate.value) + " · " + st.slot[$("#b-slot").value]], [st.tkRiders, bPeople.value], [st.tkName, bName.value.trim()]];
      $("#tk-list").innerHTML = rows.map(function (r) { return "<div><dt>" + r[0] + "</dt><dd></dd></div>"; }).join("");
      $$("#tk-list dd").forEach(function (dd, i) { dd.textContent = rows[i][1]; });
      $("#tk-wa").href = waUrl(msg);
      ticket.hidden = false;
      ticket.classList.remove("play"); void ticket.offsetWidth; ticket.classList.add("play");
      $("#tk-title").focus({ preventScroll: true });
    }
    if (ticket) $("#tk-edit").addEventListener("click", function () { ticket.hidden = true; ticket.classList.remove("play"); bName.focus(); });
    bf.addEventListener("submit", function (e) { e.preventDefault(); if (valid()) { var m = message(); openWA(m); showTicket(m); } });
    $("#book-mail").addEventListener("click", function (e) {
      e.preventDefault();
      if (valid()) window.location.href = "mailto:" + MAIL + "?subject=" + encodeURIComponent(t().subj) + "&body=" + encodeURIComponent(message());
    });
  }

  /* ---------- Timetable (sample) ---------- */
  var grid = $("#tt-grid");
  var ttFilter = "all";
  var PLAN = [
    null,
    { m: [["adultsDoma", "adults"]], a: [["kidsInit", "kids"], ["jump", "jump kids"]] },
    { m: [["adultsInit", "adults"]], a: [["kidsDoma", "kids"], ["comp", "comp"]] },
    { m: [["adultsDoma", "adults"]], a: [["kidsInit", "kids"], ["jump", "jump adults"]] },
    { m: [["adultsInit", "adults"]], a: [["kidsDoma", "kids"], ["comp", "comp"]] },
    { m: [["kidsInit", "kids"], ["jump", "jump kids"], ["adultsDoma", "adults"]], a: [["jump", "jump adults"], ["comp", "comp"]] },
    { m: [["kidsInit", "kids"], ["adultsDoma", "adults"]], a: [["adultsInit", "adults"]] }
  ];
  function buildTT() {
    if (!grid) return;
    var s = t();
    grid.innerHTML = PLAN.map(function (d, i) {
      if (!d) return '<article class="tt-day is-closed"><h4>' + s.days[i] + '</h4><p class="tt-closed">' + s.closed + "</p></article>";
      var slot = function (x) { return '<span class="tt-slot" data-tags="' + x[1] + '"><b>' + s.cls[x[0]] + "</b><span>" + s.hour + "</span></span>"; };
      return '<article class="tt-day"><h4>' + s.days[i] + "<small>" + s.daysS[i] + '</small></h4><p class="tt-part">' + s.morning + "</p>" + d.m.map(slot).join("") + '<p class="tt-part">' + s.afternoon + "</p>" + d.a.map(slot).join("") + "</article>";
    }).join("");
    filterTT();
  }
  function filterTT() {
    $$(".tt-slot", grid).forEach(function (el) { el.classList.toggle("dim", ttFilter !== "all" && el.dataset.tags.split(" ").indexOf(ttFilter) < 0); });
  }
  if (grid) {
    whenNear(grid, buildTT); langHooks.push(buildTT);
    $$(".tt-filter .chip-btn").forEach(function (b) {
      b.addEventListener("click", function () {
        ttFilter = b.dataset.f;
        $$(".tt-filter .chip-btn").forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
        filterTT();
      });
    });
  }

  /* ---------- Livery ---------- */
  var cards = $$(".liv-card");
  if (cards.length) {
    var plan = $(".liv-plan"), hl = $("#lc-highlight"), chosen = $("#liv-chosen"), table = $("#liv-compare table");
    var OPTS = ["box", "boxpad", "paddock", "deluxe"], cur = "box";
    var posts = $("#pl-posts");
    if (posts) {
      var svgNS = "http://www.w3.org/2000/svg", out = "";
      for (var x = 150; x <= 380; x += 23) out += '<circle cx="' + x + '" cy="40" r="2.6"/><circle cx="' + x + '" cy="210" r="2.6"/>';
      for (var y = 63; y < 210; y += 24) out += '<circle cx="150" cy="' + y + '" r="2.6"/><circle cx="380" cy="' + y + '" r="2.6"/>';
      posts.innerHTML = out; void svgNS;
    }
    var hlReady = false;
    function moveHL(scroll) {
      if (!hlReady) return;
      var i = OPTS.indexOf(cur), th = table.querySelectorAll("thead th")[i + 1];
      if (!th) return;
      hl.style.width = th.offsetWidth + "px";
      hl.style.transform = "translate3d(" + th.offsetLeft + "px,0,0)";
      var box = hl.parentNode; if (scroll === true && box.scrollWidth > box.clientWidth + 4) box.scrollTo({ left: Math.max(0, th.offsetLeft - box.clientWidth / 2 + th.offsetWidth / 2), behavior: RM ? "auto" : "smooth" });
    }
    function select(opt, focus, user) {
      cur = opt;
      cards.forEach(function (c) { var on = c.dataset.opt === opt; c.setAttribute("aria-checked", String(on)); c.tabIndex = on ? 0 : -1; if (on && focus) c.focus(); });
      plan.setAttribute("data-opt", opt);
      $$(".liv-img").forEach(function (im) { im.classList.toggle("is-on", im.dataset.opt === opt); });
      chosen.textContent = t().livName[opt];
      moveHL(!!user);
    }
    cards.forEach(function (c, i) {
      c.addEventListener("click", function () { select(c.dataset.opt, false, true); });
      c.addEventListener("keydown", function (e) {
        var k = e.key, n = null;
        if (k === "ArrowRight" || k === "ArrowDown") n = (i + 1) % cards.length;
        if (k === "ArrowLeft" || k === "ArrowUp") n = (i - 1 + cards.length) % cards.length;
        if (n !== null) { e.preventDefault(); select(cards[n].dataset.opt, true, true); }
      });
      if (!RM && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
        c.addEventListener("pointermove", function (e) {
          var r = c.getBoundingClientRect(), px = (e.clientX - r.left) / r.width - .5, py = (e.clientY - r.top) / r.height - .5;
          var lift = c.getAttribute("aria-checked") === "true" ? -5 : -3;
          c.style.transition = "transform .12s linear";
          c.style.transform = "translateY(" + lift + "px) rotateX(" + (-py * 8) + "deg) rotateY(" + (px * 10) + "deg)";
        });
        c.addEventListener("pointerleave", function () { c.style.transition = ""; c.style.transform = ""; });
      }
    });
    $$(".liv-compare thead th").forEach(function (th, i) { if (i > 0) { th.style.cursor = "pointer"; th.addEventListener("click", function () { select(OPTS[i - 1], false, true); }); } });
    select("box");
    whenNear(table, function () { hlReady = true; requestAnimationFrame(function () { moveHL(); }); });
    window.addEventListener("resize", function () { moveHL(); });
    langHooks.push(function () { chosen.textContent = t().livName[cur]; requestAnimationFrame(function () { moveHL(); }); });
    var lf = $("#liv-form");
    lf.addEventListener("submit", function (e) {
      e.preventDefault();
      var nm = $("#l-name"), msg = $("#l-name-msg");
      if (!nm.value.trim()) { msg.textContent = t().errName; nm.setAttribute("aria-invalid", "true"); nm.closest(".field").classList.add("has-error"); nm.focus(); return; }
      var s = t(), lines = [s.livMsg + s.livName[cur] + "."];
      var h = $("#l-horse").value.trim(); if (h) lines.push(s.lHorse + ": " + h);
      var w = $("#l-when").value; if (w) lines.push(s.lWhen + ": " + fmtMonth(w));
      lines.push(s.lName + ": " + nm.value.trim()); lines.push(s.sent);
      openWA(lines.join("\n"));
    });
    $("#l-name").addEventListener("input", function (e) { if (e.target.value.trim()) { $("#l-name-msg").textContent = ""; e.target.removeAttribute("aria-invalid"); e.target.closest(".field").classList.remove("has-error"); } });
    var lease = $("#lease-wa");
    var setLease = function () { lease.href = waUrl(t().leaseMsg); };
    setLease(); langHooks.push(setLease);
  }

  /* ---------- Arena: ride a dressage figure with the scroll ---------- */
  var arena = $(".arena-sec");
  if (arena) whenNear(arena, initArena);
  function initArena() {
    var path = $("#ar-path"), rider = $("#ar-rider"), lettersG = $("#ar-letters"), prog = $("#ar-prog"), steps = $$("#arena-steps li");
    var LET = [["A", 100, 624], ["C", 100, -24], ["K", -20, 540], ["V", -20, 420], ["E", -20, 300], ["S", -20, 180], ["H", -20, 60], ["F", 220, 540], ["P", 220, 420], ["B", 220, 300], ["R", 220, 180], ["M", 220, 60]];
    var CEN = [["D", 540], ["L", 420], ["X", 300], ["I", 180], ["G", 60]];
    var html = "";
    LET.forEach(function (l) { html += '<circle cx="' + l[1] + '" cy="' + l[2] + '" r="15"/><text x="' + l[1] + '" y="' + l[2] + '">' + l[0] + "</text>"; });
    CEN.forEach(function (l) { html += '<text x="112" y="' + l[1] + '" style="font-size:11px;opacity:.6">' + l[0] + "</text>"; });
    lettersG.innerHTML = html;
    var letterEls = [];
    var texts = lettersG.querySelectorAll("text"), circles = lettersG.querySelectorAll("circle");
    LET.forEach(function (l, i) { letterEls.push({ x: l[1], y: l[2], t: texts[i], c: circles[i] }); });
    /* #ar-path sampled at 300 equal steps (precomputed: getPointAtLength is slow on phones) */
    var RAW = [100,640,100,627.4,100,614.8,100,602.2,100,589.7,100,577.1,100,564.5,100,551.9,100,539.3,100,526.7,100,514.1,100,501.5,100,489,100,476.4,100,463.8,100,451.2,100,438.6,100,426,100,413.4,100,400.9,100,388.3,100,375.7,100,363.1,100,350.5,100,337.9,100,325.3,100,312.8,100,300.2,100,287.6,100,275,100,262.4,100,249.8,100,237.2,100,224.6,100,212.1,100,199.5,100,186.9,100,174.3,100,161.7,100,149.1,100,136.5,100,124,100,111.4,100,98.8,100,86.2,100,73.6,100,61,100,48.4,99.9,35.9,97.3,23.6,90.2,13.3,79.1,7.6,66.7,6,54.1,6,41.5,6,28.9,6,16.4,6.6,7.2,14.4,6,26.9,6,39.4,6,52,6,64.6,6,77.2,6,89.8,6,102.4,6,115,6,127.5,6,140.1,6,152.7,6,165.3,6,177.9,6,190.5,6,203.1,6,215.7,6,228.2,6,240.8,6,253.4,6,266,6,278.6,6,291.2,6.1,303.8,7.4,316.3,10.4,328.5,15,340.2,21.1,351.2,28.7,361.2,37.5,370.2,47.4,377.9,58.2,384.3,69.9,389.1,82,392.3,94.5,393.9,107.1,393.8,119.5,392,131.6,388.6,143.2,383.6,153.9,377,163.7,369.1,172.4,360,179.7,349.8,185.7,338.7,190.1,327,192.9,314.7,194,302.2,193.4,289.6,191.2,277.2,187.4,265.2,182,253.9,175.1,243.4,166.8,233.9,157.4,225.5,147,218.5,135.7,213,123.8,209,111.4,206.7,98.8,206,86.3,207,74,209.6,62.2,213.9,51,219.7,40.8,227,31.6,235.5,23.6,245.2,16.9,255.9,11.8,267.4,8.2,279.5,6.3,291.9,6,304.5,6,317.1,6,329.7,6,342.2,6,354.8,6,367.4,6,380,6,392.6,6,405.2,6,417.8,6,430.4,6,442.9,6,455.5,6,468.1,6,480.7,6,493.3,6,505.9,6,518.5,6,531,6,543.6,6,556.2,6,568.8,6.2,581.4,12.4,591.8,24.6,594,37.2,594,49.8,594,62.4,594,74.9,594,87.5,594,100.1,594,112.7,594,125.3,594,137.9,594,150.5,594,163,594,175.6,594,187.8,591.7,193.8,581.2,194,568.6,194,556,194,543.4,194,530.8,194,518.2,194,505.6,194,493.1,194,480.5,194,467.9,194,455.3,194,442.7,194,430.1,194,417.5,194,405,194,392.4,194,379.8,194,367.2,194,354.6,194,342,194,329.4,194,316.9,194,304.3,194,291.7,194,279.1,194,266.5,194,253.9,194,241.3,194,228.7,194,216.2,194,203.6,194,191,194,178.4,194,165.8,194,153.2,194,140.6,194,128.1,194,115.5,194,102.9,194,90.3,194,77.7,194,65.1,189.8,74.7,185.1,86.3,180.4,98,175.8,109.7,171.1,121.4,166.5,133.1,161.8,144.8,157.2,156.5,152.5,168.2,147.8,179.9,143.2,191.6,138.5,203.3,133.9,215,129.2,226.7,124.6,238.4,119.9,250,115.2,261.7,110.6,273.4,105.9,285.1,101.3,296.8,96.6,308.5,92,320.2,87.3,331.9,82.6,343.6,78,355.3,73.3,367,68.7,378.7,64,390.4,59.4,402.1,54.7,413.7,50,425.4,45.4,437.1,40.7,448.8,36.1,460.5,31.4,472.2,26.7,483.9,22.1,495.6,17.4,507.3,12.8,519,8.1,530.7,6,542.9,6,555.4,6,568,6.1,580.6,11.7,591.4,23.8,594,36.4,594,49,594,61.6,594,74.2,594,86.7,593.9,97.5,588.2,100,576,100,563.5,100,550.9,100,538.3,100,525.7,100,513.1,100,500.5,100,487.9,100,475.4,100,462.8,100,450.2,100,437.6,100,425,100,412.4,100,399.8,100,387.2,100,374.7,100,362.1,100,349.5,100,336.9,100,324.3,100,311.7,100,299.1,100,286.6,100,274,100,261.4,100,248.8,100,236.2,100,223.6,100,211,100,198.5,100,185.9,100,173.3,100,160.7,100,148.1,100,135.5,100,122.9,100,110.3,100,97.8,100,85.2,100,72.6,100,60];
    var N = RAW.length / 2 - 1, pts = [];
    for (var i = 0; i <= N; i++) pts.push([RAW[2 * i], RAW[2 * i + 1]]);
    void path;
    var keys = [[66, 6], [6, 300], [194, 64], [84, 594]], marks = [0], from = 0;
    keys.forEach(function (k) {
      for (var j = from; j < pts.length; j++) { if (Math.hypot(pts[j][0] - k[0], pts[j][1] - k[1]) < 6) { marks.push(j / N); from = j + 5; break; } }
    });
    /* hoofprints left along the path: placed once, only their opacity changes */
    var printsG = $("#ar-prints"), PR = 46, printIdx = [], printEls = [];
    if (printsG) {
      var ph = "";
      for (var q = 1; q <= PR; q++) {
        var ii = Math.min(N - 1, Math.round(q * N / (PR + 1))), a0 = pts[ii], a1 = pts[ii + 1];
        var ang = Math.atan2(a1[1] - a0[1], a1[0] - a0[0]), side = q % 2 ? 7 : -7;
        var px = a0[0] - Math.sin(ang) * side, py = a0[1] + Math.cos(ang) * side;
        ph += '<g class="ar-print" transform="translate(' + px.toFixed(1) + " " + py.toFixed(1) + ") rotate(" + (ang * 180 / Math.PI + 90).toFixed(0) + ')"><path d="M-4.6 4 A4.9 5.6 0 1 1 4.6 4"/></g>';
        printIdx.push(ii);
      }
      printsG.innerHTML = ph;
      printEls = $$(".ar-print", printsG);
    }
    var lastStep = -1;
    function drawArena(f) {
      var fi = f * N, i0 = Math.min(N - 1, Math.floor(fi)), k = fi - i0, a = pts[i0], c = pts[i0 + 1];
      var pt = [a[0] + (c[0] - a[0]) * k, a[1] + (c[1] - a[1]) * k];
      rider.setAttribute("transform", "translate(" + pt[0].toFixed(1) + " " + pt[1].toFixed(1) + ")");
      prog.style.transform = "scaleX(" + f + ")";
      for (var pq = 0; pq < printEls.length; pq++) {
        var age = fi - printIdx[pq];
        var op = age < 0 ? 0 : Math.max(0, 1 - age / 70) * 0.9;
        if (printEls[pq]._o !== op) { printEls[pq].style.opacity = op.toFixed(2); printEls[pq]._o = op; }
      }
      letterEls.forEach(function (l) {
        var near = Math.hypot(l.x - pt[0], l.y - pt[1]) < 34;
        l.t.classList.toggle("lt-on", near); l.c.classList.toggle("on", near);
      });
      var s = 0; for (var m = 0; m < marks.length; m++) if (f >= marks[m] - 0.002) s = m;
      if (s !== lastStep) { steps.forEach(function (li, n) { li.classList.toggle("is-on", RM ? true : n === s); }); lastStep = s; }
    }
    if (RM) { drawArena(1); steps.forEach(function (li) { li.classList.add("is-on"); }); }
    else {
      drawArena(0);
      whileVisible(arena, function () {
        var r = arena.getBoundingClientRect();
        var p = clamp(-r.top / Math.max(1, r.height - vh), 0, 1);
        drawArena(clamp((p - 0.04) / 0.9, 0, 1));
      });
    }
  }

  /* ---------- Meet the horses: swipe, parallax captions, tap to flip ---------- */
  var herd = $("#herd");
  if (herd) {
    var horses = $$(".horse", herd), hprog = $("#herd-prog"), hTick = false;
    $$(".horse-card", herd).forEach(function (b) {
      b.addEventListener("click", function () { b.setAttribute("aria-pressed", String(b.getAttribute("aria-pressed") !== "true")); });
    });
    $$(".herd-btn").forEach(function (b) {
      b.addEventListener("click", function () {
        var step = horses[0].getBoundingClientRect().width + 16;
        herd.scrollBy({ left: step * parseInt(b.dataset.dir, 10), behavior: RM ? "auto" : "smooth" });
      });
    });
    var parts = horses.map(function (h) { return { h: h, img: $(".horse-img", h), cap: $(".horse-cap", h) }; });
    function herdFrame() {
      hTick = false;
      var max = herd.scrollWidth - herd.clientWidth;
      if (hprog) hprog.style.transform = "scaleX(" + (max > 0 ? 0.17 + 0.83 * herd.scrollLeft / max : 1).toFixed(3) + ")";
      if (RM) return;
      var hr = herd.getBoundingClientRect(), mid = hr.left + hr.width / 2;
      parts.forEach(function (o) {
        var r = o.h.getBoundingClientRect(), off = clamp((r.left + r.width / 2 - mid) / hr.width, -1, 1);
        o.img.style.transform = "translate3d(" + (-off * 9).toFixed(2) + "%,0,0)";
        o.cap.style.transform = "translate3d(" + (off * 28).toFixed(1) + "px,0,0)";
      });
    }
    herd.addEventListener("scroll", function () { if (!hTick) { hTick = true; requestAnimationFrame(herdFrame); } }, { passive: true });
    whenNear(herd, function () { requestAnimationFrame(herdFrame); });
    window.addEventListener("resize", function () { if (!hTick) { hTick = true; requestAnimationFrame(herdFrame); } });
  }

  /* ---------- A day at the club: dawn to dusk ---------- */
  var daySec = $("#dia");
  if (daySec && !RM) {
    var scenes = $$(".day-scene", daySec), lights = $$(".day-light", daySec), arm = $("#day-arm"), warm = $("#sun-warm"), hand = $("#day-hand"), phases = $$("#day-phases li");
    var KEYS = [0.1, 0.37, 0.63, 0.9], lastPh = 0;
    scenes.forEach(function (sc) { sc.classList.remove("is-on"); });
    whileVisible(daySec, function () {
      var r = daySec.getBoundingClientRect();
      var p = clamp(-r.top / Math.max(1, r.height - vh), 0, 1);
      scenes.forEach(function (sc, i) {
        var o = i === 0 ? 1 : clamp((p - (i * 0.25 - 0.035)) / 0.07, 0, 1);
        var loc = clamp((p - (KEYS[i] - 0.22)) / 0.5, 0, 1);
        sc.style.opacity = o;
        sc.style.transform = "scale(" + (1.1 - loc * 0.1).toFixed(4) + ")";
      });
      lights.forEach(function (l, i) {
        var w = (i === 0 && p < KEYS[0]) || (i === 3 && p > KEYS[3]) ? 1 : clamp(1 - Math.abs(p - KEYS[i]) / 0.27, 0, 1);
        l.style.opacity = w.toFixed(3);
      });
      arm.style.transform = "rotate(" + (-78 + 156 * p).toFixed(2) + "deg)";
      warm.style.opacity = clamp((p - 0.45) / 0.4, 0, 1).toFixed(3);
      hand.style.transform = "rotate(" + (-90 + 180 * p).toFixed(2) + "deg)";
      var ph = p < 0.25 ? 0 : p < 0.5 ? 1 : p < 0.75 ? 2 : 3;
      if (ph !== lastPh) { phases.forEach(function (li, n) { li.classList.toggle("is-on", n === ph); }); lastPh = ph; }
    });
  }

  /* ---------- Families: path line + kit checklist + child trial ---------- */
  var pathEl = $(".path");
  if (pathEl && !RM) {
    var fill = $(".path-fill"), pSteps = $$(".path-step");
    var horiz = window.matchMedia("(min-width: 1024px)");
    whileVisible(pathEl, function () {
      var r = pathEl.getBoundingClientRect();
      var f = clamp((vh * 0.75 - r.top) / (r.height || 1), 0, 1);
      fill.style.transform = horiz.matches ? "scaleX(" + f + ")" : "scaleY(" + f + ")";
      pSteps.forEach(function (s, i) { s.classList.toggle("in", f >= (i + 0.2) / pSteps.length); });
    });
  }
  var kit = $$(".kit-item");
  if (kit.length) {
    var meterT = $("#kit-count"), bar = $(".kit-bar i");
    var upd = function () {
      var n = kit.filter(function (k) { return k.getAttribute("aria-pressed") === "true"; }).length;
      meterT.textContent = t().kit(n, kit.length);
      bar.style.transform = "scaleX(" + n / kit.length + ")";
    };
    kit.forEach(function (k) { k.addEventListener("click", function () { k.setAttribute("aria-pressed", String(k.getAttribute("aria-pressed") !== "true")); upd(); }); });
    upd(); langHooks.push(upd);
  }
  var kf = $("#kid-form");
  if (kf) {
    var kAge = $("#k-age"), kName = $("#k-parent");
    var kmsg = function (input, text) {
      var m = $("#" + input.id + "-msg"); m.textContent = text || "";
      input.closest(".field").classList.toggle("has-error", !!text);
      if (text) input.setAttribute("aria-invalid", "true"); else input.removeAttribute("aria-invalid");
    };
    kAge.addEventListener("blur", function () { if (kAge.value && +kAge.value < 5) kmsg(kAge, t().errAge); else kmsg(kAge, ""); });
    kName.addEventListener("input", function () { if (kName.value.trim()) kmsg(kName, ""); });
    kf.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = true;
      if (kAge.value && +kAge.value < 5) { kmsg(kAge, t().errAge); ok = false; }
      if (!kName.value.trim()) { kmsg(kName, t().errName); ok = false; }
      if (!ok) { (kAge.getAttribute("aria-invalid") ? kAge : kName).focus(); return; }
      var s = t(), lines = [s.kidMsg];
      var c = $("#k-child").value.trim(); if (c) lines.push(s.lChild + ": " + c);
      if (kAge.value) lines.push(s.lAge + ": " + kAge.value);
      var sl = $("#k-slot"); lines.push(s.lDate + ": " + sl.options[sl.selectedIndex].text);
      lines.push(s.lParent + ": " + kName.value.trim());
      var n = $("#k-notes").value.trim(); if (n) lines.push(s.lNotes + ": " + n);
      lines.push(s.sent);
      openWA(lines.join("\n"));
    });
  }

  /* ---------- Entrance reveals ---------- */
  if (!RM && "IntersectionObserver" in window) {
    var rvEls = $$(".sec-head, .disc, .tt, .prices, .facil-list li, .fam-img, .fam-copy, .rating, .contact-grid > *, .kit > *, .faq, .lease, .liv-enquiry, .facil-feature");
    var seen = new WeakSet();
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        var el = e.target;
        if (!seen.has(el)) {
          seen.add(el);
          if (e.isIntersecting) { io.unobserve(el); return; }
          el.classList.add("rv");
          if (el.matches(".disc, .facil-list li")) el.style.transitionDelay = (Array.prototype.indexOf.call(el.parentNode.children, el) % 4) * 90 + "ms";
          return;
        }
        if (e.isIntersecting) { el.classList.add("in"); io.unobserve(el); }
      });
    }, { rootMargin: "0px 0px -8% 0px" });
    rvEls.forEach(function (el) { io.observe(el); });
  }

  if (lang === "en") applyLang("en");
})();
