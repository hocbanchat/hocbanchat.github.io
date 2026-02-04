/**
 * Script tự động quét cấu trúc folder trong thư mục data/
 * và tạo file data-index.json
 * 
 * Cách sử dụng:
 * 1. Cài đặt Node.js (nếu chưa có)
 * 2. Chạy lệnh: node scripts/generate-data-index.js
 * 3. File assets/data-index.json sẽ được tạo tự động
 */

const fs = require('fs');
const path = require('path');

// ===== CẤU HÌNH =====
const DATA_DIR = path.join(__dirname, '../data');
const OUTPUT_FILE = path.join(__dirname, '../assets/data-index.json');

// Mapping emoji cho các khóa học
const COURSE_ICONS = {
    'Toán 12': '📐',
    'Vật lý 12': '⚛️',
    'Hóa học 12': '🧪',
    'Sinh học 12': '🧬',
    'Hóa học 11': '🧪',
    'Toán 11': '📐'
};

// ===== HÀM TIỆN ÍCH =====

/**
 * Tạo slug từ tên (để làm ID)
 */
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

/**
 * Kiểm tra xem thư mục có phải là thư mục bài học không
 * (Có chứa ít nhất 1 file: lythuyet.md, vidu.json, baitap.json, hoặc linkbaigiang.json)
 */
function isLessonFolder(folderPath) {
    try {
        const files = fs.readdirSync(folderPath);
        const hasLessonFiles = files.some(file =>
            file === 'lythuyet.md' ||
            file === 'vidu.json' ||
            file === 'baitap.json' ||
            file === 'linkbaigiang.json'
        );
        return hasLessonFiles;
    } catch (error) {
        return false;
    }
}

/**
 * Tìm file PDF trong thư mục tailieu
 */
function findPdfFiles(lessonPath) {
    const tailieuPath = path.join(lessonPath, 'tailieu');
    const result = {
        lecturePdf: '',
        homeworkPdf: ''
    };

    if (!fs.existsSync(tailieuPath)) {
        return result;
    }

    try {
        const files = fs.readdirSync(tailieuPath);

        files.forEach(file => {
            if (file.endsWith('.pdf')) {
                const lowerFile = file.toLowerCase();
                // Tìm file bài giảng
                if (lowerFile.includes('file học') || lowerFile.includes('baigiang') || lowerFile.includes('tailieu')) {
                    result.lecturePdf = `data/${path.relative(DATA_DIR, path.join(tailieuPath, file))}`.replace(/\\/g, '/');
                }
                // Tìm file bài tập về nhà
                if (lowerFile.includes('btvn') || lowerFile.includes('baitap') || lowerFile.includes('venha')) {
                    result.homeworkPdf = `data/${path.relative(DATA_DIR, path.join(tailieuPath, file))}`.replace(/\\/g, '/');
                }
            }
        });
    } catch (error) {
        console.warn(`⚠️  Không thể đọc thư mục tailieu: ${tailieuPath}`);
    }

    return result;
}

/**
 * Quét một thư mục chương để tìm các bài học
 */
function scanChapterFolder(chapterPath, chapterName) {
    const lessons = [];

    try {
        const items = fs.readdirSync(chapterPath, { withFileTypes: true });

        items.forEach(item => {
            if (item.isDirectory()) {
                const lessonPath = path.join(chapterPath, item.name);

                // Kiểm tra xem có phải là folder bài học không
                if (isLessonFolder(lessonPath)) {
                    const relativePath = `${chapterName}/${item.name}`;
                    const pdfFiles = findPdfFiles(lessonPath);

                    lessons.push({
                        path: relativePath,
                        lecturePdf: pdfFiles.lecturePdf,
                        homeworkPdf: pdfFiles.homeworkPdf
                    });

                    console.log(`   ✓ Tìm thấy bài học: ${item.name}`);
                }
            }
        });
    } catch (error) {
        console.error(`❌ Lỗi khi quét chương "${chapterName}":`, error.message);
    }

    return lessons;
}

/**
 * Quét một thư mục khóa học để tìm các chương và bài học
 */
