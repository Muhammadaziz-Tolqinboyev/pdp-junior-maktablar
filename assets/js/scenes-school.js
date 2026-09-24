/* ============================================================
   Maktab taqdimoti — IT viktorina (zal bilan birga o'ynaladi)
   ============================================================ */
(function () {
  "use strict";

  var QUESTIONS = [
    {
      q: "Kompyuter ichida hamma narsa qanday yoziladi?",
      a: ["Faqat 0 va 1 bilan", "Ingliz tilida", "Rasm ko'rinishida"],
      ok: 0,
      fact: "Har bir harf, rasm, qo'shiq va video oxir-oqibat 0 va 1 ketma-ketligiga aylanadi."
    },
    {
      q: "Minecraft o'yini qaysi dasturlash tilida yozilgan?",
      a: ["Java", "HTML", "Photoshop"],
      ok: 0,
      fact: "Minecraft'ning birinchi versiyasi Java'da yozilgan. HTML esa dasturlash tili emas — u sahifa tuzilishi."
    },
    {
      q: "Dasturchilar xatoni nega \"bug\", ya'ni hasharot deb atashadi?",
      a: ["Kompyuter ichiga haqiqiy hasharot kirib qolgan", "Xatolar tez ko'payadi", "Birinchi dasturchining familiyasi"],
      ok: 0,
      fact: "1947-yilda Mark II kompyuteridan haqiqiy kuya topilgan va uni jurnalga yopishtirib qo'yishgan."
    },
    {
      q: "Dunyodagi birinchi dasturchi kim hisoblanadi?",
      a: ["Ada Lavleys", "Bill Geyts", "Stiv Jobs"],
      ok: 0,
      fact: "Ada Lavleys 1843-yilda birinchi kompyuter algoritmini yozgan — o'sha paytda ishlaydigan kompyuter hali yo'q edi."
    }
  ];
  var LET = ["A", "B", "C", "D"];

  PDP.scene("quiz", { init: function (el) {
    var qn = el.querySelector("[data-qn]"), qs = el.querySelector("[data-qscore]"),
        qq = el.querySelector("[data-qq]"), opts = el.querySelector("[data-qopts]"),
        fact = el.querySelector("[data-qfact]"), next = el.querySelector("[data-qnext]");
    var i = 0, score = 0, answered = false;

    function pick(btn, k) {
      if (answered) return;
      answered = true;
      var right = QUESTIONS[i].ok;
      [].forEach.call(opts.children, function (b, n) {
        b.disabled = true;
        if (n === right) { b.setAttribute("data-state", "ok"); b.querySelector(".mk").innerHTML = '<svg class="ic"><use href="#i-check"/></svg>'; }
        else if (n === k) { b.setAttribute("data-state", "no"); b.querySelector(".mk").innerHTML = '<svg class="ic"><use href="#i-x"/></svg>'; }
      });
      if (k === right) score++;
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
        b.addEventListener("click", function () { pick(b, k); });
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
    }

    next.addEventListener("click", function () {
      if (opts.className === "qdone") { i = 0; score = 0; render(); return; }
      if (i === QUESTIONS.length - 1) { done(); return; }
      i++; render();
    });

    render();
    return {};
  }});
})();
