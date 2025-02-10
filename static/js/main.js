//======= 탭
let activeCont = ''; // 현재 활성화 된 컨텐츠 (기본:#tab1 활성화)

function tab(tablist, contents) {
	for (var i = 0; i < tablist.length; i++) {
		tablist[i].querySelector('.btn').addEventListener('click', function (e) {
			e.preventDefault();
			for (var j = 0; j < tablist.length; j++) {
				tablist[j].classList.remove('active');
				contents[j].style.display = 'none';
				// 슬라이드 애니메이션 클래스 제거
				contents[j].classList.remove('slide-animation');
			}
			this.parentNode.classList.add('active');
			activeCont = this.getAttribute('href');
			const activeContent = document.querySelector(activeCont);
			activeContent.style.display = 'block';
			
			// 컨텐츠 영역 스크롤 최하단으로 이동
			activeContent.scrollTop = activeContent.scrollHeight;
		});
	}
}

const tabList = document.querySelectorAll('.aiAnswer_wrap .tab_menu .list li');
const contents = document.querySelectorAll(
	'.aiAnswer_wrap .tab_menu .cont_area .cont'
);
tab(tabList, contents);

const tabListPopup = document.querySelectorAll(
	'.popup_wrap .tab_menu .list li'
);
const contentsPopup = document.querySelectorAll(
	'.popup_wrap .tab_menu .cont_area .cont'
);
tab(tabListPopup, contentsPopup);

//======= 레이어팝업
const popupCloseBtn = document.querySelector('.popup .btn_close');
const popup = document.querySelector('.popup');
const knowledgeBtn = document.querySelector('.btn_knowledge');

const knowledgeBtn1 = document.querySelector('#knowledge1');
const knowledgeBtn2 = document.querySelector('#knowledge2');
const knowledgeBtn3 = document.querySelector('#knowledge3');

knowledgeBtn.addEventListener('click', function (e) {
	e.preventDefault();
	popup.classList.add('active');
});
popupCloseBtn.addEventListener('click', function (e) {
	e.preventDefault();
	popup.classList.remove('active');
});

// 첫 번째 추천지식 버튼 클릭 이벤트
knowledgeBtn1.addEventListener('click', function (e) {
    e.preventDefault();
    popup.classList.add('active');
});

// 두 번째 추천지식 버튼 클릭 이벤트
knowledgeBtn2.addEventListener('click', function (e) {
    e.preventDefault();
    
    // 파일 경로 구성 (백틱과 대괄호를 포함한 정확한 파일명 사용)
    const basePath = '/knwlgFile/';
    const folderName = '5G 슬림 요금제 ver.7';
    const fileName = '5G 슬림 요금제 ver.7 [24.03.22]`_eng.html';
    
    // 전체 URL 조합 (encodeURIComponent 사용)
    const fullPath = basePath + 
        encodeURIComponent(folderName) + '/' + 
        encodeURIComponent(fileName);
    
    console.log('Trying to open:', fullPath); // 디버깅용 로그
    
    // 새 팝업 창 열기
    window.open(fullPath, 
        '5G Slim Rate Plan', 
        'width=900,height=700,scrollbars=yes,resizable=yes'
    );
});


// 채팅 영역 스크롤을 최하단으로 이동시키는 함수
function scrollToBottom(element) {
	element.scrollTo({
		top: element.scrollHeight,
		behavior: 'smooth'
	});
}

// 오디오 관리를 위한 전역 변수 추가
let currentAudio = null;
let isSpeakerOn = true;

// 오디오 파일 매핑
const audioMap = {
    'AI_GENIE_1': '/static/audio/AI_GENIE_1.mp3',
    'AI_GENIE_2': '/static/audio/AI_GENIE_2.mp3',
    'AI_GENIE_3': '/static/audio/AI_GENIE_3.mp3',
    'AI_GENIE_4': '/static/audio/AI_GENIE_4.mp3',
	'AI_GENIE_5': '/static/audio/AI_GENIE_5.mp3',
    'CUSTOMER_1': '/static/audio/CUSTOMER_1.mp3',
    'CUSTOMER_2': '/static/audio/CUSTOMER_2.mp3',
    'CUSTOMER_3': '/static/audio/CUSTOMER_3.mp3',
    'CUSTOMER_4': '/static/audio/CUSTOMER_4.mp3'
};

// 스피커 버튼 이벤트 처리
const speakerBtn = document.querySelector('.btn_speaker');
if (speakerBtn) {
    speakerBtn.addEventListener('click', function() {
        isSpeakerOn = !isSpeakerOn;
        const imgSrc = isSpeakerOn ? 
            '/static/images/ic_speakerOn.png' : 
            '/static/images/ic_speakerOff.png';
        this.querySelector('img').src = imgSrc;
        
        if (!isSpeakerOn && currentAudio) {
            currentAudio.pause();
            currentAudio = null;
        }
    });
}

