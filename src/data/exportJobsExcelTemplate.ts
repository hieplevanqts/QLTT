/**
 * Export Jobs Excel Template Generator - MAPPA Portal
 * Tạo Excel template cho nhập/xuất dữ liệu Export Jobs
 * Tuân thủ design tokens từ /src/styles/theme.css với Inter font
 */

import * as XLSX from 'xlsx';
import {
  SAMPLE_EXPORT_JOBS,
  EXPORT_JOB_COLUMNS,
  ExportJob,
  getSourceTypeLabel,
} from './exportJobsTemplates';

// ============================================================================
// EXCEL EXPORT
// ============================================================================

/**
 * Xuất danh sách Export Jobs ra file Excel
 */
export const exportJobsToExcel = (jobs: ExportJob[] = SAMPLE_EXPORT_JOBS) => {
  try {
    const data = jobs.map((job, index) => ({
      'STT': index + 1,
      'Mã Job': job.jobId,
      'Tên Job/Nguồn': job.sourceName,
      'Loại Nguồn': getSourceTypeLabel(job.sourceType),
      'Người Yêu Cầu': job.requestedBy,
      'Trạng Thái': job.status,
      'Thời Gian Yêu Cầu': job.requestedAt,
      'Thời Gian Hoàn Thành': job.completedAt || '',
      'Tóm Tắt Lỗi': job.errorSummary || '',
      'Số Lần Tải Xuống': job.downloadCount,
      'Chính Sách Lưu Trữ': job.retentionPolicy,
      'Kích Thước File': job.fileSize || '',
      'Định Dạng': job.fileFormat || '',
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Export Jobs');

    // Auto-size columns
    const wscols = [
      { wch: 5 },   // STT
      { wch: 15 },  // Mã Job
      { wch: 50 },  // Tên
      { wch: 20 },  // Loại
      { wch: 20 },  // Người yêu cầu
      { wch: 15 },  // Trạng thái
      { wch: 20 },  // Thời gian yêu cầu
      { wch: 20 },  // Thời gian hoàn thành
      { wch: 60 },  // Lỗi
      { wch: 18 },  // Download
      { wch: 20 },  // Retention
      { wch: 15 },  // Size
      { wch: 12 },  // Format
    ];
    ws['!cols'] = wscols;

    const fileName = `Export_Jobs_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);

    return { success: true, fileName };
  } catch (error) {
    console.error('❌ Error exporting to Excel:', error);
    return { success: false, error };
  }
};

// ============================================================================
// EXCEL TEMPLATE DOWNLOAD
// ============================================================================

/**
 * Tải file Excel mẫu để nhập liệu
 */
export const downloadExcelTemplate = () => {
  try {
    // Sheet 1: Template data
    const templateData = [
      {
        'Mã Job': 'EX-2024-XXX',
        'Tên Job/Nguồn': 'Tên báo cáo hoặc mô tả job',
        'Loại Nguồn': 'Báo cáo',
        'Người Yêu Cầu': 'Tên người yêu cầu',
        'Trạng Thái': 'Completed',
        'Thời Gian Yêu Cầu': '2024-01-14 09:00:00',
        'Thời Gian Hoàn Thành': '2024-01-14 09:05:00',
        'Tóm Tắt Lỗi': '',
        'Số Lần Tải Xuống': 0,
        'Chính Sách Lưu Trữ': '90 ngày',
        'Kích Thước File': '2.5 MB',
        'Định Dạng': 'XLSX',
      },
      {
        'Mã Job': 'EX-2024-YYY',
        'Tên Job/Nguồn': 'Trích xuất Nhật ký Audit',
        'Loại Nguồn': 'Nhật ký Audit',
        'Người Yêu Cầu': 'Admin System',
        'Trạng Thái': 'Processing',
        'Thời Gian Yêu Cầu': '2024-01-14 10:00:00',
        'Thời Gian Hoàn Thành': '',
        'Tóm Tắt Lỗi': '',
        'Số Lần Tải Xuống': 0,
        'Chính Sách Lưu Trữ': '1 năm',
        'Kích Thước File': '',
        'Định Dạng': 'CSV',
      },
    ];

    const ws = XLSX.utils.json_to_sheet(templateData);
    const wscols = [
      { wch: 15 },  // Mã Job
      { wch: 50 },  // Tên
      { wch: 20 },  // Loại
      { wch: 20 },  // Người yêu cầu
      { wch: 15 },  // Trạng thái
      { wch: 20 },  // Thời gian yêu cầu
      { wch: 20 },  // Thời gian hoàn thành
      { wch: 60 },  // Lỗi
      { wch: 18 },  // Download
      { wch: 20 },  // Retention
      { wch: 15 },  // Size
      { wch: 12 },  // Format
    ];
    ws['!cols'] = wscols;

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Template');

    // Sheet 2: Instructions
    const instructions = [
      {
        'CỘT': 'Mã Job',
        'BẮT BUỘC': 'Có',
        'ĐỊNH DẠNG': 'Text',
        'GIÁ TRỊ HỢP LỆ': 'EX-YYYY-NNN',
        'GHI CHÚ': 'Mã định danh duy nhất (VD: EX-2024-001)',
      },
      {
        'CỘT': 'Tên Job/Nguồn',
        'BẮT BUỘC': 'Có',
        'ĐỊNH DẠNG': 'Text',
        'GIÁ TRỊ HỢP LỆ': 'Bất kỳ',
        'GHI CHÚ': 'Tên báo cáo hoặc mô tả chi tiết',
      },
      {
        'CỘT': 'Loại Nguồn',
        'BẮT BUỘC': 'Có',
        'ĐỊNH DẠNG': 'Text',
        'GIÁ TRỊ HỢP LỆ': 'Báo cáo, Nhật ký Audit',
        'GHI CHÚ': 'Chỉ nhập 1 trong 2 giá trị',
      },
      {
        'CỘT': 'Người Yêu Cầu',
        'BẮT BUỘC': 'Có',
        'ĐỊNH DẠNG': 'Text',
        'GIÁ TRỊ HỢP LỆ': 'Bất kỳ',
        'GHI CHÚ': 'Tên người dùng đã tạo yêu cầu',
      },
      {
        'CỘT': 'Trạng Thái',
        'BẮT BUỘC': 'Có',
        'ĐỊNH DẠNG': 'Text',
        'GIÁ TRỊ HỢP LỆ': 'Processing, Completed, Failed, Cancelled, Expired',
        'GHI CHÚ': 'Chỉ nhập 1 trong 5 giá trị',
      },
      {
        'CỘT': 'Thời Gian Yêu Cầu',
        'BẮT BUỘC': 'Có',
        'ĐỊNH DẠNG': 'DateTime',
        'GIÁ TRỊ HỢP LỆ': 'YYYY-MM-DD HH:mm:ss',
        'GHI CHÚ': 'Thời điểm job được tạo (VD: 2024-01-14 09:30:00)',
      },
      {
        'CỘT': 'Thời Gian Hoàn Thành',
        'BẮT BUỘC': 'Không',
        'ĐỊNH DẠNG': 'DateTime',
        'GIÁ TRỊ HỢP LỆ': 'YYYY-MM-DD HH:mm:ss',
        'GHI CHÚ': 'Để trống nếu status = Processing',
      },
      {
        'CỘT': 'Tóm Tắt Lỗi',
        'BẮT BUỘC': 'Không',
        'ĐỊNH DẠNG': 'Text',
        'GIÁ TRỊ HỢP LỆ': 'Bất kỳ',
        'GHI CHÚ': 'Chỉ điền nếu status = Failed',
      },
      {
        'CỘT': 'Số Lần Tải Xuống',
        'BẮT BUỘC': 'Có',
        'ĐỊNH DẠNG': 'Number',
        'GIÁ TRỊ HỢP LỆ': '0 trở lên',
        'GHI CHÚ': 'Số lần file đã được tải xuống',
      },
      {
        'CỘT': 'Chính Sách Lưu Trữ',
        'BẮT BUỘC': 'Có',
        'ĐỊNH DẠNG': 'Text',
        'GIÁ TRỊ HỢP LỆ': '7 ngày, 30 ngày, 90 ngày, 180 ngày, 1 năm, Vĩnh viễn',
        'GHI CHÚ': 'Chỉ nhập 1 trong các giá trị',
      },
      {
        'CỘT': 'Kích Thước File',
        'BẮT BUỘC': 'Không',
        'ĐỊNH DẠNG': 'Text',
        'GIÁ TRỊ HỢP LỆ': 'X.X MB',
        'GHI CHÚ': 'VD: 2.5 MB, 15.7 MB',
      },
      {
        'CỘT': 'Định Dạng',
        'BẮT BU��C': 'Không',
        'ĐỊNH DẠNG': 'Text',
        'GIÁ TRỊ HỢP LỆ': 'XLSX, CSV, PDF',
        'GHI CHÚ': 'Định dạng file xuất',
      },
    ];

    const wsInstructions = XLSX.utils.json_to_sheet(instructions);
    const wsInstructionsCols = [
      { wch: 25 },  // Cột
      { wch: 12 },  // Bắt buộc
      { wch: 12 },  // Định dạng
      { wch: 60 },  // Giá trị hợp lệ
      { wch: 60 },  // Ghi chú
    ];
    wsInstructions['!cols'] = wsInstructionsCols;
    XLSX.utils.book_append_sheet(wb, wsInstructions, 'Hướng dẫn');

    // Sheet 3: Valid Values
    const validValues = [
      { 'LOẠI': 'Loại Nguồn', 'GIÁ TRỊ': 'Báo cáo', 'MÃ': 'REPORT_RUN' },
      { 'LOẠI': 'Loại Nguồn', 'GIÁ TRỊ': 'Nhật ký Audit', 'MÃ': 'AUDIT_EXCERPT' },
      { 'LOẠI': '', 'GIÁ TRỊ': '', 'MÃ': '' },
      { 'LOẠI': 'Trạng Thái', 'GIÁ TRỊ': 'Đang xử lý', 'MÃ': 'Processing' },
      { 'LOẠI': 'Trạng Thái', 'GIÁ TRỊ': 'Hoàn thành', 'MÃ': 'Completed' },
      { 'LOẠI': 'Trạng Thái', 'GIÁ TRỊ': 'Thất bại', 'MÃ': 'Failed' },
      { 'LOẠI': 'Trạng Thái', 'GIÁ TRỊ': 'Đã hủy', 'MÃ': 'Cancelled' },
      { 'LOẠI': 'Trạng Thái', 'GIÁ TRỊ': 'Đã hết hạn', 'MÃ': 'Expired' },
      { 'LOẠI': '', 'GIÁ TRỊ': '', 'MÃ': '' },
      { 'LOẠI': 'Chính Sách Lưu Trữ', 'GIÁ TRỊ': '7 ngày', 'MÃ': '7d' },
      { 'LOẠI': 'Chính Sách Lưu Trữ', 'GIÁ TRỊ': '30 ngày', 'MÃ': '30d' },
      { 'LOẠI': 'Chính Sách Lưu Trữ', 'GIÁ TRỊ': '90 ngày', 'MÃ': '90d' },
      { 'LOẠI': 'Chính Sách Lưu Trữ', 'GIÁ TRỊ': '180 ngày', 'MÃ': '180d' },
      { 'LOẠI': 'Chính Sách Lưu Trữ', 'GIÁ TRỊ': '1 năm', 'MÃ': '365d' },
      { 'LOẠI': 'Chính Sách Lưu Trữ', 'GIÁ TRỊ': 'Vĩnh viễn', 'MÃ': 'forever' },
    ];

    const wsValidValues = XLSX.utils.json_to_sheet(validValues);
    const wsValidValuesCols = [
      { wch: 25 },
      { wch: 25 },
      { wch: 20 },
    ];
    wsValidValues['!cols'] = wsValidValuesCols;
    XLSX.utils.book_append_sheet(wb, wsValidValues, 'Giá trị hợp lệ');

    const fileName = `Mau_Export_Jobs_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);

    return { success: true, fileName };
  } catch (error) {
    console.error('❌ Error generating template:', error);
    return { success: false, error };
  }
};

// ============================================================================
// EXCEL IMPORT
// ============================================================================

/**
 * Parse dữ liệu từ file Excel
 */
export const parseExcelFile = async (
  file: File
): Promise<{ success: boolean; data?: ExportJob[]; error?: string }> => {
  try {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(sheet) as any[];

          const parsedJobs: ExportJob[] = [];
          const errors: string[] = [];

          jsonData.forEach((row, index) => {
            try {
              // Validate required fields
              if (!row['Mã Job'] || !row['Tên Job/Nguồn']) {
                errors.push(`Dòng ${index + 2}: Thiếu Mã Job hoặc Tên Job`);
                return;
              }

              // Parse sourceType
              let sourceType: 'REPORT_RUN' | 'AUDIT_EXCERPT' = 'REPORT_RUN';
              if (row['Loại Nguồn'] === 'Nhật ký Audit') {
                sourceType = 'AUDIT_EXCERPT';
              }

              // Parse status
              const statusMap: Record<string, JobStatus> = {
                'Processing': 'Processing',
                'Completed': 'Completed',
                'Failed': 'Failed',
                'Cancelled': 'Cancelled',
                'Expired': 'Expired',
                'Đang xử lý': 'Processing',
                'Hoàn thành': 'Completed',
                'Thất bại': 'Failed',
                'Đã hủy': 'Cancelled',
                'Đã hết hạn': 'Expired',
              };
              const status = statusMap[row['Trạng Thái']] || 'Processing';

              const job: ExportJob = {
                jobId: row['Mã Job'],
                sourceName: row['Tên Job/Nguồn'],
                sourceType,
                requestedBy: row['Người Yêu Cầu'] || 'Unknown',
                status,
                requestedAt: row['Thời Gian Yêu Cầu'] || new Date().toISOString(),
                completedAt: row['Thời Gian Hoàn Thành'] || null,
                errorSummary: row['Tóm Tắt Lỗi'] || null,
                downloadCount: parseInt(row['Số Lần Tải Xuống'] || '0', 10),
                retentionPolicy: row['Chính Sách Lưu Trữ'] || '90 ngày',
                fileSize: row['Kích Thước File'] || undefined,
                fileFormat: row['Định Dạng'] || undefined,
              };

              parsedJobs.push(job);
            } catch (error) {
              errors.push(`Dòng ${index + 2}: Lỗi parse dữ liệu - ${error}`);
            }
          });

          if (errors.length > 0) {
            console.warn('⚠️ Import warnings:', errors);
          }

          resolve({ success: true, data: parsedJobs });
        } catch (error) {
          reject({ success: false, error: `Lỗi đọc file Excel: ${error}` });
        }
      };

      reader.onerror = () => {
        reject({ success: false, error: 'Lỗi đọc file' });
      };

      reader.readAsBinaryString(file);
    });
  } catch (error) {
    return { success: false, error: `${error}` };
  }
};

// ============================================================================
// EXPORT ALL
// ============================================================================

export default {
  exportJobsToExcel,
  downloadExcelTemplate,
  parseExcelFile,
};
