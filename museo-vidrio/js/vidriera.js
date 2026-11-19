/* A designed leaded-glass triptych (rose motif, jewelled borders, quarries, lead came
   with highlights), a sun that moves through it, light shafts and a projected pattern. */
(function () {
  'use strict';
  var C = { ruby: '#b3203a', gold: '#e3a93a', blue: '#2346a8', deep: '#172a6e', green: '#1f7a55', pale: '#dfe9e2', amber: '#d0702a', violet: '#5a3290', quarry: '#8ea39a' };
  function shade(h, k) { var n = parseInt(h.slice(1), 16); var f = function (v) { return Math.min(255, Math.round(v * k)); }; return 'rgb(' + f(n >> 16 & 255) + ',' + f(n >> 8 & 255) + ',' + f(n & 255) + ')'; }
  function circle(cx, cy, r, col) { return { s: '<circle cx="' + cx.toFixed(2) + '" cy="' + cy.toFixed(2) + '" r="' + r + '"', c: col }; }
  function ellipse(cx, cy, rx, ry, rot, col) { return { s: '<ellipse cx="' + cx.toFixed(2) + '" cy="' + cy.toFixed(2) + '" rx="' + rx + '" ry="' + ry + '" transform="rotate(' + rot.toFixed(1) + ' ' + cx.toFixed(2) + ' ' + cy.toFixed(2) + ')"', c: col }; }
  function path(d, col, rule) { return { s: '<path d="' + d + '"' + (rule ? ' fill-rule="evenodd"' : ''), c: col }; }
  function medallion(cx, cy, r, ring, field, petal) {
    var out = [circle(cx, cy, r, ring), circle(cx, cy, r * .78, field)];
    var o = r * .33;
    [[o, 0], [-o, 0], [0, o], [0, -o]].forEach(function (d) { out.push(circle(cx + d[0], cy + d[1], r * .3, petal)); });
    out.push(circle(cx, cy, r * .2, C.ruby)); out.push(circle(cx, cy, r * .08, C.pale));
    return out;
  }
  function pane(i) {
    var W = 100, H = i === 1 ? 220 : 260, b = 8;
    var outer = 'M0,' + H + ' L0,50 A50,50 0 0 1 100,50 L100,' + H + ' Z';
    var inner = 'M' + b + ',' + (H - b) + ' L' + b + ',50 A' + (50 - b) + ',' + (50 - b) + ' 0 0 1 ' + (100 - b) + ',50 L' + (100 - b) + ',' + (H - b) + ' Z';
    var shapes = [path(inner, C.quarry), path(outer + ' ' + inner, i === 1 ? C.blue : C.ruby, true)];
    // jewels along the border
    var jewel = i === 1 ? C.gold : C.gold, jewel2 = i === 1 ? C.ruby : C.blue;
    for (var y = 58, k = 0; y < H - 6; y += 13, k++) { shapes.push(circle(b / 2, y, 2.3, k % 2 ? jewel : jewel2)); shapes.push(circle(W - b / 2, y, 2.3, k % 2 ? jewel : jewel2)); }
    for (var a = 0; a <= 8; a++) { var t = Math.PI + a / 8 * Math.PI; shapes.push(circle(50 + Math.cos(t) * (50 - b / 2), 50 + Math.sin(t) * (50 - b / 2), 2.3, a % 2 ? jewel2 : jewel)); }
    shapes.push(path('M' + b + ',' + (H - b) + ' L' + (W - b) + ',' + (H - b) + ' L' + (W - b) + ',' + (H - b - 10) + ' L' + b + ',' + (H - b - 10) + ' Z', C.green));
    if (i === 1) {
      var cx = 50, cy = 80;
      shapes.push(circle(cx, cy, 38, C.deep));
      for (var p = 0; p < 12; p++) { var ang = p / 12 * Math.PI * 2; shapes.push(ellipse(cx + Math.cos(ang) * 24, cy + Math.sin(ang) * 24, 5.6, 12, ang * 180 / Math.PI + 90, p % 2 ? C.gold : C.ruby)); }
      for (var q = 0; q < 12; q++) { var a2 = (q + .5) / 12 * Math.PI * 2; shapes.push(circle(cx + Math.cos(a2) * 34.2, cy + Math.sin(a2) * 34.2, 3.4, C.pale)); }
      shapes = shapes.concat(medallion(cx, cy, 12.5, C.gold, C.blue, C.ruby));
      shapes = shapes.concat(medallion(50, 148, 20, C.green, C.ruby, C.gold));
      shapes = shapes.concat(medallion(50, 186, 14, C.ruby, C.blue, C.gold));
    } else {
      shapes.push(circle(50, 34, 9, C.blue)); shapes.push(circle(39.5, 50, 9, C.green)); shapes.push(circle(60.5, 50, 9, C.green)); shapes.push(circle(50, 45, 3.2, C.gold));
      [100, 160, 220].forEach(function (yy, j) { shapes = shapes.concat(medallion(50, yy, 25, j === 1 ? C.blue : C.ruby, j === 1 ? C.ruby : C.blue, C.gold)); });
    }
    // quarry lattice (lead only), clipped to the inner field
    var lat = '';
    for (var d = -H; d < W + H; d += 13) { lat += 'M' + d + ',0 L' + (d + H) + ',' + H + ' M' + d + ',' + H + ' L' + (d + H) + ',0 '; }
    return { W: W, H: H, shapes: shapes, inner: inner, outer: outer, lat: lat };
  }
  function svg(p, k, id, lead) {
    var fills = '', strokes = '';
    p.shapes.forEach(function (s) { fills += s.s + ' fill="' + shade(s.c, k) + '"/>'; strokes += s.s + '/>'; });
    var s = '<svg viewBox="0 0 ' + p.W + ' ' + p.H + '" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">' +
      '<defs><clipPath id="in' + id + '"><path d="' + p.inner + '"/></clipPath>' +
      '<linearGradient id="sh' + id + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".16"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/><stop offset=".7" stop-color="#000" stop-opacity=".12"/><stop offset="1" stop-color="#fff" stop-opacity=".08"/></linearGradient></defs>' +
      fills;
    if (lead) {
      s += '<g clip-path="url(#in' + id + ')"><path d="' + p.lat + '" stroke="#15110e" stroke-width="1.3" fill="none"/></g>' +
        '<g fill="none" stroke="#15110e" stroke-width="2.1" stroke-linejoin="round">' + strokes + '<path d="' + p.outer + '"/></g>' +
        '<g fill="none" stroke="rgba(255,236,200,.24)" stroke-width=".55" transform="translate(-.55,-.55)">' + strokes + '</g>' +
        '<path d="' + p.outer + '" fill="url(#sh' + id + ')"/>';
    }
    return s + '</svg>';
  }
  window.Vidriera = function (tri, opt) {
    var panes = Array.prototype.slice.call(tri.querySelectorAll('.pane')), built = panes.map(function (_, i) { return pane(i); });
    panes.forEach(function (el, i) { el.innerHTML = svg(built[i], 0.4, 'd' + i, true) + '<div class="lit"><div class="lit-inner">' + svg(built[i], 1.15, 'l' + i, true) + '</div></div><div class="warm"></div>'; });
    var proj = tri.querySelector('.proj');
    proj.innerHTML = built.map(function (p, i) { return '<div class="pj pj' + i + '">' + svg(p, 0.95, 'p' + i, false) + '</div>'; }).join('');
    var lits = tri.querySelectorAll('.lit'), inners = tri.querySelectorAll('.lit-inner'), warms = tri.querySelectorAll('.warm'), shafts = tri.querySelector('.shafts');
    return function applySun(f) { // f: 0 at opening (11:00), 1 at closing (19:00)
      var pw = panes[0].offsetWidth || 100, ph = panes[0].offsetHeight || 260;
      var x = (f - 0.5) * pw * 1.5, y = (Math.abs(f - 0.45) * 0.9 - 0.2) * ph;
      for (var i = 0; i < lits.length; i++) { var off = (i - 1) * pw * 0.06, X = (x + off).toFixed(1), Y = y.toFixed(1); lits[i].style.transform = 'translate3d(' + X + 'px,' + Y + 'px,0)'; inners[i].style.transform = 'translate3d(' + (-X) + 'px,' + (-Y) + 'px,0)'; }
      var warm = Math.max(0, f - 0.55) / 0.45;
      for (var j = 0; j < warms.length; j++) warms[j].style.opacity = (warm * 0.9).toFixed(3);
      var sk = (0.5 - f) * 50; // degrees: light comes from the left in the morning, from the right in the evening
      shafts.style.transform = 'skewX(' + sk.toFixed(1) + 'deg)';
      shafts.style.opacity = (0.55 + Math.sin(f * Math.PI) * 0.45).toFixed(3);
      proj.style.transform = 'scaleY(-1) skewX(' + (-sk * 1.1).toFixed(1) + 'deg)';
      proj.style.opacity = (0.16 + Math.sin(f * Math.PI) * 0.2).toFixed(3);
    };
  };
})();
