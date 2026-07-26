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

  // 아직 칩이 없는 연도(추후 업데이트용 placeholder). 여기에 연도만 추가하면 접이식 빈 섹션이 생김.
  var PLACEHOLDER_YEARS = [2023, 2022];

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

  // 미리보기(플랫, limit) 렌더
  function renderFlat(selector, chips, limit) {
    var $c = $(selector);
    if (!$c.length) return;
    var list = limit && limit > 0 ? chips.slice(0, limit) : chips;
    $c.empty();
    var curYear = null,
      $body = null;
    list.forEach(function (chip) {
      if (chip.year !== curYear) {
        curYear = chip.year;
        $c.append('<div class="chip-year">' + (chip.year || "") + "</div>");
        $body = $('<div class="chip-year-body"></div>');
        $c.append($body);
      }
      monthBlock($body, [chip]);
    });
  }

  // 상세 페이지: 연도별 접이식 섹션 (빈 연도 placeholder 포함)
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
      var $header = $(
        '<div class="chip-year chip-year-toggle" role="button" tabindex="0">' +
          '<span class="chip-year-caret">&#9662;</span>' + y +
          (yc.length ? "" : ' <span class="chip-year-soon">(Coming soon)</span>') +
        "</div>"
      );
      var $body = $('<div class="chip-year-body"></div>');
      if (yc.length) {
        monthBlock($body, yc);
      } else {
        $body.append('<p class="chip-empty">To be updated.</p>');
        $header.addClass("collapsed");
        $body.hide();
      }
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
    // 메인 미리보기 (data-limit)
    $(".chip-timeline-preview").each(function () {
      var lim = parseInt($(this).data("limit"), 10) || 0;
      renderFlat("#" + this.id, chips, lim);
    });
    // 상세 전체 (접이식)
    renderCollapsible("#chip-timeline-full", chips);
  });
});
