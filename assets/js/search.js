/**
 * Search Module - Tìm kiếm bài học
 * =================================
 * Cung cấp chức năng tìm kiếm bài học trong toàn bộ hệ thống
 */

// Biến lưu trữ dữ liệu đã load
let searchData = null;
let searchTimeout = null;

/**
 * Khởi tạo module tìm kiếm
 */
async function initSearch() {
    // Load dữ liệu khóa học
    try {
        const response = await fetch('assets/data-index.json');
        searchData = await response.json();
        console.log('Search: Đã load dữ liệu tìm kiếm');
    } catch (error) {
        console.error('Search: Lỗi load dữ liệu', error);
        return;
    }

    // Lắng nghe sự kiện input trên thanh tìm kiếm
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearchInput);
        searchInput.addEventListener('focus', () => {
            const query = searchInput.value.trim();
            if (query.length >= 2) {
                showSearchResults(searchLessons(query));
            }
        });

        // Đóng dropdown khi click ra ngoài
        document.addEventListener('click', (e) => {
            const searchContainer = document.getElementById('search-container');
            if (searchContainer && !searchContainer.contains(e.target)) {
                hideSearchResults();
            }
        });

        // Xử lý phím Enter và Escape
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                hideSearchResults();
                searchInput.blur();
            }
        });
    }
}

/**
 * Xử lý sự kiện nhập tìm kiếm (debounce 300ms)
 */
function handleSearchInput(e) {
    const query = e.target.value.trim();

    // Xóa timeout cũ
    if (searchTimeout) {
        clearTimeout(searchTimeout);
    }

    // Nếu query quá ngắn, ẩn kết quả
    if (query.length < 2) {
        hideSearchResults();
        return;
    }

    // Debounce: đợi 300ms sau khi ngừng gõ
    searchTimeout = setTimeout(() => {
        const results = searchLessons(query);
        showSearchResults(results);
    }, 300);
}

/**
 * Tìm kiếm bài học theo từ khóa
 * @param {string} query - Từ khóa tìm kiếm
 * @returns {Array} Danh sách kết quả
 */
function searchLessons(query) {
    if (!searchData || !searchData.courses) return [];

    const results = [];
    const queryLower = query.toLowerCase();
    // Loại bỏ dấu tiếng Việt để so sánh
    const queryNormalized = removeVietnameseTones(queryLower);

    searchData.courses.forEach(course => {
        course.lessons.forEach(lesson => {
            const lessonName = lesson.path.split('/').pop();
            const chapterName = lesson.path.split('/')[0];

            // Tìm kiếm trong tên bài học và tên chương
            const lessonNameLower = lessonName.toLowerCase();
            const chapterNameLower = chapterName.toLowerCase();
            const lessonNormalized = removeVietnameseTones(lessonNameLower);
            const chapterNormalized = removeVietnameseTones(chapterNameLower);

            if (
                lessonNameLower.includes(queryLower) ||
                chapterNameLower.includes(queryLower) ||
                lessonNormalized.includes(queryNormalized) ||
                chapterNormalized.includes(queryNormalized)
            ) {
                results.push({
                    courseId: course.id,
                    courseTitle: course.title,
                    lessonName: lessonName,
                    chapterName: chapterName,
                    path: lesson.path
                });
            }
        });
    });

    return results.slice(0, 10); // Giới hạn 10 kết quả
}

/**
 * Loại bỏ dấu tiếng Việt để tìm kiếm dễ hơn
 */
function removeVietnameseTones(str) {
    return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D');
}

/**
 * Hiển thị kết quả tìm kiếm
 */
function showSearchResults(results) {
    let container = document.getElementById('search-results');

    // Tạo container nếu chưa có
    if (!container) {
        const searchContainer = document.getElementById('search-container');
        if (!searchContainer) return;

        container = document.createElement('div');
        container.id = 'search-results';
        container.className = 'absolute top-full left-0 right-0 mt-2 bg-[#1c1f27] border border-[#282e39] rounded-lg shadow-2xl z-50 max-h-[400px] overflow-y-auto';
        searchContainer.appendChild(container);
    }

    // Nếu không có kết quả
    if (results.length === 0) {
        container.innerHTML = `
            <div class="p-4 text-center text-[#9da6b9]">
                <span class="material-symbols-outlined text-2xl block mb-2">search_off</span>
                <p>Không tìm thấy kết quả</p>
            </div>
        `;
        container.classList.remove('hidden');
        return;
    }

    // Render kết quả
    container.innerHTML = results.map(result => `
        <a href="lesson.html?course=${result.courseId}&path=${encodeURIComponent(result.path)}"
           class="flex items-start gap-3 p-3 hover:bg-[#282e39] transition-colors border-b border-[#282e39] last:border-b-0">
            <span class="material-symbols-outlined text-primary mt-0.5">play_lesson</span>
            <div class="flex-1 min-w-0">
                <p class="text-white font-medium text-sm truncate">${result.lessonName}</p>
                <p class="text-[#9da6b9] text-xs truncate">${result.courseTitle} • ${result.chapterName}</p>
            </div>
            <span class="material-symbols-outlined text-[#9da6b9] text-sm">arrow_forward</span>
        </a>
    `).join('');

    container.classList.remove('hidden');
}

/**
 * Ẩn kết quả tìm kiếm
 */
function hideSearchResults() {
    const container = document.getElementById('search-results');
    if (container) {
        container.classList.add('hidden');
    }
}

// Khởi tạo khi DOM ready
document.addEventListener('DOMContentLoaded', initSearch);

// Export cho global scope
window.searchLessons = searchLessons;
window.initSearch = initSearch;
