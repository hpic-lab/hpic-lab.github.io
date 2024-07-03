document.addEventListener("DOMContentLoaded", function () {
  $(document).ready(function () {
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
  });

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

  $(".multiple-items").slick({
    infinite: true,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true,
    dots: true,
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

  carousel.addEventListener("slid.bs.carousel", function (e) {
    var items = document.querySelectorAll(".carousel-item");
    items.forEach(function (item) {
      item.classList.remove("carousel-item-left");
    });
  });

  // 네비게이션 링크 설정
  const navLinks = document.querySelectorAll(".nav-link");

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

  // 이미지 갤러리
  const slidesContainer = document.querySelector(".slides");
  const slides = document.querySelectorAll(".slide");
  const slideWidth = 200; // 이미지 크기
  const slidePadding = 12; // 슬라이드 패딩
  const slideStep = slideWidth + slidePadding; // 각 슬라이드의 총 너비
  let currentIndex = 0;

  function updateTransform(index) {
    const offset = -index * slideStep;
    slidesContainer.style.transform = `translateX(${offset}px)`;
  }

  function nextSlide() {
    if (currentIndex < slides.length - 1) {
      currentIndex++;
      updateTransform(currentIndex);
    }
  }

  function prevSlide() {
    if (currentIndex > 0) {
      currentIndex--;
      updateTransform(currentIndex);
    }
  }

  document.querySelector(".next").addEventListener("click", nextSlide);
  document.querySelector(".prev").addEventListener("click", prevSlide);
});
