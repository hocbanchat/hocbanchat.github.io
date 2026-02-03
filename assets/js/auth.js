/**
 * Authentication Service - Phiên bản đơn giản
 * =============================================
 * Quản lý đăng nhập/đăng xuất với Google Firebase
 */

// Biến global lưu trữ user hiện tại
window.currentUser = null;
let auth = null;

/**
 * Khởi tạo Firebase
 */
function initializeFirebase() {
    if (typeof firebase === 'undefined') {
        console.warn('Firebase SDK chưa được load');
        return;
    }

    if (!firebase.apps.length) {
        firebase.initializeApp(window.firebaseConfig);
    }

    auth = firebase.auth();

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

    // Cập nhật UI
    updateUIForAuth(user);
}

/**
 * Đăng nhập bằng Google
 */
async function signInWithGoogle() {
    if (!auth) {
        initializeFirebase();
        if (!auth) {
            showAuthError('Firebase chưa được cấu hình hoặc lỗi khởi tạo');
            return null;
        }
    }

    try {
        const provider = new firebase.auth.GoogleAuthProvider();
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
        window.currentUser = null;
    } catch (error) {
        console.error('Lỗi đăng xuất:', error);
    }
}

/**
 * Cập nhật UI dựa trên trạng thái đăng nhập
 */
function updateUIForAuth(user) {
    // Cập nhật các element trên trang
    const loginBtn = document.getElementById('login-btn');
    const userInfo = document.getElementById('user-info');
    const userName = document.getElementById('user-name');
    const userAvatar = document.getElementById('user-avatar');

    if (user) {
        // Đã đăng nhập - ẩn nút login, hiện user info
        if (loginBtn) loginBtn.classList.add('hidden');
        if (userInfo) {
            userInfo.classList.remove('hidden');
            userInfo.classList.add('flex');
        }
        if (userName) userName.textContent = user.displayName || 'Học viên';
        if (userAvatar) {
            userAvatar.src = user.photoURL || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.displayName || 'User');
        }
    } else {
        // Chưa đăng nhập - hiện nút login, ẩn user info
        if (loginBtn) loginBtn.classList.remove('hidden');
        if (userInfo) {
            userInfo.classList.add('hidden');
            userInfo.classList.remove('flex');
        }
    }
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
    return window.currentUser;
}

/**
 * Kiểm tra đã đăng nhập chưa
 */
function isLoggedIn() {
    return window.currentUser !== null;
}

// Khởi tạo khi DOM ready
document.addEventListener('DOMContentLoaded', function () {
    // Đợi Firebase SDK load xong
    const checkFirebase = setInterval(() => {
        if (typeof firebase !== 'undefined') {
            clearInterval(checkFirebase);
            initializeFirebase();
        }
    }, 100);
});

// Export các hàm cho global scope
window.signInWithGoogle = signInWithGoogle;
window.signOut = signOut;
window.getCurrentUser = getCurrentUser;
window.isLoggedIn = isLoggedIn;
