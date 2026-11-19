/* Technical side-view drawings of the four rental bike types.
   Every tube is computed from a frame geometry (mm, bottom bracket at the origin, y down),
   so joints meet exactly: top tube and stays end on the seat-tube axis, stays end on the
   rear hub, the fork follows the steering axis plus offset. Scaled into a 600 x 380 viewBox. */
(function () {
  "use strict";
  var S = 0.3, GROUND = 336, RAD = Math.PI / 180;

  var GEO = {
    defy: { type: "road", r: 340, tw: 28, cs: 415, drop: 72, sta: 73.5, st: 520, ttj: 505, ssj: 488, stack: 585, reach: 380, hta: 72, ht: 165, off: 50, sh: 715, spacer: 25, stemL: 100, stemA: 8, ring: 100, cog: 46, rotor: 70, bar: "drop" },
    roam: { type: "hybrid", r: 345, tw: 42, cs: 450, drop: 62, sta: 73, st: 455, ttj: 430, ssj: 412, stack: 625, reach: 395, hta: 70, ht: 160, off: 48, sh: 690, spacer: 30, stemL: 80, stemA: 22, ring: 88, cog: 52, rotor: 80, bar: "flat", susp: true },
    argento: { type: "city", r: 345, tw: 44, cs: 460, drop: 60, sta: 70, st: 470, ssj: 420, stack: 640, reach: 365, hta: 69, ht: 175, off: 50, sh: 700, spacer: 40, stemL: 70, stemA: 45, ring: 80, cog: 44, rotor: 0, bar: "swept", susp: true },
    talon: { type: "mtb", r: 372, tw: 58, cs: 435, drop: 58, sta: 73.5, st: 430, ttj: 380, ssj: 362, stack: 625, reach: 425, hta: 68.5, ht: 110, off: 51, sh: 700, spacer: 20, stemL: 70, stemA: 6, ring: 72, cog: 64, rotor: 80, bar: "riser", susp: true, knobs: true }
  };

  function f(n) { return (Math.round(n * 10) / 10).toString(); }

  function build(key, deg) {
    var g = GEO[key];
    var th = (deg || 0) * RAD, cs = Math.cos(th), sn = Math.sin(th), flat = !deg, ac = Math.abs(cs);
    var rearX = -Math.sqrt(g.cs * g.cs - g.drop * g.drop);
    var axY = -g.drop;
    // steering axis
    var ha = g.hta * RAD, d = [Math.cos(ha), Math.sin(ha)], n = [Math.sin(ha), -Math.cos(ha)];
    var T = [g.reach, -g.stack];
    var B = [T[0] + d[0] * g.ht, T[1] + d[1] * g.ht];
    var t = (axY - B[1] + g.off * Math.cos(ha)) / Math.sin(ha);
    var F = [B[0] + d[0] * t + n[0] * g.off, axY];
    // seat axis
    var sa = g.sta * RAD, u = [-Math.cos(sa), -Math.sin(sa)];
    var on = function (len) { return [u[0] * len, u[1] * len]; };
    var R = [rearX, axY], BB = [0, 0];

    // centre the bike horizontally in the 600-wide box
    var left = rearX - g.r, right = F[0] + g.r;
    var cxm = (left + right) / 2;
    var oy = GROUND - g.r * S - axY * S;
    var X = function (p) { return 300 + ((p[0] - cxm) * cs + (p[2] || 0) * sn) * S; };
    var Y = function (p) { return oy + p[1] * S; };
    var pt = function (p) { return f(X(p)) + " " + f(Y(p)); };
    var add = function (a, b, k) { return [a[0] + b[0] * k, a[1] + b[1] * k]; };

    var out = [];
    var path = function (dd, cls, sw) { out.push('<path pathLength="1" class="draw ' + (cls || "") + '"' + (sw ? ' style="stroke-width:' + sw + '"' : "") + ' d="' + dd + '"/>'); };
    var line = function (a, b, cls, sw) { path("M" + pt(a) + " L" + pt(b), cls, sw); };
    var ell = function (c, r, cls, sw, draw) { return (flat ? '<circle r="' + f(r * S) + '"' : '<ellipse rx="' + f(r * S * ac) + '" ry="' + f(r * S) + '"') + (draw ? ' pathLength="1"' : "") + ' class="' + (draw ? "draw " : "") + (cls || "") + '"' + (sw ? ' style="stroke-width:' + sw + '"' : "") + ' cx="' + f(X(c)) + '" cy="' + f(Y(c)) + '"/>'; };
    var circ = function (c, r, cls, sw) { out.push(ell(c, r, cls, sw, true)); };
    var z3 = function (p2, z) { return [p2[0], p2[1], z]; };
    var raw = function (s) { out.push(s); };

    /* ---- construction lines (engineering drawing) ---- */
    var gy = f(GROUND);
    if (flat) {
    raw('<g class="cl">');
    raw('<line x1="' + f(X(R) - g.r * S - 14) + '" y1="' + f(Y(R)) + '" x2="' + f(X(F) + g.r * S + 14) + '" y2="' + f(Y(F)) + '"/>');
    var sTop = add(T, d, -260), sBot = add(B, d, t + 40);
    raw('<line x1="' + f(X(sTop)) + '" y1="' + f(Y(sTop)) + '" x2="' + f(X(sBot)) + '" y2="' + f(Math.min(Y(sBot), GROUND)) + '"/>');
    var seatTop = on(g.sh + 120);
    raw('<line x1="' + f(X(BB)) + '" y1="' + f(Y(BB)) + '" x2="' + f(X(seatTop)) + '" y2="' + f(Y(seatTop)) + '"/>');
    [R, F, BB].forEach(function (c) {
      raw('<line x1="' + f(X(c) - 9) + '" y1="' + f(Y(c)) + '" x2="' + f(X(c) + 9) + '" y2="' + f(Y(c)) + '"/><line x1="' + f(X(c)) + '" y1="' + f(Y(c) - 9) + '" x2="' + f(X(c)) + '" y2="' + f(Y(c) + 9) + '"/>');
    });
    raw("</g>");
    // wheelbase dimension
    var dy = GROUND + 22;
    raw('<g class="dimg"><line x1="' + f(X(R)) + '" y1="' + f(Y(R) + 14) + '" x2="' + f(X(R)) + '" y2="' + f(dy + 6) + '"/><line x1="' + f(X(F)) + '" y1="' + f(Y(F) + 14) + '" x2="' + f(X(F)) + '" y2="' + f(dy + 6) + '"/>' +
      '<line x1="' + f(X(R)) + '" y1="' + f(dy) + '" x2="' + f(X(F)) + '" y2="' + f(dy) + '"/>' +
      '<path class="arr" d="M' + f(X(R)) + " " + f(dy) + " l8 -3.5 v7 z M" + f(X(F)) + " " + f(dy) + ' l-8 -3.5 v7 z"/>' +
      '<text x="' + f((X(R) + X(F)) / 2) + '" y="' + f(dy - 5) + '" text-anchor="middle"><tspan class="l-es">BATALLA</tspan><tspan class="l-en">WHEELBASE</tspan></text></g>');
    // head angle arc
    var arcR = 34, hb = [X(B), Y(B)];
    var a0 = 180 * RAD, a1 = (180 + g.hta) * RAD; // from horizontal (pointing back) up to the steering axis
    raw('<g class="dimg"><line x1="' + f(hb[0] - arcR - 10) + '" y1="' + f(hb[1]) + '" x2="' + f(hb[0] + 6) + '" y2="' + f(hb[1]) + '"/><path d="M' + f(hb[0] + arcR * Math.cos(a0)) + " " + f(hb[1] + arcR * Math.sin(a0)) + " A" + arcR + " " + arcR + " 0 0 1 " + f(hb[0] + arcR * Math.cos(a1)) + " " + f(hb[1] + arcR * Math.sin(a1)) + '"/></g>');
    }

    /* ---- wheels ---- */
    function wheel(c, front) {
      out.push(ell(c, g.r - g.tw / 2, "tyrefill", f(g.tw * S)));
      circ(c, g.r, "tyre", 2.4);
      circ(c, g.r - g.tw, "", 1.4);
      if (g.knobs) out.push(ell(c, g.r + 4, "knob"));
      var rim = g.r - g.tw - 4;
      circ(c, rim, "thin");
      circ(c, rim - 18, "thin");
      // tangent-laced spokes
      var hubR = 22, nSp = 24, sp = "";
      for (var i = 0; i < nSp; i++) {
        var a = i / nSp * 2 * Math.PI, dir = i % 2 ? 1 : -1;
        var h = [c[0] + hubR * Math.cos(a), c[1] + hubR * Math.sin(a)];
        var e = [c[0] + (rim - 18) * Math.cos(a + dir * 0.36), c[1] + (rim - 18) * Math.sin(a + dir * 0.36)];
        sp += "M" + pt(h) + "L" + pt(e);
      }
      out.push('<path class="spk" d="' + sp + '"/>');
      circ(c, 30, "", 1.6);
      out.push('<circle class="fillc" cx="' + f(X(c)) + '" cy="' + f(Y(c)) + '" r="2.6"/>');
      if (g.rotor) circ(z3(c, -40), g.rotor, "acc thinacc" + (flat ? "" : " far"));
      if (!flat) line(z3(c, -62), z3(c, 62), "", 2.2);
      return front;
    }
    var crown0 = [B[0] + d[0] * 22, B[1] + d[1] * 22];
    if (!flat) {
      var ssj0 = on(g.ssj);
      line(z3(ssj0, -14), z3(R, -62), "far", 2);
      line([0, 0, -34], z3(R, -62), "far", 2.4);
      if (g.susp) line(z3(add(F, d, -(g.type === "city" ? 190 : 240)), -50), z3(F, -50), "acc far", 5);
      else line(z3(crown0, -44), z3(F, -50), "far", 2.8);
      var caF = 242 * RAD, pdF = [Math.cos(caF) * 170, Math.sin(caF) * 170, -78];
      line([0, 0, -78], pdF, "far", 3.6);
      line([pdF[0], pdF[1], -78], [pdF[0], pdF[1], -150], "far", 3.2);
    }
    wheel(R); wheel(F, true);

    /* ---- fenders, rack, guard (city) ---- */
    if (g.type === "city") {
      var fr = g.r + 22;
      var arcP = function (c, b0, b1) { var e0 = [c[0] + fr * Math.cos(b0 * RAD), c[1] + fr * Math.sin(b0 * RAD)], e1 = [c[0] + fr * Math.cos(b1 * RAD), c[1] + fr * Math.sin(b1 * RAD)]; return "M" + pt(e0) + " A" + f(fr * S * ac) + " " + f(fr * S) + " 0 0 1 " + pt(e1); };
      path(arcP(R, 165, 318), "", 2.2);
      path(arcP(F, 205, 345), "", 2.2);
      // rack: deck above the rear wheel, struts to the dropout and to the seat stays
      var deckY = axY - g.r - 50;
      var dA = [rearX - 150, deckY], dB = [rearX + 170, deckY];
      line(dA, dB, "", 2.4);
      line([rearX - 110, deckY], [rearX + 8, axY - 10], "thin");
      line([rearX + 40, deckY], [rearX + 8, axY - 10], "thin");
      var ssPoint = on(g.ssj - 70);
      line(dB, [ssPoint[0] * 0.55 + rearX * 0.45, ssPoint[1] * 0.55 + axY * 0.45], "thin");
    }

    /* ---- frame ---- */
    var stTop = on(g.st), ssj = on(g.ssj), post = on(g.sh), lowPt = [120, -150];
    var dtFront = add(B, d, -28), ttFront = add(T, d, 16);
    if (g.type === "city") {
      // step-through: low curved main tube plus a second lower-curved tube to the seat tube
      var low = on(250);
      path("M" + pt(dtFront) + " C" + pt([dtFront[0] - 60, dtFront[1] + 210]) + " " + pt([150, -40]) + " " + pt(BB), "", 3.4);
      var q0 = dtFront, q1 = [dtFront[0] - 60, dtFront[1] + 210], q2 = [150, -40], q3 = BB, tt = 0.5, mt = 1 - tt;
      lowPt = [mt*mt*mt*q0[0] + 3*mt*mt*tt*q1[0] + 3*mt*tt*tt*q2[0] + tt*tt*tt*q3[0], mt*mt*mt*q0[1] + 3*mt*mt*tt*q1[1] + 3*mt*tt*tt*q2[1] + tt*tt*tt*q3[1]];
      var t2 = add(T, d, 52);
      path("M" + pt(t2) + " C" + pt([t2[0] - 90, t2[1] + 190]) + " " + pt([low[0] + 160, low[1] + 10]) + " " + pt(low), "", 2.8);
    } else {
      line(ttFront, on(g.ttj), "", g.type === "mtb" ? 3.4 : 3);
      line(BB, dtFront, "", g.type === "mtb" ? 4.2 : 3.4);
    }
    line(BB, stTop, "", 3);
    line(flat ? ssj : z3(ssj, 14), flat ? R : z3(R, 62), "", 2.2);
    line(flat ? BB : [0, 0, 34], flat ? R : z3(R, 62), "", 2.6);
    line(T, B, "", 4.2); // head tube
    // dropout
    out.push('<circle class="fillc dropout" cx="' + f(X(R)) + '" cy="' + f(Y(R)) + '" r="4.5"/>');

    /* ---- fork ---- */
    var crown = add(B, d, 22);
    if (g.susp) {
      var lowerTop = add(F, d, -(g.type === "city" ? 190 : 240));
      var stanchBot = add(F, d, -(g.type === "city" ? 120 : 150));
      line(B, crown, "", 4);
      line(add(crown, n, g.off), stanchBot, "", 3);
      line(add(crown, n, -8), add(crown, n, g.off + 10), "", 5);
      line(flat ? lowerTop : z3(lowerTop, 50), flat ? F : z3(F, 50), "acc", 6);
    } else {
      // rigid tapered blade with a forward curve to the dropout
      var mid = add(add(B, d, t * 0.55), n, g.off * 0.25);
      path("M" + pt(B) + " L" + pt(crown) + " Q" + pt(flat ? mid : z3(mid, 40)) + " " + pt(flat ? F : z3(F, 50)), "", 3.2);
    }

    /* ---- seatpost + saddle ---- */
    line(stTop, post, "", 2.4);
    var sad = g.type === "city"
      ? [[-140, -20], [-138, -62], [-40, -60], [40, -46], [128, -40], [148, -30], [140, -12], [-120, -10]]
      : [[-130, -12], [-128, -40], [-60, -38], [60, -30], [150, -28], [160, -20], [140, -10], [-110, -6]];
    var sp2 = function (q) { return [post[0] + q[0], post[1] + q[1]]; };
    path("M" + pt(sp2(sad[0])) + " C" + pt(sp2(sad[1])) + " " + pt(sp2(sad[2])) + " " + pt(sp2([0, -36])) + " L" + pt(sp2(sad[3])) + " Q" + pt(sp2(sad[4])) + " " + pt(sp2(sad[5])) + " Q" + pt(sp2([162, -12])) + " " + pt(sp2(sad[6])) + " L" + pt(sp2(sad[7])) + " Q" + pt(sp2([-132, -4])) + " " + pt(sp2(sad[0])) + " Z", "saddle", 2.2);
    line(post, sp2([0, g.type === "city" ? -10 : -8]), "", 3);
    if (g.type === "city") { line(sp2([-60, -10]), sp2([-40, 18]), "thin"); line(sp2([40, -12]), sp2([20, 18]), "thin"); }

    /* ---- steerer, stem, bar ---- */
    var stTopS = add(T, d, -g.spacer);
    line(T, stTopS, "", 3.2);
    var sa2 = g.stemA * RAD;
    var barC = [stTopS[0] + Math.cos(sa2) * g.stemL, stTopS[1] - Math.sin(sa2) * g.stemL];
    line(stTopS, barC, "", 3.2);
    var anchors = { bar: barC, saddle: sp2([0, -36]), fork: add(F, d, -140), tyre: [F[0] + g.r * Math.cos(-25 * RAD), axY + g.r * Math.sin(-25 * RAD)], tyreLow: [F[0] + g.r * Math.cos(30 * RAD), axY + g.r * Math.sin(30 * RAD)], rotor: [rearX + g.rotor * 0.7, axY - g.rotor * 0.7], low: lowPt, seat: on(g.sh * 0.6), rack: [rearX, axY - g.r - 50] };
    var bc = function (q) { return [barC[0] + q[0], barC[1] + q[1]]; };
    var bw = { drop: 420, flat: 620, riser: 740, swept: 580 }[g.bar] / 2;
    if (!flat) {
      line(z3(barC, -bw), z3(barC, bw), "acc", 3);
      [-1, 1].forEach(function (sd) {
        var zc = sd * bw, cl = sd < 0 ? "acc far" : "acc";
        if (g.bar === "drop") path("M" + pt(z3(barC, zc)) + " C" + pt(z3(bc([60, -4]), zc)) + " " + pt(z3(bc([92, 14]), zc)) + " " + pt(z3(bc([88, 60]), zc)) + " C" + pt(z3(bc([84, 112]), zc)) + " " + pt(z3(bc([50, 128]), zc)) + " " + pt(z3(bc([10, 118]), zc)), cl, 2.8);
        else if (g.bar === "swept") path("M" + pt(z3(barC, zc * 0.4)) + " C" + pt(z3(bc([-50, -30]), zc * 0.8)) + " " + pt(z3(bc([-150, -22]), zc)) + " " + pt(z3(bc([-185, 8]), zc)), cl, 3.4);
        else line(z3(barC, zc * 0.78), z3(bc([-14, 4]), zc), cl, 4.6);
      });
    } else if (g.bar === "drop") {
      path("M" + pt(barC) + " C" + pt(bc([60, -4])) + " " + pt(bc([92, 14])) + " " + pt(bc([88, 60])) + " C" + pt(bc([84, 112])) + " " + pt(bc([50, 128])) + " " + pt(bc([10, 118])), "acc", 2.8);
      path("M" + pt(bc([52, -6])) + " Q" + pt(bc([78, -22])) + " " + pt(bc([82, -6])) + " L" + pt(bc([78, 60])), "", 2.2); // hood + lever
      anchors.bar = bc([88, 60]);
    } else if (g.bar === "flat" || g.bar === "riser") {
      path("M" + pt(bc([-18, 6])) + " L" + pt(bc([-70, 12])), "acc", 4.2); // grip
      line(barC, bc([-18, 6]), "acc", 2.8);
      line(bc([-6, 2]), bc([30, 34]), "", 2); // brake lever
      anchors.bar = bc([-50, 10]);
    } else {
      path("M" + pt(barC) + " C" + pt(bc([-50, -30])) + " " + pt(bc([-150, -22])) + " " + pt(bc([-185, 8])), "acc", 2.8);
      path("M" + pt(bc([-150, -6])) + " L" + pt(bc([-198, 12])), "acc", 4.2);
      anchors.bar = bc([-120, -18]);
    }

    /* ---- drivetrain ---- */
    circ(z3(BB, flat ? 0 : 40), g.ring, "acc", 2);
    circ(z3(BB, flat ? 0 : 40), g.ring - 14, "thin");
    circ(z3(R, flat ? 0 : 40), g.cog, "thin");
    var der = [rearX + 18, axY + g.cog + 70];
    path("M" + pt([0, -g.ring]) + " L" + pt([rearX, axY - g.cog]) + " M" + pt([0, g.ring]) + " L" + pt(der) + " L" + pt([rearX + 6, axY + g.cog]), "chain");
    path("M" + pt([rearX + 4, axY + 10]) + " L" + pt([rearX + 30, axY + g.cog + 30]) + " L" + pt(der), "", 2);
    circ(der, 12, "thin");
    var ca = 62 * RAD, pd = [Math.cos(ca) * 170, Math.sin(ca) * 170, flat ? 0 : 78];
    line(flat ? BB : [0, 0, 78], pd, "", 4);
    if (flat) line([pd[0] - 45, pd[1]], [pd[0] + 45, pd[1]], "", 3.5);
    else line(pd, [pd[0], pd[1], 150], "", 3.5);
    out.push('<circle class="fillc" cx="' + f(X(BB)) + '" cy="' + f(Y(BB)) + '" r="4"/>');

    var A = function (p) { return [Math.round(X(p)), Math.round(Y(p))]; };
    return { svg: out.join(""), anchors: (function () { var o = {}; for (var k in anchors) o[k] = A(anchors[k]); return o; })(), ground: gy };
  }

  window.ABBikes = { build: build };
})();
