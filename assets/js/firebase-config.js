/**
 * Firebase Configuration
 * =====================
 * 
 * HƯỚNG DẪN:
 * 1. Truy cập https://console.firebase.google.com/
 * 2. Tạo project mới
 * 3. Vào Project Settings → Your apps → Add Web App
 * 4. Copy config vào bên dưới
 * 5. Enable Authentication → Sign-in method → Google
 * 6. Enable Firestore Database
 */

// TODO: Thay thế bằng config Firebase của bạn
const firebaseConfig = {
    apiKey: "AIzaSyAHsSG8lD7mZuzEIYnnsyrdmEdFV4nBK2Q",
    authDomain: "hocbanchat.firebaseapp.com",
    projectId: "hocbanchat",
    storageBucket: "hocbanchat.firebasestorage.app",
    messagingSenderId: "17726514990",
    appId: "1:17726514990:web:d21b9eb0e5005c0cf57cbf",
    measurementId: "G-TLE6JM5QB2"
};

// Kiểm tra xem đã cấu hình chưa
const isFirebaseConfigured = () => {
    return firebaseConfig.apiKey && firebaseConfig.apiKey !== "YOUR_API_KEY";
};

// Export cho các module khác sử dụng
window.firebaseConfig = firebaseConfig;
window.isFirebaseConfigured = isFirebaseConfigured;
