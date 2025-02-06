// 지식팝업 관련 기능
function initKnowledgePopup() {
    const popupCloseBtn = document.querySelector('.popup .btn_close');
    const popup = document.querySelector('.popup');
    //const knowledgeBtn = document.querySelector('.btn_knowledge');
    const knowledgeBtn1 = document.querySelector('#knowledge1');
    const knowledgeBtn2 = document.querySelector('#knowledge2');
    const knowledgeBtn3 = document.querySelector('#knowledge3');

    // 지식 내용 로드 함수
    async function loadKnowledgeContent(filePath) {
        try {
            const response = await fetch(filePath);
            if (!response.ok) throw new Error('Network response was not ok');
            const html = await response.text();
            
            // 특정 탭에 전체 HTML 내용을 삽입
            const tabContent = document.querySelector('.popup #tab1');
            if (tabContent) {
                tabContent.innerHTML = html;
            }
            
        } catch (error) {
            console.error('Error loading knowledge content:', error);
            // 에러 발생 시 기본 내용 표시
            document.querySelector('.popup #tab1').innerHTML = '내용을 불러오는 중 오류가 발생했습니다.';
        }
    }

    // 기본 지식버튼 클릭 이벤트
    if (knowledgeBtn) {
        knowledgeBtn.addEventListener('click', function (e) {
            e.preventDefault();
            popup.classList.add('active');
        });
    }

    // 팝업 닫기 버튼 이벤트
    if (popupCloseBtn) {
        popupCloseBtn.addEventListener('click', function (e) {
            e.preventDefault();
            popup.classList.remove('active');
        });
    }

    // 첫 번째 추천지식 버튼 클릭 이벤트
    if (knowledgeBtn1) {
        knowledgeBtn1.addEventListener('click', function (e) {
            e.preventDefault();
            popup.classList.add('active');
            
            // 5G 슬림 요금제 내용 로드
            const filePath = '/knwlgFile/5G 슬림 요금제 ver.7/5G 슬림 요금제 ver.7.html';
            loadKnowledgeContent(filePath);
        });
    }

    // 두 번째 추천지식 버튼 클릭 이벤트
    if (knowledgeBtn2) {
        knowledgeBtn2.addEventListener('click', function (e) {
            e.preventDefault();
            popup.classList.add('active');
            
            // 5G 슬림 요금제 영문 버전 내용 로드
            const filePath = '/knwlgFile/5G 슬림 요금제 ver.7/5G 슬림 요금제 ver.7 [24.03.22]`_eng.html';
            loadKnowledgeContent(filePath);
        });
    }

    // 세 번째 추천지식 버튼 클릭 이벤트
    if (knowledgeBtn3) {
        knowledgeBtn3.addEventListener('click', function (e) {
            e.preventDefault();
            popup.classList.add('active');
            
            // 5G 요금제 총정리 내용 로드
            const filePath = '/knwlgFile/5G 요금제 총정리(25.01.24 기준)/5G 요금제 총정리(25.01.24 기준) ver.1 [25.01.24]`_eng.html';
            loadKnowledgeContent(filePath);
        });
    }

    // 팝업 내 탭 기능
    const tabListPopup = document.querySelectorAll('.popup_wrap .tab_menu .list li');
    const contentsPopup = document.querySelectorAll('.popup_wrap .tab_menu .cont_area .cont');
    
    if (tabListPopup.length > 0 && contentsPopup.length > 0) {
        for (let i = 0; i < tabListPopup.length; i++) {
            tabListPopup[i].querySelector('.btn').addEventListener('click', function (e) {
                e.preventDefault();
                for (let j = 0; j < tabListPopup.length; j++) {
                    tabListPopup[j].classList.remove('active');
                    contentsPopup[j].style.display = 'none';
                }
                this.parentNode.classList.add('active');
                const activeCont = this.getAttribute('href');
                document.querySelector(activeCont).style.display = 'block';
            });
        }
    }
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    initKnowledgePopup();
});
