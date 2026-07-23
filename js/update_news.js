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
        var catKey = CATEGORY[it.category] ? it.category : "News";
        var c = CATEGORY[catKey];
        var links = (it.links || [])
          .map(function (l) {
            return ' <a href="' + l.url + '" target="_blank" rel="noopener noreferrer" class="news-link">[' + l.label + "]</a>";
          })
          .join("");
        // 수상 사진 등 이미지가 연결된 항목: [Photo] 링크 → 라이트박스
        if (it.img) {
          links += ' <a href="#" class="news-link news-photo-link" data-img="' + it.img + '">[Photo]</a>';
        }
        // 관련 학생 얼굴 사진 (문장 바로 뒤, 클릭 시 프로필 모달)
        (it.figures || []).forEach(function (f) {
          links += ' <img src="img/' + f + '" class="news-inline-fig" alt="" data-bs-toggle="modal" data-bs-target="#exampleModal" data-img-key="' + f + '">';
        });
        // <u>이름</u> → 클릭 가능한 프로필 링크로 변환 (HPIC Lab 제외)
        var text = it.text.replace(/<u>(?!HPIC Lab<)(.*?)<\/u>/g, '<u class="news-member" title="View profile">$1</u>');
        list.append(
          '<div class="news-item" data-cat="' + catKey + '">' +
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

      // ===== 카테고리 필터 (Grant / Journal / Award 등) =====
      var catOrder = ["All", "Grant", "Journal", "Conference", "Award", "Patent", "Invited Talk", "Service", "News"];
      var chipsHTML = catOrder
        .map(function (key) {
          var c = key === "All" ? { label: "All", bg: "#e9e9e9", fg: "#444" } : CATEGORY[key];
          return '<span class="news-cat-chip' + (key === "All" ? " active" : "") + '" data-cat="' + key +
            '" style="background:' + c.bg + ";color:" + c.fg + ";--cc:" + c.fg + ';">' + c.label + "</span>";
        })
        .join("");
      sidebar.find(".news-cat-links").remove();
      sidebar.append('<div class="news-cat-links">' + chipsHTML + "</div>");

      function applyNewsFilter(cat) {
        sidebar.find(".news-cat-chip").removeClass("active");
        sidebar.find('.news-cat-chip[data-cat="' + cat + '"]').addClass("active");

        // 항목 표시/숨김
        container.find(".news-item").each(function () {
          $(this).toggle(cat === "All" || $(this).data("cat") === cat);
        });

        // 표시 항목이 없는 월 구분선 숨김
        container.find(".news-month").each(function () {
          var visible = $(this).nextUntil(".news-month", ".news-item").filter(function () {
            return $(this).css("display") !== "none";
          }).length > 0;
          $(this).toggle(visible);
        });

        // 연도별: 매칭 없으면 연도 자체 숨김, 필터 중에는 전부 펼침
        container.find(".news-accordion").each(function () {
          var $acc = $(this);
          var any = $acc.find(".news-item").filter(function () {
            return $(this).css("display") !== "none";
          }).length > 0;
          $acc.toggle(any);
          if (cat === "All") {
            $acc.accordion("option", "active", $acc.hasClass("start-closed") ? false : 0);
          } else if (any) {
            $acc.accordion("option", "active", 0);
          }
          if (any) $acc.accordion("refresh");
        });
      }

      sidebar.on("click", ".news-cat-chip", function () {
        applyNewsFilter($(this).data("cat"));
        setTimeout(updateActiveNewsYear, 50);
      });

      // ===== 스크롤 위치의 연도를 사이드바에서 강조 =====
      function updateActiveNewsYear() {
        var headers = container.find(".news-accordion:visible .ui-accordion-header");
        if (!headers.length) return;
        var threshold = $(window).scrollTop() + 110;
        var current = null;
        headers.each(function () {
          if ($(this).offset().top <= threshold) current = this;
        });
        if (!current) current = headers[0];
        var year = $(current).attr("id");
        sidebar.find(".news-year-link").removeClass("active");
        if (year) sidebar.find('.news-year-link[data-year="' + year + '"]').addClass("active");
      }

      var newsTick = false;
      $(window).on("scroll resize", function () {
        if (!newsTick) {
          requestAnimationFrame(function () {
            updateActiveNewsYear();
            newsTick = false;
          });
          newsTick = true;
        }
      });
      container.on("accordionactivate", function () {
        setTimeout(updateActiveNewsYear, 350);
      });
      updateActiveNewsYear();
    }

    // [Photo] 클릭 → 이미지 라이트박스 (빈 곳 클릭 또는 ESC로 닫기)
    container.on("click", ".news-photo-link", function (e) {
      e.preventDefault();
      var src = $(this).data("img");
      var overlay = $(
        '<div class="news-photo-overlay"><img src="' + src + '" alt="Award photo"></div>'
      );
      overlay.on("click", function () {
        overlay.remove();
        $(document).off("keydown.newsPhoto");
      });
      $(document).on("keydown.newsPhoto", function (ev) {
        if (ev.key === "Escape") {
          overlay.remove();
          $(document).off("keydown.newsPhoto");
        }
      });
      $("body").append(overlay);
    });

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
