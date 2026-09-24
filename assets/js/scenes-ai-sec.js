/* ============================================================
   AI va xavfsizlik sahnalari: prompt quruvchi, n8n agent videosi,
   fishing o'yini, parol o'lchagich, yakuniy raqamlar
   ============================================================ */
(function () {
  "use strict";

  /* ═══════════ 12 — prompt quruvchi ═══════════ */
  PDP.scene("prompt", { init: function (el) {
    var chips = [].slice.call(el.querySelectorAll(".chip")),
        pr = el.querySelector("[data-prompt]"), q = el.querySelector("[data-q]"),
        meter = el.querySelector("[data-meter]"), ans = el.querySelector("[data-answer]");

    var ANSWERS = [
      '<span style="color:var(--ink-mute)">Sport bilan shug\'ullaning, to\'g\'ri ovqatlaning va yetarlicha uxlang. Futbol sog\'liq uchun foydali.</span>',
      "Mashg'ulotni isinishdan boshlang, keyin to'p bilan ishlang va oxirida cho'zilish mashqlarini bajaring.",
      "Har mashg'ulot: 10 daqiqa isinish, 20 daqiqa to'p bilan o'yin, 10 daqiqa zarba mashqi. Haftada 3–4 marta.",
      '<div class="plan"><b>DUSH</b><span>Isinish + to\'p nazorati</span><b>SESH</b><span>Dam olish</span>' +
        '<b>CHOR</b><span>Pas berish o\'yini</span><b>PAY</b><span>Darvozaga zarba</span>' +
        '<b>JUMA</b><span>Dam olish</span><b>SHAN</b><span>Do\'stlar bilan o\'yin</span></div>'
    ];

    function render() {
      var on = chips.map(function (c) { return c.getAttribute("aria-pressed") === "true"; });
      var n = on.filter(Boolean).length, pct = [20, 50, 75, 100][n];
      pr.innerHTML = (on[0] ? "<em>Sen tajribali futbol murabbiyisan.</em> " : "") +
        "Futbol mashg'ulotlari rejasini tuz" +
        (on[1] ? " <em>12 yoshli bola uchun</em>" : "") +
        (on[2] ? ", <em>hafta kunlari bo'yicha jadval qil</em>" : "") + ".";
      q.textContent = pct + "%";
      meter.style.width = pct + "%";
      meter.style.backgroundPosition = pct + "% 0";
      ans.innerHTML = '<div class="fadein">' + ANSWERS[n] + "</div>";
    }
    chips.forEach(function (c) {
      c.addEventListener("click", function () {
        c.setAttribute("aria-pressed", c.getAttribute("aria-pressed") === "true" ? "false" : "true");
        render();
      });
    });
    render();
    return {};
  }});

  /* ═══════════ 13 — n8n: AI agent ish jarayoni ═══════════ */
  PDP.scene("n8n", { init: function (el) {
    var box = el.querySelector(".n8n"), nodes = el.querySelectorAll(".nd8"),
        paths = el.querySelectorAll("svg.links path"), chat = el.querySelector("[data-chat]");
    var p1 = box.querySelector(".pulse"), p2 = p1.cloneNode(); box.appendChild(p2);
    var rafs = [], typing = null;

    function travel(pulse, path, dur) {
      var L = path.getTotalLength(), t0 = performance.now();
      path.classList.add("lit");
      (function f(now) {
        var k = Math.min(1, (now - t0) / dur), pt = path.getPointAtLength(L * k);
        pulse.style.left = pt.x + "%"; pulse.style.top = pt.y + "%";
        pulse.style.opacity = k < 1 ? "1" : "0";
        if (k < 1) rafs.push(requestAnimationFrame(f));
      })(t0);
    }
    function lit(i) { nodes[i].classList.add("lit"); }
    function reset() {
      rafs.forEach(cancelAnimationFrame); rafs = [];
      chat.innerHTML = "";
      [].forEach.call(nodes, function (n) { n.classList.remove("lit"); });
      [].forEach.call(paths, function (p) { p.classList.remove("lit"); });
      p1.style.opacity = p2.style.opacity = "0";
    }

    var ctl = PDP.player(el.querySelector(".player"), 8200, function (tl) {
      tl.at(400, function () { PDP.bubble(chat, "me", "Ertaga soat 8 da matematika bor, eslatib qo'y"); });
      tl.at(1300, function () { lit(0); travel(p1, paths[0], 800); });
      tl.at(2100, function () { lit(1); });
      tl.at(3000, function () { travel(p1, paths[1], 900); travel(p2, paths[2], 900); });
      tl.at(3900, function () { lit(2); lit(3); });
      tl.at(4400, function () { typing = PDP.bubble(chat, "bot typing"); });
      tl.at(5500, function () { typing.remove(); PDP.bubble(chat, "bot", "Jadvalga yozdim. Ertaga 07:30 da eslataman!"); });
      tl.at(6600, function () { PDP.bubble(chat, "me", "Rahmat!"); });
    }, reset);

    reset();
    return { play: ctl.play, stop: function () { ctl.stop(); rafs.forEach(cancelAnimationFrame); } };
  }});

  /* ═══════════ 15 — qaysi xabar tuzoq? ═══════════ */
  PDP.scene("phish", { init: function (el) {
    var cards = el.querySelectorAll(".sms"), flags = el.querySelector("[data-flags]");
    [].forEach.call(cards, function (c) {
      c.addEventListener("click", function () {
        [].forEach.call(cards, function (x) { x.classList.add("show"); });
        flags.classList.add("on");
      });
    });
    return {
      stop: function () {
        [].forEach.call(cards, function (x) { x.classList.remove("show"); });
        flags.classList.remove("on");
      }
    };
  }});

  /* ═══════════ 16 — parol kuchi ═══════════ */
  PDP.scene("pw", { init: function (el) {
    var input = el.querySelector("input"), bar = el.querySelector(".pwbar i"),
        time = el.querySelector("[data-time]"), hint = el.querySelector("[data-hint]");
    function check() {
      var v = input.value || "", pool = 0;
      if (/[a-z]/.test(v)) pool += 26;
      if (/[A-Z]/.test(v)) pool += 26;
      if (/[0-9]/.test(v)) pool += 10;
      if (/[^a-zA-Z0-9]/.test(v)) pool += 32;
      /* taxminan: soniyasiga 100 milliard urinish */
      var s = Math.pow(pool || 1, v.length) / 1e11, txt, col, pct;
      if (!v.length) { txt = "—"; col = "#94A2A9"; pct = 0; }
      else if (s < 1) { txt = "bir zumda"; col = "#C9372C"; pct = 8; }
      else if (s < 3600) { txt = Math.round(s) + " soniya"; col = "#C9372C"; pct = 22; }
      else if (s < 86400) { txt = Math.round(s / 3600) + " soat"; col = "#E0661A"; pct = 40; }
      else if (s < 2592000) { txt = Math.round(s / 86400) + " kun"; col = "#E0661A"; pct = 56; }
      else if (s < 31536000) { txt = Math.round(s / 2592000) + " oy"; col = "#B8901F"; pct = 72; }
      else if (s < 31536000 * 1000) { txt = Math.round(s / 31536000) + " yil"; col = "#0E8C7A"; pct = 88; }
      else { txt = "millionlab yil"; col = "#0E8C7A"; pct = 100; }
      time.textContent = txt; time.style.color = col;
      bar.style.width = pct + "%"; bar.style.background = col;
      var tips = [];
      if (v.length < 12) tips.push("12+ belgi");
      if (!/[A-Z]/.test(v)) tips.push("katta harf");
      if (!/[0-9]/.test(v)) tips.push("raqam");
      if (!/[^a-zA-Z0-9]/.test(v)) tips.push("belgi (!?#)");
      hint.textContent = tips.length ? "Qo'shing: " + tips.join(" · ") : "Ajoyib — bu kuchli parol!";
    }
    input.addEventListener("input", check);
    check();
    return {};
  }});

  /* ═══════════ 20 — raqamlar sanaladi ═══════════ */
  PDP.scene("count", { init: function (el) {
    var nums = el.querySelectorAll("[data-count]"), raf = 0;
    return {
      play: function () {
        var t0 = performance.now();
        (function tick(now) {
          var k = Math.min(1, (now - t0) / 1300), e = 1 - Math.pow(1 - k, 3);
          [].forEach.call(nums, function (n) { n.textContent = Math.round(+n.getAttribute("data-count") * e); });
          if (k < 1) raf = requestAnimationFrame(tick);
        })(t0);
      },
      stop: function () { cancelAnimationFrame(raf); }
    };
  }});
})();
