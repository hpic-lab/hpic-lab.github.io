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

  // [Final_v23] 특허(Patent) 섹션 개편 (Registered / Applications 분리 + 연도별 토글)
  
  // 1. 논문 로드 함수 (저널/컨퍼런스용 - 기존 유지)
  function loadPublication(url, containerClass) {
    $.getJSON(url).done(function (pubs) {
      const container = $(containerClass);
      container.empty();
      
      container.off("click.pubToggle", ".publication-year-header");

      const papersByYear = {};
      pubs.forEach((pub) => {
        const year = pub.type ? pub.type : "Others";
        if (!papersByYear[year]) papersByYear[year] = [];
        papersByYear[year].push(pub);
      });

      const sortedYears = Object.keys(papersByYear).sort((a, b) => {
        if (a === "Others") return 1;
        if (b === "Others") return -1;
        if (!isNaN(a) && !isNaN(b)) return b - a; 
        return a < b ? 1 : -1;
      });

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

          // 배지 생성
          let badgesHTML = "";
          if (pub.type) badgesHTML += `<span class="badge text-bg-primary">${pub.type}</span>| `;
          // status만 배지로 사용 (Journal/Conference 배지 제거됨)
          if (pub.status) badgesHTML += `<span class="badge bg-success">${pub.status}</span>| `;
          if (pub.award) badgesHTML += `<span class="badge bg-warning">${pub.award}</span>| `;
          if (pub.sub) badgesHTML += `<span class="badge bg-info">${pub.sub}</span>| `;
          if (pub.progress) badgesHTML += `<span class="badge bg-secondary">${pub.progress}</span>| `;
          
          if (badgesHTML.endsWith("| ")) badgesHTML = badgesHTML.slice(0, -2);

          const figures = pub.figure ? pub.figure.map(img => `<img src="img/${img}" class="pub-figure" alt="Figure">`).join("") : "";

          // 레퍼런스 정보 조립 (통합 필드 'reference' 우선 사용)
          let titleHTML = "";      
          let citationHTML = "";   
          let titleSuffix = ".";   

          if (pub.title && pub.title.trim() !== "") {
              // 1. 통합 reference 필드가 있으면 그걸 사용
              if (pub.reference && pub.reference.trim() !== "") {
                  titleSuffix = ",";
                  citationHTML = " " + pub.reference;
              } 
              // 2. 없으면 기존 로직 (Show Detail / PP 확인 등)
              // (여기서는 사용자 요청에 따라 reference 필드 방식만 남기거나, 
              //  기존 로직을 유지할 수 있습니다. 현재는 reference 필드 사용을 권장하므로 간단하게 처리합니다.)
              else {
                  // 하위 호환을 위해 남겨두거나, 깔끔하게 비워둘 수 있습니다.
                  // 만약 기존 JSON 데이터도 지원해야 한다면 이전 버전의 로직을 여기에 넣으면 됩니다.
                  // 현재는 'reference' 필드 사용을 최우선으로 합니다.
                  titleSuffix = ".";
                  citationHTML = "";
              }
              
              titleHTML = `, <a href="${pub.link}" target="_blank" class="pub-title-link">"<b>${pub.title}</b>${titleSuffix}"</a>`;
          } 
          else {
              authorsText += "."; 
          }

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

      container.on("click.pubToggle", ".publication-year-header", function() {
        $(this).toggleClass("collapsed");
        $(this).next(".pub-year-content").stop(true, false).slideToggle(300);
      });
    });
  }


  // 2. [NEW] 특허 로드 함수 (Registered / Applications 분리)
  function loadPatent(url, containerClass) {
     $.getJSON(url).done(function (pubs) {
      const container = $(containerClass);
      container.empty(); // 초기화

      // 데이터를 '등록'과 '출원'으로 분류
      // (JSON의 "type" 필드에 "등록" 또는 "출원"이라는 글자가 포함되어 있다고 가정)
      const registeredPubs = pubs.filter(p => p.type && p.type.includes("등록"));
      const applicationPubs = pubs.filter(p => p.type && p.type.includes("출원"));

      // ----------------------------------------------------
      // 내부 함수: 특정 그룹(등록/출원)을 화면에 그리는 함수
      // ----------------------------------------------------
      function renderPatentGroup(groupPubs, groupTitle) {
          if (groupPubs.length === 0) return; // 데이터 없으면 생략

          // 1. 대분류 제목 (아코디언 아님)
          const groupHeader = `<h2 class="patent-category-title">${groupTitle}</h2>`;
          container.append(groupHeader);

          // 2. 연도별 그룹화
          const papersByYear = {};
          groupPubs.forEach((pub) => {
            const year = pub.year ? pub.year : "Others";
            if (!papersByYear[year]) papersByYear[year] = [];
            papersByYear[year].push(pub);
          });

          // 3. 연도 정렬 (최신순)
          const sortedYears = Object.keys(papersByYear).sort((a, b) => b - a);

          // 4. 연도별 아코디언 생성
          sortedYears.forEach((year) => {
             // 연도 헤더 (토글)
             const yearHeader = `
              <h3 class="publication-year-header">
                <span>${year}</span>
                <span class="pub-toggle-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </span>
              </h3>`;
             container.append(yearHeader);

             const contentDiv = $("<div class='pub-year-content'></div>");

             papersByYear[year].forEach((pub) => {
                let inventorsText = pub.inventors.join(", ");
                
                // 배지 생성 (특허용)
                let badgesHTML = "";
                // Type (출원/등록) -> 파란색
                if (pub.type) badgesHTML += `<span class="badge text-bg-primary">${pub.type}</span>| `;
                // Status (숫자 등) -> 붉은색 (process-badge)
                if (pub.status) badgesHTML += `<span class="badge process-badge">${pub.status}</span>| `;
                // Registration (특허번호) -> 녹색
                if (pub.registration) badgesHTML += `<span class="badge bg-success">${pub.registration}</span>| `;
                
                if (badgesHTML.endsWith("| ")) badgesHTML = badgesHTML.slice(0, -2);

                const figures = pub.figure ? pub.figure.map(img => `<img src="img/${img}" class="pub-figure" alt="Figure">`).join("") : "";

                // 특허 텍스트 조립: Inventors, (Year). Title.
                const pub_detail = `
                <div class="pub-wrapper">
                  <div class="pub-badges">
                    <span class="pub-icon-box"><img src="img/pub-svg.svg"></span>
                    ${badgesHTML}
                  </div>
                  <div class="pub-citation-text">
                    <span class="pub-author">${inventorsText}</span>, 
                    <span>(${year}).</span> 
                    <span><b>${pub.title}.</b></span>
                  </div>
                  <div class="pub-figures">${figures}</div>
                </div>`;
                
                contentDiv.append(pub_detail);
             });
             
             container.append(contentDiv);
          });
      }

      // 두 그룹을 순서대로 렌더링
      // 1. Registered (등록)
      renderPatentGroup(registeredPubs, "Registered Patents");
      
      // 2. Applications (출원)
      renderPatentGroup(applicationPubs, "Patent Applications");

      // 클릭 이벤트 (공통 사용)
      container.off("click.pubToggle").on("click.pubToggle", ".publication-year-header", function() {
        $(this).toggleClass("collapsed");
        $(this).next(".pub-year-content").stop(true, false).slideToggle(300);
      });
    });
  }

  // 실행
  loadPublication("json/publications/journal.json", ".journal-container");
  loadPublication("json/publications/conference.json", ".conference-container");
  loadPatent("json/publications/patent.json", ".patent-container");
});