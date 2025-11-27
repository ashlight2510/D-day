// 페이지 로드 시 현재 날짜를 기본값으로 설정
document.addEventListener('DOMContentLoaded', function() {
    const today = new Date();
    const todayString = formatDateForInput(today);
    
    // 목표 날짜 입력란에 오늘 날짜 설정
    const targetDateInput = document.getElementById('targetDate');
    if (targetDateInput) {
        targetDateInput.value = todayString;
    }
    
    // 시작 날짜 입력란에 오늘 날짜 설정
    const startDateInput = document.getElementById('startDate');
    if (startDateInput) {
        startDateInput.value = todayString;
    }
    
    // 위젯 날짜도 오늘로 설정
    const widgetDateInput = document.getElementById('widgetDate');
    if (widgetDateInput) {
        widgetDateInput.value = todayString;
    }
    
    // 오늘의 기념일 추천 표시
    showDailyQuote();
    
    // 테마 초기화
    initTheme();
    
    // 알림 권한 요청
    requestNotificationPermission();
    
    // 저장된 메모 불러오기
    loadMemos();
});

// 날짜를 input[type="date"] 형식으로 변환 (YYYY-MM-DD)
function formatDateForInput(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// 날짜를 한국어 형식으로 포맷팅
function formatDateKorean(date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
    const weekday = weekdays[date.getDay()];
    return `${year}년 ${month}월 ${day}일 (${weekday})`;
}

// 상세 시간 계산 (일, 시간, 분, 초)
function calculateDetailedTime(targetDate) {
    const now = new Date();
    const diff = targetDate - now;
    
    if (diff <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    return { days, hours, minutes, seconds, total: diff };
}

// D-day 계산 함수 (애니메이션 포함)
function calculateDday() {
    const targetDateInput = document.getElementById('targetDate');
    const resultBox = document.getElementById('ddayResult');
    
    if (!targetDateInput.value) {
        alert('목표 날짜를 선택해주세요.');
        targetDateInput.focus();
        return;
    }
    
    const targetDate = new Date(targetDateInput.value + 'T00:00:00');
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const diffTime = targetDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const detailedTime = calculateDetailedTime(targetDate);
    
    let resultHTML = '';
    
    if (diffDays === 0) {
        resultHTML = `
            <h3>🎉 오늘이 바로 목표일입니다!</h3>
            <div class="dday-number animate-count" style="color: var(--secondary-color);">D-day</div>
            <p class="dday-text">축하합니다! 오늘이 바로 그 날입니다! 🎊</p>
        `;
    } else if (diffDays > 0) {
        resultHTML = `
            <h3>📅 목표일</h3>
            <div class="dday-number animate-count">D-<span id="countNumber" class="number-animate">${diffDays}</span></div>
            <p class="dday-text">${formatDateKorean(targetDate)}까지 남았습니다.</p>
            <div class="detailed-time">
                <div class="time-item">
                    <span class="time-value number-animate" id="daysValue">${detailedTime.days}</span>
                    <span class="time-label">일</span>
                </div>
                <div class="time-item">
                    <span class="time-value number-animate" id="hoursValue">${detailedTime.hours}</span>
                    <span class="time-label">시간</span>
                </div>
                <div class="time-item">
                    <span class="time-value number-animate" id="minutesValue">${detailedTime.minutes}</span>
                    <span class="time-label">분</span>
                </div>
                <div class="time-item">
                    <span class="time-value number-animate" id="secondsValue">${detailedTime.seconds}</span>
                    <span class="time-label">초</span>
                </div>
            </div>
        `;
    } else {
        const pastDays = Math.abs(diffDays);
        resultHTML = `
            <h3>📅 목표일</h3>
            <div class="dday-number animate-count" style="color: var(--danger-color);">D+${pastDays}</div>
            <p class="dday-text">${formatDateKorean(targetDate)}로부터 <strong>${pastDays}일</strong> 지났습니다.</p>
        `;
    }
    
    // 공유 버튼 추가
    resultHTML += `
        <div class="share-buttons">
            <button class="btn btn-secondary share-btn" onclick="shareToKakao('${targetDateInput.value}', ${diffDays})">
                💬 카카오톡 공유
            </button>
            <button class="btn btn-secondary share-btn" onclick="shareToInstagram('${targetDateInput.value}', ${diffDays})">
                📷 인스타그램 공유
            </button>
            <button class="btn btn-secondary share-btn" onclick="copyShareImage('${targetDateInput.value}', ${diffDays})">
                📋 이미지 복사
            </button>
        </div>
    `;
    
    resultBox.innerHTML = resultHTML;
    resultBox.classList.add('show');
    
    // 카운트 애니메이션
    if (diffDays > 0) {
        animateCount('countNumber', 0, diffDays);
        animateCount('daysValue', 0, detailedTime.days);
        animateCount('hoursValue', 0, detailedTime.hours);
        animateCount('minutesValue', 0, detailedTime.minutes);
        animateCount('secondsValue', 0, detailedTime.seconds);
        
        // 실시간 카운트다운 시작
        startCountdown(targetDate, resultBox);
    }
    
    // 알림 설정
    if (diffDays > 0) {
        scheduleNotifications(targetDate, diffDays);
    }
}

// 실시간 카운트다운
let countdownInterval = null;

function startCountdown(targetDate, resultBox) {
    // 기존 인터벌 정리
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }
    
    countdownInterval = setInterval(() => {
        const detailedTime = calculateDetailedTime(targetDate);
        
        if (detailedTime.total <= 0) {
            clearInterval(countdownInterval);
            resultBox.innerHTML = `
                <h3>🎉 목표일이 도착했습니다!</h3>
                <div class="dday-number" style="color: var(--secondary-color);">D-day</div>
                <p class="dday-text">축하합니다! 목표일이 되었습니다! 🎊</p>
            `;
            return;
        }
        
        // 숫자 업데이트 (애니메이션과 함께)
        updateAnimatedNumber('daysValue', detailedTime.days);
        updateAnimatedNumber('hoursValue', detailedTime.hours);
        updateAnimatedNumber('minutesValue', detailedTime.minutes);
        updateAnimatedNumber('secondsValue', detailedTime.seconds);
        
        // D-day 숫자도 업데이트
        const diffDays = Math.ceil(detailedTime.total / (1000 * 60 * 60 * 24));
        const countElement = document.getElementById('countNumber');
        if (countElement) {
            const currentValue = parseInt(countElement.textContent) || 0;
            if (currentValue !== diffDays) {
                animateCount('countNumber', currentValue, diffDays);
            }
        }
    }, 1000);
}

// 애니메이션과 함께 숫자 업데이트
function updateAnimatedNumber(elementId, newValue) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const currentValue = parseInt(element.textContent) || 0;
    if (currentValue !== newValue) {
        // 작은 변화는 바로 업데이트, 큰 변화는 애니메이션
        if (Math.abs(currentValue - newValue) > 10) {
            animateCount(elementId, currentValue, newValue);
        } else {
            // 작은 변화는 부드럽게
            element.textContent = newValue;
            element.classList.add('number-pulse');
            setTimeout(() => {
                element.classList.remove('number-pulse');
            }, 300);
        }
    }
}