// 오디오 재생 함수
async function playAudio(audioKey) {
    if (!isSpeakerOn) return;
    
    if (currentAudio) {
        currentAudio.pause();
        currentAudio = null;
    }
    
    const audioPath = audioMap[audioKey];
    if (!audioPath) return;
    
    try {
        currentAudio = new Audio(audioPath);
        currentAudio.muted = false;
        currentAudio.playsInline = true;
        currentAudio.preload = 'auto';
        
        return new Promise((resolve) => {
            currentAudio.addEventListener('ended', () => {
                currentAudio = null;
                resolve();
            });
            
            currentAudio.addEventListener('error', (e) => {
                console.error('Audio playback error:', e);
                currentAudio = null;
                resolve();
            });
            
            currentAudio.play().catch(error => {
                console.warn('Autoplay prevented:', error);
                resolve();
            });
        });
	} catch (error) {
        console.error('Audio playback error:', error);
        return Promise.resolve();
    }
}

// 메시지 생성 및 재생 함수 수정
async function createAndPlayMessage(isStaff, text, audioKey, chatArea) {
    // 메시지 요소 생성
    const messageElement = isStaff ? createStaffMessage(text) : createCustomerMessage(text);
    chatArea.appendChild(messageElement);
    
    // 메시지 타이핑과 오디오 재생을 동시에 시작
    const textElement = messageElement.querySelector(isStaff ? '.staff_comment p' : '.customer_comment p');
    
    try {
        if(isStaff){
            await Promise.all([
                typeWriter(textElement, text, 65),
                playAudio(audioKey)
            ]);
        }
        else{
            await Promise.all([
                typeWriter(textElement, text),
                playAudio(audioKey)
            ]);
        } 
    } catch (error) {
        console.error('Error in createAndPlayMessage:', error);
    }
    
    scrollToBottom(chatArea);
    
    // 메시지 요소 반환 추가
    return messageElement;
}

// 메시지 타이핑 효과 수정
async function typeWriter(element, text, speed = 50) {
	const lines = text.split('\n');
	element.innerHTML = '';
	
	// 부모 요소가 chat_area인지 확인
	const isChatArea = element.closest('.chat_area');
	
	for (let line of lines) {
		const lineDiv = document.createElement('div');
		lineDiv.style.whiteSpace = 'pre-wrap';
		lineDiv.style.wordBreak = 'break-word';
		
		// 채팅 영역일 경우 추가 스타일 적용
		if (isChatArea) {
			if (line.startsWith('- ')) {
				lineDiv.style.paddingLeft = '1em';
			} else if (/^\d+\./.test(line)) {
				lineDiv.style.fontWeight = 'bold';
				lineDiv.style.marginTop = '0.5em';
			}
		}
		
		element.appendChild(lineDiv);
		
		const lineSpan = document.createElement('span');
		lineDiv.appendChild(lineSpan);
		
		for (let i = 0; i < line.length; i++) {
			lineSpan.textContent = line.substring(0, i + 1);
			if (isChatArea) {
				scrollToBottom(element.closest('.chat_area'));
			} else {
				element.scrollTop = element.scrollHeight;
			}
		await new Promise(resolve => setTimeout(resolve, speed));
		}
		
		// 줄간격 조정
		if (line !== lines[lines.length - 1]) {
			// 빈 줄이면 더 큰 간격 추가
			if (line.trim() === '') {
				lineDiv.style.marginBottom = '1em';
			} else {
				lineDiv.style.marginBottom = '0.5em';
			}
		}
	}
}

// AI 메시지 요소 생성
function createStaffMessage(text) {
	const div = document.createElement('div');
	div.className = 'chat_area_staff';
	div.innerHTML = `
		<div class="staff_name_area">
			<div class="pic ic_staff">
				<img src="${window.STATIC_URLS.staff_icon}" alt="아이콘">
			</div>
			<h3 class="staff_name">AI GENIE</h3>
		</div>
		<div class="staff_comment">
			<p></p>
		</div>
	`;
	return div;
}

// 고객 메시지 요소 생성
function createCustomerMessage(text) {
	const div = document.createElement('div');
	div.className = 'chat_area_customer';
	div.innerHTML = `
		<div class="customer_name_area">
			<div class="pic ic_profile">
				<img src="${window.STATIC_URLS.profile_icon}" alt="아이콘">
			</div>
			<h3 class="staff_name">Danny Customer</h3>
		</div>
		<div class="customer_comment">
			<p>${text}</p>
		</div>
	`;
	return div;
}

// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', function() {
	const chatArea = document.querySelector('.chat_area');
	if (chatArea) {
		// 오디오 컨텍스트 초기화
		const audioContext = new (window.AudioContext || window.webkitAudioContext)();
		
		// 클릭 오버레이 생성
		const overlay = document.createElement('div');
		overlay.style.cssText = `
			position: fixed;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background-color: rgba(0, 0, 0, 0.5);
			display: flex;
			justify-content: center;
			align-items: center;
			z-index: 9999;
			cursor: pointer;
	 `;
		
		const startText = document.createElement('div');
		startText.style.cssText = `
			color: white;
			font-size: 24px;
			padding: 20px 40px;
			background-color: rgba(0, 0, 0, 0.7);
			border-radius: 10px;
	 `;
		startText.textContent = 'Click anywhere to start conversation';
		
		overlay.appendChild(startText);
		document.body.appendChild(overlay);
		
		// 오버레이 클릭 이벤트
		overlay.addEventListener('click', async function() {
			await audioContext.resume();
			overlay.remove();
			
			// 2초 대기 후 채팅 시작
			await new Promise(resolve => setTimeout(resolve, 1500));
		chatArea.innerHTML = '';
		streamMessages();
		});
		
		// 시작 시간 저장
		window.chatStartTime = new Date();
	}

	// 히스토리 항목 클릭 이벤트
	const historyItems = document.querySelectorAll('.history_wrap .context li');
	const historyPopup = document.querySelector('.history_popup');
	
	historyItems.forEach(item => {
		item.addEventListener('click', function() {
			if (this.querySelector('.num').textContent === '002') {
				// 다른 항목의 focusing 제거
				document.querySelectorAll('.history_wrap .context li').forEach(item => {
					item.classList.remove('focusing');
				});
				
				// 팝업 표시
				historyPopup.classList.add('active');
				
				// Summary 내용 가져와서 팝업 내용 업데이트
				const summaryContent = {
					time: document.querySelector('.summary_wrap .context li:nth-child(1) p:not(.label)').textContent,
					category: document.querySelector('.summary_wrap .context li:nth-child(2) p:not(.label)').textContent,
					inquiry: document.querySelector('.summary_wrap .context li:nth-child(3) p:not(.label)').textContent,
					summary: document.querySelector('.summary_wrap .context li:nth-child(4) p:not(.label)').textContent
				};
				
				// 팝업 내용 업데이트
				const popupContent = historyPopup.querySelector('.summary_detail ul');
				popupContent.innerHTML = `
					<li>
						<p class="label"><strong>Consultation Time</strong></p>
						<p>${summaryContent.time}</p>
					</li>
					<li>
						<p class="label"><strong>Category</strong></p>
						<p>${summaryContent.category}</p>
					</li>
					<li>
						<p class="label"><strong>Inquiry</strong></p>
						<p>${summaryContent.inquiry}</p>
					</li>
					<li>
						<p class="label"><strong>Summary</strong></p>
						<p>${summaryContent.summary}</p>
					</li>
				`;
			}
		});
	});
	
	// 히스토리 팝업 닫기 버튼 이벤트 수정
	const historyPopupCloseBtn = historyPopup.querySelector('.btn_close');
	historyPopupCloseBtn.addEventListener('click', async function() {
		// 팝업 닫기
		historyPopup.classList.remove('active');
		
		// 2초 대기 후 초기화면으로 이동
		await new Promise(resolve => setTimeout(resolve, 2000));
		
		// 페이지 새로고침 대신 초기화면으로 이동
		window.location.href = '/';
	});
	
	// 저장 버튼 클릭 이벤트
	const saveBtn = document.querySelector('.history_wrap .btn_red');
	if (saveBtn) {
		saveBtn.addEventListener('click', async function() {
			// 상담 종료 여부 확인
			const finishBtn = document.querySelector('.btn_finish');
			if (!finishBtn.disabled) {
				showAlert('Consultation has not been ended');
				return;
			}
			
			// 깜빡임 효과 제거
			this.classList.remove('focusing');
			
			// 버튼 비활성화
			this.disabled = true;
			this.style.opacity = '0.5';
			this.style.cursor = 'default';
			
			// Summary 내용 가져오기
			const summaryContent = {
				time: document.querySelector('.summary_wrap .context li:nth-child(1) p:not(.label)').textContent,
				category: document.querySelector('.summary_wrap .context li:nth-child(2) p:not(.label)').textContent,
				inquiry: document.querySelector('.summary_wrap .context li:nth-child(3) p:not(.label)').textContent,
				summary: document.querySelector('.summary_wrap .context li:nth-child(4) p:not(.label)').textContent
			};
			
			// 현재 상담 내용을 히스토리에 저장
			const historyList = document.querySelector('.history_wrap .context ul');
			const newHistoryItem = document.createElement('li');
			newHistoryItem.innerHTML = `
				<p class="num">002</p>
				<p class="tit">Danny -Change Mobile Plan</p>
				<p class="date">2025.03.04</p>
			`;
			
			// 클릭 이벤트 수정
			newHistoryItem.addEventListener('click', function() {
				// focusing 효과 제거
				this.classList.remove('focusing');
				
				const historyPopup = document.querySelector('.history_popup');
				
				// 팝업 내용 업데이트
				const popupContent = historyPopup.querySelector('.summary_detail ul');
				popupContent.innerHTML = `
					<li>
						<p class="label"><strong>Consultation Time</strong></p>
						<p>${summaryContent.time}</p>
					</li>
					<li>
						<p class="label"><strong>Category</strong></p>
						<p>${summaryContent.category}</p>
					</li>
					<li>
						<p class="label"><strong>Inquiry</strong></p>
						<p>${summaryContent.inquiry}</p>
					</li>
					<li>
						<p class="label"><strong>Summary</strong></p>
						<p>${summaryContent.summary}</p>
					</li>
				`;
				
				historyPopup.classList.add('active');
			});
			
			historyList.appendChild(newHistoryItem);
			// 새로 추가된 항목에 focusing 효과 추가
			newHistoryItem.classList.add('focusing');
		});
	}
});

