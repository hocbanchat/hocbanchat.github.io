# 📜 Hướng dẫn sử dụng Scripts

## 🚀 Script tự động tạo `data-index.json`

### Mục đích
Script này tự động quét toàn bộ cấu trúc folder trong thư mục `data/` và tạo file `assets/data-index.json`.

**Lợi ích:**
- ✅ Không cần khai báo thủ công trong JSON
- ✅ Tự động phát hiện khóa học, chương, bài học mới
- ✅ Tự động tìm file PDF tài liệu
- ✅ Chỉ cần chạy 1 lệnh khi thêm folder mới

### Cách sử dụng

#### Bước 1: Cài đặt Node.js (nếu chưa có)
Tải và cài đặt từ: https://nodejs.org/

#### Bước 2: Chạy script
Mở Terminal/PowerShell tại thư mục gốc của dự án và chạy:

```bash
node scripts/generate-data-index.js
```

#### Bước 3: Reload trang web
Sau khi script chạy xong, reload lại trang web để thấy kết quả.

### Khi nào cần chạy script?

Chạy script mỗi khi bạn:
- ✨ Thêm khóa học mới (tạo folder mới trong `data/`)
- ✨ Thêm chương mới
- ✨ Thêm bài học mới
- ✨ Đổi tên folder
- ✨ Thêm file PDF tài liệu

### Ví dụ quy trình làm việc

1. **Tạo bài học mới:**
   ```
   data/Toán 12/Chương 3 - Nguyên hàm tích phân/Bài 5/
   ```

2. **Thêm các file dữ liệu:**
   - `lythuyet.md`
   - `vidu.json`
   - `baitap.json`
   - `linkbaigiang.json`
   - `tailieu/tailieu_baigiang.pdf`
   - `tailieu/baitap_venha.pdf`

3. **Chạy script:**
   ```bash
   node scripts/generate-data-index.js
   ```

4. **Reload trang web** → Bài học mới xuất hiện tự động! 🎉

### Output mẫu

```
╔════════════════════════════════════════════╗
║  TỰ ĐỘNG TẠO DATA-INDEX.JSON              ║
╚════════════════════════════════════════════╝

🔍 Bắt đầu quét thư mục data/...

📚 Quét khóa học: Toán 12
  📂 Quét chương: Chương 1 - Hàm số
   ✓ Tìm thấy bài học: Bài 1
  📂 Quét chương: Chương 3 - Nguyên hàm tích phân
   ✓ Tìm thấy bài học: Bài 1
   ✓ Tìm thấy bài học: Bài 2
   ✓ Tìm thấy bài học: Bài 3
   ✓ Tìm thấy bài học: Bài 4
  ✅ Tìm thấy 2 chương, 5 bài học

📚 Quét khóa học: Vật lý 12
  ✅ Tìm thấy 0 chương, 0 bài học

✅ Đã tạo file data-index.json thành công!
📁 Đường dẫn: c:\...\assets\data-index.json
📊 Tổng số khóa học: 3
   - Toán 12: 5 bài học
   - Vật lý 12: 0 bài học
   - Hóa học 12: 0 bài học
📖 Tổng số bài học: 5

✨ Hoàn thành! Bạn có thể reload trang web để xem kết quả.
```

### Lưu ý

- Script chỉ nhận diện folder là "bài học" nếu có ít nhất 1 trong các file:
  - `lythuyet.md`
  - `vidu.json`
  - `baitap.json`
  - `linkbaigiang.json`

- Tên folder sẽ được sử dụng trực tiếp làm tên hiển thị
- Cấu trúc phải theo format: `data/[Khóa học]/[Chương]/[Bài học]/`

### Tùy chỉnh

Nếu muốn thêm emoji cho khóa học mới, chỉnh sửa trong file `generate-data-index.js`:

```javascript
const COURSE_ICONS = {
    'Toán 12': '📐',
    'Vật lý 12': '⚛️',
    'Hóa học 12': '🧪',
    'Sinh học 12': '🧬',  // ← Thêm mới
    // Thêm các khóa học khác...
};
```
