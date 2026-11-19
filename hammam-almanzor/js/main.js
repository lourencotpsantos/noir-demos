/* Hammam Almanzor · concept by Noir Digital */
(() => {
  'use strict';
  const D = document, R = D.documentElement;
  const $ = (s, c = D) => c.querySelector(s), $$ = (s, c = D) => [...c.querySelectorAll(s)];
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const DATA = window.HA_DATA;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  let lang = 'es';
  try { lang = localStorage.getItem('ha-lang') === 'en' ? 'en' : 'es'; } catch (e) {}
  const T = (es, en) => (lang === 'en' ? en : es);
  const L = o => (o ? o[lang] || o.es : '');
  const eur = n => (lang === 'en' ? '€' + n : n + ' €');
  const ITEMS = {};
  DATA.cats.forEach(c => c.groups.forEach(g => g.items.forEach(i => { ITEMS[i.id] = Object.assign({ cat: c.id, group: g }, i); })));
  const waLink = text => 'https://wa.me/' + DATA.phone + '?text=' + encodeURIComponent(text);
  const onLang = [];

  /* ---------- i18n ---------- */
  function splitWords(anim) {
    const h = $('#hero-title'); if (!h) return;
    let i = 0;
    $$('.h1-line', h).forEach(line => {
      const words = line.textContent.trim().split(/\s+/);
      line.innerHTML = words.map(w => '<span class="w" style="--i:' + (i++) + '">' + esc(w) + '</span>').join(' ');
    });
    h.classList.toggle('no-anim', !anim);
  }
  let langApplied = false;
  function applyLang() {
    R.lang = lang;
    if (lang === 'es' && !langApplied) { onLang.forEach(f => f()); return; }
    langApplied = true;
    $$('[data-en]').forEach(el => {
      if (el.dataset.es === undefined) el.dataset.es = el.textContent;
      el.textContent = lang === 'en' ? el.dataset.en : el.dataset.es;
    });
    $$('[data-en-aria]').forEach(el => {
      if (el.dataset.esAria === undefined) el.dataset.esAria = el.getAttribute('aria-label') || '';
      el.setAttribute('aria-label', lang === 'en' ? el.dataset.enAria : el.dataset.esAria);
    });
    $$('[data-en-alt]').forEach(el => {
      if (el.dataset.esAlt === undefined) el.dataset.esAlt = el.alt;
      el.alt = lang === 'en' ? el.dataset.enAlt : el.dataset.esAlt;
    });
    $$('.lang-btn').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
    splitWords(false);
    D.title = T('Hammam Almanzor · Hammam marroquí en La Cala de Mijas', 'Hammam Almanzor · Moroccan hammam in La Cala de Mijas');
    onLang.forEach(f => f());
  }
  $$('.lang-btn').forEach(b => b.addEventListener('click', () => {
    lang = b.dataset.lang;
    try { localStorage.setItem('ha-lang', lang); } catch (e) {}
    applyLang();
  }));

  /* ---------- visibility flags ---------- */
  const vis = { hero: true, intro: false, ritual: false, tea: false, space: false };
  const visIO = new IntersectionObserver(es => es.forEach(e => {
    const k = e.target.dataset.vis; vis[k] = e.isIntersecting;
    const p = e.target.closest('[data-pause]') || e.target;
    p.classList.toggle('is-paused', !e.isIntersecting); p.classList.toggle('is-live', e.isIntersecting);
    if (k === 'hero' && e.isIntersecting) Fog.wake();
    if (e.isIntersecting) onScroll();
  }), { rootMargin: '80px 0px' });
  const heroV = $('#heroVisual'), introS = $('.intro'), ritualT = $('#ritualTrack'), teaT = $('#teaTrack'), spaceT = $('#spaceTrack');
  heroV.dataset.vis = 'hero'; introS.dataset.vis = 'intro'; ritualT.dataset.vis = 'ritual'; teaT.dataset.vis = 'tea'; spaceT.dataset.vis = 'space';
  [heroV, introS, ritualT, teaT, spaceT].forEach(el => visIO.observe(el));

  /* ---------- fog you can wipe: feathered trail, re-condenses as droplets ---------- */
  const Fog = (() => {
    const cv = $('#fog'), hint = $('#fogHint');
    if (!cv || RM) return { wake() {}, resize() {} };
    const ctx = cv.getContext('2d');
    const mask = D.createElement('canvas'), mctx = mask.getContext('2d');
    let tpl, brush, bead, w = 0, h = 0, S = 0.5, running = false, lastWipe = -1e9, prev = null, intro = null, used = false, decayFrames = 0;
    let seed = 11; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    const trail = [], drops = [];
    const DECAY = 420;
    function makeTpl() {
      const c = D.createElement('canvas'); c.width = w; c.height = h;
      const x = c.getContext('2d');
      const g = x.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, 'rgba(232,214,188,.76)'); g.addColorStop(.55, 'rgba(220,198,168,.68)'); g.addColorStop(1, 'rgba(204,180,148,.8)');
      x.fillStyle = g; x.fillRect(0, 0, w, h);
      for (let i = 0; i < 26; i++) {
        const bx = rnd() * w, by = rnd() * h, br = (.1 + rnd() * .3) * Math.max(w, h);
        const rg = x.createRadialGradient(bx, by, 0, bx, by, br);
        rg.addColorStop(0, 'rgba(250,242,228,.2)'); rg.addColorStop(1, 'rgba(250,242,228,0)');
        x.fillStyle = rg; x.fillRect(0, 0, w, h);
      }
      return c;
    }
    /* an irregular, feathered brush: overlapping faint blobs, never a hard disc */
    function makeBrush() {
      const n = 96, c = D.createElement('canvas'); c.width = c.height = n;
      const x = c.getContext('2d');
      for (let i = 0; i < 9; i++) {
        const a = rnd() * 6.28, d = rnd() * n * .14, bx = n / 2 + Math.cos(a) * d, by = n / 2 + Math.sin(a) * d, br = n * (.22 + rnd() * .2);
        const rg = x.createRadialGradient(bx, by, 0, bx, by, br);
        rg.addColorStop(0, 'rgba(0,0,0,.2)'); rg.addColorStop(.45, 'rgba(0,0,0,.12)'); rg.addColorStop(1, 'rgba(0,0,0,0)');
        x.fillStyle = rg; x.fillRect(0, 0, n, n);
      }
      return c;
    }
    /* a condensation bead: bright cap, darker lower rim */
    function makeBead() {
      const n = 24, c = D.createElement('canvas'); c.width = c.height = n;
      const x = c.getContext('2d');
      let g = x.createRadialGradient(n * .5, n * .56, n * .1, n * .5, n * .5, n * .5);
      g.addColorStop(0, 'rgba(120,90,60,.0)'); g.addColorStop(.7, 'rgba(110,82,55,.35)'); g.addColorStop(1, 'rgba(110,82,55,0)');
      x.fillStyle = g; x.fillRect(0, 0, n, n);
      g = x.createRadialGradient(n * .42, n * .38, 0, n * .42, n * .38, n * .3);
      g.addColorStop(0, 'rgba(255,250,240,.95)'); g.addColorStop(1, 'rgba(255,250,240,0)');
      x.fillStyle = g; x.fillRect(0, 0, n, n);
      return c;
    }
    function resize() {
      const r = cv.getBoundingClientRect();
      const nw = Math.max(2, Math.round(r.width * S)), nh = Math.max(2, Math.round(r.height * S));
      if (nw === w && nh === h) return;
      w = cv.width = mask.width = nw; h = cv.height = mask.height = nh;
      tpl = makeTpl(); brush = brush || makeBrush(); bead = bead || makeBead(); draw(performance.now());
    }
    function draw(t) {
      if (!w) return;
      ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
      ctx.clearRect(0, 0, w, h); ctx.drawImage(tpl, 0, 0);
      ctx.globalCompositeOperation = 'destination-out'; ctx.drawImage(mask, 0, 0);
      ctx.globalCompositeOperation = 'source-over';
      if (drops.length) {
        for (let i = drops.length - 1; i >= 0; i--) {
          const d = drops[i], age = (t - d.t0) / 1000;
          if (age < 0) continue;
          const a = Math.min(1, age / 1.4) * Math.max(0, 1 - Math.max(0, age - d.life) / 1.6);
          if (a <= 0 && age > d.life) { drops.splice(i, 1); continue; }
          if (d.slide && age > 2) d.y += d.v * Math.min(1, (age - 2) / 3);
          ctx.globalAlpha = a * .85; ctx.drawImage(bead, d.x - d.r, d.y - d.r, d.r * 2, d.r * 2);
        }
        ctx.globalAlpha = 1;
      }
    }
    function dab(x, y, r) {
      mctx.globalCompositeOperation = 'source-over';
      const s = r * (2.1 + rnd() * .5);
      mctx.save(); mctx.translate(x, y); mctx.rotate(rnd() * 6.28);
      mctx.drawImage(brush, -s / 2, -s / 2, s, s); mctx.restore();
      if (trail.length < 160) trail.push([x, y, r]); else trail[(rnd() * 160) | 0] = [x, y, r];
    }
    function line(a, b, r) {
      const dx = b.x - a.x, dy = b.y - a.y, n = Math.max(1, Math.ceil(Math.hypot(dx, dy) / (r * .28)));
      for (let i = 1; i <= n; i++) {
        const j = r * .18;
        dab(a.x + dx * i / n + (rnd() - .5) * j, a.y + dy * i / n + (rnd() - .5) * j, r * (.85 + rnd() * .3));
      }
    }
    function condense(t) {
      /* beads gather where the glass was wiped */
      const n = Math.min(70, trail.length);
      for (let i = 0; i < n; i++) {
        const [x, y, r] = trail[(rnd() * trail.length) | 0];
        const big = rnd() < .18;
        drops.push({ x: x + (rnd() - .5) * r * 1.6, y: y + (rnd() - .5) * r * 1.6, r: (big ? 2.4 : .9) + rnd() * (big ? 1.6 : 1.2), t0: t + rnd() * 2600, life: 4 + rnd() * 3, slide: big, v: .15 + rnd() * .25 });
      }
      trail.length = 0;
    }
    function stroke(x, y) {
      if (!w) resize();
      const r = Math.max(w, h) * .075;
      if (prev) line(prev, { x, y }, r); else dab(x, y, r);
      prev = { x, y }; lastWipe = performance.now(); decayFrames = 0; kick();
    }
    function loop(t) {
      if (!vis.hero) { running = false; return; }
      let dirty = false;
      if (intro) {
        const k = clamp((t - intro.t0) / 2200, 0, 1), e = k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
        /* a slow, wandering loop like a hand wiping a steamed mirror */
        const a = e * Math.PI * 3.2;
        const x = w * (.5 + .27 * Math.sin(a) * (0.55 + .45 * e)), y = h * (.44 + .12 * Math.sin(a * .5 + 1.2) * (1 - e * .3) + (e - .5) * .1);
        const r = Math.max(w, h) * .08;
        if (intro.p) line(intro.p, { x, y }, r);
        intro.p = { x, y }; dirty = true; lastWipe = t; decayFrames = 0;
        if (k >= 1) intro = null;
      }
      if (t - lastWipe > 2400 && decayFrames < DECAY) {
        if (decayFrames === 0) condense(t);
        mctx.globalCompositeOperation = 'destination-out'; mctx.globalAlpha = .011;
        mctx.fillRect(0, 0, w, h); mctx.globalAlpha = 1; decayFrames++; dirty = true;
        if (decayFrames === DECAY) mctx.clearRect(0, 0, w, h);
      }
      if (dirty || drops.length || t - lastWipe < 50) draw(t);
      if (!intro && !drops.length && decayFrames >= DECAY && t - lastWipe > 2400) { running = false; return; }
      requestAnimationFrame(loop);
    }
    function kick() { if (!running) { running = true; requestAnimationFrame(loop); } }
    function pos(e) { const r = cv.getBoundingClientRect(); return { x: (e.clientX - r.left) * S, y: (e.clientY - r.top) * S }; }
    cv.addEventListener('pointerdown', e => { prev = null; const p = pos(e); stroke(p.x, p.y); });
    cv.addEventListener('pointermove', e => {
      if (e.pointerType === 'mouse' || e.buttons || e.pressure > 0) {
        const p = pos(e); stroke(p.x, p.y);
        if (!used) { used = true; hint.classList.add('is-gone'); }
      }
    }, { passive: true });
    cv.addEventListener('pointerleave', () => { prev = null; });
    cv.addEventListener('pointerup', () => { prev = null; });
    requestAnimationFrame(() => requestAnimationFrame(resize));
    setTimeout(() => { if (!w) resize(); intro = { t0: performance.now(), p: null }; kick(); }, 900);
    return { wake: kick, resize };
  })();

  /* ---------- ambient steam sound (generated, no file) ---------- */
  (() => {
    const btn = $('#soundBtn'); let ac, master, on = false;
    function build() {
      ac = new (window.AudioContext || window.webkitAudioContext)();
      const len = ac.sampleRate * 4, buf = ac.createBuffer(1, len, ac.sampleRate), d = buf.getChannelData(0);
      let last = 0;
      for (let i = 0; i < len; i++) { const wn = Math.random() * 2 - 1; last = (last + .02 * wn) / 1.02; d[i] = last * 3.2; }
      const src = ac.createBufferSource(); src.buffer = buf; src.loop = true;
      const lp = ac.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 820;
      const hp = ac.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 90;
      const swell = ac.createGain(); swell.gain.value = .55;
      const lfo = ac.createOscillator(); lfo.frequency.value = .07;
      const lg = ac.createGain(); lg.gain.value = .25; lfo.connect(lg).connect(swell.gain); lfo.start();
      master = ac.createGain(); master.gain.value = 0;
      src.connect(hp).connect(lp).connect(swell).connect(master).connect(ac.destination); src.start();
    }
    btn.addEventListener('click', () => {
      try {
        if (!ac) build();
        on = !on; btn.setAttribute('aria-pressed', String(on));
        if (on) ac.resume();
        master.gain.setTargetAtTime(on ? .22 : 0, ac.currentTime, .5);
        if (!on) setTimeout(() => { if (!on) ac.suspend(); }, 2200);
      } catch (e) { btn.hidden = true; }
    });
    D.addEventListener('visibilitychange', () => { if (ac && on) (D.hidden ? ac.suspend() : ac.resume()); });
  })();

  /* ---------- ritual journey ---------- */
  const steps = $$('.r-step'), rImgs = $$('.r-img'), dots = $$('.r-dot');
  const heatAt = [.18, .72, .86, .92, .62, .3];
  let rIdx = 0;
  if (!RM) R.classList.add('js-ritual');
  function setStep(i) {
    if (i === rIdx) return; rIdx = i;
    steps.forEach((s, k) => { s.classList.toggle('is-on', k === i); s.inert = k !== i; });
    rImgs.forEach((im, k) => im.classList.toggle('is-on', k === i));
    dots.forEach((d, k) => { d.classList.toggle('is-on', k === i); d.setAttribute('aria-current', k === i ? 'step' : 'false'); });
  }
  if (!RM) steps.forEach((s, k) => { s.inert = k !== 0; });
  dots.forEach((d, i) => d.addEventListener('click', () => {
    const r = ritualT.getBoundingClientRect(), total = ritualT.offsetHeight - innerHeight;
    scrollTo({ top: scrollY + r.top + total * (i + .5) / steps.length, behavior: 'smooth' });
  }));
  new IntersectionObserver((es, o) => { if (es[0].isIntersecting) { rImgs.forEach(im => { im.loading = 'eager'; if (im.decode) im.decode().catch(() => {}); }); o.disconnect(); } }, { rootMargin: '900px 0px' }).observe(ritualT);
  const rosette = $('#ritualRosette'), glow = $('#ritualGlow'), heat = $('#heatFill'), introRos = $('.rosette');

  /* ---------- tea poured from height (composited layers, transform/opacity only) ---------- */
  const tPot = $('#tPot'), tStr = $('#tStream'), tLiq = $('#tLiquid'), tLiqIn = $('#tLiquid .t-liq'), tSurf = $('#tSurface'), tFoam = $('#tFoam'), tSpl = $('#tSplash'), tSteam = $('#tSteam'), tHerb = $('#tHerb');
  const sm = x => { x = clamp(x, 0, 1); return x * x * (3 - 2 * x); };
  let teaLast = -1, splOn = null;
  function teaSet(p) {
    if (Math.abs(p - teaLast) < .0005) return; teaLast = p;
    const ang = p < .5 ? 58 * sm(p / .14) : 58 * (1 - sm((p - .84) / .11));
    const potY = 150 - 78 * Math.sin(Math.PI * clamp((p - .14) / .7, 0, 1));
    const fill = sm((p - .19) / .63), surf = 616 - fill * 126;
    tPot.style.transform = 'translateY(' + ((potY - 150) / 1.7).toFixed(3) + '%) rotate(' + ang.toFixed(2) + 'deg)';
    const frac = Math.max(.027, (620 - surf) / 150);
    tLiq.style.transform = 'scaleY(' + frac.toFixed(4) + ')'; tLiqIn.style.transform = 'scaleY(' + (1 / frac).toFixed(4) + ')';
    const wS = (98 - 2 * (surf - 474) * .081) / 98;
    tSurf.style.transform = 'translateY(' + (surf / 6.4).toFixed(3) + '%) scaleX(' + wS.toFixed(4) + ')';
    tSurf.style.opacity = fill > .005 ? '1' : '0';
    const span = surf - potY;
    const head = p < .16 ? potY : potY + span * clamp((p - .16) / .045, 0, 1);
    const tail = p < .835 ? potY : potY + span * clamp((p - .835) / .04, 0, 1);
    const len = Math.max(0, head - tail);
    tStr.style.transform = 'translateY(' + (tail / 6.4).toFixed(3) + '%) scaleY(' + (len / 640).toFixed(4) + ')';
    const pouring = len > 1 && head >= surf - .5;
    tSpl.style.transform = 'translateY(' + (surf / 6.4).toFixed(3) + '%)';
    if (pouring !== splOn) { splOn = pouring; tSpl.style.opacity = pouring ? '1' : '0'; }
    tFoam.style.opacity = clamp(fill * 1.4 - .1, 0, 1).toFixed(2);
    tSteam.style.opacity = (clamp((fill - .5) * 2, 0, 1) * .9).toFixed(2);
    tHerb.classList.toggle('is-in', p > .9);
  }
  if (RM) teaSet(1); else { R.classList.add('js-tea'); teaSet(0); }

  /* ---------- el espacio: walking through arches ---------- */
  const sViews = $$('.space-view'), sCaps = $$('.space-cap'), sFill = $('#spaceFill');
  let sCap = 0, sLast = -1;
  if (!RM) R.classList.add('js-space');
  function spaceSet(p) {
    if (Math.abs(p - sLast) < .0004) return; sLast = p;
    const n = sViews.length - 1, pos = p * n, i = Math.min(n - 1, Math.floor(pos)), t = sm(clamp((pos - i - .18) / .64, 0, 1));
    sViews.forEach((v, k) => {
      if (k === i) { v.style.zIndex = 2; v.style.opacity = (1 - sm((t - .3) / .7)).toFixed(3); v.style.transform = 'scale(' + (1 + 1.3 * t).toFixed(4) + ')'; }
      else if (k === i + 1) { v.style.zIndex = 1; v.style.opacity = sm(t / .55).toFixed(3); v.style.transform = 'scale(' + (.68 + .32 * t).toFixed(4) + ')'; }
      else { v.style.opacity = '0'; v.style.transform = 'scale(1)'; v.style.zIndex = 0; }
    });
    if (p >= 1) { sViews[n].style.opacity = '1'; sViews[n].style.transform = 'scale(1)'; }
    const c = Math.min(n, i + (t > .5 ? 1 : 0));
    if (c !== sCap) { sCap = c; sCaps.forEach((el, k) => { el.classList.toggle('is-on', k === c); el.inert = k !== c; }); }
    sFill.style.transform = 'scaleX(' + p.toFixed(4) + ')';
  }
  if (!RM) { sCaps.forEach((el, k) => { el.inert = k !== 0; }); spaceSet(0); }

  /* ---------- one scroll handler ---------- */
  const progress = $('#progress');
  const header = $('.site-header'), heroMedia = $('#heroMedia'), fogC = $('#fog');
  let ticking = false;
  function update() {
    ticking = false;
    const y = scrollY, vh = innerHeight;
    header.classList.toggle('is-solid', y > 12);
    progress.style.transform = 'scaleX(' + clamp(y / (D.body.scrollHeight - vh || 1), 0, 1).toFixed(4) + ')';
    if (RM) return;
    if (vis.hero) {
      const p = clamp(y / (vh * .8), 0, 1);
      heroMedia.style.transform = 'translate3d(0,' + (p * 40).toFixed(1) + 'px,0) scale(' + (1.06 - p * .04).toFixed(4) + ')';
      if (fogC) fogC.style.opacity = (1 - p * 1.25).toFixed(3);
    }
    if (vis.intro && introRos) {
      const r = introS.getBoundingClientRect();
      introRos.style.transform = 'rotate(' + ((vh - r.top) * .12).toFixed(1) + 'deg)';
    }
    if (vis.space) {
      const r = spaceT.getBoundingClientRect(), total = spaceT.offsetHeight - vh;
      spaceSet(clamp(-r.top / total, 0, 1));
    }
    if (vis.tea) {
      const r = teaT.getBoundingClientRect(), total = teaT.offsetHeight - vh;
      teaSet(clamp(-r.top / total, 0, 1));
    }
    if (vis.ritual) {
      const r = ritualT.getBoundingClientRect(), total = ritualT.offsetHeight - vh;
      const p = clamp(-r.top / total, 0, 1), f = p * steps.length;
      setStep(Math.min(steps.length - 1, Math.floor(f)));
      const a = Math.min(steps.length - 1, Math.floor(f)), b = Math.min(steps.length - 1, a + 1), t = f - a;
      const hv = heatAt[a] + (heatAt[b] - heatAt[a]) * clamp((t - .6) / .4, 0, 1);
      rosette.style.transform = 'translate(-50%,-50%) rotate(' + (p * 135).toFixed(2) + 'deg)';
      glow.style.opacity = (.15 + hv * .75).toFixed(3);
      heat.style.transform = 'scaleY(' + hv.toFixed(3) + ')';
    }
  }
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', () => { Fog.resize(); onScroll(); });

  /* ---------- reveal ---------- */
  if (!RM && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
    $$('.reveal').forEach(el => { const sib = $$('.reveal', el.parentElement).filter(x => x.parentElement === el.parentElement); el.style.setProperty('--rd', (sib.indexOf(el) * 90) + 'ms'); io.observe(el); });
  } else $$('.reveal').forEach(el => el.classList.add('is-in'));

  /* ---------- builder ---------- */
  const B = { base: 'h', aroma: 'b1', people: 1, add: {}, date: '', slot: 'manana', name: '' };
  const bBases = $('#bBases'), bAromas = $('#bAromas'), bAromaChips = $('#bAromaChips'), bAddons = $('#bAddons');
  const tLines = $('#ticketLines'), tTotal = $('#ticketTotal'), tDur = $('#ticketDur'), bSend = $('#bSend');
  const bDate = $('#bDate'), bSlot = $('#bSlot'), bName = $('#bName');
  const today = new Date(); bDate.min = today.toISOString().slice(0, 10);
  const SLOT = { manana: ['mañana', 'morning'], mediodia: ['mediodía', 'midday'], tarde: ['tarde', 'afternoon'] };
  const iconCheck = '<svg aria-hidden="true"><use href="#i-check"/></svg>';
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  splitWords(!RM);
  function renderBuilder() {
    bBases.innerHTML = [
      ['h', T('Hammam marroquí', 'Moroccan hammam'), T('Vapor, jabón beldi, kessa, masaje suave y té. 1 hora.', 'Steam, Beldi soap, kessa, soft massage and tea. 1 hour.'), T('80 € · pareja 155 €', '€80 · couple €155')],
      ['b', T('Hammam con tratamiento corporal', 'Hammam with body treatment'), T('Exfoliación, mascarilla reafirmante y crema corporal.', 'Exfoliation, firming mask and body cream.'), eur(90)]
    ].map(([v, t, d, p]) => '<label class="opt"><input type="radio" name="base" value="' + v + '"' + (B.base === v ? ' checked' : '') + '><span class="tick">' + iconCheck + '</span><span class="opt-body"><span class="opt-title"><span>' + t + '</span><span class="opt-price">' + p + '</span></span><span class="opt-desc">' + d + '</span></span></label>').join('');
    bAromaChips.innerHTML = ['b1', 'b2', 'b3', 'b4'].map(id => '<label class="chip"><input type="radio" name="aroma" value="' + id + '"' + (B.aroma === id ? ' checked' : '') + '><span>' + L(ITEMS[id]) + '</span></label>').join('');
    bAddons.innerHTML = DATA.addons.map(id => {
      const it = ITEMS[id], q = B.add[id] || 0, nm = it.short ? L(it.short) : L(it);
      const kind = it.cat === 'masaje' ? T('Masaje', 'Massage') : it.cat === 'facial' ? T('Facial', 'Facial') : T('Manos y pies', 'Hands & feet');
      const meta = kind + (it.min ? ' · ' + it.min + ' min' : '') + ' · ' + eur(it.p);
      return '<div class="addon' + (q ? ' has' : '') + '" data-id="' + id + '"><span class="addon-txt"><span class="addon-name">' + nm + '</span><span class="addon-meta">' + meta + '</span></span><span class="stepper"><button type="button" data-d="-1" aria-label="' + T('Quitar ', 'Remove ') + esc(nm) + '"' + (q ? '' : ' disabled') + '><svg aria-hidden="true"><use href="#i-minus"/></svg></button><output aria-live="polite">' + q + '</output><button type="button" data-d="1" aria-label="' + T('Añadir ', 'Add ') + esc(nm) + '"' + (q >= 2 ? ' disabled' : '') + '><svg aria-hidden="true"><use href="#i-plus"/></svg></button></span></div>';
    }).join('');
    bAromas.hidden = B.base !== 'b';
    calc(false);
  }
  function lines() {
    const out = [];
    if (B.base === 'h') out.push([T('Hammam marroquí', 'Moroccan hammam') + (B.people === 2 ? T(' · pareja', ' · couple') : ''), B.people === 2 ? 155 : 80]);
    else out.push([T('Hammam + tratamiento corporal', 'Hammam + body treatment') + ' (' + L(ITEMS[B.aroma]) + ')' + (B.people === 2 ? ' × 2' : ''), 90 * B.people]);
    Object.keys(B.add).forEach(id => { const q = B.add[id]; if (!q) return; const it = ITEMS[id]; out.push([(it.short ? L(it.short) : L(it)) + (it.min ? ' ' + it.min + ' min' : '') + (q > 1 ? ' × ' + q : ''), it.p * q]); });
    return out;
  }
  let lastTotal = 0;
  const ticketEl = $('.ticket-inner');
  function unseal() { ticketEl.classList.toggle('is-sealed', false); }
  $('#bConfirm').addEventListener('click', () => {
    ticketEl.classList.toggle('is-sealed', false); void ticketEl.offsetWidth; ticketEl.classList.toggle('is-sealed', true);
    if (innerWidth < 900) $('#ticket').scrollIntoView({ behavior: RM ? 'auto' : 'smooth', block: 'center' });
    setTimeout(() => bSend.focus({ preventScroll: true }), RM ? 0 : 1300);
  });
  function calc(animate = true) {
    if (animate) unseal();
    const ls = lines(), total = ls.reduce((s, l) => s + l[1], 0);
    tLines.innerHTML = ls.map(l => '<li><span>' + esc(l[0]) + '</span><span>' + eur(l[1]) + '</span></li>').join('');
    tTotal.textContent = eur(total);
    if (animate && total !== lastTotal && !RM) { tTotal.classList.remove('bump'); void tTotal.offsetWidth; tTotal.classList.add('bump'); }
    lastTotal = total;
    let mins = 60, unknown = false;
    Object.keys(B.add).forEach(id => { const q = B.add[id]; if (!q) return; if (ITEMS[id].min) mins += ITEMS[id].min * q; else unknown = true; });
    const hh = Math.floor(mins / 60), mm = mins % 60;
    tDur.textContent = T('Duración aproximada: ', 'Approx. duration: ') + hh + ' h' + (mm ? ' ' + mm + ' min' : '') + (unknown ? T(' + extras (duración por confirmar)', ' + extras (duration to be confirmed)') : '');
    bSend.href = waLink(message(ls, total));
    syncBar();
  }
  function fmtDate(v) {
    if (!v) return '';
    const d = new Date(v + 'T12:00:00');
    return d.toLocaleDateString(lang === 'en' ? 'en-GB' : 'es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
  }
  function message(ls, total) {
    const m = [T('Hola Hammam Almanzor, me gustaría reservar:', 'Hello Hammam Almanzor, I would like to book:')];
    ls.forEach(l => m.push('• ' + l[0] + ' – ' + eur(l[1])));
    m.push(T('Total orientativo: ', 'Estimated total: ') + eur(total));
    if (B.date) m.push(T('Día preferido: ', 'Preferred day: ') + fmtDate(B.date) + ' (' + SLOT[B.slot][lang === 'en' ? 1 : 0] + ')');
    else m.push(T('Franja preferida: ', 'Preferred time: ') + SLOT[B.slot][lang === 'en' ? 1 : 0]);
    if (B.name) m.push(T('Nombre: ', 'Name: ') + B.name);
    m.push(T('¿Tenéis disponibilidad? Gracias.', 'Do you have availability? Thank you.'));
    return m.join('\n');
  }
  bBases.addEventListener('change', e => { if (e.target.name === 'base') { B.base = e.target.value; bAromas.hidden = B.base !== 'b'; calc(); } });
  bAromaChips.addEventListener('change', e => { B.aroma = e.target.value; calc(); });
  $('#bPeople').addEventListener('change', e => { B.people = +e.target.value; calc(); });
  bAddons.addEventListener('click', e => {
    const btn = e.target.closest('button[data-d]'); if (!btn) return;
    const row = btn.closest('.addon'), id = row.dataset.id;
    const q = clamp((B.add[id] || 0) + +btn.dataset.d, 0, 2); B.add[id] = q;
    row.classList.toggle('has', q > 0); const out = $('output', row); out.textContent = q; if (!RM) { out.classList.toggle('pop', false); void out.offsetWidth; out.classList.toggle('pop', true); }
    const [minus, plus] = $$('button', row); minus.disabled = q === 0; plus.disabled = q >= 2;
    if (D.activeElement && D.activeElement.disabled) (q === 0 ? plus : minus).focus();
    calc();
  });
  bDate.addEventListener('change', () => { B.date = bDate.value; calc(false); });
  bSlot.addEventListener('change', () => { B.slot = bSlot.value; calc(false); });
  bName.addEventListener('input', () => { B.name = bName.value.trim(); calc(false); });
  onLang.push(renderBuilder);

  /* ---------- voucher ---------- */
  const vCard = $('#vCard'), vFlip = $('#vFlip'), vWhat = $('#vWhat'), vAmountWrap = $('#vAmountWrap'), vAmount = $('#vAmount');
  const vToIn = $('#vToIn'), vFromIn = $('#vFromIn'), vMsgIn = $('#vMsgIn');
  let builderGift = null;
  const OCC = { birthday: ['Feliz cumpleaños', 'Happy birthday'], xmas: ['Feliz Navidad', 'Merry Christmas'], any: ['Tarjeta regalo', 'Gift card'] };
  const MSG = { birthday: ['Una hora de vapor para tu cumpleaños.', 'An hour of steam for your birthday.'], xmas: ['Para una Navidad sin prisa.', 'For an unhurried Christmas.'], any: ['Que el vapor se lleve la semana.', 'Let the steam take the week away.'] };
  function gifts() {
    const g = [
      ['h1', T('Hammam marroquí · 1 persona', 'Moroccan hammam · 1 person'), 80],
      ['h2', T('Hammam en pareja', 'Hammam for two'), 155],
      ['b', T('Hammam con tratamiento corporal', 'Hammam with body treatment'), 90],
      ['m1', T('Masaje relajante · 60 min', 'Relaxing massage · 60 min'), 65],
      ['f1', T('Limpieza de cutis', 'Skin cleansing facial'), 65],
      ['amt', T('Importe libre', 'Amount of your choice'), null]
    ];
    if (builderGift) g.unshift(['bld', T('Mi visita diseñada', 'My planned visit'), builderGift.total]);
    return g;
  }
  function renderGifts(keep) {
    const cur = keep || vWhat.value || 'h1';
    vWhat.innerHTML = gifts().map(([v, t, p]) => '<option value="' + v + '">' + esc(t) + (p ? ' · ' + eur(p) : '') + '</option>').join('');
    vWhat.value = cur; if (!vWhat.value) vWhat.value = 'h1';
  }
  const occ = () => ($('input[name=occ]:checked') || {}).value || 'birthday';
  function giftText() {
    const v = vWhat.value, g = gifts().find(x => x[0] === v);
    if (v === 'amt') return T('Tarjeta de ', 'Gift card of ') + eur(Math.max(10, +vAmount.value || 0));
    if (v === 'bld') return T('Hammam y algo más', 'Hammam and a little more');
    return g ? g[1].replace(' · 1 persona', '').replace(' · 1 person', '') : '';
  }
  function updateVoucher() {
    const o = occ(), i = lang === 'en' ? 1 : 0;
    vAmountWrap.hidden = vWhat.value !== 'amt';
    $('#vOccasion').textContent = OCC[o][i];
    $('#vGift').textContent = giftText();
    $('#vTo').textContent = vToIn.value.trim() || '…';
    $('#vFrom').textContent = vFromIn.value.trim() || '…';
    $('#vMsg').textContent = vMsgIn.value.trim() || MSG[o][i];
    const g = gifts().find(x => x[0] === vWhat.value);
    const lines = [T('Hola Hammam Almanzor, me gustaría pedir una tarjeta regalo:', 'Hello Hammam Almanzor, I would like to order a gift voucher:'),
      T('Regalo: ', 'Gift: ') + (vWhat.value === 'amt' ? eur(Math.max(10, +vAmount.value || 0)) : (g ? g[1] + (g[2] ? ' (' + eur(g[2]) + ')' : '') : ''))];
    if (vWhat.value === 'bld' && builderGift) builderGift.lines.forEach(l => lines.push('  • ' + l[0] + ' – ' + eur(l[1])));
    lines.push(T('Ocasión: ', 'Occasion: ') + ({ birthday: ['Cumpleaños', 'Birthday'], xmas: ['Navidad', 'Christmas'], any: ['Sin ocasión especial', 'No special occasion'] })[o][i]);
    if (vToIn.value.trim()) lines.push(T('Para: ', 'For: ') + vToIn.value.trim());
    if (vFromIn.value.trim()) lines.push(T('De: ', 'From: ') + vFromIn.value.trim());
    lines.push(T('Mensaje: ', 'Message: ') + (vMsgIn.value.trim() || MSG[o][i]));
    lines.push(T('¿Cómo se paga y cómo se entrega? Gracias.', 'How do I pay and how is it delivered? Thank you.'));
    const txt = lines.join('\n');
    $('#vSendWa').href = waLink(txt);
    $('#vSendMail').href = 'mailto:' + DATA.email + '?subject=' + encodeURIComponent(T('Tarjeta regalo', 'Gift voucher')) + '&body=' + encodeURIComponent(txt);
  }
  function flip(to) {
    const f = to === undefined ? !vCard.classList.contains('is-flipped') : to;
    vCard.classList.toggle('is-flipped', f); vFlip.setAttribute('aria-pressed', String(f));
  }
  vFlip.addEventListener('click', () => flip());
  vCard.addEventListener('click', () => flip());
  $('#vForm').addEventListener('input', e => {
    if (e.target === vMsgIn || e.target === vFromIn) flip(true);
    else if (e.target === vToIn || e.target === vWhat || e.target.name === 'occ') flip(false);
    updateVoucher();
  });
  $('#vForm').addEventListener('change', updateVoucher);
  $('#bGift').addEventListener('click', () => {
    const ls = lines(); builderGift = { lines: ls, total: ls.reduce((s, l) => s + l[1], 0) };
    renderGifts('bld'); flip(false); updateVoucher();
    $('#regalo').scrollIntoView({ behavior: RM ? 'auto' : 'smooth' });
    setTimeout(() => { vCard.classList.add('shine'); setTimeout(() => vCard.classList.remove('shine'), 1600); vToIn.focus({ preventScroll: true }); }, RM ? 0 : 900);
  });
  onLang.push(() => { renderGifts(); updateVoucher(); });

  /* ---------- price list ---------- */
  const tTabs = $('#tTabs'), tPanel = $('#tPanel');
  let tCur = 0;
  function priceHTML(it) {
    if (it.ask) return '<span class="t-price">' + T('Consultar', 'Ask') + '</span>';
    return '<span class="t-price">' + (it.from ? '<small>' + T('desde', 'from') + '</small>' : '') + eur(it.p) + '</span>';
  }
  function renderTabs() {
    tTabs.innerHTML = DATA.cats.map((c, i) => '<button type="button" role="tab" class="tab" id="tab-' + c.id + '" aria-controls="tPanel" aria-selected="' + (i === tCur) + '" tabindex="' + (i === tCur ? 0 : -1) + '">' + L(c) + '</button>').join('');
    renderPanel(false);
  }
  function renderPanel(anim = true) {
    const c = DATA.cats[tCur];
    tPanel.setAttribute('aria-labelledby', 'tab-' + c.id);
    tPanel.innerHTML = (c.note ? '<p class="t-note">' + L(c.note) + '</p>' : '') + '<div class="t-cols">' + c.groups.map(g => '<div class="t-group"><h3>' + L(g) + '</h3><ul class="t-list">' + g.items.map(it => '<li><span class="t-name">' + L(it) + (it.min && c.id !== 'masaje' ? ' · ' + it.min + ' min' : '') + '</span><span class="t-dots" aria-hidden="true"></span>' + priceHTML(it) + '</li>').join('') + '</ul></div>').join('') + '</div>';
    if (anim && !RM) { tPanel.classList.remove('swap'); void tPanel.offsetWidth; tPanel.classList.add('swap'); }
  }
  function selectTab(i, focus) {
    tCur = (i + DATA.cats.length) % DATA.cats.length;
    $$('.tab', tTabs).forEach((b, k) => { b.setAttribute('aria-selected', String(k === tCur)); b.tabIndex = k === tCur ? 0 : -1; });
    const b = $$('.tab', tTabs)[tCur];
    if (focus) b.focus();
    b.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: RM ? 'auto' : 'smooth' });
    renderPanel();
  }
  tTabs.addEventListener('click', e => { const b = e.target.closest('.tab'); if (b) selectTab($$('.tab', tTabs).indexOf(b)); });
  tTabs.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') { e.preventDefault(); selectTab(tCur + 1, true); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); selectTab(tCur - 1, true); }
    else if (e.key === 'Home') { e.preventDefault(); selectTab(0, true); }
    else if (e.key === 'End') { e.preventDefault(); selectTab(DATA.cats.length - 1, true); }
  });
  onLang.push(renderTabs);

  /* ---------- mobile bar (turns into "send" inside the builder) ---------- */
  const mbar = $('.mbar'), mbarWa = $('#mbarWa'), mMain = $('.mbar-main'), mMainTxt = $('span', mMain);
  let inBuilder = false;
  function syncBar() {
    if (!mMain) return;
    if (inBuilder) { mMainTxt.textContent = T('Enviar · ', 'Send · ') + tTotal.textContent; mMain.href = bSend.href; mMain.target = '_blank'; mMain.rel = 'noopener'; }
    else { mMainTxt.textContent = T('Reservar', 'Book'); mMain.href = '#disena'; mMain.removeAttribute('target'); }
  }
  new IntersectionObserver(es => { inBuilder = es[0].isIntersecting; syncBar(); }, { rootMargin: '-35% 0px -35% 0px' }).observe($('#disena'));
  onLang.push(syncBar);
  onLang.push(() => { mbarWa.href = waLink(T('Hola Hammam Almanzor, quería información para reservar el hammam.', 'Hello Hammam Almanzor, I would like information about booking the hammam.')); });
  D.addEventListener('focusin', e => { if (e.target.matches('input,textarea,select')) mbar.classList.add('is-hidden'); });
  D.addEventListener('focusout', () => mbar.classList.remove('is-hidden'));

  /* ---------- nav: current section ---------- */
  const navLinks = $$('.nav a');
  const navIO = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    navLinks.forEach(a => a.setAttribute('aria-current', String(a.getAttribute('href') === '#' + e.target.id)));
  }), { rootMargin: '-45% 0px -50% 0px' });
  ['ritual', 'disena', 'regalo', 'tarifas', 'visita'].forEach(id => navIO.observe($('#' + id)));

  /* ---------- voucher: gentle tilt under a fine pointer ---------- */
  const vTilt = $('#vTilt');
  if (!RM && matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const pv = $('.v-preview');
    pv.addEventListener('pointermove', e => {
      const r = vTilt.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      vTilt.style.transform = 'rotateX(' + (-y * 8).toFixed(2) + 'deg) rotateY(' + (x * 10).toFixed(2) + 'deg)';
    });
    pv.addEventListener('pointerleave', () => { vTilt.style.transform = ''; });
  }

  const idle = window.requestIdleCallback || (f => setTimeout(f, 200));
  idle(() => { applyLang(); requestAnimationFrame(update); }, { timeout: 1500 });
})();
