import { LegalDocument } from '@/components/ui-kit/LegalDocumentItem';

// Placeholder document images (replaced figma:asset imports with placeholder URLs)
const cccdImage = '/placeholder-cccd.png';
const businessLicenseImage = '/placeholder-business-license.png';
const foodSafetyImage = '/placeholder-food-safety.png';
const specializedLicenseImage = '/placeholder-specialized-license.png';
const leaseContractImage = '/placeholder-lease-contract.png';
const fireSafetyImage = '/placeholder-fire-safety.png';

export interface LegalDocumentData extends LegalDocument {
  // Additional fields for uploaded data
  uploadedData?: Record<string, any>;
  // For ID cards with 2 sides
  backFileUrl?: string;
  backFileName?: string;
}

// Mock legal documents for different stores
export const generateLegalDocuments = (storeId: number): LegalDocumentData[] => {
  // Different stores have different document completion levels
  const completionLevel = storeId % 4; // 0: all complete, 1: some expiring, 2: some missing, 3: mixed

  const baseDocuments: LegalDocumentData[] = [
    {
      id: `${storeId}-cccd`,
      type: 'cccd',
      title: 'CCCD / CMND chủ hộ',
      status: 'valid',
      statusText: 'Còn hiệu lực',
      approvalStatus: 'approved',
      approvalStatusText: 'Đã phê duyệt',
      documentNumber: `079${(storeId * 1000000 + 123456).toString().padStart(9, '0')}`,
      issueDate: '15/03/2020',
      expiryDate: 'Không thời hạn',
      issuingAuthority: 'Cục Cảnh sát ĐKQL cư trú và DLQG về dân cư',
      notes: '',
      fileUrl: cccdImage, // Mặt trước
      fileName: 'cccd-mat-truoc.pdf',
      backFileUrl: cccdImage, // Mặt sau (dùng cùng image để demo)
      backFileName: 'cccd-mat-sau.pdf',
      uploadDate: '10/01/2025 09:30',
      uploadedBy: 'Nguyễn Văn A',
    },
    {
      id: `${storeId}-business-license`,
      type: 'business-license',
      title: 'Giấy phép kinh doanh',
      status: completionLevel === 1 ? 'expiring' : 'valid',
      statusText: completionLevel === 1 ? 'Sắp hết hạn (45 ngày)' : 'Còn hiệu lực',
      approvalStatus: storeId % 3 === 0 ? 'pending' : 'approved',
      approvalStatusText: storeId % 3 === 0 ? 'Chờ duyệt' : 'Đã phê duyệt',
      documentNumber: `GPKD-HCM-2018-${(storeId * 1000 + 567).toString().padStart(6, '0')}`,
      issueDate: '15/3/2018',
      expiryDate: '15/3/2025',
      issuingAuthority: 'Sở KH&ĐT Hà Nội',
      notes: completionLevel === 1 ? 'Sắp hết hạn, cần gia hạn trong 45 ngày' : '',
      fileUrl: businessLicenseImage,
      fileName: 'giay-phep-kinh-doanh.pdf',
      uploadDate: '08/01/2025 14:20',
      uploadedBy: 'Trần Thị B',
    },
    {
      id: `${storeId}-lease-contract`,
      type: 'lease-contract',
      title: 'Hợp đồng thuê mặt bằng',
      status: completionLevel === 2 ? 'missing' : 'valid',
      statusText: completionLevel === 2 ? undefined : 'Còn hiệu lực',
      ...(completionLevel === 2 ? {} : {
        approvalStatus: 'approved' as const,
        approvalStatusText: 'Đã phê duyệt',
        documentNumber: `HĐ-MB-2023-${storeId.toString().padStart(5, '0')}`,
        issueDate: '01/01/2023',
        expiryDate: '01/01/2026',
        issuingAuthority: 'Công ty TNHH Bất động sản ABC',
        notes: '',
        fileUrl: leaseContractImage,
        fileName: 'hop-dong-thue-mb.pdf',
        uploadDate: '05/01/2025 10:15',
        uploadedBy: 'Lê Văn C',
      }),
    },
    {
      id: `${storeId}-food-safety`,
      type: 'food-safety',
      title: 'Giấy chứng nhận ATTP',
      status: 'valid',
      statusText: 'Còn hiệu lực',
      approvalStatus: storeId % 2 === 0 ? 'pending' : 'approved',
      approvalStatusText: storeId % 2 === 0 ? 'Chờ duyệt' : 'Đã phê duyệt',
      documentNumber: `ATTP-HCM-2024-${(storeId * 100 + 789).toString().padStart(5, '0')}`,
      issueDate: '10/01/2024',
      expiryDate: '10/01/2026',
      issuingAuthority: 'Chi cục ATTP Hà Nội',
      notes: '',
      fileUrl: foodSafetyImage,
      fileName: 'chung-nhan-attp.pdf',
      uploadDate: '12/01/2025 16:45',
      uploadedBy: 'Phạm Thị D',
    },
    {
      id: `${storeId}-specialized-license`,
      type: 'specialized-license',
      title: 'Giấy phép chuyên ngành',
      status: completionLevel === 3 ? 'missing' : 'valid',
      statusText: completionLevel === 3 ? undefined : 'Còn hiệu lực',
      ...(completionLevel === 3 ? {} : {
        approvalStatus: 'approved' as const,
        approvalStatusText: 'Đã phê duyệt',
        documentNumber: `GPCN-2023-${storeId.toString().padStart(5, '0')}`,
        issueDate: '20/06/2023',
        expiryDate: '20/06/2026',
        issuingAuthority: 'Sở Y tế Hà Nội',
        notes: '',
        fileUrl: specializedLicenseImage,
        fileName: 'giay-phep-chuyen-nganh.pdf',
        uploadDate: '03/01/2025 11:00',
        uploadedBy: 'Hoàng Văn E',
      }),
    },
    {
      id: `${storeId}-fire-safety`,
      type: 'fire-safety',
      title: 'Giấy phép PCCC',
      status: completionLevel >= 2 ? 'missing' : 'valid',
      statusText: completionLevel >= 2 ? undefined : 'Còn hiệu lực',
      ...(completionLevel >= 2 ? {} : {
        approvalStatus: 'approved' as const,
        approvalStatusText: 'Đã phê duyệt',
        documentNumber: `PCCC-Q${storeId % 12 + 1}-2024-${storeId.toString().padStart(4, '0')}`,
        issueDate: '01/04/2024',
        expiryDate: '01/04/2027',
        issuingAuthority: `Phòng Cảnh sát PCCC Phường ${storeId % 12 + 1}`,
        notes: '',
        fileUrl: fireSafetyImage,
        fileName: 'giay-phep-pccc.pdf',
        uploadDate: '07/01/2025 13:30',
        uploadedBy: 'Vũ Thị F',
      }),
    },
  ];

  return baseDocuments;
};
