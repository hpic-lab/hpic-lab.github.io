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
    // note가 "Failed"인 경우는 상태 아이콘(failedHTML)이 대신 표시하므로 여기서는 제외
    if (chip.note && !/fail/i.test(chip.note)) tags.push('<span class="chip-out chip-out-failed">' + chip.note + "</span>");
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

  // Design Review 자료 링크 (Teams/SharePoint · 멤버 전용). 설계자 사진 우측에 우측정렬로 표시.
  function reviewHTML(chip) {
    if (!chip.review_link) return "";
    return '<div class="chip-review">' +
      '<span class="chip-review-label" title="Members only (Teams)" aria-label="Members only">&#128274;</span>' +
      '<a class="chip-rv-link" href="' + escAttr(chip.review_link) +
        '" target="_blank" rel="noopener noreferrer">Design Review</a>' +
      "</div>";
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
    "completed": { t: "Measurement completed", c: "st-green" },
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
    // 과제(수행) 배지: 논문 대신 과제 산출물로 마무리된 칩에 과제명을 표기
    var project = "";
    if (chip.project) {
      project = '<span class="chip-status-project">' + escAttr(chip.project) + "</span>";
    }
    return '<p class="chip-status ' + s.c + '"><span class="chip-status-dot"></span><span class="chip-status-txt">' + s.t + "</span>" + venue + project + "</p>";
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
  // 실패 원인 박스 (Failed 칩에 fail_reasons 배열이 있을 때)
  // reviewHtml 이 주어지면 헤더 우측(같은 줄)에 Design Review 배지를 배치한다.
  function rootCauseHTML(chip, reviewHtml) {
    var reasons = (chip && chip.fail_reasons) || [];
    if (!reasons.length) return "";
    var lis = reasons.map(function (r) { return "<li>" + r + "</li>"; }).join("");
    var revised = chip.revised_into
      ? '<div class="chip-rc-revised">&#8594; ' + chip.revised_into + "</div>"
      : "";
    return '<div class="chip-rootcause">' +
      '<div class="chip-rootcause-h"><span class="chip-rc-ico">&#9888;</span><span class="chip-rc-title">Root cause</span>' + (reviewHtml || "") + "</div>" +
      "<ul>" + lis + "</ul>" +
      revised +
    "</div>";
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
    var failed = isFailedChip(chip);
    var statusSlot, outputsRow;
    if (failed) {
      statusSlot = "";  // Failed 는 제목 옆 배지로 이동 (아래 failBadge)
      outputsRow = isLegacy ? "" : outputsHTML(chip);
    } else if (isLegacy) {
      statusSlot = outputsHTML(chip);
      outputsRow = "";  // Publication을 상태 자리로 옮겼으므로 아래 중복 표시 안 함
    } else {
      statusSlot = statusHTML(chip);
      outputsRow = outputsHTML(chip);
    }

    // Failed 배지(제목 옆) / 키워드는 Failed 인 경우 숨김
    var failBadge = failed ? ' <span class="chip-fail-badge">Failed</span>' : "";
    // Failed 뒤 강조 노트 (예: "Do not repeat the same mistake!")
    var failNote = (failed && chip.fail_note) ? ' <span class="chip-fail-note">' + chip.fail_note + "</span>" : "";
    // 리비전되어 후속 칩으로 재제작된 경우 제목 옆 배지
    var revisedBadge = chip.revised_into ? ' <span class="chip-revised-badge">Revised</span>' : "";
    var reviewH = reviewHTML(chip);
    // Failed + Root cause 박스가 있으면 Design Review 를 그 박스 안에 배치, 아니면 상태 줄에 둔다.
    var hasRC = failed && chip.fail_reasons && chip.fail_reasons.length;
    var rcReview = "";
    var rowReview = reviewH;
    if (hasRC && reviewH) { rcReview = reviewH; rowReview = ""; }
    var statusRow = (statusSlot || rowReview)
      ? '<div class="chip-status-row">' + statusSlot + rowReview + "</div>"
      : "";

    return (
      '<div class="chip-card2' + (failed ? " chip-card-failed" : "") + '">' +
        '<div class="chip-num">' + num + "</div>" +
        '<div class="chip-thumb">' +
          (chip.image
            ? '<img src="' + chip.image + '" alt="' + (chip.name || "") + '" loading="lazy">'
            : '<div class="chip-thumb-tbd">Chip image<br>to be updated</div>') +
        "</div>" +
        '<div class="chip-info">' +
          '<div class="chip-title-row">' +
            '<p class="chip-name">' + (chip.name || "") +
              (fab ? ' <span class="chip-fab ' + fabCls + '">' + fab + "</span>" : "") +
              failBadge + revisedBadge + failNote +
            "</p>" +
          "</div>" +
          // 상태 문구와 Design Review 배지를 한 줄에 (좁으면 배지가 다음 줄로 내려감)
          statusRow +
          rootCauseHTML(chip, rcReview) +
          (desc ? '<p class="chip-desc">' + desc + "</p>" : "") +
          (failed ? "" : keywordsHTML(chip)) +
          outputsRow +
          designerHTML(chip) +
        "</div>" +
      "</div>"
    );
  }

  // 칩이 없어도 항상 표시할 연도 (2026: 아직 칩 없음 → "To be updated.")
  var PLACEHOLDER_YEARS = [2026];
  // 기본 펼침 연도. 나머지 연도는 접힌 상태로 표시.
  var DEFAULT_OPEN_YEARS = [2026];

  // 각 칩에 고정 연번(_galleryNum) 부여 — 연도 섹션과 하단 Failed 섹션에서 같은 번호 사용
  function computeGalleryNumbers(chips) {
    var byYear = {};
    chips.forEach(function (c) { (byYear[c.year] = byYear[c.year] || []).push(c); });
    var years = Object.keys(byYear).map(Number).sort(function (a, b) { return b - a; });
    var order = [];
    years.filter(function (y) { return y > GROUP_MAX; }).forEach(function (y) { order = order.concat(byYear[y]); });
    years.filter(function (y) { return y <= GROUP_MAX; }).forEach(function (y) { order = order.concat(byYear[y]); });
    var n = chips.length;
    order.forEach(function (c) { c._galleryNum = n--; });
  }

  // 월 라벨 없이 연번을 매겨 카드 나열 (연번은 미리 계산된 _galleryNum 사용)
  function yearBlock($body, chips, ctr, showDescFallback) {
    chips.forEach(function (chip) {
      var num = (typeof chip._galleryNum === "number") ? chip._galleryNum : ctr.n--;
      $body.append(cardHTML(chip, num, showDescFallback));
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
      // 사이드바 연도는 클릭·이동 기능 없이 현재 보는 연도만 강조 (아래 updateActiveYear)
      var $a = $('<span class="chip-year-link" data-yid="' + id + '">' + label + "</span>");
      $nav.append($a);
    });

    var filtering = false;

    // 스크롤 위치에 따라 현재 연도 강조 (Failed 필터 중에는 하지 않음)
    function updateActiveYear() {
      if (filtering) return;
      var headers = $c.find(".chip-year-toggle:visible");
      if (!headers.length) return;
      var threshold = $(window).scrollTop() + 130;
      var current = headers[0];
      headers.each(function () {
        if ($(this).offset().top <= threshold) current = this;
      });
      $nav.find(".chip-year-link").removeClass("active");
      var id = $(current).attr("id");
      if (id) $nav.find('.chip-year-link[data-yid="' + id + '"]').addClass("active");
    }

    // ===== 필터: All / Failed 세그먼트 (안 A) — All 로 언제든 복귀 =====
    if ($c.find(".chip-card-failed").length) {
      var $filter = $(
        '<div class="chip-filter-divider"></div>' +
        '<div class="chip-filter-label">Filter</div>' +
        '<div class="chip-filter-seg">' +
          '<span class="chip-filter-opt active" data-f="all" role="button" tabindex="0">All</span>' +
          '<span class="chip-filter-opt cf-failed" data-f="failed" role="button" tabindex="0">Failed</span>' +
        "</div>"
      );
      $nav.append($filter);

      // Failed 필터 활성 시 상단에 표시할 경고 메시지 보드 (강조)
      var $board = $(
        '<div class="fail-board" style="display:none">' +
          '<div class="fail-board-head">Do not make the same mistake.</div>' +
          '<ol class="fail-board-list">' +
            "<li>Always run a <mark>top-level (TR-level) simulation</mark>.</li>" +
            "<li>Always run <mark>co-simulation</mark> — digital + analog with R/C/CC extraction.</li>" +
            "<li>Always verify <mark>functionality</mark> with I2C/SPI + PAD connected.</li>" +
            "<li>For timing-critical nets, after routing place a <mark>label at the far end</mark> of the signal path, then check signal quality via R/C/CC extraction.</li>" +
            "<li>Finish <mark>power routing &amp; decap placement</mark> with enough time.</li>" +
            "<li>When collaborating across groups, allow ample <mark>timeline</mark> and always run co-/top-simulation.</li>" +
            "<li>Pass not only <mark>LVS</mark> but also <mark>ERC</mark>.</li>" +
          "</ol>" +
        "</div>"
      );
      $c.prepend($board);

      function applyFailedFilter(on) {
        filtering = on;
        $board.toggle(on);
        $nav.find(".chip-filter-opt").removeClass("active");
        $nav.find('.chip-filter-opt[data-f="' + (on ? "failed" : "all") + '"]').addClass("active");
        if (on) {
          $nav.find(".chip-year-link").removeClass("active");
          $c.find(".chip-card2").each(function () {
            $(this).toggle($(this).hasClass("chip-card-failed"));
          });
          $c.find(".chip-year-toggle").each(function () {
            var $body = $(this).next(".chip-year-body");
            var has = $body.find(".chip-card-failed").length > 0;
            $(this).toggle(has);
            if (has) { $(this).removeClass("collapsed"); $body.show(); }
            else $body.hide();
          });
        } else {
          $c.find(".chip-card2").show();
          $c.find(".chip-year-toggle").each(function () {
            var y = Number($(this).attr("data-year"));
            var open = DEFAULT_OPEN_YEARS.indexOf(y) >= 0;
            $(this).show().toggleClass("collapsed", !open);
            var $body = $(this).next(".chip-year-body");
            if (open) $body.show(); else $body.hide();
          });
          updateActiveYear();
        }
      }
      $nav.on("click", ".chip-filter-opt", function () {
        applyFailedFilter($(this).data("f") === "failed");
      });
      $nav.on("keydown", ".chip-filter-opt", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          applyFailedFilter($(this).data("f") === "failed");
        }
      });
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

  // Research 섹션에 진입하면 바로 좌측 사이드바(섹션 링크 + 연도) 표시
  function setupSidebarReveal() {
    var subnav = document.querySelector("#research .research-subnav");
    var anchor = document.getElementById("research");
    if (!subnav || !anchor) return;
    function upd() {
      // 섹션 상단이 화면 중반쯤 올라오면(=진입) 표시
      var top = anchor.getBoundingClientRect().top;
      subnav.classList.toggle("visible", top <= window.innerHeight * 0.5);
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

  // 사이드바 섹션 링크: Research Projects / Chip Gallery (클릭 이동 + 현재 섹션 강조)
  function setupSectionNav() {
    var $links = $(".subsection-link");
    if (!$links.length) return;

    $links.on("click", function (e) {
      e.preventDefault();
      var el = document.getElementById($(this).data("target"));
      if (!el) return;
      // 지연로드 이미지를 즉시 로드해 스크롤 중 레이아웃 밀림 방지
      document.querySelectorAll('img[loading="lazy"]').forEach(function (img) { img.loading = "eager"; });
      function jump() {
        var docEl = document.documentElement, prev = docEl.style.scrollBehavior;
        docEl.style.scrollBehavior = "auto";
        var y = Math.max(0, el.getBoundingClientRect().top + window.pageYOffset - 90);
        try { window.scrollTo({ top: y, behavior: "instant" }); } catch (err) { window.scrollTo(0, y); }
        docEl.style.scrollBehavior = prev;
      }
      jump();
      [60, 180, 360, 600].forEach(function (t) { setTimeout(jump, t); });
    });

    function updateActiveSection() {
      var threshold = $(window).scrollTop() + 150;
      var active = null;
      $links.each(function () {
        var el = document.getElementById($(this).data("target"));
        if (el && (el.getBoundingClientRect().top + window.pageYOffset) <= threshold) active = this;
      });
      $links.removeClass("active");
      if (active) $(active).addClass("active");
    }
    var t = false;
    $(window).on("scroll.sectionnav resize.sectionnav", function () {
      if (!t) { requestAnimationFrame(function () { updateActiveSection(); t = false; }); t = true; }
    });
    updateActiveSection();
  }

  // 예정 탭아웃 일정 — 칩 이미지 없이 컴팩트 표시. 연월별 그룹, 헤더 우측에 공정 배지.
  // 연번은 Chip Gallery 최대 번호(baseNum) 다음부터, 가장 나중 일정이 가장 큰 숫자.
  function renderTapeoutSchedule(selector, baseNum) {
    var $c = $(selector);
    if (!$c.length) return;
    $.getJSON("json/chips/tapeout_schedule.json").done(function (items) {
      if (!items || !items.length) return;
      var groups = {}, order = [];
      items.forEach(function (it) {
        var key = it.ym || "TBD";
        if (!groups[key]) { groups[key] = []; order.push(key); }
        groups[key].push(it);
      });
      order.sort(function (a, b) {
        if (a === "TBD") return 1;
        if (b === "TBD") return -1;
        return a < b ? -1 : a > b ? 1 : 0;
      });
      var n = baseNum || 0;
      var html = '<div class="tos2-head">Upcoming Tape-outs</div>';
      order.forEach(function (key) {
        var arr = groups[key];
        var proc = arr[0].process;
        var dateLabel = key === "TBD" ? "To be updated" : key.replace(".", ". ");
        html += '<div class="tos2-group">' +
          '<div class="tos2-ghead"><span class="tos2-date">' + dateLabel + "</span>" +
          (proc ? '<span class="chip-fab ' + fabClass(proc) + '">' + fabLabel(proc) + "</span>" : "") +
          "</div>";
        arr.forEach(function (it) {
          n += 1;
          html += '<div class="tos2-row"><span class="tos2-num">' + n + "</span>" +
            '<span class="tos2-ttl">' + it.title + "</span>" +
            designerHTML({ designer_imgs: it.designer_imgs }) + "</div>";
        });
        html += "</div>";
      });
      $c.html(html);
    });
  }

  $.getJSON("json/chips/chips.json").done(function (chips) {
    computeGalleryNumbers(chips);  // 연번 먼저 확정 (연도/Failed 섹션 공통)
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
    // 섹션 링크(Research Projects / Chip Gallery)
    setupSectionNav();
    // 예정 탭아웃 일정 (연번은 갤러리 최대 번호 = chips.length 다음부터)
    renderTapeoutSchedule("#chip-tapeout-schedule", chips.length);
  });
});
