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
      
      // 중복 이벤트 방지
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
        // 헤더
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
          
          // [안전장치] let으로 선언 (수정 가능)
          let authorsText = pub.authors.join(", ");

          // --- 배지 생성 (Conference 중복 제거) ---
          let badgesHTML = "";
          
          // 1. 연도 (Type)
          if (pub.type) badgesHTML += `<span class="badge text-bg-primary">${pub.type}</span>| `;
          
          // 2. 저널 배지 (저널은 보통 status에 'Accepted' 등을 쓰고 여기에 저널명을 씀)
          if (pub.journal) badgesHTML += `<span class="badge bg-success">${pub.journal}</span>| `;
          
          // [삭제됨] conference 배지는 status와 중복되므로 제거했습니다.
          // if (pub.conference) badgesHTML += ... 
          
          // 3. 상태/학회명 (Status) - 여기서 컨퍼런스 이름이 나옴
          if (pub.status) badgesHTML += `<span class="badge bg-success">${pub.status}</span>| `;
          
          // 4. 기타 배지
          if (pub.award) badgesHTML += `<span class="badge bg-warning">${pub.award}</span>| `;
          if (pub.sub) badgesHTML += `<span class="badge bg-info">${pub.sub}</span>| `;
          if (pub.progress) badgesHTML += `<span class="badge bg-secondary">${pub.progress}</span>| `;
          
          // 구분선 끝처리
          if (badgesHTML.endsWith("| ")) badgesHTML = badgesHTML.slice(0, -2);


          const figures = pub.figure ? pub.figure.map(img => `<img src="img/${img}" class="pub-figure" alt="Figure">`).join("") : "";

          // --- 레퍼런스 정보 조립 ---
          let titleHTML = "";      
          let citationString = ""; 
          let titleSuffix = ".";   

          // 제목이 있는 경우
          if (pub.title && pub.title.trim() !== "") {
              const parts = [];
              let isDetailsComplete = false;

              // Case 1: 컨퍼런스 (conference_fullname 존재 시)
              if (pub.conference_fullname) {
                  // pp가 있어야 상세 정보 출력
                  if (pub.pp) {
                      isDetailsComplete = true;
                      parts.push(`<i>${pub.conference_fullname}</i>`);
                      if (pub.city) parts.push(pub.city);
                      if (pub.country) parts.push(pub.country);
                      parts.push(`${year}`); // Month 없이 연도만
                      parts.push(`pp. ${pub.pp}`);
                  }
              }
              // Case 2: 저널 (conference_fullname 없음)
              else {
                  // vol, no, pp 모두 있어야 상세 정보 출력
                  if (pub.vol && pub.no && pub.pp) {
                      isDetailsComplete = true;
                      const journalName = pub.journal_full ? pub.journal_full : (pub.journal ? pub.journal : "");
                      if (journalName) parts.push(`<i>${journalName}</i>`);
                      parts.push(`vol. ${pub.vol}`);
                      parts.push(`no. ${pub.no}`);
                      parts.push(`pp. ${pub.pp}`);
                      
                      // Month + Year
                      if (pub.month) parts.push(`${pub.month} ${year}`);
                      else parts.push(`${year}`);
                  }
              }

              // 상세 정보가 있으면 제목 뒤 쉼표, 없으면 마침표
              if (isDetailsComplete) {
                  titleSuffix = ","; 
                  citationString = " " + parts.join(", ") + "."; 
              }
              
              // 제목 링크 생성 (따옴표 안에 기호 포함)
              titleHTML = `, <a href="${pub.link}" target="_blank" class="pub-title-link">"<b>${pub.title}</b>${titleSuffix}"</a>`;
          } 
          // 제목이 없는 경우
          else {
              authorsText += "."; // 저자 목록 뒤에 마침표 찍고 끝
          }


          // HTML 조립
          const pub_detail = `
            <div class="pub-wrapper">
              <div class="pub-badges">
                 <span class="pub-icon-box"><img src="img/pub-svg.svg"></span>
                 ${badgesHTML}
              </div>
              <div class="pub-citation-text">
                <span class="pub-author">${authorsText}</span>${titleHTML}${citationString}
              </div>
              <div class="pub-figures">${figures}</div>
            </div>`;
          
          yearContentDiv.append(pub_detail);
        });

        container.append(yearContentDiv);
      });

      // 4. 클릭 이벤트
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