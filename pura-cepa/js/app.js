/* Pura Cepa · Noir Digital concept. Vanilla JS, no build step. */
(function () {
  'use strict';
  var P = window.PC;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var root = document.documentElement;
  var RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var WA = '34952494560'; /* WhatsApp number to be confirmed with the bar */
  var lang = 'es';
  try { lang = new URLSearchParams(location.search).get('lang') || localStorage.getItem('pc-lang') || 'es'; } catch (e) {}
  if (lang !== 'en') lang = 'es';

  function t(o) { return o ? (o[lang] != null ? o[lang] : o.es) : ''; }
  function L(es, en) { return lang === 'en' ? en : es; }
  function money(v) {
    var s = v.toFixed(2);
    return lang === 'en' ? '€' + s : s.replace('.', ',') + ' €';
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function rgba(h, a) { var n = parseInt(h.slice(1), 16); return 'rgba(' + (n >> 16) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + a + ')'; }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  function ph() { return '<span class="ph">' + L('[precio]', '[price]') + '</span>'; }

  var toastEl = el('div', 'toast'); toastEl.setAttribute('role', 'status'); document.body.appendChild(toastEl);
  var toastT;
  function toast(msg) { toastEl.textContent = msg; toastEl.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove('on'); }, 2200); }

  function wa(msg) { return 'https://wa.me/' + WA + '?text=' + encodeURIComponent(msg); }
  function openWa(msg) { window.open(wa(msg), '_blank', 'noopener'); }

  /* ---------------- language ---------------- */
  var ARIA = {
    langBtn: ['Cambiar idioma a inglés', 'Switch language to Spanish'],
    pMinus: ['Quitar una botella', 'Remove one bottle'],
    pPlus: ['Añadir una botella', 'Add one bottle'],
    calPrev: ['Mes anterior', 'Previous month'],
    calNext: ['Mes siguiente', 'Next month']
  };
  var rerender = [];
  /* Lazy sections: render a section's dynamic parts only when it comes near the viewport, one task per part. */
  var lazyMap = {};
  function lazy(sel, fn) {
    var L0 = lazyMap[sel] || (lazyMap[sel] = { fns: [], done: false });
    L0.fns.push(fn);
    rerender.push(function () { if (L0.done) fn(); });
  }
  function ensure(sel) {
    var L0 = lazyMap[sel]; if (!L0 || L0.done) return;
    L0.done = true; L0.fns.forEach(function (f) { f(); });
  }
  function ensureSoon(sel) {
    var L0 = lazyMap[sel]; if (!L0 || L0.done) return;
    L0.done = true;
    var idle = window.requestIdleCallback || function (f) { return setTimeout(f, 1); };
    var i = 0; (function next() { if (i < L0.fns.length) { L0.fns[i++](); idle(next, { timeout: 300 }); } })();
  }
  function applyLang() {
    root.lang = lang;
    var b = $('#langBtn');
    b.querySelector('.lang__on').textContent = lang.toUpperCase();
    b.querySelector('.lang__off').textContent = lang === 'es' ? 'EN' : 'ES';
    Object.keys(ARIA).forEach(function (id) { var e = document.getElementById(id); if (e) e.setAttribute('aria-label', ARIA[id][lang === 'en' ? 1 : 0]); });
    $('.logo').setAttribute('aria-label', L('Pura Cepa, inicio', 'Pura Cepa, home'));
    $('.mbar').setAttribute('aria-label', L('Acciones rápidas', 'Quick actions'));
    $('.nav').setAttribute('aria-label', L('Principal', 'Main'));
    $('#gSearch').placeholder = 'Monkey 47, Malfy, Siderit…';
    $('#pOcc').placeholder = L('Ej.: cumpleaños, equipo de trabajo', 'E.g. birthday, team outing');
    document.title = L('Pura Cepa · Vinos y gin · La Cala de Mijas', 'Pura Cepa · Wine & gin · La Cala de Mijas');
    rerender.forEach(function (f) { f(); });
  }
  $('#langBtn').addEventListener('click', function () {
    lang = lang === 'es' ? 'en' : 'es';
    try { localStorage.setItem('pc-lang', lang); } catch (e) {}
    applyLang();
  });

  /* ---------------- counts + open now ---------------- */
  var byGlass = P.W.filter(function (w) { return w.t !== 'ver'; }).length;
  $$('[data-count="wines"]').forEach(function (e) { e.textContent = byGlass; });
  $$('[data-count="gins"]').forEach(function (e) { e.textContent = P.G.length; });

  function openNow() {
    var box = $('#openNow');
    var h;
    /* Madrid hour without Intl (its time-zone data is slow to load on phones): CET, CEST from the last Sunday of March to the last Sunday of October, 01:00 UTC */
    var now = new Date(), y = now.getUTCFullYear();
    var lastSun = function (m) { var d = new Date(Date.UTC(y, m + 1, 0, 1)); d.setUTCDate(d.getUTCDate() - d.getUTCDay()); return d; };
    var off = now >= lastSun(2) && now < lastSun(9) ? 2 : 1;
    h = (now.getUTCHours() + off) % 24;
    var open = h >= 11 || h < 2;
    box.classList.toggle('is-closed', !open);
    box.innerHTML = '<span class="dot" aria-hidden="true"></span>' + (open
      ? L('Abierto ahora · cierra a las 02:00', 'Open now · closes at 02:00')
      : L('Cerrado ahora · abre a las 11:00', 'Closed now · opens at 11:00')) + '<span class="sr"> ' + L('(horario de Google: todos los días 11:00–02:00)', '(Google hours: every day 11:00–02:00)') + '</span>';
  }
  rerender.push(openNow);

  /* ---------------- the glass ---------------- */
  var glass = $('#glass');
  var layers = [$('.liq--a', glass), $('.liq--b', glass)];
  var active = 0, filled = false, pourT, infoT;
  var gName = $('#gName'), gType = $('#gType'), gMeta = $('#gMeta'), gNote = $('#gNote'), gPrice = $('#gPrice');
  var current = null; /* {kind:'w'|'g'|'s', item} */

  function setInfo(fn) {
    if (RM) { fn(); return; }
    glass.classList.add('swap');
    clearTimeout(infoT);
    infoT = setTimeout(function () { fn(); glass.classList.remove('swap'); }, 220);
  }
  function typeName(w) { return t(P.T[w.t]); }
  function wineMeta(w) { return [w.g, w.r].filter(Boolean).join(' · '); }
  function writeWine(w) {
    var st = P.S[w.s];
    gType.textContent = typeName(w) + (w.x ? ' · ' + t(w.x) : '');
    gName.textContent = w.n;
    gMeta.textContent = wineMeta(w) + (w.b ? ' · ' + w.b : '');
    gNote.textContent = t(st);
    gPrice.innerHTML = serve === 'bot' && w.t !== 'ver' ? L('Botella ', 'Bottle ') + ph() : money(w.p) + '<small>' + L('copa ', 'glass ') + w.ml + ' ml</small>';
  }
  function pourWine(w, quiet) {
    current = { kind: 'w', item: w };
    glass.classList.remove('is-gin');
    var st = P.S[w.s];
    var level = w.ml >= 150 ? 78 : (w.ml >= 100 ? 96 : 110);
    glass.classList.toggle('fizz', !!st.b);
    glass.style.setProperty('--glow', rgba(st.c, .5));
    var nxt = layers[1 - active], cur = layers[active];
    nxt.style.setProperty('--c', st.c);
    glass.querySelector('.stream').style.setProperty('--sc', st.c);
    if (RM || quiet) {
      nxt.style.transition = 'none'; nxt.style.transform = 'translateY(' + level + 'px)'; nxt.style.opacity = 1;
      cur.style.opacity = 0;
    } else {
      nxt.style.transition = 'none';
      nxt.style.transform = 'translateY(170px)';
      nxt.style.opacity = 1;
      void nxt.getBoundingClientRect();
      nxt.style.transition = '';
      glass.classList.add('pouring');
      requestAnimationFrame(function () {
        nxt.style.transform = 'translateY(' + level + 'px)';
        cur.style.opacity = 0;
      });
      clearTimeout(pourT);
      pourT = setTimeout(function () { glass.classList.remove('pouring'); }, 820);
    }
    active = 1 - active; filled = true;
    if (quiet) writeWine(w); else setInfo(function () { writeWine(w); });
  }

  /* gin tint + garnish from the name */
  var TINT = {
    pink: ['#f2b3c3', '#e86f8e', '#f6c9d4'], orange: ['#f5c27d', '#ee9b3a', '#f7d39f'], violet: ['#c3b0e6', '#8d6fc9', '#d6c9f0'],
    blue: ['#a9c2ec', '#e6d36b', '#f2e6a0'], green: ['#d3e8b0', '#8fbf5a', '#c6e09a'], lemon: ['#e4f0ee', '#e9d36a', '#f4e7a0'],
    amber: ['#e8c48a', '#c98b3f', '#ecd3a6'], gold: ['#f0dc9a', '#d9b779', '#f2e2b4'], clear: ['#e4f0ee', '#a7c97a', '#cfe3a9'], red: ['#eaa3a3', '#b8323d', '#e48a92']
  };
  function ginTint(g) {
    if (g.tint) return g.tint;
    var n = g.n.toLowerCase();
    if (/pink|rosa|rosé|fresa|strawberry|fraise|raspberry|frambuesa|wildberry|red fruit|frutos rojos|sloe|cerezas|hibiscus|guayaba/.test(n)) return 'pink';
    if (/orange|naranja|arancia|mandarina|blood|sevilla|tangerina|citron|rangpur|grapefruit/.test(n)) return 'orange';
    if (/purple|violet|iris|bilberry|bramble|blueberry|arándanos|mora/.test(n)) return 'violet';
    if (/blu|blue/.test(n)) return 'blue';
    if (/apple|melon|cucumber|basil|greenery|nettle|hierbabuena|lovage|wasabi|mint/.test(n)) return 'green';
    if (/gold|999/.test(n)) return 'gold';
    if (/limone|lemon|lime|citrus|citius|zest/.test(n)) return 'lemon';
    if (/oak|cask|barrel|reserv|old tom|amber|smoke/.test(n)) return 'amber';
    return 'clear';
  }
  function writeGin(g, sig) {
    gType.textContent = sig ? L('Recomendado por Pura Cepa', "Pura Cepa signature") : (g.c ? t(P.GC[g.c]) : '0,0') + (g.o ? ' · ' + g.o : '');
    gName.textContent = g.n;
    gMeta.textContent = sig ? t(g.d) : L('Gin & tonic', 'Gin & tonic');
    gNote.textContent = sig ? '' : L('Servido en copa balón con hielo y tónica.', 'Served in a balloon glass with ice and tonic.');
    gPrice.innerHTML = money(g.p) + '<small>G&amp;T</small>';
  }
  function pourGin(g, sig, quiet) {
    current = { kind: sig ? 's' : 'g', item: g };
    glass.classList.add('is-gin');
    glass.classList.remove('fizz');
    var tn = TINT[ginTint(g)];
    var liq = $('.gliq', glass);
    glass.style.setProperty('--gc', tn[0]);
    glass.style.setProperty('--glow', rgba(tn[1], .35));
    if (RM || quiet) {
      glass.style.setProperty('--gg', tn[1]); glass.style.setProperty('--gg2', tn[2]);
      liq.style.transform = 'translateY(70px)';
      writeGin(g, sig); return;
    }
    liq.style.transition = 'none'; liq.style.transform = 'translateY(156px)';
    void liq.getBoundingClientRect();
    liq.style.transition = '';
    requestAnimationFrame(function () { liq.style.transform = 'translateY(70px)'; });
    setInfo(function () { glass.style.setProperty('--gg', tn[1]); glass.style.setProperty('--gg2', tn[2]); writeGin(g, sig); });
  }
  rerender.push(function () {
    if (!current) return;
    if (current.kind === 'w') writeWine(current.item); else writeGin(current.item, current.kind === 's');
  });

  /* ---------------- tabs ---------------- */
  var tabs = [$('#tabWine'), $('#tabGin')], panels = [$('#panelWine'), $('#panelGin')];
  var lastWine = null, lastGin = null;
  function showTab(i, focus) {
    ensure('#carta');
    tabs.forEach(function (tb, j) { tb.setAttribute('aria-selected', i === j); tb.tabIndex = i === j ? 0 : -1; panels[j].hidden = i !== j; });
    if (focus) tabs[i].focus();
    if (i === 1) { var g = lastGin || { item: P.SIG[0], sig: true }; pourGin(g.item, g.sig); $$('.sig').forEach(function (x) { x.setAttribute('aria-pressed', g.sig && P.SIG[+x.dataset.i] === g.item); }); }
    else if (current && current.kind !== 'w') { pourWine(lastWine || P.W[0]); }
  }
  tabs.forEach(function (tb, i) {
    tb.addEventListener('click', function () { showTab(i); });
    tb.addEventListener('keydown', function (e) { if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); showTab(1 - i, true); } });
  });

  /* ---------------- wine list ---------------- */
  var fType = null, fZone = '', fGrape = '', serve = 'copa';
  var TYPE_ORDER = ['gen', 'bla', 'tin', 'ros', 'esp', 'dul', 'gen2', 'ver'];
  var grapes = {};
  P.W.forEach(function (w) { (w.g || '').split(/,\s*| y /).forEach(function (g) { g = g.trim(); if (g) grapes[g] = (grapes[g] || 0) + 1; }); });
  var plain = function (x) { return x.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase(); };
  var grapeList = Object.keys(grapes).sort(function (a, b) { var x = plain(a), z = plain(b); return x < z ? -1 : x > z ? 1 : 0; });

  function buildFilters() {
    var ft = $('#fType'); ft.innerHTML = '';
    var all = el('button', 'chip', L('Todos', 'All')); all.type = 'button'; all.dataset.v = ''; ft.appendChild(all);
    TYPE_ORDER.forEach(function (k) {
      var col = P.S[{ gen: 'fino', bla: 'blanco', tin: 'tinto', ros: 'rosado', esp: 'burb', dul: 'px', gen2: 'tawny', ver: 'vrojo' }[k]].c;
      var b = el('button', 'chip', '<span class="sw" style="--c:' + col + '"></span>' + esc(t(P.T[k])));
      b.type = 'button'; b.dataset.v = k; ft.appendChild(b);
    });
    $$('.chip', ft).forEach(function (b) { b.setAttribute('aria-pressed', (b.dataset.v || null) === fType || (!b.dataset.v && !fType)); });
    var zs = $('#fZone'); zs.innerHTML = '<option value="">' + L('Todas', 'All') + '</option>' + Object.keys(P.Z).map(function (k) { return '<option value="' + k + '"' + (fZone === k ? ' selected' : '') + '>' + esc(t(P.Z[k])) + '</option>'; }).join('');
    var gs = $('#fGrape'); gs.innerHTML = '<option value="">' + L('Todas', 'All') + '</option>' + grapeList.map(function (g) { return '<option' + (fGrape === g ? ' selected' : '') + '>' + esc(g) + '</option>'; }).join('');
  }
  $('#fType').addEventListener('click', function (e) {
    var b = e.target.closest('.chip'); if (!b) return;
    fType = b.dataset.v || null; buildFilters(); renderWines();
  });
  $('#fZone').addEventListener('change', function (e) { fZone = e.target.value; renderWines(); });
  $('#fGrape').addEventListener('change', function (e) { fGrape = e.target.value; renderWines(); });
  var segBtns = $$('#fServe button');
  function setServe(v, focus) {
    serve = v;
    segBtns.forEach(function (b) { var on = b.dataset.v === v; b.setAttribute('aria-checked', on); b.tabIndex = on ? 0 : -1; if (on && focus) b.focus(); });
    renderWines();
    if (current && current.kind === 'w') writeWine(current.item);
  }
  segBtns.forEach(function (b) {
    b.addEventListener('click', function () { setServe(b.dataset.v); });
    b.addEventListener('keydown', function (e) { if (/Arrow/.test(e.key)) { e.preventDefault(); setServe(b.dataset.v === 'copa' ? 'bot' : 'copa', true); } });
  });

  function wineMatches(w) {
    if (fType && w.t !== fType) return false;
    if (fZone && w.z !== fZone) return false;
    if (fGrape && (w.g || '').indexOf(fGrape) === -1) return false;
    if (serve === 'bot' && w.t === 'ver') return false;
    return true;
  }
  function renderWines() {
    var list = $('#wList'); list.innerHTML = '';
    var n = 0, frag = document.createDocumentFragment();
    TYPE_ORDER.forEach(function (k) {
      var items = P.W.filter(function (w) { return w.t === k && wineMatches(w); });
      if (!items.length) return;
      var h = el('li', 'wgroup', esc(t(P.T[k]))); frag.appendChild(h);
      items.forEach(function (w) {
        n++;
        var li = el('li');
        var b = el('button', 'wi');
        b.type = 'button';
        b.style.setProperty('--c', P.S[w.s].c);
        b.setAttribute('aria-pressed', current && current.item === w ? 'true' : 'false');
        var price = serve === 'bot' ? ph() + '<small>' + L('botella', 'bottle') + '</small>' : money(w.p) + '<small>' + w.ml + ' ml</small>';
        b.innerHTML = '<span class="wi__sw" aria-hidden="true"></span><span class="wi__t"><span class="wi__n">' + esc(w.n) + '</span><span class="wi__m">' + esc(wineMeta(w)) + '</span></span><span class="wi__p">' + price + '</span>';
        b._w = w;
        li.appendChild(b); frag.appendChild(li);
      });
    });
    list.appendChild(frag);
    $('#wCount').textContent = n ? (n + ' ' + L(n === 1 ? 'referencia' : 'referencias', n === 1 ? 'wine' : 'wines')) : '';
    if (!n) {
      var li = el('li', 'empty', '<p>' + L('Ningún vino cumple estos filtros.', 'No wine matches these filters.') + '</p>');
      var r = el('button', 'btn btn--ghost', L('Quitar filtros', 'Clear filters')); r.type = 'button';
      r.addEventListener('click', function () { fType = null; fZone = ''; fGrape = ''; buildFilters(); renderWines(); });
      li.appendChild(r); list.appendChild(li);
    }
  }
  $('#wList').addEventListener('click', function (e) {
    var b = e.target.closest('.wi'); if (!b) return;
    $$('#wList .wi[aria-pressed="true"]').forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
    b.setAttribute('aria-pressed', 'true');
    lastWine = b._w; pourWine(b._w);
  });
  lazy('#carta', function () { buildFilters(); renderWines(); });

  /* ---------------- gins ---------------- */
  var gQ = '', gC = 'all', gShown = 30;
  function buildSigs() {
    $('#sigList').innerHTML = P.SIG.map(function (s, i) {
      return '<li><button type="button" class="sig" data-i="' + i + '" aria-pressed="' + (current && current.item === s) + '"><span class="sig__n">' + esc(s.n) + '</span><span class="sig__p">' + money(s.p) + '</span><span class="sig__d">' + esc(t(s.d)) + '</span></button></li>';
    }).join('');
  }
  $('#sigList').addEventListener('click', function (e) {
    var b = e.target.closest('.sig'); if (!b) return;
    var s = P.SIG[+b.dataset.i];
    $$('.sig, .gi').forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
    b.setAttribute('aria-pressed', 'true');
    lastGin = { item: s, sig: true }; pourGin(s, true);
  });
  function buildCountries() {
    var counts = {};
    P.G.forEach(function (g) { counts[g.c] = (counts[g.c] || 0) + 1; });
    var html = '<button type="button" class="chip" data-v="all">' + L('Todas', 'All') + ' · ' + P.G.length + '</button>' +
      '<button type="button" class="chip" data-v="zero">0,0 · ' + P.ZERO.length + '</button>' +
      Object.keys(P.GC).map(function (k) { return '<button type="button" class="chip" data-v="' + k + '">' + esc(t(P.GC[k])) + ' · ' + counts[k] + '</button>'; }).join('');
    var box = $('#gCountry'); box.innerHTML = html;
    $$('.chip', box).forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.v === gC); });
  }
  $('#gCountry').addEventListener('click', function (e) {
    var b = e.target.closest('.chip'); if (!b) return;
    gC = b.dataset.v; gShown = 30;
    $$('#gCountry .chip').forEach(function (x) { x.setAttribute('aria-pressed', x === b); });
    renderGins();
  });
  function norm(s) { return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }
  var sT;
  $('#gSearch').addEventListener('input', function (e) { clearTimeout(sT); sT = setTimeout(function () { gQ = norm(e.target.value.trim()); gShown = 30; renderGins(); }, 120); });
  function renderGins() {
    var src = gC === 'zero' ? P.ZERO : P.G.filter(function (g) { return gC === 'all' || g.c === gC; });
    if (gQ) src = (gC === 'zero' ? P.ZERO : P.G.concat(gC === 'all' ? P.ZERO : [])).filter(function (g) { return (gC === 'all' || gC === 'zero' || g.c === gC) && norm(g.n + ' ' + (g.o || '')).indexOf(gQ) !== -1; });
    var list = $('#gList');
    var shown = src.slice(0, gShown);
    list.innerHTML = shown.map(function (g, i) {
      var origin = (g.c ? t(P.GC[g.c]) : t({ es: 'Sin alcohol', en: 'Alcohol-free' })) + (g.o ? ' · ' + g.o : '');
      return '<li><button type="button" class="gi" data-i="' + i + '" aria-pressed="' + (current && current.item === g) + '"><span class="gi__n">' + esc(g.n) + '</span><span class="gi__o">' + esc(origin) + '</span><span class="gi__p">' + money(g.p) + '</span></button></li>';
    }).join('') || '<li class="empty">' + L('Ninguna ginebra con ese nombre. Prueba con otra búsqueda o pregunta en barra.', 'No gin by that name. Try another search or ask at the bar.') + '</li>';
    list._items = shown;
    $('#gCount').textContent = src.length + ' ' + L(src.length === 1 ? 'ginebra' : 'ginebras', src.length === 1 ? 'gin' : 'gins');
    var more = $('#gMore');
    more.hidden = src.length <= gShown;
  }
  $('#gList').addEventListener('click', function (e) {
    var b = e.target.closest('.gi'); if (!b) return;
    var g = $('#gList')._items[+b.dataset.i];
    $$('.sig, .gi').forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
    b.setAttribute('aria-pressed', 'true');
    lastGin = { item: g, sig: false }; pourGin(g, false);
  });
  $('#gMore').addEventListener('click', function () {
    var before = gShown; gShown += 40; renderGins();
    var nb = $$('#gList .gi')[before]; if (nb) nb.focus({ preventScroll: true });
  });
  lazy('#carta', function () { buildSigs(); buildCountries(); renderGins(); });

  /* ---------------- pairing wheel ---------------- */
  var SEG = P.SEG, NS = 'http://www.w3.org/2000/svg';
  var wheelRot = $('#wheelRot'), rot = 0, pairCur = 'jamon';
  function arc(r0, r1, a0, a1) {
    function pt(r, a) { return [r * Math.sin(a), -r * Math.cos(a)]; }
    var p0 = pt(r1, a0), p1 = pt(r1, a1), p2 = pt(r0, a1), p3 = pt(r0, a0), lg = a1 - a0 > Math.PI ? 1 : 0;
    return 'M' + p0 + 'A' + r1 + ',' + r1 + ' 0 ' + lg + ' 1 ' + p1 + 'L' + p2 + 'A' + r0 + ',' + r0 + ' 0 ' + lg + ' 0 ' + p3 + 'Z';
  }
  function buildWheel() {
    wheelRot.innerHTML = '';
    var n = SEG.length, step = Math.PI * 2 / n;
    var ring = document.createElementNS(NS, 'circle'); ring.setAttribute('r', 150); ring.setAttribute('class', 'wheel__ring'); wheelRot.appendChild(ring);
    SEG.forEach(function (s, i) {
      var g = document.createElementNS(NS, 'g'); g.setAttribute('class', 'wheel__seg'); g.dataset.k = s.k;
      var a0 = i * step + 0.012, a1 = (i + 1) * step - 0.012;
      var p = document.createElementNS(NS, 'path'); p.setAttribute('d', arc(88, 146, a0, a1)); p.setAttribute('fill', s.c); g.appendChild(p);
      var mid = (i + 0.5) * step, deg = mid * 180 / Math.PI;
      var tx = document.createElementNS(NS, 'text');
      var flip = deg > 90 && deg < 270;
      tx.setAttribute('transform', 'rotate(' + deg + ') translate(0,-117) rotate(' + (flip ? 180 : 0) + ')');
      tx.setAttribute('text-anchor', 'middle'); tx.setAttribute('dominant-baseline', 'middle');
      var light = /e9dc9c|ece2a2|e2c56c|f3e7b8|e9998a/.test(s.c);
      if (light) tx.setAttribute('class', 'dark');
      var words = t(s).split(' ');
      var l1 = words.length > 2 ? words.slice(0, Math.ceil(words.length / 2)).join(' ') : (words.length === 2 && t(s).length > 12 ? words[0] : t(s));
      var l2 = t(s).slice(l1.length).trim();
      [l1, l2].forEach(function (line, j) {
        if (!line) return;
        var ts = document.createElementNS(NS, 'tspan'); ts.setAttribute('x', 0); ts.setAttribute('dy', j === 0 ? (l2 ? '-0.55em' : '0') : '1.15em'); ts.textContent = line; tx.appendChild(ts);
      });
      g.appendChild(tx);
      wheelRot.appendChild(g);
    });
    var inner = document.createElementNS(NS, 'circle'); inner.setAttribute('r', 84); inner.setAttribute('class', 'wheel__ring'); wheelRot.appendChild(inner);
  }
  var DISHES = P.TAPAS.concat([{ id: 'quesos', es: 'Tabla de quesos internacionales', en: 'International cheese board', rp: 25.95 }], P.DULCES);
  function buildPairSel() {
    $('#pairSel').innerHTML = DISHES.map(function (d) { return '<option value="' + d.id + '"' + (d.id === pairCur ? ' selected' : '') + '>' + esc(t(d)) + '</option>'; }).join('');
    var quick = ['jamon', 'rabo', 'anchoas', 'manchego', 'quesos', 'choco'];
    $('#pairQuick').innerHTML = quick.map(function (id) {
      var d = DISHES.filter(function (x) { return x.id === id; })[0];
      var short = { jamon: L('Jamón', 'Ham'), rabo: L('Croquetas de rabo', 'Oxtail croquettes'), anchoas: L('Anchoas', 'Anchovies'), manchego: 'Manchego', quesos: L('Quesos', 'Cheeses'), choco: L('Chocolate', 'Chocolate') }[id];
      return '<button type="button" class="chip" data-id="' + id + '" aria-pressed="' + (id === pairCur) + '" title="' + esc(t(d)) + '">' + esc(short) + '</button>';
    }).join('');
  }
  var pairT = [];
  function setPair(id, quiet) {
    pairCur = id;
    var pr = P.PAIR[id], d = DISHES.filter(function (x) { return x.id === id; })[0];
    var idx = 0; SEG.forEach(function (s, i) { if (s.k === pr.k) idx = i; });
    var target = -(idx + 0.5) * 360 / SEG.length;
    /* always turn forward, at least half a turn, so every choice feels like a spin */
    var cur = rot; var delta = ((target - cur) % 360 + 360) % 360; if (!quiet && delta < 180) delta += 360;
    rot = quiet ? target : cur + delta;
    wheelRot.style.transform = 'rotate(' + rot + 'deg)';
    if (!quiet && !RM) {
      var wh = $('#wheel'), tn = Math.max(3, Math.round(delta / (360 / SEG.length)));
      wh.style.setProperty('--tn', tn); wh.style.setProperty('--tk', (1.35 / tn).toFixed(3) + 's');
      wh.classList.remove('ticking', 'settled'); void wh.offsetWidth; wh.classList.add('ticking');
      clearTimeout(wh._t); wh._t = setTimeout(function () { wh.classList.remove('ticking'); wh.classList.add('settled'); }, 1750);
    }
    $$('.wheel__seg', wheelRot).forEach(function (g) { g.classList.toggle('on', g.dataset.k === pr.k); });
    $('#pairSel').value = id;
    $$('#pairQuick .chip').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.id === id); });
    var seg = SEG[idx];
    $('#pairStyle').textContent = t(seg);
    $('#pairDish').textContent = t(d);
    $('#pairWhy').textContent = t(pr);
    var ul = $('#pairWines'); ul.innerHTML = '';
    pairT.forEach(clearTimeout); pairT = [];
    pr.w.forEach(function (name, i) {
      var w = P.W.filter(function (x) { return x.n === name; })[0]; if (!w) return;
      var li = el('li');
      var b = el('button', 'pw');
      b.type = 'button';
      b.style.setProperty('--c', P.S[w.s].c);
      b.innerHTML = '<svg class="pw__g" viewBox="0 0 26 36" aria-hidden="true"><path class="f" d="M5.4 9h15.2c-.2 4.5-2.8 9-7.6 9S5.6 13.5 5.4 9z"/><path d="M5 2c-.6 6 0 16 8 16s8.6-10 8-16zM13 18v14M8 33h10"/></svg><span><span class="pw__n">' + esc(w.n) + '</span><span class="pw__m">' + esc(t(P.T[w.t]) + ' · ' + wineMeta(w)) + '</span></span><span class="pw__p">' + money(w.p) + '</span>';
      b.setAttribute('aria-label', w.n + ', ' + money(w.p) + '. ' + L('Ver en la carta', 'See it in the list'));
      b.addEventListener('click', function () { goToWine(w); });
      li.appendChild(b); ul.appendChild(li);
      if (RM || quiet) b.classList.add('in');
      else pairT.push(setTimeout(function () { b.classList.add('in'); }, 700 + i * 120));
    });
  }
  $('#pairSel').addEventListener('change', function (e) { setPair(e.target.value); });
  $('#pairQuick').addEventListener('click', function (e) { var b = e.target.closest('.chip'); if (b) setPair(b.dataset.id); });
  lazy('#maridaje', function () { buildWheel(); buildPairSel(); setPair(pairCur, true); });

  function goToWine(w) {
    ensure('#carta');
    showTab(0);
    fType = null; fZone = ''; fGrape = ''; if (serve === 'bot') { serve = 'copa'; segBtns.forEach(function (b) { b.setAttribute('aria-checked', b.dataset.v === 'copa'); b.tabIndex = b.dataset.v === 'copa' ? 0 : -1; }); }
    buildFilters(); renderWines();
    var btn = $$('#wList .wi').filter(function (b) { return b._w === w; })[0];
    $('#carta').scrollIntoView({ behavior: RM ? 'auto' : 'smooth' });
    setTimeout(function () {
      if (!btn) return;
      btn.click();
      btn.scrollIntoView({ behavior: RM ? 'auto' : 'smooth', block: 'center' });
      btn.focus({ preventScroll: true });
    }, RM ? 0 : 650);
  }

  /* ---------------- cellar shelf + click & collect ---------------- */
  var BOT = {
    bla: { glass: '#4b5a2f', cap: '#d9c27a' }, tin: { glass: '#241a13', cap: '#7a1a2e' }, ros: { glass: '#d7a294', cap: '#efd6cb' },
    esp: { glass: '#1e2a1b', cap: '#d9b779' }, gen: { glass: '#2f2111', cap: '#151515' }, dul: { glass: '#3b1f0d', cap: '#93602e' }, gen2: { glass: '#1f130d', cap: '#661b1b' }
  };
  var ZONES = ['gal', 'cyl', 'rio', 'est', 'and', 'int'];
  var shelfWines = P.W.filter(function (w) { return w.t !== 'ver'; });
  var basket = {};
  try { basket = JSON.parse(localStorage.getItem('pc-basket') || '{}') || {}; } catch (e) { basket = {}; }
  var pulled = null, pQty = 1;

  function bottleSVG(w) {
    var c = BOT[w.t];
    /* label text runs up the label, one or two lines */
    var name = w.n.replace(/"/g, ''), lines = [name];
    if (name.length > 16) {
      var mid = Math.round(name.length / 2), cut = name.lastIndexOf(' ', mid); if (cut < 4) cut = name.indexOf(' ', mid);
      if (cut > 0) lines = [name.slice(0, cut), name.slice(cut + 1)];
    }
    var txt = lines.map(function (ln, i) {
      var y = lines.length === 1 ? 32.5 : (i === 0 ? 28.5 : 37);
      var fit = ln.length > 15 ? ' textLength="62" lengthAdjust="spacingAndGlyphs"' : '';
      return '<text x="0" y="' + y + '"' + fit + '>' + esc(ln) + '</text>';
    }).join('');
    return '<svg viewBox="0 0 60 200" aria-hidden="true" style="--glass:' + c.glass + ';--cap:' + c.cap + '"><use href="#bottleShape"/><use href="#bottleShape" class="bt__sheen"/>' +
      '<rect class="bt__cap" x="23" y="2" width="14" height="' + (w.t === 'esp' ? 34 : 20) + '" rx="2"/><rect class="bt__lab" x="13" y="100" width="34" height="70" rx="2"/><rect class="bt__band" x="13" y="104" width="34" height="2"/>' +
      '<g clip-path="url(#bclip)"><g transform="skewX(-18)"><rect class="bt__glint" x="0" y="0" width="12" height="200"/></g></g><g class="bt__txt" transform="translate(0 168) rotate(-90)">' + txt.replace(/x="0"/g, 'x="2"') + '</g></svg>';
  }
  function buildShelves() {
    var box = $('#shelves'); box.innerHTML = '';
    var nav = $('#shelfNav'); nav.innerHTML = '';
    ZONES.forEach(function (z) {
      var ws = shelfWines.filter(function (w) { return w.z === z; });
      if (!ws.length) return;
      var bay = el('div', 'bay'); bay.id = 'bay-' + z;
      bay.innerHTML = '<p class="bay__lbl">' + esc(t(P.Z[z])) + ' <small>' + ws.length + '</small></p>';
      var row = el('div', 'bay__row');
      ws.forEach(function (w) {
        var b = el('button', 'bt');
        b.type = 'button';
        b._w = w;
        b.setAttribute('aria-pressed', pulled === w ? 'true' : 'false');
        b.setAttribute('aria-label', w.n + ', ' + w.r + (basket[w.n] ? ', ' + basket[w.n] + ' ' + L('en tu pedido', 'in your order') : ''));
        b.innerHTML = bottleSVG(w) + (basket[w.n] ? '<span class="bt__in" aria-hidden="true">' + basket[w.n] + '</span>' : '');
        row.appendChild(b);
      });
      bay.appendChild(row); box.appendChild(bay);
      var c = el('button', 'chip', esc(t(P.Z[z]))); c.type = 'button'; c.dataset.z = z; nav.appendChild(c);
    });
  }
  $('#shelfNav').addEventListener('click', function (e) {
    var c = e.target.closest('.chip'); if (!c) return;
    var bay = $('#bay-' + c.dataset.z), box = $('#shelves');
    var pad = parseFloat(getComputedStyle(box).paddingLeft) || 20;
    box.scrollTo({ left: bay.offsetLeft - pad, behavior: RM ? 'auto' : 'smooth' });
  });
  $('#shelves').addEventListener('click', function (e) {
    var b = e.target.closest('.bt'); if (!b) return;
    $$('#shelves .bt[aria-pressed="true"]').forEach(function (x) { if (x !== b) x.setAttribute('aria-pressed', 'false'); });
    b.setAttribute('aria-pressed', 'true');
    showPull(b._w);
  });
  function showPull(w) {
    pulled = w; pQty = basket[w.n] || 1;
    var pull = $('#pull');
    pull.hidden = false;
    pull.style.animation = 'none'; void pull.offsetWidth; pull.style.animation = '';
    $('.pull__bottle', pull).innerHTML = bottleSVG(w);
    writePull();
    if (window.innerWidth < 960) {
      var r = pull.getBoundingClientRect();
      if (r.bottom > window.innerHeight - 70) window.scrollBy({ top: r.bottom - window.innerHeight + 90, behavior: RM ? 'auto' : 'smooth' });
    }
  }
  function writePull() {
    if (!pulled) return;
    var w = pulled;
    $('#pZone').textContent = t(P.Z[w.z]) + ' · ' + t(P.T[w.t]);
    $('#pName').textContent = w.n;
    $('#pMeta').textContent = [w.g, w.r, w.b].filter(Boolean).join(' · ') + ' · ' + L('En copa: ', 'By the glass: ') + money(w.p);
    $('#pQty').textContent = pQty;
    $('#pAdd').innerHTML = basket[w.n] ? L('Actualizar pedido', 'Update order') : L('Añadir al pedido', 'Add to order');
  }
  $('#pMinus').addEventListener('click', function () { pQty = Math.max(1, pQty - 1); $('#pQty').textContent = pQty; });
  $('#pPlus').addEventListener('click', function () { pQty = Math.min(24, pQty + 1); $('#pQty').textContent = pQty; });
  $('#pAdd').addEventListener('click', function () {
    if (!pulled) return;
    basket[pulled.n] = pQty;
    saveBasket(); renderBasket(); buildShelves(); writePull();
    var bd = $('#mbarN'); bd.classList.remove('bump'); void bd.offsetWidth; bd.classList.add('bump');
    toast(L('Añadido: ', 'Added: ') + pulled.n + ' × ' + pQty);
  });
  function saveBasket() { try { localStorage.setItem('pc-basket', JSON.stringify(basket)); } catch (e) {} }
  function renderBasket() {
    var names = Object.keys(basket).filter(function (n) { return basket[n] > 0 && shelfWines.some(function (w) { return w.n === n; }); });
    var total = names.reduce(function (s, n) { return s + basket[n]; }, 0);
    $('#basket').classList.toggle('has', total > 0);
    $('#bCount').textContent = total ? total + ' ' + L(total === 1 ? 'botella' : 'botellas', total === 1 ? 'bottle' : 'bottles') : '';
    $('#bList').innerHTML = names.map(function (n) {
      return '<li><b>' + esc(n) + '</b><span>× ' + basket[n] + ' · ' + ph() + '</span><button type="button" data-n="' + esc(n) + '" aria-label="' + esc(L('Quitar ', 'Remove ') + n) + '">×</button></li>';
    }).join('');
    var badge = $('#mbarN'); badge.hidden = !total; badge.textContent = total;
  }
  $('#bList').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    delete basket[b.dataset.n]; saveBasket(); renderBasket(); buildShelves(); writePull();
  });
  lazy('#bodega', function () { buildShelves(); writePull(); });
  rerender.push(renderBasket);

  /* ---------------- sticky glass: fade out at the end of the list (phones) ---------------- */
  /* checked on scroll only while the list section is on screen (cartaOn is set by an observer below) */
  var cartaOn = false, goneRaf = 0, cartaEnd = $('#cartaEnd');
  function checkGone() {
    goneRaf = 0;
    var mobile = window.innerWidth < 960;
    var limit = (parseInt(getComputedStyle(root).getPropertyValue('--hh'), 10) || 60) + glass.offsetHeight + 8;
    glass.classList.toggle('gone', mobile && cartaEnd.getBoundingClientRect().top < limit);
  }
  window.addEventListener('scroll', function () { if (cartaOn && !goneRaf) goneRaf = requestAnimationFrame(checkGone); }, { passive: true });

  /* ---------------- la pared de ginebras ---------------- */
  var pared = $('#pared'), wallEl = $('#paredWall'), tiltEl = $('#paredTilt'), wallRows = [], wallTiles = [], wallItems = [];
  var ROWS = 6, travel = 0, pinH = 0, wallOn = false, wallRaf = 0, focusIdx = 0, wallPick = null;
  var DRIFT = [-36, 28, -18, 40, -26, 20];
  function hhPx() { return parseInt(getComputedStyle(root).getPropertyValue('--hh'), 10) || 60; }
  function tileLabel(g) { return g.n + ', ' + t(P.GC[g.c]) + ', ' + money(g.p); }
  function buildWall() {
    if (wallItems.length) { wallTiles.forEach(function (b, i) { b.setAttribute('aria-label', tileLabel(wallItems[i])); }); return; }
    wallItems = P.G.slice();
    /* one shelf per idle slot, so building 294 bottles never blocks a frame */
    var per = Math.ceil(wallItems.length / ROWS), r = 0;
    var idle = window.requestIdleCallback || function (f) { return setTimeout(f, 1); };
    (function nextRow() {
      if (r >= ROWS) { measureWall(); warmShelves(); return; }
      var row = el('div', 'pared__row');
      /* explicit width so measuring works while off-screen shelves skip rendering (content-visibility) */
      var tw = window.matchMedia('(min-width: 960px)').matches ? 48 : 44;
      row.style.width = (per * (tw + 4) - 4) + 'px';
      wallItems.slice(r * per, (r + 1) * per).forEach(function (g, j) {
        var i = r * per + j, tn = TINT[ginTint(g)];
        var b = el('button', 'gb', '<i><s></s></i><b></b>');
        b.type = 'button'; b.tabIndex = i === 0 ? 0 : -1; b.dataset.i = i;
        b.style.setProperty('--t', tn[0] === '#e4f0ee' ? '#cfe3e6' : tn[0]);
        b.setAttribute('aria-label', tileLabel(g));
        b.setAttribute('aria-pressed', 'false');
        wallTiles[i] = b; row.appendChild(b);
      });
      wallRows.push(row); wallEl.appendChild(row);
      r++; idle(nextRow, { timeout: 400 });
    })();
  }
  var pinOn = !RM && 'IntersectionObserver' in window;
  function measureWall() {
    if (!pinOn || !wallRows.length) return;
    pared.classList.add('pared--pin');
    var stage = $('#paredStage');
    travel = Math.max(0, wallEl.scrollWidth - stage.clientWidth);
    pinH = $('.pared__pin', pared).offsetHeight;
    pared.style.height = Math.round(pinH + travel / 1.3 + 40) + 'px';
    wallFrame();
  }
  function wallProgress() {
    var r = pared.getBoundingClientRect(), total = pared.offsetHeight - pinH;
    return total > 0 ? Math.min(1, Math.max(0, (hhPx() - r.top) / total)) : 0;
  }
  function wallFrame() {
    wallRaf = 0;
    var p = wallProgress(), bell = p * (1 - p) * 4;
    for (var r = 0; r < wallRows.length; r++) wallRows[r].style.transform = 'translate3d(' + (-travel * p + DRIFT[r] * bell).toFixed(1) + 'px,0,0)';
    sweepEl.style.transform = 'translate3d(' + (-40 + p * 290).toFixed(1) + '%,0,0)';
  }
  function onWallScroll() { if (wallOn && !wallRaf && travel) wallRaf = requestAnimationFrame(wallFrame); }
  window.addEventListener('scroll', onWallScroll, { passive: true });
  var rzT;
  window.addEventListener('resize', function () { clearTimeout(rzT); rzT = setTimeout(function () { if (wallRows.length) measureWall(); }, 150); });
  /* tilt: pointer on desktop, device orientation where no permission prompt is needed */
  function tilt(x, y) { tiltEl.style.transform = 'rotateY(' + (x * 4).toFixed(2) + 'deg) rotateX(' + (-y * 3).toFixed(2) + 'deg)'; }
  if (!RM) {
    $('#paredStage').addEventListener('pointermove', function (e) {
      if (e.pointerType !== 'mouse') return;
      var r = e.currentTarget.getBoundingClientRect();
      tilt((e.clientX - r.left) / r.width - 0.5, (e.clientY - r.top) / r.height - 0.5);
    });
    $('#paredStage').addEventListener('pointerleave', function () { tilt(0, 0); });
    if (window.DeviceOrientationEvent && typeof DeviceOrientationEvent.requestPermission !== 'function') {
      window.addEventListener('deviceorientation', function (e) {
        if (!wallOn || e.gamma == null) return;
        tilt(Math.max(-1, Math.min(1, e.gamma / 30)) * 0.6, Math.max(-1, Math.min(1, (e.beta - 45) / 40)) * 0.5);
      }, { passive: true });
    }
  }
  function pickWall(i, quiet) {
    var g = wallItems[i]; if (!g) return;
    if (wallPick != null && wallTiles[wallPick]) { wallTiles[wallPick].classList.remove('lit'); wallTiles[wallPick].setAttribute('aria-pressed', 'false'); }
    wallPick = i; wallTiles[i].classList.add('lit'); wallTiles[i].setAttribute('aria-pressed', 'true');
    var tn = TINT[ginTint(g)], pick = $('#paredPick'), liq = $('.pliq', pick);
    pick.classList.add('has');
    pick.style.setProperty('--pc', tn[0]);
    $('#pwO').textContent = t(P.GC[g.c]) + (g.o ? ' · ' + g.o : '');
    $('#pwN').textContent = g.n;
    $('#pwP').innerHTML = money(g.p) + ' · G&amp;T';
    if (RM || quiet) { liq.style.transform = 'translateY(70px)'; return; }
    liq.style.transition = 'none'; liq.style.transform = 'translateY(156px)'; void liq.getBoundingClientRect(); liq.style.transition = '';
    requestAnimationFrame(function () { liq.style.transform = 'translateY(70px)'; });
  }
  function writeWallIdle() {
    if (wallPick != null) { pickWall(wallPick, true); return; }
    $('#pwO').textContent = 'Gin & tonic';
    $('#pwN').textContent = L('Toca una botella', 'Tap a bottle');
    $('#pwP').textContent = L('Se enciende y se sirve aquí.', 'It lights up and pours here.');
  }
  wallEl.addEventListener('click', function (e) { var b = e.target.closest('.gb'); if (b) pickWall(+b.dataset.i); });
  /* roving focus with arrow keys; keep the focused bottle in view by moving the page, not the stage */
  wallEl.addEventListener('keydown', function (e) {
    var per = Math.ceil(wallItems.length / ROWS), i = focusIdx, n = wallItems.length;
    var map = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: per, ArrowUp: -per, Home: -i, End: n - 1 - i };
    if (!(e.key in map)) return;
    e.preventDefault();
    focusTile(Math.min(n - 1, Math.max(0, i + map[e.key])));
  });
  wallEl.addEventListener('focusin', function (e) { var b = e.target.closest('.gb'); if (b) { focusIdx = +b.dataset.i; revealTile(b); } });
  function focusTile(j) {
    wallTiles[focusIdx].tabIndex = -1; focusIdx = j; wallTiles[j].tabIndex = 0;
    wallTiles[j].focus({ preventScroll: true }); revealTile(wallTiles[j]);
  }
  function revealTile(b) {
    var stage = $('#paredStage');
    if (!pared.classList.contains('pared--pin') || !travel) return;
    stage.scrollLeft = 0;
    var x = b.offsetLeft + b.offsetWidth / 2 - stage.clientWidth / 2;
    var p = Math.min(1, Math.max(0, x / travel));
    var top = pared.getBoundingClientRect().top + window.scrollY - hhPx();
    window.scrollTo({ top: top + p * (pared.offsetHeight - pinH), behavior: 'instant' });
  }
  $('#pwGo').addEventListener('click', function () {
    var g = wallItems[wallPick]; if (!g) return;
    ensure('#carta'); showTab(1);
    gQ = norm(g.n); gC = 'all'; gShown = 30; $('#gSearch').value = g.n; buildCountries(); renderGins();
    $('#carta').scrollIntoView({ behavior: RM ? 'auto' : 'smooth' });
    setTimeout(function () {
      var b = $$('#gList .gi').filter(function (x) { return $('#gList')._items[+x.dataset.i] === g; })[0];
      if (b) { b.click(); b.focus({ preventScroll: true }); }
    }, RM ? 0 : 600);
  });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) { es.forEach(function (x) { wallOn = x.isIntersecting; pared.classList.toggle('live', wallOn && !RM); if (wallOn) onWallScroll(); }); }).observe(pared);
  }
  /* Shelves start as content-visibility:auto (skipped while off-screen). Right after the idle build they are
     warmed one per idle slot, so their style and layout are done before anyone scrolls to the wall. */
  var sweepEl = $('.pared__sweep', pared);
  function warmShelves() {
    var idle = window.requestIdleCallback || function (f) { return setTimeout(f, 30); }, k = 0;
    (function warm() { if (k < wallRows.length) { wallRows[k++].classList.add('warm'); void wallEl.offsetWidth; idle(warm, { timeout: 1000 }); } })();
  }
  lazy('#pared', function () { buildWall(); writeWallIdle(); wallEl.setAttribute('aria-label', L('Pared de ginebras: usa las flechas para moverte', 'Gin wall: use the arrow keys to move')); });

  /* ---------------- cellar swipe hint ---------------- */
  (function () {
    var sh = $('#shelves'), wrap = $('#cellarSwipe'), hint = $('#swipeHint'), st = 0;
    sh.addEventListener('scroll', function () {
      if (st) return;
      st = requestAnimationFrame(function () {
        st = 0;
        if (sh.scrollLeft > 30) hint.classList.add('done');
        wrap.classList.toggle('end', sh.scrollLeft + sh.clientWidth >= sh.scrollWidth - 4);
      });
    }, { passive: true });
  })();

  /* ---------------- tapas ---------------- */
  var hideAl = {};
  function dishRow(d) {
    var li = el('li', 'md');
    li.dataset.a = d.a.join(' ');
    li.innerHTML = '<span class="md__n">' + esc(t(d)) + (d.u ? '<small>' + esc(t(d.u)) + '</small>' : '') + '</span>' +
      '<span class="md__p' + (d.tp ? '' : ' none') + '">' + (d.tp ? money(d.tp) : '<span aria-hidden="true">–</span><span class="sr">' + L('sin tapa', 'no tapa size') + '</span>') + '</span>' +
      '<span class="md__p' + (d.rp ? '' : ' none') + '">' + (d.rp ? money(d.rp) : '<span aria-hidden="true">–</span><span class="sr">' + L('sin ración', 'no portion size') + '</span>') + '</span>' +
      '<span class="md__a">' + (d.a.length ? d.a.map(function (k) { return '<span class="al">' + esc(t(P.AL[k])) + '</span>'; }).join('') : '<span class="al">' + L('Sin alérgenos marcados', 'No allergens marked') + '</span>') + '</span>';
    return li;
  }
  function renderTapas() {
    var tl = $('#tList'), dl = $('#dList'); tl.innerHTML = ''; dl.innerHTML = '';
    P.TAPAS.forEach(function (d) { tl.appendChild(dishRow(d)); });
    P.DULCES.forEach(function (d) { dl.appendChild(dishRow(d)); });
    $('#alChips').innerHTML = Object.keys(P.AL).map(function (k) { return '<button type="button" class="chip chip--x" data-k="' + k + '" aria-pressed="' + !!hideAl[k] + '">' + esc(t(P.AL[k])) + '</button>'; }).join('');
    filterTapas();
    $('#qTable tbody').innerHTML = P.QUESOS.map(function (q) {
      var age = q[3].split('|');
      return '<tr><td>' + esc(q[0]) + '</td><td>' + esc(P.PAIS[q[1]][lang === 'en' ? 1 : 0]) + '</td><td>' + esc(lang === 'en' ? P.LECHE[q[2]] : q[2].charAt(0).toUpperCase() + q[2].slice(1)) + '</td><td>' + esc(age[lang === 'en' ? 1 : 0]) + '</td></tr>';
    }).join('');
  }
  function filterTapas() {
    var keys = Object.keys(hideAl).filter(function (k) { return hideAl[k]; });
    var vis = 0;
    $$('.md').forEach(function (li) {
      var a = li.dataset.a.split(' ');
      var hide = keys.some(function (k) { return a.indexOf(k) !== -1; });
      li.hidden = hide; if (!hide) vis++;
    });
    $('#tNone').hidden = vis > 0;
  }
  $('#alChips').addEventListener('click', function (e) {
    var b = e.target.closest('.chip'); if (!b) return;
    hideAl[b.dataset.k] = !hideAl[b.dataset.k];
    b.setAttribute('aria-pressed', hideAl[b.dataset.k]);
    filterTapas();
  });
  lazy('#tapas', renderTapas);

  /* ---------------- form helpers ---------------- */
  function iso(d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  var today = new Date(); today.setHours(0, 0, 0, 0);
  $$('input[type="date"]').forEach(function (i) { i.min = iso(today); if (!i.value) i.value = iso(today); });
  function fillSelects() {
    var hrs = []; for (var h = 11; h <= 25; h++) { [0, 30].forEach(function (m) { if (h === 25 && m) return; hrs.push(String(h % 24).padStart(2, '0') + ':' + (m ? '30' : '00')); }); }
    $$('.js-hours').forEach(function (s) { var v = s.value || '20:00'; s.innerHTML = hrs.map(function (x) { return '<option' + (x === v ? ' selected' : '') + '>' + x + '</option>'; }).join(''); });
    $$('.js-pax').forEach(function (s) { var v = s.value || '2'; var o = ''; for (var i = 1; i <= 12; i++) o += '<option value="' + i + '"' + (String(i) === v ? ' selected' : '') + '>' + i + '</option>'; o += '<option value="13+"' + (v === '13+' ? ' selected' : '') + '>13+</option>'; s.innerHTML = o; });
    $$('.js-group').forEach(function (s) { var v = s.value || '8'; var o = ''; [6, 8, 10, 12, 15, 20, 25, 30].forEach(function (i) { o += '<option value="' + i + '"' + (String(i) === v ? ' selected' : '') + '>' + i + '</option>'; }); o += '<option value="30+"' + (v === '30+' ? ' selected' : '') + '>30+</option>'; s.innerHTML = o; });
  }
  fillSelects();
  /* date words without Intl (keeps phones from loading locale data mid-scroll) */
  var MON = { es: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'], en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'] };
  var DOW = { es: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'], en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] };
  function longDate(d) { return lang === 'en' ? DOW.en[d.getDay()] + ' ' + d.getDate() + ' ' + MON.en[d.getMonth()] : DOW.es[d.getDay()] + ', ' + d.getDate() + ' de ' + MON.es[d.getMonth()]; }
  function monthYear(d) { return lang === 'en' ? MON.en[d.getMonth()] + ' ' + d.getFullYear() : MON.es[d.getMonth()] + ' de ' + d.getFullYear(); }
  function niceDate(v) {
    if (!v) return '';
    var p = v.split('-'); var d = new Date(+p[0], +p[1] - 1, +p[2]);
    return longDate(d);
  }
  function fieldErr(input, on) {
    var f = input.closest('.field'); if (!f) return;
    var m = f.querySelector('.msg');
    f.classList.toggle('err', on);
    input.setAttribute('aria-invalid', on ? 'true' : 'false');
    if (on && !m) { m = el('p', 'msg'); m.id = input.id + '-msg'; f.appendChild(m); input.setAttribute('aria-describedby', m.id); }
    if (m) m.textContent = on ? (input.type === 'date' ? L('Elige un día a partir de hoy.', 'Choose a day from today on.') : L('Escribe tu nombre para la reserva.', 'Add your name for the booking.')) : '';
  }
  function invalid(input) { return input.required && (!input.value.trim() || (input.type === 'date' && input.value < iso(today))); }
  $$('form.form').forEach(function (f) {
    $$('input,select', f).forEach(function (i) {
      i.addEventListener('blur', function () { if (i.required) fieldErr(i, invalid(i)); });
      i.addEventListener('input', function () { if (i.closest('.field.err') && !invalid(i)) fieldErr(i, false); });
    });
  });
  function validate(f) {
    var bad = $$('input[required],select[required]', f).filter(invalid);
    $$('input[required],select[required]', f).forEach(function (i) { fieldErr(i, invalid(i)); });
    if (bad.length) { bad[0].focus(); return false; }
    return true;
  }
  $('#rForm').addEventListener('submit', function (e) {
    e.preventDefault(); var f = e.target; if (!validate(f)) return;
    openWa(L('Hola Pura Cepa, me gustaría reservar mesa.', 'Hello Pura Cepa, I would like to book a table.') + '\n' +
      L('Día: ', 'Day: ') + niceDate(f.date.value) + '\n' + L('Hora: ', 'Time: ') + f.time.value + '\n' + L('Personas: ', 'People: ') + f.pax.value + '\n' + L('Nombre: ', 'Name: ') + f.name.value.trim() + (f.note.value.trim() ? '\n' + L('Comentario: ', 'Note: ') + f.note.value.trim() : ''));
  });
  $('#cForm').addEventListener('submit', function (e) {
    e.preventDefault(); var f = e.target; if (!validate(f)) return;
    openWa(L('Hola Pura Cepa, quiero reservar la cata de vinos andaluces de las 13:00.', 'Hello Pura Cepa, I would like to book the 13:00 Andalusian wine tasting.') + '\n' +
      L('Día: ', 'Day: ') + niceDate(f.date.value) + '\n' + L('Personas: ', 'People: ') + f.pax.value + '\n' + L('Idioma: ', 'Language: ') + f.lang.value + '\n' + L('Nombre: ', 'Name: ') + f.name.value.trim());
  });
  $('#pForm').addEventListener('submit', function (e) {
    e.preventDefault(); var f = e.target; if (!validate(f)) return;
    openWa(L('Hola Pura Cepa, me interesa una cata privada para un grupo.', 'Hello Pura Cepa, I am interested in a private tasting for a group.') + '\n' +
      L('Fecha: ', 'Date: ') + niceDate(f.date.value) + '\n' + L('Personas: ', 'People: ') + f.pax.value + (f.occ.value.trim() ? '\n' + L('Ocasión: ', 'Occasion: ') + f.occ.value.trim() : '') + '\n' + L('Nombre: ', 'Name: ') + f.name.value.trim());
  });
  $('#bForm').addEventListener('submit', function (e) {
    e.preventDefault(); var f = e.target; if (!validate(f)) return;
    var lines = Object.keys(basket).filter(function (n) { return basket[n] > 0; }).map(function (n) { return '· ' + n + ' × ' + basket[n]; });
    openWa(L('Hola Pura Cepa, quiero encargar estas botellas para recoger:', 'Hello Pura Cepa, I would like to order these bottles to collect:') + '\n' + lines.join('\n') + '\n' +
      L('Recogida: ', 'Pick-up: ') + niceDate(f.date.value) + ', ' + f.time.value + '\n' + L('Nombre: ', 'Name: ') + f.name.value.trim());
  });
  $$('.js-wa').forEach(function (a) {
    a.addEventListener('click', function (e) { e.preventDefault(); openWa(L('Hola Pura Cepa, ', 'Hello Pura Cepa, ')); });
  });

  /* ---------------- agenda ---------------- */
  var calBase = new Date(today.getFullYear(), today.getMonth(), 1), calOff = 0, calSel = iso(today);
  function eventsFor(d) {
    var out = [{ h: '13:00', t: { es: 'Cata de vinos andaluces', en: 'Andalusian wine tasting' }, d: { es: 'Cuatro vinos andaluces con queso, 29 € por persona. Solo con reserva.', en: 'Four Andalusian wines with cheese, €29 per person. Booking only.' }, real: true }];
    P.EVENTS_WEEKLY.forEach(function (e) { if (e.dow === d.getDay()) out.push({ h: e.h, t: e, d: e.d, real: false }); });
    return out.sort(function (a, b) { return a.h.localeCompare(b.h); });
  }
  function renderCal() {
    var m = new Date(calBase.getFullYear(), calBase.getMonth() + calOff, 1);
    $('#calM').textContent = cap(monthYear(m));
    $('#calPrev').disabled = calOff <= 0; $('#calNext').disabled = calOff >= 2;
    var g = $('#calGrid'); g.innerHTML = '';
    var dows = lang === 'en' ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] : ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    dows.forEach(function (x) { g.appendChild(el('span', 'cal__dow', x)).setAttribute('aria-hidden', 'true'); });
    var lead = (m.getDay() + 6) % 7;
    for (var i = 0; i < lead; i++) g.appendChild(el('span'));
    var days = new Date(m.getFullYear(), m.getMonth() + 1, 0).getDate();
    for (var dnum = 1; dnum <= days; dnum++) {
      var d = new Date(m.getFullYear(), m.getMonth(), dnum), key = iso(d), ev = eventsFor(d);
      var b = el('button', 'cd');
      b.type = 'button'; b.dataset.k = key;
      if (d < today) b.classList.add('past');
      if (key === iso(today)) b.classList.add('today');
      b.setAttribute('aria-pressed', key === calSel);
      b.setAttribute('aria-label', longDate(d) + ', ' + ev.length + ' ' + L(ev.length === 1 ? 'evento' : 'eventos', ev.length === 1 ? 'event' : 'events'));
      b.innerHTML = '<span aria-hidden="true">' + dnum + '</span><span class="dots" aria-hidden="true">' + ev.map(function (e) { return '<i' + (e.real ? '' : ' class="ej"') + '></i>'; }).join('') + '</span>';
      g.appendChild(b);
    }
    renderDay();
  }
  function renderDay() {
    var p = calSel.split('-'), d = new Date(+p[0], +p[1] - 1, +p[2]);
    var box = $('#calDay');
    var ev = eventsFor(d);
    box.innerHTML = '<h4>' + esc(cap(longDate(d))) + '</h4>' + ev.map(function (e) {
      var msg = L('Hola Pura Cepa, quiero reservar para «', 'Hello Pura Cepa, I would like to book for "') + t(e.t) + L('» el ', '" on ') + niceDate(calSel) + ' (' + e.h + ').';
      return '<div class="ev"><span class="ev__h">' + e.h + '</span><div><p class="ev__t">' + esc(t(e.t)) + '<span class="ev__tag ' + (e.real ? 'ev__tag--real">' + L('Diario', 'Daily') : 'ev__tag--ej">' + L('Ejemplo', 'Example')) + '</span></p><p class="ev__d">' + esc(t(e.d)) + '</p>' +
        (d >= today ? '<a href="' + esc(wa(msg)) + '" target="_blank" rel="noopener">' + L('Reservar plaza por WhatsApp', 'Book a place on WhatsApp') + ' →</a>' : '') + '</div></div>';
    }).join('');
  }
  $('#calGrid').addEventListener('click', function (e) {
    var b = e.target.closest('.cd'); if (!b) return;
    calSel = b.dataset.k;
    $$('#calGrid .cd').forEach(function (x) { x.setAttribute('aria-pressed', x === b); });
    renderDay();
  });
  $('#calPrev').addEventListener('click', function () { if (calOff > 0) { calOff--; renderCal(); } });
  $('#calNext').addEventListener('click', function () { if (calOff < 2) { calOff++; renderCal(); } });
  lazy('#agenda', renderCal);

  /* ---------------- map (click to load) ---------------- */
  $('#mapLoad').addEventListener('click', function () {
    var lat = 36.5038348, lon = -4.6807176, d = 0.006;
    var f = document.createElement('iframe');
    f.title = L('Mapa de OpenStreetMap con la ubicación de Pura Cepa', 'OpenStreetMap map showing Pura Cepa');
    f.loading = 'lazy';
    f.referrerPolicy = 'no-referrer';
    f.src = 'https://www.openstreetmap.org/export/embed.html?bbox=' + (lon - d) + '%2C' + (lat - d / 2) + '%2C' + (lon + d) + '%2C' + (lat + d / 2) + '&layer=mapnik&marker=' + lat + '%2C' + lon;
    var m = $('#map'); m.innerHTML = ''; m.appendChild(f);
  });

  /* ---------------- observers: reveal, nav, glass bubbles, flight ---------------- */
  if ('IntersectionObserver' in window) {
    if (!RM) {
      $$('.sec__hd, .pair__picker, .wheel, .pull, .basket, .menu, .cheese, .cata__forms, .cal, .book .card, .rating, .map, .tapas__fig').forEach(function (e) { e.classList.add('reveal'); });
      var rv = new IntersectionObserver(function (es) { es.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add('in'); rv.unobserve(x.target); } }); }, { rootMargin: '0px 0px -8% 0px' });
      $$('.reveal').forEach(function (e) { rv.observe(e); });
    }
    var fl = new IntersectionObserver(function (es) { es.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add('in'); fl.unobserve(x.target); } }); }, { threshold: .5 });
    fl.observe($('#flight'));
    var gl = new IntersectionObserver(function (es) { es.forEach(function (x) { glass.classList.toggle('live', x.isIntersecting && !RM); cartaOn = x.isIntersecting; checkGone(); }); });
    gl.observe($('#carta'));
    var links = $$('.nav a');
    var nv = new IntersectionObserver(function (es) {
      es.forEach(function (x) {
        if (!x.isIntersecting) return;
        links.forEach(function (a) { var on = a.getAttribute('href') === '#' + x.target.id; a.classList.toggle('on', on); if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    $$('main > section[id]').forEach(function (s) { nv.observe(s); });
  } else {
    $('#flight').classList.add('in');
  }

  /* ---------------- round 2: cinematic hero (bokeh parting), vine-to-glass chapter, cursor ---------------- */
  /* ambient hero motion starts once the idle pre-render is done, or on a touch / mouse move, never mid-scroll */
  var startFx = function () {};
  (function () {
    if (RM) return;
    var evs = ['pointermove', 'pointerdown', 'touchstart', 'keydown'];
    startFx = function () { $('#inicio').classList.add('fx'); evs.forEach(function (e) { window.removeEventListener(e, startFx, true); }); };
    evs.forEach(function (e) { window.addEventListener(e, startFx, { capture: true, passive: true }); });
  })();
  var heroH = window.innerHeight;
  window.addEventListener('resize', function () { heroH = $('#inicio').offsetHeight || window.innerHeight; });
  var hero = $('#inicio'), heroOn = true, bkL = $('.bk--l'), bkR = $('.bk--r'), bkF = $('.bk--f'), heroRaf = 0;
  function heroFrame() {
    heroRaf = 0;
    var p = Math.min(1, Math.max(0, window.scrollY / heroH));
    bkL.style.transform = 'translate3d(' + (-p * 34).toFixed(2) + 'vw,' + (p * 6).toFixed(2) + 'vh,0) scale(' + (1 + p * .25).toFixed(3) + ')';
    bkR.style.transform = 'translate3d(' + (p * 34).toFixed(2) + 'vw,' + (-p * 4).toFixed(2) + 'vh,0) scale(' + (1 + p * .25).toFixed(3) + ')';
    bkF.style.transform = 'translate3d(0,' + (-p * 22).toFixed(2) + 'vh,0) scale(' + (1 + p * .6).toFixed(3) + ')';
    bkF.style.opacity = (1 - p).toFixed(3);
  }

  var vina = $('#vina'), vinaOn = false, vinaRaf = 0, vStep = -1;
  var vFigs = $$('.vf', vina), vSteps = $$('.vs', vina), vCols = $$('.vina__colors span', vina), vDots = $$('.vina__dots i', vina), vCol = $('.vina__colors', vina);
  function vinaFrame() {
    vinaRaf = 0;
    var r = vina.getBoundingClientRect(), total = vina.offsetHeight - window.innerHeight;
    var p = total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 0;
    var n = vFigs.length, f = p * n, s = Math.min(n - 1, Math.floor(f)), local = Math.min(1, f - s);
    if (s !== vStep) {
      vStep = s;
      vFigs.forEach(function (x, i) { x.classList.toggle('on', i === s); });
      vSteps.forEach(function (x, i) { x.classList.toggle('on', i === s); x.classList.toggle('past', i < s); });
      vCols.forEach(function (x, i) { x.classList.toggle('on', i === s); });
      vDots.forEach(function (x, i) { x.classList.toggle('on', i <= s); });
    }
    if (!RM) vFigs[s].querySelector('img').style.setProperty('--z', (1.12 - local * .1).toFixed(4));
    vCol.style.setProperty('--p', p.toFixed(4));
  }

  window.addEventListener('scroll', function () {
    if (heroOn && !heroRaf && !RM) heroRaf = requestAnimationFrame(heroFrame);
    if (vinaOn && !vinaRaf) vinaRaf = requestAnimationFrame(vinaFrame);
  }, { passive: true });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) { es.forEach(function (x) { heroOn = x.isIntersecting; hero.classList.toggle('off', !heroOn); }); }).observe(hero);
    new IntersectionObserver(function (es) { es.forEach(function (x) { vinaOn = x.isIntersecting; if (vinaOn) vinaFrame(); }); }).observe(vina);
    var seenIO = new IntersectionObserver(function (es) { es.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add('seen'); seenIO.unobserve(x.target); } }); }, { rootMargin: '0px 0px -15% 0px' });
    $$('.sec').forEach(function (x) { seenIO.observe(x); });
  } else { $$('.sec').forEach(function (x) { x.classList.add('seen'); }); }

  /* glasses clink when a new wine or gin is poured */
  var stage = $('.glass__stage', glass), spark = el('span', 'glass__spark'); spark.setAttribute('aria-hidden', 'true'); stage.appendChild(spark);
  function clink() { if (RM) return; stage.classList.remove('clink'); void stage.offsetWidth; stage.classList.add('clink'); }
  $('#wList').addEventListener('click', function (e) { if (e.target.closest('.wi')) clink(); });
  $('#gList').addEventListener('click', function (e) { if (e.target.closest('.gi')) clink(); });
  $('#sigList').addEventListener('click', function (e) { if (e.target.closest('.sig')) clink(); });
  /* bottle glint on tap (hover handles mice) */
  $('#shelves').addEventListener('click', function (e) { var b = e.target.closest('.bt'); if (!b || RM) return; b.classList.remove('glint'); void b.offsetWidth; b.classList.add('glint'); });

  /* subtle custom cursor: a ring that trails the pointer; runs only while it is catching up */
  if (!RM && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    var cur = $('.cursor'), cx = -100, cy = -100, tx = -100, ty = -100, cRaf = 0;
    var step = function () {
      cx += (tx - cx) * .22; cy += (ty - cy) * .22;
      cur.style.transform = 'translate3d(' + cx.toFixed(1) + 'px,' + cy.toFixed(1) + 'px,0)';
      cRaf = (Math.abs(tx - cx) + Math.abs(ty - cy) > .3) ? requestAnimationFrame(step) : 0;
    };
    document.addEventListener('pointermove', function (e) {
      if (e.pointerType !== 'mouse') return;
      tx = e.clientX; ty = e.clientY;
      if (!cur.classList.contains('on')) { cx = tx; cy = ty; cur.classList.add('on'); }
      var hit = e.target.closest && e.target.closest('a, button, select, summary, .bt, .gb, label');
      cur.classList.toggle('big', !!hit && !e.target.closest('input, textarea'));
      if (!cRaf) cRaf = requestAnimationFrame(step);
    }, { passive: true });
    document.addEventListener('pointerdown', function () { cur.classList.add('down'); });
    document.addEventListener('pointerup', function () { cur.classList.remove('down'); });
    document.documentElement.addEventListener('mouseleave', function () { cur.classList.remove('on'); });
  }

  /* ---------------- init ---------------- */
  applyLang();
  pourWine(P.W.filter(function (w) { return w.n === 'Fino El Puerto'; })[0], true);
  lastWine = current.item;
  if ('IntersectionObserver' in window) {
    var lz = new IntersectionObserver(function (es) { es.forEach(function (x) { if (x.isIntersecting) { ensureSoon('#' + x.target.id); if (x.target.id === 'carta') ensureSoon('#pared'); lz.unobserve(x.target); } }); }, { rootMargin: '300px 0px' });
    Object.keys(lazyMap).forEach(function (sel) { lz.observe($(sel)); });
  } else { Object.keys(lazyMap).forEach(ensure); }

  /* After load, pre-render every section in idle slots (one render step per slot), list and gin wall first,
     so nothing heavy is left to build while the visitor scrolls. */
  function preload() {
    var idle = window.requestIdleCallback || function (f) { return setTimeout(f, 50); };
    var order = ['#carta', '#pared'].concat(Object.keys(lazyMap).filter(function (k) { return k !== '#carta' && k !== '#pared'; }));
    var jobs = [];
    order.forEach(function (sel) {
      var L0 = lazyMap[sel]; if (!L0) return;
      L0.fns.forEach(function (fn, i) { jobs.push(function () { if (i === 0) { if (L0.done) return; L0.done = true; L0.pre = true; } if (L0.pre) fn(); }); });
    });
    (function next(dl) {
      while (jobs.length) {
        jobs.shift()();
        if (!dl || !dl.timeRemaining || dl.timeRemaining() < 8) break;
      }
      if (jobs.length) idle(next, { timeout: 1500 });
      else idle(function () { startFx(); decodeImages(); }, { timeout: 2000 });
    })();
  }
  /* decode the below-the-fold photos one per idle slot, so no image decodes during a scroll frame */
  function decodeImages() {
    var idle = window.requestIdleCallback || function (f) { return setTimeout(f, 50); };
    var imgs = $$('img[loading="lazy"]');
    (function next() {
      var im = imgs.shift(); if (!im) return;
      im.loading = 'eager';
      var go = function () { idle(next, { timeout: 1500 }); };
      if (im.decode) im.decode().then(go, go); else go();
    })();
  }
  /* pause ambient loops while the page is moving; they resume a moment after scrolling stops */
  var scT = 0, moving = [$('#inicio'), $('#pared'), glass, $('#swipeHint')];
  window.addEventListener('scroll', function () {
    if (!scT) moving.forEach(function (x) { x.classList.add('scrolling'); });
    clearTimeout(scT); scT = setTimeout(function () { scT = 0; moving.forEach(function (x) { x.classList.remove('scrolling'); }); }, 180);
  }, { passive: true });
  if (document.readyState === 'complete') setTimeout(preload, 300);
  else window.addEventListener('load', function () { setTimeout(preload, 300); });
})();
