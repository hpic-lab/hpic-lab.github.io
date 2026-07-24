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

  var MON = ["", "Jan.", "Feb.", "Mar.", "Apr.", "May", "June", "July", "Aug.", "Sept.", "Oct.", "Nov.", "Dec."];

  function cardHTML(chip) {
    return (
      '<div class="chip-card2">' +
        '<div class="chip-thumb">' +
          '<img src="' + chip.image + '" alt="' + (chip.name || "") + '" loading="lazy">' +
        "</div>" +
        '<div class="chip-info">' +
          (chip.name ? '<p class="chip-name">' + chip.name + "</p>" : "") +
          (chip.process ? '<p class="chip-proc">' + chip.process + "</p>" : "") +
          (chip.designer ? '<p class="chip-designer">Designer: ' + chip.designer + "</p>" : "") +
          (chip.description ? '<p class="chip-desc">' + chip.description + "</p>" : "") +
          outputsHTML(chip) +
        "</div>" +
      "</div>"
    );
  }

  // chips: 연도 desc, 월 desc 로 정렬된 배열. limit>0 이면 최신 N개만.
  function renderInto(selector, chips, limit) {
    var $c = $(selector);
    if (!$c.length) return;
    var list = limit && limit > 0 ? chips.slice(0, limit) : chips;
    $c.empty();

    var curYear = null;
    var curMonth = null;
    var $body = null;

    list.forEach(function (chip) {
      if (chip.year !== curYear) {
        curYear = chip.year;
        curMonth = null;
        $c.append('<div class="chip-year">' + (chip.year || "") + "</div>");
        $body = $('<div class="chip-year-body"></div>');
        $c.append($body);
      }
      var mLabel = chip.month > 0 ? MON[chip.month] + " " + chip.year : "";
      if (mLabel !== curMonth) {
        curMonth = mLabel;
        if (mLabel) $body.append('<div class="chip-month">' + mLabel + "</div>");
      }
      $body.append(cardHTML(chip));
    });
  }

  $.getJSON("json/chips/chips.json").done(function (chips) {
    // 메인 미리보기 (data-limit)
    $(".chip-timeline-preview").each(function () {
      var lim = parseInt($(this).data("limit"), 10) || 0;
      renderInto("#" + this.id, chips, lim);
    });
    // 상세 전체
    renderInto("#chip-timeline-full", chips, 0);
  });
});
