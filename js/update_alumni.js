document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('alumni-list-container');

    // JSON 파일 가져오기
    fetch('json//people/05_alumni.json') // 파일 경로를 본인 환경에 맞게 수정하세요
        .then(response => response.json())
        .then(data => {
            let htmlContent = '';

            data.forEach(person => {
                htmlContent += `
                    <tr>
                        <td><strong>${person.name}</strong></td>
                        <td>${person.affiliation || 'N/A'}</td>
                        <td>${person.program || '-'}</td>
                        <td>${person.current || person.details || ''}</td>
                    </tr>
                `;
            });

            container.innerHTML = htmlContent;
        })
        .catch(error => console.error('Error loading alumni data:', error));
});