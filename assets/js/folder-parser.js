// ===== PARSER MỚI CHO CẤU TRÚC FOLDER =====

// ===== HELPER FUNCTIONS =====
// Nếu chưa có slugify trong utils.js, định nghĩa ở đây
if (typeof slugify === 'undefined') {
    function slugify(text) {
        return text
            .toString()
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd')
            .replace(/Đ/g, 'D')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }
}

// Parse frontmatter từ markdown (nếu chưa có trong markdown-parser.js)
if (typeof parseFrontmatter === 'undefined') {
    function parseFrontmatter(content) {
        const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
        const match = content.match(frontmatterRegex);

        if (!match) {
            return { frontmatter: {}, body: content };
        }

        const frontmatterText = match[1];
        const body = match[2];
        const frontmatter = {};

        frontmatterText.split('\n').forEach(line => {
            const colonIndex = line.indexOf(':');
            if (colonIndex > -1) {
                const key = line.substring(0, colonIndex).trim();
                const value = line.substring(colonIndex + 1).trim();
                frontmatter[key] = value;
            }
        });

        return { frontmatter, body };
    }
}

/**
 * Load tất cả các khóa học từ tệp chỉ mục dữ liệu
 * @returns {Promise<Array>} Danh sách khóa học
 */
async function loadAllCoursesFromFolders() {
    try {
        const response = await fetch('assets/data-index.json');
        if (!response.ok) throw new Error('Không thể tải assets/data-index.json');

        const data = await response.json();
        const courses = [];

        for (const courseInfo of data.courses) {
            const course = await loadCourseFromFolder(courseInfo);
            if (course) {
                courses.push(course);
            }
        }
        return courses;
    } catch (error) {
        console.error('Lỗi khi load danh sách khóa học:', error);
        return [];
    }
}

/**
 * Load một khóa học dựa trên thông tin từ index
 * @param {Object} courseInfo - Thông tin khóa học từ JSON index
 * @returns {Promise<Object>} Thông tin khóa học đầy đủ
 */
async function loadCourseFromFolder(courseInfo) {
    const lessons = [];

    for (const lessonData of courseInfo.lessons) {
        const lessonPath = typeof lessonData === 'string' ? lessonData : lessonData.path;
        try {
            const lesson = await loadLessonFromFolder(courseInfo.title, lessonPath);
            if (lesson) {
                // Nếu có định nghĩa PDF cụ thể trong index.json, ghi đè lên
                if (typeof lessonData === 'object') {
                    if (lessonData.lecturePdf) lesson.materials.lecture = lessonData.lecturePdf;
                    if (lessonData.homeworkPdf) lesson.materials.homework = lessonData.homeworkPdf;
                }
                lessons.push(lesson);
            }
        } catch (error) {
            console.error(`Lỗi khi load bài học bài "${lessonPath}":`, error);
        }
    }

    return {
        id: courseInfo.id,
        title: courseInfo.title,
        description: courseInfo.description || `Khóa học ${courseInfo.title}`,
        thumbnail: courseInfo.thumbnail || '📚',
        chapters: courseInfo.chapters || [],
        totalLessons: lessons.length,
        duration: calculateTotalDuration(lessons),
        level: 'Trung bình',
        lessons: lessons
    };
}

/**
 * Load một bài học từ các files dữ liệu mới
 * @param {string} courseName - Tên khóa học
 * @param {string} lessonName - Tên bài học
 * @returns {Promise<Object>} Thông tin bài học
 */
