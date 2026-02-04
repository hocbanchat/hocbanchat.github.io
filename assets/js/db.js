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
     * Lưu kết quả bài kiểm tra (bao gồm cả câu hỏi và đáp án để xem lại)
     */
    async saveQuizResult(uid, result) {
        if (!db) return null;

        try {
            const batch = db.batch();

            // 1. Lưu vào collection 'results' (lịch sử chi tiết)
            const resultRef = db.collection('results').doc();
            const resultData = {
                uid: uid,
                courseId: result.courseId,
                lessonPath: result.lessonPath,
                score: parseFloat(result.score),
                totalQuestions: result.total,
                correctAnswers: result.correct,
                timeSpent: result.timeSpent, // seconds
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                // Lưu thêm questions và answers để có thể xem lại
                questions: result.questions || [],
                answers: result.answers || {}
            };
            batch.set(resultRef, resultData);

            // 2. Update user stats
            const userRef = db.collection('users').doc(uid);
            batch.update(userRef, {
                'stats.totalScore': firebase.firestore.FieldValue.increment(parseFloat(result.score)),
                'stats.completedLessons': firebase.firestore.FieldValue.increment(1),
                'stats.totalTime': firebase.firestore.FieldValue.increment(result.timeSpent)
            });

            await batch.commit();
            console.log("Quiz result saved to Firestore với ID:", resultRef.id);
            return resultRef.id; // Trả về ID để có thể dùng link xem lại
        } catch (error) {
            console.error("Error saving quiz result:", error);
            return null;
        }
    },

    /**
     * Lấy chi tiết kết quả quiz theo ID để xem lại
     * @param {string} resultId - ID của kết quả quiz
     * @returns {Object|null} Thông tin chi tiết kết quả
     */
    async getQuizResultById(resultId) {
        if (!db || !resultId) return null;
        try {
            const doc = await db.collection('results').doc(resultId).get();
            if (doc.exists) {
                return {
                    id: doc.id,
                    ...doc.data()
                };
            }
            return null;
        } catch (error) {
            console.error("Error getting quiz result:", error);
            return null;
        }
    },

    /**
     * Lấy lịch sử hoạt động gần đây
     */
    async getRecentActivity(uid, limit = 5) {
        if (!db) {
            console.log("DB: Firestore chưa khởi tạo");
            return [];
        }
        if (!uid) {
            console.log("DB: Không có uid");
            return [];
        }

        try {
            console.log("DB: Đang lấy hoạt động gần đây cho user:", uid);

            // Query với orderBy (cần composite index)
            let snapshot;
            try {
                snapshot = await db.collection('results')
                    .where('uid', '==', uid)
                    .orderBy('timestamp', 'desc')
                    .limit(limit)
                    .get();
            } catch (indexError) {
                // Fallback: Nếu bị lỗi index, query không dùng orderBy
                console.warn("DB: Cần tạo composite index, dùng fallback query:", indexError.message);
                snapshot = await db.collection('results')
                    .where('uid', '==', uid)
                    .limit(limit)
                    .get();
            }

            console.log("DB: Tìm thấy", snapshot.docs.length, "kết quả");

            const results = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            // Sort thủ công nếu dùng fallback
            results.sort((a, b) => {
                const timeA = a.timestamp?.seconds || 0;
                const timeB = b.timestamp?.seconds || 0;
                return timeB - timeA;
            });

            console.log("DB: Hoạt động gần đây:", results);
            return results;
        } catch (error) {
            console.error("DB: Lỗi khi lấy hoạt động:", error);
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
