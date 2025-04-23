$(document).ready(function () {
    const researchProjects = [
      {
        date: "Apr. 2024 - Mar. 2027",
        title:
          "Development of High-Speed, Low-Power, and Low-Noise Clocking Network Systems for Optical Communication Chiplets",
        sponsor: "National Research Foundation (NRF) of Korea; 우수신진연구",
      },
      {
        date: "Apr. 2022 - Dec. 2024",
        title:
          "Development of low-power/high-performance 2T DRAM PIM cell, integrated circuits, and architecture",
        sponsor: "National Research Foundation (NRF) of Korea",
        status: "completed",
      },
      {
        date: "Sep. 2022 - Sep. 2023",
        title:
          "Design Methodology of High-Performance Integrated Circuits based on Reinforcement Learning",
        sponsor: "Quallitas Semiconductor",
        status: "completed",
      },
      {
        date: "Sep. 2022 - Sep. 2023",
        title:
          "Development of High PSRR Low Phase Noise Voltage-Controlled Oscillator (VCO)",
        sponsor: "ACONIC Inc.",
        status: "completed",        
      },
      {
        date: "Jul. 2022 - Feb. 2025",
        title: "반도체전공트랙사업",
        sponsor: "KIAT, completed",
      },
      {
        date: "Mar. 2022 - Aug. 2027",
        title: "BK21 (고신뢰성 에너지용 지능형 시스템반도체 교육연구단)",
        sponsor: "Ministry of Education",
      },
      {
        date: "Mar. 2022 - Dec. 2025",
        title: "AI Hardware Center (인공지능 반도체 융합연구센터)",
        sponsor: "National Research Foundation (NRF) of Korea",
      },
      {
        date: "Sep. 2022 - Feb. 2024",
        title:
          "강화학습 기반 고성능 아날로그 집적회로 설계 및 측정 플랫폼 개발",
        sponsor: "National Research Foundation (NRF) of Korea",
        status: "completed",
      },
      {
        date: "Mar. 2022 - Feb. 2023",
        title: "신임교원 정착연구지원사업",
        sponsor: "HYU",
        status: "completed",
      },
      {
        date: "-",
        title: "전력반도체 인력 양성센터",
        sponsor: "HYU",
        status: "completed",
      },
    ];
  
    const container = $(".research-projects-container");
    researchProjects.forEach((item) => {

        const status = item.status 
        ? `<span class="badge bg-primary">${item.status }</span>` 
        : "";

      const card = `
        <div class="pub-wrapper">
          <span class="pub-icon-box"><img src="img/pub-svg.svg"></span>
          <span class="badge bg-success">${item.date}</span> |
            ${status}
          <br>
          <span class="pub-author">${item.title}</span>
          <p>${item.sponsor}</p>
        </div>
      `;
      container.append(card);
    });
  });
  