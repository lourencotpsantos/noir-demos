/* Abysub concept · scroll-driven descent: one rAF per scroll event, only while the section is on screen */
(function () {
  "use strict";
  if (!document.documentElement.classList.contains("js-descent")) return;
  var sec = document.getElementById("descenso");
  var layers = Array.prototype.slice.call(sec.querySelectorAll(".d-layer"));
  var bands = Array.prototype.slice.call(sec.querySelectorAll(".band"));
  var dark = sec.querySelector(".d-dark");
  var num = document.getElementById("gaugeNum"), fill = document.getElementById("gaugeFill"), dot = document.getElementById("gaugeDot");
  var track = sec.querySelector(".gauge-track");
  var C = [0.05, 0.28, 0.5, 0.72, 0.95];          /* band centres in scroll progress */
  var D = [0, 6, 15, 18, 30];                      /* depth at each centre (m) */
  var tint = sec.querySelector(".d-tint"), specs = Array.prototype.slice.call(sec.querySelectorAll(".spec li"));
  var airNum = document.getElementById("airNum"), airFill = document.getElementById("airFill"), note = document.getElementById("specNote");
  var SPEC = [[0, 5, .06], [3, 15, .06], [10, 25, .08], [20, 32, .4], [0, 1, 1]];
  var NOTES = { es: ["El agua absorbe primero el rojo", "Sin rojo: ahora se apaga el naranja", "El amarillo es el siguiente en irse", "Azul y verde: el color de la profundidad"], en: ["Water absorbs red first", "Red is gone: orange fades next", "Yellow is the next to go", "Blue and green: the colour of depth"] };
  var lastNote = -1, lastAir = -1;
  var visible = false, queued = false, top = 0, span = 1, trackH = 1, lastTxt = "";

  function measure() {
    var r = sec.getBoundingClientRect();
    top = r.top + window.scrollY;
    span = Math.max(1, sec.offsetHeight - window.innerHeight);
    trackH = track.offsetHeight;
  }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function depthAt(p) {
    if (p <= C[0]) return 0;
    for (var i = 1; i < C.length; i++) if (p <= C[i]) return D[i - 1] + (D[i] - D[i - 1]) * (p - C[i - 1]) / (C[i] - C[i - 1]);
    return D[D.length - 1];
  }
  function frame() {
    queued = false;
    var p = clamp((window.scrollY - top) / span, 0, 1);
    var depth = depthAt(p);
    var txt = depth.toFixed(1).replace(".", document.documentElement.lang === "en" ? "." : ",");
    if (txt !== lastTxt) { num.textContent = txt; lastTxt = txt; }
    var f = depth / 30;
    fill.style.transform = "scaleY(" + f.toFixed(4) + ")";
    dot.style.transform = "translate3d(0," + (f * trackH).toFixed(1) + "px,0)";
    dark.style.opacity = (f * 0.62).toFixed(3);
    tint.style.opacity = Math.min(1, depth / 16).toFixed(3);
    for (var k = 0; k < 5; k++) {
      var sp = SPEC[k], o = k === 4 ? 1 : 1 - (1 - sp[2]) * clamp((depth - sp[0]) / (sp[1] - sp[0]), 0, 1);
      specs[k].style.opacity = o.toFixed(3);
    }
    var air = Math.round(200 - depth * 1.7);
    if (air !== lastAir) { lastAir = air; airNum.textContent = air; }
    airFill.style.transform = "scaleX(" + (air / 200).toFixed(4) + ")";
    var ni = depth < 5 ? 0 : depth < 14 ? 1 : depth < 24 ? 2 : 3;
    var L = document.documentElement.lang === "en" ? "en" : "es";
    if (ni !== lastNote || note.dataset.l !== L) { lastNote = ni; note.dataset.l = L; note.textContent = NOTES[L][ni]; }
    for (var i = 0; i < C.length; i++) {
      var d = p - C[i];
      var lo, to;
      if ((i === 0 && d < 0) || (i === C.length - 1 && d > 0)) { lo = 1; to = 1; d = 0; }
      else { lo = clamp((0.17 - Math.abs(d)) / 0.07, 0, 1); to = clamp((0.102 - Math.abs(d)) / 0.03, 0, 1); }
      var L = layers[i], B = bands[i];
      L.style.opacity = lo.toFixed(3);
      L.style.transform = "scale(" + (1.08 - 0.08 * clamp(0.5 + d / 0.34, 0, 1)).toFixed(4) + ")";
      B.style.opacity = to.toFixed(3);
      B.style.transform = "translate3d(0," + (-d * 260).toFixed(1) + "px,0)";
      B.classList.toggle("on", to > 0.6);
    }
  }
  function req() { if (visible && !queued) { queued = true; requestAnimationFrame(frame); } }

  new IntersectionObserver(function (en) {
    visible = en[0].isIntersecting;
    sec.classList.toggle("live", visible);
    if (visible) { measure(); req(); }
  }, { rootMargin: "100px 0px" }).observe(sec);
  window.addEventListener("scroll", req, { passive: true });
  window.addEventListener("resize", function () { measure(); req(); });
  window.ABY && window.ABY.onLang(function () { lastTxt = ""; lastNote = -1; req(); });
  measure(); frame();
})();
