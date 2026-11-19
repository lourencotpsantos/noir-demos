/* Hotel Carabeo — Noir Digital concept. Vanilla JS, no build step. */
(function () {
  'use strict';
  var D = window.HC;
  var doc = document.documentElement;
  var RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var EMAIL = 'info@hotelcarabeo.com';
  var lang = 'es';
  try { var saved = localStorage.getItem('hc-lang'); if (saved === 'en' || saved === 'es') lang = saved; } catch (e) {}

  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function T(es, en) { return lang === 'en' ? en : es; }
  function L(o) { return o ? (lang === 'en' ? o.en : o.es) : ''; }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function seg(p, a, b) { return clamp((p - a) / (b - a), 0, 1); }
  function eur(n) {
    var s = (Math.round(n * 100) / 100).toFixed(n % 1 ? 2 : 0);
    if (lang === 'es') s = s.replace('.', ',');
    s = s.replace(/\B(?=(\d{3})+(?!\d))/g, lang === 'es' ? '.' : ',');
    return lang === 'es' ? s + ' €' : '€' + s;
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function iso(d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  function parse(s) { if (!s) return null; var p = s.split('-'); var d = new Date(+p[0], +p[1] - 1, +p[2]); return isNaN(d) ? null : d; }
  var DTF = {};
  function fmtDate(d) { var f = DTF[lang] || (DTF[lang] = new Intl.DateTimeFormat(lang === 'en' ? 'en-GB' : 'es-ES', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })); return f.format(d); }
  function mailto(subject, lines) { location.href = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(lines.join('\n')); }

  function nearView(id, fn) {
    var el = document.getElementById(id);
    if (!('IntersectionObserver' in window)) return fn();
    var io = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { io.disconnect(); fn(); } }, { rootMargin: '900px 0px 900px 0px' });
    io.observe(el);
  }

  var toastT;
  function toast(msg) {
    var el = $('#toast'); el.textContent = msg; el.classList.add('show');
    clearTimeout(toastT); toastT = setTimeout(function () { el.classList.remove('show'); }, 3200);
  }

  /* ================= i18n ================= */
  function applyLang() {
    doc.lang = lang;
    $$('[data-en]').forEach(function (el) {
      if (el.dataset.es === undefined) { if (lang === 'es') return; el.dataset.es = el.innerHTML; }
      el.innerHTML = lang === 'en' ? el.dataset.en : el.dataset.es;
    });
    $$('[data-en-attr]').forEach(function (el) {
      el.dataset.enAttr.split(';;').forEach(function (pair) {
        var i = pair.indexOf('|'); var a = pair.slice(0, i), v = pair.slice(i + 1);
        var key = 'esAttr' + a.replace(/[^a-z]/gi, '');
        if (el.dataset[key] === undefined) { if (lang === 'es') return; el.dataset[key] = el.getAttribute(a) || ''; }
        el.setAttribute(a, lang === 'en' ? v : el.dataset[key]);
      });
    });
    $$('.lang-btn').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.lang === lang)); });
    document.title = T('Hotel Carabeo · Nerja · Hotel boutique y Restaurante 34', 'Hotel Carabeo · Nerja · Boutique hotel and Restaurante 34');
    var pl = $('#pl-sea-l'); if (pl) pl.textContent = T('Mediterráneo', 'Mediterranean');
    rerender.forEach(function (f) { f(); });
  }
  var rerender = [];
  $$('.lang-btn').forEach(function (b) {
    b.addEventListener('click', function () {
      if (b.dataset.lang === lang) return;
      lang = b.dataset.lang; try { localStorage.setItem('hc-lang', lang); } catch (e) {}
      applyLang();
    });
  });

  /* ================= header + nav ================= */
  var header = $('.site-header');
  var hero = $('#hero');
  var heroTop = 0, heroH = 0, vh = innerHeight;
  function measure() { vh = innerHeight; heroTop = hero.offsetTop; heroH = hero.offsetHeight; }
  measure();
  addEventListener('resize', function () { measure(); heroTick(); }, { passive: true });

  var navLinks = $$('.nav a');
  if ('IntersectionObserver' in window) {
    var secIO = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        navLinks.forEach(function (a) { a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    ['historia', 'habitaciones', 'restaurante', 'bonos', 'bodas', 'contacto'].forEach(function (id) { var s = document.getElementById(id); if (s) secIO.observe(s); });
  }

  /* ================= HERO: layered Balcón, afternoon → dusk → night ================= */
  var L_ = {
    bg: $('.hl-bg'), fg: $('.hl-fg'), dusk: $$('.hl-dusk, .hl-fgdusk'), night: $$('.hl-night, .hl-fgnight'), stars: $('.hl-stars'), moon: $('.hl-moon'),
    glow: $('.hl-glow'), lamps: $('.hl-lamps'), b1: $('.beat-1'), b2: $('.beat-2'), b3: $('.beat-3'), fill: $('.hc-fill'),
    cue: $('.hero-cue'), copy: $('.hero-copy'), moonpath: $('.moonpath')
  };
  function loadLayers() {
    $$('.hero source[data-srcset], .hero img[data-srcset]').forEach(function (el) {
      el.srcset = el.dataset.srcset; el.removeAttribute('data-srcset');
    });
    var pair = $$('.hl-plate, .hl-fgday, .hl-dusk, .hl-fgdusk, .hl-night, .hl-fgnight'), ok = 0;
    pair.forEach(function (im) {
      var go = function () { if (++ok === pair.length) requestAnimationFrame(function () { depthReady = true; hero.classList.add('depth'); onScroll(); }); };
      if (im.complete && im.naturalWidth) go(); else { im.addEventListener('load', go, { once: true }); }
    });
  }
  /* depth layers wait until the first paint is done: first scroll/touch, or 2.5 s after load */
  var layersAsked = false;
  function askLayers() { if (layersAsked) return; layersAsked = true; removeEventListener('scroll', askLayers); removeEventListener('touchstart', askLayers); loadLayers(); }
  addEventListener('scroll', askLayers, { passive: true }); addEventListener('touchstart', askLayers, { passive: true });
  var afterLoad = function () { setTimeout(function () { if (window.requestIdleCallback) requestIdleCallback(askLayers, { timeout: 1000 }); else askLayers(); }, 2500); };
  if (document.readyState === 'complete') afterLoad(); else addEventListener('load', afterLoad);

  var heroVisible = true, heroQueued = false, lastSolid = null, depthReady = false;
  function beat(el, inA, inB, outA, outB, p) {
    var a = inA === null ? 1 : seg(p, inA, inB);
    var b = outA === null ? 0 : seg(p, outA, outB);
    var o = Math.min(a, 1 - b);
    el.style.opacity = o.toFixed(3);
    el.style.transform = 'translate3d(0,' + ((1 - a) * 26 - b * 26).toFixed(1) + 'px,0)';
  }
  function heroTick() {
    heroQueued = false;
    var y = scrollY;
    var solid = y > heroTop + heroH - vh - 40;
    if (solid !== lastSolid) { header.classList.toggle('solid', solid); lastSolid = solid; }
    if (RM || !heroVisible) return;
    var p = clamp((y - heroTop) / Math.max(1, heroH - vh), 0, 1);
    /* depth: the cliff and balcony drift left and towards you, the sea opens behind */
    L_.fg.style.transform = 'translate3d(' + (-5 * p).toFixed(2) + '%,' + (2.5 * p).toFixed(2) + '%,0) scale(' + (1 + 0.1 * p).toFixed(4) + ')';
    L_.bg.style.transform = 'scale(' + (1 + 0.045 * p).toFixed(4) + ')';
    var d = depthReady ? (seg(p, 0.06, 0.4) * (1 - seg(p, 0.7, 0.95) * 0.6)).toFixed(3) : 0, n = depthReady ? seg(p, 0.42, 0.78).toFixed(3) : 0;
    L_.dusk.forEach(function (e) { e.style.opacity = d; });
    L_.night.forEach(function (e) { e.style.opacity = n; });
    L_.stars.style.opacity = seg(p, 0.6, 0.9).toFixed(3);
    L_.moon.style.opacity = seg(p, 0.55, 0.85).toFixed(3);
    L_.moonpath.style.opacity = (n * 0.7).toFixed(3);
    var lights = seg(p, 0.5, 0.76);
    L_.glow.style.opacity = lights.toFixed(3);
    L_.lamps.style.opacity = lights.toFixed(3);
    beat(L_.b1, null, null, 0.2, 0.3, p);
    beat(L_.b2, 0.3, 0.38, 0.56, 0.64, p);
    beat(L_.b3, 0.64, 0.72, null, null, p);
    L_.copy.style.transform = 'translate3d(0,' + (-30 * p).toFixed(1) + 'px,0)';
    L_.fill.style.transform = 'scaleY(' + p.toFixed(3) + ')';
    if (L_.cue) L_.cue.style.opacity = (1 - seg(p, 0, 0.08)).toFixed(3);
  }
  function onScroll() { if (!heroQueued) { heroQueued = true; requestAnimationFrame(heroTick); } }
  addEventListener('scroll', onScroll, { passive: true });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) { heroVisible = es[0].isIntersecting; hero.classList.toggle('vis', heroVisible); if (heroVisible) onScroll(); }).observe(hero);
  }
  hero.classList.add('vis');
  heroTick();

  /* ================= reveal ================= */
  var reveals = $$('.reveal');
  if (RM || !('IntersectionObserver' in window)) reveals.forEach(function (el) { el.classList.add('in'); });
  else {
    var rIO = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); rIO.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach(function (el) { rIO.observe(el); });
  }

  /* ================= ROOMS: full-screen gallery + room sheet ================= */
  var rooms = D.rooms, cur = 0, rg = $('#rg'), rgReady = false, rs = $('#rs');
  var coast = $('#coast'), coastPath = $('.coast-line', coast);
  var NS = 'http://www.w3.org/2000/svg';
  function svgEl(n, attrs) { var e = document.createElementNS(NS, n); for (var k in attrs) e.setAttribute(k, attrs[k]); return e; }
  var yCache = { 40: 73.8, 120: 79.4, 205: 65.7, 250: 62, 290: 70.5, 330: 72.6, 345: 68.8, 425: 65.9, 535: 72.2 };
  function yAt(x) {
    if (yCache[x] !== undefined) return yCache[x];
    var len = coastPath.getTotalLength(), lo = 0, hi = len;
    for (var i = 0; i < 24; i++) { var mid = (lo + hi) / 2; if (coastPath.getPointAtLength(mid).x < x) lo = mid; else hi = mid; }
    return (yCache[x] = coastPath.getPointAtLength(lo).y);
  }
  var coastG = svgEl('g', {}), pin = svgEl('g', { 'class': 'cm-pin' });
  coast.appendChild(coastG);
  pin.appendChild(svgEl('circle', { 'class': 'ring', r: 9 }));
  pin.appendChild(svgEl('circle', { r: 4.5 }));
  function drawCoast() {
    coastG.textContent = '';
    D.marks.forEach(function (m) {
      var y = yAt(m.x);
      if (m.kind === 'hotel') {
        coastG.appendChild(svgEl('path', { 'class': 'cm-hotel', d: 'M' + m.x + ' ' + (y - 13) + ' l4 7 h-8 z' }));
        coastG.appendChild(svgEl('line', { x1: m.x, y1: y - 6, x2: m.x, y2: y, stroke: '#74572a', 'stroke-width': 1 }));
      } else coastG.appendChild(svgEl('line', { x1: m.x, y1: y - 9, x2: m.x, y2: y, stroke: '#74572a', 'stroke-width': 1.2 }));
      var t = svgEl('text', { 'class': 'cm-lbl mark', x: m.kind === 'hotel' ? m.x - 4 : m.x + 4, y: y - 18, 'text-anchor': m.kind === 'hotel' ? 'start' : 'end' });
      t.textContent = L(m); coastG.appendChild(t);
    });
    rooms.forEach(function (r, i) {
      var y = yAt(r.x);
      var c = svgEl('circle', { 'class': 'cm-dot room', cx: r.x, cy: y, r: 3.4 });
      var tt = svgEl('title', {}); tt.textContent = r.name; c.appendChild(tt);
      c.addEventListener('click', function () { fillSheet(i); });
      coastG.appendChild(c);
      var lab = svgEl('text', { 'class': 'cm-lbl rl', x: clamp(r.x, 40, 560), y: y + 26, 'text-anchor': 'middle' });
      lab.textContent = r.name; coastG.appendChild(lab);
    });
    coastG.appendChild(pin);
  }
  var arrow = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  function renderGallery() {
    rgReady = true;
    rg.innerHTML = rooms.map(function (r, i) {
      return '<article class="rg-slide" role="listitem" data-i="' + i + '"><figure class="rg-fig"><img src="img/room-' + r.id + '-600.webp" srcset="img/room-' + r.id + '-600.webp 600w, img/room-' + r.id + '-1000.webp 1000w" sizes="(min-width: 1024px) 66vw, 88vw" width="1000" height="750" alt="' + esc(T('Interior de habitación (imagen ilustrativa)', 'Room interior (illustrative image)')) + '" loading="lazy" decoding="async"></figure>' +
        '<div class="rg-cap"><p class="rg-num">' + String(i + 1).padStart(2, '0') + ' · ' + esc(L(r.type)) + '</p><h3 class="rg-name">' + esc(r.name) + '</h3><p class="rg-meta">' + esc(L(r.view)) + ' · ' + esc(T('desde ', 'from ') + eur(r.low)) + '</p>' +
        '<button type="button" class="rg-open" data-i="' + i + '"><span>' + T('Ver habitación', 'View room') + '</span>' + arrow + '</button></div><span class="rg-ill">' + T('Imagen ilustrativa', 'Illustrative image') + '</span></article>';
    }).join('');
    measureRg(); rgTick();
  }
  var slides = [], rgW = 0, rgQ = false;
  function measureRg() { slides = $$('.rg-slide', rg).map(function (s) { return { el: s, img: $('img', s), cap: $('.rg-cap', s), c: s.offsetLeft + s.offsetWidth / 2 }; }); rgW = rg.clientWidth; }
  function rgTick() {
    rgQ = false; if (!slides.length) return;
    var mid = rg.scrollLeft + rgW / 2, best = 0, bd = 1e9;
    slides.forEach(function (s, i) {
      var d = (s.c - mid) / rgW, ad = Math.abs(d);
      if (ad < bd) { bd = ad; best = i; }
      if (RM) return;
      s.img.style.transform = 'translate3d(' + (d * -14).toFixed(2) + '%,0,0) scale(1.18)';
      s.cap.style.transform = 'translate3d(' + (d * 90).toFixed(1) + 'px,0,0)';
      s.cap.style.opacity = clamp(1 - ad * 1.3, 0, 1).toFixed(3);
    });
    $('#rg-count').textContent = String(best + 1).padStart(2, '0') + ' / ' + String(rooms.length).padStart(2, '0');
    $('#rg-bar').style.transform = 'scaleX(' + ((best + 1) / rooms.length).toFixed(3) + ')';
    rg.dataset.cur = best;
  }
  rg.addEventListener('scroll', function () { if (!rgQ) { rgQ = true; requestAnimationFrame(rgTick); } }, { passive: true });
  addEventListener('resize', function () { if (rgReady) { measureRg(); rgTick(); } }, { passive: true });
  function rgStep(dir) { var s = slides[1] ? slides[1].c - slides[0].c : rgW; rg.scrollBy({ left: dir * s, behavior: RM ? 'auto' : 'smooth' }); }
  $('#rg-prev').addEventListener('click', function () { rgStep(-1); });
  $('#rg-next').addEventListener('click', function () { rgStep(1); });
  var lastFocus = null;
  rg.addEventListener('click', function (e) {
    var s = e.target.closest('.rg-slide'); if (!s) return;
    lastFocus = e.target.closest('button') || $('.rg-open', s);
    openSheet(+s.dataset.i);
  });
  function fillSheet(i) {
    cur = i; var r = rooms[i];
    $('#rs-gal').innerHTML =
      '<figure class="rs-slide"><img src="img/room-' + r.id + '-1000.webp" width="1000" height="750" alt="' + esc(T('Interior de habitación (imagen ilustrativa)', 'Room interior (illustrative image)')) + '" decoding="async"><figcaption>' + T('Interior · imagen ilustrativa', 'Interior · illustrative image') + '</figcaption></figure>' +
      '<figure class="rs-slide"><img src="img/beach-' + r.id + '-1280.webp" width="' + r.bw + '" height="' + r.bh + '" alt="' + esc(L(r.beach)) + '" decoding="async"><figcaption>' + esc(L(r.beach)) + ' · ' + esc(r.credit) + '</figcaption></figure>';
    $('#rs-gal').scrollLeft = 0;
    $('#rs-dots').innerHTML = '<i class="on"></i><i></i>';
    $('#rs-type').textContent = L(r.type);
    $('#rs-name').textContent = r.name;
    var v = $('#rs-view'); v.textContent = L(r.view); v.classList.toggle('sea', r.sea);
    $('#rs-low').textContent = eur(r.low); $('#rs-high').textContent = eur(r.high);
    $('#rs-note').textContent = r.low27 ? T('Tarifas 2027: ', '2027 rates: ') + eur(r.low27) + ' / ' + eur(r.high27) : T('Tarifa 2027 [por confirmar]', '2027 rate [to be confirmed]');
    $('#rs-feats').innerHTML = L(r.feats).map(function (f) { return '<li>' + esc(f) + '</li>'; }).join('');
    $('#rs-credit').textContent = T('La playa que le da nombre: ', 'The beach it is named after: ') + L(r.beach) + ' (Wikimedia Commons).';
    pin.style.transform = 'translate(' + r.x + 'px,' + yAt(r.x) + 'px)';
    $$('.cm-dot.room', coast).forEach(function (c, k) { c.style.fill = k === i ? '#a8552f' : ''; });
    $$('.cm-lbl.rl', coast).forEach(function (c, k) { c.classList.toggle('on', k === i); });
  }
  $('#rs-gal').addEventListener('scroll', function () {
    var g = $('#rs-gal'), k = Math.round(g.scrollLeft / Math.max(1, g.clientWidth));
    $$('#rs-dots i').forEach(function (d, j) { d.classList.toggle('on', j === k); });
  }, { passive: true });
  function openSheet(i) {
    if (!coastG.childNodes.length) drawCoast();
    fillSheet(i);
    rs.classList.remove('closing');
    if (rs.showModal) rs.showModal(); else rs.setAttribute('open', '');
    document.documentElement.classList.add('sheet-open');
  }
  function closeSheet(after) {
    if (!rs.open) return;
    var fin = function () { rs.close(); rs.classList.remove('closing'); document.documentElement.classList.remove('sheet-open'); if (after) after(); else if (lastFocus) lastFocus.focus(); };
    if (RM) return fin();
    rs.classList.add('closing'); setTimeout(fin, 320);
  }
  $('#rs-close').addEventListener('click', function () { closeSheet(); });
  rs.addEventListener('cancel', function (e) { e.preventDefault(); closeSheet(); });
  rs.addEventListener('click', function (e) { if (e.target === rs) closeSheet(); });
  $('#rs-book').addEventListener('click', function () {
    var r = rooms[cur];
    closeSheet(function () {
      if (!calReady) { calReady = true; renderRoomSelect(); renderCal(); }
      $('#bk-room').value = r.id; updateQuote();
      document.getElementById('reservar').scrollIntoView({ behavior: RM ? 'auto' : 'smooth' });
      toast(T(r.name + ' seleccionada: ahora elige fechas', r.name + ' selected: now pick dates'));
      setTimeout(function () { $('#bk-in').focus({ preventScroll: true }); }, 700);
    });
  });
  nearView('habitaciones', renderGallery);
  rerender.push(function () { if (rgReady) renderGallery(); if (coastG.childNodes.length) drawCoast(); if (rs.open) fillSheet(cur); });

  /* ================= BOOKING CALENDAR ================= */
  var EC = {};
  function easter(y) {
    if (EC[y]) return EC[y];
    var a = y % 19, b = Math.floor(y / 100), c = y % 100, d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3),
      h = (19 * a + b - d - g + 15) % 30, i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451),
      mo = Math.floor((h + l - 7 * m + 114) / 31), da = ((h + l - 7 * m + 114) % 31) + 1;
    return (EC[y] = new Date(y, mo - 1, da));
  }
  var today = new Date(); today.setHours(0, 0, 0, 0);
  function season(d) {
    if (d.getFullYear() < 2027) return 'off'; /* 2026 season is over */
    var es = easter(d.getFullYear()); var ps = new Date(es); ps.setDate(es.getDate() - 7); var em = new Date(es); em.setDate(es.getDate() + 1);
    if (d >= ps && d <= em) return 'high';
    var m = d.getMonth();
    if (m === 2 || m === 3 || m === 9 || m === 10) return 'low';
    if (m >= 4 && m <= 8) return 'high';
    return 'off';
  }
  function rate(r, d) {
    var s = season(d); if (s === 'off') return null;
    var y27 = d.getFullYear() >= 2027;
    var v = s === 'high' ? (y27 && r.high27 ? r.high27 : r.high) : (y27 && r.low27 ? r.low27 : r.low);
    return { v: v, s: s, est: y27 && !r.low27 };
  }
  var bkRoom = $('#bk-room'), bkIn = $('#bk-in'), bkOut = $('#bk-out'), bkG = $('#bk-guests');
  var calStart = new Date(2027, 2, 1), calMin = new Date(today.getFullYear(), today.getMonth(), 1), calMax = new Date(2027, 11, 1);
  var ci = null, co = null;
  function renderRoomSelect() {
    var v = bkRoom.value || 'calahonda';
    bkRoom.innerHTML = rooms.map(function (r) { return '<option value="' + r.id + '">' + esc(r.name + ' · ' + T('desde ', 'from ') + eur(r.low) + (r.sea ? ' · ' + T('vista al mar', 'sea view') : '')) + '</option>'; }).join('');
    bkRoom.value = v;
  }
  var MTF = {};
  function monthName(d) { var f = MTF[lang] || (MTF[lang] = new Intl.DateTimeFormat(lang === 'en' ? 'en-GB' : 'es-ES', { month: 'long', year: 'numeric' })); return f.format(d); }
  function renderCal() {
    var grids = $('#cal-grids'); grids.textContent = '';
    var wide = matchMedia('(min-width: 1024px)').matches, n = wide ? 2 : 1;
    var dows = lang === 'en' ? ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'] : ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
    for (var k = 0; k < n; k++) {
      var m0 = new Date(calStart.getFullYear(), calStart.getMonth() + k, 1);
      var box = document.createElement('div'); box.className = 'cal-month';
      var html = '<h4>' + monthName(m0) + '</h4><div class="cal-dow" aria-hidden="true">' + dows.map(function (d) { return '<span>' + d + '</span>'; }).join('') + '</div><div class="cal-days">';
      var lead = (m0.getDay() + 6) % 7;
      for (var i = 0; i < lead; i++) html += '<span></span>';
      var days = new Date(m0.getFullYear(), m0.getMonth() + 1, 0).getDate();
      for (var d = 1; d <= days; d++) {
        var dt = new Date(m0.getFullYear(), m0.getMonth(), d), s = season(dt), past = dt < today;
        var cls = 'cal-day s-' + s + (past ? ' past' : '');
        if (ci && +dt === +ci) cls += ' sel'; if (co && +dt === +co) cls += ' sel';
        if (ci && co && dt > ci && dt < co) cls += ' in-range';
        var lbl = fmtDate(dt) + ' · ' + (s === 'off' ? T('cerrado', 'closed') : s === 'high' ? T('temporada alta', 'high season') : T('temporada baja', 'low season'));
        var dis = past || (s === 'off' && !(ci && !co && dt > ci));
        html += '<button type="button" class="' + cls + '" data-d="' + iso(dt) + '" aria-label="' + esc(lbl) + '"' + (dis ? ' disabled' : '') + '><span>' + d + '</span></button>';
      }
      html += '</div>'; box.innerHTML = html; grids.appendChild(box);
    }
    $('#cal-title').textContent = monthName(calStart);
    $('#cal-prev').disabled = calStart <= calMin;
    $('#cal-next').disabled = new Date(calStart.getFullYear(), calStart.getMonth() + n - 1, 1) >= calMax;
  }
  $('#cal-grids').addEventListener('click', function (e) {
    var b = e.target.closest('.cal-day'); if (!b || b.disabled) return;
    var d = parse(b.dataset.d);
    if (!ci || co || d <= ci) { ci = d; co = null; $('#cal-hint').textContent = T('Ahora toca el día de salida.', 'Now tap your departure day.'); }
    else { co = d; $('#cal-hint').textContent = T('Fechas elegidas. Revisa el total.', 'Dates chosen. Check the total.'); }
    bkIn.value = ci ? iso(ci) : ''; bkOut.value = co ? iso(co) : '';
    renderCal(); updateQuote();
  });
  $('#cal-prev').addEventListener('click', function () { calStart = new Date(calStart.getFullYear(), calStart.getMonth() - 1, 1); renderCal(); });
  $('#cal-next').addEventListener('click', function () { calStart = new Date(calStart.getFullYear(), calStart.getMonth() + 1, 1); renderCal(); });
  function syncFromInputs() {
    ci = parse(bkIn.value); co = parse(bkOut.value);
    if (ci && co && co <= ci) co = null;
    if (ci) calStart = new Date(ci.getFullYear(), ci.getMonth(), 1);
    renderCal(); updateQuote();
  }
  bkIn.addEventListener('change', syncFromInputs); bkOut.addEventListener('change', syncFromInputs);
  bkRoom.addEventListener('change', updateQuote); bkG.addEventListener('change', updateQuote);
  var quoteState = null;
  function updateQuote() {
    var q = $('#quote'), r = rooms.filter(function (x) { return x.id === bkRoom.value; })[0] || rooms[0];
    $('#bk-err').textContent = '';
    quoteState = null;
    if (!ci || !co) { q.innerHTML = '<p class="quote-empty">' + T('Elige fechas para ver el total.', 'Pick dates to see the total.') + '</p>'; return; }
    var nights = [], off = 0, est = false;
    for (var d = new Date(ci); d < co; d.setDate(d.getDate() + 1)) { var rt = rate(r, d); if (!rt) off++; else { nights.push(rt); if (rt.est) est = true; } }
    if (off) { q.innerHTML = '<p class="quote-empty">' + T('Tu estancia incluye noches con el hotel cerrado. Elige fechas de marzo a noviembre.', 'Your stay includes nights when the hotel is closed. Choose dates from March to November.') + '</p>'; return; }
    var groups = {}; nights.forEach(function (n) { var k = n.s + '|' + n.v; groups[k] = (groups[k] || 0) + 1; });
    var total = nights.reduce(function (a, n) { return a + n.v; }, 0);
    var rows = Object.keys(groups).map(function (k) {
      var p = k.split('|'), c = groups[k];
      return '<div class="q-row"><span>' + c + ' × ' + eur(+p[1]) + ' · ' + (p[0] === 'high' ? T('alta', 'high') : T('baja', 'low')) + '</span><span>' + eur(c * +p[1]) + '</span></div>';
    }).join('');
    var g = +bkG.value, flag = '';
    var sofa = r.id === 'burriana' || r.id === 'penthouse';
    if (g > 2 && !sofa) flag += '<span class="q-flag">' + T('Esta habitación es para 1–2 personas. Para 3–4, Burriana o Penthouse (sofá cama).', 'This room sleeps 1–2. For 3–4, choose Burriana or Penthouse (sofa bed).') + '</span>';
    if (g > 2 && sofa) flag += '<span class="q-flag">' + T('Suplemento por persona extra [por confirmar].', 'Extra-person supplement [to be confirmed].') + '</span>';
    if (est) flag += '<span class="q-flag">' + T('Tarifa 2027 de esta habitación [por confirmar]: se muestra la de 2026.', '2027 rate for this room [to be confirmed]: 2026 rate shown.') + '</span>';
    if (ci.getMonth() === 2 && ci.getFullYear() === 2027) flag += '<span class="q-flag">' + T('Fecha de reapertura del hotel [por confirmar].', 'Hotel reopening date [to be confirmed].') + '</span>';
    q.innerHTML = '<div class="q-row"><span><b>' + esc(r.name) + '</b> · ' + nights.length + ' ' + T(nights.length === 1 ? 'noche' : 'noches', nights.length === 1 ? 'night' : 'nights') + '</span><span>' + esc(fmtDate(ci)) + ' → ' + esc(fmtDate(co)) + '</span></div>' + rows +
      '<div class="q-total"><span>' + T('Total con desayuno e IVA', 'Total with breakfast and VAT') + '</span><b>' + eur(total) + '</b></div>' +
      '<div class="q-row"><span>' + T('Depósito del 10 % para confirmar', '10% deposit to confirm') + '</span><span>' + eur(total * 0.1) + '</span></div>' + flag;
    quoteState = { r: r, n: nights.length, total: total, g: g };
  }
  $('#book-form').addEventListener('submit', function (e) {
    e.preventDefault();
    if (!quoteState) { $('#bk-err').textContent = T('Elige primero las fechas de llegada y salida (de marzo a noviembre).', 'First choose your arrival and departure dates (March to November).'); return; }
    var s = quoteState, name = $('#bk-name').value.trim();
    mailto(T('Solicitud de reserva: ', 'Booking request: ') + s.r.name + ' · ' + iso(ci), [
      T('Hola, me gustaría reservar:', 'Hello, I would like to book:'), '',
      T('Habitación: ', 'Room: ') + s.r.name + ' (' + L(s.r.type) + ')',
      T('Llegada: ', 'Arrival: ') + fmtDate(ci), T('Salida: ', 'Departure: ') + fmtDate(co),
      T('Noches: ', 'Nights: ') + s.n + ' · ' + T('Huéspedes: ', 'Guests: ') + s.g,
      T('Total estimado en la web: ', 'Total estimated on the website: ') + eur(s.total), '',
      T('Nombre: ', 'Name: ') + (name || '—'), '', T('Gracias.', 'Thank you.')
    ]);
    toast(T('Abriendo tu correo con la solicitud…', 'Opening your email with the request…'));
  });
  var calReady = false;
  nearView('reservar', function () { calReady = true; renderRoomSelect(); renderCal(); updateQuote(); });
  rerender.push(function () { if (!calReady) return; renderRoomSelect(); renderCal(); updateQuote(); $('#cal-hint').textContent = ci && !co ? T('Ahora toca el día de salida.', 'Now tap your departure day.') : T('Toca el día de llegada y después el de salida.', 'Tap your arrival day, then your departure day.'); });
  matchMedia('(min-width: 1024px)').addEventListener('change', function () { if (calReady) renderCal(); });

  /* ================= MENU: typographic list, photo follows the course ================= */
  var MPH = { entrantes: 'r34-pulpo', veg: 'r34-veg', principales: 'r34-principal', postres: 'r34-postre', cocteles: 'r34-coctel' };
  var mFrame = $('#m-frame'), mBuilt = false, mCur = -1, mIO = null;
  function buildPhotos() {
    if (mBuilt) return; mBuilt = true;
    var keys = Object.keys(MPH).map(function (k) { return MPH[k]; }).concat(['r34-aceite']);
    mFrame.innerHTML = keys.map(function (k) {
      var big = k === 'r34-aceite' ? '1000' : '1200', small = k === 'r34-aceite' ? '600' : '700';
      return '<img data-k="' + k + '" src="img/' + k + '-' + small + '.webp" srcset="img/' + k + '-' + small + '.webp ' + small + 'w, img/' + k + '-' + big + '.webp ' + big + 'w" sizes="(min-width: 1024px) 42vw, 100vw" alt="" loading="lazy" decoding="async">';
    }).join('');
  }
  function setPhoto(si, dish, k) {
    buildPhotos();
    var s = D.menu[si], key = (si === 0 && k === 0) ? 'r34-aceite' : MPH[s.id];
    $$('img', mFrame).forEach(function (im) { im.classList.toggle('on', im.dataset.k === key); });
    $('#m-cap-dish').textContent = dish || L(s);
    if (si !== mCur) { mCur = si; $$('.m-nav button').forEach(function (b, j) { b.setAttribute('aria-current', String(j === si)); }); }
  }
  function renderMenu() {
    $('#m-nav').innerHTML = D.menu.map(function (s, i) { return '<button type="button" data-s="' + i + '" aria-current="' + (i === Math.max(0, mCur)) + '">' + esc(L(s)) + '</button>'; }).join('');
    $('#menu-body').innerHTML = D.menu.map(function (s, si) {
      return '<section class="m-sec" id="m-' + s.id + '" data-s="' + si + '"><h4 class="m-sh"><span class="m-sn">' + String(si + 1).padStart(2, '0') + '</span>' + esc(L(s)) + '</h4><ul class="m-list">' + s.items.map(function (it, k) {
        var price = it[2] === null ? T('consultar', 'ask') : it[2] === 'sm' ? T('según mercado', 'market price') : eur(it[2]);
        var star = it[3] ? '<small>' + T('citado en reseñas', 'mentioned in reviews') + '</small>' : '';
        return '<li tabindex="0" data-s="' + si + '" data-k="' + k + '"><span class="m-name">' + esc(lang === 'en' ? it[1] : it[0]) + star + '</span><span class="m-dots" aria-hidden="true"></span><span class="m-price">' + price + '</span></li>';
      }).join('') + '</ul></section>';
    }).join('');
    if (mIO) mIO.disconnect();
    if ('IntersectionObserver' in window) {
      mIO = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) setPhoto(+e.target.dataset.s); }); }, { rootMargin: '-45% 0px -50% 0px' });
      $$('.m-sec').forEach(function (s) { mIO.observe(s); });
    }
    setPhoto(Math.max(0, mCur));
  }
  var mBody = $('#menu-body');
  var dishHit = function (e) { var li = e.target.closest('.m-list li'); if (!li) return; setPhoto(+li.dataset.s, $('.m-name', li).firstChild.textContent, +li.dataset.k); };
  mBody.addEventListener('pointerover', dishHit); mBody.addEventListener('focusin', dishHit); mBody.addEventListener('click', dishHit);
  $('#m-nav').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return; var s = D.menu[+b.dataset.s];
    var el = document.getElementById('m-' + s.id), y = el.getBoundingClientRect().top + scrollY - (innerWidth < 1024 ? innerHeight * 0.42 : 140);
    scrollTo({ top: y, behavior: RM ? 'auto' : 'smooth' }); setPhoto(+b.dataset.s);
  });
  var menuReady = false;
  nearView('restaurante', function () { menuReady = true; renderMenu(); });
  rerender.push(function () { if (menuReady) renderMenu(); });

  /* ================= TABLE BOOKING ================= */
  var tbDate = $('#tb-date'), tbPeople = $('#tb-people'), tbTime = null;
  var HOURS = { r34: [['13:00', '14:30'], ['19:00', '22:00']], tapas: [['12:30', '15:00'], ['19:00', '22:30']] };
  function slots(a, b) { var out = [], p = a.split(':'), q = b.split(':'), m = +p[0] * 60 + +p[1], e = +q[0] * 60 + +q[1]; for (; m <= e; m += 30) out.push(String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0')); return out; }
  function venue() { return $('input[name="venue"]:checked').value; }
  function renderPeople() { var v = tbPeople.value || '2'; var h = ''; for (var i = 1; i <= 12; i++) h += '<option value="' + i + '">' + i + '</option>'; tbPeople.innerHTML = h; tbPeople.value = v; }
  function renderTimes() {
    var box = $('#tb-times'), d = parse(tbDate.value);
    if (d && d.getDay() === 1) { box.innerHTML = '<p class="t-none">' + T('Cerrado los lunes. Elige otro día.', 'Closed on Mondays. Please choose another day.') + '</p>'; tbTime = null; tbSummary(); return; }
    var h = HOURS[venue()], html = '';
    [T('Comida', 'Lunch'), T('Cena', 'Dinner')].forEach(function (g, gi) {
      html += '<span class="t-group">' + g + '</span>';
      slots(h[gi][0], h[gi][1]).forEach(function (t) { html += '<button type="button" class="t-btn" role="radio" aria-checked="' + (t === tbTime) + '" data-t="' + t + '">' + t + '</button>'; });
    });
    box.innerHTML = html;
    if (tbTime && !$('.t-btn[data-t="' + tbTime + '"]', box)) tbTime = null;
    tbSummary();
  }
  $('#tb-times').addEventListener('click', function (e) {
    var b = e.target.closest('.t-btn'); if (!b) return; tbTime = b.dataset.t;
    $$('.t-btn').forEach(function (x) { x.setAttribute('aria-checked', String(x === b)); }); tbSummary();
  });
  function tbSummary() {
    var n = +tbPeople.value || 2, parts = [];
    if ($('#tb-sea').checked) parts.push(T('Suplemento vistas: ', 'Sea-view supplement: ') + eur(10 * n));
    if (n >= 7) parts.push(T('Depósito de grupo: ', 'Group deposit: ') + eur(20 * n));
    if ($('#tb-guest').checked) parts.push(T('10 % de descuento de huésped en la cuenta', '10% guest discount on the bill'));
    var d = parse(tbDate.value);
    if (d && d < new Date(2027, 1, 26)) parts.unshift(T('Cerrado por vacaciones: reapertura [por confirmar]', 'Closed for the holidays: reopening [to be confirmed]'));
    $('#tb-sum').textContent = parts.join(' · ');
  }
  tbDate.addEventListener('change', renderTimes);
  tbPeople.addEventListener('change', tbSummary);
  $('#tb-sea').addEventListener('change', tbSummary); $('#tb-guest').addEventListener('change', tbSummary);
  $$('input[name="venue"]').forEach(function (r) { r.addEventListener('change', renderTimes); });
  $('#tb-form').addEventListener('submit', function (e) {
    e.preventDefault(); var err = $('#tb-err'), d = parse(tbDate.value);
    if (!d) { err.textContent = T('Elige un día.', 'Choose a day.'); tbDate.focus(); return; }
    if (d.getDay() === 1) { err.textContent = T('Los lunes está cerrado.', 'It is closed on Mondays.'); return; }
    if (!tbTime) { err.textContent = T('Elige una hora.', 'Choose a time.'); $('#tb-times').querySelector('button') && $('#tb-times').querySelector('button').focus(); return; }
    err.textContent = '';
    var n = tbPeople.value, v = venue() === 'r34' ? 'Restaurante 34' : T('Bar de tapas 34', 'Tapas Bar 34');
    mailto(T('Reserva de mesa: ', 'Table booking: ') + v + ' · ' + iso(d) + ' ' + tbTime, [
      T('Hola, me gustaría reservar mesa:', 'Hello, I would like to book a table:'), '',
      v, fmtDate(d) + ' · ' + tbTime, T('Personas: ', 'People: ') + n,
      $('#tb-sea').checked ? T('Mesa en primera línea con vistas al mar (+10 € por persona)', 'Front-line sea-view table (+€10 per person)') : '',
      $('#tb-guest').checked ? T('Me alojo en el hotel.', 'I am staying at the hotel.') : '', '', T('Gracias.', 'Thank you.')
    ].filter(function (x, i, a) { return x !== '' || (a[i - 1] !== ''); }));
    toast(T('Abriendo tu correo…', 'Opening your email…'));
  });
  rerender.push(function () { renderPeople(); renderTimes(); });

  /* ================= VOUCHER BUILDER ================= */
  var card = $('#v-card'), vTo = $('#v-to-in'), vFrom = $('#v-from-in'), vMsg = $('#v-msg-in');
  function vAmt() { return $('input[name="amt"]:checked').value; }
  function vUpdate(popAmt) {
    var a = $('#v-amt');
    if (a.textContent !== vAmt()) { a.textContent = vAmt(); if (popAmt && !RM) { a.classList.remove('pop'); void a.offsetWidth; a.classList.add('pop'); } }
    $('#v-to').textContent = vTo.value.trim() || '—';
    $('#v-from').textContent = vFrom.value.trim() || '—';
    $('#v-msg').textContent = vMsg.value.trim();
    $('#v-count').textContent = vMsg.value.length + '/120';
    card.className = 'v-card v-t-' + $('input[name="theme"]:checked').value + (card.classList.contains('tilting') ? ' tilting' : '');
  }
  $$('input[name="amt"]').forEach(function (r) { r.addEventListener('change', function () { vUpdate(true); $('#v-live').textContent = T('Bono de ', 'Voucher for ') + eur(+vAmt()); }); });
  $$('input[name="theme"]').forEach(function (r) { r.addEventListener('change', function () { vUpdate(false); }); });
  [vTo, vFrom, vMsg].forEach(function (i) { i.addEventListener('input', function () { vUpdate(false); }); });
  if (!RM) {
    var stage = $('#v-stage'), tq = false, tx = 0, ty = 0;
    var tilt = function () { tq = false; card.style.setProperty('--ry', (tx * 14).toFixed(2) + 'deg'); card.style.setProperty('--rx', (-ty * 10).toFixed(2) + 'deg'); card.style.setProperty('--sx', (tx * 40).toFixed(1) + '%'); };
    stage.addEventListener('pointermove', function (e) {
      var r = card.getBoundingClientRect();
      tx = clamp((e.clientX - r.left) / r.width - 0.5, -0.6, 0.6); ty = clamp((e.clientY - r.top) / r.height - 0.5, -0.6, 0.6);
      card.classList.add('tilting'); if (!tq) { tq = true; requestAnimationFrame(tilt); }
    });
    stage.addEventListener('pointerleave', function () { card.classList.remove('tilting'); tx = ty = 0; tilt(); });
    /* one slow showcase sweep when the card first comes into view */
    if ('IntersectionObserver' in window) {
      var vIO = new IntersectionObserver(function (es) {
        if (!es[0].isIntersecting) return; vIO.disconnect();
        setTimeout(function () { tx = 0.35; ty = -0.15; tilt(); setTimeout(function () { tx = -0.2; ty = 0.1; tilt(); setTimeout(function () { tx = ty = 0; tilt(); }, 650); }, 650); }, 400);
      }, { threshold: 0.6 });
      vIO.observe(card);
    }
  }
  $('#v-form').addEventListener('submit', function (e) {
    e.preventDefault(); var err = $('#v-err');
    if (!vTo.value.trim()) { err.textContent = T('Escribe para quién es el bono.', 'Write who the voucher is for.'); vTo.focus(); return; }
    err.textContent = '';
    mailto(T('Bono regalo Restaurante 34: ', 'Restaurante 34 gift voucher: ') + eur(+vAmt()), [
      T('Hola, me gustaría comprar un bono regalo del Restaurante 34:', 'Hello, I would like to buy a Restaurante 34 gift voucher:'), '',
      T('Importe: ', 'Amount: ') + eur(+vAmt()), T('Para: ', 'For: ') + vTo.value.trim(), T('De: ', 'From: ') + (vFrom.value.trim() || '—'),
      T('Mensaje: ', 'Message: ') + (vMsg.value.trim() || '—'), T('Acabado: ', 'Finish: ') + $('input[name="theme"]:checked').parentNode.textContent.trim(), '',
      T('¿Cómo puedo pagarlo y recibirlo?', 'How can I pay and receive it?'), T('Gracias.', 'Thank you.')
    ]);
    toast(T('Abriendo tu correo…', 'Opening your email…'));
  });
  rerender.push(function () { vUpdate(false); });

  /* ================= WEDDING PLANNER: top-down terrace ================= */
  var wG = $('#w-guests'), wOut = $('#w-guests-out'), tablesG = $('#plan-tables'), lightsG = $('#plan-lights'), plan = $('.plan');
  var lawn = $('#pl-lawn'), gardenG = $('#pl-garden'), zoneA = $('#pl-zoneA'), zoneB = $('#pl-zoneB');
  /* filled from the sea edge inwards */
  var TPOS = [[115, 196], [205, 196], [295, 196], [70, 130], [160, 130], [250, 130], [340, 130], [115, 64], [205, 64], [295, 64]];
  function buildPlan() {
  TPOS.forEach(function (p) {
    var g = svgEl('g', { 'class': 'pl-t off' });
    g.appendChild(svgEl('circle', { 'class': 'pl-sh', cx: p[0] + 3, cy: p[1] + 5, r: 27, fill: 'url(#pl-shadow)' }));
    var top = svgEl('g', { 'class': 'pl-top' });
    for (var s = 0; s < 10; s++) {
      var a = s / 10 * Math.PI * 2, cx = p[0] + Math.cos(a) * 21, cy = p[1] + Math.sin(a) * 21;
      top.appendChild(svgEl('rect', { 'class': 'pl-ch', x: (cx - 3.4).toFixed(1), y: (cy - 3).toFixed(1), width: 6.8, height: 6, rx: 2, transform: 'rotate(' + (a * 180 / Math.PI + 90).toFixed(0) + ' ' + cx.toFixed(1) + ' ' + cy.toFixed(1) + ')' }));
    }
    top.appendChild(svgEl('circle', { 'class': 'pl-cloth', cx: p[0], cy: p[1], r: 15 }));
    top.appendChild(svgEl('circle', { 'class': 'pl-glow', cx: p[0], cy: p[1], r: 9, fill: 'url(#pl-candle)' }));
    top.appendChild(svgEl('circle', { 'class': 'pl-flower', cx: p[0], cy: p[1], r: 2.6 }));
    g.appendChild(top);
    tablesG.appendChild(g);
  });
  /* three strings of festoon lights draped across the terrace */
  var STR = [[38, 30], [104, 26], [170, 24]];
  STR.forEach(function (sd) {
    var y = sd[0], sag = sd[1], g = svgEl('g', { 'class': 'pl-str' });
    g.appendChild(svgEl('path', { 'class': 'pl-wire', d: 'M12 ' + y + ' Q200 ' + (y + sag * 2) + ' 388 ' + y }));
    for (var k = 1; k < 16; k++) {
      var t = k / 16, x = (1 - t) * (1 - t) * 12 + 2 * (1 - t) * t * 200 + t * t * 388, yy = (1 - t) * (1 - t) * y + 2 * (1 - t) * t * (y + sag * 2) + t * t * y;
      g.appendChild(svgEl('circle', { cx: x.toFixed(1), cy: (yy + 2).toFixed(1), r: 7.5, fill: 'url(#pl-bulb)' }));
      g.appendChild(svgEl('circle', { 'class': 'pl-b', cx: x.toFixed(1), cy: (yy + 2).toFixed(1), r: 1.5 }));
    }
    lightsG.appendChild(g);
  });
  wUpdate();
  }
  nearView('bodas', buildPlan);
  var planLive = false;
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) {
      var v = es[0].isIntersecting; plan.classList.toggle('live', v);
      if (v && !planLive) { planLive = true; wUpdate(); }
    }, { threshold: 0.25 }).observe(plan);
  } else planLive = true;
  function wUpdate() {
    var g = +wG.value, n = Math.ceil(g / 10), space = $('input[name="space"]:checked').value;
    wOut.textContent = g;
    var shown = planLive ? n : 0, fresh = 0;
    $$('.pl-t', tablesG).forEach(function (t, i) {
      var on = i < shown, was = !t.classList.contains('off');
      if (on && !was) { t.style.setProperty('--d', (fresh++ * 70) + 'ms'); } else if (!on) t.style.setProperty('--d', '0ms');
      t.classList.toggle('off', !on);
      var filled = Math.min(10, Math.max(0, g - i * 10));
      $$('.pl-ch', t).forEach(function (s, k) { s.classList.toggle('e', k >= filled); });
    });
    $$('.pl-str', lightsG).forEach(function (s, i) { s.style.opacity = planLive ? clamp((g - [14, 44, 74][i]) / 22, 0, 1).toFixed(2) : 0; });
    plan.style.setProperty('--candle', clamp((g - 14) / 40, 0, 1).toFixed(2));
    lawn.setAttribute('height', space === 'jardin' ? 222 : 104);
    gardenG.style.opacity = space === 'terraza' ? 0 : 1;
    zoneA.textContent = space === 'terraza' ? T('Terraza', 'Terrace') : T('Jardín', 'Garden');
    zoneB.textContent = space === 'jardin' ? '' : T('Terraza al mar', 'Sea terrace');
    $('#plan-cap').textContent = g + ' ' + T('invitados · ', 'guests · ') + n + ' ' + T(n === 1 ? 'mesa redonda' : 'mesas redondas', n === 1 ? 'round table' : 'round tables') + T(' de 10 (esquema orientativo)', ' of 10 (indicative sketch)');
    var tier = $('input[name="tier"]:checked').parentNode.textContent.trim(), sp = $('input[name="space"]:checked').parentNode.textContent.trim();
    var rm = +$('#w-rooms').value;
    $('#w-sum').innerHTML = '<p class="ws-big">' + g + ' ' + T('invitados', 'guests') + ' · ' + esc(sp) + '</p><p>' + T('Menú ', 'Menu: ') + esc(tier.toLowerCase()) + ' · ' + T('precio por persona [por confirmar]', 'price per person [to be confirmed]') + '</p><p>' +
      (rm === 7 ? T('Todo el hotel para vosotros: 7 habitaciones', 'The whole hotel to yourselves: 7 rooms') : rm ? rm + ' ' + T(rm === 1 ? 'habitación' : 'habitaciones', rm === 1 ? 'room' : 'rooms') + T(' para invitados', ' for guests') : T('Sin alojamiento', 'No accommodation')) + '</p>';
  }
  wG.addEventListener('input', wUpdate);
  $$('#w-form input[type="radio"], #w-rooms').forEach(function (el) { el.addEventListener('change', wUpdate); });
  $('#w-form').addEventListener('submit', function (e) {
    e.preventDefault();
    var d = parse($('#w-date').value), name = $('#w-name').value.trim();
    if (!name) { $('#w-err').textContent = T('Escribe vuestros nombres.', 'Write your names.'); $('#w-name').focus(); return; }
    $('#w-err').textContent = '';
    mailto(T('Consulta de evento: ', 'Event enquiry: ') + $('#w-type').selectedOptions[0].textContent + ' · ' + wG.value + T(' invitados', ' guests'), [
      T('Hola, nos gustaría celebrar nuestro evento en el Hotel Carabeo:', 'Hello, we would like to hold our event at Hotel Carabeo:'), '',
      T('Ocasión: ', 'Occasion: ') + $('#w-type').selectedOptions[0].textContent, T('Invitados: ', 'Guests: ') + wG.value,
      T('Espacio: ', 'Setting: ') + $('input[name="space"]:checked').parentNode.textContent.trim(),
      T('Estilo de menú: ', 'Menu style: ') + $('input[name="tier"]:checked').parentNode.textContent.trim(),
      T('Fecha deseada: ', 'Preferred date: ') + (d ? fmtDate(d) : T('flexible', 'flexible')),
      T('Habitaciones: ', 'Rooms: ') + $('#w-rooms').selectedOptions[0].textContent, '', T('Nombres: ', 'Names: ') + name, '', T('Gracias.', 'Thank you.')
    ]);
    toast(T('Abriendo tu correo…', 'Opening your email…'));
  });
  rerender.push(wUpdate);

  /* ================= UNA NOCHE EN EL CARABEO ================= */
  var night = $('#noche');
  if (night && !RM) {
    var steps = $$('.nt-step', night), imgs = steps.map(function (s) { return $('img', s); }), bars = $$('.nt-bar i', night);
    var sun = $('.nt-sun', night), dark = $('.nt-dark', night), nTop = 0, nH = 0, nVis = false, nQ = false;
    var nMeasure = function () { nTop = night.offsetTop; nH = night.offsetHeight; };
    var nTick = function () {
      nQ = false; if (!nVis) return;
      var p = clamp((scrollY - nTop) / Math.max(1, nH - innerHeight), 0, 1), c = p * 4;
      steps.forEach(function (s, i) {
        var a = i === 0 ? 1 : seg(c, i - 0.18, i + 0.12);
        s.style.opacity = a.toFixed(3);
        var local = clamp(c - i + 0.2, 0, 1.4);
        imgs[i].style.transform = 'scale(' + (1.14 - local * 0.09).toFixed(4) + ') translate3d(0,' + (local * -1.6).toFixed(2) + '%,0)';
        var cp = $('.nt-copy', s), vis = Math.min(seg(c, i - 0.02, i + 0.2), 1 - (i === 3 ? 0 : seg(c, i + 0.75, i + 0.95)));
        cp.style.opacity = vis.toFixed(3); cp.style.transform = 'translate3d(0,' + ((1 - vis) * 24).toFixed(1) + 'px,0)';
        bars[i].style.transform = 'scaleX(' + clamp(c - i, 0, 1).toFixed(3) + ')';
      });
      /* light: the sun sinks through chapter II, night peaks at III, morning lifts it */
      sun.style.opacity = ((seg(c, 0.6, 1.3) * (1 - seg(c, 1.8, 2.3)) + seg(c, 3.0, 3.6) * 0.5) * 0.75).toFixed(3);
      sun.style.transform = 'translate3d(0,' + (seg(c, 0.6, 2.2) * 38 - seg(c, 3.0, 3.8) * 30).toFixed(1) + 'vh,0)';
      dark.style.opacity = (seg(c, 1.6, 2.3) * (1 - seg(c, 2.85, 3.2))).toFixed(3);
    };
    var nScroll = function () { if (!nQ) { nQ = true; requestAnimationFrame(nTick); } };
    night.classList.add('js-night');
    nMeasure(); addEventListener('resize', function () { nMeasure(); nScroll(); }, { passive: true });
    addEventListener('scroll', nScroll, { passive: true });
    new IntersectionObserver(function (es) { nVis = es[0].isIntersecting; if (nVis) { nMeasure(); imgs.forEach(function (im) { im.loading = 'eager'; }); nScroll(); } }, { rootMargin: '400px 0px' }).observe(night);
  }

  /* ================= fact counters ================= */
  var counters = $$('[data-count]');
  if (counters.length && !RM && 'IntersectionObserver' in window) {
    var cIO = new IntersectionObserver(function (es) {
      if (!es[0].isIntersecting) return; cIO.disconnect();
      counters.forEach(function (el) {
        var to = +el.dataset.count, from = +(el.dataset.from || 0), t0 = performance.now();
        var f = function (now) { var k = clamp((now - t0) / 1100, 0, 1), e = 1 - Math.pow(1 - k, 3); el.textContent = Math.round(from + (to - from) * e); if (k < 1) requestAnimationFrame(f); };
        el.textContent = from; requestAnimationFrame(f);
      });
    }, { threshold: 0.6 });
    cIO.observe($('.facts-list'));
  }

  /* ================= custom cursor (desktop, fine pointer only) ================= */
  var cursorEl = $('.cursor');
  if (cursorEl && !RM && matchMedia('(hover: hover) and (pointer: fine)').matches) {
    var cxp = -100, cyp = -100, tx2 = -100, ty2 = -100, cRun = false;
    var cLoop = function () {
      cxp += (tx2 - cxp) * 0.22; cyp += (ty2 - cyp) * 0.22;
      cursorEl.style.transform = 'translate3d(' + cxp.toFixed(1) + 'px,' + cyp.toFixed(1) + 'px,0)';
      if (Math.abs(tx2 - cxp) + Math.abs(ty2 - cyp) > 0.4) requestAnimationFrame(cLoop); else cRun = false;
    };
    addEventListener('pointermove', function (e) {
      if (e.pointerType !== 'mouse') return;
      tx2 = e.clientX; ty2 = e.clientY; cursorEl.classList.add('show');
      if (!cRun) { cRun = true; requestAnimationFrame(cLoop); }
    }, { passive: true });
    document.addEventListener('pointerover', function (e) {
      var t = e.target.closest('a, button, input, select, textarea, label, .rg-slide, .m-list li, .cal-day');
      cursorEl.classList.toggle('big', !!t);
      cursorEl.classList.toggle('view', !!e.target.closest('.rg-slide'));
    });
    document.addEventListener('pointerdown', function () { cursorEl.classList.add('press'); });
    document.addEventListener('pointerup', function () { cursorEl.classList.remove('press'); });
    document.documentElement.addEventListener('pointerleave', function () { cursorEl.classList.remove('show'); });
  }

  /* ================= walk bars ================= */
  var walk = $('.walk');
  if (walk && 'IntersectionObserver' in window && !RM) new IntersectionObserver(function (es, o) { if (es[0].isIntersecting) { walk.classList.add('in'); o.disconnect(); } }, { threshold: 0.4 }).observe(walk);
  else if (walk) walk.classList.add('in');

  /* ================= init ================= */
  measure(); heroTick();
  function boot() { applyLang(); measure(); heroTick(); }
  if (lang === 'en') boot();
  else {
    /* Spanish is already in the markup: build the interactive parts in small idle chunks to keep the main thread free */
    var queue = rerender.concat([measure, heroTick]);
    var step = function (dl) {
      do { var f = queue.shift(); if (f) f(); } while (queue.length && dl && dl.timeRemaining && dl.timeRemaining() > 12);
      if (queue.length) schedule();
    };
    var schedule = function () { if (window.requestIdleCallback) requestIdleCallback(step, { timeout: 1200 }); else setTimeout(step, 60); };
    schedule();
  }
})();