// 카운트 애니메이션 (재밌게!)
function animateCount(elementId, start, end) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    // 이미 애니메이션 중이면 중단
    if (element.dataset.animating === 'true') {
        return;
    }
    
    element.dataset.animating = 'true';
    element.classList.add('number-rolling');
    
    const duration = 800;
    const startTime = performance.now();
    const range = end - start;
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // 이징 함수 (easeOutCubic)
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(start + range * easeProgress);
        
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = end;
            element.dataset.animating = 'false';
            element.classList.remove('number-rolling');
        }
    }
    
    requestAnimationFrame(update);
}

// 역계산 함수 (N일 후는 언제인지)
function calculateFutureDate() {
    const daysInput = document.getElementById('daysInput');
    const startDateInput = document.getElementById('startDate');
    const resultBox = document.getElementById('futureDateResult');
    
    if (!daysInput.value || parseInt(daysInput.value) <= 0) {
        alert('올바른 일 수를 입력해주세요.');
        daysInput.focus();
        return;
    }
    
    const days = parseInt(daysInput.value);
    let startDate;
    
    if (startDateInput.value) {
        startDate = new Date(startDateInput.value + 'T00:00:00');
    } else {
        startDate = new Date();
        startDate.setHours(0, 0, 0, 0);
    }
    
    const futureDate = new Date(startDate);
    futureDate.setDate(futureDate.getDate() + days);
    
    const startDateString = formatDateForInput(startDate);
    const futureDateString = formatDateForInput(futureDate);
    
    resultBox.innerHTML = `
        <h3>📆 ${days}일 후</h3>
        <div class="dday-number animate-count" style="color: var(--secondary-color);">${formatDateKorean(futureDate)}</div>
        <p class="dday-text">${formatDateKorean(startDate)}로부터 <strong>${days}일</strong> 후입니다.</p>
        <div class="share-buttons">
            <button class="btn btn-secondary share-btn" onclick="shareToKakao('${futureDateString}', ${days}, '${startDateString}')">
                💬 카카오톡 공유
            </button>
            <button class="btn btn-secondary share-btn" onclick="shareToInstagram('${futureDateString}', ${days}, '${startDateString}')">
                📷 인스타그램 공유
            </button>
            <button class="btn btn-secondary share-btn" onclick="copyShareImage('${futureDateString}', ${days}, '${startDateString}', '${days}일 후')">
                📋 이미지 복사
            </button>
        </div>
    `;
    resultBox.classList.add('show');
}

