(function () {
  'use strict';
  var RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var clamp = function (v, a, b) { return v < a ? a : v > b ? b : v; };
  var lang = 'es';

  /* ---------- i18n ---------- */
  var MAP = [['en', 'innerHTML', 'es'], ['enAria', 'aria-label', 'esAria'], ['enAlt', 'alt', 'esAlt'], ['enPh', 'placeholder', 'esPh']];
  function setLang(l) {
    lang = l;
    document.documentElement.lang = l;
    MAP.forEach(function (m) {
      var sel = '[data-' + m[0].replace(/[A-Z]/g, function (c) { return '-' + c.toLowerCase(); }) + ']';
      $$(sel).forEach(function (el) {
        var isHtml = m[1] === 'innerHTML';
        if (el.dataset[m[2]] === undefined) el.dataset[m[2]] = isHtml ? el.innerHTML : (el.getAttribute(m[1]) || '');
        var v = l === 'en' ? el.dataset[m[0]] : el.dataset[m[2]];
        if (isHtml) el.innerHTML = v; else el.setAttribute(m[1], v);
      });
    });
    var spans = $$('#langBtn span');
    spans[0].classList.toggle('on', l === 'es');
    spans[2].classList.toggle('on', l === 'en');
    $('#cakeTitle').textContent = l === 'en' ? 'Cake preview' : 'Vista previa de la tarta';
    try { localStorage.setItem('moscatel-lang', l); } catch (e) {}
    updateSummary();
    vitLabel(true);
    if (typeof trayLabels === 'function') { trayLabels(); renderBox(); }
  }
  $('#langBtn').addEventListener('click', function () { setLang(lang === 'es' ? 'en' : 'es'); });

  /* ---------- reveal + pause off-screen ---------- */
  var revIO = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); revIO.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -10% 0px' });
  $$('.reveal').forEach(function (el) { RM ? el.classList.add('in') : revIO.observe(el); });

  var pauseIO = new IntersectionObserver(function (es) {
    es.forEach(function (e) { e.target.classList.toggle('paused', !e.isIntersecting); });
  });
  pauseIO.observe($('.hero'));
  pauseIO.observe($('.ribbon'));

  /* ---------- scroll engine (only runs while a scene is visible) ---------- */
  var scenes = [], active = new Set(), ticking = false, vh = window.innerHeight;
  function frame() {
    ticking = false;
    active.forEach(function (s) { s.update(); });
  }
  function request() { if (!ticking && active.size) { ticking = true; requestAnimationFrame(frame); } }
  window.addEventListener('scroll', request, { passive: true });
  window.addEventListener('resize', function () { vh = window.innerHeight; scenes.forEach(function (s) { s.measure && s.measure(); }); request(); });
  var sceneIO = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      var s = e.target._scene;
      if (e.isIntersecting) { if (!s.ready && s.measure) { s.measure(); s.ready = true; } active.add(s); } else { active.delete(s); }
    });
    request();
  });
  function addScene(el, s) { el._scene = s; scenes.push(s); sceneIO.observe(el); }
  function progress(el) {
    var r = el.getBoundingClientRect();
    return clamp(-r.top / Math.max(1, r.height - vh), 0, 1);
  }

  /* ---------- Vitrina ---------- */
  var vit = $('#vitrina'), track = $('#trays'), trays = $$('.tray', track), N = trays.length;
  var refl = $('.case-refl'), glint = $('.case-glint'), bar = $('#vitBar'), nowEl = $('#vitNow'), nameEl = $('#vitName'), caseEl = $('#case');
  var step = 320, caseW = 1000, cur = -1;
  function vitLabel(force) {
    var i = Math.max(cur, 0);
    if (force || true) {
      nowEl.textContent = ('0' + (i + 1)).slice(-2);
      nameEl.textContent = trays[i].querySelector('h3').textContent;
    }
  }
  var vitScene = {
    measure: function () { step = trays[1].offsetLeft - trays[0].offsetLeft; caseW = caseEl.offsetWidth; },
    update: function () {
      var p = progress(vit), raw = p * (N - 1), base = Math.floor(raw), fr = raw - base;
      var f = base + fr - Math.sin(2 * Math.PI * fr) / (2 * Math.PI);
      track.style.transform = 'translate3d(' + (-f * step).toFixed(1) + 'px,0,0)';
      for (var i = 0; i < N; i++) {
        var d = Math.abs(i - f), a = Math.min(d, 1);
        trays[i].style.transform = 'translate3d(0,' + (a * 18).toFixed(1) + 'px,0) scale(' + (1 - a * 0.12).toFixed(3) + ')';
        trays[i].style.opacity = (1 - Math.min(d, 1.6) * 0.34).toFixed(3);
      }
      glint.style.transform = 'translate3d(' + ((-0.45 + p * 1.5) * caseW).toFixed(0) + 'px,0,0)';
      refl.style.transform = 'translate3d(' + ((-0.1 - p * 0.45) * caseW).toFixed(0) + 'px,0,0)';
      bar.style.transform = 'scaleX(' + p.toFixed(4) + ')';
      var idx = Math.round(f);
      if (idx !== cur) { cur = idx; vitLabel(); }
      clearTimeout(settleT);
      settleT = setTimeout(settle, 160);
    }
  };
  var settleT, settled = -1;
  function settle() {
    if (cur === settled) return;
    if (settled > -1) trays[settled].classList.remove('settle');
    settled = cur; trays[cur].classList.add('settle');
  }
  if (!RM) addScene(vit, vitScene);
  function goTray(dir) {
    if (RM) { track.scrollBy({ left: dir * (trays[1].offsetLeft - trays[0].offsetLeft), behavior: 'auto' }); return; }
    var target = clamp(Math.max(cur, 0) + dir, 0, N - 1);
    var top = vit.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + (target / (N - 1)) * (vit.offsetHeight - vh) + 2, behavior: 'smooth' });
  }
  $('#vitPrev').addEventListener('click', function () { goTray(-1); });
  $('#vitNext').addEventListener('click', function () { goTray(1); });
  function trayLabels() {
    trays.forEach(function (t) {
      t.querySelector('.tray-open').setAttribute('aria-label', (lang === 'en' ? 'View details: ' : 'Ver detalle: ') + t.querySelector('h3').textContent);
    });
  }
  trayLabels();
  trays.forEach(function (t, i) {
    t.querySelector('.tray-open').addEventListener('click', function () {
      if (!RM && i !== cur) goTray(i - Math.max(cur, 0));
      openDetail(i);
    });
  });

  /* ---------- detail sheet + take-away box ---------- */
  var T = {
    es: { added: ' añadido a la caja', empty: 'La caja está vacía.', box: 'Caja para llevar', units: 'ud.', remove: 'Quitar', head: 'Hola, Confitería Moscatel. Quería reservar para recoger:', when: 'Recogida', tail: '¿Me confirmáis disponibilidad y precio? Gracias.', subj: 'Reserva para llevar' },
    en: { added: ' added to the box', empty: 'The box is empty.', box: 'Take-away box', units: 'pcs', remove: 'Remove', head: 'Hello Confitería Moscatel, I would like to reserve for pick-up:', when: 'Pick-up', tail: 'Could you confirm availability and price? Thank you.', subj: 'Take-away reservation' }
  };
  var pd = $('#pd'), bx = $('#bx'), boxBtn = $('#boxBtn'), boxCount = $('#boxCount'), boxFill = $('.box-fill');
  var pdImg = $('#pdImg'), pdQty = $('#pdQty'), q = 1, pdIndex = 0, box = [], lastFocus = null;
  function openDialog(d) {
    lastFocus = document.activeElement;
    d.showModal();
    requestAnimationFrame(function () { requestAnimationFrame(function () { d.classList.add('open'); }); });
  }
  function closeDialog(d) {
    if (!d.open) return;
    d.classList.remove('open');
    setTimeout(function () { d.close(); }, RM ? 0 : 260);
  }
  [pd, bx].forEach(function (d) {
    d.addEventListener('cancel', function (e) { e.preventDefault(); closeDialog(d); });
    d.addEventListener('click', function (e) { if (e.target === d || e.target.closest('[data-close]')) closeDialog(d); });
    d.addEventListener('close', function () { if (lastFocus && lastFocus.focus) lastFocus.focus(); });
  });
  function openDetail(i) {
    var t = trays[i], img = t.querySelector('img');
    pdIndex = i; q = 1; pdQty.textContent = '1';
    pdImg.src = img.currentSrc || img.src; pdImg.alt = img.alt;
    $('#pdName').textContent = t.querySelector('h3').textContent;
    $('#pdDesc').textContent = t.querySelector('.tray-body p').textContent;
    var tag = t.querySelector('.tag'), pt = $('#pdTag');
    pt.textContent = tag.textContent; pt.className = tag.className;
    openDialog(pd);
  }
  $('#qMinus').addEventListener('click', function () { q = Math.max(1, q - 1); pdQty.textContent = q; });
  $('#qPlus').addEventListener('click', function () { q = Math.min(24, q + 1); pdQty.textContent = q; });
  function boxTotal() { return box.reduce(function (a, b) { return a + b.q; }, 0); }
  function renderBox() {
    var n = boxTotal();
    boxCount.textContent = n;
    boxFill.style.transform = 'scaleY(' + Math.min(1, n / 8).toFixed(3) + ')';
    boxBtn.setAttribute('aria-label', T[lang].box + ': ' + n);
    var list = $('#bxList'); list.innerHTML = '';
    box.forEach(function (it, k) {
      var t = trays[it.i], li = document.createElement('li');
      li.innerHTML = '<img alt="" width="52" height="52"><div><b></b><small></small></div><button class="btn btn-line btn-sm" type="button"></button>';
      li.querySelector('img').src = t.querySelector('img').currentSrc || t.querySelector('img').src;
      li.querySelector('b').textContent = t.querySelector('h3').textContent;
      li.querySelector('small').textContent = it.q + ' ' + T[lang].units + ' · [precio]';
      var rmv = li.querySelector('button'); rmv.textContent = T[lang].remove;
      rmv.addEventListener('click', function () { box.splice(k, 1); renderBox(); });
      list.appendChild(li);
    });
    $('#bxEmpty').hidden = box.length > 0;
    showPill();
  }
  var vitVisible = false;
  function showPill() { boxBtn.hidden = !(vitVisible || boxTotal() > 0); }
  new IntersectionObserver(function (es) { vitVisible = es[0].isIntersecting; showPill(); }).observe(vit);
  $('#pdAdd').addEventListener('click', function () {
    var found = box.filter(function (b) { return b.i === pdIndex; })[0];
    if (found) found.q += q; else box.push({ i: pdIndex, q: q });
    boxBtn.hidden = false;
    if (!RM) {
      var a = pdImg.getBoundingClientRect(), b = boxBtn.getBoundingClientRect();
      var f = document.createElement('img'); f.className = 'fly'; f.src = pdImg.src; f.alt = '';
      f.style.left = a.left + 'px'; f.style.top = a.top + 'px'; f.style.width = a.width + 'px'; f.style.height = a.height + 'px';
      document.body.appendChild(f);
      var dx = b.left + 18 - (a.left + a.width / 2), dy = b.top + 18 - (a.top + a.height / 2), sc = 36 / a.width;
      f.animate([{ transform: 'translate3d(0,0,0) scale(1)', opacity: 1 }, { transform: 'translate3d(' + dx * 0.6 + 'px,' + (dy * 0.35 - 80) + 'px,0) scale(' + (sc * 3) + ')', opacity: 1, offset: 0.55 }, { transform: 'translate3d(' + dx + 'px,' + dy + 'px,0) scale(' + sc + ')', opacity: 0.2 }], { duration: 750, easing: 'cubic-bezier(.5,0,.3,1)' }).onfinish = function () {
        f.remove(); renderBox(); boxBtn.classList.remove('bump'); void boxBtn.offsetWidth; boxBtn.classList.add('bump');
      };
    } else renderBox();
    closeDialog(pd);
  });
  boxBtn.addEventListener('click', function () { renderBox(); openDialog(bx); });
  function boxText() {
    var L = T[lang], lines = [L.head];
    box.forEach(function (it) { lines.push('• ' + it.q + ' × ' + trays[it.i].querySelector('h3').textContent); });
    var w = $('#bxWhen').value.trim(); if (w) lines.push(L.when + ': ' + w);
    lines.push('', L.tail); return lines.join('\n');
  }
  $('#bxWa').addEventListener('click', function () { if (!box.length) return; window.open('https://wa.me/?text=' + encodeURIComponent(boxText()), '_blank', 'noopener'); });
  $('#bxMail').addEventListener('click', function () { if (!box.length) return; window.location.href = 'mailto:info@confiteriamoscatel.es?subject=' + encodeURIComponent(T[lang].subj) + '&body=' + encodeURIComponent(boxText()); });

  /* ---------- Hero: light, steam, icing sugar ---------- */
  var hero = $('.hero'), heroCover = $('#heroCover'), heroText = $('#heroText');
  var heroScene = {
    update: function () {
      var p = clamp(window.scrollY / vh, 0, 1);
      heroCover.style.transform = 'translate3d(-50%,calc(-50% + ' + (p * 70).toFixed(1) + 'px),0) scale(' + (1 + p * 0.06).toFixed(4) + ')';
      heroText.style.transform = 'translate3d(0,' + (-p * 70).toFixed(1) + 'px,0)';
      heroText.style.opacity = clamp(1 - p * 1.3, 0, 1).toFixed(3);
    }
  };
  if (!RM) addScene(hero, heroScene);
  (function sugar() {
    var cv = $('#sugar'); if (RM || !cv.getContext) return;
    var ctx = cv.getContext('2d'), dpr = Math.min(window.devicePixelRatio || 1, 1.5), parts = [], running = false, last = 0, lastY = window.scrollY, push = 0, cw = 0, ch = 0;
    function size() { cw = cv.offsetWidth; ch = cv.offsetHeight; cv.width = Math.round(cw * dpr); cv.height = Math.round(ch * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
    function seed() { var n = cw < 700 ? 55 : 95; parts = []; for (var i = 0; i < n; i++) parts.push({ x: Math.random() * cw, y: Math.random() * ch, r: 0.5 + Math.random() * 1.6, v: 6 + Math.random() * 18, ph: Math.random() * 6.28, a: 0.25 + Math.random() * 0.55 }); }
    function tick(t) {
      if (!running) return;
      var dt = Math.min(0.08, (t - last) / 1000 || 0); last = t;
      var sy = window.scrollY, d = sy - lastY; lastY = sy; push = push * 0.9 + Math.max(0, d) * 0.6;
      var boost = 0.35 + clamp(sy / vh, 0, 1) * 0.9;
      ctx.clearRect(0, 0, cw, ch); ctx.fillStyle = '#fff8ee';
      for (var i = 0; i < parts.length; i++) {
        var q = parts[i];
        q.y += q.v * dt + push * 0.08 * q.r; q.ph += dt * 0.8; q.x += Math.sin(q.ph) * 0.15;
        if (q.y > ch + 4) { q.y = -4; q.x = Math.random() * cw; }
        ctx.globalAlpha = Math.min(1, q.a * boost);
        ctx.beginPath(); ctx.arc(q.x, q.y, q.r, 0, 6.283); ctx.fill();
      }
      requestAnimationFrame(skip);
    }
    function skip() { if (running) requestAnimationFrame(tick); }
    function start() { if (running) return; running = true; last = performance.now(); requestAnimationFrame(tick); }
    function stop() { running = false; }
    var started = false;
    function init() { size(); seed(); started = true; }
    var heroIn = true, armed = false;
    function arm() { if (armed) return; armed = true; ['scroll', 'pointermove', 'touchstart', 'keydown'].forEach(function (ev) { window.removeEventListener(ev, arm); }); if (heroIn && !document.hidden) { init(); start(); } }
    ['scroll', 'pointermove', 'touchstart', 'keydown'].forEach(function (ev) { window.addEventListener(ev, arm, { passive: true }); });
    new IntersectionObserver(function (es) { heroIn = es[0].isIntersecting; if (!armed) return; if (heroIn && !document.hidden) { if (!started) init(); start(); } else stop(); }).observe(hero);
    document.addEventListener('visibilitychange', function () { if (document.hidden) stop(); });
    window.addEventListener('resize', function () { if (started) { size(); seed(); } });
  })();

  /* ---------- Ronda: Puente Nuevo y Tajo ---------- */
  var tajo = $('#tajo'), tl = { mid: $('.tl-mid'), sky: $('.tl-sky'), left: $('.tl-left'), right: $('.tl-right') }, tajoState = '';
  var tajoScene = {
    update: function () {
      var p = progress(tajo), e = p * p * (3 - 2 * p);
      tl.mid.style.transform = 'scale(' + (1.25 - 0.2 * e).toFixed(4) + ')';
      tl.sky.style.transform = 'translate3d(0,' + (-7 * e).toFixed(2) + '%,0) scale(' + (1.25 - 0.08 * e).toFixed(4) + ')';
      tl.left.style.transform = 'translate3d(' + (-24 * e).toFixed(2) + '%,0,0) scale(' + (1.25 + 0.3 * e).toFixed(4) + ')';
      tl.right.style.transform = 'translate3d(' + (24 * e).toFixed(2) + '%,0,0) scale(' + (1.25 + 0.3 * e).toFixed(4) + ')';
      var st = (p > 0.12 ? ' t1' : '') + (p > 0.35 ? ' f0' : '') + (p > 0.55 ? ' f1' : '') + (p > 0.75 ? ' f2' : '');
      if (st !== tajoState) { tajo.className = 'tajo' + st; tajoState = st; }
    }
  };
  if (!RM) addScene(tajo, tajoScene); else tajo.classList.add('t1', 'f0', 'f1', 'f2');

  /* ---------- Del obrador a la vitrina ---------- */
  var obr = $('#obrador'), obrImgs = $$('.obr-img', obr), obrCaps = $$('.obr-cap', obr), obrBar = $('#obrBar'), obrCur = -1, ON = obrImgs.length;
  var obrScene = {
    update: function () {
      var p = progress(obr), raw = p * (ON - 1), b = Math.floor(raw), fr = raw - b;
      var f = b + (fr < 0.35 ? 0 : fr > 0.65 ? 1 : (fr - 0.35) / 0.3);
      for (var i = 0; i < ON; i++) {
        var o = i === 0 ? 1 : clamp(f - i + 1, 0, 1), t = clamp((raw - i + 1) / 2, 0, 1);
        obrImgs[i].style.opacity = o.toFixed(3);
        obrImgs[i].style.transform = 'translate3d(0,' + ((0.5 - t) * 26).toFixed(1) + 'px,0) scale(' + (1.12 - 0.1 * t).toFixed(4) + ')';
      }
      obrBar.style.transform = 'scaleX(' + p.toFixed(4) + ')';
      var idx = Math.round(f);
      if (idx !== obrCur) { if (obrCur > -1) obrCaps[obrCur].classList.remove('on'); obrCur = idx; obrCaps[idx].classList.add('on'); }
    }
  };
  if (!RM) addScene(obr, obrScene); else obrCaps.forEach(function (c) { c.classList.add('on'); });

  /* ---------- Un día en Ronda ---------- */
  var dia = $('#dia'), stage = $('.dia-stage'), sun = $('#sun'), sunB = $('.sun-b'), railDot = $('#railDot'), rail = $('#rail');
  var beams = $('.beams', stage), tints = $$('.tint', stage), KEYS = [0, 0.36, 0.7, 1], W = 1, H = 1, railH = 100;
  var diaScene = {
    measure: function () {
      W = stage.offsetWidth; H = stage.offsetHeight;
      var lis = $$('li', rail); railH = lis[lis.length - 1].offsetTop - lis[0].offsetTop;
    },
    update: function () {
      var p = progress(dia);
      for (var i = 0; i < 4; i++) {
        tints[i].style.opacity = Math.max(0, 1 - Math.abs(p - KEYS[i]) / 0.34).toFixed(3);
      }
      beams.style.opacity = Math.max(0, 1 - Math.abs(p - KEYS[1]) / 0.3).toFixed(3);
      var x = W * (0.1 + 0.62 * p), y = H * (0.56 - 0.3 * Math.sin(Math.PI * Math.min(p * 1.05, 1)));
      sun.style.transform = 'translate3d(' + x.toFixed(0) + 'px,' + y.toFixed(0) + 'px,0) scale(' + (1 + 0.6 * Math.max(0, 1 - Math.abs(p - 0.36) / 0.34)).toFixed(3) + ')';
      sun.style.opacity = (p > 0.86 ? clamp((1 - p) / 0.14, 0, 1) : 1).toFixed(3);
      sunB.style.opacity = clamp((p - 0.4) / 0.35, 0, 1).toFixed(3);
      railDot.style.transform = 'translate3d(0,' + (p * railH + 4).toFixed(0) + 'px,0)';
    }
  };
  if (!RM) addScene(dia, diaScene);

  /* ---------- Cake builder ---------- */
  var form = $('#orderForm'), layers = $('#cakeLayers'), plaque = $('#plaque'), plaqueText = $('#plaqueText');
  var msg = $('#msg'), dateIn = $('#date'), nameIn = $('#name'), notes = $('#notes');
  var dmin = new Date(); dmin.setDate(dmin.getDate() + 3);
  var iso = function (d) { return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); };
  dateIn.min = iso(dmin);
  var COAT = { meringue: '#f6eddd', ganache: '#3b2217', fruit: '#faf6ee', fondant: '#f3ebdf', yolk: '#e3a448' };

  function checked(name) { return form.querySelector('input[name="' + name + '"]:checked'); }
  function labelOf(input) { var s = input.nextElementSibling; var b = s.querySelector('b'); return (b || s).textContent; }
  function valueOf(input) { return lang === 'en' && input.dataset.enV ? input.dataset.enV : input.value; }

  function scallops(x0, x1, y, r, fill, stroke) {
    var n = Math.max(3, Math.round((x1 - x0) / (r * 2))), w = (x1 - x0) / n, d = 'M' + x0 + ' ' + y;
    for (var i = 0; i < n; i++) d += ' q' + (w / 2) + ' ' + (-r * 1.6) + ' ' + w + ' 0';
    return '<path d="' + d + ' Z" fill="' + fill + '" stroke="' + stroke + '" stroke-width=".9"/>';
  }
  function tier(cx, yb, w, h, sp, fi, top, last) {
    var x0 = cx - w / 2, x1 = cx + w / 2, yt = yb - h, s = '';
    var coat = COAT[top], band = (h - 8) / 5.2, fillH = band * 0.6, spH = band * 1.33;
    // exterior (left half)
    s += '<g class="coat"><rect x="' + x0 + '" y="' + yt + '" width="' + (w / 2) + '" height="' + h + '" fill="' + coat + '"/>';
    s += '<rect x="' + x0 + '" y="' + yt + '" width="' + (w / 2) + '" height="' + h + '" fill="url(#shine)"/>';
    if (top === 'fondant') s += '<line x1="' + x0 + '" x2="' + cx + '" y1="' + (yb - 10) + '" y2="' + (yb - 10) + '" stroke="#c79a5a" stroke-width="3"/>';
    if (top === 'yolk') { for (var k = x0 + 6; k < cx; k += 12) s += '<line x1="' + k + '" y1="' + (yt + 2) + '" x2="' + (k + 8) + '" y2="' + (yt + 12) + '" stroke="rgba(120,50,10,.35)" stroke-width="1"/>'; }
    if (top === 'ganache') {
      var dd = 'M' + x0 + ' ' + yt + ' H' + cx + ' V' + (yt + 10);
      var drips = [[0.9, 26], [0.75, 12], [0.6, 30], [0.45, 16], [0.3, 24], [0.15, 10], [0.04, 20]];
      drips.forEach(function (q) { var xx = x0 + (w / 2) * q[0]; dd += ' L' + (xx + 5) + ' ' + (yt + 10) + ' q0 ' + q[1] + ' -5 ' + q[1] + ' t-5 ' + (-q[1]); });
      dd += ' L' + x0 + ' ' + (yt + 10) + ' Z';
      s += '<path d="' + dd + '" fill="#3b2217"/>';
    }
    s += '</g>';
    // cut (right half): layers from bottom
    s += '<g class="bands">';
    var y = yb, seq = ['s', 'f', 's', 'f', 's'];
    seq.forEach(function (t) {
      var hh = t === 's' ? spH : fillH; y -= hh;
      s += '<rect x="' + cx + '" y="' + y.toFixed(1) + '" width="' + (w / 2) + '" height="' + hh.toFixed(1) + '" fill="' + (t === 's' ? sp : fi) + '"/>';
      if (t === 's') s += '<rect x="' + cx + '" y="' + y.toFixed(1) + '" width="' + (w / 2) + '" height="' + hh.toFixed(1) + '" fill="url(#crumb)"/>';
    });
    s += '<rect x="' + cx + '" y="' + yt + '" width="' + (w / 2) + '" height="' + (y - yt).toFixed(1) + '" fill="' + coat + '"/>';
    s += '<rect x="' + (x1 - 5) + '" y="' + yt + '" width="5" height="' + h + '" fill="' + coat + '" opacity=".9"/>';
    s += '</g>';
    s += '<rect x="' + x0 + '" y="' + yt + '" width="' + w + '" height="' + h + '" fill="none" stroke="#2b1c14" stroke-width="1.1"/>';
    s += '<line x1="' + cx + '" x2="' + cx + '" y1="' + (yt - 4) + '" y2="' + (yb + 4) + '" stroke="#2b1c14" stroke-width=".8" stroke-dasharray="3 3"/>';
    // topping detail on top edge
    s += '<g class="topd">';
    if (top === 'meringue') { s += scallops(x0, x1, yt + 1, 7, '#f8f0e2', '#2b1c14'); for (var m = x0 + 7; m < x1; m += 14) s += '<circle cx="' + m + '" cy="' + (yt - 9) + '" r="1.8" fill="#b9773a" opacity=".8"/>'; }
    if (top === 'fruit') { s += scallops(x0, x1, yt + 1, 5, '#fffaf2', '#2b1c14'); if (last) { for (var b = x0 + 16; b < x1 - 10; b += 26) { s += '<circle cx="' + b + '" cy="' + (yt - 11) + '" r="5" fill="#8f2232" stroke="#2b1c14" stroke-width=".7"/><circle cx="' + (b + 11) + '" cy="' + (yt - 9) + '" r="3.6" fill="#2d2440" stroke="#2b1c14" stroke-width=".6"/>'; } } }
    if (top === 'yolk') s += '<rect x="' + x0 + '" y="' + (yt - 5) + '" width="' + w + '" height="5" fill="#c9782a" stroke="#2b1c14" stroke-width=".8"/>';
    if (top === 'ganache') s += '<rect x="' + x0 + '" y="' + (yt - 3) + '" width="' + w + '" height="3" rx="1.5" fill="#2a170f"/>';
    s += '</g>';
    var ty = yt - (top === 'meringue' || top === 'fruit' ? 12 : top === 'yolk' ? 5 : 3);
    if (last) {
      var xs = w > 230 ? [x0 + 16, x0 + 34, x1 - 34, x1 - 16] : [x0 + 16, x1 - 16];
      s += '<g class="candles">';
      xs.forEach(function (x) {
        s += '<rect x="' + (x - 2.5) + '" y="' + (ty - 28) + '" width="5" height="28" rx="1" fill="#fbf7f0" stroke="#2b1c14" stroke-width=".8"/>';
        s += '<path d="M' + (x - 2.5) + ' ' + (ty - 20) + ' l5 -4 M' + (x - 2.5) + ' ' + (ty - 10) + ' l5 -4" stroke="#c79a5a" stroke-width="1.2"/>';
        s += '<line x1="' + x + '" y1="' + (ty - 28) + '" x2="' + x + '" y2="' + (ty - 32) + '" stroke="#2b1c14" stroke-width="1"/>';
        s += '<path class="flame" d="M' + x + ' ' + (ty - 46) + ' C' + (x + 5) + ' ' + (ty - 39) + ' ' + (x + 5) + ' ' + (ty - 33) + ' ' + x + ' ' + (ty - 31) + ' C' + (x - 5) + ' ' + (ty - 33) + ' ' + (x - 5) + ' ' + (ty - 39) + ' ' + x + ' ' + (ty - 46) + 'Z" fill="#f2b552" stroke="#c4691d" stroke-width=".6"/>';
      });
      s += '</g>';
    }
    return { svg: s, top: yt - (top === 'meringue' || top === 'fruit' ? 16 : 6) };
  }

  var prev = {};
  function drawCake(changed) {
    var size = checked('size'), sp = checked('sponge').dataset.c, fi = checked('fill').dataset.c, top = checked('top').dataset.k;
    var wf = parseFloat(size.dataset.w), tiers = +size.dataset.tiers;
    var cx = 210, yb = 298, out = '', t;
    if (tiers === 1) {
      t = tier(cx, yb, 300 * wf, 104 + 34 * wf, sp, fi, top, true); out = t.svg;
    } else {
      var a = tier(cx, yb, 300, 112, sp, fi, top, false);
      var b = tier(cx, yb - 112, 190, 92, sp, fi, top, true);
      out = a.svg + b.svg; t = b;
    }
    layers.innerHTML = '<g class="lyr' + (changed ? ' pop' : '') + '" style="transform-box:fill-box;transform-origin:50% 100%">' + out + '</g>';
    plaque.style.transform = 'translate(0px,' + (t.top - 30).toFixed(0) + 'px)';
    var vy = Math.max(0, Math.round(t.top - 56));
    $('#cake').setAttribute('viewBox', '0 ' + vy + ' 420 ' + (330 - vy));
  }
  function updateSummary() {
    if (!form) return;
    $('#sumOcc').textContent = labelOf(checked('occ'));
    $('#sumSize').textContent = checked('size').value;
    $('#sumSponge').textContent = labelOf(checked('sponge'));
    $('#sumFill').textContent = labelOf(checked('fill'));
    $('#sumTop').textContent = labelOf(checked('top'));
    plaqueText.textContent = msg.value.trim() || '—';
  }
  form.addEventListener('change', function (e) {
    var n = e.target.name;
    if (['size', 'sponge', 'fill', 'top'].indexOf(n) > -1) drawCake(!RM);
    updateSummary();
  });
  msg.addEventListener('input', updateSummary);
  var cakeIO = new IntersectionObserver(function (es) {
    if (es[0].isIntersecting) { cakeIO.disconnect(); drawCake(false); updateSummary(); }
  }, { rootMargin: '600px 0px' });
  cakeIO.observe($('#encargos'));

  var sheet = $('.sheet'), tog = $('#sheetToggle');
  tog.addEventListener('click', function () {
    var c = sheet.classList.toggle('collapsed');
    tog.setAttribute('aria-expanded', c ? 'false' : 'true');
    var en = lang === 'en';
    tog.setAttribute('aria-label', c ? (en ? 'Show preview' : 'Ver vista previa') : (en ? 'Hide preview' : 'Ocultar vista previa'));
  });

  // validation (blur-first, clear on input)
  function showErr(input, errEl, bad) { input.setAttribute('aria-invalid', bad ? 'true' : 'false'); errEl.hidden = !bad; }
  [[nameIn, $('#nameErr')], [dateIn, $('#dateErr')]].forEach(function (p) {
    p[0].addEventListener('blur', function () { showErr(p[0], p[1], !p[0].value.trim()); });
    p[0].addEventListener('input', function () { if (p[0].value.trim()) showErr(p[0], p[1], false); });
  });
  function compose() {
    var bad = [];
    if (!dateIn.value) { showErr(dateIn, $('#dateErr'), true); bad.push(dateIn); }
    if (!nameIn.value.trim()) { showErr(nameIn, $('#nameErr'), true); bad.push(nameIn); }
    if (bad.length) { bad[0].focus(); return null; }
    var d = dateIn.value.split('-'), date = d[2] + '/' + d[1] + '/' + d[0], en = lang === 'en';
    var L = en
      ? ['Hello Confitería Moscatel, I would like to order a cake:', 'Occasion', 'Servings', 'Sponge', 'Filling', 'Topping', 'Message', 'Pick-up', 'Name', 'Notes', 'Could you confirm the price and availability? Thank you.']
      : ['Hola, Confitería Moscatel. Me gustaría encargar una tarta:', 'Ocasión', 'Raciones', 'Bizcocho', 'Relleno', 'Cobertura', 'Mensaje', 'Recogida', 'Nombre', 'Notas', '¿Me confirmáis precio y disponibilidad? Gracias.'];
    var lines = [L[0],
      '• ' + L[1] + ': ' + valueOf(checked('occ')),
      '• ' + L[2] + ': ' + checked('size').value,
      '• ' + L[3] + ': ' + valueOf(checked('sponge')),
      '• ' + L[4] + ': ' + valueOf(checked('fill')),
      '• ' + L[5] + ': ' + valueOf(checked('top')),
      '• ' + L[6] + ': "' + (msg.value.trim() || '—') + '"',
      '• ' + L[7] + ': ' + date,
      '• ' + L[8] + ': ' + nameIn.value.trim()];
    if (notes.value.trim()) lines.push('• ' + L[9] + ': ' + notes.value.trim());
    lines.push('', L[10]);
    return { text: lines.join('\n'), subject: (en ? 'Cake order · ' : 'Encargo de tarta · ') + date };
  }
  var cakeSvg = $('#cake'), spr = $('#sprinkles');
  function celebrate() {
    cakeSvg.classList.add('lit');
    $('#confirmMsg').textContent = lang === 'en' ? 'Design ready: send it to the shop.' : 'Diseño listo: envíaselo a la confitería.';
    if (RM) return;
    var cols = ['#f6e7cf', '#c79a5a', '#8a4513', '#7d2433', '#e8c3a0', '#fbf7f0'], h = spr.offsetHeight, out = '';
    for (var i = 0; i < 42; i++) {
      out += '<i style="left:' + (Math.random() * 100).toFixed(1) + '%;--c:' + cols[i % cols.length] + ';--r0:' + Math.round(Math.random() * 180) + 'deg;--r1:' + Math.round(Math.random() * 720 - 360) + 'deg;--dx:' + Math.round(Math.random() * 60 - 30) + 'px;--dy:' + Math.round(h * (0.7 + Math.random() * 0.35)) + 'px;--d:' + (1.4 + Math.random() * 0.9).toFixed(2) + 's;--dl:' + (Math.random() * 0.35).toFixed(2) + 's"></i>';
    }
    spr.innerHTML = out;
    clearTimeout(spr._t); spr._t = setTimeout(function () { spr.innerHTML = ''; }, 2800);
  }
  form.addEventListener('change', function () { cakeSvg.classList.remove('lit'); $('#confirmMsg').textContent = ''; });
  $('#confirmCake').addEventListener('click', function () {
    var bad = !dateIn.value || !nameIn.value.trim();
    if (bad) { compose(); return; }
    celebrate();
  });
  $('#sendWa').addEventListener('click', function () {
    var m = compose(); if (!m) return;
    cakeSvg.classList.add('lit');
    window.open('https://wa.me/?text=' + encodeURIComponent(m.text), '_blank', 'noopener');
  });
  $('#sendMail').addEventListener('click', function () {
    var m = compose(); if (!m) return;
    window.location.href = 'mailto:info@confiteriamoscatel.es?subject=' + encodeURIComponent(m.subject) + '&body=' + encodeURIComponent(m.text);
  });

  /* ---------- init language ---------- */
  var saved = null; try { saved = localStorage.getItem('moscatel-lang'); } catch (e) {}
  if (saved === 'en') setLang('en');
  request();
})();
