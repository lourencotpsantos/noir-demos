/* Clínica Dental Cabello · concept by Noir Digital · vanilla JS, no build */
(function () {
  'use strict';
  var D = window.I18N;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var WA = '34665482102';
  var EMAIL = 'info@clinicadentalcabello.es';
  var LANGS = ['es', 'en', 'fr'];
  var lang = 'es';
  try { var saved = localStorage.getItem('cabello-lang'); if (LANGS.indexOf(saved) > -1) lang = saved; } catch (e) {}

  function U(k) { return D.ui[lang][k]; }
  function fmt(s, o) { return s.replace(/\{(\w+)\}/g, function (_, k) { return o[k] != null ? o[k] : ''; }); }
  function L(obj) { return obj[lang] || obj.es; }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]; }); }
  var TBY = {}; D.treatments.forEach(function (t) { TBY[t.id] = t; });

  /* ---------- Icons ---------- */
  var TOOTH = 'M8.2 3.6C5.6 3.6 4 5.7 4 8.4c0 2.4 1 3.8 1.7 6.2.5 2.1.8 4.7 2.3 4.7 1.4 0 1.4-3.5 2.3-4.8.4-.5 1.7-.5 2.1 0 .9 1.3.9 4.8 2.3 4.8 1.5 0 1.8-2.6 2.3-4.7.7-2.4 1.7-3.8 1.7-6.2 0-2.7-1.6-4.8-4.2-4.8-1.7 0-2.7.8-4.2.8s-2.4-.8-4.1-.8z';
  var ICONS = {
    implant: 'M8 3.5h8a2 2 0 0 1 2 2c0 2.2-1.3 4-3 4H9c-1.7 0-3-1.8-3-4a2 2 0 0 1 2-2zM12 9.5V12M9.5 12.5h5M9.8 15.5h4.4M10.3 18.5h3.4M11.2 21h1.6',
    aligner: 'M3 9c3-3 15-3 18 0l-1 6c-.3 2-1.6 3-3.5 3h-9C5.6 18 4.3 17 4 15zM8 10.3v5.2M12 9.8v6M16 10.3v5.2',
    spark: 'M12 3c.6 4.5 2.5 7 7 8.5-4.5 1.5-6.4 4-7 8.5-.6-4.5-2.5-7-7-8.5C9.5 10 11.4 7.5 12 3zM19 2.5v3M17.5 4h3',
    braces: 'M3.5 7.5h17v9h-17zM3.5 12h17M8 10.5v3M12 10.5v3M16 10.5v3',
    gum: TOOTH + 'M2.5 11.8c3.2 1.6 6.3 1.6 9.5 0s6.3-1.6 9.5 0',
    surgery: 'M14 4.5l5.5 5.5M16.8 7.2 8 16l-3.5 1.5L6 14l8.8-8.8M4 20h7',
    root: TOOTH + 'M10.4 12.5v5M13.6 12.5v5',
    filling: TOOTH + 'M9 8.2c1.8 1.3 4.2 1.3 6 0',
    crown: 'M4 9l3.5 3 4.5-6 4.5 6L20 9l-1.6 9H5.6zM5.5 21h13',
    jaw: 'M5 7c0 7 3 12 7 12s7-5 7-12M3 6.5a2 2 0 1 0 4 0 2 2 0 1 0-4 0M17 6.5a2 2 0 1 0 4 0 2 2 0 1 0-4 0',
    kid: 'M12 3a9 9 0 1 0 0 18 9 9 0 1 0 0-18zM8.5 14c1.8 2 5.2 2 7 0M9 9.5v.5M15 9.5v.5',
    shield: 'M12 3 4.5 6v5.5c0 4.6 3.2 8.3 7.5 9.5 4.3-1.2 7.5-4.9 7.5-9.5V6zM8.8 12l2.2 2.2 4.4-4.4',
    search: 'M10.5 4a6.5 6.5 0 1 0 0 13 6.5 6.5 0 1 0 0-13zM15.3 15.3 20 20',
    bolt: 'M13 2.5 5 13.5h6l-1 8 8-11h-6z',
    help: 'M12 3a9 9 0 1 0 0 18 9 9 0 1 0 0-18zM9.5 9.3a2.6 2.6 0 0 1 5 .9c0 1.8-2.5 2.2-2.5 3.8M12 16.8v.4'
  };
  function icon(name, cls) {
    return '<svg class="' + (cls || '') + '" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="' + ICONS[name] + '" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  }
  var ARROW = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><use href="#i-arrow"/></svg>';

  /* ---------- i18n for static markup ---------- */
  var ES = {}, ESA = [];
  $$('[data-i18n]').forEach(function (el) { ES[el.dataset.i18n] = el.innerHTML; });
  $$('[data-i18n-attr]').forEach(function (el) {
    el.dataset.i18nAttr.split(';').forEach(function (pair) {
      var p = pair.split(':'); ESA.push({ el: el, attr: p[0], key: p[1], val: el.getAttribute(p[0]) });
    });
  });

  function applyStatic() {
    var dict = lang === 'es' ? ES : D[lang];
    $$('[data-i18n]').forEach(function (el) {
      var v = dict[el.dataset.i18n]; if (v == null) v = ES[el.dataset.i18n];
      if (v != null && el.innerHTML !== v) el.innerHTML = v;
    });
    ESA.forEach(function (a) {
      var v = lang === 'es' ? a.val : (D[lang][a.key] != null ? D[lang][a.key] : a.val);
      a.el.setAttribute(a.attr, v);
    });
    document.documentElement.lang = lang;
    document.title = D.meta[lang].title;
    var md = $('meta[name="description"]'); if (md) md.setAttribute('content', D.meta[lang].desc);
    $$('.lang-btn').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.lang === lang)); });
  }

  function setLang(l) {
    lang = l;
    try { localStorage.setItem('cabello-lang', l); } catch (e) {}
    applyStatic();
    renderAll();
  }
  $$('.lang-btn').forEach(function (b) { b.addEventListener('click', function () { if (b.dataset.lang !== lang) setLang(b.dataset.lang); }); });

  /* ---------- Header + menu ---------- */
  var header = $('.site-header');
  var onScroll = function () { header.classList.toggle('scrolled', window.scrollY > 8); };
  window.addEventListener('scroll', onScroll, { passive: true }); requestAnimationFrame(onScroll);

  var menuBtn = $('.menu-btn'), menu = $('#mobile-menu');
  function setMenu(open) {
    menuBtn.setAttribute('aria-expanded', String(open));
    menu.hidden = !open;
    document.body.style.overflow = open ? 'hidden' : '';
    var key = open ? 'close' : 'menuOpen';
    menuBtn.setAttribute('aria-label', lang === 'es' ? (open ? 'Cerrar menú' : 'Abrir menú') : (open ? D[lang].close : D[lang].menuOpen));
    if (open) { var f = $('a', menu); if (f) f.focus(); }
  }
  menuBtn.addEventListener('click', function () { setMenu(menuBtn.getAttribute('aria-expanded') !== 'true'); });
  $$('a', menu).forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && menuBtn.getAttribute('aria-expanded') === 'true') { setMenu(false); menuBtn.focus(); }
  });

  function scrollToEl(el, center) {
    var r = el.getBoundingClientRect(), head = header.offsetHeight + 12;
    var top = r.top + window.scrollY - (center ? Math.max(head, (window.innerHeight - r.height) / 2) : head);
    window.scrollTo({ top: Math.max(0, top), behavior: REDUCED ? 'auto' : 'smooth' });
  }

  /* ---------- Reveal on scroll ---------- */
  function initReveal() {
    $$('.section-head').forEach(function (el) { el.classList.add('reveal'); });
    var revealEls = $$('.reveal, .reveal-group');
    if (REDUCED || !('IntersectionObserver' in window)) {
      revealEls.forEach(function (el) { el.classList.add('in'); });
    } else {
      var rio = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); rio.unobserve(en.target); } });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
      revealEls.forEach(function (el, i) { el.style.transitionDelay = (Math.min(i % 4, 3) * 70) + 'ms'; rio.observe(el); });
    }
  }

  /* ---------- Hours / open now (Europe/Madrid) ---------- */
  var HOURS = { 0: null, 1: [9, 21], 2: [9, 21], 3: [9, 21], 4: [9, 21], 5: [9, 21], 6: [11, 13] };
  function madridNow() {
    try {
      var parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Madrid', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false, year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date());
      var o = {}; parts.forEach(function (p) { o[p.type] = p.value; });
      var wd = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(o.weekday);
      return { wd: wd, h: (+o.hour) % 24, m: +o.minute, y: +o.year, mo: +o.month, d: +o.day };
    } catch (e) {
      var n = new Date(); return { wd: n.getDay(), h: n.getHours(), m: n.getMinutes(), y: n.getFullYear(), mo: n.getMonth() + 1, d: n.getDate() };
    }
  }
  function hh(h) { return lang === 'fr' ? h + 'h00' : (h < 10 ? '0' + h : h) + ':00'; }
  function renderOpen() {
    var n = madridNow(), today = HOURS[n.wd], t = n.h + n.m / 60, text, open = false;
    if (today && t >= today[0] && t < today[1]) { open = true; text = fmt(U('openNow'), { t: hh(today[1]) }); }
    else {
      var off = (today && t < today[0]) ? 0 : 1, wd = (n.wd + off) % 7;
      while (!HOURS[wd]) { off++; wd = (n.wd + off) % 7; }
      var dname = off === 0 ? U('today') : off === 1 ? U('tomorrow') : U('days')[wd];
      text = fmt(U('closedNow'), { d: dname, t: hh(HOURS[wd][0]) });
    }
    $$('[data-open-chip]').forEach(function (chip) {
      chip.classList.toggle('is-open', open);
      var s = $('.open-text', chip); s.textContent = text; s.removeAttribute('data-i18n');
    });
    var tb = $('#hours-table tbody'); if (!tb) return;
    var order = [1, 2, 3, 4, 5, 6, 0], html = '';
    order.forEach(function (d) {
      var h = HOURS[d], isT = d === n.wd;
      html += '<tr' + (isT ? ' class="today"' : '') + '><th scope="row"' + (isT ? ' data-today="' + U('todayTag') + '"' : '') + '>' + U('days')[d] + '</th><td>' + (h ? hh(h[0]) + ' – ' + hh(h[1]) : U('closed')) + '</td></tr>';
    });
    tb.innerHTML = html;
  }

  /* ---------- Treatments grid + sheet ---------- */
  var grid = $('#treat-grid'), filter = 'all';
  function renderGrid(animate) {
    var html = '';
    D.treatments.forEach(function (t) {
      var hidden = filter !== 'all' && t.cat !== filter;
      html += '<li class="tcard' + (t.feat ? ' feat' : '') + (hidden ? ' is-hidden' : '') + (animate && !hidden ? ' pop' : '') + '" data-cat="' + t.cat + '">' +
        '<button type="button" data-open="' + t.id + '" aria-haspopup="dialog">' +
        (t.feat ? icon(t.icon, 't-bg') : '') +
        '<span class="t-ico">' + icon(t.icon) + '</span>' +
        '<span class="t-txt"><h3>' + esc(L(t.name)) + '</h3><p>' + esc(L(t.short)) + '</p>' + (t.feat ? '<span class="t-tag">' + esc(L(t.tag)) + '</span>' : '') + '</span>' +
        '<span class="t-go">' + ARROW + '</span></button></li>';
    });
    grid.innerHTML = html;
    if (animate && !REDUCED) $$('.tcard.pop', grid).forEach(function (c, i) { c.style.animationDelay = (i * 40) + 'ms'; });
    var n = filter === 'all' ? D.treatments.length : D.treatments.filter(function (t) { return t.cat === filter; }).length;
    $('#filter-status').textContent = animate ? fmt(U('showing'), { n: n }) : '';
  }
  $$('[data-filter]').forEach(function (b) {
    b.addEventListener('click', function () {
      filter = b.dataset.filter;
      $$('[data-filter]').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      renderGrid(true);
    });
  });

  var sheet = $('#sheet'), sheetBody = $('#sheet-body'), sheetId = null, sheetOpener = null;
  function sheetHTML(t) {
    var who = (t.who === 'dr' || t.who === 'ortho') ? '<p class="sh-who"><strong>' + esc(U('who')) + ':</strong> ' + esc(L(D.who[t.who])) + '</p>' : '';
    var media = t.id === 'estetica' ? '<figure class="sh-media"><img src="img/smile-800.webp" width="800" height="533" alt="' + esc(lang === 'es' ? 'Sonrisa en primer plano (foto ilustrativa de archivo)' : lang === 'en' ? 'Close-up of a smile (illustrative stock photo)' : 'Sourire en gros plan (photo d’illustration)') + '" loading="lazy"><figcaption class="photo-tag">' + (lang === 'es' ? ES.photoTag : D[lang].photoTag) + '</figcaption></figure>' : '';
    return '<span class="sh-ico">' + icon(t.icon) + '</span>' +
      '<h2 id="sheet-title">' + esc(L(t.name)) + '</h2>' +
      '<p class="sh-lead">' + esc(L(t.lead)) + '</p>' + media +
      '<ul class="sh-points">' + L(t.points).map(function (p) { return '<li><svg aria-hidden="true"><use href="#i-check"/></svg><span>' + esc(p) + '</span></li>'; }).join('') + '</ul>' +
      '<dl class="sh-facts"><div><dt>' + esc(U('price')) + '</dt><dd><span class="ph">' + (lang === 'fr' ? '[prix]' : lang === 'en' ? '[price]' : '[precio]') + '</span></dd></div><div><dt>' + esc(U('duration')) + '</dt><dd>' + esc(U('byQuote')) + '</dd></div></dl>' +
      who +
      '<button type="button" class="btn btn-accent btn-lg btn-block" data-book="' + t.id + '">' + esc(U('bookThis')) + ARROW.replace('<svg', '<svg class="ico"') + '</button>';
  }
  function openSheet(id, opener) {
    var t = TBY[id]; if (!t) return;
    sheetId = id; sheetOpener = opener || document.activeElement;
    sheetBody.innerHTML = sheetHTML(t);
    if (typeof sheet.showModal === 'function') sheet.showModal(); else sheet.setAttribute('open', '');
    $('.sheet-in', sheet).scrollTop = 0;
    $('#sheet-close').focus();
  }
  function closeSheet() { if (sheet.open) sheet.close(); }
  sheet.addEventListener('close', function () { sheetId = null; if (sheetOpener && document.contains(sheetOpener)) sheetOpener.focus(); });
  sheet.addEventListener('click', function (e) {
    if (e.target === sheet) closeSheet();
    var b = e.target.closest('[data-book]');
    if (b) { var id = b.dataset.book; sheetOpener = null; closeSheet(); setTimeout(function () { goBook(id); }, 60); }
  });
  $('#sheet-close').addEventListener('click', closeSheet);
  document.addEventListener('click', function (e) {
    var o = e.target.closest('[data-open]'); if (o) openSheet(o.dataset.open, o);
  });

  /* ---------- Tooth map ---------- */
  var SVGNS = 'http://www.w3.org/2000/svg';
  var mouth = $('#mouth'), zone = null;
  var ZONE_OF = ['front', 'front', 'canine', 'premolar', 'premolar', 'molar', 'molar', 'molar'];
  function buildMouth() {
    var W = [8.5, 6.5, 7.5, 7, 6.5, 10, 9, 8.5], DEP = [15, 15, 19, 22, 22, 28, 27, 25], total = 0;
    W.forEach(function (w) { total += w; });
    var a = 118, b = 178, thMax = 1.5, k = 3.05, out = '';
    function arch(cy, dir) {
      var g = '', cum = 0, gumPts = [];
      for (var s = -1; s <= 1; s += 0.05) { var th = s * thMax * 1.04; gumPts.push((180 + a * Math.sin(th)).toFixed(1) + ',' + (cy - dir * b * Math.cos(th)).toFixed(1)); }
      g += '<polyline class="gum" data-zone="gums" points="' + gumPts.join(' ') + '" fill="none" stroke="#f7cdd1" stroke-width="46" stroke-linecap="round" stroke-linejoin="round"/>';
      for (var i = 0; i < 8; i++) {
        var th0 = (cum + W[i] / 2) / total * thMax; cum += W[i];
        [-1, 1].forEach(function (side) {
          var x = 180 + side * a * Math.sin(th0), y = cy - dir * b * Math.cos(th0);
          var ang = Math.atan2(-dir * -b * Math.sin(th0), side * a * Math.cos(th0)) * 180 / Math.PI;
          var w = W[i] * k, d = DEP[i], rx = i < 3 ? d / 2 : 7;
          var groove = i >= 3 ? '<path d="M' + (-w / 4).toFixed(1) + ' 0h' + (w / 2).toFixed(1) + (i >= 5 ? 'M0 ' + (-d / 4).toFixed(1) + 'v' + (d / 2).toFixed(1) : '') + '" stroke="#cfdcda" stroke-width="1.6" stroke-linecap="round" fill="none"/>' : '';
          var shape = roundRect(-w / 2, -d / 2, w, d, rx);
          g += '<g class="tooth" data-zone="' + ZONE_OF[i] + '" style="--d:' + (i * 45 + (dir < 0 ? 140 : 0)) + 'ms" transform="translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ') rotate(' + ang.toFixed(1) + ')">' +
            '<path class="t-halo" d="' + shape + '" fill="none" stroke="#2bb5a5" stroke-width="7" stroke-linejoin="round"/>' +
            '<path class="t-shape" d="' + shape + '" fill="#ffffff" stroke="#c9dcd8" stroke-width="1.6"/>' + groove + '</g>';
        });
      }
      return g;
    }
    out += '<ellipse cx="180" cy="128" rx="78" ry="76" fill="#fbe4e6"/>';
    out += '<path d="M120 330c0-40 26-58 60-58s60 18 60 58-26 66-60 66-60-26-60-66z" fill="#f5c0c6" opacity=".55"/>';
    out += arch(212, 1) + arch(258, -1);
    [[22, 235], [338, 235]].forEach(function (p) {
      out += '<g class="tmj" data-zone="joint"><circle class="tmj-c" cx="' + p[0] + '" cy="' + p[1] + '" r="16" fill="#ffffff" stroke="#c9dcd8" stroke-width="2"/><path d="M' + (p[0] - 6) + ' ' + (p[1] - 2) + 'q6 -8 12 0M' + (p[0] - 6) + ' ' + (p[1] + 4) + 'q6 6 12 0" fill="none" stroke="#7a8f96" stroke-width="2" stroke-linecap="round"/></g>';
    });
    mouth.innerHTML = out;
    mouth.addEventListener('click', function (e) { var g = e.target.closest('[data-zone]'); if (g) selectZone(g.getAttribute('data-zone'), true); });
    mouth.addEventListener('mouseover', function (e) {
      var g = e.target.closest('[data-zone]'); $$('.hov', mouth).forEach(function (x) { x.classList.remove('hov'); });
      if (g) $$('[data-zone="' + g.getAttribute('data-zone') + '"]', mouth).forEach(function (x) { x.classList.add('hov'); });
    });
  }
  function roundRect(x, y, w, h, r) {
    r = Math.min(r, w / 2, h / 2);
    return 'M' + (x + r).toFixed(1) + ' ' + y.toFixed(1) + 'h' + (w - 2 * r).toFixed(1) + 'a' + r + ' ' + r + ' 0 0 1 ' + r + ' ' + r + 'v' + (h - 2 * r).toFixed(1) + 'a' + r + ' ' + r + ' 0 0 1 ' + (-r) + ' ' + r + 'h' + (-(w - 2 * r)).toFixed(1) + 'a' + r + ' ' + r + ' 0 0 1 ' + (-r) + ' ' + (-r) + 'v' + (-(h - 2 * r)).toFixed(1) + 'a' + r + ' ' + r + ' 0 0 1 ' + r + ' ' + (-r) + 'z';
  }
  function renderZoneBtns() {
    $('#zone-btns').innerHTML = D.zones.map(function (z) {
      return '<button type="button" class="zone-btn" data-zbtn="' + z.id + '" aria-pressed="' + (zone === z.id) + '" style="--zc:' + z.color + '"><i aria-hidden="true"></i>' + esc(L(z.name)) + '</button>';
    }).join('');
  }
  $('#zone-btns').addEventListener('click', function (e) { var b = e.target.closest('[data-zbtn]'); if (b) selectZone(b.dataset.zbtn, false); });
  function selectZone(id, fromSvg) {
    zone = id;
    $$('[data-zbtn]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.zbtn === id)); });
    $$('.zone-on', mouth).forEach(function (x) { x.classList.remove('zone-on'); });
    $$('[data-zone="' + id + '"]', mouth).forEach(function (x) { x.classList.add('zone-on'); });
    renderZonePanel(true);
    if (fromSvg && window.innerWidth < 960) {
      var p = $('#zone-panel'), r = p.getBoundingClientRect();
      if (r.top > window.innerHeight - 160) scrollToEl(p, true);
    }
  }
  function renderZonePanel(anim) {
    var p = $('#zone-panel'), z = null;
    D.zones.forEach(function (x) { if (x.id === zone) z = x; });
    if (!z) { p.innerHTML = '<p class="zp-empty">' + icon('search', 'zi') + '<span>' + esc(U('zoneEmpty')) + '</span></p>'; return; }
    p.innerHTML = '<div class="' + (anim && !REDUCED ? 'zp-anim' : '') + '"><h3>' + esc(L(z.name)) + '</h3><p class="zp-desc">' + esc(L(z.desc)) + '</p>' +
      '<p class="kicker" style="margin:16px 0 0">' + esc(U('zoneRel')) + '</p><ul>' +
      z.t.map(function (id) { var t = TBY[id]; return '<li><button type="button" data-open="' + id + '" aria-haspopup="dialog">' + icon(t.icon, 'zi') + '<span>' + esc(L(t.name)) + '</span><svg class="zgo" aria-hidden="true"><use href="#i-arrow"/></svg></button></li>'; }).join('') + '</ul></div>';
  }

  /* ---------- Smile journey ---------- */
  var journeyKind = 'imp', jStep = 1;
  var ALI_OFF = [[0, 6, -8], [3, -5, 6], [-2, 4, -10], [0, 0, 0], [2, -6, 9], [-3, 5, -6], [1, 3, 7], [0, -4, -5]]; // dx, dy, rot per tooth
  function buildAligner() {
    var g = $('#ali-teeth'), widths = [26, 30, 34, 40, 40, 34, 30, 26], heights = [48, 54, 60, 66, 66, 60, 54, 48], x = 150 - 130, html = '';
    widths.forEach(function (w, i) {
      var cx = x + w / 2, top = 132 + Math.abs(i - 3.5) * 2;
      html += '<g class="ali-t" data-i="' + i + '" style="transform-origin:' + cx + 'px ' + (top + heights[i] / 2) + 'px"><path d="M' + (cx - w / 2 + 1) + ' ' + top + 'h' + (w - 2) + 'v' + (heights[i] - 12) + 'q0 12 -12 12h' + (-(w - 26)) + 'q-12 0 -12 -12z" fill="url(#g-tooth2)" stroke="#cfdcda" stroke-width="1.6"/></g>';
      x += w;
    });
    g.innerHTML = html;
  }
  function setAlignerStep(s) {
    var f = [1, 1, 0.92, 0.55, 0.22, 0][s - 1];
    $$('.ali-t').forEach(function (t, i) {
      var o = ALI_OFF[i];
      t.style.transform = 'translate(' + (o[0] * f) + 'px,' + (o[1] * f) + 'px) rotate(' + (o[2] * f) + 'deg)';
    });
  }
  function setStep(s) {
    jStep = s;
    var svg = journeyKind === 'imp' ? $('#jv-imp') : $('#jv-ali');
    svg.setAttribute('data-step', s);
    if (journeyKind === 'ali') setAlignerStep(s);
    $('#jv-bar').style.transform = 'scaleX(' + (s / 6).toFixed(4) + ')';
    $('.jv-card').setAttribute('data-step', s);
    $('#jv-label').textContent = '0' + s + ' / 06';
    $$('[data-journey-panel="' + journeyKind + '"] .jstep').forEach(function (li) { li.classList.toggle('active', +li.dataset.step === s); });
  }
  function initJourney() {
    buildAligner(); setAlignerStep(1);
    if ('IntersectionObserver' in window) {
      var jio = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting && en.target.closest('[data-journey-panel]').dataset.journeyPanel === journeyKind) setStep(+en.target.dataset.step);
        });
      }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });
      $$('.jstep').forEach(function (li) { jio.observe(li); });
    }
    setStep(1);
    var tabs = $$('.tab');
    function select(tab, focus) {
      tabs.forEach(function (t) { var on = t === tab; t.setAttribute('aria-selected', String(on)); t.tabIndex = on ? 0 : -1; });
      journeyKind = tab.dataset.journey;
      $$('[data-journey-panel]').forEach(function (p) { p.hidden = p.dataset.journeyPanel !== journeyKind; });
      $('#jv-imp').toggleAttribute('hidden', journeyKind !== 'imp'); $('#jv-ali').toggleAttribute('hidden', journeyKind !== 'ali');
      setStep(1);
      if (focus) tab.focus();
      var j = $('#proceso .tabs'); if (j.getBoundingClientRect().top < -40) scrollToEl(j, false);
    }
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { select(t, false); });
      t.addEventListener('keydown', function (e) {
        var n = null;
        if (e.key === 'ArrowRight') n = tabs[(i + 1) % tabs.length];
        if (e.key === 'ArrowLeft') n = tabs[(i - 1 + tabs.length) % tabs.length];
        if (e.key === 'Home') n = tabs[0]; if (e.key === 'End') n = tabs[tabs.length - 1];
        if (n) { e.preventDefault(); select(n, true); }
      });
    });
  }

  /* ---------- Before / after (illustration) ---------- */
  var baMode = 'white';
  function smileSVG(o) {
    var teeth = [], half = [36, 29, 25, 22, 20], hts = [64, 56, 58, 50, 44], cx = 200, out = '';
    var crook = o.crooked ? [[2, 4, 3], [-3, -2, -9], [4, 6, 8], [0, 0, 4], [0, 0, 0]] : null;
    var crookL = o.crooked ? [[-1, 1, -2], [2, 7, 10], [-5, -3, -7], [0, 2, -3], [0, 0, 0]] : null;
    [1, -1].forEach(function (side) {
      var x = cx;
      half.forEach(function (w, i) {
        var mid = x + side * w / 2, dx = Math.abs(mid - cx) / 150, top = 112 + dx * dx * 34, h = hts[i] * (1 - dx * 0.18);
        var c = o.crooked ? (side === 1 ? crook[i] : crookL[i]) : [0, 0, 0];
        teeth.push({ x: mid + c[0], y: top + c[1], w: w - 1.5, h: h, r: c[2] * side, i: i });
        x += side * w;
      });
    });
    teeth.sort(function (p, q) { return q.i - p.i; });
    var fill = o.color, stroke = o.white ? '#e6ece9' : '#d5c08a';
    out += '<svg viewBox="0 0 400 300" role="img" aria-label="' + esc(o.label) + '" preserveAspectRatio="xMidYMid slice">';
    out += '<defs><linearGradient id="sk' + o.id + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f6dccd"/><stop offset="1" stop-color="#ebc0ad"/></linearGradient>' +
      '<clipPath id="mc' + o.id + '"><path d="M58 128Q200 70 342 128Q290 236 200 238Q110 236 58 128z"/></clipPath>' +
      '<linearGradient id="tg' + o.id + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + fill + '"/><stop offset="1" stop-color="' + (o.stop || (o.white ? '#eef3f1' : '#d9c48f')) + '"/></linearGradient></defs>';
    out += '<rect width="400" height="300" fill="url(#sk' + o.id + ')"/>';
    out += '<g clip-path="url(#mc' + o.id + ')"><rect width="400" height="300" fill="#5b1f2a"/>' +
      '<path d="M40 100Q200 60 360 100L360 128Q200 96 40 128z" fill="#e88f98"/>' +
      '<path d="M90 230Q200 190 310 230L310 260H90z" fill="#efe9dc" opacity="' + (o.white ? '.95' : '.8') + '"/>';
    teeth.forEach(function (t) {
      var x0 = t.x - t.w / 2, r = Math.min(10, t.w / 2.6);
      out += '<g transform="rotate(' + t.r + ' ' + t.x + ' ' + (t.y + t.h / 2) + ')"><path d="M' + x0 + ' ' + (t.y - 20) + 'h' + t.w + 'v' + (t.h + 20 - r) + 'q0 ' + r + ' ' + (-r) + ' ' + r + 'h' + (-(t.w - 2 * r)) + 'q' + (-r) + ' 0 ' + (-r) + ' ' + (-r) + 'z" fill="url(#tg' + o.id + ')" stroke="' + stroke + '" stroke-width="1.4"/>' +
        (o.white ? '<path d="M' + (x0 + 5) + ' ' + (t.y + 6) + 'v' + (t.h * 0.45) + '" stroke="#fff" stroke-width="3.5" stroke-linecap="round" opacity=".9"/>' : '<path d="M' + (x0 + 4) + ' ' + (t.y + t.h - 14) + 'h' + (t.w - 8) + '" stroke="#c8ae6a" stroke-width="3" stroke-linecap="round" opacity=".5"/>') + '</g>';
    });
    out += '<path d="M40 104Q200 66 360 104L360 122Q200 92 40 122z" fill="#ee9aa2" opacity=".9"/></g>';
    out += '<path d="M46 126Q120 58 200 86Q280 58 354 126Q200 104 46 126z" fill="#c9737a"/>';
    out += '<path d="M46 126Q200 112 354 126Q290 262 200 264Q110 262 46 126zM58 128Q110 236 200 238Q290 236 342 128Q200 112 58 128z" fill="#d47f86" fill-rule="evenodd"/>';
    out += '<path d="M150 252Q200 262 250 252" stroke="#e9a3a8" stroke-width="5" stroke-linecap="round" fill="none" opacity=".7"/>';
    if (o.white) out += '<path class="spk" d="M318 70c1 7 4 10 10 12-6 2-9 5-10 12-1-7-4-10-10-12 6-2 9-5 10-12z" fill="#fff" opacity=".9"/>';
    out += '</svg>';
    return out;
  }
  function renderBA() {
    var crooked = baMode === 'align';
    $('#ba-before').innerHTML = smileSVG({ id: 'b', color: crooked ? '#f7f3ea' : '#ecdcaa', stop: crooked ? '#e6dcc4' : null, white: false, crooked: crooked, label: U('baSvgBefore') });
    $('#ba-after').innerHTML = smileSVG({ id: 'a', color: '#ffffff', white: true, crooked: false, label: U('baSvgAfter') });
    var d = $('#ba-desc'); d.textContent = baMode === 'white' ? U('baDescWhite') : U('baDescAlign'); d.removeAttribute('data-i18n');
  }
  function initBA() {
    var frame = $('#ba-frame'), range = $('#ba-range');
    function set(v) { frame.style.setProperty('--pos', v + '%'); range.setAttribute('aria-valuetext', Math.round(v) + '%'); }
    range.addEventListener('input', function () { set(range.value); frame.classList.add('touched'); });
    range.addEventListener('pointerdown', function () { frame.classList.add('dragging', 'touched'); });
    window.addEventListener('pointerup', function () { frame.classList.remove('dragging'); });
    $$('[data-ba]').forEach(function (b) {
      b.addEventListener('click', function () {
        baMode = b.dataset.ba;
        $$('[data-ba]').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
        renderBA();
        if (!REDUCED) sweep();
      });
    });
    function sweep() {
      var start = null, from = 15, to = 50;
      function step(ts) { if (!start) start = ts; var p = Math.min(1, (ts - start) / 900), e = 1 - Math.pow(1 - p, 3), v = from + (to - from) * e; range.value = v; set(v); if (p < 1) requestAnimationFrame(step); }
      requestAnimationFrame(step);
    }
    set(50);
    if (!REDUCED && 'IntersectionObserver' in window) {
      var once = new IntersectionObserver(function (en) { if (en[0].isIntersecting) { once.disconnect(); var s = null; (function hint(ts) { if (!s) s = ts; var p = Math.min(1, (ts - s) / 1600), v = 50 + Math.sin(p * Math.PI * 2) * 22 * (1 - p); range.value = v; set(v); if (p < 1) requestAnimationFrame(hint); })(performance.now()); } }, { threshold: 0.6 });
      once.observe(frame);
    }
  }

  /* ---------- Booking wizard ---------- */
  var B = { step: 1, treat: null, day: null, slot: null };
  var form = $('#booker'), steps = $$('.bstep', form);
  function bookOptions() {
    var opts = [{ id: 'revision', icon: 'search', name: U('revision') }, { id: 'urgent', icon: 'bolt', name: U('urgent') }];
    D.treatments.forEach(function (t) { opts.push({ id: t.id, icon: t.icon, name: L(t.name) }); });
    opts.push({ id: 'other', icon: 'help', name: U('other') });
    return opts;
  }
  function optName(id) { var n = ''; bookOptions().forEach(function (o) { if (o.id === id) n = o.name; }); return n; }
  function renderOpts() {
    $('#opt-treat').innerHTML = bookOptions().map(function (o) {
      return '<label class="opt"><input type="radio" name="treat" value="' + o.id + '"' + (B.treat === o.id ? ' checked' : '') + '><span>' + icon(o.icon) + esc(o.name) + '</span></label>';
    }).join('');
  }
  function dayList() {
    var n = madridNow(), base = Date.UTC(n.y, n.mo - 1, n.d, 12), list = [];
    for (var i = 0; i < 15; i++) {
      var dt = new Date(base + i * 864e5), wd = dt.getUTCDay();
      var past = i === 0 && HOURS[wd] && (n.h >= HOURS[wd][1] - 2);
      list.push({ key: dt.toISOString().slice(0, 10), wd: wd, d: dt.getUTCDate(), m: dt.getUTCMonth(), off: i, disabled: !HOURS[wd] || past });
    }
    return list;
  }
  function dayLabel(key) {
    var x = null; dayList().forEach(function (d) { if (d.key === key) x = d; });
    if (!x) return key;
    return U('days')[x.wd] + ' ' + x.d + ' ' + U('months')[x.m];
  }
  function renderDays() {
    $('#days').innerHTML = dayList().map(function (d) {
      var lbl = U('days')[d.wd] + ' ' + d.d + ' ' + U('months')[d.m];
      return '<label class="day"><input type="radio" name="day" value="' + d.key + '"' + (d.disabled ? ' disabled' : '') + (B.day === d.key ? ' checked' : '') + ' aria-label="' + esc(lbl + (d.disabled ? ' · ' + U('closed') : '')) + '"><span aria-hidden="true">' + U('daysShort')[d.wd] + '<b>' + d.d + '</b>' + U('months')[d.m] + '</span></label>';
    }).join('');
    renderSlots();
  }
  function slotsFor(dayKey) {
    var wd = dayKey ? new Date(dayKey + 'T12:00:00Z').getUTCDay() : 1;
    var list = wd === 6 ? [{ id: 'sat', name: U('slotSat'), t: hh(11) + '–' + hh(13), end: 13 }] : [
      { id: 'm', name: U('slotM'), t: hh(9) + '–' + hh(12), end: 12 },
      { id: 'mid', name: U('slotMid'), t: hh(12) + '–' + hh(15), end: 15 },
      { id: 'a', name: U('slotA'), t: hh(15) + '–' + hh(18), end: 18 },
      { id: 'e', name: U('slotE'), t: hh(18) + '–' + hh(21), end: 21 }
    ];
    var n = madridNow(), todayKey = new Date(Date.UTC(n.y, n.mo - 1, n.d, 12)).toISOString().slice(0, 10);
    if (dayKey === todayKey) list = list.filter(function (s) { return s.end - 1 > n.h; });
    return list;
  }
  function slotLabel(id) { var s = ''; slotsFor(B.day).forEach(function (x) { if (x.id === id) s = x.name + ' (' + x.t + ')'; }); return s; }
  function renderSlots() {
    var list = slotsFor(B.day);
    if (B.slot && !list.some(function (s) { return s.id === B.slot; })) B.slot = null;
    $('#slots').innerHTML = list.map(function (s) {
      return '<label class="slot"><input type="radio" name="slot" value="' + s.id + '"' + (B.slot === s.id ? ' checked' : '') + '><span>' + esc(s.name) + '<small>' + s.t + '</small></span></label>';
    }).join('');
  }
  form.addEventListener('change', function (e) {
    var t = e.target;
    if (t.name === 'treat') { B.treat = t.value; $('#err-treat').hidden = true; }
    if (t.name === 'day') { B.day = t.value; renderSlots(); }
    if (t.name === 'slot') { B.slot = t.value; }
    if ((t.name === 'day' || t.name === 'slot') && B.day && B.slot) $('#err-day').hidden = true;
    if (t.id === 'f-consent' && t.checked) $('#err-consent').hidden = true;
  });
  form.addEventListener('submit', function (e) { e.preventDefault(); next(); });
  ['f-name', 'f-phone'].forEach(function (id) {
    var el = $('#' + id);
    el.addEventListener('input', function () { if (el.getAttribute('aria-invalid') === 'true' && valid(el)) { el.removeAttribute('aria-invalid'); $('#err-' + id.slice(2)).hidden = true; } });
    el.addEventListener('blur', function () { if (el.value && !valid(el)) { el.setAttribute('aria-invalid', 'true'); $('#err-' + id.slice(2)).hidden = false; } });
  });
  function valid(el) {
    if (el.id === 'f-name') return el.value.trim().length >= 2;
    if (el.id === 'f-phone') return el.value.replace(/\D/g, '').length >= 6;
    return true;
  }
  function validate(step) {
    if (step === 1) { var ok = !!B.treat; $('#err-treat').hidden = ok; if (!ok) { var f = $('#opt-treat input'); f && f.focus(); } return ok; }
    if (step === 2) { var ok2 = !!(B.day && B.slot); $('#err-day').hidden = ok2; if (!ok2) { var f2 = B.day ? $('#slots input') : $('#days input:not(:disabled)'); f2 && f2.focus(); } return ok2; }
    if (step === 3) {
      var first = null;
      ['f-name', 'f-phone'].forEach(function (id) {
        var el = $('#' + id), v = valid(el);
        el.toggleAttribute('aria-invalid', !v); if (!v) el.setAttribute('aria-invalid', 'true');
        $('#err-' + id.slice(2)).hidden = v; if (!v && !first) first = el;
      });
      var c = $('#f-consent'); $('#err-consent').hidden = c.checked; if (!c.checked && !first) first = c;
      if (first) first.focus();
      return !first;
    }
    return true;
  }
  function message() {
    var isNew = (form.querySelector('input[name=isnew]:checked') || {}).value === 'yes';
    var rows = [
      [U('sumTreat'), optName(B.treat)], [U('sumDay'), dayLabel(B.day)], [U('sumSlot'), slotLabel(B.slot)],
      [U('sumName'), $('#f-name').value.trim()], [U('sumPhone'), $('#f-phone').value.trim()]
    ];
    var em = $('#f-email').value.trim(); if (em) rows.push([U('sumEmail'), em]);
    rows.push([U('sumNew'), isNew ? (lang === 'es' ? ES.yes : D[lang].yes) : (lang === 'es' ? 'No' : lang === 'en' ? 'No' : 'Non')]);
    var msg = $('#f-msg').value.trim(); if (msg) rows.push([U('sumMsg'), msg]);
    return rows;
  }
  function renderSummary() {
    var rows = message();
    $('#summary').innerHTML = '<dl>' + rows.map(function (r) { return '<div><dt>' + esc(r[0]) + '</dt><dd>' + esc(r[1]) + '</dd></div>'; }).join('') + '</dl>';
    var text = U('msgHello') + '\n\n' + rows.map(function (r) { return '• ' + r[0] + ': ' + r[1]; }).join('\n') + '\n\n' + U('msgFoot');
    $('#send-wa').href = 'https://wa.me/' + WA + '?text=' + encodeURIComponent(text);
    $('#send-mail').href = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent(fmt(U('mailSubject'), { t: optName(B.treat) })) + '&body=' + encodeURIComponent(text);
  }
  function stepName(n) { return (lang === 'es' ? ES : D[lang])['bs' + n]; }
  function showStep(n, focus) {
    B.step = n;
    steps.forEach(function (s) {
      var on = +s.dataset.bstep === n; s.hidden = !on;
      if (on && !REDUCED) { s.classList.remove('enter'); void s.offsetWidth; s.classList.add('enter'); }
    });
    $$('.steps-bar li', form).forEach(function (li, i) { li.classList.toggle('on', i < n); });
    $('#b-back').hidden = n === 1;
    form.classList.toggle('done', n === 4);
    if (n === 2) renderDays();
    if (n === 4) renderSummary();
    $('#book-status').textContent = fmt(U('step'), { n: n, s: stepName(n) });
    if (focus) {
      var title = $('.bstep[data-bstep="' + n + '"] .bstep-title', form);
      title.setAttribute('tabindex', '-1'); title.focus({ preventScroll: true });
      var r = form.getBoundingClientRect();
      if (r.top < 0) scrollToEl(form, false);
    }
  }
  function next() { if (validate(B.step) && B.step < 4) showStep(B.step + 1, true); }
  $('#b-next').addEventListener('click', next);
  $('#b-back').addEventListener('click', function () { if (B.step > 1) showStep(B.step - 1, true); });
  function goBook(id) {
    B.treat = id; renderOpts(); $('#err-treat').hidden = true;
    showStep(id ? 2 : 1, false);
    scrollToEl(window.innerWidth < 960 ? form : $('#cita'), false);
    setTimeout(function () { var t = $('.bstep[data-bstep="' + B.step + '"] .bstep-title', form); t.setAttribute('tabindex', '-1'); t.focus({ preventScroll: true }); }, REDUCED ? 0 : 600);
  }
  document.addEventListener('click', function (e) {
    var p = e.target.closest('[data-preselect]');
    if (p) { e.preventDefault(); goBook(p.dataset.preselect); }
  });

  /* ---------- Map facade ---------- */
  $('#load-map').addEventListener('click', function () {
    var f = document.createElement('iframe');
    f.className = 'map-frame';
    f.src = 'https://www.google.com/maps?q=Av.+de+la+Constituci%C3%B3n+19,+29670+San+Pedro+Alc%C3%A1ntara,+M%C3%A1laga&z=17&output=embed';
    f.title = U('mapTitle'); f.loading = 'lazy'; f.referrerPolicy = 'no-referrer-when-downgrade';
    var card = $('.map-card'); card.innerHTML = ''; card.appendChild(f); f.focus();
  });

  /* ---------- Premium layer ---------- */
  var FINE = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var HAS_IO = 'IntersectionObserver' in window;

  /* Sections with looping motion get .live only while on screen (CSS pauses loops otherwise) */
  function initLive() {
    var els = $$('[data-live]');
    if (!HAS_IO) { els.forEach(function (e) { e.classList.add('live', 'seen'); }); return; }
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (x) { x.target.classList.toggle('live', x.isIntersecting); if (x.isIntersecting) x.target.classList.add('seen'); });
    }, { rootMargin: '60px 0px' });
    els.forEach(function (e) { io.observe(e); });
  }

  /* Hero: cursor-reactive light sweep, photo tilt, float-card parallax (mouse only, rAF only while easing) */
  function initHero() {
    var hero = $('.hero'), photo = $('.hero-photo'), sheen = $('.hero-sheen span'), cards = $$('.float-card');
    if (REDUCED || !FINE || !photo || !sheen) return;
    hero.classList.add('track');
    var rect = null, tx = 0.5, ty = 0.5, cx = 0.5, cy = 0.5, raf = 0;
    function kick() { if (!raf) raf = requestAnimationFrame(tick); }
    function tick() {
      raf = 0; cx += (tx - cx) * 0.1; cy += (ty - cy) * 0.1;
      var dx = cx - 0.5, dy = cy - 0.5;
      photo.style.transform = 'perspective(1400px) rotateY(' + (dx * 6).toFixed(2) + 'deg) rotateX(' + (-dy * 4).toFixed(2) + 'deg)';
      sheen.style.transform = 'translate3d(' + (-100 + cx * 320).toFixed(1) + '%,0,0) skewX(-12deg)';
      cards.forEach(function (c, i) { var k = i ? -16 : 20; c.style.translate = (dx * k).toFixed(1) + 'px ' + (dy * k).toFixed(1) + 'px'; });
      if (Math.abs(tx - cx) > 0.002 || Math.abs(ty - cy) > 0.002) kick();
    }
    hero.addEventListener('pointerenter', function () { rect = hero.getBoundingClientRect(); });
    hero.addEventListener('pointermove', function (e) {
      if (e.pointerType !== 'mouse') return;
      if (!rect) rect = hero.getBoundingClientRect();
      tx = (e.clientX - rect.left) / rect.width; ty = (e.clientY - rect.top) / rect.height; kick();
    }, { passive: true });
    hero.addEventListener('pointerleave', function () { rect = null; tx = 0.5; ty = 0.5; kick(); });
    window.addEventListener('scroll', function () { rect = null; }, { passive: true });
  }

  /* Depth tilt + glare on cards (mouse only) */
  function initTilt() {
    if (!FINE || REDUCED) return;
    var cur = null, rect = null, mx = 0, my = 0, raf = 0;
    function glare(el) {
      var g = el.querySelector(':scope > .t-glare');
      if (!g) { g = document.createElement('span'); g.className = 't-glare'; g.setAttribute('aria-hidden', 'true'); g.innerHTML = '<i></i>'; el.insertBefore(g, el.firstChild); }
      return g;
    }
    function apply() {
      raf = 0; if (!cur) return;
      var px = (mx - rect.left) / rect.width, py = (my - rect.top) / rect.height, max = rect.width > 520 ? 3 : 6;
      cur.style.transform = 'perspective(900px) rotateX(' + ((0.5 - py) * max).toFixed(2) + 'deg) rotateY(' + ((px - 0.5) * max).toFixed(2) + 'deg) translateY(-3px)';
      var i = cur.querySelector(':scope > .t-glare > i'); if (i) i.style.transform = 'translate(' + Math.round(mx - rect.left) + 'px,' + Math.round(my - rect.top) + 'px)';
    }
    function leave() { if (!cur) return; cur.classList.remove('tilting'); cur.style.transform = ''; cur = null; }
    document.addEventListener('pointerover', function (e) {
      if (e.pointerType !== 'mouse') return;
      var t = e.target.closest('[data-tilt], .tcard button'); if (t === cur) return;
      leave(); if (!t) return;
      cur = t; rect = t.getBoundingClientRect(); glare(t); t.classList.add('tilting');
    });
    document.addEventListener('pointermove', function (e) { if (!cur || e.pointerType !== 'mouse') return; mx = e.clientX; my = e.clientY; if (!raf) raf = requestAnimationFrame(apply); }, { passive: true });
    window.addEventListener('scroll', leave, { passive: true });
  }

  /* Count-up numbers (final text is in the HTML, so no-JS / reduced motion shows it as is) */
  function initCounters() {
    if (REDUCED || !HAS_IO) return;
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (x) { if (x.isIntersecting) { io.unobserve(x.target); countUp(x.target); } });
    }, { threshold: 0.6 });
    $$('[data-count],[data-count-dec]').forEach(function (e) { io.observe(e); });
  }
  function countUp(el) {
    var dec = el.dataset.countDec, to = +(dec || el.dataset.count), from = +(el.dataset.from || 0), t0 = performance.now(), dur = dec ? 1200 : 1500;
    var sep = /,/.test(el.textContent) ? ',' : '.';
    function finalText() { var k = el.dataset.i18n; if (!k) return String(to); var dict = lang === 'es' ? ES : D[lang]; return dict[k] != null ? dict[k] : ES[k]; }
    (function f(ts) {
      var p = Math.min(1, ((ts || performance.now()) - t0) / dur), e = 1 - Math.pow(1 - p, 4), v = from + (to - from) * e;
      if (p >= 1) { el.innerHTML = finalText(); return; }
      el.textContent = dec ? v.toFixed(1).replace('.', sep) : String(Math.round(v));
      requestAnimationFrame(f);
    })();
  }

  /* iTero-style scan: wireframe molar on a 2D canvas, drag to turn. Runs only while visible. */
  function initScan() {
    var view = $('#scan-view'), cv = $('#scan-canvas'), toggle = $('#scan-toggle');
    if (!view || !cv || !cv.getContext) return;
    var ctx = cv.getContext('2d'), W = 0, H = 0, DPR = Math.min(window.devicePixelRatio || 1, 2);
    var P = [], L = [];
    function ring(pts) { var b = P.length / 3; pts.forEach(function (p) { P.push(p[0], p[1], p[2]); }); for (var j = 0; j < pts.length; j++) L.push(b + j, b + (j + 1) % pts.length); return b; }
    function link(a, b, n, step) { for (var j = 0; j < n; j += step) L.push(a + j, b + j); }
    /* Lower molar, model units: CEJ at y=0, crown 0.8 high x 1.06 wide (mesio-distal), roots 1.12 long (1.4x crown) */
    function se(c) { return (c < 0 ? -1 : 1) * Math.pow(Math.abs(c), 2 / 3.4); }
    var M = 36, CH = 0.8, RIM = 0.6, HX = 0.53, HZ = 0.46, j, k, t, pts, prev = -1;
    /* five rounded cusps (MB, DB, D buccal; ML, DL lingual) and a mesio-distal central fissure; xn/zn in -1..1 */
    var CUSPS = [[-0.52, 0.5], [0.08, 0.56], [0.62, 0.38], [-0.46, -0.5], [0.36, -0.52]];
    function occl(xn, zn) {
      var h = 0;
      CUSPS.forEach(function (c) { var dx = xn - c[0], dz = zn - c[1]; h += Math.exp(-(dx * dx + dz * dz) / 0.13); });
      h = Math.min(1, h) * (CH - RIM);
      h -= 0.07 * Math.exp(-zn * zn / 0.02) * (1 - 0.5 * xn * xn);
      return h;
    }
    function crownR(t) { return t < 0.55 ? 0.8 + 0.2 * Math.sin(Math.PI / 2 * t / 0.55) : 1 - 0.08 * Math.pow((t - 0.55) / 0.45, 2); }
    /* crown walls: waist at the neck, height of contour at ~55%, cusps rising into the rim */
    for (k = 0; k <= 8; k++) {
      t = k / 8; var rf = crownR(t); pts = [];
      for (j = 0; j < M; j++) {
        var th = j / M * Math.PI * 2, cx = se(Math.cos(th)), cz = se(Math.sin(th));
        pts.push([HX * rf * cx, RIM * t + Math.max(0, occl(cx * 0.92, cz * 0.92)) * Math.pow(t, 3) * 0.7, HZ * rf * cz]);
      }
      var rb0 = ring(pts); if (prev >= 0) link(prev, rb0, M, 2); prev = rb0;
    }
    var rimF = crownR(1);
    /* occlusal table */
    [0.82, 0.62, 0.42, 0.22].forEach(function (s) {
      var q = [];
      for (var jj = 0; jj < M; jj++) { var th = jj / M * Math.PI * 2, cx = se(Math.cos(th)) * s, cz = se(Math.sin(th)) * s; q.push([HX * rimF * cx, RIM + occl(cx, cz), HZ * rimF * cz]); }
      var bb = ring(q); link(prev, bb, M, 3); prev = bb;
    });
    /* central fissure line + buccal and lingual grooves */
    function groove(x0, z0, x1, z1, n) {
      var first = P.length / 3;
      for (var g = 0; g <= n; g++) { var xn = x0 + (x1 - x0) * g / n, zn = z0 + (z1 - z0) * g / n; P.push(HX * rimF * xn, RIM + occl(xn, zn) + 0.005, HZ * rimF * zn); if (g) L.push(first + g - 1, first + g); }
    }
    groove(-0.8, 0, 0.8, 0, 12); groove(-0.2, 0, -0.22, 0.85, 5); groove(0.36, 0.02, 0.42, 0.8, 5); groove(-0.05, 0, -0.02, -0.85, 5);
    /* root trunk under the neck */
    var tk = []; for (j = 0; j < M; j++) { var a2 = j / M * Math.PI * 2; tk.push([HX * 0.74 * se(Math.cos(a2)), -0.18, HZ * 0.76 * se(Math.sin(a2))]); }
    var tb = ring(tk); link(0, tb, M, 2);
    /* mesial (-x) and distal (+x) roots: flattened mesio-distally, splaying slightly, rounded tips */
    [-1, 1].forEach(function (side) {
      var pr = -1, N = 16, RL = 1.12 - 0.2, y0r = -0.2;
      for (var kk = 0; kk <= 9; kk++) {
        var tt = kk / 9 * 0.97, taper = 1 - 0.45 * tt, cap = tt > 0.72 ? Math.sqrt(Math.max(0, 1 - Math.pow((tt - 0.72) / 0.28, 2))) : 1;
        var rx = 0.13 * taper * cap, rz = 0.3 * taper * cap, cxr = side * (0.21 + 0.17 * tt) + 0.05 * tt * tt, yy = y0r - tt * RL, q = [];
        for (var m = 0; m < N; m++) { var a3 = m / N * Math.PI * 2; q.push([cxr + rx * Math.cos(a3), yy, rz * Math.sin(a3)]); }
        var rb = ring(q); if (pr >= 0) link(pr, rb, N, 2); pr = rb;
      }
      var tip = P.length / 3; P.push(side * 0.37 + 0.05, y0r - RL, 0); for (var mm = 0; mm < N; mm += 2) L.push(pr + mm, tip);
      for (var mt = 0; mt < M; mt += 4) { var px = P[(tb + mt) * 3]; if (px * side > 0.05) L.push(tb + mt, (tip - 10 * N) + Math.round(mt / M * N) % N); }
    });
    var NP = P.length / 3, SX = new Float32Array(NP), SY = new Float32Array(NP), SZ = new Float32Array(NP);
    var yaw = 0.12, sway = 0, phase = 0, pitch = -0.4, vel = 0, spin = 0, playing = !REDUCED, visible = false, drag = null, raf = 0, last = 0;
    var SCAN = 4.4, HOLD = 1.8, cycle = REDUCED ? SCAN + 0.1 : 0, pctShown = -1, stateShown = '';
    var pctEl = $('#scan-pct'), stEl = $('#scan-state');
    if (toggle) toggle.setAttribute('aria-pressed', String(!playing));
    function resize() {
      var w = view.clientWidth, h = view.clientHeight; if (!w || !h) return;
      W = cv.width = Math.round(w * DPR); H = cv.height = Math.round(h * DPR); draw();
    }
    function hud(scanY, done) {
      var pct = done ? 100 : Math.max(0, Math.min(99, Math.round((0.88 - scanY) / 2.1 * 100)));
      if (pct !== pctShown) { pctShown = pct; pctEl.textContent = pct + '%'; }
      var st = done ? U('scanDone') : U('scanning');
      if (st !== stateShown) { stateShown = st; stEl.textContent = st; }
    }
    function draw() {
      if (!W) return;
      var done = cycle >= SCAN, scanY = done ? -9 : 0.88 - (cycle / SCAN) * 2.1;
      hud(scanY, done);
      var cy = Math.cos(yaw + sway), sy = Math.sin(yaw + sway), cp = Math.cos(pitch), sp = Math.sin(pitch), Dd = 6, S = Math.min(W, H) * 0.35, ox = W / 2, oy = H / 2 + S * 0.04;
      for (var i = 0; i < NP; i++) {
        var x = P[i * 3], y = P[i * 3 + 1] + 0.18, z = P[i * 3 + 2];
        var x1 = x * cy + z * sy, z1 = -x * sy + z * cy, y2 = y * cp - z1 * sp, z2 = y * sp + z1 * cp, f = Dd / (Dd - z2) * S;
        SX[i] = ox + x1 * f; SY[i] = oy - y2 * f; SZ[i] = z2;
      }
      ctx.clearRect(0, 0, W, H);
      ctx.lineWidth = DPR; ctx.lineCap = 'round';
      var buckets = [[], [], [], []], hits = [];
      for (var l = 0; l < L.length; l += 2) {
        var a = L[l], c = L[l + 1], ya = P[a * 3 + 1], yc = P[c * 3 + 1];
        var scanned = done || (ya >= scanY && yc >= scanY), near = SZ[a] + SZ[c] > 0;
        buckets[(scanned ? 0 : 2) + (near ? 0 : 1)].push(a, c);
        if (!done && (ya - scanY) * (yc - scanY) < 0) { var u = (scanY - ya) / (yc - ya); hits.push(SX[a] + (SX[c] - SX[a]) * u, SY[a] + (SY[c] - SY[a]) * u); }
      }
      var styles = done ? ['rgba(178,240,230,.95)', 'rgba(143,224,211,.4)', '', ''] : ['rgba(143,224,211,.9)', 'rgba(143,224,211,.32)', 'rgba(143,224,211,.2)', 'rgba(143,224,211,.07)'];
      for (var bk = 3; bk >= 0; bk--) {
        var arr = buckets[bk]; if (!arr.length) continue;
        ctx.beginPath();
        for (var n = 0; n < arr.length; n += 2) { ctx.moveTo(SX[arr[n]], SY[arr[n]]); ctx.lineTo(SX[arr[n + 1]], SY[arr[n + 1]]); }
        ctx.strokeStyle = styles[bk]; ctx.stroke();
      }
      if (!done) {
        var corners = [[-0.85, -0.85], [0.85, -0.85], [0.85, 0.85], [-0.85, 0.85]], yy = scanY + 0.18;
        ctx.beginPath();
        corners.forEach(function (q, qi) {
          var x1 = q[0] * cy + q[1] * sy, z1 = -q[0] * sy + q[1] * cy, y2 = yy * cp - z1 * sp, z2 = yy * sp + z1 * cp, f = Dd / (Dd - z2) * S;
          if (qi) ctx.lineTo(ox + x1 * f, oy - y2 * f); else ctx.moveTo(ox + x1 * f, oy - y2 * f);
        });
        ctx.closePath(); ctx.fillStyle = 'rgba(43,181,165,.1)'; ctx.fill(); ctx.strokeStyle = 'rgba(143,224,211,.55)'; ctx.stroke();
        ctx.fillStyle = 'rgba(235,255,251,.95)'; var d = 2.2 * DPR;
        for (var h = 0; h < hits.length; h += 2) ctx.fillRect(hits[h] - d / 2, hits[h + 1] - d / 2, d, d);
      }
    }
    function frame(ts) {
      raf = 0;
      var dt = last ? Math.min(0.05, (ts - last) / 1000) : 0.016; last = ts;
      if (playing && !drag) { phase += dt; sway = 0.62 * Math.sin(phase * 0.55); cycle += dt; if (cycle > SCAN + HOLD) cycle = 0; }
      if (!drag && Math.abs(vel) > 0.0004) { yaw += vel; vel *= 0.92; } else if (!drag) vel = 0;
      if (Math.abs(spin) > 0.002) { var st = spin * 0.14; yaw += st; spin -= st; } else spin = 0;
      draw();
      if (visible && !document.hidden && (playing || drag || vel || spin)) raf = requestAnimationFrame(frame); else last = 0;
    }
    function wake() { if (!raf && visible && !document.hidden) { last = 0; raf = requestAnimationFrame(frame); } }
    view.addEventListener('pointerdown', function (e) {
      drag = { x: e.clientX, y: e.clientY, id: e.pointerId, type: e.pointerType }; vel = 0;
      view.classList.add('grabbing', 'touched'); wake();
    });
    view.addEventListener('pointermove', function (e) {
      if (!drag || e.pointerId !== drag.id) return;
      var dx = e.clientX - drag.x, dy = e.clientY - drag.y; drag.x = e.clientX; drag.y = e.clientY;
      vel = dx * 0.009; yaw += vel;
      if (drag.type === 'mouse') pitch = Math.max(-1.1, Math.min(0.35, pitch + dy * 0.006));
      if (!drag.cap && Math.abs(dx) > 2) { try { view.setPointerCapture(e.pointerId); drag.cap = true; } catch (er) {} }
    });
    function endDrag() { if (!drag) return; drag = null; view.classList.remove('grabbing'); wake(); }
    view.addEventListener('pointerup', endDrag); view.addEventListener('pointercancel', endDrag); view.addEventListener('lostpointercapture', endDrag);
    $$('[data-rot]').forEach(function (b) { b.addEventListener('click', function () { spin += +b.dataset.rot * Math.PI / 4; view.classList.add('touched'); wake(); }); });
    if (toggle) toggle.addEventListener('click', function () {
      playing = !playing; toggle.setAttribute('aria-pressed', String(!playing));
      if (playing && cycle > SCAN) cycle = 0;
      wake();
    });
    if ('ResizeObserver' in window) new ResizeObserver(resize).observe(view); else window.addEventListener('resize', resize);
    resize();
    if (HAS_IO) new IntersectionObserver(function (en) { visible = en[0].isIntersecting; if (visible) wake(); }, { rootMargin: '40px 0px' }).observe(view);
    else { visible = true; wake(); }
    document.addEventListener('visibilitychange', wake);
    window.__scanLang = function () { stateShown = ''; draw(); };
  }

  /* Breathe orb pause control */
  function initOrb() {
    var b = $('#orb-toggle'), sec = $('#calma'); if (!b || !sec) return;
    b.addEventListener('click', function () { var p = b.getAttribute('aria-pressed') !== 'true'; b.setAttribute('aria-pressed', String(p)); sec.classList.toggle('paused', p); });
  }

  /* ---------- Render all dynamic parts ---------- */
  function renderAll() {
    if (!booted) { renderOpen(); return setTimeout(renderAll, 300); }
    renderOpen(); renderGrid(false); renderZoneBtns(); renderZonePanel(false); renderBA(); renderOpts();
    if (B.step === 2) renderDays();
    if (B.step === 4) renderSummary();
    if (B.step) $('#book-status').textContent = '';
    if (sheetId && sheet.open) { sheetBody.innerHTML = sheetHTML(TBY[sheetId]); }
    var mapIframe = $('.map-frame'); if (mapIframe) mapIframe.title = U('mapTitle');
    if (window.__scanLang) window.__scanLang();
    if (menuBtn.getAttribute('aria-expanded') === 'true') menuBtn.setAttribute('aria-label', lang === 'es' ? 'Cerrar menú' : D[lang].close);
  }

  /* Boot: critical first, the rest in small idle tasks to keep the main thread free */
  if (lang !== 'es') applyStatic();
  renderOpen();
  initLive();
  var idle = window.requestIdleCallback || function (fn) { return setTimeout(fn, 1); };
  var queue = [initReveal, renderGrid.bind(null, false), function () { buildMouth(); renderZoneBtns(); renderZonePanel(false); }, initJourney, function () { initBA(); renderBA(); }, renderOpts, initHero, initTilt, initCounters, initScan, initOrb];
  var booted = false;
  (function run() { idle(function () { var f = queue.shift(); if (f) f(); if (queue.length) run(); else booted = true; }, { timeout: 1200 }); })();
  var journeyEl = $('#journey');
  if ('IntersectionObserver' in window) new IntersectionObserver(function (en) { journeyEl.classList.toggle('playing', en[0].isIntersecting && !REDUCED); }).observe(journeyEl);
  setInterval(renderOpen, 60000);
})();
