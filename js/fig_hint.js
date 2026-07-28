// 여러 명의 사진이 나열된 곳(News / Publications / 칩 설계자 / 탭아웃)에서
// 클릭 가능함을 알리는 hover 힌트를 표시한다.
//  - 각 그룹의 첫 사진에 hover(파란 링) 힌트를 기본 표시
//  - 다른 사진에 마우스를 올리면 힌트가 그 사진으로 이동
//  - 마우스가 벗어나도 첫 사진이 아니라 마지막으로 올렸던 사진에 힌트가 유지됨
$(function () {
  var PHOTO = ".news-inline-fig, .pub-figure, .chip-designer-photo";
  var GROUP = ".news-text, .pub-figures, .chip-designers";
  var ELIGIBLE = ".news-inline-fig:not(.news-inline-logo), .pub-figure, .chip-designer-photo";

  // 각 그룹(여러 명일 때만)의 첫 사진에 힌트 부여. 이미 힌트가 있으면 그대로 둔다.
  function initHints() {
    $(GROUP).each(function () {
      var $g = $(this);
      if ($g.find(".fig-hint").length) return;
      var $photos = $g.find(ELIGIBLE);
      if (!$photos.length) return; // 사진이 1장 이상이면 (단일 포함) 첫 사진에 힌트
      $photos.first().addClass("fig-hint");
    });
  }

  // 마우스를 올린 사진으로 힌트 이동 (로고 제외). 벗어나도 유지된다.
  $(document).on("mouseenter", PHOTO, function () {
    var $el = $(this);
    if ($el.hasClass("news-inline-logo")) return;
    var $g = $el.closest(GROUP);
    if (!$g.length) return;
    $g.find(".fig-hint").removeClass("fig-hint");
    $el.addClass("fig-hint");
  });

  // 콘텐츠가 비동기(getJSON)로 렌더되므로 여러 번 초기화 시도
  initHints();
  [300, 800, 1500, 2500, 4000].forEach(function (t) { setTimeout(initHints, t); });
});
