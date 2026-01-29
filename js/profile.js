$(document).ready(function () {
  
  // [1] 전역 데이터 저장소 (People DB) 초기화
  // 다른 JS 파일(publication.js)에서도 이 변수를 볼 수 있습니다.
  window.peopleDB = {}; 

  // 파일 경로에서 파일명만 추출하는 헬퍼 함수
  function getFileName(path) {
    if (!path) return "";
    return path.split('/').pop();
  }

  // 1. 프로필 로드 함수
  function loadProfiles(url, containerClass, showIconsInMainView) {
    $.getJSON(url).done(function (people) {
      const container = $(containerClass);
      
      // [중요] 중복 방지를 위해 기존 내용을 비움
      container.empty();

      people.forEach((person) => {
        // ▼▼▼ [핵심] 사람 정보를 전역 DB에 등록 (열쇠: 사진 파일명) ▼▼▼
        const imgKey = getFileName(person.profile_img);
        window.peopleDB[imgKey] = person;

        const profile = createProfileHTML(person, showIconsInMainView);
        container.append(profile);
      });
    });
  }

  // 2. 프로필 HTML 생성 함수
  function createProfileHTML(person, showIconsInMainView) {
    const name = person.name;
    const position = person.position;
    // 파일명 추출 (모달 연결용 열쇠)
    const imgKey = getFileName(person.profile_img);

    const networkIconsHTML = showIconsInMainView
      ? `<ul class="network-icon" aria-hidden="true">${createNetworkIcons(person)}</ul>`
      : "";

    return `
      <div class="col-12 col-lg-3">
        <img
          class="portrait"
          src="${person.profile_img}"
          alt="${person.name}-profile-img"
          
          /* ▼▼▼ 클릭 시 모달 동작 설정 ▼▼▼ */
          style="cursor: pointer;"
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
          data-img-key="${imgKey}" 
        />
        
        <div class="portrait-title">
          <h2>${name}</h2> 
          <h3>${position}</h3>
          ${networkIconsHTML}
        </div>
      </div>
    `;
  }

  // 3. 네트워크 아이콘 HTML 생성기 (재사용)
  function createNetworkIcons(person) {
    return `
      ${person.google_scholar ? `<li><a href="${person.google_scholar}" target="_blank"><img src="img/google-scholar-svg.svg" /></a></li>` : ""}
      ${person.cv ? `<li><a href="${person.cv}" target="_blank"><img src="img/cv-svg.svg" /></a></li>` : ""}
      ${person.linkedin ? `<li><a href="${person.linkedin}" target="_blank"><img src="img/linkedin-svg.svg" /></a></li>` : ""}
      ${person.orcid ? `<li><a href="${person.orcid}" target="_blank"><img src="img/orcid-svg.svg" /></a></li>` : ""}
    `;
  }

  // 4. 모달(팝업) 이벤트 핸들러 (수정됨: 정보 없으면 열지 않음)
  $("#exampleModal").on("show.bs.modal", function (event) {
    const button = $(event.relatedTarget); // 클릭한 사진
    const imgKey = button.data("img-key"); // 키 확인
    
    // 1. DB에서 정보 찾기
    let person = window.peopleDB[imgKey];

    // 2. DB에 정보가 없으면?
    if (!person) {
        // 혹시 기존 방식(data-name 등)으로 정보가 들어있는지 확인
        if (button.data("name")) {
             person = {
                name: button.data("name"),
                position: button.data("position"),
                email: button.data("email"),
                details: button.data("details"),
                profile_img: button.data("profile_img"),
                research_interests: button.data("research_interests"),
                tape_out_schedule: button.data("tape_out_schedule"),
                achievements: button.data("achievements"),
                google_scholar: button.data("google_scholar"),
                cv: button.data("cv"),
                linkedin: button.data("linkedin"),
                orcid: button.data("orcid")
             };
        } else {
            // ▼▼▼ [핵심 수정] 정보가 아예 없으면 모달 열기를 취소합니다! ▼▼▼
            event.preventDefault(); 
            return; 
        }
    }

    const links = {
      google_scholar: person.google_scholar,
      cv: person.cv,
      linkedin: person.linkedin,
      orcid: person.orcid,
    };

    // 모달 내용 업데이트 실행
    updateModalContent(
      person.name,
      person.profile_img,
      person.details,
      person.email,
      person.position,
      person.research_interests,
      person.tape_out_schedule,
      person.achievements,
      person.affiliation,
      person.program_period,
      links
    );
  });

  // 5. 모달 내용 채워넣는 함수
  function updateModalContent(name, profile_img, details, email, position, research_interests, tape_out_schedule, achievements, affiliation, program_period, links) {
    $("#modal-name").text(name);
    $("#modal-profile-img").attr("src", profile_img);
    $("#modal-details").text(details);
    $("#modal-email").text(email);
    $("#modal-position").html(position);

    $("#modal-network-icons").remove(); 
    const iconsHTML = createNetworkIcons(links);

    if (iconsHTML.trim() !== "") {
        $("#modal-position").after(`
            <ul id="modal-network-icons" class="network-icon" style="justify-content: center; padding: 10px 0;">
                ${iconsHTML}
            </ul>
        `);
    }

    const parsed_research_interests = parseData(research_interests);
    updateList("#modal-research_interests", parsed_research_interests, "No research interests available.");

    const parsedTapeOutSchedule = parseData(tape_out_schedule);
    const formattedTapeOutSchedule = parsedTapeOutSchedule
      .map((schedule) => `${schedule.date} (${schedule.process})`)
      .join(", ");
    if (formattedTapeOutSchedule) {
      $("#modal-tape_out_schedule").text(formattedTapeOutSchedule);
      $("#modal-tape_out_schedule-title").show();
    } else {
      $("#modal-tape_out_schedule").text("");
      $("#modal-tape_out_schedule-title").hide();
    }

    const parsedAchievements = parseData(achievements);
    if (parsedAchievements.length > 0) {
      $("#modal-achievements").text(parsedAchievements.join(", "));
      $("#modal-achievements-title").show();
    } else {
      $("#modal-achievements").text("");
      $("#modal-achievements-title").hide();
    }

    if (affiliation) {
      $("#modal-affiliation").text(affiliation);
      $("#modal-affiliation-title").show();
      $("#modal-affiliation").show();
    } else {
        $("#modal-affiliation-title").hide();
        $("#modal-affiliation").hide();
    }

    if (program_period) {
        $("#modal-program_period").text(program_period);
        $("#modal-program_period-title").show();
        $("#modal-program_period").show();
    } else {
        $("#modal-program_period-title").hide();
        $("#modal-program_period").hide();
    }
  }

  function parseData(data) {
    if (Array.isArray(data)) return data;
    if (typeof data === "string") {
      try { return JSON.parse(data); } catch (e) { return []; }
    }
    return [];
  }

  function updateList(selector, items, emptyMessage) {
    const list = $(selector);
    list.empty();
    if (items.length > 0) {
      items.forEach((item) => list.append(`<li>${item}</li>`));
    } else {
      list.append(`<li>${emptyMessage}</li>`);
    }
  }

  // 실행
$.when(
    loadProfiles("json/people/00_principal_investigator.json", ".principal-investigator", true),
    loadProfiles("json/people/02_ms_phd_candidates.json", ".ms-phd-candidates", false),
    loadProfiles("json/people/03_ms_candidates.json", ".ms-candidates", false),
    loadProfiles("json/people/04_researchers.json", ".researchers", false),
    loadProfiles("json/people/05_undergraduate_researchers.json", ".undergraduate-researchers", false),
    
    // ▼▼▼ [핵심] 졸업생 정보를 불러오되, '투명 주머니'에 넣어서 숨깁니다! ▼▼▼
    loadProfiles("json/people/06_alumni_info.json", ".alumni-db-loader", false) 
    
).done(function() {
    // 2. DB 등록이 다 끝난 뒤에, Alumni 표를 그립니다.
    // (이제 loadAlumni 함수가 peopleDB에서 졸업생 정보를 찾을 수 있습니다!)
    loadAlumni("json/people/06_alumni_info.json", "#alumni-list-container");
});

});