async function loadLessonFromFolder(courseName, lessonName) {
    const basePath = `data/${courseName}/${lessonName}`;

    try {
        // Helper để fetch linh hoạt (thử nhiều đường dẫn)
        async function fetchFile(paths) {
            for (const path of paths) {
                try {
                    const response = await fetch(path);
                    if (response.ok) return response;
                } catch (e) { }
            }
            return { ok: false };
        }

        // Tải các tệp dữ liệu linh hoạt
        console.log(`🔍 Đang tải dữ liệu cho bài: ${lessonName}`);
        const [lyThuyetRes, viDuRes, baiTapRes, linkRes] = await Promise.all([
            fetch(`${basePath}/lythuyet.md`),
            fetchFile([`${basePath}/vidu.json`, `${basePath}/tailieu/vidu.json`]),
            fetchFile([`${basePath}/baitap.json`, `${basePath}/tailieu/baitap.json`]),
            fetchFile([`${basePath}/linkbaigiang.json`, `${basePath}/tailieu/linkbaigiang.json`]),
        ]);

        const lyThuyetText = lyThuyetRes.ok ? await lyThuyetRes.text() : null;
        const viDuJson = viDuRes.ok ? await viDuRes.json() : null;
        const baiTapJson = baiTapRes.ok ? await baiTapRes.json() : null;
        const linkJson = linkRes.ok ? await linkRes.json() : null;

        if (linkJson) console.log('✅ Đã tìm thấy linkbaigiang.json:', linkJson);
        else console.warn('⚠️ Không tìm thấy linkbaigiang.json tại:', basePath);

        // Parse lý thuyết
        const theory = lyThuyetText ? parseLyThuyetMd(lyThuyetText) : null;

        // Xử lý ví dụ
        const examples = Array.isArray(viDuJson) ? viDuJson.map(ex => ({
            id: `vd-${ex.id}`,
            question: ex.question,
            solution: ex.explanation
        })) : [];

        // Xử lý bài tập
        let homework = null;
        if (Array.isArray(baiTapJson)) {
            const parts = lessonName.split('/');
            const chapter = parts.length > 1 ? parts[0] : 'Chương chung';
            const title = parts.pop();

            homework = {
                courseTitle: courseName,
                chapterName: chapter,
                title: title,
                totalQuestions: baiTapJson.length,
                questions: baiTapJson.map(q => ({
                    id: `q-${q.id}`,
                    question: q.question,
                    options: q.options.map(opt => {
                        if (typeof opt === 'string') {
                            const match = opt.match(/^([A-D])\.\s*(.*)/);
                            return { id: match ? match[1] : '', text: match ? match[2] : opt };
                        }
                        return opt;
                    }),
                    correctAnswer: q.answer,
                    explanation: q.explanation
                }))
            };
        }

        // Lấy youtubeId
        let youtubeId = '';
        if (linkJson) {
            // Xử lý trường hợp mảng
            const firstItem = Array.isArray(linkJson) ? linkJson[0] : linkJson;

            // Xử lý trường hợp object { title, url } hoặc string url trực tiếp
            const videoLink = typeof firstItem === 'object' ? (firstItem.url || firstItem.link || firstItem.youtubeUrl) : firstItem;

            if (videoLink) {
                youtubeId = extractYoutubeId(videoLink);
                console.log('🎥 Youtube ID trích xuất được:', youtubeId);
            }
        }

        // Giả định đường dẫn PDF tài liệu (Dựa trên cấu trúc folder của bạn)
        const materials = {
            lecture: `${basePath}/tailieu/tailieu_baigiang.pdf`,
            homework: `${basePath}/tailieu/baitap_venha.pdf`
        };

        const parts = lessonName.split('/');
        const chapter = parts.length > 1 ? parts[0] : 'Chương chung';
        const displayTitle = parts.length > 1 ? parts[parts.length - 1] : lessonName;

        return {
            id: slugify(lessonName),
            title: lessonName,
            chapter: chapter,
            shortTitle: displayTitle,
            order: extractLessonNumber(lessonName),
            duration: theory?.duration || '30 phút',
            youtubeId: youtubeId || theory?.youtubeId || '',
            theory: theory?.content || '',
            examples: examples,
            homework: homework,
            materials: materials
        };

    } catch (error) {
        console.error(`Lỗi khi load bài học từ folder "${lessonName}":`, error);
        return null;
    }
}

/**
 * Helper để extract Youtube ID từ URL
 */
function extractYoutubeId(url) {
    if (!url) return '';
    console.log('🔗 Đang trích xuất ID từ URL:', url);
    // Regex hỗ trợ nhiều định dạng link Youtube
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);

    if (match && match[2]) {
        const id = match[2];
        // Youtube ID thường là 11 ký tự, nhưng cho phép linh hoạt hơn để tránh lỗi với link giả
        return id.length >= 8 ? id : id;
    }

    // Trường hợp URL chỉ là ID
    if (url.length >= 8 && url.length <= 15 && !url.includes('/') && !url.includes('.')) {
        return url;
    }

    return '';
}

/**
 * Parse file lythuyet.md
 * @param {string} content - Nội dung file
 * @returns {Object} Theory object
 */
function parseLyThuyetMd(content) {
    const parsed = parseFrontmatter(content);
    const frontmatter = parsed?.frontmatter || {};
    const body = parsed?.body || content;

    return {
        title: frontmatter.title || '',
        youtubeId: frontmatter.youtubeId || '',
        duration: frontmatter.duration || '30 phút',
        content: body.trim()
    };
}

/**
 * Parse file vidu.md
 * @param {string} content - Nội dung file
 * @returns {Array} Mảng ví dụ
 */
