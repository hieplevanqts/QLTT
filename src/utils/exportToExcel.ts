/**
 * Export utilities for exporting data to Excel/CSV format
 * Uses CSV format which is natively supported by Excel
 */

export interface ExportColumn<T> {
  key: keyof T | string;
  label: string;
  format?: (value: any, row: T) => string;
}

export interface ExportOptions {
  filename: string;
  sheetName?: string;
}

/**
 * Convert data to CSV format and trigger download
 */
export function exportToCSV<T extends Record<string, any>>(
  data: T[],
  columns: ExportColumn<T>[],
  options: ExportOptions
): void {
  if (data.length === 0) {
    throw new Error('Không có dữ liệu để xuất');
  }

  // Create CSV header
  const headers = columns.map(col => col.label);
  const csvRows: string[] = [];
  
  // Add header row
  csvRows.push(headers.map(h => escapeCSVValue(h)).join(','));

  // Add data rows
  data.forEach(row => {
    const values = columns.map(col => {
      const key = col.key as keyof T;
      let value = row[key];
      
      // Apply custom formatting if provided
      if (col.format) {
        value = col.format(value, row);
      }
      
      // Handle null/undefined
      if (value === null || value === undefined) {
        return '';
      }
      
      return escapeCSVValue(String(value));
    });
    
    csvRows.push(values.join(','));
  });

  // Create CSV content with BOM for proper UTF-8 encoding in Excel
  const BOM = '\uFEFF';
  const csvContent = BOM + csvRows.join('\n');

  // Create blob and trigger download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
  const filename = `${options.filename}_${timestamp}.csv`;
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}

/**
 * Escape CSV values to handle commas, quotes, and newlines
 */
function escapeCSVValue(value: string): string {
  // If value contains comma, quote, or newline, wrap in quotes and escape existing quotes
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

/**
 * Format date for CSV export
 */
export function formatDateForExport(date: string | Date | null | undefined): string {
  if (!date) return '';
  
  const d = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(d.getTime())) return '';
  
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  
  return `${day}/${month}/${year}`;
}

/**
 * Format date time for CSV export
 */
export function formatDateTimeForExport(date: string | Date | null | undefined): string {
  if (!date) return '';
  
  const d = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(d.getTime())) return '';
  
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

/**
 * Format number for CSV export
 */
export function formatNumberForExport(value: number | null | undefined, decimals: number = 0): string {
  if (value === null || value === undefined) return '';
  return value.toFixed(decimals);
}

/**
 * Format currency for CSV export (VND)
 */
export function formatCurrencyForExport(value: number | null | undefined): string {
  if (value === null || value === undefined) return '';
  return value.toLocaleString('vi-VN');
}
