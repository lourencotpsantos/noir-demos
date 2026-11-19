/* Abysub concept · "Lo que verás aquí": species reveal along a depth rail */
(function () {
  "use strict";
  function init() {
  var col = document.getElementById("spCol"); if (!col) return;
  var items = Array.prototype.slice.call(col.querySelectorAll(".sp"));
  var fill = document.getElementById("spFill"), dot = document.getElementById("spDot");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !("IntersectionObserver" in window)) { items.forEach(function (i) { i.classList.add("in"); }); return; }

  col.classList.add("sp-anim");
  var io = new IntersectionObserver(function (en) {
    en.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add("in"); io.unobserve(x.target); } });
  }, { rootMargin: "0px 0px -18% 0px" });
  items.forEach(function (i) { io.observe(i); });

  var visible = false, queued = false, top = 0, h = 1;
  function measure() { var r = col.getBoundingClientRect(); top = r.top + window.scrollY; h = col.offsetHeight; }
  function frame() {
    queued = false;
    var mid = window.scrollY + window.innerHeight * 0.55;
    var p = Math.min(1, Math.max(0, (mid - top) / h));
    fill.style.transform = "scaleY(" + p.toFixed(4) + ")";
    dot.style.transform = "translate3d(0," + (p * h).toFixed(1) + "px,0)";
  }
  function req() { if (visible && !queued) { queued = true; requestAnimationFrame(frame); } }
  new IntersectionObserver(function (en) { visible = en[0].isIntersecting; if (visible) { measure(); req(); } }).observe(col);
  window.addEventListener("scroll", req, { passive: true });
  window.addEventListener("resize", function () { measure(); req(); });
  measure(); frame();
  }
  /* build only when the section comes within ~1.5 screens */
  var host = document.getElementById("fauna");
  if (!host || !("IntersectionObserver" in window)) { init(); return; }
  var io = new IntersectionObserver(function (en) { if (en[0].isIntersecting) { io.disconnect(); init(); } }, { rootMargin: "150% 0px" });
  io.observe(host);
})();
