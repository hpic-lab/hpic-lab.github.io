$(document).ready(function () {
    const researchProjects = [
      {
        date: "Oct. 2026 - Sep. 2029",
        title:
          "차세대 메모리 컨트롤러용 PCIe Gen6/CXL 대응 64GT/s급 저전력 DAC/ADC-DSP 기반 Reconfigurable PAM-N SerDes 송수신기(TRX) 설계 기술 개발",
        sponsor: "Samsung Electronics (DS Division)",
        type: "industry",   // 산학과제
        desc:
          "Reconfigurable PAM-N SerDes Transceiver Based on 64 GT/s Low-Power DAC/ADC-DSP for Next-Generation PCIe Gen6/CXL Memory Controllers. 삼성전자 DS부문 신진산학 3기 과제. 연구기간 2026.10.01–2029.09.30 (3년).",
      },
      {
        date: "Oct. 2026 - Jan. 2027",
        title:
          "지반침하와 지하매설물 감지용 레이더 센서용 클럭발생기 IP 개발",
        sponsor: "Electronics and Telecommunications Research Institute (ETRI)",
        type: "industry",   // 비정부(연구용역)
        desc:
          "Clock Generator IP for Radar Sensors Detecting Ground Subsidence and Underground Utilities. 지하매설물 탐지용 레이더 센서의 RF 송수신기에 고분해능 타이밍을 제공하는 저지터·고해상도 클럭 발생기(DLL) 설계 (한국전자통신연구원 연구용역).",
      },
      {
        date: "Jul. 2026 - Oct. 2026",
        title:
          "PAM-4 고속 직렬 인터페이스 수신기 등화기 성능 분석",
        sponsor: "Korea Electronics Technology Institute (KETI)",
        type: "industry",   // 산학(연구개발서비스)
        desc:
          "PAM-4 DSP 기반 수신기의 DFE/FFE 등화기 알고리즘 구현 및 성능 분석 코드 개발 (ZCU208 RFSoC 기반 PAM-4 수신기 DSP 플랫폼, AWGN 채널 BER/SER 분석). 상위 과제: 차세대 서버 및 가속기 시스템을 위한 FRA 및 텔레메트리 지원 PCIe Retimer IC 개발 (한국전자기술연구원 외부 전문기술 활용).",
      },
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
          "Development of Highly Reliable Multi-Standard Automotive SerDes IP for SDVs in Harsh Automotive Environments. 상위 사업: 나노·소재기술개발 – SDV대응 가혹환경극복 자동차반도체 핵심IP 원천기술개발사업. 1단계 2026.07–2028.12 (30개월), 2단계 2029.01–2030.12 (24개월). 전문기관 한국연구재단(NRF).",
      },
      {
        date: "Apr. 2026 - Dec. 2029",
        title:
          "이기종 디바이스 간 초고대역폭, 저지연 직렬 인터페이스 기술 개발",
        sponsor: "Ministry of Science and ICT (MSIT)",
        desc:
          "관리번호 2026-AI반도체-6 (지정공모형). 상위 사업: AI반도체를 활용한 K-클라우드 기술개발사업 (과학기술정보통신부 · 정보통신기획평가원(IITP) 정보통신방송기술개발사업). 총 45개월 — 1단계 2년, 2단계 2년; 1차년도 2026.04.01–2026.12.31 (9개월). 주관 ㈜파네시아(정명수 대표), 참여 한양대학교(추민성 교수) 등.",
      },
      {
        date: "Jun. 2025 - Dec. 2029",
        title:
          "2.5D 광패키징 기반 CPO를 위한 Opto-chiplet이 집적된 인터포저 기술",
        sponsor: "Ministry of Science and ICT (MSIT)",
        desc:
          "상위 사업: 차세대 광패키징기술개발사업 (과학기술정보통신부 원천기술개발사업). 총 55개월 — 1단계 3년(31개월), 2단계 2년(24개월); 1차년도 2025.06.01–2025.12.31 (7개월). 총괄책임: 한국전자통신연구원(ETRI) 이종진 책임연구원.",
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
        sponsor: "National Research Foundation (NRF)",
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
    // 날짜를 홈페이지 전반과 동일한 "YYYY. MM" 표기로 변환
    // 예: "Jul. 2026 - Dec. 2030" → "2026. 07 - 2030. 12"
    function fmtDate(s) {
      const MON = { jan:"01", feb:"02", mar:"03", apr:"04", may:"05", jun:"06",
                    jul:"07", aug:"08", sep:"09", oct:"10", nov:"11", dec:"12" };
      return String(s).replace(/([A-Za-z]{3,})\.?\s+(\d{4})/g, function (m, mon, yr) {
        const mm = MON[mon.slice(0, 3).toLowerCase()];
        return mm ? (yr + ". " + mm) : m;
      });
    }

    // 과제번호·전문기관·주관·영문과제명 블록 (학생 사사 작성용)
    function grantHTML(item) {
      var agencyName = item.agency === "IITP" ? "정보통신기획평가원 (IITP)" : "한국연구재단 (NRF)";
      return '<div class="rp-grant">' +
        '<div><span class="rp-grant-k">과제번호</span><code class="rp-grant-no">' + item.grant_no + '</code>' +
        '<button type="button" class="rp-copy" data-copy="' + item.grant_no + '">Copy</button></div>' +
        '<div><span class="rp-grant-k">전문기관</span>' + agencyName +
        (item.agency_note ? ' <span class="rp-warn">※ ' + item.agency_note + '</span>' : '') + '</div>' +
        (item.lead ? '<div><span class="rp-grant-k">주관·총괄</span>' + item.lead + '</div>' : '') +
        (item.en_title ? '<div><span class="rp-grant-k">영문 과제명</span>' + item.en_title + '</div>' : '') +
        ackHTML(item) +
        '</div>';
    }

    // 과제별 사사문구 (단독 과제 기준, 연도 = 올해 → 논문 게재연도로 수정)
    function escAttr(s) { return String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;"); }
    function ackHTML(item) {
      var y = new Date().getFullYear();
      var iitp = item.agency === "IITP";
      var agKo = iitp ? "정보통신기획평가원" : "한국연구재단";
      var agEn = iitp ? "the Institute of Information & Communications Technology Planning & Evaluation (IITP)"
                      : "the National Research Foundation of Korea (NRF)";
      var rows = [
        ["사사 (국문)", "이 논문은 " + y + "년도 정부(과학기술정보통신부)의 재원으로 " + agKo + "의 지원을 받아 수행된 연구임(" + item.grant_no + ", " + item.title + ")."],
        ["사사 (영문)", "This work was supported by " + agEn + " grant funded by the Korean government (MSIT) in " + y + " (Grant No. " + item.grant_no + ", Project Title: " + item.en_title + ")."],
        ["사사 (영문 간략)", "This work was supported by " + agEn + " funded by the Korean Government Ministry of Science and ICT (MSIT) under Grant " + item.grant_no + "."]
      ];
      return '<div class="rp-ack">' + rows.map(function (r) {
        return '<div class="rp-ack-row"><div class="rp-ack-h"><span class="rp-grant-k">' + r[0] + '</span>' +
          '<button type="button" class="rp-copy" data-copy="' + escAttr(r[1]) + '">Copy</button></div>' +
          '<p class="rp-ack-text">' + r[1].replace(/&/g, "&amp;").replace(/</g, "&lt;") + '</p></div>';
      }).join("") +
        '<div class="rp-ack-note">※ 단독 과제 기준. 연도는 논문 게재연도로, 여러 과제를 함께 사사할 때는 아래 Acknowledgment Guide의 생성기를 사용 (기여율 필요).' +
        (item.agency_note ? ' 전문기관 확인 후 사용.' : '') + '</div></div>';
    }

    function projectRow(item, num) {
      const hasDetail =
        item.grant_no || item.desc || item.role || item.sponsor_logo ||
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
            ${item.grant_no ? grantHTML(item) : ""}
            ${item.desc ? `<p class="rp-desc">${item.desc}</p>` : ""}
            ${item.type === "industry" ? `<p class="rp-ack-note">※ 사사 표기 여부는 교수님께 확인 후 기재.</p>` : ""}
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
                <div class="rp-title">${item.title}</div>
                <div class="rp-meta">
                  <span class="rp-date">${fmtDate(item.date)}</span>
                  <span class="rp-sponsor">${item.sponsor}</span>
                </div>
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
    // 진행중 과제: 정부과제 / 산학과제 구분 (type: "industry" → 산학과제), 그룹별 연번
    const ongoingGov = ongoing.filter((p) => p.type !== "industry");
    const ongoingInd = ongoing.filter((p) => p.type === "industry");
    [
      ["Government Projects", ongoingGov],
      ["Non-Government Projects", ongoingInd],
    ].forEach(([label, list]) => {
      if (!list.length) return;
      container.append(`<div class="rp-group-label">${label}</div>`);
      let n = list.length;
      list.forEach((item) => container.append(projectCard(item, n--)));
    });

    // ===== 사사(Acknowledgment) 가이드: 내부 전용 (hpic-lab SharePoint 문서로 연결) =====
    container.append(
      '<a class="completed-toggle collapsed ack-toggle ack-link" href="https://hpiclab.sharepoint.com/sites/hpic-lab/_layouts/15/Doc.aspx?sourcedoc=%7BFB219FA9-6CF1-4DC3-960E-9ADD3D0F0CD4%7D&amp;file=HPIC_%EC%82%AC%EC%82%AC_%EA%B0%80%EC%9D%B4%EB%93%9C(Acknowledgment%20Guide).docx&amp;action=view" target="_blank" rel="noopener noreferrer" title="Members only (hpic-lab 계정)">' +
        '<span>&#128274; Acknowledgment Guide (사사 가이드)</span><span class="ack-link-sub">Members only &#9634;</span>' +
      '</a>'
    );

    // 사사 가이드: 새 탭 대신 홈페이지 내 팝업(모달)으로 표시 (SharePoint embed — hpic-lab 로그인 필요)
    (function () {
      var SP = "https://hpiclab.sharepoint.com/sites/hpic-lab/_layouts/15/Doc.aspx?sourcedoc=%7BFB219FA9-6CF1-4DC3-960E-9ADD3D0F0CD4%7D";
      if (!document.getElementById("ack-modal-style")) {
        $("head").append('<style id="ack-modal-style">' +
          '.ack-modal{position:fixed;inset:0;z-index:10000;background:rgba(15,25,45,.55);display:none;align-items:center;justify-content:center;padding:3vh 3vw}' +
          '.ack-modal.open{display:flex}' +
          '.ack-modal-box{background:#fff;border-radius:10px;width:min(1000px,94vw);height:90vh;display:flex;flex-direction:column;overflow:hidden;box-shadow:0 12px 40px rgba(0,0,0,.3)}' +
          '.ack-modal-head{display:flex;align-items:center;justify-content:space-between;padding:10px 16px;border-bottom:1px solid #e9e9e9;font-weight:700;color:#1F3C74}' +
          '.ack-modal-head a{font-size:.85rem;font-weight:500;color:#2E55BE;margin-right:14px;text-decoration:none}' +
          '.ack-modal-close{border:0;background:none;font-size:1.6rem;line-height:1;color:#888;cursor:pointer}' +
          '.ack-modal-close:hover{color:#333}' +
          '.ack-modal iframe{flex:1;width:100%;border:0}' +
          '.ack-modal-note{font-size:.78rem;color:#999;padding:6px 16px;border-top:1px solid #f0f0f0}' +
          '</style>');
      }
      function openAck() {
        var m = $("#ack-modal");
        if (!m.length) {
          m = $('<div id="ack-modal" class="ack-modal" role="dialog" aria-modal="true">' +
            '<div class="ack-modal-box">' +
              '<div class="ack-modal-head"><span>&#128274; Acknowledgment Guide (사사 가이드)</span>' +
                '<span><a href="' + SP + '&amp;action=view" target="_blank" rel="noopener noreferrer">새 창에서 열기 &#8599;</a>' +
                '<button type="button" class="ack-modal-close" aria-label="닫기">&times;</button></span></div>' +
              '<iframe title="Acknowledgment Guide" loading="lazy"></iframe>' +
              '<div class="ack-modal-note">hpic-lab 계정으로 로그인한 구성원만 볼 수 있습니다. 내용이 보이지 않으면 위의 [새 창에서 열기]를 이용하세요.</div>' +
            '</div></div>');
          $("body").append(m);
          m.on("click", function (e) { if (e.target === this) closeAck(); });
          m.on("click", ".ack-modal-close", closeAck);
        }
        var f = m.find("iframe");
        if (!f.attr("src")) f.attr("src", SP + "&action=embedview");
        m.addClass("open");
        $("body").css("overflow", "hidden");
      }
      function closeAck() { $("#ack-modal").removeClass("open"); $("body").css("overflow", ""); }
      $(document).on("keydown", function (e) { if (e.key === "Escape") closeAck(); });
      container.on("click", "a.ack-link", function (e) { e.preventDefault(); e.stopImmediatePropagation(); openAck(); });
    })();

    // 복사 버튼 (과제번호 / 생성된 사사문구)
    container.on("click", ".rp-copy", function (e) {
      e.stopPropagation();
      var btn = $(this);
      var txt = btn.data("copy") || btn.closest(".ack-out").find("p").text();
      if (!txt) return;
      var done = function () { btn.text("Copied!"); setTimeout(function () { btn.text("Copy"); }, 1200); };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(String(txt)).then(done, function () { window.prompt("Copy:", txt); });
      } else {
        window.prompt("Copy:", txt);
      }
    });

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

      container.on("click", ".completed-toggle:not(.ack-toggle)", function () {
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
  
