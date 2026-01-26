# API Tạo Merchant Mới - Hướng Dẫn Tích Hợp

## Tổng Quan

Form "Thêm Mới Cơ Sở" đã được tích hợp với API tạo merchant mới từ Supabase RPC endpoint.

## API Endpoint

**URL:** `POST https://mwuhuixkybbwrnoqcibg.supabase.co/rest/v1/rpc/create_merchant_full`

**Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer sb_publishable_oURI60lA6Y7EiO4LUvqVxQ_9XqLea8P",
  "apikey": "sb_publishable_oURI60lA6Y7EiO4LUvqVxQ_9XqLea8P",
  "Prefer": "return=representation"
}
```

## Hàm API

**Vị trí:** `src/utils/api/storesApi.ts`

```typescript
export async function createMerchant(data: {
  p_business_name: string;
  p_owner_name: string;
  p_owner_phone: string;
  p_license_status?: string;
  p_tax_code: string;
  p_business_type: string;
  p_province_id: string;
  p_ward_id: string;
  p_address: string;
  p_latitude: number;
  p_longitude: number;
  p_status?: string;
  p_established_date?: string;
  p_fax?: string;
  p_department_id: string;
  p_note?: string;
  p_business_phone?: string;
  p_business_email?: string;
  p_website?: string;
  p_store_area?: number;
  p_owner_phone_2?: string;
  p_owner_birth_year?: number;
  p_owner_identity_no?: string;
  p_owner_email?: string;
}): Promise<any>
```

## Mapping Fields

### Form → API Payload

| Form Field | API Field | Kiểu | Ghi Chú |
|---|---|---|---|
| `business_name` | `p_business_name` | string | Tên doanh nghiệp |
| `ownerName` | `p_owner_name` | string | Tên chủ hộ |
| `ownerPhone` | `p_owner_phone` | string | SĐT chủ hộ |
| `taxCode` | `p_tax_code` | string | Mã số thuế |
| `industryName` | `p_business_type` | string | Loại hình kinh doanh |
| `province` | `p_province_id` | string | ID tỉnh/thành phố |
| `ward` | `p_ward_id` | string | ID phường/xã |
| `registeredAddress` | `p_address` | string | Địa chỉ đăng ký |
| `latitude` | `p_latitude` | number | Vĩ độ |
| `longitude` | `p_longitude` | number | Kinh độ |
| `status` | `p_status` | string | Trạng thái (pending, active, etc.) |
| `establishedDate` | `p_established_date` | string | Ngày thành lập (YYYY-MM-DD) |
| `fax` | `p_fax` | string | Fax |
| `notes` | `p_note` | string | Ghi chú |
| `businessPhone` | `p_business_phone` | string | SĐT kinh doanh |
| `email` | `p_business_email` | string | Email kinh doanh |
| `website` | `p_website` | string | Website |
| `businessArea` | `p_store_area` | number | Diện tích cửa hàng (m²) |
| `ownerPhone2` | `p_owner_phone_2` | string | SĐT chủ hộ thứ 2 |
| `ownerBirthYear` | `p_owner_birth_year` | number | Năm sinh chủ hộ |
| `ownerIdNumber` | `p_owner_identity_no` | string | Số CMTND/CCCD |

### Fixed Values

- **`p_license_status`**: `"valid"` (mặc định)
- **`p_department_id`**: `"0c081448-e64b-4d8e-a332-b79f743823c7"` (ID phòng ban mặc định)
- **`p_owner_email`**: `undefined` (không có trong form hiện tại)

## Quy Trình Tạo Merchant

1. **User điền form** → AddStoreDialogTabbed nhận dữ liệu
2. **Validate dữ liệu** → Check các trường bắt buộc
3. **Map sang API payload** → Convert form data → p_* fields
4. **Call API** → `createMerchant(payload)`
5. **Success:** 
   - Thêm merchant vào local stores list
   - Show toast success
   - Reload trang 1
   - Close dialog
6. **Error:**
   - Show toast error với message từ API
   - Keep dialog mở để retry

## Xử Lý Lỗi

Nếu API trả về lỗi:
- Log chi tiết vào console
- Show user-friendly error message
- Allow retry mà không mất dữ liệu

## Ví Dụ Payload

```json
{
  "p_business_name": "Công ty TNHH ABC",
  "p_owner_name": "Nguyễn Văn Trí",
  "p_owner_phone": "0978955252",
  "p_license_status": "valid",
  "p_tax_code": "6546816574",
  "p_business_type": "retail",
  "p_province_id": "82c5014d-0a8b-46db-9d0d-c049888abbaf",
  "p_ward_id": "11a15e36-1c7d-4203-8eb7-a0baa248f6e4",
  "p_address": "Ngõ 165 Hồ Tùng Mậu",
  "p_latitude": 10.776889,
  "p_longitude": 106.700806,
  "p_status": "pending",
  "p_established_date": "2020-05-20",
  "p_fax": "02839112233",
  "p_department_id": "0c081448-e64b-4d8e-a332-b79f743823c7",
  "p_note": "Khách ưu tiên",
  "p_business_phone": "02838234567",
  "p_business_email": "contact@abc.com",
  "p_website": "https://abc.com",
  "p_store_area": 120.5,
  "p_owner_phone_2": "0907654321",
  "p_owner_birth_year": 1988,
  "p_owner_identity_no": "079123456789"
}
```

## Files Được Chỉnh Sửa

1. **`src/utils/api/storesApi.ts`** - Thêm hàm `createMerchant()`
2. **`src/pages/StoresListPage.tsx`** - Cập nhật onSubmit handler của AddStoreDialogTabbed
   - Import `createMerchant`
   - Tạo API payload từ form data
   - Call API khi submit
   - Handle success/error responses

## Lưu Ý

- Form UI **không thay đổi**, chỉ thay đổi backend logic
- Dữ liệu vẫn được lưu vào localStorage để backup offline
- Merchant được tạo với status `"pending"` mặc định
- Department ID cố định (có thể thay đổi theo config sau)

## Troubleshooting

### "Failed to create merchant: 401"
- Kiểm tra API key có hợp lệ không
- Kiểm tra Authorization header

### "Failed to create merchant: 400"
- Kiểm tra required fields: p_business_name, p_tax_code, p_address, v.v.
- Kiểm tra format của p_latitude, p_longitude (phải là numbers)
- Kiểm tra format p_established_date (YYYY-MM-DD)

### Merchant không xuất hiện trong list
- Refresh page
- Kiểm tra browser console logs
- Kiểm trap Supabase dashboard → merchants table
