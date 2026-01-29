$(document).ready(function () {
  
  // 1. 프로필 로드 함수 (아이콘 표시 여부 옵션 추가)
  function loadProfiles(url, containerClass, showIconsInMainView) {
    $.getJSON(url).done(function (people) {
      const container = $(containerClass);

      people.forEach((person) => {
        // showIconsInMainView가 true일 때만 메인 화면에 아이콘 생성
        const profile = createProfileHTML(person, showIconsInMainView);
        container.append(profile);
      });
    });
  }

  // 2. 프로필 HTML 생성 함수
  function createProfileHTML(person, showIconsInMainView) {
    const name = person.name;
    const position = person.position;

    // 메인 화면에 아이콘을 보여줄지 결정
    const networkIconsHTML = showIconsInMainView
      ? `<ul class="network-icon" aria-hidden="true">${createNetworkIcons(person)}</ul>`
      : ""; // false면 빈칸으로 둠 (아이콘 삭제)

    return `
      <div class="col-12 col-lg-3">
        <img
          class="portrait"
          src="${person.profile_img}"
          alt="${person.name}-profile-img"
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
          
          /* ▼▼▼ [중요] 모달로 넘겨줄 데이터들에 링크 정보 추가 ▼▼▼ */
          data-name="${person.name}"
          data-position="${person.position}"
          data-email="${person.email}"
          data-details="${person.details}"
          data-profile_img="${person.profile_img}"
          data-research_interests='${JSON.stringify(person.research_interests)}'
          data-tape_out_schedule='${JSON.stringify(person.tape_out_schedule)}'
          data-achievements='${JSON.stringify(person.achievements || []).replace(/'/g, "&apos;")}'
          
          /* 링크 정보들도 데이터로 숨겨둠 */
          data-google_scholar="${person.google_scholar || ""}"
          data-cv="${person.cv || ""}"
          data-linkedin="${person.linkedin || ""}"
          data-orcid="${person.orcid || ""}"
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
      ${
        person.google_scholar
          ? `<li><a href="${person.google_scholar}" target="_blank"><img src="img/google-scholar-svg.svg" /></a></li>`
          : ""
      }
      ${
        person.cv
          ? `<li><a href="${person.cv}" target="_blank"><img src="img/cv-svg.svg" /></a></li>`
          : ""
      }
      ${
        person.linkedin
          ? `<li><a href="${person.linkedin}" target="_blank"><img src="img/linkedin-svg.svg" /></a></li>`
          : ""
      }
      ${
        person.orcid
          ? `<li><a href="${person.orcid}" target="_blank"><img src="img/orcid-svg.svg" /></a></li>`
          : ""
      }
    `;
  }

  // 4. 모달(팝업) 이벤트 핸들러
  $("#exampleModal").on("show.bs.modal", function (event) {
    const button = $(event.relatedTarget); // 클릭한 사진

    // 필수 정보 가져오기
    const email = button.data("email");
    if (!email && !button.data("name")) { 
        // 예외처리: 이름이나 이메일이 없으면 안 띄움 (필요시 조정)
        // event.preventDefault(); return; 
    }

    const name = button.data("name");
    const position = button.data("position");
    const details = button.data("details");
    const profile_img = button.data("profile_img");
    const research_interests = button.data("research_interests");
    const tape_out_schedule = button.data("tape_out_schedule");
    const achievements = button.data("achievements");

    // ▼▼▼ 링크 정보 가져오기 ▼▼▼
    const links = {
      google_scholar: button.data("google_scholar"),
      cv: button.data("cv"),
      linkedin: button.data("linkedin"),
      orcid: button.data("orcid"),
    };

    // 모달 내용 업데이트 실행
    updateModalContent(
      name,
      profile_img,
      details,
      email,
      position,
      research_interests,
      tape_out_schedule,
      achievements,
      links // 링크 정보 전달
    );
  });

// 5. 모달 내용 채워넣는 함수 (순서 수정됨: 이름 -> 직책 -> 아이콘)
  function updateModalContent(
    name,
    profile_img,
    details,
    email,
    position,
    research_interests,
    tape_out_schedule,
    achievements,
    links
  ) {
    $("#modal-name").text(name);
    $("#modal-profile-img").attr("src", profile_img);
    $("#modal-details").text(details);
    $("#modal-email").text(email);
    $("#modal-position").html(position);

    // 1) 기존 아이콘 삭제
    $("#modal-network-icons").remove(); 

    // 2) 아이콘 HTML 생성
    const iconsHTML = createNetworkIcons(links);

    // 3) 아이콘 삽입 (순서 변경 핵심!)
    if (iconsHTML.trim() !== "") {
        // ▼▼▼ [수정됨] 직책(#modal-position) 뒤에 넣어서 순서를 맞춤
        $("#modal-position").after(`
            <ul id="modal-network-icons" class="network-icon" style="justify-content: center; padding: 10px 0;">
                ${iconsHTML}
            </ul>
        `);
    }

    // --- (이하 기존 리스트 처리 로직 동일) ---
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
  }

  // 데이터 파싱 헬퍼 함수
  function parseData(data) {
    if (Array.isArray(data)) return data;
    if (typeof data === "string") {
      try { return JSON.parse(data); } catch (e) { return []; }
    }
    return [];
  }

  // 리스트 UI 업데이트 헬퍼 함수
  function updateList(selector, items, emptyMessage) {
    const list = $(selector);
    list.empty();
    if (items.length > 0) {
      items.forEach((item) => list.append(`<li>${item}</li>`));
    } else {
      list.append(`<li>${emptyMessage}</li>`);
    }
  }

  // true/false로 CV 아이콘 표시 여부 결정 ▼▼▼
  
  loadProfiles("json/people/00_principal_investigator.json", ".principal-investigator", true);

  //loadProfiles("json/people/01_phd_ms.json", ".phd-ms-students", false);
  loadProfiles("json/people/02_ms_phd_candidates.json", ".ms-phd-candidates", false);
  loadProfiles("json/people/03_ms_candidates.json", ".ms-candidates", false);
  loadProfiles("json/people/03_ms_candidates_2503.json", ".ms-candidates-2503", false);
  loadProfiles("json/people/05_researchers.json", ".researchers", false);
  loadProfiles("json/people/04_undergraduate_researchers.json", ".undergraduate-researchers", false);
});