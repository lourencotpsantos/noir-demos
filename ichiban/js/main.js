/* Ichiban Marbella · concept by Noir Digital. Vanilla JS, no backend: nothing on this page is ever sent anywhere. */
(function () {
  'use strict';
  var doc = document.documentElement;
  doc.classList.add('js');

  var REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var RESTOO = 'https://ichibanmarbella.myrestoo.net/';
  var LS_LANG = 'ichiban-lang', LS_PICKS = 'ichiban-picks';
  var M = window.ICHIBAN_MENU || { cats: [], dishes: [], extras: [] };
  function $(id) { return document.getElementById(id); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }

  /* ================= i18n ================= */
  // English lives in the HTML; Spanish in data-es / data-es-attr. Dynamic strings below.
  var T = {
    en: {
      title: 'Ichiban Marbella · Japanese restaurant & teppanyaki',
      desc: 'Ichiban, Japanese restaurant and teppanyaki at Av. Antonio Belón 22, Marbella. Sushi, sashimi, tempura and show cooking. Design concept by Noir Digital, not the official website.',
      menuOpen: 'Open menu', menuClose: 'Close menu',
      pcs: 'pcs', pc: 'pc', perPerson: 'per person', ask: 'Ask', askLong: 'Ask for price and availability',
      veg: 'Vegetarian', spicy: 'Spicy', isNew: 'New',
      al: { gl: 'Gluten', cr: 'Crustaceans', eg: 'Egg', fi: 'Fish', so: 'Soy', mi: 'Milk', se: 'Sesame', mo: 'Molluscs' },
      alNone: 'Allergens: ask staff',
      alPrefix: 'Orientative allergens: ',
      add: 'Add {d} to my picks', added: 'Remove {d} from my picks',
      results: function (n, q) { return q ? n + (n === 1 ? ' dish' : ' dishes') + ' for “' + q + '” across the whole menu' : n + (n === 1 ? ' dish' : ' dishes'); },
      emptyTitle: 'Nothing matches those filters.', reset: 'Reset search and filters',
      subs: { cold: 'Cold nigiri · 2 pieces', hot: 'Hot nigiri (aburi) · 2 pieces', maki: 'Maki', hand: 'Hand rolls · 1 piece', sashimi: 'Sashimi · 4 or 8 pieces', mixed: 'Mixed platters', tepAsk: 'Ask for price and availability' },
      catSub: { teppan: 'All served with broccoli.', sets: 'Price per person.' },
      dows: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      dowsLong: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      today: 'Today', lunch: 'Lunch', dinner: 'Dinner',
      guests: function (n) { return n + (n === 1 ? ' guest' : ' guests'); },
      tepPref: 'Teppanyaki table requested', celPref: 'Celebration',
      pickTime: 'Pick a time', noTimes: 'No more times today: pick another day.',
      copyText: function (s) { return 'Hello Ichiban, I would like to book a table: ' + s + '. Thank you!'; },
      copied: 'Copied. Paste it into WhatsApp once the number is confirmed.',
      copyFail: 'Could not copy. Please call 952 90 00 06.',
      embedTitle: 'Ichiban booking page on Restoo',
      embedSum: 'Your choice: {s}. Select the same on Restoo.',
      open: function (until) { return 'Open now · until ' + until; },
      opensToday: function (t) { return 'Closed now · opens today at ' + t; },
      opensOn: function (d, t) { return 'Closed now · opens ' + d + ' at ' + t; },
      picksTotal: 'Estimated total', removeOne: 'One fewer {d}', addOne: 'One more {d}',
      pickedToast: 'Added to My picks', emptyPicks: 'No dishes yet.',
      photoOf: function (i, n) { return 'Photo ' + i + ' of ' + n; }
    },
    es: {
      title: 'Ichiban Marbella · Restaurante japonés y teppanyaki',
      desc: 'Ichiban, restaurante japonés y teppanyaki en la Av. Antonio Belón 22, Marbella. Sushi, sashimi, tempura y show cooking. Concepto de diseño de Noir Digital, no es la web oficial.',
      menuOpen: 'Abrir menú', menuClose: 'Cerrar menú',
      pcs: 'pzs', pc: 'pz', perPerson: 'por persona', ask: 'Consultar', askLong: 'Consultar precio y disponibilidad',
      veg: 'Vegetariano', spicy: 'Picante', isNew: 'Novedad',
      al: { gl: 'Gluten', cr: 'Crustáceos', eg: 'Huevo', fi: 'Pescado', so: 'Soja', mi: 'Lácteos', se: 'Sésamo', mo: 'Moluscos' },
      alNone: 'Alérgenos: consulta al personal',
      alPrefix: 'Alérgenos orientativos: ',
      add: 'Añadir {d} a mis platos', added: 'Quitar {d} de mis platos',
      results: function (n, q) { return q ? n + (n === 1 ? ' plato' : ' platos') + ' para «' + q + '» en toda la carta' : n + (n === 1 ? ' plato' : ' platos'); },
      emptyTitle: 'Ningún plato coincide con esos filtros.', reset: 'Borrar búsqueda y filtros',
      subs: { cold: 'Nigiri frío · 2 piezas', hot: 'Nigiri caliente (aburi) · 2 piezas', maki: 'Maki', hand: 'Conos · 1 pieza', sashimi: 'Sashimi · 4 u 8 piezas', mixed: 'Mixtos', tepAsk: 'Consultar precio y disponibilidad' },
      catSub: { teppan: 'Todo servido con brócoli.', sets: 'Precio por persona.' },
      dows: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
      dowsLong: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
      months: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
      today: 'Hoy', lunch: 'Comida', dinner: 'Cena',
      guests: function (n) { return n + (n === 1 ? ' comensal' : ' comensales'); },
      tepPref: 'Mesa de teppanyaki solicitada', celPref: 'Celebración',
      pickTime: 'Elige una hora', noTimes: 'Hoy ya no quedan horas: elige otro día.',
      copyText: function (s) { return 'Hola Ichiban, me gustaría reservar una mesa: ' + s + '. ¡Gracias!'; },
      copied: 'Copiado. Pégalo en WhatsApp cuando se confirme el número.',
      copyFail: 'No se pudo copiar. Llama al 952 90 00 06.',
      embedTitle: 'Página de reservas de Ichiban en Restoo',
      embedSum: 'Tu elección: {s}. Selecciona lo mismo en Restoo.',
      open: function (until) { return 'Abierto ahora · hasta las ' + until; },
      opensToday: function (t) { return 'Cerrado ahora · abre hoy a las ' + t; },
      opensOn: function (d, t) { return 'Cerrado ahora · abre el ' + d + ' a las ' + t; },
      picksTotal: 'Total estimado', removeOne: 'Un {d} menos', addOne: 'Un {d} más',
      pickedToast: 'Añadido a Mis platos', emptyPicks: 'Aún no hay platos.',
      photoOf: function (i, n) { return 'Foto ' + i + ' de ' + n; }
    }
  };
  var lang = 'en';
  function t(k) { return T[lang][k]; }
  function fill(s, d) { return s.replace('{d}', d).replace('{s}', d); }

  var i18nEls = $$('[data-es]');
  i18nEls.forEach(function (el) { el._en = el.innerHTML; });
  var attrEls = $$('[data-es-attr]');
  attrEls.forEach(function (el) {
    el._enAttr = {};
    el.getAttribute('data-es-attr').split('|').forEach(function (pair) {
      var i = pair.indexOf(':'); var a = pair.slice(0, i);
      el._enAttr[a] = el.getAttribute(a);
    });
  });

  function setLang(l, initial) {
    lang = l === 'es' ? 'es' : 'en';
    doc.lang = lang;
    var skip = initial && lang === 'en'; // HTML is already English
    if (!skip) i18nEls.forEach(function (el) { el.innerHTML = lang === 'es' ? el.getAttribute('data-es') : el._en; });
    if (!skip) attrEls.forEach(function (el) {
      var es = {};
      el.getAttribute('data-es-attr').split('|').forEach(function (pair) { var i = pair.indexOf(':'); es[pair.slice(0, i)] = pair.slice(i + 1); });
      Object.keys(el._enAttr).forEach(function (a) { el.setAttribute(a, lang === 'es' ? es[a] : el._enAttr[a]); });
    });
    $$('.lang-btn').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-lang') === lang)); });
    document.title = t('title');
    var md = document.querySelector('meta[name="description"]'); if (md) md.setAttribute('content', t('desc'));
    store(LS_LANG, lang);
    syncMenuBtn();
    if (!initial) { renderTabs(); renderMenu(); renderBelt(); renderBoard(); renderDays(true); updateSummary(); renderPicks(); updateStatus(); }
  }
  $$('.lang-btn').forEach(function (b) { b.addEventListener('click', function () { setLang(b.getAttribute('data-lang')); }); });

  /* ================= Header, nav, progress ================= */
  var header = document.querySelector('.site-header');
  var nav = $('nav'), menuBtn = document.querySelector('.menu-btn');
  var bar = $('progress');
  function syncMenuBtn() { if (menuBtn) menuBtn.setAttribute('aria-label', nav.classList.contains('open') ? t('menuClose') : t('menuOpen')); }
  function closeNav() { nav.classList.remove('open'); menuBtn.setAttribute('aria-expanded', 'false'); document.body.style.overflow = ''; syncMenuBtn(); }
  menuBtn.addEventListener('click', function () {
    var open = !nav.classList.contains('open');
    nav.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
    syncMenuBtn();
    if (open) { var a = nav.querySelector('a'); if (a) a.focus(); }
  });
  nav.addEventListener('click', function (e) { if (e.target.closest('a')) closeNav(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && nav.classList.contains('open')) { closeNav(); menuBtn.focus(); } });
  window.addEventListener('resize', function () { if (window.innerWidth >= 960 && nav.classList.contains('open')) closeNav(); });

  /* ================= Scroll loop ================= */
  var track = $('show-track'), stage = $('show-stage'), heatFill = $('heat-fill');
  var ticking = false;
  function onScroll() {
    if (ticking) return; ticking = true;
    requestAnimationFrame(function () {
      ticking = false;
      var y = window.scrollY || window.pageYOffset;
      header.classList.toggle('solid', y > 40);
      var max = document.documentElement.scrollHeight - window.innerHeight;
      if (bar) bar.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, y / max) : 0) + ')';
      if (track && stage && !REDUCED) {
        var r = track.getBoundingClientRect();
        var p = (window.innerHeight * 0.6 - r.top) / (r.height);
        p = Math.max(0, Math.min(1, p));
        // heat climbs to a peak at "fire" (step 3) then settles for the hot stone
        var heat = p < 0.75 ? 0.15 + p * 1.13 : 1 - (p - 0.75) * 1.2;
        stage.style.setProperty('--heat', Math.max(0.12, Math.min(1, heat)).toFixed(3));
      }
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  requestAnimationFrame(onScroll);

  /* ================= Reveal + hero intro ================= */
  if ('IntersectionObserver' in window && !REDUCED) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    $$('.reveal').forEach(function (el) { io.observe(el); });
  } else { $$('.reveal').forEach(function (el) { el.classList.add('in'); }); }
  requestAnimationFrame(function () { requestAnimationFrame(function () { doc.classList.add('loaded'); }); });

  /* ================= Teppanyaki show steps ================= */
  var steps = $$('.step');
  var stageNum = $('stage-num');
  function setStep(n) {
    stage.setAttribute('data-step', n);
    if (stageNum) stageNum.textContent = '0' + n;
    steps.forEach(function (s) { s.classList.toggle('active', s.getAttribute('data-step') === String(n)); });
    if (REDUCED) stage.style.setProperty('--heat', [0, .35, .6, 1, .7][n]);
  }
  var curStep = 0;
  function pickStep() {
    if (!steps.length) return;
    var phone = window.innerWidth < 960;
    var line = phone ? stage.getBoundingClientRect().bottom + window.innerHeight * 0.12 : window.innerHeight * 0.55;
    var n = 1;
    steps.forEach(function (s, i) { if (s.getBoundingClientRect().top <= line) n = i + 1; });
    if (n !== curStep) { curStep = n; setStep(n); }
  }
  window.addEventListener('scroll', function () { requestAnimationFrame(pickStep); }, { passive: true });
  window.addEventListener('resize', pickStep);
  setStep(1); requestAnimationFrame(pickStep);

  /* ================= Helpers for prices ================= */
  function num(p) { return parseFloat(String(p).replace(',', '.')); }
  function money(v) {
    var s = v.toFixed(2);
    return lang === 'es' ? s.replace('.', ',') + ' €' : '€' + s;
  }
  function unitLabel(u) { return u + ' ' + (u === '1' ? t('pc') : t('pcs')); }
  function dishId(d) { return d.c + '-' + d.n; }
  function dishSub(d) { var s = lang === 'es' ? d.es : d.en; return s && s.toLowerCase() !== d.t.toLowerCase() ? s : ''; }
  function priceHTML(d) {
    if (d.p == null) return '<span class="tg-ask" title="' + t('askLong') + '">' + t('ask') + '</span>';
    if (Array.isArray(d.p)) return d.p.map(function (o) { return '<small>' + unitLabel(o[0]) + '</small> ' + money(num(o[1])); }).join('<br>');
    return money(num(d.p)) + (d.pp ? ' <small>' + t('perPerson') + '</small>' : '');
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function iconsHTML(d) {
    var h = '';
    var tg = d.tg || [];
    if (tg.indexOf('new') > -1) h += '<span class="tg tg-new">' + t('isNew') + '</span>';
    if (tg.indexOf('v') > -1) h += '<span class="tg tg-v"><svg aria-hidden="true"><use href="#i-leaf"/></svg>' + t('veg') + '</span>';
    if (tg.indexOf('sp') > -1) h += '<span class="tg tg-sp"><svg aria-hidden="true"><use href="#i-chili"/></svg>' + t('spicy') + '</span>';
    if (tg.indexOf('ask') > -1 && d.p != null) h += '<span class="tg-ask" title="' + t('askLong') + '">' + t('ask') + '</span>';
    if (d.al && d.al.length) {
      var names = d.al.map(function (a) { return T[lang].al[a]; });
      h += '<span class="sr-only">' + t('alPrefix') + names.join(', ') + '</span>';
      d.al.forEach(function (a) { h += '<span class="al" title="' + T[lang].al[a] + '" aria-hidden="true"><svg><use href="#al-' + a + '"/></svg></span>'; });
    }
    return h;
  }

  /* ================= Picks (shortlist) ================= */
  var picks = {};
  try { picks = JSON.parse(store(LS_PICKS) || '{}') || {}; } catch (e) { picks = {}; }
  var byId = {}; M.dishes.forEach(function (d) { byId[dishId(d)] = d; });
  Object.keys(picks).forEach(function (k) { if (!byId[k]) delete picks[k]; });
  function savePicks() { store(LS_PICKS, JSON.stringify(picks)); }
  function pickCount() { return Object.keys(picks).reduce(function (a, k) { return a + picks[k]; }, 0); }
  function addBtnHTML(d) {
    var id = dishId(d), on = !!picks[id];
    return '<button type="button" class="add" data-id="' + esc(id) + '" aria-pressed="' + on + '" aria-label="' + esc(fill(on ? t('added') : t('add'), d.t)) + '"><svg aria-hidden="true"><use href="#' + (on ? 'i-check' : 'i-plus') + '"/></svg></button>';
  }
  function togglePick(id, btn) {
    if (picks[id]) delete picks[id]; else { picks[id] = 1; toast(t('pickedToast')); }
    savePicks();
    $$('.add[data-id="' + id + '"]').forEach(function (b) {
      var d = byId[id], on = !!picks[id];
      b.setAttribute('aria-pressed', String(on));
      b.setAttribute('aria-label', fill(on ? t('added') : t('add'), d.t));
      b.querySelector('use').setAttribute('href', on ? '#i-check' : '#i-plus');
    });
    if (btn && !REDUCED) { btn.classList.remove('pop'); void btn.offsetWidth; btn.classList.add('pop'); }
    renderPicks(true);
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest('.add'); if (b) togglePick(b.getAttribute('data-id'), b);
  });

  var fab = $('picks-fab'), dlg = $('picks');
  function renderPicks(bump) {
    var n = pickCount();
    $('picks-count').textContent = n;
    fab.hidden = n === 0;
    if (bump && n && !REDUCED) { fab.classList.remove('bump'); void fab.offsetWidth; fab.classList.add('bump'); }
    var list = $('picks-list'), total = 0, html = '';
    Object.keys(picks).forEach(function (id) {
      var d = byId[id], q = picks[id], unit = null, label = d.t;
      if (Array.isArray(d.p)) { unit = num(d.p[0][1]); label += ' (' + unitLabel(d.p[0][0]) + ')'; }
      else if (d.p != null) unit = num(d.p);
      if (unit != null) total += unit * q;
      html += '<li><span class="pk-name">' + esc(label) + '</span><span class="pk-price">' + (unit != null ? money(unit * q) : t('ask')) + '</span>' +
        '<span class="pk-qty"><button type="button" data-pk="-" data-id="' + esc(id) + '" aria-label="' + esc(fill(t('removeOne'), d.t)) + '"><svg aria-hidden="true"><use href="#i-minus"/></svg></button><span>' + q + '</span>' +
        '<button type="button" data-pk="+" data-id="' + esc(id) + '" aria-label="' + esc(fill(t('addOne'), d.t)) + '"><svg aria-hidden="true"><use href="#i-plus"/></svg></button></span></li>';
    });
    list.innerHTML = html || '<li>' + t('emptyPicks') + '</li>';
    $('picks-total').textContent = money(total);
  }
  $('picks-list').addEventListener('click', function (e) {
    var b = e.target.closest('[data-pk]'); if (!b) return;
    var id = b.getAttribute('data-id');
    picks[id] = (picks[id] || 0) + (b.getAttribute('data-pk') === '+' ? 1 : -1);
    if (picks[id] <= 0) { delete picks[id]; $$('.add[data-id="' + id + '"]').forEach(function (x) { x.setAttribute('aria-pressed', 'false'); x.querySelector('use').setAttribute('href', '#i-plus'); x.setAttribute('aria-label', fill(t('add'), byId[id].t)); }); }
    savePicks(); renderPicks();
    if (!pickCount()) { dlg.close(); }
    else { var again = $('picks-list').querySelector('[data-id="' + id + '"][data-pk="' + b.getAttribute('data-pk') + '"]') || $('picks-list').querySelector('button'); if (again) again.focus(); }
  });
  fab.addEventListener('click', function () { renderPicks(); dlg.showModal(); });
  // Only float the shortlist button while the menu is on screen, so it never covers other buttons
  var fabAway = true; fab.classList.add('away');
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (en) { fabAway = !en[0].isIntersecting; fab.classList.toggle('away', fabAway); fab.tabIndex = fabAway ? -1 : 0; fab.setAttribute('aria-hidden', String(fabAway)); }, { rootMargin: '-20% 0px -20% 0px' }).observe($('menu'));
  } else { fab.classList.remove('away'); }
  $('picks-close').addEventListener('click', function () { dlg.close(); });
  $('picks-clear').addEventListener('click', function () { Object.keys(picks).forEach(function (id) { delete picks[id]; }); savePicks(); renderMenu(); renderBelt(); renderPicks(); dlg.close(); });
  $('picks-book').addEventListener('click', function () { dlg.close(); });
  dlg.addEventListener('close', function () { if (!fab.hidden) fab.focus(); });
  dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });

  /* ================= Menu ================= */
  var curCat = 'teppan', query = '', filters = {};
  var catOrder = ['teppan', 'nigiri', 'rolls', 'maki', 'sashimi', 'starters', 'tempura', 'rice', 'sets'];
  var cats = catOrder.map(function (id) { return M.cats.filter(function (c) { return c.id === id; })[0]; }).filter(Boolean);
  var tabsEl = $('menu-tabs'), body = $('menu-body'), resEl = $('menu-results'), searchEl = $('menu-search');

  function renderTabs() {
    tabsEl.innerHTML = cats.map(function (c) {
      var n = M.dishes.filter(function (d) { return d.c === c.id; }).length;
      return '<button type="button" class="tab" data-cat="' + c.id + '" aria-pressed="' + (c.id === curCat && !query) + '">' + c[lang] + '<span class="tab-n" aria-hidden="true">' + n + '</span></button>';
    }).join('');
  }
  tabsEl.addEventListener('click', function (e) {
    var b = e.target.closest('.tab'); if (!b) return;
    curCat = b.getAttribute('data-cat');
    if (query) { query = ''; searchEl.value = ''; }
    renderTabs(); renderMenu();
    b = tabsEl.querySelector('[data-cat="' + curCat + '"]');
    if (b) { b.focus(); b.scrollIntoView({ block: 'nearest', inline: 'center', behavior: REDUCED ? 'auto' : 'smooth' }); }
    var top = body.getBoundingClientRect().top + window.scrollY - $('menu-tools').offsetHeight - header.offsetHeight - 8;
    if (window.scrollY > top) window.scrollTo({ top: top, behavior: REDUCED ? 'auto' : 'smooth' });
  });

  function norm(s) { return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }
  function matches(d) {
    var tg = d.tg || [];
    for (var f in filters) { if (filters[f] && tg.indexOf(f) === -1) return false; }
    if (query) {
      var hay = norm([d.t, d.en, d.es, d.n].join(' '));
      return norm(query).split(/\s+/).every(function (w) { return hay.indexOf(w) > -1; });
    }
    return true;
  }
  function subKey(d) {
    if (d.c === 'nigiri') return d.hot ? 'hot' : 'cold';
    if (d.c === 'maki') return d.u === '1' ? 'hand' : 'maki';
    if (d.c === 'sashimi') return /^6/.test(d.n) ? 'mixed' : 'sashimi';
    if (d.c === 'teppan' && d.p == null) return 'tepAsk';
    return '';
  }
  function imgHTML(d) {
    return '<img src="img/' + d.img + '-400.webp" srcset="img/' + d.img + '-400.webp 400w, img/' + d.img + '-800.webp 800w" sizes="(min-width: 960px) 380px, (min-width: 600px) 45vw, 112px" width="400" height="300" loading="lazy" decoding="async" alt="' + esc(d.alt ? d.alt[lang] : '') + '">';
  }
  var HOT = ['teppan', 'tempura', 'rice', 'sets'];
  function isHot(d) { return HOT.indexOf(d.c) > -1 || !!d.hot; }
  function cardHTML(d, i) {
    var sub = dishSub(d), u = d.u && !Array.isArray(d.p) ? ' · ' + unitLabel(d.u) : '';
    return '<article class="dish-card' + (isHot(d) ? ' hot' : '') + '" style="--i:' + (i || 0) + '"><div class="dish-media">' + imgHTML(d) + (isHot(d) ? '<span class="wisps" aria-hidden="true"><i style="--k:0"></i><i style="--k:1"></i><i style="--k:2"></i></span>' : '') + '</div><div class="dish-body">' +
      '<div class="dish-top"><h4 class="dish-name"><span class="dish-num">' + esc(d.n) + '</span>' + esc(d.t) + '</h4><p class="dish-price">' + priceHTML(d) + '</p></div>' +
      (sub || u ? '<p class="dish-sub">' + esc(sub) + (sub ? '' : '') + '<span>' + (sub ? u : u.replace(' · ', '')) + '</span></p>' : '') +
      '<div class="dish-meta"><div class="dish-icons">' + (iconsHTML(d) || '<span class="sr-only">' + t('alNone') + '</span>') + '</div>' + addBtnHTML(d) + '</div></div></article>';
  }
  function rowHTML(d, i) {
    var sub = dishSub(d), u = d.u && !Array.isArray(d.p) ? unitLabel(d.u) : '';
    var icons = iconsHTML(d);
    return '<li class="dish-row" style="--i:' + (i || 0) + '"><div><div class="row-line"><h4 class="dish-name"><span class="dish-num">' + esc(d.n) + '</span>' + esc(d.t) + '</h4><span class="dots" aria-hidden="true"></span><span class="dish-price">' + priceHTML(d) + '</span></div>' +
      (sub || u ? '<p class="dish-sub">' + esc(sub) + (sub && u ? ' · ' : '') + u + '</p>' : '') +
      (icons ? '<div class="dish-icons">' + icons + '</div>' : '') + '</div>' + addBtnHTML(d) + '</li>';
  }
  function blockHTML(list) {
    var withImg = list.filter(function (d) { return d.img; }), rest = list.filter(function (d) { return !d.img; });
    return (withImg.length ? '<div class="cards">' + withImg.map(cardHTML).join('') + '</div>' : '') +
      (rest.length ? '<ul class="rows">' + rest.map(rowHTML).join('') + '</ul>' : '');
  }
  function renderMenu() {
    var html = '', total = 0;
    var showCats = query ? cats : cats.filter(function (c) { return c.id === curCat; });
    showCats.forEach(function (c) {
      var list = M.dishes.filter(function (d) { return d.c === c.id && matches(d); });
      if (!list.length) return;
      total += list.length;
      html += '<section class="cat-block" aria-label="' + esc(c[lang]) + '"><h3 class="cat-title">' + esc(c[lang]) + ' <span class="jp" aria-hidden="true">' + c.jp + '</span></h3>';
      if (T[lang].catSub[c.id]) html += '<p class="cat-sub">' + T[lang].catSub[c.id] + '</p>';
      var groups = {}, order = [];
      list.forEach(function (d) { var k = subKey(d); if (!groups[k]) { groups[k] = []; order.push(k); } groups[k].push(d); });
      order.forEach(function (k) {
        if (k && order.length > 1 || k === 'tepAsk') html += '<p class="cat-sub" style="margin-top:8px">' + T[lang].subs[k] + '</p>';
        html += blockHTML(groups[k]);
      });
      html += '</section>';
    });
    if (!total) html = '<div class="empty"><p>' + t('emptyTitle') + '</p><button type="button" class="btn btn-outline-dark btn-sm" id="menu-reset">' + t('reset') + '</button></div>';
    body.innerHTML = html;
    resEl.textContent = T[lang].results(total, query);
    document.dispatchEvent(new CustomEvent('ichiban:menu'));
    var r = $('menu-reset');
    if (r) r.addEventListener('click', function () { query = ''; searchEl.value = ''; filters = {}; $$('.chip').forEach(function (c) { c.setAttribute('aria-pressed', 'false'); }); renderTabs(); renderMenu(); searchEl.focus(); });
  }
  var sTimer;
  searchEl.addEventListener('input', function () {
    clearTimeout(sTimer);
    sTimer = setTimeout(function () { query = searchEl.value.trim(); renderTabs(); renderMenu(); }, 160);
  });
  searchEl.addEventListener('keydown', function (e) { if (e.key === 'Enter') e.preventDefault(); });
  $$('.chip').forEach(function (c) {
    c.addEventListener('click', function () {
      var f = c.getAttribute('data-filter'); filters[f] = !filters[f];
      c.setAttribute('aria-pressed', String(!!filters[f]));
      renderMenu();
    });
  });

  /* ================= Kaiten belt (a playful way to browse the sushi) ================= */
  var BELT_CATS = ['nigiri', 'rolls', 'maki', 'sashimi'], RIMS = ['#b81f2b', '#d6b06a', '#3f6b3a', '#2d4f7c'];
  function renderBelt() {
    var tr = $('belt-track'); if (!tr || !beltBuilt) return;
    var list = M.dishes.filter(function (d) { return d.img && BELT_CATS.indexOf(d.c) > -1; });
    function item(d, i, clone) {
      var btn = addBtnHTML(d); if (clone) btn = btn.replace('<button ', '<button tabindex="-1" ');
      return '<li class="belt-item' + (clone ? ' clone' : '') + '" style="--rim:' + RIMS[i % RIMS.length] + '"' + (clone ? ' aria-hidden="true"' : '') + '>' +
        '<div class="kp-plate"><img src="img/' + d.img + '-400.webp" width="400" height="300" loading="lazy" decoding="async" alt="' + (clone ? '' : esc(d.alt ? d.alt[lang] : '')) + '"></div>' +
        '<p class="kp-name">' + esc(d.t) + '</p><p class="kp-price">' + priceHTML(d) + '</p>' + btn + '</li>';
    }
    tr.innerHTML = list.map(function (d, i) { return item(d, i, false); }).join('') + list.map(function (d, i) { return item(d, i, true); }).join('');
    document.dispatchEvent(new CustomEvent('ichiban:belt'));
  }

  /* ================= Teppan board in the show section ================= */
  function renderBoard() {
    var tep = M.dishes.filter(function (d) { return d.c === 'teppan' && d.p != null; });
    $('tep-list').innerHTML = tep.map(function (d) {
      var sub = dishSub(d);
      return '<li><span><span class="tl-name">' + esc(d.t) + '</span>' + (sub ? '<span class="tl-sub">' + esc(sub) + '</span>' : '') + '</span><span class="tl-dots" aria-hidden="true"></span><span class="tl-price">' + money(num(d.p)) + '</span></li>';
    }).join('') + '<li><span><span class="tl-name">' + (lang === 'es' ? 'Langosta · carabineros · wagyū' : 'Lobster · red king prawn · wagyū') + '</span><span class="tl-sub">' + t('askLong') + '</span></span><span class="tl-dots" aria-hidden="true"></span><span class="tl-price">' + t('ask') + '</span></li>';
    $('set-cards').innerHTML = M.dishes.filter(function (d) { return d.c === 'sets'; }).map(function (d) {
      return '<div class="set-card"><img src="img/' + d.img + '-400.webp" width="96" height="96" loading="lazy" decoding="async" alt="' + esc(d.alt[lang]) + '"><div><h4>' + esc(d.t) + ' <span>' + money(num(d.p)) + '</span></h4><small>' + t('perPerson') + '</small><p>' + esc(lang === 'es' ? d.es : d.en) + '</p></div></div>';
    }).join('');
  }

  /* ================= Booking widget ================= */
  var TZ = 'Europe/Madrid', FMT = null;
  function madridNow() {
    var parts = {};
    if (!FMT) FMT = new Intl.DateTimeFormat('en-GB', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
    FMT.formatToParts(new Date()).forEach(function (p) { parts[p.type] = p.value; });
    var d = new Date(Date.UTC(+parts.year, +parts.month - 1, +parts.day));
    return { date: d, dow: d.getUTCDay(), mins: (+parts.hour) * 60 + (+parts.minute) };
  }
  var LUNCH_DAYS = [5, 6, 0, 1]; // Fri, Sat, Sun, Mon (per Restoo)
  var SLOTS = { lunch: ['13:00', '13:30', '14:00', '14:30'], dinner: ['18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30'] };
  function toMins(s) { var a = s.split(':'); return +a[0] * 60 + +a[1]; }
  var bk = { day: 0, service: 'dinner', time: '', guests: 2 };
  var daysEl = $('bk-days'), timesEl = $('bk-times');
  var dayList = [];
  function renderDays(keep) {
    var now = madridNow();
    dayList = [];
    for (var i = 0; i < 14; i++) { var d = new Date(now.date.getTime() + i * 864e5); dayList.push(d); }
    daysEl.innerHTML = dayList.map(function (d, i) {
      var label = i === 0 ? t('today') : T[lang].dows[d.getUTCDay()];
      var full = T[lang].dowsLong[d.getUTCDay()] + ' ' + d.getUTCDate() + ' ' + T[lang].months[d.getUTCMonth()];
      return '<label class="day"><input type="radio" name="day" value="' + i + '"' + (i === bk.day ? ' checked' : '') + ' aria-label="' + full + '"><span aria-hidden="true"><small>' + label + '</small><b>' + d.getUTCDate() + '</b><small>' + T[lang].months[d.getUTCMonth()] + '</small></span></label>';
    }).join('');
    renderService(keep);
  }
  function renderService(keep) {
    var d = dayList[bk.day], lunchOk = LUNCH_DAYS.indexOf(d.getUTCDay()) > -1;
    var lunchIn = document.querySelector('#bk-service input[value="lunch"]');
    lunchIn.disabled = !lunchOk;
    $('bk-lunch-hint').hidden = lunchOk;
    if (!lunchOk && bk.service === 'lunch') { bk.service = 'dinner'; }
    $$('#bk-service input').forEach(function (r) { r.checked = r.value === bk.service; });
    renderTimes(keep);
  }
  function renderTimes(keep) {
    var now = madridNow();
    var slots = SLOTS[bk.service].filter(function (s) { return bk.day > 0 || toMins(s) > now.mins + 30; });
    if (!keep || slots.indexOf(bk.time) === -1) bk.time = slots.indexOf('20:30') > -1 && bk.service === 'dinner' ? '20:30' : (slots[0] || '');
    timesEl.innerHTML = slots.length ? slots.map(function (s) {
      return '<label class="time"><input type="radio" name="time" value="' + s + '"' + (s === bk.time ? ' checked' : '') + '><span>' + s + '</span></label>';
    }).join('') : '<p class="bk-hint">' + t('noTimes') + '</p>';
    updateSummary();
  }
  daysEl.addEventListener('change', function (e) { if (e.target.name === 'day') { bk.day = +e.target.value; renderService(true); } });
  $('bk-service').addEventListener('change', function (e) { bk.service = e.target.value; renderTimes(false); });
  timesEl.addEventListener('change', function (e) { bk.time = e.target.value; updateSummary(); });
  function setGuests(n) {
    bk.guests = Math.max(1, Math.min(30, n));
    $('bk-guests').textContent = bk.guests;
    $('bk-minus').disabled = bk.guests <= 1;
    $('bk-plus').disabled = bk.guests >= 30;
    $('bk-group-hint').hidden = bk.guests < 9;
    updateSummary();
  }
  $('bk-minus').addEventListener('click', function () { setGuests(bk.guests - 1); });
  $('bk-plus').addEventListener('click', function () { setGuests(bk.guests + 1); });
  $('bk-tep').addEventListener('change', updateSummary);
  $('bk-cel').addEventListener('change', updateSummary);
  $('booker').addEventListener('submit', function (e) { e.preventDefault(); });
  function summaryText(withExtras) {
    var d = dayList[bk.day]; if (!d) return '';
    var s = T[lang].dowsLong[d.getUTCDay()] + ' ' + d.getUTCDate() + ' ' + T[lang].months[d.getUTCMonth()] + ' · ' + t(bk.service) + ' ' + (bk.time || '—') + ' · ' + T[lang].guests(bk.guests);
    s = s.charAt(0).toUpperCase() + s.slice(1);
    if (withExtras) { var x = extrasList(); if (x.length) s += ' · ' + x.join(' · '); }
    return s;
  }
  function extrasList() { var x = []; if ($('bk-tep').checked) x.push(t('tepPref')); if ($('bk-cel').checked) x.push(t('celPref')); return x; }
  function updateSummary() {
    if (!dayList.length) return;
    $('bk-summary').textContent = bk.time ? summaryText(false) : t('pickTime');
    $('bk-extra').textContent = extrasList().join(' · ');
    $('bk-restoo').href = RESTOO + lang + '/reservar';
  }
  $('bk-copy').addEventListener('click', function () {
    var text = T[lang].copyText(summaryText(true));
    function ok() { toast(t('copied')); }
    function fallback() {
      var ta = document.createElement('textarea'); ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy') ? ok() : toast(t('copyFail')); } catch (e) { toast(t('copyFail')); }
      document.body.removeChild(ta);
    }
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(ok, fallback); else fallback();
  });
  var embed = $('embed');
  $('bk-embed').addEventListener('click', function () {
    var box = $('embed-frame');
    box.innerHTML = '<iframe src="' + RESTOO + lang + '/reservar" title="' + t('embedTitle') + '" loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe>';
    $('embed-sum').textContent = fill(t('embedSum'), summaryText(true));
    embed.showModal();
  });
  $('embed-close').addEventListener('click', function () { embed.close(); });
  embed.addEventListener('close', function () { $('embed-frame').innerHTML = ''; $('bk-embed').focus(); });
  embed.addEventListener('click', function (e) { if (e.target === embed) embed.close(); });

  /* ================= Open / closed status ================= */
  function services(dow) { var s = [['18:30', '23:00']]; if (LUNCH_DAYS.indexOf(dow) > -1) s.unshift(['13:00', '15:00']); return s; }
  function updateStatus() {
    var now = madridNow(), el = $('open-status'), txt = $('open-text');
    var today = services(now.dow), msg = '', cls = '';
    for (var i = 0; i < today.length; i++) {
      if (now.mins >= toMins(today[i][0]) && now.mins < toMins(today[i][1])) { msg = T[lang].open(today[i][1]); cls = 'open'; break; }
    }
    if (!msg) {
      var next = today.filter(function (s) { return toMins(s[0]) > now.mins; })[0];
      if (next) { msg = T[lang].opensToday(next[0]); cls = 'soon'; }
      else { var nd = (now.dow + 1) % 7; msg = T[lang].opensOn(T[lang].dowsLong[nd], services(nd)[0][0]); }
    }
    txt.textContent = msg;
    el.className = 'status ' + cls;
    $$('#hours tbody tr').forEach(function (tr) { tr.classList.toggle('today', tr.getAttribute('data-day') === String(now.dow)); });
  }

  /* ================= Gallery lightbox ================= */
  var lb = $('lightbox'), lbImg = $('lb-img'), lbCap = $('lb-cap');
  var gItems = $$('#g-grid button.g-item'), gIdx = 0, gOpener = null;
  function showG(i) {
    gIdx = (i + gItems.length) % gItems.length;
    var b = gItems[gIdx], im = b.querySelector('img');
    lbImg.src = b.getAttribute('data-full');
    lbImg.alt = im.alt;
    lbCap.textContent = T[lang].photoOf(gIdx + 1, gItems.length) + ' · ' + im.alt;
  }
  gItems.forEach(function (b, i) { b.setAttribute('aria-haspopup', 'dialog'); b.addEventListener('click', function () { gOpener = b; showG(i); lb.showModal(); $('lb-close').focus(); }); });
  $('lb-close').addEventListener('click', function () { lb.close(); });
  $('lb-prev').addEventListener('click', function () { showG(gIdx - 1); });
  $('lb-next').addEventListener('click', function () { showG(gIdx + 1); });
  lb.addEventListener('keydown', function (e) { if (e.key === 'ArrowLeft') showG(gIdx - 1); if (e.key === 'ArrowRight') showG(gIdx + 1); });
  lb.addEventListener('click', function (e) { if (e.target === lb) lb.close(); });
  lb.addEventListener('close', function () { if (gOpener) gOpener.focus(); });
  var tx = null;
  lb.addEventListener('touchstart', function (e) { tx = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', function (e) { if (tx == null) return; var dx = e.changedTouches[0].clientX - tx; if (Math.abs(dx) > 50) showG(gIdx + (dx < 0 ? 1 : -1)); tx = null; });

  /* ================= Map: load only when the visitor gets close ================= */
  var mapFrame = $('map-frame');
  if (mapFrame) {
    var loadMap = function () { if (!mapFrame.src) mapFrame.src = mapFrame.getAttribute('data-src'); };
    if ('IntersectionObserver' in window) {
      var mio = new IntersectionObserver(function (en) { if (en[0].isIntersecting) { loadMap(); mio.disconnect(); } }, { rootMargin: '300px 0px' });
      mio.observe(mapFrame);
    } else loadMap();
  }

  /* ================= Pause loops off screen ================= */
  if ('IntersectionObserver' in window) {
    var pio = new IntersectionObserver(function (en) { en.forEach(function (e) { e.target.classList.toggle('paused', !e.isIntersecting); }); });
    [document.querySelector('.embers'), stage].forEach(function (el) { if (el) { el.classList.add('paused'); pio.observe(el); } });
  }

  /* ================= Toast ================= */
  var toastEl = $('toast'), toastT;
  function toast(msg) { toastEl.textContent = msg; toastEl.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove('show'); }, 2600); }

  /* ================= Init ================= */
  var qs = new URLSearchParams(location.search).get('lang');
  var saved = store(LS_LANG);
  setLang(qs || saved || 'en', true);
  // Below-the-fold widgets are built once the first paint is out of the way
  var built = false;
  var jobs = [
    function () { renderTabs(); renderMenu(); },
    function () { renderBoard(); renderPicks(); },
    function () { renderDays(false); setGuests(2); },
    function () { updateStatus(); setInterval(updateStatus, 60000); }
  ];
  var idle = window.requestIdleCallback || function (fn) { return setTimeout(fn, 60); };
  function step() { var j = jobs.shift(); if (j) { j(); if (jobs.length) idle(step, { timeout: 1500 }); } }
  function build() { if (built) return; built = true; while (jobs.length) jobs.shift()(); }
  idle(function () { if (!built) { built = true; step(); } }, { timeout: 1500 });
  // The sushi belt is built only when the menu gets close (it is decorative browsing, not needed for first paint)
  var beltBuilt = false, kai = $('kaiten');
  function buildBelt() { if (!beltBuilt) { beltBuilt = true; renderBelt(); } }
  if (kai && 'IntersectionObserver' in window) {
    var kio = new IntersectionObserver(function (en) { if (en[0].isIntersecting) { kio.disconnect(); idle(buildBelt, { timeout: 300 }); } }, { rootMargin: '1200px 0px' });
    kio.observe(kai);
  } else buildBelt();
  if (location.hash) build();
})();
