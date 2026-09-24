/* ============================================================
   PDP Junior — Maktablar uchun · slayd dvigateli
   · 10 DAQIQALIK YO'L: sukut bo'yicha faqat asosiy slaydlar
     ko'rsatiladi. "To'liq" tugmasi qo'shimchalarini ham ochadi (M).
   · Yuqorida vaqt hisoblagichi: har slaydning vaqt chegarasi bor
     (data-sec), kechikilsa rangi o'zgaradi.
   ============================================================ */
(function () {
  "use strict";

  var $ = function (id) { return document.getElementById(id); };
  var pad2 = function (n) { return n < 10 ? "0" + n : "" + n; };

  var ACCENTS = {
    nu:  { c: "#25313A", o: ["#8AB4FF", "#C4B5FD", "#7DE2D1"] },
    fe:  { c: "#E0661A", o: ["#FF9A3C", "#FF6B9A", "#FFD166"] },
    be:  { c: "#0E8C7A", o: ["#2FD4B4", "#38BDF8", "#A7F3D0"] },
    ai:  { c: "#6248E0", o: ["#A78BFA", "#F472B6", "#818CF8"] },
    sec: { c: "#C9372C", o: ["#FB7185", "#FDA4AF", "#FCA5A5"] }
  };

  var registry = {};
  var slides = [], perSlide = [], cur = -1, enterTimer = 0;
  var route = [], short = true, targets = [], totalSec = 0;

  var PDP = window.PDP = {
    scene: function (name, def) { registry[name] = def; },

    /* bekor qilinadigan setTimeout to'plami */
    timeline: function () {
      var ids = [];
      return {
        at: function (ms, fn) { ids.push(setTimeout(fn, ms)); },
        clear: function () { ids.forEach(clearTimeout); ids = []; }
      };
    },

    /* video-pleer: progress chizig'i, qayta ko'rish tugmasi, bosqichlar */
    player: function (el, duration, run, reset) {
      var tl = PDP.timeline(), bar = el.querySelector(".pl-bar i"), raf = 0, t0 = 0;
      var steps = [].slice.call(el.querySelectorAll(".pl-steps .tag"));
      function tick(now) {
        var p = Math.min(1, (now - t0) / duration);
        if (bar) bar.style.width = (p * 100).toFixed(1) + "%";
        if (p < 1) raf = requestAnimationFrame(tick);
      }
      function step(i) { steps.forEach(function (s, k) { s.classList.toggle("on", k === i); }); }
      function stop() { tl.clear(); cancelAnimationFrame(raf); }
      function play() {
        stop(); step(-1);
        if (reset) reset();
        t0 = performance.now(); raf = requestAnimationFrame(tick);
        run(tl, step);
      }
      var btn = el.querySelector(".pl-btn");
      if (btn) btn.addEventListener("click", play);
      return { play: play, stop: stop };
    },

    esc: function (s) {
      return String(s).replace(/[&<>"]/g, function (c) {
        return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
      });
    },

    start: start
  };

  /* ══════════ 10 daqiqalik yo'l ══════════ */
  function buildRoute() {
    route = []; targets = []; totalSec = 0;
    slides.forEach(function (s, i) {
      if (short && s.hasAttribute("data-opt")) return;
      route.push(i);
      totalSec += parseInt(s.getAttribute("data-sec") || "45", 10);
      targets[i] = totalSec;
    });
  }

  function renderNav() {
    var dots = $("dots"), ov = $("ovgrid");
    dots.innerHTML = ""; ov.innerHTML = "";
    route.forEach(function (idx, pos) {
      var name = slides[idx].getAttribute("aria-label");
      var d = document.createElement("button");
      d.setAttribute("role", "tab");
      d.setAttribute("aria-label", (pos + 1) + ". " + name);
      d.addEventListener("click", function () { go(idx); });
      dots.appendChild(d);

      var o = document.createElement("button");
      o.className = "glass ovi";
      o.innerHTML = '<div class="n"></div><div class="x"></div>';
      o.querySelector(".n").textContent = pad2(pos + 1) + " · " + fmt(parseInt(slides[idx].getAttribute("data-sec") || "45", 10));
      o.querySelector(".x").textContent = name;
      o.addEventListener("click", function () { go(idx); closeOv(); });
      ov.appendChild(o);
    });
    $("totN").textContent = pad2(route.length);
    markCurrent();
  }

  function markCurrent() {
    var pos = route.indexOf(cur);
    [].forEach.call($("dots").children, function (d, k) { d.setAttribute("aria-current", k === pos ? "true" : "false"); });
    [].forEach.call($("ovgrid").children, function (d, k) { d.setAttribute("aria-current", k === pos ? "true" : "false"); });
    $("curN").textContent = pos >= 0 ? pad2(pos + 1) : "··";
    $("bar").style.width = (((pos >= 0 ? pos + 1 : 0) / route.length) * 100).toFixed(2) + "%";
  }

  /* keyingi / oldingi — faqat yo'ldagi slaydlar bo'ylab */
  function step(dir) {
    var pos = route.indexOf(cur), n = route.length, i, next = null;
    if (pos >= 0) { go(route[(pos + dir + n) % n]); return; }
    if (dir > 0) { for (i = 0; i < n; i++) if (route[i] > cur) { next = route[i]; break; } }
    else { for (i = n - 1; i >= 0; i--) if (route[i] < cur) { next = route[i]; break; } }
    go(next === null ? route[dir > 0 ? 0 : n - 1] : next);
  }

  function go(i) {
    if (i == null || i < 0 || i >= slides.length || i === cur) return;
    if (cur >= 0) perSlide[cur].forEach(function (s) { if (s.stop) s.stop(); });
    slides.forEach(function (s, k) {
      s.classList.toggle("on", k === i);
      s.classList.toggle("past", k < i);
    });
    slides[i].scrollTop = 0;
    applyAccent(slides[i].getAttribute("data-ac"));
    if (cur === 0 && !clock.running && clock.acc === 0) startClock();
    cur = i;
    markCurrent();
    paintClock();
    if (history.replaceState) history.replaceState(null, "", "#" + (i + 1));
    clearTimeout(enterTimer);
    enterTimer = setTimeout(function () {
      perSlide[i].forEach(function (s) { if (s.play) s.play(); });
    }, 550);
  }

  function applyAccent(key) {
    var a = ACCENTS[key] || ACCENTS.nu, r = document.documentElement.style;
    r.setProperty("--ac", a.c);
    r.setProperty("--o1", a.o[0]); r.setProperty("--o2", a.o[1]); r.setProperty("--o3", a.o[2]);
  }

  /* ══════════ vaqt hisoblagichi ══════════ */
  var clock = { acc: 0, t0: 0, running: false, timer: 0 };
  function elapsed() { return clock.acc + (clock.running ? (Date.now() - clock.t0) / 1000 : 0); }
  function fmt(s) { s = Math.max(0, Math.round(s)); return Math.floor(s / 60) + ":" + ("0" + (s % 60)).slice(-2); }
  function paintClock() {
    var el = $("clock");
    if (!el) return;
    var e = elapsed(), tgt = targets[cur] || totalSec;
    el.querySelector("b").textContent = fmt(e);
    el.querySelector("span").textContent = "/ " + fmt(tgt);
    el.classList.toggle("late", e > tgt + 8 && e <= totalSec);
    el.classList.toggle("over", e > totalSec);
    el.classList.toggle("paused", !clock.running);
  }
  function startClock() {
    clock.t0 = Date.now(); clock.running = true;
    clearInterval(clock.timer);
    clock.timer = setInterval(paintClock, 500);
    paintClock();
  }
  function pauseClock() {
    if (!clock.running) return;
    clock.acc = elapsed(); clock.running = false;
    clearInterval(clock.timer); paintClock();
  }
  function resetClock() { pauseClock(); clock.acc = 0; paintClock(); }

  /* ══════════ ishga tushirish ══════════ */
  function start() {
    slides = [].slice.call(document.querySelectorAll(".slide"));

    slides.forEach(function (s, i) {
      perSlide[i] = [];
      [].forEach.call(s.querySelectorAll("[data-scene]"), function (el) {
        var def = registry[el.getAttribute("data-scene")];
        if (def) perSlide[i].push(def.init(el) || {});
      });
    });

    try { short = localStorage.getItem("pdpMode") !== "full"; } catch (e) {}
    buildRoute();
    renderNav();
    syncModeBtn();

    [].forEach.call(document.querySelectorAll(".flip"), function (f) {
      f.addEventListener("click", function () { f.classList.toggle("open"); });
    });
    [].forEach.call(document.querySelectorAll("[data-goto]"), function (el) {
      el.addEventListener("click", function () { go(parseInt(el.getAttribute("data-goto"), 10)); });
    });

    $("next").addEventListener("click", function () { step(1); });
    $("prev").addEventListener("click", function () { step(-1); });
    $("btnGrid").addEventListener("click", toggleOv);
    $("btnFs").addEventListener("click", toggleFs);
    $("btnNotes").addEventListener("click", toggleNotes);
    $("btnMode").addEventListener("click", toggleMode);
    $("clock").addEventListener("click", function () { clock.running ? pauseClock() : startClock(); });
    $("clock").addEventListener("dblclick", resetClock);

    document.addEventListener("keydown", function (e) {
      var tag = (e.target && e.target.tagName) || "";
      if (tag === "INPUT" || tag === "TEXTAREA") { if (e.key === "Escape") e.target.blur(); return; }
      if (e.key === "ArrowRight" || e.key === "PageDown" || e.key === " ") { e.preventDefault(); step(1); }
      else if (e.key === "ArrowLeft" || e.key === "PageUp") step(-1);
      else if (e.key === "Home") go(route[0]);
      else if (e.key === "End") go(route[route.length - 1]);
      else if (e.key === "f" || e.key === "F") toggleFs();
      else if (e.key === "o" || e.key === "O") toggleOv();
      else if (e.key === "t" || e.key === "T") toggleNotes();
      else if (e.key === "m" || e.key === "M") toggleMode();
      else if (e.key === "Escape") closeOv();
    });

    var tx = 0, ty = 0, skip = false;
    document.addEventListener("touchstart", function (e) {
      skip = !!(e.target.closest && e.target.closest(".gm, input"));
      tx = e.changedTouches[0].clientX; ty = e.changedTouches[0].clientY;
    }, { passive: true });
    document.addEventListener("touchend", function (e) {
      if (skip) return;
      var dx = e.changedTouches[0].clientX - tx, dy = e.changedTouches[0].clientY - ty;
      if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.6) step(dx < 0 ? 1 : -1);
    }, { passive: true });

    var h = parseInt((location.hash || "").slice(1), 10);
    go(h >= 1 && h <= slides.length ? h - 1 : 0);
    paintClock();
  }

  function toggleMode() {
    short = !short;
    try { localStorage.setItem("pdpMode", short ? "short" : "full"); } catch (e) {}
    buildRoute(); renderNav(); syncModeBtn(); paintClock();
  }
  function syncModeBtn() {
    var b = $("btnMode");
    if (!b) return;
    b.setAttribute("aria-pressed", short ? "true" : "false");
    b.title = short ? "Hozir: 10 daqiqalik yo'l (M)" : "Hozir: to'liq versiya (M)";
    b.querySelector("b").textContent = short ? "10 daq" : "To'liq";
  }

  function openOv() { $("ov").classList.add("open"); $("ov").setAttribute("aria-hidden", "false"); }
  function closeOv() { $("ov").classList.remove("open"); $("ov").setAttribute("aria-hidden", "true"); }
  function toggleOv() { $("ov").classList.contains("open") ? closeOv() : openOv(); }

  function toggleFs() {
    if (!document.fullscreenElement) {
      if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen().catch(function () {});
    } else if (document.exitFullscreen) document.exitFullscreen().catch(function () {});
  }

  var notesOn = false;
  function toggleNotes() {
    notesOn = !notesOn;
    $("btnNotes").setAttribute("aria-pressed", notesOn ? "true" : "false");
    [].forEach.call(document.querySelectorAll("[data-note]"), function (n) { n.hidden = !notesOn; });
  }
})();
