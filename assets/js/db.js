/**
 * Database Service (Firestore)
 * ============================
 * Xử lý lưu trữ dữ liệu người dùng, kết quả học tập
 */

let db = null;

// Khởi tạo Firestore
function initializeFirestore() {
    if (typeof firebase === 'undefined' || !firebase.apps.length) return;

    if (!db) {
        db = firebase.firestore();
        console.log("Firestore initialized");
    }
}

const Database = {
    // === USER PROFILE ===

    /**
     * Tạo hoặc cập nhật thông tin user khi login
     */
    async syncUser(user) {
        if (!user || !db) return;

        const userRef = db.collection('users').doc(user.uid);
        const doc = await userRef.get();

        const userData = {
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            lastLogin: firebase.firestore.FieldValue.serverTimestamp()
        };

        if (!doc.exists) {
            // User mới
            await userRef.set({
                ...userData,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                stats: {
                    totalTime: 0,
                    completedLessons: 0,
                    totalScore: 0,
                    streak: 1
                }
            });
        } else {
            // Update thông tin cơ bản
            await userRef.update(userData);
        }
    },

    /**
     * Lấy thông tin chi tiết user (bao gồm stats)
     */
    async getUserProfile(uid) {
        if (!db) return null;
        try {
            const doc = await db.collection('users').doc(uid).get();
            return doc.exists ? doc.data() : null;
        } catch (error) {
            console.error("Error getting user profile:", error);
            return null;
        }
    },

    // === LEARNING ACTIVITY ===

    /**
     * Lưu kết quả bài kiểm tra
     */
    async saveQuizResult(uid, result) {
        if (!db) return;

        try {
            const batch = db.batch();

            // 1. Lưu vào collection 'results' (lịch sử chi tiết)
            const resultRef = db.collection('results').doc();
            batch.set(resultRef, {
                uid: uid,
                courseId: result.courseId,
                lessonPath: result.lessonPath,
                score: parseFloat(result.score),
                totalQuestions: result.total,
                correctAnswers: result.correct,
                timeSpent: result.timeSpent, // seconds
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });

            // 2. Update user stats
            const userRef = db.collection('users').doc(uid);
            batch.update(userRef, {
                'stats.totalScore': firebase.firestore.FieldValue.increment(parseFloat(result.score)),
                'stats.completedLessons': firebase.firestore.FieldValue.increment(1),
                'stats.totalTime': firebase.firestore.FieldValue.increment(result.timeSpent)
            });

            await batch.commit();
            console.log("Quiz result saved to Firestore");
            return true;
        } catch (error) {
            console.error("Error saving quiz result:", error);
            return false;
        }
    },

    /**
     * Lấy lịch sử hoạt động gần đây
     */
    async getRecentActivity(uid, limit = 5) {
        if (!db) return [];
        try {
            const snapshot = await db.collection('results')
                .where('uid', '==', uid)
                .orderBy('timestamp', 'desc')
                .limit(limit)
                .get();

            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error("Error getting activity:", error);
            return [];
        }
    }
};

// Auto init when firebase is ready
document.addEventListener('DOMContentLoaded', () => {
    const checkFirebase = setInterval(() => {
        if (typeof firebase !== 'undefined' && firebase.apps.length) {
            clearInterval(checkFirebase);
            initializeFirestore();
        }
    }, 100);
});

// Export globally
window.DB = Database;
