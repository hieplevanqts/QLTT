import { axiosInstance } from './axiosInstance';

export interface ExtractedData {
    success: boolean;
    data?: Record<string, any>;
    confidence?: number;
    message?: string;
}

// Convert file to base64
const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const result = reader.result as string;
            // Remove data URL prefix (e.g., "data:image/jpeg;base64,")
            const base64 = result.split(',')[1];
            resolve(base64);
        };
        reader.onerror = (error) => reject(error);
    });
};

export const callOcrCccdApi = async (frontFile: File, backFile: File): Promise<ExtractedData> => {
    console.log(`🤖 [OCR API] Starting extraction for CCCD`);

    try {
        const [frontBase64, backBase64] = await Promise.all([
            fileToBase64(frontFile),
            fileToBase64(backFile)
        ]);

        const payload = {
            images: [
                { type: 'base64', value: frontBase64 },
                { type: 'base64', value: backBase64 }
            ]
        };

        const response = await axiosInstance.post(
            'https://ocr-couppa-gpkd.vhv.vn/ocr-cccd',
            payload,
            {
                headers: {
                    'x-api-key': 'sk-QA4-3eb44f0cdfaggjj64kgfd123ADSW',
                    'Content-Type': 'application/json'
                }
            }
        );


        if (response.data && response.data.success) {
            const ocrData = response.data.data;

            // Map response to form fields matching documentTypes.ts
            const mappedData: Record<string, any> = {
                idNumber: ocrData.id,
                fullName: ocrData.full_name,
                // Convert DD/MM/YYYY to YYYY-MM-DD
                dateOfBirth: ocrData.date_of_birth ? convertDate(ocrData.date_of_birth) : '',
                address: ocrData.place_of_residence,
                issuePlace: ocrData.place_of_issue,
                // Optional/Extra fields
                placeOfOrigin: ocrData.place_of_origin,
                expiryDate: ocrData.date_of_expiry ? convertDate(ocrData.date_of_expiry) : '',
                sex: ocrData.sex,
                nationality: ocrData.nationality,
            };

            console.log('✅ [OCR API] Extraction successful:', mappedData);

            return {
                success: true,
                data: mappedData,
                message: 'Trích xuất dữ liệu thành công'
            };
        } else {
            return {
                success: false,
                message: 'Không thể nhận diện CCCD. Vui lòng kiểm tra ảnh rõ nét và thử lại.'
            };
        }
    } catch (error) {
        console.error('❌ [OCR API] Error calling OCR:', error);
        return {
            success: false,
            message: 'Lỗi kết nối đến dịch vụ nhận diện (Timeout hoặc lỗi mạng).'
        };
    }
};

const convertDate = (dateStr: string): string => {
    if (!dateStr) return '';
    // Handle DD/MM/YYYY
    if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateStr)) {
        const parts = dateStr.split('/');
        if (parts.length === 3) {
            const [day, month, year] = dateStr.split('/');
            return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        }
    }
    return dateStr;
};

// Keep old function for compatibility if needed, or remove?
// Plan said remove mock. I'll replace it entirely but export old name if I don't change usage sites yet?
// Actually I will change usage site.
