/* Рендер портфолио из window.PORTFOLIO (data/projects.js).
   Правь данные в data/projects.json → npm run build-data. Логику — здесь. */
(function () {
  "use strict";
  var D = window.PORTFOLIO;
  if (!D) { console.error("Нет данных PORTFOLIO — проверь data/projects.js"); return; }

  var $ = function (id) { return document.getElementById(id); };
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]; }); };
  // slug совпадает с tools/gen_qr.py
  function slug(url) { return url.replace(/^https?:\/\//, "").replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-|-$/g, "").toLowerCase(); }
  function qrSrc(url) { return "assets/qr-" + slug(url) + ".svg"; }

  var ICON_EXT = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><path d="M15 3h6v6"/><path d="M10 14 21 3"/></svg>';
  var ICON_GH = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49 0-.24-.01-.88-.01-1.72-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05a9.3 9.3 0 0 1 5 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.6.69.49A10.02 10.02 0 0 0 22 12.25C22 6.58 17.52 2 12 2Z"/></svg>';

  /* ---------- HERO ---------- */
  if (D.meta) {
    $("hero-eyebrow").textContent = "Выпускной · " + (D.meta.course || "");
    if (D.meta.weeks) $("hero-weeks").textContent = D.meta.weeks;
  }
  $("hero-stats").innerHTML = (D.stats_hero || []).map(function (s) {
    return '<div class="hstat"><b>' + esc(s.value) + '</b><span>' + esc(s.label) + '</span></div>';
  }).join("");

  /* ---------- NUMBERS ---------- */
  $("num-grid").innerHTML = (D.stats_numbers || []).map(function (n) {
    return '<div class="num-card reveal">' +
      '<div class="big" data-count="' + n.value + '" data-dec="' + (n.decimals || 0) + '" data-prefix="' + esc(n.prefix || "") + '" data-suffix="' + esc(n.suffix || "") + '">' + esc(n.prefix || "") + "0" + esc(n.suffix || "") + '</div>' +
      '<div class="cap">' + esc(n.label) + '</div>' +
      (n.sub ? '<div class="sub">' + esc(n.sub) + '</div>' : '') +
      '</div>';
  }).join("");

  /* ---------- LEGEND ---------- */
  var ST = D.statuses || {};
  $("legend").innerHTML = Object.keys(ST).map(function (k) {
    return '<span class="badge"><span class="dot ' + k + '"></span>' + esc(ST[k].label) + '</span>';
  }).join("");

  function miniBadge(statusKey) {
    var s = ST[statusKey] || { label: statusKey };
    var color = { prod: "var(--st-prod)", done: "var(--st-done)", wip: "var(--st-wip)", research: "var(--st-research)" }[statusKey] || "var(--muted)";
    return '<span class="mini-badge" style="color:' + color + '"><span class="dot ' + statusKey + '"></span>' + esc(s.label) + '</span>';
  }

  /* ---------- FLAGSHIPS ---------- */
  $("flags").innerHTML = (D.flagships || []).map(function (f, i) {
    var chips = [];
    if (f.client) chips.push('<span class="chip">' + esc(f.client) + '</span>');
    (f.stack || []).slice(0, 6).forEach(function (t) { chips.push('<span class="chip">' + esc(t) + '</span>'); });

    var eng = (f.engineering || []).map(function (e) { return '<li>' + esc(e) + '</li>'; }).join("");
    var actions = (f.links || []).map(function (l) {
      return '<a class="btn ' + (l.primary ? "btn-grad" : "btn-ghost") + '" href="' + esc(l.url) + '" target="_blank" rel="noopener">' + esc(l.label) + ' ' + ICON_EXT + '</a>';
    }).join("");

    // сторона: скриншот + галерея + QR primary-ссылки
    var shot = f.screenshot
      ? '<div class="flag-shot"><img src="' + esc(f.screenshot) + '" data-title="' + esc(f.title) + '" alt="Превью: ' + esc(f.title) + '" loading="lazy"></div>'
      : '<div class="flag-shot placeholder"><div class="ph">' + esc(f.title) + '<br>' + miniBadgePlain(f.status) + '</div></div>';

    var gal = (f.gallery && f.gallery.length)
      ? '<div class="flag-gallery">' + f.gallery.map(function (g) {
          return '<a class="gal-item" href="' + esc(g.src) + '" target="_blank" rel="noopener"><img src="' + esc(g.src) + '" alt="' + esc(g.cap || "") + '" loading="lazy"><span>' + esc(g.cap || "") + '</span></a>';
        }).join("") + '</div>'
      : '';

    var qrLinks = (f.links || []).filter(function (l) { return l.qr; });
    var qrs = qrLinks.map(function (l) {
      return '<div class="qr-box"><img src="' + esc(qrSrc(l.url)) + '" alt="QR: ' + esc(l.label) + '"><div class="qr-t"><b>' + esc(l.label) + '</b><span>' + esc(l.url.replace(/^https?:\/\//, "")) + '</span></div></div>';
    }).join("");

    return '<article class="flag reveal">' +
      '<div class="flag-body">' +
        '<div class="flag-num">ФЛАГМАН ' + (i + 1) + " / " + D.flagships.length + '</div>' +
        '<h3>' + esc(f.title) + '</h3>' +
        '<div class="tagline">' + esc(f.tagline) + '</div>' +
        '<div class="meta-row">' + miniBadge(f.status) + chips.join("") + '</div>' +
        (f.problem ? '<p class="desc"><b>Задача.</b> ' + esc(f.problem) + '</p>' : '') +
        (f.did ? '<p class="desc"><b>Что сделал агент.</b> ' + esc(f.did) + '</p>' : '') +
        (eng ? '<div class="eng"><div class="h">// Инженерия</div><ul>' + eng + '</ul></div>' : '') +
        (f.result ? '<div class="result"><b>Результат:</b> ' + esc(f.result) + '</div>' : '') +
        '<div class="actions">' + actions + '</div>' +
      '</div>' +
      '<div class="flag-side">' +
        shot +
        gal +
        qrs +
        (f.repo ? '<div class="flag-repo">' + ICON_GH + '<span>' + esc(f.repo) + '</span></div>' : '') +
      '</div>' +
    '</article>';
  }).join("");

  function miniBadgePlain(statusKey) {
    var s = ST[statusKey] || { label: statusKey };
    return esc(s.label);
  }

  /* ---------- CATALOG ---------- */
  $("catalog-body").innerHTML = (D.catalog || []).map(function (g) {
    var cards = (g.items || []).map(function (it) {
      var stackTags = (it.stack || []).map(function (t) { return '<span class="t">' + esc(t) + '</span>'; }).join("");
      var titleHtml = it.url
        ? '<a href="' + esc(it.url) + '" target="_blank" rel="noopener">' + esc(it.title) + '</a>'
        : esc(it.title);
      return '<div class="card reveal">' +
        '<div class="c-top"><h4>' + titleHtml + '</h4>' + miniBadge(it.status) + '</div>' +
        '<p>' + esc(it.summary) + '</p>' +
        (stackTags ? '<div class="stack">' + stackTags + '</div>' : '') +
        (it.repo ? '<div class="repo">' + ICON_GH + '<span>' + esc(it.repo) + '</span></div>' : '') +
        '</div>';
    }).join("");
    return '<div class="cat-group">' +
      '<div class="cat-label reveal">' + esc(g.category) + ' <span class="cnt">' + (g.items || []).length + '</span></div>' +
      '<div class="cards">' + cards + '</div>' +
    '</div>';
  }).join("");

  /* ---------- HOW IT WORKS ---------- */
  var H = D.how_it_works;
  if (H) {
    $("how-box").innerHTML =
      '<div class="k-eyebrow">05 · За кадром</div>' +
      '<h3>' + esc(H.title) + '</h3>' +
      '<p class="h-intro">' + esc(H.intro) + '</p>' +
      '<div class="how-grid">' + (H.points || []).map(function (p) {
        return '<div class="how-cell"><div class="k">' + esc(p.k) + '</div><div class="v">' + esc(p.v) + '</div></div>';
      }).join("") + '</div>';
  }

  /* ---------- DEMOS ---------- */
  $("demo-grid").innerHTML = (D.live_demos || []).map(function (d) {
    return '<div class="demo reveal">' +
      '<img class="qr" src="' + esc(qrSrc(d.url)) + '" alt="QR: ' + esc(d.label) + '">' +
      '<b>' + esc(d.label) + '</b>' +
      '<div class="note">' + esc(d.note || "") + '</div>' +
      '<a class="btn btn-ghost open" href="' + esc(d.url) + '" target="_blank" rel="noopener">Открыть ' + ICON_EXT + '</a>' +
    '</div>';
  }).join("");

  /* ---------- FOOTER ---------- */
  var m = D.meta || {};
  $("footer").innerHTML = '<div class="wrap">' +
    '<div class="f-logo"></div>' +
    '<h4>' + esc(m.owner || "") + (m.role ? ' · ' + esc(m.role) : "") + '</h4>' +
    '<p>' + esc(m.course || "") + '</p>' +
    '<div class="mono">' + esc(m.period || "") + ' · сделано вместе с AI-агентом · ' + esc(m.date || "") + '</div>' +
  '</div>';

  /* ---------- FALLBACK ДЛЯ ОТСУТСТВУЮЩИХ КАРТИНОК ---------- */
  document.querySelectorAll("img").forEach(function (img) {
    img.addEventListener("error", function () {
      var box = img.closest(".flag-shot");
      if (box) { box.classList.add("placeholder"); box.innerHTML = '<div class="ph">' + esc(img.getAttribute("data-title") || "скриншот скоро") + '</div>'; return; }
      var gi = img.closest(".gal-item");
      if (gi) { gi.classList.add("missing"); }
    });
  });

  /* ---------- REVEAL + COUNT-UP ---------- */
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function animateCount(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var dec = parseInt(el.getAttribute("data-dec"), 10) || 0;
    var prefix = el.getAttribute("data-prefix") || "";
    var suffix = el.getAttribute("data-suffix") || "";
    if (reduce || isNaN(target)) { el.textContent = prefix + target.toFixed(dec).replace(".", ",") + suffix; return; }
    var start = performance.now(), dur = 1400;
    function step(now) {
      var p = Math.min((now - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      var val = (target * eased).toFixed(dec).replace(".", ",");
      el.textContent = prefix + val + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  if (reduce) {
    document.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("in"); });
    document.querySelectorAll("[data-count]").forEach(animateCount);
  } else if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add("in");
        e.target.querySelectorAll ? e.target.querySelectorAll("[data-count]").forEach(animateCount) : 0;
        if (e.target.hasAttribute && e.target.hasAttribute("data-count")) animateCount(e.target);
        io.unobserve(e.target);
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -60px 0px" });
    document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });
    // числа могут быть внутри reveal — наблюдаем отдельно на случай
    document.querySelectorAll("[data-count]").forEach(function (el) { io.observe(el); });
  } else {
    document.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("in"); });
    document.querySelectorAll("[data-count]").forEach(animateCount);
  }
})();
