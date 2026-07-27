$(document).ready(function () {
  // 학회/저널 약어 → output 배지 색상 (Publications 배지와 통일)
  function outClass(label) {
    var t = String(label).toLowerCase();
    if (/patent|특허/.test(t)) return "chip-out-patent";
    if (/failed/.test(t)) return "chip-out-failed";
    return "chip-out-venue";
  }

  function outputsHTML(chip) {
    var tags = [];
    (chip.outputs || []).forEach(function (o) {
      var label = typeof o === "string" ? o : (o.label || "");
      if (!label) return;
      var cls = outClass(label);
      if (o && o.link) {
        tags.push('<a href="' + o.link + '" target="_blank" rel="noopener noreferrer" class="chip-out ' + cls + '">' + label + "</a>");
      } else {
        tags.push('<span class="chip-out ' + cls + '">' + label + "</span>");
      }
    });
    if (chip.note) tags.push('<span class="chip-out chip-out-failed">' + chip.note + "</span>");
    return tags.length ? '<div class="chip-outs">' + tags.join("") + "</div>" : "";
  }

  // 월 라벨: News와 동일한 "YYYY.MM" 형식
  function monthLabel(chip) {
    if (!chip.month || chip.month < 1) return "";
    return chip.year + "." + ("0" + chip.month).slice(-2);
  }

  // 프로필 모달이 있는 페이지(index.html)에서만 설계자 사진을 클릭 가능하게 함
  var HAS_PROFILE_MODAL = !!document.getElementById("exampleModal");

  // designer를 학생 사진(원형)으로 표시. 사진이 없으면 이름 텍스트로 대체.
  // 사진 클릭 시 해당 연구자의 상세 프로필 모달을 연다 (data-img-key = 프로필 이미지 파일명).
  function designerHTML(chip) {
    var imgs = chip.designer_imgs || [];
    if (imgs.length) {
      var h = imgs.map(function (f) {
        var key = String(f).split("/").pop();
        var link = HAS_PROFILE_MODAL ? " chip-designer-link" : "";
        var keyAttr = HAS_PROFILE_MODAL ? ' data-img-key="' + key + '"' : "";
        var titleAttr = HAS_PROFILE_MODAL ? ' title="View profile"' : "";
        return '<img class="chip-designer-photo' + link + '" src="img/' + f + '" alt=""' + keyAttr + titleAttr + ' onerror="this.remove()">';
      }).join("");
      return '<div class="chip-designers">' + h + "</div>";
    }
    if (chip.designer) return '<p class="chip-designer">' + chip.designer + "</p>";
    return "";
  }

  // 설계자 사진 클릭 → 프로필 모달 열기 (peopleDB에 해당 인물이 있을 때만)
  $(document).off("click.chipdesigner").on("click.chipdesigner", ".chip-designer-link", function () {
    var modalEl = document.getElementById("exampleModal");
    var key = $(this).data("img-key");
    if (modalEl && window.bootstrap && window.bootstrap.Modal &&
        window.peopleDB && window.peopleDB[key]) {
      window.bootstrap.Modal.getOrCreateInstance(modalEl).show(this);
    }
  });

  // venue 배지(내부 논문 연결) 클릭 → 홈페이지 Publications의 해당 논문으로 이동
  $(document).off("click.chipvenue").on("click.chipvenue", ".chip-status-venue[data-pub-title]", function (e) {
    e.preventDefault();
    var title = $(this).attr("data-pub-title");
    if (window.openPublicationByTitle && window.openPublicationByTitle(title)) return;
    var pub = document.getElementById("publications");
    if (pub) pub.scrollIntoView({ behavior: "smooth" });
  });

  function escAttr(s) {
    return String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  // 진행 상태 (단계 → 문구/색)
  var STATUS_MAP = {
    "awaiting": { t: "Awaiting chip delivery", c: "st-gray" },
    "tapeout": { t: "Tape-out completed", c: "st-gray" },
    "pcb": { t: "PCB & packaging in preparation", c: "st-gray" },
    "measurement": { t: "Measurement in progress", c: "st-amber" },
    "paper": { t: "Paper in preparation", c: "st-blue" },
    "review": { t: "Manuscript in review", c: "st-blue" },
    "accepted": { t: "Paper accepted", c: "st-green" },
    "published": { t: "Published", c: "st-green" }
  };
  function statusHTML(chip) {
    var s = STATUS_MAP[chip.status];
    if (!s) return "";
    // 상태 문구 옆 논문 대상 학회/저널 배지 (예: "Manuscript in review  [IEEE TCAS-II]")
    // venue 형태:
    //   "IEEE TCAS-II"                                  → 링크 없는 배지
    //   { label, paper: "논문 제목" }                    → 홈페이지 Publications의 해당 논문으로 이동
    //   { label, link: "https://..." }                  → 외부 링크
    var venue = "";
    if (chip.venue) {
      var isStr = typeof chip.venue === "string";
      var label = isStr ? chip.venue : (chip.venue.label || "");
      if (label) {
        if (!isStr && chip.venue.paper) {
          venue = '<a class="chip-status-venue" href="#publications" data-pub-title="' +
            escAttr(chip.venue.paper) + '">' + label + "</a>";
        } else if (!isStr && chip.venue.link) {
          venue = '<a class="chip-status-venue" href="' + chip.venue.link +
            '" target="_blank" rel="noopener noreferrer">' + label + "</a>";
        } else {
          venue = '<span class="chip-status-venue">' + label + "</span>";
        }
      }
    }
    return '<p class="chip-status ' + s.c + '"><span class="chip-status-dot"></span><span class="chip-status-txt">' + s.t + "</span>" + venue + "</p>";
  }

  // 키워드 태그 (임시, 최대 5개)
  function keywordsHTML(chip) {
    var ks = (chip.keywords || []).slice(0, 5);
    if (!ks.length) return "";
    var tags = ks.map(function (k) {
      return '<span class="chip-kw">' + k + "</span>";
    }).join("");
    return '<div class="chip-kws">' + tags + "</div>";
  }

  // 공정 문자열 → 파운드리 배지 라벨 ("28-nm T" → "T 28nm", "28-nm SS" → "S 28nm")
  function fabLabel(process) {
    if (!process) return "";
    var m = String(process).match(/(\d+)\s*-?\s*nm/i);
    var node = m ? m[1] + "nm" : "";
    var suf = String(process).replace(/\d+\s*-?\s*nm/i, "").trim();
    var fo = "";
    if (/^ss/i.test(suf)) fo = "S";       // Samsung
    else if (/^t/i.test(suf)) fo = "T";   // TSMC
    else if (suf) fo = suf[0].toUpperCase();
    return (fo ? fo + " " : "") + node || String(process);
  }

  // 공정 문자열 → 색 구분용 클래스 ("fab-t28" / "fab-s28" / "fab-t40" / "fab-t65")
  function fabClass(process) {
    if (!process) return "";
    var m = String(process).match(/(\d+)\s*-?\s*nm/i);
    if (!m) return "";
    var suf = String(process).replace(/\d+\s*-?\s*nm/i, "").trim();
    var fo = /^s/i.test(suf) ? "s" : /^t/i.test(suf) ? "t" : "";
    return fo ? "fab-" + fo + m[1] : "";
  }

  // 이 연도 이하(구형 칩)는 상태 대신 Publication을 표시. Failed는 아이콘으로.
  var GROUP_MAX = 2022;
  function isFailedChip(chip) {
    return /fail/i.test(String(chip.note || "")) || chip.status === "failed";
  }
  function failedHTML() {
    return '<p class="chip-status st-red"><span class="chip-status-dot"></span>Failed</p>';
  }

  // 안1+안B: 연번 + 썸네일 + [제목(우측 공정 배지) / 설명 / 학생 사진]
  function cardHTML(chip, num, showDescFallback) {
    // 실제 설명이 있을 때만 표시 (없으면 상태 문구가 대신함)
    var desc = chip.description && String(chip.description).trim() ? chip.description : "";
    var fab = fabLabel(chip.process);
    var fabCls = fabClass(chip.process);

    // 구형 칩(≤GROUP_MAX): 상태 문구 삭제 → 그 자리에 Publication.
    // Failed 칩은 연도와 무관하게 Failed 아이콘으로 표시.
    var isLegacy = chip.year && chip.year <= GROUP_MAX;
    var statusSlot, outputsRow;
    if (isFailedChip(chip)) {
      statusSlot = failedHTML();
      outputsRow = isLegacy ? "" : outputsHTML(chip);
    } else if (isLegacy) {
      statusSlot = outputsHTML(chip);
      outputsRow = "";  // Publication을 상태 자리로 옮겼으므로 아래 중복 표시 안 함
    } else {
      statusSlot = statusHTML(chip);
      outputsRow = outputsHTML(chip);
    }

    return (
      '<div class="chip-card2">' +
        '<div class="chip-num">' + num + "</div>" +
        '<div class="chip-thumb">' +
          (chip.image
            ? '<img src="' + chip.image + '" alt="' + (chip.name || "") + '" loading="lazy">'
            : '<div class="chip-thumb-tbd">Chip image<br>to be updated</div>') +
        "</div>" +
        '<div class="chip-info">' +
          (chip.name
            ? '<p class="chip-name">' + chip.name +
                (fab ? ' <span class="chip-fab ' + fabCls + '">' + fab + "</span>" : "") +
              "</p>"
            : "") +
          statusSlot +
          (desc ? '<p class="chip-desc">' + desc + "</p>" : "") +
          keywordsHTML(chip) +
          outputsRow +
          designerHTML(chip) +
        "</div>" +
      "</div>"
    );
  }

  // 칩이 없어도 항상 표시할 연도 (2026: 아직 칩 없음 → "To be updated.")
  var PLACEHOLDER_YEARS = [2026];
  // 기본 펼침 연도. 나머지 연도는 접힌 상태로 표시.
  var DEFAULT_OPEN_YEARS = [2026, 2025];

  // 월 라벨 없이 연번을 매겨 카드 나열 (ctr: 감소 카운터 객체)
  function yearBlock($body, chips, ctr, showDescFallback) {
    chips.forEach(function (chip) {
      $body.append(cardHTML(chip, ctr.n--, showDescFallback));
    });
  }

  // 연도별 접이식 섹션 (빈 연도 placeholder 포함). 2026/2025/2024 펼침, 나머지 접힘.
  function renderCollapsible(selector, chips) {
    var $c = $(selector);
    if (!$c.length) return;
    $c.empty();

    var byYear = {};
    chips.forEach(function (chip) {
      (byYear[chip.year] = byYear[chip.year] || []).push(chip);
    });
    var years = Object.keys(byYear).map(Number);
    PLACEHOLDER_YEARS.forEach(function (y) {
      if (years.indexOf(y) < 0) years.push(y);
    });
    years.sort(function (a, b) {
      return b - a;
    });

    // 연번: 전체 칩 수부터 감소 (최신이 큰 번호)
    var ctr = { n: chips.length };

    // GROUP_MAX 이하 연도는 "~YYYY" 하나로 묶어 접어둠(내부는 연도별 표시)
    var indivYears = years.filter(function (y) { return y > GROUP_MAX; });
    var groupYears = years.filter(function (y) { return y <= GROUP_MAX; });

    // 개별 연도 (2023~ ). 2026/2025/2024 펼침, 나머지 접힘.
    indivYears.forEach(function (y) {
      var yc = byYear[y] || [];
      var open = DEFAULT_OPEN_YEARS.indexOf(y) >= 0;
      var $header = $(
        '<div class="chip-year chip-year-toggle' + (open ? "" : " collapsed") + '" data-year="' + y + '" role="button" tabindex="0">' +
          y +
          '<span class="chip-year-caret">&#9662;</span>' +
        "</div>"
      );
      var $body = $('<div class="chip-year-body"></div>');
      if (yc.length) {
        yearBlock($body, yc, ctr, true);
      } else {
        $body.append('<p class="chip-empty">To be updated.</p>');
      }
      if (!open) $body.hide();
      $c.append($header).append($body);
    });

    // ~GROUP_MAX 묶음 (접힘, 내부 연도별 서브헤더)
    if (groupYears.length) {
      var $gh = $(
        '<div class="chip-year chip-year-toggle collapsed" data-year="~' + GROUP_MAX + '" role="button" tabindex="0">' +
          "~" + GROUP_MAX +
          '<span class="chip-year-caret">&#9662;</span>' +
        "</div>"
      );
      var $gb = $('<div class="chip-year-body"></div>');
      groupYears.forEach(function (y) {
        var yc = byYear[y] || [];
        $gb.append(
          '<div class="chip-year-sub">' + y +
          (yc.length ? "" : ' <span class="chip-year-soon">(Coming soon)</span>') +
          "</div>"
        );
        if (yc.length) yearBlock($gb, yc, ctr, false);
        else $gb.append('<p class="chip-empty">To be updated.</p>');
      });
      $gb.hide();
      $c.append($gh).append($gb);
    }

    $c.off("click.chiptoggle").on("click.chiptoggle", ".chip-year-toggle", function () {
      $(this).toggleClass("collapsed");
      $(this).next(".chip-year-body").slideToggle(180);
    });
    $c.off("keydown.chiptoggle").on("keydown.chiptoggle", ".chip-year-toggle", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        $(this).trigger("click");
      }
    });
  }

  // 좌측 사이드바 연도 네비게이션 (Publications와 동일: 현재 연도 하이라이트, 나머지 회색)
  function buildYearNav(navSelector, containerSelector) {
    var $nav = $(navSelector);
    var $c = $(containerSelector);
    if (!$nav.length || !$c.length) return;
    $nav.empty();
    $c.find(".chip-year-toggle").each(function () {
      var $h = $(this);
      var label = $h.attr("data-year");
      var id = "chipyear-" + String(label).replace("~", "p");
      $h.attr("id", id);
      var $a = $('<a href="#' + id + '" class="chip-year-link">' + label + "</a>");
      $a.on("click", function (e) {
        e.preventDefault();
        if ($h.hasClass("collapsed")) $h.trigger("click");
        $("html, body").animate({ scrollTop: $h.offset().top - 100 }, 250);
      });
      $nav.append($a);
    });

    // 스크롤 위치에 따라 현재 연도 강조
    function updateActiveYear() {
      var headers = $c.find(".chip-year-toggle");
      if (!headers.length) return;
      var threshold = $(window).scrollTop() + 130;
      var current = headers[0];
      headers.each(function () {
        if ($(this).offset().top <= threshold) current = this;
      });
      $nav.find(".chip-year-link").removeClass("active");
      var id = $(current).attr("id");
      if (id) $nav.find('.chip-year-link[href="#' + id + '"]').addClass("active");
    }

    var tick = false;
    $(window).on("scroll.chipyear resize.chipyear", function () {
      if (!tick) {
        requestAnimationFrame(function () {
          updateActiveYear();
          tick = false;
        });
        tick = true;
      }
    });
    updateActiveYear();
  }

  // Chip Gallery 콘텐츠까지 스크롤했을 때만 좌측 사이드바(제목+연도) 표시
  function setupSidebarReveal() {
    var subnav = document.querySelector("#research .research-subnav");
    var anchor = document.getElementById("chip-gallery");
    if (!subnav || !anchor) return;
    function upd() {
      // 칩 갤러리 제목이 화면 상단(약 220px) 근처까지 올라오면 표시
      subnav.classList.toggle("visible", anchor.getBoundingClientRect().top <= 220);
    }
    var ticking = false;
    window.addEventListener("scroll", function () {
      if (!ticking) {
        requestAnimationFrame(function () { upd(); ticking = false; });
        ticking = true;
      }
    });
    window.addEventListener("resize", upd);
    upd();
  }

  $.getJSON("json/chips/chips.json").done(function (chips) {
    // 메인 Research 미리보기 (접이식)
    $(".chip-timeline-preview").each(function () {
      renderCollapsible("#" + this.id, chips);
    });
    // 상세 전체 (접이식)
    renderCollapsible("#chip-timeline-full", chips);
    // 좌측 사이드바 연도 네비 (미리보기 기준)
    buildYearNav("#chip-year-nav", "#chip-timeline-preview");
    // 스크롤 시에만 사이드바 노출
    setupSidebarReveal();
  });
});
