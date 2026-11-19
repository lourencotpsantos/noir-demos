/* Notaría Sánchez · Membrado concept by Noir Digital */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var store = {
    get: function (k, d) { try { var v = localStorage.getItem('nsm-' + k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem('nsm-' + k, JSON.stringify(v)); } catch (e) {} }
  };
  var lang = document.documentElement.lang === 'en' ? 'en' : 'es', langTouched = false;
  var U = function () { return NSM.ui[lang]; };
  var L = function (o) { return o[lang] || o.es; };
  var esc = function (t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };

  /* ---------- i18n for static text ---------- */
  var ES = {}, ESA = [];
  $$('[data-i18n]').forEach(function (el) { ES[el.dataset.i18n] = ES[el.dataset.i18n] || el.innerHTML; });
  $$('[data-i18n-attr]').forEach(function (el) {
    el.dataset.i18nAttr.split(';').forEach(function (pair) { var p = pair.split(':'); ESA.push([el, p[0], p[1], el.getAttribute(p[0])]); });
  });
  var esTitle = document.title, esDesc = $('meta[name="description"]').content;
  function applyStatic() {
    document.documentElement.lang = lang;
    $$('[data-i18n]').forEach(function (el) {
      var k = el.dataset.i18n; var v = lang === 'en' ? NSM.en[k] : ES[k];
      if (v != null && el.innerHTML !== v) el.innerHTML = v;
    });
    ESA.forEach(function (a) { var v = lang === 'en' ? NSM.en[a[2]] : a[3]; if (v != null) a[0].setAttribute(a[1], v); });
    document.title = lang === 'en' ? 'Notaría Sánchez Aguilera · Membrado Martínez · Notary on Calle Larios, Málaga' : esTitle;
    $('meta[name="description"]').content = lang === 'en' ? 'Notary office at C/ Marqués de Larios 6, 2nd floor, Málaga. What to bring for each procedure, a property purchase guide for foreign buyers and appointment requests.' : esDesc;
    $$('.lang-btn').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.lang === lang)); });
    splitWords();
  }
  /* Headline revealed word by word */
  function splitWords() {
    var n = 0;
    $$('[data-words]').forEach(function (el) {
      var words = el.textContent.trim().split(/\s+/);
      el.innerHTML = words.map(function (w) { n++; return '<span class="w"><span style="--d:' + n + '">' + esc(w) + '</span></span>'; }).join(' ');
    });
  }
  function setLang(l) { lang = l; if (!langTouched) $('#f-lang').value = l; store.set('lang', l); try { localStorage.setItem('nsm-lang', l); } catch (e) {} applyStatic(); renderAll(); }
  $$('.lang-btn').forEach(function (b) { b.addEventListener('click', function () { if (b.dataset.lang !== lang) setLang(b.dataset.lang); }); });

  /* ---------- Header state ---------- */
  var header = $('.site-header'), scrolled = false;
  function onHead() { var s = window.scrollY > 10; if (s !== scrolled) { scrolled = s; header.classList.toggle('scrolled', s); } }
  window.addEventListener('scroll', onHead, { passive: true }); onHead();

  /* ---------- Reveal + seal pause ---------- */
  if ('IntersectionObserver' in window && !reduce) {
    var rio = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); rio.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    $$('.sec-head, .person, .proof, .sheet, .passport, .pp-notes, .letter-wrap, .contact-list, .addr').forEach(function (el) { el.classList.add('rv'); rio.observe(el); });
    var seal = $('.seal');
    new IntersectionObserver(function (es) { seal.classList.toggle('spin', es[0].isIntersecting); }).observe(seal);
  }
  requestAnimationFrame(function () { document.documentElement.classList.add('ready'); });

  /* ---------- Hero: layered parallax (scroll + gentle pointer), only while the hero is on screen ---------- */
  var hero = $('#inicio'), heroOn = true, hTick = false, layers = {
    sky: $('.hero .sky'), street: $('.hero .street'), wl: $('.hero .wl'), wr: $('.hero .wr'), haze: $('.hero .haze'), copy: $('#hero-copy')
  };
  var mx = 0, my = 0, tx = 0, ty = 0, finePointer = window.matchMedia('(pointer: fine)').matches;
  function paintHero() {
    hTick = false;
    var y = window.scrollY, h = hero.offsetHeight || 1;
    if (y > h) return;
    mx += (tx - mx) * 0.08; my += (ty - my) * 0.08;
    layers.sky.style.transform = 'translate3d(' + (mx * -6).toFixed(2) + 'px,' + (y * 0.08 + my * -4).toFixed(2) + 'px,0)';
    layers.street.style.transform = 'translate3d(' + (mx * -12).toFixed(2) + 'px,' + (y * 0.22 + my * -8).toFixed(2) + 'px,0) scale(' + (1.06 + y / h * 0.04).toFixed(4) + ')';
    layers.wl.style.transform = 'translate3d(' + (mx * -26 - y * 0.1).toFixed(2) + 'px,' + (y * 0.42 + my * -14).toFixed(2) + 'px,0)';
    layers.wr.style.transform = 'translate3d(' + (mx * -26 + y * 0.1).toFixed(2) + 'px,' + (y * 0.42 + my * -14).toFixed(2) + 'px,0)';
    layers.haze.style.opacity = (Math.min(1, y / h) * 0.85).toFixed(3);
    layers.copy.style.transform = 'translate3d(0,' + (y * -0.12).toFixed(2) + 'px,0)';
    if (Math.abs(tx - mx) > 0.002 || Math.abs(ty - my) > 0.002) queueHero();
  }
  function queueHero() { if (heroOn && !hTick && !reduce) { hTick = true; requestAnimationFrame(paintHero); } }
  if (!reduce) {
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { heroOn = es[0].isIntersecting; hero.classList.toggle('on', heroOn); if (heroOn) queueHero(); }).observe(hero);
    window.addEventListener('scroll', queueHero, { passive: true });
    if (finePointer) hero.addEventListener('pointermove', function (e) { tx = e.clientX / window.innerWidth - 0.5; ty = e.clientY / window.innerHeight - 0.5; queueHero(); }, { passive: true });
  }

  /* ---------- Checklist builder ---------- */
  var procs = NSM.procs;
  var cur = store.get('proc', 'compra');
  if (!procs.some(function (p) { return p.id === cur; })) cur = 'compra';
  var answers = store.get('ans', {});
  var ticks = store.get('ticks', {});
  var procEl = $('#proc-list'), optsEl = $('#opts'), bodyEl = $('#sheet-body');
  function P() { return procs.filter(function (p) { return p.id === cur; })[0]; }
  function state(p) {
    var a = answers[p.id] || {}, s = {};
    p.q.forEach(function (q) { s[q.id] = a[q.id] !== undefined ? a[q.id] : q.d; });
    return s;
  }
  function visibleItems(p, s) {
    var out = [];
    p.g.forEach(function (g, gi) {
      if (g.w && !g.w(s)) return;
      var items = [];
      g.i.forEach(function (it, ii) { if (!it.w || it.w(s)) items.push({ it: it, key: p.id + '.' + gi + '.' + ii }); });
      if (items.length) out.push({ g: g, items: items });
    });
    return out;
  }
  function renderProcs() {
    procEl.innerHTML = procs.map(function (p) {
      var on = p.id === cur;
      return '<button type="button" role="tab" class="proc" id="tab-' + p.id + '" aria-selected="' + on + '" aria-controls="sheet" tabindex="' + (on ? 0 : -1) + '" data-id="' + p.id + '">' +
        '<span class="proc-n">' + p.n + '</span><span class="proc-t">' + esc(L(p.t)) + '</span><span class="proc-s">' + esc(L(p.s)) + '</span></button>';
    }).join('');
  }
  procEl.addEventListener('click', function (e) { var b = e.target.closest('.proc'); if (b && b.dataset.id !== cur) selectProc(b.dataset.id); });
  procEl.addEventListener('keydown', function (e) {
    var i = procs.findIndex(function (p) { return p.id === cur; }), n = procs.length, j = -1;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') j = (i + 1) % n;
    else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') j = (i - 1 + n) % n;
    else if (e.key === 'Home') j = 0; else if (e.key === 'End') j = n - 1;
    if (j > -1) { e.preventDefault(); selectProc(procs[j].id); $('#tab-' + procs[j].id).focus(); }
  });
  function selectProc(id) { cur = id; store.set('proc', id); renderProcs(); renderOpts(); renderSheet(true); syncFormProc(); }

  function renderOpts() {
    var p = P(), s = state(p);
    optsEl.innerHTML = p.q.filter(function (q) { return !q.when || q.when(s); }).map(function (q) {
      var choices = q.type === 'yn' ? [[true, { es: 'Sí', en: 'Yes' }], [false, { es: 'No', en: 'No' }]] : q.c;
      return '<div class="q"><p class="q-t" id="q-' + q.id + '">' + esc(L(q.t)) + '</p><div class="seg" role="group" aria-labelledby="q-' + q.id + '">' +
        choices.map(function (c) {
          return '<button type="button" class="seg-b" data-q="' + q.id + '" data-v="' + c[0] + '" aria-pressed="' + (s[q.id] === c[0]) + '">' + esc(L(c[1])) + '</button>';
        }).join('') + '</div></div>';
    }).join('');
  }
  optsEl.addEventListener('click', function (e) {
    var b = e.target.closest('.seg-b'); if (!b) return;
    var p = P(), q = p.q.filter(function (x) { return x.id === b.dataset.q; })[0];
    var v = b.dataset.v; if (q.type === 'yn') v = v === 'true';
    answers[p.id] = answers[p.id] || {}; answers[p.id][q.id] = v; store.set('ans', answers);
    renderOpts(); renderSheet(true);
    var again = optsEl.querySelector('.seg-b[data-q="' + q.id + '"][data-v="' + b.dataset.v + '"]'); if (again) again.focus();
  });

  function renderSheet(anim) {
    var p = P(), s = state(p), groups = visibleItems(p, s), t = ticks[p.id] || {};
    $('#sheet-title').textContent = L(p.t);
    var k = 0;
    bodyEl.innerHTML = groups.map(function (gr) {
      return '<div class="grp"><p class="grp-t">' + esc(L(gr.g.t)) + '</p><ul class="items">' + gr.items.map(function (x) {
        k++;
        return '<li class="item' + (t[x.key] ? ' done' : '') + '" style="--i:' + k + '"><label><input type="checkbox" data-key="' + x.key + '"' + (t[x.key] ? ' checked' : '') + '>' +
          '<span class="box" aria-hidden="true"><svg><use href="#i-check"/></svg></span><span class="it"><span class="it-t">' + esc(L(x.it.t)) + '</span>' +
          (x.it.n ? '<span class="it-n">' + esc(L(x.it.n)) + '</span>' : '') + '</span></label></li>';
      }).join('') + '</ul></div>';
    }).join('');
    if (anim && !reduce) { bodyEl.classList.remove('swap'); void bodyEl.offsetWidth; bodyEl.classList.add('swap'); }
    updateProgress(false);
  }
  bodyEl.addEventListener('change', function (e) {
    var c = e.target; if (!c.dataset.key) return;
    ticks[cur] = ticks[cur] || {}; if (c.checked) ticks[cur][c.dataset.key] = 1; else delete ticks[cur][c.dataset.key];
    store.set('ticks', ticks); c.closest('.item').classList.toggle('done', c.checked);
    if (c.checked && !reduce) flyCard(c.closest('.item'));
    updateProgress(true);
  });
  /* Folder: ticked documents fly in as paper cards and stack; closes with a clasp, then the stamp lands */
  var folder = $('#folder'), fStack = $('#f-stack'), closeTimer = 0, stackN = -1;
  function renderStack(n) {
    if (n === stackN) return;
    var show = Math.min(n, 12), html = '';
    for (var i = 0; i < show; i++) html += '<span class="paper" style="--n:' + i + ';--r:' + (((i * 37) % 7) - 3) * 0.6 + 'deg"></span>';
    fStack.innerHTML = html; stackN = n;
  }
  function flyCard(item) {
    var r = item.getBoundingClientRect(), f = fStack.getBoundingClientRect();
    if (f.bottom < 0 || f.top > window.innerHeight || !f.width) return;
    var g = document.createElement('div'), h = Math.min(r.height, 64);
    g.className = 'ghost'; g.setAttribute('aria-hidden', 'true');
    g.textContent = item.querySelector('.it-t').textContent;
    g.style.left = r.left + 'px'; g.style.top = r.top + 'px'; g.style.width = r.width + 'px'; g.style.height = h + 'px';
    document.body.appendChild(g);
    var sc = Math.min(1, (f.width * 0.86) / r.width);
    var dx = f.left + f.width / 2 - (r.left + r.width / 2), dy = f.top + 6 - (r.top + h / 2);
    void g.offsetWidth;
    g.style.transform = 'translate3d(' + dx.toFixed(1) + 'px,' + dy.toFixed(1) + 'px,0) scale(' + sc.toFixed(3) + ') rotate(-4deg)';
    g.style.opacity = '0.0';
    setTimeout(function () { if (g.parentNode) g.parentNode.removeChild(g); }, 760);
  }

  var lastFull = false;
  function updateProgress(announce) {
    var all = $$('input[data-key]', bodyEl), done = all.filter(function (c) { return c.checked; }).length;
    $('#pr-num').textContent = done + '/' + all.length;
    $('#pr-fill').style.transform = 'scaleX(' + (all.length ? done / all.length : 0) + ')';
    var full = all.length > 0 && done === all.length;
    renderStack(done);
    $('#f-label').textContent = L(P().t);
    $('#f-count').textContent = done + '/' + all.length;
    clearTimeout(closeTimer);
    if (full && !lastFull && announce) {
      var fr = folder.getBoundingClientRect(), vis = fr.top > 0 && fr.bottom < window.innerHeight;
      if (!vis) folder.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
      closeTimer = setTimeout(function () { folder.classList.add('closed'); $('#sheet').classList.add('sealed'); }, vis || reduce ? 380 : 900);
    } else if (full && !announce) { folder.classList.add('closed'); }
    if (!full) { folder.classList.remove('closed'); $('#sheet').classList.remove('sealed'); }
    lastFull = full;
    if (announce) $('#pr-live').textContent = done + ' ' + U().of + ' ' + all.length + ' ' + U().ready;
  }
  function listText(withTicks) {
    var p = P(), s = state(p), t = ticks[p.id] || {}, lines = [U().listHead + ' · ' + L(p.t)];
    visibleItems(p, s).forEach(function (gr) {
      lines.push('', L(gr.g.t).toUpperCase());
      gr.items.forEach(function (x) { lines.push((withTicks ? (t[x.key] ? '[x] ' : '[ ] ') : '- ') + L(x.it.t)); });
    });
    lines.push('', lang === 'en' ? 'Guidance only: confirm the exact documents with the notary.' : 'Orientativo: confirme la documentación exacta con la notaría.');
    return lines.join('\n');
  }
  function mailtoHref(to, subj, body) { return 'mailto:' + to + '?subject=' + encodeURIComponent(subj) + '&body=' + encodeURIComponent(body); }
  $('#btn-mail-list').addEventListener('click', function (e) {
    e.preventDefault(); window.location.href = mailtoHref('', U().mailSubj + ' · ' + L(P().t), listText(true));
  });
  $('#btn-print').addEventListener('click', function () {
    var p = P(), s = state(p), t = ticks[p.id] || {};
    $('#print-sheet').innerHTML = '<p class="ps-k">Notaría Sánchez · Membrado</p><h2>' + esc(L(p.t)) + '</h2>' +
      visibleItems(p, s).map(function (gr) {
        return '<h3>' + esc(L(gr.g.t)) + '</h3><ul>' + gr.items.map(function (x) { return '<li><span class="pb">' + (t[x.key] ? '&#10003;' : '') + '</span>' + esc(L(x.it.t)) + (x.it.n ? '<small>' + esc(L(x.it.n)) + '</small>' : '') + '</li>'; }).join('') + '</ul>';
      }).join('') + '<p class="ps-f">' + esc(U().printed) + '</p>';
    window.print();
  });
  $('#btn-book-list').addEventListener('click', function () { syncFormProc(); $('#f-list').checked = true; updateLetter(); });

  /* ---------- Timeline ---------- */
  var tl = $('#tl'), mort = store.get('mort', true), forB = store.get('for', false);
  function renderTimeline() {
    $$('.tl-step', tl).forEach(function (n) { n.remove(); });
    var html = NSM.steps.map(function (st, i) {
      return '<li class="tl-step" data-f="' + (st.f || '') + '" data-i="' + i + '"><span class="tl-dot" aria-hidden="true"><span></span></span>' +
        '<div class="tl-card"><div class="tl-top"><p class="tl-n"></p><span class="tl-ic" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="' + st.ic + '"/></svg></span></div><h3 class="tl-t">' + esc(L(st.t)) + '</h3><p class="tl-d">' + esc(L(st.d)) + '</p>' +
        '<button type="button" class="tl-more" aria-expanded="false" aria-controls="tlp-' + i + '"><span>' + esc(U().open) + '</span><svg class="ic" aria-hidden="true"><use href="#i-plus"/></svg></button>' +
        '<dl class="tl-panel" id="tlp-' + i + '" hidden><div><dt>' + esc(U().who) + '</dt><dd>' + esc(L(st.who)) + '</dd></div><div class="tl-role"><dt>' + esc(U().notary) + '</dt><dd>' + esc(L(st.nt)) + '</dd></div></dl></div></li>';
    }).join('') + '<li class="tl-end"><span class="tl-ring" aria-hidden="true"><svg viewBox="0 0 24 24"><use href="#i-key"/></svg></span><div><p class="tl-end-t">' + esc(U().endT) + '</p><p class="tl-end-d">' + esc(U().endD) + '</p></div></li>';
    $$('.tl-end', tl).forEach(function (n) { tl.removeChild(n); });
    tl.insertAdjacentHTML('beforeend', html);
    applyCase(false);
  }
  function applyCase(anim) {
    $('#tg-mort').setAttribute('aria-pressed', String(mort));
    $('#tg-for').setAttribute('aria-pressed', String(forB));
    var n = 0;
    $$('.tl-step', tl).forEach(function (li) {
      var f = li.dataset.f, show = !f || (f === 'mort' && mort) || (f === 'for' && forB);
      if (show) {
        n++; li.querySelector('.tl-n').textContent = (n < 10 ? '0' : '') + n;
        if (li.hidden) { li.hidden = false; if (anim && !reduce) { li.classList.add('enter'); void li.offsetWidth; li.classList.remove('enter'); } }
      } else if (!li.hidden) {
        if (anim && !reduce) { li.classList.add('leave'); setTimeout(function () { li.hidden = true; li.classList.remove('leave'); measureTl(); }, 260); }
        else li.hidden = true;
      }
    });
    $('#buy-count').textContent = n + ' ' + U().steps;
    if (tlOn) measureTl();
  }
  $('#tg-mort').addEventListener('click', function () { mort = !mort; store.set('mort', mort); applyCase(true); });
  $('#tg-for').addEventListener('click', function () { forB = !forB; store.set('for', forB); applyCase(true); });
  tl.addEventListener('click', function (e) {
    var b = e.target.closest('.tl-more'); if (!b) return;
    var open = b.getAttribute('aria-expanded') !== 'true', panel = document.getElementById(b.getAttribute('aria-controls'));
    b.setAttribute('aria-expanded', String(open)); panel.hidden = !open;
    b.querySelector('span').textContent = open ? U().close : U().open;
    b.closest('.tl-step').classList.toggle('open', open);
    measureTl();
  });
  /* Scroll-linked rail: one rAF per scroll event, only while the timeline is on screen */
  var fill = $('#tl-fill'), key = $('#tl-key'), tlTop = 0, tlH = 1, dots = [], tlOn = false, ticking = false, endY = 1;
  function measureTl() {
    var r = tl.getBoundingClientRect(); tlTop = r.top + window.scrollY; tlH = Math.max(1, r.height);
    dots = $$('.tl-step:not([hidden])', tl).map(function (li) { return [li, li.offsetTop + 28]; });
    var end = $('.tl-end', tl); endY = end ? end.offsetTop + 22 : tlH;
    paintTl();
  }
  function paintTl() {
    ticking = false;
    var p = (window.scrollY + window.innerHeight * 0.62 - tlTop) / tlH; p = Math.max(0, Math.min(1, p));
    if (reduce) p = 1;
    fill.style.transform = 'scaleY(' + p.toFixed(4) + ')';
    var y = p * tlH, ky = Math.min(y, endY);
    key.style.transform = 'translate3d(-50%,' + ky.toFixed(1) + 'px,0) rotate(' + (ky * 0.25).toFixed(1) + 'deg)';
    var handed = y >= endY - 2; if (tl.classList.contains('handed') !== handed) tl.classList.toggle('handed', handed);
    for (var i = 0; i < dots.length; i++) { var on = dots[i][1] <= y; if (dots[i][0].classList.contains('lit') !== on) dots[i][0].classList.toggle('lit', on); }
  }
  function onTlScroll() { if (tlOn && !ticking) { ticking = true; requestAnimationFrame(paintTl); } }
  if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { tlOn = es[0].isIntersecting; if (tlOn) measureTl(); }).observe(tl);
  window.addEventListener('scroll', onTlScroll, { passive: true });
  window.addEventListener('resize', function () { measureTl(); }, { passive: true });
  window.addEventListener('load', function () { if (tlOn) measureTl(); });

  /* ---------- La firma: scroll-driven deed (one rAF per scroll event, only while on screen) ---------- */
  var track = $('#firma-track'), deed = $('#deed'), dseal = $('#dd-seal'), sigCover = $('#sig-cover'), nib = $('#nib'), sigBox = $('#sig');
  var dls = $$('.dl', deed), fsteps = $$('#firma-steps li'), fe = $('.dd-fe');
  var fTop = 0, fRange = 1, fOn = false, fTick = false, samples = [], sigW = 1, sigH = 1;
  /* Pen positions along #sig-path, precomputed ([x, y, running max x] as fractions of the 300x110 viewBox) */
  samples = [[0.04,0.673,0.04],[0.048,0.625,0.048],[0.056,0.577,0.056],[0.064,0.531,0.064],[0.074,0.485,0.074],[0.084,0.441,0.084],[0.095,0.399,0.095],[0.108,0.36,0.108],[0.123,0.328,0.123],[0.141,0.312,0.141],[0.159,0.332,0.159],[0.169,0.375,0.169],[0.176,0.424,0.176],[0.179,0.475,0.179],[0.179,0.528,0.179],[0.177,0.58,0.179],[0.174,0.631,0.179],[0.171,0.683,0.179],[0.167,0.734,0.179],[0.167,0.786,0.179],[0.182,0.812,0.182],[0.2,0.8,0.2],[0.217,0.776,0.217],[0.232,0.743,0.232],[0.245,0.705,0.245],[0.257,0.664,0.257],[0.268,0.621,0.268],[0.279,0.578,0.279],[0.29,0.534,0.29],[0.301,0.491,0.301],[0.312,0.45,0.312],[0.326,0.412,0.326],[0.342,0.383,0.342],[0.36,0.374,0.36],[0.378,0.389,0.378],[0.39,0.429,0.39],[0.393,0.48,0.393],[0.392,0.532,0.393],[0.39,0.584,0.393],[0.387,0.636,0.393],[0.388,0.688,0.393],[0.398,0.729,0.398],[0.417,0.729,0.417],[0.435,0.711,0.435],[0.451,0.684,0.451],[0.467,0.652,0.467],[0.481,0.617,0.481],[0.494,0.579,0.494],[0.507,0.541,0.507],[0.52,0.503,0.52],[0.535,0.468,0.535],[0.551,0.443,0.551],[0.57,0.438,0.57],[0.588,0.457,0.588],[0.6,0.496,0.6],[0.603,0.547,0.603],[0.602,0.599,0.603],[0.599,0.651,0.603],[0.601,0.702,0.603],[0.619,0.717,0.619],[0.638,0.705,0.638],[0.655,0.685,0.655],[0.672,0.66,0.672],[0.688,0.631,0.688],[0.704,0.601,0.704],[0.719,0.569,0.719],[0.734,0.538,0.734],[0.75,0.509,0.75],[0.767,0.484,0.767],[0.785,0.468,0.785],[0.804,0.465,0.804],[0.823,0.476,0.823],[0.842,0.485,0.842],[0.861,0.478,0.861],[0.878,0.455,0.878],[0.893,0.424,0.893],[0.907,0.388,0.907],[0.92,0.35,0.92],[0.933,0.312,0.933],[0.947,0.274,0.947],[0.96,0.236,0.96]];
  function clamp(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
  function ease(t) { return 1 - Math.pow(1 - t, 3); }
  function measureF() {
    var headH = header.offsetHeight, r = track.getBoundingClientRect();
    fTop = r.top + window.scrollY - headH;
    fRange = Math.max(1, track.offsetHeight - track.firstElementChild.offsetHeight);
    sigW = sigBox.offsetWidth; sigH = sigBox.offsetHeight;
    paintF();
  }
  function paintF() {
    fTick = false;
    var p = reduce ? 1 : clamp((window.scrollY - fTop) / fRange);
    var a = ease(clamp(p / 0.2));
    deed.style.transform = 'translate3d(0,' + ((1 - a) * 46).toFixed(2) + 'vh,0) rotate(' + ((1 - a) * -6 + 1.2 * a).toFixed(2) + 'deg)';
    deed.style.opacity = a.toFixed(3);
    for (var i = 0; i < dls.length; i++) { var on = p > 0.17 + i * 0.024; if (dls[i].classList.contains('on') !== on) dls[i].classList.toggle('on', on); }
    var s = clamp((p - 0.47) / 0.07), es = ease(s);
    dseal.style.transform = 'scale(' + (1.7 - 0.7 * es).toFixed(3) + ') rotate(' + ((1 - es) * -24 - 8).toFixed(2) + 'deg)';
    dseal.style.opacity = s.toFixed(3);
    var pressed = s >= 1; if (dseal.classList.contains('pressed') !== pressed) dseal.classList.toggle('pressed', pressed);
    var g = clamp((p - 0.58) / 0.24), k = samples[Math.round(g * (samples.length - 1))];
    sigCover.style.transform = 'translate3d(' + (g > 0.995 ? 105 : k[2] * 100).toFixed(2) + '%,0,0)';
    nib.style.transform = 'translate3d(' + (k[0] * sigW).toFixed(1) + 'px,' + (k[1] * sigH).toFixed(1) + 'px,0)';
    nib.style.opacity = g > 0 && g < 1 ? 1 : 0;
    var f = p > 0.86; if (fe.classList.contains('on') !== f) fe.classList.toggle('on', f);
    var th = [0.16, 0.32, 0.47, 0.6], cur = -1;
    for (var j = 0; j < 4; j++) if (p >= th[j]) cur = j;
    for (var n = 0; n < fsteps.length; n++) {
      var o = n <= cur, c = n === Math.max(cur, 0);
      if (fsteps[n].classList.contains('on') !== o) fsteps[n].classList.toggle('on', o);
      if (fsteps[n].classList.contains('cur') !== c) fsteps[n].classList.toggle('cur', c);
    }
  }
  if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { fOn = es[0].isIntersecting; if (fOn) measureF(); }).observe(track);
  window.addEventListener('scroll', function () { if (fOn && !fTick) { fTick = true; requestAnimationFrame(paintF); } }, { passive: true });
  window.addEventListener('resize', measureF, { passive: true });
  window.addEventListener('load', function () { if (fOn) measureF(); });

  /* ---------- Foreign buyer's map: passport stamped at each stage ---------- */
  var PP = NSM.passport, ppIdx = store.get('ppIdx', 0), ppMax = store.get('ppMax', -1), ppTimer = 0, ppSeen = false;
  var routeEl = $('#route'), gridEl = $('#stamp-grid'), panelEl = $('#pp-panel');
  if (ppIdx > PP.length - 1) ppIdx = 0;
  function two(n) { return (n < 10 ? '0' : '') + n; }
  function renderPassport(pressIdx) {
    routeEl.innerHTML = PP.map(function (st, i) {
      var on = i === ppIdx;
      return '<button type="button" role="tab" class="rt' + (i <= ppMax ? ' done' : '') + '" id="rt-' + i + '" aria-selected="' + on + '" aria-controls="pp-panel" tabindex="' + (on ? 0 : -1) + '" data-i="' + i + '">' +
        '<span class="rt-dot" aria-hidden="true"></span><span class="rt-n">' + two(i + 1) + '</span><span class="rt-t">' + esc(L({ es: st.es.s, en: st.en.s })) + '</span></button>';
    }).join('') + '<span class="rt-line" aria-hidden="true"><span class="rt-fill" id="rt-fill"></span></span>';
    gridEl.innerHTML = PP.map(function (st, i) {
      var cls = 'pst ' + st.shape + (i <= ppMax ? ' stamped' : '') + (i === pressIdx ? ' press' : '') + (i === ppIdx ? ' cur' : '');
      return '<div class="' + cls + '" style="--c:' + st.color + ';--rot:' + st.rot + 'deg"><div class="pst-in"><span class="pst-k">' + esc(st.k) + '</span><span class="pst-t">' + esc(L({ es: st.es.s, en: st.en.s })) + '</span><span class="pst-m">MÁLAGA · ' + two(i + 1) + '</span></div><span class="pst-slot">' + two(i + 1) + '</span></div>';
    }).join('');
    var st = PP[ppIdx], u = U();
    var html = '<p class="pp-stage"><span lang="en">Stage ' + two(ppIdx + 1) + '</span> <span class="pp-of">/ ' + two(PP.length) + '</span></p>' +
      '<h3 class="pp-t" lang="en">' + esc(st.en.t) + '</h3><p class="pp-d" lang="en">' + esc(st.en.d) + '</p>' +
      '<p class="pp-role"><span class="pp-role-k" lang="en">The notary’s role</span><span lang="en">' + esc(st.en.n) + '</span></p>';
    if (lang === 'es') html += '<div class="pp-es" lang="es"><p class="pp-es-k">En español</p><p class="pp-es-t">' + esc(st.es.t) + '</p><p class="pp-es-d">' + esc(st.es.d) + ' <em>' + esc(u.role) + ':</em> ' + esc(st.es.n) + '</p></div>';
    panelEl.innerHTML = html;
    panelEl.setAttribute('aria-labelledby', 'rt-' + ppIdx);
    $('#pp-prev').disabled = ppIdx === 0;
    $('#pp-next').disabled = ppIdx === PP.length - 1;
    $('#pp-play span').textContent = ppMax >= PP.length - 1 ? u.replay : u.play;
    var fill = $('#rt-fill'); fill.style.transform = 'scaleX(' + (ppIdx / (PP.length - 1)).toFixed(4) + ')';
    if (pressIdx !== false && pressIdx != null && !reduce) { panelEl.classList.remove('flip'); void panelEl.offsetWidth; panelEl.classList.add('flip'); }
    var tab = $('#rt-' + ppIdx); if (tab && routeEl.scrollWidth > routeEl.clientWidth) routeEl.scrollTo({ left: tab.offsetLeft - routeEl.clientWidth / 2 + tab.offsetWidth / 2, behavior: reduce ? 'auto' : 'smooth' });
  }
  function goStage(i, focusTab) {
    var stampNew = i > ppMax;
    ppIdx = Math.max(0, Math.min(PP.length - 1, i));
    if (ppIdx > ppMax) ppMax = ppIdx;
    store.set('ppIdx', ppIdx); store.set('ppMax', ppMax);
    renderPassport(stampNew ? ppIdx : -1);
    if (focusTab) $('#rt-' + ppIdx).focus();
  }
  function stopPlay() { clearInterval(ppTimer); ppTimer = 0; }
  routeEl.addEventListener('click', function (e) { var b = e.target.closest('.rt'); if (b) { stopPlay(); goStage(+b.dataset.i); } });
  routeEl.addEventListener('keydown', function (e) {
    var j = -1;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') j = Math.min(PP.length - 1, ppIdx + 1);
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') j = Math.max(0, ppIdx - 1);
    else if (e.key === 'Home') j = 0; else if (e.key === 'End') j = PP.length - 1;
    if (j > -1) { e.preventDefault(); stopPlay(); goStage(j, true); }
  });
  $('#pp-next').addEventListener('click', function () { stopPlay(); goStage(ppIdx + 1); });
  $('#pp-prev').addEventListener('click', function () { stopPlay(); goStage(ppIdx - 1); });
  $('#pp-play').addEventListener('click', function () {
    stopPlay();
    if (ppMax >= PP.length - 1) { ppMax = -1; }
    goStage(0);
    ppTimer = setInterval(function () { if (ppIdx >= PP.length - 1) { stopPlay(); renderPassport(-1); return; } goStage(ppIdx + 1); }, reduce ? 400 : 1500);
  });
  if ('IntersectionObserver' in window) {
    var ppio = new IntersectionObserver(function (es) {
      if (es[0].isIntersecting && !ppSeen) { ppSeen = true; ppio.disconnect(); if (ppMax < 0) setTimeout(function () { goStage(0); }, reduce ? 0 : 450); }
    }, { threshold: 0.35 });
    ppio.observe($('#passport'));
  }

  /* ---------- Appointment form + live letter ---------- */
  var form = $('#book-form'), sel = $('#f-proc');
  $('#f-lang').addEventListener('change', function () { langTouched = true; });
  function renderSelect() {
    var v = sel.value || cur;
    sel.innerHTML = procs.map(function (p) { return '<option value="' + p.id + '">' + esc(L(p.t)) + '</option>'; }).join('') + '<option value="other">' + esc(U().other) + '</option>';
    sel.value = v;
  }
  function syncFormProc() { sel.value = cur; updateLetter(); }
  function procLabel() { var p = procs.filter(function (x) { return x.id === sel.value; })[0]; return p ? L(p.t) : U().other; }
  function fv(id) { return $('#' + id).value.trim(); }
  function bookBody() {
    var u = U(), slot = (form.querySelector('input[name="slot"]:checked') || {}).value || 'x';
    var lines = [u.hello, '', u.want + ': ' + procLabel() + '.', '', u.slot + ': ' + u.slots[slot] + '.'];
    if (fv('f-when')) lines.push(u.when + ': ' + fv('f-when') + '.');
    lines.push(u.lang + ': ' + u.langs[$('#f-lang').value] + '.');
    if (fv('f-phone')) lines.push(u.phone + ': ' + fv('f-phone'));
    if (fv('f-msg')) lines.push('', fv('f-msg'));
    lines.push('', u.thanks, fv('f-name') || '[' + (lang === 'en' ? 'your name' : 'su nombre') + ']');
    if ($('#f-list').checked && sel.value === cur) lines.push('', '— — —', listText(true));
    return lines.join('\n');
  }
  function bookSubj() { return U().bookSubj + ' · ' + procLabel(); }
  var letterTimer = 0;
  function updateLetter() {
    clearTimeout(letterTimer);
    letterTimer = setTimeout(function () {
      $('#lt-subj').textContent = bookSubj();
      var body = bookBody(), cut = body.indexOf('— — —');
      if (cut > -1) body = body.slice(0, cut) + '— — —\n' + U().listHead + ' · ' + L(P().t) + ' (' + $$('input[data-key]', bodyEl).length + ')';
      $('#lt-body').textContent = body;
    }, 40);
  }
  form.addEventListener('input', updateLetter);
  form.addEventListener('change', updateLetter);
  function validate(el) {
    var ok = el.id === 'f-email' ? /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(el.value.trim()) : el.value.trim().length > 1;
    el.setAttribute('aria-invalid', String(!ok));
    var err = $('#e-' + el.id.slice(2)); err.classList.toggle('show', !ok);
    if (!ok) el.setAttribute('aria-describedby', err.id); else el.removeAttribute('aria-describedby');
    return ok;
  }
  ['f-name', 'f-email'].forEach(function (id) {
    var el = $('#' + id);
    el.addEventListener('blur', function () { if (el.value.trim()) validate(el); });
    el.addEventListener('input', function () { if (el.getAttribute('aria-invalid') === 'true') validate(el); });
  });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var bad = ['f-name', 'f-email'].map(function (id) { return validate($('#' + id)) ? null : $('#' + id); }).filter(Boolean);
    if (bad.length) { bad[0].focus(); return; }
    window.location.href = mailtoHref('formulario@sanchez-membrado.org', bookSubj(), bookBody());
  });

  /* ---------- Render ---------- */
  function renderAll() {
    renderProcs(); renderOpts(); renderSheet(false); renderTimeline(); renderPassport(false); renderSelect(); updateLetter();
  }
  $('#f-lang').value = lang;
  applyStatic();
  /* Below-the-fold widgets render after first paint, keeping the hero fast */
  var boot = function () { renderAll(); sel.value = cur; updateLetter(); };
  if ('requestIdleCallback' in window) window.requestIdleCallback(boot, { timeout: 1200 }); else setTimeout(boot, 60);
})();
