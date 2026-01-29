$(document).ready(function () {
  
  window.peopleDB = {}; 

  function getFileName(path) {
    if (!path) return "";
    return path.split('/').pop();
  }

  function loadProfiles(url, containerClass, showIconsInMainView) {
    return $.getJSON(url).done(function (people) {
      const container = $(containerClass);
      container.empty();

      people.forEach((person) => {
        const imgKey = getFileName(person.profile_img);
        if (imgKey) {
            window.peopleDB[imgKey] = person;
        }
        const profile = createProfileHTML(person, showIconsInMainView);
        container.append(profile);
      });
    });
  }

  function loadDataOnly(url) {
    return $.getJSON(url).done(function (people) {
      people.forEach((person) => {
        let key = getFileName(person.profile_img);
        if (!key) {
            key = person.name; 
        }
        window.peopleDB[key] = person;
      });
    });
  }

  function loadAlumni(url, containerId) {
    $.getJSON(url).done(function (alumniList) {
      const container = $(containerId);
      container.empty(); 

      alumniList.forEach((person) => {
        let foundKey = null;
        
        for (const [key, val] of Object.entries(window.peopleDB)) {
            if (val.name === person.name) {
                foundKey = key;
                break;
            }
        }

        let style = ""; 
        let modalAttrs = ""; 
        if (foundKey) {
            style = `style="cursor: pointer; color: inherit; font-weight: bold; text-decoration: underline;"`;
            modalAttrs = `
                data-bs-toggle="modal" 
                data-bs-target="#exampleModal" 
                data-img-key="${foundKey}"
            `;
        } 
        
        const thesisLink = person.thesis_link 
            ? `<a href="${person.thesis_link}" target="_blank" class="thesis-link">[Link]</a>` 
            : "-";

        const html = `
          <tr>
            <td ${style} ${modalAttrs}>${person.name}</td>
            <td>${person.affiliation}</td>
            <td>${person.program}</td>
            <td>${person.current}</td>
            <td>${thesisLink}</td>
          </tr>
        `;
        container.append(html);
      });
    });
  }

  function createProfileHTML(person, showIconsInMainView) {
    const name = person.name;
    const position = person.position;
    const imgKey = getFileName(person.profile_img);

    const networkIconsHTML = showIconsInMainView
      ? `<ul class="network-icon" aria-hidden="true">${createNetworkIcons(person)}</ul>`
      : "";

    return `
      <div class="col-12 col-lg-3">
        <img
          class="portrait"
          src="${person.profile_img}"
          alt="${person.name}-profile-img"
          style="cursor: pointer;"
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
          data-img-key="${imgKey}" 
        />
        <div class="portrait-title">
          <h2>${name}</h2> 
          <h3>${position}</h3>
          ${networkIconsHTML}
        </div>
      </div>
    `;
  }

  function createNetworkIcons(person) {
    return `
      ${person.google_scholar ? `<li><a href="${person.google_scholar}" target="_blank"><img src="img/google-scholar-svg.svg" /></a></li>` : ""}
      ${person.cv ? `<li><a href="${person.cv}" target="_blank"><img src="img/cv-svg.svg" /></a></li>` : ""}
      ${person.linkedin ? `<li><a href="${person.linkedin}" target="_blank"><img src="img/linkedin-svg.svg" /></a></li>` : ""}
      ${person.orcid ? `<li><a href="${person.orcid}" target="_blank"><img src="img/orcid-svg.svg" /></a></li>` : ""}
    `;
  }

  $("#exampleModal").on("show.bs.modal", function (event) {
    const button = $(event.relatedTarget); 
    const imgKey = button.data("img-key"); 
    
    let person = window.peopleDB[imgKey];

    if (!person) {
        if (button.data("name")) return;
        else { event.preventDefault(); return; }
    }

    const links = {
      google_scholar: person.google_scholar,
      cv: person.cv,
      linkedin: person.linkedin,
      orcid: person.orcid,
    };

    updateModalContent(
      person.name,
      person.profile_img, 
      person.details,
      person.email,
      person.position,
      person.research_interests,
      person.tape_out_schedule,
      person.achievements,
      person.affiliation,
      person.program_period,
      links
    );
  });

  function updateModalContent(name, profile_img, details, email, position, research_interests, tape_out_schedule, achievements, affiliation, program_period, links) {
    $("#modal-name").text(name);
    
    if (profile_img) {
        $("#modal-profile-img").attr("src", profile_img);
        $("#modal-profile-img").show();
    } else {
        $("#modal-profile-img").hide(); 
    }

    $("#modal-details").text(details);
    $("#modal-email").text(email);
    $("#modal-position").html(position);

    $("#modal-network-icons").remove(); 
    const iconsHTML = createNetworkIcons(links);

    if (iconsHTML.trim() !== "") {
        $("#modal-position").after(`
            <ul id="modal-network-icons" class="network-icon" style="justify-content: center; padding: 10px 0;">
                ${iconsHTML}
            </ul>
        `);
    }

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

    if (affiliation) {
      $("#modal-affiliation").text(affiliation);
      $("#modal-affiliation-title").show();
      $("#modal-affiliation").show();
    } else {
        $("#modal-affiliation-title").hide();
        $("#modal-affiliation").hide();
    }

    if (program_period) {
        $("#modal-program_period").text(program_period);
        $("#modal-program_period-title").show();
        $("#modal-program_period").show();
    } else {
        $("#modal-program_period-title").hide();
        $("#modal-program_period").hide();
    }
  }

  function parseData(data) {
    if (Array.isArray(data)) return data;
    if (typeof data === "string") {
      try { return JSON.parse(data); } catch (e) { return []; }
    }
    return [];
  }

  function updateList(selector, items, emptyMessage) {
    const list = $(selector);
    list.empty();
    if (items.length > 0) {
      items.forEach((item) => list.append(`<li>${item}</li>`));
    } else {
      list.append(`<li>${emptyMessage}</li>`);
    }
  }

$.when(
    loadProfiles("json/people/00_principal_investigator.json", ".principal-investigator", true),
    loadProfiles("json/people/02_ms_phd_candidates.json", ".ms-phd-candidates", false),
    loadProfiles("json/people/03_ms_candidates.json", ".ms-candidates", false),
    loadProfiles("json/people/04_researchers.json", ".researchers", false),
    loadProfiles("json/people/05_undergraduate_researchers.json", ".undergraduate-researchers", false),
    
    loadDataOnly("json/people/06_alumni_info.json") 
    
  ).done(function() {
      loadAlumni("json/people/06_alumni.json", "#alumni-list-container");
  });

});