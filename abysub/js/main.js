/* Abysub concept · main: language, header, chooser, tabs, booking funnel */
(function () {
  "use strict";
  var doc = document.documentElement;
  var WA = "34657644906"; /* [confirmar qué móvil tiene WhatsApp] */
  var lang = "es";
  try { if (localStorage.getItem("abysub-lang") === "en") lang = "en"; } catch (e) {}

  /* ---------- i18n ---------- */
  var listeners = [];
  window.ABY = { lang: function () { return lang; }, onLang: function (fn) { listeners.push(fn); } };

  function applyLang(l) {
    lang = l;
    doc.lang = l;
    document.querySelectorAll("[data-en]").forEach(function (el) {
      if (el.dataset.es === undefined) el.dataset.es = el.innerHTML;
      el.innerHTML = l === "en" ? el.dataset.en : el.dataset.es;
    });
    document.querySelectorAll("[data-en-attr]").forEach(function (el) {
      el.dataset.enAttr.split("|").forEach(function (pair) {
        var i = pair.indexOf(":"), attr = pair.slice(0, i), val = pair.slice(i + 1);
        var key = "es" + attr.replace(/[^a-z]/gi, "");
        if (el.dataset[key] === undefined) el.dataset[key] = el.getAttribute(attr) || "";
        el.setAttribute(attr, l === "en" ? val : el.dataset[key]);
      });
    });
    var b = document.getElementById("lang");
    if (b) {
      b.querySelector(".lang-on").textContent = l === "en" ? "EN" : "ES";
      b.querySelector(".lang-off").textContent = l === "en" ? "ES" : "EN";
    }
    try { localStorage.setItem("abysub-lang", l); } catch (e) {}
    listeners.forEach(function (fn) { fn(l); });
  }
  document.getElementById("lang").addEventListener("click", function () { applyLang(lang === "en" ? "es" : "en"); });

  /* ---------- header + menu ---------- */
  var header = document.querySelector(".site-header");
  var mbar = document.querySelector(".mbar");
  var ticking = false;
  function onScroll() {
    var y = window.scrollY;
    header.classList.toggle("scrolled", y > 40);
    ticking = false;
  }
  window.addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  var menuBtn = document.getElementById("menuBtn"), nav = document.getElementById("nav");
  function closeMenu() { nav.classList.remove("open"); menuBtn.setAttribute("aria-expanded", "false"); }
  menuBtn.addEventListener("click", function () {
    var open = !nav.classList.contains("open");
    nav.classList.toggle("open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
    if (open) { var a = nav.querySelector("a"); if (a) a.focus(); }
  });
  nav.addEventListener("click", function (e) { if (e.target.closest("a")) closeMenu(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && nav.classList.contains("open")) { closeMenu(); menuBtn.focus(); } });

  /* hide mobile bar while the booking form is on screen (it has its own buttons) */
  var book = document.getElementById("reserva");
  if (mbar && "IntersectionObserver" in window) {
    new IntersectionObserver(function (en) { mbar.classList.toggle("hide", en[0].isIntersecting); }, { threshold: .25 }).observe(book);
  }

  /* ---------- reveal ---------- */
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var idleCb = window.requestIdleCallback || function (f) { return setTimeout(f, 300); };
  if (!reduce && "IntersectionObserver" in window) window.addEventListener("load", function () { idleCb(setupReveal, { timeout: 1200 }); });
  function setupReveal() {
    var rvs = document.querySelectorAll(".section-head, .ptable tbody tr, .topic, .contact, .map, .site-card, .funnel, .trust li");
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add("in"); io.unobserve(x.target); } });
    }, { rootMargin: "0px 0px -8% 0px" });
    rvs.forEach(function (el) { el.classList.add("rv"); io.observe(el); });
  }

  /* ---------- course tabs ---------- */
  var tabs = Array.prototype.slice.call(document.querySelectorAll(".tab"));
  var tabBar = document.querySelector(".tabs"), ink = document.createElement("span");
  ink.className = "tab-ink"; ink.setAttribute("aria-hidden", "true"); tabBar.insertBefore(ink, tabBar.firstChild);
  function moveInk() {
    var t = tabBar.querySelector('[aria-selected="true"]'); if (!t) return;
    ink.style.width = t.offsetWidth + "px";
    ink.style.transform = "translate3d(" + t.offsetLeft + "px," + t.offsetTop + "px,0)";
  }
  window.addEventListener("resize", moveInk);
  window.ABY.onLang(function () { requestAnimationFrame(moveInk); });
  var idle = window.requestIdleCallback || function (f) { return setTimeout(f, 300); };
  window.addEventListener("load", function () { idle(moveInk); });
  function selectTab(t, focus) {
    tabs.forEach(function (x) {
      var on = x === t;
      x.setAttribute("aria-selected", String(on));
      x.tabIndex = on ? 0 : -1;
      document.getElementById(x.getAttribute("aria-controls")).hidden = !on;
    });
    if (focus) t.focus();
    moveInk();
    if (tabBar.scrollWidth > tabBar.clientWidth) tabBar.scrollTo({ left: t.offsetLeft - 20, behavior: reduce ? "auto" : "smooth" });
  }
  tabs.forEach(function (t, i) {
    t.addEventListener("click", function () { selectTab(t); });
    t.addEventListener("keydown", function (e) {
      var n = null;
      if (e.key === "ArrowRight") n = tabs[(i + 1) % tabs.length];
      if (e.key === "ArrowLeft") n = tabs[(i - 1 + tabs.length) % tabs.length];
      if (e.key === "Home") n = tabs[0];
      if (e.key === "End") n = tabs[tabs.length - 1];
      if (n) { e.preventDefault(); selectTab(n, true); }
    });
  });

  /* ---------- chooser ---------- */
  var R = {
    try: { pick: "try", es: ["Bautismo de buceo", "Sin experiencia y sin compromiso: unas horas, un instructor a tu lado y tu primera respiración bajo el agua. Es la experiencia más comentada en nuestras reseñas."], en: ["Try dive", "No experience, no commitment: a few hours, an instructor beside you and your first breath underwater. It's the experience our reviewers mention most."] },
    sd: { pick: "ow", es: ["PADI Scuba Diver", "Un primer nivel más corto: podrás bucear acompañado de un profesional. Si luego quieres más, se completa hasta Open Water."], en: ["PADI Scuba Diver", "A shorter first level: you'll dive accompanied by a professional. Want more later? It upgrades to Open Water."] },
    ow: { pick: "ow", es: ["PADI Open Water Diver", "La licencia completa: bucear con un compañero hasta 18 m en cualquier parte del mundo. Puedes adelantar la teoría online con PADI eLearning."], en: ["PADI Open Water Diver", "The full licence: dive with a buddy to 18 m anywhere in the world. You can get the theory done online with PADI eLearning."] },
    adv: { pick: "ow", es: ["PADI Advanced Open Water", "Ya tienes titulación: el siguiente paso te lleva hasta 30 m y a los pecios. Después, Nitrox o Rescue."], en: ["PADI Advanced Open Water", "You're already certified: the next step takes you to 30 m and onto the wrecks. Then Nitrox or Rescue."] },
    go: { pick: "try", es: ["Salidas Go Dive", "Si solo quieres bucear: salidas diarias en barco y desde costa, con el equipo incluido."], en: ["Go Dive trips", "If you just want to dive: daily boat and shore dives, with equipment included."] },
    re: { pick: "try", es: ["ReActivate / Scuba Review", "Un repaso con instructor para recuperar confianza antes de volver a bucear con normalidad."], en: ["ReActivate / Scuba Review", "A refresher with an instructor to get your confidence back before diving as usual again."] },
    ia: { pick: "apnea", es: ["Intro APNEA", "Una primera toma de contacto con la apnea, sin botella. Si te engancha, sigue con el APNEA Diver."], en: ["Intro APNEA", "A first taste of freediving, no tank. If you're hooked, carry on to APNEA Diver."] },
    ad: { pick: "apnea", es: ["APNEA Diver", "Ya conoces el agua: objetivos de 120 s en estática, 30 m en dinámica y −15 m en peso constante."], en: ["APNEA Diver", "You already know the water: goals of 120 s static, 30 m dynamic and −15 m constant weight."] }
  };
  var ans = {}, current = null;
  var qs = { exp: q("exp"), want: q("want"), far: q("far") };
  function q(n) { return document.querySelector('.q[data-q="' + n + '"]'); }
  var resBox = document.getElementById("quizResult"), bar = document.getElementById("quizBar");

  function decide() {
    if (!ans.exp || !ans.want) return null;
    if (ans.want === "apnea") return ans.exp === "never" ? "ia" : "ad";
    if (ans.exp === "lapsed") return ans.want === "cert" ? "adv" : "re";
    if (ans.exp === "cert") return ans.want === "cert" ? "adv" : "go";
    if (ans.want === "try") return "try";
    if (!ans.far) return null;
    return ans.far === "guided" ? "sd" : "ow";
  }
  function needFar() { return ans.exp === "never" && ans.want === "cert"; }
  function renderResult() {
    var k = decide();
    var steps = needFar() ? 3 : 2, done = (ans.exp ? 1 : 0) + (ans.want ? 1 : 0) + (needFar() && ans.far ? 1 : 0);
    bar.style.transform = "scaleX(" + (k ? 1 : done / steps) + ")";
    if (!k) { resBox.hidden = true; current = null; return; }
    if (current !== R[k] && !resBox.hidden) { resBox.classList.remove("flash"); void resBox.offsetWidth; resBox.classList.add("flash"); }
    current = R[k];
    document.getElementById("resName").textContent = current[lang][0];
    document.getElementById("resWhy").textContent = current[lang][1];
    if (resBox.hidden) { resBox.hidden = false; requestAnimationFrame(function () { resBox.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "nearest" }); }); }
  }
  document.getElementById("quiz").addEventListener("click", function (e) {
    var o = e.target.closest(".opt"); if (!o) return;
    var fs = o.closest(".q"), key = fs.dataset.q;
    fs.querySelectorAll(".opt").forEach(function (b) { b.setAttribute("aria-pressed", String(b === o)); });
    ans[key] = o.dataset.v;
    fs.classList.add("done");
    if (key === "exp") { qs.want.hidden = false; }
    if (key !== "far") { qs.far.hidden = !needFar(); if (!needFar()) delete ans.far; }
    if (!qs.far.hidden && !ans.far) qs.far.querySelectorAll(".opt").forEach(function (b) { b.setAttribute("aria-pressed", "false"); });
    renderResult();
  });
  document.getElementById("quizReset").addEventListener("click", function () {
    ans = {}; qs.want.hidden = true; qs.far.hidden = true; resBox.hidden = true;
    document.querySelectorAll("#quiz .q").forEach(function (q) { q.classList.remove("done"); });
    document.querySelectorAll("#quiz .opt").forEach(function (b) { b.setAttribute("aria-pressed", "false"); });
    bar.style.transform = "scaleX(0)";
    qs.exp.querySelector(".opt").focus();
  });
  document.getElementById("resBook").addEventListener("click", function () { if (current) preselect(current.pick); });
  document.querySelectorAll("[data-pick]").forEach(function (a) { a.addEventListener("click", function () { preselect(a.dataset.pick); }); });
  window.ABY.onLang(function () { if (current) renderResult(); });

  /* ---------- funnel ---------- */
  var form = document.getElementById("funnel");
  var stepEls = Array.prototype.slice.call(form.querySelectorAll(".step"));
  var dots = form.querySelectorAll(".steps li");
  var date = document.getElementById("fDate"), name = document.getElementById("fName");
  var gOut = document.getElementById("gOut"), gMinus = document.getElementById("gMinus"), gPlus = document.getElementById("gPlus"), divers = document.getElementById("divers");
  var group = 2, MAXG = 8, step = 1;
  var today = new Date(); today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
  date.min = today.toISOString().slice(0, 10);

  function preselect(v) {
    var r = form.querySelector('input[name="xp"][value="' + v + '"]');
    if (r) r.checked = true;
    go(1);
  }
  function go(n) {
    step = n;
    stepEls.forEach(function (s) { s.hidden = Number(s.dataset.step) !== n; });
    dots.forEach(function (d, i) { d.classList.toggle("on", i < n); });
    if (n === 3) summary();
  }
  function focusStep() { var t = form.querySelector('.step[data-step="' + step + '"] .step-title'); if (t) { t.tabIndex = -1; t.focus({ preventScroll: true }); } }
  function validDate() {
    var ok = !!date.value && date.value >= date.min;
    date.setAttribute("aria-invalid", String(!ok));
    document.getElementById("fDateErr").hidden = ok;
    if (!ok) date.setAttribute("aria-describedby", "fDateErr"); else date.removeAttribute("aria-describedby");
    return ok;
  }
  function validName() {
    var ok = name.value.trim().length > 0;
    name.setAttribute("aria-invalid", String(!ok));
    document.getElementById("fNameErr").hidden = ok;
    if (!ok) name.setAttribute("aria-describedby", "fNameErr"); else name.removeAttribute("aria-describedby");
    return ok;
  }
  date.addEventListener("blur", function () { if (date.value) validDate(); });
  date.addEventListener("input", function () { if (date.getAttribute("aria-invalid") === "true") validDate(); });
  name.addEventListener("blur", function () { if (name.value) validName(); });
  name.addEventListener("input", function () { if (name.getAttribute("aria-invalid") === "true") validName(); summary(); });

  form.addEventListener("click", function (e) {
    if (e.target.closest("[data-next]")) {
      if (step === 2 && !validDate()) { date.focus(); return; }
      go(step + 1); focusStep();
    } else if (e.target.closest("[data-prev]")) { go(step - 1); focusStep(); }
  });
  form.addEventListener("change", function () { if (step === 3) summary(); });

  function drawGroup(bump) {
    gOut.textContent = group;
    if (bump) { gOut.classList.remove("bump"); void gOut.offsetWidth; gOut.classList.add("bump"); }
    gMinus.disabled = group <= 1; gPlus.disabled = group >= MAXG;
    while (divers.children.length < group) divers.appendChild(document.createElement("i"));
    while (divers.children.length > group) divers.removeChild(divers.lastChild);
    summary();
  }
  gMinus.addEventListener("click", function () { if (group > 1) { group--; drawGroup(true); } });
  gPlus.addEventListener("click", function () { if (group < MAXG) { group++; drawGroup(true); } });

  var XP = { try: { es: "Bautismo de buceo", en: "Try dive" }, ow: { es: "Curso PADI Open Water", en: "PADI Open Water course" }, apnea: { es: "Apnea (Intro APNEA)", en: "Freediving (Intro APNEA)" } };
  var SLOT = { m: { es: "por la mañana", en: "morning" }, t: { es: "por la tarde", en: "afternoon" }, x: { es: "horario flexible", en: "flexible time" } };
  function vals() {
    var xp = form.querySelector('input[name="xp"]:checked').value;
    var slot = form.querySelector('input[name="slot"]:checked').value;
    var d = date.value ? new Date(date.value + "T12:00:00") : null;
    var ds = d ? d.toLocaleDateString(lang === "en" ? "en-GB" : "es-ES", { weekday: "long", day: "numeric", month: "long", year: "numeric" }) : (lang === "en" ? "[date]" : "[fecha]");
    return { xp: XP[xp][lang], slot: SLOT[slot][lang], date: ds, n: group, name: name.value.trim() };
  }
  function esc(s) { return s.replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function summary() {
    var v = vals(), el = document.getElementById("summary");
    el.innerHTML = lang === "en"
      ? "<strong>" + esc(v.xp) + "</strong> · " + esc(v.date) + ", " + v.slot + " · <strong>" + v.n + (v.n === 1 ? " person" : " people") + "</strong>"
      : "<strong>" + esc(v.xp) + "</strong> · " + esc(v.date) + ", " + v.slot + " · <strong>" + v.n + (v.n === 1 ? " persona" : " personas") + "</strong>";
  }
  function message() {
    var v = vals();
    return lang === "en"
      ? "Hi Abysub! I'd like to book: " + v.xp + ".\nDate: " + v.date + ", " + v.slot + ".\nGroup: " + v.n + (v.n === 1 ? " person" : " people") + ".\nName: " + v.name + ".\nIs there availability? Thanks!"
      : "¡Hola Abysub! Me gustaría reservar: " + v.xp + ".\nFecha: " + v.date + ", " + v.slot + ".\nGrupo: " + v.n + (v.n === 1 ? " persona" : " personas") + ".\nNombre: " + v.name + ".\n¿Tenéis disponibilidad? ¡Gracias!";
  }
  var sent = document.getElementById("sent");
  function showSent() {
    stepEls.forEach(function (st) { st.hidden = true; });
    dots.forEach(function (d) { d.classList.add("on"); });
    sent.hidden = false;
    sent.classList.remove("go"); void sent.offsetWidth; sent.classList.add("go");
    sent.focus({ preventScroll: true });
  }
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!validName()) { name.focus(); return; }
    window.open("https://wa.me/" + WA + "?text=" + encodeURIComponent(message()), "_blank", "noopener");
    showSent();
  });
  document.getElementById("sentAgain").addEventListener("click", function () { sent.hidden = true; go(1); focusStep(); });
  document.getElementById("mailLink").addEventListener("click", function (e) {
    if (step !== 3) return;
    e.currentTarget.href = "mailto:info@abysub.com?subject=" + encodeURIComponent(lang === "en" ? "Booking request" : "Solicitud de reserva") + "&body=" + encodeURIComponent(message());
  });
  window.ABY.onLang(function () { summary(); });

  drawGroup();

  /* flip cards */
  document.querySelectorAll("[data-flip]").forEach(function (card) {
    var front = card.querySelector(".flip-front"), back = card.querySelector(".flip-back"), btn = card.querySelector(".flip-btn");
    function set(on) {
      card.classList.toggle("flipped", on);
      btn.setAttribute("aria-expanded", String(on));
      if (on) { front.setAttribute("inert", ""); back.removeAttribute("inert"); setTimeout(function () { back.querySelector(".btn").focus({ preventScroll: true }); }, reduce ? 0 : 350); }
      else { back.setAttribute("inert", ""); front.removeAttribute("inert"); btn.focus({ preventScroll: true }); }
    }
    btn.addEventListener("click", function () { set(true); });
    card.querySelector(".flip-back-btn").addEventListener("click", function () { set(false); });
    card.addEventListener("keydown", function (e) { if (e.key === "Escape" && card.classList.contains("flipped")) set(false); });
  });

  /* header: hide on scroll down, show on scroll up */
  var lastY = window.scrollY;
  window.addEventListener("scroll", function () {
    var y = window.scrollY;
    if (Math.abs(y - lastY) > 6) { header.classList.toggle("tuck", y > lastY && y > 400 && !nav.classList.contains("open")); lastY = y; }
  }, { passive: true });
  header.addEventListener("focusin", function () { header.classList.remove("tuck"); });

  /* magnetic primary buttons (pointer devices only) */
  if (!reduce && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    document.querySelectorAll(".btn-accent:not(.btn-sm), .btn-wa").forEach(function (b) {
      b.addEventListener("pointermove", function (e) {
        var r = b.getBoundingClientRect(), x = (e.clientX - r.left - r.width / 2) / r.width, y = (e.clientY - r.top - r.height / 2) / r.height;
        b.style.transform = "translate3d(" + (x * 8).toFixed(1) + "px," + (y * 6 - 2).toFixed(1) + "px,0)";
      });
      b.addEventListener("pointerleave", function () { b.style.transform = ""; });
    });
  }

  /* press glow on buttons, from the touch point */
  document.addEventListener("pointerdown", function (e) {
    var b = e.target.closest(".btn"); if (!b || reduce) return;
    var r = b.getBoundingClientRect();
    b.style.setProperty("--mx", (e.clientX - r.left) + "px"); b.style.setProperty("--my", (e.clientY - r.top) + "px");
    b.classList.add("pressed");
  });
  ["pointerup", "pointercancel", "pointerleave"].forEach(function (ev) {
    document.addEventListener(ev, function () { document.querySelectorAll(".btn.pressed").forEach(function (b) { b.classList.remove("pressed"); }); }, true);
  });

  if (lang === "en") applyLang("en");
})();
