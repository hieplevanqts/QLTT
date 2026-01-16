/**
 * Form Criteria Templates - Data mẫu cho tiêu chí kiểm tra nghiệp vụ
 * 
 * Định nghĩa các tiêu chí kiểm tra cho các chuyên đề cụ thể
 * trong hệ thống quản lý thông tin MAPPA
 */

export type InputType = 
  | 'CHECKBOX' 
  | 'FILE_UPLOAD' 
  | 'PHOTO_CAPTURE' 
  | 'DROPDOWN' 
  | 'TEXTAREA' 
  | 'TEXT_INPUT'
  | 'DATE_PICKER'
  | 'NUMBER_INPUT'
  | 'RADIO'
  | 'SIGNATURE';

export type RequiredType = 'BẮT BUỘC' | 'TÙY CHỌN';

export interface FormCriterion {
  id: string;
  code: string;
  name: string;
  description: string;
  inputType: InputType;
  required: RequiredType;
  completionRule: string;
  order: number;
  defaultValue?: string;
  options?: string[]; // For DROPDOWN, RADIO
}

export interface FormTemplate {
  id: string;
  code: string;
  name: string;
  description?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  createdBy: string;
  criteria: FormCriterion[];
}

/**
 * Template 1: Kiểm tra Cơ sở Kinh doanh Hàng giả
 */
