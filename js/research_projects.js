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
        grant_no: "RS-2026-25607377",
        agency: "NRF",
        agency_note: "전문기관(NRF/IITP) 확인 필요",
        lead: "KIST (한재훈)",
        short: "광컴퓨팅",
        en_title: "Development of Heterogeneous Integrated Photonic Circuits for Homodyne Photonic Neural Network Processor",
        desc:
          "Development of Heterogeneous Integrated Photonic Circuits for Homodyne Photonic Neural Network Processor. 상위 사업: 차세대광기반연산반도체핵심기술개발사업 (과학기술정보통신부 원천기술개발사업). 1단계 2026.07–2028.12 (2년 6개월), 2단계 2029.01–2030.12 (2년).",
      },
      {
        date: "Jul. 2026 - Dec. 2030",
        title:
          "SDV 대응 가혹환경극복 차량용 멀티표준 지원 가능 고신뢰 고속 인터페이스 IP 기술 개발",
        sponsor: "Ministry of Science and ICT (MSIT)",
        grant_no: "RS-2026-25591915",
        agency: "NRF",
        lead: "성균관대학교 (이강윤)",
        short: "SDV",
        en_title: "Development of Highly Reliable Multi-Standard Automotive SerDes IP for SDVs in Harsh Automotive Environments",
        desc:
          "Development of Highly Reliable Multi-Standard Automotive SerDes IP for SDVs in Harsh Automotive Environments. 상위 사업: 나노·소재기술개발 – SDV대응 가혹환경극복 자동차반도체 핵심IP 원천기술개발사업. 1단계 2026.07–2028.12 (30개월), 2단계 2029.01–2030.12 (24개월). 전문기관 한국연구재단(NRF).",
      },
      {
        date: "Apr. 2026 - Dec. 2029",
        title:
          "이기종 디바이스 간 초고대역폭, 저지연 직렬 인터페이스 기술 개발",
        sponsor: "Ministry of Science and ICT (MSIT)",
        grant_no: "RS-2026-25508822",
        agency: "IITP",
        lead: "파네시아 (정명수)",
        short: "K-클라우드",
        en_title: "Development of a high-bandwidth, low-latency serial interface technology for heterogenous devices",
        desc:
          "관리번호 2026-AI반도체-6 (지정공모형). 상위 사업: AI반도체를 활용한 K-클라우드 기술개발사업 (과학기술정보통신부 · 정보통신기획평가원(IITP) 정보통신방송기술개발사업). 총 45개월 — 1단계 2년, 2단계 2년; 1차년도 2026.04.01–2026.12.31 (9개월). 주관 ㈜파네시아(정명수 대표), 참여 한양대학교(추민성 교수) 등.",
      },
      {
        date: "Jun. 2025 - Dec. 2029",
        title:
          "2.5D 광패키징 기반 CPO를 위한 Opto-chiplet이 집적된 인터포저 기술",
        sponsor: "Ministry of Science and ICT (MSIT)",
        grant_no: "RS-2025-16068050",
        agency: "NRF",
        agency_note: "전문기관(NRF/IITP) 확인 필요",
        lead: "필옵틱스 (이종진)",
        short: "CPO",
        en_title: "Interposer Technology Integrated with Opto-chiplets for 2.5D Optical Packaging-Based CPO",
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
        grant_no: "RS-2024-00339543",
        agency: "NRF",
        lead: "연세대학교 (추민성)",
        short: "우수신진",
        en_title: "Development of High-Speed, Low-Power, and Low-Noise Clocking Network Systems for Optical Communication Chiplets",
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
        '</div>';
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

    // ===== 사사(Acknowledgment) 가이드 + 문구 생성기 =====
    const grantProjects = ongoing.filter(function (p) { return p.grant_no; });
    if (grantProjects.length) {
      var chk = grantProjects.map(function (p, i) {
        return '<label class="ack-chk"><input type="checkbox" data-i="' + i + '"> <b>' + (p.short || "") + '</b> ' +
          p.grant_no + ' <span class="ack-ag">(' + p.agency + ')</span>' +
          '<span class="ack-pct-wrap">기여율<input type="number" class="ack-pct" data-i="' + i + '" min="0" max="100" placeholder="00">%</span></label>';
      }).join("");
      container.append(
        '<div class="completed-toggle ack-toggle collapsed"><span>Acknowledgment Guide (사사 가이드)</span><span class="completed-arrow">▾</span></div>' +
        '<div class="ack-guide" style="display:none">' +
          '<ul class="ack-rules">' +
            '<li>과제번호는 정식 형식(RS-연도-번호)으로 정확히 적고, 해당 논문에 <b>실제 기여한 과제만</b> 적는다.</li>' +
            '<li>사사 과제가 과다하거나 기여도가 낮은 성과는 연차평가에서 불리할 수 있으므로, 논문마다 기여도를 점검한다.</li>' +
            '<li>전문기관이 다르면 NRF와 IITP를 함께 적는다 (이기종 인터페이스(K-클라우드) 과제는 IITP).</li>' +
            '<li>연도는 논문 <b>게재연도</b> 기준으로 적는다.</li>' +
            '<li>복수과제 정식 서식에는 기여율을 적으며, 합은 100%가 되어야 한다.</li>' +
            '<li>IDEC의 칩 제작·EDA 지원은 과제와 분리해 별도 문장으로 적는다 (실적 집계 대상 아님).</li>' +
            '<li>Non-Government 과제(삼성·ETRI·KETI)는 사사 표기 전 교수님께 확인한다.</li>' +
          '</ul>' +
          '<div class="ack-builder">' +
            '<div class="ack-step">1. 논문에 기여한 과제 선택</div>' + chk +
            '<div class="ack-row"><label>게재연도<input type="number" class="ack-year" value="' + new Date().getFullYear() + '"></label>' +
            '<label>IDEC<select class="ack-idec"><option value="">없음</option><option value="eda">EDA 툴</option><option value="chip">칩 제작 + EDA 툴</option></select></label></div>' +
            '<div class="ack-step">2. 생성된 사사문구</div>' +
            '<div class="ack-warn"></div>' +
            '<div class="ack-out" data-k="ko"><div class="ack-out-h">국문 (정식 서식)<button type="button" class="rp-copy">Copy</button></div><p></p></div>' +
            '<div class="ack-out" data-k="en"><div class="ack-out-h">English (formal)<button type="button" class="rp-copy">Copy</button></div><p></p></div>' +
            '<div class="ack-out" data-k="short"><div class="ack-out-h">English (short — 지면 제한 시)<button type="button" class="rp-copy">Copy</button></div><p></p></div>' +
          '</div>' +
        '</div>'
      );

      var AG = {
        NRF: { ko: "한국연구재단", en: "the National Research Foundation of Korea (NRF)" },
        IITP: { ko: "정보통신기획평가원", en: "the Institute of Information & Communications Technology Planning & Evaluation (IITP)" }
      };
      var IDEC = {
        eda: { ko: " 본 연구의 EDA 툴은 반도체설계교육센터(IDEC)의 지원을 받았음.", en: " The EDA tool was supported by the IC Design Education Center (IDEC), Korea." },
        chip: { ko: " 본 연구의 칩 제작 및 EDA 툴은 반도체설계교육센터(IDEC)의 지원을 받았음.", en: " The chip fabrication and EDA tool were supported by the IC Design Education Center (IDEC), Korea." }
      };
      var buildAck = function () {
        var g = container.find(".ack-guide");
        var sel = [];
        g.find(".ack-chk input[type=checkbox]").each(function () { if (this.checked) sel.push(+$(this).data("i")); });
        var year = g.find(".ack-year").val() || new Date().getFullYear();
        var idec = IDEC[g.find(".ack-idec").val()] || { ko: "", en: "" };
        var out = { ko: "", en: "", short: "" };
        var warn = [];
        if (!sel.length) {
          out.ko = out.en = out.short = "위에서 과제를 선택하세요.";
        } else {
          var multi = sel.length > 1;
          var sum = 0;
          var ps = sel.map(function (i) {
            var v = g.find('.ack-pct[data-i="' + i + '"]').val();
            sum += +v || 0;
            return { p: grantProjects[i], pct: v === "" ? "00" : v };
          });
          var ags = [];
          ps.forEach(function (x) {
            if (ags.indexOf(x.p.agency) < 0) ags.push(x.p.agency);
            if (x.p.agency_note) warn.push(x.p.short + ": " + x.p.agency_note);
          });
          if (multi && sum !== 100) warn.push("기여율 합계가 100%가 아닙니다 (현재 " + sum + "%).");
          out.ko = "이 논문은 " + year + "년도 정부(과학기술정보통신부)의 재원으로 " +
            ags.map(function (a) { return AG[a].ko; }).join(" 및 ") + "의 지원을 받아 수행된 연구임(" +
            ps.map(function (x) { return x.p.grant_no + ", " + x.p.title + (multi ? ", 기여율 " + x.pct + "%" : ""); }).join("; ") + ")." + idec.ko;
          out.en = "This work was supported by " + ags.map(function (a) { return AG[a].en; }).join(" and ") +
            (ags.length > 1 || multi ? " grants" : " grant") + " funded by the Korean government (MSIT) in " + year + " (" +
            ps.map(function (x) { return "Grant No. " + x.p.grant_no + ", Project Title: " + x.p.en_title + (multi ? ", Contribution: " + x.pct + "%" : ""); }).join("; ") + ")." + idec.en;
          out.short = "This work was supported by " + ags.map(function (a) { return AG[a].en; }).join(" and ") +
            " funded by the Korean Government Ministry of Science and ICT (MSIT) under Grant " +
            ps.map(function (x) { return x.p.grant_no + " (" + x.p.agency + ")"; }).join(", ").replace(/, ([^,]*)$/, " and $1") + "." + idec.en;
        }
        g.find(".ack-out").each(function () { $(this).find("p").text(out[$(this).data("k")]); });
        g.find(".ack-warn").html(warn.map(function (w) { return "※ " + w; }).join("<br>"));
      };
      container.on("click", ".ack-toggle", function () {
        $(this).toggleClass("collapsed");
        container.find(".ack-guide").stop(true, false).slideToggle(250);
      });
      container.on("change input", ".ack-guide input, .ack-guide select", buildAck);
      buildAck();
    }

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
  
