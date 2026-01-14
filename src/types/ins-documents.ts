/**
 * Types for INS Document Management System
 * 12 biểu mẫu tích hợp trong flow nghiệp vụ
 */

// Document codes (Mã biểu mẫu)
export type DocumentCode = 
  | 'M01' // QĐ-KT - Quyết định kiểm tra
  | 'M02' // QĐ-SĐBSKT - QĐ sửa đổi bổ sung
  | 'M03' // QĐ-GQ - QĐ giao quyền
  | 'M04' // QĐ-NV - QĐ phân công nhiệm vụ
  | 'M05' // QĐ-KDGH - QĐ kéo dài/gia hạn
  | 'M06' // BB-KT - Biên bản kiểm tra
  | 'M07' // BB-XMLV - Biên bản xác minh/làm việc
  | 'M08' // BC- - Báo cáo
  | 'M09' // ĐX- - Đề xuất kiểm tra đột xuất
  | 'M10' // BK - Bảng kê
  | 'M11' // PL - Phụ lục
  | 'M12'; // Nhật ký công tác

// Document source (Nguồn)
export type DocumentSource = 'import' | 'export';

// Document requirement level (Mức độ)
export type DocumentRequirement = 'required' | 'optional';

// Document status (Trạng thái)
export type DocumentStatus = 
  | 'not_available'      // Chưa có
  | 'draft'              // Nháp
  | 'content_ready'      // Đủ nội dung
  | 'pdf_generated'      // Đã sinh PDF
  | 'signed'             // Đã ký
  | 'pushed_to_ins'      // Đã đẩy INS
  | 'error';             // Lỗi

// Document template definition
export interface DocumentTemplate {
  code: DocumentCode;
  number: string; // Mẫu số (01-12)
  symbol: string; // Ký hiệu (QĐ-KT, BB-KT, etc.)
  name: string; // Tên biểu mẫu
  source: DocumentSource;
  description: string;
}

// Document instance in a business flow
export interface DocumentInstance {
  id: string;
  template: DocumentTemplate;
  requirement: DocumentRequirement; // Dynamic based on context
  status: DocumentStatus;
  
  // Content & Files
  content?: any; // JSON data
  pdfUrl?: string;
  attachments?: DocumentAttachment[];
  
  // INS Integration
  insDocumentId?: string; // ID từ INS sau khi import/export
  lastSyncAt?: string;
  syncStatus?: 'success' | 'pending' | 'failed';
  syncError?: string;
  
  // Metadata
  createdAt?: string;
  createdBy?: string;
  updatedAt?: string;
  updatedBy?: string;
  signedAt?: string;
  signedBy?: string;
  pushedToInsAt?: string;
  
  // Relationships
  parentDocumentId?: string; // For M02, M05, M10, M11 (child of M01 or M06)
  childDocuments?: DocumentInstance[]; // For M01, M06
}

// Document attachment
export interface DocumentAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadedAt: string;
  uploadedBy: string;
}

// Document checklist item (for UI display)
export interface DocumentChecklistItem {
  template: DocumentTemplate;
  instance: DocumentInstance;
  requirement: DocumentRequirement;
  visible: boolean; // Dynamic visibility based on context
  disabled?: boolean;
  warning?: string; // Validation warning
}

// INS Sync Log
export interface InsSyncLog {
  id: string;
  documentId: string;
  documentCode: DocumentCode;
  action: 'import' | 'export' | 'sync';
  status: 'success' | 'failed';
  timestamp: string;
  userId: string;
  userName: string;
  details?: string;
  error?: string;
}

