$(document).ready(function () {
  // 연세대 부임 연도 — 이 연도부터는 항상 펼쳐서 표시, 이전(한양대)은 접힘
  var YONSEI_FROM = 2026;

  var TERM_BADGE = {
    "Spring": { bg: "#EAF3DE", fg: "#27500A" },
    "Summer": { bg: "#E1F5EE", fg: "#085041" },
    "Fall":   { bg: "#FAEEDA", fg: "#633806" },
    "Winter": { bg: "#E6F1FB", fg: "#0C447C" }
  };
  var TERM_ORDER = { "Winter": 4, "Fall": 3, "Summer": 2, "Spring": 1 };

  var LEVEL_BADGE = {
    "Undergraduate": { label: "Undergrad", bg: "#F1EFE8", fg: "#444441" },
    "Graduate":      { label: "Graduate",  bg: "#EEEDFE", fg: "#3C3489" }
  };

  function courseRow(c) {
    var t = TERM_BADGE[c.term] || TERM_BADGE["Spring"];
    var l = LEVEL_BADGE[c.level] || LEVEL_BADGE["Undergraduate"];
    return (
      '<div class="teach-item">' +
        '<span class="teach-badge" style="background:' + t.bg + ";color:" + t.fg + ';">' + c.term + "</span>" +
        '<span class="teach-badge teach-badge-level" style="background:' + l.bg + ";color:" + l.fg + ';">' + l.label + "</span>" +
        '<span class="teach-title">' + c.title + "</span>" +
      "</div>"
    );
  }

  $.getJSON("json/teaching.json").done(function (courses) {
    var container = $(".teaching-container");
    if (!container.length) return;
    container.empty();

    // 연도별 그룹화 (내림차순), 연도 내 학기 내림차순(Winter→Spring)
    var byYear = {};
    courses.forEach(function (c) {
      (byYear[c.year] = byYear[c.year] || []).push(c);
    });
    var years = Object.keys(byYear).map(Number).sort(function (a, b) { return b - a; });
    years.forEach(function (y) {
      byYear[y].sort(function (a, b) { return (TERM_ORDER[b.term] || 0) - (TERM_ORDER[a.term] || 0); });
    });

    var yonseiYears = years.filter(function (y) { return y >= YONSEI_FROM; });
    var hanyangYears = years.filter(function (y) { return y < YONSEI_FROM; });

    // 연세대 (항상 표시)
    yonseiYears.forEach(function (y) {
      container.append('<div class="teach-year">' + y + "</div>");
      byYear[y].forEach(function (c) { container.append(courseRow(c)); });
    });

    // 한양대 (기본 접힘)
    if (hanyangYears.length > 0) {
      var range = Math.min.apply(null, hanyangYears) + "–" + Math.max.apply(null, hanyangYears);
      container.append(
        '<div class="completed-toggle collapsed">' +
          "<span>Hanyang University (" + range + ")</span>" +
          '<span class="completed-arrow">▾</span>' +
        "</div>" +
        '<div class="teach-hanyang" style="display: none;"></div>'
      );
      var hy = container.find(".teach-hanyang");
      hanyangYears.forEach(function (y) {
        hy.append('<div class="teach-year teach-year-past">' + y + "</div>");
        byYear[y].forEach(function (c) { hy.append(courseRow(c)); });
      });

      container.on("click", ".completed-toggle", function () {
        $(this).toggleClass("collapsed");
        hy.stop(true, false).slideToggle(250);
      });
    }
  });
});
