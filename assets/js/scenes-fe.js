/* ============================================================
   Frontend sahnalari: sayt qurish videosi, jonli demo,
   blok-sxema + deploy, yulduz tutish o'yini
   ============================================================ */
(function () {
  "use strict";

  /* ═══════════ 04 — sayt noldan quriladi ═══════════ */
  PDP.scene("feBuild", { init: function (el) {
    var pre = el.querySelector("[data-code]"), site = el.querySelector("[data-site]"),
        h = el.querySelector("[data-h]"), p = el.querySelector("[data-p]"),
        like = el.querySelector("[data-like]"), n = el.querySelector("[data-n]");

    var CHUNKS = [
      [["k", "<h1>"], ["", "Salom, men Aziza!"], ["k", "</h1>"], ["", "\n"],
       ["k", "<p>"], ["", "Kelajak dasturchisi"], ["k", "</p>"], ["", "\n"],
       ["k", "<button>"], ["", "Yoqdi"], ["k", "</button>"], ["", "\n\n"]],
      [["k", "<style>"], ["", "\n  "], ["a", "body"], ["", " { "], ["f", "background"], ["", ": "], ["s", "#FFF3E8"], ["", "; }\n  "],
       ["a", "h1"], ["", " { "], ["f", "color"], ["", ": "], ["s", "#E0661A"], ["", "; }\n"], ["k", "</style>"], ["", "\n\n"]],
      [["k", "<script>"], ["", "\n  "], ["a", "tugma"], ["", "."], ["f", "onclick"], ["", " = () => "], ["a", "yoqdi"], ["", "++;\n"], ["k", "</script>"]]
    ];
    var segs = [], ends = [], total = 0;
    CHUNKS.forEach(function (c) {
      c.forEach(function (s) { segs.push(s); total += s[1].length; });
      ends.push(total);
    });

    function render(k) {
      var out = "", left = k;
      for (var i = 0; i < segs.length && left > 0; i++) {
        var t = segs[i][1].slice(0, left);
        left -= t.length;
        out += segs[i][0] ? '<span class="' + segs[i][0] + '">' + PDP.esc(t) + "</span>" : PDP.esc(t);
      }
      pre.innerHTML = out + '<span class="caret"></span>';
    }

    var SPEED = 30, PAUSE = 700;
    var duration = 300 + total * SPEED + PAUSE * 3 + 2600;

    function reset() {
      render(0);
      site.className = "site";
      h.textContent = ""; p.textContent = ""; n.textContent = "0";
      like.style.opacity = "0"; like.style.transform = "";
    }

    var ctl = PDP.player(el, duration, function (tl, step) {
      var t = 300, from = 0;
      ends.forEach(function (end, ci) {
        tl.at(t, function () { step(ci); });
        for (var k = from + 1; k <= end; k++) {
          (function (kk) { tl.at(t + (kk - from) * SPEED, function () { render(kk); }); })(k);
        }
        t += (end - from) * SPEED + PAUSE;
        from = end;
        tl.at(t - 200, [
          function () { h.textContent = "Salom, men Aziza!"; p.textContent = "Kelajak dasturchisi"; like.style.opacity = "1"; like.style.transform = "none"; },
          function () { site.classList.add("css"); },
          function () { site.classList.add("js"); }
        ][ci]);
      });
      [600, 1300, 2000].forEach(function (d, i) {
        tl.at(t + d, function () {
          n.textContent = String(i + 1);
          like.classList.remove("pop"); void like.offsetWidth; like.classList.add("pop");
        });
      });
    }, reset);

    reset();
    return ctl;
  }});

  /* ═══════════ 05 — jonli demo ═══════════ */
  (function () {
    var name = document.getElementById("fdName"), size = document.getElementById("fdSize"),
        out = document.getElementById("fdOut"), code = document.getElementById("fdCode"),
        colors = document.getElementById("fdColors"), emojis = document.getElementById("fdEmoji");
    if (!out) return;
    var PAL = ["#E0661A", "#0E8C7A", "#6248E0", "#C9372C", "#0E1418"];
    var EMO = ["🚀", "⭐", "🎮", "💡", "😎"];
    var color = PAL[0], emo = EMO[0];

    function draw() {
      var v = (name.value || "Ismim").slice(0, 14);
      out.textContent = emo + " " + v;
      out.style.color = color;
      out.style.fontSize = size.value + "px";
      code.innerHTML = '<span class="k">&lt;h1</span> <span class="a">style</span>=<span class="s">"color:' + color +
        "; font-size:" + size.value + 'px"</span><span class="k">&gt;</span>' + PDP.esc(emo + " " + v) +
        '<span class="k">&lt;/h1&gt;</span>';
    }
    function swatches(host, list, isEmoji, onPick) {
      list.forEach(function (x, i) {
        var b = document.createElement("button");
        if (isEmoji) b.textContent = x; else b.style.background = x;
        b.setAttribute("aria-label", isEmoji ? "Belgi " + x : "Rang " + (i + 1));
        b.setAttribute("aria-pressed", i === 0 ? "true" : "false");
        b.addEventListener("click", function () {
          [].forEach.call(host.children, function (c) { c.setAttribute("aria-pressed", "false"); });
          b.setAttribute("aria-pressed", "true");
          onPick(x); draw();
        });
        host.appendChild(b);
      });
    }
    swatches(colors, PAL, false, function (c) { color = c; });
    swatches(emojis, EMO, true, function (e) { emo = e; });
    name.addEventListener("input", draw);
    size.addEventListener("input", draw);
    draw();
  })();

  /* ═══════════ 06 — blok-sxema va deploy ═══════════ */
  PDP.scene("flow", { init: function (el) {
    var svg = el.querySelector("svg"), tok = svg.querySelector(".tok");
    var dps = el.querySelectorAll("[data-deploy] .dp"), link = el.querySelector("[data-link]");
    var rain = true, raf = 0, tl = PDP.timeline(), D = 3400;

    function lit(sel, on) { [].forEach.call(svg.querySelectorAll(sel), function (x) { x.classList.toggle("lit", on); }); }

    function stop() { cancelAnimationFrame(raf); tl.clear(); }
    function run() {
      stop();
      var br = rain ? "ha" : "yoq", other = rain ? "yoq" : "ha";
      var path = svg.querySelector(rain ? "#pHa" : "#pYoq"), L = path.getTotalLength(), t0 = performance.now();
      lit(".lit", false);
      [].forEach.call(dps, function (d) { d.classList.remove("on"); });
      link.classList.remove("on");
      function frame(now) {
        var q = Math.min(1, (now - t0) / D), pt = path.getPointAtLength(L * q);
        tok.setAttribute("cx", pt.x); tok.setAttribute("cy", pt.y);
        tok.style.opacity = q < 1 ? "1" : "0";
        lit('[data-n="start"]', true);
        lit('[data-e="start"]', q > .06);
        lit('[data-n="if"]', q > .16);
        lit('[data-e="' + br + '"]', q > .22);
        lit('[data-e="' + other + '"], [data-n="' + other + '"]', false);
        lit('[data-n="' + br + '"]', q > .56);
        lit('[data-e="end"]', q > .9);
        lit('[data-n="end"]', q > .97);
        if (q < 1) raf = requestAnimationFrame(frame);
      }
      raf = requestAnimationFrame(frame);
      [0, 1, 2].forEach(function (i) { tl.at(D + 500 + i * 650, function () { dps[i].classList.add("on"); }); });
      tl.at(D + 2500, function () { link.classList.add("on"); });
    }

    [].forEach.call(el.querySelectorAll("[data-rain]"), function (b) {
      b.addEventListener("click", function () {
        rain = b.getAttribute("data-rain") === "1";
        [].forEach.call(el.querySelectorAll("[data-rain]"), function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
        run();
      });
    });
    return { play: run, stop: stop };
  }});

  /* ═══════════ 07 — yulduz tutish o'yini ═══════════ */
  PDP.scene("game", { init: function (el) {
    var cv = el.querySelector("canvas"), ctx = cv.getContext("2d"), W = cv.width, H = cv.height;
    var ov = el.querySelector("[data-ov]"), ovt = el.querySelector("[data-ovt]"), ovs = el.querySelector("[data-ovs]");
    var sEl = el.querySelector("[data-score]"), tEl = el.querySelector("[data-time]");
    var startBtn = el.querySelector("[data-start]");
    var basket = { x: W / 2, w: 120, h: 26 }, items = [], score = 0, left = 30, running = false, raf = 0, last = 0, spawn = 0, best = 0;
    var sky = [];
    for (var i = 0; i < 60; i++) sky.push({ x: Math.random() * W, y: Math.random() * H, r: Math.random() * 1.6 + .3, p: Math.random() * 6 });

    function star(x, y, r, rot) {
      ctx.beginPath();
      for (var k = 0; k < 10; k++) {
        var a = rot + k * Math.PI / 5, rr = k % 2 ? r * .45 : r;
        ctx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr);
      }
      ctx.closePath();
    }
    function draw(now) {
      ctx.clearRect(0, 0, W, H);
      sky.forEach(function (s) {
        ctx.globalAlpha = .35 + .35 * Math.sin(now / 700 + s.p);
        ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, 7); ctx.fill();
      });
      ctx.globalAlpha = 1;
      items.forEach(function (it) {
        if (it.bug) {
          ctx.fillStyle = "#FB4F4F"; ctx.beginPath(); ctx.arc(it.x, it.y, 17, 0, 7); ctx.fill();
          ctx.strokeStyle = "#FB4F4F"; ctx.lineWidth = 3;
          for (var j = -1; j <= 1; j++) {
            ctx.beginPath(); ctx.moveTo(it.x - 17, it.y + j * 8); ctx.lineTo(it.x - 27, it.y + j * 11); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(it.x + 17, it.y + j * 8); ctx.lineTo(it.x + 27, it.y + j * 11); ctx.stroke();
          }
          ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(it.x - 6, it.y - 4, 3.5, 0, 7); ctx.arc(it.x + 6, it.y - 4, 3.5, 0, 7); ctx.fill();
        } else {
          ctx.fillStyle = "#FFD166"; ctx.shadowColor = "#FFD166"; ctx.shadowBlur = 16;
          star(it.x, it.y, 18, it.rot); ctx.fill(); ctx.shadowBlur = 0;
        }
      });
      var bx = basket.x - basket.w / 2, by = H - 44;
      var g = ctx.createLinearGradient(0, by, 0, by + basket.h);
      g.addColorStop(0, "#FF9A3C"); g.addColorStop(1, "#E0661A");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.moveTo(bx, by); ctx.lineTo(bx + basket.w, by);
      ctx.lineTo(bx + basket.w - 12, by + basket.h); ctx.lineTo(bx + 12, by + basket.h);
      ctx.closePath(); ctx.fill();
    }
    function loop(now) {
      var dt = Math.min(.05, (now - last) / 1000); last = now;
      if (running) {
        left -= dt; spawn -= dt;
        if (spawn <= 0) {
          spawn = .45 + Math.random() * .35;
          items.push({ x: 30 + Math.random() * (W - 60), y: -20, v: 170 + Math.random() * 120 + (30 - left) * 6, bug: Math.random() < .22, rot: 0 });
        }
        items.forEach(function (it) { it.y += it.v * dt; it.rot += dt * 2; });
        items = items.filter(function (it) {
          var hit = it.y > H - 58 && it.y < H - 18 && Math.abs(it.x - basket.x) < basket.w / 2 + 10;
          if (hit) score = Math.max(0, score + (it.bug ? -3 : 1));
          return !hit && it.y < H + 30;
        });
        sEl.textContent = score; tEl.textContent = Math.max(0, Math.ceil(left));
        if (left <= 0) end();
      }
      draw(now);
      raf = requestAnimationFrame(loop);
    }
    function end() {
      running = false; items = [];
      best = Math.max(best, score);
      ovt.textContent = "Ochko: " + score;
      ovs.textContent = "Rekord: " + best + " · Qizil xatolardan (bug) qoching!";
      startBtn.lastChild.textContent = "Yana o'ynash";
      ov.hidden = false;
    }
    function begin() {
      score = 0; left = 30; items = []; spawn = 0; running = true; ov.hidden = true;
    }
    function move(e) {
      var r = cv.getBoundingClientRect();
      basket.x = Math.max(basket.w / 2, Math.min(W - basket.w / 2, (e.clientX - r.left) / r.width * W));
    }
    cv.addEventListener("pointermove", move);
    cv.addEventListener("pointerdown", move);
    startBtn.addEventListener("click", begin);

    return {
      play: function () { cancelAnimationFrame(raf); last = performance.now(); raf = requestAnimationFrame(loop); },
      stop: function () { if (running) end(); cancelAnimationFrame(raf); }
    };
  }});
})();
