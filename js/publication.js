/*
$(document).ready(function () {
  // 프로필을 생성하는 함수
  function loadPublication(url, containerClass) {
    $.getJSON(url).done(function (pubs) {
      const container = $(containerClass);

      pubs.forEach((pub) => {
        const authorsList = pub.authors
          .map((author) => `<span>${author}</span>`)
          .join(", ");

        const publicationSource = pub.journal ? pub.journal : pub.conference;
        
        //const awardBadge = pub.award ? `<span class="badge bg-warning">${pub.award}</span> ` : "";
        //사진
        const figures = pub.figure
        ? pub.figure
            .map((img) => `<img src="img/${img}" class="pub-figure" alt="Figure">`)
            .join("")
        : "";
        //////////////
        const awardBadge = pub.award 
        ? `<span class="badge bg-warning">${pub.award}</span>|` 
        : "";
        const sub = pub.sub 
        ? `<span class="badge bg-info">${pub.sub}</span>` 
        : "";        
        const progress = pub.progress 
        ? `<span class="badge bg-secondary">${pub.progress}</span>` 
        : "";        

        const pub_detail = `
        <div class="pub-wrapper">
          <span class="pub-icon-box"><img src="img/pub-svg.svg"></span>
          <span class="badge text-bg-primary">${pub.type}</span>|
          <span class="badge bg-success">${pub.status}</span>|
          ${awardBadge}
          ${sub}
          ${progress}
          <br>
          <span class="pub-author">${authorsList}</span>
          <span><a href="${pub.link}" target="_blank"><b>${pub.title}.</b></a></span>
          <div class="pub-figures">
            ${figures} <!-- 이미지 추가 -->
          </div>
        </div>`;
        //const submission = pub.sub ? pub.sub : "Available";
        // const pub_detail = `
        // <div class="pub-wrapper">
        //   <span class="pub-icon-box"><img src="img/pub-svg.svg"></span>
        //   <span class="badge text-bg-primary"> ${pub.type}</span>|
        //   <span class="badge bg-success">${pub.status}</span>|
        //   <span class="badge bg-warning">${pub.award}</span>
        //   <br>
        //   <span class="pub-author">
        //     ${authorsList}
        //   </span>
        //   <span><a href="${pub.link}" target="_blank"><b> ${pub.title}.</b></a></span>
        //   <div class="pub-figures">
        //   ${figures} <!-- 이미지 추가 -->
        //   </div>
        // </div>
        // `;
        container.append(pub_detail);
      });
    });
  }

  function loadPatent(url, containerClass) {
    $.getJSON(url).done(function (pubs) {
      const container = $(containerClass);

      pubs.forEach((pub) => {
        const inventorList = pub.inventors
          .map((inventor) => `<span>${inventor}</span>`)
          .join(", ");

        //사진
        const figures = pub.figure
        ? pub.figure
            .map((img) => `<img src="img/${img}" class="pub-figure" alt="Figure">`)
            .join("")
        : "";
        //////////////

        const pub_detail = `
        <div class="pub-wrapper">
          <span class="pub-icon-box"><img src="img/pub-svg.svg"></span>
          <span class="badge text-bg-primary"> ${pub.type}</span>|
          <span class="badge process-badge">${pub.status}</span>|
          <span class="badge bg-success">${pub.registration}</span>
          <br>
          <span class="pub-author">
            ${inventorList}
          </span>
          <span> (${pub.year}).</span>
          <span><b> ${pub.title}.</b></span>
          <div class="pub-figures">
          ${figures} <!-- 이미지 추가 -->
          </div>
        </div>
        `;
        container.append(pub_detail);
      });
    });
  }
  loadPublication("json/publications/journal.json", ".journal-container");
  loadPublication("json/publications/conference.json", ".conference-container");
  loadPatent("json/publications/patent.json", ".patent-container");
});
*/

/* Edit 25.12.08 D.H Lee Classify Publications by year */

