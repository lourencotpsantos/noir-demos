/* Foto Alejandro · Noir Digital concept · vanilla JS, no libraries */
(function () {
  'use strict';
  var doc = document, root = doc.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var WA = '34607323117', MAIL = 'info@fotoalejandromarbella.com';
  if (!reduce) root.classList.add('motion');
  var $ = function (s, c) { return (c || doc).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); };
  var clamp = function (v, a, b) { return v < a ? a : v > b ? b : v; };
  var smooth = function (a, b, v) { var t = clamp((v - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };

  /* ---------------- language ---------------- */
  var lang = 'es';
  var T = {
    es: {
      stages: ['Revelador', 'Baño de paro', 'Fijador', 'Lavado', 'Lista'],
      types: { bodas: 'Boda', embarazo: 'Embarazo', familia: 'Familia', mascotas: 'Mascota', books: 'Book', empresa: 'Empresa / web', eventos: 'Evento' },
      len: { '1h': 'Aprox. 1 h', '2h': 'Aprox. 2 h', half: 'Media jornada', full: 'Jornada completa' },
      where: { studio: 'En el estudio', outdoor: 'Exterior', venue: 'En casa o en tu evento' },
      slot: { am: 'mañana', pm: 'tarde (con cita)', any: 'franja flexible' },
      finish: { gloss: 'brillo', matte: 'mate', satin: 'satinado', canvas: 'lienzo' },
      frame: { none: 'sin marco', black: 'marco negro', oak: 'marco de roble', white: 'marco blanco con paspartú' },
      chapters: { bodas: 'Bodas', embarazo: 'Embarazo', familia: 'Familia', mascotas: 'Tu mascota y tú', books: 'Books' },
      wdNames: ['Preparativos', 'Ceremonia', 'Hora dorada', 'Fiesta'], view: 'Ver<br>historia', lampOn: 'Encender la lámpara', lampOff: 'Apagar la lámpara', hidePrev: 'Ocultar vista previa', showPrev: 'Mostrar vista previa',
      wallDesc: function (d) { return 'Vista previa: copia de ' + d.size + ' cm, acabado ' + d.finish + ', ' + d.frame + ', colgada sobre un mueble de unos 150 cm.'; },
      bookThis: 'Reservar esta sesión', pause: 'Pausar', play: 'Reanudar', own: 'tu propia foto (la adjunto aquí)',
      waBook: function (d) { return 'Hola Foto Alejandro, me gustaría reservar una sesión.\n· Tipo: ' + d.type + '\n· Duración: ' + d.len + '\n· Lugar: ' + d.where + '\n· Fecha preferida: ' + (d.date || 'por decidir') + ', ' + d.slot + (d.name ? '\n· Nombre: ' + d.name : '') + (d.note ? '\n· Nota: ' + d.note : '') + '\n¿Qué disponibilidad y precio tenéis?'; },
      mailSubj: 'Reserva de sesión',
      waEx: 'Hola, quiero hacerme fotos de pasaporte/TIE. ¿A qué hora puedo pasar hoy?',
      waLab: function (d) { return 'Hola Foto Alejandro, quiero pedir copias:\n· Tamaño: ' + d.size + ' cm\n· Acabado: ' + d.finish + '\n· ' + d.frame + '\n· Copias: ' + d.qty + '\n· Foto: ' + d.photo + '\n¿Precio y plazo?'; }
    },
    en: {
      stages: ['Developer', 'Stop bath', 'Fixer', 'Wash', 'Ready'],
      types: { bodas: 'Wedding', embarazo: 'Maternity', familia: 'Family', mascotas: 'Pet', books: 'Portfolio book', empresa: 'Business / web', eventos: 'Event' },
      len: { '1h': 'About 1 h', '2h': 'About 2 h', half: 'Half day', full: 'Full day' },
      where: { studio: 'In the studio', outdoor: 'Outdoors', venue: 'At home or your venue' },
      slot: { am: 'morning', pm: 'afternoon (by appointment)', any: 'flexible time' },
      finish: { gloss: 'gloss', matte: 'matte', satin: 'lustre', canvas: 'canvas' },
      frame: { none: 'no frame', black: 'black frame', oak: 'oak frame', white: 'white frame with mount' },
      chapters: { bodas: 'Weddings', embarazo: 'Maternity', familia: 'Family', mascotas: 'You & your pet', books: 'Portfolio books' },
      wdNames: ['Getting ready', 'Ceremony', 'Golden hour', 'Party'], view: 'View<br>story', lampOn: 'Turn on the lamp', lampOff: 'Turn off the lamp', hidePrev: 'Hide preview', showPrev: 'Show preview',
      wallDesc: function (d) { return 'Preview: ' + d.size + ' cm print, ' + d.finish + ' finish, ' + d.frame + ', hung above a sideboard of about 150 cm.'; },
      bookThis: 'Book this session', pause: 'Pause', play: 'Resume', own: 'my own photo (attached here)',
      waBook: function (d) { return 'Hello Foto Alejandro, I would like to book a session.\n· Type: ' + d.type + '\n· Length: ' + d.len + '\n· Where: ' + d.where + '\n· Preferred date: ' + (d.date || 'to be decided') + ', ' + d.slot + (d.name ? '\n· Name: ' + d.name : '') + (d.note ? '\n· Note: ' + d.note : '') + '\nWhat availability and price do you have?'; },
      mailSubj: 'Session booking',
      waEx: 'Hello, I would like passport/TIE photos. What time can I come in today?',
      waLab: function (d) { return 'Hello Foto Alejandro, I would like to order prints:\n· Size: ' + d.size + ' cm\n· Finish: ' + d.finish + '\n· ' + d.frame + '\n· Copies: ' + d.qty + '\n· Photo: ' + d.photo + '\nPrice and turnaround?'; }
    }
  };
  var swapAttr = function (el, attr, key) {
    if (!el.hasAttribute('data-es-' + attr)) el.setAttribute('data-es-' + attr, el.getAttribute(attr) || '');
    el.setAttribute(attr, lang === 'en' ? el.getAttribute(key) : el.getAttribute('data-es-' + attr));
  };
  function setLang(l) {
    lang = l;
    root.lang = l;
    $$('[data-en]').forEach(function (el) {
      if (!el.hasAttribute('data-es')) el.setAttribute('data-es', el.innerHTML);
      el.innerHTML = l === 'en' ? el.getAttribute('data-en') : el.getAttribute('data-es');
    });
    $$('[data-en-alt]').forEach(function (el) { swapAttr(el, 'alt', 'data-en-alt'); });
    $$('[data-en-aria-label]').forEach(function (el) { swapAttr(el, 'aria-label', 'data-en-aria-label'); });
    $$('.lang-btn').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.lang === l)); });
    try { localStorage.setItem('fa-lang', l); } catch (e) {}
    lastStage = -1; renderHero(true);
    if (wdLastCh >= 0) wdSetChapter(wdLastCh, true);
    if (cursorEl) cursorEl.innerHTML = T[l].view;
    updateBooking(); updateLab(); updateExpress();
    if (sv.open) showSlide(cur.i, true);
  }
  $$('.lang-btn').forEach(function (b) { b.addEventListener('click', function () { setLang(b.dataset.lang); }); });

  /* ---------------- header ---------------- */
  var hdr = $('#hdr');
  var onScrollHdr = function () { hdr.classList.toggle('solid', window.scrollY > 40); };
  window.addEventListener('scroll', onScrollHdr, { passive: true });
  onScrollHdr();

  /* ---------------- 1. darkroom hero: develop, lift, drip, clip to the line ---------------- */
  var dh = $('.dh'), stage = $('.dh-stage'), print = $('#dhPrint');
  var L = { paper: $('.dh-paper'), red: $('.dh-red'), mono: $('.dh-mono-p'), room: $('.dh-room'), sheen: $('.dh-sheen'), cue: $('.dh-cue'), bar: $('#dhBar'), stage: $('#dhStage'), time: $('#dhTime') };
  var hl = $('#hl'), hlCards = $$('.hl-card'), slot0 = $('.hl-slot0 .hl-ph'), hlStr = $('.hl-string'), hlCap = $('.hl-cap'), hlMore = $('.hl-more');
  var drip = $('.dh-drip'), dripI = $('.dh-drip i'), dCopy = $('.dh-copy'), meter = $('.dh-meter'), dActs = $('.dh-actions'), hlCta = $('.hl-cta'), deskMQ = window.matchMedia('(min-width: 900px)'), actsHidden = false;
  var heroOn = true, ticking = false, pIntro = 0, lastStage = -1, lastSec = -1, base = null, landed = false, settled = false;
  function scrollP() {
    var r = dh.getBoundingClientRect(), span = r.height - window.innerHeight;
    return span > 0 ? clamp(-r.top / span, 0, 1) : 1;
  }
  function measure() {
    var t = print.style.transform; print.style.transform = 'none';
    var r = print.getBoundingClientRect(), sr = stage.getBoundingClientRect();
    print.style.transform = t;
    base = { x: r.left - sr.left + r.width / 2, y: r.top - sr.top + r.height / 2, w: r.width, h: r.height, b: parseFloat(getComputedStyle(print).paddingLeft) || 10 };
    drip.style.left = (base.x - 4) + 'px';
    drip.style.top = (base.y + base.h / 2 - 3) + 'px';
  }
  var fmt = function (n) { return n.toFixed(3); };
  function renderHero(force) {
    var p = reduce ? 1 : Math.max(pIntro, scrollP());
    var q = reduce ? 1 : clamp(p / 0.5, 0, 1);
    if (!reduce) {
      if (!base) measure();
      L.paper.style.opacity = fmt(1 - smooth(0.03, 0.42, q));
      L.red.style.opacity = fmt(0.5 * (1 - smooth(0.5, 0.78, q)));
      L.mono.style.opacity = fmt(1 - smooth(0.56, 0.9, q));
      L.room.style.opacity = fmt(1 - 0.82 * smooth(0.5, 0.85, q));
      L.sheen.style.opacity = fmt(1 - smooth(0.42, 0.55, q));
      L.sheen.style.setProperty('--sy', (-100 + ((q * 2.6) % 1) * 370).toFixed(1) + '%');
      L.cue.style.opacity = fmt(1 - smooth(0, 0.05, p));
      L.bar.style.transform = 'scaleX(' + fmt(q) + ')';
      meter.style.opacity = fmt(1 - smooth(0.52, 0.58, p));
      dCopy.style.opacity = fmt(1 - smooth(0.56, 0.64, p));
      dCopy.style.transform = 'translateY(' + (-24 * smooth(0.56, 0.64, p)).toFixed(1) + 'px)';
      // develop, then lift out of the tray
      var lift = smooth(0.4, 0.95, q), out = smooth(0.5, 0.57, p);
      var sc = 0.9 + 0.1 * lift, rot = (1 - lift) * -1.6, ty = -22 * out, tx = 0;
      // fly to the line
      var t = smooth(0.62, 0.8, p);
      if (t > 0) {
        var r = slot0.getBoundingClientRect(), sr = stage.getBoundingClientRect();
        var s = r.width / base.w;
        hl.style.setProperty('--cb', (base.b * s).toFixed(2) + 'px');
        tx = (r.left - sr.left + r.width / 2 - base.x) * t;
        ty = ty * (1 - t) + (r.top - sr.top + r.height / 2 - base.y) * t;
        sc = sc + (s - sc) * t;
        rot = rot * (1 - t);
      }
      print.style.transform = 'translate(' + tx.toFixed(1) + 'px,' + ty.toFixed(1) + 'px) scale(' + sc.toFixed(4) + ') rotate(' + rot.toFixed(3) + 'deg)';
      // a single drip falls from the bottom edge
      var dA = smooth(0.54, 0.565, p), dS = smooth(0.565, 0.6, p), dF = smooth(0.6, 0.66, p);
      drip.style.opacity = fmt(dA * (1 - smooth(0.635, 0.66, p)));
      drip.style.transform = 'translateY(' + (-22 * out + dF * dF * window.innerHeight * 0.3).toFixed(1) + 'px)';
      dripI.style.transform = 'scaleY(' + (0.45 + 0.85 * dS - 0.3 * dF).toFixed(3) + ')';
      // the line and the other prints
      hlStr.style.transform = 'scaleX(' + fmt(smooth(0.6, 0.72, p)) + ')';
      hlCap.style.opacity = fmt(smooth(0.8, 0.9, p));
      hlMore.style.opacity = fmt(smooth(0.84, 0.94, p));
      hlCta.style.opacity = fmt(smooth(0.86, 0.95, p));
      var ao = deskMQ.matches ? 1 - smooth(0.58, 0.66, p) : 1;
      dActs.style.opacity = fmt(ao);
      if ((ao < 0.05) !== actsHidden) { actsHidden = ao < 0.05; dActs.inert = actsHidden; }
      var isLanded = p >= 0.8;
      if (isLanded !== landed) { landed = isLanded; hl.classList.toggle('landed', landed); print.style.opacity = landed ? '0' : ''; }
      hlCards[0].style.opacity = landed ? '1' : '0';
      hl.inert = !landed;
      var isSettled = p >= 0.88;
      if (isSettled !== settled) { settled = isSettled; hl.classList.toggle('settled', settled); }
      for (var k = 1; k < hlCards.length; k++) {
        var e = smooth(0.66 + 0.03 * k, 0.76 + 0.03 * k, p), c = hlCards[k];
        c.style.opacity = fmt(e);
        c.style.transform = settled ? '' : 'translateY(' + (-38 * (1 - e)).toFixed(1) + 'px) rotate(' + ((1 - e) * (k % 2 ? 7 : -6)).toFixed(2) + 'deg)';
      }
    }
    var st = q < 0.42 ? 0 : q < 0.55 ? 1 : q < 0.86 ? 2 : q < 0.98 ? 3 : 4;
    if (st !== lastStage || force) { lastStage = st; L.stage.textContent = T[lang].stages[st]; }
    var sec = Math.round(q * 150);
    if (sec !== lastSec || force) { lastSec = sec; L.time.textContent = ('0' + Math.floor(sec / 60)).slice(-2) + ':' + ('0' + (sec % 60)).slice(-2); }
  }
  function heroTick() { ticking = false; if (heroOn) renderHero(); }
  var askHero = function () { if (heroOn && !ticking) { ticking = true; requestAnimationFrame(heroTick); } };
  if (!reduce) {
    new IntersectionObserver(function (e) { heroOn = e[0].isIntersecting; dh.classList.toggle('off', !heroOn); askHero(); }).observe(dh);
    window.addEventListener('scroll', askHero, { passive: true });
    $('#hlScroll').addEventListener('scroll', askHero, { passive: true });
    window.addEventListener('resize', function () { base = null; askHero(); }, { passive: true });
    requestAnimationFrame(function () { renderHero(); });
    if (window.scrollY < 20) {
      var t0 = 0, dur = 2000;
      var introStep = function (t) {
        if (!t0) t0 = t;
        var k = clamp((t - t0) / dur, 0, 1);
        pIntro = 0.15 * (1 - Math.pow(1 - k, 3));
        if (heroOn) renderHero();
        if (k < 1 && heroOn) requestAnimationFrame(introStep);
      };
      setTimeout(function () { requestAnimationFrame(introStep); }, 350);
    }
  } else {
    renderHero(true);
  }

  /* ---------------- 1b. a wedding day: pinned film strip ---------------- */
  var wd = $('.wd'), wdStrip = $('#wdStrip'), wdFilm = $('#wdFilm'), wdFrames = $$('.wd-f'), wdName = $('#wdName'), wdTime = $('#wdTime'), wdProg = $$('.wd-prog li');
  var wdOn = false, wdTicking = false, wdMax = 0, wdW = 0, wdCenters = [], wdWidths = [], wdLastCh = -1;
  var WD_TIMES = ['10:30', '13:00', '19:40', '22:30'];
  function wdMeasure() {
    wdW = wdFilm.clientWidth;
    wdMax = Math.max(0, wdStrip.scrollWidth - wdW);
    wdCenters = wdFrames.map(function (f) { return f.offsetLeft + f.offsetWidth / 2; });
    wdWidths = wdFrames.map(function (f) { return f.offsetWidth; });
  }
  function wdSetChapter(ch, force) {
    if (ch === wdLastCh && !force) return;
    var first = wdLastCh < 0 || force;
    wdLastCh = ch;
    var apply = function () { wdName.textContent = T[lang].wdNames[ch]; wdTime.textContent = WD_TIMES[ch]; wdName.classList.remove('swap'); };
    if (first || reduce) apply(); else { wdName.classList.add('swap'); setTimeout(apply, 220); }
    wdProg.forEach(function (li, i) { li.classList.toggle('on', i === ch); li.classList.toggle('done', i < ch); });
    wdFrames.forEach(function (f) { f.classList.toggle('dim', +f.dataset.ch !== ch); });
  }
  function wdRender() {
    wdTicking = false;
    if (!wdW) wdMeasure();
    var r = wd.getBoundingClientRect(), span = r.height - window.innerHeight;
    var p = span > 0 ? clamp(-r.top / span, 0, 1) : 0;
    var x = p * wdMax;
    wdStrip.style.transform = 'translate3d(' + (-x).toFixed(1) + 'px,0,0)';
    var cx = x + wdW / 2, best = 0, bd = 1e9;
    for (var i = 0; i < wdCenters.length; i++) { var d = Math.abs(wdCenters[i] - cx); if (d < bd) { bd = d; best = i; } }
    wdSetChapter(+wdFrames[best].dataset.ch);
    wdFrames.forEach(function (f, i) { if (f.querySelector('.wd-circle')) f.classList.toggle('on', cx > wdCenters[i] - wdWidths[i] * 0.35); });
  }
  if (!reduce) {
    new IntersectionObserver(function (e) { wdOn = e[0].isIntersecting; if (wdOn && !wdTicking) { wdTicking = true; requestAnimationFrame(wdRender); } }).observe(wd);
    window.addEventListener('scroll', function () { if (wdOn && !wdTicking) { wdTicking = true; requestAnimationFrame(wdRender); } }, { passive: true });
    window.addEventListener('resize', function () { wdW = 0; if (wdOn) requestAnimationFrame(wdRender); }, { passive: true });
  }

  /* ---------------- reveal ---------------- */
  if ('IntersectionObserver' in window && !reduce) {
    var rio = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); rio.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    $$('.reveal').forEach(function (el) { rio.observe(el); });
  } else { $$('.reveal').forEach(function (el) { el.classList.add('in'); }); }

  /* ---------------- 2. story viewer ---------------- */
  var S = {
    bodas: [
      ['bodas-1', 900, 1350, 'El velo, con la última luz.', 'The veil, in the last light.', 'Novios abrazados bajo el velo al atardecer', 'Couple embracing under the veil at sunset'],
      ['bodas-2', 900, 600, 'Un instante entre el viento y el velo.', 'A moment between wind and veil.', 'Novios besándose con el velo al viento', 'Couple kissing with the veil in the wind'],
      ['bodas-3', 900, 600, 'Paseo por la orilla.', 'A walk along the shore.', 'Novios paseando por la orilla al atardecer', 'Couple walking along the shore at sunset'],
      ['bodas-4', 900, 525, 'En blanco y negro, para siempre.', 'In black and white, forever.', 'Novios en blanco y negro junto al mar', 'Black-and-white couple by the sea'],
      ['bodas-5', 900, 601, 'El primer baile, a contraluz.', 'First dance, against the light.', 'Silueta de los novios bailando al atardecer', 'Silhouette of the couple dancing at sunset'],
      ['bodas-6', 900, 1350, 'Las miradas que nadie más vio.', 'The glances nobody else saw.', 'Novios en blanco y negro mirándose', 'Black-and-white couple looking at each other'],
      ['bodas-7', 900, 1348, 'Hora dorada.', 'Golden hour.', 'Novios besándose bajo el velo a contraluz', 'Couple kissing under the veil, backlit']
    ],
    embarazo: [
      ['embarazo-1', 900, 1350, 'Esperando, junto al mar.', 'Waiting, by the sea.', 'Mujer embarazada junto al mar', 'Pregnant woman by the sea'],
      ['embarazo-2', 900, 1083, 'Silueta.', 'Silhouette.', 'Silueta de una mujer embarazada sobre fondo negro', 'Silhouette of a pregnant woman on black'],
      ['embarazo-3', 900, 600, 'Manos que ya abrazan.', 'Hands already holding on.', 'Manos sobre una barriga de embarazo, en blanco y negro', 'Hands on a pregnant belly, black and white'],
      ['embarazo-4', 900, 1350, 'Dos, antes de ser tres.', 'Two, before three.', 'Pareja esperando un bebé en la playa', 'Expecting couple on the beach'],
      ['embarazo-5', 900, 1350, 'Luz natural, sin prisa.', 'Natural light, no rush.', 'Mujer embarazada sujetando su barriga', 'Pregnant woman holding her belly']
    ],
    familia: [
      ['familia-1', 900, 1350, 'Todos en la foto, por fin.', 'Everyone in the picture, at last.', 'Familia posando en la playa', 'Family posing on the beach'],
      ['familia-2', 900, 600, 'De la mano, al atardecer.', 'Hand in hand, at sunset.', 'Familia caminando de la mano al atardecer', 'Family walking hand in hand at sunset'],
      ['familia-3', 900, 1350, 'Los pequeños protagonistas.', 'The little stars.', 'Familia numerosa en la playa', 'Large family on the beach'],
      ['familia-4', 900, 600, 'Risas en la arena.', 'Laughter in the sand.', 'Familia sentada en la arena', 'Family sitting on the sand'],
      ['familia-5', 900, 1350, 'Un retrato para colgar en casa.', 'A portrait to hang at home.', 'Familia en un camino de arena al atardecer', 'Family on a sandy path at sunset']
    ],
    mascotas: [
      ['mascotas-1', 900, 600, 'Mirada de estudio.', 'Studio gaze.', 'Perro marrón sobre fondo negro', 'Brown dog on a black backdrop'],
      ['mascotas-2', 900, 1125, 'Fondo negro, pelo blanco.', 'Black backdrop, white coat.', 'Terrier blanco sobre fondo negro', 'White terrier on a black backdrop'],
      ['mascotas-3', 900, 1125, 'Una sonrisa de verdad.', 'A real smile.', 'Perro blanco sonriendo', 'White dog smiling'],
      ['mascotas-4', 900, 1193, 'El mejor amigo, en color.', 'Best friend, in colour.', 'Golden retriever sobre fondo azul', 'Golden retriever on a blue backdrop'],
      ['mascotas-5', 900, 600, 'Perfil de campeón.', 'A champion’s profile.', 'Labrador chocolate de perfil sobre fondo azul', 'Chocolate labrador in profile on blue']
    ],
    books: [
      ['books-1', 900, 1125, 'Luz suave, mirada firme.', 'Soft light, steady gaze.', 'Retrato de estudio de una mujer', 'Studio portrait of a woman'],
      ['books-2', 900, 1350, 'Para tu book personal o profesional.', 'For your personal or professional book.', 'Retrato de una mujer con abrigo', 'Portrait of a woman in a coat'],
      ['books-3', 900, 1350, 'Claroscuro.', 'Chiaroscuro.', 'Retrato en claroscuro sobre fondo negro', 'Chiaroscuro portrait on black'],
      ['books-4', 900, 702, 'Naturalidad.', 'Naturalness.', 'Retrato en blanco y negro de una mujer sonriendo', 'Black-and-white portrait of a smiling woman'],
      ['books-5', 900, 591, 'Fondo oscuro, retrato limpio.', 'Dark backdrop, clean portrait.', 'Retrato de una mujer sobre fondo oscuro', 'Portrait of a woman on a dark backdrop']
    ]
  };
  var order = ['bodas', 'embarazo', 'familia', 'mascotas', 'books'];
  var sv = $('#sv'), svImg = $('#svImg'), svBars = $('#svBars'), svCap = $('#svCap'), svTitle = $('#svTitle'), svPause = $('#svPause');
  var cur = { cat: 'bodas', i: 0 }, opener = null, userPaused = false;
  var big = function () { return Math.min(window.innerWidth, 1400) * (window.devicePixelRatio || 1) > 1000; };
  var wide = function (it) { return it[1] / it[2] > (window.innerWidth / window.innerHeight) * 1.2; };
  var srcOf = function (it) { return 'img/s-' + it[0] + '-' + (big() || wide(it) ? 1600 : 900) + '.webp'; };
  function fitSlide(it) {
    svImg.classList.remove('pan');
    if (wide(it)) {
      var w = window.innerHeight * it[1] / it[2], pan = Math.max(0, w - window.innerWidth), right = cur.i % 2 === 0;
      svImg.style.setProperty('--from', (right ? 0 : -pan).toFixed(0) + 'px');
      svImg.style.setProperty('--to', (right ? -pan : 0).toFixed(0) + 'px');
      void svImg.offsetWidth;
      svImg.classList.add('pan');
      sv.style.setProperty('--dur', '7s');
    } else { sv.style.setProperty('--dur', '5s'); }
  }
  function buildBars() {
    svBars.innerHTML = '';
    S[cur.cat].forEach(function () { var s = doc.createElement('span'); s.appendChild(doc.createElement('i')); svBars.appendChild(s); });
  }
  function showSlide(i, keepImg) {
    var list = S[cur.cat];
    cur.i = i;
    var it = list[i], en = lang === 'en';
    svTitle.textContent = T[lang].chapters[cur.cat];
    svCap.textContent = en ? it[4] : it[3];
    svImg.alt = (en ? it[6] : it[5]) + (en ? ' (illustrative image)' : ' (imagen ilustrativa)');
    $$('span', svBars).forEach(function (b, k) {
      b.className = k < i ? 'done' : '';
      var ii = b.firstChild; ii.style.animation = 'none'; void ii.offsetWidth; ii.style.animation = '';
    });
    if (!keepImg) {
      svImg.classList.remove('in');
      fitSlide(it);
      var src = srcOf(it);
      svImg.onload = function () { svImg.classList.add('in'); startBar(); };
      svImg.src = src;
      if (svImg.complete && svImg.naturalWidth) { svImg.classList.add('in'); startBar(); }
      var nx = list[i + 1]; if (nx) { var pre = new Image(); pre.src = srcOf(nx); }
    } else { startBar(); }
  }
  function startBar() {
    var b = svBars.children[cur.i]; if (!b) return;
    b.className = 'on';
  }
  var iris = $('#svIris'), irisBusy = false;
  function shutter(fn) {
    if (reduce || irisBusy) { fn(); return; }
    irisBusy = true;
    iris.classList.toggle('opening', false); iris.classList.add('run'); void iris.offsetWidth;
    iris.classList.add('closed');
    setTimeout(function () {
      fn();
      var open = function () {
        iris.classList.add('opening'); iris.classList.toggle('closed', false);
        setTimeout(function () { iris.classList.toggle('run', false); iris.classList.toggle('opening', false); irisBusy = false; }, 400);
      };
      if (svImg.complete && svImg.naturalWidth) setTimeout(open, 40);
      else { var done = false; var once = function () { if (done) return; done = true; open(); }; svImg.addEventListener('load', once, { once: true }); setTimeout(once, 600); }
    }, 270);
  }
  function next() {
    var list = S[cur.cat];
    if (cur.i < list.length - 1) return showSlide(cur.i + 1);
    var k = order.indexOf(cur.cat);
    if (k < order.length - 1) { cur.cat = order[k + 1]; buildBars(); return showSlide(0); }
    closeSv();
  }
  function prev() {
    if (cur.i > 0) return showSlide(cur.i - 1);
    var k = order.indexOf(cur.cat);
    if (k > 0) { cur.cat = order[k - 1]; buildBars(); return showSlide(S[cur.cat].length - 1); }
    showSlide(0);
  }
  function setPaused(v) {
    sv.classList.toggle('paused', v);
  }
  function openSv(cat, btn) {
    opener = btn; cur.cat = cat; userPaused = false; setPaused(false);
    svPause.setAttribute('aria-label', T[lang].pause);
    buildBars();
    root.style.overflow = 'hidden';
    sv.showModal();
    showSlide(0);
  }
  function closeSv() { if (sv.open) sv.close(); }
  sv.addEventListener('close', function () {
    root.style.overflow = ''; svImg.removeAttribute('src');
    if (opener) opener.focus();
  });
  svBars.addEventListener('animationend', function (e) { if (e.target.parentNode === svBars.children[cur.i]) goNext(); });
  $$('[data-story]').forEach(function (b) { b.addEventListener('click', function () { openSv(b.dataset.story, b); }); });
  $('#svClose').addEventListener('click', closeSv);
  svPause.addEventListener('click', function () {
    userPaused = !userPaused; setPaused(userPaused);
    svPause.setAttribute('aria-label', userPaused ? T[lang].play : T[lang].pause);
    svPause.innerHTML = userPaused ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5l11 7-11 7z" fill="currentColor"/></svg>' : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14M16 5v14" stroke="currentColor" stroke-width="2"/></svg>';
  });
  // tap = navigate, hold = pause, swipe = navigate / close
  var held = false, holdT = 0, sx = 0, sy = 0;
  function down(e) { sx = e.clientX; sy = e.clientY; held = false; clearTimeout(holdT); holdT = setTimeout(function () { held = true; setPaused(true); }, 260); }
  function up(e, dir) {
    clearTimeout(holdT);
    var dx = e.clientX - sx, dy = e.clientY - sy;
    if (held) { held = false; if (!userPaused) setPaused(false); return; }
    if (dy > 90 && Math.abs(dy) > Math.abs(dx)) return closeSv();
    if (Math.abs(dx) > 50) return dx < 0 ? goNext() : goPrev();
    dir();
  }
  var goNext = function () { shutter(next); }, goPrev = function () { shutter(prev); };
  [['#svPrev', goPrev], ['#svNext', goNext]].forEach(function (pair) {
    var el = $(pair[0]);
    el.addEventListener('pointerdown', down);
    el.addEventListener('pointerup', function (e) { up(e, pair[1]); });
    el.addEventListener('pointercancel', function () { clearTimeout(holdT); if (!userPaused) setPaused(false); });
    el.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pair[1](); } });
  });
  sv.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') { e.preventDefault(); goNext(); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); goPrev(); }
  });
  doc.addEventListener('visibilitychange', function () { if (sv.open) setPaused(doc.hidden || userPaused); });
  $('#svBook').addEventListener('click', function (e) {
    e.preventDefault(); var c = cur.cat; closeSv(); pickType(c);
  });

  /* ---------------- 3. retouch slider ---------------- */
  var ba = $('#ba'), baR = $('#baRange');
  var baTouched = false;
  baR.addEventListener('input', function () { baTouched = true; ba.style.setProperty('--x', baR.value); });
  var baDrag = null;
  function baSet(e) { var r = ba.getBoundingClientRect(); var x = clamp((e.clientX - r.left) / r.width * 100, 0, 100); baTouched = true; ba.style.setProperty('--x', x.toFixed(1)); baR.value = Math.round(x); }
  ba.addEventListener('pointerdown', function (e) {
    baDrag = { x: e.clientX, y: e.clientY, h: e.pointerType === 'mouse' };
    if (baDrag.h) { ba.setPointerCapture(e.pointerId); baSet(e); }
  });
  ba.addEventListener('pointermove', function (e) {
    if (!baDrag) return;
    if (!baDrag.h) {
      var dx = Math.abs(e.clientX - baDrag.x), dy = Math.abs(e.clientY - baDrag.y);
      if (dx > 6 && dx > dy) { baDrag.h = true; try { ba.setPointerCapture(e.pointerId); } catch (er) {} }
      else if (dy > 8) { baDrag = null; return; }
    }
    if (baDrag.h) baSet(e);
  });
  ba.addEventListener('pointerup', function (e) { if (baDrag && !baDrag.h && Math.abs(e.clientX - baDrag.x) < 6 && Math.abs(e.clientY - baDrag.y) < 6) baSet(e); baDrag = null; });
  ba.addEventListener('pointercancel', function () { baDrag = null; });
  if (!reduce) {
    var bio = new IntersectionObserver(function (es) {
      if (!es[0].isIntersecting) return;
      bio.disconnect();
      var t0 = 0, D = 2200;
      var step = function (t) {
        if (!t0) t0 = t;
        var k = clamp((t - t0) / D, 0, 1);
        if (baTouched || doc.activeElement === baR) return;
        var x = 50 + Math.sin(k * Math.PI * 2) * 32 * (1 - k * 0.2);
        if (k === 1) x = 50;
        ba.style.setProperty('--x', x.toFixed(1)); baR.value = Math.round(x);
        if (k < 1) requestAnimationFrame(step);
      };
      setTimeout(function () { requestAnimationFrame(step); }, 300);
    }, { threshold: 0.6 });
    bio.observe(ba);
  }

  /* ---------------- 4. booking ---------------- */
  var bk = $('#bkForm');
  var val = function (f, n) { var c = f.querySelector('[name="' + n + '"]:checked'); return c ? c.value : ''; };
  var dateIn = $('#bkDate');
  try { dateIn.min = new Date().toISOString().slice(0, 10); } catch (e) {}
  function fmtDate(v) {
    if (!v) return '';
    var d = new Date(v + 'T12:00:00');
    try { return d.toLocaleDateString(lang === 'en' ? 'en-GB' : 'es-ES', { weekday: 'short', day: 'numeric', month: 'long' }); } catch (e) { return v; }
  }
  function updateBooking() {
    var t = T[lang], d = {
      type: t.types[val(bk, 'type')], len: t.len[val(bk, 'len')], where: t.where[val(bk, 'where')],
      slot: t.slot[$('#bkSlot').value], date: fmtDate(dateIn.value), name: $('#bkName').value.trim(), note: $('#bkNote').value.trim()
    };
    $('#bkSumT').textContent = d.type;
    $('#bkSumL').innerHTML = '';
    [d.len, d.where, d.date ? d.date + ', ' + d.slot : null].forEach(function (s) {
      if (!s) return; var li = doc.createElement('li'); li.textContent = s; $('#bkSumL').appendChild(li);
    });
    var msg = t.waBook(d);
    $('#bkWa').href = 'https://wa.me/' + WA + '?text=' + encodeURIComponent(msg);
    $('#bkMail').href = 'mailto:' + MAIL + '?subject=' + encodeURIComponent(t.mailSubj + ': ' + d.type) + '&body=' + encodeURIComponent(msg);
  }
  bk.addEventListener('input', updateBooking);
  bk.addEventListener('change', updateBooking);
  bk.addEventListener('submit', function (e) { e.preventDefault(); });
  function pickType(c) {
    var r = bk.querySelector('[name="type"][value="' + c + '"]');
    if (r) { r.checked = true; updateBooking(); }
    var target = $('#sesiones');
    target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
    setTimeout(function () { if (r) r.focus({ preventScroll: true }); }, reduce ? 0 : 700);
  }
  $$('[data-book]').forEach(function (a) { a.addEventListener('click', function (e) { e.preventDefault(); pickType(a.dataset.book); }); });

  /* ---------------- express ---------------- */
  function updateExpress() { $('#exWa').href = 'https://wa.me/' + WA + '?text=' + encodeURIComponent(T[lang].waEx); }

  /* ---------------- 5. print lab ---------------- */
  var lab = $('#labForm'), pr = $('#print'), prImg = $('#printImg'), wall = $('#wall');
  var qty = 1, own = null, ownPortrait = false, lampBtn = $('#lampBtn'), wallWrap = $('#wallWrap'), wallToggle = $('#wallToggle');
  lampBtn.addEventListener('click', function () { var on = wall.classList.toggle('lamp-on'); wall.classList.add('lamp-seen'); lampBtn.setAttribute('aria-pressed', String(on)); updateLab(); });
  wallToggle.addEventListener('click', function () { var c = wallWrap.classList.toggle('collapsed'); wallToggle.setAttribute('aria-expanded', String(!c)); updateLab(); });
  function updateLab() {
    var t = T[lang];
    var phR = lab.querySelector('[name="ph"]:checked');
    var portrait = own && !phR ? ownPortrait : phR ? (+phR.dataset.h > +phR.dataset.w) : false;
    if (phR) { var s = 'img/' + phR.value + '-900.webp'; if (prImg.getAttribute('src') !== s) prImg.src = s; }
    pr.classList.toggle('portrait', portrait);
    var size = +val(lab, 'size') || 45, finish = val(lab, 'finish');
    var canvas = finish === 'canvas';
    $$('[name="frame"]', lab).forEach(function (f) { f.disabled = canvas; });
    if (canvas) { var nf = lab.querySelector('[name="frame"][value="none"]'); nf.checked = true; }
    var frame = val(lab, 'frame');
    pr.style.setProperty('--s', (size / 75).toFixed(4));
    pr.dataset.finish = finish; pr.dataset.frame = frame;
    var sizeTxt = { 15: '10×15', 30: '20×30', 45: '30×45', 60: '40×60', 75: '50×75' }[size];
    $('#qty').textContent = qty;
    $('#wallDesc').textContent = t.wallDesc({ size: sizeTxt, finish: t.finish[finish], frame: t.frame[frame] });
    var lampOn = wall.classList.contains('lamp-on');
    lampBtn.setAttribute('aria-label', lampOn ? t.lampOff : t.lampOn);
    wallToggle.textContent = wallWrap.classList.contains('collapsed') ? t.showPrev : t.hidePrev;
    var photoTxt = phR ? (lang === 'en' ? phR.nextElementSibling.getAttribute('data-en-alt') : phR.nextElementSibling.getAttribute('data-es-alt') || phR.nextElementSibling.alt) + (lang === 'en' ? ' (sample)' : ' (muestra)') : t.own;
    $('#labWa').href = 'https://wa.me/' + WA + '?text=' + encodeURIComponent(t.waLab({ size: sizeTxt, finish: t.finish[finish], frame: t.frame[frame], qty: qty, photo: photoTxt }));
  }
  lab.addEventListener('change', function (e) {
    if (e.target.name === 'ph') { own = null; $('.thumb-up').classList.remove('has'); }
    updateLab();
  });
  var qo = $('#qty');
  $$('.qty-b', lab).forEach(function (b) { b.addEventListener('click', function () { qty = clamp(qty + +b.dataset.q, 1, 99); updateLab(); qo.classList.remove('bump'); void qo.offsetWidth; qo.classList.add('bump'); }); });
  $('#labFile').addEventListener('change', function (e) {
    var f = e.target.files && e.target.files[0]; if (!f) return;
    if (own) URL.revokeObjectURL(own);
    own = URL.createObjectURL(f);
    var probe = new Image();
    probe.onload = function () {
      ownPortrait = probe.naturalHeight > probe.naturalWidth;
      $$('[name="ph"]', lab).forEach(function (r) { r.checked = false; });
      prImg.src = own;
      var up = $('.thumb-up'); up.classList.add('has');
      var ti = up.querySelector('img') || up.appendChild(doc.createElement('img'));
      ti.src = own; ti.alt = '';
      updateLab();
    };
    probe.src = own;
  });
  // move the sheen with the pointer: tilt the print to catch the light
  var gTick = false, gx = 0, gy = 0;
  wall.addEventListener('pointermove', function (e) {
    var r = wall.getBoundingClientRect();
    gx = ((e.clientX - r.left) / r.width - 0.5);
    gy = ((e.clientY - r.top) / r.height - 0.5);
    if (!gTick) { gTick = true; requestAnimationFrame(function () {
      gTick = false;
      pr.style.setProperty('--gx', (gx * 40).toFixed(1) + '%');
      pr.style.setProperty('--cx', (6 - gx * 10).toFixed(1) + 'px');
      pr.style.setProperty('--cy', (9 - gy * 6).toFixed(1) + 'px');
      wall.style.setProperty('--lx', (gx * -14).toFixed(1) + 'px');
    }); }
  });

  /* ---------------- micro: nav state, story cursor ---------------- */
  var navLinks = $$('.nav a');
  var nio = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) navLinks.forEach(function (a) { a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id); }); });
  }, { rootMargin: '-45% 0px -50% 0px' });
  ['historias', 'sesiones', 'express', 'laboratorio', 'visita'].forEach(function (id) { var el = doc.getElementById(id); if (el) nio.observe(el); });
  var cursorEl = null;
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches && !reduce) {
    cursorEl = doc.createElement('div'); cursorEl.className = 's-cursor'; cursorEl.setAttribute('aria-hidden', 'true'); cursorEl.innerHTML = T[lang].view; doc.body.appendChild(cursorEl);
    var cx0 = 0, cy0 = 0, cTick = false;
    var rail = $('#storyRail');
    rail.addEventListener('pointermove', function (e) {
      cx0 = e.clientX; cy0 = e.clientY;
      cursorEl.classList.toggle('on', !!e.target.closest('[data-story]'));
      if (!cTick) { cTick = true; requestAnimationFrame(function () { cTick = false; cursorEl.style.setProperty('--mx', cx0 + 'px'); cursorEl.style.setProperty('--my', cy0 + 'px'); }); }
    });
    rail.addEventListener('pointerleave', function () { cursorEl.classList.remove('on'); });
  }

  /* ---------------- section transitions ---------------- */
  if (!reduce) {
    var wipes = $$('.rating, .story-rail, .rt-grid .ba, .bk, .ex-visual, .lab-ctl, .vi-list');
    wipes.forEach(function (el) { el.classList.add('sec-wipe'); });
    var sio = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in-view'); sio.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -12% 0px' });
    $$('.studio, .stories, .retouch, .book, .express, .lab, .visit').concat(wipes).forEach(function (el) { sio.observe(el); });
  }

  /* ---------------- init ---------------- */
  var saved = 'es';
  try { saved = localStorage.getItem('fa-lang') || 'es'; } catch (e) {}
  if (saved === 'en') setLang('en'); else { updateBooking(); updateLab(); updateExpress(); }
  root.classList.remove('pre-en');
})();
