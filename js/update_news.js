$(document).ready(function () {
  // 연도 바로가기 스크롤 — CSS smooth 를 잠깐 끄고 확실히 이동(방향성 버그 회피)
  function smoothScrollTo(targetY) {
    targetY = Math.max(0, targetY);
    var docEl = document.documentElement, prevSB = docEl.style.scrollBehavior;
    docEl.style.scrollBehavior = "auto";
    try { window.scrollTo({ top: targetY, behavior: "instant" }); }
    catch (e) { window.scrollTo(0, targetY); }
    setTimeout(function () { docEl.style.scrollBehavior = prevSB; }, 0);
  }

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
    // ===== 프로필 모달 자동 연동용: Award 뉴스 색인 =====
    // <u>이름</u>으로 수상자를 추출한다. profile.js가 이름 매칭으로 가져간다.
    window.newsAwards = items
      .filter(function (it) { return it.category === "Award"; })
      .map(function (it) {
        var names = [];
        it.text.replace(/<u>(.*?)<\/u>/g, function (_, n) { names.push(n); return _; });
        return {
          ym: it.year + "." + it.month,
          names: names,
          text: it.text.replace(/<\/?u>/g, ""),
          img: it.img || ""
        };
      });

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

      // 월 내림차순 정렬(최신순). 안정 정렬이라 같은 월 내 기존 순서는 유지되고,
      // 같은 월이 연속되므로 아래 curMonth 로직으로 하나의 월 헤더로 병합됨.
      var monthsSorted = byYear[year].slice().sort(function (a, b) {
        return (Number(b.month) || 0) - (Number(a.month) || 0);
      });

      var curMonth = null;
      monthsSorted.forEach(function (it) {
        if (it.month !== curMonth) {
          curMonth = it.month;
          list.append('<div class="news-month">' + year + "." + it.month + "</div>");
        }
        var catKey = CATEGORY[it.category] ? it.category : "News";
        var c = CATEGORY[catKey];
        // [Paper] 링크는 별도 표기하지 않고, 논문 제목("...") 클릭 → Publications 항목으로 이동
        var isPaper = it.category === "Journal" || it.category === "Conference";
        var links = (it.links || [])
          .filter(function (l) { return l.label !== "Paper"; })
          .map(function (l) {
            return ' <a href="' + l.url + '" target="_blank" rel="noopener noreferrer" class="news-link">[' + l.label + "]</a>";
          })
          .join("");
        // 1저자 등 학생 얼굴 사진 (문장 바로 뒤, [Paper] 링크보다 앞, 클릭 시 프로필 모달)
        var figsHTML = "";
        (it.figures || []).forEach(function (f) {
          if (/lab-logo/i.test(f)) {
            // HPIC 로고: 클릭 시 이동 없음 → 모달/커서 없이 표시
            figsHTML += ' <img src="img/' + f + '" class="news-inline-fig news-inline-logo" alt="">';
          } else {
            figsHTML += ' <img src="img/' + f + '" class="news-inline-fig" alt="" data-bs-toggle="modal" data-bs-target="#exampleModal" data-img-key="' + f + '">';
          }
        });
        links = figsHTML + links;
        // 수상 사진 등 이미지가 연결된 항목: 문장 전체를 클릭하면 라이트박스로 열림 (별도 [Photo] 링크 없음)
        // <u>이름</u> → 클릭 가능한 프로필 링크로 변환 (HPIC Lab 제외)
        var text = it.text.replace(/<u>(?!HPIC Lab<)(.*?)<\/u>/g, '<u class="news-member" title="View profile">$1</u>');
        // 논문 제목("...") 클릭 → Publications 섹션의 해당 논문으로 이동
        if (isPaper) {
          text = text.replace(/"([^"]+)"/, '<a href="#publications" class="news-title-link news-pub-jump">"$1"</a>');
        }
        list.append(
          '<div class="news-item" data-cat="' + catKey + '">' +
            '<span class="news-badge" style="background:' + c.bg + ";color:" + c.fg + ';">' + c.label + "</span>" +
            '<p class="news-text' + (it.img ? ' news-photo-sentence" data-img="' + it.img + '"' : '"') + ">" + text + links + "</p>" +
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
          return '<span class="pub2-year-link news-year-link" data-year="' + y + '">' + y + "</span>";
        })
        .join("");
      sidebar.append('<div class="pub2-year-links news-year-links">' + linksHTML + "</div>");

      // 사이드바 연도는 클릭·이동 기능 없이 현재 보는 연도만 강조한다 (updateActiveNewsYear).

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
        $("#news-gallery .news-cat-chip").removeClass("active");
        $('#news-gallery .news-cat-chip[data-cat="' + cat + '"]').addClass("active");

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

      $("#news-gallery").on("click", ".news-cat-chip", function () {
        applyNewsFilter($(this).data("cat"));
        setTimeout(updateActiveNewsYear, 50);
      });

      // 모바일: 카테고리 필터를 뉴스 콘텐츠 상단으로 옮겨 스크롤 시 상단 고정(sticky).
      // 데스크톱에서는 사이드바 원위치로 되돌린다.
      function placeNewsCatFilter() {
        var $chips = $("#news-gallery .news-cat-links");
        if (!$chips.length) return;
        var $content = $("#news-gallery .col-lg-9").first();
        if (window.matchMedia("(max-width: 991px)").matches) {
          if (!$chips.hasClass("news-cat-sticky")) {
            $content.prepend($chips);
            $chips.addClass("news-cat-sticky");
          }
        } else if ($chips.hasClass("news-cat-sticky")) {
          sidebar.append($chips);
          $chips.removeClass("news-cat-sticky");
        }
      }
      placeNewsCatFilter();
      $(window).on("resize.newscat", placeNewsCatFilter);

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

    // 논문 제목 클릭 → Publications 섹션의 해당 논문으로 이동
    container.on("click", ".news-pub-jump", function (e) {
      e.preventDefault();
      var title = $(this).text().replace(/^"|"$/g, "").trim();
      if (window.openPublicationByTitle) {
        window.openPublicationByTitle(title);
      }
    });

    // 이미지 라이트박스 (빈 곳 클릭 또는 ESC로 닫기)
    function openNewsPhoto(src) {
      if (!src) return;
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
    }

    // 문장(사진 연결된 News) 클릭 → 라이트박스. 단, 이름·링크·사진 클릭은 각자 동작 유지
    container.on("click", ".news-photo-sentence", function (e) {
      if ($(e.target).closest("a, u.news-member, img").length) return;
      openNewsPhoto($(this).data("img"));
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
