/* Abysub concept · dive-site map (SVG, no third-party tiles) */
(function () {
  "use strict";
  function init() {
  var NS = "http://www.w3.org/2000/svg";
  var LON0 = -5.75, LAT0 = 36.87, KX = 1000 / 2.2, KY = KX / Math.cos(36.4 * Math.PI / 180);
  function P(lat, lon) { return [(lon - LON0) * KX, (LAT0 - lat) * KY]; }

  var COAST = [[36.08,-5.75],[36.04,-5.68],[36.015,-5.62],[36.005,-5.605],[36.03,-5.56],[36.06,-5.5],[36.08,-5.45],[36.13,-5.44],[36.18,-5.42],[36.17,-5.37],[36.14,-5.355],[36.11,-5.345],[36.14,-5.34],[36.16,-5.345],[36.22,-5.31],[36.29,-5.27],[36.36,-5.22],[36.42,-5.15],[36.46,-5.06],[36.48,-4.99],[36.505,-4.9],[36.508,-4.88],[36.5,-4.8],[36.485,-4.74],[36.49,-4.68],[36.52,-4.63],[36.54,-4.615],[36.58,-4.55],[36.595,-4.515],[36.62,-4.49],[36.66,-4.46],[36.7,-4.43],[36.72,-4.38],[36.72,-4.3],[36.715,-4.2],[36.73,-4.12],[36.745,-4.08],[36.74,-3.98],[36.74,-3.93],[36.745,-3.87],[36.755,-3.82],[36.74,-3.78],[36.735,-3.755],[36.742,-3.74],[36.722,-3.728],[36.73,-3.7],[36.725,-3.66],[36.72,-3.6],[36.72,-3.55]];
  var TOWNS = [
    { n: "Tarifa", ll: [36.013, -5.605], dx: 4, dy: -14, a: "middle", major: 1 },
    { n: "Gibraltar", ll: [36.14, -5.35], dx: 10, dy: 22, a: "start" },
    { n: "Estepona", ll: [36.425, -5.147], dx: -8, dy: -12, a: "end" },
    { n: "Marbella", ll: [36.508, -4.885], dx: 0, dy: -14, a: "middle", major: 1 },
    { n: "Málaga", ll: [36.72, -4.42], dx: 0, dy: -14, a: "middle", major: 1 },
    { n: "Nerja", ll: [36.745, -3.875], dx: -4, dy: -14, a: "middle", major: 1 },
    { n: "Almuñécar", ll: [36.733, -3.69], dx: 4, dy: -14, a: "middle" }
  ];
  var BASE = { ll: [36.539, -4.62] };
  var SITES = [
    { id: "fuengirola", zone: "malaga", ll: [36.524, -4.612], lab: [0, 30, "middle"],
      es: { n: "Arrecife del puerto viejo", z: "Fuengirola · Costa del Sol", d: "El arrecife del antiguo puerto de Fuengirola, junto a nuestra base del local 51." },
      en: { n: "Old port reef", z: "Fuengirola · Costa del Sol", d: "The reef of Fuengirola's old port, right next to our base at local 51." } },
    { id: "mineral", zone: "malaga", ll: [36.493, -4.9], lab: [0, 28, "middle"],
      es: { n: "Torre Mineral", z: "Marbella · Costa del Sol", d: "La Torre Mineral de Marbella, una de las inmersiones de la Costa del Sol." },
      en: { n: "Mineral Tower", z: "Marbella · Costa del Sol", d: "Marbella's Mineral Tower, one of the Costa del Sol dives." } },
    { id: "mona", zone: "granada", ll: [36.712, -3.727], lab: [-10, 32, "end"],
      es: { n: "Marina del Este · Punta de la Mona", z: "Almuñécar · Granada", d: "Marina del Este y la Punta de la Mona, en la costa de Granada." },
      en: { n: "Marina del Este · Punta de la Mona", z: "Almuñécar · Granada", d: "Marina del Este and Punta de la Mona, on the Granada coast." } },
    { id: "picos", zone: "granada", ll: [36.726, -3.757], lab: [-14, 8, "end"],
      es: { n: "Los «3 picos»", z: "La Herradura · Granada", d: "Los «3 picos» de La Herradura, en la costa de Granada." },
      en: { n: "The “3 peaks”", z: "La Herradura · Granada", d: "La Herradura's “3 peaks”, on the Granada coast." } },
    { id: "tarifa", zone: "estrecho", ll: [35.99, -5.585], lab: [16, 6, "start"],
      es: { n: "Tarifa", z: "Estrecho de Gibraltar", d: "Tarifa, donde se encuentran el Atlántico y el Mediterráneo." },
      en: { n: "Tarifa", z: "Strait of Gibraltar", d: "Tarifa, where the Atlantic meets the Mediterranean." } }
  ];

  var svg = document.getElementById("mapSvg"); if (!svg) return;
  var mapEl = document.getElementById("map");
  var lang = function () { return window.ABY ? window.ABY.lang() : "es"; };
  function el(tag, attrs, parent) { var e = document.createElementNS(NS, tag); for (var k in attrs) e.setAttribute(k, attrs[k]); if (parent) parent.appendChild(e); return e; }
  function f(n) { return n.toFixed(1); }

  /* land + schematic contour lines */
  var pts = COAST.map(function (c) { return P(c[0], c[1]); });
  var line = pts.map(function (p, i) { return (i ? "L" : "M") + f(p[0]) + " " + f(p[1]); }).join("");
  document.getElementById("mapLand").setAttribute("d", line + "L1000 0L0 0Z");
  var iso = document.getElementById("mapIso");
  [10, 24, 44].forEach(function (o) { el("path", { d: pts.map(function (p, i) { return (i ? "L" : "M") + f(p[0]) + " " + f(p[1] + o); }).join(""), class: "iso" }, iso); });

  var towns = document.getElementById("mapTowns");
  TOWNS.forEach(function (t) {
    var p = P(t.ll[0], t.ll[1]);
    el("circle", { cx: f(p[0]), cy: f(p[1]), r: 2.4 }, towns);
    var tx = el("text", { x: f(p[0] + t.dx), y: f(p[1] + t.dy), "text-anchor": t.a, class: t.major ? "major" : "" }, towns);
    tx.textContent = t.n;
  });
  var seaLab = el("text", { x: 560, y: 440, "text-anchor": "middle", class: "sea-lab" }, towns);

  /* pins */
  var pinsG = document.getElementById("mapPins"), route = document.getElementById("mapRoute");
  var bp = P(BASE.ll[0], BASE.ll[1]);
  var base = el("g", { class: "pin base", transform: "translate(" + f(bp[0]) + " " + f(bp[1]) + ")", "aria-hidden": "true" }, pinsG);
  el("rect", { x: -6, y: -6, width: 12, height: 12, rx: 2, class: "core", transform: "rotate(45)" }, base);
  var bt = el("text", { x: 0, y: -16, "text-anchor": "middle" }, base); bt.textContent = "Abysub";

  var list = document.getElementById("siteList");
  var pins = {}, items = {}, active = null;
  SITES.forEach(function (s) {
    var p = P(s.ll[0], s.ll[1]); s.p = p;
    var g = el("g", { class: "pin", tabindex: "0", role: "button", transform: "translate(" + f(p[0]) + " " + f(p[1]) + ")" }, pinsG);
    el("circle", { r: 9, class: "ring" }, g);
    el("circle", { r: 22, class: "hit" }, g);
    el("circle", { r: 6.5, class: "core" }, g);
    var t = el("text", { x: s.lab[0], y: s.lab[1], "text-anchor": s.lab[2] }, g);
    g.addEventListener("click", function () { select(s.id, true); });
    g.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); select(s.id, true); } });
    pins[s.id] = { g: g, t: t, s: s };
    var li = document.createElement("li");
    var b = document.createElement("button"); b.type = "button";
    b.innerHTML = '<span class="sl-n"></span><span class="sl-z"></span>';
    b.addEventListener("click", function () { select(s.id, true); });
    li.appendChild(b); list.appendChild(li);
    items[s.id] = { li: li, b: b };
  });

  function km(a, b) {
    var R = 6371, toR = Math.PI / 180, dLat = (b[0] - a[0]) * toR, dLon = (b[1] - a[1]) * toR;
    var h = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(a[0] * toR) * Math.cos(b[0] * toR) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return 2 * R * Math.asin(Math.sqrt(h));
  }
  function labels() {
    var L = lang();
    SITES.forEach(function (s) {
      var t = s[L];
      pins[s.id].t.textContent = t.n;
      pins[s.id].g.setAttribute("aria-label", t.n + ", " + t.z);
      items[s.id].b.querySelector(".sl-n").textContent = t.n;
      items[s.id].b.querySelector(".sl-z").textContent = t.z.split(" · ")[0];
    });
    seaLab.textContent = L === "en" ? "MEDITERRANEAN SEA" : "MAR MEDITERRÁNEO";
    if (active) fill(active, false);
  }
  var card = document.getElementById("siteCard");
  function fill(id, anim) {
    var s = pins[id].s, t = s[lang()];
    document.getElementById("scZone").textContent = t.z;
    document.getElementById("scName").textContent = t.n;
    document.getElementById("scDesc").textContent = t.d;
    var d = km(BASE.ll, s.ll);
    document.getElementById("scDist").textContent = d < 3 ? (lang() === "en" ? "next door" : "al lado") : "≈ " + Math.round(d) + " km";
    if (anim) { card.classList.remove("swap"); void card.offsetWidth; card.classList.add("swap"); }
  }
  var scroller = document.getElementById("mapScroll");
  var sheet = document.getElementById("mapSheet"), lastFocus = null;
  function isSmall() { return mapEl.classList.contains("small"); }
  function centerOn(id, smooth) {
    if (!isSmall()) return;
    var x = pins[id].s.p[0] / 1000 * svg.clientWidth - scroller.clientWidth / 2;
    scroller.scrollTo({ left: Math.max(0, x), behavior: smooth ? "smooth" : "auto" });
  }
  function sheetFill() {
    if (!active) return;
    var s = pins[active].s, t = s[lang()], d = km(BASE.ll, s.ll);
    document.getElementById("shZone").textContent = t.z;
    document.getElementById("shName").textContent = t.n;
    document.getElementById("shDist").textContent = d < 3 ? (lang() === "en" ? "next door" : "al lado") : "≈ " + Math.round(d) + " km";
  }
  function openSheet() { sheetFill(); lastFocus = document.activeElement; sheet.hidden = false; }
  function closeSheet(restore) { if (sheet.hidden) return; sheet.hidden = true; if (restore && lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true }); }
  document.getElementById("shClose").addEventListener("click", function () { closeSheet(true); });
  document.getElementById("shMore").addEventListener("click", function () { closeSheet(false); card.scrollIntoView({ behavior: "smooth", block: "center" }); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeSheet(true); });
  scroller.addEventListener("scroll", function () { mapEl.classList.add("panned"); }, { passive: true, once: true });

  function select(id, user) {
    active = id;
    Object.keys(pins).forEach(function (k) {
      pins[k].g.classList.toggle("active", k === id);
      pins[k].g.setAttribute("aria-pressed", String(k === id));
      items[k].b.setAttribute("aria-pressed", String(k === id));
    });
    var s = pins[id].s, cx = (bp[0] + s.p[0]) / 2, cy = Math.max(bp[1], s.p[1]) + Math.abs(s.p[0] - bp[0]) * 0.18 + 20;
    route.setAttribute("d", "M" + f(bp[0]) + " " + f(bp[1]) + "Q" + f(cx) + " " + f(cy) + " " + f(s.p[0]) + " " + f(s.p[1]));
    route.classList.toggle("on", Math.abs(s.p[0] - bp[0]) > 20);
    pinsG.appendChild(pins[id].g);
    fill(id, true);
    if (user && isSmall()) { centerOn(id, true); openSheet(); }
  }

  /* zone filter */
  document.querySelectorAll(".map-filters .chip").forEach(function (c) {
    c.addEventListener("click", function () {
      var z = c.dataset.zone;
      document.querySelectorAll(".map-filters .chip").forEach(function (x) { x.setAttribute("aria-pressed", String(x === c)); });
      var first = null;
      SITES.forEach(function (s) {
        var on = z === "all" || s.zone === z;
        pins[s.id].g.classList.toggle("dim", !on);
        items[s.id].li.hidden = !on;
        if (on && !first) first = s.id;
      });
      if (first && (z !== "all" && pins[active].s.zone !== z)) { select(first); centerOn(first, true); }
    });
  });

  /* keep labels/tap areas legible when the map is scaled down */
  var scaleBar = mapEl.querySelector(".scale-bar");
  function fit() {
    mapEl.classList.toggle("small", mapEl.clientWidth < 640);
    var w = svg.clientWidth || 1000, k = Math.max(1, 1000 / w);
    svg.style.setProperty("--k", k.toFixed(3));
    var m = Math.min(k, 2.4);
    SITES.forEach(function (s) {
      var g = pins[s.id].g;
      g.querySelector(".hit").setAttribute("r", (22 * k).toFixed(1));
      g.querySelector(".core").setAttribute("r", (6.5 * m).toFixed(1));
      g.querySelector(".ring").setAttribute("r", (9 * m).toFixed(1));
      pins[s.id].t.setAttribute("x", (s.lab[0] * m).toFixed(1)); pins[s.id].t.setAttribute("y", (s.lab[1] * m).toFixed(1));
    });
    base.setAttribute("transform", "translate(" + f(bp[0]) + " " + f(bp[1]) + ") scale(" + m.toFixed(2) + ")");
    scaleBar.style.width = (w * (20 / (111.32 * Math.cos(36.4 * Math.PI / 180))) * KX / 1000).toFixed(1) + "px";
  }
  window.addEventListener("resize", fit);

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (en) { mapEl.classList.toggle("live", en[0].isIntersecting); if (!en[0].isIntersecting) closeSheet(false); }).observe(mapEl);
  }
  labels(); fit(); select("fuengirola"); centerOn("fuengirola", false);
  if (window.ABY) window.ABY.onLang(function () { labels(); sheetFill(); });
  }
  /* build only when the section comes within ~1.5 screens */
  var host = document.getElementById("puntos");
  if (!host || !("IntersectionObserver" in window)) { init(); return; }
  var io = new IntersectionObserver(function (en) { if (en[0].isIntersecting) { io.disconnect(); init(); } }, { rootMargin: "150% 0px" });
  io.observe(host);
})();
