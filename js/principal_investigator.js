$(document).ready(function () {
  $.getJSON("json/people/principal_investigator.json").done(function (people) {
    const container = $(".principal-investigator");

    people.forEach((person) => {
      const profile = `
              <div class="col-12 col-lg-4">
                <!-- 프로필 이미지 -->
                <img
                  class="portrait"
                  src="${person.profile_img}"
                  alt="${person.name}-profile-img"
                />

                <!-- 프로필 이미지 아래 설명 -->
                <div class="portrait-title">
                  <h2 style="!important font-size: 22px;">${person.name}</h2>
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
});
