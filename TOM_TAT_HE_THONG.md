# 📊 TÓM TẮT: HỆ THỐNG TỰ ĐỘNG QUÉT FOLDER

## 🎯 Vấn đề đã giải quyết

**Trước đây:**
- ❌ Phải chỉnh sửa file `data-index.json` thủ công
- ❌ Dễ sai format, thiếu dấu phẩy, ngoặc
- ❌ Mất thời gian khai báo từng bài học

**Bây giờ:**
- ✅ Tạo folder → Chạy script → Xong!
- ✅ Tự động phát hiện khóa học, chương, bài học
- ✅ Tự động tìm file PDF tài liệu
- ✅ Chỉ mất vài giây

---

## 🔄 Quy trình làm việc mới

```
┌─────────────────────────────────────────────────────────────┐
│  1. TẠO FOLDER BÀI HỌC MỚI                                  │
│     data/Toán 12/Chương 3/Bài 5/                            │
├─────────────────────────────────────────────────────────────┤
│  2. THÊM FILE DỮ LIỆU                                       │
│     ├── lythuyet.md                                         │
│     ├── vidu.json                                           │
│     ├── baitap.json                                         │
│     ├── linkbaigiang.json                                   │
│     └── tailieu/                                            │
│         ├── tailieu_baigiang.pdf                            │
│         └── baitap_venha.pdf                                │
├─────────────────────────────────────────────────────────────┤
│  3. CHẠY SCRIPT                                             │
│     Double-click: "Cập nhật danh sách bài học.bat"         │
│     hoặc: node scripts/generate-data-index.js              │
├─────────────────────────────────────────────────────────────┤
│  4. RELOAD TRANG WEB                                        │
│     Nhấn F5 → Bài học mới xuất hiện!                        │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 Cấu trúc Folder

```
learning-platform/
│
├── 📄 Cập nhật danh sách bài học.bat  ← DOUBLE-CLICK FILE NÀY!
├── 📄 HUONG_DAN_NHANH.md              ← Đọc hướng dẫn chi tiết
│
├── 📁 data/                            ← THÊM BÀI HỌC Ở ĐÂY
│   ├── Toán 12/
│   │   ├── Chương 1 - Hàm số/
│   │   │   └── Bài 1/
│   │   │       ├── lythuyet.md
│   │   │       ├── vidu.json
│   │   │       ├── baitap.json
│   │   │       ├── linkbaigiang.json
│   │   │       └── tailieu/
│   │   │           ├── tailieu_baigiang.pdf
│   │   │           └── baitap_venha.pdf
│   │   │
│   │   └── Chương 3 - Nguyên hàm tích phân/
│   │       ├── Bài 1/
│   │       ├── Bài 2/
│   │       ├── Bài 3/
│   │       └── Bài 4/
│   │
│   ├── Vật lý 12/
│   └── Hóa học 12/
│
├── 📁 assets/
│   ├── data-index.json                 ← File này được TẠO TỰ ĐỘNG
│   ├── css/
│   └── js/
│       ├── app.js
│       └── folder-parser.js            ← Logic quét folder
│
└── 📁 scripts/
    ├── generate-data-index.js          ← Script tự động
    └── README.md
