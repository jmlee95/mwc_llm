// 지식팝업 관련 기능
function initKnowledgePopup() {
    const popupCloseBtn = document.querySelector('.popup .btn_close');
    const popup = document.querySelector('.popup');
    //const knowledgeBtn = document.querySelector('.btn_knowledge');
    const knowledgeBtn1 = document.querySelector('#knowledge1');
    const knowledgeBtn2 = document.querySelector('#knowledge2');
    const knowledgeBtn3 = document.querySelector('#knowledge3');

   // 지식 내용 로드 함수
   async function loadKnowledgeContent(filePath, buttonId) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) throw new Error('Network response was not ok');
        const html = await response.text();
        
        // 버튼 ID에 따라 제목과 탭 정보 설정
        let title = '';
        let tabContents = [];
        let contentsList = [];
        
        switch(buttonId) {
            case 'knowledge1':
                title = 'KT Roaming Service';
                tabContents = [
                    { name: 'Guideline', id: 'tab1'}
                ];
                contentsList = [
                    'Roaming usage',
                    'Roaming Type',
                    'How to use',
                    'Required documents'
                ];
                break;
        }
        
        // 제목 업데이트
        const titleElement = document.querySelector('.popup_wrap .tit');
        if (titleElement) {
            titleElement.textContent = title;
        }
        
        // 탭 메뉴와 컨텐츠 영역 초기화
        const tabList = document.querySelector('.popup_wrap .tab_menu .list');
        const contArea = document.querySelector('.popup_wrap .tab_menu .cont_area');
        
        if (tabList && contArea) {
            // 탭 메뉴 생성
            tabList.innerHTML = tabContents.map((tab, index) => `
                <li class="${index === 0 ? 'active' : ''}">
                    <a href="#${tab.id}" class="btn">${tab.name}</a>
                </li>
            `).join('');

            // 컨텐츠 영역 생성
            contArea.innerHTML = tabContents.map((tab, index) => `
                <div id="${tab.id}" class="cont" style="display: ${index === 0 ? 'block' : 'none'}">
                    ${index === 0 ? html : ''}
                </div>
            `).join('');
        }
        
        // Contents 목록 업데이트
        const listsElement = document.querySelector('.popup_wrap .lists');
        if (listsElement) {
            listsElement.innerHTML = `
                <h3>Contents</h3>
                <ul>
                    ${contentsList.map(item => `<li>${item}</li>`).join('')}
                </ul>
            `;
        }
        
        // 탭 클릭 이벤트 재설정
        const tabButtons = document.querySelectorAll('.popup_wrap .tab_menu .list li .btn');
        tabButtons.forEach(button => {
            button.addEventListener('click', async function(e) {
                e.preventDefault();
                
                // 모든 탭 비활성화
                tabButtons.forEach(btn => btn.parentNode.classList.remove('active'));
                // 현재 탭 활성화
                this.parentNode.classList.add('active');

                // 모든 컨텐츠 숨기기
                const allContents = document.querySelectorAll('.popup_wrap .tab_menu .cont_area .cont');
                allContents.forEach(cont => cont.style.display = 'none');

                // 선택된 컨텐츠 표시
                const targetId = this.getAttribute('href');
                const targetContent = document.querySelector(targetId);
                if (targetContent) {
                    targetContent.style.display = 'block';

                    // 컨텐츠 로드
                    const tabId = targetId.replace('#tab', '');
                    let contentPath = '';

                    if (buttonId === 'knowledge1') {
                        switch(tabId) {
                            case '1':
                                contentPath = '/knwlgFile/04_roaming/하루종일 로밍 프리미엄 (구 로밍 하루종일ON 프리미엄) ver.2 [24.07.16]`.html';
                                break;
                        }

                        if (contentPath) {
                            try {
                                const response = await fetch(contentPath);
                                if (!response.ok) throw new Error('Network response was not ok');
                                const content = await response.text();
                                targetContent.innerHTML = content;
                            } catch (error) {
                                console.error('Error loading tab content:', error);
                                targetContent.innerHTML = 'An error occurred while retrieving the content.';
                            }
                        }
                    }
                }
            });
        });

        // 기타 초기화 함수 호출
        initSearchFunction();
        updateNavigationText();
        initTopButton();

    } catch (error) {
        console.error('Error loading knowledge content:', error);
        document.querySelector('.popup #tab1').innerHTML = 'An error occurred while retrieving the content.';
    }
}

    // 검색 기능 초기화
    function initSearchFunction() {
        const searchInput = document.querySelector('.search_area .search');
        const searchButton = document.querySelector('.search_area .btn_search');

        if (searchInput && searchButton) {
            // 검색 버튼 클릭 이벤트
            searchButton.addEventListener('click', () => performSearch());
            
            // Enter 키 이벤트
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    performSearch();
                }
            });
        }
    }

    // 검색 실행 함수
    function performSearch() {
        const searchInput = document.querySelector('.search_area .search');
        const searchText = searchInput.value.trim().toLowerCase();
        const content = document.querySelector('.popup #tab1');

        if (!searchText) return;

        // 이전 하이라이트 제거
        removeHighlights(content);

        const textNodes = [];
        findTextNodes(content, textNodes);

        let firstMatch = null;

        textNodes.forEach(node => {
            const text = node.textContent.toLowerCase();
            if (text.includes(searchText)) {
                const highlightedNode = highlightText(node, searchText);
                if (!firstMatch) firstMatch = highlightedNode;
            }
        });

        // 첫 번째 매칭된 요소로 스크롤
        if (firstMatch) {
            firstMatch.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }
    }

    // 텍스트 노드 찾기
    function findTextNodes(node, textNodes) {
        if (node.nodeType === Node.TEXT_NODE) {
            const text = node.textContent.trim();
            if (text) textNodes.push(node);
        } else {
            node.childNodes.forEach(child => findTextNodes(child, textNodes));
        }
    }

    // 텍스트 하이라이트
    function highlightText(node, searchText) {
        const text = node.textContent;
        const parent = node.parentNode;
        const wrapper = document.createElement('span');
        
        const parts = text.split(new RegExp(`(${searchText})`, 'gi'));
        parts.forEach(part => {
            if (part.toLowerCase() === searchText.toLowerCase()) {
                const highlight = document.createElement('span');
                highlight.className = 'search-highlight';
                highlight.style.backgroundColor = '#ffeb3b';
                highlight.textContent = part;
                wrapper.appendChild(highlight);
            } else {
                wrapper.appendChild(document.createTextNode(part));
            }
        });
        
        parent.replaceChild(wrapper, node);
        return wrapper.querySelector('.search-highlight');
    }

    // 하이라이트 제거
    function removeHighlights(container) {
        const highlights = container.querySelectorAll('.search-highlight');
        highlights.forEach(highlight => {
            const parent = highlight.parentNode;
            const text = document.createTextNode(highlight.textContent);
            parent.replaceChild(text, highlight);
        });
    }

    // 네비게이션 텍스트 업데이트 함수
    function updateNavigationText() {
        const naviLinks = document.querySelectorAll('.navi_link');
        if (!naviLinks || naviLinks.length < 2) return;

        // 현재 활성화된 버튼의 ID 가져오기
        const activeButton = document.querySelector('.btn_scenario.active');
        if (!activeButton) return;

        const buttonId = activeButton.id;
        let navigationText = '';

        switch (buttonId) {
            case 'ic_change':
                navigationText = 'Change Mobile Plan';
                break;
            case 'ic_combine':
                navigationText = 'Combine Service';
                break;
            case 'ic_membership':
                navigationText = 'Membership Benefit';
                break;
            case 'ic_roaming':
                navigationText = 'Roaming Service';
                break;
            default:
                navigationText = 'Internet';
        }

        // 첫 번째 네비게이션 링크의 텍스트 업데이트 (홈 아이콘 유지)
        const firstNaviLink = naviLinks[0].querySelector('a');
        firstNaviLink.innerHTML = `<span class="ic_home"><img src="/static/images/ic_home_knwlg.png" alt="홈으로"></span> ${navigationText}`;

        // 두 번째 네비게이션 링크는 'Product(Plan)'으로 고정
        naviLinks[1].querySelector('a').textContent = 'Product(Plan)';
    }

    // 시나리오 버튼 클릭 이벤트 추가
    function initScenarioButtons() {
        const scenarioButtons = document.querySelectorAll('.btn_scenario');
        scenarioButtons.forEach(button => {
            button.addEventListener('click', function() {
                // 기존 활성화된 버튼의 클래스 제거
                document.querySelector('.btn_scenario.active')?.classList.remove('active');
                // 클릭된 버튼 활성화
                this.classList.add('active');
                // 네비게이션 텍스트 업데이트
                updateNavigationText();
            });
        });
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
            
            // 5G 슬림 요금제 영문 내용 로드
            const filePath = '/knwlgFile/04_roaming/하루종일 로밍 프리미엄 (구 로밍 하루종일ON 프리미엄) ver.2 [24.07.16]`.html';
            loadKnowledgeContent(filePath, 'knowledge1');
        });
    }

    // // 두 번째 추천지식 버튼 클릭 이벤트
    // if (knowledgeBtn2) {
    //     knowledgeBtn2.addEventListener('click', function (e) {
    //         e.preventDefault();
    //         popup.classList.add('active');
            
    //         // 5G 슬림 요금제 영문 버전 내용 로드
    //         const filePath = '/knwlgFile/01_mobile_plan/5G 요금제 총정리(25.01.24 기준) ver.1 [25.01.24]`_eng.html';
    //         loadKnowledgeContent(filePath);
    //     });
    // }

    // // 세 번째 추천지식 버튼 클릭 이벤트
    // if (knowledgeBtn3) {
    //     knowledgeBtn3.addEventListener('click', function (e) {
    //         e.preventDefault();
    //         popup.classList.add('active');
            
    //         // 5G 요금제 총정리 내용 로드
    //         const filePath = '/knwlgFile/01_mobile_plan/5G 요금제 총정리(25.01.24 기준) ver.1 [25.01.24]`_eng.html';
    //         loadKnowledgeContent(filePath);
    //     });
    // }

    // // 팝업 내 탭 기능
    // const tabListPopup = document.querySelectorAll('.popup_wrap .tab_menu .list li');
    // const contentsPopup = document.querySelectorAll('.popup_wrap .tab_menu .cont_area .cont');
    
    // if (tabListPopup.length > 0 && contentsPopup.length > 0) {
    //     for (let i = 0; i < tabListPopup.length; i++) {
    //         tabListPopup[i].querySelector('.btn').addEventListener('click', async function (e) {
    //             e.preventDefault();
                
    //             // 모든 탭과 컨텐츠 비활성화
    //             for (let j = 0; j < tabListPopup.length; j++) {
    //                 tabListPopup[j].classList.remove('active');
    //                 contentsPopup[j].style.display = 'none';
    //             }
                
    //             // 클릭된 탭 활성화
    //             this.parentNode.classList.add('active');
    //             const activeCont = this.getAttribute('href');
    //             document.querySelector(activeCont).style.display = 'block';
                
    //             // 탭에 따른 문서 로드
    //             const tabId = activeCont.replace('#tab', '');
    //             let filePath = '';
                
    //             switch(tabId) {
    //                 case '1':
    //                     filePath = '/knwlgFile/04_roaming/하루종일 로밍 프리미엄 (구 로밍 하루종일ON 프리미엄) ver.2 [24.07.16]`.html';
    //                     break;
    //                 case '2':
    //                     filePath = '/knwlgFile/01_mobile_plan/5G 슬림 요금제_FAQ_eng.html';
    //                     break;
    //                 case '3':
    //                     filePath = '/knwlgFile/01_mobile_plan/5G 슬림 요금제_이벤트_eng.html';
    //                     break;
    //             }
                
    //             if (filePath) {
    //                 try {
    //                     const response = await fetch(filePath);
    //                     if (!response.ok) throw new Error('Network response was not ok');
    //                     const html = await response.text();
                        
    //                     // 해당 탭의 컨텐츠 영역에 HTML 삽입
    //                     const tabContent = document.querySelector(activeCont);
    //                     if (tabContent) {
    //                         tabContent.innerHTML = html;
    //                         // 검색 기능 초기화
    //                         initSearchFunction();
    //                         // 네비게이션 텍스트 업데이트
    //                         updateNavigationText();
    //                         // TOP 버튼 이벤트 초기화
    //                         initTopButton();
    //                     }
    //                 } catch (error) {
    //                     console.error('Error loading content:', error);
    //                     document.querySelector(activeCont).innerHTML = 'An error occurred while retrieving the content.';
    //                 }
    //             }
    //         });
    //     }
    // }

    // TOP 버튼 초기화 함수
    function initTopButton() {
        const btnTop = document.querySelector('#btn_top');
        if (btnTop) {
            btnTop.addEventListener('click', function() {
                // tab1 컨텐츠의 첫 번째 요소를 찾아서 스크롤
                const tabContent = document.querySelector('.popup #tab1');
                if (tabContent && tabContent.firstElementChild) {
                    tabContent.firstElementChild.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        }
    }
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    initKnowledgePopup();
    initScenarioButtons();
    initTopButton();
});
