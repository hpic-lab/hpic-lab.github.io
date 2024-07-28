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
            <div class="news-gallery-card-body">
              <h5 class="card-title">${award.award_name}</h5>
            </div>
            
            <ul class="list-group list-group-flush">
              <li class="list-group-item d-flex align-items-center flex-wrap">
                <span>Date:</span>
                <span>${formatDate(award.award_date)}</span>
              </li>
              <li class="list-group-item d-flex align-items-center flex-wrap">
                <span>Winner:</span>
                <span>${award.recipient_name}</span>
              </li>
              <li class="list-group-item d-flex align-items-center flex-wrap">
                <span>Description:</span>
                <span>${award.award_content}</span>
              </li> 
              <li class="list-group-item d-flex align-items-center flex-wrap">
                <span>Institution:</span>
                <span>${award.awarding_institution}</span>
              </li>
            </ul>
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