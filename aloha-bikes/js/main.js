(function () {
  "use strict";
  var RM = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var WA = "34952811652";
  var MAIL = "alohabikesmarbella@gmail.com";
  var lang = "es";
  try { if (localStorage.getItem("ab-lang") === "en") lang = "en"; } catch (e) {}
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var L = function (o) { return o[lang] || o.es; };
  var fmt = function (n, d) { return n.toLocaleString(lang === "es" ? "es-ES" : "en-GB", { minimumFractionDigits: d || 0, maximumFractionDigits: d || 0 }); };

  /* ---------------- Data ---------------- */
  var BIKES = {
    defy: { name: "Giant Defy", rate: 22, img: "roadw",
      kicker: { es: "Carretera", en: "Road" },
      desc: { es: "Para quien viene a hacer kilómetros: puertos, costa y salidas largas sin facturar tu bici en el avión.", en: "For riders here to put in the miles: climbs, coast and long rides without checking your bike onto the plane." },
      forr: { es: "Ciclistas de carretera", en: "Road cyclists" },
      alt: { es: "Ciclista de carretera rodando por una carretera junto a las dunas", en: "Road cyclist riding along a road by the dunes" },
      notes: [
        { k: "bar", d: [56, -64], t: { es: "Manillar de curva", en: "Drop handlebar" } },
        { k: "saddle", d: [-70, -44], t: { es: "Posición deportiva", en: "Sporty position" } },
        { k: "tyreLow", d: [-30, 36], t: { es: "Ruedas finas · asfalto", en: "Slim tyres · tarmac" } }
      ] },
    roam: { name: "Giant Roam", rate: 15, img: "palms",
      kicker: { es: "Híbrida", en: "Hybrid" },
      desc: { es: "Polivalente: cómoda en el paseo marítimo y capaz en carretera o pista suave.", en: "All-rounder: comfortable on the seafront and capable on roads or easy tracks." },
      forr: { es: "Paseo largo y pista suave", en: "Long rides and easy tracks" },
      alt: { es: "Ciclista por un paseo con palmeras junto a la playa", en: "Cyclist on a palm-lined promenade by the beach" },
      notes: [
        { k: "bar", d: [-30, -62], t: { es: "Manillar plano", en: "Flat handlebar" } },
        { k: "fork", d: [40, 92], t: { es: "Horquilla con suspensión", en: "Suspension fork" } },
        { k: "saddle", d: [-80, -40], t: { es: "Postura cómoda", en: "Comfortable posture" } }
      ] },
    argento: { name: "Giant Argento", rate: 15, img: "basket",
      kicker: { es: "Paseo", en: "City" },
      desc: { es: "Cuadro abierto y postura erguida para pasear sin prisa junto al mar.", en: "Step-through frame and upright posture for an unhurried ride by the sea." },
      forr: { es: "Paseo tranquilo", en: "Relaxed rides" },
      alt: { es: "Bicicleta de paseo con cesta aparcada junto a una playa", en: "City bike with a basket parked by a beach" },
      notes: [
        { k: "low", d: [40, -64], t: { es: "Cuadro abierto: fácil de subir", en: "Step-through: easy on and off" } },
        { k: "bar", d: [-30, -50], t: { es: "Espalda recta", en: "Upright back" } }
      ] },
    talon: { name: "Giant Talon", rate: 15, img: "mtb",
      kicker: { es: "Montaña", en: "Mountain" },
      desc: { es: "Rígida de montaña para las pistas y senderos de la sierra, a pocos minutos de la tienda.", en: "Hardtail mountain bike for the tracks and trails in the hills, minutes from the shop." },
      forr: { es: "Pistas y senderos", en: "Tracks and trails" },
      alt: { es: "Bicicleta de montaña en una pista de tierra", en: "Mountain bike on a dirt track" },
      notes: [
        { k: "fork", d: [40, 92], t: { es: "Horquilla de suspensión", en: "Suspension fork" } },
        { k: "tyre", d: [-20, -66], t: { es: "Neumático de tacos", en: "Knobbly tyres" } },
        { k: "rotor", d: [-40, -110], t: { es: "Frenos de disco", en: "Disc brakes" } }
      ] }
  };
  var ORDER = ["defy", "roam", "argento", "talon"];

  var ROUTES = [
    { km: 12, gain: 30,
      kicker: { es: "Llano · paseo y familia", en: "Flat · easy and family" },
      name: { es: "Puerto Banús por la costa", en: "Puerto Banús along the coast" },
      desc: { es: "Bajamos a Puerto Banús y seguimos junto al mar hacia Marbella. Plana, con brisa y con parada para un café frente a los barcos.", en: "Down to Puerto Banús, then along the sea towards Marbella. Flat, breezy, with a coffee stop facing the boats." },
      bike: { es: "Paseo o híbrida", en: "City or hybrid" },
      alt: [25, 22, 18, 12, 8, 6, 5, 6, 5, 4, 5, 6, 5, 4, 5, 6, 5, 4, 5, 6, 5] },
    { km: 15, gain: 330,
      kicker: { es: "Subida · montaña y vistas", en: "Climb · hills and views" },
      name: { es: "Subida a Istán", en: "The Istán climb" },
      desc: { es: "Remontamos el valle del río Verde hasta el pueblo blanco de Istán, con el embalse de La Concepción a la vista. Subida constante y tranquila.", en: "Up the Río Verde valley to the white village of Istán, with La Concepción reservoir in view. A steady, quiet climb." },
      bike: { es: "Carretera o híbrida", en: "Road or hybrid" },
      alt: [25, 35, 50, 70, 90, 110, 130, 150, 160, 155, 150, 170, 200, 230, 260, 290, 300] },
    { km: 19, gain: 300,
      kicker: { es: "Puerto · subida sostenida", en: "Climb · long and steady" },
      name: { es: "Subida a Ojén", en: "The Ojén climb" },
      desc: { es: "Cruzamos hacia Marbella y subimos por la carretera de Ojén hasta el pueblo, entre pinos y con el mar a la espalda.", en: "Across to Marbella, then up the Ojén road to the village, through the pines with the sea behind you." },
      bike: { es: "Carretera", en: "Road" },
      alt: [25, 20, 15, 12, 10, 10, 12, 10, 8, 10, 30, 70, 110, 150, 190, 225, 255, 280, 295] }
  ];

  var TX = {
    days: { es: function (n) { return n === 1 ? "1 día" : n + " días"; }, en: function (n) { return n === 1 ? "1 day" : n + " days"; } },
    empty: { es: "Añade al menos una bici.", en: "Add at least one bike." },
    shopPick: { es: "En tienda", en: "In store" },
    placeHotel: { es: "Nombre del hotel", en: "Hotel name" },
    placeVilla: { es: "Villa o urbanización", en: "Villa or development" },
    errBike: { es: "Elige al menos una bici para continuar.", en: "Choose at least one bike to continue." },
    errDates: { es: "Revisa las fechas: la devolución debe ser igual o posterior a la recogida.", en: "Check the dates: return must be on or after pickup." },
    errAddr: { es: "Indica el hotel o la dirección para la entrega.", en: "Add the hotel or address for delivery." },
    errSvc: { es: "Marca al menos un servicio.", en: "Tick at least one service." },
    daysHint: { es: function (n) { return n + (n === 1 ? " día de alquiler" : " días de alquiler") + " · cada día = 24 h"; }, en: function (n) { return n + (n === 1 ? " rental day" : " rental days") + " · each day = 24 h"; } },
    wd: { es: ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"], en: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] }
  };

  /* ---------------- i18n ---------------- */
  var hooks = [];
  function applyLang(l) {
    lang = l;
    var EN = window.I18N_EN || {};
    document.documentElement.lang = l;
    $$("[data-i18n]").forEach(function (el) {
      if (el.dataset.es === undefined) el.dataset.es = el.innerHTML;
      var k = el.getAttribute("data-i18n");
      el.innerHTML = l === "en" && EN[k] !== undefined ? EN[k] : el.dataset.es;
    });
    $$("[data-i18n-attr]").forEach(function (el) {
      el.getAttribute("data-i18n-attr").split(";").forEach(function (pair) {
        var p = pair.split(":"), attr = p[0], k = p[1], store = "es" + attr.replace(/[^a-z]/gi, "");
        if (el.dataset[store] === undefined) el.dataset[store] = el.getAttribute(attr) || "";
        el.setAttribute(attr, l === "en" && EN[k] !== undefined ? EN[k] : el.dataset[store]);
      });
    });
    if (!document.body.dataset.esTitle) { document.body.dataset.esTitle = document.title; document.body.dataset.esDesc = $('meta[name="description"]').content; }
    document.title = l === "en" ? EN._title : document.body.dataset.esTitle;
    $('meta[name="description"]').content = l === "en" ? EN._desc : document.body.dataset.esDesc;
    $$(".lang-btn").forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.lang === l)); });
    try { localStorage.setItem("ab-lang", l); } catch (e) {}
    hooks.forEach(function (h) { h(); });
  }
  $$(".lang-btn").forEach(function (b) { b.addEventListener("click", function () { if (b.dataset.lang !== lang) applyLang(b.dataset.lang); }); });

  /* ---------------- Header, menu, mobile bar ---------------- */
  var header = $(".site-header"), mbar = $(".mbar"), menuBtn = $(".menu-btn"), nav = $("#nav");
  var lastScrolled = null, lastBar = null;
  function onScrollHeader() {
    var y = window.scrollY;
    var s = y > 20;
    if (s !== lastScrolled) { header.classList.toggle("scrolled", s); lastScrolled = s; }
    var b = y > window.innerHeight * 0.6;
    if (b !== lastBar) { mbar.classList.toggle("show", b); lastBar = b; }
  }
  window.addEventListener("scroll", onScrollHeader, { passive: true });
  requestAnimationFrame(onScrollHeader);
  function closeMenu() { nav.classList.remove("open"); menuBtn.setAttribute("aria-expanded", "false"); }
  menuBtn.addEventListener("click", function () {
    var open = !nav.classList.contains("open");
    nav.classList.toggle("open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
    if (open) header.classList.add("scrolled");
  });
  nav.addEventListener("click", function (e) { if (e.target.closest("a")) closeMenu(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && nav.classList.contains("open")) { closeMenu(); menuBtn.focus(); } });

  /* ---------------- Reveal ---------------- */
  if ("IntersectionObserver" in window && !RM) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -8% 0px" });
    $$(".sec-head, .routes-intro").forEach(function (el) { el.classList.add("reveal", "stag"); });
    $$(".reveal, .timeline, .curtain").forEach(function (el) { io.observe(el); });
  } else { $$(".reveal, .timeline, .curtain").forEach(function (el) { el.classList.add("in"); }); }

  function initBelow() {
  /* ---------------- Fleet blueprint ---------------- */
  var builtBikes = {};
  function bikeData(k) {
    if (!builtBikes[k]) {
      var G = window.ABBikes.build(k);
      G.notes = BIKES[k].notes.map(function (n) { var an = G.anchors[n.k]; return { a: an, p: [an[0] + n.d[0], an[1] + n.d[1]], t: n.t }; });
      builtBikes[k] = G;
    }
    return builtBikes[k];
  }
  var bpSvg = $(".bp-svg"), bpNotes = $(".bp-notes"), bpBox = $(".bp"), curBike = null;
  // leader lines group
  var leaders = document.createElementNS("http://www.w3.org/2000/svg", "g");
  leaders.setAttribute("class", "leaders");
  bpSvg.appendChild(leaders);
  var angle = 0, angleIn = $("#bp-angle"), view = "plan", wiggled = false;
  function setAngle(a, user) {
    a = Math.max(-60, Math.min(60, Math.round(a / 15) * 15));
    if (user) bpBox.classList.add("dragged");
    if (a === angle || !curBike) return;
    angle = a;
    var g = $(".bike.on", bpSvg);
    if (g) { g.classList.remove("drawing"); g.innerHTML = a === 0 ? bikeData(curBike).svg : window.ABBikes.build(curBike, a).svg; }
    bpBox.classList.toggle("turned", a !== 0);
    angleIn.value = a; angleIn.setAttribute("aria-valuetext", a + "°");
  }
  angleIn.addEventListener("input", function () { setAngle(Number(angleIn.value), true); });
  (function () {
    var startX = 0, startA = 0, dragging = false;
    bpSvg.addEventListener("pointerdown", function (e) { dragging = true; startX = e.clientX; startA = angle; try { bpSvg.setPointerCapture(e.pointerId); } catch (er) {} });
    bpSvg.addEventListener("pointermove", function (e) { if (dragging) setAngle(startA + (e.clientX - startX) / 22 * 15, Math.abs(e.clientX - startX) > 6); });
    var end = function () { dragging = false; };
    bpSvg.addEventListener("pointerup", end); bpSvg.addEventListener("pointercancel", end);
  })();
  function wiggle() {
    if (RM || wiggled) return; wiggled = true;
    [15, 30, 45, 30, 15, 0].forEach(function (a, i) { setTimeout(function () { if (!bpBox.classList.contains("dragged")) setAngle(a); }, 1500 + i * 130); });
  }
  function photoSrc() { var b = BIKES[curBike], im = $("#bp-photo-img"); im.src = "img/" + b.img + "-800.webp"; im.srcset = "img/" + b.img + "-800.webp 800w, img/" + b.img + "-1600.webp 1600w"; im.sizes = "(min-width: 900px) 60vw, 100vw"; }
  $$(".bp-view button").forEach(function (bt) {
    bt.addEventListener("click", function () {
      view = bt.dataset.view;
      $$(".bp-view button").forEach(function (o) { o.setAttribute("aria-pressed", String(o === bt)); });
      if (view === "photo") photoSrc();
      bpBox.classList.toggle("photo", view === "photo");
    });
  });
  function placeNotes() {
    if (!curBike) return;
    var b = bikeData(curBike);
    var ctm = bpSvg.getScreenCTM(), box = bpBox.getBoundingClientRect();
    if (!ctm) return;
    var pt = bpSvg.createSVGPoint();
    var lis = $$("li", bpNotes);
    var small = box.width < 520;
    bpBox.classList.toggle("small", small);
    b.notes.forEach(function (n, i) {
      var q = small ? n.a : n.p;
      pt.x = q[0]; pt.y = q[1];
      var s = pt.matrixTransform(ctm);
      var li = lis[i]; if (!li) return;
      var x = s.x - box.left, y = s.y - box.top;
      var w = li.offsetWidth;
      if (small) { y = y < 44 ? y + 18 : y - 16; } else x = Math.max(w / 2 + 8, Math.min(box.width - w / 2 - 8, x));
      li.style.left = x + "px"; li.style.top = y + "px";
    });
  }
  function renderLegend(notes) {
    $("#bp-legend").innerHTML = notes.map(function (n, i) { return "<li><b>" + (i + 1) + "</b>" + L(n.t) + "</li>"; }).join("");
  }
  function selectBike(k, focus) {
    if (k === curBike) return;
    var b = BIKES[k];
    angle = 0; angleIn.value = 0; angleIn.setAttribute("aria-valuetext", "0°"); bpBox.classList.remove("turned");
    $$(".bike", bpSvg).forEach(function (g) { if (g.dataset.bike !== k && g.firstChild && g.dataset.bike === curBike) g.innerHTML = bikeData(curBike).svg; });
    $$(".fleet-tabs [role=tab]").forEach(function (t) {
      var on = t.dataset.bike === k;
      t.setAttribute("aria-selected", String(on)); t.tabIndex = on ? 0 : -1;
      if (on && focus) t.focus();
      if (on) $("#fleet-panel").setAttribute("aria-labelledby", t.id);
    });
    $$(".bike", bpSvg).forEach(function (g) {
      var on = g.dataset.bike === k;
      if (on && !g.firstChild) g.innerHTML = bikeData(k).svg;
      g.classList.toggle("on", on);
      g.classList.remove("drawing");
      if (on && !RM) { void g.getBBox(); g.classList.add("drawing"); }
    });
    $(".bp-model").textContent = b.name.toUpperCase();
    $(".bp-code").firstChild.nodeValue = "AB-0" + (ORDER.indexOf(k) + 1) + " / ";
    var notes = bikeData(k).notes;
    leaders.innerHTML = notes.map(function (n) { return '<g class="bike on"><line class="dim" x1="' + n.a[0] + '" y1="' + n.a[1] + '" x2="' + n.p[0] + '" y2="' + n.p[1] + '"/><circle class="fillc" cx="' + n.a[0] + '" cy="' + n.a[1] + '" r="3.5" style="fill:#FF7A50"/></g>'; }).join("");
    bpNotes.innerHTML = notes.map(function (n, i) { return "<li><b>" + (i + 1) + "</b><span>" + L(n.t) + "</span></li>"; }).join("");
    renderLegend(notes);
    var lis = $$("li", bpNotes);
    curBike = k;
    placeNotes();
    lis.forEach(function (li, i) { setTimeout(function () { li.classList.add("in"); }, RM ? 0 : 450 + i * 140); });
    var img = $("#fleet-img");
    var setImg = function () {
      img.src = "img/" + b.img + "-800.webp";
      img.srcset = "img/" + b.img + "-800.webp 800w, img/" + b.img + "-1600.webp 1600w";
      img.alt = L(b.alt);
      img.classList.remove("swap");
    };
    if (RM || !img.dataset.ready) { setImg(); img.dataset.ready = "1"; }
    else { img.classList.add("swap"); setTimeout(setImg, 220); }
    fleetCopy();
    if (view === "photo") photoSrc();
    wiggle();
  }
  function fleetCopy() {
    var b = BIKES[curBike];
    $("#fleet-kicker").textContent = L(b.kicker);
    $("#fleet-name").textContent = b.name;
    $("#fleet-desc").textContent = L(b.desc);
    $("#fleet-price").textContent = b.rate + " € / " + (lang === "es" ? "día" : "day");
    $("#fleet-for").textContent = L(b.forr);
    $("#fleet-img").alt = L(b.alt);
  }
  var tabs = $$(".fleet-tabs [role=tab]");
  tabs.forEach(function (t, i) {
    t.addEventListener("click", function () { selectBike(t.dataset.bike); });
    t.addEventListener("keydown", function (e) {
      var d = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
      if (e.key === "Home") { e.preventDefault(); selectBike(tabs[0].dataset.bike, true); }
      else if (e.key === "End") { e.preventDefault(); selectBike(tabs[tabs.length - 1].dataset.bike, true); }
      else if (d) { e.preventDefault(); selectBike(tabs[(i + d + tabs.length) % tabs.length].dataset.bike, true); }
    });
  });
  // draw the first bike only when the fleet comes into view
  (function () {
    var first = function () { selectBike("defy"); };
    if ("IntersectionObserver" in window && !RM) {
      var o = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { o.disconnect(); first(); } }, { threshold: 0.25 });
      o.observe(bpBox);
    } else first();
  })();
  window.addEventListener("resize", placeNotes);
  hooks.push(function () {
    if (!curBike) return;
    fleetCopy();
    var nb = bikeData(curBike).notes;
    $$("li span", bpNotes).forEach(function (sp, i) { sp.textContent = L(nb[i].t); });
    renderLegend(nb);
    placeNotes();
  });

  ric(initForms, { timeout: 2500 });
  }
  function initForms() {
  /* ---------------- Rental builder ---------------- */
  var qty = { defy: 0, roam: 0, argento: 0, talon: 0 };
  var rf = $("#rent-form"), from = $("#r-from"), to = $("#r-to");
  function iso(d) { return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }
  var today = new Date(); today.setHours(0, 0, 0, 0);
  var d1 = new Date(today); d1.setDate(d1.getDate() + 1);
  var d2 = new Date(today); d2.setDate(d2.getDate() + 3);
  from.min = iso(today); to.min = iso(today);
  from.value = iso(d1); to.value = iso(d2);
  function days() {
    var a = new Date(from.value + "T00:00"), b = new Date(to.value + "T00:00");
    if (isNaN(a) || isNaN(b) || b < a) return 0;
    return Math.max(1, Math.round((b - a) / 864e5));
  }
  function delivery() { return ($("input[name=delivery]:checked", rf) || {}).value || "hotel"; }
  var odo = $("#odo"), odoSr = $("#odo-sr");
  function setOdo(n) {
    var s = String(n), cols = $$(".d", odo);
    if (cols.length !== s.length) {
      odo.innerHTML = s.split("").map(function () { return '<span class="d"><span>' + "0123456789".split("").map(function (c) { return "<i>" + c + "</i>"; }).join("") + "</span></span>"; }).join("") + '<span class="cur">€</span>';
      cols = $$(".d", odo);
    }
    s.split("").forEach(function (c, i) { cols[i].firstChild.style.transform = "translateY(" + (-Number(c) * 10) + "%)"; });
    odoSr.textContent = (lang === "es" ? "Total orientativo: " : "Estimated total: ") + n + " €";
  }
  function calc() {
    var n = days(), total = 0, lines = [];
    ORDER.forEach(function (k) {
      if (!qty[k]) return;
      var sub = qty[k] * BIKES[k].rate * n;
      total += sub;
      lines.push('<li><span>' + qty[k] + " × " + BIKES[k].name + " · " + L(TX.days)(n || 1) + "</span><b>" + fmt(sub) + " €</b></li>");
    });
    $("#ticket-lines").innerHTML = lines.length ? lines.join("") : '<li class="empty">' + L(TX.empty) + "</li>";
    $("#t-days").textContent = n ? String(n) : "—";
    var dv = delivery();
    var td = $("#t-delivery");
    if (dv === "shop") { td.textContent = L(TX.shopPick); td.classList.remove("ph"); }
    else { td.textContent = "[" + (lang === "es" ? "precio" : "price") + "]"; td.classList.add("ph"); }
    $("#r-days-hint").textContent = n ? L(TX.daysHint)(n) : "";
    $("#addr-fields").classList.toggle("off", dv === "shop");
    $("#r-place-label").textContent = L(dv === "villa" ? TX.placeVilla : TX.placeHotel);
    setOdo(total);
    $("#rent-mail").href = "mailto:" + MAIL + "?subject=" + encodeURIComponent(lang === "es" ? "Reserva de alquiler de bicis" : "Bike rental request") + "&body=" + encodeURIComponent(rentMsg());
    return total;
  }
  function nice(v) { var d = new Date(v + "T00:00"); return isNaN(d) ? v : d.toLocaleDateString(lang === "es" ? "es-ES" : "en-GB", { weekday: "short", day: "numeric", month: "short" }); }
  function rentMsg() {
    var n = days(), es = lang === "es", dv = delivery();
    var bikes = ORDER.filter(function (k) { return qty[k]; }).map(function (k) { return "- " + qty[k] + " × " + BIKES[k].name; }).join("\n");
    var place = $("#r-place").value.trim(), addr = $("#r-addr").value.trim(), name = $("#r-name").value.trim();
    var dvTxt = dv === "shop" ? (es ? "Recojo en tienda" : "Collect in store") : (dv === "villa" ? (es ? "Entrega en villa" : "Delivery to villa") : (es ? "Entrega en hotel" : "Delivery to hotel")) + (place ? ": " + place : "") + (addr ? " (" + addr + ")" : "");
    return (es ? "Hola Aloha Bikes, quiero alquilar:\n" : "Hi Aloha Bikes, I'd like to rent:\n") + (bikes || "-") +
      (es ? "\nFechas: " : "\nDates: ") + nice(from.value) + " → " + nice(to.value) + " (" + L(TX.days)(n || 1) + ")" +
      (es ? "\nEntrega: " : "\nDelivery: ") + dvTxt +
      (es ? "\nTotal orientativo web: " : "\nWebsite estimate: ") + (function () { var t = 0; ORDER.forEach(function (k) { t += qty[k] * BIKES[k].rate * (n || 1); }); return t; })() + " €" +
      (name ? (es ? "\nNombre: " : "\nName: ") + name : "") +
      (es ? "\n¿Tenéis disponibilidad?" : "\nDo you have availability?");
  }
  $$(".qty").forEach(function (row) {
    var k = row.dataset.bike, out = $("output", row);
    out.innerHTML = '<span class="roll" aria-hidden="true"><span>' + "0123456789".split("").map(function (c) { return "<i>" + c + "</i>"; }).join("") + '</span></span><span class="sr-only">0</span>';
    var rollCol = out.firstChild.firstChild, rollSr = out.lastChild;
    $$(".st-btn", row).forEach(function (b) {
      b.addEventListener("click", function () {
        qty[k] = Math.max(0, Math.min(9, qty[k] + Number(b.dataset.d)));
        rollCol.style.transform = "translateY(" + (-qty[k] * 10) + "%)"; rollSr.textContent = qty[k];
        row.classList.toggle("has", qty[k] > 0);
        if (!RM) { out.classList.remove("bump"); void out.offsetWidth; out.classList.add("bump"); }
        $("#rent-err").textContent = "";
        calc();
      });
    });
  });
  rf.addEventListener("input", function () { if (to.value < from.value && from.value) to.value = from.value; to.min = from.value || iso(today); calc(); });
  rf.addEventListener("change", calc);
  rf.addEventListener("input", function () { $(".ticket").classList.remove("sent"); });
  rf.addEventListener("click", function (e) { if (e.target.closest(".st-btn")) $(".ticket").classList.remove("sent"); });
  rf.addEventListener("submit", function (e) {
    e.preventDefault();
    var err = $("#rent-err");
    var any = ORDER.some(function (k) { return qty[k]; });
    if (!any) { err.textContent = L(TX.errBike); return; }
    if (!days()) { err.textContent = L(TX.errDates); to.focus(); return; }
    if (delivery() !== "shop" && !$("#r-place").value.trim() && !$("#r-addr").value.trim()) { err.textContent = L(TX.errAddr); $("#r-place").focus(); return; }
    err.textContent = "";
    var tk = $(".ticket");
    tk.classList.remove("sent"); void tk.offsetWidth; tk.classList.add("sent");
    $("#rent-status").textContent = lang === "es" ? "Solicitud preparada. Se abre WhatsApp para enviarla." : "Request ready. WhatsApp opens so you can send it.";
    window.open("https://wa.me/" + WA + "?text=" + encodeURIComponent(rentMsg()), "_blank", "noopener");
  });
  $("#fleet-cta").addEventListener("click", function () {
    var sel = $(".fleet-tabs [aria-selected=true]"), kb = sel && sel.dataset.bike;
    if (kb && !qty[kb]) { var row = $('.qty[data-bike="' + kb + '"]'); $('.st-btn[data-d="1"]', row).click(); }
  });
  calc();
  hooks.push(calc);

  ric(initWs, { timeout: 3000 });
  }
  function initWs() {
  var today = new Date(); today.setHours(0, 0, 0, 0);
  function iso(d) { return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }
  /* ---------------- Workshop ---------------- */
  var wsDays = $("#ws-days"), wf = $("#ws-form");
  function renderDays() {
    var sel = ($("input[name=wday]:checked", wsDays) || {}).value;
    var html = "";
    for (var i = 1; i <= 14; i++) {
      var d = new Date(today); d.setDate(d.getDate() + i);
      var v = iso(d);
      html += '<label class="day"><input type="radio" name="wday" value="' + v + '"' + ((sel ? sel === v : i === 1) ? " checked" : "") + ' aria-label="' + d.toLocaleDateString(lang === "es" ? "es-ES" : "en-GB", { weekday: "long", day: "numeric", month: "long" }) + '"><span><small>' + TX.wd[lang][d.getDay()] + "</small><b>" + d.getDate() + "</b></span></label>";
    }
    wsDays.innerHTML = html;
  }
  renderDays();
  hooks.push(renderDays);
  function wsMsg() {
    var es = lang === "es";
    var svcs = $$("input[name=svc]:checked", wf).map(function (c) { return c.nextElementSibling.textContent; }).join(", ");
    var bike = $("input[name=wbike]:checked", wf).nextElementSibling.textContent;
    var dayEl = $("input[name=wday]:checked", wf);
    var day = dayEl ? dayEl.getAttribute("aria-label") : "";
    var time = $("input[name=wtime]:checked", wf).nextElementSibling.textContent;
    var note = $("#w-note").value.trim();
    return (es ? "Hola Aloha Bikes, quiero pedir un hueco en el taller.\nServicio: " : "Hi Aloha Bikes, I'd like a workshop slot.\nService: ") + (svcs || "-") +
      (es ? "\nBici: " : "\nBike: ") + bike + (es ? "\nDía preferido: " : "\nPreferred day: ") + day + " (" + time.toLowerCase() + ")" + (note ? (es ? "\nDetalles: " : "\nDetails: ") + note : "");
  }
  function wsMail() { $("#ws-mail").href = "mailto:" + MAIL + "?subject=" + encodeURIComponent(lang === "es" ? "Cita en el taller" : "Workshop booking") + "&body=" + encodeURIComponent(wsMsg()); }
  wf.addEventListener("change", function () { $("#ws-err").textContent = ""; wsMail(); });
  wf.addEventListener("input", wsMail);
  wsMail(); hooks.push(wsMail);
  wf.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!$$("input[name=svc]:checked", wf).length) { $("#ws-err").textContent = L(TX.errSvc); $("input[name=svc]", wf).focus(); return; }
    window.open("https://wa.me/" + WA + "?text=" + encodeURIComponent(wsMsg()), "_blank", "noopener");
  });

  }
  var ric = window.requestIdleCallback || function (f) { return setTimeout(f, 200); };
  ric(initBelow, { timeout: 1500 });

  /* ---------------- Routes (signature) ---------------- */
  var track = $("#routes-track"), mapSvg = $("#map-svg"), rider = $("#rider");
  var rpSvg = $("#rp-svg"), rpClip = $("#rp-clip-rect"), rpMarker = $("#rp-marker");
  var mr = [0, 1, 2].map(function (i) { return $("#mr-" + i); });
  var samples = [], built = false, chapter = -1, active = false, ticking = false, rpBox = null;
  var MAXA = 320;
  function profY(a) { return 190 - a / MAXA * 170; }
  function profPath(alts, close) {
    var n = alts.length - 1, d = "";
    alts.forEach(function (a, i) {
      var x = i / n * 1000, y = profY(a);
      if (!i) { d += "M0 " + y.toFixed(1); return; }
      var px = (i - 1) / n * 1000, py = profY(alts[i - 1]), mx = (px + x) / 2;
      d += " C" + mx.toFixed(1) + " " + py.toFixed(1) + " " + mx.toFixed(1) + " " + y.toFixed(1) + " " + x.toFixed(1) + " " + y.toFixed(1);
    });
    return close ? d + " L1000 200 L0 200 Z" : d;
  }
  function altAt(alts, t) { var f = t * (alts.length - 1), i = Math.floor(f), r = f - i; return i >= alts.length - 1 ? alts[alts.length - 1] : alts[i] + (alts[i + 1] - alts[i]) * r; }
  /* sample an absolute M/C/S path by arc length without asking the browser for layout */
  function samplePath(d, n) {
    var tk = d.match(/[MCS]|-?\d*\.?\d+/g), i = 0, cur = [0, 0], prevC = null, segs = [], cmd = "";
    var num = function () { return parseFloat(tk[i++]); };
    while (i < tk.length) {
      if (/[MCS]/.test(tk[i])) cmd = tk[i++];
      if (cmd === "M") { cur = [num(), num()]; prevC = null; }
      else if (cmd === "C") { var c1 = [num(), num()], c2 = [num(), num()], e = [num(), num()]; segs.push([cur, c1, c2, e]); prevC = c2; cur = e; }
      else if (cmd === "S") { var r1 = prevC ? [2 * cur[0] - prevC[0], 2 * cur[1] - prevC[1]] : cur, r2 = [num(), num()], e2 = [num(), num()]; segs.push([cur, r1, r2, e2]); prevC = r2; cur = e2; }
      else i++;
    }
    var pts = [], L = [0];
    segs.forEach(function (g) {
      for (var k = (pts.length ? 1 : 0); k <= 40; k++) {
        var t = k / 40, m = 1 - t;
        var x = m * m * m * g[0][0] + 3 * m * m * t * g[1][0] + 3 * m * t * t * g[2][0] + t * t * t * g[3][0];
        var y = m * m * m * g[0][1] + 3 * m * m * t * g[1][1] + 3 * m * t * t * g[2][1] + t * t * t * g[3][1];
        if (pts.length) L.push(L[L.length - 1] + Math.hypot(x - pts[pts.length - 1][0], y - pts[pts.length - 1][1]));
        pts.push([x, y]);
      }
    });
    var total = L[L.length - 1], out = [], j = 0;
    for (var q = 0; q <= n; q++) {
      var target = total * q / n;
      while (j < L.length - 2 && L[j + 1] < target) j++;
      var f = (target - L[j]) / ((L[j + 1] - L[j]) || 1);
      out.push([pts[j][0] + (pts[j + 1][0] - pts[j][0]) * f, pts[j][1] + (pts[j + 1][1] - pts[j][1]) * f]);
    }
    return out;
  }
  function buildMap() {
    if (built) return; built = true;
    // contour rings
    var rings = "";
    [[640, 215, 7, 1.5, 1], [430, 170, 5, 1.2, 2], [905, 190, 5, 1.3, 3], [180, 250, 5, 1.6, 4]].forEach(function (c) {
      for (var j = 0; j < c[2]; j++) {
        var r = 26 + j * 27, amp = 0.1 + 0.02 * j, seed = c[4] * 10 + j, N = 28, pts = [];
        var ph = [Math.sin(seed * 12.9) * 6.28, Math.sin(seed * 78.2) * 6.28, Math.sin(seed * 37.7) * 6.28];
        for (var i = 0; i < N; i++) {
          var a = 2 * Math.PI * i / N, k = 1 + amp * (0.5 * Math.sin(2 * a + ph[0]) + 0.3 * Math.sin(3 * a + ph[1]) + 0.2 * Math.sin(5 * a + ph[2]));
          pts.push([c[0] + r * c[3] * k * Math.cos(a), c[1] + r * k * Math.sin(a)]);
        }
        var d = "M" + pts[0][0].toFixed(0) + " " + pts[0][1].toFixed(0);
        for (i = 0; i < N; i++) {
          var p0 = pts[(i - 1 + N) % N], p1 = pts[i], p2 = pts[(i + 1) % N], p3 = pts[(i + 2) % N];
          d += "C" + (p1[0] + (p2[0] - p0[0]) / 6).toFixed(0) + " " + (p1[1] + (p2[1] - p0[1]) / 6).toFixed(0) + " " + (p2[0] - (p3[0] - p1[0]) / 6).toFixed(0) + " " + (p2[1] - (p3[1] - p1[1]) / 6).toFixed(0) + " " + p2[0].toFixed(0) + " " + p2[1].toFixed(0);
        }
        rings += '<path d="' + d + 'Z"/>';
      }
    });
    $("#map-contours").innerHTML = rings;
    mr.forEach(function (p, i) {
      samples[i] = samplePath(p.getAttribute("d"), 120);
      p.setAttribute("pathLength", "1");
      p.style.strokeDasharray = "1";
      p.style.strokeDashoffset = "1";
    });
  }
  var cam = $("#map-cam"), camBox = null, pcs = $$(".pc"), mobileQ = window.matchMedia("(max-width: 899px)");
  var PC_AT = [0.3, 0.55, 0.82];
  function measureProfile() {
    var box = rpSvg.getBoundingClientRect(), par = rpSvg.parentNode.getBoundingClientRect();
    rpBox = { x: box.left - par.left, y: box.top - par.top, w: box.width, h: box.height };
    camBox = { w: cam.offsetWidth, h: cam.offsetHeight };
  }
  function camera(x, y, t) {
    pcs.forEach(function (pc, i) { pc.classList.toggle("show", i === chapter && t >= PC_AT[i]); });
    if (RM || !camBox) return;
    var z = (mobileQ.matches ? 1.38 : 1.15) + 0.7 * Math.sin(Math.PI * Math.min(1, t)), k = Math.min(1, (z - 1) / 0.7);
    var tx = (camBox.w / 2 - x * camBox.w / 1000) * k, ty = (camBox.h / 2 - y * camBox.h / 700) * k;
    var tilt = mobileQ.matches ? 38 : 48;
    cam.style.transform = "rotateX(" + tilt + "deg) scale(" + z.toFixed(3) + ") translate(" + tx.toFixed(1) + "px," + ty.toFixed(1) + "px)";
  }
  function setChapter(c) {
    if (c === chapter) return;
    chapter = c;
    var R = ROUTES[c];
    $$(".rt-tab").forEach(function (b, i) { b.setAttribute("aria-pressed", String(i === c)); });
    $(".routes-tabs").style.setProperty("--i", c);
    var card = $(".route-card");
    $("#route-kicker").textContent = L(R.kicker);
    $("#route-name").textContent = L(R.name);
    $("#route-desc").textContent = L(R.desc);
    $("#rs-km").textContent = "≈ " + R.km;
    $("#rs-gain").textContent = "≈ +" + R.gain;
    $("#rs-bike").textContent = L(R.bike);
    if (!RM) { card.classList.remove("swap"); void card.offsetWidth; card.classList.add("swap"); }
    $("#rp-ghost").setAttribute("d", profPath(R.alt));
    $("#rp-line").setAttribute("d", profPath(R.alt));
    $("#rp-area").setAttribute("d", profPath(R.alt, true));
    $("#rp-axis-end").textContent = R.km + " km";
    mr.forEach(function (p, i) {
      p.classList.toggle("done", i < c);
      p.style.opacity = i > c ? "0" : "";
      if (i < c) p.style.strokeDashoffset = "0";
      if (i > c) p.style.strokeDashoffset = "1";
    });
    measureProfile();
  }
  function setProgress(t) {
    var R = ROUTES[chapter], s = samples[chapter];
    mr[chapter].style.strokeDashoffset = String(1 - t);
    var f = t * (s.length - 1), i = Math.min(s.length - 2, Math.floor(f)), r = f - i;
    var x = s[i][0] + (s[i + 1][0] - s[i][0]) * r, y = s[i][1] + (s[i + 1][1] - s[i][1]) * r;
    rider.style.transform = "translate(" + x.toFixed(1) + "px," + y.toFixed(1) + "px)";
    camera(x, y, t);
    rpClip.style.transform = "scaleX(" + t.toFixed(4) + ")";
    var a = altAt(R.alt, t);
    if (rpBox) rpMarker.style.transform = "translate(" + (rpBox.x - 12 + t * rpBox.w).toFixed(1) + "px," + (rpBox.y + profY(a) / 200 * rpBox.h).toFixed(1) + "px)";
    $("#rp-km").textContent = fmt(t * R.km, 1);
    $("#rp-alt").textContent = Math.round(a);
  }
  function update() {
    ticking = false;
    var rect = track.getBoundingClientRect(), total = track.offsetHeight - window.innerHeight;
    var p = Math.min(1, Math.max(0, -rect.top / total));
    var c = Math.min(2, Math.floor(p * 3));
    var t = Math.min(1, Math.max(0, (p * 3 - c) / 0.72));
    setChapter(c);
    setProgress(t);
  }
  function onScroll() { if (active && !ticking) { ticking = true; requestAnimationFrame(update); } }
  $$(".rt-tab").forEach(function (b, i) {
    b.addEventListener("click", function () {
      if (RM) { buildMap(); setChapter(i); setProgress(1); return; }
      var total = track.offsetHeight - window.innerHeight;
      var top = track.getBoundingClientRect().top + window.scrollY + total * (i + 0.8) / 3;
      window.scrollTo({ top: top, behavior: "smooth" });
    });
  });
  if (RM) {
    buildMap(); setChapter(0); setProgress(1);
    window.addEventListener("resize", function () { measureProfile(); setProgress(1); });
  } else {
    var ro = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) { buildMap(); active = true; if (chapter < 0) { setChapter(0); } measureProfile(); onScroll(); }
        else active = false;
      });
    }, { rootMargin: "200px 0px" });
    ro.observe(track);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", function () { if (built) { measureProfile(); onScroll(); } });
  }
  hooks.push(function () { if (chapter >= 0) { var c = chapter; chapter = -1; setChapter(c); if (RM) setProgress(1); else update(); } });

  /* ---------------- Hero motion ---------------- */
  (function () {
    var hero = $(".hero"); if (!hero || RM) return;
    var media = $(".hero-media"), blur = $(".hero-blur"), blurImg = $(".hero-blur img"), speed = $(".speed");
    var mq = window.matchMedia("(max-width: 767px)");
    var vis = true, tick = false, lastY = 0, lastT = 0, vel = 0;
    var hH = 0; window.addEventListener("resize", function () { hH = 0; });
    window.addEventListener("load", function () {
      setTimeout(function () { blurImg.src = window.matchMedia("(max-width: 767px)").matches ? "img/hero-m-blur-700.webp" : "img/hero-blur-1200.webp"; }, 300);
    });
    function frame() {
      tick = false;
      var y = window.scrollY, now = performance.now(), dt = Math.max(16, now - lastT);
      var v = Math.min(1, Math.abs(y - lastY) / dt / 2.2);
      vel += (v - vel) * 0.25; lastY = y; lastT = now;
      if (!hH) hH = hero.offsetHeight;
      var p = Math.min(1, Math.max(0, y / hH));
      var tr = "translate3d(0," + (p * (mq.matches ? -10 : 14)).toFixed(2) + "%,0) scale(" + (1 + p * 0.08).toFixed(4) + ")";
      media.style.transform = tr; blur.style.transform = tr;
      blur.style.opacity = Math.min(1, p * 1.5 + vel * 0.9).toFixed(3);
      speed.style.transform = "translate3d(" + (-p * 30).toFixed(2) + "%,0,0)";
      speed.style.opacity = (0.55 + p * 0.45 + vel * 0.3).toFixed(3);
      if (vis && vel > 0.01) { tick = true; requestAnimationFrame(frame); }
    }
    var stopT = 0;
    function onS() { if (vis) { hero.classList.add("moving"); clearTimeout(stopT); stopT = setTimeout(function () { hero.classList.remove("moving"); }, 900); } if (vis && !tick) { tick = true; requestAnimationFrame(frame); } }
    new IntersectionObserver(function (es) { vis = es[0].isIntersecting; hero.classList.toggle("off", !vis); if (vis && !tick) { tick = true; requestAnimationFrame(frame); } }).observe(hero);
    window.addEventListener("scroll", onS, { passive: true });
  })();

  /* split translated headline words so the reveal also works in English */
  function splitHead() {
    var d = 0;
    $$(".hero-title [data-i18n]").forEach(function (el) {
      if (el.querySelector(".w")) { d += el.querySelectorAll(".w").length; return; }
      el.innerHTML = el.textContent.trim().split(/\s+/).map(function (w) { return '<span class="w"><span class="wi" style="--d:' + (d++) + '">' + w + "</span></span>"; }).join(" ");
    });
  }
  hooks.push(splitHead);

  /* ---------------- Tu día en bici ---------------- */
  (function () {
    var dt = $("#day-track"); if (!dt || RM) return;
    var arm = $("#sun-arm"), drider = $("#day-rider"), skies = $$(".sky-l"), dusk = $(".ld-dusk"), steps = $$("#day-steps li"), bars = $$(".day-prog i");
    var cur = -1, act = false, tk = false;
    function upd() {
      tk = false;
      var r = dt.getBoundingClientRect(), tot = dt.offsetHeight - window.innerHeight;
      var p = Math.min(1, Math.max(0, -r.top / tot));
      arm.style.transform = "rotate(" + (-72 + 144 * p).toFixed(2) + "deg)";
      drider.style.transform = "translateX(calc(" + (p * 100).toFixed(2) + "% - " + (p * 46).toFixed(1) + "px))";
      skies.forEach(function (sk, i) { if (i) sk.style.opacity = Math.max(0, 1 - Math.abs(p - i / 3) * 3).toFixed(3); });
      dusk.style.opacity = (Math.max(0, (p - 0.72) / 0.28) * 0.45).toFixed(3);
      var st = Math.min(3, Math.floor(p * 4));
      if (st !== cur) { cur = st; steps.forEach(function (li, i) { li.classList.toggle("on", i === st); }); }
      bars.forEach(function (b, i) { b.style.transform = "scaleX(" + (i < st ? 1 : i > st ? 0 : Math.min(1, p * 4 - st)).toFixed(3) + ")"; });
    }
    function onS() { if (act && !tk) { tk = true; requestAnimationFrame(upd); } }
    new IntersectionObserver(function (es) { act = es[0].isIntersecting; if (act) onS(); }, { rootMargin: "100px 0px" }).observe(dt);
    window.addEventListener("scroll", onS, { passive: true });
    window.addEventListener("resize", onS);
  })();

  /* ---------------- Press ripples ---------------- */
  if (!RM) document.addEventListener("pointerdown", function (e) {
    var t = e.target.closest(".btn, .st-btn, .rt-tab, .fleet-tabs [role=tab], .lang-btn, .mbar a");
    if (!t) return;
    var r = t.getBoundingClientRect(), d = Math.max(r.width, r.height) * 2, sp = document.createElement("span");
    sp.className = "rip"; sp.style.width = sp.style.height = d + "px";
    sp.style.left = (e.clientX - r.left - d / 2) + "px"; sp.style.top = (e.clientY - r.top - d / 2) + "px";
    t.appendChild(sp); setTimeout(function () { sp.remove(); }, 650);
  }, { passive: true });

  /* ---------------- Init language ---------------- */
  if (lang === "en") applyLang("en");
})();
