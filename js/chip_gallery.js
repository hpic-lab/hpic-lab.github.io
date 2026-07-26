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

  // designer를 학생 사진(원형)으로 표시. 사진이 없으면 이름 텍스트로 대체.
  function designerHTML(chip) {
    var imgs = chip.designer_imgs || [];
    if (imgs.length) {
      var h = imgs.map(function (f) {
        return '<img class="chip-designer-photo" src="img/' + f + '" alt="" onerror="this.remove()">';
      }).join("");
      return '<div class="chip-designers">' + h + "</div>";
    }
    if (chip.designer) return '<p class="chip-designer">' + chip.designer + "</p>";
    return "";
  }

  function cardHTML(chip) {
    return (
      '<div class="chip-card2">' +
        '<div class="chip-thumb">' +
          '<img src="' + chip.image + '" alt="' + (chip.name || "") + '" loading="lazy">' +
        "</div>" +
        '<div class="chip-info">' +
          (chip.name ? '<p class="chip-name">' + chip.name + "</p>" : "") +
          (chip.process ? '<p class="chip-proc">' + chip.process + "</p>" : "") +
          (chip.description ? '<p class="chip-desc">' + chip.description + "</p>" : "") +
          outputsHTML(chip) +
          designerHTML(chip) +
        "</div>" +
      "</div>"
    );
  }

  // 칩이 없어도 항상 표시할 연도(추후 업데이트용). 여기에 연도만 추가하면 접이식 빈 섹션이 생김.
  var PLACEHOLDER_YEARS = [2026, 2022];
  // 기본 펼침 연도. 나머지 연도는 접힌 상태로 표시.
  var DEFAULT_OPEN_YEARS = [2026, 2025, 2024];

  function monthBlock($body, chips) {
    var curMonth = null;
    chips.forEach(function (chip) {
      var mLabel = monthLabel(chip);
      if (mLabel !== curMonth) {
        curMonth = mLabel;
        if (mLabel) $body.append('<div class="chip-month">' + mLabel + "</div>");
      }
      $body.append(cardHTML(chip));
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

    years.forEach(function (y) {
      var yc = byYear[y] || [];
      var open = DEFAULT_OPEN_YEARS.indexOf(y) >= 0;
      var $header = $(
        '<div class="chip-year chip-year-toggle' + (open ? "" : " collapsed") + '" role="button" tabindex="0">' +
          '<span class="chip-year-caret">&#9662;</span>' + y +
          (yc.length ? "" : ' <span class="chip-year-soon">(Coming soon)</span>') +
        "</div>"
      );
      var $body = $('<div class="chip-year-body"></div>');
      if (yc.length) {
        monthBlock($body, yc);
      } else {
        $body.append('<p class="chip-empty">To be updated.</p>');
      }
      if (!open) $body.hide();
      $c.append($header).append($body);
    });

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

  $.getJSON("json/chips/chips.json").done(function (chips) {
    // 메인 Research 미리보기 (접이식)
    $(".chip-timeline-preview").each(function () {
      renderCollapsible("#" + this.id, chips);
    });
    // 상세 전체 (접이식)
    renderCollapsible("#chip-timeline-full", chips);
  });
});
