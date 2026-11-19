(function () {
  'use strict';
  var doc = document, root = doc.documentElement;
  var RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, c) { return (c || doc).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); };
  var lang = 'es';

  /* ---------- strings used by scripts ---------- */
  var STR = {
    es: { title: 'Museo del Vidrio y Cristal de Málaga · Concepto de Noir Digital', open: 'Hoy abierto · 11:00–19:00', openShort: 'Hoy abierto · 11:00–15:00', closedMon: 'Hoy cerrado (lunes)', closedAug: 'Cerrado en agosto', closedHol: 'Hoy cerrado (festivo)', closedNow: 'Ahora cerrado · abre a las 11:00', lastNow: 'Abierto · última visita 18:00 pasada', group: 'Más de 10 personas: la reserva es obligatoria y se aplica la tarifa de grupo (6 €).', need: 'Escribe tu nombre para que el museo sepa a quién responder.', pickDay: 'Elige un día abierto.', pickTime: 'Elige una hora.', nobody: 'Añade al menos un visitante.', ready: 'Email preparado en tu app de correo.', subj: 'Reserva de visita guiada', hello: 'Hola, me gustaría reservar una visita guiada.', day: 'Día', time: 'Hora preferida', tl: 'Idioma de la visita', people: 'Personas', gen: 'general', red: 'reducida', kid: 'niños hasta 6', est: 'Total estimado', name: 'Nombre', note: 'Nota', bye: 'Gracias.', from: 'Enviado desde el concepto web de Noir Digital', p1: 'persona', pN: 'personas', free: 'Gratis' },
    en: { title: 'Glass and Crystal Museum of Málaga · Noir Digital concept', open: 'Open today · 11:00–19:00', openShort: 'Open today · 11:00–15:00', closedMon: 'Closed today (Monday)', closedAug: 'Closed in August', closedHol: 'Closed today (holiday)', closedNow: 'Closed now · opens at 11:00', lastNow: 'Open · last visit (18:00) has passed', group: 'More than 10 people: booking is required and the group rate (6 €) applies.', need: 'Add your name so the museum knows who to reply to.', pickDay: 'Choose an open day.', pickTime: 'Choose a time.', nobody: 'Add at least one visitor.', ready: 'Email ready in your mail app.', subj: 'Guided visit booking', hello: 'Hello, I would like to book a guided visit.', day: 'Day', time: 'Preferred time', tl: 'Tour language', people: 'Visitors', gen: 'general', red: 'reduced', kid: 'children up to 6', est: 'Estimated total', name: 'Name', note: 'Note', bye: 'Thank you.', from: 'Sent from the Noir Digital website concept', p1: 'person', pN: 'people', free: 'Free' },
    fr: { title: 'Musée du Verre et du Cristal de Málaga · Concept Noir Digital', open: 'Ouvert aujourd’hui · 11h–19h', openShort: 'Ouvert aujourd’hui · 11h–15h', closedMon: 'Fermé aujourd’hui (lundi)', closedAug: 'Fermé en août', closedHol: 'Fermé aujourd’hui (jour férié)', closedNow: 'Fermé · ouvre à 11h', lastNow: 'Ouvert · dernière visite (18h) passée', group: 'Plus de 10 personnes : réservation obligatoire, tarif groupe (6 €).', need: 'Indiquez votre nom pour que le musée sache à qui répondre.', pickDay: 'Choisissez un jour d’ouverture.', pickTime: 'Choisissez une heure.', nobody: 'Ajoutez au moins un visiteur.', ready: 'E-mail prêt dans votre messagerie.', subj: 'Réservation de visite guidée', hello: 'Bonjour, je souhaite réserver une visite guidée.', day: 'Jour', time: 'Heure souhaitée', tl: 'Langue de la visite', people: 'Visiteurs', gen: 'plein tarif', red: 'réduit', kid: 'enfants jusqu’à 6 ans', est: 'Total estimé', name: 'Nom', note: 'Note', bye: 'Merci.', from: 'Envoyé depuis le concept web de Noir Digital', p1: 'personne', pN: 'personnes', free: 'Gratuit' }
  };
  var LOC = { es: 'es-ES', en: 'en-GB', fr: 'fr-FR' };
  var FMT = {};
  var fmtDate = function (key, o) { var k = lang + key; return FMT[k] || (FMT[k] = new Intl.DateTimeFormat(LOC[lang], o)); };
  var t = function (k) { return STR[lang][k]; };

  /* ---------- language ---------- */
  var i18nEls = $$('[data-en]'), ariaEls = $$('[data-aria-en]'), altEls = $$('[data-alt-en]');
  altEls.forEach(function (el) { el._esAlt = el.getAttribute('alt'); });
  i18nEls.forEach(function (el) { el._es = el.innerHTML; });
  ariaEls.forEach(function (el) { el._esA = el.getAttribute('aria-label'); });
  var langHooks = [];
  function setLang(l) {
    lang = l;
    root.lang = l;
    i18nEls.forEach(function (el) { el.innerHTML = l === 'es' ? el._es : (el.getAttribute('data-' + l) || el._es); });
    ariaEls.forEach(function (el) { el.setAttribute('aria-label', l === 'es' ? el._esA : (el.getAttribute('data-aria-' + l) || el._esA)); });
    altEls.forEach(function (el) { el.setAttribute('alt', l === 'es' ? el._esAlt : (el.getAttribute('data-alt-' + l) || el._esAlt)); });
    $$('.langs button').forEach(function (b, i) { var on = b.dataset.lang === l; b.setAttribute('aria-pressed', String(on)); if (on) $('.langs').style.setProperty('--i', i); });
    doc.title = t('title');
    langHooks.forEach(function (f) { f(); });
    try { localStorage.setItem('mv-lang', l); } catch (e) {}
  }
  $$('.langs button').forEach(function (b) { b.addEventListener('click', function () { setLang(b.dataset.lang); }); });

  /* ---------- toast ---------- */
  var toastEl = $('#toast'), toastT;
  function toast(msg) { toastEl.textContent = msg; toastEl.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove('on'); }, 3200); }

  /* ---------- header + reveals ---------- */
  var header = $('.header'), hero = $('.hero');
  new IntersectionObserver(function (es) { header.classList.toggle('solid', !es[0].isIntersecting); }, { rootMargin: '-80px 0px 0px 0px' }).observe(hero);
  if (!RM && 'IntersectionObserver' in window) {
    var rio = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); rio.unobserve(e.target); } }); }, { rootMargin: '0px 0px -8% 0px' });
    $$('.rv').forEach(function (el) { rio.observe(el); });
  } else { $$('.rv').forEach(function (el) { el.classList.add('in'); }); }

  /* ---------- hero light ---------- */
  var heroFx = null;
  var moveLight = function (x, y) {
    if (!heroFx) return;
    var r = hero.getBoundingClientRect();
    heroFx.setLight((x - r.left) / r.width, 1 - (y - r.top) / r.height);
    hero.classList.add('moved');
  };
  hero.addEventListener('pointermove', function (e) { if (e.pointerType === 'mouse') moveLight(e.clientX, e.clientY); }, { passive: true });
  hero.addEventListener('touchmove', function (e) { var p = e.touches[0]; moveLight(p.clientX, p.clientY); }, { passive: true });
  hero.addEventListener('touchstart', function (e) { var p = e.touches[0]; moveLight(p.clientX, p.clientY); }, { passive: true });

  /* ---------- walk through the eras ---------- */
  var walk = $('#epocas'), eras = $$('.era', walk), track = $('.walk-track', walk);
  var walkFx = null, walkIdx = -1;
  var ERA_PAL = [['#62d6e6', '#1d3a9a'], ['#f4bb4e', '#a51f36'], ['#ef8a6c', '#5e0f1f'], ['#86dcc0', '#164b6e'], ['#f7c96c', '#7f5210'], ['#ff6450', '#8d8fa8'], ['#ffb84a', '#d24a24'], ['#76e4ff', '#2b3cae']];
  /* the shaders start after the page has painted, so they never delay first paint */
  var startFx = function () {
    if (!window.Caustics) return;
    heroFx = new window.Caustics($('#heroFx'), { reduced: RM, scale: 12, spread: 1.5, budget: innerWidth > 999 ? 320000 : 150000, palettes: [['#e4f6ff', '#2f6f96']], onFirst: function () { root.classList.add('fx-ready'); } });
    if (!heroFx.ok) heroFx = null;
    if (!RM && eras.length) {
      var wio = new IntersectionObserver(function (es) {
        if (!es[0].isIntersecting) return; wio.disconnect();
        walkFx = new window.Caustics($('#walkFx'), { reduced: heroFx ? heroFx.reduced : false, scale: 10, spread: 1.1, budget: innerWidth > 999 ? 300000 : 130000, palettes: ERA_PAL, t0: 40000 });
        if (!walkFx.ok) walkFx = null; else if (walkIdx > -1) walkFx.setPalette(walkIdx);
      }, { rootMargin: '1200px 0px' });
      wio.observe(track);
    }
  };
  var arm = function () { if (window.Caustics) window.Caustics.arm(); ['pointermove', 'touchstart', 'scroll', 'keydown', 'wheel'].forEach(function (ev) { window.removeEventListener(ev, arm); }); };
  ['pointermove', 'touchstart', 'scroll', 'keydown', 'wheel'].forEach(function (ev) { window.addEventListener(ev, arm, { passive: true }); });
  setTimeout(arm, 6000);
  var later = function () { (window.requestIdleCallback || function (f) { setTimeout(f, 1); })(startFx, { timeout: 1200 }); };
  // WebGL starts only after the largest paint and the load event
  var gotLcp = false, loaded = doc.readyState === 'complete', fxQueued = false;
  var maybeStart = function () { if (fxQueued || !gotLcp || !loaded) return; fxQueued = true; setTimeout(later, 120); };
  try { new PerformanceObserver(function () { gotLcp = true; maybeStart(); }).observe({ type: 'largest-contentful-paint', buffered: true }); } catch (e) { gotLcp = true; }
  setTimeout(function () { gotLcp = true; maybeStart(); }, 3500);
  if (!loaded) window.addEventListener('load', function () { loaded = true; maybeStart(); }); else maybeStart();
  if (window.drawSilhouettes) { var sio = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { sio.disconnect(); window.drawSilhouettes(); } }, { rootMargin: '1500px 0px' }); sio.observe(walk); }
  eras.forEach(function (e, i) { e.style.setProperty('--tint', ERA_PAL[i][0]); });
  if (!RM && eras.length) {
    walk.classList.add('live');
    var dots = $('#railDots'), fill = $('#railFill'), nowEl = $('#walkNow');
    eras.forEach(function (era, i) {
      var li = doc.createElement('li'), b = doc.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-label', era.querySelector('.era-year').textContent + ' · ' + era.querySelector('h3').textContent);
      b.addEventListener('click', function () { var top = track.getBoundingClientRect().top + window.scrollY; var span = track.offsetHeight - window.innerHeight; window.scrollTo({ top: top + span * ((i + 0.5) / eras.length), behavior: 'smooth' }); });
      li.appendChild(b); dots.appendChild(li);
    });
    langHooks.push(function () { $$('button', dots).forEach(function (b, i) { b.setAttribute('aria-label', eras[i].querySelector('.era-year').textContent + ' · ' + eras[i].querySelector('h3').textContent); }); });
    var dotBtns = $$('button', dots);
    var setEra = function (i) {
      if (i === walkIdx) return;
      walkIdx = i;
      eras.forEach(function (e, j) { e.classList.toggle('on', j === i); });
      dotBtns.forEach(function (b, j) { b.setAttribute('aria-current', String(j === i)); });
      nowEl.textContent = (i < 9 ? '0' : '') + (i + 1);
      if (walkFx) walkFx.setPalette(i);
    };
    var walkVisible = false, ticking = false;
    var onWalk = function () {
      ticking = false;
      var r = track.getBoundingClientRect(), span = r.height - window.innerHeight;
      var p = Math.max(0, Math.min(1, -r.top / span));
      fill.style.transform = 'scaleX(' + p.toFixed(4) + ')';
      setEra(Math.min(eras.length - 1, Math.floor(p * eras.length)));
      if (walkFx) walkFx.setLight(0.3 + p * 0.45, 0.62 + Math.sin(p * Math.PI * 4) * 0.08);
    };
    var req = function () { if (walkVisible && !ticking) { ticking = true; requestAnimationFrame(onWalk); } };
    new IntersectionObserver(function (es) { walkVisible = es[0].isIntersecting; walk.classList.toggle('playing', walkVisible); if (walkVisible) req(); }).observe(track);
    window.addEventListener('scroll', req, { passive: true });
    setEra(0);
    // fit each piece in the space left above its text (texts differ in length and language)
    var fitPieces = function () {
      eras.forEach(function (era) {
        var pc = era.querySelector('.piece'), first = era.querySelector('.era-year');
        if (!pc || !first) return;
        var top = pc.offsetTop, room = first.offsetTop - top - 14;
        var max = innerWidth > 999 ? 2000 : 380;
        if (innerWidth > 999) room = era.offsetHeight - top - innerHeight * 0.06;
        pc.style.height = Math.max(120, Math.min(max, room)) + 'px';
      });
    };
    var fio = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { fio.disconnect(); requestAnimationFrame(fitPieces); window.addEventListener('resize', fitPieces, { passive: true }); } }, { rootMargin: '1200px 0px' });
    fio.observe(track);
    langHooks.push(fitPieces);
  }

  /* ---------- walk through the house (doorways that scale past you) ---------- */
  var tour = $('#recorrido');
  if (tour && !RM) {
    tour.classList.add('live');
    var rooms = $$('.room', tour), tTrack = $('.tour-track', tour), N = rooms.length;
    var dotsWrap = doc.createElement('div'); dotsWrap.className = 'tour-dots'; dotsWrap.setAttribute('aria-hidden', 'true');
    rooms.forEach(function () { dotsWrap.innerHTML += '<i><b></b></i>'; });
    $('.tour-stage', tour).appendChild(dotsWrap);
    var dotFills = $$('b', dotsWrap);
    var R = rooms.map(function (r, i) { r.style.zIndex = i + 1; return { el: r, img: $('img', r), door: $('.door', r), last: '' }; });
    // load the first two rooms' photos as the section approaches
    var origin = function () {
      var st = $('.tour-stage', tour), W = st.clientWidth, H = st.clientHeight, k = Math.max(W, H) / 1000;
      var oy = (H / 2 + (650 - 500) * k).toFixed(1) + 'px';
      R.forEach(function (o) { o.door.style.transformOrigin = '50% ' + oy; o.img.style.transformOrigin = '50% ' + oy; });
    };
    var clamp = function (v) { return v < 0 ? 0 : v > 1 ? 1 : v; };
    var tourTick = false, tourVis = false;
    var onTour = function () {
      tourTick = false;
      var r = tTrack.getBoundingClientRect(), span = r.height - innerHeight;
      var p = clamp(-r.top / span) * N * 0.999;
      var top = Math.floor(p);
      R.forEach(function (o, i) {
        var q = p - i;
        var op = i === 0 ? 1 : clamp(q / 0.2);
        var e = Math.pow(clamp((q - 0.15) / 0.6), 2.1);
        var vis = op > 0 && i >= top - 1 && i <= top + 1;
        o.el.classList.toggle('vis', vis);
        if (!vis) return;
        var key = op.toFixed(3) + e.toFixed(4);
        if (key === o.last) return; o.last = key;
        o.el.style.opacity = op.toFixed(3);
        o.door.style.transform = 'scale(' + (1 + e * 7).toFixed(4) + ')';
        o.door.style.opacity = (1 - clamp((e - 0.85) / 0.15)).toFixed(3);
        o.img.style.transform = 'scale(' + (1.22 - e * 0.22).toFixed(4) + ')';
        o.el.classList.toggle('cap-on', i === top && q > 0.25);
      });
      dotFills.forEach(function (d, i) { d.style.transform = 'scaleX(' + clamp(p - i).toFixed(3) + ')'; });
    };
    var reqTour = function () { if (tourVis && !tourTick) { tourTick = true; requestAnimationFrame(onTour); } };
    new IntersectionObserver(function (es) {
      tourVis = es[0].isIntersecting;
      if (tourVis) { R.forEach(function (o) { o.img.loading = 'eager'; }); origin(); reqTour(); }
    }, { rootMargin: '600px 0px' }).observe(tTrack);
    window.addEventListener('scroll', reqTour, { passive: true });
    window.addEventListener('resize', function () { origin(); reqTour(); }, { passive: true });
    langHooks.push(function () { R.forEach(function (o) { o.last = ''; }); reqTour(); });
  }

  /* ---------- stained glass triptych ---------- */
  var tri = $('#tri');
  var buildTri = function () {
    if (!window.Vidriera) return;
    var apply = window.Vidriera(tri, {});
    var sun = $('#sun'), out = $('#sunOut'), touched = false;
    var fmt = function (m) { var h = Math.floor(m / 60), mm = m % 60; return (h < 10 ? '0' : '') + h + ':' + (mm < 10 ? '0' : '') + mm; };
    var applySun = function (m) { apply((m - 660) / 480); out.textContent = fmt(m); sun.setAttribute('aria-valuetext', fmt(m)); };
    sun.addEventListener('input', function () { touched = true; tri.classList.add('touched'); applySun(+sun.value); });
    applySun(+sun.value);
    window.addEventListener('resize', function () { applySun(+sun.value); }, { passive: true });
    if (!RM) {
      var triVis = false, tTick = false;
      var onTri = function () {
        tTick = false; if (touched) return;
        var r = tri.getBoundingClientRect(), vh = window.innerHeight;
        var p = Math.max(0, Math.min(1, (vh - r.top) / (vh + r.height)));
        var m = Math.round((660 + p * 480) / 5) * 5; sun.value = m; applySun(m);
      };
      new IntersectionObserver(function (es) { triVis = es[0].isIntersecting; }).observe(tri);
      window.addEventListener('scroll', function () { if (triVis && !tTick && !touched) { tTick = true; requestAnimationFrame(onTri); } }, { passive: true });
    }
  };
  if (tri) {
  var triDone = false, triOnce = function () { if (triDone) return; triDone = true; triIO.disconnect(); buildTri(); };
    var triIO = new IntersectionObserver(function (es) { if (es[0].isIntersecting) triOnce(); }, { rootMargin: '900px 0px' });
    triIO.observe(tri);
    window.addEventListener('load', function () { setTimeout(function () { (window.requestIdleCallback || function (f) { setTimeout(f, 1); })(triOnce, { timeout: 2500 }); }, 2500); });
  }

  /* ---------- opening status ---------- */
  var CLOSED_MD = ['12-25', '01-01', '01-06'], SHORT_MD = ['12-24', '12-31'];
  function md(d) { return String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  function dayState(d) {
    if (d.getMonth() === 7) return 'aug';
    if (d.getDay() === 1) return 'mon';
    if (CLOSED_MD.indexOf(md(d)) > -1) return 'hol';
    return SHORT_MD.indexOf(md(d)) > -1 ? 'short' : 'open';
  }
  function renderToday() {
    var el = $('#today'); if (!el) return;
    var now = new Date(), s = dayState(now), mins = now.getHours() * 60 + now.getMinutes(), txt, closed = true;
    if (s === 'aug') txt = t('closedAug'); else if (s === 'mon') txt = t('closedMon'); else if (s === 'hol') txt = t('closedHol');
    else if (mins < 660) txt = t('closedNow');
    else if (mins >= (s === 'short' ? 900 : 1140)) txt = t('closedNow');
    else if (s !== 'short' && mins > 1080) { txt = t('lastNow'); closed = false; }
    else { txt = s === 'short' ? t('openShort') : t('open'); closed = false; }
    el.classList.toggle('closed', closed); el.querySelector('span').textContent = txt;
  }
  renderToday(); langHooks.push(renderToday);

  /* ---------- booking ---------- */
  var form = $('#bookForm');
  var initBooking = function () {
    var state = { day: null, time: null, tl: 'Español', n: { gen: 2, red: 0, kid: 0 } };
    var daysEl = $('#days'), timesEl = $('#times'), days = [];
    var start = new Date(); start.setHours(12, 0, 0, 0);
    for (var i = 0; i < 28; i++) { var d = new Date(start); d.setDate(start.getDate() + i); days.push(d); }
    var firstOpen = null;
    var renderDays = function () {
      var wd = fmtDate('wd', { weekday: 'short' }), mo = fmtDate('mo', { month: 'short' }), full = fmtDate('full', { weekday: 'long', day: 'numeric', month: 'long' });
      daysEl.innerHTML = '';
      days.forEach(function (d, i) {
        var s = dayState(d), b = doc.createElement('button');
        b.type = 'button'; b.className = 'day';
        var today = i === 0, nowM = new Date().getHours() * 60 + new Date().getMinutes();
        var off = s === 'mon' || s === 'aug' || s === 'hol' || (today && nowM >= (s === 'short' ? 840 : 1080));
        b.disabled = off;
        b.innerHTML = '<small>' + wd.format(d).replace('.', '') + '</small><b>' + d.getDate() + '</b><small>' + mo.format(d).replace('.', '') + '</small>';
        b.setAttribute('aria-label', full.format(d));
        b.setAttribute('aria-pressed', String(state.day === i));
        if (!off && firstOpen === null) firstOpen = i;
        b.addEventListener('click', function () { state.day = i; state.time = null; renderDays(); renderTimes(); update(); });
        daysEl.appendChild(b);
      });
    };
    var renderTimes = function () {
      timesEl.innerHTML = '';
      if (state.day === null) return;
      var d = days[state.day], last = dayState(d) === 'short' ? 14 : 18, isToday = state.day === 0;
      var nowM = new Date().getHours() * 60 + new Date().getMinutes();
      for (var h = 11; h <= last; h++) {
        var b = doc.createElement('button'), v = (h < 10 ? '0' : '') + h + ':00';
        b.type = 'button'; b.className = 'chip'; b.textContent = v; b.dataset.v = v;
        b.disabled = isToday && h * 60 < nowM + 30;
        b.setAttribute('aria-pressed', String(state.time === v));
        b.addEventListener('click', function (e) { state.time = e.currentTarget.dataset.v; renderTimes(); update(); });
        timesEl.appendChild(b);
      }
    };
    $$('#tlang .chip').forEach(function (b) { b.addEventListener('click', function () { state.tl = b.dataset.v; $$('#tlang .chip').forEach(function (c) { c.setAttribute('aria-pressed', String(c === b)); }); update(); }); });
    $$('.stepper').forEach(function (st) {
      var k = st.dataset.k, o = $('output', st);
      $$('button', st).forEach(function (b) { b.addEventListener('click', function () { state.n[k] = Math.max(0, Math.min(40, state.n[k] + +b.dataset.d)); o.textContent = state.n[k]; o.classList.remove('pop'); void o.offsetWidth; o.classList.add('pop'); update(); }); });
    });
    var pop = function (el, v) { if (el.textContent !== v) { el.textContent = v; el.classList.remove('pop'); void el.offsetWidth; el.classList.add('pop'); } };
    var calc = function () {
      var n = state.n, people = n.gen + n.red + n.kid, paying = n.gen + n.red, group = people > 10 || paying >= 10;
      return { people: people, group: group, total: group ? paying * 6 : n.gen * 8 + n.red * 6 };
    };
    var dayLabel = function () { return state.day === null ? '—' : fmtDate('lab', { weekday: 'short', day: 'numeric', month: 'short' }).format(days[state.day]); };
    var update = function () {
      var c = calc();
      pop($('#tDay'), dayLabel());
      pop($('#tTime'), state.time || '—');
      pop($('#tLang'), state.tl);
      pop($('#tPeople'), String(c.people));
      pop($('#tTotal'), c.total ? c.total + ' €' : (c.people ? t('free') : '—'));
      $('#groupNote').textContent = c.group ? t('group') : '';
      var tk = $('.ticket'); tk.classList.remove('shine'); void tk.offsetWidth; tk.classList.add('shine');
    };
    var nameIn = $('#fName'), nameErr = $('#nameErr');
    nameIn.addEventListener('blur', function () { if (!nameIn.value.trim() && nameIn.dataset.t) nameErr.textContent = t('need'); });
    nameIn.addEventListener('input', function () { nameIn.dataset.t = '1'; if (nameIn.value.trim()) { nameErr.textContent = ''; nameIn.removeAttribute('aria-invalid'); } });
    var buildMail = function () {
      var c = calc(), n = state.n, lines = [t('hello'), '', t('day') + ': ' + fmtDate('long', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(days[state.day]), t('time') + ': ' + state.time, t('tl') + ': ' + state.tl, t('people') + ': ' + c.people + ' (' + n.gen + ' ' + t('gen') + ', ' + n.red + ' ' + t('red') + ', ' + n.kid + ' ' + t('kid') + ')', t('est') + ': ' + (c.total ? c.total + ' €' : t('free')), '', t('name') + ': ' + nameIn.value.trim()];
      var note = $('#fNote').value.trim(); if (note) lines.push(t('note') + ': ' + note);
      lines.push('', t('bye'), '', '— ' + t('from'));
      return 'mailto:museovidriomalaga@gmail.com?subject=' + encodeURIComponent(t('subj') + ' · ' + dayLabel() + ' ' + state.time) + '&body=' + encodeURIComponent(lines.join('\n'));
    };
    window.__mvBuildMail = buildMail; // used by the demo's own tests
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var c = calc();
      if (state.day === null) { toast(t('pickDay')); daysEl.querySelector('button:not(:disabled)').focus(); return; }
      if (!state.time) { toast(t('pickTime')); var tb = timesEl.querySelector('button:not(:disabled)'); if (tb) tb.focus(); return; }
      if (!c.people) { toast(t('nobody')); return; }
      if (!nameIn.value.trim()) { nameErr.textContent = t('need'); nameIn.setAttribute('aria-invalid', 'true'); nameIn.focus(); return; }
      // the glass ticket chimes into place, then the mail app opens
      var wrap = $('.ticket-wrap'), href = buildMail();
      wrap.classList.remove('chime'); void wrap.offsetWidth; wrap.classList.add('chime');
      chime();
      setTimeout(function () { window.location.href = href; toast(t('ready')); }, RM ? 0 : 900);
    });
    // pick the first open day without rendering twice
    for (var fi = 0; fi < days.length; fi++) { var ds = dayState(days[fi]); if (ds !== 'mon' && ds !== 'aug' && ds !== 'hol' && !(fi === 0 && new Date().getHours() * 60 + new Date().getMinutes() >= (ds === 'short' ? 840 : 1080))) { firstOpen = fi; break; } }
    if (firstOpen !== null) state.day = firstOpen;
    renderDays(); renderTimes();
    update();
    langHooks.push(function () { renderDays(); update(); if (nameErr.textContent) nameErr.textContent = t('need'); });
  };
  if (form) { var bio = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { bio.disconnect(); initBooking(); } }, { rootMargin: '1000px 0px' }); bio.observe(form); }

  /* ---------- a soft glass chime (Web Audio, no files; only on the visitor's own click) ---------- */
  var actx = null;
  function chime() {
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      var now = actx.currentTime, out = actx.createGain(); out.gain.value = 0.05; out.connect(actx.destination);
      [[1568, 1], [2349, .6], [3136, .35], [4699, .18]].forEach(function (p, i) {
        var o = actx.createOscillator(), g = actx.createGain();
        o.type = 'sine'; o.frequency.value = p[0];
        g.gain.setValueAtTime(0, now + i * .012); g.gain.linearRampToValueAtTime(p[1], now + i * .012 + .006); g.gain.exponentialRampToValueAtTime(0.0001, now + 1.6 - i * .2);
        o.connect(g); g.connect(out); o.start(now + i * .012); o.stop(now + 1.7);
      });
    } catch (e) {}
  }

  /* ---------- micro-interactions ---------- */
  // hero content drifts up and fades as you leave it
  var heroInner = $('.hero-inner'), hTick = false;
  if (!RM) window.addEventListener('scroll', function () {
    if (hTick || scrollY > innerHeight * 1.2) return; hTick = true;
    requestAnimationFrame(function () { hTick = false; var k = Math.min(1, scrollY / innerHeight); heroInner.style.transform = 'translate3d(0,' + (-k * 70).toFixed(1) + 'px,0)'; heroInner.style.opacity = (1 - k * 1.15).toFixed(3); });
  }, { passive: true });
  // a small lens cursor on desktop (magnifies photographs slightly)
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    var lens = doc.createElement('div'); lens.className = 'lens'; lens.setAttribute('aria-hidden', 'true'); lens.innerHTML = '<i></i>';
    doc.body.appendChild(lens); root.classList.add('has-lens');
    var lx = -100, ly = -100, tx = -100, ty = -100, lRun = false, magImg = null, MAG = 1.7, LR = 30;
    var lensLoop = function () {
      var k = RM ? 1 : 0.32; lx += (tx - lx) * k; ly += (ty - ly) * k;
      lens.style.transform = 'translate3d(' + (lx - LR).toFixed(1) + 'px,' + (ly - LR).toFixed(1) + 'px,0)';
      if (magImg) {
        var r = magImg.getBoundingClientRect(), nw = magImg.naturalWidth || r.width, nh = magImg.naturalHeight || r.height;
        var sc = Math.max(r.width / nw, r.height / nh), dw = nw * sc, dh = nh * sc, ox = (r.width - dw) / 2, oy = (r.height - dh) / 2;
        lens.style.backgroundSize = (dw * MAG).toFixed(0) + 'px ' + (dh * MAG).toFixed(0) + 'px';
        lens.style.backgroundPosition = (-((lx - r.left - ox) * MAG - LR)).toFixed(1) + 'px ' + (-((ly - r.top - oy) * MAG - LR)).toFixed(1) + 'px';
      }
      if (Math.abs(tx - lx) + Math.abs(ty - ly) > 0.3) requestAnimationFrame(lensLoop); else lRun = false;
    };
    window.addEventListener('pointermove', function (e) {
      if (e.pointerType !== 'mouse') return;
      tx = e.clientX; ty = e.clientY;
      var el = e.target;
      var off = el.closest && el.closest('input:not([type=range]), textarea, select');
      lens.classList.toggle('off', !!off);
      lens.classList.toggle('link', !off && !!(el.closest && el.closest('a, button, input[type=range], label')));
      var img = el.closest && el.closest('.piece .frame, .room-media') ? (el.closest('.piece .frame, .room-media').querySelector('img')) : null;
      if (img !== magImg) { magImg = img; lens.classList.toggle('mag', !!img); lens.style.backgroundImage = img ? 'url("' + (img.currentSrc || img.src) + '")' : ''; }
      lens.classList.add('on');
      if (!lRun) { lRun = true; requestAnimationFrame(lensLoop); }
    }, { passive: true });
    doc.addEventListener('mouseleave', function () { lens.classList.remove('on'); });
    window.addEventListener('blur', function () { lens.classList.remove('on'); });
  }

  // header progress hairline
  var prog = $('#prog'), pTick = false;
  var docH = 0, measure = function () { docH = root.scrollHeight - innerHeight; };
  if (window.ResizeObserver) new ResizeObserver(measure).observe(doc.body); window.addEventListener('resize', measure, { passive: true });
  var onProg = function () { pTick = false; if (!docH) measure(); prog.style.transform = 'scaleX(' + (docH > 0 ? Math.min(1, scrollY / docH) : 0).toFixed(4) + ')'; };
  window.addEventListener('scroll', function () { if (!pTick) { pTick = true; requestAnimationFrame(onProg); } }, { passive: true });
  requestAnimationFrame(onProg);
  // current section in the nav
  var navLinks = $$('.nav a'), secMap = {};
  navLinks.forEach(function (a) { var el = $(a.getAttribute('href')); if (el) secMap[el.id] = a; });
  var nio = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { navLinks.forEach(function (a) { a.setAttribute('aria-current', 'false'); }); secMap[e.target.id].setAttribute('aria-current', 'true'); } }); }, { rootMargin: '-45% 0px -50% 0px' });
  Object.keys(secMap).forEach(function (id) { nio.observe($('#' + id)); });
  // gentle tilt on cards and the ticket (mouse only)
  if (!RM) $$('.card, .ticket').forEach(function (el) {
    var max = el.classList.contains('ticket') ? 4 : 6;
    el.addEventListener('pointermove', function (e) { if (e.pointerType !== 'mouse') return; var r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5; el.style.transform = 'perspective(900px) rotateX(' + (-y * max).toFixed(2) + 'deg) rotateY(' + (x * max).toFixed(2) + 'deg) translateY(-3px)'; });
    el.addEventListener('pointerleave', function () { el.style.transform = ''; });
  });

  /* ---------- saved language ---------- */
  var saved = null; try { saved = localStorage.getItem('mv-lang'); } catch (e) {}
  if (saved && saved !== 'es' && STR[saved]) setLang(saved);
})();
