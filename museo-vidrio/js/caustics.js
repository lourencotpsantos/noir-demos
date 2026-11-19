/* Light through glass: a cheap caustics shader with chromatic dispersion.
   One instance per canvas. Renders at reduced resolution, runs only while the
   canvas is on screen and the tab is visible, draws a single still frame when
   the visitor prefers reduced motion. */
(function () {
  'use strict';
  var VS = 'attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}';
  var FS = [
    'precision mediump float;',
    'uniform vec2 R;uniform float T;uniform vec2 L;uniform vec3 A;uniform vec3 B;uniform float S;uniform float G;',
    'float cau(vec2 p,float t){',
    '  vec2 i=p;float c=1.;',
    '  for(int n=0;n<4;n++){',
    '    float k=t*(1.-(3.2/float(n+1)));',
    '    i=p+vec2(cos(k-i.x)+sin(k+i.y),sin(k-i.y)+cos(k+i.x));',
    '    c+=1./length(vec2(p.x/(sin(i.x+k)/.0055),p.y/(cos(i.y+k)/.0055)));',
    '  }',
    '  c/=4.;c=1.16-pow(c,1.38);',
    '  return pow(abs(c),7.5);',
    '}',
    'void main(){',
    '  vec2 uv=gl_FragCoord.xy/R;float as=R.x/R.y;',
    '  vec2 p=uv*vec2(as,1.)*S-240.;',
    '  float t=T*.42+23.;',
    '  float r=cau(p+vec2(.05,.02),t);',
    '  float g=cau(p,t);',
    '  float b=cau(p-vec2(.05,.02),t);',
    '  vec3 disp=vec3(r,g,b);',
    '  float lum=(r+g+b)*.3333;',
    '  vec2 d=(uv-L)*vec2(as,1.);',
    '  float fall=exp(-dot(d,d)*G);',
    '  vec3 tint=mix(B,A,clamp(lum*1.6,0.,1.));',
    '  vec3 o=(tint*lum*1.05+disp*.38*(A*.6+.4))*(.16+fall*1.15);',
    '  o+=B*.13*fall+A*.05*fall*fall;',
    '  o*=1.-.35*pow(length(uv-.5)*1.25,2.);',
    '  gl_FragColor=vec4(o,1.);',
    '}'
  ].join('\n');

  function hex(h) { var n = parseInt(h.slice(1), 16); return [(n >> 16 & 255) / 255, (n >> 8 & 255) / 255, (n & 255) / 255]; }

  function Caustics(canvas, opt) {
    opt = opt || {};
    var gl = null;
    try { gl = canvas.getContext('webgl', { antialias: false, alpha: false, depth: false, stencil: false, powerPreference: 'low-power', preserveDrawingBuffer: false }); } catch (e) { gl = null; }
    this.ok = !!gl;
    if (!gl) return;
    var self = this;
    function sh(type, src) { var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; }
    var pr = gl.createProgram();
    gl.attachShader(pr, sh(gl.VERTEX_SHADER, VS));
    gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FS));
    gl.linkProgram(pr);
    var U = {};
    self.ready = false;
    function finish() {
      if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) { self.ok = false; return; }
      gl.useProgram(pr);
      var buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      var loc = gl.getAttribLocation(pr, 'a');
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
      ['R', 'T', 'L', 'A', 'B', 'S', 'G'].forEach(function (k) { U[k] = gl.getUniformLocation(pr, k); });
      self.ready = true;
      self.size(); self.sync();
    }
    // compile off the main thread where the browser allows it (KHR_parallel_shader_compile)
    var par = gl.getExtension('KHR_parallel_shader_compile');
    function poll() { if (gl.getProgramParameter(pr, par.COMPLETION_STATUS_KHR)) finish(); else setTimeout(poll, 40); }

    this.gl = gl;
    this.reduced = !!opt.reduced;
    // software WebGL (no GPU): draw one still frame instead of animating
    try { var dbg = gl.getExtension('WEBGL_debug_renderer_info'); var ren = dbg ? gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER); if (/swiftshader|llvmpipe|softpipe|software|basic render/i.test(String(ren))) { this.reduced = true; this.soft = true; } } catch (e) {}
    this.scale = opt.scale || 5.2;
    this.spread = opt.spread || 1.6;
    this.palettes = (opt.palettes || [['#dff6ff', '#3a7fa8']]).map(function (p) { return [hex(p[0]), hex(p[1])]; });
    this.cur = [this.palettes[0][0].slice(), this.palettes[0][1].slice()];
    this.target = 0;
    this.light = [0.62, 0.62]; this.lightTo = [0.62, 0.62];
    this.free = true; // light drifts by itself until the visitor moves it
    this.visible = false; this.running = false; this.t0 = performance.now() - (opt.t0 || 0); this.frozenT = opt.t0 ? opt.t0 / 1000 : 7.5;
    this.onFirst = opt.onFirst || null; this.drawn = false;

    function size() {
      var w = canvas.clientWidth || 1, h = canvas.clientHeight || 1;
      // half-resolution buffer in CSS pixels (device pixel ratio ignored), capped by a pixel budget
      var s = Math.min(0.5, Math.sqrt((self.soft ? 16000 : (opt.budget || 200000)) / (w * h)));
      var W = Math.max(2, Math.round(w * s)), H = Math.max(2, Math.round(h * s));
      if (canvas.width !== W || canvas.height !== H) { canvas.width = W; canvas.height = H; gl.viewport(0, 0, W, H); }
      if (self.reduced || !self.running) self.frame(self.reduced ? self.frozenT * 1000 : performance.now() - self.t0);
    }
    this.size = size;
    var ro = window.ResizeObserver ? new ResizeObserver(function () { if (self.ready) size(); }) : null;
    if (ro) ro.observe(canvas); else window.addEventListener('resize', function () { if (self.ready) size(); });

    var last = 0;
    this.loop = function (now) {
      if (!self.running) return;
      if (now - last > 30) { last = now; self.frame(now - self.t0); } // ~30 fps is plenty for drifting light
      self.raf = requestAnimationFrame(self.loop);
    };
    this.frame = function (ms) {
      if (!self.ready) return;
      var t = ms / 1000, P = self.palettes[self.target], c = self.cur, k = self.reduced ? 1 : 0.045;
      for (var j = 0; j < 3; j++) { c[0][j] += (P[0][j] - c[0][j]) * k; c[1][j] += (P[1][j] - c[1][j]) * k; }
      if (self.free) { self.lightTo[0] = 0.58 + Math.sin(t * 0.21) * 0.2; self.lightTo[1] = 0.6 + Math.cos(t * 0.17) * 0.14; }
      var lk = self.reduced ? 1 : 0.06;
      self.light[0] += (self.lightTo[0] - self.light[0]) * lk; self.light[1] += (self.lightTo[1] - self.light[1]) * lk;
      gl.uniform2f(U.R, canvas.width, canvas.height);
      gl.uniform1f(U.T, t);
      gl.uniform2f(U.L, self.light[0], self.light[1]);
      gl.uniform3fv(U.A, c[0]); gl.uniform3fv(U.B, c[1]);
      gl.uniform1f(U.S, self.scale); gl.uniform1f(U.G, self.spread);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (!self.drawn) { self.drawn = true; if (self.onFirst) self.onFirst(); }
    };

    function sync() {
      var go = self.ready && self.visible && !document.hidden && !self.reduced && Caustics.armed;
      if (go && !self.running) { self.running = true; self.raf = requestAnimationFrame(self.loop); }
      else if (!go && self.running) { self.running = false; cancelAnimationFrame(self.raf); }
    }
    this.sync = sync; Caustics.all.push(this);
    var io = new IntersectionObserver(function (es) { self.visible = es[0].isIntersecting; sync(); }, { rootMargin: '80px 0px' });
    io.observe(canvas);
    document.addEventListener('visibilitychange', sync);
    if (par) setTimeout(poll, 0); else setTimeout(finish, 0);
  }
  Caustics.prototype.setPalette = function (i) {
    this.target = Math.max(0, Math.min(this.palettes.length - 1, i));
    if (this.reduced && this.ok) this.frame(this.frozenT * 1000);
  };
  Caustics.prototype.setLight = function (x, y) {
    this.free = false; this.lightTo[0] = x; this.lightTo[1] = y;
    if (this.reduced && this.ok) { this.light = [x, y]; this.frame(this.frozenT * 1000); }
  };
  // animation starts on the first interaction (or after a few seconds), the first frame is a still
  Caustics.armed = false; Caustics.all = [];
  Caustics.arm = function () { if (Caustics.armed) return; Caustics.armed = true; Caustics.all.forEach(function (c) { if (c.sync) c.sync(); }); };
  window.Caustics = Caustics;
})();
