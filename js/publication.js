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
          <span class="badge bg-success">${pub.status}</span>|
          <span class="badge bg-success">${pub.registration}</span>
          <br>
          <span class="pub-author">
            ${authorsList}
          </span>
          <span><a href="${pub.link}" target="_blank"><b> ${pub.title}.</b></a></span>
          <div class="pub-figures">
          ${figures} <!-- 이미지 추가 -->
          </div>
        </div>
        `;
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
