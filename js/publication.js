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
  
  // [수정됨] 논문 목록을 연도별로 그룹화 + 최신순 정렬하여 생성하는 함수
  function loadPublication(url, containerClass) {
    $.getJSON(url).done(function (pubs) {
      const container = $(containerClass);
      container.empty(); // 기존 내용 비우기

      // 1. 데이터를 연도별로 그룹화 (빈 바구니 담기)
      const papersByYear = {};

      pubs.forEach((pub) => {
        // pub.type이 "2025", "2024" 같은 연도라고 가정
        const year = pub.type; 
        
        if (!papersByYear[year]) {
          papersByYear[year] = [];
        }
        papersByYear[year].push(pub);
      });

      // 2. 연도를 내림차순(최신순)으로 정렬 (안전 장치 포함)
      const sortedYears = Object.keys(papersByYear).sort((a, b) => {
        // 둘 다 숫자로 변환 가능한 경우 (예: "2025", "2024") -> 숫자 크기 비교 (내림차순)
        if (!isNaN(a) && !isNaN(b)) {
          return b - a; 
        }
        // 하나라도 숫자가 아닌 경우 (예: "Accepted", "Submitted") -> 문자열 역순 정렬
        return a < b ? 1 : -1;
      });

      // 3. 정렬된 연도 순서대로 화면에 그리기
      sortedYears.forEach((year) => {
        
        // 3-1. 연도 헤더(제목) 추가
        const yearHeaderHTML = `
          <div class="publication-year-header">
            <h3>${year}</h3>
            <hr />
          </div>
        `;
        container.append(yearHeaderHTML);

        // 3-2. 해당 연도의 논문들을 하나씩 추가
        papersByYear[year].forEach((pub) => {
          
          // --- [기존 코드의 디자인 로직 시작] ---
          const authorsList = pub.authors
            .map((author) => `<span>${author}</span>`)
            .join(", ");

          const figures = pub.figure
            ? pub.figure
                .map((img) => `<img src="img/${img}" class="pub-figure" alt="Figure">`)
                .join("")
            : "";
          
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
                ${figures}
              </div>
            </div>`;
          // --- [기존 코드의 디자인 로직 끝] ---
          
          container.append(pub_detail);
        });
      });
    });
  }

  // [기존 유지] 특허(Patent) 로드 함수 (수정하지 않음)
  function loadPatent(url, containerClass) {
    $.getJSON(url).done(function (pubs) {
      const container = $(containerClass);

      pubs.forEach((pub) => {
        const inventorList = pub.inventors
          .map((inventor) => `<span>${inventor}</span>`)
          .join(", ");

        const figures = pub.figure
        ? pub.figure
            .map((img) => `<img src="img/${img}" class="pub-figure" alt="Figure">`)
            .join("")
        : "";

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
          ${figures}
          </div>
        </div>
        `;
        container.append(pub_detail);
      });
    });
  }

  // 실행
  loadPublication("json/publications/journal.json", ".journal-container");
  loadPublication("json/publications/conference.json", ".conference-container");
  loadPatent("json/publications/patent.json", ".patent-container");
});