$(document).ready(function () {

  // venue 약칭 배지 텍스트 (status 필드에서 접두어 제거)
  function venueLabel(statusStr) {
    if (!statusStr) return "";
    return statusStr
      .replace(/^(IEEE\/IEIE|IEEE\/ISE|ACM\/IEEE|ACM IEEE|IEEE|IEIE|IEEK|ACM)\s+/i, "")
      .replace(/^20\d\d\s+/, "")
      .trim();
  }

  function getFileName(path) {
    if (!path) return "";
    return path.split("/").pop();
  }

  function figuresHTML(pub) {
    return (pub.figure || [])
      .map(function (img) {
        var imgKey = getFileName(img);
        return '<img src="img/' + img + '" class="pub-figure" alt="Figure" style="cursor: pointer;" data-bs-toggle="modal" data-bs-target="#exampleModal" data-img-key="' + imgKey + '">';
      })
      .join("");
  }

  function badge(text, cls) {
    return '<span class="pub2-badge ' + cls + '">' + text + "</span>";
  }

  // ===== News → Publications 이동용 제목 색인 =====
  // 제목을 정규화(소문자·영숫자만)한 키로 해당 논문 항목을 찾을 수 있게 한다.
  window.pubTitleIndex = window.pubTitleIndex || {};
  function normTitle(t) {
    return (t || "").toLowerCase().replace(/<[^>]+>/g, "").replace(/[^a-z0-9가-힣]/g, "");
  }

  // ===== 프로필 모달 자동 연동용 색인 =====
  // 논문의 figure(구성원 얼굴 사진 파일명)를 키로 논문 목록을 쌓는다.
  // profile.js가 window.pubIndex[사진파일명]으로 해당 구성원의 논문을 가져가
  // 홈페이지 Publications와 같은 양식(좌측 학회 약어·배지 + 제목·출처·저자)으로 표시한다.
  window.pubIndex = window.pubIndex || {};
  function registerPub(pub, sideHTML, bodyHTML) {
    var y = Number(pub.type || pub.year) || 0;
    (pub.figure || []).forEach(function (img) {
      var k = getFileName(img);
      if (!window.pubIndex[k]) window.pubIndex[k] = [];
      window.pubIndex[k].push({ year: y, side: sideHTML, body: bodyHTML });
    });
  }

  function scrollToEl(el) {
    if (el && el.length) {
      $("html, body").animate({ scrollTop: el.offset().top - 100 }, 200);
    }
  }

  // 상태·수상 배지 (연구분야 태그는 사용하지 않음)
  function tagsHTML(pub) {
    var html = "";
    if (pub.award && pub.award.trim() !== "" && pub.award !== "Accepted") html += badge(pub.award, "pub2-award");
    if (pub.sub && pub.sub.trim() !== "") html += badge(pub.sub, "pub2-progress");
    if (pub.progress && pub.progress.trim() !== "") html += badge(pub.progress, "pub2-progress");
    return html;
  }

  // ===== 저자 풀네임 변환표 =====
  // 약어 표기를 풀네임으로 표시합니다. 키는 마침표를 뺀 형태로 적습니다.
  // (예: "M.-S. Choo" → 키 "M-S Choo") 새 이름은 여기에 추가하세요.
  var NAME_MAP = {
    "M-S Choo": "Min-Seong Choo",
    "S-H Ok": "Sang-Hyeon Ok",
    "J-G Lee": "Jae-Geon Lee",
    "K-H Lee": "Kwang-Ho Lee",
    "H Ju": "Haram Ju",
    "G-S Jeong": "Gyu-Seob Jeong",
    "W Bae": "Woorham Bae",
    "J Han": "Jaeduk Han",
    "S-M Jin": "Seung-Mo Jin",
    "D-H Kim": "Dong-Ho Kim",
    "S-H Gong": "Seung-Hwan Gong",
    "D-H Heo": "Dong-Hoe Heo",
    "S-U Kang": "Shin-Uk Kang",
    "M-G Song": "Min-Gwon Song",
    "D-H Lee": "Dong-Hyun Lee",
    "J-H Pyeon": "Jae-Hyeon Pyeon",
    "I-H Han": "In-Ho Han",
    "J-H Kwon": "Ji-Hyun Kwon",
    "J-S Kwon": "Joon-Seok Kwon",
    "S-Y Kwon": "So-Yeon Kwon",
    "S-H Kim": "Seol-Hyeon Kim",
    "T-H Kim": "Tae-Hyun Kim",
    "I-W Jang": "In-Woo Jang",
    "Y-J Byeon": "Yu-Jin Byeon",
    "D-E Lee": "Dong-Eun Lee",
    "J-H Kim": "Ji-Ho Kim",
    "D-K Jeong": "Deog-Kyoon Jeong",
    "M Seok": "Mingoo Seok"
  };

  function toFullName(author) {
    var s = author.trim();
    var prefix = "";
    var suffix = "";
    // 데이터에 "and "가 남아 있더라도 표기에서는 제거하여 쉼표로 통일
    if (/^and\s+/i.test(s)) {
      s = s.replace(/^and\s+/i, "");
    }
    // 공동 1저자 표시: * 또는 † → † 로 통일하여 표시
    var star = s.match(/[*†]+$/);
    if (star) {
      suffix = "†";
      s = s.slice(0, s.length - star[0].length).trim();
    }
    var key = s.replace(/\./g, "").replace(/\s+/g, " ").trim();
    return prefix + (NAME_MAP[key] || s) + suffix;
  }

  // 저자 목록 (모두 쉼표로 연결, "and" 미사용)
  function authorsHTML(list) {
    if (!list || list.length === 0) return "";
    var names = list.map(toFullName);
    return names.join(", ");
  }

  // 이 연도 이상은 개별 연도로 펼침, 미만은 "~2023" 한 그룹으로 묶어서 접힘
  var OPEN_FROM_YEAR = 2024;
  var OLD_GROUP_LABEL = "~" + (OPEN_FROM_YEAR - 1);

  // Journal/Conference 공통 렌더링 (ISL 스타일: 좌측 번호·등급·학회, 우측 본문)
  function renderPaperList(pubs, container, venueClass, idPrefix) {
    var numbered = pubs.filter(function (p) { return p.title && p.title.trim() !== ""; }).length;
    var n = numbered;
    var curYear = null;
    var body = null;
    var oldBody = null;

    pubs.forEach(function (pub) {
      var year = pub.type || "Others";
      var isOld = !(Number(year) >= OPEN_FROM_YEAR);
      if (isOld) {
        // 2023년 이전: "~2023" 단일 그룹으로 묶음
        if (!oldBody) {
          container.append('<div class="pub2-year collapsed" id="' + idPrefix + '-old">' + OLD_GROUP_LABEL + "</div>");
          oldBody = $('<div class="pub2-year-body" style="display:none"></div>');
          container.append(oldBody);
          curYear = null;
        }
        body = oldBody;
        if (year !== curYear) {
          curYear = year;
          oldBody.append('<div class="pub2-subyear">' + year + "</div>");
        }
      } else if (year !== curYear) {
        curYear = year;
        container.append('<div class="pub2-year" id="' + idPrefix + "-" + year + '">' + year + "</div>");
        body = $('<div class="pub2-year-body"></div>');
        container.append(body);
      }

      var hasTitle = pub.title && pub.title.trim() !== "";
      var num = hasTitle ? n-- : "&ndash;";

      var v = venueLabel(pub.status);

      var titleHTML = "";
      if (hasTitle) {
        titleHTML = pub.link && pub.link.trim() !== ""
          ? '<a href="' + pub.link + '" target="_blank" rel="noopener noreferrer" class="pub2-title-link">' + pub.title + "</a>"
          : pub.title;
      }

      // 출처 줄: reference 우선, 없으면 학회/저널 풀네임 + 연도
      // "(*Equally Credited Authors)" 문구는 목록 상단에 일괄 공지하므로 개별 항목에서는 제거
      // vol./no./pp. 및 권호(예: 12(2), 40-46) 정보도 제거하고 연도·월만 남김
      var refText = (pub.reference || "")
        .replace(/<\/?i>/gi, "")
        .replace(/[,]?\s*\(\*?\s*Equally Credited Authors\s*\)/gi, "")
        .replace(/,?\s*vol\.\s*[^,\.]+/gi, "")
        .replace(/,?\s*no\.\s*[^,\.]+/gi, "")
        .replace(/,?\s*pp\.\s*[^,\.]+/gi, "")
        .replace(/,\s*\d+\(\d+\),\s*[\d–−-]+/g, "")
        .replace(/\s{2,}/g, " ")
        .replace(/\s+,/g, ",")
        .replace(/,\s*\./g, ".")
        .replace(/\.\s*\.+/g, ".")
        .trim();
      var srcText = refText !== "" ? refText : ((pub.conference || pub.journal || "") + ", " + year);

      var badges = tagsHTML(pub);

      // 프로필 모달용 색인 등록 (Publications 섹션과 동일 양식)
      // 제목이 없는 투고/심사 중(Submitted/In Revision) 논문도 포함
      var kindClass = venueClass === "pub2-venue-journal" ? "mpub-journal" : "mpub-conf";
      var mBody;
      if (hasTitle) {
        mBody = '<div class="mpub-title">' + titleHTML + "</div>" +
                '<div class="mpub-src">' + srcText + "</div>" +
                '<div class="mpub-authors">' + authorsHTML(pub.authors) + "</div>";
      } else {
        // 제목 미공개(심사 중): 상태 문구 + 저자만 표시
        mBody = '<div class="mpub-title mpub-review">Manuscript under review</div>' +
                '<div class="mpub-authors">' + authorsHTML(pub.authors) + "</div>";
      }
      registerPub(
        pub,
        '<div class="mpub-venue ' + kindClass + '">' + v + "</div>" +
          (badges ? '<div class="pub2-side-badges">' + badges + "</div>" : ""),
        mBody
      );

      // News에서 제목 클릭 시 찾아올 수 있도록 항목에 고유 id 부여 + 색인 등록
      var entryId = "";
      var tabTarget = venueClass === "pub2-venue-journal" ? "journal" : "conference";
      if (hasTitle) {
        entryId = "pubentry-" + tabTarget + "-" + normTitle(pub.title);
        window.pubTitleIndex[normTitle(pub.title)] = { id: entryId, tab: tabTarget };
      }

      body.append(
        '<div class="pub2-entry"' + (entryId ? ' id="' + entryId + '"' : "") + ">" +
          '<div class="pub2-num">' + num + "</div>" +
          '<div class="pub2-side">' +
            '<div class="pub2-venue">' + v + "</div>" +
            (badges ? '<div class="pub2-side-badges">' + badges + "</div>" : "") +
          "</div>" +
          '<div class="pub2-body">' +
            (titleHTML ? '<div class="pub2-title">' + titleHTML + "</div>" : "") +
            '<div class="pub2-src">' + srcText + "</div>" +
            '<div class="pub2-authors">' + authorsHTML(pub.authors) + "</div>" +
            '<div class="pub-figures">' + figuresHTML(pub) + "</div>" +
          "</div>" +
        "</div>"
      );
    });
  }

  function renderPatentList(pubs, container, idPrefix) {
    var n = pubs.length;
    var curYear = null;
    var body = null;
    var oldBody = null;

    pubs.forEach(function (pub) {
      var year = String(pub.year || pub.type || "Others");
      var isOld = !(Number(year) >= OPEN_FROM_YEAR);
      if (isOld) {
        if (!oldBody) {
          container.append('<div class="pub2-year collapsed" id="' + idPrefix + '-old">' + OLD_GROUP_LABEL + "</div>");
          oldBody = $('<div class="pub2-year-body" style="display:none"></div>');
          container.append(oldBody);
          curYear = null;
        }
        body = oldBody;
        if (year !== curYear) {
          curYear = year;
          oldBody.append('<div class="pub2-subyear">' + year + "</div>");
        }
      } else if (year !== curYear) {
        curYear = year;
        container.append('<div class="pub2-year" id="' + idPrefix + "-" + year + '">' + year + "</div>");
        body = $('<div class="pub2-year-body"></div>');
        container.append(body);
      }

      var regHTML = pub.registration && pub.registration.trim() !== ""
        ? '<div class="pub2-src">' + pub.registration + "</div>"
        : "";

      // 프로필 모달용 색인 등록 (특허)
      registerPub(
        pub,
        '<div class="mpub-venue mpub-patent">' + (pub.type || "특허") + "</div>",
        '<div class="mpub-title">' + pub.title + "</div>" +
          (pub.registration ? '<div class="mpub-src">' + pub.registration + "</div>" : "") +
          '<div class="mpub-authors">' + authorsHTML(pub.inventors) + "</div>"
      );

      body.append(
        '<div class="pub2-entry">' +
          '<div class="pub2-num">' + n-- + "</div>" +
          '<div class="pub2-side">' +
            '<div class="pub2-venue">' + (pub.type || "") + "</div>" +
          "</div>" +
          '<div class="pub2-body">' +
            '<div class="pub2-badges">' + tagsHTML(pub) + "</div>" +
            '<div class="pub2-title">' + pub.title + "</div>" +
            regHTML +
            '<div class="pub2-authors">' + authorsHTML(pub.inventors) + "</div>" +
            '<div class="pub-figures">' + figuresHTML(pub) + "</div>" +
          "</div>" +
        "</div>"
      );
    });
  }

  $.when(
    $.getJSON("json/publications/journal.json"),
    $.getJSON("json/publications/conference.json"),
    $.getJSON("json/publications/patent.json")
  ).done(function (jRes, cRes, pRes) {
    var container = $(".all-publications-container");
    container.empty();

    // ===== 왼쪽 고정 사이드바: 세로 탭 + 연도 바로가기 =====
    var sidebar = $("#publications .sticky-sidebar");
    sidebar.find(".pub2-side-nav").remove();
    sidebar.append(
      '<div class="pub2-side-nav">' +
        '<p class="pub2-notice">&dagger; Equally Credited Authors</p>' +
        '<div class="pub2-side-tabs">' +
          '<button type="button" class="pub2-tab pub2-tab-journal active" data-target="journal">Journal Publication</button>' +
          '<button type="button" class="pub2-tab pub2-tab-conference" data-target="conference">Conference Proceedings</button>' +
          '<button type="button" class="pub2-tab pub2-tab-patent" data-target="patent">Patent</button>' +
        "</div>" +
        '<div class="pub2-year-links"></div>' +
      "</div>"
    );

    container.append(
      '<div class="pub2-list" id="pub2-journal"></div>' +
      '<div class="pub2-list" id="pub2-conference" style="display:none"></div>' +
      '<div class="pub2-list" id="pub2-patent" style="display:none"></div>'
    );

    renderPaperList(jRes[0] || [], $("#pub2-journal"), "pub2-venue-journal", "pubyear-journal");
    renderPaperList(cRes[0] || [], $("#pub2-conference"), "pub2-venue-conf", "pubyear-conference");
    renderPatentList(pRes[0] || [], $("#pub2-patent"), "pubyear-patent");

    // 활성 탭의 연도 바로가기 링크 갱신
    function refreshYearLinks(target) {
      var linksDiv = sidebar.find(".pub2-year-links");
      linksDiv.empty();
      $("#pub2-" + target)
        .find(".pub2-year")
        .each(function () {
          var id = $(this).attr("id");
          var label = $(this).text();
          linksDiv.append('<a href="#' + id + '" class="pub2-year-link">' + label + "</a>");
        });
    }
    refreshYearLinks("journal");

    // 탭 활성화 (스크롤 없이 표시만)
    function activateTab(target) {
      sidebar.find(".pub2-tab").removeClass("active");
      sidebar.find('.pub2-tab[data-target="' + target + '"]').addClass("active");
      container.find(".pub2-list").hide();
      $("#pub2-" + target).show();
      refreshYearLinks(target);
    }

    // 탭 전환
    sidebar.on("click", ".pub2-tab", function () {
      activateTab($(this).data("target"));
      scrollToEl($("#publications"));
    });

    // ===== News → 제목 클릭 시 해당 논문으로 이동 =====
    window.openPublicationByTitle = function (title) {
      var rec = window.pubTitleIndex[normTitle(title)];
      if (!rec) return false;
      activateTab(rec.tab);
      var entry = document.getElementById(rec.id);
      if (!entry) return false;
      // 접힌 연도 그룹 안에 있으면 펼치기
      var $body = $(entry).closest(".pub2-year-body");
      if ($body.length && $body.is(":hidden")) {
        $body.prev(".pub2-year").removeClass("collapsed");
        $body.show();
      }
      var $entry = $(entry);
      $("html, body").animate({ scrollTop: $entry.offset().top - 120 }, 300);
      // 잠깐 강조
      $entry.addClass("pub2-entry-flash");
      setTimeout(function () { $entry.removeClass("pub2-entry-flash"); }, 1600);
      return true;
    };

    // 연도 헤더 클릭으로 접기/펼치기
    container.on("click", ".pub2-year", function () {
      $(this).toggleClass("collapsed");
      $(this).next(".pub2-year-body").stop(true, false).slideToggle(250);
    });

    // 연도 바로가기 (접혀 있으면 펼친 뒤 이동)
    sidebar.on("click", ".pub2-year-link", function (e) {
      e.preventDefault();
      var header = $($(this).attr("href"));
      if (header.hasClass("collapsed")) {
        header.removeClass("collapsed");
        header.next(".pub2-year-body").show();
      }
      scrollToEl(header);
    });

    // ===== 스크롤 위치에 따라 현재 연도 헤더 강조 (시안 3) =====
    function updateActiveYear() {
      var headers = container.find(".pub2-list:visible .pub2-year");
      if (!headers.length) return;
      var threshold = $(window).scrollTop() + 110;
      var current = null;
      headers.each(function () {
        if ($(this).offset().top <= threshold) current = this;
      });
      if (!current) current = headers[0];
      headers.removeClass("pub2-year-active");
      $(current).addClass("pub2-year-active");

      // 사이드바 연도 링크도 동일하게 강조
      var id = $(current).attr("id");
      sidebar.find(".pub2-year-link").removeClass("active");
      if (id) sidebar.find('.pub2-year-link[href="#' + id + '"]').addClass("active");
    }

    var yearTick = false;
    $(window).on("scroll resize", function () {
      if (!yearTick) {
        requestAnimationFrame(function () {
          updateActiveYear();
          yearTick = false;
        });
        yearTick = true;
      }
    });
    sidebar.on("click", ".pub2-tab", function () {
      setTimeout(updateActiveYear, 50);
    });
    updateActiveYear();
  });
});
