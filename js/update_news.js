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

  var OPEN_YEARS_COUNT = 1; // 최신 몇 개 연도를 펼친 상태로 시작할지 (나머지는 접힘)

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
        // <u>이름</u> → 클릭 가능한 프로필 링크로 변환 (HPIC Lab 제외)
        var text = it.text.replace(/<u>(?!HPIC Lab<)(.*?)<\/u>/g, '<u class="news-member" title="View profile">$1</u>');
        list.append(
          '<div class="news-item">' +
            '<span class="news-badge" style="background:' + c.bg + ";color:" + c.fg + ';">' + c.label + "</span>" +
            '<p class="news-text">' + text + links + "</p>" +
          "</div>"
        );
      });

      acc.append(body);
      container.append(acc);
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

    // ===== 좌측 사이드바: 연도 바로가기 (클릭 시 해당 연도 펼치고 이동) =====
    var sidebar = $("#news-gallery .sticky-sidebar");
    if (sidebar.length) {
      sidebar.find(".news-year-links").remove();
      var linksHTML = years
        .map(function (y) {
          return '<a href="#news-year-' + y + '" class="pub2-year-link news-year-link" data-year="' + y + '">' + y + "</a>";
        })
        .join("");
      sidebar.append('<div class="pub2-year-links news-year-links">' + linksHTML + "</div>");

      sidebar.on("click", ".news-year-link", function (e) {
        e.preventDefault();
        var year = $(this).data("year");
        var header = container.find("h3#" + year);
        if (!header.length) return;
        var acc = header.closest(".news-accordion");
        // 접혀 있으면 펼치기
        if (acc.accordion("option", "active") === false) {
          acc.accordion("option", "active", 0);
        }
        $("html, body").animate({ scrollTop: header.offset().top - 100 }, 200);
      });
    }

    // 연구원 이름 클릭 → 프로필 모달 (profile.js의 window.peopleDB 활용)
    container.on("click", "u.news-member", function () {
      var givenName = $(this).text().trim();
      var db = window.peopleDB || {};
      var foundKey = null;
      for (var key in db) {
        var fullName = db[key].name || "";
        if (fullName === givenName || fullName.indexOf(givenName + " ") === 0) {
          foundKey = key;
          break;
        }
      }
      if (!foundKey) return; // 프로필이 없는 이름은 클릭해도 무반응
      this.setAttribute("data-img-key", foundKey);
      var modalEl = document.getElementById("exampleModal");
      if (modalEl && window.bootstrap && window.bootstrap.Modal) {
        window.bootstrap.Modal.getOrCreateInstance(modalEl).show(this);
      }
    });
  });
});
