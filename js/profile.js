$(document).ready(function () {
  
  window.peopleDB = {}; 

  function getFileName(path) {
    if (!path) return "";
    return path.split('/').pop();
  }

  // 연구분야를 짧은 약어로 축약 (카드 배지용, 필요시 규칙 추가)
  function shortenInterest(text) {
    const s = text.toLowerCase();
    const rules = [
      { re: /cdr|clock and data/, label: "CDR" },
      { re: /pim|in-?memory|processing in memory/, label: "PIM" },
      { re: /dpll/, label: "DPLL" },
      { re: /pll|phase-?locked|injection/, label: "PLL" },
      { re: /adc/, label: "ADC" },
      { re: /ai hardware|artificial intelligence|neural|neuromorphic/, label: "AI HW" },
      { re: /equaliz|dfe|ffe/, label: "Equalizer" },
      { re: /wireline|serial|transmitter|receiver|pam|transceiver|serdes/, label: "Wireline" },
      { re: /quantum|cryogenic/, label: "Quantum" },
      { re: /clock/, label: "Clocking" },
      { re: /power|regulator|ldo|dc-dc/, label: "Power" },
      { re: /analog/, label: "Analog" },
      { re: /digital/, label: "Digital" }
    ];
    for (const r of rules) {
      if (r.re.test(s)) return r.label;
    }
    // 규칙에 없으면 첫 구절을 짧게 잘라서 표시
    const first = text.split(",")[0].trim();
    return first.length > 14 ? first.slice(0, 13) + "…" : first;
  }

  function loadProfiles(url, containerClass, showIconsInMainView) {
    return $.getJSON(url).done(function (people) {
      const container = $(containerClass);
      container.empty();
      container.addClass("people-grid");

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

  // Alumni: 학위별 섹션 + 카드 그리드. 프로필 정보가 있으면 카드 클릭 시 모달 표시
  function loadAlumni(url, containerId) {
    $.getJSON(url).done(function (alumniList) {
      const container = $(containerId);
      container.empty();

      const groups = { ms: [], bs: [], etc: [] };
      alumniList.forEach((p) => {
        const prog = p.program || "";
        if (prog.indexOf("M.S.") === 0) groups.ms.push(p);
        else if (prog.indexOf("B.S.") === 0) groups.bs.push(p);
        else groups.etc.push(p);
      });

      const sections = [
        { key: "ms", label: "M.S. Alumni", cls: "alumni-title-ms" },
        { key: "bs", label: "B.S. Alumni", cls: "alumni-title-bs" },
        { key: "etc", label: "Alumni", cls: "alumni-title-bs" }
      ];

      sections.forEach((sec) => {
        const list = groups[sec.key];
        if (list.length === 0) return;

        container.append(`<div class="alumni-section-title ${sec.cls}">${sec.label}</div>`);
        const grid = $('<div class="alumni-grid"></div>');

        list.forEach((person) => {
          let foundKey = null;
          for (const [key, val] of Object.entries(window.peopleDB)) {
            if (val.name === person.name) {
              foundKey = key;
              break;
            }
          }

          const m = (person.program || "").match(/\(([^)]+)\)/);
          const period = m ? m[1] : "";
          const degree = sec.key === "etc" ? (person.program || "") : sec.label.split(" ")[0];
          const isStudy = /Candidate|@/.test(person.current || "");

          const thesisHTML = person.thesis_link
            ? `<a href="${person.thesis_link}" target="_blank" rel="noopener noreferrer" class="alumni-thesis" onclick="event.stopPropagation()">Thesis</a>`
            : "";

          const clickAttrs = foundKey
            ? `data-bs-toggle="modal" data-bs-target="#exampleModal" data-img-key="${foundKey}"`
            : "";

          grid.append(`
            <div class="alumni-card ${foundKey ? "clickable" : ""}" ${clickAttrs}>
              <div class="alumni-name">${person.name}</div>
              <div class="alumni-program">${degree} ${period}</div>
              <div class="alumni-current ${isStudy ? "study" : ""}">${person.current || ""}</div>
              ${thesisHTML}
            </div>
          `);
        });

        container.append(grid);
      });
    });
  }

  function createProfileHTML(person, showIconsInMainView) {
    const name = person.name;
    const position = person.position || "";
    const imgKey = getFileName(person.profile_img);

    // 대표 연구분야 배지: research_interests 첫 항목을 약어로 축약 (한 줄 표시)
    let interest = "";
    if (Array.isArray(person.research_interests) && person.research_interests.length > 0) {
      interest = shortenInterest(String(person.research_interests[0]));
    }
    const interestHTML = interest ? `<div class="people-interest">${interest}</div>` : "";

    const networkIconsHTML = showIconsInMainView
      ? `<ul class="network-icon people-icons" aria-hidden="true">${createNetworkIcons(person)}</ul>`
      : "";

    return `
      <div class="people-card ${showIconsInMainView ? "people-card-pi" : ""}"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
        data-img-key="${imgKey}">
        <img class="people-photo" src="${person.profile_img}" alt="${name}-profile-img" />
        <div class="people-name">${name}</div>
        <div class="people-position">${position}</div>
        ${interestHTML}
        ${networkIconsHTML}
      </div>
    `;
  }

  function createNetworkIcons(person) {
    return `
      ${person.google_scholar ? `<li><a href="${person.google_scholar}" target="_blank" onclick="event.stopPropagation()"><img src="img/google-scholar-svg.svg" /></a></li>` : ""}
      ${person.cv ? `<li><a href="${person.cv}" target="_blank" onclick="event.stopPropagation()"><img src="img/cv-svg.svg" /></a></li>` : ""}
      ${person.linkedin ? `<li><a href="${person.linkedin}" target="_blank" onclick="event.stopPropagation()"><img src="img/linkedin-svg.svg" /></a></li>` : ""}
      ${person.orcid ? `<li><a href="${person.orcid}" target="_blank" onclick="event.stopPropagation()"><img src="img/orcid-svg.svg" /></a></li>` : ""}
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
      person.biography,
      person.email,
      person.position,
      person.research_interests,
      person.education,
      person.publication,
      person.experience,
      person.tape_out_schedule,
      person.Awards,
      person.affiliation,
      person.program_period,
      links
    );
  });

  function updateModalContent(name, profile_img, biography, email, position, research_interests, education, publication, experience, tape_out_schedule, Awards, affiliation, program_period, links) {
    $("#modal-name").text(name);
    
    if (profile_img) {
        $("#modal-profile-img").attr("src", profile_img);
        $("#modal-profile-img").show();
    } else {
        $("#modal-profile-img").hide(); 
    }

    $("#modal-biography").text(biography);
    
    if (email) {
        $("#modal-email").text(email);
        $("#modal-email-title").show(); 
        $("#modal-email").show();
    } else {
        $("#modal-email-title").hide();
        $("#modal-email").hide();
    }
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
    
    if (parsed_research_interests.length > 0) {
        $("#modal-research_interests-title").show();
        $("#modal-research_interests").show();
        updateList("#modal-research_interests", parsed_research_interests, "");
    } else {
        // 내용이 없으면 제목과 리스트 모두 화면에서 숨김 처리
        $("#modal-research_interests-title").hide();
        $("#modal-research_interests").hide();
    }

    const parsed_education = parseData(education);
    updateList("#modal-education", parsed_education, "No education available.");

    const parsed_experience = parseData(experience);
    if (parsed_experience.length > 0) {
        $("#modal-experience-title").show();
        $("#modal-experience").show();
        updateList("#modal-experience", parsed_experience, "");
    } else {
        // 내용이 없으면 제목과 리스트 모두 화면에서 숨김 처리
        $("#modal-experience-title").hide();
        $("#modal-experience").hide();
    }
    //updateList("#modal-experience", parsed_experience, "No experience available.");

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

    const parsedPublication = parseData(publication);
    if (parsedPublication.length > 0) {
      $("#modal-publication-title").show();
      $("#modal-publication").show();
      updateList("#modal-publication", parsedPublication, "");
    } else {
      $("#modal-publication-title").hide();
      $("#modal-publication").hide();
    }

    const parsedAwards = parseData(Awards);
    if (parsedAwards.length > 0) {
      $("#modal-Awards-title").show();
      $("#modal-Awards").show();
      updateList("#modal-Awards", parsedAwards, "");
    } else {
      $("#modal-Awards-title").hide();
      $("#modal-Awards").hide();
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