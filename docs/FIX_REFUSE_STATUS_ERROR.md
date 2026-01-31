# Fix: Invalid status "refuse" Error

## Problem
Khi cố gắng chuyển store từ `suspended` → `refuse`, API trả về lỗi:
```
{"code":"P0001","message":"Invalid status: refuse"}
```

## Root Cause
Database constraint trong table `merchants` chỉ cho phép 4 trạng thái:
- `active`
- `pending`
- `suspended`
- `rejected`

Nhưng frontend đã được cập nhật để dùng `refuse` (thay vì `closed`) - giá trị thứ 5 này không có trong constraint.

## Solution

Đã tạo 2 migration files để fix:

### 1. `202601310021_add_refuse_status_to_merchants.sql`
**Purpose**: Cập nhật CHECK constraint trong merchants table

**Changes**:
- Loại bỏ constraint cũ: `merchants_status_check`
- Thêm constraint mới với 5 giá trị hợp lệ:
  - `'active'`, `'pending'`, `'suspended'`, `'rejected'`, `'refuse'`
- Tạo index cho `status` column nếu chưa có

**SQL**:
```sql
ALTER TABLE public.merchants
DROP CONSTRAINT IF EXISTS merchants_status_check;

ALTER TABLE public.merchants
ADD CONSTRAINT merchants_status_check
CHECK (status IN ('active', 'pending', 'suspended', 'rejected', 'refuse'));

CREATE INDEX IF NOT EXISTS idx_merchants_status ON public.merchants(status);
```

### 2. `202601310022_create_update_merchant_status_rpc.sql`
**Purpose**: Tạo/cập nhật RPC function `update_merchant_status`

**Features**:
- Validate status trước khi update
- Support tất cả 5 statuses
- Return JSON response với success flag
- Error handling

**Function signature**:
```sql
update_merchant_status(p_merchant_id uuid, p_status text) RETURNS json
```

## Implementation Steps

1. **Run migrations trong Supabase**:
   - Vào Supabase Dashboard → SQL Editor
   - Copy & paste content từ 2 files migration
   - Chạy lần lượt từ file `202601310021_...` rồi `202601310022_...`

2. **Frontend changes** (đã hoàn thành):
   - ✅ Client-side validation trong `updateMerchantStatus()`
   - ✅ Validation status trước khi gọi API
   - ✅ Detailed error messages

## Verification

Sau khi apply migrations, hãy test:

```javascript
// Test API call
await updateMerchantStatus(merchantId, 'refuse');
```

Kỳ vọng: ✅ Success response với `new_status: 'refuse'`

## Status Mapping Summary

| Code | Vietnamese | Meaning |
|------|-----------|---------|
| `active` | Đang hoạt động | Operating normally |
| `pending` | Chờ xác minh | Waiting for approval |
| `suspended` | Tạm ngưng | Temporarily suspended |
| `rejected` | Từ chối phê duyệt | Application rejected |
| `refuse` | Ngừng hoạt động | **Permanently closed (NEW)** |

## Files Modified

1. **Database**:
   - `supabase/migrations/202601310021_add_refuse_status_to_merchants.sql` (NEW)
   - `supabase/migrations/202601310022_create_update_merchant_status_rpc.sql` (NEW)

2. **Frontend**:
   - `src/utils/api/storesApi.ts`:
     - Added client-side status validation
     - Enhanced error messages
     - Updated JSDoc comments

## Notes

- Migration files are in order (use file number as guide)
- RPC function includes error handling
- Client-side validation prevents invalid requests
- Backward compatible: 'closed' auto-converts to 'refuse'
