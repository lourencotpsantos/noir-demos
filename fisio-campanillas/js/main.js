/* Fisioterapia Campanillas — concept by Noir Digital. Vanilla JS, no dependencies. */
(function () {
  "use strict";
  var D = window.FC_I18N;
  var doc = document;
  var root = doc.documentElement;
  root.classList.add("js");
  var $ = function (s, c) { return (c || doc).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); };
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  var lang = "es";
  var langHooks = [];
  var SVGNS = "http://www.w3.org/2000/svg";
  var WA = "34667471390";
  var MAIL = "info@fisioterapiacampanillas.com";

  function ui(k) { return D.ui[lang][k]; }
  function tx(o) { return o[lang]; }
  function fmt(s, o) { return s.replace(/\{(\w+)\}/g, function (_, k) { return o[k]; }); }
  function bump(el) { el.classList.toggle("bump", false); void el.offsetWidth; el.classList.toggle("bump", true); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  /* ---------- i18n ---------- */
  var es = {};
  $$("[data-i18n]").forEach(function (el) { es[el.getAttribute("data-i18n")] = el.textContent; });
  $$("[data-i18n-html]").forEach(function (el) { es[el.getAttribute("data-i18n-html")] = el.innerHTML; });
  $$("[data-i18n-attr]").forEach(function (el) {
    el.getAttribute("data-i18n-attr").split(";").forEach(function (p) {
      var kv = p.split(":"); es[kv[1]] = el.getAttribute(kv[0]);
    });
  });
  var esTitle = doc.title;
  var enTitle = "Fisioterapia Campanillas · Physiotherapy, osteopathy and pilates in Campanillas, Málaga";

  function t(k) { return lang === "en" ? (D.en[k] != null ? D.en[k] : es[k]) : es[k]; }

  function applyLang(next) {
    lang = next === "en" ? "en" : "es";
    root.lang = lang;
    doc.title = lang === "en" ? enTitle : esTitle;
    $$("[data-i18n]").forEach(function (el) { el.textContent = t(el.getAttribute("data-i18n")); });
    $$("[data-i18n-html]").forEach(function (el) { el.innerHTML = t(el.getAttribute("data-i18n-html")); });
    $$("[data-i18n-attr]").forEach(function (el) {
      el.getAttribute("data-i18n-attr").split(";").forEach(function (p) {
        var kv = p.split(":"); el.setAttribute(kv[0], t(kv[1]));
      });
    });
    $$(".lang-btn").forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-lang") === lang)); });
    try { localStorage.setItem("fc-lang", lang); } catch (e) {}
    langHooks.forEach(function (fn) { fn(); });
  }
  $$(".lang-btn").forEach(function (b) {
    b.addEventListener("click", function () { if (b.getAttribute("data-lang") !== lang) applyLang(b.getAttribute("data-lang")); });
  });

  /* ---------- Header, menu, scroll thread ---------- */
  var header = $(".site-header");
  var nav = $("#nav");
  var menuBtn = $(".menu-btn");
  var fill = $("#thread-fill");
  function setMenu(open) {
    nav.classList.toggle("is-open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", ui(open ? "menuClose" : "menuOpen"));
  }
  menuBtn.addEventListener("click", function () { setMenu(!nav.classList.contains("is-open")); });
  $$("a", nav).forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
  doc.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && nav.classList.contains("is-open")) { setMenu(false); menuBtn.focus(); }
  });
  langHooks.push(function () { menuBtn.setAttribute("aria-label", ui(nav.classList.contains("is-open") ? "menuClose" : "menuOpen")); });

  var ticking = false;
  var scrollFns = [];
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      ticking = false;
      var y = window.scrollY;
      header.classList.toggle("is-scrolled", y > 8);
      var h = doc.documentElement.scrollHeight - window.innerHeight;
      fill.style.transform = "scaleX(" + (h > 0 ? Math.min(1, y / h) : 0) + ")";
      scrollFns.forEach(function (fn) { fn(); });
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });

  /* ---------- Reveal on scroll ---------- */
  var revealEls = $$(".reveal, .score, .member");
  if ("IntersectionObserver" in window && !reduce.matches) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* ---------- Score count-up ---------- */
  var scoreEl = $(".score"), scoreN = $("#score-n");
  if (scoreEl && !reduce.matches) inView(scoreEl, function () {
    var t0 = performance.now();
    (function step(now) {
      var x = Math.min(1, (now - t0) / 1600), e = 1 - Math.pow(1 - x, 3);
      scoreN.textContent = (4.7 * e).toFixed(1).replace(".", ",");
      if (x < 1) requestAnimationFrame(step);
    })(t0);
  }, { threshold: 0.5 });

  /* ---------- Breathing control ---------- */
  var breath = $("#breath");
  function breathLabel() {
    var paused = breath.classList.contains("is-paused");
    $(".breath-ctrl", breath).textContent = ui(paused ? "breathPlay" : "breathPause");
  }
  breath.addEventListener("click", function () {
    var paused = !breath.classList.contains("is-paused");
    breath.classList.toggle("is-paused", paused);
    root.classList.toggle("is-paused-all", paused);
    breath.setAttribute("aria-pressed", String(paused));
    breathLabel();
  });
  langHooks.push(breathLabel);
  if (reduce.matches) breath.hidden = true;

  /* ---------- Loops run only on screen ---------- */
  function watchLive(els) {
    if (!("IntersectionObserver" in window)) { els.forEach(function (el) { el.classList.add("is-live"); }); return; }
    var lio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { en.target.classList.toggle("is-live", en.isIntersecting); });
    }, { rootMargin: "80px 0px" });
    els.forEach(function (el) { lio.observe(el); });
  }
  watchLive($$(".anim-loop"));
  function inView(el, cb, opts) {
    if (!("IntersectionObserver" in window) || reduce.matches) { cb(); return; }
    var o = new IntersectionObserver(function (en) { if (en[0].isIntersecting) { o.disconnect(); cb(); } }, opts || { threshold: 0.35 });
    o.observe(el);
  }

  /* ---------- Hero figure: echo trails + cursor tilt ---------- */
  var fine = window.matchMedia("(hover: hover) and (pointer: fine)");
  (function heroStage() {
    var figEl = $("#fig"), stage = $("#stage"), hero = $(".hero");
    if (!figEl || reduce.matches) return;
    [[".7s", "g2"], [".35s", "g1"]].forEach(function (g) {
      var c = figEl.cloneNode(true);
      c.removeAttribute("id");
      c.setAttribute("class", "fig ghost " + g[1]);
      c.style.setProperty("--lag", g[0]);
      figEl.parentNode.insertBefore(c, figEl);
    });
    if (!fine.matches) return;
    var light = $("#stage-light"), pose = $("#pose"), queued = false, px = 0, py = 0;
    hero.addEventListener("pointermove", function (e) {
      if (!stage.classList.contains("is-live")) return;
      px = e.clientX / window.innerWidth - 0.5; py = e.clientY / window.innerHeight - 0.5;
      if (queued) return; queued = true;
      requestAnimationFrame(function () {
        queued = false;
        stage.style.transform = "perspective(1100px) rotateY(" + (px * 7).toFixed(2) + "deg) rotateX(" + (-py * 5).toFixed(2) + "deg)";
        light.style.transform = "translate(" + (px * 60).toFixed(1) + "px," + (py * 50).toFixed(1) + "px)";
        pose.style.transform = "translate(" + (px * -14).toFixed(1) + "px," + (py * -8).toFixed(1) + "px)";
      });
    });
    hero.addEventListener("pointerleave", function () { stage.style.transform = ""; light.style.transform = ""; pose.style.transform = ""; });
  })();

  /* Far sections skip layout until needed; an in-page jump lays them all out first so it lands exactly */
  function fullLayout() { root.classList.add("cv-all"); }
  doc.addEventListener("click", function (e) { if (e.target.closest && e.target.closest('a[href^="#"]')) fullLayout(); }, true);

  /* ---------- Ripple on every control ---------- */
  var RIPPLE = ".btn, .pill, .chip, .pack, .day-btn, .calc-tab, .bm-view, .cls-book, .bk-date, .bk-time, .lang-btn";
  doc.addEventListener("pointerdown", function (e) {
    if (reduce.matches) return;
    var el = e.target.closest && e.target.closest(RIPPLE);
    if (!el) return;
    var r = el.getBoundingClientRect();
    var sp = doc.createElement("span");
    sp.className = "rpl";
    sp.style.left = (e.clientX - r.left) + "px";
    sp.style.top = (e.clientY - r.top) + "px";
    sp.style.setProperty("--rs", String(Math.ceil(Math.max(r.width, r.height) / 6)));
    el.appendChild(sp);
    setTimeout(function () { sp.remove(); }, 700);
  }, { passive: true });

  /* Widgets below the fold start once the browser is idle, so the hero paints first */
  function* initRest() {
  /* ---------- Spine: vertebrae + scroll-drawn line ---------- */
  var spineLine = $("#spine-line");
  var vg = $("#vertebrae");
  var spineFig = $(".spine-fig");
  var verts = [];
  (function buildSpine() {
    var len = spineLine.getTotalLength();
    var N = 17;
    for (var i = 0; i < N; i++) {
      var f = 0.04 + (i / (N - 1)) * 0.9;
      var p = spineLine.getPointAtLength(len * f);
      var p2 = spineLine.getPointAtLength(Math.min(len, len * f + 2));
      var ang = Math.atan2(p2.y - p.y, p2.x - p.x) * 180 / Math.PI - 90;
      var w = 30 + Math.sin(f * Math.PI) * 18 - (i > 13 ? (i - 13) * 6 : 0);
      var g = doc.createElementNS(SVGNS, "g");
      g.setAttribute("transform", "rotate(" + ang.toFixed(1) + " " + p.x.toFixed(1) + " " + p.y.toFixed(1) + ")");
      var r = doc.createElementNS(SVGNS, "rect");
      r.setAttribute("x", (p.x - w / 2).toFixed(1));
      r.setAttribute("y", (p.y - 9).toFixed(1));
      r.setAttribute("width", w.toFixed(1));
      r.setAttribute("height", "18");
      r.setAttribute("rx", "8");
      r.setAttribute("class", "vertebra");
      // each vertebra starts a little out of line; scrolling brings it back (--m goes 1 -> 0)
      var side = i % 2 ? 1 : -1;
      var amp = 0.45 + 0.55 * Math.abs(Math.sin(i * 1.7));
      r.style.setProperty("--dx", (side * 16 * amp).toFixed(1));
      r.style.setProperty("--rt", (side * -13 * amp).toFixed(1));
      r.dataset.f = f;
      g.appendChild(r);
      vg.appendChild(g);
      verts.push(r);
    }
  })();
  yield;
  var spineSvg = $("#spine-svg");
  var apSec = $("#enfoque");
  var apSteps = $$("#ap-steps li");
  var pinMQ = window.matchMedia("(min-width: 1024px) and (min-height: 700px)");
  var spineNear = true;
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (en) { spineNear = en[0].isIntersecting; if (spineNear) drawSpine(); }, { rootMargin: "200px 0px" }).observe(apSec);
  }
  var lastStep = -1, lastCalm = null, lastM = -1;
  function drawSpine() {
    if (!spineNear) return;
    var vh = window.innerHeight, prog;
    var pinned = pinMQ.matches;
    apSec.classList.toggle("is-pinned", pinned);
    if (pinned) {
      var sr = apSec.getBoundingClientRect();
      prog = -sr.top / Math.max(1, sr.height - vh);
    } else {
      var r = spineFig.getBoundingClientRect();
      prog = (vh * 0.85 - r.top) / (r.height + vh * 0.25);
    }
    prog = Math.max(0, Math.min(1, prog));
    var m = Math.max(0, 1 - prog / 0.8);
    if (Math.abs(m - lastM) > 0.004) {
      lastM = m;
      spineSvg.style.setProperty("--m", m.toFixed(3));
      spineLine.style.setProperty("--draw", String(1 - prog));
      verts.forEach(function (v) { v.classList.toggle("is-lit", parseFloat(v.dataset.f) <= prog * 1.15 + 0.02); });
    }
    var calm = m < 0.35;
    if (calm !== lastCalm) { lastCalm = calm; spineFig.classList.toggle("is-calm", calm); }
    var st = pinned ? Math.min(2, Math.floor(prog * 3.2)) : -1;
    if (st !== lastStep) { lastStep = st; apSteps.forEach(function (li, i) { li.classList.toggle("is-active", i === st); }); }
  }
  if (reduce.matches) { verts.forEach(function (v) { v.classList.add("is-lit"); }); spineLine.style.setProperty("--draw", "0"); spineSvg.style.setProperty("--m", "0"); spineFig.classList.add("is-calm"); }
  else { scrollFns.push(drawSpine); drawSpine(); }

  yield;
  /* ---------- Story: one figure straightens as you slide ---------- */
  var cmpBox = $("#cmp"), cmpFrame = $("#cmp-frame"), cmpRange = $("#cmp-range"), chapters = $$("#chapters .chapter");
  var lastCh = -1, hinting = false;
  function setCmp(v, fromUser) {
    var k = (v / 100).toFixed(3);
    cmpFrame.style.setProperty("--k", k);
    cmpRange.parentNode.style.setProperty("--k", k);
    var ch = v < 34 ? 0 : v < 67 ? 1 : 2;
    if (ch !== lastCh) { lastCh = ch; chapters.forEach(function (c, i) { c.classList.toggle("is-on", i === ch); }); }
    if (fromUser !== false) cmpRange.setAttribute("aria-valuetext", fmt(ui("cmpText"), { p: v }) + " · " + ui("chNames")[ch]);
  }
  cmpRange.addEventListener("input", function () { hinting = false; setCmp(parseInt(cmpRange.value, 10)); });
  cmpRange.addEventListener("pointerdown", function () { hinting = false; cmpBox.classList.add("is-drag"); });
  ["pointerup", "pointercancel", "blur"].forEach(function (ev) { cmpRange.addEventListener(ev, function () { cmpBox.classList.remove("is-drag"); }); });
  chapters.forEach(function (c, i) {
    c.addEventListener("click", function () { hinting = false; var v = [12, 50, 92][i]; cmpRange.value = v; setCmp(v); });
  });
  setCmp(50);
  langHooks.push(function () { setCmp(parseInt(cmpRange.value, 10)); });
  // one gentle sweep when it first comes into view, to show it can be dragged
  inView(cmpFrame, function () {
    if (reduce.matches) return;
    hinting = true;
    var keys = [[0, 50], [900, 8], [2400, 96], [3400, 60]], t0 = performance.now();
    function ease(x) { return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2; }
    (function step(now) {
      if (!hinting) return;
      var t = now - t0, k = 1;
      while (k < keys.length - 1 && t > keys[k][0]) k++;
      var a = keys[k - 1], b = keys[k];
      var x = Math.max(0, Math.min(1, (t - a[0]) / (b[0] - a[0])));
      var v = Math.round(a[1] + (b[1] - a[1]) * ease(x));
      cmpRange.value = v; setCmp(v, false);
      if (t < keys[keys.length - 1][0]) requestAnimationFrame(step); else { hinting = false; setCmp(v); }
    })(t0);
  }, { threshold: 0.6 });

  yield;
  /* ---------- Breath moment ---------- */
  var bsStage = $("#bs-stage"), bsBtn = $("#bs-btn"), bsN = $("#bs-n"), bsCount = 0;
  function bsLabel() { $("#bs-btn-t").textContent = ui(bsStage.classList.contains("is-stopped") ? "bsPlay" : "bsPause"); }
  bsBtn.addEventListener("click", function () {
    var stop = !bsStage.classList.contains("is-stopped");
    bsStage.classList.toggle("is-stopped", stop);
    bsBtn.setAttribute("aria-pressed", String(stop));
    bsLabel();
  });
  $(".bs-core", bsStage).addEventListener("animationiteration", function () {
    bsCount++;
    bsN.textContent = String(bsCount > 3 ? ((bsCount - 1) % 3) + 1 : bsCount);
    bump(bsN);
  });
  langHooks.push(bsLabel);

  yield;
  /* ---------- Body map ---------- */
  var fig = $("#bm-figure");
  var spotsG = $("#bm-spots");
  var glow = $("#bm-glow");
  var chipsBox = $("#bm-chips");
  var view = "front";
  var activeZone = null;
  var flipT = 0;
  fig.addEventListener("animationend", function (e) { if (e.animationName === "flip3d") fig.classList.remove("flip3d"); });
  // the figure leans gently towards the pointer
  var bmWrap = $("#bm-wrap"), bmQ = false;
  if (fine.matches && !reduce.matches) {
    bmWrap.parentNode.addEventListener("pointermove", function (e) {
      if (bmQ) return; bmQ = true;
      var r = bmWrap.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      requestAnimationFrame(function () { bmQ = false; bmWrap.style.transform = "perspective(1000px) rotateY(" + (x * 12).toFixed(1) + "deg) rotateX(" + (-y * 6).toFixed(1) + "deg)"; });
    });
    bmWrap.parentNode.addEventListener("pointerleave", function () { bmWrap.style.transform = ""; });
  }
  fig.setAttribute("data-view", view);
  function zoneById(id) { for (var i = 0; i < D.zones.length; i++) if (D.zones[i].id === id) return D.zones[i]; return null; }
  function zonesForView(v) { return D.zones.filter(function (z) { return z.spots.some(function (s) { return s[0] === v; }); }); }

  function renderSpots() {
    spotsG.textContent = "";
    D.zones.forEach(function (z) {
      z.spots.forEach(function (s, idx) {
        if (s[0] !== view) return;
        var g = doc.createElementNS(SVGNS, "g");
        g.setAttribute("class", "bm-spot" + (activeZone === z.id ? " is-active" : ""));
        g.setAttribute("data-zone", z.id);
        g.setAttribute("role", "button");
        // only the first spot of a zone in this view is in the tab order; chips cover keyboard too
        var first = z.spots.filter(function (q) { return q[0] === view; })[0] === s;
        g.setAttribute("tabindex", first ? "0" : "-1");
        g.setAttribute("aria-label", ui("spotAria") + tx(z));
        g.setAttribute("aria-pressed", String(activeZone === z.id));
        g.innerHTML = '<circle class="sp-halo" cx="' + s[1] + '" cy="' + s[2] + '" r="22" style="animation-delay:-' + ((idx * 0.7 + s[2] / 200) % 3).toFixed(2) + 's"/>' +
          '<circle class="sp-hit" cx="' + s[1] + '" cy="' + s[2] + '" r="16"/>' +
          '<circle class="sp-ring" cx="' + s[1] + '" cy="' + s[2] + '" r="10" style="animation-delay:' + ((idx * 0.4 + s[2] / 300) % 3).toFixed(2) + 's"/>' +
          '<circle class="sp-focus" cx="' + s[1] + '" cy="' + s[2] + '" r="13"/>' +
          '<circle class="sp-dot" cx="' + s[1] + '" cy="' + s[2] + '" r="6.5"/>';
        g.addEventListener("click", function () { ripple(s); selectZone(z.id, s); });
        g.addEventListener("keydown", function (e) {
          if (e.key === "Enter" || e.key === " ") { e.preventDefault(); selectZone(z.id, s); }
        });
        spotsG.appendChild(g);
      });
    });
  }
  function renderChips() {
    chipsBox.textContent = "";
    zonesForView(view).forEach(function (z) {
      var b = doc.createElement("button");
      b.type = "button";
      b.className = "chip";
      b.textContent = tx(z);
      b.setAttribute("aria-pressed", String(activeZone === z.id));
      b.addEventListener("click", function () { selectZone(z.id); });
      chipsBox.appendChild(b);
    });
  }
  function ripple(s) {
    if (reduce.matches) return;
    var c = doc.createElementNS(SVGNS, "circle");
    c.setAttribute("class", "sp-ripple"); c.setAttribute("cx", s[1]); c.setAttribute("cy", s[2]); c.setAttribute("r", "10");
    fig.appendChild(c);
    setTimeout(function () { c.remove(); }, 850);
  }
  function placeGlow(id, spot) {
    var z = zoneById(id);
    var s = spot || z.spots.filter(function (q) { return q[0] === view; })[0];
    if (!s) { glow.setAttribute("cx", -100); glow.setAttribute("cy", -100); return; }
    glow.setAttribute("cx", s[1]);
    glow.setAttribute("cy", s[2]);
  }
  function renderPanel(animate) {
    var z = activeZone && zoneById(activeZone);
    $("#bm-empty").hidden = !!z;
    var box = $("#bm-content");
    box.hidden = !z;
    if (!z) return;
    $("#bm-kicker").textContent = ui(view === "front" ? "kickerFront" : "kickerBack");
    $("#bm-name").textContent = tx(z);
    $("#bm-causes").innerHTML = z.causes.map(function (c) { return "<li>" + esc(lang === "en" ? c[1] : c[0]) + "</li>"; }).join("");
    $("#bm-treats").innerHTML = z.treats.map(function (k) { var tr = D.treats[k]; return '<li><a href="' + tr.href + '">' + esc(tx(tr)) + "</a></li>"; }).join("");
    if (animate) { box.classList.remove("is-swap"); void box.offsetWidth; box.classList.add("is-swap"); }
  }
  function selectZone(id, spot) {
    activeZone = id;
    placeGlow(id, spot);
    $$(".bm-spot", spotsG).forEach(function (g) {
      var on = g.getAttribute("data-zone") === id;
      g.classList.toggle("is-active", on);
      g.setAttribute("aria-pressed", String(on));
    });
    $$(".chip", chipsBox).forEach(function (c, i) { c.setAttribute("aria-pressed", String(zonesForView(view)[i].id === id)); });
    renderPanel(true);
    if (window.innerWidth < 768) {
      var panel = $("#bm-panel");
      var r = panel.getBoundingClientRect();
      if (r.top > window.innerHeight * 0.7) panel.scrollIntoView({ behavior: reduce.matches ? "auto" : "smooth", block: "start" });
    }
  }
  $$(".bm-view").forEach(function (b) {
    b.addEventListener("click", function () {
      var v = b.getAttribute("data-view");
      if (v === view) return;
      view = v;
      $$(".bm-view").forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
      if (activeZone && !zoneById(activeZone).spots.some(function (s) { return s[0] === v; })) activeZone = null;
      renderChips();
      renderPanel(false);
      // 3D turn: the figure swaps sides while it is edge-on
      function swap() {
        fig.setAttribute("data-view", v);
        renderSpots();
        if (activeZone) placeGlow(activeZone); else placeGlow("cabeza", ["x", -100, -100]);
      }
      if (reduce.matches) swap();
      else {
        clearTimeout(flipT);
        fig.classList.remove("flip3d"); void fig.getBoundingClientRect(); fig.classList.add("flip3d");
        flipT = setTimeout(swap, 380);
      }
    });
  });
  $("#bm-cta").addEventListener("click", function () {
    var z = activeZone && zoneById(activeZone);
    prefillBooking({ type: "fisio", zone: z ? tx(z) : "" });
  });
  // a treatment link in the panel briefly highlights the card it jumps to
  $("#bm-treats").addEventListener("click", function (e) {
    var a = e.target.closest("a"); if (!a) return;
    var target = $(a.getAttribute("href"));
    if (target) { target.classList.remove("is-flash"); void target.offsetWidth; target.classList.add("is-flash"); }
  });
  yield;
  // start with one area open so the panel never looks empty
  activeZone = "cuello"; renderSpots(); renderChips(); placeGlow("cuello"); renderPanel(false);
  langHooks.push(function () { renderSpots(); renderChips(); renderPanel(false); });

  yield;
  /* ---------- Pilates timetable ---------- */
  var ttGrid = $("#tt-grid");
  var ttDays = $("#tt-days");
  var level = "all";
  var today = new Date().getDay(); // 0 Sun
  var curDay = today >= 1 && today <= 5 ? today - 1 : 0;
  function renderDays() {
    var fresh = ttDays.children.length !== 5 || ttDays.getAttribute("data-lang") !== lang;
    if (fresh) { ttDays.textContent = ""; ttDays.setAttribute("data-lang", lang); }
    ui("daysShort").forEach(function (d, i) {
      var n = D.classes.filter(function (c) { return c.day === i && (level === "all" || c.lv === level); }).length;
      var b = fresh ? doc.createElement("button") : ttDays.children[i];
      if (fresh) {
        b.type = "button";
        b.className = "day-btn";
        b.title = ui("days")[i];
        b.innerHTML = "<span>" + d + '</span><small><span class="dn">' + n + '</span><span class="sr-only"> ' + ui("classesWord") + "</span></small>";
        b.addEventListener("click", function () { curDay = i; renderDays(); renderTT(); });
        ttDays.appendChild(b);
      } else {
        var dn = $(".dn", b);
        if (dn.textContent !== String(n)) { dn.textContent = n; bump($("small", b)); }
      }
      b.setAttribute("aria-pressed", String(i === curDay));
    });
  }
  var FIGS = {};
  $$(".tt-filters .pill").forEach(function (b) { var m = $(".mf", b); if (m) FIGS[b.getAttribute("data-level")] = m.outerHTML; });
  function renderTT() {
    ttGrid.textContent = "";
    var visibleToday = 0;
    for (var d = 0; d < 5; d++) {
      var col = doc.createElement("div");
      col.className = "tt-col" + (d === curDay ? " is-current" : "");
      col.innerHTML = "<h3>" + ui("days")[d] + "</h3>";
      D.classes.filter(function (c) { return c.day === d; }).forEach(function (c) {
        var show = level === "all" || c.lv === level;
        if (!show) return;
        if (d === curDay) visibleToday++;
        var el = doc.createElement("div");
        el.className = "cls";
        el.setAttribute("data-level", c.lv);
        el.style.animationDelay = (col.children.length * 0.06).toFixed(2) + "s";
        el.innerHTML = '<p class="cls-time">' + c.t + "<small>" + ui("min55") + "</small></p>" +
          '<p class="cls-name">' + (FIGS[c.lv] || "") + "<span>" + esc(tx(c)) + '<span class="cls-lv">' + ui("levels")[c.lv] + "</span></span></p>";
        el.querySelectorAll("p").forEach(function (p) { p.style.margin = "0"; });
        var b = doc.createElement("button");
        b.type = "button";
        b.className = "cls-book";
        b.textContent = ui("book");
        b.setAttribute("aria-label", ui("bookAria") + ui("days")[d] + " " + c.t + ", " + tx(c));
        b.addEventListener("click", function () { prefillBooking({ type: "pilates", day: c.day, time: c.t }); });
        el.appendChild(b);
        col.appendChild(el);
      });
      ttGrid.appendChild(col);
    }
    var wide = window.matchMedia("(min-width: 1024px)").matches;
    var anyAtAll = D.classes.some(function (c) { return level === "all" || c.lv === level; });
    $("#tt-empty").hidden = wide ? anyAtAll : visibleToday > 0;
  }
  $$(".tt-filters .pill").forEach(function (b) {
    b.addEventListener("click", function () {
      level = b.getAttribute("data-level");
      $$(".tt-filters .pill").forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
      renderDays(); renderTT();
    });
  });
  yield;
  renderDays(); renderTT();
  langHooks.push(function () { renderDays(); renderTT(); });

  yield;
  /* ---------- Price calculator ---------- */
  var calcKind = "core";
  var calcIdx = 0;
  var shownPer = 30, shownKey = "";
  function money(v, dec) {
    var r = Math.round(v * 100) / 100;
    var t = dec && Math.abs(r - Math.round(r)) > 0.001 ? r.toFixed(2) : String(Math.round(v));
    t = t.replace(".", lang === "en" ? "." : ",");
    return lang === "en" ? "\u20ac" + t : t + " \u20ac";
  }
  function tweenPer(to) {
    var el = $("#calc-per"), from = shownPer, t0 = performance.now(), dur = 700;
    shownPer = to;
    if (reduce.matches || from === to) { el.textContent = money(to, true); return; }
    bump(el);
    (function step(now) {
      var x = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - x, 3);
      el.textContent = money(x < 1 ? from + (to - from) * e : to, x >= 1);
      if (x < 1) requestAnimationFrame(step);
    })(t0);
  }
  function renderCalc() {
    var packs = D.packs[calcKind];
    var box = $("#calc-packs");
    var key = calcKind + lang;
    if (key !== shownKey) {
      shownKey = key;
      box.textContent = "";
      packs.forEach(function (p, i) {
        var b = doc.createElement("button");
        b.type = "button";
        b.className = "pack";
        b.innerHTML = "<strong>" + (lang === "en" ? "\u20ac" + p.total : p.total + " \u20ac") + "</strong><small>" + (p.n === 1 ? ui("session") : fmt(ui("pack"), { n: p.n })) + "</small>";
        b.addEventListener("click", function () { if (calcIdx !== i) { calcIdx = i; renderCalc(); } });
        box.appendChild(b);
      });
    }
    $$(".pack", box).forEach(function (b, i) { b.setAttribute("aria-pressed", String(i === calcIdx)); });
    var p = packs[calcIdx];
    var per = p.total / p.n;
    var base = packs[0].total;
    tweenPer(per);
    $("#calc-total").textContent = fmt(ui("total"), { t: p.total });
    var save = base * p.n - p.total;
    $("#calc-save").textContent = save > 0 ? fmt(ui("save"), { s: save }) : "";
    $("#calc-cond").textContent = p.cond ? ui(p.cond) : "";
    var ratio = per / base, pct = Math.round((1 - ratio) * 100);
    $("#cm-fill").style.transform = "scaleX(" + ratio.toFixed(3) + ")";
    $("#cm-save").style.transform = "scaleX(" + (1 - ratio).toFixed(3) + ")";
    $("#cm-pct").textContent = pct > 0 ? fmt(ui("pctLess"), { p: pct }) : ui("pctSame");
    var dots = $("#cm-dots");
    dots.textContent = "";
    for (var i = 0; i < p.n; i++) { var d = doc.createElement("span"); d.className = "cm-dot"; d.style.animationDelay = (i * 0.05).toFixed(2) + "s"; dots.appendChild(d); }
    $("#calc-live").textContent = fmt(ui("calcLive"), { p: money(per, true), t: fmt(ui("total"), { t: p.total }), s: save > 0 ? fmt(ui("save"), { s: save }) : "" });
  }
  $$(".calc-tab").forEach(function (b) {
    b.addEventListener("click", function () {
      calcKind = b.getAttribute("data-calc"); calcIdx = 0;
      $$(".calc-tab").forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
      renderCalc();
    });
  });
  $("#calc-cta").addEventListener("click", function () {
    var p = D.packs[calcKind][calcIdx];
    var label = (p.n === 1 ? ui("session") : fmt(ui("pack"), { n: p.n })) + " · " + (lang === "en" ? "€" + p.total : p.total + " €");
    if (calcKind === "dren") prefillBooking({ type: "otro", service: 2, msg: ui("packMsg") + label });
    else prefillBooking({ type: "fisio", msg: p.n > 1 ? ui("packMsg") + label : "" });
  });
  renderCalc();
  langHooks.push(renderCalc);

  /* price table: mobile labels from the header row */
  function tableLabels() {
    var heads = $$(".price-table thead th").map(function (th) { return th.textContent.replace(/\d$/, "").trim(); });
    $$(".price-table tbody tr").forEach(function (tr) {
      $$("td", tr).forEach(function (td, i) { td.setAttribute("data-label", heads[i + 1] || ""); });
    });
  }
  yield;
  tableLabels();
  langHooks.push(tableLabels);

  yield;
  /* ---------- Booking ---------- */
  var form = $("#booking");
  var steps = $$(".bk-step", form);
  var prog = $$(".bk-progress li", form);
  var svcSel = $("#bk-service");
  var state = { step: 1, type: "fisio", service: 0, date: null, time: null };
  var dates = [];
  (function buildDates() {
    var d = new Date();
    d.setHours(12, 0, 0, 0);
    while (dates.length < 10) {
      d.setDate(d.getDate() + 1);
      if (d.getDay() >= 1 && d.getDay() <= 5) dates.push(new Date(d));
    }
  })();
  var SLOTS = { morning: ["9:30", "10:30", "11:30", "12:30"], afternoon: ["17:00", "18:00", "19:00", "20:00"] };

  function renderService() {
    var list = D.services[state.type];
    $("#bk-service-wrap").hidden = !list;
    svcSel.textContent = "";
    if (!list) return;
    list.forEach(function (s, i) {
      var o = doc.createElement("option");
      o.value = String(i);
      o.textContent = lang === "en" ? s[1] : s[0];
      if (i === state.service) o.selected = true;
      svcSel.appendChild(o);
    });
  }
  svcSel.addEventListener("change", function () { state.service = parseInt(svcSel.value, 10) || 0; });
  $$('input[name="type"]', form).forEach(function (r) {
    r.addEventListener("change", function () {
      state.type = r.value; state.service = 0; state.time = null;
      renderService(); renderDates(); renderTimes();
    });
  });
  function dateLabel(d) { return ui("wd")[d.getDay()] + " " + d.getDate() + " " + ui("months")[d.getMonth()]; }
  function radioKeys(container, selector) {
    container.addEventListener("keydown", function (e) {
      var items = $$(selector, container);
      var i = items.indexOf(doc.activeElement);
      if (i < 0) return;
      var n = null;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") n = (i + 1) % items.length;
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") n = (i - 1 + items.length) % items.length;
      if (n !== null) { e.preventDefault(); items[n].focus(); items[n].click(); }
    });
  }
  function renderDates() {
    var box = $("#bk-dates");
    var hadFocus = box.contains(doc.activeElement);
    box.textContent = "";
    dates.forEach(function (d, i) {
      var b = doc.createElement("button");
      b.type = "button";
      b.className = "bk-date";
      b.setAttribute("role", "radio");
      var on = state.date === i;
      b.setAttribute("aria-checked", String(on));
      b.setAttribute("tabindex", on || (state.date === null && i === 0) ? "0" : "-1");
      b.setAttribute("aria-label", dateLabel(d));
      b.innerHTML = '<small aria-hidden="true">' + ui("wd")[d.getDay()] + '</small><strong aria-hidden="true">' + d.getDate() + '</strong><span aria-hidden="true">' + ui("months")[d.getMonth()] + "</span>";
      b.addEventListener("click", function () {
        if (state.date !== i) state.time = state.type === "pilates" ? null : state.time;
        state.date = i; renderDates(); renderTimes(); $("#bk-err2").hidden = true;
      });
      box.appendChild(b);
    });
    if (hadFocus) { var f = $('.bk-date[tabindex="0"]', box); if (f) f.focus(); }
  }
  function renderTimes() {
    var box = $("#bk-times");
    var hadFocus = box.contains(doc.activeElement);
    box.textContent = "";
    var opts = [];
    if (state.type === "pilates") {
      if (state.date === null) return;
      var wd = dates[state.date].getDay() - 1;
      var cl = D.classes.filter(function (c) { return c.day === wd; });
      if (!cl.length) { box.innerHTML = "<p>" + ui("noClasses") + "</p>"; return; }
      cl.forEach(function (c) { opts.push({ v: c.t, label: c.t, sub: tx(c) + " · " + ui("levels")[c.lv] }); });
    } else {
      ["morning", "afternoon"].forEach(function (k) {
        opts.push({ head: ui(k) });
        SLOTS[k].forEach(function (s) { opts.push({ v: s, label: s }); });
      });
    }
    var firstFocusable = true;
    opts.forEach(function (o) {
      if (o.head) { var h = doc.createElement("h4"); h.textContent = o.head; h.setAttribute("aria-hidden", "true"); box.appendChild(h); return; }
      var b = doc.createElement("button");
      b.type = "button";
      b.className = "bk-time";
      b.setAttribute("role", "radio");
      var on = state.time === o.v;
      b.setAttribute("aria-checked", String(on));
      b.setAttribute("tabindex", on || (!state.time && firstFocusable) ? "0" : "-1");
      firstFocusable = false;
      b.innerHTML = esc(o.label) + (o.sub ? "<small>" + esc(o.sub) + "</small>" : "");
      b.addEventListener("click", function () {
        state.time = o.v; renderTimes(); $("#bk-err2").hidden = true;
      });
      box.appendChild(b);
    });
    if (hadFocus) { var f = $('.bk-time[tabindex="0"]', box); if (f) f.focus(); }
  }
  radioKeys($("#bk-dates"), ".bk-date");
  radioKeys($("#bk-times"), ".bk-time");

  function goStep(n, focus) {
    state.step = n;
    steps.forEach(function (s) {
      var on = parseInt(s.getAttribute("data-step"), 10) === n;
      s.hidden = !on; s.classList.toggle("is-active", on);
    });
    prog.forEach(function (li, i) { li.classList.toggle("is-on", i < n); });
    $(".bk-progress", form).setAttribute("data-step", String(n));
    if (n === 3) updateSend();
    if (focus !== false) {
      var lg = $(".bk-step.is-active .bk-legend", form);
      lg.setAttribute("tabindex", "-1"); lg.focus({ preventScroll: true });
      var top = form.getBoundingClientRect().top;
      if (top < 0 || top > window.innerHeight * 0.5) form.scrollIntoView({ behavior: reduce.matches ? "auto" : "smooth", block: "start" });
    }
  }
  $$(".bk-next", form).forEach(function (b) {
    b.addEventListener("click", function () {
      if (state.step === 1) { renderDates(); renderTimes(); goStep(2); return; }
      if (state.step === 2) {
        if (state.date === null || !state.time) { $("#bk-err2").hidden = false; return; }
        goStep(3);
      }
    });
  });
  $$(".bk-back", form).forEach(function (b) { b.addEventListener("click", function () { goStep(state.step - 1); }); });

  var nameIn = $("#bk-name"), phoneIn = $("#bk-phone"), zoneIn = $("#bk-zone"), msgIn = $("#bk-msg");
  var touched = { name: false, phone: false };
  function validName() { return nameIn.value.trim().length >= 2; }
  function validPhone() { return phoneIn.value.replace(/\D/g, "").length >= 9; }
  function showErr(input, errId, ok, force) {
    var show = !ok && force;
    $("#" + errId).hidden = !show;
    if (show) input.setAttribute("aria-invalid", "true"); else input.removeAttribute("aria-invalid");
  }
  nameIn.addEventListener("blur", function () { touched.name = true; showErr(nameIn, "bk-name-err", validName(), true); });
  phoneIn.addEventListener("blur", function () { touched.phone = true; showErr(phoneIn, "bk-phone-err", validPhone(), true); });
  [nameIn, phoneIn, zoneIn, msgIn].forEach(function (el) {
    el.addEventListener("input", function () {
      if (el === nameIn && validName()) showErr(nameIn, "bk-name-err", true, false);
      if (el === phoneIn && validPhone()) showErr(phoneIn, "bk-phone-err", true, false);
      updateSend();
    });
  });

  function serviceName() {
    var list = D.services[state.type];
    if (state.type === "pilates") {
      var wd = state.date !== null ? dates[state.date].getDay() - 1 : -1;
      var c = D.classes.filter(function (x) { return x.day === wd && x.t === state.time; })[0];
      return ui("typeNames").pilates + (c ? " · " + tx(c) + " (" + ui("levels")[c.lv] + ")" : "");
    }
    return list ? (lang === "en" ? list[state.service][1] : list[state.service][0]) : ui("typeNames")[state.type];
  }
  function rows() {
    var r = [[ui("sumType"), serviceName()]];
    if (state.date !== null) r.push([ui("sumDay"), dateLabel(dates[state.date])]);
    if (state.time) r.push([ui("sumTime"), state.time]);
    if (nameIn.value.trim()) r.push([ui("sumName"), nameIn.value.trim()]);
    if (phoneIn.value.trim()) r.push([ui("sumPhone"), phoneIn.value.trim()]);
    if (zoneIn.value.trim()) r.push([ui("sumZone"), zoneIn.value.trim()]);
    if (msgIn.value.trim()) r.push([ui("sumMsg"), msgIn.value.trim()]);
    return r;
  }
  function message() {
    return ui("msgHello") + "\n" + rows().map(function (x) { return "• " + x[0] + ": " + x[1]; }).join("\n") + "\n" + ui("msgFoot");
  }
  var waBtn = $("#bk-wa"), mailBtn = $("#bk-mail");
  function updateSend() {
    $("#bk-summary").innerHTML = "<dl>" + rows().map(function (x) { return "<dt>" + esc(x[0]) + "</dt><dd>" + esc(x[1]) + "</dd>"; }).join("") + "</dl>";
    var ok = validName() && validPhone();
    var m = message();
    waBtn.href = "https://wa.me/" + WA + "?text=" + encodeURIComponent(m);
    mailBtn.href = "mailto:" + MAIL + "?subject=" + encodeURIComponent(ui("mailSubject") + " · " + nameIn.value.trim()) + "&body=" + encodeURIComponent(m);
    [waBtn, mailBtn].forEach(function (b) { b.classList.toggle("is-disabled", !ok); b.setAttribute("aria-disabled", String(!ok)); });
  }
  [waBtn, mailBtn].forEach(function (b) {
    b.addEventListener("click", function (e) {
      if (validName() && validPhone()) return;
      e.preventDefault();
      showErr(nameIn, "bk-name-err", validName(), true);
      showErr(phoneIn, "bk-phone-err", validPhone(), true);
      (validName() ? phoneIn : nameIn).focus();
    });
  });

  function prefillBooking(o) {
    fullLayout();
    state.type = o.type || "fisio";
    state.service = o.service || 0;
    $$('input[name="type"]', form).forEach(function (r) { r.checked = r.value === state.type; });
    renderService();
    if (o.zone != null) zoneIn.value = o.zone ? ui("bmCtaZone") + o.zone : zoneIn.value;
    if (o.msg) msgIn.value = o.msg;
    if (o.day != null) {
      var idx = -1;
      for (var i = 0; i < dates.length; i++) if (dates[i].getDay() - 1 === o.day) { idx = i; break; }
      state.date = idx >= 0 ? idx : null;
      state.time = o.time || null;
      renderDates(); renderTimes();
      goStep(2, false);
    } else {
      renderDates(); renderTimes();
      goStep(1, false);
    }
    setTimeout(function () {
      var lg = $(".bk-step.is-active .bk-legend", form);
      lg.setAttribute("tabindex", "-1"); lg.focus({ preventScroll: true });
    }, reduce.matches ? 0 : 500);
    if (o.day != null) {
      $("#cita").scrollIntoView({ behavior: reduce.matches ? "auto" : "smooth", block: "start" });
    }
  }
  $$("[data-prefill]").forEach(function (a) {
    a.addEventListener("click", function () { prefillBooking({ type: a.getAttribute("data-prefill") }); });
  });
  yield;
  renderService(); renderDates(); renderTimes();
  langHooks.push(function () { renderService(); renderDates(); renderTimes(); if (state.step === 3) updateSend(); });

  yield;
  /* ---------- Open now (Europe/Madrid, Google hours) ---------- */
  var HOURS = [[570, 810], [1020, 1260]]; // 9:30–13:30, 17:00–21:00, Mon–Fri
  var madridFmt = null;
  function madridNow() {
    try {
      madridFmt = madridFmt || new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Madrid", weekday: "short", hour: "2-digit", minute: "2-digit", hour12: false });
      var parts = madridFmt.formatToParts(new Date());
      var o = {}; parts.forEach(function (p) { o[p.type] = p.value; });
      var wd = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(o.weekday);
      return { wd: wd, m: (parseInt(o.hour, 10) % 24) * 60 + parseInt(o.minute, 10) };
    } catch (e) { var d = new Date(); return { wd: d.getDay(), m: d.getHours() * 60 + d.getMinutes() }; }
  }
  function hhmm(m) { return Math.floor(m / 60) + ":" + ("0" + (m % 60)).slice(-2); }
  function renderOpen() {
    var n = madridNow();
    var weekday = n.wd >= 1 && n.wd <= 5;
    var openRange = weekday && HOURS.filter(function (r) { return n.m >= r[0] && n.m < r[1]; })[0];
    var el = $("#open-now");
    el.classList.toggle("is-open", !!openRange);
    var txt;
    if (openRange) txt = fmt(ui("openNow"), { t: hhmm(openRange[1]) });
    else {
      var next = null, dayWord;
      if (weekday) next = HOURS.filter(function (r) { return n.m < r[0]; })[0];
      if (next) dayWord = ui("today");
      else {
        var nd = (n.wd + 1) % 7; var add = 1;
        while (nd === 0 || nd === 6) { nd = (nd + 1) % 7; add++; }
        dayWord = add === 1 ? ui("tomorrow") : ui("wd")[nd];
        next = HOURS[0];
      }
      txt = fmt(ui("closedNow"), { d: dayWord, t: hhmm(next[0]) });
    }
    $("#open-text").textContent = txt;
  }
  // the time-zone formatter is costly to build, so it waits until the contact block is close
  inView($("#contacto"), function () { renderOpen(); setInterval(renderOpen, 60000); }, { rootMargin: "800px 0px" });
  langHooks.push(renderOpen);

  yield;
  /* ---------- Map facade ---------- */
  $("#map-load").addEventListener("click", function () {
    var f = doc.createElement("iframe");
    f.src = "https://www.openstreetmap.org/export/embed.html?bbox=-4.5600%2C36.7240%2C-4.5410%2C36.7330&layer=mapnik&marker=36.72857%2C-4.55074";
    f.title = lang === "en" ? "Map showing Fisioterapia Campanillas, C/ Jacob 18, Campanillas" : "Mapa con la ubicación de Fisioterapia Campanillas, C/ Jacob 18, Campanillas";
    f.setAttribute("referrerpolicy", "no-referrer");
    f.setAttribute("loading", "lazy");
    var fac = $("#map-facade");
    $(".map-overlay", fac).remove();
    fac.appendChild(f);
    f.setAttribute("tabindex", "0");
    f.focus();
  });

  }

  /* ---------- Start ---------- */
  var stored = null;
  try { stored = localStorage.getItem("fc-lang"); } catch (e) {}
  if (stored === "en") applyLang("en");
  var started = false;
  function start() {
    if (started) return; started = true;
    // run the widgets in short slices so no single task blocks input
    var gen = initRest();
    (function pump() { var t0 = performance.now(); var r; do { r = gen.next(); } while (!r.done && performance.now() - t0 < 8); if (r.done) onScroll(); else setTimeout(pump, 0); })();
  }
  if ("requestIdleCallback" in window) requestIdleCallback(start, { timeout: 1500 });
  else setTimeout(start, 200);
  // anyone who scrolls or taps before idle gets the widgets immediately
  ["scroll", "pointerdown", "keydown"].forEach(function (ev) { window.addEventListener(ev, start, { once: true, passive: true }); });
})();
