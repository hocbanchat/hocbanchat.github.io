# 🚀 Hướng Dẫn Setup Google Apps Script

## 📋 Tổng Quan

Hướng dẫn này giúp bạn kết nối website với Google Sheets để lưu điểm học sinh tự động - **MIỄN PHÍ 100%!**

---

## ⏱️ Thời Gian: 10 Phút

### Bạn Cần:
- ✅ Tài khoản Google
- ✅ 10 phút thời gian
- ✅ Đã có code website (đã có sẵn)

---

## 📝 BƯỚC 1: Tạo Google Sheet (2 phút)

### 1.1 Mở Google Sheets
- Truy cập: https://sheets.google.com
- Click **Blank** để tạo sheet mới

### 1.2 Đặt Tên Sheet
- Đổi tên thành: **"Điểm Học Sinh - Toán 12"**

### 1.3 Tạo Header (Dòng 1)
Nhập vào dòng 1, các cột từ A đến J:

| A | B | C | D | E | F | G | H | I | J |
|---|---|---|---|---|---|---|---|---|---|
| Thời gian | Họ tên | Email | Lớp | Khóa học | Bài học | Điểm | Đúng | Tổng | Tỷ lệ % |

**Mẹo:** Format dòng header đẹp:
- Bold text (Ctrl+B)
- Background màu xanh
- Font màu trắng

---

## 💻 BƯỚC 2: Tạo Apps Script (5 phút)

### 2.1 Mở Apps Script Editor
- Trong Google Sheet: **Extensions** → **Apps Script**
- Cửa sổ mới sẽ mở ra

### 2.2 Xóa Code Mặc Định
- Xóa toàn bộ code mẫu `function myFunction() {...}`

### 2.3 Paste Code Apps Script
- Mở file `google-apps-script.js` (trong thư mục gốc project)
- Copy TOÀN BỘ code
- Paste vào Apps Script Editor

### 2.4 Lưu Project
- Click **💾 (Save)** hoặc Ctrl+S
- Đặt tên project: "Learning Platform API"

---

## 🚀 BƯỚC 3: Deploy Apps Script (2 phút)

### 3.1 Click Deploy
- Click nút **Deploy** (góc trên bên phải)
- Chọn **New deployment**

### 3.2 Cấu Hình Deployment
- **Select type:** Click ⚙️ → Chọn **Web app**

- **Description:** "Learning Platform Score API"

- **Execute as:** **Me** (your-email@gmail.com)

- **Who has access:** **Anyone**
  > ⚠️ Quan trọng: Phải chọn "Anyone" để website gọi được!

### 3.3 Deploy
- Click **Deploy**

- Nếu lần đầu:
  - Click **Authorize access**
  - Chọn tài khoản Google
  - Click **Advanced** → **Go to ... (unsafe)**
  - Click **Allow**

### 3.4 Copy Web App URL
- Sau khi deploy xong, sẽ hiện URL dạng:
  ```
  https://script.google.com/macros/s/AKfycbxXYZ123.../exec
  ```
- Click **Copy** để sao chép URL
- **LƯU LẠI URL NÀY!** ⭐

---

## ⚙️ BƯỚC 4: Cấu Hình Website (1 phút)

### 4.1 Mở File Config
- Mở file: `assets/js/config.js`

### 4.2 Paste URL
Thay đổi dòng này:
```javascript
APPS_SCRIPT_URL: 'YOUR_APPS_SCRIPT_URL_HERE',
```

Thành:
```javascript
APPS_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbxXYZ123.../exec',
```
(Paste URL vừa copy ở Bước 3.4)

### 4.3 Tùy Chỉnh (Optional)
```javascript
// Bật/tắt tính năng lưu điểm
ENABLE_SCORE_SUBMISSION: true,  // true = bật, false = tắt

// Bắt buộc nhập email?
REQUIRE_EMAIL: false,  // true = bắt buộc, false = không bắt buộc

// Bắt buộc nhập lớp?
REQUIRE_CLASS: false,
```

### 4.4 Lưu File
- Ctrl+S để lưu

---

## ✅ BƯỚC 5: Test Thử (1 phút)

### 5.1 Mở Website Locally
```bash
# Mở file lesson.html trên browser
# Hoặc dùng Live Server
```

### 5.2 Làm Bài Quiz
1. Trang sẽ hiện modal "📚 Thông Tin Học Sinh"
2. Nhập:
   - Họ tên: "Test User"
   - Email: "test@email.com"
   - Lớp: "12A1"
3. Click "Bắt đầu học"
4. Làm bài quiz
5. Click "Nộp bài"

### 5.3 Kiểm Tra Google Sheets
- Quay lại Google Sheet
- Refresh (F5)
- Bạn sẽ thấy dòng mới với điểm test! ✨

**Nếu thấy dữ liệu → THÀNH CÔNG!** 🎉

---

