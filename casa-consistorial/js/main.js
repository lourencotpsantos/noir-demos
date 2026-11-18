(function () {
  "use strict";

  var HOTEL_PHONE_WA = "34951204243"; // international format, no + or spaces
  var HOTEL_EMAIL = "hotel@hotelcasaconsistorial.com";

  var DICT = window.CC_I18N || {};
  var UI = window.CC_UI || {};
  var root = document.documentElement;
  var mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  var reduce = mqReduce.matches;
  var lang = "en";
  var onLang = [];

  function $(s, c) { return (c || document).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function smooth(t) { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); }

  /* ---------- i18n ---------- */
  var textNodes = $$("[data-i18n]");
  var attrNodes = $$("[data-i18n-attr]");
  var en = {};
  textNodes.forEach(function (el) {
    var k = el.getAttribute("data-i18n");
    if (!(k in en)) en[k] = el.innerHTML;
  });
  attrNodes.forEach(function (el) {
    el.getAttribute("data-i18n-attr").split(";").forEach(function (pair) {
      var p = pair.split(":");
      if (p.length === 2 && !(p[1] in en)) en[p[1]] = el.getAttribute(p[0]);
    });
  });
  var extra = DICT.enExtra || {};
  Object.keys(extra).forEach(function (k) { if (!(k in en)) en[k] = extra[k]; });
  DICT.en = en;

  function t(key) {
    var d = DICT[lang] || en;
    return key in d ? d[key] : en[key];
  }
  function u() { return UI[lang] || UI.en; }

  function applyLang(next) {
    lang = next === "es" ? "es" : "en";
    root.lang = lang;
    textNodes.forEach(function (el) {
      var v = t(el.getAttribute("data-i18n"));
      if (v != null && el.innerHTML !== v) el.innerHTML = v;
    });
    attrNodes.forEach(function (el) {
      el.getAttribute("data-i18n-attr").split(";").forEach(function (pair) {
        var p = pair.split(":");
        var v = t(p[1]);
        if (v != null) el.setAttribute(p[0], v);
      });
    });
    document.title = u().title;
    var md = $('meta[name="description"]');
    if (md) md.setAttribute("content", u().description);
    $$("[data-lang-opt]").forEach(function (o) {
      o.classList.toggle("is-active", o.getAttribute("data-lang-opt") === lang);
    });
    onLang.forEach(function (fn) { fn(); });
    try { localStorage.setItem("cc-lang", lang); } catch (e) {}
  }

  var stored = null;
  try { stored = localStorage.getItem("cc-lang"); } catch (e) {}
  var initialLang = new URLSearchParams(location.search).get("lang") || stored || "en";
  $("#lang-toggle").addEventListener("click", function () { applyLang(lang === "en" ? "es" : "en"); });

  /* ---------- header + menu ---------- */
  var header = $(".site-header");
  var menuBtn = $("#menu-toggle");
  var nav = $("#main-nav");

  function syncMenuLabel() {
    var open = menuBtn.getAttribute("aria-expanded") === "true";
    menuBtn.setAttribute("aria-label", t(open ? "menuClose" : "menuOpen"));
  }
  function setMenu(open) {
    menuBtn.setAttribute("aria-expanded", String(open));
    nav.classList.toggle("is-open", open);
    header.classList.toggle("menu-open", open);
    document.body.style.overflow = open ? "hidden" : "";
    syncMenuLabel();
  }
  onLang.push(syncMenuLabel);
  menuBtn.addEventListener("click", function () { setMenu(menuBtn.getAttribute("aria-expanded") !== "true"); });
  nav.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && menuBtn.getAttribute("aria-expanded") === "true") { setMenu(false); menuBtn.focus(); }
  });
  window.matchMedia("(min-width: 1200px)").addEventListener("change", function (m) { if (m.matches) setMenu(false); });

  /* ---------- reveal on scroll + count-up ---------- */
  function countUp(el) {
    var to = parseFloat(el.getAttribute("data-to"));
    var fmt = function (v) { return v.toLocaleString(u().locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 }); };
    el._fmt = function () { el.textContent = fmt(to); };
    if (reduce) { el._fmt(); return; }
    var start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = clamp((ts - start) / 1400, 0, 1);
      el.textContent = fmt(to * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  onLang.push(function () { $$(".count").forEach(function (c) { if (c._fmt) c._fmt(); }); });

  var revealTargets = $$(".reveal, .facade, .room-card, .chapter, .scene, .nearby, .count");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        el.classList.add("is-visible");
        if (el.classList.contains("count")) countUp(el);
        io.unobserve(el);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    revealTargets.forEach(function (el) { io.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- scroll-driven scenes ---------- */
  var heroMedia = $(".hero-media");
  var heroContent = $(".hero-content");
  var storyEl = $("#chapters");
  var dayEl = $("#day-pin");
  var dayTrack = $("#day-track");
  var daySticky = $("#day-sticky");
  var sunDot = $("#sun-dot");
  var yearEl = $("#ch-year");
  var barEl = $("#ch-bar");
  var chapters = $$(".chapter", storyEl);
  var scenes = $$(".scene", dayEl);
  var dots = $$(".day-dots li");
  var pinned = !reduce;
  var nowYear = new Date().getFullYear();
  var geo = { story: { top: 0, h: 1 }, day: { top: 0, h: 1 } };
  var lastStory = -1, lastDay = -1, lastDark = null;
  var dayStops = [[241, 230, 212], [236, 210, 174], [150, 62, 36], [30, 22, 17]];

  if (pinned) {
    storyEl.classList.add("is-pinned");
    dayEl.classList.add("is-pinned");
  }

  function measure() {
    var y = window.pageYOffset;
    var r1 = storyEl.getBoundingClientRect(), r2 = dayEl.getBoundingClientRect();
    geo.story = { top: r1.top + y, h: storyEl.offsetHeight };
    geo.day = { top: r2.top + y, h: dayEl.offsetHeight };
  }
  function prog(g) {
    var vh = window.innerHeight;
    return clamp((window.pageYOffset - g.top) / Math.max(1, g.h - vh), 0, 1);
  }
  function setActive(list, idx) {
    list.forEach(function (el, i) { el.classList.toggle("is-active", i === idx); });
  }

  function updateStory() {
    var p = prog(geo.story);
    var n = chapters.length;
    var idx = Math.min(n - 1, Math.floor(p * n));
    if (idx !== lastStory) { setActive(chapters, idx); lastStory = idx; }
    var yr;
    if (p < 0.25) yr = 1868;
    else if (p < 0.5) yr = lerp(1868, 2013, smooth((p - 0.43) / 0.07));
    else if (p < 0.75) yr = 2013;
    else yr = lerp(2013, nowYear, smooth((p - 0.75) / 0.12));
    yearEl.textContent = String(Math.round(yr));
    barEl.style.transform = "scaleX(" + p.toFixed(4) + ")";
  }

  function mix(a, b, f) {
    return "rgb(" + Math.round(lerp(a[0], b[0], f)) + "," + Math.round(lerp(a[1], b[1], f)) + "," + Math.round(lerp(a[2], b[2], f)) + ")";
  }
  function updateDay() {
    var n = scenes.length;
    var p = prog(geo.day);
    var seg = p * (n - 1);
    var i = Math.floor(seg);
    var f = seg - i;
    var x = Math.min(n - 1, i + smooth((f - 0.3) / 0.4));
    dayTrack.style.transform = "translate3d(" + (-x * 100 / n).toFixed(3) + "%,0,0)";
    var tt = x / (n - 1);
    var s = Math.min(dayStops.length - 2, Math.floor(tt * (dayStops.length - 1)));
    var sf = tt * (dayStops.length - 1) - s;
    daySticky.style.backgroundColor = mix(dayStops[s], dayStops[s + 1], sf);
    daySticky.style.setProperty("--warm", tt.toFixed(3));
    var dark = tt > 0.5;
    if (dark !== lastDark) { daySticky.classList.toggle("is-dark", dark); lastDark = dark; }
    var a = Math.round(x);
    if (a !== lastDay) {
      setActive(scenes, a);
      dots.forEach(function (d, k) { d.classList.toggle("is-on", k === a); });
      lastDay = a;
    }
    var q = 1 - tt;
    sunDot.setAttribute("cx", (q * q * 10 + 2 * q * tt * 100 + tt * tt * 190).toFixed(1));
    sunDot.setAttribute("cy", (q * q * 56 + 2 * q * tt * -18 + tt * tt * 56).toFixed(1));
  }

  function updateHero() {
    var y = window.pageYOffset;
    var vh = window.innerHeight;
    if (y > vh * 1.2) return;
    heroMedia.style.transform = "translate3d(0," + (y * 0.32).toFixed(1) + "px,0)";
    heroContent.style.transform = "translate3d(0," + (y * 0.12).toFixed(1) + "px,0)";
    heroContent.style.opacity = String(clamp(1 - y / (vh * 0.85), 0, 1).toFixed(3));
  }

  var ticking = false;
  function frame() {
    ticking = false;
    header.classList.toggle("is-solid", window.pageYOffset > 40);
    if (!reduce) updateHero();
    if (pinned) { updateStory(); updateDay(); }
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", function () { measure(); onScroll(); });
  window.addEventListener("load", function () { measure(); onScroll(); });
  if ("ResizeObserver" in window) new ResizeObserver(function () { measure(); onScroll(); }).observe(document.body);
  measure();
  frame();

  /* In-page links that point at a scene inside the pinned day track */
  document.addEventListener("click", function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a || !pinned) return;
    var id = a.getAttribute("href").slice(1);
    var target = id && document.getElementById(id);
    if (!target || !dayEl.contains(target) || !target.classList.contains("scene")) return;
    e.preventDefault();
    measure();
    var idx = scenes.indexOf(target);
    var y = geo.day.top + (idx / (scenes.length - 1)) * (geo.day.h - window.innerHeight);
    window.scrollTo({ top: y, behavior: reduce ? "auto" : "smooth" });
  });

  /* ---------- booking: stepped flow + calendar ---------- */
  var booker = $("#booker");
  var calMonths = $("#cal-months");
  var calPrev = $(".cal-prev");
  var calNext = $(".cal-next");
  var calStatus = $("#cal-status");
  var rrIn = $("#rr-in"), rrOut = $("#rr-out"), rrN = $("#rr-n");
  var stepBtns = $$(".step-btn");
  var panels = $$(".panel");
  var steps = $(".steps");
  var nameIn = $("#guest-name");
  var notesIn = $("#guest-notes");
  var waBtn = $("#send-wa");
  var mailBtn = $("#send-mail");
  var summaryList = $("#summary-list");

  var today = new Date(); today.setHours(0, 0, 0, 0);
  var maxDate = new Date(today.getFullYear(), today.getMonth() + 18, 0);
  var st = {
    start: null, end: null,
    view: new Date(today.getFullYear(), today.getMonth(), 1),
    focus: new Date(today),
    step: 1, maxStep: 1,
    adults: 2, children: 0,
    months: 1
  };

  function iso(d) {
    var m = d.getMonth() + 1, day = d.getDate();
    return d.getFullYear() + "-" + (m < 10 ? "0" : "") + m + "-" + (day < 10 ? "0" : "") + day;
  }
  function fromIso(s) { var p = s.split("-"); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function addDays(d, n) { var x = new Date(d); x.setDate(x.getDate() + n); return x; }
  function sameDay(a, b) { return a && b && a.getTime() === b.getTime(); }
  function nightsBetween(a, b) { return Math.round((b - a) / 86400000); }
  function fmtShort(d) { return new Intl.DateTimeFormat(u().locale, { weekday: "short", day: "numeric", month: "short" }).format(d); }
  function fmtLong(d) { return new Intl.DateTimeFormat(u().locale, { weekday: "short", day: "numeric", month: "short", year: "numeric" }).format(d); }
  function fmtFull(d) { return new Intl.DateTimeFormat(u().locale, { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(d); }

  function monthsWanted() { return booker.clientWidth >= 600 ? 2 : 1; }

  function renderCal(focusAfter) {
    st.months = monthsWanted();
    calMonths.classList.toggle("two", st.months === 2);
    calMonths.textContent = "";
    var loc = u().locale;
    var monthFmt = new Intl.DateTimeFormat(loc, { month: "long", year: "numeric" });
    var wdFmt = new Intl.DateTimeFormat(loc, { weekday: "short" });
    var focusIso = iso(st.focus);
    for (var m = 0; m < st.months; m++) {
      var first = new Date(st.view.getFullYear(), st.view.getMonth() + m, 1);
      var table = document.createElement("table");
      table.className = "cal-month";
      var cap = document.createElement("caption");
      var mt = monthFmt.format(first); cap.textContent = mt.charAt(0).toUpperCase() + mt.slice(1);
      table.appendChild(cap);
      var thead = document.createElement("thead");
      var hr = document.createElement("tr");
      for (var w = 0; w < 7; w++) {
        var th = document.createElement("th");
        th.scope = "col";
        var wd = new Date(2024, 0, 1 + w); // 1 Jan 2024 is a Monday
        th.textContent = wdFmt.format(wd).replace(".", "").slice(0, 2);
        th.setAttribute("abbr", new Intl.DateTimeFormat(loc, { weekday: "long" }).format(wd));
        hr.appendChild(th);
      }
      thead.appendChild(hr);
      table.appendChild(thead);
      var tbody = document.createElement("tbody");
      var offset = (first.getDay() + 6) % 7;
      var daysIn = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
      var cell = 0, tr = null;
      for (var k = 0; k < offset + daysIn; k++) {
        if (cell % 7 === 0) { tr = document.createElement("tr"); tbody.appendChild(tr); }
        var td = document.createElement("td");
        if (k >= offset) {
          var d = new Date(first.getFullYear(), first.getMonth(), k - offset + 1);
          var b = document.createElement("button");
          b.type = "button";
          b.className = "day-btn";
          b.textContent = String(d.getDate());
          b.setAttribute("data-date", iso(d));
          var label = fmtFull(d);
          var disabled = d < today || d > maxDate;
          if (disabled) { b.disabled = true; label += ", " + u().stNo; }
          if (sameDay(d, today)) b.classList.add("is-today");
          if (sameDay(d, st.start)) { td.classList.add("is-start"); b.setAttribute("aria-pressed", "true"); label += ", " + u().stIn; if (!st.end) td.classList.add("solo"); }
          if (sameDay(d, st.end)) { td.classList.add("is-end"); b.setAttribute("aria-pressed", "true"); label += ", " + u().stOut; }
          if (st.start && st.end && d > st.start && d < st.end) { td.classList.add("in-range"); label += ", " + u().stIn2; }
          b.setAttribute("aria-label", label);
          b.tabIndex = iso(d) === focusIso ? 0 : -1;
          td.appendChild(b);
        }
        tr.appendChild(td);
        cell++;
      }
      table.appendChild(tbody);
      calMonths.appendChild(table);
    }
    // make sure something is tabbable
    if (!calMonths.querySelector('.day-btn[tabindex="0"]')) {
      var firstOk = calMonths.querySelector(".day-btn:not(:disabled)");
      if (firstOk) firstOk.tabIndex = 0;
    }
    calPrev.disabled = st.view <= new Date(today.getFullYear(), today.getMonth(), 1);
    calNext.disabled = new Date(st.view.getFullYear(), st.view.getMonth() + st.months, 1) > maxDate;
    rrIn.textContent = st.start ? fmtShort(st.start) : "—";
    rrOut.textContent = st.end ? fmtShort(st.end) : "—";
    rrN.textContent = st.start && st.end ? String(nightsBetween(st.start, st.end)) : "—";
    if (focusAfter) {
      var fb = calMonths.querySelector('[data-date="' + focusIso + '"]');
      if (fb) fb.focus();
    }
  }

  function setStatus(msg, isError) {
    calStatus.textContent = msg;
    calStatus.classList.toggle("is-error", !!isError);
  }
  function statusForState() {
    if (!st.start) setStatus(u().pickIn);
    else if (!st.end) setStatus(u().pickOut(fmtShort(st.start)));
    else setStatus(u().picked(fmtShort(st.start), fmtShort(st.end), u().nights(nightsBetween(st.start, st.end))));
  }

  function inView(d) {
    var a = st.view;
    var b = new Date(st.view.getFullYear(), st.view.getMonth() + st.months, 1);
    return d >= a && d < b;
  }

  function selectDate(d) {
    if (!st.start || st.end) { st.start = d; st.end = null; }
    else if (d > st.start) { st.end = d; }
    else { st.start = d; st.end = null; }
    st.focus = d;
    st.maxStep = st.start && st.end ? 4 : 1;
    renderCal(true);
    statusForState();
    syncSteps();
  }

  calMonths.addEventListener("click", function (e) {
    var b = e.target.closest(".day-btn");
    if (!b || b.disabled) return;
    selectDate(fromIso(b.getAttribute("data-date")));
  });
  calMonths.addEventListener("keydown", function (e) {
    var b = e.target.closest(".day-btn");
    if (!b) return;
    var d = fromIso(b.getAttribute("data-date"));
    var nd = null;
    switch (e.key) {
      case "ArrowLeft": nd = addDays(d, -1); break;
      case "ArrowRight": nd = addDays(d, 1); break;
      case "ArrowUp": nd = addDays(d, -7); break;
      case "ArrowDown": nd = addDays(d, 7); break;
      case "Home": nd = addDays(d, -((d.getDay() + 6) % 7)); break;
      case "End": nd = addDays(d, 6 - ((d.getDay() + 6) % 7)); break;
      case "PageUp": nd = new Date(d.getFullYear(), d.getMonth() - 1, d.getDate()); break;
      case "PageDown": nd = new Date(d.getFullYear(), d.getMonth() + 1, d.getDate()); break;
      default: return;
    }
    e.preventDefault();
    if (nd < today) nd = new Date(today);
    if (nd > maxDate) nd = new Date(maxDate);
    st.focus = nd;
    if (!inView(nd)) {
      st.view = nd < st.view ? new Date(nd.getFullYear(), nd.getMonth(), 1) : new Date(nd.getFullYear(), nd.getMonth() - st.months + 1, 1);
    }
    renderCal(true);
  });
  calMonths.addEventListener("mouseover", function (e) {
    if (!st.start || st.end) return;
    var b = e.target.closest(".day-btn");
    if (!b || b.disabled) return;
    var h = fromIso(b.getAttribute("data-date"));
    $$("td", calMonths).forEach(function (td) {
      var bb = td.firstChild;
      var dd = bb && bb.getAttribute && bb.getAttribute("data-date") ? fromIso(bb.getAttribute("data-date")) : null;
      td.classList.toggle("preview", !!(dd && dd > st.start && dd <= h));
    });
  });
  calMonths.addEventListener("mouseleave", function () { $$("td.preview", calMonths).forEach(function (td) { td.classList.remove("preview"); }); });
  calPrev.addEventListener("click", function () { st.view = new Date(st.view.getFullYear(), st.view.getMonth() - 1, 1); renderCal(false); });
  calNext.addEventListener("click", function () { st.view = new Date(st.view.getFullYear(), st.view.getMonth() + 1, 1); renderCal(false); });

  function syncSteps() {
    stepBtns.forEach(function (b) {
      var n = +b.getAttribute("data-step");
      if (n === st.step) b.setAttribute("aria-current", "step"); else b.removeAttribute("aria-current");
      b.classList.toggle("is-done", n < st.step);
      b.disabled = n > st.maxStep;
    });
    steps.style.setProperty("--prog", String(st.step));
  }

  function goTo(n, opts) {
    opts = opts || {};
    if (n > 1 && !(st.start && st.end)) {
      setStatus(u().errDates, true);
      if (st.step !== 1) goTo(1);
      var fb = calMonths.querySelector('.day-btn[tabindex="0"]');
      if (fb) fb.focus();
      return;
    }
    st.step = n;
    panels.forEach(function (p) {
      var on = +p.getAttribute("data-panel") === n;
      p.hidden = !on;
      p.classList.toggle("is-active", on);
      p.classList.remove("is-entering");
      if (on && !reduce) { void p.offsetWidth; p.classList.add("is-entering"); }
    });
    if (n === 1) renderCal(false);
    if (n === 4) renderSummary();
    syncSteps();
    if (!opts.noFocus) {
      var title = $(".panel.is-active .panel-title");
      if (title) title.focus({ preventScroll: true });
      var r = booker.getBoundingClientRect();
      if (r.top < 0 || r.top > window.innerHeight * 0.6) booker.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    }
  }

  booker.addEventListener("click", function (e) {
    var g = e.target.closest("[data-go]");
    if (g) { goTo(+g.getAttribute("data-go")); return; }
    var s = e.target.closest(".step-btn");
    if (s && !s.disabled) goTo(+s.getAttribute("data-step"));
  });

  // guest counters
  var limits = { adults: [1, 6], children: [0, 4] };
  function syncCounters() {
    ["adults", "children"].forEach(function (k) {
      $("#" + k).textContent = String(st[k]);
      $$('.cnt-btn[data-count="' + k + '"]').forEach(function (b) {
        var dlt = +b.getAttribute("data-delta");
        b.disabled = (dlt < 0 && st[k] <= limits[k][0]) || (dlt > 0 && st[k] >= limits[k][1]);
      });
    });
  }
  booker.addEventListener("click", function (e) {
    var b = e.target.closest(".cnt-btn");
    if (!b) return;
    var k = b.getAttribute("data-count");
    st[k] = clamp(st[k] + +b.getAttribute("data-delta"), limits[k][0], limits[k][1]);
    syncCounters();
  });

  function roomLabel() {
    var r = $('input[name="room"]:checked');
    var lab = r && r.parentNode.querySelector(".pick-name");
    return lab ? lab.textContent.trim() : "";
  }
  function guestsLabel() { return u().adults(st.adults) + (st.children ? ", " + u().children(st.children) : ""); }

  function buildMessage() {
    var x = u();
    var lines = [
      x.msgHello, "",
      "• " + x.sCheckin + ": " + fmtLong(st.start),
      "• " + x.sCheckout + ": " + fmtLong(st.end) + " (" + x.nights(nightsBetween(st.start, st.end)) + ")",
      "• " + x.sGuests + ": " + guestsLabel(),
      "• " + x.sRoom + ": " + roomLabel()
    ];
    var name = nameIn.value.trim(), notes = notesIn.value.trim();
    if (name) lines.push("• " + x.msgName + ": " + name);
    if (notes) lines.push("• " + x.msgNotes + ": " + notes);
    lines.push("", x.msgThanks);
    return lines.join("\n");
  }
  function updateLinks() {
    if (!(st.start && st.end)) return;
    var msg = buildMessage();
    waBtn.href = "https://wa.me/" + HOTEL_PHONE_WA + "?text=" + encodeURIComponent(msg);
    var subject = u().mailSubject + " · " + fmtLong(st.start) + " → " + fmtLong(st.end);
    mailBtn.href = "mailto:" + HOTEL_EMAIL + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(msg);
  }
  function renderSummary() {
    var x = u();
    var rows = [
      [x.sCheckin, fmtLong(st.start)],
      [x.sCheckout, fmtLong(st.end)],
      [x.sNights, x.nights(nightsBetween(st.start, st.end))],
      [x.sGuests, guestsLabel()],
      [x.sRoom, roomLabel()]
    ];
    var name = nameIn.value.trim();
    if (name) rows.push([x.msgName, name]);
    summaryList.textContent = "";
    rows.forEach(function (r) {
      var div = document.createElement("div");
      var dt = document.createElement("dt"); dt.textContent = r[0];
      var dd = document.createElement("dd"); dd.textContent = r[1];
      div.appendChild(dt); div.appendChild(dd); summaryList.appendChild(div);
    });
    updateLinks();
  }
  nameIn.addEventListener("input", updateLinks);
  notesIn.addEventListener("input", updateLinks);

  var mbWa = $("#mb-wa");
  function updateWaDefault() { mbWa.href = "https://wa.me/" + HOTEL_PHONE_WA + "?text=" + encodeURIComponent(u().waDefault); }

  onLang.push(function () {
    renderCal(false);
    if (calStatus.textContent) statusForState();
    if (st.step === 4) renderSummary();
    updateWaDefault();
  });
  window.addEventListener("resize", function () { if (monthsWanted() !== st.months && st.step === 1) renderCal(false); });

  /* ---------- rooms: carousel, galleries, lightbox, compare ---------- */
  var track = $("#room-track");
  var prevBtn = $("#rooms-prev"), nextBtn = $("#rooms-next");
  var cards = $$(".room-card", track);

  function parseGallery(card) {
    return card.getAttribute("data-gallery").split("|").map(function (s) {
      var p = s.split(":");
      return { name: p[0], w: +p[1], h: +p[2], alt: p[3] };
    });
  }
  cards.forEach(function (card) {
    card._g = parseGallery(card);
    card._i = 0;
    var main = $(".rg-main img", card);
    $$(".rg-thumb", card).forEach(function (tb) {
      tb.addEventListener("click", function () {
        var i = +tb.getAttribute("data-i");
        if (i === card._i) return;
        card._i = i;
        $$(".rg-thumb", card).forEach(function (x) { x.classList.toggle("is-on", x === tb); });
        var g = card._g[i];
        var swap = function () {
          main.srcset = "img/" + g.name + "-800.webp 800w, img/" + g.name + "-1600.webp 1600w";
          main.sizes = "(min-width: 600px) 380px, 84vw";
          main.src = "img/" + g.name + "-800.webp";
          main.alt = t(g.alt);
          main.setAttribute("data-i18n-attr", "alt:" + g.alt);
        };
        if (reduce) { swap(); return; }
        main.classList.add("is-fading");
        setTimeout(function () {
          main.onload = function () { main.classList.remove("is-fading"); };
          swap();
          if (main.complete) main.classList.remove("is-fading");
        }, 200);
      });
    });
    $(".rg-main", card).addEventListener("click", function (e) { openLightbox(card, card._i, e.currentTarget); });
  });
  onLang.push(function () {
    cards.forEach(function (card) { var img = $(".rg-main img", card); img.alt = t(card._g[card._i].alt); });
  });

  function updateArrows() {
    var max = track.scrollWidth - track.clientWidth - 2;
    prevBtn.disabled = track.scrollLeft <= 2;
    nextBtn.disabled = track.scrollLeft >= max;
  }
  function stepTrack(dir) {
    var c = cards[0];
    var gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap) || 20;
    track.scrollBy({ left: dir * (c.getBoundingClientRect().width + gap), behavior: reduce ? "auto" : "smooth" });
  }
  prevBtn.addEventListener("click", function () { stepTrack(-1); });
  nextBtn.addEventListener("click", function () { stepTrack(1); });
  track.addEventListener("scroll", function () { requestAnimationFrame(updateArrows); }, { passive: true });
  window.addEventListener("resize", updateArrows);
  updateArrows();

  // Lightbox
  var lb = $("#lightbox"), lbImg = $("#lb-img"), lbCap = $("#lb-caption");
  var lbCard = null, lbIndex = 0, lbOpener = null;
  function showLb(i) {
    var g = lbCard._g;
    lbIndex = (i + g.length) % g.length;
    var it = g[lbIndex];
    lbImg.classList.remove("is-in");
    lbImg.src = "img/" + it.name + "-1600.webp";
    lbImg.srcset = "img/" + it.name + "-800.webp 800w, img/" + it.name + "-1600.webp 1600w";
    lbImg.sizes = "100vw";
    lbImg.alt = t(it.alt);
    lbImg.width = it.w; lbImg.height = it.h;
    lbCap.textContent = u().lbCap(t(lbCard.getAttribute("data-name-key")).replace(/&amp;/g, "&"), lbIndex + 1, g.length);
    if (!reduce) { void lbImg.offsetWidth; lbImg.classList.add("is-in"); }
    var multi = g.length > 1;
    $("#lb-prev").hidden = !multi; $("#lb-next").hidden = !multi;
  }
  function openLightbox(card, i, opener) {
    lbCard = card; lbOpener = opener;
    showLb(i);
    if (typeof lb.showModal === "function") lb.showModal(); else lb.setAttribute("open", "");
    $("#lb-close").focus();
  }
  $("#lb-prev").addEventListener("click", function () { showLb(lbIndex - 1); });
  $("#lb-next").addEventListener("click", function () { showLb(lbIndex + 1); });
  $("#lb-close").addEventListener("click", function () { lb.close(); });
  lb.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") { e.preventDefault(); showLb(lbIndex - 1); }
    if (e.key === "ArrowRight") { e.preventDefault(); showLb(lbIndex + 1); }
  });
  lb.addEventListener("click", function (e) { if (e.target === lb || e.target.classList.contains("lb-inner")) lb.close(); });
  lb.addEventListener("close", function () { if (lbOpener) lbOpener.focus({ preventScroll: true }); });
  var sx = null;
  lb.addEventListener("pointerdown", function (e) { sx = e.clientX; });
  lb.addEventListener("pointerup", function (e) {
    if (sx === null) return;
    var dx = e.clientX - sx; sx = null;
    if (Math.abs(dx) > 50) showLb(lbIndex + (dx < 0 ? 1 : -1));
  });
  onLang.push(function () { if (lb.open && lbCard) showLb(lbIndex); });

  // Compare toggle
  var cmpBtn = $("#compare-toggle");
  var cardsView = $("#room-cards"), cmpView = $("#room-compare"), arrows = $("#carousel-arrows");
  cmpBtn.addEventListener("click", function () {
    var on = cmpBtn.getAttribute("aria-pressed") !== "true";
    cmpBtn.setAttribute("aria-pressed", String(on));
    cardsView.hidden = on;
    arrows.hidden = on;
    cmpView.hidden = !on;
    if (!on) updateArrows();
  });

  // "Request this room"
  $$("[data-room]").forEach(function (a) {
    a.addEventListener("click", function () {
      var v = a.getAttribute("data-room");
      var r = $('input[name="room"][value="' + v + '"]');
      if (r) r.checked = true;
      goTo(st.start && st.end ? 2 : 1, { noFocus: true });
      setTimeout(function () {
        var title = $(".panel.is-active .panel-title");
        if (title) title.focus({ preventScroll: true });
      }, reduce ? 0 : 700);
    });
  });

  /* ---------- misc ---------- */
  var y = $("#year");
  if (y) y.textContent = String(new Date().getFullYear());

  syncCounters();
  syncSteps();
  applyLang(initialLang);
  measure();
  frame();
})();
