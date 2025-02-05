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

// 채팅 메시지 스트리밍 함수
async function streamMessages() {
	try {
		const response = await fetch('/api/stream_message');
		const data = await response.json();
		const chatArea = document.querySelector('.chat_area');
		
		// 초기 AI 메시지
		const staffMessage1 = createStaffMessage(data.messages[0]);
		chatArea.appendChild(staffMessage1);
		await typeWriter(staffMessage1.querySelector('.staff_comment p'), data.messages[0]);
		
		await new Promise(resolve => setTimeout(resolve, 1000));
		
		// 첫 번째 고객 메시지
		const customerMessage1 = createCustomerMessage(data.messages[1]);
		chatArea.appendChild(customerMessage1);
		await typeWriter(customerMessage1.querySelector('.customer_comment p'), data.messages[1]);
		
		await new Promise(resolve => setTimeout(resolve, 1000));
		
		// 두 번째 AI 메시지
		const staffMessage2 = createStaffMessage(data.messages[2]);
		chatArea.appendChild(staffMessage2);
		await typeWriter(staffMessage2.querySelector('.staff_comment p'), data.messages[2]);
		
		await new Promise(resolve => setTimeout(resolve, 1000));
		
		// 두 번째 고객 메시지 (포커싱 대상)
		const customerMessage2 = createCustomerMessage(data.messages[3]);
		chatArea.appendChild(customerMessage2);
		await typeWriter(customerMessage2.querySelector('.customer_comment p'), data.messages[3]);
		
		// focusing 클래스 추가
		customerMessage2.querySelector('.customer_comment').classList.add('focusing');
		
		// 질문선택하기 버튼 추가
		const chooseButton = document.createElement('button');
		chooseButton.className = 'btn_red btn_choose';
		chooseButton.innerHTML = `
			<span class="pic"><img src="${window.STATIC_URLS.arrow_icon}" alt="왼쪽 화살표"></span>
			질문 선택하기
		`;
		
		// 버튼 클릭 이벤트 수정
		chooseButton.addEventListener('click', function() {
			const text = customerMessage2.querySelector('.customer_comment p').textContent;
			document.querySelector('.box_area.customer_focusing .comment').textContent = text;
			
			// 답변생성하기 버튼에 깜빡임 효과 추가
			const answerMakerBtn = document.querySelector('.btn_answerMaker');
			answerMakerBtn.classList.add('focusing');
			
			// 답변하기 버튼의 깜빡임 효과 제거
			const answerBtn = document.querySelector('.btn_answer');
			answerBtn.classList.remove('focusing');
		});
		
		customerMessage2.appendChild(chooseButton);
		
		// 스크롤 최하단으로 이동
		scrollToBottom(chatArea);
		
	} catch (error) {
		console.error('Error:', error);
	}
}

