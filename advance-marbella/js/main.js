/* Advance Marbella · concept by Noir Digital. Vanilla JS, no backend: forms open WhatsApp or email pre-filled. */
(function () {
  'use strict';
  document.documentElement.classList.add('js');

  var WA_NUMBER = '34667063181';
  var EMAIL = 'info@advancemarbella.com';
  var STORE_KEY = 'advance-lang';
  var REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var I = window.ADV_I18N;
  var EN = I.EN;
  function $(id) { return document.getElementById(id); }
  function qsa(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  /* ---------------- i18n ---------------- */
  var lang = 'es';
  try { if (localStorage.getItem(STORE_KEY) === 'en') lang = 'en'; } catch (e) {}
  var ES_TEXT = new Map();
  var ES_ATTR = new Map();
  qsa('[data-i18n]').forEach(function (el) { ES_TEXT.set(el, el.textContent); });
  qsa('[data-i18n-attr]').forEach(function (el) {
    var o = {};
    el.getAttribute('data-i18n-attr').split(';').forEach(function (pair) {
      var p = pair.split(':'); o[p[0]] = { key: p[1], es: el.getAttribute(p[0]) };
    });
    ES_ATTR.set(el, o);
  });
  var META = {
    es: { title: document.title, desc: document.querySelector('meta[name="description"]').content },
    en: { title: 'Advance Marbella · Language school in Marbella · English, Cambridge and Spanish',
          desc: 'Advance, a language school in central Marbella: English for children, teens, adults and companies, Cambridge exams and Spanish for foreigners. Design concept by Noir Digital, not the official website.' }
  };
  function D() { return I.DYN[lang]; }
  var langListeners = [];
  function applyLang() {
    document.documentElement.lang = lang;
    ES_TEXT.forEach(function (es, el) {
      var k = el.getAttribute('data-i18n');
      el.textContent = lang === 'en' && EN[k] != null ? EN[k] : es;
    });
    ES_ATTR.forEach(function (o, el) {
      Object.keys(o).forEach(function (attr) {
        var v = lang === 'en' && EN[o[attr].key] != null ? EN[o[attr].key] : o[attr].es;
        el.setAttribute(attr, v);
      });
    });
    document.title = META[lang].title;
    document.querySelector('meta[name="description"]').content = META[lang].desc;
    qsa('.lang-btn').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.lang === lang)); });
    var sw = $('sp-switch');
    if (sw) {
      sw.dataset.to = lang === 'en' ? 'es' : 'en';
      sw.setAttribute('lang', sw.dataset.to);
      sw.querySelector('span').textContent = lang === 'en' ? 'Leer esta sección en español' : 'Read this page in English';
    }
    updateMenuLabel();
    langListeners.forEach(function (fn) { fn(); });
  }
  function setLang(l) {
    lang = l;
    try { localStorage.setItem(STORE_KEY, l); } catch (e) {}
    applyLang();
  }
  qsa('.lang-btn').forEach(function (b) { b.addEventListener('click', function () { setLang(b.dataset.lang); }); });
  var spSwitch = $('sp-switch');
  if (spSwitch) spSwitch.addEventListener('click', function () { setLang(spSwitch.dataset.to); });

  /* ---------------- menu ---------------- */
  var menuBtn = document.querySelector('.menu-btn');
  var nav = $('nav');
  function updateMenuLabel() {
    if (!menuBtn) return;
    var open = menuBtn.getAttribute('aria-expanded') === 'true';
    menuBtn.setAttribute('aria-label', open ? D().menuClose : (lang === 'en' ? EN.menuOpen : 'Abrir menú'));
  }
  function setMenu(open) {
    menuBtn.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('is-open', open);
    document.body.style.overflow = open ? 'hidden' : '';
    updateMenuLabel();
    if (open) { var first = nav.querySelector('a'); if (first) first.focus(); }
  }
  menuBtn.addEventListener('click', function () { setMenu(menuBtn.getAttribute('aria-expanded') !== 'true'); });
  nav.addEventListener('click', function (e) { if (e.target.closest('a') && nav.classList.contains('is-open')) setMenu(false); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) { setMenu(false); menuBtn.focus(); }
  });
  window.matchMedia('(min-width: 1100px)').addEventListener('change', function (m) { if (m.matches && nav.classList.contains('is-open')) setMenu(false); });

  /* ---------------- reading progress ---------------- */
  /* One passive scroll listener and one rAF for every scroll-linked effect on the page.
     Each task is a function; effects register with ADV.addScroll and switch themselves off
     when their section is off-screen. Where CSS scroll-driven animations exist, the
     progress bar runs on the compositor and is not in this list at all. */
  var SD = !!(window.CSS && CSS.supports && CSS.supports('animation-timeline: scroll()'));
  var bar = $('read-bar'), ticking = false, scrollTasks = [];
  function runScroll() {
    ticking = false;
    for (var i = 0; i < scrollTasks.length; i++) scrollTasks[i]();
  }
  function onScroll() {
    if (ticking) return; ticking = true;
    requestAnimationFrame(runScroll);
  }
  if (SD) document.documentElement.classList.add('sd');
  else scrollTasks.push(function () {
    var h = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = 'scaleX(' + (h > 0 ? Math.min(1, scrollY / h) : 0) + ')';
  });
  addEventListener('scroll', onScroll, { passive: true });

  /* ---------------- small motion helpers shared with fx.js ---------------- */
  var COLORS = ['#FF5B3A', '#FFC928', '#2457F5', '#14B48C', '#B79CFF'];
  function sparkle(el, n, colors) {
    if (REDUCED || !el || !el.animate) return;
    var host = el, r = el.getBoundingClientRect();
    for (var i = 0; i < (n || 10); i++) {
      var s = document.createElement('i');
      s.className = 'spark';
      s.style.background = (colors || COLORS)[i % (colors || COLORS).length];
      host.appendChild(s);
      var a = Math.PI * 2 * i / (n || 10) + Math.random() * .5, d = 34 + Math.random() * 40;
      s.style.left = (r.width / 2) + 'px'; s.style.top = (r.height / 2) + 'px';
      s.animate([{ transform: 'translate(-50%,-50%) scale(1)', opacity: 1 },
                 { transform: 'translate(calc(-50% + ' + Math.cos(a) * d + 'px), calc(-50% + ' + Math.sin(a) * d + 'px)) scale(0)', opacity: 0 }],
                { duration: 620 + Math.random() * 200, easing: 'cubic-bezier(.2,.8,.2,1)' }).onfinish = (function (x) { return function () { x.remove(); }; })(s);
    }
  }
  /* Confetti on a canvas that only exists for ~1.8 s: one rAF loop, then it stops and clears. */
  function confetti(canvas, power) {
    if (REDUCED || !canvas || !canvas.getContext) return;
    var host = canvas.parentNode, w = host.clientWidth, h = host.clientHeight, dpr = Math.min(2, devicePixelRatio || 1);
    canvas.width = w * dpr; canvas.height = h * dpr;
    var ctx = canvas.getContext('2d'); ctx.scale(dpr, dpr);
    var N = Math.round(60 + (power || 1) * 50), P = [];
    for (var i = 0; i < N; i++) P.push({ x: w / 2 + (Math.random() - .5) * w * .3, y: h * .45, vx: (Math.random() - .5) * 9, vy: -6 - Math.random() * 9,
      r: 4 + Math.random() * 5, a: Math.random() * 6, va: (Math.random() - .5) * .4, c: COLORS[i % COLORS.length], round: Math.random() < .3 });
    var t0 = performance.now();
    canvas.classList.add('is-on');
    (function frame(t) {
      var k = (t - t0) / 1800;
      ctx.clearRect(0, 0, w, h);
      if (k >= 1) { canvas.classList.remove('is-on'); return; }
      ctx.globalAlpha = k > .7 ? (1 - k) / .3 : 1;
      for (var i = 0; i < N; i++) {
        var p = P[i]; p.vy += .32; p.vx *= .99; p.x += p.vx; p.y += p.vy; p.a += p.va;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.a); ctx.fillStyle = p.c;
        if (p.round) { ctx.beginPath(); ctx.arc(0, 0, p.r * .6, 0, 6.3); ctx.fill(); } else ctx.fillRect(-p.r / 2, -p.r / 4, p.r, p.r / 2);
        ctx.restore();
      }
      requestAnimationFrame(frame);
    })(t0);
  }
  window.ADV = {
    getLang: function () { return lang; }, D: function () { return D(); }, EN: EN,
    onLang: function (fn) { langListeners.push(fn); }, REDUCED: REDUCED, SD: SD,
    addScroll: function (fn) { scrollTasks.push(fn); }, kick: onScroll,
    sparkle: sparkle, confetti: confetti
  };

  /* ---------------- typing / translating headline ---------------- */
  var WORDS = ['English', 'español', 'français', 'Deutsch', 'русский', '中文', 'العربية'];
  var WORD_LANGS = ['en', 'es', 'fr', 'de', 'ru', 'zh', 'ar'];
  var typer = $('typer'), tag = $('typer-tag');
  var wi = 0;
  function showTag() {
    var name = D().langNames[wi];
    tag.textContent = '= ' + name;
    tag.style.visibility = name.toLowerCase() === WORDS[wi].toLowerCase() ? 'hidden' : '';
  }
  langListeners.push(showTag);
  if (REDUCED) {
    typer.textContent = WORDS[0]; showTag();
  } else {
    var ci = WORDS[0].length, deleting = false, hold = 0;
    var chars = function (w) { return Array.from(w); };
    var step = function () {
      var w = chars(WORDS[wi]);
      if (hold > 0) { hold--; setTimeout(step, 100); return; }
      if (!deleting) {
        if (ci < w.length) { ci++; typer.textContent = w.slice(0, ci).join(''); setTimeout(step, 85); }
        else { tag.classList.remove('is-hidden'); showTag(); hold = 18; deleting = true; setTimeout(step, 100); }
      } else {
        if (ci === w.length) tag.classList.add('is-hidden');
        if (ci > 0) { ci--; typer.textContent = w.slice(0, ci).join(''); setTimeout(step, 45); }
        else {
          deleting = false; wi = (wi + 1) % WORDS.length;
          typer.setAttribute('lang', WORD_LANGS[wi]);
          typer.dir = WORD_LANGS[wi] === 'ar' ? 'rtl' : 'ltr';
          setTimeout(step, 260);
        }
      }
    };
    showTag(); hold = 14; setTimeout(step, 1200);
  }

  /* ---------------- reveal on scroll ---------------- */
  var revealEls = qsa('.reveal').concat([$('ladder')]);
  if ('IntersectionObserver' in window && !REDUCED) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------------- enrolment helpers (used by finder, quiz, calendar) ---------------- */
  var form = $('enrol-form');
  var fCourse = $('f-course'), fLevel = $('f-level'), fWhen = $('f-when'), fName = $('f-name'), fPhone = $('f-phone'), fNotes = $('f-notes');
  var levelFromTest = false;
  var examChoice = '';
  function flash(field) {
    var f = field.closest('.field'); f.classList.remove('is-flash'); void f.offsetWidth; f.classList.add('is-flash');
  }
  function prefill(opts) {
    if (opts.course) { fCourse.value = opts.course; clearError(fCourse); fCourse.closest('.field').classList.add('is-ok'); flash(fCourse); }
    if (opts.level !== undefined) { fLevel.value = opts.level; levelFromTest = !!opts.fromTest; flash(fLevel); }
    if (opts.when) fWhen.value = opts.when;
    if (opts.exam !== undefined) examChoice = opts.exam;
    renderPreview();
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[data-course], a[data-exam]');
    if (!a) return;
    if (a.dataset.course) prefill({ course: a.dataset.course, exam: '' });
    if (a.dataset.exam) prefill({ course: 'exam', exam: a.dataset.exam, level: a.dataset.exam.slice(0, 2) });
  });

  /* ---------------- course finder ---------------- */
  var finder = $('finder');
  var answers = {};
  var stepIdx = 1;
  function P(label, value) { return { label: label, value: value }; }
  function T(es, en) { return { es: es, en: en }; }
  var F = {
    clock: T('Clases de 1 h 15 min', '75-minute classes'),
    levels: T('Niveles A1–C2', 'Levels A1–C2'),
    group: T('5–9 alumnos', '5–9 students'),
    max9: T('Máximo 9 alumnos', 'Max. 9 students'),
    res: T('Residencia junto a la escuela', 'Residence next to the school'),
    test: T('Empieza con prueba de nivel', 'Starts with a placement test'),
    cb: T('Examen por ordenador en Advance', 'Computer-based exam at Advance'),
    morning: T('Mañanas', 'Mornings'), evening: T('Tardes', 'Evenings'),
    tbc: T('Horario exacto: a confirmar', 'Exact times: to be confirmed')
  };
  var INT_PRICES = [P(T('20 h / mes', '20 h / month'), '150 €'), P(T('40 h / mes', '40 h / month'), '235 €'), P(T('60 h / mes', '60 h / month'), '355 €')];
  function recommend(a) {
    var r = { facts: [], prices: null, test: true, course: 'adults' };
    var whenFact = a.when === 'morning' ? F.morning : a.when === 'evening' ? F.evening : null;
    if (a.who === 'spanish') {
      r.course = 'spanish'; r.test = false;
      if (a.when === 'flex') {
        r.title = T('Español: clases particulares', 'Spanish: private lessons');
        r.text = T('Un curso diseñado para ti tras un análisis de necesidades en la primera clase. Tú eliges día y hora.', 'A course designed around you after a needs analysis in the first class. You choose the day and time.');
        r.prices = [P(T('1 hora', '1 hour'), '30 €'), P(T('Bono 10 h', '10-hour pack'), '275 €'), P(T('Bono 20 h', '20-hour pack'), '495 €')];
      } else if (a.goal === 'exam') {
        r.title = T('Preparación del DELE (A2–C1)', 'DELE exam preparation (A2–C1)');
        r.text = T('El diploma oficial de español del Instituto Cervantes. Trabajas las cuatro destrezas, más vocabulario y gramática.', 'The official Instituto Cervantes Spanish diploma. You work on all four skills, plus vocabulary and grammar.');
        r.prices = a.when === 'intensive' ? [P(T('Intensivo 20 h', 'Intensive 20 h'), '150 €'), P(T('Intensivo 40 h', 'Intensive 40 h'), '245 €')] : [P(T('2 días/semana, al mes', 'Twice a week, per month'), '85 €')];
      } else if (a.when === 'intensive') {
        r.title = T('Curso intensivo de español', 'Spanish crash course');
        r.text = T('En junio y julio, por la mañana o por la tarde: para avanzar rápido hablando y entendiendo desde el primer día.', 'In June and July, mornings or evenings: to make fast progress speaking and understanding from day one.');
        r.prices = [P(T('20 h / mes', '20 h / month'), '195 €'), P(T('40 h / mes', '40 h / month'), '250 €')];
      } else {
        r.title = T('Español «dos veces por semana»', 'Spanish “Twice a Week”');
        r.text = T('Todo el curso escolar, ideal si vives y trabajas en Marbella: hablas en español desde la primera clase.', 'All through the school year, ideal if you live and work in Marbella: you speak Spanish from the very first class.');
        r.prices = [P(T('Al mes', 'Per month'), '85 €')];
      }
      r.facts = [F.max9, F.clock, F.res];
      if (whenFact) r.facts.unshift(whenFact);
      return r;
    }
    if (a.who === 'child') {
      r.course = 'kids'; r.test = false;
      if (a.when === 'flex') { r.course = 'one2one'; r.title = T('Clases particulares para niños', 'Private lessons for children'); r.text = T('Clases «one2one» adaptadas a su edad y a lo que necesita reforzar.', 'One2one classes adapted to their age and what they need to work on.'); }
      else if (a.when === 'intensive') { r.title = T('Curso de verano para niños', 'Summer course for children'); r.text = T('Inglés divertido y motivador durante el verano, con juegos, canciones y teatro.', 'Fun, motivating English over the summer, with games, songs and drama.'); r.facts.push(T('Fechas: [fechas]', 'Dates: [dates]')); }
      else if (a.goal === 'exam') { r.title = T('Inglés para niños + Cambridge Young Learners', 'English for children + Cambridge Young Learners'); r.text = T('De 7 a 11 años preparan Starters, Movers y Flyers, exámenes divertidos diseñados por la Universidad de Cambridge.', 'Ages 7 to 11 prepare Starters, Movers and Flyers, fun exams designed by the University of Cambridge.'); r.facts.push(T('Starters · Movers · Flyers', 'Starters · Movers · Flyers')); }
      else { r.title = T('Inglés para niños (3–11)', 'English for children (3–11)'); r.text = T('Aprenden más cuando se divierten: cuentos, juegos, canciones y teatro para pensar y hablar en inglés.', 'They learn more when they have fun: stories, games, songs and drama to think and speak in English.'); }
      r.facts.push(F.clock); if (whenFact) r.facts.push(whenFact, F.tbc);
      return r;
    }
    if (a.who === 'teen') {
      r.course = 'teens';
      if (a.when === 'flex') { r.course = 'one2one'; r.title = T('Clases particulares one2one', 'One2one private lessons'); r.text = T('Para avanzar al máximo o reforzar justo lo que necesita, con un plan hecho a medida.', 'To progress as fast as possible or work on exactly what they need, with a tailored plan.'); }
      else if (a.when === 'intensive') { r.course = 'intensive'; r.title = T('Intensivo Cambridge', 'Cambridge intensive'); r.text = T('Muchas horas en poco tiempo para preparar cada parte del examen A2, B1, B2 o C1. Por las mañanas.', 'Lots of hours in a short time to prepare every paper of the A2, B1, B2 or C1 exam. Mornings.'); r.prices = INT_PRICES; r.facts.push(F.cb); }
      else if (a.goal === 'exam') { r.course = 'exam'; r.title = T('Cambridge para adolescentes', 'Cambridge for teenagers'); r.text = T('Según su nivel: A2 Key, B1 Preliminary, B2 First, C1 Advanced o C2 Proficiency. Un certificado que abre puertas en sus estudios.', 'Depending on their level: A2 Key, B1 Preliminary, B2 First, C1 Advanced or C2 Proficiency. A certificate that opens doors for their studies.'); r.facts.push(F.cb); }
      else { r.title = T('Inglés para adolescentes (12–17)', 'English for teenagers (12–17)'); r.text = T('Fluidez y precisión con temas que les interesan, para hablar con seguridad dentro y fuera del instituto.', 'Fluency and accuracy with topics they care about, to speak confidently in and out of school.'); }
      r.facts.push(F.clock); if (whenFact) r.facts.push(whenFact, F.tbc);
      return r;
    }
    // adult
    if (a.when === 'flex') {
      r.course = 'one2one'; r.title = T('Clases particulares one2one', 'One2one private lessons');
      r.text = T('Tras una entrevista, tu profesor analiza tus objetivos y diseña el curso para ti. Máximo progreso, a tu horario.', 'After an interview, your teacher analyses your goals and designs the course for you. Maximum progress, on your schedule.');
      r.facts = [F.test, T('Inglés y otros 6 idiomas', 'English and 6 other languages')];
    } else if (a.when === 'intensive') {
      r.course = 'intensive';
      r.title = a.goal === 'exam' ? T('Intensivo Cambridge (A2–C1)', 'Cambridge intensive (A2–C1)') : T('Curso intensivo de inglés', 'Intensive English course');
      r.text = T('Progresa lo equivalente a un nivel completo haciendo el máximo de horas en poco tiempo. Por las mañanas, en Marbella centro.', 'Progress the equivalent of a full level by packing the most hours into a short time. Mornings, in central Marbella.');
      r.prices = INT_PRICES; r.facts = [F.cb, F.test];
    } else if (a.goal === 'exam') {
      r.course = 'exam'; r.title = T('Preparación de exámenes Cambridge', 'Cambridge exam preparation');
      r.text = T('A2 Key, B1 Preliminary, B2 First, C1 Advanced o C2 Proficiency: consejos y técnicas para cada parte del examen, y te examinas en la escuela.', 'A2 Key, B1 Preliminary, B2 First, C1 Advanced or C2 Proficiency: tips and techniques for every paper, and you sit the exam at the school.');
      r.facts = [F.cb, F.clock, F.group];
    } else if (a.goal === 'work') {
      r.title = T('Inglés para el trabajo', 'English for work');
      r.text = T('Para quien necesita el idioma en su entorno laboral: nuevas técnicas de trabajo e ideas del mundo de los negocios, en inglés.', 'For anyone who needs the language at work: new working techniques and business ideas, in English.');
      r.facts = [F.group, F.clock, F.levels];
    } else {
      r.title = T('Inglés general', 'General English');
      r.text = T('Expresión oral, comprensión y vocabulario para el día a día y para viajar sin límites. 2,5 horas a la semana.', 'Speaking, listening and vocabulary for everyday life and travelling anywhere. 2.5 hours a week.');
      r.facts = [F.group, F.clock, F.levels];
    }
    if (whenFact) r.facts.unshift(whenFact);
    return r;
  }
  function tr(o) { return o[lang]; }
  var lastRec = null;
  function renderResult() {
    if (!lastRec) return;
    var r = lastRec, d = D();
    $('fr-title').textContent = tr(r.title);
    $('fr-text').textContent = tr(r.text);
    var facts = $('fr-facts'); facts.innerHTML = '';
    r.facts.forEach(function (f) {
      var li = document.createElement('li');
      li.innerHTML = '<svg class="ic" aria-hidden="true"><use href="#i-check"/></svg>';
      li.appendChild(document.createTextNode(tr(f)));
      facts.appendChild(li);
    });
    var pr = $('fr-price'); pr.innerHTML = '';
    if (r.prices) {
      var ul = document.createElement('ul'); ul.className = 'price-list';
      r.prices.forEach(function (p) {
        var li = document.createElement('li');
        var s = document.createElement('span'); s.textContent = tr(p.label);
        var st = document.createElement('strong'); st.textContent = p.value;
        li.appendChild(s); li.appendChild(st); ul.appendChild(li);
      });
      pr.appendChild(ul);
      var fine = document.createElement('p'); fine.className = 'fine'; fine.textContent = d.frPricesFine; pr.appendChild(fine);
    } else {
      var p0 = document.createElement('p'); p0.className = 'price';
      var lab = document.createElement('small'); lab.textContent = d.frPriceTbc + ' ';
      var ph = document.createElement('span'); ph.className = 'ph'; ph.textContent = lang === 'en' ? '[price]' : '[precio]';
      p0.appendChild(lab); p0.appendChild(ph); pr.appendChild(p0);
    }
    $('fr-test').hidden = !r.test;
    // Mark placeholder text inside facts
    qsa('#fr-facts li').forEach(function (li) {
      li.innerHTML = li.innerHTML.replace(/\[([^\]]+)\]/g, '<span class="ph">[$1]</span>');
    });
  }
  langListeners.push(renderResult);
  var trail = $('finder-trail');
  var TRAIL_KEYS = ['who', 'goal', 'when'];
  function renderTrail() {
    trail.innerHTML = '';
    TRAIL_KEYS.forEach(function (k, i) {
      if (!answers[k] || i + 1 >= stepIdx) return;
      var src = finder.querySelector('.opt[data-k="' + k + '"][data-v="' + answers[k] + '"]');
      if (!src) return;
      var li = document.createElement('li');
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'trail-chip'; b.dataset.k = k; b.dataset.step = i + 1;
      b.innerHTML = src.querySelector('svg').outerHTML;
      var t = document.createElement('span'); t.textContent = src.querySelector('.opt-t').textContent;
      b.appendChild(t);
      b.setAttribute('aria-label', D().trailEdit + ': ' + t.textContent);
      b.addEventListener('click', function () { goStep(i + 1, true); });
      li.appendChild(b); trail.appendChild(li);
    });
  }
  langListeners.push(function () { if (trail) renderTrail(); });
  function goStep(n, focus) {
    stepIdx = n;
    renderTrail();
    qsa('.finder-step', finder).forEach(function (s) { s.classList.toggle('is-active', +s.dataset.step === n); });
    qsa('.steps li', finder).forEach(function (li, i) {
      li.classList.toggle('is-done', i + 1 < n);
      li.classList.toggle('is-current', i + 1 === n);
      if (i + 1 === n) li.setAttribute('aria-current', 'step'); else li.removeAttribute('aria-current');
    });
    $('finder-back').hidden = n === 1;
    if (focus) {
      var h = n === 4 ? $('fr-title') : finder.querySelector('.finder-step[data-step="' + n + '"] .finder-q');
      if (h) h.focus({ preventScroll: true });
    }
  }
  qsa('.opt', finder).forEach(function (b) {
    b.addEventListener('click', function () {
      var k = b.dataset.k;
      answers[k] = b.dataset.v;
      qsa('.opt[data-k="' + k + '"]', finder).forEach(function (o) { o.setAttribute('aria-pressed', String(o === b)); });
      var next = stepIdx + 1;
      if (next === 4) { lastRec = recommend(answers); renderResult(); }
      if (REDUCED) { goStep(next, true); return; }
      sparkle(b, 8);
      setTimeout(function () {
        /* The chosen card morphs into its answer chip (View Transitions where supported). */
        if (document.startViewTransition) {
          b.style.viewTransitionName = 'fpick';
          var chip;
          var vt = document.startViewTransition(function () {
            b.style.viewTransitionName = '';
            goStep(next, false);
            chip = trail.querySelector('[data-k="' + k + '"]');
            if (chip) chip.style.viewTransitionName = 'fpick';
          });
          vt.finished.then(function () {
            if (chip) chip.style.viewTransitionName = '';
            var h = next === 4 ? $('fr-title') : finder.querySelector('.finder-step[data-step="' + next + '"] .finder-q');
            if (h) h.focus({ preventScroll: true });
            if (next === 4) celebrateResult();
          }, function () {});
        } else { goStep(next, true); if (next === 4) celebrateResult(); }
      }, 160);
    });
  });
  qsa('.opt', finder).forEach(function (o) { o.setAttribute('aria-pressed', 'false'); });
  function celebrateResult() {
    var res = finder.querySelector('.finder-result');
    res.classList.remove('is-celebrate'); void res.offsetWidth; res.classList.add('is-celebrate');
    sparkle(finder.querySelector('.fr-kicker'), 12);
  }
  $('finder-back').addEventListener('click', function () { goStep(Math.max(1, stepIdx - 1), true); });
  $('finder-restart').addEventListener('click', function () {
    answers = {}; qsa('.opt', finder).forEach(function (o) { o.setAttribute('aria-pressed', 'false'); });
    goStep(1, true);
  });
  $('fr-book').addEventListener('click', function () {
    if (!lastRec) return;
    prefill({ course: lastRec.course, when: answers.when, exam: '' });
  });

  /* ---------------- level test ---------------- */
  var QUESTIONS = [
    { lv: 'A1', q: 'Hi! My name ___ Laura.', o: ['am', 'is', 'are'], a: 1,
      x: T('Con un nombre en singular (como «my name») se usa «is».', 'With a singular noun such as “my name” we use “is”.') },
    { lv: 'A1', q: '___ you like coffee?', o: ['Do', 'Does', 'Are'], a: 0,
      x: T('Preguntas en presente simple con «you»: Do you…?', 'Present simple questions with “you” start with “Do”.') },
    { lv: 'A2', q: 'Yesterday we ___ to the beach.', o: ['go', 'went', 'have gone'], a: 1,
      x: T('«Yesterday» pide pasado simple: go → went.', '“Yesterday” needs the past simple: go → went.') },
    { lv: 'A2', q: 'My sister is ___ than me.', o: ['tall', 'taller', 'more tall'], a: 1,
      x: T('Los adjetivos cortos forman el comparativo con -er: tall → taller.', 'Short adjectives form the comparative with -er: tall → taller.') },
    { lv: 'B1', q: 'I ___ in Marbella since 2019.', o: ['live', 'am living', 'have lived'], a: 2,
      x: T('«Since» + algo que continúa hasta hoy → present perfect.', '“Since” + something that continues until now → present perfect.') },
    { lv: 'B1', q: 'If it ___ tomorrow, we will stay at home.', o: ['rains', 'will rain', 'would rain'], a: 0,
      x: T('Primer condicional: if + presente simple, will + verbo.', 'First conditional: if + present simple, will + verb.') },
    { lv: 'B2', q: 'By the time we arrived, the film ___.', o: ['already started', 'had already started', 'has already started'], a: 1,
      x: T('Una acción anterior a otra acción pasada → past perfect.', 'An action that happened before another past action → past perfect.') },
    { lv: 'B2', q: 'She’s used to ___ up early for work.', o: ['get', 'getting', 'got'], a: 1,
      x: T('«Be used to» (estar acostumbrado a) va seguido de -ing.', '“Be used to” (be accustomed to) is followed by the -ing form.') },
    { lv: 'B2', q: 'I wish I ___ more free time.', o: ['have', 'had', 'will have'], a: 1,
      x: T('Deseos sobre el presente: wish + pasado simple.', 'Wishes about the present: wish + past simple.') },
    { lv: 'C1', q: '___ had I left the house than it started to rain.', o: ['No sooner', 'Hardly', 'As soon as'], a: 0,
      x: T('«No sooner… than» con inversión del verbo («Hardly» va con «when»).', '“No sooner … than” with inversion (“Hardly” goes with “when”).') }
  ];
  var qi = 0, correct = 0, answered = false;
  var qIntro = $('quiz-intro'), qRun = $('quiz-run'), qRes = $('quiz-result');
  var qQ = $('quiz-q'), qOpts = $('quiz-opts'), qFb = $('quiz-feedback'), qNext = $('quiz-next');
  var resultLevel = null, streak = 0;
  var LV_ORDER = ['A1', 'A2', 'B1', 'B2', 'C1'];
  function setClimb(f, lv) {
    $('quiz-bar').style.transform = 'scaleX(' + f + ')';
    $('climb-rail').style.transform = 'translateX(' + (f * 100) + '%)';
    var reached = LV_ORDER.indexOf(lv);
    qsa('.climb-marks li').forEach(function (li, j) { li.classList.toggle('is-on', j <= reached); });
  }
  function escapeHtml(s) { return s.replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function renderQ(focus) {
    var Q = QUESTIONS[qi], d = D();
    answered = false;
    $('quiz-count').textContent = (qi + 1) + ' / ' + QUESTIONS.length;
    $('quiz-count').setAttribute('aria-label', d.count(qi + 1, QUESTIONS.length));
    setClimb(qi / QUESTIONS.length, Q.lv);
    $('quiz-level').textContent = Q.lv;
    var parts = Q.q.split('___');
    qQ.innerHTML = escapeHtml(parts[0]) + '<span class="gap" aria-label="' + (lang === 'en' ? 'blank' : 'hueco') + '">&nbsp;</span>' + escapeHtml(parts[1] || '');
    qOpts.innerHTML = '';
    Q.o.forEach(function (opt, i) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'qopt'; b.setAttribute('lang', 'en');
      b.innerHTML = '<span class="key" aria-hidden="true">' + 'ABC'[i] + '</span><span class="qtext"></span><svg class="ic mark" aria-hidden="true"><use href="#i-check"/></svg>';
      b.querySelector('.qtext').textContent = opt;
      b.addEventListener('click', function () { choose(i); });
      qOpts.appendChild(b);
    });
    qFb.innerHTML = '';
    qNext.hidden = true;
    if (focus) qQ.focus({ preventScroll: false });
  }
  function choose(i) {
    if (answered) return;
    answered = true;
    var Q = QUESTIONS[qi], d = D(), ok = i === Q.a;
    if (ok) correct++;
    var btns = qsa('.qopt', qOpts);
    btns.forEach(function (b, j) {
      b.disabled = true;
      if (j === Q.a) b.classList.add('is-right');
      else if (j === i) { b.classList.add('is-wrong'); b.querySelector('use').setAttribute('href', '#i-x'); }
      else b.classList.add('is-dim');
    });
    var gap = qQ.querySelector('.gap'); gap.textContent = Q.o[Q.a];
    qFb.innerHTML = '';
    var div = document.createElement('div');
    div.className = 'fb ' + (ok ? 'fb-ok' : 'fb-no');
    div.innerHTML = '<svg class="ic" aria-hidden="true"><use href="#' + (ok ? 'i-check' : 'i-x') + '"/></svg><span></span>';
    div.querySelector('span').textContent = (ok ? d.right : d.wrong + ' ' + d.answerIs + ' «' + Q.o[Q.a] + '».') + ' ' + tr(Q.x);
    if (lang === 'en' && !ok) div.querySelector('span').textContent = d.wrong + ' ' + d.answerIs + ' “' + Q.o[Q.a] + '”. ' + tr(Q.x);
    qFb.appendChild(div);
    setClimb((qi + 1) / QUESTIONS.length, Q.lv);
    streak = ok ? streak + 1 : 0;
    var sk = $('quiz-streak');
    $('quiz-streak-n').textContent = streak;
    sk.classList.toggle('is-on', streak >= 2);
    if (ok) {
      sparkle(btns[Q.a], streak >= 3 ? 16 : 10);
      if (streak >= 2) { sk.classList.remove('is-bump'); void sk.offsetWidth; sk.classList.add('is-bump'); }
      var rk = $('climb-rail'); rk.classList.remove('is-boost'); void rk.offsetWidth; rk.classList.add('is-boost');
    } else if (!REDUCED) {
      var wb = btns[i]; wb.classList.remove('is-shake'); void wb.offsetWidth; wb.classList.add('is-shake');
    }
    qNext.hidden = false;
    $('quiz-next-label').textContent = qi === QUESTIONS.length - 1 ? d.seeResult : (lang === 'en' ? EN.next : 'Siguiente');
    qNext.focus({ preventScroll: true });
  }
  function levelFor(c) { return c <= 2 ? 'A1' : c <= 4 ? 'A2' : c <= 6 ? 'B1' : c <= 8 ? 'B2' : 'C1'; }
  function renderResultQuiz() {
    if (!resultLevel) return;
    var d = D(), L = d.levels[resultLevel];
    $('qr-level').textContent = resultLevel;
    $('qr-name').textContent = L[0];
    $('qr-desc').textContent = L[1];
    $('qr-score').textContent = d.score(correct, QUESTIONS.length);
    qsa('.rung').forEach(function (r) {
      var code = r.querySelector('.rung-code').textContent;
      r.classList.toggle('is-you', code === resultLevel);
      r.querySelector('.rung-card h3').setAttribute('data-you', d.you);
    });
  }
  langListeners.push(renderResultQuiz);
  langListeners.push(function () { if (!qRun.hidden && !answered) renderQ(false); });
  function showResult() {
    resultLevel = levelFor(correct);
    qRun.hidden = true; qRes.hidden = false;
    renderResultQuiz();
    $('qr-level').parentNode.setAttribute('tabindex', '-1');
    $('qr-level').parentNode.focus({ preventScroll: false });
    confetti($('confetti'), LV_ORDER.indexOf(resultLevel) / 2 + .6);
    document.dispatchEvent(new CustomEvent('adv:level', { detail: resultLevel }));
  }
  function resetGame() { streak = 0; $('quiz-streak-n').textContent = '0'; $('quiz-streak').classList.remove('is-on'); }
  $('quiz-start').addEventListener('click', function () { qIntro.hidden = true; qRun.hidden = false; qi = 0; correct = 0; resetGame(); renderQ(true); });
  qNext.addEventListener('click', function () {
    if (qi < QUESTIONS.length - 1) { qi++; renderQ(true); } else showResult();
  });
  $('quiz-again').addEventListener('click', function () { qRes.hidden = true; qRun.hidden = false; qi = 0; correct = 0; resultLevel = null; resetGame(); qsa('.rung').forEach(function (r) { r.classList.remove('is-you'); }); renderQ(true); });
  $('qr-enrol').addEventListener('click', function () {
    var cur = fCourse.value;
    prefill({ course: cur && cur !== 'spanish' ? cur : 'adults', level: resultLevel, fromTest: true });
  });
  $('quiz').addEventListener('keydown', function (e) {
    if (qRun.hidden || answered || e.altKey || e.ctrlKey || e.metaKey) return;
    var k = e.key.toLowerCase(), idx = { a: 0, b: 1, c: 2, '1': 0, '2': 1, '3': 2 }[k];
    if (idx !== undefined && e.target.tagName !== 'INPUT') { e.preventDefault(); choose(idx); }
  });

  /* ---------------- exam calendar filter ---------------- */
  qsa('.chip-btn').forEach(function (b) {
    b.addEventListener('click', function () {
      var lvl = b.dataset.lvl;
      qsa('.chip-btn').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      var n = 0;
      qsa('.cal-row').forEach(function (r) {
        r.hidden = !(lvl === 'all' || r.dataset.lvl === lvl);
        if (!r.hidden && !REDUCED) { r.style.setProperty('--k', n++); r.classList.remove('is-in'); void r.offsetWidth; r.classList.add('is-in'); }
      });
    });
  });

  /* ---------------- team bubbles ---------------- */
  qsa('.tm').forEach(function (b) {
    b.addEventListener('click', function () { b.setAttribute('aria-expanded', String(b.getAttribute('aria-expanded') !== 'true')); });
  });

  /* ---------------- enrolment form ---------------- */
  function optText(sel) { var o = sel.options[sel.selectedIndex]; return o ? o.textContent.trim() : ''; }
  function digits(s) { return (s.match(/\d/g) || []).length; }
  var validators = {
    'f-course': function () { return fCourse.value !== ''; },
    'f-name': function () { return fName.value.trim().length >= 2; },
    'f-phone': function () { return digits(fPhone.value) >= 9; }
  };
  function setError(el, bad) {
    el.closest('.field').classList.toggle('has-error', bad);
    if (bad) el.setAttribute('aria-invalid', 'true'); else el.removeAttribute('aria-invalid');
  }
  function clearError(el) { setError(el, false); }
  Object.keys(validators).forEach(function (id) {
    var el = $(id);
    el.addEventListener('blur', function () { if (el.value !== '') setError(el, !validators[id]()); });
    var ok = function () { var v = validators[id](); el.closest('.field').classList.toggle('is-ok', v); if (v) clearError(el); };
    el.addEventListener('input', ok);
    el.addEventListener('change', ok);
  });
  function buildMessage() {
    var d = D(), lines = [d.msgHello, ''];
    if (fCourse.value) lines.push(d.msgCourse + ': ' + optText(fCourse));
    if (examChoice) lines.push(d.msgExam + ': ' + examChoice);
    lines.push(d.msgLevel + ': ' + (fLevel.value ? fLevel.value + (levelFromTest ? ' ' + d.msgFromTest : '') : d.msgNoLevel));
    lines.push(d.msgWhen + ': ' + optText(fWhen));
    if (fName.value.trim()) lines.push(d.msgName + ': ' + fName.value.trim());
    if (fPhone.value.trim()) lines.push(d.msgPhone + ': ' + fPhone.value.trim());
    if (fNotes.value.trim()) lines.push(d.msgNotes + ': ' + fNotes.value.trim());
    return lines.join('\n');
  }
  var typingT = null;
  function renderPreview() {
    var out = $('cp-out');
    if (!fCourse.value && !fName.value.trim() && !fPhone.value.trim()) { out.textContent = D().chatEmpty; return; }
    out.textContent = buildMessage();
    if (REDUCED) return;
    var cp = out.closest('.chat-preview');
    cp.classList.add('is-typing');
    clearTimeout(typingT);
    typingT = setTimeout(function () { cp.classList.remove('is-typing'); out.classList.remove('is-new'); void out.offsetWidth; out.classList.add('is-new'); }, 650);
  }
  langListeners.push(renderPreview);
  [fCourse, fLevel, fWhen, fName, fPhone, fNotes].forEach(function (el) {
    el.addEventListener('input', renderPreview); el.addEventListener('change', renderPreview);
  });
  fLevel.addEventListener('change', function () { levelFromTest = false; renderPreview(); });
  fCourse.addEventListener('change', function () { examChoice = ''; renderPreview(); });
  var sendMode = 'wa';
  qsa('[data-send]', form).forEach(function (b) { b.addEventListener('click', function () { sendMode = b.dataset.send; }); });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var firstBad = null;
    Object.keys(validators).forEach(function (id) {
      var el = $(id), bad = !validators[id]();
      setError(el, bad);
      if (bad && !firstBad) firstBad = el;
    });
    var status = $('form-status'), d = D();
    if (firstBad) { status.textContent = d.statusErr; status.style.color = 'var(--coral-d)'; firstBad.focus(); return; }
    var msg = buildMessage();
    status.style.color = '';
    var sb = form.querySelector('[data-send="' + sendMode + '"]');
    if (!REDUCED && sb) { sb.classList.remove('is-sent'); void sb.offsetWidth; sb.classList.add('is-sent'); sparkle(sb, 12); }
    if (sendMode === 'wa') {
      status.textContent = d.statusWa;
      window.open('https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg), '_blank', 'noopener');
    } else {
      status.textContent = d.statusMail;
      var subject = d.subject + ' · ' + optText(fCourse) + ' · ' + fName.value.trim();
      window.location.href = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(msg);
    }
  });

  /* ---------------- deferred non-Latin glyphs ----------------
     Decorative Russian, Chinese and Arabic words are filled in after load: the system
     fallback-font lookup for these scripts is slow on first use and would block the first layout. */
  function fillGlyphs(root) { qsa('[data-glyph]', root).forEach(function (el) { el.textContent = el.dataset.glyph; }); }
  var glyphHosts = qsa('.ticker-wrap, .ml-bubbles, .team');
  if ('IntersectionObserver' in window) {
    var gio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { fillGlyphs(en.target); gio.unobserve(en.target); } });
    }, { rootMargin: '150px 0px' });
    glyphHosts.forEach(function (h) { gio.observe(h); });
  } else { fillGlyphs(document); }

  /* ---------------- init ---------------- */
  applyLang();
  onScroll();
  /* Hero bubbles in Russian, Chinese and Arabic: filled once the page has settled (same reason as above). */
  var bubbleGlyphs = function () {
    if (!bubbleGlyphs) return;
    bubbleGlyphs = null;
    ['pointerdown', 'keydown', 'touchstart', 'wheel'].forEach(function (t) { removeEventListener(t, fillB, true); });
    (window.requestIdleCallback || setTimeout)(function () { fillGlyphs($('bubble-field')); document.dispatchEvent(new Event('adv:glyphs')); });
  };
  function fillB() { if (bubbleGlyphs) bubbleGlyphs(); }
  ['pointerdown', 'keydown', 'touchstart', 'wheel'].forEach(function (t) { addEventListener(t, fillB, { capture: true, passive: true }); });
  addEventListener('load', function () { setTimeout(fillB, 7000); });
})();
