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

  // [최종_v4] 레퍼런스 스타일 + 토글 기능 + 안전장치 완비 버전
  function loadPublication(url, containerClass) {
    $.getJSON(url).done(function (pubs) {
      const container = $(containerClass);
      container.empty();
      
      // [안전장치 1] 중복 이벤트 방지
      container.off("click.pubToggle", ".publication-year-header");

      // 1. 데이터 연도별 그룹화
      const papersByYear = {};
      pubs.forEach((pub) => {
        // [안전장치 2] 연도 누락 시 'Others' 처리
        const year = pub.type ? pub.type : "Others";
        if (!papersByYear[year]) papersByYear[year] = [];
        papersByYear[year].push(pub);
      });

      // 2. 정렬 (최신순, 문자열 안전 정렬)
      const sortedYears = Object.keys(papersByYear).sort((a, b) => {
        if (a === "Others") return 1;
        if (b === "Others") return -1;
        if (!isNaN(a) && !isNaN(b)) return b - a; 
        return a < b ? 1 : -1;
      });

      // 3. 화면 그리기
      sortedYears.forEach((year) => {
        // 헤더 (연도 + 화살표 아이콘)
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

          // 배지 (Badges)
          const awardBadge = pub.award ? `<span class="badge bg-warning">${pub.award}</span>` : "";
          const sub = pub.sub ? `<span class="badge bg-info">${pub.sub}</span>` : "";        
          const progress = pub.progress ? `<span class="badge bg-secondary">${pub.progress}</span>` : "";        
          const statusBadge = pub.status ? `<span class="badge bg-success">${pub.status}</span>` : "";
          
          // 이미지
          const figures = pub.figure ? pub.figure.map(img => `<img src="img/${img}" class="pub-figure" alt="Figure">`).join("") : "";

          // [핵심] 레퍼런스 정보 스마트 조립
          // 1. 저널명 결정 (journal_full 우선, 없으면 journal, 둘 다 없으면 빈칸)
          const journalName = pub.journal_full ? pub.journal_full : (pub.journal ? pub.journal : "");
          
          // 2. 배열을 사용해 데이터가 있는 경우만 추가 (쉼표 오류 방지)
          let citationParts = [];

          if (journalName) citationParts.push(`<i>${journalName}</i>`); // 이탤릭체
          if (pub.vol) citationParts.push(`vol. ${pub.vol}`);
          if (pub.no) citationParts.push(`no. ${pub.no}`);
          if (pub.pp) citationParts.push(`pp. ${pub.pp}`);
          
          // 월/연도 처리
          if (pub.month) citationParts.push(`${pub.month} ${year}`);
          else citationParts.push(`${year}`);

          // 최종 문자열 생성 (쉼표로 연결 + 마침표)
          const citationString = citationParts.join(", ") + ".";


          // HTML 조립
          const pub_detail = `
            <div class="pub-wrapper">
              <div class="pub-badges">
                 <span class="pub-icon-box"><img src="img/pub-svg.svg"></span>
                 ${statusBadge} ${awardBadge} ${sub} ${progress}
              </div>

              <div class="pub-citation-text">
                <span class="pub-author">${authorsText}</span>, 
                
                <a href="${pub.link}" target="_blank" class="pub-title-link">
                  "<b>${pub.title}</b>"
                </a>, 
                
                ${citationString}
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
        // [안전장치 3] 애니메이션 꼬임 방지 (.stop)
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