// All 12 document templates
export const DOCUMENT_TEMPLATES: Record<DocumentCode, DocumentTemplate> = {
  M01: {
    code: 'M01',
    number: '01',
    symbol: 'QĐ-KT',
    name: 'Quyết định kiểm tra việc chấp hành pháp luật trong sản xuất, kinh doanh hàng hóa, dịch vụ',
    source: 'import',
    description: 'Văn bản nền tảng khởi động đợt kiểm tra - Import từ INS',
  },
  M02: {
    code: 'M02',
    number: '02',
    symbol: 'QĐ-SĐBSKT',
    name: 'Quyết định sửa đổi, bổ sung Quyết định kiểm tra việc chấp hành pháp luật',
    source: 'import',
    description: 'Điều chỉnh nội dung, đối tượng hoặc thời hạn kiểm tra - Phát sinh - Import từ INS',
  },
  M03: {
    code: 'M03',
    number: '03',
    symbol: 'QĐ-GQ',
    name: 'Quyết định về việc giao quyền ban hành quyết định kiểm tra',
    source: 'import',
    description: 'Ủy quyền cho cấp dưới ban hành quyết định kiểm tra - Import từ INS',
  },
  M04: {
    code: 'M04',
    number: '04',
    symbol: 'QĐ-NV',
    name: 'Quyết định phân công công chức thực hiện biện pháp nghiệp vụ',
    source: 'import',
    description: 'Phân công nhiệm vụ cụ thể cho từng công chức trong đoàn - Import từ INS',
  },
  M05: {
    code: 'M05',
    number: '05',
    symbol: 'QĐ-KDGH',
    name: 'Quyết định kéo dài/Gia hạn thời hạn thẩm tra, xác minh',
    source: 'import',
    description: 'Kéo dài/Gia hạn thời hạn thẩm tra, xác minh - Phát sinh - Import từ INS',
  },
  M06: {
    code: 'M06',
    number: '06',
    symbol: 'BB-KT',
    name: 'Biên bản kiểm tra việc chấp hành pháp luật trong sản xuất, kinh doanh hàng hóa, dịch vụ',
    source: 'export',
    description: 'Ghi nhận kết quả kiểm tra tại hiện trường - Lập tại phần mềm - Export sang INS',
  },
  M07: {
    code: 'M07',
    number: '07',
    symbol: 'BB-XMLV',
    name: 'Biên bản xác minh/làm việc',
    source: 'export',
    description: 'Làm việc/Xác minh với cá nhân, tổ chức liên quan - Lập tại phần mềm - Export sang INS',
  },
  M08: {
    code: 'M08',
    number: '08',
    symbol: 'BC-',
    name: 'Báo cáo',
    source: 'export',
    description: 'Báo cáo kết quả thu thập thông tin/đề xuất xử lý - Lập tại phần mềm - Export sang INS',
  },
  M09: {
    code: 'M09',
    number: '09',
    symbol: 'ĐX-',
    name: 'Đề xuất kiểm tra đột xuất việc chấp hành pháp luật/Khám theo thủ tục hành chính',
    source: 'export',
    description: 'Đề xuất kiểm tra đột xuất khi phát hiện dấu hiệu vi phạm - Lập tại phần mềm - Export sang INS',
  },
  M10: {
    code: 'M10',
    number: '10',
    symbol: 'BK',
    name: 'Bảng kê',
    source: 'export',
    description: 'Liệt kê chi tiết tang vật, phương tiện, hàng hóa, giấy tờ - Kèm theo M06 - Lập tại phần mềm - Export sang INS',
  },
  M11: {
    code: 'M11',
    number: '11',
    symbol: 'PL',
    name: 'Phụ lục',
    source: 'export',
    description: 'Bổ sung nội dung khác (giải trình, bản đồ, hình ảnh...) - Lập tại phần mềm - Export sang INS',
  },
  M12: {
    code: 'M12',
    number: '12',
    symbol: 'Nhật ký',
    name: 'Sổ Nhật ký công tác',
    source: 'export',
    description: 'Ghi chép hàng ngày các hoạt động, nội dung công việc - Có thể auto-fill - Lập tại phần mềm - Export sang INS',
  },
};

// Helper functions
export function getDocumentTemplate(code: DocumentCode): DocumentTemplate {
  return DOCUMENT_TEMPLATES[code];
}

export function createEmptyDocumentInstance(
  template: DocumentTemplate,
  requirement: DocumentRequirement = 'optional'
): DocumentInstance {
  return {
    id: `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    template,
    requirement,
    status: 'not_available',
  };
}

export function getStatusLabel(status: DocumentStatus): string {
  const labels: Record<DocumentStatus, string> = {
    not_available: 'Chưa có',
    draft: 'Nháp',
    content_ready: 'Đủ nội dung',
    pdf_generated: 'Đã sinh PDF',
    signed: 'Đã ký',
    pushed_to_ins: 'Đã đẩy INS',
    error: 'Lỗi',
  };
  return labels[status];
}

export function getStatusColor(status: DocumentStatus): string {
  const colors: Record<DocumentStatus, string> = {
    not_available: '#6B7280', // gray
    draft: '#F59E0B', // amber
    content_ready: '#3B82F6', // blue
    pdf_generated: '#8B5CF6', // violet
    signed: '#10B981', // green
    pushed_to_ins: '#059669', // emerald
    error: '#EF4444', // red
  };
  return colors[status];
}

export function canPerformAction(
  status: DocumentStatus,
  action: 'edit' | 'view_pdf' | 'sign' | 'push_to_ins'
): boolean {
  const actionRules: Record<string, DocumentStatus[]> = {
    edit: ['not_available', 'draft', 'content_ready'],
    view_pdf: ['pdf_generated', 'signed', 'pushed_to_ins'],
    sign: ['pdf_generated'],
    push_to_ins: ['signed', 'pdf_generated'], // Can push if signed or just PDF
  };
  return actionRules[action]?.includes(status) || false;
}
