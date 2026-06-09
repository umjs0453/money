

// pieChart
// const tableRows = document.querySelectorAll('.asset-table tbody tr');
const pieLabels = [];
const pieDataValues = [];

// tableRows.forEach(row => {
//     // 첫 번째 칸(유형) 텍스트 가져오기
//     const typeName = row.cells[0].innerText; 
    
//     // 두 번째 칸(금액) 텍스트 가져오기 ('원' 및 쉼표 제거 후 숫자로 변환)
//     const rawAmount = row.cells[1].innerText.replace(/,/g, '').replace('원', '');
//     const amount = parseInt(rawAmount, 10) || 0; // 변환 실패 시 0 처리
    
//     pieLabels.push(typeName);
//     pieDataValues.push(amount);
// });

// --- 자산 테이블 관리 및 원형 차트 연동 ---

let assetPieChart = null; // 차트 객체를 담을 전역 변수
// 테이블과 차트가 공유할 기준 색상 배열
const chartColors = ['#3498db', '#e4485d', '#2ecc71', 
                        '#f1c40f', '#9b59b6', '#e67e22', 
                        '#1abc9c','#cf51b4', '#b3d17a',];

// 1. 테이블 데이터를 읽어와서 원형 차트를 그리는(또는 업데이트하는) 함수
// 1. 테이블 데이터를 읽어와서 원형 차트를 그리는 함수
function updatePieChart() {
    const tableRows = document.querySelectorAll('.asset-table tbody tr');
    const pieLabels = [];
    const pieDataValues = [];
    const activeColors = []; 
    let totalAsset = 0;

    tableRows.forEach((row, index) => {
        const typeCell = row.cells[0]; 
        // 텍스트에서 '■ ' 기호가 이미 있다면 지우고 순수한 이름만 추출
        const typeName = typeCell.innerText.replace('■', '').trim(); 
        const rawAmount = row.cells[1].innerText.replace(/,/g, '').replace('원', '');
        const amount = parseInt(rawAmount, 10) || 0;
        totalAsset += amount;
        
        const color = chartColors[index % chartColors.length];
        
        // 이전에 적용했던 셀 배경색 스타일은 지워서 초기화
        typeCell.style.backgroundColor = '';
        typeCell.style.color = ''; 
        typeCell.style.fontWeight = '';
        
        // ★ 핵심: 텍스트 앞에 해당 차트 색상과 똑같은 색의 '■ ' 기호 추가
        typeCell.innerHTML = `<span style="color: ${color};">■ </span>${typeName}`;
        
        pieLabels.push(typeName);
        pieDataValues.push(amount);
        activeColors.push(color); 
    });

    const totalAmountDisplay = document.querySelector('.total-amount h2');
    if (totalAmountDisplay) {
        totalAmountDisplay.innerText = totalAsset.toLocaleString() + '원';
    }

    // 이미 차트가 존재하면 데이터 업데이트
    if (assetPieChart !== null) {
        assetPieChart.data.labels = pieLabels;
        assetPieChart.data.datasets[0].data = pieDataValues;
        assetPieChart.data.datasets[0].backgroundColor = activeColors; 
        assetPieChart.update();
    } 
    // 차트 최초 생성
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
        saveAssetData();
    }
}
// alert("asdf");
// 최초 화면 로드 시 차트 1회 그리기
updatePieChart();

