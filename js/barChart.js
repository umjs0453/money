// --- 월간 자산 총액 꺾은선 차트 ---

let monthlyLineChart = null; // 차트 객체 전역 변수

function updateMonthlyChart() {
    const canvas = document.getElementById('monthlyLineChart');
    if (!canvas) return; // 캔버스 없으면 패스

    // 1. 이번 달이 며칠까지 있는지 확인 (예: 28일, 30일, 31일)
    let lastDateOfMonth = new Date(currYear, currMonth + 1, 0).getDate();
    
    const chartLabels = []; // x축: 1일, 2일...
    const chartDataValues = []; // y축: 총액

    // 2. 1일부터 말일까지 돌면서 localStorage 탐색
    for (let i = 1; i <= lastDateOfMonth; i++) {
        chartLabels.push(`${i}일`);

        const m = String(currMonth + 1).padStart(2, '0');
        const d = String(i).padStart(2, '0');
        const dateKey = `${currYear}-${m}-${d}`;

        const savedData = localStorage.getItem(dateKey);
        
        if (savedData) {
            const parsedData = JSON.parse(savedData);
            chartDataValues.push(parsedData.total || 0); // 저장된 총액 밀어넣기
        } else {
            // 데이터가 없는 날은 null 처리 (그래야 차트 선이 바닥으로 안 떨어짐)
            chartDataValues.push(null); 
        }
    }

    // 3. 차트 그리기 또는 업데이트
    if (monthlyLineChart !== null) {
        monthlyLineChart.data.labels = chartLabels;
        monthlyLineChart.data.datasets[0].data = chartDataValues;
        monthlyLineChart.update();
    } else {
        const ctx = canvas.getContext('2d');
        monthlyLineChart = new Chart(ctx, {
            type: 'bar', // 꺾은선 그래프
            data: {
                labels: chartLabels,
                datasets: [{
                    label: '자산 총액',
                    data: chartDataValues,
                    borderColor: '#3498db',         // 선 색상 (파란색)
                    backgroundColor: 'rgba(52, 152, 219, 0.2)', // 선 아래 배경색
                    borderWidth: 2,
                    pointBackgroundColor: '#fff',   // 점 배경색
                    pointBorderColor: '#3498db',    // 점 테두리
                    pointRadius: 4,
                    fill: true,                     // 선 아래 색칠하기
                    spanGaps: true                  // ★ 데이터(null)가 비어있어도 끊기지 않고 선 이어주기
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false } // 상단 범례 숨기기
                },
                scales: {
                    y: {
                        beginAtZero: false // 자산은 보통 단위가 커서 0부터 시작 안 하는 게 예쁨
                    }
                }
            }
        });
    }
}