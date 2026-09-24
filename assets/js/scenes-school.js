/* ============================================================
   Maktab taqdimoti — interaktiv qismlar
   ism, klaviaturadan kod yozish, viktorina, kasb testi,
   fishing o'yini, parol namunalari va bugungi natija
   ============================================================ */
(function () {
  "use strict";

  var S = PDP.sound, KID = PDP.kid;

  /* ═══════════ 01 — ism ═══════════ */
  PDP.scene("hello", { init: function (el) {
    var input = el.querySelector("input");
    input.value = KID.name();
    var t = 0;
    input.addEventListener("input", function () {
      clearTimeout(t);
      t = setTimeout(function () { KID.set("name", input.value.trim().slice(0, 16)); }, 200);
    });
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") { input.blur(); S.ok(); PDP.confetti(40, innerWidth / 2, innerHeight * .55); }
    });
    return {};
  }});

  /* muqovadagi yozuv effekti */
  (function () {
    var el = document.querySelector("[data-type]");
    if (!el) return;
    var WORDS = ["sayt yasaysan.", "o'yin yozasan.", "botni ishga tushirasan.", "AI bilan gaplashasan.", "dasturchi bo'lasan."];
    var w = 0, i = 0, del = false;
    (function tick() {
      var word = WORDS[w];
      i += del ? -1 : 1;
      el.textContent = word.slice(0, i);
      var wait = del ? 45 : 85;
      if (!del && i === word.length) { del = true; wait = 1400; }
      else if (del && i === 0) { del = false; w = (w + 1) % WORDS.length; wait = 250; }
      setTimeout(tick, wait);
    })();
  })();

  /* ═══════════ 04 — kodni o'quvchi yozadi ═══════════ */
  PDP.scene("typeAlong", { init: function (el) {
    var pre = el.querySelector("[data-code]"), site = el.querySelector("[data-site]"),
        h = el.querySelector("[data-h]"), p = el.querySelector("[data-p]"),
        like = el.querySelector("[data-like]"), n = el.querySelector("[data-n]"),
        meter = el.querySelector("[data-meter]"), cap = el.querySelector("[data-cap]"),
        say = el.querySelector("[data-say]"), done = el.querySelector("[data-done]"),
        ghost = el.querySelector("[data-ghost]"),
        steps = [].slice.call(el.querySelectorAll(".pl-steps .tag"));

    var segs = [], ends = [], total = 0, typed = 0, stage = -1, live = false;

    function build() {
      var name = (KID.name() || "Aziza").slice(0, 14);
      var CH = [
        [["k", "<h1>"], ["", "Salom, men " + name + "!"], ["k", "</h1>"], ["", "\n"],
         ["k", "<p>"], ["", "Kelajak dasturchisi"], ["k", "</p>"], ["", "\n"],
         ["k", "<button>"], ["", "Yoqdi"], ["k", "</button>"], ["", "\n\n"]],
        [["k", "<style>"], ["", "\n  "], ["a", "body"], ["", " { "], ["f", "background"], ["", ": "], ["s", "#FFF3E8"], ["", "; }\n  "],
         ["a", "h1"], ["", " { "], ["f", "color"], ["", ": "], ["s", "#E0661A"], ["", "; }\n"], ["k", "</style>"], ["", "\n\n"]],
        [["k", "<script>"], ["", "\n  "], ["a", "tugma"], ["", "."], ["f", "onclick"], ["", " = () => "], ["a", "yoqdi"], ["", "++;\n"], ["k", "</script>"]]
      ];
      segs = []; ends = []; total = 0;
      CH.forEach(function (c) {
        c.forEach(function (x) { segs.push(x); total += x[1].length; });
        ends.push(total);
      });
    }

    function render() {
      var out = "", left = typed;
      for (var i = 0; i < segs.length && left > 0; i++) {
        var t = segs[i][1].slice(0, left);
        left -= t.length;
        out += segs[i][0] ? '<span class="' + segs[i][0] + '">' + PDP.esc(t) + "</span>" : PDP.esc(t);
      }
      pre.innerHTML = out + (typed < total ? '<span class="caret"></span>' : "");
      meter.style.width = (typed / total * 100).toFixed(1) + "%";
    }

    function applyStage(k) {
      if (k === 0) {
        h.textContent = "Salom, men " + (KID.name() || "Aziza") + "!";
        p.textContent = "Kelajak dasturchisi";
        like.style.opacity = "1"; like.style.transform = "none";
      } else if (k === 1) site.classList.add("css");
      else if (k === 2) {
        site.classList.add("js");
        [1, 2, 3].forEach(function (v, idx) {
          setTimeout(function () {
            n.textContent = String(v);
            like.classList.remove("pop"); void like.offsetWidth; like.classList.add("pop");
            S.point();
          }, 400 + idx * 450);
        });
        setTimeout(function () {
          done.classList.add("on");
          say.textContent = "Ana! Bu sening birinchi sahifang.";
          PDP.confetti(90, innerWidth * .45, innerHeight * .6);
          S.win();
          KID.set("typed", true);
        }, 1700);
      }
      S.ok();
      steps.forEach(function (s, i) { s.classList.toggle("on", i === k); });
    }

    function hit(count) {
      if (!live || typed >= total) return;
      if (ghost) ghost.hidden = true;
      cap.classList.add("hit");
      setTimeout(function () { cap.classList.remove("hit"); }, 120);
      S.key();
      typed = Math.min(total, typed + (count || 4));
      render();
      while (stage + 1 < ends.length && typed >= ends[stage + 1]) { stage++; applyStage(stage); }
      if (typed >= total) say.textContent = "Tayyor!";
      else if (typed > total * .25) say.textContent = "Zo'r, davom et!";
    }

    function reset() {
      build(); typed = 0; stage = -1;
      site.className = "site"; h.textContent = ""; p.textContent = ""; n.textContent = "0";
      like.style.opacity = "0"; like.style.transform = "";
      done.classList.remove("on");
      if (ghost) ghost.hidden = false;
      say.textContent = "bosib tur — kod o'zi yoziladi";
      steps.forEach(function (s) { s.classList.remove("on"); });
      render();
    }

    function onKey(e) {
      if (!live) return;
      var tag = (e.target && e.target.tagName) || "";
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (["ArrowLeft", "ArrowRight", "PageUp", "PageDown", "Home", "End", "Escape", " ", "f", "F", "o", "O", "t", "T", "s", "S"].indexOf(e.key) >= 0) return;
      hit(4);
    }
    document.addEventListener("keydown", onKey);
    el.addEventListener("click", function (e) { if (!e.target.closest(".pl-btn")) hit(14); });
    el.querySelector(".pl-btn").addEventListener("click", function () { reset(); });

    reset();
    return {
      play: function () { live = true; if (typed === 0) reset(); },
      stop: function () { live = false; }
    };
  }});

  /* ═══════════ kartalar (02) — ochilganda ovoz va konfetti ═══════════ */
  document.addEventListener("DOMContentLoaded", function () {
    var flips = [].slice.call(document.querySelectorAll(".flip"));
    flips.forEach(function (f) {
      f.addEventListener("click", function () {
        S.tap();
        if (flips.every(function (x) { return x.classList.contains("open"); })) {
          PDP.confetti(80); S.win();
        }
      });
    });

    /* ovoz tugmasi */
    var btn = document.getElementById("btnSound");
    function sync() { btn.setAttribute("aria-pressed", PDP.muted() ? "true" : "false"); }
    if (btn) {
      sync();
      btn.addEventListener("click", function () { PDP.toggleSound(); sync(); });
      document.addEventListener("keydown", function (e) {
        var tag = (e.target && e.target.tagName) || "";
        if (tag === "INPUT" || tag === "TEXTAREA") return;
        if (e.key === "s" || e.key === "S") { PDP.toggleSound(); sync(); }
      });
    }
  });

  /* ═══════════ 08 — parol namunalari ═══════════ */
  PDP.scene("pw", { init: function (el) {
    var input = el.querySelector("input"), bar = el.querySelector(".pwbar i"),
        time = el.querySelector("[data-time]"), hint = el.querySelector("[data-hint]"),
        presets = el.querySelector("[data-presets]");

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
      if (!tips.length) { S.ok(); PDP.confetti(50, innerWidth * .3, innerHeight * .6); }
    }
    input.addEventListener("input", check);
    if (presets) [].forEach.call(presets.children, function (b) {
      b.addEventListener("click", function () { input.value = b.textContent; S.tap(); check(); });
    });
    check();
    return {};
  }});

  /* ═══════════ 09 — fishing: topsa ball ═══════════ */
  PDP.scene("phish", { init: function (el) {
    var cards = [].slice.call(el.querySelectorAll(".sms")), flags = el.querySelector("[data-flags]"), answered = false;
    function reveal(win) {
      answered = true;
      cards.forEach(function (c) { c.classList.add("show"); });
      flags.classList.add("on");
      KID.set("phish", win ? "Topdi" : "Topmadi");
      if (win) { S.win(); PDP.confetti(90); } else S.no();
    }
    cards.forEach(function (c) {
      c.addEventListener("click", function () {
        if (answered) return;
        if (c.classList.contains("bad")) reveal(true);
        else {
          c.classList.remove("shake"); void c.offsetWidth; c.classList.add("shake");
          S.no();
          setTimeout(function () { reveal(false); }, 700);
        }
      });
    });
    return {
      stop: function () {
        answered = false;
        cards.forEach(function (c) { c.classList.remove("show", "shake"); });
        flags.classList.remove("on");
      }
    };
  }});

  /* ═══════════ 14 — viktorina ═══════════ */
  var QUESTIONS = [
    { q: "Kompyuter ichida hamma narsa qanday yoziladi?",
      a: ["Faqat 0 va 1 bilan", "Ingliz tilida", "Rasm ko'rinishida"], ok: 0,
      fact: "Har bir harf, rasm, qo'shiq va video oxir-oqibat 0 va 1 ketma-ketligiga aylanadi." },
    { q: "Minecraft o'yini qaysi dasturlash tilida yozilgan?",
      a: ["Java", "HTML", "Photoshop"], ok: 0,
      fact: "Minecraft'ning birinchi versiyasi Java'da yozilgan. HTML esa dasturlash tili emas — u sahifa tuzilishi." },
    { q: "Dasturchilar xatoni nega \"bug\", ya'ni hasharot deb atashadi?",
      a: ["Kompyuter ichiga haqiqiy hasharot kirib qolgan", "Xatolar tez ko'payadi", "Birinchi dasturchining familiyasi"], ok: 0,
      fact: "1947-yilda Mark II kompyuteridan haqiqiy kuya topilgan va uni jurnalga yopishtirib qo'yishgan." },
    { q: "Dunyodagi birinchi dasturchi kim hisoblanadi?",
      a: ["Ada Lavleys", "Bill Geyts", "Stiv Jobs"], ok: 0,
      fact: "Ada Lavleys 1843-yilda birinchi kompyuter algoritmini yozgan — o'sha paytda ishlaydigan kompyuter hali yo'q edi." }
  ];
  var LET = ["A", "B", "C", "D"];

  PDP.scene("quiz", { init: function (el) {
    var qn = el.querySelector("[data-qn]"), qs = el.querySelector("[data-qscore]"),
        qq = el.querySelector("[data-qq]"), opts = el.querySelector("[data-qopts]"),
        fact = el.querySelector("[data-qfact]"), next = el.querySelector("[data-qnext]");
    var i = 0, score = 0, answered = false;

    function pick(k) {
      if (answered) return;
      answered = true;
      var right = QUESTIONS[i].ok;
      [].forEach.call(opts.children, function (b, n) {
        b.disabled = true;
        if (n === right) { b.setAttribute("data-state", "ok"); b.querySelector(".mk").innerHTML = '<svg class="ic"><use href="#i-check"/></svg>'; }
        else if (n === k) { b.setAttribute("data-state", "no"); b.querySelector(".mk").innerHTML = '<svg class="ic"><use href="#i-x"/></svg>'; }
      });
      if (k === right) { score++; S.ok(); PDP.confetti(45, innerWidth / 2, innerHeight * .55); }
      else S.no();
      qs.textContent = "To'g'ri javob: " + score;
      fact.textContent = QUESTIONS[i].fact;
      fact.hidden = false;
      next.hidden = false;
      next.firstChild.textContent = i === QUESTIONS.length - 1 ? "Natijani ko'rish " : "Keyingi savol ";
    }

    function render() {
      answered = false;
      fact.hidden = true; next.hidden = true;
      qn.textContent = (i + 1) + " / " + QUESTIONS.length;
      qs.textContent = "To'g'ri javob: " + score;
      qq.textContent = QUESTIONS[i].q;
      opts.className = "qopts";
      opts.innerHTML = "";
      QUESTIONS[i].a.forEach(function (text, k) {
        var b = document.createElement("button");
        b.className = "qopt";
        b.innerHTML = '<span class="mk">' + LET[k] + "</span><span></span>";
        b.lastChild.textContent = text;
        b.addEventListener("click", function () { pick(k); });
        opts.appendChild(b);
      });
    }

    function done() {
      qn.textContent = QUESTIONS.length + " / " + QUESTIONS.length;
      qq.textContent = "";
      fact.hidden = true;
      opts.className = "qdone";
      opts.innerHTML = '<div class="big-n"></div><h3></h3><p class="small"></p>';
      opts.querySelector(".big-n").textContent = score + " / " + QUESTIONS.length;
      opts.querySelector("h3").textContent = score === QUESTIONS.length ? "Hammasi to'g'ri!" :
        score >= 2 ? "Yaxshi natija!" : "Zarari yo'q — buni o'rganamiz";
      opts.querySelector("p").textContent = "Kursda bunday narsalarni faqat bilib qolmaysan — o'z qo'ling bilan yasaysan.";
      next.hidden = false;
      next.firstChild.textContent = "Yana o'ynash ";
      KID.set("quiz", score + " / " + QUESTIONS.length);
      if (score >= 3) { PDP.confetti(120); S.win(); }
    }

    next.addEventListener("click", function () {
      if (opts.className === "qdone") { i = 0; score = 0; render(); return; }
      if (i === QUESTIONS.length - 1) { done(); return; }
      i++; render();
    });

    render();
    return {};
  }});

  /* ═══════════ 15 — qaysi yo'nalish senga mos ═══════════ */
  var TRACKS = {
    fe:  { t: "Frontend", c: "var(--fe)", i: "i-code",   d: "Ko'rinadigan qismni yasaysan: sayt, ilova va o'yin interfeysi. Dasturda bu 1–6-oy." },
    be:  { t: "Python backend", c: "var(--be)", i: "i-server", d: "Ko'rinmas mantiq: serverlar, ma'lumotlar bazasi va botlar. Dasturda bu 7–12-oy." },
    ai:  { t: "Sun'iy intellekt", c: "var(--ai)", i: "i-spark", d: "Modellar bilan ishlash, prompting va avtomatlashtirish. Dasturda bu 13–15-oy." },
    sec: { t: "Kiberxavfsizlik", c: "var(--sec)", i: "i-shield", d: "Himoya, zaifliklar va tarmoq. Dasturda bu 16–18-oy." }
  };
  var CQ = [
    { q: "Sinfda loyiha tayyorlayapsan. Eng yoqadigan qismi qaysi?",
      a: [["Chiroyli ko'rinishini qilish", "fe"], ["Hisob-kitob va mantiqni yig'ish", "be"],
          ["Yangi g'oya o'ylab topish", "ai"], ["Xato va kamchiliklarni topish", "sec"]] },
    { q: "Yangi ilovani ochganingda birinchi nimaga e'tibor berasan?",
      a: [["Dizayni va ranglariga", "fe"], ["Qanday ishlashiga", "be"],
          ["Aqlli funksiyalariga", "ai"], ["Qanday ruxsat so'rashiga", "sec"]] },
    { q: "Do'stlaring orasida sen ko'proq...",
      a: [["chizasan va bezaysan", "fe"], ["masala yechasan, tartib o'rnatasan", "be"],
          ["yangi narsa sinab ko'rasan", "ai"], ["ehtiyotkorsan, sirni saqlaysan", "sec"]] }
  ];

  PDP.scene("career", { init: function (el) {
    var cn = el.querySelector("[data-cn]"), cq = el.querySelector("[data-cq]"),
        opts = el.querySelector("[data-copts]"), again = el.querySelector("[data-cagain]");
    var i = 0, tally = {};

    function render() {
      again.hidden = true;
      cn.textContent = (i + 1) + " / " + CQ.length;
      cq.textContent = CQ[i].q;
      opts.className = "copts";
      opts.innerHTML = "";
      CQ[i].a.forEach(function (pair) {
        var key = pair[1], tr = TRACKS[key];
        var b = document.createElement("button");
        b.className = "copt";
        b.style.setProperty("--c", tr.c);
        b.innerHTML = '<span class="ico"><svg class="ic"><use href="#' + tr.i + '"/></svg></span><span></span>';
        b.lastChild.textContent = pair[0];
        b.addEventListener("click", function () {
          tally[key] = (tally[key] || 0) + 1;
          S.tap();
          if (i === CQ.length - 1) result();
          else { i++; render(); }
        });
        opts.appendChild(b);
      });
    }

    function result() {
      var best = "fe", max = 0;
      Object.keys(tally).forEach(function (k) { if (tally[k] > max) { max = tally[k]; best = k; } });
      var tr = TRACKS[best];
      cn.textContent = "Natija";
      cq.textContent = "";
      opts.className = "cres";
      opts.style.setProperty("--c", tr.c);
      opts.innerHTML = '<div class="ring"><svg class="ic"><use href="#' + tr.i + '"/></svg></div>' +
        "<h3></h3><p></p><p class=\"small\">Xavotir olma: kursda to'rttala yo'nalishni ham sinab ko'rasan.</p>";
      opts.querySelector("h3").textContent = tr.t;
      opts.querySelector("p").textContent = tr.d;
      again.hidden = false;
      KID.set("track", tr.t);
      S.win(); PDP.confetti(110);
    }

    again.addEventListener("click", function () { i = 0; tally = {}; render(); });
    render();
    return {};
  }});

  /* ═══════════ 16 — bugungi natija ═══════════ */
  PDP.scene("result", { init: function (el) {
    var msg = el.querySelector("[data-msg]");
    function fill() {
      var k = KID.get();
      var vals = {
        game: k.game == null ? null : k.game + " ochko",
        quiz: k.quiz,
        phish: k.phish,
        track: k.track
      };
      var empty = 0;
      [].forEach.call(el.querySelectorAll("[data-r]"), function (b) {
        var v = vals[b.getAttribute("data-r")];
        b.textContent = v || "—";
        b.classList.toggle("res-empty", !v);
        if (!v) empty++;
      });
      msg.textContent = empty === 4
        ? "Hali hech narsa bosmadik — orqaga qaytib o'yin va viktorinani sinab ko'ring!"
        : k.track
          ? "Bularning hammasini bugun 40 daqiqada qilding. Kursda esa buni o'z qo'ling bilan yozasan."
          : "Yaxshi boshlanish! 15-slaydda qaysi yo'nalish senga mos ekanini ham bilib ol.";
    }
    return { play: function () { fill(); } };
  }});
})();
