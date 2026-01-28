/**
 * Authentication Service
 * ======================
 * Quản lý đăng nhập/đăng xuất và lưu trữ dữ liệu người dùng
 */

// Biến global lưu trữ user hiện tại
window.currentUser = null;
let db = null;
let auth = null;

/**
 * Khởi tạo Firebase
 */
function initializeFirebase() {
    if (!firebase.apps.length) {
        firebase.initializeApp(window.firebaseConfig);
    } else {
        firebase.app(); // if already initialized, use that one
    }

    auth = firebase.auth();
    db = firebase.firestore();

    // Lắng nghe trạng thái đăng nhập
    auth.onAuthStateChanged(handleAuthStateChange);

    console.log("Firebase initialized successfully");
}

/**
 * Xử lý khi trạng thái đăng nhập thay đổi
 */
function handleAuthStateChange(user) {
    window.currentUser = user;
    console.log("Auth state changed, user:", user ? user.displayName : "null");

    updateUIForAuth(user);

    if (user) {
        // Lưu thông tin user vào Firestore
        saveUserToFirestore(user);

        // --- LOGIC MỚI: Redirect to Profile if on Login/Home ---
        const path = window.location.pathname;
        if (path.endsWith('index.html') || path.endsWith('/')) {
            // Redirect to profile page
            window.location.href = 'profile.html';
        }
    }

    // Update Lesson Access if on lesson page
    if (window.updateLessonAccess) {
        window.updateLessonAccess();
    }
}

/**
 * Đăng nhập bằng Google
 */
async function signInWithGoogle() {
    if (!auth) {
        initializeFirebase(); // Try to init if missing
        if (!auth) {
            showAuthError('Firebase chưa được cấu hình hoặc lỗi khởi tạo');
            return null;
        }
    }

    try {
        const provider = new firebase.auth.GoogleAuthProvider();
        // Force account selection prompt
        provider.setCustomParameters({
            prompt: 'select_account'
        });

        const result = await auth.signInWithPopup(provider);
        return result.user;
    } catch (error) {
        console.error('Lỗi đăng nhập:', error);
        if (error.code === 'auth/unauthorized-domain') {
            showAuthError('Tên miền này chưa được ủy quyền trong Firebase Console. Vui lòng thêm domain vào Authorized Domains.');
        } else {
            showAuthError('Đăng nhập thất bại: ' + error.message);
        }
        return null;
    }
}

/**
 * Đăng xuất
 */
async function signOut() {
    if (!auth) return;

    try {
        await auth.signOut();
        currentUser = null;
    } catch (error) {
        console.error('Lỗi đăng xuất:', error);
    }
}

/**
 * Lưu thông tin user vào Firestore
 */
async function saveUserToFirestore(user) {
    if (!db || !user) return;

    try {
        const userRef = db.collection('users').doc(user.uid);
        await userRef.set({
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            lastLogin: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
    } catch (error) {
        console.error('Lỗi lưu thông tin user:', error);
    }
}

/**
 * URL Google Apps Script để lưu điểm vào Sheets
 */
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxyZosYs51e8G9YrFGutFB3i-o-vi5XvIPJpZcD7xXQz5-ZqU_NP_hdIFbo7Ru8vF4FgQ/exec";

/**
 * Lưu điểm bài test
 * @param {Object} scoreData - Dữ liệu điểm
 */
async function saveUserScore(scoreData) {
    // 1. Gửi sang Google Sheets (Luôn gửi, không cần login cũng gửi được nếu muốn, 
    // nhưng ở đây ta ưu tiên logic đã login của app.js)
    try {
        // Sử dụng mode 'no-cors' để tránh lỗi CORS (Google Apps Script đặc thù)
        // Tuy nhiên 'no-cors' sẽ không trả về response JSON được, nhưng vẫn thực thi lệnh POST.
        fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(scoreData)
        }).then(() => console.log("Đã gửi điểm sang Google Sheets"))
            .catch(e => console.error("Lỗi gửi Sheets:", e));
    } catch (err) {
        console.error("Lỗi fetch Sheets:", err);
    }

    // 2. Lưu vào Firestore (chỉ khi đã login)
    if (!db || !currentUser) {
        console.warn('Cần đăng nhập để lưu điểm vài Firebase');
        return false;
    }

    try {
        const scoreRef = db.collection('users').doc(currentUser.uid)
            .collection('scores').doc();

        await scoreRef.set({
            ...scoreData,
            userId: currentUser.uid,
            userName: currentUser.displayName,
            userEmail: currentUser.email,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });

        console.log('Đã lưu điểm thành công vào Firestore');
        return true;
    } catch (error) {
        console.error('Lỗi lưu điểm Firestore:', error);
        return false;
    }
}

/**
 * Lấy lịch sử điểm của user
 */
async function getUserScores() {
    if (!db || !currentUser) return [];

    try {
        const snapshot = await db.collection('users').doc(currentUser.uid)
            .collection('scores')
            .orderBy('timestamp', 'desc')
            .limit(50)
            .get();

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Lỗi lấy lịch sử điểm:', error);
        return [];
    }
}

/**
 * Lưu tiến độ học tập
 */
async function saveProgress(lessonPath) {
    if (!db || !currentUser) return false;

    try {
        const userRef = db.collection('users').doc(currentUser.uid);
        await userRef.update({
            [`progress.${lessonPath.replace(/\//g, '_')}`]: {
                completed: true,
                completedAt: firebase.firestore.FieldValue.serverTimestamp()
            }
        });
        return true;
    } catch (error) {
        console.error('Lỗi lưu tiến độ:', error);
        return false;
    }
}

/**
 * Cập nhật UI dựa trên trạng thái đăng nhập
 */
