//======= 탭
let activeCont = ''; // 현재 활성화 된 컨텐츠 (기본:#tab1 활성화)

function tab(tablist, contents) {
	for (var i = 0; i < tablist.length; i++) {
		tablist[i].querySelector('.btn').addEventListener('click', function (e) {
			e.preventDefault();
			for (var j = 0; j < tablist.length; j++) {
				// 나머지 버튼 클래스 제거
				tablist[j].classList.remove('active');

				// 나머지 컨텐츠 display:none 처리
				contents[j].style.display = 'none';
			}

			// 버튼 관련 이벤트
			this.parentNode.classList.add('active');

			// 버튼 클릭시 컨텐츠 전환
			activeCont = this.getAttribute('href');
			document.querySelector(activeCont).style.display = 'block';
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

knowledgeBtn.addEventListener('click', function (e) {
	e.preventDefault();
	popup.classList.add('active');
});
popupCloseBtn.addEventListener('click', function (e) {
	e.preventDefault();
	popup.classList.remove('active');
});

// 채팅 메시지 스트리밍 함수
async function streamMessages() {
	try {
		const response = await fetch('/api/stream_message');
		const data = await response.json();
		const chatArea = document.querySelector('.chat_area');
		
		// AI 메시지
		const staffMessage = createStaffMessage(data.messages[0]);
		chatArea.appendChild(staffMessage);
		await typeWriter(staffMessage.querySelector('.staff_comment p'), data.messages[0]);
		
		// 잠시 대기
		await new Promise(resolve => setTimeout(resolve, 1000));
		
		// 고객 메시지
		const customerMessage = createCustomerMessage(data.messages[1]);
		chatArea.appendChild(customerMessage);
		await typeWriter(customerMessage.querySelector('.customer_comment p'), data.messages[1]);
		
		// focusing 클래스 추가
		customerMessage.querySelector('.customer_comment').classList.add('focusing');
	} catch (error) {
		console.error('Error:', error);
	}
}

// 메시지 타이핑 효과
async function typeWriter(element, text, speed = 50) {
	for (let i = 0; i < text.length; i++) {
		element.textContent = text.substring(0, i + 1);
		await new Promise(resolve => setTimeout(resolve, speed));
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
			}
		});
		
		// 답변 생성하기 버튼 클릭 이벤트
		const answerMakerBtn = document.querySelector('.btn_answerMaker');
		if (answerMakerBtn) {
			answerMakerBtn.addEventListener('click', async function() {
				try {
					// 기존 고객 메시지의 포커싱 제거
					const existingCustomerComments = document.querySelectorAll('.customer_comment');
					existingCustomerComments.forEach(comment => {
						comment.classList.remove('focusing'); // 포커싱 클래스 제거
					});

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
					
					// 답변 1 스트리밍 효과
					answer1Element.textContent = '';
					await typeWriter(answer1Element, data.answer1);
					
					// 답변 2는 바로 표시
					answer2Element.textContent = data.answer2;
					
					// 답변하기 버튼 표시
					const answerBtn = document.querySelector('.btn_answer');
					answerBtn.style.display = 'inline-block';
					
					// 추천 지식 버튼 보이기
					const knowledgeButtons = document.querySelectorAll('.btn_knowledge');
					knowledgeButtons.forEach(button => {
						button.style.display = 'inline-block'; // 버튼 보이기
					});
					
				} catch (error) {
					console.error('Error:', error);
				}
			});
		}

		// 답변하기 버튼 클릭 이벤트 추가
		const answerBtn = document.querySelector('.btn_answer');
		if (answerBtn) {
			answerBtn.addEventListener('click', async function() {
				try {
					const selectedTab = document.querySelector('.tab_menu .list li.active a').getAttribute('href');
					const selectedAnswer = document.querySelector(selectedTab).textContent;
					
					// 채팅 영역에 AI 답변 추가
					const chatArea = document.querySelector('.chat_area');
					const staffMessage = createStaffMessage(selectedAnswer);
					chatArea.appendChild(staffMessage);
					await typeWriter(staffMessage.querySelector('.staff_comment p'), selectedAnswer);
					
					// 고객의 추가 대화
					const customerMessage = createCustomerMessage("네 그럼 그 요금제로 변경해주세요 감사합니다.");
					chatArea.appendChild(customerMessage);
					await typeWriter(customerMessage.querySelector('.customer_comment p'), "네 그럼 그 요금제로 변경해주세요 감사합니다.");
					
					// 기존 고객 메시지의 포커싱 제거
					const existingCustomerComments = document.querySelectorAll('.customer_comment');
					existingCustomerComments.forEach(comment => {
						comment.classList.remove('focusing'); // 포커싱 클래스 제거
					});
					
					// 답변하기 버튼 숨기기
					answerBtn.style.display = 'none';
					
				} catch (error) {
					console.error('Error:', error);
				}
			});
		}

		// 상담 종료 버튼 클릭 이벤트 추가
		const finishBtn = document.querySelector('.btn_finish');
		if (finishBtn) {
			finishBtn.addEventListener('click', function() {
				const summaryArea = document.querySelector('.summary_wrap .context');
				const consultationTime = "1분 31초"; // 실제 시뮬레이션 타임
				const consultationType = "모바일"; // 상담 분류
				const inquiryContent = "휴대폰 요금제 변경"; // 고객 문의 내용
				const summaryContent = "상담이 원활하게 진행되었습니다."; // 대화록 요약 내용
				
				summaryArea.innerHTML = `
					<h3>대화록 요약</h3>
					<ul>
						<li><strong>상담시간:</strong> ${consultationTime}</li>
						<li><strong>상담 분류:</strong> ${consultationType}</li>
						<li><strong>문의 내용:</strong> ${inquiryContent}</li>
						<li><strong>대화록 요약:</strong> ${summaryContent}</li>
					</ul>
				`;
			});
		}
	}
});
