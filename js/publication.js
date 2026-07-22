$(document).ready(function () {

  // ===== 등급(배지) 분류 기준 — 필요시 여기만 수정하세요 =====
  // Top-tier: ISSCC, VLSI Symposium, JSSC, HotChips
  // Major:    A-SSCC, ESSCIRC/ESSERC, CICC, DAC, ISCAS, ISLPED, ASP-DAC,
  //           TVLSI, TCAS-I/II, JETCAS, TIM, MWTL, ACCESS
  function tierOf(statusStr) {
    if (!statusStr) return null;
    var s = statusStr.toUpperCase();
    if (s.indexOf("TVLSI") >= 0) return "major";
    if (s.indexOf("ISSCC") >= 0 || s.indexOf("JSSC") >= 0 ||
        s.indexOf("HOTCHIPS") >= 0 || s.indexOf("HOT CHIPS") >= 0 ||
        s.indexOf("VLSI") >= 0) return "top";
    if (s.indexOf("A-SSCC") >= 0 || s.indexOf("ESSCIRC") >= 0 ||
        s.indexOf("ESSERC") >= 0 || s.indexOf("CICC") >= 0 ||
        s.indexOf("DAC") >= 0 || s.indexOf("ISCAS") >= 0 ||
        s.indexOf("ISLPED") >= 0 || s.indexOf("TCAS") >= 0 ||
        s.indexOf("JETCAS") >= 0 || s.indexOf("TIM") >= 0 ||
        s.indexOf("MWTL") >= 0 || s.indexOf("ACCESS") >= 0) return "major";
    return null;
  }

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

  // Journal/Conference 공통 렌더링
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

      var badges = "";
      var tier = tierOf(pub.status);
      if (tier === "top") badges += badge("Top-tier", "pub2-tier-top");
      if (tier === "major") badges += badge("Major", "pub2-tier-major");
      var v = venueLabel(pub.status);
      if (v) badges += badge(v, venueClass);
      if (pub.award && pub.award.trim() !== "" && pub.award !== "Accepted") badges += badge(pub.award, "pub2-award");
      if (pub.sub && pub.sub.trim() !== "") badges += badge(pub.sub, "pub2-progress");
      if (pub.progress && pub.progress.trim() !== "") badges += badge(pub.progress, "pub2-progress");

      var authorsText = pub.authors ? pub.authors.join(", ") : "";
      var titleHTML = "";
      if (hasTitle) {
        var inner = "<b>" + pub.title + "</b>";
        titleHTML = pub.link && pub.link.trim() !== ""
          ? '<a href="' + pub.link + '" target="_blank" rel="noopener noreferrer" class="pub2-title-link">' + inner + "</a>"
          : inner;
      }

      // "(*Equally Credited Authors)" 문구는 목록 상단에 일괄 공지하므로 개별 항목에서는 제거
      var refText = (pub.reference || "").replace(/[,]?\s*\(\*?\s*Equally Credited Authors\s*\)/gi, "");
      var metaHTML = authorsText;
      if (refText.trim() !== "") metaHTML += " &mdash; " + refText;

      container.append(
        '<div class="pub2-entry">' +
          '<div class="pub2-num">' + num + "</div>" +
          '<div class="pub2-body">' +
            '<div class="pub2-badges">' + badges + "</div>" +
            (titleHTML ? '<div class="pub2-title">' + titleHTML + "</div>" : "") +
            '<div class="pub2-meta">' + metaHTML + "</div>" +
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

      var badges = "";
      if (pub.type) badges += badge(pub.type, "pub2-venue-patent");
      if (pub.registration && pub.registration.trim() !== "") badges += badge(pub.registration, "pub2-progress");

      var inventorsText = pub.inventors ? pub.inventors.join(", ") : "";

      container.append(
        '<div class="pub2-entry">' +
          '<div class="pub2-num">' + n-- + "</div>" +
          '<div class="pub2-body">' +
            '<div class="pub2-badges">' + badges + "</div>" +
            '<div class="pub2-title"><b>' + pub.title + "</b></div>" +
            '<div class="pub2-meta">' + inventorsText + "</div>" +
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
        '<div class="pub2-side-tabs">' +
          '<button type="button" class="pub2-tab active" data-target="journal">Journal</button>' +
          '<button type="button" class="pub2-tab" data-target="conference">Conference</button>' +
          '<button type="button" class="pub2-tab" data-target="patent">Patent</button>' +
        "</div>" +
        '<div class="pub2-year-links"></div>' +
      "</div>"
    );

    container.append(
      '<p class="pub2-notice">* Equally Credited Authors</p>' +
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
