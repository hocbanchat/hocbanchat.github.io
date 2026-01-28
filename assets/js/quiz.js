// ===== QUIZ LOGIC =====

let quizState = {
    answers: {},
    submitted: false,
    score: 0,
    correctCount: 0,
    incorrectCount: 0
};

/**
 * Render quiz trắc nghiệm
 * @param {Object} homework - Dữ liệu bài tập về nhà
 * @param {string} containerId - ID của container
 */
function renderQuiz(homework, containerId = 'homework-section') {
    const container = document.getElementById(containerId);
    if (!container || !homework || !homework.questions) return;

    const html = `
        <div class="quiz-container">
            <div class="quiz-header">
                <h2>📝 ${homework.title || 'Bài Tập Về Nhà'}</h2>
                <div class="quiz-info">
                    <span>📊 Tổng số câu: ${homework.totalQuestions || homework.questions.length}</span>
                    <span>✅ Điểm đạt: ${homework.passingScore || 5}/10</span>
                </div>
            </div>

            <div id="quiz-results" class="quiz-results"></div>

            <div class="quiz-questions">
                ${homework.questions.map((q, index) => `
                    <div class="question-item" data-question-id="${q.id}">
                        <div class="question-header">
                            <div class="question-number">${index + 1}</div>
                            <div class="question-text">${q.question}</div>
                        </div>
                        <div class="question-options">
                            ${q.options.map((opt, optIndex) => `
                                <div class="option-item" 
                                     data-question-id="${q.id}" 
                                     data-option-id="${opt.id}"
                                     onclick="selectAnswer('${q.id}', '${opt.id}')">
                                    <div class="option-label">${opt.id}</div>
                                    <div class="option-text">${opt.text}</div>
                                    <div class="option-icon">
                                        <span class="correct-icon">✓</span>
                                        <span class="incorrect-icon">✗</span>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                        <div class="question-explanation" id="explanation-${q.id}">
                            <div class="explanation-title">💡 Lời Giải Chi Tiết</div>
                            <div class="explanation-content">${parseMarkdown(q.explanation)}</div>
                        </div>
                    </div>
                `).join('')}
            </div>

            <div class="quiz-submit">
                <button id="submit-quiz-btn" class="btn btn-primary btn-large" onclick="submitQuiz()">
                    Nộp Bài và Xem Kết Quả
                </button>
            </div>

            <div class="quiz-actions" style="display: none;" id="quiz-actions">
                <button class="btn btn-secondary" onclick="resetQuiz()">
                    🔄 Làm Lại
                </button>
                <button class="btn btn-primary" onclick="window.scrollTo({top: 0, behavior: 'smooth'})">
                    ⬆️ Về Đầu Trang
                </button>
            </div>
        </div>
    `;

    container.innerHTML = html;

    // Reset quiz state
    quizState = {
        answers: {},
        submitted: false,
        score: 0,
        correctCount: 0,
        incorrectCount: 0,
        homework: homework
    };
}

/**
 * Chọn đáp án
 * @param {string} questionId - ID câu hỏi
 * @param {string} optionId - ID đáp án
 */
function selectAnswer(questionId, optionId) {
    if (quizState.submitted) return;

    // Remove previous selection
    const questionOptions = document.querySelectorAll(`[data-question-id="${questionId}"].option-item`);
    questionOptions.forEach(opt => opt.classList.remove('selected'));

    // Add selection to clicked option
    const selectedOption = document.querySelector(`[data-question-id="${questionId}"][data-option-id="${optionId}"]`);
    if (selectedOption) {
        selectedOption.classList.add('selected');
    }

    // Save answer
    quizState.answers[questionId] = optionId;
}

/**
 * Nộp bài và chấm điểm
 */
function submitQuiz() {
    const homework = quizState.homework;
    if (!homework) return;

    // Check if all questions are answered
    const totalQuestions = homework.questions.length;
    const answeredQuestions = Object.keys(quizState.answers).length;

    if (answeredQuestions < totalQuestions) {
        showError(`Bạn chưa trả lời đủ ${totalQuestions} câu hỏi! (Đã trả lời: ${answeredQuestions}/${totalQuestions})`);
        return;
    }

    // Mark as submitted
    quizState.submitted = true;

    // Calculate score
    let correctCount = 0;
    let incorrectCount = 0;

    homework.questions.forEach(question => {
        const userAnswer = quizState.answers[question.id];
        const isCorrect = userAnswer === question.correctAnswer;

        const questionItem = document.querySelector(`.question-item[data-question-id="${question.id}"]`);
        const selectedOption = document.querySelector(`[data-question-id="${question.id}"][data-option-id="${userAnswer}"]`);
        const correctOption = document.querySelector(`[data-question-id="${question.id}"][data-option-id="${question.correctAnswer}"]`);

        // Disable all options
        const allOptions = document.querySelectorAll(`[data-question-id="${question.id}"].option-item`);
        allOptions.forEach(opt => opt.classList.add('disabled'));

        if (isCorrect) {
            correctCount++;
            questionItem.classList.add('correct');
            if (selectedOption) selectedOption.classList.add('correct');
        } else {
            incorrectCount++;
            questionItem.classList.add('incorrect');
            if (selectedOption) selectedOption.classList.add('incorrect');
            if (correctOption) correctOption.classList.add('correct');

            // Show explanation for incorrect answers
            const explanation = document.getElementById(`explanation-${question.id}`);
            if (explanation) explanation.classList.add('show');
        }
    });

    // Calculate final score (thang điểm 10)
    const score = (correctCount / totalQuestions) * 10;

    quizState.correctCount = correctCount;
    quizState.incorrectCount = incorrectCount;
    quizState.score = score.toFixed(1);

    // Show results
    displayResults();

    // Hide submit button, show actions
    document.getElementById('submit-quiz-btn').style.display = 'none';
    document.getElementById('quiz-actions').style.display = 'flex';

    // Scroll to results
    smoothScrollTo('#quiz-results');

    // ===== GỬI ĐIỂM LÊN GOOGLE SHEETS =====
    // Chuẩn bị dữ liệu
    const currentUrl = window.location.href;
    const urlParams = new URLSearchParams(window.location.search);
    const courseId = urlParams.get('courseId');
    const lessonId = urlParams.get('lessonId');

    const scoreData = {
        courseName: quizState.homework.courseTitle || courseId || 'Unknown Course',
        chapterName: quizState.homework.chapterName || '',
        lessonName: quizState.homework.title || 'Unknown Lesson',
        score: parseFloat(score.toFixed(1)),
        correctCount: correctCount,
        totalQuestions: totalQuestions
    };

    // Gửi điểm (async, không block UI)
    if (typeof submitScoreToSheets === 'function') {
        submitScoreToSheets(scoreData).then(success => {
            if (success) {
                // Hiển thị badge "Đã lưu điểm"
                showScoreSubmittedBadge();
            }
        }).catch(err => {
            console.error('Error submitting score:', err);
        });
    }
}

/**
 * Hiển thị kết quả
 */
function displayResults() {
    const resultsContainer = document.getElementById('quiz-results');
    if (!resultsContainer) return;

    const { score, correctCount, incorrectCount } = quizState;
    const totalQuestions = quizState.homework.questions.length;
    const passingScore = quizState.homework.passingScore || 5;

    const passed = parseFloat(score) >= passingScore;
    const message = passed
        ? '🎉 Xuất Sắc! Bạn đã vượt qua bài kiểm tra!'
        : '💪 Cố gắng lên! Hãy xem lại lý thuyết và thử lại!';

    const html = `
        <div class="results-score">${score}</div>
        <div class="results-message">${message}</div>
        <div class="results-details">Điểm của bạn: ${score}/10</div>
        <div class="results-stats">
            <div class="stat-item correct">
                <span class="stat-value">${correctCount}</span>
                <span class="stat-label">Câu đúng</span>
            </div>
            <div class="stat-item incorrect">
                <span class="stat-value">${incorrectCount}</span>
                <span class="stat-label">Câu sai</span>
            </div>
            <div class="stat-item">
                <span class="stat-value">${totalQuestions}</span>
                <span class="stat-label">Tổng số câu</span>
            </div>
        </div>
    `;

    resultsContainer.innerHTML = html;
    resultsContainer.classList.add('show');

    // Save result to localStorage
    saveQuizResult(quizState.homework.title, score, correctCount, totalQuestions);
}

/**
 * Làm lại quiz
 */
function resetQuiz() {
    // Reset state
    quizState.answers = {};
    quizState.submitted = false;
    quizState.score = 0;
    quizState.correctCount = 0;
    quizState.incorrectCount = 0;

    // Remove all classes
    document.querySelectorAll('.question-item').forEach(item => {
        item.classList.remove('correct', 'incorrect');
    });

    document.querySelectorAll('.option-item').forEach(opt => {
        opt.classList.remove('selected', 'correct', 'incorrect', 'disabled');
    });

    document.querySelectorAll('.question-explanation').forEach(exp => {
        exp.classList.remove('show');
    });

    // Hide results
    const resultsContainer = document.getElementById('quiz-results');
    if (resultsContainer) {
        resultsContainer.classList.remove('show');
        resultsContainer.innerHTML = '';
    }

    // Show submit button, hide actions
    document.getElementById('submit-quiz-btn').style.display = 'inline-block';
    document.getElementById('quiz-actions').style.display = 'none';

    // Scroll to top of quiz
    smoothScrollTo('.quiz-container');
}

/**
 * Lưu kết quả quiz vào localStorage
 * @param {string} quizTitle - Tiêu đề quiz
 * @param {number} score - Điểm số
 * @param {number} correctCount - Số câu đúng
 * @param {number} totalQuestions - Tổng số câu
 */
function saveQuizResult(quizTitle, score, correctCount, totalQuestions) {
    const results = getFromLocalStorage('quiz_results') || [];
    results.push({
        title: quizTitle,
        score: score,
        correctCount: correctCount,
        totalQuestions: totalQuestions,
        date: new Date().toISOString()
    });
    saveToLocalStorage('quiz_results', results);
}