// CSS 스타일 추가를 위한 스타일 태그 수정
const style = document.createElement('style');
style.textContent = `
	.loading-overlay {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 1000;
		border-radius: 15px;
	}
	.loading-spinner {
		width: 50px;
		height: 50px;
		border: 5px solid #f3f3f3;
		border-top: 5px solid #3498db;
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}
	@keyframes spin {
		0% { transform: rotate(0deg); }
		100% { transform: rotate(360deg); }
	}
	@keyframes slideToChat {
		0% {
			opacity: 1;
			transform: translateX(0);
		}
		50% {
			opacity: 0.7;
			transform: translateX(-50%);
		}
		100% {
			opacity: 0;
			transform: translateX(-100%);
		}
	}
	.slide-animation {
		animation: slideToChat 0.5s ease-in-out;
	}

	/* 깜빡이는 버튼 효과 */
	@keyframes blink {
		0% { opacity: 1; }
		50% { opacity: 0.5; }
		100% { opacity: 1; }
	}
	.focusing {
		animation: blink 1.5s infinite;
	}

	.full-overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.3);
		z-index: 999;
	}
	
	.home-guide {
		position: fixed;
		top: 90px;
		right: 90px;
		background: #fff;
		padding: 10px 15px;
		border-radius: 5px;
		box-shadow: 0 2px 5px rgba(0,0,0,0.2);
		animation: fadeIn 0.5s ease-in-out;
		z-index: 1001;
	}
	
	@keyframes fadeIn {
		from { opacity: 0; transform: translateY(-10px); }
		to { opacity: 1; transform: translateY(0); }
	}
	
	.aiAnswer_wrap .box_area .context,
	.summary_wrap .box_area .context {
		scroll-behavior: smooth;
	}
	
	.btn_home.focusing {
		animation: blink 1.5s infinite;
		z-index: 1000;
	}

	.staff_comment p div,
	.customer_comment p div {
		min-height: 1.2em;
		line-height: 1.5;
		white-space: pre-wrap;
		word-break: break-word;
	}
	
	.staff_comment p div:not(:last-child),
	.customer_comment p div:not(:last-child) {
		margin-bottom: 0.5em;
	}
	
	.staff_comment p div[style*="bold"] {
		color: #333;
	}
	
	.staff_comment p div[style*="paddingLeft"] {
		color: #666;
	}
	
	#tab_ai_1 div,
	#tab_ai_2 div {
		white-space: pre-wrap;
		word-break: break-word;
		line-height: 1.5;
	}

	/* 클릭 유도 관련 스타일 추가 */
	.click-guide-overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.7);
		z-index: 1000;
		pointer-events: none;
	}

	.click-target {
		position: relative;
		z-index: 1001;
		animation: pulse 2s infinite;
	}

	.click-guide-text {
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		bottom: -60px;
		color: #fff;
		font-size: 16px;
		background: rgba(82, 109, 130, 0.9);
		padding: 10px 20px;
		border-radius: 5px;
		white-space: nowrap;
	}

	@keyframes pulse {
		0% {
			box-shadow: 0 0 0 0 rgba(82, 109, 130, 0.7);
		}
		70% {
			box-shadow: 0 0 0 15px rgba(82, 109, 130, 0);
		}
		100% {
			box-shadow: 0 0 0 0 rgba(82, 109, 130, 0);
		}
	}
`;
document.head.appendChild(style);

