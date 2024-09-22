{
  /* <img class="pub-icon" src="img/pub-svg.svg" />
<span class="pub-author">
  <span>
    ${}
  </span>
  <span>(연도)</span>
</span> */
}

$(document).ready(function () {
  // 프로필을 생성하는 함수
  function loadJournal(url, containerClass) {
    $.getJSON(url).done(function (journals) {
      const container = $(containerClass);

      journals.forEach((journal) => {
        const authorsList = journal.authors
          .map((author) => `<span>${author}</span>`)
          .join(", ");
        const journal_detail = `
        <div class="pub-wrapper">
          <span>
            <span class="pub-icon-box"><img src="img/pub-svg.svg"></span>
            <span class="pub-author">
              ${authorsList}
            </span>
            <span> (${journal.year}).</span>
            <span><b> ${journal.title}.</b></span>
            <span> (${journal.journal}).</span>
          </span>
        </div>
        `;
        container.append(journal_detail);
      });
    });
  }

  loadJournal("json/publications/journal.json", ".journal-container");
});
