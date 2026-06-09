//asset
let assetTableLength = 1;

// 2. 자산 추가 기능
document.querySelector('.add-btn').addEventListener('click', () => {
    const assetName = assetTableLength++;
    const tbody = document.querySelector('.asset-table tbody');
    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td>${assetName}</td>
        <td>${0+"원"}</td>
        <td><button class="delete-btn">X</button></td>
    `;
    tbody.appendChild(tr);

    // 테이블이 변경되었으므로 차트 갱신
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
        saveAssetData()
    };

    input.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') input.blur(); 
    });

    input.addEventListener('blur', saveEdit);
});

// 3. 자산 삭제 기능 (이벤트 위임 방식 사용)
document.querySelector('.asset-table tbody').addEventListener('click', (e) => {
    // 클릭한 요소가 delete-btn 클래스를 가지고 있는지 확인
    if (e.target.classList.contains('delete-btn')) {
        // if(confirm("정말 이 자산을 삭제하시겠습니까?")) {
            // 클릭된 버튼의 부모(td)의 부모(tr)를 찾아 삭제
            e.target.closest('tr').remove();
            
            // 테이블이 변경되었으므로 차트 갱신

            updatePieChart();
        // }
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

// 2. 현재 테이블의 데이터를 통째로 저장하는 함수
function saveAssetData() {
    const tableRows = document.querySelectorAll('.asset-table tbody tr');
    const dayData = [];

    tableRows.forEach(row => {
        const typeCell = row.cells[0];
        // '■ ' 기호 떼고 순수 이름만 추출
        const typeName = typeCell.innerText.replace('■', '').trim();
        const rawAmount = row.cells[1].innerText.replace(/,/g, '').replace('원', '');
        const amount = parseInt(rawAmount, 10) || 0;

        dayData.push({ type: typeName, amount: amount });
    });

    const dateKey = getSelectedDateKey();
    // JSON 형태로 변환해서 브라우저에 찰칵 저장!
    localStorage.setItem(dateKey, JSON.stringify(dayData));
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
        parsedData.forEach(item => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${item.type}</td>
                <td>${item.amount.toLocaleString()}원</td>
                <td><button class="delete-btn">X</button></td>
            `;
            tbody.appendChild(tr);
        });
        // 다음 추가될 자산 번호 업데이트 (겹치지 않게 기존 개수 + 1)
        assetTableLength = parsedData.length + 1; 
    } else {
        // 저장된 데이터가 없으면 초기화
        assetTableLength = 1;
    }

    // 테이블 갱신됐으니 파이 차트도 새롭게 그려줌
    updatePieChart();
}