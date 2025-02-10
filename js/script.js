document.addEventListener("DOMContentLoaded", function () {
  // 갤러리 제목 행 hover 설정
  $(".gallery-title-row a").hover(
    function () {
      // a 태그에 hover
      $(this).css("background", "var(--hover-color)");
      // a 태그 내부의 svg에 hover
      $(this).find("svg").css("fill", "var(--hover-color)");
      // a 태그 내부의 버튼에 hover
      $(this).find(".btn-rotate").css({
        transform: "rotate(90deg)",
        background: "white",
      });
    },
    function () {
      // hover 해제 시 원래 상태로 복원
      $(this).css("background", "var(--detail-button-color)");
      $(this).find("svg").css("fill", "var(--detail-button-color)");
      $(this).find(".btn-rotate").css({
        transform: "rotate(0deg)",
      });
    }
  );

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

