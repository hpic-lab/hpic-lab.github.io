$(document).ready(function () {
  // 프로필을 생성하는 함수
  function loadProfiles(url, containerClass) {
    $.getJSON(url).done(function (people) {
      const container = $(containerClass);

      people.forEach((person) => {
        const profile = `
          <div class="col-12 col-lg-3">
            <!-- 프로필 이미지 -->
            <img
              class="portrait"
              src="${person.profile_img}"
              alt="${person.name}-profile-img"
              data-bs-toggle="modal"
              data-bs-target="#exampleModal"

              data-name="${person.name}"
              data-research_interests="${person.research_interests}"
              data-tape_out_schedule="${person.tape_out_schedule}"
              data-achievements="${person.achievements}"
              data-details="${person.details}"
              data-email="${person.email}"
              data-profile_img="${person.profile_img}"
              data-position="${person.position}"
            />

            <!-- 프로필 이미지 아래 설명 -->
            <div class="portrait-title">
              <h2
              data-bs-toggle="modal"
              data-bs-target="#exampleModal"
              
              data-name="${person.name}"
              data-research_interests="${person.research_interests}"
              data-tape_out_schedule="${person.tape_out_schedule}"
              data-achievements="${person.achievements}"
              data-details="${person.details}"
              data-email="${person.email}"
              data-profile_img="${person.profile_img}"
              data-position="${person.position}"

              >${person.name}</h2>
              <h3>${person.position}</h3>

              <!-- 프로필 아래 링크 아이콘 -->
              <ul class="network-icon" aria-hidden="true">
                ${
                  person.google_scholar
                    ? `
                <li>
                  <a href="${person.google_scholar}">
                    <img src="img/google-scholar-svg.svg" />
                  </a>
                </li>
                `
                    : ""
                }
                ${
                  person.cv
                    ? `
                <li>
                  <a href="${person.cv}">
                    <img src="img/cv-svg.svg" />
                  </a>
                </li>
                `
                    : ""
                }
                ${
                  person.linkedin
                    ? `
                <li>
                  <a href="${person.linkedin}">
                    <img src="img/linkedin-svg.svg" />
                  </a>
                </li>
                `
                    : ""
                }
                ${
                  person.orcid
                    ? `
                <li>
                  <a href="${person.orcid}">
                    <img src="img/orcid-svg.svg" />
                  </a>
                </li>
                `
                    : ""
                }
              </ul>
            </div>
          </div>
        `;
        container.append(profile);
      });
    });
  }

  $("#exampleModal").on("show.bs.modal", function (event) {
    const button = $(event.relatedTarget); // 클릭한 버튼
    const name = button.data("name");
    const research_interests = button.data("research_interests");
    const details = button.data("details");
    const email = button.data("email");
    const profile_img = button.data("profile_img");
    const position = button.data("position");

    // 모달 내용 업데이트
    $("#modal-name").text(name);
    $("#modal-profile-img").attr("src", profile_img);
    $("#modal-details").text(details);
    $("#modal-email").text(email);
    $("#modal-position").text(position);

    // 연구 관심사를 <li>로 추가
    $("#modal-research_interests").empty(); // 기존 내용을 비움

    if (Array.isArray(research_interests)) {
      // 배열인지 확인
      research_interests.forEach(function (interest) {
        $("#modal-research_interests").append(`<li>${interest}</li>`);
      });
    } else {
      // 배열이 아니라면 그냥 <li>로 추가
      $("#modal-research_interests").append(`<li>${research_interests}</li>`);
    }
  });

  // 교수님
  loadProfiles(
    "json/people/00_principal_investigator.json",
    ".principal-investigator"
  );
  // Ph.D./M.S. Students
  loadProfiles("json/people/01_phd_ms.json", ".phd-ms-students");
  // M.S.-Ph.D. Candidates
  loadProfiles("json/people/02_ms_phd_candidates.json", ".ms-phd-candidates");
  // M.S. Candidates
  loadProfiles("json/people/03_ms_candidates.json", ".ms-candidates");
  // Undergraduate Researchers
  loadProfiles(
    "json/people/04_undergraduate_researchers.json",
    ".undergraduate-researchers"
  );
});