// 빠른 계산 함수
function quickCalculate(days) {
    const startDateInput = document.getElementById('startDate');
    const resultBox = document.getElementById('quickResult');
    
    let startDate;
    if (startDateInput.value) {
        startDate = new Date(startDateInput.value + 'T00:00:00');
    } else {
        startDate = new Date();
        startDate.setHours(0, 0, 0, 0);
    }
    
    const futureDate = new Date(startDate);
    futureDate.setDate(futureDate.getDate() + days);
    
    let periodText = '';
    if (days === 50) periodText = '50일 후';
    else if (days === 100) periodText = '100일 후';
    else if (days === 200) periodText = '200일 후';
    else if (days === 300) periodText = '300일 후';
    
    resultBox.innerHTML = `
        <h3>⚡ ${periodText}</h3>
        <div class="dday-number animate-count" style="color: var(--secondary-color);">${formatDateKorean(futureDate)}</div>
        <p class="dday-text">${formatDateKorean(startDate)}로부터 <strong>${days}일</strong> 후입니다.</p>
    `;
    resultBox.classList.add('show');
    
    // 시작 날짜 입력란에 결과 날짜 자동 입력
    document.getElementById('startDate').value = formatDateForInput(futureDate);
}

// 메모 저장
function saveMemo() {
    const memoText = document.getElementById('memoText').value.trim();
    if (!memoText) {
        alert('메모를 입력해주세요.');
        return;
    }
    
    const memos = getMemos();
    const memo = {
        id: Date.now().toString(),
        text: memoText,
        date: new Date().toISOString(),
        dateString: formatDateKorean(new Date())
    };
    
    memos.push(memo);
    localStorage.setItem('ddayMemos', JSON.stringify(memos));
    
    document.getElementById('memoText').value = '';
    loadMemos();
    alert('메모가 저장되었습니다!');
}

// 메모 불러오기
function getMemos() {
    const saved = localStorage.getItem('ddayMemos');
    return saved ? JSON.parse(saved) : [];
}