export const COUNTERFEIT_GOODS_TEMPLATE: FormTemplate = {
  id: 'TEMP_001',
  code: 'KT_HANG_GIA',
  name: 'Kiểm tra Cơ sở Kinh doanh Hàng giả',
  description: 'Biểu mẫu kiểm tra nghiệp vụ cho chuyên đề kiểm tra cơ sở kinh doanh hàng giả, hàng nhái, hàng vi phạm quyền sở hữu trí tuệ',
  status: 'active',
  createdAt: '2024-01-15 08:30:00',
  createdBy: 'Admin',
  criteria: [
    {
      id: 'CRIT_001',
      code: 'STEP_01',
      name: 'Xác nhận địa điểm kiểm tra',
      description: 'Xác nhận cán bộ đã đến đúng địa chỉ cơ sở cần kiểm tra theo kế hoạch. Đối chiếu với GPS và thông tin hồ sơ.',
      inputType: 'CHECKBOX',
      required: 'BẮT BUỘC',
      completionRule: 'Phải tích chọn để xác nhận đến đúng địa điểm',
      order: 1,
    },
    {
      id: 'CRIT_002',
      code: 'STEP_02',
      name: 'Chụp ảnh biển hiệu cơ sở',
      description: 'Chụp ảnh biển hiệu, bảng tên của cơ sở kinh doanh từ ít nhất 2 góc độ khác nhau. Đảm bảo ảnh rõ nét, đầy đủ ánh sáng.',
      inputType: 'PHOTO_CAPTURE',
      required: 'BẮT BUỘC',
      completionRule: 'Tối thiểu 2 ảnh, dung lượng mỗi ảnh không quá 5MB',
      order: 2,
    },
    {
      id: 'CRIT_003',
      code: 'STEP_03',
      name: 'Chụp ảnh tổng quan cơ sở',
      description: 'Chụp ảnh tổng quan bên ngoài và bên trong cơ sở, bao gồm mặt tiền, khu vực bày bán hàng hóa, kho chứa (nếu có).',
      inputType: 'PHOTO_CAPTURE',
      required: 'BẮT BUỘC',
      completionRule: 'Tối thiểu 3 ảnh (mặt tiền, khu bày bán, khu kho)',
      order: 3,
    },
    {
      id: 'CRIT_004',
      code: 'STEP_04',
      name: 'Gặp gỡ chủ cơ sở / người đại diện',
      description: 'Xác nhận đã gặp chủ cơ sở hoặc người được ủy quyền đại diện hợp pháp. Ghi nhận thông tin liên hệ.',
      inputType: 'CHECKBOX',
      required: 'BẮT BUỘC',
      completionRule: 'Phải xác nhận đã gặp đại diện hợp pháp',
      order: 4,
    },
    {
      id: 'CRIT_005',
      code: 'STEP_05',
      name: 'Thông tin người đại diện',
      description: 'Nhập họ tên, số CMND/CCCD, số điện thoại của người đại diện cơ sở. Chụp ảnh giấy tờ tùy thân.',
      inputType: 'TEXT_INPUT',
      required: 'BẮT BUỘC',
      completionRule: 'Nhập đầy đủ: Họ tên, CMND/CCCD (9-12 số), SĐT (10 số)',
      order: 5,
    },
    {
      id: 'CRIT_006',
      code: 'STEP_06',
      name: 'Kiểm tra Giấy phép kinh doanh',
      description: 'Kiểm tra Giấy chứng nhận đăng ký kinh doanh hoặc Giấy phép kinh doanh có điều kiện (nếu áp dụng). Chụp ảnh giấy phép.',
      inputType: 'DROPDOWN',
      required: 'BẮT BUỘC',
      completionRule: 'Chọn 1 trong các tùy chọn',
      order: 6,
      options: [
        'Có giấy phép hợp lệ',
        'Có giấy phép nhưng hết hạn',
        'Không có giấy phép',
        'Không kiểm tra được',
      ],
    },
    {
      id: 'CRIT_007',
      code: 'STEP_07',
      name: 'Upload ảnh Giấy phép kinh doanh',
      description: 'Upload ảnh hoặc file scan Giấy phép kinh doanh (nếu có). File định dạng JPG, PNG hoặc PDF.',
      inputType: 'FILE_UPLOAD',
      required: 'TÙY CHỌN',
      completionRule: 'File không quá 10MB, định dạng JPG/PNG/PDF',
      order: 7,
    },
    {
      id: 'CRIT_008',
      code: 'STEP_08',
      name: 'Danh sách hàng hóa kinh doanh',
      description: 'Liệt kê các nhóm hàng hóa chính mà cơ sở đang kinh doanh (ví dụ: quần áo, giày dép, mỹ phẩm, điện tử...).',
      inputType: 'TEXTAREA',
      required: 'BẮT BUỘC',
      completionRule: 'Nhập tối thiểu 20 ký tự, mô tả rõ ràng',
      order: 8,
    },
    {
      id: 'CRIT_009',
      code: 'STEP_09',
      name: 'Phát hiện hàng nghi ngờ giả',
      description: 'Cán bộ có phát hiện hàng hóa nghi ngờ giả, hàng nhái, hàng xâm phạm quyền sở hữu trí tuệ hay không?',
      inputType: 'RADIO',
      required: 'BẮT BUỘC',
      completionRule: 'Chọn 1 tùy chọn',
      order: 9,
      options: [
        'Có phát hiện',
        'Không phát hiện',
        'Chưa rõ ràng, cần xác minh thêm',
      ],
    },
    {
      id: 'CRIT_010',
      code: 'STEP_10',
      name: 'Chụp ảnh hàng nghi ngờ giả',
      description: 'Nếu phát hiện hàng nghi ngờ, chụp ảnh chi tiết sản phẩm, tem nhãn, logo, bao bì. Chụp cả góc độ tổng thể và cận cảnh.',
      inputType: 'PHOTO_CAPTURE',
      required: 'TÙY CHỌN',
      completionRule: 'Tối thiểu 3 ảnh nếu có phát hiện',
      order: 10,
    },
    {
      id: 'CRIT_011',
      code: 'STEP_11',
      name: 'Mô tả chi tiết hàng nghi ngờ',
      description: 'Mô tả chi tiết về hàng hóa nghi ngờ: tên sản phẩm, nhãn hiệu, xuất xứ ghi trên bao bì, số lượng ước tính, giá bán.',
      inputType: 'TEXTAREA',
      required: 'TÙY CHỌN',
      completionRule: 'Nhập tối thiểu 50 ký tự nếu có phát hiện',
      order: 11,
    },
    {
      id: 'CRIT_012',
      code: 'STEP_12',
      name: 'Lập biên bản tạm giữ',
      description: 'Cán bộ có lập biên bản tạm giữ hàng hóa vi phạm hay không?',
      inputType: 'RADIO',
      required: 'BẮT BUỘC',
      completionRule: 'Chọn 1 tùy chọn',
      order: 12,
      options: [
        'Có lập biên bản',
        'Không lập biên bản',
        'Chờ xác minh thêm',
      ],
    },
    {
      id: 'CRIT_013',
      code: 'STEP_13',
      name: 'Upload biên bản tạm giữ',
      description: 'Upload file scan hoặc ảnh biên bản tạm giữ (nếu có). Đảm bảo chữ ký và đóng dấu rõ ràng.',
      inputType: 'FILE_UPLOAD',
      required: 'TÙY CHỌN',
      completionRule: 'File không quá 10MB, định dạng PDF hoặc ảnh JPG/PNG',
      order: 13,
    },
    {
      id: 'CRIT_014',
      code: 'STEP_14',
      name: 'Kết luận kiểm tra',
      description: 'Nhận xét tổng quan về tình trạng cơ sở, mức độ tuân thủ pháp luật, đề xuất biện pháp xử lý (nếu có).',
      inputType: 'TEXTAREA',
      required: 'BẮT BUỘC',
      completionRule: 'Nhập tối thiểu 100 ký tự, mô tả chi tiết',
      order: 14,
    },
    {
      id: 'CRIT_015',
      code: 'STEP_15',
      name: 'Chữ ký xác nhận',
      description: 'Chữ ký điện tử của cán bộ thực hiện kiểm tra để xác nhận tính xác thực của thông tin đã nhập.',
      inputType: 'SIGNATURE',
      required: 'BẮT BUỘC',
      completionRule: 'Phải có chữ ký điện tử',
      order: 15,
    },
  ],
};

