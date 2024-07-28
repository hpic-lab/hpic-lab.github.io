$(document).ready(function() {
  // award.json 불러오기
  $.getJSON('award.json')
    .done(function(awards) {
      const cardContainer = $('.gallery-detail .row');

      awards.forEach(award => {
        const card = `
        <div class="col-12 col-lg-4">
          <div class="card">
            <img src="${award.img_src}" class="card-img-top" alt="..." />
            <div class="card-body">
              <h5 class="card-title">${award.award_name}</h5>
              <p class="recipient-name">${award.recipient_name}</p>
              <p class="card-text">${formatDate(award.award_date)}</p>
            </div>
          </div>
        </div>
        `;
        cardContainer.append(card);
      });
    })
    .fail(function(jqxhr, textStatus, error) {
      console.error('Error fetching the JSON file:', textStatus, error);
    });
});

function formatDate(dateString) {
  const year = dateString.substring(2, 4);
  const month = dateString.substring(4, 6);
  const day = dateString.substring(6, 8);
  return `${year}.${month}.${day}`;
}