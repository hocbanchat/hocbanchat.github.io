# 📚 Nền Tảng Học Trực Tuyến

Một trang web học trực tuyến tĩnh (static) với đầy đủ tính năng: video bài giảng, lý thuyết, ví dụ minh họa và hệ thống chấm điểm trắc nghiệm tự động.

## ✨ Tính Năng

- ✅ **Danh sách khóa học** - Hiển thị tất cả khóa học có sẵn
- ✅ **Mục lục bài học** - Danh sách các bài học trong mỗi khóa
- ✅ **Video YouTube** - Embed video bài giảng trực tiếp
- ✅ **Lý thuyết** - Nội dung chi tiết với hỗ trợ Markdown
- ✅ **Ví dụ minh họa** - Có nút xem lời giải từng ví dụ
- ✅ **Bài tập trắc nghiệm** - Tự động chấm điểm thang 10
- ✅ **Hiển thị kết quả** - Điểm số, câu đúng/sai, lời giải chi tiết
- ✅ **Responsive Design** - Hoạt động tốt trên mọi thiết bị
- ✅ **Dark Mode** - Giao diện tối hiện đại
- ✅ **Không cần server** - Deploy lên GitHub Pages miễn phí

## 🎨 Demo

Mở file `index.html` bằng trình duyệt hoặc dùng Live Server trong VS Code.

## 📁 Cấu Trúc Dự Án

```
learning-platform/
├── index.html              # Trang chủ - danh sách khóa học
├── course.html             # Trang khóa học - mục lục bài học
├── lesson.html             # Trang bài học chi tiết
├── assets/
│   ├── css/
│   │   ├── main.css       # CSS chính với design system
│   │   ├── components.css # CSS cho components
│   │   └── quiz.css       # CSS cho quiz
│   ├── js/
│   │   ├── app.js         # Logic chính
│   │   ├── quiz.js        # Logic chấm điểm
│   │   └── utils.js       # Utility functions
│   └── images/
│       └── course-thumbnails/
└── data/
    └── courses.json       # Dữ liệu khóa học
```

## 🚀 Cách Sử Dụng

### 1. Xem Trực Tiếp (Local)

**Cách 1: Mở trực tiếp**
- Mở file `index.html` bằng trình duyệt

**Cách 2: Dùng Live Server (khuyến nghị)**
- Cài đặt extension "Live Server" trong VS Code
- Click chuột phải vào `index.html` → "Open with Live Server"

**Cách 3: Dùng Python**
```bash
# Python 3
python -m http.server 8000

# Truy cập: http://localhost:8000
```

### 2. Deploy lên GitHub Pages

1. **Tạo repository mới** trên GitHub
2. **Upload toàn bộ thư mục** `learning-platform`
3. **Vào Settings** → Pages
4. **Chọn branch** `main` và folder `/ (root)`
5. **Save** và đợi vài phút
6. Truy cập: `https://[username].github.io/[repo-name]`

## 📝 Cách Thêm Nội Dung Mới

### ⚡ Phương Pháp Tự Động (Khuyến nghị)

Hệ thống tự động quét cấu trúc folder và tạo danh sách bài học!

#### Bước 1: Tạo Folder Mới

Tạo cấu trúc folder theo format:
```
data/
├── [Tên Khóa Học]/
│   ├── [Tên Chương]/
│   │   ├── [Tên Bài Học]/
│   │   │   ├── lythuyet.md
│   │   │   ├── vidu.json
│   │   │   ├── baitap.json
│   │   │   ├── linkbaigiang.json
│   │   │   └── tailieu/
│   │   │       ├── tailieu_baigiang.pdf
│   │   │       └── baitap_venha.pdf
```

**Ví dụ:**
```
data/Toán 12/Chương 3 - Nguyên hàm tích phân/Bài 5 - Tích phân/
```

#### Bước 2: Thêm Nội Dung

Tạo các file dữ liệu trong folder bài học:
- `lythuyet.md` - Nội dung lý thuyết (Markdown)
- `vidu.json` - Ví dụ minh họa
- `baitap.json` - Câu hỏi trắc nghiệm
- `linkbaigiang.json` - Link video YouTube

#### Bước 3: Chạy Script Tự Động

**Cách 1: Double-click file batch (Windows)**
```
Double-click vào: "Cập nhật danh sách bài học.bat"
```

**Cách 2: Chạy lệnh trong Terminal**
```bash
node scripts/generate-data-index.js
```

#### Bước 4: Reload Trang Web

Reload lại trang web → Bài học mới xuất hiện tự động! 🎉

---

### 📋 Chi Tiết Các File Dữ Liệu

#### File `lythuyet.md`
```markdown
---
title: Tên bài học
youtubeId: YOUR_YOUTUBE_ID
duration: 45 phút
---

## Lý thuyết

Nội dung markdown với công thức LaTeX...
```

#### File `vidu.json`
```json
[
  {
    "id": 1,
    "question": "Câu hỏi ví dụ",
    "explanation": "**Lời giải:**\n\nChi tiết..."
  }
]
```

#### File `baitap.json`
```json
[
  {
    "id": 1,
    "question": "Câu hỏi?",
    "options": ["A. Đáp án A", "B. Đáp án B", "C. Đáp án C", "D. Đáp án D"],
    "answer": "A",
    "explanation": "**Lời giải:**\n\nGiải thích..."
  }
]
```

