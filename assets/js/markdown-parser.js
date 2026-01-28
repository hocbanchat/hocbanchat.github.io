// ===== MARKDOWN PARSER =====

/**
 * Parse YAML frontmatter từ markdown
 * @param {string} content - Nội dung markdown
 * @returns {Object} {metadata, body}
 */
function parseFrontmatter(content) {
    const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
    const match = content.match(frontmatterRegex);

    if (!match) {
        return { metadata: {}, body: content };
    }

    const [, frontmatter, body] = match;
    const metadata = {};

    frontmatter.split('\n').forEach(line => {
        const [key, ...valueParts] = line.split(':');
        if (key && valueParts.length > 0) {
            const value = valueParts.join(':').trim();
            metadata[key.trim()] = value;
        }
    });

    return { metadata, body };
}

/**
 * Parse phần ví dụ từ markdown
 * @param {string} examplesSection - Nội dung phần examples
 * @returns {Array} Mảng các ví dụ
 */
function parseExamples(examplesSection) {
    if (!examplesSection) return [];

    const examples = [];
    const exampleBlocks = examplesSection.split(/^## Ví dụ \d+/m).filter(block => block.trim());

    exampleBlocks.forEach((block, index) => {
        const parts = block.split(/^### Lời giải/m);
        const question = parts[0]?.trim() || '';
        const solution = parts[1]?.trim() || '';

        if (question) {
            examples.push({
                id: `vd-${index + 1}`,
                question: question,
                solution: solution
            });
        }
    });

    return examples;
}

/**
 * Parse phần quiz từ markdown
 * @param {string} quizSection - Nội dung phần quiz
 * @returns {Object} Object homework với questions array
 */
function parseQuiz(quizSection) {
    if (!quizSection) return null;

    const questions = [];
    const questionBlocks = quizSection.split(/^### q\d+/m).filter(block => block.trim());

    questionBlocks.forEach((block, index) => {
        const lines = block.trim().split('\n');

        // Dòng đầu tiên là câu hỏi
        const questionText = lines[0]?.trim();
        if (!questionText) return;

        const options = [];
        let correctAnswer = 'A';
        let explanation = '';
        let inExplanation = false;

        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();

            // Parse options (A), B), C), D))
            const optionMatch = line.match(/^([A-D])\)\s*(.+?)(\s*\[correct\])?$/);
            if (optionMatch) {
                const [, id, text, isCorrect] = optionMatch;
                options.push({ id, text: text.trim() });
                if (isCorrect) {
                    correctAnswer = id;
                }
                continue;
            }

            // Bắt đầu lời giải
            if (line.includes('**Lời giải:**') || line.includes('Lời giải:')) {
                inExplanation = true;
                continue;
            }

            // Thu thập lời giải
            if (inExplanation && line) {
                explanation += line + '\n';
            }
        }

        if (options.length > 0) {
            questions.push({
                id: `q${index + 1}`,
                order: index + 1,
                question: questionText,
                type: 'multiple-choice',
                options: options,
                correctAnswer: correctAnswer,
                explanation: explanation.trim(),
                points: 1
            });
        }
    });

    if (questions.length === 0) return null;

    return {
        title: 'Bài Tập Về Nhà',
        totalQuestions: questions.length,
        passingScore: 5,
        questions: questions
    };
}

/**
 * Parse file markdown lesson
 * @param {string} content - Nội dung markdown
 * @returns {Object} Lesson object
 */
function parseMarkdownLesson(content) {
    const { metadata, body } = parseFrontmatter(content);

    // Tách các phần
    const parts = body.split(/---EXAMPLES---|---QUIZ---/);
    const theorySection = parts[0]?.trim() || '';
    const examplesSection = parts[1]?.trim() || '';
    const quizSection = parts[2]?.split('---QUIZ_END---')[0]?.trim() || '';

    // Parse theory
    const theory = {
        content: theorySection,
        format: 'markdown'
    };

    // Parse examples
    const examples = parseExamples(examplesSection);

    // Parse quiz
    const homework = parseQuiz(quizSection);

    return {
        id: metadata.id || 'unknown',
        title: metadata.title || 'Untitled',
        order: parseInt(metadata.order) || 1,
        duration: metadata.duration || '30 phút',
        youtubeId: metadata.youtubeId || '',
        theory: theory,
        examples: examples,
        homework: homework
    };
}

/**
 * Load và parse tất cả markdown files trong một khóa học
 * @param {string} courseId - ID khóa học
 * @returns {Promise<Object>} Course object
 */
async function loadMarkdownCourse(courseId) {
    try {
        // Load course.md
        const courseMdPath = `data/courses/${courseId}/course.md`;
        const courseResponse = await fetch(courseMdPath);
        if (!courseResponse.ok) throw new Error('Không tìm thấy file course.md');

        const courseContent = await courseResponse.text();
        const { metadata: courseMetadata } = parseFrontmatter(courseContent);

        // Load all lesson files
        const lessons = [];
        const lessonCount = parseInt(courseMetadata.totalLessons) || 10;

        for (let i = 1; i <= lessonCount; i++) {
            try {
                const lessonPath = `data/courses/${courseId}/bai-${i}.md`;
                const lessonResponse = await fetch(lessonPath);
                if (lessonResponse.ok) {
                    const lessonContent = await lessonResponse.text();
                    const lesson = parseMarkdownLesson(lessonContent);
                    lessons.push(lesson);
                }
            } catch (e) {
                // Skip missing lessons
                console.log(`Bài ${i} không tồn tại, bỏ qua...`);
            }
        }

        // Sort lessons by order
        lessons.sort((a, b) => a.order - b.order);

        return {
            id: courseMetadata.id || courseId,
            title: courseMetadata.title || 'Untitled Course',
            description: courseMetadata.description || '',
            thumbnail: courseMetadata.thumbnail || '📚',
            totalLessons: lessons.length,
            duration: courseMetadata.duration || 'N/A',
            level: courseMetadata.level || 'Trung bình',
            lessons: lessons
        };
    } catch (error) {
        console.error('Error loading markdown course:', error);
        return null;
    }
}

/**
 * Load danh sách tất cả các khóa học từ markdown
 * @returns {Promise<Object>} {courses: [...]}
 */
async function loadAllMarkdownCourses() {
    // Danh sách các khóa học (có thể đọc từ file index hoặc hardcode)
    const courseIds = ['toan-12-nguyen-ham']; // Thêm các khóa học khác vào đây

    const courses = [];
    for (const courseId of courseIds) {
        const course = await loadMarkdownCourse(courseId);
        if (course) {
            courses.push(course);
        }
    }

    return { courses };
}
