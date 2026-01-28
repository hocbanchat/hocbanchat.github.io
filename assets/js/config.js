// ===== CẤU HÌNH =====
// Thay URL này bằng URL Apps Script của bạn sau khi deploy
const CONFIG = {
    // URL từ Google Apps Script (sau khi deploy)
    APPS_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbzes17BdTTqSzceWHmg5tpLior7Ho-NslsJfICekMp9YKCSR1xmA8-G-xoA6S8TLhYLPg/exec',

    // Có bật tính năng lưu điểm không
    ENABLE_SCORE_SUBMISSION: true,

    // Yêu cầu email học sinh (true/false)
    REQUIRE_EMAIL: false,

    // Yêu cầu lớp học (true/false)
    REQUIRE_CLASS: false
};

// Export để sử dụng trong các file khác
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
