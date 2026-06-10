//asset
let cnt = 1;
const summaryTime = document.querySelector('.daily-summary span');
const loadPrevBtn = document.querySelector('.load-prev-btn');

document.querySelector('.add-btn').addEventListener('click', () => {
    const assetName = cnt;
    const tbody = document.querySelector('.asset-table tbody');
    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td>${assetName}</td>
        <td>${0+"원"}</td>
        <td><button class="delete-btn">X</button></td>
    `;
    tbody.appendChild(tr);
    loadPrevBtn.hidden = true;
    cnt++;
    updatePieChart();
});

// 자산 유형/금액 더블클릭 수정 기능
const assetTbody = document.querySelector('.asset-table tbody');

assetTbody.addEventListener('dblclick', (e) => {
    const targetCell = e.target.closest('td');
    
    if (!targetCell || targetCell.querySelector('input') || targetCell.cellIndex === 2) {
        return;
    }

    const isAmountColumn = targetCell.cellIndex === 1; 
    
    // ★ 추가: 원본 텍스트에서 '■' 기호를 빼고 순수한 텍스트만 가져오기
    let originalText = targetCell.innerText.replace('■', '').trim();
    let inputValue = originalText;

    if (isAmountColumn) {
        inputValue = originalText.replace(/,/g, '').replace('원', '');
    }

    const input = document.createElement('input');
    input.type = isAmountColumn ? 'number' : 'text'; 
    input.value = inputValue;
    input.style.width = '100%';
    input.style.padding = '4px';
    input.style.boxSizing = 'border-box';
    
    targetCell.innerText = '';
    targetCell.appendChild(input);
    input.focus();

    const saveEdit = () => {
        let newValue = input.value.trim();

        if (isAmountColumn) {
            if (!newValue || isNaN(newValue)) {
                targetCell.innerText = originalText;
            } else {
                const amount = parseInt(newValue, 10);
                targetCell.innerText = amount.toLocaleString() + '원';
            }
        } else {
            targetCell.innerText = newValue === '' ? originalText : newValue;
        }

        // 업데이트 시 다시 '■' 기호가 예쁘게 붙습니다!
        saveAssetData();
    };

    input.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') input.blur(); 
    });

    input.addEventListener('blur', saveEdit);
});

//자산 삭제 기능 (이벤트 위임 방식 사용)
document.querySelector('.asset-table tbody').addEventListener('click', (e) => {
    // 클릭한 요소가 delete-btn 클래스를 가지고 있는지 확인
    if (e.target.classList.contains('delete-btn')) {
        e.target.closest('tr').remove();
        cnt--;
        saveAssetData()
    }
});

// --- 날짜별 데이터 저장소 (localStorage) 로직 ---

    

// 1. 현재 선택된 날짜를 'YYYY-MM-DD' 형태의 텍스트 키로 만드는 함수
function getSelectedDateKey() {
    // month는 0부터 시작하므로 +1. padStart로 한 자리 숫자를 '09'처럼 두 자리로 맞춤
    const m = String(selectedMonth + 1).padStart(2, '0');
    const d = String(selectedDay).padStart(2, '0');
    return `${selectedYear}-${m}-${d}`;
}
//갱신 시간 출력
function getUpdatedDate()
{
    const now = new Date();//저장 시간
    const y = String(now.getFullYear());
    const m = String(now.getMonth()).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    const hour = String(now.getHours()).padStart(2, '0');
    const min = String(now.getMinutes()).padStart(2, '0');
    return `${y}. ${m}. ${d}. ${hour}:${min}`;

}
//현재 테이블의 데이터를 통째로 저장
function saveAssetData() {
    const tableRows = document.querySelectorAll('.asset-table tbody tr');
    const dayData = [];
    let dailyTotal = 0; // ★ 총액 계산용 변수 추가
    
    
    summaryTime.innerText = `${getUpdatedDate()} 갱신`;

    tableRows.forEach(row => {
        const typeCell = row.cells[0];
        const typeName = typeCell.innerText.replace('■', '').trim();
        const rawAmount = row.cells[1].innerText.replace(/,/g, '').replace('원', '');
        const amount = parseInt(rawAmount, 10) || 0;

        dailyTotal += amount; // ★ 아이템 더하면서 총액도 같이 누적
        dayData.push({ type: typeName, amount: amount });
    });

    const dateKey = getSelectedDateKey();
    
    // ★ 핵심: 배열만 덜렁 저장하지 않고, total과 items를 묶은 '객체' 형태로 저장!
    const dataToSave = {
        total: dailyTotal,
        assetTableLength: cnt-1,
        items: dayData,
        updatedDate: getUpdatedDate()
    };
    
    localStorage.setItem(dateKey, JSON.stringify(dataToSave));
    updateMonthlyChart();
    updatePieChart();
}

// 3. 선택된 날짜의 데이터를 불러와서 테이블에 뿌려주는 함수
function loadAssetData() {
    //alert("ㅁㄴㅇㄹ");
    const dateKey = getSelectedDateKey();
    const savedData = localStorage.getItem(dateKey);
    const tbody = document.querySelector('.asset-table tbody');
    
    

    // 일단 테이블 싹 비우기 (안 비우면 이전 날짜 데이터랑 겹침)
    tbody.innerHTML = '';   
    
    if (savedData) {
        const parsedData = JSON.parse(savedData);
        // 저장된 데이터가 있으면 테이블에 행 쫙 추가
        const savedItems = parsedData.items || [];
        savedItems.forEach(item => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${item.type}</td>
                <td>${item.amount.toLocaleString()}원</td>
                <td><button class="delete-btn">X</button></td>
            `;
            tbody.appendChild(tr);
        });
        
        summaryTime.innerText = `${parsedData.updatedDate} 갱신`;
        cnt = parsedData.assetTableLength + 1; 
        if(cnt > 1)
            loadPrevBtn.hidden = true;
        else 
            loadPrevBtn.hidden = false;
    
    } else {
        // 저장된 데이터가 없으면 초기화
        summaryTime.innerText = `기록되지 않음`;
        cnt = 1;
    }

    // 테이블 갱신됐으니 파이 차트도 새롭게 그려줌
    updatePieChart();
}

function loadPrev(){
    const dateKey = getSelectedDateKey();
    const savedData = localStorage.getItem(dateKey);
}