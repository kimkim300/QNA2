// Firebase 설정
const firebaseConfig = {
  apiKey: "AIzaSyD4EmClvytRl8k2aS4Y98oIn7oTYIS8g_4",
  authDomain: "qna0814-f372c.firebaseapp.com",
  projectId: "qna0814-f372c",
  storageBucket: "qna0814-f372c.firebasestorage.app",
  messagingSenderId: "30085800074",
  appId: "1:30085800074:web:2a04dda72bf3c0498d0d73",
  measurementId: "G-LEB0WZR84M"
};

// Firebase 초기화
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, orderBy, query, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 질문 게시판 클래스
class QuestionBoard {
    constructor() {
        this.questions = [];
        this.currentQuestionId = null;
        this.deleteQuestionId = null;
        this.currentPage = 1;
        this.questionsPerPage = 5;
        this.db = db;
        this.init();
    }

    async init() {
        try {
            this.updateConnectionStatus('connecting');
            await this.waitForFirebase();
            this.bindEvents();
            await this.loadQuestionsFromFirestore();
            this.updateConnectionStatus('connected');
            this.showSecurityWarning();
            this.showSecurityInfo();
        } catch (error) {
            console.error('초기화 오류:', error);
            this.updateConnectionStatus('error');
            this.showNotification('Firebase 연결에 실패했습니다.', 'error');
        }
    }

    async waitForFirebase() {
        return new Promise((resolve) => {
            if (typeof db !== 'undefined') {
                resolve();
            } else {
                setTimeout(() => this.waitForFirebase().then(resolve), 100);
            }
        });
    }

    bindEvents() {
        // 질문 제출 폼
        const questionForm = document.getElementById('questionForm');
        if (questionForm) {
            questionForm.addEventListener('submit', (e) => this.handleQuestionSubmit(e));
        }

        // 답변 제출 폼
        const answerForm = document.getElementById('answerForm');
        if (answerForm) {
            answerForm.addEventListener('submit', (e) => this.handleAnswerSubmit(e));
        }

        // 모달 이벤트 설정
        this.setupModalEvents();
    }

    setupModalEvents() {
        const answerModal = document.getElementById('answerModal');
        const deleteModal = document.getElementById('deleteModal');

        if (answerModal) {
            answerModal.addEventListener('shown.bs.modal', () => {
                const answerContent = document.getElementById('answerContent');
                if (answerContent) {
                    setTimeout(() => {
                        answerContent.focus();
                        answerContent.click();
                        answerContent.select();
                    }, 300);
                }
            });

            answerModal.addEventListener('hidden.bs.modal', () => {
                const answerForm = document.getElementById('answerForm');
                if (answerForm) {
                    answerForm.reset();
                }
            });
        }

        if (deleteModal) {
            deleteModal.addEventListener('shown.bs.modal', () => {
                const deleteConfirmBtn = document.getElementById('deleteConfirmBtn');
                if (deleteConfirmBtn) {
                    deleteConfirmBtn.focus();
                }
            });
        }
    }

    async loadQuestionsFromFirestore() {
        try {
            this.showDbOperationStatus('질문을 불러오는 중...');
            const q = query(collection(db, 'questions'), orderBy('createdAt', 'desc'));
            const querySnapshot = await getDocs(q);
            
            this.questions = [];
            querySnapshot.forEach((doc) => {
                const question = { id: doc.id, ...doc.data() };
                this.questions.push(question);
            });

            this.renderQuestions();
            this.showDbOperationStatus('질문 로드 완료');
            setTimeout(() => this.showDbOperationStatus(''), 2000);
        } catch (error) {
            console.error('질문 로드 오류:', error);
            this.showNotification('질문을 불러오는데 실패했습니다.', 'error');
            this.showDbOperationStatus('질문 로드 실패');
        }
    }

    async handleQuestionSubmit(e) {
        e.preventDefault();
        
        const questionTitle = document.getElementById('questionTitle').value.trim();
        const questionContent = document.getElementById('questionContent').value.trim();
        
        if (!questionTitle || !questionContent) {
            this.showNotification('제목과 내용을 모두 입력해주세요.', 'error');
            return;
        }

        try {
            this.showDbOperationStatus('질문을 등록하는 중...');
            
            const questionData = {
                title: questionTitle,
                content: questionContent,
                createdAt: serverTimestamp(),
                createdBy: '익명 사용자',
                lastModified: serverTimestamp()
            };

            const docRef = await addDoc(collection(db, 'questions'), questionData);
            
            // 새 질문을 배열에 추가
            const newQuestion = {
                id: docRef.id,
                ...questionData,
                createdAt: new Date(),
                lastModified: new Date()
            };
            
            this.questions.unshift(newQuestion);
            this.currentPage = 1; // 첫 페이지로 이동
            
            // 폼 초기화
            e.target.reset();
            
            this.renderQuestions();
            this.showNotification('질문이 성공적으로 등록되었습니다!', 'success');
            this.showDbOperationStatus('질문 등록 완료');
            setTimeout(() => this.showDbOperationStatus(''), 2000);
        } catch (error) {
            console.error('질문 제출 오류:', error);
            this.showNotification('질문 등록에 실패했습니다.', 'error');
            this.showDbOperationStatus('질문 등록 실패');
        }
    }

