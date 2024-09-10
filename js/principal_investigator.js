$(document).ready(function () {
  $.getJSON("json/people/principal_investigator.json").done(function (people) {
    // $.getJSON("json/news/award.json").done(function (people) {
    const container = $(".principal-investigator");

    people.forEach((person) => {
      const profile = `
              <div class="col-12 col-lg-4">
                <!-- 프로필 이미지 -->
                <img
                  class="portrait"
                  src="${person.profile_img}"
                  alt="minseong-chu-profile-img"
                />

                <!-- 프로필 이미지 아래 설명 -->
                <div class="portrait-title">
                  <h2>${person.name}</h2>
                  <h3>${person.position}</h3>

                  <!-- 프로필 아래 링크 아이콘 -->
                  <ul class="network-icon" area-hidden="true">
                    <li>
                      <a
                        href="https://scholar.google.com/citations?user=9pp10QUAAAAJ&hl=en"
                      >
                        <img src="img/google-scholar-svg.svg" />
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://drive.google.com/file/d/1-O553iH_hAohpycfDRlX6YO07z2_3d1G/view"
                      >
                        <img src="img/cv-svg.svg" />
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://www.linkedin.com/in/min-seong-choo-5b7036176/"
                      >
                        <img src="img/linkedin-svg.svg" />
                      </a>
                    </li>
                    <li>
                      <a href="https://orcid.org/0000-0002-8638-6332">
                        <img src="img/orcid-svg.svg" />
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
                      `;
      container.append(profile);
    });
  });
});
