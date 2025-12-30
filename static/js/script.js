// 구글 시트 웹 앱 URL (Apps Script 배포 후 여기에 URL을 입력하세요)
// 사용자 스프레드시트: https://docs.google.com/spreadsheets/d/1U-B4Qi4_kE59JEeKcInSOtGOX93kHyQIRXC4SnolxSk/edit?usp=sharing
const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbxlPccJcx7WF7mZ_6hTmyXqEpq1l4VGWcitnL86hRuGZMUbcEgrupJZ7gR2kkKNNTHw/exec';

// 슬라이더 관련 변수
let currentSlide = 0;
const slides = document.getElementById('slides');
let totalSlides = 0;
const slideWidth = 330; // slide width + margin

// 수료증 슬라이더 변수
let currentCertificate = 0;
const certificateSlides = document.getElementById('certificateSlides');
let totalCertificates = 1; // 실제 슬라이드 개수
const certificateWidth = 400; // certificate width + gap
let isTransitioning = false;

// DOM이 로드된 후 실행
document.addEventListener('DOMContentLoaded', function() {
    // 슬라이드 초기화
    initializeSlider();
    
    // 수료증 슬라이더 초기화
    initializeCertificateSlider();
    
    // 폼 이벤트 리스너 등록
    initializeForm();
    
    // 스크롤 애니메이션 초기화
    initializeScrollAnimations();
    
    // Q&A 초기화
    initializeQA();
    
    // 네비게이션 초기화
    initializeNavigation();
});

// 슬라이더 초기화
function initializeSlider() {
    if (slides) {
        totalSlides = document.querySelectorAll('.slide').length;
        
        // 자동 슬라이드 시작
        setInterval(nextSlide, 4000);
        
        // 터치 이벤트 추가 (모바일 지원)
        let startX = 0;
        let endX = 0;
        
        slides.addEventListener('touchstart', function(e) {
            startX = e.touches[0].clientX;
        });
        
        slides.addEventListener('touchend', function(e) {
            endX = e.changedTouches[0].clientX;
            handleSwipe();
        });
        
        function handleSwipe() {
            const threshold = 50;
            const diff = startX - endX;
            
            if (Math.abs(diff) > threshold) {
                if (diff > 0) {
                    nextSlide();
                } else {
                    previousSlide();
                }
            }
        }
    }
}

// 다음 슬라이드
function nextSlide() {
    if (totalSlides > 0) {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateSlider();
    }
}

// 이전 슬라이드
function previousSlide() {
    if (totalSlides > 0) {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        updateSlider();
    }
}

// 슬라이더 업데이트
function updateSlider() {
    if (slides) {
        const translateX = -currentSlide * slideWidth;
        slides.style.transform = `translateX(${translateX}px)`;
    }
}

// 수료증 슬라이더 초기화
function initializeCertificateSlider() {
    if (certificateSlides && totalCertificates > 1) {
        // 자동 슬라이드 시작 (4초마다) - 슬라이드가 2개 이상일 때만
        setInterval(nextCertificate, 4000);
        
        // 터치 이벤트 추가 (모바일 지원)
        let startX = 0;
        let endX = 0;
        
        certificateSlides.addEventListener('touchstart', function(e) {
            startX = e.touches[0].clientX;
        });
        
        certificateSlides.addEventListener('touchend', function(e) {
            endX = e.changedTouches[0].clientX;
            handleCertificateSwipe();
        });
        
        function handleCertificateSwipe() {
            const threshold = 50;
            const diff = startX - endX;
            
            if (Math.abs(diff) > threshold) {
                if (diff > 0) {
                    nextCertificate();
                } else {
                    previousCertificate();
                }
            }
        }
        
        // 트랜지션 끝날 때 이벤트 리스너
        certificateSlides.addEventListener('transitionend', handleTransitionEnd);
    }
}

// 다음 수료증
function nextCertificate() {
    if (isTransitioning) return;
    
    isTransitioning = true;
    currentCertificate++;
    updateCertificateSlider();
}

// 이전 수료증
function previousCertificate() {
    if (isTransitioning) return;
    
    isTransitioning = true;
    currentCertificate--;
    updateCertificateSlider();
}

