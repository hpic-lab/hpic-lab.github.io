$(document).ready(function () {
    const researchProjects = [
      {
        date: "Jul. 2026 - Dec. 2030",
        title:
          "이종집적 광회로 기반 호모다인 광신경망 프로세서 기술 개발",
        sponsor: "Ministry of Science and ICT (MSIT)",
        desc:
          "Development of Heterogeneous Integrated Photonic Circuits for Homodyne Photonic Neural Network Processor. 상위 사업: 차세대광기반연산반도체핵심기술개발사업 (과학기술정보통신부 원천기술개발사업). 1단계 2026.07–2028.12 (2년 6개월), 2단계 2029.01–2030.12 (2년).",
      },
      {
        date: "Jul. 2026 - Dec. 2030",
        title:
          "SDV 대응 가혹환경극복 차량용 멀티표준 지원 가능 고신뢰 고속 인터페이스 IP 기술 개발",
        sponsor: "Ministry of Science and ICT (MSIT)",
        desc:
          "Development of Highly Reliable Multi-Standard Automotive SerDes IP for SDVs in Harsh Automotive Environments. 상위 사업: 나노·소재기술개발 – SDV대응 가혹환경극복 자동차반도체 핵심IP 원천기술개발사업. 1단계 2026.07–2028.12 (30개월), 2단계 2029.01–2030.12 (24개월). 정부지원금 총 10,625백만원 (1단계 6,875, 2단계 3,750백만원), 전문기관 한국연구재단(NRF).",
      },
      {
        date: "Apr. 2026 - Dec. 2029",
        title:
          "이기종 디바이스 간 초고대역폭, 저지연 직렬 인터페이스 기술 개발",
        sponsor: "Ministry of Science and ICT (MSIT)",
        desc:
          "관리번호 2026-AI반도체-6 (지정공모형). 상위 사업: AI반도체를 활용한 K-클라우드 기술개발사업 (과학기술정보통신부 · 정보통신기획평가원(IITP) 정보통신방송기술개발사업). 총 45개월 — 1단계 2년, 2단계 2년; 1차년도 2026.04.01–2026.12.31 (9개월). 정부지원연구개발비 총 140억원 이내 (1단계 65.34억, 2단계 74.66억). 주관 ㈜파네시아(정명수 대표), 참여 한양대학교(추민성 교수) 등.",
      },
      {
        date: "Jun. 2025 - Dec. 2029",
        title:
          "2.5D 광패키징 기반 CPO를 위한 Opto-chiplet이 집적된 인터포저 기술",
        sponsor: "Ministry of Science and ICT (MSIT)",
        desc:
          "상위 사업: 차세대 광패키징기술개발사업 (과학기술정보통신부 원천기술개발사업). 총 55개월 — 1단계 3년(31개월), 2단계 2년(24개월); 1차년도 2025.06.01–2025.12.31 (7개월). 정부지원연구개발비 총 9,029백만원 (1차년도 약 1,149백만원). 총괄책임: 한국전자통신연구원(ETRI) 이종진 책임연구원.",
      },
      {
        date: "May. 2025 - Feb. 2030",
        title:
          "유기발광 디스플레이 전문인력양성",
        sponsor: "Korea Display Industry Association",
        status: "Completed",
      },
      {
        date: "May 2025 - Apr. 2026",
        title:
          "극저온 초전도 양자컴퓨터 판독 수신기",
        sponsor: "Samsung Electronics",
        status: "Completed",
      },
      {
        date: "Apr. 2024 - Mar. 2029",
        title:
          "광통신 칩렛 향 고속, 저전력, 저잡음 클럭킹 네트워크 시스템 개발",
        sponsor: "National Research Foundation (NRF) of Korea",
        desc:
          "Development of High-Speed, Low-Power, and Low-Noise Clocking Network Systems for Optical Communication Chiplets. 2024년도 우수신진연구 신규과제 (개인기초연구사업 — 과학기술정보통신부 소관, 한국연구재단(NRF) 시행). 연구기간 '24~'29 (5년): 1단계(1~3차년), 2단계(4~5차년).",
      },
      {
        date: "Apr. 2022 - Dec. 2024",
        title:
          "Development of low-power/high-performance 2T DRAM PIM cell, integrated circuits, and architecture",
        sponsor: "National Research Foundation (NRF) of Korea",
        status: "Completed",
      },
      {
        date: "Sep. 2022 - Sep. 2023",
        title:
          "Design Methodology of High-Performance Integrated Circuits based on Reinforcement Learning",
        sponsor: "Quallitas Semiconductor",
        status: "Completed",
      },
      {
        date: "Sep. 2022 - Sep. 2023",
        title:
          "Development of High PSRR Low Phase Noise Voltage-Controlled Oscillator (VCO)",
        sponsor: "ACONIC Inc.",
        status: "Completed",        
      },
      {
        date: "Jul. 2022 - Feb. 2025",
        title: "반도체전공트랙사업",
        sponsor: "KIAT",
        status: "Completed",
      },
      {
        date: "Mar. 2022 - Aug. 2027",
        title: "BK21 (고신뢰성 에너지용 지능형 시스템반도체 교육연구단)",
        sponsor: "Ministry of Education",
        status: "Completed",
      },
      {
        date: "Mar. 2022 - Dec. 2025",
        title: "AI Hardware Center (인공지능 반도체 융합연구센터)",
        sponsor: "National Research Foundation (NRF) of Korea",
        status: "Completed",        
      },
      {
        date: "Sep. 2022 - Feb. 2024",
        title:
          "강화학습 기반 고성능 아날로그 집적회로 설계 및 측정 플랫폼 개발",
        sponsor: "National Research Foundation (NRF) of Korea",
        status: "Completed",
      },
      {
        date: "Mar. 2022 - Feb. 2023",
        title: "신임교원 정착연구지원사업",
        sponsor: "Hanyang University",
        status: "Completed",
      },
      
    ];
  
    const container = $(".research-projects-container");

    // ===== 과제 행 (시안 3: 클릭 시 상세 펼침) =====
    // 각 과제에 아래 필드를 추가하면 행 우측에 ▸ 가 생기고 클릭 시 상세가 펼쳐집니다.
    //   desc:    "과제 설명 (한 줄~한 문단)",
    //   role:    "HPIC이 담당하는 역할",
    //   sponsor_logo: "img/sponsors/msit.png",
    //   partners: [ { name: "ETRI", logo: "img/sponsors/etri.png" }, ... ]
    function projectRow(item, num) {
      const hasDetail =
        item.desc || item.role || item.sponsor_logo ||
        (Array.isArray(item.partners) && item.partners.length > 0);

      let detailHTML = "";
      if (hasDetail) {
        let logos = "";
        if (item.sponsor_logo) {
          logos += `<img class="rp-logo" src="${item.sponsor_logo}" alt="${item.sponsor}" title="${item.sponsor}" onerror="this.remove()">`;
        }
        (item.partners || []).forEach((p) => {
          if (p.logo) {
            logos += `<img class="rp-logo" src="${p.logo}" alt="${p.name}" title="${p.name}" onerror="this.remove()">`;
          } else if (p.name) {
            logos += `<span class="rp-partner-name">${p.name}</span>`;
          }
        });

        detailHTML = `
          <div class="rp-detail" style="display: none;">
            ${item.desc ? `<p class="rp-desc">${item.desc}</p>` : ""}
            ${item.role ? `<p class="rp-role"><b>HPIC Role</b> — ${item.role}</p>` : ""}
            ${logos ? `<div class="rp-logos">${logos}</div>` : ""}
          </div>`;
      }

      return `
        <div class="rp-item ${hasDetail ? "rp-expandable" : ""}">
          <span class="rp-num">${num}</span>
          <div class="rp-body">
            <div class="rp-head">
              <div class="rp-head-main">
                <span class="rp-date">${item.date}</span>
                <span class="rp-title">${item.title}</span>
                <div class="rp-sponsor">${item.sponsor}</div>
              </div>
              ${hasDetail ? '<span class="rp-arrow">&#9662;</span>' : ""}
            </div>
            ${detailHTML}
          </div>
        </div>
      `;
    }

    const projectCard = projectRow;

    // 진행중 과제는 바로 표시
    const ongoing = researchProjects.filter((p) => p.status !== "Completed");
    const completed = researchProjects.filter((p) => p.status === "Completed");

    // 연번: 그룹별 개별 부여 (Chip Gallery와 동일하게 최신=큰 번호, 위→아래 내림차순)
    let onNum = ongoing.length;
    ongoing.forEach((item) => container.append(projectCard(item, onNum--)));

    // 완료 과제는 접힌 서브섹션으로 (클릭 시 펼침)
    if (completed.length > 0) {
      container.append(`
        <div class="completed-toggle collapsed">
          <span>Completed Projects (${completed.length})</span>
          <span class="completed-arrow">▾</span>
        </div>
        <div class="completed-projects" style="display:none"></div>
      `);

      const completedDiv = container.find(".completed-projects");
      let cpNum = completed.length;
      completed.forEach((item) => completedDiv.append(projectCard(item, cpNum--)));

      container.on("click", ".completed-toggle", function () {
        $(this).toggleClass("collapsed");
        completedDiv.stop(true, false).slideToggle(250);
      });
    }

    // 상세 펼침/접힘
    container.on("click", ".rp-item.rp-expandable .rp-head", function () {
      const item = $(this).closest(".rp-item");
      item.toggleClass("open");
      item.find(".rp-detail").stop(true, false).slideToggle(220);
    });
  });
  