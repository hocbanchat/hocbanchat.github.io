// ===== GLOBAL STATE =====
let coursesData = null;
let currentCourse = null;
let currentLesson = null;
let currentQuizAnswers = {}; // Lưu đáp án người dùng { questionIndex: optionId }
let isQuizSubmitted = false;
let useMarkdown = true; // Sử dụng Markdown cho lý thuyết
let useFolderStructure = true; // Sử dụng cấu trúc folder JSON/MD mới

// ===== LOAD COURSES DATA =====
async function loadCoursesData() {
    if (coursesData) return coursesData;

    try {
        console.log('🔄 Bắt đầu tải dữ liệu khóa học...');

        if (useFolderStructure) {
            coursesData = await loadAllCoursesFromFolders();
        } else if (useMarkdown) {
            coursesData = await loadAllMarkdownCourses();
        } else {
            const response = await fetch('data/courses.json');
            if (!response.ok) throw new Error('Không thể tải dữ liệu khóa học');
            coursesData = await response.json();
        }

        console.log('✅ Dữ liệu đã tải:', coursesData);
        return coursesData;
    } catch (error) {
        console.error('❌ Lỗi khi tải dữ liệu:', error);
        if (typeof showError === 'function') showError('Lỗi khi tải dữ liệu: ' + error.message);
        return null;
    }
}

// ===== RENDER COURSES LIST (index.html) =====
async function renderCoursesList() {
    const container = document.getElementById('courses-grid');
    if (!container) return;

    const data = await loadCoursesData();
    const courses = Array.isArray(data) ? data : (data?.courses || []);

    if (!courses || courses.length === 0) {
        container.innerHTML = '<p class="error">Không có khóa học nào để hiển thị</p>';
        return;
    }

    const html = courses.map(course => `
        <div class="course-card" onclick="window.location.href='course.html?id=${course.id}'">
            <div class="course-thumbnail">
                <span>${course.thumbnail || '📚'}</span>
            </div>
            <div class="course-body">
                <h3 class="course-title">${course.title}</h3>
                <p class="course-description">${course.description}</p>
                <div class="course-meta">
                    <div class="course-meta-item">
                        <span>📖 ${course.totalLessons || course.lessons?.length || 0} bài học</span>
                    </div>
                </div>
            </div>
        </div>
    `).join('');

    container.innerHTML = html;
}

// ===== LOAD COURSE DETAILS (course.html) =====
async function loadCourseDetails(courseId) {
    const data = await loadCoursesData();
    if (!data) return;

    const courses = Array.isArray(data) ? data : (data?.courses || []);
    const course = courses.find(c => c.id === courseId);

    if (!course) {
        if (typeof showError === 'function') showError('Không tìm thấy khóa học');
        setTimeout(() => window.location.href = 'index.html', 2000);
        return;
    }

    currentCourse = course;

    // Update Header Info
    const breadcrumb = document.getElementById('course-breadcrumb');
    if (breadcrumb) breadcrumb.textContent = course.title;

    const courseInfoContainer = document.getElementById('course-info');
    if (courseInfoContainer) {
        courseInfoContainer.innerHTML = `
            <h1>${course.title}</h1>
            <p>${course.description}</p>
            <div class="course-info-meta">
                <span>📖 ${course.totalLessons || course.lessons?.length || 0} bài học</span>
                <span>⏱️ ${course.duration || 'N/A'}</span>
            </div>
        `;
    }

    // Render Lesson List
    renderCourseOutline(course, 'lessons-list', courseId);
}

