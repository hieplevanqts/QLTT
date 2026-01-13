import { EvidenceItem, getStatusLabel, getTypeLabel } from '../types/evidence.types';

/**
 * Export data to CSV format
 */
export function exportToCSV(data: EvidenceItem[], columns: string[], filename: string = 'evidence-export.csv'): void {
  try {
    // Prepare headers
    const headers = columns.map(col => getColumnLabel(col));
    
    // Prepare rows
    const rows = data.map(item => {
      return columns.map(col => {
        const value = getColumnValue(item, col);
        // Escape quotes and wrap in quotes if contains comma or quote
        if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      });
    });

    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    // Add BOM for UTF-8 encoding (helps Excel open Vietnamese characters correctly)
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    downloadBlob(blob, filename);
  } catch (error) {
    console.error('Error exporting to CSV:', error);
    throw error;
  }
}

/**
 * Export data to Excel format (simple HTML table that Excel can open)
 */
export function exportToExcel(data: EvidenceItem[], columns: string[], filename: string = 'evidence-export.xls'): void {
  try {
    // Prepare headers
    const headers = columns.map(col => getColumnLabel(col));
    
    // Create HTML table
    let html = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">';
    html += '<head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>';
    html += '<x:Name>Evidence Data</x:Name>';
    html += '<x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet>';
    html += '</x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->';
    html += '<meta charset="UTF-8">';
    html += '<style>table { border-collapse: collapse; } th, td { border: 1px solid #ddd; padding: 8px; } th { background-color: #f2f2f2; font-weight: bold; }</style>';
    html += '</head><body>';
    html += '<table>';
    
    // Add headers
    html += '<thead><tr>';
    headers.forEach(header => {
      html += `<th>${escapeHtml(header)}</th>`;
    });
    html += '</tr></thead>';
    
    // Add rows
    html += '<tbody>';
    data.forEach(item => {
      html += '<tr>';
      columns.forEach(col => {
        const value = getColumnValue(item, col);
        html += `<td>${escapeHtml(String(value))}</td>`;
      });
      html += '</tr>';
    });
    html += '</tbody>';
    
    html += '</table></body></html>';

    const blob = new Blob([html], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    downloadBlob(blob, filename);
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    throw error;
  }
}

/**
 * Export data to JSON format
 */
export function exportToJSON(data: EvidenceItem[], columns: string[], filename: string = 'evidence-export.json'): void {
  try {
    // Prepare data with selected columns only
    const exportData = data.map(item => {
      const row: Record<string, any> = {};
      columns.forEach(col => {
        row[col] = getColumnValue(item, col);
      });
      return row;
    });

    const jsonContent = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
    downloadBlob(blob, filename);
  } catch (error) {
    console.error('Error exporting to JSON:', error);
    throw error;
  }
}

/**
 * Get column label for display
 */
function getColumnLabel(columnKey: string): string {
  const labels: Record<string, string> = {
    evidenceId: 'Mã chứng cứ',
    evidenceName: 'Tên chứng cứ',
    filename: 'Tên file',
    type: 'Loại',
    status: 'Trạng thái',
    scope: 'Phạm vi',
    capturedAt: 'Ngày chụp',
    uploadedAt: 'Ngày tải lên',
    sensitivityLabel: 'Độ nhạy cảm',
    submitter: 'Người nộp',
    source: 'Nguồn',
    fileCount: 'Số lượng file',
    totalSize: 'Tổng dung lượng',
    hash: 'Hash (SHA-256)',
    location: 'Địa điểm',
    linkedEntities: 'Liên kết',
  };
  return labels[columnKey] || columnKey;
}

/**
 * Get column value from evidence item
 */
function getColumnValue(item: EvidenceItem, columnKey: string): string | number {
  switch (columnKey) {
    case 'evidenceId':
      return item.evidenceId;
    case 'evidenceName':
      return item.evidenceName || '';
    case 'filename':
      return item.files?.[0]?.filename || '';
    case 'type':
      return getTypeLabel(item.type);
    case 'status':
      return getStatusLabel(item.status);
    case 'scope':
      return item.scope.ward || item.scope.province || '';
    case 'capturedAt':
      return item.capturedAt ? new Date(item.capturedAt).toLocaleString('vi-VN') : '';
    case 'uploadedAt':
      return item.uploadedAt ? new Date(item.uploadedAt).toLocaleString('vi-VN') : '';
    case 'sensitivityLabel':
      return item.sensitivityLabel || '';
    case 'submitter':
      return item.submittedBy || '';
    case 'source':
      return item.source || '';
    case 'fileCount':
      return item.files?.length || 0;
    case 'totalSize':
      return formatFileSize(item.files?.reduce((sum, f) => sum + (f.sizeBytes || 0), 0) || 0);
    case 'hash':
      return item.hash?.sha256 || '';
    case 'location':
      return item.location?.addressText || '';
    case 'linkedEntities':
      return item.links?.map(l => `${l.entityType}:${l.entityId}`).join('; ') || '';
    default:
      return '';
  }
}

/**
 * Format file size in bytes to human readable format
 */
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Escape HTML special characters
 */
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

/**
 * Download blob as file
 */
function downloadBlob(blob: Blob, filename: string): void {
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}

/**
 * Get filename with timestamp
 */
export function getExportFilename(format: 'csv' | 'excel' | 'json', prefix: string = 'evidence-export'): string {
  const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
  const extension = format === 'excel' ? 'xls' : format;
  return `${prefix}_${timestamp}.${extension}`;
}
