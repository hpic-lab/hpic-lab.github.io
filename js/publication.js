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

  // 본문 상세정보는 vol,no,pp의 정보가 다 채워질 때만 표시
  function loadPublication(url, containerClass) {
    $.getJSON(url).done(function (pubs) {
      const container = $(containerClass);
      container.empty();
      
      // 이벤트 중복 방지
      container.off("click.pubToggle", ".publication-year-header");

      // 1. 데이터 연도별 그룹화
      const papersByYear = {};
      pubs.forEach((pub) => {
        const year = pub.type ? pub.type : "Others";
        if (!papersByYear[year]) papersByYear[year] = [];
        papersByYear[year].push(pub);
      });

      // 2. 정렬 (최신순)
      const sortedYears = Object.keys(papersByYear).sort((a, b) => {
        if (a === "Others") return 1;
        if (b === "Others") return -1;
        if (!isNaN(a) && !isNaN(b)) return b - a; 
        return a < b ? 1 : -1;
      });

      // 3. 화면 그리기
      sortedYears.forEach((year) => {
        // 헤더 (연도 + 화살표)
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

        // 내용 박스
        const yearContentDiv = $("<div class='pub-year-content'></div>");

        papersByYear[year].forEach((pub) => {
          
          // 저자 목록
          const authorsText = pub.authors.join(", ");

          // --- [1] 배지 생성 (항상 표시) ---
          let badgesHTML = "";
          
          if (pub.type) badgesHTML += `<span class="badge text-bg-primary">${pub.type}</span> | `;
          if (pub.status) badgesHTML += `<span class="badge bg-success">${pub.status}</span> | `;
          if (pub.award) badgesHTML += `<span class="badge bg-warning">${pub.award}</span> | `;
          if (pub.sub) badgesHTML += `<span class="badge bg-info">${pub.sub}</span> | `;
          if (pub.progress) badgesHTML += `<span class="badge bg-secondary">${pub.progress}</span> | `;

          // 마지막 구분선 제거
          if (badgesHTML.endsWith(" | ")) {
            badgesHTML = badgesHTML.slice(0, -3);
          }

          // 이미지 처리
          const figures = pub.figure ? pub.figure.map(img => `<img src="img/${img}" class="pub-figure" alt="Figure">`).join("") : "";


          // --- [2] 레퍼런스 텍스트 생성 (엄격한 조건) ---
          // 조건: vol, no, pp가 모두 있을 때만 -> Journal, vol, no, pp, month, year 출력
          // 그렇지 않으면 -> 아무것도 출력 안 함 (제목 뒤 마침표로 끝남)
          
          let citationString = "."; // 기본값: 제목 뒤 마침표

          if (pub.vol && pub.no && pub.pp) {
             const journalName = pub.journal_full ? pub.journal_full : (pub.journal ? pub.journal : "");
             const parts = [];
             
             // 1. 저널명
             if (journalName) parts.push(`<i>${journalName}</i>`);
             
             // 2. 상세 정보
             parts.push(`vol. ${pub.vol}`);
             parts.push(`no. ${pub.no}`);
             parts.push(`pp. ${pub.pp}`);
             
             // 3. 날짜 + 연도 (본문용)
             if (pub.month) parts.push(`${pub.month} ${year}`);
             else parts.push(`${year}`);
             
             // 제목 뒤 쉼표로 시작해서 정보 나열 후 마침표
             citationString = ", " + parts.join(", ") + ".";
          }


          // HTML 조립
          const pub_detail = `
            <div class="pub-wrapper">
              <div class="pub-badges">
                 <span class="pub-icon-box"><img src="img/pub-svg.svg"></span>
                 ${badgesHTML}
              </div>

              <div class="pub-citation-text">
                <span class="pub-author">${authorsText}</span>, 
                <a href="${pub.link}" target="_blank" class="pub-title-link">
                  "<b>${pub.title}</b>"
                </a>${citationString}
              </div>

              <div class="pub-figures">${figures}</div>
            </div>`;
          
          yearContentDiv.append(pub_detail);
        });

        container.append(yearContentDiv);
      });

      // 4. 클릭 이벤트 (토글)
      container.on("click.pubToggle", ".publication-year-header", function() {
        $(this).toggleClass("collapsed");
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
        
        let badgesHTML = "";
        if (pub.type) badgesHTML += `<span class="badge text-bg-primary">${pub.type}</span> | `;
        if (pub.status) badgesHTML += `<span class="badge process-badge">${pub.status}</span> | `;
        if (pub.registration) badgesHTML += `<span class="badge bg-success">${pub.registration}</span> | `;
        if (badgesHTML.endsWith(" | ")) badgesHTML = badgesHTML.slice(0, -3);

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