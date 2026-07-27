// JSON 데이터가 브라우저 캐시에 남아 옛 내용이 보이는 문제 방지
// (모든 $.getJSON 요청에 타임스탬프를 붙여 항상 최신 파일을 받음)
$.ajaxSetup({ cache: false });

document.addEventListener("DOMContentLoaded", function () {
  // 이메일 난독화 해제: .js-email 요소를 런타임에 mailto 링크로 조립
  // (정적 HTML에는 user@domain 형태가 없어 단순 스크래퍼가 수집하기 어려움)
  document.querySelectorAll(".js-email").forEach(function (el) {
    var u = el.getAttribute("data-user");
    var d = el.getAttribute("data-domain");
    if (!u || !d) return;
    // 하이퍼링크 없이 평문으로만 표시 (mailto 링크 미생성)
    el.textContent = u + "@" + d;
  });

  // 갤러리 "Click for more details" 버튼 호버는 CSS(:hover)에서 처리

  // Publications 카드 새 탭에서 열기
  $(".pub-card").on("click", function (event) {
    event.preventDefault(); // 기본 링크 클릭 동작을 막음
    event.stopPropagation(); // 이벤트 전파를 막음
    var url = $(this).find("a.card-text").attr("href");
    if (url) {
      window.open(url, "_blank");
    }
  });

  // 아코디언(토글 목록)
  /*
  $(".accordion").accordion({
    collapsible: true,
    heightStyle: "content",
    activate: function (event, ui) {
      // 헤더가 활성화되면 실행되는 콜백 함수
      var headerIndex = $(this)
        .find(".ui-accordion-header")
        .index(ui.newHeader);

      var headerHeight = $(this).find(".ui-accordion-header").outerHeight();

      $("html, body").animate(
        {
          scrollTop:
            $(this).find(".ui-accordion-header").offset().top -
            headerHeight -
            40 +
            headerIndex * headerHeight,
        },
        50 // 애니메이션 진행 시간
      );
    },
  });
*/

  // 1. 모든 아코디언에 공통으로 적용될 애니메이션 설정
  var commonSettings = {
    collapsible: true,
    heightStyle: "content",
    activate: function (event, ui) {
      var headerIndex = $(this).find(".ui-accordion-header").index(ui.newHeader);
      var headerHeight = $(this).find(".ui-accordion-header").outerHeight();
      
      if(ui.newHeader.length > 0) {
        var scrollTop = $(this).find(".ui-accordion-header").offset().top - headerHeight - 40 + headerIndex * headerHeight;
        $("html, body").animate({ scrollTop: scrollTop }, 50);
      }
    }
  };

  // 2. [.accordion] 클래스를 가진 모든 요소를 하나씩 검사하면서 초기화
  $(".accordion").each(function() {
    var $this = $(this); // 현재 순서의 아코디언

    // 만약 이 아코디언의 HTML 태그에 'start-closed'라는 클래스가 붙어 있다면?
    if ($this.hasClass("start-closed")) {
      // 닫힌 상태로 시작 (active: false)
      $this.accordion(
        $.extend({}, commonSettings, { active: false })
      );
    } else {
      // 그런 클래스가 없다면? 기본값인 열린 상태로 시작 (active: 0)
      $this.accordion(
        $.extend({}, commonSettings, { active: 0 })
      );
    }
  });

  // 햄버거 버튼 클릭 이벤트 핸들러
  $(".navbar-toggler, .navbar-toggler-icon").click(function (event) {
    var $navbar = $(".navbar-collapse");
    $navbar.collapse("toggle");
    event.stopPropagation(); // 이벤트 전파 중지
  });

  // 문서 클릭 이벤트 핸들러
  $(document).click(function (event) {
    var clickover = $(event.target);
    var $navbar = $(".navbar-collapse");
    var _opened = $navbar.hasClass("show");
    if (_opened && !clickover.closest(".navbar").length) {
      $navbar.collapse("hide");
    }
  });

  // 스폰서 캐러셀
  $(".autoplay").slick({
    slidesToShow: 6,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    arrows: false, // 이전 및 다음 버튼을 제거
    responsive: [
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 575,
        settings: {
          slidesToShow: 3,
        },
      },
    ],
  });

  // // News - 갤러리 캐러셀
  // $(".news-gallery-items").slick({
  //   infinite: true,
  //   slidesToShow: 3,
  //   slidesToScroll: 1,
  //   arrows: true,
  //   autoplay: true,
  //   autoplaySpeed: 2000,
  //   responsive: [
  //     {
  //       breakpoint: 575,
  //       settings: {
  //         slidesToShow: 2,
  //       },
  //     },
  //     {
  //       breakpoint: 360,
  //       settings: {
  //         slidesToShow: 1,
  //       },
  //     },
  //   ],
  // });

  // Research - 칩 갤러리 캐러셀
  $(".chip-gallery-items").slick({
    infinite: true,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true, //수정
    autoplaySpeed: 2000, //수정
    responsive: [
      {
        breakpoint: 575,
        settings: {
          slidesToShow: 3,
        },
      },
    ],
  });

  var carousel = document.getElementById("carousel-autoplaying");

  carousel.addEventListener("slide.bs.carousel", function (e) {
    var relatedTarget = e.relatedTarget;
    var idx = [...relatedTarget.parentElement.children].indexOf(relatedTarget);
    var items = document.querySelectorAll(".carousel-item");
    var totalItems = items.length;

    if (idx === 0) {
      items[totalItems - 1].classList.add("carousel-item-left");
    } else {
      items.forEach(function (item) {
        item.classList.remove("carousel-item-left");
      });
    }
  });

  // 네비게이션 링크 설정
  const navLinks = document.querySelectorAll(".top-navbar .nav-link");

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      // 모든 링크의 active 클래스 제거
      navLinks.forEach((link) => link.classList.remove("active"));

      // 클릭된 링크에 active 클래스 추가
      this.classList.add("active");

      // 모바일: 메뉴 항목 선택 시 메뉴바 닫기
      var nb = document.getElementById("navbar");
      var tb = document.querySelector(".navbar-toggler");
      if (nb && nb.classList.contains("show")) {
        nb.style.height = nb.scrollHeight + "px";
        nb.offsetHeight; // 강제 리플로우
        nb.style.height = "0";
        nb.style.opacity = "0";
        setTimeout(function () {
          nb.classList.remove("show");
          nb.style.height = "";
          nb.style.opacity = "";
          if (tb) {
            tb.classList.add("collapsed");
            tb.setAttribute("aria-expanded", "false");
          }
        }, 300);
      }

      // 홈 링크 클릭 시 최상단으로 스크롤
      if (this.getAttribute("href") === "#") {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      } else {
        // 타겟 요소로 스크롤
        const target = document.querySelector(this.getAttribute("href"));
        if (target) {
          window.scrollTo({
            top: target.offsetTop,
            behavior: "smooth",
          });
        }
      }
    });
  });

  // 네비게이션 토글 버튼 기능 추가
  const toggleButton = document.querySelector(".navbar-toggler");
  const navbarDiv = document.getElementById("navbar");

  if (toggleButton) {
    toggleButton.addEventListener("click", function () {
      if (navbarDiv.classList.contains("show")) {
        // 메뉴를 서서히 사라지게
        navbarDiv.style.height = `${navbarDiv.scrollHeight}px`;
        navbarDiv.offsetHeight; // 강제 리플로우(reflow) 트리거
        navbarDiv.style.height = "0";
        navbarDiv.style.opacity = "0";

        setTimeout(() => {
          navbarDiv.classList.remove("show");
          toggleButton.classList.add("collapsed");
          toggleButton.setAttribute("aria-expanded", "false");
        }, 300); // CSS 전환 시간과 동일하게 설정
      } else {
        // 메뉴를 서서히 나타나게 하기
        navbarDiv.classList.add("show");
        navbarDiv.style.height = "0";
        navbarDiv.offsetHeight; // 강제 리플로우(reflow) 트리거
        navbarDiv.style.height = `${navbarDiv.scrollHeight}px`;
        navbarDiv.style.opacity = "1";

        setTimeout(() => {
          navbarDiv.style.height = "auto"; // 높이를 auto로 설정
          toggleButton.classList.remove("collapsed");
          toggleButton.setAttribute("aria-expanded", "true");
        }, 300); // CSS 전환 시간과 동일하게 설정
      }
    });
  }

  // 스크롤 이벤트 리스너 추가
  window.addEventListener("scroll", () => {
    let current = "";

    // 각 섹션의 위치를 확인하여 현재 위치 파악
    document.querySelectorAll("section").forEach((section) => {
      const sectionTop = section.offsetTop;
      if (pageYOffset >= sectionTop - 60) {
        current = section.getAttribute("id");
      }
    });

    // 현재 위치에 해당하는 네비게이션 링크에 active 클래스 추가
    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  });
});