// 수료증 슬라이더 업데이트
function updateCertificateSlider() {
    if (certificateSlides) {
        const translateX = -currentCertificate * certificateWidth;
        certificateSlides.style.transform = `translateX(${translateX}px)`;
    }
}

// 트랜지션 완료 후 처리
function handleTransitionEnd() {
    isTransitioning = false;
    
    // 마지막 복제 슬라이드에 도달하면 첫 번째로 즉시 이동
    if (currentCertificate >= totalCertificates) {
        certificateSlides.style.transition = 'none';
        currentCertificate = 0;
        updateCertificateSlider();
        
        // 다음 프레임에서 트랜지션 다시 활성화
        setTimeout(() => {
            certificateSlides.style.transition = 'transform 0.5s ease';
        }, 50);
    }
    
    // 첫 번째 이전으로 가면 마지막으로 즉시 이동
    if (currentCertificate < 0) {
        certificateSlides.style.transition = 'none';
        currentCertificate = totalCertificates - 1;
        updateCertificateSlider();
        
        // 다음 프레임에서 트랜지션 다시 활성화
        setTimeout(() => {
            certificateSlides.style.transition = 'transform 0.5s ease';
        }, 50);
    }
}

// 폼 초기화
function initializeForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
        
        // 입력 필드 애니메이션
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('focus', function() {
                this.parentElement.classList.add('focused');
            });
            
            input.addEventListener('blur', function() {
                if (!this.value) {
                    this.parentElement.classList.remove('focused');
                }
            });
        });
    }
}

