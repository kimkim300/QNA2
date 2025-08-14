// 질문 게시판 애플리케이션
class QuestionBoard {
    constructor() {
        this.questions = JSON.parse(localStorage.getItem('questions')) || [];
        this.currentQuestionId = 1;
        this.currentPage = 1;
        this.questionsPerPage = 5;
        this.deleteQuestionId = null;
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.renderQuestions();
        this.loadSampleData();
    }

    bindEvents() {
        // 질문 작성 폼 이벤트
        const questionForm = document.getElementById('questionForm');
        questionForm.addEventListener('submit', (e) => this.handleQuestionSubmit(e));

        // 답변 작성 폼 이벤트
        const answerForm = document.getElementById('answerForm');
        answerForm.addEventListener('submit', (e) => this.handleAnswerSubmit(e));

        // 삭제 확인 모달 이벤트
        const confirmDeleteBtn = document.getElementById('confirmDelete');
        confirmDeleteBtn.addEventListener('click', () => this.confirmDeleteQuestion());

        // 모달 이벤트 리스너 추가
        this.setupModalEvents();
    }

    // 모달 이벤트 설정
    setupModalEvents() {
        const answerModal = document.getElementById('answerModal');
        const deleteModal = document.getElementById('deleteModal');

        // 답변 모달 이벤트 - 더 안정적인 방식으로 변경
        if (answerModal) {
            // 모달이 표시되기 전에 이벤트 설정
            answerModal.addEventListener('show.bs.modal', (event) => {
                console.log('답변 모달을 표시하려고 합니다.');
                
                // 모달이 표시되기 전에 입력 필드들을 준비
                const answerContent = document.getElementById('answerContent');
                const answerAuthor = document.getElementById('answerAuthor');
                
                if (answerContent) {
                    answerContent.disabled = false;
                    answerContent.readOnly = false;
                }
                if (answerAuthor) {
                    answerAuthor.disabled = false;
                    answerAuthor.readOnly = false;
                }
            });

            // 모달이 완전히 표시된 후 이벤트 처리
            answerModal.addEventListener('shown.bs.modal', (event) => {
                console.log('답변 모달이 완전히 표시되었습니다.');
                
                // 입력 필드들을 찾아서 포커스 설정
                const answerContent = document.getElementById('answerContent');
                const answerAuthor = document.getElementById('answerAuthor');
                
                if (answerContent) {
                    // 약간의 지연 후 포커스 설정
                    setTimeout(() => {
                        // 입력 필드가 비활성화되어 있다면 활성화
                        if (answerContent.disabled) {
                            answerContent.disabled = false;
                        }
                        if (answerContent.readOnly) {
                            answerContent.readOnly = false;
                        }
                        
                        // 포커스 설정
                        answerContent.focus();
                        console.log('답변 내용 필드에 포커스 설정됨');
                        
                        // 입력 필드가 실제로 포커스되었는지 확인
                        if (document.activeElement === answerContent) {
                            console.log('포커스가 성공적으로 설정되었습니다.');
                        } else {
                            console.log('포커스 설정에 실패했습니다. 강제 설정 시도...');
                            // 강제로 포커스 설정
                            answerContent.click();
                            answerContent.focus();
                            answerContent.select();
                        }
                        
                        // 입력 필드가 클릭 가능한지 확인
                        answerContent.style.pointerEvents = 'auto';
                        answerContent.style.userSelect = 'text';
                    }, 200);
                }
                
                if (answerAuthor) {
                    console.log('답변 작성자 필드 준비됨');
                    // 작성자 필드도 클릭 가능하도록 설정
                    answerAuthor.style.pointerEvents = 'auto';
                    answerAuthor.style.userSelect = 'text';
                }
            });

            // 모달이 닫힐 때 폼 초기화
            answerModal.addEventListener('hidden.bs.modal', (event) => {
                console.log('답변 모달이 닫혔습니다.');
                const answerForm = document.getElementById('answerForm');
                if (answerForm) {
                    answerForm.reset();
                    console.log('답변 폼이 초기화되었습니다.');
                }
            });
        }

        // 삭제 모달 이벤트
        if (deleteModal) {
            deleteModal.addEventListener('hidden.bs.modal', (event) => {
                this.deleteQuestionId = null;
            });
        }
    }

