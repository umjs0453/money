

// pieChart
const pieLabels = [];
const pieDataValues = [];

let assetPieChart = null; 
const chartColors = ['#3498db', '#e4485d', '#2ecc71', 
                        '#f1c40f', '#9b59b6', '#e67e22', 
                        '#1abc9c','#cf51b4', '#b3d17a',];

//원형 차트 업데이트
function updatePieChart() {
    const tableRows = document.querySelectorAll('.asset-table tbody tr');
    const pieLabels = [];
    const pieDataValues = [];
    const activeColors = []; 
    let totalAsset = 0;

    tableRows.forEach((row, index) => {
        const typeCell = row.cells[0]; 
        
        const typeName = typeCell.innerText.replace('■', '').trim(); 
        const rawAmount = row.cells[1].innerText.replace(/,/g, '').replace('원', '');
        const amount = parseInt(rawAmount, 10) || 0;
        totalAsset += amount;
        
        const color = chartColors[index % chartColors.length];
        
        typeCell.style.backgroundColor = '';
        typeCell.style.color = ''; 
        typeCell.style.fontWeight = '';
        
        typeCell.innerHTML = `<span style="color: ${color};">■ </span>${typeName}`;
        
        pieLabels.push(typeName);
        pieDataValues.push(amount);
        activeColors.push(color); 
    });

    const totalAmountDisplay = document.querySelector('.daily-summary h2');
    if (totalAmountDisplay) {
        totalAmountDisplay.innerText = totalAsset.toLocaleString() + '원';
    }

    if (assetPieChart !== null) {
        assetPieChart.data.labels = pieLabels;
        assetPieChart.data.datasets[0].data = pieDataValues;
        assetPieChart.data.datasets[0].backgroundColor = activeColors; 
        assetPieChart.update();
    } 
    else {
        const pieCtx = document.getElementById('assetPieChart').getContext('2d');
        assetPieChart = new Chart(pieCtx, {
            type: 'doughnut',
            data: {
                labels: pieLabels,
                datasets: [{
                    data: pieDataValues,
                    backgroundColor: activeColors,
                    borderWidth: 2,
                    borderColor: '#ffffff',
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                }
            }
        });
    }
}
// alert("asdf");
loadAssetData();