/**
 * Template 2: Kiểm tra An toàn Thực phẩm
 */
export const FOOD_SAFETY_TEMPLATE: FormTemplate = {
  id: 'TEMP_002',
  code: 'KT_ATVSTP',
  name: 'Kiểm tra An toàn Vệ sinh Thực phẩm',
  description: 'Biểu mẫu kiểm tra cơ sở sản xuất, kinh doanh thực phẩm theo quy định về ATVS thực phẩm',
  status: 'active',
  createdAt: '2024-01-15 09:00:00',
  createdBy: 'Admin',
  criteria: [
    {
      id: 'CRIT_101',
      code: 'FS_01',
      name: 'Giấy chứng nhận ATVS thực phẩm',
      description: 'Kiểm tra Giấy chứng nhận cơ sở đủ điều kiện ATVS thực phẩm',
      inputType: 'DROPDOWN',
      required: 'BẮT BUỘC',
      completionRule: 'Chọn trạng thái giấy phép',
      order: 1,
      options: ['Có giấy hợp lệ', 'Giấy hết hạn', 'Không có giấy', 'Đang chờ cấp'],
    },
    {
      id: 'CRIT_102',
      code: 'FS_02',
      name: 'Điều kiện cơ sở vật chất',
      description: 'Đánh giá điều kiện cơ sở: sạch sẽ, thoáng mát, có hệ thống xử lý chất thải',
      inputType: 'RADIO',
      required: 'BẮT BUỘC',
      completionRule: 'Chọn mức độ đánh giá',
      order: 2,
      options: ['Đạt yêu cầu', 'Đạt một phần', 'Không đạt'],
    },
    {
      id: 'CRIT_103',
      code: 'FS_03',
      name: 'Nguồn gốc nguyên liệu',
      description: 'Kiểm tra hóa đơn, chứng từ nguồn gốc nguyên liệu thực phẩm',
      inputType: 'PHOTO_CAPTURE',
      required: 'BẮT BUỘC',
      completionRule: 'Tối thiểu 2 ảnh hóa đơn/chứng từ',
      order: 3,
    },
    {
      id: 'CRIT_104',
      code: 'FS_04',
      name: 'Nhật ký kiểm thực 3 bước',
      description: 'Kiểm tra sổ nhật ký kiểm thực 3 bước (kiểm tra nguồn gốc, cảm quan, lưu mẫu)',
      inputType: 'CHECKBOX',
      required: 'BẮT BUỘC',
      completionRule: 'Xác nhận có sổ nhật ký đầy đủ',
      order: 4,
    },
    {
      id: 'CRIT_105',
      code: 'FS_05',
      name: 'Nhân viên có chứng chỉ ATVS',
      description: 'Số lượng nhân viên đã qua đào tạo và có chứng chỉ ATVS thực phẩm',
      inputType: 'NUMBER_INPUT',
      required: 'BẮT BUỘC',
      completionRule: 'Nhập số nguyên >= 0',
      order: 5,
    },
    {
      id: 'CRIT_106',
      code: 'FS_06',
      name: 'Kết luận chung',
      description: 'Kết luận tổng quan và đề xuất xử lý',
      inputType: 'TEXTAREA',
      required: 'BẮT BUỘC',
      completionRule: 'Nhập tối thiểu 50 ký tự',
      order: 6,
    },
  ],
};