#### File `linkbaigiang.json`
```json
[
  {
    "url": "https://www.youtube.com/watch?v=YOUR_VIDEO_ID"
  }
]
```

### Lấy YouTube Video ID

Từ URL: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
Lấy phần sau `v=`: **dQw4w9WgXcQ**

### Thêm Ví Dụ

```json
{
  "id": "vd-1",
  "question": "Câu hỏi ví dụ",
  "solution": "**Lời giải:**\n\nChi tiết..."
}
```

### Thêm Câu Hỏi Trắc Nghiệm

```json
{
  "id": "q1",
  "order": 1,
  "question": "Câu hỏi?",
  "type": "multiple-choice",
  "options": [
    {"id": "A", "text": "Đáp án A"},
    {"id": "B", "text": "Đáp án B"},
    {"id": "C", "text": "Đáp án C"},
    {"id": "D", "text": "Đáp án D"}
  ],
  "correctAnswer": "A",
  "explanation": "**Lời giải:**\n\nGiải thích chi tiết...",
  "points": 1
}
```

## 📊 Cấu Trúc Dữ Liệu JSON

### Course Object

| Field | Type | Mô tả |
|-------|------|-------|
| `id` | string | ID duy nhất (dùng trong URL) |
| `title` | string | Tên khóa học |
| `description` | string | Mô tả khóa học |
| `thumbnail` | string | Icon/Emoji hiển thị |
| `totalLessons` | number | Tổng số bài học |
| `duration` | string | Thời lượng khóa học |
| `level` | string | Độ khó (Cơ bản/Trung bình/Nâng cao) |
| `lessons` | array | Mảng các bài học |

### Lesson Object

| Field | Type | Mô tả |
|-------|------|-------|
| `id` | string | ID bài học |
| `title` | string | Tên bài học |
| `order` | number | Thứ tự bài học |
| `duration` | string | Thời lượng |
| `youtubeId` | string | YouTube video ID |
| `theory` | object | Nội dung lý thuyết (Markdown) |
| `examples` | array | Mảng ví dụ |
| `homework` | object | Bài tập trắc nghiệm |

### Quiz Question Object

| Field | Type | Mô tả |
|-------|------|-------|
| `id` | string | ID câu hỏi |
| `question` | string | Nội dung câu hỏi |
| `options` | array | Các đáp án (A, B, C, D) |
| `correctAnswer` | string | Đáp án đúng (A/B/C/D) |
| `explanation` | string | Lời giải chi tiết (Markdown) |
| `points` | number | Điểm của câu (thường là 1) |

## 🎨 Tùy Chỉnh Giao Diện

Chỉnh sửa file `assets/css/main.css` để thay đổi theme:

```css
:root {
    --primary-solid: #667eea;  /* Màu chủ đạo */
    --bg-main: #0f172a;        /* Màu nền chính */
    --bg-card: #1e293b;        /* Màu nền card */
    --text-primary: #f8fafc;   /* Màu chữ chính */
}
```

## 💡 Mẹo & Lưu Ý

### Viết Nội Dung Markdown

- Dùng `##` cho tiêu đề cấp 2, `###` cho cấp 3
- Dùng `**text**` cho chữ đậm
- Dùng `*text*` cho chữ nghiêng
- Dùng `- item` cho danh sách
- Dùng `\n\n` để ngắt đoạn

### Viết Công Thức Toán Học (LaTeX)

Website hỗ trợ **MathJax** để hiển thị công thức đẹp!

**Công thức inline:** `$f(x) = x^2$` → $f(x) = x^2$

**Công thức block:**
```
$$\int x^2 \, dx = \frac{x^3}{3} + C$$
```

**Ký hiệu thường dùng:**
- Phân số: `\frac{a}{b}`
- Căn: `\sqrt{x}`
- Tích phân: `\int x \, dx`
- Tổng: `\sum_{i=1}^{n}`
- Giới hạn: `\lim_{x \to \infty}`

Chi tiết xem file `HUONG_DAN_MARKDOWN.md`

### Tối Ưu Hiệu Suất

- Giữ file `courses.json` dưới 1MB
- Nén hình ảnh trước khi upload
- Sử dụng YouTube để host video (không upload video vào repo)

### Backup Dữ Liệu

- Git tự động backup mỗi lần commit
- Export file `courses.json` định kỳ
- Sử dụng GitHub để sync nhiều thiết bị

## 🔧 Kỹ Thuật Sử Dụng

- **HTML5** - Cấu trúc semantic
- **CSS3** - Flexbox, Grid, Custom Properties, Animations
- **Vanilla JavaScript** - Không dùng framework
- **JSON** - Lưu trữ dữ liệu
- **Markdown** - Format nội dung

## 📱 Tương Thích

- ✅ Chrome, Firefox, Safari, Edge (phiên bản mới)
- ✅ Mobile browsers
- ✅ Tablet browsers

## 📄 License

Dự án này hoàn toàn miễn phí để sử dụng và chỉnh sửa.

## 🤝 Đóng Góp

Bạn có thể tự do fork và customize theo nhu cầu của mình!

---

**Chúc bạn học tập hiệu quả! 🚀📚**
