# Debug: Form Selects Not Displaying in Edit Full Page

## Vấn đề
Khi mở page chỉnh sửa chi tiết (/registry/stores/:id/full-edit), các select fields không hiển thị dữ liệu:
- Ngành kinh doanh (industryName)
- Trạng thái hoạt động (operationStatus)
- Tỉnh/Thành phố (province)
- Phường/Xã (ward)

## Các Lỗi Gặp & Giải Pháp

### 1. SelectValue Component Sai Cách Sử Dụng
**Lỗi cũ:**
```tsx
<SelectValue placeholder="...">
  {INDUSTRY_CATEGORIES.find(c => c.value === formData.industryName)?.label}
</SelectValue>
```

**Vấn đề:** SelectValue từ shadcn/ui không hỗ trợ children - chỉ hỗ trợ `placeholder` prop.

**Sửa lại:**
```tsx
<SelectValue placeholder={INDUSTRY_CATEGORIES.find(c => c.value === formData.industryName)?.label || 'Chọn...'} />
```

### 2. Form Data Chưa Được Map Đúng
**Lỗi cũ:** Khi load từ mockStores, chỉ set `formData = store` mà không map các field:
- API/mockStore có `type` → form cần `industryName`
- API/mockStore có `status` → form cần `operationStatus`

**Sửa lại:**
```tsx
const initialFormData: Partial<Store> = {
  ...store,
  industryName: store.industryName || store.type || store.businessType || '',
  operationStatus: store.operationStatus || mapApiStatusToForm(store.status),
};
setFormData(initialFormData);
```

### 3. Logging để Debug
Thêm các console.log để track data flow:
```
✅ Loaded store from API: {...}
📋 Initial form data: {...}
🏭 Industry: 'pharmacy'
🔧 Operation Status: 'active'
📍 Setting province to: 'TP. Hồ Chí Minh'
```

## Kiểm Tra Browser Console

Khi mở trang edit, bạn sẽ thấy các logs:

```
✅ Loaded store from API: {name: "Cơ sở X", type: "pharmacy", status: "active", ...}
📋 Initial form data: {..., industryName: "pharmacy", operationStatus: "active"}
🏭 Industry: pharmacy
🔧 Operation Status: active
📍 Setting province to: TP. Hồ Chí Minh
```

**Nếu không thấy logs hoặc thấy lỗi:**
- Kiểm tra Network tab → xem API call fetchStoreById có được gọi không
- Kiểm tra Redux/localStorage xem mappa_stores có dữ liệu không
- Kiểm tra console lỗi

## Cách Kiểm Tra

1. **Mở Developer Tools** (F12)
2. **Vào tab Console**
3. **Mở trang edit:** `/registry/stores/1/full-edit`
4. **Xem logs:**
   - Nếu thấy "✅ Loaded store from API" → dữ liệu từ API
   - Nếu thấy "⚠️ fetchStoreById returned null" → fallback sang localStorage/mockStores
5. **Kiểm tra formData state:**
   ```js
   // Inspect trong React DevTools
   - formData.industryName có giá trị?
   - formData.operationStatus có giá trị?
   - formData.province có giá trị?
   - formData.ward có giá trị?
   ```

## Các Input Fields để Test

### Test 1: Thêm store mới
1. Vào `/registry/stores`
2. Click "Thêm cửa hàng"
3. Điền form → chọn industry, status, province, ward
4. Xem dữ liệu được lưu vào localStorage

### Test 2: Mở edit page
1. Vào `/registry/stores` 
2. Click vào cửa hàng vừa tạo
3. Click "Chỉnh sửa"
4. **Kiểm tra:** Các select fields có hiển thị đúng giá trị không?

### Test 3: Thay đổi select values
1. Trên edit page, click vào "Ngành kinh doanh" dropdown
2. Chọn ngành khác
3. **Kiểm tra:** Placeholder thay đổi thành ngành mới?

## Các Field Mapping

```
API/mockStore          →  Form Field
business_type          →  industryName
status                 →  operationStatus
province (name)        →  province
ward (name)            →  ward
type                   →  industryName (fallback)
```

## INDUSTRY_CATEGORIES Values
```
'retail' → 'Bán lẻ tạp hóa'
'fresh-food' → 'Thực phẩm tươi sống'
'pharmacy' → 'Dược phẩm - Y tế'
... (13 categories total)
```

## OPERATION_STATUS_OPTIONS Values
```
'active' → 'Hoạt động'
'suspended' → 'Tạm ngừng'
'inactive' → 'Không hoạt động'
```

## API Status Mapping
```
API status           →  Form operationStatus
'active'             →  'active' (Hoạt động)
'pending'            →  'suspended' (Tạm ngừng)
'suspended'          →  'suspended' (Tạm ngừng)
'rejected'           →  'inactive' (Không hoạt động)
'closed'             →  'inactive' (Không hoạt động)
```

## Các Thay Đổi Đã Làm

1. ✅ Thêm import `fetchStoreById` từ storesApi
2. ✅ Cập nhật loadStore effect để map industryName, operationStatus
3. ✅ Thêm logging để debug data flow
4. ✅ Sửa SelectValue components từ children → placeholder prop
5. ✅ Đảm bảo formData được set trước khi render

## Nếu Vẫn Không Hoạt Động

1. **Check formData state:**
   ```js
   // Trong React DevTools
   console.log('formData:', formData);
   console.log('industryName:', formData.industryName);
   console.log('operationStatus:', formData.operationStatus);
   ```

2. **Check INDUSTRY_CATEGORIES:**
   ```js
   console.log('Categories:', INDUSTRY_CATEGORIES);
   console.log('Find result:', INDUSTRY_CATEGORIES.find(c => c.value === formData.industryName));
   ```

3. **Check SelectValue rendering:**
   - Mở React DevTools
   - Inspect `<SelectValue>` component
   - Xem props `placeholder` value

4. **Test Select onChange:**
   - Click select dropdown
   - Chọn giá trị khác
   - Xem formData state update hay không