$(document).ready(function () {

  function loadPublication(url, containerClass) {
    $.getJSON(url).done(function (pubs) {
      const container = $(containerClass);
      container.empty();
      
      // [보완 1] 이벤트 이름표(.pubToggle)를 사용하여, 다른 기능의 클릭 이벤트는 건드리지 않음
      container.off("click.pubToggle", ".publication-year-header");

      // 1. 데이터를 연도별로 그룹화
      const papersByYear = {};
      pubs.forEach((pub) => {
        // [보완 2] 연도 데이터가 없을 경우 'Others'로 처리하여 undefined 방지
        const year = pub.type ? pub.type : "Others"; 
        
        if (!papersByYear[year]) {
          papersByYear[year] = [];
        }
        papersByYear[year].push(pub);
      });

      // 2. 연도 내림차순 정렬
      const sortedYears = Object.keys(papersByYear).sort((a, b) => {
        // "Others"는 항상 맨 뒤로 보냄
        if (a === "Others") return 1;
        if (b === "Others") return -1;
        
        if (!isNaN(a) && !isNaN(b)) return b - a; 
        return a < b ? 1 : -1;
      });

      // 3. 화면 그리기
      sortedYears.forEach((year) => {
        // 헤더 추가
        const yearHeaderHTML = `<h3 class="publication-year-header">${year}</h3>`;
        container.append(yearHeaderHTML);

        // 내용 박스 추가
        const yearContentDiv = $("<div class='pub-year-content'></div>");

        papersByYear[year].forEach((pub) => {
          // 기존 디자인 로직 (그대로 유지)
          const authorsList = pub.authors.map(a => `<span>${a}</span>`).join(", ");
          const figures = pub.figure ? pub.figure.map(img => `<img src="img/${img}" class="pub-figure" alt="Figure">`).join("") : "";
          const awardBadge = pub.award ? `<span class="badge bg-warning">${pub.award}</span>|` : "";
          const sub = pub.sub ? `<span class="badge bg-info">${pub.sub}</span>` : "";        
          const progress = pub.progress ? `<span class="badge bg-secondary">${pub.progress}</span>` : "";        

          const pub_detail = `
            <div class="pub-wrapper">
              <span class="pub-icon-box"><img src="img/pub-svg.svg"></span>
              <span class="badge text-bg-primary">${pub.type}</span>|
              <span class="badge bg-success">${pub.status}</span>|
              ${awardBadge} ${sub} ${progress}
              <br>
              <span class="pub-author">${authorsList}</span>
              <span><a href="${pub.link}" target="_blank"><b>${pub.title}.</b></a></span>
              <div class="pub-figures">${figures}</div>
            </div>`;
          
          yearContentDiv.append(pub_detail);
        });

        container.append(yearContentDiv);
      });

      // 4. [보완 1 & 3] 이름표가 붙은 클릭 이벤트 + 애니메이션 꼬임 방지(.stop)
      container.on("click.pubToggle", ".publication-year-header", function() {
        // .stop(true, false): 현재 진행 중인 애니메이션을 즉시 멈추고 새 명령 수행
        $(this).next(".pub-year-content").stop(true, false).slideToggle(300);
      });
    });
  }

  // 특허 로드 함수 (기존 유지)
  function loadPatent(url, containerClass) {
    $.getJSON(url).done(function (pubs) {
      const container = $(containerClass);
      pubs.forEach((pub) => {
        const inventorList = pub.inventors.map(i => `<span>${i}</span>`).join(", ");
        const figures = pub.figure ? pub.figure.map(img => `<img src="img/${img}" class="pub-figure" alt="Figure">`).join("") : "";
        const pub_detail = `
        <div class="pub-wrapper">
          <span class="pub-icon-box"><img src="img/pub-svg.svg"></span>
          <span class="badge text-bg-primary"> ${pub.type}</span>|
          <span class="badge process-badge">${pub.status}</span>|
          <span class="badge bg-success">${pub.registration}</span>
          <br>
          <span class="pub-author">${inventorList}</span>
          <span> (${pub.year}).</span>
          <span><b> ${pub.title}.</b></span>
          <div class="pub-figures">${figures}</div>
        </div>`;
        container.append(pub_detail);
      });
    });
  }

  // 실행
  loadPublication("json/publications/journal.json", ".journal-container");
  loadPublication("json/publications/conference.json", ".conference-container");
  loadPatent("json/publications/patent.json", ".patent-container");
});