// ===== UTILITY FUNCTIONS =====

/**
 * Lấy tham số từ URL
 * @param {string} param - Tên tham số
 * @returns {string|null} Giá trị tham số hoặc null
 */
function getUrlParameter(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

/**
 * Chuyển đổi Markdown sang HTML đơn giản
 * @param {string} markdown - Nội dung Markdown
 * @returns {string} HTML
 */
function parseMarkdown(markdown) {
    if (!markdown) return '';

    let html = markdown;

    // Headers
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

    // Bold
    html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');

    // Italic
    html = html.replace(/\*(.*?)\*/gim, '<em>$1</em>');

    // Lists
    html = html.replace(/^\- (.*$)/gim, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');

    // Line breaks
    html = html.replace(/\n\n/g, '</p><p>');
    html = '<p>' + html + '</p>';

    // Clean up empty paragraphs
    html = html.replace(/<p><\/p>/g, '');
    html = html.replace(/<p>(<h[1-6]>)/g, '$1');
    html = html.replace(/(<\/h[1-6]>)<\/p>/g, '$1');
    html = html.replace(/<p>(<ul>)/g, '$1');
    html = html.replace(/(<\/ul>)<\/p>/g, '$1');

    return html;
}

/**
 * Lưu dữ liệu vào localStorage
 * @param {string} key - Khóa
 * @param {*} value - Giá trị
 */
function saveToLocalStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
        console.error('Error saving to localStorage:', e);
    }
}

/**
 * Lấy dữ liệu từ localStorage
 * @param {string} key - Khóa
 * @returns {*} Giá trị hoặc null
 */
function getFromLocalStorage(key) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    } catch (e) {
        console.error('Error reading from localStorage:', e);
        return null;
    }
}

/**
 * Hiển thị thông báo lỗi
 * @param {string} message - Nội dung lỗi
 */
function showError(message) {
    console.error(message);
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.75rem;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        animation: slideInRight 0.3s ease-out;
    `;
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);

    setTimeout(() => {
        errorDiv.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => errorDiv.remove(), 300);
    }, 3000);
}

/**
 * Format thời gian (phút)
 * @param {number} minutes - Số phút
 * @returns {string} Thời gian đã format
 */
function formatDuration(minutes) {
    if (minutes < 60) {
        return `${minutes} phút`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours} giờ ${mins} phút` : `${hours} giờ`;
}

/**
 * Scroll mượt đến element
 * @param {string} selector - CSS selector
 */
function smoothScrollTo(selector) {
    const element = document.querySelector(selector);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

/**
 * Debounce function
 * @param {Function} func - Hàm cần debounce
 * @param {number} wait - Thời gian chờ (ms)
 * @returns {Function} Hàm đã debounce
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Export functions for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getUrlParameter,
        parseMarkdown,
        saveToLocalStorage,
        getFromLocalStorage,
        showError,
        formatDuration,
        smoothScrollTo,
        debounce
    };
}
