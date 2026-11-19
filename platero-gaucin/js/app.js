/* Platero & Co · Noir Digital concept · vanilla JS, no dependencies */
(function () {
  'use strict';
  var doc = document, root = doc.documentElement;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, c) { return (c || doc).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); };
  var clamp = function (v, a, b) { return v < a ? a : v > b ? b : v; };
  var PHONE = '34667493887', EMAIL = 'info@platero-gaucin.com';

  /* ---------- language ---------- */
  var lang = 'es';
  try { lang = localStorage.getItem('platero-lang') || 'es'; } catch (e) {}
  function setLang(l) {
    lang = l; root.lang = l;
    try { localStorage.setItem('platero-lang', l); } catch (e) {}
    $('#langBtn').setAttribute('aria-label', l === 'es' ? 'Switch to English' : 'Cambiar a español');
    $$('[data-aria-es]').forEach(function (el) { el.setAttribute('aria-label', el.getAttribute('data-aria-' + l)); });
    $$('img[data-alt-en]').forEach(function (img) {
      if (!img.hasAttribute('data-alt-es')) img.setAttribute('data-alt-es', img.alt);
      img.alt = img.getAttribute('data-alt-' + l);
    });
    var on = $('.dish.is-on'); if (on) $('#plateCap').textContent = on.getAttribute('data-cap-' + l);
    renderDays(); updateHint();
    doc.title = l === 'es' ? 'Platero & Co · Restaurante en Gaucín · Serranía de Ronda' : 'Platero & Co · Restaurant in Gaucín · Serranía de Ronda';
  }
  $('#langBtn').addEventListener('click', function () { setLang(lang === 'es' ? 'en' : 'es'); });

  function toast(msg) {
    var t = $('#toast'); t.textContent = msg; t.classList.add('is-on');
    clearTimeout(toast._t); toast._t = setTimeout(function () { t.classList.remove('is-on'); }, 3200);
  }

  /* ---------- header / mobile bar ---------- */
  var hdr = $('.hdr'), mbar = $('.mbar');
  function onScrollUI() {
    var y = window.scrollY;
    var heroEl = $('#inicio');
    hdr.classList.toggle('is-solid', reduced ? y > 40 : y > heroEl.offsetTop + heroEl.offsetHeight - window.innerHeight - 10);
    mbar.classList.toggle('is-on', y > window.innerHeight * .6);
  }

  /* ---------- hero scroll sequence (single rAF, only while hero visible) ---------- */
  var heroBEl = $('.hero__b'), heroB = null;
  var hero = $('#inicio'), heroOn = true, heroDone = false, ticking = false;
  function heroFrame() {
    ticking = false;
    var r = hero.getBoundingClientRect(), vh = window.innerHeight;
    var p = clamp(-r.top / Math.max(1, r.height - vh), 0, 1);
    var q = clamp((p - .3) / .6, 0, 1);
    q = 1 - Math.pow(1 - q, 2.2);
    hero.style.setProperty('--p', p.toFixed(4));
    hero.style.setProperty('--q', q.toFixed(4));
    hero.classList.toggle('is-aout', p > .1);
    var isB = p > .68;
    if (isB !== heroB) { heroB = isB; hero.classList.toggle('is-b', isB); heroBEl.inert = !isB; }
    heroDone = p >= 1;
  }
  function requestHero() { if (heroOn && !ticking && !reduced) { ticking = true; requestAnimationFrame(heroFrame); } }
  if (!reduced) {
    new IntersectionObserver(function (es) { heroOn = es[0].isIntersecting; hero.classList.toggle('is-vis', heroOn); if (heroOn) requestHero(); }, { threshold: 0 }).observe(hero);
    heroFrame();
  } else {
    // reduced motion: show the terrace view as a static block under the hero
    var vista = doc.createElement('section');
    vista.className = 'vista'; vista.setAttribute('aria-label', 'Vista');
    vista.style.setProperty('--p', '1'); vista.style.setProperty('--q', '1');
    vista.appendChild($('.sky', hero).cloneNode(true));
    vista.appendChild($('.pano', hero));
    vista.appendChild($('.hero__b', hero));
    hero.after(vista);
    hero = vista; // clear-haze toggle lives here now
  }
  $('#clearBtn').addEventListener('click', function () {
    var on = !hero.classList.contains('is-clear');
    hero.classList.toggle('is-clear', on);
    this.setAttribute('aria-pressed', String(on));
  });

  /* sunset time for Gaucín (NOAA approximation) */
  (function () {
    var lat = 36.5192, lon = -5.3170, d = new Date();
    var rad = Math.PI / 180;
    var start = Date.UTC(d.getFullYear(), 0, 0), n = Math.floor((Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) - start) / 864e5);
    var g = 2 * Math.PI / 365 * (n - 1);
    var eqt = 229.18 * (0.000075 + 0.001868 * Math.cos(g) - 0.032077 * Math.sin(g) - 0.014615 * Math.cos(2 * g) - 0.040849 * Math.sin(2 * g));
    var decl = 0.006918 - 0.399912 * Math.cos(g) + 0.070257 * Math.sin(g) - 0.006758 * Math.cos(2 * g) + 0.000907 * Math.sin(2 * g) - 0.002697 * Math.cos(3 * g) + 0.00148 * Math.sin(3 * g);
    var ha = Math.acos(Math.cos(90.833 * rad) / (Math.cos(lat * rad) * Math.cos(decl)) - Math.tan(lat * rad) * Math.tan(decl)) / rad;
    var mins = 720 - 4 * (lon - ha) - eqt; // UTC minutes, sunset
    var t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0) + mins * 6e4);
    try {
      $('#sunsetT').textContent = new Intl.DateTimeFormat('es-ES', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Madrid' }).format(t);
      $('#sunset').hidden = false;
    } catch (e) {}
  })();

  /* ---------- reveals ---------- */
  if ('IntersectionObserver' in window && !reduced) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -10% 0px', threshold: .08 });
    $$('.rv').forEach(function (el) { io.observe(el); });
  } else { $$('.rv').forEach(function (el) { el.classList.add('in'); }); }

  /* ---------- season "now" marker ---------- */
  function placeNow() {
    var s = $('#season'), row = $('.srow', s); if (!row) return;
    var m = new Date().getMonth(), w = row.getBoundingClientRect().width;
    $('#seasonNow').style.setProperty('--x', ((m + .5) / 12 * w).toFixed(1) + 'px');
  }
  var seasonDirty = true;
  new IntersectionObserver(function (es) { if (es[0].isIntersecting && seasonDirty) { seasonDirty = false; placeNow(); } }).observe($('#season'));

  /* ---------- menu: dish image follows hover / tap / focus ---------- */
  var dishes = $$('.dish'), imgs = $$('#plate img'), cap = $('#plateCap');
  function showDish(btn) {
    if (!btn || btn.classList.contains('is-on')) return;
    dishes.forEach(function (d) { d.classList.toggle('is-on', d === btn); d.setAttribute('aria-pressed', String(d === btn)); });
    var k = btn.getAttribute('data-k');
    imgs.forEach(function (im) { im.classList.toggle('is-on', im.getAttribute('data-k') === k); });
    cap.style.opacity = 0;
    setTimeout(function () { cap.textContent = btn.getAttribute('data-cap-' + lang); cap.style.opacity = 1; }, 180);
  }
  dishes.forEach(function (d) {
    d.setAttribute('aria-pressed', String(d.classList.contains('is-on')));
    d.addEventListener('mouseenter', function () { showDish(d); });
    d.addEventListener('focus', function () { showDish(d); });
    d.addEventListener('click', function () { showDish(d); });
  });
  // warm the dish images once the menu approaches (they are lazy)
  new IntersectionObserver(function (es, o) {
    if (es[0].isIntersecting) { imgs.forEach(function (im) { im.loading = 'eager'; }); o.disconnect(); }
  }, { rootMargin: '600px 0px' }).observe($('#carta'));
  // phones: the dish crossing the middle of the screen takes the stage
  if (window.matchMedia('(max-width: 959px)').matches && 'IntersectionObserver' in window) {
    var mio = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) showDish(e.target); });
    }, { rootMargin: '-62% 0px -30% 0px' });
    dishes.forEach(function (d) { mio.observe(d); });
  }

  /* ---------- booking ---------- */
  var SCHED = { 0: ['comida', 'cena'], 1: [], 2: [], 3: ['comida', 'cena'], 4: ['comida', 'cena'], 5: ['comida'], 6: ['cena'] };
  var DN = { es: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'], en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] };
  var MN = { es: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'], en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] };
  var state = { date: null, svc: null, guests: 2, zone: '' };
  var fmtCache = {};
  function fmtLong(d) {
    var f = fmtCache[lang] || (fmtCache[lang] = new Intl.DateTimeFormat(lang === 'es' ? 'es-ES' : 'en-GB', { weekday: 'long', day: 'numeric', month: 'long' }));
    return f.format(d);
  }
  function closedReason(d) {
    var m = d.getMonth(), day = d.getDate(), wd = d.getDay();
    if (d.getFullYear() === 2027 && m === 0) return 'jan';
    if ((m === 6 && day >= 27) || (m === 7 && day <= 14)) return 'summer';
    if (!SCHED[wd].length) return 'week';
    return '';
  }
  function iso(d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  var daysReady = false;
  function renderDays() {
    var box = $('#days'); if (!box || !daysReady) return;
    var keep = state.date ? iso(state.date) : null, html = '';
    var t0 = new Date(); t0.setHours(12, 0, 0, 0);
    for (var i = 0; i < 28; i++) {
      var d = new Date(t0); d.setDate(t0.getDate() + i);
      var cr = closedReason(d), dis = !!cr;
      var em = i === 0 ? (lang === 'es' ? 'hoy' : 'today') : (cr ? (lang === 'es' ? 'cerrado' : 'closed') : MN[lang][d.getMonth()]);
      html += '<button type="button" class="day" role="radio" data-d="' + iso(d) + '" aria-checked="' + (keep === iso(d)) + '"' + (dis ? ' disabled' : '') +
        ' aria-label="' + fmtLong(d) + (dis ? (lang === 'es' ? ', cerrado' : ', closed') : '') + '"' +
        ' tabindex="-1"><small>' + DN[lang][d.getDay()] + '</small><b>' + d.getDate() + '</b><em>' + em + '</em></button>';
    }
    box.innerHTML = html;
    var first = $('.day[aria-checked="true"]', box) || $('.day:not([disabled])', box);
    if (first) first.tabIndex = 0;
  }
  function pickDay(btn) {
    $$('.day', $('#days')).forEach(function (b) { b.setAttribute('aria-checked', String(b === btn)); b.tabIndex = b === btn ? 0 : -1; });
    var p = btn.getAttribute('data-d').split('-');
    state.date = new Date(+p[0], +p[1] - 1, +p[2], 12);
    var allowed = SCHED[state.date.getDay()];
    $$('#svc input').forEach(function (inp) {
      inp.disabled = allowed.indexOf(inp.value) < 0;
      if (inp.disabled && inp.checked) inp.checked = false;
    });
    if (allowed.length === 1) { $('#svc input[value="' + allowed[0] + '"]').checked = true; }
    var c = $('#svc input:checked'); state.svc = c ? c.value : null;
    updateHint();
  }
  function isToday(d) { var t = new Date(); return d && d.toDateString() === t.toDateString(); }
  function updateHint() {
    var h = $('#dayHint'); if (!h) return;
    if (!state.date) { h.textContent = ''; return; }
    if (isToday(state.date)) { h.innerHTML = lang === 'es' ? 'Para hoy, solo por teléfono: <a href="tel:+' + PHONE + '">667 49 38 87</a>' : 'Same-day bookings by phone only: <a href="tel:+' + PHONE + '">667 49 38 87</a>'; return; }
    var a = SCHED[state.date.getDay()];
    h.textContent = a.length === 1 ? (lang === 'es' ? (a[0] === 'comida' ? 'Ese día solo hay comida.' : 'Ese día solo hay cena.') : (a[0] === 'comida' ? 'Lunch only that day.' : 'Dinner only that day.')) : '';
  }
  var daysBox = $('#days');
  daysBox.addEventListener('click', function (e) { var b = e.target.closest('.day'); if (b && !b.disabled) pickDay(b); });
  daysBox.addEventListener('keydown', function (e) {
    if (['ArrowRight', 'ArrowLeft'].indexOf(e.key) < 0) return;
    var all = $$('.day:not([disabled])', daysBox), i = all.indexOf(doc.activeElement);
    var n = all[clamp(i + (e.key === 'ArrowRight' ? 1 : -1), 0, all.length - 1)];
    if (n) { e.preventDefault(); n.focus(); pickDay(n); }
  });
  $$('#svc input').forEach(function (inp) { inp.addEventListener('change', function () { state.svc = inp.value; }); });

  var gOut = $('#gOut');
  function setGuests(n) {
    state.guests = clamp(n, 1, 6); gOut.textContent = state.guests;
    gOut.classList.toggle('bump', false); void gOut.offsetWidth; gOut.classList.toggle('bump', true);
    $('#gMinus').disabled = state.guests <= 1; $('#gPlus').disabled = state.guests >= 6;
    paintPlan();
  }
  $('#gMinus').addEventListener('click', function () { setGuests(state.guests - 1); });
  $('#gPlus').addEventListener('click', function () {
    if (state.guests >= 6) return;
    setGuests(state.guests + 1);
    if (state.guests === 6) toast(lang === 'es' ? 'Por su tamaño, no aceptan reservas de más de 6.' : 'Due to their size, no bookings over 6 guests.');
  });
  $$('#zone input').forEach(function (inp) { inp.addEventListener('change', function () { state.zone = inp.value; paintPlan(); }); });
  function paintPlan() {
    $$('.plan__zone').forEach(function (z) { z.classList.toggle('is-on', !!state.zone && z.getAttribute('data-z') === state.zone); });
    var sizes = [2, 4, 6], need = sizes.filter(function (s) { return s >= state.guests; })[0];
    $$('#planSvg .tb').forEach(function (t) {
      var zoneOk = !state.zone || t.getAttribute('data-z') === state.zone;
      var fit = zoneOk && +t.getAttribute('data-s') === need;
      t.classList.toggle('is-fit', fit);
      t.classList.toggle('is-dim', !zoneOk);
    });
  }
  setGuests(2);
  new IntersectionObserver(function (es, o) { if (es[0].isIntersecting) { daysReady = true; renderDays(); o.disconnect(); } }, { rootMargin: '900px 0px' }).observe($('#reservar'));

  function buildMsg() {
    var err = $('#bkErr'), name = $('#bkName');
    err.textContent = ''; name.removeAttribute('aria-invalid');
    if (!state.date) { err.textContent = lang === 'es' ? 'Elige un día en el paso 1.' : 'Pick a day in step 1.'; $('#days').scrollIntoView({ block: 'center' }); return null; }
    if (isToday(state.date)) { err.textContent = lang === 'es' ? 'Para hoy hay que llamar: 667 49 38 87.' : 'For today, please call: 667 49 38 87.'; return null; }
    if (!state.svc) { err.textContent = lang === 'es' ? 'Elige comida o cena en el paso 2.' : 'Choose lunch or dinner in step 2.'; return null; }
    if (!name.value.trim()) { err.textContent = lang === 'es' ? 'Escribe tu nombre para la reserva.' : 'Add your name for the booking.'; name.setAttribute('aria-invalid', 'true'); name.focus(); return null; }
    var dStr = fmtLong(state.date);
    var svc = lang === 'es' ? state.svc : (state.svc === 'comida' ? 'lunch' : 'dinner');
    var zone = state.zone ? (lang === 'es' ? state.zone : (state.zone === 'terraza' ? 'terrace' : 'dining room')) : '';
    var note = $('#bkNote').value.trim();
    var lines = lang === 'es'
      ? ['Hola Hellen y Barry, quería reservar mesa en Platero & Co:', '· ' + dStr + ', ' + svc, '· ' + state.guests + (state.guests === 1 ? ' persona' : ' personas'), zone ? '· Preferencia: ' + zone + ' (si es posible)' : '', note ? '· Notas: ' + note : '', '', 'Nombre: ' + name.value.trim(), 'Gracias.']
      : ['Hello Hellen and Barry, I would like to book a table at Platero & Co:', '· ' + dStr + ', ' + svc, '· ' + state.guests + (state.guests === 1 ? ' guest' : ' guests'), zone ? '· Preference: ' + zone + ' (if possible)' : '', note ? '· Notes: ' + note : '', '', 'Name: ' + name.value.trim(), 'Thank you.'];
    return lines.filter(function (l, i) { return l !== '' || i === 5; }).join('\n');
  }
  $('#sendWa').addEventListener('click', function () {
    var m = buildMsg(); if (!m) return;
    window.open('https://wa.me/' + PHONE + '?text=' + encodeURIComponent(m), '_blank', 'noopener');
  });
  $('#sendMail').addEventListener('click', function () {
    var m = buildMsg(); if (!m) return;
    var subj = lang === 'es' ? 'Reserva · Platero & Co' : 'Booking · Platero & Co';
    location.href = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent(subj) + '&body=' + encodeURIComponent(m);
  });
  $('#bkName').addEventListener('input', function () { if (this.value.trim()) { this.removeAttribute('aria-invalid'); $('#bkErr').textContent = ''; } });
  var today = new Date().getDay(); var li = $('#hours li[data-d="' + today + '"]'); if (li) li.classList.add('is-today');

  /* ---------- road: drawn with scroll, rAF only while visible ---------- */
  var track = $('#roadTrack'), line = $('#roadLine'), car = $('#roadCar'), stops = $$('.stop'), svg = $('.road__svg');
  var len = line.getTotalLength(), roadOn = false, roadTick = false, slen = len, samples = [];
  // non-scaling-stroke measures dashes in screen pixels: measure the path in screen space
  function measureRoad() {
    var sr = svg.getBoundingClientRect(), sx = sr.width / 200, sy = sr.height / 1000, prev = null, acc = 0;
    samples = [];
    for (var i = 0; i <= 140; i++) {
      var pt = line.getPointAtLength(len * i / 140), x = pt.x * sx, y = pt.y * sy;
      if (prev) acc += Math.hypot(x - prev[0], y - prev[1]);
      samples.push([acc, x, y]); prev = [x, y];
    }
    slen = acc;
    line.style.strokeDasharray = slen + ' ' + slen;
    line.style.strokeDashoffset = reduced ? 0 : slen;
  }
  var roadDirty = true;
  line.style.strokeDasharray = '1 99999'; line.style.strokeDashoffset = reduced ? 0 : 1;
  if (reduced) line.style.strokeDasharray = 'none';
  function roadFrame() {
    roadTick = false;
    if (roadDirty) { measureRoad(); roadDirty = false; }
    var r = track.getBoundingClientRect(), vh = window.innerHeight;
    var p = clamp((vh * .62 - r.top) / r.height, 0, 1);
    line.style.strokeDashoffset = (slen * (1 - p)).toFixed(1);
    var target = slen * p, k = 1;
    while (k < samples.length - 1 && samples[k][0] < target) k++;
    var a = samples[k - 1], b = samples[k], f = b[0] > a[0] ? (target - a[0]) / (b[0] - a[0]) : 0;
    var sr = svg.getBoundingClientRect();
    var x = sr.left - r.left + a[1] + (b[1] - a[1]) * f, y = a[2] + (b[2] - a[2]) * f;
    car.style.transform = 'translate3d(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px,0)';
    stops.forEach(function (s) { s.classList.toggle('is-on', p * 100 >= parseFloat(s.style.getPropertyValue('--y')) - 6); });
  }
  function requestRoad() { if (roadOn && !roadTick && !reduced) { roadTick = true; requestAnimationFrame(roadFrame); } }
  if (!reduced) new IntersectionObserver(function (es) { roadOn = es[0].isIntersecting; if (roadOn) requestRoad(); }).observe(track);

  /* ---------- una tarde en la terraza: pinned scene, rAF only while visible ---------- */
  var tarde = $('#tarde'), tOn = false, tTick = false, cands = $$('.cand', tarde), caps = $$('.cap', tarde), lastCap = -1;
  var LIT = [.36, .43, .5, .57, .64];
  function tardeFrame() {
    tTick = false;
    var r = tarde.getBoundingClientRect(), vh = window.innerHeight;
    var t = clamp(-r.top / Math.max(1, r.height - vh), 0, 1);
    var dk = clamp(t / .42, 0, 1), nt = clamp((t - .52) / .34, 0, 1), vl = clamp((t - .22) / .2, 0, 1) * (1 - nt * .65);
    applyT(t, dk, nt, vl);
    cands.forEach(function (c, i) { c.classList.toggle('is-lit', t >= LIT[i]); });
    var ci = t < .3 ? 0 : t < .68 ? 1 : 2;
    if (ci !== lastCap) { lastCap = ci; caps.forEach(function (c, i) { c.classList.toggle('is-on', i === ci); }); }
  }
  var TL = { dusk: $('.ts--dusk', tarde), night: $('.ts--night', tarde), milky: $('.ts--milky', tarde), stars: $$('.tl--stars', tarde), wash: $('.tl--wash', tarde), tn: $('.tl--night', tarde), vill: $('.tl--vill', tarde), dim: $('.terr__dim', tarde), dot: $('.clock__dot', tarde) };
  var prevO = new Map();
  function setO(el, v) { var r = Math.round(v * 500) / 500; if (prevO.get(el) !== r) { prevO.set(el, r); el.style.opacity = r; } }
  function applyT(t, dk, nt, vl) {
    setO(TL.dusk, dk); setO(TL.night, nt); setO(TL.milky, nt); TL.stars.forEach(function (e) { setO(e, nt); });
    setO(TL.wash, 1 - dk); setO(TL.tn, nt); setO(TL.vill, vl); setO(TL.dim, dk * .5 + nt * .38);
    var w = TL.dot.parentNode.clientWidth; TL.dot.style.transform = 'translate3d(' + (t * w).toFixed(1) + 'px,0,0)';
    tarde.classList.toggle('is-night', nt > .3);
  }
  function requestTarde() { if (tOn && !tTick) { tTick = true; requestAnimationFrame(tardeFrame); } }
  if (reduced) { applyT(.7, 1, .55, .7); cands.forEach(function (c) { c.classList.add('is-lit'); }); caps.forEach(function (c) { c.classList.add('is-on'); }); tarde.classList.add('is-vis'); }
  else new IntersectionObserver(function (es) { tOn = es[0].isIntersecting; tarde.classList.toggle('is-vis', tOn); if (tOn) requestTarde(); }).observe(tarde);

  /* ---------- nav scrollspy ---------- */
  var navLinks = $$('.nav a');
  var spy = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      navLinks.forEach(function (a) { a.classList.toggle('is-active', a.getAttribute('href') === '#' + e.target.id); });
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  ['carta', 'casa', 'reservar', 'llegar'].forEach(function (id) { var el = doc.getElementById(id); if (el) spy.observe(el); });

  /* ---------- plate tilt (fine pointers only) ---------- */
  var plate = $('#plate');
  if (!reduced && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    var stage = $('.carta__in'), pend = false, mx = 0, my = 0;
    stage.addEventListener('pointermove', function (e) {
      var r = plate.getBoundingClientRect(); mx = (e.clientX - r.left) / r.width - .5; my = (e.clientY - r.top) / r.height - .5;
      if (!pend) { pend = true; requestAnimationFrame(function () { pend = false; plate.style.setProperty('--ry', clamp(mx, -.6, .6) * 5 + 'deg'); plate.style.setProperty('--rx', clamp(-my, -.6, .6) * 4 + 'deg'); }); }
    });
    stage.addEventListener('pointerleave', function () { plate.style.setProperty('--rx', '0deg'); plate.style.setProperty('--ry', '0deg'); });
  }

  window.addEventListener('scroll', function () { requestHero(); requestRoad(); requestTarde(); onScrollUI(); }, { passive: true });
  window.addEventListener('resize', function () { roadDirty = true; requestHero(); requestRoad(); if (!seasonDirty) placeNow(); }, { passive: true });
  onScrollUI();
  setLang(lang);
})();
