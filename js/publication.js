$(document).ready(function () {
  
  // 파일명 추출 헬퍼 함수
  function getFileName(path) {
    if (!path) return "";
    return path.split('/').pop();
  }

  // 통합 로드 함수
  function loadAllPublications() {
    $.when(
      $.getJSON("json/publications/journal.json"),
      $.getJSON("json/publications/conference.json"),
      $.getJSON("json/publications/patent.json")
    ).done(function (jRes, cRes, pRes) {
      
      const container = $(".all-publications-container");
      container.empty();
      container.off("click.pubToggle", ".publication-year-header");

      // 1. 세 개의 데이터를 하나의 리스트로 합치기 (이름표 달기)
      let allPubs = [];
      if(jRes[0]) jRes[0].forEach(p => { p.category = "Journal"; allPubs.push(p); });
      if(cRes[0]) cRes[0].forEach(p => { p.category = "Conference"; allPubs.push(p); });
      if(pRes[0]) pRes[0].forEach(p => { p.category = "Patent"; allPubs.push(p); });

      // 2. 그룹화 로직
      const papersByYear = {};
      allPubs.forEach((pub) => {
        const year = pub.year ? pub.year : (pub.type ? pub.type : "Others");
        if (!papersByYear[year]) papersByYear[year] = { Journal: [], Conference: [], Patent: [] };
        papersByYear[year][pub.category].push(pub);
      });

      // 3. 정렬 로직
      const sortedYears = Object.keys(papersByYear).sort((a, b) => {
        if (a === "Others") return 1;
        if (b === "Others") return -1;
        if (!isNaN(a) && !isNaN(b)) return b - a; 
        return a < b ? 1 : -1;
      });

      // 4. 그리기
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

        // 저널 -> 컨퍼런스 -> 특허 순으로 화면에 뿌려줌
        ["Journal", "Conference", "Patent"].forEach(category => {
           const pubsInCategory = papersByYear[year][category];
           
           if (pubsInCategory && pubsInCategory.length > 0) {
              // 카테고리 소제목 추가
              yearContentDiv.append(`
                <h4 style="margin-top: 12px; margin-bottom: 10px;">
                  <span style="
                    display: inline-block; 
                    background-color: #2e55be; 
                    color: white; 
                    padding: 1px 4px; /* 위아래, 좌우 여백 */
                    font-size: 0.85rem; /* 글자 크기 */
                    font-weight: 600; 
                    border-radius: 6px; /* 끝을 살짝만 둥글게 처리 */
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1); /* 그림자도 얕고 부드럽게 */
                  ">
                    ${category}
                  </span>
                </h4>
              `);
              pubsInCategory.forEach((pub, index) => { 
                 let pub_detail = "";
                 
                 let numbering = `<span style="min-width: 22px; flex-shrink: 0;">${index + 1}.</span>`;
                 
                 if (category === "Patent") {
                    let inventorsText = pub.inventors ? pub.inventors.join(", ") : "";
                    let badgesHTML = "";
                    if (pub.status) badgesHTML += `<span class="badge process-badge">${pub.status}</span>| `;
                    if (pub.registration) badgesHTML += `<span class="badge bg-success">${pub.registration}</span>| `;
                    if (badgesHTML.endsWith("| ")) badgesHTML = badgesHTML.slice(0, -2);

                    const figures = pub.figure ? pub.figure.map(img => {
                        const imgKey = getFileName(img);
                        return `<img src="img/${img}" class="pub-figure" alt="Figure" style="cursor: pointer;" data-bs-toggle="modal" data-bs-target="#exampleModal" data-img-key="${imgKey}">`;
                    }).join("") : "";

                    pub_detail = `
                    <div class="pub-wrapper">
                      <div class="pub-badges">
                        <span class="pub-icon-box"><img src="img/pub-svg.svg"></span>
                        ${badgesHTML}
                      </div>
                      
                      <div class="pub-citation-text" style="display: flex; align-items: flex-start;">
                        ${numbering}
                        <div>
                          <span class="pub-author">${inventorsText}</span>. 
                          <span><b>${pub.title}.</b></span>
                        </div>
                      </div>
                      <div class="pub-figures">${figures}</div>
                    </div>`;

                 } else {
                    let authorsText = pub.authors ? pub.authors.join(", ") : "";
                    let badgesHTML = "";
                    if (pub.status) badgesHTML += `<span class="badge bg-success">${pub.status}</span>| `;
                    if (pub.award) badgesHTML += `<span class="badge bg-warning">${pub.award}</span>| `;
                    if (pub.sub) badgesHTML += `<span class="badge bg-info">${pub.sub}</span>| `;
                    if (pub.progress) badgesHTML += `<span class="badge bg-secondary">${pub.progress}</span>| `;
                    if (badgesHTML.endsWith("| ")) badgesHTML = badgesHTML.slice(0, -2);

                    const figures = pub.figure ? pub.figure.map(img => {
                        const imgKey = getFileName(img);
                        return `<img src="img/${img}" class="pub-figure" alt="Figure" style="cursor: pointer;" data-bs-toggle="modal" data-bs-target="#exampleModal" data-img-key="${imgKey}">`;
                    }).join("") : "";

                    let titleHTML = "";      
                    let citationHTML = "";   
                    let titleSuffix = ".";   

                    if (pub.title && pub.title.trim() !== "") {
                        if (pub.reference && pub.reference.trim() !== "") {
                            titleSuffix = ",";
                            citationHTML = " " + pub.reference;
                        } else {
                            titleSuffix = ".";
                            citationHTML = "";
                        }
                        titleHTML = `, <a href="${pub.link}" target="_blank" class="pub-title-link">"<b>${pub.title}</b>${titleSuffix}"</a>`;
                    } else {
                        authorsText += "."; 
                    }

                    pub_detail = `
                    <div class="pub-wrapper">
                      <div class="pub-badges">
                         <span class="pub-icon-box"><img src="img/pub-svg.svg"></span>
                         ${badgesHTML}
                      </div>
                      
                      <div class="pub-citation-text" style="display: flex; align-items: flex-start;">
                        ${numbering}
                        <div>
                          <span class="pub-author">${authorsText}</span>${titleHTML}${citationHTML}
                        </div>
                      </div>
                      <div class="pub-figures">${figures}</div>
                    </div>`;
                 }

                 yearContentDiv.append(pub_detail);
              });
           }
        });

        container.append(yearContentDiv);
      });

      // 토글 애니메이션
      container.on("click.pubToggle", ".publication-year-header", function() {
        $(this).toggleClass("collapsed");
        $(this).next(".pub-year-content").stop(true, false).slideToggle(300);
      });
    });
  }

  // 실행부
  loadAllPublications();

});