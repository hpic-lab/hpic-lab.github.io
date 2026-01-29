$(document).ready(function () {
  
  /* =========================================
     [1] 전역 데이터 저장소 (People DB)
     ========================================= */
  // 모든 사람의 상세 정보를 여기에 저장해두고 꺼내 씁니다.
  window.peopleDB = {}; 

  // 파일명 추출 헬퍼 함수
  function getFileName(path) {
    if (!path) return "";
    return path.split('/').pop();
  }

  /* =========================================
     [2] People (프로필) 로드 함수
     ========================================= */
  function loadProfiles(url, containerClass, showIconsInMainView) {
    return $.getJSON(url).done(function (people) {
      const container = $(containerClass);

      people.forEach((person) => {
        // 1. 원본 데이터를 DB에 등록 (열쇠: 사진 파일명)
        const imgKey = getFileName(person.profile_img);
        window.peopleDB[imgKey] = person;

        // 2. 화면 그리기 (이제 복잡한 data- 속성 다 뺐습니다!)
        const networkIconsHTML = showIconsInMainView
          ? `<ul class="network-icon" aria-hidden="true">${createNetworkIcons(person)}</ul>`
          : "";

        // ▼▼▼ [핵심] 그냥 'data-img-key' 하나만 달아줍니다. (모달 연결용) ▼▼▼
        const profile = `
          <div class="col-12 col-lg-3">
            <img class="portrait" 
                 src="${person.profile_img}" 
                 alt="${person.name}" 
                 
                 style="cursor: pointer;"
                 data-bs-toggle="modal" 
                 data-bs-target="#exampleModal"
                 data-img-key="${imgKey}"
            />
            
            <div class="portrait-title">
              <h2>${person.name}</h2> 
              <h3>${person.position}</h3>
              ${networkIconsHTML}
            </div>
          </div>`;
          
        container.append(profile);
      });
    });
  }

  // 네트워크 아이콘 생성기 (동일)
  function createNetworkIcons(person) {
    return `
      ${person.google_scholar ? `<li><a href="${person.google_scholar}" target="_blank"><img src="img/google-scholar-svg.svg" /></a></li>` : ""}
      ${person.cv ? `<li><a href="${person.cv}" target="_blank"><img src="img/cv-svg.svg" /></a></li>` : ""}
      ${person.linkedin ? `<li><a href="${person.linkedin}" target="_blank"><img src="img/linkedin-svg.svg" /></a></li>` : ""}
      ${person.orcid ? `<li><a href="${person.orcid}" target="_blank"><img src="img/orcid-svg.svg" /></a></li>` : ""}
    `;
  }

  /* =========================================
     [3] Publication (논문) 로드 함수
     ========================================= */
  function loadPublication(url, containerClass) {
    $.getJSON(url).done(function (pubs) {
      const container = $(containerClass);
      container.empty();
      container.off("click.pubToggle", ".publication-year-header");

      // 그룹화 및 정렬 (기존 로직 동일)
      const papersByYear = {};
      pubs.forEach((pub) => {
        const year = pub.type ? pub.type : "Others";
        if (!papersByYear[year]) papersByYear[year] = [];
        papersByYear[year].push(pub);
      });

      const sortedYears = Object.keys(papersByYear).sort((a, b) => {
        if (a === "Others") return 1; if (b === "Others") return -1;
        if (!isNaN(a) && !isNaN(b)) return b - a; 
        return a < b ? 1 : -1;
      });

      sortedYears.forEach((year) => {
        const yearHeaderHTML = `
          <h3 class="publication-year-header">
            <span>${year}</span>
            <span class="pub-toggle-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </span>
          </h3>`;
        container.append(yearHeaderHTML);
        const yearContentDiv = $("<div class='pub-year-content'></div>");

        papersByYear[year].forEach((pub) => {
          let authorsText = pub.authors.join(", ");
          
          let badgesHTML = "";
          if (pub.status) badgesHTML += `<span class="badge bg-success">${pub.status}</span>| `;
          if (pub.award) badgesHTML += `<span class="badge bg-warning">${pub.award}</span>| `;
          if (pub.sub) badgesHTML += `<span class="badge bg-info">${pub.sub}</span>| `;
          if (pub.progress) badgesHTML += `<span class="badge bg-secondary">${pub.progress}</span>| `;
          if (badgesHTML.endsWith("| ")) badgesHTML = badgesHTML.slice(0, -2);

          // ▼▼▼ [핵심] 논문 사진에도 'data-img-key'만 달아주면 끝! ▼▼▼
          const figures = pub.figure ? pub.figure.map(img => {
                const imgKey = getFileName(img);
                // DB에 정보가 있는 사람(우리 연구실)만 클릭 가능하게 설정
                if (window.peopleDB[imgKey]) {
                    return `<img src="img/${img}" class="pub-figure" 
                                 style="cursor: pointer;"
                                 data-bs-toggle="modal" 
                                 data-bs-target="#exampleModal"
                                 data-img-key="${imgKey}" 
                                 alt="Member">`;
                } else {
                    return `<img src="img/${img}" class="pub-figure" alt="Figure">`;
                }
              }).join("") : "";
          // ▲▲▲ 수정 끝 ▲▲▲

          // 레퍼런스 및 상세 HTML (기존 동일)
          let titleHTML = ""; let citationHTML = ""; let titleSuffix = ".";
          if (pub.title && pub.title.trim() !== "") {
              if (pub.reference && pub.reference.trim() !== "") { titleSuffix = ","; citationHTML = " " + pub.reference; }
              else { titleSuffix = "."; citationHTML = ""; }
              titleHTML = `, <a href="${pub.link}" target="_blank" class="pub-title-link">"<b>${pub.title}</b>${titleSuffix}"</a>`;
          } else { authorsText += "."; }

          const pub_detail = `
            <div class="pub-wrapper">
              <div class="pub-badges">
                 <span class="pub-icon-box"><img src="img/pub-svg.svg"></span>${badgesHTML}
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

  /* =========================================
     [4] Patent (특허) 로드 함수
     ========================================= */
  function loadPatent(url, containerClass) {
     $.getJSON(url).done(function (pubs) {
      const container = $(containerClass);
      container.empty(); 
      const registeredPubs = pubs.filter(p => p.type && p.type.includes("등록"));
      const applicationPubs = pubs.filter(p => p.type && p.type.includes("출원"));

      function renderPatentGroup(groupPubs, groupTitle) {
          if (groupPubs.length === 0) return; 
          container.append(`<h2 class="patent-category-title">${groupTitle}</h2>`);
          const papersByYear = {};
          groupPubs.forEach((pub) => {
            const year = pub.year ? pub.year : "Others";
            if (!papersByYear[year]) papersByYear[year] = [];
            papersByYear[year].push(pub);
          });
          Object.keys(papersByYear).sort((a, b) => b - a).forEach((year) => {
             container.append(`<h3 class="publication-year-header">${year}<span class="pub-toggle-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg></span></h3>`);
             const contentDiv = $("<div class='pub-year-content'></div>");
             papersByYear[year].forEach((pub) => {
                let inventorsText = pub.inventors.join(", ");
                let badgesHTML = "";
                if (pub.status) badgesHTML += `<span class="badge process-badge">${pub.status}</span>| `;
                if (pub.registration) badgesHTML += `<span class="badge bg-success">${pub.registration}</span>| `;
                if (badgesHTML.endsWith("| ")) badgesHTML = badgesHTML.slice(0, -2);

                // ▼▼▼ [핵심] 특허 사진에도 키값 연결 ▼▼▼
                const figures = pub.figure ? pub.figure.map(img => {
                    const imgKey = getFileName(img);
                    if (window.peopleDB[imgKey]) {
                        return `<img src="img/${img}" class="pub-figure" 
                                     style="cursor: pointer;"
                                     data-bs-toggle="modal" 
                                     data-bs-target="#exampleModal"
                                     data-img-key="${imgKey}" 
                                     alt="Member">`;
                    } else {
                        return `<img src="img/${img}" class="pub-figure" alt="Figure">`;
                    }
                }).join("") : "";
                // ▲▲▲ 수정 끝 ▲▲▲

                const pub_detail = `
                <div class="pub-wrapper">
                  <div class="pub-badges"><span class="pub-icon-box"><img src="img/pub-svg.svg"></span>${badgesHTML}</div>
                  <div class="pub-citation-text"><span class="pub-author">${inventorsText}</span>. <span><b>${pub.title}.</b></span></div>
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

  /* =========================================
     [5] 모달 이벤트 핸들러 (완전히 새로워짐!)
     ========================================= */
  $("#exampleModal").on("show.bs.modal", function (event) {
    const button = $(event.relatedTarget);
    
    // 1. 클릭한 사진에서 '키(파일명)'를 꺼냅니다.
    const imgKey = button.data("img-key");
    
    // 2. DB에서 그 키에 해당하는 사람 정보를 찾아옵니다. (이게 바로 '재사용'!)
    let person = window.peopleDB[imgKey];

    // (혹시 DB에 없으면 기존 방식(data- 속성)으로 시도 - 안전장치)
    if (!person) {
        person = {
            name: button.data("name"),
            email: button.data("email"),
            // ... (기타 속성 생략)
        };
        if (!person.email && !person.name) return; // 정보 없으면 중단
    }

    // 3. 찾아온 정보로 모달 내용을 채웁니다.
    const links = {
      google_scholar: person.google_scholar,
      cv: person.cv,
      linkedin: person.linkedin,
      orcid: person.orcid,
    };

    updateModalContent(
      person.name,
      person.profile_img,
      person.details,
      person.email,
      person.position,
      person.research_interests,
      person.tape_out_schedule,
      person.achievements,
      links
    );
  });

  // 모달 내용 채우기 (기존 로직 동일)
  function updateModalContent(name, profile_img, details, email, position, research_interests, tape_out_schedule, achievements, links) {
    $("#modal-name").text(name);
    $("#modal-profile-img").attr("src", profile_img);
    $("#modal-details").text(details);
    $("#modal-email").text(email);
    $("#modal-position").html(position);

    $("#modal-network-icons").remove(); 
    const iconsHTML = createNetworkIcons(links); // 상단의 아이콘 생성 함수 재사용
    if (iconsHTML.trim() !== "") {
        $("#modal-position").after(`<ul id="modal-network-icons" class="network-icon" style="justify-content: center; padding: 10px 0;">${iconsHTML}</ul>`);
    }

    updateList("#modal-research_interests", parseData(research_interests), "No research interests available.");
    
    const parsedTape = parseData(tape_out_schedule);
    const formattedTape = parsedTape.map((s) => `${s.date} (${s.process})`).join(", ");
    if (formattedTape) { $("#modal-tape_out_schedule").text(formattedTape); $("#modal-tape_out_schedule-title").show(); }
    else { $("#modal-tape_out_schedule").text(""); $("#modal-tape_out_schedule-title").hide(); }

    const parsedAchieve = parseData(achievements);
    if (parsedAchieve.length > 0) { $("#modal-achievements").text(parsedAchieve.join(", ")); $("#modal-achievements-title").show(); }
    else { $("#modal-achievements").text(""); $("#modal-achievements-title").hide(); }
  }

  function parseData(data) {
    if (Array.isArray(data)) return data;
    if (typeof data === "string") { try { return JSON.parse(data); } catch (e) { return []; } }
    return [];
  }

  function updateList(selector, items, emptyMessage) {
    const list = $(selector);
    list.empty();
    if (items.length > 0) items.forEach((item) => list.append(`<li>${item}</li>`));
    else list.append(`<li>${emptyMessage}</li>`);
  }

  /* =========================================
     [6] 실행 (순서 보장)
     ========================================= */
  $.when(
    loadProfiles("json/people/00_principal_investigator.json", ".principal-investigator", true),
    loadProfiles("json/people/02_ms_phd_candidates.json", ".ms-phd-candidates", false),
    loadProfiles("json/people/03_ms_candidates.json", ".ms-candidates", false),
    loadProfiles("json/people/03_ms_candidates_2503.json", ".ms-candidates-2503", false),
    loadProfiles("json/people/04_researchers.json", ".researchers", false),
    loadProfiles("json/people/05_undergraduate_researchers.json", ".undergraduate-researchers", false)
  ).done(function() {
      // DB가 완성된 후 논문 로드
      loadPublication("json/publications/journal.json", ".journal-container");
      loadPublication("json/publications/conference.json", ".conference-container");
      loadPatent("json/publications/patent.json", ".patent-container");
  });

});