    async handleAnswerSubmit(e) {
        e.preventDefault();
        
        const answerContent = document.getElementById('answerContent').value.trim();
        
        if (!answerContent) {
            this.showNotification('답변 내용을 입력해주세요.', 'error');
            return;
        }

        if (!this.currentQuestionId) {
            this.showNotification('질문을 찾을 수 없습니다.', 'error');
            return;
        }

        try {
            this.showDbOperationStatus('답변을 등록하는 중...');
            
            const answerData = {
                content: answerContent,
                createdAt: serverTimestamp(),
                createdBy: '익명 사용자'
            };

            const questionRef = doc(db, 'questions', this.currentQuestionId);
            const question = this.questions.find(q => q.id === this.currentQuestionId);
            
            if (!question) {
                throw new Error('질문을 찾을 수 없습니다.');
            }

            const answers = question.answers || [];
            answers.push(answerData);
            
            await updateDoc(questionRef, {
                answers: answers,
                lastModified: serverTimestamp()
            });

            // 로컬 상태 업데이트
            question.answers = answers;
            question.lastModified = new Date();
            
            this.renderQuestions();
            this.showNotification('답변이 성공적으로 등록되었습니다!', 'success');
            
            // 모달 닫기
            const modal = bootstrap.Modal.getInstance(document.getElementById('answerModal'));
            if (modal) {
                modal.hide();
            }
            
            this.showDbOperationStatus('답변 등록 완료');
            setTimeout(() => this.showDbOperationStatus(''), 2000);
        } catch (error) {
            console.error('답변 제출 오류:', error);
            this.showNotification('답변 등록에 실패했습니다.', 'error');
            this.showDbOperationStatus('답변 등록 실패');
        }
    }

    async confirmDeleteQuestion() {
        if (!this.deleteQuestionId) return;

        try {
            this.showDbOperationStatus('질문을 삭제하는 중...');
            
            await deleteDoc(doc(db, 'questions', this.deleteQuestionId));
            
            // 로컬 상태에서 제거
            this.questions = this.questions.filter(q => q.id !== this.deleteQuestionId);
            
            // 페이지 조정
            const totalPages = Math.ceil(this.questions.length / this.questionsPerPage);
            if (this.currentPage > totalPages && totalPages > 0) {
                this.currentPage = totalPages;
            }
            
            this.renderQuestions();
            this.showNotification('질문이 삭제되었습니다.', 'success');
            
            // 모달 닫기
            const modal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
            if (modal) {
                modal.hide();
            }
            
            this.showDbOperationStatus('질문 삭제 완료');
            setTimeout(() => this.showDbOperationStatus(''), 2000);
        } catch (error) {
            console.error('질문 삭제 오류:', error);
            this.showNotification('질문 삭제에 실패했습니다.', 'error');
            this.showDbOperationStatus('질문 삭제 실패');
        }
    }

    renderQuestions() {
        const questionsList = document.querySelector('.questions-list');
        const questionCount = document.getElementById('questionCount');
        if (!questionsList) return;

        // 질문 개수 업데이트
        if (questionCount) {
            questionCount.textContent = `${this.questions.length}개`;
        }

        const startIndex = (this.currentPage - 1) * this.questionsPerPage;
        const endIndex = startIndex + this.questionsPerPage;
        const currentQuestions = this.questions.slice(startIndex, endIndex);

        if (currentQuestions.length === 0) {
            questionsList.innerHTML = `
                <div class="empty-state text-center py-5">
                    <i class="bi bi-chat-dots display-1 text-muted"></i>
                    <h4 class="mt-3 text-muted">아직 질문이 없습니다</h4>
                    <p class="text-muted">첫 번째 질문을 작성해보세요!</p>
                </div>
            `;
            return;
        }

        const questionsHTML = currentQuestions.map(question => this.renderQuestion(question)).join('');
        questionsList.innerHTML = questionsHTML;

        this.renderPagination();
    }