// 알림 메시지를 표시하는 함수 추가
function showAlert(message) {
	const alert = document.createElement('div');
	alert.className = 'alert-message';
	alert.textContent = message;
	document.body.appendChild(alert);
	
	// 2초 후 알림 메시지 제거
	setTimeout(() => {
		alert.remove();
	}, 2000);
}

// options_gpt 영역의 입력 제어 수정
const optionsGptArea = document.querySelector('.options_gpt.box_area');
if (optionsGptArea) {
	// select, input, range, groove_parent 요소들에 대한 이벤트 리스너
	const allElements = [
		...optionsGptArea.querySelectorAll('select'),
		...optionsGptArea.querySelectorAll('input'),
		...optionsGptArea.querySelectorAll('input[type="range"]'),
		...optionsGptArea.querySelectorAll('.groove_parent')
	];

	allElements.forEach(element => {
		['mousedown', 'touchstart', 'keydown', 'dragstart', 'input', 'click'].forEach(eventType => {
			element.addEventListener(eventType, function(e) {
				e.preventDefault();
				e.stopPropagation();
				showAlert('Administrator privileges required');
			}, { capture: true });
		});
	});
}

// 답변 생성 상태를 관리하는 전역 변수 추가
let isGeneratingAnswer = false;

// 답변 생성하기 버튼 클릭 이벤트 수정
const answerMakerBtn = document.querySelector('.btn_answerMaker');
if (answerMakerBtn) {
    answerMakerBtn.addEventListener('click', async function() {
        try {
            // 답변 생성 중인 경우 처리
            if (isGeneratingAnswer) {
                showAlert('Generating answer in progress');
                return;
            }

            // 고객 질문 선택 여부 확인
            const customerQuestion = document.querySelector('.box_area.customer_focusing .comment').textContent;
            if (!customerQuestion.trim()) {
                showAlert('Please select a customer question');
                return;
            }
            
            // 상담 종료 상태 체크
            const finishBtn = document.querySelector('.btn_finish');
            if (finishBtn.classList.contains('focusing') || finishBtn.disabled) {
                return;
            }

            // 답변 생성 상태 설정
            isGeneratingAnswer = true;
            
            // Select Question 버튼 숨기기
            const selectQuestionBtn = document.querySelector('.btn_choose');
            if (selectQuestionBtn) {
                selectQuestionBtn.style.display = 'none';
            }
            
            // aiAnswer_wrap 영역에 로딩 표시 추가
            const aiAnswerWrap = document.querySelector('.aiAnswer_wrap .box_area');
            const loadingOverlay = document.createElement('div');
            loadingOverlay.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.7);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 9999;
            `;
            
            loadingOverlay.innerHTML = `
                <div class="loading" style="
                    width: 40px;
                    height: 40px;
                    border: 4px solid #f3f3f3;
                    border-top: 4px solid #526d82;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                "></div>
            `;
            
            aiAnswerWrap.style.position = 'relative';
            aiAnswerWrap.appendChild(loadingOverlay);
            
            // 1.5초 대기
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // 로딩 오버레이 제거
            loadingOverlay.remove();
            
            // AI 답변 가져오기
            const response = await fetch('/api/get_answers');
            const answers = await response.json();
            
            // 각 탭에 답변 표시
            const tab1 = document.querySelector('#tab_ai_1');
            const tab2 = document.querySelector('#tab_ai_2');
            
            await typeWriter(tab1, answers.answer1, 10);
            await typeWriter(tab2, answers.answer2, 10);
            
            // 답변 생성 완료 후 Knowledge 버튼 표시
            const knowledgeButtons = document.querySelectorAll('.btn_knowledge');
            knowledgeButtons.forEach(btn => {
                btn.style.display = 'inline-block';
            });
            
            // Knowledge 1 버튼에만 가이드 적용
            const knowledge1Btn = document.querySelector('#knowledge1');
            if (knowledge1Btn) {
                createClickGuide(
                    knowledge1Btn,
                    'Please click the button to see the detail knowledge',
                    () => {
                        // 클릭 후 동작이 필요한 경우 여기에 추가
                    }
                );
            }
            
            // 답변하기 버튼 깜빡임 효과
            const answerBtn = document.querySelector('.btn_answer');
            answerBtn.classList.add('focusing');
            
            // 답변 생성하기 버튼 깜빡임 효과 제거
            this.classList.remove('focusing');
            
            // 답변 생성 상태 초기화
            isGeneratingAnswer = false;
            
        } catch (error) {
            console.error('Error:', error);
            isGeneratingAnswer = false;
        }
    });
}

// 답변하기 버튼 클릭 이벤트 수정
const answerBtn = document.querySelector('.btn_answer');
if (answerBtn) {
    answerBtn.addEventListener('click', async function() {
        try {
            // 답변 생성 중인지 확인
            if (isGeneratingAnswer) {
                showAlert('Generating answer in progress');
                return;
            }

            // 버튼 비활성화
            this.disabled = true;
            this.style.opacity = '0.5';
            this.style.cursor = 'default';
            
            // 답변 생성 여부 확인
            const selectedTab = document.querySelector('.tab_menu .list li.active a').getAttribute('href');
            const selectedAnswer = document.querySelector(selectedTab);
            
            if (!selectedAnswer || !selectedAnswer.textContent.trim()) {
                showAlert('Please generate an answer first');
                // 버튼 상태 복구
                this.disabled = false;
                this.style.opacity = '1';
                this.style.cursor = 'pointer';
                return;
            }

            const chatArea = document.querySelector('.chat_area');
            
            // AI 답변을 채팅창에 추가
            await createAndPlayMessage(true, selectedAnswer.textContent, 'AI_GENIE_3', chatArea);
            await new Promise(resolve => setTimeout(resolve, 1000));

            // 고객 응답 추가
            await createAndPlayMessage(false, "Yes, please change my plan to the \"5G Slim\" plan.", 'CUSTOMER_3', chatArea);
            await new Promise(resolve => setTimeout(resolve, 1000));

            // AI 최종 응답 추가
            await createAndPlayMessage(true, "Understood. The change to the \"5G Slim\" plan at 55,000 KRW (37 EUR) has been completed. Is there anything else I can assist you with?", 'AI_GENIE_4', chatArea);
            await new Promise(resolve => setTimeout(resolve, 1000));

            // 고객 마지막 응답
            await createAndPlayMessage(false, "No, there isn't anything else.", 'CUSTOMER_4', chatArea);
            await new Promise(resolve => setTimeout(resolve, 1000));

            // AI 마지막 인사
            await createAndPlayMessage(true, "Yes, thank you. This was AI GENIE from KT. Have a great day!", 'AI_GENIE_5', chatArea);
            
            // 상담 종료 버튼 깜빡임 효과
            const finishBtn = document.querySelector('.btn_finish');
            finishBtn.classList.add('focusing');
            
            // 답변하기 버튼 깜빡임 효과 제거
            this.classList.remove('focusing');
            
            // 추천 지식 버튼들 표시
            const knowledgeButtons = document.querySelectorAll('.btn_knowledge');
            knowledgeButtons.forEach(btn => {
                btn.style.display = 'inline-block';
            });

        } catch (error) {
            console.error('Error:', error);
        }
    });
}

// 상담 종료 버튼 클릭 이벤트
const finishBtn = document.querySelector('.btn_finish');
if (finishBtn) {
    finishBtn.addEventListener('click', async function() {
        // 대화 시나리오 완료 여부 확인
        const lastStaffMessage = document.querySelector('.chat_area').lastElementChild;
        const isComplete = lastStaffMessage && 
                         lastStaffMessage.classList.contains('chat_area_staff') &&
                         lastStaffMessage.querySelector('.staff_comment p').textContent.includes('Have a great day');
        
        if (!isComplete) {
            showAlert('Cannot end consultation while in conversation with customer');
            return;
        }

        // Generate Answer 버튼 비활성화
        const answerMakerBtn = document.querySelector('.btn_answerMaker');
        if (answerMakerBtn) {
            answerMakerBtn.disabled = true;
            answerMakerBtn.style.opacity = '0.5';
            answerMakerBtn.style.cursor = 'default';
        }

        // 로딩 표시 추가
        const loadingBar = document.createElement('div');
        loadingBar.className = 'loading_bar';
        loadingBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
        `;
        
        loadingBar.innerHTML = `
            <div class="loading_wrap" style="text-align: center;">
                <div class="loading" style="
                    width: 50px;
                    height: 50px;
                    border: 5px solid #f3f3f3;
                    border-top: 5px solid #526d82;
                    border-radius: 50%;
                    margin: 0 auto 20px;
                    animation: spin 1s linear infinite;
                "></div>
                <p style="color: white; font-size: 18px;">Saving consultation history...</p>
            </div>
        `;
        
        // 애니메이션 스타일 추가
        const style = document.createElement('style');
        style.textContent = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(loadingBar);
        
        // 깜빡임 효과 제거
        this.classList.remove('focusing');
        
        // 버튼 비활성화
        this.disabled = true;
        this.style.opacity = '0.5';
        this.style.cursor = 'default';

        // Summary 업데이트 전에 2초 대기
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Summary 업데이트
        const summaryArea = document.querySelector('.summary_wrap .context');
        if (summaryArea) {
            // 상담 시간 계산
            const endTime = new Date();
            const timeDiff = Math.floor((endTime - window.chatStartTime) / 1000); // 초 단위
            const minutes = Math.floor(timeDiff / 60);
            const seconds = timeDiff % 60;
            const consultationTime = `${minutes}m ${seconds}s`;

            // Summary 내용 설정
            const summaryContent = `Customer inquired about changing their mobile plan. After reviewing available options, they chose the 5G Slim plan (55,000 KRW/37 EUR) which includes unlimited calls/texts and 14GB data. The plan change was successfully processed.`;

            // Summary 영역 업데이트
            summaryArea.innerHTML = `
                <h3>Summary of Conversation</h3>
                <ul>
                    <li>
                        <p class="label"><strong>Duration</strong></p>
                        <p>${consultationTime}</p>
                    </li>
                    <li>
                        <p class="label"><strong>Category</strong></p>
                        <p>Mobile Plan</p>
                    </li>
                    <li>
                        <p class="label"><strong>Inquiry</strong></p>
                        <p>Change of Plan</p>
                    </li>
                    <li>
                        <p class="label"><strong>Summary</strong></p>
                        <p>${summaryContent}</p>
                    </li>
                </ul>
            `;
        }
        
        // 로딩 표시 제거
        loadingBar.remove();
        style.remove();
        
        // 저장 버튼 깜빡임 효과
        const saveBtn = document.querySelector('.history_wrap .btn_red');
        saveBtn.classList.add('focusing');
    });
}