// 저장된 메모 표시
function loadMemos() {
    const memos = getMemos();
    const listContainer = document.getElementById('memosList');
    
    if (memos.length === 0) {
        listContainer.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">저장된 메모가 없습니다.</p>';
        return;
    }
    
    // 최신순으로 정렬
    memos.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    listContainer.innerHTML = memos.map(memo => `
        <div class="memo-item">
            <div class="memo-date">${memo.dateString}</div>
            <div class="memo-text">${memo.text}</div>
            <div class="memo-actions-inline">
                <button class="btn btn-secondary share-btn" onclick="shareMemoToKakao('${memo.id}')" style="margin-top: 10px; padding: 5px 10px; font-size: 0.9em; flex: 1;">
                    💬 카톡 공유
                </button>
                <button class="btn btn-secondary share-btn" onclick="shareMemoToInstagram('${memo.id}')" style="margin-top: 10px; padding: 5px 10px; font-size: 0.9em; flex: 1;">
                    📷 인스타 공유
                </button>
                <button class="btn btn-secondary share-btn" onclick="copyMemoImage('${memo.id}')" style="margin-top: 10px; padding: 5px 10px; font-size: 0.9em; flex: 1;">
                    📋 이미지 복사
                </button>
                <button class="btn btn-danger" onclick="deleteMemo('${memo.id}')" style="margin-top: 10px; padding: 5px 10px; font-size: 0.9em; flex: 1;">삭제</button>
            </div>
        </div>
    `).join('');
}

// 메모 삭제
function deleteMemo(id) {
    if (!confirm('이 메모를 삭제하시겠습니까?')) return;
    
    const memos = getMemos();
    const filtered = memos.filter(m => m.id !== id);
    localStorage.setItem('ddayMemos', JSON.stringify(filtered));
    loadMemos();
}

