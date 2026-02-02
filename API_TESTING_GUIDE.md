# 🧪 Merchant Flow - API Testing & Verification Guide

## 📊 Step-by-Step Testing

### 🟢 Test Step 1: Navigate từ danh sách → Chi tiết

**Action**: Click vào một merchant bất kỳ trong danh sách

**Expected Console Logs**:
```javascript
// Log 1: Navigate triggered
// Navigate(`/registry/stores/123`)

// Log 2: FullEditRegistryPage loads
📥 [loadStore] Starting to load store: { url_id: "123", timestamp: "..." }

// Log 3: API called
🔍 [fetchStoreById] API returned merchant: {
  url_query_id: 123,
  merchant_id_uuid: "14dd8b16-df2f-47c7-82b2-c251aa109737",
  business_name: "Công ty TNHH ABC",
  numeric_id: 123,
  timestamp: "..."
}

// Log 4: Store loaded
✅ [loadStore] Loaded store from API: {
  numeric_id: 123,
  merchant_id: "14dd8b16-df2f-47c7-82b2-c251aa109737",
  store_name: "Công ty TNHH ABC",
  timestamp: "..."
}
```

**Verify**:
- [ ] Console logs hiển thị `merchant_id: "14dd8b16..."`
- [ ] Form được populate với đầy đủ dữ liệu
- [ ] Không có error

---

### 🟢 Test Step 2: Chỉnh sửa một vài field

**Action**: 
1. Click "Chỉnh sửa"
2. Sửa: Tên cơ sở, Email
3. Nhấn "Xem trước thay đổi"

**Expected**: 
- Form hiển thị thay đổi
- 2 fields changed

**Verify**:
- [ ] Thay đổi được detect
- [ ] "Xem trước thay đổi" button enable

---

### 🟢 Test Step 3: Submit thay đổi

**Action**:
1. Nhấn "Xác nhận và tiếp tục" 
2. Điền lý do
3. Nhấn "Lưu thay đổi"

**Expected Console Logs**:
```javascript
// Log 1: Submission started
🚀 [handleSubmitWithReason] Store edit submission started: {
  numeric_id: 123,
  merchant_id: "14dd8b16-df2f-47c7-82b2-c251aa109737",
  store_name: "Công ty TNHH ABC",
  changed_fields: 2,
  has_sensitive_changes: false,
  timestamp: "..."
}

// Log 2: API called
📤 [handleSubmitWithReason] Calling updateMerchant with payload: {
  merchant_id: "14dd8b16-df2f-47c7-82b2-c251aa109737",
  p_business_name: "Công ty TNHH ABC (Updated)",
  p_province_id: "82c5014d-0a8b-46db-9d0d-c049888abbaf",
  p_ward_id: "11a15e36-1c7d-4203-8eb7-a0baa248f6e4",
  timestamp: "..."
}

// Log 3: updateMerchant called
🚀 [updateMerchant] Calling API: {
  merchant_id: "14dd8b16-df2f-47c7-82b2-c251aa109737",
  endpoint: "/rpc/update_merchant_full",
  fields_updating: 2,
  timestamp: "..."
}

// Log 4: Request payload sent
📤 [updateMerchant] Request payload: {
  p_merchant_id: "14dd8b16-df2f-47c7-82b2-c251aa109737",
  p_business_name: "Công ty TNHH ABC (Updated)",
  p_province_id: "82c5014d-0a8b-46db-9d0d-c049888abbaf",
  p_ward_id: "11a15e36-1c7d-4203-8eb7-a0baa248f6e4",
  timestamp: "..."
}

// Log 5: API Success
✅ [updateMerchant] Success response: {
  merchant_id: "14dd8b16-df2f-47c7-82b2-c251aa109737",
  result: {...},
  timestamp: "..."
}

// Log 6: Store updated
✅ [handleSubmitWithReason] Store Updated via API: {
  merchant_id: "14dd8b16-df2f-47c7-82b2-c251aa109737",
  store_name: "Công ty TNHH ABC",
  timestamp: "..."
}
```

**Verify**:
- [ ] `merchant_id` luôn là UUID (`14dd8b16-...`)
- [ ] `p_merchant_id` trong payload là UUID
- [ ] Success log hiển thị
- [ ] Không có error log

---

## 🔴 Error Cases - Verify Debugging

### ❌ Case 1: Sai merchant_id

**Symptom**: API trả error hoặc update sai record

**Kiểm tra**:
```javascript
// Mở DevTools → Console
// Filter: "merchant_id"
// Verify: Tất cả log có UUID không? Hay có numeric ID?

// ✅ ĐÚNG:
merchant_id: "14dd8b16-df2f-47c7-82b2-c251aa109737"

// ❌ SAI:
merchant_id: 123  // numeric ID!
```

---

### ❌ Case 2: undefined merchantId

**Symptom**: Console log: "⚠️ No merchantId, falling back to mock update"

**Nguyên nhân**: `fetchStoreById` không return `merchantId`

**Fix**: Verify `fetchStoreById` có dòng:
```typescript
merchantId: merchant.id,  // UUID
```

---

### ❌ Case 3: Database update không thay đổi

