/* Abysub concept · "Tu primer día": scroll-pinned five-step story (one rAF per scroll, only while on screen) */
(function () {
  "use strict";
  if (!document.documentElement.classList.contains("js-descent")) return;  /* same gate: motion allowed */
  var sec = document.getElementById("primer-dia"); if (!sec) return;
  sec.classList.add("pinned");
  var imgs = Array.prototype.slice.call(sec.querySelectorAll(".day-img"));
  var steps = Array.prototype.slice.call(sec.querySelectorAll(".day-step"));
  var dots = Array.prototype.slice.call(sec.querySelectorAll(".day-progress span"));
  var N = steps.length, visible = false, queued = false, top = 0, span = 1, cur = -1;

  function measure() { top = sec.getBoundingClientRect().top + window.scrollY; span = Math.max(1, sec.offsetHeight - window.innerHeight); }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function frame() {
    queued = false;
    var p = clamp((window.scrollY - top) / span, 0, 1) * N;
    for (var i = 0; i < N; i++) {
      var d = p - (i + 0.5);                       /* -0.5..0.5 inside step i */
      var a = i === 0 && d < 0 ? 1 : i === N - 1 && d > 0 ? 1 : clamp((0.62 - Math.abs(d)) / 0.18, 0, 1);
      var ta = i === 0 && d < 0 ? 1 : i === N - 1 && d > 0 ? 1 : clamp((0.42 - Math.abs(d)) / 0.12, 0, 1);
      imgs[i].style.opacity = a.toFixed(3);
      imgs[i].style.transform = "scale(" + (1.1 - 0.1 * clamp(d + 0.5, 0, 1)).toFixed(4) + ")";
      steps[i].style.opacity = ta.toFixed(3);
      steps[i].style.transform = "translate3d(0," + (-clamp(d, -1, 1) * 60).toFixed(1) + "px,0)";
      steps[i].classList.toggle("on", ta > 0.6);
    }
    var c = clamp(Math.floor(p), 0, N - 1);
    if (c !== cur) { cur = c; dots.forEach(function (el, k) { el.classList.toggle("on", k <= c); }); }
  }
  function req() { if (visible && !queued) { queued = true; requestAnimationFrame(frame); } }
  new IntersectionObserver(function (en) { visible = en[0].isIntersecting; if (visible) { measure(); req(); } }, { rootMargin: "100px 0px" }).observe(sec);
  window.addEventListener("scroll", req, { passive: true });
  window.addEventListener("resize", function () { measure(); req(); });
})();
