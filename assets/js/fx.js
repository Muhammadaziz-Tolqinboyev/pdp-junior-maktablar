/* ============================================================
   Effektlar: ovoz, konfetti va o'quvchi natijasi (PDP.kid)
   Zalda bolalar bilan ishlash uchun — har to'g'ri javob eshitiladi
   va ko'rinadi.
   ============================================================ */
(function () {
  "use strict";

  /* ══════════ ovoz (fayl yo'q, brauzer o'zi chaladi) ══════════ */
  var ctx = null, on = true;
  try { on = localStorage.getItem("pdpSound") !== "off"; } catch (e) {}

  function tone(freq, dur, type, vol, delay) {
    if (!on) return;
    try {
      if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
      if (ctx.state === "suspended") ctx.resume();
      var t = ctx.currentTime + (delay || 0);
      var o = ctx.createOscillator(), g = ctx.createGain();
      o.type = type || "sine";
      o.frequency.setValueAtTime(freq, t);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(vol || .12, t + .01);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g); g.connect(ctx.destination);
      o.start(t); o.stop(t + dur + .02);
    } catch (e) {}
  }

  var SOUND = {
    tap:   function () { tone(520, .06, "triangle", .07); },
    key:   function () { tone(300 + Math.random() * 260, .04, "square", .04); },
    ok:    function () { tone(660, .12, "sine", .12); tone(880, .16, "sine", .1, .1); },
    no:    function () { tone(200, .18, "sawtooth", .07); },
    point: function () { tone(1040, .07, "sine", .09); },
    win:   function () { [523, 659, 784, 1046].forEach(function (f, i) { tone(f, .18, "sine", .11, i * .09); }); }
  };

  /* ══════════ konfetti ══════════ */
  var cv, cx, parts = [], raf = 0;
  function ensureCanvas() {
    if (cv) return;
    cv = document.createElement("canvas");
    cv.className = "confetti-cv";
    document.body.appendChild(cv);
    cx = cv.getContext("2d");
    resize();
    window.addEventListener("resize", resize);
  }
  function resize() { cv.width = innerWidth; cv.height = innerHeight; }
  function loop() {
    cx.clearRect(0, 0, cv.width, cv.height);
    parts = parts.filter(function (p) { return p.life > 0 && p.y < cv.height + 40; });
    parts.forEach(function (p) {
      p.life -= 1; p.vy += .35; p.x += p.vx; p.y += p.vy; p.rot += p.vr;
      cx.save(); cx.translate(p.x, p.y); cx.rotate(p.rot);
      cx.fillStyle = p.c; cx.globalAlpha = Math.min(1, p.life / 30);
      cx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * .6);
      cx.restore();
    });
    if (parts.length) raf = requestAnimationFrame(loop);
    else { cx.clearRect(0, 0, cv.width, cv.height); raf = 0; }
  }
  function confetti(n, x, y) {
    ensureCanvas();
    var COL = ["#E0661A", "#FF9A3C", "#0E8C7A", "#2FD4B4", "#6248E0", "#A78BFA", "#FFD166", "#FB7185"];
    x = x == null ? innerWidth / 2 : x;
    y = y == null ? innerHeight / 2 : y;
    for (var i = 0; i < (n || 70); i++) {
      parts.push({
        x: x, y: y, vx: (Math.random() - .5) * 13, vy: -Math.random() * 13 - 4,
        s: 6 + Math.random() * 8, rot: Math.random() * 6, vr: (Math.random() - .5) * .35,
        life: 70 + Math.random() * 40, c: COL[(Math.random() * COL.length) | 0]
      });
    }
    if (!raf) raf = requestAnimationFrame(loop);
  }

  /* ══════════ o'quvchi natijasi ══════════ */
  var kid = { name: "", game: null, quiz: null, phish: null, track: null };
  try {
    var saved = sessionStorage.getItem("pdpKid");
    if (saved) kid = JSON.parse(saved);
  } catch (e) {}
  var subs = [];
  function save() { try { sessionStorage.setItem("pdpKid", JSON.stringify(kid)); } catch (e) {} }

  window.PDP = window.PDP || {};
  window.PDP.sound = SOUND;
  window.PDP.confetti = confetti;
  window.PDP.kid = {
    get: function (k) { return k ? kid[k] : kid; },
    set: function (k, v) { kid[k] = v; save(); subs.forEach(function (f) { f(kid); }); },
    name: function () { return kid.name || ""; },
    onChange: function (f) { subs.push(f); f(kid); }
  };
  window.PDP.muted = function () { return !on; };
  window.PDP.toggleSound = function () {
    on = !on;
    try { localStorage.setItem("pdpSound", on ? "on" : "off"); } catch (e) {}
    if (on) SOUND.tap();
    return on;
  };

  /* ism yozilgan joylarni yangilab turish: <span data-kid>...</span> */
  document.addEventListener("DOMContentLoaded", function () {
    window.PDP.kid.onChange(function (k) {
      [].forEach.call(document.querySelectorAll("[data-kid]"), function (el) {
        if (!el.getAttribute("data-kid")) el.setAttribute("data-kid", el.textContent || "Do'stim");
        el.textContent = k.name || el.getAttribute("data-kid");
      });
      document.body.classList.toggle("has-kid", !!k.name);
    });
  });
})();
