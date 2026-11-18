/* Ichiban Marbella · premium motion layer (Noir Digital). Vanilla JS, decorative only:
   every loop starts and stops with IntersectionObserver, nothing runs off screen,
   and prefers-reduced-motion gets a calm static page. Nothing here is ever sent anywhere. */
(function () {
  'use strict';
  var doc = document.documentElement;
  var REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var FINE = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var HAS_IO = 'IntersectionObserver' in window;
  var SDA = window.CSS && CSS.supports && CSS.supports('animation-timeline: view()');
  function $(id) { return document.getElementById(id); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function retrigger(el, cls) { el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); }
  function watch(el, fn, opts) {
    if (!el) return;
    if (!HAS_IO) { fn(true); return; }
    new IntersectionObserver(function (en) { en.forEach(function (e) { fn(e.isIntersecting, e); }); }, opts || {}).observe(el);
  }
  function once(el, fn, opts) {
    if (!el) return;
    if (!HAS_IO || REDUCED) { fn(); return; }
    var io = new IntersectionObserver(function (en) { if (en.some(function (e) { return e.isIntersecting; })) { io.disconnect(); fn(); } }, opts || {});
    io.observe(el);
  }
  doc.classList.add('fx');

  /* ================= Hero: canvas fire + embers that follow the cursor / tilt ================= */
  function heroFire() {
    var cv = $('hero-fire'); if (!cv || REDUCED || !cv.getContext) return;
    var ctx = cv.getContext('2d'); if (!ctx) return;
    var hero = cv.parentNode;
    var W = 0, H = 0, mobile = false, MAXF = 0, MAXE = 0, flames = [], embers = [];
    var visible = false, raf = 0, last = 0, wind = 0, windT = 0, px = -999, py = -999;
    function sprite(r, stops) {
      var c = document.createElement('canvas'); c.width = c.height = r * 2;
      var g = c.getContext('2d'), gr = g.createRadialGradient(r, r, 0, r, r, r);
      stops.forEach(function (s) { gr.addColorStop(s[0], s[1]); });
      g.fillStyle = gr; g.fillRect(0, 0, r * 2, r * 2); return c;
    }
    var FL = sprite(32, [[0, 'rgba(255,232,170,.95)'], [.22, 'rgba(255,170,70,.6)'], [.55, 'rgba(214,70,24,.2)'], [1, 'rgba(120,20,10,0)']]);
    var EM = sprite(8, [[0, 'rgba(255,248,215,1)'], [.3, 'rgba(255,186,86,.9)'], [1, 'rgba(255,120,30,0)']]);
    function size() {
      W = hero.clientWidth; H = hero.clientHeight; mobile = W < 768;
      var dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1 : 1.5);
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      MAXF = mobile ? 26 : 54; MAXE = mobile ? 30 : 60; // hard cap: 56 / 114 particles
    }
    function rnd(a, b) { return a + Math.random() * (b - a); }
    function addFlame() {
      // phones: low flames along the bottom edge; desktop: stronger on the photo side (right)
      var x = mobile ? rnd(-.05, 1.05) * W : (Math.random() < .8 ? rnd(.42, 1.05) : rnd(-.05, .42)) * W;
      flames.push({ x: x, y: H + rnd(0, 20), vx: rnd(-.25, .25), vy: -rnd(1, 2.3) * (mobile ? .8 : 1), life: rnd(34, 64) * (mobile ? .8 : 1), age: 0, s: rnd(46, 96) * (mobile ? .7 : 1) });
    }
    function addEmber(anyY) {
      embers.push({ x: rnd(0, 1) * W, y: anyY ? rnd(.2, 1) * H : H * rnd(.82, 1.02), vx: rnd(-.4, .4), vy: -rnd(.5, 1.7), life: rnd(140, 300), age: anyY ? rnd(0, 120) : 0, s: rnd(1.6, 3.4), w: rnd(0, 6.28) });
    }
    function frame(ts) {
      raf = 0;
      if (!visible || document.hidden) return;
      var dt = last ? clamp((ts - last) / 16.67, .5, 2.5) : 1; last = ts;
      wind += (windT - wind) * .04 * dt;
      while (flames.length < MAXF && Math.random() < .7) addFlame();
      while (embers.length < MAXE && Math.random() < .08) addEmber(false);
      ctx.globalCompositeOperation = 'source-over';
      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = 'lighter';
      var i, p, k, a, s, fa = mobile ? .32 : .6;
      for (i = flames.length - 1; i >= 0; i--) {
        p = flames[i]; p.age += dt; k = p.age / p.life;
        if (k >= 1) { flames[i] = flames[flames.length - 1]; flames.pop(); continue; }
        p.x += (p.vx + wind * 1.4 * k) * dt; p.y += p.vy * dt;
        s = p.s * (1 - k * .65);
        a = (k < .2 ? k / .2 : 1 - (k - .2) / .8) * fa;
        ctx.globalAlpha = a;
        ctx.drawImage(FL, p.x - s * .5, p.y - s * .7, s, s * 1.4);
      }
      for (i = embers.length - 1; i >= 0; i--) {
        p = embers[i]; p.age += dt; k = p.age / p.life;
        if (k >= 1 || p.y < -20 || p.x < -40 || p.x > W + 40) { embers[i] = embers[embers.length - 1]; embers.pop(); continue; }
        p.w += .05 * dt;
        p.vx += (wind * .03 + Math.sin(p.w) * .025) * dt;
        var dx = p.x - px, dy = p.y - py, d2 = dx * dx + dy * dy;
        if (d2 < 16900) { var d = Math.sqrt(d2) || 1, f = (1 - d / 130) * .5; p.vx += dx / d * f * dt; p.vy += dy / d * f * .6 * dt; }
        p.vx *= .985; p.vy = p.vy * .99 - .006 * dt;
        p.x += p.vx * dt; p.y += p.vy * dt;
        a = (k < .1 ? k / .1 : 1 - k) * (.65 + .35 * Math.sin(p.w * 3));
        ctx.globalAlpha = clamp(a, 0, 1);
        s = p.s * 4;
        ctx.drawImage(EM, p.x - s / 2, p.y - s / 2, s, s);
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(frame);
    }
    function start() { if (!raf && visible && !document.hidden) { last = 0; raf = requestAnimationFrame(frame); } }
    function boot() {
      size();
      for (var i = 0; i < MAXE * .6; i++) addEmber(true);
      hero.classList.add('fire-on');
      watch(hero, function (on) { visible = on; if (on) start(); }, { rootMargin: '40px' });
      document.addEventListener('visibilitychange', start);
      var rt; window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(size, 150); });
      hero.addEventListener('pointermove', function (e) {
        var r = hero.getBoundingClientRect(); px = e.clientX - r.left; py = e.clientY - r.top;
        windT = clamp((px / W - .5) * 2.2, -1.2, 1.2);
      }, { passive: true });
      hero.addEventListener('pointerleave', function () { px = py = -999; windT = 0; });
      if (!FINE && 'DeviceOrientationEvent' in window && typeof DeviceOrientationEvent.requestPermission !== 'function') {
        window.addEventListener('deviceorientation', function (e) { if (e.gamma != null) windT = clamp(e.gamma / 25, -1.2, 1.2); }, { passive: true });
      }
    }
    // Start after the page has loaded and gone quiet, so the fire never competes with first paint.
    function later() { (window.requestIdleCallback || function (f) { setTimeout(f, 200); })(boot, { timeout: 2500 }); }
    if (document.readyState === 'complete') later(); else window.addEventListener('load', later);
  }
  heroFire();

  /* ================= Pause decorative CSS loops off screen ================= */
  function pauseOff(el) { if (!el || !HAS_IO) return; el.classList.add('paused'); watch(el, function (on) { el.classList.toggle('paused', !on); }); }
  pauseOff(document.querySelector('.sizzle'));
  pauseOff(document.querySelector('.hero-title em'));
  pauseOff(document.querySelector('.g-video'));
  pauseOff(document.querySelector('.scroll-cue'));
  pauseOff($('open-status'));

  /* ================= Lanterns: drop in, flicker on, sway only while visible ================= */
  $$('.lanterns').forEach(function (l) {
    if (REDUCED || !HAS_IO) { l.classList.add('lit'); return; }
    l.classList.add('paused');
    watch(l.parentNode, function (on) {
      l.classList.toggle('paused', !on);
      if (on) l.classList.add('lit');
    }, { rootMargin: '0px 0px -25% 0px' });
  });

  /* ================= Show: JS fallback for the scroll-driven performance ================= */
  var track = $('show-track'), stage = $('show-stage');
  if (track && stage && !SDA && !REDUCED) {
    var showOn = false, tick = false;
    var upd = function () {
      tick = false; if (!showOn) return;
      var r = track.getBoundingClientRect(), span = r.height - window.innerHeight;
      stage.style.setProperty('--p', clamp(span > 0 ? -r.top / span : 0, 0, 1).toFixed(4));
    };
    watch(track, function (on) { showOn = on; if (on) upd(); }, { rootMargin: '100px 0px' });
    window.addEventListener('scroll', function () { if (showOn && !tick) { tick = true; requestAnimationFrame(upd); } }, { passive: true });
  }

  /* ================= Kaiten belt: auto-run, drag with inertia, pause ================= */
  (function belt() {
    var beltEl = $('belt'), trackEl = $('belt-track'), tog = $('belt-toggle');
    if (!beltEl || !trackEl || REDUCED) return;
    var x = 0, W = 0, dirty = true, v = 0, AUTO = 30, paused = false, hover = false, focusHold = false, drag = null, visible = false, raf = 0, last = 0, suppress = false;
    function measure() {
      // read layout only while the belt is on screen (never during the idle build)
      if (!visible) { dirty = true; return; }
      var c = trackEl.querySelector('.clone'), f = trackEl.firstElementChild;
      W = c && f ? c.offsetLeft - f.offsetLeft : 0; dirty = false;
    }
    function apply() { if (W > 0) x = ((x % W) + W) % W; trackEl.style.transform = 'translate3d(' + (-x).toFixed(1) + 'px,0,0)'; }
    function moving() { return drag || Math.abs(v) > 4 || (!paused && !hover && !focusHold); }
    function frame(ts) {
      raf = 0; if (!visible || document.hidden) return;
      var dt = last ? Math.min(.05, (ts - last) / 1000) : 0; last = ts;
      if (!drag) {
        if (Math.abs(v) > 4) { x += v * dt; v *= Math.pow(.04, dt); }
        else { v = 0; if (!paused && !hover && !focusHold) x += AUTO * dt; }
      }
      apply();
      if (moving()) raf = requestAnimationFrame(frame);
    }
    function kick() { if (!raf && visible && moving()) { last = 0; raf = requestAnimationFrame(frame); } }
    watch(beltEl, function (on) { visible = on; if (on && dirty) { measure(); apply(); } kick(); }, { rootMargin: '60px 0px' });
    document.addEventListener('visibilitychange', kick);
    document.addEventListener('ichiban:belt', function () { measure(); if (!dirty) apply(); });
    window.addEventListener('resize', function () { measure(); if (!dirty) apply(); });
    beltEl.addEventListener('pointerdown', function (e) {
      if (e.button > 0) return;
      drag = { id: e.pointerId, sx: e.clientX, lx: e.clientX, lt: e.timeStamp, moved: false, vx: 0 }; v = 0; kick();
    });
    beltEl.addEventListener('pointermove', function (e) {
      if (!drag || e.pointerId !== drag.id) return;
      var dx = e.clientX - drag.lx;
      if (!drag.moved && Math.abs(e.clientX - drag.sx) > 6) { drag.moved = true; try { beltEl.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ } beltEl.classList.add('dragging'); }
      if (drag.moved) {
        x -= dx; apply();
        var dtm = Math.max(8, e.timeStamp - drag.lt);
        drag.vx = drag.vx * .4 + (-dx / dtm * 1000) * .6;
      }
      drag.lx = e.clientX; drag.lt = e.timeStamp;
    });
    function end(e) {
      if (!drag || (e && e.pointerId !== drag.id)) return;
      if (drag.moved) { v = clamp(drag.vx, -2400, 2400); suppress = true; setTimeout(function () { suppress = false; }, 0); }
      drag = null; beltEl.classList.remove('dragging'); kick();
    }
    beltEl.addEventListener('pointerup', end);
    beltEl.addEventListener('pointercancel', end);
    beltEl.addEventListener('click', function (e) { if (suppress) { e.stopPropagation(); e.preventDefault(); suppress = false; } }, true);
    beltEl.addEventListener('dragstart', function (e) { e.preventDefault(); });
    beltEl.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') { hover = true; } });
    beltEl.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse') { hover = false; kick(); } });
    beltEl.addEventListener('wheel', function (e) {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) { e.preventDefault(); x += e.deltaX; apply(); }
    }, { passive: false });
    beltEl.addEventListener('focusin', function (e) {
      var it = e.target.closest('.belt-item'); focusHold = true;
      if (it) { x = it.offsetLeft - (beltEl.clientWidth - it.offsetWidth) / 2; apply(); }
    });
    beltEl.addEventListener('focusout', function (e) { if (!beltEl.contains(e.relatedTarget)) { focusHold = false; kick(); } });
    if (tog) tog.addEventListener('click', function () { paused = !paused; tog.setAttribute('aria-pressed', String(paused)); kick(); });
  })();

  /* ================= Menu cards: steam on phones (in view), tilt on desktop ================= */
  var steamIO = null;
  function bindCards() {
    if (REDUCED || FINE || !HAS_IO) return;
    if (steamIO) steamIO.disconnect();
    steamIO = new IntersectionObserver(function (en) { en.forEach(function (e) { e.target.classList.toggle('steamy', e.isIntersecting); }); }, { rootMargin: '-25% 0px -25% 0px' });
    $$('#menu-body .dish-card.hot').forEach(function (c) { steamIO.observe(c); });
  }
  document.addEventListener('ichiban:menu', bindCards);
  bindCards();
  if (FINE && !REDUCED) {
    var body = $('menu-body'), tCard = null, tE = null, tRaf = 0;
    if (body) {
      body.addEventListener('pointermove', function (e) {
        tE = e; if (tRaf) return;
        tRaf = requestAnimationFrame(function () {
          tRaf = 0; var c = tE.target.closest && tE.target.closest('.dish-card');
          if (tCard && tCard !== c) { tCard.style.removeProperty('--rx'); tCard.style.removeProperty('--ry'); }
          tCard = c; if (!c) return;
          var r = c.getBoundingClientRect(), nx = (tE.clientX - r.left) / r.width - .5, ny = (tE.clientY - r.top) / r.height - .5;
          c.style.setProperty('--rx', (-ny * 5).toFixed(2) + 'deg'); c.style.setProperty('--ry', (nx * 6).toFixed(2) + 'deg');
        });
      }, { passive: true });
      body.addEventListener('pointerleave', function () { if (tCard) { tCard.style.removeProperty('--rx'); tCard.style.removeProperty('--ry'); tCard = null; } });
    }
  }

  /* ================= Chopsticks carry a picked dish into My picks ================= */
  var STICKS = '<svg class="fly-sticks" viewBox="0 0 70 70" aria-hidden="true"><g stroke-linecap="round"><path d="M64 4L14 58" stroke="#2a1510" stroke-width="5"/><path d="M68 12L20 62" stroke="#3a1d14" stroke-width="5"/><path d="M64 4L52 17M68 12L57 24" stroke="#d6b06a" stroke-width="5"/></g></svg>';
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('.add'); if (!b || REDUCED || !b.animate) return;
    requestAnimationFrame(function () {
      if (b.getAttribute('aria-pressed') !== 'true') return;
      var fab = $('picks-fab'); if (!fab || fab.hidden) return;
      var holder = b.closest('.dish-card, .belt-item, .dish-row');
      var img = holder && holder.querySelector('img');
      var from = (img || b).getBoundingClientRect(), to = fab.getBoundingClientRect();
      if (!to.width) return;
      var sx = from.left + from.width / 2, sy = from.top + from.height / 2;
      var dx = to.left + to.width / 2 - sx, dy = to.top + to.height / 2 - sy;
      var el = document.createElement('div'); el.className = 'fly'; el.setAttribute('aria-hidden', 'true');
      el.innerHTML = '<span class="fly-dish"></span>' + STICKS;
      if (img) el.firstChild.style.backgroundImage = 'url("' + (img.currentSrc || img.src) + '")';
      el.style.left = sx + 'px'; el.style.top = sy + 'px';
      document.body.appendChild(el);
      var lift = Math.min(160, Math.abs(dy) * .5 + 60), kf = [];
      for (var i = 0; i <= 6; i++) {
        var t = i / 6, ease = t * t * (3 - 2 * t);
        kf.push({ transform: 'translate3d(' + (dx * ease).toFixed(1) + 'px,' + (dy * ease - lift * 4 * t * (1 - t)).toFixed(1) + 'px,0) scale(' + (1 - .62 * t).toFixed(3) + ') rotate(' + (-18 * t).toFixed(1) + 'deg)', opacity: t > .85 ? (1 - t) / .15 : 1 });
      }
      el.lastChild.animate([{ transform: 'rotate(-26deg) translate(10px,-6px)', opacity: 0 }, { transform: 'rotate(0deg)', opacity: 1, offset: .3 }, { transform: 'rotate(0deg)', opacity: 1 }], { duration: 300, easing: 'ease-out', fill: 'both' });
      var a = el.animate(kf, { duration: 820, delay: 160, easing: 'linear', fill: 'both' });
      a.onfinish = function () { el.remove(); retrigger(fab, 'bump'); };
      a.oncancel = function () { el.remove(); };
    });
  });

  /* ================= Booking ticket: prints, re-feeds on change, stamps on confirm ================= */
  var booker = $('booker'), ticket = $('ticket');
  if (booker && ticket) {
    once(ticket.parentNode, function () { booker.classList.add('printed'); }, { threshold: .6 });
    setTimeout(function () { if (!HAS_IO) booker.classList.add('printed'); }, 0);
    var feed = function () {
      if (booker.classList.contains('stamped')) booker.classList.remove('stamped');
      if (!REDUCED && booker.classList.contains('printed')) retrigger(ticket, 'feed');
    };
    booker.addEventListener('change', feed);
    ['bk-plus', 'bk-minus'].forEach(function (id) {
      var btn = $(id); if (!btn) return;
      btn.addEventListener('click', function () {
        feed();
        var out = $('bk-guests'); if (out && !REDUCED) { out.classList.remove('roll-up', 'roll-down'); void out.offsetWidth; out.classList.add(id === 'bk-plus' ? 'roll-up' : 'roll-down'); }
      });
    });
    var stamp = function () { booker.classList.add('printed'); booker.classList.remove('stamped'); void ticket.offsetWidth; booker.classList.add('stamped'); };
    ['bk-restoo', 'bk-embed', 'bk-copy'].forEach(function (id) { var el = $(id); if (el) el.addEventListener('click', stamp); });
  }

  /* ================= Gallery: staggered arrival + lightbox swaps ================= */
  var grid = $('g-grid');
  if (grid) {
    $$('.g-item', grid).forEach(function (g, i) { g.style.setProperty('--gi', i % 4 + Math.floor(i / 4)); });
    once(grid, function () { grid.classList.add('in'); }, { rootMargin: '0px 0px -12% 0px' });
  }
  var lbImg = $('lb-img');
  if (lbImg && !REDUCED) {
    ['lb-prev', 'lb-next'].forEach(function (id) { var el = $(id); if (el) el.addEventListener('click', function () { retrigger(lbImg, 'lb-swap'); }); });
    var lb = $('lightbox'); if (lb) lb.addEventListener('keydown', function (e) { if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') retrigger(lbImg, 'lb-swap'); });
  }

  /* ================= Reviews: the score counts up once ================= */
  var score = $('score-num');
  if (score && !REDUCED && HAS_IO) {
    var target = parseFloat(score.textContent) || 0;
    once(score, function () {
      var t0 = performance.now();
      (function step(now) {
        var k = Math.min(1, (now - t0) / 1100), e = 1 - Math.pow(1 - k, 3);
        score.textContent = (target * e).toFixed(1);
        if (k < 1) requestAnimationFrame(step); else score.textContent = target.toFixed(1);
      })(t0);
    }, { threshold: .6 });
  }

  /* ================= Footer seal stamps in ================= */
  var foot = document.querySelector('.footer');
  if (foot) once(foot, function () { foot.classList.add('in'); }, { threshold: .3 });

  /* ================= Micro-interactions: ink ripple + magnetic CTAs ================= */
  if (!REDUCED) {
    document.addEventListener('pointerdown', function (e) {
      var t = e.target.closest && e.target.closest('.btn, .chip, .tab, .belt-toggle, .lang-btn, .seg label');
      if (!t) return;
      if (t.matches('.seg label')) { t = t.querySelector('span'); if (!t || t.previousElementSibling && t.previousElementSibling.disabled) return; }
      var r = t.getBoundingClientRect(), rip = document.createElement('span');
      rip.className = 'rip'; rip.setAttribute('aria-hidden', 'true');
      rip.style.left = (e.clientX - r.left) + 'px'; rip.style.top = (e.clientY - r.top) + 'px';
      rip.style.setProperty('--r', (Math.max(r.width, r.height) / 10 * 2.4).toFixed(1));
      t.appendChild(rip);
      setTimeout(function () { rip.remove(); }, 650);
    }, { passive: true });
    if (FINE) {
      $$('.btn-lg, .header-cta').forEach(function (b) {
        b.addEventListener('pointermove', function (e) {
          var r = b.getBoundingClientRect();
          b.style.transform = 'translate3d(' + ((e.clientX - r.left - r.width / 2) * .14).toFixed(1) + 'px,' + ((e.clientY - r.top - r.height / 2) * .22).toFixed(1) + 'px,0)';
        }, { passive: true });
        b.addEventListener('pointerleave', function () { b.style.transform = ''; });
      });
    }
  }
})();
