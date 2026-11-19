/* Cerrado del Águila concept · Noir Digital. Vanilla JS, transform/opacity animation only. */
(function () {
  'use strict';
  var D = window.CDA;
  var doc = document.documentElement;
  var RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var lang = 'es';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var clamp = function (v, a, b) { return v < a ? a : v > b ? b : v; };
  var lerp = function (a, b, t) { return a + (b - a) * t; };
  var ease = function (t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
  var T = function () { return D.dyn[lang]; };
  var vh = window.innerHeight, vw = window.innerWidth;

  /* ---------------- i18n ---------------- */
  var esStore = new Map();
  function applyLang(l) {
    lang = l;
    doc.lang = l;
    $$('[data-i18n]').forEach(function (el) {
      var k = el.getAttribute('data-i18n');
      if (!esStore.has(el)) esStore.set(el, el.innerHTML);
      var v = l === 'en' ? D.en[k] : esStore.get(el);
      if (v != null) el.innerHTML = v;
    });
    $$('.lang button').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.lang === l)); });
    splitWords();
    renderCard(true);
    renderScore();
    renderStatic();
    updateTee(false);
    setSunsetToday();
    try { localStorage.setItem('cda-lang', l); } catch (e) { /* private mode */ }
  }
  $$('.lang button').forEach(function (b) { b.addEventListener('click', function () { if (b.dataset.lang !== lang) applyLang(b.dataset.lang); }); });

  /* ---------------- toast ---------------- */
  var toastEl = $('#toast'), toastT;
  function toast(msg) { toastEl.textContent = msg; toastEl.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove('show'); }, 2600); }

  /* ---------------- sunset (NOAA approximation) ---------------- */
  function sunsetUTC(y, m, d) {
    var rad = Math.PI / 180;
    var start = Date.UTC(y, 0, 1), N = Math.round((Date.UTC(y, m, d) - start) / 864e5) + 1;
    var g = 2 * Math.PI / 365 * (N - 1);
    var eq = 229.18 * (0.000075 + 0.001868 * Math.cos(g) - 0.032077 * Math.sin(g) - 0.014615 * Math.cos(2 * g) - 0.040849 * Math.sin(2 * g));
    var decl = 0.006918 - 0.399912 * Math.cos(g) + 0.070257 * Math.sin(g) - 0.006758 * Math.cos(2 * g) + 0.000907 * Math.sin(2 * g) - 0.002697 * Math.cos(3 * g) + 0.00148 * Math.sin(3 * g);
    var lat = D.lat * rad;
    var ha = Math.acos(Math.cos(90.833 * rad) / (Math.cos(lat) * Math.cos(decl)) - Math.tan(lat) * Math.tan(decl)) / rad;
    var mins = 720 - 4 * (D.lon - ha) - eq;
    return new Date(Date.UTC(y, m, d, 0, 0) + mins * 6e4);
  }
  var timeFmt = new Intl.DateTimeFormat('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Europe/Madrid' });
  function fmtTime(date) { return timeFmt.format(date); }
  var dayFmt = null;
  function setSunsetToday() {
    var now = new Date();
    var parts = (dayFmt || (dayFmt = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Madrid', year: 'numeric', month: '2-digit', day: '2-digit' }))).format(now).split('-');
    var st = fmtTime(sunsetUTC(+parts[0], +parts[1] - 1, +parts[2])); $$('.sunsetToday').forEach(function (e) { e.textContent = st; });
  }

  /* ---------------- header ---------------- */
  var hdr = $('.hdr');
  hdr.addEventListener('focusin', function () { hdr._hide = false; hdr.classList.remove('hide'); });

  /* ---------------- hero ---------------- */
  var hero = $('.hero'), heroBg = $('.hero-bg'), heroFg = $('.hero-fg'), heroTitle = $('.hero-title-wrap');
  function heroFrame(y) {
    if (y > vh * 1.2) return;
    heroBg.style.transform = 'translate3d(0,' + (y * .38).toFixed(1) + 'px,0)';
    heroTitle.style.transform = 'translate3d(0,' + (y * .62).toFixed(1) + 'px,0)';
    heroTitle.style.opacity = clamp(1 - y / (vh * .7), 0, 1).toFixed(3);
    heroFg.style.transform = 'translate3d(0,' + (-y * .06).toFixed(1) + 'px,0)';
  }

  /* ---------------- manifesto words ---------------- */
  var mf = $('.reveal-words'), words = [];
  function splitWords() {
    if (!mf) return;
    var txt = mf.textContent.trim().split(/\s+/);
    mf.innerHTML = txt.map(function (w) { return '<span class="w">' + w + '</span>'; }).join(' ');
    words = $$('.w', mf);
    if (RM) words.forEach(function (w) { w.classList.add('on'); });
    mfLast = -1;
  }
  var mfLast = -1;
  function mfFrame() {
    var r = mf.getBoundingClientRect();
    var p = clamp((vh * .9 - r.top) / (r.height + vh * .35), 0, 1);
    var n = Math.round(p * words.length * 1.15);
    if (n === mfLast) return;
    mfLast = n;
    for (var i = 0; i < words.length; i++) words[i].classList.toggle('on', i < n);
  }

  /* ---------------- flyover ---------------- */
  var H = D.holes;
  var fly = $('#recorrido'), objs = $('#flyObjs'), card = $('#flyCard');
  var maps = $$('.fly-map'), sharpLayer = $('.fl-sharp');
  var SPLITS = { 3: [0, 1], 4: [0, .6, 1], 5: [0, .42, .76, 1] };
  var NDOTS = 34;
  var AX = 56;
  function q(h, t) {
    var a = h.t, b = h.g, c = h.c;
    if (!c) return [lerp(a[0], b[0], t), lerp(a[1], b[1], t)];
    var u = 1 - t;
    return [u * u * a[0] + 2 * u * t * c[0] + t * t * b[0], u * u * a[1] + 2 * u * t * c[1] + t * t * b[1]];
  }
  function flight(h, u) {
    var s = SPLITS[h.par], n = s.length - 1;
    var k = Math.min(n - 1, Math.floor(u * n)), v = u * n - k;
    if (u >= 1) { k = n - 1; v = 1; }
    var t = lerp(s[k], s[k + 1], v);
    var p0 = q(h, s[k]), p1 = q(h, s[k + 1]);
    var len = Math.hypot(p1[0] - p0[0], p1[1] - p0[1]);
    var hmax = clamp(len * .34, 26, 120);
    var p = q(h, t);
    return [p[0], p[1], Math.sin(Math.PI * v) * hmax];
  }
  H.forEach(function (h) {
    var dx = h.g[0] - h.t[0], dy = h.g[1] - h.t[1];
    h.az = -90 - Math.atan2(dy, dx) * 180 / Math.PI;
    h.cam = q(h, .44);
  });
  // unwrap angles so consecutive holes rotate the short way
  for (var i = 1; i < H.length; i++) { while (H[i].az - H[i - 1].az > 180) H[i].az -= 360; while (H[i].az - H[i - 1].az < -180) H[i].az += 360; }

  var tags = [], pin, ball, shadow, dots = [];
  function buildObjs() {
    var frag = document.createDocumentFragment();
    H.forEach(function (h) { var e = document.createElement('span'); e.className = 'fo-tag'; e.textContent = h.n; frag.appendChild(e); tags.push(e); });
    shadow = document.createElement('span'); shadow.className = 'fo-shadow'; frag.appendChild(shadow);
    for (var k = 0; k < NDOTS; k++) { var d = document.createElement('span'); d.className = 'fo-dot'; frag.appendChild(d); dots.push(d); }
    pin = document.createElement('span'); pin.className = 'fo-pin'; frag.appendChild(pin);
    ball = document.createElement('span'); ball.className = 'fo-ball'; frag.appendChild(ball);
    objs.appendChild(frag);
  }

  var cur = -1, dotPos = [], scale = 1, flyTop = 0, flyRange = 1;
  function measureFly() {
    var r = fly.getBoundingClientRect();
    flyTop = r.top + window.scrollY;
    flyRange = Math.max(1, fly.offsetHeight - vh);
    scale = vw < 900 ? clamp(vw / 1000 * 1.45, .5, .9) : clamp(Math.min(vw / 1440, vh / 860) * 1.22, .85, 1.4);
  }
  function setHole(i) {
    if (i === cur) return;
    cur = i;
    var h = H[i];
    dotPos = [];
    for (var k = 0; k < NDOTS; k++) dotPos.push(flight(h, (k + 1) / (NDOTS + 1)));
    tags.forEach(function (t, j) { t.classList.toggle('cur', j === i); });
    renderCard(false);
    renderScoreState();
  }
  function bb(az, ax) { return ' rotateZ(' + (-az).toFixed(2) + 'deg) rotateX(' + (-ax).toFixed(2) + 'deg)'; }
  // camera state eases toward the scroll target (critically damped), so moves between holes glide
  var cam = null, lastT = 0, flySettled = true;
  function flyFrame(now) {
    var r = clamp((window.scrollY - flyTop) / flyRange, 0, 1);
    var p = r * 8.9999, i = Math.floor(p), f = p - i;
    setHole(i);
    var h = H[i], n = H[Math.min(8, i + 1)];
    var k = i < 8 ? ease(clamp((f - .78) / .22, 0, 1)) : 0;
    var tgt = { cx: lerp(h.cam[0], n.cam[0], k), cy: lerp(h.cam[1], n.cam[1], k), az: lerp(h.az, n.az, k), ax: AX - 14 * Math.sin(Math.PI * k) };
    now = now || performance.now();
    var dt = Math.min(64, now - (lastT || now)); lastT = now;
    if (!cam || RM) cam = { cx: tgt.cx, cy: tgt.cy, az: tgt.az, ax: tgt.ax };
    else {
      var a = 1 - Math.exp(-dt / 140);
      cam.cx += (tgt.cx - cam.cx) * a; cam.cy += (tgt.cy - cam.cy) * a; cam.az += (tgt.az - cam.az) * a; cam.ax += (tgt.ax - cam.ax) * a;
    }
    var dist = Math.abs(tgt.cx - cam.cx) + Math.abs(tgt.cy - cam.cy) + Math.abs(tgt.az - cam.az) * 3;
    flySettled = dist < .3;
    var tr = 'rotateX(' + cam.ax.toFixed(2) + 'deg) scale(' + scale.toFixed(3) + ') rotateZ(' + cam.az.toFixed(2) + 'deg) translate(' + (-cam.cx).toFixed(1) + 'px,' + (-cam.cy).toFixed(1) + 'px)';
    for (var m = 0; m < maps.length; m++) maps[m].style.transform = tr;
    // rack focus: the sharp layer dips while the camera travels, revealing the pre-blurred copy
    var focus = 1 - Math.min(.7, .6 * Math.sin(Math.PI * k) + dist / 260);
    if (sharpLayer._o !== focus.toFixed(2)) { sharpLayer._o = focus.toFixed(2); sharpLayer.style.opacity = sharpLayer._o; }
    var b = bb(cam.az, cam.ax);
    for (var j = 0; j < 9; j++) tags[j].style.transform = 'translate3d(' + H[j].t[0] + 'px,' + H[j].t[1] + 'px,0)' + b;
    var holeIdx = k > .5 ? Math.min(8, i + 1) : i;
    var ph = H[holeIdx];
    pin.style.transform = 'translate3d(' + ph.g[0] + 'px,' + ph.g[1] + 'px,0)' + b;
    var u = k > 0 ? 1 : clamp((f - .06) / .66, 0, 1);
    var bp = u <= 0 ? [h.t[0], h.t[1], 0] : flight(h, u);
    if (k > .5) { bp = [n.t[0], n.t[1], 0]; u = 0; }
    ball.style.transform = 'translate3d(' + bp[0].toFixed(1) + 'px,' + bp[1].toFixed(1) + 'px,' + (bp[2] + 6).toFixed(1) + 'px)' + b;
    shadow.style.transform = 'translate3d(' + bp[0].toFixed(1) + 'px,' + bp[1].toFixed(1) + 'px,0) scale(' + (1 - bp[2] / 220).toFixed(3) + ')';
    shadow.style.opacity = (0.6 - bp[2] / 300).toFixed(2);
    var shown = k > .5 ? 0 : Math.floor(u * (NDOTS + 1));
    for (var d = 0; d < NDOTS; d++) {
      var dp = dotPos[d];
      dots[d].style.transform = 'translate3d(' + dp[0].toFixed(1) + 'px,' + dp[1].toFixed(1) + 'px,' + (dp[2] + 6).toFixed(1) + 'px)' + b;
      var on = d < shown;
      if (dots[d]._on !== on) { dots[d]._on = on; dots[d].classList.toggle('on', on); }
    }
  }

  /* trees with soft shadows, generated once (seeded), then a pre-blurred raster copy for depth of field */
  function rng(seed) { return function () { seed |= 0; seed = seed + 0x6D2B79F5 | 0; var t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  var SVGNS = 'http://www.w3.org/2000/svg';
  function plantTrees() {
    var svg = $('#course'); if (!svg || svg._planted) return; svg._planted = true;
    // occupancy grid (10 px cells): fairways + margin, lakes, clubhouse. Keeps planting O(1) per tree.
    var CS = 10, GW = 100, GH = 130, grid = new Uint8Array(GW * GH);
    function stamp(x, y, rad) {
      var x0 = Math.max(0, Math.floor((x - rad) / CS)), x1 = Math.min(GW - 1, Math.floor((x + rad) / CS));
      var y0 = Math.max(0, Math.floor((y - rad) / CS)), y1 = Math.min(GH - 1, Math.floor((y + rad) / CS));
      for (var gy = y0; gy <= y1; gy++) for (var gx = x0; gx <= x1; gx++) {
        var dx = gx * CS + 5 - x, dy = gy * CS + 5 - y;
        if (dx * dx + dy * dy <= rad * rad) grid[gy * GW + gx] = 1;
      }
    }
    H.forEach(function (h) { for (var t = 0; t <= 1.0001; t += 1 / 30) { var pt = q(h, t); stamp(pt[0], pt[1], 64); } });
    [[826, 760, 78], [905, 490, 86], [692, 240, 96], [250, 1210, 90], [700, 150, 70]].forEach(function (z) { stamp(z[0], z[1], z[2]); });
    function ok(x, y) {
      if (x < 24 || x > 976 || y < 24 || y > 1250) return false;
      return !grid[Math.floor(y / CS) * GW + Math.floor(x / CS)];
    }
    var R = rng(9), gT = $('#trees'), gS = $('#treeShadows'), fT = document.createDocumentFragment(), fS = document.createDocumentFragment(), placed = {};
    for (var c = 0; c < 170; c++) {
      var cx = 30 + R() * 940, cy = 30 + R() * 1220;
      if (!ok(cx, cy)) continue;
      var nT = 3 + Math.floor(R() * 6);
      for (var t2 = 0; t2 < nT; t2++) {
        var x = cx + (R() - .5) * 56, y = cy + (R() - .5) * 56, r = 6 + R() * 8;
        if (!ok(x, y) || !ok(x + r * .7, y) || !ok(x - r * .7, y) || !ok(x, y + r * .7) || !ok(x, y - r * .7)) continue;
        var ci = Math.floor(y / 8) * 130 + Math.floor(x / 8);
        if (placed[ci]) continue;
        placed[ci] = 1;
        var sh = document.createElementNS(SVGNS, 'circle'); sh.setAttribute('cx', (x + 8).toFixed(1)); sh.setAttribute('cy', (y + 7).toFixed(1)); sh.setAttribute('r', (r * 1.45).toFixed(1)); sh.setAttribute('fill', 'url(#gTreeSh)'); fS.appendChild(sh);
        var tr = document.createElementNS(SVGNS, 'circle'); tr.setAttribute('cx', x.toFixed(1)); tr.setAttribute('cy', y.toFixed(1)); tr.setAttribute('r', r.toFixed(1)); tr.setAttribute('fill', 'url(#gTree)'); fT.appendChild(tr);
      }
    }
    gS.appendChild(fS); gT.appendChild(fT);
  }
  // the depth-of-field copy (img/course-blur.webp) is pre-rendered from this same seeded SVG

  /* ---------------- golden hour on hole 5 ---------------- */
  var gh = $('#mirador'), G = {};
  function measureGh() {
    if (!gh) return;
    var W = vw, Hh = vh, sc = Math.max(W / 1600, Hh / 1067), dh = 1067 * sc, top = (Hh - dh) / 2;
    G.hz = top + .548 * dh;
    G.feet = top + (W < 900 ? .8 : .78) * dh;
    G.sunX = W * (W < 900 ? .7 : .63);
    G.gh = Hh * (W < 900 ? .26 : .3); G.gw = G.gh * .625; G.gx = W * (W < 900 ? .04 : .2);
    var golfer = $('#ghGolfer'), sh = $('#ghShadow');
    [golfer, sh].forEach(function (e) { e.style.width = G.gw.toFixed(0) + 'px'; e.style.height = G.gh.toFixed(0) + 'px'; });
    var gy = G.feet - G.gh;
    golfer.style.transform = 'translate3d(' + G.gx.toFixed(1) + 'px,' + gy.toFixed(1) + 'px,0)';
    sh.style.transform = 'translate3d(' + G.gx.toFixed(1) + 'px,' + gy.toFixed(1) + 'px,0) skewX(32deg) scaleY(-.42)';
    $('#ghSunbox').style.height = G.hz.toFixed(0) + 'px';
    G.tx = G.gx + 96 * G.gw / 200; G.ty = gy + 306 * G.gh / 320;
    G.ex = G.sunX; G.ey = G.hz - 6;
    G.mx = (G.tx + G.ex) / 2; G.my = Math.min(G.ty, G.ey) - Hh * .42;
    var trail = $('#ghTrail');
    if (!G.dots) { G.dots = []; for (var i = 0; i < 26; i++) { var d = document.createElement('span'); trail.appendChild(d); G.dots.push(d); } }
    G.dots.forEach(function (d, i) { var pp = ghPath((i + 1) / 27); d.style.transform = 'translate3d(' + pp[0].toFixed(1) + 'px,' + pp[1].toFixed(1) + 'px,0) scale(' + pp[2].toFixed(2) + ')'; });
    G.els = { a: $$('.gh-b'), c: $$('.gh-c'), sun: $('#ghSun'), glow: $('#ghGlow'), glit: $('#ghGlitter'), ball: $('#ghBall'), arms: $('#ghArms'), club: $('#ghClub'), body: $('#ghBody') };
    G.last = -1;
  }
  function ghPath(u) {
    var v = 1 - u;
    return [v * v * G.tx + 2 * v * u * G.mx + u * u * G.ex, v * v * G.ty + 2 * v * u * G.my + u * u * G.ey, 1 - .78 * u];
  }
  function ghFrame(forceR) {
    if (!G.els) return;
    var r;
    if (forceR != null) r = forceR;
    else { var rc = gh.getBoundingClientRect(); r = clamp(-rc.top / Math.max(1, rc.height - vh), 0, 1); }
    if (Math.abs(r - G.last) < .0005) return;
    G.last = r;
    var E = G.els;
    var ob = clamp((r - .12) / .38, 0, 1), oc = clamp((r - .55) / .37, 0, 1);
    E.a.forEach(function (e) { e.style.opacity = ob.toFixed(3); });
    E.c.forEach(function (e) { e.style.opacity = oc.toFixed(3); });
    var sy = lerp(G.hz * .16, G.hz + 56, Math.pow(r, 1.15));
    E.sun.style.transform = 'translate3d(' + G.sunX.toFixed(1) + 'px,' + sy.toFixed(1) + 'px,0) scale(' + (1 + .3 * r).toFixed(3) + ')';
    E.glow.style.transform = 'translate3d(' + G.sunX.toFixed(1) + 'px,' + Math.min(sy, G.hz).toFixed(1) + 'px,0) scale(' + (.8 + .5 * r).toFixed(3) + ')';
    E.glow.style.opacity = (.25 + .75 * Math.sin(Math.PI * clamp(r * 1.05, 0, 1))).toFixed(3);
    E.glit.style.transform = 'translate3d(' + G.sunX.toFixed(1) + 'px,' + G.hz.toFixed(1) + 'px,0) scaleX(' + (.6 + r).toFixed(2) + ')';
    E.glit.style.opacity = (clamp((r - .1) / .3, 0, 1) * (1 - clamp((r - .82) / .12, 0, 1))).toFixed(3);
    // swing: backswing, pause at the top, downswing through impact to the finish
    var th, ph, s1 = ease(clamp(r / .2, 0, 1)), s2 = clamp((r - .24) / .07, 0, 1);
    if (s2 <= 0) { th = 92 + 138 * s1; ph = 70 * s1; }
    else { var e2 = s2 * s2 * (3 - 2 * s2); th = 230 - 270 * e2; ph = 70 - 150 * e2; }
    E.arms.setAttribute('transform', 'rotate(' + th.toFixed(1) + ' 100 98)');
    E.club.setAttribute('transform', 'rotate(' + ph.toFixed(1) + ' 162 98)');
    E.body.setAttribute('transform', 'translate(' + (s2 * 5).toFixed(1) + ' 0)');
    var imp = .24 + .07 * .5, u = clamp((r - imp) / .42, 0, 1);
    var bp = u > 0 ? ghPath(u) : [G.tx, G.ty, 1];
    E.ball.style.transform = 'translate3d(' + bp[0].toFixed(1) + 'px,' + bp[1].toFixed(1) + 'px,0) scale(' + bp[2].toFixed(3) + ')';
    E.ball.style.opacity = u >= 1 ? '0' : '1';
    var shown = u >= 1 ? (r > imp + .55 ? 0 : 26) : Math.floor(u * 27);
    for (var i = 0; i < G.dots.length; i++) { var on = i < shown; if (G.dots[i]._on !== on) { G.dots[i]._on = on; G.dots[i].classList.toggle('on', on); } }
  }

  function holeText(h) { return h[lang]; }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function renderCard(force) {
    if (cur < 0) return;
    var h = H[cur], t = holeText(h);
    $('#fcNum').textContent = pad(h.n);
    $('#fcPar').textContent = T().par + ' ' + h.par;
    $('#fcM').textContent = h.m + ' m';
    $('#fcHcp').textContent = h.hcp ? T().hcp + ' ' + h.hcp : '';
    $('#fcTitle').textContent = t.title;
    $('#fcDesc').textContent = t.desc;
    $('#fcKey').textContent = t.key;
    if (!force && !RM) { card.classList.remove('swap'); void card.offsetWidth; card.classList.add('swap'); }
  }
  var scoreBtns = [];
  function renderScore() {
    var ol = $('#flyScore');
    ol.innerHTML = '';
    scoreBtns = [];
    H.forEach(function (h, i) {
      var li = document.createElement('li'), b = document.createElement('button');
      b.type = 'button';
      b.innerHTML = '<b><span class="sr">' + (lang === 'es' ? 'Hoyo ' : 'Hole ') + '</span>' + h.n + '</b><span>P' + h.par + ' · ' + h.m + '</span>';
      b.addEventListener('click', function () { goHole(i); });
      li.appendChild(b); ol.appendChild(li); scoreBtns.push(b);
    });
    var tl = document.createElement('li');
    tl.innerHTML = '<span class="tot"><b>' + T().par + ' 35</b><span>2.867 m</span></span>';
    ol.appendChild(tl);
    renderScoreState();
  }
  function renderScoreState() { scoreBtns.forEach(function (b, j) { b.classList.toggle('cur', j === cur); b.classList.toggle('done', j < cur); }); }
  function goHole(i) {
    measureFly();
    window.scrollTo({ top: flyTop + (i + .74) / 9 * flyRange, behavior: RM ? 'auto' : 'smooth' });
  }
  function renderStatic() {
    var ol = $('#flyStatic');
    ol.innerHTML = H.map(function (h) {
      var t = holeText(h);
      return '<li><span class="fs-top"><span>' + (lang === 'es' ? 'Hoyo ' : 'Hole ') + h.n + '</span><span>' + T().par + ' ' + h.par + ' · ' + h.m + ' m' + (h.hcp ? ' · ' + T().hcp + ' ' + h.hcp : '') + '</span></span><b>' + t.title + '</b><p>' + t.desc + '</p></li>';
    }).join('') + '<li><span class="fs-top"><span>' + T().total + '</span><span>' + T().par + ' 35 · 2.867 m</span></span></li>';
  }

  /* ---------------- clubhouse crossfade ---------------- */
  var club = $('#club'), cmDay = $('.cm-day'), cmDusk = $('.cm-dusk'), ctBar = $('.ct-bar i');
  function clubFrame() {
    var r = club.getBoundingClientRect();
    var p = clamp(-r.top / Math.max(1, r.height - vh), 0, 1);
    var o = clamp((p - .2) / .55, 0, 1);
    cmDusk.style.opacity = o.toFixed(3);
    cmDay.style.transform = 'scale(' + (1.1 - p * .08).toFixed(4) + ')';
    cmDusk.style.transform = 'scale(' + (1.04 + p * .04).toFixed(4) + ')';
    ctBar.style.transform = 'scaleX(' + p.toFixed(3) + ')';
  }

  /* ---------------- single scroll loop, active only while sections are visible ---------------- */
  var active = new Set(), ticking = false, lastY = -1;
  function frame(now) {
    ticking = false;
    var y = window.scrollY;
    if (active.has('hero')) heroFrame(y);
    if (active.has('mf')) mfFrame();
    if (active.has('fly')) { flyFrame(now); if (!flySettled) req(); }
    if (active.has('gh')) ghFrame();
    if (active.has('club')) clubFrame();
    var solid = y > 40;
    if (hdr._solid !== solid) { hdr._solid = solid; hdr.classList.toggle('solid', solid); }
    if (lastY >= 0) {
      var hide = y > vh * .9 && y > lastY + 3 ? true : (y < lastY - 3 ? false : hdr._hide);
      if (hdr.contains(document.activeElement)) hide = false;
      if (hdr._hide !== hide) { hdr._hide = hide; hdr.classList.toggle('hide', !!hide); }
    }
    lastY = y;
  }
  function req() { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }
  window.addEventListener('scroll', req, { passive: true });
  window.addEventListener('resize', function () { vh = window.innerHeight; vw = window.innerWidth; measureFly(); if (G.els) { measureGh(); if (RM) ghFrame(.6); } req(); }, { passive: true });

  function watch(el, key) {
    if (!el) return;
    new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) active.add(key); else active.delete(key);
        if (key === 'hero') hero.classList.toggle('hero-paused', !e.isIntersecting);
      });
      req();
    }, { rootMargin: '10% 0px' }).observe(el);
  }

  /* ---------------- reveal ---------------- */
  function reveals() {
    $$('.academy .h2, .first .h2, .day .h2, .visit .h2, .tee .h2, .ac-body .lede, .ft-head .lede').forEach(function (e) { e.classList.add('reveal'); });
    var els = $$('.reveal');
    if (RM || !('IntersectionObserver' in window)) { els.forEach(function (e) { e.classList.add('in'); }); return; }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (e) { io.observe(e); });
  }

  /* ---------------- tee time planner ---------------- */
  var form = $('#teeForm'), dateIn = $('#tDate'), plOut = $('#tPlayers'), buggyIn = $('#tBuggy');
  var players = 2, prevTicket = {};
  function isoLocal(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  (function initDate() {
    var t = new Date(); dateIn.min = isoLocal(t);
    var tm = new Date(t.getTime() + 864e5); dateIn.value = isoLocal(tm);
  })();
  function teeState() {
    var v = dateIn.value, parts = v ? v.split('-').map(Number) : null;
    var round = +form.querySelector('input[name="round"]:checked').value;
    var slot = form.querySelector('input[name="slot"]:checked').value;
    var st = { date: v, parts: parts, round: round, slot: slot, players: players, buggy: buggyIn.checked, name: $('#tName').value.trim(), note: $('#tNote').value.trim() };
    if (parts) {
      var ss = sunsetUTC(parts[0], parts[1] - 1, parts[2]);
      var mins = round === 9 ? 135 : 255;
      var tee = new Date(ss.getTime() - mins * 6e4);
      tee = new Date(Math.floor(tee.getTime() / 6e5) * 6e5);
      st.sunset = fmtTime(ss); st.sunTee = fmtTime(tee);
      var m = parts[1];
      st.inSeason = m >= 10 || m <= 5;
    }
    return st;
  }
  function priceOf(st) {
    var r = D.rates[st.round];
    if (!st.buggy) return st.players * r.base;
    return Math.floor(st.players / 2) * r.pair + (st.players % 2) * r.buggy;
  }
  function timeLabel(st) { return st.slot === 'sun' ? (T().sun + (st.sunTee ? ' · ' + st.sunTee : '')) : T()[st.slot]; }
  var dateFmts = {};
  function dateLabel(st) {
    if (!st.parts) return '—';
    var f = dateFmts[lang] || (dateFmts[lang] = new Intl.DateTimeFormat(T().dl, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }));
    return f.format(new Date(Date.UTC(st.parts[0], st.parts[1] - 1, st.parts[2], 12)));
  }
  function setTk(id, val, animate) {
    var el = $(id);
    if (prevTicket[id] === val) return;
    prevTicket[id] = val; el.textContent = val;
    if (animate && !RM) { el.classList.remove('flip'); void el.offsetWidth; el.classList.add('flip'); }
  }
  function buildMsg(st) {
    var t = T();
    var lines = [t.waHead, '', '• ' + t.fDate + ': ' + dateLabel(st), '• ' + t.fTime + ': ' + timeLabel(st), '• ' + t.fRound + ': ' + st.round + ' ' + t.holes, '• ' + t.fPlayers + ': ' + st.players, '• ' + t.fBuggy + ': ' + (st.buggy ? t.yes : t.no)];
    if (st.inSeason) lines.push('• ' + t.fEst + ': ' + priceOf(st) + ' €');
    if (st.name) lines.push('• ' + t.fName + ': ' + st.name);
    if (st.note) lines.push('• ' + t.fNote + ': ' + st.note);
    lines.push('', t.waFoot);
    return lines.join('\n');
  }
  function updateTee(animate) {
    var st = teeState(), t = T();
    $('#sunSlot').textContent = st.sunTee || '--:--';
    $('#sunHint').textContent = st.slot === 'sun' && st.sunTee ? t.sunHint(st.sunTee, st.sunset) : '';
    setTk('#kDate', dateLabel(st), animate);
    setTk('#kTime', timeLabel(st), animate);
    setTk('#kRound', st.round + ' ' + t.holes, animate);
    setTk('#kPlayers', t.players(st.players), animate);
    setTk('#kBuggy', st.buggy ? t.yes : t.no, animate);
    var tot = $('#kTotal');
    if (!st.parts) { tot.textContent = '—'; tot.classList.remove('small'); }
    else if (st.inSeason) { tot.textContent = priceOf(st) + ' €'; tot.classList.remove('small'); }
    else { tot.textContent = t.summer; tot.classList.add('small'); }
    var msg = buildMsg(st);
    $('#sendWa').href = 'https://wa.me/' + D.phone + '?text=' + encodeURIComponent(msg);
    $('#sendMail').href = 'mailto:' + D.email + '?subject=' + encodeURIComponent(t.mailSubj + (st.parts ? ' · ' + dateLabel(st) : '')) + '&body=' + encodeURIComponent(msg);
    $('#acWa').href = 'https://wa.me/' + D.phone + '?text=' + encodeURIComponent(t.acMsg);
    $('#clWa').href = 'https://wa.me/' + D.phone + '?text=' + encodeURIComponent(t.clMsg);
    $('#clEv').href = 'mailto:' + D.email + '?subject=' + encodeURIComponent(t.evSubj);
  }
  form.addEventListener('input', function () { dateIn.classList.toggle('err', !dateIn.value); updateTee(true); });
  form.addEventListener('change', function () { updateTee(true); });
  form.addEventListener('submit', function (e) { e.preventDefault(); });
  $$('.stepper button').forEach(function (b) {
    b.addEventListener('click', function () { players = clamp(players + +b.dataset.step, 1, 4); plOut.textContent = players; updateTee(true); });
  });
  ['#sendWa', '#sendMail'].forEach(function (id) {
    $(id).addEventListener('click', function (e) {
      if (!dateIn.value) { e.preventDefault(); dateIn.classList.add('err'); dateIn.focus(); toast(T().pickDate); return; }
      toast(T().opening);
      dropBall();
    });
  });

  var ticket = $('.ticket'), dropT;
  function dropBall() {
    if (RM) return;
    var g = $('.tk-green'), w = g.getBoundingClientRect().width;
    ticket.style.setProperty('--dx', (w * .4).toFixed(1) + 'px');
    ticket.classList.remove('drop'); void ticket.offsetWidth; ticket.classList.add('drop');
    clearTimeout(dropT); dropT = setTimeout(function () { ticket.classList.remove('drop'); }, 3200);
  }

  /* ---------------- nav: current section ---------------- */
  if ('IntersectionObserver' in window) {
    var navLinks = $$('.nav a');
    var navIO = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) navLinks.forEach(function (a) { a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id); }); });
    }, { rootMargin: '-45% 0px -50% 0px' });
    ['recorrido', 'academia', 'primera-vez', 'club', 'visita'].forEach(function (id) { var el = document.getElementById(id); if (el) navIO.observe(el); });
  }

  /* ---------------- first-time path ---------------- */
  var ftSteps = $$('#ftSteps li'), ftBall = $('#ftBall'), ftLine = $('.ft-line'), ftCur = 0, ftAuto = null, ftUser = false;
  function ftGo(i, user) {
    if (user) { ftUser = true; clearInterval(ftAuto); }
    ftCur = i;
    ftSteps.forEach(function (li, j) { li.classList.toggle('on', j === i); li.querySelector('button').setAttribute('aria-pressed', String(j === i)); });
    requestAnimationFrame(function () {
      var lr = ftLine.getBoundingClientRect(), nr = ftSteps[i].querySelector('.n').getBoundingClientRect();
      var horiz = lr.width > lr.height;
      var off = horiz ? (nr.left + nr.width / 2 - lr.left) : (nr.top + nr.height / 2 - lr.top);
      ftBall.classList.remove('holed');
      ftBall.style.transform = horiz ? 'translate3d(' + off.toFixed(1) + 'px,0,0)' : 'translate3d(0,' + off.toFixed(1) + 'px,0)';
      if (i === ftSteps.length - 1 && !RM) {
        setTimeout(function () {
          if (ftCur !== i) return;
          var end = horiz ? lr.width : lr.height;
          ftBall.style.transform = horiz ? 'translate3d(' + (end + 1) + 'px,0,0)' : 'translate3d(0,' + (end + 1) + 'px,0)';
          setTimeout(function () { if (ftCur === i) ftBall.classList.add('holed'); }, 800);
        }, 1100);
      }
    });
  }
  ftSteps.forEach(function (li, j) { li.querySelector('button').addEventListener('click', function () { ftGo(j, true); }); });
  if (!RM && 'IntersectionObserver' in window) {
    var ftIO = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting && !ftUser && !ftAuto) {
          ftGo(0);
          ftAuto = setInterval(function () { if (ftCur >= ftSteps.length - 1) { clearInterval(ftAuto); return; } ftGo(ftCur + 1); }, 2600);
          ftIO.disconnect();
        }
      });
    }, { threshold: .5 });
    ftIO.observe($('#ftPath'));
  }

  /* ---------------- glossary flip cards ---------------- */
  $$('#gloss button').forEach(function (b) {
    b.addEventListener('click', function () { b.setAttribute('aria-expanded', String(b.getAttribute('aria-expanded') !== 'true')); });
  });

  /* ---------------- init: hero first, the rest once the page has loaded and the main thread is idle ---------------- */
  setSunsetToday();
  updateTee(false);
  var saved = null;
  try { saved = localStorage.getItem('cda-lang'); } catch (e) { /* ignore */ }
  if (saved === 'en') applyLang('en');
  requestAnimationFrame(function () { requestAnimationFrame(function () { document.body.classList.add('is-in'); }); });
  if (!RM) watch(hero, 'hero');
  var booted = false;
  function boot() {
    if (booted) return; booted = true;
    buildObjs();
    plantTrees();
    renderScore();
    renderStatic();
    splitWords();
    reveals();
    requestAnimationFrame(function () {
      measureFly();
      measureGh();
      setHole(0);
      if (!RM) { watch(mf, 'mf'); watch(fly, 'fly'); watch(gh, 'gh'); watch(club, 'club'); } else { flyFrame(); ghFrame(.6); }
      req();
    });
  }
  var idle = window.requestIdleCallback || function (f) { return setTimeout(f, 200); };
  function later() { idle(boot, { timeout: 1500 }); }
  if (document.readyState === 'complete') later(); else window.addEventListener('load', later);
  // if the visitor scrolls before boot, boot immediately
  window.addEventListener('scroll', function () { if (window.scrollY > vh * .3) boot(); }, { passive: true });
})();
