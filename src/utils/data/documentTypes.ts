import { DocumentType } from '@/components/ui-kit/DocumentUploadDialog';

// Định nghĩa các loại giấy tờ hỗ trợ
export const DOCUMENT_TYPES: Record<string, DocumentType> = {
  cccd: {
    id: 'cccd',
    name: 'CCCD / CMND chủ hộ',
    description: 'Căn cước công dân hoặc Chứng minh nhân dân của Chủ cơ sở',
    acceptedFormats: ['.pdf', '.jpg', '.jpeg', '.png', '.webp'],
    maxSizeMB: 10,
    fields: [
      {
        key: 'idNumber',
        label: 'Số CCCD/CMND',
        type: 'text',
        required: true,
        placeholder: 'VD: 001234567890',
      },
      {
        key: 'fullName',
        label: 'Họ và tên',
        type: 'text',
        required: true,
        placeholder: 'VD: Nguyễn Văn A',
      },
      {
        key: 'dateOfBirth',
        label: 'Ngày sinh',
        type: 'date',
        required: true,
      },
      {
        key: 'issueDate',
        label: 'Ngày cấp',
        type: 'date',
        required: true,
      },
      {
        key: 'issuePlace',
        label: 'Nơi cấp',
        type: 'text',
        required: true,
        placeholder: 'VD: Cục Cảnh sát ĐKQL cư trú và DLQG về dân cư',
      },
      {
        key: 'sex',
        label: 'Giới tính',
        type: 'text',
        required: false,
      },
      {
        key: 'nationality',
        label: 'Quốc tịch',
        type: 'text',
        required: false,
      },
      {
        key: 'placeOfOrigin',
        label: 'Quê quán',
        type: 'textarea',
        required: false,
      },
      {
        key: 'address',
        label: 'Địa chỉ thường trú',
        type: 'textarea',
        required: false,
        placeholder: 'Địa chỉ ghi trên CCCD/CMND',
      },
    ],
  },

  'business-license': {
    id: 'business-license',
    name: 'Giấy phép kinh doanh',
    description: 'Giấy chứng nhận đăng ký kinh doanh / Giấy phép kinh doanh',
    acceptedFormats: ['.pdf', '.jpg', '.jpeg', '.png', '.webp'],
    maxSizeMB: 10,
    fields: [
      {
        key: 'licenseNumber',
        label: 'Số giấy phép',
        type: 'text',
        required: true,
        placeholder: 'VD: GPKD-0123456789',
      },
      {
        key: 'issueDate',
        label: 'Ngày cấp',
        type: 'date',
        required: true,
      },
      {
        key: 'expiryDate',
        label: 'Ngày hết hạn',
        type: 'date',
        required: false,
      },
      {
        key: 'issuingAuthority',
        label: 'Cơ quan cấp',
        type: 'text',
        required: true,
        placeholder: 'VD: Sở Kế hoạch và Đầu tư Hà Nội',
      },
      {
        key: 'businessScope',
        label: 'Ngành nghề kinh doanh',
        type: 'textarea',
        required: false,
        placeholder: 'VD: Kinh doanh thực phẩm, đồ uống',
      },
      {
        key: 'businessName',
        label: 'Tên doanh nghiệp',
        type: 'textarea',
        required: false,
        placeholder: 'Tên đầy đủ của doanh nghiệp',
      },
      {
        key: 'ownerName',
        label: 'Người đại diện',
        type: 'text',
        required: false,
        placeholder: 'Họ và tên người đại diện pháp luật',
      },
      {
        key: 'address',
        label: 'Địa chỉ kinh doanh',
        type: 'textarea',
        required: false,
        placeholder: 'Địa chỉ ghi trên giấy phép',
      },
    ],
  },

  'lease-contract': {
    id: 'lease-contract',
    name: 'Hợp đồng thuê mặt bằng',
    description: 'Hợp đồng thuê địa điểm kinh doanh',
    acceptedFormats: ['.pdf', '.jpg', '.jpeg', '.png', '.webp'],
    maxSizeMB: 15,
    fields: [
      {
        key: 'contractNumber',
        label: 'Số hợp đồng',
        type: 'text',
        required: true,
        placeholder: 'VD: HĐ-2023-001',
      },
      {
        key: 'lessor',
        label: 'Bên cho thuê',
        type: 'text',
        required: true,
        placeholder: 'VD: Công ty TNHH ABC',
      },
      {
        key: 'lessee',
        label: 'Bên thuê',
        type: 'text',
        required: true,
        placeholder: 'VD: Nguyễn Văn A',
      },
      {
        key: 'startDate',
        label: 'Ngày bắt đầu',
        type: 'date',
        required: true,
      },
      {
        key: 'endDate',
        label: 'Ngày kết thúc',
        type: 'date',
        required: true,
      },
      {
        key: 'monthlyRent',
        label: 'Tiền thuê hàng tháng (VNĐ)',
        type: 'number',
        required: false,
        placeholder: 'VD: 15000000',
      },
      {
        key: 'address',
        label: 'Địa chỉ mặt bằng',
        type: 'textarea',
        required: true,
        placeholder: 'Địa chỉ chi tiết của mặt bằng',
      },
    ],
  },

  'food-safety': {
    id: 'food-safety',
    name: 'Giấy chứng nhận ATTP',
    description: 'Giấy chứng nhận An toàn Thực phẩm',
    acceptedFormats: ['.pdf', '.jpg', '.jpeg', '.png', '.webp'],
    maxSizeMB: 10,
    fields: [
      {
        key: 'certificateNumber',
        label: 'Số giấy chứng nhận',
        type: 'text',
        required: true,
        placeholder: 'VD: ATTP-2023-001234',
      },
      {
        key: 'issueDate',
        label: 'Ngày cấp',
        type: 'date',
        required: true,
      },
      {
        key: 'expiryDate',
        label: 'Ngày hết hạn',
        type: 'date',
        required: true,
      },
      {
        key: 'issuingAuthority',
        label: 'Cơ quan cấp',
        type: 'text',
        required: true,
        placeholder: 'VD: Chi cục An toàn Vệ sinh Thực phẩm Hà Nội',
      },
      {
        key: 'scope',
        label: 'Phạm vi hoạt động',
        type: 'textarea',
        required: true,
        placeholder: 'VD: Chế biến và bán lẻ thực phẩm',
      },
    ],
  },

  'specialized-license': {
    id: 'specialized-license',
    name: 'Giấy phép chuyên ngành',
    description: 'Giấy phép kinh doanh chuyên ngành (Y tế, Dược phẩm, v.v.)',
    acceptedFormats: ['.pdf', '.jpg', '.jpeg', '.png', '.webp'],
    maxSizeMB: 10,
    fields: [
      {
        key: 'licenseNumber',
        label: 'Số giấy phép',
        type: 'text',
        required: true,
        placeholder: 'VD: GPCN-2023-5678',
      },
      {
        key: 'issueDate',
        label: 'Ngày cấp',
        type: 'date',
        required: true,
      },
      {
        key: 'expiryDate',
        label: 'Ngày hết hạn',
        type: 'date',
        required: true,
      },
      {
        key: 'issuingAuthority',
        label: 'Cơ quan cấp',
        type: 'text',
        required: true,
        placeholder: 'VD: Sở Y tế Hà Nội',
      },
      {
        key: 'scope',
        label: 'Phạm vi hoạt động',
        type: 'textarea',
        required: true,
        placeholder: 'VD: Kinh doanh thuốc không kê đơn',
      },
    ],
  },

  'fire-safety': {
    id: 'fire-safety',
    name: 'Giấy phép PCCC',
    description: 'Giấy chứng nhận Phòng cháy chữa cháy',
    acceptedFormats: ['.pdf', '.jpg', '.jpeg', '.png', '.webp'],
    maxSizeMB: 10,
    fields: [
      {
        key: 'certificateNumber',
        label: 'Số giấy chứng nhận',
        type: 'text',
        required: true,
        placeholder: 'VD: PCCC-2023-9999',
      },
      {
        key: 'issueDate',
        label: 'Ngày cấp',
        type: 'date',
        required: true,
      },
      {
        key: 'expiryDate',
        label: 'Ngày hết hạn',
        type: 'date',
        required: true,
      },
      {
        key: 'issuingAuthority',
        label: 'Cơ quan cấp',
        type: 'text',
        required: true,
        placeholder: 'VD: Phòng Cảnh sát PCCC - Phường 1',
      },
      {
        key: 'inspectionResult',
        label: 'Kết quả kiểm tra',
        type: 'textarea',
        required: false,
        placeholder: 'VD: Đạt yêu cầu PCCC',
      },
    ],
  },
};

// Helper function to get document type by ID
export function getDocumentTypeById(id: string): DocumentType | undefined {
  return DOCUMENT_TYPES[id];
}

// Get all document types as array
export function getAllDocumentTypes(): DocumentType[] {
  return Object.values(DOCUMENT_TYPES);
}