function scanCourseFolder(coursePath, courseName) {
    const chapters = [];
    const lessons = [];

    try {
        const items = fs.readdirSync(coursePath, { withFileTypes: true });

        items.forEach(item => {
            if (item.isDirectory()) {
                const chapterPath = path.join(coursePath, item.name);
                const chapterName = item.name;

                // Thêm vào danh sách chương
                chapters.push(chapterName);
                console.log(`  📂 Quét chương: ${chapterName}`);

                // Quét các bài học trong chương
                const chapterLessons = scanChapterFolder(chapterPath, chapterName);
                lessons.push(...chapterLessons);
            }
        });
    } catch (error) {
        console.error(`❌ Lỗi khi quét khóa học "${courseName}":`, error.message);
    }

    return { chapters, lessons };
}

/**
 * Quét toàn bộ thư mục data/
 */
function scanDataFolder() {
    console.log('🔍 Bắt đầu quét thư mục data/...\n');

    if (!fs.existsSync(DATA_DIR)) {
        console.error(`❌ Không tìm thấy thư mục: ${DATA_DIR}`);
        process.exit(1);
    }

    const courses = [];
    const items = fs.readdirSync(DATA_DIR, { withFileTypes: true });

    items.forEach(item => {
        if (item.isDirectory()) {
            const courseName = item.name;
            const coursePath = path.join(DATA_DIR, courseName);

            console.log(`📚 Quét khóa học: ${courseName}`);

            const { chapters, lessons } = scanCourseFolder(coursePath, courseName);

            // Đọc thông tin từ info.json nếu có
            let courseInfo = {
                title: courseName,
                description: `Chương trình ${courseName} - Bộ sách mới`,
                thumbnail: COURSE_ICONS[courseName] || '📚'
            };

            const infoPath = path.join(coursePath, 'info.json');
            if (fs.existsSync(infoPath)) {
                try {
                    const info = JSON.parse(fs.readFileSync(infoPath, 'utf8'));
                    courseInfo = { ...courseInfo, ...info };
                } catch (e) {
                    console.warn(`⚠️ Lỗi đọc info.json của ${courseName}:`, e.message);
                }
            }

            courses.push({
                id: slugify(courseName),
                title: courseInfo.title,
                description: courseInfo.description,
                thumbnail: courseInfo.thumbnail,
                chapters: chapters,
                lessons: lessons
            });

            console.log(`  ✅ Tìm thấy ${chapters.length} chương, ${lessons.length} bài học\n`);
        }
    });

    return { courses };
}

/**
 * Ghi dữ liệu ra file JSON
 */
function writeDataIndex(data) {
    try {
        // Tạo thư mục assets nếu chưa có
        const assetsDir = path.dirname(OUTPUT_FILE);
        if (!fs.existsSync(assetsDir)) {
            fs.mkdirSync(assetsDir, { recursive: true });
        }

        // Ghi file với format đẹp
        fs.writeFileSync(
            OUTPUT_FILE,
            JSON.stringify(data, null, 4),
            'utf8'
        );

        console.log('✅ Đã tạo file data-index.json thành công!');
        console.log(`📁 Đường dẫn: ${OUTPUT_FILE}`);
        console.log(`📊 Tổng số khóa học: ${data.courses.length}`);

        // Thống kê
        let totalLessons = 0;
        data.courses.forEach(course => {
            totalLessons += course.lessons.length;
            console.log(`   - ${course.title}: ${course.lessons.length} bài học`);
        });
        console.log(`📖 Tổng số bài học: ${totalLessons}`);

    } catch (error) {
        console.error('❌ Lỗi khi ghi file:', error.message);
        process.exit(1);
    }
}

// ===== MAIN =====
function main() {
    console.log('╔════════════════════════════════════════════╗');
    console.log('║  TỰ ĐỘNG TẠO DATA-INDEX.JSON              ║');
    console.log('╚════════════════════════════════════════════╝\n');

    const data = scanDataFolder();
    writeDataIndex(data);

    console.log('\n✨ Hoàn thành! Bạn có thể reload trang web để xem kết quả.');
}

// Chạy script
main();