/**
 * Template 3: Kiểm tra Kinh doanh Xăng dầu
 */
export const FUEL_BUSINESS_TEMPLATE: FormTemplate = {
  id: 'TEMP_003',
  code: 'KT_XANG_DAU',
  name: 'Kiểm tra Kinh doanh Xăng dầu',
  description: 'Biểu mẫu kiểm tra cửa hàng xăng dầu, đảm bảo chất lượng nhiên liệu và an toàn PCCC',
  status: 'active',
  createdAt: '2024-01-15 09:30:00',
  createdBy: 'Admin',
  criteria: [
    {
      id: 'CRIT_201',
      code: 'FUEL_01',
      name: 'Giấy phép kinh doanh xăng dầu',
      description: 'Kiểm tra Giấy phép kinh doanh xăng dầu do cơ quan có thẩm quyền cấp',
      inputType: 'DROPDOWN',
      required: 'BẮT BUỘC',
      completionRule: 'Chọn trạng thái giấy phép',
      order: 1,
      options: ['Có giấy phép hợp lệ', 'Giấy phép hết hạn', 'Không có giấy phép'],
    },
    {
      id: 'CRIT_202',
      code: 'FUEL_02',
      name: 'Chứng chỉ đo lường',
      description: 'Kiểm tra tem kiểm định đo lường trên các trụ bơm, cột đo',
      inputType: 'PHOTO_CAPTURE',
      required: 'BẮT BUỘC',
      completionRule: 'Chụp ảnh tem kiểm định tất cả trụ bơm',
      order: 2,
    },
  ],
};

/**
 * Danh sách tất cả các template
 */
export const ALL_FORM_TEMPLATES: FormTemplate[] = [
  COUNTERFEIT_GOODS_TEMPLATE,
  FOOD_SAFETY_TEMPLATE,
  FUEL_BUSINESS_TEMPLATE,
];

/**
 * Helper functions
 */
export const getTemplateById = (id: string): FormTemplate | undefined => {
  return ALL_FORM_TEMPLATES.find((t) => t.id === id);
};

export const getTemplateByCode = (code: string): FormTemplate | undefined => {
  return ALL_FORM_TEMPLATES.find((t) => t.code === code);
};

export const getActiveTemplates = (): FormTemplate[] => {
  return ALL_FORM_TEMPLATES.filter((t) => t.status === 'active');
};