    renderQuestion(question) {
        const answersCount = question.answers ? question.answers.length : 0;
        const formattedDate = this.formatDate(question.createdAt);
        
        return `
            <div class="question-item card mb-3 shadow-sm" data-question-id="${question.id}">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <h5 class="card-title mb-0 fw-bold text-primary">${this.escapeHtml(question.title)}</h5>
                        <div class="d-flex gap-2">
                            <button class="btn btn-sm btn-outline-primary" onclick="questionBoard.openAnswerModal('${question.id}')">
                                <i class="bi bi-chat-dots"></i> 답변
                            </button>
                            <button class="btn btn-sm btn-outline-danger" onclick="questionBoard.openDeleteModal('${question.id}')">
                                <i class="bi bi-trash"></i>
                            </button>
                        </div>
                    </div>
                    <p class="card-text text-secondary mb-3">${this.escapeHtml(question.content)}</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <div class="text-muted small">
                            <i class="bi bi-person"></i> ${this.escapeHtml(question.createdBy || '익명')}
                            <span class="ms-2"><i class="bi bi-clock"></i> ${formattedDate}</span>
                        </div>
                        <span class="badge bg-info">답변 ${answersCount}개</span>
                    </div>
                    ${this.renderAnswers(question)}
                </div>
            </div>
        `;
    }

    renderAnswers(question) {
        if (!question.answers || question.answers.length === 0) {
            return '';
        }

        const answersHTML = question.answers.map(answer => this.renderAnswer(answer)).join('');
        
        return `
            <div class="answers-section mt-3 pt-3 border-top">
                <h6 class="fw-bold text-success mb-2">
                    <i class="bi bi-chat-quote"></i> 답변들
                </h6>
                ${answersHTML}
            </div>
        `;
    }

    renderAnswer(answer) {
        const formattedDate = this.formatDate(answer.createdAt);
        
        return `
            <div class="answer-item mb-2 p-2 bg-light rounded">
                <p class="mb-1">${this.escapeHtml(answer.content)}</p>
                <div class="text-muted small">
                    <i class="bi bi-person"></i> ${this.escapeHtml(answer.createdBy || '익명')}
                    <span class="ms-2"><i class="bi bi-clock"></i> ${formattedDate}</span>
                </div>
            </div>
        `;
    }

