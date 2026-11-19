/* Profesión Casa concept by Noir Digital */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var WA = '34638592424', MAIL = 'inmobiliaria@profesioncasa.com';
  var LST = window.PC_LISTINGS;
  var lang = document.documentElement.lang === 'en' ? 'en' : 'es';
  var U = function () { return PC.ui[lang]; };
  var L = function (o) { return o == null ? '' : (typeof o === 'object' ? (o[lang] || o.es) : o); };
  var esc = function (t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var NF = { es: new Intl.NumberFormat('es-ES', { useGrouping: 'always', maximumFractionDigits: 0 }), en: new Intl.NumberFormat('en-GB', { maximumFractionDigits: 0 }) };
  var num = function (n) { return NF[lang].format(Math.round(n)); };
  var money = function (n) { return lang === 'en' ? '€' + num(n) : num(n) + ' €'; };
  var waLink = function (t) { return 'https://wa.me/' + WA + '?text=' + encodeURIComponent(t); };
  var mailLink = function (s, b) { return 'mailto:' + MAIL + '?subject=' + encodeURIComponent(s) + '&body=' + encodeURIComponent(b); };

  /* ---------- i18n ---------- */
  var ES = null, ESA = [], I18N_EL = null;
  function cacheES() {
    if (ES) return; ES = {};
    I18N_EL = $$('[data-i18n]');
    I18N_EL.forEach(function (el) { var k = el.dataset.i18n; if (!(k in ES)) ES[k] = el.innerHTML; });
    $$('[data-i18n-attr]').forEach(function (el) {
      el.dataset.i18nAttr.split(';').forEach(function (p) { p = p.split(':'); ESA.push([el, p[0], p[1], el.getAttribute(p[0])]); });
    });
  }
  var esStr = { allZones: 'Todas las zonas', dossEmpty: 'Su vivienda' };
  var esTitle = document.title, esDesc = $('meta[name="description"]').content;
  function applyStatic() {
    cacheES();
    document.documentElement.lang = lang;
    I18N_EL.forEach(function (el) {
      var k = el.dataset.i18n, v = lang === 'en' ? PC.en[k] : ES[k];
      if (v != null && el.innerHTML !== v) el.innerHTML = v;
    });
    ESA.forEach(function (a) { var v = lang === 'en' ? PC.en[a[2]] : a[3]; if (v != null) a[0].setAttribute(a[1], v); });
    document.title = lang === 'en' ? 'Profesión Casa · Estate agent in Málaga · Homes for sale and rent' : esTitle;
    $('meta[name="description"]').content = lang === 'en' ? 'Profesión Casa, independent estate agent in Málaga since 2015, opposite María Zambrano station. Search on the map, get a free valuation and sell with a clear method.' : esDesc;
    $$('.lang-btn').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.lang === lang)); });
    var sw = $('#en-switch span');
    sw.textContent = lang === 'en' ? 'Leer en español' : 'Read this guide in English';
    sw.parentNode.setAttribute('lang', lang === 'en' ? 'es' : 'en');
    var ep = $('.en-path');
    ep.hidden = lang === 'en';
  }
  function setLang(l) {
    lang = l; try { localStorage.setItem('pc-lang', l); } catch (e) {}
    applyStatic(); renderAll();
  }
  $$('.lang-btn').forEach(function (b) { b.addEventListener('click', function () { if (b.dataset.lang !== lang) setLang(b.dataset.lang); }); });
  $$('[data-goto-en]').forEach(function (b) {
    b.addEventListener('click', function () {
      var target = b.id === 'en-switch' ? (lang === 'en' ? 'es' : 'en') : 'en';
      setLang(target);
      $('#for-title').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    });
  });

  /* ---------- Header ---------- */
  var header = $('.site-header'), scrolled = null;
  var mbar = $('.mbar'), mShow = null;
  function onHead() {
    var y = window.scrollY, s = y > 24; if (s !== scrolled) { scrolled = s; header.classList.toggle('scrolled', s); }
    var m = y > window.innerHeight * 0.55; if (m !== mShow) { mShow = m; mbar.classList.toggle('show', m); }
  }

  /* ---------- Mobile menu ---------- */
  var menuBtn = $('#menu-btn'), nav = $('#main-nav');
  function setMenu(o) { header.classList.toggle('nav-open', o); menuBtn.setAttribute('aria-expanded', String(o)); }
  menuBtn.addEventListener('click', function () { setMenu(!header.classList.contains('nav-open')); });
  nav.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && header.classList.contains('nav-open')) { setMenu(false); menuBtn.focus(); } });
  /* centre the scrollable map on the city */
  var ms = $('#map-scroll'); if (ms && ms.scrollWidth > ms.clientWidth) ms.scrollLeft = (ms.scrollWidth - ms.clientWidth) * 0.55;

  /* ---------- Hero light ---------- */
  var hero = $('.hero'), dusk = $('.sky-dusk'), skyScale = $('.sky-scale'), light = $('.light'), dial = $('#dial');
  var heroVisible = true, heroH = hero.offsetHeight, dialV = 0, ticking = false;
  function loadDusk() {
    var src = $('.sky-dusk-wrap source');
    src.srcset = src.dataset.srcset; dusk.srcset = dusk.dataset.srcset; dusk.src = dusk.dataset.src;
  }
  if (document.readyState === 'complete') setTimeout(loadDusk, 300); else window.addEventListener('load', function () { setTimeout(loadDusk, 300); });
  function heroFrame() {
    ticking = false;
    var sp = Math.min(1, Math.max(0, window.scrollY / (heroH * 0.85)));
    var t = Math.min(1, Math.max(dialV, sp * 0.95 + dialV * (1 - sp)));
    dusk.style.opacity = t.toFixed(3);
    light.style.transform = 'translate3d(' + (t * 34).toFixed(2) + 'vw,' + (t * 14).toFixed(2) + 'vh,0)';
    light.style.opacity = (1 - t * 0.55).toFixed(3);
    if (!reduce) skyScale.style.transform = 'translate3d(0,' + (sp * heroH * 0.18).toFixed(1) + 'px,0) scale(' + (1.04 + sp * 0.04).toFixed(4) + ')';
    var idx = t < 0.34 ? 0 : t < 0.7 ? 1 : 2;
    dial.setAttribute('aria-valuetext', U().dial[idx]);
  }
  function req() { if (!ticking) { ticking = true; requestAnimationFrame(heroFrame); } }
  dial.addEventListener('input', function () { dialV = dial.value / 100; req(); });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) {
      heroVisible = es[0].isIntersecting; hero.classList.toggle('off', !heroVisible);
      if (heroVisible) req();
    }).observe(hero);
  }
  window.addEventListener('resize', function () { heroH = hero.offsetHeight; req(); sellMeasure(); });
  window.addEventListener('scroll', function () { onHead(); if (heroVisible) req(); if (sellVisible) sellReq(); }, { passive: true });

  /* Hero search */
  var heroOp = 'venta';
  $$('.hs-op').forEach(function (b) {
    b.addEventListener('click', function () { heroOp = b.dataset.op; $$('.hs-op').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); }); });
  });
  $('#hero-search').addEventListener('submit', function (e) {
    e.preventDefault(); boot();
    state.op = heroOp; state.zones = $('#hs-zone').value ? [$('#hs-zone').value] : [];
    syncFilters(); renderList(true);
    $('#search-title').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  });

  /* ---------- Listings ---------- */
  var ZONES = ['teatinos', 'guindos', 'huelin', 'perchel', 'centro', 'palo', 'rincon', 'torre'];
  var state = { op: 'all', type: '', beds: 0, max: 800000, sort: 'rec', zones: [] };
  var heat = {};
  (function computeHeat() {
    var acc = {};
    LST.forEach(function (l) { if (l.op === 'venta' && l.built) { (acc[l.zone] = acc[l.zone] || []).push(l.price / l.built); } });
    var vals = [];
    Object.keys(acc).forEach(function (z) { var a = acc[z]; heat[z] = a.reduce(function (s, v) { return s + v; }, 0) / a.length; vals.push(heat[z]); });
    heat._min = Math.min.apply(null, vals); heat._max = Math.max.apply(null, vals);
  })();
  function heatColor(v) {
    var k = (v - heat._min) / (heat._max - heat._min || 1);
    var a = [241, 230, 204], b = [214, 134, 88];
    return 'rgb(' + a.map(function (c, i) { return Math.round(c + (b[i] - c) * k); }).join(',') + ')';
  }
  function cover(l, i) { return 'img/p/' + l.ref.toLowerCase() + '-' + (i || 1); }
  function titleOf(l) { return U().type[l.type] + ' · ' + L(l.area); }
  function priceOf(l) { return money(l.price) + (l.op === 'alquiler' ? U().month : ''); }
  function matches(l, ignoreZone) {
    if (state.op !== 'all' && l.op !== state.op) return false;
    if (state.type && l.type !== state.type) return false;
    if (state.beds && !(l.beds >= state.beds)) return false;
    if (l.op === 'venta' && l.price > state.max) return false;
    if (!ignoreZone && state.zones.length && state.zones.indexOf(l.zone) < 0) return false;
    return true;
  }
  function specLine(l) {
    var u = U(), s = [];
    if (l.beds != null && l.type !== 'garaje' && l.type !== 'habitacion') s.push('<li><svg class="ic" aria-hidden="true"><use href="#i-bed"/></svg>' + u.beds(l.beds) + '</li>');
    if (l.baths) s.push('<li><svg class="ic" aria-hidden="true"><use href="#i-bath"/></svg>' + u.baths(l.baths) + '</li>');
    var m = l.built || l.util; if (m) s.push('<li><svg class="ic" aria-hidden="true"><use href="#i-area"/></svg>' + m + ' m²</li>');
    return s.join('');
  }
  var cardsEl = $('#cards'), firstRender = true;
  function renderList(animate) {
    var u = U();
    var list = LST.filter(function (l) { return matches(l); });
    if (state.sort === 'asc') list.sort(function (a, b) { return (a.op === b.op ? a.price - b.price : a.op === 'venta' ? -1 : 1); });
    if (state.sort === 'desc') list.sort(function (a, b) { return (a.op === b.op ? b.price - a.price : a.op === 'venta' ? -1 : 1); });
    if (state.sort === 'm2') list.sort(function (a, b) { return (b.built || b.util || 0) - (a.built || a.util || 0); });
    cardsEl.innerHTML = list.map(function (l, i) {
      var c = cover(l, 1), lazy = i > 1 || !firstRender;
      return '<article class="card' + (animate && !reduce ? ' enter' : '') + '" style="--i:' + i + '">' +
        '<a class="card-a" href="#inmueble/' + l.ref + '" aria-label="' + esc(titleOf(l) + ', ' + priceOf(l)) + '">' +
        '<div class="card-ph"><img src="' + c + '-720.webp" srcset="' + c + '-720.webp 720w, ' + c + '-1600.webp 1600w" sizes="(min-width: 1100px) 22vw, (min-width: 640px) 45vw, 92vw" alt="" width="720" height="540"' + (lazy ? ' loading="lazy"' : '') + ' decoding="async">' +
        '<span class="card-op op-' + l.op + '">' + u.op[l.op] + '</span>' + ((l.old || l.reduced) ? '<span class="card-red">' + u.reduced + '</span>' : '') +
        '<span class="card-n"><svg class="ic" aria-hidden="true"><use href="#i-expand"/></svg>' + l.n + '</span></div>' +
        '<div class="card-b"><p class="card-price">' + priceOf(l) + (l.old ? ' <s>' + money(l.old) + '</s>' : '') + '</p>' +
        '<h3 class="card-t">' + esc(u.type[l.type]) + ' <span>· ' + esc(L(l.area)) + '</span></h3>' +
        '<p class="card-city"><svg class="ic" aria-hidden="true"><use href="#i-pin"/></svg>' + esc(l.city) + ' · ' + u.ref + ' ' + l.ref + '</p>' +
        '<ul class="card-specs">' + specLine(l) + '</ul></div></a></article>';
    }).join('');
    firstRender = false;
    $('#count-n').textContent = list.length;
    $('#count-t').textContent = u.props(list.length);
    $('#count-z').textContent = state.zones.length ? u.inZone + ' ' + state.zones.map(function (z) { return u.zones[z]; }).join(', ') : '';
    var empty = !list.length; $('#empty').hidden = !empty;
    if (empty) {
      var tl = state.type ? u.type[state.type] : '';
      $('#empty-wa').href = waLink(u.waSearch(u.searchDesc(state.op, tl, state.zones.map(function (z) { return u.zones[z]; }).join(', '), state.beds)));
    }
    renderMap();
  }
  /* map */
  var mapEl = $('#map');
  function renderMap() {
    var u = U();
    $$('.zone', mapEl).forEach(function (g) {
      var z = g.dataset.zone, n = LST.filter(function (l) { return l.zone === z && matches(l, true); }).length;
      var on = state.zones.indexOf(z) > -1;
      g.setAttribute('aria-pressed', String(on));
      g.classList.toggle('dim', n === 0);
      g.classList.toggle('on', on);
      var p = g.querySelector('path');
      p.style.fill = heat[z] ? heatColor(heat[z]) : 'url(#hatch)';
      g.querySelector('.z-n').textContent = n + ' · ' + (heat[z] ? num(heat[z]) + ' €/m²' : u.op.alquiler.toLowerCase());
      g.setAttribute('aria-label', u.zones[z] + ', ' + n + ' ' + u.props(n));
    });
    $('#zone-chips').innerHTML = ZONES.map(function (z) {
      var n = LST.filter(function (l) { return l.zone === z && matches(l, true); }).length;
      return '<button type="button" class="zchip" data-zone="' + z + '" aria-pressed="' + (state.zones.indexOf(z) > -1) + '"' + (n ? '' : ' disabled') + '><i style="background:' + (heat[z] ? heatColor(heat[z]) : '#e6dcc8') + '"></i>' + u.zones[z] + ' <b>' + n + '</b></button>';
    }).join('');
    var fmt = function (v) { return Math.round(v / 100) * 100; };
    $('#lg-min').textContent = num(fmt(heat._min));
    $('#lg-max').textContent = num(fmt(heat._max));
    $('#map-clear').hidden = !state.zones.length;
    mapEl.classList.toggle('has-sel', state.zones.length > 0);
  }
  function toggleZone(z) {
    var i = state.zones.indexOf(z);
    if (i > -1) state.zones.splice(i, 1); else state.zones.push(z);
    renderList(true);
  }
  mapEl.addEventListener('click', function (e) { var g = e.target.closest('.zone'); if (g) toggleZone(g.dataset.zone); });
  mapEl.addEventListener('keydown', function (e) { var g = e.target.closest('.zone'); if (g && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); toggleZone(g.dataset.zone); } });
  $('#zone-chips').addEventListener('click', function (e) { var b = e.target.closest('.zchip'); if (b) toggleZone(b.dataset.zone); });
  $('#map-clear').addEventListener('click', function () { state.zones = []; renderList(true); });
  /* filters */
  function segBind(id, key, num) {
    $(id).addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      state[key] = num ? +b.dataset.v : b.dataset.v; syncFilters(); renderList(true);
    });
  }
  segBind('#f-op', 'op'); segBind('#f-beds', 'beds', true);
  $('#f-type').addEventListener('change', function () { state.type = this.value; renderList(true); });
  $('#f-sort').addEventListener('change', function () { state.sort = this.value; renderList(true); });
  var maxEl = $('#f-max'), maxTimer;
  maxEl.addEventListener('input', function () {
    state.max = +maxEl.value; $('#f-max-o').textContent = state.max >= 800000 ? (lang === 'en' ? 'Any' : 'Sin límite') : money(state.max);
    clearTimeout(maxTimer); maxTimer = setTimeout(function () { renderList(true); }, 90);
  });
  function syncFilters() {
    $$('#f-op button').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.v === state.op)); });
    $$('#f-beds button').forEach(function (b) { b.setAttribute('aria-pressed', String(+b.dataset.v === state.beds)); });
    $('#f-max-o').textContent = state.max >= 800000 ? (lang === 'en' ? 'Any' : 'Sin límite') : money(state.max);
  }
  function fillZoneSelect() {
    var sel = $('#hs-zone'), v = sel.value, u = U();
    sel.innerHTML = '<option value="">' + (lang === 'en' ? PC.en.allZones : esStr.allZones) + '</option>' + ZONES.map(function (z) { return '<option value="' + z + '">' + u.zones[z] + '</option>'; }).join('');
    sel.value = v;
  }

  /* ---------- Detail + gallery ---------- */
  var detail = $('#detail'), dtScroll = $('#dt-scroll'), strip = $('#dt-strip'), cur = null, lastFocus = null;
  function openDetail(ref) {
    var l = LST.filter(function (x) { return x.ref === ref; })[0]; if (!l) return;
    cur = l; var u = U();
    if (detail.hidden) lastFocus = document.activeElement;
    strip.innerHTML = '';
    for (var i = 1; i <= l.n; i++) {
      var c = cover(l, i);
      strip.insertAdjacentHTML('beforeend', '<button type="button" class="dt-slide" data-i="' + (i - 1) + '" aria-label="' + u.photo + ' ' + i + ' ' + u.of + ' ' + l.n + '"><img src="' + c + '-1600.webp" srcset="' + c + '-720.webp 720w, ' + c + '-1600.webp 1600w" sizes="(min-width: 900px) 70vw, 100vw" alt="" ' + (i > 2 ? 'loading="lazy" ' : '') + 'decoding="async"></button>');
    }
    $('#dt-ref').textContent = u.ref + ' ' + l.ref;
    $('#dt-kind').textContent = u.op[l.op] + ' · ' + l.city;
    $('#dt-title').textContent = titleOf(l);
    $('#dt-area').textContent = L(l.area) + ', ' + l.city;
    $('#dt-price').textContent = priceOf(l);
    $('#dt-old').textContent = l.old ? money(l.old) : '';
    var sp = [];
    if (l.beds != null && l.type !== 'garaje' && l.type !== 'habitacion') sp.push(['i-bed', u.beds(l.beds)]);
    if (l.baths) sp.push(['i-bath', u.baths(l.baths) + (l.toilets ? ' + ' + l.toilets + (lang === 'en' ? ' WC' : ' aseo') : '')]);
    if (l.built) sp.push(['i-area', l.built + ' m² ' + u.built]);
    if (l.util) sp.push(['i-area', l.util + ' m² ' + u.useful]);
    var sx = '';
    sp.forEach(function (s) { sx += '<li><svg class="ic" aria-hidden="true"><use href="#' + s[0] + '"/></svg>' + s[1] + '</li>'; });
    if (l.floor) sx += '<li><span class="k">' + u.floor + '</span>' + esc(l.floor) + '</li>';
    if (l.year) sx += '<li><span class="k">' + u.year + '</span>' + l.year + '</li>';
    if (l.orient) sx += '<li><span class="k">' + u.orient + '</span>' + L(l.orient) + '</li>';
    $('#dt-specs').innerHTML = sx;
    $('#dt-hl').innerHTML = l.hl[lang].map(function (h) { return '<li><svg class="ic" aria-hidden="true"><use href="#i-check"/></svg>' + esc(h) + '</li>'; }).join('');
    $('#dt-desc-wrap').hidden = !l.desc.length;
    $('#dt-desc').innerHTML = l.desc.map(function (p) { return '<p lang="es">' + esc(p) + '</p>'; }).join('');
    $('#dt-src').href = 'https://www.profesioncasa.com/recursos/nficham06.php?cod_inmueble=' + l.cod;
    $('#dt-wa').href = waLink(u.waProp({ ref: l.ref, title: titleOf(l) }));
    $('#dt-mail').href = mailLink(u.mailPropSubject(l), u.waProp({ ref: l.ref, title: titleOf(l) }));
    var sale = l.op === 'venta';
    $('#calc').hidden = !sale; $('#rentbox').hidden = sale;
    if (sale) calc();
    setCount(0);
    if (detail.hidden) {
      detail.hidden = false; document.documentElement.classList.add('locked');
      requestAnimationFrame(function () { detail.classList.add('open'); });
      dtScroll.scrollTop = 0; strip.scrollLeft = 0;
      setTimeout(function () { $('#dt-close').focus({ preventScroll: true }); }, 30);
    } else { strip.scrollLeft = 0; }
  }
  function closeDetail(fromHash) {
    if (detail.hidden) return;
    detail.classList.remove('open'); document.documentElement.classList.remove('locked');
    setTimeout(function () { detail.hidden = true; }, reduce ? 0 : 380);
    if (!fromHash && location.hash.indexOf('#inmueble/') === 0) history.pushState('', document.title, location.pathname + location.search + '#buscar');
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }
  function route() {
    var m = location.hash.match(/^#inmueble\/([A-Za-z0-9]+)/);
    if (m) openDetail(m[1].toUpperCase()); else closeDetail(true);
  }
  window.addEventListener('hashchange', function () { boot(); route(); });
  $('#dt-close').addEventListener('click', function () { closeDetail(); });
  var past = false; dtScroll.addEventListener('scroll', function () { var v = dtScroll.scrollTop > strip.offsetHeight - 70; if (v !== past) { past = v; detail.classList.toggle('past', v); } }, { passive: true });
  var galIdx = 0;
  function setCount(i) { galIdx = i; $('#dt-cnt').textContent = (i + 1) + ' / ' + (cur ? cur.n : 1); }
  var stripT;
  strip.addEventListener('scroll', function () {
    clearTimeout(stripT); stripT = setTimeout(function () { setCount(Math.round(strip.scrollLeft / strip.clientWidth)); }, 60);
  }, { passive: true });
  function galGo(d) { var i = Math.max(0, Math.min(cur.n - 1, galIdx + d)); strip.scrollTo({ left: i * strip.clientWidth, behavior: reduce ? 'auto' : 'smooth' }); setCount(i); }
  $('#dt-prev').addEventListener('click', function () { galGo(-1); });
  $('#dt-next').addEventListener('click', function () { galGo(1); });
  strip.addEventListener('click', function (e) { var s = e.target.closest('.dt-slide'); if (s) openLB(+s.dataset.i); });
  $('#dt-full').addEventListener('click', function () { openLB(galIdx); });

  /* lightbox */
  var lb = $('#lightbox'), lbStrip = $('#lb-strip'), lbIdx = 0, lbT;
  function openLB(i) {
    var l = cur, u = U();
    lbStrip.innerHTML = ''; var th = '';
    for (var k = 1; k <= l.n; k++) {
      var c = cover(l, k);
      lbStrip.insertAdjacentHTML('beforeend', '<figure class="lb-slide"><img src="' + c + '-1600.webp" alt="' + esc(titleOf(l)) + ' · ' + u.photo + ' ' + k + '" ' + (Math.abs(k - 1 - i) > 1 ? 'loading="lazy" ' : '') + 'decoding="async"></figure>');
      th += '<button type="button" class="lb-th" data-i="' + (k - 1) + '" aria-label="' + u.photo + ' ' + k + '"><img src="' + c + '-720.webp" alt="" loading="lazy"></button>';
    }
    $('#lb-thumbs').innerHTML = th;
    lb.hidden = false; requestAnimationFrame(function () { lb.classList.add('open'); lbStrip.scrollLeft = i * lbStrip.clientWidth; lbSet(i); });
    setTimeout(function () { $('#lb-close').focus({ preventScroll: true }); }, 30);
  }
  function lbSet(i) {
    lbIdx = i; $('#lb-cnt').textContent = (i + 1) + ' / ' + cur.n;
    $$('.lb-th', lb).forEach(function (b, k) { b.classList.toggle('on', k === i); if (k === i) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current'); });
  }
  function lbGo(i) { i = Math.max(0, Math.min(cur.n - 1, i)); lbStrip.scrollTo({ left: i * lbStrip.clientWidth, behavior: reduce ? 'auto' : 'smooth' }); lbSet(i); }
  function closeLB() {
    lb.classList.remove('open'); setTimeout(function () { lb.hidden = true; }, reduce ? 0 : 260);
    strip.scrollLeft = lbIdx * strip.clientWidth; setCount(lbIdx); $('#dt-full').focus({ preventScroll: true });
  }
  lbStrip.addEventListener('scroll', function () { clearTimeout(lbT); lbT = setTimeout(function () { lbSet(Math.round(lbStrip.scrollLeft / lbStrip.clientWidth)); }, 60); }, { passive: true });
  $('#lb-prev').addEventListener('click', function () { lbGo(lbIdx - 1); });
  $('#lb-next').addEventListener('click', function () { lbGo(lbIdx + 1); });
  $('#lb-close').addEventListener('click', closeLB);
  $('#lb-thumbs').addEventListener('click', function (e) { var b = e.target.closest('.lb-th'); if (b) lbGo(+b.dataset.i); });
  document.addEventListener('keydown', function (e) {
    if (!lb.hidden) {
      if (e.key === 'Escape') closeLB(); else if (e.key === 'ArrowRight') lbGo(lbIdx + 1); else if (e.key === 'ArrowLeft') lbGo(lbIdx - 1);
      else if (e.key === 'Tab') trap(e, lb);
      return;
    }
    if (!detail.hidden) {
      if (e.key === 'Escape') closeDetail();
      else if (e.key === 'Tab') trap(e, detail);
      else if ((e.key === 'ArrowRight' || e.key === 'ArrowLeft') && document.activeElement === strip) galGo(e.key === 'ArrowRight' ? 1 : -1);
    }
  });
  function trap(e, root) {
    var f = $$('a[href],button:not([disabled]),input,select,summary,[tabindex="0"]', root).filter(function (el) { return el.offsetParent !== null && !el.closest('[hidden]'); });
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  /* mortgage */
  var cdp = $('#c-dp'), cy = $('#c-y'), cr = $('#c-r');
  function calc() {
    if (!cur || cur.op !== 'venta') return;
    var P = cur.price, dp = +cdp.value / 100, n = +cy.value * 12, r = +cr.value / 100 / 12;
    var down = P * dp, loan = P - down, pay = r ? loan * r / (1 - Math.pow(1 + r, -n)) : loan / n;
    var tax = P * 0.07 + P * 0.015;
    $('#c-pay').textContent = money(pay);
    $('#c-down').textContent = money(down); $('#c-loan').textContent = money(loan); $('#c-tax').textContent = money(tax);
    $('#c-save').textContent = money(down + tax);
    $('#c-dp-o').textContent = Math.round(dp * 100) + ' %';
    $('#c-y-o').textContent = cy.value + U().years;
    $('#c-r-o').textContent = (+cr.value).toLocaleString(lang === 'en' ? 'en-GB' : 'es-ES', { minimumFractionDigits: 1 }) + ' %';
    var tot = P + tax;
    var bar = $('.calc-bar');
    bar.style.setProperty('--d', (down / tot).toFixed(4)); bar.style.setProperty('--l', (loan / tot).toFixed(4)); bar.style.setProperty('--t', (tax / tot).toFixed(4));
  }
  [cdp, cy, cr].forEach(function (el) { el.addEventListener('input', calc); });

  /* ---------- Sell journey ---------- */
  var sell = $('.sell'), track = $('#sell-track'), fill = $('.sell-fill'), key = $('.sell-key'), steps = $$('.step', track);
  var sellVisible = false, sellTick = false, sellTop = 0, sellLen = 1, trackShift = 0, wide = false, rail = $('.sell-rail'), railLen = 1;
  function sellMeasure() {
    wide = window.innerWidth >= 900 && !reduce;
    sell.classList.toggle('pinned', wide);
    if (wide) {
      trackShift = Math.max(0, track.scrollWidth - window.innerWidth + 48);
      sell.style.height = (window.innerHeight + trackShift * 1.1) + 'px';
    } else { sell.style.height = ''; track.style.transform = ''; }
    if (wide) { rail.style.top = ''; rail.style.height = ''; railLen = rail.offsetWidth; }
    else { rail.style.top = track.offsetTop + 'px'; rail.style.height = track.offsetHeight + 'px'; railLen = track.offsetHeight; }
    var r = sell.getBoundingClientRect();
    sellTop = r.top + window.scrollY; sellLen = Math.max(1, sell.offsetHeight - window.innerHeight);
    sellReq();
  }
  function sellFrame() {
    sellTick = false;
    var p;
    if (wide) {
      p = Math.min(1, Math.max(0, (window.scrollY - sellTop) / sellLen));
      track.style.transform = 'translate3d(' + (-p * trackShift).toFixed(1) + 'px,0,0)';
    } else {
      var r = track.getBoundingClientRect(), vh = window.innerHeight;
      p = Math.min(1, Math.max(0, (vh * 0.6 - r.top) / r.height));
    }
    fill.style.transform = wide ? 'scaleX(' + p.toFixed(4) + ')' : 'scaleY(' + p.toFixed(4) + ')';
    key.style.transform = wide ? 'translate3d(' + (p * railLen).toFixed(1) + 'px,0,0)' : 'translate3d(0,' + (p * railLen).toFixed(1) + 'px,0)';
    var active = Math.min(steps.length - 1, Math.floor(p * steps.length * 0.999 + (wide ? 0.25 : 0)));
    steps.forEach(function (s, i) { s.classList.toggle('lit', i <= active); });
  }
  function sellReq() { if (!sellTick) { sellTick = true; requestAnimationFrame(sellFrame); } }
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) { sellVisible = es[0].isIntersecting; if (sellVisible) sellReq(); }).observe(sell);
  } else { sellVisible = true; }

  /* ---------- Valuation wizard ---------- */
  var V = { step: 1, zone: '', type: '', m2: 90, beds: 2, baths: 1, cond: '', extras: [], when: '' };
  var wz = $('#wizard');
  function chips(el, items, multi, sel) {
    el.innerHTML = items.map(function (it) {
      var on = multi ? sel.indexOf(it[0]) > -1 : sel === it[0];
      return '<button type="button" class="chip" data-v="' + it[0] + '" aria-pressed="' + on + '">' + (on && multi ? '<svg class="ic" aria-hidden="true"><use href="#i-check"/></svg>' : '') + esc(it[1]) + '</button>';
    }).join('');
  }
  function renderWizard() {
    var u = U();
    chips($('#v-zone'), ZONES.concat(['otra']).map(function (z) { return [z, u.zones[z]]; }), false, V.zone);
    chips($('#v-beds'), [['1', '1'], ['2', '2'], ['3', '3'], ['4', '4'], ['5', '5+']], false, String(V.beds));
    chips($('#v-baths'), [['1', '1'], ['2', '2'], ['3', '3+']], false, String(V.baths));
    chips($('#v-cond'), Object.keys(u.cond).map(function (k) { return [k, u.cond[k]]; }), false, V.cond);
    chips($('#v-extras'), Object.keys(u.extras).map(function (k) { return [k, u.extras[k]]; }), true, V.extras);
    chips($('#v-when'), Object.keys(u.when).map(function (k) { return [k, u.when[k]]; }), false, V.when);
    $$('#v-type .tile').forEach(function (t) { t.setAttribute('aria-pressed', String(t.dataset.v === V.type)); });
    $('#v-m2-o').textContent = V.m2 + ' m²';
    dossier();
  }
  function bindChips(id, key, multi, num) {
    $(id).addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      var v = num ? +b.dataset.v : b.dataset.v;
      if (multi) { var i = V[key].indexOf(v); if (i > -1) V[key].splice(i, 1); else V[key].push(v); }
      else V[key] = v;
      renderWizard(); var nb = $(id + ' [data-v="' + b.dataset.v + '"]'); if (nb) nb.focus();
      pulse(key);
    });
  }
  bindChips('#v-zone', 'zone'); bindChips('#v-beds', 'beds', false, true); bindChips('#v-baths', 'baths', false, true);
  bindChips('#v-cond', 'cond'); bindChips('#v-extras', 'extras', true); bindChips('#v-when', 'when');
  bindChips('#v-type', 'type');
  $('#v-m2').addEventListener('input', function () { V.m2 = +this.value; $('#v-m2-o').textContent = V.m2 + ' m²'; dossier(); });
  $('#v-addr').addEventListener('input', dossier);
  var pulseMap = { zone: 'd-zone', type: 'd-type', beds: 'd-rooms', baths: 'd-rooms', cond: 'd-cond', extras: 'd-extras', when: 'd-when' };
  function pulse(k) {
    var el = document.getElementById(pulseMap[k]); if (!el || reduce) return;
    el.classList.remove('pulse'); void el.offsetWidth; el.classList.add('pulse');
  }
  function vData() {
    var u = U();
    return {
      zone: V.zone ? u.zones[V.zone] : '—', addr: $('#v-addr').value.trim(), type: V.type ? u.type[V.type] : '—', m2: V.m2,
      rooms: u.beds(V.beds) + ', ' + u.baths(V.baths), cond: V.cond ? u.cond[V.cond] : '—',
      extras: V.extras.length ? V.extras.map(function (x) { return u.extras[x]; }).join(', ') : '—', when: V.when ? u.when[V.when] : '—',
      name: $('#v-name').value.trim(), phone: $('#v-phone').value.trim()
    };
  }
  function dossier() {
    var d = vData(), u = U();
    $('#d-zone').textContent = d.zone + (d.addr ? ' · ' + d.addr : '');
    $('#d-type').textContent = d.type;
    $('#d-size').textContent = V.step >= 3 || V.m2 !== 90 ? d.m2 + ' m²' : '—';
    $('#d-rooms').textContent = V.step >= 3 ? d.rooms : '—';
    $('#d-cond').textContent = d.cond; $('#d-extras').textContent = d.extras; $('#d-when').textContent = d.when;
    $('#d-title').textContent = V.type ? (u.type[V.type] + (V.zone ? ' · ' + u.zones[V.zone] : '')) : (lang === 'en' ? PC.en.dossEmpty : esStr.dossEmpty);
    var filled = [V.zone, V.type, V.step >= 3, V.cond, V.when].filter(Boolean).length;
    $('.dossier').style.setProperty('--fill', filled / 5);
    $('.dossier').classList.toggle('complete', V.step > 5);
  }
  function showStep(n, focus) {
    V.step = n;
    $$('.wz-step', wz).forEach(function (f) { f.hidden = +f.dataset.step !== n; });
    var done = n > 5;
    $('#wz-done').hidden = !done;
    $('.wz-nav').hidden = done;
    $('#wz-i').textContent = Math.min(n, 5);
    $('.wz-bar').style.transform = 'scaleX(' + (Math.min(n, 5) / 5) + ')';
    $('#wz-back').style.visibility = n === 1 ? 'hidden' : 'visible';
    if (done) {
      var d = vData(), u = U(), txt = u.waValue(d);
      $('#v-wa').href = waLink(txt); $('#v-mail').href = mailLink(u.valSubject, txt);
    }
    dossier();
    if (focus) { var t = done ? $('#wz-done .display-s') : $('.wz-step:not([hidden]) legend', wz); if (t) { t.setAttribute('tabindex', '-1'); t.focus({ preventScroll: true }); } }
    if (focus && wz.getBoundingClientRect().top < 60) wz.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  }
  var nameEl = $('#v-name');
  function nameOk() { var ok = nameEl.value.trim().length > 1; nameEl.closest('.field').classList.toggle('bad', !ok); nameEl.setAttribute('aria-invalid', String(!ok)); return ok; }
  nameEl.addEventListener('blur', function () { if (nameEl.value) nameOk(); });
  nameEl.addEventListener('input', function () { if (nameEl.closest('.field').classList.contains('bad')) nameOk(); });
  $('#wz-next').addEventListener('click', function () {
    if (V.step === 5 && !nameOk()) { nameEl.focus(); return; }
    showStep(V.step + 1, true);
  });
  $('#wz-back').addEventListener('click', function () { if (V.step > 1) showStep(V.step - 1, true); });
  $('#wz-restart').addEventListener('click', function () { V = { step: 1, zone: '', type: '', m2: 90, beds: 2, baths: 1, cond: '', extras: [], when: '' }; $('#v-m2').value = 90; renderWizard(); showStep(1, true); });
  wz.addEventListener('submit', function (e) { e.preventDefault(); });
  var dd = new Date(); $('#d-date').textContent = ('0' + dd.getDate()).slice(-2) + '.' + ('0' + (dd.getMonth() + 1)).slice(-2) + '.' + dd.getFullYear();

  /* ---------- Foreign buyers costs ---------- */
  var fcPrice = $('#fc-price'), fcNew = $('#fc-new');
  function fc() {
    var u = U(), P = +String(fcPrice.value).replace(/[^\d]/g, '') || 0, rows;
    if (fcNew.checked) rows = [[u.costs.iva, P * 0.10], [u.costs.ajd, P * 0.012]]; else rows = [[u.costs.itp, P * 0.07]];
    rows.push([u.costs.not, P * 0.01]); rows.push([u.costs.ges, P * 0.005]);
    var tot = rows.reduce(function (s, r) { return s + r[1]; }, 0);
    $('#fc-list').innerHTML = rows.map(function (r) { return '<div><dt>' + r[0] + '</dt><dd>' + money(r[1]) + '</dd></div>'; }).join('') +
      '<div class="fc-tot"><dt>' + u.costs.total + '</dt><dd>' + money(tot) + ' <small>(' + (P ? (tot / P * 100).toFixed(1) : '0') + ' %)</small></dd></div>';
  }
  fcPrice.addEventListener('input', fc); fcNew.addEventListener('change', fc);
  fcPrice.addEventListener('blur', function () { var P = +String(fcPrice.value).replace(/[^\d]/g, ''); if (P) fcPrice.value = num(P); });

  /* ---------- WhatsApp general ---------- */
  function waGeneral() { $$('[data-wa="general"]').forEach(function (a) { a.href = waLink(U().waGeneral); }); }

  /* ---------- Reveal ---------- */
  if ('IntersectionObserver' in window && !reduce) {
    var rio = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); rio.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    $$('.sec-head, .map-card, .wizard, .dossier, .for-copy, .for-steps li, .timeline li, .score, .services li, .offices li, .contact-grid > div:first-child').forEach(function (el) { el.classList.add('rv'); rio.observe(el); });
  }

  function renderAll() {
    fillZoneSelect(); syncFilters(); renderList(false); renderWizard(); showStep(V.step, false); fc(); waGeneral(); req();
    if (cur && !detail.hidden) openDetail(cur.ref);
  }
  /* critical first: header + hero; everything below the fold after first paint */
  if (lang === 'en') applyStatic();
  onHead(); req();
  var booted = false;
  function boot() {
    if (booted) return; booted = true;
    renderAll(); sellMeasure(); route();
  }
  if (location.hash.indexOf('#inmueble/') === 0) boot();
  else if ('IntersectionObserver' in window) {
    var bio = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { bio.disconnect(); boot(); } }, { rootMargin: '0px 0px -40px 0px' });
    bio.observe(document.getElementById('buscar'));
    setTimeout(boot, 6000);
  } else setTimeout(boot, 200);
  ['scroll', 'pointerdown', 'keydown'].forEach(function (ev) { window.addEventListener(ev, boot, { once: true, passive: true }); });
  var smT; function sellLater() { if (!booted) return; clearTimeout(smT); smT = setTimeout(sellMeasure, 120); }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(sellLater);
  window.addEventListener('load', sellLater);
  if ('ResizeObserver' in window) new ResizeObserver(sellLater).observe(document.getElementById('main'));
  requestAnimationFrame(function () { document.documentElement.classList.add('ready'); });
})();
