# 🚀 HƯỚNG DẪN NHANH - TỰ ĐỘNG THÊM BÀI HỌC MỚI

## ✨ Tính năng mới: Tự động quét folder!

Bạn **KHÔNG CẦN** chỉnh sửa file `data-index.json` nữa!  
Chỉ cần tạo folder → Chạy script → Bài học mới xuất hiện! 🎉

---

## 📁 Cách thêm bài học mới

### Bước 1: Tạo folder bài học

Tạo folder theo cấu trúc:
```
data/
└── [Tên Khóa Học]/
    └── [Tên Chương]/
        └── [Tên Bài Học]/
```

**Ví dụ:**
```
data/Toán 12/Chương 3 - Nguyên hàm tích phân/Bài 5 - Tích phân/
```

### Bước 2: Thêm file dữ liệu

Trong folder bài học, tạo các file:

#### 📝 `lythuyet.md` (Lý thuyết)
```markdown
---
title: Bài 5 - Tích phân
youtubeId: dQw4w9WgXcQ
duration: 45 phút
---

## Định nghĩa

Nội dung lý thuyết với công thức LaTeX...

$$\int_a^b f(x) \, dx$$
```

#### 💡 `vidu.json` (Ví dụ)
```json
[
  {
    "id": 1,
    "question": "Tính tích phân $\\int_0^1 x^2 \\, dx$",
    "explanation": "**Lời giải:**\n\n$$\\int_0^1 x^2 \\, dx = \\left[\\frac{x^3}{3}\\right]_0^1 = \\frac{1}{3}$$"
  }
]
```

#### 📋 `baitap.json` (Bài tập trắc nghiệm)
```json
[
  {
    "id": 1,
    "question": "Tính $\\int x^2 \\, dx$",
    "options": [
      "A. $\\frac{x^3}{3} + C$",
      "B. $x^3 + C$",
      "C. $2x + C$",
      "D. $\\frac{x^2}{2} + C$"
    ],
    "answer": "A",
    "explanation": "**Lời giải:**\n\nSử dụng công thức: $\\int x^n \\, dx = \\frac{x^{n+1}}{n+1} + C$"
  }
]
```

#### 🎥 `linkbaigiang.json` (Link video)
```json
[
  {
    "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  }
]
```

#### 📄 Thư mục `tailieu/` (Tài liệu PDF - Tùy chọn)
```
tailieu/
├── tailieu_baigiang.pdf
└── baitap_venha.pdf
```

### Bước 3: Chạy script tự động

#### Cách 1: Double-click (Dễ nhất) ⭐
1. Double-click vào file: **`Cập nhật danh sách bài học.bat`**
2. Đợi script chạy xong
3. Đóng cửa sổ

#### Cách 2: Dùng Terminal
```bash
node scripts/generate-data-index.js
```

### Bước 4: Reload trang web

Mở trình duyệt → Nhấn `F5` hoặc `Ctrl+R` → Bài học mới xuất hiện! 🎊

---

## 📊 Output mẫu khi chạy script

```
╔════════════════════════════════════════════╗
║  TỰ ĐỘNG TẠO DATA-INDEX.JSON              ║
╚════════════════════════════════════════════╝

🔍 Bắt đầu quét thư mục data/...

📚 Quét khóa học: Toán 12
  📂 Quét chương: Chương 3 - Nguyên hàm tích phân
   ✓ Tìm thấy bài học: Bài 1
   ✓ Tìm thấy bài học: Bài 2
   ✓ Tìm thấy bài học: Bài 3
   ✓ Tìm thấy bài học: Bài 4
   ✓ Tìm thấy bài học: Bài 5  ← BÀI MỚI!
  ✅ Tìm thấy 1 chương, 5 bài học

✅ Đã tạo file data-index.json thành công!
📁 Đường dẫn: ...\assets\data-index.json
📊 Tổng số khóa học: 3
   - Toán 12: 5 bài học
📖 Tổng số bài học: 5

✨ Hoàn thành! Bạn có thể reload trang web để xem kết quả.
```

---

## 🎯 Lưu ý quan trọng

### ✅ Script sẽ tự động nhận diện folder là "bài học" nếu có ít nhất 1 file:
- `lythuyet.md`
- `vidu.json`
- `baitap.json`
- `linkbaigiang.json`

### ✅ Tên folder = Tên hiển thị
Tên folder sẽ được dùng trực tiếp làm tên hiển thị trên web.

**Ví dụ:**
- Folder: `Bài 5 - Tích phân`
- Hiển thị: **Bài 5 - Tích phân**

### ✅ Cấu trúc bắt buộc
```
data/[Khóa học]/[Chương]/[Bài học]/
```

Phải có đủ 3 cấp folder!

---

## 🔧 Thêm khóa học mới

### Bước 1: Tạo folder khóa học
```
data/Sinh học 12/
```

### Bước 2: Thêm emoji (Tùy chọn)

Mở file `scripts/generate-data-index.js`, tìm dòng:
```javascript
const COURSE_ICONS = {
    'Toán 12': '📐',
    'Vật lý 12': '⚛️',
    'Hóa học 12': '🧪',
    'Sinh học 12': '🧬',  // ← Thêm dòng này
};
```

### Bước 3: Tạo chương và bài học
```
data/Sinh học 12/Chương 1 - Tế bào/Bài 1/
```

### Bước 4: Chạy script
```
Double-click: "Cập nhật danh sách bài học.bat"
```

---

## ❓ Câu hỏi thường gặp

### Q: Tôi có thể đổi tên folder không?
**A:** Có! Đổi tên folder → Chạy lại script → Tên mới sẽ hiển thị.

### Q: Tôi có thể xóa bài học không?
**A:** Có! Xóa folder → Chạy lại script → Bài học biến mất.

### Q: Tôi có thể di chuyển bài học sang chương khác không?
**A:** Có! Di chuyển folder → Chạy lại script → Bài học xuất hiện ở chương mới.

### Q: Tôi phải chạy script mỗi khi thêm bài học mới?
**A:** Đúng! Nhưng chỉ mất vài giây thôi. Double-click file `.bat` là xong!

### Q: File `data-index.json` có bị ghi đè không?
**A:** Có! Mỗi lần chạy script, file này được tạo lại hoàn toàn từ cấu trúc folder.

### Q: Tôi có thể chỉnh sửa `data-index.json` thủ công không?
**A:** KHÔNG nên! Vì mỗi lần chạy script, file sẽ bị ghi đè. Hãy chỉnh sửa cấu trúc folder thay vì chỉnh JSON.

---

## 🎉 Kết luận

**Trước đây:** Phải chỉnh sửa JSON thủ công → Dễ sai, mất thời gian  
**Bây giờ:** Tạo folder → Chạy script → Xong! ⚡

**Quy trình làm việc mới:**
1. 📁 Tạo folder bài học mới
2. 📝 Thêm file dữ liệu (lythuyet.md, vidu.json, baitap.json, linkbaigiang.json)
3. 🚀 Double-click "Cập nhật danh sách bài học.bat"
4. 🌐 Reload trang web
5. ✅ Hoàn thành!

---

**Chúc bạn tạo nội dung hiệu quả! 🚀📚**