function updateUIForAuth(user) {
    const authContainer = document.getElementById('auth-container');
    const userMenu = document.getElementById('user-menu');
    const loginBtn = document.getElementById('login-btn');

    if (!authContainer) return;

    if (user) {
        const currentPath = window.location.pathname;
        const isProfilePage = currentPath.endsWith('profile.html');

        // 1. Update Main Nav: Home -> Profile
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            if (link.getAttribute('href') === 'index.html' || link.textContent.includes('Trang chủ')) {
                link.textContent = 'Hồ sơ cá nhân';
                link.href = 'profile.html';
                if (isProfilePage) link.classList.add('active');
            }
        });

        // Also update Mobile Menu if exists
        const mobileLinks = document.querySelectorAll('.nav-mobile-links a');
        mobileLinks.forEach(link => {
            if (link.getAttribute('href') === 'index.html' || link.textContent.includes('Trang chủ')) {
                link.textContent = '👤 Hồ sơ cá nhân';
                link.href = 'profile.html';
                if (isProfilePage) link.classList.add('active');
            }
        });

        // 2. Update Auth Container (Avatar)
        // Check avatar, fallback if null
        const avatarUrl = user.photoURL || 'assets/images/default-avatar.png';

        authContainer.innerHTML = `
            <div class="user-dropdown">
                <button class="user-avatar-btn" onclick="toggleUserMenu()">
                    <img src="${avatarUrl}" 
                         alt="${user.displayName}" 
                         class="user-avatar"
                         onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName)}&background=random'">
                    <span class="user-name">${user.displayName?.split(' ')[0] || 'User'}</span>
                    <span class="dropdown-arrow">▼</span>
                </button>
                <div class="user-dropdown-menu" id="user-dropdown-menu">
                    <div class="user-info">
                        <img src="${avatarUrl}" 
                             alt="${user.displayName}"
                             onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName)}&background=random'">
                        <div>
                            <strong>${user.displayName}</strong>
                            <small>${user.email}</small>
                        </div>
                    </div>
                    <hr>
                    <a href="profile.html?tab=account">
                        👤 Thông tin tài khoản
                    </a>
                    <a href="profile.html?tab=courses">
                        📚 Khóa học của tôi
                    </a>
                    <a href="#" onclick="signOut(); return false;">
                        🚪 Đăng xuất
                    </a>
                </div>
            </div>
        `;
    } else {
        // Revert Nav: Profile -> Home
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            if (link.getAttribute('href') === 'profile.html' || link.textContent.includes('Hồ sơ')) {
                link.textContent = 'Trang chủ';
                link.href = 'index.html';
            }
        });

        // Chưa đăng nhập - hiển thị nút đăng nhập
        authContainer.innerHTML = `
            <button class="btn-google-signin" onclick="signInWithGoogle()">
                <svg viewBox="0 0 24 24" width="18" height="18">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Đăng nhập
            </button>
        `;
    }
}

/**
 * Toggle menu dropdown
 */
function toggleUserMenu() {
    const menu = document.getElementById('user-dropdown-menu');
    if (menu) {
        menu.classList.toggle('show');
    }
}

/**
 * Đóng dropdown khi click ra ngoài
 */
document.addEventListener('click', function (e) {
    const dropdown = document.querySelector('.user-dropdown');
    const menu = document.getElementById('user-dropdown-menu');

    if (dropdown && menu && !dropdown.contains(e.target)) {
        menu.classList.remove('show');
    }
});

/**
 * Hiển thị lịch sử điểm
 */
async function showScoreHistory() {
    const scores = await getUserScores();

    if (scores.length === 0) {
        alert('Bạn chưa có bài làm nào!');
        return;
    }

    // Tạo modal hiển thị lịch sử
    const modal = document.createElement('div');
    modal.className = 'score-history-modal';
    modal.innerHTML = `
        <div class="score-history-content">
            <div class="score-history-header">
                <h2>📊 Lịch sử điểm số</h2>
                <button onclick="this.closest('.score-history-modal').remove()">✕</button>
            </div>
            <div class="score-history-list">
                ${scores.map(s => `
                    <div class="score-item">
                        <div class="score-info">
                            <strong>${s.courseName || 'Khóa học'}</strong>
                            <span>${s.chapterName || ''} - ${s.lessonName || ''}</span>
                            <small>${s.timestamp?.toDate?.()?.toLocaleDateString('vi-VN') || ''}</small>
                        </div>
                        <div class="score-value ${s.score >= 8 ? 'high' : s.score >= 5 ? 'medium' : 'low'}">
                            ${s.score?.toFixed(1) || 0}
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    document.body.appendChild(modal);
}

/**
 * Hiển thị lỗi auth
 */
function showAuthError(message) {
    alert(message);
}

/**
 * Lấy user hiện tại
 */
function getCurrentUser() {
    return currentUser;
}

/**
 * Kiểm tra đã đăng nhập chưa
 */
function isLoggedIn() {
    return currentUser !== null;
}

// Khởi tạo khi DOM ready
document.addEventListener('DOMContentLoaded', function () {
    // Đợi Firebase SDK load xong
    if (typeof firebase !== 'undefined') {
        initializeFirebase();
    } else {
        console.warn('Firebase SDK chưa được load');
    }
});

// Export các hàm cho global scope
window.signInWithGoogle = signInWithGoogle;
window.signOut = signOut;
window.saveUserScore = saveUserScore;
window.getUserScores = getUserScores;
window.saveProgress = saveProgress;
window.getCurrentUser = getCurrentUser;
window.isLoggedIn = isLoggedIn;
window.toggleUserMenu = toggleUserMenu;
window.showScoreHistory = showScoreHistory;
