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

        const pub_detail = `
        <div class="pub-wrapper">
          <span class="pub-icon-box"><img src="img/pub-svg.svg"></span>
          <span class="pub-author">
            ${authorsList}
          </span>
          <span> (${pub.year}).</span>
          <span><a href="${pub.link}" target="_blank"><b> ${pub.title}.</b></a></span>
          <span> (${publicationSource}).</span>
        </div>
        `;
        container.append(pub_detail);
      });
    });
  }

  loadPublication("json/publications/journal.json", ".journal-container");
  loadPublication("json/publications/conference.json", ".conference-container");
});
