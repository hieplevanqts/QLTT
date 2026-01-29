
// Mock OCR API to simulate extracting data from documents
// In a real application, this would call an external AI service (like Google Cloud Vision, AWS Textract, or FPT.AI)

export interface ExtractedData {
    success: boolean;
    data?: Record<string, any>;
    confidence?: number;
    message?: string;
}

export const extractDocumentData = async (file: File, documentType: string): Promise<ExtractedData> => {
    console.log(`🤖 [OCR API] Starting extraction for ${file.name} (Type: ${documentType})`);

    // Simulate network delay (1.5 - 3 seconds)
    const delay = 1500 + Math.random() * 1500;
    await new Promise(resolve => setTimeout(resolve, delay));

    // Determine if we should succeed (mostly yes for demo)
    const isSuccess = Math.random() > 0.1;

    if (!isSuccess) {
        return {
            success: false,
            message: 'Không thể nhận diện văn bản rõ ràng. Vui lòng thử lại với ảnh chất lượng cao hơn.'
        };
    }

    // Generate mock data based on document type
    let mockData: Record<string, any> = {};

    switch (documentType) {
        case 'cccd':
            mockData = {
                idNumber: `0${Math.floor(Math.random() * 100000000000).toString().padStart(11, '0')}`,
                fullName: 'NGUYỄN VĂN MẪU',
                dateOfBirth: '1990-01-01',
                sex: 'Nam',
                nationality: 'Việt Nam',
                placeOfOrigin: 'Hà Nội',
                placeOfResidence: '123 Đường ABC, Phường XYZ, Quận 1, TP.HCM',
                issueDate: `202${Math.floor(Math.random() * 4)}-0${Math.floor(Math.random() * 9) + 1}-15`,
                expiryDate: '2040-01-01',
                issuePlace: 'Cục Cảnh sát ĐKQL cư trú và DLQG về dân cư'
            };
            break;

        case 'business-license':
            mockData = {
                licenseNumber: `031${Math.floor(Math.random() * 1000000).toString().padStart(7, '0')}`,
                businessName: 'HỘ KINH DOANH CỬA HÀNG MẪU',
                address: '456 Đường DEF, Phường GHI, Quận 3, TP.HCM',
                issueDate: `202${Math.floor(Math.random() * 3)}-05-20`,
                issuingAuthority: 'Phòng Tài chính - Kế hoạch Quận 3',
                businessScope: 'Bán lẻ thực phẩm, đồ uống'
            };
            break;

        case 'food-safety':
            mockData = {
                certificateNumber: `${Math.floor(Math.random() * 1000)}/2024/ATTP-CN`,
                issueDate: '2024-02-15',
                expiryDate: '2027-02-15',
                issuingAuthority: 'Chi cục An toàn vệ sinh thực phẩm TP.HCM',
                scope: 'Kinh doanh dịch vụ ăn uống'
            };
            break;

        default:
            // Generic fallback
            mockData = {
                notes: 'Dữ liệu được trích xuất tự động từ hình ảnh.',
                issueDate: new Date().toISOString().split('T')[0]
            };
    }

    console.log('✅ [OCR API] Extraction successful:', mockData);

    return {
        success: true,
        data: mockData,
        confidence: 0.85 + Math.random() * 0.14, // 85% - 99%
        message: 'Trích xuất dữ liệu thành công'
    };
};
