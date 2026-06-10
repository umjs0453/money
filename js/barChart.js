//barChart
let monthlyLineChart = null; 

//막대그래프 업데이트
function updateMonthlyChart() {
    const canvas = document.getElementById('monthlyLineChart');
    if (!canvas) return; 

    let lastDateOfMonth = new Date(currYear, currMonth + 1, 0).getDate();
    
    const chartLabels = []; // x축: 날짜
    const chartDataValues = []; // y축: 총액

    for (let i = 1; i <= lastDateOfMonth; i++) {
        chartLabels.push(`${i}일`);

        const m = String(currMonth + 1).padStart(2, '0');
        const d = String(i).padStart(2, '0');
        const dateKey = `${currYear}-${m}-${d}`;

        const savedData = localStorage.getItem(dateKey);
        
        if (savedData) {
            const parsedData = JSON.parse(savedData);
            chartDataValues.push(parsedData.total || 0); 
        } else {
            chartDataValues.push(null); 
        }
    }

    if (monthlyLineChart !== null) {
        monthlyLineChart.data.labels = chartLabels;
        monthlyLineChart.data.datasets[0].data = chartDataValues;
        monthlyLineChart.update();
    } else {
        const ctx = canvas.getContext('2d');
        monthlyLineChart = new Chart(ctx, {
            type: 'bar',
                data: {
                labels: chartLabels,
                datasets: [{
                    label: '자산 총액',
                    data: chartDataValues,
                    borderColor: '#3498db', 
                    backgroundColor: 'rgba(52, 152, 219, 0.2)',
                    borderWidth: 2,
                    pointBackgroundColor: '#fff',
                    pointBorderColor: '#3498db',
                    pointRadius: 4,
                    fill: true,
                    spanGaps: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false } 
                },
                scales: {
                    y: {
                        beginAtZero: false
                    }
                }
            }
        });
    }
}