/* Abysub concept · hero caustics: half-resolution WebGL light ripples, ~30 fps, paused off-screen and in hidden tabs */
(function () {
  "use strict";
  var cv = document.getElementById("heroFx"); if (!cv || /nofx/.test(location.search)) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  function fallback() { document.querySelector(".hero").classList.add("css-light"); }
  function init() {
    var gl = cv.getContext("webgl", { alpha: true, premultipliedAlpha: true, antialias: false, depth: false, stencil: false, powerPreference: "low-power" });
    if (!gl) return fallback();
    /* software GL (no GPU) would burn the CPU: use the CSS light layer instead */
    var dbg = gl.getExtension("WEBGL_debug_renderer_info");
    var ren = dbg ? String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL)) : "";
    if (/swiftshader|llvmpipe|software|basic render/i.test(ren)) { var lose = gl.getExtension("WEBGL_lose_context"); if (lose) lose.loseContext(); return fallback(); }
    var vs = "attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}";
    /* tileable water caustic (sum of rotated sine cells), light strongest near the surface (top) */
    var fs = [
      "precision mediump float;",
      "uniform vec2 r;uniform float t;",
      "void main(){",
      " vec2 uv=gl_FragCoord.xy/r.y*2.2;",
      " vec2 p=mod(uv*6.2831,6.2831)-250.;",
      " vec2 i=p;float c=1.;float tt=t*.45;",
      " for(int n=0;n<4;n++){",
      "  float k=tt*(1.-(3.5/float(n+1)));",
      "  i=p+vec2(cos(k-i.x)+sin(k+i.y),sin(k-i.y)+cos(k+i.x));",
      "  c+=1./length(vec2(p.x/(sin(i.x+k)/.005),p.y/(cos(i.y+k)/.005)));",
      " }",
      " c/=4.;c=1.17-pow(c,1.4);",
      " float l=pow(abs(c),8.);",
      " float y=gl_FragCoord.y/r.y;",
      " float a=clamp(l,0.,1.)*(.18+.5*y*y);",
      " gl_FragColor=vec4(vec3(.78,.98,1.)*a,a);",
      "}"].join("\n");
    function sh(type, src) { var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null; }
    var v = sh(gl.VERTEX_SHADER, vs), f = sh(gl.FRAGMENT_SHADER, fs);
    if (!v || !f) return;
    var pr = gl.createProgram(); gl.attachShader(pr, v); gl.attachShader(pr, f); gl.linkProgram(pr);
    var par = gl.getExtension("KHR_parallel_shader_compile");
    /* with parallel compile, wait for the driver off the main thread before touching the program */
    (function ready() {
      if (par && !gl.getProgramParameter(pr, par.COMPLETION_STATUS_KHR)) { setTimeout(ready, 50); return; }
      if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) return;
      go();
    })();
    function go() {
    gl.useProgram(pr);
    var buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    var loc = gl.getAttribLocation(pr, "p"); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    var uR = gl.getUniformLocation(pr, "r"), uT = gl.getUniformLocation(pr, "t");

    var SCALE = 0.5, visible = true, raf = 0, last = 0, t0 = performance.now();
    function size() {
      var w = Math.max(1, Math.round(cv.clientWidth * SCALE)), h = Math.max(1, Math.round(cv.clientHeight * SCALE));
      if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h; gl.viewport(0, 0, w, h); gl.uniform2f(uR, w, h); }
    }
    function draw(now) {
      raf = 0;
      if (!visible || document.hidden) return;
      raf = requestAnimationFrame(draw);
      if (now - last < 33) return;   /* ~30 fps is plenty for slow light */
      last = now;
      gl.uniform1f(uT, (now - t0) / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
    function start() { if (!raf && visible && !document.hidden) raf = requestAnimationFrame(draw); }
    size();
    cv.classList.add("on");
    new IntersectionObserver(function (en) { visible = en[0].isIntersecting; document.querySelector(".hero").classList.toggle("off", !visible); start(); }).observe(cv);
    document.addEventListener("visibilitychange", start);
    window.addEventListener("resize", function () { size(); });
    start();
    }
  }
  /* start after the page has settled: first interaction, or 2.5 s after load */
  var started = false, idle = window.requestIdleCallback || function (cb) { return setTimeout(cb, 1); };
  function kick() { if (started) return; started = true; ["pointerdown", "touchstart", "keydown", "wheel"].forEach(function (e) { removeEventListener(e, kick); }); idle(init, { timeout: 1000 }); }
  ["pointerdown", "touchstart", "keydown", "wheel"].forEach(function (e) { addEventListener(e, kick, { passive: true }); });
  function later() { setTimeout(kick, 2500); }
  if (document.readyState === "complete") later(); else addEventListener("load", later);
})();
