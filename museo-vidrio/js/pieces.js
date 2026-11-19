/* Code-drawn glass silhouettes for eras that have no free photograph. */
(function () {
  'use strict';
  var NS = 'http://www.w3.org/2000/svg';
  function hexA(h, a) { var n = parseInt(h.slice(1), 16); return 'rgba(' + (n >> 16 & 255) + ',' + (n >> 8 & 255) + ',' + (n & 255) + ',' + a + ')'; }
  function mix(h, t, k) { var a = parseInt(h.slice(1), 16), b = parseInt(t.slice(1), 16); var r = Math.round((a >> 16 & 255) * (1 - k) + (b >> 16 & 255) * k), g = Math.round((a >> 8 & 255) * (1 - k) + (b >> 8 & 255) * k), bl = Math.round((a & 255) * (1 - k) + (b & 255) * k); return '#' + ((1 << 24) + (r << 16) + (g << 8) + bl).toString(16).slice(1); }
  // Catmull-Rom through points -> cubic bezier commands
  function smooth(pts) {
    var d = '';
    for (var i = 0; i < pts.length - 1; i++) {
      var p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
      var c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6], c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
      d += ' C' + c1[0].toFixed(1) + ',' + c1[1].toFixed(1) + ' ' + c2[0].toFixed(1) + ',' + c2[1].toFixed(1) + ' ' + p2[0].toFixed(1) + ',' + p2[1].toFixed(1);
    }
    return d;
  }
  function vessel(profile, y0, y1, W) {
    var R = profile.map(function (p) { return [150 + p[1] * W, y0 + p[0] * (y1 - y0)]; });
    var Lf = R.slice().reverse().map(function (p) { return [300 - p[0], p[1]]; });
    return { d: 'M' + R[0][0].toFixed(1) + ',' + R[0][1].toFixed(1) + smooth(R) + ' L' + Lf[0][0].toFixed(1) + ',' + Lf[0][1].toFixed(1) + smooth(Lf) + ' Z', top: R[0], bottom: R[R.length - 1] };
  }
  function defs(id, c) {
    var dk = mix(c, '#000000', .6), lt = mix(c, '#ffffff', .65);
    return '<defs>' +
      '<linearGradient id="b' + id + '" x1="0" x2="1">' +
      '<stop offset="0" stop-color="' + dk + '" stop-opacity=".95"/><stop offset=".16" stop-color="' + c + '" stop-opacity=".62"/>' +
      '<stop offset=".3" stop-color="' + lt + '" stop-opacity=".9"/><stop offset=".38" stop-color="' + c + '" stop-opacity=".5"/>' +
      '<stop offset=".72" stop-color="' + c + '" stop-opacity=".66"/><stop offset=".86" stop-color="' + lt + '" stop-opacity=".45"/>' +
      '<stop offset=".93" stop-color="' + dk + '" stop-opacity=".9"/><stop offset="1" stop-color="' + dk + '"/></linearGradient>' +
      '<linearGradient id="s' + id + '" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".55"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>' +
      '<radialGradient id="g' + id + '"><stop offset="0" stop-color="#000" stop-opacity=".75"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>' +
      '<radialGradient id="ig' + id + '" cx=".5" cy=".62" r=".55"><stop offset="0" stop-color="' + lt + '" stop-opacity=".85"/><stop offset=".45" stop-color="' + c + '" stop-opacity=".35"/><stop offset="1" stop-color="' + c + '" stop-opacity="0"/></radialGradient>' +
      '<radialGradient id="bc' + id + '"><stop offset="0" stop-color="' + lt + '" stop-opacity=".9"/><stop offset="1" stop-color="' + c + '" stop-opacity="0"/></radialGradient>' +
      '<linearGradient id="st' + id + '" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".95"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>' +
      '<linearGradient id="pt' + id + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4a4238"/><stop offset="1" stop-color="#2b261f"/></linearGradient>' +
      '<linearGradient id="pf' + id + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#221e19"/><stop offset="1" stop-color="#0e0c0a"/></linearGradient>' +
      '<radialGradient id="pl' + id + '" cx=".5" cy="0" r=".7"><stop offset="0" stop-color="' + c + '" stop-opacity=".35"/><stop offset="1" stop-color="' + c + '" stop-opacity="0"/></radialGradient>' +
      '</defs>';
  }
  function body(id, v, c, extra) {
    var rx = v.top[0] - 150;
    return '<ellipse cx="150" cy="' + (v.bottom[1] + 6) + '" rx="' + Math.max(60, (v.bottom[0] - 150) * 1.6) + '" ry="12" fill="url(#g' + id + ')"/>' +
      '<g class="sway"><clipPath id="c' + id + '"><path d="' + v.d + '"/></clipPath>' +
      '<path d="' + v.d + '" fill="url(#b' + id + ')"/>' +
      '<g clip-path="url(#c' + id + ')">' + (extra || '') +
      '<rect x="0" y="0" width="300" height="560" fill="url(#ig' + id + ')"/>' +
      '<ellipse cx="150" cy="' + (v.bottom[1] - 10) + '" rx="' + Math.max(30, (v.bottom[0] - 150) * 1.3) + '" ry="10" fill="url(#bc' + id + ')"/>' +
      '<path d="' + v.d + '" fill="none" stroke="rgba(255,255,255,.28)" stroke-width="2" transform="translate(150 0) scale(.84 1) translate(-150 0)"/>' +
      '<path d="' + v.d + '" fill="none" stroke="rgba(0,0,0,.35)" stroke-width="6" transform="translate(150 0) scale(.94 1) translate(-150 0)"/>' +
      '<rect class="streak" x="86" y="0" width="9" height="560" fill="url(#st' + id + ')"/>' +
      '<rect class="sweep" x="-60" y="0" width="70" height="560" fill="url(#s' + id + ')" transform="skewX(-12)"/></g>' +
      '<path d="' + v.d + '" fill="none" stroke="rgba(255,255,255,.32)" stroke-width="1.2"/>' +
      '<ellipse cx="150" cy="' + v.top[1] + '" rx="' + rx + '" ry="' + (rx * .2).toFixed(1) + '" fill="' + hexA(mix(c, '#000000', .7), .7) + '" stroke="rgba(255,255,255,.55)" stroke-width="1.4"/></g>';
  }
  function rnd(seed) { return function () { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }; }
  var DRAW = {
    vase: function (id) {
      var c = '#d6392c', v = vessel([[0, .44], [.06, .36], [.28, .15], [.52, .19], [.78, .36], [.92, .34], [.97, .2], [1, .22]], 40, 470, 130);
      var R = rnd(7), fl = '';
      for (var i = 0; i < 46; i++) fl += '<circle cx="' + (70 + R() * 160).toFixed(1) + '" cy="' + (90 + R() * 360).toFixed(1) + '" r="' + (0.8 + R() * 2.2).toFixed(1) + '" fill="#f2f2ff" opacity="' + (.35 + R() * .5).toFixed(2) + '"/>';
      return defs(id, c) + body(id, v, c, fl);
    },
    bowl: function (id) {
      var c = '#f08a2b', v = vessel([[0, .98], [.12, .97], [.42, .86], [.7, .62], [.9, .38], [1, .3]], 270, 450, 130);
      var sw = '';
      for (var i = 0; i < 6; i++) sw += '<path d="M' + (40 + i * 44) + ',250 C' + (70 + i * 30) + ',330 ' + (120 + i * 12) + ',380 150,450" fill="none" stroke="' + mix(c, '#fff3c4', .6) + '" stroke-opacity=".35" stroke-width="5"/>';
      return defs(id, c) + body(id, v, c, sw);
    },
    ewer: function (id) {
      var c = '#2f5fd0', v = vessel([[0, .2], [.04, .15], [.3, .1], [.42, .2], [.6, .46], [.78, .52], [.9, .4], [.97, .22], [1, .24]], 60, 470, 130);
      var handle = '<path d="M' + (150 + .14 * 130) + ',95 C285,110 290,260 ' + (150 + .48 * 130) + ',300" fill="none" stroke="' + hexA(mix(c, '#ffffff', .3), .55) + '" stroke-width="11" stroke-linecap="round"/>';
      var cut = '';
      for (var i = 0; i < 5; i++) cut += '<circle cx="' + (95 + i * 27) + '" cy="360" r="11" fill="none" stroke="' + mix(c, '#ffffff', .7) + '" stroke-opacity=".4" stroke-width="2"/>';
      return defs(id, c) + '<g class="sway">' + handle + '</g>' + body(id, v, c, cut);
    },
    spiral: function (id) {
      var c = '#e3a54a', pts = [];
      for (var t = 0; t <= 4.6 * Math.PI; t += 0.12) { var r = 8 * Math.exp(0.2 * t); pts.push([150 + Math.cos(t) * r, 250 + Math.sin(t) * r * 0.92]); }
      var d = 'M' + pts[0][0].toFixed(1) + ',' + pts[0][1].toFixed(1) + smooth(pts);
      return defs(id, c) + '<ellipse cx="150" cy="430" rx="110" ry="12" fill="url(#g' + id + ')"/>' +
        '<g class="sway"><ellipse cx="150" cy="250" rx="120" ry="130" fill="url(#ig' + id + ')" opacity=".55"/><path d="' + d + '" fill="none" stroke="' + hexA(mix(c, '#000000', .45), .9) + '" stroke-width="30" stroke-linecap="round"/>' +
        '<path d="' + d + '" fill="none" stroke="' + hexA(c, .8) + '" stroke-width="22" stroke-linecap="round"/>' +
        '<path d="' + d + '" fill="none" stroke="' + mix(c, '#ffffff', .75) + '" stroke-opacity=".75" stroke-width="3" stroke-linecap="round" transform="translate(-4,-5)"/>' +
        '<rect x="104" y="372" width="92" height="56" rx="6" fill="' + hexA(mix(c, '#000000', .55), .85) + '" stroke="rgba(255,255,255,.3)"/></g>';
    },
    panel: function (id) {
      // a small leaded panel: sky, sail, hull and waves
      var L = '#111', g = '';
      var poly = function (p, f) { g += '<polygon points="' + p + '" fill="' + f + '"/>'; };
      poly('50,60 250,60 250,200 50,200', '#9cc7dc'); poly('50,60 150,60 50,140', '#7fb2cf'); poly('250,60 190,60 250,130', '#b9d8e4');
      poly('150,90 150,250 95,250', '#f1e6c8'); poly('158,110 158,250 210,250', '#e3a94a');
      poly('80,255 225,255 205,290 100,290', '#8c2a1e');
      poly('50,200 95,200 95,250 50,250', '#7fb2cf'); poly('210,200 250,200 250,255 210,255', '#9cc7dc');
      poly('50,290 250,290 250,330 50,330', '#2d6f9a'); poly('50,330 250,330 250,380 50,380', '#1f5579'); poly('50,380 250,380 250,440 50,440', '#1a7a66');
      var leads = 'M50,60 L250,60 L250,440 L50,440 Z M150,60 L50,140 M190,60 L250,130 M150,90 L150,250 L95,250 Z M158,110 L158,250 L210,250 Z M80,255 L225,255 L205,290 L100,290 Z M50,200 L95,200 M210,200 L250,200 M50,290 L250,290 M50,330 L250,330 M50,380 L250,380 M100,290 C120,305 140,275 160,290 C180,305 200,275 250,300';
      return defs(id, '#2d6f9a') + '<ellipse cx="150" cy="452" rx="120" ry="10" fill="url(#g' + id + ')"/>' +
        '<g class="sway"><ellipse cx="150" cy="250" rx="170" ry="220" fill="url(#ig' + id + ')" opacity=".45"/><clipPath id="c' + id + '"><rect x="50" y="60" width="200" height="380"/></clipPath><g opacity=".92">' + g + '</g>' +
        '<g clip-path="url(#c' + id + ')"><rect class="sweep" x="-60" y="0" width="70" height="520" fill="url(#s' + id + ')" transform="skewX(-12)"/></g>' +
        '<path d="' + leads + '" fill="none" stroke="' + L + '" stroke-width="5" stroke-linejoin="round"/>' +
        '<path d="' + leads + '" fill="none" stroke="rgba(255,240,220,.22)" stroke-width="1" transform="translate(-1.2,-1.2)"/>' +
        '<rect x="44" y="54" width="212" height="392" fill="none" stroke="#3a2c1c" stroke-width="8"/></g>';
    }
  };
  function plinth(id) {
    return '<g class="plinth"><polygon points="58,478 242,478 262,494 38,494" fill="url(#pt' + id + ')"/>' +
      '<rect x="38" y="494" width="224" height="62" fill="url(#pf' + id + ')"/>' +
      '<polygon points="58,478 242,478 262,494 38,494" fill="url(#pl' + id + ')"/>' +
      '<path d="M38,494 H262" stroke="rgba(236,210,154,.35)" stroke-width="1"/>' +
      '<path d="M58,478 H242" stroke="rgba(255,255,255,.12)" stroke-width="1"/></g>';
  }
  var DROP = { vase: 8, bowl: 28, ewer: 8, spiral: 50, panel: 32 };
  window.drawSilhouettes = function () {
    Array.prototype.forEach.call(document.querySelectorAll('.piece.sil'), function (fig, i) {
      var f = DRAW[fig.getAttribute('data-sil')]; if (!f) return;
      var frame = fig.querySelector('.frame');
      var kind = fig.getAttribute('data-sil'), id = 'p' + i, inner = f(id), defsEnd = inner.indexOf('</defs>') + 7;
      frame.innerHTML = '<svg viewBox="0 0 300 560" xmlns="' + NS + '" aria-hidden="true" focusable="false">' + inner.slice(0, defsEnd) + plinth(id) +
        '<g transform="translate(0 ' + (DROP[kind] || 0) + ')">' + inner.slice(defsEnd) + '</g>' +
        '<path d="M0,40 L300,-60 L300,-20 L0,80 Z" fill="rgba(255,255,255,.035)"/></svg>';
    });
  };
})();
