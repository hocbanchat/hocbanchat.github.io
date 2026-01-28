/**
 * Google Apps Script - Code Server-Side
 * 
 * Hướng dẫn setup:
 * 1. Mở Google Sheet của bạn
 * 2. Extensions → Apps Script
 * 3. Xóa code mặc định, paste toàn bộ code này
 * 4. Deploy → New deployment → Web app
 * 5. Execute as: Me
 * 6. Who has access: Anyone
 * 7. Copy Web app URL
 */

// ===== CẤU HÌNH =====
const SHEET_NAME = 'Điểm Học Sinh'; // Tên sheet để lưu điểm

// ===== XỬ LÝ POST REQUEST =====
function doPost(e) {
    try {
        // Parse dữ liệu từ website
        const data = JSON.parse(e.postData.contents);

        // Validate dữ liệu cơ bản
        if (!data.studentName) {
            return createResponse(false, 'Thiếu tên học sinh');
        }

        if (!data.score && data.score !== 0) {
            return createResponse(false, 'Thiếu điểm số');
        }

        // Validate điểm hợp lệ (0-10)
        if (data.score < 0 || data.score > 10) {
            return createResponse(false, 'Điểm không hợp lệ (phải từ 0-10)');
        }

        // Lấy sheet
        const ss = SpreadsheetApp.getActiveSpreadsheet();
        let sheet = ss.getSheetByName(SHEET_NAME);

        // Nếu sheet chưa tồn tại, tạo mới và thêm header
        if (!sheet) {
            sheet = ss.insertSheet(SHEET_NAME);
            sheet.appendRow([
                'Thời gian',
                'Họ tên',
                'Email',
                'Lớp',
                'Khóa học',
                'Chương',
                'Bài học',
                'Điểm',
                'Đúng',
                'Tổng',
                'Tỷ lệ %'
            ]);

            // Format header
            const headerRange = sheet.getRange(1, 1, 1, 11);
            headerRange.setFontWeight('bold');
            headerRange.setBackground('#4285f4');
            headerRange.setFontColor('#ffffff');
        }

        // Chuẩn bị dữ liệu
        const timestamp = new Date();
        const percentage = data.totalQuestions > 0
            ? ((data.correctCount / data.totalQuestions) * 100).toFixed(1)
            : 0;

        const row = [
            timestamp,
            data.studentName || '',
            data.studentEmail || '',
            data.studentClass || '',
            data.courseName || '',
            data.chapterName || '',
            data.lessonName || '',
            data.score || 0,
            data.correctCount || 0,
            data.totalQuestions || 0,
            percentage
        ];

        // Thêm dòng mới
        sheet.appendRow(row);

        // Format dòng vừa thêm
        const lastRow = sheet.getLastRow();

        // Format cột điểm (màu xanh nếu >= 5, đỏ nếu < 5)
        // Cột điểm hiện tại là cột 8 (H)
        const scoreCell = sheet.getRange(lastRow, 8);
        if (data.score >= 5) {
            scoreCell.setBackground('#d4edda');
            scoreCell.setFontColor('#155724');
        } else {
            scoreCell.setBackground('#f8d7da');
            scoreCell.setFontColor('#721c24');
        }

        // Format cột thời gian
        sheet.getRange(lastRow, 1).setNumberFormat('dd/MM/yyyy HH:mm:ss');

        // Auto-resize columns (chỉ lần đầu)
        if (lastRow === 2) {
            sheet.autoResizeColumns(1, 11);
        }

        // Trả về kết quả thành công
        return createResponse(true, 'Đã lưu điểm thành công!', {
            row: lastRow,
            timestamp: timestamp.toISOString()
        });

    } catch (error) {
        Logger.log('Error: ' + error.toString());
        return createResponse(false, 'Lỗi server: ' + error.toString());
    }
}

// ===== XỬ LÝ GET REQUEST (TEST) =====
function doGet(e) {
    return ContentService.createTextOutput(
        JSON.stringify({
            status: 'API Ready',
            message: 'Google Apps Script đang hoạt động!',
            timestamp: new Date().toISOString()
        })
    ).setMimeType(ContentService.MimeType.JSON);
}

// ===== HELPER FUNCTIONS =====
function createResponse(success, message, data) {
    const response = {
        success: success,
        message: message,
        timestamp: new Date().toISOString()
    };

    if (data) {
        response.data = data;
    }

    return ContentService.createTextOutput(JSON.stringify(response))
        .setMimeType(ContentService.MimeType.JSON);
}

// ===== OPTIONAL: XÓA DỮ LIỆU CŨ =====
// Uncomment nếu muốn tự động xóa dữ liệu cũ hơn X ngày
/*
function cleanOldData() {
  const DAYS_TO_KEEP = 90; // Giữ dữ liệu 90 ngày
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  const data = sheet.getDataRange().getValues();
  const now = new Date();
  
  for (let i = data.length - 1; i > 0; i--) {
    const rowDate = new Date(data[i][0]);
    const daysDiff = (now - rowDate) / (1000 * 60 * 60 * 24);
    
    if (daysDiff > DAYS_TO_KEEP) {
      sheet.deleteRow(i + 1);
    }
  }
}
*/

// ===== OPTIONAL: THỐNG KÊ =====
// Tạo sheet thống kê tự động
function createStatisticsSheet() {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let statsSheet = ss.getSheetByName('Thống Kê');

    if (!statsSheet) {
        statsSheet = ss.insertSheet('Thống Kê');

        // Thêm các công thức thống kê
        statsSheet.getRange('A1').setValue('THỐNG KÊ ĐIỂM HỌC SINH');
        statsSheet.getRange('A1').setFontSize(14).setFontWeight('bold');

        statsSheet.getRange('A3').setValue('Tổng số bài nộp:');
        statsSheet.getRange('B3').setFormula('=COUNTA(\'Điểm Học Sinh\'!A:A)-1');

        statsSheet.getRange('A4').setValue('Điểm trung bình:');
        statsSheet.getRange('B4').setFormula('=AVERAGE(\'Điểm Học Sinh\'!H:H)');

        statsSheet.getRange('A5').setValue('Số bài đạt (≥5):');
        statsSheet.getRange('B5').setFormula('=COUNTIF(\'Điểm Học Sinh\'!H:H,">=5")');

        statsSheet.getRange('A6').setValue('Số bài chưa đạt (<5):');
        statsSheet.getRange('B6').setFormula('=COUNTIF(\'Điểm Học Sinh\'!H:H,"<5")');
    }
}