// 폼 제출 처리
async function handleFormSubmit(e) {
    e.preventDefault();
    
    const submitBtn = document.querySelector('.submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    
    // 개인정보 동의 확인
    const privacyCheckbox = document.querySelector('input[name="privacy"]');
    if (!privacyCheckbox.checked) {
        showNotification('개인정보 수집 및 이용에 동의해주세요.', 'error');
        return;
    }
    
    // 로딩 상태 시작
    setLoadingState(true, submitBtn, btnText, btnLoading);
    
    try {
        const formData = new FormData(e.target);
        
        // 체크박스 값들을 배열로 수집
        const educationCheckboxes = document.querySelectorAll('input[name="education"]:checked');
        const educationValues = Array.from(educationCheckboxes).map(cb => cb.value).join(', ');
        
        // 구글 Apps Script URL (여기에 배포한 웹 앱 URL을 입력하세요)
        const scriptUrl = 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE';
        
        // 폼 데이터 준비
        const data = new URLSearchParams();
        data.append('company', formData.get('company'));
        data.append('name', formData.get('name'));
        data.append('phone', formData.get('phone'));
        data.append('email', formData.get('email'));
        data.append('education', educationValues);
        data.append('employees', formData.get('employees'));
        data.append('additional', formData.get('additional') || '');
        data.append('privacy', privacyCheckbox.checked ? '동의' : '미동의');
        
        // 구글 스프레드시트로 전송
        const response = await fetch(scriptUrl, {
            method: 'POST',
            body: data
        });
        
        const result = await response.json();
        
        if (result.status === 'success') {
            showNotification('문의가 성공적으로 접수되었습니다! 곧 연락드리겠습니다.', 'success');
            e.target.reset();
        } else {
            showNotification(result.message || '문의 전송 중 오류가 발생했습니다.', 'error');
        }
        
    } catch (error) {
        console.error('Error:', error);
        showNotification('문의 전송 중 오류가 발생했습니다. 다시 시도해주세요.', 'error');
    } finally {
        // 로딩 상태 종료
        setLoadingState(false, submitBtn, btnText, btnLoading);
    }
}

// 로딩 상태 설정
function setLoadingState(isLoading, submitBtn, btnText, btnLoading) {
    if (isLoading) {
        submitBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline';
        submitBtn.style.opacity = '0.7';
    } else {
        submitBtn.disabled = false;
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
        submitBtn.style.opacity = '1';
    }
}

// 알림 표시
function showNotification(message, type = 'info') {
    // 기존 알림 제거
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // 새 알림 생성
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${type === 'success' ? '✅' : '❌'}</span>
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    // 스타일 추가
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        background: ${type === 'success' ? '#4caf50' : '#f44336'};
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        animation: slideInRight 0.3s ease;
        max-width: 400px;
    `;
    
    document.body.appendChild(notification);
    
    // 5초 후 자동 제거
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// 스크롤 애니메이션 초기화
function initializeScrollAnimations() {
    // Intersection Observer를 사용한 스크롤 애니메이션
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // 애니메이션 대상 요소들
    const animateElements = document.querySelectorAll('.section-title, .slide, .certificate-placeholder, .service-placeholder, .partner-placeholder');
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// 구글폼 열기
function openGoogleForm() {
    // 구글폼 URL
    const googleFormUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSdTWGfm5bKJgVsMXxZcXVlqQoy9htzC6_4qMl3izMyq-YPnvw/viewform';
    
    // 새 창에서 구글폼 열기
    window.open(googleFormUrl, '_blank');
}

// Q&A 초기화
function initializeQA() {
    // 모든 Q&A 아이템에 이벤트 리스너 추가
    const qaItems = document.querySelectorAll('.qa-item');
    qaItems.forEach((item, index) => {
        const question = item.querySelector('.qa-question');
        if (question) {
            question.setAttribute('onclick', `toggleAnswer(${index})`);
        }
    });
}

// Q&A 토글 함수
function toggleAnswer(index) {
    const qaItems = document.querySelectorAll('.qa-item');
    const currentItem = qaItems[index];
    const answer = currentItem.querySelector('.qa-answer');
    const icon = currentItem.querySelector('.qa-icon');
    
    // 현재 아이템이 활성화되어 있는지 확인
    const isActive = currentItem.classList.contains('active');
    
    // 모든 아이템 비활성화
    qaItems.forEach(item => {
        item.classList.remove('active');
        const itemAnswer = item.querySelector('.qa-answer');
        const itemIcon = item.querySelector('.qa-icon');
        if (itemAnswer) itemAnswer.classList.remove('active');
        if (itemIcon) itemIcon.textContent = '+';
    });
    
    // 현재 아이템이 비활성화 상태였다면 활성화
    if (!isActive) {
        currentItem.classList.add('active');
        answer.classList.add('active');
        icon.textContent = '−';
    }
}

// 네비게이션 초기화
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    
    // 스크롤 이벤트 리스너
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.pageYOffset >= sectionTop - 100) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
    
    // 부드러운 스크롤 처리
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// 상담 팝업 열기
function openConsultPopup() {
    const popup = document.getElementById('consultPopup');
    const tab = document.getElementById('popupTab');
    if (popup) {
        popup.classList.add('active');
    }
    if (tab) {
        tab.style.display = 'none';
    }
}

// 상담 팝업 닫기
function closeConsultPopup(event) {
    const popup = document.getElementById('consultPopup');
    const tab = document.getElementById('popupTab');
    if (popup) {
        popup.classList.remove('active');
    }
    if (tab) {
        tab.style.display = 'block';
    }
}

// 개인정보 자세히보기 토글
function togglePrivacyDetail() {
    // 팝업 내의 privacyDetail 찾기
    const popup = document.getElementById('consultPopup');
    if (popup) {
        const detail = popup.querySelector('.privacy-detail');
        if (detail) {
            detail.classList.toggle('active');
        }
    }
}

// 상담 폼 제출 처리
async function handleConsultSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const submitBtn = form.querySelector('.popup-submit-btn');
    const submitText = submitBtn.querySelector('.submit-text');
    const submitLoading = submitBtn.querySelector('.submit-loading');
    
    // 개인정보 동의 확인
    const privacyConsent = document.getElementById('privacyConsent');
    if (!privacyConsent.checked) {
        showNotification('개인정보 수집 및 이용에 동의해주세요.', 'error');
        return;
    }
    
    // 로딩 상태
    submitBtn.disabled = true;
    submitText.style.display = 'none';
    submitLoading.style.display = 'inline';
    
    try {
        // 폼 데이터 수집
        const formData = {
            company_name: document.getElementById('companyName').value.trim(),
            contact_number: document.getElementById('contactNumber').value.trim(),
            manager_name: document.getElementById('managerName').value.trim(),
            inquiry_content: document.getElementById('inquiryContent').value.trim() || ''
        };
        
        // 1. 서버 DB에 저장
        const dbResponse = await fetch('/consultation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        const dbResult = await dbResponse.json();
        
        // 2. 구글 시트에도 저장
        if (GOOGLE_SHEET_URL && GOOGLE_SHEET_URL !== 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE') {
            try {
                const sheetData = new URLSearchParams();
                sheetData.append('company_name', formData.company_name);
                sheetData.append('contact_number', formData.contact_number);
                sheetData.append('manager_name', formData.manager_name);
                sheetData.append('inquiry_content', formData.inquiry_content);
                sheetData.append('timestamp', new Date().toLocaleString('ko-KR'));
                
                console.log('구글 시트에 데이터 전송 시도 (팝업):', {
                    url: GOOGLE_SHEET_URL,
                    data: {
                        company_name: formData.company_name,
                        contact_number: formData.contact_number,
                        manager_name: formData.manager_name,
                        inquiry_content: formData.inquiry_content
                    }
                });
                
                await fetch(GOOGLE_SHEET_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    body: sheetData
                });
                
                console.log('구글 시트 저장 완료 (팝업)');
            } catch (sheetError) {
                console.error('구글 시트 저장 실패 (DB에는 저장됨):', sheetError);
            }
        } else {
            console.warn('구글 시트 URL이 설정되지 않았습니다. GOOGLE_SHEET_URL을 확인하세요.');
        }
        
        if (dbResult.status === 'success') {
            showNotification('✅ 상담 문의가 성공적으로 접수되었습니다!\n담당자가 빠른 시일 내에 연락드리겠습니다.', 'success');
            form.reset();
            
            // 2초 후 팝업 닫기
            setTimeout(() => {
                closeConsultPopup();
            }, 2000);
        } else {
            showNotification(dbResult.message || '문의 전송 중 오류가 발생했습니다.', 'error');
        }
        
    } catch (error) {
        console.error('Error:', error);
        showNotification('❌ 문의 전송 중 오류가 발생했습니다.\n잠시 후 다시 시도해주세요.', 'error');
    } finally {
        // 로딩 상태 해제
        submitBtn.disabled = false;
        submitText.style.display = 'inline';
        submitLoading.style.display = 'none';
    }
}

// 전화번호 자동 포맷팅
document.addEventListener('DOMContentLoaded', function() {
    const contactNumberInput = document.getElementById('contactNumber');
    if (contactNumberInput) {
        contactNumberInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/[^0-9]/g, '');
            
            if (value.length <= 3) {
                e.target.value = value;
            } else if (value.length <= 7) {
                e.target.value = value.slice(0, 3) + '-' + value.slice(3);
            } else if (value.length <= 11) {
                e.target.value = value.slice(0, 3) + '-' + value.slice(3, 7) + '-' + value.slice(7);
            } else {
                e.target.value = value.slice(0, 3) + '-' + value.slice(3, 7) + '-' + value.slice(7, 11);
            }
        });
    }
    
    // 하단 신청서 전화번호 자동 포맷팅 (3개 입력 필드)
    const phone1 = document.getElementById('phone1');
    const phone2 = document.getElementById('phone2');
    const phone3 = document.getElementById('phone3');
    
    if (phone1) {
        phone1.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/[^0-9]/g, '');
            if (e.target.value.length >= 3 && phone2) {
                phone2.focus();
            }
        });
    }
    
    if (phone2) {
        phone2.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/[^0-9]/g, '');
            if (e.target.value.length >= 4 && phone3) {
                phone3.focus();
            }
        });
    }
    
    if (phone3) {
        phone3.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/[^0-9]/g, '');
        });
    }
    
    // 맨 아래 상담 폼 이벤트 리스너
    const bottomForm = document.getElementById('bottomConsultForm');
    if (bottomForm) {
        bottomForm.addEventListener('submit', handleBottomConsultSubmit);
    }
    
    // 페이지 로드 시 상담 팝업 자동으로 열기 (데스크톱만)
    if (window.innerWidth > 768) {
        setTimeout(function() {
            openConsultPopup();
        }, 500);
    }
});

// 맨 아래 상담 폼 제출 처리
async function handleBottomConsultSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const submitBtn = form.querySelector('.consult-submit-btn');
    const submitText = submitBtn.querySelector('.submit-text');
    
    // 개인정보 동의 확인
    const privacyConsent = document.getElementById('bottomPrivacyConsent');
    if (!privacyConsent || !privacyConsent.checked) {
        showNotification('개인정보 수집 및 이용에 동의해주세요.', 'error');
        return;
    }
    
    // 전화번호 3개 합치기
    const phone1 = document.getElementById('phone1');
    const phone2 = document.getElementById('phone2');
    const phone3 = document.getElementById('phone3');
    
    if (!phone1 || !phone2 || !phone3) {
        showNotification('연락처를 모두 입력해주세요.', 'error');
        return;
    }
    
    const phone1Value = phone1.value.trim();
    const phone2Value = phone2.value.trim();
    const phone3Value = phone3.value.trim();
    
    if (!phone1Value || !phone2Value || !phone3Value) {
        showNotification('연락처를 모두 입력해주세요.', 'error');
        return;
    }
    
    const fullPhone = `${phone1Value}-${phone2Value}-${phone3Value}`;
    
    // 로딩 상태
    submitBtn.disabled = true;
    submitText.textContent = '전송중...';
    
    try {
        const formData = {
            company_name: form.querySelector('[name="company_name"]').value.trim(),
            contact_number: fullPhone,
            manager_name: form.querySelector('[name="manager_name"]').value.trim(),
            inquiry_content: form.querySelector('[name="inquiry_content"]').value.trim() || ''
        };
        
        // 서버로 전송
        const response = await fetch('/consultation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        const dbResult = await response.json();
        
        // 2. 구글 시트에도 저장
        if (GOOGLE_SHEET_URL && GOOGLE_SHEET_URL !== 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE') {
            try {
                const sheetData = new URLSearchParams();
                sheetData.append('company_name', formData.company_name);
                sheetData.append('contact_number', formData.contact_number);
                sheetData.append('manager_name', formData.manager_name);
                sheetData.append('inquiry_content', formData.inquiry_content);
                sheetData.append('timestamp', new Date().toLocaleString('ko-KR'));
                
                console.log('구글 시트에 데이터 전송 시도 (하단):', {
                    url: GOOGLE_SHEET_URL,
                    data: {
                        company_name: formData.company_name,
                        contact_number: formData.contact_number,
                        manager_name: formData.manager_name,
                        inquiry_content: formData.inquiry_content
                    }
                });
                
                await fetch(GOOGLE_SHEET_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    body: sheetData
                });
                
                console.log('구글 시트 저장 완료 (하단)');
            } catch (sheetError) {
                console.error('구글 시트 저장 실패 (DB에는 저장됨):', sheetError);
            }
        } else {
            console.warn('구글 시트 URL이 설정되지 않았습니다. GOOGLE_SHEET_URL을 확인하세요.');
        }
        
        if (dbResult.status === 'success') {
            showNotification('✅ 상담 문의가 성공적으로 접수되었습니다!\n담당자가 빠른 시일 내에 연락드리겠습니다.', 'success');
            form.reset();
        } else {
            showNotification(dbResult.message || '문의 전송 중 오류가 발생했습니다.', 'error');
        }
        
    } catch (error) {
        console.error('오류:', error);
        showNotification('❌ 문의 전송 중 오류가 발생했습니다.\n잠시 후 다시 시도해주세요.', 'error');
    } finally {
        submitBtn.disabled = false;
        submitText.textContent = '문의하기';
    }
}

// ESC 키로 팝업 닫기
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeConsultPopup();
    }
});

// CSS 애니메이션 추가
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 20px;
        cursor: pointer;
        margin-left: auto;
    }
    
    .form-group.focused label {
        color: #667eea;
        transform: translateY(-2px);
    }
    
    .nav-link.active:not(.highlight) {
        color: #d32f2f;
        background: rgba(211, 47, 47, 0.15);
        font-weight: 600;
    }
`;
document.head.appendChild(style);
