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
      container.addClass(showIconsInMainView ? "people-grid" : "people-grid people-grid-compact");

      people.forEach((person) => {
        const imgKey = getFileName(person.profile_img);
        if (imgKey) {
            window.peopleDB[imgKey] = person;
        }
        const profile = createProfileHTML(person, showIconsInMainView);
        container.append(profile);
      });

      // 학생 그룹 제목에 인원 수 표시 (예: M.S. Candidates (14))
      if (containerClass === ".ms-phd-candidates" || containerClass === ".ms-candidates") {
        const heading = container.prev("h3");
        if (heading.length && !/\(\d+\)/.test(heading.text())) {
          heading.append(` (${people.length})`);
        }
      }
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

      // Alumni 아코디언 헤더에 전체 인원 수 표시
      const alumniHeading = $("#alumni");
      if (alumniHeading.length && !/\(\d+\)/.test(alumniHeading.text())) {
        alumniHeading.append(` (${alumniList.length})`);
      }

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

        container.append(`<div class="alumni-section-title ${sec.cls}">${sec.label} (${list.length})</div>`);
        const grid = $('<div class="people-grid people-grid-compact"></div>');

        list.forEach((person) => {
          let foundKey = null;
          let foundVal = null;
          for (const [key, val] of Object.entries(window.peopleDB)) {
            if (val.name === person.name) {
              foundKey = key;
              foundVal = val;
              break;
            }
          }

          const clickAttrs = foundKey
            ? `data-bs-toggle="modal" data-bs-target="#exampleModal" data-img-key="${foundKey}"`
            : "";

          // 프로필 사진: peopleDB에 등록된 사진 우선, 없으면 person.profile_img
          const photo = (foundVal && foundVal.profile_img) || person.profile_img || "";
          const photoHTML = photo
            ? `<img class="people-mini-photo" src="${photo}" alt="${person.name}" onerror="this.remove()" />`
            : "";

          grid.append(`
            <div class="people-card people-card-compact ${foundKey ? "" : "alumni-noclick"}" ${clickAttrs}>
              ${photoHTML}
              <div class="people-compact-info">
                <span class="people-name">${person.name}</span>
              </div>
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

    // 대표 연구분야: JSON의 "tag" 필드가 있으면 그대로 사용, 없으면 research_interests에서 약어 추출
    let interest = "";
    if (person.tag) {
      interest = person.tag;
    } else if (Array.isArray(person.research_interests) && person.research_interests.length > 0) {
      interest = shortenInterest(String(person.research_interests[0]));
    }
    const interestHTML = interest ? `<div class="people-interest">${interest}</div>` : "";

    const networkIconsHTML = showIconsInMainView
      ? `<ul class="network-icon people-icons" aria-hidden="true">${createNetworkIcons(person)}</ul>`
      : "";

    // 직책(position)에서 역할(Server Manager, Lab Captain 등)을 분리해
    // 사진 우측 상단 아이콘 배지로 표시 (마우스를 올리면 역할명 표시)
    const parts = position.split(/<br\s*\/?>/i);
    const basePosition = parts[0].trim();
    const roleBadges = parts.slice(1).map((r) => {
      const role = r.trim();
      if (!role) return "";
      let icon = "★";
      let cls = "role-etc";
      if (/server/i.test(role)) { icon = "⚙"; cls = "role-server"; }
      else if (/captain/i.test(role)) { icon = "★"; cls = "role-captain"; }
      return `<span class="people-role ${cls}" title="${role}">${icon}</span>`;
    }).join("");

    // PI는 사진 포함 카드, 학생은 이름 중심의 컴팩트 카드 (사진은 클릭 시 모달에서 표시)
    if (showIconsInMainView) {
      return `
        <div class="people-card people-card-pi"
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
          data-img-key="${imgKey}">
          <div class="people-photo-wrap">
            <img class="people-photo" src="${person.profile_img}" alt="${name}-profile-img" />
          </div>
          <div class="people-name">${name}</div>
          ${networkIconsHTML}
        </div>
      `;
    }

    return `
      <div class="people-card people-card-compact"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
        data-img-key="${imgKey}">
        <img class="people-mini-photo" src="${person.profile_img}" alt="${name}" onerror="this.remove()" />
        <div class="people-compact-info">
          <span class="people-name">${name}</span>${roleBadges ? `<span class="people-roles-inline">${roleBadges}</span>` : ""}
          ${interest ? `<div class="people-interest-inline">${interest}</div>` : ""}
        </div>
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

  // ===== 모바일 뒤로가기로 모달 닫기 =====
  // 모달이 열릴 때 히스토리를 한 단계 쌓아서, 뒤로가기를 누르면
  // 페이지를 벗어나는 대신 모달만 닫히도록 한다.
  (function () {
    var modalEl = document.getElementById("exampleModal");
    if (!modalEl) return;

    modalEl.addEventListener("shown.bs.modal", function () {
      history.pushState({ hpicModal: true }, "");
    });

    window.addEventListener("popstate", function () {
      if (modalEl.classList.contains("show") && window.bootstrap && window.bootstrap.Modal) {
        var inst = window.bootstrap.Modal.getInstance(modalEl);
        if (inst) inst.hide();
      }
    });

    // X 버튼·배경 클릭 등으로 닫았을 때는 쌓아둔 히스토리를 정리
    modalEl.addEventListener("hidden.bs.modal", function () {
      if (history.state && history.state.hpicModal) {
        history.back();
      }
    });

    // 배경(모달 바깥 빈 곳) 클릭/터치 시 닫기 — 기본 동작이 막히는 경우 대비
    modalEl.addEventListener("click", function (e) {
      if (e.target === modalEl && window.bootstrap && window.bootstrap.Modal) {
        var inst = window.bootstrap.Modal.getInstance(modalEl);
        if (inst) inst.hide();
      }
    });
  })();

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
      links,
      person.academic_services
    );
  });

  function updateModalContent(name, profile_img, biography, email, position, research_interests, education, publication, experience, tape_out_schedule, Awards, affiliation, program_period, links, academic_services) {
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
            <ul id="modal-network-icons" class="network-icon" style="padding: 8px 0;">
                ${iconsHTML}
            </ul>
        `);
    }

    // PI(교수)는 Research Interests를 홈페이지에서 보여주므로 카드에서 숨김
    const isProfessor = (position || "").indexOf("Professor") !== -1;
    const parsed_research_interests = parseData(research_interests);

    if (!isProfessor && parsed_research_interests.length > 0) {
        $("#modal-research_interests-title").show();
        $("#modal-research_interests").show();
        updateList("#modal-research_interests", parsed_research_interests, "");
    } else {
        // PI이거나 내용이 없으면 제목과 리스트 모두 화면에서 숨김 처리
        $("#modal-research_interests-title").hide();
        $("#modal-research_interests").hide();
    }

    // Academic Services (CV 기반, PI 전용 — 데이터가 없으면 숨김)
    const parsed_services = parseData(academic_services);
    if (parsed_services.length > 0) {
        $("#modal-academic_services-title").show();
        $("#modal-academic_services").show();
        updateList("#modal-academic_services", parsed_services, "");
    } else {
        $("#modal-academic_services-title").hide();
        $("#modal-academic_services").hide();
    }

    const parsed_education = parseData(education);
    renderTimeline("#modal-education", parsed_education, "No education available.");

    const parsed_experience = parseData(experience);
    if (parsed_experience.length > 0) {
        $("#modal-experience-title").show();
        $("#modal-experience").show();
        renderTimeline("#modal-experience", parsed_experience, "");
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

    // ===== Publications: 홈페이지 Publications 데이터와 자동 연동 (동일 양식) =====
    // 논문 figure의 사진 파일명이 이 사람의 profile_img와 일치하는 논문을 모두 표시
    // PI 카드에는 Publications 섹션을 표시하지 않음
    const isPI = (position || "").indexOf("Professor") !== -1;
    const imgKey = (profile_img || "").split("/").pop();

    // 저자 목록에서 본인 이름 강조 (Bold + Underline). 국내 학회는 한글 이름으로 매칭
    const KR_NAME = {
      "Seung-Mo Jin": "진승모", "Dong-Ho Kim": "김동호", "Jae-Geon Lee": "이재건",
      "Sang-Hyun Ok": "옥상현", "Sang-Hyeon Ok": "옥상현", "Seung-Hwan Gong": "공승환",
      "Dong-Hoe Heo": "허동회", "Jae-Hyeon Pyeon": "편재현", "In-Ho Han": "한인호",
      "Dong-Hyun Lee": "이동현", "Do-Hyeong Lee": "이동현",
      "Shin-Uk Kang": "강신욱", "So-Yeon Kwon": "권소연", "Seol-Hyeon Kim": "김설현",
      "Joon-Seok Kwon": "권준석", "Dong-Eun Lee": "이동은", "Tae-Hyun Kim": "김태현",
      "Min-Gwon Song": "송민권", "Suk-Min Yoon": "윤석민", "Han-Gil Yoo": "유한길",
      "Woo-Suk Jung": "정우석", "Kyu-Ran Park": "박규란", "In-Woo Jang": "장인우",
      "Geun-Young Yoo": "유근영", "Seung-Wan Han": "한승완", "Ji-Hyeon Kwon": "권지현"
    };
    // 영문 표기가 두 가지인 경우 (프로필 이름 ↔ 논문 저자 표기)
    const EN_ALIAS = {
      "Sang-Hyun Ok": ["Sang-Hyeon Ok"],
      "Sang-Hyeon Ok": ["Sang-Hyun Ok"]
    };
    // 프로필 사진 파일이 교체되어 논문 figure와 달라진 경우
    const IMG_ALIAS = {
      "dh-kim-new-profile-image.jpg": "dh-kim-profile-image.jpg"
    };
    function highlightSelf(html) {
      var targets = [name].concat(EN_ALIAS[name] || []);
      if (KR_NAME[name]) targets.push(KR_NAME[name]);
      targets.forEach(function (t) {
        html = html.split(t).join("<b><u>" + t + "</u></b>");
      });
      return html;
    }

    const pubKey = (window.pubIndex || {})[imgKey] ? imgKey : (IMG_ALIAS[imgKey] || imgKey);
    const autoPubs = isPI ? [] : ((window.pubIndex || {})[pubKey] || [])
      .slice()
      .sort((a, b) => b.year - a.year)
      .map((p, i) =>
        '<div class="mpub-entry">' +
          '<div class="mpub-num">' + (i + 1) + "</div>" +
          '<div class="mpub-side">' + p.side + "</div>" +
          '<div class="mpub-body">' + highlightSelf(p.body) + "</div>" +
        "</div>");
    const parsedPublication = isPI ? [] : (autoPubs.length > 0 ? autoPubs : parseData(publication));
    if (parsedPublication.length > 0) {
      $("#modal-publication-title").show();
      $("#modal-publication").show();
      updateList("#modal-publication", parsedPublication, "");
    } else {
      $("#modal-publication-title").hide();
      $("#modal-publication").hide();
    }

    // ===== Awards: News의 Award 항목과 자동 연동 (+ 수동 항목 이어붙임) =====
    // News 본문의 <u>이름</u>이 이 사람 이름(주어진 이름 기준)과 일치하면 표시
    const autoAwards = (window.newsAwards || [])
      .filter((a) => a.names.some((n) => name === n || name.indexOf(n + " ") === 0))
      .slice()
      .reverse() // 오래된 것부터
      .map((a) => {
        // 사진이 있으면 문장 전체가 클릭 가능한 링크
        var body = a.img
          ? '<a href="' + a.img + '" target="_blank" rel="noopener noreferrer" class="mpub-award-link">' + a.text + "</a>"
          : a.text;
        return '<div class="mpub-entry">' +
          '<div class="mpub-side mpub-date">' + a.ym + "</div>" +
          '<div class="mpub-body">' + body + "</div>" +
        "</div>";
      });
    const manualAwards = parseData(Awards).map((t) =>
      '<div class="mpub-entry">' +
        '<div class="mpub-side mpub-date"></div>' +
        '<div class="mpub-body">' + t + "</div>" +
      "</div>");
    const parsedAwards = autoAwards.concat(manualAwards);
    if (parsedAwards.length > 0) {
      $("#modal-Awards-title").show();
      $("#modal-Awards").show();
      updateList("#modal-Awards", parsedAwards, "");
    } else {
      $("#modal-Awards-title").hide();
      $("#modal-Awards").hide();
    }

    // Alumni: Current Affiliation + Program (Period)
    if (affiliation) {
      $("#modal-affiliation").text(affiliation);
      $("#modal-affiliation-title").show();
      $("#modal-affiliation").show();
    } else {
        $("#modal-affiliation-title").hide();
        $("#modal-affiliation").hide();
    }

    // Program (Period)은 Education에 이미 표시되므로 사용하지 않음
    $("#modal-program_period-title").hide();
    $("#modal-program_period").hide();
  }

  function parseData(data) {
    if (Array.isArray(data)) return data;
    if (typeof data === "string") {
      try { return JSON.parse(data); } catch (e) { return []; }
    }
    return [];
  }

  // Education/Experience 한 줄을 학위·기관·기간으로 분해
  function parseCVEntry(str) {
    var s = String(str).trim();
    var period = "";
    var m = s.match(/\(([^()]*[~–-][^()]*)\)\s*$/);
    if (m) {
      period = m[1].trim().replace(/\s*~\s*/, " – ");
      s = s.slice(0, m.index).trim().replace(/,\s*$/, "");
    }
    var parts = s.split(",").map(function (x) { return x.trim(); }).filter(Boolean);
    var kw = /(University|Institute|College|Center|Research|Corp|Inc|Semiconductor|Electronics|Labs?|Company|Univ|대학교|연구소|연구원)/i;
    var instIdx = -1;
    for (var i = 1; i < parts.length; i++) { if (kw.test(parts[i])) { instIdx = i; break; } }
    if (instIdx === -1) instIdx = parts.length >= 2 ? 1 : -1;
    var title, inst;
    if (instIdx >= 1) { title = parts.slice(0, instIdx).join(", "); inst = parts[instIdx]; }
    else { title = parts.join(", "); inst = ""; }
    return { title: title, inst: inst, period: period };
  }

  // 타임라인(시안1) 렌더링 — 학위/직함(굵게) + 기관(회색) + 기간(우측)
  function renderTimeline(selector, items, emptyMessage) {
    var $el = $(selector);
    $el.empty();
    if (!items || items.length === 0) {
      if (emptyMessage) $el.append('<li class="tl-item"><div class="tl-row"><span class="tl-title">' + emptyMessage + "</span></div></li>");
      return;
    }
    items.forEach(function (it) {
      var e = parseCVEntry(it);
      $el.append(
        '<li class="tl-item">' +
          '<span class="tl-dot"></span>' +
          '<div class="tl-row">' +
            '<span class="tl-title">' + e.title + "</span>" +
            (e.period ? '<span class="tl-date">' + e.period + "</span>" : "") +
          "</div>" +
          (e.inst ? '<div class="tl-inst">' + e.inst + "</div>" : "") +
        "</li>"
      );
    });
  }

  function updateList(selector, items, emptyMessage) {
    const list = $(selector);
    list.empty();
    if (items.length > 0) {
      items.forEach((item) => {
        // CV 스타일: 끝의 "(2012.03 ~ 2019.08)" / "(2026.03 ~ Present)" 기간을 오른쪽 정렬
        const m = typeof item === "string"
          ? item.match(/^(.*?)\s*\((\d{4}\.\d{2}\s*~\s*(?:\d{4}\.\d{2}|Present))\)\s*$/)
          : null;
        if (m) {
          list.append(`<li><span class="cv-line"><span>${m[1]}</span><span class="cv-date">${m[2]}</span></span></li>`);
        } else {
          list.append(`<li>${item}</li>`);
        }
      });
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
      buildPeopleSideNav();
  });

  // ===== People 좌측 사이드바: PI / Lab Captain / Server Manager 바로가기 =====
  function buildPeopleSideNav() {
    const sidebar = $("#people .sticky-sidebar");
    if (!sidebar.length) return;
    sidebar.find(".people-side-nav").remove();

    const roles = [
      { label: "Principal Investigator", icon: "♛", re: /professor/i, cls: "side-pi" },
      { label: "Lab Captain", icon: "★", re: /captain/i, cls: "side-captain" },
      { label: "Server Manager", icon: "⚙", re: /server/i, cls: "side-server" }
    ];

    let html = "";
    roles.forEach((role) => {
      for (const [key, p] of Object.entries(window.peopleDB)) {
        if (role.re.test(p.position || "")) {
          html += `
            <div class="people-side-item" data-img-key="${key}" title="View profile">
              <img class="people-mini-photo" src="${p.profile_img}" alt="${p.name}" onerror="this.remove()" />
              <div>
                <div class="people-side-name">${p.name}</div>
                <span class="people-side-label ${role.cls}">${role.icon ? role.icon + " " : ""}${role.label}</span>
              </div>
            </div>`;
          break; // 역할당 한 명
        }
      }
    });

    if (html === "") return;
    sidebar.append(`<div class="people-side-nav">${html}</div>`);

    sidebar.on("click", ".people-side-item", function () {
      const modalEl = document.getElementById("exampleModal");
      if (modalEl && window.bootstrap && window.bootstrap.Modal) {
        window.bootstrap.Modal.getOrCreateInstance(modalEl).show(this);
      }
    });
  }

});