function parseViDuMd(content) {
    const parsed = parseFrontmatter(content);
    const body = parsed?.body || content;

    // Split theo "---" (separator giữa các ví dụ)
    const parts = body.split(/\n---+\n/);
    const examples = [];

    for (const part of parts) {
        const trimmed = part.trim();
        if (!trimmed) continue;

        // Tìm "## Ví dụ X"
        const titleMatch = trimmed.match(/^##\s+(.+)/m);

        // Tìm "### Lời giải"
        const solutionIndex = trimmed.indexOf('### Lời giải');

        if (titleMatch && solutionIndex > -1) {
            const question = trimmed.substring(titleMatch[0].length, solutionIndex).trim();
            const solution = trimmed.substring(solutionIndex + '### Lời giải'.length).trim();

            examples.push({
                question: titleMatch[1] + '\n\n' + question,
                solution: solution
            });
        }
    }

    return examples;
}

/**
 * Parse file baitap.md
 * @param {string} content - Nội dung file
 * @returns {Object} Homework object
 */
function parseBaiTapMd(content) {
    const parsed = parseFrontmatter(content);
    const frontmatter = parsed?.frontmatter || {};
    const body = parsed?.body || content;

    // Split theo "---" (separator giữa các câu hỏi)
    const parts = body.split(/\n---+\n/);
    const questions = [];

    for (const part of parts) {
        const trimmed = part.trim();
        if (!trimmed) continue;

        // Parse từng câu hỏi
        const question = parseQuizQuestion(trimmed);
        if (question) {
            questions.push(question);
        }
    }

    return {
        title: frontmatter.title || 'Bài tập trắc nghiệm',
        totalQuestions: questions.length,
        questions: questions
    };
}

/**
 * Parse một câu hỏi quiz từ markdown
 * @param {string} text - Text của câu hỏi
 * @returns {Object|null} Question object
 */
function parseQuizQuestion(text) {
    // Tìm tiêu đề câu hỏi (## Câu X)
    const titleMatch = text.match(/^##\s+(.+)/m);
    if (!titleMatch) return null;

    const lines = text.split('\n');
    let questionText = '';
    let options = [];
    let correctAnswer = '';
    let explanation = '';

    let currentSection = 'question';
    let questionStarted = false;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        // Skip title
        if (line.startsWith('## ')) {
            questionStarted = true;
            continue;
        }

        if (!questionStarted) continue;

        // Detect options (A), B), C), D))
        if (/^[A-D]\)/.test(line)) {
            currentSection = 'options';
            const optionMatch = line.match(/^([A-D])\)\s+(.+?)(\s+\[correct\])?$/);
            if (optionMatch) {
                const optionId = optionMatch[1];
                const optionText = optionMatch[2].trim();
                const isCorrect = !!optionMatch[3];

                options.push({
                    id: optionId,
                    text: optionText
                });

                if (isCorrect) {
                    correctAnswer = optionId;
                }
            }
            continue;
        }

        // Detect explanation
        if (line.startsWith('**Lời giải:**')) {
            currentSection = 'explanation';
            continue;
        }

        // Collect content
        if (currentSection === 'question' && line) {
            questionText += line + '\n';
        } else if (currentSection === 'explanation' && line && !line.startsWith('**Đáp án:')) {
            explanation += line + '\n';
        }
    }

    if (!questionText || options.length === 0 || !correctAnswer) {
        return null;
    }

    return {
        id: slugify(titleMatch[1]),
        question: questionText.trim(),
        options: options,
        correctAnswer: correctAnswer,
        explanation: explanation.trim()
    };
}

/**
 * Get config cho một khóa học
 * @param {string} courseName - Tên khóa học
 * @returns {Object|null} Config object
 */
function getCourseConfig(courseName) {
    const configs = {
        'Toán 12': {
            description: 'Chương trình Toán lớp 12 - Bộ sách mới',
            thumbnail: '📐',
            level: 'Trung bình',
            lessons: [
                'Chương 3 - Nguyên hàm tích phân/Bài 1',
                'Chương 3 - Nguyên hàm tích phân/Bài 2',
                'Chương 3 - Nguyên hàm tích phân/Bài 3',
                'Chương 3 - Nguyên hàm tích phân/Bài 4'
            ]
        },
        'Vật lý 12': {
            description: 'Chương trình Vật lý lớp 12 - Bộ sách mới',
            thumbnail: '⚛️',
            level: 'Trung bình',
            lessons: [
                // Thêm các bài học vào đây
            ]
        },
        'Hóa học 12': {
            description: 'Chương trình Hóa học lớp 12 - Bộ sách mới',
            thumbnail: '🧪',
            level: 'Trung bình',
            lessons: [
                // Thêm các bài học vào đây
            ]
        }
    };

    return configs[courseName] || null;
}

// ===== HELPER FUNCTIONS =====

/**
 * Extract số thứ tự bài học từ tên
 * @param {string} lessonName - Tên bài học
 * @returns {number} Số thứ tự
 */
function extractLessonNumber(lessonName) {
    const match = lessonName.match(/Bài\s+(\d+)/i);
    return match ? parseInt(match[1]) : 0;
}

/**
 * Tính tổng thời lượng từ danh sách lessons
 * @param {Array} lessons - Danh sách lessons
 * @returns {string} Thời lượng tổng
 */
function calculateTotalDuration(lessons) {
    let totalMinutes = 0;

    for (const lesson of lessons) {
        const match = lesson.duration?.match(/(\d+)/);
        if (match) {
            totalMinutes += parseInt(match[1]);
        }
    }

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours > 0) {
        return minutes > 0 ? `${hours} giờ ${minutes} phút` : `${hours} giờ`;
    }
    return `${minutes} phút`;
}
