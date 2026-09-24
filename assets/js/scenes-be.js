/* ============================================================
   Python sahnalari: Telegram bot videosi, server va baza oqimi
   ============================================================ */
(function () {
  "use strict";

  function bubble(chat, cls, text) {
    var m = document.createElement("div");
    m.className = "msg " + cls;
    if (cls.indexOf("typing") >= 0) m.innerHTML = "<i></i><i></i><i></i>";
    else m.textContent = text;
    chat.appendChild(m);
    while (chat.children.length > 8) chat.removeChild(chat.firstChild);
    return m;
  }
  PDP.bubble = bubble;

  /* ═══════════ 09 — Telegram bot ═══════════ */
  PDP.scene("tgBot", { init: function (el) {
    var chat = el.querySelector("[data-chat]"), lines = el.querySelectorAll(".ln");
    function hl(g) { [].forEach.call(lines, function (l) { l.classList.toggle("hl", l.getAttribute("data-l") === String(g)); }); }
    function reset() { chat.innerHTML = ""; hl(0); }

    var typing = null, kb = null;
    var ctl = PDP.player(el.querySelector(".player"), 9200, function (tl) {
      tl.at(300, function () { hl(1); });
      tl.at(1000, function () { hl(2); });
      tl.at(1700, function () { bubble(chat, "me", "/start"); hl(3); });
      tl.at(2300, function () { typing = bubble(chat, "bot typing"); });
      tl.at(3200, function () {
        typing.remove();
        bubble(chat, "bot", "Salom, " + (PDP.kid.name() || "do'stim") + "! Qaysi shahar ob-havosi kerak?");
        kb = document.createElement("div");
        kb.className = "kb";
        ["Toshkent", "Samarqand", "Buxoro", "Andijon"].forEach(function (c) {
          var s = document.createElement("span"); s.textContent = c; kb.appendChild(s);
        });
        chat.appendChild(kb);
      });
      tl.at(4800, function () { kb.firstChild.classList.add("tap"); });
      tl.at(5300, function () { kb.remove(); bubble(chat, "me", "Toshkent"); hl(4); });
      tl.at(5900, function () { typing = bubble(chat, "bot typing"); });
      tl.at(6900, function () { typing.remove(); bubble(chat, "bot", "Toshkent: quyoshli, +27°. Soyabon kerak emas!"); });
      tl.at(7900, function () { hl(5); });
    }, reset);

    reset();
    return ctl;
  }});

  /* ═══════════ 10 — buyurtma: ilova → API → baza ═══════════ */
  PDP.scene("order", { init: function (el) {
    var nodes = el.querySelectorAll("[data-n]"), wires = el.querySelectorAll("[data-w]"),
        btn = el.querySelector("[data-order]"), ok = el.querySelector("[data-ok]"), rows = el.querySelector("[data-rows]");
    var DATA = [["Aziza", "Somsa"], ["Bekzod", "Osh"], ["Nodira", "Manti"], ["Jasur", "Burger"], ["Laylo", "Shashlik"]];
    var idx = 0, nextId = 3, busy = false, tl = PDP.timeline();

    function shoot(w, cls) { w.classList.remove("go", "back"); void w.offsetWidth; w.classList.add(cls); }
    function lit(i, on) { nodes[i].classList.toggle("lit", on); }
    function addRow() {
      var d = DATA[idx++ % DATA.length], tr = document.createElement("tr");
      tr.className = "new";
      [String(nextId++), d[0], d[1]].forEach(function (v) { var td = document.createElement("td"); td.textContent = v; tr.appendChild(td); });
      rows.appendChild(tr);
      while (rows.children.length > 4) rows.removeChild(rows.firstChild);
    }
    function run() {
      if (busy) return;
      busy = true;
      ok.classList.remove("on");
      tl.at(0, function () { lit(0, true); });
      tl.at(250, function () { shoot(wires[0], "go"); });
      tl.at(800, function () { lit(0, false); lit(1, true); });
      tl.at(1000, function () { shoot(wires[1], "go"); });
      tl.at(1550, function () { lit(1, false); lit(2, true); addRow(); });
      tl.at(2300, function () { shoot(wires[1], "back"); });
      tl.at(2850, function () { lit(2, false); lit(1, true); shoot(wires[0], "back"); });
      tl.at(3400, function () { lit(1, false); lit(0, true); ok.classList.add("on"); });
      tl.at(4400, function () { lit(0, false); busy = false; });
    }
    btn.addEventListener("click", run);

    return {
      play: run,
      stop: function () {
        tl.clear(); busy = false;
        [].forEach.call(nodes, function (n) { n.classList.remove("lit"); });
        [].forEach.call(wires, function (w) { w.classList.remove("go", "back"); });
      }
    };
  }});
})();
