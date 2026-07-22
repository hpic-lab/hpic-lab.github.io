$(document).ready(function () {
  // 카테고리별 배지 색상 (시안 A)
  var CATEGORY = {
    "Grant":        { label: "Grant",        bg: "#EAF3DE", fg: "#27500A" },
    "Journal":      { label: "Journal",      bg: "#E6F1FB", fg: "#0C447C" },
    "Conference":   { label: "Conference",   bg: "#E1F5EE", fg: "#085041" },
    "Award":        { label: "Award",        bg: "#FAEEDA", fg: "#633806" },
    "Patent":       { label: "Patent",       bg: "#EEEDFE", fg: "#3C3489" },
    "Invited Talk": { label: "Invited Talk", bg: "#FAECE7", fg: "#712B13" },
    "Service":      { label: "Service",      bg: "#F1EFE8", fg: "#444441" },
    "News":         { label: "News",         bg: "#FBEAF0", fg: "#72243E" }
  };

  var OPEN_YEARS_COUNT = 3; // 최신 몇 개 연도를 펼친 상태로 시작할지

  $.getJSON("json/news/news.json").done(function (items) {
    var container = $(".news-timeline-container");
    if (container.length === 0) return;
    container.empty();

    // 연도별 그룹화 (JSON 배열 순서 유지)
    var byYear = {};
    items.forEach(function (it) {
      if (!byYear[it.year]) byYear[it.year] = [];
      byYear[it.year].push(it);
    });

    var years = Object.keys(byYear).sort(function (a, b) { return b - a; });

    years.forEach(function (year, yearIdx) {
      var isOpen = yearIdx < OPEN_YEARS_COUNT;
      var acc = $('<div class="accordion news-accordion' + (isOpen ? '' : ' start-closed') + '"></div>');
      acc.append('<h3 class="h3-items" id="' + year + '">' + year + '</h3>');

      var body = $('<div><div class="wrapper"><div class="user-card news-card news-list"></div></div></div>');
      var list = body.find(".news-list");

      var curMonth = null;
      byYear[year].forEach(function (it) {
        if (it.month !== curMonth) {
          curMonth = it.month;
          list.append('<div class="news-month">' + year + "." + it.month + "</div>");
        }
        var c = CATEGORY[it.category] || CATEGORY["News"];
        var links = (it.links || [])
          .map(function (l) {
            return ' <a href="' + l.url + '" target="_blank" rel="noopener noreferrer" class="news-link">[' + l.label + "]</a>";
          })
          .join("");
        list.append(
          '<div class="news-item">' +
            '<span class="news-badge" style="background:' + c.bg + ";color:" + c.fg + ';">' + c.label + "</span>" +
            '<p class="news-text">' + it.text + links + "</p>" +
          "</div>"
        );
      });

      acc.append(body);
      container.append(acc);
      if (yearIdx < years.length - 1) container.append("<hr />");
    });

    // 아코디언 초기화 (script.js의 초기화는 JSON 로드 전에 실행되므로 여기서 직접 수행)
    container.find(".news-accordion").each(function () {
      var $this = $(this);
      $this.accordion({
        collapsible: true,
        heightStyle: "content",
        active: $this.hasClass("start-closed") ? false : 0
      });
    });
  });
});
