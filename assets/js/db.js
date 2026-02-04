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
    },

    // === PROGRESS TRACKING ===

    /**
     * Đánh dấu bài học đã xem
     * @param {string} uid - User ID
     * @param {string} courseId - ID khóa học
     * @param {string} lessonPath - Đường dẫn bài học (vd: "Chương 1/Bài 1")
     */
    async markLessonAsViewed(uid, courseId, lessonPath) {
        if (!db || !uid) return false;

        try {
            // Tạo document ID unique từ courseId + lessonPath
            const docId = `${uid}_${courseId}_${lessonPath.replace(/\//g, '_')}`;

            await db.collection('progress').doc(docId).set({
                uid: uid,
                courseId: courseId,
                lessonPath: lessonPath,
                viewedAt: firebase.firestore.FieldValue.serverTimestamp(),
                completed: true
            }, { merge: true });

            console.log("Progress: Đã đánh dấu bài học đã xem:", lessonPath);
            return true;
        } catch (error) {
            console.error("Error marking lesson as viewed:", error);
            return false;
        }
    },

    /**
     * Lấy danh sách bài học đã xem của người dùng trong 1 khóa học
     * @param {string} uid - User ID
     * @param {string} courseId - ID khóa học
     * @returns {Array} Danh sách lessonPath đã xem
     */
    async getViewedLessons(uid, courseId) {
        if (!db || !uid) return [];

        try {
            const snapshot = await db.collection('progress')
                .where('uid', '==', uid)
                .where('courseId', '==', courseId)
                .where('completed', '==', true)
                .get();

            return snapshot.docs.map(doc => doc.data().lessonPath);
        } catch (error) {
            console.error("Error getting viewed lessons:", error);
            return [];
        }
    },

    /**
     * Lấy tiến độ học tập tổng quan của người dùng
     * @param {string} uid - User ID
     * @returns {Object} Thống kê tiến độ theo từng khóa học
     */
    async getLearningProgress(uid) {
        if (!db || !uid) return {};

        try {
            const snapshot = await db.collection('progress')
                .where('uid', '==', uid)
                .where('completed', '==', true)
                .get();

            // Nhóm theo courseId
            const progressMap = {};
            snapshot.docs.forEach(doc => {
                const data = doc.data();
                if (!progressMap[data.courseId]) {
                    progressMap[data.courseId] = [];
                }
                progressMap[data.courseId].push(data.lessonPath);
            });

            return progressMap;
        } catch (error) {
            console.error("Error getting learning progress:", error);
            return {};
        }
    },

    /**
     * Lấy danh sách bài học gần nhất đã xem
     * @param {string} uid - User ID
     * @param {number} limit - Số lượng bài tối đa
     */
    async getRecentViewedLessons(uid, limit = 5) {
        if (!db || !uid) return [];

        try {
            const snapshot = await db.collection('progress')
                .where('uid', '==', uid)
                .orderBy('viewedAt', 'desc')
                .limit(limit)
                .get();

            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error("Error getting recent viewed lessons:", error);
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
