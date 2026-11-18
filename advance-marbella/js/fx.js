/* Advance Marbella · concept by Noir Digital. Interactive layer.
   Rules kept here: only transform and opacity are animated; every loop or interval starts
   when its section is on screen and stops when it leaves; scroll work goes through the one
   shared rAF handler in main.js (ADV.addScroll) or, where supported, CSS scroll timelines. */
(function () {
  'use strict';
  var A = window.ADV;
  if (!A) return;
  var REDUCED = A.REDUCED;
  var FINE = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var HAS_IO = 'IntersectionObserver' in window;
  function $(id) { return document.getElementById(id); }
  function qsa(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function lang() { return A.getLang(); }
  function D() { return A.D(); }

  /* Run on(true/false) whenever el enters / leaves the viewport. */
  function watch(el, on, margin) {
    if (!el) return;
    if (!HAS_IO) { on(true); return; }
    new IntersectionObserver(function (es) { es.forEach(function (e) { on(e.isIntersecting); }); },
      { rootMargin: margin || '0px' }).observe(el);
  }
  function once(el, fn, opts) {
    if (!el) return;
    if (!HAS_IO || REDUCED) { fn(); return; }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { io.disconnect(); fn(); } });
    }, opts || { threshold: .35 });
    io.observe(el);
  }

  /* Build a widget only when it comes within ~1.5 screens: keeps start-up script work tiny. */
  function near(el, fn) {
    if (!el) return;
    if (!HAS_IO) { fn(); return; }
    var io = new IntersectionObserver(function (es) {
      if (es.some(function (e) { return e.isIntersecting; })) { io.disconnect(); fn(); }
    }, { rootMargin: '1200px 0px' });
    io.observe(el);
  }

  /* CSS loops (bobbing, pulsing) only play while their block is visible. */
  qsa('[data-live], .ml-bubbles, .qi-bubbles, .map-card, .board, .scene, .hero').forEach(function (el) {
    watch(el, function (v) { el.classList.toggle('is-live', v); }, '80px');
  });

  /* ================= HERO: speech bubbles with physics =================
     Idle: the bubbles float with a CSS animation (compositor only, no JS).
     The physics loop wakes on interaction (cursor near, drag, pop, tilt) and goes back
     to sleep once every bubble has settled at home, so no frame loop runs while idle. */
  (function bubbles() {
    var field = $('bubble-field');
    if (!field || REDUCED) return;
    var hint = document.querySelector('.bubble-hint'), countEl = $('bh-count');
    var els = qsa('.bubble', field), B = [], W = 0, H = 0;
    var pointer = { x: -999, y: -999, on: false }, tilt = { x: 0, y: 0, bx: null, by: null };
    var visible = false, awake = false, raf = 0, last = 0, calm = 0;
    var popped = {}, poppedN = 0;
    function measure() {
      W = field.offsetWidth; H = field.offsetHeight;
      B = els.map(function (el, i) {
        var o = B[i] || { vx: 0, vy: 0, drag: null, free: 0, gone: 0 };
        o.el = el; o.w = el.offsetWidth; o.h = el.offsetHeight; o.hx = el.offsetLeft; o.hy = el.offsetTop;
        return o;
      });
    }
    function paint(b) { b.el.style.transform = 'translate3d(' + b.x.toFixed(1) + 'px,' + b.y.toFixed(1) + 'px,0)'; }
    function wake() {
      if (!visible || document.hidden) return;
      if (!awake) {
        if (!B.length) measure();
        B.forEach(function (b) {
          var m = getComputedStyle(b.el).transform, ty = 0;
          if (m && m !== 'none') ty = parseFloat(m.split(',')[5]) || 0;
          b.x = b.hx; b.y = b.hy + ty; b.vx = 0; b.vy = 0;
        });
        field.classList.add('is-physics');
        B.forEach(paint);
        awake = true; calm = 0;
      }
      if (!raf) { last = 0; raf = requestAnimationFrame(step); }
    }
    function sleep() {
      awake = false;
      if (raf) cancelAnimationFrame(raf); raf = 0;
      B.forEach(function (b) { b.el.style.transform = ''; });
      field.classList.remove('is-physics');
    }
    function pause() { if (raf) cancelAnimationFrame(raf); raf = 0; }
    function step(now) {
      raf = 0;
      var dt = Math.min(.033, (now - (last || now)) / 1000); last = now;
      var damp = Math.exp(-4 * dt), energy = 0, busy = pointer.on;
      for (var i = 0; i < B.length; i++) {
        var b = B[i];
        if (b.gone || b.drag) { busy = true; continue; }
        var k = b.free > 0 ? 6 : 24; if (b.free > 0) { b.free -= dt; busy = true; }
        var tx = b.hx + tilt.x * 28, ty = b.hy + tilt.y * 20;
        var ax = (tx - b.x) * k, ay = (ty - b.y) * k;
        if (pointer.on) {
          var cx = b.x + b.w / 2 - pointer.x, cy = b.y + b.h / 2 - pointer.y, d = Math.sqrt(cx * cx + cy * cy) || 1;
          if (d < 120) { var f = (1 - d / 120) * 2600; ax += cx / d * f; ay += cy / d * f; }
        }
        b.vx = (b.vx + ax * dt) * damp; b.vy = (b.vy + ay * dt) * damp;
      }
      for (var a = 0; a < B.length; a++) for (var c = a + 1; c < B.length; c++) {
        var p = B[a], q = B[c];
        if (p.gone || q.gone) continue;
        var dx = (q.x + q.w / 2) - (p.x + p.w / 2), dy = (q.y + q.h / 2) - (p.y + p.h / 2);
        var ox = (p.w + q.w) / 2 - Math.abs(dx), oy = (p.h + q.h) / 2 - Math.abs(dy);
        if (ox > 0 && oy > 0) {
          if (ox < oy) { var sx = (dx < 0 ? -1 : 1) * ox * 6; if (!p.drag) p.vx -= sx; if (!q.drag) q.vx += sx; }
          else { var sy = (dy < 0 ? -1 : 1) * oy * 6; if (!p.drag) p.vy -= sy; if (!q.drag) q.vy += sy; }
        }
      }
      var m = W < 500 ? 2 : 14;
      for (var j = 0; j < B.length; j++) {
        var e = B[j];
        if (e.gone) continue;
        if (!e.drag) { e.x += e.vx * dt; e.y += e.vy * dt; }
        if (e.x < -m) { e.x = -m; e.vx = Math.abs(e.vx) * .6; } else if (e.x > W - e.w + m) { e.x = W - e.w + m; e.vx = -Math.abs(e.vx) * .6; }
        if (e.y < -10) { e.y = -10; e.vy = Math.abs(e.vy) * .6; } else if (e.y > H - e.h + 10) { e.y = H - e.h + 10; e.vy = -Math.abs(e.vy) * .6; }
        energy += Math.abs(e.x - e.hx - tilt.x * 28) + Math.abs(e.y - e.hy - tilt.y * 20) + (Math.abs(e.vx) + Math.abs(e.vy)) * .05;
        paint(e);
      }
      /* settled at home, nobody touching: go back to the CSS float */
      if (!busy && Math.abs(tilt.x) < .02 && Math.abs(tilt.y) < .02 && energy < 3) { if (++calm > 20) { sleep(); return; } } else calm = 0;
      raf = requestAnimationFrame(step);
    }
    function local(e) { var r = field.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; }
    function pop(b) {
      b.gone = 1; b.el.classList.add('is-popped');
      A.sparkle(b.el, 10, [getComputedStyle(b.el).backgroundColor, '#FFC928', '#FFFFFF']);
      var key = b.el.getAttribute('lang');
      if (!popped[key]) { popped[key] = 1; poppedN++; }
      if (countEl) countEl.textContent = poppedN + '/7';
      if (poppedN === 7 && hint) {
        hint.classList.add('is-done');
        hint.querySelector('[data-i18n]').textContent = D().bubblesDone;
        countEl.textContent = '';
      }
      setTimeout(function () {
        b.x = b.hx; b.y = b.hy + 30; b.vx = 0; b.vy = -60; b.gone = 0;
        b.el.classList.remove('is-popped'); b.el.classList.add('is-back');
        setTimeout(function () { b.el.classList.remove('is-back'); }, 500);
        wake();
      }, 3200);
    }
    A.onLang(function () {
      if (poppedN === 7 && hint) hint.querySelector('[data-i18n]').textContent = D().bubblesDone;
    });
    els.forEach(function (el, i) {
      el.addEventListener('pointerdown', function (e) {
        wake();
        var b = B[i]; if (!b || b.gone) return;
        var p = local(e);
        b.drag = { ox: p.x - b.x, oy: p.y - b.y, sx: e.clientX, sy: e.clientY, t: performance.now(), lx: p.x, ly: p.y, lt: performance.now(), moved: false };
        el.classList.add('is-grab');
        try { el.setPointerCapture(e.pointerId); } catch (x) {}
      });
      el.addEventListener('pointermove', function (e) {
        var b = B[i]; if (!b || !b.drag) return;
        var p = local(e), now = performance.now(), dd = b.drag;
        if (Math.abs(e.clientX - dd.sx) + Math.abs(e.clientY - dd.sy) > 8) dd.moved = true;
        var dtm = Math.max(8, now - dd.lt) / 1000;
        b.vx = (p.x - dd.lx) / dtm; b.vy = (p.y - dd.ly) / dtm;
        dd.lx = p.x; dd.ly = p.y; dd.lt = now;
        b.x = p.x - dd.ox; b.y = p.y - dd.oy;
      });
      function end(e) {
        var b = B[i]; if (!b || !b.drag) return;
        var dd = b.drag; b.drag = null; el.classList.remove('is-grab');
        if (e.type === 'pointerup' && !dd.moved && performance.now() - dd.t < 400) { pop(b); return; }
        b.vx = Math.max(-1600, Math.min(1600, b.vx)); b.vy = Math.max(-1600, Math.min(1600, b.vy)); b.free = 1.1;
      }
      el.addEventListener('pointerup', end);
      el.addEventListener('pointercancel', end);
    });
    var vis = field.parentNode;
    if (FINE) {
      vis.addEventListener('pointermove', function (e) { var p = local(e); pointer.x = p.x; pointer.y = p.y; pointer.on = true; wake(); });
      vis.addEventListener('pointerleave', function () { pointer.on = false; });
    } else {
      /* tilt relative to how the phone is being held (slowly adapting baseline) */
      addEventListener('deviceorientation', function (e) {
        if (e.gamma == null || !visible) return;
        if (tilt.bx === null) { tilt.bx = e.gamma; tilt.by = e.beta; }
        tilt.bx += (e.gamma - tilt.bx) * .02; tilt.by += (e.beta - tilt.by) * .02;
        var nx = Math.max(-1, Math.min(1, (e.gamma - tilt.bx) / 25)), ny = Math.max(-1, Math.min(1, (e.beta - tilt.by) / 25));
        tilt.x = Math.abs(nx) < .08 ? 0 : nx; tilt.y = Math.abs(ny) < .08 ? 0 : ny;
        if (tilt.x || tilt.y) wake();
      }, { passive: true });
    }
    var rt; addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(function () { if (awake) sleep(); measure(); }, 200); });
    document.addEventListener('adv:glyphs', function () { setTimeout(function () { if (awake) sleep(); measure(); }, 520); });
    document.addEventListener('visibilitychange', function () { if (document.hidden) pause(); else if (awake) wake(); });
    watch(vis, function (v) { visible = v; if (!v) { if (awake) sleep(); } });
  })();

  /* ================= micro-interactions ================= */
  /* Ripple on press: a span that scales out (transform + opacity), then removes itself. */
  document.addEventListener('pointerdown', function (e) {
    if (REDUCED) return;
    var el = e.target.closest('.btn, .opt, .qopt, .chip-btn, .wc-chip, .mbar-btn, .trail-chip');
    if (!el || el.disabled || !el.animate) return;
    var r = el.getBoundingClientRect(), s = document.createElement('span'), size = Math.max(r.width, r.height) * 2.2;
    s.className = 'ripple';
    s.style.width = s.style.height = size + 'px';
    s.style.left = (e.clientX - r.left - size / 2) + 'px'; s.style.top = (e.clientY - r.top - size / 2) + 'px';
    el.appendChild(s);
    s.animate([{ transform: 'scale(0)', opacity: .35 }, { transform: 'scale(1)', opacity: 0 }], { duration: 600, easing: 'cubic-bezier(.2,.8,.2,1)' }).onfinish = function () { s.remove(); };
  }, { passive: true });

  if (FINE && !REDUCED) {
    /* Magnetic main buttons */
    qsa('.btn-lg, .header-cta').forEach(function (b) {
      b.addEventListener('pointermove', function (e) {
        var r = b.getBoundingClientRect();
        b.style.transform = 'translate(' + ((e.clientX - r.left - r.width / 2) * .18).toFixed(1) + 'px,' + ((e.clientY - r.top - r.height / 2) * .3 - 2).toFixed(1) + 'px)';
      });
      b.addEventListener('pointerleave', function () { b.style.transform = ''; });
    });
    /* 3D tilt + light on course cards, finder options and Spanish cards */
    qsa('.course, .sp-card, .why').forEach(function (c) {
      c.classList.add('tilt');
      c.addEventListener('pointermove', function (e) {
        var r = c.getBoundingClientRect(), px = (e.clientX - r.left) / r.width - .5, py = (e.clientY - r.top) / r.height - .5;
        c.style.transform = 'perspective(900px) rotateX(' + (-py * 7).toFixed(2) + 'deg) rotateY(' + (px * 9).toFixed(2) + 'deg) translateY(-4px)';
        c.style.setProperty('--gx', (px * 100 + 50).toFixed(0) + '%');
        c.style.setProperty('--gy', (py * 100 + 50).toFixed(0) + '%');
      });
      c.addEventListener('pointerleave', function () { c.style.transform = ''; });
    });
  }

  /* ================= PASSPORT stamps ================= */
  near($('passport'), function passport() {
    var rows = qsa('.stamp-row'), countEl = $('pp-count'), pp = $('passport');
    if (!rows.length) return;
    var n = 0;
    function stampIt(row) {
      if (row.classList.contains('is-stamped')) return;
      row.classList.add('is-stamped'); n++;
      countEl.textContent = n;
      if (!REDUCED) {
        countEl.parentNode.classList.remove('is-bump'); void countEl.offsetWidth; countEl.parentNode.classList.add('is-bump');
        pp.classList.remove('is-thud'); void pp.offsetWidth; pp.classList.add('is-thud');
      }
    }
    if (REDUCED || !HAS_IO) { rows.forEach(stampIt); return; }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { stampIt(e.target); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -30% 0px', threshold: .6 });
    rows.forEach(function (r) { io.observe(r); });
  });

  /* ================= CEFR ladder climber ================= */
  near(document.querySelector('.ladder-wrap'), function climber() {
    var wrap = document.querySelector('.ladder-wrap'), cl = $('climber'), say = $('climber-say');
    if (!wrap || !cl) return;
    var rungs = qsa('.rung', wrap), pos = [], cur = -1, active = false, youLevel = null;
    var section = $('niveles');
    function layout() {
      var wr = wrap.getBoundingClientRect(), mobile = innerWidth < 900;
      pos = rungs.map(function (r) {
        var s = r.querySelector('.rung-step').getBoundingClientRect();
        return { x: s.left - wr.left + s.width / 2 - 22, y: mobile ? s.top - wr.top + 6 : s.top - wr.top - 50 };
      });
    }
    function go(i) {
      if (i === cur || !pos[i]) return;
      var up = i > cur; cur = i;
      cl.style.transform = 'translate(' + pos[i].x + 'px,' + pos[i].y + 'px)';
      say.textContent = rungs[i].querySelector('.rung-code').textContent;
      rungs.forEach(function (r, j) { r.classList.toggle('is-here', j === i); });
      if (!REDUCED) { cl.classList.remove('hop', 'hop-down'); void cl.offsetWidth; cl.classList.add(up ? 'hop' : 'hop-down'); }
    }
    function onScroll() {
      if (!active) return;
      var r = section.getBoundingClientRect(), vh = innerHeight;
      /* progress 0 when the ladder's top reaches 75% of the screen, 1 when its bottom passes 45% */
      var lr = wrap.getBoundingClientRect();
      var p = (vh * .75 - lr.top) / (lr.height + vh * .3);
      p = Math.max(0, Math.min(.999, p));
      var i = Math.floor(p * rungs.length);
      if (youLevel !== null && p > .95) i = youLevel;
      go(i);
      if (r.bottom < 0) active = false;
    }
    if (REDUCED) { layout(); cl.classList.add('is-static'); var k = 0; cur = -1; go(k); addEventListener('resize', function () { layout(); var c = cur; cur = -1; go(c); }); return; }
    A.addScroll(onScroll);
    watch(wrap, function (v) { active = v; if (v) { layout(); onScroll(); } }, '100px');
    addEventListener('resize', function () { layout(); var c = cur; cur = -1; go(Math.max(0, c)); });
    document.addEventListener('adv:level', function (e) {
      youLevel = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].indexOf(e.detail);
    });
  });

  /* ================= WORD OF THE DAY ================= */
  near($('word'), function word() {
    var root = $('word');
    if (!root) return;
    var WL = ['en', 'es', 'fr', 'de', 'ru', 'zh', 'ar'];
    var WORDS = [
      ['beach', 'playa', 'plage', 'Strand', 'пляж', '海滩', 'شاطئ'],
      ['friend', 'amigo', 'ami', 'Freund', 'друг', '朋友', 'صديق'],
      ['sun', 'sol', 'soleil', 'Sonne', 'солнце', '太阳', 'شمس'],
      ['book', 'libro', 'livre', 'Buch', 'книга', '书', 'كتاب'],
      ['coffee', 'café', 'café', 'Kaffee', 'кофе', '咖啡', 'قهوة'],
      ['school', 'escuela', 'école', 'Schule', 'школа', '学校', 'مدرسة'],
      ['sea', 'mar', 'mer', 'Meer', 'море', '海', 'بحر']
    ];
    var start = new Date(), doy = Math.floor((start - new Date(start.getFullYear(), 0, 0)) / 864e5);
    var wi = doy % WORDS.length, li = 0, auto = null, touched = false, solved = 0, done = false;
    var card = $('wc-card'), wEl = $('wc-word'), lEl = $('wc-lang'), chips = qsa('.wc-chip', root);
    var input = $('wc-input'), slots = $('wc-slots'), msg = $('wc-msg'), label = $('wc-label');
    function norm(s) { return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim(); }
    function target() { return lang() === 'en' ? WORDS[wi][1] : WORDS[wi][0]; }
    function prompt() { return lang() === 'en' ? WORDS[wi][0] : WORDS[wi][1]; }
    function showWord(i, animate) {
      li = i;
      var set = function () {
        wEl.textContent = WORDS[wi][i];
        wEl.setAttribute('lang', WL[i]);
        wEl.dir = WL[i] === 'ar' ? 'rtl' : 'ltr';
        lEl.textContent = D().langFull[WL[i]];
        chips.forEach(function (c, j) { c.setAttribute('aria-pressed', String(j === i)); });
      };
      if (!animate || REDUCED) { set(); return; }
      card.classList.remove('is-flip'); void card.offsetWidth; card.classList.add('is-flip');
      setTimeout(set, 180);
    }
    function buildSlots() {
      var t = Array.from(target());
      slots.innerHTML = t.map(function () { return '<span></span>'; }).join('');
      updateSlots();
    }
    function updateSlots() {
      var t = Array.from(norm(target())), v = Array.from(norm(input.value)), sp = slots.children;
      for (var i = 0; i < sp.length; i++) {
        var ch = v[i] || '';
        var cls = !ch ? '' : ch === t[i] ? 'ok' : 'no';
        if (sp[i].textContent !== ch) sp[i].textContent = ch;
        if (sp[i].className !== cls) sp[i].className = cls;
      }
    }
    function renderTexts() {
      label.textContent = D().wordAsk(prompt());
      chips.forEach(function (c) {
        var l = c.dataset.wl;
        c.innerHTML = '<span aria-hidden="true">' + l.toUpperCase() + '</span><span class="sr-only">' + D().langFull[l] + '</span>';
      });
      lEl.textContent = D().langFull[WL[li]];
      $('wc-day').textContent = D().wordDay + ' · ' + new Intl.DateTimeFormat(lang() === 'en' ? 'en-GB' : 'es-ES', { day: 'numeric', month: 'long' }).format(start);
      input.setAttribute('lang', lang() === 'en' ? 'es' : 'en');
      $('wc-score').textContent = solved ? D().wordScore(solved) : '';
      if (done) msg.textContent = D().wordOk(target()); else msg.textContent = '';
      input.value = ''; done = false; root.classList.remove('is-solved');
      buildSlots();
    }
    A.onLang(renderTexts);
    chips.forEach(function (c, j) { c.addEventListener('click', function () { touched = true; stopAuto(); showWord(j, true); }); });
    input.addEventListener('input', function () { touched = true; stopAuto(); updateSlots(); if (msg.textContent && !done) msg.textContent = ''; });
    $('wc-play').addEventListener('submit', function (e) {
      e.preventDefault();
      if (!input.value.trim()) { msg.textContent = D().wordEmpty; return; }
      if (norm(input.value) === norm(target())) {
        if (!done) { solved++; done = true; }
        msg.textContent = D().wordOk(target());
        root.classList.add('is-solved');
        $('wc-score').textContent = D().wordScore(solved);
        A.confetti($('wc-confetti'), .8);
        showWord(lang() === 'en' ? 1 : 0, true);
      } else {
        msg.textContent = D().wordNo;
        if (!REDUCED) { slots.classList.remove('is-shake'); void slots.offsetWidth; slots.classList.add('is-shake'); }
      }
    });
    $('wc-hint').addEventListener('click', function () { msg.textContent = D().wordHintTxt(target()); });
    $('wc-next').addEventListener('click', function () {
      wi = (wi + 1) % WORDS.length; done = false; root.classList.remove('is-solved');
      input.value = ''; msg.textContent = ''; label.textContent = D().wordAsk(prompt()); buildSlots(); showWord(0, true);
    });
    function stopAuto() { if (auto) { clearInterval(auto); auto = null; } }
    /* Cycles through the seven languages while visible and untouched. */
    watch(root, function (v) {
      if (v && !touched && !REDUCED && !auto) auto = setInterval(function () { showWord((li + 1) % WL.length, true); }, 2200);
      else if (!v) stopAuto();
    });
    renderTexts(); showWord(0, false);
  });

  /* ================= CAMBRIDGE split-flap board ================= */
  near($('flaps'), function board() {
    var flaps = $('flaps');
    if (!flaps) return;
    var EXAMS = ['A2 KEY', 'B1 PRELIMINARY', 'B2 FIRST', 'C1 ADVANCED', 'C2 PROFICIENCY'];
    var N = 14, cells = [], k = 0, timer = null;
    for (var i = 0; i < N; i++) { var c = document.createElement('span'); c.className = 'flap'; c.textContent = ' '; flaps.appendChild(c); cells.push(c); }
    function show(word, animate) {
      var txt = (word + '              ').slice(0, N);
      cells.forEach(function (c, i) {
        var ch = txt.charAt(i);
        if (c.textContent === ch) return;
        if (!animate || REDUCED) { c.textContent = ch; return; }
        setTimeout(function () {
          c.classList.remove('is-flip'); void c.offsetWidth; c.classList.add('is-flip');
          setTimeout(function () { c.textContent = ch; }, 110);
        }, i * 38);
      });
    }
    show(EXAMS[0], false);
    if (REDUCED) return;
    watch(flaps.closest('.board'), function (v) {
      if (v && !timer) timer = setInterval(function () { k = (k + 1) % EXAMS.length; show(EXAMS[k], true); }, 2800);
      else if (!v && timer) { clearInterval(timer); timer = null; }
    });
  });
  once($('exam-journey'), function () { $('exam-journey').classList.add('in'); }, { threshold: .5 });

  /* ================= SPANISH scroll scene: JS fallback only ================= */
  (function scene() {
    var sc = $('scene');
    if (!sc) return;
    if (REDUCED) { sc.classList.add('is-static'); return; }
    var cssDriven = window.CSS && CSS.supports('animation-timeline: view()');
    if (cssDriven) return;
    sc.classList.add('is-js');
    var near = sc.querySelector('.sc-near'), mid = sc.querySelector('.sc-mid'), far = sc.querySelector('.sc-far');
    var caps = qsa('.sc-cap', sc), says = qsa('.sw', sc), dots = qsa('.sc-dots li', sc);
    var dusk = sc.querySelector('.sc-dusk'), sun = sc.querySelector('.sc-sun'), active = false;
    var sea = sc.querySelector('.sc-beach'), hor = sc.querySelector('.sc-horizon');
    function lerp(pts, p) {
      for (var i = 1; i < pts.length; i++) if (p <= pts[i][0]) {
        var a = pts[i - 1], b = pts[i], f = (p - a[0]) / ((b[0] - a[0]) || 1);
        return a[1] + (b[1] - a[1]) * f;
      }
      return pts[pts.length - 1][1];
    }
    var PAN = [[0, 0], [.1, 0], [.3, 1], [.4, 1], [.6, 2], [.7, 2], [.9, 3], [1, 3]];
    var CAP = [
      [[0, 1], [.16, 1], [.21, 0], [1, 0]],
      [[0, 0], [.24, 0], [.29, 1], [.44, 1], [.49, 0], [1, 0]],
      [[0, 0], [.54, 0], [.59, 1], [.72, 1], [.77, 0], [1, 0]],
      [[0, 0], [.81, 0], [.86, 1], [1, 1]]
    ];
    function tick() {
      if (!active) return;
      var r = sc.getBoundingClientRect(), span = r.height - innerHeight;
      var p = Math.max(0, Math.min(1, -r.top / (span || 1)));
      var s = lerp(PAN, p) / 3;
      near.style.transform = 'translateX(' + (-75 * s) + '%)';
      mid.style.transform = 'translateX(' + (-60 * s) + '%)';
      far.style.transform = 'translateX(' + (-37.5 * s) + '%)';
      caps.forEach(function (c, i) { var o = lerp(CAP[i], p); c.style.opacity = o; c.style.transform = 'translateY(' + ((1 - o) * 14) + 'px)'; });
      says.forEach(function (c, i) { c.style.opacity = lerp(CAP[i], p); });
      dots.forEach(function (d, i) { d.style.setProperty('opacity', lerp(CAP[i], p) > .5 ? 1 : .35); });
      /* beach step: foreground sea rises, the town slides down behind it, horizon band fades */
      var beach = lerp([[0, 0], [.49, 0], [.58, 1], [.72, 1], [.8, 0], [1, 0]], p);
      sea.style.transform = 'translateY(' + ((1 - beach) * 102) + '%)';
      hor.style.transform = 'translateY(' + (beach * 40) + '%)'; hor.style.opacity = 1 - beach;
      mid.style.transform = 'translateX(' + (-60 * s) + '%) translateY(' + (beach * 60) + '%)'; mid.style.opacity = 1 - beach;
      dusk.style.opacity = Math.max(0, (p - .45) / .55);
      sun.style.transform = 'translateY(' + (p * 60) + '%)';
    }
    A.addScroll(tick);
    watch(sc, function (v) { active = v; if (v) tick(); });
  })();

  /* ================= count-ups ================= */
  function countUp(el, to, dec, suffix, fmt) {
    if (REDUCED) return;
    var t0 = 0, dur = 1100, final = el.textContent;
    (function f(t) {
      if (!t0) t0 = t;
      var k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3), v = to * e;
      el.textContent = k < 1 ? fmt(v.toFixed(dec)) + suffix : final;
      if (k < 1) requestAnimationFrame(f);
    })(performance.now());
  }
  qsa('.why-n').forEach(function (el) {
    var m = el.textContent.match(/^(\d+)(\s?%?)$/);
    if (!m) return;
    once(el, function () { countUp(el, +m[1], 0, m[2], String); }, { threshold: .8 });
  });
  var rev = document.querySelector('.rev-num');
  once(rev, function () {
    countUp(rev, 4.8, 1, '', function (s) { return lang() === 'en' ? s : s.replace('.', ','); });
  }, { threshold: .6 });
})();
