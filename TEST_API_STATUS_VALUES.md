# Test API Status Values

## API Trả Về Cái Gì?

API merchants endpoint trả về `status` field với các giá trị sau:
```
'active'     → Đang hoạt động
'pending'    → Chờ duyệt
'rejected'   → Tạm ngừng hoạt động
'suspended'  → Ngừng hoạt động
'closed'     → Ngừng hoạt động (closed = permanently closed)
```

## Form Select Hiện Tại Chấp Nhận
```
value: 'active'     → label: 'Đang hoạt động'
value: 'pending'    → label: 'Chờ duyệt'
value: 'rejected'   → label: 'Tạm ngừng hoạt động'
value: 'suspended'  → label: 'Ngừng hoạt động'
value: 'closed'     → label: 'Ngừng hoạt động'
```

## Data Flow

```
API Response (merchant.status)
         ↓
mapStatus() in storesApi
         ↓
Store.status field (FacilityStatus)
         ↓
mapApiStatusToForm() in FullEditRegistryPage
         ↓
formData.operationStatus
         ↓
SelectValue placeholder (displays label)
```

## Cách Test

### 1. Mở Browser DevTools
- F12 → Console tab

### 2. Test từ API Response
Mở Network tab → xem merchants API response:
```json
{
  "status": "active",
  "business_type": "pharmacy",
  "province_id": "...",
  "ward_id": "..."
}
```

### 3. Check Console Logs
Mở edit page, xem logs:
```
✅ Loaded store from API: {status: "active", ...}
📋 Initial form data: {..., operationStatus: "active"}
🔧 Operation Status: active
```

### 4. Kiểm Tra Select Display
Mở edit page, xem trạng thái hoạt động select:
- **Nếu API status = "active"** → SelectValue phải show "Đang hoạt động"
- **Nếu API status = "pending"** → SelectValue phải show "Chờ duyệt"
- **Nếu API status = "rejected"** → SelectValue phải show "Tạm ngừng hoạt động"
- **Nếu API status = "suspended"** → SelectValue phải show "Ngừng hoạt động"
- **Nếu API status = "closed"** → SelectValue phải show "Ngừng hoạt động"

## Debug Script (Copy vào Console)

```javascript
// Check FormData state
console.log('operationStatus value:', formData?.operationStatus);

// Check OPERATION_STATUS_OPTIONS
console.log('OPERATION_STATUS_OPTIONS:', OPERATION_STATUS_OPTIONS);

// Find label for current value
const currentValue = formData?.operationStatus;
const currentLabel = OPERATION_STATUS_OPTIONS?.find(s => s.value === currentValue)?.label;
console.log('Current: value=' + currentValue + ', label=' + currentLabel);

// Check if placeholder is correct
console.log('Expected placeholder:', currentLabel || 'Chọn trạng thái');
```

## Các Trường Hợp Test

### Case 1: Active Store
- API returns: `status: "active"`
- Expected: SelectValue shows "Đang hoạt động"
- formData.operationStatus = "active"

### Case 2: Pending Store  
- API returns: `status: "pending"`
- Expected: SelectValue shows "Chờ duyệt"
- formData.operationStatus = "pending"

### Case 3: Rejected Store
- API returns: `status: "rejected"`
- Expected: SelectValue shows "Tạm ngừng hoạt động"
- formData.operationStatus = "rejected"

### Case 4: Suspended Store
- API returns: `status: "suspended"`
- Expected: SelectValue shows "Ngừng hoạt động"
- formData.operationStatus = "suspended"

### Case 5: Closed Store
- API returns: `status: "closed"`
- Expected: SelectValue shows "Ngừng hoạt động"
- formData.operationStatus = "closed"

## Nếu Không Đúng

Kiểm tra:
1. API response - status field có giá trị không?
2. mapApiStatusToForm - nhận giá trị gì?
3. OPERATION_STATUS_OPTIONS - có option với value đó không?
4. SelectValue placeholder - được set đúng không?

```javascript
// Debug: Check each step
console.log('Step 1 - API status:', merchant.status);
console.log('Step 2 - mapStatus result:', mapStatus(merchant.status));
console.log('Step 3 - mapApiStatusToForm:', mapApiStatusToForm(store.status));
console.log('Step 4 - operationStatus in formData:', formData.operationStatus);
console.log('Step 5 - Find option:', OPERATION_STATUS_OPTIONS.find(s => s.value === formData.operationStatus));
```