// 페이지 로드 시 Knowledge 버튼 숨김 처리 (showKnowledgeButtons 함수 제거)
document.addEventListener('DOMContentLoaded', function() {
    const knowledgeButtons = document.querySelectorAll('.btn_knowledge');
    knowledgeButtons.forEach(btn => {
        btn.style.display = 'none';
    });
});

// Save 버튼 클릭 이벤트 추가
const saveBtn = document.querySelector('.history_wrap .btn_red');
if (saveBtn) {
    saveBtn.addEventListener('click', async function() {
        // 로딩 표시
        const loadingBar = document.createElement('div');
        loadingBar.className = 'loading_bar';
        loadingBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
        `;
        
        loadingBar.innerHTML = `
            <div class="loading_wrap" style="text-align: center;">
                <div class="loading" style="
                    width: 50px;
                    height: 50px;
                    border: 5px solid #f3f3f3;
                    border-top: 5px solid #526d82;
                    border-radius: 50%;
                    margin: 0 auto 20px;
                    animation: spin 1s linear infinite;
                "></div>
                <p style="color: white; font-size: 18px;">Saving...</p>
            </div>
        `;
        
        document.body.appendChild(loadingBar);
        
        // 2초 대기
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // 로딩 제거
        loadingBar.remove();
        
        // 완료 팝업 생성
        const completionPopup = document.createElement('div');
        completionPopup.className = 'completion_popup';
        completionPopup.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 30px;
            border-radius: 10px;
            text-align: center;
            z-index: 10000;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        `;
        
        completionPopup.innerHTML = `
            <h2 style="margin-bottom: 20px; color: #526d82; font-size: 24px;">Consultation Saved</h2>
            <div style="display: flex; justify-content: center; gap: 20px;">
                <button class="btn_home_popup" style="
                    padding: 10px 20px;
                    background: #526d82;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                ">Home</button>
                <button class="btn_scenario_popup" style="
                    padding: 10px 20px;
                    background: #526d82;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                ">Another Scenario</button>
            </div>
        `;
        
        document.body.appendChild(completionPopup);
        
        // 버튼 이벤트 추가
        completionPopup.querySelector('.btn_home_popup').addEventListener('click', () => {
            window.location.href = '/';
        });
        
        completionPopup.querySelector('.btn_scenario_popup').addEventListener('click', () => {
            window.location.href = '/scenario';
        });
    });
}

