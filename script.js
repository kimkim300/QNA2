/* 기본 스타일 */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    line-height: 1.6;
    color: #333;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    min-height: 100vh;
}

/* 컨테이너 스타일 */
.container-fluid {
    max-width: 1400px;
    margin: 0 auto;
}

/* 메인 콘텐츠 레이아웃 */
.main-content {
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 2rem;
    margin-top: 2rem;
}

/* 질문 작성 폼 섹션 */
.question-form-section {
    position: sticky;
    top: 2rem;
    height: fit-content;
}

.question-form-section .card {
    border: none;
    border-radius: 15px;
    overflow: hidden;
    transition: all 0.3s ease;
}

.question-form-section .card:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.question-form-section .card-header {
    background: linear-gradient(135deg, #007bff, #0056b3);
    border: none;
    padding: 1.5rem;
}

.question-form-section .card-body {
    padding: 2rem;
}

/* 질문 목록 섹션 */
.questions-section .card {
    border: none;
    border-radius: 15px;
    overflow: hidden;
    transition: all 0.3s ease;
}

.questions-section .card:hover {
    transform: translateY(-2px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
}

.questions-section .card-header {
    background: linear-gradient(135deg, #28a745, #1e7e34);
    border: none;
    padding: 1.5rem;
}

/* 폼 스타일 */
.form-label {
    font-weight: 600;
    color: #495057;
    margin-bottom: 0.5rem;
}

.form-control {
    border: 2px solid #e9ecef;
    border-radius: 10px;
    padding: 0.75rem 1rem;
    font-size: 1rem;
    transition: all 0.3s ease;
    background-color: #fff;
}

.form-control:focus {
    border-color: #007bff;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
    background-color: #fff;
}

.form-control::placeholder {
    color: #adb5bd;
    font-style: italic;
}

.form-control-lg {
    font-size: 1.1rem;
    padding: 1rem 1.25rem;
}

/* 버튼 스타일 */
.btn {
    border-radius: 10px;
    font-weight: 600;
    padding: 0.75rem 1.5rem;
    transition: all 0.3s ease;
    border: none;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.btn-primary {
    background: linear-gradient(135deg, #007bff, #0056b3);
}

.btn-primary:hover {
    background: linear-gradient(135deg, #0056b3, #004085);
}

.btn-success {
    background: linear-gradient(135deg, #28a745, #1e7e34);
}

.btn-success:hover {
    background: linear-gradient(135deg, #1e7e34, #155724);
}

.btn-info {
    background: linear-gradient(135deg, #17a2b8, #138496);
}

.btn-info:hover {
    background: linear-gradient(135deg, #138496, #0f6674);
}

.btn-danger {
    background: linear-gradient(135deg, #dc3545, #c82333);
}

.btn-danger:hover {
    background: linear-gradient(135deg, #c82333, #a71e2a);
}

.btn-secondary {
    background: linear-gradient(135deg, #6c757d, #545b62);
}

.btn-secondary:hover {
    background: linear-gradient(135deg, #545b62, #3d4449);
}

/* 질문 목록 스타일 */
.questions-container {
    max-height: 600px;
    overflow-y: auto;
    padding: 0;
}

.question-item {
    background: #fff;
    border: 1px solid #e9ecef;
    border-radius: 12px;
    margin: 1rem;
    padding: 1.5rem;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
}

.question-item:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    border-color: #007bff;
}

.question-item::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: linear-gradient(135deg, #007bff, #0056b3);
    transform: scaleY(0);
    transition: transform 0.3s ease;
}

.question-item:hover::before {
    transform: scaleY(1);
}

.question-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1rem;
}

.question-title {
    font-size: 1.25rem;
    font-weight: 700;
    color: #212529;
    margin-bottom: 0.5rem;
    line-height: 1.3;
}

.question-meta {
    display: flex;
    align-items: center;
    gap: 1rem;
    font-size: 0.9rem;
    color: #6c757d;
    margin-bottom: 1rem;
}

.question-meta i {
    color: #007bff;
}

.question-content {
    color: #495057;
    line-height: 1.6;
    margin-bottom: 1.5rem;
    font-size: 1rem;
}

.question-actions {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
}

.question-actions .btn {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
    border-radius: 8px;
}

/* 답변 스타일 */
.answers-section {
    margin-top: 1.5rem;
    padding-top: 1.5rem;
    border-top: 2px solid #f8f9fa;
}

.answers-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
}

.answers-count {
    font-weight: 600;
    color: #28a745;
    font-size: 1.1rem;
}

.answer-item {
    background: #f8f9fa;
    border: 1px solid #e9ecef;
    border-radius: 10px;
    padding: 1rem;
    margin-bottom: 1rem;
    transition: all 0.3s ease;
}

.answer-item:hover {
    background: #e9ecef;
    border-color: #28a745;
}

.answer-content {
    color: #495057;
    line-height: 1.6;
    margin-bottom: 0.75rem;
}

.answer-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.85rem;
    color: #6c757d;
}

.answer-author {
    font-weight: 600;
    color: #28a745;
}

/* 페이지네이션 스타일 */
.pagination-container {
    background: #fff;
    border-top: 1px solid #e9ecef;
}

.pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
    margin: 0;
}

.pagination .btn {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
    border-radius: 8px;
    min-width: 40px;
}

.pagination .btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
}

.pagination .btn:not(:disabled):hover {
    transform: translateY(-1px);
}

/* 모달 스타일 */
.modal-content {
    border: none;
    border-radius: 15px;
    overflow: hidden;
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
}

.modal-header {
    border: none;
    padding: 1.5rem;
}

.modal-body {
    padding: 2rem;
}

.modal-footer {
    border: none;
    padding: 1.5rem;
    gap: 0.75rem;
}

/* 모달 입력 필드 스타일 */
.modal .form-control {
    background-color: #fff !important;
    color: #333 !important;
    border: 2px solid #e9ecef;
    position: relative;
    z-index: 1;
}

.modal .form-control:focus {
    border-color: #007bff;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
    outline: none;
}

.modal .form-control::placeholder {
    color: #adb5bd;
}

.modal .form-label {
    color: #495057;
    font-weight: 600;
}

.modal .btn {
    border-radius: 10px;
    font-weight: 600;
}

.modal textarea.form-control {
    resize: vertical;
    min-height: 100px;
}

.modal input.form-control {
    height: auto;
}

/* 모달 z-index 강화 */
.modal-backdrop {
    z-index: 1040 !important;
}

.modal {
    z-index: 1050 !important;
}

.modal .form-control:focus-visible {
    outline: 2px solid #007bff;
    outline-offset: 2px;
}

/* 상태 표시 스타일 */
.firebase-status,
.db-connection-status,
.db-operation-status {
    background: linear-gradient(135deg, #fff3cd, #ffeaa7);
    border: 2px solid #ffc107;
    border-radius: 10px;
    padding: 1rem 1.5rem;
    margin: 1rem 0;
    color: #856404;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    transition: all 0.3s ease;
}

.firebase-status.connected,
.db-connection-status.connected {
    background: linear-gradient(135deg, #d4edda, #c3e6cb);
    border-color: #28a745;
    color: #155724;
}

.firebase-status.disconnected,
.db-connection-status.disconnected {
    background: linear-gradient(135deg, #f8d7da, #f5c6cb);
    border-color: #dc3545;
    color: #721c24;
}

.firebase-status i,
.db-connection-status i,
.db-operation-status i {
    font-size: 1.2rem;
}

.firebase-status.loading i,
.db-connection-status.loading i,
.db-operation-status.loading i {
    animation: spin 1s linear infinite;
}

@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

/* 보안 경고 메시지 */
.security-warning {
    background: linear-gradient(135deg, #d4edda, #c3e6cb);
    border: 2px solid #28a745;
    border-radius: 10px;
    padding: 1.5rem;
    margin: 1.5rem 0;
    color: #155724;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 1rem;
    box-shadow: 0 5px 15px rgba(40, 167, 69, 0.2);
}

.security-warning i {
    font-size: 1.5rem;
    color: #28a745;
}

/* 알림 토스트 스타일 */
.toast {
    border: none;
    border-radius: 10px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.toast-header {
    background: linear-gradient(135deg, #007bff, #0056b3);
    color: white;
    border: none;
    border-radius: 10px 10px 0 0;
}

.toast-header .btn-close {
    filter: invert(1);
}

/* 헤더 스타일 */
.display-4 {
    background: linear-gradient(135deg, #007bff, #0056b3);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-shadow: none;
}

.lead {
    color: #6c757d;
    font-weight: 500;
}

/* 반응형 디자인 */
@media (max-width: 1200px) {
    .main-content {
        grid-template-columns: 1fr 1.5fr;
        gap: 1.5rem;
    }
}

@media (max-width: 992px) {
    .main-content {
        grid-template-columns: 1fr;
        gap: 2rem;
    }
    
    .question-form-section {
        position: static;
    }
    
    .container-fluid {
        padding: 1rem;
    }
}

@media (max-width: 768px) {
    .container-fluid {
        padding: 0.5rem;
    }
    
    .question-form-section .card-body,
    .questions-section .card-body {
        padding: 1.5rem;
    }
    
    .question-item {
        margin: 0.75rem;
        padding: 1.25rem;
    }
    
    .question-actions {
        flex-direction: column;
    }
    
    .question-actions .btn {
        width: 100%;
    }
    
    .modal-body {
        padding: 1.5rem;
    }
    
    .firebase-status,
    .db-connection-status,
    .db-operation-status,
    .security-warning {
        padding: 1rem;
        margin: 0.75rem 0;
    }
}

@media (max-width: 576px) {
    .display-4 {
        font-size: 2.5rem;
    }
    
    .lead {
        font-size: 1rem;
    }
    
    .question-form-section .card-body,
    .questions-section .card-body {
        padding: 1rem;
    }
    
    .question-item {
        margin: 0.5rem;
        padding: 1rem;
    }
    
    .modal-body {
        padding: 1rem;
    }
    
    .modal-footer {
        padding: 1rem;
        flex-direction: column;
    }
    
    .modal-footer .btn {
        width: 100%;
    }
}

/* 다크 모드 지원 */
@media (prefers-color-scheme: dark) {
    body {
        background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
        color: #ecf0f1;
    }
    
    .card {
        background-color: #34495e;
        color: #ecf0f1;
    }
    
    .form-control {
        background-color: #2c3e50;
        color: #ecf0f1;
        border-color: #7f8c8d;
    }
    
    .form-control:focus {
        background-color: #2c3e50;
        color: #ecf0f1;
    }
    
    .question-item {
        background-color: #34495e;
        border-color: #7f8c8d;
    }
    
    .answer-item {
        background-color: #2c3e50;
        border-color: #7f8c8d;
    }
    
    .question-title {
        color: #ecf0f1;
    }
    
    .question-content,
    .answer-content {
        color: #bdc3c7;
    }
}

/* 스크롤바 스타일 */
.questions-container::-webkit-scrollbar {
    width: 8px;
}

.questions-container::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
}

.questions-container::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, #007bff, #0056b3);
    border-radius: 4px;
}

.questions-container::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(135deg, #0056b3, #004085);
}

/* 애니메이션 */
.question-item,
.answer-item {
    animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* 호버 효과 강화 */
.question-item:hover .question-title {
    color: #007bff;
}

.answer-item:hover .answer-content {
    color: #495057;
}

/* 포커스 상태 개선 */
.btn:focus,
.form-control:focus {
    outline: none;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

/* 접근성 개선 */
@media (prefers-reduced-motion: reduce) {
    * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
}

/* 고대비 모드 지원 */
@media (prefers-contrast: high) {
    .btn {
        border: 2px solid currentColor;
    }
    
    .form-control {
        border: 2px solid currentColor;
    }
    
    .question-item,
    .answer-item {
        border: 2px solid currentColor;
    }
}