    renderPagination() {
        const totalPages = Math.ceil(this.questions.length / this.questionsPerPage);
        if (totalPages <= 1) return;

        const paginationContainer = document.querySelector('.pagination-container');
        if (!paginationContainer) return;

        let paginationHTML = `
            <div class="d-flex justify-content-between align-items-center">
                <div class="pagination-info">
                    페이지 ${this.currentPage} / ${totalPages} (총 ${this.questions.length}개 질문)
                </div>
                <nav>
                    <ul class="pagination pagination-sm mb-0">
        `;

        // 이전 페이지 버튼
        paginationHTML += `
            <li class="page-item ${this.currentPage === 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="questionBoard.goToPage(${this.currentPage - 1})">
                    <i class="bi bi-chevron-left"></i>
                </a>
            </li>
        `;

        // 페이지 번호들
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= this.currentPage - 1 && i <= this.currentPage + 1)) {
                paginationHTML += `
                    <li class="page-item ${i === this.currentPage ? 'active' : ''}">
                        <a class="page-link" href="#" onclick="questionBoard.goToPage(${i})">${i}</a>
                    </li>
                `;
            } else if (i === this.currentPage - 2 || i === this.currentPage + 2) {
                paginationHTML += '<li class="page-item disabled"><span class="page-link">...</span></li>';
            }
        }

        // 다음 페이지 버튼
        paginationHTML += `
            <li class="page-item ${this.currentPage === totalPages ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="questionBoard.goToPage(${this.currentPage + 1})">
                    <i class="bi bi-chevron-right"></i>
                </a>
            </li>
        </ul>
                </nav>
            </div>
        `;

        paginationContainer.innerHTML = paginationHTML;
    }

    goToPage(page) {
        const totalPages = Math.ceil(this.questions.length / this.questionsPerPage);
        if (page < 1 || page > totalPages) return;
        
        this.currentPage = page;
        this.renderQuestions();
        
        // 페이지 상단으로 스크롤
        const questionsList = document.querySelector('.questions-list');
        if (questionsList) {
            questionsList.scrollIntoView({ behavior: 'smooth' });
        }
    }

    openAnswerModal(questionId) {
        this.currentQuestionId = questionId;
        const modal = new bootstrap.Modal(document.getElementById('answerModal'), {
            backdrop: 'static',
            keyboard: true,
            focus: true
        });
        modal.show();
    }

    openDeleteModal(questionId) {
        this.deleteQuestionId = questionId;
        const modal = new bootstrap.Modal(document.getElementById('deleteModal'));
        modal.show();
    }

    formatDate(date) {
        if (!date) return '알 수 없음';
        
        let dateObj;
        if (date.toDate) {
            // Firestore Timestamp 객체
            dateObj = date.toDate();
        } else if (date instanceof Date) {
            dateObj = date;
        } else {
            dateObj = new Date(date);
        }

        const now = new Date();
        const diffTime = now.getTime() - dateObj.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        // 날짜만 비교 (시간 무시)
        const dateOnly = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate());
        const nowOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const diffDaysOnly = Math.floor((nowOnly.getTime() - dateOnly.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDaysOnly === 0) {
            return '오늘';
        } else if (diffDaysOnly === 1) {
            return '어제';
        } else if (diffDaysOnly < 7) {
            return `${diffDaysOnly}일 전`;
        } else {
            return dateObj.toLocaleDateString('ko-KR');
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    updateConnectionStatus(status) {
        const firebaseStatus = document.getElementById('firebaseStatus');
        const dbConnectionStatus = document.getElementById('dbConnectionStatus');
        
        if (firebaseStatus) {
            firebaseStatus.className = `badge ${status === 'connected' ? 'bg-success' : status === 'connecting' ? 'bg-warning' : 'bg-danger'}`;
            firebaseStatus.textContent = status === 'connected' ? '연결됨' : status === 'connecting' ? '연결 중' : '연결 실패';
        }
        
        if (dbConnectionStatus) {
            dbConnectionStatus.className = `badge ${status === 'connected' ? 'bg-success' : status === 'connecting' ? 'bg-warning' : 'bg-danger'}`;
            dbConnectionStatus.textContent = status === 'connected' ? '데이터베이스 연결됨' : status === 'connecting' ? '데이터베이스 연결 중' : '데이터베이스 연결 실패';
        }
    }

    showSecurityWarning() {
        const securityWarning = document.getElementById('securityWarning');
        if (securityWarning) {
            securityWarning.style.display = 'block';
            setTimeout(() => {
                securityWarning.style.display = 'none';
            }, 15000);
        }
    }

    showSecurityInfo() {
        const questionsList = document.querySelector('.questions-list');
        if (questionsList) {
            const existingInfo = questionsList.querySelector('.alert-info');
            if (!existingInfo) {
                const securityInfo = `
                    <div class="alert alert-info alert-dismissible fade show" role="alert">
                        <i class="bi bi-info-circle me-2"></i>
                        <strong>데이터베이스 접근 권한:</strong>
                        <ul class="mb-0 mt-2">
                            <li>✅ 모든 사용자가 질문을 작성할 수 있습니다</li>
                            <li>✅ 모든 사용자가 답변을 작성할 수 있습니다</li>
                            <li>✅ 모든 사용자가 질문과 답변을 읽을 수 있습니다</li>
                            <li>✅ 모든 사용자가 질문을 삭제할 수 있습니다</li>
                        </ul>
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>
                `;
                questionsList.insertAdjacentHTML('afterbegin', securityInfo);
            }
        }
    }

    showDbOperationStatus(message) {
        const dbOperationStatus = document.getElementById('dbOperationStatus');
        if (dbOperationStatus) {
            if (message) {
                dbOperationStatus.style.display = 'block';
                dbOperationStatus.textContent = message;
            } else {
                dbOperationStatus.style.display = 'none';
            }
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `alert alert-${type === 'error' ? 'danger' : type} alert-dismissible fade show position-fixed`;
        notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
        
        const icon = type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-triangle' : 'info-circle';
        const iconColor = type === 'success' ? 'text-success' : type === 'error' ? 'text-danger' : 'text-info';
        
        notification.innerHTML = `
            <i class="bi bi-${icon} ${iconColor} me-2"></i>
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        
        document.body.appendChild(notification);
        
        // 5초 후 자동 제거
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }
}

// 전역 변수로 질문 게시판 인스턴스 생성
let questionBoard;

// DOM이 로드된 후 초기화
document.addEventListener('DOMContentLoaded', () => {
    questionBoard = new QuestionBoard();
});

// 전역 함수들 (HTML에서 직접 호출)
window.questionBoard = questionBoard;