```

---

## 🧠 Logic Hoạt động

### 1. Script quét folder (`generate-data-index.js`)

```javascript
// Quét thư mục data/
data/
├── Toán 12/                    → Khóa học
│   ├── Chương 3.../            → Chương
│   │   ├── Bài 1/              → Bài học ✓
│   │   ├── Bài 2/              → Bài học ✓
│   │   └── Bài 3/              → Bài học ✓
```

### 2. Tạo file `data-index.json`

```json
{
  "courses": [
    {
      "id": "toan-12",
      "title": "Toán 12",          ← Từ tên folder
      "chapters": [
        "Chương 3 - Nguyên hàm tích phân"  ← Từ tên folder
      ],
      "lessons": [
        {
          "path": "Chương 3.../Bài 1",     ← Từ tên folder
          "lecturePdf": "data/.../tailieu_baigiang.pdf",  ← Tự động tìm
          "homeworkPdf": "data/.../baitap_venha.pdf"      ← Tự động tìm
        }
      ]
    }
  ]
}
```

### 3. Web app đọc `data-index.json`

```javascript
// folder-parser.js
async function loadAllCoursesFromFolders() {
    // Đọc data-index.json
    const data = await fetch('assets/data-index.json');
    
    // Load từng khóa học
    for (const courseInfo of data.courses) {
        // Load từng bài học
        for (const lessonPath of courseInfo.lessons) {
            // Tách path thành chương và bài học
            const parts = lessonPath.split('/');
            const chapter = parts[0];     // "Chương 3..."
            const lesson = parts[1];      // "Bài 1"
            
            // Hiển thị lên web
        }
    }
}
```

### 4. Hiển thị trên web

```
📚 Toán 12                          ← course.title
  📂 Chương 3 - Nguyên hàm tích phân  ← lesson.chapter
     1. Bài 1                        ← lesson.shortTitle
     2. Bài 2
     3. Bài 3
```

---

## 🎨 Ví dụ Thực tế

### Tình huống: Thêm "Bài 5 - Tích phân"

#### Bước 1: Tạo folder
```
data/Toán 12/Chương 3 - Nguyên hàm tích phân/Bài 5 - Tích phân/
```

#### Bước 2: Thêm file
```
Bài 5 - Tích phân/
├── lythuyet.md
├── vidu.json
├── baitap.json
└── linkbaigiang.json
```

#### Bước 3: Chạy script
```
Double-click: "Cập nhật danh sách bài học.bat"
```

#### Bước 4: Kết quả
```
✅ Tìm thấy bài học: Bài 5 - Tích phân
✅ Đã tạo file data-index.json thành công!
```

#### Bước 5: Reload web
```
📚 Toán 12
  📂 Chương 3 - Nguyên hàm tích phân
     1. Bài 1
     2. Bài 2
     3. Bài 3
     4. Bài 4
     5. Bài 5 - Tích phân  ← MỚI!
```

---

## 🔑 Điểm Quan Trọng

### ✅ Tên folder = Tên hiển thị
```
Folder: "Bài 5 - Tích phân"
Web:    "Bài 5 - Tích phân"
```

### ✅ Cấu trúc 3 cấp bắt buộc
```
data/[Khóa học]/[Chương]/[Bài học]/
     └─────┬─────┘ └──┬──┘ └───┬───┘
          Cấp 1    Cấp 2   Cấp 3
```

### ✅ Ít nhất 1 file để nhận diện bài học
```
Bài học/
├── lythuyet.md      ← Có ít nhất 1 trong 4 file này
├── vidu.json
├── baitap.json
└── linkbaigiang.json
```

### ✅ Tự động tìm PDF
```
tailieu/
├── tailieu_baigiang.pdf   ← Tìm theo keyword: "file học", "baigiang", "tailieu"
└── baitap_venha.pdf       ← Tìm theo keyword: "btvn", "baitap", "venha"
```

---

## 📊 So sánh Trước và Sau

| Tiêu chí | Trước | Sau |
|----------|-------|-----|
| **Thêm bài học** | Chỉnh JSON thủ công | Tạo folder + Chạy script |
| **Thời gian** | 5-10 phút | 30 giây |
| **Dễ sai** | Cao (format JSON) | Thấp (chỉ tạo folder) |
| **Đổi tên** | Sửa JSON | Đổi tên folder + Chạy script |
| **Xóa bài** | Xóa trong JSON | Xóa folder + Chạy script |
| **Di chuyển** | Sửa path trong JSON | Di chuyển folder + Chạy script |

---

## 🚀 Tóm tắt 1 dòng

**Tạo folder → Chạy script → Reload web → Xong! 🎉**

---

## 📞 Hỗ trợ

- 📖 Đọc chi tiết: `HUONG_DAN_NHANH.md`
- 📜 Hướng dẫn script: `scripts/README.md`
- 📚 Tài liệu đầy đủ: `README.md`
