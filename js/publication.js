$(document).ready(function () {

  // venue 약칭 배지 텍스트 (status 필드에서 접두어 제거)
  function venueLabel(statusStr) {
    if (!statusStr) return "";
    return String(statusStr)
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

  // 상태(In Preparation / Submitted / In Revision)별 배지 색상 클래스
  function statusClass(s) {
    var t = (s || "").toLowerCase();
    if (t.indexOf("prepar") !== -1) return "pub2-st-prep";
    if (t.indexOf("revision") !== -1) return "pub2-st-revision";
    if (t.indexOf("review") !== -1) return "pub2-st-review";
    if (t.indexOf("submit") !== -1) return "pub2-st-submitted";
    if (t.indexOf("accept") !== -1) return "pub2-st-accepted";
    return "";
  }

  // 미출판(투고~수락) 상태 여부 — 정렬 시 해당 연도 최상단으로
  function isPendingPub(p) {
    return /submit|revision|prepar|accept/i.test((p.progress || "") + " " + (p.sub || ""));
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

  // 네이티브 스무스 스크롤 사용 (html { scroll-behavior: smooth } 와 jQuery .animate 충돌 회피)
  function scrollToEl(el) {
    if (el && el.length) {
      var top = el[0].getBoundingClientRect().top + window.pageYOffset - 100;
      window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
    }
  }

  // ===== Journal 심사 과정 자료 (Teams · 멤버 전용) =====
  // 안 C: 라운드별 "제출본"만 나열. journal.json 항목에 아래처럼 넣습니다.
  //   "review": [
  //     { "round": "1st", "submission": "https://.../..." },
  //     { "round": "2nd", "submission": "" }   // link 비우면 회색 placeholder
  //   ]
  // (response 키는 더 이상 사용하지 않습니다.)
  function reviewProcessHTML(pub, isJournal) {
    if (!isJournal) return "";
    var rounds = pub.review || [];
    if (!rounds.length) return "";
    var chips = rounds.map(function (r) {
      if (!r || typeof r !== "object") return "";
      var label = (r.round ? r.round + " " : "") + "Submission";
      var link = r.submission || r.link || "";
      return link
        ? '<a class="pub2-rv-link" href="' + link + '" target="_blank" rel="noopener noreferrer">' + label + "</a>"
        : '<span class="pub2-rv-link pub2-rv-tbd" title="To be updated">' + label + "</span>";
    }).join("");
    if (!chips) return "";
    return '<div class="pub2-review">' +
      '<span class="pub2-review-label" title="Members only (Teams)" aria-label="Members only">&#128274;</span>' +
      chips + "</div>";
  }

  // 상태·수상 배지 (연구분야 태그는 사용하지 않음)
  function tagsHTML(pub) {
    var html = "";
    if (pub.award && pub.award.trim() !== "" && pub.award !== "Accepted") html += badge(pub.award, "pub2-award");
    if (pub.sub && pub.sub.trim() !== "") html += badge(pub.sub, "pub2-progress " + statusClass(pub.sub));
    if (pub.progress && pub.progress.trim() !== "") html += badge(pub.progress, "pub2-progress " + statusClass(pub.progress));
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

  // reference 문자열에서 월(1~12) 추출
  function monthNum(ref) {
    var MAP = { jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6, june: 6, jul: 7, july: 7, aug: 8, sep: 9, sept: 9, oct: 10, nov: 11, dec: 12 };
    // 월 뒤에 연도가 오는 "<Month> 2026" 패턴만 인식 (IDEC의 DEC 등 오탐 방지)
    var m = (ref || "").match(/(Sept|June|July|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\.?\s+20\d\d/i);
    return m ? (MAP[m[1].toLowerCase()] || 0) : 0;
  }
  // 같은 연/월 동점 시 우선순위 (JSSC > TCAS-I > TCAS-II > TVLSI, 그 외 0)
  function venuePriority(v) {
    var P = { "JSSC": 4, "TCAS-I": 3, "TCAS-II": 2, "TVLSI": 1 };
    return P[v] || 0;
  }
  // 상태별 정렬값 (위쪽일수록 큼): Submitted > In Preparation > In Revision > Accepted > Published(월)
  function sortVal(p) {
    var s = ((p.progress || "") + " " + (p.sub || "")).toLowerCase();
    if (/submit/.test(s)) return 16;
    if (/prepar/.test(s)) return 15;
    if (/revision/.test(s)) return 14;
    if (/review/.test(s)) return 13;
    if (/accept/.test(s)) return 12.5;  // Accepted는 심사중(In Review)보다 아래, 게재(월)보다 위
    // 출판된 논문: 월(1~12), 제목 없이 상태도 없는 예외는 최상단
    return (p.title && p.title.trim()) ? monthNum(p.reference) : 99;
  }
  // 연도 내림차순 → 상태/월 내림차순 → 학회 우선순위 내림차순
  function sortByRecency(pubs) {
    return pubs.slice().sort(function (a, b) {
      var ya = Number(a.year) || Number(a.type) || 0, yb = Number(b.year) || Number(b.type) || 0;
      if (ya !== yb) return yb - ya;
      var va = sortVal(a), vb = sortVal(b);
      if (va !== vb) return vb - va;
      return venuePriority(venueLabel(b.status)) - venuePriority(venueLabel(a.status));
    });
  }

  // Journal/Conference 공통 렌더링 (ISL 스타일: 좌측 번호·등급·학회, 우측 본문)
  function renderPaperList(pubs, container, venueClass, idPrefix) {
    pubs = sortByRecency(pubs);
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
      var isJournal = venueClass === "pub2-venue-journal";

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

      var reviewGroup = reviewProcessHTML(pub, isJournal);
      // 심사자료(Members only)는 저자 사진 줄 오른쪽에 우측정렬로 배치.
      var figuresSection = reviewGroup
        ? '<div class="pub-figures-row"><div class="pub-figures">' + figuresHTML(pub) + "</div>" + reviewGroup + "</div>"
        : '<div class="pub-figures">' + figuresHTML(pub) + "</div>";

      body.append(
        '<div class="pub2-entry"' + (entryId ? ' id="' + entryId + '"' : "") + ">" +
          '<div class="pub2-num">' + num + "</div>" +
          '<div class="pub2-side">' +
            '<div class="pub2-venue">' + v + "</div>" +
            (badges ? '<div class="pub2-side-badges">' + badges + "</div>" : "") +
          "</div>" +
          '<div class="pub2-body">' +
            (titleHTML ? '<div class="pub2-title">' + titleHTML + "</div>" : "") +
            (hasTitle ? '<div class="pub2-src">' + srcText + "</div>" : "") +
            (hasTitle ? '<div class="pub2-authors">' + authorsHTML(pub.authors) + "</div>" : "") +
            figuresSection +
          "</div>" +
        "</div>"
      );
    });
  }

  function renderPatentList(pubs, container, idPrefix) {
    pubs = sortByRecency(pubs);
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
          '<button type="button" class="pub2-tab pub2-tab-journal active" data-target="journal">Journal</button>' +
          '<button type="button" class="pub2-tab pub2-tab-conference" data-target="conference">Conference</button>' +
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
      window.scrollTo({ top: Math.max(0, entry.getBoundingClientRect().top + window.pageYOffset - 120), behavior: "smooth" });
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
