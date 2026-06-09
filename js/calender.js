//calender
const monthYearDisplay = document.getElementById("monthYear");
const calendarGrid = document.getElementById("calendarGrid");
const prevBtn = document.getElementById("prevMonth");
const nextBtn = document.getElementById("nextMonth");

// 1. 기준이 되는 날짜 객체 (달력 이동용)
let date = new Date();
let currYear = date.getFullYear();
let currMonth = date.getMonth();

// ★ 추가: 실제 선택된 날짜를 기억할 변수 (처음에는 '오늘'로 초기화)
let selectedYear = currYear;
let selectedMonth = currMonth;
let selectedDay = date.getDate();

const renderCalendar = () => {
    let firstDayOfMonth = new Date(currYear, currMonth, 1).getDay();
    let lastDateOfMonth = new Date(currYear, currMonth + 1, 0).getDate();
    let lastDayOfLastMonth = new Date(currYear, currMonth, 0).getDate();

    let divTag = "";

    // 이전 달의 날짜 채우기
    for (let i = firstDayOfMonth; i > 0; i--) {
        divTag += `<div class="calendar-cell inactive"><span>${lastDayOfLastMonth - i + 1}</span></div>`;
    }

    // 현재 월의 날짜 채우기
    for (let i = 1; i <= lastDateOfMonth; i++) {
        // [오늘 날짜 확인] 칸 전체를 연노랑으로 채우기 위함
        let isToday = i === new Date().getDate() && currMonth === new Date().getMonth() && currYear === new Date().getFullYear() ? " active" : "";
        
        // ★ [선택된 날짜 확인] 선택된 날짜에 검은 동그라미를 그리기 위함
        let isSelected = i === selectedDay && currMonth === selectedMonth && currYear === selectedYear ? " selected" : "";
        
        divTag += `<div class="calendar-cell${isToday}${isSelected}"><span>${i}</span></div>`;
    }

    monthYearDisplay.innerText = `${currYear}년 ${currMonth + 1}월`;
    calendarGrid.innerHTML = divTag;
}

// 초기 달력 렌더링 (이제 처음 켜지자마자 오늘 날짜에 노란 배경 + 검은 동그라미가 쳐집니다)
renderCalendar();

// 달력 날짜 클릭 이벤트
calendarGrid.addEventListener("click", (e) => {
    const clickedCell = e.target.closest(".calendar-cell");
    
    if (!clickedCell || clickedCell.classList.contains("inactive")) return;

    // 1. 기존에 선택되어 있던 셀에서 'selected' 클래스 제거
    const prevSelected = calendarGrid.querySelector(".calendar-cell.selected");
    if (prevSelected) {
        prevSelected.classList.remove("selected");
    }

    // 2. 현재 클릭한 셀에 'selected' 클래스 추가
    clickedCell.classList.add("selected");

    // ★ 3. 선택된 날짜 변수 업데이트 (다른 달로 이동했다가 돌아와도 선택이 유지되도록)
    selectedDay = parseInt(clickedCell.querySelector("span").innerText, 10);
    selectedMonth = currMonth;
    selectedYear = currYear;
    loadAssetData();
});

// 이전 달 버튼 클릭
prevBtn.addEventListener("click", () => {
    currMonth--;
    if (currMonth < 0) {
        currMonth = 11;
        currYear--;
    }
    renderCalendar();
});

// 다음 달 버튼 클릭
nextBtn.addEventListener("click", () => {
    currMonth++;
    if (currMonth > 11) {
        currMonth = 0;
        currYear++;
    }
    renderCalendar();
});
