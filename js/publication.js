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

  
  // 1. 저널/컨퍼런스 로드 함수
  function loadPublication(url, containerClass) {
    $.getJSON(url).done(function (pubs) {
      const container = $(containerClass);
      container.empty();
      
      container.off("click.pubToggle", ".publication-year-header");

      // 그룹화
      const papersByYear = {};
      pubs.forEach((pub) => {
        const year = pub.type ? pub.type : "Others";
        if (!papersByYear[year]) papersByYear[year] = [];
        papersByYear[year].push(pub);
      });

      // 정렬
      const sortedYears = Object.keys(papersByYear).sort((a, b) => {
        if (a === "Others") return 1;
        if (b === "Others") return -1;
        if (!isNaN(a) && !isNaN(b)) return b - a; 
        return a < b ? 1 : -1;
      });

      // 그리기
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

          // --- 배지 생성 (연도 배지 삭제됨) ---
          let badgesHTML = "";
          
          // [삭제] 연도 배지 코드 제거됨 (아코디언과 중복)
          // if (pub.type) badgesHTML += ...
          
          // Status (녹색)
          if (pub.status) badgesHTML += `<span class="badge bg-success">${pub.status}</span>| `;
          
          // 기타 배지
          if (pub.award) badgesHTML += `<span class="badge bg-warning">${pub.award}</span>| `;
          if (pub.sub) badgesHTML += `<span class="badge bg-info">${pub.sub}</span>| `;
          if (pub.progress) badgesHTML += `<span class="badge bg-secondary">${pub.progress}</span>| `;
          
          if (badgesHTML.endsWith("| ")) badgesHTML = badgesHTML.slice(0, -2);

          const figures = pub.figure ? pub.figure.map(img => `<img src="img/${img}" class="pub-figure" alt="Figure">`).join("") : "";

          // --- 레퍼런스 (통합 필드 우선) ---
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


  // 2. 특허 로드 함수
    function loadPatent(url, containerClass) {
     $.getJSON(url).done(function (pubs) {
      const container = $(containerClass);
      container.empty(); 

      const registeredPubs = pubs.filter(p => p.type && p.type.includes("등록"));
      const applicationPubs = pubs.filter(p => p.type && p.type.includes("출원"));

      function renderPatentGroup(groupPubs, groupTitle) {
          if (groupPubs.length === 0) return; 

          const groupHeader = `<h2 class="patent-category-title">${groupTitle}</h2>`;
          container.append(groupHeader);

          const papersByYear = {};
          groupPubs.forEach((pub) => {
            const year = pub.year ? pub.year : "Others";
            if (!papersByYear[year]) papersByYear[year] = [];
            papersByYear[year].push(pub);
          });

          const sortedYears = Object.keys(papersByYear).sort((a, b) => b - a);

          sortedYears.forEach((year) => {
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
                
                let badgesHTML = "";
                if (pub.status) badgesHTML += `<span class="badge process-badge">${pub.status}</span>| `;
                if (pub.registration) badgesHTML += `<span class="badge bg-success">${pub.registration}</span>| `;
                
                if (badgesHTML.endsWith("| ")) badgesHTML = badgesHTML.slice(0, -2);

                const figures = pub.figure ? pub.figure.map(img => `<img src="img/${img}" class="pub-figure" alt="Figure">`).join("") : "";

                const pub_detail = `
                <div class="pub-wrapper">
                  <div class="pub-badges">
                    <span class="pub-icon-box"><img src="img/pub-svg.svg"></span>
                    ${badgesHTML}
                  </div>
                  <div class="pub-citation-text">
                    <span class="pub-author">${inventorsText}</span>. 
                    <span><b>${pub.title}.</b></span>
                  </div>
                  <div class="pub-figures">${figures}</div>
                </div>`;
                
                contentDiv.append(pub_detail);
             });
             
             container.append(contentDiv);
          });
      }

      renderPatentGroup(registeredPubs, "Registered Patents");
      renderPatentGroup(applicationPubs, "Patent Applications");

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