    // 질문 제출 처리
    handleQuestionSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const questionData = {
            id: this.generateId(),
            title: formData.get('title'),
            content: formData.get('content'),
            author: formData.get('author'),
            createdAt: new Date().toISOString(),
            answers: []
        };

        this.questions.unshift(questionData);
        this.saveToLocalStorage();
        this.currentPage = 1; // 새 질문 추가 시 첫 페이지로 이동
        this.renderQuestions();
        
        // 폼 초기화
        e.target.reset();
        
        // 성공 메시지 표시
        this.showNotification('질문이 성공적으로 등록되었습니다!', 'success');
    }

    // 답변 제출 처리
    handleAnswerSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const questionId = parseInt(formData.get('questionId'));
        const answerData = {
            id: this.generateId(),
            content: formData.get('content'),
            author: formData.get('author'),
            createdAt: new Date().toISOString()
        };

        const question = this.questions.find(q => q.id === questionId);
        if (question) {
            question.answers.push(answerData);
            this.saveToLocalStorage();
            this.renderQuestions();
            
            // Bootstrap 모달 닫기
            const modal = bootstrap.Modal.getInstance(document.getElementById('answerModal'));
            if (modal) {
                modal.hide();
            }
            
            // 성공 메시지 표시
            this.showNotification('답변이 성공적으로 등록되었습니다!', 'success');
        }
    }

    // 질문 삭제 요청
    deleteQuestion(questionId) {
        this.deleteQuestionId = questionId;
        
        // Bootstrap 모달 표시
        const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
        deleteModal.show();
    }

    // 질문 삭제 확인
    confirmDeleteQuestion() {
        if (this.deleteQuestionId) {
            const questionIndex = this.questions.findIndex(q => q.id === this.deleteQuestionId);
            if (questionIndex !== -1) {
                this.questions.splice(questionIndex, 1);
                this.saveToLocalStorage();
                
                // 현재 페이지 조정
                const totalPages = Math.ceil(this.questions.length / this.questionsPerPage);
                if (this.currentPage > totalPages && totalPages > 0) {
                    this.currentPage = totalPages;
                }
                
                this.renderQuestions();
                
                // 모달 닫기
                const deleteModal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
                if (deleteModal) {
                    deleteModal.hide();
                }
                
                // 성공 메시지 표시
                this.showNotification('질문이 성공적으로 삭제되었습니다!', 'success');
            }
            this.deleteQuestionId = null;
        }
    }

    // 질문 목록 렌더링
    renderQuestions() {
        const container = document.getElementById('questionsContainer');
        const paginationContainer = document.getElementById('pagination');
        const questionCountElement = document.getElementById('questionCount');
        
        // 질문 개수 업데이트
        questionCountElement.textContent = `${this.questions.length}개`;
        
        if (this.questions.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <h3>아직 질문이 없습니다</h3>
                    <p>첫 번째 질문을 작성해보세요!</p>
                </div>
            `;
            paginationContainer.innerHTML = '';
            return;
        }

        // 현재 페이지의 질문들만 가져오기
        const startIndex = (this.currentPage - 1) * this.questionsPerPage;
        const endIndex = startIndex + this.questionsPerPage;
        const currentQuestions = this.questions.slice(startIndex, endIndex);

        // 질문 목록 렌더링
        container.innerHTML = currentQuestions.map(question => this.renderQuestion(question)).join('');
        
        // 페이지네이션 렌더링
        this.renderPagination();
    }

    // 페이지네이션 렌더링
    renderPagination() {
        const paginationContainer = document.getElementById('pagination');
        const totalPages = Math.ceil(this.questions.length / this.questionsPerPage);
        
        if (totalPages <= 1) {
            paginationContainer.innerHTML = '';
            return;
        }

        let paginationHTML = '';
        
        // 이전 페이지 버튼
        paginationHTML += `
            <button class="btn btn-outline-primary" onclick="questionBoard.goToPage(${this.currentPage - 1})" 
                    ${this.currentPage === 1 ? 'disabled' : ''}>
                <i class="bi bi-chevron-left"></i> 이전
            </button>
        `;

        // 페이지 번호들
        const startPage = Math.max(1, this.currentPage - 2);
        const endPage = Math.min(totalPages, this.currentPage + 2);
        
        for (let i = startPage; i <= endPage; i++) {
            paginationHTML += `
                <button class="btn ${i === this.currentPage ? 'btn-primary' : 'btn-outline-primary'}" 
                        onclick="questionBoard.goToPage(${i})">
                    ${i}
                </button>
            `;
        }

        // 다음 페이지 버튼
        paginationHTML += `
            <button class="btn btn-outline-primary" onclick="questionBoard.goToPage(${this.currentPage + 1})" 
                    ${this.currentPage === totalPages ? 'disabled' : ''}>
                다음 <i class="bi bi-chevron-right"></i>
            </button>
        `;

        // 페이지 정보
        paginationHTML += `
            <div class="pagination-info">
                ${this.currentPage} / ${totalPages} 페이지 
                (총 ${this.questions.length}개 질문)
            </div>
        `;

        paginationContainer.innerHTML = paginationHTML;
    }

    // 페이지 이동
    goToPage(page) {
        const totalPages = Math.ceil(this.questions.length / this.questionsPerPage);
        if (page >= 1 && page <= totalPages) {
            this.currentPage = page;
            this.renderQuestions();
            
            // 페이지 상단으로 스크롤
            document.querySelector('.questions-list').scrollIntoView({ 
                behavior: 'smooth' 
            });
        }
    }

    // 개별 질문 렌더링
    renderQuestion(question) {
        const answersCount = question.answers.length;
        const formattedDate = this.formatDate(question.createdAt);
        
        return `
            <div class="question-item bg-white rounded-3 shadow-sm p-4 mb-3" data-question-id="${question.id}">
                <div class="question-header d-flex justify-content-between align-items-start mb-3">
                    <div class="flex-grow-1">
                        <h3 class="question-title h5 mb-2 fw-bold">${this.escapeHtml(question.title)}</h3>
                        <div class="question-meta d-inline-block">
                            <i class="bi bi-person-circle me-1"></i>${this.escapeHtml(question.author)} | 
                            <i class="bi bi-calendar3 me-1"></i>${formattedDate} | 
                            <i class="bi bi-chat-dots me-1"></i>${answersCount}개 답변
                        </div>
                    </div>
                    <button class="btn btn-outline-danger btn-sm ms-2" 
                            onclick="questionBoard.deleteQuestion(${question.id})"
                            title="질문 삭제">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
                
                <div class="question-content mb-3 text-secondary">
                    ${this.escapeHtml(question.content).replace(/\n/g, '<br>')}
                </div>
                
                <div class="question-actions d-flex gap-2">
                    <button class="btn btn-success btn-sm" onclick="questionBoard.openAnswerModal(${question.id})">
                        <i class="bi bi-chat-dots me-1"></i>답변 작성
                    </button>
                    <button class="btn btn-outline-secondary btn-sm" onclick="questionBoard.toggleAnswers(${question.id})">
                        <i class="bi bi-eye me-1"></i>답변 ${question.answers.length > 0 ? '보기' : '없음'}
                    </button>
                </div>
                
                <div class="answers-section mt-3" id="answers-${question.id}" style="display: none;">
                    <h5 class="mb-3 text-primary">
                        <i class="bi bi-chat-quote me-2"></i>답변 (${answersCount}개)
                    </h5>
                    ${question.answers.length > 0 ? 
                        question.answers.map(answer => this.renderAnswer(answer)).join('') :
                        '<p class="empty-state text-muted">아직 답변이 없습니다.</p>'
                    }
                </div>
            </div>
        `;
    }

    // 답변 렌더링
    renderAnswer(answer) {
        const formattedDate = this.formatDate(answer.createdAt);
        
        return `
            <div class="answer-item bg-light rounded-3 p-3 mb-2">
                <div class="answer-meta mb-2 text-muted small">
                    <i class="bi bi-person-circle me-1"></i>${this.escapeHtml(answer.author)} | 
                    <i class="bi bi-calendar3 me-1"></i>${formattedDate}
                </div>
                <div class="answer-content">
                    ${this.escapeHtml(answer.content).replace(/\n/g, '<br>')}
                </div>
            </div>
        `;
    }

    // 답변 모달 열기
    openAnswerModal(questionId) {
        console.log('답변 모달을 열려고 합니다. 질문 ID:', questionId);
        
        const questionIdInput = document.getElementById('questionId');
        if (questionIdInput) {
            questionIdInput.value = questionId;
            console.log('질문 ID가 설정되었습니다:', questionId);
        }
        
        // Bootstrap 모달 표시
        try {
            const modalElement = document.getElementById('answerModal');
            if (modalElement) {
                // 기존 모달 인스턴스가 있다면 제거
                const existingModal = bootstrap.Modal.getInstance(modalElement);
                if (existingModal) {
                    existingModal.dispose();
                }
                
                // 새로운 모달 인스턴스 생성 및 표시
                const modal = new bootstrap.Modal(modalElement, {
                    backdrop: 'static',
                    keyboard: true,
                    focus: true
                });
                
                modal.show();
                console.log('Bootstrap 모달이 표시되었습니다.');
                
                // 모달이 표시된 후 입력 필드에 직접 포커스 설정
                setTimeout(() => {
                    const answerContent = document.getElementById('answerContent');
                    if (answerContent) {
                        answerContent.focus();
                        console.log('직접 포커스 설정 완료');
                        
                        // 입력 필드가 활성화되었는지 확인
                        if (document.activeElement === answerContent) {
                            console.log('입력 필드가 성공적으로 활성화되었습니다.');
                        } else {
                            console.log('입력 필드 활성화에 실패했습니다. 강제 설정 시도...');
                            answerContent.click();
                            answerContent.focus();
                            answerContent.select();
                        }
                    }
                }, 300);
                
            } else {
                console.error('답변 모달 요소를 찾을 수 없습니다.');
            }
        } catch (error) {
            console.error('모달을 표시하는 중 오류가 발생했습니다:', error);
        }
    }

    // 답변 보기/숨기기 토글
    toggleAnswers(questionId) {
        const answersSection = document.getElementById(`answers-${questionId}`);
        const isVisible = answersSection.style.display !== 'none';
        
        answersSection.style.display = isVisible ? 'none' : 'block';
        
        // 부드러운 애니메이션
        if (!isVisible) {
            answersSection.style.opacity = '0';
            answersSection.style.transform = 'translateY(-10px)';
            setTimeout(() => {
                answersSection.style.transition = 'all 0.3s ease';
                answersSection.style.opacity = '1';
                answersSection.style.transform = 'translateY(0)';
            }, 10);
        }
    }

    // 샘플 데이터 로드 (첫 방문 시)
    loadSampleData() {
        if (this.questions.length === 0) {
            const sampleQuestions = [
                {
                    id: this.generateId(),
                    title: "프로그래밍 초보자입니다. 어떤 언어부터 시작하면 좋을까요?",
                    content: "안녕하세요! 프로그래밍을 처음 배우려고 하는데, 어떤 언어부터 시작하는 것이 좋을지 조언을 구하고 싶습니다. 현재는 HTML과 CSS만 조금 알고 있어요.",
                    author: "프로그래밍초보",
                    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1일 전
                    answers: [
                        {
                            id: this.generateId(),
                            content: "Python을 추천합니다! 문법이 간단하고 직관적이어서 초보자가 배우기 좋습니다. 또한 다양한 분야에서 활용할 수 있어요.",
                            author: "경험자",
                            createdAt: new Date(Date.now() - 43200000).toISOString() // 12시간 전
                        }
                    ]
                },
                {
                    id: this.generateId(),
                    title: "웹 개발을 위한 학습 로드맵이 궁금합니다",
                    content: "웹 개발자가 되고 싶은데, 어떤 순서로 공부해야 할지 궁금합니다. 프론트엔드와 백엔드 모두 배우고 싶어요.",
                    author: "웹개발지망생",
                    createdAt: new Date(Date.now() - 172800000).toISOString(), // 2일 전
                    answers: []
                },
                {
                    id: this.generateId(),
                    title: "JavaScript 프레임워크 선택에 대한 조언",
                    content: "React, Vue, Angular 중에서 어떤 것을 선택해야 할지 고민하고 있습니다. 각각의 장단점과 사용 사례를 알려주세요.",
                    author: "프론트엔드개발자",
                    createdAt: new Date(Date.now() - 259200000).toISOString(), // 3일 전
                    answers: []
                },
                {
                    id: this.generateId(),
                    title: "데이터베이스 설계 원칙",
                    content: "새로운 프로젝트를 시작하려고 하는데, 데이터베이스 설계 시 주의해야 할 점과 좋은 설계 원칙이 있다면 알려주세요.",
                    author: "백엔드개발자",
                    createdAt: new Date(Date.now() - 345600000).toISOString(), // 4일 전
                    answers: []
                },
                {
                    id: this.generateId(),
                    title: "Git 브랜치 전략",
                    content: "팀 프로젝트에서 Git을 사용할 때 어떤 브랜치 전략을 사용하는 것이 좋을까요? Git Flow, GitHub Flow 등에 대해 설명해주세요.",
                    author: "개발팀장",
                    createdAt: new Date(Date.now() - 432000000).toISOString(), // 5일 전
                    answers: []
                },
                {
                    id: this.generateId(),
                    title: "클라우드 서비스 비교",
                    content: "AWS, Azure, Google Cloud 중에서 어떤 서비스를 선택해야 할지 고민하고 있습니다. 각각의 특징과 장단점을 비교해주세요.",
                    author: "DevOps엔지니어",
                    createdAt: new Date(Date.now() - 518400000).toISOString(), // 6일 전
                    answers: []
                }
            ];
            
            this.questions = sampleQuestions;
            this.saveToLocalStorage();
            this.renderQuestions();
        }
    }

    // 유틸리티 함수들
    generateId() {
        return this.currentQuestionId++;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        
        // 날짜만 비교 (시간 제외)
        const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const nowOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        
        const diffTime = nowOnly.getTime() - dateOnly.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) {
            return '오늘';
        } else if (diffDays === 1) {
            return '어제';
        } else if (diffDays < 7) {
            return `${diffDays}일 전`;
        } else {
            return date.toLocaleDateString('ko-KR');
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    saveToLocalStorage() {
        localStorage.setItem('questions', JSON.stringify(this.questions));
    }

    // 알림 메시지 표시
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `alert alert-${type === 'success' ? 'success' : 'info'} alert-dismissible fade show position-fixed`;
        notification.style.cssText = `
            top: 20px;
            right: 20px;
            z-index: 10000;
            min-width: 300px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;
        
        notification.innerHTML = `
            <i class="bi bi-${type === 'success' ? 'check-circle' : 'info-circle'} me-2"></i>
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        
        document.body.appendChild(notification);
        
        // 4초 후 자동 제거
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 4000);
    }
}

// 애플리케이션 초기화
let questionBoard;
document.addEventListener('DOMContentLoaded', () => {
    questionBoard = new QuestionBoard();
});

// 전역 함수로 노출 (HTML에서 호출하기 위해)
window.questionBoard = questionBoard;