// 클릭 가이드 함수 추가
function createClickGuide(targetElement, guideText, onClickCallback) {
    if (!targetElement) {
        console.error('Target element is undefined');
        return;
    }

    // 오버레이 생성
    const overlay = document.createElement('div');
    overlay.className = 'click-guide-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        z-index: 1000;
    `;
    document.body.appendChild(overlay);

    // 클릭 대상 요소에 스타일 추가
    targetElement.classList.add('click-target');
    const originalStyles = targetElement.style.cssText;
    targetElement.style.cssText = `
        position: relative;
        z-index: 1001;
        cursor: pointer;
        user-select: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
    `;
    
    // 가이드 텍스트 추가
    const guideTextElement = document.createElement('div');
    guideTextElement.className = 'click-guide-text';
    guideTextElement.textContent = guideText;
    guideTextElement.style.cssText = `
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        bottom: -60px;
        color: #fff;
        font-size: 16px;
        background: rgba(82, 109, 130, 0.9);
        padding: 10px 20px;
        border-radius: 5px;
        white-space: nowrap;
        pointer-events: none;
        z-index: 1002;
    `;
    
    // Knowledge 버튼인 경우 위치 추가 조정
    if (targetElement.classList.contains('btn_knowledge')) {
        guideTextElement.style.bottom = '-70px';
    }
    
    targetElement.appendChild(guideTextElement);

    // 이벤트 리스너 추가
    const handleClick = function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // 클릭 가이드 제거
        removeClickGuide();
        
        // 콜백 실행
        if (onClickCallback) {
            onClickCallback(e);
        }
    };
    
    // 클릭 가이드 제거 함수
    function removeClickGuide() {
        overlay.remove();
        guideTextElement.remove();
        targetElement.classList.remove('click-target');
        targetElement.style.cssText = originalStyles; // 원래 스타일로 복원
        targetElement.removeEventListener('click', handleClick);
        targetElement.removeEventListener('mousedown', preventDrag);
        overlay.removeEventListener('click', preventClick);
    }
    
    // 드래그 방지
    const preventDrag = function(e) {
        e.preventDefault();
    };
    
    // 다른 영역 클릭 방지
    const preventClick = function(e) {
        e.preventDefault();
        e.stopPropagation();
    };
    
    // 이벤트 리스너 등록
    targetElement.addEventListener('click', handleClick);
    targetElement.addEventListener('mousedown', preventDrag);
    overlay.addEventListener('click', preventClick);
    
    // 제거 함수 반환 (필요한 경우 외부에서 수동으로 제거할 수 있도록)
    return removeClickGuide;
}

// streamMessages 함수 내에서 사용 예시
async function streamMessages() {
    try {
        const response = await fetch('/api/stream_message');
        const data = await response.json();
        const chatArea = document.querySelector('.chat_area');
        
        // 각 메시지 쌍을 순차적으로 처리
        const messagePairs = [
            {
                staff: { text: data.messages[0], audio: 'AI_GENIE_1' },
                customer: { text: data.messages[1], audio: 'CUSTOMER_1' }
            },
            {
                staff: { text: data.messages[2], audio: 'AI_GENIE_2' },
                customer: { text: data.messages[3], audio: 'CUSTOMER_2' }
            }
        ];

        for (const [index, pair] of messagePairs.entries()) {
            const staffMessage = await createAndPlayMessage(true, pair.staff.text, pair.staff.audio, chatArea);
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const customerMessage = await createAndPlayMessage(false, pair.customer.text, pair.customer.audio, chatArea);
            
            // 두 번째 고객 응답(index === 1) 후 클릭 가이드 추가
            if (index === 1 && customerMessage) {
                const customerComment = customerMessage.querySelector('.customer_comment');
                if (customerComment) {
                    createClickGuide(
                        customerComment,
                        'Please click the button for search knowledge',
                        () => {
                            const text = customerComment.querySelector('p').textContent;
                            document.querySelector('.box_area.customer_focusing .comment').textContent = text;
                            
                            // Generate Answer 버튼에 가이드 추가
                            const answerMakerBtn = document.querySelector('.btn_answerMaker');
                            if (answerMakerBtn) {
                                setTimeout(() => {
                                    createClickGuide(
                                        answerMakerBtn,
                                        'Please click the button to see the recommended knowledge',
                                        null
                                    );
                                }, 500); // 0.5초 후에 가이드 표시
                            }
                        }
                    );
                }
            }
            
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
    } catch (error) {
        console.error('Error:', error);
    }
}

// 다른 곳에서 사용 예시
function someOtherFunction() {
    const targetElement = document.querySelector('.some-element');
    createClickGuide(
        targetElement,
        'Click here to continue',
        () => {
            console.log('Element clicked!');
            // 추가 동작 실행
        }
    );
}
