/* Larios Tres Legal concept by Noir Digital */
(function () {
  "use strict";
  var D = window.LT, doc = document, root = doc.documentElement;
  root.classList.add("js");
  var RM = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (s, c) { return (c || doc).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); };
  var EMAIL = "info@lariostreslegal.com";

  /* ---------- i18n ---------- */
  var EN = {
    "skip": "Skip to content",
    "nav.guide": "Practice areas", "nav.journey": "Your case", "nav.team": "Team", "nav.contact": "Contact",
    "cta.consult": "Enquire",
    "badge": "Noir Digital concept · not the official website",
    "hero.eyebrow": "Larios Tres Legal, S.L.P. · Málaga",
    "hero.t1": "Litigation strategy,", "hero.t2": "with a clear course", "hero.t3": "set from the port.",
    "hero.lead": "A law firm specialising in litigation and procedural strategy, investment transactions and international business law. On Plaza de la Marina, between the port and Calle Larios.",
    "hero.cta1": "How can we help you?", "hero.cta2": "¿Prefiere español? →",
    "hero.rate": "· 121 Google reviews", "hero.cap": "Plaza de la Marina at night · illustrative image",
    "figs.t": "The firm in figures", "figs.rateSr": "Rated 5.0 out of 5 on Google, ", "figs.rate": "Google reviews",
    "figs.read": "Read them on Google Maps ↗", "figs.cases": "cases in 2023", "figs.langs": "working languages",
    "figs.since": "origin of the group, Larios Tres Consultores",
    "figs.note": "Figures published by the firm on its website and Google listing (checked 19 Nov 2026).",
    "guide.eyebrow": "01 · Practice areas", "guide.t": "How can we help you?",
    "guide.l": "Three questions and we point you to the right area and team. General guidance only: every matter is assessed in consultation.",
    "guide.q1": "You are…", "guide.q2": "What's happening?", "guide.q3": "Your course", "guide.reset": "↺ Start again",
    "jr.eyebrow": "02 · How a case moves", "jr.t": "From the first consultation to resolution.",
    "jr.l": "A chart of how a matter usually progresses. For guidance only: timings and stages depend on each case.",
    "jr.r1": "A dispute", "jr.r2": "Buying a home (non-residents)",
    "faro.eyebrow": "03 · What sets us apart", "faro.t": "Clients should always know where they really stand.",
    "faro.h1": "Transparency and clarity", "faro.p1": "Clear, fluent communication that removes any uncertainty about your case.",
    "faro.h2": "Efficiency", "faro.p2": "Close control of time, and continuous updating on legislation and tools.",
    "faro.h3": "Independence", "faro.p3": "A free and independent perspective, serving each client's interests.",
    "faro.h4": "Added value", "faro.p4": "We train clients to protect themselves, with update manuals at no extra cost.",
    "faro.cap": "La Farola, Málaga port · illustrative image",
    "intl.eyebrow": "04 · International clients", "intl.t": "Buying, investing or living in Spain?",
    "intl.l": "Many of the firm's clients come from abroad. It works with partners in the UK, France, Sweden, Norway and Denmark, and has a dedicated contact for Scandinavian clients.",
    "intl.c1": "Buying a home", "intl.c1s": "See the route step by step",
    "intl.c2": "Residency and immigration", "intl.c2s": "Find my way in the guide",
    "intl.c3": "Starting a business in Spain", "intl.c3s": "Find my way in the guide",
    "intl.en": "Leer esta web en español",
    "team.eyebrow": "05 · Team", "team.t": "Lawyers, economists and paralegals, each with a clear role.",
    "team.l": "Names and roles as published by the firm. Filter by area to see who handles each kind of matter.",
    "c.eyebrow": "06 · Consultation", "c.t": "Tell us about your case.",
    "c.l": "The form prepares an email to the firm with your details. You review it and send it from your own email: this website sends and stores nothing.",
    "c.addr": "Address", "c.phone": "Phone", "c.hours": "Hours",
    "c.hoursv": "Monday to Friday 6:00–22:00<br>Saturday 9:00–14:00 · Sunday closed", "c.map": "Get directions ↗",
    "f.name": "Name", "f.email": "Email", "f.phone": "Phone (optional)", "f.lang": "Preferred language",
    "f.profile": "You are", "f.area": "Area", "f.msg": "Summarise your matter",
    "f.hint": "A short summary is enough. Please don't attach confidential documents in this first contact.",
    "f.ok": "I understand my email program will open and the firm will use my details to answer this enquiry.",
    "f.send": "Prepare the enquiry email",
    "foot.l1": "General, orientative information: it is not legal advice and does not predict the outcome of any matter.",
    "foot.l2": "Photos: Plaza de la Marina (Pablo, CC BY-SA 2.0) and La Farola (Thomas Dahlstrøm Nielsen, CC BY-SA 4.0), Wikimedia Commons, colour-graded. Illustrative image.",
    "foot.l3": "Design concept by Noir Digital · not the official Larios Tres Legal website.",
    "bar.call": "Call", "bar.consult": "Enquire"
  };
  var UI = {
    es: { area: "Área", related: "Perfiles del equipo relacionados", services: "Servicios que publica la firma", prep: "Qué conviene tener a mano", orient: "Orientativo. No sustituye al estudio del caso en consulta.", ask: "Consultar este asunto", all: "Todos", photo: "[retrato por confirmar]", unsure: "No lo sé / otro", step: "Etapa", jrNote: "Orientativo · cada asunto es distinto", jrCta: "Empezar por una consulta", inmNote: "La firma publica: inversión y compraventa, negociación de la financiación y asesoramiento hipotecario.", subj: "Consulta web", sent: "Se ha abierto su programa de correo con la consulta preparada. Revísela y envíela desde allí.", errReq: "Revise los campos marcados: nombre, un email válido, el resumen y la casilla de confirmación.", direct: "Ver el área completa", rating: "5,0" },
    en: { area: "Area", related: "Related team members", services: "Services the firm publishes", prep: "Useful to have to hand", orient: "For guidance only. It does not replace a review of your case.", ask: "Ask about this matter", all: "All", photo: "[portrait to be confirmed]", unsure: "Not sure / other", step: "Stage", jrNote: "For guidance only · every case is different", jrCta: "Start with a consultation", inmNote: "The firm publishes: investment and acquisition, financing negotiation and mortgage advice.", subj: "Website enquiry", sent: "Your email program has opened with the enquiry ready. Review it and send it from there.", errReq: "Please check the highlighted fields: name, a valid email, the summary and the confirmation box.", direct: "See the whole area", rating: "5.0" }
  };
  var ES = {}, lang = "es";
  $$("[data-i18n]").forEach(function (el) { ES[el.getAttribute("data-i18n")] = el.innerHTML; });
  function t(k) { return UI[lang][k]; }
  function L(o) { return o[lang]; }

  function setLang(l, silent) {
    lang = l === "en" ? "en" : "es";
    root.lang = lang;
    $$("[data-i18n]").forEach(function (el) {
      var k = el.getAttribute("data-i18n"), v = lang === "en" ? EN[k] : ES[k];
      if (v != null) el.innerHTML = v;
    });
    $$(".lang__b").forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-lang") === lang)); });
    doc.title = lang === "en" ? "Larios Tres Legal · Lawyers in Málaga · Noir Digital concept" : "Larios Tres Legal · Abogados en Málaga · Concepto de Noir Digital";
    var rn = $("[data-rating-num]"); if (rn) rn.textContent = t("rating"); $("[data-rating-hero]").textContent = t("rating");
    try { localStorage.setItem("lt-lang", lang); } catch (e) {}
    renderAll();
    if (!silent) announce(lang === "en" ? "English" : "Español");
  }
  var live = doc.createElement("p"); live.className = "sr"; live.setAttribute("aria-live", "polite"); doc.body.appendChild(live);
  function announce(s) { live.textContent = s; }

  $$(".lang__b").forEach(function (b) { b.addEventListener("click", function () { setLang(b.getAttribute("data-lang")); }); });
  $$("[data-go-en]").forEach(function (b) {
    b.addEventListener("click", function () {
      if (lang === "en") { setLang("es"); return; }
      setLang("en");
      state.profile = "x"; state.sit = null; renderGuide();
      scrollToEl($("#guia"));
    });
  });

  function scrollToEl(el) { if (el) el.scrollIntoView({ behavior: RM ? "auto" : "smooth", block: "start" }); }

  /* ---------- header ---------- */
  var head = $(".head");
  function onScrollHead() { head.classList.toggle("is-solid", window.scrollY > 40); }
  window.addEventListener("scroll", onScrollHead, { passive: true }); onScrollHead();

  /* ---------- pause ambient animation off-screen ---------- */
  if ("IntersectionObserver" in window) {
    var po = new IntersectionObserver(function (es) { es.forEach(function (e) { e.target.classList.toggle("is-paused", !e.isIntersecting); }); });
    $$(".hero, .faro").forEach(function (s) { po.observe(s); });
  }

  /* ---------- reveal + counters ---------- */
  function countUp(el, to, dur, fmt) {
    if (RM) { el.textContent = fmt(to); return; }
    var t0 = null;
    function step(ts) {
      if (!t0) t0 = ts;
      var p = Math.min(1, (ts - t0) / dur), e = 1 - Math.pow(1 - p, 4);
      el.textContent = fmt(to * e);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var revealIO = "IntersectionObserver" in window ? new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      var el = e.target; revealIO.unobserve(el); el.classList.add("is-in");
      if (el.hasAttribute("data-count-rating")) {
        var rn = $("[data-rating-num]", el);
        countUp(rn, 5, 1800, function (v) { var s = v.toFixed(1); return lang === "en" ? s : s.replace(".", ","); });
      }
      $$("[data-count]", el).forEach(function (n) {
        var to = +n.getAttribute("data-count");
        countUp(n, to, 1600, function (v) { return String(Math.round(v)); });
      });
    });
  }, { threshold: .3 }) : null;
  function rv(el) { if (!revealIO || RM) { el.classList.add("is-in"); return; } el.classList.add("rv"); revealIO.observe(el); }
  rv($("[data-count-rating]")); rv($(".figs__list"));
  $$(".sec-h, .pr__i, .intl__cards, .consult__side, .form").forEach(rv);

  /* ---------- dial ---------- */
  var svgNS = "http://www.w3.org/2000/svg";
  function mk(tag, attrs, parent) { var n = doc.createElementNS(svgNS, tag); for (var k in attrs) n.setAttribute(k, attrs[k]); if (parent) parent.appendChild(n); return n; }
  var ticks = $(".dial__ticks"), labels = $(".dial__labels"), needle = $(".dial__needle");
  for (var i = 0; i < 72; i++) {
    var a = i * 5 * Math.PI / 180, maj = i % 18 === 0, r1 = maj ? 170 : 178;
    mk("line", { x1: Math.sin(a) * r1, y1: -Math.cos(a) * r1, x2: Math.sin(a) * 186, y2: -Math.cos(a) * 186, "class": maj ? "maj" : "" }, ticks);
  }
  function arc(b, r, span) {
    var a0 = (b - span) * Math.PI / 180, a1 = (b + span) * Math.PI / 180;
    return "M" + (Math.sin(a0) * r).toFixed(1) + " " + (-Math.cos(a0) * r).toFixed(1) + " A" + r + " " + r + " 0 0 1 " + (Math.sin(a1) * r).toFixed(1) + " " + (-Math.cos(a1) * r).toFixed(1);
  }
  function buildDial() {
    labels.innerHTML = "";
    D.areas.forEach(function (ar) {
      var a = ar.bearing * Math.PI / 180, r = 128;
      mk("path", { d: arc(ar.bearing, 150, 22), "class": "sect", "data-a": ar.id }, labels);
      var tx = mk("text", { x: (Math.sin(a) * r).toFixed(1), y: (-Math.cos(a) * r).toFixed(1), "data-a": ar.id }, labels);
      tx.textContent = L(ar).short.toUpperCase();
    });
  }
  var needleDeg = -30, degEl = $("[data-dial-deg]"), areaEl = $("[data-dial-area]");
  function pointTo(id) {
    var ar = areaById(id); if (!ar) return;
    var target = ar.bearing, cur = ((needleDeg % 360) + 360) % 360, diff = target - cur;
    if (diff > 180) diff -= 360; if (diff < -180) diff += 360;
    var from = needleDeg; needleDeg += diff;
    needle.style.transform = "rotate(" + needleDeg + "deg)";
    $$("[data-a]", labels).forEach(function (n) { n.classList.toggle("is-on", n.getAttribute("data-a") === id); });
    areaEl.textContent = L(ar).short;
    countDeg(from, needleDeg);
  }
  function countDeg(from, to) {
    var fmt = function (v) { var d = Math.round(((v % 360) + 360) % 360); return ("00" + d).slice(-3) + "°"; };
    if (RM) { degEl.textContent = fmt(to); return; }
    var t0 = null;
    (function step(ts) { if (!t0) t0 = ts; var p = Math.min(1, (ts - t0) / 1100), e = 1 - Math.pow(1 - p, 3); degEl.textContent = fmt(from + (to - from) * e); if (p < 1) requestAnimationFrame(step); })(performance.now());
  }
  function areaById(id) { for (var i = 0; i < D.areas.length; i++) if (D.areas[i].id === id) return D.areas[i]; return null; }
  function sitById(id) { for (var i = 0; i < D.situations.length; i++) if (D.situations[i].id === id) return D.situations[i]; return null; }
  function personById(id) { for (var i = 0; i < D.team.length; i++) if (D.team[i].id === id) return D.team[i]; return null; }

  /* idle needle sweep when the guide first appears */
  if ("IntersectionObserver" in window && !RM) {
    var dio = new IntersectionObserver(function (es) {
      if (!es[0].isIntersecting) return; dio.disconnect();
      if (!state.area) { needleDeg = -30; needle.style.transform = "rotate(-30deg)"; setTimeout(function () { if (!state.area) { needleDeg = 0; needle.style.transform = "rotate(0deg)"; countDeg(-30, 0); } }, 300); }
    }, { threshold: .4 });
    dio.observe($(".dial"));
  } else { needle.style.transform = "rotate(0deg)"; needleDeg = 0; }

  /* ---------- guide ---------- */
  var state = { profile: null, sit: null, area: null, filter: "all", route: "lit" };
  var stepEls = $$(".step"), resetBtn = $("[data-reset]");
  function chip(label, sub, on, fn) {
    var b = doc.createElement("button"); b.type = "button"; b.className = "chip"; b.setAttribute("role", "radio"); b.setAttribute("aria-checked", String(!!on));
    b.innerHTML = label + (sub ? "<small>" + sub + "</small>" : ""); b.addEventListener("click", fn); return b;
  }
  function renderGuide() {
    var pw = $("[data-profiles]"); pw.innerHTML = "";
    D.profiles.forEach(function (p) {
      pw.appendChild(chip(L(p), L(p.sub), state.profile === p.id, function () { state.profile = p.id; state.sit = null; renderGuide(); focusStep(2); }));
    });
    var s2 = stepEls[1], s3 = stepEls[2];
    s2.hidden = !state.profile;
    if (state.profile) {
      var sw = $("[data-situations]"); sw.innerHTML = "";
      D.situations.filter(function (s) { return s.for.indexOf(state.profile) > -1; }).forEach(function (s) {
        sw.appendChild(chip(L(s), "", state.sit === s.id, function () { state.sit = s.id; state.area = s.area; renderGuide(); pointTo(s.area); focusStep(3); }));
      });
    }
    s3.hidden = !state.area;
    resetBtn.hidden = !(state.profile || state.area);
    if (state.area) renderResult();
    $$(".ar").forEach(function (b) { b.classList.toggle("is-on", b.getAttribute("data-area") === state.area); });
  }
  function focusStep(n) {
    var el = stepEls[n - 1]; if (!el || el.hidden) return;
    var r = el.getBoundingClientRect();
    if (r.top > window.innerHeight * .75 || r.top < 0) window.scrollBy({ top: r.top - window.innerHeight * .3, behavior: RM ? "auto" : "smooth" });
  }
  function renderResult() {
    var ar = areaById(state.area), s = state.sit ? sitById(state.sit) : null, box = $(".res");
    var h = '<p class="res__k mono">' + t("area") + " · " + ar.code + " " + ("00" + ar.bearing).slice(-3) + '°</p>';
    h += '<h3 class="res__t">' + L(ar).name + "</h3><p class=\"res__l\">" + L(ar).lead + "</p>";
    h += '<div class="res__cols"><div><h4>' + t("services") + "</h4><ul>";
    L(ar.services).forEach(function (x, i) { h += '<li style="animation-delay:' + (i * 50) + 'ms">' + x + "</li>"; });
    h += "</ul></div><div>";
    if (s) {
      h += "<h4>" + t("prep") + '</h4><ul class="chk-l">';
      L(s.check).forEach(function (x, i) { h += '<li style="animation-delay:' + (200 + i * 70) + 'ms">' + x + "</li>"; });
      h += "</ul><br>";
    }
    h += "<h4>" + t("related") + '</h4><div class="res__team">';
    ar.team.forEach(function (id, i) { var p = personById(id); h += '<a href="#p-' + id + '" data-person="' + id + '" style="animation-delay:' + (300 + i * 80) + 'ms">' + p.name + "</a>"; });
    h += '</div></div></div><p class="res__note mono">' + t("orient") + '</p><button type="button" class="btn" data-ask>' + t("ask") + " →</button>";
    box.innerHTML = h;
    $("[data-ask]", box).addEventListener("click", function () { prefillForm(state.profile, state.area, s ? L(s) : ""); });
    $$("[data-person]", box).forEach(function (a) {
      a.addEventListener("click", function (ev) { ev.preventDefault(); state.filter = state.area; renderTeam(); var c = $("#p-" + a.getAttribute("data-person")); scrollToEl(c); c.classList.remove("is-flash"); void c.offsetWidth; c.classList.add("is-flash"); });
    });
  }
  resetBtn.addEventListener("click", function () { state.profile = state.sit = state.area = null; renderGuide(); pointTo("lit"); $$("[data-a]", labels).forEach(function (n) { n.classList.remove("is-on"); }); areaEl.textContent = "—"; });
  function renderAreas() {
    var w = $(".areas"); w.innerHTML = "";
    D.areas.forEach(function (ar) {
      var b = doc.createElement("button"); b.type = "button"; b.className = "ar"; b.setAttribute("data-area", ar.id);
      b.innerHTML = '<span class="ar__c">' + ar.code + " · " + ("00" + ar.bearing).slice(-3) + '°</span><span class="ar__n">' + L(ar).name + '</span><span class="ar__a" aria-hidden="true">→</span>';
      b.addEventListener("click", function () { state.area = ar.id; state.sit = null; renderGuide(); pointTo(ar.id); var r = stepEls[2]; scrollToEl($(".guide__grid")); });
      w.appendChild(b);
    });
  }

  /* ---------- journey ---------- */
  var jr = { pts: [], len: 0, cum: [], ghost: $(".jr__ghost"), boat: $(".jr__boat"), items: [], active: -1, raf: 0, on: false };
  function buildContours() {
    var g = $(".jr__contours"); if (g.childNodes.length) return;
    for (var k = 0; k < 7; k++) {
      var y = 40 + k * 72, d = "M-20 " + y;
      for (var x = 0; x <= 420; x += 60) d += " Q" + (x + 30) + " " + (y + (k % 2 ? 14 : -14) * Math.sin((x + k * 40) / 70)) + " " + (x + 60) + " " + y;
      mk("path", { d: d }, g);
    }
  }
  function buildJourney() {
    var steps = D.journeys[state.route], n = steps.length;
    jr.pts = [];
    for (var i = 0; i < n; i++) {
      var y = 40 + (440 * i) / (n - 1), x = i % 2 ? 300 - (i % 3) * 18 : 100 + (i % 3) * 22;
      jr.pts.push([x, y]);
    }
    var d = "M" + jr.pts[0].join(" "), segs = $(".jr__segs"), pts = $(".jr__pts");
    segs.innerHTML = ""; pts.innerHTML = "";
    for (var j = 1; j < n; j++) {
      var p0 = jr.pts[j - 1], p1 = jr.pts[j], my = (p0[1] + p1[1]) / 2;
      var c = " C" + p0[0] + " " + my + " " + p1[0] + " " + my + " " + p1[0] + " " + p1[1];
      d += c;
      mk("path", { d: "M" + p0.join(" ") + c, "data-i": j }, segs);
    }
    jr.ghost.setAttribute("d", d);
    jr.pts.forEach(function (p, i) {
      mk("circle", { cx: p[0], cy: p[1], r: 7, "data-i": i }, pts);
      var tx = mk("text", { x: p[0] + (i % 2 ? -22 : 18), y: p[1] + 4, "text-anchor": i % 2 ? "end" : "start", "data-i": i }, pts);
      tx.textContent = ("0" + (i + 1)).slice(-2) + " " + L(steps[i])[0].toUpperCase();
    });
    jr.len = jr.ghost.getTotalLength();
    jr.cum = [0];
    var acc = 0;
    $$("path", segs).forEach(function (s) { acc += s.getTotalLength(); jr.cum.push(acc); });
    var sc = jr.len / acc; jr.cum = jr.cum.map(function (v) { return v * sc; });
    var list = $(".jr__list"); list.innerHTML = "";
    steps.forEach(function (s, i) {
      var li = doc.createElement("li"); li.className = "jr__i";
      li.innerHTML = '<p class="jr__n mono">' + t("step") + " " + ("0" + (i + 1)).slice(-2) + '</p><h3 class="jr__t">' + L(s)[0] + '</h3><p class="jr__p">' + L(s)[1] + "</p>";
      if (i === n - 1) {
        li.innerHTML += (state.route === "inm" ? '<p class="jr__p" style="margin-top:14px">' + t("inmNote") + "</p>" : "") +
          '<p class="jr__note mono" style="margin-top:14px">' + t("jrNote") + '</p><a class="btn jr__cta" href="#consulta">' + t("jrCta") + "</a>";
        var cta = $(".jr__cta", li);
        cta.addEventListener("click", function () { prefillForm(state.route === "inm" ? "x" : null, state.route === "inm" ? "inm" : null, ""); });
      }
      list.appendChild(li);
    });
    jr.items = $$(".jr__i", list);
    $("[data-jr-total]").textContent = ("0" + n).slice(-2);
    jr.active = -1; updateJourney();
  }
  function updateJourney() {
    jr.raf = 0;
    var vh = window.innerHeight, line = vh * (window.innerWidth < 960 ? .62 : .5), n = jr.items.length, f = 0;
    for (var i = 0; i < n; i++) {
      var r = jr.items[i].getBoundingClientRect(), c = r.top + r.height / 2;
      if (c <= line) f = i + Math.min(1, (line - c) / r.height);
    }
    f = Math.max(0, Math.min(n - 1, f));
    if (RM) f = n - 1;
    var idx = Math.round(f);
    var seg = Math.min(n - 2, Math.floor(f)), loc = f - seg;
    var L0 = jr.cum[seg] + (jr.cum[seg + 1] - jr.cum[seg]) * loc;
    var p = jr.ghost.getPointAtLength(Math.min(jr.len, L0));
    jr.boat.setAttribute("transform", "translate(" + p.x.toFixed(1) + " " + p.y.toFixed(1) + ")");
    if (idx !== jr.active) {
      jr.active = idx;
      jr.items.forEach(function (it, k) { it.classList.toggle("is-on", k === idx || RM); });
      $$(".jr__segs path").forEach(function (s) { s.classList.toggle("is-on", +s.getAttribute("data-i") <= idx); });
      $$(".jr__pts [data-i]").forEach(function (s) { s.classList.toggle("is-on", +s.getAttribute("data-i") <= idx); });
      $("[data-jr-step]").textContent = ("0" + (idx + 1)).slice(-2);
    }
  }
  function onJrScroll() { if (!jr.raf) jr.raf = requestAnimationFrame(updateJourney); }
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (es) {
      var on = es[0].isIntersecting;
      if (on && !jr.on) { window.addEventListener("scroll", onJrScroll, { passive: true }); onJrScroll(); }
      if (!on && jr.on) window.removeEventListener("scroll", onJrScroll);
      jr.on = on;
    }).observe($(".jr"));
  }
  window.addEventListener("resize", onJrScroll, { passive: true });
  $$(".seg__b").forEach(function (b) {
    b.addEventListener("click", function () { setRoute(b.getAttribute("data-route")); });
  });
  function setRoute(r) {
    state.route = r;
    $$(".seg__b").forEach(function (x) { x.setAttribute("aria-selected", String(x.getAttribute("data-route") === r)); });
    buildJourney();
  }

  /* ---------- team ---------- */
  function initials(n) { var p = n.split(" "); return p[0][0] + p[1][0]; }
  function renderTeam() {
    var f = $(".filt"); f.innerHTML = "";
    [{ id: "all", label: t("all") }].concat(D.areas.map(function (a) { return { id: a.id, label: L(a).short }; })).forEach(function (o) {
      var b = doc.createElement("button"); b.type = "button"; b.className = "chip"; b.setAttribute("aria-pressed", String(state.filter === o.id)); b.textContent = o.label;
      if (state.filter === o.id) { b.style.background = "var(--mint)"; b.style.color = "var(--bg)"; b.style.borderColor = "var(--mint)"; }
      b.addEventListener("click", function () { state.filter = o.id; renderTeam(); });
      f.appendChild(b);
    });
    var w = $(".crew");
    if (!w.childNodes.length || w.getAttribute("data-lang") !== lang) {
      w.innerHTML = ""; w.setAttribute("data-lang", lang);
      D.team.forEach(function (p) {
        var li = doc.createElement("li"); li.className = "cm"; li.id = "p-" + p.id;
        li.innerHTML = '<span class="cm__mono" aria-hidden="true">' + initials(p.name) + '</span><p class="cm__r mono">' + L(p).role + '</p><h3 class="cm__n">' + p.name + '</h3><p class="cm__p">' + L(p).note + '</p><p class="cm__ph mono">' + t("photo") + "</p>";
        w.appendChild(li);
      });
    }
    D.team.forEach(function (p) { $("#p-" + p.id).classList.toggle("is-dim", state.filter !== "all" && p.tags.indexOf(state.filter) < 0); });
  }

  /* ---------- international ---------- */
  $$("[data-intl]").forEach(function (b) {
    b.addEventListener("click", function () {
      var k = b.getAttribute("data-intl");
      if (k === "compra") { setRoute("inm"); scrollToEl($("#rumbo")); return; }
      var s = sitById(k); state.profile = "x"; state.sit = k; state.area = s.area; renderGuide(); pointTo(s.area); scrollToEl($("#guia"));
    });
  });

  /* ---------- form ---------- */
  var form = $("#form"), err = $(".form__err");
  function fillSelects() {
    var ps = form.profile, as = form.area, pv = ps.value, av = as.value;
    ps.innerHTML = D.profiles.map(function (p) { return '<option value="' + p.id + '">' + L(p) + "</option>"; }).join("");
    as.innerHTML = D.areas.map(function (a) { return '<option value="' + a.id + '">' + L(a).name + "</option>"; }).join("") + '<option value="">' + t("unsure") + "</option>";
    if (pv) ps.value = pv; if (av !== undefined && as.querySelector('option[value="' + av + '"]')) as.value = av; else as.value = "";
    form.lang.value = lang === "en" ? "English" : "Español";
  }
  function prefillForm(profile, area, topic) {
    if (profile) form.profile.value = profile;
    if (area) form.area.value = area;
    if (topic && !form.msg.value) form.msg.value = topic + ". ";
    scrollToEl($("#consulta"));
    setTimeout(function () { form.name.focus({ preventScroll: true }); }, RM ? 0 : 700);
  }
  function bad(el, on) { el.classList.toggle("is-bad", on); el.setAttribute("aria-invalid", String(on)); }
  function validField(el) {
    if (el.name === "email") return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value.trim());
    if (el.type === "checkbox") return el.checked;
    return !el.required || el.value.trim().length > 1;
  }
  $$("input,textarea", form).forEach(function (el) {
    el.addEventListener("blur", function () { if (el.value || el.type === "checkbox") bad(el, !validField(el)); });
    el.addEventListener("input", function () { if (el.classList.contains("is-bad") && validField(el)) bad(el, false); });
  });
  form.addEventListener("submit", function (ev) {
    ev.preventDefault();
    var ok = true;
    [form.name, form.email, form.msg, form.ok].forEach(function (el) { var v = validField(el); bad(el, !v); if (!v) ok = false; });
    if (!ok) { err.hidden = false; err.textContent = t("errReq"); return; }
    var ar = areaById(form.area.value), prof = D.profiles.filter(function (p) { return p.id === form.profile.value; })[0];
    var subj = t("subj") + " · " + (ar ? L(ar).short : t("unsure")) + " · " + form.name.value.trim();
    var body = [
      (lang === "en" ? "Name: " : "Nombre: ") + form.name.value.trim(),
      "Email: " + form.email.value.trim(),
      (lang === "en" ? "Phone: " : "Teléfono: ") + (form.phone.value.trim() || "-"),
      (lang === "en" ? "Preferred language: " : "Idioma preferido: ") + form.lang.value,
      (lang === "en" ? "Profile: " : "Perfil: ") + (prof ? L(prof) : "-"),
      (lang === "en" ? "Area: " : "Área: ") + (ar ? L(ar).name : t("unsure")),
      "", form.msg.value.trim()
    ].join("\n");
    err.hidden = false; err.textContent = t("sent");
    window.location.href = "mailto:" + EMAIL + "?subject=" + encodeURIComponent(subj) + "&body=" + encodeURIComponent(body);
  });

  /* ---------- render ---------- */
  function renderAll() { buildDial(); renderAreas(); renderGuide(); buildContours(); buildJourney(); renderTeam(); fillSelects();
    if (state.area) pointTo(state.area); }

  var start = "es";
  try { var q = new URLSearchParams(location.search).get("lang"); start = q || localStorage.getItem("lt-lang") || "es"; } catch (e) {}
  setLang(start, true);
})();
