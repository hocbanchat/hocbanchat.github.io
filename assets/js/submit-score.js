// ===== QUẢN LÝ THÔNG TIN HỌC SINH =====

/**
 * Lấy thông tin học sinh từ localStorage
 * @returns {Object|null} Thông tin học sinh hoặc null
 */
function getStudentInfo() {
    const info = localStorage.getItem('studentInfo');
    return info ? JSON.parse(info) : null;
}

/**
 * Lưu thông tin học sinh vào localStorage
 * @param {Object} info - Thông tin học sinh
 */
function saveStudentInfo(info) {
    localStorage.setItem('studentInfo', JSON.stringify(info));
}

/**
 * Hiển thị modal nhập thông tin học sinh
 * @returns {Promise<Object>} Thông tin học sinh
 */
function showStudentInfoModal() {
    return new Promise((resolve) => {
        // Tạo modal
        const modal = document.createElement('div');
        modal.className = 'student-modal-overlay';
        modal.innerHTML = `
            <div class="student-modal">
                <div class="student-modal-header">
                    <h2>📚 Thông Tin Học Sinh</h2>
                    <p>Để lưu điểm và theo dõi tiến độ, vui lòng nhập thông tin:</p>
                </div>
                <form class="student-modal-form" id="studentInfoForm">
                    <div class="form-group">
                        <label for="studentName">Họ và tên <span class="required">*</span></label>
                        <input type="text" id="studentName" required placeholder="Nguyễn Văn A">
                    </div>
                    
                    <div class="form-group">
                        <label for="studentEmail">Email ${CONFIG.REQUIRE_EMAIL ? '<span class="required">*</span>' : '(không bắt buộc)'}</label>
                        <input type="email" id="studentEmail" ${CONFIG.REQUIRE_EMAIL ? 'required' : ''} placeholder="email@example.com">
                    </div>
                    
                    <div class="form-group">
                        <label for="studentClass">Lớp ${CONFIG.REQUIRE_CLASS ? '<span class="required">*</span>' : '(không bắt buộc)'}</label>
                        <input type="text" id="studentClass" ${CONFIG.REQUIRE_CLASS ? 'required' : ''} placeholder="12A1">
                    </div>
                    
                    <div class="form-actions">
                        <button type="submit" class="btn btn-primary btn-full">Bắt đầu học</button>
                    </div>
                    
                    <p class="privacy-note">🔒 Thông tin của bạn được bảo mật và chỉ dùng để theo dõi tiến độ học tập</p>
                </form>
            </div>
        `;

        document.body.appendChild(modal);

        // Xử lý submit form
        const form = document.getElementById('studentInfoForm');
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const studentInfo = {
                name: document.getElementById('studentName').value.trim(),
                email: document.getElementById('studentEmail').value.trim(),
                class: document.getElementById('studentClass').value.trim(),
                registeredAt: new Date().toISOString()
            };

            saveStudentInfo(studentInfo);
            document.body.removeChild(modal);
            resolve(studentInfo);
        });
    });
}

/**
 * Đảm bảo có thông tin học sinh (hiện modal nếu chưa có)
 * @returns {Promise<Object>} Thông tin học sinh
 */
async function ensureStudentInfo() {
    let info = getStudentInfo();
    if (!info) {
        info = await showStudentInfoModal();
    }
    return info;
}

// ===== GỬI ĐIỂM LÊN GOOGLE SHEETS =====

/**
 * Gửi điểm học sinh lên Google Sheets
 * @param {Object} scoreData - Dữ liệu điểm số
 * @returns {Promise<boolean>} Thành công hay không
 */
async function submitScoreToSheets(scoreData) {
    // Kiểm tra config
    if (!CONFIG.ENABLE_SCORE_SUBMISSION) {
        console.log('Score submission is disabled');
        return false;
    }

    if (!CONFIG.APPS_SCRIPT_URL || CONFIG.APPS_SCRIPT_URL === 'YOUR_APPS_SCRIPT_URL_HERE') {
        console.warn('Apps Script URL chưa được cấu hình');
        return false;
    }

    try {
        // Lấy thông tin học sinh ĐÃ NHẬP TRƯỚC ĐÓ (không hiện modal lại)
        const studentInfo = getStudentInfo();

        // Nếu không có thông tin (trường hợp hiếm), bỏ qua
        if (!studentInfo) {
            console.warn('Không có thông tin học sinh, bỏ qua submit');
            return false;
        }

        // Chuẩn bị dữ liệu gửi đi
        const payload = {
            studentName: studentInfo.name,
            studentEmail: studentInfo.email || '',
            studentClass: studentInfo.class || '',
            courseName: scoreData.courseName || '',
            chapterName: scoreData.chapterName || '',
            lessonName: scoreData.lessonName || '',
            score: scoreData.score,
            correctCount: scoreData.correctCount,
            totalQuestions: scoreData.totalQuestions,
            timestamp: new Date().toISOString()
        };

        // Gửi request
        const response = await fetch(CONFIG.APPS_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors', // Quan trọng!
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });

        // Note: mode: 'no-cors' không cho phép đọc response
        // Nhưng không sao, chỉ cần biết request đã gửi thành công
        console.log('✅ Đã gửi điểm lên Google Sheets!', payload);

        // Lưu vào localStorage để tracking
        saveScoreToLocalStorage(payload);

        return true;

    } catch (error) {
        console.error('❌ Lỗi khi gửi điểm:', error);
        return false;
    }
}

/**
 * Lưu điểm vào localStorage (backup local)
 * @param {Object} scoreData - Dữ liệu điểm
 */
function saveScoreToLocalStorage(scoreData) {
    const scores = getFromLocalStorage('all_scores') || [];
    scores.push({
        ...scoreData,
        savedAt: new Date().toISOString()
    });
    saveToLocalStorage('all_scores', scores);
}

/**
 * Lấy lịch sử điểm từ localStorage
 * @returns {Array} Mảng điểm đã lưu
 */
function getScoreHistory() {
    return getFromLocalStorage('all_scores') || [];
}

/**
 * Xóa thông tin học sinh và yêu cầu nhập lại
 */
function resetStudentInfo() {
    if (confirm('Bạn có chắc muốn xóa thông tin học sinh đã lưu?')) {
        localStorage.removeItem('studentInfo');
        alert('Đã xóa thông tin. Bạn sẽ được yêu cầu nhập lại khi làm bài tiếp theo.');
    }
}

// ===== AUTO-INIT =====
// Hiển thị modal NGAY khi vào trang lesson để nhập thông tin TRƯỚC khi học
document.addEventListener('DOMContentLoaded', async () => {
    // Chỉ hiện modal trên trang lesson (có quiz)
    if (window.location.pathname.includes('lesson.html')) {
        // Hiện modal ngay (không delay)
        await ensureStudentInfo();
        console.log('✅ Đã có thông tin học sinh');
    }
});
