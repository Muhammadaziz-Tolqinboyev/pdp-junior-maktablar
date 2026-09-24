/* ============================================================
   PDP Junior — Probniy dars · slayd dvigateli
   Sahnalar PDP.scene(nom, {init}) bilan ro'yxatdan o'tadi.
   Slaydga kirilganda play(), chiqilganda stop() chaqiriladi.
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

    /* video-pleer: progress chizig'i, qayta ko'rish tugmasi, bosqich yorliqlari */
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

  function applyAccent(key) {
    var a = ACCENTS[key] || ACCENTS.nu, r = document.documentElement.style;
    r.setProperty("--ac", a.c);
    r.setProperty("--o1", a.o[0]); r.setProperty("--o2", a.o[1]); r.setProperty("--o3", a.o[2]);
  }

  function go(i) {
    var n = slides.length;
    i = (i + n) % n;
    if (i === cur) return;
    if (cur >= 0) perSlide[cur].forEach(function (s) { if (s.stop) s.stop(); });
    slides.forEach(function (s, k) {
      s.classList.toggle("on", k === i);
      s.classList.toggle("past", k < i);
    });
    slides[i].scrollTop = 0;
    [].forEach.call($("dots").children, function (d, k) { d.setAttribute("aria-current", k === i ? "true" : "false"); });
    [].forEach.call($("ovgrid").children, function (d, k) { d.setAttribute("aria-current", k === i ? "true" : "false"); });
    applyAccent(slides[i].getAttribute("data-ac"));
    $("curN").textContent = pad2(i + 1);
    $("bar").style.width = ((i + 1) / n * 100).toFixed(2) + "%";
    cur = i;
    if (history.replaceState) history.replaceState(null, "", "#" + (i + 1));
    clearTimeout(enterTimer);
    enterTimer = setTimeout(function () {
      perSlide[i].forEach(function (s) { if (s.play) s.play(); });
    }, 550);
  }

  function start() {
    slides = [].slice.call(document.querySelectorAll(".slide"));
    $("totN").textContent = pad2(slides.length);

    slides.forEach(function (s, i) {
      var name = s.getAttribute("aria-label");
      var d = document.createElement("button");
      d.setAttribute("role", "tab");
      d.setAttribute("aria-label", (i + 1) + ". " + name);
      d.addEventListener("click", function () { go(i); });
      $("dots").appendChild(d);

      var o = document.createElement("button");
      o.className = "glass ovi";
      o.innerHTML = '<div class="n"></div><div class="x"></div>';
      o.querySelector(".n").textContent = pad2(i + 1);
      o.querySelector(".x").textContent = name;
      o.addEventListener("click", function () { go(i); closeOv(); });
      $("ovgrid").appendChild(o);

      perSlide[i] = [];
      [].forEach.call(s.querySelectorAll("[data-scene]"), function (el) {
        var def = registry[el.getAttribute("data-scene")];
        if (def) perSlide[i].push(def.init(el) || {});
      });
    });

    /* umumiy: aylanuvchi kartalar va o'tish tugmalari */
    [].forEach.call(document.querySelectorAll(".flip"), function (f) {
      f.addEventListener("click", function () { f.classList.toggle("open"); });
    });
    [].forEach.call(document.querySelectorAll("[data-goto]"), function (el) {
      el.addEventListener("click", function () { go(parseInt(el.getAttribute("data-goto"), 10)); });
    });

    $("next").addEventListener("click", function () { go(cur + 1); });
    $("prev").addEventListener("click", function () { go(cur - 1); });
    $("btnGrid").addEventListener("click", toggleOv);
    $("btnFs").addEventListener("click", toggleFs);
    $("btnNotes").addEventListener("click", toggleNotes);

    document.addEventListener("keydown", function (e) {
      var tag = (e.target && e.target.tagName) || "";
      if (tag === "INPUT" || tag === "TEXTAREA") { if (e.key === "Escape") e.target.blur(); return; }
      if (e.key === "ArrowRight" || e.key === "PageDown" || e.key === " ") { e.preventDefault(); go(cur + 1); }
      else if (e.key === "ArrowLeft" || e.key === "PageUp") go(cur - 1);
      else if (e.key === "Home") go(0);
      else if (e.key === "End") go(slides.length - 1);
      else if (e.key === "f" || e.key === "F") toggleFs();
      else if (e.key === "o" || e.key === "O") toggleOv();
      else if (e.key === "t" || e.key === "T") toggleNotes();
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
      if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.6) go(dx < 0 ? cur + 1 : cur - 1);
    }, { passive: true });

    var h = parseInt((location.hash || "").slice(1), 10);
    go(h >= 1 && h <= slides.length ? h - 1 : 0);
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
