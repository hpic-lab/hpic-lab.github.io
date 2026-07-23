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
    if (/^and\s+/i.test(s)) {
      prefix = "and ";
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

  // 저자 목록 (저자가 2명이면 쉼표 없이 "A and B"로 표기)
  function authorsHTML(list) {
    if (!list || list.length === 0) return "";
    var names = list.map(toFullName);
    if (names.length === 2 && /^and\s/i.test(names[1])) {
      return names[0] + " " + names[1];
    }
    return names.join(", ");
  }

  // Journal/Conference 공통 렌더링 (ISL 스타일: 좌측 번호·등급·학회, 우측 본문)
  function renderPaperList(pubs, container, venueClass, idPrefix) {
    var numbered = pubs.filter(function (p) { return p.title && p.title.trim() !== ""; }).length;
    var n = numbered;
    var curYear = null;

    pubs.forEach(function (pub) {
      var year = pub.type || "Others";
      if (year !== curYear) {
        curYear = year;
        container.append('<div class="pub2-year" id="' + idPrefix + "-" + year + '">' + year + "</div>");
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

      container.append(
        '<div class="pub2-entry">' +
          '<div class="pub2-num">' + num + "</div>" +
          '<div class="pub2-side">' +
            '<div class="pub2-venue">' + v + "</div>" +
          "</div>" +
          '<div class="pub2-body">' +
            '<div class="pub2-badges">' + tagsHTML(pub) + "</div>" +
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

    pubs.forEach(function (pub) {
      var year = String(pub.year || pub.type || "Others");
      if (year !== curYear) {
        curYear = year;
        container.append('<div class="pub2-year" id="' + idPrefix + "-" + year + '">' + year + "</div>");
      }

      var regHTML = pub.registration && pub.registration.trim() !== ""
        ? '<div class="pub2-src">' + pub.registration + "</div>"
        : "";

      container.append(
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

    // 탭 전환
    sidebar.on("click", ".pub2-tab", function () {
      var target = $(this).data("target");
      sidebar.find(".pub2-tab").removeClass("active");
      $(this).addClass("active");
      container.find(".pub2-list").hide();
      $("#pub2-" + target).show();
      refreshYearLinks(target);
      scrollToEl($("#publications"));
    });

    // 연도 바로가기 (고정 내비게이션 높이만큼 오프셋)
    sidebar.on("click", ".pub2-year-link", function (e) {
      e.preventDefault();
      scrollToEl($($(this).attr("href")));
    });
  });
});