// Helper to render lesson list (used in course.html and lesson.html sidebar)
// Helper to render lesson list grouped by chapters (used in course.html and lesson.html sidebar)
function renderCourseOutline(course, containerId, courseId, activeLessonId = null) {
    const container = document.getElementById(containerId);
    if (!container || !course.lessons) return;

    // Group lessons by chapter
    const lessonsByChapter = {};
    course.lessons.forEach(lesson => {
        const chapterName = lesson.chapter || 'Chương chung';
        if (!lessonsByChapter[chapterName]) {
            lessonsByChapter[chapterName] = [];
        }
        lessonsByChapter[chapterName].push(lesson);
    });

    // Determine content to render: use explicit chapters list if valid, otherwise derive from lessons
    let chaptersToRender = [];
    if (course.chapters && Array.isArray(course.chapters) && course.chapters.length > 0) {
        chaptersToRender = course.chapters;
    } else {
        chaptersToRender = Object.keys(lessonsByChapter);
    }

    let html = '';

    chaptersToRender.forEach((chapterName, index) => {
        const lessons = lessonsByChapter[chapterName] || [];
        const isActiveChapter = lessons.some(l => l.id === activeLessonId);

        const isOpen = 'open'; // Always open by default
        const displayStyle = 'block'; // Always visible by default
        const iconTransform = 'rotate(180deg)'; // Always rotated by default

        // If no lessons, message
        const lessonsHtml = lessons.length > 0 ? lessons.map((lesson, idx) => {
            const isActive = lesson.id === activeLessonId ? 'active' : '';
            const displayTitle = lesson.shortTitle || lesson.title.split('/').pop();
            return `
                <div class="lesson-item ${isActive}" onclick="event.stopPropagation(); window.location.href='lesson.html?courseId=${courseId}&lessonId=${lesson.id}'">
                    <div class="lesson-number">${idx + 1}</div>
                    <div class="lesson-info">
                        <div class="lesson-title">${displayTitle}</div>
                        <p class="lesson-duration">⏱️ ${lesson.duration || '30 phút'}</p>
                    </div>
                </div>
             `;
        }).join('') : '<div style="padding: 12px 16px; color: var(--text-muted); font-style: italic;">Chưa có bài học nào.</div>';

        html += `
            <div class="chapter-item ${isOpen}">
                <div class="chapter-header" onclick="toggleChapter(this)">
                    <div class="chapter-info">
                        <h4 class="chapter-title">${chapterName}</h4>
                    </div>
                    <span class="chapter-toggle-icon" style="transform: ${iconTransform}">▼</span>
                </div>
                <div class="chapter-lessons" style="display: ${displayStyle}">
                    ${lessonsHtml}
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

// Toggle function for Global Scope
window.toggleChapter = function (headerElement) {
    const chapterItem = headerElement.parentElement;
    const lessonsContainer = chapterItem.querySelector('.chapter-lessons');
    const icon = headerElement.querySelector('.chapter-toggle-icon');

    if (!lessonsContainer) return;

    const isClosed = lessonsContainer.style.display === 'none' || !lessonsContainer.style.display;

    if (isClosed) {
        lessonsContainer.style.display = 'block';
        if (icon) icon.style.transform = 'rotate(180deg)';
        chapterItem.classList.add('open');
    } else {
        lessonsContainer.style.display = 'none';
        if (icon) icon.style.transform = 'rotate(0deg)';
        chapterItem.classList.remove('open');
    }
}

// ===== LOAD LESSON DETAILS (lesson.html) =====
async function loadLessonDetails(courseId, lessonId) {
    const data = await loadCoursesData();
    if (!data) return;

    const courses = Array.isArray(data) ? data : (data?.courses || []);
    const course = courses.find(c => c.id === courseId);

    if (!course) return; // Should handle error

    const lesson = course.lessons.find(l => l.id === lessonId);
    if (!lesson) return;

    currentCourse = course;
    currentLesson = lesson;

    // 1. Update Breadcrumb
    const courseBreadcrumb = document.getElementById('course-breadcrumb-link');
    if (courseBreadcrumb) {
        courseBreadcrumb.textContent = course.title;
        courseBreadcrumb.onclick = () => window.location.href = `course.html?id=${courseId}`;
    }

    // 2. Render Sidebar Lesson List
    renderCourseOutline(course, 'sidebar-lessons-list', courseId, lessonId);

    // 3. Render Main Content (Video & Toolbar)
    const displayTitle = lesson.title.split('/').pop();
    const titleEl = document.getElementById('lesson-title-display');
    if (titleEl) titleEl.textContent = displayTitle;

    // Video Placeholder (Initial State)
    const videoWrapper = document.getElementById('video-placeholder');
    if (videoWrapper) {
        videoWrapper.innerHTML = `
            <div style="display:flex;align-items:center;justify-content:center;height:100%;background:#000;color:#fff;">
                <p>🔒 Vui lòng đăng nhập để xem video</p>
            </div>
        `;
    }

    // Clear Content Area (Initial State)
    const contentArea = document.getElementById('lesson-theory-content');
    if (contentArea) {
        contentArea.innerHTML = '';
    }

    // Check access right after loading lesson data
    if (window.updateLessonAccess) window.updateLessonAccess();
}

/**
 * [SECURE] Render Lesson Content - Chỉ gọi khi đã login
 */
function renderLessonContent(lesson) {
    console.log("🔓 Rendering lesson content for:", lesson.title);

    // 1. Render Video
    const videoWrapper = document.getElementById('video-placeholder');
    if (videoWrapper && lesson.youtubeId) {
        videoWrapper.innerHTML = `
            <iframe 
                src="https://www.youtube.com/embed/${lesson.youtubeId}" 
                frameborder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen>
            </iframe>
        `;
    }

    // 2. Render Buttons Logic
    // Toggle Content Scroll
    const btnContent = document.getElementById('btn-toggle-content');
    if (btnContent) {
        btnContent.onclick = () => {
            const area = document.getElementById('lesson-theory-content');
            if (area) area.scrollIntoView({ behavior: 'smooth' });
        };
    }
    // Download Doc
    const btnDoc = document.getElementById('btn-download-doc');
    if (btnDoc && lesson.materials?.lecture) {
        btnDoc.href = lesson.materials.lecture;
        btnDoc.style.display = 'inline-flex';
    }
    // Download HW
    const btnHW = document.getElementById('btn-download-hw');
    if (btnHW && lesson.materials?.homework) {
        btnHW.href = lesson.materials.homework;
        btnHW.style.display = 'inline-flex';
    }
    // Quiz Mode
    const btnQuiz = document.getElementById('btn-quiz-mode');
    if (btnQuiz && lesson.homework) {
        btnQuiz.style.display = 'inline-flex';
        btnQuiz.onclick = () => startQuizMode(lesson.homework);
    }

    // 3. Render Theory & Examples
    const contentArea = document.getElementById('lesson-theory-content');
    if (contentArea) {
        let html = '';

        // Theory
        if (lesson.theory) {
            html += `
                <div class="content-section">
                    <h2>📖 Lý Thuyết</h2>
                    <div class="theory-content">
                        ${typeof parseMarkdown === 'function' ? parseMarkdown(lesson.theory.content || lesson.theory) : lesson.theory}
                    </div>
                </div>
            `;
        }

        // Examples
        if (lesson.examples && lesson.examples.length > 0) {
            html += `
                <div class="content-section">
                    <h2>💡 Ví Dụ Minh Họa</h2>
                    ${lesson.examples.map((example, index) => `
                        <div class="example-item">
                            <div class="example-question">
                                <strong>Ví dụ ${index + 1}:</strong> ${example.question}
                            </div>
                            <button class="btn btn-secondary btn-small" onclick="toggleSolution('example-${index}')">
                                👁️ Xem lời giải
                            </button>
                            <div class="example-solution" id="example-${index}">
                                ${typeof parseMarkdown === 'function' ? parseMarkdown(example.solution) : example.solution}
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        }

        contentArea.innerHTML = html;
        // Trigger MathJax
        if (typeof MathJax !== 'undefined') MathJax.typesetPromise().catch(e => { });
    }
}

// [AI UPDATED] Setup toggle buttons - Function này được thay thế bởi renderLessonContent logic phía trên
function setupLessonButtons(lesson) {
    // Deprecated - Logic moved to renderLessonContent
}

// ===== QUIZ MODE LOGIC =====
// ===== QUIZ MODE LOGIC =====
function startQuizMode(homeworkData) {
    // Reset state
    currentQuizAnswers = {};
    isQuizSubmitted = false;

    // 1. Hide Main Interface, Show Quiz Interface
    document.getElementById('lesson-main-interface').style.display = 'none';
    document.getElementById('quiz-interface-container').style.display = 'block';

    // Update Quiz Title using Current Lesson Name
    const quizTitle = document.getElementById('quiz-header-title');
    if (quizTitle && currentLesson) {
        const lessonName = currentLesson.shortTitle || currentLesson.title.split('/').pop();
        quizTitle.textContent = `📝 Trắc nghiệm: ${lessonName}`;
    }

    // 2. Render Questions
    const questionsContainer = document.getElementById('quiz-questions-list');
    const statusGrid = document.getElementById('question-status-grid');

    if (!homeworkData || !homeworkData.questions) {
        questionsContainer.innerHTML = '<p>Không có bài tập trắc nghiệm.</p>';
        return;
    }

    // Render Questions List (Left)
    questionsContainer.innerHTML = homeworkData.questions.map((q, index) => `
        <div class="question-item" id="q-item-${index}" data-index="${index}">
            <div class="question-text">Câu ${index + 1}: ${q.question}</div>
            <div class="question-options">
                ${q.options.map((opt, optIndex) => `
                    <label class="option-label" id="opt-${index}-${opt.id || optIndex}">
                        <input type="radio" name="q-${index}" value="${opt.id || optIndex}" class="option-input" onchange="updateQuestionStatus(${index}, '${opt.id || optIndex}')">
                        <span class="option-text">${typeof opt === 'object' ? opt.text : opt}</span>
                    </label>
                `).join('')}
            </div>
            
            <!-- Explanation / Solution (Hidden by default) -->
            <div class="question-explanation" id="explanation-${index}">
                <div class="explanation-title">💡 Lời giải chi tiết</div>
                <div class="explanation-content">
                    ${typeof parseMarkdown === 'function' ? parseMarkdown(q.explanation || 'Chưa có lời giải chi tiết.') : (q.explanation || 'Chưa có lời giải chi tiết.')}
                </div>
            </div>
        </div>
    `).join('');

    // Render Status Grid (Right)
    statusGrid.innerHTML = homeworkData.questions.map((_, index) => `
        <div class="question-status-item" id="status-${index}" onclick="scrollToQuestion(${index})">
            ${index + 1}
        </div>
    `).join('');

    // 3. Setup Exit Button
    const btnExit = document.getElementById('btn-exit-quiz');
    if (btnExit) {
        btnExit.onclick = () => {
            if (confirm('Bạn có chắc muốn thoát bài làm không? Kết quả sẽ không được lưu.')) {
                document.getElementById('quiz-interface-container').style.display = 'none';
                document.getElementById('lesson-main-interface').style.display = 'grid'; // Restore grid

                // RESTORE TOGGLES
                const lessonToggle = document.querySelector('.sidebar-toggle-btn:not(.quiz-toggle)');
                const quizToggle = document.getElementById('quiz-sidebar-toggle-btn');
                if (lessonToggle) lessonToggle.style.display = ''; // Restore default css
                if (quizToggle) quizToggle.style.display = 'none';
            }
        };
    }

    // TOGGLE BUTTONS MANAGEMENT
    const lessonToggle = document.querySelector('.sidebar-toggle-btn:not(.quiz-toggle)');
    const quizToggle = document.getElementById('quiz-sidebar-toggle-btn');

    // Hide Lesson Toggle, Show Quiz Toggle (if mobile)
    if (lessonToggle) lessonToggle.style.display = 'none';
    if (quizToggle && window.innerWidth <= 768) {
        quizToggle.style.display = 'block';
    } else if (quizToggle) {
        quizToggle.style.display = 'none'; // Ensure hidden on desktop
    }

    // Resize handler to manage quiz toggle visibility if user resizes while in quiz
    window.addEventListener('resize', () => {
        if (!document.getElementById('quiz-interface-container').style.display === 'none') return; // Not in quiz

        if (quizToggle) {
            quizToggle.style.display = window.innerWidth <= 768 ? 'block' : 'none';
        }
    });

    // Trigger MathJax
    if (typeof MathJax !== 'undefined') MathJax.typesetPromise().catch(e => { });
}

function updateQuestionStatus(index, value) {
    if (isQuizSubmitted) return; // Prevent changes after submit

    currentQuizAnswers[index] = value;

    // Update sidebar status
    const statusItem = document.getElementById(`status-${index}`);
    if (statusItem) {
        statusItem.classList.add('done');
        // Add styling for current selected item if needed
    }
}

// updateQuestionStatus function replaced/merged above

function scrollToQuestion(index) {
    const qItem = document.getElementById(`q-item-${index}`);
    if (qItem) qItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function toggleSolution(id) {
    const el = document.getElementById(id);
    if (el) {
        el.classList.toggle('show');
        // Toggle expanded class on parent for color change
        const parentItem = el.closest('.example-item');
        if (parentItem) {
            parentItem.classList.toggle('expanded', el.classList.contains('show'));
        }
        if (el.classList.contains('show') && typeof MathJax !== 'undefined') {
            MathJax.typesetPromise([el]).catch(e => { });
        }
    }
}

// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
document.addEventListener('click', (e) => {
    if (e.target.tagName === 'A' && e.target.getAttribute('href')?.startsWith('#')) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href');
        smoothScrollTo(targetId);
    }
});

// ===== FORM SUBMISSION HANDLER =====
// ===== FORM SUBMISSION HANDLER =====
document.addEventListener('submit', async (e) => {
    if (e.target.id === 'student-info-form') {
        e.preventDefault();

        if (isQuizSubmitted) return;

        // Lấy thông tin từ form hoặc từ user đang đăng nhập
        const currentUser = window.getCurrentUser ? window.getCurrentUser() : null;
        const formData = new FormData(e.target);
        const name = formData.get('fullname') || currentUser?.displayName;
        const className = formData.get('class');

        if (!name) {
            alert('Vui lòng điền họ tên hoặc đăng nhập!');
            return;
        }

        // Logic chấm điểm thực tế
        if (!currentLesson || !currentLesson.homework || !currentLesson.homework.questions) {
            alert('Lỗi dữ liệu bài tập!');
            return;
        }

        const questions = currentLesson.homework.questions;
        let correctCount = 0;

        questions.forEach((q, index) => {
            const userAnswer = currentQuizAnswers[index];
            const isCorrect = userAnswer === q.correctAnswer;

            if (isCorrect) correctCount++;

            // Visual Feedback on UI
            const questionItem = document.getElementById(`q-item-${index}`);
            if (questionItem) {
                questionItem.classList.add('graded');

                // Show Correct Answer
                const correctOptLabel = document.getElementById(`opt-${index}-${q.correctAnswer}`);
                if (correctOptLabel) correctOptLabel.classList.add('correct');

                // If user selected wrong, show error
                if (userAnswer && !isCorrect) {
                    const selectedOptLabel = document.getElementById(`opt-${index}-${userAnswer}`);
                    if (selectedOptLabel) selectedOptLabel.classList.add('incorrect');
                }

                // Show explanation
                const explanationEl = document.getElementById(`explanation-${index}`);
                if (explanationEl) {
                    explanationEl.classList.add('show');
                    // Retrigger Mathjax for explanation content
                    if (typeof MathJax !== 'undefined') MathJax.typesetPromise([explanationEl]).catch(e => { });
                }
            }

            // Update Sidebar Status
            const statusItem = document.getElementById(`status-${index}`);
            if (statusItem) {
                statusItem.classList.remove('done'); // Remove neutral done state
                if (isCorrect) statusItem.classList.add('correct');
                else statusItem.classList.add('incorrect');
            }
        });

        // Disable all inputs
        const inputs = document.querySelectorAll('.option-input, #student-info-form input, #student-info-form button[type="submit"]');
        inputs.forEach(input => input.disabled = true);

        isQuizSubmitted = true;

        const score = (correctCount / questions.length) * 10;

        // --- FIREBASE INTEGRATION ---
        const scoreData = {
            courseId: currentCourse.id,
            courseName: currentCourse.title,
            lessonId: currentLesson.id,
            lessonName: currentLesson.title,
            chapterName: currentLesson.chapter || '',
            score: score,
            correctCount: correctCount,
            totalQuestions: questions.length,
            className: className || 'Tự do'
        };

        if (window.saveUserScore) {
            const saved = await window.saveUserScore(scoreData);
            if (!saved && !currentUser) {
                console.log('Chưa đăng nhập, không lưu điểm vào hệ thống.');
            }
        }

        // Lưu tiến độ học tập
        if (window.saveProgress && currentUser) {
            const lessonPath = `${currentCourse.id}/${currentLesson.id}`;
            window.saveProgress(lessonPath);
        }
        // -----------------------------

        alert(`Nộp bài thành công!\n\nHọc viên: ${name}\nKết quả: ${correctCount}/${questions.length} câu đúng.\nĐiểm số: ${score.toFixed(1)}/10`);
    }
});
// ===== LOCK SCREEN LOGIC =====
function updateLessonAccess() {
    const lockScreen = document.getElementById('login-lock-screen');
    const nameDisplay = document.getElementById('display-student-name');

    // Only apply on Lesson Page
    if (!document.getElementById('lesson-main-interface')) return;

    if (!window.currentUser) {
        // --- CHƯA ĐĂNG NHẬP ---
        console.log("🔒 Access denied. Showing lock screen.");

        // 1. Show Lock Screen
        if (lockScreen) lockScreen.style.display = 'flex';

        // 2. Clear Critical Content (Security)
        const videoWrapper = document.getElementById('video-placeholder');
        if (videoWrapper) {
            videoWrapper.innerHTML = `
                <div style="display:flex;align-items:center;justify-content:center;height:100%;background:#000;color:#fff;">
                    <p>🔒 Vui lòng đăng nhập để xem video</p>
                </div>
            `;
        }

        const contentArea = document.getElementById('lesson-theory-content');
        if (contentArea) contentArea.innerHTML = '';

        // 3. Hide Buttons
        ['btn-download-doc', 'btn-download-hw', 'btn-quiz-mode'].forEach(id => {
            const btn = document.getElementById(id);
            if (btn) btn.style.display = 'none';
        });

    } else {
        // --- ĐÃ ĐĂNG NHẬP ---
        console.log("🔓 Access granted. User:", window.currentUser.displayName);

        // 1. Hide Lock Screen
        if (lockScreen) lockScreen.style.display = 'none';

        // 2. Update Student Name
        if (nameDisplay) {
            nameDisplay.textContent = window.currentUser.displayName || window.currentUser.email;
        }

        // 3. RENDER CONTENT (If not already rendered)
        const videoWrapper = document.getElementById('video-placeholder');
        // Simple check: if video wrapper has iframe, it's rendered. 
        // Better check: use a flag or check innerHTML content.
        if (videoWrapper && !videoWrapper.querySelector('iframe') && currentLesson) {
            renderLessonContent(currentLesson);
        }
    }
}
window.updateLessonAccess = updateLessonAccess;

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;
    if (path.includes('index.html') || path.endsWith('/')) {
        renderCoursesList();
    }
    // course.html and lesson.html call specific loaders via inline script
});

// ===== DASHBOARD LOGIC (Home Page) =====
window.loadDashboardContent = function (user) {
    const container = document.getElementById('dashboard-container');
    if (!container) return;

    // Sử dụng iframe để load trọn vẹn logic của profile.html mà không lo conflict script
    container.innerHTML = `
        <iframe src="profile.html" 
            style="width: 100%; height: calc(100vh - 80px); border: none; display: block;"
            onload="this.contentWindow.document.querySelector('.header').style.display='none';">
        </iframe>
    `;
};
