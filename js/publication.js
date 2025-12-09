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

  // [Final_Simple_v1] Reference 통합 필드 사용 + 단순 출력 로직
  function loadPublication(url, containerClass) {
    $.getJSON(url).done(function (pubs) {
      const container = $(containerClass);
      container.empty();
      
      // 중복 이벤트 방지
      container.off("click.pubToggle", ".publication-year-header");

      // 1. 그룹화
      const papersByYear = {};
      pubs.forEach((pub) => {
        const year = pub.type ? pub.type : "Others";
        if (!papersByYear[year]) papersByYear[year] = [];
        papersByYear[year].push(pub);
      });

      // 2. 정렬
      const sortedYears = Object.keys(papersByYear).sort((a, b) => {
        if (a === "Others") return 1;
        if (b === "Others") return -1;
        if (!isNaN(a) && !isNaN(b)) return b - a; 
        return a < b ? 1 : -1;
      });

      // 3. 화면 그리기
      sortedYears.forEach((year) => {
        const yearHeaderHTML = `
          <h3 class="publication-year-header">
            <span>${year}</span>
            <span class="pub-toggle-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </span>
          </h3>
        `;
        container.append(yearHeaderHTML);

        const yearContentDiv = $("<div class='pub-year-content'></div>");

        papersByYear[year].forEach((pub) => {
          
          let authorsText = pub.authors.join(", ");

          // --- 배지 생성 (Status만 사용, Journal 제외) ---
          let badgesHTML = "";
          
          if (pub.type) badgesHTML += `<span class="badge text-bg-primary">${pub.type}</span>| `;
          // if (pub.journal) ... (사용 안 함)
          
          if (pub.status) badgesHTML += `<span class="badge bg-success">${pub.status}</span>| `;
          if (pub.award) badgesHTML += `<span class="badge bg-warning">${pub.award}</span>| `;
          if (pub.sub) badgesHTML += `<span class="badge bg-info">${pub.sub}</span>| `;
          if (pub.progress) badgesHTML += `<span class="badge bg-secondary">${pub.progress}</span>| `;
          
          if (badgesHTML.endsWith("| ")) badgesHTML = badgesHTML.slice(0, -2);

          const figures = pub.figure ? pub.figure.map(img => `<img src="img/${img}" class="pub-figure" alt="Figure">`).join("") : "";


          // ---------------------------------------------------------
          // [핵심 로직] Reference 필드 유무에 따른 단순 처리
          // ---------------------------------------------------------
          
          let titleHTML = "";      
          let citationHTML = "";   // reference 내용을 담을 변수
          let titleSuffix = ".";   // 기본값: 마침표

          // 제목이 있는 경우
          if (pub.title && pub.title.trim() !== "") {
              
              // [조건] reference 필드에 값이 있는가?
              if (pub.reference && pub.reference.trim() !== "") {
                  // 값이 있으면 -> 쉼표 사용, reference 내용 출력
                  titleSuffix = ",";
                  citationHTML = " " + pub.reference; // 앞에 띄어쓰기 한 칸 추가
              } else {
                  // 값이 없으면 -> 마침표 사용, 내용은 빈칸
                  titleSuffix = ".";
                  citationHTML = "";
              }
              
              // 제목 링크 생성
              titleHTML = `, <a href="${pub.link}" target="_blank" class="pub-title-link">"<b>${pub.title}</b>${titleSuffix}"</a>`;
          } 
          // 제목이 없는 경우
          else {
              authorsText += "."; 
          }

          // HTML 조립
          const pub_detail = `
            <div class="pub-wrapper">
              <div class="pub-badges">
                 <span class="pub-icon-box"><img src="img/pub-svg.svg"></span>
                 ${badgesHTML}
              </div>
              <div class="pub-citation-text">
                <span class="pub-author">${authorsText}</span>${titleHTML}${citationHTML}
              </div>
              <div class="pub-figures">${figures}</div>
            </div>`;
          
          yearContentDiv.append(pub_detail);
        });

        container.append(yearContentDiv);
      });

      // 클릭 이벤트
      container.on("click.pubToggle", ".publication-year-header", function() {
        $(this).toggleClass("collapsed");
        $(this).next(".pub-year-content").stop(true, false).slideToggle(300);
      });
    });
  }

  // 특허 로드 함수
  function loadPatent(url, containerClass) {
     $.getJSON(url).done(function (pubs) {
      const container = $(containerClass);
      pubs.forEach((pub) => {
        const inventorList = pub.inventors.map(i => `<span>${i}</span>`).join(", ");
        const figures = pub.figure ? pub.figure.map(img => `<img src="img/${img}" class="pub-figure" alt="Figure">`).join("") : "";
        
        let badgesHTML = "";
        if (pub.type) badgesHTML += `<span class="badge text-bg-primary">${pub.type}</span>| `;
        if (pub.status) badgesHTML += `<span class="badge process-badge">${pub.status}</span>| `;
        if (pub.registration) badgesHTML += `<span class="badge bg-success">${pub.registration}</span>| `;
        if (badgesHTML.endsWith("| ")) badgesHTML = badgesHTML.slice(0, -2);

        const pub_detail = `
        <div class="pub-wrapper">
          <span class="pub-icon-box"><img src="img/pub-svg.svg"></span>
          ${badgesHTML}
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