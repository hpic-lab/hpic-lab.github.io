document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('alumni-list-container');

    // JSON 파일 가져오기
    fetch('json//people/05_alumni.json') // 파일 경로를 본인 환경에 맞게 수정하세요
        .then(response => response.json())
        .then(data => {
            let htmlContent = '';

            data.forEach(person => {
                const thesisHtml = person.thesis_link 
                    ? `<a href="${person.thesis_link}" target="_blank" style="color: #007bff; text-decoration: none;">[Link]</a>` 
                    : '-';
                htmlContent += `
                    <tr>
                        <td><strong>${person.name}</strong></td>
                        <td>${person.affiliation || 'N/A'}</td>
                        <td>${person.program || '-'}</td>
                        <td>${person.current || person.details || ''}</td>
                        <td>${thesisHtml}</td> </tr>                        
                    </tr>
                `;
            });

            container.innerHTML = htmlContent;
        })
        .catch(error => console.error('Error loading alumni data:', error));
});