// 메시지 타이핑 효과 수정
async function typeWriter(element, text, speed = 10) {
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
			<h3 class="staff_name">지니 상담사</h3>
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
			<h3 class="staff_name">홍길동 고객</h3>
		</div>
		<div class="customer_comment">
			<p>${text}</p>
		</div>
	`;
	return div;
}

// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', function() {
	// main.html 페이지인 경우에만 실행
	const chatArea = document.querySelector('.chat_area');
	if (chatArea) {
		// 기존 채팅 내용 제거
		chatArea.innerHTML = '';
		// 채팅 시작
		streamMessages();
		
		// 고객 메시지 클릭 이벤트
		document.addEventListener('click', function(e) {
			if (e.target.closest('.customer_comment.focusing')) {
				const text = e.target.closest('.customer_comment').querySelector('p').textContent;
				document.querySelector('.box_area.customer_focusing .comment').textContent = text;
				
				// 질문 선택 후 답변생성하기 버튼에 깜빡임 효과 추가
				const answerMakerBtn = document.querySelector('.btn_answerMaker');
				answerMakerBtn.classList.add('focusing');
			}
			// 기존 고객 메시지의 포커싱 제거
			const existingCustomerComments = document.querySelectorAll('.customer_comment');
			existingCustomerComments.forEach(comment => {
			comment.classList.remove('focusing'); // 포커싱 클래스 제거
			});
		});
		
		// 전역 변수로 답변 생성 상태 추가
		let isGeneratingAnswer = false;
		
		// 답변 생성하기 버튼 클릭 이벤트
		const answerMakerBtn = document.querySelector('.btn_answerMaker');
		if (answerMakerBtn) {
			answerMakerBtn.addEventListener('click', async function() {
				try {
					// 답변 생성 중인 경우 처리
					if (isGeneratingAnswer) {
						showAlert('답변 생성중입니다');
						return;
					}

					// 고객 질문 선택 여부 확인
					const customerQuestion = document.querySelector('.box_area.customer_focusing .comment').textContent;
					if (!customerQuestion.trim()) {
						showAlert('고객 질문을 선택해주세요');
						return;
					}

					// 답변 생성 상태 설정
					isGeneratingAnswer = true;
					
					// 상담 종료 상태 체크
					const finishBtn = document.querySelector('.btn_finish');
					if (finishBtn.classList.contains('focusing') || finishBtn.disabled) {
						return;
					}

					// 로딩 상태 표시
					const answer1Element = document.querySelector('#tab_ai_1');
					const answer2Element = document.querySelector('#tab_ai_2');
					
					answer1Element.textContent = '';
					answer2Element.textContent = '';
					
					// 로딩 애니메이션
					const loadingText = '답변 생성 중';
					let dots = '';
					const loadingInterval = setInterval(() => {
						dots = dots.length < 3 ? dots + '.' : '';
						answer1Element.textContent = loadingText + dots;
						answer2Element.textContent = loadingText + dots;
					}, 500);
					
					// 서버에서 답변 가져오기
					const response = await fetch('/api/get_answers');
					const data = await response.json();
					
					// 로딩 애니메이션 중지
					clearInterval(loadingInterval);
					
					// 서버에서 받은 답변 데이터의 줄바꿈 정규화
					data.answer1 = data.answer1.replace(/\n\s*\n/g, '\n');
					data.answer2 = data.answer2.replace(/\n\s*\n/g, '\n');
					
					// 답변 1 스트리밍 효과
					answer1Element.textContent = '';
					await typeWriter(answer1Element, data.answer1);
					
					// 답변 2는 바로 표시
					answer2Element.textContent = data.answer2;
					
					// 깜빡임 효과 전환
					answerMakerBtn.classList.remove('focusing');
					const answerBtn = document.querySelector('.btn_answer');
					answerBtn.classList.add('focusing');
					
					// 추천 지식 버튼 보이기
					const knowledgeButtons = document.querySelectorAll('.btn_knowledge');
					knowledgeButtons.forEach(button => {
						button.style.display = 'inline-block';
					});
					
					// 답변 생성 완료 후 상태 초기화
					isGeneratingAnswer = false;
					
				} catch (error) {
					console.error('Error:', error);
					// 에러 발생 시에도 상태 초기화
					isGeneratingAnswer = false;
				}
			});
		}

		// 답변하기 버튼 클릭 이벤트
		const answerBtn = document.querySelector('.btn_answer');
		if (answerBtn) {
			answerBtn.addEventListener('click', async function() {
				try {
					// 답변 생성 중인지 확인
					if (isGeneratingAnswer) {
						showAlert('답변 생성중입니다');
						return;
					}

					// 버튼 비활성화 추가
					this.disabled = true;
					this.style.opacity = '0.5';
					this.style.cursor = 'default';
					
					// 답변 생성 여부 확인
					const selectedTab = document.querySelector('.tab_menu .list li.active a').getAttribute('href');
					const selectedAnswer = document.querySelector(selectedTab);
					
					if (!selectedAnswer || !selectedAnswer.textContent.trim()) {
						showAlert('답변을 생성해주세요');
						// 버튼 상태 복구
						this.disabled = false;
						this.style.opacity = '1';
						this.style.cursor = 'pointer';
						return;
					}
					
					// 상담 종료 상태 체크
					const finishBtn = document.querySelector('.btn_finish');
					if (finishBtn.classList.contains('focusing') || finishBtn.disabled) {
						return;
					}
					
					// 질문선택하기 버튼 제거
					const chooseButton = document.querySelector('.btn_choose');
					if (chooseButton) {
						chooseButton.remove();
					}
					
					const chatArea = document.querySelector('.chat_area');
					
					// 슬라이드 애니메이션 적용
					selectedAnswer.classList.add('slide-animation');
					
					// 애니메이션 완료 후 채팅 추가
					await new Promise(resolve => setTimeout(resolve, 500));
					
					// AI 답변 추가
					const staffMessage = createStaffMessage(selectedAnswer.textContent);
					chatArea.appendChild(staffMessage);
					await typeWriter(staffMessage.querySelector('.staff_comment p'), selectedAnswer.textContent);
					scrollToBottom(chatArea);
					
					// 깜빡임 효과 전환
					this.classList.remove('focusing');
					const answerMakerBtn = document.querySelector('.btn_answerMaker');
					answerMakerBtn.classList.remove('focusing');
					
					await new Promise(resolve => setTimeout(resolve, 1000));
					
					// 고객 응답
					const customerMessage = createCustomerMessage("Yes, please change my plan to the \"5G Slim\" plan.");
					chatArea.appendChild(customerMessage);
					await typeWriter(customerMessage.querySelector('.customer_comment p'), "Yes, please change my plan to the \"5G Slim\" plan.");
					scrollToBottom(chatArea);
					
					await new Promise(resolve => setTimeout(resolve, 1000));
					
					// AI 확인 메시지
					const confirmMessage = createStaffMessage("Understood. The change to the \"5G Slim\" plan at 55,000 KRW (37 EUR) has been completed. Is there anything else I can assist you with?");
					chatArea.appendChild(confirmMessage);
					await typeWriter(confirmMessage.querySelector('.staff_comment p'), "Understood. The change to the \"5G Slim\" plan at 55,000 KRW (37 EUR) has been completed. Is there anything else I can assist you with?");
					scrollToBottom(chatArea);
					
					await new Promise(resolve => setTimeout(resolve, 1000));
					
					// 고객 마지막 응답
					const finalCustomerMessage = createCustomerMessage("No, there isn't anything else.");
					chatArea.appendChild(finalCustomerMessage);
					await typeWriter(finalCustomerMessage.querySelector('.customer_comment p'), "No, there isn't anything else.");
					scrollToBottom(chatArea);
					
					await new Promise(resolve => setTimeout(resolve, 1000));
					
					// AI 마지막 메시지
					const finalStaffMessage = createStaffMessage("Yes, thank you. This was AI GENIE from KT. Have a great day!");
					chatArea.appendChild(finalStaffMessage);
					await typeWriter(finalStaffMessage.querySelector('.staff_comment p'), "Yes, thank you. This was AI GENIE from KT. Have a great day!");
					scrollToBottom(chatArea);
					
					// 상담 종료 버튼에 깜빡임 효과 추가
					finishBtn.classList.add('focusing');
					
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
					showAlert('현재 고객과 통화중이므로 종료할 수 없습니다');
					return;
				}
				
				// 깜빡임 효과 제거
				this.classList.remove('focusing');
				// 버튼 비활성화 표시
				this.disabled = true;
				
				const summaryWrap = document.querySelector('.summary_wrap');
				const boxArea = summaryWrap.querySelector('.box_area');
				
				// 로딩 오버레이 생성
				const overlay = document.createElement('div');
				overlay.className = 'loading-overlay';
				overlay.innerHTML = '<div class="loading-spinner"></div>';
				boxArea.style.position = 'relative';
				boxArea.appendChild(overlay);
				
				// 2초 대기
				await new Promise(resolve => setTimeout(resolve, 2000));
				
				const summaryArea = summaryWrap.querySelector('.context');
				// 시뮬레이션 시작 시간 가져오기 (페이지 로드 시 저장된 시간)
				const startTime = window.chatStartTime;
				const endTime = new Date();
				const timeDiff = Math.floor((endTime - startTime) / 1000); // 초 단위
				
				// 시간 포맷팅 (분:초)
				const minutes = Math.floor(timeDiff / 60);
				const seconds = timeDiff % 60;
				const consultationTime = `${minutes}m ${seconds}s`;
				
				// 채팅 내용 수집
				const chatMessages = [];
				document.querySelectorAll('.chat_area > div').forEach(msg => {
					const messageText = msg.querySelector('p').textContent;
					if (messageText) {
						chatMessages.push(messageText);
					}
				});
				
				// 채팅 요약본 생성
				const summaryContent = `Customer inquired about changing their mobile plan. After reviewing available options, they chose the 5G Slim plan (55,000 KRW/37 EUR) which includes unlimited calls/texts and 14GB data. The plan change was successfully processed.`;
				
				summaryArea.innerHTML = `
					<h3>대화록 요약</h3>
					<ul>
						<li>
							<p class="label"><strong>상담시간</strong></p>
							<p>${consultationTime}</p>
						</li>
						<li>
							<p class="label"><strong>상담분류</strong></p>
							<p>Mobile Plan</p>
						</li>
						<li>
							<p class="label"><strong>문의내용</strong></p>
							<p>Change of Plan</p>
						</li>
						<li>
							<p class="label"><strong>대화록 요약</strong></p>
							<p>${summaryContent}</p>
						</li>
					</ul>
				`;
				
				// 로딩 오버레이 제거
				overlay.remove();
				
				// 답변생성하기와 답변하기 버튼 완전 비활성화
				const answerMakerBtn = document.querySelector('.btn_answerMaker');
				const answerBtn = document.querySelector('.btn_answer');
				
				// 버튼 비활성화 및 스타일 적용
				[answerMakerBtn, answerBtn].forEach(btn => {
					btn.disabled = true;
					btn.style.opacity = '0.5';
					btn.style.cursor = 'default';
					btn.classList.remove('focusing');
				});
				
				// 대화록 요약이 표시된 후 3초 대기
				await new Promise(resolve => setTimeout(resolve, 3000));
				
				// 저장 버튼에 깜빡임 효과 추가
				const saveBtn = document.querySelector('.history_wrap .btn_red');
				saveBtn.classList.add('focusing');
			});
		}

		// 페이지 로드 시 시작 시간 저장
		window.chatStartTime = new Date(); // 채팅 시작 시간 저장
	}

	// 히스토리 항목 클릭 이벤트
	const historyItems = document.querySelectorAll('.history_wrap .context li');
	const historyPopup = document.querySelector('.history_popup');
	
	historyItems.forEach(item => {
		item.addEventListener('click', function() {
			if (this.querySelector('.num').textContent === '003') {
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
						<p class="label"><strong>상담시간</strong></p>
						<p>${summaryContent.time}</p>
					</li>
					<li>
						<p class="label"><strong>상담분류</strong></p>
						<p>${summaryContent.category}</p>
					</li>
					<li>
						<p class="label"><strong>문의내용</strong></p>
						<p>${summaryContent.inquiry}</p>
					</li>
					<li>
						<p class="label"><strong>대화록 요약</strong></p>
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
		saveBtn.addEventListener('click', function() {
			// 상담 종료 여부 확인
			const finishBtn = document.querySelector('.btn_finish');
			if (!finishBtn.disabled) {
				showAlert('상담이 종료되지 않았습니다');
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
				<p class="num">003</p>
				<p class="tit">요금제 문의</p>
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
						<p class="label"><strong>상담시간</strong></p>
						<p>${summaryContent.time}</p>
					</li>
					<li>
						<p class="label"><strong>상담분류</strong></p>
						<p>${summaryContent.category}</p>
					</li>
					<li>
						<p class="label"><strong>문의내용</strong></p>
						<p>${summaryContent.inquiry}</p>
					</li>
					<li>
						<p class="label"><strong>대화록 요약</strong></p>
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
	// select 요소들에 이벤트 리스너 추가
	const selects = optionsGptArea.querySelectorAll('select');
	selects.forEach(select => {
		select.addEventListener('mousedown', function(e) {
			e.preventDefault();
			showAlert('관리자 권한이 없습니다');
		});
		
		// 키보드 입력 방지
		select.addEventListener('keydown', function(e) {
			e.preventDefault();
			showAlert('관리자 권한이 없습니다');
		});
	});
	
	// input 요소들에 이벤트 리스너 추가
	const inputs = optionsGptArea.querySelectorAll('input');
	inputs.forEach(input => {
		input.addEventListener('mousedown', function(e) {
			e.preventDefault();
			showAlert('관리자 권한이 없습니다');
		});
		
		// 키보드 입력 방지
		input.addEventListener('keydown', function(e) {
			e.preventDefault();
			showAlert('관리자 권한이 없습니다');
		});
	});
	
	// 게이지(range) 요소들에 이벤트 리스너 추가
	const rangeInputs = optionsGptArea.querySelectorAll('input[type="range"]');
	rangeInputs.forEach(range => {
		// 마우스 이벤트
		range.addEventListener('mousedown', function(e) {
			e.preventDefault();
			showAlert('관리자 권한이 없습니다');
		});
		
		// 터치 이벤트
		range.addEventListener('touchstart', function(e) {
			e.preventDefault();
			showAlert('관리자 권한이 없습니다');
		});
		
		// 키보드 이벤트
		range.addEventListener('keydown', function(e) {
			e.preventDefault();
			showAlert('관리자 권한이 없습니다');
		});
		
		// 값 변경 시도 방지
		range.addEventListener('input', function(e) {
			e.preventDefault();
			// 원래 값으로 복원
			this.value = this.defaultValue;
			showAlert('관리자 권한이 없습니다');
		});
		
		// 스타일 적용
		range.style.cursor = 'not-allowed';
		range.style.opacity = '0.7';
	});
	
	// groove_parent 요소에 이벤트 리스너 추가
	const grooveParents = optionsGptArea.querySelectorAll('.groove_parent');
	grooveParents.forEach(groove => {
		// 마우스 이벤트
		groove.addEventListener('mousedown', function(e) {
			e.preventDefault();
			showAlert('관리자 권한이 없습니다');
		});
		
		// 터치 이벤트
		groove.addEventListener('touchstart', function(e) {
			e.preventDefault();
			showAlert('관리자 권한이 없습니다');
		});
		
		// 키보드 이벤트
		groove.addEventListener('keydown', function(e) {
			e.preventDefault();
			showAlert('관리자 권한이 없습니다');
		});
		
		// 드래그 방지
		groove.addEventListener('dragstart', function(e) {
			e.preventDefault();
			showAlert('관리자 권한이 없습니다');
		});
		
		// 스타일 적용
		groove.style.cursor = 'not-allowed';
		groove.style.opacity = '0.7';
		groove.style.pointerEvents = 'none'; // 클릭/드래그 이벤트 완전 차단
	});

	// readonly 속성 추가 대상에 groove_parent 포함
	[...selects, ...inputs, ...rangeInputs, ...grooveParents].forEach(element => {
		element.setAttribute('readonly', true);
		element.style.cursor = 'not-allowed';
	});
}