## 🐛 Xử Lý Lỗi

### Lỗi 1: "Apps Script URL chưa được cấu hình"
**Nguyên nhân:** Chưa paste URL vào config.js

**Giải pháp:**
- Kiểm tra file `assets/js/config.js`
- Đảm bảo đã thay `YOUR_APPS_SCRIPT_URL_HERE` bằng URL thật

---

### Lỗi 2: Không có dữ liệu trong Sheet
**Nguyên nhân:** URL sai hoặc deployment chưa đúng

**Giải pháp:**
1. Kiểm tra URL có đúng format không:
   - Phải bắt đầu bằng `https://script.google.com/macros/s/`
   - Phải kết thúc bằng `/exec`

2. Kiểm tra deployment:
   - Vào Apps Script
   - Deploy → Manage deployments
   - Đảm bảo "Who has access" là "Anyone"

3. Test trực tiếp:
   - Copy URL Apps Script
   - Past vào browser → Phải thấy: `{"status":"API Ready"}`

---

### Lỗi 3: Modal không hiện
**Nguyên nhân:** File JS chưa được load

**Giải pháp:**
- Mở DevTools (F12) → Console
- Kiểm tra lỗi JavaScript
- Đảm bảo các file đã được include trong `lesson.html`:
  ```html
  <script src="assets/js/config.js"></script>
  <script src="assets/js/submit-score.js"></script>
  ```

---

## 🔒 Bảo Mật

### URL có bị lộ không?
- **Trả lời:** URL được public, NHƯNG không sao!
- URL này chỉ ghi vào Sheet của BẠN
- Không thể đọc dữ liệu, chỉ ghi thêm
- Không tốn tiền của bạn

### Nếu lo bị spam?
**Thêm vào Apps Script:**
```javascript
// Trong hàm doPost(), thêm check:
if (!data.studentEmail.endsWith('@truong.edu.vn')) {
    return createResponse(false, 'Email không hợp lệ');
}
```

### Giới hạn domain?
**Trong Apps Script, thêm:**
```javascript
const ALLOWED_DOMAINS = ['your-site.github.io'];
const origin = e.parameter.origin;

if (!ALLOWED_DOMAINS.includes(origin)) {
    return createResponse(false, 'Unauthorized domain');
}
```

---

## 📊 Xem Báo Cáo

### Trong Google Sheets:

**1. Filter dữ liệu:**
- Click cột header → Filter
- Lọc theo lớp, học sinh, khóa học...

**2. Tạo biểu đồ:**
- Chọn dữ liệu → Insert → Chart
- Biểu đồ phân bố điểm, tiến độ...

**3. Xuất Excel:**
- File → Download → .xlsx

**4. Chia sẻ với đồng nghiệp:**
- Click Share
- Thêm email giáo viên khác
- Chọn quyền "Viewer" hoặc "Editor"

---

## 🚀 Deploy Lên GitHub Pages

### Sau khi test OK:

1. **Commit code:**
   ```bash
   git add .
   git commit -m "Thêm Google Apps Script integration"
   git push
   ```

2. **GitHub Pages tự động deploy**
   - Đợi 1-2 phút
   - Truy cập: `https://your-username.github.io/repo-name`

3. **Test trên production:**
   - Làm bài quiz
   - Kiểm tra Sheet → Phải có dữ liệu!

---

## 💡 Mẹo Hay

### 1. Tự Động Tạo Sheet Thống Kê
- Uncomment hàm `createStatisticsSheet()` trong Apps Script
- Tự động tính điểm TB, số bài đạt/không đạt

### 2. Xóa Dữ Liệu Cũ Tự Động
- Uncomment hàm `cleanOldData()`
- Tự động xóa dữ liệu > 90 ngày
- Chạy trigger hàng tuần

### 3. Email Thông Báo
- Thêm trong Apps Script:
  ```javascript
  MailApp.sendEmail({
    to: 'teacher@email.com',
    subject: 'Học sinh vừa nộp bài',
    body: `${data.studentName} đạt ${data.score} điểm`
  });
  ```

---

## ✨ Hoàn Tất!

Giờ bạn có:
- ✅ Website lưu điểm tự động
- ✅ Google Sheets làm database
- ✅ Miễn phí 100%
- ✅ Không cần backend server

**Chúc mừng! 🎉**

---

## 🆘 Cần Trợ Giúp?

**Xem log lỗi:**
1. Apps Script: View → Executions
2. Website: DevTools (F12) → Console

**Test API:**
```bash
curl "YOUR_APPS_SCRIPT_URL"
# Phải trả về: {"status":"API Ready"}
```

**Nếu vẫn không được, kiểm tra:**
- [ ] URL Apps Script đúng format
- [ ] Deployment "Who has access" = "Anyone"
- [ ] File config.js đã lưu
- [ ] Cache browser đã clear (Ctrl+Shift+R)
