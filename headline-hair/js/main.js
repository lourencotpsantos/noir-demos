/* Headline Hairdresser — concept by Noir Digital. Vanilla JS, no build step. */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const DESK = window.matchMedia('(min-width: 900px)');
  /* The salon publishes no WhatsApp number. Put it here (e.g. '34600000000') once confirmed. */
  const WHATSAPP = '';
  const PHONE = '+34952442624';

  let lang = document.documentElement.lang === 'en' ? 'en' : 'es';
  const T = (es, en) => (lang === 'en' ? en : es);
  const L = o => (o ? o[lang] || o.es : '');
  const onLang = [];

  /* ---------- i18n ---------- */
  $$('[data-en]').forEach(el => { el.dataset.es = el.textContent; });
  $$('[data-en-html]').forEach(el => { el.dataset.esHtml = el.innerHTML; });
  $$('[data-en-aria]').forEach(el => { el.dataset.esAria = el.getAttribute('aria-label') || ''; });
  $$('[data-en-alt]').forEach(el => { el.dataset.esAlt = el.alt; });
  $$('[data-en-ph]').forEach(el => { el.dataset.esPh = el.placeholder; });
  function applyLang() {
    document.documentElement.lang = lang;
    document.documentElement.classList.remove('pre-en');
    $$('[data-en]').forEach(el => { el.textContent = lang === 'en' ? el.dataset.en : el.dataset.es; });
    $$('[data-en-html]').forEach(el => { el.innerHTML = lang === 'en' ? el.dataset.enHtml : el.dataset.esHtml; });
    $$('[data-en-aria]').forEach(el => el.setAttribute('aria-label', lang === 'en' ? el.dataset.enAria : el.dataset.esAria));
    $$('[data-en-alt]').forEach(el => { el.alt = lang === 'en' ? el.dataset.enAlt : el.dataset.esAlt; });
    $$('[data-en-ph]').forEach(el => { el.placeholder = lang === 'en' ? el.dataset.enPh : el.dataset.esPh; });
    $$('.lang-btn').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
    document.title = T('Headline Hairdresser · Peluquería y uñas en Arroyo de la Miel', 'Headline Hairdresser · Hair & nail salon in Arroyo de la Miel');
    onLang.forEach(f => f());
  }
  function setLang(l) {
    lang = l;
    try { localStorage.setItem('hh-lang', l); } catch (e) { /* private mode */ }
    applyLang();
    const n = $('.en-nudge'); if (n) n.hidden = true;
  }
  $$('.lang-btn, .en-nudge-btn').forEach(b => b.addEventListener('click', () => setLang(b.dataset.lang)));

  /* ---------- toast ---------- */
  const toastEl = $('.toast');
  let toastT;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('on');
    clearTimeout(toastT);
    toastT = setTimeout(() => toastEl.classList.remove('on'), 2600);
  }

  /* ---------- header ---------- */
  const hdr = $('.hdr');
  let hdrSolid = false;
  function hdrCheck() {
    const s = window.scrollY > 40;
    if (s !== hdrSolid) { hdrSolid = s; hdr.classList.toggle('solid', s); }
  }

  /* ---------- hero ---------- */
  const hero = $('.hero');
  let heroVisible = true, heroH = window.innerHeight, sp = 0;
  let mx = 0, my = 0, tmx = 0, tmy = 0, rafId = 0;
  requestAnimationFrame(() => requestAnimationFrame(() => hero.classList.add('in')));

  function loadHair() {
    if (RM) return;
    const imgs = $$('.sway', hero);
    let n = 0;
    imgs.forEach(img => {
      img.addEventListener('load', () => { if (++n === imgs.length) hero.classList.add('ready'); }, { once: true });
      img.src = DESK.matches ? img.dataset.d : img.dataset.m;
    });
  }
  const startHair = () => ('requestIdleCallback' in window ? requestIdleCallback(loadHair, { timeout: 1500 }) : setTimeout(loadHair, 300));
  if (document.readyState === 'complete') startHair(); else window.addEventListener('load', startHair, { once: true });
  DESK.addEventListener('change', () => { if (hero.classList.contains('ready')) $$('.sway', hero).forEach(img => { img.src = DESK.matches ? img.dataset.d : img.dataset.m; }); });

  function frame() {
    rafId = 0;
    hdrCheck();
    if (!heroVisible || RM) return;
    const nsp = Math.min(1, Math.max(0, window.scrollY / heroH));
    mx += (tmx - mx) * 0.08; my += (tmy - my) * 0.08;
    if (Math.abs(nsp - sp) > 0.0005) { sp = nsp; hero.style.setProperty('--sp', sp.toFixed(4)); }
    hero.style.setProperty('--mx', mx.toFixed(3));
    hero.style.setProperty('--my', my.toFixed(3));
    if (Math.abs(tmx - mx) > 0.002 || Math.abs(tmy - my) > 0.002) rafId = requestAnimationFrame(frame);
  }
  const kick = () => { if (!rafId) rafId = requestAnimationFrame(frame); };
  window.addEventListener('scroll', kick, { passive: true });
  window.addEventListener('resize', () => { heroH = window.innerHeight; kick(); }, { passive: true });
  if (!RM && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    hero.addEventListener('pointermove', e => {
      tmx = (e.clientX / window.innerWidth - 0.5) * 2;
      tmy = (e.clientY / window.innerHeight - 0.5) * 2;
      kick();
    });
    hero.addEventListener('pointerleave', () => { tmx = 0; tmy = 0; kick(); });
  }
  new IntersectionObserver(es => {
    heroVisible = es[0].isIntersecting;
    hero.classList.toggle('paused', !heroVisible);
    if (heroVisible) kick();
  }).observe(hero);
  hdrCheck();

  // English nudge for visitors whose browser isn't Spanish
  try {
    const langs = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || ''];
    if (lang === 'es' && !langs.some(l => /^es\b/i.test(l))) $('.en-nudge').hidden = false;
  } catch (e) { /* ignore */ }

  /* ---------- reveal on scroll ---------- */
  const rvIO = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); rvIO.unobserve(e.target); }
  }), { rootMargin: '0px 0px -10% 0px' });
  $$('.rv').forEach(el => rvIO.observe(el));

  /* ---------- roving radio groups ---------- */
  function radioGroup(group, sel, onPick) {
    const items = () => $$(sel, group);
    const sync = () => {
      const its = items();
      const cur = its.find(i => i.getAttribute('aria-checked') === 'true') || its[0];
      its.forEach(i => { i.tabIndex = i === cur ? 0 : -1; });
    };
    const pick = (btn, focus) => {
      items().forEach(i => i.setAttribute('aria-checked', String(i === btn)));
      sync();
      if (focus) btn.focus();
      onPick(btn);
    };
    group.addEventListener('click', e => { const b = e.target.closest(sel); if (b && group.contains(b)) pick(b); });
    group.addEventListener('keydown', e => {
      const k = e.key; const its = items(); const i = its.indexOf(document.activeElement);
      if (i < 0) return;
      let n = -1;
      if (k === 'ArrowRight' || k === 'ArrowDown') n = (i + 1) % its.length;
      else if (k === 'ArrowLeft' || k === 'ArrowUp') n = (i - 1 + its.length) % its.length;
      else if (k === 'Home') n = 0; else if (k === 'End') n = its.length - 1;
      if (n >= 0) { e.preventDefault(); pick(its[n], true); }
    });
    sync();
    return { pick, sync };
  }

  /* ---------- data ---------- */
  const SVC = [
    { cat: { es: 'Corte', en: 'Cut' }, items: [
      { id: 'corte-m', k: 'cut', n: { es: 'Corte mujer', en: "Women's cut" }, d: { es: 'Con lavado y peinado', en: 'With wash and styling' } },
      { id: 'corte-h', k: 'men', n: { es: 'Corte caballero', en: "Men's cut" }, d: { es: 'Tijera o máquina', en: 'Scissors or clippers' } },
      { id: 'peinar', k: 'blow', n: { es: 'Lavar y peinar', en: 'Wash & blow-dry' }, d: { es: 'Brushing liso o con volumen', en: 'Smooth or with volume' } },
      { id: 'ondas', k: 'curl', n: { es: 'Ondas y peinados de evento', en: 'Waves & event styling' }, d: { es: 'Bodas, fiestas, ocasiones', en: 'Weddings, parties, occasions' } }
    ] },
    { cat: { es: 'Color', en: 'Colour' }, items: [
      { id: 'tinte', k: 'wash', n: { es: 'Color de raíz', en: 'Root colour' }, d: { es: 'Cobertura de canas o cambio de tono', en: 'Grey coverage or a new shade' } },
      { id: 'mechas', k: 'curl', n: { es: 'Mechas · balayage', en: 'Highlights · balayage' }, d: { es: 'Luz natural y degradados', en: 'Natural light and soft blends' } },
      { id: 'matiz', k: 'wash', n: { es: 'Matiz y brillo', en: 'Toner & gloss' }, d: { es: 'Refresca el tono y aporta brillo', en: 'Refreshes the tone and adds shine' } }
    ] },
    { cat: { es: 'Cuidado', en: 'Care' }, items: [
      { id: 'tratamiento', k: 'wash', n: { es: 'Tratamiento hidratante', en: 'Hydrating treatment' }, d: { es: 'Para pelo seco o dañado', en: 'For dry or damaged hair' } }
    ] },
    { cat: { es: 'Uñas', en: 'Nails' }, items: [
      { id: 'manicura', k: 'nails', n: { es: 'Manicura', en: 'Manicure' }, d: { es: 'Limado, cutículas y esmalte', en: 'Shape, cuticles and polish' } },
      { id: 'semi', k: 'nails', n: { es: 'Esmaltado semipermanente', en: 'Gel polish' }, d: { es: 'Larga duración', en: 'Long lasting' } },
      { id: 'pedicura', k: 'nails', n: { es: 'Pedicura', en: 'Pedicure' }, d: { es: '[por confirmar]', en: '[to be confirmed]' } }
    ] }
  ];
  const BYID = {};
  SVC.forEach(c => c.items.forEach(i => { BYID[i.id] = i; }));
  const picked = new Set();
  let shade = null;

  /* ---------- menu ---------- */
  const list = $('#carta-list');
  const peek = $('.carta-peek');
  function renderMenu() {
    list.innerHTML = SVC.map(c => `
      <div class="cat rv in"><div class="cat-h"><h3>${L(c.cat)}</h3><span>${c.items.length} ${T('servicios', 'services')}</span></div>
      ${c.items.map(i => `<div class="row" data-id="${i.id}" data-k="${i.k}">
        <p class="row-n">${L(i.n)}<small>${L(i.d)}</small></p>
        <span class="row-p">${T('[precio]', '[price]')}</span>
        <button type="button" class="row-add" aria-pressed="${picked.has(i.id)}" aria-label="${T('Añadir a mi cita: ', 'Add to my appointment: ')}${L(i.n)}"><svg class="ic" aria-hidden="true"><use href="#i-plus"/></svg></button>
      </div>`).join('')}</div>`).join('');
  }
  renderMenu();
  onLang.push(renderMenu);
  function peekTo(row) {
    if (!row || !DESK.matches) return;
    $$('.row.act', list).forEach(r => r.classList.remove('act'));
    row.classList.add('act');
    const k = row.dataset.k;
    $$('.peek-frame img', peek).forEach(img => img.classList.toggle('on', img.dataset.k === k));
    $('.peek-name', peek).textContent = L(BYID[row.dataset.id].n);
  }
  list.addEventListener('pointerover', e => peekTo(e.target.closest('.row')));
  list.addEventListener('focusin', e => peekTo(e.target.closest('.row')));
  list.addEventListener('click', e => {
    const b = e.target.closest('.row-add'); if (!b) return;
    toggleSvc(b.closest('.row').dataset.id);
  });

  function toggleSvc(id, force) {
    const on = force === undefined ? !picked.has(id) : force;
    if (on) picked.add(id); else picked.delete(id);
    $$(`.row[data-id="${id}"] .row-add`).forEach(b => b.setAttribute('aria-pressed', String(on)));
    $$(`.chip-s[data-id="${id}"]`).forEach(b => b.setAttribute('aria-pressed', String(on)));
    updateTicket('svc');
    if (force === undefined && !b_svcClick) toast(on ? T('Añadido a tu cita: ', 'Added to your appointment: ') + L(BYID[id].n) : T('Quitado: ', 'Removed: ') + L(BYID[id].n));
  }
  let b_svcClick = false;

  /* ---------- before / after ---------- */
  const ba = $('.ba');
  const BA = {
    balay: { svc: { es: 'Balayage', en: 'Balayage' }, id: 'mechas', b: { es: 'Antes: melena castaña de un solo tono (simulación)', en: 'Before: single-tone brown hair (simulation)' }, a: { es: 'Después: balayage rubio miel', en: 'After: honey-blonde balayage' } },
    copper: { svc: { es: 'Color cobrizo', en: 'Copper colour' }, id: 'tinte', b: { es: 'Antes: castaño apagado (simulación)', en: 'Before: dull brown (simulation)' }, a: { es: 'Después: cobrizo intenso', en: 'After: rich copper' } },
    gloss: { svc: { es: 'Matiz y brillo', en: 'Toner & gloss' }, id: 'matiz', b: { es: 'Antes: pelo oscuro sin brillo (simulación)', en: 'Before: dark hair without shine (simulation)' }, a: { es: 'Después: negro con brillo', en: 'After: glossy black' } }
  };
  let baKey = 'balay', baP = 50, baDemo = 0;
  const range = $('.ba-range', ba);
  const setP = p => { baP = Math.max(0, Math.min(100, p)); ba.style.setProperty('--p', baP.toFixed(2)); range.value = Math.round(baP); range.setAttribute('aria-valuetext', `${Math.round(baP)}% ${T('después', 'after')}`); };
  const setBW = () => ba.style.setProperty('--bw', ba.clientWidth + 'px');
  setBW();
  if ('ResizeObserver' in window) new ResizeObserver(setBW).observe(ba);
  let dragging = false, rect = null;
  const pFromX = x => ((x - rect.left) / rect.width) * 100;
  ba.addEventListener('pointerdown', e => {
    if (e.button > 0) return;
    cancelAnimationFrame(baDemo);
    rect = ba.getBoundingClientRect();
    dragging = true; ba.classList.add('drag');
    if (e.pointerType === 'mouse') { setP(pFromX(e.clientX)); ba.setPointerCapture(e.pointerId); }
  });
  ba.addEventListener('pointermove', e => {
    if (!dragging) return;
    if (e.pointerType !== 'mouse' && !ba.hasPointerCapture(e.pointerId)) ba.setPointerCapture(e.pointerId);
    setP(pFromX(e.clientX));
  });
  const end = () => { dragging = false; ba.classList.remove('drag'); };
  ba.addEventListener('pointerup', end);
  ba.addEventListener('pointercancel', end);
  ba.addEventListener('click', () => range.focus({ preventScroll: true }));
  range.addEventListener('input', () => { cancelAnimationFrame(baDemo); setP(+range.value); });
  setP(50);
  function swapBA(key) {
    baKey = key;
    const d = BA[key];
    const bi = $('.ba-before img', ba), ai = $('.ba-after', ba);
    bi.srcset = `img/ba-${key}-before-640.webp 640w, img/ba-${key}-before-1000.webp 1000w`; bi.src = `img/ba-${key}-before-640.webp`;
    ai.srcset = `img/ba-${key}-after-640.webp 640w, img/ba-${key}-after-1000.webp 1000w`; ai.src = `img/ba-${key}-after-640.webp`;
    bi.dataset.esAlt = d.b.es; bi.dataset.enAlt = d.b.en; bi.alt = L(d.b);
    ai.dataset.esAlt = d.a.es; ai.dataset.enAlt = d.a.en; ai.alt = L(d.a);
    $('.ba-svc').textContent = L(d.svc);
    ba.classList.remove('swap'); void ba.offsetWidth; ba.classList.add('swap');
    if (!RM) demoSweep([50, 72, 50], 1200); else setP(50);
  }
  onLang.push(() => { $('.ba-svc').textContent = L(BA[baKey].svc); });
  $$('.reveal .tab').forEach(t => t.addEventListener('click', () => {
    $$('.reveal .tab').forEach(x => x.setAttribute('aria-selected', String(x === t)));
    swapBA(t.dataset.ba);
  }));
  $('.ba-book').addEventListener('click', () => toggleSvc(BA[baKey].id, true));
  function demoSweep(pts, dur) {
    cancelAnimationFrame(baDemo);
    const t0 = performance.now(); const seg = pts.length - 1;
    const ease = t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
    const step = now => {
      const t = Math.min(1, (now - t0) / dur);
      const f = t * seg; const i = Math.min(seg - 1, Math.floor(f));
      setP(pts[i] + (pts[i + 1] - pts[i]) * ease(f - i));
      if (t < 1) baDemo = requestAnimationFrame(step);
    };
    baDemo = requestAnimationFrame(step);
  }
  if (!RM) {
    const io = new IntersectionObserver(es => {
      if (es[0].isIntersecting) { io.disconnect(); setTimeout(() => demoSweep([50, 84, 18, 50], 3200), 350); }
    }, { threshold: 0.55 });
    io.observe(ba);
  }

  /* ---------- find your look ---------- */
  const look = $('.look');
  const TONES = {
    natural: { n: { es: 'Natural', en: 'Natural' }, svc: [], txt: { es: 'tu color de siempre, con más luz y forma', en: 'your own colour, with more light and shape' } },
    miel: { n: { es: 'Miel luminoso', en: 'Luminous honey' }, svc: ['mechas'], txt: { es: 'mechas miel que dan luz sin raíz marcada', en: 'honey highlights that add light with no harsh root' } },
    cobre: { n: { es: 'Cobre intenso', en: 'Rich copper' }, svc: ['tinte', 'matiz'], txt: { es: 'un cobrizo cálido que favorece con la luz del sur', en: 'a warm copper that loves southern light' } },
    choco: { n: { es: 'Chocolate', en: 'Chocolate' }, svc: ['tinte'], txt: { es: 'un castaño profundo, brillante y fácil de llevar', en: 'a deep, glossy brown that is easy to wear' } },
    ceniza: { n: { es: 'Rubio ceniza', en: 'Ash blonde' }, svc: ['mechas', 'matiz'], txt: { es: 'un rubio frío matizado para evitar tonos amarillos', en: 'a cool, toned blonde without brassiness' } },
    rosa: { n: { es: 'Oro rosa', en: 'Rose gold' }, svc: ['matiz'], txt: { es: 'un reflejo rosado suave que se va con los lavados', en: 'a soft rosy tint that fades gently with washing' } }
  };
  const LENS = { short: { es: 'corto', en: 'short' }, mid: { es: 'media melena', en: 'shoulder length' }, long: { es: 'largo', en: 'long' } };
  const VIBES = {
    easy: { svc: ['tratamiento'], txt: { es: 'Pensado para salir de casa en cinco minutos.', en: 'Designed to be ready in five minutes.' } },
    polish: { svc: ['peinar'], txt: { es: 'Con un acabado pulido para el día a día.', en: 'With a polished finish for every day.' } },
    bold: { svc: ['corte-m'], txt: { es: 'Con un corte nuevo para que el cambio se note.', en: 'With a fresh cut so the change really shows.' } }
  };
  const LK = { tone: 'natural', len: null, vibe: null, step: 1 };
  const nameEl = $('.look-name'), nameTxt = $('.look-name-txt');
  function setTone(t) {
    LK.tone = t;
    $$('.tint', look).forEach(el => el.classList.toggle('on', el.classList.contains('t-' + t)));
    nameEl.classList.add('flip');
    setTimeout(() => { nameTxt.textContent = L(TONES[t].n); nameEl.classList.remove('flip'); }, RM ? 0 : 260);
  }
  radioGroup($('.swatches', look), '.sw', b => setTone(b.dataset.tone));
  radioGroup($('.q2 .opts', look), '.opt', b => { LK.len = b.dataset.len; navState(); });
  radioGroup($('.q3 .opts', look), '.opt', b => { LK.vibe = b.dataset.vibe; navState(); });
  const back = $('.q-back', look), next = $('.q-next', look);
  function lookSvcs() {
    const s = new Set([...TONES[LK.tone].svc, ...(VIBES[LK.vibe] || { svc: [] }).svc]);
    if (LK.tone === 'natural' && LK.vibe !== 'bold') s.add('corte-m');
    return [...s];
  }
  function renderResult() {
    const t = TONES[LK.tone];
    $('.result-title', look).textContent = `${L(t.n)}, ${L(LENS[LK.len])}`;
    $('.result-text', look).textContent = `${T('Te proponemos ', 'We suggest ')}${L(t.txt)}. ${L(VIBES[LK.vibe].txt)}`;
    $('.result-svcs', look).innerHTML = lookSvcs().map(id => `<li>${L(BYID[id].n)}</li>`).join('');
  }
  function navState() {
    back.disabled = LK.step === 1;
    next.disabled = (LK.step === 2 && !LK.len) || (LK.step === 3 && !LK.vibe);
  }
  function goStep(n) {
    LK.step = n;
    $$('.q', look).forEach(q => q.classList.toggle('on', +q.dataset.q === n));
    $$('.steps li', look).forEach((li, i) => { li.classList.toggle('on', i + 1 === Math.min(n, 3)); li.classList.toggle('done', i + 1 < n); });
    look.classList.toggle('done', n === 4);
    if (n === 4) renderResult();
    navState();
  }
  next.addEventListener('click', () => { if (!next.disabled) goStep(LK.step + 1); });
  back.addEventListener('click', () => { if (LK.step > 1) goStep(LK.step - 1); });
  $('.look-reset', look).addEventListener('click', () => {
    LK.len = null; LK.vibe = null;
    $$('.q2 .opt, .q3 .opt', look).forEach(o => o.setAttribute('aria-checked', 'false'));
    goStep(1); next.focus();
  });
  $('.look-add', look).addEventListener('click', () => {
    b_svcClick = true; lookSvcs().forEach(id => toggleSvc(id, true)); b_svcClick = false;
    lookNote = `${L(TONES[LK.tone].n)}, ${L(LENS[LK.len])}`;
    updateTicket('svc');
    toast(T('Look añadido a tu cita', 'Look added to your appointment'));
    $('#cita').scrollIntoView({ behavior: RM ? 'auto' : 'smooth' });
  });
  let lookNote = '';
  onLang.push(() => { nameTxt.textContent = L(TONES[LK.tone].n); if (LK.step === 4) renderResult(); });
  navState();

  /* ---------- nails fan ---------- */
  const SHADES = [
    { c: '#e9cfc0', n: { es: 'Nude Sagitario', en: 'Sagitario Nude' } },
    { c: '#d9a3a0', n: { es: 'Rosa té', en: 'Tea Rose' } },
    { c: '#e07a5f', n: { es: 'Coral Malapesquera', en: 'Malapesquera Coral' } },
    { c: '#b01d2a', n: { es: 'Rojo Benalmádena', en: 'Benalmádena Red' } },
    { c: '#6b1d2c', n: { es: 'Burdeos', en: 'Burgundy' } },
    { c: '#b98a5e', n: { es: 'Arena de Arroyo', en: 'Arroyo Sand' } },
    { c: '#f3eee6', n: { es: 'Perla', en: 'Pearl' } },
    { c: '#221a1f', n: { es: 'Noche', en: 'Midnight' } }
  ];
  const fan = $('.fan');
  let shadeIdx = 3, dropFlip = 0;
  function renderFan() {
    const n = SHADES.length, spread = DESK.matches ? 100 : 96;
    fan.innerHTML = SHADES.map((s, i) => {
      const r = -spread / 2 + (spread / (n - 1)) * i;
      return `<button type="button" class="chip" role="radio" aria-checked="${i === shadeIdx}" tabindex="${i === shadeIdx ? 0 : -1}" style="--c:${s.c};--r:${r.toFixed(1)}deg;transition-delay:${(i * 0.05).toFixed(2)}s;z-index:${i === shadeIdx ? 20 : i}" data-i="${i}" aria-label="${L(s.n)}"><span aria-hidden="true">${L(s.n)}</span></button>`;
    }).join('');
  }
  renderFan();
  function pickShade(i) {
    shadeIdx = i;
    $$('.chip', fan).forEach((c, j) => { c.style.zIndex = j === i ? 20 : j; c.style.transitionDelay = '0s'; });
    const drops = $$('.drop-c'); dropFlip ^= 1;
    drops[dropFlip].style.setProperty('--c', SHADES[i].c);
    drops[dropFlip].style.opacity = 1; drops[dropFlip ^ 1].style.opacity = 0;
    const d = $('.drop'); d.classList.remove('pop'); void d.offsetWidth; d.classList.add('pop');
    $('.lq-name').textContent = L(SHADES[i].n);
    shade = i;
  }
  const fanRG = radioGroup(fan, '.chip', b => pickShade(+b.dataset.i));
  onLang.push(() => { renderFan(); fanRG.sync(); fan.classList.add('open'); $('.lq-name').textContent = L(SHADES[shadeIdx].n); });
  if (RM) fan.classList.add('open');
  else {
    const io = new IntersectionObserver(es => { if (es[0].isIntersecting) { io.disconnect(); fan.classList.add('open'); } }, { threshold: 0.4 });
    io.observe(fan);
  }
  $('.lq-add').addEventListener('click', () => {
    shade = shadeIdx;
    b_svcClick = true; toggleSvc('manicura', true); b_svcClick = false;
    updateTicket('svc');
    toast(T('Manicura en ', 'Manicure in ') + L(SHADES[shadeIdx].n) + T(' añadida', ' added'));
  });
  shade = null;

  /* ---------- booking ---------- */
  const chipsEl = $('#svc-chips');
  function renderChips() {
    chipsEl.innerHTML = SVC.flatMap(c => c.items).map(i => `<button type="button" class="chip-s" data-id="${i.id}" aria-pressed="${picked.has(i.id)}"><svg class="ic" aria-hidden="true"><use href="#i-check"/></svg>${L(i.n)}</button>`).join('');
  }
  renderChips();
  onLang.push(renderChips);
  chipsEl.addEventListener('click', e => {
    const b = e.target.closest('.chip-s'); if (!b) return;
    b_svcClick = true; toggleSvc(b.dataset.id); b_svcClick = false;
  });
  const BK = { sty: 'any', day: null, slot: 'x' };
  radioGroup($('.stylists'), '.sty', b => { BK.sty = b.dataset.sty; updateTicket('sty'); });
  radioGroup($('.times'), '.opt', b => { BK.slot = b.dataset.slot; updateTicket('time'); });
  const daysEl = $('#days');
  const DAYS = [];
  const today = new Date(); today.setHours(12, 0, 0, 0);
  for (let i = 0; i < 14; i++) { const d = new Date(today); d.setDate(today.getDate() + i); DAYS.push(d); }
  let daysRG;
  function renderDays() {
    const loc = lang === 'en' ? 'en-GB' : 'es-ES';
    daysEl.innerHTML = DAYS.map((d, i) => {
      const wd = i === 0 ? T('Hoy', 'Today') : i === 1 ? T('Mañana', 'Tmrw') : d.toLocaleDateString(loc, { weekday: 'short' }).replace('.', '');
      const on = BK.day === i;
      return `<button type="button" class="day" role="radio" aria-checked="${on}" data-i="${i}" aria-label="${d.toLocaleDateString(loc, { weekday: 'long', day: 'numeric', month: 'long' })}"><small>${wd}</small><b>${d.getDate()}</b></button>`;
    }).join('');
    if (daysRG) daysRG.sync();
  }
  renderDays();
  daysRG = radioGroup(daysEl, '.day', b => { BK.day = +b.dataset.i; updateTicket('day'); });
  onLang.push(renderDays);

  const fmtDay = i => DAYS[i].toLocaleDateString(lang === 'en' ? 'en-GB' : 'es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
  const SLOT = { m: { es: 'Mañana (desde las 10:00)', en: 'Morning (from 10:00)' }, a: { es: 'Tarde', en: 'Afternoon' }, x: { es: 'Cuando os venga bien', en: 'Whenever suits' } };
  const tSvc = $('#t-svc'), tSty = $('#t-sty'), tDay = $('#t-day'), tTime = $('#t-time'), tMsg = $('#t-msg');
  const fName = $('#f-name'), fNote = $('#f-note');
  function svcLabel() {
    const names = [...picked].map(id => {
      let n = L(BYID[id].n);
      if (id === 'manicura' && shade !== null) n += ` (${L(SHADES[shade].n)})`;
      return n;
    });
    return names;
  }
  function bump(el) { if (RM) return; el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump'); }
  function buildMsg() {
    const s = svcLabel();
    const lines = [T('Hola, Headline. Me gustaría pedir cita.', 'Hello Headline, I would like to book an appointment.')];
    lines.push(T('Servicio: ', 'Service: ') + (s.length ? s.join(', ') : T('[por elegir]', '[to choose]')));
    if (lookNote) lines.push(T('Look de referencia: ', 'Reference look: ') + lookNote);
    lines.push(T('Estilista: ', 'Stylist: ') + (BK.sty === 'any' ? T('sin preferencia', 'no preference') : BK.sty));
    lines.push(T('Día: ', 'Day: ') + (BK.day === null ? T('el primero disponible', 'first available') : fmtDay(BK.day)));
    lines.push(T('Hora: ', 'Time: ') + L(SLOT[BK.slot]));
    const nm = fName.value.trim(), nt = fNote.value.trim();
    if (nt) lines.push(T('Nota: ', 'Note: ') + nt);
    lines.push(nm ? T('Gracias, ', 'Thank you, ') + nm + '.' : T('Gracias.', 'Thank you.'));
    return lines.join('\n');
  }
  function updateTicket(which) {
    const s = svcLabel();
    tSvc.textContent = s.length ? s.join(' · ') : T('Elige uno o varios', 'Choose one or more');
    tSty.textContent = BK.sty === 'any' ? T('Sin preferencia', 'No preference') : BK.sty;
    tDay.textContent = BK.day === null ? T('Elige un día', 'Pick a day') : fmtDay(BK.day);
    tTime.textContent = L(SLOT[BK.slot]);
    tMsg.textContent = buildMsg();
    const map = { svc: tSvc, sty: tSty, day: tDay, time: tTime };
    if (map[which]) bump(map[which]);
  }
  [fName, fNote].forEach(f => f.addEventListener('input', () => { tMsg.textContent = buildMsg(); }));
  onLang.push(() => updateTicket());
  updateTicket();

  async function copyMsg() {
    const txt = buildMsg();
    try { await navigator.clipboard.writeText(txt); return true; } catch (e) {
      const ta = document.createElement('textarea'); ta.value = txt; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      let ok = false; try { ok = document.execCommand('copy'); } catch (er) { ok = false; }
      ta.remove(); return ok;
    }
  }
  const status = $('.t-status');
  $('.t-copy').addEventListener('click', async () => {
    const ok = await copyMsg();
    status.textContent = ok ? T('Mensaje copiado. Pégalo donde quieras o léelo al llamar.', 'Message copied. Paste it anywhere or read it out when you call.') : T('No se pudo copiar: selecciona el texto del mensaje.', 'Could not copy: please select the message text.');
  });
  $('.t-call').addEventListener('click', () => { copyMsg().then(ok => { if (ok) status.textContent = T('Te hemos copiado el mensaje para tenerlo a mano durante la llamada.', 'We copied your message so you have it to hand during the call.'); }); });
  const wa = $('.t-wa');
  if (WHATSAPP) { wa.removeAttribute('aria-disabled'); }
  wa.addEventListener('click', () => {
    if (!WHATSAPP) { toast(T('WhatsApp: número por confirmar con el salón. Mientras, llama al 952 44 26 24.', 'WhatsApp: number to be confirmed with the salon. Meanwhile, call 952 44 26 24.')); return; }
    window.open('https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(buildMsg()), '_blank', 'noopener');
  });
  void PHONE;

  if (lang === 'en') applyLang();
})();