**Kiểm tra Database**:
```sql
-- SSH vào Supabase hoặc dùng SQL Editor

SELECT 
  id, 
  business_name, 
  owner_name,
  updated_at 
FROM merchants 
WHERE id = '14dd8b16-df2f-47c7-82b2-c251aa109737'
ORDER BY updated_at DESC 
LIMIT 1;
```

**Expected**:
- `updated_at` là thời gian hiện tại
- `business_name` / `owner_name` là giá trị mới

---

## 📋 Complete Flow Checklist

```
┌─ List Click
│  ├─ Log: navigate to /registry/stores/123
│  └─ ✅ Verify: URL correct
│
├─ Detail Page Load
│  ├─ Log: [loadStore] Starting with url_id: "123"
│  ├─ Log: API fetchStoreById called
│  ├─ Log: merchant_id_uuid returned
│  └─ ✅ Verify: merchant_id is UUID
│
├─ Edit Click
│  ├─ Log: navigate to /registry/full-edit/123
│  └─ ✅ Verify: originalStore.merchantId not undefined
│
├─ Form Edit & Submit
│  ├─ Log: [handleSubmitWithReason] submission started
│  ├─ Log: numeric_id + merchant_id both logged
│  └─ ✅ Verify: Both values correct
│
├─ API Call
│  ├─ Log: [updateMerchant] Calling API
│  ├─ Log: p_merchant_id is UUID
│  ├─ Log: Request payload sent
│  └─ ✅ Verify: p_merchant_id is UUID
│
├─ API Response
│  ├─ Log: ✅ Success response
│  ├─ Log: ✅ Store Updated
│  └─ ✅ Verify: No error
│
└─ Database Verify
   ├─ SQL: SELECT ... WHERE id = UUID
   ├─ Check: updated_at is current
   └─ ✅ Verify: Data changed
```

---

## 🔧 How to Debug Live

### Open DevTools
```
Windows/Linux: F12
Mac: Cmd + Option + I
```

### Filter Console Logs
```
1. Open Console tab
2. Click Filter icon (funnel icon)
3. Search: "merchant_id"
4. Will show all merchant_id related logs
```

### Check Network Request
```
1. Open Network tab
2. Filter: "update_merchant_full"
3. Click on request
4. Check:
   - Request body → p_merchant_id
   - Response → success or error
```

### Quick Log Verification
```javascript
// Copy-paste in Console:
console.log('Current logs check:');
console.log('Look for these patterns:');
console.log('✅ numeric_id: 123');
console.log('✅ merchant_id: "14dd8b16-..."');
console.log('✅ p_merchant_id: "14dd8b16-..."');
```

---

## 📝 Expected Log Output (Full Example)

**Paste this in Console to verify all logs:**

```javascript
// Should see something like:

// 1. Navigate to detail
// 📥 [loadStore] Starting to load store: { url_id: "123", ... }

// 2. API fetch
// 🔍 [fetchStoreById] API returned merchant: { 
//   merchant_id_uuid: "14dd8b16-df2f-47c7-82b2-c251aa109737", 
//   ... 
// }

// 3. Load complete
// ✅ [loadStore] Loaded store from API: { 
//   merchant_id: "14dd8b16-df2f-47c7-82b2-c251aa109737", 
//   ... 
// }

// 4. Submit start
// 🚀 [handleSubmitWithReason] Store edit submission started: { 
//   merchant_id: "14dd8b16-df2f-47c7-82b2-c251aa109737", 
//   ... 
// }

// 5. API call
// 🚀 [updateMerchant] Calling API: { 
//   merchant_id: "14dd8b16-df2f-47c7-82b2-c251aa109737", 
//   ... 
// }

// 6. Success
// ✅ [updateMerchant] Success response: { 
//   merchant_id: "14dd8b16-df2f-47c7-82b2-c251aa109737", 
//   ... 
// }
```

---

## 🎯 Success Criteria

✅ **All of these must be true**:

1. Console logs hiển thị UUID (không phải numeric ID) cho merchant_id
2. Database record được update với thời gian hiện tại
3. Data trên form khớp với data trong database
4. Không có error messages
5. Navigation back to detail page work
6. Refresh page → data mới vẫn hiện

---

## 🚨 If Something Goes Wrong

### Scenario 1: "API Error 400 Bad Request"
```
→ Kiểm tra: p_merchant_id có phải UUID không?
→ Kiểm tra: Province/Ward ID có phải UUID không?
→ Logs: Xem request body chứa gì?
```

### Scenario 2: "Database update không thay đổi"
```
→ Kiểm tra: p_merchant_id có match với database ID không?
→ Logs: Xem merchantId được truyền là gì?
→ SQL: SELECT từ database verify record tồn tại
```

### Scenario 3: "Update nhầm record"
```
→ Logs: Check merchant_id ở mỗi step
→ Database: SELECT để xem cái nào được update
→ Check: có phải WHERE clause sai không?
```

---

## 💾 Save This Template

**Copy to use later:**
```markdown
## Test Run - [DATE]

### Merchant Updated
- ID: 
- Numeric ID: 
- Merchant UUID: 
- Fields changed: 
- Result: ✅ Success / ❌ Failed

### Console Logs
- Navigate: ✅
- Load: ✅
- Submit: ✅
- API: ✅

### Database
- Updated at: 
- Record verified: ✅
```
