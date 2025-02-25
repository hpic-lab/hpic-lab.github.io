$(document).ready(function () {
  // 프로필을 생성하는 함수
  function loadProfiles(url, containerClass) {
    $.getJSON(url).done(function (people) {
      const container = $(containerClass);

      people.forEach((person) => {
        const profile = createProfileHTML(person);
        container.append(profile);
      });
    });
  }

  // 프로필 HTML 생성 함수
  function createProfileHTML(person) {
    const name = person.name;
    const position = person.position;

    return `
      <div class="col-12 col-lg-3">
        <img
          class="portrait"
          src="${person.profile_img}"
          alt="${person.name}-profile-img"
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
          data-name="${person.name}"
          data-research_interests='${JSON.stringify(person.research_interests)}'
          data-tape_out_schedule='${JSON.stringify(person.tape_out_schedule)}'
          data-achievements='${JSON.stringify(person.achievements).replace(
            /'/g,
            "&apos;"
          )}'          
          data-details="${person.details}"
          data-email="${person.email}"
          data-profile_img="${person.profile_img}"
          data-position="${person.position}"
        />
        <div class="portrait-title">
          <h2>${name}</h2> 
          <h3>${position}</h3>
          <ul class="network-icon" aria-hidden="true">
            ${createNetworkIcons(person)}
          </ul>
        </div>
      </div>
    `;
  }

  // 네트워크 아이콘 생성 함수
  function createNetworkIcons(person) {
    return `
      ${
        person.google_scholar
          ? `<li><a href="${person.google_scholar}"><img src="img/google-scholar-svg.svg" /></a></li>`
          : ""
      }
      ${
        person.cv
          ? `<li><a href="${person.cv}"><img src="img/cv-svg.svg" /></a></li>`
          : ""
      }
      ${
        person.linkedin
          ? `<li><a href="${person.linkedin}"><img src="img/linkedin-svg.svg" /></a></li>`
          : ""
      }
      ${
        person.orcid
          ? `<li><a href="${person.orcid}"><img src="img/orcid-svg.svg" /></a></li>`
          : ""
      }
    `;
  }

  // 모달 이벤트 핸들러
  $("#exampleModal").on("show.bs.modal", function (event) {
    const button = $(event.relatedTarget); // 클릭한 버튼
    const email = button.data("email");

    // 이메일이 빈 문자열일 경우 모달 띄우지 않음
    if (!email) {
      event.preventDefault(); // 모달 열기 방지
      return; // 함수 종료
    }

    const name = button.data("name");
    const research_interests = button.data("research_interests");
    const tape_out_schedule = button.data("tape_out_schedule");
    const achievements = button.data("achievements");
    const details = button.data("details");
    const profile_img = button.data("profile_img");
    const position = button.data("position");

    // 모달 내용 업데이트
    updateModalContent(
      name,
      profile_img,
      details,
      email,
      position,
      research_interests,
      tape_out_schedule,
      achievements
    );
  });

  // 모달 내용 업데이트 함수
  function updateModalContent(
    name,
    profile_img,
    details,
    email,
    position,
    research_interests,
    tape_out_schedule,
    achievements
  ) {
    $("#modal-name").text(name);
    $("#modal-profile-img").attr("src", profile_img);
    $("#modal-details").text(details);
    $("#modal-email").text(email);
    $("#modal-position").text(position);

    // research_interests 처리
    const parsed_research_interests = parseData(research_interests);
    updateList(
      "#modal-research_interests",
      parsed_research_interests,
      "No research interests available."
    );

    // tape_out_schedule 처리
    const parsedTapeOutSchedule = parseData(tape_out_schedule);
    const formattedTapeOutSchedule = parsedTapeOutSchedule
      .map((schedule) => `${schedule.date} (${schedule.process})`)
      .join(", ");

    // tape_out_schedule 표시 처리
    if (formattedTapeOutSchedule) {
      $("#modal-tape_out_schedule").text(formattedTapeOutSchedule);
      $("#modal-tape_out_schedule-title").show(); // 제목 표시
    } else {
      $("#modal-tape_out_schedule").text("");
      $("#modal-tape_out_schedule-title").hide(); // 제목 숨김
    }

    // achievements 처리
    const parsedAchievements = parseData(achievements);
    if (parsedAchievements.length > 0) {
      $("#modal-achievements").text(parsedAchievements.join(", "));
      $("#modal-achievements-title").show(); // 제목 표시
    } else {
      $("#modal-achievements").text("");
      $("#modal-achievements-title").hide(); // 제목 숨김
    }
  }

  // 데이터 파싱 함수
  function parseData(data) {
    if (Array.isArray(data)) {
      return data;
    } else if (typeof data === "string") {
      try {
        return JSON.parse(data);
      } catch (error) {
        console.error("Error parsing data:", error);
        return [];
      }
    }
    return [];
  }

  // 리스트 업데이트 함수
  function updateList(selector, items, emptyMessage) {
    const list = $(selector);
    list.empty(); // 기존 내용을 비움
    if (items.length > 0) {
      items.forEach((item) => list.append(`<li>${item}</li>`));
    } else {
      list.append(`<li>${emptyMessage}</li>`);
    }
  }




  // 교수님 및 학생 프로필 로드
  loadProfiles(
    "json/people/00_principal_investigator.json",
    ".principal-investigator"
  );
  loadProfiles("json/people/01_phd_ms.json", ".phd-ms-students");
  loadProfiles("json/people/02_ms_phd_candidates.json", ".ms-phd-candidates");
  loadProfiles("json/people/03_ms_candidates.json", ".ms-candidates");
  loadProfiles("json/people/03_ms_candidates_2503.json", ".ms-candidates-2503");
  loadProfiles(
    "json/people/04_undergraduate_researchers.json",
    ".undergraduate-researchers"
  );
});