// 위젯 코드 생성
function generateWidget() {
    const widgetDate = document.getElementById('widgetDate').value;
    const widgetTitle = document.getElementById('widgetTitle').value || 'D-day';
    
    if (!widgetDate) {
        alert('날짜를 선택해주세요.');
        return;
    }
    
    const targetDate = new Date(widgetDate + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffTime = targetDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    const widgetCode = `
<iframe src="${window.location.origin}/widget.html?date=${widgetDate}&title=${encodeURIComponent(widgetTitle)}" 
        width="300" 
        height="150" 
        frameborder="0" 
        scrolling="no">
</iframe>
    `.trim();
    
    const resultBox = document.getElementById('widgetResult');
    resultBox.innerHTML = `
        <div class="widget-preview">
            <h4>위젯 미리보기</h4>
            <div style="border: 2px solid #ddd; padding: 15px; margin: 10px 0; border-radius: 8px; background: #f9f9f9;">
                <strong>${widgetTitle}</strong><br>
                ${formatDateKorean(targetDate)}까지<br>
                <span style="font-size: 1.5em; color: var(--primary-color); font-weight: bold;">D-${diffDays}</span>
            </div>
        </div>
        <div class="widget-code">
            <h4>HTML 코드</h4>
            <textarea readonly style="width: 100%; min-height: 100px; padding: 10px; font-family: monospace; border: 1px solid #ddd; border-radius: 5px;">${widgetCode}</textarea>
            <button class="btn btn-secondary" onclick="copyWidgetCode()" style="margin-top: 10px;">코드 복사</button>
        </div>
    `;
    resultBox.classList.add('show');
    
    // 전역 변수에 저장
    window.widgetCodeToCopy = widgetCode;
}

// 위젯 코드 복사
function copyWidgetCode() {
    if (window.widgetCodeToCopy) {
        navigator.clipboard.writeText(window.widgetCodeToCopy).then(() => {
            alert('코드가 클립보드에 복사되었습니다!');
        });
    }
}

// 카카오톡 공유
function shareToKakao(dateString, days, startDateString = null, title = 'D-day') {
    // 현재 화면의 실제 값 가져오기
    let actualDays = days;
    if (!startDateString) {
        const countElement = document.getElementById('countNumber');
        if (countElement) {
            actualDays = parseInt(countElement.textContent) || days;
        }
    }
    
    // Web Share API 사용 (모바일에서 작동)
    if (navigator.share) {
        const shareData = {
            title: `${title} - D-day 계산기`,
            text: startDateString 
                ? `${formatDateKorean(new Date(startDateString + 'T00:00:00'))}로부터 ${days}일 후는 ${formatDateKorean(new Date(dateString + 'T00:00:00'))}입니다!`
                : `${formatDateKorean(new Date(dateString + 'T00:00:00'))}까지 D-${actualDays}`,
            url: window.location.href
        };
        
        navigator.share(shareData).catch(err => {
            console.log('공유 실패:', err);
            // 실패 시 이미지 다운로드
            const shareImage = generateShareImage(dateString, actualDays, startDateString, title);
            downloadImage(shareImage, `dday-${dateString}.png`);
            alert('이미지를 다운로드했습니다. 카카오톡에서 공유해주세요!');
        });
    } else {
        // Web Share API를 지원하지 않는 경우 이미지 다운로드
        const shareImage = generateShareImage(dateString, actualDays, startDateString, title);
        downloadImage(shareImage, `dday-${dateString}.png`);
        alert('이미지를 다운로드했습니다. 카카오톡에서 공유해주세요!');
    }
}

// 인스타그램 공유
function shareToInstagram(dateString, days, startDateString = null, title = 'D-day') {
    try {
        // 현재 화면의 실제 값 가져오기
        let actualDays = days;
        if (!startDateString) {
            const countElement = document.getElementById('countNumber');
            if (countElement) {
                actualDays = parseInt(countElement.textContent) || days;
            }
        }
        
        const shareImage = generateShareImage(dateString, actualDays, startDateString, title);
        if (!shareImage) {
            alert('이미지 생성에 실패했습니다. 다시 시도해주세요.');
            return;
        }
        
        downloadImage(shareImage, `dday-${dateString}-${Date.now()}.png`);
        alert('이미지를 다운로드했습니다. 인스타그램 앱에서 업로드해주세요!');
    } catch (error) {
        console.error('인스타그램 공유 오류:', error);
        alert('이미지 생성 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
}

// 이미지 복사
function copyShareImage(dateString, days, startDateString = null, title = 'D-day') {
    try {
        // 현재 화면의 실제 값 가져오기
        let actualDays = days;
        if (!startDateString) {
            const countElement = document.getElementById('countNumber');
            if (countElement) {
                actualDays = parseInt(countElement.textContent) || days;
            }
        }
        
        const shareImage = generateShareImage(dateString, actualDays, startDateString, title);
        if (!shareImage) {
            alert('이미지 생성에 실패했습니다. 다시 시도해주세요.');
            return;
        }
        
        // Clipboard API 지원 확인
        if (navigator.clipboard && navigator.clipboard.write) {
            shareImage.toBlob(blob => {
                if (!blob) {
                    downloadImage(shareImage, `dday-${dateString}-${Date.now()}.png`);
                    alert('이미지를 다운로드했습니다.');
                    return;
                }
                
                navigator.clipboard.write([
                    new ClipboardItem({ 'image/png': blob })
                ]).then(() => {
                    alert('이미지가 클립보드에 복사되었습니다!');
                }).catch(err => {
                    console.error('클립보드 복사 오류:', err);
                    // 실패 시 다운로드로 대체
                    downloadImage(shareImage, `dday-${dateString}-${Date.now()}.png`);
                    alert('클립보드 복사에 실패했습니다. 이미지를 다운로드했습니다.');
                });
            }, 'image/png');
        } else {
            // Clipboard API를 지원하지 않는 경우 다운로드
            downloadImage(shareImage, `dday-${dateString}-${Date.now()}.png`);
            alert('이 브라우저는 클립보드 복사를 지원하지 않습니다. 이미지를 다운로드했습니다.');
        }
    } catch (error) {
        console.error('이미지 복사 오류:', error);
        alert('이미지 복사 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
}

// 공유 이미지 생성
function generateShareImage(dateString, days, startDateString = null, title = 'D-day', memoText = null) {
    const canvas = document.getElementById('shareCanvas');
    if (!canvas) {
        console.error('shareCanvas를 찾을 수 없습니다.');
        return null;
    }
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        console.error('Canvas context를 가져올 수 없습니다.');
        return null;
    }
    
    // 카운트다운 중지 (저장 시 정지된 상태)
    if (countdownInterval) {
        clearInterval(countdownInterval);
        countdownInterval = null;
    }
    
    // 현재 화면의 실제 값 가져오기 (애니메이션 중이 아닌 정지된 값)
    let actualDays = days;
    let actualTime = { days: 0, hours: 0, minutes: 0, seconds: 0 };
    
    if (!memoText && !startDateString) {
        // D-day 계산인 경우
        const daysElement = document.getElementById('daysValue');
        const hoursElement = document.getElementById('hoursValue');
        const minutesElement = document.getElementById('minutesValue');
        const secondsElement = document.getElementById('secondsValue');
        
        if (daysElement) actualTime.days = parseInt(daysElement.textContent) || 0;
        if (hoursElement) actualTime.hours = parseInt(hoursElement.textContent) || 0;
        if (minutesElement) actualTime.minutes = parseInt(minutesElement.textContent) || 0;
        if (secondsElement) actualTime.seconds = parseInt(secondsElement.textContent) || 0;
        
        const countElement = document.getElementById('countNumber');
        if (countElement) {
            actualDays = parseInt(countElement.textContent) || days;
        }
    }
    
    canvas.width = 1200;
    canvas.height = 630;
    
    // 배경 그라데이션
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#667eea');
    gradient.addColorStop(1, '#764ba2');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 텍스트
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    
    if (memoText) {
        // 메모 공유 이미지 - 감성적인 디자인
        // 날짜와 메모 텍스트 분리
        const memoLines = memoText.split('\n');
        let dateString = '';
        let memoContent = '';
        
        // 첫 번째 줄이 날짜 형식인지 확인 (예: "2024년 12월 19일 (목)")
        if (memoLines.length > 0 && memoLines[0].includes('년') && memoLines[0].includes('월')) {
            dateString = memoLines[0];
            memoContent = memoLines.slice(1).join('\n').trim();
        } else {
            // 날짜가 없으면 메모 전체를 내용으로
            memoContent = memoText;
        }
        
        // 날짜 표시 (있을 경우)
        if (dateString) {
            ctx.font = '48px Arial';
            ctx.fillText(dateString, canvas.width / 2, 200);
        }
        
        // 메모 내용 표시 (날짜 아래)
        ctx.font = '44px Arial';
        const lines = wrapText(ctx, memoContent || memoText, canvas.width - 200);
        let y = dateString ? 320 : 280;
        lines.forEach(line => {
            ctx.fillText(line, canvas.width / 2, y);
            y += 70;
        });
    } else if (startDateString) {
        // N일 후 계산 이미지
        ctx.font = 'bold 64px Arial';
        ctx.fillText(`${days}일 후`, canvas.width / 2, 180);
        
        ctx.font = '48px Arial';
        const startDate = new Date(startDateString + 'T00:00:00');
        ctx.fillText(formatDateKorean(startDate), canvas.width / 2, 280);
        
        ctx.font = 'bold 56px Arial';
        ctx.fillText('↓', canvas.width / 2, 360);
        
        ctx.font = '48px Arial';
        const futureDate = new Date(dateString + 'T00:00:00');
        ctx.fillText(formatDateKorean(futureDate), canvas.width / 2, 450);
    } else {
        // D-day 계산 이미지 (저장 시 정지된 값 사용) - 감성적인 디자인
        ctx.font = 'bold 120px Arial';
        ctx.fillText('D-' + actualDays, canvas.width / 2, 280);
        
        ctx.font = '48px Arial';
        const targetDate = new Date(dateString + 'T00:00:00');
        ctx.fillText(formatDateKorean(targetDate), canvas.width / 2, 380);
    }
    
    return canvas;
}

// 텍스트 줄바꿈 함수
function wrapText(ctx, text, maxWidth) {
    const words = text.split(' ');
    const lines = [];
    let currentLine = words[0];
    
    for (let i = 1; i < words.length; i++) {
        const word = words[i];
        const width = ctx.measureText(currentLine + ' ' + word).width;
        if (width < maxWidth) {
            currentLine += ' ' + word;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    }
    lines.push(currentLine);
    return lines;
}

// 이미지 다운로드
function downloadImage(canvas, filename) {
    try {
        if (!canvas) {
            console.error('Canvas가 없습니다.');
            return;
        }
        
        const dataURL = canvas.toDataURL('image/png');
        if (!dataURL || dataURL === 'data:,') {
            console.error('이미지 데이터를 생성할 수 없습니다.');
            alert('이미지 생성에 실패했습니다.');
            return;
        }
        
        const link = document.createElement('a');
        link.download = filename;
        link.href = dataURL;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error('이미지 다운로드 오류:', error);
        alert('이미지 다운로드 중 오류가 발생했습니다.');
    }
}

// 메모 카카오톡 공유
function shareMemoToKakao(memoId) {
    const memos = getMemos();
    const memo = memos.find(m => m.id === memoId);
    if (!memo) return;
    
    if (navigator.share) {
        const shareData = {
            title: '📝 D-day 메모',
            text: `${memo.dateString}\n${memo.text}`,
            url: window.location.href
        };
        
        navigator.share(shareData).catch(err => {
            console.log('공유 실패:', err);
            const shareImage = generateShareImage(null, null, null, '메모', `${memo.dateString}\n${memo.text}`);
            downloadImage(shareImage, `memo-${memoId}.png`);
            alert('이미지를 다운로드했습니다. 카카오톡에서 공유해주세요!');
        });
    } else {
        const shareImage = generateShareImage(null, null, null, '메모', `${memo.dateString}\n${memo.text}`);
        downloadImage(shareImage, `memo-${memoId}.png`);
        alert('이미지를 다운로드했습니다. 카카오톡에서 공유해주세요!');
    }
}

// 메모 인스타그램 공유
function shareMemoToInstagram(memoId) {
    const memos = getMemos();
    const memo = memos.find(m => m.id === memoId);
    if (!memo) return;
    
    const shareImage = generateShareImage(null, null, null, '메모', `${memo.dateString}\n${memo.text}`);
    downloadImage(shareImage, `memo-${memoId}.png`);
    alert('이미지를 다운로드했습니다. 인스타그램 앱에서 업로드해주세요!');
}

// 메모 이미지 복사
function copyMemoImage(memoId) {
    const memos = getMemos();
    const memo = memos.find(m => m.id === memoId);
    if (!memo) return;
    
    const shareImage = generateShareImage(null, null, null, '메모', `${memo.dateString}\n${memo.text}`);
    shareImage.toBlob(blob => {
        navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
        ]).then(() => {
            alert('이미지가 클립보드에 복사되었습니다!');
        }).catch(() => {
            downloadImage(shareImage, `memo-${memoId}.png`);
            alert('이미지를 다운로드했습니다.');
        });
    });
}

// 알림 권한 요청
function requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }
}

// 알림 스케줄링
function scheduleNotifications(targetDate, days) {
    if (!('Notification' in window) || Notification.permission !== 'granted') {
        return;
    }
    
    const notifications = localStorage.getItem('ddayNotifications') ? JSON.parse(localStorage.getItem('ddayNotifications')) : {};
    const dateKey = formatDateForInput(targetDate);
    
    // 기존 알림 제거
    if (notifications[dateKey]) {
        notifications[dateKey].forEach(id => clearTimeout(id));
    }
    
    const timeouts = [];
    
    // 100일 전 알림
    if (days > 100) {
        const daysUntil100 = days - 100;
        const timeout100 = setTimeout(() => {
            new Notification('D-day 알림', {
                body: `${formatDateKorean(targetDate)}까지 100일 남았습니다!`,
                icon: '/favicon.svg'
            });
        }, daysUntil100 * 24 * 60 * 60 * 1000);
        timeouts.push(timeout100);
    }
    
    // 30일 전 알림
    if (days > 30) {
        const daysUntil30 = days - 30;
        const timeout30 = setTimeout(() => {
            new Notification('D-day 알림', {
                body: `${formatDateKorean(targetDate)}까지 30일 남았습니다!`,
                icon: '/favicon.svg'
            });
        }, daysUntil30 * 24 * 60 * 60 * 1000);
        timeouts.push(timeout30);
    }
    
    // 7일 전 알림
    if (days > 7) {
        const daysUntil7 = days - 7;
        const timeout7 = setTimeout(() => {
            new Notification('D-day 알림', {
                body: `${formatDateKorean(targetDate)}까지 7일 남았습니다!`,
                icon: '/favicon.svg'
            });
        }, daysUntil7 * 24 * 60 * 60 * 1000);
        timeouts.push(timeout7);
    }
    
    notifications[dateKey] = timeouts;
    localStorage.setItem('ddayNotifications', JSON.stringify(notifications));
}

// 오늘의 기념일 추천
function showDailyQuote() {
    const quotes = [
        '오늘도 목표를 향해 한 걸음씩! 💪',
        '작은 시작이 큰 변화를 만듭니다 ✨',
        '시간은 금이다. 소중하게 사용하세요 ⏰',
        '오늘이 바로 시작하는 날입니다! 🌟',
        '목표를 향한 여정, 오늘도 화이팅! 🚀',
        '하루하루가 소중한 시간입니다 📅',
        '꿈을 향해 달려가는 오늘이 되길 🌈'
    ];
    
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    const quoteElement = document.getElementById('dailyQuote');
    if (quoteElement) {
        quoteElement.textContent = randomQuote;
    }
}

// 테마 초기화
function initTheme() {
    const savedTheme = localStorage.getItem('ddayTheme') || 'purple';
    setTheme(savedTheme);
    
    // 테마 버튼 이벤트
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const theme = btn.dataset.theme;
            setTheme(theme);
            localStorage.setItem('ddayTheme', theme);
        });
    });
}

// 테마 설정
function setTheme(theme) {
    const themes = {
        purple: { primary: '#667eea', secondary: '#764ba2' },
        blue: { primary: '#4a90e2', secondary: '#357abd' },
        green: { primary: '#50c878', secondary: '#45b869' },
        pink: { primary: '#ff6b9d', secondary: '#ff4d7a' },
        orange: { primary: '#ff8c42', secondary: '#ff6b1a' }
    };
    
    const selectedTheme = themes[theme] || themes.purple;
    document.documentElement.style.setProperty('--theme-primary', selectedTheme.primary);
    document.documentElement.style.setProperty('--theme-secondary', selectedTheme.secondary);
    
    // 헤더 배경 업데이트
    const header = document.querySelector('header');
    if (header) {
        header.style.background = `linear-gradient(135deg, ${selectedTheme.primary} 0%, ${selectedTheme.secondary} 100%)`;
    }
    
    // 활성 테마 버튼 표시
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.theme === theme);
    });
}

// Enter 키로 계산하기
document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        const target = e.target;
        if (target.id === 'targetDate') {
            calculateDday();
        } else if (target.id === 'daysInput' || target.id === 'startDate') {
            calculateFutureDate();
        }
    }
});
